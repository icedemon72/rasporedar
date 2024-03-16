import { useEffect } from 'react'
import { useGetByIdQuery, useGetRoleQuery } from '../../app/api/institutionsApiSlice';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useGetSchedulesQuery } from '../../app/api/schedulesApiSlice';

const Schedules = () => {
  const session = useSelector(state => state.session);
  const { institution } = useParams();

  // const {
  //   data: institutionData,
  //   isLoading: isInstitutionLoading,
  //   isSuccess: isInstitutionSuccess,
  //   isError: isInstitutionError,
  //   error: institutionError
  // }  = useGetByIdQuery({ id: institution }, {
  //   skip: !session.accessToken
  // });

  const { 
    data: getRole, 
    isLoading: isRoleLoading,
    isSuccess: isRoleSuccess
  } = useGetRoleQuery(institution, {
    skip: !session.accessToken
  });

  const {
    data: schedulesData,
    isLoading: isSchedulesLoading,
    isSuccess: isSchedulesSuccess,
    isError: isSchedulesError,
    error, schedulesError
  } = useGetSchedulesQuery({ institution, fullInfo: getRole.role !== 'User' }, {
    skip: !getRole
  });

  
  let content; 

  if(isSchedulesLoading && isRoleLoading) {
    content = <>Loading...</>
  } else if (isSchedulesSuccess) {
    content = schedulesData.map(schedule => {
      return (
        <>
          <div className="bg-red-200">
            { getRole.role !== 'User' ? <Link to={`/institutions/${institution}/schedules/${schedule._id}/edit`}>Edit</Link> : null }
            { schedule.title }
            { schedule.department }
            { schedule.validUntil ? <>Vazi do { schedule.validUntil }</> : null}
          </div>
        </>
      )
    })
  }


  useEffect(() => {
    document.title = 'Rasporedi | Rasporedar';
  }, []);
  return (
    <>
      <div>Schedules</div>
      { content }
    </>
  )
}

export default Schedules;