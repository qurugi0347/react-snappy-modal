# React Snappy Modal

React Snappy Modal은 React 애플리케이션을 위한 커스터마이징이 가능한 모달/다이얼로그 라이브러리

React 컴포넌트를 모달 내부에 쉽게 렌더링하고 Promise 기반 상호작용을 제공합니다.

## Features

- 모달 내부에 어떤 React 컴포넌트도 렌더링 가능.
- 모달 밖 클릭 시 모달을 닫는 등의 동작을 `allowOutsideClick` 같은 옵션으로 제어 가능.
- 모달이 닫힌 후 스크롤 위치 복원.
- 모달의 열림/닫힘 상태를 state로 관리하지 않아도 됨
- 다중 Layer 모달 지원

## Installation

```bash
npm install react-snappy-modal
```
```bash
yarn add react-snappy-modal
```
```bash
pnpm add react-snappy-modal
```

## Usage
```jsx
// main
import { SnappyModalProvider } from "react-snappy-modal";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SnappyModalProvider>
      <App />
    </SnappyModalProvider>
  </React.StrictMode>,
);

// app
import React from 'react';
import SnappyModal from 'react-snappy-modal';

function App() {
  const showModal = () => {
    SnappyModal.show(<YourModalComponent />, {
      allowOutsideClick: true
    }).then((result) => {
      console.log('모달 닫힘', result);
    });
  };

  return (
    <div>
      <button onClick={showModal}>모달 열기</button>
    </div>
  );
}

export default App;
// YourModalComponent
import React from 'react';
import SnappyModal from 'react-snappy-modal';

function YourModalComponent() {
  return (
    <div>
      <h1>모달 내용</h1>
      <button onClick={SnappyModal.close("some result")}>닫기</button>
    </div>
  );
}

export default YourModalComponent;
```

자세한 내용은 sample 프로젝트를 참고하세요.


