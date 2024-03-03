import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useGetProfessorsQuery } from '../../app/api/professorsApiSlice';
import { addProfessorInArray, deleteProfessorFromArray } from '../../utils/subjectHelper';
import { useAddSubjectMutation } from '../../app/api/subjectsApiSlice';


/* ADD ASS functionality!!!! */
const SubjectsAdd = () => {
  const session = useSelector(state => state.session);
  const { institution } = useParams();
  const inputPrRef = useRef(null);
  const inputAsRef = useRef(null);

  const {
    data,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetProfessorsQuery(institution, {
    skip: !session.accessToken || !institution
  });

  const [ fetchAddSubject ] = useAddSubjectMutation();

  const [ fetchedProfessors, setFetchedProfessors ] = useState([]);
  const [ professors, setProfessors ] = useState([]);
  const [ assistents, setAssistents ] = useState([]);
  const [ name, setName ] = useState('');
  const [ description, setDescription] = useState('');
  const [ goal, setGoal ] = useState('');
  const [ references, setReferences] = useState([]);
  
  const handleAddProfessor = () => {
    const selectedProfessor = inputPrRef.current.value;
    
    let {
      tempProfessors,
      tempFetched,
      done
    } = addProfessorInArray(selectedProfessor, professors, fetchedProfessors, 'P');
    
    if(done) {
      setProfessors(tempProfessors);
      setFetchedProfessors(tempFetched);
    }
  } 

  const handleDeleteProfessor = (professor) => {
    let {
      tempProfessors,
      tempFetched,
      done
    } = deleteProfessorFromArray(professor, professors, fetchedProfessors);
    
    if(done) {
      setProfessors(tempProfessors);
      setFetchedProfessors(tempFetched);
    }
  }
  
  const handleAddAssistent = () => {
    const selectedProfessor = inputAsRef.current.value;
    
    let {
      tempProfessors,
      tempFetched,
      done
    } = addProfessorInArray(selectedProfessor, assistents, fetchedProfessors, 'A');
    
    if(done) {
      setAssistents(tempProfessors);
      setFetchedProfessors(tempFetched);
    }
  }

  const handleDeleteAssistent = (professor) => {
    let {
      tempProfessors,
      tempFetched,
      done
    } = deleteProfessorFromArray(professor, assistents, fetchedProfessors);
    
    if(done) {
      setAssistents(tempProfessors);
      setFetchedProfessors(tempFetched);
    }
  }
  
  const handleAddSubject = async () => {
    // add input check here!!!
    try {
      const body = {
        professors,
        assistents,
        name,
        description,
        goal,
        references
      }

      const result = await fetchAddSubject({institution, body});
    } catch (err) {
      console.log(err);
    }
  }
  
  let content;
  
  if(isLoading) {
    content = <option disabled>Loading...</option>
  } else if (isSuccess) {
    if(data.message) {
      content = null;
    } else {
      content = fetchedProfessors.map(elem => {
        if(!elem.selected) {
          return <option value={elem._id}>{ elem.name }</option>
        }
      });
    }
  }
  
  useEffect(() => {
    document.title = 'Dodaj predmet | Rasporedar';
  }, []);

  useEffect(() => {
    setFetchedProfessors(data || []);
  }, [ isSuccess ]);
  
  return (
    <>
      { isSuccess ? 
      <>
        <input type="text" placeholder="Naziv predmeta" onChange={(elem) => setName(elem.target.value)} />
        <textarea onChange={(elem) => setDescription(elem.target.value)} placeholder="Opis predmeta"></textarea>
        <textarea onChange={(elem) => setGoal(elem.target.value)} placeholder="Cilj predmeta"></textarea>
        {/* References should work on enter! */}
        {/* <input type="text" onChange={(elem) => setGoal(elem.target.value)} placeholder="Refe"></input> */}
        {fetchedProfessors.map(elem => {
          if(elem.selected && elem.role === 'P') {
            return <>
              <p>{elem.title || ''} {elem.name || 'Bezimeni profesor'}</p>
              <button onClick={() => handleDeleteProfessor(elem._id)}>Obrisi</button>
            </>
          }
        })}
        
        <select ref={inputPrRef}>
          {!professors.length ? <option value="0">Dodaj profesora kasnije</option> : null}
          {content}
        </select>
        {fetchedProfessors.length  ? <button onClick={handleAddProfessor}>+</button> : null}
        

        {fetchedProfessors.map(elem => {
          if(elem.selected && elem.role === 'A') {
            return <>
              <p>{elem.title || ''} {elem.name || 'Bezimeni profesor'}</p>
              <button onClick={() => handleDeleteAssistent(elem._id)}>Obrisi</button>
            </>
          }
        })}
        <select ref={inputAsRef}>
          <option value="0">Dodaj asistenta kasnije</option>
          {content}
        </select>
        {fetchedProfessors.length ? <button onClick={handleAddAssistent}>+</button> : null}
        
        <button onClick={handleAddSubject}>Dodaj predmet</button>
      </> 
      : null } 
    </>
  )
}

export default SubjectsAdd;