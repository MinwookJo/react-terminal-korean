/* eslint-disable @typescript-eslint/ban-types */
'use client'

import eventBus from "./eventBus";
import { useEffect, useMemo, useRef, useState } from "react";

interface MultiLineProps {
    children: JSX.Element[]
}

/** TODO 오버라이드해서 id값 없이 순서대로 렌더링되게 하는 코드 만들기 */
export default function MultiLine({children}: MultiLineProps) {
    const [finishList, setFinishList] = useState<string[]>([]);
    const savedEvent = useRef<Function | null>(null);

    const renderLines = useMemo(() => {
        return children.filter((_child, index) => {
            return finishList.length  >= index
        })
    }, [children, finishList])

    useEffect(() => {
        savedEvent.current = (id: string) => {
            setFinishList([...finishList, id]);
        };
    });

    useEffect(() => {
        children.forEach((child) => {
            if(child.props.id) {
                eventBus.once(`DONE_${child.props.id}`, () => {
                    if(savedEvent.current) {
                        savedEvent.current(child.props.id)
                    }
                })
            }
        })

        return () => {
            children.forEach((child) => {
                const eventName = `DONE_${child.props.id}`;
                eventBus.off(eventName, () => {})
            })
        }
    }, [children])

    return (
        <div>
           {renderLines}
        </div>
    );
}
