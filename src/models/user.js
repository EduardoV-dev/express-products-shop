const MongoDB = require('mongodb');

const { getDb } = require('../lib/database');

module.exports = class User {
    constructor(_id, name, email) {
        this._id = _id;
        this.name = name;
        this.email = email;
    }

    async getCart() {
        const { cart } = await getDb()
            .collection('users')
            .findOne({ _id: this._id })
            .catch(console.error);

        return cart;
    }

    async addToCart(productId, productTitle) {
        let updatedCart = [];

        const cart = await this.getCart();
        const users = getDb().collection('users');
        const productIndex = cart.findIndex(
            item => item.productId === productId,
        );

        // Product does not exists in cart
        if (productIndex < 0)
            updatedCart = [
                ...cart,
                { productId, title: productTitle, quantity: 1 },
            ];
        // Product exists in cart
        else
            updatedCart = cart.map(item =>
                item.productId === productId
                    ? { ...item, quantity: item.quantity + 1 } // Increment quantity
                    : item,
            );

        return users
            .updateOne({ _id: this._id }, { $set: { cart: updatedCart } })
            .catch(console.error);
    }

    async removeFromCart(productId) {
        let updatedCart = [];

        const cart = await this.getCart();
        const users = getDb().collection('users');
        const newItemQuantity =
            cart.find(item => item.productId === productId).quantity - 1;

        // Remove item from cart if quantity is 0
        if (newItemQuantity <= 0)
            updatedCart = cart.filter(item => item.productId !== productId);
        else
            updatedCart = cart.map(item =>
                item.productId === productId
                    ? { ...item, quantity: newItemQuantity }
                    : item,
            );

        return users
            .updateOne({ _id: this._id }, { $set: { cart: updatedCart } })
            .catch(console.error);
    }

    getOrders() {
        return getDb()
            .collection('orders')
            .find({ 'user._id': this._id })
            .toArray()
            .catch(console.error);
    }

    async addOrder() {
        const cart = await this.getCart();
        const db = getDb();

        const user = {
            _id: this._id,
            name: this.name,
            email: this.email,
        };

        return db.collection('orders')
            .insertOne({ items: cart, user })
            .then(() =>
                db
                    .collection('users')
                    .updateOne({ _id: this._id }, { $set: { cart: [] } }), // Clear cart
            )
            .catch(console.error);
    }
};
