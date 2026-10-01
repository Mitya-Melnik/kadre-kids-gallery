"""First-visit mobile controls must fit before consent is dismissed. No live analytics."""
from pathlib import Path
from urllib.parse import urlparse
from playwright.sync_api import sync_playwright, expect
import json, sys
url=sys.argv[1].rstrip('/');out=Path(sys.argv[2]);out.mkdir(parents=True,exist_ok=True)
report={'checks':[],'errors':[],'live_leads':0}
with sync_playwright() as p:
 for engine in ['chromium','webkit']:
  browser=getattr(p,engine).launch()
  for width in [320,390]:
   ctx=browser.new_context(viewport={'width':width,'height':844},is_mobile=True,has_touch=True)
   ctx.route('**/*',lambda r:r.continue_() if r.request.method in ['GET','HEAD'] and urlparse(r.request.url).hostname in ['127.0.0.1','localhost','fonts.googleapis.com','fonts.gstatic.com'] else r.abort())
   page=ctx.new_page();page.set_default_timeout(12000)
   try:
    page.goto(url+'/school/4',wait_until='networkidle')
    banner=page.get_by_label('Настройки аналитики',exact=True);expect(banner).to_be_visible()
    assert banner.locator('button').count()==2
    bad=banner.locator('button').evaluate_all('es=>es.filter(e=>{let r=e.getBoundingClientRect();return r.left<0||r.right>innerWidth||r.height<44||e.scrollHeight>e.clientHeight+2}).map(e=>e.textContent)')
    assert not bad,bad
    page.screenshot(path=str(out/f'first-visit-{engine}-{width}.png'))
    banner.get_by_role('button',name='Только необходимые',exact=True).click()
    expect(banner).to_have_count(0)
    assert page.evaluate('localStorage.getItem("detivkadre-analytics-consent")')=='declined'
    report['checks'].append({'engine':engine,'width':width,'passed':True})
   except Exception as e:report['errors'].append({'engine':engine,'width':width,'error':str(e)})
   finally:ctx.close()
  browser.close()
(out/'first-visit-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
assert not report['errors'],report['errors']
