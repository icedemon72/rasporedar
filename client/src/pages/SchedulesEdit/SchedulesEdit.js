import { useEffect } from 'react'
import { useEditScheduleMutation, useGetScheduleByIdQuery } from '../../app/api/schedulesApiSlice';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useGetRoleQuery } from '../../app/api/institutionsApiSlice';
import SchedulesAdd from '../SchedulesAdd/SchedulesAdd';
import { Helmet } from 'react-helmet';
import MutationState from '../../components/MutationState/MutationState';
import { frequencyTypes, scheduleStyles, scheduleTypes } from '../../models/SelectModels';

const SchedulesEdit = () => {
  const session = useSelector(state => state.session);
  const { institution, id } = useParams();

  const [
    editSchedule,
    {
      data: editScheduleData,
      isLoading: isEditScheduleScheduleLoading,
      isSuccess: isEditScheduleScheduleSuccess,
      isError: isEditScheduleScheduleError,
			error: editScheduleError
    }
  ] = useEditScheduleMutation();

  const { 
    data: getRole, 
    isLoading: isRoleLoading,
    isSuccess: isRoleSuccess
  } = useGetRoleQuery(institution, {
    skip: !session.refreshToken || !institution
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


  if (isScheduleSuccess) {
    const props = {
      _id: scheduleData._id,
      title: scheduleData.title,
      style: scheduleStyles.find(s => s.value === scheduleData.style),
      validFrom: scheduleData.validFrom,
			validUntil: scheduleData.validUntil,
      systemType: scheduleTypes.find(t => t.value === scheduleData.systemType),
      subtitle: scheduleData.subtitle,
      comment: scheduleData.comment,
      department: { value: scheduleData.department, label: scheduleData.department },
      groups: scheduleData.groups,
      days: scheduleData.days,
      rows: scheduleData.instances,
			published: scheduleData.published,
			archived: scheduleData.archived,
			frequency: frequencyTypes.find(f => f.value === scheduleData.frequency),
      editSchedule,
      isEditScheduleScheduleLoading,
      isEditScheduleScheduleSuccess,
      isEditScheduleScheduleError
    }

    content = <SchedulesAdd { ...props } edit={true}/>
  }

  return (
    <>
			<Helmet>
				<title>Uredi raspored | Rasporedar</title>
			</Helmet>
			<MutationState 
				isLoading={isRoleLoading || isScheduleLoading || isEditScheduleScheduleLoading}
				isError={isScheduleError}
				error={scheduleError}
				
			/>
			<MutationState 
				isError={isEditScheduleScheduleError}
				error={editScheduleError}
				isSuccess={isEditScheduleScheduleSuccess}
				successMessage='Raspored uspešno izmenjen!'
			/>
			
      { content }
    </>
  )
}

export default SchedulesEdit;