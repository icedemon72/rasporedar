import jwt from 'jsonwebtoken';
import 'dotenv';

import bcrypt from 'bcrypt';

/* Models */
import Session from './../models/sessionModel.js';
import User from './../models/userModel.js'

/* Token check */
export const checkRefreshToken = (refreshToken) => {
	return jwt.verify(refreshToken, process.env.AUTH_REFRESH_TOKEN_SECRET, (err) => {
		return err === null;
	});
}

export const checkAccessToken = (accessToken) => {
	return jwt.verify(accessToken, process.env.AUTH_ACCESS_TOKEN_SECRET, (err, info) => {
		if (err) {
			return (err.message === 'jwt expired') ? 2 : 0;
		}

		return 1; // 0 -> invalid; 1 -> 100% valid; 2 -> valid and expired
	});
}

export const refreshAccessToken = async (refreshToken, userAgent) => {
	const session = await Session.findOne({ refreshToken, active: true, userAgent });

	if (!session) {
		throw {
			status: 401,
			message: 'Sesija je istekla'
		};
	}

	let id;

	jwt.verify(refreshToken, process.env.AUTH_REFRESH_TOKEN_SECRET, (err, userInfo) => {
		if (err) {
			throw {
				status: 403,
				message: 'Refresh token je nevalidan!'
			};
		}
		id = userInfo._id;
	});

	const user = await User.findById({ _id: id });

	if (!user) {
		throw {
			status: 403,
			message: 'Korisnik ne postoji!'
		};
	}

	const accessToken = jwt.sign(
		{ username: user.username, _id: user._id, role: user.role },
		process.env.AUTH_ACCESS_TOKEN_SECRET,
		{ expiresIn: process.env.AUTH_ACCESS_TOKEN_EXPIRY }
	);

	return { access_token: accessToken };
}


/* Login */
export const loginUser = async (user, userAgent) => {
	let userObj;
	
	// is e-mail
	if(user.username.toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
		userObj = await User.findOne({ email: user.username });
	} else {
		userObj = await User.findOne({ username: user.username });
	}

	if (!userObj) {
		throw {
			status: 400,
			message: 'Pogrešan unos e-adrese i/ili lozinke!'
		};
	}

	const isPasswordCorrect = await bcrypt.compare(user.password, userObj.password);

	if (!isPasswordCorrect) {
		throw {
			status: 400,
			message: 'Pogrešan unos e-adrese i/ili lozinke!'
		};
	}

	const sessionObj = await Session.findOne({ user: userObj._id, active: true, userAgent });

	if (sessionObj && user?.refreshToken) {
		throw {
			status: 400,
			message: 'Već ste ulogovani!'
		};
	}

	const dataInToken = {
		username: userObj.username,
		_id: userObj._id,
		role: userObj.role
	};

	const accessToken = jwt.sign(
		dataInToken,
		process.env.AUTH_ACCESS_TOKEN_SECRET,
		{ expiresIn: process.env.AUTH_ACCESS_TOKEN_EXPIRY }
	);

	const refreshToken = jwt.sign(
		{ _id: userObj._id },
		process.env.AUTH_REFRESH_TOKEN_SECRET,
		{ expiresIn: process.env.AUTH_REFRESH_TOKEN_EXPIRY });


	const session = {
		user: userObj._id,
		refreshToken: refreshToken,
		active: true,
		userAgent: userAgent
	}

	let newSession = new Session(session);
	await newSession.save();

	return {
		'access_token': accessToken,
		'refresh_token': refreshToken
	}
}

export const logout = async (refreshToken, userAgent) => {
		if (!userAgent) {
			throw ('User agent is required!');
		}

		const session = await Session.findOne({ refreshToken, active: true, userAgent });

		if (!session) {
			throw {
				status: 401,
				message: 'Pogrešan Refresh Token!'
			};
		}

		session.active = false;
		await session.save();

		return { 'message': 'Uspešno ste se izlogovali!' };
}

export const setSessionFalse = async (refreshToken, userAgent) => {
	const session = await Session.findOne({ refreshToken, userAgent, active: true });

	if (session) {
		session.active = false;
		await session.save();
		return true;
	}

	return false;
}


export const decodeAccess = (accessToken) => jwt.decode(accessToken, process.env.AUTH_ACCESS_TOKEN_SECRET);

