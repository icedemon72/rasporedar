import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useLogoutMutation } from '../../app/api/sessionApiSlice';
import { useGetUserQuery } from '../../app/api/userApiSlice';
import Sidebar from '../Sidebar/Sidebar';
import { Menu, XCircle } from 'lucide-react';
import NavItem from './NavItem';

const Navbar = () => {
	const session = useSelector(state => state.session);
	const [fetchLogout,
		{
			isLoading: isFetchLogoutLoading,
			isSuccess: isFetchLogoutSuccess,
			isError: isFetchLogoutError
		}
	] = useLogoutMutation();

	const navigate = useNavigate();
	const location = useLocation();
	const [open, setOpen] = useState(false);

	const handleLogout = async () => {
		try {
			await fetchLogout({ refresh_token: session.refreshToken }).unwrap();
		} catch (err) {
			console.log('err1', err);
		} finally {
			navigate('/login');
		}
	}

	const _ = useGetUserQuery('', {
		skip: !session.refreshToken
	});

	return (
		<>
			<nav className="fixed top-0 left-0 w-full h-full bg-white border-b-2 border-black max-h-[76px] z-[1000]">
				<div className="flex flex-wrap items-center justify-between mx-auto p-4">
					<div className="flex items-center gap-2">
						<div className="p-2 cursor-pointer" onClick={() => setOpen(!open)}>
							{open ? <XCircle className="animate-in slide-in-from-top-3 cursor-pointer" /> : <Menu />}
						</div>
						<Sidebar open={open} />
						<div className="hidden w-full md:block md:w-auto" id="navbar-default">
							<ul className="font-medium flex flex-col p-4 md:p-0 mt-4 borderrounded-lg md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0">
								<li className="hidden md:block">
									<p className="block py-2 px-3 font-black uppercase">Rasporedar</p>
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

					<ul className="hidden lg:flex items-cente gap-2">
						{
							session.refreshToken ?
							<>
								<NavItem url="/institutions" text="Moje grupe" />
								<NavItem url="/institutions/create" text="+" />
								<button className="py-2 px-3 bg-red-500 hover:bg-red-300 " onClick={handleLogout}>
									Izloguj se!
								</button>
							</>
							:
							<>
								{location.pathname === '/login' ?
									<Link className="py-2 px-3 hover:bg-black hover:text-white justify-self-end" to="/register">Registruj se</Link>
									: <Link className="py-2 px-3 hover:bg-black hover:text-white justify-self-end" to="/login">Uloguj se!</Link>}

							</>
						}
					</ul>
				</div>
			</nav>
		</>





	)
}

export default Navbar;