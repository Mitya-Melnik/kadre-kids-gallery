"""Owner's three mobile-only changes against frozen v9; no production requests."""
from pathlib import Path
from urllib.parse import urlparse
import json,sys,traceback,datetime,subprocess
from playwright.sync_api import sync_playwright,expect
BASE='09d2757fd6de2e3a534aa9c7d2677a3c822f470f'
AFTER,BEFORE=sys.argv[1:3];OUT=Path(sys.argv[3]);OUT.mkdir(parents=True,exist_ok=True)
report={'commit':subprocess.check_output(['git','rev-parse','HEAD'],text=True).strip(),'reference':BASE,'checks':[],'errors':[],'live_leads':0}
manifest=json.loads((Path('src/config/kindergartenLayoutPages.ts').read_text().split('= ',1)[1].rstrip().removesuffix(';')).replace(',\n}', '\n}'))
# Reuse only the previously checked preparation/snapshot helpers. No baseline rewriting.
helper=Path('scripts/check-grade4-regression.py').read_text()
assert helper==subprocess.check_output(['git','show',BASE+':scripts/check-grade4-regression.py'],text=True)
helper=helper[helper.index('JS_SNAPSHOT='):helper.index('with sync_playwright() as p:')]
helper=helper.replace('datetime.datetime(2026,10,1,12,','datetime.datetime(2026,10,2,12,')
ns={'datetime':datetime,'urlparse':urlparse};exec(helper,ns)

def allow(route):
 if route.request.method in ('GET','HEAD') and urlparse(route.request.url).hostname in ('127.0.0.1','localhost','fonts.googleapis.com','fonts.gstatic.com'):route.continue_()
 else:route.abort()
def setup(browser,width,url):
 c=browser.new_context(viewport={'width':width,'height':844},device_scale_factor=1,is_mobile=True,has_touch=True,reduced_motion='reduce');c.route('**/*',allow)
 p=c.new_page();p.set_default_timeout(10000);p.goto(url,wait_until='networkidle');p.evaluate('document.fonts.ready')
 button=p.get_by_role('button',name='Только необходимые',exact=True)
 if button.count():button.click()
 p.add_style_tag(content='*{scroll-behavior:auto!important;transition:none!important;animation:none!important}')
 return c,p

def pos(p,selector):
 p.locator(selector).scroll_into_view_if_needed();p.wait_for_timeout(150)
def fit(p,selector):
 assert p.evaluate('document.documentElement.scrollWidth<=innerWidth+1')
 box=p.locator(selector).bounding_box();assert box and box['x']>=-1 and box['x']+box['width']<=p.viewport_size['width']+1,(selector,box)
def image_ok(p,selector):
 p.wait_for_function('(s)=>{const e=document.querySelector(s);return e&&e.complete&&e.naturalWidth>0}',arg=selector)
def shot(p,name,selector=None):
 if selector:pos(p,selector)
 p.screenshot(path=str(OUT/(name+'.png')))
def section_shot(p,name,selector):
 p.locator(selector).screenshot(path=str(OUT/(name+'.png')),style='header.sticky,.fixed{visibility:hidden!important}')
def swipe(c,p,selector):
 pos(p,selector);rail=p.locator(selector);before=rail.evaluate('e=>e.scrollLeft');b=rail.bounding_box();s=c.new_cdp_session(p)
 x,y=b['x']+b['width']*.85,b['y']+min(110,b['height']/2)
 s.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':x,'y':y}]})
 for i in range(1,9):s.send('Input.dispatchTouchEvent',{'type':'touchMove','touchPoints':[{'x':x-b['width']*.08*i,'y':y}]});p.wait_for_timeout(20)
 s.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]});p.wait_for_timeout(350);s.detach()
 assert rail.evaluate('e=>e.scrollLeft')>before+40

with sync_playwright() as pw:
 for engine,width in [('chromium',320),('chromium',360),('chromium',390),('chromium',430),('chromium',767),('webkit',320),('webkit',390)]:
  b=getattr(pw,engine).launch();contexts=[];phase='start'
  try:
   c,p=setup(b,width,AFTER+'/kindergarten');contexts.append(c);errors=[];p.on('pageerror',lambda e:errors.append(str(e)))
   phase='case removal';assert p.locator('#case-kindergarten-108').count()==0;assert p.get_by_role('button',name='Реальный проект',exact=True).count()==0
   assert p.locator('.kg3-gallery').count()==1 and p.locator('.kg3-reviews').count()==1
   phase='twelve designs';pos(p,'#layouts');tabs=p.locator('.kg10-layout-tabs button');assert tabs.count()==12
   designs=list(manifest);indices=range(12) if width==390 else [0,9,11]
   for i in indices:
    tabs.nth(i).click();expect(tabs.nth(i)).to_have_attribute('aria-pressed','true');pos(p,'#kg10-layout-preview');image_ok(p,'#kg10-layout-preview img')
    expected=f'/layouts/{designs[i]}/cover';assert expected in p.locator('#kg10-layout-preview img').get_attribute('src')
    scroll=p.evaluate('scrollY');p.locator('#kg10-layout-preview').click();expect(p.locator('.kg10-layout-sheet')).to_be_visible()
    slides=p.locator('.kg10-layout-sheet .kg7-slide');assert slides.count()==len(manifest[designs[i]])
    sources=slides.locator('img').evaluate_all('els=>els.map(e=>new URL(e.src).pathname)');assert sources==[f'/layouts/{designs[i]}/{n}.webp' for n in manifest[designs[i]]]
    image_ok(p,'.kg10-layout-sheet .kg7-slide:first-child img')
    p.locator('.kg10-layout-sheet .kg7-rail').focus();p.keyboard.press('End');p.wait_for_timeout(220)
    assert p.locator('.kg10-layout-sheet .kg7-swipe').get_attribute('data-current')==str(len(sources)-1)
    image_ok(p,'.kg10-layout-sheet .kg7-slide:last-child img');fit(p,'.kg10-layout-sheet')
    p.get_by_role('button',name='Закрыть макет',exact=True).click();expect(p.locator('#kg10-layout-preview')).to_be_focused();assert abs(p.evaluate('scrollY')-scroll)<2
   tabs.first.click();pos(p,'#layouts');fit(p,'#layouts')
   if engine=='chromium' and width==390:
    shot(p,'kindergarten-layouts-phone','#layouts');section_shot(p,'kindergarten-layouts-block','#layouts')
    p.locator('#kg10-layout-preview').click();shot(p,'kindergarten-spreads-phone')
    for i in range(4):
     shot(p,f'spread-{i+1}')
     p.locator('.kg10-layout-sheet').get_by_role('button',name='Следующая карточка').click();p.wait_for_timeout(120)
    p.get_by_role('button',name='Закрыть макет',exact=True).click();p.locator('#kg10-layout-preview').click();swipe(c,p,'.kg10-layout-sheet .kg7-rail');p.keyboard.press('Escape')
   if width in (320,390):
    phase='large text';p.add_style_tag(content='html{font-size:200%!important}');pos(p,'#layouts');fit(p,'#layouts');fit(p,'.kg10-layout-tabs')
    p.locator('#kg10-layout-preview').click();fit(p,'.kg10-layout-sheet');p.get_by_role('button',name='Закрыть макет',exact=True).click();p.add_style_tag(content='html{font-size:100%!important}')
   phase='school decorative benefits'
   for path,slug in [('/school/4','school-4'),('/school/9-11','school-9-11')]:
    cs,ps=setup(b,width,AFTER+path);contexts.append(cs)
    cb,pb=setup(b,width,BEFORE+path);contexts.append(cb)
    icons=ps.locator('.g4-benefit-icon');assert icons.all_text_contents()==['🖼️','📷','🎁','📄'];assert icons.count()==4
    assert ps.locator('.g4-hero-benefits p > span:last-child').all_text_contents()==pb.locator('.g4-hero-benefits p > span:last-child').all_text_contents()
    pos(ps,'.g4-hero-benefits');fit(ps,'.g4-hero-benefits')
    if engine=='chromium' and width==390:section_shot(ps,slug+'-benefits','.g4-hero-benefits');section_shot(ps,slug+'-hero','#hero')
    if width in (320,390):ps.add_style_tag(content='html{font-size:200%!important}');pos(ps,'.g4-hero-benefits');fit(ps,'.g4-hero-benefits')
    cs.close();cb.close();contexts.remove(cs);contexts.remove(cb)
   assert not errors,errors;report['checks'].append({'engine':engine,'width':width,'success':True})
  except Exception:
   report['errors'].append({'engine':engine,'width':width,'phase':phase,'trace':traceback.format_exc()})
   try:p.screenshot(path=str(OUT/f'failure-{engine}-{width}.png'))
   except Exception:pass
  finally:
   for c in contexts:c.close()
   b.close();(OUT/'qa-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))

 # Strict cumulative desktop check against v9, including active case and original layout grid.
 b=pw.chromium.launch();reg={'reference':BASE,'screens':[],'errors':[]};from PIL import Image;import numpy as np
 for route,width in [(r,w) for r in ['/kindergarten','/school/4','/school/9-11'] for w in [768,1024,1440]]+[('/albums',390),('/albums',1440),('/',390),('/',1440)]:
  contexts=[];key=(route.strip('/').replace('/','-') or 'home')+'-'+str(width)
  try:
   cb,pb,eb,_=ns['prepare'](b,int(urlparse(BEFORE).port),route,width);contexts.append(cb)
   ca,pa,ea,_=ns['prepare'](b,int(urlparse(AFTER).port),route,width);contexts.append(ca)
   changes=ns['diff_nodes'](pb.evaluate(ns['JS_SNAPSHOT']),pa.evaluate(ns['JS_SNAPSHOT']))
   (OUT/(key+'-diff.json')).write_text(json.dumps(changes,ensure_ascii=False,indent=2))
   pb.screenshot(path=str(OUT/(key+'-before.png')),full_page=True);pa.screenshot(path=str(OUT/(key+'-after.png')),full_page=True)
   a=np.asarray(Image.open(OUT/(key+'-before.png')).convert('RGB'));d=np.asarray(Image.open(OUT/(key+'-after.png')).convert('RGB'))
   pixels=int(np.any(a!=d,axis=2).sum()) if a.shape==d.shape else -1
   reg['screens'].append({'route':route,'width':width,'dom_differences':len(changes),'different_pixels':pixels,'page_errors':ea+eb})
   assert not changes and not ea+eb,(key,len(changes),ea+eb)
   if route=='/kindergarten':assert pa.locator('#case-kindergarten-108').count()==1 and pa.locator('#layouts article').count()==6
  except Exception:reg['errors'].append({'route':route,'width':width,'trace':traceback.format_exc()})
  finally:
   for c in contexts:c.close()
   (OUT/'desktop-report.json').write_text(json.dumps(reg,ensure_ascii=False,indent=2))
 b.close()
assert not report['errors'],report['errors']
assert not reg['errors'],reg['errors']
