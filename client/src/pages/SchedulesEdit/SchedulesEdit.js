import { useEffect } from 'react'
import { useGetScheduleByIdQuery } from '../../app/api/schedulesApiSlice';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useGetRoleQuery } from '../../app/api/institutionsApiSlice';
import ScheduleComponent from '../../components/ScheduleComponent/ScheduleComponent';
import SchedulesAdd from '../SchedulesAdd/SchedulesAdd';

const SchedulesEdit = () => {
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
  } else if (isScheduleSuccess) {
    const props = {
      _id: scheduleData._id,
      title: scheduleData.title,
      style: scheduleData.style,
      validUntil: scheduleData.validUntil,
      systemType: scheduleData.systemType,
      subtitle: scheduleData.subtitle,
      comment: scheduleData.comment,
      department: scheduleData.department,
      groups: scheduleData.groups,
      days:  scheduleData.days,
      rows: scheduleData.instances
    }

    content = <SchedulesAdd { ...props } edit={true}/>
  }

  useEffect(() => {
    document.title = 'Uredi raspored | Rasporedar';
  }, []);

  return (
    <>
      <div>SchedulesEdit</div>
      { content }
    </>
  )
}

export default SchedulesEdit;