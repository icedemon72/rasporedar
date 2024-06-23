import { ChevronDown, ChevronUp } from 'lucide-react';
import React, { useState } from 'react';
import clsx from 'clsx';
const CollapseContainer = ({ label, data, isOpen = true }) => {
	const [ open, setOpen ] = useState(isOpen);

	
	return (
		<>
			<p className="label-primary inline-flex items-center gap-2"  onClick={() => setOpen(prev => !prev)}>
				{ label }
				<div className="inline-flex btn-primary p-0 cursor-pointer bg-secondary" >
					{ 
						open ?
						<ChevronDown size={16} />
						:
						<ChevronUp size={16} />

					}

				</div>
				
			</p>
			
			<div className="h-auto">
				<div className={clsx(
					'collapse-container',
					open? 'h-full block' : 'h-0 hidden'
				)}>
					<div className="input-primary mb-4">
						{ data?.length ? data : '-' }
					</div>
				</div>
			</div>
		</>
	)
}

export default CollapseContainer;