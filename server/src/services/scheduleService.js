import Schedule from "../models/scheduleModel.js";
import { authSenderInInstitutionObject, senderInInstitutionObject } from '../utils/serviceHelpers.js';

export const addSchedule = async (sender = null, institution, data) => {
  try {
    // {
    //   instances: {
    //     titles: ['Inf 1', 'Inf 2'],
    //     schedules: [
    //       [
      //       day: 'Ponedeljak',
      //       subject: [ '123', '345' ],
      //       lecturer: ['123', '345'],
      //       from: ['08:00', '08:45'],
      //       to: ['08:40', '09:25'],
      //       location: ['Sala 1', 'Sala 2']
    //       ],
    //       ...
    //     ]
    //   },
    //   days: ['P', 'U'...],
    //   style: 'default',
    //   validUnti: '2024-10-04',
    //   published: true,
    //   deleted: false
    // }
    data = {
      instances: {
        titles: ['I-2'],
        schedules: [
          [
            {
              day: 'Ponedeljak',
              subject: ['65e9dbd54a29320fc18438e0'],
              lecturer: ['65e745e1a456e109c48a1643'],
              from: ['08:00'],
              to: ['08:40'],
              location: ['Sala 1']
            }
          ]
        ]
      },
      institution: institution,
      style: 'default',
      validUntil: '2024-03-10',
      published: false
    }

    await Schedule.create(data);
    return { message: 'Uspešno kreiran raspored!' }
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

    const schedulesObj = await Schedule.find({ institution, deleted: false, published: published });

    return schedulesObj;
  } catch (err) {
    throw err;
  }
}

