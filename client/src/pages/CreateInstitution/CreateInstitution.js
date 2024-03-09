import { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useAddMutation } from '../../app/api/institutionsApiSlice';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Trash } from 'lucide-react';
import { addItemToArrayOnKey, deleteItemFromArray } from '../../utils/updateArray';

/* TO DO ADD ON CLICK SUPPORT */


const CreateInstitution = () => {
  const session = useSelector(state => state.session);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const [ isSubmitting, setIsSubmitting ] = useState(false);
  const [ name, setName ] = useState('');
  const [ typeOf, setTypeOf ] = useState('');
  const [ dpt, setDpt ] = useState('');
  const [ departments, setDepartments ] = useState([]);

  const [ 
    fetchAdd, 
    { 
      isSuccess: isFetchAddSuccess, 
      isError: isFetchAddError,
      isLoading: isFetchAddLoading
    }
  ] = useAddMutation();

  const handleDepartments = (elem, key = 'Enter') => {
    const toAdd = addItemToArrayOnKey(departments, elem, key, true);
    if(toAdd.changed) {
      setDepartments(toAdd.result);
      setDpt('');
    }
  }

  const handleDeleteDepartment = (index) => {
    let tempDepartments = [ ...departments ]; 
    const toDelete = deleteItemFromArray(tempDepartments, index);
    if(toDelete) {
      setDepartments(toDelete);
    }
  }

  const handleCreate = async () => {
    try {
      setIsSubmitting(true);
      // input validation here
      const body = {
        name, typeOf, departments
      }

      if(!isSubmitting) {
        const result = await fetchAdd(body).unwrap();
        setTimeout(() => {
          navigate(`/institutions/${result._id}`);
        }, 1000);
      }
    } catch (err) {
      setIsSubmitting(false);
      console.log(err);
    } 
  }

  useEffect(() => {
    document.title = 'Napravi grupu | Rasporedar';
  }, []);
  useEffect(() => {}, [ departments.length ]);

  return (
    <>
      <div className="w-full flex justify-center">
        <div className="w-full lg:w-1/2 xl:w-2/5">
          <div className="bg-white px-8 pt-6 pb-8 mb-4">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Naziv institucije ili grupe</label>
              <input className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" placeholder="Naziv institucije ili grupe" onChange={(elem) => setName(elem.target.value)} />
            </div>
            <div className="mb-6">
              {/* Ovo treba biti SELECT ne input */}
              <label className="block text-gray-700 text-sm font-bold mb-2">Tip institucije ili grupe</label>
              <input className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" placeholder="Tip institucije ili grupe" onChange={(elem) => setTypeOf(elem.target.value)} />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">Odseci, odeljenja itd.</label>
              <div className="w-full flex">
                <input className="border rounded w-1/2 md:w-2/3 lg:w-3/4 xl:w-4/5 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" ref={inputRef} id="dptID" type="text" placeholder="Odseci, odeljenja (enter za dodavanje)" onKeyUp={(elem) => handleDepartments(elem)} onChange={(elem) => setDpt(elem.target.value)} value={dpt} />
                <button className="border rounded w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline flex justify-center" type="text" onClick={() => handleDepartments(inputRef.current, null)}><PlusCircle /></button>
              </div>
            </div>
            {departments.map((elem, i) => {
              return (
                <div className="flex flex-row justify-between mt-2">
                  <div>{i + 1}</div>
                  <p>{elem}</p>
                  <div className="flex justify-center cursor-pointer hover:bg-red-200 text-red-500 rounded-sm" onClick={() => handleDeleteDepartment(i)}><Trash /></div> 
                </div>
              );
            })
            }
            <div className="flex justify-center w-full mt-3">
              <button className="w-full md:w-1/2 lg:w-1/3 p-2" onClick={handleCreate} disabled={isSubmitting}>Napravi grupu!</button>
            </div>
            <div className="">
              {isFetchAddLoading ? <>Loading...</> : null}
              {isFetchAddSuccess ? <>Uspesno kreiranje grupe!</> : null}
              {isFetchAddError ? <>Greska prilikom kreiranja grupe!</> : null}
            </div>
          </div>
        </div>
      </div>       
    </>
  )
}

export default CreateInstitution;