import { useEffect } from 'react'
import { useGetScheduleByIdQuery } from '../../app/api/schedulesApiSlice';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { useGetRoleQuery } from '../../app/api/institutionsApiSlice';
import ScheduleComponent from '../../components/ScheduleComponent/ScheduleComponent';
import { Pen } from 'lucide-react';
const Schedule = () => {
  const session = useSelector(state => state.session);
  const { institution, id } = useParams();

  const { 
    data: getRole, 
    isLoading: isRoleLoading,
    isSuccess: isRoleSuccess
  } = useGetRoleQuery(institution, {
    skip: !session.accessToken || !institution
  });

  const {
    data: scheduleData,
    isLoading: isScheduleLoading,
    isSuccess: isScheduleSuccess,
    isError: isScheduleError,
    error: scheduleError
  } = useGetScheduleByIdQuery({ institution: institution, schedule: id }, {
    skip: !getRole
  });

  let content;

  if(isScheduleLoading) {
    content = <>Loading...</>
  } else if(isScheduleSuccess && isRoleSuccess) {

    const props = {
      groups: scheduleData.instances.map(elem => elem.group),
      editable: false,
      rows: scheduleData.instances,
      days: scheduleData.days,
      systemType: scheduleData.systemType
    }
    
    content = 
    <>
      <div className="">
        <p className="flex">
          { scheduleData.title || 'Raspored' }
          { getRole.role !== 'User' ? <Link to={`/institutions/${institution}/schedules/${id}/edit`}>Edit</Link> : null}
        </p>  
        <p>{ scheduleData.subitle }</p>
      </div>
      
      
      
      { scheduleData.department }
      <ScheduleComponent {...props} /> 
      <p>{ scheduleData.comment }</p>
      
    </>
  }

  useEffect(() => {
    document.title = 'Raspored | Rasporedar';
  }, []);

  return (
    <>
      <div>Schedule</div>
      { content }
    </>
  )
}

export default Schedule;