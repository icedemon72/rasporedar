import { useEffect, useState, useRef } from 'react';
import { useAddMutation } from '../../app/api/institutionsApiSlice';
import { Link, useNavigate } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import { addItemToArrayOnKey, deleteItemFromArray } from '../../utils/updateArray';
import Input from '../../components/Input/Input';
import { Helmet } from 'react-helmet';
import SelectComponent from '../../components/Input/SelectComponent';
import MutationState from '../../components/MutationState/MutationState';
import CardContainer from '../../components/CardContainer/CardContainer';
import ListItem from '../../components/ListItem/ListItem';

/* TODO ADD ON CLICK SUPPORT */

const typeObj = [
	{ value: 'primary', label: 'Osnovna škola' },
	{ value: 'high', label: 'Srednja škola' },
	{ value: 'faculty', label: 'Visokoobrazovna institucija' },
	{ value: 'other', label: 'Drugo/ne želim da navedem'}
]

const CreateInstitution = () => {
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const [ isSubmitting, setIsSubmitting ] = useState(false);
  const [ name, setName ] = useState('');
  const [ typeOf, setTypeOf ] = useState({});
  const [ dpt, setDpt ] = useState('');
  const [ departments, setDepartments ] = useState([]);

  const [ 
    fetchAdd, 
    { 
      isSuccess: isFetchAddSuccess, 
      isError: isFetchAddError,
      isLoading: isFetchAddLoading
    }
  ] = useAddMutation();

  const handleDepartments = (elem, key = 'Enter') => {
    const toAdd = addItemToArrayOnKey(departments, elem, key, true);
    if(toAdd.changed) {
      setDepartments(toAdd.result);
      setDpt('');
    }
  }

  const handleDeleteDepartment = (index) => {
    let tempDepartments = [ ...departments ]; 
    const toDelete = deleteItemFromArray(tempDepartments, index);
    if(toDelete) {
      setDepartments(toDelete);
    }
  }

  const handleCreate = async () => {
    try {
      setIsSubmitting(true);
      // input validation here
      const body = {
        name, typeOf: typeOf.value, departments
      }

      if(!isSubmitting) {
        const result = await fetchAdd(body).unwrap();
        setTimeout(() => {
          navigate(`/institutions/${result._id}`);
        }, 1000);
      }
    } catch (err) {
      setIsSubmitting(false);
      console.log(err);
    } 
  }

  useEffect(() => {}, [ departments.length ]);

  return (
    <>
			<MutationState 
				isLoading={isFetchAddLoading}
				isSuccess={isFetchAddSuccess}
				isError={isFetchAddError}
				successMessage="Uspešno kreiranje grupe!"
				errorMessage="Greška prilikom kreiranja grupe!"
			/>
			<Helmet>
				<title>Napravi grupu | Rasporedar</title>
			</Helmet>
      <CardContainer>
				<h1 className="text-xl font-bold py-5 text-center">Napravi grupu</h1>
				<div className="mb-4">
					<Input id="name" type="text" name="Naziv institucije ili grupe" inputVal={name} placeholder="Prirodno-matematički fakultet" setVal={(elem) => setName(elem.target.value)}/>
				</div>
				<div className="mb-4">
					<label className="label-primary">Tip institucije ili grupe</label>
						<SelectComponent data={typeObj} placeholder="Izaberite instituciju" isClearable={false} isSearchable={false} setVal={(elem) => setTypeOf(elem)} value={typeOf} />
				</div>
				<div className="mb-4">
					<label className="label-primary">Odseci, odeljenja itd.</label>
					<div className="w-full flex gap-1">
						<input className="input-primary" ref={inputRef} id="dptID" type="text" placeholder="Odseci, odeljenja (enter za dodavanje)" onKeyUp={(elem) => handleDepartments(elem)} onChange={(elem) => setDpt(elem.target.value)} value={dpt} />
						<button className="btn-plus" type="text" onClick={() => handleDepartments(inputRef.current, null)}><PlusCircle /></button>
					</div>
				</div>
				{
					departments.map((elem, i) => {
						return (
							<ListItem text={elem} index={i} deleteFunc={() => handleDeleteDepartment(i)} />
						);
					})
				}
				<div className="flex justify-end w-full mt-3">
					<button className="w-full md:w-1/2 lg:w-1/3 btn-primary btn-green" onClick={handleCreate} disabled={isSubmitting}>Napravi grupu!</button>
				</div>
				<p className="text-sm text-center my-4">Trebaš biti u grupi? <Link className="underline hover:no-underline" to='/institutions/join'>Pridruži se</Link></p>
			</CardContainer>
    </>
  )
}

export default CreateInstitution;