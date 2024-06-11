import express from 'express';
import { handleAddProfessor, handleDeleteProfessor, handleEditProfessor, handleGetAllProfessorsInInstitution, handleGetProfessor } from '../controllers/professorController.js';
import { validateProfessorAdd } from '../validators/professorValidator.js';
import { handleGetAllSubjectsOfProfessor } from '../controllers/subjectController.js';

const router = express.Router({ mergeParams: true });

router.post('/', validateProfessorAdd, handleAddProfessor);

router.get('/', handleGetAllProfessorsInInstitution);

router.get('/:professor', handleGetProfessor);

router.delete('/:professor', handleDeleteProfessor);

router.patch('/:professor', handleEditProfessor);

router.get('/:professor/subjects', handleGetAllSubjectsOfProfessor);

export { router as professorRouter };