import { useNavigate, useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useGetByIdQuery, useGetRoleQuery, useEditInstitutionMutation, useDeleteInstitutionMutation, useInstitutionChangeCodeMutation } from '../../app/api/institutionsApiSlice';
import { useState, useEffect } from 'react';
import ModalDelete from '../../components/ModalDelete/ModalDelete';
import { addItemToArrayOnKey, deleteItemFromArray } from '../../utils/updateArray';

const InstitutionEdit = () => {
  const { institution } = useParams();
  const session = useSelector(state => state.session);

  const [ fetchEdit ] = useEditInstitutionMutation();
  const [ fetchDelete ] = useDeleteInstitutionMutation();
  const [ fetchEditCode ] = useInstitutionChangeCodeMutation();

  const [ open, setOpen ] = useState(false);
  const [ departments, setDepartments ] = useState([]);
  const [ name, setName ] = useState('');
  const [ typeOf, setTypeOf ] = useState('');
  const [ dpt, setDpt ] = useState('');

  const navigate = useNavigate();
  
  const { 
    data: getRole, 
    isLoading: isGetRoleLoading, 
    isSuccess: isGetRoleSuccess, 
    isError: isGetRoleError,
    error: getRoleError 
  } = useGetRoleQuery(institution, {
    skip: !session.accessToken
  });

  const { 
    data: institutionData, 
    isLoading: isInstitutionLoading, 
    isSuccess: isInstitutionSuccess, 
    isError: isInstitutionError,
    error: institutionError 
  } = useGetByIdQuery({ id: institution, code: true }, {
    skip: !isGetRoleSuccess
  });

  const handleCodeChange = async () => {
    try {
      const body = {
        code: 1, moderatorCode: 1
      }
      const result = fetchEditCode({ institution, body }).unwrap();
    } catch (err) {
      console.log(err);
    }
  }

  const handleAddDepartment = (elem) => {
    const toAdd = addItemToArrayOnKey(departments, elem, 'Enter', true);
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

  const handleEditInstitution = async () => {
    try {
      const body = { name, typeOf, departments };
      const result = await fetchEdit({ id: institution, body });
    } catch (err) {
      console.log(err);
    }
  }

  const handleDeleteInstitution = async () => {
    try {
      const result = await fetchDelete(institution);
      navigate('/institutions');
    } catch (err) {
      console.log(err);
    } finally {
      setOpen(false);
    }
  }

  let content;

  if(isGetRoleError && getRoleError.status === 405) {
    content = '405 method not allowed!';
  } 
  
  if(isInstitutionSuccess && isGetRoleSuccess) {
    content = 
    <>
      <label>Naziv grupe</label>
      <input type="text" value={name} disabled={getRole.role !== 'Owner'} onChange={(elem) => setName(elem.target.value)}/>
      <label>Tip grupe</label>
      <input type="text" value={typeOf} disabled={getRole.role !== 'Owner'} onChange={(elem) => setTypeOf(elem.target.value)}/>
      { departments.map((elem, index) => {
        return <div className='cursor-pointer' onClick={() => handleDeleteDepartment(index)}>
          { elem }
        </div>
      })}
      <input type="text" placeholder="Naziv odseka/odeljenja" onKeyUp={(elem) => handleAddDepartment(elem)} onChange={(elem) => setDpt(elem.target.value)} value={dpt}></input>
      <div>
        <p>{institutionData.code}</p>
        <p>{institutionData.moderatorCode}</p>
      </div>
      <button onClick={handleCodeChange}>Promeni kodove!</button>
      <button onClick={handleEditInstitution}>Sačuvaj promene!</button>
      <button onClick={() => setOpen(true)}>Obrisi grupu</button>
      {/* ADD BUTTON HERE AND LOGIC */}
      <br />
      <Link to={`/institutions/${institution}/professors`}>Profesori edit</Link>
      <Link to={`/institutions/${institution}/subjects`}>Predmeti edit</Link>
      {/* Schedule link */}
      {/* <Link to={}></Link> */}
      
    </>
  }

  useEffect(() => {
    if(isInstitutionSuccess) {
      setDepartments(institutionData.departments);
      setName(institutionData.name);
      setTypeOf(institutionData.typeOf);
      document.title = `Uredi ${institutionData.name} | Rasporedar`;
    } else {
      document.title = 'Uredi grupu | Rasporedar';
    }
  }, [ isInstitutionSuccess ])

  return (
    <>
      { open ? 
        <ModalDelete title={'Brisanje grupe'} text={`Obrisacete grupu '${institutionData.name}'. Da li ste sigurni?`}>
          <button className="bg-gray-300 hover:bg-gray-500 p-2 rounded" onClick={() => setOpen(false)}>Odustani</button>
          <button className="bg-red-300 hover:bg-red-500 p-2 rounded" onClick={handleDeleteInstitution}>Potvrdi</button>
        </ModalDelete> 
        : null 
      }
      { content }
    </>
  )
}

export default InstitutionEdit