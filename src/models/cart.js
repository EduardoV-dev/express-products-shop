const { CART_FILE_PATH } = require('../consts/filesPath');
const { getData, addData } = require('../helpers/files');

const getCartFromFile = () => getData(CART_FILE_PATH);

const existsProductInCart = (cart, productId) =>
    cart.some(item => item.id === Number(productId));

const increaseQuantity = productId =>
    getCartFromFile().find(product => product.id === Number(productId))
        .quantity + 1;

const REMOVE_WILDCARD = 'remove';

module.exports = class Cart {
    constructor(id, title) {
        this.id = id;
        this.title = title;
    }

    static getCart() {
        return getCartFromFile();
    }

    static clearCart() {
        addData(CART_FILE_PATH, []);
    }

    static removeFromCart(id) {
        const cart = getCartFromFile();
        const newCart = cart.map(item => {
            if (item.id === Number(id))
                return item.quantity > 1
                    ? { ...item, quantity: item.quantity - 1 }
                    : { id: REMOVE_WILDCARD };

            return item;
        });

        addData(
            CART_FILE_PATH,
            newCart.filter(item => item.id !== REMOVE_WILDCARD),
        );
    }

    save() {
        const cart = getCartFromFile();
        let newCart = [];

        if (existsProductInCart(cart, this.id)) {
            newCart = cart.map(item =>
                item.id === this.id
                    ? { ...item, quantity: increaseQuantity(this.id) }
                    : item,
            );
        } else {
            newCart = [...cart, { ...this, quantity: 1 }];
        }

        addData(CART_FILE_PATH, newCart);
    }
};
