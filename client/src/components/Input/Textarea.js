import React from 'react';

const Textarea = ({ id, inputVal, setVal, name, placeholder, disabled = false }) => {
	return (
		<>
			<label className="label-primary">{ name }</label>
			<textarea className="input-primary" id={id} name={id} onChange={setVal} placeholder={placeholder} disabled={disabled} >{ inputVal }</textarea>
		</>
	)
}

export default Textarea;