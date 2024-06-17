import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetProfessorsQuery } from '../../app/api/professorsApiSlice';
import { useAddSubjectMutation } from '../../app/api/subjectsApiSlice';
import { Helmet } from 'react-helmet';
import Input from '../../components/Input/Input';
import Textarea from '../../components/Input/Textarea';
import SelectComponent from '../../components/Input/SelectComponent';
import MutationState from '../../components/MutationState/MutationState';
import CardContainer from '../../components/CardContainer/CardContainer';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';

/* ADD ASS functionality!!!! */
const SubjectsAdd = () => {
	const navigate = useNavigate();
  const session = useSelector(state => state.session);
  const { institution } = useParams();


  const {
    data,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetProfessorsQuery(institution, {
    skip: !session.refreshToken || !institution
  });

  const [ 
		addSubject,
		{
			isLoading: isAddSubjectLoading,
			isSuccess: isAddSubjectSuccess,
			isError: isAddSubjectError,
			error: addSubjectError
		}
	 ] = useAddSubjectMutation();

  const [ professors, setProfessors ] = useState([]);
  const [ assistents, setAssistents ] = useState([]);
  const [ name, setName ] = useState('');
  const [ description, setDescription] = useState('');
  const [ goal, setGoal ] = useState('');
  const [ subjResult, setResult ] = useState('');
  const [ references, setReferences] = useState([]);
  
  const handleAddSubject = async (event) => {
		event.preventDefault();
    event.stopPropagation();
		
		// add input check here!!!
    try {
			const prof = professors.map((prof) => prof.value);
			const ass = assistents.map((prof) => prof.value);
      const body = {
        professors: prof,
        assistents: ass,
        name,
        description,
        goal,
        references,
        result: subjResult
      }

      const result = await addSubject({institution, body}).unwrap();

			setTimeout(() => {
				navigate(`/institutions/${institution}/subjects/${result._id}`);
			}, 1000);

    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
			<Helmet>
				<title>Dodaj predmet | Rasporedar</title>
			</Helmet>

			<MutationState 
				isLoading={isLoading || isAddSubjectLoading}
				isError={isError}
				error={error}
			/>

			<MutationState 
				isSuccess={isAddSubjectSuccess}
				isError={isAddSubjectError}
				error={addSubjectError}
				successMessage='Predmet uspešno dodat!'
			/>

      {
				isSuccess &&
				<>
					<CardContainer large={true}>
						<Breadcrumbs />
						<h1 className="text-xl font-bold text-center py-5">Dodaj predmet</h1>
						<form onSubmit={handleAddSubject}>
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
								<Textarea id="result" name="Rezultat predmeta" placeholder="Unesite rezultat predmeta" inputVal={subjResult} setVal={(elem) => setResult(elem.target.value)} />
							</div>

							<div className="w-full mb-4">
								<label className="label-primary">Profesori</label>
								<SelectComponent data={data.map((item) => ({
									value: item._id, label: item.name
									}))} 
									isMulti={true} 
									placeholder="Izaberite profesore"
									setVal={(e) => setProfessors(e)}
									value={professors}
									required={true} 
								/>
							</div>

							<div className="w-full mb-6">
								<label className="label-primary">Asistenti</label>
								<SelectComponent data={data.map((item) => ({
									value: item._id, label: item.name
									}))} 
									isMulti={true} 
									placeholder="Izaberite asistente"
									value={assistents}
									setVal={(e) => setAssistents(e)} 
								/>
							</div>      
								
							<div className="flex justify-end">
							<button className="w-full md:w-1/2 lg:w-1/3 btn-primary btn-green">Sačuvaj predmet</button>
							</div>
						</form>
					</CardContainer>
				</>
			} 
        
    </>
  )
}

export default SubjectsAdd;