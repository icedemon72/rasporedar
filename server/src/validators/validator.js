import { validationResult, matchedData, param } from 'express-validator';

export const validator = (req, res, next) => {
	const errors = validationResult(req);

	if (!errors.isEmpty())
		return res.status(400).json({ errors: errors.array() });

	req.body = matchedData(req, {
		locations: ['body'],
		includeOptionals: true,
	});

	next();
}

export const paramValidator = (req, res, next) => {
	const errors = validationResult(req);

	if (!errors.isEmpty())
		return res.status(400).json({ errors: errors.array() });

	req.params = matchedData(req, {
		locations: ['params'],
		includeOptionals: false,
	});

	next();
}

// export const queryValidator = (req: Request, res: Response, next: NextFunction) => {
// 	const errors = validationResult(req);

// 	if(!errors.isEmpty()) {
// 		console.log(errors);
// 	}

// 	req.query = matchedData(req, {
// 		locations: ['query'],
// 		includeOptionals: false,
// 	});

// 	next();
// }

/**
 * @param {string} parameters 
 * Parameters that are to be validated, the function is making sure they are
 * not undefined, are int, and are converted to integer value
 * @returns {Array} validated array
 */

export const validateParams = (...parameters) => {
	const params = parameters.map((parameter) => 
		param(parameter, `Greška prilikom unosa parametara!`)
			.notEmpty()
			.isInt()
			.toInt(),
	);

	return (params.length) 
		? [ ...params, paramValidator ]
		: [];

} 