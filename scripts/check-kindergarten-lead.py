"""Production-preview tests. Only mocked leads, never live CRM or analytics."""
from pathlib import Path
from urllib.parse import urlparse
import json, sys, subprocess, traceback
from playwright.sync_api import sync_playwright
AFTER,BEFORE=[url.rstrip('/') for url in sys.argv[1:3]]
OUT=Path(sys.argv[3]);OUT.mkdir(parents=True,exist_ok=True)
BASE='67da4ff038bda1280ecc88864bdc69c552c55149'
report={'base':BASE,'mobile':[],'regression':[],'protected_sources':[],'errors':[],'live_leads':0,'mocked_posts':0}
for path in ['src/components/Process.tsx','src/components/kindergarten/KindergartenHero.tsx','src/components/kindergarten/KindergartenCatalog.tsx','src/components/kindergarten/kindergarten-catalog-v2.css','src/components/kindergarten/KindergartenGallery.tsx','src/components/kindergarten/KindergartenMobileContent.tsx','src/components/CTA.tsx','server/index.mjs']:
    assert Path(path).read_bytes()==subprocess.check_output(['git','show',f'{BASE}:{path}']),path
    report['protected_sources'].append(path)

def setup(browser,width,url):
    ctx=browser.new_context(viewport={'width':width,'height':844},is_mobile=width<768,has_touch=width<768,reduced_motion='reduce')
    posts=[];mode={'status':201,'body':{'ok':True,'leadId':999}}
    def route(req):
        hostname=urlparse(req.request.url).hostname
        if req.request.method=='POST' and hostname in ('127.0.0.1','localhost') and urlparse(req.request.url).path=='/api/leads':
            posts.append(req.request.post_data_json);report['mocked_posts']+=1
            req.fulfill(status=mode['status'],content_type='application/json',body=json.dumps(mode['body']));return
        if req.request.method not in ('GET','HEAD') or hostname not in ('127.0.0.1','localhost','fonts.googleapis.com','fonts.gstatic.com'):req.abort()
        else:req.continue_()
    ctx.route('**/*',route)
    ctx.add_init_script('''window.__qaGoals=[]; window.ym=(...args)=>window.__qaGoals.push(args);
      document.addEventListener('click', e=>{if(e.target.closest('a[href],button[data-enquiry-open]'))window.__qaClickY=scrollY;},true);''')
    page=ctx.new_page();page.set_default_timeout(12000)
    page.goto(url,wait_until='networkidle');page.evaluate('document.fonts.ready')
    page.add_style_tag(content='*{animation:none!important;transition:none!important;scroll-behavior:auto!important}')
    consent=page.get_by_role('button',name='Только необходимые',exact=True)
    if consent.count():consent.click()
    return ctx,page,posts,mode

def fit(page):
    dialog=page.get_by_role('dialog')
    bad=dialog.evaluate('''el=>[...el.querySelectorAll('h2,p,label,input,textarea,select,button')].filter(n=>{
      if(!n.getClientRects().length || n.closest('.kg-lead-honeypot'))return false;
      const r=n.getBoundingClientRect();return r.left < -1 || r.right > innerWidth+1;
    }).map(n=>n.id||n.textContent.trim())''')
    assert not bad,str(bad)
    assert page.get_by_role('button',name='Закрыть заявку').bounding_box()['y']>=0

def click_open(page,selector):
    target=page.locator(selector).first;target.scroll_into_view_if_needed();page.wait_for_timeout(100)
    # Playwright may move the target away from a sticky bar immediately before dispatch.
    # Measure at the actual click, not before that automatic positioning.
    url=page.url;target.click();before=page.evaluate('window.__qaClickY');page.get_by_role('dialog').wait_for();fit(page)
    assert page.url==url,'Attribution URL changed'
    return before,target

def close(page,before,target):
    page.get_by_role('button',name='Закрыть заявку').click();page.get_by_role('dialog').wait_for(state='detached');page.wait_for_timeout(100)
    assert abs(page.evaluate('scrollY')-before)<3,f"Scroll changed on return: {before} -> {page.evaluate('scrollY')}"
    assert target.evaluate('el=>el===document.activeElement'),'Focus not returned'

def fill(page):
    page.locator('#kg-lead-name').fill('Тестовый родитель')
    page.locator('#kg-lead-phone').fill('8 (999) 000-00-00')
    page.locator('#kg-lead-institution').fill('Детский сад № 108')
    page.locator('#kg-lead-consent').check()

def layout(locator):
    return locator.evaluate('''root=>{const r=root.getBoundingClientRect();return [...root.querySelectorAll('h2,h3,p,article')].map(e=>{const b=e.getBoundingClientRect(),s=getComputedStyle(e);return {text:e.textContent.trim(),x:b.x-r.x,y:b.y-r.y,w:b.width,h:b.height,font:s.fontSize,color:s.color}})}''')

def same_layout(a,b):
    x,y=layout(a),layout(b);assert len(x)==len(y)
    for left,right in zip(x,y):
        for key in ['text','font','color']:assert left[key]==right[key],key
        for key in ['x','y','w','h']:assert abs(left[key]-right[key])<.1,(key,left,right)

with sync_playwright() as pw:
    for engine,widths in [('chromium',[320,360,390,430,767]),('webkit',[390])]:
        browser=getattr(pw,engine).launch()
        for width in widths:
            ctx=None;page=None
            try:
                url=AFTER+'/kindergarten?utm_source=qr&utm_medium=offline&utm_campaign=albums&utm_content=form_v4&yclid=321'
                ctx,page,posts,mode=setup(browser,width,url)
                before,trigger=click_open(page,'.kg-hero-actions a[href="/kindergarten#cta"]')
                assert page.locator('#kg-lead-album').input_value()==''
                assert page.locator('input[required]').count()==4
                page.get_by_role('button',name='Получить расчёт',exact=True).click()
                assert len(posts)==0
                assert page.locator('.kg-lead-error').count()==4
                if width==390:page.screenshot(path=str(OUT/f'{engine}-form-validation.png'))
                fill(page)
                close(page,before,trigger)
                before,trigger=click_open(page,'.kg-hero-actions a[href="/kindergarten#cta"]')
                assert page.locator('#kg-lead-name').input_value()=='Тестовый родитель'
                if width==390:page.screenshot(path=str(OUT/f'{engine}-form-filled.png'))
                mode.update(status=503,body={'ok':False,'error':'not_configured'})
                page.get_by_role('button',name='Получить расчёт',exact=True).click();page.get_by_role('alert').wait_for()
                assert page.locator('#kg-lead-institution').input_value()=='Детский сад № 108'
                if width==390:page.screenshot(path=str(OUT/f'{engine}-form-error.png'))
                close(page,before,trigger)
                page.locator('.km-v2-tab[data-album-id="fourteen-pages"]').click()
                before,trigger=click_open(page,'.km-v2-action')
                assert page.locator('#kg-lead-album').input_value()=='fourteen-pages'
                page.get_by_role('button',name='Количество детей и пожелания — необязательно').click()
                page.locator('#kg-lead-count').select_option('16–20')
                page.locator('#kg-lead-comment').fill('Уточнить свободные даты')
                assert page.get_by_role('dialog').locator('#kg-lead-album').is_visible()
                if width==390:page.screenshot(path=str(OUT/f'{engine}-form-extras.png'))
                mode.update(status=200,body={'ok':True})
                page.get_by_role('button',name='Получить расчёт',exact=True).click();page.get_by_role('alert').wait_for()
                assert not page.get_by_role('heading',name='Заявка принята',exact=True).count()
                mode.update(status=201,body={'ok':True,'leadId':999})
                previous=len(posts)
                page.locator('form').evaluate('(form)=>{form.requestSubmit();form.requestSubmit()}')
                page.get_by_role('heading',name='Заявка принята',exact=True).wait_for()
                assert len(posts)==previous+1,'Duplicate submission'
                body=posts[-1];assert body['phone']=='+79990000000'
                assert body['institution']=='Детский сад № 108' and body['childrenCount']=='16–20'
                assert 'Большая история' in body['comment'] and 'Уточнить' in body['comment']
                assert body['tracking']['utmSource']=='qr' and body['tracking']['yclid']=='321'
                assert body['consent']['given'] is True and body['direction']=='album'
                assert page.url==url
                if width==390:page.screenshot(path=str(OUT/f'{engine}-form-success.png'))
                close(page,before,trigger)
                before,trigger=click_open(page,'.kg-hero-actions a[href="/kindergarten#cta"]')
                assert page.get_by_role('heading',name='Заявка принята',exact=True).count()==1
                page.get_by_role('button',name='Новая заявка',exact=True).click()
                assert page.locator('#kg-lead-phone').input_value()==''
                assert not page.locator('#kg-lead-consent').is_checked()
                if width in (320,390):
                    page.add_style_tag(content='html{font-size:200%!important}')
                    fit(page)
                    if width==390:page.screenshot(path=str(OUT/f'{engine}-form-text200.png'))
                    page.add_style_tag(content='html{font-size:100%!important}')
                    page.set_viewport_size({'width':width,'height':440});fit(page)
                    page.set_viewport_size({'width':width,'height':844})
                page.keyboard.press('Escape');page.get_by_role('dialog').wait_for(state='detached')
                page.evaluate('scrollTo({top:0,behavior:"instant"})');page.wait_for_timeout(200)
                before,trigger=click_open(page,'.kindergarten-mobile-v1 > .fixed.inset-x-0 a')
                if width==390:page.screenshot(path=str(OUT/f'{engine}-form-empty.png'))
                close(page,before,trigger)
                before,trigger=click_open(page,'button[data-enquiry-open]');close(page,before,trigger)
                assert page.locator('#process article').count()==6
                page.locator('.km-v2-tab[data-album-id="fourteen-pages"]').click()
                page.locator('[data-open="details"]').click()
                text=page.get_by_role('dialog').inner_text();assert '15 000 ₽' in text and 'видео — скидка 50%' not in text.lower()
                page.get_by_role('button',name='Закрыть панель',exact=True).click()
                report['mobile'].append({'engine':engine,'width':width,'checks':'passed'})
            except Exception as error:
                report['errors'].append(f'{engine} {width}: {error}\n{traceback.format_exc()}')
                if page:page.screenshot(path=str(OUT/f'failure-{engine}-{width}.png'))
            finally:
                if ctx:ctx.close()
        if engine=='chromium':
            for path,width in [('/kindergarten',390),('/kindergarten',1440),('/school/4',390),('/school/9-11',1440)]:
                contexts=[]
                try:
                    pages=[]
                    for base in [BEFORE,AFTER]:
                        ctx,page,_,_=setup(browser,width,base+path);contexts.append(ctx);pages.append(page)
                    same_layout(pages[0].locator('#process'),pages[1].locator('#process'))
                    if path=='/kindergarten':same_layout(pages[0].locator('.kg-hero'),pages[1].locator('.kg-hero'))
                    if width>=768 or path!='/kindergarten':
                        same_layout(pages[0].locator('#cta'),pages[1].locator('#cta'))
                        assert not pages[1].locator('button[data-enquiry-open]').count()
                    report['regression'].append({'path':path,'width':width,'process_and_untouched_form':'passed'})
                except Exception as error:report['errors'].append(f'regression {path} {width}: {error}')
                finally:
                    for ctx in contexts:ctx.close()
        browser.close()
(OUT/'qa-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
print(json.dumps(report,ensure_ascii=False,indent=2))
sys.exit(1 if report['errors'] else 0)
