'use strict';

/**
 * state-board service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::state-board.state-board');
