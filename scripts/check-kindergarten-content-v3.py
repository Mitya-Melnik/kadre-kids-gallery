"""Compare mobile content with approved catalog v2; never send live leads."""
from pathlib import Path
from urllib.parse import urlparse
import json, subprocess, sys, traceback
from PIL import Image, ImageChops, ImageStat
from playwright.sync_api import sync_playwright

AFTER, BEFORE = [url.rstrip('/') for url in sys.argv[1:3]]
OUT = Path(sys.argv[3]); OUT.mkdir(parents=True, exist_ok=True)
BASE = '99ecb343f68685b2bc0f033e31587c8e7478b77e'
REPORT = {'base': BASE, 'mobile': [], 'source_preservation': [], 'errors': [], 'forms_submitted': 0,
          'note': 'Isolated shots hide fixed/sticky navigation. Preserved blocks compare exact text/computed styles and relative geometry within 0.05px. Process raster tolerance: max 8/255, mean 0.05/255. Catalog raster differences are reported for visual review: moving the section changes compositor antialiasing, not its source or geometry. WebKit is not a physical iPhone.'}
NO_MOTION = '* {animation:none!important;transition:none!important;scroll-behavior:auto!important}'
SHOT_STYLE = 'header.sticky, .fixed {visibility:hidden!important}'

def norm(value): return ' '.join(value.split())
def old(path): return subprocess.check_output(['git','show',f'{BASE}:{path}']).decode()
def source_checks():
    for path in ['src/components/Process.tsx','src/components/kindergarten/KindergartenHero.tsx',
                 'src/components/kindergarten/KindergartenCatalog.tsx','src/components/kindergarten/kindergarten-catalog-v2.css',
                 'src/components/kindergarten/kindergarten-mobile.css','src/components/kindergarten/CatalogViewportControls.tsx',
                 'src/config/albumPackages.ts','src/components/CTA.tsx','src/components/FAQ.tsx']:
        assert old(path) == Path(path).read_text(), f'Protected source changed: {path}'
        REPORT['source_preservation'].append(path)
    for path,start,end in [
        ('src/components/Testimonials.tsx','  const testimonials = [','  const visibleTestimonials'),
        ('src/components/kindergarten/KindergartenFAQ.tsx','type AlbumFaqItem','const KindergartenFAQ ='),
        ('src/components/kindergarten/KindergartenGallery.tsx','type KindergartenStoryImage','const PhotoButton =')]:
        extract = lambda text: text.split(start,1)[1].split(end,1)[0]
        assert norm(extract(old(path))) == norm(extract(Path(path).read_text())), f'Content source changed: {path}'
        REPORT['source_preservation'].append(path + ': shared original data')

def safe(route):
    allowed = ('127.0.0.1','localhost','fonts.googleapis.com','fonts.gstatic.com')
    if route.request.method not in ('GET','HEAD') or urlparse(route.request.url).hostname not in allowed: route.abort()
    else: route.continue_()

def prepare(browser, url, width):
    ctx = browser.new_context(viewport={'width':width,'height':844}, reduced_motion='reduce', is_mobile=True, has_touch=True, device_scale_factor=1)
    ctx.route('**/*',safe)
    page = ctx.new_page(); page.set_default_timeout(12000)
    page.goto(url,wait_until='networkidle'); page.add_style_tag(content=NO_MOTION)
    page.evaluate('document.fonts.ready')
    consent = page.get_by_role('button',name='Только необходимые',exact=True)
    if consent.count(): consent.click()
    page.locator('h1').first.wait_for()
    return ctx,page

def settle(page):
    page.evaluate('()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))')
    page.wait_for_timeout(200)

def shot(page, selector, name):
    target = page.locator(selector)
    target.scroll_into_view_if_needed(); settle(page)
    target.screenshot(path=str(OUT/name), style=SHOT_STYLE)

def raster(a,b):
    a,b = Image.open(a).convert('RGB'),Image.open(b).convert('RGB')
    assert a.size==b.size, 'Preserved block image size changed'
    delta=ImageChops.difference(a,b)
    return {'max_delta':max(v[1] for v in delta.getextrema()),'mean_delta':max(ImageStat.Stat(delta).mean)}

def preserved_layout(a,b):
    signature='''root=>{const base=root.getBoundingClientRect();return [...root.querySelectorAll('h2,h3,p,article,button,a,img,svg')].map(el=>{const r=el.getBoundingClientRect(),s=getComputedStyle(el);return {tag:el.tagName,text:el.textContent.trim(),x:r.x-base.x,y:r.y-base.y,w:r.width,h:r.height,font:s.fontFamily,size:s.fontSize,weight:s.fontWeight,line:s.lineHeight,color:s.color,background:s.backgroundColor,padding:s.padding,border:s.border,shadow:s.boxShadow};});}'''
    before,after=a.evaluate(signature),b.evaluate(signature)
    assert len(before)==len(after), 'Preserved block element count changed'
    for left,right in zip(before,after):
        for key in ('x','y','w','h'): assert abs(left[key]-right[key])<=0.05, f'Preserved geometry: {key} {left} {right}'
        for key in ('tag','text','font','size','weight','line','color','background','padding','border','shadow'): assert left[key]==right[key], f'Preserved style/content: {key}'

def texts(locator): return [norm(t) for t in locator.evaluate_all('els=>els.map(e=>e.textContent)')]

def fit(root,label):
    errors = root.evaluate('''root => [...root.querySelectorAll('summary,h2,h3,p,blockquote,figcaption,button,.kg3-answer')].filter(el=>{
      if(!el.getClientRects().length || getComputedStyle(el).visibility==='hidden') return false;
      if(el.closest('.kg3-photo-strip')) return false;
      const r=el.getBoundingClientRect();
      return r.left < -1 || r.right>innerWidth+1 || (el.clientWidth && el.scrollWidth>el.clientWidth+2);
    }).map(el=>el.textContent.trim().slice(0,90))''')
    assert not errors, f'{label}: {errors}'

def baseline_faq(page):
    section=page.locator('#kindergarten-faq')
    more=section.get_by_role('button',name='Смотреть ещё',exact=True)
    for _ in range(20):
        if not more.count(): break
        more.click()
    assert not more.count(), 'Could not reveal all baseline questions'
    result={}
    triggers=section.locator('button[aria-controls]')
    for i in range(triggers.count()):
        trigger=triggers.nth(i); question=norm(trigger.inner_text()); trigger.click()
        target=page.locator('[id="'+trigger.get_attribute('aria-controls')+'"]')
        target.wait_for(state='visible'); result[question]=norm(target.inner_text())
    return result

try: source_checks()
except Exception as exc: REPORT['errors'].append(str(exc))

with sync_playwright() as pw:
    for engine,widths in [('chromium',(320,360,390,430,767)),('webkit',(390,))]:
        browser=getattr(pw,engine).launch()
        for width in widths:
            contexts=[]; candidate=None
            try:
                ctx,candidate=prepare(browser,AFTER+'/kindergarten?utm_source=qa&utm_campaign=content_v3',width); contexts.append(ctx)
                ctx,baseline=prepare(browser,BEFORE+'/kindergarten',width); contexts.append(ctx)
                g=candidate.locator('#gallery'); cat=candidate.locator('#albums'); process=candidate.locator('#process')
                assert candidate.locator('#gallery').count()==1 and candidate.locator('#process').count()==1 and candidate.locator('#albums').count()==1
                order=candidate.locator('main > *').evaluate_all('els=>els.map(e=>e.id || e.className)')
                assert cat.evaluate('el=>el.nextElementSibling.id')=='gallery','Examples must immediately follow catalogue'
                assert cat.evaluate('el=>el.getBoundingClientRect().top+scrollY') < g.evaluate('el=>el.getBoundingClientRect().top+scrollY') < process.evaluate('el=>el.getBoundingClientRect().top+scrollY')
                assert process.locator('article').count()==6, 'Process shortened'
                assert norm(process.inner_text())==norm(baseline.locator('#process').inner_text()), 'Process text changed'
                assert process.evaluate('el=>!el.closest("details")'), 'Process collapsed'
                assert all(process.locator('article').nth(i).is_visible() for i in range(6))
                preserved_layout(baseline.locator('#process'),process)

                advantages=candidate.locator('.kg3-advantages')
                assert advantages.get_attribute('open') is None
                advantages.locator(':scope > summary').click()
                assert candidate.locator('#kindergarten-advantages h3').count()==6
                assert texts(candidate.locator('#kindergarten-advantages h3'))==texts(baseline.locator('#kindergarten-advantages h3')), 'Advantage titles changed'
                assert texts(candidate.locator('#kindergarten-advantages p'))==texts(baseline.locator('#kindergarten-advantages p')), 'Advantage descriptions changed'
                fit(advantages,'advantages')
                if width==390: shot(candidate,'.kg3-advantages-wrap',f'{engine}-advantages-open.png')
                advantages.locator(':scope > summary').click()

                assert candidate.locator('.kg3-review:visible').count()==2
                assert candidate.locator('.kg3-review:visible').evaluate_all('els=>els.map(e=>e.dataset.kg3Review)')==['7','2']
                candidate.locator('.kg3-more-reviews > summary').click()
                assert candidate.locator('.kg3-review:visible').count()==11
                fit(candidate.locator('.kg3-reviews'),'reviews')
                candidate.locator('.kg3-more-reviews > summary').click()
                assert candidate.locator('.kg3-review:visible').count()==2

                assert candidate.locator('[data-kg3-question]:visible').count()==4, 'Closed FAQ disclosure must show exactly four questions'
                candidate.locator('.kg3-more-questions > summary').click()
                total=candidate.locator('[data-kg3-question]:visible').count()
                assert total>4
                if width==390 and engine=='chromium':
                    before_faq=baseline_faq(baseline)
                    after_faq={norm(e.locator('summary').inner_text()): norm(e.locator('.kg3-answer').text_content()) for e in candidate.locator('[data-kg3-question]').all()}
                    assert before_faq==after_faq, f'FAQ content changed: {set(before_faq)^set(after_faq)}'
                    REPORT['faq_content_identical']=True; REPORT['faq_count']=len(before_faq)
                candidate.locator('.kg3-more-questions > summary').click()
                first_question=candidate.locator('[data-kg3-question]').first
                first_question.locator('summary').focus(); candidate.keyboard.press('Enter')
                assert first_question.get_attribute('open') is not None
                fit(candidate.locator('#kindergarten-faq'),'open FAQ')
                first_question.locator('summary').click()

                found=[]
                for category,kind,count in [('Портреты','portrait',4),('Друзья','group',6),('Жизнь группы','life',4)]:
                    g.get_by_role('button',name=category,exact=True).click()
                    assert g.locator('.kg3-photo-slide').count()==count
                    for index in range(count):
                        if index: g.get_by_role('button',name='Следующая фотография',exact=True).click()
                        candidate.wait_for_function('(n)=>document.querySelector("#gallery .kg3-photo-controls p").textContent.startsWith(n+" из")',arg=index+1)
                        image=g.locator('.kg3-photo-slide img').nth(index)
                        image.scroll_into_view_if_needed()
                        candidate.wait_for_function('(n)=>document.querySelectorAll(".kg3-photo-slide img")[n].naturalWidth>0',arg=index)
                        found.append(image.get_attribute('alt'))
                    g.get_by_role('button',name=category,exact=True).click(); settle(candidate)
                    assert abs(g.locator('.kg3-photo-strip').evaluate('el=>el.scrollLeft'))<1, 'Category did not reset strip'
                    if width==390: shot(candidate,'#gallery',f'{engine}-gallery-{kind}-390.png')
                baseline_images=sorted(set(baseline.locator('#gallery img').evaluate_all('els=>els.map(e=>e.alt)')))
                assert sorted(found)==baseline_images, 'Missing or invented gallery images'
                g.get_by_role('button',name='Портреты',exact=True).click()
                g.locator('.kg3-photo-strip').evaluate('el=>el.scrollTo({left:el.clientWidth,behavior:"instant"})')
                candidate.wait_for_function('document.querySelector("#gallery .kg3-photo-controls p").textContent.startsWith("2 из")')
                opener=g.locator('.kg3-photo-slide button[tabindex="0"]'); opener.click()
                modal=candidate.get_by_role('dialog'); modal.wait_for()
                assert modal.locator('img').get_attribute('alt')==found[1]
                modal.locator('img').evaluate('el=>el.decode()'); settle(candidate)
                assert modal.get_by_role('button',name='Закрыть фотографию').evaluate('el=>el===document.activeElement')
                saved=candidate.evaluate('scrollY')
                candidate.keyboard.press('Tab'); assert modal.evaluate('el=>el.contains(document.activeElement)')
                if width==390: candidate.screenshot(path=str(OUT/f'{engine}-photo-large-390.png'))
                modal.get_by_role('button',name='Следующая фотография').click()
                candidate.wait_for_function('document.querySelector(".kg3-lightbox .kg3-photo-controls p").textContent.startsWith("3 из")')
                modal.get_by_role('button',name='Закрыть фотографию').click()
                modal.wait_for(state='detached')
                assert abs(candidate.evaluate('scrollY')-saved)<=2, 'Photo close changed page position'
                assert opener.evaluate('el=>el===document.activeElement'), 'Current photo lost focus'
                opener.click();candidate.keyboard.press('Escape');modal.wait_for(state='detached')
                g.get_by_role('button',name='Портреты',exact=True).click()

                metrics={'engine':engine,'width':width,'process_steps':6,'gallery_images':len(found),'reviews':11,'faq':total,'checks':'passed','order':order}
                metrics['catalog_top']=round(cat.evaluate('e=>e.getBoundingClientRect().top+scrollY'))
                metrics['baseline_catalog_top']=round(baseline.locator('#albums').evaluate('e=>e.getBoundingClientRect().top+scrollY'))
                metrics['gallery_top']=round(g.evaluate('e=>e.getBoundingClientRect().top+scrollY'))
                metrics['baseline_gallery_top']=round(baseline.locator('#gallery').evaluate('e=>e.getBoundingClientRect().top+scrollY'))
                if width==390:
                    shot(candidate,'.kg3-reviews',f'{engine}-reviews-390.png')
                    shot(candidate,'#kindergarten-faq',f'{engine}-questions-390.png')
                    shot(candidate,'#process',f'{engine}-process-after-390.png')
                    shot(baseline,'#process',f'{engine}-process-before-390.png')
                    process_diff=raster(OUT/f'{engine}-process-after-390.png',OUT/f'{engine}-process-before-390.png')
                    assert process_diff['max_delta']<=8 and process_diff['mean_delta']<=0.05, 'Process rendering changed beyond antialiasing tolerance'
                    metrics['process_raster']=process_diff
                    preserved_layout(baseline.locator('#albums'),cat)
                    shot(candidate,'#albums',f'{engine}-catalog-approved-after-390.png')
                    shot(baseline,'#albums',f'{engine}-catalog-approved-before-390.png')
                    metrics['catalog_raster_for_visual_review']=raster(OUT/f'{engine}-catalog-approved-after-390.png',OUT/f'{engine}-catalog-approved-before-390.png')
                    metrics['catalog_content_and_computed_layout_identical']=True
                    candidate.locator('#gallery').evaluate('el=>el.scrollIntoView({block:"start"})');settle(candidate)
                    candidate.screenshot(path=str(OUT/f'{engine}-gallery-phone-390.png'))
                    assert candidate.locator('.kindergarten-mobile-content-v3').get_attribute('data-kg3-reading') is not None
                    assert candidate.locator('.kindergarten-mobile-content-v3 > .fixed:not(.inset-x-0)').evaluate_all('els=>els.every(el=>getComputedStyle(el).display==="none")')
                    if engine=='chromium':
                        shot(baseline,'#gallery','gallery-before-390.png')
                        for page,label in [(baseline,'before'),(candidate,'after')]:
                            page.evaluate('''async()=>{for(let y=0;y<document.body.scrollHeight;y+=600){scrollTo(0,y);await new Promise(r=>setTimeout(r,25));}scrollTo(0,0)}''');settle(page)
                            page.screenshot(path=str(OUT/f'page-{label}-390.png'),full_page=True,style=SHOT_STYLE)
                if width in (320,390):
                    candidate.add_style_tag(content='html{font-size:200%!important}')
                    for selector in ('.kg3-gallery','.kg3-reviews','.kg3-faq'): fit(candidate.locator(selector),'200% '+selector)
                    candidate.locator('.kg3-advantages > summary').click();fit(advantages,'200% advantages')
                    candidate.locator('.kg3-advantages > summary').click()
                    first_question.locator('summary').evaluate('el=>el.scrollIntoView({block:"center"})');settle(candidate)
                    first_question.locator('summary').click();fit(candidate.locator('#kindergarten-faq'),'200% answer')
                    shot(candidate,'#kindergarten-faq',f'{engine}-questions-text200-{width}.png')
                REPORT['mobile'].append(metrics)
            except Exception as exc:
                REPORT['errors'].append(f'{engine} {width}: {exc}\n{traceback.format_exc()}')
                if candidate: candidate.screenshot(path=str(OUT/f'content-failure-{engine}-{width}.png'))
            finally:
                for context in contexts: context.close()
        browser.close()
(OUT/'content-v3-report.json').write_text(json.dumps(REPORT,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(REPORT,ensure_ascii=False,indent=2))
sys.exit(1 if REPORT['errors'] else 0)
