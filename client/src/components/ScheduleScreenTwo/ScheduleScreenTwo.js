import { Clock, Trash } from 'lucide-react';
import clsx from 'clsx';
import ScheduleComponent from '../ScheduleComponent/ScheduleComponent';
const ScheduleScreenTwo = ({
  days, rows, groups, handleSetTimeOpen, handleSetOpen, systemType, handleAddItem
}) => {
  
  const props = {
    days, rows, groups, handleSetTimeOpen, handleSetOpen, systemType, handleAddItem
  };

  return (
    <>
      <div className="w-full mt-5">
        <ScheduleComponent editable={true} { ...props }/>
        
      </div>
    </>
  )
}

export default ScheduleScreenTwo;