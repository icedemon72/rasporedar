import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { Clock } from 'lucide-react';
import { useGetSubjectsQuery } from '../../app/api/subjectsApiSlice';
import { useGetRoleQuery } from '../../app/api/institutionsApiSlice';
import ScheduleSubjectAdd from '../../components/ScheduleSubjectAdd/ScheduleSubjectAdd';
import clsx from 'clsx';

const SchedulesAdd = () => {
  const session = useSelector(state => state.session);
  const { institution } = useParams();

  const [ title, setTitle ] = useState(''); 
  const [ style, setStyle ] = useState('default');
  const [ validUntil, setValidUntil ] = useState('');
  const [ isSubjectOpen, setIsSubjectOpen ] = useState(false);
  const [ added, setAdded ] = useState(false);
  const [ days, setDays ] = useState(['Ponedeljak', 'Utorak', 'Sreda', 'Četvrtak', 'Petak']);
  let toAssign = days.reduce((days, curr) => (days[curr] = [], days), {});
  
  const [ rows, setRows ] = useState(toAssign);
  const [ indexes, setIndexes ] = useState({ i: null, j: null });
  const [ systemType, setSystemType ] = useState('school');
  
  
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

  const handleSetOpen = (i, j) => {
    setIndexes({ i: i, j: j });
    setIsSubjectOpen(true);
  }  

  const handleAddSubject = (subject, professor) => {
    const { i, j } = indexes;
    if(j < days.length && j >= 0) {
      let tempRows = rows;
      tempRows[Object.keys(rows)[j]][i] = {...tempRows[Object.keys(rows)[j]][i], subject, professor };
      setRows(tempRows);
      setIsSubjectOpen(false);
    }
  }

  const handleAddItem = () => {
    if(rows[Object.keys(rows)[0]].length < 16) {
      let tempRows = rows;
      Object.keys(tempRows).map(key => {
        return tempRows[key] = [...tempRows[key], { }];
      });
      setAdded(prev => !prev);
      setRows(tempRows);
    }
  }

  useEffect(() => {
    document.title = 'Dodaj raspored | Rasporedar';
  }, []);

  let content;

  if(isGetRoleSuccess && isSubjectsSuccess) {
    content = 
    <>
      { isSubjectOpen ? <ScheduleSubjectAdd 
        subjects={subjects}
        closeFunc={() => setIsSubjectOpen(false)} 
        days={days}
        addSubject={handleAddSubject}
        indexes={indexes}
        /> : null }
      <div className="w-full flex justify-center">
        <div className="w-full md:w-1/2 lg:w-1/3">
          <label className="block text-gray-700 text-sm font-bold mb-2">Naslov rasporeda</label>
          <input className="input-field mb-4" placeholder="Unesite naslov..." onChange={(elem) => setTitle(elem.target.value)} />
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
        <div div className="w-full md:w-3/4 lg:w-1/2">
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
                rows[days[0]].map((_, index) => {
                  return (
                    <div className="flex w-full justify-between">
                      <div className="flex w-full justify-center">
                        <div className={clsx(systemType === 'school' ? 'w-1/4' : 'w-full', "text-center")}>
                          { index + 1 }
                        </div>
                        { systemType === 'school' ?
                          <div className="flex justify-center items-center w-3/4">
                            <Clock size={16} />
                          </div> : <></>
                        }
                        
                      </div>
                      {
                        days.map((key, ind) => {
                          return (
                            <>
                            {/* Change onClick here to be edit if it is already set! */}
                              <div className="flex flex-col justify-center w-full items-center" onClick={() => handleSetOpen(index, ind)}>
                                { rows[key][index]?.subject?.name ? 
                                <>
                                  <div className="w-full">{ rows[key][index].subject.name }</div>
                                  { rows[key][index]?.professor?.name ? 
                                    <div className="w-full">{ rows[key][index].professor.name }</div>
                                  : null}
                                </> 
                                : '+' 
                                }
                              </div>
                            </>
                          )
                        })
                      }
                    </div>
                  )
                })
              }
            </div>
            
            <div className="border w-full text-center" onClick={handleAddItem}>+</div>
            
          </div>
        </div>
      </div>
    </>
  } else if (isGetRoleLoading || isSubjectsLoading) {
    content = <>Loading...</>
  }

  return (
    <>
      { content }
    </>
  )
}

export default SchedulesAdd;