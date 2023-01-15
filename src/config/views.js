module.exports = {
    SHOP: {
        PRODUCTS: {
            VIEW: 'shop/products',
            PATH: '/shop/products',
            TITLE: 'Shop | List of Products',
        },
        CART: {
            VIEW: 'shop/cart',
            PATH: '/shop/cart',
            TITLE: 'Shop | Cart of Products',
        },
        DETAILED_VIEW: {
            VIEW: 'shop/detailed',
            PATH: '/shop/products/detail/:productId',
            TITLE: 'Shop |',
        },
        ORDERS: {
            VIEW: 'shop/orders',
            PATH: '/shop/orders',
            TITLE: 'Shop | Orders',
        },
    },
    ADMIN: {
        PRODUCTS: {
            VIEW: 'admin/products',
            PATH: '/admin/products',
            TITLE: 'Admin | Products',
        },
        FORM: {
            VIEW: 'admin/product-form',
            PATH: '/admin/product-form',
            TITLE: 'Admin | Add Product',
        },
    },
    ERROR: {
        PAGE_NOT_FOUND: {
            VIEW: 'error/page-not-found',
            PATH: '',
            TITLE: 'Page Not Found',
        },
    },
};
