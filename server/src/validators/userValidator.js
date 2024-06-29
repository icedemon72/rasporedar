import { body } from 'express-validator';
import { validator } from './validator.js';

export const userBody = {
	username: 
		body('username', 'Greška prilikom unosa korisničkog imena')
			.notEmpty().withMessage('Korisničko ime je obavezno')
			.isString().withMessage('Korisničko ime mora biti tipa string')
			.trim()
			.toLowerCase(),

	email:
		body('email', 'Greška prilikom unosa e-adrese')
			.isEmail().withMessage('Nije uneta validna e-adresa')
			.trim()
			.toLowerCase(),

	name:
		body('name', 'Greška prilikom unosa imena')
			.trim()
			.isString().withMessage('Ime mora biti tipa string'),

	password:
		body('password', 'Greška prilikom unosa lozinke')
			.isLength({ min: 3 }).withMessage('Lozinka mora sadržati bar tri karaktera')
			.notEmpty(),

	newPassword:
		body('newPassword', 'Greška prilikom unosa nove lozinke')
			.optional()
			.isLength({ min: 3 }).withMessage('Lozinka mora sadržati bar tri karaktera')
			.notEmpty(),

	oldPassword: 
		body('oldPassword', 'Greška prilikom unosa stare lozinke')
			.optional()
			.isLength({ min: 3 }).withMessage('Lozinka mora sadržati bar tri karaktera')
			.notEmpty(),
}

const basis = [
	userBody.username,
	userBody.email,
	userBody.name,
]

export const validateUserRegister = [
	...basis,
	userBody.password,

	validator
];

export const validateUserEdit = [
	...basis,
	userBody.oldPassword,
	userBody.newPassword,

	validator
];