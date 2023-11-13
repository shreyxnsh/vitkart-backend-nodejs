const router = require('express').Router();
const cartController = require('../src/../controller/cart.controller');

router.post('/addToCart', cartController.addToCart);
router.get('/getCart', cartController.viewCart);
router.put('/updateCartProduct', cartController.updateCart);
router.delete('/removeFromCart', cartController.deleteFromCart);

module.exports = router;
