"""QA of actual builds. Isolated browsers; no forms/live analytics are sent."""
from pathlib import Path
from urllib.parse import urlparse
import json
import sys
from PIL import Image, ImageChops
from playwright.sync_api import sync_playwright

AFTER,BEFORE=[x.rstrip('/') for x in sys.argv[1:3]]
OUT=Path(sys.argv[3]);OUT.mkdir(parents=True,exist_ok=True)
report={'mobile':[],'unchanged_layouts':[],'errors':[],'forms_submitted':0}
NO_MOTION='* {animation:none!important;transition:none!important;scroll-behavior:auto!important}'
OVERFLOW='''root => [...root.querySelectorAll('h1,h2,h3,p,li,button,summary,a,video,img')].filter(el=>{
 if(el.classList.contains('km-status') || !el.getClientRects().length) return false;
 if(el.closest('details:not([open])') && el.tagName!=='SUMMARY') return false;
 const r=el.getBoundingClientRect();return r.left < -1 || r.right > innerWidth+1 || (el.clientWidth>0 && el.scrollWidth>el.clientWidth+2);
}).map(el=>({tag:el.tagName,text:el.textContent.trim().slice(0,80),width:el.clientWidth,scroll:el.scrollWidth}))'''

def safe_route(route):
 if route.request.method not in ('GET','HEAD') or urlparse(route.request.url).hostname not in ('127.0.0.1','localhost'):route.abort()
 else:route.continue_()

def make_context(browser):
 c=browser.new_context(reduced_motion='reduce')
 c.add_init_script('window.__qaGoals=[];window.ym=(...args)=>window.__qaGoals.push(args)')
 c.route('**/*',safe_route);return c

def prepare(context,url,width,label=None):
 page=context.new_page();page.set_viewport_size({'width':width,'height':844})
 page.goto(url,wait_until='networkidle');page.add_style_tag(content=NO_MOTION)
 page.locator('h1').first.wait_for()
 consent=page.get_by_role('button',name='Только необходимые',exact=True)
 if consent.count():
  if label:page.screenshot(path=str(OUT/f'{label}-first-visit-{width}.png'))
  if label=='after':
   failures=page.locator('aside[aria-label="Настройки аналитики"]').evaluate(OVERFLOW)
   assert not failures,f'Consent overflow at {width}: {failures}'
  consent.click()
 return page

def dimensions(page):
 return page.evaluate('''()=>[...document.querySelectorAll('main > section, main h1, main h2, #albums')].map(el=>{const r=el.getBoundingClientRect(),s=getComputedStyle(el);return {tag:el.tagName,text:el.tagName==='SECTION'?'':el.textContent.trim(),x:r.x,y:r.y+scrollY,w:r.width,h:r.height,font:s.fontSize,color:s.color};})''')

def reveal(page):
 page.evaluate('''async()=>{for(let y=0;y<document.body.scrollHeight;y+=600){scrollTo(0,y);await new Promise(r=>setTimeout(r,30));}scrollTo(0,0)}''')
 page.wait_for_timeout(350)

with sync_playwright() as p:
 browser=p.chromium.launch()
 for width in (320,360,390,430,767):
  context=make_context(browser);page=None
  try:
   page=prepare(context,AFTER+'/kindergarten?utm_source=qa&utm_campaign=mobile_v1',width,'after')
   assert page.locator('#albums').count()==1
   assert page.locator('.km-choice').count()==5
   assert page.locator('.km-choice[aria-pressed="true"]').get_attribute('data-album-id')=='ten-pages'
   hero_height=page.locator('.kg-hero').evaluate('el=>el.offsetHeight')
   page.screenshot(path=str(OUT/f'after-hero-{width}.png'))
   page.locator('.kg-hero').screenshot(path=str(OUT/f'after-hero-full-{width}.png'))
   catalog=page.locator('.km-catalog');catalog.scroll_into_view_if_needed()
   closed_height=catalog.evaluate('el=>el.offsetHeight')
   catalog.screenshot(path=str(OUT/f'after-catalog-full-{width}.png'))
   assert not catalog.evaluate(OVERFLOW),f'Catalog overflow {width}: {catalog.evaluate(OVERFLOW)}'
   for album_id,price in [('folder','2 700 ₽'),('trio','2 950 ₽'),('six-pages','3 300 ₽'),('ten-pages','3 900 ₽'),('fourteen-pages','6 500 ₽')]:
    page.locator(f'.km-choice[data-album-id="{album_id}"]').click()
    assert price in page.locator('.km-price').inner_text()
    page.locator('.km-preview img').scroll_into_view_if_needed()
    page.wait_for_function('document.querySelector(".km-preview img")?.naturalWidth>0')
    assert not catalog.evaluate(OVERFLOW),f'Overflow {album_id} at {width}: {catalog.evaluate(OVERFLOW)}'
   page.locator('.km-choice[data-album-id="ten-pages"]').click()
   page.locator('summary',has_text='Что входит в альбом').click()
   assert page.locator('.km-selected details[open]').count()==1
   assert not catalog.evaluate(OVERFLOW),f'Contents overflow {width}'
   page.locator('summary',has_text='Что входит в альбом').click()
   page.locator('summary',has_text='Сравнить все 5 форматов').click()
   assert page.locator('.km-comparison article').count()==5
   assert not catalog.evaluate(OVERFLOW),f'Comparison overflow {width}'
   page.locator('.km-compare-choice').first.click()
   assert page.locator('.km-choice[data-album-id="folder"]').get_attribute('aria-pressed')=='true'
   assert page.locator('.km-catalog-more details[open]').count()==0
   page.wait_for_function('document.activeElement?.id === "km-selected-album"')
   page.locator('.km-choice[data-album-id="ten-pages"]').click()
   page.locator('summary',has_text='Смотреть видео').click()
   assert page.locator('.km-details-body video').get_attribute('controls') is not None
   page.locator('summary',has_text='Смотреть видео').click()
   page.locator('.km-action').click()
   assert urlparse(page.url).fragment=='cta' and 'utm_source=qa' in page.url
   assert any('consultation_click' in args for args in page.evaluate('window.__qaGoals'))
   page.locator('#albums').evaluate('el=>el.scrollIntoView()')
   page.screenshot(path=str(OUT/f'after-catalog-{width}.png'))
   if width in (320,390):
    page.add_style_tag(content='html {font-size:200% !important}')
    assert not catalog.evaluate(OVERFLOW),f'200% text overflow {width}: {catalog.evaluate(OVERFLOW)}'
    page.screenshot(path=str(OUT/f'after-text-200-{width}.png'))
   old=prepare(context,BEFORE+'/kindergarten',width,'before')
   old_hero=old.locator('main > section').first.evaluate('el=>el.offsetHeight')
   old_catalog=old.locator('#albums').evaluate('el=>el.offsetHeight')
   old.screenshot(path=str(OUT/f'before-hero-{width}.png'))
   old.locator('main > section').first.screenshot(path=str(OUT/f'before-hero-full-{width}.png'))
   old.locator('#albums').evaluate('el=>el.scrollIntoView()');old.wait_for_timeout(700)
   old.screenshot(path=str(OUT/f'before-catalog-{width}.png'))
   report['mobile'].append({'width':width,'hero_before':old_hero,'hero_after':hero_height,'catalog_before':old_catalog,'catalog_after':closed_height,'checks':'passed'})
  except Exception as exc:
   report['errors'].append(f'Mobile {width}: {exc}')
   if page:page.screenshot(path=str(OUT/f'failure-{width}.png'))
  finally:context.close()
 for path,width in [('/kindergarten',768),('/kindergarten',1024),('/kindergarten',1440),('/school/4',390),('/school/4',1440),('/school/9-11',390),('/school/9-11',1440)]:
  context=make_context(browser)
  try:
   pairs=[];slug=path.strip('/').replace('/','-')
   for label,url in [('before',BEFORE),('after',AFTER)]:
    page=prepare(context,url+path,width);assert page.locator('.km-catalog').count()==0
    reveal(page);pairs.append(dimensions(page))
    page.screenshot(path=str(OUT/f'{label}-{slug}-{width}.png'),full_page=True,mask=[page.locator('[aria-roledescription="carousel"]')]);page.close()
   assert len(pairs[0])==len(pairs[1]),f'Element count changed {path} {width}'
   for a,b in zip(*pairs):
    for key in ('x','y','w','h'):assert abs(a[key]-b[key])<=1,f'Layout changed {path} {width} {key}: {a} {b}'
    for key in ('tag','text','font','color'):assert a[key]==b[key],f'Content/style changed {path} {width} {key}'
   a=Image.open(OUT/f'before-{slug}-{width}.png').convert('RGB');b=Image.open(OUT/f'after-{slug}-{width}.png').convert('RGB')
   same=a.size==b.size and ImageChops.difference(a,b).getbbox() is None
   report['unchanged_layouts'].append({'path':path,'width':width,'geometry':'passed','pixels_identical_with_carousels_masked':same})
  except Exception as exc:report['errors'].append(f'Regression {path} {width}: {exc}')
  finally:context.close()
 browser.close()
(OUT/'report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(report,ensure_ascii=False,indent=2))
sys.exit(1 if report['errors'] else 0)
