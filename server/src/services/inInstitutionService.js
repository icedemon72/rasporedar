import InInstitution from '../models/inInstitutionModel.js';
import Institution from '../models/institutionModel.js'
import { authSenderInInstitutionObject, senderInInstitutionObject } from '../utils/serviceHelpers.js';
import { getUserById } from './userService.js';

export const joinUserInstitution = async (sender, code) => {
  try {
    await getUserById(sender); // this function has already got throw handle

    const codeInstitution = await Institution.findOne({ code, deleted: false });

    if(!codeInstitution) {
      throw {
        status: 400,
        message: 'Pogrešan kod!'
      }
    }

    const alreadyJoined = await InInstitution.findOne({
      user: sender,
      institution: codeInstitution._id,
      left: false
    });


    if(alreadyJoined) {
      throw {
        status: 400,
        message: 'Već ste učlanjeni!'
      }
    } 

    await InInstitution.create({
      user: sender,
      institution: codeInstitution._id
    });

    return { message: `Uspešno ste se učlanili u '${codeInstitution.name}'!` };

  } catch (err) {
    throw err;
  }
}

export const joinModeratorInstitution = async (sender, moderatorCode) => {
  try {
    const codeInstitution = await Institution.findOne({ moderatorCode, deleted: false });

    if(!codeInstitution) {
      throw {
        status: 400,
        message: 'Pogrešan kod!'
      }
    }

    const alreadyJoined = await InInstitution.findOne({
      user: sender,
      institution: codeInstitution._id,
      left: false
    });

    if(alreadyJoined) {
      console.log(alreadyJoined);
      if(alreadyJoined.role !== 'User') {
        throw {
          status: 400,
          message: 'Već ste moderator!'
        }
      } 

      await InInstitution.updateOne({ _id: alreadyJoined._id }, { $set: {role: 'Moderator'} });

      return { message: `Postali ste moderator!` };
    } 

    await InInstitution.create({
      user: sender,
      institution: codeInstitution._id,
      role: 'Moderator'
    });
    
    return { message: `Uspešno ste se učlanili u ${codeInstitution.name}!` };

  } catch (err) {
    throw err;
  }
}

export const leaveInstitution = async (sender, institution) => {
  try {
    const userJoined = await InInstitution.findOne({
      user: sender,
      institution,
      left: false
    });

    if(!userJoined) {
      throw {
        status: 400,
        message: 'Niste učlanjeni!'
      }
    }

    if(userJoined.role === 'Owner') {
      throw {
        status: 400,
        message: 'Vlasnik ste grupe!'
      }
    }

    await InInstitution.updateOne({ _id: userJoined._id }, { $set: {left: true} });

    return { message: 'Uspešno ste izašli!' };
        
  } catch (err) {
    throw err;
  }
}

export const promoteToRole = async (sender, institution, user, role) => {
  try {
    const institutionObj = await Institution.findOne({ _id: institution, createdBy: sender, deleted: false});

    if(!institutionObj) {
      throw {
        status: 405,
        message: 'Niste kreator grupe!'
      }
    }

    const userToChange = await InInstitution.findOne({
      user, institution, left: false 
    });

    if(!userToChange) {
      throw {
        status: 400,
        message: 'Korisnik nije u grupi!'
      }
    }

    userToChange.role = role;
    await userToChange.save();

    return { message: 'Uspešna promena permisije!' };    
  } catch (err) {
    throw err;
  }
}

// GET
// FIXME: add fullInfo
export const getAllUsersInInstitution = async (sender, institution, limit = 10) => {
  try {   
    const userObj = await InInstitution.findOne({ user: sender, institution, left: {$in: [null, false]} });

    if(!userObj) {
      throw {
        status: 404,
        message: 'Niste u grupi!'
      }
    }

    if(userObj.role === 'User') {
      const inInstObj = await InInstitution.find({
        institution, 
        left: {$in: [null, false]} 
      }, 
      { 
        role: 0, 
        left: 0, 
        createdAt: 0, 
        updatedAt: 0,
         __v: 0
      }); // <- maybe change this later on, depending on front-end

      return inInstObj;
    }

    const inInstObj = await InInstitution.find({ institution, left: {$in: [null, false]} }, { left: 0 });
    return inInstObj;
    
  } catch (err) {
    throw err;
  }
}

export const getUserRole = async (sender, institution) => {
  try {
    const result = await senderInInstitutionObject(sender, institution);
    return { role: result.role };
  } catch (err) {
    throw err;
  }
}

export const getIsUserAuth = async (sender, institution) => {
  try {
    const result = await authSenderInInstitutionObject(sender, institution);
    return { role: result.role };
  } catch (err) {
    throw err;
  }
}