const router = require('express').Router();
const TicketController = require('../controller/ticket.controller');

router.post('/createNewTicket', TicketController.createTicket);
// router.post('/createNewTicket', TicketController.createTicket);
router.get('/getTicket', TicketController.getTickets);
// updateOrder updates the ticketID 
router.get('/getTicketbyID', TicketController.getTicketbyID);
// deleteOrder deletes using the _id
router.delete('/deleteTicket/:id', TicketController.deleteTicket);
// Undo guest checkIn
router.patch('/undoCheckIn/:id', TicketController.undoCheckIn);

module.exports = router;

