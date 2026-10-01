"""Browser checks against the frozen grade4 source; never submit live leads."""
from pathlib import Path
from urllib.parse import urlparse
import json, subprocess, sys, traceback, os
from playwright.sync_api import sync_playwright, expect
AFTER, BEFORE = [s.rstrip('/') for s in sys.argv[1:3]]
OUT=Path(sys.argv[3]); OUT.mkdir(parents=True,exist_ok=True)
BASE='e587ecb3d7828522ec9957d11e83d1ef296b0425'
report={'base':BASE,'commit':subprocess.check_output(['git','rev-parse','HEAD'],text=True).strip(),'mobile':[],'errors':[],'live_leads':0,'mock_posts':0}
for path in ['src/config/albumPackages.ts','src/config/albumCommercial.ts','server/index.mjs','src/components/CTA.tsx','src/pages/Kindergarten.tsx','src/pages/SchoolGrade4.tsx','src/components/TopBar.tsx','src/components/Footer.tsx','src/components/Process.tsx','src/components/school/grade4-mobile-v8.css']:
 assert Path(path).read_bytes()==subprocess.check_output(['git','show',f'{BASE}:{path}']),path
assert not subprocess.check_output(['git','diff','--name-only',BASE,'HEAD','--','public','src/assets','server'],text=True).strip()

def setup(browser,width,url,route='/school/9-11'):
 ctx=browser.new_context(viewport={'width':width,'height':844},is_mobile=True,has_touch=True,reduced_motion='reduce')
 posts=[]; response={'fail':False}; errors=[]
 def gate(r):
  if r.request.method=='POST' and urlparse(r.request.url).path=='/api/leads':
   posts.append(r.request.post_data_json);report['mock_posts']+=1
   r.fulfill(status=503 if response['fail'] else 201,content_type='application/json',body=json.dumps({'ok':not response['fail'],'leadId':None if response['fail'] else 123}));return
  if r.request.method in ('GET','HEAD') and urlparse(r.request.url).hostname in ('127.0.0.1','localhost','fonts.googleapis.com','fonts.gstatic.com'):r.continue_()
  else:r.abort()
 ctx.route('**/*',gate);page=ctx.new_page();page.set_default_timeout(12000)
 page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto(url+route+'?utm_source=qa&utm_medium=offline&utm_campaign=senior&utm_content=preview&yclid=456',wait_until='networkidle')
 page.add_style_tag(content='*{animation:none!important;transition:none!important;scroll-behavior:auto!important}')
 page.evaluate('document.fonts.ready')
 consent=page.get_by_role('button',name='Только необходимые',exact=True)
 if consent.count():consent.click()
 return ctx,page,posts,response,errors

def pos(page,sel):
 page.locator(sel).evaluate('(e)=>scrollTo(0,e.getBoundingClientRect().top+scrollY-75)');page.wait_for_timeout(180)
def fit(page,sel):
 bad=page.locator(sel).evaluate('''root=>[...root.querySelectorAll('h1,h2,h3,p,button,a,input,label,select')].filter(e=>e.getClientRects().length&&!e.closest('[aria-hidden="true"],[hidden],details:not([open])')).filter(e=>{let r=e.getBoundingClientRect();return r.left < -1 || r.right>innerWidth+1 || e.scrollHeight>e.clientHeight+3}).map(e=>e.textContent.slice(0,90))''')
 assert not bad,bad

def swipe(ctx,page,selector):
 pos(page,selector);rail=page.locator(selector);rail.evaluate('e=>e.scrollTo({left:0,behavior:"instant"})');page.wait_for_timeout(150)
 box=rail.bounding_box();y=min(650,box['y']+box['height']/2);x=box['x']+box['width']*.85;end=box['x']+box['width']*.15
 cdp=ctx.new_cdp_session(page);cdp.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':x,'y':y}]})
 for i in range(1,11):
  cdp.send('Input.dispatchTouchEvent',{'type':'touchMove','touchPoints':[{'x':x+(end-x)*i/10,'y':y}]});page.wait_for_timeout(25)
 cdp.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]});page.wait_for_timeout(350)
 assert rail.evaluate('e=>e.scrollLeft')>20,'Swipe did not move the rail';cdp.detach()

with sync_playwright() as pw:
 for engine,widths in [('chromium',[320,360,390,430,767]),('webkit',[320,390])]:
  browser=getattr(pw,engine).launch()
  for width in widths:
   ctxs=[];a=None;phase='start'
   try:
    bc,b,_,_,be=setup(browser,width,BEFORE);ctxs.append(bc)
    base_steps=b.locator('#process article').evaluate_all('es=>es.map(e=>({title:e.querySelector("h3").textContent,text:e.querySelector("h3 + p").textContent,timing:e.querySelector(".mt-auto p")?.textContent||""}))')
    base_roles=b.locator('#participants article').evaluate_all('es=>es.map(e=>e.textContent)')
    base_height=b.evaluate('document.documentElement.scrollHeight')
    more=b.locator('#school-faq').get_by_role('button',name='Смотреть ещё',exact=True)
    while more.count():more.click()
    base_questions=b.locator('#school-faq button[aria-expanded]').all_text_contents()
    assert len(base_questions)==25 and len(set(base_questions))==25
    ac,a,posts,response,ae=setup(browser,width,AFTER);ctxs.append(ac)
    phase='catalog';assert a.locator('.senior-mobile-v9').count()==1
    assert a.locator('.km-v2-tab').count()==5
    assert '10 альбомов' in a.locator('.km-v2-heading').inner_text()
    assert '6 и 10 страниц можно сочетать' in a.locator('.km-v2-heading').inner_text()
    for i,price in enumerate(['2 700 ₽','2 950 ₽','3 300 ₽','3 900 ₽','6 500 ₽']):
     a.locator('.km-v2-tab').nth(i).click();expect(a.locator('.km-v2-price strong')).to_have_text(price)
     image=a.locator('.km-v2-preview img');a.wait_for_function('e=>e.complete&&e.naturalWidth>0',arg=image.element_handle())
     assert '/layouts-school/' in image.get_attribute('src');assert a.locator('[data-open="video"]').count()==0
     if engine=='chromium' and width==390:
      pos(a,'#albums');a.locator('#albums').screenshot(path=str(OUT/f'catalog-{i+1}.png'))
    a.locator('.km-v2-tab').nth(3).click();pos(a,'#albums');a.locator('[data-open="details"]').click()
    text=a.locator('.km-v2-sheet').inner_text();assert 'Школьные годы' in text and '10 альбомов' in text
    assert 'суммарно на класс' in text and 'в любом соотношении' in text
    assert 'воспитател' not in text.lower() and 'История детства' not in text and 'одного выбранного формата' not in text
    if engine=='chromium' and width==390:a.screenshot(path=str(OUT/'details.png'))
    a.get_by_role('button',name='Закрыть панель').click()
    a.locator('[data-open="comparison"]').click();a.locator('[data-compare-id="six-pages"]').click()
    expect(a.locator('.km-v2-card')).to_have_attribute('data-selected-album','six-pages')
    a.locator('.km-v2-tab').nth(3).click()
    phase='gallery'
    for kind,count,label in [('portrait',4,'Портреты'),('group',6,'Друзья'),('life',2,'Жизнь класса')]:
     a.locator('.kg3-photo-filters').get_by_role('button',name=label,exact=True).click()
     assert a.locator('.kg3-photo-slide').count()==count
     imgs=a.locator('.kg3-photo-slide img').evaluate_all('es=>es.map(e=>e.getAttribute("src"))');assert all('/school-stories/' in src for src in imgs)
     pos(a,'#gallery');a.locator('.kg3-photo-slide button').first.click();a.get_by_role('dialog').wait_for()
     assert '9–11' in a.locator('.kg3-lightbox h2').inner_text()
     assert '/school-stories/' in a.locator('.kg3-lightbox-image').get_attribute('src')
     a.get_by_role('button',name='Закрыть фотографию').click()
    a.locator('.kg3-photo-filters').get_by_role('button',name='Портреты',exact=True).click()
    phase='process';new_steps=a.locator('.kgp6-card').evaluate_all('es=>es.map(e=>({title:e.querySelector("h3").textContent,text:e.querySelector(".kgp6-description").textContent,timing:e.querySelector(".kgp6-timing")?.textContent||""}))')
    assert new_steps==base_steps,(new_steps,base_steps)
    assert len(new_steps)==6
    assert a.locator('.g4-participant').evaluate_all('es=>es.map(e=>e.textContent)')==base_roles
    pos(a,'#process')
    for i in range(6):
     a.locator(f'.kgp6-navigation button[data-step="{i}"]').click();expect(a.locator('.kgp6-controls p')).to_have_text(f'Шаг {i+1} из 6')
    a.locator('.kgp6-navigation button').first.click()
    phase='layouts';total=0
    for i,count in enumerate([11,7,11,11,11,7]):
     a.locator('.g4-layout-tabs button').nth(i).click();a.locator('.g4-layout-cover').click()
     sheet=a.locator('.g4-layout-sheet');expect(sheet).to_be_visible();assert sheet.locator('.kg7-slide').count()==count;total+=count
     rail=sheet.locator('.kg7-rail');assert rail.evaluate('e=>getComputedStyle(e).display')=='flex'
     rail.focus();rail.press('End');expect(sheet.locator('.kg7-swipe')).to_have_attribute('data-current',str(count-1))
     a.wait_for_function('e=>e.complete&&e.naturalWidth>0',arg=sheet.locator('img').last.element_handle())
     if i==0 and width==390 and engine=='chromium':a.screenshot(path=str(OUT/'layouts-open.png'))
     a.get_by_role('button',name='Закрыть макет').click()
    assert total==58;a.locator('.g4-layout-tabs button').first.click()
    phase='faq';assert a.locator('#school-faq .kg3-question-list').first.locator('>details').count()==4
    a.locator('#school-faq .kg3-more-questions > summary').click()
    new_questions=a.locator('#school-faq .kg3-question > summary').all_text_contents();assert sorted(new_questions)==sorted(base_questions)
    a.get_by_text('Есть ли минимальное количество альбомов?',exact=True).click()
    rule=a.locator('#school-faq .kg3-question[open]').inner_text();assert '10 альбомов' in rule and 'суммарно на класс' in rule and 'в любом соотношении' in rule
    a.get_by_text('Есть ли минимальное количество альбомов?',exact=True).click();a.locator('#school-faq .kg3-more-questions > summary').click()
    phase='enquiry';pos(a,'#albums');a.locator('.km-v2-action').click();expect(a.locator('.kg-lead-dialog')).to_be_visible()
    assert 'Школьные годы' in a.locator('.kg-lead-choice').inner_text()
    a.locator('.kg-lead-submit[type="submit"]').click();assert a.locator('.kg-lead-error').count()==4;assert len(posts)==0
    # Validation moves focus in requestAnimationFrame. Wait for that real UI action
    # before typing; otherwise WebKit can redirect a rapid test fill into the name.
    expect(a.locator('#kg-lead-name')).to_be_focused()
    a.locator('#kg-lead-name').fill('Тест родитель');expect(a.locator('#kg-lead-name')).to_have_value('Тест родитель')
    a.locator('#kg-lead-phone').fill('+7 999 0000000');expect(a.locator('#kg-lead-phone')).to_have_value('+7 999 0000000')
    a.locator('#kg-lead-institution').fill('Школа 129');a.locator('input#kg-lead-consent').check()
    expect(a.locator('#kg-lead-name')).to_have_value('Тест родитель')
    if engine=='chromium' and width==390:a.screenshot(path=str(OUT/'form-filled.png'))
    a.get_by_role('button',name='Закрыть заявку').click();pos(a,'#hero');a.locator('.g4-sticky a').click();expect(a.locator('#kg-lead-institution')).to_have_value('Школа 129')
    expect(a.locator('#kg-lead-name')).to_have_value('Тест родитель');expect(a.locator('#kg-lead-phone')).to_have_value('+7 999 0000000')
    response['fail']=True;a.locator('.kg-lead-submit[type="submit"]').click();expect(a.locator('.kg-lead-failure')).to_be_visible()
    assert posts[-1]['audience']=='school' and posts[-1]['schoolLevel']=='grade9_11';assert 'Школьные годы' in posts[-1]['comment']
    assert posts[-1]['tracking']['utmSource']=='qa' and posts[-1]['tracking']['yclid']=='456'
    if engine=='chromium' and width==390:a.screenshot(path=str(OUT/'form-error.png'))
    response['fail']=False;a.locator('.kg-lead-submit[type="submit"]').click();expect(a.locator('.kg-lead-success')).to_be_visible()
    if engine=='chromium' and width==390:a.screenshot(path=str(OUT/'form-success.png'))
    a.get_by_role('button',name='Закрыть заявку').click()
    if width in [320,390]:
     phase='text200';a.add_style_tag(content='html{font-size:200%!important}');a.wait_for_timeout(300)
     for sel in ['#albums','#process','#layouts','#participants']:
      pos(a,sel);fit(a,sel)
     assert a.locator('.km-v2-name h3').evaluate('e=>e.getBoundingClientRect().height/parseFloat(getComputedStyle(e).lineHeight)')<=3.1
     a.add_style_tag(content='html{font-size:100%!important}');a.wait_for_timeout(300)
    if engine=='chromium' and width==390:
     phase='touch';swipe(ac,a,'#participants .kg7-rail');swipe(ac,a,'#process .kgp6-strip');a.locator('.kgp6-navigation button').first.click()
    phase='capture'
    if engine=='chromium' and width==390:
     for name,sel in [('hero','#hero'),('catalog','#albums'),('gallery','#gallery'),('participants','#participants'),('process','#process'),('layouts','#layouts'),('faq','#school-faq')]:
      pos(a,sel);a.screenshot(path=str(OUT/(name+'-phone.png')));a.locator(sel).screenshot(path=str(OUT/(name+'-block.png')))
    assert not ae and not be,ae+be
    report['mobile'].append({'engine':engine,'width':width,'passed':True,'process_steps':6,'photos':12,'designs':6,'layout_pages':58,'faq_count':len(base_questions),'baseline_height':base_height,'height':a.evaluate('document.documentElement.scrollHeight')})
   except Exception:
    err=traceback.format_exc();report['errors'].append({'engine':engine,'width':width,'phase':phase,'error':err});print(err,flush=True)
    if a:a.screenshot(path=str(OUT/f'failure-{engine}-{width}.png'))
   finally:
    for ctx in ctxs:ctx.close()
    (OUT/'qa-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
  browser.close()
assert not report['errors'],report['errors']
