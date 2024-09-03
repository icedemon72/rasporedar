import express from 'express';
import { handleAddProfessor, handleDeleteProfessor, handleEditProfessor, handleGetAllProfessorsInInstitution, handleGetProfessor } from '../controllers/professorController.js';
import { validateProfessor } from '../validators/professorValidator.js';
import { handleGetAllSubjectsOfProfessor } from '../controllers/subjectController.js';
import { isAuthInInstitution, isInInstitution } from '../middleware/guards/institutionGuard.js';
import RouteGuard from '../middleware/routeGuard.js';

const router = express.Router({ mergeParams: true });

router.route('/')
	.get(
		RouteGuard([{
			role: '*',
			when: isInInstitution
		}]),	
		handleGetAllProfessorsInInstitution
	)
	
	.post(
		RouteGuard([{
			role: '*',
			when: isAuthInInstitution
		}]),
		validateProfessor, 
		handleAddProfessor
	)

router.route('/:professor')
	.get(
		RouteGuard([{
			role: '*',
			when: isInInstitution
		}]),
		handleGetProfessor
	)

	.delete(
		RouteGuard([{
			role: '*',
			when: isAuthInInstitution
		}]),
		handleDeleteProfessor
	)

	.patch(
		RouteGuard([{
			role: '*',
			when: isAuthInInstitution
		}]),
		validateProfessor, 
		handleEditProfessor
	);

router.get(
	'/:professor/subjects',
	RouteGuard([{
		role: '*',
		when: isInInstitution
	}]),
	handleGetAllSubjectsOfProfessor
);

export { router as professorRouter };