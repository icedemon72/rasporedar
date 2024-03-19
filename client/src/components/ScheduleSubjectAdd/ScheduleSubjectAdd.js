import { useState, useRef, useEffect } from 'react'
import { indexOfKeyInArray } from '../../utils/objectArrays';
import { Trash } from 'lucide-react';

const ScheduleSubjectAdd = ({
  subjects, systemType,
  closeFunc, className, 
  addSubject, days, indexes,
  handleDeleteSubject, data
}) => {
  const [ selectedSubject, setSelectedSubject ] = useState(data?.subject?._id || '0');
  const [ selectedProfessorType, setSelectedProfessorType ] = useState('professor');
  const [ selectedProfessor, setSelectedProfessor ] = useState(data?.lecturer?._id || '0');
  const [ startTime, setStartTime ] = useState(data?.from || '');
  const [ endTime, setEndTime ] = useState(data?.to || '');
  const [ location, setLocation ] = useState(data?.location || '');

  if(data?.lecturer?._id && selectedProfessorType === 'professor' && selectedSubject !== '0') {
    const isProfessor = subjects[indexOfKeyInArray(subjects, '_id', selectedSubject)].professors.find(professor => professor._id === data?.lecturer?._id);
    if(!isProfessor) {
      setSelectedProfessorType('assistent');
    }
  }

  const handleChangeSubject = (id) => {
    setSelectedSubject(id);
  } 

  const closingElem = useRef(null);

  const handleAddSubject = () => {
    const subject = subjects[indexOfKeyInArray(subjects, '_id', selectedSubject)];
    const professor = selectedProfessorType === 'professor' ?
    subjects[indexOfKeyInArray(subjects, '_id', selectedSubject)].professors[indexOfKeyInArray(subjects[indexOfKeyInArray(subjects, '_id', selectedSubject)].professors, '_id', selectedProfessor)]
    : subjects[indexOfKeyInArray(subjects, '_id', selectedSubject)].assistents[indexOfKeyInArray(subjects[indexOfKeyInArray(subjects, '_id', selectedSubject)].assistents, '_id', selectedProfessor)];

    if(subject !== -1 && professor !== -1) {
      if(systemType !== 'school') {
        if(startTime && endTime && startTime < endTime) {
          addSubject(subject, professor, { startTime, endTime }, location)
        } // else { error } 
      } else {
        addSubject(subject, professor, null, location);
      }
    } // else { error }

  }

  const handleIsEscape = event => {
    if(event.key === 'Escape') {
      closeFunc();
    }
  }

  let content;

  content = 
  <>
    <div className={className}>
      { data?.subject ? 
        <button className="float-right" onClick={handleDeleteSubject}><Trash /></button>
      : null}
      <p>{ days[indexes.j] }, { indexes.i + 1}. { systemType !== 'school' ? 'predavanje' : 'čas' }</p>
      <label className="block text-gray-700 text-sm font-bold my-2">Predmet</label> 
      <select className="input-field mb-4" value={selectedSubject} onChange={(elem) => handleChangeSubject(elem.target.value)}>
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
          { systemType !== 'school' ? 
            <>
              <label className="block text-gray-700 text-sm font-bold mb-2">Tip profesora</label> 
              <select className="input-field mb-4" value={selectedProfessorType} onChange={(elem) => setSelectedProfessorType(elem.target.value)}>
                <option value="professor">Profesor (predavanja)</option>
                <option value="assistent">Asistent (vežbe)</option>
              </select>
            </>
            : null }
          
          <label className="block text-gray-700 text-sm font-bold mb-2">Predavač</label>
          <select className="input-field mb-4" value={selectedProfessor} onChange={(elem) => setSelectedProfessor(elem.target.value)}>
            <option value="0">Izaberite { systemType !== 'school' ? 'profesora/asistenta' : 'nastavnika/predavača' }</option>
            { 
              selectedProfessorType === 'professor' ? 
              subjects[indexOfKeyInArray(subjects, '_id', selectedSubject)].professors.map(professor => <option value={ professor._id }>{ professor.title } { professor.name }</option>)
                : subjects[indexOfKeyInArray(subjects, '_id', selectedSubject)].assistents.map(assistent => <option value={ assistent._id }>{ assistent.title } { assistent.name }</option> )
              
            }
          </select>
            {
              systemType !== 'school' ? 
              <>
                <label className="block text-gray-700 text-sm font-bold mb-2">Termin</label>
                <div className="flex items-center w-full gap-3 mt-3">
                  <div className="flex-col basis-1/2">
                    <label className="block text-gray-700 text-xs font-bold uppercase">Od</label>
                    <input type="time" className="input-field" step="3600" min="00:00" max="23:59" pattern="[0-2][0-9]:[0-5][0-9]" value={startTime} onChange={(elem) => setStartTime(elem.target.value)} />
                  </div>
                  <div className="flex-col basis-1/2">
                    <label className="block text-gray-700 text-xs font-bold uppercase">Do</label>
                    <input type="time" className="input-field basis-1/2" step="3600" min="00:00" max="23:59" pattern="[0-2][0-9]:[0-5][0-9]" value={endTime} onChange={(elem) => setEndTime(elem.target.value)}/>
                  </div>
                </div>
                <span className="text-xs block text-slate-500 mt-2">*AM = prepodne, PM = poslepodne</span>
                <span className="text-xs block text-slate-500">(08:00PM = 20:00)</span>
              </> 
              // add inherited time here...
              : null
            }
            <label className="block text-gray-700 text-sm font-bold mb-2">Kabinet/sala/učionica</label>
            <input className="input-field mb-4" type="text" value={location} onChange={(elem) => setLocation(elem.target.value)} />
          <button className="input-field mt-5" disabled={selectedProfessor === '0'}  onClick={handleAddSubject}>
            { data?.subject ? 'Izmeni' : 'Izaberi'}
          </button>
        </>
      : null }
    </div>
  </>

  useEffect(() => {
    closingElem.current.focus();
  }, [ ]);
  
  return (
    <>
    <div className="fixed left-0 top-0 z-[1054] h-full w-full overflow-y-auto overflow-x-outline-none bg-black bg-opacity-80 flex justify-center items-center" tabIndex={-1} ref={closingElem} onKeyDown={handleIsEscape}>
      <div className="fixed left-0 top-0 h-full w-full z-[1055]" onClick={closeFunc} ></div>
      <div className="z-[1056] bg-white rounded-md py-8 px-16 flex flex-col justify-between">
        { content }
      </div>
    </div>
    </>
  )
}

export default ScheduleSubjectAdd;