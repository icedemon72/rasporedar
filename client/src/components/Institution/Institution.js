import { CalendarFold, CircleUserRound, Crown, GraduationCap, LibraryBig, Shield } from "lucide-react";
import { Link } from 'react-router-dom';

const Institution = ({ institution }) => {
	return (
		<div className="min-w-full min-h-full overflow-hidden border-2 border-black bg-secondary">
			<Link to={`/institutions/${institution._id}`}>
				<div className="font-black text-xl hover:underline truncate bg-red-500 py-4 px-2">
					{institution.name}
				</div>
				<div className="px-6 py-4">
					<div className="flex justify-between">
						<div className="flex gap-2 items-center">
							<Link data-tooltip-id="my-tooltip" data-tooltip-content="Rasporedi" className="p-1 border-2 border-black hover:box-shadow bg-primary" to={`/institutions/${institution._id}/schedules/`}>
								<CalendarFold />
							</Link>
							<Link data-tooltip-id="my-tooltip" data-tooltip-content="Profesori" className="p-1 border-2 border-black hover:box-shadow bg-primary" to={`/institutions/${institution._id}/professors/`}>
								<GraduationCap />
							</Link>
							<Link data-tooltip-id="my-tooltip" data-tooltip-content="Predmeti" className="p-1 border-2 border-black hover:box-shadow bg-primary" to={`/institutions/${institution._id}/subjects/`}>
								<LibraryBig />
							</Link>
						</div>
						<div className="flex items-center" data-tooltip-id="my-tooltip" data-tooltip-content={`${institution.role === 'Owner' ? 'Vlasnik' : institution.role === 'Moderator' ? 'Moderator' : 'Korisnik'}`} >
							{institution.role === 'Owner' ? <Crown color="green" /> : institution.role === 'Moderator' ? <Shield /> : <CircleUserRound />}
						</div>
					</div>
				</div>
			</Link>
		</div>
	);
}

export default Institution;