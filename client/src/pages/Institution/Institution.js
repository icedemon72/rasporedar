import { useNavigate, useParams, Link } from 'react-router-dom';
import { useGetByIdQuery, useGetRoleQuery } from '../../app/api/institutionsApiSlice';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { Pencil } from 'lucide-react';
import MutationState from '../../components/MutationState/MutationState';

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
    skip: !session.refreshToken
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
      <div className="w-full flex justify-center py-2 gap-2">
				<h1 class="text-xl font-black max-w-[500px] truncate"> { institutionData.name }</h1>
				{ role === 'Owner' ? <span class="flex items-center p-1 border-2 border-black hover:box-shadow cursor-pointer"><Link to={`/institutions/edit/${institution}`}><Pencil size={16} /></Link> </span> : null }
				

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
			<div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
				<Link className="flex justify-center min-h-[300px] bg-red-500 col-span-1" to={`/institutions/${institution}/schedules`}>Rasporedi</Link>
				<Link className="flex justify-center min-h-[300px] bg-red-500 col-span-1" to={`/institutions/${institution}/subjects`}>Predmeti</Link>
				<Link className="flex justify-center min-h-[300px] bg-red-500 col-span-1" to={`/institutions/${institution}/professors`}>Profesori</Link>   
			</div>
          
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
    <>
			<MutationState
				isLoading={isInstitutionLoading || isRoleLoading}
			/>
      { InstitutionContent }
    </>
  )
}

export default Institution;