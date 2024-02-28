import { useSelector } from 'react-redux';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { useGetProfessorQuery, useGetProfessorSubjectsQuery } from '../../app/api/professorsApiSlice';
import { useEffect } from 'react';


const Professor = () => {
  const session = useSelector(state => state.session);
  const { id, institution } = useParams();
  const {
    data: professorData, 
    isLoading: isProfessorLoading,
    isSuccess: isProfessorSuccess,
    isError: isProfessorError
  } = useGetProfessorQuery(id, {
    skip: !session.accessToken || !id || !institution
  });

  const {
    data: subjectsData,
    isLoading: isSubjectsLoading,
    isSuccess: isSubjectsSuccess
  } = useGetProfessorSubjectsQuery(id, {
    skip: !session.accessToken || !professorData
  })
  
  let content;

  if(isSubjectsLoading) {
    content = <>Loading</>
  } else if (isSubjectsSuccess) {
    content = 
    <>
      <h2>{professorData.name}</h2>
      <h2>{professorData.bio}</h2>
    </>
  }

  useEffect(() => {
    document.title = professorData ? `Profesor ${professorData.name} | Rasporedar` : `Profesor | Rasporedar`;
  }, [ isProfessorSuccess ]);
  
  return (
    <>
      <Link to={`/institutions/${institution}/professors/${id}/edit`}>Edit</Link>
      {content}
    </>
  )
}

export default Professor;