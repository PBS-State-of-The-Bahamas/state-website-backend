'use strict';

/**
 * state-history service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::state-history.state-history');
