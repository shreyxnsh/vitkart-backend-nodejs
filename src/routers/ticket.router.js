const router = require('express').Router();
const TicketController = require('../controllers/ticket.controller');

router.post('/createNewTicket', ticketController.createTicket);
router.post('/createNewTicket', TicketController.createTicket);
router.get('/getTicket', TicketController.getTickets);
// updateOrder updates the orderID 
router.get('/getTicketbyID/:id', TicketController.getTicketbyID);
// deleteOrder deletes using the _id
router.delete('/deleteTicket/:id', TicketController.deleteTicket);
// Undo guest checkIn
router.patch('/undoCheckIn/:id', TicketController.undoCheckIn);

module.exports = router;

