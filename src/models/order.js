const { Schema, model } = require('mongoose');

const schema = new Schema({
    items: [
        {
            productId: {
                type: Schema.Types.ObjectId,
                ref: 'Product',
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
        },
    ],
    user: {
        name: { type: String, required: true },
        userId: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    },
});

module.exports = model('Order', schema);
