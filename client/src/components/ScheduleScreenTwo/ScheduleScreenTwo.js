import { useEffect } from 'react';
import ScheduleComponent from '../ScheduleComponent/ScheduleComponent';

const ScheduleScreenTwo = ({ ...props }) => {
	useEffect(() => {
		window.onbeforeunload = () => true;
		return () => {
			window.onbeforeunload = null;
		};
	}, []);
  return (
    <>
			<div className="relative overflow-x-auto">
				<div className="w-full mt-5 p-2 rounded min-w-[1000px]">
					<ScheduleComponent editable={true} { ...props }/>
				</div>
			</div>
    </>
  )
}

export default ScheduleScreenTwo;