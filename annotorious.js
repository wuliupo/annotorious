var COMPILED = !0, goog = goog || {};
goog.NODE_JS = !1;
goog.global = goog.NODE_JS ? eval("global") : this;
goog.DEBUG = !1;
goog.LOCALE = "en";
goog.provide = function(a) {
  if(!COMPILED) {
    if(goog.isProvided_(a)) {
      throw Error('Namespace "' + a + '" already declared.');
    }
    delete goog.implicitNamespaces_[a];
    for(var c = a;(c = c.substring(0, c.lastIndexOf("."))) && !goog.getObjectByName(c);) {
      goog.implicitNamespaces_[c] = !0
    }
  }
  goog.exportPath_(a)
};
goog.setTestOnly = function(a) {
  if(COMPILED && !goog.DEBUG) {
    throw a = a || "", Error("Importing test-only code into non-debug environment" + a ? ": " + a : ".");
  }
};
COMPILED || (goog.isProvided_ = function(a) {
  return!goog.implicitNamespaces_[a] && !!goog.getObjectByName(a)
}, goog.implicitNamespaces_ = {});
goog.isExistingGlobalVariable_ = function(a) {
  return"undefined" !== String(eval("typeof " + a))
};
goog.exportPath_ = function(a, c, d) {
  a = a.split(".");
  d = d || goog.global;
  !(a[0] in d) && d.execScript && d.execScript("var " + a[0]);
  goog.NODE_JS && d === goog.global && goog.isExistingGlobalVariable_(a[0]) && (d = eval(a[0]), a.shift());
  for(var e;a.length && (e = a.shift());) {
    !a.length && goog.isDef(c) ? d[e] = c : d = d[e] ? d[e] : d[e] = {}
  }
};
goog.getObjectByName = function(a, c) {
  var d = a.split("."), e = c || goog.global;
  goog.NODE_JS && e === goog.global && goog.isExistingGlobalVariable_(d[0]) && (e = eval(d[0]), d.shift());
  for(var f;f = d.shift();) {
    if(goog.isDefAndNotNull(e[f])) {
      e = e[f]
    }else {
      return null
    }
  }
  return e
};
goog.globalize = function(a, c) {
  var d = c || goog.global, e;
  for(e in a) {
    d[e] = a[e]
  }
};
goog.addDependency = function(a, c, d) {
  if(!COMPILED) {
    for(var e, a = a.replace(/\\/g, "/"), f = goog.dependencies_, h = 0;e = c[h];h++) {
      f.nameToPath[e] = a, a in f.pathToNames || (f.pathToNames[a] = {}), f.pathToNames[a][e] = !0
    }
    for(e = 0;c = d[e];e++) {
      a in f.requires || (f.requires[a] = {}), f.requires[a][c] = !0
    }
  }
};
goog.ENABLE_DEBUG_LOADER = !0;
goog.require = function(a) {
  if(!COMPILED && !goog.isProvided_(a)) {
    if(goog.ENABLE_DEBUG_LOADER) {
      var c = goog.getPathFromDeps_(a);
      if(c) {
        goog.included_[c] = !0;
        goog.writeScripts_();
        return
      }
    }
    a = "goog.require could not find: " + a;
    goog.global.console && goog.global.console.error(a);
    throw Error(a);
  }
};
goog.basePath = "";
goog.nullFunction = function() {
};
goog.identityFunction = function(a) {
  return a
};
goog.abstractMethod = function() {
  throw Error("unimplemented abstract method");
};
goog.addSingletonGetter = function(a) {
  a.getInstance = function() {
    if(a.instance_) {
      return a.instance_
    }
    goog.DEBUG && (goog.instantiatedSingletons_[goog.instantiatedSingletons_.length] = a);
    return a.instance_ = new a
  }
};
goog.instantiatedSingletons_ = [];
!COMPILED && goog.ENABLE_DEBUG_LOADER && (goog.included_ = {}, goog.dependencies_ = {pathToNames:{}, nameToPath:{}, requires:{}, visited:{}, written:{}}, goog.inHtmlDocument_ = function() {
  var a = goog.global.document;
  return"undefined" != typeof a && "write" in a
}, goog.findBasePath_ = function() {
  if(goog.global.CLOSURE_BASE_PATH) {
    goog.basePath = goog.global.CLOSURE_BASE_PATH
  }else {
    if(goog.inHtmlDocument_()) {
      for(var a = goog.global.document.getElementsByTagName("script"), c = a.length - 1;0 <= c;--c) {
        var d = a[c].src, e = d.lastIndexOf("?"), e = -1 == e ? d.length : e;
        if("base.js" == d.substr(e - 7, 7)) {
          goog.basePath = d.substr(0, e - 7);
          break
        }
      }
    }
  }
}, goog.importScript_ = function(a) {
  var c = goog.global.CLOSURE_IMPORT_SCRIPT || goog.writeScriptTag_;
  !goog.dependencies_.written[a] && c(a) && (goog.dependencies_.written[a] = !0)
}, goog.writeScriptTag_ = function(a) {
  return goog.inHtmlDocument_() ? (goog.global.document.write('<script type="text/javascript" src="' + a + '"><\/script>'), !0) : !1
}, goog.writeScripts_ = function() {
  function a(f) {
    if(!(f in e.written)) {
      if(!(f in e.visited) && (e.visited[f] = !0, f in e.requires)) {
        for(var i in e.requires[f]) {
          if(!goog.isProvided_(i)) {
            if(i in e.nameToPath) {
              a(e.nameToPath[i])
            }else {
              throw Error("Undefined nameToPath for " + i);
            }
          }
        }
      }
      f in d || (d[f] = !0, c.push(f))
    }
  }
  var c = [], d = {}, e = goog.dependencies_, f;
  for(f in goog.included_) {
    e.written[f] || a(f)
  }
  for(f = 0;f < c.length;f++) {
    if(c[f]) {
      goog.importScript_(goog.basePath + c[f])
    }else {
      throw Error("Undefined script input");
    }
  }
}, goog.getPathFromDeps_ = function(a) {
  return a in goog.dependencies_.nameToPath ? goog.dependencies_.nameToPath[a] : null
}, goog.findBasePath_(), goog.global.CLOSURE_NO_DEPS || goog.importScript_(goog.basePath + "deps.js"));
goog.typeOf = function(a) {
  var c = typeof a;
  if("object" == c) {
    if(a) {
      if(a instanceof Array) {
        return"array"
      }
      if(a instanceof Object) {
        return c
      }
      var d = Object.prototype.toString.call(a);
      if("[object Window]" == d) {
        return"object"
      }
      if("[object Array]" == d || "number" == typeof a.length && "undefined" != typeof a.splice && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("splice")) {
        return"array"
      }
      if("[object Function]" == d || "undefined" != typeof a.call && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("call")) {
        return"function"
      }
    }else {
      return"null"
    }
  }else {
    if("function" == c && "undefined" == typeof a.call) {
      return"object"
    }
  }
  return c
};
goog.isDef = function(a) {
  return void 0 !== a
};
goog.isNull = function(a) {
  return null === a
};
goog.isDefAndNotNull = function(a) {
  return null != a
};
goog.isArray = function(a) {
  return"array" == goog.typeOf(a)
};
goog.isArrayLike = function(a) {
  var c = goog.typeOf(a);
  return"array" == c || "object" == c && "number" == typeof a.length
};
goog.isDateLike = function(a) {
  return goog.isObject(a) && "function" == typeof a.getFullYear
};
goog.isString = function(a) {
  return"string" == typeof a
};
goog.isBoolean = function(a) {
  return"boolean" == typeof a
};
goog.isNumber = function(a) {
  return"number" == typeof a
};
goog.isFunction = function(a) {
  return"function" == goog.typeOf(a)
};
goog.isObject = function(a) {
  var c = typeof a;
  return"object" == c && null != a || "function" == c
};
goog.getUid = function(a) {
  return a[goog.UID_PROPERTY_] || (a[goog.UID_PROPERTY_] = ++goog.uidCounter_)
};
goog.removeUid = function(a) {
  "removeAttribute" in a && a.removeAttribute(goog.UID_PROPERTY_);
  try {
    delete a[goog.UID_PROPERTY_]
  }catch(c) {
  }
};
goog.UID_PROPERTY_ = "closure_uid_" + Math.floor(2147483648 * Math.random()).toString(36);
goog.uidCounter_ = 0;
goog.getHashCode = goog.getUid;
goog.removeHashCode = goog.removeUid;
goog.cloneObject = function(a) {
  var c = goog.typeOf(a);
  if("object" == c || "array" == c) {
    if(a.clone) {
      return a.clone()
    }
    var c = "array" == c ? [] : {}, d;
    for(d in a) {
      c[d] = goog.cloneObject(a[d])
    }
    return c
  }
  return a
};
goog.bindNative_ = function(a, c, d) {
  return a.call.apply(a.bind, arguments)
};
goog.bindJs_ = function(a, c, d) {
  if(!a) {
    throw Error();
  }
  if(2 < arguments.length) {
    var e = Array.prototype.slice.call(arguments, 2);
    return function() {
      var d = Array.prototype.slice.call(arguments);
      Array.prototype.unshift.apply(d, e);
      return a.apply(c, d)
    }
  }
  return function() {
    return a.apply(c, arguments)
  }
};
goog.bind = function(a, c, d) {
  goog.bind = Function.prototype.bind && -1 != Function.prototype.bind.toString().indexOf("native code") ? goog.bindNative_ : goog.bindJs_;
  return goog.bind.apply(null, arguments)
};
goog.partial = function(a, c) {
  var d = Array.prototype.slice.call(arguments, 1);
  return function() {
    var c = Array.prototype.slice.call(arguments);
    c.unshift.apply(c, d);
    return a.apply(this, c)
  }
};
goog.mixin = function(a, c) {
  for(var d in c) {
    a[d] = c[d]
  }
};
goog.now = Date.now || function() {
  return+new Date
};
goog.globalEval = function(a) {
  if(goog.global.execScript) {
    goog.global.execScript(a, "JavaScript")
  }else {
    if(goog.global.eval) {
      if(null == goog.evalWorksForGlobals_ && (goog.global.eval("var _et_ = 1;"), "undefined" != typeof goog.global._et_ ? (delete goog.global._et_, goog.evalWorksForGlobals_ = !0) : goog.evalWorksForGlobals_ = !1), goog.evalWorksForGlobals_) {
        goog.global.eval(a)
      }else {
        var c = goog.global.document, d = c.createElement("script");
        d.type = "text/javascript";
        d.defer = !1;
        d.appendChild(c.createTextNode(a));
        c.body.appendChild(d);
        c.body.removeChild(d)
      }
    }else {
      throw Error("goog.globalEval not available");
    }
  }
};
goog.evalWorksForGlobals_ = null;
goog.getCssName = function(a, c) {
  var d = function(a) {
    return goog.cssNameMapping_[a] || a
  }, e = function(a) {
    for(var a = a.split("-"), c = [], e = 0;e < a.length;e++) {
      c.push(d(a[e]))
    }
    return c.join("-")
  }, e = goog.cssNameMapping_ ? "BY_WHOLE" == goog.cssNameMappingStyle_ ? d : e : function(a) {
    return a
  };
  return c ? a + "-" + e(c) : e(a)
};
goog.setCssNameMapping = function(a, c) {
  goog.cssNameMapping_ = a;
  goog.cssNameMappingStyle_ = c
};
!COMPILED && goog.global.CLOSURE_CSS_NAME_MAPPING && (goog.cssNameMapping_ = goog.global.CLOSURE_CSS_NAME_MAPPING);
goog.getMsg = function(a, c) {
  var d = c || {}, e;
  for(e in d) {
    var f = ("" + d[e]).replace(/\$/g, "$$$$"), a = a.replace(RegExp("\\{\\$" + e + "\\}", "gi"), f)
  }
  return a
};
goog.exportSymbol = function(a, c, d) {
  goog.exportPath_(a, c, d)
};
goog.exportProperty = function(a, c, d) {
  a[c] = d
};
goog.inherits = function(a, c) {
  function d() {
  }
  d.prototype = c.prototype;
  a.superClass_ = c.prototype;
  a.prototype = new d;
  a.prototype.constructor = a
};
goog.base = function(a, c, d) {
  var e = arguments.callee.caller;
  if(e.superClass_) {
    return e.superClass_.constructor.apply(a, Array.prototype.slice.call(arguments, 1))
  }
  for(var f = Array.prototype.slice.call(arguments, 2), h = !1, i = a.constructor;i;i = i.superClass_ && i.superClass_.constructor) {
    if(i.prototype[c] === e) {
      h = !0
    }else {
      if(h) {
        return i.prototype[c].apply(a, f)
      }
    }
  }
  if(a[c] === e) {
    return a.constructor.prototype[c].apply(a, f)
  }
  throw Error("goog.base called from a method of one name to a method of a different name");
};
goog.scope = function(a) {
  a.call(goog.global)
};
goog.debug = {};
goog.debug.Error = function(a) {
  Error.captureStackTrace ? Error.captureStackTrace(this, goog.debug.Error) : this.stack = Error().stack || "";
  a && (this.message = String(a))
};
goog.inherits(goog.debug.Error, Error);
goog.debug.Error.prototype.name = "CustomError";
goog.string = {};
goog.string.Unicode = {NBSP:"\u00a0"};
goog.string.startsWith = function(a, c) {
  return 0 == a.lastIndexOf(c, 0)
};
goog.string.endsWith = function(a, c) {
  var d = a.length - c.length;
  return 0 <= d && a.indexOf(c, d) == d
};
goog.string.caseInsensitiveStartsWith = function(a, c) {
  return 0 == goog.string.caseInsensitiveCompare(c, a.substr(0, c.length))
};
goog.string.caseInsensitiveEndsWith = function(a, c) {
  return 0 == goog.string.caseInsensitiveCompare(c, a.substr(a.length - c.length, c.length))
};
goog.string.subs = function(a, c) {
  for(var d = 1;d < arguments.length;d++) {
    var e = String(arguments[d]).replace(/\$/g, "$$$$"), a = a.replace(/\%s/, e)
  }
  return a
};
goog.string.collapseWhitespace = function(a) {
  return a.replace(/[\s\xa0]+/g, " ").replace(/^\s+|\s+$/g, "")
};
goog.string.isEmpty = function(a) {
  return/^[\s\xa0]*$/.test(a)
};
goog.string.isEmptySafe = function(a) {
  return goog.string.isEmpty(goog.string.makeSafe(a))
};
goog.string.isBreakingWhitespace = function(a) {
  return!/[^\t\n\r ]/.test(a)
};
goog.string.isAlpha = function(a) {
  return!/[^a-zA-Z]/.test(a)
};
goog.string.isNumeric = function(a) {
  return!/[^0-9]/.test(a)
};
goog.string.isAlphaNumeric = function(a) {
  return!/[^a-zA-Z0-9]/.test(a)
};
goog.string.isSpace = function(a) {
  return" " == a
};
goog.string.isUnicodeChar = function(a) {
  return 1 == a.length && " " <= a && "~" >= a || "\u0080" <= a && "\ufffd" >= a
};
goog.string.stripNewlines = function(a) {
  return a.replace(/(\r\n|\r|\n)+/g, " ")
};
goog.string.canonicalizeNewlines = function(a) {
  return a.replace(/(\r\n|\r|\n)/g, "\n")
};
goog.string.normalizeWhitespace = function(a) {
  return a.replace(/\xa0|\s/g, " ")
};
goog.string.normalizeSpaces = function(a) {
  return a.replace(/\xa0|[ \t]+/g, " ")
};
goog.string.collapseBreakingSpaces = function(a) {
  return a.replace(/[\t\r\n ]+/g, " ").replace(/^[\t\r\n ]+|[\t\r\n ]+$/g, "")
};
goog.string.trim = function(a) {
  return a.replace(/^[\s\xa0]+|[\s\xa0]+$/g, "")
};
goog.string.trimLeft = function(a) {
  return a.replace(/^[\s\xa0]+/, "")
};
goog.string.trimRight = function(a) {
  return a.replace(/[\s\xa0]+$/, "")
};
goog.string.caseInsensitiveCompare = function(a, c) {
  var d = String(a).toLowerCase(), e = String(c).toLowerCase();
  return d < e ? -1 : d == e ? 0 : 1
};
goog.string.numerateCompareRegExp_ = /(\.\d+)|(\d+)|(\D+)/g;
goog.string.numerateCompare = function(a, c) {
  if(a == c) {
    return 0
  }
  if(!a) {
    return-1
  }
  if(!c) {
    return 1
  }
  for(var d = a.toLowerCase().match(goog.string.numerateCompareRegExp_), e = c.toLowerCase().match(goog.string.numerateCompareRegExp_), f = Math.min(d.length, e.length), h = 0;h < f;h++) {
    var i = d[h], j = e[h];
    if(i != j) {
      return d = parseInt(i, 10), !isNaN(d) && (e = parseInt(j, 10), !isNaN(e) && d - e) ? d - e : i < j ? -1 : 1
    }
  }
  return d.length != e.length ? d.length - e.length : a < c ? -1 : 1
};
goog.string.urlEncode = function(a) {
  return encodeURIComponent(String(a))
};
goog.string.urlDecode = function(a) {
  return decodeURIComponent(a.replace(/\+/g, " "))
};
goog.string.newLineToBr = function(a, c) {
  return a.replace(/(\r\n|\r|\n)/g, c ? "<br />" : "<br>")
};
goog.string.htmlEscape = function(a, c) {
  if(c) {
    return a.replace(goog.string.amperRe_, "&amp;").replace(goog.string.ltRe_, "&lt;").replace(goog.string.gtRe_, "&gt;").replace(goog.string.quotRe_, "&quot;")
  }
  if(!goog.string.allRe_.test(a)) {
    return a
  }
  -1 != a.indexOf("&") && (a = a.replace(goog.string.amperRe_, "&amp;"));
  -1 != a.indexOf("<") && (a = a.replace(goog.string.ltRe_, "&lt;"));
  -1 != a.indexOf(">") && (a = a.replace(goog.string.gtRe_, "&gt;"));
  -1 != a.indexOf('"') && (a = a.replace(goog.string.quotRe_, "&quot;"));
  return a
};
goog.string.amperRe_ = /&/g;
goog.string.ltRe_ = /</g;
goog.string.gtRe_ = />/g;
goog.string.quotRe_ = /\"/g;
goog.string.allRe_ = /[&<>\"]/;
goog.string.unescapeEntities = function(a) {
  return goog.string.contains(a, "&") ? "document" in goog.global ? goog.string.unescapeEntitiesUsingDom_(a) : goog.string.unescapePureXmlEntities_(a) : a
};
goog.string.unescapeEntitiesUsingDom_ = function(a) {
  var c = {"&amp;":"&", "&lt;":"<", "&gt;":">", "&quot;":'"'}, d = document.createElement("div");
  return a.replace(goog.string.HTML_ENTITY_PATTERN_, function(a, f) {
    var h = c[a];
    if(h) {
      return h
    }
    if("#" == f.charAt(0)) {
      var i = Number("0" + f.substr(1));
      isNaN(i) || (h = String.fromCharCode(i))
    }
    h || (d.innerHTML = a + " ", h = d.firstChild.nodeValue.slice(0, -1));
    return c[a] = h
  })
};
goog.string.unescapePureXmlEntities_ = function(a) {
  return a.replace(/&([^;]+);/g, function(a, d) {
    switch(d) {
      case "amp":
        return"&";
      case "lt":
        return"<";
      case "gt":
        return">";
      case "quot":
        return'"';
      default:
        if("#" == d.charAt(0)) {
          var e = Number("0" + d.substr(1));
          if(!isNaN(e)) {
            return String.fromCharCode(e)
          }
        }
        return a
    }
  })
};
goog.string.HTML_ENTITY_PATTERN_ = /&([^;\s<&]+);?/g;
goog.string.whitespaceEscape = function(a, c) {
  return goog.string.newLineToBr(a.replace(/  /g, " &#160;"), c)
};
goog.string.stripQuotes = function(a, c) {
  for(var d = c.length, e = 0;e < d;e++) {
    var f = 1 == d ? c : c.charAt(e);
    if(a.charAt(0) == f && a.charAt(a.length - 1) == f) {
      return a.substring(1, a.length - 1)
    }
  }
  return a
};
goog.string.truncate = function(a, c, d) {
  d && (a = goog.string.unescapeEntities(a));
  a.length > c && (a = a.substring(0, c - 3) + "...");
  d && (a = goog.string.htmlEscape(a));
  return a
};
goog.string.truncateMiddle = function(a, c, d, e) {
  d && (a = goog.string.unescapeEntities(a));
  if(e && a.length > c) {
    e > c && (e = c);
    var f = a.length - e, a = a.substring(0, c - e) + "..." + a.substring(f)
  }else {
    a.length > c && (e = Math.floor(c / 2), f = a.length - e, a = a.substring(0, e + c % 2) + "..." + a.substring(f))
  }
  d && (a = goog.string.htmlEscape(a));
  return a
};
goog.string.specialEscapeChars_ = {"\x00":"\\0", "\b":"\\b", "\f":"\\f", "\n":"\\n", "\r":"\\r", "\t":"\\t", "\x0B":"\\x0B", '"':'\\"', "\\":"\\\\"};
goog.string.jsEscapeCache_ = {"'":"\\'"};
goog.string.quote = function(a) {
  a = String(a);
  if(a.quote) {
    return a.quote()
  }
  for(var c = ['"'], d = 0;d < a.length;d++) {
    var e = a.charAt(d), f = e.charCodeAt(0);
    c[d + 1] = goog.string.specialEscapeChars_[e] || (31 < f && 127 > f ? e : goog.string.escapeChar(e))
  }
  c.push('"');
  return c.join("")
};
goog.string.escapeString = function(a) {
  for(var c = [], d = 0;d < a.length;d++) {
    c[d] = goog.string.escapeChar(a.charAt(d))
  }
  return c.join("")
};
goog.string.escapeChar = function(a) {
  if(a in goog.string.jsEscapeCache_) {
    return goog.string.jsEscapeCache_[a]
  }
  if(a in goog.string.specialEscapeChars_) {
    return goog.string.jsEscapeCache_[a] = goog.string.specialEscapeChars_[a]
  }
  var c = a, d = a.charCodeAt(0);
  if(31 < d && 127 > d) {
    c = a
  }else {
    if(256 > d) {
      if(c = "\\x", 16 > d || 256 < d) {
        c += "0"
      }
    }else {
      c = "\\u", 4096 > d && (c += "0")
    }
    c += d.toString(16).toUpperCase()
  }
  return goog.string.jsEscapeCache_[a] = c
};
goog.string.toMap = function(a) {
  for(var c = {}, d = 0;d < a.length;d++) {
    c[a.charAt(d)] = !0
  }
  return c
};
goog.string.contains = function(a, c) {
  return-1 != a.indexOf(c)
};
goog.string.countOf = function(a, c) {
  return a && c ? a.split(c).length - 1 : 0
};
goog.string.removeAt = function(a, c, d) {
  var e = a;
  0 <= c && (c < a.length && 0 < d) && (e = a.substr(0, c) + a.substr(c + d, a.length - c - d));
  return e
};
goog.string.remove = function(a, c) {
  var d = RegExp(goog.string.regExpEscape(c), "");
  return a.replace(d, "")
};
goog.string.removeAll = function(a, c) {
  var d = RegExp(goog.string.regExpEscape(c), "g");
  return a.replace(d, "")
};
goog.string.regExpEscape = function(a) {
  return String(a).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, "\\$1").replace(/\x08/g, "\\x08")
};
goog.string.repeat = function(a, c) {
  return Array(c + 1).join(a)
};
goog.string.padNumber = function(a, c, d) {
  a = goog.isDef(d) ? a.toFixed(d) : String(a);
  d = a.indexOf(".");
  -1 == d && (d = a.length);
  return goog.string.repeat("0", Math.max(0, c - d)) + a
};
goog.string.makeSafe = function(a) {
  return null == a ? "" : String(a)
};
goog.string.buildString = function(a) {
  return Array.prototype.join.call(arguments, "")
};
goog.string.getRandomString = function() {
  return Math.floor(2147483648 * Math.random()).toString(36) + Math.abs(Math.floor(2147483648 * Math.random()) ^ goog.now()).toString(36)
};
goog.string.compareVersions = function(a, c) {
  for(var d = 0, e = goog.string.trim(String(a)).split("."), f = goog.string.trim(String(c)).split("."), h = Math.max(e.length, f.length), i = 0;0 == d && i < h;i++) {
    var j = e[i] || "", k = f[i] || "", l = RegExp("(\\d*)(\\D*)", "g"), p = RegExp("(\\d*)(\\D*)", "g");
    do {
      var m = l.exec(j) || ["", "", ""], q = p.exec(k) || ["", "", ""];
      if(0 == m[0].length && 0 == q[0].length) {
        break
      }
      var d = 0 == m[1].length ? 0 : parseInt(m[1], 10), x = 0 == q[1].length ? 0 : parseInt(q[1], 10), d = goog.string.compareElements_(d, x) || goog.string.compareElements_(0 == m[2].length, 0 == q[2].length) || goog.string.compareElements_(m[2], q[2])
    }while(0 == d)
  }
  return d
};
goog.string.compareElements_ = function(a, c) {
  return a < c ? -1 : a > c ? 1 : 0
};
goog.string.HASHCODE_MAX_ = 4294967296;
goog.string.hashCode = function(a) {
  for(var c = 0, d = 0;d < a.length;++d) {
    c = 31 * c + a.charCodeAt(d), c %= goog.string.HASHCODE_MAX_
  }
  return c
};
goog.string.uniqueStringCounter_ = 2147483648 * Math.random() | 0;
goog.string.createUniqueString = function() {
  return"goog_" + goog.string.uniqueStringCounter_++
};
goog.string.toNumber = function(a) {
  var c = Number(a);
  return 0 == c && goog.string.isEmpty(a) ? NaN : c
};
goog.string.toCamelCase = function(a) {
  return String(a).replace(/\-([a-z])/g, function(a, d) {
    return d.toUpperCase()
  })
};
goog.string.toSelectorCase = function(a) {
  return String(a).replace(/([A-Z])/g, "-$1").toLowerCase()
};
goog.string.toTitleCase = function(a, c) {
  var d = goog.isString(c) ? goog.string.regExpEscape(c) : "\\s";
  return a.replace(RegExp("(^" + (d ? "|[" + d + "]+" : "") + ")([a-z])", "g"), function(a, c, d) {
    return c + d.toUpperCase()
  })
};
goog.string.parseInt = function(a) {
  isFinite(a) && (a = String(a));
  return goog.isString(a) ? /^\s*-?0x/i.test(a) ? parseInt(a, 16) : parseInt(a, 10) : NaN
};
goog.asserts = {};
goog.asserts.ENABLE_ASSERTS = goog.DEBUG;
goog.asserts.AssertionError = function(a, c) {
  c.unshift(a);
  goog.debug.Error.call(this, goog.string.subs.apply(null, c));
  c.shift();
  this.messagePattern = a
};
goog.inherits(goog.asserts.AssertionError, goog.debug.Error);
goog.asserts.AssertionError.prototype.name = "AssertionError";
goog.asserts.doAssertFailure_ = function(a, c, d, e) {
  var f = "Assertion failed";
  if(d) {
    var f = f + (": " + d), h = e
  }else {
    a && (f += ": " + a, h = c)
  }
  throw new goog.asserts.AssertionError("" + f, h || []);
};
goog.asserts.assert = function(a, c, d) {
  goog.asserts.ENABLE_ASSERTS && !a && goog.asserts.doAssertFailure_("", null, c, Array.prototype.slice.call(arguments, 2));
  return a
};
goog.asserts.fail = function(a, c) {
  if(goog.asserts.ENABLE_ASSERTS) {
    throw new goog.asserts.AssertionError("Failure" + (a ? ": " + a : ""), Array.prototype.slice.call(arguments, 1));
  }
};
goog.asserts.assertNumber = function(a, c, d) {
  goog.asserts.ENABLE_ASSERTS && !goog.isNumber(a) && goog.asserts.doAssertFailure_("Expected number but got %s: %s.", [goog.typeOf(a), a], c, Array.prototype.slice.call(arguments, 2));
  return a
};
goog.asserts.assertString = function(a, c, d) {
  goog.asserts.ENABLE_ASSERTS && !goog.isString(a) && goog.asserts.doAssertFailure_("Expected string but got %s: %s.", [goog.typeOf(a), a], c, Array.prototype.slice.call(arguments, 2));
  return a
};
goog.asserts.assertFunction = function(a, c, d) {
  goog.asserts.ENABLE_ASSERTS && !goog.isFunction(a) && goog.asserts.doAssertFailure_("Expected function but got %s: %s.", [goog.typeOf(a), a], c, Array.prototype.slice.call(arguments, 2));
  return a
};
goog.asserts.assertObject = function(a, c, d) {
  goog.asserts.ENABLE_ASSERTS && !goog.isObject(a) && goog.asserts.doAssertFailure_("Expected object but got %s: %s.", [goog.typeOf(a), a], c, Array.prototype.slice.call(arguments, 2));
  return a
};
goog.asserts.assertArray = function(a, c, d) {
  goog.asserts.ENABLE_ASSERTS && !goog.isArray(a) && goog.asserts.doAssertFailure_("Expected array but got %s: %s.", [goog.typeOf(a), a], c, Array.prototype.slice.call(arguments, 2));
  return a
};
goog.asserts.assertBoolean = function(a, c, d) {
  goog.asserts.ENABLE_ASSERTS && !goog.isBoolean(a) && goog.asserts.doAssertFailure_("Expected boolean but got %s: %s.", [goog.typeOf(a), a], c, Array.prototype.slice.call(arguments, 2));
  return a
};
goog.asserts.assertInstanceof = function(a, c, d, e) {
  goog.asserts.ENABLE_ASSERTS && !(a instanceof c) && goog.asserts.doAssertFailure_("instanceof check failed.", null, d, Array.prototype.slice.call(arguments, 3));
  return a
};
goog.array = {};
goog.NATIVE_ARRAY_PROTOTYPES = !0;
goog.array.peek = function(a) {
  return a[a.length - 1]
};
goog.array.ARRAY_PROTOTYPE_ = Array.prototype;
goog.array.indexOf = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.indexOf ? function(a, c, d) {
  goog.asserts.assert(null != a.length);
  return goog.array.ARRAY_PROTOTYPE_.indexOf.call(a, c, d)
} : function(a, c, d) {
  d = null == d ? 0 : 0 > d ? Math.max(0, a.length + d) : d;
  if(goog.isString(a)) {
    return!goog.isString(c) || 1 != c.length ? -1 : a.indexOf(c, d)
  }
  for(;d < a.length;d++) {
    if(d in a && a[d] === c) {
      return d
    }
  }
  return-1
};
goog.array.lastIndexOf = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.lastIndexOf ? function(a, c, d) {
  goog.asserts.assert(null != a.length);
  return goog.array.ARRAY_PROTOTYPE_.lastIndexOf.call(a, c, null == d ? a.length - 1 : d)
} : function(a, c, d) {
  d = null == d ? a.length - 1 : d;
  0 > d && (d = Math.max(0, a.length + d));
  if(goog.isString(a)) {
    return!goog.isString(c) || 1 != c.length ? -1 : a.lastIndexOf(c, d)
  }
  for(;0 <= d;d--) {
    if(d in a && a[d] === c) {
      return d
    }
  }
  return-1
};
goog.array.forEach = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.forEach ? function(a, c, d) {
  goog.asserts.assert(null != a.length);
  goog.array.ARRAY_PROTOTYPE_.forEach.call(a, c, d)
} : function(a, c, d) {
  for(var e = a.length, f = goog.isString(a) ? a.split("") : a, h = 0;h < e;h++) {
    h in f && c.call(d, f[h], h, a)
  }
};
goog.array.forEachRight = function(a, c, d) {
  for(var e = a.length, f = goog.isString(a) ? a.split("") : a, e = e - 1;0 <= e;--e) {
    e in f && c.call(d, f[e], e, a)
  }
};
goog.array.filter = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.filter ? function(a, c, d) {
  goog.asserts.assert(null != a.length);
  return goog.array.ARRAY_PROTOTYPE_.filter.call(a, c, d)
} : function(a, c, d) {
  for(var e = a.length, f = [], h = 0, i = goog.isString(a) ? a.split("") : a, j = 0;j < e;j++) {
    if(j in i) {
      var k = i[j];
      c.call(d, k, j, a) && (f[h++] = k)
    }
  }
  return f
};
goog.array.map = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.map ? function(a, c, d) {
  goog.asserts.assert(null != a.length);
  return goog.array.ARRAY_PROTOTYPE_.map.call(a, c, d)
} : function(a, c, d) {
  for(var e = a.length, f = Array(e), h = goog.isString(a) ? a.split("") : a, i = 0;i < e;i++) {
    i in h && (f[i] = c.call(d, h[i], i, a))
  }
  return f
};
goog.array.reduce = function(a, c, d, e) {
  if(a.reduce) {
    return e ? a.reduce(goog.bind(c, e), d) : a.reduce(c, d)
  }
  var f = d;
  goog.array.forEach(a, function(d, i) {
    f = c.call(e, f, d, i, a)
  });
  return f
};
goog.array.reduceRight = function(a, c, d, e) {
  if(a.reduceRight) {
    return e ? a.reduceRight(goog.bind(c, e), d) : a.reduceRight(c, d)
  }
  var f = d;
  goog.array.forEachRight(a, function(d, i) {
    f = c.call(e, f, d, i, a)
  });
  return f
};
goog.array.some = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.some ? function(a, c, d) {
  goog.asserts.assert(null != a.length);
  return goog.array.ARRAY_PROTOTYPE_.some.call(a, c, d)
} : function(a, c, d) {
  for(var e = a.length, f = goog.isString(a) ? a.split("") : a, h = 0;h < e;h++) {
    if(h in f && c.call(d, f[h], h, a)) {
      return!0
    }
  }
  return!1
};
goog.array.every = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.every ? function(a, c, d) {
  goog.asserts.assert(null != a.length);
  return goog.array.ARRAY_PROTOTYPE_.every.call(a, c, d)
} : function(a, c, d) {
  for(var e = a.length, f = goog.isString(a) ? a.split("") : a, h = 0;h < e;h++) {
    if(h in f && !c.call(d, f[h], h, a)) {
      return!1
    }
  }
  return!0
};
goog.array.find = function(a, c, d) {
  c = goog.array.findIndex(a, c, d);
  return 0 > c ? null : goog.isString(a) ? a.charAt(c) : a[c]
};
goog.array.findIndex = function(a, c, d) {
  for(var e = a.length, f = goog.isString(a) ? a.split("") : a, h = 0;h < e;h++) {
    if(h in f && c.call(d, f[h], h, a)) {
      return h
    }
  }
  return-1
};
goog.array.findRight = function(a, c, d) {
  c = goog.array.findIndexRight(a, c, d);
  return 0 > c ? null : goog.isString(a) ? a.charAt(c) : a[c]
};
goog.array.findIndexRight = function(a, c, d) {
  for(var e = a.length, f = goog.isString(a) ? a.split("") : a, e = e - 1;0 <= e;e--) {
    if(e in f && c.call(d, f[e], e, a)) {
      return e
    }
  }
  return-1
};
goog.array.contains = function(a, c) {
  return 0 <= goog.array.indexOf(a, c)
};
goog.array.isEmpty = function(a) {
  return 0 == a.length
};
goog.array.clear = function(a) {
  if(!goog.isArray(a)) {
    for(var c = a.length - 1;0 <= c;c--) {
      delete a[c]
    }
  }
  a.length = 0
};
goog.array.insert = function(a, c) {
  goog.array.contains(a, c) || a.push(c)
};
goog.array.insertAt = function(a, c, d) {
  goog.array.splice(a, d, 0, c)
};
goog.array.insertArrayAt = function(a, c, d) {
  goog.partial(goog.array.splice, a, d, 0).apply(null, c)
};
goog.array.insertBefore = function(a, c, d) {
  var e;
  2 == arguments.length || 0 > (e = goog.array.indexOf(a, d)) ? a.push(c) : goog.array.insertAt(a, c, e)
};
goog.array.remove = function(a, c) {
  var d = goog.array.indexOf(a, c), e;
  (e = 0 <= d) && goog.array.removeAt(a, d);
  return e
};
goog.array.removeAt = function(a, c) {
  goog.asserts.assert(null != a.length);
  return 1 == goog.array.ARRAY_PROTOTYPE_.splice.call(a, c, 1).length
};
goog.array.removeIf = function(a, c, d) {
  c = goog.array.findIndex(a, c, d);
  return 0 <= c ? (goog.array.removeAt(a, c), !0) : !1
};
goog.array.concat = function(a) {
  return goog.array.ARRAY_PROTOTYPE_.concat.apply(goog.array.ARRAY_PROTOTYPE_, arguments)
};
goog.array.toArray = function(a) {
  var c = a.length;
  if(0 < c) {
    for(var d = Array(c), e = 0;e < c;e++) {
      d[e] = a[e]
    }
    return d
  }
  return[]
};
goog.array.clone = goog.array.toArray;
goog.array.extend = function(a, c) {
  for(var d = 1;d < arguments.length;d++) {
    var e = arguments[d], f;
    if(goog.isArray(e) || (f = goog.isArrayLike(e)) && e.hasOwnProperty("callee")) {
      a.push.apply(a, e)
    }else {
      if(f) {
        for(var h = a.length, i = e.length, j = 0;j < i;j++) {
          a[h + j] = e[j]
        }
      }else {
        a.push(e)
      }
    }
  }
};
goog.array.splice = function(a, c, d, e) {
  goog.asserts.assert(null != a.length);
  return goog.array.ARRAY_PROTOTYPE_.splice.apply(a, goog.array.slice(arguments, 1))
};
goog.array.slice = function(a, c, d) {
  goog.asserts.assert(null != a.length);
  return 2 >= arguments.length ? goog.array.ARRAY_PROTOTYPE_.slice.call(a, c) : goog.array.ARRAY_PROTOTYPE_.slice.call(a, c, d)
};
goog.array.removeDuplicates = function(a, c) {
  for(var d = c || a, e = {}, f = 0, h = 0;h < a.length;) {
    var i = a[h++], j = goog.isObject(i) ? "o" + goog.getUid(i) : (typeof i).charAt(0) + i;
    Object.prototype.hasOwnProperty.call(e, j) || (e[j] = !0, d[f++] = i)
  }
  d.length = f
};
goog.array.binarySearch = function(a, c, d) {
  return goog.array.binarySearch_(a, d || goog.array.defaultCompare, !1, c)
};
goog.array.binarySelect = function(a, c, d) {
  return goog.array.binarySearch_(a, c, !0, void 0, d)
};
goog.array.binarySearch_ = function(a, c, d, e, f) {
  for(var h = 0, i = a.length, j;h < i;) {
    var k = h + i >> 1, l;
    l = d ? c.call(f, a[k], k, a) : c(e, a[k]);
    0 < l ? h = k + 1 : (i = k, j = !l)
  }
  return j ? h : ~h
};
goog.array.sort = function(a, c) {
  goog.asserts.assert(null != a.length);
  goog.array.ARRAY_PROTOTYPE_.sort.call(a, c || goog.array.defaultCompare)
};
goog.array.stableSort = function(a, c) {
  for(var d = 0;d < a.length;d++) {
    a[d] = {index:d, value:a[d]}
  }
  var e = c || goog.array.defaultCompare;
  goog.array.sort(a, function(a, c) {
    return e(a.value, c.value) || a.index - c.index
  });
  for(d = 0;d < a.length;d++) {
    a[d] = a[d].value
  }
};
goog.array.sortObjectsByKey = function(a, c, d) {
  var e = d || goog.array.defaultCompare;
  goog.array.sort(a, function(a, d) {
    return e(a[c], d[c])
  })
};
goog.array.isSorted = function(a, c, d) {
  for(var c = c || goog.array.defaultCompare, e = 1;e < a.length;e++) {
    var f = c(a[e - 1], a[e]);
    if(0 < f || 0 == f && d) {
      return!1
    }
  }
  return!0
};
goog.array.equals = function(a, c, d) {
  if(!goog.isArrayLike(a) || !goog.isArrayLike(c) || a.length != c.length) {
    return!1
  }
  for(var e = a.length, d = d || goog.array.defaultCompareEquality, f = 0;f < e;f++) {
    if(!d(a[f], c[f])) {
      return!1
    }
  }
  return!0
};
goog.array.compare = function(a, c, d) {
  return goog.array.equals(a, c, d)
};
goog.array.compare3 = function(a, c, d) {
  for(var d = d || goog.array.defaultCompare, e = Math.min(a.length, c.length), f = 0;f < e;f++) {
    var h = d(a[f], c[f]);
    if(0 != h) {
      return h
    }
  }
  return goog.array.defaultCompare(a.length, c.length)
};
goog.array.defaultCompare = function(a, c) {
  return a > c ? 1 : a < c ? -1 : 0
};
goog.array.defaultCompareEquality = function(a, c) {
  return a === c
};
goog.array.binaryInsert = function(a, c, d) {
  d = goog.array.binarySearch(a, c, d);
  return 0 > d ? (goog.array.insertAt(a, c, -(d + 1)), !0) : !1
};
goog.array.binaryRemove = function(a, c, d) {
  c = goog.array.binarySearch(a, c, d);
  return 0 <= c ? goog.array.removeAt(a, c) : !1
};
goog.array.bucket = function(a, c) {
  for(var d = {}, e = 0;e < a.length;e++) {
    var f = a[e], h = c(f, e, a);
    goog.isDef(h) && (d[h] || (d[h] = [])).push(f)
  }
  return d
};
goog.array.toObject = function(a, c, d) {
  var e = {};
  goog.array.forEach(a, function(f, h) {
    e[c.call(d, f, h, a)] = f
  });
  return e
};
goog.array.repeat = function(a, c) {
  for(var d = [], e = 0;e < c;e++) {
    d[e] = a
  }
  return d
};
goog.array.flatten = function(a) {
  for(var c = [], d = 0;d < arguments.length;d++) {
    var e = arguments[d];
    goog.isArray(e) ? c.push.apply(c, goog.array.flatten.apply(null, e)) : c.push(e)
  }
  return c
};
goog.array.rotate = function(a, c) {
  goog.asserts.assert(null != a.length);
  a.length && (c %= a.length, 0 < c ? goog.array.ARRAY_PROTOTYPE_.unshift.apply(a, a.splice(-c, c)) : 0 > c && goog.array.ARRAY_PROTOTYPE_.push.apply(a, a.splice(0, -c)));
  return a
};
goog.array.zip = function(a) {
  if(!arguments.length) {
    return[]
  }
  for(var c = [], d = 0;;d++) {
    for(var e = [], f = 0;f < arguments.length;f++) {
      var h = arguments[f];
      if(d >= h.length) {
        return c
      }
      e.push(h[d])
    }
    c.push(e)
  }
};
goog.array.shuffle = function(a, c) {
  for(var d = c || Math.random, e = a.length - 1;0 < e;e--) {
    var f = Math.floor(d() * (e + 1)), h = a[e];
    a[e] = a[f];
    a[f] = h
  }
};
goog.userAgent = {};
goog.userAgent.ASSUME_IE = !1;
goog.userAgent.ASSUME_GECKO = !1;
goog.userAgent.ASSUME_WEBKIT = !1;
goog.userAgent.ASSUME_MOBILE_WEBKIT = !1;
goog.userAgent.ASSUME_OPERA = !1;
goog.userAgent.ASSUME_ANY_VERSION = !1;
goog.userAgent.BROWSER_KNOWN_ = goog.userAgent.ASSUME_IE || goog.userAgent.ASSUME_GECKO || goog.userAgent.ASSUME_MOBILE_WEBKIT || goog.userAgent.ASSUME_WEBKIT || goog.userAgent.ASSUME_OPERA;
goog.userAgent.getUserAgentString = function() {
  return goog.global.navigator ? goog.global.navigator.userAgent : null
};
goog.userAgent.getNavigator = function() {
  return goog.global.navigator
};
goog.userAgent.init_ = function() {
  goog.userAgent.detectedOpera_ = !1;
  goog.userAgent.detectedIe_ = !1;
  goog.userAgent.detectedWebkit_ = !1;
  goog.userAgent.detectedMobile_ = !1;
  goog.userAgent.detectedGecko_ = !1;
  var a;
  if(!goog.userAgent.BROWSER_KNOWN_ && (a = goog.userAgent.getUserAgentString())) {
    var c = goog.userAgent.getNavigator();
    goog.userAgent.detectedOpera_ = 0 == a.indexOf("Opera");
    goog.userAgent.detectedIe_ = !goog.userAgent.detectedOpera_ && -1 != a.indexOf("MSIE");
    goog.userAgent.detectedWebkit_ = !goog.userAgent.detectedOpera_ && -1 != a.indexOf("WebKit");
    goog.userAgent.detectedMobile_ = goog.userAgent.detectedWebkit_ && -1 != a.indexOf("Mobile");
    goog.userAgent.detectedGecko_ = !goog.userAgent.detectedOpera_ && !goog.userAgent.detectedWebkit_ && "Gecko" == c.product
  }
};
goog.userAgent.BROWSER_KNOWN_ || goog.userAgent.init_();
goog.userAgent.OPERA = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_OPERA : goog.userAgent.detectedOpera_;
goog.userAgent.IE = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_IE : goog.userAgent.detectedIe_;
goog.userAgent.GECKO = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_GECKO : goog.userAgent.detectedGecko_;
goog.userAgent.WEBKIT = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_WEBKIT || goog.userAgent.ASSUME_MOBILE_WEBKIT : goog.userAgent.detectedWebkit_;
goog.userAgent.MOBILE = goog.userAgent.ASSUME_MOBILE_WEBKIT || goog.userAgent.detectedMobile_;
goog.userAgent.SAFARI = goog.userAgent.WEBKIT;
goog.userAgent.determinePlatform_ = function() {
  var a = goog.userAgent.getNavigator();
  return a && a.platform || ""
};
goog.userAgent.PLATFORM = goog.userAgent.determinePlatform_();
goog.userAgent.ASSUME_MAC = !1;
goog.userAgent.ASSUME_WINDOWS = !1;
goog.userAgent.ASSUME_LINUX = !1;
goog.userAgent.ASSUME_X11 = !1;
goog.userAgent.PLATFORM_KNOWN_ = goog.userAgent.ASSUME_MAC || goog.userAgent.ASSUME_WINDOWS || goog.userAgent.ASSUME_LINUX || goog.userAgent.ASSUME_X11;
goog.userAgent.initPlatform_ = function() {
  goog.userAgent.detectedMac_ = goog.string.contains(goog.userAgent.PLATFORM, "Mac");
  goog.userAgent.detectedWindows_ = goog.string.contains(goog.userAgent.PLATFORM, "Win");
  goog.userAgent.detectedLinux_ = goog.string.contains(goog.userAgent.PLATFORM, "Linux");
  goog.userAgent.detectedX11_ = !!goog.userAgent.getNavigator() && goog.string.contains(goog.userAgent.getNavigator().appVersion || "", "X11")
};
goog.userAgent.PLATFORM_KNOWN_ || goog.userAgent.initPlatform_();
goog.userAgent.MAC = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_MAC : goog.userAgent.detectedMac_;
goog.userAgent.WINDOWS = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_WINDOWS : goog.userAgent.detectedWindows_;
goog.userAgent.LINUX = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_LINUX : goog.userAgent.detectedLinux_;
goog.userAgent.X11 = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_X11 : goog.userAgent.detectedX11_;
goog.userAgent.determineVersion_ = function() {
  var a = "", c;
  goog.userAgent.OPERA && goog.global.opera ? (a = goog.global.opera.version, a = "function" == typeof a ? a() : a) : (goog.userAgent.GECKO ? c = /rv\:([^\);]+)(\)|;)/ : goog.userAgent.IE ? c = /MSIE\s+([^\);]+)(\)|;)/ : goog.userAgent.WEBKIT && (c = /WebKit\/(\S+)/), c && (a = (a = c.exec(goog.userAgent.getUserAgentString())) ? a[1] : ""));
  return goog.userAgent.IE && (c = goog.userAgent.getDocumentMode_(), c > parseFloat(a)) ? String(c) : a
};
goog.userAgent.getDocumentMode_ = function() {
  var a = goog.global.document;
  return a ? a.documentMode : void 0
};
goog.userAgent.VERSION = goog.userAgent.determineVersion_();
goog.userAgent.compare = function(a, c) {
  return goog.string.compareVersions(a, c)
};
goog.userAgent.isVersionCache_ = {};
goog.userAgent.isVersion = function(a) {
  return goog.userAgent.ASSUME_ANY_VERSION || goog.userAgent.isVersionCache_[a] || (goog.userAgent.isVersionCache_[a] = 0 <= goog.string.compareVersions(goog.userAgent.VERSION, a))
};
goog.userAgent.isDocumentModeCache_ = {};
goog.userAgent.isDocumentMode = function(a) {
  return goog.userAgent.isDocumentModeCache_[a] || (goog.userAgent.isDocumentModeCache_[a] = goog.userAgent.IE && !!document.documentMode && document.documentMode >= a)
};
goog.dom = {};
goog.dom.BrowserFeature = {CAN_ADD_NAME_OR_TYPE_ATTRIBUTES:!goog.userAgent.IE || goog.userAgent.isDocumentMode(9), CAN_USE_CHILDREN_ATTRIBUTE:!goog.userAgent.GECKO && !goog.userAgent.IE || goog.userAgent.IE && goog.userAgent.isDocumentMode(9) || goog.userAgent.GECKO && goog.userAgent.isVersion("1.9.1"), CAN_USE_INNER_TEXT:goog.userAgent.IE && !goog.userAgent.isVersion("9"), CAN_USE_PARENT_ELEMENT_PROPERTY:goog.userAgent.IE || goog.userAgent.OPERA || goog.userAgent.WEBKIT, INNER_HTML_NEEDS_SCOPED_ELEMENT:goog.userAgent.IE};
goog.dom.TagName = {A:"A", ABBR:"ABBR", ACRONYM:"ACRONYM", ADDRESS:"ADDRESS", APPLET:"APPLET", AREA:"AREA", ARTICLE:"ARTICLE", ASIDE:"ASIDE", AUDIO:"AUDIO", B:"B", BASE:"BASE", BASEFONT:"BASEFONT", BDI:"BDI", BDO:"BDO", BIG:"BIG", BLOCKQUOTE:"BLOCKQUOTE", BODY:"BODY", BR:"BR", BUTTON:"BUTTON", CANVAS:"CANVAS", CAPTION:"CAPTION", CENTER:"CENTER", CITE:"CITE", CODE:"CODE", COL:"COL", COLGROUP:"COLGROUP", COMMAND:"COMMAND", DATA:"DATA", DATALIST:"DATALIST", DD:"DD", DEL:"DEL", DETAILS:"DETAILS", DFN:"DFN", 
DIALOG:"DIALOG", DIR:"DIR", DIV:"DIV", DL:"DL", DT:"DT", EM:"EM", EMBED:"EMBED", FIELDSET:"FIELDSET", FIGCAPTION:"FIGCAPTION", FIGURE:"FIGURE", FONT:"FONT", FOOTER:"FOOTER", FORM:"FORM", FRAME:"FRAME", FRAMESET:"FRAMESET", H1:"H1", H2:"H2", H3:"H3", H4:"H4", H5:"H5", H6:"H6", HEAD:"HEAD", HEADER:"HEADER", HGROUP:"HGROUP", HR:"HR", HTML:"HTML", I:"I", IFRAME:"IFRAME", IMG:"IMG", INPUT:"INPUT", INS:"INS", ISINDEX:"ISINDEX", KBD:"KBD", KEYGEN:"KEYGEN", LABEL:"LABEL", LEGEND:"LEGEND", LI:"LI", LINK:"LINK", 
MAP:"MAP", MARK:"MARK", MATH:"MATH", MENU:"MENU", META:"META", METER:"METER", NAV:"NAV", NOFRAMES:"NOFRAMES", NOSCRIPT:"NOSCRIPT", OBJECT:"OBJECT", OL:"OL", OPTGROUP:"OPTGROUP", OPTION:"OPTION", OUTPUT:"OUTPUT", P:"P", PARAM:"PARAM", PRE:"PRE", PROGRESS:"PROGRESS", Q:"Q", RP:"RP", RT:"RT", RUBY:"RUBY", S:"S", SAMP:"SAMP", SCRIPT:"SCRIPT", SECTION:"SECTION", SELECT:"SELECT", SMALL:"SMALL", SOURCE:"SOURCE", SPAN:"SPAN", STRIKE:"STRIKE", STRONG:"STRONG", STYLE:"STYLE", SUB:"SUB", SUMMARY:"SUMMARY", 
SUP:"SUP", SVG:"SVG", TABLE:"TABLE", TBODY:"TBODY", TD:"TD", TEXTAREA:"TEXTAREA", TFOOT:"TFOOT", TH:"TH", THEAD:"THEAD", TIME:"TIME", TITLE:"TITLE", TR:"TR", TRACK:"TRACK", TT:"TT", U:"U", UL:"UL", VAR:"VAR", VIDEO:"VIDEO", WBR:"WBR"};
goog.dom.classes = {};
goog.dom.classes.set = function(a, c) {
  a.className = c
};
goog.dom.classes.get = function(a) {
  a = a.className;
  return goog.isString(a) && a.match(/\S+/g) || []
};
goog.dom.classes.add = function(a, c) {
  var d = goog.dom.classes.get(a), e = goog.array.slice(arguments, 1), f = d.length + e.length;
  goog.dom.classes.add_(d, e);
  a.className = d.join(" ");
  return d.length == f
};
goog.dom.classes.remove = function(a, c) {
  var d = goog.dom.classes.get(a), e = goog.array.slice(arguments, 1), f = goog.dom.classes.getDifference_(d, e);
  a.className = f.join(" ");
  return f.length == d.length - e.length
};
goog.dom.classes.add_ = function(a, c) {
  for(var d = 0;d < c.length;d++) {
    goog.array.contains(a, c[d]) || a.push(c[d])
  }
};
goog.dom.classes.getDifference_ = function(a, c) {
  return goog.array.filter(a, function(a) {
    return!goog.array.contains(c, a)
  })
};
goog.dom.classes.swap = function(a, c, d) {
  for(var e = goog.dom.classes.get(a), f = !1, h = 0;h < e.length;h++) {
    e[h] == c && (goog.array.splice(e, h--, 1), f = !0)
  }
  f && (e.push(d), a.className = e.join(" "));
  return f
};
goog.dom.classes.addRemove = function(a, c, d) {
  var e = goog.dom.classes.get(a);
  goog.isString(c) ? goog.array.remove(e, c) : goog.isArray(c) && (e = goog.dom.classes.getDifference_(e, c));
  goog.isString(d) && !goog.array.contains(e, d) ? e.push(d) : goog.isArray(d) && goog.dom.classes.add_(e, d);
  a.className = e.join(" ")
};
goog.dom.classes.has = function(a, c) {
  return goog.array.contains(goog.dom.classes.get(a), c)
};
goog.dom.classes.enable = function(a, c, d) {
  d ? goog.dom.classes.add(a, c) : goog.dom.classes.remove(a, c)
};
goog.dom.classes.toggle = function(a, c) {
  var d = !goog.dom.classes.has(a, c);
  goog.dom.classes.enable(a, c, d);
  return d
};
goog.math = {};
goog.math.randomInt = function(a) {
  return Math.floor(Math.random() * a)
};
goog.math.uniformRandom = function(a, c) {
  return a + Math.random() * (c - a)
};
goog.math.clamp = function(a, c, d) {
  return Math.min(Math.max(a, c), d)
};
goog.math.modulo = function(a, c) {
  var d = a % c;
  return 0 > d * c ? d + c : d
};
goog.math.lerp = function(a, c, d) {
  return a + d * (c - a)
};
goog.math.nearlyEquals = function(a, c, d) {
  return Math.abs(a - c) <= (d || 1E-6)
};
goog.math.standardAngle = function(a) {
  return goog.math.modulo(a, 360)
};
goog.math.toRadians = function(a) {
  return a * Math.PI / 180
};
goog.math.toDegrees = function(a) {
  return 180 * a / Math.PI
};
goog.math.angleDx = function(a, c) {
  return c * Math.cos(goog.math.toRadians(a))
};
goog.math.angleDy = function(a, c) {
  return c * Math.sin(goog.math.toRadians(a))
};
goog.math.angle = function(a, c, d, e) {
  return goog.math.standardAngle(goog.math.toDegrees(Math.atan2(e - c, d - a)))
};
goog.math.angleDifference = function(a, c) {
  var d = goog.math.standardAngle(c) - goog.math.standardAngle(a);
  180 < d ? d -= 360 : -180 >= d && (d = 360 + d);
  return d
};
goog.math.sign = function(a) {
  return 0 == a ? 0 : 0 > a ? -1 : 1
};
goog.math.longestCommonSubsequence = function(a, c, d, e) {
  for(var d = d || function(a, c) {
    return a == c
  }, e = e || function(c) {
    return a[c]
  }, f = a.length, h = c.length, i = [], j = 0;j < f + 1;j++) {
    i[j] = [], i[j][0] = 0
  }
  for(var k = 0;k < h + 1;k++) {
    i[0][k] = 0
  }
  for(j = 1;j <= f;j++) {
    for(k = 1;k <= f;k++) {
      i[j][k] = d(a[j - 1], c[k - 1]) ? i[j - 1][k - 1] + 1 : Math.max(i[j - 1][k], i[j][k - 1])
    }
  }
  for(var l = [], j = f, k = h;0 < j && 0 < k;) {
    d(a[j - 1], c[k - 1]) ? (l.unshift(e(j - 1, k - 1)), j--, k--) : i[j - 1][k] > i[j][k - 1] ? j-- : k--
  }
  return l
};
goog.math.sum = function(a) {
  return goog.array.reduce(arguments, function(a, d) {
    return a + d
  }, 0)
};
goog.math.average = function(a) {
  return goog.math.sum.apply(null, arguments) / arguments.length
};
goog.math.standardDeviation = function(a) {
  var c = arguments.length;
  if(2 > c) {
    return 0
  }
  var d = goog.math.average.apply(null, arguments), c = goog.math.sum.apply(null, goog.array.map(arguments, function(a) {
    return Math.pow(a - d, 2)
  })) / (c - 1);
  return Math.sqrt(c)
};
goog.math.isInt = function(a) {
  return isFinite(a) && 0 == a % 1
};
goog.math.isFiniteNumber = function(a) {
  return isFinite(a) && !isNaN(a)
};
goog.math.Coordinate = function(a, c) {
  this.x = goog.isDef(a) ? a : 0;
  this.y = goog.isDef(c) ? c : 0
};
goog.math.Coordinate.prototype.clone = function() {
  return new goog.math.Coordinate(this.x, this.y)
};
goog.DEBUG && (goog.math.Coordinate.prototype.toString = function() {
  return"(" + this.x + ", " + this.y + ")"
});
goog.math.Coordinate.equals = function(a, c) {
  return a == c ? !0 : !a || !c ? !1 : a.x == c.x && a.y == c.y
};
goog.math.Coordinate.distance = function(a, c) {
  var d = a.x - c.x, e = a.y - c.y;
  return Math.sqrt(d * d + e * e)
};
goog.math.Coordinate.magnitude = function(a) {
  return Math.sqrt(a.x * a.x + a.y * a.y)
};
goog.math.Coordinate.azimuth = function(a) {
  return goog.math.angle(0, 0, a.x, a.y)
};
goog.math.Coordinate.squaredDistance = function(a, c) {
  var d = a.x - c.x, e = a.y - c.y;
  return d * d + e * e
};
goog.math.Coordinate.difference = function(a, c) {
  return new goog.math.Coordinate(a.x - c.x, a.y - c.y)
};
goog.math.Coordinate.sum = function(a, c) {
  return new goog.math.Coordinate(a.x + c.x, a.y + c.y)
};
goog.math.Size = function(a, c) {
  this.width = a;
  this.height = c
};
goog.math.Size.equals = function(a, c) {
  return a == c ? !0 : !a || !c ? !1 : a.width == c.width && a.height == c.height
};
goog.math.Size.prototype.clone = function() {
  return new goog.math.Size(this.width, this.height)
};
goog.DEBUG && (goog.math.Size.prototype.toString = function() {
  return"(" + this.width + " x " + this.height + ")"
});
goog.math.Size.prototype.getLongest = function() {
  return Math.max(this.width, this.height)
};
goog.math.Size.prototype.getShortest = function() {
  return Math.min(this.width, this.height)
};
goog.math.Size.prototype.area = function() {
  return this.width * this.height
};
goog.math.Size.prototype.perimeter = function() {
  return 2 * (this.width + this.height)
};
goog.math.Size.prototype.aspectRatio = function() {
  return this.width / this.height
};
goog.math.Size.prototype.isEmpty = function() {
  return!this.area()
};
goog.math.Size.prototype.ceil = function() {
  this.width = Math.ceil(this.width);
  this.height = Math.ceil(this.height);
  return this
};
goog.math.Size.prototype.fitsInside = function(a) {
  return this.width <= a.width && this.height <= a.height
};
goog.math.Size.prototype.floor = function() {
  this.width = Math.floor(this.width);
  this.height = Math.floor(this.height);
  return this
};
goog.math.Size.prototype.round = function() {
  this.width = Math.round(this.width);
  this.height = Math.round(this.height);
  return this
};
goog.math.Size.prototype.scale = function(a) {
  this.width *= a;
  this.height *= a;
  return this
};
goog.math.Size.prototype.scaleToFit = function(a) {
  a = this.aspectRatio() > a.aspectRatio() ? a.width / this.width : a.height / this.height;
  return this.scale(a)
};
goog.object = {};
goog.object.forEach = function(a, c, d) {
  for(var e in a) {
    c.call(d, a[e], e, a)
  }
};
goog.object.filter = function(a, c, d) {
  var e = {}, f;
  for(f in a) {
    c.call(d, a[f], f, a) && (e[f] = a[f])
  }
  return e
};
goog.object.map = function(a, c, d) {
  var e = {}, f;
  for(f in a) {
    e[f] = c.call(d, a[f], f, a)
  }
  return e
};
goog.object.some = function(a, c, d) {
  for(var e in a) {
    if(c.call(d, a[e], e, a)) {
      return!0
    }
  }
  return!1
};
goog.object.every = function(a, c, d) {
  for(var e in a) {
    if(!c.call(d, a[e], e, a)) {
      return!1
    }
  }
  return!0
};
goog.object.getCount = function(a) {
  var c = 0, d;
  for(d in a) {
    c++
  }
  return c
};
goog.object.getAnyKey = function(a) {
  for(var c in a) {
    return c
  }
};
goog.object.getAnyValue = function(a) {
  for(var c in a) {
    return a[c]
  }
};
goog.object.contains = function(a, c) {
  return goog.object.containsValue(a, c)
};
goog.object.getValues = function(a) {
  var c = [], d = 0, e;
  for(e in a) {
    c[d++] = a[e]
  }
  return c
};
goog.object.getKeys = function(a) {
  var c = [], d = 0, e;
  for(e in a) {
    c[d++] = e
  }
  return c
};
goog.object.getValueByKeys = function(a, c) {
  for(var d = goog.isArrayLike(c), e = d ? c : arguments, d = d ? 0 : 1;d < e.length && !(a = a[e[d]], !goog.isDef(a));d++) {
  }
  return a
};
goog.object.containsKey = function(a, c) {
  return c in a
};
goog.object.containsValue = function(a, c) {
  for(var d in a) {
    if(a[d] == c) {
      return!0
    }
  }
  return!1
};
goog.object.findKey = function(a, c, d) {
  for(var e in a) {
    if(c.call(d, a[e], e, a)) {
      return e
    }
  }
};
goog.object.findValue = function(a, c, d) {
  return(c = goog.object.findKey(a, c, d)) && a[c]
};
goog.object.isEmpty = function(a) {
  for(var c in a) {
    return!1
  }
  return!0
};
goog.object.clear = function(a) {
  for(var c in a) {
    delete a[c]
  }
};
goog.object.remove = function(a, c) {
  var d;
  (d = c in a) && delete a[c];
  return d
};
goog.object.add = function(a, c, d) {
  if(c in a) {
    throw Error('The object already contains the key "' + c + '"');
  }
  goog.object.set(a, c, d)
};
goog.object.get = function(a, c, d) {
  return c in a ? a[c] : d
};
goog.object.set = function(a, c, d) {
  a[c] = d
};
goog.object.setIfUndefined = function(a, c, d) {
  return c in a ? a[c] : a[c] = d
};
goog.object.clone = function(a) {
  var c = {}, d;
  for(d in a) {
    c[d] = a[d]
  }
  return c
};
goog.object.unsafeClone = function(a) {
  var c = goog.typeOf(a);
  if("object" == c || "array" == c) {
    if(a.clone) {
      return a.clone()
    }
    var c = "array" == c ? [] : {}, d;
    for(d in a) {
      c[d] = goog.object.unsafeClone(a[d])
    }
    return c
  }
  return a
};
goog.object.transpose = function(a) {
  var c = {}, d;
  for(d in a) {
    c[a[d]] = d
  }
  return c
};
goog.object.PROTOTYPE_FIELDS_ = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");
goog.object.extend = function(a, c) {
  for(var d, e, f = 1;f < arguments.length;f++) {
    e = arguments[f];
    for(d in e) {
      a[d] = e[d]
    }
    for(var h = 0;h < goog.object.PROTOTYPE_FIELDS_.length;h++) {
      d = goog.object.PROTOTYPE_FIELDS_[h], Object.prototype.hasOwnProperty.call(e, d) && (a[d] = e[d])
    }
  }
};
goog.object.create = function(a) {
  var c = arguments.length;
  if(1 == c && goog.isArray(arguments[0])) {
    return goog.object.create.apply(null, arguments[0])
  }
  if(c % 2) {
    throw Error("Uneven number of arguments");
  }
  for(var d = {}, e = 0;e < c;e += 2) {
    d[arguments[e]] = arguments[e + 1]
  }
  return d
};
goog.object.createSet = function(a) {
  var c = arguments.length;
  if(1 == c && goog.isArray(arguments[0])) {
    return goog.object.createSet.apply(null, arguments[0])
  }
  for(var d = {}, e = 0;e < c;e++) {
    d[arguments[e]] = !0
  }
  return d
};
goog.object.createImmutableView = function(a) {
  var c = a;
  Object.isFrozen && !Object.isFrozen(a) && (c = Object.create(a), Object.freeze(c));
  return c
};
goog.object.isImmutableView = function(a) {
  return!!Object.isFrozen && Object.isFrozen(a)
};
goog.dom.ASSUME_QUIRKS_MODE = !1;
goog.dom.ASSUME_STANDARDS_MODE = !0;
goog.dom.COMPAT_MODE_KNOWN_ = goog.dom.ASSUME_QUIRKS_MODE || goog.dom.ASSUME_STANDARDS_MODE;
goog.dom.NodeType = {ELEMENT:1, ATTRIBUTE:2, TEXT:3, CDATA_SECTION:4, ENTITY_REFERENCE:5, ENTITY:6, PROCESSING_INSTRUCTION:7, COMMENT:8, DOCUMENT:9, DOCUMENT_TYPE:10, DOCUMENT_FRAGMENT:11, NOTATION:12};
goog.dom.getDomHelper = function(a) {
  return a ? new goog.dom.DomHelper(goog.dom.getOwnerDocument(a)) : goog.dom.defaultDomHelper_ || (goog.dom.defaultDomHelper_ = new goog.dom.DomHelper)
};
goog.dom.getDocument = function() {
  return document
};
goog.dom.getElement = function(a) {
  return goog.isString(a) ? document.getElementById(a) : a
};
goog.dom.$ = goog.dom.getElement;
goog.dom.getElementsByTagNameAndClass = function(a, c, d) {
  return goog.dom.getElementsByTagNameAndClass_(document, a, c, d)
};
goog.dom.getElementsByClass = function(a, c) {
  var d = c || document;
  return goog.dom.canUseQuerySelector_(d) ? d.querySelectorAll("." + a) : d.getElementsByClassName ? d.getElementsByClassName(a) : goog.dom.getElementsByTagNameAndClass_(document, "*", a, c)
};
goog.dom.getElementByClass = function(a, c) {
  var d = c || document, e = null;
  return(e = goog.dom.canUseQuerySelector_(d) ? d.querySelector("." + a) : goog.dom.getElementsByClass(a, c)[0]) || null
};
goog.dom.canUseQuerySelector_ = function(a) {
  return!(!a.querySelectorAll || !a.querySelector)
};
goog.dom.getElementsByTagNameAndClass_ = function(a, c, d, e) {
  a = e || a;
  c = c && "*" != c ? c.toUpperCase() : "";
  if(goog.dom.canUseQuerySelector_(a) && (c || d)) {
    return a.querySelectorAll(c + (d ? "." + d : ""))
  }
  if(d && a.getElementsByClassName) {
    a = a.getElementsByClassName(d);
    if(c) {
      for(var e = {}, f = 0, h = 0, i;i = a[h];h++) {
        c == i.nodeName && (e[f++] = i)
      }
      e.length = f;
      return e
    }
    return a
  }
  a = a.getElementsByTagName(c || "*");
  if(d) {
    e = {};
    for(h = f = 0;i = a[h];h++) {
      c = i.className, "function" == typeof c.split && goog.array.contains(c.split(/\s+/), d) && (e[f++] = i)
    }
    e.length = f;
    return e
  }
  return a
};
goog.dom.$$ = goog.dom.getElementsByTagNameAndClass;
goog.dom.setProperties = function(a, c) {
  goog.object.forEach(c, function(c, e) {
    "style" == e ? a.style.cssText = c : "class" == e ? a.className = c : "for" == e ? a.htmlFor = c : e in goog.dom.DIRECT_ATTRIBUTE_MAP_ ? a.setAttribute(goog.dom.DIRECT_ATTRIBUTE_MAP_[e], c) : goog.string.startsWith(e, "aria-") || goog.string.startsWith(e, "data-") ? a.setAttribute(e, c) : a[e] = c
  })
};
goog.dom.DIRECT_ATTRIBUTE_MAP_ = {cellpadding:"cellPadding", cellspacing:"cellSpacing", colspan:"colSpan", frameborder:"frameBorder", height:"height", maxlength:"maxLength", role:"role", rowspan:"rowSpan", type:"type", usemap:"useMap", valign:"vAlign", width:"width"};
goog.dom.getViewportSize = function(a) {
  return goog.dom.getViewportSize_(a || window)
};
goog.dom.getViewportSize_ = function(a) {
  a = a.document;
  a = goog.dom.isCss1CompatMode_(a) ? a.documentElement : a.body;
  return new goog.math.Size(a.clientWidth, a.clientHeight)
};
goog.dom.getDocumentHeight = function() {
  return goog.dom.getDocumentHeight_(window)
};
goog.dom.getDocumentHeight_ = function(a) {
  var c = a.document, d = 0;
  if(c) {
    var a = goog.dom.getViewportSize_(a).height, d = c.body, e = c.documentElement;
    if(goog.dom.isCss1CompatMode_(c) && e.scrollHeight) {
      d = e.scrollHeight != a ? e.scrollHeight : e.offsetHeight
    }else {
      var c = e.scrollHeight, f = e.offsetHeight;
      e.clientHeight != f && (c = d.scrollHeight, f = d.offsetHeight);
      d = c > a ? c > f ? c : f : c < f ? c : f
    }
  }
  return d
};
goog.dom.getPageScroll = function(a) {
  return goog.dom.getDomHelper((a || goog.global || window).document).getDocumentScroll()
};
goog.dom.getDocumentScroll = function() {
  return goog.dom.getDocumentScroll_(document)
};
goog.dom.getDocumentScroll_ = function(a) {
  var c = goog.dom.getDocumentScrollElement_(a), a = goog.dom.getWindow_(a);
  return new goog.math.Coordinate(a.pageXOffset || c.scrollLeft, a.pageYOffset || c.scrollTop)
};
goog.dom.getDocumentScrollElement = function() {
  return goog.dom.getDocumentScrollElement_(document)
};
goog.dom.getDocumentScrollElement_ = function(a) {
  return!goog.userAgent.WEBKIT && goog.dom.isCss1CompatMode_(a) ? a.documentElement : a.body
};
goog.dom.getWindow = function(a) {
  return a ? goog.dom.getWindow_(a) : window
};
goog.dom.getWindow_ = function(a) {
  return a.parentWindow || a.defaultView
};
goog.dom.createDom = function(a, c, d) {
  return goog.dom.createDom_(document, arguments)
};
goog.dom.createDom_ = function(a, c) {
  var d = c[0], e = c[1];
  if(!goog.dom.BrowserFeature.CAN_ADD_NAME_OR_TYPE_ATTRIBUTES && e && (e.name || e.type)) {
    d = ["<", d];
    e.name && d.push(' name="', goog.string.htmlEscape(e.name), '"');
    if(e.type) {
      d.push(' type="', goog.string.htmlEscape(e.type), '"');
      var f = {};
      goog.object.extend(f, e);
      delete f.type;
      e = f
    }
    d.push(">");
    d = d.join("")
  }
  d = a.createElement(d);
  e && (goog.isString(e) ? d.className = e : goog.isArray(e) ? goog.dom.classes.add.apply(null, [d].concat(e)) : goog.dom.setProperties(d, e));
  2 < c.length && goog.dom.append_(a, d, c, 2);
  return d
};
goog.dom.append_ = function(a, c, d, e) {
  function f(d) {
    d && c.appendChild(goog.isString(d) ? a.createTextNode(d) : d)
  }
  for(;e < d.length;e++) {
    var h = d[e];
    goog.isArrayLike(h) && !goog.dom.isNodeLike(h) ? goog.array.forEach(goog.dom.isNodeList(h) ? goog.array.toArray(h) : h, f) : f(h)
  }
};
goog.dom.$dom = goog.dom.createDom;
goog.dom.createElement = function(a) {
  return document.createElement(a)
};
goog.dom.createTextNode = function(a) {
  return document.createTextNode(a)
};
goog.dom.createTable = function(a, c, d) {
  return goog.dom.createTable_(document, a, c, !!d)
};
goog.dom.createTable_ = function(a, c, d, e) {
  for(var f = ["<tr>"], h = 0;h < d;h++) {
    f.push(e ? "<td>&nbsp;</td>" : "<td></td>")
  }
  f.push("</tr>");
  f = f.join("");
  d = ["<table>"];
  for(h = 0;h < c;h++) {
    d.push(f)
  }
  d.push("</table>");
  a = a.createElement(goog.dom.TagName.DIV);
  a.innerHTML = d.join("");
  return a.removeChild(a.firstChild)
};
goog.dom.htmlToDocumentFragment = function(a) {
  return goog.dom.htmlToDocumentFragment_(document, a)
};
goog.dom.htmlToDocumentFragment_ = function(a, c) {
  var d = a.createElement("div");
  goog.dom.BrowserFeature.INNER_HTML_NEEDS_SCOPED_ELEMENT ? (d.innerHTML = "<br>" + c, d.removeChild(d.firstChild)) : d.innerHTML = c;
  if(1 == d.childNodes.length) {
    return d.removeChild(d.firstChild)
  }
  for(var e = a.createDocumentFragment();d.firstChild;) {
    e.appendChild(d.firstChild)
  }
  return e
};
goog.dom.getCompatMode = function() {
  return goog.dom.isCss1CompatMode() ? "CSS1Compat" : "BackCompat"
};
goog.dom.isCss1CompatMode = function() {
  return goog.dom.isCss1CompatMode_(document)
};
goog.dom.isCss1CompatMode_ = function(a) {
  return goog.dom.COMPAT_MODE_KNOWN_ ? goog.dom.ASSUME_STANDARDS_MODE : "CSS1Compat" == a.compatMode
};
goog.dom.canHaveChildren = function(a) {
  if(a.nodeType != goog.dom.NodeType.ELEMENT) {
    return!1
  }
  switch(a.tagName) {
    case goog.dom.TagName.APPLET:
    ;
    case goog.dom.TagName.AREA:
    ;
    case goog.dom.TagName.BASE:
    ;
    case goog.dom.TagName.BR:
    ;
    case goog.dom.TagName.COL:
    ;
    case goog.dom.TagName.COMMAND:
    ;
    case goog.dom.TagName.EMBED:
    ;
    case goog.dom.TagName.FRAME:
    ;
    case goog.dom.TagName.HR:
    ;
    case goog.dom.TagName.IMG:
    ;
    case goog.dom.TagName.INPUT:
    ;
    case goog.dom.TagName.IFRAME:
    ;
    case goog.dom.TagName.ISINDEX:
    ;
    case goog.dom.TagName.KEYGEN:
    ;
    case goog.dom.TagName.LINK:
    ;
    case goog.dom.TagName.NOFRAMES:
    ;
    case goog.dom.TagName.NOSCRIPT:
    ;
    case goog.dom.TagName.META:
    ;
    case goog.dom.TagName.OBJECT:
    ;
    case goog.dom.TagName.PARAM:
    ;
    case goog.dom.TagName.SCRIPT:
    ;
    case goog.dom.TagName.SOURCE:
    ;
    case goog.dom.TagName.STYLE:
    ;
    case goog.dom.TagName.TRACK:
    ;
    case goog.dom.TagName.WBR:
      return!1
  }
  return!0
};
goog.dom.appendChild = function(a, c) {
  a.appendChild(c)
};
goog.dom.append = function(a, c) {
  goog.dom.append_(goog.dom.getOwnerDocument(a), a, arguments, 1)
};
goog.dom.removeChildren = function(a) {
  for(var c;c = a.firstChild;) {
    a.removeChild(c)
  }
};
goog.dom.insertSiblingBefore = function(a, c) {
  c.parentNode && c.parentNode.insertBefore(a, c)
};
goog.dom.insertSiblingAfter = function(a, c) {
  c.parentNode && c.parentNode.insertBefore(a, c.nextSibling)
};
goog.dom.insertChildAt = function(a, c, d) {
  a.insertBefore(c, a.childNodes[d] || null)
};
goog.dom.removeNode = function(a) {
  return a && a.parentNode ? a.parentNode.removeChild(a) : null
};
goog.dom.replaceNode = function(a, c) {
  var d = c.parentNode;
  d && d.replaceChild(a, c)
};
goog.dom.flattenElement = function(a) {
  var c, d = a.parentNode;
  if(d && d.nodeType != goog.dom.NodeType.DOCUMENT_FRAGMENT) {
    if(a.removeNode) {
      return a.removeNode(!1)
    }
    for(;c = a.firstChild;) {
      d.insertBefore(c, a)
    }
    return goog.dom.removeNode(a)
  }
};
goog.dom.getChildren = function(a) {
  return goog.dom.BrowserFeature.CAN_USE_CHILDREN_ATTRIBUTE && void 0 != a.children ? a.children : goog.array.filter(a.childNodes, function(a) {
    return a.nodeType == goog.dom.NodeType.ELEMENT
  })
};
goog.dom.getFirstElementChild = function(a) {
  return void 0 != a.firstElementChild ? a.firstElementChild : goog.dom.getNextElementNode_(a.firstChild, !0)
};
goog.dom.getLastElementChild = function(a) {
  return void 0 != a.lastElementChild ? a.lastElementChild : goog.dom.getNextElementNode_(a.lastChild, !1)
};
goog.dom.getNextElementSibling = function(a) {
  return void 0 != a.nextElementSibling ? a.nextElementSibling : goog.dom.getNextElementNode_(a.nextSibling, !0)
};
goog.dom.getPreviousElementSibling = function(a) {
  return void 0 != a.previousElementSibling ? a.previousElementSibling : goog.dom.getNextElementNode_(a.previousSibling, !1)
};
goog.dom.getNextElementNode_ = function(a, c) {
  for(;a && a.nodeType != goog.dom.NodeType.ELEMENT;) {
    a = c ? a.nextSibling : a.previousSibling
  }
  return a
};
goog.dom.getNextNode = function(a) {
  if(!a) {
    return null
  }
  if(a.firstChild) {
    return a.firstChild
  }
  for(;a && !a.nextSibling;) {
    a = a.parentNode
  }
  return a ? a.nextSibling : null
};
goog.dom.getPreviousNode = function(a) {
  if(!a) {
    return null
  }
  if(!a.previousSibling) {
    return a.parentNode
  }
  for(a = a.previousSibling;a && a.lastChild;) {
    a = a.lastChild
  }
  return a
};
goog.dom.isNodeLike = function(a) {
  return goog.isObject(a) && 0 < a.nodeType
};
goog.dom.isElement = function(a) {
  return goog.isObject(a) && a.nodeType == goog.dom.NodeType.ELEMENT
};
goog.dom.isWindow = function(a) {
  return goog.isObject(a) && a.window == a
};
goog.dom.getParentElement = function(a) {
  if(goog.dom.BrowserFeature.CAN_USE_PARENT_ELEMENT_PROPERTY) {
    return a.parentElement
  }
  a = a.parentNode;
  return goog.dom.isElement(a) ? a : null
};
goog.dom.contains = function(a, c) {
  if(a.contains && c.nodeType == goog.dom.NodeType.ELEMENT) {
    return a == c || a.contains(c)
  }
  if("undefined" != typeof a.compareDocumentPosition) {
    return a == c || Boolean(a.compareDocumentPosition(c) & 16)
  }
  for(;c && a != c;) {
    c = c.parentNode
  }
  return c == a
};
goog.dom.compareNodeOrder = function(a, c) {
  if(a == c) {
    return 0
  }
  if(a.compareDocumentPosition) {
    return a.compareDocumentPosition(c) & 2 ? 1 : -1
  }
  if((a.nodeType == goog.dom.NodeType.DOCUMENT || c.nodeType == goog.dom.NodeType.DOCUMENT) && goog.userAgent.IE && !goog.userAgent.isVersion(9)) {
    if(a.nodeType == goog.dom.NodeType.DOCUMENT) {
      return-1
    }
    if(c.nodeType == goog.dom.NodeType.DOCUMENT) {
      return 1
    }
  }
  if("sourceIndex" in a || a.parentNode && "sourceIndex" in a.parentNode) {
    var d = a.nodeType == goog.dom.NodeType.ELEMENT, e = c.nodeType == goog.dom.NodeType.ELEMENT;
    if(d && e) {
      return a.sourceIndex - c.sourceIndex
    }
    var f = a.parentNode, h = c.parentNode;
    return f == h ? goog.dom.compareSiblingOrder_(a, c) : !d && goog.dom.contains(f, c) ? -1 * goog.dom.compareParentsDescendantNodeIe_(a, c) : !e && goog.dom.contains(h, a) ? goog.dom.compareParentsDescendantNodeIe_(c, a) : (d ? a.sourceIndex : f.sourceIndex) - (e ? c.sourceIndex : h.sourceIndex)
  }
  e = goog.dom.getOwnerDocument(a);
  d = e.createRange();
  d.selectNode(a);
  d.collapse(!0);
  e = e.createRange();
  e.selectNode(c);
  e.collapse(!0);
  return d.compareBoundaryPoints(goog.global.Range.START_TO_END, e)
};
goog.dom.compareParentsDescendantNodeIe_ = function(a, c) {
  var d = a.parentNode;
  if(d == c) {
    return-1
  }
  for(var e = c;e.parentNode != d;) {
    e = e.parentNode
  }
  return goog.dom.compareSiblingOrder_(e, a)
};
goog.dom.compareSiblingOrder_ = function(a, c) {
  for(var d = c;d = d.previousSibling;) {
    if(d == a) {
      return-1
    }
  }
  return 1
};
goog.dom.findCommonAncestor = function(a) {
  var c, d = arguments.length;
  if(d) {
    if(1 == d) {
      return arguments[0]
    }
  }else {
    return null
  }
  var e = [], f = Infinity;
  for(c = 0;c < d;c++) {
    for(var h = [], i = arguments[c];i;) {
      h.unshift(i), i = i.parentNode
    }
    e.push(h);
    f = Math.min(f, h.length)
  }
  h = null;
  for(c = 0;c < f;c++) {
    for(var i = e[0][c], j = 1;j < d;j++) {
      if(i != e[j][c]) {
        return h
      }
    }
    h = i
  }
  return h
};
goog.dom.getOwnerDocument = function(a) {
  return a.nodeType == goog.dom.NodeType.DOCUMENT ? a : a.ownerDocument || a.document
};
goog.dom.getFrameContentDocument = function(a) {
  return a.contentDocument || a.contentWindow.document
};
goog.dom.getFrameContentWindow = function(a) {
  return a.contentWindow || goog.dom.getWindow_(goog.dom.getFrameContentDocument(a))
};
goog.dom.setTextContent = function(a, c) {
  if("textContent" in a) {
    a.textContent = c
  }else {
    if(a.firstChild && a.firstChild.nodeType == goog.dom.NodeType.TEXT) {
      for(;a.lastChild != a.firstChild;) {
        a.removeChild(a.lastChild)
      }
      a.firstChild.data = c
    }else {
      goog.dom.removeChildren(a);
      var d = goog.dom.getOwnerDocument(a);
      a.appendChild(d.createTextNode(c))
    }
  }
};
goog.dom.getOuterHtml = function(a) {
  if("outerHTML" in a) {
    return a.outerHTML
  }
  var c = goog.dom.getOwnerDocument(a).createElement("div");
  c.appendChild(a.cloneNode(!0));
  return c.innerHTML
};
goog.dom.findNode = function(a, c) {
  var d = [];
  return goog.dom.findNodes_(a, c, d, !0) ? d[0] : void 0
};
goog.dom.findNodes = function(a, c) {
  var d = [];
  goog.dom.findNodes_(a, c, d, !1);
  return d
};
goog.dom.findNodes_ = function(a, c, d, e) {
  if(null != a) {
    for(a = a.firstChild;a;) {
      if(c(a) && (d.push(a), e) || goog.dom.findNodes_(a, c, d, e)) {
        return!0
      }
      a = a.nextSibling
    }
  }
  return!1
};
goog.dom.TAGS_TO_IGNORE_ = {SCRIPT:1, STYLE:1, HEAD:1, IFRAME:1, OBJECT:1};
goog.dom.PREDEFINED_TAG_VALUES_ = {IMG:" ", BR:"\n"};
goog.dom.isFocusableTabIndex = function(a) {
  var c = a.getAttributeNode("tabindex");
  return c && c.specified ? (a = a.tabIndex, goog.isNumber(a) && 0 <= a && 32768 > a) : !1
};
goog.dom.setFocusableTabIndex = function(a, c) {
  c ? a.tabIndex = 0 : (a.tabIndex = -1, a.removeAttribute("tabIndex"))
};
goog.dom.getTextContent = function(a) {
  if(goog.dom.BrowserFeature.CAN_USE_INNER_TEXT && "innerText" in a) {
    a = goog.string.canonicalizeNewlines(a.innerText)
  }else {
    var c = [];
    goog.dom.getTextContent_(a, c, !0);
    a = c.join("")
  }
  a = a.replace(/ \xAD /g, " ").replace(/\xAD/g, "");
  a = a.replace(/\u200B/g, "");
  goog.dom.BrowserFeature.CAN_USE_INNER_TEXT || (a = a.replace(/ +/g, " "));
  " " != a && (a = a.replace(/^\s*/, ""));
  return a
};
goog.dom.getRawTextContent = function(a) {
  var c = [];
  goog.dom.getTextContent_(a, c, !1);
  return c.join("")
};
goog.dom.getTextContent_ = function(a, c, d) {
  if(!(a.nodeName in goog.dom.TAGS_TO_IGNORE_)) {
    if(a.nodeType == goog.dom.NodeType.TEXT) {
      d ? c.push(String(a.nodeValue).replace(/(\r\n|\r|\n)/g, "")) : c.push(a.nodeValue)
    }else {
      if(a.nodeName in goog.dom.PREDEFINED_TAG_VALUES_) {
        c.push(goog.dom.PREDEFINED_TAG_VALUES_[a.nodeName])
      }else {
        for(a = a.firstChild;a;) {
          goog.dom.getTextContent_(a, c, d), a = a.nextSibling
        }
      }
    }
  }
};
goog.dom.getNodeTextLength = function(a) {
  return goog.dom.getTextContent(a).length
};
goog.dom.getNodeTextOffset = function(a, c) {
  for(var d = c || goog.dom.getOwnerDocument(a).body, e = [];a && a != d;) {
    for(var f = a;f = f.previousSibling;) {
      e.unshift(goog.dom.getTextContent(f))
    }
    a = a.parentNode
  }
  return goog.string.trimLeft(e.join("")).replace(/ +/g, " ").length
};
goog.dom.getNodeAtOffset = function(a, c, d) {
  for(var a = [a], e = 0, f;0 < a.length && e < c;) {
    if(f = a.pop(), !(f.nodeName in goog.dom.TAGS_TO_IGNORE_)) {
      if(f.nodeType == goog.dom.NodeType.TEXT) {
        var h = f.nodeValue.replace(/(\r\n|\r|\n)/g, "").replace(/ +/g, " "), e = e + h.length
      }else {
        if(f.nodeName in goog.dom.PREDEFINED_TAG_VALUES_) {
          e += goog.dom.PREDEFINED_TAG_VALUES_[f.nodeName].length
        }else {
          for(h = f.childNodes.length - 1;0 <= h;h--) {
            a.push(f.childNodes[h])
          }
        }
      }
    }
  }
  goog.isObject(d) && (d.remainder = f ? f.nodeValue.length + c - e - 1 : 0, d.node = f);
  return f
};
goog.dom.isNodeList = function(a) {
  if(a && "number" == typeof a.length) {
    if(goog.isObject(a)) {
      return"function" == typeof a.item || "string" == typeof a.item
    }
    if(goog.isFunction(a)) {
      return"function" == typeof a.item
    }
  }
  return!1
};
goog.dom.getAncestorByTagNameAndClass = function(a, c, d) {
  if(!c && !d) {
    return null
  }
  var e = c ? c.toUpperCase() : null;
  return goog.dom.getAncestor(a, function(a) {
    return(!e || a.nodeName == e) && (!d || goog.dom.classes.has(a, d))
  }, !0)
};
goog.dom.getAncestorByClass = function(a, c) {
  return goog.dom.getAncestorByTagNameAndClass(a, null, c)
};
goog.dom.getAncestor = function(a, c, d, e) {
  d || (a = a.parentNode);
  for(var d = null == e, f = 0;a && (d || f <= e);) {
    if(c(a)) {
      return a
    }
    a = a.parentNode;
    f++
  }
  return null
};
goog.dom.getActiveElement = function(a) {
  try {
    return a && a.activeElement
  }catch(c) {
  }
  return null
};
goog.dom.DomHelper = function(a) {
  this.document_ = a || goog.global.document || document
};
goog.dom.DomHelper.prototype.getDomHelper = goog.dom.getDomHelper;
goog.dom.DomHelper.prototype.setDocument = function(a) {
  this.document_ = a
};
goog.dom.DomHelper.prototype.getDocument = function() {
  return this.document_
};
goog.dom.DomHelper.prototype.getElement = function(a) {
  return goog.isString(a) ? this.document_.getElementById(a) : a
};
goog.dom.DomHelper.prototype.$ = goog.dom.DomHelper.prototype.getElement;
goog.dom.DomHelper.prototype.getElementsByTagNameAndClass = function(a, c, d) {
  return goog.dom.getElementsByTagNameAndClass_(this.document_, a, c, d)
};
goog.dom.DomHelper.prototype.getElementsByClass = function(a, c) {
  return goog.dom.getElementsByClass(a, c || this.document_)
};
goog.dom.DomHelper.prototype.getElementByClass = function(a, c) {
  return goog.dom.getElementByClass(a, c || this.document_)
};
goog.dom.DomHelper.prototype.$$ = goog.dom.DomHelper.prototype.getElementsByTagNameAndClass;
goog.dom.DomHelper.prototype.setProperties = goog.dom.setProperties;
goog.dom.DomHelper.prototype.getViewportSize = function(a) {
  return goog.dom.getViewportSize(a || this.getWindow())
};
goog.dom.DomHelper.prototype.getDocumentHeight = function() {
  return goog.dom.getDocumentHeight_(this.getWindow())
};
goog.dom.DomHelper.prototype.createDom = function(a, c, d) {
  return goog.dom.createDom_(this.document_, arguments)
};
goog.dom.DomHelper.prototype.$dom = goog.dom.DomHelper.prototype.createDom;
goog.dom.DomHelper.prototype.createElement = function(a) {
  return this.document_.createElement(a)
};
goog.dom.DomHelper.prototype.createTextNode = function(a) {
  return this.document_.createTextNode(a)
};
goog.dom.DomHelper.prototype.createTable = function(a, c, d) {
  return goog.dom.createTable_(this.document_, a, c, !!d)
};
goog.dom.DomHelper.prototype.htmlToDocumentFragment = function(a) {
  return goog.dom.htmlToDocumentFragment_(this.document_, a)
};
goog.dom.DomHelper.prototype.getCompatMode = function() {
  return this.isCss1CompatMode() ? "CSS1Compat" : "BackCompat"
};
goog.dom.DomHelper.prototype.isCss1CompatMode = function() {
  return goog.dom.isCss1CompatMode_(this.document_)
};
goog.dom.DomHelper.prototype.getWindow = function() {
  return goog.dom.getWindow_(this.document_)
};
goog.dom.DomHelper.prototype.getDocumentScrollElement = function() {
  return goog.dom.getDocumentScrollElement_(this.document_)
};
goog.dom.DomHelper.prototype.getDocumentScroll = function() {
  return goog.dom.getDocumentScroll_(this.document_)
};
goog.dom.DomHelper.prototype.getActiveElement = function(a) {
  return goog.dom.getActiveElement(a || this.document_)
};
goog.dom.DomHelper.prototype.appendChild = goog.dom.appendChild;
goog.dom.DomHelper.prototype.append = goog.dom.append;
goog.dom.DomHelper.prototype.canHaveChildren = goog.dom.canHaveChildren;
goog.dom.DomHelper.prototype.removeChildren = goog.dom.removeChildren;
goog.dom.DomHelper.prototype.insertSiblingBefore = goog.dom.insertSiblingBefore;
goog.dom.DomHelper.prototype.insertSiblingAfter = goog.dom.insertSiblingAfter;
goog.dom.DomHelper.prototype.insertChildAt = goog.dom.insertChildAt;
goog.dom.DomHelper.prototype.removeNode = goog.dom.removeNode;
goog.dom.DomHelper.prototype.replaceNode = goog.dom.replaceNode;
goog.dom.DomHelper.prototype.flattenElement = goog.dom.flattenElement;
goog.dom.DomHelper.prototype.getChildren = goog.dom.getChildren;
goog.dom.DomHelper.prototype.getFirstElementChild = goog.dom.getFirstElementChild;
goog.dom.DomHelper.prototype.getLastElementChild = goog.dom.getLastElementChild;
goog.dom.DomHelper.prototype.getNextElementSibling = goog.dom.getNextElementSibling;
goog.dom.DomHelper.prototype.getPreviousElementSibling = goog.dom.getPreviousElementSibling;
goog.dom.DomHelper.prototype.getNextNode = goog.dom.getNextNode;
goog.dom.DomHelper.prototype.getPreviousNode = goog.dom.getPreviousNode;
goog.dom.DomHelper.prototype.isNodeLike = goog.dom.isNodeLike;
goog.dom.DomHelper.prototype.isElement = goog.dom.isElement;
goog.dom.DomHelper.prototype.isWindow = goog.dom.isWindow;
goog.dom.DomHelper.prototype.getParentElement = goog.dom.getParentElement;
goog.dom.DomHelper.prototype.contains = goog.dom.contains;
goog.dom.DomHelper.prototype.compareNodeOrder = goog.dom.compareNodeOrder;
goog.dom.DomHelper.prototype.findCommonAncestor = goog.dom.findCommonAncestor;
goog.dom.DomHelper.prototype.getOwnerDocument = goog.dom.getOwnerDocument;
goog.dom.DomHelper.prototype.getFrameContentDocument = goog.dom.getFrameContentDocument;
goog.dom.DomHelper.prototype.getFrameContentWindow = goog.dom.getFrameContentWindow;
goog.dom.DomHelper.prototype.setTextContent = goog.dom.setTextContent;
goog.dom.DomHelper.prototype.getOuterHtml = goog.dom.getOuterHtml;
goog.dom.DomHelper.prototype.findNode = goog.dom.findNode;
goog.dom.DomHelper.prototype.findNodes = goog.dom.findNodes;
goog.dom.DomHelper.prototype.isFocusableTabIndex = goog.dom.isFocusableTabIndex;
goog.dom.DomHelper.prototype.setFocusableTabIndex = goog.dom.setFocusableTabIndex;
goog.dom.DomHelper.prototype.getTextContent = goog.dom.getTextContent;
goog.dom.DomHelper.prototype.getNodeTextLength = goog.dom.getNodeTextLength;
goog.dom.DomHelper.prototype.getNodeTextOffset = goog.dom.getNodeTextOffset;
goog.dom.DomHelper.prototype.getNodeAtOffset = goog.dom.getNodeAtOffset;
goog.dom.DomHelper.prototype.isNodeList = goog.dom.isNodeList;
goog.dom.DomHelper.prototype.getAncestorByTagNameAndClass = goog.dom.getAncestorByTagNameAndClass;
goog.dom.DomHelper.prototype.getAncestorByClass = goog.dom.getAncestorByClass;
goog.dom.DomHelper.prototype.getAncestor = goog.dom.getAncestor;
goog.functions = {};
goog.functions.constant = function(a) {
  return function() {
    return a
  }
};
goog.functions.FALSE = goog.functions.constant(!1);
goog.functions.TRUE = goog.functions.constant(!0);
goog.functions.NULL = goog.functions.constant(null);
goog.functions.identity = function(a) {
  return a
};
goog.functions.error = function(a) {
  return function() {
    throw Error(a);
  }
};
goog.functions.lock = function(a, c) {
  c = c || 0;
  return function() {
    return a.apply(this, Array.prototype.slice.call(arguments, 0, c))
  }
};
goog.functions.withReturnValue = function(a, c) {
  return goog.functions.sequence(a, goog.functions.constant(c))
};
goog.functions.compose = function(a) {
  var c = arguments, d = c.length;
  return function() {
    var a;
    d && (a = c[d - 1].apply(this, arguments));
    for(var f = d - 2;0 <= f;f--) {
      a = c[f].call(this, a)
    }
    return a
  }
};
goog.functions.sequence = function(a) {
  var c = arguments, d = c.length;
  return function() {
    for(var a, f = 0;f < d;f++) {
      a = c[f].apply(this, arguments)
    }
    return a
  }
};
goog.functions.and = function(a) {
  var c = arguments, d = c.length;
  return function() {
    for(var a = 0;a < d;a++) {
      if(!c[a].apply(this, arguments)) {
        return!1
      }
    }
    return!0
  }
};
goog.functions.or = function(a) {
  var c = arguments, d = c.length;
  return function() {
    for(var a = 0;a < d;a++) {
      if(c[a].apply(this, arguments)) {
        return!0
      }
    }
    return!1
  }
};
goog.functions.not = function(a) {
  return function() {
    return!a.apply(this, arguments)
  }
};
goog.functions.create = function(a, c) {
  var d = function() {
  };
  d.prototype = a.prototype;
  d = new d;
  a.apply(d, Array.prototype.slice.call(arguments, 1));
  return d
};
/*
 Portions of this code are from the Dojo Toolkit, received by
 The Closure Library Authors under the BSD license. All other code is
 Copyright 2005-2009 The Closure Library Authors. All Rights Reserved.

The "New" BSD License:

Copyright (c) 2005-2009, The Dojo Foundation
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

 Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
 Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation
    and/or other materials provided with the distribution.
 Neither the name of the Dojo Foundation nor the names of its contributors
    may be used to endorse or promote products derived from this software
    without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED.  IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
goog.dom.query = function() {
  function a(a, c) {
    var d = c || [];
    a && d.push(a);
    return d
  }
  var c = goog.userAgent.WEBKIT && "BackCompat" == goog.dom.getDocument().compatMode, d = goog.dom.getDocument().firstChild.children ? "children" : "childNodes", e = !1, f = function(a) {
    for(var a = 0 <= ">~+".indexOf(a.slice(-1)) ? a + " * " : a + " ", c = function(c, d) {
      return goog.string.trim(a.slice(c, d))
    }, d = [], f = -1, h = -1, i = -1, j = -1, k = -1, l = -1, p = -1, w = "", u = "", C, s = 0, q = a.length, n = null, m = null, t = function() {
      0 <= l && (n.id = c(l, s).replace(/\\/g, ""), l = -1);
      if(0 <= p) {
        var a = p == s ? null : c(p, s);
        0 > ">~+".indexOf(a) ? n.tag = a : n.oper = a;
        p = -1
      }
      0 <= k && (n.classes.push(c(k + 1, s).replace(/\\/g, "")), k = -1)
    };w = u, u = a.charAt(s), s < q;s++) {
      if("\\" != w) {
        if(n || (C = s, n = {query:null, pseudos:[], attrs:[], classes:[], tag:null, oper:null, id:null, getTag:function() {
          return e ? this.otag : this.tag
        }}, p = s), 0 <= f) {
          if("]" == u) {
            m.attr ? m.matchFor = c(i || f + 1, s) : m.attr = c(f + 1, s);
            if((f = m.matchFor) && ('"' == f.charAt(0) || "'" == f.charAt(0))) {
              m.matchFor = f.slice(1, -1)
            }
            n.attrs.push(m);
            m = null;
            f = i = -1
          }else {
            "=" == u && (i = 0 <= "|~^$*".indexOf(w) ? w : "", m.type = i + u, m.attr = c(f + 1, s - i.length), i = s + 1)
          }
        }else {
          0 <= h ? ")" == u && (0 <= j && (m.value = c(h + 1, s)), j = h = -1) : "#" == u ? (t(), l = s + 1) : "." == u ? (t(), k = s) : ":" == u ? (t(), j = s) : "[" == u ? (t(), f = s, m = {}) : "(" == u ? (0 <= j && (m = {name:c(j + 1, s), value:null}, n.pseudos.push(m)), h = s) : " " == u && w != u && (t(), 0 <= j && n.pseudos.push({name:c(j + 1, s)}), n.loops = n.pseudos.length || n.attrs.length || n.classes.length, n.oquery = n.query = c(C, s), n.otag = n.tag = n.oper ? null : n.tag || "*", 
          n.tag && (n.tag = n.tag.toUpperCase()), d.length && d[d.length - 1].oper && (n.infixOper = d.pop(), n.query = n.infixOper.query + " " + n.query), d.push(n), n = null)
        }
      }
    }
    return d
  }, h = function(a, c) {
    return!a ? c : !c ? a : function() {
      return a.apply(window, arguments) && c.apply(window, arguments)
    }
  }, i = function(a) {
    return 1 == a.nodeType
  }, j = function(a, c) {
    return!a ? "" : "class" == c ? a.className || "" : "for" == c ? a.htmlFor || "" : "style" == c ? a.style.cssText || "" : (e ? a.getAttribute(c) : a.getAttribute(c, 2)) || ""
  }, k = {"*=":function(a, c) {
    return function(d) {
      return 0 <= j(d, a).indexOf(c)
    }
  }, "^=":function(a, c) {
    return function(d) {
      return 0 == j(d, a).indexOf(c)
    }
  }, "$=":function(a, c) {
    return function(d) {
      d = " " + j(d, a);
      return d.lastIndexOf(c) == d.length - c.length
    }
  }, "~=":function(a, c) {
    var d = " " + c + " ";
    return function(c) {
      return 0 <= (" " + j(c, a) + " ").indexOf(d)
    }
  }, "|=":function(a, c) {
    c = " " + c;
    return function(d) {
      d = " " + j(d, a);
      return d == c || 0 == d.indexOf(c + "-")
    }
  }, "=":function(a, c) {
    return function(d) {
      return j(d, a) == c
    }
  }}, l = "undefined" == typeof goog.dom.getDocument().firstChild.nextElementSibling, p = !l ? "nextElementSibling" : "nextSibling", m = !l ? "previousElementSibling" : "previousSibling", q = l ? i : goog.functions.TRUE, x = function(a) {
    for(;a = a[m];) {
      if(q(a)) {
        return!1
      }
    }
    return!0
  }, D = function(a) {
    for(;a = a[p];) {
      if(q(a)) {
        return!1
      }
    }
    return!0
  }, y = function(a) {
    var c = a.parentNode, e = 0, f = c[d], h = a._i || -1, i = c._l || -1;
    if(!f) {
      return-1
    }
    f = f.length;
    if(i == f && 0 <= h && 0 <= i) {
      return h
    }
    c._l = f;
    h = -1;
    for(c = c.firstElementChild || c.firstChild;c;c = c[p]) {
      q(c) && (c._i = ++e, a === c && (h = e))
    }
    return h
  }, O = function(a) {
    return!(y(a) % 2)
  }, P = function(a) {
    return y(a) % 2
  }, A = {checked:function() {
    return function(a) {
      return a.checked || a.attributes.checked
    }
  }, "first-child":function() {
    return x
  }, "last-child":function() {
    return D
  }, "only-child":function() {
    return function(a) {
      return!x(a) || !D(a) ? !1 : !0
    }
  }, empty:function() {
    return function(a) {
      for(var c = a.childNodes, a = a.childNodes.length - 1;0 <= a;a--) {
        var d = c[a].nodeType;
        if(1 === d || 3 == d) {
          return!1
        }
      }
      return!0
    }
  }, contains:function(a, c) {
    var d = c.charAt(0);
    if('"' == d || "'" == d) {
      c = c.slice(1, -1)
    }
    return function(a) {
      return 0 <= a.innerHTML.indexOf(c)
    }
  }, not:function(a, c) {
    var d = f(c)[0], e = {el:1};
    "*" != d.tag && (e.tag = 1);
    d.classes.length || (e.classes = 1);
    var h = v(d, e);
    return function(a) {
      return!h(a)
    }
  }, "nth-child":function(a, c) {
    if("odd" == c) {
      return P
    }
    if("even" == c) {
      return O
    }
    if(-1 != c.indexOf("n")) {
      var d = c.split("n", 2), e = d[0] ? "-" == d[0] ? -1 : parseInt(d[0], 10) : 1, f = d[1] ? parseInt(d[1], 10) : 0, h = 0, i = -1;
      0 < e ? 0 > f ? f = f % e && e + f % e : 0 < f && (f >= e && (h = f - f % e), f %= e) : 0 > e && (e *= -1, 0 < f && (i = f, f %= e));
      if(0 < e) {
        return function(a) {
          a = y(a);
          return a >= h && (0 > i || a <= i) && a % e == f
        }
      }
      c = f
    }
    var j = parseInt(c, 10);
    return function(a) {
      return y(a) == j
    }
  }}, Q = goog.userAgent.IE ? function(a) {
    var c = a.toLowerCase();
    "class" == c && (a = "className");
    return function(d) {
      return e ? d.getAttribute(a) : d[a] || d[c]
    }
  } : function(a) {
    return function(c) {
      return c && c.getAttribute && c.hasAttribute(a)
    }
  }, v = function(a, c) {
    if(!a) {
      return goog.functions.TRUE
    }
    var c = c || {}, d = null;
    c.el || (d = h(d, i));
    c.tag || "*" != a.tag && (d = h(d, function(c) {
      return c && c.tagName == a.getTag()
    }));
    c.classes || goog.array.forEach(a.classes, function(a, c) {
      var e = RegExp("(?:^|\\s)" + a + "(?:\\s|$)");
      d = h(d, function(a) {
        return e.test(a.className)
      });
      d.count = c
    });
    c.pseudos || goog.array.forEach(a.pseudos, function(a) {
      var c = a.name;
      A[c] && (d = h(d, A[c](c, a.value)))
    });
    c.attrs || goog.array.forEach(a.attrs, function(a) {
      var c, e = a.attr;
      a.type && k[a.type] ? c = k[a.type](e, a.matchFor) : e.length && (c = Q(e));
      c && (d = h(d, c))
    });
    c.id || a.id && (d = h(d, function(c) {
      return!!c && c.id == a.id
    }));
    !d && !("default" in c) && (d = goog.functions.TRUE);
    return d
  }, E = {}, F = function(e) {
    var f = E[e.query];
    if(f) {
      return f
    }
    var h = e.infixOper, h = h ? h.oper : "", j = v(e, {el:1}), k = "*" == e.tag, m = goog.dom.getDocument().getElementsByClassName;
    if(h) {
      if(m = {el:1}, k && (m.tag = 1), j = v(e, m), "+" == h) {
        var t = j, f = function(a, c, d) {
          for(;a = a[p];) {
            if(!l || i(a)) {
              (!d || B(a, d)) && t(a) && c.push(a);
              break
            }
          }
          return c
        }
      }else {
        if("~" == h) {
          var M = j, f = function(a, c, d) {
            for(a = a[p];a;) {
              if(q(a)) {
                if(d && !B(a, d)) {
                  break
                }
                M(a) && c.push(a)
              }
              a = a[p]
            }
            return c
          }
        }else {
          if(">" == h) {
            var z = j, z = z || goog.functions.TRUE, f = function(a, c, e) {
              for(var f = 0, h = a[d];a = h[f++];) {
                q(a) && ((!e || B(a, e)) && z(a, f)) && c.push(a)
              }
              return c
            }
          }
        }
      }
    }else {
      if(e.id) {
        j = !e.loops && k ? goog.functions.TRUE : v(e, {el:1, id:1}), f = function(c, d) {
          var f = goog.dom.getDomHelper(c).getElement(e.id);
          if(f && j(f)) {
            if(9 == c.nodeType) {
              return a(f, d)
            }
            for(var h = f.parentNode;h && h != c;) {
              h = h.parentNode
            }
            if(h) {
              return a(f, d)
            }
          }
        }
      }else {
        if(m && /\{\s*\[native code\]\s*\}/.test(String(m)) && e.classes.length && !c) {
          var j = v(e, {el:1, classes:1, id:1}), N = e.classes.join(" "), f = function(c, d) {
            for(var e = a(0, d), f, h = 0, i = c.getElementsByClassName(N);f = i[h++];) {
              j(f, c) && e.push(f)
            }
            return e
          }
        }else {
          !k && !e.loops ? f = function(c, d) {
            for(var f = a(0, d), h, i = 0, j = c.getElementsByTagName(e.getTag());h = j[i++];) {
              f.push(h)
            }
            return f
          } : (j = v(e, {el:1, tag:1, id:1}), f = function(c, d) {
            for(var f = a(0, d), h, i = 0, k = c.getElementsByTagName(e.getTag());h = k[i++];) {
              j(h, c) && f.push(h)
            }
            return f
          })
        }
      }
    }
    return E[e.query] = f
  }, G = {}, H = {}, I = function(c) {
    var d = f(goog.string.trim(c));
    if(1 == d.length) {
      var e = F(d[0]);
      return function(a) {
        if(a = e(a, [])) {
          a.nozip = !0
        }
        return a
      }
    }
    return function(c) {
      for(var c = a(c), e, f, h = d.length, i, j, k = 0;k < h;k++) {
        j = [];
        e = d[k];
        f = c.length - 1;
        0 < f && (i = {}, j.nozip = !0);
        f = F(e);
        for(var l = 0;e = c[l];l++) {
          f(e, j, i)
        }
        if(!j.length) {
          break
        }
        c = j
      }
      return j
    }
  }, J = !!goog.dom.getDocument().querySelectorAll && (!goog.userAgent.WEBKIT || goog.userAgent.isVersion("526")), K = function(a, d) {
    if(J) {
      var e = H[a];
      if(e && !d) {
        return e
      }
    }
    if(e = G[a]) {
      return e
    }
    var e = a.charAt(0), f = -1 == a.indexOf(" ");
    0 <= a.indexOf("#") && f && (d = !0);
    if(J && !d && -1 == ">~+".indexOf(e) && (!goog.userAgent.IE || -1 == a.indexOf(":")) && !(c && 0 <= a.indexOf(".")) && -1 == a.indexOf(":contains") && -1 == a.indexOf("|=")) {
      var h = 0 <= ">~+".indexOf(a.charAt(a.length - 1)) ? a + " *" : a;
      return H[a] = function(c) {
        try {
          if(!(9 == c.nodeType || f)) {
            throw"";
          }
          var d = c.querySelectorAll(h);
          goog.userAgent.IE ? d.commentStrip = !0 : d.nozip = !0;
          return d
        }catch(e) {
          return K(a, !0)(c)
        }
      }
    }
    var i = a.split(/\s*,\s*/);
    return G[a] = 2 > i.length ? I(a) : function(a) {
      for(var c = 0, d = [], e;e = i[c++];) {
        d = d.concat(I(e)(a))
      }
      return d
    }
  }, t = 0, R = goog.userAgent.IE ? function(a) {
    return e ? a.getAttribute("_uid") || a.setAttribute("_uid", ++t) || t : a.uniqueID
  } : function(a) {
    return a._uid || (a._uid = ++t)
  }, B = function(a, c) {
    if(!c) {
      return 1
    }
    var d = R(a);
    return!c[d] ? c[d] = 1 : 0
  }, S = function(a) {
    if(a && a.nozip) {
      return a
    }
    var c = [];
    if(!a || !a.length) {
      return c
    }
    a[0] && c.push(a[0]);
    if(2 > a.length) {
      return c
    }
    t++;
    if(goog.userAgent.IE && e) {
      var d = t + "";
      a[0].setAttribute("_zipIdx", d);
      for(var f = 1, h;h = a[f];f++) {
        a[f].getAttribute("_zipIdx") != d && c.push(h), h.setAttribute("_zipIdx", d)
      }
    }else {
      if(goog.userAgent.IE && a.commentStrip) {
        try {
          for(f = 1;h = a[f];f++) {
            i(h) && c.push(h)
          }
        }catch(j) {
        }
      }else {
        a[0] && (a[0]._zipIdx = t);
        for(f = 1;h = a[f];f++) {
          a[f]._zipIdx != t && c.push(h), h._zipIdx = t
        }
      }
    }
    return c
  }, L = function(a, c) {
    if(!a) {
      return[]
    }
    if(a.constructor == Array) {
      return a
    }
    if(!goog.isString(a)) {
      return[a]
    }
    if(goog.isString(c) && (c = goog.dom.getElement(c), !c)) {
      return[]
    }
    var c = c || goog.dom.getDocument(), d = c.ownerDocument || c.documentElement;
    e = c.contentType && "application/xml" == c.contentType || goog.userAgent.OPERA && (c.doctype || "[object XMLDocument]" == d.toString()) || !!d && (goog.userAgent.IE ? d.xml : c.xmlVersion || d.xmlVersion);
    return(d = K(a)(c)) && d.nozip ? d : S(d)
  };
  L.pseudos = A;
  return L
}();
goog.exportSymbol("goog.dom.query", goog.dom.query);
goog.exportSymbol("goog.dom.query.pseudos", goog.dom.query.pseudos);
goog.debug.entryPointRegistry = {};
goog.debug.EntryPointMonitor = function() {
};
goog.debug.entryPointRegistry.refList_ = [];
goog.debug.entryPointRegistry.monitors_ = [];
goog.debug.entryPointRegistry.monitorsMayExist_ = !1;
goog.debug.entryPointRegistry.register = function(a) {
  goog.debug.entryPointRegistry.refList_[goog.debug.entryPointRegistry.refList_.length] = a;
  if(goog.debug.entryPointRegistry.monitorsMayExist_) {
    for(var c = goog.debug.entryPointRegistry.monitors_, d = 0;d < c.length;d++) {
      a(goog.bind(c[d].wrap, c[d]))
    }
  }
};
goog.debug.entryPointRegistry.monitorAll = function(a) {
  goog.debug.entryPointRegistry.monitorsMayExist_ = !0;
  for(var c = goog.bind(a.wrap, a), d = 0;d < goog.debug.entryPointRegistry.refList_.length;d++) {
    goog.debug.entryPointRegistry.refList_[d](c)
  }
  goog.debug.entryPointRegistry.monitors_.push(a)
};
goog.debug.entryPointRegistry.unmonitorAllIfPossible = function(a) {
  var c = goog.debug.entryPointRegistry.monitors_;
  goog.asserts.assert(a == c[c.length - 1], "Only the most recent monitor can be unwrapped.");
  for(var a = goog.bind(a.unwrap, a), d = 0;d < goog.debug.entryPointRegistry.refList_.length;d++) {
    goog.debug.entryPointRegistry.refList_[d](a)
  }
  c.length--
};
goog.debug.errorHandlerWeakDep = {protectEntryPoint:function(a) {
  return a
}};
goog.events = {};
goog.events.BrowserFeature = {HAS_W3C_BUTTON:!goog.userAgent.IE || goog.userAgent.isDocumentMode(9), HAS_W3C_EVENT_SUPPORT:!goog.userAgent.IE || goog.userAgent.isDocumentMode(9), SET_KEY_CODE_TO_PREVENT_DEFAULT:goog.userAgent.IE && !goog.userAgent.isVersion("9"), HAS_NAVIGATOR_ONLINE_PROPERTY:!goog.userAgent.WEBKIT || goog.userAgent.isVersion("528"), HAS_HTML5_NETWORK_EVENT_SUPPORT:goog.userAgent.GECKO && goog.userAgent.isVersion("1.9b") || goog.userAgent.IE && goog.userAgent.isVersion("8") || goog.userAgent.OPERA && 
goog.userAgent.isVersion("9.5") || goog.userAgent.WEBKIT && goog.userAgent.isVersion("528"), HTML5_NETWORK_EVENTS_FIRE_ON_BODY:goog.userAgent.GECKO && !goog.userAgent.isVersion("8") || goog.userAgent.IE && !goog.userAgent.isVersion("9")};
goog.disposable = {};
goog.disposable.IDisposable = function() {
};
goog.Disposable = function() {
  goog.Disposable.MONITORING_MODE != goog.Disposable.MonitoringMode.OFF && (this.creationStack = Error().stack, goog.Disposable.instances_[goog.getUid(this)] = this)
};
goog.Disposable.MonitoringMode = {OFF:0, PERMANENT:1, INTERACTIVE:2};
goog.Disposable.MONITORING_MODE = 0;
goog.Disposable.instances_ = {};
goog.Disposable.getUndisposedObjects = function() {
  var a = [], c;
  for(c in goog.Disposable.instances_) {
    goog.Disposable.instances_.hasOwnProperty(c) && a.push(goog.Disposable.instances_[Number(c)])
  }
  return a
};
goog.Disposable.clearUndisposedObjects = function() {
  goog.Disposable.instances_ = {}
};
goog.Disposable.prototype.disposed_ = !1;
goog.Disposable.prototype.isDisposed = function() {
  return this.disposed_
};
goog.Disposable.prototype.getDisposed = goog.Disposable.prototype.isDisposed;
goog.Disposable.prototype.dispose = function() {
  if(!this.disposed_ && (this.disposed_ = !0, this.disposeInternal(), goog.Disposable.MONITORING_MODE != goog.Disposable.MonitoringMode.OFF)) {
    var a = goog.getUid(this);
    if(goog.Disposable.MONITORING_MODE == goog.Disposable.MonitoringMode.PERMANENT && !goog.Disposable.instances_.hasOwnProperty(a)) {
      throw Error(this + " did not call the goog.Disposable base constructor or was disposed of after a clearUndisposedObjects call");
    }
    delete goog.Disposable.instances_[a]
  }
};
goog.Disposable.prototype.registerDisposable = function(a) {
  this.dependentDisposables_ || (this.dependentDisposables_ = []);
  this.dependentDisposables_.push(a)
};
goog.Disposable.prototype.addOnDisposeCallback = function(a, c) {
  this.onDisposeCallbacks_ || (this.onDisposeCallbacks_ = []);
  this.onDisposeCallbacks_.push(goog.bind(a, c))
};
goog.Disposable.prototype.disposeInternal = function() {
  this.dependentDisposables_ && goog.disposeAll.apply(null, this.dependentDisposables_);
  if(this.onDisposeCallbacks_) {
    for(;this.onDisposeCallbacks_.length;) {
      this.onDisposeCallbacks_.shift()()
    }
  }
};
goog.Disposable.isDisposed = function(a) {
  return a && "function" == typeof a.isDisposed ? a.isDisposed() : !1
};
goog.dispose = function(a) {
  a && "function" == typeof a.dispose && a.dispose()
};
goog.disposeAll = function(a) {
  for(var c = 0, d = arguments.length;c < d;++c) {
    var e = arguments[c];
    goog.isArrayLike(e) ? goog.disposeAll.apply(null, e) : goog.dispose(e)
  }
};
goog.events.Event = function(a, c) {
  this.type = a;
  this.currentTarget = this.target = c
};
goog.events.Event.prototype.disposeInternal = function() {
};
goog.events.Event.prototype.dispose = function() {
};
goog.events.Event.prototype.propagationStopped_ = !1;
goog.events.Event.prototype.defaultPrevented = !1;
goog.events.Event.prototype.returnValue_ = !0;
goog.events.Event.prototype.stopPropagation = function() {
  this.propagationStopped_ = !0
};
goog.events.Event.prototype.preventDefault = function() {
  this.defaultPrevented = !0;
  this.returnValue_ = !1
};
goog.events.Event.stopPropagation = function(a) {
  a.stopPropagation()
};
goog.events.Event.preventDefault = function(a) {
  a.preventDefault()
};
goog.events.EventType = {CLICK:"click", DBLCLICK:"dblclick", MOUSEDOWN:"mousedown", MOUSEUP:"mouseup", MOUSEOVER:"mouseover", MOUSEOUT:"mouseout", MOUSEMOVE:"mousemove", SELECTSTART:"selectstart", KEYPRESS:"keypress", KEYDOWN:"keydown", KEYUP:"keyup", BLUR:"blur", FOCUS:"focus", DEACTIVATE:"deactivate", FOCUSIN:goog.userAgent.IE ? "focusin" : "DOMFocusIn", FOCUSOUT:goog.userAgent.IE ? "focusout" : "DOMFocusOut", CHANGE:"change", SELECT:"select", SUBMIT:"submit", INPUT:"input", PROPERTYCHANGE:"propertychange", 
DRAGSTART:"dragstart", DRAGENTER:"dragenter", DRAGOVER:"dragover", DRAGLEAVE:"dragleave", DROP:"drop", TOUCHSTART:"touchstart", TOUCHMOVE:"touchmove", TOUCHEND:"touchend", TOUCHCANCEL:"touchcancel", CONTEXTMENU:"contextmenu", ERROR:"error", HELP:"help", LOAD:"load", LOSECAPTURE:"losecapture", READYSTATECHANGE:"readystatechange", RESIZE:"resize", SCROLL:"scroll", UNLOAD:"unload", HASHCHANGE:"hashchange", PAGEHIDE:"pagehide", PAGESHOW:"pageshow", POPSTATE:"popstate", COPY:"copy", PASTE:"paste", CUT:"cut", 
BEFORECOPY:"beforecopy", BEFORECUT:"beforecut", BEFOREPASTE:"beforepaste", ONLINE:"online", OFFLINE:"offline", MESSAGE:"message", CONNECT:"connect", TRANSITIONEND:goog.userAgent.WEBKIT ? "webkitTransitionEnd" : goog.userAgent.OPERA ? "oTransitionEnd" : "transitionend"};
goog.reflect = {};
goog.reflect.object = function(a, c) {
  return c
};
goog.reflect.sinkValue = function(a) {
  goog.reflect.sinkValue[" "](a);
  return a
};
goog.reflect.sinkValue[" "] = goog.nullFunction;
goog.reflect.canAccessProperty = function(a, c) {
  try {
    return goog.reflect.sinkValue(a[c]), !0
  }catch(d) {
  }
  return!1
};
goog.events.BrowserEvent = function(a, c) {
  a && this.init(a, c)
};
goog.inherits(goog.events.BrowserEvent, goog.events.Event);
goog.events.BrowserEvent.MouseButton = {LEFT:0, MIDDLE:1, RIGHT:2};
goog.events.BrowserEvent.IEButtonMap = [1, 4, 2];
goog.events.BrowserEvent.prototype.target = null;
goog.events.BrowserEvent.prototype.relatedTarget = null;
goog.events.BrowserEvent.prototype.offsetX = 0;
goog.events.BrowserEvent.prototype.offsetY = 0;
goog.events.BrowserEvent.prototype.clientX = 0;
goog.events.BrowserEvent.prototype.clientY = 0;
goog.events.BrowserEvent.prototype.screenX = 0;
goog.events.BrowserEvent.prototype.screenY = 0;
goog.events.BrowserEvent.prototype.button = 0;
goog.events.BrowserEvent.prototype.keyCode = 0;
goog.events.BrowserEvent.prototype.charCode = 0;
goog.events.BrowserEvent.prototype.ctrlKey = !1;
goog.events.BrowserEvent.prototype.altKey = !1;
goog.events.BrowserEvent.prototype.shiftKey = !1;
goog.events.BrowserEvent.prototype.metaKey = !1;
goog.events.BrowserEvent.prototype.platformModifierKey = !1;
goog.events.BrowserEvent.prototype.event_ = null;
goog.events.BrowserEvent.prototype.init = function(a, c) {
  var d = this.type = a.type;
  goog.events.Event.call(this, d);
  this.target = a.target || a.srcElement;
  this.currentTarget = c;
  var e = a.relatedTarget;
  e ? goog.userAgent.GECKO && (goog.reflect.canAccessProperty(e, "nodeName") || (e = null)) : d == goog.events.EventType.MOUSEOVER ? e = a.fromElement : d == goog.events.EventType.MOUSEOUT && (e = a.toElement);
  this.relatedTarget = e;
  this.offsetX = goog.userAgent.WEBKIT || void 0 !== a.offsetX ? a.offsetX : a.layerX;
  this.offsetY = goog.userAgent.WEBKIT || void 0 !== a.offsetY ? a.offsetY : a.layerY;
  this.clientX = void 0 !== a.clientX ? a.clientX : a.pageX;
  this.clientY = void 0 !== a.clientY ? a.clientY : a.pageY;
  this.screenX = a.screenX || 0;
  this.screenY = a.screenY || 0;
  this.button = a.button;
  this.keyCode = a.keyCode || 0;
  this.charCode = a.charCode || ("keypress" == d ? a.keyCode : 0);
  this.ctrlKey = a.ctrlKey;
  this.altKey = a.altKey;
  this.shiftKey = a.shiftKey;
  this.metaKey = a.metaKey;
  this.platformModifierKey = goog.userAgent.MAC ? a.metaKey : a.ctrlKey;
  this.state = a.state;
  this.event_ = a;
  a.defaultPrevented && this.preventDefault();
  delete this.propagationStopped_
};
goog.events.BrowserEvent.prototype.isButton = function(a) {
  return goog.events.BrowserFeature.HAS_W3C_BUTTON ? this.event_.button == a : "click" == this.type ? a == goog.events.BrowserEvent.MouseButton.LEFT : !!(this.event_.button & goog.events.BrowserEvent.IEButtonMap[a])
};
goog.events.BrowserEvent.prototype.isMouseActionButton = function() {
  return this.isButton(goog.events.BrowserEvent.MouseButton.LEFT) && !(goog.userAgent.WEBKIT && goog.userAgent.MAC && this.ctrlKey)
};
goog.events.BrowserEvent.prototype.stopPropagation = function() {
  goog.events.BrowserEvent.superClass_.stopPropagation.call(this);
  this.event_.stopPropagation ? this.event_.stopPropagation() : this.event_.cancelBubble = !0
};
goog.events.BrowserEvent.prototype.preventDefault = function() {
  goog.events.BrowserEvent.superClass_.preventDefault.call(this);
  var a = this.event_;
  if(a.preventDefault) {
    a.preventDefault()
  }else {
    if(a.returnValue = !1, goog.events.BrowserFeature.SET_KEY_CODE_TO_PREVENT_DEFAULT) {
      try {
        if(a.ctrlKey || 112 <= a.keyCode && 123 >= a.keyCode) {
          a.keyCode = -1
        }
      }catch(c) {
      }
    }
  }
};
goog.events.BrowserEvent.prototype.getBrowserEvent = function() {
  return this.event_
};
goog.events.BrowserEvent.prototype.disposeInternal = function() {
};
goog.events.EventWrapper = function() {
};
goog.events.EventWrapper.prototype.listen = function() {
};
goog.events.EventWrapper.prototype.unlisten = function() {
};
goog.events.Listener = function() {
  goog.events.Listener.ENABLE_MONITORING && (this.creationStack = Error().stack)
};
goog.events.Listener.counter_ = 0;
goog.events.Listener.ENABLE_MONITORING = !1;
goog.events.Listener.prototype.key = 0;
goog.events.Listener.prototype.removed = !1;
goog.events.Listener.prototype.callOnce = !1;
goog.events.Listener.prototype.init = function(a, c, d, e, f, h) {
  if(goog.isFunction(a)) {
    this.isFunctionListener_ = !0
  }else {
    if(a && a.handleEvent && goog.isFunction(a.handleEvent)) {
      this.isFunctionListener_ = !1
    }else {
      throw Error("Invalid listener argument");
    }
  }
  this.listener = a;
  this.proxy = c;
  this.src = d;
  this.type = e;
  this.capture = !!f;
  this.handler = h;
  this.callOnce = !1;
  this.key = ++goog.events.Listener.counter_;
  this.removed = !1
};
goog.events.Listener.prototype.handleEvent = function(a) {
  return this.isFunctionListener_ ? this.listener.call(this.handler || this.src, a) : this.listener.handleEvent.call(this.listener, a)
};
goog.events.listeners_ = {};
goog.events.listenerTree_ = {};
goog.events.sources_ = {};
goog.events.onString_ = "on";
goog.events.onStringMap_ = {};
goog.events.keySeparator_ = "_";
goog.events.listen = function(a, c, d, e, f) {
  if(c) {
    if(goog.isArray(c)) {
      for(var h = 0;h < c.length;h++) {
        goog.events.listen(a, c[h], d, e, f)
      }
      return null
    }
    var e = !!e, i = goog.events.listenerTree_;
    c in i || (i[c] = {count_:0, remaining_:0});
    i = i[c];
    e in i || (i[e] = {count_:0, remaining_:0}, i.count_++);
    var i = i[e], j = goog.getUid(a), k;
    i.remaining_++;
    if(i[j]) {
      k = i[j];
      for(h = 0;h < k.length;h++) {
        if(i = k[h], i.listener == d && i.handler == f) {
          if(i.removed) {
            break
          }
          return k[h].key
        }
      }
    }else {
      k = i[j] = [], i.count_++
    }
    h = goog.events.getProxy();
    h.src = a;
    i = new goog.events.Listener;
    i.init(d, h, a, c, e, f);
    d = i.key;
    h.key = d;
    k.push(i);
    goog.events.listeners_[d] = i;
    goog.events.sources_[j] || (goog.events.sources_[j] = []);
    goog.events.sources_[j].push(i);
    a.addEventListener ? (a == goog.global || !a.customEvent_) && a.addEventListener(c, h, e) : a.attachEvent(goog.events.getOnString_(c), h);
    return d
  }
  throw Error("Invalid event type");
};
goog.events.getProxy = function() {
  var a = goog.events.handleBrowserEvent_, c = goog.events.BrowserFeature.HAS_W3C_EVENT_SUPPORT ? function(d) {
    return a.call(c.src, c.key, d)
  } : function(d) {
    d = a.call(c.src, c.key, d);
    if(!d) {
      return d
    }
  };
  return c
};
goog.events.listenOnce = function(a, c, d, e, f) {
  if(goog.isArray(c)) {
    for(var h = 0;h < c.length;h++) {
      goog.events.listenOnce(a, c[h], d, e, f)
    }
    return null
  }
  a = goog.events.listen(a, c, d, e, f);
  goog.events.listeners_[a].callOnce = !0;
  return a
};
goog.events.listenWithWrapper = function(a, c, d, e, f) {
  c.listen(a, d, e, f)
};
goog.events.unlisten = function(a, c, d, e, f) {
  if(goog.isArray(c)) {
    for(var h = 0;h < c.length;h++) {
      goog.events.unlisten(a, c[h], d, e, f)
    }
    return null
  }
  e = !!e;
  a = goog.events.getListeners_(a, c, e);
  if(!a) {
    return!1
  }
  for(h = 0;h < a.length;h++) {
    if(a[h].listener == d && a[h].capture == e && a[h].handler == f) {
      return goog.events.unlistenByKey(a[h].key)
    }
  }
  return!1
};
goog.events.unlistenByKey = function(a) {
  if(!goog.events.listeners_[a]) {
    return!1
  }
  var c = goog.events.listeners_[a];
  if(c.removed) {
    return!1
  }
  var d = c.src, e = c.type, f = c.proxy, h = c.capture;
  d.removeEventListener ? (d == goog.global || !d.customEvent_) && d.removeEventListener(e, f, h) : d.detachEvent && d.detachEvent(goog.events.getOnString_(e), f);
  d = goog.getUid(d);
  goog.events.sources_[d] && (f = goog.events.sources_[d], goog.array.remove(f, c), 0 == f.length && delete goog.events.sources_[d]);
  c.removed = !0;
  if(c = goog.events.listenerTree_[e][h][d]) {
    c.needsCleanup_ = !0, goog.events.cleanUp_(e, h, d, c)
  }
  delete goog.events.listeners_[a];
  return!0
};
goog.events.unlistenWithWrapper = function(a, c, d, e, f) {
  c.unlisten(a, d, e, f)
};
goog.events.cleanUp_ = function(a, c, d, e) {
  if(!e.locked_ && e.needsCleanup_) {
    for(var f = 0, h = 0;f < e.length;f++) {
      e[f].removed ? e[f].proxy.src = null : (f != h && (e[h] = e[f]), h++)
    }
    e.length = h;
    e.needsCleanup_ = !1;
    0 == h && (delete goog.events.listenerTree_[a][c][d], goog.events.listenerTree_[a][c].count_--, 0 == goog.events.listenerTree_[a][c].count_ && (delete goog.events.listenerTree_[a][c], goog.events.listenerTree_[a].count_--), 0 == goog.events.listenerTree_[a].count_ && delete goog.events.listenerTree_[a])
  }
};
goog.events.removeAll = function(a, c, d) {
  var e = 0, f = null == c, h = null == d, d = !!d;
  if(null == a) {
    goog.object.forEach(goog.events.sources_, function(a) {
      for(var i = a.length - 1;0 <= i;i--) {
        var j = a[i];
        if((f || c == j.type) && (h || d == j.capture)) {
          goog.events.unlistenByKey(j.key), e++
        }
      }
    })
  }else {
    if(a = goog.getUid(a), goog.events.sources_[a]) {
      for(var a = goog.events.sources_[a], i = a.length - 1;0 <= i;i--) {
        var j = a[i];
        if((f || c == j.type) && (h || d == j.capture)) {
          goog.events.unlistenByKey(j.key), e++
        }
      }
    }
  }
  return e
};
goog.events.getListeners = function(a, c, d) {
  return goog.events.getListeners_(a, c, d) || []
};
goog.events.getListeners_ = function(a, c, d) {
  var e = goog.events.listenerTree_;
  return c in e && (e = e[c], d in e && (e = e[d], a = goog.getUid(a), e[a])) ? e[a] : null
};
goog.events.getListener = function(a, c, d, e, f) {
  e = !!e;
  if(a = goog.events.getListeners_(a, c, e)) {
    for(c = 0;c < a.length;c++) {
      if(!a[c].removed && a[c].listener == d && a[c].capture == e && a[c].handler == f) {
        return a[c]
      }
    }
  }
  return null
};
goog.events.hasListener = function(a, c, d) {
  var a = goog.getUid(a), e = goog.events.sources_[a];
  if(e) {
    var f = goog.isDef(c), h = goog.isDef(d);
    return f && h ? (e = goog.events.listenerTree_[c], !!e && !!e[d] && a in e[d]) : !f && !h ? !0 : goog.array.some(e, function(a) {
      return f && a.type == c || h && a.capture == d
    })
  }
  return!1
};
goog.events.expose = function(a) {
  var c = [], d;
  for(d in a) {
    a[d] && a[d].id ? c.push(d + " = " + a[d] + " (" + a[d].id + ")") : c.push(d + " = " + a[d])
  }
  return c.join("\n")
};
goog.events.getOnString_ = function(a) {
  return a in goog.events.onStringMap_ ? goog.events.onStringMap_[a] : goog.events.onStringMap_[a] = goog.events.onString_ + a
};
goog.events.fireListeners = function(a, c, d, e) {
  var f = goog.events.listenerTree_;
  return c in f && (f = f[c], d in f) ? goog.events.fireListeners_(f[d], a, c, d, e) : !0
};
goog.events.fireListeners_ = function(a, c, d, e, f) {
  var h = 1, c = goog.getUid(c);
  if(a[c]) {
    a.remaining_--;
    a = a[c];
    a.locked_ ? a.locked_++ : a.locked_ = 1;
    try {
      for(var i = a.length, j = 0;j < i;j++) {
        var k = a[j];
        k && !k.removed && (h &= !1 !== goog.events.fireListener(k, f))
      }
    }finally {
      a.locked_--, goog.events.cleanUp_(d, e, c, a)
    }
  }
  return Boolean(h)
};
goog.events.fireListener = function(a, c) {
  a.callOnce && goog.events.unlistenByKey(a.key);
  return a.handleEvent(c)
};
goog.events.getTotalListenerCount = function() {
  return goog.object.getCount(goog.events.listeners_)
};
goog.events.dispatchEvent = function(a, c) {
  var d = c.type || c, e = goog.events.listenerTree_;
  if(!(d in e)) {
    return!0
  }
  if(goog.isString(c)) {
    c = new goog.events.Event(c, a)
  }else {
    if(c instanceof goog.events.Event) {
      c.target = c.target || a
    }else {
      var f = c, c = new goog.events.Event(d, a);
      goog.object.extend(c, f)
    }
  }
  var f = 1, h, e = e[d], d = !0 in e, i;
  if(d) {
    h = [];
    for(i = a;i;i = i.getParentEventTarget()) {
      h.push(i)
    }
    i = e[!0];
    i.remaining_ = i.count_;
    for(var j = h.length - 1;!c.propagationStopped_ && 0 <= j && i.remaining_;j--) {
      c.currentTarget = h[j], f &= goog.events.fireListeners_(i, h[j], c.type, !0, c) && !1 != c.returnValue_
    }
  }
  if(!1 in e) {
    if(i = e[!1], i.remaining_ = i.count_, d) {
      for(j = 0;!c.propagationStopped_ && j < h.length && i.remaining_;j++) {
        c.currentTarget = h[j], f &= goog.events.fireListeners_(i, h[j], c.type, !1, c) && !1 != c.returnValue_
      }
    }else {
      for(e = a;!c.propagationStopped_ && e && i.remaining_;e = e.getParentEventTarget()) {
        c.currentTarget = e, f &= goog.events.fireListeners_(i, e, c.type, !1, c) && !1 != c.returnValue_
      }
    }
  }
  return Boolean(f)
};
goog.events.protectBrowserEventEntryPoint = function(a) {
  goog.events.handleBrowserEvent_ = a.protectEntryPoint(goog.events.handleBrowserEvent_)
};
goog.events.handleBrowserEvent_ = function(a, c) {
  if(!goog.events.listeners_[a]) {
    return!0
  }
  var d = goog.events.listeners_[a], e = d.type, f = goog.events.listenerTree_;
  if(!(e in f)) {
    return!0
  }
  var f = f[e], h, i;
  if(!goog.events.BrowserFeature.HAS_W3C_EVENT_SUPPORT) {
    h = c || goog.getObjectByName("window.event");
    var j = !0 in f, k = !1 in f;
    if(j) {
      if(goog.events.isMarkedIeEvent_(h)) {
        return!0
      }
      goog.events.markIeEvent_(h)
    }
    var l = new goog.events.BrowserEvent;
    l.init(h, this);
    h = !0;
    try {
      if(j) {
        for(var p = [], m = l.currentTarget;m;m = m.parentNode) {
          p.push(m)
        }
        i = f[!0];
        i.remaining_ = i.count_;
        for(var q = p.length - 1;!l.propagationStopped_ && 0 <= q && i.remaining_;q--) {
          l.currentTarget = p[q], h &= goog.events.fireListeners_(i, p[q], e, !0, l)
        }
        if(k) {
          i = f[!1];
          i.remaining_ = i.count_;
          for(q = 0;!l.propagationStopped_ && q < p.length && i.remaining_;q++) {
            l.currentTarget = p[q], h &= goog.events.fireListeners_(i, p[q], e, !1, l)
          }
        }
      }else {
        h = goog.events.fireListener(d, l)
      }
    }finally {
      p && (p.length = 0)
    }
    return h
  }
  e = new goog.events.BrowserEvent(c, this);
  return h = goog.events.fireListener(d, e)
};
goog.events.markIeEvent_ = function(a) {
  var c = !1;
  if(0 == a.keyCode) {
    try {
      a.keyCode = -1;
      return
    }catch(d) {
      c = !0
    }
  }
  if(c || void 0 == a.returnValue) {
    a.returnValue = !0
  }
};
goog.events.isMarkedIeEvent_ = function(a) {
  return 0 > a.keyCode || void 0 != a.returnValue
};
goog.events.uniqueIdCounter_ = 0;
goog.events.getUniqueId = function(a) {
  return a + "_" + goog.events.uniqueIdCounter_++
};
goog.debug.entryPointRegistry.register(function(a) {
  goog.events.handleBrowserEvent_ = a(goog.events.handleBrowserEvent_)
});
goog.events.EventHandler = function(a) {
  goog.Disposable.call(this);
  this.handler_ = a;
  this.keys_ = []
};
goog.inherits(goog.events.EventHandler, goog.Disposable);
goog.events.EventHandler.typeArray_ = [];
goog.events.EventHandler.prototype.listen = function(a, c, d, e, f) {
  goog.isArray(c) || (goog.events.EventHandler.typeArray_[0] = c, c = goog.events.EventHandler.typeArray_);
  for(var h = 0;h < c.length;h++) {
    var i = goog.events.listen(a, c[h], d || this, e || !1, f || this.handler_ || this);
    this.keys_.push(i)
  }
  return this
};
goog.events.EventHandler.prototype.listenOnce = function(a, c, d, e, f) {
  if(goog.isArray(c)) {
    for(var h = 0;h < c.length;h++) {
      this.listenOnce(a, c[h], d, e, f)
    }
  }else {
    a = goog.events.listenOnce(a, c, d || this, e, f || this.handler_ || this), this.keys_.push(a)
  }
  return this
};
goog.events.EventHandler.prototype.listenWithWrapper = function(a, c, d, e, f) {
  c.listen(a, d, e, f || this.handler_ || this, this);
  return this
};
goog.events.EventHandler.prototype.getListenerCount = function() {
  return this.keys_.length
};
goog.events.EventHandler.prototype.unlisten = function(a, c, d, e, f) {
  if(goog.isArray(c)) {
    for(var h = 0;h < c.length;h++) {
      this.unlisten(a, c[h], d, e, f)
    }
  }else {
    if(a = goog.events.getListener(a, c, d || this, e, f || this.handler_ || this)) {
      a = a.key, goog.events.unlistenByKey(a), goog.array.remove(this.keys_, a)
    }
  }
  return this
};
goog.events.EventHandler.prototype.unlistenWithWrapper = function(a, c, d, e, f) {
  c.unlisten(a, d, e, f || this.handler_ || this, this);
  return this
};
goog.events.EventHandler.prototype.removeAll = function() {
  goog.array.forEach(this.keys_, goog.events.unlistenByKey);
  this.keys_.length = 0
};
goog.events.EventHandler.prototype.disposeInternal = function() {
  goog.events.EventHandler.superClass_.disposeInternal.call(this);
  this.removeAll()
};
goog.events.EventHandler.prototype.handleEvent = function() {
  throw Error("EventHandler.handleEvent not implemented");
};
goog.events.EventTarget = function() {
  goog.Disposable.call(this)
};
goog.inherits(goog.events.EventTarget, goog.Disposable);
goog.events.EventTarget.prototype.customEvent_ = !0;
goog.events.EventTarget.prototype.parentEventTarget_ = null;
goog.events.EventTarget.prototype.getParentEventTarget = function() {
  return this.parentEventTarget_
};
goog.events.EventTarget.prototype.setParentEventTarget = function(a) {
  this.parentEventTarget_ = a
};
goog.events.EventTarget.prototype.addEventListener = function(a, c, d, e) {
  goog.events.listen(this, a, c, d, e)
};
goog.events.EventTarget.prototype.removeEventListener = function(a, c, d, e) {
  goog.events.unlisten(this, a, c, d, e)
};
goog.events.EventTarget.prototype.dispatchEvent = function(a) {
  return goog.events.dispatchEvent(this, a)
};
goog.events.EventTarget.prototype.disposeInternal = function() {
  goog.events.EventTarget.superClass_.disposeInternal.call(this);
  goog.events.removeAll(this);
  this.parentEventTarget_ = null
};
goog.math.Box = function(a, c, d, e) {
  this.top = a;
  this.right = c;
  this.bottom = d;
  this.left = e
};
goog.math.Box.boundingBox = function(a) {
  for(var c = new goog.math.Box(arguments[0].y, arguments[0].x, arguments[0].y, arguments[0].x), d = 1;d < arguments.length;d++) {
    var e = arguments[d];
    c.top = Math.min(c.top, e.y);
    c.right = Math.max(c.right, e.x);
    c.bottom = Math.max(c.bottom, e.y);
    c.left = Math.min(c.left, e.x)
  }
  return c
};
goog.math.Box.prototype.clone = function() {
  return new goog.math.Box(this.top, this.right, this.bottom, this.left)
};
goog.DEBUG && (goog.math.Box.prototype.toString = function() {
  return"(" + this.top + "t, " + this.right + "r, " + this.bottom + "b, " + this.left + "l)"
});
goog.math.Box.prototype.contains = function(a) {
  return goog.math.Box.contains(this, a)
};
goog.math.Box.prototype.expand = function(a, c, d, e) {
  goog.isObject(a) ? (this.top -= a.top, this.right += a.right, this.bottom += a.bottom, this.left -= a.left) : (this.top -= a, this.right += c, this.bottom += d, this.left -= e);
  return this
};
goog.math.Box.prototype.expandToInclude = function(a) {
  this.left = Math.min(this.left, a.left);
  this.top = Math.min(this.top, a.top);
  this.right = Math.max(this.right, a.right);
  this.bottom = Math.max(this.bottom, a.bottom)
};
goog.math.Box.equals = function(a, c) {
  return a == c ? !0 : !a || !c ? !1 : a.top == c.top && a.right == c.right && a.bottom == c.bottom && a.left == c.left
};
goog.math.Box.contains = function(a, c) {
  return!a || !c ? !1 : c instanceof goog.math.Box ? c.left >= a.left && c.right <= a.right && c.top >= a.top && c.bottom <= a.bottom : c.x >= a.left && c.x <= a.right && c.y >= a.top && c.y <= a.bottom
};
goog.math.Box.relativePositionX = function(a, c) {
  return c.x < a.left ? c.x - a.left : c.x > a.right ? c.x - a.right : 0
};
goog.math.Box.relativePositionY = function(a, c) {
  return c.y < a.top ? c.y - a.top : c.y > a.bottom ? c.y - a.bottom : 0
};
goog.math.Box.distance = function(a, c) {
  var d = goog.math.Box.relativePositionX(a, c), e = goog.math.Box.relativePositionY(a, c);
  return Math.sqrt(d * d + e * e)
};
goog.math.Box.intersects = function(a, c) {
  return a.left <= c.right && c.left <= a.right && a.top <= c.bottom && c.top <= a.bottom
};
goog.math.Box.intersectsWithPadding = function(a, c, d) {
  return a.left <= c.right + d && c.left <= a.right + d && a.top <= c.bottom + d && c.top <= a.bottom + d
};
goog.math.Rect = function(a, c, d, e) {
  this.left = a;
  this.top = c;
  this.width = d;
  this.height = e
};
goog.math.Rect.prototype.clone = function() {
  return new goog.math.Rect(this.left, this.top, this.width, this.height)
};
goog.math.Rect.prototype.toBox = function() {
  return new goog.math.Box(this.top, this.left + this.width, this.top + this.height, this.left)
};
goog.math.Rect.createFromBox = function(a) {
  return new goog.math.Rect(a.left, a.top, a.right - a.left, a.bottom - a.top)
};
goog.DEBUG && (goog.math.Rect.prototype.toString = function() {
  return"(" + this.left + ", " + this.top + " - " + this.width + "w x " + this.height + "h)"
});
goog.math.Rect.equals = function(a, c) {
  return a == c ? !0 : !a || !c ? !1 : a.left == c.left && a.width == c.width && a.top == c.top && a.height == c.height
};
goog.math.Rect.prototype.intersection = function(a) {
  var c = Math.max(this.left, a.left), d = Math.min(this.left + this.width, a.left + a.width);
  if(c <= d) {
    var e = Math.max(this.top, a.top), a = Math.min(this.top + this.height, a.top + a.height);
    if(e <= a) {
      return this.left = c, this.top = e, this.width = d - c, this.height = a - e, !0
    }
  }
  return!1
};
goog.math.Rect.intersection = function(a, c) {
  var d = Math.max(a.left, c.left), e = Math.min(a.left + a.width, c.left + c.width);
  if(d <= e) {
    var f = Math.max(a.top, c.top), h = Math.min(a.top + a.height, c.top + c.height);
    if(f <= h) {
      return new goog.math.Rect(d, f, e - d, h - f)
    }
  }
  return null
};
goog.math.Rect.intersects = function(a, c) {
  return a.left <= c.left + c.width && c.left <= a.left + a.width && a.top <= c.top + c.height && c.top <= a.top + a.height
};
goog.math.Rect.prototype.intersects = function(a) {
  return goog.math.Rect.intersects(this, a)
};
goog.math.Rect.difference = function(a, c) {
  var d = goog.math.Rect.intersection(a, c);
  if(!d || !d.height || !d.width) {
    return[a.clone()]
  }
  var d = [], e = a.top, f = a.height, h = a.left + a.width, i = a.top + a.height, j = c.left + c.width, k = c.top + c.height;
  c.top > a.top && (d.push(new goog.math.Rect(a.left, a.top, a.width, c.top - a.top)), e = c.top, f -= c.top - a.top);
  k < i && (d.push(new goog.math.Rect(a.left, k, a.width, i - k)), f = k - e);
  c.left > a.left && d.push(new goog.math.Rect(a.left, e, c.left - a.left, f));
  j < h && d.push(new goog.math.Rect(j, e, h - j, f));
  return d
};
goog.math.Rect.prototype.difference = function(a) {
  return goog.math.Rect.difference(this, a)
};
goog.math.Rect.prototype.boundingRect = function(a) {
  var c = Math.max(this.left + this.width, a.left + a.width), d = Math.max(this.top + this.height, a.top + a.height);
  this.left = Math.min(this.left, a.left);
  this.top = Math.min(this.top, a.top);
  this.width = c - this.left;
  this.height = d - this.top
};
goog.math.Rect.boundingRect = function(a, c) {
  if(!a || !c) {
    return null
  }
  var d = a.clone();
  d.boundingRect(c);
  return d
};
goog.math.Rect.prototype.contains = function(a) {
  return a instanceof goog.math.Rect ? this.left <= a.left && this.left + this.width >= a.left + a.width && this.top <= a.top && this.top + this.height >= a.top + a.height : a.x >= this.left && a.x <= this.left + this.width && a.y >= this.top && a.y <= this.top + this.height
};
goog.math.Rect.prototype.getSize = function() {
  return new goog.math.Size(this.width, this.height)
};
goog.style = {};
goog.style.setStyle = function(a, c, d) {
  goog.isString(c) ? goog.style.setStyle_(a, d, c) : goog.object.forEach(c, goog.partial(goog.style.setStyle_, a))
};
goog.style.setStyle_ = function(a, c, d) {
  a.style[goog.string.toCamelCase(d)] = c
};
goog.style.getStyle = function(a, c) {
  return a.style[goog.string.toCamelCase(c)] || ""
};
goog.style.getComputedStyle = function(a, c) {
  var d = goog.dom.getOwnerDocument(a);
  return d.defaultView && d.defaultView.getComputedStyle && (d = d.defaultView.getComputedStyle(a, null)) ? d[c] || d.getPropertyValue(c) || "" : ""
};
goog.style.getCascadedStyle = function(a, c) {
  return a.currentStyle ? a.currentStyle[c] : null
};
goog.style.getStyle_ = function(a, c) {
  return goog.style.getComputedStyle(a, c) || goog.style.getCascadedStyle(a, c) || a.style && a.style[c]
};
goog.style.getComputedPosition = function(a) {
  return goog.style.getStyle_(a, "position")
};
goog.style.getBackgroundColor = function(a) {
  return goog.style.getStyle_(a, "backgroundColor")
};
goog.style.getComputedOverflowX = function(a) {
  return goog.style.getStyle_(a, "overflowX")
};
goog.style.getComputedOverflowY = function(a) {
  return goog.style.getStyle_(a, "overflowY")
};
goog.style.getComputedZIndex = function(a) {
  return goog.style.getStyle_(a, "zIndex")
};
goog.style.getComputedTextAlign = function(a) {
  return goog.style.getStyle_(a, "textAlign")
};
goog.style.getComputedCursor = function(a) {
  return goog.style.getStyle_(a, "cursor")
};
goog.style.setPosition = function(a, c, d) {
  var e, f = goog.userAgent.GECKO && (goog.userAgent.MAC || goog.userAgent.X11) && goog.userAgent.isVersion("1.9");
  c instanceof goog.math.Coordinate ? (e = c.x, c = c.y) : (e = c, c = d);
  a.style.left = goog.style.getPixelStyleValue_(e, f);
  a.style.top = goog.style.getPixelStyleValue_(c, f)
};
goog.style.getPosition = function(a) {
  return new goog.math.Coordinate(a.offsetLeft, a.offsetTop)
};
goog.style.getClientViewportElement = function(a) {
  a = a ? goog.dom.getOwnerDocument(a) : goog.dom.getDocument();
  return goog.userAgent.IE && !goog.userAgent.isDocumentMode(9) && !goog.dom.getDomHelper(a).isCss1CompatMode() ? a.body : a.documentElement
};
goog.style.getViewportPageOffset = function(a) {
  var c = a.body, a = a.documentElement;
  return new goog.math.Coordinate(c.scrollLeft || a.scrollLeft, c.scrollTop || a.scrollTop)
};
goog.style.getBoundingClientRect_ = function(a) {
  var c = a.getBoundingClientRect();
  goog.userAgent.IE && (a = a.ownerDocument, c.left -= a.documentElement.clientLeft + a.body.clientLeft, c.top -= a.documentElement.clientTop + a.body.clientTop);
  return c
};
goog.style.getOffsetParent = function(a) {
  if(goog.userAgent.IE && !goog.userAgent.isDocumentMode(8)) {
    return a.offsetParent
  }
  for(var c = goog.dom.getOwnerDocument(a), d = goog.style.getStyle_(a, "position"), e = "fixed" == d || "absolute" == d, a = a.parentNode;a && a != c;a = a.parentNode) {
    if(d = goog.style.getStyle_(a, "position"), e = e && "static" == d && a != c.documentElement && a != c.body, !e && (a.scrollWidth > a.clientWidth || a.scrollHeight > a.clientHeight || "fixed" == d || "absolute" == d || "relative" == d)) {
      return a
    }
  }
  return null
};
goog.style.getVisibleRectForElement = function(a) {
  for(var c = new goog.math.Box(0, Infinity, Infinity, 0), d = goog.dom.getDomHelper(a), e = d.getDocument().body, f = d.getDocument().documentElement, h = d.getDocumentScrollElement();a = goog.style.getOffsetParent(a);) {
    if((!goog.userAgent.IE || 0 != a.clientWidth) && (!goog.userAgent.WEBKIT || 0 != a.clientHeight || a != e) && a != e && a != f && "visible" != goog.style.getStyle_(a, "overflow")) {
      var i = goog.style.getPageOffset(a), j = goog.style.getClientLeftTop(a);
      i.x += j.x;
      i.y += j.y;
      c.top = Math.max(c.top, i.y);
      c.right = Math.min(c.right, i.x + a.clientWidth);
      c.bottom = Math.min(c.bottom, i.y + a.clientHeight);
      c.left = Math.max(c.left, i.x)
    }
  }
  e = h.scrollLeft;
  h = h.scrollTop;
  c.left = Math.max(c.left, e);
  c.top = Math.max(c.top, h);
  d = d.getViewportSize();
  c.right = Math.min(c.right, e + d.width);
  c.bottom = Math.min(c.bottom, h + d.height);
  return 0 <= c.top && 0 <= c.left && c.bottom > c.top && c.right > c.left ? c : null
};
goog.style.getContainerOffsetToScrollInto = function(a, c, d) {
  var e = goog.style.getPageOffset(a), f = goog.style.getPageOffset(c), h = goog.style.getBorderBox(c), i = e.x - f.x - h.left, e = e.y - f.y - h.top, f = c.clientWidth - a.offsetWidth, a = c.clientHeight - a.offsetHeight, h = c.scrollLeft, c = c.scrollTop;
  d ? (h += i - f / 2, c += e - a / 2) : (h += Math.min(i, Math.max(i - f, 0)), c += Math.min(e, Math.max(e - a, 0)));
  return new goog.math.Coordinate(h, c)
};
goog.style.scrollIntoContainerView = function(a, c, d) {
  a = goog.style.getContainerOffsetToScrollInto(a, c, d);
  c.scrollLeft = a.x;
  c.scrollTop = a.y
};
goog.style.getClientLeftTop = function(a) {
  if(goog.userAgent.GECKO && !goog.userAgent.isVersion("1.9")) {
    var c = parseFloat(goog.style.getComputedStyle(a, "borderLeftWidth"));
    if(goog.style.isRightToLeft(a)) {
      var d = a.offsetWidth - a.clientWidth - c - parseFloat(goog.style.getComputedStyle(a, "borderRightWidth")), c = c + d
    }
    return new goog.math.Coordinate(c, parseFloat(goog.style.getComputedStyle(a, "borderTopWidth")))
  }
  return new goog.math.Coordinate(a.clientLeft, a.clientTop)
};
goog.style.getPageOffset = function(a) {
  var c, d = goog.dom.getOwnerDocument(a), e = goog.style.getStyle_(a, "position");
  goog.asserts.assertObject(a, "Parameter is required");
  var f = goog.userAgent.GECKO && d.getBoxObjectFor && !a.getBoundingClientRect && "absolute" == e && (c = d.getBoxObjectFor(a)) && (0 > c.screenX || 0 > c.screenY), h = new goog.math.Coordinate(0, 0), i = goog.style.getClientViewportElement(d);
  if(a == i) {
    return h
  }
  if(a.getBoundingClientRect) {
    c = goog.style.getBoundingClientRect_(a), a = goog.dom.getDomHelper(d).getDocumentScroll(), h.x = c.left + a.x, h.y = c.top + a.y
  }else {
    if(d.getBoxObjectFor && !f) {
      c = d.getBoxObjectFor(a), a = d.getBoxObjectFor(i), h.x = c.screenX - a.screenX, h.y = c.screenY - a.screenY
    }else {
      c = a;
      do {
        h.x += c.offsetLeft;
        h.y += c.offsetTop;
        c != a && (h.x += c.clientLeft || 0, h.y += c.clientTop || 0);
        if(goog.userAgent.WEBKIT && "fixed" == goog.style.getComputedPosition(c)) {
          h.x += d.body.scrollLeft;
          h.y += d.body.scrollTop;
          break
        }
        c = c.offsetParent
      }while(c && c != a);
      if(goog.userAgent.OPERA || goog.userAgent.WEBKIT && "absolute" == e) {
        h.y -= d.body.offsetTop
      }
      for(c = a;(c = goog.style.getOffsetParent(c)) && c != d.body && c != i;) {
        if(h.x -= c.scrollLeft, !goog.userAgent.OPERA || "TR" != c.tagName) {
          h.y -= c.scrollTop
        }
      }
    }
  }
  return h
};
goog.style.getPageOffsetLeft = function(a) {
  return goog.style.getPageOffset(a).x
};
goog.style.getPageOffsetTop = function(a) {
  return goog.style.getPageOffset(a).y
};
goog.style.getFramedPageOffset = function(a, c) {
  var d = new goog.math.Coordinate(0, 0), e = goog.dom.getWindow(goog.dom.getOwnerDocument(a)), f = a;
  do {
    var h = e == c ? goog.style.getPageOffset(f) : goog.style.getClientPosition(f);
    d.x += h.x;
    d.y += h.y
  }while(e && e != c && (f = e.frameElement) && (e = e.parent));
  return d
};
goog.style.translateRectForAnotherFrame = function(a, c, d) {
  if(c.getDocument() != d.getDocument()) {
    var e = c.getDocument().body, d = goog.style.getFramedPageOffset(e, d.getWindow()), d = goog.math.Coordinate.difference(d, goog.style.getPageOffset(e));
    goog.userAgent.IE && !c.isCss1CompatMode() && (d = goog.math.Coordinate.difference(d, c.getDocumentScroll()));
    a.left += d.x;
    a.top += d.y
  }
};
goog.style.getRelativePosition = function(a, c) {
  var d = goog.style.getClientPosition(a), e = goog.style.getClientPosition(c);
  return new goog.math.Coordinate(d.x - e.x, d.y - e.y)
};
goog.style.getClientPosition = function(a) {
  var c = new goog.math.Coordinate;
  if(a.nodeType == goog.dom.NodeType.ELEMENT) {
    if(a.getBoundingClientRect) {
      var d = goog.style.getBoundingClientRect_(a);
      c.x = d.left;
      c.y = d.top
    }else {
      var d = goog.dom.getDomHelper(a).getDocumentScroll(), e = goog.style.getPageOffset(a);
      c.x = e.x - d.x;
      c.y = e.y - d.y
    }
    goog.userAgent.GECKO && !goog.userAgent.isVersion(12) && (c = goog.math.Coordinate.sum(c, goog.style.getCssTranslation(a)))
  }else {
    d = goog.isFunction(a.getBrowserEvent), e = a, a.targetTouches ? e = a.targetTouches[0] : d && a.getBrowserEvent().targetTouches && (e = a.getBrowserEvent().targetTouches[0]), c.x = e.clientX, c.y = e.clientY
  }
  return c
};
goog.style.setPageOffset = function(a, c, d) {
  var e = goog.style.getPageOffset(a);
  c instanceof goog.math.Coordinate && (d = c.y, c = c.x);
  goog.style.setPosition(a, a.offsetLeft + (c - e.x), a.offsetTop + (d - e.y))
};
goog.style.setSize = function(a, c, d) {
  if(c instanceof goog.math.Size) {
    d = c.height, c = c.width
  }else {
    if(void 0 == d) {
      throw Error("missing height argument");
    }
  }
  goog.style.setWidth(a, c);
  goog.style.setHeight(a, d)
};
goog.style.getPixelStyleValue_ = function(a, c) {
  "number" == typeof a && (a = (c ? Math.round(a) : a) + "px");
  return a
};
goog.style.setHeight = function(a, c) {
  a.style.height = goog.style.getPixelStyleValue_(c, !0)
};
goog.style.setWidth = function(a, c) {
  a.style.width = goog.style.getPixelStyleValue_(c, !0)
};
goog.style.getSize = function(a) {
  if("none" != goog.style.getStyle_(a, "display")) {
    return goog.style.getSizeWithDisplay_(a)
  }
  var c = a.style, d = c.display, e = c.visibility, f = c.position;
  c.visibility = "hidden";
  c.position = "absolute";
  c.display = "inline";
  a = goog.style.getSizeWithDisplay_(a);
  c.display = d;
  c.position = f;
  c.visibility = e;
  return a
};
goog.style.getSizeWithDisplay_ = function(a) {
  var c = a.offsetWidth, d = a.offsetHeight, e = goog.userAgent.WEBKIT && !c && !d;
  return(!goog.isDef(c) || e) && a.getBoundingClientRect ? (a = goog.style.getBoundingClientRect_(a), new goog.math.Size(a.right - a.left, a.bottom - a.top)) : new goog.math.Size(c, d)
};
goog.style.getBounds = function(a) {
  var c = goog.style.getPageOffset(a), a = goog.style.getSize(a);
  return new goog.math.Rect(c.x, c.y, a.width, a.height)
};
goog.style.toCamelCase = function(a) {
  return goog.string.toCamelCase(String(a))
};
goog.style.toSelectorCase = function(a) {
  return goog.string.toSelectorCase(a)
};
goog.style.getOpacity = function(a) {
  var c = a.style, a = "";
  "opacity" in c ? a = c.opacity : "MozOpacity" in c ? a = c.MozOpacity : "filter" in c && (c = c.filter.match(/alpha\(opacity=([\d.]+)\)/)) && (a = String(c[1] / 100));
  return"" == a ? a : Number(a)
};
goog.style.setOpacity = function(a, c) {
  var d = a.style;
  "opacity" in d ? d.opacity = c : "MozOpacity" in d ? d.MozOpacity = c : "filter" in d && (d.filter = "" === c ? "" : "alpha(opacity=" + 100 * c + ")")
};
goog.style.setTransparentBackgroundImage = function(a, c) {
  var d = a.style;
  goog.userAgent.IE && !goog.userAgent.isVersion("8") ? d.filter = 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src="' + c + '", sizingMethod="crop")' : (d.backgroundImage = "url(" + c + ")", d.backgroundPosition = "top left", d.backgroundRepeat = "no-repeat")
};
goog.style.clearTransparentBackgroundImage = function(a) {
  a = a.style;
  "filter" in a ? a.filter = "" : a.backgroundImage = "none"
};
goog.style.showElement = function(a, c) {
  a.style.display = c ? "" : "none"
};
goog.style.isElementShown = function(a) {
  return"none" != a.style.display
};
goog.style.installStyles = function(a, c) {
  var d = goog.dom.getDomHelper(c), e = null;
  if(goog.userAgent.IE) {
    e = d.getDocument().createStyleSheet(), goog.style.setStyles(e, a)
  }else {
    var f = d.getElementsByTagNameAndClass("head")[0];
    f || (e = d.getElementsByTagNameAndClass("body")[0], f = d.createDom("head"), e.parentNode.insertBefore(f, e));
    e = d.createDom("style");
    goog.style.setStyles(e, a);
    d.appendChild(f, e)
  }
  return e
};
goog.style.uninstallStyles = function(a) {
  goog.dom.removeNode(a.ownerNode || a.owningElement || a)
};
goog.style.setStyles = function(a, c) {
  goog.userAgent.IE ? a.cssText = c : a.innerHTML = c
};
goog.style.setPreWrap = function(a) {
  a = a.style;
  goog.userAgent.IE && !goog.userAgent.isVersion("8") ? (a.whiteSpace = "pre", a.wordWrap = "break-word") : a.whiteSpace = goog.userAgent.GECKO ? "-moz-pre-wrap" : "pre-wrap"
};
goog.style.setInlineBlock = function(a) {
  a = a.style;
  a.position = "relative";
  goog.userAgent.IE && !goog.userAgent.isVersion("8") ? (a.zoom = "1", a.display = "inline") : a.display = goog.userAgent.GECKO ? goog.userAgent.isVersion("1.9a") ? "inline-block" : "-moz-inline-box" : "inline-block"
};
goog.style.isRightToLeft = function(a) {
  return"rtl" == goog.style.getStyle_(a, "direction")
};
goog.style.unselectableStyle_ = goog.userAgent.GECKO ? "MozUserSelect" : goog.userAgent.WEBKIT ? "WebkitUserSelect" : null;
goog.style.isUnselectable = function(a) {
  return goog.style.unselectableStyle_ ? "none" == a.style[goog.style.unselectableStyle_].toLowerCase() : goog.userAgent.IE || goog.userAgent.OPERA ? "on" == a.getAttribute("unselectable") : !1
};
goog.style.setUnselectable = function(a, c, d) {
  var d = !d ? a.getElementsByTagName("*") : null, e = goog.style.unselectableStyle_;
  if(e) {
    if(c = c ? "none" : "", a.style[e] = c, d) {
      for(var a = 0, f;f = d[a];a++) {
        f.style[e] = c
      }
    }
  }else {
    if(goog.userAgent.IE || goog.userAgent.OPERA) {
      if(c = c ? "on" : "", a.setAttribute("unselectable", c), d) {
        for(a = 0;f = d[a];a++) {
          f.setAttribute("unselectable", c)
        }
      }
    }
  }
};
goog.style.getBorderBoxSize = function(a) {
  return new goog.math.Size(a.offsetWidth, a.offsetHeight)
};
goog.style.setBorderBoxSize = function(a, c) {
  var d = goog.dom.getOwnerDocument(a), e = goog.dom.getDomHelper(d).isCss1CompatMode();
  if(goog.userAgent.IE && (!e || !goog.userAgent.isVersion("8"))) {
    if(d = a.style, e) {
      var e = goog.style.getPaddingBox(a), f = goog.style.getBorderBox(a);
      d.pixelWidth = c.width - f.left - e.left - e.right - f.right;
      d.pixelHeight = c.height - f.top - e.top - e.bottom - f.bottom
    }else {
      d.pixelWidth = c.width, d.pixelHeight = c.height
    }
  }else {
    goog.style.setBoxSizingSize_(a, c, "border-box")
  }
};
goog.style.getContentBoxSize = function(a) {
  var c = goog.dom.getOwnerDocument(a), d = goog.userAgent.IE && a.currentStyle;
  if(d && goog.dom.getDomHelper(c).isCss1CompatMode() && "auto" != d.width && "auto" != d.height && !d.boxSizing) {
    return c = goog.style.getIePixelValue_(a, d.width, "width", "pixelWidth"), a = goog.style.getIePixelValue_(a, d.height, "height", "pixelHeight"), new goog.math.Size(c, a)
  }
  d = goog.style.getBorderBoxSize(a);
  c = goog.style.getPaddingBox(a);
  a = goog.style.getBorderBox(a);
  return new goog.math.Size(d.width - a.left - c.left - c.right - a.right, d.height - a.top - c.top - c.bottom - a.bottom)
};
goog.style.setContentBoxSize = function(a, c) {
  var d = goog.dom.getOwnerDocument(a), e = goog.dom.getDomHelper(d).isCss1CompatMode();
  if(goog.userAgent.IE && (!e || !goog.userAgent.isVersion("8"))) {
    if(d = a.style, e) {
      d.pixelWidth = c.width, d.pixelHeight = c.height
    }else {
      var e = goog.style.getPaddingBox(a), f = goog.style.getBorderBox(a);
      d.pixelWidth = c.width + f.left + e.left + e.right + f.right;
      d.pixelHeight = c.height + f.top + e.top + e.bottom + f.bottom
    }
  }else {
    goog.style.setBoxSizingSize_(a, c, "content-box")
  }
};
goog.style.setBoxSizingSize_ = function(a, c, d) {
  a = a.style;
  goog.userAgent.GECKO ? a.MozBoxSizing = d : goog.userAgent.WEBKIT ? a.WebkitBoxSizing = d : a.boxSizing = d;
  a.width = Math.max(c.width, 0) + "px";
  a.height = Math.max(c.height, 0) + "px"
};
goog.style.getIePixelValue_ = function(a, c, d, e) {
  if(/^\d+px?$/.test(c)) {
    return parseInt(c, 10)
  }
  var f = a.style[d], h = a.runtimeStyle[d];
  a.runtimeStyle[d] = a.currentStyle[d];
  a.style[d] = c;
  c = a.style[e];
  a.style[d] = f;
  a.runtimeStyle[d] = h;
  return c
};
goog.style.getIePixelDistance_ = function(a, c) {
  return goog.style.getIePixelValue_(a, goog.style.getCascadedStyle(a, c), "left", "pixelLeft")
};
goog.style.getBox_ = function(a, c) {
  if(goog.userAgent.IE) {
    var d = goog.style.getIePixelDistance_(a, c + "Left"), e = goog.style.getIePixelDistance_(a, c + "Right"), f = goog.style.getIePixelDistance_(a, c + "Top"), h = goog.style.getIePixelDistance_(a, c + "Bottom");
    return new goog.math.Box(f, e, h, d)
  }
  d = goog.style.getComputedStyle(a, c + "Left");
  e = goog.style.getComputedStyle(a, c + "Right");
  f = goog.style.getComputedStyle(a, c + "Top");
  h = goog.style.getComputedStyle(a, c + "Bottom");
  return new goog.math.Box(parseFloat(f), parseFloat(e), parseFloat(h), parseFloat(d))
};
goog.style.getPaddingBox = function(a) {
  return goog.style.getBox_(a, "padding")
};
goog.style.getMarginBox = function(a) {
  return goog.style.getBox_(a, "margin")
};
goog.style.ieBorderWidthKeywords_ = {thin:2, medium:4, thick:6};
goog.style.getIePixelBorder_ = function(a, c) {
  if("none" == goog.style.getCascadedStyle(a, c + "Style")) {
    return 0
  }
  var d = goog.style.getCascadedStyle(a, c + "Width");
  return d in goog.style.ieBorderWidthKeywords_ ? goog.style.ieBorderWidthKeywords_[d] : goog.style.getIePixelValue_(a, d, "left", "pixelLeft")
};
goog.style.getBorderBox = function(a) {
  if(goog.userAgent.IE) {
    var c = goog.style.getIePixelBorder_(a, "borderLeft"), d = goog.style.getIePixelBorder_(a, "borderRight"), e = goog.style.getIePixelBorder_(a, "borderTop"), a = goog.style.getIePixelBorder_(a, "borderBottom");
    return new goog.math.Box(e, d, a, c)
  }
  c = goog.style.getComputedStyle(a, "borderLeftWidth");
  d = goog.style.getComputedStyle(a, "borderRightWidth");
  e = goog.style.getComputedStyle(a, "borderTopWidth");
  a = goog.style.getComputedStyle(a, "borderBottomWidth");
  return new goog.math.Box(parseFloat(e), parseFloat(d), parseFloat(a), parseFloat(c))
};
goog.style.getFontFamily = function(a) {
  var c = goog.dom.getOwnerDocument(a), d = "";
  if(c.body.createTextRange) {
    c = c.body.createTextRange();
    c.moveToElementText(a);
    try {
      d = c.queryCommandValue("FontName")
    }catch(e) {
      d = ""
    }
  }
  d || (d = goog.style.getStyle_(a, "fontFamily"));
  a = d.split(",");
  1 < a.length && (d = a[0]);
  return goog.string.stripQuotes(d, "\"'")
};
goog.style.lengthUnitRegex_ = /[^\d]+$/;
goog.style.getLengthUnits = function(a) {
  return(a = a.match(goog.style.lengthUnitRegex_)) && a[0] || null
};
goog.style.ABSOLUTE_CSS_LENGTH_UNITS_ = {cm:1, "in":1, mm:1, pc:1, pt:1};
goog.style.CONVERTIBLE_RELATIVE_CSS_UNITS_ = {em:1, ex:1};
goog.style.getFontSize = function(a) {
  var c = goog.style.getStyle_(a, "fontSize"), d = goog.style.getLengthUnits(c);
  if(c && "px" == d) {
    return parseInt(c, 10)
  }
  if(goog.userAgent.IE) {
    if(d in goog.style.ABSOLUTE_CSS_LENGTH_UNITS_) {
      return goog.style.getIePixelValue_(a, c, "left", "pixelLeft")
    }
    if(a.parentNode && a.parentNode.nodeType == goog.dom.NodeType.ELEMENT && d in goog.style.CONVERTIBLE_RELATIVE_CSS_UNITS_) {
      return a = a.parentNode, d = goog.style.getStyle_(a, "fontSize"), goog.style.getIePixelValue_(a, c == d ? "1em" : c, "left", "pixelLeft")
    }
  }
  d = goog.dom.createDom("span", {style:"visibility:hidden;position:absolute;line-height:0;padding:0;margin:0;border:0;height:1em;"});
  goog.dom.appendChild(a, d);
  c = d.offsetHeight;
  goog.dom.removeNode(d);
  return c
};
goog.style.parseStyleAttribute = function(a) {
  var c = {};
  goog.array.forEach(a.split(/\s*;\s*/), function(a) {
    a = a.split(/\s*:\s*/);
    2 == a.length && (c[goog.string.toCamelCase(a[0].toLowerCase())] = a[1])
  });
  return c
};
goog.style.toStyleAttribute = function(a) {
  var c = [];
  goog.object.forEach(a, function(a, e) {
    c.push(goog.string.toSelectorCase(e), ":", a, ";")
  });
  return c.join("")
};
goog.style.setFloat = function(a, c) {
  a.style[goog.userAgent.IE ? "styleFloat" : "cssFloat"] = c
};
goog.style.getFloat = function(a) {
  return a.style[goog.userAgent.IE ? "styleFloat" : "cssFloat"] || ""
};
goog.style.getScrollbarWidth = function(a) {
  var c = goog.dom.createElement("div");
  a && (c.className = a);
  c.style.cssText = "overflow:auto;position:absolute;top:0;width:100px;height:100px";
  a = goog.dom.createElement("div");
  goog.style.setSize(a, "200px", "200px");
  c.appendChild(a);
  goog.dom.appendChild(goog.dom.getDocument().body, c);
  a = c.offsetWidth - c.clientWidth;
  goog.dom.removeNode(c);
  return a
};
goog.style.MATRIX_TRANSLATION_REGEX_ = /matrix\([0-9\.\-]+, [0-9\.\-]+, [0-9\.\-]+, [0-9\.\-]+, ([0-9\.\-]+)p?x?, ([0-9\.\-]+)p?x?\)/;
goog.style.getCssTranslation = function(a) {
  var c;
  goog.userAgent.IE ? c = "-ms-transform" : goog.userAgent.WEBKIT ? c = "-webkit-transform" : goog.userAgent.OPERA ? c = "-o-transform" : goog.userAgent.GECKO && (c = "-moz-transform");
  var d;
  c && (d = goog.style.getStyle_(a, c));
  d || (d = goog.style.getStyle_(a, "transform"));
  if(!d) {
    return new goog.math.Coordinate(0, 0)
  }
  a = d.match(goog.style.MATRIX_TRANSLATION_REGEX_);
  return!a ? new goog.math.Coordinate(0, 0) : new goog.math.Coordinate(parseFloat(a[1]), parseFloat(a[2]))
};
goog.style.bidi = {};
goog.style.bidi.getScrollLeft = function(a) {
  var c = goog.style.isRightToLeft(a);
  return c && goog.userAgent.GECKO ? -a.scrollLeft : c && (!goog.userAgent.IE || !goog.userAgent.isVersion("8")) ? a.scrollWidth - a.clientWidth - a.scrollLeft : a.scrollLeft
};
goog.style.bidi.getOffsetStart = function(a) {
  var c = a.offsetLeft, d = a.offsetParent;
  !d && "fixed" == goog.style.getComputedPosition(a) && (d = goog.dom.getOwnerDocument(a).documentElement);
  if(!d) {
    return c
  }
  if(goog.userAgent.GECKO) {
    var e = goog.style.getBorderBox(d), c = c + e.left
  }else {
    goog.userAgent.isDocumentMode(8) && (e = goog.style.getBorderBox(d), c -= e.left)
  }
  return goog.style.isRightToLeft(d) ? d.clientWidth - (c + a.offsetWidth) : c
};
goog.style.bidi.setScrollOffset = function(a, c) {
  c = Math.max(c, 0);
  a.scrollLeft = goog.style.isRightToLeft(a) ? goog.userAgent.GECKO ? -c : !goog.userAgent.IE || !goog.userAgent.isVersion("8") ? a.scrollWidth - c - a.clientWidth : c : c
};
goog.style.bidi.setPosition = function(a, c, d, e) {
  goog.isNull(d) || (a.style.top = d + "px");
  e ? (a.style.right = c + "px", a.style.left = "") : (a.style.left = c + "px", a.style.right = "")
};
goog.fx = {};
goog.fx.Dragger = function(a, c, d) {
  goog.events.EventTarget.call(this);
  this.target = a;
  this.handle = c || a;
  this.limits = d || new goog.math.Rect(NaN, NaN, NaN, NaN);
  this.document_ = goog.dom.getOwnerDocument(a);
  this.eventHandler_ = new goog.events.EventHandler(this);
  goog.events.listen(this.handle, [goog.events.EventType.TOUCHSTART, goog.events.EventType.MOUSEDOWN], this.startDrag, !1, this)
};
goog.inherits(goog.fx.Dragger, goog.events.EventTarget);
goog.fx.Dragger.HAS_SET_CAPTURE_ = goog.userAgent.IE || goog.userAgent.GECKO && goog.userAgent.isVersion("1.9.3");
goog.fx.Dragger.EventType = {EARLY_CANCEL:"earlycancel", START:"start", BEFOREDRAG:"beforedrag", DRAG:"drag", END:"end"};
goog.fx.Dragger.prototype.clientX = 0;
goog.fx.Dragger.prototype.clientY = 0;
goog.fx.Dragger.prototype.screenX = 0;
goog.fx.Dragger.prototype.screenY = 0;
goog.fx.Dragger.prototype.startX = 0;
goog.fx.Dragger.prototype.startY = 0;
goog.fx.Dragger.prototype.deltaX = 0;
goog.fx.Dragger.prototype.deltaY = 0;
goog.fx.Dragger.prototype.enabled_ = !0;
goog.fx.Dragger.prototype.dragging_ = !1;
goog.fx.Dragger.prototype.hysteresisDistanceSquared_ = 0;
goog.fx.Dragger.prototype.mouseDownTime_ = 0;
goog.fx.Dragger.prototype.ieDragStartCancellingOn_ = !1;
goog.fx.Dragger.prototype.useRightPositioningForRtl_ = !1;
goog.fx.Dragger.prototype.enableRightPositioningForRtl = function(a) {
  this.useRightPositioningForRtl_ = a
};
goog.fx.Dragger.prototype.getHandler = function() {
  return this.eventHandler_
};
goog.fx.Dragger.prototype.setLimits = function(a) {
  this.limits = a || new goog.math.Rect(NaN, NaN, NaN, NaN)
};
goog.fx.Dragger.prototype.setHysteresis = function(a) {
  this.hysteresisDistanceSquared_ = Math.pow(a, 2)
};
goog.fx.Dragger.prototype.getHysteresis = function() {
  return Math.sqrt(this.hysteresisDistanceSquared_)
};
goog.fx.Dragger.prototype.setScrollTarget = function(a) {
  this.scrollTarget_ = a
};
goog.fx.Dragger.prototype.setCancelIeDragStart = function(a) {
  this.ieDragStartCancellingOn_ = a
};
goog.fx.Dragger.prototype.getEnabled = function() {
  return this.enabled_
};
goog.fx.Dragger.prototype.setEnabled = function(a) {
  this.enabled_ = a
};
goog.fx.Dragger.prototype.disposeInternal = function() {
  goog.fx.Dragger.superClass_.disposeInternal.call(this);
  goog.events.unlisten(this.handle, [goog.events.EventType.TOUCHSTART, goog.events.EventType.MOUSEDOWN], this.startDrag, !1, this);
  this.cleanUpAfterDragging_();
  this.eventHandler_ = this.handle = this.target = null
};
goog.fx.Dragger.prototype.isRightToLeft_ = function() {
  goog.isDef(this.rightToLeft_) || (this.rightToLeft_ = goog.style.isRightToLeft(this.target));
  return this.rightToLeft_
};
goog.fx.Dragger.prototype.startDrag = function(a) {
  var c = a.type == goog.events.EventType.MOUSEDOWN;
  if(this.enabled_ && !this.dragging_ && (!c || a.isMouseActionButton())) {
    this.maybeReinitTouchEvent_(a);
    if(0 == this.hysteresisDistanceSquared_) {
      if(this.fireDragStart_(a)) {
        this.dragging_ = !0, a.preventDefault()
      }else {
        return
      }
    }else {
      a.preventDefault()
    }
    this.setupDragHandlers();
    this.clientX = this.startX = a.clientX;
    this.clientY = this.startY = a.clientY;
    this.screenX = a.screenX;
    this.screenY = a.screenY;
    this.deltaX = this.useRightPositioningForRtl_ ? goog.style.bidi.getOffsetStart(this.target) : this.target.offsetLeft;
    this.deltaY = this.target.offsetTop;
    this.pageScroll = goog.dom.getDomHelper(this.document_).getDocumentScroll();
    this.mouseDownTime_ = goog.now()
  }else {
    this.dispatchEvent(goog.fx.Dragger.EventType.EARLY_CANCEL)
  }
};
goog.fx.Dragger.prototype.setupDragHandlers = function() {
  var a = this.document_, c = a.documentElement, d = !goog.fx.Dragger.HAS_SET_CAPTURE_;
  this.eventHandler_.listen(a, [goog.events.EventType.TOUCHMOVE, goog.events.EventType.MOUSEMOVE], this.handleMove_, d);
  this.eventHandler_.listen(a, [goog.events.EventType.TOUCHEND, goog.events.EventType.MOUSEUP], this.endDrag, d);
  goog.fx.Dragger.HAS_SET_CAPTURE_ ? (c.setCapture(!1), this.eventHandler_.listen(c, goog.events.EventType.LOSECAPTURE, this.endDrag)) : this.eventHandler_.listen(goog.dom.getWindow(a), goog.events.EventType.BLUR, this.endDrag);
  goog.userAgent.IE && this.ieDragStartCancellingOn_ && this.eventHandler_.listen(a, goog.events.EventType.DRAGSTART, goog.events.Event.preventDefault);
  this.scrollTarget_ && this.eventHandler_.listen(this.scrollTarget_, goog.events.EventType.SCROLL, this.onScroll_, d)
};
goog.fx.Dragger.prototype.fireDragStart_ = function(a) {
  return this.dispatchEvent(new goog.fx.DragEvent(goog.fx.Dragger.EventType.START, this, a.clientX, a.clientY, a))
};
goog.fx.Dragger.prototype.cleanUpAfterDragging_ = function() {
  this.eventHandler_.removeAll();
  goog.fx.Dragger.HAS_SET_CAPTURE_ && this.document_.releaseCapture()
};
goog.fx.Dragger.prototype.endDrag = function(a, c) {
  this.cleanUpAfterDragging_();
  if(this.dragging_) {
    this.maybeReinitTouchEvent_(a);
    this.dragging_ = !1;
    var d = this.limitX(this.deltaX), e = this.limitY(this.deltaY);
    this.dispatchEvent(new goog.fx.DragEvent(goog.fx.Dragger.EventType.END, this, a.clientX, a.clientY, a, d, e, c || a.type == goog.events.EventType.TOUCHCANCEL))
  }else {
    this.dispatchEvent(goog.fx.Dragger.EventType.EARLY_CANCEL)
  }
  (a.type == goog.events.EventType.TOUCHEND || a.type == goog.events.EventType.TOUCHCANCEL) && a.preventDefault()
};
goog.fx.Dragger.prototype.endDragCancel = function(a) {
  this.endDrag(a, !0)
};
goog.fx.Dragger.prototype.maybeReinitTouchEvent_ = function(a) {
  var c = a.type;
  c == goog.events.EventType.TOUCHSTART || c == goog.events.EventType.TOUCHMOVE ? a.init(a.getBrowserEvent().targetTouches[0], a.currentTarget) : (c == goog.events.EventType.TOUCHEND || c == goog.events.EventType.TOUCHCANCEL) && a.init(a.getBrowserEvent().changedTouches[0], a.currentTarget)
};
goog.fx.Dragger.prototype.handleMove_ = function(a) {
  if(this.enabled_) {
    this.maybeReinitTouchEvent_(a);
    var c = (this.useRightPositioningForRtl_ && this.isRightToLeft_() ? -1 : 1) * (a.clientX - this.clientX), d = a.clientY - this.clientY;
    this.clientX = a.clientX;
    this.clientY = a.clientY;
    this.screenX = a.screenX;
    this.screenY = a.screenY;
    if(!this.dragging_) {
      var e = this.startX - this.clientX, f = this.startY - this.clientY;
      if(e * e + f * f > this.hysteresisDistanceSquared_) {
        if(this.fireDragStart_(a)) {
          this.dragging_ = !0
        }else {
          this.isDisposed() || this.endDrag(a);
          return
        }
      }
    }
    d = this.calculatePosition_(c, d);
    c = d.x;
    d = d.y;
    this.dragging_ && this.dispatchEvent(new goog.fx.DragEvent(goog.fx.Dragger.EventType.BEFOREDRAG, this, a.clientX, a.clientY, a, c, d)) && (this.doDrag(a, c, d, !1), a.preventDefault())
  }
};
goog.fx.Dragger.prototype.calculatePosition_ = function(a, c) {
  var d = goog.dom.getDomHelper(this.document_).getDocumentScroll(), a = a + (d.x - this.pageScroll.x), c = c + (d.y - this.pageScroll.y);
  this.pageScroll = d;
  this.deltaX += a;
  this.deltaY += c;
  var d = this.limitX(this.deltaX), e = this.limitY(this.deltaY);
  return new goog.math.Coordinate(d, e)
};
goog.fx.Dragger.prototype.onScroll_ = function(a) {
  var c = this.calculatePosition_(0, 0);
  a.clientX = this.clientX;
  a.clientY = this.clientY;
  this.doDrag(a, c.x, c.y, !0)
};
goog.fx.Dragger.prototype.doDrag = function(a, c, d) {
  this.defaultAction(c, d);
  this.dispatchEvent(new goog.fx.DragEvent(goog.fx.Dragger.EventType.DRAG, this, a.clientX, a.clientY, a, c, d))
};
goog.fx.Dragger.prototype.limitX = function(a) {
  var c = this.limits, d = !isNaN(c.left) ? c.left : null, c = !isNaN(c.width) ? c.width : 0;
  return Math.min(null != d ? d + c : Infinity, Math.max(null != d ? d : -Infinity, a))
};
goog.fx.Dragger.prototype.limitY = function(a) {
  var c = this.limits, d = !isNaN(c.top) ? c.top : null, c = !isNaN(c.height) ? c.height : 0;
  return Math.min(null != d ? d + c : Infinity, Math.max(null != d ? d : -Infinity, a))
};
goog.fx.Dragger.prototype.defaultAction = function(a, c) {
  this.useRightPositioningForRtl_ && this.isRightToLeft_() ? this.target.style.right = a + "px" : this.target.style.left = a + "px";
  this.target.style.top = c + "px"
};
goog.fx.Dragger.prototype.isDragging = function() {
  return this.dragging_
};
goog.fx.DragEvent = function(a, c, d, e, f, h, i, j) {
  goog.events.Event.call(this, a);
  this.clientX = d;
  this.clientY = e;
  this.browserEvent = f;
  this.left = goog.isDef(h) ? h : c.deltaX;
  this.top = goog.isDef(i) ? i : c.deltaY;
  this.dragger = c;
  this.dragCanceled = !!j
};
goog.inherits(goog.fx.DragEvent, goog.events.Event);
var annotorious = {dom:{}};
annotorious.dom.getOffset = function(a) {
  for(var c = 0, d = 0;a && !isNaN(a.offsetLeft) && !isNaN(a.offsetTop);) {
    c += a.offsetLeft - a.scrollLeft, d += a.offsetTop - a.scrollTop, a = a.offsetParent
  }
  return{top:d, left:c}
};
annotorious.dom.isInViewport = function(a) {
  for(var c = a.offsetTop, d = a.offsetLeft, e = a.offsetWidth, f = a.offsetHeight;a.offsetParent;) {
    a = a.offsetParent, c += a.offsetTop, d += a.offsetLeft
  }
  return c < window.pageYOffset + window.innerHeight && d < window.pageXOffset + window.innerWidth && c + f > window.pageYOffset && d + e > window.pageXOffset
};
annotorious.dom.addOnLoadHandler = function(a) {
  window.addEventListener ? window.addEventListener("load", a, !1) : window.attachEvent && window.attachEvent("onload", a)
};
annotorious.dom.makeHResizable = function(a, c) {
  var d = goog.dom.createElement("div");
  goog.style.setStyle(d, "position", "absolute");
  goog.style.setStyle(d, "top", "0px");
  goog.style.setStyle(d, "right", "0px");
  goog.style.setStyle(d, "width", "5px");
  goog.style.setStyle(d, "height", "100%");
  goog.style.setStyle(d, "cursor", "e-resize");
  goog.dom.appendChild(a, d);
  var e = goog.style.getBorderBox(a), e = goog.style.getBounds(a).width - e.right - e.left, d = new goog.fx.Dragger(d);
  d.setLimits(new goog.math.Rect(e, 0, 800, 0));
  d.defaultAction = function(d) {
    goog.style.setStyle(a, "width", d + "px");
    c && c()
  }
};
annotorious.dom.toAbsoluteURL = function(a) {
  if(0 < a.indexOf("://")) {
    return a
  }
  var c = document.createElement("a");
  c.href = a;
  return c.protocol + "//" + c.host + c.pathname
};
annotorious.events = {};
annotorious.events.EventBroker = function() {
  this._handlers = []
};
annotorious.events.EventBroker.prototype.addHandler = function(a, c) {
  this._handlers[a] || (this._handlers[a] = []);
  this._handlers[a].push(c)
};
annotorious.events.EventBroker.prototype.removeHandler = function(a, c) {
  var d = this._handlers[a];
  d && goog.array.remove(d, c)
};
annotorious.events.EventBroker.prototype.fireEvent = function(a, c, d) {
  var e = !1;
  (a = this._handlers[a]) && goog.array.forEach(a, function(a) {
    a = a(c, d);
    goog.isDef(a) && !a && (e = !0)
  });
  return e
};
annotorious.events.EventType = {MOUSE_OVER_ANNOTATABLE_ITEM:"onMouseOverItem", MOUSE_OUT_OF_ANNOTATABLE_ITEM:"onMouseOutOfItem", MOUSE_OVER_ANNOTATION:"onMouseOverAnnotation", MOUSE_OUT_OF_ANNOTATION:"onMouseOutOfAnnotation", SELECTION_STARTED:"onSelectionStarted", SELECTION_CANCELED:"onSelectionCanceled", SELECTION_COMPLETED:"onSelectionCompleted", SELECTION_CHANGED:"onSelectionChanged", EDITOR_SHOWN:"onEditorShown", POPUP_SHOWN:"onPopupShown", BEFORE_POPUP_HIDE:"beforePopupHide", BEFORE_ANNOTATION_REMOVED:"beforeAnnotationRemoved", 
ANNOTATION_REMOVED:"onAnnotationRemoved", ANNOTATION_CREATED:"onAnnotationCreated", ANNOTATION_UPDATED:"onAnnotationUpdated", ANNOTATION_CLICKED:"onAnnotationClicked"};
goog.iter = {};
goog.iter.StopIteration = "StopIteration" in goog.global ? goog.global.StopIteration : Error("StopIteration");
goog.iter.Iterator = function() {
};
goog.iter.Iterator.prototype.next = function() {
  throw goog.iter.StopIteration;
};
goog.iter.Iterator.prototype.__iterator__ = function() {
  return this
};
goog.iter.toIterator = function(a) {
  if(a instanceof goog.iter.Iterator) {
    return a
  }
  if("function" == typeof a.__iterator__) {
    return a.__iterator__(!1)
  }
  if(goog.isArrayLike(a)) {
    var c = 0, d = new goog.iter.Iterator;
    d.next = function() {
      for(;;) {
        if(c >= a.length) {
          throw goog.iter.StopIteration;
        }
        if(c in a) {
          return a[c++]
        }
        c++
      }
    };
    return d
  }
  throw Error("Not implemented");
};
goog.iter.forEach = function(a, c, d) {
  if(goog.isArrayLike(a)) {
    try {
      goog.array.forEach(a, c, d)
    }catch(e) {
      if(e !== goog.iter.StopIteration) {
        throw e;
      }
    }
  }else {
    a = goog.iter.toIterator(a);
    try {
      for(;;) {
        c.call(d, a.next(), void 0, a)
      }
    }catch(f) {
      if(f !== goog.iter.StopIteration) {
        throw f;
      }
    }
  }
};
goog.iter.filter = function(a, c, d) {
  var e = goog.iter.toIterator(a), a = new goog.iter.Iterator;
  a.next = function() {
    for(;;) {
      var a = e.next();
      if(c.call(d, a, void 0, e)) {
        return a
      }
    }
  };
  return a
};
goog.iter.range = function(a, c, d) {
  var e = 0, f = a, h = d || 1;
  1 < arguments.length && (e = a, f = c);
  if(0 == h) {
    throw Error("Range step argument must not be zero");
  }
  var i = new goog.iter.Iterator;
  i.next = function() {
    if(0 < h && e >= f || 0 > h && e <= f) {
      throw goog.iter.StopIteration;
    }
    var a = e;
    e += h;
    return a
  };
  return i
};
goog.iter.join = function(a, c) {
  return goog.iter.toArray(a).join(c)
};
goog.iter.map = function(a, c, d) {
  var e = goog.iter.toIterator(a), a = new goog.iter.Iterator;
  a.next = function() {
    for(;;) {
      var a = e.next();
      return c.call(d, a, void 0, e)
    }
  };
  return a
};
goog.iter.reduce = function(a, c, d, e) {
  var f = d;
  goog.iter.forEach(a, function(a) {
    f = c.call(e, f, a)
  });
  return f
};
goog.iter.some = function(a, c, d) {
  a = goog.iter.toIterator(a);
  try {
    for(;;) {
      if(c.call(d, a.next(), void 0, a)) {
        return!0
      }
    }
  }catch(e) {
    if(e !== goog.iter.StopIteration) {
      throw e;
    }
  }
  return!1
};
goog.iter.every = function(a, c, d) {
  a = goog.iter.toIterator(a);
  try {
    for(;;) {
      if(!c.call(d, a.next(), void 0, a)) {
        return!1
      }
    }
  }catch(e) {
    if(e !== goog.iter.StopIteration) {
      throw e;
    }
  }
  return!0
};
goog.iter.chain = function(a) {
  var c = arguments, d = c.length, e = 0, f = new goog.iter.Iterator;
  f.next = function() {
    try {
      if(e >= d) {
        throw goog.iter.StopIteration;
      }
      return goog.iter.toIterator(c[e]).next()
    }catch(a) {
      if(a !== goog.iter.StopIteration || e >= d) {
        throw a;
      }
      e++;
      return this.next()
    }
  };
  return f
};
goog.iter.dropWhile = function(a, c, d) {
  var e = goog.iter.toIterator(a), a = new goog.iter.Iterator, f = !0;
  a.next = function() {
    for(;;) {
      var a = e.next();
      if(!f || !c.call(d, a, void 0, e)) {
        return f = !1, a
      }
    }
  };
  return a
};
goog.iter.takeWhile = function(a, c, d) {
  var e = goog.iter.toIterator(a), a = new goog.iter.Iterator, f = !0;
  a.next = function() {
    for(;;) {
      if(f) {
        var a = e.next();
        if(c.call(d, a, void 0, e)) {
          return a
        }
        f = !1
      }else {
        throw goog.iter.StopIteration;
      }
    }
  };
  return a
};
goog.iter.toArray = function(a) {
  if(goog.isArrayLike(a)) {
    return goog.array.toArray(a)
  }
  var a = goog.iter.toIterator(a), c = [];
  goog.iter.forEach(a, function(a) {
    c.push(a)
  });
  return c
};
goog.iter.equals = function(a, c) {
  var a = goog.iter.toIterator(a), c = goog.iter.toIterator(c), d, e;
  try {
    for(;;) {
      d = e = !1;
      var f = a.next();
      d = !0;
      var h = c.next();
      e = !0;
      if(f != h) {
        break
      }
    }
  }catch(i) {
    if(i !== goog.iter.StopIteration) {
      throw i;
    }
    if(d && !e) {
      return!1
    }
    if(!e) {
      try {
        c.next()
      }catch(j) {
        if(j !== goog.iter.StopIteration) {
          throw j;
        }
        return!0
      }
    }
  }
  return!1
};
goog.iter.nextOrValue = function(a, c) {
  try {
    return goog.iter.toIterator(a).next()
  }catch(d) {
    if(d != goog.iter.StopIteration) {
      throw d;
    }
    return c
  }
};
goog.iter.product = function(a) {
  if(goog.array.some(arguments, function(a) {
    return!a.length
  }) || !arguments.length) {
    return new goog.iter.Iterator
  }
  var c = new goog.iter.Iterator, d = arguments, e = goog.array.repeat(0, d.length);
  c.next = function() {
    if(e) {
      for(var a = goog.array.map(e, function(a, c) {
        return d[c][a]
      }), c = e.length - 1;0 <= c;c--) {
        goog.asserts.assert(e);
        if(e[c] < d[c].length - 1) {
          e[c]++;
          break
        }
        if(0 == c) {
          e = null;
          break
        }
        e[c] = 0
      }
      return a
    }
    throw goog.iter.StopIteration;
  };
  return c
};
goog.iter.cycle = function(a) {
  var c = goog.iter.toIterator(a), d = [], e = 0, a = new goog.iter.Iterator, f = !1;
  a.next = function() {
    var a = null;
    if(!f) {
      try {
        return a = c.next(), d.push(a), a
      }catch(i) {
        if(i != goog.iter.StopIteration || goog.array.isEmpty(d)) {
          throw i;
        }
        f = !0
      }
    }
    a = d[e];
    e = (e + 1) % d.length;
    return a
  };
  return a
};
goog.structs = {};
goog.structs.getCount = function(a) {
  return"function" == typeof a.getCount ? a.getCount() : goog.isArrayLike(a) || goog.isString(a) ? a.length : goog.object.getCount(a)
};
goog.structs.getValues = function(a) {
  if("function" == typeof a.getValues) {
    return a.getValues()
  }
  if(goog.isString(a)) {
    return a.split("")
  }
  if(goog.isArrayLike(a)) {
    for(var c = [], d = a.length, e = 0;e < d;e++) {
      c.push(a[e])
    }
    return c
  }
  return goog.object.getValues(a)
};
goog.structs.getKeys = function(a) {
  if("function" == typeof a.getKeys) {
    return a.getKeys()
  }
  if("function" != typeof a.getValues) {
    if(goog.isArrayLike(a) || goog.isString(a)) {
      for(var c = [], a = a.length, d = 0;d < a;d++) {
        c.push(d)
      }
      return c
    }
    return goog.object.getKeys(a)
  }
};
goog.structs.contains = function(a, c) {
  return"function" == typeof a.contains ? a.contains(c) : "function" == typeof a.containsValue ? a.containsValue(c) : goog.isArrayLike(a) || goog.isString(a) ? goog.array.contains(a, c) : goog.object.containsValue(a, c)
};
goog.structs.isEmpty = function(a) {
  return"function" == typeof a.isEmpty ? a.isEmpty() : goog.isArrayLike(a) || goog.isString(a) ? goog.array.isEmpty(a) : goog.object.isEmpty(a)
};
goog.structs.clear = function(a) {
  "function" == typeof a.clear ? a.clear() : goog.isArrayLike(a) ? goog.array.clear(a) : goog.object.clear(a)
};
goog.structs.forEach = function(a, c, d) {
  if("function" == typeof a.forEach) {
    a.forEach(c, d)
  }else {
    if(goog.isArrayLike(a) || goog.isString(a)) {
      goog.array.forEach(a, c, d)
    }else {
      for(var e = goog.structs.getKeys(a), f = goog.structs.getValues(a), h = f.length, i = 0;i < h;i++) {
        c.call(d, f[i], e && e[i], a)
      }
    }
  }
};
goog.structs.filter = function(a, c, d) {
  if("function" == typeof a.filter) {
    return a.filter(c, d)
  }
  if(goog.isArrayLike(a) || goog.isString(a)) {
    return goog.array.filter(a, c, d)
  }
  var e, f = goog.structs.getKeys(a), h = goog.structs.getValues(a), i = h.length;
  if(f) {
    e = {};
    for(var j = 0;j < i;j++) {
      c.call(d, h[j], f[j], a) && (e[f[j]] = h[j])
    }
  }else {
    e = [];
    for(j = 0;j < i;j++) {
      c.call(d, h[j], void 0, a) && e.push(h[j])
    }
  }
  return e
};
goog.structs.map = function(a, c, d) {
  if("function" == typeof a.map) {
    return a.map(c, d)
  }
  if(goog.isArrayLike(a) || goog.isString(a)) {
    return goog.array.map(a, c, d)
  }
  var e, f = goog.structs.getKeys(a), h = goog.structs.getValues(a), i = h.length;
  if(f) {
    e = {};
    for(var j = 0;j < i;j++) {
      e[f[j]] = c.call(d, h[j], f[j], a)
    }
  }else {
    e = [];
    for(j = 0;j < i;j++) {
      e[j] = c.call(d, h[j], void 0, a)
    }
  }
  return e
};
goog.structs.some = function(a, c, d) {
  if("function" == typeof a.some) {
    return a.some(c, d)
  }
  if(goog.isArrayLike(a) || goog.isString(a)) {
    return goog.array.some(a, c, d)
  }
  for(var e = goog.structs.getKeys(a), f = goog.structs.getValues(a), h = f.length, i = 0;i < h;i++) {
    if(c.call(d, f[i], e && e[i], a)) {
      return!0
    }
  }
  return!1
};
goog.structs.every = function(a, c, d) {
  if("function" == typeof a.every) {
    return a.every(c, d)
  }
  if(goog.isArrayLike(a) || goog.isString(a)) {
    return goog.array.every(a, c, d)
  }
  for(var e = goog.structs.getKeys(a), f = goog.structs.getValues(a), h = f.length, i = 0;i < h;i++) {
    if(!c.call(d, f[i], e && e[i], a)) {
      return!1
    }
  }
  return!0
};
goog.structs.Map = function(a, c) {
  this.map_ = {};
  this.keys_ = [];
  var d = arguments.length;
  if(1 < d) {
    if(d % 2) {
      throw Error("Uneven number of arguments");
    }
    for(var e = 0;e < d;e += 2) {
      this.set(arguments[e], arguments[e + 1])
    }
  }else {
    a && this.addAll(a)
  }
};
goog.structs.Map.prototype.count_ = 0;
goog.structs.Map.prototype.version_ = 0;
goog.structs.Map.prototype.getCount = function() {
  return this.count_
};
goog.structs.Map.prototype.getValues = function() {
  this.cleanupKeysArray_();
  for(var a = [], c = 0;c < this.keys_.length;c++) {
    a.push(this.map_[this.keys_[c]])
  }
  return a
};
goog.structs.Map.prototype.getKeys = function() {
  this.cleanupKeysArray_();
  return this.keys_.concat()
};
goog.structs.Map.prototype.containsKey = function(a) {
  return goog.structs.Map.hasKey_(this.map_, a)
};
goog.structs.Map.prototype.containsValue = function(a) {
  for(var c = 0;c < this.keys_.length;c++) {
    var d = this.keys_[c];
    if(goog.structs.Map.hasKey_(this.map_, d) && this.map_[d] == a) {
      return!0
    }
  }
  return!1
};
goog.structs.Map.prototype.equals = function(a, c) {
  if(this === a) {
    return!0
  }
  if(this.count_ != a.getCount()) {
    return!1
  }
  var d = c || goog.structs.Map.defaultEquals;
  this.cleanupKeysArray_();
  for(var e, f = 0;e = this.keys_[f];f++) {
    if(!d(this.get(e), a.get(e))) {
      return!1
    }
  }
  return!0
};
goog.structs.Map.defaultEquals = function(a, c) {
  return a === c
};
goog.structs.Map.prototype.isEmpty = function() {
  return 0 == this.count_
};
goog.structs.Map.prototype.clear = function() {
  this.map_ = {};
  this.version_ = this.count_ = this.keys_.length = 0
};
goog.structs.Map.prototype.remove = function(a) {
  return goog.structs.Map.hasKey_(this.map_, a) ? (delete this.map_[a], this.count_--, this.version_++, this.keys_.length > 2 * this.count_ && this.cleanupKeysArray_(), !0) : !1
};
goog.structs.Map.prototype.cleanupKeysArray_ = function() {
  if(this.count_ != this.keys_.length) {
    for(var a = 0, c = 0;a < this.keys_.length;) {
      var d = this.keys_[a];
      goog.structs.Map.hasKey_(this.map_, d) && (this.keys_[c++] = d);
      a++
    }
    this.keys_.length = c
  }
  if(this.count_ != this.keys_.length) {
    for(var e = {}, c = a = 0;a < this.keys_.length;) {
      d = this.keys_[a], goog.structs.Map.hasKey_(e, d) || (this.keys_[c++] = d, e[d] = 1), a++
    }
    this.keys_.length = c
  }
};
goog.structs.Map.prototype.get = function(a, c) {
  return goog.structs.Map.hasKey_(this.map_, a) ? this.map_[a] : c
};
goog.structs.Map.prototype.set = function(a, c) {
  goog.structs.Map.hasKey_(this.map_, a) || (this.count_++, this.keys_.push(a), this.version_++);
  this.map_[a] = c
};
goog.structs.Map.prototype.addAll = function(a) {
  var c;
  a instanceof goog.structs.Map ? (c = a.getKeys(), a = a.getValues()) : (c = goog.object.getKeys(a), a = goog.object.getValues(a));
  for(var d = 0;d < c.length;d++) {
    this.set(c[d], a[d])
  }
};
goog.structs.Map.prototype.clone = function() {
  return new goog.structs.Map(this)
};
goog.structs.Map.prototype.transpose = function() {
  for(var a = new goog.structs.Map, c = 0;c < this.keys_.length;c++) {
    var d = this.keys_[c];
    a.set(this.map_[d], d)
  }
  return a
};
goog.structs.Map.prototype.toObject = function() {
  this.cleanupKeysArray_();
  for(var a = {}, c = 0;c < this.keys_.length;c++) {
    var d = this.keys_[c];
    a[d] = this.map_[d]
  }
  return a
};
goog.structs.Map.prototype.getKeyIterator = function() {
  return this.__iterator__(!0)
};
goog.structs.Map.prototype.getValueIterator = function() {
  return this.__iterator__(!1)
};
goog.structs.Map.prototype.__iterator__ = function(a) {
  this.cleanupKeysArray_();
  var c = 0, d = this.keys_, e = this.map_, f = this.version_, h = this, i = new goog.iter.Iterator;
  i.next = function() {
    for(;;) {
      if(f != h.version_) {
        throw Error("The map has changed since the iterator was created");
      }
      if(c >= d.length) {
        throw goog.iter.StopIteration;
      }
      var i = d[c++];
      return a ? i : e[i]
    }
  };
  return i
};
goog.structs.Map.hasKey_ = function(a, c) {
  return Object.prototype.hasOwnProperty.call(a, c)
};
annotorious.shape = {};
annotorious.shape.geom = {};
annotorious.shape.geom.Point = function(a, c) {
  this.x = a;
  this.y = c
};
annotorious.shape.geom.Polygon = function(a) {
  this.points = a
};
annotorious.shape.geom.Polygon.computeArea = function(a) {
  for(var c = 0, d = a.length - 1, e = 0;e < a.length;e++) {
    c += (a[d].x + a[e].x) * (a[d].y - a[e].y), d = e
  }
  return c / 2
};
annotorious.shape.geom.Polygon.isClockwise = function(a) {
  return 0 > annotorious.shape.geom.Polygon.computeArea(a)
};
annotorious.shape.geom.Polygon.computeCentroid = function(a) {
  for(var c = 0, d = 0, e, f = a.length - 1, h = 0;h < a.length;h++) {
    e = a[h].x * a[f].y - a[f].x * a[h].y, c += (a[h].x + a[f].x) * e, d += (a[h].y + a[f].y) * e, f = h
  }
  e = 6 * annotorious.shape.geom.Polygon.computeArea(a);
  return new annotorious.shape.geom.Point(Math.abs(c / e), Math.abs(d / e))
};
annotorious.shape.geom.Polygon._expandTriangle = function(a, c) {
  function d(a, c, d) {
    var e = a.x - c.x, c = a.y - c.y, f = 0 < d ? 1 : 0 > d ? -1 : 0, h = (0 < e ? 1 : 0 > e ? -1 : 0) * f, f = (0 < c ? 1 : 0 > c ? -1 : 0) * f, d = Math.sqrt(Math.pow(d, 2) / (1 + Math.pow(e / c, 2)));
    return{x:a.x + Math.abs(e / c * d) * h, y:a.y + Math.abs(d) * f}
  }
  for(var e = annotorious.shape.geom.Polygon.computeCentroid(a), f = [], h = 0;h < a.length;h++) {
    var i = annotorious.shape.geom.Polygon.isClockwise(a) ? -1 : 1;
    f.push(d(a[h], e, i * c))
  }
  return f
};
annotorious.shape.geom.Polygon.expandPolygon = function(a, c) {
  var d = annotorious.shape.geom.Polygon.isClockwise(a) ? -1 : 1;
  if(4 > a.length) {
    return annotorious.shape.geom.Polygon._expandTriangle(a, d * c)
  }
  for(var e = a.length - 1, f = 1, h = [], i = 0;i < a.length;i++) {
    e = annotorious.shape.geom.Polygon._expandTriangle([a[e], a[i], a[f]], d * c), h.push(e[1]), e = i, f++, f > a.length - 1 && (f = 0)
  }
  return h
};
annotorious.shape.geom.Rectangle = function(a, c, d, e) {
  0 < d ? (this.x = a, this.width = d) : (this.x = a + d, this.width = -d);
  0 < e ? (this.y = c, this.height = e) : (this.y = c + e, this.height = -e)
};
annotorious.shape.Shape = function(a, c, d, e) {
  this.type = a;
  this.geometry = c;
  d && (this.units = d);
  this.style = e ? e : {}
};
annotorious.shape.ShapeType = {POINT:"point", RECTANGLE:"rect", POLYGON:"polygon"};
annotorious.shape.Units = {PIXEL:"pixel", FRACTION:"fraction"};
annotorious.shape.intersects = function(a, c, d) {
  if(a.type == annotorious.shape.ShapeType.RECTANGLE) {
    return c < a.geometry.x || d < a.geometry.y || c > a.geometry.x + a.geometry.width || d > a.geometry.y + a.geometry.height ? !1 : !0
  }
  if(a.type == annotorious.shape.ShapeType.POLYGON) {
    for(var a = a.geometry.points, e = !1, f = a.length - 1, h = 0;h < a.length;h++) {
      a[h].y > d != a[f].y > d && c < (a[f].x - a[h].x) * (d - a[h].y) / (a[f].y - a[h].y) + a[h].x && (e = !e), f = h
    }
    return e
  }
  return!1
};
annotorious.shape.getSize = function(a) {
  return a.type == annotorious.shape.ShapeType.RECTANGLE ? a.geometry.width * a.geometry.height : a.type == annotorious.shape.ShapeType.POLYGON ? Math.abs(annotorious.shape.geom.Polygon.computeArea(a.geometry.points)) : 0
};
annotorious.shape.getBoundingRect = function(a) {
  if(a.type == annotorious.shape.ShapeType.RECTANGLE) {
    return a
  }
  if(a.type == annotorious.shape.ShapeType.POLYGON) {
    for(var c = a.geometry.points, d = c[0].x, e = c[0].x, f = c[0].y, h = c[0].y, i = 1;i < c.length;i++) {
      c[i].x > e && (e = c[i].x), c[i].x < d && (d = c[i].x), c[i].y > h && (h = c[i].y), c[i].y < f && (f = c[i].y)
    }
    return new annotorious.shape.Shape(annotorious.shape.ShapeType.RECTANGLE, new annotorious.shape.geom.Rectangle(d, f, e - d, h - f), !1, a.style)
  }
};
annotorious.shape.getCentroid = function(a) {
  if(a.type == annotorious.shape.ShapeType.RECTANGLE) {
    return a = a.geometry, new annotorious.shape.geom.Point(a.x + a.width / 2, a.y + a.height / 2)
  }
  if(a.type == annotorious.shape.ShapeType.POLYGON) {
    return annotorious.shape.geom.Polygon.computeCentroid(a.geometry.points)
  }
};
annotorious.shape.expand = function(a, c) {
  return new annotorious.shape.Shape(annotorious.shape.ShapeType.POLYGON, new annotorious.shape.geom.Polygon(annotorious.shape.geom.Polygon.expandPolygon(a.geometry.points, c)), !1, a.style)
};
annotorious.shape.transform = function(a, c) {
  if(a.type == annotorious.shape.ShapeType.RECTANGLE) {
    var d = c(a.geometry);
    return new annotorious.shape.Shape(annotorious.shape.ShapeType.RECTANGLE, d, !1, a.style)
  }
  if(a.type == annotorious.shape.ShapeType.POLYGON) {
    var e = [];
    goog.array.forEach(a.geometry.points, function(a) {
      e.push(c(a))
    });
    return new annotorious.shape.Shape(annotorious.shape.ShapeType.POLYGON, new annotorious.shape.geom.Polygon(e), !1, a.style)
  }
};
annotorious.shape.hashCode = function(a) {
  return JSON.stringify(a.geometry)
};
annotorious.Annotation = function(a, c, d) {
  this.src = a;
  this.text = c;
  this.shapes = [d];
  this.context = document.URL
};
annotorious.mediatypes = {};
annotorious.mediatypes.Module = function() {
};
annotorious.mediatypes.Module.prototype._initFields = function(a) {
  this._annotators = new goog.structs.Map;
  this._annotatorsById = new goog.structs.Map;
  this._eventHandlers = [];
  this._plugins = [];
  this._itemsToLoad = [];
  this._bufferedForAdding = [];
  this._bufferedForRemoval = [];
  this._cachedGlobalSettings = {hide_selection_widget:!1, hide_annotations:!1};
  this._cachedItemSettings = new goog.structs.Map;
  this._cachedProperties = void 0;
  this._preLoad = a
};
annotorious.mediatypes.Module.prototype._getSettings = function(a) {
  var c = this._cachedItemSettings.get(a);
  c || (c = {hide_selection_widget:!1, hide_annotations:!1}, this._cachedItemSettings.set(a, c));
  return c
};
annotorious.mediatypes.Module.prototype._generateId = function() {
  return this._annotatorsById.getCount() + 1
};
annotorious.mediatypes.Module.prototype._initAnnotator = function(a) {
  var c = this, d = this.getItemURL(a), e = this.getItemID(a);
  if(!("undefined" !== typeof e && this._annotatorsById.get(e))) {
    var f = this.newAnnotator(a);
    if("undefined" === typeof e || "" === e) {
      e = this._generateId(), this.setItemID(a, e)
    }
    this._annotatorsById.set(e, f);
    console.log(e);
    var h = [], i = [];
    goog.array.forEach(this._eventHandlers, function(a) {
      f.addHandler(a.type, a.handler)
    });
    goog.array.forEach(this._plugins, function(a) {
      c._initPlugin(a, f)
    });
    goog.array.forEach(this._bufferedForAdding, function(a) {
      a.src == d && (f.addAnnotation(a), h.push(a))
    });
    goog.array.forEach(this._bufferedForRemoval, function(a) {
      a.src == d && (f.removeAnnotation(a), i.push(a))
    });
    goog.array.forEach(h, function(a) {
      goog.array.remove(c._bufferedForAdding, a)
    });
    goog.array.forEach(i, function(a) {
      goog.array.remove(c._bufferedForRemoval, a)
    });
    (e = this._cachedItemSettings.get(d)) ? (e.hide_selection_widget && f.hideSelectionWidget(), e.hide_annotations && f.hideAnnotations(), this._cachedItemSettings.remove(d)) : (this._cachedGlobalSettings.hide_selection_widget && f.hideSelectionWidget(), this._cachedGlobalSettings.hide_annotations && f.hideAnnotations());
    this._cachedProperties && f.setProperties(this._cachedProperties);
    this._annotators.set(d, f);
    goog.array.remove(this._itemsToLoad, a)
  }
};
annotorious.mediatypes.Module.prototype._initPlugin = function(a, c) {
  if(a.onInitAnnotator) {
    a.onInitAnnotator(c)
  }
};
annotorious.mediatypes.Module.prototype._lazyLoad = function() {
  var a, c;
  for(c = this._itemsToLoad.length;0 < c;c--) {
    a = this._itemsToLoad[c - 1], annotorious.dom.isInViewport(a) && this._initAnnotator(a)
  }
};
annotorious.mediatypes.Module.prototype._setAnnotationVisibility = function(a, c) {
  if(a) {
    var d = this._annotators.get(a);
    d ? c ? d.showAnnotations() : d.hideAnnotations() : this._getSettings(a).hide_annotations = c
  }else {
    goog.array.forEach(this._annotators.getValues(), function(a) {
      c ? a.showAnnotations() : a.hideAnnotations()
    }), this._cachedGlobalSettings.hide_annotations = !c, goog.array.forEach(this._cachedItemSettings.getValues(), function(a) {
      a.hide_annotations = !c
    })
  }
};
annotorious.mediatypes.Module.prototype._setSelectionWidgetVisibility = function(a, c) {
  if(a) {
    var d = this._annotators.get(a);
    d ? c ? d.showSelectionWidget() : d.hideSelectionWidget() : this._getSettings(a).hide_selection_widget = c
  }else {
    goog.array.forEach(this._annotators.getValues(), function(a) {
      c ? a.showSelectionWidget() : a.hideSelectionWidget()
    }), this._cachedGlobalSettings.hide_selection_widget = !c, goog.array.forEach(this._cachedItemSettings.getValues(), function(a) {
      a.hide_selection_widget = !c
    })
  }
};
annotorious.mediatypes.Module.prototype.activateSelector = function(a, c) {
  var d = void 0, e = void 0;
  goog.isString(a) ? (d = a, e = c) : goog.isFunction(a) && (e = a);
  d ? (d = this._annotators.get(d)) && d.activateSelector(e) : goog.array.forEach(this._annotators.getValues(), function(a) {
    a.activateSelector(e)
  })
};
annotorious.mediatypes.Module.prototype.addAnnotation = function(a, c) {
  if(this.annotatesItem(a.src)) {
    var d = this._annotators.get(a.src);
    d ? d.addAnnotation(a, c) : (this._bufferedForAdding.push(a), c && goog.array.remove(this._bufferedForAdding, c))
  }
};
annotorious.mediatypes.Module.prototype.addHandler = function(a, c) {
  goog.array.forEach(this._annotators.getValues(), function(d) {
    d.addHandler(a, c)
  });
  this._eventHandlers.push({type:a, handler:c})
};
annotorious.mediatypes.Module.prototype.addPlugin = function(a) {
  this._plugins.push(a);
  var c = this;
  goog.array.forEach(this._annotators.getValues(), function(d) {
    c._initPlugin(a, d)
  })
};
annotorious.mediatypes.Module.prototype.annotatesItem = function(a) {
  if(this._annotators.containsKey(a)) {
    return!0
  }
  var c = this, d = goog.array.find(this._itemsToLoad, function(d) {
    return c.getItemURL(d) == a
  });
  return goog.isDefAndNotNull(d)
};
annotorious.mediatypes.Module.prototype.destroy = function(a) {
  if(a) {
    var c = this._annotators.get(a);
    c && (c.destroy(), this._annotators.remove(a))
  }else {
    goog.array.forEach(this._annotators.getValues(), function(a) {
      a.destroy()
    }), this._annotators.clear()
  }
};
annotorious.mediatypes.Module.prototype.getActiveSelector = function(a) {
  if(this.annotatesItem(a) && (a = this._annotators.get(a))) {
    return a.getActiveSelector().getName()
  }
};
annotorious.mediatypes.Module.prototype.getAnnotations = function(a) {
  if(a) {
    var c = this._annotators.get(a);
    return c ? c.getAnnotations() : goog.array.filter(this._bufferedForAdding, function(c) {
      return c.src == a
    })
  }
  var d = [];
  goog.array.forEach(this._annotators.getValues(), function(a) {
    goog.array.extend(d, a.getAnnotations())
  });
  goog.array.extend(d, this._bufferedForAdding);
  return d
};
annotorious.mediatypes.Module.prototype.getAvailableSelectors = function(a) {
  if(this.annotatesItem(a) && (a = this._annotators.get(a))) {
    return goog.array.map(a.getAvailableSelectors(), function(a) {
      return a.getName()
    })
  }
};
annotorious.mediatypes.Module.prototype.hideAnnotations = function(a) {
  this._setAnnotationVisibility(a, !1)
};
annotorious.mediatypes.Module.prototype.hideSelectionWidget = function(a) {
  this._setSelectionWidgetVisibility(a, !1)
};
annotorious.mediatypes.Module.prototype.highlightAnnotation = function(a) {
  if(a) {
    if(this.annotatesItem(a.src)) {
      var c = this._annotators.get(a.src);
      c && c.highlightAnnotation(a)
    }
  }else {
    goog.array.forEach(this._annotators.getValues(), function(a) {
      a.highlightAnnotation()
    })
  }
};
annotorious.mediatypes.Module.prototype.init = function() {
  this._preLoad && goog.array.extend(this._itemsToLoad, this._preLoad());
  this._lazyLoad();
  var a = this, c = goog.events.listen(window, goog.events.EventType.SCROLL, function() {
    0 < a._itemsToLoad.length ? a._lazyLoad() : goog.events.unlistenByKey(c)
  })
};
annotorious.mediatypes.Module.prototype.makeAnnotatable = function(a) {
  this.supports(a) && this._initAnnotator(a)
};
annotorious.mediatypes.Module.prototype.removeAnnotation = function(a) {
  if(this.annotatesItem(a.src)) {
    var c = this._annotators.get(a.src);
    c ? c.removeAnnotation(a) : this._bufferedForRemoval.push(a)
  }
};
annotorious.mediatypes.Module.prototype.removeCurrentSelection = function(a) {
  this._annotators.get(a).stopSelection()
};
annotorious.mediatypes.Module.prototype.setActiveSelector = function(a, c) {
  if(this.annotatesItem(a)) {
    var d = this._annotators.get(a);
    d && d.setCurrentSelector(c)
  }
};
annotorious.mediatypes.Module.prototype.setProperties = function(a) {
  this._cachedProperties = a;
  goog.array.forEach(this._annotators.getValues(), function(c) {
    c.setProperties(a)
  })
};
annotorious.mediatypes.Module.prototype.redrawGlow = function(a, c) {
  if(a) {
    var d = this._annotators.get(a);
    d && d.redrawGlow(c)
  }
};
annotorious.mediatypes.Module.prototype.showAnnotations = function(a) {
  this._setAnnotationVisibility(a, !0)
};
annotorious.mediatypes.Module.prototype.showSelectionWidget = function(a) {
  this._setSelectionWidgetVisibility(a, !0)
};
goog.soy = {};
goog.soy.renderElement = function(a, c, d, e) {
  a.innerHTML = c(d || goog.soy.defaultTemplateData_, void 0, e)
};
goog.soy.renderAsFragment = function(a, c, d, e) {
  return(e || goog.dom.getDomHelper()).htmlToDocumentFragment(a(c || goog.soy.defaultTemplateData_, void 0, d))
};
goog.soy.renderAsElement = function(a, c, d, e) {
  e = (e || goog.dom.getDomHelper()).createElement(goog.dom.TagName.DIV);
  e.innerHTML = a(c || goog.soy.defaultTemplateData_, void 0, d);
  return 1 == e.childNodes.length && (a = e.firstChild, a.nodeType == goog.dom.NodeType.ELEMENT) ? a : e
};
goog.soy.defaultTemplateData_ = {};
goog.string.StringBuffer = function(a, c) {
  null != a && this.append.apply(this, arguments)
};
goog.string.StringBuffer.prototype.buffer_ = "";
goog.string.StringBuffer.prototype.set = function(a) {
  this.buffer_ = "" + a
};
goog.string.StringBuffer.prototype.append = function(a, c, d) {
  this.buffer_ += a;
  if(null != c) {
    for(var e = 1;e < arguments.length;e++) {
      this.buffer_ += arguments[e]
    }
  }
  return this
};
goog.string.StringBuffer.prototype.clear = function() {
  this.buffer_ = ""
};
goog.string.StringBuffer.prototype.getLength = function() {
  return this.buffer_.length
};
goog.string.StringBuffer.prototype.toString = function() {
  return this.buffer_
};
/*
 Portions of this code are from the google-caja project, received by
 Google under the Apache license (http://code.google.com/p/google-caja/).
 All other code is Copyright 2009 Google, Inc. All Rights Reserved.

// Copyright (C) 2006 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

*/
goog.string.html = {};
goog.string.html.HtmlParser = function() {
};
goog.string.html.HtmlParser.Entities = {lt:"<", gt:">", amp:"&", nbsp:"\u00a0", quot:'"', apos:"'"};
goog.string.html.HtmlParser.EFlags = {OPTIONAL_ENDTAG:1, EMPTY:2, CDATA:4, RCDATA:8, UNSAFE:16, FOLDABLE:32};
goog.string.html.HtmlParser.Elements = {a:0, abbr:0, acronym:0, address:0, applet:goog.string.html.HtmlParser.EFlags.UNSAFE, area:goog.string.html.HtmlParser.EFlags.EMPTY, b:0, base:goog.string.html.HtmlParser.EFlags.EMPTY | goog.string.html.HtmlParser.EFlags.UNSAFE, basefont:goog.string.html.HtmlParser.EFlags.EMPTY | goog.string.html.HtmlParser.EFlags.UNSAFE, bdo:0, big:0, blockquote:0, body:goog.string.html.HtmlParser.EFlags.OPTIONAL_ENDTAG | goog.string.html.HtmlParser.EFlags.UNSAFE | goog.string.html.HtmlParser.EFlags.FOLDABLE, 
br:goog.string.html.HtmlParser.EFlags.EMPTY, button:0, caption:0, center:0, cite:0, code:0, col:goog.string.html.HtmlParser.EFlags.EMPTY, colgroup:goog.string.html.HtmlParser.EFlags.OPTIONAL_ENDTAG, dd:goog.string.html.HtmlParser.EFlags.OPTIONAL_ENDTAG, del:0, dfn:0, dir:0, div:0, dl:0, dt:goog.string.html.HtmlParser.EFlags.OPTIONAL_ENDTAG, em:0, fieldset:0, font:0, form:0, frame:goog.string.html.HtmlParser.EFlags.EMPTY | goog.string.html.HtmlParser.EFlags.UNSAFE, frameset:goog.string.html.HtmlParser.EFlags.UNSAFE, 
h1:0, h2:0, h3:0, h4:0, h5:0, h6:0, head:goog.string.html.HtmlParser.EFlags.OPTIONAL_ENDTAG | goog.string.html.HtmlParser.EFlags.UNSAFE | goog.string.html.HtmlParser.EFlags.FOLDABLE, hr:goog.string.html.HtmlParser.EFlags.EMPTY, html:goog.string.html.HtmlParser.EFlags.OPTIONAL_ENDTAG | goog.string.html.HtmlParser.EFlags.UNSAFE | goog.string.html.HtmlParser.EFlags.FOLDABLE, i:0, iframe:goog.string.html.HtmlParser.EFlags.UNSAFE | goog.string.html.HtmlParser.EFlags.CDATA, img:goog.string.html.HtmlParser.EFlags.EMPTY, 
input:goog.string.html.HtmlParser.EFlags.EMPTY, ins:0, isindex:goog.string.html.HtmlParser.EFlags.EMPTY | goog.string.html.HtmlParser.EFlags.UNSAFE, kbd:0, label:0, legend:0, li:goog.string.html.HtmlParser.EFlags.OPTIONAL_ENDTAG, link:goog.string.html.HtmlParser.EFlags.EMPTY | goog.string.html.HtmlParser.EFlags.UNSAFE, map:0, menu:0, meta:goog.string.html.HtmlParser.EFlags.EMPTY | goog.string.html.HtmlParser.EFlags.UNSAFE, noframes:goog.string.html.HtmlParser.EFlags.UNSAFE | goog.string.html.HtmlParser.EFlags.CDATA, 
noscript:goog.string.html.HtmlParser.EFlags.UNSAFE | goog.string.html.HtmlParser.EFlags.CDATA, object:goog.string.html.HtmlParser.EFlags.UNSAFE, ol:0, optgroup:0, option:goog.string.html.HtmlParser.EFlags.OPTIONAL_ENDTAG, p:goog.string.html.HtmlParser.EFlags.OPTIONAL_ENDTAG, param:goog.string.html.HtmlParser.EFlags.EMPTY | goog.string.html.HtmlParser.EFlags.UNSAFE, pre:0, q:0, s:0, samp:0, script:goog.string.html.HtmlParser.EFlags.UNSAFE | goog.string.html.HtmlParser.EFlags.CDATA, select:0, small:0, 
span:0, strike:0, strong:0, style:goog.string.html.HtmlParser.EFlags.UNSAFE | goog.string.html.HtmlParser.EFlags.CDATA, sub:0, sup:0, table:0, tbody:goog.string.html.HtmlParser.EFlags.OPTIONAL_ENDTAG, td:goog.string.html.HtmlParser.EFlags.OPTIONAL_ENDTAG, textarea:goog.string.html.HtmlParser.EFlags.RCDATA, tfoot:goog.string.html.HtmlParser.EFlags.OPTIONAL_ENDTAG, th:goog.string.html.HtmlParser.EFlags.OPTIONAL_ENDTAG, thead:goog.string.html.HtmlParser.EFlags.OPTIONAL_ENDTAG, title:goog.string.html.HtmlParser.EFlags.RCDATA | 
goog.string.html.HtmlParser.EFlags.UNSAFE, tr:goog.string.html.HtmlParser.EFlags.OPTIONAL_ENDTAG, tt:0, u:0, ul:0, "var":0};
goog.string.html.HtmlParser.AMP_RE_ = /&/g;
goog.string.html.HtmlParser.LOOSE_AMP_RE_ = /&([^a-z#]|#(?:[^0-9x]|x(?:[^0-9a-f]|$)|$)|$)/gi;
goog.string.html.HtmlParser.LT_RE_ = /</g;
goog.string.html.HtmlParser.GT_RE_ = />/g;
goog.string.html.HtmlParser.QUOTE_RE_ = /\"/g;
goog.string.html.HtmlParser.EQUALS_RE_ = /=/g;
goog.string.html.HtmlParser.NULL_RE_ = /\0/g;
goog.string.html.HtmlParser.ENTITY_RE_ = /&(#\d+|#x[0-9A-Fa-f]+|\w+);/g;
goog.string.html.HtmlParser.DECIMAL_ESCAPE_RE_ = /^#(\d+)$/;
goog.string.html.HtmlParser.HEX_ESCAPE_RE_ = /^#x([0-9A-Fa-f]+)$/;
goog.string.html.HtmlParser.INSIDE_TAG_TOKEN_ = RegExp("^\\s*(?:(?:([a-z][a-z-]*)(\\s*=\\s*(\"[^\"]*\"|'[^']*'|(?=[a-z][a-z-]*\\s*=)|[^>\"'\\s]*))?)|(/?>)|[^a-z\\s>]+)", "i");
goog.string.html.HtmlParser.OUTSIDE_TAG_TOKEN_ = RegExp("^(?:&(\\#[0-9]+|\\#[x][0-9a-f]+|\\w+);|<[!]--[\\s\\S]*?--\>|<!\\w[^>]*>|<\\?[^>*]*>|<(/)?([a-z][a-z0-9]*)|([^<&>]+)|([<&>]))", "i");
goog.string.html.HtmlParser.prototype.parse = function(a, c) {
  var d = null, e = !1, f = [], h, i, j;
  for(a.startDoc();c;) {
    var k = c.match(e ? goog.string.html.HtmlParser.INSIDE_TAG_TOKEN_ : goog.string.html.HtmlParser.OUTSIDE_TAG_TOKEN_), c = c.substring(k[0].length);
    if(e) {
      if(k[1]) {
        var l = goog.string.html.toLowerCase(k[1]);
        if(k[2]) {
          k = k[3];
          switch(k.charCodeAt(0)) {
            case 34:
            ;
            case 39:
              k = k.substring(1, k.length - 1)
          }
          k = this.unescapeEntities_(this.stripNULs_(k))
        }else {
          k = l
        }
        f.push(l, k)
      }else {
        k[4] && (void 0 !== i && (j ? a.startTag && a.startTag(h, f) : a.endTag && a.endTag(h)), j && i & (goog.string.html.HtmlParser.EFlags.CDATA | goog.string.html.HtmlParser.EFlags.RCDATA) && (d = null === d ? goog.string.html.toLowerCase(c) : d.substring(d.length - c.length), e = d.indexOf("</" + h), 0 > e && (e = c.length), i & goog.string.html.HtmlParser.EFlags.CDATA ? a.cdata && a.cdata(c.substring(0, e)) : a.rcdata && a.rcdata(this.normalizeRCData_(c.substring(0, e))), c = c.substring(e)), 
        h = i = j = void 0, f.length = 0, e = !1)
      }
    }else {
      if(k[1]) {
        a.pcdata(k[0])
      }else {
        if(k[3]) {
          j = !k[2], e = !0, h = goog.string.html.toLowerCase(k[3]), i = goog.string.html.HtmlParser.Elements.hasOwnProperty(h) ? goog.string.html.HtmlParser.Elements[h] : void 0
        }else {
          if(k[4]) {
            a.pcdata(k[4])
          }else {
            if(k[5]) {
              switch(k[5]) {
                case "<":
                  a.pcdata("&lt;");
                  break;
                case ">":
                  a.pcdata("&gt;");
                  break;
                default:
                  a.pcdata("&amp;")
              }
            }
          }
        }
      }
    }
  }
  a.endDoc()
};
goog.string.html.HtmlParser.prototype.lookupEntity_ = function(a) {
  a = goog.string.html.toLowerCase(a);
  if(goog.string.html.HtmlParser.Entities.hasOwnProperty(a)) {
    return goog.string.html.HtmlParser.Entities[a]
  }
  var c = a.match(goog.string.html.HtmlParser.DECIMAL_ESCAPE_RE_);
  return c ? String.fromCharCode(parseInt(c[1], 10)) : (c = a.match(goog.string.html.HtmlParser.HEX_ESCAPE_RE_)) ? String.fromCharCode(parseInt(c[1], 16)) : ""
};
goog.string.html.HtmlParser.prototype.stripNULs_ = function(a) {
  return a.replace(goog.string.html.HtmlParser.NULL_RE_, "")
};
goog.string.html.HtmlParser.prototype.unescapeEntities_ = function(a) {
  return a.replace(goog.string.html.HtmlParser.ENTITY_RE_, goog.bind(this.lookupEntity_, this))
};
goog.string.html.HtmlParser.prototype.normalizeRCData_ = function(a) {
  return a.replace(goog.string.html.HtmlParser.LOOSE_AMP_RE_, "&amp;$1").replace(goog.string.html.HtmlParser.LT_RE_, "&lt;").replace(goog.string.html.HtmlParser.GT_RE_, "&gt;")
};
goog.string.html.toLowerCase = function(a) {
  return a.toLowerCase()
};
goog.string.html.HtmlSaxHandler = function() {
};
/*
 Portions of this code are from the google-caja project, received by
 Google under the Apache license (http://code.google.com/p/google-caja/).
 All other code is Copyright 2009 Google, Inc. All Rights Reserved.

// Copyright (C) 2006 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

*/
goog.string.html.htmlSanitize = function(a, c, d) {
  var e = new goog.string.StringBuffer, c = new goog.string.html.HtmlSanitizer(e, c, d);
  (new goog.string.html.HtmlParser).parse(c, a);
  return e.toString()
};
goog.string.html.HtmlSanitizer = function(a, c, d) {
  goog.string.html.HtmlSaxHandler.call(this);
  this.stringBuffer_ = a;
  this.stack_ = [];
  this.ignoring_ = !1;
  this.urlPolicy_ = c;
  this.nmTokenPolicy_ = d
};
goog.inherits(goog.string.html.HtmlSanitizer, goog.string.html.HtmlSaxHandler);
goog.string.html.HtmlSanitizer.AttributeType = {NONE:0, URI:1, URI_FRAGMENT:11, SCRIPT:2, STYLE:3, ID:4, IDREF:5, IDREFS:6, GLOBAL_NAME:7, LOCAL_NAME:8, CLASSES:9, FRAME_TARGET:10};
goog.string.html.HtmlSanitizer.Attributes = {"*::class":goog.string.html.HtmlSanitizer.AttributeType.CLASSES, "*::dir":0, "*::id":goog.string.html.HtmlSanitizer.AttributeType.ID, "*::lang":0, "*::onclick":goog.string.html.HtmlSanitizer.AttributeType.SCRIPT, "*::ondblclick":goog.string.html.HtmlSanitizer.AttributeType.SCRIPT, "*::onkeydown":goog.string.html.HtmlSanitizer.AttributeType.SCRIPT, "*::onkeypress":goog.string.html.HtmlSanitizer.AttributeType.SCRIPT, "*::onkeyup":goog.string.html.HtmlSanitizer.AttributeType.SCRIPT, 
"*::onload":goog.string.html.HtmlSanitizer.AttributeType.SCRIPT, "*::onmousedown":goog.string.html.HtmlSanitizer.AttributeType.SCRIPT, "*::onmousemove":goog.string.html.HtmlSanitizer.AttributeType.SCRIPT, "*::onmouseout":goog.string.html.HtmlSanitizer.AttributeType.SCRIPT, "*::onmouseover":goog.string.html.HtmlSanitizer.AttributeType.SCRIPT, "*::onmouseup":goog.string.html.HtmlSanitizer.AttributeType.SCRIPT, "*::style":goog.string.html.HtmlSanitizer.AttributeType.STYLE, "*::title":0, "*::accesskey":0, 
"*::tabindex":0, "*::onfocus":goog.string.html.HtmlSanitizer.AttributeType.SCRIPT, "*::onblur":goog.string.html.HtmlSanitizer.AttributeType.SCRIPT, "a::coords":0, "a::href":goog.string.html.HtmlSanitizer.AttributeType.URI, "a::hreflang":0, "a::name":goog.string.html.HtmlSanitizer.AttributeType.GLOBAL_NAME, "a::onblur":goog.string.html.HtmlSanitizer.AttributeType.SCRIPT, "a::rel":0, "a::rev":0, "a::shape":0, "a::target":goog.string.html.HtmlSanitizer.AttributeType.FRAME_TARGET, "a::type":0, "area::accesskey":0, 
"area::alt":0, "area::coords":0, "area::href":goog.string.html.HtmlSanitizer.AttributeType.URI, "area::nohref":0, "area::onfocus":goog.string.html.HtmlSanitizer.AttributeType.SCRIPT, "area::shape":0, "area::tabindex":0, "area::target":goog.string.html.HtmlSanitizer.AttributeType.FRAME_TARGET, "bdo::dir":0, "blockquote::cite":goog.string.html.HtmlSanitizer.AttributeType.URI, "br::clear":0, "button::accesskey":0, "button::disabled":0, "button::name":goog.string.html.HtmlSanitizer.AttributeType.LOCAL_NAME, 
"button::onblur":goog.string.html.HtmlSanitizer.AttributeType.SCRIPT, "button::onfocus":goog.string.html.HtmlSanitizer.AttributeType.SCRIPT, "button::tabindex":0, "button::type":0, "button::value":0, "caption::align":0, "col::align":0, "col::char":0, "col::charoff":0, "col::span":0, "col::valign":0, "col::width":0, "colgroup::align":0, "colgroup::char":0, "colgroup::charoff":0, "colgroup::span":0, "colgroup::valign":0, "colgroup::width":0, "del::cite":goog.string.html.HtmlSanitizer.AttributeType.URI, 
"del::datetime":0, "dir::compact":0, "div::align":0, "dl::compact":0, "font::color":0, "font::face":0, "font::size":0, "form::accept":0, "form::action":goog.string.html.HtmlSanitizer.AttributeType.URI, "form::autocomplete":0, "form::enctype":0, "form::method":0, "form::name":goog.string.html.HtmlSanitizer.AttributeType.GLOBAL_NAME, "form::onreset":goog.string.html.HtmlSanitizer.AttributeType.SCRIPT, "form::onsubmit":goog.string.html.HtmlSanitizer.AttributeType.SCRIPT, "form::target":goog.string.html.HtmlSanitizer.AttributeType.FRAME_TARGET, 
"h1::align":0, "h2::align":0, "h3::align":0, "h4::align":0, "h5::align":0, "h6::align":0, "hr::align":0, "hr::noshade":0, "hr::size":0, "hr::width":0, "img::align":0, "img::alt":0, "img::border":0, "img::height":0, "img::hspace":0, "img::ismap":0, "img::longdesc":goog.string.html.HtmlSanitizer.AttributeType.URI, "img::name":goog.string.html.HtmlSanitizer.AttributeType.GLOBAL_NAME, "img::src":goog.string.html.HtmlSanitizer.AttributeType.URI, "img::usemap":goog.string.html.HtmlSanitizer.AttributeType.URI_FRAGMENT, 
"img::vspace":0, "img::width":0, "input::accept":0, "input::accesskey":0, "input::autocomplete":0, "input::align":0, "input::alt":0, "input::checked":0, "input::disabled":0, "input::ismap":0, "input::maxlength":0, "input::name":goog.string.html.HtmlSanitizer.AttributeType.LOCAL_NAME, "input::onblur":goog.string.html.HtmlSanitizer.AttributeType.SCRIPT, "input::onchange":goog.string.html.HtmlSanitizer.AttributeType.SCRIPT, "input::onfocus":goog.string.html.HtmlSanitizer.AttributeType.SCRIPT, "input::onselect":goog.string.html.HtmlSanitizer.AttributeType.SCRIPT, 
"input::readonly":0, "input::size":0, "input::src":goog.string.html.HtmlSanitizer.AttributeType.URI, "input::tabindex":0, "input::type":0, "input::usemap":goog.string.html.HtmlSanitizer.AttributeType.URI_FRAGMENT, "input::value":0, "ins::cite":goog.string.html.HtmlSanitizer.AttributeType.URI, "ins::datetime":0, "label::accesskey":0, "label::for":goog.string.html.HtmlSanitizer.AttributeType.IDREF, "label::onblur":goog.string.html.HtmlSanitizer.AttributeType.SCRIPT, "label::onfocus":goog.string.html.HtmlSanitizer.AttributeType.SCRIPT, 
"legend::accesskey":0, "legend::align":0, "li::type":0, "li::value":0, "map::name":goog.string.html.HtmlSanitizer.AttributeType.GLOBAL_NAME, "menu::compact":0, "ol::compact":0, "ol::start":0, "ol::type":0, "optgroup::disabled":0, "optgroup::label":0, "option::disabled":0, "option::label":0, "option::selected":0, "option::value":0, "p::align":0, "pre::width":0, "q::cite":goog.string.html.HtmlSanitizer.AttributeType.URI, "select::disabled":0, "select::multiple":0, "select::name":goog.string.html.HtmlSanitizer.AttributeType.LOCAL_NAME, 
"select::onblur":goog.string.html.HtmlSanitizer.AttributeType.SCRIPT, "select::onchange":goog.string.html.HtmlSanitizer.AttributeType.SCRIPT, "select::onfocus":goog.string.html.HtmlSanitizer.AttributeType.SCRIPT, "select::size":0, "select::tabindex":0, "table::align":0, "table::bgcolor":0, "table::border":0, "table::cellpadding":0, "table::cellspacing":0, "table::frame":0, "table::rules":0, "table::summary":0, "table::width":0, "tbody::align":0, "tbody::char":0, "tbody::charoff":0, "tbody::valign":0, 
"td::abbr":0, "td::align":0, "td::axis":0, "td::bgcolor":0, "td::char":0, "td::charoff":0, "td::colspan":0, "td::headers":goog.string.html.HtmlSanitizer.AttributeType.IDREFS, "td::height":0, "td::nowrap":0, "td::rowspan":0, "td::scope":0, "td::valign":0, "td::width":0, "textarea::accesskey":0, "textarea::cols":0, "textarea::disabled":0, "textarea::name":goog.string.html.HtmlSanitizer.AttributeType.LOCAL_NAME, "textarea::onblur":goog.string.html.HtmlSanitizer.AttributeType.SCRIPT, "textarea::onchange":goog.string.html.HtmlSanitizer.AttributeType.SCRIPT, 
"textarea::onfocus":goog.string.html.HtmlSanitizer.AttributeType.SCRIPT, "textarea::onselect":goog.string.html.HtmlSanitizer.AttributeType.SCRIPT, "textarea::readonly":0, "textarea::rows":0, "textarea::tabindex":0, "tfoot::align":0, "tfoot::char":0, "tfoot::charoff":0, "tfoot::valign":0, "th::abbr":0, "th::align":0, "th::axis":0, "th::bgcolor":0, "th::char":0, "th::charoff":0, "th::colspan":0, "th::headers":goog.string.html.HtmlSanitizer.AttributeType.IDREFS, "th::height":0, "th::nowrap":0, "th::rowspan":0, 
"th::scope":0, "th::valign":0, "th::width":0, "thead::align":0, "thead::char":0, "thead::charoff":0, "thead::valign":0, "tr::align":0, "tr::bgcolor":0, "tr::char":0, "tr::charoff":0, "tr::valign":0, "ul::compact":0, "ul::type":0};
goog.string.html.HtmlSanitizer.prototype.startTag = function(a, c) {
  if(!this.ignoring_ && goog.string.html.HtmlParser.Elements.hasOwnProperty(a)) {
    var d = goog.string.html.HtmlParser.Elements[a];
    if(!(d & goog.string.html.HtmlParser.EFlags.FOLDABLE)) {
      if(d & goog.string.html.HtmlParser.EFlags.UNSAFE) {
        this.ignoring_ = !(d & goog.string.html.HtmlParser.EFlags.EMPTY)
      }else {
        if(c = this.sanitizeAttributes_(a, c)) {
          d & goog.string.html.HtmlParser.EFlags.EMPTY || this.stack_.push(a);
          this.stringBuffer_.append("<", a);
          for(var d = 0, e = c.length;d < e;d += 2) {
            var f = c[d], h = c[d + 1];
            null !== h && void 0 !== h && this.stringBuffer_.append(" ", f, '="', this.escapeAttrib_(h), '"')
          }
          this.stringBuffer_.append(">")
        }
      }
    }
  }
};
goog.string.html.HtmlSanitizer.prototype.endTag = function(a) {
  if(this.ignoring_) {
    this.ignoring_ = !1
  }else {
    if(goog.string.html.HtmlParser.Elements.hasOwnProperty(a)) {
      var c = goog.string.html.HtmlParser.Elements[a];
      if(!(c & (goog.string.html.HtmlParser.EFlags.UNSAFE | goog.string.html.HtmlParser.EFlags.EMPTY | goog.string.html.HtmlParser.EFlags.FOLDABLE))) {
        if(c & goog.string.html.HtmlParser.EFlags.OPTIONAL_ENDTAG) {
          for(c = this.stack_.length;0 <= --c;) {
            var d = this.stack_[c];
            if(d === a) {
              break
            }
            if(!(goog.string.html.HtmlParser.Elements[d] & goog.string.html.HtmlParser.EFlags.OPTIONAL_ENDTAG)) {
              return
            }
          }
        }else {
          for(c = this.stack_.length;0 <= --c && this.stack_[c] !== a;) {
          }
        }
        if(!(0 > c)) {
          for(var e = this.stack_.length;--e > c;) {
            d = this.stack_[e], goog.string.html.HtmlParser.Elements[d] & goog.string.html.HtmlParser.EFlags.OPTIONAL_ENDTAG || this.stringBuffer_.append("</", d, ">")
          }
          this.stack_.length = c;
          this.stringBuffer_.append("</", a, ">")
        }
      }
    }
  }
};
goog.string.html.HtmlSanitizer.prototype.pcdata = function(a) {
  this.ignoring_ || this.stringBuffer_.append(a)
};
goog.string.html.HtmlSanitizer.prototype.rcdata = function(a) {
  this.ignoring_ || this.stringBuffer_.append(a)
};
goog.string.html.HtmlSanitizer.prototype.cdata = function(a) {
  this.ignoring_ || this.stringBuffer_.append(a)
};
goog.string.html.HtmlSanitizer.prototype.startDoc = function() {
  this.stack_ = [];
  this.ignoring_ = !1
};
goog.string.html.HtmlSanitizer.prototype.endDoc = function() {
  for(var a = this.stack_.length;0 <= --a;) {
    this.stringBuffer_.append("</", this.stack_[a], ">")
  }
  this.stack_.length = 0
};
goog.string.html.HtmlSanitizer.prototype.escapeAttrib_ = function(a) {
  return a.replace(goog.string.html.HtmlParser.AMP_RE_, "&amp;").replace(goog.string.html.HtmlParser.LT_RE_, "&lt;").replace(goog.string.html.HtmlParser.GT_RE_, "&gt;").replace(goog.string.html.HtmlParser.QUOTE_RE_, "&#34;").replace(goog.string.html.HtmlParser.EQUALS_RE_, "&#61;")
};
goog.string.html.HtmlSanitizer.prototype.sanitizeAttributes_ = function(a, c) {
  for(var d = 0;d < c.length;d += 2) {
    var e = c[d], f = c[d + 1], h = null, i;
    if((i = a + "::" + e, goog.string.html.HtmlSanitizer.Attributes.hasOwnProperty(i)) || (i = "*::" + e, goog.string.html.HtmlSanitizer.Attributes.hasOwnProperty(i))) {
      h = goog.string.html.HtmlSanitizer.Attributes[i]
    }
    if(null !== h) {
      switch(h) {
        case 0:
          break;
        case goog.string.html.HtmlSanitizer.AttributeType.SCRIPT:
        ;
        case goog.string.html.HtmlSanitizer.AttributeType.STYLE:
          f = null;
          break;
        case goog.string.html.HtmlSanitizer.AttributeType.ID:
        ;
        case goog.string.html.HtmlSanitizer.AttributeType.IDREF:
        ;
        case goog.string.html.HtmlSanitizer.AttributeType.IDREFS:
        ;
        case goog.string.html.HtmlSanitizer.AttributeType.GLOBAL_NAME:
        ;
        case goog.string.html.HtmlSanitizer.AttributeType.LOCAL_NAME:
        ;
        case goog.string.html.HtmlSanitizer.AttributeType.CLASSES:
          f = this.nmTokenPolicy_ ? this.nmTokenPolicy_(f) : f;
          break;
        case goog.string.html.HtmlSanitizer.AttributeType.URI:
          f = this.urlPolicy_ && this.urlPolicy_(f);
          break;
        case goog.string.html.HtmlSanitizer.AttributeType.URI_FRAGMENT:
          f && "#" === f.charAt(0) ? (f = this.nmTokenPolicy_ ? this.nmTokenPolicy_(f) : f) && (f = "#" + f) : f = null;
          break;
        default:
          f = null
      }
    }else {
      f = null
    }
    c[d + 1] = f
  }
  return c
};
goog.Timer = function(a, c) {
  goog.events.EventTarget.call(this);
  this.interval_ = a || 1;
  this.timerObject_ = c || goog.Timer.defaultTimerObject;
  this.boundTick_ = goog.bind(this.tick_, this);
  this.last_ = goog.now()
};
goog.inherits(goog.Timer, goog.events.EventTarget);
goog.Timer.MAX_TIMEOUT_ = 2147483647;
goog.Timer.prototype.enabled = !1;
goog.Timer.defaultTimerObject = goog.global.window;
goog.Timer.intervalScale = 0.8;
goog.Timer.prototype.timer_ = null;
goog.Timer.prototype.getInterval = function() {
  return this.interval_
};
goog.Timer.prototype.setInterval = function(a) {
  this.interval_ = a;
  this.timer_ && this.enabled ? (this.stop(), this.start()) : this.timer_ && this.stop()
};
goog.Timer.prototype.tick_ = function() {
  if(this.enabled) {
    var a = goog.now() - this.last_;
    0 < a && a < this.interval_ * goog.Timer.intervalScale ? this.timer_ = this.timerObject_.setTimeout(this.boundTick_, this.interval_ - a) : (this.dispatchTick(), this.enabled && (this.timer_ = this.timerObject_.setTimeout(this.boundTick_, this.interval_), this.last_ = goog.now()))
  }
};
goog.Timer.prototype.dispatchTick = function() {
  this.dispatchEvent(goog.Timer.TICK)
};
goog.Timer.prototype.start = function() {
  this.enabled = !0;
  this.timer_ || (this.timer_ = this.timerObject_.setTimeout(this.boundTick_, this.interval_), this.last_ = goog.now())
};
goog.Timer.prototype.stop = function() {
  this.enabled = !1;
  this.timer_ && (this.timerObject_.clearTimeout(this.timer_), this.timer_ = null)
};
goog.Timer.prototype.disposeInternal = function() {
  goog.Timer.superClass_.disposeInternal.call(this);
  this.stop();
  delete this.timerObject_
};
goog.Timer.TICK = "tick";
goog.Timer.callOnce = function(a, c, d) {
  if(goog.isFunction(a)) {
    d && (a = goog.bind(a, d))
  }else {
    if(a && "function" == typeof a.handleEvent) {
      a = goog.bind(a.handleEvent, a)
    }else {
      throw Error("Invalid listener argument");
    }
  }
  return c > goog.Timer.MAX_TIMEOUT_ ? -1 : goog.Timer.defaultTimerObject.setTimeout(a, c || 0)
};
goog.Timer.clear = function(a) {
  goog.Timer.defaultTimerObject.clearTimeout(a)
};
goog.events.KeyCodes = {WIN_KEY_FF_LINUX:0, MAC_ENTER:3, BACKSPACE:8, TAB:9, NUM_CENTER:12, ENTER:13, SHIFT:16, CTRL:17, ALT:18, PAUSE:19, CAPS_LOCK:20, ESC:27, SPACE:32, PAGE_UP:33, PAGE_DOWN:34, END:35, HOME:36, LEFT:37, UP:38, RIGHT:39, DOWN:40, PRINT_SCREEN:44, INSERT:45, DELETE:46, ZERO:48, ONE:49, TWO:50, THREE:51, FOUR:52, FIVE:53, SIX:54, SEVEN:55, EIGHT:56, NINE:57, FF_SEMICOLON:59, FF_EQUALS:61, QUESTION_MARK:63, A:65, B:66, C:67, D:68, E:69, F:70, G:71, H:72, I:73, J:74, K:75, L:76, M:77, 
N:78, O:79, P:80, Q:81, R:82, S:83, T:84, U:85, V:86, W:87, X:88, Y:89, Z:90, META:91, WIN_KEY_RIGHT:92, CONTEXT_MENU:93, NUM_ZERO:96, NUM_ONE:97, NUM_TWO:98, NUM_THREE:99, NUM_FOUR:100, NUM_FIVE:101, NUM_SIX:102, NUM_SEVEN:103, NUM_EIGHT:104, NUM_NINE:105, NUM_MULTIPLY:106, NUM_PLUS:107, NUM_MINUS:109, NUM_PERIOD:110, NUM_DIVISION:111, F1:112, F2:113, F3:114, F4:115, F5:116, F6:117, F7:118, F8:119, F9:120, F10:121, F11:122, F12:123, NUMLOCK:144, SCROLL_LOCK:145, FIRST_MEDIA_KEY:166, LAST_MEDIA_KEY:183, 
SEMICOLON:186, DASH:189, EQUALS:187, COMMA:188, PERIOD:190, SLASH:191, APOSTROPHE:192, TILDE:192, SINGLE_QUOTE:222, OPEN_SQUARE_BRACKET:219, BACKSLASH:220, CLOSE_SQUARE_BRACKET:221, WIN_KEY:224, MAC_FF_META:224, WIN_IME:229, PHANTOM:255};
goog.events.KeyCodes.isTextModifyingKeyEvent = function(a) {
  if(a.altKey && !a.ctrlKey || a.metaKey || a.keyCode >= goog.events.KeyCodes.F1 && a.keyCode <= goog.events.KeyCodes.F12) {
    return!1
  }
  switch(a.keyCode) {
    case goog.events.KeyCodes.ALT:
    ;
    case goog.events.KeyCodes.CAPS_LOCK:
    ;
    case goog.events.KeyCodes.CONTEXT_MENU:
    ;
    case goog.events.KeyCodes.CTRL:
    ;
    case goog.events.KeyCodes.DOWN:
    ;
    case goog.events.KeyCodes.END:
    ;
    case goog.events.KeyCodes.ESC:
    ;
    case goog.events.KeyCodes.HOME:
    ;
    case goog.events.KeyCodes.INSERT:
    ;
    case goog.events.KeyCodes.LEFT:
    ;
    case goog.events.KeyCodes.MAC_FF_META:
    ;
    case goog.events.KeyCodes.META:
    ;
    case goog.events.KeyCodes.NUMLOCK:
    ;
    case goog.events.KeyCodes.NUM_CENTER:
    ;
    case goog.events.KeyCodes.PAGE_DOWN:
    ;
    case goog.events.KeyCodes.PAGE_UP:
    ;
    case goog.events.KeyCodes.PAUSE:
    ;
    case goog.events.KeyCodes.PHANTOM:
    ;
    case goog.events.KeyCodes.PRINT_SCREEN:
    ;
    case goog.events.KeyCodes.RIGHT:
    ;
    case goog.events.KeyCodes.SCROLL_LOCK:
    ;
    case goog.events.KeyCodes.SHIFT:
    ;
    case goog.events.KeyCodes.UP:
    ;
    case goog.events.KeyCodes.WIN_KEY:
    ;
    case goog.events.KeyCodes.WIN_KEY_RIGHT:
      return!1;
    case goog.events.KeyCodes.WIN_KEY_FF_LINUX:
      return!goog.userAgent.GECKO;
    default:
      return a.keyCode < goog.events.KeyCodes.FIRST_MEDIA_KEY || a.keyCode > goog.events.KeyCodes.LAST_MEDIA_KEY
  }
};
goog.events.KeyCodes.firesKeyPressEvent = function(a, c, d, e, f) {
  if(!goog.userAgent.IE && (!goog.userAgent.WEBKIT || !goog.userAgent.isVersion("525"))) {
    return!0
  }
  if(goog.userAgent.MAC && f) {
    return goog.events.KeyCodes.isCharacterKey(a)
  }
  if(f && !e || !d && (c == goog.events.KeyCodes.CTRL || c == goog.events.KeyCodes.ALT) || goog.userAgent.IE && e && c == a) {
    return!1
  }
  switch(a) {
    case goog.events.KeyCodes.ENTER:
      return!(goog.userAgent.IE && goog.userAgent.isDocumentMode(9));
    case goog.events.KeyCodes.ESC:
      return!goog.userAgent.WEBKIT
  }
  return goog.events.KeyCodes.isCharacterKey(a)
};
goog.events.KeyCodes.isCharacterKey = function(a) {
  if(a >= goog.events.KeyCodes.ZERO && a <= goog.events.KeyCodes.NINE || a >= goog.events.KeyCodes.NUM_ZERO && a <= goog.events.KeyCodes.NUM_MULTIPLY || a >= goog.events.KeyCodes.A && a <= goog.events.KeyCodes.Z || goog.userAgent.WEBKIT && 0 == a) {
    return!0
  }
  switch(a) {
    case goog.events.KeyCodes.SPACE:
    ;
    case goog.events.KeyCodes.QUESTION_MARK:
    ;
    case goog.events.KeyCodes.NUM_PLUS:
    ;
    case goog.events.KeyCodes.NUM_MINUS:
    ;
    case goog.events.KeyCodes.NUM_PERIOD:
    ;
    case goog.events.KeyCodes.NUM_DIVISION:
    ;
    case goog.events.KeyCodes.SEMICOLON:
    ;
    case goog.events.KeyCodes.FF_SEMICOLON:
    ;
    case goog.events.KeyCodes.DASH:
    ;
    case goog.events.KeyCodes.EQUALS:
    ;
    case goog.events.KeyCodes.FF_EQUALS:
    ;
    case goog.events.KeyCodes.COMMA:
    ;
    case goog.events.KeyCodes.PERIOD:
    ;
    case goog.events.KeyCodes.SLASH:
    ;
    case goog.events.KeyCodes.APOSTROPHE:
    ;
    case goog.events.KeyCodes.SINGLE_QUOTE:
    ;
    case goog.events.KeyCodes.OPEN_SQUARE_BRACKET:
    ;
    case goog.events.KeyCodes.BACKSLASH:
    ;
    case goog.events.KeyCodes.CLOSE_SQUARE_BRACKET:
      return!0;
    default:
      return!1
  }
};
goog.events.KeyCodes.normalizeGeckoKeyCode = function(a) {
  switch(a) {
    case goog.events.KeyCodes.FF_EQUALS:
      return goog.events.KeyCodes.EQUALS;
    case goog.events.KeyCodes.FF_SEMICOLON:
      return goog.events.KeyCodes.SEMICOLON;
    case goog.events.KeyCodes.MAC_FF_META:
      return goog.events.KeyCodes.META;
    case goog.events.KeyCodes.WIN_KEY_FF_LINUX:
      return goog.events.KeyCodes.WIN_KEY;
    default:
      return a
  }
};
goog.events.KeyHandler = function(a, c) {
  goog.events.EventTarget.call(this);
  a && this.attach(a, c)
};
goog.inherits(goog.events.KeyHandler, goog.events.EventTarget);
goog.events.KeyHandler.prototype.element_ = null;
goog.events.KeyHandler.prototype.keyPressKey_ = null;
goog.events.KeyHandler.prototype.keyDownKey_ = null;
goog.events.KeyHandler.prototype.keyUpKey_ = null;
goog.events.KeyHandler.prototype.lastKey_ = -1;
goog.events.KeyHandler.prototype.keyCode_ = -1;
goog.events.KeyHandler.prototype.altKey_ = !1;
goog.events.KeyHandler.EventType = {KEY:"key"};
goog.events.KeyHandler.safariKey_ = {3:goog.events.KeyCodes.ENTER, 12:goog.events.KeyCodes.NUMLOCK, 63232:goog.events.KeyCodes.UP, 63233:goog.events.KeyCodes.DOWN, 63234:goog.events.KeyCodes.LEFT, 63235:goog.events.KeyCodes.RIGHT, 63236:goog.events.KeyCodes.F1, 63237:goog.events.KeyCodes.F2, 63238:goog.events.KeyCodes.F3, 63239:goog.events.KeyCodes.F4, 63240:goog.events.KeyCodes.F5, 63241:goog.events.KeyCodes.F6, 63242:goog.events.KeyCodes.F7, 63243:goog.events.KeyCodes.F8, 63244:goog.events.KeyCodes.F9, 
63245:goog.events.KeyCodes.F10, 63246:goog.events.KeyCodes.F11, 63247:goog.events.KeyCodes.F12, 63248:goog.events.KeyCodes.PRINT_SCREEN, 63272:goog.events.KeyCodes.DELETE, 63273:goog.events.KeyCodes.HOME, 63275:goog.events.KeyCodes.END, 63276:goog.events.KeyCodes.PAGE_UP, 63277:goog.events.KeyCodes.PAGE_DOWN, 63289:goog.events.KeyCodes.NUMLOCK, 63302:goog.events.KeyCodes.INSERT};
goog.events.KeyHandler.keyIdentifier_ = {Up:goog.events.KeyCodes.UP, Down:goog.events.KeyCodes.DOWN, Left:goog.events.KeyCodes.LEFT, Right:goog.events.KeyCodes.RIGHT, Enter:goog.events.KeyCodes.ENTER, F1:goog.events.KeyCodes.F1, F2:goog.events.KeyCodes.F2, F3:goog.events.KeyCodes.F3, F4:goog.events.KeyCodes.F4, F5:goog.events.KeyCodes.F5, F6:goog.events.KeyCodes.F6, F7:goog.events.KeyCodes.F7, F8:goog.events.KeyCodes.F8, F9:goog.events.KeyCodes.F9, F10:goog.events.KeyCodes.F10, F11:goog.events.KeyCodes.F11, 
F12:goog.events.KeyCodes.F12, "U+007F":goog.events.KeyCodes.DELETE, Home:goog.events.KeyCodes.HOME, End:goog.events.KeyCodes.END, PageUp:goog.events.KeyCodes.PAGE_UP, PageDown:goog.events.KeyCodes.PAGE_DOWN, Insert:goog.events.KeyCodes.INSERT};
goog.events.KeyHandler.USES_KEYDOWN_ = goog.userAgent.IE || goog.userAgent.WEBKIT && goog.userAgent.isVersion("525");
goog.events.KeyHandler.SAVE_ALT_FOR_KEYPRESS_ = goog.userAgent.MAC && goog.userAgent.GECKO;
goog.events.KeyHandler.prototype.handleKeyDown_ = function(a) {
  if(goog.userAgent.WEBKIT && (this.lastKey_ == goog.events.KeyCodes.CTRL && !a.ctrlKey || this.lastKey_ == goog.events.KeyCodes.ALT && !a.altKey)) {
    this.keyCode_ = this.lastKey_ = -1
  }
  goog.events.KeyHandler.USES_KEYDOWN_ && !goog.events.KeyCodes.firesKeyPressEvent(a.keyCode, this.lastKey_, a.shiftKey, a.ctrlKey, a.altKey) ? this.handleEvent(a) : (this.keyCode_ = goog.userAgent.GECKO ? goog.events.KeyCodes.normalizeGeckoKeyCode(a.keyCode) : a.keyCode, goog.events.KeyHandler.SAVE_ALT_FOR_KEYPRESS_ && (this.altKey_ = a.altKey))
};
goog.events.KeyHandler.prototype.handleKeyup_ = function(a) {
  this.keyCode_ = this.lastKey_ = -1;
  this.altKey_ = a.altKey
};
goog.events.KeyHandler.prototype.handleEvent = function(a) {
  var c = a.getBrowserEvent(), d, e, f = c.altKey;
  goog.userAgent.IE && a.type == goog.events.EventType.KEYPRESS ? (d = this.keyCode_, e = d != goog.events.KeyCodes.ENTER && d != goog.events.KeyCodes.ESC ? c.keyCode : 0) : goog.userAgent.WEBKIT && a.type == goog.events.EventType.KEYPRESS ? (d = this.keyCode_, e = 0 <= c.charCode && 63232 > c.charCode && goog.events.KeyCodes.isCharacterKey(d) ? c.charCode : 0) : goog.userAgent.OPERA ? (d = this.keyCode_, e = goog.events.KeyCodes.isCharacterKey(d) ? c.keyCode : 0) : (d = c.keyCode || this.keyCode_, 
  e = c.charCode || 0, goog.events.KeyHandler.SAVE_ALT_FOR_KEYPRESS_ && (f = this.altKey_), goog.userAgent.MAC && (e == goog.events.KeyCodes.QUESTION_MARK && d == goog.events.KeyCodes.WIN_KEY) && (d = goog.events.KeyCodes.SLASH));
  var h = d, i = c.keyIdentifier;
  d ? 63232 <= d && d in goog.events.KeyHandler.safariKey_ ? h = goog.events.KeyHandler.safariKey_[d] : 25 == d && a.shiftKey && (h = 9) : i && i in goog.events.KeyHandler.keyIdentifier_ && (h = goog.events.KeyHandler.keyIdentifier_[i]);
  a = h == this.lastKey_;
  this.lastKey_ = h;
  c = new goog.events.KeyEvent(h, e, a, c);
  c.altKey = f;
  this.dispatchEvent(c)
};
goog.events.KeyHandler.prototype.getElement = function() {
  return this.element_
};
goog.events.KeyHandler.prototype.attach = function(a, c) {
  this.keyUpKey_ && this.detach();
  this.element_ = a;
  this.keyPressKey_ = goog.events.listen(this.element_, goog.events.EventType.KEYPRESS, this, c);
  this.keyDownKey_ = goog.events.listen(this.element_, goog.events.EventType.KEYDOWN, this.handleKeyDown_, c, this);
  this.keyUpKey_ = goog.events.listen(this.element_, goog.events.EventType.KEYUP, this.handleKeyup_, c, this)
};
goog.events.KeyHandler.prototype.detach = function() {
  this.keyPressKey_ && (goog.events.unlistenByKey(this.keyPressKey_), goog.events.unlistenByKey(this.keyDownKey_), goog.events.unlistenByKey(this.keyUpKey_), this.keyUpKey_ = this.keyDownKey_ = this.keyPressKey_ = null);
  this.element_ = null;
  this.keyCode_ = this.lastKey_ = -1
};
goog.events.KeyHandler.prototype.disposeInternal = function() {
  goog.events.KeyHandler.superClass_.disposeInternal.call(this);
  this.detach()
};
goog.events.KeyEvent = function(a, c, d, e) {
  goog.events.BrowserEvent.call(this, e);
  this.type = goog.events.KeyHandler.EventType.KEY;
  this.keyCode = a;
  this.charCode = c;
  this.repeat = d
};
goog.inherits(goog.events.KeyEvent, goog.events.BrowserEvent);
goog.ui = {};
goog.ui.IdGenerator = function() {
};
goog.addSingletonGetter(goog.ui.IdGenerator);
goog.ui.IdGenerator.prototype.nextId_ = 0;
goog.ui.IdGenerator.prototype.getNextUniqueId = function() {
  return":" + (this.nextId_++).toString(36)
};
goog.ui.IdGenerator.instance = goog.ui.IdGenerator.getInstance();
goog.ui.Component = function(a) {
  goog.events.EventTarget.call(this);
  this.dom_ = a || goog.dom.getDomHelper();
  this.rightToLeft_ = goog.ui.Component.defaultRightToLeft_
};
goog.inherits(goog.ui.Component, goog.events.EventTarget);
goog.ui.Component.prototype.idGenerator_ = goog.ui.IdGenerator.getInstance();
goog.ui.Component.defaultRightToLeft_ = null;
goog.ui.Component.EventType = {BEFORE_SHOW:"beforeshow", SHOW:"show", HIDE:"hide", DISABLE:"disable", ENABLE:"enable", HIGHLIGHT:"highlight", UNHIGHLIGHT:"unhighlight", ACTIVATE:"activate", DEACTIVATE:"deactivate", SELECT:"select", UNSELECT:"unselect", CHECK:"check", UNCHECK:"uncheck", FOCUS:"focus", BLUR:"blur", OPEN:"open", CLOSE:"close", ENTER:"enter", LEAVE:"leave", ACTION:"action", CHANGE:"change"};
goog.ui.Component.Error = {NOT_SUPPORTED:"Method not supported", DECORATE_INVALID:"Invalid element to decorate", ALREADY_RENDERED:"Component already rendered", PARENT_UNABLE_TO_BE_SET:"Unable to set parent component", CHILD_INDEX_OUT_OF_BOUNDS:"Child component index out of bounds", NOT_OUR_CHILD:"Child is not in parent component", NOT_IN_DOCUMENT:"Operation not supported while component is not in document", STATE_INVALID:"Invalid component state"};
goog.ui.Component.State = {ALL:255, DISABLED:1, HOVER:2, ACTIVE:4, SELECTED:8, CHECKED:16, FOCUSED:32, OPENED:64};
goog.ui.Component.getStateTransitionEvent = function(a, c) {
  switch(a) {
    case goog.ui.Component.State.DISABLED:
      return c ? goog.ui.Component.EventType.DISABLE : goog.ui.Component.EventType.ENABLE;
    case goog.ui.Component.State.HOVER:
      return c ? goog.ui.Component.EventType.HIGHLIGHT : goog.ui.Component.EventType.UNHIGHLIGHT;
    case goog.ui.Component.State.ACTIVE:
      return c ? goog.ui.Component.EventType.ACTIVATE : goog.ui.Component.EventType.DEACTIVATE;
    case goog.ui.Component.State.SELECTED:
      return c ? goog.ui.Component.EventType.SELECT : goog.ui.Component.EventType.UNSELECT;
    case goog.ui.Component.State.CHECKED:
      return c ? goog.ui.Component.EventType.CHECK : goog.ui.Component.EventType.UNCHECK;
    case goog.ui.Component.State.FOCUSED:
      return c ? goog.ui.Component.EventType.FOCUS : goog.ui.Component.EventType.BLUR;
    case goog.ui.Component.State.OPENED:
      return c ? goog.ui.Component.EventType.OPEN : goog.ui.Component.EventType.CLOSE
  }
  throw Error(goog.ui.Component.Error.STATE_INVALID);
};
goog.ui.Component.setDefaultRightToLeft = function(a) {
  goog.ui.Component.defaultRightToLeft_ = a
};
goog.ui.Component.prototype.id_ = null;
goog.ui.Component.prototype.inDocument_ = !1;
goog.ui.Component.prototype.element_ = null;
goog.ui.Component.prototype.rightToLeft_ = null;
goog.ui.Component.prototype.model_ = null;
goog.ui.Component.prototype.parent_ = null;
goog.ui.Component.prototype.children_ = null;
goog.ui.Component.prototype.childIndex_ = null;
goog.ui.Component.prototype.wasDecorated_ = !1;
goog.ui.Component.prototype.getId = function() {
  return this.id_ || (this.id_ = this.idGenerator_.getNextUniqueId())
};
goog.ui.Component.prototype.setId = function(a) {
  this.parent_ && this.parent_.childIndex_ && (goog.object.remove(this.parent_.childIndex_, this.id_), goog.object.add(this.parent_.childIndex_, a, this));
  this.id_ = a
};
goog.ui.Component.prototype.getElement = function() {
  return this.element_
};
goog.ui.Component.prototype.setElementInternal = function(a) {
  this.element_ = a
};
goog.ui.Component.prototype.getElementsByClass = function(a) {
  return this.element_ ? this.dom_.getElementsByClass(a, this.element_) : []
};
goog.ui.Component.prototype.getElementByClass = function(a) {
  return this.element_ ? this.dom_.getElementByClass(a, this.element_) : null
};
goog.ui.Component.prototype.getHandler = function() {
  return this.googUiComponentHandler_ || (this.googUiComponentHandler_ = new goog.events.EventHandler(this))
};
goog.ui.Component.prototype.setParent = function(a) {
  if(this == a) {
    throw Error(goog.ui.Component.Error.PARENT_UNABLE_TO_BE_SET);
  }
  if(a && this.parent_ && this.id_ && this.parent_.getChild(this.id_) && this.parent_ != a) {
    throw Error(goog.ui.Component.Error.PARENT_UNABLE_TO_BE_SET);
  }
  this.parent_ = a;
  goog.ui.Component.superClass_.setParentEventTarget.call(this, a)
};
goog.ui.Component.prototype.getParent = function() {
  return this.parent_
};
goog.ui.Component.prototype.setParentEventTarget = function(a) {
  if(this.parent_ && this.parent_ != a) {
    throw Error(goog.ui.Component.Error.NOT_SUPPORTED);
  }
  goog.ui.Component.superClass_.setParentEventTarget.call(this, a)
};
goog.ui.Component.prototype.getDomHelper = function() {
  return this.dom_
};
goog.ui.Component.prototype.isInDocument = function() {
  return this.inDocument_
};
goog.ui.Component.prototype.createDom = function() {
  this.element_ = this.dom_.createElement("div")
};
goog.ui.Component.prototype.render = function(a) {
  this.render_(a)
};
goog.ui.Component.prototype.renderBefore = function(a) {
  this.render_(a.parentNode, a)
};
goog.ui.Component.prototype.render_ = function(a, c) {
  if(this.inDocument_) {
    throw Error(goog.ui.Component.Error.ALREADY_RENDERED);
  }
  this.element_ || this.createDom();
  a ? a.insertBefore(this.element_, c || null) : this.dom_.getDocument().body.appendChild(this.element_);
  (!this.parent_ || this.parent_.isInDocument()) && this.enterDocument()
};
goog.ui.Component.prototype.decorate = function(a) {
  if(this.inDocument_) {
    throw Error(goog.ui.Component.Error.ALREADY_RENDERED);
  }
  if(a && this.canDecorate(a)) {
    this.wasDecorated_ = !0;
    if(!this.dom_ || this.dom_.getDocument() != goog.dom.getOwnerDocument(a)) {
      this.dom_ = goog.dom.getDomHelper(a)
    }
    this.decorateInternal(a);
    this.enterDocument()
  }else {
    throw Error(goog.ui.Component.Error.DECORATE_INVALID);
  }
};
goog.ui.Component.prototype.canDecorate = function() {
  return!0
};
goog.ui.Component.prototype.wasDecorated = function() {
  return this.wasDecorated_
};
goog.ui.Component.prototype.decorateInternal = function(a) {
  this.element_ = a
};
goog.ui.Component.prototype.enterDocument = function() {
  this.inDocument_ = !0;
  this.forEachChild(function(a) {
    !a.isInDocument() && a.getElement() && a.enterDocument()
  })
};
goog.ui.Component.prototype.exitDocument = function() {
  this.forEachChild(function(a) {
    a.isInDocument() && a.exitDocument()
  });
  this.googUiComponentHandler_ && this.googUiComponentHandler_.removeAll();
  this.inDocument_ = !1
};
goog.ui.Component.prototype.disposeInternal = function() {
  goog.ui.Component.superClass_.disposeInternal.call(this);
  this.inDocument_ && this.exitDocument();
  this.googUiComponentHandler_ && (this.googUiComponentHandler_.dispose(), delete this.googUiComponentHandler_);
  this.forEachChild(function(a) {
    a.dispose()
  });
  !this.wasDecorated_ && this.element_ && goog.dom.removeNode(this.element_);
  this.parent_ = this.model_ = this.element_ = this.childIndex_ = this.children_ = null
};
goog.ui.Component.prototype.makeId = function(a) {
  return this.getId() + "." + a
};
goog.ui.Component.prototype.makeIds = function(a) {
  var c = {}, d;
  for(d in a) {
    c[d] = this.makeId(a[d])
  }
  return c
};
goog.ui.Component.prototype.getModel = function() {
  return this.model_
};
goog.ui.Component.prototype.setModel = function(a) {
  this.model_ = a
};
goog.ui.Component.prototype.getFragmentFromId = function(a) {
  return a.substring(this.getId().length + 1)
};
goog.ui.Component.prototype.getElementByFragment = function(a) {
  if(!this.inDocument_) {
    throw Error(goog.ui.Component.Error.NOT_IN_DOCUMENT);
  }
  return this.dom_.getElement(this.makeId(a))
};
goog.ui.Component.prototype.addChild = function(a, c) {
  this.addChildAt(a, this.getChildCount(), c)
};
goog.ui.Component.prototype.addChildAt = function(a, c, d) {
  if(a.inDocument_ && (d || !this.inDocument_)) {
    throw Error(goog.ui.Component.Error.ALREADY_RENDERED);
  }
  if(0 > c || c > this.getChildCount()) {
    throw Error(goog.ui.Component.Error.CHILD_INDEX_OUT_OF_BOUNDS);
  }
  if(!this.childIndex_ || !this.children_) {
    this.childIndex_ = {}, this.children_ = []
  }
  a.getParent() == this ? (goog.object.set(this.childIndex_, a.getId(), a), goog.array.remove(this.children_, a)) : goog.object.add(this.childIndex_, a.getId(), a);
  a.setParent(this);
  goog.array.insertAt(this.children_, a, c);
  a.inDocument_ && this.inDocument_ && a.getParent() == this ? (d = this.getContentElement(), d.insertBefore(a.getElement(), d.childNodes[c] || null)) : d ? (this.element_ || this.createDom(), c = this.getChildAt(c + 1), a.render_(this.getContentElement(), c ? c.element_ : null)) : this.inDocument_ && (!a.inDocument_ && a.element_ && a.element_.parentNode) && a.enterDocument()
};
goog.ui.Component.prototype.getContentElement = function() {
  return this.element_
};
goog.ui.Component.prototype.isRightToLeft = function() {
  null == this.rightToLeft_ && (this.rightToLeft_ = goog.style.isRightToLeft(this.inDocument_ ? this.element_ : this.dom_.getDocument().body));
  return this.rightToLeft_
};
goog.ui.Component.prototype.setRightToLeft = function(a) {
  if(this.inDocument_) {
    throw Error(goog.ui.Component.Error.ALREADY_RENDERED);
  }
  this.rightToLeft_ = a
};
goog.ui.Component.prototype.hasChildren = function() {
  return!!this.children_ && 0 != this.children_.length
};
goog.ui.Component.prototype.getChildCount = function() {
  return this.children_ ? this.children_.length : 0
};
goog.ui.Component.prototype.getChildIds = function() {
  var a = [];
  this.forEachChild(function(c) {
    a.push(c.getId())
  });
  return a
};
goog.ui.Component.prototype.getChild = function(a) {
  return this.childIndex_ && a ? goog.object.get(this.childIndex_, a) || null : null
};
goog.ui.Component.prototype.getChildAt = function(a) {
  return this.children_ ? this.children_[a] || null : null
};
goog.ui.Component.prototype.forEachChild = function(a, c) {
  this.children_ && goog.array.forEach(this.children_, a, c)
};
goog.ui.Component.prototype.indexOfChild = function(a) {
  return this.children_ && a ? goog.array.indexOf(this.children_, a) : -1
};
goog.ui.Component.prototype.removeChild = function(a, c) {
  if(a) {
    var d = goog.isString(a) ? a : a.getId(), a = this.getChild(d);
    d && a && (goog.object.remove(this.childIndex_, d), goog.array.remove(this.children_, a), c && (a.exitDocument(), a.element_ && goog.dom.removeNode(a.element_)), a.setParent(null))
  }
  if(!a) {
    throw Error(goog.ui.Component.Error.NOT_OUR_CHILD);
  }
  return a
};
goog.ui.Component.prototype.removeChildAt = function(a, c) {
  return this.removeChild(this.getChildAt(a), c)
};
goog.ui.Component.prototype.removeChildren = function(a) {
  for(var c = [];this.hasChildren();) {
    c.push(this.removeChildAt(0, a))
  }
  return c
};
goog.dom.a11y = {};
goog.dom.a11y.State = {ACTIVEDESCENDANT:"activedescendant", ATOMIC:"atomic", AUTOCOMPLETE:"autocomplete", BUSY:"busy", CHECKED:"checked", CONTROLS:"controls", DESCRIBEDBY:"describedby", DISABLED:"disabled", DROPEFFECT:"dropeffect", EXPANDED:"expanded", FLOWTO:"flowto", GRABBED:"grabbed", HASPOPUP:"haspopup", HIDDEN:"hidden", INVALID:"invalid", LABEL:"label", LABELLEDBY:"labelledby", LEVEL:"level", LIVE:"live", MULTILINE:"multiline", MULTISELECTABLE:"multiselectable", ORIENTATION:"orientation", OWNS:"owns", 
POSINSET:"posinset", PRESSED:"pressed", READONLY:"readonly", RELEVANT:"relevant", REQUIRED:"required", SELECTED:"selected", SETSIZE:"setsize", SORT:"sort", VALUEMAX:"valuemax", VALUEMIN:"valuemin", VALUENOW:"valuenow", VALUETEXT:"valuetext"};
goog.dom.a11y.Role = {ALERT:"alert", ALERTDIALOG:"alertdialog", APPLICATION:"application", ARTICLE:"article", BANNER:"banner", BUTTON:"button", CHECKBOX:"checkbox", COLUMNHEADER:"columnheader", COMBOBOX:"combobox", COMPLEMENTARY:"complementary", DIALOG:"dialog", DIRECTORY:"directory", DOCUMENT:"document", FORM:"form", GRID:"grid", GRIDCELL:"gridcell", GROUP:"group", HEADING:"heading", IMG:"img", LINK:"link", LIST:"list", LISTBOX:"listbox", LISTITEM:"listitem", LOG:"log", MAIN:"main", MARQUEE:"marquee", 
MATH:"math", MENU:"menu", MENUBAR:"menubar", MENU_ITEM:"menuitem", MENU_ITEM_CHECKBOX:"menuitemcheckbox", MENU_ITEM_RADIO:"menuitemradio", NAVIGATION:"navigation", NOTE:"note", OPTION:"option", PRESENTATION:"presentation", PROGRESSBAR:"progressbar", RADIO:"radio", RADIOGROUP:"radiogroup", REGION:"region", ROW:"row", ROWGROUP:"rowgroup", ROWHEADER:"rowheader", SCROLLBAR:"scrollbar", SEARCH:"search", SEPARATOR:"separator", SLIDER:"slider", SPINBUTTON:"spinbutton", STATUS:"status", TAB:"tab", TAB_LIST:"tablist", 
TAB_PANEL:"tabpanel", TEXTBOX:"textbox", TIMER:"timer", TOOLBAR:"toolbar", TOOLTIP:"tooltip", TREE:"tree", TREEGRID:"treegrid", TREEITEM:"treeitem"};
goog.dom.a11y.LivePriority = {OFF:"off", POLITE:"polite", ASSERTIVE:"assertive"};
goog.dom.a11y.setRole = function(a, c) {
  a.setAttribute("role", c)
};
goog.dom.a11y.getRole = function(a) {
  return a.getAttribute("role") || ""
};
goog.dom.a11y.setState = function(a, c, d) {
  a.setAttribute("aria-" + c, d)
};
goog.dom.a11y.getState = function(a, c) {
  var d = a.getAttribute("aria-" + c);
  return!0 === d || !1 === d ? d ? "true" : "false" : d ? String(d) : ""
};
goog.dom.a11y.getActiveDescendant = function(a) {
  var c = goog.dom.a11y.getState(a, goog.dom.a11y.State.ACTIVEDESCENDANT);
  return goog.dom.getOwnerDocument(a).getElementById(c)
};
goog.dom.a11y.setActiveDescendant = function(a, c) {
  goog.dom.a11y.setState(a, goog.dom.a11y.State.ACTIVEDESCENDANT, c ? c.id : "")
};
goog.dom.a11y.Announcer = function(a) {
  goog.Disposable.call(this);
  this.domHelper_ = a;
  this.liveRegions_ = {}
};
goog.inherits(goog.dom.a11y.Announcer, goog.Disposable);
goog.dom.a11y.Announcer.prototype.disposeInternal = function() {
  goog.object.forEach(this.liveRegions_, this.domHelper_.removeNode, this.domHelper_);
  this.domHelper_ = this.liveRegions_ = null;
  goog.dom.a11y.Announcer.superClass_.disposeInternal.call(this)
};
goog.dom.a11y.Announcer.prototype.say = function(a, c) {
  goog.dom.setTextContent(this.getLiveRegion_(c || goog.dom.a11y.LivePriority.POLITE), a)
};
goog.dom.a11y.Announcer.prototype.getLiveRegion_ = function(a) {
  if(this.liveRegions_[a]) {
    return this.liveRegions_[a]
  }
  var c;
  c = this.domHelper_.createElement("div");
  c.style.position = "absolute";
  c.style.top = "-1000px";
  goog.dom.a11y.setState(c, "live", a);
  goog.dom.a11y.setState(c, "atomic", "true");
  this.domHelper_.getDocument().body.appendChild(c);
  return this.liveRegions_[a] = c
};
goog.ui.ControlRenderer = function() {
};
goog.addSingletonGetter(goog.ui.ControlRenderer);
goog.ui.ControlRenderer.getCustomRenderer = function(a, c) {
  var d = new a;
  d.getCssClass = function() {
    return c
  };
  return d
};
goog.ui.ControlRenderer.CSS_CLASS = "goog-control";
goog.ui.ControlRenderer.IE6_CLASS_COMBINATIONS = [];
goog.ui.ControlRenderer.prototype.getAriaRole = function() {
};
goog.ui.ControlRenderer.prototype.createDom = function(a) {
  var c = a.getDomHelper().createDom("div", this.getClassNames(a).join(" "), a.getContent());
  this.setAriaStates(a, c);
  return c
};
goog.ui.ControlRenderer.prototype.getContentElement = function(a) {
  return a
};
goog.ui.ControlRenderer.prototype.enableClassName = function(a, c, d) {
  if(a = a.getElement ? a.getElement() : a) {
    if(goog.userAgent.IE && !goog.userAgent.isVersion("7")) {
      var e = this.getAppliedCombinedClassNames_(goog.dom.classes.get(a), c);
      e.push(c);
      goog.partial(d ? goog.dom.classes.add : goog.dom.classes.remove, a).apply(null, e)
    }else {
      goog.dom.classes.enable(a, c, d)
    }
  }
};
goog.ui.ControlRenderer.prototype.enableExtraClassName = function(a, c, d) {
  this.enableClassName(a, c, d)
};
goog.ui.ControlRenderer.prototype.canDecorate = function() {
  return!0
};
goog.ui.ControlRenderer.prototype.decorate = function(a, c) {
  c.id && a.setId(c.id);
  var d = this.getContentElement(c);
  d && d.firstChild ? a.setContentInternal(d.firstChild.nextSibling ? goog.array.clone(d.childNodes) : d.firstChild) : a.setContentInternal(null);
  var e = 0, f = this.getCssClass(), h = this.getStructuralCssClass(), i = !1, j = !1, d = !1, k = goog.dom.classes.get(c);
  goog.array.forEach(k, function(a) {
    !i && a == f ? (i = !0, h == f && (j = !0)) : !j && a == h ? j = !0 : e |= this.getStateFromClass(a)
  }, this);
  a.setStateInternal(e);
  i || (k.push(f), h == f && (j = !0));
  j || k.push(h);
  var l = a.getExtraClassNames();
  l && k.push.apply(k, l);
  if(goog.userAgent.IE && !goog.userAgent.isVersion("7")) {
    var p = this.getAppliedCombinedClassNames_(k);
    0 < p.length && (k.push.apply(k, p), d = !0)
  }
  (!i || !j || l || d) && goog.dom.classes.set(c, k.join(" "));
  this.setAriaStates(a, c);
  return c
};
goog.ui.ControlRenderer.prototype.initializeDom = function(a) {
  a.isRightToLeft() && this.setRightToLeft(a.getElement(), !0);
  a.isEnabled() && this.setFocusable(a, a.isVisible())
};
goog.ui.ControlRenderer.prototype.setAriaRole = function(a, c) {
  var d = c || this.getAriaRole();
  d && goog.dom.a11y.setRole(a, d)
};
goog.ui.ControlRenderer.prototype.setAriaStates = function(a, c) {
  goog.asserts.assert(a);
  goog.asserts.assert(c);
  a.isEnabled() || this.updateAriaState(c, goog.ui.Component.State.DISABLED, !0);
  a.isSelected() && this.updateAriaState(c, goog.ui.Component.State.SELECTED, !0);
  a.isSupportedState(goog.ui.Component.State.CHECKED) && this.updateAriaState(c, goog.ui.Component.State.CHECKED, a.isChecked());
  a.isSupportedState(goog.ui.Component.State.OPENED) && this.updateAriaState(c, goog.ui.Component.State.OPENED, a.isOpen())
};
goog.ui.ControlRenderer.prototype.setAllowTextSelection = function(a, c) {
  goog.style.setUnselectable(a, !c, !goog.userAgent.IE && !goog.userAgent.OPERA)
};
goog.ui.ControlRenderer.prototype.setRightToLeft = function(a, c) {
  this.enableClassName(a, this.getStructuralCssClass() + "-rtl", c)
};
goog.ui.ControlRenderer.prototype.isFocusable = function(a) {
  var c;
  return a.isSupportedState(goog.ui.Component.State.FOCUSED) && (c = a.getKeyEventTarget()) ? goog.dom.isFocusableTabIndex(c) : !1
};
goog.ui.ControlRenderer.prototype.setFocusable = function(a, c) {
  var d;
  if(a.isSupportedState(goog.ui.Component.State.FOCUSED) && (d = a.getKeyEventTarget())) {
    if(!c && a.isFocused()) {
      try {
        d.blur()
      }catch(e) {
      }
      a.isFocused() && a.handleBlur(null)
    }
    goog.dom.isFocusableTabIndex(d) != c && goog.dom.setFocusableTabIndex(d, c)
  }
};
goog.ui.ControlRenderer.prototype.setVisible = function(a, c) {
  goog.style.showElement(a, c)
};
goog.ui.ControlRenderer.prototype.setState = function(a, c, d) {
  var e = a.getElement();
  if(e) {
    var f = this.getClassForState(c);
    f && this.enableClassName(a, f, d);
    this.updateAriaState(e, c, d)
  }
};
goog.ui.ControlRenderer.prototype.updateAriaState = function(a, c, d) {
  goog.ui.ControlRenderer.ARIA_STATE_MAP_ || (goog.ui.ControlRenderer.ARIA_STATE_MAP_ = goog.object.create(goog.ui.Component.State.DISABLED, goog.dom.a11y.State.DISABLED, goog.ui.Component.State.SELECTED, goog.dom.a11y.State.SELECTED, goog.ui.Component.State.CHECKED, goog.dom.a11y.State.CHECKED, goog.ui.Component.State.OPENED, goog.dom.a11y.State.EXPANDED));
  (c = goog.ui.ControlRenderer.ARIA_STATE_MAP_[c]) && goog.dom.a11y.setState(a, c, d)
};
goog.ui.ControlRenderer.prototype.setContent = function(a, c) {
  var d = this.getContentElement(a);
  if(d && (goog.dom.removeChildren(d), c)) {
    if(goog.isString(c)) {
      goog.dom.setTextContent(d, c)
    }else {
      var e = function(a) {
        if(a) {
          var c = goog.dom.getOwnerDocument(d);
          d.appendChild(goog.isString(a) ? c.createTextNode(a) : a)
        }
      };
      goog.isArray(c) ? goog.array.forEach(c, e) : goog.isArrayLike(c) && !("nodeType" in c) ? goog.array.forEach(goog.array.clone(c), e) : e(c)
    }
  }
};
goog.ui.ControlRenderer.prototype.getKeyEventTarget = function(a) {
  return a.getElement()
};
goog.ui.ControlRenderer.prototype.getCssClass = function() {
  return goog.ui.ControlRenderer.CSS_CLASS
};
goog.ui.ControlRenderer.prototype.getIe6ClassCombinations = function() {
  return[]
};
goog.ui.ControlRenderer.prototype.getStructuralCssClass = function() {
  return this.getCssClass()
};
goog.ui.ControlRenderer.prototype.getClassNames = function(a) {
  var c = this.getCssClass(), d = [c], e = this.getStructuralCssClass();
  e != c && d.push(e);
  c = this.getClassNamesForState(a.getState());
  d.push.apply(d, c);
  (a = a.getExtraClassNames()) && d.push.apply(d, a);
  goog.userAgent.IE && !goog.userAgent.isVersion("7") && d.push.apply(d, this.getAppliedCombinedClassNames_(d));
  return d
};
goog.ui.ControlRenderer.prototype.getAppliedCombinedClassNames_ = function(a, c) {
  var d = [];
  c && (a = a.concat([c]));
  goog.array.forEach(this.getIe6ClassCombinations(), function(e) {
    goog.array.every(e, goog.partial(goog.array.contains, a)) && (!c || goog.array.contains(e, c)) && d.push(e.join("_"))
  });
  return d
};
goog.ui.ControlRenderer.prototype.getClassNamesForState = function(a) {
  for(var c = [];a;) {
    var d = a & -a;
    c.push(this.getClassForState(d));
    a &= ~d
  }
  return c
};
goog.ui.ControlRenderer.prototype.getClassForState = function(a) {
  this.classByState_ || this.createClassByStateMap_();
  return this.classByState_[a]
};
goog.ui.ControlRenderer.prototype.getStateFromClass = function(a) {
  this.stateByClass_ || this.createStateByClassMap_();
  a = parseInt(this.stateByClass_[a], 10);
  return isNaN(a) ? 0 : a
};
goog.ui.ControlRenderer.prototype.createClassByStateMap_ = function() {
  var a = this.getStructuralCssClass();
  this.classByState_ = goog.object.create(goog.ui.Component.State.DISABLED, a + "-disabled", goog.ui.Component.State.HOVER, a + "-hover", goog.ui.Component.State.ACTIVE, a + "-active", goog.ui.Component.State.SELECTED, a + "-selected", goog.ui.Component.State.CHECKED, a + "-checked", goog.ui.Component.State.FOCUSED, a + "-focused", goog.ui.Component.State.OPENED, a + "-open")
};
goog.ui.ControlRenderer.prototype.createStateByClassMap_ = function() {
  this.classByState_ || this.createClassByStateMap_();
  this.stateByClass_ = goog.object.transpose(this.classByState_)
};
goog.ui.registry = {};
goog.ui.registry.getDefaultRenderer = function(a) {
  for(var c;a;) {
    c = goog.getUid(a);
    if(c = goog.ui.registry.defaultRenderers_[c]) {
      break
    }
    a = a.superClass_ ? a.superClass_.constructor : null
  }
  return c ? goog.isFunction(c.getInstance) ? c.getInstance() : new c : null
};
goog.ui.registry.setDefaultRenderer = function(a, c) {
  if(!goog.isFunction(a)) {
    throw Error("Invalid component class " + a);
  }
  if(!goog.isFunction(c)) {
    throw Error("Invalid renderer class " + c);
  }
  var d = goog.getUid(a);
  goog.ui.registry.defaultRenderers_[d] = c
};
goog.ui.registry.getDecoratorByClassName = function(a) {
  return a in goog.ui.registry.decoratorFunctions_ ? goog.ui.registry.decoratorFunctions_[a]() : null
};
goog.ui.registry.setDecoratorByClassName = function(a, c) {
  if(!a) {
    throw Error("Invalid class name " + a);
  }
  if(!goog.isFunction(c)) {
    throw Error("Invalid decorator function " + c);
  }
  goog.ui.registry.decoratorFunctions_[a] = c
};
goog.ui.registry.getDecorator = function(a) {
  for(var c = goog.dom.classes.get(a), d = 0, e = c.length;d < e;d++) {
    if(a = goog.ui.registry.getDecoratorByClassName(c[d])) {
      return a
    }
  }
  return null
};
goog.ui.registry.reset = function() {
  goog.ui.registry.defaultRenderers_ = {};
  goog.ui.registry.decoratorFunctions_ = {}
};
goog.ui.registry.defaultRenderers_ = {};
goog.ui.registry.decoratorFunctions_ = {};
goog.ui.decorate = function(a) {
  var c = goog.ui.registry.getDecorator(a);
  c && c.decorate(a);
  return c
};
goog.ui.Control = function(a, c, d) {
  goog.ui.Component.call(this, d);
  this.renderer_ = c || goog.ui.registry.getDefaultRenderer(this.constructor);
  this.setContentInternal(a)
};
goog.inherits(goog.ui.Control, goog.ui.Component);
goog.ui.Control.registerDecorator = goog.ui.registry.setDecoratorByClassName;
goog.ui.Control.getDecorator = goog.ui.registry.getDecorator;
goog.ui.Control.decorate = goog.ui.decorate;
goog.ui.Control.prototype.content_ = null;
goog.ui.Control.prototype.state_ = 0;
goog.ui.Control.prototype.supportedStates_ = goog.ui.Component.State.DISABLED | goog.ui.Component.State.HOVER | goog.ui.Component.State.ACTIVE | goog.ui.Component.State.FOCUSED;
goog.ui.Control.prototype.autoStates_ = goog.ui.Component.State.ALL;
goog.ui.Control.prototype.statesWithTransitionEvents_ = 0;
goog.ui.Control.prototype.visible_ = !0;
goog.ui.Control.prototype.extraClassNames_ = null;
goog.ui.Control.prototype.handleMouseEvents_ = !0;
goog.ui.Control.prototype.allowTextSelection_ = !1;
goog.ui.Control.prototype.preferredAriaRole_ = null;
goog.ui.Control.prototype.isHandleMouseEvents = function() {
  return this.handleMouseEvents_
};
goog.ui.Control.prototype.setHandleMouseEvents = function(a) {
  this.isInDocument() && a != this.handleMouseEvents_ && this.enableMouseEventHandling_(a);
  this.handleMouseEvents_ = a
};
goog.ui.Control.prototype.getKeyEventTarget = function() {
  return this.renderer_.getKeyEventTarget(this)
};
goog.ui.Control.prototype.getKeyHandler = function() {
  return this.keyHandler_ || (this.keyHandler_ = new goog.events.KeyHandler)
};
goog.ui.Control.prototype.getRenderer = function() {
  return this.renderer_
};
goog.ui.Control.prototype.setRenderer = function(a) {
  if(this.isInDocument()) {
    throw Error(goog.ui.Component.Error.ALREADY_RENDERED);
  }
  this.getElement() && this.setElementInternal(null);
  this.renderer_ = a
};
goog.ui.Control.prototype.getExtraClassNames = function() {
  return this.extraClassNames_
};
goog.ui.Control.prototype.addClassName = function(a) {
  a && (this.extraClassNames_ ? goog.array.contains(this.extraClassNames_, a) || this.extraClassNames_.push(a) : this.extraClassNames_ = [a], this.renderer_.enableExtraClassName(this, a, !0))
};
goog.ui.Control.prototype.removeClassName = function(a) {
  a && this.extraClassNames_ && (goog.array.remove(this.extraClassNames_, a), 0 == this.extraClassNames_.length && (this.extraClassNames_ = null), this.renderer_.enableExtraClassName(this, a, !1))
};
goog.ui.Control.prototype.enableClassName = function(a, c) {
  c ? this.addClassName(a) : this.removeClassName(a)
};
goog.ui.Control.prototype.createDom = function() {
  var a = this.renderer_.createDom(this);
  this.setElementInternal(a);
  this.renderer_.setAriaRole(a, this.getPreferredAriaRole());
  this.isAllowTextSelection() || this.renderer_.setAllowTextSelection(a, !1);
  this.isVisible() || this.renderer_.setVisible(a, !1)
};
goog.ui.Control.prototype.getPreferredAriaRole = function() {
  return this.preferredAriaRole_
};
goog.ui.Control.prototype.setPreferredAriaRole = function(a) {
  this.preferredAriaRole_ = a
};
goog.ui.Control.prototype.getContentElement = function() {
  return this.renderer_.getContentElement(this.getElement())
};
goog.ui.Control.prototype.canDecorate = function(a) {
  return this.renderer_.canDecorate(a)
};
goog.ui.Control.prototype.decorateInternal = function(a) {
  a = this.renderer_.decorate(this, a);
  this.setElementInternal(a);
  this.renderer_.setAriaRole(a, this.getPreferredAriaRole());
  this.isAllowTextSelection() || this.renderer_.setAllowTextSelection(a, !1);
  this.visible_ = "none" != a.style.display
};
goog.ui.Control.prototype.enterDocument = function() {
  goog.ui.Control.superClass_.enterDocument.call(this);
  this.renderer_.initializeDom(this);
  if(this.supportedStates_ & ~goog.ui.Component.State.DISABLED && (this.isHandleMouseEvents() && this.enableMouseEventHandling_(!0), this.isSupportedState(goog.ui.Component.State.FOCUSED))) {
    var a = this.getKeyEventTarget();
    if(a) {
      var c = this.getKeyHandler();
      c.attach(a);
      this.getHandler().listen(c, goog.events.KeyHandler.EventType.KEY, this.handleKeyEvent).listen(a, goog.events.EventType.FOCUS, this.handleFocus).listen(a, goog.events.EventType.BLUR, this.handleBlur)
    }
  }
};
goog.ui.Control.prototype.enableMouseEventHandling_ = function(a) {
  var c = this.getHandler(), d = this.getElement();
  a ? (c.listen(d, goog.events.EventType.MOUSEOVER, this.handleMouseOver).listen(d, goog.events.EventType.MOUSEDOWN, this.handleMouseDown).listen(d, goog.events.EventType.MOUSEUP, this.handleMouseUp).listen(d, goog.events.EventType.MOUSEOUT, this.handleMouseOut), this.handleContextMenu != goog.nullFunction && c.listen(d, goog.events.EventType.CONTEXTMENU, this.handleContextMenu), goog.userAgent.IE && c.listen(d, goog.events.EventType.DBLCLICK, this.handleDblClick)) : (c.unlisten(d, goog.events.EventType.MOUSEOVER, 
  this.handleMouseOver).unlisten(d, goog.events.EventType.MOUSEDOWN, this.handleMouseDown).unlisten(d, goog.events.EventType.MOUSEUP, this.handleMouseUp).unlisten(d, goog.events.EventType.MOUSEOUT, this.handleMouseOut), this.handleContextMenu != goog.nullFunction && c.unlisten(d, goog.events.EventType.CONTEXTMENU, this.handleContextMenu), goog.userAgent.IE && c.unlisten(d, goog.events.EventType.DBLCLICK, this.handleDblClick))
};
goog.ui.Control.prototype.exitDocument = function() {
  goog.ui.Control.superClass_.exitDocument.call(this);
  this.keyHandler_ && this.keyHandler_.detach();
  this.isVisible() && this.isEnabled() && this.renderer_.setFocusable(this, !1)
};
goog.ui.Control.prototype.disposeInternal = function() {
  goog.ui.Control.superClass_.disposeInternal.call(this);
  this.keyHandler_ && (this.keyHandler_.dispose(), delete this.keyHandler_);
  delete this.renderer_;
  this.extraClassNames_ = this.content_ = null
};
goog.ui.Control.prototype.getContent = function() {
  return this.content_
};
goog.ui.Control.prototype.setContent = function(a) {
  this.renderer_.setContent(this.getElement(), a);
  this.setContentInternal(a)
};
goog.ui.Control.prototype.setContentInternal = function(a) {
  this.content_ = a
};
goog.ui.Control.prototype.getCaption = function() {
  var a = this.getContent();
  if(!a) {
    return""
  }
  a = goog.isString(a) ? a : goog.isArray(a) ? goog.array.map(a, goog.dom.getRawTextContent).join("") : goog.dom.getTextContent(a);
  return goog.string.collapseBreakingSpaces(a)
};
goog.ui.Control.prototype.setCaption = function(a) {
  this.setContent(a)
};
goog.ui.Control.prototype.setRightToLeft = function(a) {
  goog.ui.Control.superClass_.setRightToLeft.call(this, a);
  var c = this.getElement();
  c && this.renderer_.setRightToLeft(c, a)
};
goog.ui.Control.prototype.isAllowTextSelection = function() {
  return this.allowTextSelection_
};
goog.ui.Control.prototype.setAllowTextSelection = function(a) {
  this.allowTextSelection_ = a;
  var c = this.getElement();
  c && this.renderer_.setAllowTextSelection(c, a)
};
goog.ui.Control.prototype.isVisible = function() {
  return this.visible_
};
goog.ui.Control.prototype.setVisible = function(a, c) {
  if(c || this.visible_ != a && this.dispatchEvent(a ? goog.ui.Component.EventType.SHOW : goog.ui.Component.EventType.HIDE)) {
    var d = this.getElement();
    d && this.renderer_.setVisible(d, a);
    this.isEnabled() && this.renderer_.setFocusable(this, a);
    this.visible_ = a;
    return!0
  }
  return!1
};
goog.ui.Control.prototype.isEnabled = function() {
  return!this.hasState(goog.ui.Component.State.DISABLED)
};
goog.ui.Control.prototype.isParentDisabled_ = function() {
  var a = this.getParent();
  return!!a && "function" == typeof a.isEnabled && !a.isEnabled()
};
goog.ui.Control.prototype.setEnabled = function(a) {
  !this.isParentDisabled_() && this.isTransitionAllowed(goog.ui.Component.State.DISABLED, !a) && (a || (this.setActive(!1), this.setHighlighted(!1)), this.isVisible() && this.renderer_.setFocusable(this, a), this.setState(goog.ui.Component.State.DISABLED, !a))
};
goog.ui.Control.prototype.isHighlighted = function() {
  return this.hasState(goog.ui.Component.State.HOVER)
};
goog.ui.Control.prototype.setHighlighted = function(a) {
  this.isTransitionAllowed(goog.ui.Component.State.HOVER, a) && this.setState(goog.ui.Component.State.HOVER, a)
};
goog.ui.Control.prototype.isActive = function() {
  return this.hasState(goog.ui.Component.State.ACTIVE)
};
goog.ui.Control.prototype.setActive = function(a) {
  this.isTransitionAllowed(goog.ui.Component.State.ACTIVE, a) && this.setState(goog.ui.Component.State.ACTIVE, a)
};
goog.ui.Control.prototype.isSelected = function() {
  return this.hasState(goog.ui.Component.State.SELECTED)
};
goog.ui.Control.prototype.setSelected = function(a) {
  this.isTransitionAllowed(goog.ui.Component.State.SELECTED, a) && this.setState(goog.ui.Component.State.SELECTED, a)
};
goog.ui.Control.prototype.isChecked = function() {
  return this.hasState(goog.ui.Component.State.CHECKED)
};
goog.ui.Control.prototype.setChecked = function(a) {
  this.isTransitionAllowed(goog.ui.Component.State.CHECKED, a) && this.setState(goog.ui.Component.State.CHECKED, a)
};
goog.ui.Control.prototype.isFocused = function() {
  return this.hasState(goog.ui.Component.State.FOCUSED)
};
goog.ui.Control.prototype.setFocused = function(a) {
  this.isTransitionAllowed(goog.ui.Component.State.FOCUSED, a) && this.setState(goog.ui.Component.State.FOCUSED, a)
};
goog.ui.Control.prototype.isOpen = function() {
  return this.hasState(goog.ui.Component.State.OPENED)
};
goog.ui.Control.prototype.setOpen = function(a) {
  this.isTransitionAllowed(goog.ui.Component.State.OPENED, a) && this.setState(goog.ui.Component.State.OPENED, a)
};
goog.ui.Control.prototype.getState = function() {
  return this.state_
};
goog.ui.Control.prototype.hasState = function(a) {
  return!!(this.state_ & a)
};
goog.ui.Control.prototype.setState = function(a, c) {
  this.isSupportedState(a) && c != this.hasState(a) && (this.renderer_.setState(this, a, c), this.state_ = c ? this.state_ | a : this.state_ & ~a)
};
goog.ui.Control.prototype.setStateInternal = function(a) {
  this.state_ = a
};
goog.ui.Control.prototype.isSupportedState = function(a) {
  return!!(this.supportedStates_ & a)
};
goog.ui.Control.prototype.setSupportedState = function(a, c) {
  if(this.isInDocument() && this.hasState(a) && !c) {
    throw Error(goog.ui.Component.Error.ALREADY_RENDERED);
  }
  !c && this.hasState(a) && this.setState(a, !1);
  this.supportedStates_ = c ? this.supportedStates_ | a : this.supportedStates_ & ~a
};
goog.ui.Control.prototype.isAutoState = function(a) {
  return!!(this.autoStates_ & a) && this.isSupportedState(a)
};
goog.ui.Control.prototype.setAutoStates = function(a, c) {
  this.autoStates_ = c ? this.autoStates_ | a : this.autoStates_ & ~a
};
goog.ui.Control.prototype.isDispatchTransitionEvents = function(a) {
  return!!(this.statesWithTransitionEvents_ & a) && this.isSupportedState(a)
};
goog.ui.Control.prototype.setDispatchTransitionEvents = function(a, c) {
  this.statesWithTransitionEvents_ = c ? this.statesWithTransitionEvents_ | a : this.statesWithTransitionEvents_ & ~a
};
goog.ui.Control.prototype.isTransitionAllowed = function(a, c) {
  return this.isSupportedState(a) && this.hasState(a) != c && (!(this.statesWithTransitionEvents_ & a) || this.dispatchEvent(goog.ui.Component.getStateTransitionEvent(a, c))) && !this.isDisposed()
};
goog.ui.Control.prototype.handleMouseOver = function(a) {
  !goog.ui.Control.isMouseEventWithinElement_(a, this.getElement()) && (this.dispatchEvent(goog.ui.Component.EventType.ENTER) && this.isEnabled() && this.isAutoState(goog.ui.Component.State.HOVER)) && this.setHighlighted(!0)
};
goog.ui.Control.prototype.handleMouseOut = function(a) {
  !goog.ui.Control.isMouseEventWithinElement_(a, this.getElement()) && this.dispatchEvent(goog.ui.Component.EventType.LEAVE) && (this.isAutoState(goog.ui.Component.State.ACTIVE) && this.setActive(!1), this.isAutoState(goog.ui.Component.State.HOVER) && this.setHighlighted(!1))
};
goog.ui.Control.prototype.handleContextMenu = goog.nullFunction;
goog.ui.Control.isMouseEventWithinElement_ = function(a, c) {
  return!!a.relatedTarget && goog.dom.contains(c, a.relatedTarget)
};
goog.ui.Control.prototype.handleMouseDown = function(a) {
  this.isEnabled() && (this.isAutoState(goog.ui.Component.State.HOVER) && this.setHighlighted(!0), a.isMouseActionButton() && (this.isAutoState(goog.ui.Component.State.ACTIVE) && this.setActive(!0), this.renderer_.isFocusable(this) && this.getKeyEventTarget().focus()));
  !this.isAllowTextSelection() && a.isMouseActionButton() && a.preventDefault()
};
goog.ui.Control.prototype.handleMouseUp = function(a) {
  this.isEnabled() && (this.isAutoState(goog.ui.Component.State.HOVER) && this.setHighlighted(!0), this.isActive() && (this.performActionInternal(a) && this.isAutoState(goog.ui.Component.State.ACTIVE)) && this.setActive(!1))
};
goog.ui.Control.prototype.handleDblClick = function(a) {
  this.isEnabled() && this.performActionInternal(a)
};
goog.ui.Control.prototype.performActionInternal = function(a) {
  this.isAutoState(goog.ui.Component.State.CHECKED) && this.setChecked(!this.isChecked());
  this.isAutoState(goog.ui.Component.State.SELECTED) && this.setSelected(!0);
  this.isAutoState(goog.ui.Component.State.OPENED) && this.setOpen(!this.isOpen());
  var c = new goog.events.Event(goog.ui.Component.EventType.ACTION, this);
  a && (c.altKey = a.altKey, c.ctrlKey = a.ctrlKey, c.metaKey = a.metaKey, c.shiftKey = a.shiftKey, c.platformModifierKey = a.platformModifierKey);
  return this.dispatchEvent(c)
};
goog.ui.Control.prototype.handleFocus = function() {
  this.isAutoState(goog.ui.Component.State.FOCUSED) && this.setFocused(!0)
};
goog.ui.Control.prototype.handleBlur = function() {
  this.isAutoState(goog.ui.Component.State.ACTIVE) && this.setActive(!1);
  this.isAutoState(goog.ui.Component.State.FOCUSED) && this.setFocused(!1)
};
goog.ui.Control.prototype.handleKeyEvent = function(a) {
  return this.isVisible() && this.isEnabled() && this.handleKeyEventInternal(a) ? (a.preventDefault(), a.stopPropagation(), !0) : !1
};
goog.ui.Control.prototype.handleKeyEventInternal = function(a) {
  return a.keyCode == goog.events.KeyCodes.ENTER && this.performActionInternal(a)
};
goog.ui.registry.setDefaultRenderer(goog.ui.Control, goog.ui.ControlRenderer);
goog.ui.registry.setDecoratorByClassName(goog.ui.ControlRenderer.CSS_CLASS, function() {
  return new goog.ui.Control(null)
});
goog.ui.TextareaRenderer = function() {
  goog.ui.ControlRenderer.call(this)
};
goog.inherits(goog.ui.TextareaRenderer, goog.ui.ControlRenderer);
goog.addSingletonGetter(goog.ui.TextareaRenderer);
goog.ui.TextareaRenderer.CSS_CLASS = "goog-textarea";
goog.ui.TextareaRenderer.prototype.getAriaRole = function() {
};
goog.ui.TextareaRenderer.prototype.decorate = function(a, c) {
  this.setUpTextarea_(a);
  goog.ui.TextareaRenderer.superClass_.decorate.call(this, a, c);
  a.setContent(c.value);
  return c
};
goog.ui.TextareaRenderer.prototype.createDom = function(a) {
  this.setUpTextarea_(a);
  return a.getDomHelper().createDom("textarea", {"class":this.getClassNames(a).join(" "), disabled:!a.isEnabled()}, a.getContent() || "")
};
goog.ui.TextareaRenderer.prototype.canDecorate = function(a) {
  return a.tagName == goog.dom.TagName.TEXTAREA
};
goog.ui.TextareaRenderer.prototype.setRightToLeft = goog.nullFunction;
goog.ui.TextareaRenderer.prototype.isFocusable = function(a) {
  return a.isEnabled()
};
goog.ui.TextareaRenderer.prototype.setFocusable = goog.nullFunction;
goog.ui.TextareaRenderer.prototype.setState = function(a, c, d) {
  goog.ui.TextareaRenderer.superClass_.setState.call(this, a, c, d);
  if((a = a.getElement()) && c == goog.ui.Component.State.DISABLED) {
    a.disabled = d
  }
};
goog.ui.TextareaRenderer.prototype.updateAriaState = goog.nullFunction;
goog.ui.TextareaRenderer.prototype.setUpTextarea_ = function(a) {
  a.setHandleMouseEvents(!1);
  a.setAutoStates(goog.ui.Component.State.ALL, !1);
  a.setSupportedState(goog.ui.Component.State.FOCUSED, !1)
};
goog.ui.TextareaRenderer.prototype.setContent = function(a, c) {
  a && (a.value = c)
};
goog.ui.TextareaRenderer.prototype.getCssClass = function() {
  return goog.ui.TextareaRenderer.CSS_CLASS
};
goog.userAgent.product = {};
goog.userAgent.product.ASSUME_FIREFOX = !1;
goog.userAgent.product.ASSUME_CAMINO = !1;
goog.userAgent.product.ASSUME_IPHONE = !1;
goog.userAgent.product.ASSUME_IPAD = !1;
goog.userAgent.product.ASSUME_ANDROID = !1;
goog.userAgent.product.ASSUME_CHROME = !1;
goog.userAgent.product.ASSUME_SAFARI = !1;
goog.userAgent.product.PRODUCT_KNOWN_ = goog.userAgent.ASSUME_IE || goog.userAgent.ASSUME_OPERA || goog.userAgent.product.ASSUME_FIREFOX || goog.userAgent.product.ASSUME_CAMINO || goog.userAgent.product.ASSUME_IPHONE || goog.userAgent.product.ASSUME_IPAD || goog.userAgent.product.ASSUME_ANDROID || goog.userAgent.product.ASSUME_CHROME || goog.userAgent.product.ASSUME_SAFARI;
goog.userAgent.product.init_ = function() {
  goog.userAgent.product.detectedFirefox_ = !1;
  goog.userAgent.product.detectedCamino_ = !1;
  goog.userAgent.product.detectedIphone_ = !1;
  goog.userAgent.product.detectedIpad_ = !1;
  goog.userAgent.product.detectedAndroid_ = !1;
  goog.userAgent.product.detectedChrome_ = !1;
  goog.userAgent.product.detectedSafari_ = !1;
  var a = goog.userAgent.getUserAgentString();
  a && (-1 != a.indexOf("Firefox") ? goog.userAgent.product.detectedFirefox_ = !0 : -1 != a.indexOf("Camino") ? goog.userAgent.product.detectedCamino_ = !0 : -1 != a.indexOf("iPhone") || -1 != a.indexOf("iPod") ? goog.userAgent.product.detectedIphone_ = !0 : -1 != a.indexOf("iPad") ? goog.userAgent.product.detectedIpad_ = !0 : -1 != a.indexOf("Android") ? goog.userAgent.product.detectedAndroid_ = !0 : -1 != a.indexOf("Chrome") ? goog.userAgent.product.detectedChrome_ = !0 : -1 != a.indexOf("Safari") && 
  (goog.userAgent.product.detectedSafari_ = !0))
};
goog.userAgent.product.PRODUCT_KNOWN_ || goog.userAgent.product.init_();
goog.userAgent.product.OPERA = goog.userAgent.OPERA;
goog.userAgent.product.IE = goog.userAgent.IE;
goog.userAgent.product.FIREFOX = goog.userAgent.product.PRODUCT_KNOWN_ ? goog.userAgent.product.ASSUME_FIREFOX : goog.userAgent.product.detectedFirefox_;
goog.userAgent.product.CAMINO = goog.userAgent.product.PRODUCT_KNOWN_ ? goog.userAgent.product.ASSUME_CAMINO : goog.userAgent.product.detectedCamino_;
goog.userAgent.product.IPHONE = goog.userAgent.product.PRODUCT_KNOWN_ ? goog.userAgent.product.ASSUME_IPHONE : goog.userAgent.product.detectedIphone_;
goog.userAgent.product.IPAD = goog.userAgent.product.PRODUCT_KNOWN_ ? goog.userAgent.product.ASSUME_IPAD : goog.userAgent.product.detectedIpad_;
goog.userAgent.product.ANDROID = goog.userAgent.product.PRODUCT_KNOWN_ ? goog.userAgent.product.ASSUME_ANDROID : goog.userAgent.product.detectedAndroid_;
goog.userAgent.product.CHROME = goog.userAgent.product.PRODUCT_KNOWN_ ? goog.userAgent.product.ASSUME_CHROME : goog.userAgent.product.detectedChrome_;
goog.userAgent.product.SAFARI = goog.userAgent.product.PRODUCT_KNOWN_ ? goog.userAgent.product.ASSUME_SAFARI : goog.userAgent.product.detectedSafari_;
goog.ui.Textarea = function(a, c, d) {
  goog.ui.Control.call(this, a, c || goog.ui.TextareaRenderer.getInstance(), d);
  this.setHandleMouseEvents(!1);
  this.setAllowTextSelection(!0);
  a || this.setContentInternal("")
};
goog.inherits(goog.ui.Textarea, goog.ui.Control);
goog.ui.Textarea.NEEDS_HELP_SHRINKING_ = goog.userAgent.GECKO || goog.userAgent.WEBKIT;
goog.ui.Textarea.prototype.isResizing_ = !1;
goog.ui.Textarea.prototype.height_ = 0;
goog.ui.Textarea.prototype.maxHeight_ = 0;
goog.ui.Textarea.prototype.minHeight_ = 0;
goog.ui.Textarea.prototype.hasDiscoveredTextareaCharacteristics_ = !1;
goog.ui.Textarea.prototype.needsPaddingBorderFix_ = !1;
goog.ui.Textarea.prototype.scrollHeightIncludesPadding_ = !1;
goog.ui.Textarea.prototype.scrollHeightIncludesBorder_ = !1;
goog.ui.Textarea.EventType = {RESIZE:"resize"};
goog.ui.Textarea.prototype.getPaddingBorderBoxHeight_ = function() {
  return this.paddingBox_.top + this.paddingBox_.bottom + this.borderBox_.top + this.borderBox_.bottom
};
goog.ui.Textarea.prototype.getMinHeight = function() {
  return this.minHeight_
};
goog.ui.Textarea.prototype.getMinHeight_ = function() {
  var a = this.minHeight_, c = this.getElement();
  a && (c && this.needsPaddingBorderFix_) && (a -= this.getPaddingBorderBoxHeight_());
  return a
};
goog.ui.Textarea.prototype.setMinHeight = function(a) {
  this.minHeight_ = a;
  this.resize()
};
goog.ui.Textarea.prototype.getMaxHeight = function() {
  return this.maxHeight_
};
goog.ui.Textarea.prototype.getMaxHeight_ = function() {
  var a = this.maxHeight_, c = this.getElement();
  a && (c && this.needsPaddingBorderFix_) && (a -= this.getPaddingBorderBoxHeight_());
  return a
};
goog.ui.Textarea.prototype.setMaxHeight = function(a) {
  this.maxHeight_ = a;
  this.resize()
};
goog.ui.Textarea.prototype.setValue = function(a) {
  this.setContent(String(a))
};
goog.ui.Textarea.prototype.getValue = function() {
  return this.getElement().value
};
goog.ui.Textarea.prototype.setContent = function(a) {
  goog.ui.Textarea.superClass_.setContent.call(this, a);
  this.resize()
};
goog.ui.Textarea.prototype.setEnabled = function(a) {
  goog.ui.Textarea.superClass_.setEnabled.call(this, a);
  this.getElement().disabled = !a
};
goog.ui.Textarea.prototype.resize = function() {
  this.getElement() && this.grow_()
};
goog.ui.Textarea.prototype.enterDocument = function() {
  goog.ui.Textarea.superClass_.enterDocument.call(this);
  var a = this.getElement();
  goog.style.setStyle(a, {overflowY:"hidden", overflowX:"auto", boxSizing:"border-box", MsBoxSizing:"border-box", WebkitBoxSizing:"border-box", MozBoxSizing:"border-box"});
  this.paddingBox_ = goog.style.getPaddingBox(a);
  this.borderBox_ = goog.style.getBorderBox(a);
  this.getHandler().listen(a, goog.events.EventType.SCROLL, this.grow_).listen(a, goog.events.EventType.FOCUS, this.grow_).listen(a, goog.events.EventType.KEYUP, this.grow_).listen(a, goog.events.EventType.MOUSEUP, this.mouseUpListener_);
  this.resize()
};
goog.ui.Textarea.prototype.getHeight_ = function() {
  this.discoverTextareaCharacteristics_();
  var a = this.getElement(), c = this.getElement().scrollHeight + this.getHorizontalScrollBarHeight_();
  if(this.needsPaddingBorderFix_) {
    c -= this.getPaddingBorderBoxHeight_()
  }else {
    if(!this.scrollHeightIncludesPadding_) {
      var d = this.paddingBox_, c = c + (d.top + d.bottom)
    }
    this.scrollHeightIncludesBorder_ || (a = goog.style.getBorderBox(a), c += a.top + a.bottom)
  }
  return c
};
goog.ui.Textarea.prototype.setHeight_ = function(a) {
  this.height_ != a && (this.height_ = a, this.getElement().style.height = a + "px")
};
goog.ui.Textarea.prototype.setHeightToEstimate_ = function() {
  var a = this.getElement();
  a.style.height = "auto";
  var c = a.value.match(/\n/g) || [];
  a.rows = c.length + 1
};
goog.ui.Textarea.prototype.getHorizontalScrollBarHeight_ = function() {
  var a = this.getElement(), c = a.offsetHeight - a.clientHeight;
  if(!this.scrollHeightIncludesPadding_) {
    var d = this.paddingBox_, c = c - (d.top + d.bottom)
  }
  this.scrollHeightIncludesBorder_ || (a = goog.style.getBorderBox(a), c -= a.top + a.bottom);
  return 0 < c ? c : 0
};
goog.ui.Textarea.prototype.discoverTextareaCharacteristics_ = function() {
  if(!this.hasDiscoveredTextareaCharacteristics_) {
    var a = this.getElement().cloneNode(!1);
    goog.style.setStyle(a, {position:"absolute", height:"auto", top:"-9999px", margin:"0", padding:"1px", border:"1px solid #000", overflow:"hidden"});
    goog.dom.appendChild(this.getDomHelper().getDocument().body, a);
    var c = a.scrollHeight;
    a.style.padding = "10px";
    var d = a.scrollHeight;
    this.scrollHeightIncludesPadding_ = d > c;
    a.style.borderWidth = "10px";
    this.scrollHeightIncludesBorder_ = a.scrollHeight > d;
    a.style.height = "100px";
    100 != a.offsetHeight && (this.needsPaddingBorderFix_ = !0);
    goog.dom.removeNode(a);
    this.hasDiscoveredTextareaCharacteristics_ = !0
  }
};
goog.ui.Textarea.prototype.grow_ = function() {
  if(!this.isResizing_) {
    var a = !1;
    this.isResizing_ = !0;
    var c = this.getElement(), d = this.height_;
    if(c.scrollHeight) {
      var e = !1, f = !1, h = this.getHeight_(), i = c.offsetHeight, j = this.getMinHeight_(), k = this.getMaxHeight_();
      j && h < j ? (this.setHeight_(j), e = !0) : k && h > k ? (this.setHeight_(k), c.style.overflowY = "", f = !0) : i != h ? this.setHeight_(h) : this.height_ || (this.height_ = h);
      !e && (!f && goog.ui.Textarea.NEEDS_HELP_SHRINKING_) && (a = !0)
    }else {
      this.setHeightToEstimate_()
    }
    this.isResizing_ = !1;
    a && this.shrink_();
    d != this.height_ && this.dispatchEvent(goog.ui.Textarea.EventType.RESIZE)
  }
};
goog.ui.Textarea.prototype.shrink_ = function() {
  var a = this.getElement();
  if(!this.isResizing_) {
    this.isResizing_ = !0;
    var c = !1;
    a.value || (a.value = " ", c = !0);
    var d = a.scrollHeight;
    if(d) {
      var e = this.getHeight_(), f = this.getMinHeight_(), h = this.getMaxHeight_();
      !(f && e <= f) && !(h && e >= h) && (h = this.paddingBox_, a.style.paddingBottom = h.bottom + 1 + "px", this.getHeight_() == e && (a.style.paddingBottom = h.bottom + d + "px", a.scrollTop = 0, d = this.getHeight_() - d, d >= f ? this.setHeight_(d) : this.setHeight_(f)), a.style.paddingBottom = h.bottom + "px")
    }else {
      this.setHeightToEstimate_()
    }
    c && (a.value = "");
    this.isResizing_ = !1
  }
};
goog.ui.Textarea.prototype.mouseUpListener_ = function() {
  var a = this.getElement(), c = a.offsetHeight;
  a.filters && a.filters.length && (a = a.filters.item("DXImageTransform.Microsoft.DropShadow")) && (c -= a.offX);
  c != this.height_ && (this.height_ = this.minHeight_ = c)
};
goog.structs.InversionMap = function(a, c, d) {
  if(a.length != c.length) {
    return null
  }
  this.storeInversion_(a, d);
  this.values = c
};
goog.structs.InversionMap.prototype.storeInversion_ = function(a, c) {
  this.rangeArray = a;
  for(var d = 1;d < a.length;d++) {
    null == a[d] ? a[d] = a[d - 1] + 1 : c && (a[d] += a[d - 1])
  }
};
goog.structs.InversionMap.prototype.spliceInversion = function(a, c, d) {
  var a = new goog.structs.InversionMap(a, c, d), d = a.rangeArray[0], e = goog.array.peek(a.rangeArray), c = this.getLeast(d), e = this.getLeast(e);
  d != this.rangeArray[c] && c++;
  d = e - c + 1;
  goog.partial(goog.array.splice, this.rangeArray, c, d).apply(null, a.rangeArray);
  goog.partial(goog.array.splice, this.values, c, d).apply(null, a.values)
};
goog.structs.InversionMap.prototype.at = function(a) {
  a = this.getLeast(a);
  return 0 > a ? null : this.values[a]
};
goog.structs.InversionMap.prototype.getLeast = function(a) {
  for(var c = this.rangeArray, d = 0, e = c.length;8 < e - d;) {
    var f = e + d >> 1;
    c[f] <= a ? d = f : e = f
  }
  for(;d < e && !(a < c[d]);++d) {
  }
  return d - 1
};
goog.i18n = {};
goog.i18n.GraphemeBreak = {};
goog.i18n.GraphemeBreak.property = {ANY:0, CONTROL:1, EXTEND:2, PREPEND:3, SPACING_MARK:4, L:5, V:6, T:7, LV:8, LVT:9, CR:10, LF:11};
goog.i18n.GraphemeBreak.inversions_ = null;
goog.i18n.GraphemeBreak.applyLegacyBreakRules_ = function(a, c) {
  var d = goog.i18n.GraphemeBreak.property;
  return a == d.CR && c == d.LF ? !1 : a == d.CONTROL || a == d.CR || a == d.LF || c == d.CONTROL || c == d.CR || c == d.LF ? !0 : a == d.L && (c == d.L || c == d.V || c == d.LV || c == d.LVT) || (a == d.LV || a == d.V) && (c == d.V || c == d.T) || (a == d.LVT || a == d.T) && c == d.T || c == d.EXTEND ? !1 : !0
};
goog.i18n.GraphemeBreak.getBreakProp_ = function(a) {
  if(44032 <= a && 55203 >= a) {
    var c = goog.i18n.GraphemeBreak.property;
    return 16 == a % 28 ? c.LV : c.LVT
  }
  goog.i18n.GraphemeBreak.inversions_ || (goog.i18n.GraphemeBreak.inversions_ = new goog.structs.InversionMap([0, 10, 1, 2, 1, 18, 95, 33, 13, 1, 594, 112, 275, 7, 263, 45, 1, 1, 1, 2, 1, 2, 1, 1, 56, 4, 12, 11, 48, 20, 17, 1, 101, 7, 1, 7, 2, 2, 1, 4, 33, 1, 1, 1, 30, 27, 91, 11, 58, 9, 269, 2, 1, 56, 1, 1, 3, 8, 4, 1, 3, 4, 13, 2, 29, 1, 2, 56, 1, 1, 1, 2, 6, 6, 1, 9, 1, 10, 2, 29, 2, 1, 56, 2, 3, 17, 30, 2, 3, 14, 1, 56, 1, 1, 3, 8, 4, 1, 20, 2, 29, 1, 2, 56, 1, 1, 2, 1, 6, 6, 11, 10, 2, 30, 1, 
  59, 1, 1, 1, 12, 1, 9, 1, 41, 3, 58, 3, 5, 17, 11, 2, 30, 2, 56, 1, 1, 1, 1, 2, 1, 3, 1, 5, 11, 11, 2, 30, 2, 58, 1, 2, 5, 7, 11, 10, 2, 30, 2, 70, 6, 2, 6, 7, 19, 2, 60, 11, 5, 5, 1, 1, 8, 97, 13, 3, 5, 3, 6, 74, 2, 27, 1, 1, 1, 1, 1, 4, 2, 49, 14, 1, 5, 1, 2, 8, 45, 9, 1, 100, 2, 4, 1, 6, 1, 2, 2, 2, 23, 2, 2, 4, 3, 1, 3, 2, 7, 3, 4, 13, 1, 2, 2, 6, 1, 1, 1, 112, 96, 72, 82, 357, 1, 946, 3, 29, 3, 29, 2, 30, 2, 64, 2, 1, 7, 8, 1, 2, 11, 9, 1, 45, 3, 155, 1, 118, 3, 4, 2, 9, 1, 6, 3, 116, 17, 
  7, 2, 77, 2, 3, 228, 4, 1, 47, 1, 1, 5, 1, 1, 5, 1, 2, 38, 9, 12, 2, 1, 30, 1, 4, 2, 2, 1, 121, 8, 8, 2, 2, 392, 64, 523, 1, 2, 2, 24, 7, 49, 16, 96, 33, 3311, 32, 554, 6, 105, 2, 30164, 4, 9, 2, 388, 1, 3, 1, 4, 1, 23, 2, 2, 1, 88, 2, 50, 16, 1, 97, 8, 25, 11, 2, 213, 6, 2, 2, 2, 2, 12, 1, 8, 1, 1, 434, 11172, 1116, 1024, 6942, 1, 737, 16, 16, 7, 216, 1, 158, 2, 89, 3, 513, 1, 2051, 15, 40, 8, 50981, 1, 1, 3, 3, 1, 5, 8, 8, 2, 7, 30, 4, 148, 3, 798140, 255], [1, 11, 1, 10, 1, 0, 1, 0, 1, 0, 2, 
  0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 1, 0, 2, 0, 2, 0, 2, 0, 2, 1, 2, 0, 2, 0, 2, 0, 1, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 4, 0, 2, 0, 4, 2, 4, 2, 0, 2, 0, 2, 0, 2, 4, 0, 2, 0, 2, 4, 2, 4, 2, 0, 2, 0, 2, 0, 2, 4, 0, 2, 4, 2, 0, 2, 0, 2, 4, 0, 2, 0, 4, 2, 4, 2, 0, 2, 0, 2, 4, 0, 2, 0, 2, 4, 2, 4, 2, 0, 2, 0, 2, 0, 2, 4, 2, 4, 2, 0, 2, 0, 4, 0, 2, 4, 2, 0, 2, 0, 4, 0, 2, 0, 4, 2, 4, 2, 4, 2, 4, 2, 0, 2, 0, 4, 0, 2, 4, 2, 4, 2, 0, 2, 0, 4, 0, 2, 4, 2, 4, 2, 4, 0, 2, 0, 3, 2, 0, 2, 0, 2, 0, 3, 0, 2, 0, 
  2, 0, 2, 0, 2, 0, 2, 0, 4, 0, 2, 4, 2, 0, 2, 0, 2, 0, 2, 0, 4, 2, 4, 2, 4, 2, 4, 2, 0, 4, 2, 0, 2, 0, 4, 0, 4, 0, 2, 0, 2, 4, 2, 4, 2, 0, 4, 0, 5, 6, 7, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 1, 4, 2, 4, 2, 4, 2, 0, 2, 0, 2, 0, 2, 0, 2, 4, 2, 4, 2, 4, 2, 0, 4, 0, 4, 0, 2, 4, 0, 2, 4, 0, 2, 4, 2, 4, 2, 4, 2, 4, 0, 2, 0, 2, 4, 0, 4, 2, 4, 2, 4, 0, 4, 2, 4, 2, 0, 2, 0, 1, 2, 1, 0, 1, 0, 1, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 4, 2, 4, 0, 4, 0, 4, 2, 0, 2, 0, 2, 4, 0, 2, 4, 2, 4, 2, 0, 
  2, 0, 2, 4, 0, 9, 0, 2, 0, 2, 0, 2, 0, 2, 0, 1, 0, 2, 0, 1, 0, 2, 0, 2, 0, 2, 0, 2, 4, 2, 0, 4, 2, 1, 2, 0, 2, 0, 2, 0, 2, 0, 1, 2], !0));
  return goog.i18n.GraphemeBreak.inversions_.at(a)
};
goog.i18n.GraphemeBreak.hasGraphemeBreak = function(a, c, d) {
  var a = goog.i18n.GraphemeBreak.getBreakProp_(a), c = goog.i18n.GraphemeBreak.getBreakProp_(c), e = goog.i18n.GraphemeBreak.property;
  return goog.i18n.GraphemeBreak.applyLegacyBreakRules_(a, c) && !(d && (a == e.PREPEND || c == e.SPACING_MARK))
};
goog.format = {};
goog.format.fileSize = function(a, c) {
  return goog.format.numBytesToString(a, c, !1)
};
goog.format.isConvertableScaledNumber = function(a) {
  return goog.format.SCALED_NUMERIC_RE_.test(a)
};
goog.format.stringToNumericValue = function(a) {
  return goog.string.endsWith(a, "B") ? goog.format.stringToNumericValue_(a, goog.format.NUMERIC_SCALES_BINARY_) : goog.format.stringToNumericValue_(a, goog.format.NUMERIC_SCALES_SI_)
};
goog.format.stringToNumBytes = function(a) {
  return goog.format.stringToNumericValue_(a, goog.format.NUMERIC_SCALES_BINARY_)
};
goog.format.numericValueToString = function(a, c) {
  return goog.format.numericValueToString_(a, goog.format.NUMERIC_SCALES_SI_, c)
};
goog.format.numBytesToString = function(a, c, d) {
  var e = "";
  if(!goog.isDef(d) || d) {
    e = "B"
  }
  return goog.format.numericValueToString_(a, goog.format.NUMERIC_SCALES_BINARY_, c, e)
};
goog.format.stringToNumericValue_ = function(a, c) {
  var d = a.match(goog.format.SCALED_NUMERIC_RE_);
  return!d ? NaN : d[1] * c[d[2]]
};
goog.format.numericValueToString_ = function(a, c, d, e) {
  var f = goog.format.NUMERIC_SCALE_PREFIXES_, h = a, i = "", j = 1;
  0 > a && (a = -a);
  for(var k = 0;k < f.length;k++) {
    var l = f[k], j = c[l];
    if(a >= j || 1 >= j && a > 0.1 * j) {
      i = l;
      break
    }
  }
  i ? e && (i += e) : j = 1;
  a = Math.pow(10, goog.isDef(d) ? d : 2);
  return Math.round(h / j * a) / a + i
};
goog.format.SCALED_NUMERIC_RE_ = /^([-]?\d+\.?\d*)([K,M,G,T,P,k,m,u,n]?)[B]?$/;
goog.format.NUMERIC_SCALE_PREFIXES_ = "P T G M K  m u n".split(" ");
goog.format.NUMERIC_SCALES_SI_ = {"":1, n:1E-9, u:1E-6, m:0.001, k:1E3, K:1E3, M:1E6, G:1E9, T:1E12, P:1E15};
goog.format.NUMERIC_SCALES_BINARY_ = {"":1, n:Math.pow(1024, -3), u:Math.pow(1024, -2), m:1 / 1024, k:1024, K:1024, M:Math.pow(1024, 2), G:Math.pow(1024, 3), T:Math.pow(1024, 4), P:Math.pow(1024, 5)};
goog.format.FIRST_GRAPHEME_EXTEND_ = 768;
goog.format.isTreatedAsBreakingSpace_ = function(a) {
  return a <= goog.format.WbrToken_.SPACE || 4096 <= a && (8192 <= a && 8198 >= a || 8200 <= a && 8203 >= a || 5760 == a || 6158 == a || 8232 == a || 8233 == a || 8287 == a || 12288 == a)
};
goog.format.isInvisibleFormattingCharacter_ = function(a) {
  return 8204 <= a && 8207 >= a || 8234 <= a && 8238 >= a
};
goog.format.insertWordBreaksGeneric_ = function(a, c, d) {
  d = d || 10;
  if(d > a.length) {
    return a
  }
  for(var e = [], f = 0, h = 0, i = 0, j = 0, k = 0;k < a.length;k++) {
    var l = j, j = a.charCodeAt(k), l = j >= goog.format.FIRST_GRAPHEME_EXTEND_ && !c(l, j, !0);
    f >= d && (!goog.format.isTreatedAsBreakingSpace_(j) && !l) && (e.push(a.substring(i, k), goog.format.WORD_BREAK_HTML), i = k, f = 0);
    h ? j == goog.format.WbrToken_.GT && h == goog.format.WbrToken_.LT ? h = 0 : j == goog.format.WbrToken_.SEMI_COLON && h == goog.format.WbrToken_.AMP && (h = 0, f++) : j == goog.format.WbrToken_.LT || j == goog.format.WbrToken_.AMP ? h = j : goog.format.isTreatedAsBreakingSpace_(j) ? f = 0 : goog.format.isInvisibleFormattingCharacter_(j) || f++
  }
  e.push(a.substr(i));
  return e.join("")
};
goog.format.insertWordBreaks = function(a, c) {
  return goog.format.insertWordBreaksGeneric_(a, goog.i18n.GraphemeBreak.hasGraphemeBreak, c)
};
goog.format.conservativelyHasGraphemeBreak_ = function(a, c) {
  return 1024 <= c && 1315 > c
};
goog.format.insertWordBreaksBasic = function(a, c) {
  return goog.format.insertWordBreaksGeneric_(a, goog.format.conservativelyHasGraphemeBreak_, c)
};
goog.format.IS_IE8_OR_ABOVE_ = goog.userAgent.IE && goog.userAgent.isVersion(8);
goog.format.WORD_BREAK_HTML = goog.userAgent.WEBKIT ? "<wbr></wbr>" : goog.userAgent.OPERA ? "&shy;" : goog.format.IS_IE8_OR_ABOVE_ ? "&#8203;" : "<wbr>";
goog.format.WbrToken_ = {LT:60, GT:62, AMP:38, SEMI_COLON:59, SPACE:32};
goog.i18n.bidi = {};
goog.i18n.bidi.FORCE_RTL = !1;
goog.i18n.bidi.IS_RTL = goog.i18n.bidi.FORCE_RTL || ("ar" == goog.LOCALE.substring(0, 2).toLowerCase() || "fa" == goog.LOCALE.substring(0, 2).toLowerCase() || "he" == goog.LOCALE.substring(0, 2).toLowerCase() || "iw" == goog.LOCALE.substring(0, 2).toLowerCase() || "ur" == goog.LOCALE.substring(0, 2).toLowerCase() || "yi" == goog.LOCALE.substring(0, 2).toLowerCase()) && (2 == goog.LOCALE.length || "-" == goog.LOCALE.substring(2, 3) || "_" == goog.LOCALE.substring(2, 3));
goog.i18n.bidi.Format = {LRE:"\u202a", RLE:"\u202b", PDF:"\u202c", LRM:"\u200e", RLM:"\u200f"};
goog.i18n.bidi.Dir = {RTL:-1, UNKNOWN:0, LTR:1};
goog.i18n.bidi.RIGHT = "right";
goog.i18n.bidi.LEFT = "left";
goog.i18n.bidi.I18N_RIGHT = goog.i18n.bidi.IS_RTL ? goog.i18n.bidi.LEFT : goog.i18n.bidi.RIGHT;
goog.i18n.bidi.I18N_LEFT = goog.i18n.bidi.IS_RTL ? goog.i18n.bidi.RIGHT : goog.i18n.bidi.LEFT;
goog.i18n.bidi.toDir = function(a) {
  return"number" == typeof a ? 0 < a ? goog.i18n.bidi.Dir.LTR : 0 > a ? goog.i18n.bidi.Dir.RTL : goog.i18n.bidi.Dir.UNKNOWN : a ? goog.i18n.bidi.Dir.RTL : goog.i18n.bidi.Dir.LTR
};
goog.i18n.bidi.ltrChars_ = "A-Za-z\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u02b8\u0300-\u0590\u0800-\u1fff\u2c00-\ufb1c\ufe00-\ufe6f\ufefd-\uffff";
goog.i18n.bidi.rtlChars_ = "\u0591-\u07ff\ufb1d-\ufdff\ufe70-\ufefc";
goog.i18n.bidi.htmlSkipReg_ = /<[^>]*>|&[^;]+;/g;
goog.i18n.bidi.stripHtmlIfNeeded_ = function(a, c) {
  return c ? a.replace(goog.i18n.bidi.htmlSkipReg_, " ") : a
};
goog.i18n.bidi.rtlCharReg_ = RegExp("[" + goog.i18n.bidi.rtlChars_ + "]");
goog.i18n.bidi.ltrCharReg_ = RegExp("[" + goog.i18n.bidi.ltrChars_ + "]");
goog.i18n.bidi.hasAnyRtl = function(a, c) {
  return goog.i18n.bidi.rtlCharReg_.test(goog.i18n.bidi.stripHtmlIfNeeded_(a, c))
};
goog.i18n.bidi.hasRtlChar = goog.i18n.bidi.hasAnyRtl;
goog.i18n.bidi.hasAnyLtr = function(a, c) {
  return goog.i18n.bidi.ltrCharReg_.test(goog.i18n.bidi.stripHtmlIfNeeded_(a, c))
};
goog.i18n.bidi.ltrRe_ = RegExp("^[" + goog.i18n.bidi.ltrChars_ + "]");
goog.i18n.bidi.rtlRe_ = RegExp("^[" + goog.i18n.bidi.rtlChars_ + "]");
goog.i18n.bidi.isRtlChar = function(a) {
  return goog.i18n.bidi.rtlRe_.test(a)
};
goog.i18n.bidi.isLtrChar = function(a) {
  return goog.i18n.bidi.ltrRe_.test(a)
};
goog.i18n.bidi.isNeutralChar = function(a) {
  return!goog.i18n.bidi.isLtrChar(a) && !goog.i18n.bidi.isRtlChar(a)
};
goog.i18n.bidi.ltrDirCheckRe_ = RegExp("^[^" + goog.i18n.bidi.rtlChars_ + "]*[" + goog.i18n.bidi.ltrChars_ + "]");
goog.i18n.bidi.rtlDirCheckRe_ = RegExp("^[^" + goog.i18n.bidi.ltrChars_ + "]*[" + goog.i18n.bidi.rtlChars_ + "]");
goog.i18n.bidi.startsWithRtl = function(a, c) {
  return goog.i18n.bidi.rtlDirCheckRe_.test(goog.i18n.bidi.stripHtmlIfNeeded_(a, c))
};
goog.i18n.bidi.isRtlText = goog.i18n.bidi.startsWithRtl;
goog.i18n.bidi.startsWithLtr = function(a, c) {
  return goog.i18n.bidi.ltrDirCheckRe_.test(goog.i18n.bidi.stripHtmlIfNeeded_(a, c))
};
goog.i18n.bidi.isLtrText = goog.i18n.bidi.startsWithLtr;
goog.i18n.bidi.isRequiredLtrRe_ = /^http:\/\/.*/;
goog.i18n.bidi.isNeutralText = function(a, c) {
  a = goog.i18n.bidi.stripHtmlIfNeeded_(a, c);
  return goog.i18n.bidi.isRequiredLtrRe_.test(a) || !goog.i18n.bidi.hasAnyLtr(a) && !goog.i18n.bidi.hasAnyRtl(a)
};
goog.i18n.bidi.ltrExitDirCheckRe_ = RegExp("[" + goog.i18n.bidi.ltrChars_ + "][^" + goog.i18n.bidi.rtlChars_ + "]*$");
goog.i18n.bidi.rtlExitDirCheckRe_ = RegExp("[" + goog.i18n.bidi.rtlChars_ + "][^" + goog.i18n.bidi.ltrChars_ + "]*$");
goog.i18n.bidi.endsWithLtr = function(a, c) {
  return goog.i18n.bidi.ltrExitDirCheckRe_.test(goog.i18n.bidi.stripHtmlIfNeeded_(a, c))
};
goog.i18n.bidi.isLtrExitText = goog.i18n.bidi.endsWithLtr;
goog.i18n.bidi.endsWithRtl = function(a, c) {
  return goog.i18n.bidi.rtlExitDirCheckRe_.test(goog.i18n.bidi.stripHtmlIfNeeded_(a, c))
};
goog.i18n.bidi.isRtlExitText = goog.i18n.bidi.endsWithRtl;
goog.i18n.bidi.rtlLocalesRe_ = RegExp("^(ar|dv|he|iw|fa|nqo|ps|sd|ug|ur|yi|.*[-_](Arab|Hebr|Thaa|Nkoo|Tfng))(?!.*[-_](Latn|Cyrl)($|-|_))($|-|_)", "i");
goog.i18n.bidi.isRtlLanguage = function(a) {
  return goog.i18n.bidi.rtlLocalesRe_.test(a)
};
goog.i18n.bidi.bracketGuardHtmlRe_ = /(\(.*?\)+)|(\[.*?\]+)|(\{.*?\}+)|(&lt;.*?(&gt;)+)/g;
goog.i18n.bidi.bracketGuardTextRe_ = /(\(.*?\)+)|(\[.*?\]+)|(\{.*?\}+)|(<.*?>+)/g;
goog.i18n.bidi.guardBracketInHtml = function(a, c) {
  return(void 0 === c ? goog.i18n.bidi.hasAnyRtl(a) : c) ? a.replace(goog.i18n.bidi.bracketGuardHtmlRe_, "<span dir=rtl>$&</span>") : a.replace(goog.i18n.bidi.bracketGuardHtmlRe_, "<span dir=ltr>$&</span>")
};
goog.i18n.bidi.guardBracketInText = function(a, c) {
  var d = (void 0 === c ? goog.i18n.bidi.hasAnyRtl(a) : c) ? goog.i18n.bidi.Format.RLM : goog.i18n.bidi.Format.LRM;
  return a.replace(goog.i18n.bidi.bracketGuardTextRe_, d + "$&" + d)
};
goog.i18n.bidi.enforceRtlInHtml = function(a) {
  return"<" == a.charAt(0) ? a.replace(/<\w+/, "$& dir=rtl") : "\n<span dir=rtl>" + a + "</span>"
};
goog.i18n.bidi.enforceRtlInText = function(a) {
  return goog.i18n.bidi.Format.RLE + a + goog.i18n.bidi.Format.PDF
};
goog.i18n.bidi.enforceLtrInHtml = function(a) {
  return"<" == a.charAt(0) ? a.replace(/<\w+/, "$& dir=ltr") : "\n<span dir=ltr>" + a + "</span>"
};
goog.i18n.bidi.enforceLtrInText = function(a) {
  return goog.i18n.bidi.Format.LRE + a + goog.i18n.bidi.Format.PDF
};
goog.i18n.bidi.dimensionsRe_ = /:\s*([.\d][.\w]*)\s+([.\d][.\w]*)\s+([.\d][.\w]*)\s+([.\d][.\w]*)/g;
goog.i18n.bidi.leftRe_ = /left/gi;
goog.i18n.bidi.rightRe_ = /right/gi;
goog.i18n.bidi.tempRe_ = /%%%%/g;
goog.i18n.bidi.mirrorCSS = function(a) {
  return a.replace(goog.i18n.bidi.dimensionsRe_, ":$1 $4 $3 $2").replace(goog.i18n.bidi.leftRe_, "%%%%").replace(goog.i18n.bidi.rightRe_, goog.i18n.bidi.LEFT).replace(goog.i18n.bidi.tempRe_, goog.i18n.bidi.RIGHT)
};
goog.i18n.bidi.doubleQuoteSubstituteRe_ = /([\u0591-\u05f2])"/g;
goog.i18n.bidi.singleQuoteSubstituteRe_ = /([\u0591-\u05f2])'/g;
goog.i18n.bidi.normalizeHebrewQuote = function(a) {
  return a.replace(goog.i18n.bidi.doubleQuoteSubstituteRe_, "$1\u05f4").replace(goog.i18n.bidi.singleQuoteSubstituteRe_, "$1\u05f3")
};
goog.i18n.bidi.wordSeparatorRe_ = /\s+/;
goog.i18n.bidi.hasNumeralsRe_ = /\d/;
goog.i18n.bidi.rtlDetectionThreshold_ = 0.4;
goog.i18n.bidi.estimateDirection = function(a, c) {
  for(var d = 0, e = 0, f = !1, h = goog.i18n.bidi.stripHtmlIfNeeded_(a, c).split(goog.i18n.bidi.wordSeparatorRe_), i = 0;i < h.length;i++) {
    var j = h[i];
    goog.i18n.bidi.startsWithRtl(j) ? (d++, e++) : goog.i18n.bidi.isRequiredLtrRe_.test(j) ? f = !0 : goog.i18n.bidi.hasAnyLtr(j) ? e++ : goog.i18n.bidi.hasNumeralsRe_.test(j) && (f = !0)
  }
  return 0 == e ? f ? goog.i18n.bidi.Dir.LTR : goog.i18n.bidi.Dir.UNKNOWN : d / e > goog.i18n.bidi.rtlDetectionThreshold_ ? goog.i18n.bidi.Dir.RTL : goog.i18n.bidi.Dir.LTR
};
goog.i18n.bidi.detectRtlDirectionality = function(a, c) {
  return goog.i18n.bidi.estimateDirection(a, c) == goog.i18n.bidi.Dir.RTL
};
goog.i18n.bidi.setElementDirAndAlign = function(a, c) {
  if(a && (c = goog.i18n.bidi.toDir(c)) != goog.i18n.bidi.Dir.UNKNOWN) {
    a.style.textAlign = c == goog.i18n.bidi.Dir.RTL ? "right" : "left", a.dir = c == goog.i18n.bidi.Dir.RTL ? "rtl" : "ltr"
  }
};
goog.i18n.BidiFormatter = function(a, c) {
  this.contextDir_ = goog.i18n.bidi.toDir(a);
  this.alwaysSpan_ = !!c
};
goog.i18n.BidiFormatter.prototype.getContextDir = function() {
  return this.contextDir_
};
goog.i18n.BidiFormatter.prototype.getAlwaysSpan = function() {
  return this.alwaysSpan_
};
goog.i18n.BidiFormatter.prototype.setContextDir = function(a) {
  this.contextDir_ = goog.i18n.bidi.toDir(a)
};
goog.i18n.BidiFormatter.prototype.setAlwaysSpan = function(a) {
  this.alwaysSpan_ = a
};
goog.i18n.BidiFormatter.prototype.estimateDirection = goog.i18n.bidi.estimateDirection;
goog.i18n.BidiFormatter.prototype.areDirectionalitiesOpposite_ = function(a, c) {
  return 0 > a * c
};
goog.i18n.BidiFormatter.prototype.dirResetIfNeeded_ = function(a, c, d, e) {
  return e && (this.areDirectionalitiesOpposite_(c, this.contextDir_) || this.contextDir_ == goog.i18n.bidi.Dir.LTR && goog.i18n.bidi.endsWithRtl(a, d) || this.contextDir_ == goog.i18n.bidi.Dir.RTL && goog.i18n.bidi.endsWithLtr(a, d)) ? this.contextDir_ == goog.i18n.bidi.Dir.LTR ? goog.i18n.bidi.Format.LRM : goog.i18n.bidi.Format.RLM : ""
};
goog.i18n.BidiFormatter.prototype.dirAttrValue = function(a, c) {
  return this.knownDirAttrValue(this.estimateDirection(a, c))
};
goog.i18n.BidiFormatter.prototype.knownDirAttrValue = function(a) {
  a == goog.i18n.bidi.Dir.UNKNOWN && (a = this.contextDir_);
  return a == goog.i18n.bidi.Dir.RTL ? "rtl" : "ltr"
};
goog.i18n.BidiFormatter.prototype.dirAttr = function(a, c) {
  return this.knownDirAttr(this.estimateDirection(a, c))
};
goog.i18n.BidiFormatter.prototype.knownDirAttr = function(a) {
  return a != this.contextDir_ ? a == goog.i18n.bidi.Dir.RTL ? 'dir="rtl"' : a == goog.i18n.bidi.Dir.LTR ? 'dir="ltr"' : "" : ""
};
goog.i18n.BidiFormatter.prototype.spanWrap = function(a, c, d) {
  var e = this.estimateDirection(a, c);
  return this.spanWrapWithKnownDir(e, a, c, d)
};
goog.i18n.BidiFormatter.prototype.spanWrapWithKnownDir = function(a, c, d, e) {
  var e = e || void 0 == e, f = a != goog.i18n.bidi.Dir.UNKNOWN && a != this.contextDir_;
  d || (c = goog.string.htmlEscape(c));
  d = [];
  this.alwaysSpan_ || f ? (d.push("<span"), f && d.push(a == goog.i18n.bidi.Dir.RTL ? ' dir="rtl"' : ' dir="ltr"'), d.push(">" + c + "</span>")) : d.push(c);
  d.push(this.dirResetIfNeeded_(c, a, !0, e));
  return d.join("")
};
goog.i18n.BidiFormatter.prototype.unicodeWrap = function(a, c, d) {
  var e = this.estimateDirection(a, c);
  return this.unicodeWrapWithKnownDir(e, a, c, d)
};
goog.i18n.BidiFormatter.prototype.unicodeWrapWithKnownDir = function(a, c, d, e) {
  var e = e || void 0 == e, f = [];
  a != goog.i18n.bidi.Dir.UNKNOWN && a != this.contextDir_ ? (f.push(a == goog.i18n.bidi.Dir.RTL ? goog.i18n.bidi.Format.RLE : goog.i18n.bidi.Format.LRE), f.push(c), f.push(goog.i18n.bidi.Format.PDF)) : f.push(c);
  f.push(this.dirResetIfNeeded_(c, a, d, e));
  return f.join("")
};
goog.i18n.BidiFormatter.prototype.markAfter = function(a, c) {
  return this.dirResetIfNeeded_(a, this.estimateDirection(a, c), c, !0)
};
goog.i18n.BidiFormatter.prototype.mark = function() {
  switch(this.contextDir_) {
    case goog.i18n.bidi.Dir.LTR:
      return goog.i18n.bidi.Format.LRM;
    case goog.i18n.bidi.Dir.RTL:
      return goog.i18n.bidi.Format.RLM;
    default:
      return""
  }
};
goog.i18n.BidiFormatter.prototype.startEdge = function() {
  return this.contextDir_ == goog.i18n.bidi.Dir.RTL ? goog.i18n.bidi.RIGHT : goog.i18n.bidi.LEFT
};
goog.i18n.BidiFormatter.prototype.endEdge = function() {
  return this.contextDir_ == goog.i18n.bidi.Dir.RTL ? goog.i18n.bidi.LEFT : goog.i18n.bidi.RIGHT
};
var soy = {esc:{}}, soydata = {};
soy.StringBuilder = goog.string.StringBuffer;
soydata.SanitizedContentKind = {HTML:0, JS_STR_CHARS:1, URI:2, HTML_ATTRIBUTE:3};
soydata.SanitizedContent = function(a) {
  this.content = a
};
soydata.SanitizedContent.prototype.toString = function() {
  return this.content
};
soydata.SanitizedHtml = function(a) {
  soydata.SanitizedContent.call(this, a)
};
goog.inherits(soydata.SanitizedHtml, soydata.SanitizedContent);
soydata.SanitizedHtml.prototype.contentKind = soydata.SanitizedContentKind.HTML;
soydata.SanitizedJsStrChars = function(a) {
  soydata.SanitizedContent.call(this, a)
};
goog.inherits(soydata.SanitizedJsStrChars, soydata.SanitizedContent);
soydata.SanitizedJsStrChars.prototype.contentKind = soydata.SanitizedContentKind.JS_STR_CHARS;
soydata.SanitizedUri = function(a) {
  soydata.SanitizedContent.call(this, a)
};
goog.inherits(soydata.SanitizedUri, soydata.SanitizedContent);
soydata.SanitizedUri.prototype.contentKind = soydata.SanitizedContentKind.URI;
soydata.SanitizedHtmlAttribute = function(a) {
  soydata.SanitizedContent.call(this, a)
};
goog.inherits(soydata.SanitizedHtmlAttribute, soydata.SanitizedContent);
soydata.SanitizedHtmlAttribute.prototype.contentKind = soydata.SanitizedContentKind.HTML_ATTRIBUTE;
soy.renderElement = goog.soy.renderElement;
soy.renderAsFragment = function(a, c, d, e) {
  return goog.soy.renderAsFragment(a, c, e, new goog.dom.DomHelper(d))
};
soy.renderAsElement = function(a, c, d, e) {
  return goog.soy.renderAsElement(a, c, e, new goog.dom.DomHelper(d))
};
soy.$$augmentData = function(a, c) {
  function d() {
  }
  d.prototype = a;
  var e = new d, f;
  for(f in c) {
    e[f] = c[f]
  }
  return e
};
soy.$$getMapKeys = function(a) {
  var c = [], d;
  for(d in a) {
    c.push(d)
  }
  return c
};
soy.$$getDelegateId = function(a) {
  return a
};
soy.$$DELEGATE_REGISTRY_PRIORITIES_ = {};
soy.$$DELEGATE_REGISTRY_FUNCTIONS_ = {};
soy.$$registerDelegateFn = function(a, c, d) {
  var e = "key_" + a, f = soy.$$DELEGATE_REGISTRY_PRIORITIES_[e];
  if(void 0 === f || c > f) {
    soy.$$DELEGATE_REGISTRY_PRIORITIES_[e] = c, soy.$$DELEGATE_REGISTRY_FUNCTIONS_[e] = d
  }else {
    if(c == f) {
      throw Error('Encountered two active delegates with same priority (id/name "' + a + '").');
    }
  }
};
soy.$$getDelegateFn = function(a) {
  return(a = soy.$$DELEGATE_REGISTRY_FUNCTIONS_["key_" + a]) ? a : soy.$$EMPTY_TEMPLATE_FN_
};
soy.$$EMPTY_TEMPLATE_FN_ = function() {
  return""
};
soy.$$escapeHtml = function(a) {
  return"object" === typeof a && a && a.contentKind === soydata.SanitizedContentKind.HTML ? a.content : soy.esc.$$escapeHtmlHelper(a)
};
soy.$$escapeHtmlRcdata = function(a) {
  return"object" === typeof a && a && a.contentKind === soydata.SanitizedContentKind.HTML ? soy.esc.$$normalizeHtmlHelper(a.content) : soy.esc.$$escapeHtmlHelper(a)
};
soy.$$stripHtmlTags = function(a) {
  return String(a).replace(soy.esc.$$HTML_TAG_REGEX_, "")
};
soy.$$escapeHtmlAttribute = function(a) {
  return"object" === typeof a && a && a.contentKind === soydata.SanitizedContentKind.HTML ? soy.esc.$$normalizeHtmlHelper(soy.$$stripHtmlTags(a.content)) : soy.esc.$$escapeHtmlHelper(a)
};
soy.$$escapeHtmlAttributeNospace = function(a) {
  return"object" === typeof a && a && a.contentKind === soydata.SanitizedContentKind.HTML ? soy.esc.$$normalizeHtmlNospaceHelper(soy.$$stripHtmlTags(a.content)) : soy.esc.$$escapeHtmlNospaceHelper(a)
};
soy.$$filterHtmlAttribute = function(a) {
  return"object" === typeof a && a && a.contentKind === soydata.SanitizedContentKind.HTML_ATTRIBUTE ? a.content.replace(/=([^"']*)$/, '="$1"') : soy.esc.$$filterHtmlAttributeHelper(a)
};
soy.$$filterHtmlElementName = function(a) {
  return soy.esc.$$filterHtmlElementNameHelper(a)
};
soy.$$escapeJs = function(a) {
  return soy.$$escapeJsString(a)
};
soy.$$escapeJsString = function(a) {
  return"object" === typeof a && a.contentKind === soydata.SanitizedContentKind.JS_STR_CHARS ? a.content : soy.esc.$$escapeJsStringHelper(a)
};
soy.$$escapeJsValue = function(a) {
  if(null == a) {
    return" null "
  }
  switch(typeof a) {
    case "boolean":
    ;
    case "number":
      return" " + a + " ";
    default:
      return"'" + soy.esc.$$escapeJsStringHelper(String(a)) + "'"
  }
};
soy.$$escapeJsRegex = function(a) {
  return soy.esc.$$escapeJsRegexHelper(a)
};
soy.$$problematicUriMarks_ = /['()]/g;
soy.$$pctEncode_ = function(a) {
  return"%" + a.charCodeAt(0).toString(16)
};
soy.$$escapeUri = function(a) {
  if("object" === typeof a && a.contentKind === soydata.SanitizedContentKind.URI) {
    return soy.$$normalizeUri(a)
  }
  a = soy.esc.$$escapeUriHelper(a);
  soy.$$problematicUriMarks_.lastIndex = 0;
  return soy.$$problematicUriMarks_.test(a) ? a.replace(soy.$$problematicUriMarks_, soy.$$pctEncode_) : a
};
soy.$$normalizeUri = function(a) {
  return soy.esc.$$normalizeUriHelper(a)
};
soy.$$filterNormalizeUri = function(a) {
  return soy.esc.$$filterNormalizeUriHelper(a)
};
soy.$$escapeCssString = function(a) {
  return soy.esc.$$escapeCssStringHelper(a)
};
soy.$$filterCssValue = function(a) {
  return null == a ? "" : soy.esc.$$filterCssValueHelper(a)
};
soy.$$changeNewlineToBr = function(a) {
  return goog.string.newLineToBr(String(a), !1)
};
soy.$$insertWordBreaks = function(a, c) {
  return goog.format.insertWordBreaks(String(a), c)
};
soy.$$truncate = function(a, c, d) {
  a = String(a);
  if(a.length <= c) {
    return a
  }
  d && (3 < c ? c -= 3 : d = !1);
  soy.$$isHighSurrogate_(a.charAt(c - 1)) && soy.$$isLowSurrogate_(a.charAt(c)) && (c -= 1);
  a = a.substring(0, c);
  d && (a += "...");
  return a
};
soy.$$isHighSurrogate_ = function(a) {
  return 55296 <= a && 56319 >= a
};
soy.$$isLowSurrogate_ = function(a) {
  return 56320 <= a && 57343 >= a
};
soy.$$bidiFormatterCache_ = {};
soy.$$getBidiFormatterInstance_ = function(a) {
  return soy.$$bidiFormatterCache_[a] || (soy.$$bidiFormatterCache_[a] = new goog.i18n.BidiFormatter(a))
};
soy.$$bidiTextDir = function(a, c) {
  return!a ? 0 : goog.i18n.bidi.detectRtlDirectionality(a, c) ? -1 : 1
};
soy.$$bidiDirAttr = function(a, c, d) {
  return new soydata.SanitizedHtmlAttribute(soy.$$getBidiFormatterInstance_(a).dirAttr(c, d))
};
soy.$$bidiMarkAfter = function(a, c, d) {
  return soy.$$getBidiFormatterInstance_(a).markAfter(c, d)
};
soy.$$bidiSpanWrap = function(a, c) {
  return soy.$$getBidiFormatterInstance_(a).spanWrap(c + "", !0)
};
soy.$$bidiUnicodeWrap = function(a, c) {
  return soy.$$getBidiFormatterInstance_(a).unicodeWrap(c + "", !0)
};
soy.esc.$$escapeUriHelper = function(a) {
  return goog.string.urlEncode(String(a))
};
soy.esc.$$ESCAPE_MAP_FOR_ESCAPE_HTML__AND__NORMALIZE_HTML__AND__ESCAPE_HTML_NOSPACE__AND__NORMALIZE_HTML_NOSPACE_ = {"\x00":"&#0;", '"':"&quot;", "&":"&amp;", "'":"&#39;", "<":"&lt;", ">":"&gt;", "\t":"&#9;", "\n":"&#10;", "\x0B":"&#11;", "\f":"&#12;", "\r":"&#13;", " ":"&#32;", "-":"&#45;", "/":"&#47;", "=":"&#61;", "`":"&#96;", "\u0085":"&#133;", "\u00a0":"&#160;", "\u2028":"&#8232;", "\u2029":"&#8233;"};
soy.esc.$$REPLACER_FOR_ESCAPE_HTML__AND__NORMALIZE_HTML__AND__ESCAPE_HTML_NOSPACE__AND__NORMALIZE_HTML_NOSPACE_ = function(a) {
  return soy.esc.$$ESCAPE_MAP_FOR_ESCAPE_HTML__AND__NORMALIZE_HTML__AND__ESCAPE_HTML_NOSPACE__AND__NORMALIZE_HTML_NOSPACE_[a]
};
soy.esc.$$ESCAPE_MAP_FOR_ESCAPE_JS_STRING__AND__ESCAPE_JS_REGEX_ = {"\x00":"\\x00", "\b":"\\x08", "\t":"\\t", "\n":"\\n", "\x0B":"\\x0b", "\f":"\\f", "\r":"\\r", '"':"\\x22", "&":"\\x26", "'":"\\x27", "/":"\\/", "<":"\\x3c", "=":"\\x3d", ">":"\\x3e", "\\":"\\\\", "\u0085":"\\x85", "\u2028":"\\u2028", "\u2029":"\\u2029", $:"\\x24", "(":"\\x28", ")":"\\x29", "*":"\\x2a", "+":"\\x2b", ",":"\\x2c", "-":"\\x2d", ".":"\\x2e", ":":"\\x3a", "?":"\\x3f", "[":"\\x5b", "]":"\\x5d", "^":"\\x5e", "{":"\\x7b", 
"|":"\\x7c", "}":"\\x7d"};
soy.esc.$$REPLACER_FOR_ESCAPE_JS_STRING__AND__ESCAPE_JS_REGEX_ = function(a) {
  return soy.esc.$$ESCAPE_MAP_FOR_ESCAPE_JS_STRING__AND__ESCAPE_JS_REGEX_[a]
};
soy.esc.$$ESCAPE_MAP_FOR_ESCAPE_CSS_STRING_ = {"\x00":"\\0 ", "\b":"\\8 ", "\t":"\\9 ", "\n":"\\a ", "\x0B":"\\b ", "\f":"\\c ", "\r":"\\d ", '"':"\\22 ", "&":"\\26 ", "'":"\\27 ", "(":"\\28 ", ")":"\\29 ", "*":"\\2a ", "/":"\\2f ", ":":"\\3a ", ";":"\\3b ", "<":"\\3c ", "=":"\\3d ", ">":"\\3e ", "@":"\\40 ", "\\":"\\5c ", "{":"\\7b ", "}":"\\7d ", "\u0085":"\\85 ", "\u00a0":"\\a0 ", "\u2028":"\\2028 ", "\u2029":"\\2029 "};
soy.esc.$$REPLACER_FOR_ESCAPE_CSS_STRING_ = function(a) {
  return soy.esc.$$ESCAPE_MAP_FOR_ESCAPE_CSS_STRING_[a]
};
soy.esc.$$ESCAPE_MAP_FOR_NORMALIZE_URI__AND__FILTER_NORMALIZE_URI_ = {"\x00":"%00", "\u0001":"%01", "\u0002":"%02", "\u0003":"%03", "\u0004":"%04", "\u0005":"%05", "\u0006":"%06", "\u0007":"%07", "\b":"%08", "\t":"%09", "\n":"%0A", "\x0B":"%0B", "\f":"%0C", "\r":"%0D", "\u000e":"%0E", "\u000f":"%0F", "\u0010":"%10", "\u0011":"%11", "\u0012":"%12", "\u0013":"%13", "\u0014":"%14", "\u0015":"%15", "\u0016":"%16", "\u0017":"%17", "\u0018":"%18", "\u0019":"%19", "\u001a":"%1A", "\u001b":"%1B", "\u001c":"%1C", 
"\u001d":"%1D", "\u001e":"%1E", "\u001f":"%1F", " ":"%20", '"':"%22", "'":"%27", "(":"%28", ")":"%29", "<":"%3C", ">":"%3E", "\\":"%5C", "{":"%7B", "}":"%7D", "\u007f":"%7F", "\u0085":"%C2%85", "\u00a0":"%C2%A0", "\u2028":"%E2%80%A8", "\u2029":"%E2%80%A9", "\uff01":"%EF%BC%81", "\uff03":"%EF%BC%83", "\uff04":"%EF%BC%84", "\uff06":"%EF%BC%86", "\uff07":"%EF%BC%87", "\uff08":"%EF%BC%88", "\uff09":"%EF%BC%89", "\uff0a":"%EF%BC%8A", "\uff0b":"%EF%BC%8B", "\uff0c":"%EF%BC%8C", "\uff0f":"%EF%BC%8F", "\uff1a":"%EF%BC%9A", 
"\uff1b":"%EF%BC%9B", "\uff1d":"%EF%BC%9D", "\uff1f":"%EF%BC%9F", "\uff20":"%EF%BC%A0", "\uff3b":"%EF%BC%BB", "\uff3d":"%EF%BC%BD"};
soy.esc.$$REPLACER_FOR_NORMALIZE_URI__AND__FILTER_NORMALIZE_URI_ = function(a) {
  return soy.esc.$$ESCAPE_MAP_FOR_NORMALIZE_URI__AND__FILTER_NORMALIZE_URI_[a]
};
soy.esc.$$MATCHER_FOR_ESCAPE_HTML_ = /[\x00\x22\x26\x27\x3c\x3e]/g;
soy.esc.$$MATCHER_FOR_NORMALIZE_HTML_ = /[\x00\x22\x27\x3c\x3e]/g;
soy.esc.$$MATCHER_FOR_ESCAPE_HTML_NOSPACE_ = /[\x00\x09-\x0d \x22\x26\x27\x2d\/\x3c-\x3e`\x85\xa0\u2028\u2029]/g;
soy.esc.$$MATCHER_FOR_NORMALIZE_HTML_NOSPACE_ = /[\x00\x09-\x0d \x22\x27\x2d\/\x3c-\x3e`\x85\xa0\u2028\u2029]/g;
soy.esc.$$MATCHER_FOR_ESCAPE_JS_STRING_ = /[\x00\x08-\x0d\x22\x26\x27\/\x3c-\x3e\\\x85\u2028\u2029]/g;
soy.esc.$$MATCHER_FOR_ESCAPE_JS_REGEX_ = /[\x00\x08-\x0d\x22\x24\x26-\/\x3a\x3c-\x3f\x5b-\x5e\x7b-\x7d\x85\u2028\u2029]/g;
soy.esc.$$MATCHER_FOR_ESCAPE_CSS_STRING_ = /[\x00\x08-\x0d\x22\x26-\x2a\/\x3a-\x3e@\\\x7b\x7d\x85\xa0\u2028\u2029]/g;
soy.esc.$$MATCHER_FOR_NORMALIZE_URI__AND__FILTER_NORMALIZE_URI_ = /[\x00- \x22\x27-\x29\x3c\x3e\\\x7b\x7d\x7f\x85\xa0\u2028\u2029\uff01\uff03\uff04\uff06-\uff0c\uff0f\uff1a\uff1b\uff1d\uff1f\uff20\uff3b\uff3d]/g;
soy.esc.$$FILTER_FOR_FILTER_CSS_VALUE_ = /^(?!-*(?:expression|(?:moz-)?binding))(?:[.#]?-?(?:[_a-z0-9-]+)(?:-[_a-z0-9-]+)*-?|-?(?:[0-9]+(?:\.[0-9]*)?|\.[0-9]+)(?:[a-z]{1,2}|%)?|!important|)$/i;
soy.esc.$$FILTER_FOR_FILTER_NORMALIZE_URI_ = /^(?:(?:https?|mailto):|[^&:\/?#]*(?:[\/?#]|$))/i;
soy.esc.$$FILTER_FOR_FILTER_HTML_ATTRIBUTE_ = /^(?!style|on|action|archive|background|cite|classid|codebase|data|dsync|href|longdesc|src|usemap)(?:[a-z0-9_$:-]*)$/i;
soy.esc.$$FILTER_FOR_FILTER_HTML_ELEMENT_NAME_ = /^(?!script|style|title|textarea|xmp|no)[a-z0-9_$:-]*$/i;
soy.esc.$$escapeHtmlHelper = function(a) {
  return String(a).replace(soy.esc.$$MATCHER_FOR_ESCAPE_HTML_, soy.esc.$$REPLACER_FOR_ESCAPE_HTML__AND__NORMALIZE_HTML__AND__ESCAPE_HTML_NOSPACE__AND__NORMALIZE_HTML_NOSPACE_)
};
soy.esc.$$normalizeHtmlHelper = function(a) {
  return String(a).replace(soy.esc.$$MATCHER_FOR_NORMALIZE_HTML_, soy.esc.$$REPLACER_FOR_ESCAPE_HTML__AND__NORMALIZE_HTML__AND__ESCAPE_HTML_NOSPACE__AND__NORMALIZE_HTML_NOSPACE_)
};
soy.esc.$$escapeHtmlNospaceHelper = function(a) {
  return String(a).replace(soy.esc.$$MATCHER_FOR_ESCAPE_HTML_NOSPACE_, soy.esc.$$REPLACER_FOR_ESCAPE_HTML__AND__NORMALIZE_HTML__AND__ESCAPE_HTML_NOSPACE__AND__NORMALIZE_HTML_NOSPACE_)
};
soy.esc.$$normalizeHtmlNospaceHelper = function(a) {
  return String(a).replace(soy.esc.$$MATCHER_FOR_NORMALIZE_HTML_NOSPACE_, soy.esc.$$REPLACER_FOR_ESCAPE_HTML__AND__NORMALIZE_HTML__AND__ESCAPE_HTML_NOSPACE__AND__NORMALIZE_HTML_NOSPACE_)
};
soy.esc.$$escapeJsStringHelper = function(a) {
  return String(a).replace(soy.esc.$$MATCHER_FOR_ESCAPE_JS_STRING_, soy.esc.$$REPLACER_FOR_ESCAPE_JS_STRING__AND__ESCAPE_JS_REGEX_)
};
soy.esc.$$escapeJsRegexHelper = function(a) {
  return String(a).replace(soy.esc.$$MATCHER_FOR_ESCAPE_JS_REGEX_, soy.esc.$$REPLACER_FOR_ESCAPE_JS_STRING__AND__ESCAPE_JS_REGEX_)
};
soy.esc.$$escapeCssStringHelper = function(a) {
  return String(a).replace(soy.esc.$$MATCHER_FOR_ESCAPE_CSS_STRING_, soy.esc.$$REPLACER_FOR_ESCAPE_CSS_STRING_)
};
soy.esc.$$filterCssValueHelper = function(a) {
  a = String(a);
  return!soy.esc.$$FILTER_FOR_FILTER_CSS_VALUE_.test(a) ? (goog.asserts.fail("Bad value `%s` for |filterCssValue", [a]), "zSoyz") : a
};
soy.esc.$$normalizeUriHelper = function(a) {
  return String(a).replace(soy.esc.$$MATCHER_FOR_NORMALIZE_URI__AND__FILTER_NORMALIZE_URI_, soy.esc.$$REPLACER_FOR_NORMALIZE_URI__AND__FILTER_NORMALIZE_URI_)
};
soy.esc.$$filterNormalizeUriHelper = function(a) {
  a = String(a);
  return!soy.esc.$$FILTER_FOR_FILTER_NORMALIZE_URI_.test(a) ? (goog.asserts.fail("Bad value `%s` for |filterNormalizeUri", [a]), "zSoyz") : a.replace(soy.esc.$$MATCHER_FOR_NORMALIZE_URI__AND__FILTER_NORMALIZE_URI_, soy.esc.$$REPLACER_FOR_NORMALIZE_URI__AND__FILTER_NORMALIZE_URI_)
};
soy.esc.$$filterHtmlAttributeHelper = function(a) {
  a = String(a);
  return!soy.esc.$$FILTER_FOR_FILTER_HTML_ATTRIBUTE_.test(a) ? (goog.asserts.fail("Bad value `%s` for |filterHtmlAttribute", [a]), "zSoyz") : a
};
soy.esc.$$filterHtmlElementNameHelper = function(a) {
  a = String(a);
  return!soy.esc.$$FILTER_FOR_FILTER_HTML_ELEMENT_NAME_.test(a) ? (goog.asserts.fail("Bad value `%s` for |filterHtmlElementName", [a]), "zSoyz") : a
};
soy.esc.$$HTML_TAG_REGEX_ = /<(?:!|\/?[a-zA-Z])(?:[^>'"]|"[^"]*"|'[^']*')*>/g;
annotorious.templates = {};
annotorious.templates.popup = function() {
  return'<div class="annotorious-popup top-left" style="position:absolute;z-index:1"><div class="annotorious-popup-buttons"><a class="annotorious-popup-button annotorious-popup-button-edit" title="Edit" href="javascript:void(0);">EDIT</a><a class="annotorious-popup-button annotorious-popup-button-delete" title="Delete" href="javascript:void(0);">DELETE</a></div><span class="annotorious-popup-text"></span></div>'
};
annotorious.templates.editform = function() {
  return'<div class="annotorious-editor" style="position:absolute;z-index:1"><form><textarea class="annotorious-editor-text" placeholder="Add a Comment..." tabindex="1"></textarea><div class="annotorious-editor-button-container"><a class="annotorious-editor-button annotorious-editor-button-cancel" href="javascript:void(0);" tabindex="3">Cancel</a><a class="annotorious-editor-button annotorious-editor-button-save" href="javascript:void(0);" tabindex="2">Save</a></div></form></div>'
};
annotorious.Editor = function(a) {
  this.element = goog.soy.renderAsElement(annotorious.templates.editform);
  this._annotator = a;
  this._item = a.getItem();
  this._textarea = new goog.ui.Textarea("");
  this._btnCancel = goog.dom.query(".annotorious-editor-button-cancel", this.element)[0];
  this._btnSave = goog.dom.query(".annotorious-editor-button-save", this.element)[0];
  this._btnContainer = goog.dom.getParentElement(this._btnSave);
  this._extraFields = [];
  var c = this;
  goog.events.listen(this._btnCancel, goog.events.EventType.CLICK, function(d) {
    d.preventDefault();
    a.stopSelection(c._original_annotation);
    c.close()
  });
  goog.events.listen(this._btnSave, goog.events.EventType.CLICK, function(d) {
    d.preventDefault();
    d = c.getAnnotation();
    a.addAnnotation(d);
    a.stopSelection();
    c._original_annotation ? a.fireEvent(annotorious.events.EventType.ANNOTATION_UPDATED, d, a.getItem()) : a.fireEvent(annotorious.events.EventType.ANNOTATION_CREATED, d, a.getItem());
    c.close()
  });
  goog.style.showElement(this.element, !1);
  goog.dom.appendChild(a.element, this.element);
  this._textarea.decorate(goog.dom.query(".annotorious-editor-text", this.element)[0]);
  annotorious.dom.makeHResizable(this.element, function() {
    c._textarea.resize()
  })
};
annotorious.Editor.prototype.addField = function(a) {
  var c = goog.dom.createDom("div", "annotorious-editor-field");
  goog.isString(a) ? c.innerHTML = a : goog.isFunction(a) ? this._extraFields.push({el:c, fn:a}) : goog.dom.isElement(a) && goog.dom.appendChild(c, a);
  goog.dom.insertSiblingBefore(c, this._btnContainer)
};
annotorious.Editor.prototype.open = function(a) {
  (this._current_annotation = this._original_annotation = a) && this._textarea.setValue(a.text);
  goog.style.showElement(this.element, !0);
  this._textarea.getElement().focus();
  goog.array.forEach(this._extraFields, function(c) {
    var d = c.fn(a);
    goog.isString(d) ? c.el.innerHTML = d : goog.dom.isElement(d) && (goog.dom.removeChildren(c.el), goog.dom.appendChild(c.el, d))
  });
  this._annotator.fireEvent(annotorious.events.EventType.EDITOR_SHOWN, a)
};
annotorious.Editor.prototype.close = function() {
  goog.style.showElement(this.element, !1);
  this._textarea.setValue("")
};
annotorious.Editor.prototype.setPosition = function(a) {
  goog.style.setPosition(this.element, a.x, a.y)
};
annotorious.Editor.prototype.getAnnotation = function() {
  var a = goog.string.html.htmlSanitize(this._textarea.getValue(), function(a) {
    return a
  });
  this._current_annotation ? this._current_annotation.text = a : this._current_annotation = new annotorious.Annotation(this._item.src, a, this._annotator.getActiveSelector().getShape());
  return this._current_annotation
};
annotorious.Editor.prototype.addField = annotorious.Editor.prototype.addField;
annotorious.Editor.prototype.getAnnotation = annotorious.Editor.prototype.getAnnotation;
annotorious.Hint = function(a, c, d) {
  var e = this;
  d || (d = "Click and Drag to Annotate");
  this.element = goog.soy.renderAsElement(annotorious.templates.image.hint, {msg:d});
  this._annotator = a;
  this._message = goog.dom.query(".annotorious-hint-msg", this.element)[0];
  this._icon = goog.dom.query(".annotorious-hint-icon", this.element)[0];
  this._overItemHandler = function() {
    e.show()
  };
  this._outOfItemHandler = function() {
    e.hide()
  };
  this._attachListeners();
  this.hide();
  goog.dom.appendChild(c, this.element)
};
annotorious.Hint.prototype._attachListeners = function() {
  var a = this;
  this._mouseOverListener = goog.events.listen(this._icon, goog.events.EventType.MOUSEOVER, function() {
    a.show();
    window.clearTimeout(a._hideTimer)
  });
  this._mouseOutListener = goog.events.listen(this._icon, goog.events.EventType.MOUSEOUT, function() {
    a.hide()
  });
  this._annotator.addHandler(annotorious.events.EventType.MOUSE_OVER_ANNOTATABLE_ITEM, this._overItemHandler);
  this._annotator.addHandler(annotorious.events.EventType.MOUSE_OUT_OF_ANNOTATABLE_ITEM, this._outOfItemHandler)
};
annotorious.Hint.prototype._detachListeners = function() {
  goog.events.unlistenByKey(this._mouseOverListener);
  goog.events.unlistenByKey(this._mouseOutListener);
  this._annotator.removeHandler(annotorious.events.EventType.MOUSE_OVER_ANNOTATABLE_ITEM, this._overItemHandler);
  this._annotator.removeHandler(annotorious.events.EventType.MOUSE_OUT_OF_ANNOTATABLE_ITEM, this._outOfItemHandler)
};
annotorious.Hint.prototype.show = function() {
  window.clearTimeout(this._hideTimer);
  goog.style.setOpacity(this._message, 0.8);
  var a = this;
  this._hideTimer = window.setTimeout(function() {
    a.hide()
  }, 3E3)
};
annotorious.Hint.prototype.hide = function() {
  window.clearTimeout(this._hideTimer);
  goog.style.setOpacity(this._message, 0)
};
annotorious.Hint.prototype.destroy = function() {
  this._detachListeners();
  delete this._mouseOverListener;
  delete this._mouseOutListener;
  delete this._overItemHandler;
  delete this._outOfItemHandler;
  goog.dom.removeNode(this.element)
};
annotorious.Popup = function(a) {
  this.element = goog.soy.renderAsElement(annotorious.templates.popup);
  this._annotator = a;
  this._text = goog.dom.query(".annotorious-popup-text", this.element)[0];
  this._buttons = goog.dom.query(".annotorious-popup-buttons", this.element)[0];
  this._cancelHide = !1;
  this._extraFields = [];
  var c = goog.dom.query(".annotorious-popup-button-edit", this._buttons)[0], d = goog.dom.query(".annotorious-popup-button-delete", this._buttons)[0], e = this;
  goog.events.listen(c, goog.events.EventType.MOUSEOVER, function() {
    goog.dom.classes.add(c, "annotorious-popup-button-active")
  });
  goog.events.listen(c, goog.events.EventType.MOUSEOUT, function() {
    goog.dom.classes.remove(c, "annotorious-popup-button-active")
  });
  goog.events.listen(c, goog.events.EventType.CLICK, function() {
    goog.style.setOpacity(e.element, 0);
    goog.style.setStyle(e.element, "pointer-events", "none");
    a.editAnnotation(e._currentAnnotation)
  });
  goog.events.listen(d, goog.events.EventType.MOUSEOVER, function() {
    goog.dom.classes.add(d, "annotorious-popup-button-active")
  });
  goog.events.listen(d, goog.events.EventType.MOUSEOUT, function() {
    goog.dom.classes.remove(d, "annotorious-popup-button-active")
  });
  goog.events.listen(d, goog.events.EventType.CLICK, function() {
    a.fireEvent(annotorious.events.EventType.BEFORE_ANNOTATION_REMOVED, e._currentAnnotation) || (goog.style.setOpacity(e.element, 0), goog.style.setStyle(e.element, "pointer-events", "none"), a.removeAnnotation(e._currentAnnotation), a.fireEvent(annotorious.events.EventType.ANNOTATION_REMOVED, e._currentAnnotation))
  });
  annotorious.events.ui.hasMouse && (goog.events.listen(this.element, goog.events.EventType.MOUSEOVER, function() {
    window.clearTimeout(e._buttonHideTimer);
    0.9 > goog.style.getStyle(e._buttons, "opacity") && goog.style.setOpacity(e._buttons, 0.9);
    e.clearHideTimer()
  }), goog.events.listen(this.element, goog.events.EventType.MOUSEOUT, function() {
    goog.style.setOpacity(e._buttons, 0);
    e.startHideTimer()
  }), a.addHandler(annotorious.events.EventType.MOUSE_OUT_OF_ANNOTATABLE_ITEM, function() {
    e.startHideTimer()
  }));
  goog.style.setOpacity(this._buttons, 0);
  goog.style.setOpacity(this.element, 0);
  goog.style.setStyle(this.element, "pointer-events", "none");
  goog.dom.appendChild(a.element, this.element)
};
annotorious.Popup.prototype.addField = function(a) {
  var c = goog.dom.createDom("div", "annotorious-popup-field");
  goog.isString(a) ? c.innerHTML = a : goog.isFunction(a) ? this._extraFields.push({el:c, fn:a}) : goog.dom.isElement(a) && goog.dom.appendChild(c, a);
  goog.dom.appendChild(this.element, c)
};
annotorious.Popup.prototype.startHideTimer = function() {
  this._cancelHide = !1;
  if(!this._popupHideTimer) {
    var a = this;
    this._popupHideTimer = window.setTimeout(function() {
      a._annotator.fireEvent(annotorious.events.EventType.BEFORE_POPUP_HIDE, a);
      a._cancelHide || (goog.style.setOpacity(a.element, 0), goog.style.setStyle(a.element, "pointer-events", "none"), goog.style.setOpacity(a._buttons, 0.9), delete a._popupHideTimer)
    }, 150)
  }
};
annotorious.Popup.prototype.clearHideTimer = function() {
  this._cancelHide = !0;
  this._popupHideTimer && (window.clearTimeout(this._popupHideTimer), delete this._popupHideTimer)
};
annotorious.Popup.prototype.show = function(a, c) {
  this.clearHideTimer();
  c && this.setPosition(c);
  a && this.setAnnotation(a);
  this._buttonHideTimer && window.clearTimeout(this._buttonHideTimer);
  goog.style.setOpacity(this._buttons, 0.9);
  if(annotorious.events.ui.hasMouse) {
    var d = this;
    this._buttonHideTimer = window.setTimeout(function() {
      goog.style.setOpacity(d._buttons, 0)
    }, 1E3)
  }
  goog.style.setOpacity(this.element, 0.9);
  goog.style.setStyle(this.element, "pointer-events", "auto");
  this._annotator.fireEvent(annotorious.events.EventType.POPUP_SHOWN, this._currentAnnotation)
};
annotorious.Popup.prototype.setPosition = function(a) {
  goog.style.setPosition(this.element, new goog.math.Coordinate(a.x, a.y))
};
annotorious.Popup.prototype.setAnnotation = function(a) {
  this._currentAnnotation = a;
  this._text.innerHTML = a.text ? a.text.replace(/\n/g, "<br/>") : '<span class="annotorious-popup-empty">No comment</span>';
  "editable" in a && !1 == a.editable ? goog.style.showElement(this._buttons, !1) : goog.style.showElement(this._buttons, !0);
  goog.array.forEach(this._extraFields, function(c) {
    var d = c.fn(a);
    goog.isString(d) ? c.el.innerHTML = d : goog.dom.isElement(d) && (goog.dom.removeChildren(c.el), goog.dom.appendChild(c.el, d))
  })
};
annotorious.Popup.prototype.addField = annotorious.Popup.prototype.addField;
annotorious.mediatypes.Annotator = function() {
};
annotorious.mediatypes.Annotator.prototype.addAnnotation = function(a, c) {
  this._viewer.addAnnotation(a, c)
};
annotorious.mediatypes.Annotator.prototype.addHandler = function(a, c) {
  this._eventBroker.addHandler(a, c)
};
annotorious.mediatypes.Annotator.prototype.fireEvent = function(a, c, d) {
  return this._eventBroker.fireEvent(a, c, d)
};
annotorious.mediatypes.Annotator.prototype.getActiveSelector = function() {
  return this._currentSelector
};
annotorious.mediatypes.Annotator.prototype.highlightAnnotation = function(a) {
  this._viewer.highlightAnnotation(a)
};
annotorious.mediatypes.Annotator.prototype.removeAnnotation = function(a) {
  this._viewer.removeAnnotation(a)
};
annotorious.mediatypes.Annotator.prototype.removeHandler = function(a, c) {
  this._eventBroker.removeHandler(a, c)
};
annotorious.mediatypes.Annotator.prototype.stopSelection = function(a) {
  annotorious.events.ui.hasMouse && goog.style.showElement(this._editCanvas, !1);
  this._stop_selection_callback && (this._stop_selection_callback(), delete this._stop_selection_callback);
  this._currentSelector.stopSelection();
  a && this._viewer.addAnnotation(a)
};
annotorious.mediatypes.Annotator.prototype._attachListener = function(a) {
  var c = this;
  goog.events.listen(a, annotorious.events.ui.EventType.DOWN, function(d) {
    d = annotorious.events.ui.sanitizeCoordinates(d, a);
    c._viewer.highlightAnnotation(!1);
    var e = c._viewer.getAnnotationsAt(d.x, d.y);
    c._selectionEnabled && 0 === e.length ? (goog.style.showElement(c._editCanvas, !0), c._currentSelector.startSelection(d.x, d.y)) : (e = c._viewer.getAnnotationsAt(d.x, d.y), 0 < e.length && c._viewer.highlightAnnotation(e[0]))
  })
};
annotorious.mediatypes.image = {};
annotorious.mediatypes.image.Viewer = function(a, c) {
  this._canvas = a;
  this._annotator = c;
  this._annotations = [];
  this._shapes = [];
  this._g2d = this._canvas.getContext("2d");
  this._eventsEnabled = !0;
  this._keepHighlighted = !1;
  var d = this;
  goog.events.listen(this._canvas, annotorious.events.ui.EventType.MOVE, function(a) {
    d._eventsEnabled ? d._onMouseMove(a) : d._cachedMouseEvent = a
  });
  goog.events.listen(this._canvas, annotorious.events.ui.EventType.DOWN, function() {
    void 0 !== d._currentAnnotation && !1 != d._currentAnnotation && d._annotator.fireEvent(annotorious.events.EventType.ANNOTATION_CLICKED, d._currentAnnotation)
  });
  c.addHandler(annotorious.events.EventType.MOUSE_OUT_OF_ANNOTATABLE_ITEM, function() {
    delete d._currentAnnotation;
    d._eventsEnabled = !0
  });
  c.addHandler(annotorious.events.EventType.BEFORE_POPUP_HIDE, function() {
    if(!d._eventsEnabled && d._cachedMouseEvent) {
      var a = d._currentAnnotation;
      d._currentAnnotation = d.topAnnotationAt(d._cachedMouseEvent.offsetX, d._cachedMouseEvent.offsetY);
      d._eventsEnabled = !0;
      a != d._currentAnnotation ? (d.redraw(), d._annotator.fireEvent(annotorious.events.EventType.MOUSE_OUT_OF_ANNOTATION, {annotation:a, mouseEvent:d._cachedMouseEvent}), d._annotator.fireEvent(annotorious.events.EventType.MOUSE_OVER_ANNOTATION, {annotation:d._currentAnnotation, mouseEvent:d._cachedMouseEvent})) : d._currentAnnotation && d._annotator.popup.clearHideTimer()
    }else {
      d.redraw()
    }
  })
};
annotorious.mediatypes.image.Viewer.prototype.addAnnotation = function(a, c) {
  c && (c == this._currentAnnotation && delete this._currentAnnotation, goog.array.remove(this._annotations, c), delete this._shapes[annotorious.shape.hashCode(c.shapes[0])]);
  this._annotations.push(a);
  var d = a.shapes[0];
  if(d.units != annotorious.shape.Units.PIXEL) {
    var e = this, d = annotorious.shape.transform(d, function(a) {
      return e._annotator.fromItemCoordinates(a)
    })
  }
  this._shapes[annotorious.shape.hashCode(a.shapes[0])] = d;
  this.redraw()
};
annotorious.mediatypes.image.Viewer.prototype.removeAnnotation = function(a) {
  a == this._currentAnnotation && delete this._currentAnnotation;
  goog.array.remove(this._annotations, a);
  delete this._shapes[annotorious.shape.hashCode(a.shapes[0])];
  this.redraw()
};
annotorious.mediatypes.image.Viewer.prototype.getAnnotations = function() {
  return goog.array.clone(this._annotations)
};
annotorious.mediatypes.image.Viewer.prototype.highlightAnnotation = function(a) {
  (this._currentAnnotation = a) ? this._keepHighlighted = !0 : this._annotator.popup.startHideTimer();
  this.redraw();
  this._eventsEnabled = !0
};
annotorious.mediatypes.image.Viewer.prototype.getHighlightedAnnotation = function() {
  return this._currentAnnotation
};
annotorious.mediatypes.image.Viewer.prototype.topAnnotationAt = function(a, c) {
  var d = this.getAnnotationsAt(a, c);
  if(0 < d.length) {
    return d[0]
  }
};
annotorious.mediatypes.image.Viewer.prototype.getAnnotationsAt = function(a, c) {
  var d = [], e = this;
  goog.array.forEach(this._annotations, function(f) {
    annotorious.shape.intersects(e._shapes[annotorious.shape.hashCode(f.shapes[0])], a, c) && d.push(f)
  });
  goog.array.sort(d, function(a, c) {
    var d = e._shapes[annotorious.shape.hashCode(a.shapes[0])], j = e._shapes[annotorious.shape.hashCode(c.shapes[0])];
    return annotorious.shape.getSize(d) - annotorious.shape.getSize(j)
  });
  return d
};
annotorious.mediatypes.image.Viewer.prototype._onMouseMove = function(a) {
  var c = this.topAnnotationAt(a.offsetX, a.offsetY);
  c ? (this._keepHighlighted = this._keepHighlighted && c == this._currentAnnotation, this._currentAnnotation ? this._currentAnnotation != c && (this._eventsEnabled = !1, this._annotator.popup.startHideTimer()) : (this._currentAnnotation = c, this.redraw(), this._annotator.fireEvent(annotorious.events.EventType.MOUSE_OVER_ANNOTATION, {annotation:this._currentAnnotation, mouseEvent:a}))) : !this._keepHighlighted && this._currentAnnotation && (this._eventsEnabled = !1, this._annotator.popup.startHideTimer())
};
annotorious.mediatypes.image.Viewer.prototype._draw = function(a, c) {
  var d = goog.array.find(this._annotator.getAvailableSelectors(), function(c) {
    return c.getSupportedShapeType() == a.type
  });
  d ? d.drawShape(this._g2d, a, c) : console.log("WARNING unsupported shape type: " + a.type)
};
annotorious.mediatypes.image.Viewer.prototype.redraw = function() {
  this._g2d.clearRect(0, 0, this._canvas.width, this._canvas.height);
  var a = this;
  goog.array.forEach(this._annotations, function(c) {
    c != a._currentAnnotation && a._draw(a._shapes[annotorious.shape.hashCode(c.shapes[0])])
  });
  if(this._currentAnnotation) {
    var c = this._shapes[annotorious.shape.hashCode(this._currentAnnotation.shapes[0])];
    this._draw(c, !0);
    c = annotorious.shape.getBoundingRect(c).geometry;
    this._annotator.popup.show(this._currentAnnotation, new annotorious.shape.geom.Point(c.x, c.y + c.height + 5))
  }
};
annotorious.mediatypes.image.Viewer.prototype.glow = function(a, c) {
  function d() {
    if(j) {
      g2d.clearRect(0, 0, e._canvas.width, e._canvas.height);
      for(var c = a.length - 1;0 <= c;c--) {
        geom = a[c].geometry, g2d.beginPath(), g2d.lineJoin = "round", g2d.lineWidth = f.outline_width, g2d.strokeStyle = f.outline, g2d.strokeRect(geom.x + f.outline_width / 2, geom.y + f.outline_width / 2, geom.width - f.outline_width, geom.height - f.outline_width), g2d.lineJoin = "miter", g2d.lineWidth = f.stroke_width, g2d.strokeStyle = "rgb(255,255,255)", g2d.strokeRect(geom.x + f.outline_width + f.stroke_width / 2, geom.y + f.outline_width + f.stroke_width / 2, geom.width - 2 * f.outline_width - 
        f.stroke_width, geom.height - 2 * f.outline_width - f.stroke_width), g2d.lineJoin = "miter", g2d.lineWidth = f.hi_stroke_width, g2d.strokeStyle = "rgba(" + colour_in_rgb[0] + "," + colour_in_rgb[1] + "," + colour_in_rgb[2] + "," + h + ")", g2d.strokeRect(geom.x + f.outline_width + f.hi_stroke_width / 2, geom.y + f.outline_width + f.hi_stroke_width / 2, geom.width - 2 * f.outline_width - f.hi_stroke_width, geom.height - 2 * f.outline_width - f.hi_stroke_width), g2d.closePath()
      }
      h = i ? h + 0.025 : h - 0.025;
      0 >= h ? i = !0 : 1 <= h && (i = !1);
      requestAnimationFrame(d)
    }
  }
  g2d = this._g2d;
  var e = this, f = goog.array.find(this._annotator.getAvailableSelectors(), function(c) {
    return c.getSupportedShapeType() == a[0].type
  }).getProperties(), h = 0, i = !0, j = !0;
  goog.dom.classes.addRemove(e._canvas, "annotorious-item-unfocus", "annotorious-item-focus");
  setTimeout(function() {
    j = !1;
    e.redraw();
    goog.dom.classes.addRemove(e._canvas, "annotorious-item-focus", "annotorious-item-unfocus")
  }, c);
  var k = f.hi_stroke, k = k.replace("#", "");
  r = parseInt(k.substring(0, 2), 16);
  g = parseInt(k.substring(2, 4), 16);
  b = parseInt(k.substring(4, 6), 16);
  colour_in_rgb = result = [r, g, b];
  return requestAnimationFrame(d)
};
annotorious.mediatypes.image.Viewer.prototype.redrawGlow = function(a) {
  var c = this, d = [];
  goog.array.forEach(this._annotations, function(a) {
    d.push(c._shapes[annotorious.shape.hashCode(a.shapes[0])])
  });
  0 < d.length && c.glow(d, a)
};
annotorious.events.ui = {};
annotorious.events.ui.hasTouch = "ontouchstart" in window;
annotorious.events.ui.hasMouse = !annotorious.events.ui.hasTouch;
annotorious.events.ui.EventType = {DOWN:annotorious.events.ui.hasTouch ? goog.events.EventType.TOUCHSTART : goog.events.EventType.MOUSEDOWN, OVER:annotorious.events.ui.hasTouch ? "touchenter" : goog.events.EventType.MOUSEOVER, MOVE:annotorious.events.ui.hasTouch ? goog.events.EventType.TOUCHMOVE : goog.events.EventType.MOUSEMOVE, UP:annotorious.events.ui.hasTouch ? goog.events.EventType.TOUCHEND : goog.events.EventType.MOUSEUP, OUT:annotorious.events.ui.hasTouch ? "touchleave" : goog.events.EventType.MOUSEOUT, 
CLICK:annotorious.events.ui.hasTouch ? goog.events.EventType.TOUCHEND : goog.events.EventType.CLICK};
annotorious.events.ui.sanitizeCoordinates = function(a, c) {
  var d = !1, d = annotorious.dom.getOffset;
  a.offsetX = a.offsetX ? a.offsetX : !1;
  a.offsetY = a.offsetY ? a.offsetY : !1;
  return d = (!a.offsetX || !a.offsetY) && a.event_.changedTouches ? {x:a.event_.changedTouches[0].clientX - d(c).left, y:a.event_.changedTouches[0].clientY - d(c).top} : {x:a.offsetX, y:a.offsetY}
};
annotorious.plugins = {};
annotorious.plugins.selection = {};
annotorious.plugins.selection.RectDragSelector = function() {
};
annotorious.plugins.selection.RectDragSelector.prototype.init = function(a, c) {
  this._OUTLINE = "#111111";
  this._STROKE = "#ffffff";
  this._FILL = !1;
  this._HI_OUTLINE = "#111111";
  this._HI_STROKE = "#FFDC00";
  this._HI_FILL = !1;
  this._HI_OUTLINE_WIDTH = this._STROKE_WIDTH = this._OUTLINE_WIDTH = 1;
  this._HI_STROKE_WIDTH = 1.2;
  this._canvas = c;
  this._annotator = a;
  this._g2d = c.getContext("2d");
  this._g2d.lineWidth = 1;
  this._enabled = !1
};
annotorious.plugins.selection.RectDragSelector.prototype._attachListeners = function() {
  var a = this, c = this._canvas;
  this._mouseMoveListener = goog.events.listen(this._canvas, annotorious.events.ui.EventType.MOVE, function(d) {
    d = annotorious.events.ui.sanitizeCoordinates(d, c);
    if(a._enabled) {
      a._opposite = {x:d.x, y:d.y};
      a._g2d.clearRect(0, 0, c.width, c.height);
      var d = a._opposite.x - a._anchor.x, e = a._opposite.y - a._anchor.y;
      a.drawShape(a._g2d, {type:annotorious.shape.ShapeType.RECTANGLE, geometry:{x:0 < d ? a._anchor.x : a._opposite.x, y:0 < e ? a._anchor.y : a._opposite.y, width:Math.abs(d), height:Math.abs(e)}, style:{}})
    }
  });
  this._mouseUpListener = goog.events.listen(c, annotorious.events.ui.EventType.UP, function(d) {
    var e = annotorious.events.ui.sanitizeCoordinates(d, c), f = a.getShape(), d = d.event_ ? d.event_ : d;
    a._enabled = !1;
    f ? (a._detachListeners(), a._annotator.fireEvent(annotorious.events.EventType.SELECTION_COMPLETED, {mouseEvent:d, shape:f, viewportBounds:a.getViewportBounds(), annotorious:a._annotator})) : (a._annotator.fireEvent(annotorious.events.EventType.SELECTION_CANCELED), d = a._annotator.getAnnotationsAt(e.x, e.y), 0 < d.length && a._annotator.highlightAnnotation(d[0]))
  })
};
annotorious.plugins.selection.RectDragSelector.prototype._detachListeners = function() {
  this._mouseMoveListener && (goog.events.unlistenByKey(this._mouseMoveListener), delete this._mouseMoveListener);
  this._mouseUpListener && (goog.events.unlistenByKey(this._mouseUpListener), delete this._mouseUpListener)
};
annotorious.plugins.selection.RectDragSelector.prototype.getName = function() {
  return"rect_drag"
};
annotorious.plugins.selection.RectDragSelector.prototype.getSupportedShapeType = function() {
  return annotorious.shape.ShapeType.RECTANGLE
};
annotorious.plugins.selection.RectDragSelector.prototype.getProperties = function() {
  return{outline:this._OUTLINE, stroke:this._STROKE, fill:this._FILL, hi_outline:this._HI_OUTLINE, hi_stroke:this._HI_STROKE, hi_fill:this._HI_FILL, outline_width:this._OUTLINE_WIDTH, stroke_width:this._STROKE_WIDTH, hi_outline_width:this._HI_OUTLINE_WIDTH, hi_stroke_width:this._HI_STROKE_WIDTH}
};
annotorious.plugins.selection.RectDragSelector.prototype.setProperties = function(a) {
  a.hasOwnProperty("outline") && (this._OUTLINE = a.outline);
  a.hasOwnProperty("stroke") && (this._STROKE = a.stroke);
  a.hasOwnProperty("fill") && (this._FILL = a.fill);
  a.hasOwnProperty("hi_outline") && (this._HI_OUTLINE = a.hi_outline);
  a.hasOwnProperty("hi_stroke") && (this._HI_STROKE = a.hi_stroke);
  a.hasOwnProperty("hi_fill") && (this._HI_FILL = a.hi_fill);
  a.hasOwnProperty("outline_width") && (this._OUTLINE_WIDTH = a.outline_width);
  a.hasOwnProperty("stroke_width") && (this._STROKE_WIDTH = a.stroke_width);
  a.hasOwnProperty("hi_outline_width") && (this._HI_OUTLINE_WIDTH = a.hi_outline_width);
  a.hasOwnProperty("hi_stroke_width") && (this._HI_STROKE_WIDTH = a.hi_stroke_width)
};
annotorious.plugins.selection.RectDragSelector.prototype.startSelection = function(a, c) {
  var d = {x:a, y:c};
  this._enabled = !0;
  this._attachListeners(d);
  this._anchor = new annotorious.shape.geom.Point(a, c);
  this._annotator.fireEvent(annotorious.events.EventType.SELECTION_STARTED, {offsetX:a, offsetY:c});
  goog.style.setStyle(document.body, "-webkit-user-select", "none")
};
annotorious.plugins.selection.RectDragSelector.prototype.stopSelection = function() {
  this._detachListeners();
  this._g2d.clearRect(0, 0, this._canvas.width, this._canvas.height);
  goog.style.setStyle(document.body, "-webkit-user-select", "auto");
  delete this._opposite
};
annotorious.plugins.selection.RectDragSelector.prototype.getShape = function() {
  if(this._opposite && 3 < Math.abs(this._opposite.x - this._anchor.x) && 3 < Math.abs(this._opposite.y - this._anchor.y)) {
    var a = this.getViewportBounds(), a = this._annotator.toItemCoordinates({x:a.left, y:a.top, width:a.right - a.left, height:a.bottom - a.top});
    return new annotorious.shape.Shape(annotorious.shape.ShapeType.RECTANGLE, a)
  }
};
annotorious.plugins.selection.RectDragSelector.prototype.getViewportBounds = function() {
  var a, c;
  this._opposite.x > this._anchor.x ? (a = this._opposite.x, c = this._anchor.x) : (a = this._anchor.x, c = this._opposite.x);
  var d, e;
  this._opposite.y > this._anchor.y ? (d = this._anchor.y, e = this._opposite.y) : (d = this._opposite.y, e = this._anchor.y);
  return{top:d, right:a, bottom:e, left:c}
};
annotorious.plugins.selection.RectDragSelector.prototype.drawShape = function(a, c, d) {
  var e, f, h, i;
  c.style || (c.style = {});
  c.type == annotorious.shape.ShapeType.RECTANGLE && (d ? (e = c.style.hi_fill || this._HI_FILL, d = c.style.hi_stroke || this._HI_STROKE, f = c.style.hi_outline || this._HI_OUTLINE, h = c.style.hi_outline_width || this._HI_OUTLINE_WIDTH, i = c.style.hi_stroke_width || this._HI_STROKE_WIDTH) : (e = c.style.fill || this._FILL, d = c.style.stroke || this._STROKE, f = c.style.outline || this._OUTLINE, h = c.style.outline_width || this._OUTLINE_WIDTH, i = c.style.stroke_width || this._STROKE_WIDTH), 
  c = c.geometry, f && (a.lineJoin = "round", a.lineWidth = h, a.strokeStyle = f, a.strokeRect(c.x + h / 2, c.y + h / 2, c.width - h, c.height - h)), d && (a.lineJoin = "miter", a.lineWidth = i, a.strokeStyle = d, a.strokeRect(c.x + h + i / 2, c.y + h + i / 2, c.width - 2 * h - i, c.height - 2 * h - i)), e && (a.lineJoin = "miter", a.lineWidth = i, a.fillStyle = e, a.fillRect(c.x + h + i / 2, c.y + h + i / 2, c.width - 2 * h - i, c.height - 2 * h - i)))
};
annotorious.templates.image = {};
annotorious.templates.image.canvas = function(a) {
  return'<canvas class="annotorious-item annotorious-opacity-fade" style="position:absolute; top:0px; left:0px; width:' + soy.$$escapeHtml(a.width) + "px; height:" + soy.$$escapeHtml(a.height) + 'px; z-index:0" width="' + soy.$$escapeHtml(a.width) + '" height="' + soy.$$escapeHtml(a.height) + '"></canvas>'
};
annotorious.templates.image.hint = function(a) {
  return'<div class="annotorious-hint" style="white-space:nowrap; position:absolute; top:0px; left:0px; pointer-events:none;"><div class="annotorious-hint-msg annotorious-opacity-fade">' + soy.$$escapeHtml(a.msg) + '</div><div class="annotorious-hint-icon" style="pointer-events:auto"></div></div>'
};
annotorious.mediatypes.image.ImageAnnotator = function(a, c) {
  annotorious.mediatypes.Annotator.call();
  this._image = a;
  this._original_bufferspace = {padding:a.style.padding, margin:a.style.margin};
  this._eventBroker = new annotorious.events.EventBroker;
  this._selectors = [];
  this._selectionEnabled = !0;
  this.element = goog.dom.createDom("div", "annotorious-annotationlayer");
  goog.style.setStyle(this.element, "position", "relative");
  goog.style.setStyle(this.element, "display", "inline-block");
  this._transferStyles(a, this.element);
  goog.dom.replaceNode(this.element, a);
  goog.dom.appendChild(this.element, a);
  var d = goog.style.getBounds(a);
  this._viewCanvas = goog.soy.renderAsElement(annotorious.templates.image.canvas, {width:d.width, height:d.height});
  annotorious.events.ui.hasMouse && goog.dom.classes.add(this._viewCanvas, "annotorious-item-unfocus");
  goog.dom.appendChild(this.element, this._viewCanvas);
  this._editCanvas = goog.soy.renderAsElement(annotorious.templates.image.canvas, {width:d.width, height:d.height});
  annotorious.events.ui.hasMouse && goog.style.showElement(this._editCanvas, !1);
  goog.dom.appendChild(this.element, this._editCanvas);
  this.popup = c ? c : new annotorious.Popup(this);
  d = new annotorious.plugins.selection.RectDragSelector;
  d.init(this, this._editCanvas);
  this._selectors.push(d);
  this._currentSelector = d;
  this.editor = new annotorious.Editor(this);
  this._viewer = new annotorious.mediatypes.image.Viewer(this._viewCanvas, this);
  this._hint = new annotorious.Hint(this, this.element);
  var e = this;
  annotorious.events.ui.hasMouse && (goog.events.listen(this.element, annotorious.events.ui.EventType.OVER, function(a) {
    a = a.relatedTarget;
    if(!a || !goog.dom.contains(e.element, a)) {
      e._eventBroker.fireEvent(annotorious.events.EventType.MOUSE_OVER_ANNOTATABLE_ITEM), goog.dom.classes.addRemove(e._viewCanvas, "annotorious-item-unfocus", "annotorious-item-focus")
    }
  }), goog.events.listen(this.element, annotorious.events.ui.EventType.OUT, function(a) {
    a = a.relatedTarget;
    if(!a || !goog.dom.contains(e.element, a)) {
      e._eventBroker.fireEvent(annotorious.events.EventType.MOUSE_OUT_OF_ANNOTATABLE_ITEM), goog.dom.classes.addRemove(e._viewCanvas, "annotorious-item-focus", "annotorious-item-unfocus")
    }
  }));
  this._attachListener(annotorious.events.ui.hasTouch ? this._editCanvas : this._viewCanvas);
  this._eventBroker.addHandler(annotorious.events.EventType.SELECTION_COMPLETED, function(a) {
    a = a.viewportBounds;
    e.editor.setPosition(new annotorious.shape.geom.Point(a.left + e._image.offsetLeft, a.bottom + 4 + e._image.offsetTop))
  });
  this._eventBroker.addHandler(annotorious.events.EventType.SELECTION_CANCELED, function() {
    annotorious.events.ui.hasMouse && goog.style.showElement(e._editCanvas, !1);
    e._currentSelector.stopSelection()
  })
};
goog.inherits(annotorious.mediatypes.image.ImageAnnotator, annotorious.mediatypes.Annotator);
annotorious.mediatypes.image.ImageAnnotator.prototype._transferStyles = function(a, c) {
  var d = function(d, e) {
    goog.style.setStyle(c, "margin-" + d, e + "px");
    goog.style.setStyle(a, "margin-" + d, 0);
    goog.style.setStyle(a, "padding-" + d, 0)
  }, e = goog.style.getMarginBox(a), f = goog.style.getPaddingBox(a);
  (0 != e.top || 0 != f.top) && d("top", e.top + f.top);
  (0 != e.right || 0 != f.right) && d("right", e.right + f.right);
  (0 != e.bottom || 0 != f.bottom) && d("bottom", e.bottom + f.bottom);
  (0 != e.left || 0 != f.left) && d("left", e.left + f.left)
};
annotorious.mediatypes.image.ImageAnnotator.prototype.activateSelector = function() {
};
annotorious.mediatypes.image.ImageAnnotator.prototype.addSelector = function(a) {
  a.init(this, this._editCanvas);
  this._selectors.push(a)
};
annotorious.mediatypes.image.ImageAnnotator.prototype.destroy = function() {
  var a = this._image;
  a.style.margin = this._original_bufferspace.margin;
  a.style.padding = this._original_bufferspace.padding;
  goog.dom.replaceNode(a, this.element)
};
annotorious.mediatypes.image.ImageAnnotator.prototype.editAnnotation = function(a) {
  this._viewer.removeAnnotation(a);
  var c = goog.array.find(this._selectors, function(c) {
    return c.getSupportedShapeType() == a.shapes[0].type
  });
  if(c) {
    goog.style.showElement(this._editCanvas, !0);
    this._viewer.highlightAnnotation(!1);
    var d = this._editCanvas.getContext("2d"), e = a.shapes[0], f = this, e = "pixel" == e.units ? e : annotorious.shape.transform(e, function(a) {
      return f.fromItemCoordinates(a)
    });
    c.drawShape(d, e)
  }
  c = annotorious.shape.getBoundingRect(a.shapes[0]).geometry;
  c = "pixel" == a.shapes[0].units ? new annotorious.shape.geom.Point(c.x, c.y + c.height) : this.fromItemCoordinates(new annotorious.shape.geom.Point(c.x, c.y + c.height));
  this.editor.setPosition(new annotorious.shape.geom.Point(c.x + this._image.offsetLeft, c.y + 4 + this._image.offsetTop));
  this.editor.open(a)
};
annotorious.mediatypes.image.ImageAnnotator.prototype.fromItemCoordinates = function(a) {
  var c = goog.style.getSize(this._image);
  return a.width ? {x:a.x * c.width, y:a.y * c.height, width:a.width * c.width, height:a.height * c.height} : {x:a.x * c.width, y:a.y * c.height}
};
annotorious.mediatypes.image.ImageAnnotator.prototype.getActiveSelector = function() {
  return this._currentSelector
};
annotorious.mediatypes.image.ImageAnnotator.prototype.getAnnotations = function() {
  return this._viewer.getAnnotations()
};
annotorious.mediatypes.image.ImageAnnotator.prototype.getAnnotationsAt = function(a, c) {
  return goog.array.clone(this._viewer.getAnnotationsAt(a, c))
};
annotorious.mediatypes.image.ImageAnnotator.prototype.getAvailableSelectors = function() {
  return this._selectors
};
annotorious.mediatypes.image.ImageAnnotator.prototype.getItem = function() {
  return{src:annotorious.mediatypes.image.ImageAnnotator.getItemURL(this._image), element:this._image}
};
annotorious.mediatypes.image.ImageAnnotator.getItemURL = function(a) {
  var c = a.getAttribute("data-original");
  return c ? c : a.src
};
annotorious.mediatypes.image.ImageAnnotator.getItemID = function(a) {
  return a.id
};
annotorious.mediatypes.image.ImageAnnotator.setItemID = function(a, c) {
  a.setAttribute("id", "annotorious_" + c.toString())
};
annotorious.mediatypes.image.ImageAnnotator.prototype.hideAnnotations = function() {
  goog.style.showElement(this._viewCanvas, !1)
};
annotorious.mediatypes.image.ImageAnnotator.prototype.hideSelectionWidget = function() {
  this._selectionEnabled = !1;
  this._hint && (this._hint.destroy(), delete this._hint)
};
annotorious.mediatypes.image.ImageAnnotator.prototype.setCurrentSelector = function(a) {
  (this._currentSelector = goog.array.find(this._selectors, function(c) {
    return c.getName() == a
  })) || console.log('WARNING: selector "' + a + '" not available')
};
annotorious.mediatypes.image.ImageAnnotator.prototype.setProperties = function(a) {
  goog.array.forEach(this._selectors, function(c) {
    c.setProperties(a)
  });
  this._viewer.redraw()
};
annotorious.mediatypes.image.ImageAnnotator.prototype.showAnnotations = function() {
  goog.style.showElement(this._viewCanvas, !0)
};
annotorious.mediatypes.image.ImageAnnotator.prototype.showSelectionWidget = function() {
  this._selectionEnabled = !0;
  this._hint || (this._hint = new annotorious.Hint(this, this.element))
};
annotorious.mediatypes.image.ImageAnnotator.prototype.stopSelection = function(a) {
  annotorious.events.ui.hasMouse && goog.style.showElement(this._editCanvas, !1);
  this._currentSelector.stopSelection();
  a && this._viewer.addAnnotation(a)
};
annotorious.mediatypes.image.ImageAnnotator.prototype.toItemCoordinates = function(a) {
  var c = goog.style.getSize(this._image);
  return a.width ? {x:a.x / c.width, y:a.y / c.height, width:a.width / c.width, height:a.height / c.height} : {x:a.x / c.width, y:a.y / c.height}
};
annotorious.mediatypes.image.ImageAnnotator.prototype.redrawGlow = function(a) {
  this._viewer.redrawGlow(a)
};
annotorious.mediatypes.image.ImageAnnotator.prototype.redrawGlow = annotorious.mediatypes.image.ImageAnnotator.prototype.redrawGlow;
annotorious.mediatypes.image.ImageAnnotator.prototype.addSelector = annotorious.mediatypes.image.ImageAnnotator.prototype.addSelector;
annotorious.mediatypes.image.ImageAnnotator.prototype.stopSelection = annotorious.mediatypes.image.ImageAnnotator.prototype.stopSelection;
annotorious.mediatypes.image.ImageAnnotator.prototype.fireEvent = annotorious.mediatypes.image.ImageAnnotator.prototype.fireEvent;
annotorious.mediatypes.image.ImageAnnotator.prototype.setCurrentSelector = annotorious.mediatypes.image.ImageAnnotator.prototype.setCurrentSelector;
annotorious.mediatypes.image.ImageAnnotator.prototype.toItemCoordinates = annotorious.mediatypes.image.ImageAnnotator.prototype.toItemCoordinates;
annotorious.mediatypes.image.ImageModule = function() {
  annotorious.mediatypes.Module.call();
  this._initFields(function() {
    return goog.dom.query("img.annotatable", document)
  })
};
goog.inherits(annotorious.mediatypes.image.ImageModule, annotorious.mediatypes.Module);
annotorious.mediatypes.image.ImageModule.prototype.getItemURL = function(a) {
  return annotorious.mediatypes.image.ImageAnnotator.getItemURL(a)
};
annotorious.mediatypes.image.ImageModule.prototype.getItemID = function(a) {
  return annotorious.mediatypes.image.ImageAnnotator.getItemID(a)
};
annotorious.mediatypes.image.ImageModule.prototype.setItemID = function(a, c) {
  return annotorious.mediatypes.image.ImageAnnotator.setItemID(a, c)
};
annotorious.mediatypes.image.ImageModule.prototype.newAnnotator = function(a) {
  return new annotorious.mediatypes.image.ImageAnnotator(a)
};
annotorious.mediatypes.image.ImageModule.prototype.supports = function(a) {
  return goog.dom.isElement(a) ? "IMG" == a.tagName : !1
};
annotorious.templates.openlayers = {};
annotorious.templates.openlayers.secondaryHint = function(a) {
  return'<div class="annotorious-opacity-fade" style="white-space:nowrap; position:absolute; pointer-events:none; top:80px; width:100%; text-align:center;"><div class="annotorious-ol-hint" style="width: 400px; margin:0px auto;">' + soy.$$escapeHtml(a.msg) + "</dvi></div>"
};
goog.events.MouseWheelHandler = function(a) {
  goog.events.EventTarget.call(this);
  this.element_ = a;
  a = goog.dom.isElement(this.element_) ? this.element_ : this.element_ ? this.element_.body : null;
  this.isRtl_ = !!a && goog.style.isRightToLeft(a);
  this.listenKey_ = goog.events.listen(this.element_, goog.userAgent.GECKO ? "DOMMouseScroll" : "mousewheel", this)
};
goog.inherits(goog.events.MouseWheelHandler, goog.events.EventTarget);
goog.events.MouseWheelHandler.EventType = {MOUSEWHEEL:"mousewheel"};
goog.events.MouseWheelHandler.prototype.setMaxDeltaX = function(a) {
  this.maxDeltaX_ = a
};
goog.events.MouseWheelHandler.prototype.setMaxDeltaY = function(a) {
  this.maxDeltaY_ = a
};
goog.events.MouseWheelHandler.prototype.handleEvent = function(a) {
  var c = 0, d = 0, e = 0, a = a.getBrowserEvent();
  if("mousewheel" == a.type) {
    d = 1;
    if(goog.userAgent.IE || goog.userAgent.WEBKIT && (goog.userAgent.WINDOWS || goog.userAgent.isVersion("532.0"))) {
      d = 40
    }
    e = goog.events.MouseWheelHandler.smartScale_(-a.wheelDelta, d);
    goog.isDef(a.wheelDeltaX) ? (c = goog.events.MouseWheelHandler.smartScale_(-a.wheelDeltaX, d), d = goog.events.MouseWheelHandler.smartScale_(-a.wheelDeltaY, d)) : d = e
  }else {
    e = a.detail, 100 < e ? e = 3 : -100 > e && (e = -3), goog.isDef(a.axis) && a.axis === a.HORIZONTAL_AXIS ? c = e : d = e
  }
  goog.isNumber(this.maxDeltaX_) && (c = goog.math.clamp(c, -this.maxDeltaX_, this.maxDeltaX_));
  goog.isNumber(this.maxDeltaY_) && (d = goog.math.clamp(d, -this.maxDeltaY_, this.maxDeltaY_));
  this.isRtl_ && (c = -c);
  c = new goog.events.MouseWheelEvent(e, a, c, d);
  this.dispatchEvent(c)
};
goog.events.MouseWheelHandler.smartScale_ = function(a, c) {
  return goog.userAgent.WEBKIT && (goog.userAgent.MAC || goog.userAgent.LINUX) && 0 != a % c ? a : a / c
};
goog.events.MouseWheelHandler.prototype.disposeInternal = function() {
  goog.events.MouseWheelHandler.superClass_.disposeInternal.call(this);
  goog.events.unlistenByKey(this.listenKey_);
  delete this.listenKey_
};
goog.events.MouseWheelEvent = function(a, c, d, e) {
  goog.events.BrowserEvent.call(this, c);
  this.type = goog.events.MouseWheelHandler.EventType.MOUSEWHEEL;
  this.detail = a;
  this.deltaX = d;
  this.deltaY = e
};
goog.inherits(goog.events.MouseWheelEvent, goog.events.BrowserEvent);
annotorious.mediatypes.openlayers = {};
annotorious.mediatypes.openlayers.Viewer = function(a, c) {
  this._map = a;
  this._map_bounds = goog.style.getBounds(c.element);
  this._popup = c.popup;
  goog.style.setStyle(this._popup.element, "z-index", 99E3);
  this._overlays = [];
  this._boxesLayer = new OpenLayers.Layer.Boxes("Annotorious");
  this._map.addLayer(this._boxesLayer);
  var d = this;
  this._map.events.register("move", this._map, function() {
    d._currentlyHighlightedOverlay && d._place_popup()
  });
  c.addHandler(annotorious.events.EventType.BEFORE_POPUP_HIDE, function() {
    d._lastHoveredOverlay == d._currentlyHighlightedOverlay ? d._popup.clearHideTimer() : d._updateHighlight(d._lastHoveredOverlay, d._currentlyHighlightedOverlay)
  })
};
annotorious.mediatypes.openlayers.Viewer.prototype.destroy = function() {
  this._boxesLayer.destroy()
};
annotorious.mediatypes.openlayers.Viewer.prototype._place_popup = function() {
  var a = this._currentlyHighlightedOverlay.marker.div, c = goog.style.getBounds(a), d = goog.style.getRelativePosition(a, this._map.div), a = d.y, d = d.x, e = c.width, f = c.height, c = goog.style.getBounds(this._popup.element), a = {y:a + f + 5};
  d + c.width > this._map_bounds.width ? (goog.dom.classes.addRemove(this._popup.element, "top-left", "top-right"), a.x = d + e - c.width) : (goog.dom.classes.addRemove(this._popup.element, "top-right", "top-left"), a.x = d);
  0 > a.x && (a.x = 0);
  a.x + c.width > this._map_bounds.width && (a.x = this._map_bounds.width - c.width);
  a.y + c.height > this._map_bounds.height && (a.y = this._map_bounds.height - c.height);
  this._popup.setPosition(a)
};
annotorious.mediatypes.openlayers.Viewer.prototype._show_popup = function(a) {
  this._popup.setAnnotation(a);
  this._place_popup();
  this._popup.show()
};
annotorious.mediatypes.openlayers.Viewer.prototype._updateHighlight = function(a, c) {
  a ? (goog.style.getRelativePosition(a.marker.div, this._map.div), parseInt(goog.style.getStyle(a.marker.div, "height"), 10), goog.style.setStyle(a.inner, "border-color", "#fff000"), this._currentlyHighlightedOverlay = a, this._show_popup(a.annotation)) : delete this._currentlyHighlightedOverlay;
  c && goog.style.setStyle(c.inner, "border-color", "#fff")
};
annotorious.mediatypes.openlayers.Viewer.prototype.addAnnotation = function(a) {
  var c = a.shapes[0].geometry, c = new OpenLayers.Marker.Box(new OpenLayers.Bounds(c.x, c.y, c.x + c.width, c.y + c.height));
  goog.dom.classes.add(c.div, "annotorious-ol-boxmarker-outer");
  goog.style.setStyle(c.div, "border", null);
  var d = goog.dom.createDom("div", "annotorious-ol-boxmarker-inner");
  goog.style.setSize(d, "100%", "100%");
  goog.dom.appendChild(c.div, d);
  var e = {annotation:a, marker:c, inner:d}, f = this;
  goog.events.listen(d, goog.events.EventType.MOUSEOVER, function() {
    f._currentlyHighlightedOverlay || f._updateHighlight(e);
    f._lastHoveredOverlay = e
  });
  goog.events.listen(d, goog.events.EventType.MOUSEOUT, function() {
    delete f._lastHoveredOverlay;
    f._popup.startHideTimer()
  });
  this._overlays.push(e);
  goog.array.sort(this._overlays, function(a, c) {
    var d = a.annotation.shapes[0];
    return annotorious.shape.getSize(c.annotation.shapes[0]) - annotorious.shape.getSize(d)
  });
  var h = 1E4;
  goog.array.forEach(this._overlays, function(a) {
    goog.style.setStyle(a.marker.div, "z-index", h);
    h++
  });
  this._boxesLayer.addMarker(c)
};
annotorious.mediatypes.openlayers.Viewer.prototype.removeAnnotation = function(a) {
  var c = goog.array.find(this._overlays, function(c) {
    return c.annotation == a
  });
  c && (goog.array.remove(this._overlays, c), this._boxesLayer.removeMarker(c.marker))
};
annotorious.mediatypes.openlayers.Viewer.prototype.getAnnotations = function() {
};
annotorious.mediatypes.openlayers.Viewer.prototype.highlightAnnotation = function(a) {
  a || this._popup.startHideTimer()
};
annotorious.mediatypes.openlayers.OpenLayersAnnotator = function(a) {
  annotorious.mediatypes.Annotator.call();
  this._map = a;
  this.element = a.div;
  var c = goog.style.getStyle(this.element, "position");
  "absolute" != c && "relative" != c && goog.style.setStyle(this.element, "position", "relative");
  this._eventBroker = new annotorious.events.EventBroker;
  this._secondaryHint = goog.soy.renderAsElement(annotorious.templates.openlayers.secondaryHint, {msg:"Click and Drag"});
  goog.style.setStyle(this._secondaryHint, "z-index", 9998);
  goog.style.setOpacity(this._secondaryHint, 0);
  goog.dom.appendChild(this.element, this._secondaryHint);
  this.popup = new annotorious.Popup(this);
  this._viewer = new annotorious.mediatypes.openlayers.Viewer(a, this);
  this._editCanvas = goog.soy.renderAsElement(annotorious.templates.image.canvas, {width:"0", height:"0"});
  goog.style.showElement(this._editCanvas, !1);
  goog.style.setStyle(this._editCanvas, "position", "absolute");
  goog.style.setStyle(this._editCanvas, "top", "0px");
  goog.style.setStyle(this._editCanvas, "z-index", 9999);
  goog.dom.appendChild(this.element, this._editCanvas);
  var d = this, a = function() {
    var a = parseInt(goog.style.getComputedStyle(d.element, "width"), 10), c = parseInt(goog.style.getComputedStyle(d.element, "height"), 10);
    goog.style.setSize(d._editCanvas, a, c);
    d._editCanvas.width = a;
    d._editCanvas.height = c
  };
  a();
  this._currentSelector = new annotorious.plugins.selection.RectDragSelector;
  this._currentSelector.init(this, this._editCanvas);
  this._stop_selection_callback = void 0;
  this.editor = new annotorious.Editor(this);
  goog.style.setStyle(this.editor.element, "z-index", 1E4);
  window.addEventListener ? window.addEventListener("resize", a, !1) : window.attachEvent && window.attachEvent("onresize", a);
  goog.events.listen(this.element, goog.events.EventType.MOUSEOVER, function(a) {
    a = a.relatedTarget;
    (!a || !goog.dom.contains(d.element, a)) && d._eventBroker.fireEvent(annotorious.events.EventType.MOUSE_OVER_ANNOTATABLE_ITEM)
  });
  goog.events.listen(this.element, goog.events.EventType.MOUSEOUT, function(a) {
    a = a.relatedTarget;
    (!a || !goog.dom.contains(d.element, a)) && d._eventBroker.fireEvent(annotorious.events.EventType.MOUSE_OUT_OF_ANNOTATABLE_ITEM)
  });
  goog.events.listen(this._editCanvas, goog.events.EventType.MOUSEDOWN, function(a) {
    var c = goog.style.getClientPosition(d.element);
    d._currentSelector.startSelection(a.clientX - c.x, a.clientY - c.y)
  });
  this._eventBroker.addHandler(annotorious.events.EventType.SELECTION_COMPLETED, function(a) {
    goog.style.setStyle(d._editCanvas, "pointer-events", "none");
    a = a.viewportBounds;
    d.editor.setPosition(new annotorious.shape.geom.Point(a.left, a.bottom + 4));
    d.editor.open()
  });
  this._eventBroker.addHandler(annotorious.events.EventType.SELECTION_CANCELED, function() {
    d.stopSelection()
  })
};
goog.inherits(annotorious.mediatypes.openlayers.OpenLayersAnnotator, annotorious.mediatypes.Annotator);
annotorious.mediatypes.openlayers.OpenLayersAnnotator.prototype.showSelectionWidget = function() {
};
annotorious.mediatypes.openlayers.OpenLayersAnnotator.prototype.hideSelectionWidget = function() {
};
annotorious.mediatypes.openlayers.OpenLayersAnnotator.prototype.activateSelector = function(a) {
  goog.style.setStyle(this._editCanvas, "pointer-events", "auto");
  var c = this;
  goog.style.showElement(this._editCanvas, !0);
  goog.style.setOpacity(this._secondaryHint, 0.8);
  window.setTimeout(function() {
    goog.style.setOpacity(c._secondaryHint, 0)
  }, 2E3);
  a && (this._stop_selection_callback = a)
};
annotorious.mediatypes.openlayers.OpenLayersAnnotator.prototype.destroy = function() {
  this._viewer.destroy();
  goog.dom.removeNode(this._secondaryHint);
  goog.dom.removeNode(this._editCanvas)
};
annotorious.mediatypes.openlayers.OpenLayersAnnotator.prototype.addSelector = function() {
};
annotorious.mediatypes.openlayers.OpenLayersAnnotator.prototype.editAnnotation = function(a) {
  this._viewer.removeAnnotation(a);
  var c = this._currentSelector, d = this;
  if(c) {
    goog.style.showElement(this._editCanvas, !0);
    this._viewer.highlightAnnotation(void 0);
    var e = this._editCanvas.getContext("2d"), f = annotorious.shape.transform(a.shapes[0], function(a) {
      return d.fromItemCoordinates(a)
    });
    console.log(f);
    c.drawShape(e, f);
    c = annotorious.shape.getBoundingRect(f).geometry;
    this.editor.setPosition(new annotorious.shape.geom.Point(c.x, c.y + c.height));
    this.editor.open(a)
  }
};
annotorious.mediatypes.openlayers.OpenLayersAnnotator.prototype.fromItemCoordinates = function(a) {
  var c = this._map.getViewPortPxFromLonLat(new OpenLayers.LonLat(a.x, a.y));
  return(a = a.width ? this._map.getViewPortPxFromLonLat(new OpenLayers.LonLat(a.x + a.width, a.y + a.height)) : !1) ? {x:c.x, y:a.y, width:a.x - c.x + 2, height:c.y - a.y + 2} : {x:c.x, y:c.y}
};
annotorious.mediatypes.openlayers.OpenLayersAnnotator.prototype.getAnnotations = function() {
  return this._viewer.getAnnotations()
};
annotorious.mediatypes.openlayers.OpenLayersAnnotator.prototype.getAvailableSelectors = function() {
};
annotorious.mediatypes.openlayers.OpenLayersAnnotator.prototype.getItem = function() {
  return{src:"map://openlayers/something"}
};
annotorious.mediatypes.openlayers.OpenLayersAnnotator.prototype.setActiveSelector = function() {
};
annotorious.mediatypes.openlayers.OpenLayersAnnotator.prototype.toItemCoordinates = function(a) {
  var c = this._map.getLonLatFromPixel(new OpenLayers.Pixel(a.x, a.y));
  return(a = a.width ? new OpenLayers.Pixel(a.x + a.width - 2, a.y + a.height - 2) : !1) ? (a = this._map.getLonLatFromPixel(a), c = {x:c.lon, y:a.lat, width:a.lon - c.lon, height:c.lat - a.lat}, console.log(c), c) : {x:c.lon, y:c.lat}
};
annotorious.mediatypes.openlayers.OpenLayersModule = function() {
  annotorious.mediatypes.Module.call();
  this._initFields()
};
goog.inherits(annotorious.mediatypes.openlayers.OpenLayersModule, annotorious.mediatypes.Module);
annotorious.mediatypes.openlayers.OpenLayersModule.prototype.getItemURL = function() {
  return"map://openlayers/something"
};
annotorious.mediatypes.openlayers.OpenLayersModule.prototype.newAnnotator = function(a) {
  return new annotorious.mediatypes.openlayers.OpenLayersAnnotator(a)
};
annotorious.mediatypes.openlayers.OpenLayersModule.prototype.supports = function(a) {
  return a instanceof OpenLayers.Map
};
annotorious.mediatypes.openseadragon = {};
annotorious.mediatypes.openseadragon.Viewer = function(a, c) {
  this._osdViewer = a;
  this._map_bounds = goog.style.getBounds(a.element);
  this._popup = c.popup;
  goog.style.setStyle(this._popup.element, "z-index", 99E3);
  this._overlays = [];
  var d = this;
  this._osdViewer.addHandler("animation", function() {
    d._currentlyHighlightedOverlay && d._place_popup()
  });
  c.addHandler(annotorious.events.EventType.BEFORE_POPUP_HIDE, function() {
    d._lastHoveredOverlay == d._currentlyHighlightedOverlay ? d._popup.clearHideTimer() : d._updateHighlight(d._lastHoveredOverlay, d._currentlyHighlightedOverlay)
  })
};
annotorious.mediatypes.openseadragon.Viewer.prototype._place_popup = function() {
  var a = this._osdViewer.element, c = this._currentlyHighlightedOverlay.outer, d = goog.style.getBounds(c), c = goog.style.getRelativePosition(c, a), a = c.y, c = c.x, e = d.width, f = d.height, d = goog.style.getBounds(this._popup.element), a = {x:c, y:a + f + 12};
  goog.dom.classes.addRemove(this._popup.element, "top-right", "top-left");
  this._osdViewer.isFullPage() || (c + d.width > this._map_bounds.width && (goog.dom.classes.addRemove(this._popup.element, "top-left", "top-right"), a.x = c + e - d.width), 0 > a.x && (a.x = 0), a.x + d.width > this._map_bounds.width && (a.x = this._map_bounds.width - d.width), a.y + d.height > this._map_bounds.height && (a.y = this._map_bounds.height - d.height));
  this._popup.setPosition(a)
};
annotorious.mediatypes.openseadragon.Viewer.prototype._show_popup = function(a) {
  this._popup.setAnnotation(a);
  this._place_popup();
  this._popup.show()
};
annotorious.mediatypes.openseadragon.Viewer.prototype._updateHighlight = function(a, c) {
  a ? (goog.style.setStyle(a.inner, "border-color", "#fff000"), this._currentlyHighlightedOverlay = a, this._show_popup(a.annotation)) : delete this._currentlyHighlightedOverlay;
  c && goog.style.setStyle(c.inner, "border-color", "#fff")
};
annotorious.mediatypes.openseadragon.Viewer.prototype.addAnnotation = function(a) {
  var c = a.shapes[0].geometry, d = goog.dom.createDom("div", "annotorious-ol-boxmarker-outer"), e = goog.dom.createDom("div", "annotorious-ol-boxmarker-inner");
  goog.style.setSize(e, "100%", "100%");
  goog.dom.appendChild(d, e);
  var c = new OpenSeadragon.Rect(c.x, c.y, c.width, c.height), f = {annotation:a, outer:d, inner:e}, h = this;
  goog.events.listen(e, goog.events.EventType.MOUSEOVER, function() {
    h._currentlyHighlightedOverlay || h._updateHighlight(f);
    h._lastHoveredOverlay = f
  });
  goog.events.listen(e, goog.events.EventType.MOUSEOUT, function() {
    delete h._lastHoveredOverlay;
    h._popup.startHideTimer()
  });
  this._overlays.push(f);
  goog.array.sort(this._overlays, function(a, c) {
    var d = a.annotation.shapes[0];
    return annotorious.shape.getSize(c.annotation.shapes[0]) - annotorious.shape.getSize(d)
  });
  var i = 1;
  goog.array.forEach(this._overlays, function(a) {
    goog.style.setStyle(a.outer, "z-index", i);
    i++
  });
  this._osdViewer.drawer.addOverlay(d, c)
};
annotorious.mediatypes.openseadragon.Viewer.prototype.removeAnnotation = function(a) {
  var c = goog.array.find(this._overlays, function(c) {
    return c.annotation == a
  });
  c && (goog.array.remove(this._overlays, c), this._osdViewer.drawer.removeOverlay(c.outer))
};
annotorious.mediatypes.openseadragon.Viewer.prototype.getAnnotations = function() {
  return goog.array.map(this._overlays, function(a) {
    console.log(a);
    return a.annotation
  })
};
annotorious.mediatypes.openseadragon.Viewer.prototype.highlightAnnotation = function() {
};
annotorious.mediatypes.openseadragon.Viewer.prototype.destroy = function() {
  var a = this;
  goog.array.forEach(this._overlays, function(c) {
    a._osdViewer.removeOverlay(c.outer)
  });
  this._overlays = []
};
annotorious.mediatypes.openseadragon.OpenSeadragonAnnotator = function(a) {
  annotorious.mediatypes.Annotator.call();
  this.element = a.element;
  goog.style.setStyle(goog.dom.getElementByClass("openseadragon-container"), "z-index", 0);
  this._osdViewer = a;
  this._eventBroker = new annotorious.events.EventBroker;
  this._selectors = [];
  this._selectionEnabled = !0;
  this._secondaryHint = goog.soy.renderAsElement(annotorious.templates.openlayers.secondaryHint, {msg:"Click and Drag"});
  goog.style.setOpacity(this._secondaryHint, 0);
  goog.dom.appendChild(this.element, this._secondaryHint);
  this.popup = new annotorious.Popup(this);
  this._viewer = new annotorious.mediatypes.openseadragon.Viewer(a, this);
  this._editCanvas = goog.soy.renderAsElement(annotorious.templates.image.canvas, {width:"0", height:"0"});
  goog.style.showElement(this._editCanvas, !1);
  goog.dom.appendChild(this.element, this._editCanvas);
  var c = this, a = parseInt(goog.style.getComputedStyle(c.element, "width"), 10), d = parseInt(goog.style.getComputedStyle(c.element, "height"), 10);
  goog.style.setSize(c._editCanvas, a, d);
  c._editCanvas.width = a;
  c._editCanvas.height = d;
  a = new annotorious.plugins.selection.RectDragSelector;
  a.init(this, this._editCanvas);
  this._selectors.push(a);
  this._currentSelector = a;
  this.editor = new annotorious.Editor(this);
  this._attachListener(this._editCanvas);
  this._eventBroker.addHandler(annotorious.events.EventType.SELECTION_COMPLETED, function(a) {
    a = a.viewportBounds;
    c.editor.setPosition(new annotorious.shape.geom.Point(a.left, a.bottom + 4));
    c.editor.open()
  });
  this._eventBroker.addHandler(annotorious.events.EventType.SELECTION_CANCELED, function() {
    c.stopSelection()
  })
};
goog.inherits(annotorious.mediatypes.openseadragon.OpenSeadragonAnnotator, annotorious.mediatypes.Annotator);
annotorious.mediatypes.openseadragon.OpenSeadragonAnnotator.prototype.showSelectionWidget = function() {
};
annotorious.mediatypes.openseadragon.OpenSeadragonAnnotator.prototype.hideSelectionWidget = function() {
};
annotorious.mediatypes.openseadragon.OpenSeadragonAnnotator.prototype.destroy = function() {
  this._viewer.destroy();
  delete this._viewer
};
annotorious.mediatypes.openseadragon.OpenSeadragonAnnotator.prototype.activateSelector = function(a) {
  goog.style.setStyle(this._editCanvas, "pointer-events", "auto");
  var c = this;
  goog.style.showElement(this._editCanvas, !0);
  goog.style.setOpacity(this._secondaryHint, 0.8);
  window.setTimeout(function() {
    goog.style.setOpacity(c._secondaryHint, 0)
  }, 2E3);
  a && (this._stop_selection_callback = a)
};
annotorious.mediatypes.openseadragon.OpenSeadragonAnnotator.prototype.editAnnotation = function(a) {
  this._viewer.removeAnnotation(a);
  var c = this._currentSelector, d = this;
  if(c) {
    goog.style.showElement(this._editCanvas, !0);
    this._viewer.highlightAnnotation(void 0);
    var e = this._editCanvas.getContext("2d"), f = annotorious.shape.transform(a.shapes[0], function(a) {
      return d.fromItemCoordinates(a)
    });
    c.drawShape(e, f);
    c = annotorious.shape.getBoundingRect(f).geometry;
    this.editor.setPosition(new annotorious.shape.geom.Point(c.x, c.y + c.height + 4));
    this.editor.open(a)
  }
};
annotorious.mediatypes.openseadragon.OpenSeadragonAnnotator.prototype.fromItemCoordinates = function(a) {
  var c = annotorious.dom.getOffset(this.element);
  c.top += window.pageYOffset;
  c.left += window.pageXOffset;
  var d = new OpenSeadragon.Point(a.x, a.y), a = a.width ? new OpenSeadragon.Point(a.x + a.width, a.y + a.height) : !1, d = this._osdViewer.viewport.viewportToWindowCoordinates(d);
  return a ? (a = this._osdViewer.viewport.viewportToWindowCoordinates(a), {x:d.x - c.left, y:d.y - c.top, width:a.x - d.x + 2, height:a.y - d.y + 2}) : d
};
annotorious.mediatypes.openseadragon.OpenSeadragonAnnotator.prototype.getAnnotations = function() {
  return this._viewer.getAnnotations()
};
annotorious.mediatypes.openseadragon.OpenSeadragonAnnotator.prototype.getAvailableSelectors = function() {
};
annotorious.mediatypes.openseadragon.OpenSeadragonAnnotator.prototype.getItem = function() {
  return{src:"dzi://openseadragon/something"}
};
annotorious.mediatypes.openseadragon.OpenSeadragonAnnotator.prototype.setActiveSelector = function() {
};
annotorious.mediatypes.openseadragon.OpenSeadragonAnnotator.prototype.getActiveSelector = function() {
  return this._currentSelector
};
annotorious.mediatypes.openseadragon.OpenSeadragonAnnotator.prototype.toItemCoordinates = function(a) {
  var c = annotorious.dom.getOffset(this.element);
  c.top += window.pageYOffset;
  c.left += window.pageXOffset;
  var d = new OpenSeadragon.Point(a.x + c.left, a.y + c.top), a = a.width ? new OpenSeadragon.Point(a.x + c.left + a.width - 2, a.y + c.top + a.height - 2) : !1, d = this._osdViewer.viewport.windowToViewportCoordinates(d);
  return a ? (a = this._osdViewer.viewport.windowToViewportCoordinates(a), {x:d.x, y:d.y, width:a.x - d.x, height:a.y - d.y}) : d
};
annotorious.mediatypes.openseadragon.OpenSeadragonModule = function() {
  annotorious.mediatypes.Module.call();
  this._initFields()
};
goog.inherits(annotorious.mediatypes.openseadragon.OpenSeadragonModule, annotorious.mediatypes.Module);
annotorious.mediatypes.openseadragon.OpenSeadragonModule.prototype.getItemURL = function() {
  return"dzi://openseadragon/something"
};
annotorious.mediatypes.openseadragon.OpenSeadragonModule.prototype.newAnnotator = function(a) {
  return new annotorious.mediatypes.openseadragon.OpenSeadragonAnnotator(a)
};
annotorious.mediatypes.openseadragon.OpenSeadragonModule.prototype.supports = function(a) {
  return!a.id || 0 != a.id.indexOf("openseadragon") || !a.hasOwnProperty("drawer") ? !1 : !0
};
annotorious.Annotorious = function() {
  this._isInitialized = !1;
  this._modules = [new annotorious.mediatypes.image.ImageModule];
  window.OpenLayers && this._modules.push(new annotorious.mediatypes.openlayers.OpenLayersModule);
  window.OpenSeadragon && this._modules.push(new annotorious.mediatypes.openseadragon.OpenSeadragonModule);
  this._plugins = [];
  var a = this;
  annotorious.dom.addOnLoadHandler(function() {
    a._init()
  })
};
annotorious.Annotorious.prototype._init = function() {
  if(!this._isInitialized) {
    var a = this;
    goog.array.forEach(this._modules, function(a) {
      a.init()
    });
    goog.array.forEach(this._plugins, function(c) {
      c.initPlugin && c.initPlugin(a);
      goog.array.forEach(a._modules, function(a) {
        a.addPlugin(c)
      })
    });
    this._isInitialized = !0
  }
};
annotorious.Annotorious.prototype._getModuleForItemSrc = function(a) {
  return goog.array.find(this._modules, function(c) {
    return c.annotatesItem(a)
  })
};
annotorious.Annotorious.prototype.activateSelector = function(a, c) {
  var d = void 0, e = void 0;
  goog.isString(a) ? (d = a, e = c) : goog.isFunction(a) && (e = a);
  if(d) {
    var f = this._getModuleForItemSrc(d);
    f && f.activateSelector(d, e)
  }else {
    goog.array.forEach(this._modules, function(a) {
      a.activateSelector(e)
    })
  }
};
annotorious.Annotorious.prototype.addAnnotation = function(a, c) {
  a.src = annotorious.dom.toAbsoluteURL(a.src);
  var d = this._getModuleForItemSrc(a.src);
  d && d.addAnnotation(a, c)
};
annotorious.Annotorious.prototype.addHandler = function(a, c) {
  goog.array.forEach(this._modules, function(d) {
    d.addHandler(a, c)
  })
};
annotorious.Annotorious.prototype.addPlugin = function(a, c) {
  try {
    var d = new window.annotorious.plugin[a](c);
    "complete" == document.readyState ? (d.initPlugin && d.initPlugin(this), goog.array.forEach(this._modules, function(a) {
      a.addPlugin(d)
    })) : this._plugins.push(d)
  }catch(e) {
    console.log("Could not load plugin: " + a)
  }
};
annotorious.Annotorious.prototype.destroy = function(a) {
  if(a) {
    var c = this._getModuleForItemSrc(a);
    c && c.destroy(a)
  }else {
    goog.array.forEach(this._modules, function(a) {
      a.destroy()
    })
  }
};
annotorious.Annotorious.prototype.getActiveSelector = function(a) {
  var c = this._getModuleForItemSrc(a);
  if(c) {
    return c.getActiveSelector(a)
  }
};
annotorious.Annotorious.prototype.getAnnotations = function(a) {
  if(a) {
    var c = this._getModuleForItemSrc(a);
    return c ? c.getAnnotations(a) : []
  }
  var d = [];
  goog.array.forEach(this._modules, function(a) {
    goog.array.extend(d, a.getAnnotations())
  });
  return d
};
annotorious.Annotorious.prototype.getAvailableSelectors = function(a) {
  var c = this._getModuleForItemSrc(a);
  return c ? c.getAvailableSelectors(a) : []
};
annotorious.Annotorious.prototype.hideAnnotations = function(a) {
  if(a) {
    var c = this._getModuleForItemSrc(a);
    c && c.hideAnnotations(a)
  }else {
    goog.array.forEach(this._modules, function(a) {
      a.hideAnnotations()
    })
  }
};
annotorious.Annotorious.prototype.hideSelectionWidget = function(a) {
  if(a) {
    var c = this._getModuleForItemSrc(a);
    c && c.hideSelectionWidget(a)
  }else {
    goog.array.forEach(this._modules, function(a) {
      a.hideSelectionWidget()
    })
  }
};
annotorious.Annotorious.prototype.highlightAnnotation = function(a) {
  if(a) {
    var c = this._getModuleForItemSrc(a.src);
    c && c.highlightAnnotation(a)
  }else {
    goog.array.forEach(this._modules, function(a) {
      a.highlightAnnotation()
    })
  }
};
annotorious.Annotorious.prototype.makeAnnotatable = function(a) {
  this._init();
  var c = goog.array.find(this._modules, function(c) {
    return c.supports(a)
  });
  if(c) {
    c.makeAnnotatable(a)
  }else {
    throw"Error: Annotorious does not support this media type in the current version or build configuration.";
  }
};
annotorious.Annotorious.prototype.removeAll = function(a) {
  var c = this;
  goog.array.forEach(this.getAnnotations(a), function(a) {
    c.removeAnnotation(a)
  })
};
annotorious.Annotorious.prototype.removeAnnotation = function(a) {
  var c = this._getModuleForItemSrc(a.src);
  c && c.removeAnnotation(a)
};
annotorious.Annotorious.prototype.removeCurrentSelection = function(a) {
  var c = void 0;
  goog.isString(a) && (c = a);
  c && (c = this._getModuleForItemSrc(c)) && c.removeCurrentSelection(a)
};
annotorious.Annotorious.prototype.reset = function() {
  goog.array.forEach(this._modules, function(a) {
    a.destroy();
    a.init()
  })
};
annotorious.Annotorious.prototype.setActiveSelector = function(a, c) {
  var d = this._getModuleForItemSrc(a);
  d && d.setActiveSelector(a, c)
};
annotorious.Annotorious.prototype.setProperties = function(a) {
  goog.array.forEach(this._modules, function(c) {
    c.setProperties(a)
  })
};
annotorious.Annotorious.prototype.redrawGlow = function(a, c) {
  if(a) {
    var d = this._getModuleForItemSrc(a);
    d && d.redrawGlow(a, c)
  }
};
annotorious.Annotorious.prototype.setSelectionEnabled = function(a) {
  a ? this.showSelectionWidget(void 0) : this.hideSelectionWidget(void 0)
};
annotorious.Annotorious.prototype.showAnnotations = function(a) {
  if(a) {
    var c = this._getModuleForItemSrc(a);
    c && c.showAnnotations(a)
  }else {
    goog.array.forEach(this._modules, function(a) {
      a.showAnnotations()
    })
  }
};
annotorious.Annotorious.prototype.showSelectionWidget = function(a) {
  if(a) {
    var c = this._getModuleForItemSrc(a);
    c && c.showSelectionWidget(a)
  }else {
    goog.array.forEach(this._modules, function(a) {
      a.showSelectionWidget()
    })
  }
};
window.anno = new annotorious.Annotorious;
annotorious.Annotorious.prototype.activateSelector = annotorious.Annotorious.prototype.activateSelector;
annotorious.Annotorious.prototype.addAnnotation = annotorious.Annotorious.prototype.addAnnotation;
annotorious.Annotorious.prototype.addHandler = annotorious.Annotorious.prototype.addHandler;
annotorious.Annotorious.prototype.addPlugin = annotorious.Annotorious.prototype.addPlugin;
annotorious.Annotorious.prototype.destroy = annotorious.Annotorious.prototype.destroy;
annotorious.Annotorious.prototype.getActiveSelector = annotorious.Annotorious.prototype.getActiveSelector;
annotorious.Annotorious.prototype.getAnnotations = annotorious.Annotorious.prototype.getAnnotations;
annotorious.Annotorious.prototype.getAvailableSelectors = annotorious.Annotorious.prototype.getAvailableSelectors;
annotorious.Annotorious.prototype.hideAnnotations = annotorious.Annotorious.prototype.hideAnnotations;
annotorious.Annotorious.prototype.hideSelectionWidget = annotorious.Annotorious.prototype.hideSelectionWidget;
annotorious.Annotorious.prototype.highlightAnnotation = annotorious.Annotorious.prototype.highlightAnnotation;
annotorious.Annotorious.prototype.makeAnnotatable = annotorious.Annotorious.prototype.makeAnnotatable;
annotorious.Annotorious.prototype.removeAll = annotorious.Annotorious.prototype.removeAll;
annotorious.Annotorious.prototype.removeAnnotation = annotorious.Annotorious.prototype.removeAnnotation;
annotorious.Annotorious.prototype.removeCurrentSelection = annotorious.Annotorious.prototype.removeCurrentSelection;
annotorious.Annotorious.prototype.reset = annotorious.Annotorious.prototype.reset;
annotorious.Annotorious.prototype.setActiveSelector = annotorious.Annotorious.prototype.setActiveSelector;
annotorious.Annotorious.prototype.setProperties = annotorious.Annotorious.prototype.setProperties;
annotorious.Annotorious.prototype.showAnnotations = annotorious.Annotorious.prototype.showAnnotations;
annotorious.Annotorious.prototype.showSelectionWidget = annotorious.Annotorious.prototype.showSelectionWidget;
annotorious.Annotorious.prototype.redrawGlow = annotorious.Annotorious.prototype.redrawGlow;
window.annotorious || (window.annotorious = {});
window.annotorious.plugin || (window.annotorious.plugin = {});
window.annotorious.geometry || (window.annotorious.geometry = {}, window.annotorious.geometry.expand = annotorious.shape.expand, window.annotorious.geometry.getBoundingRect = annotorious.shape.getBoundingRect);
annotorious.Annotorious.prototype.setSelectionEnabled = annotorious.Annotorious.prototype.setSelectionEnabled;

