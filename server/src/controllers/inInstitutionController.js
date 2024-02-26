import { getAllUsersInInstitution, getIsUserAuth, getUserRole, joinModeratorInstitution, joinUserInstitution, leaveInstitution, promoteToRole } from '../services/inInstitutionService.js';
import { isObjectIdValid } from '../utils/utils.js';

export const handleUserJoinInstitution = async (req, res) => {
  try {
    // UNCOMMENT THIS HERE AFTER TESTING!
    // if(!req.userTokenData) { 
    //   return res.status(401).send({message: 'No access token'});
    // }
    
    if(req.body.code.length !== 8) {
      return res.status(400).send({ message: 'Pogrešan kod!' });
    }

    const done = await joinUserInstitution(req.userTokenData._id, req.body.code);    
    return res.status(201).send(done);
  } catch (err) {
    return res.status(err.status || 500).send({ message: err.message });
  }
}

export const handleModeratorJoinInstitution = async (req, res) => {
  try {
    // UNCOMMENT THIS HERE AFTER TESTING!
    // if(!req.userTokenData) { 
    //   return res.status(401).send({message: 'No access token'});
    // }

    if(req.body.code.length !== 8) {
      return res.status(400).send({ message: 'Pogrešan kod!' });
    }

    const done = await joinModeratorInstitution(req.userTokenData._id, req.body.code)
    return res.status(201).send(done);
  } catch (err) {
    return res.status(err.status || 500).send({ message: err.message });
  }
}

export const handleLeaveInstitution = async (req, res) => {
  try {
    // UNCOMMENT THIS HERE AFTER TESTING!
    // if(!req.userTokenData) { 
    //   return res.status(401).send({message: 'No access token'});
    // }

    if(!req.body.user) {
      req.body.user = req.userTokenData._id;
    }

    if (!isObjectIdValid(req.body.user).valid) {
      return res.status(400).send(isObjectIdValid(req.body.user).message);
    }

    if(!isObjectIdValid(req.params.institution).valid) {
      return res.status(400).send(isObjectIdValid(req.body.institution).message);
    }

    if(req.userTokenData._id !== req.body.user && req.userTokenData.role === 'User') {
      return res.status(405).send({ message: 'Nemate permisiju za ovo!' });
    }

    const done = await leaveInstitution(req.body.user, req.params.institution);
    return res.status(200).send(done);
  } catch (err) {
    return res.status(err.status || 500).send({ message: err.message });
  }
}

export const handlePromoteToRole = async (req, res) => {
  try {
    // UNCOMMENT THIS HERE AFTER TESTING!
    // if(!req.userTokenData) { 
    //   return res.status(401).send({message: 'No access token'});
    // }

    if(!isObjectIdValid(req.params.user).valid) {
      return res.status(400).send(isObjectIdValid(req.params.user).message);
    } 

    if(!isObjectIdValid(req.params.institution).valid) {
      return res.status(400).send(isObjectIdValid(req.params.institution).message);
    }

    if(req.body.role !== 'User' || req.body.role !== 'Moderator') {
      return res.status(400).send({ message: 'Nepostojeća permisija!' });
    }
    
    const sender = req.userTokenData._id;
    const user = req.params.user;
    const role = req.body.role;
    const institution = req.params.institution;

    const done = await promoteToRole(sender, institution, user, role);
    return res.status(204).send(done);
  } catch (err) {
    return res.status(err.status || 500).send({ message: err.message });
  }
}

// GET
export const handleGetAllUsersInInstitution = async (req, res) => {
  try {
    // add page and limit here...
    // UNCOMMENT THIS HERE AFTER TESTING!
    // if(!req.userTokenData) { 
    //   return res.status(401).send({message: 'No access token'});
    // }

    if(!isObjectIdValid(req.params.id).valid) {
      return res.status(400).send(isObjectIdValid(req.params.id).message);
    }

    const done = await getAllUsersInInstitution(req.userTokenData._id, req.params.id);
    return res.status(200).send(done);
  } catch (err) {
    return res.status(err.status || 500).send({ message: err.message });
  }
}

export const handleGetUserRole = async (req, res) => {
  try {
    if(!isObjectIdValid(req.params.institution).valid) {
      return res.status(400).send(isObjectIdValid(req.params.institution).message);
    }
    const done = await getUserRole(req.userTokenData._id, req.params.institution);
    return res.status(200).send(done);
  } catch (err) {
    return res.status(err.status || 500).send({ message: err.message });
  }
};

export const handleGetIsUserAuth = async (req, res) => {
  try {
    if(!isObjectIdValid(req.params.institution).valid) {
      return res.status(400).send(isObjectIdValid(req.params.institution).message);
    }

    const done = await getIsUserAuth(req.userTokenData._id, req.params.institution);
    return res.status(200).send(done);
  } catch (err) {
    return res.status(err.status || 500).send({ message: err.message });
  }
}