import React from 'react';
import { Clock, Trash } from 'lucide-react';
import clsx from 'clsx';
import ScheduleItem from './ScheduleItem';

const ScheduleRow = ({ editable, groupIndex, item, index, ...props }) => {
  return (
    <div className="flex w-full justify-between border-b-4">
      <div className="flex w-full justify-center items-center min-h-[100px] border-r-2">
        <div className={clsx(props.systemType === 'school' ? 'w-1/4' : 'w-full', "text-center")}>
          { index + 1 }
        </div>
        { props.systemType === 'school' ?
          <div className="flex justify-center items-center w-3/4" onClick={editable ? () => props.handleSetTimeOpen(groupIndex, index) : undefined} >
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
              item={item.data[ind][index]} 
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
      {editable ? <div className="hidden md:block relative left-3 lg:left-4 basis-0 w-0"><Trash className="w-20 cursor-pointer hover:bg-gray-200" /></div> : null}
      
    </div>
  )
}

export default ScheduleRow;