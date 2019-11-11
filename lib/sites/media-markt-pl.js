'use strict';

const siteUtils = require('../site-utils');
const logger = require('../logger')();
const _ = require('lodash');

class MediaMarktPlSite {
  constructor(uri) {
    if (!MediaMarktPlSite.isSite(uri)) {
      throw new Error('invalid uri for MediaMarktPl: %s', uri);
    }

    this._uri = uri;
  }

  getURIForPageData() {
    return this._uri;
  }

  getUserAgent() {
    return siteUtils.getUserAgent();
  }

  getUserLang() {
    return siteUtils.getUserLang();
  }

  getUserAccept() {
    return siteUtils.getUserAccept();
  }

  isJSON() {
    return false;
  }

  findPriceOnPage($) {
    const selector = '#js-rightContent .js-pre-add-cart';
    const jQuery = _.isFunction($.find) ? $.find.bind($) : $;
    const priceString = jQuery(selector).attr('data-offer-price')
    // were we successful?
    if (!priceString) {
      logger.error('price not found on MediaMarktPl page, uri: %s', this._uri);
      return -1;
    }

    // process the price string
    const price = siteUtils.processPrice(priceString);

    return price;
  }

  findCategoryOnPage($) {
    const selector = '#js-rightContent .js-pre-add-cart';
    const jQuery = _.isFunction($.find) ? $.find.bind($) : $;
    const category = jQuery(selector).attr('data-offer-category')

    logger.log('category: %s', category);

    return category;
  }

  findNameOnPage($, category) {
    const selector = '#js-rightContent .js-pre-add-cart';
    const jQuery = _.isFunction($.find) ? $.find.bind($) : $;
    const name = jQuery(selector).attr('data-offer-name')


    // were we successful?
    if (!name) {
      logger.error('name not found on MediaMarktPl page, uri: %s', this._uri);
      return null;
    }

    logger.log('name: %s', name);

    return name.replace(/[\n\r]/gm, " ").replace(/\s+/gm, " ");
  }

  static isSite(uri) {
    if (uri.indexOf('mediamarkt.pl') > -1) {
      return true;
    } else {
      return false;
    }
  }
}

module.exports = MediaMarktPlSite;
