import { body } from 'express-validator';
import { validator } from './validator.js';

export const subjectBody = {
	professors: // implement me... check if array is of UIDS
		body('professors', 'Greška prilikom unosa profesora')
			.isArray(),

	assistents: 
		body('assistents', 'Greška prilikom unosa profesora')
			.optional()
			.isArray(),

	name: 
		body('name', 'Greška prilikom unosa naziva predmeta')
			.isString().withMessage('Naziv mora biti tipa string'),

	description:
		body('description', 'Greška prilikom unosa opisa predmeta')
			.optional()
			.isString().withMessage('Opis mora biti tipa string'),

	goal:
		body('goal', 'Greška prilikom unosa cilja predmeta')
			.optional()
			.isString().withMessage('Opis mora biti tipa string'),

	result:
		body('result', 'Greška prilikom unosa rezultata predmeta')
			.optional()
			.isString().withMessage('Opis mora biti tipa string'),

	references: 
		body('references', 'Greška prilikom unosa referenci predmeta')
			.optional()
			.isArray()
}

export const validateSubject = [
	subjectBody.professors,
	subjectBody.assistents,
	subjectBody.name,
	subjectBody.description,
	subjectBody.goal,
	subjectBody.result,
	subjectBody.references,

	validator
];