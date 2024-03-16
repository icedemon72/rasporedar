import React from 'react';
import { Link } from 'react-router-dom';

const ScheduleLink = ({
  editable, children, to
}) => {
  return (
    <>
      {
        !editable ? 
          <Link to={to}>
            <div className="hover:bg-slate-400 rounded-sm p-1 hover:underline">
              { children }
            </div>
          </Link>
          : 
          <>
            { children }
          </>
       }
    </>
  )
}

export default ScheduleLink;