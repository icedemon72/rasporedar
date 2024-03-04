import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom';
import { useGetSubjectQuery } from '../../app/api/subjectsApiSlice';
import { useGetRoleQuery } from '../../app/api/institutionsApiSlice';

const Subject = () => {
  const session = useSelector(state => state.session);

  const { institution, id } = useParams();
  
  const {
    data, 
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetSubjectQuery({id: id, fullInfo: true}, {
    skip: !id || !institution || !session.accessToken
  });

  const { 
    data: getRole, 
    isSuccess: isGetRoleSuccess, 
  } = useGetRoleQuery(institution, { skip: !session.accessToken  });

  let content;

  if(isLoading) {
    content = <>Loading...</>
  } else if (isSuccess) {
    content = 
    <>
      <p>{ data.name }</p>
    </>
  }


  useEffect(() => {
    document.title = data ? `Predmet '${data.name}' | Rasporedar` : 'Predmet | Rasporedar';
  }, [ isSuccess ]);
  return (
    <>
      { isGetRoleSuccess && getRole.role !== 'User' ? 
        <Link to={`/institutions/${institution}/subjects/${id}/edit`}>Edit</Link>
        : null 
      }
      
      { content }
    </>
  )
}

export default Subject;