import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { Clock, Trash } from 'lucide-react';
import { useGetSubjectsQuery } from '../../app/api/subjectsApiSlice';
import { useGetByIdQuery, useGetRoleQuery } from '../../app/api/institutionsApiSlice';
import { useAddScheduleMutation } from '../../app/api/schedulesApiSlice';

import ModalDelete from '../../components/ModalDelete/ModalDelete';
import ScheduleSubjectAdd from '../../components/ScheduleSubjectAdd/ScheduleSubjectAdd';
import ScheduleTimeAdd from '../../components/ScheduleTimeAdd/ScheduleTimeAdd';
import clsx from 'clsx';

import deepClone from 'deep-clone'
import ScheduleScreenOne from '../../components/ScheduleScreenOne/ScheduleScreenOne';
import ScheduleScreenTwo from '../../components/ScheduleScreenTwo/ScheduleScreenTwo';

const SchedulesAdd = () => {
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

  /* These could go in a separate component ? */
  const [ title, setTitle ] = useState(''); 
  const [ style, setStyle ] = useState('default');
  const [ validUntil, setValidUntil ] = useState('');
  const [ systemType, setSystemType ] = useState('school');
  const [ subtitle, setSubtitle ] = useState('');
  const [ comment, setComment ] = useState('');

  const [ step, setStep ] = useState(0);
  const [ isSubjectOpen, setIsSubjectOpen ] = useState(false);
  const [ isTimeOpen, setIsTimeOpen ] = useState(false);
  const [ isDeleteOpen, setIsDeleteOpen ] = useState(false);
  const [ department, setDepartment ] = useState('0');
  const [ added, setAdded ] = useState(false);
  const [ groups, setGroups ] = useState(['Grupa 1', 'Grupa 2']);
  const [ days, setDays ] = useState(['Ponedeljak', 'Utorak', 'Sreda', 'Četvrtak', 'Petak']);
  
  // ...groups.reduce((group, curr) => (group[curr] = {...days.reduce((days, curr) => (days[curr] = [], days), {})}, group), {})
  let toAssign = groups.map(group => {
    return {
      group,
      data: Array(days.length).fill([]),
      defaultTimes: [
        {
          from: '',
          to: ''
        }
      ]
    }
  });

  const [ rows, setRows ] = useState(toAssign);
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


  const handleSetOpen = (groupIndex, i, j) => {
    setIndexes(prev => prev = { groupIndex: groupIndex, i: i, j: j });
    setIsSubjectOpen(true);
  }  

  const handleSetTimeOpen = (groupIndex, i) => {
    setIndexes({ ...indexes, groupIndex: groupIndex, i: i });
    setIsTimeOpen(true);
  } 

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

  const handleSaveSchedule = async () => {
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
        department, data: tempRows
      }

      const result = await fetchAddSchedule({ institution, body }).unwrap();
      
    } catch (err) {
      console.log(err);
    }
  }

  const handleDeleteSchedule = () => {
    window.location.reload();
  }

  useEffect(() => {
    document.title = 'Dodaj raspored | Rasporedar';
  }, []);

  useEffect(() => {
    groups.forEach((_, index) => {
      if(!rows[index].data[0].length) {
        handleAddItem(index);
      }
    });
  }, [ groups ]);
  
  let content;
  if(isGetRoleSuccess && isSubjectsSuccess) {
    content = 
    <>
      { step === 0 ? 
        <>
          <div className="w-full flex justify-center">
            <div className="w-full md:w-1/2 lg:w-1/3">
              <ScheduleScreenOne 
                setTitle setSubtitle={setSubtitle}
                setComment={setComment} setDepartment={setDepartment}
                isInstitutionLoading={isInstitutionLoading} isInstitutionSuccess={isInstitutionSuccess}
                institutionData={institutionData} setStyle={setStyle} systemType={systemType} 
                setSystemType={setSystemType} setValidUntil={setValidUntil}
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
                systemType={systemType} handleAddItem={handleAddItem}
              />
            </div>
          </div>
          
          <div className="w-full flex justify-center my-5">
            <div className="w-full md:w-1/3 lg:w-1/4 flex justify-between gap-7">
              <button className="btn-red w-full md:w-1/2 lg:w-1/3" onClick={() => setStep(prev => prev - 1)}>Nazad</button>
              <button className="btn-red w-full md:w-1/2 lg:w-1/3" onClick={() => setIsDeleteOpen(true)}>Obriši raspored</button>
              <button className="btn-green w-full md:w-1/2 lg:w-1/3" onClick={handleSaveSchedule}>Sačuvaj raspored!</button>
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