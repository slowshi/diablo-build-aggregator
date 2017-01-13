define([
  'lodash'
], function(_) {
  'use strict';
  /**
   * StoreService
   * @function StoreService
   * @param {Object} registerCallbackService
   * @returns {Object}
   * */
  var StoreService = function StoreService(
    _registerCallbackService) {
    var registerCallbackService = _registerCallbackService;
    this.cbService = registerCallbackService.newInstance();
    this.storeData = {};
    this.dirty = false;
    this.initial = {};
  };

  StoreService.prototype = {
    /**
     * constructor
     * @function constructor
     * @param {Object} registerCallbackService
     * @returns {Object}
     * */
    constructor: StoreService,

    /**
     * Add a callback when the data is updated.
     * @function onUpdate
     * @param {Function} _next
     * @returns {Object}
     * */
    onUpdate: function onUpdate(_next) {
      return this.cbService.register('StoreData', _next);
    },

    /**
     * Gets clone of data.
     * @function getStoreData
     * @returns {Object}
     * */
    getStoreData: function getStoreData() {
      return _.cloneDeep(this.storeData);
    },

    /**
     * Updates the workspace data. Sets initial data state if needed.
     * @function updateStoreData
     * @param {Object} data
     * */
    updateStoreData: function updateStoreData(data) {
      if (_.isEmpty(this.initial)) {
        this.initial = data;
      }
      this.storeData = data;
      this.dirty = !_.isEqual(
        this.initial,
        this.storeData);
      this.cbService.next('StoreData', this.getStoreData());
    },

    /**
     * Sets the initial data set to the current.
     * @function updateInitialState
     * */
    updateInitialState: function updateInitialState() {
      this.initial = this.storeData;
      this.dirty = false;
    }
  };
  return StoreService;
});
