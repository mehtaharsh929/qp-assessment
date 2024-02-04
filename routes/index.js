const express = require('express');
const cors = require('cors'); // Import cors middleware
const { registerUser, signInUser } = require('../controllers/auth');
const { createGrocery, getAllGroceryItems, removeGroceryItem, updateGroceryItemOrInventory } = require('../controllers/grocery');
const { createOrder } = require('../controllers/order');
const { authenticateJWT, isAdmin, isUser } = require('../middleware');
const router = express.Router();


// Registration route
router.post('/sign-up', registerUser);

// Signin route
router.post('/sign-in', signInUser);

// Middleware for JWT authentication
router.use(authenticateJWT);

// Create grocery
router.post('/create/grocery',isAdmin, createGrocery);

// Get groceries
router.get('/grocerys', getAllGroceryItems);

// Delete grocery using id
router.delete('/grocery-items/:id',isAdmin, removeGroceryItem);

// Update grocery using id
router.patch('/grocery-items/:id',isAdmin ,updateGroceryItemOrInventory);

// Create order
router.post('/order',isUser, createOrder);

module.exports = router;
