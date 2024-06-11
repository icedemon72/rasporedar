// import { CircleX } from 'lucide-react';


const Input = ({ id, inputVal, setVal, name, placeholder, type, disabled = false, min, max }) => {
	return (
		<div className='form-control'>
			<label htmlFor={id} className="block w-full font-semibold">
				{ name }
			</label>
				{
					type !== 'number' ?
						<input
							type={type} id={id} name={id} placeholder={placeholder} value={inputVal} onChange={setVal} disabled={disabled} required
							className="input-primary"
						/>
						:
						<input
							type={type} id={id} placeholder={name} value={inputVal} onChange={setVal} disabled={disabled} autoComplete='off' required min={min} max={max}
							className="peer pr-5 h-8 w-full border-none p-0 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
						/>
				}
				{/* {
					button &&
					<>
						<button type="button" className='absolute right-5' onClick={buttonAction}>
							<CircleX />
						</button>
					</>
				} */}
		</div>
	);
};

export default Input;
