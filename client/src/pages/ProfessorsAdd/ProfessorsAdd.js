import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useAddProfessorMutation } from "../../app/api/professorsApiSlice";
import { useSelector } from "react-redux";
import { PlusCircle, Trash } from "lucide-react";
import { addItemToArrayOnKey, deleteItemFromArray } from "../../utils/updateArray";

const ProfessorsAdd = () => {
  const session = useSelector(state => state.session);
  const navigate = useNavigate();

  const inputRef = useRef(null);
  const { institution } = useParams();

  const [ name, setName ] = useState('');
  const [ title, setTitle ] = useState('');
  const [ bachelor, setBachelor ] = useState({});
  const [ master, setMaster ] = useState({});
  const [ doctorate, setDoctorate ] = useState({});
  // const [ education, setEducation ] = useState({});
  const [ bio, setBio ] = useState('');
  const [ referenceItem, setReferenceItem ] = useState('');
  const [ references, setReferences ] = useState([]);

  const [ 
    fetchAddProfessor,
    {
      isLoading: isFetchAddProfessorLoading,
      isSuccess: isFetchAddProfessorSuccess,
      isError: isFetchAddProfessorError
    }
   ] = useAddProfessorMutation();

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

  const handleAddReference = (elem, key = 'Enter') => {
    const toAdd = addItemToArrayOnKey(references, elem, key, true);
    if(toAdd.changed) {
      setReferences(toAdd.result);
      setReferenceItem('');
    }
  }

  const handleDeleteReference = (index) => {
    let tempReferences = [ ...references ];
    const toDelete = deleteItemFromArray(tempReferences, index);
    if(toDelete) {
      setReferences(toDelete);
    }
  }

  const handleAddProfessor = async () => {
    // Add input check here!!!
    try {
      // Add check for bachelor, master and doctorate here
      const education = {
        bachelor: bachelor, master: master, doctorate: doctorate
      };

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
          <div className="w-full flex mb-4">
            <input className="input-field w-1/2 md:w-2/3 lg:w-3/4 xl:w-4/5" type="text" placeholder="Reference profesora (Enter za unos)" value={referenceItem} ref={inputRef} onChange={(elem) => setReferenceItem(elem.target.value)} onKeyUp={(elem) => handleAddReference(elem)}/>
            <button className="input-field w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 text-gray-700 leading-tight focus:outline-none focus:shadow-outline flex justify-center" onClick={() => handleAddReference(inputRef.current, null)}><PlusCircle /></button>
          </div>

          { references.map((elem, i) => {
            return (
              <div class="flex flex-row justify-between mt-2">
                <div>{i + 1}</div>
                <p>{elem}</p>
                <div class="flex justify-center cursor-pointer hover:bg-red-200 text-red-500 rounded-sm" onClick={() => handleDeleteReference(i)}><Trash /></div> 
              </div>
            );
          })
          }

          <div className="w-full flex justify-center">
            <button className="btn-red w-full md:w-1/2 lg:w-1/3" onClick={handleAddProfessor}>Unesi profesora!</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default ProfessorsAdd;