const { Schema, model } = require('mongoose');

const schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    cart: [
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
});

schema.methods.addToCart = function addToCart(productId) {
    let updatedCart = [];

    const productIndex = this.cart.findIndex(
        item => item.productId.toString() === productId,
    );

    // Product does not exists in cart
    if (productIndex < 0)
        updatedCart = [...this.cart, { productId, quantity: 1 }];
    // Product exists in cart
    else
        updatedCart = this.cart.map(item =>
            item.productId.toString() === productId
                ? { ...item, quantity: item.quantity + 1 } // Increment quantity
                : item,
        );

    this.cart = updatedCart;
    return this.save();
};

schema.methods.removeFromCart = function removeFromCart(productId) {
    let updatedCart = [];

    const newItemQuantity =
        this.cart.find(item => item.productId.toString() === productId)
            .quantity - 1;

    // Remove item from cart if quantity is 0
    if (newItemQuantity <= 0)
        updatedCart = this.cart.filter(
            item => item.productId.toString() !== productId,
        );
    else
        updatedCart = this.cart.map(item =>
            item.productId.toString() === productId
                ? { ...item, quantity: newItemQuantity }
                : item,
        );

    this.cart = updatedCart;
    return this.save();
};

schema.methods.clearCart = function clearCart() {
    this.cart = [];
    return this.save();
}

module.exports = model('User', schema);
