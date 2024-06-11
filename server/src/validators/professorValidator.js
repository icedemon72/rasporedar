import { body } from 'express-validator';
import { validator } from './validator.js';

export const professorBody = {
	name: 
		body('name', 'Greška prilikom unosa imena profesora')
			.notEmpty().withMessage('Nije unešeno ime')
			.isString().withMessage('Ime mora biti tipa string')
			.trim(),
}

export const validateProfessorAdd = [
	professorBody.name,

	validator
]