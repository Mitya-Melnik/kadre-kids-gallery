"""Capture stable mobile states and verify inline/floating CTA coordination."""
from pathlib import Path
from urllib.parse import urlparse
import json,sys
from playwright.sync_api import sync_playwright

BASE=sys.argv[1].rstrip('/');OUT=Path(sys.argv[2]);OUT.mkdir(parents=True,exist_ok=True)
report={'frames':[],'errors':[],'forms_submitted':0}

def allow_local(route):
    if route.request.method not in ('GET','HEAD') or urlparse(route.request.url).hostname not in ('127.0.0.1','localhost','fonts.googleapis.com','fonts.gstatic.com'):
        route.abort()
    else:route.continue_()

def settle(page):
    # IntersectionObserver can update computed styles before the compositor paints.
    page.evaluate('()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))')
    page.wait_for_timeout(400)

with sync_playwright() as p:
    for engine in ('chromium','webkit'):
        browser=getattr(p,engine).launch()
        ctx=browser.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,device_scale_factor=1,reduced_motion='reduce')
        ctx.route('**/*',allow_local)
        page=ctx.new_page();page.set_default_timeout(12000)
        try:
            page.goto(BASE+'/kindergarten?utm_source=qa',wait_until='networkidle')
            page.evaluate('document.fonts.ready')
            consent=page.get_by_role('button',name='Только необходимые',exact=True)
            if consent.count():consent.tap()
            for album_id in ('ten-pages','folder','trio','six-pages','fourteen-pages'):
                page.locator('#albums').evaluate('el=>el.scrollIntoView({block:"start",behavior:"instant"})')
                before=page.evaluate('scrollY')
                page.locator(f'.km-v2-tab[data-album-id="{album_id}"]').tap()
                page.wait_for_function('(id)=>document.querySelector(".km-v2-card").dataset.selectedAlbum===id',arg=album_id)
                page.wait_for_function('document.querySelector(".km-v2-preview img")?.naturalWidth>0')
                page.locator('.km-v2-preview img').evaluate('el=>el.decode()')
                page.wait_for_function('document.querySelector(".km-catalog-v2").hasAttribute("data-inline-action-visible")')
                settle(page)
                assert abs(page.evaluate('scrollY')-before)<=2,'Switching tabs changed viewport scroll'
                state=page.locator('.km-catalog-v2').evaluate('el=>{const r=el.getBoundingClientRect();return {top:r.top,height:r.height,bottom:r.bottom}}')
                assert state['top']>=64 and state['bottom']<=844,'Catalog does not fit reference viewport'
                hidden=page.locator('.kindergarten-mobile-v1 > .fixed').evaluate_all('els=>els.every(el=>getComputedStyle(el).visibility==="hidden")')
                assert hidden,'Floating controls overlap the catalog'
                page.screenshot(path=str(OUT/f'{engine}-screen-{album_id}-390.png'))
                report['frames'].append({'engine':engine,'album':album_id,'bounds':state,'floating_controls_hidden':hidden})
            page.locator('.km-v2-tab[data-album-id="ten-pages"]').tap()
            page.wait_for_function('document.querySelector(".km-v2-preview img")?.naturalWidth>0')
            page.locator('.km-v2-preview img').evaluate('el=>el.decode()')
            for panel in ('details','comparison','image','video'):
                page.locator(f'.km-catalog-v2 [data-open="{panel}"]').tap()
                page.get_by_role('dialog').wait_for()
                if panel=='image':
                    page.wait_for_function('document.querySelector(".km-v2-large-image")?.naturalWidth>0')
                    page.locator('.km-v2-large-image').evaluate('el=>el.decode()')
                settle(page)
                page.screenshot(path=str(OUT/f'{engine}-sheet-{panel}-390.png'))
                page.get_by_role('button',name='Закрыть панель',exact=True).tap()
                page.get_by_role('dialog').wait_for(state='detached')
            page.evaluate('scrollTo({top:0,behavior:"instant"})')
            page.wait_for_function('!document.querySelector(".km-catalog-v2").hasAttribute("data-inline-action-visible")')
            assert page.locator('.kindergarten-mobile-v1 > .fixed.inset-x-0').evaluate('el=>getComputedStyle(el).visibility==="visible"'),'Sticky CTA did not return outside catalog'
        except Exception as exc:
            report['errors'].append(f'{engine}: {exc}')
            page.screenshot(path=str(OUT/f'{engine}-capture-failure.png'))
        finally:
            ctx.close();browser.close()
(OUT/'viewport-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(report,ensure_ascii=False,indent=2))
sys.exit(1 if report['errors'] else 0)
