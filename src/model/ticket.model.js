const mongoose = require('mongoose');
const db = require('../config/database');
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
        required: false,
    },
    
    totalAmount: {
        type: Number,
        required: true,
    },
    selectedType: {
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
            required: false,
        },
        discountCouponLimit: {
            type: Number,
            required: false,
        },
        discountAmount: {
            type: Number,
            required: false,
        },
    },

});

ticketSchema.index({ 'user': 1, 'event': 1 }, { unique: true });

// Create a model for the Order collection in the MongoDB database
const TicketModel = db.model('ticket', ticketSchema);

// Export the orderModel for use in other files/modules
module.exports = TicketModel;
