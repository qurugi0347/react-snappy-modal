import "./App.css";
// import SnappyModal from "react-snappy-modal";
import SnappyModal from "../../src";

function App() {
  const handleShowModal = () => {
    SnappyModal.show(<ModalComponent />)
      .then((message: string) => {
        console.log("Modal closed", message);
      })
      .catch((message: string) => {
        console.log("Modal thrown", message);
      });
  };

  return (
    <>
      <h1>React Snappy Modal</h1>
      <button onClick={handleShowModal}>Test Modal</button>
    </>
  );
}

export default App;

const ModalComponent = () => {
  return (
    <div style={{ background: "white" }}>
      <h1>Modal</h1>
      <button onClick={() => SnappyModal.close("confirmObject")}>
        confirm
      </button>
      <button onClick={() => SnappyModal.throw("throwObject")}>throw</button>
    </div>
  );
};
