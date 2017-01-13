define([
  'lodash'
], function(_) {
  'use strict';

  /**
   * Addes collbacks to list-array, makes string from callback fn
   * @function _addCbToList
   * @param {String} _type - key of event
   * @param {Function} _cb - callback function
   * @param {Object} _list - list of callbacks types
   * @private
   */
  var _addCbToList = function _addCbToList(_type, _cb, _list) {
    var cbStr = _cb.toString();

    if (typeof _list[_type] === 'undefined') {
      _list[_type] = {};
      _list[_type][cbStr] = _cb;
    } else if (typeof _list[_type][cbStr] === 'undefined') {
      _list[_type][cbStr] = _cb;
    }
  };

  /**
   * Removes callback from callbacks list
   * @function _removeFromList
   * @param {String} _type  - key of event
   * @param {Function} _cb - callback function
   * @private
   */
  var _removeFromList = function _removeFromList(_type, _cb) {
    if (typeof _cb !== 'function') {
      return;
    }
    var cbStr = _cb.toString();
    if (typeof this.nextList[_type] !== 'undefined' &&
    typeof this.nextList[_type][cbStr] !== 'undefined') {
      delete this.nextList[_type][cbStr];
      if (this.nextList[_type].length === 0) {
        delete this.nextList[_type];
      }
    }
    if (typeof this.errorList[_type] !== 'undefined' &&
    typeof this.errorList[_type][cbStr] !== 'undefined') {
      delete this.errorList[_type][cbStr];
      if (this.errorList[_type].length === 0) {
        delete this.errorList[_type];
      }
    }
  };

  /**
   * Service that registers callbacks
   * @function RegisterCallback
   * @class
   * */
  var RegisterCallback = function() {};

  /**
   * RegisterCallback service prototype
   * @typedef {Object} RegisterCallback
   * @lends RegisterCallback#
   * */
  RegisterCallback.prototype = {
    /**
     * @typedef {Object} nextList - next callbacks list
     */
    nextList: {},
    /**
     * @typedef {Object} errorList - error callbacks list
     */
    errorList: {},
    /**
     * Registers callbacks
     * @function register
     * @param {String} _type - key of event
     * @param {Function} _next - successful callback
     * @param {Function} _error - error callback
     * @return {Function}
     */
    register: function register(_type, _next, _error) {
      var _this = this;
      if (typeof _next === 'function') {
        _addCbToList(_type, _next, this.nextList);
      }
      if (typeof _error === 'function') {
        _addCbToList(_type, _error, this.errorList);
      }

      return function cancel() {
        _removeFromList.call(_this, _type, _next);
        _removeFromList.call(_this, _type, _error);
      };
    },
    /**
     * Adds successful callbacks to events in list of its
     * @function next
     * @param {String} _type - key of event
     * @param {Object} _data
     */
    next: function next(_type, _data) {
      if (typeof this.nextList[_type] === 'undefined') {
        return;
      }
      _.forEach(this.nextList[_type], function(_next) {
        _next(_data);
      });
    },
    /**
     * Adds error callbacks to events in list of error callbacks
     * @function next
     * @param {String} _type - key of event
     * @param {Object} _data
     */
    error: function error(_type, _data) {
      if (typeof this.errorList[_type] === 'undefined') {
        return;
      }
      _.forEach(this.errorList[_type], function(_error) {
        _error(_data);
      });
    },
    /**
     * Returns items from list of successful callbacks
     * @function getTypes
     * @return {Array}
     */
    getTypes: function getTypes() {
      return Object.keys(this.nextList);
    }
  };

  /**
   * Factory that returns newInstance of service what registers callbacks
   * @return {{newInstance: newInstance}}
   * @constructor
   */
  var RegisterCallbackFactory = function registerCallbackFactory() {
    return {
      newInstance: function() {
        return Object.create(RegisterCallback.prototype);
      }
    };
  };

  return RegisterCallbackFactory;
});
