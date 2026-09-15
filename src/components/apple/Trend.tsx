 'use client';
import {useState} from 'react';
import {Segments} from './controls';
import {Item} from '@/lib/types';
import {dateString,parseDate,today,unitCost} from '@/lib/domain';
export function Trend({items}:{items:Item[]}){
 const [period,setPeriod]=useState(30),[day,setDay]=useState(30);
 const value=(d:number)=>items.reduce((s,x)=>s+(unitCost(x,d)||0),0),start=value(0),end=value(period),selected=value(day);
 const step=Math.max(.01,Math.pow(10,Math.floor(Math.log10(Math.max(start,.01))))/2),hi=Math.max(step,Math.ceil(start/step)*step),lo=Math.max(0,Math.floor(end/step)*step-step),span=hi-lo;
 const x=(d:number)=>4+d/period*252,y=(v:number)=>10+(hi-v)/span*70;
 const date=parseDate(today());date.setDate(date.getDate()+day);
 const fmt=(v:number)=>v.toLocaleString('zh-CN',{minimumFractionDigits:2,maximumFractionDigits:2});
 if(!items.length)return <p className="footnote">添加按天均摊物品后，可查看成本预测。</p>;
 return <div className="cost-trend"><div className="trend-head"><b>继续持有 · 成本预测</b><div className="trend-tabs"><Segments options={[["30","30 天"],["90","90 天"]]} value={String(period)} onChange={v=>{const n=Number(v);if(n!==period){setPeriod(n);setDay(n)}}}/></div></div><div className="trend-readout"><div><small>{day===0?'今天':`${day} 天后 · ${date.getMonth()+1}月${date.getDate()}日`}</small><strong>¥{fmt(selected)} <small>/ 天</small></strong></div><span>比今天少 ¥{fmt(start-selected)} · {start?((start-selected)/start*100).toFixed(1):'0.0'}%</span></div><div className="trend-plot"><svg viewBox="0 0 310 110" role="img" aria-label={`至${dateString(date)}预计每天${fmt(selected)}元，纵轴单位元每天`}>{[hi,(hi+lo)/2,lo].map(v=><g key={v}><path d={`M4 ${y(v)}H256`} stroke="var(--line)" strokeDasharray="3 4"/><text x="268" y={y(v)+3}>{v>=10000?(v/10000).toFixed(1)+'万':v>=100?Math.round(v):Number(v.toFixed(2))}</text></g>)}<path className="trend-curve" d={Array.from({length:61},(_,i)=>{const d=i*period/60;return `${i?'L':'M'}${x(d)},${y(value(d))}`}).join(' ')} fill="none" stroke="var(--accent)" strokeWidth="2.3"/><path d={`M${x(day)} 8V84`} stroke="var(--accent)" opacity=".4"/><circle cx={x(day)} cy={y(selected)} r="4" fill="var(--surface)" stroke="var(--accent)" strokeWidth="2"/><text x="4" y="104">今天</text><text x="130" y="104" textAnchor="middle">{period/2} 天</text><text x="256" y="104" textAnchor="end">{period} 天</text></svg><input type="range" aria-label="查看预测天数" aria-valuetext={`${day}天后，预计每天${fmt(selected)}元`} min={0} max={period} value={day} onChange={e=>setDay(Number(e.target.value))}/></div><p className="trend-note">假设不新增、不售出 · 仅按天物品 <span>拖动查看</span></p></div>
}
