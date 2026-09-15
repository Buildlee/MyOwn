from pathlib import Path
from playwright.sync_api import sync_playwright
import json, os
root=Path(os.environ.get('MYOWN_TEST_OUTPUT', str(Path(__file__).resolve().parent.parent/'work'/'verification')))
root.mkdir(parents=True,exist_ok=True)
with sync_playwright() as p:
 b=p.chromium.launch(executable_path=r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe',headless=True)
 page=b.new_page(viewport={'width':390,'height':844});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto(os.environ.get('MYOWN_TEST_URL','http://127.0.0.1:8877'));page.wait_for_selector('.page-head')
 seed=[dict(id=str(i),name=n,price=price,quantity=q,purchaseDate=date,usageCount=use,costType=mode,status='using',category=cat,icon=ico,isPinned=True) for i,(n,price,q,date,use,mode,cat,ico) in enumerate([('电脑',8999,1,'2025-09-15',0,'daily','数码','laptop'),('耳机',1899,1,'2026-03-15',0,'daily','音频','headphones'),('咖啡壶',369,2,'2026-09-01',18,'per_use','厨房','coffee')])]
 page.evaluate('(x)=>localStorage.setItem("myown_items",JSON.stringify(x))',seed);page.reload();page.wait_for_selector('.item-row')
 page.get_by_role('button',name='90 天',exact=True).click();slider=page.get_by_label('查看预测天数');slider.focus();slider.press('Home');assert slider.input_value()=='0';slider.press('ArrowRight');assert slider.input_value()=='1'
 page.get_by_role('button',name='30 天',exact=True).click();page.screenshot(path=str(root/'240-home.png'))
 page.get_by_role('navigation').get_by_role('button',name='物品',exact=True).click()
 for name,count in [('购入单价',3),('购入总价',3),('日均成本',2),('单次成本',1),('持有时长',3),('购入日期',3),('使用次数',1),('物品名称',3)]:
  page.get_by_label('排序维度').click();page.get_by_role('button',name=name,exact=True).click();assert page.locator('.item-row').count()==count
  page.locator('.sort-direction').first.click()
 page.get_by_label('排序维度').click();page.get_by_role('button',name='购入单价',exact=True).click();page.screenshot(path=str(root/'240-sort.png'))
 page.get_by_label('添加物品',exact=True).click();page.get_by_label('物品名称').fill('旅行杯');page.get_by_label('购入总价').fill('240');page.get_by_label('数量',exact=True).fill('3')
 page.get_by_role('button',name='分类：数码').click();page.get_by_label('搜索选项').fill('旅行用品');page.get_by_role('button',name='创建“旅行用品”分类').click();page.get_by_label('搜索选项').fill('咖啡');page.get_by_role('button',name='咖啡',exact=True).click()
 assert page.get_by_role('button',name='图标：咖啡').is_visible()
 page.get_by_role('button',name='购入日期：',exact=False).click();page.wait_for_timeout(350);page.evaluate('window.calNode=document.querySelectorAll("dialog[open]")[1]')
 h=page.locator('.day-grid').bounding_box()['height']
 for i in range(8):
  page.get_by_label('上个月',exact=True).click();assert page.locator('.day-grid').bounding_box()['height']==h;assert page.evaluate('window.calNode===document.querySelectorAll("dialog[open]")[1]')
 page.get_by_role('button',name='使用这个日期').click();page.locator('button[type=submit]').click()
 saved=page.evaluate('JSON.parse(localStorage.getItem("myown_items"))');added=next(x for x in saved if x['name']=='旅行杯');assert added['quantity']==3 and added['price']==240 and added['icon']=='coffee'
 page.reload();page.wait_for_selector('.page-head');page.get_by_label('添加物品',exact=True).click();page.get_by_role('button',name='分类：数码').click();page.get_by_label('搜索选项').fill('旅行用品');page.get_by_role('button',name='旅行用品',exact=True).click();assert page.get_by_role('button',name='图标：咖啡').is_visible();page.keyboard.press('Escape')
 page.get_by_label('设置',exact=True).click();page.get_by_role('button',name='更新日志',exact=True).click();assert '2.4.0' in page.locator('dialog[open]').last.inner_text();page.keyboard.press('Escape');page.get_by_role('button',name='关于 MyOwn',exact=True).click();assert page.get_by_role('link',name='GitHub 项目',exact=False).get_attribute('href')=='https://github.com/Buildlee/MyOwn';page.keyboard.press('Escape')
 page.get_by_role('button',name='深色',exact=True).click();page.keyboard.press('Escape');page.screenshot(path=str(root/'240-dark.png'));page.locator('.item-row').first.click();page.screenshot(path=str(root/'240-detail.png'))
 assert not errors,errors;print('PASS: quantity save, custom category reload, all sort filters, fixed calendar, live trend, log/about, themes; zero JS errors')
 b.close()
