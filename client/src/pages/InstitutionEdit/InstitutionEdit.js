import { useNavigate, useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useGetByIdQuery, useGetAuthRoleQuery } from '../../app/api/institutionsApiSlice';
import { useState, useEffect } from 'react';

const InstitutionEdit = () => {
  const { id } = useParams();
  const session = useSelector(state => state.session);

  const [ departments, setDepartments ] = useState([]);

  const navigate = useNavigate();

  const handleDelete = (index) => {
    if(index >= 0 || index < departments.length) {
      let current = [...departments];
      current.splice(index, 1);
      setDepartments(current);
      console.log(departments);
    }
  }

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

  let content;

  if(isGetRoleError && getRoleError.status === 405) {
    content = '405 method not allowed!';
  } 
  
  if(isInstitutionSuccess && isGetRoleSuccess) {
    content = 
    <>
      <label>Naziv grupe</label>
      <input type="text" value={institution.name} disabled={getRole.role !== 'Owner'}/>
      <label>Tip grupe</label>
      <input type="text" value={institution.typeOf} disabled={getRole.role !== 'Owner'}/>
      { departments.map((elem, index) => {
        return <div onClick={() => handleDelete(index)}>
          { elem }
        </div>
      })}
      <input type="text" placeholder="Naziv odseka/odeljenja"></input>
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