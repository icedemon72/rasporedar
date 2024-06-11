import { useParams, Link } from 'react-router-dom';
import { useGetSubjectsQuery } from '../../app/api/subjectsApiSlice';
import { useSelector } from 'react-redux';
import { useGetRoleQuery } from '../../app/api/institutionsApiSlice';
import { PlusCircle, Search } from 'lucide-react';
import DataTable from '../../components/DataTable/DataTable';
import { Helmet } from 'react-helmet';
import MutationState from '../../components/MutationState/MutationState';

const Subjects = () => {
  const { institution } = useParams();
  const session = useSelector(state => state.session);
  
  const {
    data,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetSubjectsQuery({ institution }, {
    skip: !institution || !session.refreshToken
  });

  const { 
    data: getRole, 
		isLoading: isGetRoleLoading,
    isSuccess: isGetRoleSuccess, 
  } = useGetRoleQuery(institution, { skip: !session.refreshToken  });

  let content;

  if (isSuccess) {
    content = 
    <>
      <div className="w-full flex justify-center px-2 md:px-0">
        <div className="w-full md:w-1/2 lg:w-1/3">
          { isGetRoleSuccess && getRole.role !== 'User' &&
            <Link to={`/institutions/${institution}/subjects/add`}>
              <div className="w-full flex gap-2 items-center justify-center btn-primary btn-green mb-5">
                <PlusCircle size={16} /> 
                <p>Dodaj predmet</p>
              </div>
            </Link>
					}
					<div class="w-full flex justify-end my-2">
						<div class="w-full md:w-2/3 lg:w-1/2 flex gap-2">
							<input className="input-primary" placeholder="Web programiranje"/>
							<button className="btn-primary"><Search /></button>
						</div>
					</div>

					<DataTable 
						data={data} 
						url={`/institutions/${institution}/subjects`} 
						emptyMessage="Izgleda da nema predmeta... :(" 
						role={getRole.role}
						isSuccess={isGetRoleSuccess}
					/>
        </div>
      </div>
    </>
  }

  return (
    <>
			<Helmet>
				<title>Predmeti | Rasporedar</title>
			</Helmet>

			<MutationState 
				isLoading={isLoading || isGetRoleLoading}
				isError={isError}
				error={error}
			/>

			<h1 className="text-xl font-bold text-center py-5">Predmeti</h1>
      {content}
    </>
  )
}

export default Subjects;