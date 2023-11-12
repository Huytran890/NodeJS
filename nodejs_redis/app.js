const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
require('dotenv').config();
const cors = require('cors');
require('./dbConnect')();
const session = require('express-session');
const { createClient } = require('redis');
const RedisStore = require('connect-redis').default;

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const languagesRouter = require('./routes/languages');
const favoriteLanguageRouter = require('./routes/favoriteLanguage');

const app = express();

app.use(
	cors({
		origin: '*',
	})
);

// app.set('trust proxy', 1); // enable this if you run behind a proxy (e.g. nginx)

// Create the Redis client
const redisClient = createClient({
	url: process.env.REDIS_URI,
	legacyMode: true,
});

//Configure redis client
redisClient.connect().catch(console.error);

// Initialize store.
const redisStore = new RedisStore({
	client: redisClient,
});

//Configure session middleware
app.use(
	session({
		store: redisStore,
		// khong luu lai the same object every time
		resave: false,
		// khong login khong co session
		saveUninitialized: true,
		secret: process.env.SESSION_SECRET,
		cookie: {
			secure: false, // if true only transmit cookie over https
			httpOnly: false, // if true prevent client side js from reading the cookie
			maxAge: 1000 * 60 * 10, // (10 minutes), session max age in milliseconds
		},
	})
);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/languages', languagesRouter);
app.use('/favorite-language', favoriteLanguageRouter);

app.use('/hello', async (req, res) => {
	try {
		if (req.session.viewCount === undefined) {
			req.session.viewCount = 0;
		} else {
			req.session.viewCount++;
		}
		res.json({
			viewCount: 'View count is: ' + req.session.viewCount,
		});
	} catch (error) {
		console.error('Redis Error:', error);
		res.status(500).send('An error occurred.');
	}
});

app.use(express.static(path.join(__dirname, 'public')));

module.exports = app;
