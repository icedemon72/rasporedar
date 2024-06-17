const RouteGuard = (rolesWithCondition, dynamicArgs) => {
	return async (req, res, next) => {
		try {
			if (!req.userTokenData) return res.status(403).send({ status: 403, message: 'Unauthorized' });
			if(req?.userTokenData.role === 'Admin') {
				// const admin = await getAdminByUser(req.user.id, false);
				const admin = true;

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

				return req.userTokenData.role === role && await when(req, ...argsForWhen);	
			}));

			if (!hasPermission.some(permission => permission)) {
				return res.status(404).send({ status: 404, message: 'Stranica ne postoji' });
			}
			
			next();
		} catch (error) {
			return res.status(500).send({ status: 500, message: 'Internal Server Error' });
		}
	};
}

export default RouteGuard;