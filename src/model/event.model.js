const mongoose = require('mongoose');

// create user schema
const{Schema} = mongoose;

// schema for the todo items
const eventInfoSchema = new Schema({
    eventName: {
        type: String,
        required: true,
    },
    eventDate: {
        type: Date,
        required: true,
    },
    eventTime: {
        type: String,
        required: true,
    },
    eventVenue: {
        type: String,
        required: true,
    },
    eventOrg: {
        type: String,
        required: true,
    },
    eventLogo: {
        type: String,
        required: false,
    },
    eventClubLogo: {
        type: String,
        required: true,
    },
    eventDesc: {
        type: String,
        required: true,
    },
    clubAdmin: {
        type: Schema.Types.ObjectId, // reference to the user_.id in userModel in MongoDb
        required: true,
    },
    eventTicketTypes: [
        {
            type: Schema.Types.ObjectId,
            ref: 'TicketType',
        }
    ]
});

// this line will name the collection in the db
const eventModel = mongoose.model('Events', eventInfoSchema);

module.exports = eventModel;