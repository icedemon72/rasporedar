import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { useGetProfessorQuery, useGetProfessorSubjectsQuery } from '../../app/api/professorsApiSlice';
import { useEffect, useState } from 'react';
import { useGetRoleQuery } from '../../app/api/institutionsApiSlice';
import { Pencil } from 'lucide-react';
import MutationState from '../../components/MutationState/MutationState';
import CollapseContainer from '../../components/CollapseContainer/CollapseContainer';
import DataTable from '../../components/DataTable/DataTable';
import CardContainer from '../../components/CardContainer/CardContainer';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';


const Professor = () => {
  const session = useSelector(state => state.session);
  const { id, institution } = useParams();

  const [ professor, setProfessor ] = useState([]);
  const [ assistent, setAssistent ] = useState([]);

  const {
    data: professorData, 
    isLoading: isProfessorLoading,
    isSuccess: isProfessorSuccess,
    isError: isProfessorError
  } = useGetProfessorQuery({ institution, id }, {
    skip: !session.refreshToken || !id || !institution
  });

  const {
    data: subjectsData,
    isLoading: isSubjectsLoading,
    isSuccess: isSubjectsSuccess
  } = useGetProfessorSubjectsQuery({ institution, id }, {
    skip: !session.refreshToken || !professorData
  })

  const { 
    data: getRole, 
    isLoading: isGetRoleLoading, 
    isSuccess: isGetRoleSuccess, 
    isError: isGetRoleError
  } = useGetRoleQuery(institution, { skip: !session.refreshToken  });
  
  let content;

  if (isSubjectsSuccess && isProfessorSuccess && isGetRoleSuccess) {
    content = 
    <CardContainer large={true} containerBgClass='bg-image-primary'>
			<Breadcrumbs />
			<h1 className="text-xl font-bold text-center py-5">{ professorData.name }</h1>
      <p className="label-primary">Ime i prezime</p>
			<div className="input-primary mb-4 flex items-center gap-2">{professorData.title} {professorData.name}  
        { getRole.role !== 'User' && <Link className="p-1 border-2 border-black hover:box-shadow cursor-pointer" to={`/institutions/${institution}/professors/${id}/edit`}><Pencil size={16} /></Link> }
      </div>

			<div calssName="mb-4">
				<CollapseContainer label="Stručna biografija" data={professorData.bio} />
			</div>

			<p className="label-primary">Osnovne studije</p>
			<div className="input-primary mb-4">{professorData.education?.bachelor?.institution || '-'}</div>
      <div className="flex justify-center gap-3 w-full">
        <p className="input-primary mb-4 w-full md:w-1/2">{ professorData.education?.bachelor?.from || '-' }</p>
        <p className="input-primary mb-4 w-full md:w-1/2">{ professorData.education?.bachelor?.to || '-' }</p>
      </div>

			<p className="label-primary">Master studije</p>
      <div className="input-primary mb-2">{professorData.education?.master?.institution || '-'}</div>
      <div className="flex justify-center gap-3 w-full">
        <div className="input-primary mb-4 w-full md:w-1/2">{ professorData.education?.master?.from || '-' }</div>
        <div className="input-primary mb-4 w-full md:w-1/2">{ professorData.education?.master?.to || '-'}</div>
      </div>

			<p className="label-primary">Doktorske studije</p>
      <p className="input-primary mb-4">{professorData.education?.doctorate?.institution || '-'}</p>
      <div className="flex justify-center gap-3 w-full">
        <div className="input-primary mb-4 w-full md:w-1/2">{ professorData.education?.doctorate?.from || '-' }</div>
        <div className="input-primary mb-4 w-full md:w-1/2">{ professorData.education?.doctorate?.to || '-'}</div>
      </div>

			<div className="mb-4">
				<CollapseContainer 
					label="Reference"
					isOpen={false}
					data={
						professorData.references.map((elem, i) => {
							return (
								<div className="flex flex-row justify-start gap-2 mt-2">
									<div>{i + 1}</div>
									<p>{ elem }</p>
								</div>
							);
						})
					}
				/>
			</div>
      
			{
				subjectsData?.professor.length ?
				<>
					<h2 className="label-primary">Profesor na predmetima</h2>
					<DataTable 
						data={subjectsData.professor}
						url={`/institutions/${institution}/subjects`}
						isSuccess={isGetRoleSuccess}
						role={getRole.role}
						emptyMessage='-'
					/>
				</>
				: null
			}
      
      {
				subjectsData?.assistent.length ?
				<>
					<h2 className="label-primary">Asistent na predmetima</h2>
					<DataTable 
						data={subjectsData.assistent}
						url={`/institutions/${institution}/subjects`}
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
    document.title = professorData ? `Profesor ${professorData.name} | Rasporedar` : `Profesor | Rasporedar`;
  }, [ isProfessorSuccess ]);
  
  
  return (
    <>      
			<MutationState 
				isLoading={isSubjectsLoading || isGetRoleLoading || isProfessorLoading}
				isError={isProfessorError || isGetRoleError}
				timeout={500}
			/>

			{ content }
    </>
  )
}

export default Professor;