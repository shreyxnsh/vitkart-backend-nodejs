const router = require('express').Router();
const ticketTypeController = require('../controller/ticketType.controller');


router.post('/createticketType', ticketTypeController.createTicketType);

// Finds tickets for that event 
router.get('/getTicketTypebyId/:id', ticketTypeController.getTicketTypebyID);

//Takes Event Id to retrive data
router.get('/getEventTicketType/:id', ticketTypeController.getEventTicketTypes);

// router.put('/event/updateEvent/:id', ticketTypeController.updateEvent);
router.delete('/deleteTicketType/:id', ticketTypeController.deleteTicketType);

module.exports = router;
