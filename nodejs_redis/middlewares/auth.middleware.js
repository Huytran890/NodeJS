const authenticated = (req, res, next) => {
	if (!req.session.user) {
		res.status(401).json({
			message: 'Unauthorized',
		});
	}
	next();
};

module.exports = authenticated;
