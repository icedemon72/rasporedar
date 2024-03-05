import { useNavigate, useParams, Link } from 'react-router-dom';
import { useGetSubjectsQuery } from '../../app/api/subjectsApiSlice';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useGetRoleQuery } from '../../app/api/institutionsApiSlice';
import { PlusCircle, Pencil, Info } from 'lucide-react';

const Subjects = () => {
  const { institution } = useParams();
  const session = useSelector(state => state.session);
  
  const {
    data,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetSubjectsQuery(({institution: institution}), {
    skip: !institution || !session.accessToken
  });

  const { 
    data: getRole, 
    isSuccess: isGetRoleSuccess, 
  } = useGetRoleQuery(institution, { skip: !session.accessToken  });

  let content;

  if(isLoading) {
    content = <>Loading...</>
  } else if (isSuccess) {
    content = !data.length ? <>Nema predmeta</> 
    : 
    <>
      <div className="w-full flex justify-center  mt-5">
        <div className="w-full md:w-1/2 lg:w-1/3">
          { isGetRoleSuccess && getRole.role !== 'User' ? 
            <Link to={`/institutions/${institution}/subjects/add`}>
              <div className="w-full flex border p-2 items-center justify-center">
                <PlusCircle size={16} /> 
                <p>Dodaj predmet</p>
              </div>
            </Link>
            : null }
          <div className="mt-5">
            { data.map(elem => {
              return (
                <>
                  <div className="w-full flex items-center justify-between p-2 mb-2 border-b-2">
                    <p>{ elem.name }</p>
                    <div className="flex gap-3">
                      { isGetRoleSuccess && getRole.role !== 'User' ? <Link to={`/institutions/${institution}/subjects/${elem._id}/edit`}><Pencil /></Link> : null }
                      <Link to={`/institutions/${institution}/subjects/${elem._id}`}><Info /></Link>
                    </div>
                  </div>
                </>
              )
            }) }

          </div>
        </div>
      </div>
    </>
  }

  useEffect(() => {
    document.title = `Predmeti | Rasporedar`;
  }, [ institution ]); 

  return (
    <>
     
      {content}
    </>
  )
}

export default Subjects;