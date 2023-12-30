const mongoose = require('mongoose');

const { Schema } = mongoose;

const ticketTypeSchema = new Schema({
    // Reference to the Events model using the _id field
    event: {
        type: Schema.Types.ObjectId,
        ref: 'Events',
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        default: 0,
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
}, { timestamps: true });

ticketTypeSchema.index({ event: 1, type: 1 }, { unique: true });

const TicketTypeModel = mongoose.model('TicketType', ticketTypeSchema);

module.exports = TicketTypeModel;
