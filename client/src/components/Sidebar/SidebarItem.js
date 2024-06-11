import clsx from 'clsx';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const SidebarItem = ({ url, text, activeLinks = [] }) => {
	const location = useLocation();
	let isActive = false;

	if(!activeLinks.length) {
		activeLinks.push(url);
	}

	if(activeLinks.indexOf(location.pathname) !== -1) {
		isActive = true;
	}
	
	return (
		<Link className={clsx('flex gap-2 py-2 px-3 hover:bg-red-600 hover:text-white active:bg-red-700 font-semibold truncate', isActive ? 'bg-red-600 text-white  underline' : '')} to={ url }>{ text }</Link>	
	)
}

export default SidebarItem;