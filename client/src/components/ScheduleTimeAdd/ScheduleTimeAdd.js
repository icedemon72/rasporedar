import { useState } from 'react'

const ScheduleTimeAdd = ({
  indexes, closeFunc, submitFunc
}) => {
  const [ startTime, setStartTime ] = useState('');
  const [ endTime, setEndTime ] = useState('');

  const handleAdd = () => {
    if(startTime && endTime) {
      if(startTime > endTime) {
        // add error
      } else {
        submitFunc(startTime, endTime);
      }
    }
  }

  
  return (
    <>
      <div className="fixed left-0 top-0 z-[1054] h-full w-full overflow-y-auto overflow-x-outline-none bg-black bg-opacity-80 flex justify-center items-center" >
        <div className="fixed left-0 top-0 h-full w-full z-[1055]" onClick={closeFunc} ></div>
        <div className="min-w-[400px] min-h-[500px] z-[1056] bg-secondary rounded-md py-8 px-16 flex flex-col justify-around">
          <h1 className="label-primary">{ indexes.i + 1}. čas</h1>
          <div>
            <label className="label-primary  mb-2">Termin</label>
            <div className="flex items-center w-full gap-3">
              <div className="flex-col basis-1/2">
                <label className="label-primary text-xs uppercase">Od</label>
                <input type="time" className="input-primary" step="3600" min="00:00" max="23:59" pattern="[0-2][0-9]:[0-5][0-9]" onChange={(elem) => setStartTime(elem.target.value)}/>
              </div>
              <div className="flex-col basis-1/2">
                <label className="label-primary text-xs uppercase">Do</label>
                <input type="time" className="input-primary basis-1/2" step="3600" min="00:00" max="23:59" pattern="[0-2][0-9]:[0-5][0-9]" onChange={(elem) => setEndTime(elem.target.value)}/>
              </div>
            </div>
            <span className="text-xs block text-slate-500 mt-2">*AM = prepodne, PM = poslepodne</span>
            <span className="text-xs block text-slate-500">(08:00PM = 20:00)</span>         
          </div>
          <div className="flex w-full gap-5 mt-5">
            <div className="btn-primary btn-red text-center cursor-pointer w-full" onClick={closeFunc}>Otkaži</div>
            <div className="btn-primary btn-green text-center cursor-pointer w-full" onClick={handleAdd}>Dodaj termin</div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ScheduleTimeAdd;