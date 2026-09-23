"""Check actual v2/v1 builds without sending leads or live analytics."""
from pathlib import Path
from urllib.parse import urlparse
import json
import sys
import traceback
from PIL import Image, ImageChops
from playwright.sync_api import sync_playwright

AFTER, BEFORE = [x.rstrip('/') for x in sys.argv[1:3]]
OUT = Path(sys.argv[3]); OUT.mkdir(parents=True, exist_ok=True)
REPORT = {'mobile': [], 'regression': [], 'errors': [], 'forms_submitted': 0,
          'note': 'Section crops hide fixed/sticky navigation only; viewport/panel screenshots retain overlays. WebKit is not a physical iPhone.'}
NO_MOTION = '* {animation:none!important;transition:none!important;scroll-behavior:auto!important}'
SECTION_SHOT = 'header.sticky, .fixed {visibility:hidden!important}'
OVERFLOW = '''root => [...root.querySelectorAll('h1,h2,h3,p,li,button,a,video,img,dt,dd')].filter(el=>{
 if(!el.getClientRects().length || getComputedStyle(el).visibility==='hidden')return false;
 const r=el.getBoundingClientRect();return r.left < -1 || r.right > innerWidth+1 || (el.clientWidth>0 && el.scrollWidth>el.clientWidth+2);
}).map(el=>({tag:el.tagName,text:el.textContent.trim().slice(0,80),width:el.clientWidth,scroll:el.scrollWidth}))'''
PACKAGES = [('folder','2 700 ₽'),('trio','2 950 ₽'),('six-pages','3 300 ₽'),('ten-pages','3 900 ₽'),('fourteen-pages','6 500 ₽')]

def route_safely(route):
    if route.request.method not in ('GET','HEAD') or urlparse(route.request.url).hostname not in ('127.0.0.1','localhost','fonts.googleapis.com','fonts.gstatic.com'):
        route.abort()
    else:
        route.continue_()

def context_for(browser, mobile=False):
    c=browser.new_context(reduced_motion='reduce', has_touch=mobile, is_mobile=mobile)
    c.route('**/*', route_safely)
    c.add_init_script('window.__qaGoals=[];window.ym=(...args)=>window.__qaGoals.push(args)')
    return c

def prepare(context, url, width):
    page=context.new_page();page.set_default_timeout(10000)
    page.set_viewport_size({'width':width,'height':844})
    page.goto(url,wait_until='networkidle');page.add_style_tag(content=NO_MOTION)
    page.evaluate('document.fonts.ready');page.locator('h1').first.wait_for()
    consent=page.get_by_role('button',name='Только необходимые',exact=True)
    if consent.count():consent.click()
    return page

def reveal(page):
    page.evaluate('''async()=>{for(let y=0;y<document.body.scrollHeight;y+=600){scrollTo(0,y);await new Promise(r=>setTimeout(r,25));}scrollTo(0,0)}''')
    page.wait_for_timeout(250)

def assert_fit(root,label):
    issues=root.evaluate(OVERFLOW)
    assert not issues,f'{label}: {issues}'

def close_panel(page, opener, scroll, selected):
    page.get_by_role('button',name='Закрыть панель',exact=True).click()
    page.locator('.km-v2-sheet').wait_for(state='detached')
    page.wait_for_timeout(100)
    assert abs(page.evaluate('scrollY')-scroll)<=2,'Closing panel changed scroll position'
    assert page.locator('.km-v2-tab[data-state="active"]').get_attribute('data-album-id')==selected
    assert opener.evaluate('el=>el===document.activeElement'),'Focus did not return to opener'

def metrics(page):
    return page.evaluate('''()=>[...document.querySelectorAll('main > section, main h1, main h2, #albums')].map(el=>{const r=el.getBoundingClientRect(),s=getComputedStyle(el);return {tag:el.tagName,text:el.tagName==='SECTION'?'':el.textContent.trim(),x:r.x,y:r.y+scrollY,w:r.width,h:r.height,font:s.fontSize,color:s.color};})''')

def same_image(a,b):
    a=Image.open(a).convert('RGB');b=Image.open(b).convert('RGB')
    return a.size==b.size and ImageChops.difference(a,b).getbbox() is None

with sync_playwright() as p:
    for engine,widths in [('chromium',(320,360,390,430,767)),('webkit',(390,))]:
        browser=getattr(p,engine).launch()
        for width in widths:
            context=context_for(browser,engine=='webkit');page=None
            try:
                entry=AFTER+'/kindergarten?utm_source=qa&utm_campaign=mobile_catalog_v2'
                page=prepare(context,entry,width)
                catalog=page.locator('.km-catalog-v2')
                assert page.locator('#albums').count()==1
                assert page.get_by_role('tab').count()==5
                assert page.get_by_role('tabpanel').count()==1
                assert page.locator('.km-v2-tab[data-state="active"]').get_attribute('data-album-id')=='ten-pages'
                catalog.evaluate('el=>el.scrollIntoView({block:"start"})')
                page.wait_for_timeout(100)
                heights={};positions=[]
                for album_id,price in PACKAGES:
                    tab=page.locator(f'.km-v2-tab[data-album-id="{album_id}"]')
                    tab.click();page.wait_for_timeout(80)
                    assert price in page.locator('.km-v2-price').inner_text()
                    assert page.get_by_role('tabpanel').get_attribute('data-selected-album')==album_id
                    assert tab.get_attribute('aria-controls')==page.get_by_role('tabpanel').get_attribute('id')
                    page.locator('.km-v2-preview img').scroll_into_view_if_needed()
                    page.wait_for_function('document.querySelector(".km-v2-preview img")?.naturalWidth>0')
                    assert_fit(catalog,f'{engine} {width} {album_id}')
                    heights[album_id]=round(catalog.bounding_box()['height'],1)
                    if width==390 and engine=='chromium':
                        catalog.screenshot(path=str(OUT/f'format-{album_id}-390.png'),style=SECTION_SHOT)
                    positions.append(page.locator('.km-v2-tabs').evaluate('el=>el.getBoundingClientRect().top+scrollY'))
                assert max(positions)-min(positions)<=1,'Tabs move in document on selection'
                page.locator('.km-v2-tab[data-album-id="ten-pages"]').click()
                catalog.evaluate('el=>el.scrollIntoView({block:"start"})')
                page.screenshot(path=str(OUT/f'{engine}-catalog-viewport-{width}.png'))
                catalog.screenshot(path=str(OUT/f'{engine}-catalog-full-{width}.png'),style=SECTION_SHOT)
                for kind in ('details','image','video'):
                    opener=page.locator(f'[data-open="{kind}"]');opener.scroll_into_view_if_needed()
                    saved=page.evaluate('scrollY');opener.click()
                    panel=page.get_by_role('dialog');panel.wait_for()
                    assert panel.get_attribute('data-panel')==kind
                    assert panel.locator('h2').evaluate('el=>el===document.activeElement'),'Modal heading not focused'
                    assert_fit(panel,f'{kind} {engine} {width}')
                    if kind=='details':
                        assert 'Персональная печатная грамота' in panel.inner_text(),'Existing contents not retained'
                        assert 'Доставка' in panel.inner_text()
                        assert panel.locator('.km-v2-sheet-body').evaluate('el=>el.scrollHeight>el.clientHeight'),'Long panel should scroll'
                    if kind=='video':
                        assert panel.locator('video').get_attribute('controls') is not None
                        assert panel.locator('video').get_attribute('autoplay') is None
                    if width==390:
                        page.screenshot(path=str(OUT/f'{engine}-panel-{kind}-390.png'))
                    close_panel(page,opener,saved,'ten-pages')
                page.locator('[data-open="comparison"]').click()
                assert page.locator('.km-v2-comparison article').count()==5
                assert_fit(page.get_by_role('dialog'),'comparison')
                if width==390:page.screenshot(path=str(OUT/f'{engine}-panel-comparison-390.png'))
                page.locator('[data-compare-id="folder"]').click()
                page.locator('.km-v2-sheet').wait_for(state='detached')
                page.wait_for_timeout(100)
                tab=page.locator('.km-v2-tab[data-album-id="folder"]')
                assert tab.get_attribute('aria-selected')=='true'
                assert tab.evaluate('el=>el===document.activeElement'),'Comparison must focus chosen tab'
                if engine=='chromium':
                    tab.press('ArrowRight')
                    assert page.locator('.km-v2-tab[data-album-id="trio"]').get_attribute('aria-selected')=='true'
                    page.locator('.km-v2-tab[data-album-id="trio"]').press('End')
                    assert page.locator('.km-v2-tab[data-album-id="fourteen-pages"]').get_attribute('aria-selected')=='true'
                    page.locator('[data-open="details"]').click();page.keyboard.press('Escape')
                    page.locator('.km-v2-sheet').wait_for(state='detached')
                page.locator('.km-v2-tab[data-album-id="ten-pages"]').click()
                page.locator('.km-v2-action').click()
                assert page.url==entry,'CTA loses route or attribution'
                page.wait_for_function('document.getElementById("cta").getBoundingClientRect().top>=0 && document.getElementById("cta").getBoundingClientRect().top<innerHeight')
                assert any('consultation_click' in args for args in page.evaluate('window.__qaGoals'))
                if width in (320,390):
                    page.add_style_tag(content='html {font-size:200% !important}')
                    assert_fit(catalog,'200% text catalog')
                    page.locator('[data-open="details"]').click()
                    assert_fit(page.get_by_role('dialog'),'200% text dialog')
                    assert page.locator('.km-v2-close').bounding_box()['y']>=0
                    page.screenshot(path=str(OUT/f'{engine}-text200-panel-{width}.png'))
                    page.get_by_role('button',name='Закрыть панель').click()
                REPORT['mobile'].append({'engine':engine,'width':width,'catalog_heights':heights,'checks':'passed'})
            except Exception as exc:
                REPORT['errors'].append(f'{engine} {width}: {exc}\n{traceback.format_exc()}')
                if page:page.screenshot(path=str(OUT/f'failure-{engine}-{width}.png'))
            finally:context.close()
        if engine=='chromium':
            for path,width in [('/kindergarten',390),('/kindergarten',768),('/kindergarten',1024),('/kindergarten',1440),('/school/4',390),('/school/4',1440),('/school/9-11',390),('/school/9-11',1440)]:
                context=context_for(browser)
                try:
                    pages=[prepare(context,url+path,width) for url in (BEFORE,AFTER)]
                    slug=path.strip('/').replace('/','-')
                    if width==390 and path=='/kindergarten':
                        for label,page in zip(('v1','v2'),pages):
                            page.locator('.kg-hero').screenshot(path=str(OUT/f'{label}-approved-hero-390.png'),style=SECTION_SHOT,mask=[page.locator('[aria-roledescription="carousel"]')])
                        assert same_image(OUT/'v1-approved-hero-390.png',OUT/'v2-approved-hero-390.png'),'Approved hero changed'
                        pages[0].locator('.km-catalog').screenshot(path=str(OUT/'v1-catalog-full-390.png'),style=SECTION_SHOT)
                        REPORT['regression'].append({'path':path,'width':width,'approved_hero_identical':True})
                    else:
                        for page in pages:reveal(page)
                        pairs=[metrics(page) for page in pages]
                        assert len(pairs[0])==len(pairs[1])
                        for a,b in zip(*pairs):
                            for key in ('x','y','w','h'):assert abs(a[key]-b[key])<=1,f'Geometry {path} {width} {key}'
                            for key in ('tag','text','font','color'):assert a[key]==b[key],f'Content/style {path} {width} {key}'
                        for label,page in zip(('v1','v2'),pages):
                            page.screenshot(path=str(OUT/f'{label}-{slug}-{width}.png'),mask=[page.locator('[aria-roledescription="carousel"]')])
                        same=same_image(OUT/f'v1-{slug}-{width}.png',OUT/f'v2-{slug}-{width}.png')
                        assert same,f'Viewport changed {path} {width}'
                        REPORT['regression'].append({'path':path,'width':width,'geometry':'passed','viewport_pixels_identical':same})
                except Exception as exc:REPORT['errors'].append(f'Regression {path} {width}: {exc}')
                finally:context.close()
        browser.close()
(OUT/'catalog-v2-report.json').write_text(json.dumps(REPORT,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(REPORT,ensure_ascii=False,indent=2))
sys.exit(1 if REPORT['errors'] else 0)
