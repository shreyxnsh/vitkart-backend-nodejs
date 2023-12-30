
const router = require('express').Router();
const eventController = require('../controller/event.controller');

router.post('/createNewEvent', eventController.createEvent);
router.get('/getAllEvents', eventController.getAllEvents);
router.get('/getEvent/:id', eventController.getEventbyID);
router.put('/updateEvent/:id', eventController.updateEvent);
router.delete('/deleteEvent/:id', eventController.deleteEvent);

module.exports = router;
