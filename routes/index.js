const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
    //#swagger.tags = ['Hello World']
    res.send('Hello World');
});

router.use('/students', require('./students'));
router.use('/courses', require('./courses'));
// router.use('/departments', require('./departments'));
// router.use('/professors', require('./professors'));

router.use('/', require('./swagger'));

module.exports = router;