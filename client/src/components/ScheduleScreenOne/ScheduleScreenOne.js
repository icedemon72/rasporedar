import { useRef, useState } from 'react';
import { addItemToArrayOnKey, deleteItemFromArray } from '../../utils/updateArray';
import { Trash, PlusCircle } from 'lucide-react';
import ModalDelete from '../ModalDelete/ModalDelete';
import Input from '../Input/Input';
import SelectComponent from '../Input/SelectComponent';
import { frequencyTypes, scheduleStyles, scheduleTypes } from '../../models/SelectModels';
import ListItem from '../ListItem/ListItem';

const ScheduleScreenOne = ({
  setTitle, setSubtitle, setComment, setDepartment,
  isInstitutionLoading, isInstitutionSuccess, institutionData,
  setStyle, systemType, setSystemType, setValidFrom, setValidUntil, groups, setGroups,
  handleDeleteGroup, setFrequency, ...props
}) => {

  // const [ groupsArray, setGroupsArray ] = useState(groups || ['Grupa 1']);
  const [ group, setGroup ] = useState('');
  const [ added, setAdded ] = useState(false);
  const [ clickedIndex, setClickedIndex ] = useState(null);
  const [ isDeleteGroupOpen, setIsDeleteGroupOpen ] = useState(false);
  const inputRef = useRef(null);

  const handleAddGroup = (elem, key = 'Enter') => {
    const toAdd = addItemToArrayOnKey(groups, elem, key, true);

    if(!added && groups.length === 1) {
      if(elem.key === 'Enter' || !elem.key) {
        setGroups(prev => [ group ]);
        setGroup('');
        setAdded(true);
      }
    } else if(toAdd.changed) {
      setGroup(prev => prev = '');
      setGroups(toAdd.result);
      setGroup('');
      setAdded(false);
    }
  }

  const handleOpenModal = (index) => {
    setClickedIndex(index);
    setIsDeleteGroupOpen(true);
  }

  const handleDeleteGroupFunc = () => {
    handleDeleteGroup(clickedIndex);
    setClickedIndex(null);
    setIsDeleteGroupOpen(false);
  }
	  return (
    <>
			{ 
				isInstitutionSuccess && 
				<>

					<h1 className="text-center text-xl font-bold py-5">{ !props.edit ? 'Novi raspored' : 'Uredjivanje rasporeda'}</h1>
					<div className="mb-4">
						<Input id="title" type="text" name="Naslov rasporeda" inputVal={props.title} setVal={(elem) => setTitle(elem.target.value)} placeholder="Raspored predavanja i vežbi" />
					</div>

					<div className="mb-4">
						<Input id="subtitle" type="text" name="Podnaslov rasporeda" inputVal={props.subtitle} setVal={(elem) => setSubtitle(elem.target.value)} placeholder="Raspored na odseku za informatiku u letnjem semestru 2023/24" />
					</div>

					<div className="mb-4">
						<Input id="comment" type="text" name="Komentar nakon rasporeda" inputVal={props.comment} setVal={(elem) => setComment(elem.target.value)} placeholder="Nastava po ovom rasporedu održavaće se svake dve nedelje" />
					</div>

					<div className="mb-4">
						<label className="label-primary">Odsek, razred, odeljenje...</label>
						<SelectComponent data={institutionData.departments.map((item) => ({
							value: item, label: item
							}))} 
							placeholder={`Izaberite ${systemType.value === 'school' ? 'razred, odeljenje' : 'odsek, katedru'}`}
							value={props.department}
							setVal={(e) => setDepartment(e)}
							required={true} 
							isClearable={false}
						/>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
						<div className="col-span-1">
							<label className="label-primary">Tip rasporeda</label>
							<SelectComponent data={scheduleTypes}
								placeholder={`Izaberite tip rasporeda`}
								value={systemType}
								setVal={(e) => setSystemType(e)}
								required={true} 
								isClearable={false}
							/>
						</div>
						<div className="col-span-1">
							<label className="label-primary">Stil rasporeda</label>
							<SelectComponent 
								data={scheduleStyles} 
								value={props.style}
								setVal={(e) => setStyle(e)}
								required={true} 
								isClearable={false}
								placeholder="Izaberite stil rasporeda"
							/>
						</div>
					</div>

					{ added || groups.length > 1 ? 
						groups.map((gr, i) => <>
							<ListItem text={gr} index={i} deleteFunc={() => handleOpenModal(i)}/>
							
						</>)
					: null }

					<div className="mb-4">
						<label htmlFor="groups" className="label-primary">Grupe</label>
						<div className="w-full flex mb-4 gap-1">
							<input id="groups" className="input-primary w-1/2 md:w-2/3 lg:w-3/4 xl:w-4/5" type="text" onChange={(elem) => setGroup(elem.target.value)} ref={inputRef} value={group} onKeyUp={(elem) => handleAddGroup(elem)} placeholder="Unesite godine, razrede, odeljenja..."/>
							<button className="input-primary w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 btn-plus" aria-label="Dodaj grupu" onClick={() => handleAddGroup(inputRef.current, null)}><PlusCircle /></button>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2 mb-4">
						<div className="col-span-1">
							<label htmlFor="date" className="label-primary">Važi od </label>
							<input id="date" className="input-primary" type="date" onChange={(elem) => setValidFrom(elem.target.value)} value={props.validFrom} />
							<span className="block text-xs font-bold text-muted">*Ukoliko ostavite prazno, važiće od trenutka čuvanja</span>
						</div>
						<div className="col-span-1">
							<label htmlFor="date" className="label-primary">Važi do </label>
							<input id="date" className="input-primary" type="date" onChange={(elem) => setValidUntil(elem.target.value)} value={props.validUntil} />
							<span className="block text-xs font-bold text-muted">*Ostavite prazno ukoliko ne želite da naznačite</span>
						</div>
						<div className="col-span-full xl:col-span-1 ">
							<label className="label-primary">Važi (na)</label>
							<SelectComponent 
								data={frequencyTypes} 
								value={props.frequency}
								setVal={(e) => setFrequency(e)}
								required={true} 
								isClearable={false}
								placeholder="Izaberite na koliko će raspored važiti"
							/>
					</div>
					</div>

				
				</>
			}

      { isDeleteGroupOpen ? 
        <ModalDelete title={'Brisanje grupe'} text={`Obrisaćete grupu '${groups[clickedIndex]}' i sve informacije o njoj (predmete u rasporedu, termine itd.). Da li ste sigurni?`} closeFunc={() => setIsDeleteGroupOpen(false)}>
          <button className="btn-primary bg-primary" onClick={() => setIsDeleteGroupOpen(false)}>Odustani</button>
          <button className="btn-primary btn-red" onClick={handleDeleteGroupFunc}>Potvrdi</button>
        </ModalDelete>
        : null
      }
    </>
  )
}

export default ScheduleScreenOne;