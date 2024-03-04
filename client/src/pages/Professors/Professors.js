import { useParams, Link } from 'react-router-dom';
import { useGetProfessorsQuery } from '../../app/api/professorsApiSlice';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useGetRoleQuery } from '../../app/api/institutionsApiSlice';
import { Info, Pencil, PlusCircle } from 'lucide-react';
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

  const { 
    data: getRole, 
    isSuccess: isGetRoleSuccess, 
  } = useGetRoleQuery(institution, { skip: !session.accessToken  });

  let professorsContent;

  if(isProfessorsLoading) {
    professorsContent = <>Loading...</>
  } else if (isProfessorsSuccess) {
    professorsContent = 
    <>
      <div className="w-full flex justify-center  mt-5">
        <div className="w-full md:w-1/2 lg:w-1/3">
          { isGetRoleSuccess && getRole.role !== 'User' ? 
            <Link className="cursor-pointer" to={`/institutions/${institution}/professors/add`}>
              <div className="w-full flex border p-2 items-center justify-center">
                <PlusCircle size={16} /> 
                <p>Dodaj profesora</p>
              </div>
            </Link>
            : null }
          { professors.length ? 
            <div className="mt-5">
              { professors.map(elem => {
                return (
                  <>
                    <div className="w-full flex items-center justify-between p-2 mb-2 border-b-2">
                      <p><span className="text-slate-500 text-sm">{elem.title}</span> { elem.name }</p>
                      <div className="flex gap-3">
                        { isGetRoleSuccess && getRole.role !== 'User' ? <Link to={`/institutions/${institution}/professors/${elem._id}/edit`}><Pencil /></Link> : null }
                        <Link to={`/institutions/${institution}/professors/${elem._id}`}><Info /></Link>
                      </div>
                    </div>
                  </>
                ) 
              }) }
            </div>
            :
            <>Nema profesora</>
          }
        </div>
      </div>
    </>
  } else if (isProfessorsError) {
    professorsContent = <>Greška!</>
  }

  useEffect(() => {
    document.title = 'Profesori | Rasporedar';
  }, []);

  return (
    <>
      { professorsContent }
    </>
  )
}

export default Professors;