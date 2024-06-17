import { addSchedule, deleteSchedule, editSchedule, getAllSchedulesInInstitution, getSchedule } from '../services/scheduleService.js';
import { isObjectIdValid } from '../utils/utils.js';

export const handleAddSchedule = async (req, res) => {
  try {
    const done = await addSchedule(req.userTokenData._id, req.params.institution, req.body);
    
		return res.status(200).send(done);
  } catch (err) {
    return res.status(err.status || 500).send({ message: err.message });
  }
}

export const handleEditSchedule = async (req, res) => {
  try {
    const done = await editSchedule(req.userTokenData._id, req.params.institution, req.params.schedule, req.body);
    
		return res.status(200).send(done);
  } catch (err) {
    return res.status(err.status || 500).send({ message: err.message });
  }
}

export const handleDeleteSchedule = async (req, res) => {
  try {
    const done = await deleteSchedule(req.userTokenData._id, req.params.institution, req.params.schedule);
    
    return res.status(204).send(done);
  } catch (err) {
    return res.status(err.status || 500).send({ message: err.message });
  }
}

// export const handlePublishSchedule = async (req, res) => {
//   try {
    
//   } catch (err) {
//     return res.status(err.status || 500).send({ message: err.message });
//   }
// }

export const handleGetAllSchedulesInInstitution = async (req, res) => {
  try {
    if(!req.query.active) {
      req.query.active = true;
    }

    const done = await getAllSchedulesInInstitution(req.userTokenData._id, req.params.institution, req.query.active);
    
		return res.status(200).send(done);
  } catch (err) {
    return res.status(err.status || 500).send({ message: err.message });
  }
}

export const handleGetSchedule = async (req, res) => {
  try {
    const done = await getSchedule(req.userTokenData._id, req.params.institution, req.params.schedule);
    
		return res.status(200).send(done);
  } catch (err) {
    return res.status(err.status || 500).send({ message: err.message });
  }
}