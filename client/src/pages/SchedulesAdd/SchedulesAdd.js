import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { useGetSubjectsQuery } from '../../app/api/subjectsApiSlice';
import { useGetByIdQuery, useGetRoleQuery } from '../../app/api/institutionsApiSlice';
import { useAddScheduleMutation, useCheckScheduleMutation, useDeleteScheduleMutation } from '../../app/api/schedulesApiSlice';

import ModalDelete from '../../components/ModalDelete/ModalDelete';
import ScheduleSubjectAdd from '../../components/ScheduleSubjectAdd/ScheduleSubjectAdd';
import ScheduleTimeAdd from '../../components/ScheduleTimeAdd/ScheduleTimeAdd';

import deepClone from 'deep-clone'
import ScheduleScreenOne from '../../components/ScheduleScreenOne/ScheduleScreenOne';
import ScheduleScreenTwo from '../../components/ScheduleScreenTwo/ScheduleScreenTwo';
import CardContainer from '../../components/CardContainer/CardContainer';
import { frequencyTypes, scheduleStyles, scheduleTypes } from '../../models/SelectModels';
import MutationState from '../../components/MutationState/MutationState';


/* TODO: change schedule add logic, also schedule edit label -> value */
const SchedulesAdd = ({ edit = false, ...props }) => {
	const session = useSelector(state => state.session);
  const navigate = useNavigate();
  const { institution } = useParams();

  const [
    fetchAddSchedule,
    {
      data: fetchAddScheduleData,
      isLoading: isFetchAddScheduleLoading,
      isSuccess: isFetchAddScheduleSuccess,
      isError: isFetchAddScheduleError
    }
  ] = useAddScheduleMutation();

  const [ 
    fetchDeleteSchedule,
    {
      data: fetchDeleteScheduleData,
      isLoading: isFetchDeleteScheduleLoading,
      isSuccess: isFetchDeleteScheduleSuccess,
      isError: isFetchDeleteScheduleError
    }
  ] = useDeleteScheduleMutation();

	const [ check, checkState ] = useCheckScheduleMutation();

  /* These could go in a separate component ? */
  const [ title, setTitle ] = useState(props.title || ''); 
  const [ style, setStyle ] = useState(props.style || scheduleStyles[0]);
	const [ frequency, setFrequency ] = useState(props.frequency || frequencyTypes[0]);
	const [ validFrom, setValidFrom ] = useState(props.validFrom || '');
  const [ validUntil, setValidUntil ] = useState(props.validUntil || '');
  const [ systemType, setSystemType ] = useState(props.systemType || scheduleTypes[0]);
  const [ subtitle, setSubtitle ] = useState(props.subtitle || '');
  const [ comment, setComment ] = useState(props.comment || '');
	const [ isTime, setIsTime ] = useState(true);
	const [ isLocation, setIsLocation ] = useState(true);

  const [ step, setStep ] = useState(0);
  const [ isSubjectOpen, setIsSubjectOpen ] = useState(false);
  const [ isTimeOpen, setIsTimeOpen ] = useState(false);
  const [ isDeleteOpen, setIsDeleteOpen ] = useState(false);
  const [ department, setDepartment ] = useState(props.department || '0');
  const [ added, setAdded ] = useState(false);
  const [ groups, setGroups ] = useState(props.groups || ['Grupa 1']);
  const [ days, setDays ] = useState(props.days || ['Ponedeljak', 'Utorak', 'Sreda', 'Četvrtak', 'Petak',]);
  let toAssign;

  if(!props?.rows ) {
    toAssign = groups.map(group => {
      return {
        data: Array(days.length).fill([]),
        defaultTimes: [
          {
            from: '',
            to: ''
          }
        ]
      }
    });
  } 

  const [ rows, setRows ] = useState(deepClone(props.rows) || toAssign);
  const [ indexes, setIndexes ] = useState({ groupIndex: null, i: null, j: null });
  
  const { 
    data: getRole, 
    isLoading: isGetRoleLoading,
    isSuccess: isGetRoleSuccess, 
  } = useGetRoleQuery(institution, { 
    skip: !institution || !session.refreshToken
  });

  const {
    data: institutionData,
    isLoading: isInstitutionLoading,
    isSuccess: isInstitutionSuccess
  } = useGetByIdQuery({ id: institution }, { 
    skip: !institution || !session.refreshToken
  });

  const {
    data: subjects,
    isLoading: isSubjectsLoading,
    isSuccess: isSubjectsSuccess,
    isError: isSubjectsError,
    error: subjectsError
  } = useGetSubjectsQuery({ institution, fullInfo: true }, {
    skip: !getRole
  });


  // opens the modal for adding subjects
  const handleSetOpen = (groupIndex, i, j) => {
    setIndexes(prev => prev = { groupIndex: groupIndex, i: i, j: j });
    setIsSubjectOpen(true);
  }  

  // opens the modal for adding time in college sys type
  const handleSetTimeOpen = (groupIndex, i) => {
    setIndexes({ ...indexes, groupIndex: groupIndex, i: i });
    setIsTimeOpen(true);
  } 

  // this function adds subject, professor etc. to row's data array
  const handleAddSubject = async (subject, lecturer, time, location = null) => {
		const { groupIndex, i, j } = indexes;
		
		let fromTo = (systemType.value !== 'school') 
			? { from: time.startTime, to: time.endTime }
			: { from: rows[groupIndex].defaultTimes[i]?.from || '', to: rows[groupIndex].defaultTimes[i]?.to || '' }
		
		try {
			await check({
				institution,
				body: {
					isTime,
					isLocation,
					location, 
					frequency: frequency.value,
					validFrom, 
					time: { ...fromTo, day: j, lecturer: lecturer._id },
				}
			}).unwrap();

			if(j < days.length && j >= 0) {
				setRows(prev => {
					prev = deepClone(prev);
					prev[groupIndex].data[j][i] = (systemType.value !== 'school') ?
					{ ...prev[groupIndex].data[j][i], subject, lecturer, from: time.startTime, to: time.endTime, location } 
						: { ...prev[groupIndex].data[j][i], subject, lecturer, location };
					
					return prev;
				});     
	
				setIsSubjectOpen(false);
			}

		} catch (err) { 
			console.log(err)
		} 

  }

  const handleDeleteSubject = () => {
    const { groupIndex, i, j } = indexes;
    if(j < days.length && j >= 0) {
      setRows(prev => {
        prev[groupIndex].data[j][i] = {};
        return prev;
      });
    }

    setIsSubjectOpen(false);
  }

  // this function adds an empty object (an item) to rows state
  const handleAddItem = (group) => {
    const rowsObj = rows[group].data;
    if(rowsObj && rowsObj[0].length < 16) {
      days.forEach((_, index) => {
        rowsObj[index] = [ ...rowsObj[index], {} ];
      });
      let tempRows = rows;
      tempRows[group].data = rowsObj;
      tempRows[group].defaultTimes = [ ...tempRows[group].defaultTimes, { from: '', to: '' } ];
      setAdded(prev => !prev);
      setRows(tempRows);
    }
  }

	const handleDeleteItem = (group, index = -1) => {
		const rowsObj = rows[group].data;

		if(rowsObj.length && index < rowsObj[0].length && rowsObj[0].length !== 1) {
			if(index === -1) {
				days.forEach((_, ind) => {
					rowsObj[ind].pop();
				});
			}
			else  {
				days.forEach((_, ind) => {
					rowsObj[ind].splice(index, 1);
				});
			}

			let tempRows = [ ...rows ];
				tempRows[group].data = rowsObj;
				setAdded(prev => !prev);
				setRows(tempRows);
		}
	}

  // this function adds time to the whole row (used in school system types)
  const handleAddTime = (startTime, endTime) => {
    if(systemType.value === 'school') {
      setRows(prev => {
        prev[indexes.groupIndex].defaultTimes[indexes.i].from = startTime;
        prev[indexes.groupIndex].defaultTimes[indexes.i].to = endTime;
         
        return prev;
      });

      setIsTimeOpen(false);
    }
  }

  const handleSaveSchedule = async (edit = false, published = false) => {
    try {
      let tempRows = deepClone(rows);
      
      for(let i = 0; i < tempRows.length; i++) {
        for(let j = 0; j < days.length; j++) {
          for(let k = 0; k < tempRows[i].data[j].length; k++) {
            let item = tempRows[i].data[j][k];
            if(item.subject) {
              tempRows[i].data[j][k] = {
                ...item,
                subject: item.subject._id
              }

              if(item.lecturer) {
                tempRows[i].data[j][k] = {
                  ...tempRows[i].data[j][k],
                  lecturer: item.lecturer._id
                }
              }
              
            }
          }
        }
      }
      
      const body = {
        title, days, style: style.value, validUntil, 
        systemType: systemType.value, subtitle, comment,
        department: department.value, groups, data: tempRows,
        published, validFrom, frequency: frequency.value
      }

      // TODO: add edit 
      const result = !edit ? 
        await props.editSchedule({ institution, body, schedule: props._id  }).unwrap()
        : await fetchAddSchedule({ institution, body }).unwrap();

      setTimeout(() => {
        navigate(`/institutions/${institution}/schedules/${result._id}/edit`);
      }, 1000);

    } catch (err) {
      console.log(err);
    }
  }

  const handleDeleteGroup = (index) => {
    if(index < groups.length) {
      let tempRows = deepClone(rows), tempGroups = deepClone(groups);
      tempRows.splice(index, 1);
      tempGroups.splice(index, 1);
      setRows(tempRows);
      setGroups(tempGroups);
      setAdded(prev => !prev);
    }
  }

  const handleDeleteSchedule = async () => {
    if(!edit) {
      // change this...
      window.location.reload();
    } else {
      try {
        await fetchDeleteSchedule({ institution, schedule: props._id }).unwrap();
				navigate(`/institutions/${institution}/schedules`)
      } catch (err) {
        console.log(err);
      }
    }
  }

  useEffect(() => {
    if(!props?.rows) {
      document.title = 'Dodaj raspored | Rasporedar';
    }
  }, []);

  useEffect(() => {
    groups.forEach((group, index) => {
      if(rows.length <= index) {
        setRows(prev => [ ...prev, {
          data: Array(days.length).fill([]),
          defaultTimes: [
            {
              from: '',
              to: ''
            }
          ]
        }]);
      }       
    });
  }, [ groups ]);
  
  useEffect(() => {
		rows.forEach((row, index) => {
      if(!row.data[0].length) {
        handleAddItem(index);
      }
    });
  }, [ rows.length ]);

  let content;
  if(isGetRoleSuccess && isSubjectsSuccess) {

    const firstProps = {
      setTitle,
      title,
      setSubtitle,
      subtitle,
      setComment,
      comment,
      setDepartment,
      department,
      isInstitutionLoading,
      isInstitutionSuccess,
      institutionData,
      setStyle,
      style,
      systemType,
      setSystemType,
			setValidFrom,
			frequency,
			setFrequency,
			validFrom,
      setValidUntil,
      validUntil,
      setGroups,
      groups,
      handleDeleteGroup,
      edit,
			rows
    }

    content = 
    <>
      { step === 0 ? 
        <>
          <CardContainer large={true}>
						<ScheduleScreenOne 
							{...firstProps} edit={edit}
						/>
						<div className="w-full flex justify-end">
							<button className="btn-primary  btn-green w-full md:w-1/2 lg:w-1/3" onClick={() => setStep(prev => prev + 1)}>Dalje</button>
						</div>
          </CardContainer>
        </>
      : <>
          <div className="w-full flex justify-center">
            <div div className="w-full md:w-4/5 lg:w-3/4"> {/* maybe change this */}
              <ScheduleScreenTwo 
                days={days} rows={rows} groups={groups}
                handleSetTimeOpen={handleSetTimeOpen} handleSetOpen={handleSetOpen}
                systemType={systemType} handleAddItem={handleAddItem} edit={true} handleDeleteItem={handleDeleteItem}
								style={style}
						 />
            </div>
          </div>
          
          <div className="w-full flex justify-center py-5">
            <div className="w-full md:w-4/5 lg:w-3/4 grid grid-cols-4 gap-2 p-2 rounded-md box-shadow border-2 border-black bg-secondary">
              <button className="col-span-4 md:col-span-2 lg:col-span-1 btn-red w-full max-w-[350px] btn-primary" onClick={() => setStep(prev => prev - 1)}>Nazad</button>
              <button className="col-span-4 md:col-span-2 lg:col-span-1 btn-red w-full max-w-[350px] btn-primary" onClick={() => setIsDeleteOpen(true)}>Obriši raspored</button>
              <button className="col-span-4 md:col-span-2 lg:col-span-1 btn-green w-full max-w-[350px] btn-primary" disabled={ isFetchAddScheduleLoading || isFetchAddScheduleLoading } onClick={() => handleSaveSchedule(!edit)}>Sačuvaj raspored!</button>
              {
								!edit || !props.published
								?
								<button className="col-span-4 md:col-span-2 lg:col-span-1 btn-green w-full max-w-[350px] btn-primary" disabled={ isFetchAddScheduleLoading || isFetchAddScheduleLoading } onClick={() => handleSaveSchedule(!edit, true)}>Sačuvaj i objavi raspored!</button>
								:
								<button className="col-span-4 md:col-span-2 lg:col-span-1 btn-green w-full max-w-[350px] btn-primary" disabled={ isFetchAddScheduleLoading || isFetchAddScheduleLoading } onClick={() => handleSaveSchedule(!edit, false)}>Označi kao neobjavljen</button>
							}
            </div>
          </div>
        </>
      }

    </>
  }
	 
  return (
    <>
			<MutationState 
				isLoading={isGetRoleLoading || isInstitutionLoading || isSubjectsLoading || isFetchAddScheduleLoading || isFetchDeleteScheduleLoading}
				isSuccess={isFetchAddScheduleSuccess}
				successMessage='Uspešno kreiran raspored!'
			/>
			<MutationState 
				isSuccess={isFetchDeleteScheduleSuccess}
				isError={checkState.isError}
				error={checkState.error}
				successMessage='Uspešno obrisan raspored'
			/>
			
      { isSubjectOpen ? 
        <ScheduleSubjectAdd 
          subjects={subjects}
          closeFunc={() => setIsSubjectOpen(false)} 
          days={days}
          addSubject={handleAddSubject}
          indexes={indexes}
          systemType={systemType}
          handleDeleteSubject={handleDeleteSubject}
          data={rows[indexes.groupIndex].data[indexes.j][indexes.i]}
					isTime={isTime}
					setIsTime={setIsTime}
					isLocation={isLocation}
					setIsLocation={setIsLocation}
        /> 
        : null }
      
      { isTimeOpen ? 
        <ScheduleTimeAdd 
          indexes={indexes} 
          submitFunc={handleAddTime}
          closeFunc={() => setIsTimeOpen(false)}
        /> 
      : null}

      { isDeleteOpen ? 
        <ModalDelete title={'Brisanje rasporeda'} text={`Obrisacete raspored i sve informacije u njemu. Da li ste sigurni?`} closeFunc={() => setIsDeleteOpen(false)}>
          <button className="btn-primary bg-primary" onClick={() => setIsDeleteOpen(false)}>Odustani</button>
          <button className="btn-primary btn-red" onClick={handleDeleteSchedule}>Potvrdi</button>
        </ModalDelete> 
        : null 
      }

      { content }
    </>
  )
}

export default SchedulesAdd;