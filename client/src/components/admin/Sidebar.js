import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
	return (
		<nav className="w-full lg:w-80 bg-secondary border-r-2 border-black">
			<p className="text-sm font-bold text-center py-2">Rasporedar admin</p>
			<div className="flex flex-col">
				<Link className="p-2" to="/admin">Pregled</Link>
				<Link className="p-2" to="/admin/users">Korisnici</Link>
				<Link className="p-2" to="/admin/institutions">Grupe</Link>
			</div>
		</nav>
	)
}

export default Sidebar;