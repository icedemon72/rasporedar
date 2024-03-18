import { useNavigate, useParams, Link } from 'react-router-dom';
import { useGetByIdQuery, useGetRoleQuery } from '../../app/api/institutionsApiSlice';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { Pencil } from 'lucide-react';

const Institution = () => {
  const { institution } = useParams();
  const session = useSelector(state => state.session);

  const navigate = useNavigate();

  const { 
    data: institutionData, 
    isLoading: isInstitutionLoading, 
    isSuccess: isInstitutionSuccess, 
    isError: isInstitutionError,
    error: institutionError 
  } = useGetByIdQuery({ id: institution }, {
    skip: !session.accessToken
  });

  const { 
    data: getRole, 
    isLoading: isRoleLoading,
    isSuccess: isRoleSuccess
  } = useGetRoleQuery(institution, {
    skip: !isInstitutionSuccess 
  });

  if(!institution) {
    navigate('/institutions');  
  }

  let InstitutionContent, role;

  if(isInstitutionLoading || isRoleLoading) {
    InstitutionContent = <h1>Loading</h1>
  } else if (isInstitutionSuccess && isRoleSuccess) {
    role = getRole.role;
    
    InstitutionContent = 
    <>
      <div className="flex">
        { institutionData.name } { role === 'Owner' ? <Link to={`/institutions/edit/${institution}`}><Pencil size={16} /></Link> : null }
        {/* { institutionData.departments.length ? 
          institutionData.departments.map(dpt => {
            return (
              <>
                <Link to={`/institutions/${institution}/department/${dpt.split(' ').join('-')}`}>{ dpt }</Link>
              </>
            )
          })
          :
          null
           
        } */}
      </div>
          <Link className="block" to={`/institutions/${institution}/schedules`}>Rasporedi</Link>
          <Link className="block" to={`/institutions/${institution}/subjects`}>Predmeti</Link>
          <Link className="block" to={`/institutions/${institution}/professors`}>Profesori</Link>
    </>
  } else if (isInstitutionError) {
    if(institutionError.status === 404) {
      console.log('Not found')
    }
  }
  
  useEffect(() => {
    document.title = (institutionData) ? `${institutionData.name} | Rasporedar` : 'Grupa | Rasporedar';
  }, [ isInstitutionSuccess ]); 

  return (
    <div>
      { InstitutionContent }
    </div>
  )
}

export default Institution;