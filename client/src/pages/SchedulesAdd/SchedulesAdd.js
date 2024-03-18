import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { useGetSubjectsQuery } from '../../app/api/subjectsApiSlice';
import { useGetByIdQuery, useGetRoleQuery } from '../../app/api/institutionsApiSlice';
import { useAddScheduleMutation, useEditScheduleMutation } from '../../app/api/schedulesApiSlice';

import ModalDelete from '../../components/ModalDelete/ModalDelete';
import ScheduleSubjectAdd from '../../components/ScheduleSubjectAdd/ScheduleSubjectAdd';
import ScheduleTimeAdd from '../../components/ScheduleTimeAdd/ScheduleTimeAdd';

import deepClone from 'deep-clone'
import ScheduleScreenOne from '../../components/ScheduleScreenOne/ScheduleScreenOne';
import ScheduleScreenTwo from '../../components/ScheduleScreenTwo/ScheduleScreenTwo';

const SchedulesAdd = ({ edit = false, ...props }) => {
  const session = useSelector(state => state.session);
  const navigate = useNavigate();
  const { institution } = useParams();

  const [
    fetchEditSchedule,
    {
      data: fetchEditScheduleData,
      isLoading: isFetchEditScheduleLoading,
      isSuccess: isFetchEditScheduleSuccess,
      isError: isFetchEditScheduleError
    }
  ] = useEditScheduleMutation();

  const [
    fetchAddSchedule,
    {
      data: fetchAddScheduleData,
      isLoading: isFetchAddScheduleLoading,
      isSuccess: isFetchAddScheduleSuccess,
      isError: isFetchAddScheduleError
    }
  ] = useAddScheduleMutation();

  /* These could go in a separate component ? */
  const [ title, setTitle ] = useState(props.title || ''); 
  const [ style, setStyle ] = useState(props.style || 'default');
  const [ validUntil, setValidUntil ] = useState(props.validUntil || '');
  const [ systemType, setSystemType ] = useState(props.systemType || 'school');
  const [ subtitle, setSubtitle ] = useState(props.subtitle || '');
  const [ comment, setComment ] = useState(props.comment || '');

  const [ step, setStep ] = useState(0);
  const [ isSubjectOpen, setIsSubjectOpen ] = useState(false);
  const [ isTimeOpen, setIsTimeOpen ] = useState(false);
  const [ isDeleteOpen, setIsDeleteOpen ] = useState(false);
  const [ department, setDepartment ] = useState(props.department || '0');
  const [ added, setAdded ] = useState(false);
  const [ groups, setGroups ] = useState([...props.groups] || ['Grupa 1']);
  const [ days, setDays ] = useState([...props.days] || ['Ponedeljak', 'Utorak', 'Sreda', 'Četvrtak', 'Petak']);
  let toAssign;

  if(!props?.rows) {
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
    skip: !institution || !session.accessToken
  });

  const {
    data: institutionData,
    isLoading: isInstitutionLoading,
    isSuccess: isInstitutionSuccess
  } = useGetByIdQuery({ id: institution }, { 
    skip: !institution || !session.accessToken
  });

  const {
    data: subjects,
    isLoading: isSubjectsLoading,
    isSuccess: isSubjectsSuccess,
    isError: isSubjectsError,
    error: subjectsError
  } = useGetSubjectsQuery(({ institution: institution, fullInfo: true }), {
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
  const handleAddSubject = (subject, lecturer, time, location = null) => {
    const { groupIndex, i, j } = indexes;
    if(j < days.length && j >= 0) {
      setRows(prev => {
        prev[groupIndex].data[j][i] = (systemType !== 'school') ?
        { ...prev[groupIndex].data[j][i], subject, lecturer, from: time.startTime, to: time.endTime, location } 
          : { ...prev[groupIndex].data[j][i], subject, lecturer, location };
        
        return prev;
      });

      setIsSubjectOpen(false);
    }
  }

  // this function adds an empty object (an item) to rows state
  const handleAddItem = (group) => {
    const rowsObj = rows[group].data;
    if(rowsObj && rowsObj[0].length < 16) {
      days.forEach((_, index) => {
        rowsObj[index] = [ ...rowsObj[index], {} ];
      });
      let tempRows = [ ...rows ];
      tempRows[group].data = rowsObj;
      tempRows[group].defaultTimes = [ ...tempRows[group].defaultTimes, { from: '', to: '' } ];
      setAdded(prev => !prev);
      setRows(tempRows);
    }
  }

  // this function adds time to the whole row (used in school system types)
  const handleAddTime = (startTime, endTime) => {
    if(systemType === 'school') {
      setRows(prev => {
        prev[indexes.groupIndex].defaultTimes[indexes.i].from = startTime;
        prev[indexes.groupIndex].defaultTimes[indexes.i].to = endTime;
         
        return prev;
      });

      setIsTimeOpen(false);
    }
  }

  const handleSaveSchedule = async (edit = false) => {
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
        title, days, style, validUntil, 
        systemType, subtitle, comment,
        department, groups, data: tempRows
      }

      // TODO: add edit 
      const result = !edit ? 
        await fetchEditSchedule({ institution, body, schedule: props._id  }).unwrap() 
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
      let tempRows = rows, tempGroups = groups;
      tempRows.splice(index, 1);
      tempGroups.splice(index, 1);
      setRows(tempRows);
      setGroups(tempGroups);
      setAdded(prev => !prev);
    }
  }

  // FIXME:
  const handleDeleteSchedule = () => {
    window.location.reload();
  }

  useEffect(() => {
    document.title = 'Dodaj raspored | Rasporedar';
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
      setValidUntil,
      validUntil,
      setGroups,
      groups,
      handleDeleteGroup,
      edit
    }

    content = 
    <>
      { step === 0 ? 
        <>
          <div className="w-full flex justify-center">
            <div className="w-full md:w-1/2 lg:w-1/3">
              <ScheduleScreenOne 
                {...firstProps}
              />
            </div>
          </div>
          <div className="w-full flex justify-end">
            <div className="w-full md:w-1/3 lg:w-1/4 gap-7">
              <button className="btn-green w-full md:w-1/2 lg:w-1/3" onClick={() => setStep(prev => prev + 1)}>Dalje</button>
            </div>
          </div>
        </>
      : <>
          <div className="w-full flex justify-center">
            <div div className="w-full md:w-4/5 lg:w-3/4"> {/* maybe change this */}
              <ScheduleScreenTwo 
                days={days} rows={rows} groups={groups}
                handleSetTimeOpen={handleSetTimeOpen} handleSetOpen={handleSetOpen}
                systemType={systemType} handleAddItem={handleAddItem} edit={true}
              />
            </div>
          </div>
          
          <div className="w-full flex justify-center my-5">
            <div className="w-full md:w-1/3 lg:w-1/4 flex justify-between gap-7">
              <button className="btn-red w-full md:w-1/2 lg:w-1/3" onClick={() => setStep(prev => prev - 1)}>Nazad</button>
              <button className="btn-red w-full md:w-1/2 lg:w-1/3" onClick={() => setIsDeleteOpen(true)}>Obriši raspored</button>
              <button className="btn-green w-full md:w-1/2 lg:w-1/3" disabled={ isFetchAddScheduleLoading || isFetchAddScheduleLoading } onClick={() => edit ? handleSaveSchedule() : handleSaveSchedule(true)}>Sačuvaj raspored!</button>
            </div>
          </div>
        </>
      }
      

    </>
  } else if (isGetRoleLoading || isSubjectsLoading) {
    content = <>Loading...</>
  }

  return (
    <>
      { isSubjectOpen ? 
      <ScheduleSubjectAdd 
        subjects={subjects}
        closeFunc={() => setIsSubjectOpen(false)} 
        days={days}
        addSubject={handleAddSubject}
        indexes={indexes}
        systemType={systemType}
        data={rows[indexes.groupIndex].data[indexes.j][indexes.i]}
      /> : null }
      
      { isTimeOpen ? 
        <ScheduleTimeAdd 
          indexes={indexes} 
          submitFunc={handleAddTime}
          closeFunc={() => setIsTimeOpen(false)}
        /> 
      : null}

      { isDeleteOpen ? 
        <ModalDelete title={'Brisanje rasporeda'} text={`Obrisacete raspored i sve informacije u njemu. Da li ste sigurni?`} closeFunc={() => setIsDeleteOpen(false)}>
          <button className="bg-gray-300 hover:bg-gray-500 p-2 rounded" onClick={() => setIsDeleteOpen(false)}>Odustani</button>
          <button className="bg-red-300 hover:bg-red-500 p-2 rounded" onClick={handleDeleteSchedule}>Potvrdi</button>
        </ModalDelete> 
        : null 
      }

      { content }
    </>
  )
}

export default SchedulesAdd;