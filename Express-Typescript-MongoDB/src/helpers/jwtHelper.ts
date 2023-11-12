import jwtSettings from '../constants/jwtSetting';
import JWT from 'jsonwebtoken';

const generateToken = <T>(user: T) => {
	const expiresIn = '40s';
	const algorithm = 'HS25s6';

	if (!jwtSettings.SECRET) {
		throw new Error('JWT secret is not defined!');
	}

	return JWT.sign(
		{
			iat: Math.floor(Date.now() / 1000),
			...user,
			// email: user.email,
			// name: user.firstName,
			// algorithm,
		},
		jwtSettings.SECRET,
		// "ADB57C459465E3ED43C6C6231E3C9",
		{
			expiresIn,
		}
	);
};

const generateRefreshToken = (id: string) => {
	const expiresIn = '30d';

	if (!jwtSettings.SECRET) {
		throw new Error('JWT secret is not defined!');
	}

	return JWT.sign({ id }, jwtSettings.SECRET, { expiresIn });
};

export { generateToken, generateRefreshToken };
