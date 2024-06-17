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
		<div className="btn-primary bg-primary active:bg-secondary cursor-pointer  flex items-center gap-1 transition-all" onClick={handleClick}>
			<p>{ text }</p>
			{
				copied ?
					<CheckSquare className="text-green-600 dark:text-green-800 animate-pulse" size={size} /> :
					<Copy size={size} /> 
				}
			
		</div>
	)
}

export default CopyField;