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
 * @author   Feross Aboukhadijeh <https://feross.org>
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
 * jQuery JavaScript Library v3.2.1
 * https://jquery.com/
 *
 * Includes Sizzle.js
 * https://sizzlejs.com/
 *
 * Copyright JS Foundation and other contributors
 * Released under the MIT license
 * https://jquery.org/license
 *
 * Date: 2017-03-20T18:59Z
 */
( function( global, factory ) {

	"use strict";

	if ( typeof module === "object" && typeof module.exports === "object" ) {

		// For CommonJS and CommonJS-like environments where a proper `window`
		// is present, execute the factory and get jQuery.
		// For environments that do not have a `window` with a `document`
		// (such as Node.js), expose a factory as module.exports.
		// This accentuates the need for the creation of a real `window`.
		// e.g. var jQuery = require("jquery")(window);
		// See ticket #14549 for more info.
		module.exports = global.document ?
			factory( global, true ) :
			function( w ) {
				if ( !w.document ) {
					throw new Error( "jQuery requires a window with a document" );
				}
				return factory( w );
			};
	} else {
		factory( global );
	}

// Pass this if window is not defined yet
} )( typeof window !== "undefined" ? window : this, function( window, noGlobal ) {

// Edge <= 12 - 13+, Firefox <=18 - 45+, IE 10 - 11, Safari 5.1 - 9+, iOS 6 - 9.1
// throw exceptions when non-strict code (e.g., ASP.NET 4.5) accesses strict mode
// arguments.callee.caller (trac-13335). But as of jQuery 3.0 (2016), strict mode should be common
// enough that all such attempts are guarded in a try block.
"use strict";

var arr = [];

var document = window.document;

var getProto = Object.getPrototypeOf;

var slice = arr.slice;

var concat = arr.concat;

var push = arr.push;

var indexOf = arr.indexOf;

var class2type = {};

var toString = class2type.toString;

var hasOwn = class2type.hasOwnProperty;

var fnToString = hasOwn.toString;

var ObjectFunctionString = fnToString.call( Object );

var support = {};



	function DOMEval( code, doc ) {
		doc = doc || document;

		var script = doc.createElement( "script" );

		script.text = code;
		doc.head.appendChild( script ).parentNode.removeChild( script );
	}
/* global Symbol */
// Defining this global in .eslintrc.json would create a danger of using the global
// unguarded in another place, it seems safer to define global only for this module



var
	version = "3.2.1",

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {

		// The jQuery object is actually just the init constructor 'enhanced'
		// Need init if jQuery is called (just allow error to be thrown if not included)
		return new jQuery.fn.init( selector, context );
	},

	// Support: Android <=4.0 only
	// Make sure we trim BOM and NBSP
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([a-z])/g,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	};

jQuery.fn = jQuery.prototype = {

	// The current version of jQuery being used
	jquery: version,

	constructor: jQuery,

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {

		// Return all the elements in a clean array
		if ( num == null ) {
			return slice.call( this );
		}

		// Return just the one element from the set
		return num < 0 ? this[ num + this.length ] : this[ num ];
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	each: function( callback ) {
		return jQuery.each( this, callback );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map( this, function( elem, i ) {
			return callback.call( elem, i, elem );
		} ) );
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[ j ] ] : [] );
	},

	end: function() {
		return this.prevObject || this.constructor();
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: arr.sort,
	splice: arr.splice
};

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[ 0 ] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;

		// Skip the boolean and the target
		target = arguments[ i ] || {};
		i++;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction( target ) ) {
		target = {};
	}

	// Extend jQuery itself if only one argument is passed
	if ( i === length ) {
		target = this;
		i--;
	}

	for ( ; i < length; i++ ) {

		// Only deal with non-null/undefined values
		if ( ( options = arguments[ i ] ) != null ) {

			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject( copy ) ||
					( copyIsArray = Array.isArray( copy ) ) ) ) {

					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && Array.isArray( src ) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject( src ) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend( {

	// Unique for each copy of jQuery on the page
	expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),

	// Assume jQuery is ready without the ready module
	isReady: true,

	error: function( msg ) {
		throw new Error( msg );
	},

	noop: function() {},

	isFunction: function( obj ) {
		return jQuery.type( obj ) === "function";
	},

	isWindow: function( obj ) {
		return obj != null && obj === obj.window;
	},

	isNumeric: function( obj ) {

		// As of jQuery 3.0, isNumeric is limited to
		// strings and numbers (primitives or objects)
		// that can be coerced to finite numbers (gh-2662)
		var type = jQuery.type( obj );
		return ( type === "number" || type === "string" ) &&

			// parseFloat NaNs numeric-cast false positives ("")
			// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
			// subtraction forces infinities to NaN
			!isNaN( obj - parseFloat( obj ) );
	},

	isPlainObject: function( obj ) {
		var proto, Ctor;

		// Detect obvious negatives
		// Use toString instead of jQuery.type to catch host objects
		if ( !obj || toString.call( obj ) !== "[object Object]" ) {
			return false;
		}

		proto = getProto( obj );

		// Objects with no prototype (e.g., `Object.create( null )`) are plain
		if ( !proto ) {
			return true;
		}

		// Objects with prototype are plain iff they were constructed by a global Object function
		Ctor = hasOwn.call( proto, "constructor" ) && proto.constructor;
		return typeof Ctor === "function" && fnToString.call( Ctor ) === ObjectFunctionString;
	},

	isEmptyObject: function( obj ) {

		/* eslint-disable no-unused-vars */
		// See https://github.com/eslint/eslint/issues/6125
		var name;

		for ( name in obj ) {
			return false;
		}
		return true;
	},

	type: function( obj ) {
		if ( obj == null ) {
			return obj + "";
		}

		// Support: Android <=2.3 only (functionish RegExp)
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ toString.call( obj ) ] || "object" :
			typeof obj;
	},

	// Evaluates a script in a global context
	globalEval: function( code ) {
		DOMEval( code );
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Support: IE <=9 - 11, Edge 12 - 13
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	each: function( obj, callback ) {
		var length, i = 0;

		if ( isArrayLike( obj ) ) {
			length = obj.length;
			for ( ; i < length; i++ ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		} else {
			for ( i in obj ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		}

		return obj;
	},

	// Support: Android <=4.0 only
	trim: function( text ) {
		return text == null ?
			"" :
			( text + "" ).replace( rtrim, "" );
	},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArrayLike( Object( arr ) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		return arr == null ? -1 : indexOf.call( arr, elem, i );
	},

	// Support: Android <=4.0 only, PhantomJS 1 only
	// push.apply(_, arraylike) throws on ancient WebKit
	merge: function( first, second ) {
		var len = +second.length,
			j = 0,
			i = first.length;

		for ( ; j < len; j++ ) {
			first[ i++ ] = second[ j ];
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, invert ) {
		var callbackInverse,
			matches = [],
			i = 0,
			length = elems.length,
			callbackExpect = !invert;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			callbackInverse = !callback( elems[ i ], i );
			if ( callbackInverse !== callbackExpect ) {
				matches.push( elems[ i ] );
			}
		}

		return matches;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var length, value,
			i = 0,
			ret = [];

		// Go through the array, translating each of the items to their new values
		if ( isArrayLike( elems ) ) {
			length = elems.length;
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}
		}

		// Flatten any nested arrays
		return concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		var tmp, args, proxy;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	now: Date.now,

	// jQuery.support is not used in Core but other projects attach their
	// properties to it so it needs to exist.
	support: support
} );

if ( typeof Symbol === "function" ) {
	jQuery.fn[ Symbol.iterator ] = arr[ Symbol.iterator ];
}

// Populate the class2type map
jQuery.each( "Boolean Number String Function Array Date RegExp Object Error Symbol".split( " " ),
function( i, name ) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
} );

function isArrayLike( obj ) {

	// Support: real iOS 8.2 only (not reproducible in simulator)
	// `in` check used to prevent JIT error (gh-2145)
	// hasOwn isn't used here due to false negatives
	// regarding Nodelist length in IE
	var length = !!obj && "length" in obj && obj.length,
		type = jQuery.type( obj );

	if ( type === "function" || jQuery.isWindow( obj ) ) {
		return false;
	}

	return type === "array" || length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj;
}
var Sizzle =
/*!
 * Sizzle CSS Selector Engine v2.3.3
 * https://sizzlejs.com/
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2016-08-08
 */
(function( window ) {

var i,
	support,
	Expr,
	getText,
	isXML,
	tokenize,
	compile,
	select,
	outermostContext,
	sortInput,
	hasDuplicate,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + 1 * new Date(),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
		}
		return 0;
	},

	// Instance methods
	hasOwn = ({}).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	push_native = arr.push,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf as it's faster than native
	// https://jsperf.com/thor-indexof-vs-for/5
	indexOf = function( list, elem ) {
		var i = 0,
			len = list.length;
		for ( ; i < len; i++ ) {
			if ( list[i] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",

	// http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = "(?:\\\\.|[\\w-]|[^\0-\\xa0])+",

	// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +
		// Operator (capture 2)
		"*([*^$|!~]?=)" + whitespace +
		// "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
		"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace +
		"*\\]",

	pseudos = ":(" + identifier + ")(?:\\((" +
		// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
		// 1. quoted (capture 3; capture 4 or capture 5)
		"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +
		// 2. simple (capture 6)
		"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +
		// 3. anything else (capture 2)
		".*" +
		")\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rwhitespace = new RegExp( whitespace + "+", "g" ),
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

	rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + identifier + ")" ),
		"CLASS": new RegExp( "^\\.(" + identifier + ")" ),
		"TAG": new RegExp( "^(" + identifier + "|[*])" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rsibling = /[+~]/,

	// CSS escapes
	// http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
	funescape = function( _, escaped, escapedWhitespace ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		// Support: Firefox<24
		// Workaround erroneous numeric interpretation of +"0x"
		return high !== high || escapedWhitespace ?
			escaped :
			high < 0 ?
				// BMP codepoint
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	},

	// CSS string/identifier serialization
	// https://drafts.csswg.org/cssom/#common-serializing-idioms
	rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,
	fcssescape = function( ch, asCodePoint ) {
		if ( asCodePoint ) {

			// U+0000 NULL becomes U+FFFD REPLACEMENT CHARACTER
			if ( ch === "\0" ) {
				return "\uFFFD";
			}

			// Control characters and (dependent upon position) numbers get escaped as code points
			return ch.slice( 0, -1 ) + "\\" + ch.charCodeAt( ch.length - 1 ).toString( 16 ) + " ";
		}

		// Other potentially-special ASCII characters get backslash-escaped
		return "\\" + ch;
	},

	// Used for iframes
	// See setDocument()
	// Removing the function wrapper causes a "Permission Denied"
	// error in IE
	unloadHandler = function() {
		setDocument();
	},

	disabledAncestor = addCombinator(
		function( elem ) {
			return elem.disabled === true && ("form" in elem || "label" in elem);
		},
		{ dir: "parentNode", next: "legend" }
	);

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		(arr = slice.call( preferredDoc.childNodes )),
		preferredDoc.childNodes
	);
	// Support: Android<4.0
	// Detect silently failing push.apply
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			push_native.apply( target, slice.call(els) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;
			// Can't trust NodeList.length
			while ( (target[j++] = els[i++]) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var m, i, elem, nid, match, groups, newSelector,
		newContext = context && context.ownerDocument,

		// nodeType defaults to 9, since context defaults to document
		nodeType = context ? context.nodeType : 9;

	results = results || [];

	// Return early from calls with invalid selector or context
	if ( typeof selector !== "string" || !selector ||
		nodeType !== 1 && nodeType !== 9 && nodeType !== 11 ) {

		return results;
	}

	// Try to shortcut find operations (as opposed to filters) in HTML documents
	if ( !seed ) {

		if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
			setDocument( context );
		}
		context = context || document;

		if ( documentIsHTML ) {

			// If the selector is sufficiently simple, try using a "get*By*" DOM method
			// (excepting DocumentFragment context, where the methods don't exist)
			if ( nodeType !== 11 && (match = rquickExpr.exec( selector )) ) {

				// ID selector
				if ( (m = match[1]) ) {

					// Document context
					if ( nodeType === 9 ) {
						if ( (elem = context.getElementById( m )) ) {

							// Support: IE, Opera, Webkit
							// TODO: identify versions
							// getElementById can match elements by name instead of ID
							if ( elem.id === m ) {
								results.push( elem );
								return results;
							}
						} else {
							return results;
						}

					// Element context
					} else {

						// Support: IE, Opera, Webkit
						// TODO: identify versions
						// getElementById can match elements by name instead of ID
						if ( newContext && (elem = newContext.getElementById( m )) &&
							contains( context, elem ) &&
							elem.id === m ) {

							results.push( elem );
							return results;
						}
					}

				// Type selector
				} else if ( match[2] ) {
					push.apply( results, context.getElementsByTagName( selector ) );
					return results;

				// Class selector
				} else if ( (m = match[3]) && support.getElementsByClassName &&
					context.getElementsByClassName ) {

					push.apply( results, context.getElementsByClassName( m ) );
					return results;
				}
			}

			// Take advantage of querySelectorAll
			if ( support.qsa &&
				!compilerCache[ selector + " " ] &&
				(!rbuggyQSA || !rbuggyQSA.test( selector )) ) {

				if ( nodeType !== 1 ) {
					newContext = context;
					newSelector = selector;

				// qSA looks outside Element context, which is not what we want
				// Thanks to Andrew Dupont for this workaround technique
				// Support: IE <=8
				// Exclude object elements
				} else if ( context.nodeName.toLowerCase() !== "object" ) {

					// Capture the context ID, setting it first if necessary
					if ( (nid = context.getAttribute( "id" )) ) {
						nid = nid.replace( rcssescape, fcssescape );
					} else {
						context.setAttribute( "id", (nid = expando) );
					}

					// Prefix every selector in the list
					groups = tokenize( selector );
					i = groups.length;
					while ( i-- ) {
						groups[i] = "#" + nid + " " + toSelector( groups[i] );
					}
					newSelector = groups.join( "," );

					// Expand context for sibling selectors
					newContext = rsibling.test( selector ) && testContext( context.parentNode ) ||
						context;
				}

				if ( newSelector ) {
					try {
						push.apply( results,
							newContext.querySelectorAll( newSelector )
						);
						return results;
					} catch ( qsaError ) {
					} finally {
						if ( nid === expando ) {
							context.removeAttribute( "id" );
						}
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {function(string, object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key + " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key + " " ] = value);
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created element and returns a boolean result
 */
function assert( fn ) {
	var el = document.createElement("fieldset");

	try {
		return !!fn( el );
	} catch (e) {
		return false;
	} finally {
		// Remove from its parent by default
		if ( el.parentNode ) {
			el.parentNode.removeChild( el );
		}
		// release memory in IE
		el = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split("|"),
		i = arr.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[i] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			a.sourceIndex - b.sourceIndex;

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for :enabled/:disabled
 * @param {Boolean} disabled true for :disabled; false for :enabled
 */
function createDisabledPseudo( disabled ) {

	// Known :disabled false positives: fieldset[disabled] > legend:nth-of-type(n+2) :can-disable
	return function( elem ) {

		// Only certain elements can match :enabled or :disabled
		// https://html.spec.whatwg.org/multipage/scripting.html#selector-enabled
		// https://html.spec.whatwg.org/multipage/scripting.html#selector-disabled
		if ( "form" in elem ) {

			// Check for inherited disabledness on relevant non-disabled elements:
			// * listed form-associated elements in a disabled fieldset
			//   https://html.spec.whatwg.org/multipage/forms.html#category-listed
			//   https://html.spec.whatwg.org/multipage/forms.html#concept-fe-disabled
			// * option elements in a disabled optgroup
			//   https://html.spec.whatwg.org/multipage/forms.html#concept-option-disabled
			// All such elements have a "form" property.
			if ( elem.parentNode && elem.disabled === false ) {

				// Option elements defer to a parent optgroup if present
				if ( "label" in elem ) {
					if ( "label" in elem.parentNode ) {
						return elem.parentNode.disabled === disabled;
					} else {
						return elem.disabled === disabled;
					}
				}

				// Support: IE 6 - 11
				// Use the isDisabled shortcut property to check for disabled fieldset ancestors
				return elem.isDisabled === disabled ||

					// Where there is no isDisabled, check manually
					/* jshint -W018 */
					elem.isDisabled !== !disabled &&
						disabledAncestor( elem ) === disabled;
			}

			return elem.disabled === disabled;

		// Try to winnow out elements that can't be disabled before trusting the disabled property.
		// Some victims get caught in our net (label, legend, menu, track), but it shouldn't
		// even exist on them, let alone have a boolean value.
		} else if ( "label" in elem ) {
			return elem.disabled === disabled;
		}

		// Remaining elements are neither :enabled nor :disabled
		return false;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Checks a node for validity as a Sizzle context
 * @param {Element|Object=} context
 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
 */
function testContext( context ) {
	return context && typeof context.getElementsByTagName !== "undefined" && context;
}

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Detects XML nodes
 * @param {Element|Object} elem An element or a document
 * @returns {Boolean} True iff elem is a non-HTML XML node
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var hasCompare, subWindow,
		doc = node ? node.ownerDocument || node : preferredDoc;

	// Return early if doc is invalid or already selected
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Update global variables
	document = doc;
	docElem = document.documentElement;
	documentIsHTML = !isXML( document );

	// Support: IE 9-11, Edge
	// Accessing iframe documents after unload throws "permission denied" errors (jQuery #13936)
	if ( preferredDoc !== document &&
		(subWindow = document.defaultView) && subWindow.top !== subWindow ) {

		// Support: IE 11, Edge
		if ( subWindow.addEventListener ) {
			subWindow.addEventListener( "unload", unloadHandler, false );

		// Support: IE 9 - 10 only
		} else if ( subWindow.attachEvent ) {
			subWindow.attachEvent( "onunload", unloadHandler );
		}
	}

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties
	// (excepting IE8 booleans)
	support.attributes = assert(function( el ) {
		el.className = "i";
		return !el.getAttribute("className");
	});

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert(function( el ) {
		el.appendChild( document.createComment("") );
		return !el.getElementsByTagName("*").length;
	});

	// Support: IE<9
	support.getElementsByClassName = rnative.test( document.getElementsByClassName );

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programmatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert(function( el ) {
		docElem.appendChild( el ).id = expando;
		return !document.getElementsByName || !document.getElementsByName( expando ).length;
	});

	// ID filter and find
	if ( support.getById ) {
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var elem = context.getElementById( id );
				return elem ? [ elem ] : [];
			}
		};
	} else {
		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== "undefined" &&
					elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};

		// Support: IE 6 - 7 only
		// getElementById is not reliable as a find shortcut
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var node, i, elems,
					elem = context.getElementById( id );

				if ( elem ) {

					// Verify the id attribute
					node = elem.getAttributeNode("id");
					if ( node && node.value === id ) {
						return [ elem ];
					}

					// Fall back on getElementsByName
					elems = context.getElementsByName( id );
					i = 0;
					while ( (elem = elems[i++]) ) {
						node = elem.getAttributeNode("id");
						if ( node && node.value === id ) {
							return [ elem ];
						}
					}
				}

				return [];
			}
		};
	}

	// Tag
	Expr.find["TAG"] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== "undefined" ) {
				return context.getElementsByTagName( tag );

			// DocumentFragment nodes don't have gEBTN
			} else if ( support.qsa ) {
				return context.querySelectorAll( tag );
			}
		} :

		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				// By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== "undefined" && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See https://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( (support.qsa = rnative.test( document.querySelectorAll )) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( el ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// https://bugs.jquery.com/ticket/12359
			docElem.appendChild( el ).innerHTML = "<a id='" + expando + "'></a>" +
				"<select id='" + expando + "-\r\\' msallowcapture=''>" +
				"<option selected=''></option></select>";

			// Support: IE8, Opera 11-12.16
			// Nothing should be selected when empty strings follow ^= or $= or *=
			// The test attribute must be unknown in Opera but "safe" for WinRT
			// https://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
			if ( el.querySelectorAll("[msallowcapture^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !el.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Support: Chrome<29, Android<4.4, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.8+
			if ( !el.querySelectorAll( "[id~=" + expando + "-]" ).length ) {
				rbuggyQSA.push("~=");
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !el.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}

			// Support: Safari 8+, iOS 8+
			// https://bugs.webkit.org/show_bug.cgi?id=136851
			// In-page `selector#id sibling-combinator selector` fails
			if ( !el.querySelectorAll( "a#" + expando + "+*" ).length ) {
				rbuggyQSA.push(".#.+[+~]");
			}
		});

		assert(function( el ) {
			el.innerHTML = "<a href='' disabled='disabled'></a>" +
				"<select disabled='disabled'><option/></select>";

			// Support: Windows 8 Native Apps
			// The type and name attributes are restricted during .innerHTML assignment
			var input = document.createElement("input");
			input.setAttribute( "type", "hidden" );
			el.appendChild( input ).setAttribute( "name", "D" );

			// Support: IE8
			// Enforce case-sensitivity of name attribute
			if ( el.querySelectorAll("[name=d]").length ) {
				rbuggyQSA.push( "name" + whitespace + "*[*^$|!~]?=" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( el.querySelectorAll(":enabled").length !== 2 ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Support: IE9-11+
			// IE's :disabled selector does not pick up the children of disabled fieldsets
			docElem.appendChild( el ).disabled = true;
			if ( el.querySelectorAll(":disabled").length !== 2 ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			el.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = rnative.test( (matches = docElem.matches ||
		docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( el ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( el, "*" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( el, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

	/* Contains
	---------------------------------------------------------------------- */
	hasCompare = rnative.test( docElem.compareDocumentPosition );

	// Element contains another
	// Purposefully self-exclusive
	// As in, an element does not contain itself
	contains = hasCompare || rnative.test( docElem.contains ) ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = hasCompare ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		// Sort on method existence if only one input has compareDocumentPosition
		var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
		if ( compare ) {
			return compare;
		}

		// Calculate position if both inputs belong to the same document
		compare = ( a.ownerDocument || a ) === ( b.ownerDocument || b ) ?
			a.compareDocumentPosition( b ) :

			// Otherwise we know they are disconnected
			1;

		// Disconnected nodes
		if ( compare & 1 ||
			(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

			// Choose the first element that is related to our preferred document
			if ( a === document || a.ownerDocument === preferredDoc && contains(preferredDoc, a) ) {
				return -1;
			}
			if ( b === document || b.ownerDocument === preferredDoc && contains(preferredDoc, b) ) {
				return 1;
			}

			// Maintain original order
			return sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;
		}

		return compare & 4 ? -1 : 1;
	} :
	function( a, b ) {
		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Parentless nodes are either documents or disconnected
		if ( !aup || !bup ) {
			return a === document ? -1 :
				b === document ? 1 :
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	return document;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	if ( support.matchesSelector && documentIsHTML &&
		!compilerCache[ expr + " " ] &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch (e) {}
	}

	return Sizzle( expr, document, null, [ elem ] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],
		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val !== undefined ?
		val :
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			(val = elem.getAttributeNode(name)) && val.specified ?
				val.value :
				null;
};

Sizzle.escape = function( sel ) {
	return (sel + "").replace( rcssescape, fcssescape );
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( (elem = results[i++]) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	// Clear input after sorting to release objects
	// See https://github.com/jquery/sizzle/pull/225
	sortInput = null;

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		while ( (node = elem[i++]) ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (jQuery #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[3] || match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[6] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[3] ) {
				match[2] = match[4] || match[5] || "";

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() { return true; } :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result.replace( rwhitespace, " " ) + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, uniqueCache, outerCache, node, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType,
						diff = false;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) {

										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {

							// Seek `elem` from a previously-cached index

							// ...in a gzip-friendly way
							node = parent;
							outerCache = node[ expando ] || (node[ expando ] = {});

							// Support: IE <9 only
							// Defend against cloned attroperties (jQuery gh-1709)
							uniqueCache = outerCache[ node.uniqueID ] ||
								(outerCache[ node.uniqueID ] = {});

							cache = uniqueCache[ type ] || [];
							nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
							diff = nodeIndex && cache[ 2 ];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									uniqueCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						} else {
							// Use previously-cached element index if available
							if ( useCache ) {
								// ...in a gzip-friendly way
								node = elem;
								outerCache = node[ expando ] || (node[ expando ] = {});

								// Support: IE <9 only
								// Defend against cloned attroperties (jQuery gh-1709)
								uniqueCache = outerCache[ node.uniqueID ] ||
									(outerCache[ node.uniqueID ] = {});

								cache = uniqueCache[ type ] || [];
								nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
								diff = nodeIndex;
							}

							// xml :nth-child(...)
							// or :nth-last-child(...) or :nth(-last)?-of-type(...)
							if ( diff === false ) {
								// Use the same loop as above to seek `elem` from the start
								while ( (node = ++nodeIndex && node && node[ dir ] ||
									(diff = nodeIndex = 0) || start.pop()) ) {

									if ( ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) &&
										++diff ) {

										// Cache the index of each encountered element
										if ( useCache ) {
											outerCache = node[ expando ] || (node[ expando ] = {});

											// Support: IE <9 only
											// Defend against cloned attroperties (jQuery gh-1709)
											uniqueCache = outerCache[ node.uniqueID ] ||
												(outerCache[ node.uniqueID ] = {});

											uniqueCache[ type ] = [ dirruns, diff ];
										}

										if ( node === elem ) {
											break;
										}
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					// Don't keep the element (issue #299)
					input[0] = null;
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			text = text.replace( runescape, funescape );
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifier
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": createDisabledPseudo( false ),
		"disabled": createDisabledPseudo( true ),

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
			//   but not by others (comment: 8; processing instruction: 7; etc.)
			// nodeType < 6 works because attributes (2) do not appear as children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeType < 6 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&

				// Support: IE<8
				// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text" );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

tokenize = Sizzle.tokenize = function( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( (tokens = []) );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push({
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			});
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					type: type,
					matches: match
				});
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
};

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		skip = combinator.next,
		key = skip || dir,
		checkNonElements = base && key === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
			return false;
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var oldCache, uniqueCache, outerCache,
				newCache = [ dirruns, doneName ];

			// We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});

						// Support: IE <9 only
						// Defend against cloned attroperties (jQuery gh-1709)
						uniqueCache = outerCache[ elem.uniqueID ] || (outerCache[ elem.uniqueID ] = {});

						if ( skip && skip === elem.nodeName.toLowerCase() ) {
							elem = elem[ dir ] || elem;
						} else if ( (oldCache = uniqueCache[ key ]) &&
							oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {

							// Assign to newCache so results back-propagate to previous elements
							return (newCache[ 2 ] = oldCache[ 2 ]);
						} else {
							// Reuse newcache so results back-propagate to previous elements
							uniqueCache[ key ] = newCache;

							// A match means we're done; a fail means we have to keep checking
							if ( (newCache[ 2 ] = matcher( elem, context, xml )) ) {
								return true;
							}
						}
					}
				}
			}
			return false;
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			var ret = ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
			// Avoid hanging onto element (issue #299)
			checkContext = null;
			return ret;
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(
						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	var bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, outermost ) {
			var elem, j, matcher,
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				setMatched = [],
				contextBackup = outermostContext,
				// We must always have either seed elements or outermost context
				elems = seed || byElement && Expr.find["TAG"]( "*", outermost ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1),
				len = elems.length;

			if ( outermost ) {
				outermostContext = context === document || context || outermost;
			}

			// Add elements passing elementMatchers directly to results
			// Support: IE<9, Safari
			// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
			for ( ; i !== len && (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					if ( !context && elem.ownerDocument !== document ) {
						setDocument( elem );
						xml = !documentIsHTML;
					}
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context || document, xml) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// `i` is now the count of elements visited above, and adding it to `matchedCount`
			// makes the latter nonnegative.
			matchedCount += i;

			// Apply set filters to unmatched elements
			// NOTE: This can be skipped if there are no unmatched elements (i.e., `matchedCount`
			// equals `i`), unless we didn't visit _any_ elements in the above loop because we have
			// no element matchers and no seed.
			// Incrementing an initially-string "0" `i` allows `i` to remain a string only in that
			// case, which will result in a "00" `matchedCount` that differs from `i` but is also
			// numerically zero.
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, match /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !match ) {
			match = tokenize( selector );
		}
		i = match.length;
		while ( i-- ) {
			cached = matcherFromTokens( match[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );

		// Save selector and tokenization
		cached.selector = selector;
	}
	return cached;
};

/**
 * A low-level selection function that works with Sizzle's compiled
 *  selector functions
 * @param {String|Function} selector A selector or a pre-compiled
 *  selector function built with Sizzle.compile
 * @param {Element} context
 * @param {Array} [results]
 * @param {Array} [seed] A set of elements to match against
 */
select = Sizzle.select = function( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		compiled = typeof selector === "function" && selector,
		match = !seed && tokenize( (selector = compiled.selector || selector) );

	results = results || [];

	// Try to minimize operations if there is only one selector in the list and no seed
	// (the latter of which guarantees us context)
	if ( match.length === 1 ) {

		// Reduce context if the leading compound selector is an ID
		tokens = match[0] = match[0].slice( 0 );
		if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
				context.nodeType === 9 && documentIsHTML && Expr.relative[ tokens[1].type ] ) {

			context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
			if ( !context ) {
				return results;

			// Precompiled matchers will still verify ancestry, so step up a level
			} else if ( compiled ) {
				context = context.parentNode;
			}

			selector = selector.slice( tokens.shift().value.length );
		}

		// Fetch a seed set for right-to-left matching
		i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
		while ( i-- ) {
			token = tokens[i];

			// Abort if we hit a combinator
			if ( Expr.relative[ (type = token.type) ] ) {
				break;
			}
			if ( (find = Expr.find[ type ]) ) {
				// Search, expanding context for leading sibling combinators
				if ( (seed = find(
					token.matches[0].replace( runescape, funescape ),
					rsibling.test( tokens[0].type ) && testContext( context.parentNode ) || context
				)) ) {

					// If seed is empty or no tokens remain, we can return early
					tokens.splice( i, 1 );
					selector = seed.length && toSelector( tokens );
					if ( !selector ) {
						push.apply( results, seed );
						return results;
					}

					break;
				}
			}
		}
	}

	// Compile and execute a filtering function if one is not provided
	// Provide `match` to avoid retokenization if we modified the selector above
	( compiled || compile( selector, match ) )(
		seed,
		context,
		!documentIsHTML,
		results,
		!context || rsibling.test( selector ) && testContext( context.parentNode ) || context
	);
	return results;
};

// One-time assignments

// Sort stability
support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

// Support: Chrome 14-35+
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = !!hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert(function( el ) {
	// Should return 1, but returns 4 (following)
	return el.compareDocumentPosition( document.createElement("fieldset") ) & 1;
});

// Support: IE<8
// Prevent attribute/property "interpolation"
// https://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert(function( el ) {
	el.innerHTML = "<a href='#'></a>";
	return el.firstChild.getAttribute("href") === "#" ;
}) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	});
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert(function( el ) {
	el.innerHTML = "<input/>";
	el.firstChild.setAttribute( "value", "" );
	return el.firstChild.getAttribute( "value" ) === "";
}) ) {
	addHandle( "value", function( elem, name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	});
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert(function( el ) {
	return el.getAttribute("disabled") == null;
}) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return elem[ name ] === true ? name.toLowerCase() :
					(val = elem.getAttributeNode( name )) && val.specified ?
					val.value :
				null;
		}
	});
}

return Sizzle;

})( window );



jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;

// Deprecated
jQuery.expr[ ":" ] = jQuery.expr.pseudos;
jQuery.uniqueSort = jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;
jQuery.escapeSelector = Sizzle.escape;




var dir = function( elem, dir, until ) {
	var matched = [],
		truncate = until !== undefined;

	while ( ( elem = elem[ dir ] ) && elem.nodeType !== 9 ) {
		if ( elem.nodeType === 1 ) {
			if ( truncate && jQuery( elem ).is( until ) ) {
				break;
			}
			matched.push( elem );
		}
	}
	return matched;
};


var siblings = function( n, elem ) {
	var matched = [];

	for ( ; n; n = n.nextSibling ) {
		if ( n.nodeType === 1 && n !== elem ) {
			matched.push( n );
		}
	}

	return matched;
};


var rneedsContext = jQuery.expr.match.needsContext;



function nodeName( elem, name ) {

  return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();

};
var rsingleTag = ( /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i );



var risSimple = /^.[^:#\[\.,]*$/;

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			return !!qualifier.call( elem, i, elem ) !== not;
		} );
	}

	// Single element
	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		} );
	}

	// Arraylike of elements (jQuery, arguments, Array)
	if ( typeof qualifier !== "string" ) {
		return jQuery.grep( elements, function( elem ) {
			return ( indexOf.call( qualifier, elem ) > -1 ) !== not;
		} );
	}

	// Simple selector that can be filtered directly, removing non-Elements
	if ( risSimple.test( qualifier ) ) {
		return jQuery.filter( qualifier, elements, not );
	}

	// Complex selector, compare the two sets, removing non-Elements
	qualifier = jQuery.filter( qualifier, elements );
	return jQuery.grep( elements, function( elem ) {
		return ( indexOf.call( qualifier, elem ) > -1 ) !== not && elem.nodeType === 1;
	} );
}

jQuery.filter = function( expr, elems, not ) {
	var elem = elems[ 0 ];

	if ( not ) {
		expr = ":not(" + expr + ")";
	}

	if ( elems.length === 1 && elem.nodeType === 1 ) {
		return jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [];
	}

	return jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
		return elem.nodeType === 1;
	} ) );
};

jQuery.fn.extend( {
	find: function( selector ) {
		var i, ret,
			len = this.length,
			self = this;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter( function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			} ) );
		}

		ret = this.pushStack( [] );

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		return len > 1 ? jQuery.uniqueSort( ret ) : ret;
	},
	filter: function( selector ) {
		return this.pushStack( winnow( this, selector || [], false ) );
	},
	not: function( selector ) {
		return this.pushStack( winnow( this, selector || [], true ) );
	},
	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	}
} );


// Initialize a jQuery object


// A central reference to the root jQuery(document)
var rootjQuery,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	// Shortcut simple #id case for speed
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,

	init = jQuery.fn.init = function( selector, context, root ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Method init() accepts an alternate rootjQuery
		// so migrate can support jQuery.sub (gh-2101)
		root = root || rootjQuery;

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector[ 0 ] === "<" &&
				selector[ selector.length - 1 ] === ">" &&
				selector.length >= 3 ) {

				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && ( match[ 1 ] || !context ) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[ 1 ] ) {
					context = context instanceof jQuery ? context[ 0 ] : context;

					// Option to run scripts is true for back-compat
					// Intentionally let the error be thrown if parseHTML is not present
					jQuery.merge( this, jQuery.parseHTML(
						match[ 1 ],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[ 1 ] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {

							// Properties of context are called as methods if possible
							if ( jQuery.isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[ 2 ] );

					if ( elem ) {

						// Inject the element directly into the jQuery object
						this[ 0 ] = elem;
						this.length = 1;
					}
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || root ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this[ 0 ] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return root.ready !== undefined ?
				root.ready( selector ) :

				// Execute immediately if ready is not present
				selector( jQuery );
		}

		return jQuery.makeArray( selector, this );
	};

// Give the init function the jQuery prototype for later instantiation
init.prototype = jQuery.fn;

// Initialize central reference
rootjQuery = jQuery( document );


var rparentsprev = /^(?:parents|prev(?:Until|All))/,

	// Methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend( {
	has: function( target ) {
		var targets = jQuery( target, this ),
			l = targets.length;

		return this.filter( function() {
			var i = 0;
			for ( ; i < l; i++ ) {
				if ( jQuery.contains( this, targets[ i ] ) ) {
					return true;
				}
			}
		} );
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			matched = [],
			targets = typeof selectors !== "string" && jQuery( selectors );

		// Positional selectors never match, since there's no _selection_ context
		if ( !rneedsContext.test( selectors ) ) {
			for ( ; i < l; i++ ) {
				for ( cur = this[ i ]; cur && cur !== context; cur = cur.parentNode ) {

					// Always skip document fragments
					if ( cur.nodeType < 11 && ( targets ?
						targets.index( cur ) > -1 :

						// Don't pass non-elements to Sizzle
						cur.nodeType === 1 &&
							jQuery.find.matchesSelector( cur, selectors ) ) ) {

						matched.push( cur );
						break;
					}
				}
			}
		}

		return this.pushStack( matched.length > 1 ? jQuery.uniqueSort( matched ) : matched );
	},

	// Determine the position of an element within the set
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
		}

		// Index in selector
		if ( typeof elem === "string" ) {
			return indexOf.call( jQuery( elem ), this[ 0 ] );
		}

		// Locate the position of the desired element
		return indexOf.call( this,

			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[ 0 ] : elem
		);
	},

	add: function( selector, context ) {
		return this.pushStack(
			jQuery.uniqueSort(
				jQuery.merge( this.get(), jQuery( selector, context ) )
			)
		);
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter( selector )
		);
	}
} );

function sibling( cur, dir ) {
	while ( ( cur = cur[ dir ] ) && cur.nodeType !== 1 ) {}
	return cur;
}

jQuery.each( {
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return siblings( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return siblings( elem.firstChild );
	},
	contents: function( elem ) {
        if ( nodeName( elem, "iframe" ) ) {
            return elem.contentDocument;
        }

        // Support: IE 9 - 11 only, iOS 7 only, Android Browser <=4.3 only
        // Treat the template element as a regular one in browsers that
        // don't support it.
        if ( nodeName( elem, "template" ) ) {
            elem = elem.content || elem;
        }

        return jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var matched = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			matched = jQuery.filter( selector, matched );
		}

		if ( this.length > 1 ) {

			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				jQuery.uniqueSort( matched );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				matched.reverse();
			}
		}

		return this.pushStack( matched );
	};
} );
var rnothtmlwhite = ( /[^\x20\t\r\n\f]+/g );



// Convert String-formatted options into Object-formatted ones
function createOptions( options ) {
	var object = {};
	jQuery.each( options.match( rnothtmlwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	} );
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		createOptions( options ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,

		// Last fire value for non-forgettable lists
		memory,

		// Flag to know if list was already fired
		fired,

		// Flag to prevent firing
		locked,

		// Actual callback list
		list = [],

		// Queue of execution data for repeatable lists
		queue = [],

		// Index of currently firing callback (modified by add/remove as needed)
		firingIndex = -1,

		// Fire callbacks
		fire = function() {

			// Enforce single-firing
			locked = locked || options.once;

			// Execute callbacks for all pending executions,
			// respecting firingIndex overrides and runtime changes
			fired = firing = true;
			for ( ; queue.length; firingIndex = -1 ) {
				memory = queue.shift();
				while ( ++firingIndex < list.length ) {

					// Run callback and check for early termination
					if ( list[ firingIndex ].apply( memory[ 0 ], memory[ 1 ] ) === false &&
						options.stopOnFalse ) {

						// Jump to end and forget the data so .add doesn't re-fire
						firingIndex = list.length;
						memory = false;
					}
				}
			}

			// Forget the data if we're done with it
			if ( !options.memory ) {
				memory = false;
			}

			firing = false;

			// Clean up if we're done firing for good
			if ( locked ) {

				// Keep an empty list if we have data for future add calls
				if ( memory ) {
					list = [];

				// Otherwise, this object is spent
				} else {
					list = "";
				}
			}
		},

		// Actual Callbacks object
		self = {

			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {

					// If we have memory from a past run, we should fire after adding
					if ( memory && !firing ) {
						firingIndex = list.length - 1;
						queue.push( memory );
					}

					( function add( args ) {
						jQuery.each( args, function( _, arg ) {
							if ( jQuery.isFunction( arg ) ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && jQuery.type( arg ) !== "string" ) {

								// Inspect recursively
								add( arg );
							}
						} );
					} )( arguments );

					if ( memory && !firing ) {
						fire();
					}
				}
				return this;
			},

			// Remove a callback from the list
			remove: function() {
				jQuery.each( arguments, function( _, arg ) {
					var index;
					while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
						list.splice( index, 1 );

						// Handle firing indexes
						if ( index <= firingIndex ) {
							firingIndex--;
						}
					}
				} );
				return this;
			},

			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ?
					jQuery.inArray( fn, list ) > -1 :
					list.length > 0;
			},

			// Remove all callbacks from the list
			empty: function() {
				if ( list ) {
					list = [];
				}
				return this;
			},

			// Disable .fire and .add
			// Abort any current/pending executions
			// Clear all callbacks and values
			disable: function() {
				locked = queue = [];
				list = memory = "";
				return this;
			},
			disabled: function() {
				return !list;
			},

			// Disable .fire
			// Also disable .add unless we have memory (since it would have no effect)
			// Abort any pending executions
			lock: function() {
				locked = queue = [];
				if ( !memory && !firing ) {
					list = memory = "";
				}
				return this;
			},
			locked: function() {
				return !!locked;
			},

			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( !locked ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					queue.push( args );
					if ( !firing ) {
						fire();
					}
				}
				return this;
			},

			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},

			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};


function Identity( v ) {
	return v;
}
function Thrower( ex ) {
	throw ex;
}

function adoptValue( value, resolve, reject, noValue ) {
	var method;

	try {

		// Check for promise aspect first to privilege synchronous behavior
		if ( value && jQuery.isFunction( ( method = value.promise ) ) ) {
			method.call( value ).done( resolve ).fail( reject );

		// Other thenables
		} else if ( value && jQuery.isFunction( ( method = value.then ) ) ) {
			method.call( value, resolve, reject );

		// Other non-thenables
		} else {

			// Control `resolve` arguments by letting Array#slice cast boolean `noValue` to integer:
			// * false: [ value ].slice( 0 ) => resolve( value )
			// * true: [ value ].slice( 1 ) => resolve()
			resolve.apply( undefined, [ value ].slice( noValue ) );
		}

	// For Promises/A+, convert exceptions into rejections
	// Since jQuery.when doesn't unwrap thenables, we can skip the extra checks appearing in
	// Deferred#then to conditionally suppress rejection.
	} catch ( value ) {

		// Support: Android 4.0 only
		// Strict mode functions invoked without .call/.apply get global-object context
		reject.apply( undefined, [ value ] );
	}
}

jQuery.extend( {

	Deferred: function( func ) {
		var tuples = [

				// action, add listener, callbacks,
				// ... .then handlers, argument index, [final state]
				[ "notify", "progress", jQuery.Callbacks( "memory" ),
					jQuery.Callbacks( "memory" ), 2 ],
				[ "resolve", "done", jQuery.Callbacks( "once memory" ),
					jQuery.Callbacks( "once memory" ), 0, "resolved" ],
				[ "reject", "fail", jQuery.Callbacks( "once memory" ),
					jQuery.Callbacks( "once memory" ), 1, "rejected" ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				"catch": function( fn ) {
					return promise.then( null, fn );
				},

				// Keep pipe for back-compat
				pipe: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;

					return jQuery.Deferred( function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {

							// Map tuples (progress, done, fail) to arguments (done, fail, progress)
							var fn = jQuery.isFunction( fns[ tuple[ 4 ] ] ) && fns[ tuple[ 4 ] ];

							// deferred.progress(function() { bind to newDefer or newDefer.notify })
							// deferred.done(function() { bind to newDefer or newDefer.resolve })
							// deferred.fail(function() { bind to newDefer or newDefer.reject })
							deferred[ tuple[ 1 ] ]( function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise()
										.progress( newDefer.notify )
										.done( newDefer.resolve )
										.fail( newDefer.reject );
								} else {
									newDefer[ tuple[ 0 ] + "With" ](
										this,
										fn ? [ returned ] : arguments
									);
								}
							} );
						} );
						fns = null;
					} ).promise();
				},
				then: function( onFulfilled, onRejected, onProgress ) {
					var maxDepth = 0;
					function resolve( depth, deferred, handler, special ) {
						return function() {
							var that = this,
								args = arguments,
								mightThrow = function() {
									var returned, then;

									// Support: Promises/A+ section 2.3.3.3.3
									// https://promisesaplus.com/#point-59
									// Ignore double-resolution attempts
									if ( depth < maxDepth ) {
										return;
									}

									returned = handler.apply( that, args );

									// Support: Promises/A+ section 2.3.1
									// https://promisesaplus.com/#point-48
									if ( returned === deferred.promise() ) {
										throw new TypeError( "Thenable self-resolution" );
									}

									// Support: Promises/A+ sections 2.3.3.1, 3.5
									// https://promisesaplus.com/#point-54
									// https://promisesaplus.com/#point-75
									// Retrieve `then` only once
									then = returned &&

										// Support: Promises/A+ section 2.3.4
										// https://promisesaplus.com/#point-64
										// Only check objects and functions for thenability
										( typeof returned === "object" ||
											typeof returned === "function" ) &&
										returned.then;

									// Handle a returned thenable
									if ( jQuery.isFunction( then ) ) {

										// Special processors (notify) just wait for resolution
										if ( special ) {
											then.call(
												returned,
												resolve( maxDepth, deferred, Identity, special ),
												resolve( maxDepth, deferred, Thrower, special )
											);

										// Normal processors (resolve) also hook into progress
										} else {

											// ...and disregard older resolution values
											maxDepth++;

											then.call(
												returned,
												resolve( maxDepth, deferred, Identity, special ),
												resolve( maxDepth, deferred, Thrower, special ),
												resolve( maxDepth, deferred, Identity,
													deferred.notifyWith )
											);
										}

									// Handle all other returned values
									} else {

										// Only substitute handlers pass on context
										// and multiple values (non-spec behavior)
										if ( handler !== Identity ) {
											that = undefined;
											args = [ returned ];
										}

										// Process the value(s)
										// Default process is resolve
										( special || deferred.resolveWith )( that, args );
									}
								},

								// Only normal processors (resolve) catch and reject exceptions
								process = special ?
									mightThrow :
									function() {
										try {
											mightThrow();
										} catch ( e ) {

											if ( jQuery.Deferred.exceptionHook ) {
												jQuery.Deferred.exceptionHook( e,
													process.stackTrace );
											}

											// Support: Promises/A+ section 2.3.3.3.4.1
											// https://promisesaplus.com/#point-61
											// Ignore post-resolution exceptions
											if ( depth + 1 >= maxDepth ) {

												// Only substitute handlers pass on context
												// and multiple values (non-spec behavior)
												if ( handler !== Thrower ) {
													that = undefined;
													args = [ e ];
												}

												deferred.rejectWith( that, args );
											}
										}
									};

							// Support: Promises/A+ section 2.3.3.3.1
							// https://promisesaplus.com/#point-57
							// Re-resolve promises immediately to dodge false rejection from
							// subsequent errors
							if ( depth ) {
								process();
							} else {

								// Call an optional hook to record the stack, in case of exception
								// since it's otherwise lost when execution goes async
								if ( jQuery.Deferred.getStackHook ) {
									process.stackTrace = jQuery.Deferred.getStackHook();
								}
								window.setTimeout( process );
							}
						};
					}

					return jQuery.Deferred( function( newDefer ) {

						// progress_handlers.add( ... )
						tuples[ 0 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								jQuery.isFunction( onProgress ) ?
									onProgress :
									Identity,
								newDefer.notifyWith
							)
						);

						// fulfilled_handlers.add( ... )
						tuples[ 1 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								jQuery.isFunction( onFulfilled ) ?
									onFulfilled :
									Identity
							)
						);

						// rejected_handlers.add( ... )
						tuples[ 2 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								jQuery.isFunction( onRejected ) ?
									onRejected :
									Thrower
							)
						);
					} ).promise();
				},

				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 5 ];

			// promise.progress = list.add
			// promise.done = list.add
			// promise.fail = list.add
			promise[ tuple[ 1 ] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(
					function() {

						// state = "resolved" (i.e., fulfilled)
						// state = "rejected"
						state = stateString;
					},

					// rejected_callbacks.disable
					// fulfilled_callbacks.disable
					tuples[ 3 - i ][ 2 ].disable,

					// progress_callbacks.lock
					tuples[ 0 ][ 2 ].lock
				);
			}

			// progress_handlers.fire
			// fulfilled_handlers.fire
			// rejected_handlers.fire
			list.add( tuple[ 3 ].fire );

			// deferred.notify = function() { deferred.notifyWith(...) }
			// deferred.resolve = function() { deferred.resolveWith(...) }
			// deferred.reject = function() { deferred.rejectWith(...) }
			deferred[ tuple[ 0 ] ] = function() {
				deferred[ tuple[ 0 ] + "With" ]( this === deferred ? undefined : this, arguments );
				return this;
			};

			// deferred.notifyWith = list.fireWith
			// deferred.resolveWith = list.fireWith
			// deferred.rejectWith = list.fireWith
			deferred[ tuple[ 0 ] + "With" ] = list.fireWith;
		} );

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( singleValue ) {
		var

			// count of uncompleted subordinates
			remaining = arguments.length,

			// count of unprocessed arguments
			i = remaining,

			// subordinate fulfillment data
			resolveContexts = Array( i ),
			resolveValues = slice.call( arguments ),

			// the master Deferred
			master = jQuery.Deferred(),

			// subordinate callback factory
			updateFunc = function( i ) {
				return function( value ) {
					resolveContexts[ i ] = this;
					resolveValues[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
					if ( !( --remaining ) ) {
						master.resolveWith( resolveContexts, resolveValues );
					}
				};
			};

		// Single- and empty arguments are adopted like Promise.resolve
		if ( remaining <= 1 ) {
			adoptValue( singleValue, master.done( updateFunc( i ) ).resolve, master.reject,
				!remaining );

			// Use .then() to unwrap secondary thenables (cf. gh-3000)
			if ( master.state() === "pending" ||
				jQuery.isFunction( resolveValues[ i ] && resolveValues[ i ].then ) ) {

				return master.then();
			}
		}

		// Multiple arguments are aggregated like Promise.all array elements
		while ( i-- ) {
			adoptValue( resolveValues[ i ], updateFunc( i ), master.reject );
		}

		return master.promise();
	}
} );


// These usually indicate a programmer mistake during development,
// warn about them ASAP rather than swallowing them by default.
var rerrorNames = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;

jQuery.Deferred.exceptionHook = function( error, stack ) {

	// Support: IE 8 - 9 only
	// Console exists when dev tools are open, which can happen at any time
	if ( window.console && window.console.warn && error && rerrorNames.test( error.name ) ) {
		window.console.warn( "jQuery.Deferred exception: " + error.message, error.stack, stack );
	}
};




jQuery.readyException = function( error ) {
	window.setTimeout( function() {
		throw error;
	} );
};




// The deferred used on DOM ready
var readyList = jQuery.Deferred();

jQuery.fn.ready = function( fn ) {

	readyList
		.then( fn )

		// Wrap jQuery.readyException in a function so that the lookup
		// happens at the time of error handling instead of callback
		// registration.
		.catch( function( error ) {
			jQuery.readyException( error );
		} );

	return this;
};

jQuery.extend( {

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );
	}
} );

jQuery.ready.then = readyList.then;

// The ready event handler and self cleanup method
function completed() {
	document.removeEventListener( "DOMContentLoaded", completed );
	window.removeEventListener( "load", completed );
	jQuery.ready();
}

// Catch cases where $(document).ready() is called
// after the browser event has already occurred.
// Support: IE <=9 - 10 only
// Older IE sometimes signals "interactive" too soon
if ( document.readyState === "complete" ||
	( document.readyState !== "loading" && !document.documentElement.doScroll ) ) {

	// Handle it asynchronously to allow scripts the opportunity to delay ready
	window.setTimeout( jQuery.ready );

} else {

	// Use the handy event callback
	document.addEventListener( "DOMContentLoaded", completed );

	// A fallback to window.onload, that will always work
	window.addEventListener( "load", completed );
}




// Multifunctional method to get and set values of a collection
// The value/s can optionally be executed if it's a function
var access = function( elems, fn, key, value, chainable, emptyGet, raw ) {
	var i = 0,
		len = elems.length,
		bulk = key == null;

	// Sets many values
	if ( jQuery.type( key ) === "object" ) {
		chainable = true;
		for ( i in key ) {
			access( elems, fn, i, key[ i ], true, emptyGet, raw );
		}

	// Sets one value
	} else if ( value !== undefined ) {
		chainable = true;

		if ( !jQuery.isFunction( value ) ) {
			raw = true;
		}

		if ( bulk ) {

			// Bulk operations run against the entire set
			if ( raw ) {
				fn.call( elems, value );
				fn = null;

			// ...except when executing function values
			} else {
				bulk = fn;
				fn = function( elem, key, value ) {
					return bulk.call( jQuery( elem ), value );
				};
			}
		}

		if ( fn ) {
			for ( ; i < len; i++ ) {
				fn(
					elems[ i ], key, raw ?
					value :
					value.call( elems[ i ], i, fn( elems[ i ], key ) )
				);
			}
		}
	}

	if ( chainable ) {
		return elems;
	}

	// Gets
	if ( bulk ) {
		return fn.call( elems );
	}

	return len ? fn( elems[ 0 ], key ) : emptyGet;
};
var acceptData = function( owner ) {

	// Accepts only:
	//  - Node
	//    - Node.ELEMENT_NODE
	//    - Node.DOCUMENT_NODE
	//  - Object
	//    - Any
	return owner.nodeType === 1 || owner.nodeType === 9 || !( +owner.nodeType );
};




function Data() {
	this.expando = jQuery.expando + Data.uid++;
}

Data.uid = 1;

Data.prototype = {

	cache: function( owner ) {

		// Check if the owner object already has a cache
		var value = owner[ this.expando ];

		// If not, create one
		if ( !value ) {
			value = {};

			// We can accept data for non-element nodes in modern browsers,
			// but we should not, see #8335.
			// Always return an empty object.
			if ( acceptData( owner ) ) {

				// If it is a node unlikely to be stringify-ed or looped over
				// use plain assignment
				if ( owner.nodeType ) {
					owner[ this.expando ] = value;

				// Otherwise secure it in a non-enumerable property
				// configurable must be true to allow the property to be
				// deleted when data is removed
				} else {
					Object.defineProperty( owner, this.expando, {
						value: value,
						configurable: true
					} );
				}
			}
		}

		return value;
	},
	set: function( owner, data, value ) {
		var prop,
			cache = this.cache( owner );

		// Handle: [ owner, key, value ] args
		// Always use camelCase key (gh-2257)
		if ( typeof data === "string" ) {
			cache[ jQuery.camelCase( data ) ] = value;

		// Handle: [ owner, { properties } ] args
		} else {

			// Copy the properties one-by-one to the cache object
			for ( prop in data ) {
				cache[ jQuery.camelCase( prop ) ] = data[ prop ];
			}
		}
		return cache;
	},
	get: function( owner, key ) {
		return key === undefined ?
			this.cache( owner ) :

			// Always use camelCase key (gh-2257)
			owner[ this.expando ] && owner[ this.expando ][ jQuery.camelCase( key ) ];
	},
	access: function( owner, key, value ) {

		// In cases where either:
		//
		//   1. No key was specified
		//   2. A string key was specified, but no value provided
		//
		// Take the "read" path and allow the get method to determine
		// which value to return, respectively either:
		//
		//   1. The entire cache object
		//   2. The data stored at the key
		//
		if ( key === undefined ||
				( ( key && typeof key === "string" ) && value === undefined ) ) {

			return this.get( owner, key );
		}

		// When the key is not a string, or both a key and value
		// are specified, set or extend (existing objects) with either:
		//
		//   1. An object of properties
		//   2. A key and value
		//
		this.set( owner, key, value );

		// Since the "set" path can have two possible entry points
		// return the expected data based on which path was taken[*]
		return value !== undefined ? value : key;
	},
	remove: function( owner, key ) {
		var i,
			cache = owner[ this.expando ];

		if ( cache === undefined ) {
			return;
		}

		if ( key !== undefined ) {

			// Support array or space separated string of keys
			if ( Array.isArray( key ) ) {

				// If key is an array of keys...
				// We always set camelCase keys, so remove that.
				key = key.map( jQuery.camelCase );
			} else {
				key = jQuery.camelCase( key );

				// If a key with the spaces exists, use it.
				// Otherwise, create an array by matching non-whitespace
				key = key in cache ?
					[ key ] :
					( key.match( rnothtmlwhite ) || [] );
			}

			i = key.length;

			while ( i-- ) {
				delete cache[ key[ i ] ];
			}
		}

		// Remove the expando if there's no more data
		if ( key === undefined || jQuery.isEmptyObject( cache ) ) {

			// Support: Chrome <=35 - 45
			// Webkit & Blink performance suffers when deleting properties
			// from DOM nodes, so set to undefined instead
			// https://bugs.chromium.org/p/chromium/issues/detail?id=378607 (bug restricted)
			if ( owner.nodeType ) {
				owner[ this.expando ] = undefined;
			} else {
				delete owner[ this.expando ];
			}
		}
	},
	hasData: function( owner ) {
		var cache = owner[ this.expando ];
		return cache !== undefined && !jQuery.isEmptyObject( cache );
	}
};
var dataPriv = new Data();

var dataUser = new Data();



//	Implementation Summary
//
//	1. Enforce API surface and semantic compatibility with 1.9.x branch
//	2. Improve the module's maintainability by reducing the storage
//		paths to a single mechanism.
//	3. Use the same single mechanism to support "private" and "user" data.
//	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
//	5. Avoid exposing implementation details on user objects (eg. expando properties)
//	6. Provide a clear path for implementation upgrade to WeakMap in 2014

var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
	rmultiDash = /[A-Z]/g;

function getData( data ) {
	if ( data === "true" ) {
		return true;
	}

	if ( data === "false" ) {
		return false;
	}

	if ( data === "null" ) {
		return null;
	}

	// Only convert to a number if it doesn't change the string
	if ( data === +data + "" ) {
		return +data;
	}

	if ( rbrace.test( data ) ) {
		return JSON.parse( data );
	}

	return data;
}

function dataAttr( elem, key, data ) {
	var name;

	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {
		name = "data-" + key.replace( rmultiDash, "-$&" ).toLowerCase();
		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = getData( data );
			} catch ( e ) {}

			// Make sure we set the data so it isn't changed later
			dataUser.set( elem, key, data );
		} else {
			data = undefined;
		}
	}
	return data;
}

jQuery.extend( {
	hasData: function( elem ) {
		return dataUser.hasData( elem ) || dataPriv.hasData( elem );
	},

	data: function( elem, name, data ) {
		return dataUser.access( elem, name, data );
	},

	removeData: function( elem, name ) {
		dataUser.remove( elem, name );
	},

	// TODO: Now that all calls to _data and _removeData have been replaced
	// with direct calls to dataPriv methods, these can be deprecated.
	_data: function( elem, name, data ) {
		return dataPriv.access( elem, name, data );
	},

	_removeData: function( elem, name ) {
		dataPriv.remove( elem, name );
	}
} );

jQuery.fn.extend( {
	data: function( key, value ) {
		var i, name, data,
			elem = this[ 0 ],
			attrs = elem && elem.attributes;

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = dataUser.get( elem );

				if ( elem.nodeType === 1 && !dataPriv.get( elem, "hasDataAttrs" ) ) {
					i = attrs.length;
					while ( i-- ) {

						// Support: IE 11 only
						// The attrs elements can be null (#14894)
						if ( attrs[ i ] ) {
							name = attrs[ i ].name;
							if ( name.indexOf( "data-" ) === 0 ) {
								name = jQuery.camelCase( name.slice( 5 ) );
								dataAttr( elem, name, data[ name ] );
							}
						}
					}
					dataPriv.set( elem, "hasDataAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each( function() {
				dataUser.set( this, key );
			} );
		}

		return access( this, function( value ) {
			var data;

			// The calling jQuery object (element matches) is not empty
			// (and therefore has an element appears at this[ 0 ]) and the
			// `value` parameter was not undefined. An empty jQuery object
			// will result in `undefined` for elem = this[ 0 ] which will
			// throw an exception if an attempt to read a data cache is made.
			if ( elem && value === undefined ) {

				// Attempt to get data from the cache
				// The key will always be camelCased in Data
				data = dataUser.get( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// Attempt to "discover" the data in
				// HTML5 custom data-* attrs
				data = dataAttr( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// We tried really hard, but the data doesn't exist.
				return;
			}

			// Set the data...
			this.each( function() {

				// We always store the camelCased key
				dataUser.set( this, key, value );
			} );
		}, null, value, arguments.length > 1, null, true );
	},

	removeData: function( key ) {
		return this.each( function() {
			dataUser.remove( this, key );
		} );
	}
} );


jQuery.extend( {
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = dataPriv.get( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || Array.isArray( data ) ) {
					queue = dataPriv.access( elem, type, jQuery.makeArray( data ) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// Clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// Not public - generate a queueHooks object, or return the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return dataPriv.get( elem, key ) || dataPriv.access( elem, key, {
			empty: jQuery.Callbacks( "once memory" ).add( function() {
				dataPriv.remove( elem, [ type + "queue", key ] );
			} )
		} );
	}
} );

jQuery.fn.extend( {
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[ 0 ], type );
		}

		return data === undefined ?
			this :
			this.each( function() {
				var queue = jQuery.queue( this, type, data );

				// Ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[ 0 ] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			} );
	},
	dequeue: function( type ) {
		return this.each( function() {
			jQuery.dequeue( this, type );
		} );
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},

	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while ( i-- ) {
			tmp = dataPriv.get( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
} );
var pnum = ( /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/ ).source;

var rcssNum = new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" );


var cssExpand = [ "Top", "Right", "Bottom", "Left" ];

var isHiddenWithinTree = function( elem, el ) {

		// isHiddenWithinTree might be called from jQuery#filter function;
		// in that case, element will be second argument
		elem = el || elem;

		// Inline style trumps all
		return elem.style.display === "none" ||
			elem.style.display === "" &&

			// Otherwise, check computed style
			// Support: Firefox <=43 - 45
			// Disconnected elements can have computed display: none, so first confirm that elem is
			// in the document.
			jQuery.contains( elem.ownerDocument, elem ) &&

			jQuery.css( elem, "display" ) === "none";
	};

var swap = function( elem, options, callback, args ) {
	var ret, name,
		old = {};

	// Remember the old values, and insert the new ones
	for ( name in options ) {
		old[ name ] = elem.style[ name ];
		elem.style[ name ] = options[ name ];
	}

	ret = callback.apply( elem, args || [] );

	// Revert the old values
	for ( name in options ) {
		elem.style[ name ] = old[ name ];
	}

	return ret;
};




function adjustCSS( elem, prop, valueParts, tween ) {
	var adjusted,
		scale = 1,
		maxIterations = 20,
		currentValue = tween ?
			function() {
				return tween.cur();
			} :
			function() {
				return jQuery.css( elem, prop, "" );
			},
		initial = currentValue(),
		unit = valueParts && valueParts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

		// Starting value computation is required for potential unit mismatches
		initialInUnit = ( jQuery.cssNumber[ prop ] || unit !== "px" && +initial ) &&
			rcssNum.exec( jQuery.css( elem, prop ) );

	if ( initialInUnit && initialInUnit[ 3 ] !== unit ) {

		// Trust units reported by jQuery.css
		unit = unit || initialInUnit[ 3 ];

		// Make sure we update the tween properties later on
		valueParts = valueParts || [];

		// Iteratively approximate from a nonzero starting point
		initialInUnit = +initial || 1;

		do {

			// If previous iteration zeroed out, double until we get *something*.
			// Use string for doubling so we don't accidentally see scale as unchanged below
			scale = scale || ".5";

			// Adjust and apply
			initialInUnit = initialInUnit / scale;
			jQuery.style( elem, prop, initialInUnit + unit );

		// Update scale, tolerating zero or NaN from tween.cur()
		// Break the loop if scale is unchanged or perfect, or if we've just had enough.
		} while (
			scale !== ( scale = currentValue() / initial ) && scale !== 1 && --maxIterations
		);
	}

	if ( valueParts ) {
		initialInUnit = +initialInUnit || +initial || 0;

		// Apply relative offset (+=/-=) if specified
		adjusted = valueParts[ 1 ] ?
			initialInUnit + ( valueParts[ 1 ] + 1 ) * valueParts[ 2 ] :
			+valueParts[ 2 ];
		if ( tween ) {
			tween.unit = unit;
			tween.start = initialInUnit;
			tween.end = adjusted;
		}
	}
	return adjusted;
}


var defaultDisplayMap = {};

function getDefaultDisplay( elem ) {
	var temp,
		doc = elem.ownerDocument,
		nodeName = elem.nodeName,
		display = defaultDisplayMap[ nodeName ];

	if ( display ) {
		return display;
	}

	temp = doc.body.appendChild( doc.createElement( nodeName ) );
	display = jQuery.css( temp, "display" );

	temp.parentNode.removeChild( temp );

	if ( display === "none" ) {
		display = "block";
	}
	defaultDisplayMap[ nodeName ] = display;

	return display;
}

function showHide( elements, show ) {
	var display, elem,
		values = [],
		index = 0,
		length = elements.length;

	// Determine new display value for elements that need to change
	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		display = elem.style.display;
		if ( show ) {

			// Since we force visibility upon cascade-hidden elements, an immediate (and slow)
			// check is required in this first loop unless we have a nonempty display value (either
			// inline or about-to-be-restored)
			if ( display === "none" ) {
				values[ index ] = dataPriv.get( elem, "display" ) || null;
				if ( !values[ index ] ) {
					elem.style.display = "";
				}
			}
			if ( elem.style.display === "" && isHiddenWithinTree( elem ) ) {
				values[ index ] = getDefaultDisplay( elem );
			}
		} else {
			if ( display !== "none" ) {
				values[ index ] = "none";

				// Remember what we're overwriting
				dataPriv.set( elem, "display", display );
			}
		}
	}

	// Set the display of the elements in a second loop to avoid constant reflow
	for ( index = 0; index < length; index++ ) {
		if ( values[ index ] != null ) {
			elements[ index ].style.display = values[ index ];
		}
	}

	return elements;
}

jQuery.fn.extend( {
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each( function() {
			if ( isHiddenWithinTree( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		} );
	}
} );
var rcheckableType = ( /^(?:checkbox|radio)$/i );

var rtagName = ( /<([a-z][^\/\0>\x20\t\r\n\f]+)/i );

var rscriptType = ( /^$|\/(?:java|ecma)script/i );



// We have to close these tags to support XHTML (#13200)
var wrapMap = {

	// Support: IE <=9 only
	option: [ 1, "<select multiple='multiple'>", "</select>" ],

	// XHTML parsers do not magically insert elements in the
	// same way that tag soup parsers do. So we cannot shorten
	// this by omitting <tbody> or other required elements.
	thead: [ 1, "<table>", "</table>" ],
	col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
	tr: [ 2, "<table><tbody>", "</tbody></table>" ],
	td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

	_default: [ 0, "", "" ]
};

// Support: IE <=9 only
wrapMap.optgroup = wrapMap.option;

wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;


function getAll( context, tag ) {

	// Support: IE <=9 - 11 only
	// Use typeof to avoid zero-argument method invocation on host objects (#15151)
	var ret;

	if ( typeof context.getElementsByTagName !== "undefined" ) {
		ret = context.getElementsByTagName( tag || "*" );

	} else if ( typeof context.querySelectorAll !== "undefined" ) {
		ret = context.querySelectorAll( tag || "*" );

	} else {
		ret = [];
	}

	if ( tag === undefined || tag && nodeName( context, tag ) ) {
		return jQuery.merge( [ context ], ret );
	}

	return ret;
}


// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		dataPriv.set(
			elems[ i ],
			"globalEval",
			!refElements || dataPriv.get( refElements[ i ], "globalEval" )
		);
	}
}


var rhtml = /<|&#?\w+;/;

function buildFragment( elems, context, scripts, selection, ignored ) {
	var elem, tmp, tag, wrap, contains, j,
		fragment = context.createDocumentFragment(),
		nodes = [],
		i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		elem = elems[ i ];

		if ( elem || elem === 0 ) {

			// Add nodes directly
			if ( jQuery.type( elem ) === "object" ) {

				// Support: Android <=4.0 only, PhantomJS 1 only
				// push.apply(_, arraylike) throws on ancient WebKit
				jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

			// Convert non-html into a text node
			} else if ( !rhtml.test( elem ) ) {
				nodes.push( context.createTextNode( elem ) );

			// Convert html into DOM nodes
			} else {
				tmp = tmp || fragment.appendChild( context.createElement( "div" ) );

				// Deserialize a standard representation
				tag = ( rtagName.exec( elem ) || [ "", "" ] )[ 1 ].toLowerCase();
				wrap = wrapMap[ tag ] || wrapMap._default;
				tmp.innerHTML = wrap[ 1 ] + jQuery.htmlPrefilter( elem ) + wrap[ 2 ];

				// Descend through wrappers to the right content
				j = wrap[ 0 ];
				while ( j-- ) {
					tmp = tmp.lastChild;
				}

				// Support: Android <=4.0 only, PhantomJS 1 only
				// push.apply(_, arraylike) throws on ancient WebKit
				jQuery.merge( nodes, tmp.childNodes );

				// Remember the top-level container
				tmp = fragment.firstChild;

				// Ensure the created nodes are orphaned (#12392)
				tmp.textContent = "";
			}
		}
	}

	// Remove wrapper from fragment
	fragment.textContent = "";

	i = 0;
	while ( ( elem = nodes[ i++ ] ) ) {

		// Skip elements already in the context collection (trac-4087)
		if ( selection && jQuery.inArray( elem, selection ) > -1 ) {
			if ( ignored ) {
				ignored.push( elem );
			}
			continue;
		}

		contains = jQuery.contains( elem.ownerDocument, elem );

		// Append to fragment
		tmp = getAll( fragment.appendChild( elem ), "script" );

		// Preserve script evaluation history
		if ( contains ) {
			setGlobalEval( tmp );
		}

		// Capture executables
		if ( scripts ) {
			j = 0;
			while ( ( elem = tmp[ j++ ] ) ) {
				if ( rscriptType.test( elem.type || "" ) ) {
					scripts.push( elem );
				}
			}
		}
	}

	return fragment;
}


( function() {
	var fragment = document.createDocumentFragment(),
		div = fragment.appendChild( document.createElement( "div" ) ),
		input = document.createElement( "input" );

	// Support: Android 4.0 - 4.3 only
	// Check state lost if the name is set (#11217)
	// Support: Windows Web Apps (WWA)
	// `name` and `type` must use .setAttribute for WWA (#14901)
	input.setAttribute( "type", "radio" );
	input.setAttribute( "checked", "checked" );
	input.setAttribute( "name", "t" );

	div.appendChild( input );

	// Support: Android <=4.1 only
	// Older WebKit doesn't clone checked state correctly in fragments
	support.checkClone = div.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE <=11 only
	// Make sure textarea (and checkbox) defaultValue is properly cloned
	div.innerHTML = "<textarea>x</textarea>";
	support.noCloneChecked = !!div.cloneNode( true ).lastChild.defaultValue;
} )();
var documentElement = document.documentElement;



var
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

// Support: IE <=9 only
// See #13393 for more info
function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

function on( elem, types, selector, data, fn, one ) {
	var origFn, type;

	// Types can be a map of types/handlers
	if ( typeof types === "object" ) {

		// ( types-Object, selector, data )
		if ( typeof selector !== "string" ) {

			// ( types-Object, data )
			data = data || selector;
			selector = undefined;
		}
		for ( type in types ) {
			on( elem, type, selector, data, types[ type ], one );
		}
		return elem;
	}

	if ( data == null && fn == null ) {

		// ( types, fn )
		fn = selector;
		data = selector = undefined;
	} else if ( fn == null ) {
		if ( typeof selector === "string" ) {

			// ( types, selector, fn )
			fn = data;
			data = undefined;
		} else {

			// ( types, data, fn )
			fn = data;
			data = selector;
			selector = undefined;
		}
	}
	if ( fn === false ) {
		fn = returnFalse;
	} else if ( !fn ) {
		return elem;
	}

	if ( one === 1 ) {
		origFn = fn;
		fn = function( event ) {

			// Can use an empty set, since event contains the info
			jQuery().off( event );
			return origFn.apply( this, arguments );
		};

		// Use same guid so caller can remove using origFn
		fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
	}
	return elem.each( function() {
		jQuery.event.add( this, types, fn, data, selector );
	} );
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {

		var handleObjIn, eventHandle, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.get( elem );

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Ensure that invalid selectors throw exceptions at attach time
		// Evaluate against documentElement in case elem is a non-element node (e.g., document)
		if ( selector ) {
			jQuery.find.matchesSelector( documentElement, selector );
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !( events = elemData.events ) ) {
			events = elemData.events = {};
		}
		if ( !( eventHandle = elemData.handle ) ) {
			eventHandle = elemData.handle = function( e ) {

				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== "undefined" && jQuery.event.triggered !== e.type ?
					jQuery.event.dispatch.apply( elem, arguments ) : undefined;
			};
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend( {
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join( "." )
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !( handlers = events[ type ] ) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener if the special events handler returns false
				if ( !special.setup ||
					special.setup.call( elem, data, namespaces, eventHandle ) === false ) {

					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {

		var j, origCount, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.hasData( elem ) && dataPriv.get( elem );

		if ( !elemData || !( events = elemData.events ) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[ 2 ] &&
				new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector ||
						selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown ||
					special.teardown.call( elem, namespaces, elemData.handle ) === false ) {

					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove data and the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			dataPriv.remove( elem, "handle events" );
		}
	},

	dispatch: function( nativeEvent ) {

		// Make a writable jQuery.Event from the native event object
		var event = jQuery.event.fix( nativeEvent );

		var i, j, ret, matched, handleObj, handlerQueue,
			args = new Array( arguments.length ),
			handlers = ( dataPriv.get( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[ 0 ] = event;

		for ( i = 1; i < arguments.length; i++ ) {
			args[ i ] = arguments[ i ];
		}

		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( ( matched = handlerQueue[ i++ ] ) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( ( handleObj = matched.handlers[ j++ ] ) &&
				!event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or 2) have namespace(s)
				// a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.rnamespace || event.rnamespace.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( ( jQuery.event.special[ handleObj.origType ] || {} ).handle ||
						handleObj.handler ).apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( ( event.result = ret ) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var i, handleObj, sel, matchedHandlers, matchedSelectors,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		if ( delegateCount &&

			// Support: IE <=9
			// Black-hole SVG <use> instance trees (trac-13180)
			cur.nodeType &&

			// Support: Firefox <=42
			// Suppress spec-violating clicks indicating a non-primary pointer button (trac-3861)
			// https://www.w3.org/TR/DOM-Level-3-Events/#event-type-click
			// Support: IE 11 only
			// ...but not arrow key "clicks" of radio inputs, which can have `button` -1 (gh-2343)
			!( event.type === "click" && event.button >= 1 ) ) {

			for ( ; cur !== this; cur = cur.parentNode || this ) {

				// Don't check non-elements (#13208)
				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.nodeType === 1 && !( event.type === "click" && cur.disabled === true ) ) {
					matchedHandlers = [];
					matchedSelectors = {};
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matchedSelectors[ sel ] === undefined ) {
							matchedSelectors[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) > -1 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matchedSelectors[ sel ] ) {
							matchedHandlers.push( handleObj );
						}
					}
					if ( matchedHandlers.length ) {
						handlerQueue.push( { elem: cur, handlers: matchedHandlers } );
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		cur = this;
		if ( delegateCount < handlers.length ) {
			handlerQueue.push( { elem: cur, handlers: handlers.slice( delegateCount ) } );
		}

		return handlerQueue;
	},

	addProp: function( name, hook ) {
		Object.defineProperty( jQuery.Event.prototype, name, {
			enumerable: true,
			configurable: true,

			get: jQuery.isFunction( hook ) ?
				function() {
					if ( this.originalEvent ) {
							return hook( this.originalEvent );
					}
				} :
				function() {
					if ( this.originalEvent ) {
							return this.originalEvent[ name ];
					}
				},

			set: function( value ) {
				Object.defineProperty( this, name, {
					enumerable: true,
					configurable: true,
					writable: true,
					value: value
				} );
			}
		} );
	},

	fix: function( originalEvent ) {
		return originalEvent[ jQuery.expando ] ?
			originalEvent :
			new jQuery.Event( originalEvent );
	},

	special: {
		load: {

			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		focus: {

			// Fire native event if possible so blur/focus sequence is correct
			trigger: function() {
				if ( this !== safeActiveElement() && this.focus ) {
					this.focus();
					return false;
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === safeActiveElement() && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},
		click: {

			// For checkbox, fire native event so checked state will be right
			trigger: function() {
				if ( this.type === "checkbox" && this.click && nodeName( this, "input" ) ) {
					this.click();
					return false;
				}
			},

			// For cross-browser consistency, don't fire native .click() on links
			_default: function( event ) {
				return nodeName( event.target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Support: Firefox 20+
				// Firefox doesn't alert if the returnValue field is not set.
				if ( event.result !== undefined && event.originalEvent ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	}
};

jQuery.removeEvent = function( elem, type, handle ) {

	// This "if" is needed for plain objects
	if ( elem.removeEventListener ) {
		elem.removeEventListener( type, handle );
	}
};

jQuery.Event = function( src, props ) {

	// Allow instantiation without the 'new' keyword
	if ( !( this instanceof jQuery.Event ) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = src.defaultPrevented ||
				src.defaultPrevented === undefined &&

				// Support: Android <=2.3 only
				src.returnValue === false ?
			returnTrue :
			returnFalse;

		// Create target properties
		// Support: Safari <=6 - 7 only
		// Target should not be a text node (#504, #13143)
		this.target = ( src.target && src.target.nodeType === 3 ) ?
			src.target.parentNode :
			src.target;

		this.currentTarget = src.currentTarget;
		this.relatedTarget = src.relatedTarget;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// https://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	constructor: jQuery.Event,
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,
	isSimulated: false,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;

		if ( e && !this.isSimulated ) {
			e.preventDefault();
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;

		if ( e && !this.isSimulated ) {
			e.stopPropagation();
		}
	},
	stopImmediatePropagation: function() {
		var e = this.originalEvent;

		this.isImmediatePropagationStopped = returnTrue;

		if ( e && !this.isSimulated ) {
			e.stopImmediatePropagation();
		}

		this.stopPropagation();
	}
};

// Includes all common event props including KeyEvent and MouseEvent specific props
jQuery.each( {
	altKey: true,
	bubbles: true,
	cancelable: true,
	changedTouches: true,
	ctrlKey: true,
	detail: true,
	eventPhase: true,
	metaKey: true,
	pageX: true,
	pageY: true,
	shiftKey: true,
	view: true,
	"char": true,
	charCode: true,
	key: true,
	keyCode: true,
	button: true,
	buttons: true,
	clientX: true,
	clientY: true,
	offsetX: true,
	offsetY: true,
	pointerId: true,
	pointerType: true,
	screenX: true,
	screenY: true,
	targetTouches: true,
	toElement: true,
	touches: true,

	which: function( event ) {
		var button = event.button;

		// Add which for key events
		if ( event.which == null && rkeyEvent.test( event.type ) ) {
			return event.charCode != null ? event.charCode : event.keyCode;
		}

		// Add which for click: 1 === left; 2 === middle; 3 === right
		if ( !event.which && button !== undefined && rmouseEvent.test( event.type ) ) {
			if ( button & 1 ) {
				return 1;
			}

			if ( button & 2 ) {
				return 3;
			}

			if ( button & 4 ) {
				return 2;
			}

			return 0;
		}

		return event.which;
	}
}, jQuery.event.addProp );

// Create mouseenter/leave events using mouseover/out and event-time checks
// so that event delegation works in jQuery.
// Do the same for pointerenter/pointerleave and pointerover/pointerout
//
// Support: Safari 7 only
// Safari sends mouseenter too often; see:
// https://bugs.chromium.org/p/chromium/issues/detail?id=470258
// for the description of the bug (it existed in older Chrome versions as well).
jQuery.each( {
	mouseenter: "mouseover",
	mouseleave: "mouseout",
	pointerenter: "pointerover",
	pointerleave: "pointerout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mouseenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || ( related !== target && !jQuery.contains( target, related ) ) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
} );

jQuery.fn.extend( {

	on: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn );
	},
	one: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {

			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ?
					handleObj.origType + "." + handleObj.namespace :
					handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {

			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {

			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each( function() {
			jQuery.event.remove( this, types, fn, selector );
		} );
	}
} );


var

	/* eslint-disable max-len */

	// See https://github.com/eslint/eslint/issues/3229
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi,

	/* eslint-enable */

	// Support: IE <=10 - 11, Edge 12 - 13
	// In IE/Edge using regex groups here causes severe slowdowns.
	// See https://connect.microsoft.com/IE/feedback/details/1736512/
	rnoInnerhtml = /<script|<style|<link/i,

	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptTypeMasked = /^true\/(.*)/,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;

// Prefer a tbody over its parent table for containing new rows
function manipulationTarget( elem, content ) {
	if ( nodeName( elem, "table" ) &&
		nodeName( content.nodeType !== 11 ? content : content.firstChild, "tr" ) ) {

		return jQuery( ">tbody", elem )[ 0 ] || elem;
	}

	return elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = ( elem.getAttribute( "type" ) !== null ) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	var match = rscriptTypeMasked.exec( elem.type );

	if ( match ) {
		elem.type = match[ 1 ];
	} else {
		elem.removeAttribute( "type" );
	}

	return elem;
}

function cloneCopyEvent( src, dest ) {
	var i, l, type, pdataOld, pdataCur, udataOld, udataCur, events;

	if ( dest.nodeType !== 1 ) {
		return;
	}

	// 1. Copy private data: events, handlers, etc.
	if ( dataPriv.hasData( src ) ) {
		pdataOld = dataPriv.access( src );
		pdataCur = dataPriv.set( dest, pdataOld );
		events = pdataOld.events;

		if ( events ) {
			delete pdataCur.handle;
			pdataCur.events = {};

			for ( type in events ) {
				for ( i = 0, l = events[ type ].length; i < l; i++ ) {
					jQuery.event.add( dest, type, events[ type ][ i ] );
				}
			}
		}
	}

	// 2. Copy user data
	if ( dataUser.hasData( src ) ) {
		udataOld = dataUser.access( src );
		udataCur = jQuery.extend( {}, udataOld );

		dataUser.set( dest, udataCur );
	}
}

// Fix IE bugs, see support tests
function fixInput( src, dest ) {
	var nodeName = dest.nodeName.toLowerCase();

	// Fails to persist the checked state of a cloned checkbox or radio button.
	if ( nodeName === "input" && rcheckableType.test( src.type ) ) {
		dest.checked = src.checked;

	// Fails to return the selected option to the default selected state when cloning options
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

function domManip( collection, args, callback, ignored ) {

	// Flatten any nested arrays
	args = concat.apply( [], args );

	var fragment, first, scripts, hasScripts, node, doc,
		i = 0,
		l = collection.length,
		iNoClone = l - 1,
		value = args[ 0 ],
		isFunction = jQuery.isFunction( value );

	// We can't cloneNode fragments that contain checked, in WebKit
	if ( isFunction ||
			( l > 1 && typeof value === "string" &&
				!support.checkClone && rchecked.test( value ) ) ) {
		return collection.each( function( index ) {
			var self = collection.eq( index );
			if ( isFunction ) {
				args[ 0 ] = value.call( this, index, self.html() );
			}
			domManip( self, args, callback, ignored );
		} );
	}

	if ( l ) {
		fragment = buildFragment( args, collection[ 0 ].ownerDocument, false, collection, ignored );
		first = fragment.firstChild;

		if ( fragment.childNodes.length === 1 ) {
			fragment = first;
		}

		// Require either new content or an interest in ignored elements to invoke the callback
		if ( first || ignored ) {
			scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
			hasScripts = scripts.length;

			// Use the original fragment for the last item
			// instead of the first because it can end up
			// being emptied incorrectly in certain situations (#8070).
			for ( ; i < l; i++ ) {
				node = fragment;

				if ( i !== iNoClone ) {
					node = jQuery.clone( node, true, true );

					// Keep references to cloned scripts for later restoration
					if ( hasScripts ) {

						// Support: Android <=4.0 only, PhantomJS 1 only
						// push.apply(_, arraylike) throws on ancient WebKit
						jQuery.merge( scripts, getAll( node, "script" ) );
					}
				}

				callback.call( collection[ i ], node, i );
			}

			if ( hasScripts ) {
				doc = scripts[ scripts.length - 1 ].ownerDocument;

				// Reenable scripts
				jQuery.map( scripts, restoreScript );

				// Evaluate executable scripts on first document insertion
				for ( i = 0; i < hasScripts; i++ ) {
					node = scripts[ i ];
					if ( rscriptType.test( node.type || "" ) &&
						!dataPriv.access( node, "globalEval" ) &&
						jQuery.contains( doc, node ) ) {

						if ( node.src ) {

							// Optional AJAX dependency, but won't run scripts if not present
							if ( jQuery._evalUrl ) {
								jQuery._evalUrl( node.src );
							}
						} else {
							DOMEval( node.textContent.replace( rcleanScript, "" ), doc );
						}
					}
				}
			}
		}
	}

	return collection;
}

function remove( elem, selector, keepData ) {
	var node,
		nodes = selector ? jQuery.filter( selector, elem ) : elem,
		i = 0;

	for ( ; ( node = nodes[ i ] ) != null; i++ ) {
		if ( !keepData && node.nodeType === 1 ) {
			jQuery.cleanData( getAll( node ) );
		}

		if ( node.parentNode ) {
			if ( keepData && jQuery.contains( node.ownerDocument, node ) ) {
				setGlobalEval( getAll( node, "script" ) );
			}
			node.parentNode.removeChild( node );
		}
	}

	return elem;
}

jQuery.extend( {
	htmlPrefilter: function( html ) {
		return html.replace( rxhtmlTag, "<$1></$2>" );
	},

	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var i, l, srcElements, destElements,
			clone = elem.cloneNode( true ),
			inPage = jQuery.contains( elem.ownerDocument, elem );

		// Fix IE cloning issues
		if ( !support.noCloneChecked && ( elem.nodeType === 1 || elem.nodeType === 11 ) &&
				!jQuery.isXMLDoc( elem ) ) {

			// We eschew Sizzle here for performance reasons: https://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			for ( i = 0, l = srcElements.length; i < l; i++ ) {
				fixInput( srcElements[ i ], destElements[ i ] );
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0, l = srcElements.length; i < l; i++ ) {
					cloneCopyEvent( srcElements[ i ], destElements[ i ] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		// Return the cloned set
		return clone;
	},

	cleanData: function( elems ) {
		var data, elem, type,
			special = jQuery.event.special,
			i = 0;

		for ( ; ( elem = elems[ i ] ) !== undefined; i++ ) {
			if ( acceptData( elem ) ) {
				if ( ( data = elem[ dataPriv.expando ] ) ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Support: Chrome <=35 - 45+
					// Assign undefined instead of using delete, see Data#remove
					elem[ dataPriv.expando ] = undefined;
				}
				if ( elem[ dataUser.expando ] ) {

					// Support: Chrome <=35 - 45+
					// Assign undefined instead of using delete, see Data#remove
					elem[ dataUser.expando ] = undefined;
				}
			}
		}
	}
} );

jQuery.fn.extend( {
	detach: function( selector ) {
		return remove( this, selector, true );
	},

	remove: function( selector ) {
		return remove( this, selector );
	},

	text: function( value ) {
		return access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().each( function() {
					if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
						this.textContent = value;
					}
				} );
		}, null, value, arguments.length );
	},

	append: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		} );
	},

	prepend: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		} );
	},

	before: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		} );
	},

	after: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		} );
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; ( elem = this[ i ] ) != null; i++ ) {
			if ( elem.nodeType === 1 ) {

				// Prevent memory leaks
				jQuery.cleanData( getAll( elem, false ) );

				// Remove any remaining nodes
				elem.textContent = "";
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function() {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		} );
	},

	html: function( value ) {
		return access( this, function( value ) {
			var elem = this[ 0 ] || {},
				i = 0,
				l = this.length;

			if ( value === undefined && elem.nodeType === 1 ) {
				return elem.innerHTML;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				!wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {

				value = jQuery.htmlPrefilter( value );

				try {
					for ( ; i < l; i++ ) {
						elem = this[ i ] || {};

						// Remove element nodes and prevent memory leaks
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch ( e ) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var ignored = [];

		// Make the changes, replacing each non-ignored context element with the new content
		return domManip( this, arguments, function( elem ) {
			var parent = this.parentNode;

			if ( jQuery.inArray( this, ignored ) < 0 ) {
				jQuery.cleanData( getAll( this ) );
				if ( parent ) {
					parent.replaceChild( elem, this );
				}
			}

		// Force callback invocation
		}, ignored );
	}
} );

jQuery.each( {
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1,
			i = 0;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone( true );
			jQuery( insert[ i ] )[ original ]( elems );

			// Support: Android <=4.0 only, PhantomJS 1 only
			// .get() because push.apply(_, arraylike) throws on ancient WebKit
			push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
} );
var rmargin = ( /^margin/ );

var rnumnonpx = new RegExp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );

var getStyles = function( elem ) {

		// Support: IE <=11 only, Firefox <=30 (#15098, #14150)
		// IE throws on elements created in popups
		// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
		var view = elem.ownerDocument.defaultView;

		if ( !view || !view.opener ) {
			view = window;
		}

		return view.getComputedStyle( elem );
	};



( function() {

	// Executing both pixelPosition & boxSizingReliable tests require only one layout
	// so they're executed at the same time to save the second computation.
	function computeStyleTests() {

		// This is a singleton, we need to execute it only once
		if ( !div ) {
			return;
		}

		div.style.cssText =
			"box-sizing:border-box;" +
			"position:relative;display:block;" +
			"margin:auto;border:1px;padding:1px;" +
			"top:1%;width:50%";
		div.innerHTML = "";
		documentElement.appendChild( container );

		var divStyle = window.getComputedStyle( div );
		pixelPositionVal = divStyle.top !== "1%";

		// Support: Android 4.0 - 4.3 only, Firefox <=3 - 44
		reliableMarginLeftVal = divStyle.marginLeft === "2px";
		boxSizingReliableVal = divStyle.width === "4px";

		// Support: Android 4.0 - 4.3 only
		// Some styles come back with percentage values, even though they shouldn't
		div.style.marginRight = "50%";
		pixelMarginRightVal = divStyle.marginRight === "4px";

		documentElement.removeChild( container );

		// Nullify the div so it wouldn't be stored in the memory and
		// it will also be a sign that checks already performed
		div = null;
	}

	var pixelPositionVal, boxSizingReliableVal, pixelMarginRightVal, reliableMarginLeftVal,
		container = document.createElement( "div" ),
		div = document.createElement( "div" );

	// Finish early in limited (non-browser) environments
	if ( !div.style ) {
		return;
	}

	// Support: IE <=9 - 11 only
	// Style of cloned element affects source element cloned (#8908)
	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	container.style.cssText = "border:0;width:8px;height:0;top:0;left:-9999px;" +
		"padding:0;margin-top:1px;position:absolute";
	container.appendChild( div );

	jQuery.extend( support, {
		pixelPosition: function() {
			computeStyleTests();
			return pixelPositionVal;
		},
		boxSizingReliable: function() {
			computeStyleTests();
			return boxSizingReliableVal;
		},
		pixelMarginRight: function() {
			computeStyleTests();
			return pixelMarginRightVal;
		},
		reliableMarginLeft: function() {
			computeStyleTests();
			return reliableMarginLeftVal;
		}
	} );
} )();


function curCSS( elem, name, computed ) {
	var width, minWidth, maxWidth, ret,

		// Support: Firefox 51+
		// Retrieving style before computed somehow
		// fixes an issue with getting wrong values
		// on detached elements
		style = elem.style;

	computed = computed || getStyles( elem );

	// getPropertyValue is needed for:
	//   .css('filter') (IE 9 only, #12537)
	//   .css('--customProperty) (#3144)
	if ( computed ) {
		ret = computed.getPropertyValue( name ) || computed[ name ];

		if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
			ret = jQuery.style( elem, name );
		}

		// A tribute to the "awesome hack by Dean Edwards"
		// Android Browser returns percentage for some values,
		// but width seems to be reliably pixels.
		// This is against the CSSOM draft spec:
		// https://drafts.csswg.org/cssom/#resolved-values
		if ( !support.pixelMarginRight() && rnumnonpx.test( ret ) && rmargin.test( name ) ) {

			// Remember the original values
			width = style.width;
			minWidth = style.minWidth;
			maxWidth = style.maxWidth;

			// Put in the new values to get a computed value out
			style.minWidth = style.maxWidth = style.width = ret;
			ret = computed.width;

			// Revert the changed values
			style.width = width;
			style.minWidth = minWidth;
			style.maxWidth = maxWidth;
		}
	}

	return ret !== undefined ?

		// Support: IE <=9 - 11 only
		// IE returns zIndex value as an integer.
		ret + "" :
		ret;
}


function addGetHookIf( conditionFn, hookFn ) {

	// Define the hook, we'll check on the first run if it's really needed.
	return {
		get: function() {
			if ( conditionFn() ) {

				// Hook not needed (or it's not possible to use it due
				// to missing dependency), remove it.
				delete this.get;
				return;
			}

			// Hook needed; redefine it so that the support test is not executed again.
			return ( this.get = hookFn ).apply( this, arguments );
		}
	};
}


var

	// Swappable if display is none or starts with table
	// except "table", "table-cell", or "table-caption"
	// See here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rcustomProp = /^--/,
	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: "0",
		fontWeight: "400"
	},

	cssPrefixes = [ "Webkit", "Moz", "ms" ],
	emptyStyle = document.createElement( "div" ).style;

// Return a css property mapped to a potentially vendor prefixed property
function vendorPropName( name ) {

	// Shortcut for names that are not vendor prefixed
	if ( name in emptyStyle ) {
		return name;
	}

	// Check for vendor prefixed names
	var capName = name[ 0 ].toUpperCase() + name.slice( 1 ),
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in emptyStyle ) {
			return name;
		}
	}
}

// Return a property mapped along what jQuery.cssProps suggests or to
// a vendor prefixed property.
function finalPropName( name ) {
	var ret = jQuery.cssProps[ name ];
	if ( !ret ) {
		ret = jQuery.cssProps[ name ] = vendorPropName( name ) || name;
	}
	return ret;
}

function setPositiveNumber( elem, value, subtract ) {

	// Any relative (+/-) values have already been
	// normalized at this point
	var matches = rcssNum.exec( value );
	return matches ?

		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 2 ] - ( subtract || 0 ) ) + ( matches[ 3 ] || "px" ) :
		value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
	var i,
		val = 0;

	// If we already have the right measurement, avoid augmentation
	if ( extra === ( isBorderBox ? "border" : "content" ) ) {
		i = 4;

	// Otherwise initialize for horizontal or vertical properties
	} else {
		i = name === "width" ? 1 : 0;
	}

	for ( ; i < 4; i += 2 ) {

		// Both box models exclude margin, so add it if we want it
		if ( extra === "margin" ) {
			val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
		}

		if ( isBorderBox ) {

			// border-box includes padding, so remove it if we want content
			if ( extra === "content" ) {
				val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// At this point, extra isn't border nor margin, so remove border
			if ( extra !== "margin" ) {
				val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		} else {

			// At this point, extra isn't content, so add padding
			val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// At this point, extra isn't content nor padding, so add border
			if ( extra !== "padding" ) {
				val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	return val;
}

function getWidthOrHeight( elem, name, extra ) {

	// Start with computed style
	var valueIsBorderBox,
		styles = getStyles( elem ),
		val = curCSS( elem, name, styles ),
		isBorderBox = jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

	// Computed unit is not pixels. Stop here and return.
	if ( rnumnonpx.test( val ) ) {
		return val;
	}

	// Check for style in case a browser which returns unreliable values
	// for getComputedStyle silently falls back to the reliable elem.style
	valueIsBorderBox = isBorderBox &&
		( support.boxSizingReliable() || val === elem.style[ name ] );

	// Fall back to offsetWidth/Height when value is "auto"
	// This happens for inline elements with no explicit setting (gh-3571)
	if ( val === "auto" ) {
		val = elem[ "offset" + name[ 0 ].toUpperCase() + name.slice( 1 ) ];
	}

	// Normalize "", auto, and prepare for extra
	val = parseFloat( val ) || 0;

	// Use the active box-sizing model to add/subtract irrelevant styles
	return ( val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles
		)
	) + "px";
}

jQuery.extend( {

	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {

					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		"animationIterationCount": true,
		"columnCount": true,
		"fillOpacity": true,
		"flexGrow": true,
		"flexShrink": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		"float": "cssFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {

		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = jQuery.camelCase( name ),
			isCustomProp = rcustomProp.test( name ),
			style = elem.style;

		// Make sure that we're working with the right name. We don't
		// want to query the value if it is a CSS custom property
		// since they are user-defined.
		if ( !isCustomProp ) {
			name = finalPropName( origName );
		}

		// Gets hook for the prefixed version, then unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// Convert "+=" or "-=" to relative numbers (#7345)
			if ( type === "string" && ( ret = rcssNum.exec( value ) ) && ret[ 1 ] ) {
				value = adjustCSS( elem, name, ret );

				// Fixes bug #9237
				type = "number";
			}

			// Make sure that null and NaN values aren't set (#7116)
			if ( value == null || value !== value ) {
				return;
			}

			// If a number was passed in, add the unit (except for certain CSS properties)
			if ( type === "number" ) {
				value += ret && ret[ 3 ] || ( jQuery.cssNumber[ origName ] ? "" : "px" );
			}

			// background-* props affect original clone's values
			if ( !support.clearCloneStyle && value === "" && name.indexOf( "background" ) === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !( "set" in hooks ) ||
				( value = hooks.set( elem, value, extra ) ) !== undefined ) {

				if ( isCustomProp ) {
					style.setProperty( name, value );
				} else {
					style[ name ] = value;
				}
			}

		} else {

			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks &&
				( ret = hooks.get( elem, false, extra ) ) !== undefined ) {

				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var val, num, hooks,
			origName = jQuery.camelCase( name ),
			isCustomProp = rcustomProp.test( name );

		// Make sure that we're working with the right name. We don't
		// want to modify the value if it is a CSS custom property
		// since they are user-defined.
		if ( !isCustomProp ) {
			name = finalPropName( origName );
		}

		// Try prefixed name followed by the unprefixed name
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		// Convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Make numeric if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || isFinite( num ) ? num || 0 : val;
		}

		return val;
	}
} );

jQuery.each( [ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {

				// Certain elements can have dimension info if we invisibly show them
				// but it must have a current display style that would benefit
				return rdisplayswap.test( jQuery.css( elem, "display" ) ) &&

					// Support: Safari 8+
					// Table columns in Safari have non-zero offsetWidth & zero
					// getBoundingClientRect().width unless display is changed.
					// Support: IE <=11 only
					// Running getBoundingClientRect on a disconnected node
					// in IE throws an error.
					( !elem.getClientRects().length || !elem.getBoundingClientRect().width ) ?
						swap( elem, cssShow, function() {
							return getWidthOrHeight( elem, name, extra );
						} ) :
						getWidthOrHeight( elem, name, extra );
			}
		},

		set: function( elem, value, extra ) {
			var matches,
				styles = extra && getStyles( elem ),
				subtract = extra && augmentWidthOrHeight(
					elem,
					name,
					extra,
					jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
					styles
				);

			// Convert to pixels if value adjustment is needed
			if ( subtract && ( matches = rcssNum.exec( value ) ) &&
				( matches[ 3 ] || "px" ) !== "px" ) {

				elem.style[ name ] = value;
				value = jQuery.css( elem, name );
			}

			return setPositiveNumber( elem, value, subtract );
		}
	};
} );

jQuery.cssHooks.marginLeft = addGetHookIf( support.reliableMarginLeft,
	function( elem, computed ) {
		if ( computed ) {
			return ( parseFloat( curCSS( elem, "marginLeft" ) ) ||
				elem.getBoundingClientRect().left -
					swap( elem, { marginLeft: 0 }, function() {
						return elem.getBoundingClientRect().left;
					} )
				) + "px";
		}
	}
);

// These hooks are used by animate to expand properties
jQuery.each( {
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// Assumes a single number if not a string
				parts = typeof value === "string" ? value.split( " " ) : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( !rmargin.test( prefix ) ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
} );

jQuery.fn.extend( {
	css: function( name, value ) {
		return access( this, function( elem, name, value ) {
			var styles, len,
				map = {},
				i = 0;

			if ( Array.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	}
} );


function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || jQuery.easing._default;
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			// Use a property on the element directly when it is not a DOM element,
			// or when there is no matching style property that exists.
			if ( tween.elem.nodeType !== 1 ||
				tween.elem[ tween.prop ] != null && tween.elem.style[ tween.prop ] == null ) {
				return tween.elem[ tween.prop ];
			}

			// Passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails.
			// Simple values such as "10px" are parsed to Float;
			// complex values such as "rotate(1rad)" are returned as-is.
			result = jQuery.css( tween.elem, tween.prop, "" );

			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {

			// Use step hook for back compat.
			// Use cssHook if its there.
			// Use .style if available and use plain properties where available.
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.nodeType === 1 &&
				( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null ||
					jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE <=9 only
// Panic based approach to setting things on disconnected nodes
Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p * Math.PI ) / 2;
	},
	_default: "swing"
};

jQuery.fx = Tween.prototype.init;

// Back compat <1.8 extension point
jQuery.fx.step = {};




var
	fxNow, inProgress,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rrun = /queueHooks$/;

function schedule() {
	if ( inProgress ) {
		if ( document.hidden === false && window.requestAnimationFrame ) {
			window.requestAnimationFrame( schedule );
		} else {
			window.setTimeout( schedule, jQuery.fx.interval );
		}

		jQuery.fx.tick();
	}
}

// Animations created synchronously will run synchronously
function createFxNow() {
	window.setTimeout( function() {
		fxNow = undefined;
	} );
	return ( fxNow = jQuery.now() );
}

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		i = 0,
		attrs = { height: type };

	// If we include width, step value is 1 to do all cssExpand values,
	// otherwise step value is 2 to skip over Left and Right
	includeWidth = includeWidth ? 1 : 0;
	for ( ; i < 4; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( Animation.tweeners[ prop ] || [] ).concat( Animation.tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( ( tween = collection[ index ].call( animation, prop, value ) ) ) {

			// We're done with this property
			return tween;
		}
	}
}

function defaultPrefilter( elem, props, opts ) {
	var prop, value, toggle, hooks, oldfire, propTween, restoreDisplay, display,
		isBox = "width" in props || "height" in props,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHiddenWithinTree( elem ),
		dataShow = dataPriv.get( elem, "fxshow" );

	// Queue-skipping animations hijack the fx hooks
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always( function() {

			// Ensure the complete handler is called before this completes
			anim.always( function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			} );
		} );
	}

	// Detect show/hide animations
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.test( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {

				// Pretend to be hidden if this is a "show" and
				// there is still data from a stopped show/hide
				if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
					hidden = true;

				// Ignore all other no-op show/hide data
				} else {
					continue;
				}
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );
		}
	}

	// Bail out if this is a no-op like .hide().hide()
	propTween = !jQuery.isEmptyObject( props );
	if ( !propTween && jQuery.isEmptyObject( orig ) ) {
		return;
	}

	// Restrict "overflow" and "display" styles during box animations
	if ( isBox && elem.nodeType === 1 ) {

		// Support: IE <=9 - 11, Edge 12 - 13
		// Record all 3 overflow attributes because IE does not infer the shorthand
		// from identically-valued overflowX and overflowY
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Identify a display type, preferring old show/hide data over the CSS cascade
		restoreDisplay = dataShow && dataShow.display;
		if ( restoreDisplay == null ) {
			restoreDisplay = dataPriv.get( elem, "display" );
		}
		display = jQuery.css( elem, "display" );
		if ( display === "none" ) {
			if ( restoreDisplay ) {
				display = restoreDisplay;
			} else {

				// Get nonempty value(s) by temporarily forcing visibility
				showHide( [ elem ], true );
				restoreDisplay = elem.style.display || restoreDisplay;
				display = jQuery.css( elem, "display" );
				showHide( [ elem ] );
			}
		}

		// Animate inline elements as inline-block
		if ( display === "inline" || display === "inline-block" && restoreDisplay != null ) {
			if ( jQuery.css( elem, "float" ) === "none" ) {

				// Restore the original display value at the end of pure show/hide animations
				if ( !propTween ) {
					anim.done( function() {
						style.display = restoreDisplay;
					} );
					if ( restoreDisplay == null ) {
						display = style.display;
						restoreDisplay = display === "none" ? "" : display;
					}
				}
				style.display = "inline-block";
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		anim.always( function() {
			style.overflow = opts.overflow[ 0 ];
			style.overflowX = opts.overflow[ 1 ];
			style.overflowY = opts.overflow[ 2 ];
		} );
	}

	// Implement show/hide animations
	propTween = false;
	for ( prop in orig ) {

		// General show/hide setup for this element animation
		if ( !propTween ) {
			if ( dataShow ) {
				if ( "hidden" in dataShow ) {
					hidden = dataShow.hidden;
				}
			} else {
				dataShow = dataPriv.access( elem, "fxshow", { display: restoreDisplay } );
			}

			// Store hidden/visible for toggle so `.stop().toggle()` "reverses"
			if ( toggle ) {
				dataShow.hidden = !hidden;
			}

			// Show elements before animating them
			if ( hidden ) {
				showHide( [ elem ], true );
			}

			/* eslint-disable no-loop-func */

			anim.done( function() {

			/* eslint-enable no-loop-func */

				// The final step of a "hide" animation is actually hiding the element
				if ( !hidden ) {
					showHide( [ elem ] );
				}
				dataPriv.remove( elem, "fxshow" );
				for ( prop in orig ) {
					jQuery.style( elem, prop, orig[ prop ] );
				}
			} );
		}

		// Per-property setup
		propTween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );
		if ( !( prop in dataShow ) ) {
			dataShow[ prop ] = propTween.start;
			if ( hidden ) {
				propTween.end = propTween.start;
				propTween.start = 0;
			}
		}
	}
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = jQuery.camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( Array.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// Not quite $.extend, this won't overwrite existing keys.
			// Reusing 'index' because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = Animation.prefilters.length,
		deferred = jQuery.Deferred().always( function() {

			// Don't match elem in the :animated selector
			delete tick.elem;
		} ),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),

				// Support: Android 2.3 only
				// Archaic crash bug won't allow us to use `1 - ( 0.5 || 0 )` (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ] );

			// If there's more to do, yield
			if ( percent < 1 && length ) {
				return remaining;
			}

			// If this was an empty animation, synthesize a final progress notification
			if ( !length ) {
				deferred.notifyWith( elem, [ animation, 1, 0 ] );
			}

			// Resolve the animation and report its conclusion
			deferred.resolveWith( elem, [ animation ] );
			return false;
		},
		animation = deferred.promise( {
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, {
				specialEasing: {},
				easing: jQuery.easing._default
			}, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,

					// If we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// Resolve when we played the last frame; otherwise, reject
				if ( gotoEnd ) {
					deferred.notifyWith( elem, [ animation, 1, 0 ] );
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		} ),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length; index++ ) {
		result = Animation.prefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			if ( jQuery.isFunction( result.stop ) ) {
				jQuery._queueHooks( animation.elem, animation.opts.queue ).stop =
					jQuery.proxy( result.stop, result );
			}
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( jQuery.isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	// Attach callbacks from options
	animation
		.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		} )
	);

	return animation;
}

jQuery.Animation = jQuery.extend( Animation, {

	tweeners: {
		"*": [ function( prop, value ) {
			var tween = this.createTween( prop, value );
			adjustCSS( tween.elem, prop, rcssNum.exec( value ), tween );
			return tween;
		} ]
	},

	tweener: function( props, callback ) {
		if ( jQuery.isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.match( rnothtmlwhite );
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length; index++ ) {
			prop = props[ index ];
			Animation.tweeners[ prop ] = Animation.tweeners[ prop ] || [];
			Animation.tweeners[ prop ].unshift( callback );
		}
	},

	prefilters: [ defaultPrefilter ],

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			Animation.prefilters.unshift( callback );
		} else {
			Animation.prefilters.push( callback );
		}
	}
} );

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			jQuery.isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
	};

	// Go to the end state if fx are off
	if ( jQuery.fx.off ) {
		opt.duration = 0;

	} else {
		if ( typeof opt.duration !== "number" ) {
			if ( opt.duration in jQuery.fx.speeds ) {
				opt.duration = jQuery.fx.speeds[ opt.duration ];

			} else {
				opt.duration = jQuery.fx.speeds._default;
			}
		}
	}

	// Normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( jQuery.isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.fn.extend( {
	fadeTo: function( speed, to, easing, callback ) {

		// Show any hidden elements after setting opacity to 0
		return this.filter( isHiddenWithinTree ).css( "opacity", 0 ).show()

			// Animate to the value specified
			.end().animate( { opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {

				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || dataPriv.get( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each( function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = dataPriv.get( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this &&
					( type == null || timers[ index ].queue === type ) ) {

					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// Start the next in the queue if the last step wasn't forced.
			// Timers currently will call their complete callbacks, which
			// will dequeue but only if they were gotoEnd.
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		} );
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each( function() {
			var index,
				data = dataPriv.get( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// Enable finishing flag on private data
			data.finish = true;

			// Empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// Look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// Look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// Turn off finishing flag
			delete data.finish;
		} );
	}
} );

jQuery.each( [ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
} );

// Generate shortcuts for custom animations
jQuery.each( {
	slideDown: genFx( "show" ),
	slideUp: genFx( "hide" ),
	slideToggle: genFx( "toggle" ),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
} );

jQuery.timers = [];
jQuery.fx.tick = function() {
	var timer,
		i = 0,
		timers = jQuery.timers;

	fxNow = jQuery.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];

		// Run the timer and safely remove it when done (allowing for external removal)
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	jQuery.timers.push( timer );
	jQuery.fx.start();
};

jQuery.fx.interval = 13;
jQuery.fx.start = function() {
	if ( inProgress ) {
		return;
	}

	inProgress = true;
	schedule();
};

jQuery.fx.stop = function() {
	inProgress = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,

	// Default speed
	_default: 400
};


// Based off of the plugin by Clint Helfers, with permission.
// https://web.archive.org/web/20100324014747/http://blindsignals.com/index.php/2009/07/jquery-delay/
jQuery.fn.delay = function( time, type ) {
	time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
	type = type || "fx";

	return this.queue( type, function( next, hooks ) {
		var timeout = window.setTimeout( next, time );
		hooks.stop = function() {
			window.clearTimeout( timeout );
		};
	} );
};


( function() {
	var input = document.createElement( "input" ),
		select = document.createElement( "select" ),
		opt = select.appendChild( document.createElement( "option" ) );

	input.type = "checkbox";

	// Support: Android <=4.3 only
	// Default value for a checkbox should be "on"
	support.checkOn = input.value !== "";

	// Support: IE <=11 only
	// Must access selectedIndex to make default options select
	support.optSelected = opt.selected;

	// Support: IE <=11 only
	// An input loses its value after becoming a radio
	input = document.createElement( "input" );
	input.value = "t";
	input.type = "radio";
	support.radioValue = input.value === "t";
} )();


var boolHook,
	attrHandle = jQuery.expr.attrHandle;

jQuery.fn.extend( {
	attr: function( name, value ) {
		return access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each( function() {
			jQuery.removeAttr( this, name );
		} );
	}
} );

jQuery.extend( {
	attr: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set attributes on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === "undefined" ) {
			return jQuery.prop( elem, name, value );
		}

		// Attribute hooks are determined by the lowercase version
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			hooks = jQuery.attrHooks[ name.toLowerCase() ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : undefined );
		}

		if ( value !== undefined ) {
			if ( value === null ) {
				jQuery.removeAttr( elem, name );
				return;
			}

			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			elem.setAttribute( name, value + "" );
			return value;
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		ret = jQuery.find.attr( elem, name );

		// Non-existent attributes return null, we normalize to undefined
		return ret == null ? undefined : ret;
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !support.radioValue && value === "radio" &&
					nodeName( elem, "input" ) ) {
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	removeAttr: function( elem, value ) {
		var name,
			i = 0,

			// Attribute names can contain non-HTML whitespace characters
			// https://html.spec.whatwg.org/multipage/syntax.html#attributes-2
			attrNames = value && value.match( rnothtmlwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( ( name = attrNames[ i++ ] ) ) {
				elem.removeAttribute( name );
			}
		}
	}
} );

// Hooks for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {

			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else {
			elem.setAttribute( name, name );
		}
		return name;
	}
};

jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
	var getter = attrHandle[ name ] || jQuery.find.attr;

	attrHandle[ name ] = function( elem, name, isXML ) {
		var ret, handle,
			lowercaseName = name.toLowerCase();

		if ( !isXML ) {

			// Avoid an infinite loop by temporarily removing this function from the getter
			handle = attrHandle[ lowercaseName ];
			attrHandle[ lowercaseName ] = ret;
			ret = getter( elem, name, isXML ) != null ?
				lowercaseName :
				null;
			attrHandle[ lowercaseName ] = handle;
		}
		return ret;
	};
} );




var rfocusable = /^(?:input|select|textarea|button)$/i,
	rclickable = /^(?:a|area)$/i;

jQuery.fn.extend( {
	prop: function( name, value ) {
		return access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		return this.each( function() {
			delete this[ jQuery.propFix[ name ] || name ];
		} );
	}
} );

jQuery.extend( {
	prop: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set properties on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {

			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			return ( elem[ name ] = value );
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		return elem[ name ];
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {

				// Support: IE <=9 - 11 only
				// elem.tabIndex doesn't always return the
				// correct value when it hasn't been explicitly set
				// https://web.archive.org/web/20141116233347/http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				// Use proper attribute retrieval(#12072)
				var tabindex = jQuery.find.attr( elem, "tabindex" );

				if ( tabindex ) {
					return parseInt( tabindex, 10 );
				}

				if (
					rfocusable.test( elem.nodeName ) ||
					rclickable.test( elem.nodeName ) &&
					elem.href
				) {
					return 0;
				}

				return -1;
			}
		}
	},

	propFix: {
		"for": "htmlFor",
		"class": "className"
	}
} );

// Support: IE <=11 only
// Accessing the selectedIndex property
// forces the browser to respect setting selected
// on the option
// The getter ensures a default option is selected
// when in an optgroup
// eslint rule "no-unused-expressions" is disabled for this code
// since it considers such accessions noop
if ( !support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {

			/* eslint no-unused-expressions: "off" */

			var parent = elem.parentNode;
			if ( parent && parent.parentNode ) {
				parent.parentNode.selectedIndex;
			}
			return null;
		},
		set: function( elem ) {

			/* eslint no-unused-expressions: "off" */

			var parent = elem.parentNode;
			if ( parent ) {
				parent.selectedIndex;

				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
		}
	};
}

jQuery.each( [
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
} );




	// Strip and collapse whitespace according to HTML spec
	// https://html.spec.whatwg.org/multipage/infrastructure.html#strip-and-collapse-whitespace
	function stripAndCollapse( value ) {
		var tokens = value.match( rnothtmlwhite ) || [];
		return tokens.join( " " );
	}


function getClass( elem ) {
	return elem.getAttribute && elem.getAttribute( "class" ) || "";
}

jQuery.fn.extend( {
	addClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;

		if ( jQuery.isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).addClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		if ( typeof value === "string" && value ) {
			classes = value.match( rnothtmlwhite ) || [];

			while ( ( elem = this[ i++ ] ) ) {
				curValue = getClass( elem );
				cur = elem.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = stripAndCollapse( cur );
					if ( curValue !== finalValue ) {
						elem.setAttribute( "class", finalValue );
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;

		if ( jQuery.isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).removeClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		if ( !arguments.length ) {
			return this.attr( "class", "" );
		}

		if ( typeof value === "string" && value ) {
			classes = value.match( rnothtmlwhite ) || [];

			while ( ( elem = this[ i++ ] ) ) {
				curValue = getClass( elem );

				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {

						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) > -1 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = stripAndCollapse( cur );
					if ( curValue !== finalValue ) {
						elem.setAttribute( "class", finalValue );
					}
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value;

		if ( typeof stateVal === "boolean" && type === "string" ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		if ( jQuery.isFunction( value ) ) {
			return this.each( function( i ) {
				jQuery( this ).toggleClass(
					value.call( this, i, getClass( this ), stateVal ),
					stateVal
				);
			} );
		}

		return this.each( function() {
			var className, i, self, classNames;

			if ( type === "string" ) {

				// Toggle individual class names
				i = 0;
				self = jQuery( this );
				classNames = value.match( rnothtmlwhite ) || [];

				while ( ( className = classNames[ i++ ] ) ) {

					// Check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( value === undefined || type === "boolean" ) {
				className = getClass( this );
				if ( className ) {

					// Store className if set
					dataPriv.set( this, "__className__", className );
				}

				// If the element has a class name or if we're passed `false`,
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				if ( this.setAttribute ) {
					this.setAttribute( "class",
						className || value === false ?
						"" :
						dataPriv.get( this, "__className__" ) || ""
					);
				}
			}
		} );
	},

	hasClass: function( selector ) {
		var className, elem,
			i = 0;

		className = " " + selector + " ";
		while ( ( elem = this[ i++ ] ) ) {
			if ( elem.nodeType === 1 &&
				( " " + stripAndCollapse( getClass( elem ) ) + " " ).indexOf( className ) > -1 ) {
					return true;
			}
		}

		return false;
	}
} );




var rreturn = /\r/g;

jQuery.fn.extend( {
	val: function( value ) {
		var hooks, ret, isFunction,
			elem = this[ 0 ];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] ||
					jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks &&
					"get" in hooks &&
					( ret = hooks.get( elem, "value" ) ) !== undefined
				) {
					return ret;
				}

				ret = elem.value;

				// Handle most common string cases
				if ( typeof ret === "string" ) {
					return ret.replace( rreturn, "" );
				}

				// Handle cases where value is null/undef or number
				return ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each( function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";

			} else if ( typeof val === "number" ) {
				val += "";

			} else if ( Array.isArray( val ) ) {
				val = jQuery.map( val, function( value ) {
					return value == null ? "" : value + "";
				} );
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !( "set" in hooks ) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		} );
	}
} );

jQuery.extend( {
	valHooks: {
		option: {
			get: function( elem ) {

				var val = jQuery.find.attr( elem, "value" );
				return val != null ?
					val :

					// Support: IE <=10 - 11 only
					// option.text throws exceptions (#14686, #14858)
					// Strip and collapse whitespace
					// https://html.spec.whatwg.org/#strip-and-collapse-whitespace
					stripAndCollapse( jQuery.text( elem ) );
			}
		},
		select: {
			get: function( elem ) {
				var value, option, i,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one",
					values = one ? null : [],
					max = one ? index + 1 : options.length;

				if ( index < 0 ) {
					i = max;

				} else {
					i = one ? index : 0;
				}

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// Support: IE <=9 only
					// IE8-9 doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&

							// Don't return options that are disabled or in a disabled optgroup
							!option.disabled &&
							( !option.parentNode.disabled ||
								!nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];

					/* eslint-disable no-cond-assign */

					if ( option.selected =
						jQuery.inArray( jQuery.valHooks.option.get( option ), values ) > -1
					) {
						optionSet = true;
					}

					/* eslint-enable no-cond-assign */
				}

				// Force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	}
} );

// Radios and checkboxes getter/setter
jQuery.each( [ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( Array.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery( elem ).val(), value ) > -1 );
			}
		}
	};
	if ( !support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			return elem.getAttribute( "value" ) === null ? "on" : elem.value;
		};
	}
} );




// Return jQuery for attributes-only inclusion


var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/;

jQuery.extend( jQuery.event, {

	trigger: function( event, data, elem, onlyHandlers ) {

		var i, cur, tmp, bubbleType, ontype, handle, special,
			eventPath = [ elem || document ],
			type = hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = hasOwn.call( event, "namespace" ) ? event.namespace.split( "." ) : [];

		cur = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf( "." ) > -1 ) {

			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split( "." );
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf( ":" ) < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join( "." );
		event.rnamespace = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === ( elem.ownerDocument || document ) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( ( cur = eventPath[ i++ ] ) && !event.isPropagationStopped() ) {

			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( dataPriv.get( cur, "events" ) || {} )[ event.type ] &&
				dataPriv.get( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && handle.apply && acceptData( cur ) ) {
				event.result = handle.apply( cur, data );
				if ( event.result === false ) {
					event.preventDefault();
				}
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( ( !special._default ||
				special._default.apply( eventPath.pop(), data ) === false ) &&
				acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name as the event.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && jQuery.isFunction( elem[ type ] ) && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					elem[ type ]();
					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	// Piggyback on a donor event to simulate a different one
	// Used only for `focus(in | out)` events
	simulate: function( type, elem, event ) {
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true
			}
		);

		jQuery.event.trigger( e, null, elem );
	}

} );

jQuery.fn.extend( {

	trigger: function( type, data ) {
		return this.each( function() {
			jQuery.event.trigger( type, data, this );
		} );
	},
	triggerHandler: function( type, data ) {
		var elem = this[ 0 ];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
} );


jQuery.each( ( "blur focus focusin focusout resize scroll click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup contextmenu" ).split( " " ),
	function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
} );

jQuery.fn.extend( {
	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	}
} );




support.focusin = "onfocusin" in window;


// Support: Firefox <=44
// Firefox doesn't have focus(in | out) events
// Related ticket - https://bugzilla.mozilla.org/show_bug.cgi?id=687787
//
// Support: Chrome <=48 - 49, Safari <=9.0 - 9.1
// focus(in | out) events fire after focus & blur events,
// which is spec violation - http://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent-event-order
// Related ticket - https://bugs.chromium.org/p/chromium/issues/detail?id=449857
if ( !support.focusin ) {
	jQuery.each( { focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler on the document while someone wants focusin/focusout
		var handler = function( event ) {
			jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ) );
		};

		jQuery.event.special[ fix ] = {
			setup: function() {
				var doc = this.ownerDocument || this,
					attaches = dataPriv.access( doc, fix );

				if ( !attaches ) {
					doc.addEventListener( orig, handler, true );
				}
				dataPriv.access( doc, fix, ( attaches || 0 ) + 1 );
			},
			teardown: function() {
				var doc = this.ownerDocument || this,
					attaches = dataPriv.access( doc, fix ) - 1;

				if ( !attaches ) {
					doc.removeEventListener( orig, handler, true );
					dataPriv.remove( doc, fix );

				} else {
					dataPriv.access( doc, fix, attaches );
				}
			}
		};
	} );
}
var location = window.location;

var nonce = jQuery.now();

var rquery = ( /\?/ );



// Cross-browser xml parsing
jQuery.parseXML = function( data ) {
	var xml;
	if ( !data || typeof data !== "string" ) {
		return null;
	}

	// Support: IE 9 - 11 only
	// IE throws on parseFromString with invalid input.
	try {
		xml = ( new window.DOMParser() ).parseFromString( data, "text/xml" );
	} catch ( e ) {
		xml = undefined;
	}

	if ( !xml || xml.getElementsByTagName( "parsererror" ).length ) {
		jQuery.error( "Invalid XML: " + data );
	}
	return xml;
};


var
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( Array.isArray( obj ) ) {

		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {

				// Treat each array item as a scalar.
				add( prefix, v );

			} else {

				// Item is non-scalar (array or object), encode its numeric index.
				buildParams(
					prefix + "[" + ( typeof v === "object" && v != null ? i : "" ) + "]",
					v,
					traditional,
					add
				);
			}
		} );

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {

		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {

		// Serialize scalar item.
		add( prefix, obj );
	}
}

// Serialize an array of form elements or a set of
// key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, valueOrFunction ) {

			// If value is a function, invoke it and use its return value
			var value = jQuery.isFunction( valueOrFunction ) ?
				valueOrFunction() :
				valueOrFunction;

			s[ s.length ] = encodeURIComponent( key ) + "=" +
				encodeURIComponent( value == null ? "" : value );
		};

	// If an array was passed in, assume that it is an array of form elements.
	if ( Array.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {

		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		} );

	} else {

		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" );
};

jQuery.fn.extend( {
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map( function() {

			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		} )
		.filter( function() {
			var type = this.type;

			// Use .is( ":disabled" ) so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !rcheckableType.test( type ) );
		} )
		.map( function( i, elem ) {
			var val = jQuery( this ).val();

			if ( val == null ) {
				return null;
			}

			if ( Array.isArray( val ) ) {
				return jQuery.map( val, function( val ) {
					return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
				} );
			}

			return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		} ).get();
	}
} );


var
	r20 = /%20/g,
	rhash = /#.*$/,
	rantiCache = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,

	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat( "*" ),

	// Anchor tag for parsing the document origin
	originAnchor = document.createElement( "a" );
	originAnchor.href = location.href;

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( rnothtmlwhite ) || [];

		if ( jQuery.isFunction( func ) ) {

			// For each dataType in the dataTypeExpression
			while ( ( dataType = dataTypes[ i++ ] ) ) {

				// Prepend if requested
				if ( dataType[ 0 ] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					( structure[ dataType ] = structure[ dataType ] || [] ).unshift( func );

				// Otherwise append
				} else {
					( structure[ dataType ] = structure[ dataType ] || [] ).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if ( typeof dataTypeOrTransport === "string" &&
				!seekingTransport && !inspected[ dataTypeOrTransport ] ) {

				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		} );
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var key, deep,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

	var ct, type, finalDataType, firstDataType,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while ( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader( "Content-Type" );
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {

		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[ 0 ] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}

		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},

		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

			// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {

								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s.throws ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return {
								state: "parsererror",
								error: conv ? e : "No conversion from " + prev + " to " + current
							};
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}

jQuery.extend( {

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: location.href,
		type: "GET",
		isLocal: rlocalProtocol.test( location.protocol ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",

		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /\bxml\b/,
			html: /\bhtml/,
			json: /\bjson\b/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": JSON.parse,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var transport,

			// URL without anti-cache param
			cacheURL,

			// Response headers
			responseHeadersString,
			responseHeaders,

			// timeout handle
			timeoutTimer,

			// Url cleanup var
			urlAnchor,

			// Request state (becomes false upon send and true upon completion)
			completed,

			// To know if global events are to be dispatched
			fireGlobals,

			// Loop variable
			i,

			// uncached part of the url
			uncached,

			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),

			// Callbacks context
			callbackContext = s.context || s,

			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context &&
				( callbackContext.nodeType || callbackContext.jquery ) ?
					jQuery( callbackContext ) :
					jQuery.event,

			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks( "once memory" ),

			// Status-dependent callbacks
			statusCode = s.statusCode || {},

			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},

			// Default abort message
			strAbort = "canceled",

			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( completed ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( ( match = rheaders.exec( responseHeadersString ) ) ) {
								responseHeaders[ match[ 1 ].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match == null ? null : match;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return completed ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					if ( completed == null ) {
						name = requestHeadersNames[ name.toLowerCase() ] =
							requestHeadersNames[ name.toLowerCase() ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( completed == null ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( completed ) {

							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						} else {

							// Lazy-add the new callbacks in a way that preserves old ones
							for ( code in map ) {
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR );

		// Add protocol if not provided (prefilters might expect it)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || location.href ) + "" )
			.replace( rprotocol, location.protocol + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = ( s.dataType || "*" ).toLowerCase().match( rnothtmlwhite ) || [ "" ];

		// A cross-domain request is in order when the origin doesn't match the current origin.
		if ( s.crossDomain == null ) {
			urlAnchor = document.createElement( "a" );

			// Support: IE <=8 - 11, Edge 12 - 13
			// IE throws exception on accessing the href property if url is malformed,
			// e.g. http://example.com:80x/
			try {
				urlAnchor.href = s.url;

				// Support: IE <=8 - 11 only
				// Anchor's host property isn't correctly set when s.url is relative
				urlAnchor.href = urlAnchor.href;
				s.crossDomain = originAnchor.protocol + "//" + originAnchor.host !==
					urlAnchor.protocol + "//" + urlAnchor.host;
			} catch ( e ) {

				// If there is an error parsing the URL, assume it is crossDomain,
				// it can be rejected by the transport if it is invalid
				s.crossDomain = true;
			}
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( completed ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		// Don't fire events if jQuery.event is undefined in an AMD-usage scenario (#15118)
		fireGlobals = jQuery.event && s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger( "ajaxStart" );
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		// Remove hash to simplify url manipulation
		cacheURL = s.url.replace( rhash, "" );

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// Remember the hash so we can put it back
			uncached = s.url.slice( cacheURL.length );

			// If data is available, append data to url
			if ( s.data ) {
				cacheURL += ( rquery.test( cacheURL ) ? "&" : "?" ) + s.data;

				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add or update anti-cache param if needed
			if ( s.cache === false ) {
				cacheURL = cacheURL.replace( rantiCache, "$1" );
				uncached = ( rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ( nonce++ ) + uncached;
			}

			// Put hash and anti-cache on the URL that will be requested (gh-1732)
			s.url = cacheURL + uncached;

		// Change '%20' to '+' if this is encoded form body content (gh-2658)
		} else if ( s.data && s.processData &&
			( s.contentType || "" ).indexOf( "application/x-www-form-urlencoded" ) === 0 ) {
			s.data = s.data.replace( r20, "+" );
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[ 0 ] ] ?
				s.accepts[ s.dataTypes[ 0 ] ] +
					( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend &&
			( s.beforeSend.call( callbackContext, jqXHR, s ) === false || completed ) ) {

			// Abort if not done already and return
			return jqXHR.abort();
		}

		// Aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		completeDeferred.add( s.complete );
		jqXHR.done( s.success );
		jqXHR.fail( s.error );

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}

			// If request was aborted inside ajaxSend, stop there
			if ( completed ) {
				return jqXHR;
			}

			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = window.setTimeout( function() {
					jqXHR.abort( "timeout" );
				}, s.timeout );
			}

			try {
				completed = false;
				transport.send( requestHeaders, done );
			} catch ( e ) {

				// Rethrow post-completion exceptions
				if ( completed ) {
					throw e;
				}

				// Propagate others as results
				done( -1, e );
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Ignore repeat invocations
			if ( completed ) {
				return;
			}

			completed = true;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				window.clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader( "Last-Modified" );
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader( "etag" );
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {

				// Extract error from statusText and normalize for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );

				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger( "ajaxStop" );
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
} );

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {

		// Shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		// The url can be an options object (which then must have .url)
		return jQuery.ajax( jQuery.extend( {
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		}, jQuery.isPlainObject( url ) && url ) );
	};
} );


jQuery._evalUrl = function( url ) {
	return jQuery.ajax( {
		url: url,

		// Make this explicit, since user can override this through ajaxSetup (#11264)
		type: "GET",
		dataType: "script",
		cache: true,
		async: false,
		global: false,
		"throws": true
	} );
};


jQuery.fn.extend( {
	wrapAll: function( html ) {
		var wrap;

		if ( this[ 0 ] ) {
			if ( jQuery.isFunction( html ) ) {
				html = html.call( this[ 0 ] );
			}

			// The elements to wrap the target around
			wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );

			if ( this[ 0 ].parentNode ) {
				wrap.insertBefore( this[ 0 ] );
			}

			wrap.map( function() {
				var elem = this;

				while ( elem.firstElementChild ) {
					elem = elem.firstElementChild;
				}

				return elem;
			} ).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each( function( i ) {
				jQuery( this ).wrapInner( html.call( this, i ) );
			} );
		}

		return this.each( function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		} );
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each( function( i ) {
			jQuery( this ).wrapAll( isFunction ? html.call( this, i ) : html );
		} );
	},

	unwrap: function( selector ) {
		this.parent( selector ).not( "body" ).each( function() {
			jQuery( this ).replaceWith( this.childNodes );
		} );
		return this;
	}
} );


jQuery.expr.pseudos.hidden = function( elem ) {
	return !jQuery.expr.pseudos.visible( elem );
};
jQuery.expr.pseudos.visible = function( elem ) {
	return !!( elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length );
};




jQuery.ajaxSettings.xhr = function() {
	try {
		return new window.XMLHttpRequest();
	} catch ( e ) {}
};

var xhrSuccessStatus = {

		// File protocol always yields status code 0, assume 200
		0: 200,

		// Support: IE <=9 only
		// #1450: sometimes IE returns 1223 when it should be 204
		1223: 204
	},
	xhrSupported = jQuery.ajaxSettings.xhr();

support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
support.ajax = xhrSupported = !!xhrSupported;

jQuery.ajaxTransport( function( options ) {
	var callback, errorCallback;

	// Cross domain only allowed if supported through XMLHttpRequest
	if ( support.cors || xhrSupported && !options.crossDomain ) {
		return {
			send: function( headers, complete ) {
				var i,
					xhr = options.xhr();

				xhr.open(
					options.type,
					options.url,
					options.async,
					options.username,
					options.password
				);

				// Apply custom fields if provided
				if ( options.xhrFields ) {
					for ( i in options.xhrFields ) {
						xhr[ i ] = options.xhrFields[ i ];
					}
				}

				// Override mime type if needed
				if ( options.mimeType && xhr.overrideMimeType ) {
					xhr.overrideMimeType( options.mimeType );
				}

				// X-Requested-With header
				// For cross-domain requests, seeing as conditions for a preflight are
				// akin to a jigsaw puzzle, we simply never set it to be sure.
				// (it can always be set on a per-request basis or even using ajaxSetup)
				// For same-domain requests, won't change header if already provided.
				if ( !options.crossDomain && !headers[ "X-Requested-With" ] ) {
					headers[ "X-Requested-With" ] = "XMLHttpRequest";
				}

				// Set headers
				for ( i in headers ) {
					xhr.setRequestHeader( i, headers[ i ] );
				}

				// Callback
				callback = function( type ) {
					return function() {
						if ( callback ) {
							callback = errorCallback = xhr.onload =
								xhr.onerror = xhr.onabort = xhr.onreadystatechange = null;

							if ( type === "abort" ) {
								xhr.abort();
							} else if ( type === "error" ) {

								// Support: IE <=9 only
								// On a manual native abort, IE9 throws
								// errors on any property access that is not readyState
								if ( typeof xhr.status !== "number" ) {
									complete( 0, "error" );
								} else {
									complete(

										// File: protocol always yields status 0; see #8605, #14207
										xhr.status,
										xhr.statusText
									);
								}
							} else {
								complete(
									xhrSuccessStatus[ xhr.status ] || xhr.status,
									xhr.statusText,

									// Support: IE <=9 only
									// IE9 has no XHR2 but throws on binary (trac-11426)
									// For XHR2 non-text, let the caller handle it (gh-2498)
									( xhr.responseType || "text" ) !== "text"  ||
									typeof xhr.responseText !== "string" ?
										{ binary: xhr.response } :
										{ text: xhr.responseText },
									xhr.getAllResponseHeaders()
								);
							}
						}
					};
				};

				// Listen to events
				xhr.onload = callback();
				errorCallback = xhr.onerror = callback( "error" );

				// Support: IE 9 only
				// Use onreadystatechange to replace onabort
				// to handle uncaught aborts
				if ( xhr.onabort !== undefined ) {
					xhr.onabort = errorCallback;
				} else {
					xhr.onreadystatechange = function() {

						// Check readyState before timeout as it changes
						if ( xhr.readyState === 4 ) {

							// Allow onerror to be called first,
							// but that will not handle a native abort
							// Also, save errorCallback to a variable
							// as xhr.onerror cannot be accessed
							window.setTimeout( function() {
								if ( callback ) {
									errorCallback();
								}
							} );
						}
					};
				}

				// Create the abort callback
				callback = callback( "abort" );

				try {

					// Do send the request (this may raise an exception)
					xhr.send( options.hasContent && options.data || null );
				} catch ( e ) {

					// #14683: Only rethrow if this hasn't been notified as an error yet
					if ( callback ) {
						throw e;
					}
				}
			},

			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
} );




// Prevent auto-execution of scripts when no explicit dataType was provided (See gh-2432)
jQuery.ajaxPrefilter( function( s ) {
	if ( s.crossDomain ) {
		s.contents.script = false;
	}
} );

// Install script dataType
jQuery.ajaxSetup( {
	accepts: {
		script: "text/javascript, application/javascript, " +
			"application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /\b(?:java|ecma)script\b/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
} );

// Handle cache's special case and crossDomain
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
	}
} );

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function( s ) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {
		var script, callback;
		return {
			send: function( _, complete ) {
				script = jQuery( "<script>" ).prop( {
					charset: s.scriptCharset,
					src: s.url
				} ).on(
					"load error",
					callback = function( evt ) {
						script.remove();
						callback = null;
						if ( evt ) {
							complete( evt.type === "error" ? 404 : 200, evt.type );
						}
					}
				);

				// Use native DOM manipulation to avoid our domManip AJAX trickery
				document.head.appendChild( script[ 0 ] );
			},
			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
} );




var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup( {
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
} );

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" &&
				( s.contentType || "" )
					.indexOf( "application/x-www-form-urlencoded" ) === 0 &&
				rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters[ "script json" ] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// Force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always( function() {

			// If previous value didn't exist - remove it
			if ( overwritten === undefined ) {
				jQuery( window ).removeProp( callbackName );

			// Otherwise restore preexisting value
			} else {
				window[ callbackName ] = overwritten;
			}

			// Save back as free
			if ( s[ callbackName ] ) {

				// Make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// Save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		} );

		// Delegate to script
		return "script";
	}
} );




// Support: Safari 8 only
// In Safari 8 documents created via document.implementation.createHTMLDocument
// collapse sibling forms: the second one becomes a child of the first one.
// Because of that, this security measure has to be disabled in Safari 8.
// https://bugs.webkit.org/show_bug.cgi?id=137337
support.createHTMLDocument = ( function() {
	var body = document.implementation.createHTMLDocument( "" ).body;
	body.innerHTML = "<form></form><form></form>";
	return body.childNodes.length === 2;
} )();


// Argument "data" should be string of html
// context (optional): If specified, the fragment will be created in this context,
// defaults to document
// keepScripts (optional): If true, will include scripts passed in the html string
jQuery.parseHTML = function( data, context, keepScripts ) {
	if ( typeof data !== "string" ) {
		return [];
	}
	if ( typeof context === "boolean" ) {
		keepScripts = context;
		context = false;
	}

	var base, parsed, scripts;

	if ( !context ) {

		// Stop scripts or inline event handlers from being executed immediately
		// by using document.implementation
		if ( support.createHTMLDocument ) {
			context = document.implementation.createHTMLDocument( "" );

			// Set the base href for the created document
			// so any parsed elements with URLs
			// are based on the document's URL (gh-2965)
			base = context.createElement( "base" );
			base.href = document.location.href;
			context.head.appendChild( base );
		} else {
			context = document;
		}
	}

	parsed = rsingleTag.exec( data );
	scripts = !keepScripts && [];

	// Single tag
	if ( parsed ) {
		return [ context.createElement( parsed[ 1 ] ) ];
	}

	parsed = buildFragment( [ data ], context, scripts );

	if ( scripts && scripts.length ) {
		jQuery( scripts ).remove();
	}

	return jQuery.merge( [], parsed.childNodes );
};


/**
 * Load a url into a page
 */
jQuery.fn.load = function( url, params, callback ) {
	var selector, type, response,
		self = this,
		off = url.indexOf( " " );

	if ( off > -1 ) {
		selector = stripAndCollapse( url.slice( off ) );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( jQuery.isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax( {
			url: url,

			// If "type" variable is undefined, then "GET" method will be used.
			// Make value of this field explicit since
			// user can override it through ajaxSetup method
			type: type || "GET",
			dataType: "html",
			data: params
		} ).done( function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery( "<div>" ).append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		// If the request succeeds, this function gets "data", "status", "jqXHR"
		// but they are ignored because response was set above.
		// If it fails, this function gets "jqXHR", "status", "error"
		} ).always( callback && function( jqXHR, status ) {
			self.each( function() {
				callback.apply( this, response || [ jqXHR.responseText, status, jqXHR ] );
			} );
		} );
	}

	return this;
};




// Attach a bunch of functions for handling common AJAX events
jQuery.each( [
	"ajaxStart",
	"ajaxStop",
	"ajaxComplete",
	"ajaxError",
	"ajaxSuccess",
	"ajaxSend"
], function( i, type ) {
	jQuery.fn[ type ] = function( fn ) {
		return this.on( type, fn );
	};
} );




jQuery.expr.pseudos.animated = function( elem ) {
	return jQuery.grep( jQuery.timers, function( fn ) {
		return elem === fn.elem;
	} ).length;
};




jQuery.offset = {
	setOffset: function( elem, options, i ) {
		var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
			position = jQuery.css( elem, "position" ),
			curElem = jQuery( elem ),
			props = {};

		// Set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		curOffset = curElem.offset();
		curCSSTop = jQuery.css( elem, "top" );
		curCSSLeft = jQuery.css( elem, "left" );
		calculatePosition = ( position === "absolute" || position === "fixed" ) &&
			( curCSSTop + curCSSLeft ).indexOf( "auto" ) > -1;

		// Need to be able to calculate position if either
		// top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;

		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {

			// Use jQuery.extend here to allow modification of coordinates argument (gh-1848)
			options = options.call( elem, i, jQuery.extend( {}, curOffset ) );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );

		} else {
			curElem.css( props );
		}
	}
};

jQuery.fn.extend( {
	offset: function( options ) {

		// Preserve chaining for setter
		if ( arguments.length ) {
			return options === undefined ?
				this :
				this.each( function( i ) {
					jQuery.offset.setOffset( this, options, i );
				} );
		}

		var doc, docElem, rect, win,
			elem = this[ 0 ];

		if ( !elem ) {
			return;
		}

		// Return zeros for disconnected and hidden (display: none) elements (gh-2310)
		// Support: IE <=11 only
		// Running getBoundingClientRect on a
		// disconnected node in IE throws an error
		if ( !elem.getClientRects().length ) {
			return { top: 0, left: 0 };
		}

		rect = elem.getBoundingClientRect();

		doc = elem.ownerDocument;
		docElem = doc.documentElement;
		win = doc.defaultView;

		return {
			top: rect.top + win.pageYOffset - docElem.clientTop,
			left: rect.left + win.pageXOffset - docElem.clientLeft
		};
	},

	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset,
			elem = this[ 0 ],
			parentOffset = { top: 0, left: 0 };

		// Fixed elements are offset from window (parentOffset = {top:0, left: 0},
		// because it is its only offset parent
		if ( jQuery.css( elem, "position" ) === "fixed" ) {

			// Assume getBoundingClientRect is there when computed position is fixed
			offset = elem.getBoundingClientRect();

		} else {

			// Get *real* offsetParent
			offsetParent = this.offsetParent();

			// Get correct offsets
			offset = this.offset();
			if ( !nodeName( offsetParent[ 0 ], "html" ) ) {
				parentOffset = offsetParent.offset();
			}

			// Add offsetParent borders
			parentOffset = {
				top: parentOffset.top + jQuery.css( offsetParent[ 0 ], "borderTopWidth", true ),
				left: parentOffset.left + jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true )
			};
		}

		// Subtract parent offsets and element margins
		return {
			top: offset.top - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
		};
	},

	// This method will return documentElement in the following cases:
	// 1) For the element inside the iframe without offsetParent, this method will return
	//    documentElement of the parent window
	// 2) For the hidden or detached element
	// 3) For body or html element, i.e. in case of the html node - it will return itself
	//
	// but those exceptions were never presented as a real life use-cases
	// and might be considered as more preferable results.
	//
	// This logic, however, is not guaranteed and can change at any point in the future
	offsetParent: function() {
		return this.map( function() {
			var offsetParent = this.offsetParent;

			while ( offsetParent && jQuery.css( offsetParent, "position" ) === "static" ) {
				offsetParent = offsetParent.offsetParent;
			}

			return offsetParent || documentElement;
		} );
	}
} );

// Create scrollLeft and scrollTop methods
jQuery.each( { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function( method, prop ) {
	var top = "pageYOffset" === prop;

	jQuery.fn[ method ] = function( val ) {
		return access( this, function( elem, method, val ) {

			// Coalesce documents and windows
			var win;
			if ( jQuery.isWindow( elem ) ) {
				win = elem;
			} else if ( elem.nodeType === 9 ) {
				win = elem.defaultView;
			}

			if ( val === undefined ) {
				return win ? win[ prop ] : elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : win.pageXOffset,
					top ? val : win.pageYOffset
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length );
	};
} );

// Support: Safari <=7 - 9.1, Chrome <=37 - 49
// Add the top/left cssHooks using jQuery.fn.position
// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
// Blink bug: https://bugs.chromium.org/p/chromium/issues/detail?id=589347
// getComputedStyle returns percent when specified for top/left/bottom/right;
// rather than make the css module depend on the offset module, just check for it here
jQuery.each( [ "top", "left" ], function( i, prop ) {
	jQuery.cssHooks[ prop ] = addGetHookIf( support.pixelPosition,
		function( elem, computed ) {
			if ( computed ) {
				computed = curCSS( elem, prop );

				// If curCSS returns percentage, fallback to offset
				return rnumnonpx.test( computed ) ?
					jQuery( elem ).position()[ prop ] + "px" :
					computed;
			}
		}
	);
} );


// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name },
		function( defaultExtra, funcName ) {

		// Margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return access( this, function( elem, type, value ) {
				var doc;

				if ( jQuery.isWindow( elem ) ) {

					// $( window ).outerWidth/Height return w/h including scrollbars (gh-1729)
					return funcName.indexOf( "outer" ) === 0 ?
						elem[ "inner" + name ] :
						elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
					// whichever is greatest
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?

					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable );
		};
	} );
} );


jQuery.fn.extend( {

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {

		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ?
			this.off( selector, "**" ) :
			this.off( types, selector || "**", fn );
	}
} );

jQuery.holdReady = function( hold ) {
	if ( hold ) {
		jQuery.readyWait++;
	} else {
		jQuery.ready( true );
	}
};
jQuery.isArray = Array.isArray;
jQuery.parseJSON = JSON.parse;
jQuery.nodeName = nodeName;




// Register as a named AMD module, since jQuery can be concatenated with other
// files that may use define, but not via a proper concatenation script that
// understands anonymous AMD modules. A named AMD is safest and most robust
// way to register. Lowercase jquery is used because AMD module names are
// derived from file names, and jQuery is normally delivered in a lowercase
// file name. Do this after creating the global so that if an AMD module wants
// to call noConflict to hide this version of jQuery, it will work.

// Note that for maximum portability, libraries that are not jQuery should
// declare themselves as anonymous modules, and avoid setting a global if an
// AMD loader is present. jQuery is a special case. For more information, see
// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon

if ( typeof define === "function" && define.amd ) {
	define( "jquery", [], function() {
		return jQuery;
	} );
}




var

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$;

jQuery.noConflict = function( deep ) {
	if ( window.$ === jQuery ) {
		window.$ = _$;
	}

	if ( deep && window.jQuery === jQuery ) {
		window.jQuery = _jQuery;
	}

	return jQuery;
};

// Expose jQuery and $ identifiers, even in AMD
// (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
// and CommonJS for browser emulators (#13566)
if ( !noGlobal ) {
	window.jQuery = window.$ = jQuery;
}




return jQuery;
} );

},{}],5:[function(require,module,exports){
/*!
 * JavaScript Cookie v2.2.0
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

				if (!this.json && cookie.charAt(0) === '"') {
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

},{}],6:[function(require,module,exports){
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

},{"charenc":1,"crypt":2,"is-buffer":3}],7:[function(require,module,exports){
(function (global){
/*
PNotify 3.2.0 sciactive.com/pnotify/
(C) 2015 Hunter Perrin; Google, Inc.
license Apache-2.0
*/
!function(t,i){"function"==typeof define&&define.amd?define("pnotify",["jquery"],function(s){return i(s,t)}):"object"==typeof exports&&"undefined"!=typeof module?module.exports=i(require("jquery"),global||t):t.PNotify=i(t.jQuery,t)}("undefined"!=typeof window?window:this,function(t,i){var s=function(i){var e,o,n={dir1:"down",dir2:"left",push:"bottom",spacing1:36,spacing2:36,context:t("body"),modal:!1},a=t(i),r=function(){o=t("body"),c.prototype.options.stack.context=o,a=t(i),a.bind("resize",function(){e&&clearTimeout(e),e=setTimeout(function(){c.positionAll(!0)},10)})},h=function(i){var s=t("<div />",{class:"ui-pnotify-modal-overlay"});return s.prependTo(i.context),i.overlay_close&&s.click(function(){c.removeStack(i)}),s},c=function(t){this.state="initializing",this.timer=null,this.animTimer=null,this.styles=null,this.elem=null,this.container=null,this.title_container=null,this.text_container=null,this.animating=!1,this.timerHide=!1,this.parseOptions(t),this.init()};return t.extend(c.prototype,{version:"3.2.0",options:{title:!1,title_escape:!1,text:!1,text_escape:!1,styling:"brighttheme",addclass:"",cornerclass:"",auto_display:!0,width:"300px",min_height:"16px",type:"notice",icon:!0,animation:"fade",animate_speed:"normal",shadow:!0,hide:!0,delay:8e3,mouse_reset:!0,remove:!0,insert_brs:!0,destroy:!0,stack:n},modules:{},runModules:function(t,i){var s;for(var e in this.modules)s="object"==typeof i&&e in i?i[e]:i,"function"==typeof this.modules[e][t]&&(this.modules[e].notice=this,this.modules[e].options="object"==typeof this.options[e]?this.options[e]:{},this.modules[e][t](this,"object"==typeof this.options[e]?this.options[e]:{},s))},init:function(){var i=this;return this.modules={},t.extend(!0,this.modules,c.prototype.modules),"object"==typeof this.options.styling?this.styles=this.options.styling:this.styles=c.styling[this.options.styling],this.elem=t("<div />",{class:"ui-pnotify "+this.options.addclass,css:{display:"none"},"aria-live":"assertive","aria-role":"alertdialog",mouseenter:function(t){if(i.options.mouse_reset&&"out"===i.animating){if(!i.timerHide)return;i.cancelRemove()}i.options.hide&&i.options.mouse_reset&&i.cancelRemove()},mouseleave:function(t){i.options.hide&&i.options.mouse_reset&&"out"!==i.animating&&i.queueRemove(),c.positionAll()}}),"fade"===this.options.animation&&this.elem.addClass("ui-pnotify-fade-"+this.options.animate_speed),this.container=t("<div />",{class:this.styles.container+" ui-pnotify-container "+("error"===this.options.type?this.styles.error:"info"===this.options.type?this.styles.info:"success"===this.options.type?this.styles.success:this.styles.notice),role:"alert"}).appendTo(this.elem),""!==this.options.cornerclass&&this.container.removeClass("ui-corner-all").addClass(this.options.cornerclass),this.options.shadow&&this.container.addClass("ui-pnotify-shadow"),!1!==this.options.icon&&t("<div />",{class:"ui-pnotify-icon"}).append(t("<span />",{class:!0===this.options.icon?"error"===this.options.type?this.styles.error_icon:"info"===this.options.type?this.styles.info_icon:"success"===this.options.type?this.styles.success_icon:this.styles.notice_icon:this.options.icon})).prependTo(this.container),this.title_container=t("<h4 />",{class:"ui-pnotify-title"}).appendTo(this.container),!1===this.options.title?this.title_container.hide():this.options.title_escape?this.title_container.text(this.options.title):this.title_container.html(this.options.title),this.text_container=t("<div />",{class:"ui-pnotify-text","aria-role":"alert"}).appendTo(this.container),!1===this.options.text?this.text_container.hide():this.options.text_escape?this.text_container.text(this.options.text):this.text_container.html(this.options.insert_brs?String(this.options.text).replace(/\n/g,"<br />"):this.options.text),"string"==typeof this.options.width&&this.elem.css("width",this.options.width),"string"==typeof this.options.min_height&&this.container.css("min-height",this.options.min_height),"top"===this.options.stack.push?c.notices=t.merge([this],c.notices):c.notices=t.merge(c.notices,[this]),"top"===this.options.stack.push&&this.queuePosition(!1,1),this.options.stack.animation=!1,this.runModules("init"),this.state="closed",this.options.auto_display&&this.open(),this},update:function(i){var s=this.options;return this.parseOptions(s,i),this.elem.removeClass("ui-pnotify-fade-slow ui-pnotify-fade-normal ui-pnotify-fade-fast"),"fade"===this.options.animation&&this.elem.addClass("ui-pnotify-fade-"+this.options.animate_speed),this.options.cornerclass!==s.cornerclass&&this.container.removeClass("ui-corner-all "+s.cornerclass).addClass(this.options.cornerclass),this.options.shadow!==s.shadow&&(this.options.shadow?this.container.addClass("ui-pnotify-shadow"):this.container.removeClass("ui-pnotify-shadow")),!1===this.options.addclass?this.elem.removeClass(s.addclass):this.options.addclass!==s.addclass&&this.elem.removeClass(s.addclass).addClass(this.options.addclass),!1===this.options.title?this.title_container.slideUp("fast"):this.options.title!==s.title&&(this.options.title_escape?this.title_container.text(this.options.title):this.title_container.html(this.options.title),!1===s.title&&this.title_container.slideDown(200)),!1===this.options.text?this.text_container.slideUp("fast"):this.options.text!==s.text&&(this.options.text_escape?this.text_container.text(this.options.text):this.text_container.html(this.options.insert_brs?String(this.options.text).replace(/\n/g,"<br />"):this.options.text),!1===s.text&&this.text_container.slideDown(200)),this.options.type!==s.type&&this.container.removeClass(this.styles.error+" "+this.styles.notice+" "+this.styles.success+" "+this.styles.info).addClass("error"===this.options.type?this.styles.error:"info"===this.options.type?this.styles.info:"success"===this.options.type?this.styles.success:this.styles.notice),(this.options.icon!==s.icon||!0===this.options.icon&&this.options.type!==s.type)&&(this.container.find("div.ui-pnotify-icon").remove(),!1!==this.options.icon&&t("<div />",{class:"ui-pnotify-icon"}).append(t("<span />",{class:!0===this.options.icon?"error"===this.options.type?this.styles.error_icon:"info"===this.options.type?this.styles.info_icon:"success"===this.options.type?this.styles.success_icon:this.styles.notice_icon:this.options.icon})).prependTo(this.container)),this.options.width!==s.width&&this.elem.animate({width:this.options.width}),this.options.min_height!==s.min_height&&this.container.animate({minHeight:this.options.min_height}),this.options.hide?s.hide||this.queueRemove():this.cancelRemove(),this.queuePosition(!0),this.runModules("update",s),this},open:function(){this.state="opening",this.runModules("beforeOpen");var t=this;return this.elem.parent().length||this.elem.appendTo(this.options.stack.context?this.options.stack.context:o),"top"!==this.options.stack.push&&this.position(!0),this.animateIn(function(){t.queuePosition(!0),t.options.hide&&t.queueRemove(),t.state="open",t.runModules("afterOpen")}),this},remove:function(s){this.state="closing",this.timerHide=!!s,this.runModules("beforeClose");var e=this;return this.timer&&(i.clearTimeout(this.timer),this.timer=null),this.animateOut(function(){if(e.state="closed",e.runModules("afterClose"),e.queuePosition(!0),e.options.remove&&e.elem.detach(),e.runModules("beforeDestroy"),e.options.destroy&&null!==c.notices){var i=t.inArray(e,c.notices);-1!==i&&c.notices.splice(i,1)}e.runModules("afterDestroy")}),this},get:function(){return this.elem},parseOptions:function(i,s){this.options=t.extend(!0,{},c.prototype.options),this.options.stack=c.prototype.options.stack;for(var e,o=[i,s],n=0;n<o.length&&void 0!==(e=o[n]);n++)if("object"!=typeof e)this.options.text=e;else for(var a in e)this.modules[a]?t.extend(!0,this.options[a],e[a]):this.options[a]=e[a]},animateIn:function(t){this.animating="in";var i=this,s=function(){i.animTimer&&clearTimeout(i.animTimer),"in"===i.animating&&(i.elem.is(":visible")?(t&&t.call(),i.animating=!1):i.animTimer=setTimeout(s,40))};"fade"===this.options.animation?(this.elem.one("webkitTransitionEnd mozTransitionEnd MSTransitionEnd oTransitionEnd transitionend",s).addClass("ui-pnotify-in"),this.elem.css("opacity"),this.elem.addClass("ui-pnotify-fade-in"),this.animTimer=setTimeout(s,650)):(this.elem.addClass("ui-pnotify-in"),s())},animateOut:function(i){this.animating="out";var s=this,e=function(){if(s.animTimer&&clearTimeout(s.animTimer),"out"===s.animating)if("0"!=s.elem.css("opacity")&&s.elem.is(":visible"))s.animTimer=setTimeout(e,40);else{if(s.elem.removeClass("ui-pnotify-in"),s.options.stack.overlay){var o=!1;t.each(c.notices,function(t,i){i!=s&&i.options.stack===s.options.stack&&"closed"!=i.state&&(o=!0)}),o||s.options.stack.overlay.hide()}i&&i.call(),s.animating=!1}};"fade"===this.options.animation?(this.elem.one("webkitTransitionEnd mozTransitionEnd MSTransitionEnd oTransitionEnd transitionend",e).removeClass("ui-pnotify-fade-in"),this.animTimer=setTimeout(e,650)):(this.elem.removeClass("ui-pnotify-in"),e())},position:function(t){var i=this.options.stack,s=this.elem;if(void 0===i.context&&(i.context=o),i){"number"!=typeof i.nextpos1&&(i.nextpos1=i.firstpos1),"number"!=typeof i.nextpos2&&(i.nextpos2=i.firstpos2),"number"!=typeof i.addpos2&&(i.addpos2=0);var e=!s.hasClass("ui-pnotify-in");if(!e||t){i.modal&&(i.overlay?i.overlay.show():i.overlay=h(i)),s.addClass("ui-pnotify-move");var n,r,c;switch(i.dir1){case"down":c="top";break;case"up":c="bottom";break;case"left":c="right";break;case"right":c="left"}n=parseInt(s.css(c).replace(/(?:\..*|[^0-9.])/g,"")),isNaN(n)&&(n=0),void 0!==i.firstpos1||e||(i.firstpos1=n,i.nextpos1=i.firstpos1);var p;switch(i.dir2){case"down":p="top";break;case"up":p="bottom";break;case"left":p="right";break;case"right":p="left"}switch(r=parseInt(s.css(p).replace(/(?:\..*|[^0-9.])/g,"")),isNaN(r)&&(r=0),void 0!==i.firstpos2||e||(i.firstpos2=r,i.nextpos2=i.firstpos2),("down"===i.dir1&&i.nextpos1+s.height()>(i.context.is(o)?a.height():i.context.prop("scrollHeight"))||"up"===i.dir1&&i.nextpos1+s.height()>(i.context.is(o)?a.height():i.context.prop("scrollHeight"))||"left"===i.dir1&&i.nextpos1+s.width()>(i.context.is(o)?a.width():i.context.prop("scrollWidth"))||"right"===i.dir1&&i.nextpos1+s.width()>(i.context.is(o)?a.width():i.context.prop("scrollWidth")))&&(i.nextpos1=i.firstpos1,i.nextpos2+=i.addpos2+(void 0===i.spacing2?25:i.spacing2),i.addpos2=0),"number"==typeof i.nextpos2&&(i.animation?s.css(p,i.nextpos2+"px"):(s.removeClass("ui-pnotify-move"),s.css(p,i.nextpos2+"px"),s.css(p),s.addClass("ui-pnotify-move"))),i.dir2){case"down":case"up":s.outerHeight(!0)>i.addpos2&&(i.addpos2=s.height());break;case"left":case"right":s.outerWidth(!0)>i.addpos2&&(i.addpos2=s.width())}switch("number"==typeof i.nextpos1&&(i.animation?s.css(c,i.nextpos1+"px"):(s.removeClass("ui-pnotify-move"),s.css(c,i.nextpos1+"px"),s.css(c),s.addClass("ui-pnotify-move"))),i.dir1){case"down":case"up":i.nextpos1+=s.height()+(void 0===i.spacing1?25:i.spacing1);break;case"left":case"right":i.nextpos1+=s.width()+(void 0===i.spacing1?25:i.spacing1)}}return this}},queuePosition:function(t,i){return e&&clearTimeout(e),i||(i=10),e=setTimeout(function(){c.positionAll(t)},i),this},cancelRemove:function(){return this.timer&&i.clearTimeout(this.timer),this.animTimer&&i.clearTimeout(this.animTimer),"closing"===this.state&&(this.state="open",this.animating=!1,this.elem.addClass("ui-pnotify-in"),"fade"===this.options.animation&&this.elem.addClass("ui-pnotify-fade-in")),this},queueRemove:function(){var t=this;return this.cancelRemove(),this.timer=i.setTimeout(function(){t.remove(!0)},isNaN(this.options.delay)?0:this.options.delay),this}}),t.extend(c,{notices:[],reload:s,removeAll:function(){t.each(c.notices,function(t,i){i.remove&&i.remove(!1)})},removeStack:function(i){t.each(c.notices,function(t,s){s.remove&&s.options.stack===i&&s.remove(!1)})},positionAll:function(i){if(e&&clearTimeout(e),e=null,c.notices&&c.notices.length)t.each(c.notices,function(t,s){var e=s.options.stack;e&&(e.overlay&&e.overlay.hide(),e.nextpos1=e.firstpos1,e.nextpos2=e.firstpos2,e.addpos2=0,e.animation=i)}),t.each(c.notices,function(t,i){i.position()});else{var s=c.prototype.options.stack;s&&(delete s.nextpos1,delete s.nextpos2)}},styling:{brighttheme:{container:"brighttheme",notice:"brighttheme-notice",notice_icon:"brighttheme-icon-notice",info:"brighttheme-info",info_icon:"brighttheme-icon-info",success:"brighttheme-success",success_icon:"brighttheme-icon-success",error:"brighttheme-error",error_icon:"brighttheme-icon-error"},bootstrap3:{container:"alert",notice:"alert-warning",notice_icon:"glyphicon glyphicon-exclamation-sign",info:"alert-info",info_icon:"glyphicon glyphicon-info-sign",success:"alert-success",success_icon:"glyphicon glyphicon-ok-sign",error:"alert-danger",error_icon:"glyphicon glyphicon-warning-sign"}}}),c.styling.fontawesome=t.extend({},c.styling.bootstrap3),t.extend(c.styling.fontawesome,{notice_icon:"fa fa-exclamation-circle",info_icon:"fa fa-info",success_icon:"fa fa-check",error_icon:"fa fa-warning"}),i.document.body?r():t(r),c};return s(i)});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"jquery":4}],8:[function(require,module,exports){
/* Riot v3.7.4, @license MIT */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.riot = {})));
}(this, (function (exports) { 'use strict';

var __TAGS_CACHE = [];
var __TAG_IMPL = {};
var YIELD_TAG = 'yield';
var GLOBAL_MIXIN = '__global_mixin';
var ATTRS_PREFIX = 'riot-';
var REF_DIRECTIVES = ['ref', 'data-ref'];
var IS_DIRECTIVE = 'data-is';
var CONDITIONAL_DIRECTIVE = 'if';
var LOOP_DIRECTIVE = 'each';
var LOOP_NO_REORDER_DIRECTIVE = 'no-reorder';
var SHOW_DIRECTIVE = 'show';
var HIDE_DIRECTIVE = 'hide';
var KEY_DIRECTIVE = 'key';
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
var CASE_SENSITIVE_ATTRIBUTES = {
    'viewbox': 'viewBox',
    'preserveaspectratio': 'preserveAspectRatio'
  };
var RE_BOOL_ATTRS = /^(?:disabled|checked|readonly|required|allowfullscreen|auto(?:focus|play)|compact|controls|default|formnovalidate|hidden|ismap|itemscope|loop|multiple|muted|no(?:resize|shade|validate|wrap)?|open|reversed|seamless|selected|sortable|truespeed|typemustmatch)$/;
var IE_VERSION = (WIN && WIN.document || {}).documentMode | 0;

/**
 * Shorter and fast way to select multiple nodes in the DOM
 * @param   { String } selector - DOM selector
 * @param   { Object } ctx - DOM node where the targets of our search will is located
 * @returns { Object } dom nodes found
 */
function $$(selector, ctx) {
  return [].slice.call((ctx || document).querySelectorAll(selector))
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
 * Check if a DOM node is an svg tag or part of an svg
 * @param   { HTMLElement }  el - node we want to test
 * @returns {Boolean} true if it's an svg node
 */
function isSvg(el) {
  var owner = el.ownerSVGElement;
  return !!owner || owner === null
}

/**
 * Create a generic DOM node
 * @param   { String } name - name of the DOM node we want to create
 * @returns { Object } DOM node just created
 */
function mkEl(name) {
  return name === 'svg' ? document.createElementNS(SVG_NS, name) : document.createElement(name)
}

/**
 * Set the inner html of any DOM node SVGs included
 * @param { Object } container - DOM node where we'll inject new html
 * @param { String } html - html to inject
 * @param { Boolean } isSvg - svg tags should be treated a bit differently
 */
/* istanbul ignore next */
function setInnerHTML(container, html, isSvg) {
  // innerHTML is not supported on svg tags so we neet to treat them differently
  if (isSvg) {
    var node = container.ownerDocument.importNode(
      new DOMParser()
        .parseFromString(("<svg xmlns=\"" + SVG_NS + "\">" + html + "</svg>"), 'application/xml')
        .documentElement,
      true
    );

    container.appendChild(node);
  } else {
    container.innerHTML = html;
  }
}

/**
 * Toggle the visibility of any DOM node
 * @param   { Object }  dom - DOM node we want to hide
 * @param   { Boolean } show - do we want to show it?
 */

function toggleVisibility(dom, show) {
  dom.style.display = show ? '' : 'none';
  dom.hidden = show ? false : true;
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
    // replace any user node or insert the new one into the head
    var userNode = $('style[type=riot]');

    setAttr(newNode, 'type', 'text/css');
    /* istanbul ignore next */
    if (userNode) {
      if (userNode.id) { newNode.id = userNode.id; }
      userNode.parentNode.replaceChild(newNode, userNode);
    } else { document.head.appendChild(newNode); }

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
  return isNil(value) || value === ''
}

/**
 * Check against the null and undefined values
 * @param   { * }  value -
 * @returns {Boolean} -
 */
function isNil(value) {
  return isUndefined(value) || value === null
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
 * @returns { Boolean } true if writable
 */
function isWritable(obj, key) {
  var descriptor = getPropDescriptor(obj, key);
  return isUndefined(obj[key]) || descriptor && descriptor.writable
}


var check = Object.freeze({
	isBoolAttr: isBoolAttr,
	isFunction: isFunction,
	isObject: isObject,
	isUndefined: isUndefined,
	isString: isString,
	isBlank: isBlank,
	isNil: isNil,
	isArray: isArray,
	isWritable: isWritable
});

/**
 * Specialized function for looping an array-like collection with `each={}`
 * @param   { Array } list - collection of items
 * @param   {Function} fn - callback function
 * @returns { Array } the array looped
 */
function each(list, fn) {
  var len = list ? list.length : 0;
  var i = 0;
  for (; i < len; i++) { fn(list[i], i); }
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
 * Function returning always a unique identifier
 * @returns { Number } - number from 0...n
 */
var uid = (function() {
  var i = -1;
  return function () { return ++i; }
})();

/**
 * Short alias for Object.getOwnPropertyDescriptor
 */
var getPropDescriptor = function (o, k) { return Object.getOwnPropertyDescriptor(o, k); };

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
  var i = 1;
  var args = arguments;
  var l = args.length;

  for (; i < l; i++) {
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
	uid: uid,
	getPropDescriptor: getPropDescriptor,
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
  var tag = expr.tag || expr.dom._tag;
  var ref;

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
  parent.__.onUnmount = function () {
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

  var dom = expr.dom;
  // remove the riot- prefix
  var attrName = normalizeAttrName(expr.attr);
  var isToggle = contains([SHOW_DIRECTIVE, HIDE_DIRECTIVE], attrName);
  var isVirtual = expr.root && expr.root.tagName === 'VIRTUAL';
  var ref = this.__;
  var isAnonymous = ref.isAnonymous;
  var parent = dom && (expr.parent || dom.parentNode);
  // detect the style attributes
  var isStyleAttr = attrName === 'style';
  var isClassAttr = attrName === 'class';

  var value;

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

  var context = isToggle && !isAnonymous ? inheritParentProps.call(this) : this;

  // ...it seems to be a simple expression so we try to calculate its value
  value = tmpl(expr.expr, context);

  var hasValue = !isBlank(value);
  var isObj = isObject(value);

  // convert the style/class objects to strings
  if (isObj) {
    if (isClassAttr) {
      value = tmpl(JSON.stringify(value), this);
    } else if (isStyleAttr) {
      value = styleObjectToString(value);
    }
  }

  // remove original attribute
  if (expr.attr && (!expr.wasParsedOnce || !hasValue || value === false)) {
    // remove either riot-* attributes or just the attribute name
    remAttr(dom, getAttr(dom, expr.attr) ? expr.attr : attrName);
  }

  // for the boolean attributes we don't need the value
  // we can convert it to checked=true to checked=checked
  if (expr.bool) { value = value ? attrName : false; }
  if (expr.isRtag) { return updateDataIs(expr, this, value) }
  if (expr.wasParsedOnce && expr.value === value) { return }

  // update the expression value
  expr.value = value;
  expr.wasParsedOnce = true;

  // if the value is an object (and it's not a style or class attribute) we can not do much more with it
  if (isObj && !isClassAttr && !isStyleAttr && !isToggle) { return }
  // avoid to render undefined/null values
  if (!hasValue) { value = ''; }

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
    } else if (hasValue && value !== false) {
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
      this.expressions = parseExpressions.apply(this.tag, [this.current, true]);
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
 * Return the value we want to use to lookup the postion of our items in the collection
 * @param   { String }  keyAttr         - lookup string or expression
 * @param   { * }       originalItem    - original item from the collection
 * @param   { Object }  keyedItem       - object created by riot via { item, i in collection }
 * @param   { Boolean } hasKeyAttrExpr  - flag to check whether the key is an expression
 * @returns { * } value that we will use to figure out the item position via collection.indexOf
 */
function getItemId(keyAttr, originalItem, keyedItem, hasKeyAttrExpr) {
  if (keyAttr) {
    return hasKeyAttrExpr ?  tmpl(keyAttr, keyedItem) :  originalItem[keyAttr]
  }

  return originalItem
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
  var keyAttr = getAttr(dom, KEY_DIRECTIVE);
  var hasKeyAttrExpr = keyAttr ? tmpl.hasExpr(keyAttr) : false;
  var tagName = getTagName(dom);
  var impl = __TAG_IMPL[tagName];
  var parentNode = dom.parentNode;
  var placeholder = createDOMPlaceholder();
  var child = getTag(dom);
  var ifExpr = getAttr(dom, CONDITIONAL_DIRECTIVE);
  var tags = [];
  var isLoop = true;
  var innerHTML = dom.innerHTML;
  var isAnonymous = !__TAG_IMPL[tagName];
  var isVirtual = dom.tagName === 'VIRTUAL';
  var oldItems = [];
  var hasKeys;

  // remove the each property from the original tag
  remAttr(dom, LOOP_DIRECTIVE);
  remAttr(dom, KEY_DIRECTIVE);

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
    var tmpItems = [];

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
    each(items, function (_item, i) {
      var item = !hasKeys && expr.key ? mkitem(expr, _item, i) : _item;
      var itemId = getItemId(keyAttr, _item, item, hasKeyAttrExpr);
      // reorder only if the items are objects
      var doReorder = mustReorder && typeof _item === T_OBJECT && !hasKeys;
      var oldPos = oldItems.indexOf(itemId);
      var isNew = oldPos === -1;
      var pos = !isNew && doReorder ? oldPos : i;
      // does a tag exist in this position?
      var tag = tags[pos];
      var mustAppend = i >= oldItems.length;
      var mustCreate =  doReorder && isNew || !doReorder && !tag;

      // new tag
      if (mustCreate) {
        tag = createTag(impl, {
          parent: parent,
          isLoop: isLoop,
          isAnonymous: isAnonymous,
          tagName: tagName,
          root: dom.cloneNode(isAnonymous),
          item: item,
          index: i,
        }, innerHTML);

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
        if (keyAttr || contains(items, oldItems[pos])) {
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

      tmpItems[i] = itemId;

      if (!mustCreate) { tag.update(item); }
    });

    // remove the redundant tags
    unmountRedundant(items, tags);

    // clone the items array
    oldItems = tmpItems.slice();

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
 * @param   { Boolean } mustIncludeRoot - flag to decide whether the root must be parsed as well
 * @returns { Array } all the expressions found
 */
function parseExpressions(root, mustIncludeRoot) {
  var this$1 = this;

  var expressions = [];

  walkNodes(root, function (dom) {
    var type = dom.nodeType;
    var attr;
    var tagImpl;

    if (!mustIncludeRoot && dom === root) { return }

    // text node
    if (type === 3 && dom.parentNode.tagName !== 'STYLE' && tmpl.hasExpr(dom.nodeValue))
      { expressions.push({dom: dom, expr: dom.nodeValue}); }

    if (type !== 1) { return }

    var isVirtual = dom.tagName === 'VIRTUAL';

    // loop. each does it's own thing (for now)
    if (attr = getAttr(dom, LOOP_DIRECTIVE)) {
      if(isVirtual) { setAttr(dom, 'loopVirtual', true); } // ignore here, handled in _each
      expressions.push(_each(dom, this$1, attr));
      return false
    }

    // if-attrs become the new parent. Any following expressions (either on the current
    // element, or below it) become children of this expression.
    if (attr = getAttr(dom, CONDITIONAL_DIRECTIVE)) {
      expressions.push(Object.create(IfExpr).init(dom, this$1, attr));
      return false
    }

    if (attr = getAttr(dom, IS_DIRECTIVE)) {
      if (tmpl.hasExpr(attr)) {
        expressions.push({
          isRtag: true,
          expr: attr,
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
        var tag = createTag(
          {tmpl: dom.outerHTML},
          {root: dom, parent: this$1},
          dom.innerHTML
        );

        expressions.push(tag); // no return, anonymous tag, keep parsing
      } else {
        expressions.push(
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
      expressions.push(expr);
    }]);
  });

  return expressions
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

    if (contains(REF_DIRECTIVES, name) && dom.tagName.toLowerCase() !== YIELD_TAG) {
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
    { setInnerHTML(el, tmpl, isSvg$$1); }

  return el
}

/**
 * Another way to create a riot tag a bit more es6 friendly
 * @param { HTMLElement } el - tag DOM selector or DOM node/s
 * @param { Object } opts - tag logic
 * @returns { Tag } new riot tag instance
 */
function Tag$1(el, opts) {
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

var version$1 = 'v3.7.4';


var core = Object.freeze({
	Tag: Tag$1,
	tag: tag$1,
	tag2: tag2$1,
	mount: mount$1,
	mixin: mixin$1,
	update: update$1,
	unregister: unregister$1,
	version: version$1
});

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
  var ctx = isLoop ? inheritParentProps.call(this) : parent || this;

  each(instAttrs, function (attr) {
    if (attr.expr) { updateExpression.call(ctx, attr.expr); }
    // normalize the attribute names
    opts[toCamel(attr.name).replace(ATTRS_PREFIX, '')] = attr.expr ? attr.expr.value : attr.value;
  });
}

/**
 * Manage the mount state of a tag triggering also the observable events
 * @this Tag
 * @param { Boolean } value - ..of the isMounted flag
 */
function setMountState(value) {
  var ref = this.__;
  var isAnonymous = ref.isAnonymous;

  defineProperty(this, 'isMounted', value);

  if (!isAnonymous) {
    if (value) { this.trigger('mount'); }
    else {
      this.trigger('unmount');
      this.off('*');
      this.__.wasCreated = false;
    }
  }
}


/**
 * Tag creation factory function
 * @constructor
 * @param { Object } impl - it contains the tag template, and logic
 * @param { Object } conf - tag options
 * @param { String } innerHTML - html that eventually we need to inject in the tag
 */
function createTag(impl, conf, innerHTML) {
  if ( impl === void 0 ) impl = {};
  if ( conf === void 0 ) conf = {};

  var tag = conf.context || {};
  var opts = extend({}, conf.opts);
  var parent = conf.parent;
  var isLoop = conf.isLoop;
  var isAnonymous = !!conf.isAnonymous;
  var skipAnonymous = settings$1.skipAnonymousTags && isAnonymous;
  var item = conf.item;
  // available only for the looped nodes
  var index = conf.index;
  // All attributes on the Tag when it's first parsed
  var instAttrs = [];
  // expressions on this type of Tag
  var implAttrs = [];
  var expressions = [];
  var root = conf.root;
  var tagName = conf.tagName || getTagName(root);
  var isVirtual = tagName === 'virtual';
  var isInline = !isVirtual && !impl.tmpl;
  var dom;

  // make this tag observable
  if (!skipAnonymous) { observable$1(tag); }
  // only call unmount if we have a valid __TAG_IMPL (has name property)
  if (impl.name && root._tag) { root._tag.unmount(true); }

  // not yet mounted
  defineProperty(tag, 'isMounted', false);

  defineProperty(tag, '__', {
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
  defineProperty(tag, '_riot_id', uid()); // base 1 allows test !t._riot_id
  defineProperty(tag, 'root', root);
  extend(tag, { opts: opts }, item);
  // protect the "tags" and "refs" property from being overridden
  defineProperty(tag, 'parent', parent || null);
  defineProperty(tag, 'tags', {});
  defineProperty(tag, 'refs', {});

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
  defineProperty(tag, 'update', function tagUpdate(data) {
    var nextOpts = {};
    var canTrigger = tag.isMounted && !skipAnonymous;

    // inherit properties from the parent tag
    if (isAnonymous && parent) { extend(tag, parent); }
    extend(tag, data);

    updateOpts.apply(tag, [isLoop, parent, isAnonymous, nextOpts, instAttrs]);

    if (
      canTrigger &&
      tag.isMounted &&
      isFunction(tag.shouldUpdate) && !tag.shouldUpdate(data, nextOpts)
    ) {
      return tag
    }

    extend(opts, nextOpts);

    if (canTrigger) { tag.trigger('update', data); }
    updateAllExpressions.call(tag, expressions);
    if (canTrigger) { tag.trigger('updated'); }

    return tag
  });

  /**
   * Add a mixin to this tag
   * @returns { Tag } the current tag instance
   */
  defineProperty(tag, 'mixin', function tagMixin() {
    each(arguments, function (mix) {
      var instance;
      var obj;
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
        // bind methods to tag
        // allow mixins to override other properties/parent mixins
        if (!contains(propsBlacklist, key)) {
          // check for getters/setters
          var descriptor = getPropDescriptor(instance, key) || getPropDescriptor(proto, key);
          var hasGetterSetter = descriptor && (descriptor.get || descriptor.set);

          // apply method only if it does not already exist on the instance
          if (!tag.hasOwnProperty(key) && hasGetterSetter) {
            Object.defineProperty(tag, key, descriptor);
          } else {
            tag[key] = isFunction(instance[key]) ?
              instance[key].bind(tag) :
              instance[key];
          }
        }
      });

      // init method will be called automatically
      if (instance.init)
        { instance.init.bind(tag)(opts); }
    });

    return tag
  });

  /**
   * Mount the current tag instance
   * @returns { Tag } the current tag instance
   */
  defineProperty(tag, 'mount', function tagMount() {
    root._tag = tag; // keep a reference to the tag just created

    // Read all the attrs on this instance. This give us the info we need for updateOpts
    parseAttributes.apply(parent, [root, root.attributes, function (attr, expr) {
      if (!isAnonymous && RefExpr.isPrototypeOf(expr)) { expr.tag = tag; }
      attr.expr = expr;
      instAttrs.push(attr);
    }]);

    // update the root adding custom attributes coming from the compiler
    walkAttrs(impl.attrs, function (k, v) { implAttrs.push({name: k, value: v}); });
    parseAttributes.apply(tag, [root, implAttrs, function (attr, expr) {
      if (expr) { expressions.push(expr); }
      else { setAttr(root, attr.name, attr.value); }
    }]);

    // initialiation
    updateOpts.apply(tag, [isLoop, parent, isAnonymous, opts, instAttrs]);

    // add global mixins
    var globalMixin = mixin$1(GLOBAL_MIXIN);

    if (globalMixin && !skipAnonymous) {
      for (var i in globalMixin) {
        if (globalMixin.hasOwnProperty(i)) {
          tag.mixin(globalMixin[i]);
        }
      }
    }

    if (impl.fn) { impl.fn.call(tag, opts); }

    if (!skipAnonymous) { tag.trigger('before-mount'); }

    // parse layout after init. fn may calculate args for nested custom tags
    each(parseExpressions.apply(tag, [dom, isAnonymous]), function (e) { return expressions.push(e); });

    tag.update(item);

    if (!isAnonymous && !isInline) {
      while (dom.firstChild) { root.appendChild(dom.firstChild); }
    }

    defineProperty(tag, 'root', root);

    // if we need to wait that the parent "mount" or "updated" event gets triggered
    if (!skipAnonymous && tag.parent) {
      var p = getImmediateCustomParentTag(tag.parent);
      p.one(!p.isMounted ? 'mount' : 'updated', function () {
        setMountState.call(tag, true);
      });
    } else {
      // otherwise it's not a child tag we can trigger its mount event
      setMountState.call(tag, true);
    }

    tag.__.wasCreated = true;

    return tag

  });

  /**
   * Unmount the tag instance
   * @param { Boolean } mustKeepRoot - if it's true the root node will not be removed
   * @returns { Tag } the current tag instance
   */
  defineProperty(tag, 'unmount', function tagUnmount(mustKeepRoot) {
    var el = tag.root;
    var p = el.parentNode;
    var tagIndex = __TAGS_CACHE.indexOf(tag);

    if (!skipAnonymous) { tag.trigger('before-unmount'); }

    // clear all attributes coming from the mounted tag
    walkAttrs(impl.attrs, function (name) {
      if (startsWith(name, ATTRS_PREFIX))
        { name = name.slice(ATTRS_PREFIX.length); }

      remAttr(root, name);
    });

    // remove all the event listeners
    tag.__.listeners.forEach(function (dom) {
      Object.keys(dom[RIOT_EVENTS_KEY]).forEach(function (eventName) {
        dom.removeEventListener(eventName, dom[RIOT_EVENTS_KEY][eventName]);
      });
    });

    // remove tag instance from the global tags cache collection
    if (tagIndex !== -1) { __TAGS_CACHE.splice(tagIndex, 1); }

    // clean up the parent tags object
    if (parent && !isAnonymous) {
      var ptag = getImmediateCustomParentTag(parent);

      if (isVirtual) {
        Object
          .keys(tag.tags)
          .forEach(function (tagName) { return arrayishRemove(ptag.tags, tagName, tag.tags[tagName]); });
      } else {
        arrayishRemove(ptag.tags, tagName, tag);
      }
    }

    // unmount all the virtual directives
    if (tag.__.virts) {
      each(tag.__.virts, function (v) {
        if (v.parentNode) { v.parentNode.removeChild(v); }
      });
    }

    // allow expressions to unmount themselves
    unmountAll(expressions);
    each(instAttrs, function (a) { return a.expr && a.expr.unmount && a.expr.unmount(); });

    // clear the tag html if it's necessary
    if (mustKeepRoot) { setInnerHTML(el, ''); }
    // otherwise detach the root tag from the DOM
    else if (p) { p.removeChild(el); }

    // custom internal unmount function to avoid relying on the observable
    if (tag.__.onUnmount) { tag.__.onUnmount(); }

    // weird fix for a weird edge case #2409 and #2436
    // some users might use your software not as you've expected
    // so I need to add these dirty hacks to mitigate unexpected issues
    if (!tag.isMounted) { setMountState.call(tag, true); }

    setMountState.call(tag, false);

    delete tag.root._tag;

    return tag
  });

  return tag
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
  var tag = createTag(child, opts, innerHTML);
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
    if (expr.unmount) { expr.unmount(true); }
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
  } else if (obj[key] === value)
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
  var context = ctx || (implClass ? Object.create(implClass.prototype) : {});
  // cache the inner HTML to fix #855
  var innerHTML = root._innerHTML = root._innerHTML || root.innerHTML;
  var conf = extend({ root: root, opts: opts, context: context }, { parent: opts ? opts.parent : null });
  var tag;

  if (impl && root) { tag = createTag(impl, conf, innerHTML); }

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
 * Return a temporary context containing also the parent properties
 * @this Tag
 * @param { Tag } - temporary tag context containing all the parent properties
 */
function inheritParentProps() {
  if (this.parent) { return extend(Object.create(this), this.parent) }
  return this
}

/**
 * Move virtual tag and all child nodes
 * @this Tag
 * @param { Node } src  - the node that will do the inserting
 * @param { Tag } target - insert before this tag's first child
 */
function moveVirtual(src, target) {
  var this$1 = this;

  var el = this.__.head;
  var sib;
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
	inheritParentProps: inheritParentProps,
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
var Tag = Tag$1;
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

},{}],9:[function(require,module,exports){
class Adapter {
    static adaptReservation(reservation) {
        if (reservation.adapted === true)
            return reservation;
        reservation.adapted = true;
        reservation.recipe = Adapter.adaptRecipe(reservation.recipe);
        return reservation;
    }
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
        for (let i = 0; i < recipe.items.length;) {
            if (recipe.items[i] == null || recipe.items[i].replace(/ /g, "").length <= 0) {
                recipe.items.splice(i, 1);
            }
            else
                i++;
        }
        if (recipe.origin[recipe.origin.length - 1] == "" || recipe.origin[recipe.origin.length - 1] == null)
            recipe.origin.pop();
        if (recipe.items[recipe.items.length - 1] == "" || recipe.items[recipe.items.length - 1] == null)
            recipe.items.pop();
        if (recipe.pins[recipe.pins.length - 1] == "" || recipe.pins[recipe.pins.length - 1] == null)
            recipe.pins.pop();
        recipe.place_left = parseInt(recipe.places);
        if (recipe.user != null) {
            recipe.place_left -= recipe.users.length;
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
        switch (report.progress) {
            case "1":
            case 1:
            default:
                report.message_progress = "Nouveau";
                break;
            case "2":
            case 2:
                report.message_progress = "En Cours";
                break;
            case "3":
            case 3:
                report.message_progress = "Terminé";
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
            case 2:
                error.name = ErrorHandler.State.ERROR;
                error.message = response.message.split("#")[0] + ".";
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
        if (response.data != null)
            console.error(response.data);
        else
            console.error(response);
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
            NotificationManager.showNotification(error.message, "error");
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
        if (this.token == null || this.token == "null")
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
                if (error instanceof Error)
                    ErrorHandler.alertIfError(error);
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
        if (Login.GetInstance().isLogged() == false) {
            route("/");
            return;
        }
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
        App.hidePopUp();
        App.hideLoading();
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
    recipeAdd() {
        if (Login.GetInstance().isLogged() == false) {
            route("/register");
            return;
        }
        App.changePage("app-recipeedit", null);
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
    // Admin
    adminReports(target_id, author_id) {
        if (Login.GetInstance().isLogged() == false || Login.GetInstance().User().rights < 2) {
            route("/");
            return;
        }
        var filters = {};
        if (target_id != null)
            filters.target_id = target_id;
        if (author_id != null)
            filters.author_id = author_id;
        var request = App.request(App.Address + "/getreports", {
            "filters": JSON.stringify(filters)
        });
        request.then(function (response) {
            App.changePage("app-adminreports", {
                "reports": response.data
            });
        });
        request.catch(function (error) {
            ErrorHandler.alertIfError(error);
        });
    }
    adminOrigins() {
        if (Login.GetInstance().isLogged() == false || Login.GetInstance().User().rights < 2) {
            route("/");
            return;
        }
        let request = App.request(App.Address + "/getorigins", null);
        request.then(function (response) {
            App.changePage("app-adminorigins", {
                "origins": response.data
            });
        });
        request.catch(function (error) {
            ErrorHandler.alertIfError(error);
        });
    }
    adminPins() {
        if (Login.GetInstance().isLogged() == false || Login.GetInstance().User().rights < 2) {
            route("/");
            return;
        }
        let request = App.request(App.Address + "/getpinses", null);
        request.then(function (response) {
            App.changePage("app-adminpins", {
                "pins": response.data
            });
        });
        request.catch(function (error) {
            ErrorHandler.alertIfError(error);
        });
    }
    adminReservations() {
        if (Login.GetInstance().isLogged() == false || Login.GetInstance().User().rights < 2) {
            route("/");
            return;
        }
        let request = App.request(App.Address + "/getreservations", {});
        request.then(function (response) {
            App.changePage("app-adminreservations", {
                "reservations": response.data
            });
        });
        request.catch(function (error) {
            ErrorHandler.alertIfError(error);
        });
    }
    adminUsers(user_id) {
        if (Login.GetInstance().isLogged() == false || Login.GetInstance().User().rights < 2) {
            route("/");
            return;
        }
        var filters = {};
        if (user_id != null)
            filters.id = user_id;
        var request = App.request(App.Address + "/getusers", {
            "filters": JSON.stringify(filters)
        });
        request.then(function (response) {
            App.changePage("app-adminusers", {
                "users": response.data
            });
        });
        request.catch(function (error) {
            ErrorHandler.alertIfError(error);
        });
    }
    resetPassword(token) {
        let request = App.request(App.Address + "/endresetpassword", {
            "token": token
        });
        request.then(function (response) {
            NotificationManager.showNotification("Nous vous avons envoyé un email contenant votre mot de passe temporaire !", "success");
            route("/");
        });
        request.catch(function (error) {
            if (error instanceof Error)
                ErrorHandler.alertIfError(error);
        });
    }
    ///////////////////////////////////////////////////////////////
    setRoutes() {
        // ResetPassword
        route("/resetpassword/*", this.resetPassword);
        // Reservation
        route("/reservation/recipe/*", this.reservationRecipe);
        // Admin
        route("/admin/reports/by/*", (author_id) => { this.adminReports(null, author_id); });
        route("/admin/reports/to/*", (target_id) => { this.adminReports(target_id, null); });
        route("/admin/reports", () => { this.adminReports(null, null); });
        route("/admin/origins", () => { this.adminOrigins(); });
        route("/admin/pins", () => { this.adminPins(); });
        route("/admin/reservations", () => {
            this.adminReservations();
        });
        route("/admin/users", () => { this.adminUsers(null); });
        route("/admin/users/*", (user_id) => { this.adminUsers(user_id); });
        // Account
        route("/account/recipes", this.accountRecipes);
        route("/account/reservations", this.accountReservations);
        route("/account/user", this.accountUser);
        route("/account", this.accountKitchen);
        // User
        route("/user/*", this.user);
        // Recipe
        route("/recipe/edit/*", this.recipeEdit);
        route("/recipe/add", this.recipeAdd);
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
        // CGU
        route("cgu", function () {
            App.changePage("app-cgu", null);
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
// ACCOUNT
require("./../../tags/Account/AccountKitchen.tag");
require("./../../tags/Account/AccountRecipes.tag");
require("./../../tags/Account/AccountReservations.tag");
require("./../../tags/Account/AccountUser.tag");
// COMMENT
require("./../../tags/Comment/CommentEditForm.tag");
require("./../../tags/Comment/CommentItem.tag");
require("./../../tags/Comment/CommentList.tag");
require("./../../tags/Comment/Comments.tag");
// IMMUTABLE
require("./../../tags/Immutable/Error.tag");
require("./../../tags/Immutable/Home.tag");
require("./../../tags/Immutable/Login.tag");
require("./../../tags/Immutable/ResetPasswordForm.tag");
require("./../../tags/Immutable/CGU.tag");
// MISC
require("./../../tags/Misc/DateInput.tag");
require("./../../tags/Misc/Footer.tag");
require("./../../tags/Misc/Header.tag");
require("./../../tags/Misc/Hearts.tag");
require("./../../tags/Misc/ManyInputs.tag");
require("./../../tags/Misc/OriginInput.tag");
require("./../../tags/Misc/PinsInput.tag");
require("./../../tags/Misc/PlaceHint.tag");
require("./../../tags/Misc/PlaceInput.tag");
require("./../../tags/Misc/TabBar.tag");
require("./../../tags/Misc/TimeInput.tag");
require("./../../tags/Misc/UserSelector.tag");
require("./../../tags/Misc/UploadInput.tag");
// RECIPE
require("./../../tags/Recipe/Recipe.tag");
require("./../../tags/Recipe/RecipeEdit.tag");
require("./../../tags/Recipe/RecipeEditForm.tag");
require("./../../tags/Recipe/RecipeItem.tag");
require("./../../tags/Recipe/RecipeList.tag");
require("./../../tags/Recipe/Recipes.tag");
// REPORT
require("./../../tags/Report/Reports.tag");
require("./../../tags/Report/ReportItem.tag");
require("./../../tags/Report/ReportEditForm.tag");
// ORIGIN
require("./../../tags/Origin/OriginEditForm.tag");
// PIN
require("./../../tags/Pin/PinEditForm.tag");
// RESERVATION
require("./../../tags/Reservation/ReservationValidateForm.tag");
require("./../../tags/Reservation/Reservation.tag");
require("./../../tags/Reservation/ReservationItem.tag");
require("./../../tags/Reservation/Reservations.tag");
// SEARCH
require("./../../tags/Search/Search.tag");
require("./../../tags/Search/SearchItem.tag");
require("./../../tags/Search/Searcher.tag");
require("./../../tags/Search/SearchResults.tag");
// USER
require("./../../tags/User/User.tag");
require("./../../tags/User/UserEdit.tag");
require("./../../tags/User/UserEditForm.tag");
require("./../../tags/User/UserItem.tag");
require("./../../tags/User/UserPasswordForm.tag");
require("./../../tags/User/Users.tag");
// ADMIN
require("./../../tags/Admin/AdminReports.tag");
require("./../../tags/Admin/AdminOrigins.tag");
require("./../../tags/Admin/AdminPins.tag");
require("./../../tags/Admin/AdminReservations.tag");
require("./../../tags/Admin/AdminUsers.tag");
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
        NotificationManager.showNotification("Oups... Il y a une erreur dans le formulaire. Pensez à Vérifier les informations renseignées !", "error");
    }
    static request(address, data, redirect = true, bg = true) {
        return new Promise(function (resolve, reject) {
            var href = window.location.href;
            if (data == null)
                data = {};
            if (Login.GetInstance().isLogged() && data.token == null)
                data.token = Login.GetInstance().Token();
            var request = ajax({
                method: "POST",
                url: address,
                "data": data
            });
            if (bg)
                App.showLoading();
            request.then(function (response) {
                if (bg)
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
                if (bg)
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
        App.Page = riot.mount("div#app", tag, data);
        window.scroll(0, 0);
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
App.Address = "http://www.clovis-portron.cf/MC/backend/src/API";
App.Page = null;
App.PopUp = null;
App.LoadingCounter = 0;
window.addEventListener("load", function () {
    Router.GetInstance().start();
    NotificationManager.GetInstance().start();
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
            else {
                let now = Math.floor(new Date().getTime() / 1000);
                //filters["date_end"] = now;
                filters["date_start"] = now;
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
var PNotify = require("pnotify");
window.PNotify = PNotify;
class NotificationManager {
    constructor() {
        this.interval = null;
        this.session = [];
    }
    static GetInstance() {
        return NotificationManager.Instance;
    }
    static showNotification(content, type, closer = true) {
        let n = new PNotify({
            title: "Hey !",
            text: content + "<br><br><center>Cliquez pour fermer</center>",
            type: type,
            buttons: {
                closer: closer,
                sticker: closer
            }
        });
        if (closer)
            n.get().click(function () {
                n.remove();
            });
        return n;
    }
    run() {
        if (Login.GetInstance().isLogged() == false)
            return;
        let filters = {
            "User_id": Login.GetInstance().User().id,
            "new": "1"
        };
        let request = App.request(App.Address + "/getNotifications", {
            "filters": JSON.stringify(filters)
        }, true, false);
        request.then((response) => {
            response.data.forEach((n) => {
                let found = false;
                this.session.forEach(function (s) {
                    if (s == n.id) {
                        found = true;
                    }
                });
                if (found)
                    return;
                this.session.push(n.id);
                let notice = NotificationManager.showNotification(n.content, n.type, false);
                notice.get().click(function () {
                    notice.remove();
                    let request = App.request(App.Address + "/updatenotification", {
                        "id": n.id,
                        "new": 0
                    });
                });
            });
        });
        request.catch(function (error) {
            ErrorHandler.GetInstance().handle(error);
        });
    }
    start() {
        if (this.interval != null)
            return;
        this.run();
        PNotify.prototype.options.delay = PNotify.prototype.options.delay + 10000;
        this.interval = setInterval(() => { this.run(); }, 60000);
    }
    stop() {
        if (this.interval == null)
            return;
        clearInterval(this.interval);
        this.interval = null;
    }
}
NotificationManager.Instance = new NotificationManager();
/// <reference path="Login.ts" />
/// <reference path="Router.ts" />
/// <reference path="Global.ts" />
/// <reference path="Adapter.ts" />
/// <reference path="Search/Search.ts" />
/// <reference path="Notification/NotificationManager.ts" />
window.Login = Login;
window.Router = Router;
window.App = App;
window.Adapter = Adapter;
window.Search = Search;
window.ErrorHandler = ErrorHandler;
window.NotificationManager = NotificationManager;
window.md5 = require("md5");

},{"./../../tags/Account/AccountKitchen.tag":10,"./../../tags/Account/AccountRecipes.tag":11,"./../../tags/Account/AccountReservations.tag":12,"./../../tags/Account/AccountUser.tag":13,"./../../tags/Admin/AdminOrigins.tag":14,"./../../tags/Admin/AdminPins.tag":15,"./../../tags/Admin/AdminReports.tag":16,"./../../tags/Admin/AdminReservations.tag":17,"./../../tags/Admin/AdminUsers.tag":18,"./../../tags/Comment/CommentEditForm.tag":19,"./../../tags/Comment/CommentItem.tag":20,"./../../tags/Comment/CommentList.tag":21,"./../../tags/Comment/Comments.tag":22,"./../../tags/Immutable/CGU.tag":23,"./../../tags/Immutable/Error.tag":24,"./../../tags/Immutable/Home.tag":25,"./../../tags/Immutable/Login.tag":26,"./../../tags/Immutable/ResetPasswordForm.tag":27,"./../../tags/Misc/DateInput.tag":28,"./../../tags/Misc/Footer.tag":29,"./../../tags/Misc/Header.tag":30,"./../../tags/Misc/Hearts.tag":31,"./../../tags/Misc/ManyInputs.tag":32,"./../../tags/Misc/OriginInput.tag":33,"./../../tags/Misc/PinsInput.tag":34,"./../../tags/Misc/PlaceHint.tag":35,"./../../tags/Misc/PlaceInput.tag":36,"./../../tags/Misc/TabBar.tag":37,"./../../tags/Misc/TimeInput.tag":38,"./../../tags/Misc/UploadInput.tag":39,"./../../tags/Misc/UserSelector.tag":40,"./../../tags/Origin/OriginEditForm.tag":41,"./../../tags/Pin/PinEditForm.tag":42,"./../../tags/Recipe/Recipe.tag":43,"./../../tags/Recipe/RecipeEdit.tag":44,"./../../tags/Recipe/RecipeEditForm.tag":45,"./../../tags/Recipe/RecipeItem.tag":46,"./../../tags/Recipe/RecipeList.tag":47,"./../../tags/Recipe/Recipes.tag":48,"./../../tags/Report/ReportEditForm.tag":49,"./../../tags/Report/ReportItem.tag":50,"./../../tags/Report/Reports.tag":51,"./../../tags/Reservation/Reservation.tag":52,"./../../tags/Reservation/ReservationItem.tag":53,"./../../tags/Reservation/ReservationValidateForm.tag":54,"./../../tags/Reservation/Reservations.tag":55,"./../../tags/Search/Search.tag":56,"./../../tags/Search/SearchItem.tag":57,"./../../tags/Search/SearchResults.tag":58,"./../../tags/Search/Searcher.tag":59,"./../../tags/User/User.tag":60,"./../../tags/User/UserEdit.tag":61,"./../../tags/User/UserEditForm.tag":62,"./../../tags/User/UserItem.tag":63,"./../../tags/User/UserPasswordForm.tag":64,"./../../tags/User/Users.tag":65,"js-cookie":5,"md5":6,"pnotify":7,"riot":8}],10:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag2('app-accountkitchen', '<app-header></app-header> <app-tabbar tabs="{tabs}"></app-tabbar> <div class="header"> <div> <div class="img" riot-style="background-image: url(\'{user.picture}\');"></div> <div class="identity"> <h2>Bonjour {user.username}</h2> <ul> <li><a onclick="{edit}">> Modifier votre profil</a></li> <li><a onclick="{see}">> Voir votre profil public</a></li> </ul> </div> </div> </div> <div class="content"> <div class="comments"> <h1>Commentaires Récents</h1> <app-comments ref="comments" if="{comments != null}" comments="{comments}"></app-comments> </div> </div> <app-footer></app-footer>', '', '', function(opts) {
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
},{"riot":8}],11:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag2('app-accountrecipes', '<app-header></app-header> <app-tabbar tabs="{tabs}"></app-tabbar> <div class="content"> <section class="header"> <h1>La dernière recette proposée</h1> <div> <app-recipeitem if="{last_recipe != null}" recipe="{last_recipe}"></app-recipeitem> <div if="{last_recipe == null}"> Aucune recette proposée </div> </div> </section> <div class="SwitchHandler"> <span class="Switch"> <a onclick="{showFuture}" class="{selected : state == 0}">A venir</a> <a onclick="{showPast}" class="{selected : state == 1}">Passées</a> </span> </div> <app-recipes ref="recipes" recipes="{list}" if="{list != null}"></app-recipes> </div> <app-footer></app-footer>', '', '', function(opts) {
        var tag = this;
        tag.tabs = null;

        tag.last_recipe = null;
        tag.recipes = null;
        tag.list = null;

        tag.state = 0;

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

            tag.state = 0;

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

        tag.showFuture = function(a)
        {
            var lst = tag.sortRecipes(true);
            tag.showRecipes(lst);
            tag.state = 0;
        };

        tag.showPast = function(a)
        {
            var lst = tag.sortRecipes(false);
            tag.showRecipes(lst);
            tag.state = 1;

        }
});
},{"riot":8}],12:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag2('app-accountreservations', '<app-header></app-header> <app-tabbar tabs="{tabs}"></app-tabbar> <div class="content"> <app-reservations admin="{false}" reservations="{reservations}" ref="reservations"></app-reservations> </div> <app-footer></app-footer>', '', '', function(opts) {
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
},{"riot":8}],13:[function(require,module,exports){
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
            if(tag.user == null || tag.user.id === null)
            {
                NotificationManager.showNotification("Félicitation ! Vous êtes désormais un membre de Melting Cook. Vous pouvez vous connecter.", "success");
            }
            else
            {
                NotificationManager.showNotification("Vos informations ont bien été mises à jour !", "success");
            }
            route("/");
        };
});
},{"riot":8}],14:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag2('app-adminorigins', '<app-header></app-header> <app-tabbar tabs="{tabs}"></app-tabbar> <div class="content"> <a class="Action" onclick="{add}"><span>Ajouter une origine</span></a> <table> <thead> <tr> <td>Intitulé</td><td>Actions</td> </tr> </thead> <tbody> <tr each="{origin, i in origins}" id="item-{origin.id}"> <td>{origin.name}</td> <td> <a class="onclick" onclick="{edit}" data-id="{origin.id}" data-index="{i}">Editer</a> <a class="onclick" onclick="{delete}" data-id="{origin.id}">Supprimer</a> </td> </tr> </tbody> </table> </div> <app-footer></app-footer>', '', '', function(opts) {
        var tag = this;

        tag.origins = null;
        tag.tabs = [
        {
                name : "Utilisateurs",
                route : "/admin/users",
                selected : false
            },
            {
                name : "Signalement",
                route : "/admin/reports",
                selected : false
            },
            {
                name : "Transactions",
                route : "/admin/reservations",
                selected : false
            },
            {
                name : "Origines",
                route :"/admin/origins",
                selected : true
            },
            {
                name : "Les Plus",
                route :"/admin/pins",
                selected : false
            }
        ];

        tag.on("before-mount", function()
        {
           tag.origins = tag.opts.origins;
           if(tag.origins == null)
               throw new Error("Origins cant be null.");
        });

        tag.add = function(e)
        {

            var callback = function()
            {
                App.hidePopUp();
                vex.dialog.alert("L'origine a bien été ajoutée.");
                window.location.reload();
            };

            App.showPopUp("app-origineditform", "Ajout d'une origine", { "callback" : callback});
        };

        tag.edit = function(e)
        {
            let id = parseInt(e.target.getAttribute("data-index"));

            var callback = function()
            {
                App.hidePopUp();
                vex.dialog.alert("L'origine a bien été mise à jour.");
                window.location.reload();
            };

            App.showPopUp("app-origineditform", "Edition d'une origine", { "callback" : callback, "origin" : tag.origins[id]});
        };

        tag.delete = function(e)
        {
            let id = e.target.getAttribute("data-id");

            vex.dialog.confirm({
                message: 'Etes-vous sûr de vouloir supprimer cette entrée ?',
                callback: function (value) {
                    if (value) {
                        var request = App.request(App.Address + "/removeorigin", {
                            "id" : id
                        });
                        request.then(function (response) {
                            var l = document.querySelector("#item-"+id);
                            if(l != null)
                                l.remove();
                        });
                        request.catch(function(error){
                            ErrorHandler.alertIfError(error);
                        });
                    }
                }
            });

        }
});
},{"riot":8}],15:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag2('app-adminpins', '<app-header></app-header> <app-tabbar tabs="{tabs}"></app-tabbar> <div class="content"> <a class="Action" onclick="{add}"><span>Ajouter un Plus</span></a> <table> <thead> <tr> <td>Intitulé</td><td>Actions</td> </tr> </thead> <tbody> <tr each="{pin, i in pins}" id="item-{pin.id}"> <td>{pin.name}</td> <td> <a class="onclick" onclick="{delete}" data-id="{pin.id}">Supprimer</a> </td> </tr> </tbody> </table> </div> <app-footer></app-footer>', '', '', function(opts) {
        var tag = this;

        tag.pins = null;
        tag.tabs = [
            {
                name : "Utilisateurs",
                route : "/admin/users",
                selected : false
            },
            {
                name : "Signalement",
                route : "/admin/reports",
                selected : false
            },
            {
                name : "Transactions",
                route : "/admin/reservations",
                selected : false
            },
            {
                name : "Origines",
                route :"/admin/origins",
                selected : false
            },
            {
                name : "Les Plus",
                route :"/admin/pins",
                selected : true
            }
        ];

        tag.on("before-mount", function()
        {
           tag.pins = tag.opts.pins;
           if(tag.pins == null)
               throw new Error("Pins cant be null.");
        });

        tag.add = function(e)
        {

            var callback = function()
            {
                App.hidePopUp();
                vex.dialog.alert("Le Plus a bien été ajouté.");
                window.location.reload();
            };

            App.showPopUp("app-pineditform", "Ajout d'un Plus", { "callback" : callback});
        };

        tag.edit = function(e)
        {
            let id = parseInt(e.target.getAttribute("data-index"));

            var callback = function()
            {
                App.hidePopUp();
                vex.dialog.alert("Le Plus a bien été mise à jour.");
            };

            App.showPopUp("app-pineditform", "Edition d'un Plus", { "callback" : callback, "pin" : tag.pins[id]});
        };

        tag.delete = function(e)
        {
            let id = e.target.getAttribute("data-id");

            vex.dialog.confirm({
                message: 'Etes-vous sûr de vouloir supprimer cette entrée ?',
                callback: function (value) {
                    if (value) {
                        var request = App.request(App.Address + "/removepins", {
                            "id" : id
                        });
                        request.then(function (response) {
                            var l = document.querySelector("#item-"+id);
                            if(l != null)
                                l.remove();
                        });
                        request.catch(function(error){
                            ErrorHandler.alertIfError(error);
                        });
                    }
                }
            });

        }
});
},{"riot":8}],16:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag2('app-adminreports', '<app-header></app-header> <app-tabbar tabs="{tabs}"></app-tabbar> <div class="content no-margin"> <div class="search"> <form name="search-target"> <h2>Chercher par cible</h2> <app-userselector ref="target"></app-userselector> <input type="button" value="Rechercher" onclick="{showForTarget}"> </form> <form name="search-author"> <h2>Chercher par auteur</h2> <app-userselector ref="author"></app-userselector> <input type="button" value="Rechercher" onclick="{showForAuthor}"> </form> </div> <app-reports reports="{reports}"></app-reports> </div> <app-footer></app-footer>', '', '', function(opts) {
        var tag = this;

        tag.tabs = null;
        tag.reports = null;
        tag.targets = null;
        tag.authors = null;

        tag.on("before-mount", function()
        {
            tag.reports = tag.opts.reports;
            if(tag.reports == null)
                throw new Error("Reports cant be null");

            tag.tabs = [
            {
                name : "Utilisateurs",
                route : "/admin/users",
                selected : false
            },
                {
                    name : "Signalement",
                    route : "/admin/reports",
                    selected : true
                },
                {
                    name : "Transactions",
                    route : "/admin/reservations",
                    selected : false
                },
                {
                    name : "Origines",
                    route :"/admin/origins",
                    selected : false
                }
                ,
                {
                    name : "Les Plus",
                    route :"/admin/pins",
                    selected : false
                }
            ];
        });

        tag.showForTarget = function()
        {
            route("/admin/reports/to/"+tag.refs.target.value);
        };

        tag.showForAuthor = function()
        {
            route("/admin/reports/by/"+tag.refs.author.value);
        };

});
},{"riot":8}],17:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag2('app-adminreservations', '<app-header></app-header> <app-tabbar tabs="{tabs}"></app-tabbar> <div class="search"> <form> <div> <h2>Chercher par hôte</h2> <app-userselector ref="host"></app-userselector> <input type="button" value="Afficher" onclick="{showForHost}"> </div> <div> <h2>Chercher par invité</h2> <app-userselector ref="guest"></app-userselector> <input type="button" value="Afficher" onclick="{showForGuest}"> </div> </form> </div> <div class="content"> <app-reservations ref="reservations" admin="{true}" reservations="{reservations}"></app-reservations> </div>', '', '', function(opts) {
        var tag = this;

        tag.tabs = null;
        tag.reservations = null;

        tag.on("before-mount", function()
        {
            tag.reservations = tag.opts.reservations;
            if(tag.reservations == null)
            {
                throw new Error("Reservations cant be null.");
            }

            tag.tabs = [
            {
                name : "Utilisateurs",
                route : "/admin/users",
                selected : false
            },
                {
                    name : "Signalement",
                    route : "/admin/reports",
                    selected : false
                },
                {
                    name : "Transactions",
                    route : "/admin/reservations",
                    selected : true
                },
                {
                    name : "Origines",
                    route :"/admin/origins",
                    selected : false
                },
                {
                    name : "Les Plus",
                    route :"/admin/pins",
                    selected : false
                }
            ];
        });

        tag.showForHost = function()
        {
            let id = tag.refs.host.value;
            if(id == "" || id == null)
                return;
            let filters = {
                "host_id" : id
            };
            let request = App.request(App.Address + "/getreservations", {
                "filters" : JSON.stringify(filters)
            });
            request.then(function(response){
                tag.refs.reservations.reservations = response.data;
                tag.refs.reservations.reload();
            });
            request.catch(function(error){
               ErrorHandler.alertIfError(error);
            });
        };

        tag.showForGuest = function()
        {
            let id = tag.refs.guest.value;
            if(id == "" || id == null)
                return;
            let filters = {
                "guest_id" : id
            };
            let request = App.request(App.Address + "/getreservations", {
                "filters" : JSON.stringify(filters)
            });
            request.then(function(response){
                tag.refs.reservations.reservations = response.data;
                tag.refs.reservations.reload();
            });
            request.catch(function(error){
                ErrorHandler.alertIfError(error);
            });
        };

});
},{"riot":8}],18:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag2('app-adminusers', '<app-header></app-header> <app-tabbar tabs="{tabs}"></app-tabbar> <div class="search"> <form name="search-user"> <h2>Chercher</h2> <app-userselector ref="user"></app-userselector> <input type="button" value="Rechercher" onclick="{search}"> </form> </div> <div class="content"> <table> <thead> <tr> <td>Intitulé</td><td>Actions</td> </tr> </thead> <tbody> <tr each="{user, i in users}" id="item-{user.id}"> <td>{user.username}</td> <td> <a class="onclick" onclick="{see}" data-id="{user.id}" data-index="{i}">Voir le profil</a> <a class="onclick" onclick="{ban}" data-id="{user.id}" data-index="{i}"> <virtual if="{user.banned != 1}"> Bannir </virtual> <virtual if="{user.banned != 0}"> Autoriser </virtual> </a> </td> </tr> </tbody> </table> </div> <app-footer></app-footer>', '', '', function(opts) {
        var tag = this;

        tag.tabs = null;
        tag.users = null;

        tag.on("before-mount", function()
        {
            tag.users = tag.opts.users;
            if(tag.users == null)
                throw new Error("Users cant be null.");

            tag.tabs = [
            {
                name : "Utilisateurs",
                route : "/admin/users",
                selected : true
            },
                {
                    name : "Signalement",
                    route : "/admin/reports",
                    selected : false
                },
                {
                    name : "Transactions",
                    route : "/admin/reservations",
                    selected : false
                },
                {
                    name : "Origines",
                    route :"/admin/origins",
                    selected : false
                }
                ,
                {
                    name : "Les Plus",
                    route :"/admin/pins",
                    selected : false
                }
            ];
        });

        tag.search = function()
        {
            route("/admin/users/"+tag.refs.user.value);
        };

        tag.see = function(evt)
        {
            let id = evt.target.getAttribute("data-id");
            route("/user/"+id);
        };

        tag.ban = function(evt)
        {
            let index = evt.target.getAttribute("data-index");
            let user = {
                "id" : tag.users[index].id,
                "username" : tag.users[index].username,
                "banned" : tag.users[index].banned
            };
            if(user.banned == 0)
                user.banned = 1;
            else
                user.banned = 0;
            let request = App.request(App.Address + "/updateuser", user);
            request.then(function(response){
                NotificationManager.showNotification("L'état de l'utilisateur "+user.username+" a été modifié.", "success");
                tag.users[index].banned = user.banned;
                tag.update();
            });
            request.catch(function(error){
                if(error instanceof Error)
                    ErrorHandler.alertIfError(error);
            });
        };

});
},{"riot":8}],19:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag2('app-commenteditform', '<form name="edit-comment" class="{invisible : tag.comment==null}"> <div> <label>Note</label> <app-hearts interactive="{true}" ref="note"></app-hearts> </div> <div> <label>Contenu de l\'avis</label> <textarea name="content" ref="content"> {comment.content} </textarea> <p class="hint"> Ce champ doit contenir entre 10 et 400 caractères. </p> </div> <input type="button" class="large" value="Envoyer" onclick="{send}"> </form>', '', '', function(opts) {
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
                if (valid.passes("edit-comment")) {
                    var url = App.Address + "/updatecomment";
                    var cmt = tag.comment;
                    if(cmt == null || cmt.id == null)
                    {
                        url = App.Address + "/addcomment";
                        cmt = {};
                        cmt.author_id = tag.author.id;
                        cmt.target_id = tag.target.id;
                    }
                    cmt.content = tag.refs.content.value;
                    cmt.note = tag.refs.note.value;
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
},{"riot":8}],20:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag2('app-commentitem', '<img class="profile" riot-src="{comment.author.picture}"> <div> <div>{comment.author.username} - {comment.author.age} ans <div class="Hearts nb-{comment.note}"></div></div> <div> <p> {comment.content} </p> </div> </div>', '', '', function(opts) {
        var tag = this;

        tag.comment = tag.opts.comment;
});
},{"riot":8}],21:[function(require,module,exports){
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
},{"riot":8}],22:[function(require,module,exports){
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
},{"riot":8}],23:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag2('app-cgu', '<app-header></app-header> <div class="content"> <h1>Conditions Générales d’Utilisation</h1> <h2>1. Objet</h2> <p>La société MeltingCook (ci-après, « <strong>MeltingCook</strong> ») édite une plateforme de cuisine accessible sur un site internet notamment à l’adresse <a href="»http" s: www meltingcook fr> meltingcook.fr</a>. Toute ressemblance avec une application mobile sera poursuivie. Ce site internet est destiné à mettre en relation des passionnés de cuisine souhaitant partager cette activité pour leur propre compte avec d’autres personne souhaitant apprendre des valeurs culinaires jusqu’alors inexplorée. Cela leur permet de partager la cuisine et donc les frais qui y sont associés (ci-après, la « Plateforme »).<p> <p>Les présentes conditions générales d’utilisation ont pour objet d’encadrer l’accès et les modalités d’utilisation de la plateforme. Nous vous invitons à en prendre attentivement connaissance. Vous comprenez et reconnaissez que MeltingCook n’est parti à aucun accord, contrat ou relation contractuelle, de quelque nature que ce soit, conclu entre les Membres de cette plateforme.<p> <p>En s’inscrivant, vous reconnaissez avoir pris connaissance et accepter l’intégralité des présentes conditions générales d’utilisation.<p> <h2>2. Définitions</h2> <p>Dans les présentes, <ul> <li>« <strong>recette </strong>» désigne qu’un cuisinier propose un moment culinaire au travers de la plateforme avec des apprenants ; </li> <li>«<strong> MeltingCook </strong>» a la signification qui lui est donnée à l’article 1 ci-dessus ;</li> <li>« <strong>CGU</strong> » désigne les présentes Conditions Générales d’Utilisation ;</li> <li>« <strong>compte</strong> » désigne le compte qui doit être créé pour pouvoir devenir membre et accéder à certains services proposés par la plateforme ;<li> <li>« <strong>cuisinier</strong> » désigne le membre proposant, sur la plateforme, de cuisiner avecune autre personne physique en contrepartie de la participation aux frais, pour l’élaboration d’une recette et un horaire défini par lui-seul ;<li> <li>« <strong>confirmation de réservation</strong> » a la signification qui lui est donnée aux articles ci-dessous ;</li> <li>« <strong>contenu membre</strong> » a la signification qui lui est donnée aux articles ci-dessous ;</li> <li>«<strong> frais de service</strong> » a la signification qui lui est donnée à l’article 5 ci-dessous ;</li> <li>«<strong> membre </strong>» désigne toute personne physique ayant créé un compte sur la plateforme ;</li> <li>« <strong>apprenant </strong>» désigne le membre ayant accepté la proposition de recette par le cuisinier ou, le cas échéant, la personne pour le compte de laquelle un membre a réservé une place ;<li> <li>« <strong>participation aux frais</strong> » désigne, pour une recette donnée, la somme d’argent demandée par le cuisinier et acceptée par l’apprenant au titre de sa participation aux frais de la cuisine ;<li> <li>« <strong>place</strong> » désigne la place réservée par un apprenant chez le cuisinier ;</li> <li>« <strong>plateforme</strong> » a le sens qui lui est donné à l’article 1, ci-dessus ;</li> <li>« <strong>réservation</strong> » a le sens qui lui est donné à l’article 4.2.1. ci-dessous ;</li> <li>«<strong> services </strong>» désigne l’ensemble des services rendus par Meltingcook par l’intermédiaire de la plateforme ;</li> <li>« <strong>site</strong> » désigne le site internet accessible à l’adresse www.meltingcook.fr ;</li> <li>« <strong>cuisine</strong> » désigne l’endroit faisant l’objet d’une recette publiée par un cuisinier sur la plateforme et pour lequel il accepte d’accueillir des apprenant en contrepartie de la participation aux frais ;<li> <li>« <strong>cuisine avec réservation</strong> » a la signification qui lui est donné à l’article 4.2.1 ci-dessous ;</li> </ul> </p> <h2>3. Inscription à la plateforme et création de compte</h2> <h3>3.1. Conditions d’inscription à la plateforme</h3> <p>L’utilisation de plateforme est réservée aux personnes physiques âgées de 18 ans ou plus. Toute inscription sur la plateforme par une personne mineure est strictement interdite. En accédant, utilisant ou vous inscrivant sur la plateforme, vous déclarez et garantissez avoir 18 ans ou plus.</p> <h3>3.2. Création de Compte</h3> <p>La plateforme permet aux membres de publier et consulter des recette ainsi que d’interagir entre eux pour la réservation de place. Vous pouvez consulter les recettes même si vous n’êtes pas inscrit sur la plateforme. En revanche, vous ne pouvez ni publier une recette ni réserver une place sans avoir, au préalable, créé un compte et être devenu membre.</p> <p>Pour créer votre Compte, vous devez remplir l’ensemble des champs obligatoires figurant sur le formulaire d’inscription. A l’occasion de la création de votre compte, vous vous engagez à fournir des informations personnelles exactes et conformes à la réalité et à les mettre à jour, par l’intermédiaire de votre profil ou en en avertissant MeltingCook, afin d’en garantir la pertinence et l’exactitude tout au long de votre relation contractuelle avec MeltingCook.</p> <p>Vous vous engagez à garder secret le mot de passe choisi lors de la création de votre compte et à ne le communiquer à personne. En cas de perte ou divulgation de votre mot de passe, vous vous engagez à en informer sans délai MeltingCook. Vous êtes seul responsable de l’utilisation faite de votre compte par un tiers, tant que vous n’avez pas expressément notifié MeltingCook de la perte, l’utilisation frauduleuse par un tiers ou la divulgation de votre mot de passe à un tiers. </p> <p>Vous vous engagez à ne pas créer ou utiliser, sous votre propre identité ou celle d’un tiers, d’autres Comptes que celui initialement créé.</p> <h3>3.3. Vérification</h3> <p>MeltingCook peut, à des fins de transparence, d’amélioration de la confiance, ou de prévention ou détection des fraudes, mettre en place un système de vérification de certaines des informations que vous fournissez sur votre profil. C’est notamment le cas lorsque vous renseignez votre numéro de téléphone.</p> <p>Vous reconnaissez et acceptez que toute référence sur la plateforme ou les services à des informations dites « vérifiées » ou tout terme similaire, signifie uniquement qu’un membre a réussi avec succès la procédure de vérification existante sur la plateforme ou les services afin de vous fournir davantage d’informations sur le Membre avec lequel vous envisagez de voyager. MeltingCook ne garantit ni la véracité, ni la fiabilité, ni la validité de l’information ayant fait l’objet de la procédure de vérification. </p> <h2>4. Utilisation des Services</h2> <h3>4.1. Publication des Annonces</h3> <p>En tant que membre, et sous réserve que vous remplissiez les conditions ci-dessous, vous pouvez créer et publier des recettes sur la plateforme en indiquant des informations (dates/heures et lieux de rendez-vous, nombre de places offertes, options proposées, montant de la participation aux frais, etc.).</p> <p>Lors de la publication de votre recette, vous pouvez le lieu de rendez-vous ou votre adresse directe pour accueillir des apprenants.</p> <p>Vous n’êtes autorisé à publier une recette que si vous remplissez l’ensemble des conditions suivantes : <ul> <li> Vous êtes titulaire d’une carte d’identité attestant votre majorité ; </li> <li> Vous ne proposez des recettes que pour des lieux dont vous êtes le propriétaire, le locataire ou que vous utilisez avec l’autorisation expresse du propriétaire, et dans tous les cas, que vous êtes autorisés à utiliser à des fins culinaires ; </li> <li>Vous êtes et demeurez le cuisinier des lieux, objet de la recette ;</li> <li> La cuisine bénéficie d’une assurance au tiers valide ; <li> <li> Vous n’avez aucune contre-indication ou incapacité médicale à cuisiner et au contact physique avec autrui ;</li> <li> Vous ne comptez pas publier une autre recette pour la même recette sur la plateforme ;</li> <li> Vous n’offrez pas plus de places que celles disponibles dans votre cuisine ;</li> <li> Toutes les places offertes sont composées d’une assise confortable et d’assez d’espace pour la bon déroulement de la recette ; </li> <li>Vous utilisez une cuisine en parfait état de fonctionnement et conforme aux usages et dispositions légales applicables, notamment avec une hygiène irréprochable. </li> </ul></p> <p>Vous reconnaissez être le seul responsable du contenu de la recette que vous publiez sur la plateforme. En conséquence, vous déclarez et garantissez l’exactitude et la véracité de toute information contenue dans votre recette et vous engagez à effectuer la cuisine selon les modalités décrites dans votre recette.</p> <p>Sous réserve que votre recette soit conforme aux CGU, elle sera publiée sur la plateforme et donc visible des membres et de tous visiteurs, même non membre, effectuant une recherche sur la plateforme ou sur le site internet des partenaires de MeltingCook. MeltingCook se réserve la possibilité, à sa seule discrétion et sans préavis, de ne pas publier ou retirer, à tout moment, toute recette qui ne serait pas conforme aux CGU ou qu’elle considérerait comme préjudiciable à son image, celle de la plateforme ou celle des services.</p> <p>Vous reconnaissez et acceptez que les critères pris en compte dans le classement et l’ordre d’affichage de votre recette parmi les autres recettes relèvent de la seule discrétion de MeltingCook.</p> <h3>4.2. Réservation d’une Place</h3> <p>Les modalités de réservation d’une Place dépendent de la nature du la recette envisagée, MeltingCook ayant mis en place pour certaines recettes un système de réservation en ligne.</p> <h4>4.2.1. Cuisine avec Réservation</h4> <p>MeltingCook a mis en place un système de réservation de places en ligne (la « <strong>réservation</strong> ») pour certaines des recettes proposés sur la plateforme (les « <strong>cuisines avec réservation </strong>»).</p> <p>L’éligibilité d’une recette au système de réservation reste à la seule discrétion de MeltingCook, qui se réserve la possibilité de modifier ces conditions à tout moment.</p> <p>Lorsqu’un apprenant est intéressé par une recette bénéficiant de la réservation, il peut effectuer une demande de réservation en ligne. Cette demande de Réservation est soit acceptée automatiquement (si le cuisinier a choisi cette option lors de la publication de sa recette), soit acceptée manuellement par le cuisinier. Au moment de la réservation, l’apprenant procède au paiement en ligne du montant de la participation aux frais et des frais de service afférents, le cas échéant. Après vérification du paiement par MeltingCook et validation de la demande de réservation par le cuisinier, le cas échéant, l’apprenant reçoit une confirmation de réservation (la « <strong>confirmation de réservation</strong> »). </p> <p>Si vous êtes un cuisinier et que vous avez choisi de gérer vous-mêmes les demandes de réservation lors de la publication de votre recette, vous êtes tenu de répondre à toute demande de réservation dans le délai fixé par l’apprenant. A défaut, la demande de réservation expire automatiquement et l’apprenant est remboursé de l’intégralité des sommes versées au moment de la demande de réservation, le cas échéant.</p> <p>A compter de la confirmation de la réservation, MeltingCook vous transmet les coordonnées téléphoniques du cuisinier (si vous êtes apprenant) ou de l’apprenant (si vous êtes cuisinier), dans le cas où le membre a donné son accord à la divulgation de son numéro de téléphone. Vous êtes désormais seuls responsables de l’exécution du contrat vous liant à l’autre membre.</p> <h4>4.2.2. Caractère nominatif de la réservation de place et modalités d’utilisation des services pour le compte d’un tiers</h4> <p>Toute utilisation des services, que ce soit en qualité de Passager ou de Conducteur, est nominative. Le cuisinier comme l’apprenant doivent correspondre à l’identité communiquée à MeltingCook et aux autres membres participant à la recette.</p> <p>Toutefois, MeltingCook permet à ses membres de réserver une ou plusieurs places pour le compte d’un tiers. Dans ce cas, vous vous engagez à indiquer avec exactitude au cuisinier, au moment de la réservation ou de l’envoi du message au cuisinier (dans le cadre d’un recette sans réservation), les prénom, âge et numéro de téléphone de la personne pour le compte de laquelle vous réservez une place. Il est strictement interdit de réserver une place pour un mineur seul âgé de moins de 16 ans. Dans le cas où vous réservez une place pour un mineur cuisinant seul âgé de plus de 16 ans, vous vous engagez à demander l’accord préalable du cuisinier et à lui fournir une autorisation des représentants légaux dûment remplie et signée.</p> <p>En outre, la plateforme est destinée à la réservation de places pour des personnes physiques. Il est donc interdit de réserver une place pour nourrir un animal.</p> <p>Par ailleurs, il est interdit de publier une Annonce pour un Conducteur autre que vous-même.</p> <h3>4.3. Système d’avis</h3> <h4>4.3.1. Fonctionnement</h4> <p>MeltingCook vous encourage à laisser un avis sur un cuisinier (si vous êtes apprenant) ou un apprenant (si vous êtes cuisinier) avec lequel vous avez partagé un recette ou avec lequel vous étiez censé partager une recette. En revanche, vous n’êtes pas autorisé à laisser un avis sur un autre apprenant, si vous étiez vous-même apprenant, ni sur un membre avec lequel vous n’avez pas cuisiné ou avec lequel vous n’étiez pas censé cuisiné.</p> <p>Votre avis, ainsi que celui laissé par un autre membre à votre égard, le cas échéant, ne sont visibles et publiés sur la plateforme qu’après le plus court des délais suivants : immédiatement après que vous ayez, tous les deux, laissés un avis ou passé un délai de 14 jours après le premier avis laissé.</p> <h4>4.3.2. Modération</h4> <p>Vous reconnaissez et acceptez que MeltingCook se réserve la possibilité de ne pas publier ou supprimer tout avis, toute question, tout commentaire ou toute réponse dont elle jugerait le contenu contraire aux présentes CGU.</p> <h4>4.3.3. Seuil</h4> <p>MeltingCook se réserve la possibilité de suspendre votre Compte, limiter votre accès aux services ou résilier les présentes CGU dans le cas où vous avez reçu au moins trois avis et la moyenne des avis que vous avez reçus est égale ou inférieure à 3. </p> <h2>5. Conditions financières</h2> <p>L’accès et l’inscription à la plateforme, de même que la recherche, la consultation et la publication de recettes sont gratuits. En revanche, la réservation est payante dans les conditions décrites ci-dessous.</p> <h3>5.1. Participation aux Frais</h3> <p>Le montant de la participation aux frais est déterminé par vous, en tant que cuisinier, sous votre seule responsabilité. Il est strictement interdit de tirer le moindre bénéfice du fait de l’utilisation de notre plateforme. Par conséquent, vous vous engagez à limiter le montant de la participation aux frais que vous demandez à vos apprenant aux frais que vous supportez réellement pour effectuer la recette. A défaut, vous supporterez seul les risques de requalification de l’opération effectuée par l’intermédiaire de la plateforme.</p> <h3>5.2. Frais de Service</h3> <p>Dans le cadre des recettes avec réservation, MeltingCook prélève, en contrepartie de l’utilisation de la plateforme, au moment de la réservation, des frais de service (ci-après, les « <strong>frais de service</strong> ») calculés sur la base du montant de la participation aux frais. Les modalités de calcul des frais de service en vigueur sont accessibles ici.</p> <p>Les frais de service sont perçus par MeltingCook pour chaque place faisant l’objet d’une réservation par un apprenant.</p> <h3>5.3. Arrondis</h3> <p>Vous reconnaissez et acceptez que MeltingCook peut, à son entière discrétion, arrondir au chiffre inférieur ou supérieur les frais de service et la participation aux frais.</p> <h3>5.4. Modalités de paiement et de reversement de la participation aux frais au cuisinier</h3> <h4>5.4.1. Mandat d’encaissement</h4> <p>En utilisant la plateforme en tant que cuisine pour des recettes avec réservation, vous confiez à MeltingCook un mandat d’encaissement du montant de la Participation aux Frais en votre nom et pour votre compte.</p> <p>Par conséquent, dans le cadre d’une recette avec réservation, et après acceptation manuelle ou automatique de la réservation, MeltingCook encaisse la totalité de la somme versée par l’apprenant (frais de service et participation aux frais). Les participations aux frais reçues par MeltingCook sont déposées sur un compte dédié au paiement des cuisiniers.</p> <p>Vous reconnaissez et acceptez qu’aucune des sommes perçues par MeltingCook au nom et pour le compte du cuisinier n’emporte droit à intérêts. Vous acceptez de répondre avec diligences à toute demande de MeltingCook et plus généralement de toute autorité administrative ou judiciaire compétente en particulier en matière de prévention ou la lutte contre le blanchiment. Notamment, vous acceptez de fournir, sur simple demande, tout justificatif d’adresse et/ou d’identité utile.</p> <p>En l’absence de réponse de votre part à ces demandes, MeltingCook pourra prendre toute mesure qui lui semblera appropriée notamment le gel des sommes versées et/ou la suspension de votre compte et/ou la résiliation des présentes CGU.</p> <h4>5.4.2. Versement de la participation aux frais au cuisinier</h4> <p>A la suite des recettes, les apprenant disposent d’un délai de 24 heures pour présenter une réclamation à MeltingCook. En l’absence de contestation de leur part dans cette période, MeltingCook considère la confirmation de la recette comme acquise.<p> <p>A compter de cette confirmation expresse ou tacite, vous disposez, en tant que cuisinier, d’un crédit exigible sur votre compte. Ce crédit correspond au montant total payé par l’apprenant au moment de la confirmation de la réservation diminué des frais de service, c’est-à-dire au montant de la participation aux frais payée par l’apprenant.</p> <p>Lorsque le Trajet est confirmé par le Passager, vous avez la possibilité, en tant que cuisinier, de donner instructions à MeltingCook de vous verser l’argent sur votre compte Paypal (en renseignant sur votre Compte, au préalable, votre adresse e-mail Paypal demandé lors de l’inscription).</p> <p>A l’issue du délai de prescription de 5 ans applicable, toute somme non réclamée à MeltingCook sera réputée appartenir à MeltingCook.</p> <h2>6. Finalité non commerciale et non professionnelle des services et de la plateforme</h2> <p>Vous vous engagez à n’utiliser les services et la plateforme que pour être mis en relation, à titre non professionnel et non commercial, avec des personnes souhaitant partager une recette avec vous.<p> <p>En tant que cuisinier, vous vous engagez à ne pas demander une participation aux frais supérieure aux frais que vous supportez réellement et susceptible de vous faire générer un bénéfice, étant précisé que s’agissant d’un partage de frais, vous devez également, en tant que cuisinier, supporter votre part des coûts afférents à la recette. Vous êtes seul responsable d’effectuer le calcul des frais que vous supportez pour la recette, et de vous assurer que le montant demandé à vos apprenant n’excède pas les frais que vous supportez réellement (en excluant votre part de participation aux frais).</p> <p>MeltingCook se réserve la possibilité de suspendre votre compte dans le cas où vous utiliseriez un cuisine non-hygiénique ou un lieu inapproprié à la cuisine et généreriez de ce fait un bénéfice sur la plateforme. Vous vous engagez à fournir à MeltingCook, sur simple demande de la part de celle-ci, une photographie et/ou tout autre document de nature à attester que vous êtes autorisé à utiliser ces lieux et votre cuisine dans la plus grande hygiène.</p> <p> MeltingCook se réserve également la possibilité de suspendre votre compte, limiter votre accès aux services ou résilier les présentes CGU en cas d’activité de votre part sur la plateforme, qui, du fait de la nature des recettes proposées, de leur fréquence, du nombre d’apprenant ou du montant de participation aux frais demandé, entraînerait une situation de bénéfice pour vous ou pour quelque raison que ce soit faisant suspecter à MeltingCook que vous générez un bénéfice sur la plateforme.</p> <h2>7. Politique d’annulation</h2> <h3>7.1. Modalités de remboursement en cas d’annulation</h3> <p>Seuls les recettes avec réservation font l’objet de la présente politique d’annulation, MeltingCook n’offrant aucune garantie, de quelque nature que ce soit, en cas d’annulation, pour quelque raison que ce soit, de la part d’un apprenant ou d’un cuisinier, d’une recette sans Réservation.</p> <p>L’annulation d’une Place d’une recette avec réservation par le cuisinier ou l’apprenant après la confirmation de réservation est soumise aux stipulations ci-après :<p> <ul><li>En cas d’annulation imputable au cuisinier, l’apprenant est remboursé de la totalité de la somme qu’il a versée (c’est-à-dire la participation aux frais et les frais de service afférents). C’est notamment le cas lorsque le cuisinier annule une recette ou ne se rend pas au point de rendez-vous au plus tard 15 minutes après l’horaire convenu ;</li> <li>En cas d’annulation imputable au Passager : <ul><li>Si le Passager annule plus de 24 heures avant l’heure prévue pour le départ telle que mentionnée dans la recette, l’apprenant est remboursé du montant de la participation aux frais. Les frais de service demeurent acquis à MeltingCook et le cuisinier ne reçoit aucune somme de quelque nature que ce soit ;</li> <li>Si l’apprenant annule moins de 24 heures ou 24 heures avant l’heure prévue pour le départ, telle que mentionnée dans la recette et plus de trente minutes après la confirmation de réservation, le passager est remboursé à hauteur de la moitié de la participation aux frais versée lors de la réservation, les frais de service demeurent acquis à MeltingCook;</li> <li>Si le Passager annule après l’heure prévue pour le départ, telle que mentionnée dans l’Annonce, ou s’il ne se présente pas au lieu de rendez-vous au plus tard dans un délai de 15 minutes à compter de l’heure convenue, aucun remboursement n’est effectué. Le Conducteur est dédommagé à hauteur de la totalité de la Participation aux Frais et les Frais de Services sont conservés par MeltingCook.<:li></ul> </ul> <p>Lorsque l’annulation intervient avant le départ et du fait de l’apprenant la ou les places annulé(e)s par l’apprenant sont de plein droit remises à la disposition d’autres apprenants pouvant les réserver en ligne et en conséquence soumises aux conditions des présentes CGU.</p> <p>MeltingCook apprécie à sa seule discrétion, sur la base des éléments à sa disposition, la légitimité des demandes de remboursement qu’elle reçoit.</p> <h3>7.2. Droit de rétraction</h3> <p>En acceptant les présentes CGU, vous acceptez expressément que le contrat entre vous et MeltingCook consistant en la mise en relation avec un autre membre soit exécuté avant l’expiration du délai de rétractation dès la confirmation de réservation et renoncez expressément à votre droit de rétraction, conformément aux dispositions de l’article L.221-28 du Code de la consommation.</p> <h2>8. Comportement des utilisateurs de la Plateforme et Membres</h2> <h3>8.1. Engagement de tous les utilisateurs de la Plateforme</h3> <p>Vous reconnaissez être seul responsable du respect de l’ensemble des lois, règlements et obligations applicables à votre utilisation de la plateforme.</p> <p>Par ailleurs, en utilisant la Plateforme et lors des Trajets, vous vous engagez à :</p> <ul><li> Ne pas utiliser la plateforme à des fins professionnelles, commerciales ou lucratives ;</li> <li> Ne transmettre à MeltingCook (notamment lors de la création ou la mise à jour de votre compte) ou aux autres membres aucune information fausse, trompeuse, mensongère ou frauduleuse ; </li> <li> Ne tenir aucun propos, n’avoir aucun comportement ou ne publier sur la plateforme aucun contenu à caractère diffamatoire, injurieux, obscène, pornographique, vulgaire, offensant, agressif, déplacé, violent, menaçant, harcelant, raciste, xénophobe, à connotation sexuelle, incitant à la haine, à la violence, à la discrimination ou à la haine, encourageant les activités ou l’usage de substances illégales ou, plus généralement, contraires aux finalités de la plateforme, de nature à porter atteinte aux droits de MeltingCook ou d’un tiers ou contraires aux bonnes mœurs ;</li> <li> Ne pas porter atteinte aux droits et à l’image de MeltingCook, notamment à ses droits de propriété intellectuelle ; </li> <li> Ne pas ouvrir plus d’un compte sur la plateforme et ne pas ouvrir de compte au nom d’un tiers ;</li> <li> Ne pas tenter de contourner le système de réservation en ligne de la plateforme, notamment en tentant de communiquer à un autre membre vos coordonnées afin de réaliser la réservation en dehors de la plateforme et ne pas payer les frais de service ; </li> <li> Ne pas contacter un autre membre, notamment par l’intermédiaire de la plateforme, à une autre fin que celle de définir les modalités du partage de cuisine ; <li> <li> Ne pas accepter ou effectuer un paiement en dehors de la plateforme, hors des cas autorisés par les présentes CGU dans le cas de recette sans réservation ; </li> <li> Vous conformer aux présentes CGU et à la Politique de Confidentialité. </li> </ul> <h3>8.2. Engagements des cuisiniers</h3> <p>En outre, lorsque vous utilisez la plateforme en tant que cuisinier, vous vous engagez à :</p> <ul><li>Respecter l’ensemble des lois, règles, codes applicables à la conduite et au véhicule, notamment à disposer d’une assurance responsabilité civile valide au moment de la cuisine et être en possession d’un lieu aux normes d’hygiène;</li> <li>Vous assurer que votre assurance couvre le covoiturage et que vos apprenants sont considérés comme tiers dans votre cuisine et donc couverts par votre assurance habitation ; </li> <li>Ne prendre aucun risque sur place, à n’absorber aucun produit de nature à altérer votre attention et vos capacités, à accueillir convenablement et en toute sécurité ; </li> <li> Publier des recettes correspondant uniquement à l’élaboration de recette réellement envisagés ;</li> <li> Effectuer la recette décrite telle quelle et respecter les horaires et lieux convenus avec les autres membres (notamment lieu de rendez-vous et l’horaire) ;</li> <li> Ne pas prendre plus d’apprenant que le nombre de places indiquées dans la recette ;</li> <li> Utiliser une cuisine en parfait état de fonctionnement et conforme aux usages et dispositions légales applicables ;</li> <li> Communiquer à MeltingCook ou tout apprenant qui vous en fait la demande, une photographie de votre cuisine et ustensiles, ainsi que tout document attestant de votre capacité à utiliser cet environnement en tant que cuisinier sur la plateforme ;</li> <li> En cas d’empêchement ou de changement de l’horaire ou de la recette, en informer sans délais vos apprenants;</li> <li> Attendre les apprenants sur le lieu de rencontre convenu au moins 15 minutes au-delà de l’heure convenue ;</li> <li> Ne pas publier de recette relative à une cuisine dont vous n’êtes pas le propriétaire ou que vous n’êtes pas habilité à utiliser à des fins culinaires ;<li> <li> Vous assurer d’être joignable par téléphone par vos apprenants, au numéro enregistré sur votre profil ;<li> <li> Ne générer aucun bénéfice par l’intermédiaire de la plateforme ;</li> <li> garantir n’avoir aucune contre-indication ou incapacité médicale à conduire ; </li> <li>avoir un comportement convenable et responsable, au cours du Trajet et conforme à l’esprit de covoiturage.</li> </ul> <h3>8.3. Engagements des apprenants</h3> <p>Lorsque vous utilisez la Plateforme en tant que Passager, vous vous engagez à :</p> <ul><li>Adopter un comportement convenable au cours de la recette de façon à ne gêner la concentration du cuisinier ni la tranquillité des autres apprenants ;</li> <li> Respecter l’environnement du cuisinier et sa propreté ;</li> <li> En cas d’empêchement, en informer sans délai le cuisinier ;</li> <li> Attendre le cuisinier sur le lieu de rencontre convenu au moins 15 minutes au-delà de l’heure convenue ;<li> <li> Communiquer à MeltingCook ou tout cuisinier qui vous en fait la demande, votre carte d’identité ou tout document de nature à attester de votre identité ;<li> <li> Ne transporter aucun objet, marchandise, substance, animal de nature à gêner la cuisine et la concentration du cuisinier ou dont la nature, la possession ou le transport est contraire aux dispositions légales en vigueur ;</li> <li> Vous assurer d’être joignable par téléphone par le cuisinier, au numéro enregistré sur votre profil, notamment au point de rendez-vous.<li> </ul> <p>Dans le cas où vous auriez procédé à la Réservation d’une ou plusieurs Places pour le compte de tiers, conformément aux stipulations de l’article 4.2.3 ci-dessus, vous vous portez fort du respect par ce tiers des stipulations du présent article et, de façon générale, des présentes CGU. MeltingCook se réserve la possibilité de suspendre votre Compte, limiter votre accès aux Services ou résilier les présentes CGU, en cas de manquement de la part du tiers pour le compte duquel vous avez réservé une Place aux présentes CGU.</p> <h2>9. Suspension de comptes, limitation d’accès et résiliation</h2> <p>Vous avez la possibilité de mettre fin à votre relation contractuelle avec MeltingCook à tout moment, sans frais et sans motif. Pour cela, il vous suffit de vous rendre dans l’onglet « Fermeture de compte » de votre page Profil.</p> <p>En cas de violation de votre part des présentes CGU, notamment de vos obligations en tant que Membre mentionnées aux articles 6 et 8 ci-dessus, de dépassement du seuil visé à l’article 4.3.3. ci-dessus ou si MeltingCook a des raisons sérieuses de croire que ceci est nécessaire pour protéger sa sécurité et son intégrité, celles de ses membres ou de tiers ou à des fins de prévention des fraudes ou d’enquêtes, MeltingCook se réserve la possibilité de :</p> <ul><li> Résilier, immédiatement et sans préavis, les présentes CGU ; </li> <li> Empêcher la publication ou supprimer tout avis, recettes, messages, contenus, demande de réservation, ou tout contenu publié par vous sur la plateforme ; </li> <li> Limiter votre accès et votre utilisation de la Plateforme ; </li> <li> Suspendre de façon temporaire ou permanente votre compte. </li> <p>Lorsque cela est nécessaire, vous serez notifié de la mise en place d’une telle mesure afin de vous permettre de donner des explications à MeltingCook. MeltingCook décidera, à sa seule discrétion, de lever les mesures mises en place ou non.</p> <h2>10. Données personnelles<h2> <p>Dans le cadre de votre utilisation de la plateforme, MeltingCook est amenée à collecter et traiter certaines de vos données personnelles. En utilisant la plateforme et vous inscrivant en tant que membre, vous reconnaissez et acceptez le traitement de vos données personnelles par MeltingCook conformément à la loi applicable et aux stipulations de la Politique de Confidentialité.</p> <h2>11. Propriété intellectuelle</h2> <h3>11.1. Contenu publié par MeltingCook</h3> <p>Sous réserve des contenus fournis par ses membres, MeltingCook est seule titulaire de l’ensemble des droits de propriété intellectuelle afférents au service, à la plateforme, à son contenu (notamment les textes, images, dessins, logos, vidéos, sons, données, graphiques) ainsi qu’aux logiciels et bases de données assurant leur fonctionnement.</p> <p> MeltingCook vous accorde une licence non exclusive, personnelle et non cessible d’utilisation de la plateforme et des services, pour votre usage personnel et privé, à titre non commercial et conformément aux finalités de la plateforme et des services.</p> <p>Vous vous interdisez toute autre utilisation ou exploitation de la plateforme et des services, et de leur contenu sans l’autorisation préalable écrite de MeltingCook. Notamment, vous vous interdisez de :</p> <ul><li>Reproduire, modifier, adapter, distribuer, représenter publiquement, diffuser la plateforme, les services et leur contenu, à l’exception de ce qui est expressément autorisé par MeltingCook ; </li> <li> Décompiler, procéder à de l’ingénierie inverse de la plateforme ou des services, sous réserve des exceptions prévues par les textes en vigueur ; </li> <li> Extraire ou tenter d’extraire (notamment en utilisant des robots d’aspiration de données ou tout autre outil similaire de collecte de données) une partie substantielle des données de la plateforme.</li></ul> <h3>11.2. Contenu publié par vous sur la Plateforme</h3> <p>Afin de permettre la fourniture des services et conformément à la finalité de la plateforme, vous concédez à MeltingCook une licence non exclusive d’utilisation des contenus et données que vous fournissez dans le cadre de votre utilisation des services (ci-après, votre « <strong>contenu membre</strong> »). Afin de permettre à MeltingCook la diffusion par réseau numérique et selon tout protocole de communication, (notamment Internet et réseau mobile), ainsi que la mise à disposition au public du contenu de la plateforme, vous autorisez MeltingCook, pour le monde entier et pour toute la durée de votre relation contractuelle avec MeltingCook, à reproduire, représenter, adapter et traduire votre contenu membre de la façon suivante :</p> <ul><li> Vous autorisez MeltingCook à reproduire tout ou partie de votre contenu membre sur tout support d’enregistrement numérique, connu ou inconnu à ce jour, et notamment sur tout serveur, disque dur, carte mémoire, ou tout autre support équivalent, en tout format et par tout procédé connu et inconnu à ce jour, dans la mesure nécessaire à toute opération de stockage, sauvegarde, transmission ou téléchargement lié au fonctionnement de la plateforme et à la fourniture du service ;</li> <li> Vous autorisez MeltingCook à adapter et traduire votre contenu membre, ainsi qu’à reproduire ces adaptations sur tout support numérique, actuel ou futur, stipulé au ci-dessus, dans le but de fournir les services, notamment en différentes langues. Ce droit comprend notamment la faculté de réaliser, dans le respect de votre droit moral, des modifications de la mise en forme de votre contenu membre aux fins de respecter la charte graphique de la plateforme et/ou de le rendre techniquement compatible en vue de sa publication via la Plateforme.</li></ul> <h2>12. Rôle de MeltingCook</h2> <p>La Plateforme constitue une plateforme en ligne de mise en relation sur laquelle les membres peuvent créer et publier des annonces pour des recettes à des fins culinaires. Ces recettes peuvent notamment être consultées par les autres membres pour prendre connaissance des modalités de la recette et, le cas échéant, réserver directement une place dans le véhicule concerné auprès du membre ayant posté l’annonce sur la plateforme.</p> <p>En utilisant la plateforme et en acceptant les présentes CGU, vous reconnaissez que MeltingCook n’est partie à aucun accord conclu entre vous et les autres membres en vue de partager les frais afférents à une recette.</p> <p> MeltingCook n’a aucun contrôle sur le comportement de ses membres et des utilisateurs de la plateforme. Elle ne possède pas, n’exploite pas, ne fournit pas, ne gère pas les véhicules objets des recettes, ni ne propose la moindre cuisine sur la plateforme.</p> <p>Vous reconnaissez et acceptez que MeltingCook ne contrôle ni la validité, ni la véracité, ni la légalité des recettes et des places proposées. En sa qualité d’intermédiaire en préparation de plat cuisiné, MeltingCook ne fournit aucun service de restauration et n’agit pas en qualité de chef-cuisinier, le rôle de MeltingCook se limitant à faciliter l’accès à la plateforme.</p> <p>Les membres (cuisinier et apprenant) agissent sous leur seule et entière responsabilité.</p> <p>En sa qualité d’intermédiaire, MeltingCook ne saurait voir sa responsabilité engagée au titre du déroulement effectif d’une recette, et notamment du fait :</p> <ul><li>D’informations erronées communiquées par le cuisinier, dans sa recette, ou par tout autre moyen, quant au services et à ses modalités ;</li> <li> L’annulation ou la modification d’une recette par un membre ;</li> <li> Le non-paiement de la participation aux frais par un passager dans le cadre d’une recette sans Réservation ;</li> <li> Le comportement de ses membres pendant, avant, ou après la cuisine.</li></ul> <h2>13. Fonctionnement, disponibilité et fonctionnalités de la Plateforme</h2> <p>MeltingCook s’efforcera, dans la mesure du possible, de maintenir la plateforme accessible 7 jours sur 7 et 24 heures sur 24. Néanmoins, l’accès à la plateforme pourra être temporairement suspendu, sans préavis, en raison d’opérations techniques de maintenance, de migration, de mises à jour ou en raison de pannes ou de contraintes liées au fonctionnement des réseaux.</p> <p> En outre, MeltingCook se réserve le droit de modifier ou d’interrompre, à sa seule discrétion, de manière temporaire ou permanente, tout ou partie de l’accès à la Plateforme ou de ses fonctionnalités.</p> <h2>14. Modification des CGU</h2> <p>Les présentes CGU et les documents intégrés par référence expriment l’intégralité de l’accord entre vous et MeltingCook relative à votre utilisation des services. Tout autre document, notamment toute mention sur la Plateforme (FAQ, etc.), n’a qu’une valeur informative.</p> <p>MeltingCook pourra être amenée à modifier les présentes Conditions Générales d’Utilisation afin de s’adapter à son environnement technologique et commercial et afin de se conformer à la réglementation en vigueur. Toute modification des présentes CGU sera publiée sur la Plateforme avec une mention de la date de mise à jour et vous sera notifiée par MeltingCook avant son entrée en vigueur.</p> <h2>15. Droit applicable – Litige</h2> <p>Les présentes CGU sont rédigées en français et soumises à la loi française.</p> <p>Vous pouvez également présenter, le cas échéant, vos réclamations relatives à notre plateforme ou à nos services, sur la plateforme de résolution des litiges mise en ligne par la Commission Européenne accessible ici. La Commission Européenne se chargera de transmettre votre réclamation aux médiateurs nationaux compétents. Conformément aux règles applicables à la médiation, vous êtes tenus, avant toute demande de médiation, d’avoir fait préalablement part par écrit à MeltingCook de tout litige afin d’obtenir une solution amiable.</p> <h2>16. Mentions légales<h2> <p>La Plateforme est éditée par Clovis Portron et Charlène Verrier.</p> <p>Le Site est hébergé sur les serveurs d’OVH.</p> <p>Pour toute question, vous pouvez contacter MeltingCook en utilisant ce formulaire de contact.</p> <p>Date de mise à jour: 14 novembre 2017</p> </div> <app-footer></app-footer>', '', '', function(opts) {
});
},{"riot":8}],24:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag2('app-error', '<app-header></app-header> <div class="content"> <h1>Ooops... Quelque chose s\'est mal passé.</h1> <div> <p> Nous sommes désolés pour ce petit soucis. </p> <p if="{message != null}"> {message} </p> </div> </div> <app-footer></app-footer>', '', '', function(opts) {
        var tag = this;

        tag.message = null;

        tag.on("before-mount", function()
        {
            if(tag.opts.message !== null)
                tag.message = tag.opts.message;
        });
});
},{"riot":8}],25:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag2('app-home', '<app-header></app-header> <div class="content no-margin"> <div class="slider"> <div> <div id="slide-1"></div> </div> <div> <div id="slide-2"></div> </div> <div> <div id="slide-3"></div> </div> </div> <app-searcher></app-searcher> <div class="ask"> <div> <h1>Disponible dans vos cuisines ?</h1> <p> Partagez vos frais en apprenant votre savoir et en passant un agréable moment. </p> <a class="Action" href="#/recipe/add"><span>Partager un voyage culinaire</span></a> </div> </div> </div> <div class="description"> <h1>La cuisine c\'est bien, à plusieurs c\'est mieux !</h1> <div> <div class="tab share"> <div class="img"></div> <h2>Partage</h2> <p> Envie de partager vos connaissances en matières de cuisine ? </p> </div> <div class="tab trust"> <div class="img"></div> <h2>Confiance</h2> <p> Avec la vérification par SMS des chefs et aprenants, les cuisiniers se font mutuellement confiance. </p> </div> <div class="tab kitchen"> <div class="img"></div> <h2>Cuisine</h2> <p> Faire découvrir vos goûts et vos plats afin de faire connaître le monde au travers de vos assiettes. </p> </div> </div> </div> </div> <app-footer></app-footer>', '', '', function(opts) {
        var tag = this;

        tag.on("mount", function(){
            setTimeout(() => {
                try
                {
                    $('.slider').slick({
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        autoplay: true,
                        autoplaySpeed: 5000,
                    });
                }
                catch(e)
                {
                    console.log(e);
                }
            }, 1000);

        });

});
},{"riot":8}],26:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag2('app-login', '<form name="login"> <div> <label for="username">Utilisateur</label> <input type="text" ref="username" name="username" id="username"> </div> <div> <label for="password">Mot de passe</label> <input type="password" ref="password" name="password" id="password"> </div> <input type="button" class="large" value="Envoyer" onclick="{send}"> <input type="button" class="large" onclick="{resetPassword}" value="J\'ai oublié mon mot de passe"> </form>', '', '', function(opts) {
        var tag = this;

        tag.callback = null;

        tag.on("before-mount", function()
        {
            tag.callback = tag.opts.callback;
            if(tag.callback == null)
                throw new Error("Callback cant be null.");
        });

        tag.resetPassword = function()
        {
            var callback = function () {
                App.hidePopUp();
            };
            App.hidePopUp();
            App.showPopUp("app-resetpasswordform", "J'ai oublié mon mot de passe", {
                "callback": callback
            });
        };

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
},{"riot":8}],27:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag2('app-resetpasswordform', '<form name="reset"> <p> Veuillez entrer ci-dessous l\'adresse email de votre compte. Nous vous enverrons un mail contenant un lien permettant de regénérer votre mot de passe. </p> <br><br> <div> <label for="email">Addresse email de votre compte</label> <input type="text" ref="email" name="email" id="email"> <p class="hint"> Ce champ doit contenir une adresse email valide. </p> </div> <input type="button" class="large" value="Envoyer" onclick="{validate}"> </form>', '', '', function(opts) {
        var tag = this;

        tag.callback = null;

        tag.on("before-mount", function(){
            tag.callback = tag.opts.callback;
        });

        tag.validate = function()
        {
            var valid = new Validatinator({
                "reset": {
                    "email": "required|minLength:1|maxLength:100|email",
                }
            });
            if (valid.passes("reset")) {
                tag.send();
            }
            if(valid.fails("reset"))
            {
                App.diagnosticForm("reset", valid.errors);
            }
        };

        tag.send = function()
        {
            let request = App.request(App.Address + "/beginresetpassword", {
                "email" : tag.refs.email.value
            });
            request.then(function(response){
                NotificationManager.showNotification("Nous vous avons envoyé un email contenant un lien vous permettant de regénérer votre mot de passe.", "success");
                if(tag.callback != null)
                    tag.callback();
            });
            request.catch(function(error){
                if(error instanceof Error)
                    ErrorHandler.alertIfError(error);
            });
        };
});
},{"riot":8}],28:[function(require,module,exports){
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
},{"riot":8}],29:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag2('app-footer', '<div> <h3>Infos pratiques</h3> <ul> <li>Comment ça marche</li> <li>Confiance et sérénité</li> <li>Niveaux d\'expérience</li> <li>Les avis</li> <li>Charte de bonne conduite</li> <li>Prix d\'un service culinaire</li> <li>Foire aux questions</li> </ul> </div> <div> <h3>A propos</h3> <ul> <li>Qui sommes-nous ?</li> <li>Contact</li> </ul> </div> <div> <h3>Mentions légales</h3> <ul> <li><a href="#/cgu">Conditions générales</a></li> <li>Politique de confidentialité</li> </ul> </div> <div> <a class="Button fb"><span>Facebook</span></a> <a class="Button twitter"><span>Twitter</span></a> <a class="Button insta"><span>Instagram</span></a> <a class="Button youtube"><span>Youtube</span></a> </div> <div class="portfolios"> Site conçu par <a target="_blank" href="http://cha.graphics">Charlène Verrier</a> et développé par <a target="_blank" href="http://www.clovis-portron.cf">Clovis Portron</a> </div>', '', '', function(opts) {
        var tag = this;
});
},{"riot":8}],30:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag2('app-header', '<div class="img" onclick="{home}"></div> <nav> <a class="Action" href="#/recipe/add"><span>Partager un voyage culinaire</span></a> <a class="Button register" if="{logged == false}" onclick="{register}"><span>Inscription</span></a> <a class="Button login" if="{logged == false}" onclick="{login}"><span>Connexion</span></a> <a if="{logged == true}" onclick="{account}"> <div class="img" riot-style="background-image: url(\'{user.picture}\');"></div> </a> <a class="Button logout" if="{logged == true}" onclick="{logout}"><span>Déconnexion</span></a> </nav>', '', '', function(opts) {
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

        tag.logout = function()
        {
            Login.GetInstance().logout();
            tag.auth();
            tag.update();
            route("/");
        }

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
},{"riot":8}],31:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag2('app-hearts', '<div each="{ht in hearts}" class="{ht.state}" data-index="{ht.index}" onclick="{set}"> </div>', '', '', function(opts) {
        var tag = this;
        tag.hearts = null;

        tag.interactive = false;
        tag.index = null;

        tag.value = 3;

        tag.on("before-mount", function()
        {

            if(tag.opts.interactive != null)
                tag.interactive = tag.opts.interactive;

            if(tag.interactive == true) {
                tag.opts.repeat = tag.value;
            }
            tag.createHearts();
        });

        tag.createHearts = function()
        {
            tag.hearts = [];
            for(let i = 0; i < 5; i++) {
                let state = "empty";
                if (i < tag.opts.repeat)
                    state = "full";
                tag.hearts.push({
                    "state" : state,
                    "index" : i+1
                });
            }
        };

        tag.set = function(e)
        {
            if(tag.interactive == false)
                return;
            let ind = parseInt(e.target.getAttribute('data-index'));
            console.log(ind);
            tag.value = ind;
            tag.opts.repeat = tag.value;
            tag.createHearts();
            tag.update();

        }

});
},{"riot":8}],32:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag2('app-manyinputs', '<div> <input type="text" each="{val,i in value.split(delimiter)}" riot-value="{val}" onkeydown="{observe}" onchange="{updateValue}"> <input type="button" value="Ajouter une ligne" onclick="{add}"><input type="button" value="Retirer une ligne" onclick="{remove}"> </div>', '', '', function(opts) {
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
                };

                tag.add = function()
                {
                        tag.value = tag.value+tag.delimiter;
                        tag.length = tag.value.split(tag.delimiter).length;
                        tag.update();
                };

                tag.remove = function()
                {
                        if(tag.length <= 1)
                                return;
                        let inputs = Array.from(tag.root.querySelectorAll("input[type=text]"));
                        let last = inputs.pop();
                        last.remove();
                        tag.length--;
                        tag.updateValue();
                };

});
},{"riot":8}],33:[function(require,module,exports){
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
},{"riot":8}],34:[function(require,module,exports){
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
},{"riot":8}],35:[function(require,module,exports){
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

},{"riot":8}],36:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag2('app-placeinput', '<select ref="city" name="city" id="city" placeholder="Lieu de partage" riot-value="{opts.place}">', '', '', function(opts) {
        var tag = this;
        tag.data = null;
        tag.value = "";

        tag.on("before-mount", function()
        {
            if(tag.opts.place != null) {
                tag.value = tag.opts.place;
            }
            if(tag.opts.valuefield == null)
                tag.opts.valuefield = "geolocation";
        });

        tag.on("mount", function()
        {
            try{
                let data = JSON.parse(localStorage.getItem("cities"));
                if(data == null)
                {
                    tag.retrieveCities();
                    return;
                }
                tag.setCities(data);
            }
            catch (e) {
                tag.retrieveCities();
            }
        });

        tag.retrieveCities = function()
        {
            console.log("Downloading Cities");
            var retrieve = App.request("/static/JS/cities.json");
            retrieve.then(function(response)
            {
                tag.setCities(response.cities);
            });
            retrieve.catch(function(error)
            {
                ErrorHandler.alertIfError(error);
            });
        };

        tag.setCities = function(data)
        {
            tag.data = data;
            let selectize = $('#city', tag.root).selectize({
                persist: false,
                maxItems: 1,
                valueField: "name",
                labelField: 'name',
                searchField: ['name'],
                options: data,
                onChange : function(value) {
                    tag.value = selectize.options[value];
                }
            })[0].selectize;
            localStorage.setItem("cities", JSON.stringify(data));
        }
});
},{"riot":8}],37:[function(require,module,exports){
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
},{"riot":8}],38:[function(require,module,exports){
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
},{"riot":8}],39:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag2('app-uploadinput', '<div class="dropzone"></div>', '', '', function(opts) {
        var tag = this;
        tag.value = null;
        tag.onchange = null;
        tag.on("before-mount", function(){
            if(tag.opts.value != null)
                tag.value = tag.opts.value;
            if(tag.opts.onchange != null)
                tag.onchange = tag.opts.onchange;
        });

        tag.on("mount", function(){
            let callback = function (res) {
                if (res.success === true) {
                    console.log(res.data.link);
                    tag.value = res.data.link;
                    if(tag.onchange != null)
                        tag.onchange();
                }
            };

            new Imgur({
                clientid: 'c15f2df6d132436',
                callback: callback,
                target : tag.root.querySelectorAll(".dropzone"),
                message: "Glissez votre photographie ici ou cliquez ici."
            });
        });
});
},{"riot":8}],40:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag2('app-userselector', '<input type="text" name="user" ref="user" id="user">', '', '', function(opts) {
        var tag = this;

        tag.value = "";

        tag.on("mount", function()
        {
            tag.retrieveUsers();
        });

        tag.retrieveUsers = function()
        {
            let request = App.request(App.Address+"/getusers", null);
            request.then(function(response){
                $('#user', tag.root).selectize({
                    persist: false,
                    maxItems: 1,
                    valueField: ["id"],
                    labelField: 'username',
                    searchField: ['username'],
                    options: response.data,
                    onChange : function(value) {
                        tag.value = value;
                    }
                });
            });
            request.catch(function(error){
               ErrorHandler.alertIfError(error);
            });
        };

});
},{"riot":8}],41:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag2('app-origineditform', '<form name="edit-origin"> <div> <label>Intitulé</label> <textarea name="fullname" ref="name" riot-value="{origin.name}"></textarea> <p> Ce champ doit contenir entre 6 et 400 caractères. </p> </div> <div> <input type="button" class="large" value="Envoyer" onclick="{send}"> </div> </form>', '', '', function(opts) {
        var tag = this;

        tag.origin = null;
        tag.callback = null;

        tag.on("before-mount", function()
        {

            if(tag.opts.origin != null)
                tag.origin = tag.opts.origin;
            if(tag.opts.callback != null)
                tag.callback = tag.opts.callback;

            if(tag.callback == null)
                throw new Error("Callback must be set.");
        });

        tag.send = function()
        {
            if(tag.refs.name.value.length <6 || tag.refs.name.value.length > 400)
            {
                vex.dialog.alert("L'intitulé de l'origine doit comporter entre 6 et 400 caractères.");
                return;
            }
            var adr = App.Address + "/updateorigin";
            var rpt = tag.origin;
            if(tag.origin == null)
            {
                adr = App.Address + "/addorigin";
                rpt = {};
            }
            rpt.name = tag.refs.name.value;
            var request = App.request(adr, rpt);
            request.then((response) => {
                tag.callback();
            });
            request.catch((error) => {
                        ErrorHandler.alertIfError(error);

            });

        }
});
},{"riot":8}],42:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag2('app-pineditform', '<form name="edit-pin"> <div> <label>Intitulé</label> <textarea name="fullname" ref="name" riot-value="{pin.name}"></textarea> <p> Ce champ doit contenir entre 4 et 400 caractères. </p> </div> <div> <input type="button" class="large" value="Envoyer" onclick="{send}"> </div> </form>', '', '', function(opts) {
        var tag = this;

        tag.pin = null;
        tag.callback = null;

        tag.on("before-mount", function()
        {

            if(tag.opts.pin != null)
                tag.pin = tag.opts.pin;
            if(tag.opts.callback != null)
                tag.callback = tag.opts.callback;

            if(tag.callback == null)
                throw new Error("Callback must be set.");
        });

        tag.send = function()
        {
            if(tag.refs.name.value.length <4 || tag.refs.name.value.length > 400)
            {
                vex.dialog.alert("L'intitulé du Plus doit comporter entre 4 et 400 caractères.");
                return;
            }
            var adr = App.Address + "/updatepins";
            var rpt = tag.pin;
            if(tag.pin == null)
            {
                adr = App.Address + "/addpins";
                rpt = {};
            }
            rpt.name = tag.refs.name.value;
            var request = App.request(adr, rpt);
            request.then((response) => {
                tag.callback();
            });
            request.catch((error) => {
                ErrorHandler.alertIfError(error);

            });

        }
});
},{"riot":8}],43:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag2('app-recipe', '<app-header></app-header> <div> <div class="banner" riot-style="background-image: url(\'{recipe.picture}\');"></div> <div class="content"> <div class="infos"> <div class="base"> <div class="name"> <h1>{recipe.name}</h1> <div> <div class="Pins open" each="{p in recipe.pins}">{p}</div> </div> </div> <div class="description"> <p> {recipe.description} </p> </div> </div> <div class="geolocation"> <app-placehint latitude="{recipe.latitude}" longitude="{recipe.longitude}" place="{recipe.place}"></app-placehint> </div> <div class="details"> <h2>Dates :</h2> <div class="dates"> {recipe.date_start_readable} - {recipe.date_end_readable} </div> <h2>Ingédients :</h2> <ul> <li each="{item in recipe.items}">{item}</li> </ul> </div> <div class="users" if="{recipe.users != null && recipe.users.length > 0}"> <h2>Participants :</h2> <app-users users="{recipe.users}"></app-users> </div> </div> <div class="user"> <div class="join"> <h2>Rejoindre la cuisine</h2> <div class="price"> {recipe.price}€ </div> <div> Il reste {recipe.place_left} places </div> <form name="edit-reservation" if="{Login.GetInstance().isLogged() == true}"> <div> <input type="checkbox" name="cgu" ref="cgu"> J\'accepte les CGU </div> <div> <input type="checkbox" name="pc" ref="pc"> J\'accepte la charte de bonne conduite </div> <input type="button" class="large" value="Je rejoins la cuisine" onclick="{join}"> </form> </div> <app-useritem ref="useritem" user="{recipe.user}"></app-useritem> </div> </div> </div> <app-footer></app-footer>', '', '', function(opts) {
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
                NotificationManager.showNotification("Vous devez accepter les CGU pour etre en mesure de réserver avec Melting Cook.", "error");
                return;
            }
            if(tag.refs.pc.checked == false)
            {
                NotificationManager.showNotification("Vous devez accepter la charte de bonne conduite pour etre en mesure de réserver avec Melting Cook.", "error");
                return;
            }
            route("/reservation/recipe/"+tag.recipe.id);
        }
});
},{"riot":8}],44:[function(require,module,exports){
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
},{"riot":8}],45:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag2('app-recipeeditform', '<form name="edit-recipe" if="{recipe != null}"> <section> <h1>Proposer une recette</h1> </section> <section> <h2>Informations de base</h2> <div> <label>Nom de la recette *</label> <input type="text" riot-value="{recipe.name}" placeholder="Nom de la recette" ref="name" name="fullname"> <p class="hint"> Ce champ est requis et ne peut contenir plus de 400 caractères. </p> </div> <div> <label>Description *</label> <textarea name="description" ref="description" placeholder="Décrivez votre recette en quelques mots">{recipe.description}</textarea> <p class="hint"> Ce champ est requis. Il ne peut contenir moins de 50 ou plus de 1000 caractères. </p> </div> <div> <label>Associer une image *</label> <app-uploadinput riot-value="{recipe.picture}" ref="picture" name="picture"></app-uploadinput> <p class="hint"> Ce champ est requis. Il doit contenir une url valide comportant moins de 400 caractères. </p> </div> </section> <section> <h2>Ingrédients et origine</h2> <div> <label>Type de cuisine *</label> <app-origininput ref="origin" name="origin" origin="{recipe.origin}"></app-origininput> <p class="hint"> Ce champ est requis et ne peut contenir plus de 400 caractères. </p> </div> <div> <label>Les "plus"</label> <app-pinsinput ref="pins" name="pins" pins="{recipe.pins}"></app-pinsinput> <p class="hint"> Ce champ ne peut contenir plus de 1000 caractères. </p> </div> <div> <label>Ingrédients principaux *</label> <app-manyinputs ref="items" name="items" riot-value="{recipe.items}"></app-manyinputs> <p class="hint"> Ce champ est requis et ne peut contenir plus de 1000 caractères. </p> </div> </section> <section> <h2>Organisation</h2> <div if="{recipe == null || recipe.id == null}"> <label>Prix de la participation *</label> <input ref="price" name="price" riot-value="{recipe.price}" placeholder="Prix de la participation" type="{\'number\'}"> <p class="hint"> Ce champ est requis et doit contenir un nombre supérieur ou égal à 0. </p> </div> <div> <label>Nombre de places disponibles *</label> <input ref="places" name="places" riot-value="{recipe.places}" placeholder="Nombre de places disponibles" type="{\'number\'}"> <p class="hint"> Ce champ est requis et doit contenir un nombre supérieur ou égal à 1. </p> </div> <div> <label>Nom de la ville/village *</label> <app-placeinput ref="place" name="place" place="{recipe.place}"></app-placeinput> <p class="hint"> Ce champ est requis et ne peut contenir plus de 400 caractères. </p> </div> <div> <label>Date de début de l\'offre *</label> <app-dateinput ref="date_start" name="date_start" date="{recipe.date_start_readable}"></app-dateinput> <p class="hint"> Ce champ est requis. </p> </div> <div> <label>Date de fin de l\'offre *</label> <app-dateinput ref="date_end" name="date_end" date="{recipe.date_end_readable}"></app-dateinput> <p class="hint"> Ce champ est requis. </p> </div> </section> <p> Les champs marqués d\'une * sont requis. </p> <input type="button" class="large" value="Publier ma recette" onclick="{validate}"> </form>', '', '', function(opts) {
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
                    "price" : "required|number|min:0",
                    "places" : "required|number|min:1"
                }
            });
            if (valid.passes("edit-recipe")) {

                var errors = {
                    "edit-recipe" : {}
                };

                if(tag.refs.picture.value == null)
                {
                    errors["edit-recipe"].picture = {
                            "required" : "true"
                        };
                }
                else if(tag.refs.picture.value != "")
                {
                    if(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/.test(tag.refs.picture.value) == false)
                    {
                        errors["edit-recipe"].picture = {
                            "required" : "true"
                        };
                    }
                }

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
                if(tag.refs.place.value == null)
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
            rcp.place = tag.refs.place.value.name;
            rcp.latitude = tag.refs.place.value.latitude;
            rcp.longitude = tag.refs.place.value.longitude;

            var request = App.request(address, rcp);
            request.then((response) => {
                route("/recipe/"+response.data);
            });
            request.catch((error) => {
                ErrorHandler.alertIfError(error);
            });
        }
});
},{"riot":8}],46:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag2('app-recipeitem', '<div class="recipe"> <div class="img" riot-style="background-image: url(\'{recipe.picture}\');"></div> <h1> {recipe.name} </h1> <h1> {recipe.origin[0]} </h1> <div> <span>{recipe.date_start_readable} - {recipe.date_end_readable}</span> </div> <div> <div class="Pins" if="{recipe.pins.length > 0}" each="{p in recipe.pins}">{p}</div> </div> <div class="price"> {recipe.price}€ </div> </div> <div class="user"> <div class="img" riot-style="background-image: url(\'{recipe.user.picture}\');"></div> <div class="name"> <h1> {recipe.user.username} </h1> <h2> {recipe.user.age} ans </h2> </div> <app-hearts repeat="{recipe.user.likes}"></app-hearts> </div>', '', 'onclick="{details}"', function(opts) {
        var tag = this;

        tag.recipe = null;

        tag.on("before-mount", function () {

            if (tag.opts.recipe !== null)
                tag.recipe = Adapter.adaptRecipe(tag.opts.recipe);
            else
                throw new Error("Recipe cant be null");

        });

        tag.details = function () {
            if (tag.recipe !== null)
                route("/recipe/" + tag.recipe.id);
        };

        tag.user = function () {
            if (tag.recipe !== null && tag.recipe.user !== null)
                route("/user/" + tag.recipe.user.id);
        };

});

},{"riot":8}],47:[function(require,module,exports){
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
},{"riot":8}],48:[function(require,module,exports){
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
},{"riot":8}],49:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag2('app-reporteditform', '<form name="edit-report"> <div> <label>Motif du signalement</label> <textarea name="content" ref="content" riot-value="{report.content}"></textarea> <p> Ce champ doit contenir entre 10 et 1000 caractères. </p> </div> <div if="{admin == true && report != null}"> <label>Etat d\'avancement</label> <select name="state" ref="state"> <option value="1" selected="{report.state == 1 || report.state == \'1\'}">Nouveau</option> <option value="2" selected="{report.state == 2 || report.state == \'2\'}">En cours</option> <option value="3" selected="{report.state == 3 || report.state == \'3\'}">Résolu</option> </select> </div> <div> <input type="button" class="large" value="Envoyer" onclick="{send}"> </div> </form>', '', '', function(opts) {
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
                NotificationManager.showNotification("Le motif du signalement doit comporter entre 10 et 1000 caractères.", "error");
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
                rpt.progress = "1";
            }
            else
                rpt.progress = tag.refs.state.options[tag.refs.state.selectedIndex].value;
            rpt.content = tag.refs.content.value;
            console.log(rpt);
            var request = App.request(adr, rpt);
            request.then((response) => {
                tag.callback();
            });
            request.catch((error) => {
                        ErrorHandler.alertIfError(error);

            });

        }
});
},{"riot":8}],50:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag2('app-reportitem', '<div class="identity"> <span><b>Par:</b> <a target="_blank" href="#/user/{report.author.id}">{report.author.username}</a></span> <span><b>Concerne:</b> <a target="_blank" href="#/user/{report.target.id}">{report.target.username}</a></span> </div> <div class="body"> <div> <span><b>Etat:</b> {report.message_progress}</span> </div> <p> {report.content} </p> </div> <div class="foot"> <input type="button" class="large" value="Mettre à jour" onclick="{edit}"> </div>', '', '', function(opts) {
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
                NotificationManager.showNotification("Le signalement a bien été mis à jour.", "success");
                window.location.reload();
            }
            App.showPopUp("app-reporteditform", "Mise à jour d'un signalement", { "callback" : callback, "report" : tag.report});
        }
});
},{"riot":8}],51:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag2('app-reports', '<div> <br><br> <span class="Switch"> <a onclick="{showNews}" class="{selected : list == news}">Nouveaux</a> <a onclick="{showCurrents}" class="{selected : list == currents}">En cours</a> <a onclick="{showEnds}" class="{selected : list == ends}">Terminés</a> <a onclick="{showAll}" class="{selected : list == reports}">Tout</a> </span> <br><br> </div> <app-reportitem each="{report in list}" report="{report}"></app-reportitem>', '', '', function(opts) {
        var tag = this;

        tag.reports = null;

        tag.list = null;

        tag.news = null;
        tag.currents = null;
        tag.ends = null;

        tag.on("before-mount", function () {
            tag.reports = tag.opts.reports;
            if (tag.reports == null)
                throw new Error("Reports cant be null.");
            tag.sortReports();
        });

        tag.sortReports = function () {
            tag.news = new Array();
            tag.currents = new Array();
            tag.ends = new Array();
            tag.reports.forEach((report) => {
                switch (report.progress) {
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
        };

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
            tag.list = tag.reports;
        }
});
},{"riot":8}],52:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag2('app-reservation', '<app-header></app-header> <div class="content"> <section> <h1>Récapitulatif de cuisine</h1> <div> <div> <label>Qui cuisine ?</label> <app-useritem user="{recipe.user}"></app-useritem> </div> <div> <label>Qui participe ?</label> <table> <tr each="{guest in recipe.guests}"> <td>{guest.username}</td> <td><a onclick="{userDetails}" data-id="{guest.id}">Voir le profil</a></td> </tr> </table> <div class="guests" if="{recipe.guests.length <= 0}"> Vous etes le seul participant pour le moment. </div> </div> <div class="recipe"> <label>Apprentissage de:</label> <app-recipeitem recipe="{recipe}"></app-recipeitem> </div> </div> </section> <section> <h1>Faisons les comptes</h1> <div> <table> <tr> <td> 1x Assiette </td> <td> {recipe.price}€ </td> </tr> <tr> <td> Frais de réservation </td> <td> 2€ </td> </tr> <tr> <td> TOTAL </td> <td> {recipe.price+2}€ </td> </tr> </table> </div> </section> <section> <h1>Paiement en ligne par Paypal</h1> <div class="checkout"> <div if="{reservation == null}"> <p>Vous allez pouvoir accéder à Paypal pour finaliser votre paiement.</p> <input type="button" riot-value="Payer {recipe.price+2}€" onclick="{createReservation}"> </div> <div if="{reservation != null}"> <p>Cliquez encore une fois sur le bouton ci-dessous pour confirmer le paiment</p> <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top"> <input type="hidden" name="cmd" value="_xclick"> <input type="hidden" name="business" value="37HN2639NHTKU"> <input type="hidden" name="lc" value="FR"> <input type="hidden" name="item_name" riot-value="{reservation.recipe.name}"> <input type="hidden" name="item_number" riot-value="{reservation.id}"> <input type="hidden" name="amount" riot-value="{(reservation.recipe.price+2)}"> <input type="hidden" name="currency_code" value="EUR"> <input type="hidden" name="button_subtype" value="services"> <input type="hidden" name="no_note" value="0"> <input type="hidden" name="cn" value="Ajouter des instructions spéciales pour le vendeur"> <input type="hidden" name="no_shipping" value="2"> <input type="hidden" name="bn" value="PP-BuyNowBF:btn_paynowCC_LG.gif:NonHosted"> <input type="image" src="https://www.paypalobjects.com/fr_FR/FR/i/btn/btn_paynowCC_LG.gif" border="0" name="submit" alt="PayPal, le réflexe sécurité pour payer en ligne"> <img alt="" border="0" src="https://www.paypalobjects.com/fr_FR/i/scr/pixel.gif" width="1" height="1"> </form> </div> <p>En validant le paiement, vous accepter les CGU et la charte de bonne conduite de Melting Cook.</p> </div> </section> </div> <app-footer></app-footer>', '', '', function(opts) {
        var tag = this;

        tag.recipe = null;
        tag.reservation = null;

        tag.on("before-mount", function()
        {
            tag.recipe = Adapter.adaptRecipe(tag.opts.recipe);
            if(tag.recipe == null)
                throw new Error("Recipe cant be null.");
        });

        tag.createReservation = function()
        {
            let request = App.request(App.Address+"/addreservation", {
                "host_id" : tag.recipe.User_id,
                "guest_id" : Login.GetInstance().User().id,
                "Recipe_id" : tag.recipe.id
            });
            request.catch(function(error){
               ErrorHandler.alertIfError(error);
            });
            let requestReservation = request.then(function(response){
                let id = response.data;
                return App.request(App.Address+"/getreservation", {
                    "id" : id
                });
            });
            requestReservation.then(function(response){
                tag.reservation = Adapter.adaptReservation(response.data);
                console.log(tag.reservation);
                tag.update();
            });

        };

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
},{"riot":8}],53:[function(require,module,exports){
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
},{"riot":8}],54:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag2('app-reservationvalidateform', '<h2> Merci d\'avoir utilisé Melting Cook ! </h2> <p> Nous espérons que vous avez appris des choses et passé un bon moment ! </p> <br> <p> Après cette opération, votre demande de validation sera prise en compte. Votre hôte recevra bientôt sa compensation !<br> </p> <br> <br> <h2>Avant de partir, pouvez-vous laisser un avis sur l\'accueil que votre hôte vous a réservé ci-dessous ?</h2> <app-commenteditform target="{reservation.host}" author="{reservation.guest}" callback="{callback}"></app-commenteditform>', '', '', function(opts) {
        var tag = this;

        tag.reservation = null;
        tag.callback = null;

        tag.on("before-mount", function(){
           tag.reservation = tag.opts.reservation;
           if(tag.reservation == null)
           {
               throw new Error("Reservation cant be null.");
           }
           tag.callback = tag.opts.callback;
        });

});
},{"riot":8}],55:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag2('app-reservations', '<div class="SwitchHandler" if="{interactive}"> <br><br> <span class="Switch"> <a onclick="{showFunds}" class="{selected :  list == funds}">Provisionnées</a> <a onclick="{showDone}" class="{selected : list == done}">A Verser</a> <a onclick="{showRefunds}" class="{selected :  list == refunds}">A Rembourser</a> </span> <br><br> </div> <table> <thead> <tr> <td if="{interactive}">Identifiant</td> <td if="{interactive}">Hôte</td> <td>Invité</td> <td>Montant</td> <td if="{interactive}">Action</td> </tr> </thead> <tbody> <tr each="{reservation in list}" id="reservation-{reservation.id}"> <td if="{interactive}">{reservation.id}</td> <td if="{interactive}">{reservation.host.mail}</td> <td>{reservation.guest.mail}</td> <td>{reservation.recipe.price}</td> <td if="{interactive}"> <input if="{admin == true}" type="button" value="Marquer comme terminée" data-id="{reservation.id}" onclick="{fullfill}"> <input if="{admin == false && reservation.paid == \'1\' && reservation.done == \'0\' && reservation.recipe.date_start <= (new Date().getTime()/1000)}" type="button" value="Je finalise" data-id="{reservation.id}" onclick="{validate}"> <input if="{admin == false && reservation.paid != \'2\' && reservation.done != \'1\'}" type="button" value="J\'annule" data-id="{reservation.id}" onclick="{refund}"> </td> </tr> </tbody> </table>', '', '', function(opts) {
        var tag = this;

        tag.admin = false;
        tag.interactive = true;
        tag.reservations = null;

        tag.list = null;

        tag.done = null;
        tag.refunds = null;
        tag.funds = null;

        tag.on("before-mount", function()
        {
            tag.reservations = tag.opts.reservations;
            if(tag.opts.admin != null)
                tag.admin = tag.opts.admin;
            if(tag.opts.interactive != null)
                tag.interactive = tag.opts.interactive;
            if(tag.reservations == null)
                throw new Error("Reservations cant be null.");

            tag.sortReservations();

        });

        tag.sortReservations = function()
        {
            tag.done = [];
            tag.refunds = [];
            tag.funds = [];

            tag.reservations.forEach((res) => {
                if(res.done == "2" || res.done == 2)
                    return;
                if(res.done == "1")
                {
                    tag.done.push(res);
                    return;
                }

                if(res.paid == "2")
                {
                    tag.refunds.push(res);
                    return;
                }

                if(res.paid == "1")
                    tag.funds.push(res);
            });
            if(tag.admin == true)
                tag.list = tag.done;
            else
                tag.list = tag.funds;
        };

        tag.showRefunds = function()
        {
            tag.list = tag.refunds;
            tag.update();
        };

        tag.showDone = function()
        {
            tag.list = tag.done;
            tag.update();
        };

        tag.showFunds = function()
        {
            tag.list = tag.funds;
            tag.update();
        };

        tag.fullfill = function(e)
        {
            let id = e.target.getAttribute('data-id');
            vex.dialog.confirm({
                message: 'Etes-vous sûr de vouloir marquer cette réservation comme finalisée ? (Cela signifie que vous avez fait le nécessaire via Paypal. )',
                callback: function (value) {
                    if (value) {
                        let request = App.request(App.Address + "/fullfillreservation", {
                            "id" : id
                        });
                        request.then(function(response){
                            tag.reload();
                        });
                        request.catch(function(error){
                           ErrorHandler.alertIfError(error);
                        });
                    }
                }
            });
        };

        tag.validate = function(e)
        {
            let id = e.target.getAttribute('data-id');

            let callback = function()
            {
                let requestvalidate = App.request(App.Address + "/validatereservation", {
                    "id" : id
                });
                requestvalidate.then(function(response){
                    App.hidePopUp();
                    NotificationManager.showNotification("L'attestation a bien été prise en compte. Vous serez informé de l'état d'avancement de votre demande.", "success");
                    tag.reload();
                });
                requestvalidate.catch(function(error){
                    ErrorHandler.alertIfError(error);
                });
            };

            let request = App.request(App.Address+ "/getreservation", {
                "id" : id
            });
            request.then(function(response){
                App.showPopUp("app-reservationvalidateform", "Attestation de la réservation", {
                    "reservation" :  response.data,
                    "callback" : callback
                });
            });
            request.catch(function(error){
               ErrorHandler.alertIfError(error);
            });
        };

        tag.refund = function(e)
        {
            let id = e.target.getAttribute('data-id');
            vex.dialog.confirm({
                message: 'Etes-vous sûr de vouloir annuler cette réservation ? (Si celle-ci a été provisionnée vous serez remboursé selon les conditions Melting Cook.)',
                callback: function (value) {
                    if (value) {
                        let request = App.request(App.Address + "/refundorcancelreservation", {
                            "id" : id
                        });
                        request.then(function(response){
                            tag.reload();
                            NotificationManager.showNotification("L'annulation a bien été prise en compte. Vous serez informé de l'état d'avancement de votre demande.", "success");
                        });
                        request.catch(function(error){
                            ErrorHandler.alertIfError(error);
                        });
                    }
                }
            })
        };

        tag.reload = function()
        {
            let request = App.request(App.Address + "/getreservations", null);
            request.then(function(response){
                tag.reservations = response.data;
                tag.sortReservations();
                tag.update();
            });
            request.catch(function(error){
               ErrorHandler.alertIfError(error);
            });
        };

});
},{"riot":8}],56:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag2('app-search', '<app-header></app-header> <app-searchitem></app-searchitem> <app-footer></app-footer>', '', '', function(opts) {
        var tag = this;
});
},{"riot":8}],57:[function(require,module,exports){
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
                var retrieve = Search.search(tag.refs.place.value.geolocation, tag.refs.origin.value, date, price_start, price_end);
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
},{"riot":8}],58:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag2('app-searchresults', '<app-header></app-header> <app-searcher expanded="{true}" params="{opts.params}"></app-searcher> <div class="content"> <section> <h1>Résultats de la recherche</h1> <hr> <app-recipes recipes="{opts.recipes}"></app-recipes> </section> </div> <app-footer></app-footer>', '', '', function(opts) {
        var tag = this;

});
},{"riot":8}],59:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag2('app-searcher', '<div> <div class="img"></div> <div> <h1>A vos cuisines... Partez !</h1> <h2> La découverte dans vos assiettes. </h2> </div> </div> <form> <app-placeinput ref="place"></app-placeinput> <app-origininput ref="origin" origin="{origin}"></app-origininput> <app-dateinput ref="date" date="{date}"></app-dateinput> <div if="{expanded}"> <input ref="price_start" name="price_start" placeholder="Prix entre" riot-value="{price_start}" type="{\'number\'}"> - <input riot-value="{price_end}" name="price_end" ref="price_end" placeholder="Et" type="{\'number\'}"> </div> <input type="button" value="Chercher un moment sympa !" onclick="{send}"> </form>', '', '', function(opts) {
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
                if(tag.opts.params.length >= 3 && tag.opts.params[2].trim().length > 0)
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
            var params = [tag.refs.place.value.geolocation, tag.refs.origin.value, tag.refs.date.value];

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

                retrieve = Search.search(tag.refs.place.value.geolocation, tag.refs.origin.value, tag.refs.date.value, price_start, price_end);
            }
            else
                retrieve = Search.search(tag.refs.place.value.geolocation, tag.refs.origin.value, tag.refs.date.value);

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
},{"riot":8}],60:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag2('app-user', '<app-header></app-header> <div> <div class="banner" riot-style="background-image: url(\'{user.banner}\');"> </div> <div class="content"> <div class="head"> <img riot-src="{user.picture}"> <div class="identity"> <span>{user.username}</span> <span>{user.age} ans</span> <span>Cuisinnier vérifié</span> </div> </div> <nav> <input type="button" onclick="{showRecipes}" value="Voir les recettes"> <input if="{owner==true}" type="button" onclick="{manage}" value="Gérer mon profil"> <input if="{owner==false}" class="peach" type="button" onclick="{report}" value="Signaler"> </nav> <div class="description"> <h1>Présentation du chef</h1> <p> {user.description} </p> </div> <div class="more"> <div class="{discease : true, invisible : user.discease.length <= 0}"> <h1>Ses allergies</h1> <ul> <li each="{d in user.discease}">{d}</li> </ul> </div> <div class="{preference : true, invisible : user.preference.length <= 0}"> <h1>Ses inspirations</h1> <ul> <li each="{p in user.preference}">{p}</li> </ul> </div> <div> <h1>Ses "plus"</h1><br> <div class="Pins open" each="{p in user.pins}"><span>{p}</span></div> </div> </div> <div class="comments"> <h1>Ses avis</h1> <app-hearts repeat="{user.likes}"></app-hearts> <app-comments comments="{user.comments}"></app-comments> </div> </div> </div> <app-footer></app-footer>', '', '', function(opts) {
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
                NotificationManager.showNotification("L'utilisateur a bien été signalé. Merci de votre vigilance.", "success")
            };
            var report = App.showPopUp("app-reporteditform", "Signaler un utilisateur", {
                "callback": callback,
                "target": tag.user.id
            });
        }
});
},{"riot":8}],61:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag2('app-useredit', '<app-header></app-header> <div class="content"> <app-usereditform ref="form" user="{{}}" callback="{send}"></app-usereditform> </div> <app-footer></app-footer>', '', '', function(opts) {
        var tag = this;

        tag.send = function()
        {
            if(tag.user == null || tag.user.id === null)
            {
                NotificationManager.showNotification("Félicitation ! Vous êtes désormais un membre de Melting Cook. Vous pouvez vous connecter.", "success");
            }
            else
            {
                NotificationManager.showNotification("Vos informations ont bien été mises à jour !", "success");
            }
            route("/");
        }
});
},{"riot":8}],62:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag2('app-usereditform', '<form name="edit-user" if="{user != null}"> <div> <h1>Création/Edition d\'un compte utilisateur</h1> </div> <div> <h2>Présentation du compte</h2> <div class="banner"> <div class="img" ref="banner_preview" riot-style="background-image: url(\'{user.banner}\');"></div> <div> <label>Télécharger une bannière:</label> <app-uploadinput riot-value="{user.banner}" ref="banner" name="banner" onchange="{updateBanner}"></app-uploadinput> <p class="hint"> Ce champ doit contenir une adresse URL valide. </p> <p> Les dimensions recommandées pour un résultat optimal sont 1500 x 500 pixels </p> </div> </div> <div class="picture"> <div class="img" ref="picture_preview" riot-style="background-image: url(\'{user.picture}\');"></div> <div> <label>Télécharger une photo de profil:</label> <app-uploadinput riot-value="{user.picture}" ref="picture" name="picture" onchange="{updatePicture}"></app-uploadinput> <p class="hint"> Ce champ doit contenir une adresse URL valide. </p> <p> Les dimensions recommandées pour un résultat optimal sont 400 x 400 pixels </p> </div> </div> </div> <div> <h2>Informations de base</h2> <div class="base"> <div class="{invisible: user.id != null}"> <label>Nom d\'utilisateur: </label> <input type="text" name="username" ref="username" riot-value="{user.username}"> <p class="hint">Ce champ doit contenir entre 5 et 400 caractères.</p> <p> Vous ne pourrez plus changer de nom d\'utilisateur après l\'inscription. Choisissez avec sagesse.</p> </div> <div class="{invisible: user.id != null}"> <label>Mot de passe: </label> <input type="password" name="password" ref="password"> <p class="hint"> Ce champ doit contenir entre 8 et 100 caractères.<br> Le mot de passe et sa confirmation doivent correspondre. </p> </div> <div class="{invisible: user.id != null}"> <label>Confirmation mot de passe: </label> <input type="password" name="password_confirm" ref="password_confirm"> <p class="hint"> Ce champ doit contenir entre 8 et 100 caractères.<br> Le mot de passe et sa confirmation doivent correspondre. </p> </div> <div> <label>Age: </label> <input type="text" name="age" ref="age" riot-value="{user.age}"> <p class="hint"> Ce champ doit contenir une valeur numérique comprise entre 0 et 100. </p> </div> <div> <label>Numéro de téléphone:</label> <input type="text" name="phone" ref="phone" riot-value="{user.phone}"> <p class="hint"> Ce champ doit contenir un numéro de téléphone valide. </p> </div> </div> </div> <div> <div class="bills"> <h2>Informations de facturation</h2> <div> <label>Adresse Email associée au compte Paypal:</label> <input type="text" name="mail" ref="mail" riot-value="{user.mail}"> <p class="hint">Ce champ doit contenir une adresse email valide.</p> <p>Pensez à vérifier qu\'il s\'agit bien de l\'adresse email associée à votre compte Paypal. Nous allons l\'utiliser pour vous verser votre dû.</p> </div> <div> <label>Présentation: </label> <textarea name="description" ref="description"> {user.description} </textarea> <p class="hint"> Ce champ doit contenir entre 50 et 1000 caractères. </p> </div> <div> <label>Adresse:</label> <input type="text" name="address" ref="address" riot-value="{user.address}"> <p class="hint"> Ce champ doit contenir votre adresse de facturation. Cette adresse ne sera pas transmise aux autres utilisateurs. </p> </div> <div> <label>Prénom:</label> <input type="text" name="firstname" ref="firstname" riot-value="{user.firstname}"> <p class="hint"> Ce champ doit contenir le prénom qui sera utilisé sur les factures. </p> </div> <div> <label>Nom:</label> <input type="text" name="lastname" ref="lastname" riot-value="{user.lastname}"> <p class="hint"> Ce champ doit contenir le nom qui sera utilisé sur les factures. </p> </div> </div> </div> <div> <div class="more"> <h2>Détails importants</h2> <div> <label>Mes allergies:</label> <div> <input type="text" name="discease" ref="discease" id="discease" riot-value="{user.discease}"> </div> <p class="hint">Ce champ ne peut contenir plus de 1000 caractères.</p> <p> Veuillez renseigner les informations relatives à vos éventuelles allergies et contre-indications alimentaires. </p> </div> <div> <label>Mes inspirations:</label> <app-origininput ref="preference"></app-origininput> <p class="hint"> Ce champ ne peut contenir plus de 1000 caractères. </p> <p> Indiquez aux autres utilisateurs quelles sont vos sources d\'inspiration alimentaires ! </p> </div> <div> <label>Mes plus:</label> <app-pinsinput ref="pins"></app-pinsinput> <p class="hint"> Ce champ ne peut contenir plus de 1000 caractères. </p> <p> Indiquez aux autres utilisateurs vos petit plus !<br> e.g: Bio, Vegan, Sans-gluten, Halal </p> </div> </div> </div> <div if="{user.id != null}"> <h2>Actions</h2> <div class="{action : true, invisible: (user.id==null)}"> <input type="button" class="large" value="Réinitialiser mon mot de passe" onclick="{changePassword}"> </div> </div> <div> <input type="button" class="large" value="Enregistrer" onclick="{validate}"> </div> </form>', '', '', function(opts) {
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
        };

        tag.changePassword = function () {
            var callback = function () {
                App.hidePopUp();
                NotificationManager.showNotification("Votre mot de passe va être modifié. Veuillez allez recevoir un mail de confirmation. Veuillez vous reconnecter.", "success");
                route("/login");
            };

            App.showPopUp("app-userpasswordform", "Modifier votre mot de passe", {
                "callback": callback,
                "user": tag.user
            });
        };

        tag.details = function()
        {
            if(tag.user != null && tag.user.id != null)
                route("/user/"+tag.user.id);
        };

        tag.updatePicture = function()
        {
            tag.refs.picture_preview.style.backgroundImage = "url('"+tag.refs.picture.value+"')";
        };

        tag.updateBanner = function()
        {
            tag.refs.banner_preview.style.backgroundImage = "url('"+tag.refs.banner.value+"')";
        };

        tag.validate = function () {
            var valid = new Validatinator({
                "edit-user": {
                    "banner": "maxLength:400",
                    "username": "required|minLength:5|maxLength:400",
                    "age": "required|number|maxLength:3",
                    "phone": "required|minLength:10|maxLength:400",
                    "mail": "required|email|maxLength:400",
                    "description": "required|minLength:50|maxLength:1000",
                    "picture": "maxLength:400",
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

                if(tag.refs.banner.value == null)
                {
                    errors["edit-user"].banner = {
                            "required" : "true"
                        };
                }
                else if(tag.refs.banner.value != "")
                {
                    if(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/.test(tag.refs.banner.value) == false)
                    {
                        errors["edit-user"].banner = {
                            "required" : "true"
                        };
                    }
                }

                if(tag.refs.picture.value == null)
                {
                    errors["edit-user"].picture = {
                            "required" : "true"
                    };
                }
                if(tag.refs.picture.value != "")
                {
                    if(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/.test(tag.refs.picture.value) == false)
                    {
                        errors["edit-user"].picture = {
                            "required" : "true"
                        };
                    }
                }

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
        };

        tag.send = function()
        {

            var usr = tag.user;
            if (usr.id == null)
                usr = {};
            if(tag.user.id == null)
            {
                usr.password = md5(tag.refs.password.value);
            }

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
                Login.GetInstance().setUser(usr);
                tag.callback();
            });
            request.catch((error) => {
                ErrorHandler.alertIfError(error);

            });
        }
});
},{"riot":8}],63:[function(require,module,exports){
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
},{"riot":8}],64:[function(require,module,exports){
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
},{"riot":8}],65:[function(require,module,exports){
var riot = require('riot');
module.exports = riot.tag2('app-users', '<div class="user" each="{user in users}" data-id="{user.id}"> <img riot-src="{user.picture}"> <div> <a href="#/user/{user.id}">{user.username}</a><br> {user.age} ans </div> <app-hearts repeat="{user.likes}"></app-hearts> </div>', '', '', function(opts) {
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
},{"riot":8}]},{},[9])(9)
});