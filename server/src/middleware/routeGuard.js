import { Request, Response, NextFunction } from "express";
import { newError } from "../utils";

import { getAdminByUser } from "../services/user.service";

const RouteGuard = (rolesWithCondition, dynamicArgs) => {
	return async (req, res, next) => {
		try {
			if (!req.user) return res.status(401).send(newError(401, 'Unauthorized'));

			if(req?.user.roles.includes('admin')) {
				const admin = await getAdminByUser(req.user.id, false);

				if(admin) {
					return next();
				}
			}

			const hasPermission = await Promise.all(rolesWithCondition.map(async ({ role, when }, index) => {
				let argsForWhen = [];
				if (dynamicArgs) {
					argsForWhen = dynamicArgs[index] || [];
				}

				if(role === '*') {
					return await when(req, ...argsForWhen);
				}

				return req.user.roles.includes(role) && await when(req, ...argsForWhen);	
			}));

			if (!hasPermission.some(permission => permission)) {
				return res.status(404).send(newError(404, 'Stranica ne postoji'));
			}
			
			next();
		} catch (error) {
			return res.status(500).send(newError(500, 'Internal Server Error'));
		}
	};
}

export default RouteGuard;