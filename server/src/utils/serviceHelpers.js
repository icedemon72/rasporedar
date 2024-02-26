import InInstitution from '../models/inInstitutionModel.js';
import Institution from '../models/institutionModel.js';

// This function is used to check whether an user is in the institution
export const senderInInstitutionObject = async (user, institution) => {
  try {
    const inInstObj = await InInstitution.findOne({ user, institution, left: false });

    if(!inInstObj) {
      throw {
        status: 404,
        message: 'Nevalidna grupa!'
      }
    }

    return inInstObj;

  } catch (err) {
    throw err;
  }
}

// This function is used to check whether an user has admin privileges in the institution
export const authSenderInInstitutionObject = async (user, institution) => {
  try {
    const inInstObj = await InInstitution.findOne({ user, institution, left: false });
    
    if(inInstObj) {
      if(inInstObj.role !== 'User') {
        return inInstObj;
      }
      throw {
        status: 405,
        message: 'Nemate dovoljnu permisiju za ovo!'
      }
    } else {
      throw {
        status: 404,
        message: 'Nevalidna grupa!'
      }
    }

  } catch (err) {
    throw err;
  }
}

// This function is used to check whether an user is the creator of said institution
export const ownerSenderInInstitutionObject = async (user, institution) => {
  try {
    const ownerObj = await Institution.findOne({ _id: institution, createdBy: user, deleted: false });

    if(!ownerObj) {
      throw {
        status: 404,
        message: 'Nemate dovoljnu permisiju za ovo!'
      }
    }

    return ownerObj;
  } catch (err) {
    throw err;
  }
}