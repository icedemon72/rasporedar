import React from 'react';


const ScheduleScreenOne = ({
  setTitle, setSubtitle, setComment, setDepartment,
  isInstitutionLoading, isInstitutionSuccess, institutionData,
  setStyle, systemType, setSystemType, setValidUntil,
}) => {
  return (
    <>
      <label className="block text-gray-700 text-sm font-bold mb-2">Naslov rasporeda</label>
      <input className="input-field mb-4" placeholder="Unesite naslov..." onChange={(elem) => setTitle(elem.target.value)} />
      <label className="block text-gray-700 text-sm font-bold mb-2">Podnaslov rasporeda</label>
      <input className="input-field mb-4" placeholder="Unesite podnaslov..." onChange={(elem) => setSubtitle(elem.target.value)} />
      <label className="block text-gray-700 text-sm font-bold mb-2">Komentar nakon rasporeda</label>
      <input className="input-field mb-4" placeholder="Unesite komentar..." onChange={(elem) => setComment(elem.target.value)} />
      <select className="input-field mb-4" onChange={(elem) => setDepartment(elem.target.value)}>
        <option value="0">Izaberite { systemType === 'school' ? 'razred, odeljenje' : 'odsek, katedru' }</option>
        { isInstitutionLoading ? <>Loading...</> : null }
        { isInstitutionSuccess ? 
          institutionData.departments.map(dpt => <option value={ dpt }>{ dpt }</option>)
        : null }
      </select>
      <label className="block text-gray-700 text-sm font-bold mb-2">Stil rasporeda</label>
      <select className="input-field mb-4" onChange={(elem) => setStyle(elem.target.value)}>
        <option value="default">Podrazumevni stil</option>
        <option value="ice">Hladni stil</option>
      </select>
      <label className="block text-gray-700 text-sm font-bold mb-2">Tip rasporeda </label>
      <select className="input-field mb-4" onChange={(elem) => setSystemType(elem.target.value)}>
        <option value="school">Skolski</option>
        <option value="college">Fakultetski</option>
      </select>
      <label className="block text-gray-700 text-sm font-bold mb-2">Vazi do: </label>
      <input className="input-field" type="date" onChange={(elem) => setValidUntil(elem.target.value)} />
      <label className="block text-xs font-bold mb-4 text-gray-500">*Ostavite prazno ukoliko ne zelite da naznacite</label>
    </>
  )
}

export default ScheduleScreenOne;