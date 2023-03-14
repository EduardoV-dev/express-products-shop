const deleteProduct = async button => {
    try {
        const buttonParent = button.parentNode;
        const productId = buttonParent.querySelector('[name=productId]').value;

        await fetch(`/admin/products/${productId}`, {
            method: 'DELETE',
        });

        const productItem = buttonParent.parentNode;
        const productList = productItem.parentNode;

        productList.removeChild(productItem);
    } catch (error) {
        console.error(error);
    }
};
