import {ReactNode} from 'react';
// Keep the page fully opaque. Animate the controls and chart, never fade the entire view.
export function MotionSurface({value,children}:{value:string;children:ReactNode}){
 return <div className="motion-surface" data-view={value}>{children}</div>;
}
