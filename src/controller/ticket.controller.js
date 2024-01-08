const TicketModel = require('../model/ticket.model');
const UserModel = require('../model/user.model');
const EventModel = require('../model/event.model');
const TicketTypeModel = require('../model/ticketType.model');

exports.createTicket = async (req, res) => {
    try {
        const { userID, eventID, ticketTypeId, discountCoupon } = req.body;

        // Fetch user and event details based on the provided IDs
        const user = await UserModel.findById(userID);
        const event = await EventModel.findById(eventID);

        // If user or event is not found, return an error
        if (!user || !event) {
            return res.status(404).json({ status:false, error: "User or Event not found" });
        }

        // Check if the user is already registered for the event
        const existingTicket = await TicketModel.findOne({ 'user._id': userID, 'event._id': eventID });

        if (existingTicket) {
            return res.status(400).json({status:false,  error: "User is already registered for this event" });
        }

        // Find the ticket in the event's tickets array
        const selectedTicketType = await TicketTypeModel.findOne({
            _id: ticketTypeId,
            event: eventID,
            availableQuantity: { $gt: 0 }, // Ensure available quantity is greater than 0
        });

        console.log(selectedTicketType.type, selectedTicketType.price, selectedTicketType.availableQuantity);

        if (!selectedTicketType) {
            return res.status(404).json({ status: false,  error: "No ticket found!" });
        }
        
        console.log(selectedTicketType.type, selectedTicketType.price, selectedTicketType.availableQuantity);
        TicketModel.syncIndexes()
        // Check if the selected ticket is still available
        if (selectedTicketType.availableQuantity <= 0) {
            return res.status(400).json({ status: false, error: "Selected ticket is sold out" });
        }
        
        // Calculate the totalAmount based on the selected ticket price
        const totalAmount = selectedTicketType.price;

        const newTicket = new TicketModel({
            user,
            event,
            totalAmount,
            discountCoupon,
            isCheckIn: false,
            selectedTicketType: {
                _id: selectedTicketType._id,
                type: selectedTicketType.type,
                price: selectedTicketType.price,
                availableQuantity: selectedTicketType.availableQuantity,
                discountCoupon: selectedTicketType.discountCoupon,
                discountCouponLimit: selectedTicketType.discountCouponLimit,
                discountAmount: selectedTicketType.discountAmount,
            },
        });
        
        
        // Update the soldQuantity and availableQuantity for the selected ticket in the event
        selectedTicketType.soldQuantity += 1;
        selectedTicketType.availableQuantity -= 1;
        
        // Save the Ticket and update the event in a single transaction
        const session = await TicketModel.startSession();
        session.startTransaction();
        
        try {
            await newTicket.save();
            await event.save();
            await session.commitTransaction();
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
        
        // Return success response
        res.status(201).json({ message: "Ticket created successfully", status: true, Ticket: newTicket});
    } catch (error) {
        // Handle any errors that occur during the process
        console.error(error);
        res.status(500).json({ status: false, error: "Internal Server Error" });
    }
};



exports.getTickets = async (req, res) => {
    try {
        const Tickets = await TicketModel.find({});
        if (!Tickets) {
            return res.status(404).json({
                error: 'No Tickets Found',
                status: false,
            });
        }
        res.json({
            message: 'Tickets retrieved successfully',
            status: true,
            Tickets: Tickets,
        });
    } catch (error) {
        console.error('Error getting Tickets:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            status: false,
        });
    }
};

// get Ticket by ID
exports.getTicketbyID = async (req, res) => {
    try {
        const ticketID = req.query.getTicketbyID;

        const Ticket = await TicketModel.findById(ticketID);

        if (!Ticket) {
            return res.status(404).json({
                error: 'Ticket not found',
                status: false,
                message: 'The requested Ticket does not exist.',
            });
        }

        res.status(200).json({
            message: 'Ticket retrieved successfully',
            status: true,
            Ticket,
        });
    } catch (error) {
        console.error('Error getting Ticket:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            status: false,
            message: 'An internal server error occurred while retrieving the Ticket.',
        });
    }
};

exports.deleteTicket = async (req, res) => {
    try {
        const eventTicketIDToDelete = req.params.id;

        const deletedTicket = await TicketModel.findOneAndDelete({ '_id': eventTicketIDToDelete });

        if (!deletedTicket) {
            return res.status(404).json({ error: 'Ticket not found' });
        }

        res.status(200).json({ message: 'Ticket deleted successfully', status: true, Ticket: deletedTicket});
    } catch (error) {
        console.error('Error deleting Ticket:', error);
        res.status(500).json({ status: false, error: 'Internal Server Error' });
    }
};

// Access only for event host

// Feature: CheckIn guest
exports.checkIn = async (req, res) => {
    try {
        const ticketIdtoCheck = req.query.id;

        const existingTicket = await TicketModel.findById(ticketIdtoCheck);

        if (existingTicket?.isCheckIn) {
            return res.json({ status: false, message: 'Guest already checked in', ticket: existingTicket });
        }

        const updatedTicket = await TicketModel.findByIdAndUpdate(
            ticketIdtoCheck,
            { $set: { isCheckIn: true } },
            { new: true }
        );

        if (!updatedTicket) {
            return res.status(404).json({ status: false, error: 'Guest not found' });
        }

        res.json({ status: true, message: 'Guest checked in successfully', ticket: updatedTicket });
    } catch (error) {
        console.error('Error updating guest checked in status:', error);
        res.status(500).json({ status: false, error: 'Internal Server Error' });
    }
};


// Feature: Undo guest checkIn

exports.undoCheckIn = async (req, res) => {
    try {
        const ticketIdtoUncheck = req.query.id;

        const existingTicket = await TicketModel.findById(ticketIdtoUncheck);

        if (!existingTicket?.isCheckIn) {
            return res.json({message: 'Guest not checkedIn', status: false, ticket: existingTicket });
        }

        const updatedTicket = await TicketModel.findByIdAndUpdate(
            ticketIdtoUncheck,
            { $set: { isCheckIn: false } },
            { new: true }
        );


        if (!updatedTicket) {
            return res.status(404).json({ error: 'Guest not found', status: false });
        }

        res.json({
            message: 'Guest unchecked successfully',
            status: true,
            Ticket: updatedTicket,
        });
    } catch (error) {
        console.error('Error updating guest checked in status:', error);
        res.status(500).json({ status: false, error: 'Internal Server Error' });
    }
};

