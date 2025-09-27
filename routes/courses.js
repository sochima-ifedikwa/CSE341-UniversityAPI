const express = require('express');
const router = express.Router();
const coursesController = require('../controllers/courses');
const { courseRules, validate } = require('../middleware/validate');

router.get('/', coursesController.getAll); // Get all courses
router.get('/:id', coursesController.getSingle); // Get a single course by ID

// Apply validation rules to POST and PUT routes
router.post('/', courseRules(), validate, coursesController.createCourse); // Create a new course
router.put('/:id', courseRules(), validate, coursesController.updateCourse); // Update an existing course

router.delete('/:id', coursesController.deleteCourse); // Delete a course

module.exports = router;
