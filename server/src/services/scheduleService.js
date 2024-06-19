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

export const checkSchedule = async (institution, checkTime, checkLocation, validFrom, validTo, frequency, location = '', time = {}) => {
	const currentDate = new Date();

	if(validFrom < currentDate) {
		validFrom = currentDate;
	}

	// const scheduleObj = await Schedule.find({ 
	// 	institution, 
	// 	instances: {
	// 		data: {
	// 			from: "10:00",
	// 		},
	// 	}
	// })

	const scheduleObj = await Schedule.find({
		institution,
		$or: [
			{ validUntil: { $gte: currentDate }},
			{ validUntil: null }
		],
		archived: false,
		deleted: false,
	});

	// index -> days index
	// da ne bi bila ovolika kompleksnost, u prvoj for petlji
	// treba proveriti da li se poklapaju nedelje
	// pre nego sto se proverava vreme u poslednjoj, proveriti
	// lokaciju jer nece biti potrebe za eksternom bibliotekom
	// this will be simplified, only those with same frequencies (that are consecutive)
	// will be considered valid
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

// ova funkcija vraca da li su rasporedi redjani kako treba,
// postoji potreba za kontinuiranjem rasporeda casova ukoliko su dinamicni, tj. varijabilni,
// greska je ukoliko se naznaci da su rasporedi na dvonedeljnom nivou, a jedan pocinje
// u ponedeljak, a drugi u sredu...
const checkPeriodOverlap = (fValidFrom, sValidFrom, fFrequency, sFrequency) => {
	if(fFrequency !== sFrequency) {
		return false;
	}

	if(sValidFrom > fValidFrom) {
		let temp = fValidFrom;
		fValidFrom = sValidFrom;
		sValidFrom = temp;
	}

	const frequency = (fFrequency === 'w2') 
		? (7 * 24 * 60 * 60) 
		: (fFrequency === 'w3')
			? (14 * 24 * 60 * 60)
			: (fFrequency === 'm1')
			? (28 * 24 * 60 * 60)
			: (56 * 24 * 60 * 60);

	
	console.log(frequency);
	fIntervalEnd = new Date(fValidFrom)



}

const convertTimeToSeconds = (string) => {
	const time = string.split(':');
	return parseInt(time[0] * 3600 + time[1] * 60)
}