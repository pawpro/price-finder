'use strict';

const siteUtils = require('../site-utils');
const logger = require('../logger')();

class EuroComSite {
  constructor(uri) {
    if (!EuroComSite.isSite(uri)) {
      throw new Error('invalid uri for EuroCom: %s', uri);
    }

    this._uri = uri;
  }

  getURIForPageData() {
    return this._uri;
  }

  isJSON() {
    return false;
  }

  findPriceOnPage($) {
    const priceString = siteUtils.findContentOnPage($, ['#product-top .price-normal']);

    // were we successful?
    if (!priceString) {
      logger.error('price not found on EuroCom page, uri: %s', this._uri);
      return -1;
    }

    const price = siteUtils.processPrice(priceString);

    return price;
  }

  findCategoryOnPage($) {
    const category = siteUtils.categories.OTHER;

    logger.log('category: %s', '');

    return category;
  }

  findNameOnPage($, category) {
    const name = $('meta[property="og:title"]').attr('content');

    // were we successful?
    if (!name) {
      logger.error('name not found on EuroCom page, uri: %s', this._uri);
      return null;
    }

    logger.log('name: %s', name);

    return name.replace(/[\n\r]/gm, " ").replace(/\s+/gm, " ");
  }

  static isSite(uri) {
    if (uri.indexOf('www.euro.com.pl') > -1) {
      return true;
    } else {
      return false;
    }
  }
}

module.exports = EuroComSite;
