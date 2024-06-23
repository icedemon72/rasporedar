import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom';
import { useGetSubjectQuery } from '../../app/api/subjectsApiSlice';
import { useGetRoleQuery } from '../../app/api/institutionsApiSlice';
import { Pencil } from 'lucide-react';
import MutationState from '../../components/MutationState/MutationState';
import CollapseContainer from '../../components/CollapseContainer/CollapseContainer';
import DataTable from '../../components/DataTable/DataTable';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import CardContainer from '../../components/CardContainer/CardContainer';

const Subject = () => {
  const session = useSelector(state => state.session);

  const { institution, id } = useParams();
  
  const {
    data, 
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetSubjectQuery({ institution, id, fullInfo: true }, {
    skip: !id || !institution || !session.refreshToken
  });

  const { 
    data: getRole, 
		isLoading: isGetRoleLoading,
    isSuccess: isGetRoleSuccess, 
  } = useGetRoleQuery(institution, { skip: !session.refreshToken  });

  let content;

  if (isSuccess) {
    content = 
    <CardContainer large={true} containerBgClass='bg-image-primary'>

			<Breadcrumbs />
			<div className="flex justify-center gap-2 py-5">
				<h1 className="text-xl font-bold">{ data.name }</h1> 
				{ isGetRoleSuccess && getRole.role !== 'User' && 
					<span className="flex items-center p-1 border-2 border-black hover:box-shadow cursor-pointer">
						<Link to={`/institutions/${institution}/subjects/${id}/edit`}><Pencil size={16} /></Link> 
					</span>
				}
			</div>

			<p className="label-primary">Naziv predmeta</p>
			<div className="input-primary mb-4">
				{ data.name || '-' }
			</div>

			<div className="mb-4">
				<CollapseContainer data={data.description} label="Opis predmeta" />
			</div>
			
			<div className="mb-4">
				<CollapseContainer data={data.goal} label="Cilj predmeta" />
			</div>
			
			<div className="mb-4">
				<CollapseContainer data={data.result} label="Rezultat predmeta" />
			</div>

			{
				data?.professors.length ? 
				<>
					<h2 className="label-primary">Profesori</h2>
					<DataTable 
						data={data.professors}
						professors={true}
						url={`/institutions/${institution}/professors`}
						isSuccess={isGetRoleSuccess}
						role={getRole.role}
						emptyMessage='-'
					/>
				</>
				: null
			}

			{
				data?.assistents.length ? 
				<>
					<h2 className="label-primary">Asistenti</h2>
					<DataTable 
						data={data.assistents}
						url={`/institutions/${institution}/professors`}
						professors={true}
						isSuccess={isGetRoleSuccess}
						role={getRole.role}
						emptyMessage='-'
					/>
				</>
				: null
			}

    </CardContainer>
  }


  useEffect(() => {
    document.title = data ? `Predmet '${data.name}' | Rasporedar` : 'Predmet | Rasporedar';
  }, [ isSuccess ]);

  return (
    <>
      <MutationState 
				isLoading={isLoading || isGetRoleLoading}
				isError={isError}
				error={error}
			/>
      { content }
    </>
  )
}

export default Subject;