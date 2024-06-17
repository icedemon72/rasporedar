import React, { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import ToggleSwitch from '../ToggleSwitch/ToggleSwitch';
import { useDispatch, useSelector } from 'react-redux';
import { setTheme } from '../../app/slices/settingsSlice';

const Dropdown = forwardRef(({ open, logout }, ref) => {
	const theme = useSelector(state => state.settings.theme);
	const dispatch = useDispatch();

	const handleChangeTheme = (light = true) => {
		const theme = light ? 'light' : 'dark';
		dispatch(setTheme(theme));
	}

	return (
		<>
			{
				open ?
				<div ref={ref} className="absolute right-2 flex flex-col mt-2 border-2 border-black p-2 bg-white dark:bg-gray-800 w-full min-w-[300px] ">
					<Link to={'/my_profile'} className="dropdown-link">Profil</Link>
					<Link to={'/institutions/join'} className="dropdown-link">Pridruži se grupi</Link>
					<Link to={'/institutions/create'} className="dropdown-link">Napravi novu grupu</Link>
					<div className="flex justify-center items-center gap-2 mt-2">
						<div className="bg-redar bg-cover w-14 h-14"></div>
						<ToggleSwitch changeFunc={handleChangeTheme} isChecked={theme === 'dark'} firstText='' secondText=''/>
						<div className="bg-megumin bg-cover w-14 h-14"></div>
					</div>
					<hr className="my-2"/>
					<div className="dropdown-link" onClick={() => logout()}>Odjavi se</div>
				</div>
				: null
			}
		</>
	)
});

export default Dropdown;