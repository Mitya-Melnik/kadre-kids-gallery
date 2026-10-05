"""Cumulative desktop audit: original layout + approved commercial copy vs mobile candidate.
No live leads or analytics. Full original main and approved mobile snapshots remain frozen.
"""
from pathlib import Path
import json, threading, datetime, functools, traceback
from urllib.parse import urlparse, unquote
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from playwright.sync_api import sync_playwright
from PIL import Image, ImageChops
import numpy as np
ROOT=Path.cwd()
OUT=Path('release-audit/desktop-check'); OUT.mkdir(parents=True,exist_ok=True)
class Handler(SimpleHTTPRequestHandler):
    def do_GET(self):
        path=unquote(urlparse(self.path).path)
        if not Path(self.directory,path.lstrip('/')).is_file() and not Path(path).suffix: self.path='/index.html'
        super().do_GET()
    def log_message(self,*args): pass
servers=[]
for root,port in [(ROOT/'dist',4302),(Path('/tmp/desktop-reference/dist'),4303)]:
    server=ThreadingHTTPServer(('127.0.0.1',port),functools.partial(Handler,directory=str(root)))
    threading.Thread(target=server.serve_forever,daemon=True).start(); servers.append(server)
report={'original':'30469af610eea3ebfac226bf3b86e3b407700f4c','approved':'a3be32716edb16db77a09a059025cd0c00492d46',
    'reference':'Original main plus five approved commercial files and one school-name text replacement; no mobile UI files',
    'network':'Local builds plus Google font files only. All POST and analytics blocked.', 'screens':[], 'errors':[], 'live_leads':0}
JS_SNAPSHOT=r'''() => {
 const dynamic=e=>!!e.closest('[aria-roledescription="carousel"]');
 return [...document.querySelectorAll('h1,h2,h3,h4,p,section,header,footer,article,figure,table,label,input,select,textarea,button,a,img')]
 .filter(e=>e.getClientRects().length && getComputedStyle(e).display!=='none')
 .map(e=>{const s=getComputedStyle(e),r=e.getBoundingClientRect();return {
 tag:e.tagName,text:e.matches('h1,h2,h3,h4,p,label,button,a')?e.innerText.replace(/\s+/g,' ').trim():'',
 src:e.tagName==='IMG'?new URL(e.currentSrc||e.src).pathname:'',
 x:dynamic(e)?null:r.x,y:r.y+scrollY,w:r.width,h:r.height,
 styles:Object.fromEntries(['fontFamily','fontSize','fontWeight','lineHeight','color','backgroundColor','borderRadius','display','gridTemplateColumns','paddingTop','paddingBottom','paddingLeft','paddingRight','marginTop','marginBottom','textAlign','position','opacity'].map(k=>[k,s[k]]))};});
}'''
def paint(page,ms=100):
    # IO/image painting is browser work, not a JavaScript timer advanced by Clock alone.
    page.clock.run_for(50); page.wait_for_timeout(ms); page.clock.run_for(50); page.wait_for_timeout(ms)

def prepare(browser,port,path,width):
    ctx=browser.new_context(viewport={'width':width,'height':1000},reduced_motion='reduce',device_scale_factor=1)
    ctx.route('**/*',lambda route:route.continue_() if urlparse(route.request.url).hostname in ('127.0.0.1','localhost','fonts.googleapis.com','fonts.gstatic.com') and route.request.method in ('GET','HEAD') else route.abort())
    page=ctx.new_page(); page.set_default_timeout(12000); errors=[]; page.on('pageerror',lambda e:errors.append(str(e)))
    page.clock.install(time=datetime.datetime(2026,10,1,12,0,tzinfo=datetime.timezone.utc))
    page.goto(f'http://127.0.0.1:{port}{path}',wait_until='networkidle')
    page.clock.pause_at(datetime.datetime(2026,10,1,12,1,tzinfo=datetime.timezone.utc))
    page.add_style_tag(content='*{transition:none!important;animation:none!important;scroll-behavior:auto!important}')
    paint(page)
    consent=page.get_by_role('button',name='Только необходимые',exact=True)
    if consent.count(): consent.evaluate('e=>e.click()'); paint(page)
    page.evaluate("() => {for(const e of document.querySelectorAll('img'))e.loading='eager';}")
    page.evaluate('() => document.fonts.ready')
    page.evaluate('() => Promise.all([...document.images].map(i=>i.decode().catch(()=>{})))')
    paint(page,200)
    height=page.evaluate('document.documentElement.scrollHeight')
    for y in range(0,height,650):
        page.evaluate('(y)=>scrollTo(0,y)',y); paint(page,60)
    # Reveal each original scroll-animation target through actual scrolling, never CSS overrides.
    for _ in range(3):
        pending=page.locator('.opacity-0').evaluate_all("nodes=>nodes.filter(e=>e.getClientRects().length && !e.closest('details:not([open]),[hidden]')).map(e=>({y:e.getBoundingClientRect().top+scrollY,h:e.getBoundingClientRect().height}))")
        if not pending: break
        for el in pending:
            page.evaluate('(y)=>scrollTo(0,y)',max(0,el['y']+el['h']/2-500)); paint(page,200)
    page.evaluate('scrollTo(0,0)'); paint(page,150)
    for label in ['Слайд 1','Показать отзыв 1','Перейти к слайду 1']:
        buttons=page.get_by_role('button',name=label,exact=True)
        for i in range(buttons.count()): buttons.nth(i).evaluate('e=>e.click()')
    page.clock.run_for(500); paint(page,200)
    page.evaluate('scrollTo(0,0)'); paint(page,100)
    remaining=page.locator('.opacity-0').evaluate_all("nodes=>nodes.filter(e=>e.getClientRects().length && !e.closest('details:not([open]),[hidden]')).map(e=>({tag:e.tagName,text:e.textContent.slice(0,100),height:e.getBoundingClientRect().height}))")
    images=page.locator('img').evaluate_all("nodes=>nodes.filter(e=>e.getClientRects().length && !e.closest('details:not([open]),[hidden]')).map(e=>({src:new URL(e.currentSrc||e.src).pathname,complete:e.complete,naturalWidth:e.naturalWidth}))")
    return ctx,page,errors,{'remaining_scroll_reveals':remaining,'images':images}

def diff_nodes(before,after):
    changes=[]
    if len(before)!=len(after): changes.append({'node_count_before':len(before),'node_count_after':len(after)})
    for i,(a,b) in enumerate(zip(before,after)):
        mismatch={k:[a[k],b[k]] for k in ['tag','text','src','styles'] if a[k]!=b[k]}
        for k in ['x','y','w','h']:
            if a[k] is not None and b[k] is not None and abs(a[k]-b[k])>.2: mismatch[k]=[a[k],b[k]]
        if mismatch: changes.append({'index':i,'tag':a['tag'],'text':a['text'][:90],'difference':mismatch})
    return changes

with sync_playwright() as pw:
    browser=pw.chromium.launch()
    cases=[('/kindergarten',w) for w in [768,1024,1440]]+[('/albums',w) for w in [768,1024,1440]]+[(r,w) for r in ['/school/4','/school/9-11','/'] for w in [1024,1440]]
    for path,width in cases:
        key=(path.strip('/').replace('/','-') or 'home')+f'-{width}'; contexts=[]
        try:
            ca,pa,ea,sa=prepare(browser,4303,path,width); contexts.append(ca)
            cb,pb,eb,sb=prepare(browser,4302,path,width); contexts.append(cb)
            before,after=pa.evaluate(JS_SNAPSHOT),pb.evaluate(JS_SNAPSHOT)
            changes=diff_nodes(before,after)
            (OUT/f'{key}-dom.json').write_text(json.dumps({'before':before,'after':after,'diffs':changes,'reference_readiness':sa,'approved_readiness':sb},ensure_ascii=False,indent=2))
            pa.screenshot(path=str(OUT/f'{key}-reference.png'),full_page=True)
            pb.screenshot(path=str(OUT/f'{key}-approved.png'),full_page=True)
            a=Image.open(OUT/f'{key}-reference.png').convert('RGB'); b=Image.open(OUT/f'{key}-approved.png').convert('RGB')
            pixels={'same_size':a.size==b.size,'before_size':a.size,'after_size':b.size}
            if a.size==b.size:
                delta=np.any(np.asarray(a)!=np.asarray(b),axis=2)
                pixels.update(different_pixels=int(delta.sum()),difference_fraction=float(delta.mean()))
                ImageChops.difference(a,b).save(OUT/f'{key}-pixel-diff.png')
            item={'path':path,'width':width,'dom_differences':len(changes),'page_errors':ea+eb,'pixels':pixels,'remaining_scroll_reveals_reference':len(sa['remaining_scroll_reveals']),'remaining_scroll_reveals_approved':len(sb['remaining_scroll_reveals'])}
            report['screens'].append(item); print(json.dumps(item,ensure_ascii=False),flush=True)
        except Exception:
            error=traceback.format_exc(); report['errors'].append({'case':key,'error':error}); print(error,flush=True)
        finally:
            for ctx in contexts: ctx.close()
            (OUT/'desktop-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
    browser.close()
for server in servers: server.shutdown()
assert not report['errors'],report['errors']
assert all(s['dom_differences']==0 and not s['page_errors'] for s in report['screens']), 'Desktop differences require review'
