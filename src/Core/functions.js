/*
 * All global functions and prototype modifications
 */

global.displayCakeConstants = function()
{
	for(var key of ['APP', 'APP_DIR', 'CACHE', 'CAKE', 'CAKE_CORE_INCLUDE_PATH', 'CORE_PATH', 'CAKE_VERSION', 'DS', 'LOGS', 'ROOT', 'TESTS', 'TMP', 'WWW_ROOT']){
		if(typeof global[key] === 'string'){
			console.log(key+': "'+global[key]+'"');
		}else if(typeof global[key] === 'undefined'){
			console.log(key+': ""');
		}
	}
};

global.pluginSplit = function(name, dotAppend = false, plugin = null)
{
	if(name.indexOf('.') !== -1){
		var parts = name.split('.', 2);
		if(dotAppend){
			parts[0] += '.';
		}
		return parts;
	}
	return [plugin, name];
};

global.sprintf = require("sprintf-js").sprintf;

Object.values = function(object)
{
	if(typeof object !== 'object'){
		return [];
	}
	var values = [];
	if(object instanceof Array){
		for(var i = 0; i < object.length; i++){
			values.push(object[i]);
		}
	}else{
		for(var key in object){
			values.push(object[key]);
		}
	}
	return values;
}

Object.forEachSync = function(object, callback)
{
	if(typeof object !== 'object'){
		return [];
	}
	if(object instanceof Array){
		for(var i = 0; i < object.length; i++){
			if(callback(object[i], i) === false){
				break;
			}
		}
	}else{
		for(var key in object){
			if(callback(object[key], key) === false){
				break;
			}
		}
	}
}

Object.forEach = async function(object, callback)
{
	if(typeof object === 'object' && object instanceof Promise){
		object = await object;
	}
	if(typeof object !== 'object'){
		return [];
	}
	if(object instanceof Array){
		for(var i = 0; i < object.length; i++){
			if(await callback(object[i], i) === false){
				break;
			}
		}
	}else{
		for(var key in object){
			if(await callback(object[key], key) === false){
				break;
			}
		}
	}
}

/*
 * Date Format 1.2.3
 * (c) 2007-2009 Steven Levithan <stevenlevithan.com>
 * MIT license
 *
 * Includes enhancements by Scott Trenda <scott.trenda.net>
 * and Kris Kowal <cixar.com/~kris.kowal/>
 *
 * Accepts a date, a mask, or a date and a mask.
 * Returns a formatted version of the given date.
 * The date defaults to the current date/time.
 * The mask defaults to dateFormat.masks.default.
 */

var dateFormat = function () {
	var	token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
		timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
		timezoneClip = /[^-+\dA-Z]/g,
		pad = function (val, len) {
			val = String(val);
			len = len || 2;
			while (val.length < len) val = "0" + val;
			return val;
		};

	// Regexes and supporting functions are cached through closure
	return function (date, mask, utc) {
		var dF = dateFormat;

		// You can't provide utc if you skip other args (use the "UTC:" mask prefix)
		if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
			mask = date;
			date = undefined;
		}

		// Passing date through Date applies Date.parse, if necessary
		date = date ? new Date(date) : new Date;
		if (isNaN(date)) throw SyntaxError("invalid date");

		mask = String(dF.masks[mask] || mask || dF.masks["default"]);

		// Allow setting the utc argument via the mask
		if (mask.slice(0, 4) == "UTC:") {
			mask = mask.slice(4);
			utc = true;
		}

		var	_ = utc ? "getUTC" : "get",
			d = date[_ + "Date"](),
			D = date[_ + "Day"](),
			m = date[_ + "Month"](),
			y = date[_ + "FullYear"](),
			H = date[_ + "Hours"](),
			M = date[_ + "Minutes"](),
			s = date[_ + "Seconds"](),
			L = date[_ + "Milliseconds"](),
			o = utc ? 0 : date.getTimezoneOffset(),
			flags = {
				d:    d,
				dd:   pad(d),
				ddd:  dF.i18n.dayNames[D],
				dddd: dF.i18n.dayNames[D + 7],
				m:    m + 1,
				mm:   pad(m + 1),
				mmm:  dF.i18n.monthNames[m],
				mmmm: dF.i18n.monthNames[m + 12],
				yy:   String(y).slice(2),
				yyyy: y,
				h:    H % 12 || 12,
				hh:   pad(H % 12 || 12),
				H:    H,
				HH:   pad(H),
				M:    M,
				MM:   pad(M),
				s:    s,
				ss:   pad(s),
				l:    pad(L, 3),
				L:    pad(L > 99 ? Math.round(L / 10) : L),
				t:    H < 12 ? "a"  : "p",
				tt:   H < 12 ? "am" : "pm",
				T:    H < 12 ? "A"  : "P",
				TT:   H < 12 ? "AM" : "PM",
				Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
				o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
				S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
			};

		return mask.replace(token, function ($0) {
			return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
		});
	};
}();

// Some common format strings
dateFormat.masks = {
	"mysqlDateTime": "yyyy-mm-dd HH:MM:ss",
	"mssqlDateTime": "yyyy-mm-dd HH:MM:ss.l",
	"mysqlDate": "yyyy-mm-dd",
	"mssqlDate": "yyyy-mm-dd",
	"mysqlTime": "HH:MM:ss",
	"mssqlTime": "HH:MM:ss.l",
	full:      "ddd mmm dd yyyy HH:MM:ss",
	shortDate:      "m/d/yy",
	mediumDate:     "mmm d, yyyy",
	longDate:       "mmmm d, yyyy",
	fullDate:       "dddd, mmmm d, yyyy",
	shortTime:      "h:MM TT",
	mediumTime:     "h:MM:ss TT",
	longTime:       "h:MM:ss TT Z",
	isoDate:        "yyyy-mm-dd",
	isoTime:        "HH:MM:ss",
	isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",
	isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
};

// Internationalization strings
dateFormat.i18n = {
	dayNames: [
		"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
		"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
	],
	monthNames: [
		"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
		"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
	]
};

dateFormat.masks.default = dateFormat.masks.mysqlDateTime;


// For convenience...
Date.prototype.format = function (mask, utc) {
	return dateFormat(this, mask, utc);
};

global.mt_rand = function (min, max) {
  //  discuss at: http://phpjs.org/functions/mt_rand/
  // original by: Onno Marsman
  // improved by: Brett Zamir (http://brett-zamir.me)
  //    input by: Kongo
  //   example 1: mt_rand(1, 1);
  //   returns 1: 1

  var argc = arguments.length;
  if (argc === 0) {
    min = 0;
    max = 2147483647;
  } else if (argc === 1) {
    throw new Error('Warning: mt_rand() expects exactly 2 parameters, 1 given');
  } else {
    min = parseInt(min, 10);
    max = parseInt(max, 10);
  }
  return Math.floor(Math.random() * (max - min + 1)) + min;
}