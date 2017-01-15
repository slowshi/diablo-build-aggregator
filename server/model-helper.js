var _ = require('lodash');
/**
 * Transforms nested object using _transformation function
 * @function _transformNestedObject
 * @param {Object|Array} _source - source data to transform
 * @param {Function} _transformationFn - transformation function
 * @return {Object}
 * @private
 */
var _transformNestedObject = function transformNestedObject(_source, _transformationFn) {
  if (typeof _transformationFn !== 'function') {
    return;
  }
  var dest = {};
  if (Array.isArray(_source)) {
    dest = [];
  }

  for (var key in _source) {
    if (_source.hasOwnProperty(key)) {
      dest = _transformationFn(dest, key, _source[key]);
    }
  }

  return dest;
};

/**
 * Formats keys to camelCase, returns transformed source object
 * @function camelCaseKeys
 * @param {Object} _source - source data to transform
 * @return {Object}
 */
var camelCaseKeys = function camelCaseKeys(_source) {
  var _camelCaseTransformFN = function CamelCaseTransform(_dest, _key, _value) {
    if (typeof _value === 'object' && _value) {
      _value = camelCaseKeys(_value);
    }
    _dest[_.camelCase(_key)] = _value;
    return _dest;
  };
  return _transformNestedObject(_source, _camelCaseTransformFN);
};

/**
 * Applies allowed args to the _source object values
 * @function applyAllowedArgs
 * @param {Object} _source - source data to transform
 * @param _allowedArgs - allowed args for values transformation
 * @return {Object}
 */
var applyAllowedArgs = function applyAllowedArgs(_source, _allowedArgs) {
  var _allowedArgsTransformFN = function allowedArgsTransformFN(_dest, _key,
  _value) {
    if (typeof _allowedArgs[_key] !== 'undefined' ||
    typeof _allowedArgs['*'] !== 'undefined') {
      if (_allowedArgs[_key] === true || _allowedArgs['*'] === true) { // copy all values
        _dest[_key] = _value;
      } else if (typeof _allowedArgs['*'] !== 'undefined') {
        _dest[_key] = applyAllowedArgs(_value, _allowedArgs['*']);
      } else if (typeof _allowedArgs[_key] === 'object') {
        _dest[_key] = applyAllowedArgs(_value, _allowedArgs[_key]);
      } else {
        _dest[_allowedArgs[_key]] = _value;
      }
    }
    return _dest;
  };

  return _transformNestedObject(_source, _allowedArgsTransformFN);
};

/**
 * Handles queue for mapping
 * @function _mappingQueue
 * @param {Array} _mapping - mapping array
 * @return Object}
 * @private
 */
var _mappingQueue = function mappingQueue(_mapping) {
  var mapClone = [].concat(_mapping);
  for (var i = 0; i < _mapping.length; i++) {
    var item = _mapping[i];
    var mappedIndex = mapClone.indexOf(item);
    var itemInsterted = false;
    mapClone.splice(mappedIndex, 1);
    for (var j = 0; j < mapClone.length; j++) {
      if (item.parent === mapClone[j].child) {
        mapClone.splice(j + 1, 0, item);
        itemInsterted = true;
        break;
      } else if (item.child === mapClone[j].parent) {
        mapClone.splice(j, 0, item);
        itemInsterted = true;
        break;
      }
    }

    if (!itemInsterted) {
      mapClone.push(item);
    }
  }

  return {
    isEmpty: function isEmpty() {
      return mapClone.length === 0;
    },
    pop: function pop() {
      return mapClone.pop();
    }
  };
};

/**
 * Applies model mapping to _source object
 * @function applyModelMapping
 * @param {Object} _source - source object
 * @param {Object} _dest - destination transformed object
 * @param {Object} _modelMap - object to create queue for mapping
 * @return {Object}
 */
var applyModelMapping = function applyModelMapping(_source, _dest, _modelMap) {
  if (typeof _modelMap === 'undefined') {
    return _dest;
  }

  var mapQueue = _mappingQueue(_modelMap);
  var mappingKeys = [];
  var mappedChildren = [];

  while (!mapQueue.isEmpty()) {
    var map = mapQueue.pop();
    mappingKeys.push(map.mapping);
    mappedChildren.push(map.child);
    for (var mappingKey in _source[map.mapping]) {
      if (!_source[map.mapping].hasOwnProperty(mappingKey)) {
        continue;
      }

      if (typeof _source[map.mapping][mappingKey] === 'number') {
        if (typeof _dest[map.parent][mappingKey][map.child] === 'undefined') {
          _dest[map.parent][mappingKey][map.child] = {};
        }
        _dest[map.parent][mappingKey][map.child][_source[map.mapping][mappingKey]] =
          _dest[map.child][_source[map.mapping][mappingKey]];
      } else {
        for (var i = 0; i < _source[map.mapping][mappingKey].length; i++) {
          if (typeof _dest[map.parent][mappingKey][map.child] === 'undefined') {
            _dest[map.parent][mappingKey][map.child] = {};
          }
          _dest[map.parent][mappingKey][map.child][_source[map.mapping][mappingKey][i]] =
            _dest[map.child][_source[map.mapping][mappingKey][i]];
        }
      }
    }
  }

  for (var j = 0; j < mappingKeys.length; j++) {
    delete _dest[mappingKeys[i]];
  }

  for (var k = 0; k < mappedChildren.length; k++) {
    delete _dest[mappedChildren[k]];
  }

  return _dest;
};

var  getFormatter = function(_config) {
    return function(_source) {
      var camelized = camelCaseKeys(_source);

      var config = _config;
      var filtered = applyAllowedArgs(camelized, config.allowedArgs);

      var mapped = filtered;
      if (config && typeof config.modelMapping !== 'undefined') {
        mapped = applyModelMapping(camelized, filtered, config.modelMapping);
      }
      return mapped;
    };
  };

module.exports = {
  getFormatter: getFormatter
}
