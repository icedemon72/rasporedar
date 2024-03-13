import { Clock, Trash } from 'lucide-react';
import clsx from 'clsx';
const ScheduleScreenTwo = ({
  days, rows, groups, handleSetTimeOpen, handleSetOpen, systemType, handleAddItem
}) => {
  

  return (
    <>
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
            rows.map((item, groupIndex) => {
              return (
                <>
                  {
                    item.data[0].map((_, index) => {
                      return (
                        <>
                          { index === 0 && groups.length !== 1 ? <div className="w-full text-center">{ item.group }</div> : null }
                          <div className="flex w-full justify-between border-b-4">
                            <div className="flex w-full justify-center items-center min-h-[100px] border-r-2">
                              <div className={clsx(systemType === 'school' ? 'w-1/4' : 'w-full', "text-center")}>
                                { index + 1 }
                              </div>
                              { systemType === 'school' ?
                                <div className="flex justify-center items-center w-3/4" onClick={() => handleSetTimeOpen(groupIndex, index)}>
                                  { item.defaultTimes[index]?.from ? 
                                  <>
                                    { item.defaultTimes[index].from  } - { item.defaultTimes[index].to  }
                                  </> : <Clock size={16}/>}
                                </div> : null
                              }
                              
                            </div>
                            {
                              days.map((_, ind) => {
                                return (
                                  <>
                                  {/* Change onClick here to be edit if it is already set! */}
                                    <div className="flex flex-col justify-center w-full items-center cursor-pointer hover:bg-slate-200" onClick={() => handleSetOpen(groupIndex, index, ind)}>
                                      { item.data[ind][index]?.subject?.name ? 
                                      <>
                                        <div className="w-full flex flex-col justify-center text-center border-b-2 font-bold">
                                          { item.data[ind][index].subject.name }
                                          { systemType !== 'school' ? 
                                            <div className="block">
                                              ({item.data[ind][index]?.from } - { item.data[ind][index]?.to })
                                            </div> : null }
                                        </div>
                                        { item.data[ind][index]?.lecturer?.name ? 
                                          <div className="w-full flex justify-center text-sm">{ item.data[ind][index].lecturer.name }</div>
                                        : null}
                                        {
                                          item.data[ind][index]?.location ? 
                                          <div className="text-xs block">{item.data[ind][index].location}</div> : null
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
                  <div className="border w-full text-center" onClick={() => handleAddItem(groupIndex)}>+</div>
                </> 
              )
            })
          }
        </div>
      </div>
    </>
  )
}

export default ScheduleScreenTwo;