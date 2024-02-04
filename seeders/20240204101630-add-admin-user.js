'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
// Add admin users
await queryInterface.bulkInsert('Users', [
  {
    name: 'Admin 1',
    email: 'admin1@example.com',
    password: 'Password@123',
    role: 'admin',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Admin 2',
    email: 'admin2@example.com',
    password: 'Password@123',
    role: 'admin',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // Add more admin users if needed
], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', { role: 'admin' }, {});
  }
};
