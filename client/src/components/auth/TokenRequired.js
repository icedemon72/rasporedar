import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const TokenRequired = () => {
	const session = useSelector((state) => state.session);
	const location = useLocation();

	return session.refreshToken ? <Outlet /> : <Navigate to='/login' state={{ from: location  }} replace /> 
}

export default TokenRequired;