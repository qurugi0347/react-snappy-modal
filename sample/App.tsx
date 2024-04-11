import "./App.css";
import SnappyModal from "../src";

function App() {
  const handleShowModal = () => {
    SnappyModal.show(<div>Test Modal</div>).then(() => {
      console.log("Modal closed");
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
