'use strict';

const siteUtils = require('../site-utils');
const logger = require('../logger')();

class KomputronikSite {
  constructor(uri) {
    if (!KomputronikSite.isSite(uri)) {
      throw new Error('invalid uri for Komputronik: %s', uri);
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
    //.prices .discount

    // the various ways we can find the price
    const selectors = [
      '.prices .proper',
    ];

    // find the price on the page
    const priceString = siteUtils.findContentOnPage($, selectors);

    // were we successful?
    if (!priceString) {
      logger.error('price not found on Komputronik page, uri: %s', this._uri);
      return -1;
    }

    // process the price string
    const price = siteUtils.processPrice(priceString);

    return price;
  }

  findCategoryOnPage($) {
    // TODO find the category
    const category = siteUtils.categories.OTHER;

    logger.log('category: %s', category);

    return category;
  }

  findNameOnPage($, category) {
    // the various ways we can find the name
    const selectors = [
      '#p-inner-name',
    ];

    // use the selectors to find the name on the page
    const name = siteUtils.findContentOnPage($, selectors);

    // were we successful?
    if (!name) {
      logger.error('name not found on Komputronik page, uri: %s', this._uri);
      return null;
    }

    logger.log('name: %s', name);

    return name.replace(/[\n\r]/gm, " ").replace(/\s+/gm, " ");
  }

  static isSite(uri) {
    if (uri.indexOf('komputronik.pl') > -1) {
      return true;
    } else {
      return false;
    }
  }
}

module.exports = KomputronikSite;
