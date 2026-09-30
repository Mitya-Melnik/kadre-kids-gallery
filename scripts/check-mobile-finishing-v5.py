"""Compare intended mobile whitespace with approved content; never post real leads."""
from pathlib import Path
from urllib.parse import urlparse, parse_qs
import json, subprocess, sys, traceback
from playwright.sync_api import sync_playwright
AFTER, BEFORE = [x.rstrip('/') for x in sys.argv[1:3]]
OUT = Path(sys.argv[3]); OUT.mkdir(parents=True, exist_ok=True)
BASE = 'c4b7bfa6538d754fdbca3fee22f864cf1f8fb359'
report = {'base': BASE, 'commit': subprocess.check_output(['git','rev-parse','HEAD']).decode().strip(), 'protected_sources': [], 'mobile': [], 'regression': [], 'errors': [], 'live_leads': 0}
for name in ['Process.tsx','CTA.tsx','kindergarten/KindergartenHero.tsx','kindergarten/KindergartenCatalog.tsx','kindergarten/KindergartenGallery.tsx','kindergarten/KindergartenMobileContent.tsx','kindergarten/KindergartenEnquiry.tsx']:
    path='src/components/'+name
    assert Path(path).read_bytes()==subprocess.check_output(['git','show',f'{BASE}:{path}']), path
    report['protected_sources'].append(path)
for path in ['src/config/albumPackages.ts','src/config/albumCommercial.ts','server/index.mjs']:
    assert Path(path).read_bytes()==subprocess.check_output(['git','show',f'{BASE}:{path}']), path
    report['protected_sources'].append(path)
# Existing business descriptions must stay verbatim even on the new selector.
a=Path('src/pages/Albums.tsx').read_text(); b=subprocess.check_output(['git','show',f'{BASE}:src/pages/Albums.tsx']).decode()
assert a.split('const directions = [')[1].split('] as const;')[0]==b.split('const directions = [')[1].split('] as const;')[0]

SHOT = '.kindergarten-mobile-v1 > .fixed, .albums-mobile-v5 > .fixed {visibility:hidden!important}'

def setup(browser,width,url):
    ctx=browser.new_context(viewport={'width':width,'height':844},is_mobile=width<768,has_touch=width<768,reduced_motion='reduce')
    def route(r):
        if r.request.method not in ('GET','HEAD') or urlparse(r.request.url).hostname not in ('127.0.0.1','localhost','fonts.googleapis.com','fonts.gstatic.com'): r.abort()
        else: r.continue_()
    ctx.route('**/*',route)
    ctx.add_init_script('window.__qaGoals=[];window.ym=(...args)=>window.__qaGoals.push(args)')
    page=ctx.new_page(); page.set_default_timeout(12000)
    errors=[]; page.on('pageerror',lambda err:errors.append(str(err)))
    page.goto(url,wait_until='networkidle'); page.evaluate('document.fonts.ready')
    consent=page.get_by_role('button',name='Только необходимые',exact=True)
    if consent.count(): consent.click()
    page.add_style_tag(content='*{animation:none!important;transition:none!important;scroll-behavior:auto!important}')
    return ctx,page,errors

def reveal(page):
    height=page.evaluate('document.documentElement.scrollHeight')
    for y in range(0,height,650):
        page.evaluate('(y)=>scrollTo(0,y)',y); page.wait_for_timeout(20)
    page.wait_for_timeout(200)
    page.evaluate('''async()=>{await document.fonts.ready;await Promise.all([...document.images].filter(i=>i.complete&&i.naturalWidth).map(i=>i.decode().catch(()=>{})));scrollTo(0,0)}''')
    page.wait_for_timeout(100)

def metrics(root):
    return root.evaluate('''root=>{const r=root.getBoundingClientRect();return [...root.querySelectorAll('h1,h2,h3,h4,p,li,article,label,input,select,textarea')].filter(e=>e.getClientRects().length&&getComputedStyle(e).visibility!=='hidden'&&!e.closest('[inert]')).map(e=>{const b=e.getBoundingClientRect(),s=getComputedStyle(e);return {text:e.textContent.trim(),x:b.x-r.x,y:b.y-r.y,w:b.width,h:b.height,font:s.fontSize,line:s.lineHeight,color:s.color}})}''')

def same(a,b):
    assert len(a)==len(b),(len(a),len(b))
    for left,right in zip(a,b):
        for key in ['text','font','line','color']: assert left[key]==right[key],(key,left,right)
        for key in ['x','y','w','h']: assert abs(left[key]-right[key])<1,(key,left,right)

def fit(locator):
    bad=locator.evaluate('''root=>[...root.querySelectorAll('h1,h2,h3,p,li,button,a,input')].filter(e=>{
      if(!e.getClientRects().length||e.closest('[inert]')||getComputedStyle(e).visibility==='hidden')return false;
      const r=e.getBoundingClientRect();return r.left < -1 || r.right>innerWidth+1;
    }).map(e=>e.textContent.trim()||e.id)''')
    assert not bad,bad

def sections(page):
    return page.locator('main > section').evaluate_all('''els=>els.map(e=>{const r=e.getBoundingClientRect(),s=getComputedStyle(e);return {id:e.id||e.className.split(' ')[0],y:Math.round(r.y+scrollY),height:Math.round(r.height),paddingTop:s.paddingTop,paddingBottom:s.paddingBottom}})''')

def fail(name,exc,page):
    report['errors'].append(name+': '+str(exc)+'\n'+traceback.format_exc())
    if page: page.screenshot(path=str(OUT/f'failure-{name}.png'))

with sync_playwright() as pw:
    for engine,widths in [('chromium',[320,360,390,430,767]),('webkit',[390])]:
        browser=getattr(pw,engine).launch()
        for width in widths:
            contexts=[]; page=None; name=f'{engine}-{width}'
            try:
                pages=[]
                for base in (BEFORE,AFTER):
                    ctx,p,errs=setup(browser,width,base+'/kindergarten'); contexts.append(ctx);reveal(p);pages.append(p);assert not errs,errs
                old,page=pages
                assert old.locator('main').inner_text()==page.locator('main').inner_text(),'Kindergarten content changed'
                assert page.locator('#process article').count()==6
                same(metrics(old.locator('#process > .container')),metrics(page.locator('#process > .container')))
                for selector in ['.kg-hero','#albums']:
                    same(metrics(old.locator(selector)),metrics(page.locator(selector)))
                assert page.locator('#process').evaluate('e=>getComputedStyle(e).paddingTop')=='24px'
                before_height=old.evaluate('document.documentElement.scrollHeight');after_height=page.evaluate('document.documentElement.scrollHeight')
                assert after_height<before_height
                item={'engine':engine,'width':width,'kg_before_height':before_height,'kg_after_height':after_height,'all_six_process_steps_unchanged':True,'before_sections':sections(old),'after_sections':sections(page)}
                if width==390 and engine=='chromium':
                    old.screenshot(path=str(OUT/'kg-before-full.png'),full_page=True,style=SHOT)
                    page.screenshot(path=str(OUT/'kg-after-full.png'),full_page=True,style=SHOT)
                    for selector,label in [('#process','process'),('#layouts','layouts')]:
                        old.locator(selector).screenshot(path=str(OUT/f'{label}-before.png'),style=SHOT)
                        page.locator(selector).screenshot(path=str(OUT/f'{label}-after.png'),style=SHOT)
                page.locator('.km-v2-tab[data-album-id="ten-pages"]').click()
                page.locator('.km-v2-action').click();page.get_by_role('dialog').wait_for()
                assert page.locator('#kg-lead-institution').is_visible()
                page.get_by_role('button',name='Закрыть заявку',exact=True).click()
                assert not page.get_by_role('dialog').count()
                ctx,page,errs=setup(browser,width,AFTER+'/albums?utm_source=qa&utm_campaign=selector_v5&yclid=42&unrelated=not-forwarded'); contexts.append(ctx)
                fit(page.locator('main'))
                assert page.locator('.ad5-switch button').count()==3
                assert page.locator('.ad5-slide:not([inert])').count()==1
                start_y=page.evaluate('scrollY')
                paths={'kindergarten':'/kindergarten','grade4':'/school/4','grade9_11':'/school/9-11'}
                for segment,path in paths.items():
                    page.locator(f'[data-direction="{segment}"]').click()
                    page.wait_for_function('(s)=>document.querySelector(".ad5-slide:not([inert])").dataset.slide===s',arg=segment)
                    page.wait_for_timeout(100)
                    assert abs(page.evaluate('scrollY')-start_y)<3,'Selector changes page scroll'
                    fit(page.locator('.ad5-picker'))
                    link=page.locator('.ad5-slide:not([inert]) a')
                    parsed=urlparse(link.get_attribute('href'));q=parse_qs(parsed.query)
                    assert parsed.path==path and q['utm_source']==['qa'] and q['yclid']==['42']
                    assert 'unrelated' not in q
                    if width==390 and engine=='chromium':
                        page.evaluate('scrollTo(0,0)');page.screenshot(path=str(OUT/f'albums-{segment}-phone.png'))
                        page.locator('main').screenshot(path=str(OUT/f'albums-{segment}-full.png'),style=SHOT)
                page.locator('[data-direction="grade9_11"]').press('Home')
                page.wait_for_function('document.querySelector(".ad5-switch button[aria-pressed=true]").dataset.direction==="kindergarten"')
                page.get_by_role('button',name='Следующее направление',exact=True).click()
                page.wait_for_function('document.querySelector(".ad5-switch button[aria-pressed=true]").dataset.direction==="grade4"')
                page.locator('.ad5-strip').evaluate('e=>e.scrollTo({left:e.clientWidth*2,behavior:"instant"})')
                page.wait_for_function('document.querySelector(".ad5-switch button[aria-pressed=true]").dataset.direction==="grade9_11"')
                assert page.get_by_role('button',name='Следующее направление',exact=True).is_disabled()
                page.locator('[data-direction="grade9_11"]').press('ArrowLeft')
                page.wait_for_function('document.querySelector(".ad5-switch button[aria-pressed=true]").dataset.direction==="grade4"')
                await_path=paths['grade4']
                page.locator('.ad5-slide:not([inert]) a').click();page.wait_for_url('**/school/4?**')
                assert parse_qs(urlparse(page.url).query)['utm_campaign']==['selector_v5']
                page.go_back(wait_until='networkidle');page.locator('.ad5-picker').wait_for()
                if width in (320,390):
                    page.add_style_tag(content='html{font-size:200%!important}')
                    page.wait_for_timeout(100);fit(page.locator('main'))
                    if width==390:page.screenshot(path=str(OUT/f'{engine}-selector-text200.png'))
                    page.add_style_tag(content='html{font-size:100%!important}')
                    page.set_viewport_size({'width':width,'height':440});fit(page.locator('main'))
                assert not errs,errs
                item['selector_checks']='labels, arrows, native horizontal scroll, keyboard, correct links, UTM and resizing passed'
                report['mobile'].append(item)
            except Exception as exc: fail(name,exc,page)
            finally:
                for ctx in contexts:ctx.close()
        if engine=='chromium':
            for path,width in [('/kindergarten',768),('/kindergarten',1024),('/kindergarten',1440),('/albums',768),('/albums',1440),('/school/4',390),('/school/4',1440),('/school/9-11',390),('/school/9-11',1440),('/',390)]:
                contexts=[];page=None;name='regression-'+path.strip('/').replace('/','-')+'-'+str(width)
                try:
                    pages=[]
                    for url in (BEFORE,AFTER):
                        ctx,page,errs=setup(browser,width,url+path);contexts.append(ctx);reveal(page);pages.append(page);assert not errs,errs
                    same(metrics(pages[0].locator('main')),metrics(pages[1].locator('main')))
                    same(metrics(pages[0].locator('footer')),metrics(pages[1].locator('footer')))
                    report['regression'].append({'path':path,'width':width,'text_geometry_styles':'unchanged'})
                except Exception as exc:fail(name,exc,page)
                finally:
                    for ctx in contexts:ctx.close()
        browser.close()
(OUT/'qa-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
print(json.dumps(report,ensure_ascii=False,indent=2))
sys.exit(1 if report['errors'] else 0)
