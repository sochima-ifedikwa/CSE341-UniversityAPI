const mongodb = require('../data/database');

const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
    //#swagger.tags = ['Courses']
    try {
        const result = await mongodb.getDatabase().db('university').collection('courses').find();
        const courses = await result.toArray();

        if (!courses || courses.length === 0) {
            return res.status(404).json({ message: 'No courses found' });
        }
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message:error})
    }
};

const getSingle = async (req, res) => {
    //#swagger.tags = ['Courses']
    try {
        const userId = new ObjectId(req.params.id);
        const result = await mongodb.getDatabase().db('university').collection('courses').find({ _id: userId });
        const courses = await result.toArray();

        // Check if course exists
        if (!courses || courses.length === 0) {
            return res.status(404).json({
                message: `Course with ID ${req.params.id} not found`
            });
        }

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(courses[0]);
    } catch (error) {
        res.status(500).json({ message:error});
    }
};

const createCourse = async (req, res) => {
    //#swagger.tags = ['Courses']
    try {
        const course = {
            "courseCode": req.body.courseCode,
            "title": req.body.title,
            "credits": req.body.credits,
            "department": req.body.department
        };

        const result = await mongodb.getDatabase().db('university').collection('courses').insertOne(course);

        if (result.acknowledged) {
            res.status(201).json({
                message: 'Course created successfully',
                courseId: result.insertedId
            });
        } else {
            res.status(500).json({ 
                message: 'Failed to create course'
            });
        }
    } catch (error) {
        console.error('Error creating course:', error);
        res.status(500).json({ 
            message: 'Error creating course',
            error: error.message 
        });
    }
};

const updateCourse = async (req, res) => {
    //#swagger.tags = ['Courses']
    try {
        // Validate ID format
        if (!req.params.id || !ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: 'Invalid course ID format'
            });
        }

        const userId = new ObjectId(req.params.id);
        const course = {
            "courseCode": req.body.courseCode,
            "title": req.body.title,
            "credits": req.body.credits,
            "department": req.body.department
        };

        const result = await mongodb.getDatabase().db('university').collection('courses').updateOne(
            { _id: userId }, 
            { $set: course }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({
                message: `Course with ID ${req.params.id} not found`
            });
        }

        if (result.modifiedCount > 0) {
            res.status(200).json({
                message: 'Course updated successfully'
            });
        } else {
            res.status(200).json({
                message: 'No changes made to the course'
            });
        }
    } catch (error) {
        console.error('Error updating course:', error);
        res.status(500).json({ message:error });
    }
};

const deleteCourse = async (req, res) => {
    //#swagger.tags = ['Courses']
    try {
        // Validate ID format
        if (!req.params.id || !ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: 'Invalid course ID format'
            });
        }

        const courseId = new ObjectId(req.params.id);
        const result = await mongodb.getDatabase().db('university').collection('courses').deleteOne({ _id: courseId });

        if (result.deletedCount === 0) {
            return res.status(404).json({
                message: `Course with ID ${req.params.id} not found`
            });
        }

        res.status(200).json({
            message: 'Course deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting course:', error);
        res.status(500).json({
            message: 'Error deleting course',
            error: error.message
        });
    }
};

module.exports = {
    getAll,
    getSingle,
    createCourse,
    updateCourse,
    deleteCourse
};