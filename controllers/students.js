const mongodb = require('../data/database');

const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
    //#swagger.tags = ['Students']
    try {
        const result = await mongodb.getDatabase().db('university').collection('students').find();
        const students = await result.toArray();

        if (!students || students.length === 0) {
            return res.status(404).json({ message: 'No students found' });
        }
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ message:error})
    }
};

const getSingle = async (req, res) => {
    //#swagger.tags = ['Students']
    try {
        const userId = new ObjectId(req.params.id);
        const result = await mongodb.getDatabase().db('university').collection('students').find({ _id: userId });
        const students = await result.toArray();

        // Check if student exists
        if (!students || students.length === 0) {
            return res.status(404).json({
                message: `Student with ID ${req.params.id} not found`
            });
        }

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(students[0]);
    } catch (error) {
        res.status(500).json({ message:error});
    }
};

const createStudent = async (req, res) => {
    //#swagger.tags = ['Students']
    try {
        const student = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            major: req.body.major,
            gpa: req.body.gpa,
            enrollmentYear: req.body.enrollmentYear,
            courses: req.body.courses,
            isActive: req.body.isActive
        };

        const result = await mongodb.getDatabase().db('university').collection('students').insertOne(student);

        if (result.acknowledged) {
            res.status(201).json({
                message: 'Student created successfully',
                studentId: result.insertedId
            });
        } else {
            res.status(500).json({ 
                message: 'Failed to create student'
            });
        }
    } catch (error) {
        console.error('Error creating student:', error);
        res.status(500).json({ 
            message: 'Error creating student',
            error: error.message 
        });
    }
};

const updateStudent = async (req, res) => {
    //#swagger.tags = ['Students']
    try {
        // Validate ID format
        if (!req.params.id || !ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: 'Invalid student ID format'
            });
        }

        const userId = new ObjectId(req.params.id);
        const student = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            major: req.body.major,
            gpa: req.body.gpa,
            enrollmentYear: req.body.enrollmentYear,
            courses: req.body.courses,
            isActive: req.body.isActive
        };

        const result = await mongodb.getDatabase().db('university').collection('students').updateOne(
            { _id: userId }, 
            { $set: student }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({
                message: `Student with ID ${req.params.id} not found`
            });
        }

        if (result.modifiedCount > 0) {
            res.status(200).json({
                message: 'Student updated successfully'
            });
        } else {
            res.status(200).json({
                message: 'No changes made to the student'
            });
        }
    } catch (error) {
        console.error('Error updating student:', error);
        res.status(500).json({ message:error });
    }
};

const deleteStudent = async (req, res) => {
    //#swagger.tags = ['Students']
    try {
        // Validate ID format
        if (!req.params.id || !ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: 'Invalid student ID format'
            });
        }

        const userId = new ObjectId(req.params.id);
        const result = await mongodb.getDatabase().db('university').collection('students').deleteOne({ _id: userId });

        if (result.deletedCount === 0) {
            return res.status(404).json({
                message: `Student with ID ${req.params.id} not found`
            });
        }

        res.status(200).json({
            message: 'Student deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting student:', error);
        res.status(500).json({
            message: 'Error deleting student',
            error: error.message
        });
    }
};

module.exports = {
    getAll,
    getSingle,
    createStudent,
    updateStudent,
    deleteStudent
};