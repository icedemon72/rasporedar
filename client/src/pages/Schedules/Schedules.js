import { useEffect } from 'react'
import { useGetByIdQuery, useGetRoleQuery } from '../../app/api/institutionsApiSlice';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useGetSchedulesQuery } from '../../app/api/schedulesApiSlice';
import { Helmet } from 'react-helmet';
import { PlusCircle } from 'lucide-react';

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
  //   skip: !session.refreshToken
  // });

  const { 
    data: getRole, 
    isLoading: isRoleLoading,
    isSuccess: isRoleSuccess
  } = useGetRoleQuery(institution, {
    skip: !session.refreshToken
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
    // content = schedulesData.map(schedule => {
    //   let fullDate = '';
    //   if(schedule.validUntil) {
    //     const date = new Date(schedule.validUntil);

    //     const yyyy = date.getFullYear();
    //     const mm = ((date.getMonth() + 1) < 10) ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
    //     const dd = (date.getDate() < 10) ? `0${date.getDate()}` : date.getDate();

    //     fullDate = `${dd}.${mm}.${yyyy}.`;

    //   }
      
    //   return (
    //     <>
    //       <div className="bg-red-200">
    //         { getRole.role !== 'User' ? <Link to={`/institutions/${institution}/schedules/${schedule._id}/edit`}>Edit</Link> : null }
    //         <Link className="hover:bg-slate-200 rounded-sm" to={`/institutions/${institution}/schedules/${schedule._id}`}>
    //           { schedule.title || 'Raspored bez naziva' } 
    //         </Link>
    //         { schedule.department }
    //         { schedule.validUntil ? <>Vazi do { fullDate }</> : null}
    //       </div>
    //     </>
    //   )
    // })

		content = 
		<>
			<div className="w-full flex justify-center">
				<div className="w-full md:w-1/2 lg:w-1/3">
					{ isRoleSuccess && getRole.role !== 'User' &&
						<Link to={`/institutions/${institution}/schedules/add`}>
							<div className="w-full flex gap-2 items-center justify-center btn-primary btn-green mb-5">
								<PlusCircle size={16} /> 
								<p>Dodaj raspored</p>
							</div>
						</Link>
					}
				</div>
			</div>
		</>
  }

  return (
    <>
			<Helmet>
				<title>Rasporedi | Rasporedar</title>
			</Helmet>
      <h1 class="text-xl font-bold text-center py-5">Rasporedi</h1>
      { content }
    </>
  )
}

export default Schedules;