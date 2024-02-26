import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAddMutation } from '../../app/api/institutionsApiSlice';
import { useNavigate } from 'react-router-dom';

const CreateInstitution = () => {
  const session = useSelector(state => state.session);
  const navigate = useNavigate();
  
  const [ name, setName ] = useState('');
  const [ typeOf, setTypeOf ] = useState('');
  const [ dpt, setDpt ] = useState('');
  const [ departments, setDepartments ] = useState([]);

  const [ fetchAdd ] = useAddMutation();

  const handleDepartments = (elem) => {
    if (elem.key === 'Enter') {
      if(elem.target.value) {
        setDepartments(prev => prev.concat(elem.target.value));
        setDpt('');
      }
    }
  }

  const handleDeleteDepartment = (index) => {
    let current = [...departments];
    current.splice(index, 1);
    setDepartments(current);
  }

  const handleCreate = async () => {
    try {
      const body = {
        name, typeOf, departments
      }
      const result = await fetchAdd(body).unwrap();
      navigate(`/institutions/${result._id}`);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {}, [ departments.length ]);

  return (
    <>
      <input type="text" placeholder="Ime institucije/grupe" onChange={(elem) => setName(elem.target.value)} />
      
      {/* Ovo treba biti SELECT ne input */}
      <input type="text" placeholder="Vrsta institucije/grupe" onChange={(elem) => setTypeOf(elem.target.value)} />
      {departments.map((elem, i) => {
        return (
          <>
            <p>{elem}</p>
            <p onClick={() => handleDeleteDepartment(i)}>Delete</p> 
            <p>{i}</p>
          </>
        );
      })
      }
      
      <input id="dptID" type="text" placeholder="Odseci, odeljenja (enter za dodavanje)" onKeyUp={(elem) => handleDepartments(elem)} onChange={(elem) => setDpt(elem.target.value)} value={dpt} />
      <button onClick={handleCreate}>Napravi grupu!</button>
    </>
  )
}

export default CreateInstitution;