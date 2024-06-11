import { useParams, Link } from 'react-router-dom';
import { useGetProfessorsQuery } from '../../app/api/professorsApiSlice';
import { useSelector } from 'react-redux';
import { useGetRoleQuery } from '../../app/api/institutionsApiSlice';
import { PlusCircle, Search } from 'lucide-react';
import DataTable from '../../components/DataTable/DataTable';
import MutationState from '../../components/MutationState/MutationState';
import { Helmet } from 'react-helmet';

const Professors = () => {
  const { institution } = useParams();
  const session = useSelector(state => state.session);

  const { 
    data: professors, 
    isLoading: isProfessorsLoading, 
    isSuccess: isProfessorsSuccess,
    isError: isProfessorsError
  } = useGetProfessorsQuery(institution, {
    skip: !session.refreshToken
  });

  const { 
    data: getRole, 
		isLoading: isGetRoleLoading,
    isSuccess: isGetRoleSuccess, 
		isError: isGetRoleError
  } = useGetRoleQuery(institution, { skip: !session.refreshToken  });

  let professorsContent;

	if (isProfessorsSuccess) {
    professorsContent = 
    <>
      <div className="w-full flex justify-center px-2 md:px-0">
        <div className="w-full md:w-1/2 lg:w-1/3">
          { isGetRoleSuccess && getRole.role !== 'User' &&
             <Link to={`/institutions/${institution}/professors/add`}>
						 <div className="w-full flex gap-2 items-center justify-center btn-primary btn-green mb-5">
							 <PlusCircle size={16} /> 
							 <p>Dodaj profesora</p>
						 </div>
					 </Link> 
					 }

					<div class="w-full flex justify-end my-2">
						<div class="w-full md:w-2/3 lg:w-1/2 flex gap-2">
							<input className="input-primary" placeholder="Marko Markovic"/>
							<button className="btn-primary"><Search /></button>
						</div>
					</div>

					<DataTable 
						data={professors} 
						url={`/institutions/${institution}/professors`} 
						emptyMessage="Izgleda da nema profesora... :(" 
						role={getRole.role}
						isSuccess={isGetRoleSuccess}
						professors={true}
					/>
        </div>
      </div>
    </>
  } 

  return (
    <>
			<MutationState 
				isLoading={isProfessorsLoading || isGetRoleLoading}
				isError={isProfessorsError || isGetRoleError}
			/>
			<Helmet>
				<title>Profesori | Rasporedar</title>
			</Helmet>
			<h1 className="text-xl font-bold text-center py-5">Profesori</h1>
      { professorsContent }
    </>
  )
}

export default Professors;