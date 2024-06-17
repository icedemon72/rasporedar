import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';

const NavItem = ({ url, text, activeLinks = [] }) => {
	const location = useLocation();
	let isActive = false;

	if(!activeLinks.length) {
		activeLinks.push(url);
	}

	if(activeLinks.indexOf(location.pathname) !== -1) {
		isActive = true;
	}

	return (
		<Link className={clsx('block py-2 px-3  hover:bg-red-600 hover:text-white active:scale-95 font-semibold border-2 border-black bg-secondary rounded', isActive ? 'bg-red-600 text-white box-shadow' : '')} to={ url }>{ text }</Link>	
	);
}

export default NavItem;