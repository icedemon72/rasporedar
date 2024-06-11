import React from 'react';
import { Clock, Trash } from 'lucide-react';
import clsx from 'clsx';
import ScheduleItem from './ScheduleItem';
import { Tooltip } from 'react-tooltip'
import { scheduleCustomStyles } from '../../models/ScheduleStyles';

const ScheduleRow = ({ editable, groupIndex, item, index, ...props }) => {
  return (
    <div className={clsx("flex w-full justify-between min-h-[100px]", scheduleCustomStyles[props.style.value].rowStyle)}>
      <div className={clsx("relative flex w-full justify-center items-center", scheduleCustomStyles[props.style.value].clockCol)}>
				{ 
					editable && 
						<div className="hidden md:flex items-center justify-center absolute right-2 top-2 w-8 h-8 group" onClick={() => props.handleDeleteItem(groupIndex, index)}>
							<Trash className="cursor-pointer group-hover:scale-125 group-active:scale-90 transition-all"  data-tooltip-id="my-tooltip" data-tooltip-content={`Obriši ${index + 1}. vrstu`} data-tooltip-delay-show={400}/>
						</div>
				}
				<div className={clsx(props.systemType.value === 'school' ? 'w-1/4' : 'w-full', "text-center")}>
          { index + 1 }
        </div>
        { props.systemType.value === 'school' ?
          <div className="h-full w-3/4 flex justify-center items-center  cursor-pointer group " onClick={editable ? () => props.handleSetTimeOpen(groupIndex, index) : undefined} >
						{ item.defaultTimes[index]?.from ? 
            <>
              { item.defaultTimes[index].from  } - { item.defaultTimes[index].to  }
            </> : <Clock size={16} className="group-hover:scale-150 transition-all " />}
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
							style={props.style}
            />
          )
        })
      }
      
    </div>
  )
}

export default ScheduleRow;