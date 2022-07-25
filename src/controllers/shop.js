const { SHOP } = require('../config/views');
const Product = require('../models/product');

exports.getShopProducts = async (req, res) => {
    try {
        const products = await Product.findAll();

        res.render(SHOP.PRODUCTS.VIEW, {
            title: SHOP.PRODUCTS.TITLE,
            products,
        });
    } catch (err) {
        console.log(err);
    }
};

exports.getCart = async (req, res) => {
    try {
        const userCart = await req.user.getCart();
        const userCartProducts = await userCart.getProducts();
        console.log(JSON.stringify(userCartProducts, null, 2));

        res.render(SHOP.CART.VIEW, {
            title: SHOP.CART.TITLE,
            cart: userCartProducts,
        });
    } catch (err) {
        console.log(err);
    }
};

exports.postAddItemToCart = async (req, res) => {
    const { productId } = req.body;

    try {
        const userCart = await req.user.getCart();
        const [cartProduct] = await userCart.getProducts({
            where: { id: productId },
        });

        const product = await Product.findByPk(productId);

        const quantity = cartProduct ? cartProduct.cartItem.quantity + 1 : 1;

        await userCart.addProduct(product, { through: { quantity } });

        res.redirect(SHOP.CART.PATH);
    } catch (err) {
        console.log(err);
    }
};

exports.deleteCartItem = async (req, res) => {
    const { productId } = req.body;

    try {
        const userCart = await req.user.getCart();
        const [cartProduct] = await userCart.getProducts({
            where: { id: productId },
        });

        const cartProductItem = cartProduct.cartItem;

        cartProductItem.quantity > 1
            ? cartProductItem.update({
                  quantity: cartProductItem.quantity - 1,
              })
            : cartProductItem.destroy();

        res.redirect(SHOP.CART.PATH);
    } catch (err) {
        console.log(err);
    }
};

exports.getDetailedView = async (req, res) => {
    const { productId } = req.params;

    try {
        const [product] = await Product.findAll({ where: { id: productId } });

        res.render(SHOP.DETAILED_VIEW.VIEW, {
            title: `${SHOP.DETAILED_VIEW.TITLE} ${product.title}`,
            product,
        });
    } catch (err) {
        console.log(err);
    }
};
