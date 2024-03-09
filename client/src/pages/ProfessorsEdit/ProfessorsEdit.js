import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDeleteProfessorMutation, useEditProfessorMutation, useGetProfessorQuery, useGetProfessorSubjectsQuery } from '../../app/api/professorsApiSlice';
import { useParams } from 'react-router-dom';
import { Save, Trash, PlusCircle } from 'lucide-react';
import { addItemToArrayOnKey, deleteItemFromArray } from "../../utils/updateArray";
import ModalDelete from '../../components/ModalDelete/ModalDelete';

const ProfessorsEdit = () => {
  const session = useSelector(state => state.session);
  const inputRef = useRef(null);
  const { institution, id } = useParams();

  const [ 
    fetchEdit,
    {
      isLoading: isFetchEditLoading,
      isSuccess: isFetchEditSuccess
    }
   ] = useEditProfessorMutation();
   
  const [ 
    fetchDelete,
    {
      isLoading: isFetchDeleteLoading,
      isSuccess: isFetchDeleteSuccess
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
  } = useGetProfessorQuery(id, {
    skip: !session.accessToken
  });

  const {
    data: subjectsData,
    isSuccess: isSubjectsSuccess,
    isLoading: isSubjectsLoading,
    isError: isSubjectsError,
    error: subjectsError
  } = useGetProfessorSubjectsQuery(id, {
    skip: !session.accessToken || !institution || !id
  });

  const handleChangeEducation = (state, key, value) => {
    if(!state) {
      state = {}
    }
    let st = JSON.parse(JSON.stringify(state));
    st[key] = value;
    return st;
  }  
  
  const handleEditProfessor = async () => {
    try {
      setIsSubmitting(true);
      const education = {
        bachelor: bachelor, master: master || {}, doctorate: doctorate || {}
      }

      const body = {
        name, title, education: education, bio, references
      }

      const result = await fetchEdit({id: id, body: body});
    } catch (err) {
      console.log(err);
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleDeleteProfessor = async () => {
    try {
      setIsSubmitting(true);
      const result = await fetchDelete(id);
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
      <input className="input-field mb-4"  type="text" value={name} placeholder="Unesite ime i prezime profesora" onChange={(elem) => setName(elem.target.value)} />
      <input className="input-field mb-4" type="text" value={title} placeholder="Unesite zvanje profesora" onChange={(elem) => setTitle(elem.target.value)} />
      <textarea className="input-field mb-4" type="text" value={bio} placeholder="Unesite biografiju profesora" onChange={(elem) => setBio(elem.target.value)}></textarea>
      <input className="input-field mb-4"  type="text" value={bachelor?.institution} placeholder="Unesite OAS" onChange={(elem) => setBachelor(handleChangeEducation(bachelor, 'institution', elem.target.value))} />
      <div className="flex justify-center gap-3 w-full">
        <input className="input-field mb-4 w-full md:w-1/2" type="text" value={bachelor?.from} placeholder="Od" onChange={(elem) => setBachelor(handleChangeEducation(bachelor, 'from', elem.target.value))} />
        <input className="input-field mb-4 w-full md:w-1/2" type="text" value={bachelor?.to} placeholder="Do" onChange={(elem) => setBachelor(handleChangeEducation(bachelor, 'to', elem.target.value))} />
      </div>
      
      <input className="input-field mb-4" type="text" value={master?.institution} placeholder="Unesite MAS" onChange={(elem) => setMaster(handleChangeEducation(master, 'institution', elem.target.value))} />
      <div className="flex justify-center gap-3 w-full">
        <input className="input-field mb-4 w-full md:w-1/2" type="text" value={master?.from} placeholder="Od" onChange={(elem) => setMaster(handleChangeEducation(master, 'from', elem.target.value))} />
        <input className="input-field mb-4 w-full md:w-1/2" type="text" value={master?.to} placeholder="Do" onChange={(elem) => setMaster(handleChangeEducation(master, 'to', elem.target.value))} />
      </div>
      
      <input className="input-field mb-4" type="text" value={doctorate?.institution} placeholder="Unesite DAS" onChange={(elem) => setDoctorate(handleChangeEducation(doctorate, 'institution', elem.target.value))} />
      <div className="flex justify-center gap-3 w-full">
        <input className="input-field mb-4 w-full md:w-1/2" type="text" value={doctorate?.from} placeholder="Od" onChange={(elem) => setDoctorate(handleChangeEducation(doctorate, 'from', elem.target.value))} />
        <input className="input-field mb-4 w-full md:w-1/2" type="text" value={doctorate?.to} placeholder="Do" onChange={(elem) => setDoctorate(handleChangeEducation(doctorate, 'to', elem.target.value))} />
      </div>
      
      <div className="w-full flex mb-4">
        <input className="input-field w-1/2 md:w-2/3 lg:w-3/4 xl:w-4/5" type="text" placeholder="Reference profesora (Enter za unos)" value={referenceItem} ref={inputRef} onChange={(elem) => setReferenceItem(elem.target.value)} />
        <button className="input-field w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 text-gray-700 leading-tight focus:outline-none focus:shadow-outline flex justify-center" onClick={() => handleAddReference(inputRef.current, null)}><PlusCircle /></button>
      </div>

      { references.map((elem, i) => {
        return (
          <div class="flex flex-row justify-between mt-2">
            <div>{i + 1}</div>
            <p>{elem}</p>
            <div class="flex justify-center cursor-pointer hover:bg-red-200 text-red-500 rounded-sm" onClick={() => handleDeleteReference(i)}><Trash /></div> 
          </div>
        );
      })
      }
      <div className="w-full flex justify-center mt-3">
        <button disabled={isSubmitting} className="flex w-full md:w-1/2 lg:w-1/3 btn-green rounded justify-center" onClick={handleEditProfessor}><Save /> Sacuvaj izmene!</button>
      </div>
      <div className="w-full  flex justify-center mt-3">
        <button disabled={isSubmitting} className="flex w-full md:w-1/2 lg:w-1/3 btn-red rounded justify-center"  onClick={() => setOpen(true)}><Trash /> Obrisi</button>
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
      { open ?
      <ModalDelete title={'Brisanje profesora'} text={`Obrisacete profesora '${professorData.name}'. Da li ste sigurni?`} closeFunc={() => setOpen(false)}>
        <button className="bg-gray-300 hover:bg-gray-500 p-2 rounded" onClick={() => setOpen(false)}>Ne, izadji</button>
        <button className="bg-red-300 hover:bg-red-500 p-2 rounded" onClick={handleDeleteProfessor}>Da, siguran sam!</button>
      </ModalDelete>
      : null }
      <div className="w-full flex justify-center">
        <div className="w-full md:w-1/2 lg:w-1/3 mt-5">
          { content }
          { isFetchDeleteLoading || isFetchEditLoading ? <>Loading...</> : null }
          { isFetchEditSuccess ? <>Uspesna izmena profesora!</> : null }
          { isFetchDeleteSuccess ? <>Uspesno brisanje profesora!</> : null }
        </div>
      </div>
    </>
  )
}

export default ProfessorsEdit;