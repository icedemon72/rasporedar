import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { Clock, Trash } from 'lucide-react';
import { useGetSubjectsQuery } from '../../app/api/subjectsApiSlice';
import { useGetRoleQuery } from '../../app/api/institutionsApiSlice';
import ModalDelete from '../../components/ModalDelete/ModalDelete';
import ScheduleSubjectAdd from '../../components/ScheduleSubjectAdd/ScheduleSubjectAdd';
import ScheduleTimeAdd from '../../components/ScheduleTimeAdd/ScheduleTimeAdd';
import clsx from 'clsx';

const SchedulesAdd = () => {
  const session = useSelector(state => state.session);
  const { institution } = useParams();

  /* These could go in a separate component ? */
  const [ title, setTitle ] = useState(''); 
  const [ style, setStyle ] = useState('default');
  const [ validUntil, setValidUntil ] = useState('');
  const [ systemType, setSystemType ] = useState('school');
  const [ subtitle, setSubtitle ] = useState('');
  const [ comment, setComment ] = useState('');

  const [ isSubjectOpen, setIsSubjectOpen ] = useState(false);
  const [ isTimeOpen, setIsTimeOpen ] = useState(false);
  const [ isDeleteOpen, setIsDeleteOpen ] = useState(false);
  const [ added, setAdded ] = useState(false);
  const [ groups, setGroups ] = useState(['Grupa 1']);
  const [ days, setDays ] = useState(['Ponedeljak', 'Utorak', 'Sreda', 'Četvrtak', 'Petak']);
  
  let toAssign = { 
    ...groups.reduce((group, curr) => (group[curr] = {...days.reduce((days, curr) => (days[curr] = [], days), {})}, group), {})
  }
  
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
    data: subjects,
    isLoading: isSubjectsLoading,
    isSuccess: isSubjectsSuccess,
    isError: isSubjectsError,
    error: subjectsError
  } = useGetSubjectsQuery(({ institution: institution, fullInfo: true }), {
    skip: !getRole
  });

  const handleSetOpen = (groupIndex, i, j) => {
    setIndexes({ groupIndex: groupIndex, i: i, j: j });
    setIsSubjectOpen(true);
  }  

  const handleSetTimeOpen = (groupIndex, i) => {
    setIndexes({ ...indexes, groupIndex: groupIndex, i: i });
    setIsTimeOpen(true);
  } 

  const handleAddSubject = (subject, lecturer, time, location = null) => {
    const { groupIndex, i, j } = indexes;
    if(j < days.length && j >= 0) {
      const group = groups[groupIndex];
      const day = days[j];
      let tempRows = { ...rows };
      let rowsObj = tempRows[group];
      
      rowsObj[day][i] = (systemType !== 'school') ?
        { ...rowsObj[day][i], subject, lecturer, from: time.startTime, to: time.endTime, location } 
          : { ...rowsObj[day][i], subject, lecturer, location };
      
      tempRows[group] = rowsObj;
      setRows(tempRows);
      setIsSubjectOpen(false);
    }
  }

  const handleAddItem = (group) => {
    const rowsObj = rows[group];
    if(rowsObj && rowsObj[Object.keys(rowsObj)[0]].length < 16) {
      Object.keys(rowsObj).map(key => {
        return rowsObj[key] = [...rowsObj[key], { }];
      });

      let tempRows = { ...rows };
      tempRows[group] = rowsObj;
      setAdded(prev => !prev);
      setRows(tempRows);
    }
  }

  const handleAddTime = (startTime, endTime) => {
    if(systemType === 'school') {
      const group = groups[indexes.groupIndex];
      let tempRows = { ...rows };
      let rowsObj = tempRows[group];
      Object.keys(tempRows[group]).forEach(key => {
        rowsObj[key][indexes.i] = { ...rowsObj[key][indexes.i], from: startTime, to: endTime };
      });
      tempRows[group] = rowsObj;
      console.log(tempRows);
      setRows(tempRows);
      setIsTimeOpen(false);
    }
  }

  const handleSaveSchedule = async () => {
    try {

    } catch (err) {

    }
  }

  const handleDeleteSchedule = () => {
    window.location.reload();
  }

  useEffect(() => {
    document.title = 'Dodaj raspored | Rasporedar';
  }, []);

  let content;

  if(isGetRoleSuccess && isSubjectsSuccess) {
    content = 
    <>
      <div className="w-full flex justify-center">
        <div className="w-full md:w-1/2 lg:w-1/3">
          <label className="block text-gray-700 text-sm font-bold mb-2">Naslov rasporeda</label>
          <input className="input-field mb-4" placeholder="Unesite naslov..." onChange={(elem) => setTitle(elem.target.value)} />
          <label className="block text-gray-700 text-sm font-bold mb-2">Podnaslov rasporeda</label>
          <input className="input-field mb-4" placeholder="Unesite podnaslov..." onChange={(elem) => setSubtitle(elem.target.value)} />
          <label className="block text-gray-700 text-sm font-bold mb-2">Komentar nakon rasporeda</label>
          <input className="input-field mb-4" placeholder="Unesite komentar..." onChange={(elem) => setComment(elem.target.value)} />
          <label className="block text-gray-700 text-sm font-bold mb-2">Stil rasporeda</label>
          <select className="input-field mb-4" onChange={(elem) => setStyle(elem.target.value)}>
            <option value="default">Podrazumevni stil</option>
            <option value="ice">Hladni stil</option>
          </select>
          <label className="block text-gray-700 text-sm font-bold mb-2">Tip rasporeda </label>
          <select className="input-field mb-4" onChange={(elem) => setSystemType(elem.target.value)}>
            <option value="school">Skolski</option>
            <option value="college">Fakultetski</option>
          </select>
          <label className="block text-gray-700 text-sm font-bold mb-2">Vazi do: </label>
          <input className="input-field" type="date" onChange={(elem) => setValidUntil(elem.target.value)} />
          <label className="block text-xs font-bold mb-4 text-gray-500">*Ostavite prazno ukoliko ne zelite da naznacite</label>
        </div>
      </div>

      <div className="w-full flex justify-center">
        <div div className="w-full md:w-4/5 lg:w-3/4"> {/* maybe change this */}
          <div className="w-full mt-5">
            <div className="w-full flex justify-between">
              <div className="border w-full flex justify-center items-center gap-2">
              <Clock size={16} /> Termin
              </div>
              {
                days.map(day => {
                  return (
                    <>
                      <div className="border w-full text-center">{ day }</div>
                    </>
                  )
                })
              }
            </div>
                        
            <div className="w-full border">
              {
                groups.map((group, groupIndex) => {
                  return (
                    <>
                      {
                        rows[group][days[0]].map((_, index) => {
                          return (
                            <>
                              { index === 0 && groups.length !== 1 ? <div className="w-full text-center">{ group }</div> : null }
                              <div className="flex w-full justify-between border-b-4">
                                <div className="flex w-full justify-center items-center min-h-[100px] border-r-2">
                                  <div className={clsx(systemType === 'school' ? 'w-1/4' : 'w-full', "text-center")}>
                                    { index + 1 }
                                  </div>
                                  { systemType === 'school' ?
                                    <div className="flex justify-center items-center w-3/4" onClick={() => handleSetTimeOpen(groupIndex, index)}>
                                      { console.log('hey', rows[group])}
                                      { rows[group][days[0]][index]?.from ? 
                                      <>
                                        { rows[group][days[0]][index].from  } - { rows[group][days[0]][index].to  }
                                      </> : <Clock size={16}/>}
                                    </div> : <></>
                                  }
                                  
                                </div>
                                {
                                  days.map((key, ind) => {
                                    return (
                                      <>
                                      {/* Change onClick here to be edit if it is already set! */}
                                        <div className="flex flex-col justify-center w-full items-center cursor-pointer hover:bg-slate-200" onClick={() => handleSetOpen(groupIndex, index, ind)}>
                                          { rows[group][key][index]?.subject?.name ? 
                                          <>
                                            <div className="w-full flex flex-col justify-center text-center border-b-2 font-bold">
                                              { rows[group][key][index].subject.name }
                                              { systemType !== 'school' ? 
                                                <div className="block">
                                                  ({ rows[group][key][index]?.from } - { rows[group][key][index]?.to })
                                                </div> : null }
                                            </div>
                                            { rows[group][key][index]?.lecturer?.name ? 
                                              <div className="w-full flex justify-center text-sm">{ rows[group][key][index].lecturer.name }</div>
                                            : null}
                                            {
                                              rows[group][key][index]?.location ? 
                                              <div className="text-xs block">{rows[group][key][index].location}</div> : null
                                            }
                                          </> 
                                          : '+' 
                                          }
                                        </div>
                                        
                                      </>
                                    )
                                  })
                                }
                                <div className="hidden md:block relative left-3 lg:left-4 basis-0 w-0"><Trash className="w-20 cursor-pointer hover:bg-gray-200" /></div>
                              </div>
                              {/* { index + 1 === rows[group][days[0]].length ?  : null } */}
                              
                            </>
                          )
                        })
                      }
                      <div className="border w-full text-center" onClick={() => handleAddItem(group)}>+</div>
                    </> 
                  )
                })
              }
            </div>
          </div>
        </div>
      </div>

      <div className="w-full flex justify-center mt-5">
        <div className="w-full md:w-1/3 lg:w-1/4 flex justify-between gap-7">
          <button className="btn-red w-full md:w-1/2 lg:w-1/3" onClick={() => setIsDeleteOpen(true)}>Obriši raspored</button>
          <button className="btn-green w-full md:w-1/2 lg:w-1/3" onClick={handleSaveSchedule}>Sačuvaj raspored!</button>
        </div>
      </div>
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