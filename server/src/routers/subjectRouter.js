import express from 'express';
import { handleAddSubject, handleDeleteSubject, handleEditSubjectInfo, handleGetAllSubjectsInInstitution, handleGetSubject } from '../controllers/subjectController.js';
import { handleGetAllProfessorsBySubject } from '../controllers/professorController.js';

const router = express.Router({ mergeParams: true });

router.post('/', handleAddSubject);

router.get('/', handleGetAllSubjectsInInstitution);

router.get('/:subject', handleGetSubject);

router.delete('/:subject', handleDeleteSubject);

router.patch('/:subject', handleEditSubjectInfo);

router.get('/:subject/professors', handleGetAllProfessorsBySubject);

export { router as subjectRouter };