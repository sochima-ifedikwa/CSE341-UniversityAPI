const { body, validationResult } = require('express-validator');

const studentRules = () => {
    return [
        body('firstName').notEmpty().isString().withMessage('First name must be a string'),
        body('lastName').notEmpty().isString().withMessage('Last name must be a string'),
        body('email').isEmail().withMessage('Please provide a valid email address'),
        body('major').notEmpty().isString().withMessage('Major must be a string'),
        body('gpa').isFloat({ min: 0.0, max: 4.0 }).withMessage('GPA must be a float between 0.0 and 4.0'),
        body('enrollmentYear').isInt({ min: 1900, max: new Date().getFullYear() }).withMessage(`Enrollment year must be an integer between 1900 and ${new Date().getFullYear()}`),
    ];
};

const courseRules = () => {
    return [
        body('courseCode').notEmpty().isString().withMessage('Course code must be a string'),
        body('title').notEmpty().isString().withMessage('Title must be a string'),
        body('credits').isInt({ min: 1, max: 5 }).withMessage('Credits must be an integer between 1 and 5'),
        body('department').notEmpty().isString().withMessage('Department must be a string'),
    ];
}

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

module.exports = {
    studentRules,
    courseRules,
    validate
};