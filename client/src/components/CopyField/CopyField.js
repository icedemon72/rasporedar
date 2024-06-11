import { Copy, CheckSquare } from 'lucide-react';
import React, { useState } from 'react';

const CopyField = ({ text, size = 16, timeout = 2000 }) => {
	const [ copied, setCopied ] = useState(false);
	
	const handleClick = () => {
		navigator.clipboard.writeText(text);
		setCopied(true);

		setTimeout(() => {
			setCopied(false);
		}, timeout);
	}

	return (
		<div className="cursor-pointer border-2 border-black hover:bg-blue-200 p-2 flex items-center gap-1 transition-all" onClick={handleClick}>
			<p>{ text }</p>
			{
				copied ?
					<CheckSquare color='green' size={size} /> :
					<Copy size={size} /> 
				}
			
		</div>
	)
}

export default CopyField;