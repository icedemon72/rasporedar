import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useGetProfessorQuery, useGetProfessorSubjectsQuery } from '../../app/api/professorsApiSlice';
import { useParams } from 'react-router-dom';

const ProfessorsEdit = () => {
  const session = useSelector(state => state.session);
  const { institution, id } = useParams();

  const [ name, setName ] = useState('');
  const [ title, setTitle ] = useState('');
  const [ bachelor, setBachelor ] = useState({});
  const [ master, setMaster ] = useState({});
  const [ doctorate, setDoctorate ] = useState({});
  const [ education, setEducation ] = useState({});
  const [ bio, setBio ] = useState('');
  const [ references, setReferences ] = useState([]);

  const {
    data: professorData,
    isSuccess: isProfessorSuccess
  } = useGetProfessorQuery(id, {
    skip: !session.accessToken
  });

  const {
    data: subjectsData,
    isSuccess: isSubjectSuccess
  } = useGetProfessorSubjectsQuery(id, {
    skip: !session.accessToken || !institution || !id
  });

  useEffect(() => {
    if(professorData) {
      setName(professorData.name);
      setTitle(professorData.title);
      setBachelor(professorData.bachelor);
      setMaster(professorData.master);
      setDoctorate(professorData.doctorate);
      setBio(professorData.bio);
      setReferences(professorData.references);
    }
    document.title = (professorData) ? `Uredjivanje profesora '${professorData.name}' | Rasporedar` : 'Uredi profesora | Rasporedar';
  }, [ isProfessorSuccess ]);
  
  if(isSubjectSuccess) {
    console.log(subjectsData);
  }
  
  return (
    <div>ProfessorsEdit</div>
  )
}

export default ProfessorsEdit;