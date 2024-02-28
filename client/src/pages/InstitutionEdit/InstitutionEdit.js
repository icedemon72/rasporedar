import { useNavigate, useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useGetByIdQuery, useGetAuthRoleQuery, useEditInstitutionMutation, useDeleteInstitutionMutation } from '../../app/api/institutionsApiSlice';
import { useState, useEffect } from 'react';

const InstitutionEdit = () => {
  const { id } = useParams();
  const session = useSelector(state => state.session);

  const [ fetchEdit ] = useEditInstitutionMutation();
  const [ fetchDelete ] = useDeleteInstitutionMutation();

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
  } = useGetAuthRoleQuery(id, { skip: !session.accessToken  });

  const { 
    data: institution, 
    isLoading: isInstitutionLoading, 
    isSuccess: isInstitutionSuccess, 
    isError: isInstitutionError,
    error: institutionError 
  } = useGetByIdQuery(id, { skip: !isGetRoleSuccess  });

  const handleAddDepartment = (elem) => {
    if (elem.key === 'Enter') {
      if(elem.target.value) {
        setDepartments(prev => prev.concat(elem.target.value));
        setDpt('');
      }
    }
  }

  const handleDeleteDepartment = (index) => {
    if(index >= 0 || index < departments.length) {
      let current = [...departments];
      current.splice(index, 1);
      setDepartments(current);
    }
  }

  const handleEditInstitution = async () => {
    try {
      const body = { name, typeOf, departments };
      const result = fetchEdit({ id, body });
    } catch (err) {
      console.log(err);
    }
  }

  const handleDeleteInstitution = async () => {
    try {
      const result = await fetchDelete(id);
    } catch (err) {
      console.log(err);
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
        return <div onClick={() => handleDeleteDepartment(index)}>
          { elem }
        </div>
      })}
      <input type="text" placeholder="Naziv odseka/odeljenja" onKeyUp={(elem) => handleAddDepartment(elem)} onChange={(elem) => setDpt(elem.target.value)} value={dpt}></input>
      <button onClick={handleEditInstitution}>Sačuvaj promene!</button>
      <button onClick={handleDeleteInstitution}>Obrisi grupu</button>
      {/* ADD BUTTON HERE AND LOGIC */}
      <br />
      <Link to={`/institutions/${id}/professors`}>Profesori edit</Link>
      <Link to={`/institutions/${id}/subjects`}>Predmeti edit</Link>
      {/* Schedule link */}
      {/* <Link to={}></Link> */}
      
    </>
  }

  useEffect(() => {
    if(isInstitutionSuccess) {
      setDepartments(institution.departments);
      setName(institution.name);
      setTypeOf(institution.typeOf);
      document.title = `Uredi ${institution.name} | Rasporedar`;
    } else {
      document.title = 'Uredi grupu | Rasporedar';
    }
  }, [ isInstitutionSuccess ])

  return (
    <>
      { content }
    </>
  )
}

export default InstitutionEdit