const express = require('express');
const router = express.Router();
const passport = require('passport');


// router.get('/', (req, res) => {
//     //#swagger.tags = ['Hello World']
//     res.send('Hello World');
// });

router.use('/students', require('./students'));
router.use('/courses', require('./courses'));
// router.use('/departments', require('./departments'));
// router.use('/professors', require('./professors'));

router.get('/login', passport.authenticate('github'), (req, res) => {})

router.get('/logout', function(req, res, next) {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
    })
})
router.use('/', require('./swagger'));

module.exports = router; 