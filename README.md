# React Terminal Korean 

터미널, 타이핑 애니메이션을 보여주는 리액트 모듈입니다.

영어와는 다르게 한국어는 복합적인 음절로 구성 되어 있어서, 타이핑되는 애니메이션을 표현하기가 어렵습니다.

해당 패키지는 초성, 중성, 종성으로 이루어진 한글을 분해하고 재조립되는 애니메이션을 제공합니다.

<img src="https://github.com/MinwookJo/react-terminal-korean/blob/main/b.gif?raw=true" alt=""/>



<img src="https://github.com/MinwookJo/react-terminal-korean/blob/main/a.gif?raw=true" alt=""/>



## 사용법
### TextLine
``` tsx
<TextLine value={"사람 이름이 어떻게 엄준식 ㅋㅋ"} />
```

- `value` 렌더링되는 텍스트의 값.
- Optionally `speed` 한 애니메이션 프레임의 속도 (ms) `default: 10`
- Optionally `clasName` 컴포넌트 스타일링에 사용하는 className