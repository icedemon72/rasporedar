import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useGetProfessorsQuery } from '../../app/api/professorsApiSlice';
import { addProfessorInArray, deleteProfessorFromArray } from '../../utils/subjectHelper';
import { useAddSubjectMutation } from '../../app/api/subjectsApiSlice';
import { PlusCircle, Trash } from 'lucide-react';

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
  const [ result, setResult ] = useState('');
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
        references,
        result
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
        <div className="w-full flex justify-center">
          <div className="w-full md:w-1/2 lg:w-1/3 mt-5">
            <input type="text" className="input-field mb-4" placeholder="Naziv predmeta" onChange={(elem) => setName(elem.target.value)} />
            <textarea className="input-field mb-4" onChange={(elem) => setDescription(elem.target.value)} placeholder="Opis predmeta"></textarea>
            <textarea className="input-field mb-4" onChange={(elem) => setGoal(elem.target.value)} placeholder="Cilj predmeta"></textarea>
            <textarea className="input-field mb-4" onChange={(elem) => setResult(elem.target.value)} placeholder="Rezultat predmeta"></textarea>
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
            <div className="flex gap-3 items-center justify-center mb-4">
              <select className="input-field w-4/5" ref={inputPrRef}>
                {!professors.length ? <option value="0">Dodaj profesora kasnije</option> : null}
                {content}
              </select>
              <button className="w-1/5 p-2 flex justify-center" disabled={!fetchedProfessors.length} onClick={fetchedProfessors.length ? handleAddProfessor : null}><PlusCircle /></button>

            </div>
            

            {fetchedProfessors.map(elem => {
              if(elem.selected && elem.role === 'A') {
                return <>
                  <p>{elem.title || ''} {elem.name || 'Bezimeni profesor'}</p>
                  <button onClick={() => handleDeleteAssistent(elem._id)}>Obrisi</button>
                </>
              }
            })}
            <div className="flex gap-3 items-center justify-center mb-4">
              <select className="input-field w-4/5" ref={inputAsRef}>
                <option value="0">Dodaj asistenta kasnije</option>
                {content}
              </select>
              <button className="w-1/5 p-2 flex justify-center" disabled={!fetchedProfessors.length} onClick={fetchedProfessors.length ? handleAddAssistent : null}><PlusCircle /></button>
            </div>
            
            <div className="flex justify-center">
              <button onClick={handleAddSubject}>Dodaj predmet</button>
            </div>
          </div>
        </div>
      </>
      : null } 
        
    </>
  )
}

export default SubjectsAdd;