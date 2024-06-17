import React, { useState } from 'react';
import './ToggleSwitch.css';

const ToggleSwitch = ({ isChecked = false, firstText = 'Svetla tema', secondText = 'Tamna tema', changeFunc }) => {
	const [ checked, setChecked ] = useState(isChecked);

	const handleChange = () => {
		setChecked(prev => !prev);
		changeFunc(checked);
  };

	return (
		<div className="toggle-switch flex gap-2 my-2">
			<input checked={checked} className="switch-input" type="checkbox" id="switch" onChange={handleChange} /><label className="switch-label" htmlFor="switch"></label>
			<div>
				{ checked ? secondText : firstText }
			</div>
		</div>
	)
}

export default ToggleSwitch;