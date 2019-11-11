'use strict';

const siteUtils = require('../site-utils');
const logger = require('../logger')();

class XKomSite {
  constructor(uri) {
    if (!XKomSite.isSite(uri)) {
      throw new Error('invalid uri for XKom: %s', uri);
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
    const regularPriceString = $('meta[property="product:price:amount"]').attr('content')
    const salePriceString = $('meta[property="product:sale_price:amount"]').attr('content')

    if (!regularPriceString) {
      logger.error('price not found on XKom page, uri: %s', this._uri);
      return -1;
    }

    const price = siteUtils.processPrice(salePriceString || regularPriceString);

    return price;
  }

  findCategoryOnPage($) {
    const category = $('meta[property="product:category"]').attr('content')

    logger.log('category: %s', category);

    return category;
  }

  findNameOnPage($, category) {
    const name = $('meta[property="og:title"]').attr('content');

    // were we successful?
    if (!name) {
      logger.error('name not found on XKom page, uri: %s', this._uri);
      return null;
    }

    logger.log('name: %s', name);

    return name.replace(/[\n\r]/gm, " ").replace(/\s+/gm, " ");
  }

  static isSite(uri) {
    if (uri.indexOf('x-kom.pl') > -1) {
      return true;
    } else {
      return false;
    }
  }
}

module.exports = XKomSite;
