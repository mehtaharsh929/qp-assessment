// validation/groceryItemSchema.js
const Joi = require('joi');
const groceryitem = require('../models/groceryitem');
const db = require('../models');

const groceryItemSchema = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().min(0).required(),
    inventory: Joi.number().integer().min(0).required(),
});


const createGrocery = async (req, res) => {
    try {
        // Validate the request body
        const { error } = groceryItemSchema.validate(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }

        const { name, price, inventory } = req.body;

        // Create a new grocery item
        const newGroceryItem = await db.GroceryItem.create({
            name,
            price,
            inventory,
        });

        // Respond with the created grocery item
        res.status(201).json(newGroceryItem);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getAllGroceryItems = async (req, res) => {
    try {
        // Extract query parameters from the request
        const { page = 1, limit = 10, sortBy = 'name', sortOrder = 'asc', search = '' } = req.query;

        const options = {
            limit: parseInt(limit),
            offset: (page - 1) * limit,
            order: [[sortBy, sortOrder.toUpperCase()]],
            where: {
                name: { [db.Sequelize.Op.iLike]: `%${search}%` },
            },
        };

        // Fetch grocery items with options
        const groceryItems = await db.GroceryItem.findAll(options);

        // Count total number of items
        const totalCount = await db.GroceryItem.count({ where: options.where });

        // Calculate total pages for pagination
        const totalPages = Math.ceil(totalCount / limit);

        // Return the results along with pagination information
        return res.status(200).json({
            groceryItems,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages,
                totalCount,
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send('Error retrieving grocery items');
    }
};

const removeGroceryItem = async (req, res) => {
    try {
        const itemId = req.params.id;

        // Check if the grocery item exists
        const groceryItem = await db.GroceryItem.findByPk(itemId);

        if (!groceryItem) {
            return res.status(404).send('Grocery item not found');
        }

        // Remove the grocery item
        await groceryItem.destroy();

        return res.status(200).send('Grocery item removed successfully');
    } catch (error) {
        console.error(error);
        return res.status(500).send('Error removing grocery item');
    }
};

const updateGroceryItemOrInventory = async (req, res) => {
    try {
        const itemId = req.params.id;
        const { name, price, action, quantity } = req.body;

        // Check if the grocery item exists
        const groceryItem = await db.GroceryItem.findByPk(itemId);

        if (!groceryItem) {
            return res.status(404).send('Grocery item not found');
        }

        // Update the grocery item details if provided
        if (name) groceryItem.name = name;
        if (price) groceryItem.price = price;

        if (action && quantity !== undefined) {
            // Manage inventory levels based on the action (increase, decrease, or override)
            if (action === 'increase') {
                groceryItem.inventory += quantity;
            } else if (action === 'decrease') {
                if (groceryItem.inventory < quantity) {
                    return res.status(400).send('Insufficient inventory');
                }
                groceryItem.inventory -= quantity;
            } else if (action === 'override') {
                groceryItem.inventory = quantity;
            } else {
                return res.status(400).send('Invalid action. Use "increase", "decrease", or "override"');
            }
        }

        // Save the changes
        await groceryItem.save();

        return res.status(200).json(groceryItem);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Error updating grocery item or managing inventory');
    }
};


module.exports = {
    createGrocery,
    getAllGroceryItems,
    removeGroceryItem,
    updateGroceryItemOrInventory
}
