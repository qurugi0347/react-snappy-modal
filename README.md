# React Snappy Modal

SnappyModal is a lightweight, flexible React modal library that provides a simple and intuitive way to manage modal dialogs in your React applications.

[한글 문서](./README.ko.md)

**Website**: [https://react.snappy-modal.com/](https://react.snappy-modal.com/)

## Features

- 🚀 Promise-based API
- 🎯 Multiple modal layers support
- 🎨 Customizable positioning
- 🔒 Scroll lock management
- 🎭 Backdrop customization
- ⚡ TypeScript support

## Installation

```bash
npm install react-snappy-modal
# or
yarn add react-snappy-modal
```

## Basic Usage

1. First, wrap your application with `SnappyModalProvider`:

```jsx
import { SnappyModalProvider } from 'react-snappy-modal';

function App() {
  return (
    <SnappyModalProvider>
      <YourApp />
    </SnappyModalProvider>
  );
}
```

2. Show a modal using `SnappyModal.show()`:

```jsx
import SnappyModal from 'react-snappy-modal';

function YourComponent() {
  const handleClick = async () => {
    const result = await SnappyModal.show(
      <div>
        <h2>Hello World!</h2>
        <button onClick={() => SnappyModal.close('success')}>Close</button>
      </div>
    );
    console.log(result); // 'success'
  };

  return <button onClick={handleClick}>Open Modal</button>;
}
```

## API Reference

### SnappyModal.show(component, options?)

Shows a modal and returns a Promise that resolves when the modal is closed.

```typescript
interface SnappyModalOptions {
  allowOutsideClick?: boolean;  // Enable closing by clicking outside (default: true)
  allowScroll?: boolean;        // Allow background scrolling (default: false)
  backdrop?: boolean | string;  // Show backdrop or custom backdrop color (default: true)
  position?: SnappyModalPosition; // Modal position (default: "center")
  zIndex?: number;             // Custom z-index
  layer?: number;              // Modal layer for stacking (default: 0)
}

type SnappyModalPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "center-left"
  | "center"
  | "center-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";
```

### SnappyModal.close(value?, layer?)

Closes the modal and resolves the Promise with the provided value.

```typescript
SnappyModal.close('success', 0); // Closes layer 0 modal with 'success' value
```

### SnappyModal.throw(error?, layer?)

Closes the modal and rejects the Promise with the provided error.

```typescript
SnappyModal.throw(new Error('Cancelled'), 0);
```

## Examples

### Custom Positioning

```jsx
SnappyModal.show(<YourComponent />, {
  position: 'top-right',
  backdrop: 'rgba(0, 0, 0, 0.7)'
});
```

### Multiple Layers

```jsx
// Show first modal
const showNestedModal = async () => {
  await SnappyModal.show(<FirstModal />, { layer: 0 });
  // Show second modal on top
  await SnappyModal.show(<SecondModal />, { layer: 1 });
};
```

### Custom Backdrop

```jsx
SnappyModal.show(<YourComponent />, {
  backdrop: 'rgba(255, 0, 0, 0.5)' // Red semi-transparent backdrop
});
```

## Examples

For detailed usage examples, please refer to the examples in the `sample` directory.