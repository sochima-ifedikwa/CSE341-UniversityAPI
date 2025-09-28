const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('./data/database')
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const GitHubStrategy = require('passport-github2').Strategy;




const app = express();
const port = process.env.PORT || 5500;

app
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: true }))
    .use(session({
        secret: 'unlockthegates',
        resave: false,
        saveUninitialized: true
    }))
    // Passport Configuration
    // Basic express session initialization    
    .use(passport.initialize())
    // initialize passport to on every call
    .use(passport.session())
    // allow passport to use "sessions"
    .use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
        next();
    })
    .use('/', require('./routes/index'))
    .use(cors({ methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'UPDATE']}))
    .use(cors({ origin: '*'}))
    
    passport.use(new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.CALLBACK_URL
    },
    function(accessToken, refreshToken, profile, done) {
        return done(null, profile);
    }
));

passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((user, done) => {
    done(null, user);
});

app.get('/', (req, res) => {
    res.send(req.session.user !== undefined ? `Logged in as ${req.session.user.displayName}` : 'Logged out')
})

app.get('/github/callback', 
    passport.authenticate('github', {failureRedirect: '/api-docs', session: false}),
    (req, res) => {
        req.session.user = req.user;
        res.redirect('/');
    }
);


// Global error handling for uncaught exceptions
process.on('uncaughtException', (err, origin) => {
    console.log(process.stderr.fd, `Caught exception: ${err}\n` + `Exception origin: ${origin}`);
})

mongodb.initDb((err) => {
    if (err) {
        console.log(err);
    } else {
        app.listen(port, () => {
            console.log(`Database is connected and listening on port ${port}`);
        });
    }
});
