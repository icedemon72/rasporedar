import { useState } from "react";
import ModalDelete from "../../components/ModalDelete/ModalDelete";
import {Helmet} from "react-helmet";

const Home = () => {
  const [ open, setOpen ] = useState(false);

  const handleYes = () => {
    console.log("Confirmed");
    setOpen(false);
  }

  const handleCancel= () => {
    console.log("Cancelled");
    setOpen(false);
  }

  return (
		<>
			<Helmet>
				<title>Rasporedar</title>
			</Helmet>
			<div className="dark">
				<div className="bg-red-200 dark:bg-pink-200">Home</div>
				<button onClick={() => setOpen(true)}>Klikni me</button>
				{ open ? 
					<ModalDelete title={'Brisanje grupe'} text={`Obrisacete <ime grupe>. Da li ste sigurni?`} closeFunc={() => setOpen(false)}>
						<button className="bg-gray-300 hover:bg-gray-500 p-2 rounded" onClick={handleCancel}>Ne, ostavi je</button>
						<button className="bg-red-300 hover:bg-red-500 p-2 rounded" onClick={handleYes}>Da, siguran sam!</button>
					</ModalDelete> 
				: null }
			</div>
		</>
  )
}

export default Home;