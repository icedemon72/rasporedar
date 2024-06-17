import express from 'express';
import { handleAddSubject, handleDeleteSubject, handleEditSubjectInfo, handleGetAllSubjectsInInstitution, handleGetSubject } from '../controllers/subjectController.js';
import { handleGetAllProfessorsBySubject } from '../controllers/professorController.js';
import RouteGuard from '../middleware/routeGuard.js';
import { isAuthInInstitution, isInInstitution } from '../middleware/guards/institutionGuard.js';
import { validateSubject } from '../validators/subjectValidator.js';

const router = express.Router({ mergeParams: true });

router.route('/')
	.get(
		RouteGuard([{
			role: '*',
			when: isInInstitution
		}]),
		handleGetAllSubjectsInInstitution
	)

	.post(
		RouteGuard([{
			role: '*',
			when: isAuthInInstitution
		}]),
		validateSubject,
		handleAddSubject
	);

router.route('/:subject')
	.get(
		RouteGuard([{
			role: '*',
			when: isInInstitution
		}]),
		handleGetSubject
	)

	.patch(
		RouteGuard([{
			role: '*',
			when: isAuthInInstitution
		}]),
		validateSubject,
		handleEditSubjectInfo
	)
	.delete(
		RouteGuard([{
			role: '*',
			when: isAuthInInstitution
		}]),
		handleDeleteSubject
	);


router.get(
	'/:subject/professors',
	RouteGuard([{
		role: '*',
		when: isInInstitution
	}]), 
	handleGetAllProfessorsBySubject
);

export { router as subjectRouter };