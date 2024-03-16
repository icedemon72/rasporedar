import Professor from "../models/professorModel.js";
import Schedule from "../models/scheduleModel.js";
import Subject from "../models/subjectModel.js";
import { authSenderInInstitutionObject, senderInInstitutionObject } from '../utils/serviceHelpers.js';

export const addSchedule = async (sender, institution, data) => {
  try {
    const body = {
      ...data,
      instances: data.data,
      institution,
      published: false,
      deleted: false,
    }



    const scheduleObj = await Schedule.create(body);
    return { message: 'Uspešno kreiran raspored!', _id: scheduleObj._id }
  } catch (err) {
    throw err;
  }
}

export const editSchedule = async (sender, institution, schedule, data) => {
  try {
    await authSenderInInstitutionObject(sender, institution);

    const scheduleObj = await Schedule.findOne({_id: schedule, institution: institution, deleted: false });

    if(!scheduleObj) {
      throw {
        status: 404,
        message: 'Ne postoji raspored'
      }
    }

    // FIXME: change this
    await Schedule.updateOne({ _id: scheduleObj._id }, {
      $set: {
        ...data
      }
    });

    return { message: 'Uspešno izmenjen raspored!' };


  } catch (err) {
    throw err;
  }
}

export const deleteSchedule = async (sender, institution, schedule) => {
  try {
    await authSenderInInstitutionObject(sender, institution);
  } catch (err) {
    throw err;
  }
}

export const getAllSchedulesInInstitution = async (sender, institution, published = true) => {
  try {

    (!published) ? 
      await authSenderInInstitutionObject(sender, institution) :
      await senderInInstitutionObject(sender, institution);

    const toExclude = (published) ? { deleted: 0 } : { deleted: 0, published: 0 }
                                                                            // add published later
    const schedulesObj = await Schedule.find({ institution, deleted: false }, toExclude);
    return schedulesObj;
  } catch (err) {
    throw err;
  }
}

export const getSchedule = async (sender, institution, schedule) =>{
  try {
    await senderInInstitutionObject(sender, institution);

    const scheduleObj = await Schedule.findOne({ _id: schedule, deleted: false })
      .populate({
        path: 'instances.data.subject instances.data.lecturer',
        select: '_id name'
      });
    
    if(!scheduleObj) {
      throw {
        status: 404,
        message: 'Raspored ne postoji!'
      }
    }

    if(!scheduleObj.published) {
      await authSenderInInstitutionObject(sender, institution);
    }

    return scheduleObj;
  } catch (err) {
    throw err;
  }
}