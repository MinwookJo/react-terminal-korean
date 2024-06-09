/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import {  useEffect, useMemo, useState } from 'react';
import { compose, decompose } from './korean';
import useInterval from './useInterval';
import eventBus from './eventBus';

interface TextLineProps {
    value: string
    speed?: number
    id?: string
    className?: string
}

export default function TextLine({value, speed = 10, id, className=""}: TextLineProps) {
  const [stringQueue, setStringQueue] = useState<string[]>([]); // 아직 렌더링 안된 한글들
  const [characterQueue, setCharacterQueue] = useState<string[]>([]); // 렌더링 중인 한글
  
  const [pointer, setPointer] = useState<number>(0); // 현재 프레임 렌더링 중인 한글
  const [text, setText] = useState<string>(''); // 렌더링 완료된 한글

  // 지금 그려지고 있는 글자
  const textAnimated = useMemo(() => {
    return characterQueue[pointer] || ''
  }, [characterQueue, pointer])

  // 큐에서 글자 하나를 pop해서 렌더링에 포함
  const popCharacter = () => {
    const copiedQueue = [...stringQueue];
    const character = copiedQueue.shift() ?? ''; // string에 한글자 가져옴
    setStringQueue(copiedQueue);
    try {
      const decomposed = decompose(character)
      const composed = compose(decomposed)
      return composed
    } catch(err: any) {
      if(err.message === 'not korean') {
        return [character]
      }
      return [];
    }
  }

  const render = (character: string) => {
    setText(`${text}${character}`)
    setCharacterQueue([])
    setPointer(0)
  }

  const animate = () => {
    const isLastPointer = pointer === characterQueue.length - 1;
    if(isLastPointer) {
        // 글자 추가
        const last = characterQueue[characterQueue.length - 1] ?? ''
        render(last)
        // 다음에 렌더링할 글자 세팅
        const newCharacter = popCharacter()
        if(newCharacter.length === 0) {
          
          eventBus.emit(`DONE_${id}`)
          setCharacterQueue([])
        } else {
          setCharacterQueue(newCharacter);
        }
        setPointer(0)
    } else {
      setPointer(pointer + 1)
    }
  }

  const tick = () => {
    const noString = stringQueue.length === 0 && characterQueue.length === 0
    // 렌더링할 한글, 대기중인 한글 없으면 암것도 안함
    if(noString) {
      return;
    }

    const isNoCharacter = characterQueue.length === 0
    // 렌더링 중인 한글 없으면 대기 첫번째 리스트에 추가
    if(isNoCharacter) {
      const character = popCharacter()
      setCharacterQueue(character)
      return;
    }

    animate()
  }

  useInterval(() => {
    tick()
  }, speed)

  useEffect(() => {
    const target = value.split('');
    setStringQueue([...target]);
    setCharacterQueue([])
    setText('')
    setPointer(0)
  }, [value])

  return (
    <div className={[className].join(" ")}>
      <span>{text}</span>
      <span>{textAnimated}</span>
    </div>
  );
}
