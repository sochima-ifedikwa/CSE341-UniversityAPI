const express = require('express');
const router = express.Router();
const studentsController = require('../controllers/students');
const { studentRules, validate } = require('../middleware/validate');

router.get('/', studentsController.getAll); // Get all students
router.get('/:id', studentsController.getSingle); // Get a single student by ID

// Apply validation rules to POST and PUT routes
router.post('/', studentRules(), validate, studentsController.createStudent); // Create a new student
router.put('/:id', studentRules(), validate, studentsController.updateStudent); // Update an existing student

router.delete('/:id', studentsController.deleteStudent); // Delete a student

module.exports = router;
