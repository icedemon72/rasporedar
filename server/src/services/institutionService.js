import InInstitution from '../models/inInstitutionModel.js';
import Institution from '../models/institutionModel.js'
import { senderInInstitutionObject } from '../utils/serviceHelpers.js';

export const addInstitution = async (data) => {
  try {
    if(data?.deleted) {
      data.deleted = false;
    }
    
    const result = await Institution.create(data);
    
    await InInstitution.create({ 
      user: data.createdBy,
      institution: result._id,
      role: 'Owner', 
      left: false
    });

    return { message: `Grupa '${data.name}' uspešno kreirana!`, _id: result._id, success: true }
  } catch (err) {
    throw err;
  }
}

export const deleteInstitution = async (sender, institution) => {
  try {
    const institutionToDelete = await Institution.find({institution, deleted: false});

    if(!institutionToDelete) {
      throw {
        status: 400,
        message: 'Pogrešan unos!'
      }
    }

    if(institutionToDelete.createdBy != sender) {
      throw {
        status: 400,
        message: 'Pogrešan unos!'
      }
    }

    institutionToDelete.deleted = true;

    await InInstitution.updateMany({ institution }, {$set: { left: true }});
    await institutionToDelete.save();
    return { message: 'Grupa je uspešno obrisana!' };
  } catch (err) {
    throw err;
  }
}

export const editInstitution = async (sender, institution, data) => {
  try {
    const institutionObj = await Institution.findOne({ createdBy: sender, institution });

    if(!institutionObj) {
      throw {
        status: 404,
        message: 'Pogrešna grupa!'
      }
    }

    await Institution.updateOne(institutionObj, { $set:{
      name: data.name,
      typeOf: data.typeOf,
      departments: data.departments
    } });

    return { message: 'Grupa uspešno izmenjena!', success: true };
  } catch (err) {
    throw err;
  }
}

export const getInstitutionById = async (sender, institution) => {
  try {
    await senderInInstitutionObject(sender, institution);

    const institutionObj = await Institution.findOne({ _id: institution }, {
      deleted: 0, createdBy: 0, code: 0, moderatorCode: 0 
    });

    if(!institutionObj) {
      throw {
        status: 404,
        message: 'Ne postoji grupa!'
      }
    }

    return institutionObj;    
  } catch (err) {
    throw err;
  }
}