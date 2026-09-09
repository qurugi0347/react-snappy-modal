import "./App.css";
import SnappyModal, { useCurrentModal } from "../../../src";

function App() {
  const handleShowModal = () => {
    SnappyModal.show(<ModalComponent />).then((message: string) => {
      console.log("Modal closed", message);
    });
  };

  return (
    <>
      <h1>React Snappy Modal</h1>
      <button onClick={handleShowModal}>Open Layer 0 Modal</button>
    </>
  );
}

export default App;

const ModalComponent = () => {
  const { resolveModal } = useCurrentModal();

  return (
    <div style={{ background: "white" }}>
      <h1>First Layer Modal</h1>
      <button
        onClick={() => {
          SnappyModal.show(<SecondLayerModalComponent />, { layer: 1 });
        }}
      >
        Open Second Layer Modal
      </button>
      <button onClick={() => resolveModal()}>close</button>
    </div>
  );
};

const SecondLayerModalComponent = () => {
  const { resolveModal } = useCurrentModal();

  return (
    <div style={{ background: "white" }}>
      <h1>Second Layer Modal</h1>
      <button onClick={() => resolveModal()}>close</button>
    </div>
  );
};
