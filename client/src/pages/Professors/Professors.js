import { useNavigate, useParams, Link } from 'react-router-dom';
import { useGetProfessorsQuery } from '../../app/api/professorsApiSlice';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';


const Professors = () => {
  const { institution } = useParams();
  const session = useSelector(state => state.session);

  const { 
    data: professors, 
    isLoading: isProfessorsLoading, 
    isSuccess: isProfessorsSuccess,
    isError: isProfessorsError,
    error: professorsError
  } = useGetProfessorsQuery(institution, {
    skip: !session.accessToken
  });

  // const { 
  //   data: getRole, 
  //   isLoading: isGetRoleLoading, 
  //   isSuccess: isGetRoleSuccess, 
  //   isError: isGetRoleError,
  //   error: getRoleError 
  // } = useGetAuthRoleQuery(id, { skip: !session.accessToken  });


  let professorsContent;

  if(isProfessorsLoading) {
    professorsContent = <>Loading...</>
  } else if (isProfessorsSuccess) {
    professorsContent = 
    <>
    {/* Add check if user is owner or moderator here */}
      <Link to={`/institutions/${institution}/professors/add`}>Dodaj profesora</Link>
      {professors.length ? 
        <>
          {professors.map(elem => {
            return <Link to={`/institutions/${institution}/professors/${elem._id}`}><h1>{elem.name}</h1></Link>
          })}
        </>
        :
        <>Nema profesora</>
      
      }
    </>
  } else if (isProfessorsError) {
    professorsContent = <>Greška!</>
  }

  useEffect(() => {
    document.title = 'Profesori | Rasporedar';
  }, []);

  return (
    <>
      {professorsContent}
    </>
  )
}

export default Professors;