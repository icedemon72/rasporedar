import { useSelector } from 'react-redux';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { useGetProfessorQuery } from '../../app/api/professorsApiSlice';
import { useEffect } from 'react';


const Professor = () => {
  const session = useSelector(state => state.session);
  const { id, institution } = useParams();
  const {
    data, 
    isLoading,
    isSuccess,
    isError
  } = useGetProfessorQuery(id, {
    skip: !session.accessToken
  });
  
  let content;

  if(isLoading) {
    content = <>Loading</>
  } else if (isSuccess) {
    content = 
    <>
      <h2>{data.name}</h2>
      <h2>{data.bio}</h2>
    </>
  }

  useEffect(() => {
    document.title = data ? `Profesor ${data.name} | Rasporedar` : `Profesor | Rasporedar`;
  }, [ isSuccess ]);
  
  return (
    <>
      <Link to={`/institutions/${institution}/professors/${id}/edit`}>Edit</Link>
      {content}
    </>
  )
}

export default Professor;