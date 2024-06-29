import { useEffect } from 'react'
import { useGetScheduleByIdQuery } from '../../app/api/schedulesApiSlice';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { useGetRoleQuery } from '../../app/api/institutionsApiSlice';
import ScheduleComponent from '../../components/ScheduleComponent/ScheduleComponent';
import { Pen, Pencil } from 'lucide-react';
import MutationState from '../../components/MutationState/MutationState';
import { scheduleStyles, scheduleTypes } from '../../models/SelectModels';
const Schedule = () => {
  const session = useSelector(state => state.session);
  const { institution, id } = useParams();

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

	if(isScheduleSuccess && isRoleSuccess) {
		const style = scheduleStyles.find(s => s.value === scheduleData.style)
    const props = {
      groups: scheduleData.groups,
      editable: false,
      rows: scheduleData.instances,
      days: scheduleData.days,
      systemType: scheduleTypes.find(t => t.value === scheduleData.systemType),
			style
    };
    
    content = 
    <>
      <div className="w-full flex flex-col items-center justify-center">
        <p className="flex gap-2 py-5">
          <h1 className="text-xl font-bold">{ scheduleData.title || 'Raspored' }</h1>
          { getRole.role !== 'User' ? <Link className="p-1 border-2 bg-secondary border-black hover:box-shadow cursor-pointer transition-all" to={`/institutions/${institution}/schedules/${id}/edit`}><Pencil size={16} /></Link> : null}
        </p>  
        <p className="text-lg font-semibold">{ scheduleData.subtitle }</p>
				{ scheduleData.department }
			</div>
      
    
			<div className="relative overflow-x-auto">
				<div className="w-full mt-5 p-2 rounded min-w-[1000px]">
					<ScheduleComponent {...props} /> 
					<p className="p-2">{ scheduleData.comment }</p>
				</div>
			</div>
      
    </>
  }

  useEffect(() => {
    document.title = 'Raspored | Rasporedar';
  }, []);

  return (
    <>
			<MutationState 
				isLoading={isRoleLoading || isScheduleLoading}
				isError={isScheduleError}
				error={scheduleError}
			/>
      { content }
    </>
  )
}

export default Schedule;