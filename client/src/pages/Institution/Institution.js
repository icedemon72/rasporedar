import { useNavigate, useParams, Link } from 'react-router-dom';
import { useGetByIdQuery, useGetRoleQuery } from '../../app/api/institutionsApiSlice';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { Filter, Pencil } from 'lucide-react';
import MutationState from '../../components/MutationState/MutationState';
import { useGetSchedulesQuery } from '../../app/api/schedulesApiSlice';
import ScheduleComponent from '../../components/ScheduleComponent/ScheduleComponent';
import { scheduleStyles, scheduleTypes } from '../../models/SelectModels';
import InstitutionCard from '../../components/InstitutionCard/InstitutionCard';
const ProfessorImage = require('./../../assets/images/professors/wizard.png');
const SubjectImage = require('./../../assets/images/subjects/book2.png');
const ScheduleImage = require('./../../assets/images/schedules/scroll.png');
const UsersImage = require('./../../assets/images/users/users1.png');

const Institution = () => {
  const { institution } = useParams();
  const session = useSelector(state => state.session);

  const navigate = useNavigate();

  const { 
    data: institutionData, 
    isLoading: isInstitutionLoading, 
    isSuccess: isInstitutionSuccess, 
    isError: isInstitutionError,
    error: institutionError 
  } = useGetByIdQuery({ id: institution }, {
    skip: !session.refreshToken
  });

  const { 
    data: getRole, 
    isLoading: isRoleLoading,
    isSuccess: isRoleSuccess
  } = useGetRoleQuery(institution, {
    skip: !isInstitutionSuccess 
  });

	const {
		data: schedules,
		isLoading: isSchedulesLoading,
		isSuccess: isSchedulesSuccess
	} = useGetSchedulesQuery({ institution, fullInfo: 1, active: 1 });

  if(!institution) {
    navigate('/institutions');  
  }

  let InstitutionContent, role;

  if (isInstitutionSuccess && isRoleSuccess && isSchedulesSuccess) {
    role = getRole.role;
    
    InstitutionContent = 
    <>
      <div className="w-full flex justify-center pt-5 gap-2 my-5">
				<h1 className="text-xl font-black max-w-[500px] truncate"> { institutionData.name }</h1>
				{ role === 'Owner' ? <Link to={`/institutions/${institution}/edit`}><span className="flex items-center p-1 border-2 border-black hover:box-shadow cursor-pointer bg-secondary transition-all"><Pencil size={16} /></span></Link> : null }
      </div>

			<div className="w-full flex justify-center">
				<div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 mx-2 lg:mx-10">
					<InstitutionCard image={ScheduleImage} url={`/institutions/${institution}/schedules`} text="Rasporedi" />
					<InstitutionCard image={SubjectImage} url={`/institutions/${institution}/subjects`} text='Predmeti'/>
					<InstitutionCard image={ProfessorImage} url={`/institutions/${institution}/professors`} text='Profesori' />
					<InstitutionCard image={UsersImage} url={`/institutions/${institution}/users`} text='Članovi' />
				</div>
			</div>

			<div className="w-full flex flex-col items-center justify-center mt-5">
				<h1 className="text-xl font-bold my-5">Aktivni rasporedi</h1>
				<div className="w-full lg:w-3/4 flex justify-end">
					<div className="flex gap-2 border-2 rounded-md">
						<Filter /> Filteri
					</div>
				</div>
				{
					schedules.length === 0 ? <span>Nema aktivnih rasporeda...</span> : null
				}
				{
					schedules.map(schedule => {
						const props = {
							groups: schedule.groups,
							editable: false,
							rows: schedule.instances,
							days: schedule.days,
							systemType: scheduleTypes.find(t => t.value === schedule.systemType),
							style: scheduleStyles.find(s => s.value === schedule.style)
						}
						return (
							<Link to={`/institutions/${institution}/schedules/${schedule._id}`} className='w-full lg:w-3/4 mb-10 relative overflow-x-auto'>
								<p className="text-center font-bold text-xl">{ schedule.title }</p>
								<p className="text-center font-semibold text">{ schedule.department }</p>
								<ScheduleComponent {...props}/>
							</Link>
						)
					})
				}

			</div>


          
    </>
  }
  
  useEffect(() => {
    document.title = (institutionData) ? `${institutionData.name} | Rasporedar` : 'Grupa | Rasporedar';
  }, [ isInstitutionSuccess ]); 

  return (
    <>
			<MutationState
				isLoading={isInstitutionLoading || isRoleLoading || isSchedulesLoading}
			/>

      { InstitutionContent }
    </>
  )
}

export default Institution;