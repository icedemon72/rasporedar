import { Trash } from 'lucide-react';
import React from 'react';

const ListItem = ({ text, index, deleteFunc }) => {
	return (
		<div className="flex gap-2 justify-between items-center mt-2 hover:bg-primary">
			<div className="font-bold mx-1">{index + 1}</div>
			<p className="py-3">{ text }</p>
			<div className="flex items-center justify-center" onClick={deleteFunc}>
				<div className="cursor-pointer btn-primary btn-red rounded-sm p-1 mx-2">
					<Trash  />
				</div>
			</div> 
		</div>
	)
}

export default ListItem;