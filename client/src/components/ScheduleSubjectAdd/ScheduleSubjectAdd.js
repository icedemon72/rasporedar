import { useState, useRef, useEffect } from 'react'
import { indexOfKeyInArray } from '../../utils/objectArrays';
import { Trash } from 'lucide-react';
import SelectComponent from '../Input/SelectComponent';
import { professorTypes } from '../../models/SelectModels';

const ScheduleSubjectAdd = ({
  subjects, systemType,
  closeFunc, className, 
  addSubject, days, indexes,
  handleDeleteSubject, data
}) => {
  const [ selectedSubject, setSelectedSubject ] = useState(
		data?.subject?._id ? { value: data.subject._id, label: data?.subject?.name } : null
	);
  const [ selectedProfessorType, setSelectedProfessorType ] = useState(professorTypes[0]);
  const [ selectedProfessor, setSelectedProfessor ] = useState(
		data?.lecturer?._id ? { value: data.lecturer._id, label: data?.lecturer?.name } : null
	);
  const [ startTime, setStartTime ] = useState(data?.from || '');
  const [ endTime, setEndTime ] = useState(data?.to || '');
  const [ location, setLocation ] = useState(data?.location || '');

	if(data?.lecturer?._id && selectedProfessorType?.value === 'professor' && selectedSubject?.value !== null) {
		const isProfessor = subjects[indexOfKeyInArray(subjects, '_id', selectedSubject.value)].professors.find(professor => professor._id === data?.lecturer?._id);
    
		if(!isProfessor) {
      setSelectedProfessorType(professorTypes[1]); // assistant
    }
  }

  const handleChangeSubject = (elem) => {
		setSelectedSubject(elem);
  } 

  const closingElem = useRef(null);

  const handleAddSubject = () => {
		const subjValue =  selectedSubject?.value;
    
		if(!subjValue || selectedProfessor !== null) {
			const subject = subjects[indexOfKeyInArray(subjects, '_id', subjValue)];
			const professor = selectedProfessorType.value === 'professor' ?
			subjects[indexOfKeyInArray(subjects, '_id', subjValue)].professors[indexOfKeyInArray(subjects[indexOfKeyInArray(subjects, '_id', subjValue)].professors, '_id', selectedProfessor?.value)]
			: subjects[indexOfKeyInArray(subjects, '_id', subjValue)].assistents[indexOfKeyInArray(subjects[indexOfKeyInArray(subjects, '_id', subjValue)].assistents, '_id', selectedProfessor?.value)];
	
			if(subject !== -1 && professor !== -1) {
				if(systemType.value !== 'school') {
					if(startTime && endTime && startTime < endTime) {
						addSubject(subject, professor, { startTime, endTime }, location)
					} // else { error } 
				} else {
					addSubject(subject, professor, null, location);
				}
			} // else { error }
		}
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
        <button className="float-right" onClick={handleDeleteSubject}><Trash className="hover:scale-110 transition-all" data-tooltip-id="my-tooltip" data-tooltip-content={`Obriši predavanje`} /></button>
      : null}
      <p className="text-lg font-bold pb-2	">{ days[indexes.j] }, { indexes.i + 1}. { systemType !== 'school' ? 'predavanje' : 'čas' }</p>
      <label className="label-primary">Predmet</label> 
			<SelectComponent 
				data={subjects.map((subj) => ({ value: subj._id, label: subj.name }))}
				isMulti={false}
				value={selectedSubject}
				setVal={(e) => handleChangeSubject(e)}
				required={true}
				isClearable={false}
				placeholder={"Izaberite predmet"}
			/>
      {/* <select className="input-field mb-4" value={selectedSubject} onChange={(elem) => handleChangeSubject(elem.target.value)}>
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
      </select> */}

      
      
      { selectedSubject !== null ? 
        <>
          { systemType.value !== 'school' ? 
            <>
              <label className="label-primary">Tip profesora</label> 
              <SelectComponent 
								data={professorTypes}
								isMulti={false}
								value={selectedProfessorType}
								required={true}
								setVal={(e) => setSelectedProfessorType(e)}
								placeholder="Izaberite tip profesora"
								isClearable={false}
							/>
            </>
            : null }
          
          <label className="label-primary">Predavač</label>
          <SelectComponent 
						data={
							selectedProfessorType?.value === 'professor' 
							? subjects[indexOfKeyInArray(subjects, '_id', selectedSubject.value)].professors.map(professor => ({ value: professor._id, label: `${professor.title || ''} ${professor.name}` }))
							: subjects[indexOfKeyInArray(subjects, '_id', selectedSubject.value)].assistents.map(assistent => ({ value: assistent._id, label: `${assistent.title || ''} ${assistent.name}` }))
						}
						setVal={(e) => setSelectedProfessor(e)}
						value={selectedProfessor}
						required={true}
						isClearable={false}
						placeholder={`Izaberite ${ systemType.value !== 'school' ? 'profesora/asistenta' : 'nastavnika/predavača' }`}
					/>
					
					{
						systemType.value !== 'school' &&
							<>
								<label className="label-primary">Termin</label>
								<div className="flex items-center w-full gap-3 mt-3">
									<div className="flex-col basis-1/2">
										<label htmlFor="from" className="label-primary uppercase text-sm">Od</label>
										<input id="from" type="time" className="input-primary" step="3600" min="00:00" max="23:59" pattern="[0-2][0-9]:[0-5][0-9]" value={startTime} onChange={(elem) => setStartTime(elem.target.value)} />
									</div>	
									<div className="flex-col basis-1/2">
										<label htmlFor="to" className="label-primary uppercase text-sm">Do</label>
										<input id="to" type="time" className="input-primary" step="3600" min="00:00" max="23:59" pattern="[0-2][0-9]:[0-5][0-9]" value={endTime} onChange={(elem) => setEndTime(elem.target.value)}/>
									</div>
								</div>
								<span className="text-xs block text-slate-500 mt-2">*AM = prepodne, PM = poslepodne</span>
								<span className="text-xs block text-slate-500">(08:00PM = 20:00)</span>
							</> 
						// add inherited time here...
            }
            <label htmlFor="location" className="label-primary">Kabinet/sala/učionica</label>
            <input id="location" className="input-primary mb-4" type="text" value={location} onChange={(elem) => setLocation(elem.target.value)} placeholder="Kabinet 1, RC 2, Sala 3..." />
          <button className="w-full btn-primary btn-green mt-5" disabled={selectedProfessor === null}  onClick={handleAddSubject}>
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
      <div className="z-[1056] bg-secondary rounded-md py-8 px-16 flex flex-col justify-between">
        { content }
      </div>
    </div>
    </>
  )
}

export default ScheduleSubjectAdd;