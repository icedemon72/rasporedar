import { useNavigate, useParams, Link } from 'react-router-dom';
import { useGetByIdQuery, useGetRoleQuery } from '../../app/api/institutionsApiSlice';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

const Institution = () => {
  const { id } = useParams();
  const session = useSelector(state => state.session);

  const navigate = useNavigate();

  const { 
    data: institution, 
    isLoading: isInstitutionLoading, 
    isSuccess: isInstitutionSuccess, 
    isError: isInstitutionError,
    error: institutionError 
  } = useGetByIdQuery(id, { skip: !session.accessToken  });

  const { data: getRole, isLoading: isRoleLoading, isSuccess: isRoleSuccess } = useGetRoleQuery(id, { skip: !isInstitutionSuccess });

  if(!id) {
    navigate('/institutions');  
  }

  let InstitutionContent, role;

  if(isInstitutionLoading || isRoleLoading) {
    InstitutionContent = <h1>Loading</h1>
  } else if (isInstitutionSuccess && isRoleSuccess) {
    role = getRole.role;
    
    InstitutionContent = 
    <>
      { institution.name } { role === 'Owner' ? <Link to={`/institutions/edit/${id}`}>Edit</Link> : null }
    </>
  } else if (isInstitutionError) {
    if(institutionError.status === 404) {
      console.log('Not found')
    }
  }
  
  useEffect(() => {
    document.title = (institution) ? `${institution.name} | Rasporedar` : 'Grupa | Rasporedar';
  }, [ isInstitutionSuccess ]); 

  return (
    <div>
      { InstitutionContent }
    </div>
  )
}

export default Institution;