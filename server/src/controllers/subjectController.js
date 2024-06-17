import { addSubject, deleteSubject, editSubjectInfo, editSubjectProfessor, getAllSubjectsInInstitution, getAllSubjectsOfProfessor, getSubjectById } from '../services/subjectService.js';
import { isObjectIdValid } from '../utils/utils.js';

export const handleAddSubject = async (req, res) => {
  try { 
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
    const done = await deleteSubject(req.userTokenData._id, req.params.subject);
    
		return res.status(204).send(done);
  } catch (err) {
    return res.status(err.status || 500).send({ message: err.message });
  }
}

export const handleEditSubjectInfo = async (req, res) => {
  try {
    const done = await editSubjectInfo(req.userTokenData, req.params.subject, req.body);
    
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
    const done = await editSubjectProfessor(req.userTokenData._id, req.params.professor, req.params.subject, req.body.position, req.body.action);
    
		return res.status(200).send(done);
  } catch (err) {
    return res.status(err.status || 500).send({ message: err.message });
  }
}

// GET
export const handleGetSubject = async (req, res) => {
  try {
    if(!req.query.fullInfo) {
      req.query.fullInfo = false;
    }

    const done = await getSubjectById(req.userTokenData._id, req.params.subject, req.query.fullInfo);
    
		return res.status(200).send(done);
  } catch (err) {
    return res.status(err.status || 500).send({ message: err.message });
  }
}

export const handleGetAllSubjectsInInstitution = async (req, res) => {
  try {
    if(!req.query.fullInfo) {
      req.query.fullInfo = false;
    }

		const done = await getAllSubjectsInInstitution(req.userTokenData._id, req.params.institution, req.query.fullInfo);
    
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
    
    const done = await getAllSubjectsOfProfessor(req.userTokenData._id, req.params.professor, req.query.fullInfo);
    
		return res.status(200).send(done);
  } catch (err) {
    return res.status(err.status || 500).send({ message: err.message });
  }
}