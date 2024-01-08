const mongoose = require('mongoose');
const userModel = require('./user.model');
const eventModel = require('./event.model');

const { Schema } = mongoose;

// Define the schema for the Order collection
const ticketSchema = new Schema({
    // Reference to the user document using the userModel schema
    user: {
        type: userModel.schema,
        required: true,
    },
    // Reference to the event document using the eventModel schema
    event: {
        type: eventModel.schema,
        required: true,
    },
    // Check-in status with a default value of false
    isCheckIn: {
        type: Boolean,
        default: false,
    },

    appliedDiscount: {
        type: Number,
        default: 0,
    },
    
    totalAmount: {
        type: Number,
        required: true,
    },
    selectedTicketType: {
        _id: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        availableQuantity: {
            type: Number,
            required: true,
        },
        soldQuantity: {
            type: Number,
            default: 0,
        },
        discountCoupon: {
            type: String,
        },
        discountCouponLimit: {
            type: Number,
        },
        discountAmount: {
            type: Number,
        },
    },

});

// ticketSchema.index({ 'user.userRegID': 1, 'event': 1, 'selectedTicketType._id': 1 }, { unique: true });


// Create a model for the Order collection in the MongoDB database
const TicketModel = mongoose.model('ticket', ticketSchema);

// Export the orderModel for use in other files/modules
module.exports = TicketModel;
