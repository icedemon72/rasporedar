import React from 'react'
import Select from 'react-select';

const customStyles = {
  control: (baseStyles, state) => ({
      ...baseStyles,
      borderColor: 'black',
			borderWidth: 2,
			borderRadius: 0,
			zIndex: 1,
			"&:hover": {
				borderColor: "black",
			},
			'&:focus': {
				borderColor: "black",
			},
			'&:active': {
				borderColor: "black",
			},
	}),
	menu: base => ({
    ...base,
    zIndex: 10,
  }),
	option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    return {
      ...styles,
			backgroundColor: 'white',
      color: 'black',
      cursor: isDisabled ? 'not-allowed' : 'pointer',
			'&:hover': {
				backgroundColor: 'black',
				color: 'white'
			}

    }
	},
	multiValue: (base) => ({
		...base,
		backgroundColor: 'white',
		color: 'black',
		borderWidth: 2,
		borderColor: 'black'
	}),
};

const SelectComponent = ({ data, placeholder = 'Izaberite vrednost', isClearable = true, isSearchable = true, isMulti = false, value = null, setVal, required = false }) => {
	return (
		<Select 
			className="w-full" 
			placeholder={placeholder} 
			value={value} 
			options={data} 
			styles={customStyles} 
			required={required}
			isClearable={isClearable}
			isSearchable={isSearchable}
			isMulti={isMulti}
			maxMenuHeight={250}
			onChange={setVal}
		/>
	)
}

export default SelectComponent