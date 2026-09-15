from pathlib import Path
from playwright.sync_api import sync_playwright
import json, os
root=Path(os.environ.get('MYOWN_TEST_OUTPUT', str(Path(__file__).resolve().parent.parent/'work'/'verification')))
root.mkdir(parents=True,exist_ok=True)
with sync_playwright() as p:
 b=p.chromium.launch(executable_path=r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe',headless=True)
 page=b.new_page(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,device_scale_factor=2);errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto(os.environ.get('MYOWN_TEST_URL','http://127.0.0.1:8877'));page.wait_for_selector('.page-head')
 page.evaluate('localStorage.setItem("myown_items",JSON.stringify([{id:"one",name:"电脑",price:8000,purchaseDate:"2025-09-15",usageCount:0,costType:"daily",status:"using",category:"数码",icon:"laptop",isPinned:true}]))');page.reload();page.wait_for_selector('.trend-curve')
 results=[]
 def tap_check(locator,scene):
  locator.scroll_into_view_if_needed();page.wait_for_timeout(50)
  assert locator.evaluate('(e)=>getComputedStyle(e).webkitTapHighlightColor')=='rgba(0, 0, 0, 0)'
  page.evaluate('window.framesCheck=[];window.sampling=true;function sample(){const e=document.querySelector(".motion-surface");window.framesCheck.push(e?Number(getComputedStyle(e).opacity):-1);if(window.sampling)requestAnimationFrame(sample)};requestAnimationFrame(sample)')
  locator.tap();page.wait_for_timeout(420);page.evaluate('window.sampling=false')
  samples=page.evaluate('window.framesCheck');assert min(samples)==1,(scene,samples)
  results.append({'scene':scene,'sampledFrames':len(samples),'minOpacity':min(samples)})
 tap_check(page.get_by_role('button',name='90 天',exact=True),'30→90')
 tap_check(page.get_by_role('button',name='30 天',exact=True),'90→30')
 tap_check(page.get_by_role('navigation').get_by_role('button',name='物品',exact=True),'总览→物品')
 tap_check(page.get_by_role('button',name='已售出',exact=True),'物品：使用中→已售出')
 tap_check(page.get_by_role('button',name='使用中',exact=True),'物品：已售出→使用中')
 tap_check(page.get_by_role('navigation').get_by_role('button',name='分析',exact=True),'物品→分析')
 tap_check(page.get_by_role('button',name='已售出',exact=True),'分析：使用中→已售出')
 tap_check(page.get_by_role('button',name='使用中',exact=True),'分析：已售出→使用中')
 page.get_by_label('添加物品',exact=True).tap();page.wait_for_timeout(350)
 tap_check(page.get_by_role('button',name='按次使用',exact=True),'添加：按天→按次')
 tap_check(page.get_by_role('button',name='按天均摊',exact=True),'添加：按次→按天')
 assert page.locator('.usage-reveal').evaluate('(e)=>getComputedStyle(e).opacity')=='1'
 page.keyboard.press('Escape');tap_check(page.get_by_role('navigation').get_by_role('button',name='总览',exact=True),'分析→总览')
 page.get_by_label('设置',exact=True).tap();page.get_by_role('button',name='深色',exact=True).tap();page.keyboard.press('Escape');tap_check(page.get_by_role('button',name='90 天',exact=True),'深色：30→90')
 page.screenshot(path=str(root/'touch-dark.png'))
 page.emulate_media(reduced_motion='reduce');tap_check(page.get_by_role('navigation').get_by_role('button',name='物品',exact=True),'减少动态效果')
 assert not errors,errors
 (root/'touch-results.json').write_text(json.dumps(results,ensure_ascii=False,indent=2),encoding='utf-8')
 print(json.dumps({'result':'PASS','scenarios':len(results),'all_frames_opaque':True,'tap_highlight':'transparent','errors':errors}))
 b.close()
