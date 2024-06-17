import { Info, Pencil } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

const DataTable = ({ data, url, urlKey = "_id", elemKey = 'name', emptyMessage, role, isSuccess, professors = false }) => {
	return (
		<div>
			{ data.map(elem => {
				return (
					<>
						<div className="w-full flex items-center justify-between p-2 mb-2 hover:bg-primary transition-all">
							<Link to={`${url}/${elem[urlKey]}`}>
								{ 
									professors ? 
										<div className="flex gap-2 items-center">
											<span className="text-muted text-sm truncate">{elem.title}</span>
											<p>{ elem[elemKey] }</p>
										</div>
										: 
										<>
											{ elem[elemKey] }
										</>
								}
							</Link>
							<div className="flex gap-3">
								{ isSuccess && role !== 'User' ? <Link className="btn-primary bg-primary p-1" to={`${url}/${elem[urlKey]}/edit`}><Pencil /></Link> : null }
								<Link className="btn-primary bg-primary p-1" to={`${url}/${elem[urlKey]}`}><Info /></Link>
							</div>
						</div>
					</>
				)
			}) }
			{ 
				data.length === 0 && 
					<div className="w-full flex items-center justify-between p-2 mb-2">
						{ emptyMessage }
					</div>
			}

		</div>
	)
}

export default DataTable;