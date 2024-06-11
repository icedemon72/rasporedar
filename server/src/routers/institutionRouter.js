import express from 'express';
import { handleAddInstitution, handleChangeCodes, handleDeleteInstitution, handleEditInstitution, handleGetInstitutonById } from '../controllers/institutionController.js';
import { handleGetAllUsersInInstitution, handleGetIsUserAuth, handleGetUserRole, handleLeaveInstitution, handleModeratorJoinInstitution, handlePromoteToRole, handleUserJoinInstitution } from '../controllers/inInstitutionController.js';

const router = express.Router({ mergeParams: true });

router.post('/', handleAddInstitution);

router.post('/join', handleUserJoinInstitution);

router.post('/join_moderator', handleModeratorJoinInstitution);

router.get('/:institution/role', handleGetUserRole);

router.patch('/role/users/:user', handlePromoteToRole);

router.patch('/:institution/users', handleGetAllUsersInInstitution);

router.patch('/:institution/change_code', handleChangeCodes);

router.post('/:institution/leave', handleLeaveInstitution);

router.get('/:institution/auth', handleGetIsUserAuth);

router.get('/:institution', handleGetInstitutonById);

router.delete('/:institution', handleDeleteInstitution);

router.patch('/:institution', handleEditInstitution);

export { router as institutionRouter };