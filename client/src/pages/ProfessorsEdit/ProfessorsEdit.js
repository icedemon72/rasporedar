import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDeleteProfessorMutation, useEditProfessorMutation, useGetProfessorQuery, useGetProfessorSubjectsQuery } from '../../app/api/professorsApiSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, Trash, PlusCircle } from 'lucide-react';
import { addItemToArrayOnKey, deleteItemFromArray } from "../../utils/updateArray";
import ModalDelete from '../../components/ModalDelete/ModalDelete';
import Input from '../../components/Input/Input';
import Textarea from '../../components/Input/Textarea';
import MutationState from '../../components/MutationState/MutationState';
import CardContainer from '../../components/CardContainer/CardContainer';
import ListItem from '../../components/ListItem/ListItem';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';

const ProfessorsEdit = () => {
	const navigate = useNavigate();
  const session = useSelector(state => state.session);
  const inputRef = useRef(null);
  const { institution, id } = useParams();

  const [ 
    fetchEdit,
    {
      isLoading: isFetchEditLoading,
      isSuccess: isFetchEditSuccess,
			isError: isFetchEditError,
			error: fetchEditError
    }
   ] = useEditProfessorMutation();
   
  const [ 
    fetchDelete,
    {
      isLoading: isFetchDeleteLoading,
      isSuccess: isFetchDeleteSuccess,
			isError: isFetchDeleteError,
			error: fetchDeleteError
    }
   ] = useDeleteProfessorMutation();

  const [ open, setOpen ] = useState(false);
  const [ isSubmitting, setIsSubmitting ] = useState(false);
  const [ name, setName ] = useState('');
  const [ title, setTitle ] = useState('');
  const [ bachelor, setBachelor ] = useState({});
  const [ master, setMaster ] = useState({});
  const [ doctorate, setDoctorate ] = useState({});
  const [ education, setEducation ] = useState({});
  const [ bio, setBio ] = useState('');
  const [ referenceItem, setReferenceItem ] = useState('');
  const [ references, setReferences ] = useState([]);
  
  // maybe change this one to professor and assistent subjects
  const [ subjects, setSubjects ] = useState({});

  const {
    data: professorData,
    isLoading: isProfessorLoading,
    isSuccess: isProfessorSuccess,
    isError: isProfessorError,
    error: professorError
  } = useGetProfessorQuery({ institution, id }, {
    skip: !session.refreshToken
  });

  const {
    data: subjectsData,
    isSuccess: isSubjectsSuccess,
    isLoading: isSubjectsLoading,
    isError: isSubjectsError,
    error: subjectsError
  } = useGetProfessorSubjectsQuery({ institution, id }, {
    skip: !session.refreshToken || !institution || !id
  });

  const handleChangeEducation = (state, key, value) => {
    if(!state) {
      state = {}
    }
    let st = JSON.parse(JSON.stringify(state));
    st[key] = value;
    return st;
  }  
  
  const handleEditProfessor = async (event) => {
		event.preventDefault();
		event.stopPropagation();
    try {
      setIsSubmitting(true);
      const education = {
        bachelor: bachelor, master: master || {}, doctorate: doctorate || {}
      }

      const body = {
        name, title, education: education, bio, references
      }

      await fetchEdit({ institution, id, body });
    } catch (err) {
      console.log(err);
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleDeleteProfessor = async () => {
    try {
      setIsSubmitting(true);
      await fetchDelete({ institution, id });
			
			setTimeout(() => {
				navigate(`/institutions/${institution}/professors`);
			}, 1000);

    } catch (err) {
      console.log(err);
    } finally {
      setOpen(false);
      setIsSubmitting(false);
    }
  }

  const handleAddReference = (elem, key = 'Enter') => {
    const toAdd = addItemToArrayOnKey(references, elem, key, true);
    if(toAdd.changed) {
      setReferences(toAdd.result);
      setReferenceItem('');
    }
  }

  const handleDeleteReference = (index) => {
    let tempReferences = [ ...references ];
    const toDelete = deleteItemFromArray(tempReferences, index);
    if(toDelete) {
      setReferences(toDelete);
    }
  }

  let content;

  if(isSubjectsSuccess && !isProfessorLoading) {
    content = 
    <>
			<Breadcrumbs />
			<h1 className="text-xl font-bold py-5 text-center">{professorData.name}</h1>
      <div className="mb-4">
				<Input id="name" type="text" name="Ime i prezime" placeholder="Marko Marković" setVal={(elem) => setName(elem.target.value)} inputVal={name} />
			</div>

			<div className="mb-4">
				<Input id="title" type="text" name="Zvanje" placeholder="Prof. dr." setVal={(elem) => setTitle(elem.target.value)} inputVal={title} />
			</div>

			<div className="mb-4">
				<Textarea id="bio" name="Stručna biografija profesora" placeholder="Profesionalna biografija" setVal={(elem) => setBio(elem.target.value)} inputVal={bio} />
			</div>

			<div className="mb-4">
				<Input id="bachelor" type="text" name="Osnovne studije" placeholder="Prirodno-matematički fakultet, Univerzitet u Prištini" setVal={(elem) => setBachelor(handleChangeEducation(bachelor, 'institution', elem.target.value))} inputVal={bachelor?.institution}/>
				<div className="flex justify-center gap-3 w-full mt-2">
					<input className="input-primary" type="number" min={1970} placeholder="Od" onChange={(elem) => setBachelor(handleChangeEducation(bachelor, 'from', elem.target.value))} value={bachelor?.from} />
					<input className="input-primary" type="number" min={1970} placeholder="Do" onChange={(elem) => setBachelor(handleChangeEducation(bachelor, 'to', elem.target.value))} value={bachelor?.to} />
				</div>
			</div>
            
			<div className="mb-4">
				<Input id="master" type="text" name="Master studije" placeholder="Prirodno-matematički fakultet, Univerzitet u Prištini" setVal={(elem) => setMaster(handleChangeEducation(master, 'institution', elem.target.value))} inputVal={master?.institution}/>
				<div className="flex justify-center gap-3 w-full mt-2">
					<input className="input-primary" type="number" min={1970} placeholder="Od" onChange={(elem) => setBachelor(handleChangeEducation(master, 'from', elem.target.value))} value={master?.from} />
					<input className="input-primary" type="number" min={1970} placeholder="Do" onChange={(elem) => setBachelor(handleChangeEducation(master, 'to', elem.target.value))}  value={master?.to}/>
				</div>
			</div>

			<div className="mb-4">
				<Input id="doctorate" type="text" name="Master studije" placeholder="Prirodno-matematički fakultet, Univerzitet u Prištini" setVal={(elem) => setDoctorate(handleChangeEducation(doctorate, 'institution', elem.target.value))} inputVal={doctorate?.institution}/>
				<div className="flex justify-center gap-3 w-full mt-2">
					<input className="input-primary" type="number" min={1970} placeholder="Od" onChange={(elem) => setDoctorate(handleChangeEducation(doctorate, 'from', elem.target.value))} value={doctorate?.from} />
					<input className="input-primary" type="number" min={1970} placeholder="Do" onChange={(elem) => setDoctorate(handleChangeEducation(doctorate, 'to', elem.target.value))} value={doctorate?.to} />
				</div>
			</div>
      
			<label className="label-primary">Reference</label>
      <div className="w-full flex gap-1 mb-4">
        <input className="input-primary w-1/2 md:w-2/3 lg:w-3/4 xl:w-4/5" type="text" placeholder="Reference profesora (Enter za unos)" value={referenceItem} ref={inputRef} onChange={(elem) => setReferenceItem(elem.target.value)} />
        <button className="btn-plus" onClick={() => handleAddReference(inputRef.current, null)}><PlusCircle /></button>
      </div>

      {
				references.map((elem, i) => {
					return (
						<ListItem text={elem} index={i} deleteFunc={() => handleDeleteReference(i)}/>
					);
				})
      }

			<div className="w-full flex justify-between gap-4 mt-2">
        <button disabled={isSubmitting} className="w-full md:w-1/2 lg:w-1/3 flex items-center justify-center gap-2 btn-primary btn-red"  onClick={() => setOpen(true)}><Trash /> Obriši</button>
        <button disabled={isSubmitting} className="w-full md:w-1/2 lg:w-1/3 flex items-center justify-center gap-2 btn-primary btn-green " onClick={handleEditProfessor}><Save /> Sačuvaj izmene!</button>
      </div>
    </>
  }

  useEffect(() => {
    if(professorData) {
      setName(professorData.name);
      setTitle(professorData.title);
      setBachelor(professorData?.education?.bachelor || {});
      setMaster(professorData?.education?.master || {});
      setDoctorate(professorData?.education?.doctorate || {});
      setBio(professorData.bio);
      setReferences(professorData.references);
    }
    document.title = (professorData) ? `Uredjivanje profesora '${professorData.name}' | Rasporedar` : 'Uredjivanje profesora | Rasporedar';
  }, [ isProfessorSuccess ]);

  useEffect(() => {
    if(subjectsData) {
      setSubjects(subjectsData);
    }
  }, [ isSubjectsSuccess ]);
  
  return (
    <>
			<MutationState 
				isLoading={isFetchEditLoading || isFetchDeleteLoading}
				isSuccess={isFetchEditSuccess}
				isError={isFetchEditError}
				error={fetchEditError}
				successMessage='Profesor uspešno izmenjen!'
			/>
			<MutationState 
				isSuccess={isFetchDeleteSuccess}
				isError={isFetchDeleteError}
				error={fetchDeleteError}
				successMessage="Profesor uspešno obrisan!"

			/>

      { open ?
      <ModalDelete title={'Brisanje profesora'} text={`Obrisacete profesora '${professorData.name}'. Da li ste sigurni?`} closeFunc={() => setOpen(false)}>
        <button className="bg-gray-300 hover:bg-gray-500 p-2 rounded" onClick={() => setOpen(false)}>Ne, izadji</button>
        <button className="bg-red-300 hover:bg-red-500 p-2 rounded" onClick={handleDeleteProfessor}>Da, siguran sam!</button>
      </ModalDelete>
      : null }

      <CardContainer large={true} loaded={isSubjectsSuccess && !isProfessorLoading}>
				{ content }
      </CardContainer>
    </>
  )
}

export default ProfessorsEdit;