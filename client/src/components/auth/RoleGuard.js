import React from 'react';
import { useGetUserQuery } from '../../app/api/userApiSlice';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const RoleGuard = ({ roles = [] }) => {
	const session = useSelector(state => state.session);
	
	const getRole = useGetUserQuery('', {
		skip: !session.refreshToken
	});

	if(!session.refreshToken) return <Navigate to="/login" />

	if(getRole.isSuccess) {
		const role = getRole.data.role;
		
		if(roles.indexOf(role) === -1) {
			return <Navigate to="/error" replace />
		} else {
			return <Outlet />
		}
	}
} 

export default RoleGuard;