import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useDeleteSubjectMutation, useEditSubjectMutation, useGetSubjectProfessorsQuery, useGetSubjectQuery } from '../../app/api/subjectsApiSlice';
import ModalDelete from '../../components/ModalDelete/ModalDelete';
import { useGetProfessorsQuery } from '../../app/api/professorsApiSlice';
import { Save, Trash2 } from 'lucide-react';
import Input from '../../components/Input/Input';
import Textarea from '../../components/Input/Textarea';
import SelectComponent from '../../components/Input/SelectComponent';
import MutationState from '../../components/MutationState/MutationState';
import CardContainer from '../../components/CardContainer/CardContainer';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';

const SubjectsEdit = () => {
  const session = useSelector(state => state.session);
	const navigate = useNavigate();

  const { institution, id } = useParams();

  const [ 
		editSubject,
		{
			isLoading: isEditSubjectLoading,
			isSuccess: isEditSubjectSuccess,
			isError: isEditSubjectError,
			error: editSubjectError
		}
	 ] = useEditSubjectMutation();

  const [ 
		deleteSubject,
		{
			isLoading: isDeleteSubjectLoading,
			isSuccess: isDeteleSubjectSuccess,
			isError: isDeleteSubjectError,
			error: deleteSubjectError
		}
	 ] = useDeleteSubjectMutation();

  const [ open, setOpen ] = useState(false);
  const [ isSubmitting, setIsSubmitting ] = useState(false);

  const [ name, setName ] = useState('');
  const [ description, setDescription ] = useState('');
  const [ goal, setGoal ] = useState('');
  const [ result, setResult ] = useState('');
  const [ references, setReferences ] = useState([]);

  const [ professors, setProfessors ] = useState([]);
  const [ assistents, setAssistents ] = useState([]);

  const {
    data: subjectData,
    isSuccess: isSubjectSuccess,
    isLoading: isSubjectLoading,
    isError: isSubjectError,
    error: subjectError
  } = useGetSubjectQuery({ institution, id, fullInfo: 1 }, {
    skip: !session.refreshToken || !id,
  });

  const {
    data: professorsData,
    isSuccess: isProfessorsSuccess,
    isLoading: isProfessorsLoading,
  } = useGetProfessorsQuery(institution, {
    skip: !session.refreshToken || !id,
  });

  const {
    data: professorsSubjectData,
    isSuccess: isProfessorsSubjectSuccess,
    isLoading: isProfessorsSubjectLoading,
  } = useGetSubjectProfessorsQuery({ institution, id }, {
    skip: !session.refreshToken || !id,
  });
  
  const handleEditSubject =  async (event) => {
    event.preventDefault();
		event.stopPropagation();

		try {
      setIsSubmitting(true);
      const prof = professors.map(prof => prof.value);
      const ass = assistents.map(ass => ass.value);

      const body = {
        name, description, goal, result, references, 
        professors: prof,
        assistents: ass
      }

      await editSubject({ institution, id, body });

    } catch (err) {
      console.log(err);
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleDeleteSubject = async () => {
    try {
      setIsSubmitting(true);
      await deleteSubject({ institution, id });

			setTimeout(() => {
				navigate(`/institutions/${institution}/subjects`);
			}, 1000);

    } catch (err) {
      console.log(err);
    } finally {
      setOpen(false);
      setIsSubmitting(false);
    }
  }

  let content;

  if(isSubjectSuccess && isProfessorsSuccess && isProfessorsSubjectSuccess) {
    content = 
    <>
			<Breadcrumbs />
			<h1 className="text-xl font-bold text-center py-5">{ subjectData.name }</h1>
			<form onSubmit={handleEditSubject}>
				<div className="mb-4">
					<Input id="name" name="Naziv predmeta" placeholder="Web Programiranje" type="text" setVal={(elem) => setName(elem.target.value)} inputVal={name} />
				</div>
				<div className="mb-4">
					<Textarea id="description" name="Opis predmeta" placeholder="Unesite opis predmeta..." inputVal={description} setVal={(elem) => setDescription(elem.target.value)} />
				</div>
				<div className="mb-4">
					<Textarea id="goal" name="Cilj predmeta" placeholder="Unesite cilj predmeta" inputVal={goal} setVal={(elem) => setGoal(elem.target.value)} />
				</div>
				<div className="mb-4">
					<Textarea id="result" name="Rezultat predmeta" placeholder="Unesite rezultat predmeta" inputVal={result} setVal={(elem) => setResult(elem.target.value)} />
				</div>
								
				<div className="w-full mb-4">
					<label className="label-primary">Profesori</label>
					<SelectComponent data={professorsData.map((item) => ({
						value: item._id, label: item.name
						}))} 
						isMulti={true} 
						value={professors} 
						placeholder="Izaberite profesora"
						setVal={(e) => setProfessors(e)}
						required={true} 
					/>
				</div>

				<div className="w-full mb-4">
					<label className="label-primary">Asistenti</label>
					<SelectComponent data={professorsData.map((item) => ({
						value: item._id, label: item.name
						}))} 
						isMulti={true} 
						value={assistents} 
						placeholder="Izaberite asistenta"
						setVal={(e) => setAssistents(e)} 
					/>
				</div>
				
				
				<div className="w-full flex justify-between gap-4 mt-2">
					<button disabled={isSubmitting} className="w-full md:w-1/2 lg:w-1/3 flex items-center justify-center gap-2 btn-primary btn-red"  onClick={() => setOpen(true)}><Trash2 /> Obriši</button>
					<button disabled={isSubmitting} className="w-full md:w-1/2 lg:w-1/3 flex items-center justify-center gap-2 btn-primary btn-green " onClick={handleEditSubject}><Save /> Sačuvaj izmene!</button>
				</div>
			</form>
    </>
  } 

  useEffect(() => {
    if(subjectData) {
      setName(subjectData.name);
      setDescription(subjectData.description);
      setGoal(subjectData.goal);
      setResult(subjectData.result);
      setReferences(subjectData.references);
    }

    document.title = (subjectData) ? `Uredjivanje predmeta '${subjectData.name}' | Rasporedar` : `Uredjivanje predmeta | Rasporedar`;
  }, [ isSubjectSuccess, isSubjectLoading ]);

  
  useEffect(() => {
    if(professorsSubjectData) {
      setProfessors(professorsSubjectData.professors.map(prof => ({ value: prof._id, label: prof.name })));
      setAssistents(professorsSubjectData.assistents.map(prof => ({ value: prof._id, label: prof.name})));
		}
  }, [ isProfessorsSubjectSuccess ]);

  return (
    <>
			<MutationState 
				isLoading={isProfessorsLoading || isProfessorsSubjectLoading || isDeleteSubjectLoading || isEditSubjectLoading} 
				isError={isSubjectError}
				error={subjectError}
			/>
			<MutationState 
				isSuccess={isEditSubjectSuccess}
				isError={isEditSubjectError}
				error={editSubjectError}
				successMessage='Predmet uspešno izmenjen!'
			/>
			<MutationState 
				isSuccess={isDeteleSubjectSuccess}
				isError={isDeleteSubjectError}
				error={deleteSubjectError}
				successMessage='Predmet uspešno obrisan!'
			/>
      { open ? 
        <ModalDelete title={'Brisanje predmeta'} text={`Obrisacete predmet '${subjectData.name}'. Da li ste sigurni?`} closeFunc={() => setOpen(false)} >
          <button className="btn-primary bg-primary"onClick={() => setOpen(false)}><Save /> Odustani</button>
          <button className="btn-primary btn-red" onClick={handleDeleteSubject}><Trash2 /> Potvrdi</button>
        </ModalDelete>
      : null }
      <CardContainer large={true} loaded={isSubjectSuccess && isProfessorsSuccess} containerBgClass='bg-image-primary'>
      	{ content }
      </CardContainer>
    </>
  )
}

export default SubjectsEdit;