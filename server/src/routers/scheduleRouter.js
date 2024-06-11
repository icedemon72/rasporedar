import express from 'express';
import { handleAddSchedule, handleDeleteSchedule, handleEditSchedule, handleGetAllSchedulesInInstitution, handleGetSchedule } from '../controllers/scheduleController.js';

const router = express.Router({ mergeParams: true });

router.post('/', handleAddSchedule);

router.get('/', handleGetAllSchedulesInInstitution);

router.get('/:schedule', handleGetSchedule);

router.patch('/:schedule', handleEditSchedule);

router.delete('/:schedule', handleDeleteSchedule);

export { router as scheduleRouter };