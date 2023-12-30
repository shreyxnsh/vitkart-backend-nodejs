const EventModel = require('../model/event.model');
const TicketTypeModel = require('../model/ticketType.model');
const TicketModel = require('../model/ticket.model');

exports.createTicketType = async (req, res) => {
    try {
        const { eventId, type, ...ticketData } = req.body;
        console.log('Received eventId:', eventId);
        console.log('Received ticketType:', type);

        // Check if the provided eventId exists
        const existingEvent = await EventModel.findById(eventId);
        console.log('Existing Event:', existingEvent);

        if (!existingEvent) {
            return res.status(404).json({ error: 'Event not found' });
        }

        // Check if a ticket with the same ticketType already exists for the given event
        const existingTicketType = await TicketTypeModel.findOne({ 'ticketType': type, 'event': eventId });

        if (existingTicketType) {
            return res.status(400).json({ error: "Ticket already exists" });
        }

        // Associate the ticket with the specified event
        const newTicket = new TicketTypeModel({
            ...ticketData,
            ticketType: type,
            event: existingEvent._id,
        });

        // Save the new ticket
        const savedTicket = await newTicket.save();

        // Add the new ticket to the event's ticket array
        existingEvent.eventTickets.push(savedTicket._id);
        await existingEvent.save();

        res.status(201).json({
            message: 'Ticket Type created successfully',
            ticket: savedTicket,
        });
    } catch (error) {
        // Handle errors
        console.error('Error creating ticket:', error);

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
                message: 'Duplicate key error. This ticket type already exists.',
            });
        } else {
            // General internal server error
            res.status(500).json({
                error: 'Internal Server Error',
            });
        }
    }
};

exports.getEventTicketTypes = async (req, res) => {
    try {
        const eventId = req.params.id;

        // Check if eventId is provided
        if (!eventId) {
            return res.status(400).json({
                error: 'eventId parameter is required',
            });
        }

        // Find tickets related to the specified event
        const ticketTypes = await TicketTypeModel.find({ event: eventId });

        if (!ticketTypes || ticketTypes.length === 0) {
            return res.status(404).json({
                error: 'No Ticket type Found for the specified event',
            });
        }

        res.json({
            message: 'Ticket Types retrieved successfully',
            ticketTypes: tickets,
        });
    } catch (error) {
        console.error('Error getting ticket types:', error);
        res.status(500).json({
            error: 'Internal Server Error',
        });
    }
};


exports.getTicketTypebyID = async (req, res) => {
    try {
        const ticketTypeId = req.params.id;

        const ticketType = await TicketTypeModel.findById({'_id':ticketTypeId});

        if (!ticketType) {
            return res.status(404).json({
                error: 'Ticket not found',
                message: 'The requested ticket does not exist.',
            });
        }

        res.status(200).json({
            message: 'Ticket retrieved successfully',
            ticketType: ticketType,
        });
    } catch (error) {
        console.error('Error getting ticcketType:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'An internal server error occurred while retrieving the ticketType.',
        });
    }
};



exports.deleteTicketType = async (req, res) => {
    try {
        const ticketTypeId = req.params.id;

        // Check if ticketTypeId is provided
        if (!ticketTypeId) {
            return res.status(400).json({
                error: 'ticketTypeId parameter is required',
            });
        }
        const deletedTicketType = await TicketTypeModel.findOneAndDelete({ '_id': ticketTypeId });
        const deletedTicketTypeFromEvent = await EventModel.findOneAndUpdate(
            { 'eventTickets': ticketTypeId },
            { $pull: { 'eventTickets': ticketTypeId } },
            { new: true }
        );
        if (!deletedTicketTypeFromEvent){
            return res.status(404).json({error: 'TicketType not found in event'})
        }

        if (!deletedTicketType) {
            return res.status(404).json({ error: 'TicketType not found' });
        }

        res.status(200).json({
            message: 'Ticket Type deleted from event and ticketType successfully',
            Ticket: deletedTicket,
        });
    } catch (error) {
        console.error('Error deleting ticketType :', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
