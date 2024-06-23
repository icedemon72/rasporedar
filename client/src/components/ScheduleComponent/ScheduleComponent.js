import { Clock } from 'lucide-react';
import ScheduleRow from './ScheduleRow';
import clsx from 'clsx';
import { scheduleCustomStyles } from '../../models/ScheduleStyles';
/* change this to be editable and stuff */

const ScheduleComponent = ({
  editable = false, ...props
}) => {
	
  return (
    <>
      <div className={clsx("w-full flex justify-between box-shadow border-2 border-black rounded mb-4 p-2 text-black", scheduleCustomStyles[props.style.value].background)}>
        <div className="w-full flex justify-center items-center gap-2">
          <Clock size={16} /> Termin
        </div>
        {
          props.days.map(day => {
            return (
              <>
                <div className="w-full text-center">{ day }</div>
              </>
            )
          })
        }
      </div>
                    
      <div className="w-full text-black">
				
        {
          props.rows.map((item, groupIndex) => {
            return (
              <>
								<div className="box-shadow border-2 border-black rounded mb-5">
									<>
										{
											item.data[0].map((_, index) => {
												return (
													<>
														{ index === 0 && props.groups.length !== 1 ? <div className={clsx("w-full text-xl font-bold text-center py-2", scheduleCustomStyles[props.style.value].titleBackground)}>{ props.groups[groupIndex] }</div> : null }
														
														<ScheduleRow 
															{...props} 
															groupIndex={groupIndex}
															editable={editable} 
															item={item}
															index={index}
														/>                        
													</>
												)
											})
											
										}
										{
											editable &&
											<>
												<div className="bg-primary flex gap-2 justify-between items-center mt-4 p-2">
													<div data-tooltip-id="my-tooltip" data-tooltip-content={`Obriši poslednju vrstu`} className="btn-primary w-full btn-red md:w-1/2 lg:w-1/3 xl:w-1/4 text-center cursor-pointer" onClick={() => props.handleDeleteItem(groupIndex)}>-</div>
													<div  data-tooltip-id="my-tooltip" data-tooltip-content={`Dodaj novu vrstu`} className="btn-primary btn-green w-full md:w-1/2 lg:w-1/3 xl:w-1/4 text-center cursor-pointer" onClick={() => props.handleAddItem(groupIndex)}>+</div>
												</div>
											</> 
										}
									
									</>
									
								</div>
              </> 
            )
          })
        }
      </div>
    </>
  )
}

export default ScheduleComponent;