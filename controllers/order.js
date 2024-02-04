const Joi = require('joi');
const jwt = require('jsonwebtoken');
const db = require('../models');

const createOrderSchema = Joi.object({
    items: Joi.array().items({
        groceryItemId: Joi.number().required(),
        quantity: Joi.number().integer().min(1).required(),
    }).required(),
});

const createOrder = async (req, res) => {
    try {
        // Validate the request body
        const { error } = createOrderSchema.validate(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }

        const { items } = req.body;

        // Get user ID from decoded token
        const userId = req.user.id;

        // Check if the user exists
        const user = await db.User.findByPk(userId);
        if (!user) {
            return res.status(404).send('User not found');
        }

        // Check inventory levels for each item
        for (const item of items) {
            const { groceryItemId, quantity } = item;

            // Check if the grocery item exists
            const groceryItem = await db.GroceryItem.findByPk(groceryItemId);
            if (!groceryItem) {
                return res.status(404).send(`Grocery item with ID ${groceryItemId} not found`);
            }

            // Check if there is enough inventory
            if (groceryItem.inventory < quantity) {
                return res.status(400).send(`Insufficient inventory for item with ID ${groceryItemId}`);
            }
        }

        // Create a new order
        const order = await db.Order.create({
            userId,
            status: 'pending', // Set the default status as 'pending'
        });

        // Deduct inventory and add order items
        for (const item of items) {
            const { groceryItemId, quantity } = item;

            // Deduct inventory
            const groceryItem = await db.GroceryItem.findByPk(groceryItemId);
            groceryItem.inventory -= quantity;
            await groceryItem.save();

            // Create an order item
            await db.OrderItem.create({
                orderId: order.id,
                groceryItemId,
                quantity,
            });
        }

        return res.status(201).json(order);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Error creating order');
    }
};

module.exports = {
    createOrder,
};
