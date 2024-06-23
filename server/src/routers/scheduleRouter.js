import express from 'express';
import { handleAddSchedule, handleCheckSchedule, handleDeleteSchedule, handleEditSchedule, handleGetAllSchedulesInInstitution, handleGetSchedule } from '../controllers/scheduleController.js';
import { isAuthInInstitution, isInInstitution } from '../middleware/guards/institutionGuard.js';
import RouteGuard from '../middleware/routeGuard.js';
import { validateSchedule } from '../validators/scheduleValidator.js';

const router = express.Router({ mergeParams: true });

router.route('/')
	.get(
		RouteGuard([{
			role: '*',
			when: isInInstitution
		}]),
		handleGetAllSchedulesInInstitution
	)
	
	.post(
		RouteGuard([{
			role: '*',
			when: isAuthInInstitution
		}]),
		handleAddSchedule
	)

router.post(
	'/check',
	RouteGuard([{
		role: '*',
		when: isAuthInInstitution
	}]),
	handleCheckSchedule,
);

router.route('/:schedule')
	.get(
		RouteGuard([{
			role: '*',
			when: isInInstitution
		}]),
		handleGetSchedule
	)

	.patch(
		RouteGuard([{
			role: '*',
			when: isAuthInInstitution
		}]),
		validateSchedule,
		handleEditSchedule
	)

	.delete(
		RouteGuard([{
			role: '*',
			when: isAuthInInstitution
		}]),
		handleDeleteSchedule
	);
export { router as scheduleRouter };