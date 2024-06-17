import { body } from 'express-validator';
import { validator } from './validator.js';

export const institutionBody = {
	name: 
		body('name', 'Greška prilikom unosa naziva grupe')
			.isString().withMessage('Naziv grupe mora biti tipa string'),
	
	typeOf:
		body('typeOf', 'Greška prilikom unosa tipa grupe')
			.default('other')
			.isIn(['primary', 'high', 'faculty', 'other']),
	
	departments:
		body('departments', 'Greška prilikom unosa odseka/odeljenja')
			.optional()
			.isArray(),

	role:
		body('role')
			.isString()
			.isIn(['Moderator', 'User']).withMessage('Nepostojeća permisija')
}

export const validateInstitution = [
	institutionBody.name,
	institutionBody.typeOf,
	institutionBody.departments,

	validator
];

export const validateRoleChange = [
	institutionBody.role,

	validator
]