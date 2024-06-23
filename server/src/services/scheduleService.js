import Professor from "../models/professorModel.js";
import Schedule from "../models/scheduleModel.js";
import Subject from "../models/subjectModel.js";
import { authSenderInInstitutionObject, senderInInstitutionObject } from '../utils/serviceHelpers.js';
import { isProfessorOnSubject } from "./subjectService.js";

export const addSchedule = async (sender, institution, data) => {
	const scheduleData = data.data;

	const isEveryProfessorOnSubject = scheduleData.every(dataObj => {
		return dataObj.data.every(day => {
			return day.every(async (term) => {
				
				if(term?.lecturer) {
					return await isProfessorOnSubject(institution, term.subject, term.lecturer);
				}
			
				return true;
			});
		});
	});

	if(!isEveryProfessorOnSubject) throw { status: 400, message: 'Greška prilikom dodavanja rasporeda, neki profesori nisu na predmetu!' }

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

export const editSchedule = async (institution, schedule, data) => {

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
			data: data.data,
      department: data.department || scheduleObj.department,
      title: data.title || scheduleObj.title,
      subtitle: data.subtitle || scheduleObj.subtitle,
      comment: data.comment || scheduleObj.comment,
      days: data.days || scheduleObj.days,
      groups: data.groups || scheduleObj.groups,
      style: data.style || scheduleObj.style,
      systemType: data.systemType || scheduleObj.systemType,
      validUntil: data.validUntil || scheduleObj.validUntil,
      instances: data.data || scheduleObj.instances,
			published: data?.published,
			archived: data?.archived
    }
  });

  return { message: 'Uspešno izmenjen raspored!', _id: scheduleObj._id };
}

export const deleteSchedule = async (institution, schedule) => {
  const scheduleObj = await Schedule.findOne({ _id: schedule, institution, deleted: false });

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
	let schedulesObj;
	
	if(published === '0' || !published) {
		await authSenderInInstitutionObject(sender, institution);

		schedulesObj = await Schedule.find({ institution, deleted: false }, { deleted: 0, published: 0 }).populate({
			path: 'instances.data.subject instances.data.lecturer',
			select: '_id name'
		}).sort({ created_at: 1, title: 1 });

	} else {
		schedulesObj = await Schedule.find({ institution, deleted: false, published: true }, { deleted: 0 }).populate({
			path: 'instances.data.subject instances.data.lecturer',
			select: '_id name'
		}).sort({ created_at: 1, title: 1 });
	}

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

export const checkSchedule = async (institution, checkTime, checkLocation, validFrom, validTo, frequency, location = '', time = {}) => {
	const currentDate = new Date();

	if(!validFrom) {
		validFrom = currentDate;
	}

	const scheduleObj = await Schedule.find({
		institution,
		validFrom,
		frequency,
		archived: false,
		deleted: false,
	});

	const startTime = convertTimeToSeconds(time.from);
	const endTime = convertTimeToSeconds(time.to);


	for(let i = 0; i < scheduleObj.length; i++) {
		const schedule = scheduleObj[i];
		
		for(let j = 0; j < schedule.instances.length; j++) {
			const instance = schedule.instances[j];
			
			for(let k = 0; k < instance.data[time.day].length; k++) {
				const item = instance.data[time.day][k];
		
				if(item?.from && item?.to && Math.max(convertTimeToSeconds(item.from), startTime) <= Math.min(convertTimeToSeconds(item.to), endTime)) {
					if(time.lecturer == item.lecturer && checkTime) throw { status: 400, message: `Profesor već ima predavanje u ovom terminu, termin je: ${item.from} - ${item.to}` };

					if(checkLocation && item.location && location.toLowerCase() === item.location.toLowerCase()) throw { status: 400, message: `Prostorija (${item.location}) je zauzeta u ovom terminu, termin je: ${item.from} - ${item.to}` };
				
				} 
			}
		}
	}

	return { message: 'Termin je slobodan!' };
}

const convertTimeToSeconds = (string) => {
	const time = string.split(':');
	return parseInt(time[0] * 3600 + time[1] * 60)
}