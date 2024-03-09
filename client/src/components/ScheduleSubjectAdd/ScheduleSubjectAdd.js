import { useState } from 'react'
import { useGetSubjectProfessorsQuery } from '../../app/api/subjectsApiSlice';
import { useSelector } from 'react-redux';
import { indexOfKeyInArray } from '../../utils/objectArrays';
import { useParams } from 'react-router-dom';

const ScheduleSubjectAdd = ({
  subjects,
  closeFunc, className, 
  addSubject, days, indexes,

}) => {
  const session = useSelector(state => state.session);
  const [ selectedSubject, setSelectedSubject ] = useState('0');
  const [ selectedProfessorType, setSelectedProfessorType ] = useState('professor');
  const [ selectedProfessor, setSelectedProfessor ] = useState('0');
  
  const { institution } = useParams();

  const handleChangeSubject = (id) => {
    setSelectedSubject(id);
  }

  let content;

  let subjectContent;

  subjectContent = 
  <>
    <div className={className}>
      <p>{ days[indexes.j] }, { indexes.i + 1}. čas</p>
      <select className="input-field mb-4" onChange={(elem) => handleChangeSubject(elem.target.value)}>
        <option value="0">Izaberite predmet</option>
        {
          subjects.map(subject => {
            return (
              <option value={ subject._id }>
                { subject.name }
              </option>
            )
          })
        }
      </select>
      
      { selectedSubject !== '0' ? 
        <>
          <select className="input-field mb-4" onChange={(elem) => setSelectedProfessorType(elem.target.value)}>
            <option value="professor">Profesor (predavanja)</option>
            <option value="assistent">Asistent (vežbe)</option>
          </select>
          <select className="input-field mb-4" onChange={(elem) => setSelectedProfessor(elem.target.value)}>
            <option value="0">Izaberite profesora/asistenta</option>
            { 
              subjects.map(item => {
                return selectedProfessorType === 'professor' ? 
                  item.professors.map(professor => <option value={ professor._id }>{ professor.title } { professor.name } (<span className="text-xs">Profesor</span>)</option>)
                  : item.assistents.map(assistent => <option value={ assistent._id }>{ assistent.title } { assistent.name } (<span className="text-xs">Asistent</span>)</option> )
              })
            }
          </select>
          <button className="input-field" disabled={selectedProfessor === '0'} 
            onClick={() => addSubject(
              subjects[indexOfKeyInArray(subjects, '_id', selectedSubject)]
              // ,
              // selectedProfessorType === 'professor' ?
              //   subjects.professors[indexOfKeyInArray(subjects.professors, '_id', selectedProfessor)]
              //   : subjects.assistents[indexOfKeyInArray(subjects.assistents, '_id', selectedProfessor)]
            )}
          >Izaberi predmet</button>
        </>
      : null }
    </div>
  </>
  
  return (
    <>
    <div className="fixed left-0 top-0 z-[1054] h-full w-full overflow-y-auto overflow-x-outline-none bg-black bg-opacity-80 flex justify-center items-center" >
      <div className="fixed left-0 top-0 h-full w-full z-[1055]" onClick={closeFunc} ></div>
      <div className="w-[400px] h-[500px] z-[1056] bg-white rounded-md py-8 px-16 flex flex-col justify-between">
        { subjectContent }
      </div>
    </div>
    </>
  )
}

export default ScheduleSubjectAdd;