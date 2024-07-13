'use strict';
/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      firebase_id: { type: Sequelize.STRING, allowNull: false },
      name: { type: Sequelize.STRING, allowNull: false },
      email: { type: Sequelize.STRING, allowNull: false, unique: false },
      password: { type: Sequelize.STRING, allowNull: false },
      balance: { type: Sequelize.FLOAT, defaultValue: 0 },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });

    await queryInterface.addIndex('Users', ['firebase_id'], {
      name: 'firebase_id_hash_index',
      using: 'hash',
    });
  },
  
  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('Users', 'firebase_id_hash_index');
    await queryInterface.dropTable('Users');
  }
};