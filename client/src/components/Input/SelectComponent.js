import React from 'react'
import { useSelector } from 'react-redux';
import Select from 'react-select';


const SelectComponent = ({ data, placeholder = 'Izaberite vrednost', isClearable = true, isSearchable = true, isMulti = false, value = null, setVal, required = false }) => {
	const theme = useSelector(state => state.settings.theme);
	
	const main = theme === 'dark' ? 'rgb(55, 65, 81)' : 'white';
	const WnB = theme === 'dark' ? 'white' : 'black';
	const customStyles = {
		control: (baseStyles, state) => ({
				...baseStyles,
				backgroundColor: theme === 'dark' ? 'rgb(31, 41, 55)' : 'white',
				borderColor: 'black',
				borderWidth: 2,
				borderRadius: 6,
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
			top: '100%',
      bottom: 'auto',
			borderRadius: 6,
		}),
		menuList: base => ({
			...base,
			backgroundColor: main,
			borderWidth: 2,
			borderColor: 'black',
			borderRadius: 6,
		}),
		option: (styles, { data, isDisabled, isFocused, isSelected }) => ({
			...styles,
			backgroundColor: main,
			borderColor: main,
			color: WnB,
			cursor: isDisabled ? 'not-allowed' : 'pointer',
			'&:hover': {
				backgroundColor: theme === 'dark' ? 'rgb(31, 41, 55)' : 'black',
				color: 'white'
			}
		}),
		multiValue: (base, { isSelected }) => ({
			...base,
			backgroundColor: main,
			color: WnB,
			borderWidth: 2,
			borderColor: 'black',
		}),
		multiValueLabel: (base) => ({
			...base,
			color: WnB,
		}),
		singleValue: (base) => ({
			...base,
			color: WnB,
		}),
		menuPortal: (base) => ({
      ...base,
      zIndex: 9999,
    }),
	};
	
	
	
	return (
		<Select 
			className="w-full" 
			placeholder={<span className="text-muted">{placeholder}</span>} 
			value={value} 
			options={data} 
			styles={customStyles} 
			required={required}
			isClearable={isClearable}
			isSearchable={isSearchable}
			isMulti={isMulti}
			maxMenuHeight={250}
			onChange={setVal}
			menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
		/>
	)
}

export default SelectComponent