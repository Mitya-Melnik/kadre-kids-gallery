"""Check only local production previews. No live CRM or analytics."""
from pathlib import Path
from urllib.parse import urlparse
import json, subprocess, sys, traceback
from playwright.sync_api import sync_playwright, expect
AFTER, BEFORE = [s.rstrip('/') for s in sys.argv[1:3]]
OUT = Path(sys.argv[3]); OUT.mkdir(parents=True, exist_ok=True)
BASE = '9d19bb421d9ae4298800785073f4038faa77ed72'
report = {'base': BASE, 'commit': subprocess.check_output(['git','rev-parse','HEAD'],text=True).strip(), 'mobile': [], 'regression': [], 'errors': [], 'live_leads': 0}
allowed = {'src/components/kindergarten/KindergartenCase.tsx','src/components/kindergarten/KindergartenMobileContent.tsx','src/components/kindergarten/MobileSwipeRail.tsx','src/components/kindergarten/kindergarten-swipes-v7.css','docs/kindergarten-swipes-v7.md','scripts/check-kindergarten-swipes-v7.py','.github/workflows/kindergarten-swipes-v7.yml'}
changed = set(subprocess.check_output(['git','diff','--name-only',BASE,'HEAD'],text=True).splitlines())
assert changed <= allowed, changed - allowed
report['changed_files'] = sorted(changed)
for path, marker in [('src/components/kindergarten/KindergartenMobileContent.tsx','type Question =')]:
    old = subprocess.check_output(['git','show',f'{BASE}:{path}'],text=True)
    assert old[old.index(marker):] == Path(path).read_text()[Path(path).read_text().index(marker):], 'Unrelated mobile content changed'
path = 'src/components/kindergarten/KindergartenCase.tsx'
old = subprocess.check_output(['git','show',f'{BASE}:{path}'],text=True); new=Path(path).read_text()
assert old[old.index('const caseRoot'):old.index('const KindergartenCase')] == new[new.index('const caseRoot'):new.index('const KindergartenCase')], 'Case assets or facts changed'

def setup(browser, width, base, route='/kindergarten'):
    ctx=browser.new_context(viewport={'width':width,'height':844},has_touch=width<768,is_mobile=width<768,reduced_motion='reduce')
    def gate(request):
        host=urlparse(request.request.url).hostname
        if request.request.method not in ('GET','HEAD') or host not in ('127.0.0.1','localhost','fonts.googleapis.com','fonts.gstatic.com'): request.abort()
        else: request.continue_()
    ctx.route('**/*',gate)
    page=ctx.new_page();page.set_default_timeout(12000)
    page.on('pageerror', lambda err: report['errors'].append(str(err)))
    page.goto(base+route,wait_until='networkidle');page.evaluate('document.fonts.ready')
    page.add_style_tag(content='*{animation:none!important;transition:none!important;scroll-behavior:auto!important}')
    consent=page.get_by_role('button',name='Только необходимые',exact=True)
    if consent.count(): consent.click()
    return ctx,page

def position(page, item):
    item.evaluate('(el)=>scrollTo(0,el.getBoundingClientRect().top+scrollY-130)');page.wait_for_timeout(180)

def go(page, wrap, index):
    wrap.locator('.kg7-rail').evaluate('(el,i)=>el.scrollTo({left:el.clientWidth*i,behavior:"auto"})',index)
    expect(wrap).to_have_attribute('data-current',str(index))
    page.wait_for_timeout(80)

def fits(page, wrap):
    bad=wrap.evaluate('''root=>[...root.querySelectorAll('.kg7-controls button,.kg7-controls p,.kg7-controls span,.kg7-slide[aria-hidden="false"] blockquote,.kg7-slide[aria-hidden="false"] figcaption,.kg7-slide[aria-hidden="false"] img')].filter(el=>{let r=el.getBoundingClientRect();return r.left < -1 || r.right > innerWidth+1 || el.scrollHeight > el.clientHeight+2}).map(el=>el.tagName)''')
    assert not bad, bad

def reveal(page):
    height=page.evaluate('document.documentElement.scrollHeight')
    for y in range(0,height,500): page.evaluate('y=>scrollTo(0,y)',y);page.wait_for_timeout(30)
    page.evaluate('scrollTo(0,0)');page.wait_for_timeout(150)

def touch_swipe(ctx,page,wrap):
    go(page,wrap,0);position(page,wrap)
    box=wrap.locator('.kg7-rail').bounding_box(); x1=box['x']+box['width']*.83; x2=box['x']+box['width']*.15; y=min(620,box['y']+box['height']*.5)
    cdp=ctx.new_cdp_session(page)
    cdp.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':x1,'y':y}]})
    for step in range(1,11):
        cdp.send('Input.dispatchTouchEvent',{'type':'touchMove','touchPoints':[{'x':x1+(x2-x1)*step/10,'y':y}]});page.wait_for_timeout(25)
    cdp.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]})
    expect(wrap).not_to_have_attribute('data-current','0');page.wait_for_timeout(200);cdp.detach()

with sync_playwright() as pw:
    for engine,widths in [('chromium',[320,360,390,430,767]),('webkit',[390])]:
        browser=getattr(pw,engine).launch()
        for width in widths:
            contexts=[]
            try:
                bc,b=setup(browser,width,BEFORE); contexts.append(bc)
                old_case_height=b.locator('#case-kindergarten-108').bounding_box()['height']
                old_reviews_height=b.locator('.kg3-reviews').bounding_box()['height']
                b.get_by_role('button',name='Посмотреть ещё развороты').click()
                old_images=b.locator('#case-kindergarten-108 > .container > div > div').nth(2).locator('img').evaluate_all('(els)=>els.map(el=>({src:el.getAttribute("src"),alt:el.alt}))')
                b.locator('.kg3-more-reviews summary').click()
                old_reviews=b.locator('[data-kg3-review]').evaluate_all('(els)=>els.map(el=>({id:el.dataset.kg3Review,text:el.textContent}))')
                ac,a=setup(browser,width,AFTER);contexts.append(ac)
                spreads=a.locator('.kg7-spreads .kg7-swipe');reviews=a.locator('.kg7-reviews')
                assert spreads.locator('.kg7-slide').count()==5
                assert reviews.locator('.kg7-slide').count()==len(old_reviews)==11
                assert spreads.locator('img').evaluate_all('(els)=>els.map(el=>({src:el.getAttribute("src"),alt:el.alt}))')==old_images
                assert reviews.locator('[data-kg3-review]').evaluate_all('(els)=>els.map(el=>({id:el.dataset.kg3Review,text:el.textContent}))')==old_reviews
                for wrap,count,prefix in [(spreads,5,'spread'),(reviews,11,'review')]:
                    position(a,wrap); start_y=a.evaluate('scrollY')
                    assert wrap.get_by_role('button',name='Предыдущая карточка').is_disabled()
                    for index in range(count):
                        expect(wrap).to_have_attribute('data-current',str(index));fits(a,wrap)
                        assert wrap.locator('.kg7-slide[aria-hidden="false"]').count()==1
                        if prefix=='spread':
                            img=wrap.locator('img').nth(index)
                            expect(img).to_be_visible()
                            a.wait_for_function('(el)=>el.complete && el.naturalWidth>0',arg=img.element_handle())
                        if width==390:
                            wrap.screenshot(path=str(OUT/f'{engine}-{prefix}-{index+1}.png'))
                        if index<count-1:wrap.get_by_role('button',name='Следующая карточка').click()
                    assert wrap.get_by_role('button',name='Следующая карточка').is_disabled()
                    assert abs(a.evaluate('scrollY')-start_y)<3, 'Vertical jump while switching'
                    rail=wrap.locator('.kg7-rail');rail.focus();rail.press('Home');expect(wrap).to_have_attribute('data-current','0')
                    rail.press('End');expect(wrap).to_have_attribute('data-current',str(count-1))
                    rail.press('ArrowLeft');expect(wrap).to_have_attribute('data-current',str(count-2))
                    go(a,wrap,0)
                    if engine=='chromium' and width==390:touch_swipe(ac,a,wrap)
                go(a,spreads,2);position(a,spreads)
                opener=spreads.locator('.kg7-slide').nth(2).locator('button');opener.click();a.get_by_role('dialog').wait_for()
                y=a.evaluate('scrollY')
                assert a.locator('.kg7-lightbox img').get_attribute('src')==old_images[2]['src']
                if width==390:a.screenshot(path=str(OUT/f'{engine}-spread-zoom.png'))
                a.keyboard.press('Escape');a.get_by_role('dialog').wait_for(state='detached')
                assert opener.evaluate('(el)=>el===document.activeElement')
                assert abs(a.evaluate('scrollY')-y)<3
                expect(spreads).to_have_attribute('data-current','2')
                if width in (320,390):
                    a.add_style_tag(content='html{font-size:200%!important}')
                    for wrap in (spreads,reviews):go(a,wrap,0);position(a,wrap);fits(a,wrap)
                    if width==390:a.screenshot(path=str(OUT/f'{engine}-text200.png'))
                    a.add_style_tag(content='html{font-size:100%!important}')
                for wrap in (spreads,reviews):go(a,wrap,0)
                if width==390:
                    position(a,spreads);a.screenshot(path=str(OUT/f'{engine}-spreads-phone.png'))
                    position(a,reviews);a.screenshot(path=str(OUT/f'{engine}-reviews-phone.png'))
                report['mobile'].append({'engine':engine,'width':width,'passed':True,'spreads':5,'reviews':11,'case_height_before':old_case_height,'case_height_after':a.locator('#case-kindergarten-108').bounding_box()['height'],'reviews_height_before':old_reviews_height,'reviews_height_after':a.locator('.kg3-reviews').bounding_box()['height'],'touch_swipe':engine=='chromium' and width==390})
            except Exception as error:
                report['errors'].append(f'{engine}-{width}: {error}');traceback.print_exc()
                if 'a' in locals():a.screenshot(path=str(OUT/f'failure-{engine}-{width}.png'))
            finally:
                for ctx in contexts:ctx.close()
        browser.close()
    browser=pw.chromium.launch()
    for width,route in [(768,'/kindergarten'),(1024,'/kindergarten'),(1440,'/kindergarten'),(390,'/albums'),(1440,'/albums'),(390,'/school/4'),(390,'/school/9-11'),(390,'/')]:
        contexts=[]
        try:
            bc,b=setup(browser,width,BEFORE,route);contexts.append(bc);ac,a=setup(browser,width,AFTER,route);contexts.append(ac)
            reveal(b);reveal(a)
            assert a.locator('main').inner_text()==b.locator('main').inner_text(), 'Page text changed'
            assert a.locator('.kg7-swipe').count()==0
            js='''()=>[...document.querySelectorAll('main h1,main h2,main h3')].map(el=>{const r=el.getBoundingClientRect(),s=getComputedStyle(el);return {text:el.textContent,font:s.fontSize,color:s.color,x:r.x,y:r.y+scrollY,w:r.width,h:r.height}})'''
            left=b.evaluate(js);right=a.evaluate(js);assert len(left)==len(right)
            for x,y in zip(left,right):
                for key in ['text','font','color']:assert x[key]==y[key],key
                for key in ['x','y','w','h']:assert abs(x[key]-y[key])<.2,(key,x,y)
            report['regression'].append({'width':width,'route':route,'passed':True})
        except Exception as error:report['errors'].append(f'regression {width} {route}: {error}');traceback.print_exc()
        finally:
            for ctx in contexts:ctx.close()
    browser.close()
(OUT/'qa-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
print(json.dumps(report,ensure_ascii=False,indent=2))
sys.exit(1 if report['errors'] else 0)
