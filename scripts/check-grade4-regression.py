"""Compare the unchanged desktop and other routes against the approved release."""
from pathlib import Path
import datetime,json,sys,traceback
from urllib.parse import urlparse
from playwright.sync_api import sync_playwright
from PIL import Image, ImageChops
import numpy as np
AFTER,BEFORE=[int(x) for x in sys.argv[1:3]]
OUT=Path(sys.argv[3]);OUT.mkdir(exist_ok=True,parents=True)
report={'reference':'1673a16 approved release','screens':[],'errors':[],'live_leads':0}
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

with sync_playwright() as p:
 b=p.chromium.launch()
 for route,width in [('/school/4',768),('/school/4',1024),('/school/4',1440),('/kindergarten',390),('/kindergarten',1440),('/school/9-11',390),('/school/9-11',1440),('/albums',390),('/albums',1440),('/',390),('/',1440)]:
  contexts=[];key=(route.strip('/').replace('/','-') or 'home')+'-'+str(width)
  try:
   ca,pa,ea,_=prepare(b,BEFORE,route,width);contexts.append(ca)
   cb,pb,eb,_=prepare(b,AFTER,route,width);contexts.append(cb)
   changes=diff_nodes(pa.evaluate(JS_SNAPSHOT),pb.evaluate(JS_SNAPSHOT))
   pa.screenshot(path=str(OUT/(key+'-before.png')),full_page=True);pb.screenshot(path=str(OUT/(key+'-after.png')),full_page=True)
   a=Image.open(OUT/(key+'-before.png')).convert('RGB');c=Image.open(OUT/(key+'-after.png')).convert('RGB')
   pixels=int(np.any(np.asarray(a)!=np.asarray(c),axis=2).sum()) if a.size==c.size else -1
   (OUT/(key+'-diff.json')).write_text(json.dumps(changes,ensure_ascii=False,indent=2))
   if a.size==c.size and pixels:ImageChops.difference(a,c).save(OUT/(key+'-diff.png'))
   report['screens'].append({'route':route,'width':width,'dom_differences':len(changes),'different_pixels':pixels,'page_errors':ea+eb})
  except Exception:report['errors'].append({'route':route,'width':width,'trace':traceback.format_exc()})
  finally:
   for c in contexts:c.close()
   (OUT/'regression-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
 b.close()
assert not report['errors'],report['errors']
assert all(s['dom_differences']==0 and not s['page_errors'] for s in report['screens']), 'Unexpected regression requires review'
