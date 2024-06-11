import React from 'react';
import ScheduleLink from './ScheduleLink';
import { useParams } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import clsx from 'clsx';
import { scheduleCustomStyles } from '../../models/ScheduleStyles';

const ScheduleItem = ({
  item, systemType, editable, handleSetOpen, groupIndex, index, ind, style
}) => {

  const { institution } = useParams();

  return (
    <>
			<div className={clsx("flex flex-col justify-center w-full items-center cursor-pointer group p-4", scheduleCustomStyles[style.value].colStyle)} onClick={ editable ? () => handleSetOpen(groupIndex, index, ind) : undefined }>
      	{ 
					item?.subject?.name ? 
					<div className="relative w-full text-center group-hover:scale-105 transition-all">
						<div className="w-full flex flex-col justify-center text-center font-bold">
							<ScheduleLink editable={editable}  to={`/institutions/${institution}/subjects/${item.subject._id}`}>
								{ item.subject.name }
							</ScheduleLink>
							{ systemType.value !== 'school' ? 
								<div className="block">
									({ item?.from } - { item?.to })
								</div> : null }
						</div>
						{ 
							item?.lecturer?.name &&
								<ScheduleLink editable={editable} to={`/institutions/${institution}/professors/${item.lecturer._id}`} className="w-full flex justify-center text-sm">
									{ item.lecturer.name }  
								</ScheduleLink>
						}
						{
							item?.location ? 
							<div className="text-xs block">{ item.location }</div> : null
						}
					</div> 
					: 
					 editable ? <PlusCircle data-tooltip-id="my-tooltip" data-tooltip-content={`Dodaj ${index + 1}. predavanje`} className="group-hover:scale-150 transition-all" /> : null
        }
      </div>
    </>
  )
}

export default ScheduleItem;