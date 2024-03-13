import React from 'react';

const ScheduleItem = ({
  item, systemType, editable, handleSetOpen, groupIndex, index, ind
}) => {
  
  return (
    <>
      {/* Change onClick here to be edit if it is already set! */}
      <div className="flex flex-col justify-center w-full items-center cursor-pointer hover:bg-slate-200" onClick={() => handleSetOpen(groupIndex, index, ind)}>
      { item?.subject?.name ? 
        <>
          <div className="w-full flex flex-col justify-center text-center border-b-2 font-bold">
            { item.subject.name }
            { systemType !== 'school' ? 
              <div className="block">
                ({item?.from } - { item?.to })
              </div> : null }
          </div>
          { item?.lecturer?.name ? 
            <div className="w-full flex justify-center text-sm">{ item.lecturer.name }</div>
          : null}
          {
            item?.location ? 
            <div className="text-xs block">{item.location}</div> : null
          }
        </> 
        : '+' 
        }
      </div>
    </>
  )
}

export default ScheduleItem;