"""Real production previews; preserve content, no live CRM or analytics."""
from pathlib import Path
from urllib.parse import urlparse
import json, sys, subprocess, traceback
from playwright.sync_api import sync_playwright
AFTER, BEFORE = [x.rstrip('/') for x in sys.argv[1:3]]
OUT = Path(sys.argv[3]); OUT.mkdir(parents=True, exist_ok=True)
BASE = 'f467b9994555374b75ceca4083e743875bb2eda2'
report = {'base': BASE, 'commit': subprocess.check_output(['git','rev-parse','HEAD'], text=True).strip(), 'mobile': [], 'regression': [], 'protected_sources': [], 'errors': [], 'live_leads': 0}
for path in ['src/components/Process.tsx','src/components/kindergarten/KindergartenHero.tsx','src/components/kindergarten/KindergartenCatalog.tsx','src/components/kindergarten/KindergartenGallery.tsx','src/components/kindergarten/KindergartenEnquiry.tsx','src/components/kindergarten/kindergarten-spacing-v5.css','src/components/CTA.tsx','src/config/albumPackages.ts','src/config/albumCommercial.ts','src/pages/Albums.tsx','server/index.mjs']:
    assert Path(path).read_bytes() == subprocess.check_output(['git', 'show', BASE + ':' + path]), path
    report['protected_sources'].append(path)

def setup(browser, width, url):
    ctx = browser.new_context(viewport={'width': width, 'height': 844}, has_touch=width<768, is_mobile=width<768, reduced_motion='reduce')
    def allow(route):
        if route.request.method not in ('GET','HEAD') or urlparse(route.request.url).hostname not in ('127.0.0.1','localhost','fonts.googleapis.com','fonts.gstatic.com'): route.abort()
        else: route.continue_()
    ctx.route('**/*', allow)
    page = ctx.new_page(); page.set_default_timeout(10000)
    errors = []; page.on('pageerror', lambda err: errors.append(str(err)))
    page.goto(url, wait_until='networkidle'); page.evaluate('document.fonts.ready')
    button = page.get_by_role('button', name='Только необходимые', exact=True)
    if button.count(): button.click()
    page.add_style_tag(content='*{animation:none!important;transition:none!important;scroll-behavior:auto!important}')
    for y in range(0, int(page.evaluate('document.documentElement.scrollHeight'))+850, 650):
        page.evaluate('(y)=>scrollTo(0,y)', y); page.wait_for_timeout(45)
    page.wait_for_timeout(250); page.evaluate('scrollTo(0,0)'); page.wait_for_timeout(100)
    return ctx, page, errors

def metrics(root):
    return root.evaluate('''root=>{const r=root.getBoundingClientRect();return [...root.querySelectorAll('h1,h2,h3,h4,p,li,article,label,input,select,textarea')].filter(e=>e.getClientRects().length&&getComputedStyle(e).visibility!=='hidden'&&!e.closest('[inert]')).map(e=>{const b=e.getBoundingClientRect(),s=getComputedStyle(e);return {text:e.textContent.trim(),x:b.x-r.x,y:b.y-r.y,w:b.width,h:b.height,font:s.fontSize,line:s.lineHeight,color:s.color}})}''')

def same(left, right):
    a, b = metrics(left), metrics(right); assert len(a)==len(b), (len(a),len(b))
    for x,y in zip(a,b):
        for key in ['text','font','line','color']: assert x[key]==y[key], (key,x,y)
        for key in ['x','y','w','h']: assert abs(x[key]-y[key])<1, (key,x,y)

def fit(page):
    bad = page.locator('.kgp6').evaluate('''root=>[...root.querySelectorAll('h2,h3,p,button')].filter(e=>{if(e.closest('[inert]'))return false;const r=e.getBoundingClientRect();return r.width>0&&(r.left< -1||r.right>innerWidth+1)}).map(e=>e.textContent.trim())''')
    assert not bad, bad
    assert page.evaluate('document.documentElement.scrollWidth<=innerWidth+1')

def position(page):
    page.evaluate("scrollTo(0,document.querySelector('#process').getBoundingClientRect().top+scrollY-72)")
    page.wait_for_timeout(100)

def selected(page, index):
    page.wait_for_function('''i=>{const e=document.querySelector('.kgp6-strip');return document.querySelector(`.kgp6-navigation [data-step="${i}"]`)?.getAttribute('aria-current')==='step'&&Math.abs(e.scrollLeft-i*e.clientWidth)<2}''', arg=index)
    assert page.locator('.kgp6-slide:not([aria-hidden])').count()==1
    assert page.locator(f'#kgp6-step-{index}').evaluate('e=>!e.inert')
    fit(page)

with sync_playwright() as pw:
    for engine, widths in [('chromium',[320,360,390,430,767]), ('webkit',[390])]:
        browser = getattr(pw,engine).launch()
        for width in widths:
            contexts=[]; page=None
            try:
                ca,page,errors=setup(browser,width,AFTER+'/kindergarten?utm_source=qa&utm_content=process_v6'); contexts.append(ca)
                cb,old,old_errors=setup(browser,width,BEFORE+'/kindergarten?utm_source=qa&utm_content=process_v6'); contexts.append(cb)
                expected=old.locator('#process article').evaluate_all('''els=>els.map(e=>({title:e.querySelector('h3').textContent.trim(),description:e.querySelector('p.mt-2').textContent.trim(),timing:e.querySelector('.mt-auto p')?.textContent.trim()||''}))''')
                actual=page.locator('.kgp6-card').evaluate_all('''els=>els.map(e=>({title:e.querySelector('h3').textContent.trim(),description:e.querySelector('.kgp6-description').textContent.trim(),timing:e.querySelector('.kgp6-timing')?.textContent.trim()||''}))''')
                assert len(actual)==6 and actual==expected, (actual,expected)
                assert page.locator('.kgp6-navigation button').count()==6
                for selector in ['.kg-hero','#albums','#gallery','#layouts','#cta']:
                    same(page.locator(selector),old.locator(selector))
                before_height=old.locator('#process').bounding_box()['height']; after_height=page.locator('#process').bounding_box()['height']
                assert after_height<before_height
                position(page); url=page.url
                assert page.get_by_role('button',name='Предыдущий этап',exact=True).is_disabled()
                for index in range(6):
                    start=page.evaluate('scrollY')
                    page.locator(f'.kgp6-navigation [data-step="{index}"]').click(); selected(page,index)
                    page.wait_for_timeout(100)
                    assert abs(page.evaluate('scrollY')-start)<3, 'Unexpected vertical jump'
                    if width==390:
                        page.screenshot(path=str(OUT/f'{engine}-step-{index+1}-phone.png'))
                        page.locator('#process').screenshot(path=str(OUT/f'{engine}-step-{index+1}-block.png'))
                        position(page)
                assert page.get_by_role('button',name='Следующий этап',exact=True).is_disabled()
                page.get_by_role('button',name='Предыдущий этап',exact=True).click(); selected(page,4)
                page.get_by_role('button',name='Следующий этап',exact=True).click(); selected(page,5)
                page.locator('.kgp6-navigation [data-step="0"]').focus(); page.keyboard.press('End'); selected(page,5)
                page.keyboard.press('Home'); selected(page,0)
                page.locator('.kgp6-strip').evaluate('e=>e.scrollTo({left:e.clientWidth*2,behavior:"instant"})'); selected(page,2)
                if engine=='chromium' and width==390:
                    page.locator('.kgp6-navigation [data-step="0"]').click(); selected(page,0); position(page)
                    rect=page.locator('.kgp6-strip').bounding_box(); x=rect['x']+rect['width']*.85; y=rect['y']+50
                    cdp=ca.new_cdp_session(page)
                    cdp.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':x,'y':y,'id':1}]})
                    for move in range(1,11):
                        cdp.send('Input.dispatchTouchEvent',{'type':'touchMove','touchPoints':[{'x':x-rect['width']*.7*move/10,'y':y,'id':1}]}); page.wait_for_timeout(20)
                    cdp.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]})
                    page.wait_for_function('Number(document.querySelector(".kgp6-navigation [aria-current]").dataset.step)>0')
                    cdp.detach()
                if width in (320,390):
                    page.add_style_tag(content='html{font-size:200%!important}'); page.wait_for_timeout(200); fit(page)
                    if width==390: page.screenshot(path=str(OUT/f'{engine}-text200.png'))
                    page.add_style_tag(content='html{font-size:100%!important}'); page.wait_for_timeout(150)
                    page.set_viewport_size({'width':width,'height':440}); fit(page)
                    page.set_viewport_size({'width':width,'height':844})
                assert page.url==url
                page.locator('.km-v2-action').scroll_into_view_if_needed(); page.locator('.km-v2-action').click()
                page.get_by_role('dialog').wait_for(); assert page.locator('#kg-lead-institution').is_visible()
                page.get_by_role('button',name='Закрыть заявку',exact=True).click()
                assert not errors, errors
                report['mobile'].append({'engine':engine,'width':width,'complete_steps':6,'text_and_timings':'unchanged','before_height':before_height,'after_height':after_height,'keyboard_arrows_native_scroll':'passed','touch_swipe':engine=='chromium' and width==390,'form_open_close':'passed'})
                if width==390 and engine=='chromium': old.locator('#process').screenshot(path=str(OUT/'process-before.png'))
            except Exception as err:
                report['errors'].append(f'{engine}-{width}: {err}\n{traceback.format_exc()}')
                if page: page.screenshot(path=str(OUT/f'failure-{engine}-{width}.png'))
            finally:
                for ctx in contexts: ctx.close()
        browser.close()
    browser=pw.chromium.launch()
    for path,width in [('/kindergarten',768),('/kindergarten',1440),('/albums',390),('/albums',1440),('/school/4',390),('/school/4',1440),('/school/9-11',390),('/school/9-11',1440),('/',390)]:
        contexts=[]
        try:
            pages=[]
            for base in [BEFORE,AFTER]:
                ctx,page,errors=setup(browser,width,base+path); contexts.append(ctx); pages.append(page); assert not errors,errors
            roots=[p.locator('main') if p.locator('main').count() else p.locator('#root') for p in pages]
            same(roots[0],roots[1]); same(pages[0].locator('footer'),pages[1].locator('footer'))
            report['regression'].append({'path':path,'width':width,'text_geometry_styles':'unchanged'})
        except Exception as err: report['errors'].append(f'regression-{path}-{width}: {err}\n{traceback.format_exc()}')
        finally:
            for ctx in contexts: ctx.close()
    browser.close()
(OUT/'qa-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
print(json.dumps(report,ensure_ascii=False,indent=2))
sys.exit(1 if report['errors'] else 0)
