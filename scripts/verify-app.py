# 运行：先启动开发服务器（NODE_ENV=development npx next dev --webpack -p 8871），
#      再执行 python scripts/verify-app.py
from playwright.sync_api import sync_playwright
from pathlib import Path
import json
base=Path(__file__).resolve().parent  # 截图落在本脚本所在目录
with sync_playwright() as p:
 b=p.chromium.launch(executable_path=r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe',headless=True)
 page=b.new_page(viewport={'width':390,'height':844});errors=[];external=[]
 page.on('pageerror',lambda e:errors.append(str(e)))
 page.on('request',lambda r:external.append(r.url) if r.url.startswith('http') and '127.0.0.1' not in r.url else None)
 page.goto('http://127.0.0.1:8871');page.wait_for_selector('.page-head')
 assert page.locator('.item-row').count()==0
 legacy=[{'id':'legacy-1','name':'旧版电脑','price':1000,'purchaseDate':'2025-01-01T00:00:00.000Z','usageCount':0,'costType':'daily','status':'using','category':'科技','icon':'💻','isPinned':True}]
 page.evaluate('(x)=>localStorage.setItem("myown_items",JSON.stringify(x))',legacy);page.reload();page.wait_for_selector('.item-row')
 page.get_by_role('button',name='添加物品',exact=True).click()
 page.get_by_label('物品名称').fill('验证音箱')
 page.get_by_label('购入价格',exact=True).fill('800')
 page.get_by_role('button',name='分类：数码',exact=True).click()
 page.get_by_label('搜索选项').fill('音频')
 page.get_by_role('button',name='音频',exact=True).click()
 page.get_by_role('button',name='图标：耳机',exact=True).click()
 assert page.locator('dialog[open]').last.locator('.choice-option').count()==3
 page.get_by_role('button',name='音箱',exact=True).click()
 page.get_by_role('button',name='按次使用',exact=True).click()
 page.get_by_label('累计使用次数').fill('4')
 page.get_by_role('button',name='购入日期：',exact=False).click()
 page.get_by_role('button',name='选择年份和月份').click()
 page.get_by_label('年份',exact=True).fill('2024');page.get_by_label('年份',exact=True).press('Tab')
 page.get_by_role('button',name='2月',exact=True).click();page.get_by_role('button',name='2024-02-29',exact=True).click()
 page.get_by_role('button',name='使用这个日期').click()
 page.locator('form button[type="submit"]').click()
 saved=page.evaluate('JSON.parse(localStorage.getItem("myown_items"))')
 item=next(x for x in saved if x['name']=='验证音箱')
 assert item['icon']=='speaker' and item['category']=='音频' and item['purchaseDate']=='2024-02-29'
 page.get_by_role('navigation').get_by_role('button',name='物品',exact=True).click()
 page.locator('.item-row').filter(has_text='验证音箱').click()
 assert '200.00' in page.locator('.detail-cost').inner_text()
 page.get_by_role('button',name='记录一次使用').click()
 assert '160.00' in page.locator('.detail-cost').inner_text()
 page.get_by_role('button',name='置顶物品',exact=True).click()
 page.get_by_role('button',name='编辑信息',exact=True).click()
 assert page.get_by_role('button',name='图标：音箱',exact=True).is_visible()
 page.get_by_label('物品名称').fill('验证音箱已编辑');page.locator('form button[type="submit"]').click()
 page.reload();page.wait_for_selector('.page-head')
 assert page.locator('.item-row').filter(has_text='验证音箱已编辑').count()>=1
 page.wait_for_timeout(300);page.screenshot(path=str(base/'app-home-light.png'))
 page.get_by_role('navigation').get_by_role('button',name='物品',exact=True).click()
 page.get_by_label('搜索物品').fill('没有这件东西')
 assert page.locator('.item-row').count()==0
 page.get_by_label('搜索物品').fill('');page.locator('.item-row').filter(has_text='验证音箱已编辑').click()
 page.get_by_role('button',name='标记为已售出').click();page.get_by_role('button',name='恢复为使用中').click()
 page.get_by_role('button',name='删除物品',exact=True).click();page.get_by_role('button',name='保留物品').click()
 page.keyboard.press('Escape')
 page.locator('.item-row').filter(has_text='旧版电脑').click();page.get_by_role('button',name='编辑信息').click()
 page.locator('form button[type="submit"]').click()
 old=next(x for x in page.evaluate('JSON.parse(localStorage.getItem("myown_items"))') if x['id']=='legacy-1')
 assert old['icon']=='💻' and old['category']=='科技' and old['isPinned']
 page.get_by_role('navigation').get_by_role('button',name='总览',exact=True).click();page.get_by_role('button',name='设置',exact=True).click()
 page.get_by_role('button',name='深色',exact=True).click();page.keyboard.press('Escape')
 page.wait_for_timeout(300);page.screenshot(path=str(base/'app-home-dark.png'))
 for width in [320,390,430,768,1440]:
  page.set_viewport_size({'width':width,'height':900})
  assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
 page.set_viewport_size({'width':390,'height':844})
 page.get_by_role('button',name='设置',exact=True).click();page.get_by_role('button',name='浅色',exact=True).click();page.keyboard.press('Escape')
 page.get_by_role('button',name='添加物品',exact=True).click()
 page.keyboard.press('Escape')
 # ---- 滑动操作：右滑置顶 / 左滑删除 ----
 def row_tx():
  return page.evaluate("(()=>{const r=document.querySelector('.swipe-row .item-row');return +new DOMMatrixReadOnly(getComputedStyle(r).transform).m41.toFixed(1)})()")
 def settle_row():
  page.evaluate("(()=>{const s=document.querySelector('.scroll'),r=document.querySelector('.swipe-row');const rb=r.getBoundingClientRect(),sb=s.getBoundingClientRect();s.scrollTop+=(rb.top-sb.top)-220})()")
  page.wait_for_timeout(120)
 def drag(dx,dy=0):
  box=page.locator('.swipe-row').first.bounding_box()
  x,y=box['x']+box['width']/2,box['y']+box['height']/2
  page.mouse.move(x,y);page.mouse.down()
  for i in range(1,15):
   page.mouse.move(x+dx*i/14,y+dy*i/14);page.wait_for_timeout(16)
  page.mouse.up();page.wait_for_timeout(420)
 page.get_by_role('navigation').get_by_role('button',name='物品',exact=True).click()
 assert page.locator('.swipe-row').count()>=1
 settle_row();drag(0,-60)
 assert row_tx()==0,'竖向拖动误触发滑动'          # 竖滑须交给原生滚动
 settle_row();drag(110)
 assert row_tx()==82,'右滑未吸附到 82'            # 右滑露出置顶
 pin_before=next(x for x in page.evaluate('JSON.parse(localStorage.getItem("myown_items"))') if x['id']=='legacy-1')['isPinned']
 page.locator('.swipe-row .swipe-action.pin').first.click();page.wait_for_timeout(500)
 pin_after=next(x for x in page.evaluate('JSON.parse(localStorage.getItem("myown_items"))') if x['id']=='legacy-1')['isPinned']
 assert pin_after!=pin_before,'右滑置顶未写回存储'
 settle_row();drag(30)
 assert row_tx()==0,'小于阈值的位移未回弹'
 settle_row();drag(-110)
 assert row_tx()==-82,'左滑未吸附到 -82'          # 左滑露出删除
 page.locator('.swipe-row .swipe-action.del').first.click();page.wait_for_timeout(400)
 assert page.locator('dialog[open] h2').inner_text()=='删除这件物品？','滑动删除未弹确认'
 page.get_by_role('button',name='保留物品').click();page.wait_for_timeout(400)
 assert page.locator('.item-row').filter(has_text='旧版电脑').count()>=1,'取消删除后物品丢失'
 assert not external,external
 assert not errors,errors
 corrupt=b.new_page();corrupt.goto('http://127.0.0.1:8871');corrupt.evaluate('localStorage.setItem("myown_items","broken")');corrupt.reload()
 corrupt.get_by_role('alert').filter(has_text='暂停保存').wait_for()
 assert corrupt.evaluate('localStorage.getItem("myown_items")')=='broken'
 assert corrupt.get_by_label('添加物品').is_disabled()
 print(json.dumps({'result':'PASS','checks':'empty install, legacy data, add/edit/pin/use/sale/delete cancel, linked icons, leap date, reload, themes, responsive, swipe pin/delete, corrupt data protection','external_requests':external,'errors':errors}))
 b.close()



