'use strict';

/**
 * e-board service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::e-board.e-board');
