import { useSelector } from 'react-redux';
import { useGetAllQuery } from '../../app/api/institutionsApiSlice';
import Institution from '../../components/Institution/Institution';
import { Helmet } from 'react-helmet';
import MutationState from '../../components/MutationState/MutationState';

const Institutions = () => {
  const session = useSelector(state => state.session);

  const { data: institutions, isLoading, isSuccess, isError, error } = useGetAllQuery(undefined, {
    skip: !session.refreshToken
  });

  let content;
	
	if (isSuccess) {
    content = institutions.map(elem =>
			<>
				<Institution institution={ elem } />
			</>
    ) 
  }

  return (
    <>
			<MutationState 
				isLoading={isLoading}
				isError={isError}
				errorMessage={error?.message}

			/>

			<Helmet>
				<title>Moje grupe | Rasporedar</title>
			</Helmet>
			<div className="">
				<div className="w-full py-4 bg-primary mb-2">
					<h1 className="text-center text-xl font-black">Moje grupe</h1>
				</div>
				<div className="grid place-content-stretch grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mx-4">
					{ content }
				</div>
			</div>
    </>
  )
}



export default Institutions;