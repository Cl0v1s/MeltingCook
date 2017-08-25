(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.app = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var charenc = {
  // UTF-8 encoding
  utf8: {
    // Convert a string to a byte array
    stringToBytes: function(str) {
      return charenc.bin.stringToBytes(unescape(encodeURIComponent(str)));
    },

    // Convert a byte array to a string
    bytesToString: function(bytes) {
      return decodeURIComponent(escape(charenc.bin.bytesToString(bytes)));
    }
  },

  // Binary encoding
  bin: {
    // Convert a string to a byte array
    stringToBytes: function(str) {
      for (var bytes = [], i = 0; i < str.length; i++)
        bytes.push(str.charCodeAt(i) & 0xFF);
      return bytes;
    },

    // Convert a byte array to a string
    bytesToString: function(bytes) {
      for (var str = [], i = 0; i < bytes.length; i++)
        str.push(String.fromCharCode(bytes[i]));
      return str.join('');
    }
  }
};

module.exports = charenc;

},{}],2:[function(require,module,exports){
(function() {
  var base64map
      = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',

  crypt = {
    // Bit-wise rotation left
    rotl: function(n, b) {
      return (n << b) | (n >>> (32 - b));
    },

    // Bit-wise rotation right
    rotr: function(n, b) {
      return (n << (32 - b)) | (n >>> b);
    },

    // Swap big-endian to little-endian and vice versa
    endian: function(n) {
      // If number given, swap endian
      if (n.constructor == Number) {
        return crypt.rotl(n, 8) & 0x00FF00FF | crypt.rotl(n, 24) & 0xFF00FF00;
      }

      // Else, assume array and swap all items
      for (var i = 0; i < n.length; i++)
        n[i] = crypt.endian(n[i]);
      return n;
    },

    // Generate an array of any length of random bytes
    randomBytes: function(n) {
      for (var bytes = []; n > 0; n--)
        bytes.push(Math.floor(Math.random() * 256));
      return bytes;
    },

    // Convert a byte array to big-endian 32-bit words
    bytesToWords: function(bytes) {
      for (var words = [], i = 0, b = 0; i < bytes.length; i++, b += 8)
        words[b >>> 5] |= bytes[i] << (24 - b % 32);
      return words;
    },

    // Convert big-endian 32-bit words to a byte array
    wordsToBytes: function(words) {
      for (var bytes = [], b = 0; b < words.length * 32; b += 8)
        bytes.push((words[b >>> 5] >>> (24 - b % 32)) & 0xFF);
      return bytes;
    },

    // Convert a byte array to a hex string
    bytesToHex: function(bytes) {
      for (var hex = [], i = 0; i < bytes.length; i++) {
        hex.push((bytes[i] >>> 4).toString(16));
        hex.push((bytes[i] & 0xF).toString(16));
      }
      return hex.join('');
    },

    // Convert a hex string to a byte array
    hexToBytes: function(hex) {
      for (var bytes = [], c = 0; c < hex.length; c += 2)
        bytes.push(parseInt(hex.substr(c, 2), 16));
      return bytes;
    },

    // Convert a byte array to a base-64 string
    bytesToBase64: function(bytes) {
      for (var base64 = [], i = 0; i < bytes.length; i += 3) {
        var triplet = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
        for (var j = 0; j < 4; j++)
          if (i * 8 + j * 6 <= bytes.length * 8)
            base64.push(base64map.charAt((triplet >>> 6 * (3 - j)) & 0x3F));
          else
            base64.push('=');
      }
      return base64.join('');
    },

    // Convert a base-64 string to a byte array
    base64ToBytes: function(base64) {
      // Remove non-base-64 characters
      base64 = base64.replace(/[^A-Z0-9+\/]/ig, '');

      for (var bytes = [], i = 0, imod4 = 0; i < base64.length;
          imod4 = ++i % 4) {
        if (imod4 == 0) continue;
        bytes.push(((base64map.indexOf(base64.charAt(i - 1))
            & (Math.pow(2, -2 * imod4 + 8) - 1)) << (imod4 * 2))
            | (base64map.indexOf(base64.charAt(i)) >>> (6 - imod4 * 2)));
      }
      return bytes;
    }
  };

  module.exports = crypt;
})();

},{}],3:[function(require,module,exports){
/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */

// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
module.exports = function (obj) {
  return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
}

function isBuffer (obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer (obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0))
}

},{}],4:[function(require,module,exports){
/*!
 * JavaScript Cookie v2.1.4
 * https://github.com/js-cookie/js-cookie
 *
 * Copyright 2006, 2015 Klaus Hartl & Fagner Brack
 * Released under the MIT license
 */
;(function (factory) {
	var registeredInModuleLoader = false;
	if (typeof define === 'function' && define.amd) {
		define(factory);
		registeredInModuleLoader = true;
	}
	if (typeof exports === 'object') {
		module.exports = factory();
		registeredInModuleLoader = true;
	}
	if (!registeredInModuleLoader) {
		var OldCookies = window.Cookies;
		var api = window.Cookies = factory();
		api.noConflict = function () {
			window.Cookies = OldCookies;
			return api;
		};
	}
}(function () {
	function extend () {
		var i = 0;
		var result = {};
		for (; i < arguments.length; i++) {
			var attributes = arguments[ i ];
			for (var key in attributes) {
				result[key] = attributes[key];
			}
		}
		return result;
	}

	function init (converter) {
		function api (key, value, attributes) {
			var result;
			if (typeof document === 'undefined') {
				return;
			}

			// Write

			if (arguments.length > 1) {
				attributes = extend({
					path: '/'
				}, api.defaults, attributes);

				if (typeof attributes.expires === 'number') {
					var expires = new Date();
					expires.setMilliseconds(expires.getMilliseconds() + attributes.expires * 864e+5);
					attributes.expires = expires;
				}

				// We're using "expires" because "max-age" is not supported by IE
				attributes.expires = attributes.expires ? attributes.expires.toUTCString() : '';

				try {
					result = JSON.stringify(value);
					if (/^[\{\[]/.test(result)) {
						value = result;
					}
				} catch (e) {}

				if (!converter.write) {
					value = encodeURIComponent(String(value))
						.replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);
				} else {
					value = converter.write(value, key);
				}

				key = encodeURIComponent(String(key));
				key = key.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent);
				key = key.replace(/[\(\)]/g, escape);

				var stringifiedAttributes = '';

				for (var attributeName in attributes) {
					if (!attributes[attributeName]) {
						continue;
					}
					stringifiedAttributes += '; ' + attributeName;
					if (attributes[attributeName] === true) {
						continue;
					}
					stringifiedAttributes += '=' + attributes[attributeName];
				}
				return (document.cookie = key + '=' + value + stringifiedAttributes);
			}

			// Read

			if (!key) {
				result = {};
			}

			// To prevent the for loop in the first place assign an empty array
			// in case there are no cookies at all. Also prevents odd result when
			// calling "get()"
			var cookies = document.cookie ? document.cookie.split('; ') : [];
			var rdecode = /(%[0-9A-Z]{2})+/g;
			var i = 0;

			for (; i < cookies.length; i++) {
				var parts = cookies[i].split('=');
				var cookie = parts.slice(1).join('=');

				if (cookie.charAt(0) === '"') {
					cookie = cookie.slice(1, -1);
				}

				try {
					var name = parts[0].replace(rdecode, decodeURIComponent);
					cookie = converter.read ?
						converter.read(cookie, name) : converter(cookie, name) ||
						cookie.replace(rdecode, decodeURIComponent);

					if (this.json) {
						try {
							cookie = JSON.parse(cookie);
						} catch (e) {}
					}

					if (key === name) {
						result = cookie;
						break;
					}

					if (!key) {
						result[name] = cookie;
					}
				} catch (e) {}
			}

			return result;
		}

		api.set = api;
		api.get = function (key) {
			return api.call(api, key);
		};
		api.getJSON = function () {
			return api.apply({
				json: true
			}, [].slice.call(arguments));
		};
		api.defaults = {};

		api.remove = function (key, attributes) {
			api(key, '', extend(attributes, {
				expires: -1
			}));
		};

		api.withConverter = init;

		return api;
	}

	return init(function () {});
}));

},{}],5:[function(require,module,exports){
(function(){
  var crypt = require('crypt'),
      utf8 = require('charenc').utf8,
      isBuffer = require('is-buffer'),
      bin = require('charenc').bin,

  // The core
  md5 = function (message, options) {
    // Convert to byte array
    if (message.constructor == String)
      if (options && options.encoding === 'binary')
        message = bin.stringToBytes(message);
      else
        message = utf8.stringToBytes(message);
    else if (isBuffer(message))
      message = Array.prototype.slice.call(message, 0);
    else if (!Array.isArray(message))
      message = message.toString();
    // else, assume byte array already

    var m = crypt.bytesToWords(message),
        l = message.length * 8,
        a =  1732584193,
        b = -271733879,
        c = -1732584194,
        d =  271733878;

    // Swap endian
    for (var i = 0; i < m.length; i++) {
      m[i] = ((m[i] <<  8) | (m[i] >>> 24)) & 0x00FF00FF |
             ((m[i] << 24) | (m[i] >>>  8)) & 0xFF00FF00;
    }

    // Padding
    m[l >>> 5] |= 0x80 << (l % 32);
    m[(((l + 64) >>> 9) << 4) + 14] = l;

    // Method shortcuts
    var FF = md5._ff,
        GG = md5._gg,
        HH = md5._hh,
        II = md5._ii;

    for (var i = 0; i < m.length; i += 16) {

      var aa = a,
          bb = b,
          cc = c,
          dd = d;

      a = FF(a, b, c, d, m[i+ 0],  7, -680876936);
      d = FF(d, a, b, c, m[i+ 1], 12, -389564586);
      c = FF(c, d, a, b, m[i+ 2], 17,  606105819);
      b = FF(b, c, d, a, m[i+ 3], 22, -1044525330);
      a = FF(a, b, c, d, m[i+ 4],  7, -176418897);
      d = FF(d, a, b, c, m[i+ 5], 12,  1200080426);
      c = FF(c, d, a, b, m[i+ 6], 17, -1473231341);
      b = FF(b, c, d, a, m[i+ 7], 22, -45705983);
      a = FF(a, b, c, d, m[i+ 8],  7,  1770035416);
      d = FF(d, a, b, c, m[i+ 9], 12, -1958414417);
      c = FF(c, d, a, b, m[i+10], 17, -42063);
      b = FF(b, c, d, a, m[i+11], 22, -1990404162);
      a = FF(a, b, c, d, m[i+12],  7,  1804603682);
      d = FF(d, a, b, c, m[i+13], 12, -40341101);
      c = FF(c, d, a, b, m[i+14], 17, -1502002290);
      b = FF(b, c, d, a, m[i+15], 22,  1236535329);

      a = GG(a, b, c, d, m[i+ 1],  5, -165796510);
      d = GG(d, a, b, c, m[i+ 6],  9, -1069501632);
      c = GG(c, d, a, b, m[i+11], 14,  643717713);
      b = GG(b, c, d, a, m[i+ 0], 20, -373897302);
      a = GG(a, b, c, d, m[i+ 5],  5, -701558691);
      d = GG(d, a, b, c, m[i+10],  9,  38016083);
      c = GG(c, d, a, b, m[i+15], 14, -660478335);
      b = GG(b, c, d, a, m[i+ 4], 20, -405537848);
      a = GG(a, b, c, d, m[i+ 9],  5,  568446438);
      d = GG(d, a, b, c, m[i+14],  9, -1019803690);
      c = GG(c, d, a, b, m[i+ 3], 14, -187363961);
      b = GG(b, c, d, a, m[i+ 8], 20,  1163531501);
      a = GG(a, b, c, d, m[i+13],  5, -1444681467);
      d = GG(d, a, b, c, m[i+ 2],  9, -51403784);
      c = GG(c, d, a, b, m[i+ 7], 14,  1735328473);
      b = GG(b, c, d, a, m[i+12], 20, -1926607734);

      a = HH(a, b, c, d, m[i+ 5],  4, -378558);
      d = HH(d, a, b, c, m[i+ 8], 11, -2022574463);
      c = HH(c, d, a, b, m[i+11], 16,  1839030562);
      b = HH(b, c, d, a, m[i+14], 23, -35309556);
      a = HH(a, b, c, d, m[i+ 1],  4, -1530992060);
      d = HH(d, a, b, c, m[i+ 4], 11,  1272893353);
      c = HH(c, d, a, b, m[i+ 7], 16, -155497632);
      b = HH(b, c, d, a, m[i+10], 23, -1094730640);
      a = HH(a, b, c, d, m[i+13],  4,  681279174);
      d = HH(d, a, b, c, m[i+ 0], 11, -358537222);
      c = HH(c, d, a, b, m[i+ 3], 16, -722521979);
      b = HH(b, c, d, a, m[i+ 6], 23,  76029189);
      a = HH(a, b, c, d, m[i+ 9],  4, -640364487);
      d = HH(d, a, b, c, m[i+12], 11, -421815835);
      c = HH(c, d, a, b, m[i+15], 16,  530742520);
      b = HH(b, c, d, a, m[i+ 2], 23, -995338651);

      a = II(a, b, c, d, m[i+ 0],  6, -198630844);
      d = II(d, a, b, c, m[i+ 7], 10,  1126891415);
      c = II(c, d, a, b, m[i+14], 15, -1416354905);
      b = II(b, c, d, a, m[i+ 5], 21, -57434055);
      a = II(a, b, c, d, m[i+12],  6,  1700485571);
      d = II(d, a, b, c, m[i+ 3], 10, -1894986606);
      c = II(c, d, a, b, m[i+10], 15, -1051523);
      b = II(b, c, d, a, m[i+ 1], 21, -2054922799);
      a = II(a, b, c, d, m[i+ 8],  6,  1873313359);
      d = II(d, a, b, c, m[i+15], 10, -30611744);
      c = II(c, d, a, b, m[i+ 6], 15, -1560198380);
      b = II(b, c, d, a, m[i+13], 21,  1309151649);
      a = II(a, b, c, d, m[i+ 4],  6, -145523070);
      d = II(d, a, b, c, m[i+11], 10, -1120210379);
      c = II(c, d, a, b, m[i+ 2], 15,  718787259);
      b = II(b, c, d, a, m[i+ 9], 21, -343485551);

      a = (a + aa) >>> 0;
      b = (b + bb) >>> 0;
      c = (c + cc) >>> 0;
      d = (d + dd) >>> 0;
    }

    return crypt.endian([a, b, c, d]);
  };

  // Auxiliary functions
  md5._ff  = function (a, b, c, d, x, s, t) {
    var n = a + (b & c | ~b & d) + (x >>> 0) + t;
    return ((n << s) | (n >>> (32 - s))) + b;
  };
  md5._gg  = function (a, b, c, d, x, s, t) {
    var n = a + (b & d | c & ~d) + (x >>> 0) + t;
    return ((n << s) | (n >>> (32 - s))) + b;
  };
  md5._hh  = function (a, b, c, d, x, s, t) {
    var n = a + (b ^ c ^ d) + (x >>> 0) + t;
    return ((n << s) | (n >>> (32 - s))) + b;
  };
  md5._ii  = function (a, b, c, d, x, s, t) {
    var n = a + (c ^ (b | ~d)) + (x >>> 0) + t;
    return ((n << s) | (n >>> (32 - s))) + b;
  };

  // Package private blocksize
  md5._blocksize = 16;
  md5._digestsize = 16;

  module.exports = function (message, options) {
    if (message === undefined || message === null)
      throw new Error('Illegal argument ' + message);

    var digestbytes = crypt.wordsToBytes(md5(message, options));
    return options && options.asBytes ? digestbytes :
        options && options.asString ? bin.bytesToString(digestbytes) :
        crypt.bytesToHex(digestbytes);
  };

})();

},{"charenc":1,"crypt":2,"is-buffer":3}],6:[function(require,module,exports){
/* Riot v3.6.3, @license MIT */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.riot = {})));
}(this, (function (exports) { 'use strict';

var __TAGS_CACHE = [];
var __TAG_IMPL = {};
var GLOBAL_MIXIN = '__global_mixin';
var ATTRS_PREFIX = 'riot-';
var REF_DIRECTIVES = ['ref', 'data-ref'];
var IS_DIRECTIVE = 'data-is';
var CONDITIONAL_DIRECTIVE = 'if';
var LOOP_DIRECTIVE = 'each';
var LOOP_NO_REORDER_DIRECTIVE = 'no-reorder';
var SHOW_DIRECTIVE = 'show';
var HIDE_DIRECTIVE = 'hide';
var RIOT_EVENTS_KEY = '__riot-events__';
var T_STRING = 'string';
var T_OBJECT = 'object';
var T_UNDEF  = 'undefined';
var T_FUNCTION = 'function';
var XLINK_NS = 'http://www.w3.org/1999/xlink';
var SVG_NS = 'http://www.w3.org/2000/svg';
var XLINK_REGEX = /^xlink:(\w+)/;
var WIN = typeof window === T_UNDEF ? undefined : window;
var RE_SPECIAL_TAGS = /^(?:t(?:body|head|foot|[rhd])|caption|col(?:group)?|opt(?:ion|group))$/;
var RE_SPECIAL_TAGS_NO_OPTION = /^(?:t(?:body|head|foot|[rhd])|caption|col(?:group)?)$/;
var RE_EVENTS_PREFIX = /^on/;
var RE_HTML_ATTRS = /([-\w]+) ?= ?(?:"([^"]*)|'([^']*)|({[^}]*}))/g;
var CASE_SENSITIVE_ATTRIBUTES = { 'viewbox': 'viewBox' };
var RE_BOOL_ATTRS = /^(?:disabled|checked|readonly|required|allowfullscreen|auto(?:focus|play)|compact|controls|default|formnovalidate|hidden|ismap|itemscope|loop|multiple|muted|no(?:resize|shade|validate|wrap)?|open|reversed|seamless|selected|sortable|truespeed|typemustmatch)$/;
var IE_VERSION = (WIN && WIN.document || {}).documentMode | 0;

/**
 * Check if the passed argument is a boolean attribute
 * @param   { String } value -
 * @returns { Boolean } -
 */
function isBoolAttr(value) {
  return RE_BOOL_ATTRS.test(value)
}

/**
 * Check if passed argument is a function
 * @param   { * } value -
 * @returns { Boolean } -
 */
function isFunction(value) {
  return typeof value === T_FUNCTION
}

/**
 * Check if passed argument is an object, exclude null
 * NOTE: use isObject(x) && !isArray(x) to excludes arrays.
 * @param   { * } value -
 * @returns { Boolean } -
 */
function isObject(value) {
  return value && typeof value === T_OBJECT // typeof null is 'object'
}

/**
 * Check if passed argument is undefined
 * @param   { * } value -
 * @returns { Boolean } -
 */
function isUndefined(value) {
  return typeof value === T_UNDEF
}

/**
 * Check if passed argument is a string
 * @param   { * } value -
 * @returns { Boolean } -
 */
function isString(value) {
  return typeof value === T_STRING
}

/**
 * Check if passed argument is empty. Different from falsy, because we dont consider 0 or false to be blank
 * @param { * } value -
 * @returns { Boolean } -
 */
function isBlank(value) {
  return isUndefined(value) || value === null || value === ''
}

/**
 * Check if passed argument is a kind of array
 * @param   { * } value -
 * @returns { Boolean } -
 */
function isArray(value) {
  return Array.isArray(value) || value instanceof Array
}

/**
 * Check whether object's property could be overridden
 * @param   { Object }  obj - source object
 * @param   { String }  key - object property
 * @returns { Boolean } -
 */
function isWritable(obj, key) {
  var descriptor = Object.getOwnPropertyDescriptor(obj, key);
  return isUndefined(obj[key]) || descriptor && descriptor.writable
}


var check = Object.freeze({
	isBoolAttr: isBoolAttr,
	isFunction: isFunction,
	isObject: isObject,
	isUndefined: isUndefined,
	isString: isString,
	isBlank: isBlank,
	isArray: isArray,
	isWritable: isWritable
});

/**
 * Shorter and fast way to select multiple nodes in the DOM
 * @param   { String } selector - DOM selector
 * @param   { Object } ctx - DOM node where the targets of our search will is located
 * @returns { Object } dom nodes found
 */
function $$(selector, ctx) {
  return Array.prototype.slice.call((ctx || document).querySelectorAll(selector))
}

/**
 * Shorter and fast way to select a single node in the DOM
 * @param   { String } selector - unique dom selector
 * @param   { Object } ctx - DOM node where the target of our search will is located
 * @returns { Object } dom node found
 */
function $(selector, ctx) {
  return (ctx || document).querySelector(selector)
}

/**
 * Create a document fragment
 * @returns { Object } document fragment
 */
function createFrag() {
  return document.createDocumentFragment()
}

/**
 * Create a document text node
 * @returns { Object } create a text node to use as placeholder
 */
function createDOMPlaceholder() {
  return document.createTextNode('')
}

/**
 * Check if a DOM node is an svg tag
 * @param   { HTMLElement }  el - node we want to test
 * @returns {Boolean} true if it's an svg node
 */
function isSvg(el) {
  return !!el.ownerSVGElement
}

/**
 * Create a generic DOM node
 * @param   { String } name - name of the DOM node we want to create
 * @param   { Boolean } isSvg - true if we need to use an svg node
 * @returns { Object } DOM node just created
 */
function mkEl(name) {
  return name === 'svg' ? document.createElementNS(SVG_NS, name) : document.createElement(name)
}

/**
 * Set the inner html of any DOM node SVGs included
 * @param { Object } container - DOM node where we'll inject new html
 * @param { String } html - html to inject
 */
/* istanbul ignore next */
function setInnerHTML(container, html) {
  if (!isUndefined(container.innerHTML))
    { container.innerHTML = html; }
    // some browsers do not support innerHTML on the SVGs tags
  else {
    var doc = new DOMParser().parseFromString(html, 'application/xml');
    var node = container.ownerDocument.importNode(doc.documentElement, true);
    container.appendChild(node);
  }
}

/**
 * Toggle the visibility of any DOM node
 * @param   { Object }  dom - DOM node we want to hide
 * @param   { Boolean } show - do we want to show it?
 */

function toggleVisibility(dom, show) {
  dom.style.display = show ? '' : 'none';
  dom['hidden'] = show ? false : true;
}

/**
 * Remove any DOM attribute from a node
 * @param   { Object } dom - DOM node we want to update
 * @param   { String } name - name of the property we want to remove
 */
function remAttr(dom, name) {
  dom.removeAttribute(name);
}

/**
 * Convert a style object to a string
 * @param   { Object } style - style object we need to parse
 * @returns { String } resulting css string
 * @example
 * styleObjectToString({ color: 'red', height: '10px'}) // => 'color: red; height: 10px'
 */
function styleObjectToString(style) {
  return Object.keys(style).reduce(function (acc, prop) {
    return (acc + " " + prop + ": " + (style[prop]) + ";")
  }, '')
}

/**
 * Get the value of any DOM attribute on a node
 * @param   { Object } dom - DOM node we want to parse
 * @param   { String } name - name of the attribute we want to get
 * @returns { String | undefined } name of the node attribute whether it exists
 */
function getAttr(dom, name) {
  return dom.getAttribute(name)
}

/**
 * Set any DOM attribute
 * @param { Object } dom - DOM node we want to update
 * @param { String } name - name of the property we want to set
 * @param { String } val - value of the property we want to set
 */
function setAttr(dom, name, val) {
  var xlink = XLINK_REGEX.exec(name);
  if (xlink && xlink[1])
    { dom.setAttributeNS(XLINK_NS, xlink[1], val); }
  else
    { dom.setAttribute(name, val); }
}

/**
 * Insert safely a tag to fix #1962 #1649
 * @param   { HTMLElement } root - children container
 * @param   { HTMLElement } curr - node to insert
 * @param   { HTMLElement } next - node that should preceed the current node inserted
 */
function safeInsert(root, curr, next) {
  root.insertBefore(curr, next.parentNode && next);
}

/**
 * Minimize risk: only zero or one _space_ between attr & value
 * @param   { String }   html - html string we want to parse
 * @param   { Function } fn - callback function to apply on any attribute found
 */
function walkAttrs(html, fn) {
  if (!html) { return }
  var m;
  while (m = RE_HTML_ATTRS.exec(html))
    { fn(m[1].toLowerCase(), m[2] || m[3] || m[4]); }
}

/**
 * Walk down recursively all the children tags starting dom node
 * @param   { Object }   dom - starting node where we will start the recursion
 * @param   { Function } fn - callback to transform the child node just found
 * @param   { Object }   context - fn can optionally return an object, which is passed to children
 */
function walkNodes(dom, fn, context) {
  if (dom) {
    var res = fn(dom, context);
    var next;
    // stop the recursion
    if (res === false) { return }

    dom = dom.firstChild;

    while (dom) {
      next = dom.nextSibling;
      walkNodes(dom, fn, res);
      dom = next;
    }
  }
}

var dom = Object.freeze({
	$$: $$,
	$: $,
	createFrag: createFrag,
	createDOMPlaceholder: createDOMPlaceholder,
	isSvg: isSvg,
	mkEl: mkEl,
	setInnerHTML: setInnerHTML,
	toggleVisibility: toggleVisibility,
	remAttr: remAttr,
	styleObjectToString: styleObjectToString,
	getAttr: getAttr,
	setAttr: setAttr,
	safeInsert: safeInsert,
	walkAttrs: walkAttrs,
	walkNodes: walkNodes
});

var styleNode;
// Create cache and shortcut to the correct property
var cssTextProp;
var byName = {};
var remainder = [];
var needsInject = false;

// skip the following code on the server
if (WIN) {
  styleNode = ((function () {
    // create a new style element with the correct type
    var newNode = mkEl('style');
    setAttr(newNode, 'type', 'text/css');

    // replace any user node or insert the new one into the head
    var userNode = $('style[type=riot]');
    /* istanbul ignore next */
    if (userNode) {
      if (userNode.id) { newNode.id = userNode.id; }
      userNode.parentNode.replaceChild(newNode, userNode);
    }
    else { document.getElementsByTagName('head')[0].appendChild(newNode); }

    return newNode
  }))();
  cssTextProp = styleNode.styleSheet;
}

/**
 * Object that will be used to inject and manage the css of every tag instance
 */
var styleManager = {
  styleNode: styleNode,
  /**
   * Save a tag style to be later injected into DOM
   * @param { String } css - css string
   * @param { String } name - if it's passed we will map the css to a tagname
   */
  add: function add(css, name) {
    if (name) { byName[name] = css; }
    else { remainder.push(css); }
    needsInject = true;
  },
  /**
   * Inject all previously saved tag styles into DOM
   * innerHTML seems slow: http://jsperf.com/riot-insert-style
   */
  inject: function inject() {
    if (!WIN || !needsInject) { return }
    needsInject = false;
    var style = Object.keys(byName)
      .map(function (k) { return byName[k]; })
      .concat(remainder).join('\n');
    /* istanbul ignore next */
    if (cssTextProp) { cssTextProp.cssText = style; }
    else { styleNode.innerHTML = style; }
  }
};

/**
 * The riot template engine
 * @version v3.0.8
 */

var skipRegex = (function () { //eslint-disable-line no-unused-vars

  var beforeReChars = '[{(,;:?=|&!^~>%*/';

  var beforeReWords = [
    'case',
    'default',
    'do',
    'else',
    'in',
    'instanceof',
    'prefix',
    'return',
    'typeof',
    'void',
    'yield'
  ];

  var wordsLastChar = beforeReWords.reduce(function (s, w) {
    return s + w.slice(-1)
  }, '');

  var RE_REGEX = /^\/(?=[^*>/])[^[/\\]*(?:(?:\\.|\[(?:\\.|[^\]\\]*)*\])[^[\\/]*)*?\/[gimuy]*/;
  var RE_VN_CHAR = /[$\w]/;

  function prev (code, pos) {
    while (--pos >= 0 && /\s/.test(code[pos])){  }
    return pos
  }

  function _skipRegex (code, start) {

    var re = /.*/g;
    var pos = re.lastIndex = start++;
    var match = re.exec(code)[0].match(RE_REGEX);

    if (match) {
      var next = pos + match[0].length;

      pos = prev(code, pos);
      var c = code[pos];

      if (pos < 0 || ~beforeReChars.indexOf(c)) {
        return next
      }

      if (c === '.') {

        if (code[pos - 1] === '.') {
          start = next;
        }

      } else if (c === '+' || c === '-') {

        if (code[--pos] !== c ||
            (pos = prev(code, pos)) < 0 ||
            !RE_VN_CHAR.test(code[pos])) {
          start = next;
        }

      } else if (~wordsLastChar.indexOf(c)) {

        var end = pos + 1;

        while (--pos >= 0 && RE_VN_CHAR.test(code[pos])){  }
        if (~beforeReWords.indexOf(code.slice(pos + 1, end))) {
          start = next;
        }
      }
    }

    return start
  }

  return _skipRegex

})();

/**
 * riot.util.brackets
 *
 * - `brackets    ` - Returns a string or regex based on its parameter
 * - `brackets.set` - Change the current riot brackets
 *
 * @module
 */

/* global riot */

/* istanbul ignore next */
var brackets = (function (UNDEF) {

  var
    REGLOB = 'g',

    R_MLCOMMS = /\/\*[^*]*\*+(?:[^*\/][^*]*\*+)*\//g,

    R_STRINGS = /"[^"\\]*(?:\\[\S\s][^"\\]*)*"|'[^'\\]*(?:\\[\S\s][^'\\]*)*'|`[^`\\]*(?:\\[\S\s][^`\\]*)*`/g,

    S_QBLOCKS = R_STRINGS.source + '|' +
      /(?:\breturn\s+|(?:[$\w\)\]]|\+\+|--)\s*(\/)(?![*\/]))/.source + '|' +
      /\/(?=[^*\/])[^[\/\\]*(?:(?:\[(?:\\.|[^\]\\]*)*\]|\\.)[^[\/\\]*)*?([^<]\/)[gim]*/.source,

    UNSUPPORTED = RegExp('[\\' + 'x00-\\x1F<>a-zA-Z0-9\'",;\\\\]'),

    NEED_ESCAPE = /(?=[[\]()*+?.^$|])/g,

    S_QBLOCK2 = R_STRINGS.source + '|' + /(\/)(?![*\/])/.source,

    FINDBRACES = {
      '(': RegExp('([()])|'   + S_QBLOCK2, REGLOB),
      '[': RegExp('([[\\]])|' + S_QBLOCK2, REGLOB),
      '{': RegExp('([{}])|'   + S_QBLOCK2, REGLOB)
    },

    DEFAULT = '{ }';

  var _pairs = [
    '{', '}',
    '{', '}',
    /{[^}]*}/,
    /\\([{}])/g,
    /\\({)|{/g,
    RegExp('\\\\(})|([[({])|(})|' + S_QBLOCK2, REGLOB),
    DEFAULT,
    /^\s*{\^?\s*([$\w]+)(?:\s*,\s*(\S+))?\s+in\s+(\S.*)\s*}/,
    /(^|[^\\]){=[\S\s]*?}/
  ];

  var
    cachedBrackets = UNDEF,
    _regex,
    _cache = [],
    _settings;

  function _loopback (re) { return re }

  function _rewrite (re, bp) {
    if (!bp) { bp = _cache; }
    return new RegExp(
      re.source.replace(/{/g, bp[2]).replace(/}/g, bp[3]), re.global ? REGLOB : ''
    )
  }

  function _create (pair) {
    if (pair === DEFAULT) { return _pairs }

    var arr = pair.split(' ');

    if (arr.length !== 2 || UNSUPPORTED.test(pair)) {
      throw new Error('Unsupported brackets "' + pair + '"')
    }
    arr = arr.concat(pair.replace(NEED_ESCAPE, '\\').split(' '));

    arr[4] = _rewrite(arr[1].length > 1 ? /{[\S\s]*?}/ : _pairs[4], arr);
    arr[5] = _rewrite(pair.length > 3 ? /\\({|})/g : _pairs[5], arr);
    arr[6] = _rewrite(_pairs[6], arr);
    arr[7] = RegExp('\\\\(' + arr[3] + ')|([[({])|(' + arr[3] + ')|' + S_QBLOCK2, REGLOB);
    arr[8] = pair;
    return arr
  }

  function _brackets (reOrIdx) {
    return reOrIdx instanceof RegExp ? _regex(reOrIdx) : _cache[reOrIdx]
  }

  _brackets.split = function split (str, tmpl, _bp) {
    // istanbul ignore next: _bp is for the compiler
    if (!_bp) { _bp = _cache; }

    var
      parts = [],
      match,
      isexpr,
      start,
      pos,
      re = _bp[6];

    var qblocks = [];
    var prevStr = '';
    var mark, lastIndex;

    isexpr = start = re.lastIndex = 0;

    while ((match = re.exec(str))) {

      lastIndex = re.lastIndex;
      pos = match.index;

      if (isexpr) {

        if (match[2]) {

          var ch = match[2];
          var rech = FINDBRACES[ch];
          var ix = 1;

          rech.lastIndex = lastIndex;
          while ((match = rech.exec(str))) {
            if (match[1]) {
              if (match[1] === ch) { ++ix; }
              else if (!--ix) { break }
            } else {
              rech.lastIndex = pushQBlock(match.index, rech.lastIndex, match[2]);
            }
          }
          re.lastIndex = ix ? str.length : rech.lastIndex;
          continue
        }

        if (!match[3]) {
          re.lastIndex = pushQBlock(pos, lastIndex, match[4]);
          continue
        }
      }

      if (!match[1]) {
        unescapeStr(str.slice(start, pos));
        start = re.lastIndex;
        re = _bp[6 + (isexpr ^= 1)];
        re.lastIndex = start;
      }
    }

    if (str && start < str.length) {
      unescapeStr(str.slice(start));
    }

    parts.qblocks = qblocks;

    return parts

    function unescapeStr (s) {
      if (prevStr) {
        s = prevStr + s;
        prevStr = '';
      }
      if (tmpl || isexpr) {
        parts.push(s && s.replace(_bp[5], '$1'));
      } else {
        parts.push(s);
      }
    }

    function pushQBlock(_pos, _lastIndex, slash) { //eslint-disable-line
      if (slash) {
        _lastIndex = skipRegex(str, _pos);
      }

      if (tmpl && _lastIndex > _pos + 2) {
        mark = '\u2057' + qblocks.length + '~';
        qblocks.push(str.slice(_pos, _lastIndex));
        prevStr += str.slice(start, _pos) + mark;
        start = _lastIndex;
      }
      return _lastIndex
    }
  };

  _brackets.hasExpr = function hasExpr (str) {
    return _cache[4].test(str)
  };

  _brackets.loopKeys = function loopKeys (expr) {
    var m = expr.match(_cache[9]);

    return m
      ? { key: m[1], pos: m[2], val: _cache[0] + m[3].trim() + _cache[1] }
      : { val: expr.trim() }
  };

  _brackets.array = function array (pair) {
    return pair ? _create(pair) : _cache
  };

  function _reset (pair) {
    if ((pair || (pair = DEFAULT)) !== _cache[8]) {
      _cache = _create(pair);
      _regex = pair === DEFAULT ? _loopback : _rewrite;
      _cache[9] = _regex(_pairs[9]);
    }
    cachedBrackets = pair;
  }

  function _setSettings (o) {
    var b;

    o = o || {};
    b = o.brackets;
    Object.defineProperty(o, 'brackets', {
      set: _reset,
      get: function () { return cachedBrackets },
      enumerable: true
    });
    _settings = o;
    _reset(b);
  }

  Object.defineProperty(_brackets, 'settings', {
    set: _setSettings,
    get: function () { return _settings }
  });

  /* istanbul ignore next: in the browser riot is always in the scope */
  _brackets.settings = typeof riot !== 'undefined' && riot.settings || {};
  _brackets.set = _reset;
  _brackets.skipRegex = skipRegex;

  _brackets.R_STRINGS = R_STRINGS;
  _brackets.R_MLCOMMS = R_MLCOMMS;
  _brackets.S_QBLOCKS = S_QBLOCKS;
  _brackets.S_QBLOCK2 = S_QBLOCK2;

  return _brackets

})();

/**
 * @module tmpl
 *
 * tmpl          - Root function, returns the template value, render with data
 * tmpl.hasExpr  - Test the existence of a expression inside a string
 * tmpl.loopKeys - Get the keys for an 'each' loop (used by `_each`)
 */

/* istanbul ignore next */
var tmpl = (function () {

  var _cache = {};

  function _tmpl (str, data) {
    if (!str) { return str }

    return (_cache[str] || (_cache[str] = _create(str))).call(
      data, _logErr.bind({
        data: data,
        tmpl: str
      })
    )
  }

  _tmpl.hasExpr = brackets.hasExpr;

  _tmpl.loopKeys = brackets.loopKeys;

  // istanbul ignore next
  _tmpl.clearCache = function () { _cache = {}; };

  _tmpl.errorHandler = null;

  function _logErr (err, ctx) {

    err.riotData = {
      tagName: ctx && ctx.__ && ctx.__.tagName,
      _riot_id: ctx && ctx._riot_id  //eslint-disable-line camelcase
    };

    if (_tmpl.errorHandler) { _tmpl.errorHandler(err); }
    else if (
      typeof console !== 'undefined' &&
      typeof console.error === 'function'
    ) {
      console.error(err.message);
      console.log('<%s> %s', err.riotData.tagName || 'Unknown tag', this.tmpl); // eslint-disable-line
      console.log(this.data); // eslint-disable-line
    }
  }

  function _create (str) {
    var expr = _getTmpl(str);

    if (expr.slice(0, 11) !== 'try{return ') { expr = 'return ' + expr; }

    return new Function('E', expr + ';')    // eslint-disable-line no-new-func
  }

  var RE_DQUOTE = /\u2057/g;
  var RE_QBMARK = /\u2057(\d+)~/g;

  function _getTmpl (str) {
    var parts = brackets.split(str.replace(RE_DQUOTE, '"'), 1);
    var qstr = parts.qblocks;
    var expr;

    if (parts.length > 2 || parts[0]) {
      var i, j, list = [];

      for (i = j = 0; i < parts.length; ++i) {

        expr = parts[i];

        if (expr && (expr = i & 1

            ? _parseExpr(expr, 1, qstr)

            : '"' + expr
                .replace(/\\/g, '\\\\')
                .replace(/\r\n?|\n/g, '\\n')
                .replace(/"/g, '\\"') +
              '"'

          )) { list[j++] = expr; }

      }

      expr = j < 2 ? list[0]
           : '[' + list.join(',') + '].join("")';

    } else {

      expr = _parseExpr(parts[1], 0, qstr);
    }

    if (qstr.length) {
      expr = expr.replace(RE_QBMARK, function (_, pos) {
        return qstr[pos]
          .replace(/\r/g, '\\r')
          .replace(/\n/g, '\\n')
      });
    }
    return expr
  }

  var RE_CSNAME = /^(?:(-?[_A-Za-z\xA0-\xFF][-\w\xA0-\xFF]*)|\u2057(\d+)~):/;
  var
    RE_BREND = {
      '(': /[()]/g,
      '[': /[[\]]/g,
      '{': /[{}]/g
    };

  function _parseExpr (expr, asText, qstr) {

    expr = expr
      .replace(/\s+/g, ' ').trim()
      .replace(/\ ?([[\({},?\.:])\ ?/g, '$1');

    if (expr) {
      var
        list = [],
        cnt = 0,
        match;

      while (expr &&
            (match = expr.match(RE_CSNAME)) &&
            !match.index
        ) {
        var
          key,
          jsb,
          re = /,|([[{(])|$/g;

        expr = RegExp.rightContext;
        key  = match[2] ? qstr[match[2]].slice(1, -1).trim().replace(/\s+/g, ' ') : match[1];

        while (jsb = (match = re.exec(expr))[1]) { skipBraces(jsb, re); }

        jsb  = expr.slice(0, match.index);
        expr = RegExp.rightContext;

        list[cnt++] = _wrapExpr(jsb, 1, key);
      }

      expr = !cnt ? _wrapExpr(expr, asText)
           : cnt > 1 ? '[' + list.join(',') + '].join(" ").trim()' : list[0];
    }
    return expr

    function skipBraces (ch, re) {
      var
        mm,
        lv = 1,
        ir = RE_BREND[ch];

      ir.lastIndex = re.lastIndex;
      while (mm = ir.exec(expr)) {
        if (mm[0] === ch) { ++lv; }
        else if (!--lv) { break }
      }
      re.lastIndex = lv ? expr.length : ir.lastIndex;
    }
  }

  // istanbul ignore next: not both
  var // eslint-disable-next-line max-len
    JS_CONTEXT = '"in this?this:' + (typeof window !== 'object' ? 'global' : 'window') + ').',
    JS_VARNAME = /[,{][\$\w]+(?=:)|(^ *|[^$\w\.{])(?!(?:typeof|true|false|null|undefined|in|instanceof|is(?:Finite|NaN)|void|NaN|new|Date|RegExp|Math)(?![$\w]))([$_A-Za-z][$\w]*)/g,
    JS_NOPROPS = /^(?=(\.[$\w]+))\1(?:[^.[(]|$)/;

  function _wrapExpr (expr, asText, key) {
    var tb;

    expr = expr.replace(JS_VARNAME, function (match, p, mvar, pos, s) {
      if (mvar) {
        pos = tb ? 0 : pos + match.length;

        if (mvar !== 'this' && mvar !== 'global' && mvar !== 'window') {
          match = p + '("' + mvar + JS_CONTEXT + mvar;
          if (pos) { tb = (s = s[pos]) === '.' || s === '(' || s === '['; }
        } else if (pos) {
          tb = !JS_NOPROPS.test(s.slice(pos));
        }
      }
      return match
    });

    if (tb) {
      expr = 'try{return ' + expr + '}catch(e){E(e,this)}';
    }

    if (key) {

      expr = (tb
          ? 'function(){' + expr + '}.call(this)' : '(' + expr + ')'
        ) + '?"' + key + '":""';

    } else if (asText) {

      expr = 'function(v){' + (tb
          ? expr.replace('return ', 'v=') : 'v=(' + expr + ')'
        ) + ';return v||v===0?v:""}.call(this)';
    }

    return expr
  }

  _tmpl.version = brackets.version = 'v3.0.8';

  return _tmpl

})();

/* istanbul ignore next */
var observable$1 = function(el) {

  /**
   * Extend the original object or create a new empty one
   * @type { Object }
   */

  el = el || {};

  /**
   * Private variables
   */
  var callbacks = {},
    slice = Array.prototype.slice;

  /**
   * Public Api
   */

  // extend the el object adding the observable methods
  Object.defineProperties(el, {
    /**
     * Listen to the given `event` ands
     * execute the `callback` each time an event is triggered.
     * @param  { String } event - event id
     * @param  { Function } fn - callback function
     * @returns { Object } el
     */
    on: {
      value: function(event, fn) {
        if (typeof fn == 'function')
          { (callbacks[event] = callbacks[event] || []).push(fn); }
        return el
      },
      enumerable: false,
      writable: false,
      configurable: false
    },

    /**
     * Removes the given `event` listeners
     * @param   { String } event - event id
     * @param   { Function } fn - callback function
     * @returns { Object } el
     */
    off: {
      value: function(event, fn) {
        if (event == '*' && !fn) { callbacks = {}; }
        else {
          if (fn) {
            var arr = callbacks[event];
            for (var i = 0, cb; cb = arr && arr[i]; ++i) {
              if (cb == fn) { arr.splice(i--, 1); }
            }
          } else { delete callbacks[event]; }
        }
        return el
      },
      enumerable: false,
      writable: false,
      configurable: false
    },

    /**
     * Listen to the given `event` and
     * execute the `callback` at most once
     * @param   { String } event - event id
     * @param   { Function } fn - callback function
     * @returns { Object } el
     */
    one: {
      value: function(event, fn) {
        function on() {
          el.off(event, on);
          fn.apply(el, arguments);
        }
        return el.on(event, on)
      },
      enumerable: false,
      writable: false,
      configurable: false
    },

    /**
     * Execute all callback functions that listen to
     * the given `event`
     * @param   { String } event - event id
     * @returns { Object } el
     */
    trigger: {
      value: function(event) {
        var arguments$1 = arguments;


        // getting the arguments
        var arglen = arguments.length - 1,
          args = new Array(arglen),
          fns,
          fn,
          i;

        for (i = 0; i < arglen; i++) {
          args[i] = arguments$1[i + 1]; // skip first argument
        }

        fns = slice.call(callbacks[event] || [], 0);

        for (i = 0; fn = fns[i]; ++i) {
          fn.apply(el, args);
        }

        if (callbacks['*'] && event != '*')
          { el.trigger.apply(el, ['*', event].concat(args)); }

        return el
      },
      enumerable: false,
      writable: false,
      configurable: false
    }
  });

  return el

};

/**
 * Specialized function for looping an array-like collection with `each={}`
 * @param   { Array } list - collection of items
 * @param   {Function} fn - callback function
 * @returns { Array } the array looped
 */
function each(list, fn) {
  var len = list ? list.length : 0;
  var i = 0;
  for (; i < len; ++i) {
    fn(list[i], i);
  }
  return list
}

/**
 * Check whether an array contains an item
 * @param   { Array } array - target array
 * @param   { * } item - item to test
 * @returns { Boolean } -
 */
function contains(array, item) {
  return array.indexOf(item) !== -1
}

/**
 * Convert a string containing dashes to camel case
 * @param   { String } str - input string
 * @returns { String } my-string -> myString
 */
function toCamel(str) {
  return str.replace(/-(\w)/g, function (_, c) { return c.toUpperCase(); })
}

/**
 * Faster String startsWith alternative
 * @param   { String } str - source string
 * @param   { String } value - test string
 * @returns { Boolean } -
 */
function startsWith(str, value) {
  return str.slice(0, value.length) === value
}

/**
 * Helper function to set an immutable property
 * @param   { Object } el - object where the new property will be set
 * @param   { String } key - object key where the new property will be stored
 * @param   { * } value - value of the new property
 * @param   { Object } options - set the propery overriding the default options
 * @returns { Object } - the initial object
 */
function defineProperty(el, key, value, options) {
  Object.defineProperty(el, key, extend({
    value: value,
    enumerable: false,
    writable: false,
    configurable: true
  }, options));
  return el
}

/**
 * Extend any object with other properties
 * @param   { Object } src - source object
 * @returns { Object } the resulting extended object
 *
 * var obj = { foo: 'baz' }
 * extend(obj, {bar: 'bar', foo: 'bar'})
 * console.log(obj) => {bar: 'bar', foo: 'bar'}
 *
 */
function extend(src) {
  var obj;
  var args = arguments;
  for (var i = 1; i < args.length; ++i) {
    if (obj = args[i]) {
      for (var key in obj) {
        // check if this property of the source object could be overridden
        if (isWritable(src, key))
          { src[key] = obj[key]; }
      }
    }
  }
  return src
}

var misc = Object.freeze({
	each: each,
	contains: contains,
	toCamel: toCamel,
	startsWith: startsWith,
	defineProperty: defineProperty,
	extend: extend
});

var settings$1 = extend(Object.create(brackets.settings), {
  skipAnonymousTags: true,
  // handle the auto updates on any DOM event
  autoUpdate: true
});

/**
 * Trigger DOM events
 * @param   { HTMLElement } dom - dom element target of the event
 * @param   { Function } handler - user function
 * @param   { Object } e - event object
 */
function handleEvent(dom, handler, e) {
  var ptag = this.__.parent;
  var item = this.__.item;

  if (!item)
    { while (ptag && !item) {
      item = ptag.__.item;
      ptag = ptag.__.parent;
    } }

  // override the event properties
  /* istanbul ignore next */
  if (isWritable(e, 'currentTarget')) { e.currentTarget = dom; }
  /* istanbul ignore next */
  if (isWritable(e, 'target')) { e.target = e.srcElement; }
  /* istanbul ignore next */
  if (isWritable(e, 'which')) { e.which = e.charCode || e.keyCode; }

  e.item = item;

  handler.call(this, e);

  // avoid auto updates
  if (!settings$1.autoUpdate) { return }

  if (!e.preventUpdate) {
    var p = getImmediateCustomParentTag(this);
    // fixes #2083
    if (p.isMounted) { p.update(); }
  }
}

/**
 * Attach an event to a DOM node
 * @param { String } name - event name
 * @param { Function } handler - event callback
 * @param { Object } dom - dom node
 * @param { Tag } tag - tag instance
 */
function setEventHandler(name, handler, dom, tag) {
  var eventName;
  var cb = handleEvent.bind(tag, dom, handler);

  // avoid to bind twice the same event
  // possible fix for #2332
  dom[name] = null;

  // normalize event name
  eventName = name.replace(RE_EVENTS_PREFIX, '');

  // cache the listener into the listeners array
  if (!contains(tag.__.listeners, dom)) { tag.__.listeners.push(dom); }
  if (!dom[RIOT_EVENTS_KEY]) { dom[RIOT_EVENTS_KEY] = {}; }
  if (dom[RIOT_EVENTS_KEY][name]) { dom.removeEventListener(eventName, dom[RIOT_EVENTS_KEY][name]); }

  dom[RIOT_EVENTS_KEY][name] = cb;
  dom.addEventListener(eventName, cb, false);
}

/**
 * Update dynamically created data-is tags with changing expressions
 * @param { Object } expr - expression tag and expression info
 * @param { Tag }    parent - parent for tag creation
 * @param { String } tagName - tag implementation we want to use
 */
function updateDataIs(expr, parent, tagName) {
  var tag = expr.tag || expr.dom._tag,
    ref;

  var ref$1 = tag ? tag.__ : {};
  var head = ref$1.head;
  var isVirtual = expr.dom.tagName === 'VIRTUAL';

  if (tag && expr.tagName === tagName) {
    tag.update();
    return
  }

  // sync _parent to accommodate changing tagnames
  if (tag) {
    // need placeholder before unmount
    if(isVirtual) {
      ref = createDOMPlaceholder();
      head.parentNode.insertBefore(ref, head);
    }

    tag.unmount(true);
  }

  // unable to get the tag name
  if (!isString(tagName)) { return }

  expr.impl = __TAG_IMPL[tagName];

  // unknown implementation
  if (!expr.impl) { return }

  expr.tag = tag = initChildTag(
    expr.impl, {
      root: expr.dom,
      parent: parent,
      tagName: tagName
    },
    expr.dom.innerHTML,
    parent
  );

  each(expr.attrs, function (a) { return setAttr(tag.root, a.name, a.value); });
  expr.tagName = tagName;
  tag.mount();

  // root exist first time, after use placeholder
  if (isVirtual) { makeReplaceVirtual(tag, ref || tag.root); }

  // parent is the placeholder tag, not the dynamic tag so clean up
  parent.__.onUnmount = function() {
    var delName = tag.opts.dataIs;
    arrayishRemove(tag.parent.tags, delName, tag);
    arrayishRemove(tag.__.parent.tags, delName, tag);
    tag.unmount();
  };
}

/**
 * Nomalize any attribute removing the "riot-" prefix
 * @param   { String } attrName - original attribute name
 * @returns { String } valid html attribute name
 */
function normalizeAttrName(attrName) {
  if (!attrName) { return null }
  attrName = attrName.replace(ATTRS_PREFIX, '');
  if (CASE_SENSITIVE_ATTRIBUTES[attrName]) { attrName = CASE_SENSITIVE_ATTRIBUTES[attrName]; }
  return attrName
}

/**
 * Update on single tag expression
 * @this Tag
 * @param { Object } expr - expression logic
 * @returns { undefined }
 */
function updateExpression(expr) {
  if (this.root && getAttr(this.root,'virtualized')) { return }

  var dom = expr.dom,
    // remove the riot- prefix
    attrName = normalizeAttrName(expr.attr),
    isToggle = contains([SHOW_DIRECTIVE, HIDE_DIRECTIVE], attrName),
    isVirtual = expr.root && expr.root.tagName === 'VIRTUAL',
    parent = dom && (expr.parent || dom.parentNode),
    // detect the style attributes
    isStyleAttr = attrName === 'style',
    isClassAttr = attrName === 'class',
    hasValue,
    isObj,
    value;

  // if it's a tag we could totally skip the rest
  if (expr._riot_id) {
    if (expr.__.wasCreated) {
      expr.update();
    // if it hasn't been mounted yet, do that now.
    } else {
      expr.mount();
      if (isVirtual) {
        makeReplaceVirtual(expr, expr.root);
      }
    }
    return
  }
  // if this expression has the update method it means it can handle the DOM changes by itself
  if (expr.update) { return expr.update() }

  // ...it seems to be a simple expression so we try to calculat its value
  value = tmpl(expr.expr, isToggle ? extend({}, Object.create(this.parent), this) : this);
  hasValue = !isBlank(value);
  isObj = isObject(value);

  // convert the style/class objects to strings
  if (isObj) {
    isObj = !isClassAttr && !isStyleAttr;
    if (isClassAttr) {
      value = tmpl(JSON.stringify(value), this);
    } else if (isStyleAttr) {
      value = styleObjectToString(value);
    }
  }

  // remove original attribute
  if (expr.attr && (!expr.isAttrRemoved || !hasValue || value === false)) {
    remAttr(dom, expr.attr);
    expr.isAttrRemoved = true;
  }

  // for the boolean attributes we don't need the value
  // we can convert it to checked=true to checked=checked
  if (expr.bool) { value = value ? attrName : false; }
  if (expr.isRtag) { return updateDataIs(expr, this, value) }
  if (expr.wasParsedOnce && expr.value === value) { return }

  // update the expression value
  expr.value = value;
  expr.wasParsedOnce = true;

  // if the value is an object we can not do much more with it
  if (isObj && !isToggle) { return }
  // avoid to render undefined/null values
  if (isBlank(value)) { value = ''; }

  // textarea and text nodes have no attribute name
  if (!attrName) {
    // about #815 w/o replace: the browser converts the value to a string,
    // the comparison by "==" does too, but not in the server
    value += '';
    // test for parent avoids error with invalid assignment to nodeValue
    if (parent) {
      // cache the parent node because somehow it will become null on IE
      // on the next iteration
      expr.parent = parent;
      if (parent.tagName === 'TEXTAREA') {
        parent.value = value;                    // #1113
        if (!IE_VERSION) { dom.nodeValue = value; }  // #1625 IE throws here, nodeValue
      }                                         // will be available on 'updated'
      else { dom.nodeValue = value; }
    }
    return
  }


  // event handler
  if (isFunction(value)) {
    setEventHandler(attrName, value, dom, this);
  // show / hide
  } else if (isToggle) {
    toggleVisibility(dom, attrName === HIDE_DIRECTIVE ? !value : value);
  // handle attributes
  } else {
    if (expr.bool) {
      dom[attrName] = value;
    }

    if (attrName === 'value' && dom.value !== value) {
      dom.value = value;
    }

    if (hasValue && value !== false) {
      setAttr(dom, attrName, value);
    }

    // make sure that in case of style changes
    // the element stays hidden
    if (isStyleAttr && dom.hidden) { toggleVisibility(dom, false); }
  }
}

/**
 * Update all the expressions in a Tag instance
 * @this Tag
 * @param { Array } expressions - expression that must be re evaluated
 */
function updateAllExpressions(expressions) {
  each(expressions, updateExpression.bind(this));
}

var IfExpr = {
  init: function init(dom, tag, expr) {
    remAttr(dom, CONDITIONAL_DIRECTIVE);
    this.tag = tag;
    this.expr = expr;
    this.stub = createDOMPlaceholder();
    this.pristine = dom;

    var p = dom.parentNode;
    p.insertBefore(this.stub, dom);
    p.removeChild(dom);

    return this
  },
  update: function update() {
    this.value = tmpl(this.expr, this.tag);

    if (this.value && !this.current) { // insert
      this.current = this.pristine.cloneNode(true);
      this.stub.parentNode.insertBefore(this.current, this.stub);
      this.expressions = [];
      parseExpressions.apply(this.tag, [this.current, this.expressions, true]);
    } else if (!this.value && this.current) { // remove
      unmountAll(this.expressions);
      if (this.current._tag) {
        this.current._tag.unmount();
      } else if (this.current.parentNode) {
        this.current.parentNode.removeChild(this.current);
      }
      this.current = null;
      this.expressions = [];
    }

    if (this.value) { updateAllExpressions.call(this.tag, this.expressions); }
  },
  unmount: function unmount() {
    unmountAll(this.expressions || []);
  }
};

var RefExpr = {
  init: function init(dom, parent, attrName, attrValue) {
    this.dom = dom;
    this.attr = attrName;
    this.rawValue = attrValue;
    this.parent = parent;
    this.hasExp = tmpl.hasExpr(attrValue);
    return this
  },
  update: function update() {
    var old = this.value;
    var customParent = this.parent && getImmediateCustomParentTag(this.parent);
    // if the referenced element is a custom tag, then we set the tag itself, rather than DOM
    var tagOrDom = this.dom.__ref || this.tag || this.dom;

    this.value = this.hasExp ? tmpl(this.rawValue, this.parent) : this.rawValue;

    // the name changed, so we need to remove it from the old key (if present)
    if (!isBlank(old) && customParent) { arrayishRemove(customParent.refs, old, tagOrDom); }
    if (!isBlank(this.value) && isString(this.value)) {
      // add it to the refs of parent tag (this behavior was changed >=3.0)
      if (customParent) { arrayishAdd(
        customParent.refs,
        this.value,
        tagOrDom,
        // use an array if it's a looped node and the ref is not an expression
        null,
        this.parent.__.index
      ); }

      if (this.value !== old) {
        setAttr(this.dom, this.attr, this.value);
      }
    } else {
      remAttr(this.dom, this.attr);
    }

    // cache the ref bound to this dom node
    // to reuse it in future (see also #2329)
    if (!this.dom.__ref) { this.dom.__ref = tagOrDom; }
  },
  unmount: function unmount() {
    var tagOrDom = this.tag || this.dom;
    var customParent = this.parent && getImmediateCustomParentTag(this.parent);
    if (!isBlank(this.value) && customParent)
      { arrayishRemove(customParent.refs, this.value, tagOrDom); }
  }
};

/**
 * Convert the item looped into an object used to extend the child tag properties
 * @param   { Object } expr - object containing the keys used to extend the children tags
 * @param   { * } key - value to assign to the new object returned
 * @param   { * } val - value containing the position of the item in the array
 * @param   { Object } base - prototype object for the new item
 * @returns { Object } - new object containing the values of the original item
 *
 * The variables 'key' and 'val' are arbitrary.
 * They depend on the collection type looped (Array, Object)
 * and on the expression used on the each tag
 *
 */
function mkitem(expr, key, val, base) {
  var item = base ? Object.create(base) : {};
  item[expr.key] = key;
  if (expr.pos) { item[expr.pos] = val; }
  return item
}

/**
 * Unmount the redundant tags
 * @param   { Array } items - array containing the current items to loop
 * @param   { Array } tags - array containing all the children tags
 */
function unmountRedundant(items, tags) {
  var i = tags.length;
  var j = items.length;

  while (i > j) {
    i--;
    remove.apply(tags[i], [tags, i]);
  }
}


/**
 * Remove a child tag
 * @this Tag
 * @param   { Array } tags - tags collection
 * @param   { Number } i - index of the tag to remove
 */
function remove(tags, i) {
  tags.splice(i, 1);
  this.unmount();
  arrayishRemove(this.parent, this, this.__.tagName, true);
}

/**
 * Move the nested custom tags in non custom loop tags
 * @this Tag
 * @param   { Number } i - current position of the loop tag
 */
function moveNestedTags(i) {
  var this$1 = this;

  each(Object.keys(this.tags), function (tagName) {
    moveChildTag.apply(this$1.tags[tagName], [tagName, i]);
  });
}

/**
 * Move a child tag
 * @this Tag
 * @param   { HTMLElement } root - dom node containing all the loop children
 * @param   { Tag } nextTag - instance of the next tag preceding the one we want to move
 * @param   { Boolean } isVirtual - is it a virtual tag?
 */
function move(root, nextTag, isVirtual) {
  if (isVirtual)
    { moveVirtual.apply(this, [root, nextTag]); }
  else
    { safeInsert(root, this.root, nextTag.root); }
}

/**
 * Insert and mount a child tag
 * @this Tag
 * @param   { HTMLElement } root - dom node containing all the loop children
 * @param   { Tag } nextTag - instance of the next tag preceding the one we want to insert
 * @param   { Boolean } isVirtual - is it a virtual tag?
 */
function insert(root, nextTag, isVirtual) {
  if (isVirtual)
    { makeVirtual.apply(this, [root, nextTag]); }
  else
    { safeInsert(root, this.root, nextTag.root); }
}

/**
 * Append a new tag into the DOM
 * @this Tag
 * @param   { HTMLElement } root - dom node containing all the loop children
 * @param   { Boolean } isVirtual - is it a virtual tag?
 */
function append(root, isVirtual) {
  if (isVirtual)
    { makeVirtual.call(this, root); }
  else
    { root.appendChild(this.root); }
}

/**
 * Manage tags having the 'each'
 * @param   { HTMLElement } dom - DOM node we need to loop
 * @param   { Tag } parent - parent tag instance where the dom node is contained
 * @param   { String } expr - string contained in the 'each' attribute
 * @returns { Object } expression object for this each loop
 */
function _each(dom, parent, expr) {
  var mustReorder = typeof getAttr(dom, LOOP_NO_REORDER_DIRECTIVE) !== T_STRING || remAttr(dom, LOOP_NO_REORDER_DIRECTIVE);
  var tagName = getTagName(dom);
  var impl = __TAG_IMPL[tagName];
  var parentNode = dom.parentNode;
  var placeholder = createDOMPlaceholder();
  var child = getTag(dom);
  var ifExpr = getAttr(dom, CONDITIONAL_DIRECTIVE);
  var tags = [];
  var isLoop = true;
  var isAnonymous = !__TAG_IMPL[tagName];
  var isVirtual = dom.tagName === 'VIRTUAL';
  var oldItems = [];
  var hasKeys;

  // remove the each property from the original tag
  remAttr(dom, LOOP_DIRECTIVE);

  // parse the each expression
  expr = tmpl.loopKeys(expr);
  expr.isLoop = true;

  if (ifExpr) { remAttr(dom, CONDITIONAL_DIRECTIVE); }

  // insert a marked where the loop tags will be injected
  parentNode.insertBefore(placeholder, dom);
  parentNode.removeChild(dom);

  expr.update = function updateEach() {
    // get the new items collection
    expr.value = tmpl(expr.val, parent);

    var items = expr.value;
    var frag = createFrag();
    var isObject$$1 = !isArray(items) && !isString(items);
    var root = placeholder.parentNode;

    // if this DOM was removed the update here is useless
    // this condition fixes also a weird async issue on IE in our unit test
    if (!root) { return }

    // object loop. any changes cause full redraw
    if (isObject$$1) {
      hasKeys = items || false;
      items = hasKeys ?
        Object.keys(items).map(function (key) { return mkitem(expr, items[key], key); }) : [];
    } else {
      hasKeys = false;
    }

    if (ifExpr) {
      items = items.filter(function (item, i) {
        if (expr.key && !isObject$$1)
          { return !!tmpl(ifExpr, mkitem(expr, item, i, parent)) }

        return !!tmpl(ifExpr, extend(Object.create(parent), item))
      });
    }

    // loop all the new items
    each(items, function (item, i) {
      // reorder only if the items are objects
      var doReorder = mustReorder && typeof item === T_OBJECT && !hasKeys;
      var oldPos = oldItems.indexOf(item);
      var isNew = oldPos === -1;
      var pos = !isNew && doReorder ? oldPos : i;
      // does a tag exist in this position?
      var tag = tags[pos];
      var mustAppend = i >= oldItems.length;
      var mustCreate =  doReorder && isNew || !doReorder && !tag;

      item = !hasKeys && expr.key ? mkitem(expr, item, i) : item;

      // new tag
      if (mustCreate) {
        tag = new Tag$1(impl, {
          parent: parent,
          isLoop: isLoop,
          isAnonymous: isAnonymous,
          tagName: tagName,
          root: dom.cloneNode(isAnonymous),
          item: item,
          index: i,
        }, dom.innerHTML);

        // mount the tag
        tag.mount();

        if (mustAppend)
          { append.apply(tag, [frag || root, isVirtual]); }
        else
          { insert.apply(tag, [root, tags[i], isVirtual]); }

        if (!mustAppend) { oldItems.splice(i, 0, item); }
        tags.splice(i, 0, tag);
        if (child) { arrayishAdd(parent.tags, tagName, tag, true); }
      } else if (pos !== i && doReorder) {
        // move
        if (contains(items, oldItems[pos])) {
          move.apply(tag, [root, tags[i], isVirtual]);
          // move the old tag instance
          tags.splice(i, 0, tags.splice(pos, 1)[0]);
          // move the old item
          oldItems.splice(i, 0, oldItems.splice(pos, 1)[0]);
        }

        // update the position attribute if it exists
        if (expr.pos) { tag[expr.pos] = i; }

        // if the loop tags are not custom
        // we need to move all their custom tags into the right position
        if (!child && tag.tags) { moveNestedTags.call(tag, i); }
      }

      // cache the original item to use it in the events bound to this node
      // and its children
      tag.__.item = item;
      tag.__.index = i;
      tag.__.parent = parent;

      if (!mustCreate) { tag.update(item); }
    });

    // remove the redundant tags
    unmountRedundant(items, tags);

    // clone the items array
    oldItems = items.slice();

    root.insertBefore(frag, placeholder);
  };

  expr.unmount = function () {
    each(tags, function (t) { t.unmount(); });
  };

  return expr
}

/**
 * Walk the tag DOM to detect the expressions to evaluate
 * @this Tag
 * @param   { HTMLElement } root - root tag where we will start digging the expressions
 * @param   { Array } expressions - empty array where the expressions will be added
 * @param   { Boolean } mustIncludeRoot - flag to decide whether the root must be parsed as well
 * @returns { Object } an object containing the root noode and the dom tree
 */
function parseExpressions(root, expressions, mustIncludeRoot) {
  var this$1 = this;

  var tree = {parent: {children: expressions}};

  walkNodes(root, function (dom, ctx) {
    var type = dom.nodeType,
      parent = ctx.parent,
      attr,
      expr,
      tagImpl;

    if (!mustIncludeRoot && dom === root) { return {parent: parent} }

    // text node
    if (type === 3 && dom.parentNode.tagName !== 'STYLE' && tmpl.hasExpr(dom.nodeValue))
      { parent.children.push({dom: dom, expr: dom.nodeValue}); }

    if (type !== 1) { return ctx } // not an element

    var isVirtual = dom.tagName === 'VIRTUAL';

    // loop. each does it's own thing (for now)
    if (attr = getAttr(dom, LOOP_DIRECTIVE)) {
      if(isVirtual) { setAttr(dom, 'loopVirtual', true); } // ignore here, handled in _each
      parent.children.push(_each(dom, this$1, attr));
      return false
    }

    // if-attrs become the new parent. Any following expressions (either on the current
    // element, or below it) become children of this expression.
    if (attr = getAttr(dom, CONDITIONAL_DIRECTIVE)) {
      parent.children.push(Object.create(IfExpr).init(dom, this$1, attr));
      return false
    }

    if (expr = getAttr(dom, IS_DIRECTIVE)) {
      if (tmpl.hasExpr(expr)) {
        parent.children.push({
          isRtag: true,
          expr: expr,
          dom: dom,
          attrs: [].slice.call(dom.attributes)
        });
        return false
      }
    }

    // if this is a tag, stop traversing here.
    // we ignore the root, since parseExpressions is called while we're mounting that root
    tagImpl = getTag(dom);
    if(isVirtual) {
      if(getAttr(dom, 'virtualized')) {dom.parentElement.removeChild(dom); } // tag created, remove from dom
      if(!tagImpl && !getAttr(dom, 'virtualized') && !getAttr(dom, 'loopVirtual'))  // ok to create virtual tag
        { tagImpl = { tmpl: dom.outerHTML }; }
    }

    if (tagImpl && (dom !== root || mustIncludeRoot)) {
      if(isVirtual && !getAttr(dom, IS_DIRECTIVE)) { // handled in update
        // can not remove attribute like directives
        // so flag for removal after creation to prevent maximum stack error
        setAttr(dom, 'virtualized', true);
        var tag = new Tag$1(
          {tmpl: dom.outerHTML},
          {root: dom, parent: this$1},
          dom.innerHTML
        );
        parent.children.push(tag); // no return, anonymous tag, keep parsing
      } else {
        parent.children.push(
          initChildTag(
            tagImpl,
            {
              root: dom,
              parent: this$1
            },
            dom.innerHTML,
            this$1
          )
        );
        return false
      }
    }

    // attribute expressions
    parseAttributes.apply(this$1, [dom, dom.attributes, function (attr, expr) {
      if (!expr) { return }
      parent.children.push(expr);
    }]);

    // whatever the parent is, all child elements get the same parent.
    // If this element had an if-attr, that's the parent for all child elements
    return {parent: parent}
  }, tree);
}

/**
 * Calls `fn` for every attribute on an element. If that attr has an expression,
 * it is also passed to fn.
 * @this Tag
 * @param   { HTMLElement } dom - dom node to parse
 * @param   { Array } attrs - array of attributes
 * @param   { Function } fn - callback to exec on any iteration
 */
function parseAttributes(dom, attrs, fn) {
  var this$1 = this;

  each(attrs, function (attr) {
    if (!attr) { return false }

    var name = attr.name;
    var bool = isBoolAttr(name);
    var expr;

    if (contains(REF_DIRECTIVES, name)) {
      expr =  Object.create(RefExpr).init(dom, this$1, name, attr.value);
    } else if (tmpl.hasExpr(attr.value)) {
      expr = {dom: dom, expr: attr.value, attr: name, bool: bool};
    }

    fn(attr, expr);
  });
}

/*
  Includes hacks needed for the Internet Explorer version 9 and below
  See: http://kangax.github.io/compat-table/es5/#ie8
       http://codeplanet.io/dropping-ie8/
*/

var reHasYield  = /<yield\b/i;
var reYieldAll  = /<yield\s*(?:\/>|>([\S\s]*?)<\/yield\s*>|>)/ig;
var reYieldSrc  = /<yield\s+to=['"]([^'">]*)['"]\s*>([\S\s]*?)<\/yield\s*>/ig;
var reYieldDest = /<yield\s+from=['"]?([-\w]+)['"]?\s*(?:\/>|>([\S\s]*?)<\/yield\s*>)/ig;
var rootEls = { tr: 'tbody', th: 'tr', td: 'tr', col: 'colgroup' };
var tblTags = IE_VERSION && IE_VERSION < 10 ? RE_SPECIAL_TAGS : RE_SPECIAL_TAGS_NO_OPTION;
var GENERIC = 'div';
var SVG = 'svg';


/*
  Creates the root element for table or select child elements:
  tr/th/td/thead/tfoot/tbody/caption/col/colgroup/option/optgroup
*/
function specialTags(el, tmpl, tagName) {

  var
    select = tagName[0] === 'o',
    parent = select ? 'select>' : 'table>';

  // trim() is important here, this ensures we don't have artifacts,
  // so we can check if we have only one element inside the parent
  el.innerHTML = '<' + parent + tmpl.trim() + '</' + parent;
  parent = el.firstChild;

  // returns the immediate parent if tr/th/td/col is the only element, if not
  // returns the whole tree, as this can include additional elements
  /* istanbul ignore next */
  if (select) {
    parent.selectedIndex = -1;  // for IE9, compatible w/current riot behavior
  } else {
    // avoids insertion of cointainer inside container (ex: tbody inside tbody)
    var tname = rootEls[tagName];
    if (tname && parent.childElementCount === 1) { parent = $(tname, parent); }
  }
  return parent
}

/*
  Replace the yield tag from any tag template with the innerHTML of the
  original tag in the page
*/
function replaceYield(tmpl, html) {
  // do nothing if no yield
  if (!reHasYield.test(tmpl)) { return tmpl }

  // be careful with #1343 - string on the source having `$1`
  var src = {};

  html = html && html.replace(reYieldSrc, function (_, ref, text) {
    src[ref] = src[ref] || text;   // preserve first definition
    return ''
  }).trim();

  return tmpl
    .replace(reYieldDest, function (_, ref, def) {  // yield with from - to attrs
      return src[ref] || def || ''
    })
    .replace(reYieldAll, function (_, def) {        // yield without any "from"
      return html || def || ''
    })
}

/**
 * Creates a DOM element to wrap the given content. Normally an `DIV`, but can be
 * also a `TABLE`, `SELECT`, `TBODY`, `TR`, or `COLGROUP` element.
 *
 * @param   { String } tmpl  - The template coming from the custom tag definition
 * @param   { String } html - HTML content that comes from the DOM element where you
 *           will mount the tag, mostly the original tag in the page
 * @param   { Boolean } isSvg - true if the root node is an svg
 * @returns { HTMLElement } DOM element with _tmpl_ merged through `YIELD` with the _html_.
 */
function mkdom(tmpl, html, isSvg$$1) {
  var match   = tmpl && tmpl.match(/^\s*<([-\w]+)/);
  var  tagName = match && match[1].toLowerCase();
  var el = mkEl(isSvg$$1 ? SVG : GENERIC);

  // replace all the yield tags with the tag inner html
  tmpl = replaceYield(tmpl, html);

  /* istanbul ignore next */
  if (tblTags.test(tagName))
    { el = specialTags(el, tmpl, tagName); }
  else
    { setInnerHTML(el, tmpl); }

  return el
}

/**
 * Another way to create a riot tag a bit more es6 friendly
 * @param { HTMLElement } el - tag DOM selector or DOM node/s
 * @param { Object } opts - tag logic
 * @returns { Tag } new riot tag instance
 */
function Tag$2(el, opts) {
  // get the tag properties from the class constructor
  var ref = this;
  var name = ref.name;
  var tmpl = ref.tmpl;
  var css = ref.css;
  var attrs = ref.attrs;
  var onCreate = ref.onCreate;
  // register a new tag and cache the class prototype
  if (!__TAG_IMPL[name]) {
    tag$1(name, tmpl, css, attrs, onCreate);
    // cache the class constructor
    __TAG_IMPL[name].class = this.constructor;
  }

  // mount the tag using the class instance
  mountTo(el, name, opts, this);
  // inject the component css
  if (css) { styleManager.inject(); }

  return this
}

/**
 * Create a new riot tag implementation
 * @param   { String }   name - name/id of the new riot tag
 * @param   { String }   tmpl - tag template
 * @param   { String }   css - custom tag css
 * @param   { String }   attrs - root tag attributes
 * @param   { Function } fn - user function
 * @returns { String } name/id of the tag just created
 */
function tag$1(name, tmpl, css, attrs, fn) {
  if (isFunction(attrs)) {
    fn = attrs;

    if (/^[\w-]+\s?=/.test(css)) {
      attrs = css;
      css = '';
    } else
      { attrs = ''; }
  }

  if (css) {
    if (isFunction(css))
      { fn = css; }
    else
      { styleManager.add(css); }
  }

  name = name.toLowerCase();
  __TAG_IMPL[name] = { name: name, tmpl: tmpl, attrs: attrs, fn: fn };

  return name
}

/**
 * Create a new riot tag implementation (for use by the compiler)
 * @param   { String }   name - name/id of the new riot tag
 * @param   { String }   tmpl - tag template
 * @param   { String }   css - custom tag css
 * @param   { String }   attrs - root tag attributes
 * @param   { Function } fn - user function
 * @returns { String } name/id of the tag just created
 */
function tag2$1(name, tmpl, css, attrs, fn) {
  if (css) { styleManager.add(css, name); }

  __TAG_IMPL[name] = { name: name, tmpl: tmpl, attrs: attrs, fn: fn };

  return name
}

/**
 * Mount a tag using a specific tag implementation
 * @param   { * } selector - tag DOM selector or DOM node/s
 * @param   { String } tagName - tag implementation name
 * @param   { Object } opts - tag logic
 * @returns { Array } new tags instances
 */
function mount$1(selector, tagName, opts) {
  var tags = [];
  var elem, allTags;

  function pushTagsTo(root) {
    if (root.tagName) {
      var riotTag = getAttr(root, IS_DIRECTIVE), tag;

      // have tagName? force riot-tag to be the same
      if (tagName && riotTag !== tagName) {
        riotTag = tagName;
        setAttr(root, IS_DIRECTIVE, tagName);
      }

      tag = mountTo(root, riotTag || root.tagName.toLowerCase(), opts);

      if (tag)
        { tags.push(tag); }
    } else if (root.length)
      { each(root, pushTagsTo); } // assume nodeList
  }

  // inject styles into DOM
  styleManager.inject();

  if (isObject(tagName)) {
    opts = tagName;
    tagName = 0;
  }

  // crawl the DOM to find the tag
  if (isString(selector)) {
    selector = selector === '*' ?
      // select all registered tags
      // & tags found with the riot-tag attribute set
      allTags = selectTags() :
      // or just the ones named like the selector
      selector + selectTags(selector.split(/, */));

    // make sure to pass always a selector
    // to the querySelectorAll function
    elem = selector ? $$(selector) : [];
  }
  else
    // probably you have passed already a tag or a NodeList
    { elem = selector; }

  // select all the registered and mount them inside their root elements
  if (tagName === '*') {
    // get all custom tags
    tagName = allTags || selectTags();
    // if the root els it's just a single tag
    if (elem.tagName)
      { elem = $$(tagName, elem); }
    else {
      // select all the children for all the different root elements
      var nodeList = [];

      each(elem, function (_el) { return nodeList.push($$(tagName, _el)); });

      elem = nodeList;
    }
    // get rid of the tagName
    tagName = 0;
  }

  pushTagsTo(elem);

  return tags
}

// Create a mixin that could be globally shared across all the tags
var mixins = {};
var globals = mixins[GLOBAL_MIXIN] = {};
var mixins_id = 0;

/**
 * Create/Return a mixin by its name
 * @param   { String }  name - mixin name (global mixin if object)
 * @param   { Object }  mix - mixin logic
 * @param   { Boolean } g - is global?
 * @returns { Object }  the mixin logic
 */
function mixin$1(name, mix, g) {
  // Unnamed global
  if (isObject(name)) {
    mixin$1(("__" + (mixins_id++) + "__"), name, true);
    return
  }

  var store = g ? globals : mixins;

  // Getter
  if (!mix) {
    if (isUndefined(store[name]))
      { throw new Error(("Unregistered mixin: " + name)) }

    return store[name]
  }

  // Setter
  store[name] = isFunction(mix) ?
    extend(mix.prototype, store[name] || {}) && mix :
    extend(store[name] || {}, mix);
}

/**
 * Update all the tags instances created
 * @returns { Array } all the tags instances
 */
function update$1() {
  return each(__TAGS_CACHE, function (tag) { return tag.update(); })
}

function unregister$1(name) {
  __TAG_IMPL[name] = null;
}

var version$1 = 'v3.6.3';


var core = Object.freeze({
	Tag: Tag$2,
	tag: tag$1,
	tag2: tag2$1,
	mount: mount$1,
	mixin: mixin$1,
	update: update$1,
	unregister: unregister$1,
	version: version$1
});

// counter to give a unique id to all the Tag instances
var uid = 0;

/**
 * We need to update opts for this tag. That requires updating the expressions
 * in any attributes on the tag, and then copying the result onto opts.
 * @this Tag
 * @param   {Boolean} isLoop - is it a loop tag?
 * @param   { Tag }  parent - parent tag node
 * @param   { Boolean }  isAnonymous - is it a tag without any impl? (a tag not registered)
 * @param   { Object }  opts - tag options
 * @param   { Array }  instAttrs - tag attributes array
 */
function updateOpts(isLoop, parent, isAnonymous, opts, instAttrs) {
  // isAnonymous `each` tags treat `dom` and `root` differently. In this case
  // (and only this case) we don't need to do updateOpts, because the regular parse
  // will update those attrs. Plus, isAnonymous tags don't need opts anyway
  if (isLoop && isAnonymous) { return }
  var ctx = !isAnonymous && isLoop ? this : parent || this;

  each(instAttrs, function (attr) {
    if (attr.expr) { updateAllExpressions.call(ctx, [attr.expr]); }
    // normalize the attribute names
    opts[toCamel(attr.name).replace(ATTRS_PREFIX, '')] = attr.expr ? attr.expr.value : attr.value;
  });
}

/**
 * Toggle the isMounted flag
 * @this Tag
 * @param { Boolean } value - ..of the isMounted flag
 */
function setIsMounted(value) {
  defineProperty(this, 'isMounted', value);
}


/**
 * Tag class
 * @constructor
 * @param { Object } impl - it contains the tag template, and logic
 * @param { Object } conf - tag options
 * @param { String } innerHTML - html that eventually we need to inject in the tag
 */
function Tag$1(impl, conf, innerHTML) {
  if ( impl === void 0 ) impl = {};
  if ( conf === void 0 ) conf = {};

  var opts = extend({}, conf.opts),
    parent = conf.parent,
    isLoop = conf.isLoop,
    isAnonymous = !!conf.isAnonymous,
    skipAnonymous = settings$1.skipAnonymousTags && isAnonymous,
    item = conf.item,
    index = conf.index, // available only for the looped nodes
    instAttrs = [], // All attributes on the Tag when it's first parsed
    implAttrs = [], // expressions on this type of Tag
    expressions = [],
    root = conf.root,
    tagName = conf.tagName || getTagName(root),
    isVirtual = tagName === 'virtual',
    isInline = !isVirtual && !impl.tmpl,
    propsInSyncWithParent = [],
    dom;

  // make this tag observable
  if (!skipAnonymous) { observable$1(this); }
  // only call unmount if we have a valid __TAG_IMPL (has name property)
  if (impl.name && root._tag) { root._tag.unmount(true); }

  // not yet mounted
  setIsMounted.call(this, false);

  defineProperty(this, '__', {
    isAnonymous: isAnonymous,
    instAttrs: instAttrs,
    innerHTML: innerHTML,
    tagName: tagName,
    index: index,
    isLoop: isLoop,
    isInline: isInline,
    // tags having event listeners
    // it would be better to use weak maps here but we can not introduce breaking changes now
    listeners: [],
    // these vars will be needed only for the virtual tags
    virts: [],
    wasCreated: false,
    tail: null,
    head: null,
    parent: null,
    item: null
  });

  // create a unique id to this tag
  // it could be handy to use it also to improve the virtual dom rendering speed
  defineProperty(this, '_riot_id', ++uid); // base 1 allows test !t._riot_id
  defineProperty(this, 'root', root);
  extend(this, { opts: opts }, item);
  // protect the "tags" and "refs" property from being overridden
  defineProperty(this, 'parent', parent || null);
  defineProperty(this, 'tags', {});
  defineProperty(this, 'refs', {});

  if (isInline || isLoop && isAnonymous) {
    dom = root;
  } else {
    if (!isVirtual) { root.innerHTML = ''; }
    dom = mkdom(impl.tmpl, innerHTML, isSvg(root));
  }

  /**
   * Update the tag expressions and options
   * @param   { * }  data - data we want to use to extend the tag properties
   * @returns { Tag } the current tag instance
   */
  defineProperty(this, 'update', function tagUpdate(data) {
    var nextOpts = {},
      canTrigger = this.isMounted && !skipAnonymous;

    extend(this, data);
    updateOpts.apply(this, [isLoop, parent, isAnonymous, nextOpts, instAttrs]);

    if (
      canTrigger &&
      this.isMounted &&
      isFunction(this.shouldUpdate) && !this.shouldUpdate(data, nextOpts)
    ) {
      return this
    }

    // inherit properties from the parent, but only for isAnonymous tags
    if (isLoop && isAnonymous) { inheritFrom.apply(this, [this.parent, propsInSyncWithParent]); }
    extend(opts, nextOpts);
    if (canTrigger) { this.trigger('update', data); }
    updateAllExpressions.call(this, expressions);
    if (canTrigger) { this.trigger('updated'); }

    return this

  }.bind(this));

  /**
   * Add a mixin to this tag
   * @returns { Tag } the current tag instance
   */
  defineProperty(this, 'mixin', function tagMixin() {
    var this$1 = this;

    each(arguments, function (mix) {
      var instance, obj;
      var props = [];

      // properties blacklisted and will not be bound to the tag instance
      var propsBlacklist = ['init', '__proto__'];

      mix = isString(mix) ? mixin$1(mix) : mix;

      // check if the mixin is a function
      if (isFunction(mix)) {
        // create the new mixin instance
        instance = new mix();
      } else { instance = mix; }

      var proto = Object.getPrototypeOf(instance);

      // build multilevel prototype inheritance chain property list
      do { props = props.concat(Object.getOwnPropertyNames(obj || instance)); }
      while (obj = Object.getPrototypeOf(obj || instance))

      // loop the keys in the function prototype or the all object keys
      each(props, function (key) {
        // bind methods to this
        // allow mixins to override other properties/parent mixins
        if (!contains(propsBlacklist, key)) {
          // check for getters/setters
          var descriptor = Object.getOwnPropertyDescriptor(instance, key) || Object.getOwnPropertyDescriptor(proto, key);
          var hasGetterSetter = descriptor && (descriptor.get || descriptor.set);

          // apply method only if it does not already exist on the instance
          if (!this$1.hasOwnProperty(key) && hasGetterSetter) {
            Object.defineProperty(this$1, key, descriptor);
          } else {
            this$1[key] = isFunction(instance[key]) ?
              instance[key].bind(this$1) :
              instance[key];
          }
        }
      });

      // init method will be called automatically
      if (instance.init)
        { instance.init.bind(this$1)(); }
    });
    return this
  }.bind(this));

  /**
   * Mount the current tag instance
   * @returns { Tag } the current tag instance
   */
  defineProperty(this, 'mount', function tagMount() {
    var this$1 = this;

    root._tag = this; // keep a reference to the tag just created

    // Read all the attrs on this instance. This give us the info we need for updateOpts
    parseAttributes.apply(parent, [root, root.attributes, function (attr, expr) {
      if (!isAnonymous && RefExpr.isPrototypeOf(expr)) { expr.tag = this$1; }
      attr.expr = expr;
      instAttrs.push(attr);
    }]);

    // update the root adding custom attributes coming from the compiler
    implAttrs = [];
    walkAttrs(impl.attrs, function (k, v) { implAttrs.push({name: k, value: v}); });
    parseAttributes.apply(this, [root, implAttrs, function (attr, expr) {
      if (expr) { expressions.push(expr); }
      else { setAttr(root, attr.name, attr.value); }
    }]);

    // initialiation
    updateOpts.apply(this, [isLoop, parent, isAnonymous, opts, instAttrs]);

    // add global mixins
    var globalMixin = mixin$1(GLOBAL_MIXIN);

    if (globalMixin && !skipAnonymous) {
      for (var i in globalMixin) {
        if (globalMixin.hasOwnProperty(i)) {
          this$1.mixin(globalMixin[i]);
        }
      }
    }

    if (impl.fn) { impl.fn.call(this, opts); }

    if (!skipAnonymous) { this.trigger('before-mount'); }

    // parse layout after init. fn may calculate args for nested custom tags
    parseExpressions.apply(this, [dom, expressions, isAnonymous]);

    this.update(item);

    if (!isAnonymous && !isInline) {
      while (dom.firstChild) { root.appendChild(dom.firstChild); }
    }

    defineProperty(this, 'root', root);

    // if we need to wait that the parent "mount" or "updated" event gets triggered
    if (!skipAnonymous && this.parent) {
      var p = getImmediateCustomParentTag(this.parent);
      p.one(!p.isMounted ? 'mount' : 'updated', function () {
        setIsMounted.call(this$1, true);
        this$1.trigger('mount');
      });
    } else {
      // otherwise it's not a child tag we can trigger its mount event
      setIsMounted.call(this, true);
      if (!skipAnonymous) { this.trigger('mount'); }
    }

    this.__.wasCreated = true;

    return this

  }.bind(this));

  /**
   * Unmount the tag instance
   * @param { Boolean } mustKeepRoot - if it's true the root node will not be removed
   * @returns { Tag } the current tag instance
   */
  defineProperty(this, 'unmount', function tagUnmount(mustKeepRoot) {
    var this$1 = this;

    var el = this.root;
    var p = el.parentNode;
    var tagIndex = __TAGS_CACHE.indexOf(this);
    var ptag;

    if (!skipAnonymous) { this.trigger('before-unmount'); }

    // clear all attributes coming from the mounted tag
    walkAttrs(impl.attrs, function (name) {
      if (startsWith(name, ATTRS_PREFIX))
        { name = name.slice(ATTRS_PREFIX.length); }

      remAttr(root, name);
    });

    // remove all the event listeners
    this.__.listeners.forEach(function (dom) {
      Object.keys(dom[RIOT_EVENTS_KEY]).forEach(function (eventName) {
        dom.removeEventListener(eventName, dom[RIOT_EVENTS_KEY][eventName]);
      });
    });

    // remove this tag instance from the global virtualDom variable
    if (tagIndex !== -1)
      { __TAGS_CACHE.splice(tagIndex, 1); }

    if (p || isVirtual) {
      if (parent) {
        ptag = getImmediateCustomParentTag(parent);

        if (isVirtual) {
          Object.keys(this.tags).forEach(function (tagName) {
            arrayishRemove(ptag.tags, tagName, this$1.tags[tagName]);
          });
        } else {
          arrayishRemove(ptag.tags, tagName, this);
          // remove from _parent too
          if(parent !== ptag) {
            arrayishRemove(parent.tags, tagName, this);
          }
        }
      } else {
        // remove the tag contents
        setInnerHTML(el, '');
      }

      if (p && !mustKeepRoot) { p.removeChild(el); }
    }

    if (this.__.virts) {
      each(this.__.virts, function (v) {
        if (v.parentNode) { v.parentNode.removeChild(v); }
      });
    }

    // allow expressions to unmount themselves
    unmountAll(expressions);
    each(instAttrs, function (a) { return a.expr && a.expr.unmount && a.expr.unmount(); });

    // custom internal unmount function to avoid relying on the observable
    if (this.__.onUnmount) { this.__.onUnmount(); }

    if (!skipAnonymous) {
      // weird fix for a weird edge case #2409
      if (!this.isMounted) { this.trigger('mount'); }
      this.trigger('unmount');
      this.off('*');
    }

    defineProperty(this, 'isMounted', false);
    this.__.wasCreated = false;

    delete this.root._tag;

    return this

  }.bind(this));
}

/**
 * Detect the tag implementation by a DOM node
 * @param   { Object } dom - DOM node we need to parse to get its tag implementation
 * @returns { Object } it returns an object containing the implementation of a custom tag (template and boot function)
 */
function getTag(dom) {
  return dom.tagName && __TAG_IMPL[getAttr(dom, IS_DIRECTIVE) ||
    getAttr(dom, IS_DIRECTIVE) || dom.tagName.toLowerCase()]
}

/**
 * Inherit properties from a target tag instance
 * @this Tag
 * @param   { Tag } target - tag where we will inherit properties
 * @param   { Array } propsInSyncWithParent - array of properties to sync with the target
 */
function inheritFrom(target, propsInSyncWithParent) {
  var this$1 = this;

  each(Object.keys(target), function (k) {
    // some properties must be always in sync with the parent tag
    var mustSync = contains(propsInSyncWithParent, k);

    if (isUndefined(this$1[k]) || mustSync) {
      // track the property to keep in sync
      // so we can keep it updated
      if (!mustSync) { propsInSyncWithParent.push(k); }
      this$1[k] = target[k];
    }
  });
}

/**
 * Move the position of a custom tag in its parent tag
 * @this Tag
 * @param   { String } tagName - key where the tag was stored
 * @param   { Number } newPos - index where the new tag will be stored
 */
function moveChildTag(tagName, newPos) {
  var parent = this.parent;
  var tags;
  // no parent no move
  if (!parent) { return }

  tags = parent.tags[tagName];

  if (isArray(tags))
    { tags.splice(newPos, 0, tags.splice(tags.indexOf(this), 1)[0]); }
  else { arrayishAdd(parent.tags, tagName, this); }
}

/**
 * Create a new child tag including it correctly into its parent
 * @param   { Object } child - child tag implementation
 * @param   { Object } opts - tag options containing the DOM node where the tag will be mounted
 * @param   { String } innerHTML - inner html of the child node
 * @param   { Object } parent - instance of the parent tag including the child custom tag
 * @returns { Object } instance of the new child tag just created
 */
function initChildTag(child, opts, innerHTML, parent) {
  var tag = new Tag$1(child, opts, innerHTML);
  var tagName = opts.tagName || getTagName(opts.root, true);
  var ptag = getImmediateCustomParentTag(parent);
  // fix for the parent attribute in the looped elements
  defineProperty(tag, 'parent', ptag);
  // store the real parent tag
  // in some cases this could be different from the custom parent tag
  // for example in nested loops
  tag.__.parent = parent;

  // add this tag to the custom parent tag
  arrayishAdd(ptag.tags, tagName, tag);

  // and also to the real parent tag
  if (ptag !== parent)
    { arrayishAdd(parent.tags, tagName, tag); }

  return tag
}

/**
 * Loop backward all the parents tree to detect the first custom parent tag
 * @param   { Object } tag - a Tag instance
 * @returns { Object } the instance of the first custom parent tag found
 */
function getImmediateCustomParentTag(tag) {
  var ptag = tag;
  while (ptag.__.isAnonymous) {
    if (!ptag.parent) { break }
    ptag = ptag.parent;
  }
  return ptag
}

/**
 * Trigger the unmount method on all the expressions
 * @param   { Array } expressions - DOM expressions
 */
function unmountAll(expressions) {
  each(expressions, function (expr) {
    if (expr instanceof Tag$1) { expr.unmount(true); }
    else if (expr.tagName) { expr.tag.unmount(true); }
    else if (expr.unmount) { expr.unmount(); }
  });
}

/**
 * Get the tag name of any DOM node
 * @param   { Object } dom - DOM node we want to parse
 * @param   { Boolean } skipDataIs - hack to ignore the data-is attribute when attaching to parent
 * @returns { String } name to identify this dom node in riot
 */
function getTagName(dom, skipDataIs) {
  var child = getTag(dom);
  var namedTag = !skipDataIs && getAttr(dom, IS_DIRECTIVE);
  return namedTag && !tmpl.hasExpr(namedTag) ?
    namedTag : child ? child.name : dom.tagName.toLowerCase()
}

/**
 * Set the property of an object for a given key. If something already
 * exists there, then it becomes an array containing both the old and new value.
 * @param { Object } obj - object on which to set the property
 * @param { String } key - property name
 * @param { Object } value - the value of the property to be set
 * @param { Boolean } ensureArray - ensure that the property remains an array
 * @param { Number } index - add the new item in a certain array position
 */
function arrayishAdd(obj, key, value, ensureArray, index) {
  var dest = obj[key];
  var isArr = isArray(dest);
  var hasIndex = !isUndefined(index);

  if (dest && dest === value) { return }

  // if the key was never set, set it once
  if (!dest && ensureArray) { obj[key] = [value]; }
  else if (!dest) { obj[key] = value; }
  // if it was an array and not yet set
  else {
    if (isArr) {
      var oldIndex = dest.indexOf(value);
      // this item never changed its position
      if (oldIndex === index) { return }
      // remove the item from its old position
      if (oldIndex !== -1) { dest.splice(oldIndex, 1); }
      // move or add the item
      if (hasIndex) {
        dest.splice(index, 0, value);
      } else {
        dest.push(value);
      }
    } else { obj[key] = [dest, value]; }
  }
}

/**
 * Removes an item from an object at a given key. If the key points to an array,
 * then the item is just removed from the array.
 * @param { Object } obj - object on which to remove the property
 * @param { String } key - property name
 * @param { Object } value - the value of the property to be removed
 * @param { Boolean } ensureArray - ensure that the property remains an array
*/
function arrayishRemove(obj, key, value, ensureArray) {
  if (isArray(obj[key])) {
    var index = obj[key].indexOf(value);
    if (index !== -1) { obj[key].splice(index, 1); }
    if (!obj[key].length) { delete obj[key]; }
    else if (obj[key].length === 1 && !ensureArray) { obj[key] = obj[key][0]; }
  } else
    { delete obj[key]; } // otherwise just delete the key
}

/**
 * Mount a tag creating new Tag instance
 * @param   { Object } root - dom node where the tag will be mounted
 * @param   { String } tagName - name of the riot tag we want to mount
 * @param   { Object } opts - options to pass to the Tag instance
 * @param   { Object } ctx - optional context that will be used to extend an existing class ( used in riot.Tag )
 * @returns { Tag } a new Tag instance
 */
function mountTo(root, tagName, opts, ctx) {
  var impl = __TAG_IMPL[tagName];
  var implClass = __TAG_IMPL[tagName].class;
  var tag = ctx || (implClass ? Object.create(implClass.prototype) : {});
  // cache the inner HTML to fix #855
  var innerHTML = root._innerHTML = root._innerHTML || root.innerHTML;
  var conf = extend({ root: root, opts: opts }, { parent: opts ? opts.parent : null });

  if (impl && root) { Tag$1.apply(tag, [impl, conf, innerHTML]); }

  if (tag && tag.mount) {
    tag.mount(true);
    // add this tag to the virtualDom variable
    if (!contains(__TAGS_CACHE, tag)) { __TAGS_CACHE.push(tag); }
  }

  return tag
}

/**
 * makes a tag virtual and replaces a reference in the dom
 * @this Tag
 * @param { tag } the tag to make virtual
 * @param { ref } the dom reference location
 */
function makeReplaceVirtual(tag, ref) {
  var frag = createFrag();
  makeVirtual.call(tag, frag);
  ref.parentNode.replaceChild(frag, ref);
}

/**
 * Adds the elements for a virtual tag
 * @this Tag
 * @param { Node } src - the node that will do the inserting or appending
 * @param { Tag } target - only if inserting, insert before this tag's first child
 */
function makeVirtual(src, target) {
  var this$1 = this;

  var head = createDOMPlaceholder();
  var tail = createDOMPlaceholder();
  var frag = createFrag();
  var sib;
  var el;

  this.root.insertBefore(head, this.root.firstChild);
  this.root.appendChild(tail);

  this.__.head = el = head;
  this.__.tail = tail;

  while (el) {
    sib = el.nextSibling;
    frag.appendChild(el);
    this$1.__.virts.push(el); // hold for unmounting
    el = sib;
  }

  if (target)
    { src.insertBefore(frag, target.__.head); }
  else
    { src.appendChild(frag); }
}

/**
 * Move virtual tag and all child nodes
 * @this Tag
 * @param { Node } src  - the node that will do the inserting
 * @param { Tag } target - insert before this tag's first child
 */
function moveVirtual(src, target) {
  var this$1 = this;

  var el = this.__.head, sib;
  var frag = createFrag();

  while (el) {
    sib = el.nextSibling;
    frag.appendChild(el);
    el = sib;
    if (el === this$1.__.tail) {
      frag.appendChild(el);
      src.insertBefore(frag, target.__.head);
      break
    }
  }
}

/**
 * Get selectors for tags
 * @param   { Array } tags - tag names to select
 * @returns { String } selector
 */
function selectTags(tags) {
  // select all tags
  if (!tags) {
    var keys = Object.keys(__TAG_IMPL);
    return keys + selectTags(keys)
  }

  return tags
    .filter(function (t) { return !/[^-\w]/.test(t); })
    .reduce(function (list, t) {
      var name = t.trim().toLowerCase();
      return list + ",[" + IS_DIRECTIVE + "=\"" + name + "\"]"
    }, '')
}


var tags = Object.freeze({
	getTag: getTag,
	inheritFrom: inheritFrom,
	moveChildTag: moveChildTag,
	initChildTag: initChildTag,
	getImmediateCustomParentTag: getImmediateCustomParentTag,
	unmountAll: unmountAll,
	getTagName: getTagName,
	arrayishAdd: arrayishAdd,
	arrayishRemove: arrayishRemove,
	mountTo: mountTo,
	makeReplaceVirtual: makeReplaceVirtual,
	makeVirtual: makeVirtual,
	moveVirtual: moveVirtual,
	selectTags: selectTags
});

/**
 * Riot public api
 */
var settings = settings$1;
var util = {
  tmpl: tmpl,
  brackets: brackets,
  styleManager: styleManager,
  vdom: __TAGS_CACHE,
  styleNode: styleManager.styleNode,
  // export the riot internal utils as well
  dom: dom,
  check: check,
  misc: misc,
  tags: tags
};

// export the core props/methods
var Tag = Tag$2;
var tag = tag$1;
var tag2 = tag2$1;
var mount = mount$1;
var mixin = mixin$1;
var update = update$1;
var unregister = unregister$1;
var version = version$1;
var observable = observable$1;

var riot$1 = extend({}, core, {
  observable: observable$1,
  settings: settings,
  util: util,
});

exports.settings = settings;
exports.util = util;
exports.Tag = Tag;
exports.tag = tag;
exports.tag2 = tag2;
exports.mount = mount;
exports.mixin = mixin;
exports.update = update;
exports.unregister = unregister;
exports.version = version;
exports.observable = observable;
exports['default'] = riot$1;

Object.defineProperty(exports, '__esModule', { value: true });

})));

},{}],7:[function(require,module,exports){
class Adapter {
    static adaptRecipe(recipe) {
        if (recipe.adapted === true)
            return recipe;
        recipe.adapted = true;
        var date_start = new Date(recipe.date_start * 1000);
        recipe.date_start_readable = date_start.getDate() + "/" + (date_start.getMonth() + 1) + "/" + date_start.getFullYear();
        var date_end = new Date(recipe.date_end * 1000);
        recipe.date_end_readable = date_end.getDate() + "/" + (date_end.getMonth() + 1) + "/" + date_end.getFullYear();
        if (recipe.pins != null)
            recipe.pins = recipe.pins.split(";");
        else
            recipe.pins = [];
        if (recipe.origin != null)
            recipe.origin = recipe.origin.split(";");
        else
            recipe.origin = [];
        if (recipe.items != null)
            recipe.items = recipe.items.split(";");
        else
            recipe.items = [];
        if (recipe.origin[recipe.origin.length - 1] == "" || recipe.origin[recipe.origin.length - 1] == null)
            recipe.origin.pop();
        if (recipe.items[recipe.items.length - 1] == "" || recipe.items[recipe.items.length - 1] == null)
            recipe.items.pop();
        if (recipe.pins[recipe.pins.length - 1] == "" || recipe.pins[recipe.pins.length - 1] == null)
            recipe.pins.pop();
        recipe.place_left = parseInt(recipe.places) - recipe.users.length;
        if (recipe.user != null) {
            var geolocation = recipe.user.geolocation.split(",");
            if (geolocation.length == 2) {
                recipe.latitude = geolocation[0];
                recipe.longitude = geolocation[1];
            }
        }
        recipe.price = parseInt(recipe.price);
        return recipe;
    }
    static adaptUser(user) {
        if (user.adapted === true)
            return user;
        user.adapted = true;
        if (user.discease != null)
            user.discease = user.discease.split(";");
        else
            user.discease = [];
        if (user.preference != null)
            user.preference = user.preference.split(";");
        else
            user.preference = [];
        if (user.pins != null)
            user.pins = user.pins.split(";");
        else
            user.pins = [];
        if (user.discease[user.discease.length - 1] == "" || user.discease[user.discease.length - 1] == null)
            user.discease.pop();
        if (user.preference[user.preference.length - 1] == "" || user.preference[user.preference.length - 1] == null)
            user.preference.pop();
        if (user.pins[user.pins.length - 1] == "" || user.pins[user.pins.length - 1] == null)
            user.pins.pop();
        if (user.preference.length >= 1) {
            user.style = user.preference[0];
        }
        return user;
    }
    static adaptReport(report) {
        switch (report.state) {
            case "1":
            case 1:
            default:
                report.message_state = "Nouveau";
                break;
            case "2":
            case 2:
                report.message_state = "En Cours";
                break;
            case "3":
            case 3:
                report.message_state = "Terminé";
                break;
        }
        return report;
    }
}
class ErrorHandler {
    static GetInstance() {
        return ErrorHandler.Instance;
    }
    handle(response) {
        if (response.state == "OK")
            return;
        var error = new Error();
        switch (response.data) {
            case 0:
                error.message = "Vos informations de connexion ne sont pas valides.";
                error.name = ErrorHandler.State.FATAL;
                break;
            case 1:
                error.message = "Vous n'avez pas les droits suffisants.";
                error.name = ErrorHandler.State.FATAL;
                break;
            case "23000":
            case 23000:
                error = this.handleSQL(response);
                break;
            case "105":
            case 105:
                error.message = "Une valeur requise est manquante. Veuillez vérifier le formulaire.";
                error.name = ErrorHandler.State.ERROR;
                break;
            case 101:
                var length = response.message.split(" than ")[1].split("\n\n#0")[0];
                error.message = "Une valeur est en dessous de la longueur requise de " + length + " caractères. Veuillez vérifier le formulaire.";
                error.name = ErrorHandler.State.ERROR;
                break;
            default:
                error.name = ErrorHandler.State.ERROR;
                error.message = "Ooops... Quelque chose s'est mal passé. Veuillez réessayer plus tard.";
                break;
        }
        throw error;
    }
    handleSQL(response) {
        var error = new Error();
        // gestion de l'unicité 
        if (response.message.indexOf(" 1062 ") != -1) {
            var value = response.message.split("Duplicate entry '")[1].split("' for key ")[0];
            error.message = "La valeur " + value + " transmise existe déjà dans la base de données. Veuillez corriger le formulaire.";
            error.name = ErrorHandler.State.ERROR;
        }
        return error;
    }
    static alertIfError(error) {
        if (error instanceof Error)
            vex.dialog.alert(error.message);
    }
}
ErrorHandler.State = {
    INFO: "INFO",
    ERROR: "ERROR",
    FATAL: "FATAL"
};
ErrorHandler.Instance = new ErrorHandler();
var Cookies = require("js-cookie");
var md5 = require("md5");
class Login {
    constructor() {
        this.token = null;
        this.user = null;
        this.token = Cookies.get("token");
        if (Cookies.get("user") != null)
            this.user = JSON.parse(Cookies.get("user"));
    }
    static GetInstance() {
        return Login.Instance;
    }
    Token() {
        return this.token;
    }
    User() {
        return this.user;
    }
    setToken(token) {
        this.token = token;
        Cookies.set("token", token);
    }
    setUser(user) {
        this.user = user;
        Cookies.set("user", JSON.stringify(user));
    }
    logout() {
        this.setToken(null);
        this.setUser(null);
    }
    isLogged() {
        if (this.token == null)
            return false;
        return true;
    }
    auth(username, password) {
        return new Promise((resolve, reject) => {
            var tmptoken = md5(username + md5(password));
            var retrieve = App.request(App.Address + "/auth", {
                token: tmptoken
            }, false);
            retrieve.then((response) => {
                this.setToken(tmptoken);
                this.setUser(response.data);
                resolve(response.data);
            });
            retrieve.catch((error) => {
                reject(error);
            });
        });
    }
}
Login.Instance = new Login();
/**
 * Created by clovis on 11/08/17.
 */
class Router {
    constructor() {
        this.setRoutes();
    }
    static GetInstance() {
        return Router.Instance;
    }
    start() {
        if (Login.GetInstance().isLogged() === false && window.location.href.indexOf("/error") === -1) {
            route("");
        }
        route.start(true);
    }
    /////////////////////////////////////////////////////////////////
    // Reservation
    reservationRecipe(id) {
        var requestRecipe = App.request(App.Address + "/getrecipe", {
            "id": id
        });
        requestRecipe.then(function (response) {
            if (response.data == null) {
                route("/error/404");
                return;
            }
            var requestUser = App.request(App.Address + "/getuser", {
                "id": response.data.User_id
            });
            var filters = {
                "Recipe_id": response.data.id
            };
            var requestReservations = App.request(App.Address + "/getreservations", {
                "filters": JSON.stringify(filters)
            });
            return Promise.all([Promise.resolve(response.data), requestUser, requestReservations]);
        }).then(function (responses) {
            console.log(responses);
            if (responses[1].data == null) {
                route("/error/404");
                return;
            }
            var recipe = responses[0];
            recipe.user = responses[1].data;
            recipe.guests = new Array();
            responses[2].data.forEach(function (reservation) {
                recipe.guests.push(reservation.guest);
            });
            App.changePage("app-reservation", {
                "recipe": recipe
            });
        }).catch(function (error) {
            if (error instanceof Error)
                ErrorHandler.alertIfError(error);
        });
    }
    // Error
    error(message) {
        if (message != null)
            message = decodeURI(message);
        App.changePage("app-error", {
            "message": message
        });
    }
    // USER
    user(id) {
        var retrieveUser = App.request(App.Address + "/getuser", {
            "id": id
        });
        var retrieveRecipes = App.request(App.Address + "/getrecipes", {
            "filters": JSON.stringify({
                "User_id": id
            })
        });
        var retrieveComments = App.request(App.Address + "/getcomments", {
            "filters": JSON.stringify({
                "target_id": id
            })
        });
        var request = Promise.all([
            retrieveUser, retrieveRecipes, retrieveComments
        ]);
        request.then(function (responses) {
            if (responses[0].data === null) {
                route("/error/404");
                return;
            }
            var user = Adapter.adaptUser(responses[0].data);
            var recipes = responses[1].data;
            var comments = responses[2].data;
            App.changePage("app-user", {
                "user": user,
                "recipes": recipes,
                "comments": comments
            });
        });
        request.catch(function (error) {
            ErrorHandler.alertIfError(error);
        });
    }
    // RECIPE
    recipe(id) {
        var request = App.request(App.Address + "/getrecipe", {
            "id": id
        });
        request.then(function (response) {
            if (response.data === null) {
                route("/error/404");
                return;
            }
            var recipe = Adapter.adaptRecipe(response.data);
            var requestRecipe = Promise.resolve(recipe);
            var requestUser = App.request(App.Address + "/getuser", {
                "id": recipe.User_id
            });
            return Promise.all([requestRecipe, requestUser]);
        }).then(function (responses) {
            var recipe = responses[0];
            if (responses[1].data === null) {
                route("/error/404");
                return;
            }
            var user = responses[1].data;
            recipe.user = user;
            App.changePage("app-recipe", {
                "recipe": recipe
            });
        }).catch(function (error) {
            ErrorHandler.alertIfError(error);
        });
    }
    recipeEdit(id) {
        var request = App.request(App.Address + "/getrecipe", {
            "id": id
        });
        request.then(function (response) {
            if (response.data === null) {
                route("/error/404");
                return;
            }
            var recipe = Adapter.adaptRecipe(response.data);
            App.changePage("app-recipeedit", {
                "recipe": recipe
            });
        });
        request.catch(function (error) {
            ErrorHandler.alertIfError(error);
        });
    }
    // ACCOUNT
    accountKitchen() {
        var filters = {
            target_id: Login.GetInstance().User().id
        };
        var request = App.request(App.Address + "/getcomments", {
            filters: JSON.stringify(filters)
        });
        request.then((response) => {
            var comments = response.data.splice(0, 5);
            App.changePage("app-accountkitchen", {
                "comments": comments
            });
        });
        request.catch((error) => {
            if (error instanceof Error) {
                App.changePage("app-accountkitchen", {
                    "comments": null
                });
            }
        });
    }
    accountRecipes() {
        var filters = {
            User_id: Login.GetInstance().User().id
        };
        var request = App.request(App.Address + "/getrecipes", {
            filters: JSON.stringify(filters)
        });
        request.then((response) => {
            var recipes = response.data;
            console.log(recipes);
            App.changePage("app-accountrecipes", {
                "recipes": recipes
            });
        });
        request.catch((error) => {
            ErrorHandler.alertIfError(error);
        });
    }
    accountReservations() {
        var filters = {
            "guest_id": Login.GetInstance().User().id
        };
        var request = App.request(App.Address + "/getreservations", {
            filters: JSON.stringify(filters)
        });
        request.then((response) => {
            var reservations = response.data;
            App.changePage("app-accountreservations", {
                "reservations": reservations
            });
        });
        request.catch((error) => {
            ErrorHandler.alertIfError(error);
        });
    }
    accountUser() {
        var request = App.request(App.Address + "/getuser", {
            "id": Login.GetInstance().User().id
        });
        request.then(function (response) {
            if (response.data === null) {
                route("/error/404");
                return;
            }
            var user = Adapter.adaptUser(response.data);
            App.changePage("app-accountuser", {
                "user": user
            });
        });
        request.catch(function (error) {
            ErrorHandler.alertIfError(error);
        });
    }
    // SEARCH
    searchresults(recipes, params = null) {
        var pars = null;
        if (params != null) {
            pars = params.split(",");
        }
        var filters = {};
        if (recipes != null && recipes != "null")
            filters.id = recipes.split(",");
        else {
            App.changePage("app-searchresults", {
                "recipes": [],
                "params": pars
            });
            return;
        }
        var request = App.request(App.Address + "/getrecipes", {
            "filters": JSON.stringify(filters)
        });
        request.then(function (response) {
            App.changePage("app-searchresults", {
                "recipes": response.data,
                "params": pars
            });
        });
        request.catch(function (error) {
            ErrorHandler.alertIfError(error);
        });
    }
    search() {
        App.changePage("app-search", null);
    }
    ///////////////////////////////////////////////////////////////
    setRoutes() {
        // Reservation
        route("/reservation/recipe/*", this.reservationRecipe);
        // Account
        route("/account/recipes", this.accountRecipes);
        route("/account/reservations", this.accountReservations);
        route("/account/user", this.accountUser);
        route("/account", this.accountKitchen);
        // User
        route("/user/*", this.user);
        // Recipe
        route("/recipe/edit/*", this.recipeEdit);
        route("/recipe/add", function () {
            App.changePage("app-recipeedit", null);
        });
        route("/recipe/*", this.recipe);
        // Search
        route("/search/results/*/params/*", this.searchresults);
        route("/search/results/*", this.searchresults);
        route("/search/results", this.search);
        route("/search", this.search);
        // Base
        route("error/404", () => {
            this.error(encodeURI("Page Introuvable."));
        });
        route("error/*", this.error);
        route("error", this.error);
        route("register", function () {
            App.changePage("app-useredit", null);
        });
        route('', function () {
            App.changePage("app-home", null);
        });
        route("index", function () {
            App.changePage("app-home", null);
        });
        /*

         // Recipe
         route("recipe/add", function () {
         App.changePage("app-recipeedit", null);
         });

         route("recipe/edit/*", function (id) {
         App.changePage("app-recipeedit", id);
         });

         route("recipe/*", function (id) {
         App.changePage("app-recipe", id);
         });


         // Immutable
         route("/error/*", function (message) {
         App.changePage("app-error", message);
         });







         */
    }
}
Router.Instance = new Router();
var riot = require("riot");
var tags = {
    // ACCOUNT
    "app-accountkitchen": require("./../../tags/Account/AccountKitchen.tag"),
    "app-accountrecipes": require("./../../tags/Account/AccountRecipes.tag"),
    "app-accountreservations": require("./../../tags/Account/AccountReservations.tag"),
    "app-accountuser": require("./../../tags/Account/AccountUser.tag"),
    // COMMENT
    "app-commenteditform": require("./../../tags/Comment/CommentEditForm.tag"),
    "app-commentitem": require("./../../tags/Comment/CommentItem.tag"),
    "app-commentlist": require("./../../tags/Comment/CommentList.tag"),
    "app-comments": require("./../../tags/Comment/Comments.tag"),
    // IMMUTABLE
    "app-error": require("./../../tags/Immutable/Error.tag"),
    "app-home": require("./../../tags/Immutable/Home.tag"),
    "app-login": require("./../../tags/Immutable/Login.tag"),
    // MISC
    "app-dateinput": require("./../../tags/Misc/DateInput.tag"),
    "app-footer": require("./../../tags/Misc/Footer.tag"),
    "app-header": require("./../../tags/Misc/Header.tag"),
    "app-hearts": require("./../../tags/Misc/Hearts.tag"),
    "app-manyinputs": require("./../../tags/Misc/ManyInputs.tag"),
    "app-origininput": require("./../../tags/Misc/OriginInput.tag"),
    "app-pinsinput": require("./../../tags/Misc/PinsInput.tag"),
    "app-placehint": require("./../../tags/Misc/PlaceHint.tag"),
    "app-placeinput": require("./../../tags/Misc/PlaceInput.tag"),
    "app-tabbar": require("./../../tags/Misc/TabBar.tag"),
    "app-timeinput": require("./../../tags/Misc/TimeInput.tag"),
    // RECIPE
    "app-recipe": require("./../../tags/Recipe/Recipe.tag"),
    "app-recipeedit": require("./../../tags/Recipe/RecipeEdit.tag"),
    "app-recipeeditform": require("./../../tags/Recipe/RecipeEditForm.tag"),
    "app-recipeitem": require("./../../tags/Recipe/RecipeItem.tag"),
    "app-recipelist": require("./../../tags/Recipe/RecipeList.tag"),
    "app-recipes": require("./../../tags/Recipe/Recipes.tag"),
    // REPORT
    "app-reports": require("./../../tags/Report/Reports.tag"),
    "app-reportitem": require("./../../tags/Report/ReportItem.tag"),
    "app-reporteditform": require("./../../tags/Report/ReportEditForm.tag"),
    // RESERVATION
    "app-reservation": require("./../../tags/Reservation/Reservation.tag"),
    "app-reservationitem": require("./../../tags/Reservation/ReservationItem.tag"),
    "app-reservations": require("./../../tags/Reservation/Reservations.tag"),
    // SEARCH
    "app-search": require("./../../tags/Search/Search.tag"),
    "app-searchitem": require("./../../tags/Search/SearchItem.tag"),
    "app-searcher": require("./../../tags/Search/Searcher.tag"),
    "app-searchresults": require("./../../tags/Search/SearchResults.tag"),
    // USER
    "app-user": require("./../../tags/User/User.tag"),
    "app-useredit": require("./../../tags/User/UserEdit.tag"),
    "app-usereditform": require("./../../tags/User/UserEditForm.tag"),
    "app-useritem": require("./../../tags/User/UserItem.tag"),
    "app-userpasswordform": require("./../../tags/User/UserPasswordForm.tag"),
    "app-users": require("./../../tags/User/Users.tag"),
};
class App {
    static diagnosticForm(formname, errors) {
        for (var field in errors[formname]) {
            var nodes = document.getElementsByName(field);
            if (nodes.length <= 0)
                continue;
            var node = (nodes[0]);
            node.classList.add("error");
            node.addEventListener("focus", function (e) {
                e.target.classList.remove("error");
            });
            node.addEventListener("click", function (e) {
                e.target.classList.remove("error");
            });
        }
    }
    static request(address, data, redirect = true) {
        return new Promise(function (resolve, reject) {
            var href = window.location.href;
            if (data == null)
                data = {};
            if (address.indexOf(App.Address) != -1 && Login.GetInstance().isLogged() && data.token == null)
                data.token = Login.GetInstance().Token();
            var request = ajax({
                method: "POST",
                url: address,
                "data": data
            });
            App.showLoading();
            request.then(function (response) {
                App.hideLoading();
                if (App.checkPage(href) == false) {
                    reject(ErrorHandler.State.FATAL);
                    return;
                }
                if (address.indexOf(App.Address) == -1) {
                    resolve(response);
                    return;
                }
                try {
                    ErrorHandler.GetInstance().handle(response);
                    resolve(response);
                }
                catch (error) {
                    if (error.name == ErrorHandler.State.FATAL) {
                        if (redirect) {
                            var message = encodeURI(error.message);
                            reject(ErrorHandler.State.FATAL);
                            route("/error/" + message);
                            console.error(error.message);
                        }
                        else {
                            ErrorHandler.alertIfError(error);
                        }
                    }
                    else
                        reject(error);
                }
            });
            request.catch(function (error) {
                App.hideLoading();
                if (App.checkPage(href) == false) {
                    reject(ErrorHandler.State.FATAL);
                    return;
                }
                var message = encodeURI("Une erreur réseau a eu lieu. Vérifiez votre connexion et réessayez.");
                reject(ErrorHandler.State.FATAL);
                route("/error/" + message);
            });
        });
    }
    static checkPage(page) {
        if (window.location.href != page)
            return false;
        return true;
    }
    static changePage(tag, data) {
        if (App.Page != null) {
            App.Page.forEach(function (t) {
                t.unmount();
            });
            var e = document.createElement("div");
            e.id = "app";
            document.body.appendChild(e);
        }
        App.hideLoading();
        App.Page = riot.mount("div#app", tags[tag], data);
    }
    static showPopUp(tag, title, data) {
        if (App.PopUp != null) {
            App.PopUp.forEach(function (t) {
                t.unmount();
            });
            if (document.querySelector("div#popup") != null)
                document.querySelector("div#popup").remove();
        }
        var hide = document.createElement("div");
        hide.id = "hidder";
        hide.addEventListener("click", App.hidePopUp);
        document.body.appendChild(hide);
        var e = document.createElement("div");
        e.id = "popup";
        e.setAttribute("data-name", title);
        var d = document.createElement("div");
        e.appendChild(d);
        var close = document.createElement("div");
        close.className = "close";
        close.innerHTML = "🞩";
        e.appendChild(close);
        close.addEventListener("click", App.hidePopUp);
        document.body.appendChild(e);
        App.PopUp = riot.mount(d, tag, data);
        return App.PopUp;
    }
    static hidePopUp() {
        if (App.PopUp != null) {
            App.PopUp.forEach(function (t) {
                t.unmount();
            });
            if (document.querySelector("div#popup") != null)
                document.querySelector("div#popup").remove();
            if (document.querySelector("div#hidder") != null)
                document.querySelector("div#hidder").remove();
        }
    }
    static showLoading() {
        App.LoadingCounter++;
        if (document.getElementById("loading") != null)
            return;
        var e = document.createElement("div");
        e.id = "loading";
        document.body.appendChild(e);
    }
    static hideLoading() {
        App.LoadingCounter--;
        if (App.LoadingCounter > 0)
            return;
        var e = document.getElementById("loading");
        if (e == null)
            return;
        e.remove();
        App.LoadingCounter = 0;
    }
}
App.Address = "http://localhost:8080/API";
App.Page = null;
App.PopUp = null;
App.LoadingCounter = 0;
window.addEventListener("load", function () {
    Router.GetInstance().start();
});
class Search {
    static search(place, origin, date, price_start, price_end) {
        return new Promise((resolve, reject) => {
            var filters = {};
            if (place != null && place != "")
                filters["geolocation"] = place;
            if (origin != null && origin != "")
                filters["origin"] = origin;
            if (date != null && date != "") {
                filters["date_start"] = date;
                filters["date_end"] = date;
            }
            if (price_start != null)
                filters["price_start"] = price_start;
            if (price_end != null)
                filters["price_end"] = price_end;
            console.log(filters);
            var retrieve = App.request(App.Address + "/getrecipes", {
                "filters": JSON.stringify(filters)
            });
            retrieve.then(function (response) {
                var ids = [];
                response.data.forEach(function (recipe) {
                    ids.push(recipe.id);
                });
                resolve(ids);
            });
            retrieve.catch(function (error) {
                reject(error);
            });
        });
    }
}
/// <reference path="Login.ts" />
/// <reference path="Router.ts" />
/// <reference path="Global.ts" />
/// <reference path="Adapter.ts" />
/// <reference path="Search/Search.ts" />
window.Login = Login;
window.Router = Router;
window.App = App;
window.Adapter = Adapter;
window.Search = Search;

},{"./../../tags/Account/AccountKitchen.tag":8,"./../../tags/Account/AccountRecipes.tag":9,"./../../tags/Account/AccountReservations.tag":10,"./../../tags/Account/AccountUser.tag":11,"./../../tags/Comment/CommentEditForm.tag":12,"./../../tags/Comment/CommentItem.tag":13,"./../../tags/Comment/CommentList.tag":14,"./../../tags/Comment/Comments.tag":15,"./../../tags/Immutable/Error.tag":16,"./../../tags/Immutable/Home.tag":17,"./../../tags/Immutable/Login.tag":18,"./../../tags/Misc/DateInput.tag":19,"./../../tags/Misc/Footer.tag":20,"./../../tags/Misc/Header.tag":21,"./../../tags/Misc/Hearts.tag":22,"./../../tags/Misc/ManyInputs.tag":23,"./../../tags/Misc/OriginInput.tag":24,"./../../tags/Misc/PinsInput.tag":25,"./../../tags/Misc/PlaceHint.tag":26,"./../../tags/Misc/PlaceInput.tag":27,"./../../tags/Misc/TabBar.tag":28,"./../../tags/Misc/TimeInput.tag":29,"./../../tags/Recipe/Recipe.tag":30,"./../../tags/Recipe/RecipeEdit.tag":31,"./../../tags/Recipe/RecipeEditForm.tag":32,"./../../tags/Recipe/RecipeItem.tag":33,"./../../tags/Recipe/RecipeList.tag":34,"./../../tags/Recipe/Recipes.tag":35,"./../../tags/Report/ReportEditForm.tag":36,"./../../tags/Report/ReportItem.tag":37,"./../../tags/Report/Reports.tag":38,"./../../tags/Reservation/Reservation.tag":39,"./../../tags/Reservation/ReservationItem.tag":40,"./../../tags/Reservation/Reservations.tag":41,"./../../tags/Search/Search.tag":42,"./../../tags/Search/SearchItem.tag":43,"./../../tags/Search/SearchResults.tag":44,"./../../tags/Search/Searcher.tag":45,"./../../tags/User/User.tag":46,"./../../tags/User/UserEdit.tag":47,"./../../tags/User/UserEditForm.tag":48,"./../../tags/User/UserItem.tag":49,"./../../tags/User/UserPasswordForm.tag":50,"./../../tags/User/Users.tag":51,"js-cookie":4,"md5":5,"riot":6}],8:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag2('app-accountkitchen', '<app-header></app-header> <app-tabbar tabs="{tabs}"></app-tabbar> <div class="content no-margin"> <div class="header"> <div> <div class="img" riot-style="background-image: url(\'{user.picture}\');"></div> <div class="identity"> <h2>Bonjour {user.username}</h2> <ul> <li><a onclick="{edit}">> Modifier votre profil</a></li> <li><a onclick="{see}">> Voir votre profil public</a></li> </ul> </div> </div> </div> <div class="comments"> <h1>Commentaires Récents</h1> <app-comments ref="comments" if="{comments != null}" comments="{comments}"></app-comments> </div> </div> <app-footer></app-footer>', '', '', function(opts) {
        var tag = this;
        tag.tabs = null;
        tag.user = null;
        tag.comments = null;

        tag.on("before-mount", function()
        {
            tag.user = Login.GetInstance().User();
            tag.comments = tag.opts.comments;

            tag.tabs = [
                {
                    name: "Cuisine",
                    route: "/account",
                    selected : true
                },
                {
                    name : "Recettes",
                    route : "/account/recipes",
                    selected : false
                },
                {
                    name : "Réservations",
                    route : "/account/reservations",
                    selected : false
                },
                {
                    name : "Profil",
                    route : "/account/user",
                    selected : false
                }
            ];
        });

        tag.edit = function()
        {
            route("/account/user");
        };

        tag.see = function()
        {
            route("/user/"+tag.user.id);
        }
});
},{"riot":6}],9:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag2('app-accountrecipes', '<app-header></app-header> <app-tabbar tabs="{tabs}"></app-tabbar> <div class="content"> <section class="header"> <h1>La dernière recette proposée</h1> <div> <app-recipeitem if="{last_recipe != null}" recipe="{last_recipe}"></app-recipeitem> <div if="{last_recipe == null}"> Aucune recette proposée </div> </div> </section> <nav> <a onclick="{showFuture}">A venir</a> <a onclick="{showPast}">Passées</a> </nav> <app-recipes ref="recipes" recipes="{list}" if="{list != null}"></app-recipes> </div> <app-footer></app-footer>', '', '', function(opts) {
        var tag = this;
        tag.tabs = null;

        tag.last_recipe = null;
        tag.recipes = null;
        tag.list = null;

        tag.on("before-mount", function()
        {
            tag.recipes = tag.opts.recipes;
            if(tag.recipes.length > 0)
                tag.last_recipe = tag.recipes[tag.recipes.length - 1];
            tag.list = tag.sortRecipes(true);

            tag.tabs = [
                {
                    name: "Cuisine",
                    route: "/account",
                    selected : false
                },
                {
                    name : "Recettes",
                    route : "/account/recipes",
                    selected : true
                },
                {
                    name : "Réservations",
                    route : "/account/reservations",
                    selected : false
                },
                {
                    name : "Profil",
                    route : "/account/user",
                    selected : false
                }
            ];
        });

        tag.sortRecipes = function(futur)
        {
            lst = [];
            var now = new Date().getTime();
            tag.recipes.forEach((recipe) => {
                if(recipe === null || recipe.date_end === null)
                    return;
                var stamp = recipe.date_end * 1000;
                if(futur === true)
                {
                    if(stamp > now)
                        lst.push(recipe);
                }
                else
                {
                    if(stamp < now)
                        lst.push(recipe);
                }
            });
            return lst;
        };

        tag.showRecipes = function(lst)
        {
            tag.list = lst;
            tag.refs.recipes.setRecipes(tag.list);
        };

        tag.showFuture = function()
        {
            var lst = tag.sortRecipes(true);
            console.log(lst);
            tag.showRecipes(lst);
        };

        tag.showPast = function()
        {
            var lst = tag.sortRecipes(false);
            console.log(lst);
            tag.showRecipes(lst);
        }
});
},{"riot":6}],10:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag2('app-accountreservations', '<app-header></app-header> <app-tabbar tabs="{tabs}"></app-tabbar> <div> <app-reservations reservations="{reservations}" ref="reservations"></app-reservations> </div> <app-footer></app-footer>', '', '', function(opts) {
        var tag = this;

        tag.tabs = null;
        tag.reservations = null;

        tag.on("before-mount", function () {
            tag.reservations = tag.opts.reservations;
            tag.tabs = [{
                    name: "Cuisine",
                    route: "/account",
                    selected: false
                },
                {
                    name: "Recettes",
                    route: "/account/recipes",
                    selected: false
                },
                {
                    name: "Réservations",
                    route: "/account/reservations",
                    selected: true
                },
                {
                    name: "Profil",
                    route: "/account/user",
                    selected: false
                }
            ];
        });
});
},{"riot":6}],11:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag2('app-accountuser', '<app-header></app-header> <app-tabbar tabs="{tabs}"></app-tabbar> <div class="content"> <app-usereditform ref="form" user="{user}" callback="{send}"></app-usereditform> </div> <app-footer></app-footer>', '', '', function(opts) {
        var tag = this;

        tag.tabs = null;
        tag.user = null;

        tag.on("before-mount", function()
        {
            tag.user = tag.opts.user;

            tag.tabs = [{
                    name: "Cuisine",
                    route: "/account",
                    selected: false
                },
                {
                    name: "Recettes",
                    route: "/account/recipes",
                    selected: false
                },
                {
                    name: "Réservations",
                    route: "/account/reservations",
                    selected: false
                },
                {
                    name: "Profil",
                    route: "/account/user",
                    selected: true
                }
            ];
        });

        tag.send = function()
        {
            if(tag.user.id === null)
            {
                vex.dialog.alert("Félicitation ! Vous êtes désormais un membre de Melting Cook. Vous pouvez vous connecter.");
            }
            else
            {
                vex.dialog.alert("Vos informations ont bien été mises à jour !");
            }
            route("/");
        };
});
},{"riot":6}],12:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag2('app-commenteditform', '<form name="edit-comment" class="{invisible : tag.comment==null}"> <div> <label>Contenu de l\'avis</label> <textarea name="content" ref="content"> {comment.content} </textarea> <p> Ce champ doit contenir entre 10 et 400 caractères. </p> </div> <input type="button" class="large" value="Envoyer" onclick="{send}"> </form>', '', '', function(opts) {
        var tag = this;

        tag.comment = tag.opts.comment;
        tag.target = tag.opts.target;
        tag.author = tag.opts.author;
        tag.callback = tag.opts.callback;

        tag.send = function () {
                var valid = new Validatinator({
                    "edit-comment": {
                        "content": "required|minLength:10|maxLength:400"
                    }
                });
                if (valid.passes("edit-user")) {
                    var url = App.Address + "/updatecomment";
                    var cmt = tag.comment;
                    if(cmt.id == null)
                    {
                        url = App.Address + "/addcomment";
                        cmt = {};
                        cmt.author_id = tag.author.id;
                        cmt.target_id = tag.target.id;
                    }
                    cmt.content = tag.refs.content.value
                    var request = App.request(url, cmt);
                    request.then((response) => {
                        tag.callback();
                    });
                    request.catch((error) => {
                        ErrorHandler.alertIfError(error);
                    });
                }
                if(valid.fails("edit-comment"))
                {
                    App.diagnosticForm("edit-comment", valid.errors);
                }

        }
});
},{"riot":6}],13:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag2('app-commentitem', '<img class="profile" riot-src="{comment.author.picture}"> <div> <div>{comment.author.username} - {comment.author.age} ans <div class="Hearts nb-{comment.note}"></div></div> <div> <p> {comment.content} </p> </div> </div>', '', '', function(opts) {
        var tag = this;

        tag.comment = tag.opts.comment;
});
},{"riot":6}],14:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag2('app-commentlist', '<app-header></app-header> <app-comments comments="{comments}"></app-comments> <app-footer></app-footer>', '', '', function(opts) {
        var tag = this;

        tag.comments = null;

        tag.on("before-mount", function(){
            tag.comments = tag.opts.comments;

            if(tag.comments == null)
                tag.retrieveComments();
        });

        tag.retrieveComments = function()
        {
            var request = App.request(App.Address + "/getcomments", null);
            request.then((response) => {
                tag.comments = response.data;
                tag.update();
            });
            request.catch((error) => {
                        ErrorHandler.alertIfError(error);

            });
        };
});
},{"riot":6}],15:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag2('app-comments', '<app-commentitem each="{comment in comments}" comment="{comment}"></app-commentitem>', '', '', function(opts) {
        var tag = this;

        tag.comments = null;

        tag.on("before-mount", function()
        {
            tag.comments = tag.opts.comments;
            if(tag.comments === null)
                throw new Error("Comments cant be null.");
        });

        tag.setComments = function(comments)
        {
            tag.comments = comments;
            tag.update();
        }
});
},{"riot":6}],16:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag2('app-error', '<app-header></app-header> <div> <h1>Ooops... Quelque chose s\'est mal passé.</h1> <div> <p> Nous sommes désolés pour ce petit soucis. </p> <p if="{message != null}"> {message} </p> </div> </div> <app-footer></app-footer>', '', '', function(opts) {
        var tag = this;

        tag.message = null;

        tag.on("before-mount", function()
        {
            if(tag.opts.message !== null)
                tag.message = tag.opts.message;
        });
});
},{"riot":6}],17:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag2('app-home', '<app-header></app-header> <div class="content no-margin"> <app-searcher></app-searcher> </div> <app-footer></app-footer>', '', '', function(opts) {
});
},{"riot":6}],18:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag2('app-login', '<form name="login"> <div> <label for="username">Utilisateur</label> <input type="text" ref="username" name="username" id="username"> </div> <div> <label for="password">Mot de passe</label> <input type="password" ref="password" name="password" id="password"> </div> <input type="button" class="large" value="Envoyer" onclick="{send}"> </form>', '', '', function(opts) {
        var tag = this;

        tag.callback = null;

        tag.on("before-mount", function()
        {
            tag.callback = tag.opts.callback;
            if(tag.callback == null)
                throw new Error("Callback cant be null.");
        });

        tag.send = function () {
            var valid = new Validatinator({
                "login": {
                    "username": "required|minLength:1|maxLength:100",
                    "password": "required|minLength:1|maxLength:100",
                }
            });
            if (valid.passes("login")) {
                var auth = Login.GetInstance().auth(tag.refs.username.value, tag.refs.password.value);
                auth.then((user) =>
                {
                    tag.callback();
                });
            }
            if(valid.fails("login"))
            {
                App.diagnosticForm("login", valid.errors);
            }
        };
});
},{"riot":6}],19:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag2('app-dateinput', '<input type="text" ref="date" name="date" id="date" placeholder="Date">', '', '', function(opts) {
        var tag = this;
        tag.value = null;

        tag.on("mount", () => {
            var picker = $('input', tag.root).pickadate({
                format: 'dd/mm/yyyy',
                formatSubmit: 'dd/mm/yyyy',
                hiddenName: true
            });

            if(tag.opts.date !== null)
            {
                picker.pickadate('picker').set("select", tag.opts.date);
            }

            $('input', tag.root)
                .pickadate('picker')
                .on('render', function () {
                    var date = $('input', tag.root).pickadate('picker').get("value");
                    if(date === null)
                        return;
                    date = date.split("/");
                    date = new Date(date[2], parseInt(date[1]) - 1, date[0]);
                    tag.value = Math.round(date.getTime() / 1000);
                });

            if(tag.opts.date != null)
            {
                tag.setValueFromStamp(tag.opts.date);
            }
        });

        tag.setValueFromStamp = function(date)
        {
            console.log(date);
            tag.value = date;
            var readable = new Date();
            readable.setTime(parseInt(date) * 1000);
            console.log(readable.getDate()+"/"+(readable.getMonth()+1)+"/"+readable.getFullYear());
            tag.refs.date.value = readable.getDate()+"/"+(readable.getMonth()+1)+"/"+readable.getFullYear();
            console.log(tag.refs.date.value);
        }
});
},{"riot":6}],20:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag2('app-footer', '<div> <h3>Infos pratiques</h3> <ul> <li>Comment ça marche</li> <li>Confiance et sérénité</li> <li>Niveaux d\'expérience</li> <li>Les avis</li> <li>Charte de bonne conduite</li> <li>Prix d\'un service culinaire</li> <li>Foire aux questions</li> </ul> </div> <div> <h3>A propos</h3> <ul> <li>Qui sommes-nous ?</li> <li>Contact</li> </ul> </div> <div> <h3>Mentions légales</h3> <ul> <li>Conditions générales</li> <li>Politique de confidentialité</li> </ul> </div> <div> <a class="Button fb"><span>Facebook</span></a> <a class="Button twitter"><span>Twitter</span></a> <a class="Button insta"><span>Instagram</span></a> <a class="Button youtube"><span>Youtube</span></a> </div>', '', '', function(opts) {
        var tag = this;
});
},{"riot":6}],21:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag2('app-header', '<div class="img" onclick="{home}"></div> <nav> <a class="Action" onclick="{addrecipe}"><span>Partager un voyage culinaire</span></a> <a class="Button register" if="{logged == false}" onclick="{register}"><span>Inscription</span></a> <a class="Button login" if="{logged == false}" onclick="{login}"><span>Connexion</span></a> <a if="{logged == true}" onclick="{account}"> <div class="img" riot-style="background-image: url(\'{user.picture}\');"></div> </a> </nav>', '', '', function(opts) {
        var tag = this;
        tag.logged = false;
        tag.user = null;

        tag.on("before-mount", function()
        {
            tag.auth();
        });

        tag.auth = function()
        {
            if(Login.GetInstance().isLogged() == true)
            {
                tag.logged = true;
                tag.user = Login.GetInstance().User();
            }
            else tag.logged = false;
        };

        tag.home = function()
        {
            route("/");
        }

        tag.register = function()
        {
            route("/register");
        };

        tag.login = function()
        {
            var callback = function()
            {
                App.hidePopUp();
                route("index");
            };
            App.showPopUp("app-login", "Connexion", {
                "callback" : callback
            });
        };

        tag.account = function()
        {
            route("/account");
        }

        tag.addrecipe = function()
        {
            if(tag.logged == true)
            {
                route("/recipe/add");
            }
            else
                route("/user/add");
        }

});
},{"riot":6}],22:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag2('app-hearts', '<div class="full" each="{rpt in repeat}"> </div> <div class="empty" each="{rpt in empties}"> </div>', '', '', function(opts) {
        var tag = this;
        tag.empties = null;
        tag.repeat = null;
        tag.on("before-mount", function()
        {
            if(tag.opts.repeat > 0)
                tag.repeat = new Array(tag.opts.repeat);
            console.log(tag.opts.repeat);
            console.log(5-tag.opts.repeat);

            tag.empties = new Array(5-tag.opts.repeat);
        });

});
},{"riot":6}],23:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag2('app-manyinputs', '<div> <input type="text" each="{val,i in value.split(delimiter)}" riot-value="{val}" onkeydown="{observe}" onchange="{updateValue}"> <input type="button" value="Ajouter une ligne" onclick="{add}"> </div>', '', '', function(opts) {
        var tag = this;

        tag.delimiter = ";";
        tag.length = 1;
        tag.value = "";

        tag.on("before-mount", function()
        {
            if(tag.opts.delimiter != null)
                tag.delimiter = tag.opts.delimiter;
            if(tag.opts.value != null)
                tag.value = tag.opts.value;
        });

        tag.observe = function(e)
        {
            if(e.key == tag.delimiter)
                e.preventDefault();
        };

        tag.updateValue = function()
        {
            tag.value = "";
            var inputs = tag.root.querySelectorAll("input[type=text]");
            inputs.forEach(function(input)
            {
                tag.value = tag.value+input.value+tag.delimiter;
            });
            tag.value = tag.value.slice(0, -1);
        }

        tag.add = function()
        {
            tag.value = tag.value+tag.delimiter;
            tag.length = tag.value.split(tag.delimiter).length;
            tag.update();
        };

});
},{"riot":6}],24:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag2('app-origininput', '<input type="text" ref="origin" name="origin" id="origin" placeholder="Type de cuisine" riot-value="{opts.origin}">', '', '', function(opts) {
        var tag = this;
        tag.value = "";

        tag.on("before-mount", function()
        {
           if(tag.opts.origin != null)
               tag.value = tag.opts.origin;
        });

         tag.on("mount", function()
        {
            tag.retrieve();
        });

        tag.setValue = function(value)
        {
            tag.refs.origin.value = value;
            tag.value = value;
        }

        tag.retrieve = function()
        {

            var retrieveOrigins = App.request(App.Address + "/getorigins", null);
            retrieveOrigins.then(function(response)
            {
                $('#origin').selectize({
                    delimiter: ";",
                    persist: false,
                    maxItems: null,
                    valueField: 'name',
                    labelField: 'name',
                    searchField: ['name'],
                    options: response.data,
                    onChange : function(value)
                    {
                        tag.value = value;
                    },

                });
            });
            retrieveOrigins.catch(function(error)
            {
                        ErrorHandler.alertIfError(error);
            });
        }
});
},{"riot":6}],25:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag2('app-pinsinput', '<input type="text" ref="pins" name="pins" id="pins" placeholder="Mes plus" riot-value="{opts.pins}">', '', '', function(opts) {
        var tag = this;
        tag.value = "";

         tag.on("mount", function()
        {
            tag.retrieve();
        });

        tag.setValue = function(value)
        {
            tag.refs.pins.value = value;
            tag.value = value;
        }

        tag.retrieve = function()
        {

            var retrievepins = App.request(App.Address + "/getpinses", null);
            retrievepins.then(function(response)
            {
                $('#pins').selectize({
                    delimiter: ";",
                    persist: false,
                    maxItems: null,
                    valueField: 'name',
                    labelField: 'name',
                    searchField: ['name'],
                    options: response.data,
                    onChange : function(value)
                    {
                        tag.value = value;
                    },

                });
            });
            retrievepins.catch(function(error)
            {
                ErrorHandler.alertIfError(error);
            });
        }
});
},{"riot":6}],26:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag2('app-placehint', '<div> <div class="img"></div> <div>{opts.place} - <a onclick="{toggleMap}">voir le plan</a></div> </div> <div class="{map : true, invisible: opened == false, open: opened == true, close: opened == false}"> <iframe frameborder="0" riot-src="https://maps.google.com/maps?q={opts.latitude},{opts.longitude}&t=&z=14&ie=UTF8&iwloc=&output=embed"></iframe> </div>', '', '', function(opts) {
        var tag = this;

        tag.place = tag.opts.place;
        tag.latitude = tag.opts.latitude;
        tag.longitude = tag.opts.longitude;

        tag.opened = false;

        tag.toggleMap = function()
        {
            tag.opened = !tag.opened;
            tag.update();
        }
});

},{"riot":6}],27:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag2('app-placeinput', '<input type="text" ref="city" name="city" id="city" placeholder="Lieu de partage" riot-value="{opts.place}">', '', '', function(opts) {
        var tag = this;
        tag.value = "";

        tag.on("before-mount", function()
        {
            if(tag.opts.place != null) {
                tag.value = tag.opts.place;
            }
        });

        tag.on("mount", function()
        {
            tag.retrieveCities();
        });

        tag.retrieveCities = function()
        {
            if(tag.opts.valuefield == null)
                tag.opts.valuefield = "geolocation";
            var retrieve = App.request("/static/JS/cities.json");
            retrieve.then(function(response)
            {
                var control = $('#city', tag.root).selectize({
                    persist: false,
                    maxItems: 1,
                    valueField: [tag.opts.valuefield],
                    labelField: 'name',
                    searchField: ['name'],
                    options: response.cities,
                    onChange : function(value) {
                        tag.value = value;
                    }
                });
            });
            retrieve.catch(function(error)
            {
                        ErrorHandler.alertIfError(error);

            });
        }
});
},{"riot":6}],28:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag2('app-tabbar', '<div> <span each="{tab in tabs}" class="{selected : tab.selected == true}" data-route="{tab.route}" onclick="{redirect}">{tab.name}</span> <span></span> </div>', '', '', function(opts) {
        var tag = this;

        tag.tabs = null;

        tag.on("before-mount", function()
        {
            tag.tabs = tag.opts.tabs;
        });

        tag.setTabs = function(tabs)
        {
            tag.tabs = tabs;
            tag.update();
        }

        tag.redirect = function(e)
        {
            var span = e.target;
            route(span.getAttribute("data-route"));
        }
});
},{"riot":6}],29:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag2('app-timeinput', '<input type="text" ref="time" name="time" id="time" placeholder="Heure">', '', '', function(opts) {
        var tag = this;
        tag.value = null;

        tag.on("mount", () => {
            var picker = $("#time").pickatime({
                format: 'HH:i',
                formatSubmit: 'HH:i',
                hiddenName: true
            });

            if(tag.opts.time != null)
            {
                picker.set("select", tag.opts.time);
            }

            $('#time')
                .pickatime('picker')
                .on('render', function () {
                    var time = $('#time').pickatime('picker').get("value");
                    if(time == null)
                        return;
                    time = time.split(":");
                    time = new Time(0,0,0,time[0], time[1]);
                    tag.value = Math.round(time.getTime() / 1000);
                });
        });
});
},{"riot":6}],30:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag2('app-recipe', '<app-header></app-header> <div> <div class="banner" riot-style="background-image: url(\'{recipe.picture}\');"></div> <div class="content"> <div class="infos"> <div class="base"> <div class="name"> <h1>{recipe.name}</h1> <div> <div class="Pins open" each="{p in recipe.pins}">{p}</div> </div> </div> <div class="description"> <p> {recipe.description} </p> </div> </div> <div class="geolocation"> <app-placehint latitude="{recipe.latitude}" longitude="{recipe.longitude}" place="{recipe.place}"></app-placehint> </div> <div class="details"> <h2>Ingédients :</h2> <ul> <li each="{item in recipe.items}">{item}</li> </ul> </div> <div class="users"> <app-users users="{recipe.users}"></app-users> </div> </div> <div class="user"> <div class="join"> <h2>Rejoindre la cuisine</h2> <div class="price"> {recipe.price}€ </div> <div> Il reste {recipe.place_left} places </div> <form name="edit-reservation"> <div> <input type="checkbox" name="cgu" ref="cgu"> J\'accepte les CGU </div> <div> <input type="checkbox" name="pc" ref="pc"> J\'accepte la charte de bonne conduite </div> <input type="button" class="large" value="Je rejoins la cuisine" onclick="{join}"> </form> </div> <app-useritem ref="useritem" user="{recipe.user}"></app-useritem> </div> </div> </div> <app-footer></app-footer>', '', '', function(opts) {
        var tag = this;

        tag.recipe = null;

        tag.on("before-mount", () => {
            tag.recipe = tag.opts.recipe;
            if (tag.recipe == null)
                throw new Error("Recipe cant be null.");
        });

        tag.join = function () {
            if(tag.refs.cgu.checked == false)
            {
                vex.dialog.alert("Vous devez accepter les CGU pour etre en mesure de réserver avec Melting Cook.");
                return;
            }
            if(tag.refs.pc.checked == false)
            {
                vex.dialog.alert("Vous devez accepter la charte de bonne conduite pour etre en mesure de réserver avec Melting Cook.");
                return;
            }
            route("/reservation/recipe/"+tag.recipe.id);
        }
});
},{"riot":6}],31:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag2('app-recipeedit', '<app-header></app-header> <div class="content"> <app-recipeeditform ref="form" recipe="{recipe}"></app-recipeeditform> </div> <app-footer></app-footer>', '', '', function(opts) {
        var tag = this;

        tag.recipe = {};

        tag.on("before-mount", function()
        {
            if(tag.opts.recipe != null) {
                tag.recipe = tag.opts.recipe;
            }
        });
});
},{"riot":6}],32:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag2('app-recipeeditform', '<form name="edit-recipe" if="{recipe != null}"> <section> <h1>Informations de base</h1> <div> <label>Nom de la recette *</label> <input type="text" riot-value="{recipe.name}" placeholder="Nom de la recette" ref="name" name="fullname"> <p class="hint"> Ce champ est requis et ne peut contenir plus de 400 caractères. </p> </div> <div> <label>Description *</label> <textarea name="description" ref="description" placeholder="Décrivez votre recette en quelques mots">{recipe.description}</textarea> <p class="hint"> Ce champ est requis. Il ne peut contenir moins de 50 ou plus de 1000 caractères. </p> </div> <div> <label>Associer une image *</label> <input type="text" ref="picture" name="picture" placeholder="Précisez un lien URL vers l\'image de votre choix" riot-value="{recipe.picture}"> <p class="hint"> Ce champ est requis. Il doit contenir une url valide comportant moins de 400 caractères. </p> </div> </section> <section> <h1>Ingrédients et origine</h1> <div> <label>Type de cuisine *</label> <app-origininput ref="origin" name="origin" origin="{recipe.origin}"></app-origininput> <p class="hint"> Ce champ est requis et ne peut contenir plus de 400 caractères. </p> </div> <div> <label>Les "plus"</label> <app-pinsinput ref="pins" name="pins" pins="{recipe.pins}"></app-pinsinput> <p class="hint"> Ce champ ne peut contenir plus de 1000 caractères. </p> </div> <div> <label>Ingrédients principaux *</label> <app-manyinputs ref="items" name="items" riot-value="{recipe.items}"></app-manyinputs> <p class="hint"> Ce champ est requis et ne peut contenir plus de 1000 caractères. </p> </div> </section> <section> <h1>Organisation</h1> <div> <label>Prix de la participation *</label> <input ref="price" name="price" riot-value="{recipe.price}" placeholder="Prix de la participation" type="{\'number\'}"> <p class="hint"> Ce champ est requis et doit contenir un nombre supérieur ou égal à 0. </p> </div> <div> <label>Nombre de places disponibles *</label> <input ref="places" name="places" riot-value="{recipe.places}" placeholder="Nombre de places disponibles" type="{\'number\'}"> <p class="hint"> Ce champ est requis et doit contenir un nombre supérieur ou égal à 1. </p> </div> <div> <label>Nom de la ville/village *</label> <app-placeinput ref="place" name="place" place="{recipe.place}" valuefield="name"></app-placeinput> <p class="hint"> Ce champ est requis et ne peut contenir plus de 400 caractères. </p> </div> <div> <label>Date de début de l\'offre *</label> <app-dateinput ref="date_start" name="date_start" date="{recipe.date_start_readable}"></app-dateinput> <p class="hint"> Ce champ est requis. </p> </div> <div> <label>Date de fin de l\'offre *</label> <app-dateinput ref="date_end" name="date_end" date="{recipe.date_end_readable}"></app-dateinput> <p class="hint"> Ce champ est requis. </p> </div> </section> <p> Les champs marqués d\'une * sont requis. </p> <input type="button" class="large" value="Publier ma recette" onclick="{validate}"> </form>', '', '', function(opts) {
        var tag = this;

        tag.recipe = null;

        tag.on("before-mount", function()
        {
            tag.recipe = tag.opts.recipe;
            if(tag.recipe === null)
                throw new Error("Recipe cant be null.");
        });

        tag.setRecipe = function(recipe)
        {
            tag.recipe = recipe;
            tag.update();
        };

        tag.validate = function()
        {
            var valid = new Validatinator({
                "edit-recipe": {
                    "fullname" : "required|maxLength:400",
                    "description" : "required|minLength:50|maxLength:1000",
                    "picture" : "required|maxLength:400|url",
                    "price" : "required|number|min:0",
                    "places" : "required|number|min:1"
                }
            });
            if (valid.passes("edit-recipe")) {

                var errors = {
                    "edit-recipe" : {}
                };
                if(tag.refs.origin.value === "" || tag.refs.origin.value.length > 400)
                {
                    errors["edit-recipe"].origin = {
                        "required" : "true"
                    };
                }
                if(tag.refs.items.value === "" || tag.refs.items.value.length > 1000)
                {
                    errors["edit-recipe"].items = {
                        "required" : "true"
                    };
                }
                if(tag.refs.date_start.value === null)
                {
                    errors["edit-recipe"].date_start = {
                        "required" : "true"
                    };
                }
                if(tag.refs.date_end.value === null)
                {
                    errors["edit-recipe"].date_end = {
                        "required" : "true"
                    };
                }
                if(tag.refs.pins.value.length > 1000)
                {
                    errors["edit-recipe"].pins = {
                        "required" : "true"
                    };
                }
                if(tag.refs.place.value === "" || tag.refs.place.value.length > 400)
                {
                    errors["edit-recipe"].place = {
                        "required" : "true"
                    }
                }
                if(Object.keys(errors["edit-recipe"]).length > 0)
                {
                    App.diagnosticForm("edit-recipe", errors);
                    return;
                }
                tag.send();
            }
            if(valid.fails("edit-recipe")) {
                App.diagnosticForm("edit-recipe", valid.errors);
            }
        };

        tag.send = function()
        {
            var address  = App.Address + "/updaterecipe";
            var rcp = tag.recipe;
            if(rcp == null || rcp.id == null)
            {
                rcp = {};
                address = App.Address + "/addrecipe";
            }
            rcp.name = tag.refs.name.value;
            rcp.description = tag.refs.description.value;
            rcp.picture = tag.refs.picture.value;
            rcp.origin = tag.refs.origin.value;
            rcp.items = tag.refs.items.value;
            rcp.date_start = tag.refs.date_start.value;
            rcp.date_end = tag.refs.date_end.value;
            rcp.price = tag.refs.price.value;
            rcp.places = tag.refs.places.value;
            rcp.pins = tag.refs.pins.value;
            rcp.place = tag.refs.place.value;

            var request = App.request(address, rcp);
            request.then((response) => {
                route("/recipe/"+response.data);
            });
            request.catch((error) => {
                ErrorHandler.alertIfError(error);
            });
        }
});
},{"riot":6}],33:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag2('app-recipeitem', '<div class="user"> <div class="img" riot-style="background-image: url(\'{recipe.user.picture}\');"></div> <div> <span>{recipe.user.username} - {recipe.user.age} ans</span> <div class="Hearts nb-{recipe.user.likes}"></div> <a onclick="{user}">Voir le profil</a> </div> </div> <div class="picture" if="{reduced == true}"> <div class="img" riot-style="background-image: url(\'{recipe.picture}\');"></div> </div> <div class="recipe" riot-style="background-image: url(\'{recipe.picture}\');"> <div> <div> <span>{recipe.date_start_readable} - {recipe.date_end_readable}</span> </div> <div> <span>{recipe.name} - {recipe.origin[0]}</span> </div> <div> <div class="Pins" each="{p in recipe.pins}">{p}</div> </div> </div> <div class="price"> {recipe.price}€ </div> </div>', '', 'onclick="{details}"', function(opts) {
        var tag = this;

        tag.recipe = null;

        tag.on("before-mount", function(){
            if(tag.opts.recipe !== null)
                tag.recipe = Adapter.adaptRecipe(tag.opts.recipe);
            else
                throw new Error("Recipe cant be null");
        });

        tag.details = function()
        {
            if(tag.recipe !== null)
                route("/recipe/"+tag.recipe.id);
        };

        tag.user = function()
        {
            if(tag.recipe !== null && tag.recipe.user !== null)
                route("/user/"+tag.recipe.user.id);
        };

});

},{"riot":6}],34:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag2('app-recipelist', '<app-header></app-header> <app-recipes recipes="{recipes}"></app-recipes> <app-footer></app-footer>', '', '', function(opts) {
        var tag = this;

        tag.recipes = null;

        tag.on("before-mount", function () {
            tag.recipes = tag.opts.recipes;

            if (tag.recipes == null)
                tag.retrieveRecipes();
        });

        tag.retrieveRecipes = function () {
            var request = App.request(App.Address + "/getrecipes", null);
            request.then((response) => {
                tag.recipes = response.data;
                tag.update();
            });
            request.catch((error) => {
                        ErrorHandler.alertIfError(error);

            });
        };
});
},{"riot":6}],35:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag2('app-recipes', '<app-recipeitem each="{recipe in recipes}" recipe="{recipe}"></app-recipeitem>', '', '', function(opts) {
        var tag = this;

        tag.recipes = null;

        tag.on("before-mount", () => {
            tag.recipes = tag.opts.recipes;
            if(tag.recipes === null)
                throw new Error("Recipes cant be null.");
        });

        tag.setRecipes = function(recipes)
        {
            tag.recipes = recipes;
            tag.update();
        }
});
},{"riot":6}],36:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag2('app-reporteditform', '<form name="edit-report"> <div> <label>Motif du signalement</label> <textarea name="content" ref="content" riot-value="{report.content}"></textarea> <p> Ce champ doit contenir entre 10 et 1000 caractères. </p> </div> <div class="{invisible : admin == false || report == null}"> <label>Etat d\'avancement</label> <select name="state" ref="state"> <option value="1" selected="{report.state == 1 || report.state == ⁗1⁗}">Nouveau</option> <option value="2" selected="{report.state == 2 || report.state == ⁗2⁗}">En cours</option> <option value="3" selected="{report.state == 3 || report.state == ⁗3⁗}">Résolu</option> </select> </div> <div> <input type="button" class="large" value="Envoyer" onclick="{send}"> </div> </form>', '', '', function(opts) {
        var tag = this;

        tag.report = null;
        tag.target = null;
        tag.callback = null;
        tag.admin = false;

        tag.on("before-mount", function()
        {
            tag.admin = Login.GetInstance().User().rights >= 2;

            if(tag.opts.report != null)
                tag.report = tag.opts.report;
            if(tag.opts.callback != null)
                tag.callback = tag.opts.callback;
            if(tag.opts.target != null)
                tag.target = tag.opts.target;

            if(tag.callback == null)
                throw new Error("Callback must be set.");

            if(tag.report == null && tag.target == null)
                throw new Error("Target must be set.");
        });

        tag.send = function()
        {
            if(tag.refs.content.value.length < 10 || tag.refs.content.value.length > 1000)
            {
                vex.dialog.alert("Le motif du signalement doit comporter entre 10 et 1000 caractères.");
                return;
            }
            var adr = App.Address + "/updatereport";
            var rpt = tag.report;
            if(tag.report == null)
            {
                adr = App.Address + "/addreport";
                rpt = {};
                rpt.target_id = tag.target;
                rpt.author_id = Login.GetInstance().User().id;
            }
            rpt.content = tag.refs.content.value;
            rpt.state = tag.refs.state.options[tag.refs.state.selectedIndex].value;
            var request = App.request(adr, rpt);
            request.then((response) => {
                tag.callback();
            });
            request.catch((error) => {
                        ErrorHandler.alertIfError(error);

            });

        }
});
},{"riot":6}],37:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag2('app-reportitem', '<div class="identity"> <span>Par: <a onclick="{author}">{report.author.username}</a></span> <span>Concerne: <a onclick="{target}">{report.target.username}</a></span> </div> <div class="body"> <div> <span>Etat: {report.message_state}</span> </div> <p> {report.content} </p> </div> <div class="foot"> <input type="button" class="large" value="Mettre à jour" onclick="{edit}"> </div>', '', '', function(opts) {
        var tag = this;

        tag.report = null;

        tag.on("before-mount", function()
        {
            tag.report = Adapter.adaptReport(tag.opts.report);

            if(tag.report == null)
                throw new Error("Report cant be null");
        });

        tag.author = function()
        {
            if(tag.report.author != null && tag.report.author.id != null)
                route("/user/"+tag.report.author.id);
        }

        tag.target = function()
        {
            if(tag.report.target != null && tag.report.target.id != null)
                route("/user/"+tag.report.target.id);
        }

        tag.edit = function()
        {
            var callback = function()
            {
                App.hidePopUp();
                vex.dialog.alert("Le signalement a bien été mis à jour.");
            }
            App.showPopUp("app-reporteditform", "Mise à jour d'un signalement", { "callback" : callback, "report" : tag.report});
        }
});
},{"riot":6}],38:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag2('app-reports', '<div> <nav> <a onclick="{showNews}">Nouveaux</a> <a onclick="{showCurrents}">En cours</a> <a onclick="{showEnds}">Terminés</a> </nav> <div> <label>Chercher par cible</label> <input ref="target" type="number"><input type="button" value="Afficher" onclick="{showForTarget}"> </div> <div> <label>Chercher par auteur</label> <input ref="author" type="number"><input type="button" value="Afficher" onclick="{showForAuthor}"> </div> <div> <input type="button" value="Tout Afficher" onclick="{showAll}"> </div> </div> <app-reportitem each="{report in list}" report="{report}"></app-reportitem>', '', '', function(opts) {
        var tag = this;

        tag.reports = null;

        tag.list = null;

        tag.news = null;
        tag.currents = null;
        tag.ends = null;

        tag.on("before-mount", function () {
            tag.reports = tag.opts.reports;

            if (tag.reports == null)
                tag.retrieveReports();
            else
                tag.sortReports();
        });

        tag.retrieveReports = function (filters = null) {
            var data = {};
            if(filters != null)
                data.filters = JSON.stringify(filters);

            var request = App.request(App.Address + "/getreports", data);
            request.then((response) => {
                tag.reports = response.data;
                tag.sortReports();
            });
            request.catch((error) => {
                        ErrorHandler.alertIfError(error);

            });
        }

        tag.sortReports = function () {
            if (tag.reports == null)
                return;
            tag.news = new Array();
            tag.currents = new Array();
            tag.ends = new Array();
            tag.reports.forEach((report) => {
                switch (report.state) {
                    case "1":
                    case 1:
                    default:
                        tag.news.push(report);
                        break;
                    case "2":
                    case 2:
                        tag.currents.push(report);
                        break;
                    case "3":
                    case 3:
                        tag.ends.push(report);
                        break;
                }
            });
            tag.list = tag.news;
            tag.update();
        }

        tag.showNews = function()
        {
            tag.list = tag.news;
            tag.update();
        };

        tag.showCurrents = function()
        {
            tag.list = tag.currents;
            tag.update();
        };

        tag.showEnds = function()
        {
            tag.list = tag.ends;
            tag.update();
        };

        tag.showForTarget = function()
        {
            var value = null;
            try
            {
                value = parseInt(tag.refs.target.value);
            }
            catch(e)
            {
                vex.dialog.alert("Vous devez entrer l'identifiant numérique d'un utilisateur.");
                return;
            }
            tag.retrieveReports({
                target_id : value
            });
        }

        tag.showForAuthor = function()
        {
            var value = null;
            try
            {
                value = parseInt(tag.refs.author.value);
            }
            catch(e)
            {
                vex.dialog.alert("Vous devez entrer l'identifiant numérique d'un utilisateur.");
                return;
            }
            tag.retrieveReports({
                author_id : value
            });
        }

        tag.showAll = function()
        {
            tag.retrieveReports();
        }
});
},{"riot":6}],39:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag2('app-reservation', '<app-header></app-header> <div class="content"> <section> <h1>Récapitulatif de cuisine</h1> <div> <div> <label>Qui cuisine ?</label> <app-useritem user="{recipe.user}"></app-useritem> </div> <div> <label>Qui participe ?</label> <table> <tr each="{guest in recipe.guests}"> <td>{guest.username}</td> <td><a onclick="{userDetails}" data-id="{guest.id}">Voir le profil</a></td> </tr> </table> <div class="guests" if="{recipe.guests.length <= 0}"> Vous etes le seul participant pour le moment. </div> </div> <div class="recipe"> <label>Apprentissage de:</label> <app-recipeitem recipe="{recipe}"></app-recipeitem> </div> </div> </section> <section> <h1>Faisons les comptes</h1> <div> <table> <tr> <td> 1x Assiette </td> <td> {recipe.price}€ </td> </tr> <tr> <td> Frais de réservation </td> <td> 2€ </td> </tr> <tr> <td> TOTAL </td> <td> {recipe.price+2}€ </td> </tr> </table> </div> </section> <section> <h1>Paiement en ligne par Paypal</h1> <div class="checkout"> <p>Vous allez pouvoir accéder à Paypal pour finaliser votre paiement.</p> <input type="button" riot-value="Payer {recipe.price+2}€" onclick="{paypal}"> <p>En validant le paiement, vous accepter les CGU et la charte de bonne conduite de Melting Cook.</p> </div> </section> </div> <app-footer></app-footer>', '', '', function(opts) {
        var tag = this;

        tag.recipe = null;

        tag.on("before-mount", function()
        {
            tag.recipe = Adapter.adaptRecipe(tag.opts.recipe);
            if(tag.recipe == null)
                throw new Error("Recipe cant be null.");
        });

        tag.paypal = function()
        {
            vex.dialog.alert("Not Implemented");
        };

        tag.userDetails = function(e)
        {
            var id = e.target.getAttribute("data-id");
            route("/user/"+id);
        }
});
},{"riot":6}],40:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag2('app-reservationitem', '<span>Vous pouvez joindre l\'hôte au {reservation.host.phone}</span> <app-recipeitem recipe="{reservation.recipe}"></app-recipeitem>', '', '', function(opts) {
        var tag = this;

        tag.reservation = null;

        tag.on("before-mount", function()
        {
            tag.reservation = tag.opts.reservation;
        });

        tag.setReservation = function(reservation)
        {
            tag.reservation = reservation;
            tag.update();
        }
});
},{"riot":6}],41:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag2('app-reservations', '<div if="{admin}"> <div> <label>Chercher par hôte</label> <input ref="host" type="number"><input type="button" value="Afficher" onclick="{showForHost}"> </div> <div> <label>Chercher par invité</label> <input ref="guest" type="number"><input type="button" value="Afficher" onclick="{showForGuest}"> </div> <div> <input type="button" value="Tout Afficher" onclick="{showAll}"> </div> </div> <app-reservationitem each="{reservation in reservations}" reservation="{reservation}"></app-reservationitem>', '', '', function(opts) {
        var tag = this;

        tag.admin = false;
        tag.reservations = null;

        tag.on("before-mount", function()
        {
            tag.reservations = tag.opts.reservations;
            if(tag.opts.admin != null)
                tag.admin = tag.opts.admin;
            if(tag.reservations == null)
                tag.retrieveReservations();
        });

        tag.retrieveReservations = function(filters = null)
        {
            var data = {};
            if(filters != null)
                data.filters = JSON.stringify(filters);
            var request = App.request(App.Address + "/getreservations", data);
            request.then((response) => {
                    tag.setReservations(response.data);
            });
            request.catch((error) => {
                ErrorHandler.alertIfError(error);
            });
        }

        tag.showForHost = function()
        {
            var value = null;
            try
            {
                value = parseInt(tag.refs.host.value);
            }
            catch(e)
            {
                vex.dialog.alert("Vous devez entrer l'identifiant numérique d'un utilisateur.");
                return;
            }
            tag.retrieveReservations({
                host_id : value
            });
        }

        tag.showForGuest = function()
        {
            var value = null;
            try
            {
                value = parseInt(tag.refs.host.value);
            }
            catch(e)
            {
                vex.dialog.alert("Vous devez entrer l'identifiant numérique d'un utilisateur.");
                return;
            }
            tag.retrieveReservations({
                guest_id : value
            });
        }

        tag.setReservations = function(reservations)
        {
            tag.reservations = reservations;
            tag.update();
        }
});
},{"riot":6}],42:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag2('app-search', '<app-header></app-header> <app-searchitem></app-searchitem> <app-footer></app-footer>', '', '', function(opts) {
        var tag = this;
});
},{"riot":6}],43:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag2('app-searchitem', '<div> <div class="img"></div> <div> <h2>A vos assiettes !</h2> <span>Cuisinez en bonne compagnie</span> </div> </div> <form name="edit-search"> <app-placeinput ref="place"></app-placeinput> <app-dateinput ref="date"></app-dateinput> <app-origininput ref="origin"></app-origininput> <input ref="price_start" name="price_start" placeholder="Entre" type="number"> - <input name="price_end" ref="price_end" placeholder="Et" type="number"> <input type="button" value="A vos ustensiles !" onclick="{send}"> </form>', '', '', function(opts) {
        var tag = this;

        tag.send = function()
        {
            var valid = new Validatinator({
                "edit-search": {
                    "price_start" : "number",
                    "price_end" : "number"
                }
            });
            if(valid.passes("edit-search"))
            {
                var price_start = null;
                var price_end = null;
                if(tag.refs.price_start.value != "") {
                    price_start = parseInt(tag.refs.price_start.value);
                    if(price_start < 0) {
                        vex.dialog.alert("Un prix ne peut etre inférieur à 0.");
                        return;
                    }
                }
                if(tag.refs.price_end.value != "") {
                    price_end = parseInt(tag.refs.price_end.value);
                    if(price_end < 0) {
                        vex.dialog.alert("Un prix ne peut etre inférieur à 0.");
                        return;
                    }
                }
                if(price_start != null && price_end != null)
                {
                    if(price_start > price_end)
                    {
                        vex.dialog.alert("L'intervalle de prix est incohérent.");
                        return;
                    }
                }
                var date = null;
                if(tag.refs.date.value != null)
                    date = tag.refs.date.value;
                var retrieve = Search.search(tag.refs.place.value, tag.refs.origin.value, date, price_start, price_end);
                retrieve.then(function(data)
                {
                    App.changePage("app-searchresults", data);
                });
                retrieve.catch(function(error)
                {
                        ErrorHandler.alertIfError(error);

                });
            }
            else
                vex.dialog.alert("L'interval de prix doit être borné par des nombres.");

        }
});
},{"riot":6}],44:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag2('app-searchresults', '<app-header></app-header> <div class="content"> <app-searcher expanded="{true}" params="{opts.params}"></app-searcher> <section> <h1>Résultats de la recherche</h1> <app-recipes recipes="{opts.recipes}"></app-recipes> </section> </div> <app-footer></app-footer>', '', '', function(opts) {
        var tag = this;

});
},{"riot":6}],45:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag2('app-searcher', '<div> <div class="img"></div> <div> <h3>A vos cuisines... Partez !</h3> <p> La découverte dans vos assiettes. </p> </div> </div> <form> <app-placeinput ref="place" place="{place}"></app-placeinput> <app-origininput ref="origin" origin="{origin}"></app-origininput> <app-dateinput ref="date" date="{date}"></app-dateinput> <div if="{expanded}"> <input ref="price_start" name="price_start" placeholder="Prix entre" riot-value="{price_start}" type="{\'number\'}"> - <input riot-value="{price_end}" name="price_end" ref="price_end" placeholder="Et" type="{\'number\'}"> </div> <input type="button" value="Chercher un moment sympa !" onclick="{send}"> </form>', '', '', function(opts) {
        var tag = this;

        tag.expanded = false;
        tag.place = null;
        tag.origin = null;
        tag.date = null;
        tag.price_start = null;
        tag.price_end = null;

        tag.on("before-mount", function()
        {
            if(tag.opts.expanded != null)
                tag.expanded = tag.opts.expanded;
            if(tag.opts.params != null)
            {
                if(tag.opts.params.length >= 1)
                    tag.place = tag.opts.params[0];
                if(tag.opts.params.length >= 2)
                    tag.origin = tag.opts.params[1];
                if(tag.opts.params.length >= 3)
                    tag.date = tag.opts.params[2];
                if(tag.opts.params.length >= 4)
                    tag.price_start = tag.opts.params[3];
                if(tag.opts.params.length >= 5)
                    tag.price_end = tag.opts.params[4];
            }
        });

        tag.send = function()
        {
            var retrieve = null;
            var params = [tag.refs.place.value, tag.refs.origin.value, tag.refs.date.value];

            if(tag.expanded) {
                var price_start = null;
                var price_end = null;
                if (tag.refs.price_start.value != "") {
                    price_start = parseInt(tag.refs.price_start.value);
                    if (price_start < 0) {
                        vex.dialog.alert("Un prix ne peut etre inférieur à 0.");
                        return;
                    }
                }
                if (tag.refs.price_end.value != "") {
                    price_end = parseInt(tag.refs.price_end.value);
                    if (price_end < 0) {
                        vex.dialog.alert("Un prix ne peut etre inférieur à 0.");
                        return;
                    }
                }
                if (price_start != null && price_end != null) {
                    if (price_start > price_end) {
                        vex.dialog.alert("L'intervalle de prix est incohérent.");
                        return;
                    }
                }
                params.push(price_start);
                params.push(price_end);

                retrieve = Search.search(tag.refs.place.value, tag.refs.origin.value, tag.refs.date.value, price_start, price_end);
            }
            else
                retrieve = Search.search(tag.refs.place.value, tag.refs.origin.value, tag.refs.date.value);

            retrieve.then(function(data) {
                var res = "null";
                if(data.length > 0)
                    res = data.join(",");
                route("/search/results/"+res+"/params/"+params.join(","));
            });
            retrieve.catch(function(error)
            {
                ErrorHandler.alertIfError(error);
            });
        };
});
},{"riot":6}],46:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag2('app-user', '<app-header></app-header> <div> <div class="banner" riot-style="background-image: url(\'{user.banner}\');"> </div> <div class="content"> <div class="head"> <img riot-src="{user.picture}"> <div class="identity"> <span>{user.username}</span> <span>{user.age} ans</span> </div> <a class="verified"> <span>Cuisinnier vérifié</span> </a> </div> <nav> <input type="button" onclick="{showRecipes}" value="Voir les recettes"> <input if="{owner==true}" type="button" onclick="{manage}" value="Gérer mon profil"> <input if="{owner==false}" class="peach" type="button" onclick="{report}" value="Signaler"> </nav> <div class="description"> <h1>Présentation du chef</h1> <p> {user.description} </p> </div> <div class="more"> <div class="{discease : true, invisible : user.discease.length <= 0}"> <h1>Ses allergies</h1> <ul> <li each="{d in user.discease}">{d}</li> </ul> </div> <div class="{preference : true, invisible : user.preference.length <= 0}"> <h1>Ses inspirations</h1> <ul> <li each="{p in user.preference}">{p}</li> </ul> </div> <div> <h1>Ses "plus"</h1> <div class="Pins open" each="{p in user.pins}"><span>{p}</span></div> </div> </div> <div class="comments"> <h1>Ses avis</h1> <app-hearts repeat="{user.likes}"></app-hearts> <app-comments comments="{user.comments}"></app-comments> </div> </div> </div> <app-footer></app-footer>', '', '', function(opts) {
        var tag = this;

        tag.user = null;
        tag.recipes = null;
        tag.comments = null;
        tag.owner = false;

        tag.on("before-mount", function () {
            tag.user = Adapter.adaptUser(tag.opts.user);
            if (tag.user == null)
                throw new Error("User cant be null.");
            tag.recipes = tag.opts.recipes;
            if (tag.recipes == null)
                throw new Error("Recipes cant be null.");
            tag.comments = tag.opts.comments;
            if (tag.comments == null)
                throw new Error("Comments cant be null.");

            if (tag.user.id == Login.GetInstance().User().id)
                tag.owner = true;
        });

        tag.manage = function () {
            route("/account");
        };

        tag.showRecipes = function()
        {
            var lst = new Array();
            tag.recipes.forEach(function(recipe)
            {
                lst.push(recipe.id);
            });
            route("/search/results/"+lst.join(","));
        }

        tag.report = function () {
            if (tag.user == null || tag.user.id == null)
                return;
            var callback = function () {
                App.hidePopUp();
                vex.dialog.alert("L'utilisateur a bien été signalé. Merci de votre vigilance.");
            };
            var report = App.showPopUp("app-reporteditform", "Signaler un utilisateur", {
                "callback": callback,
                "target": tag.user.id
            });
        }
});
},{"riot":6}],47:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag2('app-useredit', '<app-header></app-header> <div class="content"> <app-usereditform ref="form" user="{{}}" callback="{send}"></app-usereditform> </div> <app-footer></app-footer>', '', '', function(opts) {
        var tag = this;

        tag.send = function()
        {
            if(tag.user.id === null)
            {
                vex.dialog.alert("Félicitation ! Vous êtes désormais un membre de Melting Cook. Vous pouvez vous connecter.");
            }
            else
            {
                vex.dialog.alert("Vos informations ont bien été mises à jour !");
            }
            route("/");
        }
});
},{"riot":6}],48:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag2('app-usereditform', '<form name="edit-user" if="{user != null}"> <div> <h1>Présentation du compte</h1> <div class="banner"> <div class="img" ref="banner_preview" riot-style="background-image: url(\'{user.banner}\');"></div> <div> <label>Télécharger une bannière:</label> <input type="text" name="banner" ref="banner" riot-value="{user.banner}" onchange="{updateBanner}"> <p class="hint"> Ce champ doit contenir une adresse URL valide. </p> <p> Les dimensions recommandées pour un résultat optimal sont 1500 x 500 pixels </p> </div> </div> <div class="picture"> <div class="img" ref="picture_preview" riot-style="background-image: url(\'{user.picture}\');"></div> <div> <label>Télécharger une photo de profil:</label> <input type="text" name="picture" ref="picture" riot-value="{user.picture}" onchange="{updatePicture}"> <p class="hint"> Ce champ doit contenir une adresse URL valide. </p> <p> Les dimensions recommandées pour un résultat optimal sont 400 x 400 pixels </p> </div> </div> </div> <div> <h1>Informations de base</h1> <div class="base"> <div class="{invisible: user.id != null}"> <label>Nom d\'utilisateur: </label> <input type="text" name="username" ref="username" riot-value="{user.username}"> <p class="hint">Ce champ doit contenir entre 5 et 400 caractères.</p> <p> Vous ne pourrez plus changer de nom d\'utilisateur après l\'inscription. Choisissez avec sagesse.</p> </div> <div class="{invisible: user.id != null}"> <label>Mot de passe: </label> <input type="password" name="password" ref="password"> <p class="hint"> Ce champ doit contenir entre 8 et 100 caractères.<br> Le mot de passe et sa confirmation doivent correspondre. </p> </div> <div class="{invisible: user.id != null}"> <label>Confirmation mot de passe: </label> <input type="password" name="password_confirm" ref="password_confirm"> <p class="hint"> Ce champ doit contenir entre 8 et 100 caractères.<br> Le mot de passe et sa confirmation doivent correspondre. </p> </div> <div> <label>Age: </label> <input type="text" name="age" ref="age" riot-value="{user.age}"> <p class="hint"> Ce champ doit contenir une valeur numérique comprise entre 0 et 100. </p> </div> <div> <label>Numéro de téléphone:</label> <input type="text" name="phone" ref="phone" riot-value="{user.phone}"> <p class="hint"> Ce champ doit contenir un numéro de téléphone valide. </p> </div> </div> </div> <div> <div class="bills"> <h1>Informations de facturation</h1> <div> <label>Adresse Email associée au compte Paypal:</label> <input type="text" name="mail" ref="mail" riot-value="{user.mail}"> <p class="hint">Ce champ doit contenir une adresse email valide.</p> <p>Pensez à vérifier qu\'il s\'agit bien de l\'adresse email associée à votre compte Paypal. Nous allons l\'utiliser pour vous verser votre dû.</p> </div> <div> <label>Présentation: </label> <textarea name="description" ref="description"> {user.description} </textarea> <p class="hint"> Ce champ doit contenir entre 50 et 1000 caractères. </p> </div> <div> <label>Adresse:</label> <input type="text" name="address" ref="address" riot-value="{user.address}"> <p class="hint"> Ce champ doit contenir votre adresse de facturation. </p> </div> <div> <label>Prénom:</label> <input type="text" name="firstname" ref="firstname" riot-value="{user.firstname}"> <p class="hint"> Ce champ doit contenir le prénom qui sera utilisé sur les factures. </p> </div> <div> <label>Nom:</label> <input type="text" name="lastname" ref="lastname" riot-value="{user.lastname}"> <p class="hint"> Ce champ doit contenir le nom qui sera utilisé sur les factures. </p> </div> </div> </div> <div> <div class="more"> <h1>Détails importants</h1> <div> <label>Mes allergies:</label> <div> <input type="text" name="discease" ref="discease" id="discease" riot-value="{user.discease}"> </div> <p class="hint">Ce champ ne peut contenir plus de 1000 caractères.</p> <p> Veuillez renseigner les informations relatives à vos éventuelles allergies et contre-indications alimentaires. </p> </div> <div> <label>Mes inspirations:</label> <app-origininput ref="preference"></app-origininput> <p class="hint"> Ce champ ne peut contenir plus de 1000 caractères. </p> <p> Indiquez aux autres utilisateurs quelles sont vos sources d\'inspiration alimentaires ! </p> </div> <div> <label>Mes plus:</label> <app-pinsinput ref="pins"></app-pinsinput> <p class="hint"> Ce champ ne peut contenir plus de 1000 caractères. </p> <p> Indiquez aux autres utilisateurs vos petit plus !<br> e.g: Bio, Vegan, Sans-gluten, Halal </p> </div> </div> </div> <div if="{user.id != null}"> <h1>Actions</h1> <div class="{action : true, invisible: (user.id==null)}"> <input type="button" class="large" value="Réinitialiser mon mot de passe" onclick="{changePassword}"> </div> </div> <div> <input type="button" class="large" value="Enregistrer" onclick="{validate}"> </div> </form>', '', '', function(opts) {
        var tag = this;

        tag.user = null;
        tag.callback = null;
        tag.position = null;

        tag.on("before-mount", function()
        {
            tag.user = tag.opts.user;
            tag.callback = tag.opts.callback;
        });

        tag.on("mount", function()
        {
            tag.geolocalize();

            $('#discease').selectize({
                    delimiter: ";",
                    persist: true,
                    maxItems: null,
                    valueField: 'name',
                    labelField: 'name',
                    searchField: ['name'],
                    options: [],
                    create: function (input) {
                        return {
                            name: input
                        };
                    },
            });
        });

        tag.on("updated", function()
        {
            if(tag.user != null && tag.user.id != null)
            {
                tag.refs.preference.setValue(tag.user.preference);
                tag.refs.pins.setValue(tag.user.pins);
            }
        });

        tag.setUser = function (user) {
            tag.user = user;
            tag.update();
        }

        tag.changePassword = function () {
            var callback = function () {
                App.hidePopUp();
                vex.dialog.alert("Votre mot de passe va être modifié. Veuillez allez recevoir un mail de confirmation. Veuillez vous reconnecter.");
                route("/login");
            };

            App.showPopUp("app-userpasswordform", "Modifier votre mot de passe", {
                "callback": callback,
                "user": tag.user
            });
        }

        tag.details = function()
        {
            if(tag.user != null && tag.user.id != null)
                route("/user/"+tag.user.id);
        }

        tag.geolocalize = function()
        {
            var exec = function(position)
            {
                tag.position = position.coords.latitude+","+position.coords.longitude;
            };
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(exec);
            } else {
                vex.dialog.alert("Vous devez activer la géolocalisation pour être en mesure d'utiliser Melting Cook.");
                tag.geolocalize();
            }
        }

        tag.updatePicture = function()
        {
            tag.refs.picture_preview.style.backgroundImage = "url('"+tag.refs.picture.value+"')";
        }

        tag.updateBanner = function()
        {
            tag.refs.banner_preview.style.backgroundImage = "url('"+tag.refs.banner.value+"')";
        }

        tag.validate = function () {
            var valid = new Validatinator({
                "edit-user": {
                    "banner": "maxLength:400|url",
                    "username": "required|minLength:5|maxLength:400",
                    "age": "required|number|maxLength:3",
                    "phone": "required|minLength:10|maxLength:400",
                    "mail": "required|email|maxLength:400",
                    "description": "required|minLength:50|maxLength:1000",
                    "picture": "maxLength:400|url",
                    "discease": "maxLength:1000",
                    "lastname": "required|maxLength:400",
                    "firstname": "required|maxLength:400",
                    "address": "required|maxLength:1000",
                }
            });
            if (valid.passes("edit-user")) {

                var errors = {
                    "edit-user" : {}
                };

                if(tag.user.id == null)
                {
                    if(tag.refs.password.value == "" || tag.refs.password.value.length < 8 || tag.refs.password.value.length > 100)
                    {
                        errors["edit-user"].password = {
                            "required" : "true"
                        };
                    }
                    if(tag.refs.password.value != tag.refs.password_confirm.value)
                    {
                        errors["edit-user"].password = {
                            "required" : "true"
                        };
                    }
                }

                if(/^(0|\+33)[1-9]([-. ]?[0-9]{2}){4}$/.test(tag.refs.phone.value) == false)
                {
                    errors["edit-user"].phone = {
                        "required" : "true"
                    };
                }

                if(tag.position == null || tag.position.indexOf(",") == -1)
                {
                    vex.dialog.alert("L'usage de Melting Cook requiert la connaissance de votre position. Veuillez activer la géolocalisation.");
                    return;
                }

                if(tag.refs.preference.value == null && tag.refs.preference.value > 1000)
                {
                    errors["edit-user"].preference = {
                        "required" : "true"
                    };
                }

                if(tag.refs.pins.value == null && tag.refs.pins.value > 1000)
                {
                    errors["edit-user"].pins = {
                        "required" : "true"
                    };
                }
                if(Object.keys(errors["edit-user"]).length > 0)
                {
                    App.diagnosticForm("edit-user", errors);
                    return;
                }
                tag.send();
            }
            if(valid.fails("edit-user"))
            {
                App.diagnosticForm("edit-user", valid.errors);
            }
        }

        tag.send = function()
        {

            var usr = tag.user;
            if (usr.id == null)
                usr = {};
            if(tag.user.id == null)
            {
                usr.password = md5(tag.refs.password.value);
            }
            usr.geolocation = tag.position;
            usr.banner = tag.refs.banner.value;
            if(usr.id == null)
            {
                usr.username = tag.refs.username.value;
            }
            usr.age = tag.refs.age.value;
            usr.phone = tag.refs.phone.value;
            usr.mail = tag.refs.mail.value;
            usr.description = tag.refs.description.value;
            usr.picture = tag.refs.picture.value;
            usr.preference = tag.refs.preference.value;
            usr.discease = tag.refs.discease.value;
            usr.pins = tag.refs.pins.value;
            usr.lastname = tag.refs.lastname.value;
            usr.firstname = tag.refs.firstname.value;
            usr.address = tag.refs.address.value;

            var url = App.Address + "/adduser";
            if (usr.id != null)
                url = App.Address + "/updateuser";

            var request = App.request(url, usr);
            request.then((response) => {
                tag.callback();
            });
            request.catch((error) => {
                ErrorHandler.alertIfError(error);

            });
        }
});
},{"riot":6}],49:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag2('app-useritem', '<div class="head"> <img riot-src="{user.picture}"> <div> <span>{user.username}</span> <span>{user.age} ans</span> </div> </div> <div class="body"> <app-hearts repeat="{user.likes}"></app-hearts> </div> <div class="{style : true, invisible: user.style == null || user.style == ⁗⁗}"> <span>Son style de cuisine</span> <span>{user.style}</span> </div> <div> <div class="Pins" each="{pin in user.pins}"> {pin} </div> </div> </div> <div class="foot" if="{reduced == false}"> <input type="button" class="large" value="Connaître le chef" onclick="{details}"> </div>', '', '', function(opts) {
        var tag = this;

        tag.user = null;
        tag.reduced = false;

        tag.on("before-mount", function()
        {
            tag.user = Adapter.adaptUser(tag.opts.user);
            console.log(tag.user);
            if(tag.opts.reduced != null)
                tag.reduced = tag.opts.reduced;
        });

        tag.setUser = function(user)
        {
            tag.user = Adapter.adaptUser(user);
            tag.update();
        }

        tag.details = function()
        {
            route("/user/"+tag.user.id);
        }
});
},{"riot":6}],50:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag2('app-userpasswordform', '<form name="edit-userpassword"> <div> <label>Votre nouveau mot de passe:</label> <input type="password" name="password" ref="password"> </div> <div> <label>Confirmation du nouveau mot de passe:</label> <input type="password" name="password_confirm" ref="password_confirm"> </div> <input type="button" value="Envoyer" onclick="{send}"> </form>', '', '', function(opts) {
        var tag = this;

        tag.user = tag.opts.user;
        tag.callback = tag.opts.callback;

        tag.on("before-mount", function()
        {
            if(tag.user == null || tag.callback == null)
            {
                throw new Error("User and callback must be set.");
            }
        });

        tag.send = function()
        {
           var valid = new Validatinator({
                "edit-userpassword": {
                    "password": "required|minLength:8|maxLength:100",
                    "password_confirm" : "required|minLength:8|maxLength:100"
                }
            });
            if (valid.passes("edit-userpassword")) {
                if(tag.refs.password.value != tag.refs.password_confirm.value)
                {
                    vex.dialog.alert("Les mots de passe ne correspondent pas.");
                    return;
                }
                var request = App.request(App.Address + "/updateuser", {
                  "id" : tag.user.id,
                  "password" : md5(tag.refs.password.value),
                }, true);
                tag.callback();
            }
            else
            {
                vex.dialog.alert("Le formulaire n'est pas valide en l'état.");
            }
        }

});
},{"riot":6}],51:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag2('app-users', '<app-useritem each="{user in users}" user="{user}" reduced="{true}"></app-useritem>', '', '', function(opts) {
        var tag = this;
        tag.users = null;

        tag.on("before-mount", function()
        {
            tag.users = tag.opts.users;
        });

        tag.setUsers = function(users)
        {
            tag.users = users;
            tag.update();
        }
});
},{"riot":6}]},{},[7])(7)
});