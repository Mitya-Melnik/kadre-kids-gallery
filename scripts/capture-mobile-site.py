"""Real mobile screenshots of distinct routes; read-only, never submits leads."""
import json, subprocess, sys
from pathlib import Path
from urllib.parse import urlparse
from playwright.sync_api import sync_playwright

BASE = sys.argv[1].rstrip('/')
OUT = Path(sys.argv[2]); OUT.mkdir(parents=True, exist_ok=True)
ROUTES = [
    ('kindergarten', '/kindergarten', 'Детский сад · обновлённая версия'),
    ('home', '/', 'Главная'),
    ('albums', '/albums', 'Выбор выпускных альбомов'),
    ('school-4', '/school/4', 'Школа · 4 класс'),
    ('school-9-11', '/school/9-11', 'Школа · 9–11 классы'),
    ('privacy', '/privacy', 'Политика обработки данных'),
    ('consent', '/personal-data-consent', 'Согласие на обработку данных'),
]
report = {'commit': subprocess.check_output(['git','rev-parse','HEAD'], text=True).strip(),
          'viewport': {'width':390,'height':844}, 'pages':[], 'errors':[],
          'live_leads':0, 'mode':'visual screenshots, not an interactive website',
          'full_page_note':'Floating bottom shortcuts hidden only for continuous full-page capture; normal viewport retains them.',
          'aliases': {'/school':'/school/9-11'}}

def allow_read(route):
    if route.request.method not in ('GET','HEAD') or urlparse(route.request.url).hostname not in ('localhost','127.0.0.1','fonts.googleapis.com','fonts.gstatic.com'):
        route.abort()
    else:
        route.continue_()

with sync_playwright() as pw:
    browser = pw.chromium.launch()
    for slug, path, title in ROUTES:
        ctx = browser.new_context(viewport=report['viewport'], device_scale_factor=2,
                                  is_mobile=True, has_touch=True, reduced_motion='reduce')
        ctx.route('**/*', allow_read)
        page = ctx.new_page(); page.set_default_timeout(15000)
        page_errors = []; page.on('pageerror', lambda error: page_errors.append(str(error)))
        try:
            page.goto(BASE + path, wait_until='networkidle')
            page.evaluate('document.fonts.ready')
            consent = page.get_by_role('button', name='Только необходимые', exact=True)
            if consent.count(): consent.click()
            page.add_style_tag(content='* {scroll-behavior:auto !important; animation-duration:0s !important; transition-duration:0s !important;}')
            # Scroll through the actual page to load lazy images and settle reveal hooks.
            for y in range(0, int(page.evaluate('document.documentElement.scrollHeight')) + 900, 480):
                page.evaluate('(y)=>scrollTo(0,y)', y)
                page.wait_for_timeout(55)
            page.wait_for_timeout(300)
            page.evaluate('''async()=>{await Promise.all([...document.images].filter(i=>i.complete&&i.naturalWidth).map(i=>i.decode().catch(()=>{})));}''')
            page.evaluate('scrollTo(0,0)'); page.wait_for_timeout(250)
            assert page.locator('h1').count() or page.locator('h2').count(), 'No page content'
            page.screenshot(path=str(OUT/f'{slug}-phone.png'))
            headings = page.locator('h1,h2').evaluate_all('''els=>els.filter(e=>e.getClientRects().length).map(e=>({text:e.textContent.trim(),y:Math.round(e.getBoundingClientRect().top+scrollY)}))''')
            # Avoid placing a fixed bottom enquiry bar over the first screen of a tall PNG.
            page.evaluate('''()=>{for(const el of document.querySelectorAll('body *')){const s=getComputedStyle(el),r=el.getBoundingClientRect();if(s.position==='fixed'&&r.top>innerHeight/2&&r.width>0)el.setAttribute('data-full-shot-floating','');}}''')
            page.screenshot(path=str(OUT/f'{slug}-full.png'), full_page=True,
                            style='[data-full-shot-floating] {visibility:hidden !important; pointer-events:none !important;}')
            report['pages'].append({'id':slug,'path':path,'title':title,'headings':headings,
                'height':page.evaluate('document.documentElement.scrollHeight'), 'page_errors':page_errors,
                'image':f'{slug}-full.png','viewport_image':f'{slug}-phone.png'})
        except Exception as error:
            report['errors'].append(f'{slug}: {error}')
            page.screenshot(path=str(OUT/f'{slug}-failure.png'))
        finally:
            ctx.close()
    browser.close()
(OUT/'site-review.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(report,ensure_ascii=False,indent=2))
sys.exit(1 if report['errors'] else 0)
