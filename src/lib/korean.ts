/**
 * 간
 * 초성: ㄱ
 * 중성: ㅏ
 * 종성: ㄴ
 */
const firsts = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ',
'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ',
'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ']; // 초성

const seconds = ['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ',
'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ',
'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ']; // 중성

const thirds = ['', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ',
'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ',
'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ',
'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ']; // 종성

const doubleSeconds = ['ㅘ', 'ㅙ', 'ㅚ', 'ㅝ', 'ㅞ', 'ㅟ'];
const doubleSecondsMap = {
    'ㅗ': ['ㅘ', 'ㅙ', 'ㅚ'],
    'ㅜ': ['ㅝ', 'ㅞ', 'ㅟ']
};

const doubleThirds = ['ㄳ', 'ㄵ', 'ㄶ', 'ㄺ', 'ㄻ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅄ']
const doubleThirdMap = {
    'ㄱ': ['ㄳ'],
    'ㄴ': ['ㄵ'],
    'ㄹ': ['ㄺ', 'ㄻ', 'ㄽ', 'ㄾ', 'ㅀ'],
    'ㅂ': ['ㅄ']
}

const firstGap= 588 // 초성간 유니코드 차이
const secondGap = 28 // 중성간 유니코드 차이
const thirdGap = 1; // 종성간 유니코드 차이

const firstKoreanUnicode = 44032; // 첫번째 한글 유니코드 (가)
const lastKoreanUnicode = 55203; // 마지막 한글 유니코드 (힣)

export interface IKoreanUnion {
    first: string
    second: string
    third: string
}

export const isKorean = (char: string): boolean => {
    const unicode = char.charCodeAt(0)
    const isKoreanUnicode = unicode >= firstKoreanUnicode && unicode <= lastKoreanUnicode;
    return isKoreanUnicode;
}

export const  decompose = (char: string): IKoreanUnion => {
    if(!char) {
        throw new Error('invalid')
    }
    if(!isKorean(char)) {
        throw new Error('not korean')
    }
    const targetUnicode = char.charCodeAt(0)
    const unicodeIndex = targetUnicode - firstKoreanUnicode;

    // 588마다 초성이 바뀜
    let firstIndex = Math.floor(unicodeIndex / firstGap);
    // 초성마다, 중성의 값이 바뀌기 떄문에 종성 인덱스 만큼 빼고,
    const targetFirstGap = firstIndex * firstGap;
    // 28마다 중성이 바뀜
    let secondIndex = Math.floor((unicodeIndex - targetFirstGap) / secondGap);
    const targetSecondGap = secondIndex * secondGap;
    // 초성마다, 중성마다, 종성값이 바뀌기 때문에 두개의 인덱스 만큼빼고, 1마다 종성이 바뀜
    let thirdIndex = (unicodeIndex - targetFirstGap - targetSecondGap) / thirdGap;

    return {
        first: firsts[firstIndex],
        second: seconds[secondIndex],
        third: thirds[thirdIndex],
    };
}

/**
 * 초성 unicode는 588 마다 변경됨, 초성 배열에 index * 588 더하면, 해당 초성을 가진 유니코드 시작점
 * 중성은 28마다 변경됨, 초성마다 다시 28, index * 28이 해당 중성 시작점  
 * 종성은 1마다 변경됨 index * 1이 종성 시작점
 */
export const compose = (union: IKoreanUnion): string[] => {
    if(!union || !union.first) {
        throw new Error('invalid')
    }
    const result = [];
    const {first, second, third} = union
    const firstIndex = firsts.indexOf(first)
    const firstUnicodeIndex = firstIndex * firstGap; // 해당 초성 시작점 ex) 갈 <- ㄱ초성 한글 유니코드 시작점
    result.push(first);

    const secondIndex = seconds.indexOf(second)
    const secondUnicodeIndex = secondIndex * secondGap;
    const isWithDoubleSecond = doubleSeconds.includes(second);
    if(isWithDoubleSecond) {
        const doubleSecond = Object.entries(doubleSecondsMap).find(([key, value]) => (value.includes(second)));

        const singleSecond = doubleSecond?.[0] ?? ''
        const singleSecondIndex = seconds.indexOf(singleSecond)
        const singleSecondUnicodeIndex = singleSecondIndex * secondGap;

        const composedFirstSingleSecondCode = firstKoreanUnicode + firstUnicodeIndex + singleSecondUnicodeIndex;
        const composedFirstSingleSecond = String.fromCharCode(composedFirstSingleSecondCode); // 쌍자음이면, 중간 값 추가 ex) 왜 -> 오
        
        const composedFirstSecondCode = firstKoreanUnicode + firstUnicodeIndex + secondUnicodeIndex;
        const composedFirstDoubleSecond = String.fromCharCode(composedFirstSecondCode);
        result.push(composedFirstSingleSecond);
        result.push(composedFirstDoubleSecond);
    } else {
        const composedFirstSecondCode = firstKoreanUnicode + firstUnicodeIndex + secondUnicodeIndex;  // 가 <- 유니코드 시작점
        const composedFirstSecond = String.fromCharCode(composedFirstSecondCode);
        result.push(composedFirstSecond);
    }

    const thirdIndex = thirds.indexOf(third)
    const thirdUnicodeIndex = thirdIndex * thirdGap; // 초성 + 중성 + 초성 다 맞은 유니코드값

    const isWithDoubleThird = doubleThirds.includes(third);
    if(isWithDoubleThird) { // 종성이 쌍 받침일 때
        const doubleThird = Object.entries(doubleThirdMap).find(([key, value]) => (value.includes(third)));

        const singleThird = doubleThird?.[0] ?? ''
        const singleThirdIndex = thirds.indexOf(singleThird)
        const singleThirdUnicodeIndex = singleThirdIndex * thirdGap;
        
        const composedFirstSecondSingleThirdCode = firstKoreanUnicode + firstUnicodeIndex + secondUnicodeIndex + singleThirdUnicodeIndex;
        const composedFirstSecondSingleThird = String.fromCharCode(composedFirstSecondSingleThirdCode); // 쌍받침이면, 중간 값 추가 ex) 갉 -> 갈
        
        const composedFirstSecondThirdCode = firstKoreanUnicode + firstUnicodeIndex + secondUnicodeIndex + thirdUnicodeIndex;
        const composedFirstSecondDoubleThird = String.fromCharCode(composedFirstSecondThirdCode)

        result.push(composedFirstSecondSingleThird);
        result.push(composedFirstSecondDoubleThird);
    } else { // 종성이 일반받침일 때
        const composedFirstSecondThirdCode = firstKoreanUnicode + firstUnicodeIndex + secondUnicodeIndex + thirdUnicodeIndex;
        const composedFirstSecondThird = String.fromCharCode(composedFirstSecondThirdCode)
        result.push(composedFirstSecondThird);
    }
    return result;
}