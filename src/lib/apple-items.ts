'use client';
import {useState,useEffect,useRef} from 'react';
import {Item} from './types';
import {readItems,summarize} from './domain';
export function useAppleItems(){
 const [items,setItems]=useState<Item[]>([]),[loaded,setLoaded]=useState(false),[error,setError]=useState('');
 const current=useRef<Item[]>([]),blocked=useRef(false);
 useEffect(()=>{try{const raw=localStorage.getItem('myown_items');current.current=raw?readItems(raw):[];setItems(current.current)}catch{blocked.current=true;setError('原有物品数据暂时无法读取。为避免覆盖，已暂停保存，请先导出备份。')}setLoaded(true)},[]);
 function commit(next:Item[]){if(blocked.current)return false;try{localStorage.setItem('myown_items',JSON.stringify(next));current.current=next;setItems(next);setError('');return true}catch{setError('保存失败，设备存储可能已满。当前修改尚未保存。');return false}}
 const s=summarize(items);
 return {items,loaded,error,summary:{totalValue:s.value,dailyCost:s.burn},addItem:(item:Omit<Item,'id'>)=>commit([{...item,id:crypto.randomUUID()},...current.current]),updateItem:(item:Item)=>commit(current.current.map(x=>x.id===item.id?item:x)),deleteItem:(id:string)=>commit(current.current.filter(x=>x.id!==id)),togglePin:(id:string)=>commit(current.current.map(x=>x.id===id?{...x,isPinned:!x.isPinned}:x))};
}
