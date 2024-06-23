import { useNavigate, useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useGetByIdQuery, useGetRoleQuery, useEditInstitutionMutation, useDeleteInstitutionMutation, useInstitutionChangeCodeMutation } from '../../app/api/institutionsApiSlice';
import { useState, useEffect, useRef } from 'react';
import ModalDelete from '../../components/ModalDelete/ModalDelete';
import { addItemToArrayOnKey, deleteItemFromArray } from '../../utils/updateArray';
import { RefreshCcw, Copy, Trash, Save, PlusCircle } from 'lucide-react';
import Input from '../../components/Input/Input';
import SelectComponent from '../../components/Input/SelectComponent';
import getLabel from '../../utils/getLabel';
import Loader from '../../components/Loader/Loader';
import MutationState from '../../components/MutationState/MutationState';
import CopyField from '../../components/CopyField/CopyField';
import CardContainer from '../../components/CardContainer/CardContainer';
import ListItem from '../../components/ListItem/ListItem';

const typeObj = [
	{ value: 'primary', label: 'Osnovna škola' },
	{ value: 'high', label: 'Srednja škola' },
	{ value: 'faculty', label: 'Visokoobrazovna institucija' },
	{ value: 'other', label: 'Drugo/ne želim da navedem'}
]

const InstitutionEdit = () => {
  const { institution } = useParams();
  const session = useSelector(state => state.session);
  const inputRef = useRef(null);
  
	const [ 
    edit, 
    {
      isLoading: isEditLoading,
      isSuccess: isEditSuccess,
			isError: isEditError,
			error: editError
    }
  ] = useEditInstitutionMutation();
  
  const [ 
    deleteInstitution, 
    {
      isLoading: isDeleteInstitutionLoading,
      isSuccess: isDeleteInstitutionSuccess,
			isError: isDeleteInstitutionError,
			error: deleteInstitutionError
    }
  ] = useDeleteInstitutionMutation();

  const [ 
    editCode, 
    {
      isLoading: isEditCodeLoading,
			isSuccess: isEditCodeSuccess,
			isError: isEditCodeError,
			error: editCodeError
    } 
  ] = useInstitutionChangeCodeMutation();

  const [ open, setOpen ] = useState(false);
  const [ isSubmitting, setIsSubmitting ] = useState(false);

  const [ departments, setDepartments ] = useState([]);
  const [ name, setName ] = useState('');
  const [ typeOf, setTypeOf ] = useState({});
  const [ dpt, setDpt ] = useState('');

  const navigate = useNavigate();
  
  const { 
    data: getRole, 
    isLoading: isGetRoleLoading, 
    isSuccess: isGetRoleSuccess, 
    isError: isGetRoleError,
    error: getRoleError 
  } = useGetRoleQuery(institution, {
    skip: !session.refreshToken
  });

  const { 
    data: institutionData, 
    isLoading: isInstitutionLoading, 
    isSuccess: isInstitutionSuccess, 
    isError: isInstitutionError,
    error: institutionError 
  } = useGetByIdQuery({ id: institution, code: true }, {
    skip: !isGetRoleSuccess
  });

  const handleCodeChange = async (toChange = null) => {
    try {
      const body = (toChange === 'mod') ? { moderatorCode: 1 } 
        : (toChange === 'user') ? { code: 1 }
          : { moderatorCode: 1, code: 1 };
      const result = editCode({ institution, body }).unwrap();
    } catch (err) {
      console.log(err);
    } finally {
      setIsSubmitting(false);
    }
  }

	// MAIN FUNCTION
  const handleEditInstitution = async () => {
    try {
      setIsSubmitting(true);
      const body = { name, typeOf: typeOf.value, departments };
      await edit({ id: institution, body }).unwrap();
    } catch (err) {
      console.log(err);
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleDeleteInstitution = async () => {
    try {
      setIsSubmitting(true);
      await deleteInstitution(institution).unwrap();
      setOpen(false);
      setTimeout(() => {
        navigate('/institutions');
      }, 1000);

    } catch (err) {
      console.log(err);
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleAddDepartment = (elem, key = 'Enter') => {
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


  let content;

  if(isInstitutionSuccess && isGetRoleSuccess) {
    content = 
    <>
			<h1 className="text-xl font-bold text-center py-5 truncate">{ institutionData.name }</h1>
      <div className="mb-4">
				<Input id="name" type="text" name="Naziv institucije ili grupe" inputVal={name} placeholder="Prirodno-matematički fakultet" setVal={(elem) => setName(elem.target.value)}/>
			</div>
			
			<div className="mb-4">
				<label className="label-primary">Tip institucije ili grupe</label>
					<SelectComponent 
						data={typeObj} 
						placeholder="Izaberite instituciju"
						isClearable={false}
						isSearchable={false}
						setVal={(elem) => setTypeOf(elem)}
						value={typeOf}
						required={true} 
					/>
			</div>

     
		 <div className="mb-4">
				<label className="label-primary">Odseci, odeljenja itd.</label>
				<div className="w-full flex gap-1">
					<input className="input-primary" type="text" placeholder="Naziv odseka/odeljenja" ref={inputRef} onKeyUp={(elem) => handleAddDepartment(elem)} onChange={(elem) => setDpt(elem.target.value)} value={dpt}></input>
					<button className="btn-plus w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 bg-primary"  type="text" onClick={() => handleAddDepartment(inputRef.current, null)}><PlusCircle /></button>
				</div>
				{ departments.map((elem, i) => {
					return (
						<ListItem text={elem} index={i} deleteFunc={() => handleDeleteDepartment(i)} />
				)})}

		 </div>

		 <div className="border-2 border-black p-2 rounded-md">
      <div className="flex justify-between items-center gap-2">
        <label className="label-primary">Kodovi</label>
        <button disabled={isSubmitting} className="btn-primary cursor-pointer group bg-primary active:bg-secondary" onClick={handleCodeChange}>
              {<RefreshCcw className="group-hover:animate-spin hover:direction-reverse" size={16}/>}
            </button>
      </div>

      <div className="mt-4 flex justify-between">
        <div>
          <label className="label-primary">Kod za korisnike</label>
          <div className="flex items-center gap-2">
						<CopyField text={institutionData.code.toUpperCase()}/>

            <button disabled={isSubmitting} className="bg-primary active:bg-secondary cursor-pointer group btn-primary" onClick={() => handleCodeChange('user')}>
              {<RefreshCcw className="group-hover:animate-spin hover:direction-reverse" size={16}/>}
            </button>
          </div>
        </div>

        <div>
          <label className="label-primary">Kod za moderatore</label>
          <div className="flex items-center gap-2">
						<CopyField text={institutionData.moderatorCode.toUpperCase()}/>

            <button disabled={isSubmitting} className="bg-primary active:bg-secondary cursor-pointer group btn-primary" onClick={() => handleCodeChange('mod')}>
              {<RefreshCcw className="group-hover:animate-spin hover:direction-reverse" size={16}/>}
            </button>
          </div>
        </div>

      </div>
		 </div>


			<div className="flex justify-between gap-4 mt-2">
				<div className="w-full  flex justify-center items-center">
					<button className="flex gap-2 w-full justify-center btn-primary btn-red" onClick={() => setOpen(true)} disabled={isSubmitting}><Trash /> Obriši grupu</button>
				</div>
				<div className="w-full flex justify-center items-center">
					<button className="flex gap-2 w-full justify-center btn-primary btn-green" onClick={handleEditInstitution} disabled={isSubmitting}><Save /> Sačuvaj promene!</button>
				</div>
			</div>  
    </>
  }

  useEffect(() => {
    if(isInstitutionSuccess) {
      setDepartments(institutionData.departments);
      setName(institutionData.name);
			setTypeOf(typeObj[typeObj.map(i => i.value).indexOf(institutionData.typeOf)]);
			
      document.title = `Uredi ${institutionData.name} | Rasporedar`;
    } else {
      document.title = 'Uredi grupu | Rasporedar';
    }
  }, [ isInstitutionSuccess ])

  return (
    <>
			<MutationState 
				isLoading={isEditLoading || isDeleteInstitutionLoading || isEditCodeLoading || isInstitutionLoading}
				isSuccess={isEditSuccess}
				isError={isEditError}
				error={editError}
				successMessage='Grupa je uspešno izmenjena!'
			/>
			<MutationState 
				isSuccess={isDeleteInstitutionLoading}
				isError={isDeleteInstitutionError}
				error={deleteInstitutionError}
				successMessage='Grupa je uspešno obrisana!'
			/>
			<MutationState 
				isSuccess={isEditCodeSuccess}
				isError={isEditCodeError}
				error={editCodeError}
				successMessage='Uspešna izmena!'
			/>
      { open ? 
        <ModalDelete title={'Brisanje grupe'} text={`Obrisacete grupu '${institutionData.name}'. Da li ste sigurni?`}>
          <button className="btn-primary bg-primary" onClick={() => setOpen(false)}>Odustani</button>
          <button className="btn-primary btn-red" onClick={handleDeleteInstitution}>Potvrdi</button>
        </ModalDelete> 
        : null 
      }
      <CardContainer loaded={isInstitutionSuccess && isGetRoleSuccess} containerBgClass='bg-image-primary'>
				{ content }		
			</CardContainer>
    
    </>
  )
}

export default InstitutionEdit;