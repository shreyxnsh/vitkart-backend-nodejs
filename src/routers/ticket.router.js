const router = require('express').Router();
const TicketController = require('../controller/ticket.controller');

// Create a new ticket
router.post('/createNewTicket', TicketController.createTicket);

// Get all tickets
router.get('/getTicket', TicketController.getTickets);

// Get by ticketID
router.get('/', TicketController.getTicketbyID);

// Delete ticket
router.delete('/deleteTicket', TicketController.deleteTicket);

// CheckIn guest
router.patch('/checkIn', TicketController.checkIn);

// Undo guest checkIn
router.patch('/undoCheckIn', TicketController.undoCheckIn);

module.exports = router;

