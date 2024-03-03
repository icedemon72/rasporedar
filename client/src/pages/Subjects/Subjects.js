import { useNavigate, useParams, Link } from 'react-router-dom';
import { useGetSubjectsQuery } from '../../app/api/subjectsApiSlice';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

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

  let content;

  if(isLoading) {
    content = <>Loading...</>
  } else if (isSuccess) {
    content = !data.length ? <>Nema predmeta</> 
    : 
    <>
      { data.map(elem => {
        return (
          <>
            <Link to={`/institutions/${institution}/subjects/${elem._id}`}><p>{elem.name}</p></Link>
          </>
        )
      }) }
    </>
  }

  useEffect(() => {
    document.title = `Predmeti | Rasporedar`;
  }, [ institution ]); 

  return (
    <>
      <Link to={`/institutions/${institution}/subjects/add`}>Dodaj predmet</Link>
      {content}
    </>
  )
}

export default Subjects;