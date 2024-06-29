import express from 'express';
import { handleAddInstitution, handleChangeCodes, handleDeleteInstitution, handleEditInstitution, handleGetInstitutonById } from '../controllers/institutionController.js';
import { handleGetAllUsersInInstitution, handleGetIsUserAuth, handleGetUserRole, handleLeaveInstitution, handleModeratorJoinInstitution, handlePromoteToRole, handleUserJoinInstitution } from '../controllers/inInstitutionController.js';
import { validateInstitution, validateRoleChange } from '../validators/institutionValidator.js';
import RouteGuard from '../middleware/routeGuard.js';
import { isInInstitution, isOwnerInInstitution } from '../middleware/guards/institutionGuard.js';

const router = express.Router({ mergeParams: true });

router.post(
	'/',
	validateInstitution,
	handleAddInstitution
);

router.post('/join', handleUserJoinInstitution);

router.post('/join_moderator', handleModeratorJoinInstitution);

router.get('/:institution/role', handleGetUserRole);

router.patch(
	'/role/users/:user', 
	RouteGuard([{
		role: '*',
		when: isOwnerInInstitution,
	}]),
	validateRoleChange,	
	handlePromoteToRole
);

router.get(
	'/:institution/users', 
	RouteGuard([{
		role: '*',
		when: isInInstitution,
	}]),
	handleGetAllUsersInInstitution
);

router.patch('/:institution/change_code', handleChangeCodes);

router.post(
	'/:institution/leave',
	RouteGuard([{
		role: '*',
		when: isInInstitution,
	}]),
	handleLeaveInstitution
);

router.get('/:institution/auth', handleGetIsUserAuth);

router.route('/:institution')
	.get(handleGetInstitutonById)
	.delete(handleDeleteInstitution)
	.patch(
		validateInstitution,
		handleEditInstitution
	)


export { router as institutionRouter };