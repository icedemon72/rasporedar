import { useEffect, useState } from "react";
import ModalDelete from "../../components/ModalDelete/ModalDelete";

const Home = () => {
  const [ open, setOpen ] = useState(false);
  useEffect(() => {
    document.title = 'Rasporedar';
  })

  const handleYes = () => {
    console.log("Confirmed");
    setOpen(false);
  }

  const handleCancel= () => {
    console.log("Cancelled");
    setOpen(false);
  }

  return (
    <div className="dark">
      <div className="bg-red-200 dark:bg-pink-200">Home</div>
      <button onClick={() => setOpen(true)}>Klikni me</button>
      { open ? 
        <ModalDelete title={'Brisanje grupe'} text={`Obrisacete <ime grupe>. Da li ste sigurni?`}>
          <button className="bg-gray-300 hover:bg-gray-500 p-2 rounded" onClick={handleCancel}>Ne, ostavi je</button>
          <button className="bg-red-300 hover:bg-red-500 p-2 rounded" onClick={handleYes}>Da, siguran sam!</button>
        </ModalDelete> 
      : null }
    </div>
  )
}

export default Home;