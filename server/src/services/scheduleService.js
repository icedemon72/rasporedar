import Professor from "../models/professorModel.js";
import Schedule from "../models/scheduleModel.js";
import Subject from "../models/subjectModel.js";
import { authSenderInInstitutionObject, senderInInstitutionObject } from '../utils/serviceHelpers.js';

export const addSchedule = async (sender, institution, data) => {
  const body = {
    ...data,
    instances: data.data,
    institution,
    deleted: false,
    createdBy: sender
  }

  const scheduleObj = await Schedule.create(body);
  
  return { message: 'Uspešno kreiran raspored!', _id: scheduleObj._id }
}

export const editSchedule = async (sender, institution, schedule, data) => {

  const scheduleObj = await Schedule.findOne({ _id: schedule, institution: institution, deleted: false });

  if (!scheduleObj) {
    throw {
      status: 404,
      message: 'Ne postoji raspored'
    }
  }

  // FIXME: change this
  await Schedule.updateOne({ _id: scheduleObj._id }, {
    $set: {
      department: data.department || scheduleObj.department,
      title: data.title || scheduleObj.title,
      subtitle: data.subtitle || scheduleObj.subtitle,
      comment: data.comment || scheduleObj.comment,
      days: data.days || scheduleObj.days,
      groups: data.groups || scheduleObj.groups,
      style: data.style || scheduleObj.style,
      systemType: data.systemType || scheduleObj.systemType,
      validUntil: data.validUntil || scheduleObj.validUntil,
      instances: data.data || scheduleObj.instances
    }
  });

  return { message: 'Uspešno izmenjen raspored!', _id: scheduleObj._id };
}

export const deleteSchedule = async (sender, institution, schedule) => {
  const scheduleObj = await Schedule.findOne({ _id: schedule, deleted: false });

  if (!scheduleObj) {
    throw {
      status: 400,
      message: 'Ne postoji raspored ili je već obrisan!'
    }
  }

  scheduleObj.deleted = true;
  await scheduleObj.save();

  return { message: `Raspored sa ID-em ${schedule} je uspešno obrisan!` };
}

export const getAllSchedulesInInstitution = async (sender, institution, published = true) => {
  (!published) ?
    await authSenderInInstitutionObject(sender, institution) :
    await senderInInstitutionObject(sender, institution);

  const toExclude = (published) ? { deleted: 0 } : { deleted: 0, published: 0 }
  const schedulesObj = await Schedule.find({ institution, deleted: false, published }, toExclude).populate({
		path: 'instances.data.subject instances.data.lecturer',
		select: '_id name'
	});

  return schedulesObj;
}

export const getSchedule = async (sender, institution, schedule) => {
  const scheduleObj = await Schedule.findOne({ _id: schedule, deleted: false })
    .populate({
      path: 'instances.data.subject instances.data.lecturer',
      select: '_id name'
    });

  if (!scheduleObj) {
    throw {
      status: 404,
      message: 'Raspored ne postoji!'
    }
  }

  if (!scheduleObj.published) {
    await authSenderInInstitutionObject(sender, institution);
  }

  return scheduleObj;
}