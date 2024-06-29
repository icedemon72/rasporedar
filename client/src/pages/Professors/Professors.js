import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetProfessorsQuery } from '../../app/api/professorsApiSlice';
import { useSelector } from 'react-redux';
import { useGetRoleQuery } from '../../app/api/institutionsApiSlice';
import { PlusCircle, Search } from 'lucide-react';
import { Helmet } from 'react-helmet';

import DataTable from '../../components/DataTable/DataTable';
import MutationState from '../../components/MutationState/MutationState';
import CardContainer from '../../components/CardContainer/CardContainer';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';

const Professors = () => {
  const { institution } = useParams();
  const session = useSelector(state => state.session);
	const [ professors, setProfessors ] = useState([]);
	const [ search, setSearch ] = useState('');

  const { 
    data: professorData, 
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

	const handleSearch = (event) => {
		event.preventDefault();
		event.stopPropagation();
		setProfessors(prev => professorData.filter(x => x.name.toLowerCase().search(search) !== -1 || x?.title?.toLowerCase()?.search(search) !== -1));
	}

  let professorsContent;

	if (isProfessorsSuccess) {
    professorsContent = 
    <>
      <CardContainer large={true} onTop={true} containerBgClass='bg-image-primary'>
				<Breadcrumbs />
				<h1 className="text-xl font-bold text-center py-5">Profesori</h1>
					{ isGetRoleSuccess && getRole.role !== 'User' &&
             <Link className="w-full flex justify-center" to={`/institutions/${institution}/professors/add`}>
						 <div className="w-full max-w-[500px] flex gap-2 items-center justify-center btn-primary btn-green mb-5">
							 <PlusCircle size={16} /> 
							 <p>Dodaj profesora</p>
						 </div>
					 </Link> 
					 }

					<div className="w-full flex justify-end my-2">	
						<form onSubmit={handleSearch} className="w-full md:w-2/3 lg:w-1/2 flex gap-2">
							<input onChange={(e) => setSearch(e.target.value.toLowerCase())} className="input-primary" placeholder="Marko Markovic"/>
							<button type="submit" className="btn-primary bg-primary"><Search /></button>
						</form>
					</div>

					<DataTable 
						data={professors} 
						url={`/institutions/${institution}/professors`} 
						emptyMessage="Izgleda da nema profesora... :(" 
						role={getRole.role}
						isSuccess={isGetRoleSuccess}
						professors={true}
					/>
				</CardContainer>

    </>
  } 

	useEffect(() => {
		if(isProfessorsSuccess) {
			setProfessors(professorData);
		}
	}, [ isProfessorsSuccess ]);

  return (
    <>
			<MutationState 
				isLoading={isProfessorsLoading || isGetRoleLoading}
				isError={isGetRoleError}
			/>
			<Helmet>
				<title>Profesori | Rasporedar</title>
			</Helmet>
      { professorsContent }
    </>
  )
}

export default Professors;