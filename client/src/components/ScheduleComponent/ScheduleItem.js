import React from 'react';
import ScheduleLink from './ScheduleLink';
import { useParams } from 'react-router-dom';

const ScheduleItem = ({
  item, systemType, editable, handleSetOpen, groupIndex, index, ind
}) => {

  const { institution } = useParams();

  return (
    <>
      {/* Change onClick here to be edit if it is already set! */}
      <div className="flex flex-col justify-center w-full items-center cursor-pointer hover:bg-slate-200" onClick={ editable ? () => handleSetOpen(groupIndex, index, ind) : undefined }>
      { item?.subject?.name ? 
        <>
          <div className="w-full flex flex-col justify-center text-center border-b-2 font-bold">
            <ScheduleLink editable={editable}  to={`/institutions/${institution}/subjects/${item.subject._id}`}>
              { item.subject.name }
            </ScheduleLink>
            { systemType !== 'school' ? 
              <div className="block">
                ({ item?.from } - { item?.to })
              </div> : null }
          </div>
          { item?.lecturer?.name ? 
              <ScheduleLink editable={editable} to={`/institutions/${institution}/professors/${item.lecturer._id}`} className="w-full flex justify-center text-sm">
                { item.lecturer.name }  
              </ScheduleLink>

          : null}
          {
            item?.location ? 
            <div className="text-xs block">{ item.location }</div> : null
          }
        </> 
        :  editable ? '+' : null
        }
      </div>
    </>
  )
}

export default ScheduleItem;