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
    onUpdate: function onUpdate(_id, _next) {
      var id = _id || 'StoreService';
      return this.cbService.register(id, _next);
    },

    /**
     * Gets clone of data.
     * @function getStoreData
     * @returns {Object}
     * */
    getStoreData: function getStoreData(_id) {
      var id = _id || 'StoreService';
      return _.cloneDeep(this.storeData[id]);
    },

    /**
     * Updates the workspace data. Sets initial data state if needed.
     * @function updateStoreData
     * @param {Object} data
     * */
    updateStoreData: function updateStoreData(_id, data) {
      var id = _id || 'StoreService';
      if (_.isEmpty(this.initial)) {
        if(this.initial[id] == void 0) {
          this.initial[id] = data;
        }
        this.initial[id] = data;
      }
      if(this.storeData[id] == void 0) {
        this.storeData[id] = data;
      }
      this.storeData[id] = data;
      this.dirty = !_.isEqual(
        this.initial[id],
        this.storeData[id]);
      this.cbService.next(id, this.getStoreData());
    },

    /**
     * Sets the initial data set to the current.
     * @function updateInitialState
     * */
    updateInitialState: function updateInitialState(_id) {
      var id = _id || 'StoreService';
      this.initial[id] = this.storeData[id];
      this.dirty = false;
    }
  };
  return StoreService;
});
