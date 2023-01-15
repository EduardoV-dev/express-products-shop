const { ORDERS_FILE_PATH } = require('../consts/filesPath');
const { addData, getData } = require('../helpers/files');

const Cart = require('./cart');

const getOrdersFromFile = () => getData(ORDERS_FILE_PATH);

const getOrdersNextId = () => {
    const orders = getOrdersFromFile();

    if (orders.length === 0) return 1;

    return orders[orders.length - 1].id + 1;
};

module.exports = class Order {
    constructor(cart) {
        this.cart = cart;
    }

    addOrder() {
        const orders = getOrdersFromFile();

        const newOrders = [
            ...orders,
            {
                id: getOrdersNextId(),
                items: this.cart,
            },
        ];

        addData(ORDERS_FILE_PATH, newOrders);
        Cart.clearCart();
    }

    static getOrders() {
        return getOrdersFromFile();
    }
};
