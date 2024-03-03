import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useDeleteSubjectMutation, useEditSubjectMutation, useGetSubjectProfessorsQuery, useGetSubjectQuery } from '../../app/api/subjectsApiSlice';
import { addProfessorInArray, deleteProfessorFromArray } from '../../utils/subjectHelper';
import ModalDelete from '../../components/ModalDelete/ModalDelete';
import { useGetProfessorsQuery } from '../../app/api/professorsApiSlice';

const SubjectsEdit = () => {
  const session = useSelector(state => state.session);
  const { institution, id } = useParams();
  const inputPrRef = useRef(null);
  const inputAsRef = useRef(null);

  const [ fetchEdit ] = useEditSubjectMutation();
  const [ fetchDelete ] = useDeleteSubjectMutation();


  const [ open, setOpen ] = useState(false);
  const [ name, setName ] = useState('');
  const [ description, setDescription ] = useState('');
  const [ goal, setGoal ] = useState('');
  const [ result, setResult ] = useState('');
  const [ references, setReferences ] = useState([]);

  const [ fetchedProfessors, setFetchedProfessors ] = useState([]);
  const [ professors, setProfessors ] = useState([]);
  const [ assistents, setAssistents ] = useState([]);

  const {
    data: subjectData,
    isSuccess: isSubjectSuccess,
    isLoading: isSubjectLoading,
    isError: isSubjectError,
    error: subjectError
  } = useGetSubjectQuery({ id, fullInfo: true }, {
    skip: !session.accessToken || !id
  });

  // const {
  //   data: professorsSubjectData,
  //   isSuccess: isProfessorsSubjectSuccess,
  //   isLoading: isProfessorsSubjectLoading,
  //   isError: isProfessorsSubjectError,
  //   error: professorsSubjectErrror
  // } = useGetSubjectProfessorsQuery(id, {
  //   skip: !subjectData || isSubjectError
  // })

  // const {
  //   data: professorsData,
  //   isSuccess: isProfessorsSuccess,
  //   isLoading: isProfessorsLoading,
  //   isError: isProfessorsError,
  //   error: professorsError
  // } = useGetProfessorsQuery(institution, {
  //   skip: !professorsSubjectData || isProfessorsSubjectError
  // });
  
  const handleEditSubject =  async () => {
    try {
      const body = {
        name, description, goal, result, references
      }

      const res = await fetchEdit({ id, body });
    } catch (err) {
      console.log(err);
    }
  }

  const handleDeleteSubject = async () => {
    try {
      const result = await fetchDelete(id);
    } catch (err) {
      console.log(err);
    } finally {
      setOpen(false);
    }
  }

  let content;

  if(isSubjectSuccess) {
    content = 
    <>
      <input type="text" value={name} placeholder="Unesite naziv predmeta" onChange={(elem) => setName(elem.target.value)} />
      <textarea type="text" value={description} placeholder="Unesite opis predmeta" onChange={(elem) => setDescription(elem.target.value)}></textarea>
      <textarea type="text" value={goal} placeholder="Unesite cilj predmeta" onChange={(elem) => setGoal(elem.target.value)}></textarea>
      <input type="text" value={result} placeholder="Unesite rezultat predmeta" onChange={(elem) => setResult(elem.target.value)} />
      
      {/* ADD REFERENCES */}
      {/* <input type="text" value={name} placeholder="Unesite naziv predmeta" onChange={(elem.target.value) => setName(elem.target.value)} /> */}
      
      <button onClick={handleEditSubject}>Sacuvaj izmene</button>
      <button onClick={() => setOpen(true)}>Obrisi</button>
    </>
  }


  useEffect(() => {
    if(subjectData) {
      setName(subjectData.name);
      setDescription(subjectData.description);
      setGoal(subjectData.goal);
      setResult(subjectData.result);
      setReferences(subjectData.references);
    }

    document.title = (subjectData) ? `Uredjivanje predmeta '${subjectData.name}' | Rasporedar` : `Uredjivanje predmeta | Rasporedar`;
  }, [ isSubjectSuccess ]);
  
  return (
    <>
      { open ? 
        <ModalDelete>
          <button onClick={() => setOpen(false)}>Odustani</button>
          <button onClick={handleDeleteSubject}>Potvrdi</button>
        </ModalDelete>
      : null }

      { content }
    </>
  )
}

export default SubjectsEdit;