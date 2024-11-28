# React Snappy Modal

SnappyModal은 React 애플리케이션에서 모달 다이얼로그를 쉽고 직관적으로 관리할 수 있는 경량 React 라이브러리입니다.

## 주요 기능

- 🚀 Promise 기반 API
- 🎯 다중 레이어 모달 지원
- 🎨 위치 커스터마이징
- 🔒 스크롤 잠금 관리
- 🎭 백드롭 커스터마이징
- ⚡ TypeScript 지원

## 설치

```bash
npm install snappy-modal
# 또는
yarn add snappy-modal
```

## 기본 사용법

1. 먼저 애플리케이션을 `SnappyModalProvider`로 감싸주세요

```jsx
import { SnappyModalProvider } from 'snappy-modal';

function App() {
  return (
    <SnappyModalProvider>
      <YourApp />
    </SnappyModalProvider>
  );
}
```

2. `SnappyModal.show()`를 사용하여 모달을 표시하세요

```jsx
import SnappyModal from 'snappy-modal';

function YourComponent() {
  const handleClick = async () => {
    const result = await SnappyModal.show(
      <div>
        <h2>안녕하세요!</h2>
        <button onClick={() => SnappyModal.close('성공')}>닫기</button>
      </div>
    );
    console.log(result); // '성공'
  };

  return <button onClick={handleClick}>모달 열기</button>;
}
```

## API 참조

### SnappyModal.show(component, options?)

모달을 표시하고 모달이 닫힐 때 해결되는 Promise를 반환합니다.

```typescript
interface SnappyModalOptions {
  allowOutsideClick?: boolean;  // 외부 클릭으로 닫기 활성화 (기본값: true)
  allowScroll?: boolean;        // 배경 스크롤 허용 (기본값: false)
  backdrop?: boolean | string;  // 백드롭 표시 또는 커스텀 백드롭 색상 (기본값: true)
  position?: SnappyModalPosition; // 모달 위치 (기본값: "center")
  zIndex?: number;             // 커스텀 z-index
  layer?: number;              // 모달 레이어 스택킹 (기본값: 0)
}

type SnappyModalPosition =
  | "top-left"     // 좌측 상단
  | "top-center"   // 중앙 상단
  | "top-right"    // 우측 상단
  | "center-left"  // 좌측 중앙
  | "center"       // 중앙
  | "center-right" // 우측 중앙
  | "bottom-left"  // 좌측 하단
  | "bottom-center"// 중앙 하단
  | "bottom-right" // 우측 하단
```

### SnappyModal.close(value?, layer?)

모달을 닫고 제공된 값으로 Promise를 해결합니다.

```typescript
SnappyModal.close('성공', 0); // 레이어 0 모달을 '성공' 값과 함께 닫음
```

### SnappyModal.throw(error?, layer?)

모달을 닫고 제공된 에러로 Promise를 거부합니다.

```typescript
SnappyModal.throw(new Error('취소됨'), 0);
```

## 예제

### 위치 커스터마이징

```jsx
SnappyModal.show(<YourComponent />, {
  position: 'top-right',
  backdrop: 'rgba(0, 0, 0, 0.7)'
});
```

### 다중 레이어

```jsx
// 첫 번째 모달 표시
const showNestedModal = async () => {
  await SnappyModal.show(<FirstModal />, { layer: 0 });
  // 두 번째 모달을 위에 표시
  await SnappyModal.show(<SecondModal />, { layer: 1 });
};
```

### 커스텀 백드롭

```jsx
SnappyModal.show(<YourComponent />, {
  backdrop: 'rgba(255, 0, 0, 0.5)' // 반투명 빨간색 백드롭
});
```

## 예제

더 자세한 사용 예제는 `sample` 디렉토리의 예제들을 참조해 주세요.