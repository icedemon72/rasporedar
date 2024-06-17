import React, { useState } from 'react';
import { useGetRoleQuery, useGetUsersInInsitutionQuery } from '../../app/api/institutionsApiSlice';
import { useParams } from 'react-router-dom';
import MutationState from '../../components/MutationState/MutationState';
import { Helmet } from 'react-helmet';
import { Contact } from 'lucide-react';
import SelectComponent from '../../components/Input/SelectComponent';
import { roleTypes } from '../../models/SelectModels';

const InstitutionUsers = () => {
	const { institution } = useParams();

	const [ changeRole, setChangeRole ] = useState('');

	const {
		data: role,
		isLoading: isRoleLoading,
		isSuccess: isRoleSuccess
	} = useGetRoleQuery(institution);
	
	const {
		data: userData,
		isLoading: isUsersLoading,
		isSuccess: isUsersSuccess,
		isError: isUsersError,
		error: usersError
	} = useGetUsersInInsitutionQuery({ institution });

	const handleRoleChange = (id, role) => {
		console.log(id, role);
	}

	return (
		<>
			<Helmet>
				<title>Korisnici u grupi | Rasporedar</title>
			</Helmet>
			<MutationState
				isLoading={isUsersLoading}
				isError={isUsersError}
				error={usersError}
			/>

			{
				isUsersSuccess && isRoleSuccess &&
				<>
					<div className="w-full flex justify-center px-2 md:px-0">
						<div className="w-full md:w-1/2 lg:w-1/3">
							<h1 className="text-xl text-center font-bold my-5">Korisnici ({userData.length})</h1>
							<ul>
								{
									 userData.map(user => 
									 <li className="flex items-center gap-2 mb-2">
										<Contact /> 
										<span className="font-bold">{ user.user.name }</span>
										<span>{ user.user.username }</span>
										<span className="text-sm">{ user.role }</span>
									</li>
								)}
							</ul>
						</div>
					</div>
				</>
			}	
		</>
	)
}

export default InstitutionUsers;