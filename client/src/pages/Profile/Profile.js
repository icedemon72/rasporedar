import React, { useEffect, useState } from 'react';
import CardContainer from '../../components/CardContainer/CardContainer';
import { useEditUserMutation, useGetUserQuery } from '../../app/api/userApiSlice';
import MutationState from '../../components/MutationState/MutationState';
import Input from '../../components/Input/Input';
import { Helmet } from 'react-helmet';
import { Save } from 'lucide-react';

const Profile = () => {	
	const [ username, setUsername ] = useState('');
	const [ email, setEmail ] = useState('');
	const [ name, setName ] = useState('');
	
	const [ oldPassword, setOldPassword ] = useState('');
	const [ newPassword, setNewPassword ] = useState('');

	const {
		data: userData,
		isLoading: isUserLoading,
		isSuccess: isUserSuccess
	} = useGetUserQuery();

	const [
		editUser,
		{
			isLoading: isEditUserLoading,
			isSuccess: isEditUserSuccess,
			isError: isEditUserError,
			error: editUserError
		}
	] = useEditUserMutation();

	useEffect(() => {
		if(isUserSuccess) {
			setUsername(userData.username);
			setEmail(userData.email);
			setName(userData.name);
		}
	}, [ isUserSuccess ]);

	const handleEditUser = async () => {
		try {
			let body = {
				username, email, name
			}

			if(oldPassword || newPassword) {
				body.oldPassword = oldPassword;
				body.newPassword = newPassword;
			}

			await editUser(body);
		} catch(e) {
			console.log(e);
		}
	}

	return (
		<>
			<Helmet>
				<title>Moj profil | Rasporedar</title>
			</Helmet>

			<MutationState 
				isLoading={isUserLoading || isEditUserLoading}
				isError={isEditUserError}
				error={editUserError}
				isSuccess={isEditUserSuccess}
				successMessage='Uspešno ste izmenili informacije!'
			/>
			{
				isUserSuccess &&
				<CardContainer>
					<h1 className="text-xl font-bold my-5 text-center">Moj profil</h1>
					<div className="mb-4">
						<Input
							id="name"
							type="text"
							name="Ime korisnika"
							inputVal={name}
							placeholder="Marko Marković"
							setVal={(elem) => setName(elem.target.value)}
						/>
					</div>

					<div className="mb-4">
						<Input
							id="email"
							type="email"
							name="E-adresa"
							inputVal={email}
							placeholder="marko.markovic@primer.com"
							setVal={(elem) => setEmail(elem.target.value)}
						/>
					</div>

					<div className="mb-4">
						<Input
							id="username"
							type="text"
							name="Korisničko ime"
							inputVal={username}
							placeholder="marko.markovic"
							setVal={(elem) => setUsername(elem.target.value)}
						/>
					</div>

					<div className="my-4">
						<Input
							id="oldPassword"
							type="password"
							name="Stara lozinka"
							inputVal={oldPassword}
							placeholder="•••••••"
							setVal={(elem) => setOldPassword(elem.target.value)}
						/>
					</div>

					<div className="mb-4">
						<Input
							id="newPassword"
							type="password"
							name="Nova lozinka"
							inputVal={newPassword}
							placeholder="•••••••"
							setVal={(elem) => setNewPassword(elem.target.value)}
						/>
					</div>

					<div className="flex mt-2">
					<div className="w-full flex justify-end items-center">
						<button className="flex gap-2 w-full lg:max-w-[270px] justify-center btn-primary btn-green" onClick={handleEditUser}><Save /> Sačuvaj promene!</button>
					</div>
					</div>
					
				</CardContainer>
			}
		</>
	)
}

export default Profile;