 'use client';
import {useState} from 'react';
import {CATEGORIES,Icon,Modal} from './controls';
export const CATEGORY_SECTIONS:[string,string[]][]=[['数码与娱乐',['数码','音频','摄影','游戏']],['居家与生活',['生活','家电','家具','厨房','工具']],['穿戴与出行',['服饰','鞋靴','箱包','配饰','出行']],['兴趣与工作',['阅读','运动','户外','乐器','办公','文具']],['健康与其他',['健康','美护','宠物','园艺','其他']]];
export function CategoryPicker({names,value,iconFor,onSelect,onCreate,onClose}:{names:string[];value:string;iconFor:(s:string)=>string;onSelect:(s:string)=>void;onCreate:(s:string)=>void;onClose:()=>void}){
 const [query,setQuery]=useState('');const q=query.trim(),known=new Set(CATEGORIES.map(x=>x[0])),custom=names.filter(x=>!known.has(x)),aliases:Record<string,string>={'耳机':'音频','电脑':'数码','相机':'摄影','咖啡':'厨房'};
 const button=(s:string)=><button className="category-row" aria-pressed={value===s} key={s} onClick={()=>onSelect(s)}><Icon name={iconFor(s)}/><span>{s}</span>{value===s&&<Icon name="check"/>}</button>;
 return <Modal title="选择分类" onClose={onClose} choice><label className="search choice-search"><Icon name="search"/><input aria-label="搜索选项" value={query} maxLength={16} placeholder="搜索分类或输入新名称" onChange={e=>setQuery(e.target.value)}/></label>{q?<><section className="surface">{names.filter(n=>n.includes(q)||n===aliases[q]).map(button)}</section>{!names.includes(q)&&<button className="text-button full" onClick={()=>onCreate(q)}>创建“{q}”分类</button>}</>:<><h3 className="group-label">常用分类</h3><div className="category-chips">{['数码','音频','厨房','服饰'].map(button)}</div>{[...CATEGORY_SECTIONS,...(custom.length?[['我的分类',custom] as [string,string[]]]:[])].map(([title,ns])=><section key={title}><h3 className="group-label">{title}</h3><div className="surface">{ns.map(button)}</div></section>)}</>}</Modal>
}
