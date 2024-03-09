import { useNavigate, useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useGetByIdQuery, useGetRoleQuery, useEditInstitutionMutation, useDeleteInstitutionMutation, useInstitutionChangeCodeMutation } from '../../app/api/institutionsApiSlice';
import { useState, useEffect, useRef } from 'react';
import ModalDelete from '../../components/ModalDelete/ModalDelete';
import { addItemToArrayOnKey, deleteItemFromArray } from '../../utils/updateArray';
import { RefreshCcw, Copy, Trash, Save, PlusCircle } from 'lucide-react';
const InstitutionEdit = () => {
  const { institution } = useParams();
  const session = useSelector(state => state.session);
  const inputRef = useRef(null);
  const [ 
    fetchEdit, 
    {
      isLoading: isFetchEditLoading,
      isSuccess: isFetchEditSuccess
    }
  ] = useEditInstitutionMutation();
  
  const [ 
    fetchDelete, 
    {
      isLoading: isFetchDeleteLoading,
      isSuccess: isFetchDeleteSuccess
    }
  ] = useDeleteInstitutionMutation();

  const [ 
    fetchEditCode, 
    {
      isLoading: isFetchEditCodeLoading
    } 
  ] = useInstitutionChangeCodeMutation();

  const [ open, setOpen ] = useState(false);
  const [ isSubmitting, setIsSubmitting ] = useState(false);

  const [ departments, setDepartments ] = useState([]);
  const [ name, setName ] = useState('');
  const [ typeOf, setTypeOf ] = useState('');
  const [ dpt, setDpt ] = useState('');

  const navigate = useNavigate();
  
  const { 
    data: getRole, 
    isLoading: isGetRoleLoading, 
    isSuccess: isGetRoleSuccess, 
    isError: isGetRoleError,
    error: getRoleError 
  } = useGetRoleQuery(institution, {
    skip: !session.accessToken
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
      const result = fetchEditCode({ institution, body }).unwrap();
    } catch (err) {
      console.log(err);
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleEditInstitution = async () => {
    try {
      setIsSubmitting(true);
      const body = { name, typeOf, departments };
      const result = await fetchEdit({ id: institution, body }).unwrap();
    } catch (err) {
      console.log(err);
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleDeleteInstitution = async () => {
    try {
      setIsSubmitting(true);
      const result = await fetchDelete(institution).unwrap();
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

  if(isGetRoleError && getRoleError.status === 405) {
    content = '405 method not allowed!';
  } 
  
  if(isInstitutionSuccess && isGetRoleSuccess) {
    content = 
    <>
      <label className="block text-gray-700 text-sm font-bold mb-2">Naziv grupe</label>
      <input className="input-field mb-4" type="text" value={name} disabled={getRole.role !== 'Owner'} onChange={(elem) => setName(elem.target.value)}/>
      <label className="block text-gray-700 text-sm font-bold mb-2">Tip grupe</label>
      <input className="input-field mb-4" type="text" value={typeOf} disabled={getRole.role !== 'Owner'} onChange={(elem) => setTypeOf(elem.target.value)}/>
      <label className="block text-gray-700 text-sm font-bold mb-2">Odseci, odeljenja itd.</label>
      <div className="w-full flex">
        <input className="input-field rounded w-1/2 md:w-2/3 lg:w-3/4 xl:w-4/5 py-2 px-3" type="text" placeholder="Naziv odseka/odeljenja" ref={inputRef} onKeyUp={(elem) => handleAddDepartment(elem)} onChange={(elem) => setDpt(elem.target.value)} value={dpt}></input>
        <button className="border rounded w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline flex justify-center"  type="text" onClick={() => handleAddDepartment(inputRef.current, null)}><PlusCircle /></button>
      </div>
      { departments.map((elem, i) => {
        return (
          <div class="flex flex-row justify-between mt-2">
            <div>{ i + 1 }</div>
            <p>{ elem }</p>
            <div class="flex justify-center cursor-pointer hover:bg-red-200 text-red-500 rounded-sm" onClick={() => handleDeleteDepartment(i)}><Trash /></div> 
          </div>
      )})}
      <div className="flex items-center  mt-4">
        <label className="block text-gray-700 text-sm font-bold">Kodovi</label>
        <button disabled={isSubmitting} className="p-2 cursor-pointer hover:bg-slate-300 flex rounded-md"  onClick={handleCodeChange}>
          {<RefreshCcw className="hover:animate-spin hover:direction-reverse" size={16} />}
        </button>
      </div>

      <div className="mt-4 flex justify-between">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">Kod za korisnike</label>
          <div className="flex items-center">
            <div className="cursor-pointer hover:bg-slate-300 rounded-md p-2 flex" onClick={() => navigator.clipboard.writeText(institutionData.code.toUpperCase())}>
              {institutionData.code.toUpperCase()}
              <Copy size={16} />
            </div> 
            <button disabled={isSubmitting} className="p-2 hover:bg-slate-300 cursor-pointer rounded-md" onClick={() => handleCodeChange('user')}>
              {<RefreshCcw className="hover:animate-spin hover:direction-reverse" size={16}/>}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">Kod za moderatore</label>
          <div className="flex items-center">
            <div className="cursor-pointer hover:bg-slate-300 rounded-md p-2 flex" onClick={() => navigator.clipboard.writeText(institutionData.moderatorCode.toUpperCase())}>
              {institutionData.moderatorCode.toUpperCase()}
              <Copy size={16} />
            </div>
            <button disabled={isSubmitting} className="p-2 hover:bg-slate-300 cursor-pointer rounded-md" onClick={() => handleCodeChange('mod')}>
              {<RefreshCcw className="hover:animate-spin hover:direction-reverse" size={16}/>}
            </button>
          </div>
        </div>

      </div>
      <div className="w-full  flex justify-center mt-3">
        <button className="flex w-full md:w-1/2 lg:w-1/3 btn-green rounded justify-center" onClick={handleEditInstitution} disabled={isSubmitting}><Save /> Sačuvaj promene!</button>
      </div>
      <div className="w-full  flex justify-center mt-3">
        <button className="flex w-full md:w-1/2 lg:w-1/3 btn-red rounded justify-center" onClick={() => setOpen(true)} disabled={isSubmitting}><Trash /> Obrisi grupu</button>
      </div>
      { isFetchEditCodeLoading ? <>Loading...</> : null }
      { isFetchDeleteLoading ? <>Loading...</> : null }
      { isFetchEditLoading ? <>Loading... </> : null }
      { isFetchEditSuccess ? <>Grupa je uspesno izmenjena! </> : null }
      { isFetchDeleteSuccess ? <>Uspešno brisanje grupe!</> : null }

      <Link className="block" to={`/institutions/${institution}/professors`}>Profesori</Link>
      <Link className="block" to={`/institutions/${institution}/subjects`}>Predmeti</Link>
      <Link className="block" to={`/institutions/${institution}/schedules`}>Rasporedi</Link>
      
      {/* Schedule link */}
      {/* <Link to={}></Link> */}
      
    </>
  }

  useEffect(() => {
    if(isInstitutionSuccess) {
      setDepartments(institutionData.departments);
      setName(institutionData.name);
      setTypeOf(institutionData.typeOf);
      document.title = `Uredi ${institutionData.name} | Rasporedar`;
    } else {
      document.title = 'Uredi grupu | Rasporedar';
    }
  }, [ isInstitutionSuccess ])

  return (
    <>
      { open ? 
        <ModalDelete title={'Brisanje grupe'} text={`Obrisacete grupu '${institutionData.name}'. Da li ste sigurni?`}>
          <button className="bg-gray-300 hover:bg-gray-500 p-2 rounded" onClick={() => setOpen(false)}>Odustani</button>
          <button className="bg-red-300 hover:bg-red-500 p-2 rounded" onClick={handleDeleteInstitution}>Potvrdi</button>
        </ModalDelete> 
        : null 
      }
      <div className="w-full flex justify-center">
        <div className="w-full md:w-1/2 lg:w-1/3">
          { content }
        </div>
      </div>
    </>
  )
}

export default InstitutionEdit;