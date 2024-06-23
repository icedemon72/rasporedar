/* TODO: me */

import { body } from 'express-validator';
import { validator } from './validator.js';

export const scheduleBody = {
	title: 
		body('title', 'Greška prilikom unošenja naslova rasporeda')
			.optional()
			.isString().withMessage('Naslov mora biti tipa string'),
	
	subtitle:
		body('subtitle', 'Greška prilikom unošenja podnaslova rasporeda')
			.optional()
			.isString().withMessage('Podnaslov mora biti tipa string'),
		
	comment:
		body('comment', 'Greška prilikom unošenja komentara nakon rasporeda')
			.optional()
			.isString().withMessage('Komentar mora biti tipa string'),

	days: 
		body('days', 'Greška prilikom unošenja dana u rasporedu')
			.isArray({ min: 1 }),

	department:
		body('department')
			.optional()
			.isString(),

	groups:
		body('groups', 'Greška prilikom unošenja grupa u rasporedu')
			.isArray(),

	style: 
		body('style')
			.isString().withMessage('Stil rasporeda mora biti tipa string'),

	systemType:
		body('systemType', 'Greška prilikom unošenja tipa rasporeda')
			.isIn(['school', 'college']),

	published:
		body('published', 'Greška prilikom unošenja statusa objave rasporeda')
			.optional()
			.isBoolean(),

	archived:
			body('archived', 'Greška prilikom unošenja statusa arhiviranja rasporeda')
				.optional()
				.isBoolean(),

	validUntil:
		body('validUntil', 'Greška prilikom unošenja datuma')
			.optional(),
	
	data:
		body('data')
			.optional()
}

export const validateSchedule = [
	scheduleBody.title,
	scheduleBody.subtitle,
	scheduleBody.comment,
	scheduleBody.department,
	scheduleBody.days,
	scheduleBody.groups,
	scheduleBody.style,
	scheduleBody.systemType,
	scheduleBody.validUntil,
	scheduleBody.published,
	scheduleBody.archived,
	scheduleBody.data,

	validator
];