import { Clock, Trash } from 'lucide-react';
import clsx from 'clsx';
import ScheduleRow from './ScheduleRow';
import ScheduleItem from './ScheduleItem';
/* change this to be editable and stuff */

const ScheduleComponent = ({
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
                        { index === 0 && props.groups.length !== 1 ? <div className="w-full text-center">{ props.groups[groupIndex] }</div> : null }
                        
                        <ScheduleRow 
                          {...props} 
                          groupIndex={groupIndex}
                          editable={editable} 
                          item={item}
                          index={index}
                        />                        
                      </>
                    )
                  })
                }
                { editable ? 
                  <>
                    <div className="border w-full text-center" onClick={() => props.handleAddItem(groupIndex)}>+</div>
                  </> 
                : null }
              </> 
            )
          })
        }
      </div>
    </>
  )
}

export default ScheduleComponent;