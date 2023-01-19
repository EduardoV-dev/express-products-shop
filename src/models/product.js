const MongoDB = require('mongodb');

const { getDb } = require('../lib/database');

module.exports = class Product {
    constructor(title, imageURL, price, description, userId) {
        this.title = title;
        this.imageURL = imageURL;
        this.price = price;
        this.description = description;
        this.userId = userId;
    }

    static getProducts(userId) {
        return getDb()
            .collection('products')
            .find({ userId })
            .toArray()
            .catch(console.error);
    }

    static getProductById(id) {
        return getDb()
            .collection('products')
            .findOne({ _id: new MongoDB.ObjectId(id) })
            .catch(console.error);
    }

    static deleteProductById(id) {
        return getDb()
            .collection('products')
            .deleteOne({ _id: new MongoDB.ObjectId(id) })
            .catch(console.error);
    }

    save() {
        return getDb()
            .collection('products')
            .insertOne(this)
            .catch(console.error);
    }

    edit(productId) {
        return getDb()
            .collection('products')
            .updateOne(
                { _id: new MongoDB.ObjectId(productId) },
                {
                    $set: {
                        title: this.title,
                        imageURL: this.imageURL,
                        price: this.price,
                        description: this.description,
                    },
                },
            )
            .catch(console.error);
    }
};
