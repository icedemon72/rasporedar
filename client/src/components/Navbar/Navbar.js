import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLogoutMutation } from '../../app/api/sessionApiSlice';
import { useGetUserQuery } from '../../app/api/userApiSlice';
import Sidebar from '../Sidebar/Sidebar';
import { Menu, SquareUserRound, XCircle } from 'lucide-react';
import NavItem from './NavItem';
import Dropdown from './Dropdown';
import MutationState from '../MutationState/MutationState';
import clsx from 'clsx';
import { useOutsideClick } from '../../hooks/useOutsideClick';


const Navbar = () => {
	const session = useSelector(state => state.session);

	const [
		logout,
		{
			isLoading: isLogoutLoading,
			isSuccess: isLogoutSuccess,
			isError: isLogoutError
		}
	] = useLogoutMutation();

	const navigate = useNavigate();
	const location = useLocation();
	const dropdownClose = useRef();
	const sidebarClose = useRef();


	const [ open, setOpen ] = useState(false);
	const [ dropdownOpen, setDropdownOpen ] = useState(false);
 
	const handleDropdown = () => {
		setDropdownOpen(prev => !prev);
	}


	const handleLogout = async () => {
		try {
			await logout({ refresh_token: session.refreshToken }).unwrap();
		} catch (err) {
			console.log('err1', err);
		} finally {
			navigate('/login');
		}
	}

	const _ = useGetUserQuery('', {
		skip: !session.refreshToken
	});

	useOutsideClick(dropdownClose, () => {
		if(dropdownOpen) {
			setDropdownOpen(prev => !prev);
		}
  }, ['dropdownOpen']);

	useOutsideClick(sidebarClose, () => {
		if(open) {
			setOpen(prev =>  !prev);
		}
  }, ['navOpen']);

	return (
		<>
			<MutationState 
				isLoading={isLogoutLoading}
				isSuccess={isLogoutSuccess}
				successMessage='Uspešno odjavljivanje!'
			/>
			<nav className="fixed top-0 left-0 w-full h-full bg-secondary border-b-2 border-black max-h-[76px] z-[1000]">
				<div className="flex flex-wrap items-center justify-between mx-auto p-4">
					<div className="flex items-center gap-2">
						<div id="navOpen" className="p-2 cursor-pointer" onClick={() => setOpen(!open)}>
							{open ? <XCircle className="animate-in slide-in-from-top-3 cursor-pointer" /> : <Menu />}
						</div>
						<Sidebar open={open} ref={sidebarClose} />
						<div className="hidden w-full md:block md:w-auto" id="navbar-default">
							<ul className="font-medium flex flex-col p-4 md:p-0 mt-4 borderrounded-lg md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0">
								<li className="hidden md:block">
									<Link to="/" className="flex py-2 px-3 font-black uppercase items-center">
										<span>Rasporedar</span>
										<div className="bg-redar dark:bg-megumin bg-cover w-6 h-6"></div>
									</Link>
								</li>
								<li>
									<NavItem url="/" text="Početna" />
								</li>
								<li>
									<NavItem url="/about" text="O nama" />		
								</li>
								<li>
									<NavItem url="/contact" text="Kontakt" />					
								</li>
							</ul>
						</div>
					</div>

					<p className="block md:hidden py-2 px-3 font-black uppercase">Rasporedar</p>

					<div className="hidden lg:flex items-center gap-2">
						{
							session.refreshToken ?
							<>
								<NavItem url="/institutions" text="Moje grupe" />
								<div id="dropdownOpen" className="relative" >
									<button className={clsx("py-2 px-3 border-2 transition-all", dropdownOpen ? 'border-black box-shadow bg-red-600 text-white' : 'border-transparent')} onClick={handleDropdown} type="button" aria-label="Profil meni"><SquareUserRound /></button>
									<Dropdown ref={dropdownClose} open={dropdownOpen} logout={handleLogout} /> 
								</div>
							</>
							:
							<>
								{location.pathname === '/login' ?
									<NavItem url="/register" text="Registracija" />	
									: <NavItem url="/login" text="Prijava" />	
								}
							</>
						}
					</div>
				</div>
			</nav>
		</>

	)
}

export default Navbar;