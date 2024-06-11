import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom';
import { useGetSubjectQuery } from '../../app/api/subjectsApiSlice';
import { useGetRoleQuery } from '../../app/api/institutionsApiSlice';
import { Pencil } from 'lucide-react';
import MutationState from '../../components/MutationState/MutationState';
import CollapseContainer from '../../components/CollapseContainer/CollapseContainer';
import DataTable from '../../components/DataTable/DataTable';

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
    <div class="w-full flex flex-col items-center justify-center py-5">
			<div class="flex gap-2">
      	<h1 class="text-xl font-bold">{ data.name }</h1> 
				{ isGetRoleSuccess && getRole.role !== 'User' && 
					<span class="flex items-center p-1 border-2 border-black hover:box-shadow cursor-pointer">
					 	<Link to={`/institutions/${institution}/subjects/${id}/edit`}><Pencil size={16} /></Link> 
					</span>
				}
			</div>

			<div class="w-full md:w-1/2 lg:w-1/3 px-2 md:px-0">
					<p class="label-primary">Naziv predmeta</p>
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
			</div>
    </div>
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