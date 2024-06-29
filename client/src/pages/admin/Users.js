import React from 'react';
import Sidebar from '../../components/admin/Sidebar';

const Users = () => {
	return (
		<div className="min-h-[calc(100vh-76px)] flex flex-col lg:flex-row">
			<Sidebar />
			<div className="flex-1">Content</div>
		</div>
	)
}

export default Users;