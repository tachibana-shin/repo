/*!
 * my.js v1.4.2 b24
 * (c) 2020 Shinigami
 * Released under the MIT License.
 */
!function( global, factory ) {
"use strict"
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = global.document ? factory(global, !0) : function (w) {
	if (!w.document)
		throw new Error("myjs requires a window with a document");
	return factory( w )
} : typeof define === 'function' && define.amd ? define(factory) :
	factory(global, !1)
}(this, function (root, noGl) {
"use strict"
function isFunc (e) {
	return typeof e === 'function' && typeof e.nodeType !== 'number'
}
function isLikeArr (arr) {
	if (isFunc(arr) || arr === root) 
		return false;
	return isObj(arr) && 'length' in arr
}
function isObj (obj) {
	return obj !== null && typeof obj === 'object'
}
function isNumeric (n) {
	return typeof n === 'number' || (typeof n === 'string' && !Number.isNaN(n - 0))
}
function isset (e) {
	return e !== null && e !== undefined
}
function isWin (e) {
	return e != null && e === e.window
}
function map (a, b, c, d, e) {
	return ((a - b) * (e - d))/(c - b) + d
}
function deflt (a, d) {
	return isset(a) ? a : d
}
function randInt (a) {
	return round(rand(a))
}
function rand (a) {
	return Math.random()*a
}
function randColor () {
	return 'rgb(' + [randInt(255), randInt(255), randInt(255)].join(', ') + ')'
}
var hypot = typeof Math.hypot === 'function' ? Math.hypot : function () {
	var len = arguments.length, i = 0, result = 0;
	while (i < len)
		result += pow(arguments[i++], 2);
	return sqrt(result)
}
//ownerDocument -- defaultView
var isArr = Array.isArray,
	def = Object.defineProperty,
	DOM = document,
	DOMe = DOM.documentElement,
	slice = [].slice,
	concat = [].concat,
	push = [].push,
	indexOf = [].indexOf,
	toString = {}.toString,
	rtype = /\[object (.+)]/,
	M = Math,
	window = (isWin(root) ? root : DOM.defaultView) || root,
	nav = window.navigator,
	rDel = /[^\x20\t\r\n\f]+/g,
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
	rtagName = /<([a-z][^\/\0>\x20\t\r\n\f]+)/i,
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi,
	rhtml = /<|&#?\w+;/,
	selector = /[a-zA-Z_]|\.|#/,
	prefix = ' -webkit- -moz- -ms- -o- -khtml-'.split(' '),
	xprefix = /\-(?:webkit|moz|ms|o|khtml)\-/i,
	_prefix = prefix.length,
	rhash = /#.*$/,
	rquery = /\?/,
	rantiCache = /([?&])_=[^&]*/,
	rprotocol = /^\/\//, r20 = /%20/g,
	rnoContent = /^(?:GET|HEAD)$/,
	rnothtmlwhite = /[^\x20\t\r\n\f]+/g,
	expandoUID = "myJS" + (Math.random() + "").replace(/\D/g, ""),
device = {
	fullLang: nav && nav.language,
	lang: nav && nav.language.slice(0, 2),
	navigator: nav,
	window: window,
	get network () {
		return nav && nav.onLine
	},
	get cookieEnabled () {
		return nav && nav.cookieEnabled
	},
	get ww() {
		return window.innerWidth || DOMe.clientWidth || DOM.body.clientWidth
	},
	get wh() {
		return window.innerHeight || DOMe.clientHeight || DOM.body.clientHeight
	},
	cookie: {
		set: function () {
			var e = arguments, key = e[0], val = e[1], date, addExprs = e[2], path = e[3], $1, $2 = 0, exprs, tmp;

			if(1 === e.length && isObj(key))
				val = key.value, exprs = key.expires || key.UTC, date = key.date, path = key.path, addExprs = (key.add || "").trim(), key = key.key;
			
			if (addExprs) {
				$1 = parseFloat(addExprs)

tmp = addExprs.match(/[a-z]/gi)
switch (tmp ? tmp.join('') : 'seconds') {
	case "day": $2 = 864e5
		break;
	case "week": $2 = 6048e5
		break;
	case "hours": $2 = 36e5
		break;
	case "minutes": $2 = 6e4
		break;
	case "seconds": $2 = 1e3
		break;
	default: $2 = 1
}
	exprs = new Date(Date.now() + $1 * $2).toUTCString()
			}
			else if (time) exprs = new Date(time).toUTCString()

			return DOM.cookie = key + " = " + val + (exprs ? "; expires = " + exprs : "") + (path ? "; path = " + path : ""), this
		},
		get: function (e) {
			var arr = DOM.cookie
					.split(";"),
				i = 0,
				n = arr.length, tmp;
			
			while (i < n) {
				tmp = arr[i++].trim()
					.split("=")
				if (tmp[0] === e)
					return tmp
						.slice(1)
						.join("=")
			}
		},
		get count() {
			return DOM.cookie
				.split(";").length
		},
		each: function (e) {
			if (!DOM.cookie.match(/\S+/)) 
				return this;
			var arr = DOM.cookie
					.split(";"),
				i = 0,
				n = arr.length, tmp;
			while (i < n) {
				tmp = arr[i++].trim().split("=");
				if(!1 === e.call(
					tmp.slice(1).join("="),
					tmp[0],
					tmp.slice(1).join("="))) break;
			};
			
			return this
		},
		clear: function () {
			var i = this;
			return this.each(function (e) {
				i.set({
					key: e,
					value: "",
					add: "-1 seconds"
				})
			}), i
		},
		remove: function (key) {
			var i = this;
			key = classToArray(key)
			Loop(key, function (val) {
				i.each(function (e) {
					val === e &&i.set({
						key: e,
						value: "",
						add: "-1 seconds"
					})
				})
			})
			return this
		},
		exists: function (e) {
			return this.get(e) !== undefined
		}
	}
},
	isTouch = 'ontouchstart' in window || 'onmsgesturechange' in window,
pi=M.PI,abs=M.abs,floor=M.floor,pow=M.pow,sqrt=M.sqrt,sin=M.sin,cos=M.cos,tan=M.tan,ceil=M.ceil,round=M.round,asin=M.asin,acos=M.acos,atan=M.atan,acot=M.atan2;
!function (arr) {
var args = arr.split(' '), i = 0, fn;
while (fn = args[i++])
	def(window, fn, {
		value: eval(fn),
		configurable: !0
	});
}('isFunc isArr isLikeArr isObj isset map deflt randInt rand abs floor pow sqrt sin cos tan ceil round asin acos atan acot hypot randColor isTouch pi device')
function addPx (e) {
	return isNumeric(e) ? e + 'px' : e
}
function stripedClass (str) {
	return (str.match(rDel) || []).join(' ')
}
function classToArray (val) {
    if (isArr(val)) return val;
    if (typeof val === 'string')
    	return val.match(rDel) || [];
	return []
}
function Loop (e, fn) {
    var len = e.length, i = 0;
    while (i < len) fn.call(root, e[i], i++, e);
}
function toArr (e) {
    return isLikeArr(e) ? e : [e]
}
function htmlPrefilter (html) {
	return html.replace(rxhtmlTag, '<$1></$2>')
}
var wrapMap = {
	option: [1, "<select multiple='multiple'>", "</select>"],
	thead: [1, "<table>", "</table>"],
	col: [2, "<table><colgroup>", "</colgroup></table>"],
	tr: [2, "<table><tbody>", "</tbody></table>"],
	td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
	_default: [ 0, "", "" ]
}
wrapMap.optgroup = wrapMap.option
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead
wrapMap.th = wrapMap.td
function domify (html) {
var frag = DOM.createDocumentFragment(),
tmp, tag, wrap, scripts, all, elem;

	    tmp = DOM.createElement('div')
	    tag = (rtagName.exec(html) || ['', ''])[1].toLowerCase()
	wrap = wrapMap[tag] || wrapMap._default

	tmp.innerHTML = wrap[1] + htmlPrefilter(html) + wrap[2]

		var j = wrap[0];
		while (j--) tmp = tmp.lastChild;

		scripts = tmp.getElementsByTagName('script')
	var i = 0, script, leng = scripts.length;
	while (i < leng) {
		elem = scripts[i++]
		script = DOM.createElement ('script')
    		script.innerHTML = elem.innerHTML
		my(elem).replace(script)
	}
	all = tmp.childNodes;
	while (elem = all[0])
		frag.appendChild(elem);

	return frag
}
function targetHTML (html) {
	if (typeof html === 'string') {
		if ( rhtml.test (html) )
		    return domify (my.trim(html));
		else return DOM.createTextNode (html);
	} else return html;
}
// scroll [Width | Height | Top | Left]
var CustomEvent = function () {
if ( typeof window.CustomEvent === "function" ) return window.CustomEvent;

if ( typeof root.CustomEvent === "function" ) return root.CustomEvent;

  function CustomEvent ( event, params ) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    var evt = DOM.createEvent( 'CustomEvent' );
    evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
    return evt;
   }
  CustomEvent.prototype = Event.prototype

  return CustomEvent;
}()
function camelCase (str) {
	return str.replace(/^-ms-/, 'ms-').replace(/-([a-z])/g, function (str, char) {
		return char.toUpperCase()
	})
}
function nodeName (el, name) {
	return el.nodeName && el.nodeName.toLowerCase() === name.toLowerCase()
}
function Data (uid) {
    this.expando = expandoUID + uid
}
Data.prototype = {
	cache: function (el) {
		var val = el[this.expando]
		if (!val) {
			val = {}
			def(el, this.expando, {
				value: val,
				configurable: true
			})
		}
		return val
	},
	set: function (el, key, val) {
		var prop,
			cache = this.cache( el );

		if (typeof key === "string")
			cache[camelCase(key)] = val;
		else {
			for (prop in key)
				cache[camelCase(prop)] = key[prop];
		}
		return cache;
	},
	get: function (el, key) {
		return key === undefined ? this.cache(el) : el[this.expando] && el[this.expando][camelCase(key)]
	},
	remove: function (el, key) {
		var i, cache = el[this.expando];

		if (cache === undefined) {
			return;
		}

		if ( key !== undefined ) {
			if ( isArr(key) )
				key = key.map( camelCase );
			else {
				key = camelCase( key )
				key = key in cache ?
					[ key ] :
				( key.match( rnothtmlwhite ) || [] );
			}
			i = key.length;

			while (i--)
				delete cache[key[i]];
		}

		if ( key === undefined || my.isEmptyObject(cache) )
			delete el[this.expando];
	},
	hasData: function (el) {
	    return this.cache(el) !== undefined && !my.isEmptyObject(this.cache(el))
	},
	access: function(el, key, val) {
		if ( key === undefined || (key && typeof key === "string" && val === undefined ))
			return this.get(el, key);

		this.set(el, key, val)

		return val !== undefined ? val : key
	}
}
var dataPriv = new Data(1)
var dataUser = new Data(2)

function my(elem) {
	return new my.fn.init(elem)
}
my.fn = my.prototype = {
constructor: my,
my: true,
init: function (elem) {
var elems = [], i = 0, length;

elem === undefined && (elem = DOM)
if (typeof elem === 'string') {
	elem = my.trim(elem)

	elems = selector.test (elem[0]) ?
		DOM.querySelectorAll(elem) :
		slice.call(domify(elem).childNodes)
}
else elems = isLikeArr(elem) ? elem : [elem];

length = this.length = elems.length

	while (i < length)
		this[i] = elems[i++];
},
length: 0,
getWindow: function () {
return this[0].defaultView || this[0].ownerDocument.defaultView || window
},
eq: function (e) {return my(this[e < 0 ? this.length + e : e])},
get: function (i) {
	return i == null ? slice.call(this) : this[i < 0 ? this.length + i : i]
},
first: function () {return this.eq(0)},
last: function () {return this.eq(-1)},
child: function (i) {
var el = this[0].children
    return my(arguments.length ? el[i < 0 ? el.length + i : i] : el)
},
each: function (e) {return my.each(this, e)},
map: function (e) {return my.map(this, e)},
flatMap: function (e) {return my.flatMap(this, e)},
contents: function () {
var el = this[0];
if (nodeName(el, 'iframe'))
	return el.contentDocument;
if (nodeName(el, 'template'))
	el = el.content || el;
return my.merge([], el.childNodes)
},
prop: function (k, v) {
var el = this[0]
	if(v === undefined) return el[k];
	if (isObj(k)) return my.each(k, function (i, e) {el[i] = e}), this;
	el[k] = v
  return this
},
unProp: function (arr) {
var el = this[0]
	Loop(classToArray(arr), function (i, e) {delete el[i]})
	return this
},
find: function(q){return my(this[0].querySelectorAll(q))},
trigger: function(n, d) {
var elem = this[0];
if ( elem.dispatchEvent )
	return elem.dispatchEvent(new CustomEvent(n, { bubbles: true, detail: d})), this;
if ( elem.fireEvent )
	return elem.fireEvent(new CustomEvent(n, { bubbles: true, detail: d})), this;
	isArr(dataPriv.cache(elem).events) && 
	dataPriv.cache(elem).events.map(function (e) {
		e.eType === n && isFunc (e.callBack) && e.callBack.call(elem, {bubbles: true, detail: d})
	})
return this
},
load: function () {
var that = this, args = arguments, url = args[0], data = args[1], fn = args[2], length = args.length;

if (length === 0)
	return this[0].load(), this;
if (length === 1 && isFunc(url))
	return this.on("load", url);
if (length === 2 && isFunc(data))
	fn = data,
	data = undefined;

return my.ajax({
	url: url,
	data: data,
	type: data ? "post" : "get",
	success: function (t) {
		that.empty().append(t)
		isFunc(fn) && fn.apply(this, arguments)
	},
	error: args[4]
}), this
},
id: function(i){return this.prop('id', i)},
class: function(g){return this.prop('className', g)},
addClass: function (val) {
var elem = this[0];
    if (isFunc(val))
    	val = val.call(elem, elem.className);
	var lastClass = elem.className
	
	var custom = ' ' + 
			stripedClass(lastClass) +
			' '
	var clasess = classToArray (val)
	
	var i = 0, clazz;
	while (clazz = clasess[i++]) {
	    if (custom.indexOf (
	    	' ' + clazz + ' '
	    ) < 0) 
	    	custom += clazz + ' ';
	}
	custom = stripedClass (custom)
	
	if (lastClass !== custom)
		elem.className = custom;
	return this;
},
removeClass: function (val) {
var elem = this[0];
    if (isFunc(val))
    	val = val.call(elem, elem.className);
	var lastClass = elem.className
	
	var custom = ' ' + stripedClass(lastClass) + ' '
	var clasess = classToArray (val)
	
	var i = 0, clazz;
	while (clazz = clasess[i++]) {
	    if (custom.indexOf (' ' + clazz + ' ') > -1) 
	    	custom = custom.replace(' ' + clazz + ' ', ' ');
	}
	custom = stripedClass (custom)
	
	if (lastClass !== custom)
		elem.className = custom;
	return this;
},
toggleClass: function (val) {
var elem = this[0];
    if (isFunc(val))
    	val = val.call(elem, elem.className);
	var lastClass = elem.className
	
	var custom = ' ' + 
			stripedClass(lastClass) +
			' '
	var clasess = classToArray (val)
	
	var i = 0, clazz;
	while (clazz = clasess[i++]) {
	    if (custom.indexOf (
	    	' ' + clazz + ' '
	    ) < 0) 
	    	custom += clazz + ' ';
	    else custom = custom.replace(' ' + clazz + ' ', ' ');
	}
	
	custom = stripedClass (custom)
	
	if (lastClass !== custom)
		elem.className = custom;
	return this;
},
hasClass: function (val) {
var elem = this[0];
    if (isFunc(val))
    	val = val.call(elem, elem.className);
	return (' ' + stripedClass(elem.className) + ' ').indexOf (' ' + val + ' ') > -1
},
before: function () {
var elem = this[0];
Loop(arguments, function (e) {
	Loop(toArr(e), function (f) {
		elem.parentNode
		.insertBefore(
			targetHTML(f),
			elem
		)
	})
})
return this
},
after: function () {
var elem = this[0];
Loop(arguments, function (e) {
	Loop(toArr(e), function (f) {
		elem.parentNode
		.insertBefore(
			targetHTML(f),
			elem.nextSibling
		)
	})
})
return this
},
append: function () {
var elem = this[0];
Loop(arguments, function (e) {
	Loop(toArr(e), function (f) {
		elem.appendChild(
			targetHTML(f)
		)
	})
})
return this
},
prepend: function () {
var elem = this[0];
Loop(arguments, function (e) {
	Loop(toArr(e), function (f) {
		elem.firstChild === null ? 
			elem.appendChild(
				targetHTML(e)
			) :
			elem.insertBefore(
				targetHTML(e),
				elem.firstChild
			)
	})
})
return this
},
appendTo: function (e) {
return my(e).append(this[0]), this
},
prependTo: function (e) {
return my(e).prepend(this[0]), this
},
tag: function(){return (( this[0] || '' ).tagName || '').toLowerCase()},
childCount: function () {return (this[0] || '').childElementCount},
event: function (name, fn, opt) {
var that = this, elem = this[0]

isFunc(fn) && Loop(classToArray(name), function (e) {
	that._event_(e, fn, opt)
	isArr(dataPriv.cache(elem).events) || (dataPriv.cache(elem).events = [])
	dataPriv.cache(elem).events.push({
		eType: e,
		callBack: fn,
		more: opt
	})
})
return my.extend(this, {
	prevent: function (fn, opt) {
		arguments.length < 2 && (opt = { passive: false })
		return that.on(name, function (n) {
			try {
				n.preventDefault()
			} catch (e) {}
			if ( isFunc(fn) )
				return fn.call(this, n)
		}, opt)
	},
	stop: function (fn, opt) {
		return that.on(name, function (n) {
			try {
				n.stopPropagation()
			} catch (e) {}
			if( isFunc(fn) )
				return fn.call(this, n)
		}, opt)
	},
	then: function (fn, opt) {	
		return that.on(name, fn, opt)
	}
})
},
unEvent: function (name, fn, opt) {
var that = this, elem = this[0], cache;
if(isFunc(fn))
	Loop(classToArray(name), function (w) {
		that._unEvent_(w, fn, opt)
	});
else if (isArr(cache = dataPriv.cache(elem).events)) {
	if ( name !== undefined )
		Loop(classToArray(name), function (e) {
			dataPriv.cache(elem).events = cache.filter(function (f) {
    			if (f.eType === e)
    				that._unEvent_(
    					f.eType,
    					f.callBack,
    					f.more
    				)
    			else return !0;
			})
		})
    else {
        Loop(cache, function (w) {
    		that._unEvent_(
    			w.eType,
    			w.callBack,
    			w.more
    		)
	})
	delete dataPriv.cache(elem).events
    }
}
return this
},
one: function (name, fn, opt) {
var that = this
isFunc(fn) && Loop(classToArray(name), function (w) {
that.on(w, m, opt)
	function m (e){
		var tmp = fn.call(this, e)
		that.off(w, m, opt)
		return tmp
    }
})
return my.extend(this, {
	prevent: function (fn, opt) {
		arguments.length < 2 && (opt = { passive: false })
		return that.one(name, function (n) {
			try {
			    n.preventDefault()
			} catch (e) {}
			if( isFunc(fn) )
				return fn.call(this, n);
		}, opt)
	},
	stop: function (fn, opt) {
		return that.one(name, function (n) {
			try {
			    n.stopPropagation()
			} catch (e) {}
			if( isFunc(fn) )
				return fn.call(this, n);
		}, opt)
	},
	then: function (fn, opt) {
		return that.one(name, fn, opt)
	}
})
},
_event_: function (a, b, c) {
//attachEvent()
return this[0].addEventListener(a, b, c), this
},
_unEvent_: function (a, b, c) {
//detachEvent()
return this[0].removeEventListener(a, b, c), this
},
css: function (k, v) {
var el = this[0]
	if (isObj(k)) {
		for(var i in k) 
			this.css(i, k[i]);
	}
	else if(arguments.length === 1) 
		return (el.currentStyle || this.getWindow().getComputedStyle(el)).getPropertyValue(k);
	else {
		isFunc(v) && (v = v.call(el, this.css(k)))
		v !== undefined && (el.style[k] = v)
	}
 return this
},
remove: function () {this[0].remove()},
clone: function(a, b){return this[0].cloneNode(deflt(a, true), b)},
replace: function(j){
if (Element.prototype.replaceChild)
	this.parent()[0]
	.replaceChild(j, this[0]);
else {
	this.parent()[0]
	.insertBefore (j, this[0])
	this.remove()
}
return this.constructor(j)
},
hasEmpty: function() {return isWin(el) ? !0 : !this[0].hasChildNodes()},
parent: function () {
	return my(this[0].parentNode)
},
sibling: function (i) {
var node = this[0].parentNode.children;
	return my(arguments.length ? node[i < 0 ? node.length + i : i] : node)
},
next: function(){
	return my(this[0].nextElementSibling || this[0].nextSibling)
},
prev: function(){
	return my(this[0].previousElementSibling || this[0].previosSibling)
},
nextAll: function () {
	var el = this[0].nextElementSibling || this[0].nextSibling, node = el !== undefined ? [el] : [];
	while (el !== undefined && (el = el.nextElementSibling || el.nextSibling))
		node.push(el);
	return my(node)
},
prevAll: function () {
	var el = this[0].previousElementSibling || this[0].previosSibling, node = el !== undefined ? [el] : [];
	while (el !== undefined && (el = el.previousElementSibling || el.previosSibling))
		node.push(el);
	return my(node)
},
toArray: function () {
	return slice.call(this)
},
firstChild: function(){
	return my(this[0].firstChild)
},
lastChild: function(){
	return my(this[0].lastChild)
},
empty: function(){return this.html('')},
displayToggle: function(){
	return this.css('display', function (e) {return e === 'none' ? 'block' : 'none'})
},
attr: function (key, val) {
	if(isObj(key)) {
		for(var i in key)
			this.attr(i, key[i]);
	}
	else if(arguments.length === 1)
		return this[0].getAttribute(key);
	else {
	    isFunc(val) && (val = val.call(this[0], this.attr(key)))
		val !== undefined && this[0].setAttribute(key, val)
	}
return this
},
unAttr: function (key) {
	var el = this[0]
	return Loop(classToArray(key), function (e) {el.removeAttribute(e)}), this
},
hasAttr: function(j){return this[0].hasAttribute(j)},
data: function (type, val) {
	if ( isObj(type) ) {
		for(var i in type)
			this.data(i, type[i]);
	}
	else if (arguments.length === 1)
		return this.attr('data-' + type);

	isFunc(val) && (val = val.call(this[0], this.data(type)))

	val !== undefined && this.attr('data-' + type, val)

	return this
},
unData: function (key) {
	var _ = this
	return Loop(classToArray(key), function (e) {
		_.unAttr('data-' + e)
	}), _
},
bounding: function () {
    if (this[0].getClientRects().length)
	return this[0].getBoundingClientRect();
	return {};
},
clientRects: function () {
    return this[0]
		.getBoundingClientRect();
},
offset: function () {

var elem = this[0], rect, win, args = arguments, x, y;

if (args.length && !(typeof args[0] === 'string' && Number.isNaN(args[0] - 0))) {
	this.position() === 'static' && this.position('relative')

    if (isObj(args[0])) {
       x = args[0].x || args[0].left
		 y = args[0].y || args[0].top
    }
    else x = args[0], y = args[1];

	isset(y) && this.css('top', addPx(y))
	isset(x) && this.css('left', addPx(x))
	return this
}

if ( !elem.getClientRects().length )
	return { top: 0, left: 0 };
		// Get document-relative position by adding viewport scroll to viewport-relative gBCR
		rect = elem.getBoundingClientRect();
		win = elem.ownerDocument.defaultView;
		return {
			top: rect.top + win.pageYOffset,
			left: rect.left + win.pageXOffset,
			width: elem.offsetWidth,
			height: elem.offsetHeight
		};
},
typing: function (t) {
if(isObj(t)) var s = t.space, space = isset(s) && s !== false ? '<span style=font:initial>' + (typeof s === 'boolean' ? '|' : s) + '</span>' : '', t = t.delay; 
var str = this.html(), len = str.length, that = this;
this.empty()
var saved = deflt(t, 200), space = deflt(space, '');
typing(0)
    function typing (j) {
    	if(j > len) return that.trigger('my.typing.done');
 setTimeout(function (){
    	var su = str.slice(0, j + 1), m = str.indexOf('>', j), l = su[su.length - 1];
    if(l == '<') j = m + 1;
    else if ('.!?'.indexOf(l) > -1) t = saved * 3;
    else if(l == ',') t = saved * 2;
    else t = saved;
    	var su = str.slice(0, j + 1)
    	that.html(su + (j === len - 1 ? '' : space))
    	typing(++j)
 }, deflt(t, 200))
    }
  return this
},
select: function (fn) {
if(isFunc(fn)) return this.on('select', fn);
var me = this[0]
	if(/input|textarea/.test(this.tag())) {
		me.select()
		me.setSelectionRange(0, this.val().length)
			  return this.val()
	} 
	if('select' === this.tag()) {
		me.focus()
			  return this.val()
	}
		var range = DOM.createRange()
		var select = DOM.getSelection()
		range.selectNodeContents(me)
		select.removeAllRanges()
		select.addRange(range)
			return select
},
hover: function(e,n){return this.mouseover(e).mouseout(n||e)},
index: function (e) {
	if ( arguments.length === 0 )
		return indexOf.call(
			this.sibling(),
			this[0]
		)
	if (typeof e === 'string')
		return indexOf.call(my(e), this[0])
	
	return indexOf.call(this,
		e.my ? e[0] : e
	)
},
matches: function (e) {
return (
this[0].webkitMatchesSelector || 
this[0].msMatchesSelector || 
this[0].mozMatchesSelector || 
this[0].oMatchesSelector || 
this[0].matchesSelector
).call(this[0], e)
},
closest: function (e) {
	var el = this[0]
	if (Element.prototype.closest) 
		return my(el.closest(e))
	else do {
		if (my(el).matches(e))
			return my(el);
		el = el.parentElement || el.parentNode
	} while (el !== null && el.nodeType === 1)

    return null
},
dataUser: function ( key, value ) {
	var i, name, data,
		elem = this[0];
	
	if ( key === undefined ) {
		if ( this.length ) {
			data = dataUser.get( elem );
			return data;
		}
	}
	if ( typeof key === "object" )
	return dataUser.set(elem, key), this;

	if ( elem && value === undefined ) {
		data = dataUser.get(elem, key)
		if ( data !== undefined )
			return data;
		return
	}
	
	dataUser.set(elem, key, value)
	return this
},
unDataUser: function( key ) {
	dataUser.remove( this[0], key )
	return this
},
cleanData: function () {
	dataPriv.remove(this[0])
	dataUser.remove(this[0])
	return this
}
}
function parseJSON (json) {
	try {
		return JSON.parse(json)
	} catch (e) { return {} }
}
my.fn.extend = my.extend = function () {
    var args = arguments, target = args[0], length = args.length, noChild = false, i = 1, opt, src, copy, Arr = false, clone;
	if(typeof target === 'boolean')
			noChild = target,
			target = args[i],
			i++;
	if(length === i) target = this, i--;
	if(typeof target !== 'object' && !isFunc(target)) target = {};
	for(; i < length; i++)
	  if((opt = args[i]) != null)
    	for(var key in opt) {
    	    src = target[key]
    	    copy = opt[key]
    	    if(src === copy) continue;
    	    if(noChild && copy && ((Arr = isArr(copy)) || isObj(copy))) {
   //giữ tính chất
   Arr ? (
   		clone = src && isArr(src) ? src : [], Arr = !1
   ) : (
   		clone = src && isObj(src) ? src : {}
   )
   target[key] = my.extend(!0, clone, copy)
} else if(copy !== undefined) target[key] = copy;
    	};;
	return target
}
function mtDate (e) {
    this.rb = e
    this.tZero = new Date(0)
}

Loop('FullYear Month Date Day Hours Minutes Seconds Milliseconds'.split(' '), function (val) {
	mtDate.prototype['get' + val] = function () {
		return this.rb['getUTC' + val]() - this.tZero['getUTC' + val]()
	}
})
my.extend(mtDate.prototype, {
	getTime: function () {
		return this.rb.getTime() - this.tZero.getTime()
	},
	to2length: function (e) {
    	return [e < 10 ? 0 : '', e].join('')
	},
	toLocaleTimeString: function() {
		return [this.to2length(this.getHours()), this.to2length(this.getMinutes()), this.to2length(this.getSeconds())].join(':')
	},
	toLocaleDateString: function() {
		return [this.getMonth() + 1, this.getDate(), this.getFullYear()].join('/')
	},
	toLocaleString: function () {
	    return [this.toLocaleTimeString(), this.toLocaleDateString()].join(', ')
	}
})

my.fn.on = my.fn.event
my.fn.off = my.fn.unEvent
my.fn.once = my.fn.one
my.fn.init.prototype = my.fn

my.extend({
expando: expandoUID,
isEmptyObject: function (e) {
for (var i in e) return false;
return true;
},
merge: function (one, two) {
        var i = one.length,
        	 j = 0,
       		len = two.length;
       	for (; j < len; j++) 
       		one [i++] = two [j];
       	one.length = i
       return one
},
exCSS: function (r) {return DOMe.style[r]!=null},
prefixCSS: function (r) {
r = r.replace(xprefix, '')
var i = 0;
while(i < _prefix) {if(my.exCSS(prefix[i] + r)) return prefix[i] + r; i++}
	return undefined
},
$clone: function (r) {
    return r.nodeType === 1 ? r.cloneNode(!0) : JSON.parse(JSON.stringify(r))
},
isEmptyObj: function (a) {
    for(var i in a) return false;
return true
},
isWindow: isWin,
param: function (str) {
var dstr = [], is = isArr(str);
my.each(str, function (key, val) {
is && (key = this.name, val = this.value)
    val = isFunc(val) ? val() : val
    dstr.push(
		encodeURIComponent(key) 
		+ '=' + 
		encodeURIComponent(val == null ? '' : val)
	)
})
  return dstr.join('&')
},
each: function(arr, callback) {
var len, i = 0;
    if(isLikeArr(arr)) {
           len = arr.length
         for(; i < len; i++)
    		if(callback.call(arr[i], i, arr[i]) === false) break;;
    } else {
        for(i in arr) 
        	if(callback.call(arr[i], i, arr[i]) === false) break;;
    }
  return arr
},
getText: function (url, timeout) {
var n, xhr;
try {
	xhr = new XMLHttpRequest || new ActiveXObject("Microsoft.XMLHTTP")
	xhr.open("get", url, !1)
	xhr.onreadystatechange = function () {
    this.readyState === 4 && (n = this.responseText)
	}
	isNumeric(timeout) && (xhr.timeout = timeout - 0)
	xhr.send()
}
catch (e) {}
return n
},
strips: function (str) {
	return str.replace(/(\!|"|\#|\$|\%|\&|\\|'|\(|\)|\*|\+|,|-|\.|\:|;|\<|\=|\>|\?|\@|\[|\]|\^|\`|\{|\}|\~|\¡|\¿)/g, '\\$1')
},
hasData: function( elem ) {
	return dataUser.hasData( elem ) || dataPriv.hasData( elem );
},
data: function( elem, name, data ) {
	return dataUser.access( elem, name, data );
},
removeData: function( elem, name ) {
	dataUser.remove( elem, name );
},
_data: function (elem, name, data) {
	return dataPriv.access( elem, name, data );
},
_removeData: function (elem, name) {
	dataPriv.remove( elem, name )
},
ajax: function (opt) {
if (!isObj(opt)) throw new Error("Not exists ajaxSetting in Ajax");

var xhr = new XMLHttpRequest || new ActiveXObject("Microsoft.XMLHTTP"),

type = (opt.type || 'GET').toUpperCase(),

dataType = (opt.dataType || 'text').toLowerCase(),

cache, uncached,

headers = opt.headers || {};

opt.url = ((opt.url || location.href) + '')
		.replace( rprotocol, location.protocol + "//" )
opt.processData === undefined && (opt.processData = true)

isObj(headers) && (headers = {})

type !== "GET" && opt.contentType !== false && (headers["Content-Type"] = "application/x-www-form-urlencoded; charset=UTF-8")

'contentType' in opt && typeof opt.contentType !== 'boolean' && (headers["Content-Type"] = n.contentType)

if (opt.data && opt.processData && typeof opt.data !== "string")
	opt.data = my.param(opt.data);

if (rnoContent.test( type )) {
	cache = opt.url.replace(rhash, '')
	uncached = opt.url.slice(cache.length)

	if (opt.data && (opt.processData || typeof opt.data === "string")) {
		cache += (rquery.test(cache) ? "&" : "?" ) + opt.data;
		delete opt.data;
	}
	
	if (opt.cache === false) {
		cache = cache.replace(rantiCache, "$1" );
		uncached = (rquery.test(cache) ? "&" : "?" ) + "_=" + Date.now() + uncached;
	}

	opt.url = cache + uncached
} else if (opt.data && opt.processData && typeof opt.contentType === "string" && opt.contentType.indexOf("application/x-www-form-urlencoded") === 0)
	opt.data = opt.data.replace( r20, "+" );

xhr.open(type, opt.url, deflt(opt.async, true), opt.username, opt.password)

rnoContent.test( type ) || my.each(headers, function (key, val) {
	xhr.setRequestHeader(key, val)
})

Number.isNaN(opt.timeout - 0) || (xhr.timeout = opt.timeout - 0)

isFunc(opt.abort) && opt.abort(xhr) === true && xhr.abort()

isFunc(opt.beforeSend) && opt.beforeSend(xhr)

if (dataType == "blob" || dataType == "arraybuffer")
   xhr.responseType = dataType.toLowerCase()

if (typeof opt.xhrFields == "object")
   for (var key in opt.xhrFields)
      xhr[key] = opt.xhrFields[key];

if ( opt.mimeType && xhr.overrideMimeType )
   xhr.overrideMimeType( opt.mimeType )

if ( !opt.crossDomain && !headers[ "X-Requested-With" ] ) 
	headers[ "X-Requested-With" ] = "XMLHttpRequest"


my(xhr).on("error timeout abort", function (t) {
	my(this).trigger("ajax.fail", {
		status: xhr.status,
		statusText: xhr.statusText,
		xhr: xhr
	})
	isFunc(opt.error) && opt.error.call(this, status, this.statusText, this)
	isFunc(opt.completed) && opt.completed.call(this, this)

})
.on("readystatechange", function(){

var response = (xhr.responseType || "text") !== "text" || typeof xhr.responseText !== "string" ? xhr.response : xhr.responseText

var data = dataType === 'xml' ? xhr.responseXML : dataType === 'text' ? response : dataType === 'json' ? parseJSON(xhr.responseText) : response,
status = xhr.status,
state = xhr.readyState;

if (state === 4) {
    my(xhr).trigger('ajax.done',{
		data: data,
		xhr: xhr
	})
	isFunc(opt.success) && opt.success.call(this, data, xhr)
	isFunc(opt.completed) && opt.completed.call(this, data, xhr)
}

if (state === 4 && (status >= 200 && status < 300 || status === 304)) {
	my(xhr).trigger("ajax.doneAll", {
		data: data,
		xhr: xhr
	})
	isFunc(opt.successFull) && opt.successFull.call(this, data, xhr)
}

})

isFunc(opt.uploadProgress) && my(xhr.upload).on("progress", function (t) {
	n.uploadProgress.call(this, t.loaded, t.total, t, xhr)
})

xhr.send(opt.data)

isFunc(opt.completed) && opt.completed(xhr, xhr)

return {
    done: function (e) {
        return my(xhr).on('ajax.done', function (f) {
    		isFunc(e) && e.call(xhr, f.detail.data, xhr)
		}), this
    },
    fail: function (e) {
		return my(xhr).on('ajax.fail', function (f) {
    		isFunc(e) && e.call(xhr, f.detail.data, xhr)
		}), this
    },
    always: function (e) {
		return my(xhr).on('ajax.always', function (f) {
			isFunc(e) && e.call(xhr, '', xhr)
		}), this
    },
    doneAll: function (e) {
		return my(xhr).on('ajax.doneAll', function (f) {
    		isFunc(e) && e.call(xhr, f.detail.data, xhr)
		}), this
    }
}
},
trim: function (str) {
return str == null ? '' : (str + '')
.replace(rtrim, '')
},
proxy: function (fn, obj) {
    if(typeof obj === 'string')
    	var tmp = fn, fn = fn[obj], obj = tmp;
    if(!isFunc(fn)) return undefined;
    var args = slice.call(arguments, 2);
return function () {
	fn.apply(obj || this, args.concat(slice.call(arguments)))
}
},
noArrChild: function (arr) {
    var length = arr.length, i = 0;
    while (i < length) 
    	if (Array.isArray(arr[i++]))
    		return false;
	return true
},
map: function (arr, fn) {
	var length, value,
		i = 0, result = [];

	if ( isLikeArr( arr ) ) {
		length = arr.length
		for (; i < length; i++) {
			value = fn.call(arr[i], i, arr)
			value != null && result.push( value )
		}
	} else {
		for (i in arr) {
			value = fn.call(arr[i], i, arr)

			value != null && result.push( value )
		}
	}
	return result
},
flatMap: function (arr, fn, n) {
	var i = 0, leng = arr.length;
	var res, j, length;
	n = n === undefined ? 1 : n
	var result = []
	if (isLikeArr(arr))
	while (leng > i) {
		res = [fn.call(arr[i], i++, arr)]
		j = 0
		while (j < n) {
			res = concat.apply([], res)
			if (my.noArrChild(res)) break;
			j++
		}
		push.apply(result, res)
	}
    else for (i in arr) {
       res = [fn.call(arr[i], i++, arr)]
		j = 0
		while (j < n) {
			res = concat.apply([], res)
			if (my.noArrChild(res)) break;
			j++
		}
		push.apply(result, res)
    }
	return result
},
getJSON: function (url, data, fn) {
     return my.get(url, data, fn, 'json')
},
inArray: function (el, arr, i) {
     return arr == null ? -1 : indexOf.call(arr, el, i)
},
type: function ( e ) {
	return e == null ? e + '' : typeof e === "object" || typeof e === "function" ? toString.call(e).replace(rtype, '$1').toLowerCase() : typeof obj
},
countdown: function (e) {
	e = arguments.length === 1 ? (isNumeric(e) ? e : '\'' + e + '\'') : slice.call(arguments).join(',')

	e = new Date(Function('return new Date(' + e + ')')() - Date.now())
	return new mtDate(e)

},
countdown2: function (e) {
	e = arguments.length === 1 ? (isNumeric(e) ? e : '\'' + e + '\'') : slice.call(arguments).join(',')

	e = new Date(Date.now() - Function('return new Date(' + e + ')')())
	return new mtDate(e)

},
promise: function (obj, fn) {
    if (fn === undefined) {
    	fn = obj
    	
    	obj = function () {
    		
    		if (obj.event.length <= obj.state) return false;
			
			try {
    	       	obj.res = obj.event[ obj.state++ ].call(obj.this, obj, arguments, arguments)
			}
			catch (e) {
    	       if (obj.error.length <= obj.wom) return false;
				obj.error[ obj.wom++ ].call(obj.this, e)
			}
			
			return true;
    	}
		
    	my.extend(obj, {
    	    this: obj,
    	    event: [],
    	    state: 0,
    	    error: [],
    	    wom: 0,
    	    res: undefined,
    	    done: obj
    	})

    }
    this.then = function (_fn) {
        obj.event.push(_fn)
        return new my.promise(obj, fn)
    }
    this.catch = function (_fn) {
        obj.error.push(_fn)
        return this
    }
    this.end = function () {
    	 if (arguments.length > 0)
    	 	obj.this = arguments[0]
    	 
    	 var arr = []
    	 
    	 if (arguments.length > 1)
    	 	arr = [].slice.call(
    	 			arguments, 1
    	 	)
    	 arr.unshift(obj)
    	 fn.apply(obj.this, arr)
    }
},
camelCase: camelCase,
nodeName: nodeName,
isNumeric: isNumeric,
parseJSON: parseJSON
})
my.prefix = my.prefixCSS
my.each({
    val: 'value',
    html: 'innerHTML',
    text: 'innerText'
}, function ( fname, prop ) {
    my.fn[fname] = function(val) {
		var el = this[0],
			_val = el[prop];
		if (!arguments.length)
			return _val;

		isFunc(val) && (val = val.call(el, _val))

		val !== undefined && (el[prop] = val)
		return this
	}
})
my.each( {
	Height: "height",
	Width: "width"
}, function( name, type ) {
	my.each( {
		padding: "inner" + name,
		content: type,
		"": "outer" + name
	}, function (defaultExtra, fname) {

		my.fn[ fname ] = function( value ) {
			var el = this[0],
				doc, rect,
				padName = type === 'width' ? ['left', 'right'] : ['top', 'bottom'],
				extra = defaultExtra === 'content' ? parseFloat(this.css('padding-' + padName[0])) + parseFloat(this.css('padding-' + padName[1])) : 0;
		if ( isWin(el) ) {
			return fname.indexOf( "outer" ) === 0 ?
			el[ "inner" + name ] :
			el.document
			.documentElement[ "client" + name ];
		}

		if ( el.nodeType === 9 ) {
			/* if is document */
			doc = el.documentElement;

			return Math.max(
				el.body[ "scroll" + name ],
				doc[ "scroll" + name ],
				el.body[ "offset" + name ],
				doc[ "offset" + name ],
				doc[ "client" + name ]
			)
		}
		if ( !el.getClientRects().length )
			return value === undefined ? 0 : this;
		rect = el.getBoundingClientRect();
		return value === undefined ? (rect[type] - extra) : this.css(type, addPx(value))
		}
	})
})

my.each({
	scrollLeft: "pageXOffset",
	scrollTop: "pageYOffset"
}, function( method, prop ) {
	var top = "pageYOffset" === prop;

	my.fn[method] = function (val) {
		var win, el = this[0];
		if ( isWin( el ) )
			win = el;
		else if (el.nodeType === 9)
			/* if is document */
			win = el.defaultView;
		if (val === undefined)
			return win ? win[ prop ] : el[ method ]

		if ( win ) win.scrollTo(
			!top ? val : win.pageXOffset,
			top ? val : win.pageYOffset
		);
		else el[ method ] = val;
		
		return this
	}
})

my.each(["get", "post"], function (i, method) {
	my[method] = function(url, data, fn, type) {
		if ( isFunc(data) ) {
			type = type || fn;
			fn = data;
			data = undefined;
		}
		return my.ajax({
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: fn
		})
	}
})

var eventReplace = {
	mouseenter: "mouseover",
	mouseleave: "mouseout"
}

my.each('click change input submit blur focus focusin focusout resize mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave scroll keydown keypress keyup touchmove touchstart touchend contextmenu'.split(' '), function (i, e) {
    var f = eventReplace[e] || e
    my.fn[e] = function (fn) {
        return isFunc(fn) ? this.on(f, fn) : isFunc(this[0][f]) ? this[0][f]() : this.trigger(f)
    }
})

my.fx = {
	start: isTouch ? 'touchstart' : 'mousedown',
	end: isTouch ? 'touchend' : 'mouseup',
	move: isTouch ? 'touchmove' : 'mousemove'
}
my.each(['transition', 'animation'], function (i, type) {
	my.each(prefix, function(i, e) {
		if (window['on' + e.replace(/-/g, '') + type + 'end'] !== undefined) {
			my.each('End Run Start Cancel'.split(' '), function(i, f) {
				my.fx[type + f] = e === '' ? type + f.toLowerCase() : (e.replace(/-/g, '') + camelCase('-' + type) + f)
			})
			return my.fx[type + 'Prop'] = e === '' ? type : camelCase(e + type), false
		}
	})
})

my.each('color position display background'.split(' '), function (i, e) {
	my.fn[e] = function (v) {
	    return v === undefined ? this.css(e) : this.css(e, v)
	}
})
my.fn.bg = my.fn.background
my.ready = my.fn.ready = function (e) {
function loadDone () {
root.removeEventListener('load', loadDone)
DOM.removeEventListener('DOMContentLoaded', loadDone)
isFunc(e) && e(my)
}
if(DOM.readyState === 'complete')
	isFunc(e) && e(my);
else {
root.addEventListener('load', loadDone)
DOM.addEventListener('DOMContentLoaded', loadDone)
}
return this
}
noGl || (root.my = my)
return my
})
