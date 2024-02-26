import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useGetProfessorQuery } from '../../app/api/professorsApiSlice';
import { useParams } from 'react-router-dom';

const ProfessorsEdit = () => {
  const session = useSelector(state => state.session);
  const { id } = useParams();

  const {
    data,
    isSuccess
  } = useGetProfessorQuery(id, {
    skip: !session.accessToken
  })

  useEffect(() => {
    document.title = (data) ? `Uredjivanje profesora '${data.name}' | Rasporedar` : 'Uredi profesora | Rasporedar';
  }, [ isSuccess ]);
  
  return (
    <div>ProfessorsEdit</div>
  )
}

export default ProfessorsEdit;