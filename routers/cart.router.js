const router = require('express').Router();
const cartController = require('../controller/cart.controller');

router.post('/addToCart', cartController.addToCart);
router.get('/getCart', cartController.getCart);
router.put('/updateCartProduct', cartController.updateCartProduct);
router.delete('/removeFromCart', cartController.removeFromCart);

module.exports = router;
