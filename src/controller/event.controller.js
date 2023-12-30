const EventModel = require('../model/event.model');
const TicketModel = require('../model/ticketType.model');
const mongoose = require('mongoose');


// Create new events
exports.createEvent = async (req, res) => {
    const newEvent = new EventModel(req.body);

    try {
        const eventData = await newEvent.save();
        res.status(201).json({
            message: 'Event created successfully',
            event: eventData,
        });
    } catch (error) {
        console.error('Error creating event:', error);

        if (error.name === 'ValidationError') {
            // Mongoose validation error
            res.status(400).json({
                error: 'Validation Error',
                message: error.message,
            });
        } else if (error.name === 'MongoError' && error.code === 11000) {
            // Duplicate key error
            res.status(409).json({
                error: 'Conflict',
                message: 'Duplicate key error. This event already exists.',
            });
        } else {
            // General internal server error
            res.status(500).json({
                error: 'Internal Server Error',
            });
        }
    }
};

// Get all events from the database
exports.getAllEvents = async (req, res) => {
    try {
        const events = await EventModel.find({});
        if (!events) {
            return res.status(404).json({
                error: 'No Events Found',
            });
        }
        res.json({
            message: 'Events retrieved successfully ',
            event: events,
        });
    } catch (error) {
        console.error('Error getting events:', error);

        if (error.name === 'CastError') {
            return res.status(400).json({
                error: 'Invalid ID format',
            });
        }

        res.status(500).json({
            error: 'Internal Server Error',
            message: error.message || 'An unexpected error occurred.',
        });
    }
};

// Update Event Details by ID
exports.updateEvent = async (req, res) => {
    try {
        const eventIdToUpdate = req.params.id;
        const eventDataToUpdate = req.body;

        const updatedEvent = await EventModel.findOneAndUpdate(
            { '_id': eventIdToUpdate },
            { $set: eventDataToUpdate },
            { new: true }
        );

        if (!updatedEvent) {
            return res.status(404).json({
                error: 'Event not found',
            });
        }

        res.json({
            message: 'Event updated successfully',
            event: updatedEvent,
        });
    } catch (error) {
        console.error('Error updating event:', error);
        res.status(500).json({
            error: 'Internal Server Error',
        });
    }
};


// Get events by ID
exports.getEventbyID = async (req, res) => {
    try {
        const eventId = req.params.id;

        const event = await EventModel.findById({'_id':eventId});

        if (!event) {
            return res.status(404).json({
                error: 'Event not found',
                message: 'The requested event does not exist.',
            });
        }

        res.status(200).json({
            message: 'Event retrieved successfully',
            event: event,
        });
    } catch (error) {
        console.error('Error getting event:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'An internal server error occurred while retrieving the event.',
        });
    }
};


// delete events by ID 
exports.deleteEvent = async (req, res) => {
    try {
        const eventIdToDelete = req.params.id;

        const deletedEvent = await EventModel.findOneAndDelete({ '_id': eventIdToDelete });
        const deletedTicket = await TicketModel.findOneAndDelete({'event': eventIdToDelete });

        if (!deletedEvent) {
            return res.status(404).json({
                error: 'Event not found',
            });
        }

        res.status(200).json({
            message: 'Event deleted successfully',
            event: deletedEvent,
        });
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({
            error: 'Internal Server Error',
        });
    }
};