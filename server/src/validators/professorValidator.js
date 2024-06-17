import { body } from 'express-validator';
import { validator } from './validator.js';

export const professorBody = {
	name: 
		body('name', 'Greška prilikom unosa imena profesora')
			.notEmpty().withMessage('Nije unešeno ime')
			.isString().withMessage('Ime mora biti tipa string')
			.trim(),

	title:
		body('title', 'Greška prilikom unosa titule profesora')
			.optional()
			.isString().withMessage('Titula mora biti tipa string')
			.trim(),

	education: 
		body('education.*.*', 'Greška prilikom unosa obrazovanja profesora')
			.optional()
			.isString(),

	bio:
		body('bio', 'Greška prilikom unosa stručne biografije profesora')
			.optional()
			.isString().withMessage('Biografija mora biti tipa string')
			.trim(),

	references: 
		body('references', 'Greška prilikom unosa referenci profesora')
			.optional()
			.isArray().withMessage('Reference moraju bita tipa niz')
}

export const validateProfessor = [
	professorBody.name,
	professorBody.title,
	professorBody.education,
	professorBody.bio,
	professorBody.references,

	validator
];