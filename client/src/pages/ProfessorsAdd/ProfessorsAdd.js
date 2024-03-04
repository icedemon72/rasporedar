/*


ADD USER IS IN INSTITUTION AND ADMIN CHECK!
404 IF THEY ARE NOT!!!!!


*/

import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAddProfessorMutation } from "../../app/api/professorsApiSlice";
import { useSelector } from "react-redux";

const ProfessorsAdd = () => {
  const session = useSelector(state => state.session);
  const navigate = useNavigate();

  const { institution } = useParams();

  const [ name, setName ] = useState('');
  const [ title, setTitle ] = useState('');
  const [ bachelor, setBachelor ] = useState({});
  const [ master, setMaster ] = useState({});
  const [ doctorate, setDoctorate ] = useState({});
  const [ education, setEducation ] = useState({});
  const [ bio, setBio ] = useState('');
  const [ references, setReferences ] = useState([]);

  const [ fetchAddProfessor ] = useAddProfessorMutation();

  const handleChangeBachelor = (val, field) => {
    let toChange = bachelor;
    toChange[field] = val;
    setBachelor(toChange);
  }

  const handleChangeMaster = (val, field) => {
    let toChange = master;
    toChange[field] = val;
    setMaster(toChange);
  }

  const handleChangeDoctorate = (val, field) => {
    let toChange = doctorate;
    toChange[field] = val;
    setDoctorate(toChange);
  }

  const handleAddProfessor = async () => {
    // Add input check here!!!
    try {
      // Add check for bachelor, master and doctorate here
      setEducation({
        bachelor: bachelor, master: master, doctorate: doctorate
      });

      const body = {
        name, title, education: education, bio, references
      }
      console.log(body);
      const result = await fetchAddProfessor({institution, body}).unwrap();
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    document.title = 'Dodaj profesora | Rasporedar';
  }, []);

  return (
    <>
      <div className="w-full flex justify-center">
        <div className="w-full md:w-1/2 lg:w-1/3 mt-5">
          <input className="input-field mb-4" type="text" placeholder="Ime i prezime" onChange={(elem) => setName(elem.target.value)} />
          <input className="input-field mb-4" type="text" placeholder="Titula" onChange={(elem) => setTitle(elem.target.value)} />
          <textarea className="input-field mb-4" type="text" placeholder="Profesionalna biografija" onChange={(elem) => setBio(elem.target.value)} />
          <input className="input-field mb-4" type="text" placeholder="Osnovne studije" onChange={(elem) => handleChangeBachelor(elem.target.value, 'institution')}/>
          <div className="flex justify-center gap-3 w-full">
            <input className="input-field mb-4 w-full md:w-1/2" type="number" min={1970} placeholder="Od" onChange={(elem) => handleChangeBachelor(elem.target.value, 'from')} />
            <input className="input-field mb-4 w-full md:w-1/2" type="number" min={1970} placeholder="Do" onChange={(elem) => handleChangeBachelor(elem.target.value, 'to')} />
          </div>
          <input className="input-field mb-4" type="text" placeholder="Master studije" onChange={(elem) => handleChangeMaster(elem.target.value, 'institution')}/>
          <div className="flex justify-center gap-3 w-full">
            <input className="input-field mb-4 w-full md:w-1/2" type="number" min={1970} placeholder="Od" onChange={(elem) => handleChangeMaster(elem.target.value, 'from')} />
            <input className="input-field mb-4 w-full md:w-1/2" type="number" min={1970} placeholder="Do" onChange={(elem) => handleChangeMaster(elem.target.value, 'to')} />
          </div>
          <input className="input-field mb-4" type="text" placeholder="Doktorske studije" onChange={(elem) => handleChangeDoctorate(elem.target.value, 'institution')}/>
          <div className="flex justify-center gap-3 w-full">
            <input className="input-field mb-4 w-full md:w-1/2" type="number" min={1970} placeholder="Od" onChange={(elem) => handleChangeDoctorate(elem.target.value, 'from')} />
            <input className="input-field mb-4 w-full md:w-1/2" type="number" min={1970} placeholder="Do" onChange={(elem) => handleChangeDoctorate(elem.target.value, 'to')} />
          </div>
          {/* Add this later... <input type="text" placeholder="Reference"></input> */}
          <div className="w-full flex justify-center">
            <button className="btn-red w-full md:w-1/2 lg:w-1/3" onClick={handleAddProfessor}>Unesi profesora!</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default ProfessorsAdd;