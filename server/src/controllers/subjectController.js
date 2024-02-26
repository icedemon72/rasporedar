import { addSubject, deleteSubject, editSubjectInfo, editSubjectProfessor, getAllSubjectsInInstitution, getAllSubjectsOfProfessor } from '../services/subjectService.js';
import { isObjectIdValid } from '../utils/utils.js';

export const handleAddSubject = async (req, res) => {
  try {
    if(!isObjectIdValid(req.params.institution).valid) {
      return res.status(400).send(isObjectIdValid(req.params.institution).message);
    }
    
    const data = {
      ...req.body,
      professors: req.body.professors || [],
      assistents: req.body.assistents || [],
      institution: req.params.institution,
      deleted: false
    }

    const done = await addSubject(req.userTokenData._id, data);
    return res.status(201).json(done);
  } catch (err) {
    return res.status(err.status || 500).send({ message: err.message });
  }
}

export const handleDeleteSubject = async (req, res) => {
  try {
    if(!isObjectIdValid(req.params.id).valid) {
      return res.status(400).send(isObjectIdValid(req.params.id).message);
    }

    const done = await deleteSubject(req.userTokenData._id, req.params.id);
    return res.status(204).send(done);
  } catch (err) {
    return res.status(err.status || 500).send({ message: err.message });
  }
}

export const handleEditSubjectInfo = async (req, res) => {
  try {
    if(!isObjectIdValid(req.params.id).valid) {
      return res.status(400).send(isObjectIdValid(req.params.id).message);
    }

    const done = await editSubjectInfo(req.userTokenData, req.params.id, req.body);
    return res.status(200).send(done);
    
  } catch (err) {
    return res.status(err.status || 500).send({ message: err.message });
  }
}

export const handleEditSubjectProfessor = async (req, res) => {
  try { 
    const actions = ['add', 'del'];
    const positions = ['professor', 'assistent'];

    if(!actions.includes(req.body.action)) {
      return res.status(400).send({ message: 'Nevalidna akcija! Dozvoljene su: add i del' });
    }

    if(!positions.includes(req.body.position)) {
      return res.status(400).send({ message: 'Nevalidna pozicija!' });
    }

    if(!isObjectIdValid(req.params.professor).valid) {
      return res.status(400).send(isObjectIdValid(req.params.professor));
    }

    if(!isObjectIdValid(req.params.subject).valid) {
      return res.status(400).send(isObjectIdValid(req.params.subject));
    }

    const done = await editSubjectProfessor(req.userTokenData._id, req.params.professor, req.params.subject, req.body.position, req.body.action);
    return res.status(200).send(done);
  } catch (err) {
    return res.status(err.status || 500).send({ message: err.message });
  }
}

// GET
export const handleGetAllSubjectsInInstitution = async (req, res) => {
  try {
    if(!req.query.fullInfo) {
      req.query.fullInfo = false;
    }

    if(!isObjectIdValid(req.params.id).valid) {
      return res.status(400).send(isObjectIdValid(req.params.id).message);
    }

    const done = await getAllSubjectsInInstitution(req.userTokenData._id, req.params.id, req.query.fullInfo);
    return res.status(200).send(done);
  } catch (err) {
    return res.status(err.status || 500).send({ message: err.message });
  }
}


// FIXME: add fullInfo
export const handleGetAllSubjectsOfProfessor = async (req, res) => {
  try {
    if(!req.query.fullInfo) {
      req.query.fullInfo = false;
    }

    if(!isObjectIdValid(req.query.professor).valid) {
      return res.status(400).send(isObjectIdValid(req.query.professor).message);
    }
    
    const done = await getAllSubjectsOfProfessor(req.userTokenData._id, req.query.professor, req.query.fullInfo);
    return res.status(200).send(done);
  } catch (err) {
    return res.status(err.status || 500).send({ message: err.message });
  }
}