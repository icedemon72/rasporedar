import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useDeleteSubjectMutation, useEditSubjectMutation, useGetSubjectProfessorsQuery, useGetSubjectQuery } from '../../app/api/subjectsApiSlice';
import ModalDelete from '../../components/ModalDelete/ModalDelete';
import { useGetProfessorsQuery } from '../../app/api/professorsApiSlice';
import { Save, Trash, PlusCircle } from 'lucide-react';
import { indexOfKeyInArray, excludeSameIDsFromArray } from '../../utils/objectArrays';

const SubjectsEdit = () => {
  const session = useSelector(state => state.session);
  const { institution, id } = useParams();
  const inputPrRef = useRef(null);
  const inputAsRef = useRef(null);

  const [ fetchEdit ] = useEditSubjectMutation();
  const [ fetchDelete ] = useDeleteSubjectMutation();


  const [ open, setOpen ] = useState(false);
  const [ isSubmitting, setIsSubmitting ] = useState(false);

  const [ name, setName ] = useState('');
  const [ description, setDescription ] = useState('');
  const [ goal, setGoal ] = useState('');
  const [ result, setResult ] = useState('');
  const [ references, setReferences ] = useState([]);

  const [ professors, setProfessors ] = useState([]);
  const [ assistents, setAssistents ] = useState([]);

  const {
    data: subjectData,
    isSuccess: isSubjectSuccess,
    isLoading: isSubjectLoading,
    isError: isSubjectError,
    error: subjectError
  } = useGetSubjectQuery({ id, fullInfo: true }, {
    skip: !session.accessToken || !id,
  });

  const {
    data: professorsData,
    isSuccess: isProfessorsSuccess,
    isLoading: isProfessorsLoading,
    isError: isProfessorsError,
    error: professorsError
  } = useGetProfessorsQuery(institution, {
    skip: !session.accessToken || !id,
  });

  const {
    data: professorsSubjectData,
    isSuccess: isProfessorsSubjectSuccess,
    isLoading: isProfessorsSubjectLoading,
    isError: isProfessorsSubjectError,
    error: professorsSubjectErrror
  } = useGetSubjectProfessorsQuery(id, {
    skip: !session.accessToken || !id,
  });


  const handleAddProfessor = () => {
    if(inputPrRef.current.value !== '0') {
      let index = indexOfKeyInArray(professorsData, '_id', inputPrRef.current.value);
      if(index !== -1) {
        const tempArray = [ ...professors, professorsData[index] ];
        setProfessors(tempArray);
      }
    }
  } 

  const handleDeleteProfessor = (professor) => {
    const tempProfessors = excludeSameIDsFromArray(professors, [{ _id: professor }]);
    setProfessors(tempProfessors);
  }
  
  const handleAddAssistent = () => {
    if(inputAsRef.current.value !== '0') {
      let index = indexOfKeyInArray(professorsData, '_id', inputAsRef.current.value);
      if(index !== -1) {
        const tempArray = [ ...assistents, professorsData[index] ];
        setAssistents(tempArray);
      }
    }
  }

  const handleDeleteAssistent = (professor) => {
    const tempAssistents = excludeSameIDsFromArray(assistents, [{ _id: professor }]);
    setAssistents(tempAssistents);
  }
  
  const handleEditSubject =  async () => {
    try {
      setIsSubmitting(true);
      const prof = professors.map(prof => prof._id);
      const ass = assistents.map(ass => ass._id);
      const body = {
        name, description, goal, result, references, 
        professors: prof,
        assistents: ass
      }
      console.log(ass);
      const res = await fetchEdit({ id, body });
    } catch (err) {
      console.log(err);
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleDeleteSubject = async () => {
    try {
      setIsSubmitting(true);
      const result = await fetchDelete(id);
    } catch (err) {
      console.log(err);
    } finally {
      setOpen(false);
      setIsSubmitting(false);
    }
  }

  let content;

  if(isSubjectSuccess && isProfessorsSuccess) {
    content = 
    <>
      <div className="w-full flex justify-center mt-5">
        <div className="w-full md:w-1/2 lg:w-1/3">
          <input className="input-field mb-4" type="text"  value={name} placeholder="Unesite naziv predmeta" onChange={(elem) => setName(elem.target.value)} />
          <textarea className="input-field mb-4" type="text" value={description} placeholder="Unesite opis predmeta" onChange={(elem) => setDescription(elem.target.value)}></textarea>
          <textarea className="input-field mb-4" type="text" value={goal} placeholder="Unesite cilj predmeta" onChange={(elem) => setGoal(elem.target.value)}></textarea>
          <textarea className="input-field mb-4" type="text" value={result} placeholder="Unesite rezultat predmeta"onChange={(elem) => setResult(elem.target.value)}></textarea>
          
          {/* ADD REFERENCES */}
          {/* <input type="text" value={name} placeholder="Unesite naziv predmeta" onChange={(elem.target.value) => setName(elem.target.value)} /> */}
          { professors.map(elem => {
              return <>
                <p>{elem.title || ''} {elem.name || 'Bezimeni profesor'}</p>
                <button onClick={() => handleDeleteProfessor(elem._id)}>Obrisi</button>
              </>
            })}
            <div className="flex gap-3 items-center justify-center mb-4">
              <select className="input-field w-4/5" ref={inputPrRef}>
                <option value="0">Izaberite profesora</option>
                { 
                  excludeSameIDsFromArray(professorsData, [ ...professors, ...assistents ]).map(elem => {
                    return <option value={elem._id}>{ elem.name }</option>
                  })
                }
              </select>
              <button className="w-1/5 p-2 flex justify-center" disabled={!professorsData.length} onClick={professorsData.length ? handleAddProfessor : null}><PlusCircle /></button>
            </div>
          
            { assistents.map(elem => {
              return <>
                <p>{elem.title || ''} {elem.name || 'Bezimeni profesor'}</p>
                <button onClick={() => handleDeleteAssistent(elem._id)}>Obrisi</button>
              </>
            })}
            <div className="flex gap-3 items-center justify-center mb-4">
              <select className="input-field w-4/5" ref={inputAsRef}>
              <option value="0">Izaberite asistenta</option>
                { 
                  excludeSameIDsFromArray(professorsData, [ ...professors, ...assistents ]).map(elem => {
                    return <option value={elem._id}>{ elem.name }</option>
                  }) 
                }
              </select>
              <button className="w-1/5 p-2 flex justify-center" disabled={!professorsData.length} onClick={professorsData.length ? handleAddAssistent : null}><PlusCircle /></button>
            </div>
          
          <div className="flex justify-center mt-3">
          <button disabled={isSubmitting} className="flex w-full md:w-1/2 lg:w-1/3 btn-green rounded justify-center" onClick={handleEditSubject}><Save /> Sacuvaj izmene!</button>
          </div>

          <div className="flex justify-center mt-3">
          <button disabled={isSubmitting} className="flex w-full md:w-1/2 lg:w-1/3 btn-red rounded justify-center" onClick={() => setOpen(true)}><Trash /> Obrisi</button>
          </div>
        </div>
      </div>
    </>
  } else if(isSubjectLoading) {
    content = <>Loading...</>
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

  
  useEffect(() => {
    if(professorsSubjectData) {
      setProfessors(professorsSubjectData.professors);
      setAssistents(professorsSubjectData.assistents);
    }
  }, [ isProfessorsSubjectSuccess ]);



  return (
    <>
      { open ? 
        <ModalDelete title={'Brisanje predmeta'} text={`Obrisacete predmet '${subjectData.name}'. Da li ste sigurni?`} closeFunc={() => setOpen(false)} >
          <button className="bg-gray-300 hover:bg-gray-500 p-2 rounded"onClick={() => setOpen(false)}>Odustani</button>
          <button className="bg-red-300 hover:bg-red-500 p-2 rounded" onClick={handleDeleteSubject}>Potvrdi</button>
        </ModalDelete>
      : null }

      { content }
    </>
  )
}

export default SubjectsEdit;