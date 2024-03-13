import { Clock, Trash } from 'lucide-react';
import clsx from 'clsx';
import ScheduleRow from './ScheduleRow';
import ScheduleItem from './ScheduleItem';
/* change this to be editable and stuff */

const Schedule = ({
  editable = false, ...props
}) => {

  return (
    <>
      <div className="w-full flex justify-between">
        <div className="border w-full flex justify-center items-center gap-2">
          <Clock size={16} /> Termin
        </div>
        {
          props.days.map(day => {
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
          props.rows.map((item, groupIndex) => {
            return (
              
              <>
              
                {
                  item.data[0].map((_, index) => {
                    return (
                      <>
                        { index === 0 && props.groups.length !== 1 ? <div className="w-full text-center">{ item.group }</div> : null }
                        
                        <ScheduleRow 
                          systemType={props.systemType}
                          handleSetTimeOpen
                        />
                        <div className="flex w-full justify-between border-b-4">
                          <div className="flex w-full justify-center items-center min-h-[100px] border-r-2">
                            <div className={clsx(props.systemType === 'school' ? 'w-1/4' : 'w-full', "text-center")}>
                              { index + 1 }
                            </div>
                            { props.systemType === 'school' ?
                              <div className="flex justify-center items-center w-3/4" onClick={() => props.handleSetTimeOpen(groupIndex, index)}>
                                { item.defaultTimes[index]?.from ? 
                                <>
                                  { item.defaultTimes[index].from  } - { item.defaultTimes[index].to  }
                                </> : <Clock size={16}/>}
                              </div> : null
                            }
                            
                          </div>
                          {
                            props.days.map((_, ind) => {
                              return (
                                <ScheduleItem
                                  item={item.data[index][ind]} 
                                  editable={editable}
                                  systemType={props.systemType}
                                  groupIndex={groupIndex}
                                  index={index}
                                  ind={ind}
                                  handleSetOpen={props.handleSetOpen}
                                />
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
                <div className="border w-full text-center" onClick={() => props.handleAddItem(groupIndex)}>+</div>
              </> 
            )
          })
        }
      </div>
    </>
  )
}

export default Schedule;