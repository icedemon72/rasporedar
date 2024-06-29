import { useEffect } from 'react'
import { useGetByIdQuery, useGetRoleQuery } from '../../app/api/institutionsApiSlice';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useGetSchedulesQuery } from '../../app/api/schedulesApiSlice';
import { Helmet } from 'react-helmet';
import { Info, Pencil, PlusCircle } from 'lucide-react';
import CardContainer from '../../components/CardContainer/CardContainer';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import MutationState from '../../components/MutationState/MutationState';
import DataTable from '../../components/DataTable/DataTable';

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
    data: scheduleData,
    isLoading: isSchedulesLoading,
    isSuccess: isSchedulesSuccess,
    isError: isSchedulesError,
    error, schedulesError
  } = useGetSchedulesQuery({ institution, active: getRole.role === 'User'}, {
    skip: !getRole
  });

  
  let content; 
	if (isSchedulesSuccess && isRoleSuccess) {
		content = 
		<>
			<CardContainer large={true} onTop={true} containerBgClass='bg-image-primary'>
				<Breadcrumbs />
				<h1 className="text-xl font-bold text-center py-5">Rasporedi</h1>
					{	
						getRole.role !== 'User' &&
             <Link className="w-full flex justify-center" to={`/institutions/${institution}/schedules/add`}>
						 <div className="w-full max-w-[500px] flex gap-2 items-center justify-center btn-primary btn-green mb-5">
							 <PlusCircle size={16} /> 
							 <p>Dodaj raspored</p>
						 </div>
					 </Link> 
					}
					
					{
						scheduleData.length ? 
							scheduleData.map(schedule => 
								<>
								<div className="w-full flex items-center justify-between p-2 mb-2 hover:bg-primary transition-all">
									<Link to={`/institutions/${institution}/schedules/${schedule._id}`}>
										<div className="flex gap-2 items-center">
										<span className="text-muted text-sm truncate">{schedule.department || ''}</span>
											<p className="truncate">{schedule.title || 'Raspored bez naslova'}</p>
										</div>
									</Link>
									<div className="flex gap-3">
										{ isRoleSuccess && getRole.role !== 'User' ? <Link className="btn-primary bg-primary p-1" to={`/institutions/${institution}/schedules/${schedule._id}/edit`}><Pencil /></Link> : null }
										<Link className="btn-primary bg-primary p-1" to={`/institutions/${institution}/schedules/${schedule._id}`}><Info /></Link>
									</div>
								</div>
								</>
							)
						:
						<div className="w-full flex items-center justify-between p-2 mb-2">
							Izgleda da nema rasporeda... :(
						</div>
					}
			
				</CardContainer>
		</>
  }

  return (
    <>
			<MutationState
				isLoading={isRoleLoading || isSchedulesLoading}

			/>
			<Helmet>
				<title>Rasporedi | Rasporedar</title>
			</Helmet>
      { content }
    </>
  )
}

export default Schedules;