var COMPILED = false;
var goog = goog || {};
goog.NODE_JS = false;
goog.global = goog.NODE_JS ? eval("global") : this;
goog.DEBUG = true;
goog.LOCALE = "en";
goog.provide = function(name) {
  if(!COMPILED) {
    if(goog.isProvided_(name)) {
      throw Error('Namespace "' + name + '" already declared.');
    }
    delete goog.implicitNamespaces_[name];
    var namespace = name;
    while(namespace = namespace.substring(0, namespace.lastIndexOf("."))) {
      if(goog.getObjectByName(namespace)) {
        break
      }
      goog.implicitNamespaces_[namespace] = true
    }
  }
  goog.exportPath_(name)
};
goog.setTestOnly = function(opt_message) {
  if(COMPILED && !goog.DEBUG) {
    opt_message = opt_message || "";
    throw Error("Importing test-only code into non-debug environment" + opt_message ? ": " + opt_message : ".");
  }
};
if(!COMPILED) {
  goog.isProvided_ = function(name) {
    return!goog.implicitNamespaces_[name] && !!goog.getObjectByName(name)
  };
  goog.implicitNamespaces_ = {}
}
goog.isExistingGlobalVariable_ = function(goog) {
  return String(eval("typeof " + goog)) !== "undefined"
};
goog.exportPath_ = function(name, opt_object, opt_objectToExportTo) {
  var parts = name.split(".");
  var cur = opt_objectToExportTo || goog.global;
  if(!(parts[0] in cur) && cur.execScript) {
    cur.execScript("var " + parts[0])
  }
  if(goog.NODE_JS && cur === goog.global) {
    if(goog.isExistingGlobalVariable_(parts[0])) {
      cur = eval(parts[0]);
      parts.shift()
    }
  }
  for(var part;parts.length && (part = parts.shift());) {
    if(!parts.length && goog.isDef(opt_object)) {
      cur[part] = opt_object
    }else {
      if(cur[part]) {
        cur = cur[part]
      }else {
        cur = cur[part] = {}
      }
    }
  }
};
goog.getObjectByName = function(name, opt_obj) {
  var parts = name.split(".");
  var cur = opt_obj || goog.global;
  if(goog.NODE_JS && cur === goog.global) {
    if(goog.isExistingGlobalVariable_(parts[0])) {
      cur = eval(parts[0]);
      parts.shift()
    }
  }
  for(var part;part = parts.shift();) {
    if(goog.isDefAndNotNull(cur[part])) {
      cur = cur[part]
    }else {
      return null
    }
  }
  return cur
};
goog.globalize = function(obj, opt_global) {
  var global = opt_global || goog.global;
  for(var x in obj) {
    global[x] = obj[x]
  }
};
goog.addDependency = function(relPath, provides, requires) {
  if(!COMPILED) {
    var provide, require;
    var path = relPath.replace(/\\/g, "/");
    var deps = goog.dependencies_;
    for(var i = 0;provide = provides[i];i++) {
      deps.nameToPath[provide] = path;
      if(!(path in deps.pathToNames)) {
        deps.pathToNames[path] = {}
      }
      deps.pathToNames[path][provide] = true
    }
    for(var j = 0;require = requires[j];j++) {
      if(!(path in deps.requires)) {
        deps.requires[path] = {}
      }
      deps.requires[path][require] = true
    }
  }
};
goog.ENABLE_DEBUG_LOADER = true;
goog.require = function(name) {
  if(!COMPILED) {
    if(goog.isProvided_(name)) {
      return
    }
    if(goog.ENABLE_DEBUG_LOADER) {
      var path = goog.getPathFromDeps_(name);
      if(path) {
        goog.included_[path] = true;
        goog.writeScripts_();
        return
      }
    }
    var errorMessage = "goog.require could not find: " + name;
    if(goog.global.console) {
      goog.global.console["error"](errorMessage)
    }
    throw Error(errorMessage);
  }
};
goog.basePath = "";
goog.global.CLOSURE_BASE_PATH;
goog.global.CLOSURE_NO_DEPS;
goog.global.CLOSURE_IMPORT_SCRIPT;
goog.nullFunction = function() {
};
goog.identityFunction = function(opt_returnValue, var_args) {
  return opt_returnValue
};
goog.abstractMethod = function() {
  throw Error("unimplemented abstract method");
};
goog.addSingletonGetter = function(ctor) {
  ctor.getInstance = function() {
    if(ctor.instance_) {
      return ctor.instance_
    }
    if(goog.DEBUG) {
      goog.instantiatedSingletons_[goog.instantiatedSingletons_.length] = ctor
    }
    return ctor.instance_ = new ctor
  }
};
goog.instantiatedSingletons_ = [];
if(!COMPILED && goog.ENABLE_DEBUG_LOADER) {
  goog.included_ = {};
  goog.dependencies_ = {pathToNames:{}, nameToPath:{}, requires:{}, visited:{}, written:{}};
  goog.inHtmlDocument_ = function() {
    var doc = goog.global.document;
    return typeof doc != "undefined" && "write" in doc
  };
  goog.findBasePath_ = function() {
    if(goog.global.CLOSURE_BASE_PATH) {
      goog.basePath = goog.global.CLOSURE_BASE_PATH;
      return
    }else {
      if(!goog.inHtmlDocument_()) {
        return
      }
    }
    var doc = goog.global.document;
    var scripts = doc.getElementsByTagName("script");
    for(var i = scripts.length - 1;i >= 0;--i) {
      var src = scripts[i].src;
      var qmark = src.lastIndexOf("?");
      var l = qmark == -1 ? src.length : qmark;
      if(src.substr(l - 7, 7) == "base.js") {
        goog.basePath = src.substr(0, l - 7);
        return
      }
    }
  };
  goog.importScript_ = function(src) {
    var importScript = goog.global.CLOSURE_IMPORT_SCRIPT || goog.writeScriptTag_;
    if(!goog.dependencies_.written[src] && importScript(src)) {
      goog.dependencies_.written[src] = true
    }
  };
  goog.writeScriptTag_ = function(src) {
    if(goog.inHtmlDocument_()) {
      var doc = goog.global.document;
      doc.write('<script type="text/javascript" src="' + src + '"></' + "script>");
      return true
    }else {
      return false
    }
  };
  goog.writeScripts_ = function() {
    var scripts = [];
    var seenScript = {};
    var deps = goog.dependencies_;
    function visitNode(path) {
      if(path in deps.written) {
        return
      }
      if(path in deps.visited) {
        if(!(path in seenScript)) {
          seenScript[path] = true;
          scripts.push(path)
        }
        return
      }
      deps.visited[path] = true;
      if(path in deps.requires) {
        for(var requireName in deps.requires[path]) {
          if(!goog.isProvided_(requireName)) {
            if(requireName in deps.nameToPath) {
              visitNode(deps.nameToPath[requireName])
            }else {
              throw Error("Undefined nameToPath for " + requireName);
            }
          }
        }
      }
      if(!(path in seenScript)) {
        seenScript[path] = true;
        scripts.push(path)
      }
    }
    for(var path in goog.included_) {
      if(!deps.written[path]) {
        visitNode(path)
      }
    }
    for(var i = 0;i < scripts.length;i++) {
      if(scripts[i]) {
        goog.importScript_(goog.basePath + scripts[i])
      }else {
        throw Error("Undefined script input");
      }
    }
  };
  goog.getPathFromDeps_ = function(rule) {
    if(rule in goog.dependencies_.nameToPath) {
      return goog.dependencies_.nameToPath[rule]
    }else {
      return null
    }
  };
  goog.findBasePath_();
  if(!goog.global.CLOSURE_NO_DEPS) {
    goog.importScript_(goog.basePath + "deps.js")
  }
}
goog.typeOf = function(value) {
  var s = typeof value;
  if(s == "object") {
    if(value) {
      if(value instanceof Array) {
        return"array"
      }else {
        if(value instanceof Object) {
          return s
        }
      }
      var className = Object.prototype.toString.call(value);
      if(className == "[object Window]") {
        return"object"
      }
      if(className == "[object Array]" || typeof value.length == "number" && typeof value.splice != "undefined" && typeof value.propertyIsEnumerable != "undefined" && !value.propertyIsEnumerable("splice")) {
        return"array"
      }
      if(className == "[object Function]" || typeof value.call != "undefined" && typeof value.propertyIsEnumerable != "undefined" && !value.propertyIsEnumerable("call")) {
        return"function"
      }
    }else {
      return"null"
    }
  }else {
    if(s == "function" && typeof value.call == "undefined") {
      return"object"
    }
  }
  return s
};
goog.isDef = function(val) {
  return val !== undefined
};
goog.isNull = function(val) {
  return val === null
};
goog.isDefAndNotNull = function(val) {
  return val != null
};
goog.isArray = function(val) {
  return goog.typeOf(val) == "array"
};
goog.isArrayLike = function(val) {
  var type = goog.typeOf(val);
  return type == "array" || type == "object" && typeof val.length == "number"
};
goog.isDateLike = function(val) {
  return goog.isObject(val) && typeof val.getFullYear == "function"
};
goog.isString = function(val) {
  return typeof val == "string"
};
goog.isBoolean = function(val) {
  return typeof val == "boolean"
};
goog.isNumber = function(val) {
  return typeof val == "number"
};
goog.isFunction = function(val) {
  return goog.typeOf(val) == "function"
};
goog.isObject = function(val) {
  var type = typeof val;
  return type == "object" && val != null || type == "function"
};
goog.getUid = function(obj) {
  return obj[goog.UID_PROPERTY_] || (obj[goog.UID_PROPERTY_] = ++goog.uidCounter_)
};
goog.removeUid = function(obj) {
  if("removeAttribute" in obj) {
    obj.removeAttribute(goog.UID_PROPERTY_)
  }
  try {
    delete obj[goog.UID_PROPERTY_]
  }catch(ex) {
  }
};
goog.UID_PROPERTY_ = "closure_uid_" + Math.floor(Math.random() * 2147483648).toString(36);
goog.uidCounter_ = 0;
goog.getHashCode = goog.getUid;
goog.removeHashCode = goog.removeUid;
goog.cloneObject = function(obj) {
  var type = goog.typeOf(obj);
  if(type == "object" || type == "array") {
    if(obj.clone) {
      return obj.clone()
    }
    var clone = type == "array" ? [] : {};
    for(var key in obj) {
      clone[key] = goog.cloneObject(obj[key])
    }
    return clone
  }
  return obj
};
goog.bindNative_ = function(fn, selfObj, var_args) {
  return fn.call.apply(fn.bind, arguments)
};
goog.bindJs_ = function(fn, selfObj, var_args) {
  if(!fn) {
    throw new Error;
  }
  if(arguments.length > 2) {
    var boundArgs = Array.prototype.slice.call(arguments, 2);
    return function() {
      var newArgs = Array.prototype.slice.call(arguments);
      Array.prototype.unshift.apply(newArgs, boundArgs);
      return fn.apply(selfObj, newArgs)
    }
  }else {
    return function() {
      return fn.apply(selfObj, arguments)
    }
  }
};
goog.bind = function(fn, selfObj, var_args) {
  if(Function.prototype.bind && Function.prototype.bind.toString().indexOf("native code") != -1) {
    goog.bind = goog.bindNative_
  }else {
    goog.bind = goog.bindJs_
  }
  return goog.bind.apply(null, arguments)
};
goog.partial = function(fn, var_args) {
  var args = Array.prototype.slice.call(arguments, 1);
  return function() {
    var newArgs = Array.prototype.slice.call(arguments);
    newArgs.unshift.apply(newArgs, args);
    return fn.apply(this, newArgs)
  }
};
goog.mixin = function(target, source) {
  for(var x in source) {
    target[x] = source[x]
  }
};
goog.now = Date.now || function() {
  return+new Date
};
goog.globalEval = function(script) {
  if(goog.global.execScript) {
    goog.global.execScript(script, "JavaScript")
  }else {
    if(goog.global.eval) {
      if(goog.evalWorksForGlobals_ == null) {
        goog.global.eval("var _et_ = 1;");
        if(typeof goog.global["_et_"] != "undefined") {
          delete goog.global["_et_"];
          goog.evalWorksForGlobals_ = true
        }else {
          goog.evalWorksForGlobals_ = false
        }
      }
      if(goog.evalWorksForGlobals_) {
        goog.global.eval(script)
      }else {
        var doc = goog.global.document;
        var scriptElt = doc.createElement("script");
        scriptElt.type = "text/javascript";
        scriptElt.defer = false;
        scriptElt.appendChild(doc.createTextNode(script));
        doc.body.appendChild(scriptElt);
        doc.body.removeChild(scriptElt)
      }
    }else {
      throw Error("goog.globalEval not available");
    }
  }
};
goog.evalWorksForGlobals_ = null;
goog.cssNameMapping_;
goog.cssNameMappingStyle_;
goog.getCssName = function(className, opt_modifier) {
  var getMapping = function(cssName) {
    return goog.cssNameMapping_[cssName] || cssName
  };
  var renameByParts = function(cssName) {
    var parts = cssName.split("-");
    var mapped = [];
    for(var i = 0;i < parts.length;i++) {
      mapped.push(getMapping(parts[i]))
    }
    return mapped.join("-")
  };
  var rename;
  if(goog.cssNameMapping_) {
    rename = goog.cssNameMappingStyle_ == "BY_WHOLE" ? getMapping : renameByParts
  }else {
    rename = function(a) {
      return a
    }
  }
  if(opt_modifier) {
    return className + "-" + rename(opt_modifier)
  }else {
    return rename(className)
  }
};
goog.setCssNameMapping = function(mapping, opt_style) {
  goog.cssNameMapping_ = mapping;
  goog.cssNameMappingStyle_ = opt_style
};
goog.global.CLOSURE_CSS_NAME_MAPPING;
if(!COMPILED && goog.global.CLOSURE_CSS_NAME_MAPPING) {
  goog.cssNameMapping_ = goog.global.CLOSURE_CSS_NAME_MAPPING
}
goog.getMsg = function(str, opt_values) {
  var values = opt_values || {};
  for(var key in values) {
    var value = ("" + values[key]).replace(/\$/g, "$$$$");
    str = str.replace(new RegExp("\\{\\$" + key + "\\}", "gi"), value)
  }
  return str
};
goog.exportSymbol = function(publicPath, object, opt_objectToExportTo) {
  goog.exportPath_(publicPath, object, opt_objectToExportTo)
};
goog.exportProperty = function(object, publicName, symbol) {
  object[publicName] = symbol
};
goog.inherits = function(childCtor, parentCtor) {
  function tempCtor() {
  }
  tempCtor.prototype = parentCtor.prototype;
  childCtor.superClass_ = parentCtor.prototype;
  childCtor.prototype = new tempCtor;
  childCtor.prototype.constructor = childCtor
};
goog.base = function(me, opt_methodName, var_args) {
  var caller = arguments.callee.caller;
  if(caller.superClass_) {
    return caller.superClass_.constructor.apply(me, Array.prototype.slice.call(arguments, 1))
  }
  var args = Array.prototype.slice.call(arguments, 2);
  var foundCaller = false;
  for(var ctor = me.constructor;ctor;ctor = ctor.superClass_ && ctor.superClass_.constructor) {
    if(ctor.prototype[opt_methodName] === caller) {
      foundCaller = true
    }else {
      if(foundCaller) {
        return ctor.prototype[opt_methodName].apply(me, args)
      }
    }
  }
  if(me[opt_methodName] === caller) {
    return me.constructor.prototype[opt_methodName].apply(me, args)
  }else {
    throw Error("goog.base called from a method of one name " + "to a method of a different name");
  }
};
goog.scope = function(fn) {
  fn.call(goog.global)
};
goog.addDependency("/closure/goog/array/array.js", ["goog.array", "goog.array.ArrayLike"], ["goog.asserts"]);
goog.addDependency("/closure/goog/asserts/asserts.js", ["goog.asserts", "goog.asserts.AssertionError"], ["goog.debug.Error", "goog.string"]);
goog.addDependency("/closure/goog/async/animationdelay.js", ["goog.async.AnimationDelay"], ["goog.async.Delay", "goog.functions"]);
goog.addDependency("/closure/goog/async/conditionaldelay.js", ["goog.async.ConditionalDelay"], ["goog.Disposable", "goog.async.Delay"]);
goog.addDependency("/closure/goog/async/delay.js", ["goog.Delay", "goog.async.Delay"], ["goog.Disposable", "goog.Timer"]);
goog.addDependency("/closure/goog/async/throttle.js", ["goog.Throttle", "goog.async.Throttle"], ["goog.Disposable", "goog.Timer"]);
goog.addDependency("/closure/goog/base.js", [], []);
goog.addDependency("/closure/goog/bootstrap/webworkers.js", [], []);
goog.addDependency("/closure/goog/color/alpha.js", ["goog.color.alpha"], ["goog.color"]);
goog.addDependency("/closure/goog/color/color.js", ["goog.color"], ["goog.color.names", "goog.math"]);
goog.addDependency("/closure/goog/color/names.js", ["goog.color.names"], []);
goog.addDependency("/closure/goog/crypt/arc4.js", ["goog.crypt.Arc4"], ["goog.asserts"]);
goog.addDependency("/closure/goog/crypt/base64.js", ["goog.crypt.base64"], ["goog.crypt", "goog.userAgent"]);
goog.addDependency("/closure/goog/crypt/basen.js", ["goog.crypt.baseN"], []);
goog.addDependency("/closure/goog/crypt/blobhasher.js", ["goog.crypt.BlobHasher", "goog.crypt.BlobHasher.EventType"], ["goog.asserts", "goog.crypt", "goog.crypt.Hash", "goog.debug.Logger", "goog.events.EventTarget", "goog.fs"]);
goog.addDependency("/closure/goog/crypt/crypt.js", ["goog.crypt"], ["goog.array"]);
goog.addDependency("/closure/goog/crypt/hash.js", ["goog.crypt.Hash"], []);
goog.addDependency("/closure/goog/crypt/hash32.js", ["goog.crypt.hash32"], ["goog.crypt"]);
goog.addDependency("/closure/goog/crypt/hash_test.js", ["goog.crypt.hash_test"], ["goog.testing.asserts"]);
goog.addDependency("/closure/goog/crypt/hmac.js", ["goog.crypt.Hmac"], ["goog.asserts", "goog.crypt.Hash"]);
goog.addDependency("/closure/goog/crypt/md5.js", ["goog.crypt.Md5"], ["goog.crypt.Hash"]);
goog.addDependency("/closure/goog/crypt/sha1.js", ["goog.crypt.Sha1"], ["goog.crypt.Hash"]);
goog.addDependency("/closure/goog/cssom/cssom.js", ["goog.cssom", "goog.cssom.CssRuleType"], ["goog.array", "goog.dom"]);
goog.addDependency("/closure/goog/cssom/iframe/style.js", ["goog.cssom.iframe.style"], ["goog.cssom", "goog.dom", "goog.dom.NodeType", "goog.dom.classes", "goog.string", "goog.style", "goog.userAgent"]);
goog.addDependency("/closure/goog/datasource/datamanager.js", ["goog.ds.DataManager"], ["goog.ds.BasicNodeList", "goog.ds.DataNode", "goog.ds.Expr", "goog.string", "goog.structs", "goog.structs.Map"]);
goog.addDependency("/closure/goog/datasource/datasource.js", ["goog.ds.BaseDataNode", "goog.ds.BasicNodeList", "goog.ds.DataNode", "goog.ds.DataNodeList", "goog.ds.EmptyNodeList", "goog.ds.LoadState", "goog.ds.SortedNodeList", "goog.ds.Util", "goog.ds.logger"], ["goog.array", "goog.debug.Logger"]);
goog.addDependency("/closure/goog/datasource/expr.js", ["goog.ds.Expr"], ["goog.ds.BasicNodeList", "goog.ds.EmptyNodeList", "goog.string"]);
goog.addDependency("/closure/goog/datasource/fastdatanode.js", ["goog.ds.AbstractFastDataNode", "goog.ds.FastDataNode", "goog.ds.FastListNode", "goog.ds.PrimitiveFastDataNode"], ["goog.ds.DataManager", "goog.ds.EmptyNodeList", "goog.string"]);
goog.addDependency("/closure/goog/datasource/jsdatasource.js", ["goog.ds.JsDataSource", "goog.ds.JsPropertyDataSource"], ["goog.ds.BaseDataNode", "goog.ds.BasicNodeList", "goog.ds.DataManager", "goog.ds.EmptyNodeList", "goog.ds.LoadState"]);
goog.addDependency("/closure/goog/datasource/jsondatasource.js", ["goog.ds.JsonDataSource"], ["goog.Uri", "goog.dom", "goog.ds.DataManager", "goog.ds.JsDataSource", "goog.ds.LoadState", "goog.ds.logger"]);
goog.addDependency("/closure/goog/datasource/jsxmlhttpdatasource.js", ["goog.ds.JsXmlHttpDataSource"], ["goog.Uri", "goog.ds.DataManager", "goog.ds.FastDataNode", "goog.ds.LoadState", "goog.ds.logger", "goog.events", "goog.net.EventType", "goog.net.XhrIo"]);
goog.addDependency("/closure/goog/datasource/xmldatasource.js", ["goog.ds.XmlDataSource", "goog.ds.XmlHttpDataSource"], ["goog.Uri", "goog.dom.NodeType", "goog.dom.xml", "goog.ds.BasicNodeList", "goog.ds.DataManager", "goog.ds.LoadState", "goog.ds.logger", "goog.net.XhrIo", "goog.string"]);
goog.addDependency("/closure/goog/date/date.js", ["goog.date", "goog.date.Date", "goog.date.DateTime", "goog.date.Interval", "goog.date.month", "goog.date.weekDay"], ["goog.asserts", "goog.date.DateLike", "goog.i18n.DateTimeSymbols", "goog.string"]);
goog.addDependency("/closure/goog/date/datelike.js", ["goog.date.DateLike"], []);
goog.addDependency("/closure/goog/date/daterange.js", ["goog.date.DateRange", "goog.date.DateRange.Iterator", "goog.date.DateRange.StandardDateRangeKeys"], ["goog.date.Date", "goog.date.Interval", "goog.iter.Iterator", "goog.iter.StopIteration"]);
goog.addDependency("/closure/goog/date/relative.js", ["goog.date.relative"], ["goog.i18n.DateTimeFormat"]);
goog.addDependency("/closure/goog/date/utcdatetime.js", ["goog.date.UtcDateTime"], ["goog.date", "goog.date.Date", "goog.date.DateTime", "goog.date.Interval"]);
goog.addDependency("/closure/goog/db/cursor.js", ["goog.db.Cursor"], ["goog.async.Deferred", "goog.db.Error", "goog.debug", "goog.events.EventTarget"]);
goog.addDependency("/closure/goog/db/db.js", ["goog.db"], ["goog.async.Deferred", "goog.db.Error", "goog.db.IndexedDb"]);
goog.addDependency("/closure/goog/db/error.js", ["goog.db.Error", "goog.db.Error.ErrorCode", "goog.db.Error.VersionChangeBlockedError"], ["goog.debug.Error"]);
goog.addDependency("/closure/goog/db/index.js", ["goog.db.Index"], ["goog.async.Deferred", "goog.db.Error", "goog.debug"]);
goog.addDependency("/closure/goog/db/indexeddb.js", ["goog.db.IndexedDb"], ["goog.async.Deferred", "goog.db.Error", "goog.db.Error.VersionChangeBlockedError", "goog.db.ObjectStore", "goog.db.Transaction", "goog.db.Transaction.TransactionMode"]);
goog.addDependency("/closure/goog/db/keyrange.js", ["goog.db.KeyRange"], []);
goog.addDependency("/closure/goog/db/objectstore.js", ["goog.db.ObjectStore"], ["goog.async.Deferred", "goog.db.Cursor", "goog.db.Error", "goog.db.Index", "goog.debug", "goog.events"]);
goog.addDependency("/closure/goog/db/transaction.js", ["goog.db.Transaction", "goog.db.Transaction.TransactionMode"], ["goog.db.Error", "goog.db.ObjectStore", "goog.events.EventHandler", "goog.events.EventTarget"]);
goog.addDependency("/closure/goog/debug/console.js", ["goog.debug.Console"], ["goog.debug.LogManager", "goog.debug.Logger.Level", "goog.debug.TextFormatter"]);
goog.addDependency("/closure/goog/debug/debug.js", ["goog.debug"], ["goog.array", "goog.string", "goog.structs.Set", "goog.userAgent"]);
goog.addDependency("/closure/goog/debug/debugwindow.js", ["goog.debug.DebugWindow"], ["goog.debug.HtmlFormatter", "goog.debug.LogManager", "goog.structs.CircularBuffer", "goog.userAgent"]);
goog.addDependency("/closure/goog/debug/devcss/devcss.js", ["goog.debug.DevCss", "goog.debug.DevCss.UserAgent"], ["goog.cssom", "goog.dom.classes", "goog.events", "goog.events.EventType", "goog.string", "goog.userAgent"]);
goog.addDependency("/closure/goog/debug/devcss/devcssrunner.js", ["goog.debug.devCssRunner"], ["goog.debug.DevCss"]);
goog.addDependency("/closure/goog/debug/divconsole.js", ["goog.debug.DivConsole"], ["goog.debug.HtmlFormatter", "goog.debug.LogManager", "goog.style"]);
goog.addDependency("/closure/goog/debug/entrypointregistry.js", ["goog.debug.EntryPointMonitor", "goog.debug.entryPointRegistry"], ["goog.asserts"]);
goog.addDependency("/closure/goog/debug/error.js", ["goog.debug.Error"], []);
goog.addDependency("/closure/goog/debug/errorhandler.js", ["goog.debug.ErrorHandler", "goog.debug.ErrorHandler.ProtectedFunctionError"], ["goog.asserts", "goog.debug", "goog.debug.EntryPointMonitor", "goog.debug.Trace"]);
goog.addDependency("/closure/goog/debug/errorhandlerweakdep.js", ["goog.debug.errorHandlerWeakDep"], []);
goog.addDependency("/closure/goog/debug/errorreporter.js", ["goog.debug.ErrorReporter", "goog.debug.ErrorReporter.ExceptionEvent"], ["goog.debug", "goog.debug.ErrorHandler", "goog.debug.Logger", "goog.debug.entryPointRegistry", "goog.events", "goog.events.Event", "goog.events.EventTarget", "goog.net.XhrIo", "goog.object", "goog.string", "goog.uri.utils", "goog.userAgent"]);
goog.addDependency("/closure/goog/debug/fancywindow.js", ["goog.debug.FancyWindow"], ["goog.debug.DebugWindow", "goog.debug.LogManager", "goog.debug.Logger", "goog.debug.Logger.Level", "goog.dom.DomHelper", "goog.object", "goog.string", "goog.userAgent"]);
goog.addDependency("/closure/goog/debug/formatter.js", ["goog.debug.Formatter", "goog.debug.HtmlFormatter", "goog.debug.TextFormatter"], ["goog.debug.RelativeTimeProvider", "goog.string"]);
goog.addDependency("/closure/goog/debug/fpsdisplay.js", ["goog.debug.FpsDisplay"], ["goog.asserts", "goog.async.AnimationDelay", "goog.ui.Component"]);
goog.addDependency("/closure/goog/debug/gcdiagnostics.js", ["goog.debug.GcDiagnostics"], ["goog.debug.Logger", "goog.debug.Trace", "goog.userAgent"]);
goog.addDependency("/closure/goog/debug/logbuffer.js", ["goog.debug.LogBuffer"], ["goog.asserts", "goog.debug.LogRecord"]);
goog.addDependency("/closure/goog/debug/logger.js", ["goog.debug.LogManager", "goog.debug.Logger", "goog.debug.Logger.Level"], ["goog.array", "goog.asserts", "goog.debug", "goog.debug.LogBuffer", "goog.debug.LogRecord"]);
goog.addDependency("/closure/goog/debug/logrecord.js", ["goog.debug.LogRecord"], []);
goog.addDependency("/closure/goog/debug/logrecordserializer.js", ["goog.debug.logRecordSerializer"], ["goog.debug.LogRecord", "goog.debug.Logger.Level", "goog.json", "goog.object"]);
goog.addDependency("/closure/goog/debug/reflect.js", ["goog.debug.reflect"], []);
goog.addDependency("/closure/goog/debug/relativetimeprovider.js", ["goog.debug.RelativeTimeProvider"], []);
goog.addDependency("/closure/goog/debug/tracer.js", ["goog.debug.Trace"], ["goog.array", "goog.debug.Logger", "goog.iter", "goog.structs.Map", "goog.structs.SimplePool"]);
goog.addDependency("/closure/goog/demos/autocompleteremotedata.js", [], []);
goog.addDependency("/closure/goog/demos/autocompleterichremotedata.js", [], []);
goog.addDependency("/closure/goog/demos/editor/equationeditor.js", ["goog.demos.editor.EquationEditor"], ["goog.ui.equation.EquationEditorDialog"]);
goog.addDependency("/closure/goog/demos/editor/helloworld.js", ["goog.demos.editor.HelloWorld"], ["goog.dom", "goog.dom.TagName", "goog.editor.Plugin"]);
goog.addDependency("/closure/goog/demos/editor/helloworlddialog.js", ["goog.demos.editor.HelloWorldDialog", "goog.demos.editor.HelloWorldDialog.OkEvent"], ["goog.dom.TagName", "goog.events.Event", "goog.string", "goog.ui.editor.AbstractDialog", "goog.ui.editor.AbstractDialog.Builder", "goog.ui.editor.AbstractDialog.EventType"]);
goog.addDependency("/closure/goog/demos/editor/helloworlddialogplugin.js", ["goog.demos.editor.HelloWorldDialogPlugin", "goog.demos.editor.HelloWorldDialogPlugin.Command"], ["goog.demos.editor.HelloWorldDialog", "goog.dom.TagName", "goog.editor.plugins.AbstractDialogPlugin", "goog.editor.range", "goog.functions", "goog.ui.editor.AbstractDialog.EventType"]);
goog.addDependency("/closure/goog/demos/graphics/tigerdata.js", [], []);
goog.addDependency("/closure/goog/demos/samplecomponent.js", ["goog.demos.SampleComponent"], ["goog.dom", "goog.dom.classes", "goog.events.EventHandler", "goog.events.EventType", "goog.events.KeyCodes", "goog.events.KeyHandler", "goog.events.KeyHandler.EventType", "goog.ui.Component"]);
goog.addDependency("/closure/goog/demos/tree/testdata.js", [], []);
goog.addDependency("/closure/goog/demos/xpc/xpcdemo.js", [], ["goog.Uri", "goog.debug.Logger", "goog.dom", "goog.events", "goog.events.EventType", "goog.json", "goog.net.xpc.CrossPageChannel"]);
goog.addDependency("/closure/goog/disposable/disposable.js", ["goog.Disposable", "goog.dispose"], ["goog.disposable.IDisposable"]);
goog.addDependency("/closure/goog/disposable/idisposable.js", ["goog.disposable.IDisposable"], []);
goog.addDependency("/closure/goog/dom/a11y.js", ["goog.dom.a11y", "goog.dom.a11y.Announcer", "goog.dom.a11y.LivePriority", "goog.dom.a11y.Role", "goog.dom.a11y.State"], ["goog.Disposable", "goog.dom", "goog.object"]);
goog.addDependency("/closure/goog/dom/abstractmultirange.js", ["goog.dom.AbstractMultiRange"], ["goog.array", "goog.dom", "goog.dom.AbstractRange"]);
goog.addDependency("/closure/goog/dom/abstractrange.js", ["goog.dom.AbstractRange", "goog.dom.RangeIterator", "goog.dom.RangeType"], ["goog.dom", "goog.dom.NodeType", "goog.dom.SavedCaretRange", "goog.dom.TagIterator", "goog.userAgent"]);
goog.addDependency("/closure/goog/dom/annotate.js", ["goog.dom.annotate"], ["goog.array", "goog.dom", "goog.dom.NodeType", "goog.string"]);
goog.addDependency("/closure/goog/dom/browserfeature.js", ["goog.dom.BrowserFeature"], ["goog.userAgent"]);
goog.addDependency("/closure/goog/dom/browserrange/abstractrange.js", ["goog.dom.browserrange.AbstractRange"], ["goog.dom", "goog.dom.NodeType", "goog.dom.RangeEndpoint", "goog.dom.TagName", "goog.dom.TextRangeIterator", "goog.iter", "goog.string", "goog.string.StringBuffer", "goog.userAgent"]);
goog.addDependency("/closure/goog/dom/browserrange/browserrange.js", ["goog.dom.browserrange", "goog.dom.browserrange.Error"], ["goog.dom", "goog.dom.browserrange.GeckoRange", "goog.dom.browserrange.IeRange", "goog.dom.browserrange.OperaRange", "goog.dom.browserrange.W3cRange", "goog.dom.browserrange.WebKitRange", "goog.userAgent"]);
goog.addDependency("/closure/goog/dom/browserrange/geckorange.js", ["goog.dom.browserrange.GeckoRange"], ["goog.dom.browserrange.W3cRange"]);
goog.addDependency("/closure/goog/dom/browserrange/ierange.js", ["goog.dom.browserrange.IeRange"], ["goog.array", "goog.debug.Logger", "goog.dom", "goog.dom.NodeIterator", "goog.dom.NodeType", "goog.dom.RangeEndpoint", "goog.dom.TagName", "goog.dom.browserrange.AbstractRange", "goog.iter", "goog.iter.StopIteration", "goog.string"]);
goog.addDependency("/closure/goog/dom/browserrange/operarange.js", ["goog.dom.browserrange.OperaRange"], ["goog.dom.browserrange.W3cRange"]);
goog.addDependency("/closure/goog/dom/browserrange/w3crange.js", ["goog.dom.browserrange.W3cRange"], ["goog.dom", "goog.dom.NodeType", "goog.dom.RangeEndpoint", "goog.dom.browserrange.AbstractRange", "goog.string"]);
goog.addDependency("/closure/goog/dom/browserrange/webkitrange.js", ["goog.dom.browserrange.WebKitRange"], ["goog.dom.RangeEndpoint", "goog.dom.browserrange.W3cRange", "goog.userAgent"]);
goog.addDependency("/closure/goog/dom/classes.js", ["goog.dom.classes"], ["goog.array"]);
goog.addDependency("/closure/goog/dom/classes_test.js", ["goog.dom.classes_test"], ["goog.dom", "goog.dom.classes", "goog.testing.jsunit"]);
goog.addDependency("/closure/goog/dom/controlrange.js", ["goog.dom.ControlRange", "goog.dom.ControlRangeIterator"], ["goog.array", "goog.dom", "goog.dom.AbstractMultiRange", "goog.dom.AbstractRange", "goog.dom.RangeIterator", "goog.dom.RangeType", "goog.dom.SavedRange", "goog.dom.TagWalkType", "goog.dom.TextRange", "goog.iter.StopIteration", "goog.userAgent"]);
goog.addDependency("/closure/goog/dom/dataset.js", ["goog.dom.dataset"], ["goog.string"]);
goog.addDependency("/closure/goog/dom/dom.js", ["goog.dom", "goog.dom.DomHelper", "goog.dom.NodeType"], ["goog.array", "goog.dom.BrowserFeature", "goog.dom.TagName", "goog.dom.classes", "goog.math.Coordinate", "goog.math.Size", "goog.object", "goog.string", "goog.userAgent"]);
goog.addDependency("/closure/goog/dom/dom_test.js", ["goog.dom.dom_test"], ["goog.dom", "goog.dom.DomHelper", "goog.dom.NodeType", "goog.dom.TagName", "goog.object", "goog.testing.asserts", "goog.userAgent", "goog.userAgent.product", "goog.userAgent.product.isVersion"]);
goog.addDependency("/closure/goog/dom/fontsizemonitor.js", ["goog.dom.FontSizeMonitor", "goog.dom.FontSizeMonitor.EventType"], ["goog.dom", "goog.events", "goog.events.EventTarget", "goog.events.EventType", "goog.userAgent"]);
goog.addDependency("/closure/goog/dom/forms.js", ["goog.dom.forms"], ["goog.structs.Map"]);
goog.addDependency("/closure/goog/dom/fullscreen.js", ["goog.dom.fullscreen", "goog.dom.fullscreen.EventType"], ["goog.dom", "goog.userAgent", "goog.userAgent.product"]);
goog.addDependency("/closure/goog/dom/iframe.js", ["goog.dom.iframe"], ["goog.dom"]);
goog.addDependency("/closure/goog/dom/iter.js", ["goog.dom.iter.AncestorIterator", "goog.dom.iter.ChildIterator", "goog.dom.iter.SiblingIterator"], ["goog.iter.Iterator", "goog.iter.StopIteration"]);
goog.addDependency("/closure/goog/dom/multirange.js", ["goog.dom.MultiRange", "goog.dom.MultiRangeIterator"], ["goog.array", "goog.debug.Logger", "goog.dom.AbstractMultiRange", "goog.dom.AbstractRange", "goog.dom.RangeIterator", "goog.dom.RangeType", "goog.dom.SavedRange", "goog.dom.TextRange", "goog.iter.StopIteration"]);
goog.addDependency("/closure/goog/dom/nodeiterator.js", ["goog.dom.NodeIterator"], ["goog.dom.TagIterator"]);
goog.addDependency("/closure/goog/dom/nodeoffset.js", ["goog.dom.NodeOffset"], ["goog.Disposable", "goog.dom.TagName"]);
goog.addDependency("/closure/goog/dom/pattern/abstractpattern.js", ["goog.dom.pattern.AbstractPattern"], ["goog.dom.pattern.MatchType"]);
goog.addDependency("/closure/goog/dom/pattern/allchildren.js", ["goog.dom.pattern.AllChildren"], ["goog.dom.pattern.AbstractPattern", "goog.dom.pattern.MatchType"]);
goog.addDependency("/closure/goog/dom/pattern/callback/callback.js", ["goog.dom.pattern.callback"], ["goog.dom", "goog.dom.TagWalkType", "goog.iter"]);
goog.addDependency("/closure/goog/dom/pattern/callback/counter.js", ["goog.dom.pattern.callback.Counter"], []);
goog.addDependency("/closure/goog/dom/pattern/callback/test.js", ["goog.dom.pattern.callback.Test"], ["goog.iter.StopIteration"]);
goog.addDependency("/closure/goog/dom/pattern/childmatches.js", ["goog.dom.pattern.ChildMatches"], ["goog.dom.pattern.AllChildren", "goog.dom.pattern.MatchType"]);
goog.addDependency("/closure/goog/dom/pattern/endtag.js", ["goog.dom.pattern.EndTag"], ["goog.dom.TagWalkType", "goog.dom.pattern.Tag"]);
goog.addDependency("/closure/goog/dom/pattern/fulltag.js", ["goog.dom.pattern.FullTag"], ["goog.dom.pattern.MatchType", "goog.dom.pattern.StartTag", "goog.dom.pattern.Tag"]);
goog.addDependency("/closure/goog/dom/pattern/matcher.js", ["goog.dom.pattern.Matcher"], ["goog.dom.TagIterator", "goog.dom.pattern.MatchType", "goog.iter"]);
goog.addDependency("/closure/goog/dom/pattern/nodetype.js", ["goog.dom.pattern.NodeType"], ["goog.dom.pattern.AbstractPattern", "goog.dom.pattern.MatchType"]);
goog.addDependency("/closure/goog/dom/pattern/pattern.js", ["goog.dom.pattern", "goog.dom.pattern.MatchType"], []);
goog.addDependency("/closure/goog/dom/pattern/repeat.js", ["goog.dom.pattern.Repeat"], ["goog.dom.NodeType", "goog.dom.pattern.AbstractPattern", "goog.dom.pattern.MatchType"]);
goog.addDependency("/closure/goog/dom/pattern/sequence.js", ["goog.dom.pattern.Sequence"], ["goog.dom.NodeType", "goog.dom.pattern.AbstractPattern", "goog.dom.pattern.MatchType"]);
goog.addDependency("/closure/goog/dom/pattern/starttag.js", ["goog.dom.pattern.StartTag"], ["goog.dom.TagWalkType", "goog.dom.pattern.Tag"]);
goog.addDependency("/closure/goog/dom/pattern/tag.js", ["goog.dom.pattern.Tag"], ["goog.dom.pattern", "goog.dom.pattern.AbstractPattern", "goog.dom.pattern.MatchType", "goog.object"]);
goog.addDependency("/closure/goog/dom/pattern/text.js", ["goog.dom.pattern.Text"], ["goog.dom.NodeType", "goog.dom.pattern", "goog.dom.pattern.AbstractPattern", "goog.dom.pattern.MatchType"]);
goog.addDependency("/closure/goog/dom/range.js", ["goog.dom.Range"], ["goog.dom", "goog.dom.AbstractRange", "goog.dom.ControlRange", "goog.dom.MultiRange", "goog.dom.NodeType", "goog.dom.TextRange", "goog.userAgent"]);
goog.addDependency("/closure/goog/dom/rangeendpoint.js", ["goog.dom.RangeEndpoint"], []);
goog.addDependency("/closure/goog/dom/savedcaretrange.js", ["goog.dom.SavedCaretRange"], ["goog.array", "goog.dom", "goog.dom.SavedRange", "goog.dom.TagName", "goog.string"]);
goog.addDependency("/closure/goog/dom/savedrange.js", ["goog.dom.SavedRange"], ["goog.Disposable", "goog.debug.Logger"]);
goog.addDependency("/closure/goog/dom/selection.js", ["goog.dom.selection"], ["goog.string", "goog.userAgent"]);
goog.addDependency("/closure/goog/dom/tagiterator.js", ["goog.dom.TagIterator", "goog.dom.TagWalkType"], ["goog.dom.NodeType", "goog.iter.Iterator", "goog.iter.StopIteration"]);
goog.addDependency("/closure/goog/dom/tagname.js", ["goog.dom.TagName"], []);
goog.addDependency("/closure/goog/dom/textrange.js", ["goog.dom.TextRange"], ["goog.array", "goog.dom", "goog.dom.AbstractRange", "goog.dom.RangeType", "goog.dom.SavedRange", "goog.dom.TagName", "goog.dom.TextRangeIterator", "goog.dom.browserrange", "goog.string", "goog.userAgent"]);
goog.addDependency("/closure/goog/dom/textrangeiterator.js", ["goog.dom.TextRangeIterator"], ["goog.array", "goog.dom.NodeType", "goog.dom.RangeIterator", "goog.dom.TagName", "goog.iter.StopIteration"]);
goog.addDependency("/closure/goog/dom/viewportsizemonitor.js", ["goog.dom.ViewportSizeMonitor"], ["goog.dom", "goog.events", "goog.events.EventTarget", "goog.events.EventType", "goog.math.Size", "goog.userAgent"]);
goog.addDependency("/closure/goog/dom/xml.js", ["goog.dom.xml"], ["goog.dom", "goog.dom.NodeType"]);
goog.addDependency("/closure/goog/editor/browserfeature.js", ["goog.editor.BrowserFeature"], ["goog.editor.defines", "goog.userAgent", "goog.userAgent.product", "goog.userAgent.product.isVersion"]);
goog.addDependency("/closure/goog/editor/clicktoeditwrapper.js", ["goog.editor.ClickToEditWrapper"], ["goog.Disposable", "goog.asserts", "goog.debug.Logger", "goog.dom", "goog.dom.Range", "goog.dom.TagName", "goog.editor.BrowserFeature", "goog.editor.Command", "goog.editor.Field.EventType", "goog.editor.range", "goog.events.BrowserEvent.MouseButton", "goog.events.EventHandler", "goog.events.EventType"]);
goog.addDependency("/closure/goog/editor/command.js", ["goog.editor.Command"], []);
goog.addDependency("/closure/goog/editor/contenteditablefield.js", ["goog.editor.ContentEditableField"], ["goog.asserts", "goog.debug.Logger", "goog.editor.Field"]);
goog.addDependency("/closure/goog/editor/defines.js", ["goog.editor.defines"], []);
goog.addDependency("/closure/goog/editor/field.js", ["goog.editor.Field", "goog.editor.Field.EventType"], ["goog.array", "goog.async.Delay", "goog.debug.Logger", "goog.dom", "goog.dom.Range", "goog.dom.TagName", "goog.dom.classes", "goog.editor.BrowserFeature", "goog.editor.Command", "goog.editor.Plugin", "goog.editor.icontent", "goog.editor.icontent.FieldFormatInfo", "goog.editor.icontent.FieldStyleInfo", "goog.editor.node", "goog.editor.range", "goog.events", "goog.events.EventHandler", "goog.events.EventTarget", 
"goog.events.EventType", "goog.events.KeyCodes", "goog.functions", "goog.string", "goog.string.Unicode", "goog.style", "goog.userAgent", "goog.userAgent.product"]);
goog.addDependency("/closure/goog/editor/field_test.js", ["goog.editor.field_test"], ["goog.dom.Range", "goog.editor.Field", "goog.editor.Plugin", "goog.editor.Command", "goog.events", "goog.events.KeyCodes", "goog.functions", "goog.testing.LooseMock", "goog.testing.MockClock", "goog.testing.dom", "goog.testing.events", "goog.testing.recordFunction", "goog.userAgent", "goog.userAgent.product"]);
goog.addDependency("/closure/goog/editor/focus.js", ["goog.editor.focus"], ["goog.dom.selection"]);
goog.addDependency("/closure/goog/editor/icontent.js", ["goog.editor.icontent", "goog.editor.icontent.FieldFormatInfo", "goog.editor.icontent.FieldStyleInfo"], ["goog.editor.BrowserFeature", "goog.style", "goog.userAgent"]);
goog.addDependency("/closure/goog/editor/link.js", ["goog.editor.Link"], ["goog.array", "goog.dom", "goog.dom.NodeType", "goog.dom.Range", "goog.editor.BrowserFeature", "goog.editor.Command", "goog.editor.node", "goog.editor.range", "goog.string", "goog.string.Unicode", "goog.uri.utils", "goog.uri.utils.ComponentIndex"]);
goog.addDependency("/closure/goog/editor/node.js", ["goog.editor.node"], ["goog.dom", "goog.dom.NodeType", "goog.dom.TagName", "goog.dom.iter.ChildIterator", "goog.dom.iter.SiblingIterator", "goog.iter", "goog.object", "goog.string", "goog.string.Unicode"]);
goog.addDependency("/closure/goog/editor/plugin.js", ["goog.editor.Plugin"], ["goog.debug.Logger", "goog.editor.Command", "goog.events.EventTarget", "goog.functions", "goog.object", "goog.reflect"]);
goog.addDependency("/closure/goog/editor/plugins/abstractbubbleplugin.js", ["goog.editor.plugins.AbstractBubblePlugin"], ["goog.dom", "goog.dom.NodeType", "goog.dom.Range", "goog.dom.TagName", "goog.editor.Plugin", "goog.editor.style", "goog.events", "goog.events.EventHandler", "goog.events.EventType", "goog.functions", "goog.string.Unicode", "goog.ui.Component.EventType", "goog.ui.editor.Bubble", "goog.userAgent"]);
goog.addDependency("/closure/goog/editor/plugins/abstractdialogplugin.js", ["goog.editor.plugins.AbstractDialogPlugin", "goog.editor.plugins.AbstractDialogPlugin.EventType"], ["goog.dom", "goog.dom.Range", "goog.editor.Field.EventType", "goog.editor.Plugin", "goog.editor.range", "goog.events", "goog.ui.editor.AbstractDialog.EventType"]);
goog.addDependency("/closure/goog/editor/plugins/abstracttabhandler.js", ["goog.editor.plugins.AbstractTabHandler"], ["goog.editor.Plugin", "goog.events.KeyCodes"]);
goog.addDependency("/closure/goog/editor/plugins/basictextformatter.js", ["goog.editor.plugins.BasicTextFormatter", "goog.editor.plugins.BasicTextFormatter.COMMAND"], ["goog.array", "goog.debug.Logger", "goog.dom", "goog.dom.NodeType", "goog.dom.Range", "goog.dom.TagName", "goog.editor.BrowserFeature", "goog.editor.Command", "goog.editor.Link", "goog.editor.Plugin", "goog.editor.node", "goog.editor.range", "goog.editor.style", "goog.iter", "goog.iter.StopIteration", "goog.object", "goog.string", 
"goog.string.Unicode", "goog.style", "goog.ui.editor.messages", "goog.userAgent"]);
goog.addDependency("/closure/goog/editor/plugins/blockquote.js", ["goog.editor.plugins.Blockquote"], ["goog.debug.Logger", "goog.dom", "goog.dom.NodeType", "goog.dom.TagName", "goog.dom.classes", "goog.editor.BrowserFeature", "goog.editor.Command", "goog.editor.Plugin", "goog.editor.node", "goog.functions"]);
goog.addDependency("/closure/goog/editor/plugins/emoticons.js", ["goog.editor.plugins.Emoticons"], ["goog.dom.TagName", "goog.editor.Plugin", "goog.functions", "goog.ui.emoji.Emoji"]);
goog.addDependency("/closure/goog/editor/plugins/enterhandler.js", ["goog.editor.plugins.EnterHandler"], ["goog.dom", "goog.dom.AbstractRange", "goog.dom.NodeOffset", "goog.dom.NodeType", "goog.dom.TagName", "goog.editor.BrowserFeature", "goog.editor.Plugin", "goog.editor.node", "goog.editor.plugins.Blockquote", "goog.editor.range", "goog.editor.style", "goog.events.KeyCodes", "goog.string", "goog.userAgent"]);
goog.addDependency("/closure/goog/editor/plugins/equationeditorbubble.js", ["goog.editor.plugins.equation.EquationBubble"], ["goog.dom", "goog.dom.TagName", "goog.editor.Command", "goog.editor.plugins.AbstractBubblePlugin", "goog.string.Unicode", "goog.ui.editor.Bubble", "goog.ui.equation.ImageRenderer"]);
goog.addDependency("/closure/goog/editor/plugins/equationeditorplugin.js", ["goog.editor.plugins.EquationEditorPlugin"], ["goog.editor.Command", "goog.editor.plugins.AbstractDialogPlugin", "goog.editor.range", "goog.functions", "goog.ui.editor.AbstractDialog.Builder", "goog.ui.editor.EquationEditorDialog", "goog.ui.editor.EquationEditorOkEvent", "goog.ui.equation.EquationEditor", "goog.ui.equation.ImageRenderer", "goog.ui.equation.TexEditor"]);
goog.addDependency("/closure/goog/editor/plugins/headerformatter.js", ["goog.editor.plugins.HeaderFormatter"], ["goog.editor.Command", "goog.editor.Plugin", "goog.userAgent"]);
goog.addDependency("/closure/goog/editor/plugins/linkbubble.js", ["goog.editor.plugins.LinkBubble", "goog.editor.plugins.LinkBubble.Action"], ["goog.array", "goog.dom", "goog.editor.BrowserFeature", "goog.editor.Command", "goog.editor.Link", "goog.editor.plugins.AbstractBubblePlugin", "goog.editor.range", "goog.string", "goog.style", "goog.ui.editor.messages", "goog.uri.utils", "goog.window"]);
goog.addDependency("/closure/goog/editor/plugins/linkdialogplugin.js", ["goog.editor.plugins.LinkDialogPlugin"], ["goog.array", "goog.dom", "goog.editor.Command", "goog.editor.plugins.AbstractDialogPlugin", "goog.events.EventHandler", "goog.functions", "goog.ui.editor.AbstractDialog.EventType", "goog.ui.editor.LinkDialog", "goog.ui.editor.LinkDialog.EventType", "goog.ui.editor.LinkDialog.OkEvent", "goog.uri.utils"]);
goog.addDependency("/closure/goog/editor/plugins/linkshortcutplugin.js", ["goog.editor.plugins.LinkShortcutPlugin"], ["goog.editor.Command", "goog.editor.Link", "goog.editor.Plugin", "goog.string"]);
goog.addDependency("/closure/goog/editor/plugins/listtabhandler.js", ["goog.editor.plugins.ListTabHandler"], ["goog.dom.TagName", "goog.editor.Command", "goog.editor.plugins.AbstractTabHandler"]);
goog.addDependency("/closure/goog/editor/plugins/loremipsum.js", ["goog.editor.plugins.LoremIpsum"], ["goog.asserts", "goog.dom", "goog.editor.Command", "goog.editor.Plugin", "goog.editor.node", "goog.functions"]);
goog.addDependency("/closure/goog/editor/plugins/removeformatting.js", ["goog.editor.plugins.RemoveFormatting"], ["goog.dom", "goog.dom.NodeType", "goog.dom.Range", "goog.dom.TagName", "goog.editor.BrowserFeature", "goog.editor.Plugin", "goog.editor.node", "goog.editor.range", "goog.string"]);
goog.addDependency("/closure/goog/editor/plugins/spacestabhandler.js", ["goog.editor.plugins.SpacesTabHandler"], ["goog.dom", "goog.dom.TagName", "goog.editor.plugins.AbstractTabHandler", "goog.editor.range"]);
goog.addDependency("/closure/goog/editor/plugins/tableeditor.js", ["goog.editor.plugins.TableEditor"], ["goog.array", "goog.dom", "goog.dom.TagName", "goog.editor.Plugin", "goog.editor.Table", "goog.editor.node", "goog.editor.range", "goog.object"]);
goog.addDependency("/closure/goog/editor/plugins/tagonenterhandler.js", ["goog.editor.plugins.TagOnEnterHandler"], ["goog.dom", "goog.dom.NodeType", "goog.dom.Range", "goog.dom.TagName", "goog.editor.Command", "goog.editor.node", "goog.editor.plugins.EnterHandler", "goog.editor.range", "goog.editor.style", "goog.events.KeyCodes", "goog.string", "goog.style", "goog.userAgent"]);
goog.addDependency("/closure/goog/editor/plugins/undoredo.js", ["goog.editor.plugins.UndoRedo"], ["goog.debug.Logger", "goog.dom", "goog.dom.NodeOffset", "goog.dom.Range", "goog.editor.BrowserFeature", "goog.editor.Command", "goog.editor.Field.EventType", "goog.editor.Plugin", "goog.editor.plugins.UndoRedoManager", "goog.editor.plugins.UndoRedoState", "goog.events", "goog.events.EventHandler"]);
goog.addDependency("/closure/goog/editor/plugins/undoredomanager.js", ["goog.editor.plugins.UndoRedoManager", "goog.editor.plugins.UndoRedoManager.EventType"], ["goog.editor.plugins.UndoRedoState", "goog.events.EventTarget"]);
goog.addDependency("/closure/goog/editor/plugins/undoredostate.js", ["goog.editor.plugins.UndoRedoState"], ["goog.events.EventTarget"]);
goog.addDependency("/closure/goog/editor/range.js", ["goog.editor.range", "goog.editor.range.Point"], ["goog.array", "goog.dom", "goog.dom.NodeType", "goog.dom.Range", "goog.dom.RangeEndpoint", "goog.dom.SavedCaretRange", "goog.editor.BrowserFeature", "goog.editor.node", "goog.editor.style", "goog.iter"]);
goog.addDependency("/closure/goog/editor/seamlessfield.js", ["goog.editor.SeamlessField"], ["goog.cssom.iframe.style", "goog.debug.Logger", "goog.dom", "goog.dom.Range", "goog.dom.TagName", "goog.editor.BrowserFeature", "goog.editor.Field", "goog.editor.icontent", "goog.editor.icontent.FieldFormatInfo", "goog.editor.icontent.FieldStyleInfo", "goog.editor.node", "goog.events", "goog.events.EventType", "goog.style"]);
goog.addDependency("/closure/goog/editor/seamlessfield_test.js", ["goog.editor.seamlessfield_test"], ["goog.dom", "goog.dom.DomHelper", "goog.dom.Range", "goog.editor.BrowserFeature", "goog.editor.Field", "goog.editor.SeamlessField", "goog.events", "goog.functions", "goog.style", "goog.testing.MockClock", "goog.testing.MockRange", "goog.testing.jsunit"]);
goog.addDependency("/closure/goog/editor/style.js", ["goog.editor.style"], ["goog.dom", "goog.dom.NodeType", "goog.editor.BrowserFeature", "goog.events.EventType", "goog.object", "goog.style", "goog.userAgent"]);
goog.addDependency("/closure/goog/editor/table.js", ["goog.editor.Table", "goog.editor.TableCell", "goog.editor.TableRow"], ["goog.debug.Logger", "goog.dom", "goog.dom.DomHelper", "goog.dom.NodeType", "goog.dom.TagName", "goog.string.Unicode", "goog.style"]);
goog.addDependency("/closure/goog/events/actioneventwrapper.js", ["goog.events.actionEventWrapper"], ["goog.events", "goog.events.EventHandler", "goog.events.EventType", "goog.events.EventWrapper", "goog.events.KeyCodes"]);
goog.addDependency("/closure/goog/events/actionhandler.js", ["goog.events.ActionEvent", "goog.events.ActionHandler", "goog.events.ActionHandler.EventType", "goog.events.BeforeActionEvent"], ["goog.events", "goog.events.BrowserEvent", "goog.events.EventTarget", "goog.events.EventType", "goog.events.KeyCodes", "goog.userAgent"]);
goog.addDependency("/closure/goog/events/browserevent.js", ["goog.events.BrowserEvent", "goog.events.BrowserEvent.MouseButton"], ["goog.events.BrowserFeature", "goog.events.Event", "goog.events.EventType", "goog.reflect", "goog.userAgent"]);
goog.addDependency("/closure/goog/events/browserfeature.js", ["goog.events.BrowserFeature"], ["goog.userAgent"]);
goog.addDependency("/closure/goog/events/event.js", ["goog.events.Event"], ["goog.Disposable"]);
goog.addDependency("/closure/goog/events/eventhandler.js", ["goog.events.EventHandler"], ["goog.Disposable", "goog.array", "goog.events", "goog.events.EventWrapper"]);
goog.addDependency("/closure/goog/events/events.js", ["goog.events"], ["goog.array", "goog.debug.entryPointRegistry", "goog.debug.errorHandlerWeakDep", "goog.events.BrowserEvent", "goog.events.BrowserFeature", "goog.events.Event", "goog.events.EventWrapper", "goog.events.Listener", "goog.object", "goog.userAgent"]);
goog.addDependency("/closure/goog/events/eventtarget.js", ["goog.events.EventTarget"], ["goog.Disposable", "goog.events"]);
goog.addDependency("/closure/goog/events/eventtype.js", ["goog.events.EventType"], ["goog.userAgent"]);
goog.addDependency("/closure/goog/events/eventwrapper.js", ["goog.events.EventWrapper"], []);
goog.addDependency("/closure/goog/events/filedrophandler.js", ["goog.events.FileDropHandler", "goog.events.FileDropHandler.EventType"], ["goog.array", "goog.debug.Logger", "goog.dom", "goog.events", "goog.events.BrowserEvent", "goog.events.EventHandler", "goog.events.EventTarget", "goog.events.EventType"]);
goog.addDependency("/closure/goog/events/focushandler.js", ["goog.events.FocusHandler", "goog.events.FocusHandler.EventType"], ["goog.events", "goog.events.BrowserEvent", "goog.events.EventTarget", "goog.userAgent"]);
goog.addDependency("/closure/goog/events/imehandler.js", ["goog.events.ImeHandler", "goog.events.ImeHandler.Event", "goog.events.ImeHandler.EventType"], ["goog.events.Event", "goog.events.EventHandler", "goog.events.EventTarget", "goog.events.EventType", "goog.events.KeyCodes", "goog.userAgent", "goog.userAgent.product"]);
goog.addDependency("/closure/goog/events/inputhandler.js", ["goog.events.InputHandler", "goog.events.InputHandler.EventType"], ["goog.Timer", "goog.dom", "goog.events", "goog.events.BrowserEvent", "goog.events.EventHandler", "goog.events.EventTarget", "goog.events.KeyCodes", "goog.userAgent"]);
goog.addDependency("/closure/goog/events/keycodes.js", ["goog.events.KeyCodes"], ["goog.userAgent"]);
goog.addDependency("/closure/goog/events/keyhandler.js", ["goog.events.KeyEvent", "goog.events.KeyHandler", "goog.events.KeyHandler.EventType"], ["goog.events", "goog.events.BrowserEvent", "goog.events.EventTarget", "goog.events.EventType", "goog.events.KeyCodes", "goog.userAgent"]);
goog.addDependency("/closure/goog/events/keynames.js", ["goog.events.KeyNames"], []);
goog.addDependency("/closure/goog/events/listener.js", ["goog.events.Listener"], []);
goog.addDependency("/closure/goog/events/mousewheelhandler.js", ["goog.events.MouseWheelEvent", "goog.events.MouseWheelHandler", "goog.events.MouseWheelHandler.EventType"], ["goog.events", "goog.events.BrowserEvent", "goog.events.EventTarget", "goog.math", "goog.style", "goog.userAgent"]);
goog.addDependency("/closure/goog/events/onlinehandler.js", ["goog.events.OnlineHandler", "goog.events.OnlineHandler.EventType"], ["goog.Timer", "goog.events.BrowserFeature", "goog.events.EventHandler", "goog.events.EventTarget", "goog.userAgent"]);
goog.addDependency("/closure/goog/events/pastehandler.js", ["goog.events.PasteHandler", "goog.events.PasteHandler.EventType", "goog.events.PasteHandler.State"], ["goog.Timer", "goog.async.ConditionalDelay", "goog.debug.Logger", "goog.events.BrowserEvent", "goog.events.EventHandler", "goog.events.EventTarget", "goog.events.EventType", "goog.events.KeyCodes"]);
goog.addDependency("/closure/goog/format/emailaddress.js", ["goog.format.EmailAddress"], ["goog.string"]);
goog.addDependency("/closure/goog/format/format.js", ["goog.format"], ["goog.i18n.GraphemeBreak", "goog.string", "goog.userAgent"]);
goog.addDependency("/closure/goog/format/htmlprettyprinter.js", ["goog.format.HtmlPrettyPrinter", "goog.format.HtmlPrettyPrinter.Buffer"], ["goog.object", "goog.string.StringBuffer"]);
goog.addDependency("/closure/goog/format/jsonprettyprinter.js", ["goog.format.JsonPrettyPrinter", "goog.format.JsonPrettyPrinter.HtmlDelimiters", "goog.format.JsonPrettyPrinter.TextDelimiters"], ["goog.json", "goog.json.Serializer", "goog.string", "goog.string.StringBuffer", "goog.string.format"]);
goog.addDependency("/closure/goog/fs/entry.js", ["goog.fs.DirectoryEntry", "goog.fs.DirectoryEntry.Behavior", "goog.fs.Entry", "goog.fs.FileEntry"], ["goog.array", "goog.async.Deferred", "goog.fs.Error", "goog.fs.FileWriter", "goog.functions", "goog.string"]);
goog.addDependency("/closure/goog/fs/error.js", ["goog.fs.Error", "goog.fs.Error.ErrorCode"], ["goog.debug.Error", "goog.string"]);
goog.addDependency("/closure/goog/fs/filereader.js", ["goog.fs.FileReader", "goog.fs.FileReader.EventType", "goog.fs.FileReader.ReadyState"], ["goog.async.Deferred", "goog.events.Event", "goog.events.EventTarget", "goog.fs.Error", "goog.fs.ProgressEvent"]);
goog.addDependency("/closure/goog/fs/filesaver.js", ["goog.fs.FileSaver", "goog.fs.FileSaver.EventType", "goog.fs.FileSaver.ProgressEvent", "goog.fs.FileSaver.ReadyState"], ["goog.events.Event", "goog.events.EventTarget", "goog.fs.Error", "goog.fs.ProgressEvent"]);
goog.addDependency("/closure/goog/fs/filesystem.js", ["goog.fs.FileSystem"], ["goog.fs.DirectoryEntry"]);
goog.addDependency("/closure/goog/fs/filewriter.js", ["goog.fs.FileWriter"], ["goog.fs.Error", "goog.fs.FileSaver"]);
goog.addDependency("/closure/goog/fs/fs.js", ["goog.fs"], ["goog.async.Deferred", "goog.events", "goog.fs.Error", "goog.fs.FileReader", "goog.fs.FileSystem", "goog.userAgent"]);
goog.addDependency("/closure/goog/fs/progressevent.js", ["goog.fs.ProgressEvent"], ["goog.events.Event"]);
goog.addDependency("/closure/goog/functions/functions.js", ["goog.functions"], []);
goog.addDependency("/closure/goog/fx/abstractdragdrop.js", ["goog.fx.AbstractDragDrop", "goog.fx.AbstractDragDrop.EventType", "goog.fx.DragDropEvent", "goog.fx.DragDropItem"], ["goog.dom", "goog.dom.classes", "goog.events", "goog.events.Event", "goog.events.EventTarget", "goog.events.EventType", "goog.fx.Dragger", "goog.fx.Dragger.EventType", "goog.math.Box", "goog.math.Coordinate", "goog.style"]);
goog.addDependency("/closure/goog/fx/anim/anim.js", ["goog.fx.anim", "goog.fx.anim.Animated"], ["goog.async.AnimationDelay", "goog.async.Delay", "goog.object"]);
goog.addDependency("/closure/goog/fx/animation.js", ["goog.fx.Animation", "goog.fx.Animation.EventType", "goog.fx.Animation.State", "goog.fx.AnimationEvent"], ["goog.array", "goog.events.Event", "goog.fx.Transition", "goog.fx.Transition.EventType", "goog.fx.TransitionBase.State", "goog.fx.anim", "goog.fx.anim.Animated"]);
goog.addDependency("/closure/goog/fx/animationqueue.js", ["goog.fx.AnimationParallelQueue", "goog.fx.AnimationQueue", "goog.fx.AnimationSerialQueue"], ["goog.array", "goog.asserts", "goog.events.EventHandler", "goog.fx.Transition.EventType", "goog.fx.TransitionBase", "goog.fx.TransitionBase.State"]);
goog.addDependency("/closure/goog/fx/css3/fx.js", ["goog.fx.css3"], ["goog.fx.css3.Transition"]);
goog.addDependency("/closure/goog/fx/css3/transition.js", ["goog.fx.css3.Transition"], ["goog.Timer", "goog.fx.TransitionBase", "goog.style", "goog.style.transition"]);
goog.addDependency("/closure/goog/fx/cssspriteanimation.js", ["goog.fx.CssSpriteAnimation"], ["goog.fx.Animation"]);
goog.addDependency("/closure/goog/fx/dom.js", ["goog.fx.dom", "goog.fx.dom.BgColorTransform", "goog.fx.dom.ColorTransform", "goog.fx.dom.Fade", "goog.fx.dom.FadeIn", "goog.fx.dom.FadeInAndShow", "goog.fx.dom.FadeOut", "goog.fx.dom.FadeOutAndHide", "goog.fx.dom.PredefinedEffect", "goog.fx.dom.Resize", "goog.fx.dom.ResizeHeight", "goog.fx.dom.ResizeWidth", "goog.fx.dom.Scroll", "goog.fx.dom.Slide", "goog.fx.dom.SlideFrom", "goog.fx.dom.Swipe"], ["goog.color", "goog.events", "goog.fx.Animation", "goog.fx.Transition.EventType", 
"goog.style", "goog.style.bidi"]);
goog.addDependency("/closure/goog/fx/dragdrop.js", ["goog.fx.DragDrop"], ["goog.fx.AbstractDragDrop", "goog.fx.DragDropItem"]);
goog.addDependency("/closure/goog/fx/dragdropgroup.js", ["goog.fx.DragDropGroup"], ["goog.dom", "goog.fx.AbstractDragDrop", "goog.fx.DragDropItem"]);
goog.addDependency("/closure/goog/fx/dragger.js", ["goog.fx.DragEvent", "goog.fx.Dragger", "goog.fx.Dragger.EventType"], ["goog.dom", "goog.events", "goog.events.BrowserEvent.MouseButton", "goog.events.Event", "goog.events.EventHandler", "goog.events.EventTarget", "goog.events.EventType", "goog.math.Coordinate", "goog.math.Rect", "goog.style", "goog.style.bidi", "goog.userAgent"]);
goog.addDependency("/closure/goog/fx/draglistgroup.js", ["goog.fx.DragListDirection", "goog.fx.DragListGroup", "goog.fx.DragListGroup.EventType", "goog.fx.DragListGroupEvent"], ["goog.asserts", "goog.dom", "goog.dom.NodeType", "goog.dom.classes", "goog.events.Event", "goog.events.EventHandler", "goog.events.EventTarget", "goog.events.EventType", "goog.fx.Dragger", "goog.fx.Dragger.EventType", "goog.math.Coordinate", "goog.style"]);
goog.addDependency("/closure/goog/fx/dragscrollsupport.js", ["goog.fx.DragScrollSupport"], ["goog.Disposable", "goog.Timer", "goog.dom", "goog.events.EventHandler", "goog.events.EventType", "goog.math.Coordinate", "goog.style"]);
goog.addDependency("/closure/goog/fx/easing.js", ["goog.fx.easing"], []);
goog.addDependency("/closure/goog/fx/fx.js", ["goog.fx"], ["goog.asserts", "goog.fx.Animation", "goog.fx.Animation.EventType", "goog.fx.Animation.State", "goog.fx.AnimationEvent", "goog.fx.Transition.EventType", "goog.fx.easing"]);
goog.addDependency("/closure/goog/fx/transition.js", ["goog.fx.Transition", "goog.fx.Transition.EventType"], []);
goog.addDependency("/closure/goog/fx/transitionbase.js", ["goog.fx.TransitionBase", "goog.fx.TransitionBase.State"], ["goog.events.EventTarget", "goog.fx.Transition", "goog.fx.Transition.EventType"]);
goog.addDependency("/closure/goog/gears/basestore.js", ["goog.gears.BaseStore", "goog.gears.BaseStore.SchemaType"], ["goog.Disposable"]);
goog.addDependency("/closure/goog/gears/database.js", ["goog.gears.Database", "goog.gears.Database.EventType", "goog.gears.Database.TransactionEvent"], ["goog.array", "goog.debug", "goog.debug.Logger", "goog.events.Event", "goog.events.EventTarget", "goog.gears", "goog.json"]);
goog.addDependency("/closure/goog/gears/gears.js", ["goog.gears"], ["goog.string"]);
goog.addDependency("/closure/goog/gears/httprequest.js", ["goog.gears.HttpRequest"], ["goog.Timer", "goog.gears", "goog.net.WrapperXmlHttpFactory", "goog.net.XmlHttp"]);
goog.addDependency("/closure/goog/gears/loggerclient.js", ["goog.gears.LoggerClient"], ["goog.Disposable", "goog.debug", "goog.debug.Logger"]);
goog.addDependency("/closure/goog/gears/loggerserver.js", ["goog.gears.LoggerServer"], ["goog.Disposable", "goog.debug.Logger", "goog.debug.Logger.Level", "goog.gears.Worker.EventType"]);
goog.addDependency("/closure/goog/gears/logstore.js", ["goog.gears.LogStore", "goog.gears.LogStore.Query"], ["goog.async.Delay", "goog.debug.LogManager", "goog.debug.LogRecord", "goog.debug.Logger", "goog.debug.Logger.Level", "goog.gears.BaseStore", "goog.gears.BaseStore.SchemaType", "goog.json"]);
goog.addDependency("/closure/goog/gears/managedresourcestore.js", ["goog.gears.ManagedResourceStore", "goog.gears.ManagedResourceStore.EventType", "goog.gears.ManagedResourceStore.UpdateStatus", "goog.gears.ManagedResourceStoreEvent"], ["goog.debug.Logger", "goog.events.Event", "goog.events.EventTarget", "goog.gears", "goog.string"]);
goog.addDependency("/closure/goog/gears/multipartformdata.js", ["goog.gears.MultipartFormData"], ["goog.asserts", "goog.gears", "goog.string"]);
goog.addDependency("/closure/goog/gears/statustype.js", ["goog.gears.StatusType"], []);
goog.addDependency("/closure/goog/gears/urlcapture.js", ["goog.gears.UrlCapture", "goog.gears.UrlCapture.Event", "goog.gears.UrlCapture.EventType"], ["goog.Uri", "goog.debug.Logger", "goog.events.Event", "goog.events.EventTarget", "goog.gears"]);
goog.addDependency("/closure/goog/gears/worker.js", ["goog.gears.Worker", "goog.gears.Worker.EventType", "goog.gears.WorkerEvent"], ["goog.events.Event", "goog.events.EventTarget"]);
goog.addDependency("/closure/goog/gears/workerchannel.js", ["goog.gears.WorkerChannel"], ["goog.Disposable", "goog.debug", "goog.debug.Logger", "goog.events", "goog.gears.Worker", "goog.gears.Worker.EventType", "goog.gears.WorkerEvent", "goog.json", "goog.messaging.AbstractChannel"]);
goog.addDependency("/closure/goog/gears/workerpool.js", ["goog.gears.WorkerPool", "goog.gears.WorkerPool.Event", "goog.gears.WorkerPool.EventType"], ["goog.events.Event", "goog.events.EventTarget", "goog.gears", "goog.gears.Worker"]);
goog.addDependency("/closure/goog/graphics/abstractgraphics.js", ["goog.graphics.AbstractGraphics"], ["goog.graphics.Path", "goog.math.Coordinate", "goog.math.Size", "goog.style", "goog.ui.Component"]);
goog.addDependency("/closure/goog/graphics/affinetransform.js", ["goog.graphics.AffineTransform"], ["goog.math"]);
goog.addDependency("/closure/goog/graphics/canvaselement.js", ["goog.graphics.CanvasEllipseElement", "goog.graphics.CanvasGroupElement", "goog.graphics.CanvasImageElement", "goog.graphics.CanvasPathElement", "goog.graphics.CanvasRectElement", "goog.graphics.CanvasTextElement"], ["goog.array", "goog.dom", "goog.dom.TagName", "goog.graphics.EllipseElement", "goog.graphics.GroupElement", "goog.graphics.ImageElement", "goog.graphics.Path", "goog.graphics.PathElement", "goog.graphics.RectElement", "goog.graphics.TextElement"]);
goog.addDependency("/closure/goog/graphics/canvasgraphics.js", ["goog.graphics.CanvasGraphics"], ["goog.dom", "goog.events.EventType", "goog.graphics.AbstractGraphics", "goog.graphics.CanvasEllipseElement", "goog.graphics.CanvasGroupElement", "goog.graphics.CanvasImageElement", "goog.graphics.CanvasPathElement", "goog.graphics.CanvasRectElement", "goog.graphics.CanvasTextElement", "goog.graphics.Font", "goog.graphics.LinearGradient", "goog.graphics.SolidFill", "goog.graphics.Stroke", "goog.math.Size"]);
goog.addDependency("/closure/goog/graphics/element.js", ["goog.graphics.Element"], ["goog.events", "goog.events.EventTarget", "goog.graphics.AffineTransform", "goog.math"]);
goog.addDependency("/closure/goog/graphics/ellipseelement.js", ["goog.graphics.EllipseElement"], ["goog.graphics.StrokeAndFillElement"]);
goog.addDependency("/closure/goog/graphics/ext/coordinates.js", ["goog.graphics.ext.coordinates"], ["goog.string"]);
goog.addDependency("/closure/goog/graphics/ext/element.js", ["goog.graphics.ext.Element"], ["goog.events", "goog.events.EventTarget", "goog.functions", "goog.graphics", "goog.graphics.ext.coordinates"]);
goog.addDependency("/closure/goog/graphics/ext/ellipse.js", ["goog.graphics.ext.Ellipse"], ["goog.graphics.ext.StrokeAndFillElement"]);
goog.addDependency("/closure/goog/graphics/ext/ext.js", ["goog.graphics.ext"], ["goog.graphics.ext.Ellipse", "goog.graphics.ext.Graphics", "goog.graphics.ext.Group", "goog.graphics.ext.Image", "goog.graphics.ext.Rectangle", "goog.graphics.ext.Shape", "goog.graphics.ext.coordinates"]);
goog.addDependency("/closure/goog/graphics/ext/graphics.js", ["goog.graphics.ext.Graphics"], ["goog.events.EventType", "goog.graphics.ext.Group"]);
goog.addDependency("/closure/goog/graphics/ext/group.js", ["goog.graphics.ext.Group"], ["goog.graphics.ext.Element"]);
goog.addDependency("/closure/goog/graphics/ext/image.js", ["goog.graphics.ext.Image"], ["goog.graphics.ext.Element"]);
goog.addDependency("/closure/goog/graphics/ext/path.js", ["goog.graphics.ext.Path"], ["goog.graphics.AffineTransform", "goog.graphics.Path", "goog.math", "goog.math.Rect"]);
goog.addDependency("/closure/goog/graphics/ext/rectangle.js", ["goog.graphics.ext.Rectangle"], ["goog.graphics.ext.StrokeAndFillElement"]);
goog.addDependency("/closure/goog/graphics/ext/shape.js", ["goog.graphics.ext.Shape"], ["goog.graphics.ext.Path", "goog.graphics.ext.StrokeAndFillElement", "goog.math.Rect"]);
goog.addDependency("/closure/goog/graphics/ext/strokeandfillelement.js", ["goog.graphics.ext.StrokeAndFillElement"], ["goog.graphics.ext.Element"]);
goog.addDependency("/closure/goog/graphics/fill.js", ["goog.graphics.Fill"], []);
goog.addDependency("/closure/goog/graphics/font.js", ["goog.graphics.Font"], []);
goog.addDependency("/closure/goog/graphics/graphics.js", ["goog.graphics"], ["goog.graphics.CanvasGraphics", "goog.graphics.SvgGraphics", "goog.graphics.VmlGraphics", "goog.userAgent"]);
goog.addDependency("/closure/goog/graphics/groupelement.js", ["goog.graphics.GroupElement"], ["goog.graphics.Element"]);
goog.addDependency("/closure/goog/graphics/imageelement.js", ["goog.graphics.ImageElement"], ["goog.graphics.Element"]);
goog.addDependency("/closure/goog/graphics/lineargradient.js", ["goog.graphics.LinearGradient"], ["goog.asserts", "goog.graphics.Fill"]);
goog.addDependency("/closure/goog/graphics/path.js", ["goog.graphics.Path", "goog.graphics.Path.Segment"], ["goog.array", "goog.math"]);
goog.addDependency("/closure/goog/graphics/pathelement.js", ["goog.graphics.PathElement"], ["goog.graphics.StrokeAndFillElement"]);
goog.addDependency("/closure/goog/graphics/paths.js", ["goog.graphics.paths"], ["goog.graphics.Path", "goog.math.Coordinate"]);
goog.addDependency("/closure/goog/graphics/rectelement.js", ["goog.graphics.RectElement"], ["goog.graphics.StrokeAndFillElement"]);
goog.addDependency("/closure/goog/graphics/solidfill.js", ["goog.graphics.SolidFill"], ["goog.graphics.Fill"]);
goog.addDependency("/closure/goog/graphics/stroke.js", ["goog.graphics.Stroke"], []);
goog.addDependency("/closure/goog/graphics/strokeandfillelement.js", ["goog.graphics.StrokeAndFillElement"], ["goog.graphics.Element"]);
goog.addDependency("/closure/goog/graphics/svgelement.js", ["goog.graphics.SvgEllipseElement", "goog.graphics.SvgGroupElement", "goog.graphics.SvgImageElement", "goog.graphics.SvgPathElement", "goog.graphics.SvgRectElement", "goog.graphics.SvgTextElement"], ["goog.dom", "goog.graphics.EllipseElement", "goog.graphics.GroupElement", "goog.graphics.ImageElement", "goog.graphics.PathElement", "goog.graphics.RectElement", "goog.graphics.TextElement"]);
goog.addDependency("/closure/goog/graphics/svggraphics.js", ["goog.graphics.SvgGraphics"], ["goog.Timer", "goog.dom", "goog.events.EventHandler", "goog.events.EventType", "goog.graphics.AbstractGraphics", "goog.graphics.Font", "goog.graphics.LinearGradient", "goog.graphics.SolidFill", "goog.graphics.Stroke", "goog.graphics.SvgEllipseElement", "goog.graphics.SvgGroupElement", "goog.graphics.SvgImageElement", "goog.graphics.SvgPathElement", "goog.graphics.SvgRectElement", "goog.graphics.SvgTextElement", 
"goog.math.Size", "goog.style", "goog.userAgent"]);
goog.addDependency("/closure/goog/graphics/textelement.js", ["goog.graphics.TextElement"], ["goog.graphics.StrokeAndFillElement"]);
goog.addDependency("/closure/goog/graphics/vmlelement.js", ["goog.graphics.VmlEllipseElement", "goog.graphics.VmlGroupElement", "goog.graphics.VmlImageElement", "goog.graphics.VmlPathElement", "goog.graphics.VmlRectElement", "goog.graphics.VmlTextElement"], ["goog.dom", "goog.graphics.EllipseElement", "goog.graphics.GroupElement", "goog.graphics.ImageElement", "goog.graphics.PathElement", "goog.graphics.RectElement", "goog.graphics.TextElement"]);
goog.addDependency("/closure/goog/graphics/vmlgraphics.js", ["goog.graphics.VmlGraphics"], ["goog.array", "goog.dom", "goog.events.EventHandler", "goog.events.EventType", "goog.graphics.AbstractGraphics", "goog.graphics.Font", "goog.graphics.LinearGradient", "goog.graphics.SolidFill", "goog.graphics.Stroke", "goog.graphics.VmlEllipseElement", "goog.graphics.VmlGroupElement", "goog.graphics.VmlImageElement", "goog.graphics.VmlPathElement", "goog.graphics.VmlRectElement", "goog.graphics.VmlTextElement", 
"goog.math.Size", "goog.string", "goog.style"]);
goog.addDependency("/closure/goog/history/event.js", ["goog.history.Event"], ["goog.events.Event", "goog.history.EventType"]);
goog.addDependency("/closure/goog/history/eventtype.js", ["goog.history.EventType"], []);
goog.addDependency("/closure/goog/history/history.js", ["goog.History", "goog.History.Event", "goog.History.EventType"], ["goog.Timer", "goog.dom", "goog.events", "goog.events.BrowserEvent", "goog.events.Event", "goog.events.EventHandler", "goog.events.EventTarget", "goog.events.EventType", "goog.history.Event", "goog.history.EventType", "goog.string", "goog.userAgent"]);
goog.addDependency("/closure/goog/history/html5history.js", ["goog.history.Html5History", "goog.history.Html5History.TokenTransformer"], ["goog.asserts", "goog.events", "goog.events.EventTarget", "goog.events.EventType", "goog.history.Event", "goog.history.EventType"]);
goog.addDependency("/closure/goog/i18n/bidi.js", ["goog.i18n.bidi"], []);
goog.addDependency("/closure/goog/i18n/bidiformatter.js", ["goog.i18n.BidiFormatter"], ["goog.i18n.bidi", "goog.string"]);
goog.addDependency("/closure/goog/i18n/charlistdecompressor.js", ["goog.i18n.CharListDecompressor"], ["goog.array", "goog.i18n.uChar"]);
goog.addDependency("/closure/goog/i18n/charpickerdata.js", ["goog.i18n.CharPickerData"], []);
goog.addDependency("/closure/goog/i18n/currency.js", ["goog.i18n.currency"], []);
goog.addDependency("/closure/goog/i18n/currencycodemap.js", ["goog.i18n.currencyCodeMap", "goog.i18n.currencyCodeMapTier2"], []);
goog.addDependency("/closure/goog/i18n/datetimeformat.js", ["goog.i18n.DateTimeFormat", "goog.i18n.DateTimeFormat.Format"], ["goog.asserts", "goog.date.DateLike", "goog.i18n.DateTimeSymbols", "goog.i18n.TimeZone", "goog.string"]);
goog.addDependency("/closure/goog/i18n/datetimeparse.js", ["goog.i18n.DateTimeParse"], ["goog.date.DateLike", "goog.i18n.DateTimeFormat", "goog.i18n.DateTimeSymbols"]);
goog.addDependency("/closure/goog/i18n/datetimepatterns.js", ["goog.i18n.DateTimePatterns", "goog.i18n.DateTimePatterns_af", "goog.i18n.DateTimePatterns_am", "goog.i18n.DateTimePatterns_ar", "goog.i18n.DateTimePatterns_bg", "goog.i18n.DateTimePatterns_bn", "goog.i18n.DateTimePatterns_ca", "goog.i18n.DateTimePatterns_chr", "goog.i18n.DateTimePatterns_cs", "goog.i18n.DateTimePatterns_cy", "goog.i18n.DateTimePatterns_da", "goog.i18n.DateTimePatterns_de", "goog.i18n.DateTimePatterns_de_AT", "goog.i18n.DateTimePatterns_de_CH", 
"goog.i18n.DateTimePatterns_el", "goog.i18n.DateTimePatterns_en", "goog.i18n.DateTimePatterns_en_AU", "goog.i18n.DateTimePatterns_en_GB", "goog.i18n.DateTimePatterns_en_IE", "goog.i18n.DateTimePatterns_en_IN", "goog.i18n.DateTimePatterns_en_SG", "goog.i18n.DateTimePatterns_en_US", "goog.i18n.DateTimePatterns_en_ZA", "goog.i18n.DateTimePatterns_es", "goog.i18n.DateTimePatterns_es_419", "goog.i18n.DateTimePatterns_et", "goog.i18n.DateTimePatterns_eu", "goog.i18n.DateTimePatterns_fa", "goog.i18n.DateTimePatterns_fi", 
"goog.i18n.DateTimePatterns_fil", "goog.i18n.DateTimePatterns_fr", "goog.i18n.DateTimePatterns_fr_CA", "goog.i18n.DateTimePatterns_gl", "goog.i18n.DateTimePatterns_gsw", "goog.i18n.DateTimePatterns_gu", "goog.i18n.DateTimePatterns_haw", "goog.i18n.DateTimePatterns_he", "goog.i18n.DateTimePatterns_hi", "goog.i18n.DateTimePatterns_hr", "goog.i18n.DateTimePatterns_hu", "goog.i18n.DateTimePatterns_id", "goog.i18n.DateTimePatterns_in", "goog.i18n.DateTimePatterns_is", "goog.i18n.DateTimePatterns_it", 
"goog.i18n.DateTimePatterns_iw", "goog.i18n.DateTimePatterns_ja", "goog.i18n.DateTimePatterns_kn", "goog.i18n.DateTimePatterns_ko", "goog.i18n.DateTimePatterns_ln", "goog.i18n.DateTimePatterns_lt", "goog.i18n.DateTimePatterns_lv", "goog.i18n.DateTimePatterns_ml", "goog.i18n.DateTimePatterns_mo", "goog.i18n.DateTimePatterns_mr", "goog.i18n.DateTimePatterns_ms", "goog.i18n.DateTimePatterns_mt", "goog.i18n.DateTimePatterns_nl", "goog.i18n.DateTimePatterns_no", "goog.i18n.DateTimePatterns_or", "goog.i18n.DateTimePatterns_pl", 
"goog.i18n.DateTimePatterns_pt_BR", "goog.i18n.DateTimePatterns_pt_PT", "goog.i18n.DateTimePatterns_pt", "goog.i18n.DateTimePatterns_ro", "goog.i18n.DateTimePatterns_ru", "goog.i18n.DateTimePatterns_sk", "goog.i18n.DateTimePatterns_sl", "goog.i18n.DateTimePatterns_sq", "goog.i18n.DateTimePatterns_sr", "goog.i18n.DateTimePatterns_sv", "goog.i18n.DateTimePatterns_sw", "goog.i18n.DateTimePatterns_ta", "goog.i18n.DateTimePatterns_te", "goog.i18n.DateTimePatterns_th", "goog.i18n.DateTimePatterns_tl", 
"goog.i18n.DateTimePatterns_tr", "goog.i18n.DateTimePatterns_uk", "goog.i18n.DateTimePatterns_ur", "goog.i18n.DateTimePatterns_vi", "goog.i18n.DateTimePatterns_zh_TW", "goog.i18n.DateTimePatterns_zh_CN", "goog.i18n.DateTimePatterns_zh_HK", "goog.i18n.DateTimePatterns_zh", "goog.i18n.DateTimePatterns_zu"], []);
goog.addDependency("/closure/goog/i18n/datetimepatternsext.js", ["goog.i18n.DateTimePatternsExt", "goog.i18n.DateTimePatterns_af_NA", "goog.i18n.DateTimePatterns_af_ZA", "goog.i18n.DateTimePatterns_agq", "goog.i18n.DateTimePatterns_agq_CM", "goog.i18n.DateTimePatterns_ak", "goog.i18n.DateTimePatterns_ak_GH", "goog.i18n.DateTimePatterns_am_ET", "goog.i18n.DateTimePatterns_ar_AE", "goog.i18n.DateTimePatterns_ar_BH", "goog.i18n.DateTimePatterns_ar_DZ", "goog.i18n.DateTimePatterns_ar_EG", "goog.i18n.DateTimePatterns_ar_IQ", 
"goog.i18n.DateTimePatterns_ar_JO", "goog.i18n.DateTimePatterns_ar_KW", "goog.i18n.DateTimePatterns_ar_LB", "goog.i18n.DateTimePatterns_ar_LY", "goog.i18n.DateTimePatterns_ar_MA", "goog.i18n.DateTimePatterns_ar_OM", "goog.i18n.DateTimePatterns_ar_QA", "goog.i18n.DateTimePatterns_ar_SA", "goog.i18n.DateTimePatterns_ar_SD", "goog.i18n.DateTimePatterns_ar_SY", "goog.i18n.DateTimePatterns_ar_TN", "goog.i18n.DateTimePatterns_ar_YE", "goog.i18n.DateTimePatterns_as", "goog.i18n.DateTimePatterns_as_IN", 
"goog.i18n.DateTimePatterns_asa", "goog.i18n.DateTimePatterns_asa_TZ", "goog.i18n.DateTimePatterns_az", "goog.i18n.DateTimePatterns_az_Cyrl", "goog.i18n.DateTimePatterns_az_Cyrl_AZ", "goog.i18n.DateTimePatterns_az_Latn", "goog.i18n.DateTimePatterns_az_Latn_AZ", "goog.i18n.DateTimePatterns_bas", "goog.i18n.DateTimePatterns_bas_CM", "goog.i18n.DateTimePatterns_be", "goog.i18n.DateTimePatterns_be_BY", "goog.i18n.DateTimePatterns_bem", "goog.i18n.DateTimePatterns_bem_ZM", "goog.i18n.DateTimePatterns_bez", 
"goog.i18n.DateTimePatterns_bez_TZ", "goog.i18n.DateTimePatterns_bg_BG", "goog.i18n.DateTimePatterns_bm", "goog.i18n.DateTimePatterns_bm_ML", "goog.i18n.DateTimePatterns_bn_BD", "goog.i18n.DateTimePatterns_bn_IN", "goog.i18n.DateTimePatterns_bo", "goog.i18n.DateTimePatterns_bo_CN", "goog.i18n.DateTimePatterns_bo_IN", "goog.i18n.DateTimePatterns_br", "goog.i18n.DateTimePatterns_br_FR", "goog.i18n.DateTimePatterns_brx", "goog.i18n.DateTimePatterns_brx_IN", "goog.i18n.DateTimePatterns_bs", "goog.i18n.DateTimePatterns_bs_BA", 
"goog.i18n.DateTimePatterns_ca_ES", "goog.i18n.DateTimePatterns_cgg", "goog.i18n.DateTimePatterns_cgg_UG", "goog.i18n.DateTimePatterns_chr_US", "goog.i18n.DateTimePatterns_cs_CZ", "goog.i18n.DateTimePatterns_cy_GB", "goog.i18n.DateTimePatterns_da_DK", "goog.i18n.DateTimePatterns_dav", "goog.i18n.DateTimePatterns_dav_KE", "goog.i18n.DateTimePatterns_de_BE", "goog.i18n.DateTimePatterns_de_DE", "goog.i18n.DateTimePatterns_de_LI", "goog.i18n.DateTimePatterns_de_LU", "goog.i18n.DateTimePatterns_dje", 
"goog.i18n.DateTimePatterns_dje_NE", "goog.i18n.DateTimePatterns_dua", "goog.i18n.DateTimePatterns_dua_CM", "goog.i18n.DateTimePatterns_dyo", "goog.i18n.DateTimePatterns_dyo_SN", "goog.i18n.DateTimePatterns_ebu", "goog.i18n.DateTimePatterns_ebu_KE", "goog.i18n.DateTimePatterns_ee", "goog.i18n.DateTimePatterns_ee_GH", "goog.i18n.DateTimePatterns_ee_TG", "goog.i18n.DateTimePatterns_el_CY", "goog.i18n.DateTimePatterns_el_GR", "goog.i18n.DateTimePatterns_en_AS", "goog.i18n.DateTimePatterns_en_BB", "goog.i18n.DateTimePatterns_en_BE", 
"goog.i18n.DateTimePatterns_en_BM", "goog.i18n.DateTimePatterns_en_BW", "goog.i18n.DateTimePatterns_en_BZ", "goog.i18n.DateTimePatterns_en_CA", "goog.i18n.DateTimePatterns_en_GU", "goog.i18n.DateTimePatterns_en_GY", "goog.i18n.DateTimePatterns_en_HK", "goog.i18n.DateTimePatterns_en_JM", "goog.i18n.DateTimePatterns_en_MH", "goog.i18n.DateTimePatterns_en_MP", "goog.i18n.DateTimePatterns_en_MT", "goog.i18n.DateTimePatterns_en_MU", "goog.i18n.DateTimePatterns_en_NA", "goog.i18n.DateTimePatterns_en_NZ", 
"goog.i18n.DateTimePatterns_en_PH", "goog.i18n.DateTimePatterns_en_PK", "goog.i18n.DateTimePatterns_en_TT", "goog.i18n.DateTimePatterns_en_UM", "goog.i18n.DateTimePatterns_en_US_POSIX", "goog.i18n.DateTimePatterns_en_VI", "goog.i18n.DateTimePatterns_en_ZW", "goog.i18n.DateTimePatterns_eo", "goog.i18n.DateTimePatterns_es_AR", "goog.i18n.DateTimePatterns_es_BO", "goog.i18n.DateTimePatterns_es_CL", "goog.i18n.DateTimePatterns_es_CO", "goog.i18n.DateTimePatterns_es_CR", "goog.i18n.DateTimePatterns_es_DO", 
"goog.i18n.DateTimePatterns_es_EC", "goog.i18n.DateTimePatterns_es_ES", "goog.i18n.DateTimePatterns_es_GQ", "goog.i18n.DateTimePatterns_es_GT", "goog.i18n.DateTimePatterns_es_HN", "goog.i18n.DateTimePatterns_es_MX", "goog.i18n.DateTimePatterns_es_NI", "goog.i18n.DateTimePatterns_es_PA", "goog.i18n.DateTimePatterns_es_PE", "goog.i18n.DateTimePatterns_es_PR", "goog.i18n.DateTimePatterns_es_PY", "goog.i18n.DateTimePatterns_es_SV", "goog.i18n.DateTimePatterns_es_US", "goog.i18n.DateTimePatterns_es_UY", 
"goog.i18n.DateTimePatterns_es_VE", "goog.i18n.DateTimePatterns_et_EE", "goog.i18n.DateTimePatterns_eu_ES", "goog.i18n.DateTimePatterns_ewo", "goog.i18n.DateTimePatterns_ewo_CM", "goog.i18n.DateTimePatterns_fa_AF", "goog.i18n.DateTimePatterns_fa_IR", "goog.i18n.DateTimePatterns_ff", "goog.i18n.DateTimePatterns_ff_SN", "goog.i18n.DateTimePatterns_fi_FI", "goog.i18n.DateTimePatterns_fil_PH", "goog.i18n.DateTimePatterns_fo", "goog.i18n.DateTimePatterns_fo_FO", "goog.i18n.DateTimePatterns_fr_BE", "goog.i18n.DateTimePatterns_fr_BF", 
"goog.i18n.DateTimePatterns_fr_BI", "goog.i18n.DateTimePatterns_fr_BJ", "goog.i18n.DateTimePatterns_fr_BL", "goog.i18n.DateTimePatterns_fr_CD", "goog.i18n.DateTimePatterns_fr_CF", "goog.i18n.DateTimePatterns_fr_CG", "goog.i18n.DateTimePatterns_fr_CH", "goog.i18n.DateTimePatterns_fr_CI", "goog.i18n.DateTimePatterns_fr_CM", "goog.i18n.DateTimePatterns_fr_DJ", "goog.i18n.DateTimePatterns_fr_FR", "goog.i18n.DateTimePatterns_fr_GA", "goog.i18n.DateTimePatterns_fr_GF", "goog.i18n.DateTimePatterns_fr_GN", 
"goog.i18n.DateTimePatterns_fr_GP", "goog.i18n.DateTimePatterns_fr_GQ", "goog.i18n.DateTimePatterns_fr_KM", "goog.i18n.DateTimePatterns_fr_LU", "goog.i18n.DateTimePatterns_fr_MC", "goog.i18n.DateTimePatterns_fr_MF", "goog.i18n.DateTimePatterns_fr_MG", "goog.i18n.DateTimePatterns_fr_ML", "goog.i18n.DateTimePatterns_fr_MQ", "goog.i18n.DateTimePatterns_fr_NE", "goog.i18n.DateTimePatterns_fr_RE", "goog.i18n.DateTimePatterns_fr_RW", "goog.i18n.DateTimePatterns_fr_SN", "goog.i18n.DateTimePatterns_fr_TD", 
"goog.i18n.DateTimePatterns_fr_TG", "goog.i18n.DateTimePatterns_fr_YT", "goog.i18n.DateTimePatterns_ga", "goog.i18n.DateTimePatterns_ga_IE", "goog.i18n.DateTimePatterns_gl_ES", "goog.i18n.DateTimePatterns_gsw_CH", "goog.i18n.DateTimePatterns_gu_IN", "goog.i18n.DateTimePatterns_guz", "goog.i18n.DateTimePatterns_guz_KE", "goog.i18n.DateTimePatterns_gv", "goog.i18n.DateTimePatterns_gv_GB", "goog.i18n.DateTimePatterns_ha", "goog.i18n.DateTimePatterns_ha_Latn", "goog.i18n.DateTimePatterns_ha_Latn_GH", 
"goog.i18n.DateTimePatterns_ha_Latn_NE", "goog.i18n.DateTimePatterns_ha_Latn_NG", "goog.i18n.DateTimePatterns_haw_US", "goog.i18n.DateTimePatterns_he_IL", "goog.i18n.DateTimePatterns_hi_IN", "goog.i18n.DateTimePatterns_hr_HR", "goog.i18n.DateTimePatterns_hu_HU", "goog.i18n.DateTimePatterns_hy", "goog.i18n.DateTimePatterns_hy_AM", "goog.i18n.DateTimePatterns_id_ID", "goog.i18n.DateTimePatterns_ig", "goog.i18n.DateTimePatterns_ig_NG", "goog.i18n.DateTimePatterns_ii", "goog.i18n.DateTimePatterns_ii_CN", 
"goog.i18n.DateTimePatterns_is_IS", "goog.i18n.DateTimePatterns_it_CH", "goog.i18n.DateTimePatterns_it_IT", "goog.i18n.DateTimePatterns_ja_JP", "goog.i18n.DateTimePatterns_jmc", "goog.i18n.DateTimePatterns_jmc_TZ", "goog.i18n.DateTimePatterns_ka", "goog.i18n.DateTimePatterns_ka_GE", "goog.i18n.DateTimePatterns_kab", "goog.i18n.DateTimePatterns_kab_DZ", "goog.i18n.DateTimePatterns_kam", "goog.i18n.DateTimePatterns_kam_KE", "goog.i18n.DateTimePatterns_kde", "goog.i18n.DateTimePatterns_kde_TZ", "goog.i18n.DateTimePatterns_kea", 
"goog.i18n.DateTimePatterns_kea_CV", "goog.i18n.DateTimePatterns_khq", "goog.i18n.DateTimePatterns_khq_ML", "goog.i18n.DateTimePatterns_ki", "goog.i18n.DateTimePatterns_ki_KE", "goog.i18n.DateTimePatterns_kk", "goog.i18n.DateTimePatterns_kk_Cyrl", "goog.i18n.DateTimePatterns_kk_Cyrl_KZ", "goog.i18n.DateTimePatterns_kl", "goog.i18n.DateTimePatterns_kl_GL", "goog.i18n.DateTimePatterns_kln", "goog.i18n.DateTimePatterns_kln_KE", "goog.i18n.DateTimePatterns_km", "goog.i18n.DateTimePatterns_km_KH", "goog.i18n.DateTimePatterns_kn_IN", 
"goog.i18n.DateTimePatterns_ko_KR", "goog.i18n.DateTimePatterns_kok", "goog.i18n.DateTimePatterns_kok_IN", "goog.i18n.DateTimePatterns_ksb", "goog.i18n.DateTimePatterns_ksb_TZ", "goog.i18n.DateTimePatterns_ksf", "goog.i18n.DateTimePatterns_ksf_CM", "goog.i18n.DateTimePatterns_kw", "goog.i18n.DateTimePatterns_kw_GB", "goog.i18n.DateTimePatterns_lag", "goog.i18n.DateTimePatterns_lag_TZ", "goog.i18n.DateTimePatterns_lg", "goog.i18n.DateTimePatterns_lg_UG", "goog.i18n.DateTimePatterns_ln_CD", "goog.i18n.DateTimePatterns_ln_CG", 
"goog.i18n.DateTimePatterns_lt_LT", "goog.i18n.DateTimePatterns_lu", "goog.i18n.DateTimePatterns_lu_CD", "goog.i18n.DateTimePatterns_luo", "goog.i18n.DateTimePatterns_luo_KE", "goog.i18n.DateTimePatterns_luy", "goog.i18n.DateTimePatterns_luy_KE", "goog.i18n.DateTimePatterns_lv_LV", "goog.i18n.DateTimePatterns_mas", "goog.i18n.DateTimePatterns_mas_KE", "goog.i18n.DateTimePatterns_mas_TZ", "goog.i18n.DateTimePatterns_mer", "goog.i18n.DateTimePatterns_mer_KE", "goog.i18n.DateTimePatterns_mfe", "goog.i18n.DateTimePatterns_mfe_MU", 
"goog.i18n.DateTimePatterns_mg", "goog.i18n.DateTimePatterns_mg_MG", "goog.i18n.DateTimePatterns_mgh", "goog.i18n.DateTimePatterns_mgh_MZ", "goog.i18n.DateTimePatterns_mk", "goog.i18n.DateTimePatterns_mk_MK", "goog.i18n.DateTimePatterns_ml_IN", "goog.i18n.DateTimePatterns_mr_IN", "goog.i18n.DateTimePatterns_ms_BN", "goog.i18n.DateTimePatterns_ms_MY", "goog.i18n.DateTimePatterns_mt_MT", "goog.i18n.DateTimePatterns_mua", "goog.i18n.DateTimePatterns_mua_CM", "goog.i18n.DateTimePatterns_my", "goog.i18n.DateTimePatterns_my_MM", 
"goog.i18n.DateTimePatterns_naq", "goog.i18n.DateTimePatterns_naq_NA", "goog.i18n.DateTimePatterns_nb", "goog.i18n.DateTimePatterns_nb_NO", "goog.i18n.DateTimePatterns_nd", "goog.i18n.DateTimePatterns_nd_ZW", "goog.i18n.DateTimePatterns_ne", "goog.i18n.DateTimePatterns_ne_IN", "goog.i18n.DateTimePatterns_ne_NP", "goog.i18n.DateTimePatterns_nl_AW", "goog.i18n.DateTimePatterns_nl_BE", "goog.i18n.DateTimePatterns_nl_NL", "goog.i18n.DateTimePatterns_nmg", "goog.i18n.DateTimePatterns_nmg_CM", "goog.i18n.DateTimePatterns_nn", 
"goog.i18n.DateTimePatterns_nn_NO", "goog.i18n.DateTimePatterns_nus", "goog.i18n.DateTimePatterns_nus_SD", "goog.i18n.DateTimePatterns_nyn", "goog.i18n.DateTimePatterns_nyn_UG", "goog.i18n.DateTimePatterns_om", "goog.i18n.DateTimePatterns_om_ET", "goog.i18n.DateTimePatterns_om_KE", "goog.i18n.DateTimePatterns_or_IN", "goog.i18n.DateTimePatterns_pa", "goog.i18n.DateTimePatterns_pa_Arab", "goog.i18n.DateTimePatterns_pa_Arab_PK", "goog.i18n.DateTimePatterns_pa_Guru", "goog.i18n.DateTimePatterns_pa_Guru_IN", 
"goog.i18n.DateTimePatterns_pl_PL", "goog.i18n.DateTimePatterns_ps", "goog.i18n.DateTimePatterns_ps_AF", "goog.i18n.DateTimePatterns_pt_AO", "goog.i18n.DateTimePatterns_pt_GW", "goog.i18n.DateTimePatterns_pt_MZ", "goog.i18n.DateTimePatterns_pt_ST", "goog.i18n.DateTimePatterns_rm", "goog.i18n.DateTimePatterns_rm_CH", "goog.i18n.DateTimePatterns_rn", "goog.i18n.DateTimePatterns_rn_BI", "goog.i18n.DateTimePatterns_ro_MD", "goog.i18n.DateTimePatterns_ro_RO", "goog.i18n.DateTimePatterns_rof", "goog.i18n.DateTimePatterns_rof_TZ", 
"goog.i18n.DateTimePatterns_ru_MD", "goog.i18n.DateTimePatterns_ru_RU", "goog.i18n.DateTimePatterns_ru_UA", "goog.i18n.DateTimePatterns_rw", "goog.i18n.DateTimePatterns_rw_RW", "goog.i18n.DateTimePatterns_rwk", "goog.i18n.DateTimePatterns_rwk_TZ", "goog.i18n.DateTimePatterns_saq", "goog.i18n.DateTimePatterns_saq_KE", "goog.i18n.DateTimePatterns_sbp", "goog.i18n.DateTimePatterns_sbp_TZ", "goog.i18n.DateTimePatterns_seh", "goog.i18n.DateTimePatterns_seh_MZ", "goog.i18n.DateTimePatterns_ses", "goog.i18n.DateTimePatterns_ses_ML", 
"goog.i18n.DateTimePatterns_sg", "goog.i18n.DateTimePatterns_sg_CF", "goog.i18n.DateTimePatterns_shi", "goog.i18n.DateTimePatterns_shi_Latn", "goog.i18n.DateTimePatterns_shi_Latn_MA", "goog.i18n.DateTimePatterns_shi_Tfng", "goog.i18n.DateTimePatterns_shi_Tfng_MA", "goog.i18n.DateTimePatterns_si", "goog.i18n.DateTimePatterns_si_LK", "goog.i18n.DateTimePatterns_sk_SK", "goog.i18n.DateTimePatterns_sl_SI", "goog.i18n.DateTimePatterns_sn", "goog.i18n.DateTimePatterns_sn_ZW", "goog.i18n.DateTimePatterns_so", 
"goog.i18n.DateTimePatterns_so_DJ", "goog.i18n.DateTimePatterns_so_ET", "goog.i18n.DateTimePatterns_so_KE", "goog.i18n.DateTimePatterns_so_SO", "goog.i18n.DateTimePatterns_sq_AL", "goog.i18n.DateTimePatterns_sr_Cyrl", "goog.i18n.DateTimePatterns_sr_Cyrl_BA", "goog.i18n.DateTimePatterns_sr_Cyrl_ME", "goog.i18n.DateTimePatterns_sr_Cyrl_RS", "goog.i18n.DateTimePatterns_sr_Latn", "goog.i18n.DateTimePatterns_sr_Latn_BA", "goog.i18n.DateTimePatterns_sr_Latn_ME", "goog.i18n.DateTimePatterns_sr_Latn_RS", 
"goog.i18n.DateTimePatterns_sv_FI", "goog.i18n.DateTimePatterns_sv_SE", "goog.i18n.DateTimePatterns_sw_KE", "goog.i18n.DateTimePatterns_sw_TZ", "goog.i18n.DateTimePatterns_swc", "goog.i18n.DateTimePatterns_swc_CD", "goog.i18n.DateTimePatterns_ta_IN", "goog.i18n.DateTimePatterns_ta_LK", "goog.i18n.DateTimePatterns_te_IN", "goog.i18n.DateTimePatterns_teo", "goog.i18n.DateTimePatterns_teo_KE", "goog.i18n.DateTimePatterns_teo_UG", "goog.i18n.DateTimePatterns_th_TH", "goog.i18n.DateTimePatterns_ti", "goog.i18n.DateTimePatterns_ti_ER", 
"goog.i18n.DateTimePatterns_ti_ET", "goog.i18n.DateTimePatterns_to", "goog.i18n.DateTimePatterns_to_TO", "goog.i18n.DateTimePatterns_tr_TR", "goog.i18n.DateTimePatterns_twq", "goog.i18n.DateTimePatterns_twq_NE", "goog.i18n.DateTimePatterns_tzm", "goog.i18n.DateTimePatterns_tzm_Latn", "goog.i18n.DateTimePatterns_tzm_Latn_MA", "goog.i18n.DateTimePatterns_uk_UA", "goog.i18n.DateTimePatterns_ur_IN", "goog.i18n.DateTimePatterns_ur_PK", "goog.i18n.DateTimePatterns_uz", "goog.i18n.DateTimePatterns_uz_Arab", 
"goog.i18n.DateTimePatterns_uz_Arab_AF", "goog.i18n.DateTimePatterns_uz_Cyrl", "goog.i18n.DateTimePatterns_uz_Cyrl_UZ", "goog.i18n.DateTimePatterns_uz_Latn", "goog.i18n.DateTimePatterns_uz_Latn_UZ", "goog.i18n.DateTimePatterns_vai", "goog.i18n.DateTimePatterns_vai_Latn", "goog.i18n.DateTimePatterns_vai_Latn_LR", "goog.i18n.DateTimePatterns_vai_Vaii", "goog.i18n.DateTimePatterns_vai_Vaii_LR", "goog.i18n.DateTimePatterns_vi_VN", "goog.i18n.DateTimePatterns_vun", "goog.i18n.DateTimePatterns_vun_TZ", 
"goog.i18n.DateTimePatterns_xog", "goog.i18n.DateTimePatterns_xog_UG", "goog.i18n.DateTimePatterns_yav", "goog.i18n.DateTimePatterns_yav_CM", "goog.i18n.DateTimePatterns_yo", "goog.i18n.DateTimePatterns_yo_NG", "goog.i18n.DateTimePatterns_zh_Hans", "goog.i18n.DateTimePatterns_zh_Hans_CN", "goog.i18n.DateTimePatterns_zh_Hans_HK", "goog.i18n.DateTimePatterns_zh_Hans_MO", "goog.i18n.DateTimePatterns_zh_Hans_SG", "goog.i18n.DateTimePatterns_zh_Hant", "goog.i18n.DateTimePatterns_zh_Hant_HK", "goog.i18n.DateTimePatterns_zh_Hant_MO", 
"goog.i18n.DateTimePatterns_zh_Hant_TW", "goog.i18n.DateTimePatterns_zu_ZA"], ["goog.i18n.DateTimePatterns"]);
goog.addDependency("/closure/goog/i18n/datetimesymbols.js", ["goog.i18n.DateTimeSymbols", "goog.i18n.DateTimeSymbols_af", "goog.i18n.DateTimeSymbols_am", "goog.i18n.DateTimeSymbols_ar", "goog.i18n.DateTimeSymbols_bg", "goog.i18n.DateTimeSymbols_bn", "goog.i18n.DateTimeSymbols_ca", "goog.i18n.DateTimeSymbols_chr", "goog.i18n.DateTimeSymbols_cs", "goog.i18n.DateTimeSymbols_cy", "goog.i18n.DateTimeSymbols_da", "goog.i18n.DateTimeSymbols_de", "goog.i18n.DateTimeSymbols_de_AT", "goog.i18n.DateTimeSymbols_de_CH", 
"goog.i18n.DateTimeSymbols_el", "goog.i18n.DateTimeSymbols_en", "goog.i18n.DateTimeSymbols_en_AU", "goog.i18n.DateTimeSymbols_en_GB", "goog.i18n.DateTimeSymbols_en_IE", "goog.i18n.DateTimeSymbols_en_IN", "goog.i18n.DateTimeSymbols_en_ISO", "goog.i18n.DateTimeSymbols_en_SG", "goog.i18n.DateTimeSymbols_en_US", "goog.i18n.DateTimeSymbols_en_ZA", "goog.i18n.DateTimeSymbols_es", "goog.i18n.DateTimeSymbols_es_419", "goog.i18n.DateTimeSymbols_et", "goog.i18n.DateTimeSymbols_eu", "goog.i18n.DateTimeSymbols_fa", 
"goog.i18n.DateTimeSymbols_fi", "goog.i18n.DateTimeSymbols_fil", "goog.i18n.DateTimeSymbols_fr", "goog.i18n.DateTimeSymbols_fr_CA", "goog.i18n.DateTimeSymbols_gl", "goog.i18n.DateTimeSymbols_gsw", "goog.i18n.DateTimeSymbols_gu", "goog.i18n.DateTimeSymbols_haw", "goog.i18n.DateTimeSymbols_he", "goog.i18n.DateTimeSymbols_hi", "goog.i18n.DateTimeSymbols_hr", "goog.i18n.DateTimeSymbols_hu", "goog.i18n.DateTimeSymbols_id", "goog.i18n.DateTimeSymbols_in", "goog.i18n.DateTimeSymbols_is", "goog.i18n.DateTimeSymbols_it", 
"goog.i18n.DateTimeSymbols_iw", "goog.i18n.DateTimeSymbols_ja", "goog.i18n.DateTimeSymbols_kn", "goog.i18n.DateTimeSymbols_ko", "goog.i18n.DateTimeSymbols_ln", "goog.i18n.DateTimeSymbols_lt", "goog.i18n.DateTimeSymbols_lv", "goog.i18n.DateTimeSymbols_ml", "goog.i18n.DateTimeSymbols_mr", "goog.i18n.DateTimeSymbols_ms", "goog.i18n.DateTimeSymbols_mt", "goog.i18n.DateTimeSymbols_nl", "goog.i18n.DateTimeSymbols_no", "goog.i18n.DateTimeSymbols_or", "goog.i18n.DateTimeSymbols_pl", "goog.i18n.DateTimeSymbols_pt", 
"goog.i18n.DateTimeSymbols_pt_BR", "goog.i18n.DateTimeSymbols_pt_PT", "goog.i18n.DateTimeSymbols_ro", "goog.i18n.DateTimeSymbols_ru", "goog.i18n.DateTimeSymbols_sk", "goog.i18n.DateTimeSymbols_sl", "goog.i18n.DateTimeSymbols_sq", "goog.i18n.DateTimeSymbols_sr", "goog.i18n.DateTimeSymbols_sv", "goog.i18n.DateTimeSymbols_sw", "goog.i18n.DateTimeSymbols_ta", "goog.i18n.DateTimeSymbols_te", "goog.i18n.DateTimeSymbols_th", "goog.i18n.DateTimeSymbols_tl", "goog.i18n.DateTimeSymbols_tr", "goog.i18n.DateTimeSymbols_uk", 
"goog.i18n.DateTimeSymbols_ur", "goog.i18n.DateTimeSymbols_vi", "goog.i18n.DateTimeSymbols_zh", "goog.i18n.DateTimeSymbols_zh_CN", "goog.i18n.DateTimeSymbols_zh_HK", "goog.i18n.DateTimeSymbols_zh_TW", "goog.i18n.DateTimeSymbols_zu"], []);
goog.addDependency("/closure/goog/i18n/datetimesymbolsext.js", ["goog.i18n.DateTimeSymbolsExt", "goog.i18n.DateTimeSymbols_aa", "goog.i18n.DateTimeSymbols_aa_DJ", "goog.i18n.DateTimeSymbols_aa_ER", "goog.i18n.DateTimeSymbols_aa_ET", "goog.i18n.DateTimeSymbols_af_NA", "goog.i18n.DateTimeSymbols_af_ZA", "goog.i18n.DateTimeSymbols_agq", "goog.i18n.DateTimeSymbols_agq_CM", "goog.i18n.DateTimeSymbols_ak", "goog.i18n.DateTimeSymbols_ak_GH", "goog.i18n.DateTimeSymbols_am_ET", "goog.i18n.DateTimeSymbols_ar_AE", 
"goog.i18n.DateTimeSymbols_ar_BH", "goog.i18n.DateTimeSymbols_ar_DZ", "goog.i18n.DateTimeSymbols_ar_EG", "goog.i18n.DateTimeSymbols_ar_IQ", "goog.i18n.DateTimeSymbols_ar_JO", "goog.i18n.DateTimeSymbols_ar_KW", "goog.i18n.DateTimeSymbols_ar_LB", "goog.i18n.DateTimeSymbols_ar_LY", "goog.i18n.DateTimeSymbols_ar_MA", "goog.i18n.DateTimeSymbols_ar_OM", "goog.i18n.DateTimeSymbols_ar_QA", "goog.i18n.DateTimeSymbols_ar_SA", "goog.i18n.DateTimeSymbols_ar_SD", "goog.i18n.DateTimeSymbols_ar_SY", "goog.i18n.DateTimeSymbols_ar_TN", 
"goog.i18n.DateTimeSymbols_ar_YE", "goog.i18n.DateTimeSymbols_as", "goog.i18n.DateTimeSymbols_as_IN", "goog.i18n.DateTimeSymbols_asa", "goog.i18n.DateTimeSymbols_asa_TZ", "goog.i18n.DateTimeSymbols_az", "goog.i18n.DateTimeSymbols_az_Cyrl", "goog.i18n.DateTimeSymbols_az_Cyrl_AZ", "goog.i18n.DateTimeSymbols_az_Latn", "goog.i18n.DateTimeSymbols_az_Latn_AZ", "goog.i18n.DateTimeSymbols_bas", "goog.i18n.DateTimeSymbols_bas_CM", "goog.i18n.DateTimeSymbols_be", "goog.i18n.DateTimeSymbols_be_BY", "goog.i18n.DateTimeSymbols_bem", 
"goog.i18n.DateTimeSymbols_bem_ZM", "goog.i18n.DateTimeSymbols_bez", "goog.i18n.DateTimeSymbols_bez_TZ", "goog.i18n.DateTimeSymbols_bg_BG", "goog.i18n.DateTimeSymbols_bm", "goog.i18n.DateTimeSymbols_bm_ML", "goog.i18n.DateTimeSymbols_bn_BD", "goog.i18n.DateTimeSymbols_bn_IN", "goog.i18n.DateTimeSymbols_bo", "goog.i18n.DateTimeSymbols_bo_CN", "goog.i18n.DateTimeSymbols_bo_IN", "goog.i18n.DateTimeSymbols_br", "goog.i18n.DateTimeSymbols_br_FR", "goog.i18n.DateTimeSymbols_brx", "goog.i18n.DateTimeSymbols_brx_IN", 
"goog.i18n.DateTimeSymbols_bs", "goog.i18n.DateTimeSymbols_bs_BA", "goog.i18n.DateTimeSymbols_byn", "goog.i18n.DateTimeSymbols_byn_ER", "goog.i18n.DateTimeSymbols_ca_ES", "goog.i18n.DateTimeSymbols_cgg", "goog.i18n.DateTimeSymbols_cgg_UG", "goog.i18n.DateTimeSymbols_chr_US", "goog.i18n.DateTimeSymbols_ckb", "goog.i18n.DateTimeSymbols_ckb_Arab", "goog.i18n.DateTimeSymbols_ckb_Arab_IQ", "goog.i18n.DateTimeSymbols_ckb_Arab_IR", "goog.i18n.DateTimeSymbols_ckb_IQ", "goog.i18n.DateTimeSymbols_ckb_IR", 
"goog.i18n.DateTimeSymbols_ckb_Latn", "goog.i18n.DateTimeSymbols_ckb_Latn_IQ", "goog.i18n.DateTimeSymbols_cs_CZ", "goog.i18n.DateTimeSymbols_cy_GB", "goog.i18n.DateTimeSymbols_da_DK", "goog.i18n.DateTimeSymbols_dav", "goog.i18n.DateTimeSymbols_dav_KE", "goog.i18n.DateTimeSymbols_de_BE", "goog.i18n.DateTimeSymbols_de_DE", "goog.i18n.DateTimeSymbols_de_LI", "goog.i18n.DateTimeSymbols_de_LU", "goog.i18n.DateTimeSymbols_dje", "goog.i18n.DateTimeSymbols_dje_NE", "goog.i18n.DateTimeSymbols_dua", "goog.i18n.DateTimeSymbols_dua_CM", 
"goog.i18n.DateTimeSymbols_dyo", "goog.i18n.DateTimeSymbols_dyo_SN", "goog.i18n.DateTimeSymbols_dz", "goog.i18n.DateTimeSymbols_dz_BT", "goog.i18n.DateTimeSymbols_ebu", "goog.i18n.DateTimeSymbols_ebu_KE", "goog.i18n.DateTimeSymbols_ee", "goog.i18n.DateTimeSymbols_ee_GH", "goog.i18n.DateTimeSymbols_ee_TG", "goog.i18n.DateTimeSymbols_el_CY", "goog.i18n.DateTimeSymbols_el_GR", "goog.i18n.DateTimeSymbols_en_AS", "goog.i18n.DateTimeSymbols_en_BB", "goog.i18n.DateTimeSymbols_en_BE", "goog.i18n.DateTimeSymbols_en_BM", 
"goog.i18n.DateTimeSymbols_en_BW", "goog.i18n.DateTimeSymbols_en_BZ", "goog.i18n.DateTimeSymbols_en_CA", "goog.i18n.DateTimeSymbols_en_Dsrt", "goog.i18n.DateTimeSymbols_en_Dsrt_US", "goog.i18n.DateTimeSymbols_en_GU", "goog.i18n.DateTimeSymbols_en_GY", "goog.i18n.DateTimeSymbols_en_HK", "goog.i18n.DateTimeSymbols_en_JM", "goog.i18n.DateTimeSymbols_en_MH", "goog.i18n.DateTimeSymbols_en_MP", "goog.i18n.DateTimeSymbols_en_MT", "goog.i18n.DateTimeSymbols_en_MU", "goog.i18n.DateTimeSymbols_en_NA", "goog.i18n.DateTimeSymbols_en_NZ", 
"goog.i18n.DateTimeSymbols_en_PH", "goog.i18n.DateTimeSymbols_en_PK", "goog.i18n.DateTimeSymbols_en_TT", "goog.i18n.DateTimeSymbols_en_UM", "goog.i18n.DateTimeSymbols_en_VI", "goog.i18n.DateTimeSymbols_en_ZW", "goog.i18n.DateTimeSymbols_eo", "goog.i18n.DateTimeSymbols_es_AR", "goog.i18n.DateTimeSymbols_es_BO", "goog.i18n.DateTimeSymbols_es_CL", "goog.i18n.DateTimeSymbols_es_CO", "goog.i18n.DateTimeSymbols_es_CR", "goog.i18n.DateTimeSymbols_es_DO", "goog.i18n.DateTimeSymbols_es_EC", "goog.i18n.DateTimeSymbols_es_ES", 
"goog.i18n.DateTimeSymbols_es_GQ", "goog.i18n.DateTimeSymbols_es_GT", "goog.i18n.DateTimeSymbols_es_HN", "goog.i18n.DateTimeSymbols_es_MX", "goog.i18n.DateTimeSymbols_es_NI", "goog.i18n.DateTimeSymbols_es_PA", "goog.i18n.DateTimeSymbols_es_PE", "goog.i18n.DateTimeSymbols_es_PR", "goog.i18n.DateTimeSymbols_es_PY", "goog.i18n.DateTimeSymbols_es_SV", "goog.i18n.DateTimeSymbols_es_US", "goog.i18n.DateTimeSymbols_es_UY", "goog.i18n.DateTimeSymbols_es_VE", "goog.i18n.DateTimeSymbols_et_EE", "goog.i18n.DateTimeSymbols_eu_ES", 
"goog.i18n.DateTimeSymbols_ewo", "goog.i18n.DateTimeSymbols_ewo_CM", "goog.i18n.DateTimeSymbols_fa_AF", "goog.i18n.DateTimeSymbols_fa_IR", "goog.i18n.DateTimeSymbols_ff", "goog.i18n.DateTimeSymbols_ff_SN", "goog.i18n.DateTimeSymbols_fi_FI", "goog.i18n.DateTimeSymbols_fil_PH", "goog.i18n.DateTimeSymbols_fo", "goog.i18n.DateTimeSymbols_fo_FO", "goog.i18n.DateTimeSymbols_fr_BE", "goog.i18n.DateTimeSymbols_fr_BF", "goog.i18n.DateTimeSymbols_fr_BI", "goog.i18n.DateTimeSymbols_fr_BJ", "goog.i18n.DateTimeSymbols_fr_BL", 
"goog.i18n.DateTimeSymbols_fr_CD", "goog.i18n.DateTimeSymbols_fr_CF", "goog.i18n.DateTimeSymbols_fr_CG", "goog.i18n.DateTimeSymbols_fr_CH", "goog.i18n.DateTimeSymbols_fr_CI", "goog.i18n.DateTimeSymbols_fr_CM", "goog.i18n.DateTimeSymbols_fr_DJ", "goog.i18n.DateTimeSymbols_fr_FR", "goog.i18n.DateTimeSymbols_fr_GA", "goog.i18n.DateTimeSymbols_fr_GF", "goog.i18n.DateTimeSymbols_fr_GN", "goog.i18n.DateTimeSymbols_fr_GP", "goog.i18n.DateTimeSymbols_fr_GQ", "goog.i18n.DateTimeSymbols_fr_KM", "goog.i18n.DateTimeSymbols_fr_LU", 
"goog.i18n.DateTimeSymbols_fr_MC", "goog.i18n.DateTimeSymbols_fr_MF", "goog.i18n.DateTimeSymbols_fr_MG", "goog.i18n.DateTimeSymbols_fr_ML", "goog.i18n.DateTimeSymbols_fr_MQ", "goog.i18n.DateTimeSymbols_fr_NE", "goog.i18n.DateTimeSymbols_fr_RE", "goog.i18n.DateTimeSymbols_fr_RW", "goog.i18n.DateTimeSymbols_fr_SN", "goog.i18n.DateTimeSymbols_fr_TD", "goog.i18n.DateTimeSymbols_fr_TG", "goog.i18n.DateTimeSymbols_fr_YT", "goog.i18n.DateTimeSymbols_fur", "goog.i18n.DateTimeSymbols_fur_IT", "goog.i18n.DateTimeSymbols_ga", 
"goog.i18n.DateTimeSymbols_ga_IE", "goog.i18n.DateTimeSymbols_gl_ES", "goog.i18n.DateTimeSymbols_gsw_CH", "goog.i18n.DateTimeSymbols_gu_IN", "goog.i18n.DateTimeSymbols_guz", "goog.i18n.DateTimeSymbols_guz_KE", "goog.i18n.DateTimeSymbols_gv", "goog.i18n.DateTimeSymbols_gv_GB", "goog.i18n.DateTimeSymbols_ha", "goog.i18n.DateTimeSymbols_ha_Latn", "goog.i18n.DateTimeSymbols_ha_Latn_GH", "goog.i18n.DateTimeSymbols_ha_Latn_NE", "goog.i18n.DateTimeSymbols_ha_Latn_NG", "goog.i18n.DateTimeSymbols_haw_US", 
"goog.i18n.DateTimeSymbols_he_IL", "goog.i18n.DateTimeSymbols_hi_IN", "goog.i18n.DateTimeSymbols_hr_HR", "goog.i18n.DateTimeSymbols_hu_HU", "goog.i18n.DateTimeSymbols_hy", "goog.i18n.DateTimeSymbols_hy_AM", "goog.i18n.DateTimeSymbols_ia", "goog.i18n.DateTimeSymbols_id_ID", "goog.i18n.DateTimeSymbols_ig", "goog.i18n.DateTimeSymbols_ig_NG", "goog.i18n.DateTimeSymbols_ii", "goog.i18n.DateTimeSymbols_ii_CN", "goog.i18n.DateTimeSymbols_is_IS", "goog.i18n.DateTimeSymbols_it_CH", "goog.i18n.DateTimeSymbols_it_IT", 
"goog.i18n.DateTimeSymbols_ja_JP", "goog.i18n.DateTimeSymbols_jmc", "goog.i18n.DateTimeSymbols_jmc_TZ", "goog.i18n.DateTimeSymbols_ka", "goog.i18n.DateTimeSymbols_ka_GE", "goog.i18n.DateTimeSymbols_kab", "goog.i18n.DateTimeSymbols_kab_DZ", "goog.i18n.DateTimeSymbols_kam", "goog.i18n.DateTimeSymbols_kam_KE", "goog.i18n.DateTimeSymbols_kde", "goog.i18n.DateTimeSymbols_kde_TZ", "goog.i18n.DateTimeSymbols_kea", "goog.i18n.DateTimeSymbols_kea_CV", "goog.i18n.DateTimeSymbols_khq", "goog.i18n.DateTimeSymbols_khq_ML", 
"goog.i18n.DateTimeSymbols_ki", "goog.i18n.DateTimeSymbols_ki_KE", "goog.i18n.DateTimeSymbols_kk", "goog.i18n.DateTimeSymbols_kk_Cyrl", "goog.i18n.DateTimeSymbols_kk_Cyrl_KZ", "goog.i18n.DateTimeSymbols_kl", "goog.i18n.DateTimeSymbols_kl_GL", "goog.i18n.DateTimeSymbols_kln", "goog.i18n.DateTimeSymbols_kln_KE", "goog.i18n.DateTimeSymbols_km", "goog.i18n.DateTimeSymbols_km_KH", "goog.i18n.DateTimeSymbols_kn_IN", "goog.i18n.DateTimeSymbols_ko_KR", "goog.i18n.DateTimeSymbols_kok", "goog.i18n.DateTimeSymbols_kok_IN", 
"goog.i18n.DateTimeSymbols_ksb", "goog.i18n.DateTimeSymbols_ksb_TZ", "goog.i18n.DateTimeSymbols_ksf", "goog.i18n.DateTimeSymbols_ksf_CM", "goog.i18n.DateTimeSymbols_ksh", "goog.i18n.DateTimeSymbols_ksh_DE", "goog.i18n.DateTimeSymbols_ku", "goog.i18n.DateTimeSymbols_kw", "goog.i18n.DateTimeSymbols_kw_GB", "goog.i18n.DateTimeSymbols_lag", "goog.i18n.DateTimeSymbols_lag_TZ", "goog.i18n.DateTimeSymbols_lg", "goog.i18n.DateTimeSymbols_lg_UG", "goog.i18n.DateTimeSymbols_ln_CD", "goog.i18n.DateTimeSymbols_ln_CG", 
"goog.i18n.DateTimeSymbols_lo", "goog.i18n.DateTimeSymbols_lo_LA", "goog.i18n.DateTimeSymbols_lt_LT", "goog.i18n.DateTimeSymbols_lu", "goog.i18n.DateTimeSymbols_lu_CD", "goog.i18n.DateTimeSymbols_luo", "goog.i18n.DateTimeSymbols_luo_KE", "goog.i18n.DateTimeSymbols_luy", "goog.i18n.DateTimeSymbols_luy_KE", "goog.i18n.DateTimeSymbols_lv_LV", "goog.i18n.DateTimeSymbols_mas", "goog.i18n.DateTimeSymbols_mas_KE", "goog.i18n.DateTimeSymbols_mas_TZ", "goog.i18n.DateTimeSymbols_mer", "goog.i18n.DateTimeSymbols_mer_KE", 
"goog.i18n.DateTimeSymbols_mfe", "goog.i18n.DateTimeSymbols_mfe_MU", "goog.i18n.DateTimeSymbols_mg", "goog.i18n.DateTimeSymbols_mg_MG", "goog.i18n.DateTimeSymbols_mgh", "goog.i18n.DateTimeSymbols_mgh_MZ", "goog.i18n.DateTimeSymbols_mk", "goog.i18n.DateTimeSymbols_mk_MK", "goog.i18n.DateTimeSymbols_ml_IN", "goog.i18n.DateTimeSymbols_mr_IN", "goog.i18n.DateTimeSymbols_ms_BN", "goog.i18n.DateTimeSymbols_ms_MY", "goog.i18n.DateTimeSymbols_mt_MT", "goog.i18n.DateTimeSymbols_mua", "goog.i18n.DateTimeSymbols_mua_CM", 
"goog.i18n.DateTimeSymbols_my", "goog.i18n.DateTimeSymbols_my_MM", "goog.i18n.DateTimeSymbols_naq", "goog.i18n.DateTimeSymbols_naq_NA", "goog.i18n.DateTimeSymbols_nb", "goog.i18n.DateTimeSymbols_nb_NO", "goog.i18n.DateTimeSymbols_nd", "goog.i18n.DateTimeSymbols_nd_ZW", "goog.i18n.DateTimeSymbols_ne", "goog.i18n.DateTimeSymbols_ne_IN", "goog.i18n.DateTimeSymbols_ne_NP", "goog.i18n.DateTimeSymbols_nl_AW", "goog.i18n.DateTimeSymbols_nl_BE", "goog.i18n.DateTimeSymbols_nl_NL", "goog.i18n.DateTimeSymbols_nmg", 
"goog.i18n.DateTimeSymbols_nmg_CM", "goog.i18n.DateTimeSymbols_nn", "goog.i18n.DateTimeSymbols_nn_NO", "goog.i18n.DateTimeSymbols_nr", "goog.i18n.DateTimeSymbols_nr_ZA", "goog.i18n.DateTimeSymbols_nso", "goog.i18n.DateTimeSymbols_nso_ZA", "goog.i18n.DateTimeSymbols_nus", "goog.i18n.DateTimeSymbols_nus_SD", "goog.i18n.DateTimeSymbols_nyn", "goog.i18n.DateTimeSymbols_nyn_UG", "goog.i18n.DateTimeSymbols_om", "goog.i18n.DateTimeSymbols_om_ET", "goog.i18n.DateTimeSymbols_om_KE", "goog.i18n.DateTimeSymbols_or_IN", 
"goog.i18n.DateTimeSymbols_pa", "goog.i18n.DateTimeSymbols_pa_Arab", "goog.i18n.DateTimeSymbols_pa_Arab_PK", "goog.i18n.DateTimeSymbols_pa_Guru", "goog.i18n.DateTimeSymbols_pa_Guru_IN", "goog.i18n.DateTimeSymbols_pl_PL", "goog.i18n.DateTimeSymbols_ps", "goog.i18n.DateTimeSymbols_ps_AF", "goog.i18n.DateTimeSymbols_pt_AO", "goog.i18n.DateTimeSymbols_pt_GW", "goog.i18n.DateTimeSymbols_pt_MZ", "goog.i18n.DateTimeSymbols_pt_ST", "goog.i18n.DateTimeSymbols_rm", "goog.i18n.DateTimeSymbols_rm_CH", "goog.i18n.DateTimeSymbols_rn", 
"goog.i18n.DateTimeSymbols_rn_BI", "goog.i18n.DateTimeSymbols_ro_MD", "goog.i18n.DateTimeSymbols_ro_RO", "goog.i18n.DateTimeSymbols_rof", "goog.i18n.DateTimeSymbols_rof_TZ", "goog.i18n.DateTimeSymbols_ru_MD", "goog.i18n.DateTimeSymbols_ru_RU", "goog.i18n.DateTimeSymbols_ru_UA", "goog.i18n.DateTimeSymbols_rw", "goog.i18n.DateTimeSymbols_rw_RW", "goog.i18n.DateTimeSymbols_rwk", "goog.i18n.DateTimeSymbols_rwk_TZ", "goog.i18n.DateTimeSymbols_sah", "goog.i18n.DateTimeSymbols_sah_RU", "goog.i18n.DateTimeSymbols_saq", 
"goog.i18n.DateTimeSymbols_saq_KE", "goog.i18n.DateTimeSymbols_sbp", "goog.i18n.DateTimeSymbols_sbp_TZ", "goog.i18n.DateTimeSymbols_se", "goog.i18n.DateTimeSymbols_se_FI", "goog.i18n.DateTimeSymbols_se_NO", "goog.i18n.DateTimeSymbols_seh", "goog.i18n.DateTimeSymbols_seh_MZ", "goog.i18n.DateTimeSymbols_ses", "goog.i18n.DateTimeSymbols_ses_ML", "goog.i18n.DateTimeSymbols_sg", "goog.i18n.DateTimeSymbols_sg_CF", "goog.i18n.DateTimeSymbols_shi", "goog.i18n.DateTimeSymbols_shi_Latn", "goog.i18n.DateTimeSymbols_shi_Latn_MA", 
"goog.i18n.DateTimeSymbols_shi_Tfng", "goog.i18n.DateTimeSymbols_shi_Tfng_MA", "goog.i18n.DateTimeSymbols_si", "goog.i18n.DateTimeSymbols_si_LK", "goog.i18n.DateTimeSymbols_sk_SK", "goog.i18n.DateTimeSymbols_sl_SI", "goog.i18n.DateTimeSymbols_sn", "goog.i18n.DateTimeSymbols_sn_ZW", "goog.i18n.DateTimeSymbols_so", "goog.i18n.DateTimeSymbols_so_DJ", "goog.i18n.DateTimeSymbols_so_ET", "goog.i18n.DateTimeSymbols_so_KE", "goog.i18n.DateTimeSymbols_so_SO", "goog.i18n.DateTimeSymbols_sq_AL", "goog.i18n.DateTimeSymbols_sr_Cyrl", 
"goog.i18n.DateTimeSymbols_sr_Cyrl_BA", "goog.i18n.DateTimeSymbols_sr_Cyrl_ME", "goog.i18n.DateTimeSymbols_sr_Cyrl_RS", "goog.i18n.DateTimeSymbols_sr_Latn", "goog.i18n.DateTimeSymbols_sr_Latn_BA", "goog.i18n.DateTimeSymbols_sr_Latn_ME", "goog.i18n.DateTimeSymbols_sr_Latn_RS", "goog.i18n.DateTimeSymbols_ss", "goog.i18n.DateTimeSymbols_ss_SZ", "goog.i18n.DateTimeSymbols_ss_ZA", "goog.i18n.DateTimeSymbols_ssy", "goog.i18n.DateTimeSymbols_ssy_ER", "goog.i18n.DateTimeSymbols_st", "goog.i18n.DateTimeSymbols_st_LS", 
"goog.i18n.DateTimeSymbols_st_ZA", "goog.i18n.DateTimeSymbols_sv_FI", "goog.i18n.DateTimeSymbols_sv_SE", "goog.i18n.DateTimeSymbols_sw_KE", "goog.i18n.DateTimeSymbols_sw_TZ", "goog.i18n.DateTimeSymbols_swc", "goog.i18n.DateTimeSymbols_swc_CD", "goog.i18n.DateTimeSymbols_ta_IN", "goog.i18n.DateTimeSymbols_ta_LK", "goog.i18n.DateTimeSymbols_te_IN", "goog.i18n.DateTimeSymbols_teo", "goog.i18n.DateTimeSymbols_teo_KE", "goog.i18n.DateTimeSymbols_teo_UG", "goog.i18n.DateTimeSymbols_tg", "goog.i18n.DateTimeSymbols_tg_Cyrl", 
"goog.i18n.DateTimeSymbols_tg_Cyrl_TJ", "goog.i18n.DateTimeSymbols_th_TH", "goog.i18n.DateTimeSymbols_ti", "goog.i18n.DateTimeSymbols_ti_ER", "goog.i18n.DateTimeSymbols_ti_ET", "goog.i18n.DateTimeSymbols_tig", "goog.i18n.DateTimeSymbols_tig_ER", "goog.i18n.DateTimeSymbols_tn", "goog.i18n.DateTimeSymbols_tn_ZA", "goog.i18n.DateTimeSymbols_to", "goog.i18n.DateTimeSymbols_to_TO", "goog.i18n.DateTimeSymbols_tr_TR", "goog.i18n.DateTimeSymbols_ts", "goog.i18n.DateTimeSymbols_ts_ZA", "goog.i18n.DateTimeSymbols_twq", 
"goog.i18n.DateTimeSymbols_twq_NE", "goog.i18n.DateTimeSymbols_tzm", "goog.i18n.DateTimeSymbols_tzm_Latn", "goog.i18n.DateTimeSymbols_tzm_Latn_MA", "goog.i18n.DateTimeSymbols_uk_UA", "goog.i18n.DateTimeSymbols_ur_IN", "goog.i18n.DateTimeSymbols_ur_PK", "goog.i18n.DateTimeSymbols_uz", "goog.i18n.DateTimeSymbols_uz_Arab", "goog.i18n.DateTimeSymbols_uz_Arab_AF", "goog.i18n.DateTimeSymbols_uz_Cyrl", "goog.i18n.DateTimeSymbols_uz_Cyrl_UZ", "goog.i18n.DateTimeSymbols_uz_Latn", "goog.i18n.DateTimeSymbols_uz_Latn_UZ", 
"goog.i18n.DateTimeSymbols_vai", "goog.i18n.DateTimeSymbols_vai_Latn", "goog.i18n.DateTimeSymbols_vai_Latn_LR", "goog.i18n.DateTimeSymbols_vai_Vaii", "goog.i18n.DateTimeSymbols_vai_Vaii_LR", "goog.i18n.DateTimeSymbols_ve", "goog.i18n.DateTimeSymbols_ve_ZA", "goog.i18n.DateTimeSymbols_vi_VN", "goog.i18n.DateTimeSymbols_vun", "goog.i18n.DateTimeSymbols_vun_TZ", "goog.i18n.DateTimeSymbols_wae", "goog.i18n.DateTimeSymbols_wae_CH", "goog.i18n.DateTimeSymbols_wal", "goog.i18n.DateTimeSymbols_wal_ET", "goog.i18n.DateTimeSymbols_xh", 
"goog.i18n.DateTimeSymbols_xh_ZA", "goog.i18n.DateTimeSymbols_xog", "goog.i18n.DateTimeSymbols_xog_UG", "goog.i18n.DateTimeSymbols_yav", "goog.i18n.DateTimeSymbols_yav_CM", "goog.i18n.DateTimeSymbols_yo", "goog.i18n.DateTimeSymbols_yo_NG", "goog.i18n.DateTimeSymbols_zh_Hans", "goog.i18n.DateTimeSymbols_zh_Hans_CN", "goog.i18n.DateTimeSymbols_zh_Hans_HK", "goog.i18n.DateTimeSymbols_zh_Hans_MO", "goog.i18n.DateTimeSymbols_zh_Hans_SG", "goog.i18n.DateTimeSymbols_zh_Hant", "goog.i18n.DateTimeSymbols_zh_Hant_HK", 
"goog.i18n.DateTimeSymbols_zh_Hant_MO", "goog.i18n.DateTimeSymbols_zh_Hant_TW", "goog.i18n.DateTimeSymbols_zu_ZA"], ["goog.i18n.DateTimeSymbols"]);
goog.addDependency("/closure/goog/i18n/graphemebreak.js", ["goog.i18n.GraphemeBreak"], ["goog.structs.InversionMap"]);
goog.addDependency("/closure/goog/i18n/messageformat.js", ["goog.i18n.MessageFormat"], ["goog.asserts", "goog.i18n.NumberFormat", "goog.i18n.ordinalRules", "goog.i18n.pluralRules"]);
goog.addDependency("/closure/goog/i18n/mime.js", ["goog.i18n.mime", "goog.i18n.mime.encode"], []);
goog.addDependency("/closure/goog/i18n/numberformat.js", ["goog.i18n.NumberFormat", "goog.i18n.NumberFormat.CurrencyStyle", "goog.i18n.NumberFormat.Format"], ["goog.i18n.NumberFormatSymbols", "goog.i18n.currency"]);
goog.addDependency("/closure/goog/i18n/numberformatsymbols.js", ["goog.i18n.NumberFormatSymbols", "goog.i18n.NumberFormatSymbols_af", "goog.i18n.NumberFormatSymbols_af_ZA", "goog.i18n.NumberFormatSymbols_am", "goog.i18n.NumberFormatSymbols_am_ET", "goog.i18n.NumberFormatSymbols_ar", "goog.i18n.NumberFormatSymbols_ar_001", "goog.i18n.NumberFormatSymbols_ar_EG", "goog.i18n.NumberFormatSymbols_bg", "goog.i18n.NumberFormatSymbols_bg_BG", "goog.i18n.NumberFormatSymbols_bn", "goog.i18n.NumberFormatSymbols_bn_BD", 
"goog.i18n.NumberFormatSymbols_ca", "goog.i18n.NumberFormatSymbols_ca_ES", "goog.i18n.NumberFormatSymbols_chr", "goog.i18n.NumberFormatSymbols_chr_US", "goog.i18n.NumberFormatSymbols_cs", "goog.i18n.NumberFormatSymbols_cs_CZ", "goog.i18n.NumberFormatSymbols_cy", "goog.i18n.NumberFormatSymbols_cy_GB", "goog.i18n.NumberFormatSymbols_da", "goog.i18n.NumberFormatSymbols_da_DK", "goog.i18n.NumberFormatSymbols_de", "goog.i18n.NumberFormatSymbols_de_AT", "goog.i18n.NumberFormatSymbols_de_BE", "goog.i18n.NumberFormatSymbols_de_CH", 
"goog.i18n.NumberFormatSymbols_de_DE", "goog.i18n.NumberFormatSymbols_de_LU", "goog.i18n.NumberFormatSymbols_el", "goog.i18n.NumberFormatSymbols_el_GR", "goog.i18n.NumberFormatSymbols_en", "goog.i18n.NumberFormatSymbols_en_AS", "goog.i18n.NumberFormatSymbols_en_AU", "goog.i18n.NumberFormatSymbols_en_Dsrt", "goog.i18n.NumberFormatSymbols_en_Dsrt_US", "goog.i18n.NumberFormatSymbols_en_GB", "goog.i18n.NumberFormatSymbols_en_GU", "goog.i18n.NumberFormatSymbols_en_IE", "goog.i18n.NumberFormatSymbols_en_IN", 
"goog.i18n.NumberFormatSymbols_en_MH", "goog.i18n.NumberFormatSymbols_en_MP", "goog.i18n.NumberFormatSymbols_en_SG", "goog.i18n.NumberFormatSymbols_en_UM", "goog.i18n.NumberFormatSymbols_en_US", "goog.i18n.NumberFormatSymbols_en_VI", "goog.i18n.NumberFormatSymbols_en_ZA", "goog.i18n.NumberFormatSymbols_es", "goog.i18n.NumberFormatSymbols_es_419", "goog.i18n.NumberFormatSymbols_es_ES", "goog.i18n.NumberFormatSymbols_et", "goog.i18n.NumberFormatSymbols_et_EE", "goog.i18n.NumberFormatSymbols_eu", "goog.i18n.NumberFormatSymbols_eu_ES", 
"goog.i18n.NumberFormatSymbols_fa", "goog.i18n.NumberFormatSymbols_fa_IR", "goog.i18n.NumberFormatSymbols_fi", "goog.i18n.NumberFormatSymbols_fi_FI", "goog.i18n.NumberFormatSymbols_fil", "goog.i18n.NumberFormatSymbols_fil_PH", "goog.i18n.NumberFormatSymbols_fr", "goog.i18n.NumberFormatSymbols_fr_BL", "goog.i18n.NumberFormatSymbols_fr_CA", "goog.i18n.NumberFormatSymbols_fr_FR", "goog.i18n.NumberFormatSymbols_fr_GF", "goog.i18n.NumberFormatSymbols_fr_GP", "goog.i18n.NumberFormatSymbols_fr_MC", "goog.i18n.NumberFormatSymbols_fr_MF", 
"goog.i18n.NumberFormatSymbols_fr_MQ", "goog.i18n.NumberFormatSymbols_fr_RE", "goog.i18n.NumberFormatSymbols_fr_YT", "goog.i18n.NumberFormatSymbols_gl", "goog.i18n.NumberFormatSymbols_gl_ES", "goog.i18n.NumberFormatSymbols_gsw", "goog.i18n.NumberFormatSymbols_gsw_CH", "goog.i18n.NumberFormatSymbols_gu", "goog.i18n.NumberFormatSymbols_gu_IN", "goog.i18n.NumberFormatSymbols_haw", "goog.i18n.NumberFormatSymbols_haw_US", "goog.i18n.NumberFormatSymbols_he", "goog.i18n.NumberFormatSymbols_he_IL", "goog.i18n.NumberFormatSymbols_hi", 
"goog.i18n.NumberFormatSymbols_hi_IN", "goog.i18n.NumberFormatSymbols_hr", "goog.i18n.NumberFormatSymbols_hr_HR", "goog.i18n.NumberFormatSymbols_hu", "goog.i18n.NumberFormatSymbols_hu_HU", "goog.i18n.NumberFormatSymbols_id", "goog.i18n.NumberFormatSymbols_id_ID", "goog.i18n.NumberFormatSymbols_in", "goog.i18n.NumberFormatSymbols_is", "goog.i18n.NumberFormatSymbols_is_IS", "goog.i18n.NumberFormatSymbols_it", "goog.i18n.NumberFormatSymbols_it_IT", "goog.i18n.NumberFormatSymbols_iw", "goog.i18n.NumberFormatSymbols_ja", 
"goog.i18n.NumberFormatSymbols_ja_JP", "goog.i18n.NumberFormatSymbols_kn", "goog.i18n.NumberFormatSymbols_kn_IN", "goog.i18n.NumberFormatSymbols_ko", "goog.i18n.NumberFormatSymbols_ko_KR", "goog.i18n.NumberFormatSymbols_ln", "goog.i18n.NumberFormatSymbols_ln_CD", "goog.i18n.NumberFormatSymbols_lt", "goog.i18n.NumberFormatSymbols_lt_LT", "goog.i18n.NumberFormatSymbols_lv", "goog.i18n.NumberFormatSymbols_lv_LV", "goog.i18n.NumberFormatSymbols_ml", "goog.i18n.NumberFormatSymbols_ml_IN", "goog.i18n.NumberFormatSymbols_mr", 
"goog.i18n.NumberFormatSymbols_mr_IN", "goog.i18n.NumberFormatSymbols_ms", "goog.i18n.NumberFormatSymbols_ms_MY", "goog.i18n.NumberFormatSymbols_mt", "goog.i18n.NumberFormatSymbols_mt_MT", "goog.i18n.NumberFormatSymbols_nl", "goog.i18n.NumberFormatSymbols_nl_NL", "goog.i18n.NumberFormatSymbols_no", "goog.i18n.NumberFormatSymbols_or", "goog.i18n.NumberFormatSymbols_or_IN", "goog.i18n.NumberFormatSymbols_pl", "goog.i18n.NumberFormatSymbols_pl_PL", "goog.i18n.NumberFormatSymbols_pt", "goog.i18n.NumberFormatSymbols_pt_BR", 
"goog.i18n.NumberFormatSymbols_pt_PT", "goog.i18n.NumberFormatSymbols_ro", "goog.i18n.NumberFormatSymbols_ro_RO", "goog.i18n.NumberFormatSymbols_ru", "goog.i18n.NumberFormatSymbols_ru_RU", "goog.i18n.NumberFormatSymbols_sk", "goog.i18n.NumberFormatSymbols_sk_SK", "goog.i18n.NumberFormatSymbols_sl", "goog.i18n.NumberFormatSymbols_sl_SI", "goog.i18n.NumberFormatSymbols_sq", "goog.i18n.NumberFormatSymbols_sq_AL", "goog.i18n.NumberFormatSymbols_sr", "goog.i18n.NumberFormatSymbols_sr_Cyrl_RS", "goog.i18n.NumberFormatSymbols_sr_Latn_RS", 
"goog.i18n.NumberFormatSymbols_sv", "goog.i18n.NumberFormatSymbols_sv_SE", "goog.i18n.NumberFormatSymbols_sw", "goog.i18n.NumberFormatSymbols_sw_TZ", "goog.i18n.NumberFormatSymbols_ta", "goog.i18n.NumberFormatSymbols_ta_IN", "goog.i18n.NumberFormatSymbols_te", "goog.i18n.NumberFormatSymbols_te_IN", "goog.i18n.NumberFormatSymbols_th", "goog.i18n.NumberFormatSymbols_th_TH", "goog.i18n.NumberFormatSymbols_tl", "goog.i18n.NumberFormatSymbols_tr", "goog.i18n.NumberFormatSymbols_tr_TR", "goog.i18n.NumberFormatSymbols_uk", 
"goog.i18n.NumberFormatSymbols_uk_UA", "goog.i18n.NumberFormatSymbols_ur", "goog.i18n.NumberFormatSymbols_ur_PK", "goog.i18n.NumberFormatSymbols_vi", "goog.i18n.NumberFormatSymbols_vi_VN", "goog.i18n.NumberFormatSymbols_zh", "goog.i18n.NumberFormatSymbols_zh_CN", "goog.i18n.NumberFormatSymbols_zh_HK", "goog.i18n.NumberFormatSymbols_zh_Hans", "goog.i18n.NumberFormatSymbols_zh_Hans_CN", "goog.i18n.NumberFormatSymbols_zh_TW", "goog.i18n.NumberFormatSymbols_zu", "goog.i18n.NumberFormatSymbols_zu_ZA"], 
[]);
goog.addDependency("/closure/goog/i18n/numberformatsymbolsext.js", ["goog.i18n.NumberFormatSymbolsExt", "goog.i18n.NumberFormatSymbols_aa", "goog.i18n.NumberFormatSymbols_aa_DJ", "goog.i18n.NumberFormatSymbols_aa_ER", "goog.i18n.NumberFormatSymbols_aa_ET", "goog.i18n.NumberFormatSymbols_af_NA", "goog.i18n.NumberFormatSymbols_agq", "goog.i18n.NumberFormatSymbols_agq_CM", "goog.i18n.NumberFormatSymbols_ak", "goog.i18n.NumberFormatSymbols_ak_GH", "goog.i18n.NumberFormatSymbols_ar_AE", "goog.i18n.NumberFormatSymbols_ar_BH", 
"goog.i18n.NumberFormatSymbols_ar_DZ", "goog.i18n.NumberFormatSymbols_ar_IQ", "goog.i18n.NumberFormatSymbols_ar_JO", "goog.i18n.NumberFormatSymbols_ar_KW", "goog.i18n.NumberFormatSymbols_ar_LB", "goog.i18n.NumberFormatSymbols_ar_LY", "goog.i18n.NumberFormatSymbols_ar_MA", "goog.i18n.NumberFormatSymbols_ar_OM", "goog.i18n.NumberFormatSymbols_ar_QA", "goog.i18n.NumberFormatSymbols_ar_SA", "goog.i18n.NumberFormatSymbols_ar_SD", "goog.i18n.NumberFormatSymbols_ar_SY", "goog.i18n.NumberFormatSymbols_ar_TN", 
"goog.i18n.NumberFormatSymbols_ar_YE", "goog.i18n.NumberFormatSymbols_as", "goog.i18n.NumberFormatSymbols_as_IN", "goog.i18n.NumberFormatSymbols_asa", "goog.i18n.NumberFormatSymbols_asa_TZ", "goog.i18n.NumberFormatSymbols_az", "goog.i18n.NumberFormatSymbols_az_Cyrl", "goog.i18n.NumberFormatSymbols_az_Cyrl_AZ", "goog.i18n.NumberFormatSymbols_az_Latn", "goog.i18n.NumberFormatSymbols_az_Latn_AZ", "goog.i18n.NumberFormatSymbols_bas", "goog.i18n.NumberFormatSymbols_bas_CM", "goog.i18n.NumberFormatSymbols_be", 
"goog.i18n.NumberFormatSymbols_be_BY", "goog.i18n.NumberFormatSymbols_bem", "goog.i18n.NumberFormatSymbols_bem_ZM", "goog.i18n.NumberFormatSymbols_bez", "goog.i18n.NumberFormatSymbols_bez_TZ", "goog.i18n.NumberFormatSymbols_bm", "goog.i18n.NumberFormatSymbols_bm_ML", "goog.i18n.NumberFormatSymbols_bn_IN", "goog.i18n.NumberFormatSymbols_bo", "goog.i18n.NumberFormatSymbols_bo_CN", "goog.i18n.NumberFormatSymbols_bo_IN", "goog.i18n.NumberFormatSymbols_br", "goog.i18n.NumberFormatSymbols_br_FR", "goog.i18n.NumberFormatSymbols_brx", 
"goog.i18n.NumberFormatSymbols_brx_IN", "goog.i18n.NumberFormatSymbols_bs", "goog.i18n.NumberFormatSymbols_bs_BA", "goog.i18n.NumberFormatSymbols_byn", "goog.i18n.NumberFormatSymbols_byn_ER", "goog.i18n.NumberFormatSymbols_cgg", "goog.i18n.NumberFormatSymbols_cgg_UG", "goog.i18n.NumberFormatSymbols_ckb", "goog.i18n.NumberFormatSymbols_ckb_Arab", "goog.i18n.NumberFormatSymbols_ckb_Arab_IQ", "goog.i18n.NumberFormatSymbols_ckb_Arab_IR", "goog.i18n.NumberFormatSymbols_ckb_IQ", "goog.i18n.NumberFormatSymbols_ckb_IR", 
"goog.i18n.NumberFormatSymbols_ckb_Latn", "goog.i18n.NumberFormatSymbols_ckb_Latn_IQ", "goog.i18n.NumberFormatSymbols_dav", "goog.i18n.NumberFormatSymbols_dav_KE", "goog.i18n.NumberFormatSymbols_de_LI", "goog.i18n.NumberFormatSymbols_dje", "goog.i18n.NumberFormatSymbols_dje_NE", "goog.i18n.NumberFormatSymbols_dua", "goog.i18n.NumberFormatSymbols_dua_CM", "goog.i18n.NumberFormatSymbols_dyo", "goog.i18n.NumberFormatSymbols_dyo_SN", "goog.i18n.NumberFormatSymbols_dz", "goog.i18n.NumberFormatSymbols_dz_BT", 
"goog.i18n.NumberFormatSymbols_ebu", "goog.i18n.NumberFormatSymbols_ebu_KE", "goog.i18n.NumberFormatSymbols_ee", "goog.i18n.NumberFormatSymbols_ee_GH", "goog.i18n.NumberFormatSymbols_ee_TG", "goog.i18n.NumberFormatSymbols_el_CY", "goog.i18n.NumberFormatSymbols_en_BB", "goog.i18n.NumberFormatSymbols_en_BE", "goog.i18n.NumberFormatSymbols_en_BM", "goog.i18n.NumberFormatSymbols_en_BW", "goog.i18n.NumberFormatSymbols_en_BZ", "goog.i18n.NumberFormatSymbols_en_CA", "goog.i18n.NumberFormatSymbols_en_GY", 
"goog.i18n.NumberFormatSymbols_en_HK", "goog.i18n.NumberFormatSymbols_en_JM", "goog.i18n.NumberFormatSymbols_en_MT", "goog.i18n.NumberFormatSymbols_en_MU", "goog.i18n.NumberFormatSymbols_en_NA", "goog.i18n.NumberFormatSymbols_en_NZ", "goog.i18n.NumberFormatSymbols_en_PH", "goog.i18n.NumberFormatSymbols_en_PK", "goog.i18n.NumberFormatSymbols_en_TT", "goog.i18n.NumberFormatSymbols_en_ZW", "goog.i18n.NumberFormatSymbols_eo", "goog.i18n.NumberFormatSymbols_es_AR", "goog.i18n.NumberFormatSymbols_es_BO", 
"goog.i18n.NumberFormatSymbols_es_CL", "goog.i18n.NumberFormatSymbols_es_CO", "goog.i18n.NumberFormatSymbols_es_CR", "goog.i18n.NumberFormatSymbols_es_DO", "goog.i18n.NumberFormatSymbols_es_EC", "goog.i18n.NumberFormatSymbols_es_GQ", "goog.i18n.NumberFormatSymbols_es_GT", "goog.i18n.NumberFormatSymbols_es_HN", "goog.i18n.NumberFormatSymbols_es_MX", "goog.i18n.NumberFormatSymbols_es_NI", "goog.i18n.NumberFormatSymbols_es_PA", "goog.i18n.NumberFormatSymbols_es_PE", "goog.i18n.NumberFormatSymbols_es_PR", 
"goog.i18n.NumberFormatSymbols_es_PY", "goog.i18n.NumberFormatSymbols_es_SV", "goog.i18n.NumberFormatSymbols_es_US", "goog.i18n.NumberFormatSymbols_es_UY", "goog.i18n.NumberFormatSymbols_es_VE", "goog.i18n.NumberFormatSymbols_ewo", "goog.i18n.NumberFormatSymbols_ewo_CM", "goog.i18n.NumberFormatSymbols_fa_AF", "goog.i18n.NumberFormatSymbols_ff", "goog.i18n.NumberFormatSymbols_ff_SN", "goog.i18n.NumberFormatSymbols_fo", "goog.i18n.NumberFormatSymbols_fo_FO", "goog.i18n.NumberFormatSymbols_fr_BE", "goog.i18n.NumberFormatSymbols_fr_BF", 
"goog.i18n.NumberFormatSymbols_fr_BI", "goog.i18n.NumberFormatSymbols_fr_BJ", "goog.i18n.NumberFormatSymbols_fr_CD", "goog.i18n.NumberFormatSymbols_fr_CF", "goog.i18n.NumberFormatSymbols_fr_CG", "goog.i18n.NumberFormatSymbols_fr_CH", "goog.i18n.NumberFormatSymbols_fr_CI", "goog.i18n.NumberFormatSymbols_fr_CM", "goog.i18n.NumberFormatSymbols_fr_DJ", "goog.i18n.NumberFormatSymbols_fr_GA", "goog.i18n.NumberFormatSymbols_fr_GN", "goog.i18n.NumberFormatSymbols_fr_GQ", "goog.i18n.NumberFormatSymbols_fr_KM", 
"goog.i18n.NumberFormatSymbols_fr_LU", "goog.i18n.NumberFormatSymbols_fr_MG", "goog.i18n.NumberFormatSymbols_fr_ML", "goog.i18n.NumberFormatSymbols_fr_NE", "goog.i18n.NumberFormatSymbols_fr_RW", "goog.i18n.NumberFormatSymbols_fr_SN", "goog.i18n.NumberFormatSymbols_fr_TD", "goog.i18n.NumberFormatSymbols_fr_TG", "goog.i18n.NumberFormatSymbols_fur", "goog.i18n.NumberFormatSymbols_fur_IT", "goog.i18n.NumberFormatSymbols_ga", "goog.i18n.NumberFormatSymbols_ga_IE", "goog.i18n.NumberFormatSymbols_gd", "goog.i18n.NumberFormatSymbols_gd_GB", 
"goog.i18n.NumberFormatSymbols_guz", "goog.i18n.NumberFormatSymbols_guz_KE", "goog.i18n.NumberFormatSymbols_gv", "goog.i18n.NumberFormatSymbols_gv_GB", "goog.i18n.NumberFormatSymbols_ha", "goog.i18n.NumberFormatSymbols_ha_Latn", "goog.i18n.NumberFormatSymbols_ha_Latn_GH", "goog.i18n.NumberFormatSymbols_ha_Latn_NE", "goog.i18n.NumberFormatSymbols_ha_Latn_NG", "goog.i18n.NumberFormatSymbols_hy", "goog.i18n.NumberFormatSymbols_hy_AM", "goog.i18n.NumberFormatSymbols_ia", "goog.i18n.NumberFormatSymbols_ig", 
"goog.i18n.NumberFormatSymbols_ig_NG", "goog.i18n.NumberFormatSymbols_ii", "goog.i18n.NumberFormatSymbols_ii_CN", "goog.i18n.NumberFormatSymbols_it_CH", "goog.i18n.NumberFormatSymbols_jmc", "goog.i18n.NumberFormatSymbols_jmc_TZ", "goog.i18n.NumberFormatSymbols_ka", "goog.i18n.NumberFormatSymbols_ka_GE", "goog.i18n.NumberFormatSymbols_kab", "goog.i18n.NumberFormatSymbols_kab_DZ", "goog.i18n.NumberFormatSymbols_kam", "goog.i18n.NumberFormatSymbols_kam_KE", "goog.i18n.NumberFormatSymbols_kde", "goog.i18n.NumberFormatSymbols_kde_TZ", 
"goog.i18n.NumberFormatSymbols_kea", "goog.i18n.NumberFormatSymbols_kea_CV", "goog.i18n.NumberFormatSymbols_khq", "goog.i18n.NumberFormatSymbols_khq_ML", "goog.i18n.NumberFormatSymbols_ki", "goog.i18n.NumberFormatSymbols_ki_KE", "goog.i18n.NumberFormatSymbols_kk", "goog.i18n.NumberFormatSymbols_kk_Cyrl", "goog.i18n.NumberFormatSymbols_kk_Cyrl_KZ", "goog.i18n.NumberFormatSymbols_kl", "goog.i18n.NumberFormatSymbols_kl_GL", "goog.i18n.NumberFormatSymbols_kln", "goog.i18n.NumberFormatSymbols_kln_KE", 
"goog.i18n.NumberFormatSymbols_km", "goog.i18n.NumberFormatSymbols_km_KH", "goog.i18n.NumberFormatSymbols_kok", "goog.i18n.NumberFormatSymbols_kok_IN", "goog.i18n.NumberFormatSymbols_ksb", "goog.i18n.NumberFormatSymbols_ksb_TZ", "goog.i18n.NumberFormatSymbols_ksf", "goog.i18n.NumberFormatSymbols_ksf_CM", "goog.i18n.NumberFormatSymbols_ksh", "goog.i18n.NumberFormatSymbols_ksh_DE", "goog.i18n.NumberFormatSymbols_ku", "goog.i18n.NumberFormatSymbols_kw", "goog.i18n.NumberFormatSymbols_kw_GB", "goog.i18n.NumberFormatSymbols_lag", 
"goog.i18n.NumberFormatSymbols_lag_TZ", "goog.i18n.NumberFormatSymbols_lg", "goog.i18n.NumberFormatSymbols_lg_UG", "goog.i18n.NumberFormatSymbols_ln_CG", "goog.i18n.NumberFormatSymbols_lo", "goog.i18n.NumberFormatSymbols_lo_LA", "goog.i18n.NumberFormatSymbols_lu", "goog.i18n.NumberFormatSymbols_lu_CD", "goog.i18n.NumberFormatSymbols_luo", "goog.i18n.NumberFormatSymbols_luo_KE", "goog.i18n.NumberFormatSymbols_luy", "goog.i18n.NumberFormatSymbols_luy_KE", "goog.i18n.NumberFormatSymbols_mas", "goog.i18n.NumberFormatSymbols_mas_KE", 
"goog.i18n.NumberFormatSymbols_mas_TZ", "goog.i18n.NumberFormatSymbols_mer", "goog.i18n.NumberFormatSymbols_mer_KE", "goog.i18n.NumberFormatSymbols_mfe", "goog.i18n.NumberFormatSymbols_mfe_MU", "goog.i18n.NumberFormatSymbols_mg", "goog.i18n.NumberFormatSymbols_mg_MG", "goog.i18n.NumberFormatSymbols_mgh", "goog.i18n.NumberFormatSymbols_mgh_MZ", "goog.i18n.NumberFormatSymbols_mk", "goog.i18n.NumberFormatSymbols_mk_MK", "goog.i18n.NumberFormatSymbols_ms_BN", "goog.i18n.NumberFormatSymbols_mua", "goog.i18n.NumberFormatSymbols_mua_CM", 
"goog.i18n.NumberFormatSymbols_my", "goog.i18n.NumberFormatSymbols_my_MM", "goog.i18n.NumberFormatSymbols_naq", "goog.i18n.NumberFormatSymbols_naq_NA", "goog.i18n.NumberFormatSymbols_nb", "goog.i18n.NumberFormatSymbols_nb_NO", "goog.i18n.NumberFormatSymbols_nd", "goog.i18n.NumberFormatSymbols_nd_ZW", "goog.i18n.NumberFormatSymbols_ne", "goog.i18n.NumberFormatSymbols_ne_IN", "goog.i18n.NumberFormatSymbols_ne_NP", "goog.i18n.NumberFormatSymbols_nl_AW", "goog.i18n.NumberFormatSymbols_nl_BE", "goog.i18n.NumberFormatSymbols_nl_CW", 
"goog.i18n.NumberFormatSymbols_nl_SX", "goog.i18n.NumberFormatSymbols_nmg", "goog.i18n.NumberFormatSymbols_nmg_CM", "goog.i18n.NumberFormatSymbols_nn", "goog.i18n.NumberFormatSymbols_nn_NO", "goog.i18n.NumberFormatSymbols_nr", "goog.i18n.NumberFormatSymbols_nr_ZA", "goog.i18n.NumberFormatSymbols_nso", "goog.i18n.NumberFormatSymbols_nso_ZA", "goog.i18n.NumberFormatSymbols_nus", "goog.i18n.NumberFormatSymbols_nus_SD", "goog.i18n.NumberFormatSymbols_nyn", "goog.i18n.NumberFormatSymbols_nyn_UG", "goog.i18n.NumberFormatSymbols_om", 
"goog.i18n.NumberFormatSymbols_om_ET", "goog.i18n.NumberFormatSymbols_om_KE", "goog.i18n.NumberFormatSymbols_pa", "goog.i18n.NumberFormatSymbols_pa_Arab", "goog.i18n.NumberFormatSymbols_pa_Arab_PK", "goog.i18n.NumberFormatSymbols_pa_Guru", "goog.i18n.NumberFormatSymbols_pa_Guru_IN", "goog.i18n.NumberFormatSymbols_ps", "goog.i18n.NumberFormatSymbols_ps_AF", "goog.i18n.NumberFormatSymbols_pt_AO", "goog.i18n.NumberFormatSymbols_pt_GW", "goog.i18n.NumberFormatSymbols_pt_MZ", "goog.i18n.NumberFormatSymbols_pt_ST", 
"goog.i18n.NumberFormatSymbols_rm", "goog.i18n.NumberFormatSymbols_rm_CH", "goog.i18n.NumberFormatSymbols_rn", "goog.i18n.NumberFormatSymbols_rn_BI", "goog.i18n.NumberFormatSymbols_ro_MD", "goog.i18n.NumberFormatSymbols_rof", "goog.i18n.NumberFormatSymbols_rof_TZ", "goog.i18n.NumberFormatSymbols_ru_MD", "goog.i18n.NumberFormatSymbols_ru_UA", "goog.i18n.NumberFormatSymbols_rw", "goog.i18n.NumberFormatSymbols_rw_RW", "goog.i18n.NumberFormatSymbols_rwk", "goog.i18n.NumberFormatSymbols_rwk_TZ", "goog.i18n.NumberFormatSymbols_sah", 
"goog.i18n.NumberFormatSymbols_sah_RU", "goog.i18n.NumberFormatSymbols_saq", "goog.i18n.NumberFormatSymbols_saq_KE", "goog.i18n.NumberFormatSymbols_sbp", "goog.i18n.NumberFormatSymbols_sbp_TZ", "goog.i18n.NumberFormatSymbols_se", "goog.i18n.NumberFormatSymbols_se_FI", "goog.i18n.NumberFormatSymbols_se_NO", "goog.i18n.NumberFormatSymbols_seh", "goog.i18n.NumberFormatSymbols_seh_MZ", "goog.i18n.NumberFormatSymbols_ses", "goog.i18n.NumberFormatSymbols_ses_ML", "goog.i18n.NumberFormatSymbols_sg", "goog.i18n.NumberFormatSymbols_sg_CF", 
"goog.i18n.NumberFormatSymbols_shi", "goog.i18n.NumberFormatSymbols_shi_Latn", "goog.i18n.NumberFormatSymbols_shi_Latn_MA", "goog.i18n.NumberFormatSymbols_shi_Tfng", "goog.i18n.NumberFormatSymbols_shi_Tfng_MA", "goog.i18n.NumberFormatSymbols_si", "goog.i18n.NumberFormatSymbols_si_LK", "goog.i18n.NumberFormatSymbols_sn", "goog.i18n.NumberFormatSymbols_sn_ZW", "goog.i18n.NumberFormatSymbols_so", "goog.i18n.NumberFormatSymbols_so_DJ", "goog.i18n.NumberFormatSymbols_so_ET", "goog.i18n.NumberFormatSymbols_so_KE", 
"goog.i18n.NumberFormatSymbols_so_SO", "goog.i18n.NumberFormatSymbols_sr_Cyrl", "goog.i18n.NumberFormatSymbols_sr_Cyrl_BA", "goog.i18n.NumberFormatSymbols_sr_Cyrl_ME", "goog.i18n.NumberFormatSymbols_sr_Latn", "goog.i18n.NumberFormatSymbols_sr_Latn_BA", "goog.i18n.NumberFormatSymbols_sr_Latn_ME", "goog.i18n.NumberFormatSymbols_ss", "goog.i18n.NumberFormatSymbols_ss_SZ", "goog.i18n.NumberFormatSymbols_ss_ZA", "goog.i18n.NumberFormatSymbols_ssy", "goog.i18n.NumberFormatSymbols_ssy_ER", "goog.i18n.NumberFormatSymbols_st", 
"goog.i18n.NumberFormatSymbols_st_LS", "goog.i18n.NumberFormatSymbols_st_ZA", "goog.i18n.NumberFormatSymbols_sv_FI", "goog.i18n.NumberFormatSymbols_sw_KE", "goog.i18n.NumberFormatSymbols_swc", "goog.i18n.NumberFormatSymbols_swc_CD", "goog.i18n.NumberFormatSymbols_ta_LK", "goog.i18n.NumberFormatSymbols_teo", "goog.i18n.NumberFormatSymbols_teo_KE", "goog.i18n.NumberFormatSymbols_teo_UG", "goog.i18n.NumberFormatSymbols_tg", "goog.i18n.NumberFormatSymbols_tg_Cyrl", "goog.i18n.NumberFormatSymbols_tg_Cyrl_TJ", 
"goog.i18n.NumberFormatSymbols_ti", "goog.i18n.NumberFormatSymbols_ti_ER", "goog.i18n.NumberFormatSymbols_ti_ET", "goog.i18n.NumberFormatSymbols_tig", "goog.i18n.NumberFormatSymbols_tig_ER", "goog.i18n.NumberFormatSymbols_tn", "goog.i18n.NumberFormatSymbols_tn_ZA", "goog.i18n.NumberFormatSymbols_to", "goog.i18n.NumberFormatSymbols_to_TO", "goog.i18n.NumberFormatSymbols_ts", "goog.i18n.NumberFormatSymbols_ts_ZA", "goog.i18n.NumberFormatSymbols_twq", "goog.i18n.NumberFormatSymbols_twq_NE", "goog.i18n.NumberFormatSymbols_tzm", 
"goog.i18n.NumberFormatSymbols_tzm_Latn", "goog.i18n.NumberFormatSymbols_tzm_Latn_MA", "goog.i18n.NumberFormatSymbols_ur_IN", "goog.i18n.NumberFormatSymbols_uz", "goog.i18n.NumberFormatSymbols_uz_Arab", "goog.i18n.NumberFormatSymbols_uz_Arab_AF", "goog.i18n.NumberFormatSymbols_uz_Cyrl", "goog.i18n.NumberFormatSymbols_uz_Cyrl_UZ", "goog.i18n.NumberFormatSymbols_uz_Latn", "goog.i18n.NumberFormatSymbols_uz_Latn_UZ", "goog.i18n.NumberFormatSymbols_vai", "goog.i18n.NumberFormatSymbols_vai_Latn", "goog.i18n.NumberFormatSymbols_vai_Latn_LR", 
"goog.i18n.NumberFormatSymbols_vai_Vaii", "goog.i18n.NumberFormatSymbols_vai_Vaii_LR", "goog.i18n.NumberFormatSymbols_ve", "goog.i18n.NumberFormatSymbols_ve_ZA", "goog.i18n.NumberFormatSymbols_vun", "goog.i18n.NumberFormatSymbols_vun_TZ", "goog.i18n.NumberFormatSymbols_wae", "goog.i18n.NumberFormatSymbols_wae_CH", "goog.i18n.NumberFormatSymbols_wal", "goog.i18n.NumberFormatSymbols_wal_ET", "goog.i18n.NumberFormatSymbols_xh", "goog.i18n.NumberFormatSymbols_xh_ZA", "goog.i18n.NumberFormatSymbols_xog", 
"goog.i18n.NumberFormatSymbols_xog_UG", "goog.i18n.NumberFormatSymbols_yav", "goog.i18n.NumberFormatSymbols_yav_CM", "goog.i18n.NumberFormatSymbols_yo", "goog.i18n.NumberFormatSymbols_yo_NG", "goog.i18n.NumberFormatSymbols_zh_Hans_HK", "goog.i18n.NumberFormatSymbols_zh_Hans_MO", "goog.i18n.NumberFormatSymbols_zh_Hans_SG", "goog.i18n.NumberFormatSymbols_zh_Hant", "goog.i18n.NumberFormatSymbols_zh_Hant_HK", "goog.i18n.NumberFormatSymbols_zh_Hant_MO", "goog.i18n.NumberFormatSymbols_zh_Hant_TW"], ["goog.i18n.NumberFormatSymbols"]);
goog.addDependency("/closure/goog/i18n/ordinalrules.js", ["goog.i18n.ordinalRules"], []);
goog.addDependency("/closure/goog/i18n/pluralrules.js", ["goog.i18n.pluralRules"], []);
goog.addDependency("/closure/goog/i18n/timezone.js", ["goog.i18n.TimeZone"], ["goog.array", "goog.date.DateLike", "goog.string"]);
goog.addDependency("/closure/goog/i18n/uchar.js", ["goog.i18n.uChar"], []);
goog.addDependency("/closure/goog/i18n/uchar/localnamefetcher.js", ["goog.i18n.uChar.LocalNameFetcher"], ["goog.debug.Logger", "goog.i18n.uChar", "goog.i18n.uChar.NameFetcher"]);
goog.addDependency("/closure/goog/i18n/uchar/namefetcher.js", ["goog.i18n.uChar.NameFetcher"], []);
goog.addDependency("/closure/goog/i18n/uchar/remotenamefetcher.js", ["goog.i18n.uChar.RemoteNameFetcher"], ["goog.Disposable", "goog.Uri", "goog.debug.Logger", "goog.i18n.uChar", "goog.i18n.uChar.NameFetcher", "goog.net.XhrIo", "goog.structs.Map"]);
goog.addDependency("/closure/goog/iter/iter.js", ["goog.iter", "goog.iter.Iterator", "goog.iter.StopIteration"], ["goog.array", "goog.asserts"]);
goog.addDependency("/closure/goog/json/evaljsonprocessor.js", ["goog.json.EvalJsonProcessor"], ["goog.json", "goog.json.Processor", "goog.json.Serializer"]);
goog.addDependency("/closure/goog/json/json.js", ["goog.json", "goog.json.Serializer"], []);
goog.addDependency("/closure/goog/json/nativejsonprocessor.js", ["goog.json.NativeJsonProcessor"], ["goog.asserts", "goog.json", "goog.json.Processor"]);
goog.addDependency("/closure/goog/json/processor.js", ["goog.json.Processor"], ["goog.string.Parser", "goog.string.Stringifier"]);
goog.addDependency("/closure/goog/labs/net/image.js", ["goog.labs.net.image"], ["goog.events.EventHandler", "goog.events.EventType", "goog.labs.result.SimpleResult", "goog.net.EventType", "goog.userAgent"]);
goog.addDependency("/closure/goog/labs/net/image_test.js", ["goog.labs.net.imageTest"], ["goog.events", "goog.labs.net.image", "goog.labs.result", "goog.labs.result.Result", "goog.net.EventType", "goog.string", "goog.testing.AsyncTestCase", "goog.testing.jsunit", "goog.testing.recordFunction"]);
goog.addDependency("/closure/goog/labs/net/xhr.js", ["goog.labs.net.xhr", "goog.labs.net.xhr.Error", "goog.labs.net.xhr.HttpError", "goog.labs.net.xhr.TimeoutError"], ["goog.debug.Error", "goog.json", "goog.labs.result", "goog.net.HttpStatus", "goog.net.XmlHttp", "goog.string", "goog.uri.utils"]);
goog.addDependency("/closure/goog/labs/object/object.js", ["goog.labs.object"], []);
goog.addDependency("/closure/goog/labs/observe/notice.js", ["goog.labs.observe.Notice"], []);
goog.addDependency("/closure/goog/labs/observe/observable.js", ["goog.labs.observe.Observable"], ["goog.disposable.IDisposable"]);
goog.addDependency("/closure/goog/labs/observe/observableset.js", ["goog.labs.observe.ObservableSet"], ["goog.array", "goog.labs.observe.Observer"]);
goog.addDependency("/closure/goog/labs/observe/observationset.js", ["goog.labs.observe.ObservationSet"], ["goog.array", "goog.labs.observe.Observer"]);
goog.addDependency("/closure/goog/labs/observe/observer.js", ["goog.labs.observe.Observer"], []);
goog.addDependency("/closure/goog/labs/observe/simpleobservable.js", ["goog.labs.observe.SimpleObservable"], ["goog.Disposable", "goog.array", "goog.asserts", "goog.labs.observe.Notice", "goog.labs.observe.Observable", "goog.labs.observe.Observer", "goog.object"]);
goog.addDependency("/closure/goog/labs/result/deferredadaptor.js", ["goog.labs.result.DeferredAdaptor"], ["goog.async.Deferred", "goog.labs.result", "goog.labs.result.Result"]);
goog.addDependency("/closure/goog/labs/result/result_interface.js", ["goog.labs.result.Result"], ["goog.debug.Error"]);
goog.addDependency("/closure/goog/labs/result/resultutil.js", ["goog.labs.result"], ["goog.array", "goog.labs.result.Result", "goog.labs.result.SimpleResult"]);
goog.addDependency("/closure/goog/labs/result/simpleresult.js", ["goog.labs.result.SimpleResult", "goog.labs.result.SimpleResult.StateError"], ["goog.debug.Error", "goog.labs.result.Result"]);
goog.addDependency("/closure/goog/labs/structs/map.js", ["goog.labs.structs.Map"], ["goog.array", "goog.asserts", "goog.labs.object", "goog.object"]);
goog.addDependency("/closure/goog/labs/structs/map_perf.js", ["goog.labs.structs.mapPerf"], ["goog.dom", "goog.labs.structs.Map", "goog.structs.Map", "goog.testing.PerformanceTable", "goog.testing.jsunit"]);
goog.addDependency("/closure/goog/labs/structs/multimap.js", ["goog.labs.structs.Multimap"], ["goog.array", "goog.labs.object", "goog.labs.structs.Map"]);
goog.addDependency("/closure/goog/labs/testing/assertthat.js", ["goog.labs.testing.MatcherError", "goog.labs.testing.assertThat"], ["goog.asserts", "goog.debug.Error", "goog.labs.testing.Matcher"]);
goog.addDependency("/closure/goog/labs/testing/dictionarymatcher.js", ["goog.labs.testing.HasEntriesMatcher", "goog.labs.testing.HasEntryMatcher", "goog.labs.testing.HasKeyMatcher", "goog.labs.testing.HasValueMatcher"], ["goog.array", "goog.asserts", "goog.labs.testing.Matcher", "goog.string"]);
goog.addDependency("/closure/goog/labs/testing/logicmatcher.js", ["goog.labs.testing.AllOfMatcher", "goog.labs.testing.AnyOfMatcher", "goog.labs.testing.IsNotMatcher"], ["goog.array", "goog.labs.testing.Matcher"]);
goog.addDependency("/closure/goog/labs/testing/matcher.js", ["goog.labs.testing.Matcher"], []);
goog.addDependency("/closure/goog/labs/testing/numbermatcher.js", ["goog.labs.testing.CloseToMatcher", "goog.labs.testing.EqualToMatcher", "goog.labs.testing.GreaterThanEqualToMatcher", "goog.labs.testing.GreaterThanMatcher", "goog.labs.testing.LessThanEqualToMatcher", "goog.labs.testing.LessThanMatcher"], ["goog.asserts", "goog.labs.testing.Matcher"]);
goog.addDependency("/closure/goog/labs/testing/objectmatcher.js", ["goog.labs.testing.HasPropertyMatcher", "goog.labs.testing.InstanceOfMatcher", "goog.labs.testing.IsNullMatcher", "goog.labs.testing.IsNullOrUndefinedMatcher", "goog.labs.testing.IsUndefinedMatcher", "goog.labs.testing.ObjectEqualsMatcher"], ["goog.labs.testing.Matcher", "goog.string"]);
goog.addDependency("/closure/goog/labs/testing/stringmatcher.js", ["goog.labs.testing.ContainsStringMatcher", "goog.labs.testing.EndsWithMatcher", "goog.labs.testing.EqualToIgnoringCaseMatcher", "goog.labs.testing.EqualToIgnoringWhitespaceMatcher", "goog.labs.testing.EqualsMatcher", "goog.labs.testing.StartsWithMatcher", "goog.labs.testing.StringContainsInOrderMatcher"], ["goog.asserts", "goog.labs.testing.Matcher", "goog.string"]);
goog.addDependency("/closure/goog/locale/countries.js", ["goog.locale.countries"], []);
goog.addDependency("/closure/goog/locale/defaultlocalenameconstants.js", ["goog.locale.defaultLocaleNameConstants"], []);
goog.addDependency("/closure/goog/locale/genericfontnames.js", ["goog.locale.genericFontNames"], []);
goog.addDependency("/closure/goog/locale/genericfontnamesdata.js", ["goog.locale.genericFontNamesData"], ["goog.locale"]);
goog.addDependency("/closure/goog/locale/locale.js", ["goog.locale"], ["goog.locale.nativeNameConstants"]);
goog.addDependency("/closure/goog/locale/nativenameconstants.js", ["goog.locale.nativeNameConstants"], []);
goog.addDependency("/closure/goog/locale/scriptToLanguages.js", ["goog.locale.scriptToLanguages"], ["goog.locale"]);
goog.addDependency("/closure/goog/locale/timezonedetection.js", ["goog.locale.timeZoneDetection"], ["goog.locale", "goog.locale.TimeZoneFingerprint"]);
goog.addDependency("/closure/goog/locale/timezonefingerprint.js", ["goog.locale.TimeZoneFingerprint"], ["goog.locale"]);
goog.addDependency("/closure/goog/locale/timezonelist.js", ["goog.locale.TimeZoneList"], ["goog.locale"]);
goog.addDependency("/closure/goog/math/bezier.js", ["goog.math.Bezier"], ["goog.math", "goog.math.Coordinate"]);
goog.addDependency("/closure/goog/math/box.js", ["goog.math.Box"], ["goog.math.Coordinate"]);
goog.addDependency("/closure/goog/math/coordinate.js", ["goog.math.Coordinate"], ["goog.math"]);
goog.addDependency("/closure/goog/math/coordinate3.js", ["goog.math.Coordinate3"], []);
goog.addDependency("/closure/goog/math/exponentialbackoff.js", ["goog.math.ExponentialBackoff"], ["goog.asserts"]);
goog.addDependency("/closure/goog/math/integer.js", ["goog.math.Integer"], []);
goog.addDependency("/closure/goog/math/interpolator/interpolator1.js", ["goog.math.interpolator.Interpolator1"], []);
goog.addDependency("/closure/goog/math/interpolator/linear1.js", ["goog.math.interpolator.Linear1"], ["goog.array", "goog.math", "goog.math.interpolator.Interpolator1"]);
goog.addDependency("/closure/goog/math/interpolator/pchip1.js", ["goog.math.interpolator.Pchip1"], ["goog.math", "goog.math.interpolator.Spline1"]);
goog.addDependency("/closure/goog/math/interpolator/spline1.js", ["goog.math.interpolator.Spline1"], ["goog.array", "goog.math", "goog.math.interpolator.Interpolator1", "goog.math.tdma"]);
goog.addDependency("/closure/goog/math/line.js", ["goog.math.Line"], ["goog.math", "goog.math.Coordinate"]);
goog.addDependency("/closure/goog/math/long.js", ["goog.math.Long"], []);
goog.addDependency("/closure/goog/math/math.js", ["goog.math"], ["goog.array"]);
goog.addDependency("/closure/goog/math/matrix.js", ["goog.math.Matrix"], ["goog.array", "goog.math", "goog.math.Size"]);
goog.addDependency("/closure/goog/math/range.js", ["goog.math.Range"], []);
goog.addDependency("/closure/goog/math/rangeset.js", ["goog.math.RangeSet"], ["goog.array", "goog.iter.Iterator", "goog.iter.StopIteration", "goog.math.Range"]);
goog.addDependency("/closure/goog/math/rect.js", ["goog.math.Rect"], ["goog.math.Box", "goog.math.Size"]);
goog.addDependency("/closure/goog/math/size.js", ["goog.math.Size"], []);
goog.addDependency("/closure/goog/math/tdma.js", ["goog.math.tdma"], []);
goog.addDependency("/closure/goog/math/vec2.js", ["goog.math.Vec2"], ["goog.math", "goog.math.Coordinate"]);
goog.addDependency("/closure/goog/math/vec3.js", ["goog.math.Vec3"], ["goog.math", "goog.math.Coordinate3"]);
goog.addDependency("/closure/goog/memoize/memoize.js", ["goog.memoize"], []);
goog.addDependency("/closure/goog/messaging/abstractchannel.js", ["goog.messaging.AbstractChannel"], ["goog.Disposable", "goog.debug", "goog.debug.Logger", "goog.json", "goog.messaging.MessageChannel"]);
goog.addDependency("/closure/goog/messaging/bufferedchannel.js", ["goog.messaging.BufferedChannel"], ["goog.Timer", "goog.Uri", "goog.debug.Error", "goog.debug.Logger", "goog.events", "goog.messaging.MessageChannel", "goog.messaging.MultiChannel"]);
goog.addDependency("/closure/goog/messaging/deferredchannel.js", ["goog.messaging.DeferredChannel"], ["goog.Disposable", "goog.async.Deferred", "goog.messaging.MessageChannel"]);
goog.addDependency("/closure/goog/messaging/loggerclient.js", ["goog.messaging.LoggerClient"], ["goog.Disposable", "goog.debug", "goog.debug.LogManager", "goog.debug.Logger"]);
goog.addDependency("/closure/goog/messaging/loggerserver.js", ["goog.messaging.LoggerServer"], ["goog.Disposable", "goog.debug.Logger"]);
goog.addDependency("/closure/goog/messaging/messagechannel.js", ["goog.messaging.MessageChannel"], []);
goog.addDependency("/closure/goog/messaging/messaging.js", ["goog.messaging"], ["goog.messaging.MessageChannel"]);
goog.addDependency("/closure/goog/messaging/multichannel.js", ["goog.messaging.MultiChannel", "goog.messaging.MultiChannel.VirtualChannel"], ["goog.Disposable", "goog.debug.Logger", "goog.events.EventHandler", "goog.messaging.MessageChannel", "goog.object"]);
goog.addDependency("/closure/goog/messaging/portcaller.js", ["goog.messaging.PortCaller"], ["goog.Disposable", "goog.async.Deferred", "goog.messaging.DeferredChannel", "goog.messaging.PortChannel", "goog.messaging.PortNetwork", "goog.object"]);
goog.addDependency("/closure/goog/messaging/portchannel.js", ["goog.messaging.PortChannel"], ["goog.Timer", "goog.array", "goog.async.Deferred", "goog.debug", "goog.debug.Logger", "goog.dom", "goog.dom.DomHelper", "goog.events", "goog.events.EventType", "goog.json", "goog.messaging.AbstractChannel", "goog.messaging.DeferredChannel", "goog.object", "goog.string"]);
goog.addDependency("/closure/goog/messaging/portnetwork.js", ["goog.messaging.PortNetwork"], []);
goog.addDependency("/closure/goog/messaging/portoperator.js", ["goog.messaging.PortOperator"], ["goog.Disposable", "goog.asserts", "goog.debug.Logger", "goog.messaging.PortChannel", "goog.messaging.PortNetwork", "goog.object"]);
goog.addDependency("/closure/goog/messaging/respondingchannel.js", ["goog.messaging.RespondingChannel"], ["goog.Disposable", "goog.debug.Logger", "goog.messaging.MessageChannel", "goog.messaging.MultiChannel", "goog.messaging.MultiChannel.VirtualChannel"]);
goog.addDependency("/closure/goog/messaging/testdata/portchannel_worker.js", ["goog.messaging.testdata.portchannel_worker"], ["goog.messaging.PortChannel"]);
goog.addDependency("/closure/goog/messaging/testdata/portnetwork_worker1.js", ["goog.messaging.testdata.portnetwork_worker1"], ["goog.messaging.PortCaller", "goog.messaging.PortChannel"]);
goog.addDependency("/closure/goog/messaging/testdata/portnetwork_worker2.js", ["goog.messaging.testdata.portnetwork_worker2"], ["goog.messaging.PortCaller", "goog.messaging.PortChannel"]);
goog.addDependency("/closure/goog/module/abstractmoduleloader.js", ["goog.module.AbstractModuleLoader"], []);
goog.addDependency("/closure/goog/module/basemodule.js", ["goog.module.BaseModule"], ["goog.Disposable"]);
goog.addDependency("/closure/goog/module/loader.js", ["goog.module.Loader"], ["goog.Timer", "goog.array", "goog.dom", "goog.object"]);
goog.addDependency("/closure/goog/module/module.js", ["goog.module"], ["goog.array", "goog.module.Loader"]);
goog.addDependency("/closure/goog/module/moduleinfo.js", ["goog.module.ModuleInfo"], ["goog.Disposable", "goog.functions", "goog.module.BaseModule", "goog.module.ModuleLoadCallback"]);
goog.addDependency("/closure/goog/module/moduleloadcallback.js", ["goog.module.ModuleLoadCallback"], ["goog.debug.entryPointRegistry", "goog.debug.errorHandlerWeakDep"]);
goog.addDependency("/closure/goog/module/moduleloader.js", ["goog.module.ModuleLoader"], ["goog.Timer", "goog.array", "goog.debug.Logger", "goog.events", "goog.events.Event", "goog.events.EventHandler", "goog.events.EventTarget", "goog.module.AbstractModuleLoader", "goog.net.BulkLoader", "goog.net.EventType", "goog.net.jsloader"]);
goog.addDependency("/closure/goog/module/modulemanager.js", ["goog.module.ModuleManager", "goog.module.ModuleManager.CallbackType", "goog.module.ModuleManager.FailureType"], ["goog.Disposable", "goog.array", "goog.asserts", "goog.async.Deferred", "goog.debug.Logger", "goog.debug.Trace", "goog.module.ModuleInfo", "goog.module.ModuleLoadCallback", "goog.object"]);
goog.addDependency("/closure/goog/module/testdata/modA_1.js", ["goog.module.testdata.modA_1"], []);
goog.addDependency("/closure/goog/module/testdata/modA_2.js", ["goog.module.testdata.modA_2"], ["goog.module.ModuleManager"]);
goog.addDependency("/closure/goog/module/testdata/modB_1.js", ["goog.module.testdata.modB_1"], ["goog.module.ModuleManager"]);
goog.addDependency("/closure/goog/net/browserchannel.js", ["goog.net.BrowserChannel", "goog.net.BrowserChannel.Error", "goog.net.BrowserChannel.Event", "goog.net.BrowserChannel.Handler", "goog.net.BrowserChannel.LogSaver", "goog.net.BrowserChannel.QueuedMap", "goog.net.BrowserChannel.ServerReachability", "goog.net.BrowserChannel.ServerReachabilityEvent", "goog.net.BrowserChannel.Stat", "goog.net.BrowserChannel.StatEvent", "goog.net.BrowserChannel.State", "goog.net.BrowserChannel.TimingEvent"], ["goog.Uri", 
"goog.array", "goog.asserts", "goog.debug.Logger", "goog.debug.TextFormatter", "goog.events.Event", "goog.events.EventTarget", "goog.json", "goog.json.EvalJsonProcessor", "goog.net.BrowserTestChannel", "goog.net.ChannelDebug", "goog.net.ChannelRequest", "goog.net.ChannelRequest.Error", "goog.net.XhrIo", "goog.net.tmpnetwork", "goog.string", "goog.structs", "goog.structs.CircularBuffer", "goog.userAgent"]);
goog.addDependency("/closure/goog/net/browsertestchannel.js", ["goog.net.BrowserTestChannel"], ["goog.json.EvalJsonProcessor", "goog.net.ChannelRequest", "goog.net.ChannelRequest.Error", "goog.net.tmpnetwork", "goog.string.Parser", "goog.userAgent"]);
goog.addDependency("/closure/goog/net/bulkloader.js", ["goog.net.BulkLoader"], ["goog.debug.Logger", "goog.events.Event", "goog.events.EventHandler", "goog.events.EventTarget", "goog.net.BulkLoaderHelper", "goog.net.EventType", "goog.net.XhrIo"]);
goog.addDependency("/closure/goog/net/bulkloaderhelper.js", ["goog.net.BulkLoaderHelper"], ["goog.Disposable", "goog.debug.Logger"]);
goog.addDependency("/closure/goog/net/channeldebug.js", ["goog.net.ChannelDebug"], ["goog.debug.Logger", "goog.json"]);
goog.addDependency("/closure/goog/net/channelrequest.js", ["goog.net.ChannelRequest", "goog.net.ChannelRequest.Error"], ["goog.Timer", "goog.events", "goog.events.EventHandler", "goog.net.EventType", "goog.net.XmlHttp.ReadyState", "goog.object", "goog.userAgent"]);
goog.addDependency("/closure/goog/net/cookies.js", ["goog.net.Cookies", "goog.net.cookies"], ["goog.userAgent"]);
goog.addDependency("/closure/goog/net/crossdomainrpc.js", ["goog.net.CrossDomainRpc"], ["goog.Uri.QueryData", "goog.debug.Logger", "goog.dom", "goog.events", "goog.events.EventTarget", "goog.events.EventType", "goog.json", "goog.net.EventType", "goog.net.HttpStatus", "goog.userAgent"]);
goog.addDependency("/closure/goog/net/errorcode.js", ["goog.net.ErrorCode"], []);
goog.addDependency("/closure/goog/net/eventtype.js", ["goog.net.EventType"], []);
goog.addDependency("/closure/goog/net/filedownloader.js", ["goog.net.FileDownloader", "goog.net.FileDownloader.Error"], ["goog.Disposable", "goog.asserts", "goog.async.Deferred", "goog.crypt.hash32", "goog.debug.Error", "goog.events.EventHandler", "goog.fs", "goog.fs.DirectoryEntry.Behavior", "goog.fs.Error.ErrorCode", "goog.fs.FileSaver.EventType", "goog.net.EventType", "goog.net.XhrIo.ResponseType", "goog.net.XhrIoPool"]);
goog.addDependency("/closure/goog/net/httpstatus.js", ["goog.net.HttpStatus"], []);
goog.addDependency("/closure/goog/net/iframeio.js", ["goog.net.IframeIo", "goog.net.IframeIo.IncrementalDataEvent"], ["goog.Timer", "goog.Uri", "goog.debug", "goog.debug.Logger", "goog.dom", "goog.events", "goog.events.EventTarget", "goog.events.EventType", "goog.json", "goog.net.ErrorCode", "goog.net.EventType", "goog.reflect", "goog.string", "goog.structs", "goog.userAgent"]);
goog.addDependency("/closure/goog/net/iframeloadmonitor.js", ["goog.net.IframeLoadMonitor"], ["goog.dom", "goog.events", "goog.events.EventTarget", "goog.events.EventType", "goog.userAgent"]);
goog.addDependency("/closure/goog/net/imageloader.js", ["goog.net.ImageLoader"], ["goog.array", "goog.dom", "goog.events.EventHandler", "goog.events.EventTarget", "goog.events.EventType", "goog.net.EventType", "goog.object", "goog.userAgent"]);
goog.addDependency("/closure/goog/net/ipaddress.js", ["goog.net.IpAddress", "goog.net.Ipv4Address", "goog.net.Ipv6Address"], ["goog.array", "goog.math.Integer", "goog.object", "goog.string"]);
goog.addDependency("/closure/goog/net/jsloader.js", ["goog.net.jsloader", "goog.net.jsloader.Error"], ["goog.array", "goog.async.Deferred", "goog.debug.Error", "goog.dom", "goog.userAgent"]);
goog.addDependency("/closure/goog/net/jsonp.js", ["goog.net.Jsonp"], ["goog.Uri", "goog.dom", "goog.net.jsloader"]);
goog.addDependency("/closure/goog/net/mockiframeio.js", ["goog.net.MockIFrameIo"], ["goog.events.EventTarget", "goog.net.ErrorCode", "goog.net.IframeIo", "goog.net.IframeIo.IncrementalDataEvent"]);
goog.addDependency("/closure/goog/net/mockxhrlite.js", ["goog.net.MockXhrLite"], ["goog.testing.net.XhrIo"]);
goog.addDependency("/closure/goog/net/multiiframeloadmonitor.js", ["goog.net.MultiIframeLoadMonitor"], ["goog.net.IframeLoadMonitor"]);
goog.addDependency("/closure/goog/net/networktester.js", ["goog.net.NetworkTester"], ["goog.Timer", "goog.Uri", "goog.debug.Logger"]);
goog.addDependency("/closure/goog/net/testdata/jsloader_test1.js", ["goog.net.testdata.jsloader_test1"], []);
goog.addDependency("/closure/goog/net/testdata/jsloader_test2.js", ["goog.net.testdata.jsloader_test2"], []);
goog.addDependency("/closure/goog/net/testdata/jsloader_test3.js", ["goog.net.testdata.jsloader_test3"], []);
goog.addDependency("/closure/goog/net/testdata/jsloader_test4.js", ["goog.net.testdata.jsloader_test4"], []);
goog.addDependency("/closure/goog/net/tmpnetwork.js", ["goog.net.tmpnetwork"], ["goog.Uri", "goog.net.ChannelDebug"]);
goog.addDependency("/closure/goog/net/websocket.js", ["goog.net.WebSocket", "goog.net.WebSocket.ErrorEvent", "goog.net.WebSocket.EventType", "goog.net.WebSocket.MessageEvent"], ["goog.Timer", "goog.asserts", "goog.debug.Logger", "goog.debug.entryPointRegistry", "goog.events", "goog.events.Event", "goog.events.EventTarget"]);
goog.addDependency("/closure/goog/net/wrapperxmlhttpfactory.js", ["goog.net.WrapperXmlHttpFactory"], ["goog.net.XmlHttpFactory"]);
goog.addDependency("/closure/goog/net/xhrio.js", ["goog.net.XhrIo", "goog.net.XhrIo.ResponseType"], ["goog.Timer", "goog.debug.Logger", "goog.debug.entryPointRegistry", "goog.debug.errorHandlerWeakDep", "goog.events.EventTarget", "goog.json", "goog.net.ErrorCode", "goog.net.EventType", "goog.net.HttpStatus", "goog.net.XmlHttp", "goog.object", "goog.structs", "goog.structs.Map", "goog.uri.utils"]);
goog.addDependency("/closure/goog/net/xhriopool.js", ["goog.net.XhrIoPool"], ["goog.net.XhrIo", "goog.structs", "goog.structs.PriorityPool"]);
goog.addDependency("/closure/goog/net/xhrlite.js", ["goog.net.XhrLite"], ["goog.net.XhrIo"]);
goog.addDependency("/closure/goog/net/xhrlitepool.js", ["goog.net.XhrLitePool"], ["goog.net.XhrIoPool"]);
goog.addDependency("/closure/goog/net/xhrmanager.js", ["goog.net.XhrManager", "goog.net.XhrManager.Event", "goog.net.XhrManager.Request"], ["goog.Disposable", "goog.events", "goog.events.Event", "goog.events.EventHandler", "goog.events.EventTarget", "goog.net.EventType", "goog.net.XhrIo", "goog.net.XhrIoPool", "goog.structs.Map"]);
goog.addDependency("/closure/goog/net/xmlhttp.js", ["goog.net.DefaultXmlHttpFactory", "goog.net.XmlHttp", "goog.net.XmlHttp.OptionType", "goog.net.XmlHttp.ReadyState"], ["goog.net.WrapperXmlHttpFactory", "goog.net.XmlHttpFactory"]);
goog.addDependency("/closure/goog/net/xmlhttpfactory.js", ["goog.net.XmlHttpFactory"], []);
goog.addDependency("/closure/goog/net/xpc/crosspagechannel.js", ["goog.net.xpc.CrossPageChannel"], ["goog.Disposable", "goog.Uri", "goog.async.Deferred", "goog.async.Delay", "goog.dom", "goog.events", "goog.events.EventHandler", "goog.json", "goog.messaging.AbstractChannel", "goog.net.xpc", "goog.net.xpc.CrossPageChannelRole", "goog.net.xpc.FrameElementMethodTransport", "goog.net.xpc.IframePollingTransport", "goog.net.xpc.IframeRelayTransport", "goog.net.xpc.NativeMessagingTransport", "goog.net.xpc.NixTransport", 
"goog.net.xpc.Transport", "goog.userAgent"]);
goog.addDependency("/closure/goog/net/xpc/crosspagechannelrole.js", ["goog.net.xpc.CrossPageChannelRole"], []);
goog.addDependency("/closure/goog/net/xpc/frameelementmethodtransport.js", ["goog.net.xpc.FrameElementMethodTransport"], ["goog.net.xpc", "goog.net.xpc.CrossPageChannelRole", "goog.net.xpc.Transport"]);
goog.addDependency("/closure/goog/net/xpc/iframepollingtransport.js", ["goog.net.xpc.IframePollingTransport", "goog.net.xpc.IframePollingTransport.Receiver", "goog.net.xpc.IframePollingTransport.Sender"], ["goog.array", "goog.dom", "goog.net.xpc", "goog.net.xpc.CrossPageChannelRole", "goog.net.xpc.Transport", "goog.userAgent"]);
goog.addDependency("/closure/goog/net/xpc/iframerelaytransport.js", ["goog.net.xpc.IframeRelayTransport"], ["goog.dom", "goog.events", "goog.net.xpc", "goog.net.xpc.Transport", "goog.userAgent"]);
goog.addDependency("/closure/goog/net/xpc/nativemessagingtransport.js", ["goog.net.xpc.NativeMessagingTransport"], ["goog.Timer", "goog.asserts", "goog.async.Deferred", "goog.events", "goog.events.EventHandler", "goog.net.xpc", "goog.net.xpc.CrossPageChannelRole", "goog.net.xpc.Transport"]);
goog.addDependency("/closure/goog/net/xpc/nixtransport.js", ["goog.net.xpc.NixTransport"], ["goog.net.xpc", "goog.net.xpc.CrossPageChannelRole", "goog.net.xpc.Transport", "goog.reflect"]);
goog.addDependency("/closure/goog/net/xpc/relay.js", ["goog.net.xpc.relay"], []);
goog.addDependency("/closure/goog/net/xpc/transport.js", ["goog.net.xpc.Transport"], ["goog.Disposable", "goog.dom", "goog.net.xpc"]);
goog.addDependency("/closure/goog/net/xpc/xpc.js", ["goog.net.xpc", "goog.net.xpc.CfgFields", "goog.net.xpc.ChannelStates", "goog.net.xpc.TransportNames", "goog.net.xpc.TransportTypes", "goog.net.xpc.UriCfgFields"], ["goog.debug.Logger"]);
goog.addDependency("/closure/goog/object/object.js", ["goog.object"], []);
goog.addDependency("/closure/goog/positioning/absoluteposition.js", ["goog.positioning.AbsolutePosition"], ["goog.math.Box", "goog.math.Coordinate", "goog.math.Size", "goog.positioning", "goog.positioning.AbstractPosition"]);
goog.addDependency("/closure/goog/positioning/abstractposition.js", ["goog.positioning.AbstractPosition"], ["goog.math.Box", "goog.math.Size", "goog.positioning.Corner"]);
goog.addDependency("/closure/goog/positioning/anchoredposition.js", ["goog.positioning.AnchoredPosition"], ["goog.math.Box", "goog.positioning", "goog.positioning.AbstractPosition"]);
goog.addDependency("/closure/goog/positioning/anchoredviewportposition.js", ["goog.positioning.AnchoredViewportPosition"], ["goog.math.Box", "goog.positioning", "goog.positioning.AnchoredPosition", "goog.positioning.Corner", "goog.positioning.Overflow", "goog.positioning.OverflowStatus"]);
goog.addDependency("/closure/goog/positioning/clientposition.js", ["goog.positioning.ClientPosition"], ["goog.asserts", "goog.math.Box", "goog.math.Coordinate", "goog.math.Size", "goog.positioning", "goog.positioning.AbstractPosition", "goog.style"]);
goog.addDependency("/closure/goog/positioning/clientposition_test.js", ["goog.positioning.clientPositionTest"], ["goog.dom", "goog.positioning.ClientPosition", "goog.style", "goog.testing.jsunit"]);
goog.addDependency("/closure/goog/positioning/menuanchoredposition.js", ["goog.positioning.MenuAnchoredPosition"], ["goog.math.Box", "goog.math.Size", "goog.positioning", "goog.positioning.AnchoredViewportPosition", "goog.positioning.Corner", "goog.positioning.Overflow"]);
goog.addDependency("/closure/goog/positioning/positioning.js", ["goog.positioning", "goog.positioning.Corner", "goog.positioning.CornerBit", "goog.positioning.Overflow", "goog.positioning.OverflowStatus"], ["goog.asserts", "goog.dom", "goog.dom.TagName", "goog.math.Box", "goog.math.Coordinate", "goog.math.Size", "goog.style", "goog.style.bidi"]);
goog.addDependency("/closure/goog/positioning/viewportclientposition.js", ["goog.positioning.ViewportClientPosition"], ["goog.math.Box", "goog.math.Coordinate", "goog.math.Size", "goog.positioning.ClientPosition"]);
goog.addDependency("/closure/goog/positioning/viewportposition.js", ["goog.positioning.ViewportPosition"], ["goog.math.Box", "goog.math.Coordinate", "goog.math.Size", "goog.positioning.AbstractPosition"]);
goog.addDependency("/closure/goog/proto/proto.js", ["goog.proto"], ["goog.proto.Serializer"]);
goog.addDependency("/closure/goog/proto/serializer.js", ["goog.proto.Serializer"], ["goog.json.Serializer", "goog.string"]);
goog.addDependency("/closure/goog/proto2/descriptor.js", ["goog.proto2.Descriptor", "goog.proto2.Metadata"], ["goog.array", "goog.object", "goog.proto2.Util"]);
goog.addDependency("/closure/goog/proto2/fielddescriptor.js", ["goog.proto2.FieldDescriptor"], ["goog.proto2.Util", "goog.string"]);
goog.addDependency("/closure/goog/proto2/lazydeserializer.js", ["goog.proto2.LazyDeserializer"], ["goog.proto2.Serializer", "goog.proto2.Util"]);
goog.addDependency("/closure/goog/proto2/message.js", ["goog.proto2.Message"], ["goog.proto2.Descriptor", "goog.proto2.FieldDescriptor", "goog.proto2.Util", "goog.string"]);
goog.addDependency("/closure/goog/proto2/objectserializer.js", ["goog.proto2.ObjectSerializer"], ["goog.proto2.Serializer", "goog.proto2.Util", "goog.string"]);
goog.addDependency("/closure/goog/proto2/package_test.pb.js", ["someprotopackage.TestPackageTypes"], ["goog.proto2.Message", "proto2.TestAllTypes"]);
goog.addDependency("/closure/goog/proto2/pbliteserializer.js", ["goog.proto2.PbLiteSerializer"], ["goog.proto2.LazyDeserializer", "goog.proto2.Util"]);
goog.addDependency("/closure/goog/proto2/serializer.js", ["goog.proto2.Serializer"], ["goog.proto2.Descriptor", "goog.proto2.FieldDescriptor", "goog.proto2.Message", "goog.proto2.Util"]);
goog.addDependency("/closure/goog/proto2/test.pb.js", ["proto2.TestAllTypes", "proto2.TestAllTypes.NestedMessage", "proto2.TestAllTypes.OptionalGroup", "proto2.TestAllTypes.RepeatedGroup", "proto2.TestAllTypes.NestedEnum"], ["goog.proto2.Message"]);
goog.addDependency("/closure/goog/proto2/textformatserializer.js", ["goog.proto2.TextFormatSerializer", "goog.proto2.TextFormatSerializer.Parser"], ["goog.array", "goog.asserts", "goog.json", "goog.proto2.Serializer", "goog.proto2.Util", "goog.string"]);
goog.addDependency("/closure/goog/proto2/textformatserializer_test.js", ["goog.proto2.TextFormatSerializerTest"], ["goog.proto2.TextFormatSerializer", "goog.testing.jsunit", "goog.testing.recordFunction", "proto2.TestAllTypes"]);
goog.addDependency("/closure/goog/proto2/util.js", ["goog.proto2.Util"], ["goog.asserts"]);
goog.addDependency("/closure/goog/pubsub/pubsub.js", ["goog.pubsub.PubSub"], ["goog.Disposable", "goog.array"]);
goog.addDependency("/closure/goog/reflect/reflect.js", ["goog.reflect"], []);
goog.addDependency("/closure/goog/soy/renderer.js", ["goog.soy.InjectedDataSupplier", "goog.soy.Renderer"], ["goog.dom", "goog.soy"]);
goog.addDependency("/closure/goog/soy/soy.js", ["goog.soy"], ["goog.dom", "goog.dom.NodeType", "goog.dom.TagName"]);
goog.addDependency("/closure/goog/soy/soy_test.js", ["goog.soy.testHelper"], ["goog.dom", "goog.string", "goog.userAgent"]);
goog.addDependency("/closure/goog/spell/spellcheck.js", ["goog.spell.SpellCheck", "goog.spell.SpellCheck.WordChangedEvent"], ["goog.Timer", "goog.events.EventTarget", "goog.structs.Set"]);
goog.addDependency("/closure/goog/stats/basicstat.js", ["goog.stats.BasicStat"], ["goog.array", "goog.debug.Logger", "goog.iter", "goog.object", "goog.string.format", "goog.structs.CircularBuffer"]);
goog.addDependency("/closure/goog/storage/collectablestorage.js", ["goog.storage.CollectableStorage"], ["goog.array", "goog.asserts", "goog.iter", "goog.storage.ErrorCode", "goog.storage.ExpiringStorage", "goog.storage.RichStorage.Wrapper", "goog.storage.mechanism.IterableMechanism"]);
goog.addDependency("/closure/goog/storage/encryptedstorage.js", ["goog.storage.EncryptedStorage"], ["goog.crypt", "goog.crypt.Arc4", "goog.crypt.Sha1", "goog.crypt.base64", "goog.json", "goog.json.Serializer", "goog.storage.CollectableStorage", "goog.storage.ErrorCode", "goog.storage.RichStorage", "goog.storage.RichStorage.Wrapper", "goog.storage.mechanism.IterableMechanism"]);
goog.addDependency("/closure/goog/storage/errorcode.js", ["goog.storage.ErrorCode"], []);
goog.addDependency("/closure/goog/storage/expiringstorage.js", ["goog.storage.ExpiringStorage"], ["goog.storage.RichStorage", "goog.storage.RichStorage.Wrapper", "goog.storage.mechanism.Mechanism"]);
goog.addDependency("/closure/goog/storage/mechanism/errorcode.js", ["goog.storage.mechanism.ErrorCode"], []);
goog.addDependency("/closure/goog/storage/mechanism/html5localstorage.js", ["goog.storage.mechanism.HTML5LocalStorage"], ["goog.storage.mechanism.HTML5WebStorage"]);
goog.addDependency("/closure/goog/storage/mechanism/html5sessionstorage.js", ["goog.storage.mechanism.HTML5SessionStorage"], ["goog.storage.mechanism.HTML5WebStorage"]);
goog.addDependency("/closure/goog/storage/mechanism/html5webstorage.js", ["goog.storage.mechanism.HTML5WebStorage"], ["goog.asserts", "goog.iter.Iterator", "goog.iter.StopIteration", "goog.storage.mechanism.ErrorCode", "goog.storage.mechanism.IterableMechanism"]);
goog.addDependency("/closure/goog/storage/mechanism/ieuserdata.js", ["goog.storage.mechanism.IEUserData"], ["goog.asserts", "goog.iter.Iterator", "goog.iter.StopIteration", "goog.storage.mechanism.ErrorCode", "goog.storage.mechanism.IterableMechanism", "goog.structs.Map", "goog.userAgent"]);
goog.addDependency("/closure/goog/storage/mechanism/iterablemechanism.js", ["goog.storage.mechanism.IterableMechanism"], ["goog.array", "goog.asserts", "goog.iter", "goog.iter.Iterator", "goog.storage.mechanism.Mechanism"]);
goog.addDependency("/closure/goog/storage/mechanism/iterablemechanism_test.js", ["goog.storage.mechanism.iterablemechanism_test"], ["goog.iter.Iterator", "goog.storage.mechanism.IterableMechanism", "goog.testing.asserts"]);
goog.addDependency("/closure/goog/storage/mechanism/mechanism.js", ["goog.storage.mechanism.Mechanism"], []);
goog.addDependency("/closure/goog/storage/mechanism/mechanism_separation_test.js", ["goog.storage.mechanism.mechanism_separation_test"], ["goog.iter.Iterator", "goog.storage.mechanism.IterableMechanism", "goog.testing.asserts"]);
goog.addDependency("/closure/goog/storage/mechanism/mechanism_sharing_test.js", ["goog.storage.mechanism.mechanism_sharing_test"], ["goog.iter.Iterator", "goog.storage.mechanism.IterableMechanism", "goog.testing.asserts"]);
goog.addDependency("/closure/goog/storage/mechanism/mechanism_test.js", ["goog.storage.mechanism.mechanism_test"], ["goog.storage.mechanism.ErrorCode", "goog.storage.mechanism.HTML5LocalStorage", "goog.storage.mechanism.Mechanism", "goog.testing.asserts", "goog.userAgent.product", "goog.userAgent.product.isVersion"]);
goog.addDependency("/closure/goog/storage/mechanism/mechanismfactory.js", ["goog.storage.mechanism.mechanismfactory"], ["goog.storage.mechanism.HTML5LocalStorage", "goog.storage.mechanism.HTML5SessionStorage", "goog.storage.mechanism.IEUserData", "goog.storage.mechanism.IterableMechanism", "goog.storage.mechanism.PrefixedMechanism"]);
goog.addDependency("/closure/goog/storage/mechanism/prefixedmechanism.js", ["goog.storage.mechanism.PrefixedMechanism"], ["goog.iter.Iterator", "goog.storage.mechanism.IterableMechanism"]);
goog.addDependency("/closure/goog/storage/richstorage.js", ["goog.storage.RichStorage", "goog.storage.RichStorage.Wrapper"], ["goog.storage.ErrorCode", "goog.storage.Storage", "goog.storage.mechanism.Mechanism"]);
goog.addDependency("/closure/goog/storage/storage.js", ["goog.storage.Storage"], ["goog.json", "goog.json.Serializer", "goog.storage.ErrorCode", "goog.storage.mechanism.Mechanism"]);
goog.addDependency("/closure/goog/storage/storage_test.js", ["goog.storage.storage_test"], ["goog.storage.Storage", "goog.structs.Map", "goog.testing.asserts"]);
goog.addDependency("/closure/goog/string/linkify.js", ["goog.string.linkify"], ["goog.string"]);
goog.addDependency("/closure/goog/string/parser.js", ["goog.string.Parser"], []);
goog.addDependency("/closure/goog/string/path.js", ["goog.string.path"], ["goog.array", "goog.string"]);
goog.addDependency("/closure/goog/string/string.js", ["goog.string", "goog.string.Unicode"], []);
goog.addDependency("/closure/goog/string/stringbuffer.js", ["goog.string.StringBuffer"], []);
goog.addDependency("/closure/goog/string/stringformat.js", ["goog.string.format"], ["goog.string"]);
goog.addDependency("/closure/goog/string/stringifier.js", ["goog.string.Stringifier"], []);
goog.addDependency("/closure/goog/structs/avltree.js", ["goog.structs.AvlTree", "goog.structs.AvlTree.Node"], ["goog.structs", "goog.structs.Collection"]);
goog.addDependency("/closure/goog/structs/circularbuffer.js", ["goog.structs.CircularBuffer"], []);
goog.addDependency("/closure/goog/structs/collection.js", ["goog.structs.Collection"], []);
goog.addDependency("/closure/goog/structs/heap.js", ["goog.structs.Heap"], ["goog.array", "goog.object", "goog.structs.Node"]);
goog.addDependency("/closure/goog/structs/inversionmap.js", ["goog.structs.InversionMap"], ["goog.array"]);
goog.addDependency("/closure/goog/structs/linkedmap.js", ["goog.structs.LinkedMap"], ["goog.structs.Map"]);
goog.addDependency("/closure/goog/structs/map.js", ["goog.structs.Map"], ["goog.iter.Iterator", "goog.iter.StopIteration", "goog.object", "goog.structs"]);
goog.addDependency("/closure/goog/structs/node.js", ["goog.structs.Node"], []);
goog.addDependency("/closure/goog/structs/pool.js", ["goog.structs.Pool"], ["goog.Disposable", "goog.structs.Queue", "goog.structs.Set"]);
goog.addDependency("/closure/goog/structs/prioritypool.js", ["goog.structs.PriorityPool"], ["goog.structs.Pool", "goog.structs.PriorityQueue"]);
goog.addDependency("/closure/goog/structs/priorityqueue.js", ["goog.structs.PriorityQueue"], ["goog.structs", "goog.structs.Heap"]);
goog.addDependency("/closure/goog/structs/quadtree.js", ["goog.structs.QuadTree", "goog.structs.QuadTree.Node", "goog.structs.QuadTree.Point"], ["goog.math.Coordinate"]);
goog.addDependency("/closure/goog/structs/queue.js", ["goog.structs.Queue"], ["goog.array"]);
goog.addDependency("/closure/goog/structs/set.js", ["goog.structs.Set"], ["goog.structs", "goog.structs.Collection", "goog.structs.Map"]);
goog.addDependency("/closure/goog/structs/simplepool.js", ["goog.structs.SimplePool"], ["goog.Disposable"]);
goog.addDependency("/closure/goog/structs/stringset.js", ["goog.structs.StringSet"], ["goog.iter"]);
goog.addDependency("/closure/goog/structs/structs.js", ["goog.structs"], ["goog.array", "goog.object"]);
goog.addDependency("/closure/goog/structs/treenode.js", ["goog.structs.TreeNode"], ["goog.array", "goog.asserts", "goog.structs.Node"]);
goog.addDependency("/closure/goog/structs/trie.js", ["goog.structs.Trie"], ["goog.object", "goog.structs"]);
goog.addDependency("/closure/goog/style/bidi.js", ["goog.style.bidi"], ["goog.dom", "goog.style", "goog.userAgent"]);
goog.addDependency("/closure/goog/style/cursor.js", ["goog.style.cursor"], ["goog.userAgent"]);
goog.addDependency("/closure/goog/style/style.js", ["goog.style"], ["goog.array", "goog.dom", "goog.math.Box", "goog.math.Coordinate", "goog.math.Rect", "goog.math.Size", "goog.object", "goog.string", "goog.userAgent"]);
goog.addDependency("/closure/goog/style/style_test.js", ["goog.style_test"], ["goog.dom", "goog.style", "goog.testing.asserts"]);
goog.addDependency("/closure/goog/style/transition.js", ["goog.style.transition", "goog.style.transition.Css3Property"], ["goog.array", "goog.asserts", "goog.userAgent"]);
goog.addDependency("/closure/goog/testing/asserts.js", ["goog.testing.JsUnitException", "goog.testing.asserts"], ["goog.testing.stacktrace"]);
goog.addDependency("/closure/goog/testing/async/mockcontrol.js", ["goog.testing.async.MockControl"], ["goog.asserts", "goog.async.Deferred", "goog.debug", "goog.testing.asserts", "goog.testing.mockmatchers.IgnoreArgument"]);
goog.addDependency("/closure/goog/testing/asynctestcase.js", ["goog.testing.AsyncTestCase", "goog.testing.AsyncTestCase.ControlBreakingException"], ["goog.testing.TestCase", "goog.testing.TestCase.Test", "goog.testing.asserts"]);
goog.addDependency("/closure/goog/testing/benchmark.js", ["goog.testing.benchmark"], ["goog.dom", "goog.dom.TagName", "goog.testing.PerformanceTable", "goog.testing.PerformanceTimer", "goog.testing.TestCase"]);
goog.addDependency("/closure/goog/testing/benchmarks/jsbinarysizebutton.js", ["goog.ui.benchmarks.jsbinarysizebutton"], ["goog.array", "goog.dom", "goog.events", "goog.ui.Button", "goog.ui.ButtonSide", "goog.ui.Component.EventType", "goog.ui.CustomButton"]);
goog.addDependency("/closure/goog/testing/benchmarks/jsbinarysizetoolbar.js", ["goog.ui.benchmarks.jsbinarysizetoolbar"], ["goog.array", "goog.dom", "goog.events", "goog.object", "goog.ui.Component.EventType", "goog.ui.Option", "goog.ui.Toolbar", "goog.ui.ToolbarButton", "goog.ui.ToolbarSelect", "goog.ui.ToolbarSeparator"]);
goog.addDependency("/closure/goog/testing/continuationtestcase.js", ["goog.testing.ContinuationTestCase", "goog.testing.ContinuationTestCase.Step", "goog.testing.ContinuationTestCase.Test"], ["goog.array", "goog.events.EventHandler", "goog.testing.TestCase", "goog.testing.TestCase.Test", "goog.testing.asserts"]);
goog.addDependency("/closure/goog/testing/deferredtestcase.js", ["goog.testing.DeferredTestCase"], ["goog.async.Deferred", "goog.testing.AsyncTestCase", "goog.testing.TestCase"]);
goog.addDependency("/closure/goog/testing/dom.js", ["goog.testing.dom"], ["goog.dom", "goog.dom.NodeIterator", "goog.dom.NodeType", "goog.dom.TagIterator", "goog.dom.TagName", "goog.dom.classes", "goog.iter", "goog.object", "goog.string", "goog.style", "goog.testing.asserts", "goog.userAgent"]);
goog.addDependency("/closure/goog/testing/editor/dom.js", ["goog.testing.editor.dom"], ["goog.dom.NodeType", "goog.dom.TagIterator", "goog.dom.TagWalkType", "goog.iter", "goog.string", "goog.testing.asserts"]);
goog.addDependency("/closure/goog/testing/editor/fieldmock.js", ["goog.testing.editor.FieldMock"], ["goog.dom", "goog.dom.Range", "goog.editor.Field", "goog.testing.LooseMock"]);
goog.addDependency("/closure/goog/testing/editor/testhelper.js", ["goog.testing.editor.TestHelper"], ["goog.Disposable", "goog.dom", "goog.dom.Range", "goog.editor.BrowserFeature", "goog.editor.node", "goog.testing.dom"]);
goog.addDependency("/closure/goog/testing/events/eventobserver.js", ["goog.testing.events.EventObserver"], ["goog.array"]);
goog.addDependency("/closure/goog/testing/events/events.js", ["goog.testing.events", "goog.testing.events.Event"], ["goog.events", "goog.events.BrowserEvent", "goog.events.BrowserEvent.MouseButton", "goog.events.BrowserFeature", "goog.events.EventType", "goog.events.KeyCodes", "goog.object", "goog.style", "goog.userAgent"]);
goog.addDependency("/closure/goog/testing/events/matchers.js", ["goog.testing.events.EventMatcher"], ["goog.events.Event", "goog.testing.mockmatchers.ArgumentMatcher"]);
goog.addDependency("/closure/goog/testing/events/onlinehandler.js", ["goog.testing.events.OnlineHandler"], ["goog.events.EventTarget", "goog.events.OnlineHandler.EventType"]);
goog.addDependency("/closure/goog/testing/expectedfailures.js", ["goog.testing.ExpectedFailures"], ["goog.debug.DivConsole", "goog.debug.Logger", "goog.dom", "goog.dom.TagName", "goog.events", "goog.events.EventType", "goog.style", "goog.testing.JsUnitException", "goog.testing.TestCase", "goog.testing.asserts"]);
goog.addDependency("/closure/goog/testing/fs/blob.js", ["goog.testing.fs.Blob"], ["goog.crypt.base64"]);
goog.addDependency("/closure/goog/testing/fs/entry.js", ["goog.testing.fs.DirectoryEntry", "goog.testing.fs.Entry", "goog.testing.fs.FileEntry"], ["goog.Timer", "goog.array", "goog.async.Deferred", "goog.fs.DirectoryEntry", "goog.fs.DirectoryEntry.Behavior", "goog.fs.Error", "goog.functions", "goog.object", "goog.string", "goog.testing.fs.File", "goog.testing.fs.FileWriter"]);
goog.addDependency("/closure/goog/testing/fs/file.js", ["goog.testing.fs.File"], ["goog.testing.fs.Blob"]);
goog.addDependency("/closure/goog/testing/fs/filereader.js", ["goog.testing.fs.FileReader"], ["goog.Timer", "goog.events.EventTarget", "goog.fs.Error", "goog.fs.FileReader.EventType", "goog.fs.FileReader.ReadyState", "goog.testing.fs.File", "goog.testing.fs.ProgressEvent"]);
goog.addDependency("/closure/goog/testing/fs/filesystem.js", ["goog.testing.fs.FileSystem"], ["goog.testing.fs.DirectoryEntry"]);
goog.addDependency("/closure/goog/testing/fs/filewriter.js", ["goog.testing.fs.FileWriter"], ["goog.Timer", "goog.events.Event", "goog.events.EventTarget", "goog.fs.Error", "goog.fs.FileSaver.EventType", "goog.fs.FileSaver.ReadyState", "goog.string", "goog.testing.fs.File", "goog.testing.fs.ProgressEvent"]);
goog.addDependency("/closure/goog/testing/fs/fs.js", ["goog.testing.fs"], ["goog.Timer", "goog.array", "goog.fs", "goog.testing.fs.Blob", "goog.testing.fs.FileSystem"]);
goog.addDependency("/closure/goog/testing/fs/progressevent.js", ["goog.testing.fs.ProgressEvent"], ["goog.events.Event"]);
goog.addDependency("/closure/goog/testing/functionmock.js", ["goog.testing", "goog.testing.FunctionMock", "goog.testing.GlobalFunctionMock", "goog.testing.MethodMock"], ["goog.object", "goog.testing.LooseMock", "goog.testing.Mock", "goog.testing.MockInterface", "goog.testing.PropertyReplacer", "goog.testing.StrictMock"]);
goog.addDependency("/closure/goog/testing/graphics.js", ["goog.testing.graphics"], ["goog.graphics.Path.Segment", "goog.testing.asserts"]);
goog.addDependency("/closure/goog/testing/jsunit.js", ["goog.testing.jsunit"], ["goog.testing.TestCase", "goog.testing.TestRunner"]);
goog.addDependency("/closure/goog/testing/loosemock.js", ["goog.testing.LooseExpectationCollection", "goog.testing.LooseMock"], ["goog.array", "goog.structs.Map", "goog.testing.Mock"]);
goog.addDependency("/closure/goog/testing/messaging/mockmessagechannel.js", ["goog.testing.messaging.MockMessageChannel"], ["goog.messaging.AbstractChannel", "goog.testing.asserts"]);
goog.addDependency("/closure/goog/testing/messaging/mockmessageevent.js", ["goog.testing.messaging.MockMessageEvent"], ["goog.events.BrowserEvent", "goog.events.EventType", "goog.testing.events"]);
goog.addDependency("/closure/goog/testing/messaging/mockmessageport.js", ["goog.testing.messaging.MockMessagePort"], ["goog.events.EventTarget"]);
goog.addDependency("/closure/goog/testing/messaging/mockportnetwork.js", ["goog.testing.messaging.MockPortNetwork"], ["goog.messaging.PortNetwork", "goog.testing.messaging.MockMessageChannel"]);
goog.addDependency("/closure/goog/testing/mock.js", ["goog.testing.Mock", "goog.testing.MockExpectation"], ["goog.array", "goog.object", "goog.testing.JsUnitException", "goog.testing.MockInterface", "goog.testing.mockmatchers"]);
goog.addDependency("/closure/goog/testing/mockclassfactory.js", ["goog.testing.MockClassFactory", "goog.testing.MockClassRecord"], ["goog.array", "goog.object", "goog.testing.LooseMock", "goog.testing.StrictMock", "goog.testing.TestCase", "goog.testing.mockmatchers"]);
goog.addDependency("/closure/goog/testing/mockclock.js", ["goog.testing.MockClock"], ["goog.Disposable", "goog.testing.PropertyReplacer", "goog.testing.events", "goog.testing.events.Event"]);
goog.addDependency("/closure/goog/testing/mockcontrol.js", ["goog.testing.MockControl"], ["goog.array", "goog.testing", "goog.testing.LooseMock", "goog.testing.MockInterface", "goog.testing.StrictMock"]);
goog.addDependency("/closure/goog/testing/mockinterface.js", ["goog.testing.MockInterface"], []);
goog.addDependency("/closure/goog/testing/mockmatchers.js", ["goog.testing.mockmatchers", "goog.testing.mockmatchers.ArgumentMatcher", "goog.testing.mockmatchers.IgnoreArgument", "goog.testing.mockmatchers.InstanceOf", "goog.testing.mockmatchers.ObjectEquals", "goog.testing.mockmatchers.RegexpMatch", "goog.testing.mockmatchers.SaveArgument", "goog.testing.mockmatchers.TypeOf"], ["goog.array", "goog.dom", "goog.testing.asserts"]);
goog.addDependency("/closure/goog/testing/mockrandom.js", ["goog.testing.MockRandom"], ["goog.Disposable"]);
goog.addDependency("/closure/goog/testing/mockrange.js", ["goog.testing.MockRange"], ["goog.dom.AbstractRange", "goog.testing.LooseMock"]);
goog.addDependency("/closure/goog/testing/mockstorage.js", ["goog.testing.MockStorage"], ["goog.structs.Map"]);
goog.addDependency("/closure/goog/testing/mockuseragent.js", ["goog.testing.MockUserAgent"], ["goog.Disposable", "goog.userAgent"]);
goog.addDependency("/closure/goog/testing/multitestrunner.js", ["goog.testing.MultiTestRunner", "goog.testing.MultiTestRunner.TestFrame"], ["goog.Timer", "goog.array", "goog.dom", "goog.dom.classes", "goog.events.EventHandler", "goog.functions", "goog.string", "goog.ui.Component", "goog.ui.ServerChart", "goog.ui.ServerChart.ChartType", "goog.ui.TableSorter"]);
goog.addDependency("/closure/goog/testing/net/xhrio.js", ["goog.testing.net.XhrIo"], ["goog.array", "goog.dom.xml", "goog.events", "goog.events.EventTarget", "goog.json", "goog.net.ErrorCode", "goog.net.EventType", "goog.net.HttpStatus", "goog.net.XhrIo.ResponseType", "goog.net.XmlHttp", "goog.object", "goog.structs.Map", "goog.uri.utils"]);
goog.addDependency("/closure/goog/testing/net/xhriopool.js", ["goog.testing.net.XhrIoPool"], ["goog.net.XhrIoPool", "goog.testing.net.XhrIo"]);
goog.addDependency("/closure/goog/testing/objectpropertystring.js", ["goog.testing.ObjectPropertyString"], []);
goog.addDependency("/closure/goog/testing/performancetable.js", ["goog.testing.PerformanceTable"], ["goog.dom", "goog.testing.PerformanceTimer"]);
goog.addDependency("/closure/goog/testing/performancetimer.js", ["goog.testing.PerformanceTimer", "goog.testing.PerformanceTimer.Task"], ["goog.array", "goog.math"]);
goog.addDependency("/closure/goog/testing/propertyreplacer.js", ["goog.testing.PropertyReplacer"], ["goog.userAgent"]);
goog.addDependency("/closure/goog/testing/pseudorandom.js", ["goog.testing.PseudoRandom"], ["goog.Disposable"]);
goog.addDependency("/closure/goog/testing/recordfunction.js", ["goog.testing.FunctionCall", "goog.testing.recordConstructor", "goog.testing.recordFunction"], []);
goog.addDependency("/closure/goog/testing/shardingtestcase.js", ["goog.testing.ShardingTestCase"], ["goog.asserts", "goog.testing.TestCase"]);
goog.addDependency("/closure/goog/testing/singleton.js", ["goog.testing.singleton"], []);
goog.addDependency("/closure/goog/testing/stacktrace.js", ["goog.testing.stacktrace", "goog.testing.stacktrace.Frame"], []);
goog.addDependency("/closure/goog/testing/storage/fakemechanism.js", ["goog.testing.storage.FakeMechanism"], ["goog.storage.mechanism.IterableMechanism", "goog.structs.Map"]);
goog.addDependency("/closure/goog/testing/strictmock.js", ["goog.testing.StrictMock"], ["goog.array", "goog.testing.Mock"]);
goog.addDependency("/closure/goog/testing/style/layoutasserts.js", ["goog.testing.style.layoutasserts"], ["goog.style", "goog.testing.asserts", "goog.testing.style"]);
goog.addDependency("/closure/goog/testing/style/style.js", ["goog.testing.style"], ["goog.dom", "goog.math.Rect", "goog.style"]);
goog.addDependency("/closure/goog/testing/testcase.js", ["goog.testing.TestCase", "goog.testing.TestCase.Error", "goog.testing.TestCase.Order", "goog.testing.TestCase.Result", "goog.testing.TestCase.Test"], ["goog.object", "goog.testing.asserts", "goog.testing.stacktrace"]);
goog.addDependency("/closure/goog/testing/testqueue.js", ["goog.testing.TestQueue"], []);
goog.addDependency("/closure/goog/testing/testrunner.js", ["goog.testing.TestRunner"], ["goog.testing.TestCase"]);
goog.addDependency("/closure/goog/testing/ui/rendererasserts.js", ["goog.testing.ui.rendererasserts"], ["goog.testing.asserts"]);
goog.addDependency("/closure/goog/testing/ui/rendererharness.js", ["goog.testing.ui.RendererHarness"], ["goog.Disposable", "goog.dom.NodeType", "goog.testing.asserts"]);
goog.addDependency("/closure/goog/testing/ui/style.js", ["goog.testing.ui.style"], ["goog.array", "goog.dom", "goog.dom.classes", "goog.testing.asserts"]);
goog.addDependency("/closure/goog/timer/timer.js", ["goog.Timer"], ["goog.events.EventTarget"]);
goog.addDependency("/closure/goog/tweak/entries.js", ["goog.tweak.BaseEntry", "goog.tweak.BasePrimitiveSetting", "goog.tweak.BaseSetting", "goog.tweak.BooleanGroup", "goog.tweak.BooleanInGroupSetting", "goog.tweak.BooleanSetting", "goog.tweak.ButtonAction", "goog.tweak.NumericSetting", "goog.tweak.StringSetting"], ["goog.array", "goog.asserts", "goog.debug.Logger", "goog.object"]);
goog.addDependency("/closure/goog/tweak/registry.js", ["goog.tweak.Registry"], ["goog.asserts", "goog.debug.Logger", "goog.object", "goog.string", "goog.tweak.BaseEntry", "goog.uri.utils"]);
goog.addDependency("/closure/goog/tweak/testhelpers.js", ["goog.tweak.testhelpers"], ["goog.tweak"]);
goog.addDependency("/closure/goog/tweak/tweak.js", ["goog.tweak", "goog.tweak.ConfigParams"], ["goog.asserts", "goog.tweak.BooleanGroup", "goog.tweak.BooleanInGroupSetting", "goog.tweak.BooleanSetting", "goog.tweak.ButtonAction", "goog.tweak.NumericSetting", "goog.tweak.Registry", "goog.tweak.StringSetting"]);
goog.addDependency("/closure/goog/tweak/tweakui.js", ["goog.tweak.EntriesPanel", "goog.tweak.TweakUi"], ["goog.array", "goog.asserts", "goog.dom.DomHelper", "goog.object", "goog.style", "goog.tweak", "goog.ui.Zippy", "goog.userAgent"]);
goog.addDependency("/closure/goog/ui/abstractspellchecker.js", ["goog.ui.AbstractSpellChecker", "goog.ui.AbstractSpellChecker.AsyncResult"], ["goog.asserts", "goog.dom", "goog.dom.classes", "goog.dom.selection", "goog.events.EventType", "goog.math.Coordinate", "goog.spell.SpellCheck", "goog.structs.Set", "goog.style", "goog.ui.MenuItem", "goog.ui.MenuSeparator", "goog.ui.PopupMenu"]);
goog.addDependency("/closure/goog/ui/ac/ac.js", ["goog.ui.ac"], ["goog.ui.ac.ArrayMatcher", "goog.ui.ac.AutoComplete", "goog.ui.ac.InputHandler", "goog.ui.ac.Renderer"]);
goog.addDependency("/closure/goog/ui/ac/arraymatcher.js", ["goog.ui.ac.ArrayMatcher"], ["goog.iter", "goog.string"]);
goog.addDependency("/closure/goog/ui/ac/autocomplete.js", ["goog.ui.ac.AutoComplete", "goog.ui.ac.AutoComplete.EventType"], ["goog.events", "goog.events.EventTarget"]);
goog.addDependency("/closure/goog/ui/ac/inputhandler.js", ["goog.ui.ac.InputHandler"], ["goog.Disposable", "goog.Timer", "goog.dom", "goog.dom.a11y", "goog.dom.selection", "goog.events.EventHandler", "goog.events.EventType", "goog.events.KeyCodes", "goog.events.KeyHandler", "goog.events.KeyHandler.EventType", "goog.string", "goog.userAgent", "goog.userAgent.product"]);
goog.addDependency("/closure/goog/ui/ac/remote.js", ["goog.ui.ac.Remote"], ["goog.ui.ac.AutoComplete", "goog.ui.ac.InputHandler", "goog.ui.ac.RemoteArrayMatcher", "goog.ui.ac.Renderer"]);
goog.addDependency("/closure/goog/ui/ac/remotearraymatcher.js", ["goog.ui.ac.RemoteArrayMatcher"], ["goog.Disposable", "goog.Uri", "goog.events", "goog.json", "goog.net.XhrIo"]);
goog.addDependency("/closure/goog/ui/ac/renderer.js", ["goog.ui.ac.Renderer", "goog.ui.ac.Renderer.CustomRenderer"], ["goog.dispose", "goog.dom", "goog.dom.a11y", "goog.dom.classes", "goog.events.Event", "goog.events.EventTarget", "goog.events.EventType", "goog.fx.dom.FadeInAndShow", "goog.fx.dom.FadeOutAndHide", "goog.iter", "goog.positioning", "goog.positioning.Corner", "goog.positioning.Overflow", "goog.string", "goog.style", "goog.ui.IdGenerator", "goog.ui.ac.AutoComplete.EventType", "goog.userAgent"]);
goog.addDependency("/closure/goog/ui/ac/renderoptions.js", ["goog.ui.ac.RenderOptions"], []);
goog.addDependency("/closure/goog/ui/ac/richinputhandler.js", ["goog.ui.ac.RichInputHandler"], ["goog.ui.ac.InputHandler"]);
goog.addDependency("/closure/goog/ui/ac/richremote.js", ["goog.ui.ac.RichRemote"], ["goog.ui.ac.AutoComplete", "goog.ui.ac.Remote", "goog.ui.ac.Renderer", "goog.ui.ac.RichInputHandler", "goog.ui.ac.RichRemoteArrayMatcher"]);
goog.addDependency("/closure/goog/ui/ac/richremotearraymatcher.js", ["goog.ui.ac.RichRemoteArrayMatcher"], ["goog.ui.ac.RemoteArrayMatcher"]);
goog.addDependency("/closure/goog/ui/activitymonitor.js", ["goog.ui.ActivityMonitor"], ["goog.array", "goog.dom", "goog.events", "goog.events.EventHandler", "goog.events.EventTarget", "goog.events.EventType"]);
goog.addDependency("/closure/goog/ui/advancedtooltip.js", ["goog.ui.AdvancedTooltip"], ["goog.events.EventType", "goog.math.Coordinate", "goog.ui.Tooltip", "goog.userAgent"]);
goog.addDependency("/closure/goog/ui/animatedzippy.js", ["goog.ui.AnimatedZippy"], ["goog.dom", "goog.events", "goog.fx.Animation", "goog.fx.Animation.EventType", "goog.fx.Transition.EventType", "goog.fx.easing", "goog.ui.Zippy", "goog.ui.ZippyEvent"]);
goog.addDependency("/closure/goog/ui/attachablemenu.js", ["goog.ui.AttachableMenu"], ["goog.dom.a11y", "goog.dom.a11y.State", "goog.events.KeyCodes", "goog.ui.ItemEvent", "goog.ui.MenuBase"]);
goog.addDependency("/closure/goog/ui/autocomplete/arraymatcher.js", ["goog.ui.AutoComplete.ArrayMatcher"], ["goog.ui.AutoComplete", "goog.ui.ac.ArrayMatcher"]);
goog.addDependency("/closure/goog/ui/autocomplete/autocomplete.js", ["goog.ui.AutoComplete", "goog.ui.AutoComplete.EventType"], ["goog.ui.ac.AutoComplete", "goog.ui.ac.AutoComplete.EventType"]);
goog.addDependency("/closure/goog/ui/autocomplete/basic.js", ["goog.ui.AutoComplete.Basic"], ["goog.ui.AutoComplete", "goog.ui.AutoComplete.ArrayMatcher", "goog.ui.AutoComplete.InputHandler", "goog.ui.AutoComplete.Renderer", "goog.ui.ac"]);
goog.addDependency("/closure/goog/ui/autocomplete/inputhandler.js", ["goog.ui.AutoComplete.InputHandler"], ["goog.ui.AutoComplete", "goog.ui.ac.InputHandler"]);
goog.addDependency("/closure/goog/ui/autocomplete/remote.js", ["goog.ui.AutoComplete.Remote"], ["goog.ui.AutoComplete", "goog.ui.AutoComplete.InputHandler", "goog.ui.AutoComplete.RemoteArrayMatcher", "goog.ui.AutoComplete.Renderer", "goog.ui.ac.Remote"]);
goog.addDependency("/closure/goog/ui/autocomplete/remotearraymatcher.js", ["goog.ui.AutoComplete.RemoteArrayMatcher"], ["goog.ui.AutoComplete", "goog.ui.ac.RemoteArrayMatcher"]);
goog.addDependency("/closure/goog/ui/autocomplete/renderer.js", ["goog.ui.AutoComplete.Renderer", "goog.ui.AutoComplete.Renderer.CustomRenderer"], ["goog.ui.AutoComplete", "goog.ui.ac.Renderer", "goog.ui.ac.Renderer.CustomRenderer"]);
goog.addDependency("/closure/goog/ui/autocomplete/renderoptions.js", ["goog.ui.AutoComplete.RenderOptions"], ["goog.ui.AutoComplete", "goog.ui.ac.RenderOptions"]);
goog.addDependency("/closure/goog/ui/autocomplete/richinputhandler.js", ["goog.ui.AutoComplete.RichInputHandler"], ["goog.ui.AutoComplete", "goog.ui.AutoComplete.InputHandler", "goog.ui.ac.RichInputHandler"]);
goog.addDependency("/closure/goog/ui/autocomplete/richremote.js", ["goog.ui.AutoComplete.RichRemote"], ["goog.ui.AutoComplete", "goog.ui.AutoComplete.Remote", "goog.ui.AutoComplete.Renderer", "goog.ui.AutoComplete.RichInputHandler", "goog.ui.AutoComplete.RichRemoteArrayMatcher", "goog.ui.ac.RichRemote"]);
goog.addDependency("/closure/goog/ui/autocomplete/richremotearraymatcher.js", ["goog.ui.AutoComplete.RichRemoteArrayMatcher"], ["goog.ui.AutoComplete", "goog.ui.AutoComplete.RemoteArrayMatcher", "goog.ui.ac.RichRemoteArrayMatcher"]);
goog.addDependency("/closure/goog/ui/bidiinput.js", ["goog.ui.BidiInput"], ["goog.events", "goog.events.InputHandler", "goog.i18n.bidi", "goog.ui.Component"]);
goog.addDependency("/closure/goog/ui/bubble.js", ["goog.ui.Bubble"], ["goog.Timer", "goog.dom", "goog.events", "goog.events.Event", "goog.events.EventType", "goog.math.Box", "goog.positioning", "goog.positioning.AbsolutePosition", "goog.positioning.AbstractPosition", "goog.positioning.AnchoredPosition", "goog.positioning.Corner", "goog.style", "goog.ui.Component", "goog.ui.Popup", "goog.ui.Popup.AnchoredPosition"]);
goog.addDependency("/closure/goog/ui/button.js", ["goog.ui.Button", "goog.ui.Button.Side"], ["goog.events.KeyCodes", "goog.ui.ButtonRenderer", "goog.ui.ButtonSide", "goog.ui.Control", "goog.ui.ControlContent", "goog.ui.NativeButtonRenderer"]);
goog.addDependency("/closure/goog/ui/buttonrenderer.js", ["goog.ui.ButtonRenderer"], ["goog.dom.a11y", "goog.dom.a11y.Role", "goog.dom.a11y.State", "goog.ui.ButtonSide", "goog.ui.Component.State", "goog.ui.ControlRenderer"]);
goog.addDependency("/closure/goog/ui/buttonside.js", ["goog.ui.ButtonSide"], []);
goog.addDependency("/closure/goog/ui/charcounter.js", ["goog.ui.CharCounter", "goog.ui.CharCounter.Display"], ["goog.dom", "goog.events", "goog.events.EventTarget", "goog.events.InputHandler"]);
goog.addDependency("/closure/goog/ui/charpicker.js", ["goog.ui.CharPicker"], ["goog.array", "goog.dom", "goog.events", "goog.events.EventHandler", "goog.events.EventType", "goog.events.InputHandler", "goog.events.KeyHandler", "goog.i18n.CharListDecompressor", "goog.i18n.uChar", "goog.i18n.uChar.NameFetcher", "goog.structs.Set", "goog.style", "goog.ui.Button", "goog.ui.Component", "goog.ui.ContainerScroller", "goog.ui.FlatButtonRenderer", "goog.ui.HoverCard", "goog.ui.LabelInput", "goog.ui.Menu", 
"goog.ui.MenuButton", "goog.ui.MenuItem", "goog.ui.Tooltip.ElementTooltipPosition"]);
goog.addDependency("/closure/goog/ui/checkbox.js", ["goog.ui.Checkbox", "goog.ui.Checkbox.State"], ["goog.dom.a11y", "goog.dom.a11y.State", "goog.events.EventType", "goog.events.KeyCodes", "goog.ui.CheckboxRenderer", "goog.ui.Component.EventType", "goog.ui.Component.State", "goog.ui.Control", "goog.ui.registry"]);
goog.addDependency("/closure/goog/ui/checkboxmenuitem.js", ["goog.ui.CheckBoxMenuItem"], ["goog.ui.ControlContent", "goog.ui.MenuItem", "goog.ui.registry"]);
goog.addDependency("/closure/goog/ui/checkboxrenderer.js", ["goog.ui.CheckboxRenderer"], ["goog.array", "goog.asserts", "goog.dom.a11y", "goog.dom.a11y.Role", "goog.dom.a11y.State", "goog.dom.classes", "goog.object", "goog.ui.ControlRenderer"]);
goog.addDependency("/closure/goog/ui/colorbutton.js", ["goog.ui.ColorButton"], ["goog.ui.Button", "goog.ui.ColorButtonRenderer", "goog.ui.registry"]);
goog.addDependency("/closure/goog/ui/colorbuttonrenderer.js", ["goog.ui.ColorButtonRenderer"], ["goog.dom.classes", "goog.functions", "goog.ui.ColorMenuButtonRenderer"]);
goog.addDependency("/closure/goog/ui/colormenubutton.js", ["goog.ui.ColorMenuButton"], ["goog.array", "goog.object", "goog.ui.ColorMenuButtonRenderer", "goog.ui.ColorPalette", "goog.ui.Component.EventType", "goog.ui.ControlContent", "goog.ui.Menu", "goog.ui.MenuButton", "goog.ui.registry"]);
goog.addDependency("/closure/goog/ui/colormenubuttonrenderer.js", ["goog.ui.ColorMenuButtonRenderer"], ["goog.color", "goog.dom.classes", "goog.ui.ControlContent", "goog.ui.MenuButtonRenderer", "goog.userAgent"]);
goog.addDependency("/closure/goog/ui/colorpalette.js", ["goog.ui.ColorPalette"], ["goog.array", "goog.color", "goog.dom", "goog.style", "goog.ui.Palette", "goog.ui.PaletteRenderer"]);
goog.addDependency("/closure/goog/ui/colorpicker.js", ["goog.ui.ColorPicker", "goog.ui.ColorPicker.EventType"], ["goog.ui.ColorPalette", "goog.ui.Component", "goog.ui.Component.State"]);
goog.addDependency("/closure/goog/ui/colorsplitbehavior.js", ["goog.ui.ColorSplitBehavior"], ["goog.ui.ColorButton", "goog.ui.ColorMenuButton", "goog.ui.SplitBehavior"]);
goog.addDependency("/closure/goog/ui/combobox.js", ["goog.ui.ComboBox", "goog.ui.ComboBoxItem"], ["goog.Timer", "goog.debug.Logger", "goog.dom.classes", "goog.events", "goog.events.InputHandler", "goog.events.KeyCodes", "goog.events.KeyHandler", "goog.positioning.Corner", "goog.positioning.MenuAnchoredPosition", "goog.string", "goog.style", "goog.ui.Component", "goog.ui.ItemEvent", "goog.ui.LabelInput", "goog.ui.Menu", "goog.ui.MenuItem", "goog.ui.registry", "goog.userAgent"]);
goog.addDependency("/closure/goog/ui/component.js", ["goog.ui.Component", "goog.ui.Component.Error", "goog.ui.Component.EventType", "goog.ui.Component.State"], ["goog.array", "goog.array.ArrayLike", "goog.dom", "goog.events.EventHandler", "goog.events.EventTarget", "goog.object", "goog.style", "goog.ui.IdGenerator"]);
goog.addDependency("/closure/goog/ui/container.js", ["goog.ui.Container", "goog.ui.Container.EventType", "goog.ui.Container.Orientation"], ["goog.dom", "goog.dom.a11y", "goog.dom.a11y.State", "goog.events.EventType", "goog.events.KeyCodes", "goog.events.KeyHandler", "goog.events.KeyHandler.EventType", "goog.style", "goog.ui.Component", "goog.ui.Component.Error", "goog.ui.Component.EventType", "goog.ui.Component.State", "goog.ui.ContainerRenderer"]);
goog.addDependency("/closure/goog/ui/containerrenderer.js", ["goog.ui.ContainerRenderer"], ["goog.array", "goog.dom", "goog.dom.a11y", "goog.dom.classes", "goog.string", "goog.style", "goog.ui.Separator", "goog.ui.registry", "goog.userAgent"]);
goog.addDependency("/closure/goog/ui/containerscroller.js", ["goog.ui.ContainerScroller"], ["goog.Timer", "goog.events.EventHandler", "goog.style", "goog.ui.Component", "goog.ui.Component.EventType", "goog.ui.Container.EventType"]);
goog.addDependency("/closure/goog/ui/control.js", ["goog.ui.Control"], ["goog.array", "goog.dom", "goog.events.BrowserEvent.MouseButton", "goog.events.Event", "goog.events.EventType", "goog.events.KeyCodes", "goog.events.KeyHandler", "goog.events.KeyHandler.EventType", "goog.string", "goog.ui.Component", "goog.ui.Component.Error", "goog.ui.Component.EventType", "goog.ui.Component.State", "goog.ui.ControlContent", "goog.ui.ControlRenderer", "goog.ui.decorate", "goog.ui.registry", "goog.userAgent"]);
goog.addDependency("/closure/goog/ui/controlcontent.js", ["goog.ui.ControlContent"], []);
goog.addDependency("/closure/goog/ui/controlrenderer.js", ["goog.ui.ControlRenderer"], ["goog.array", "goog.dom", "goog.dom.a11y", "goog.dom.a11y.State", "goog.dom.classes", "goog.object", "goog.style", "goog.ui.Component.State", "goog.ui.ControlContent", "goog.userAgent"]);
goog.addDependency("/closure/goog/ui/cookieeditor.js", ["goog.ui.CookieEditor"], ["goog.dom", "goog.dom.TagName", "goog.events.EventType", "goog.net.cookies", "goog.string", "goog.style", "goog.ui.Component"]);
goog.addDependency("/closure/goog/ui/css3buttonrenderer.js", ["goog.ui.Css3ButtonRenderer"], ["goog.dom", "goog.dom.TagName", "goog.dom.classes", "goog.ui.Button", "goog.ui.ButtonRenderer", "goog.ui.ControlContent", "goog.ui.INLINE_BLOCK_CLASSNAME", "goog.ui.registry"]);
goog.addDependency("/closure/goog/ui/css3menubuttonrenderer.js", ["goog.ui.Css3MenuButtonRenderer"], ["goog.dom", "goog.dom.TagName", "goog.ui.ControlContent", "goog.ui.INLINE_BLOCK_CLASSNAME", "goog.ui.MenuButton", "goog.ui.MenuButtonRenderer", "goog.ui.registry"]);
goog.addDependency("/closure/goog/ui/cssnames.js", ["goog.ui.INLINE_BLOCK_CLASSNAME"], []);
goog.addDependency("/closure/goog/ui/custombutton.js", ["goog.ui.CustomButton"], ["goog.ui.Button", "goog.ui.ControlContent", "goog.ui.CustomButtonRenderer", "goog.ui.registry"]);
goog.addDependency("/closure/goog/ui/custombuttonrenderer.js", ["goog.ui.CustomButtonRenderer"], ["goog.dom", "goog.dom.classes", "goog.string", "goog.ui.ButtonRenderer", "goog.ui.ControlContent", "goog.ui.INLINE_BLOCK_CLASSNAME"]);
goog.addDependency("/closure/goog/ui/customcolorpalette.js", ["goog.ui.CustomColorPalette"], ["goog.color", "goog.dom", "goog.ui.ColorPalette"]);
goog.addDependency("/closure/goog/ui/datepicker.js", ["goog.ui.DatePicker", "goog.ui.DatePicker.Events", "goog.ui.DatePickerEvent"], ["goog.date", "goog.date.Date", "goog.date.Interval", "goog.dom", "goog.dom.a11y", "goog.dom.classes", "goog.events", "goog.events.Event", "goog.events.EventType", "goog.events.KeyHandler", "goog.events.KeyHandler.EventType", "goog.i18n.DateTimeFormat", "goog.i18n.DateTimeSymbols", "goog.style", "goog.ui.Component", "goog.ui.IdGenerator"]);
goog.addDependency("/closure/goog/ui/decorate.js", ["goog.ui.decorate"], ["goog.ui.registry"]);
goog.addDependency("/closure/goog/ui/dialog.js", ["goog.ui.Dialog", "goog.ui.Dialog.ButtonSet", "goog.ui.Dialog.ButtonSet.DefaultButtons", "goog.ui.Dialog.DefaultButtonCaptions", "goog.ui.Dialog.DefaultButtonKeys", "goog.ui.Dialog.Event", "goog.ui.Dialog.EventType"], ["goog.asserts", "goog.dom", "goog.dom.NodeType", "goog.dom.TagName", "goog.dom.a11y", "goog.dom.classes", "goog.events.Event", "goog.events.EventType", "goog.events.KeyCodes", "goog.fx.Dragger", "goog.math.Rect", "goog.structs", "goog.structs.Map", 
"goog.style", "goog.ui.ModalPopup", "goog.userAgent"]);
goog.addDependency("/closure/goog/ui/dimensionpicker.js", ["goog.ui.DimensionPicker"], ["goog.events.EventType", "goog.math.Size", "goog.ui.Control", "goog.ui.DimensionPickerRenderer", "goog.ui.registry"]);
goog.addDependency("/closure/goog/ui/dimensionpickerrenderer.js", ["goog.ui.DimensionPickerRenderer"], ["goog.dom", "goog.dom.TagName", "goog.i18n.bidi", "goog.style", "goog.ui.ControlRenderer", "goog.userAgent"]);
goog.addDependency("/closure/goog/ui/dragdropdetector.js", ["goog.ui.DragDropDetector", "goog.ui.DragDropDetector.EventType", "goog.ui.DragDropDetector.ImageDropEvent", "goog.ui.DragDropDetector.LinkDropEvent"], ["goog.dom", "goog.dom.TagName", "goog.events.Event", "goog.events.EventHandler", "goog.events.EventTarget", "goog.events.EventType", "goog.math.Coordinate", "goog.string", "goog.style", "goog.userAgent"]);
goog.addDependency("/closure/goog/ui/drilldownrow.js", ["goog.ui.DrilldownRow"], ["goog.dom", "goog.dom.classes", "goog.events", "goog.ui.Component"]);
goog.addDependency("/closure/goog/ui/editor/abstractdialog.js", ["goog.ui.editor.AbstractDialog", "goog.ui.editor.AbstractDialog.Builder", "goog.ui.editor.AbstractDialog.EventType"], ["goog.dom", "goog.dom.classes", "goog.events.EventTarget", "goog.ui.Dialog", "goog.ui.Dialog.ButtonSet", "goog.ui.Dialog.DefaultButtonKeys", "goog.ui.Dialog.Event", "goog.ui.Dialog.EventType"]);
goog.addDependency("/closure/goog/ui/editor/bubble.js", ["goog.ui.editor.Bubble"], ["goog.debug.Logger", "goog.dom", "goog.dom.ViewportSizeMonitor", "goog.editor.style", "goog.events", "goog.events.EventHandler", "goog.events.EventType", "goog.math.Box", "goog.positioning", "goog.string", "goog.style", "goog.ui.Component.EventType", "goog.ui.PopupBase", "goog.ui.PopupBase.EventType", "goog.userAgent"]);
goog.addDependency("/closure/goog/ui/editor/defaulttoolbar.js", ["goog.ui.editor.DefaultToolbar"], ["goog.dom", "goog.dom.TagName", "goog.dom.classes", "goog.editor.Command", "goog.style", "goog.ui.ControlContent", "goog.ui.editor.ToolbarFactory", "goog.ui.editor.messages"]);
goog.addDependency("/closure/goog/ui/editor/equationeditordialog.js", ["goog.ui.editor.EquationEditorDialog"], ["goog.editor.Command", "goog.ui.editor.AbstractDialog", "goog.ui.editor.EquationEditorOkEvent", "goog.ui.equation.ChangeEvent", "goog.ui.equation.TexEditor"]);
goog.addDependency("/closure/goog/ui/editor/equationeditorokevent.js", ["goog.ui.editor.EquationEditorOkEvent"], ["goog.events.Event", "goog.ui.editor.AbstractDialog"]);
goog.addDependency("/closure/goog/ui/editor/linkdialog.js", ["goog.ui.editor.LinkDialog", "goog.ui.editor.LinkDialog.BeforeTestLinkEvent", "goog.ui.editor.LinkDialog.EventType", "goog.ui.editor.LinkDialog.OkEvent"], ["goog.dom", "goog.dom.DomHelper", "goog.dom.TagName", "goog.dom.classes", "goog.dom.selection", "goog.editor.BrowserFeature", "goog.editor.Link", "goog.editor.focus", "goog.events", "goog.events.EventHandler", "goog.events.EventType", "goog.events.InputHandler", "goog.events.InputHandler.EventType", 
"goog.string", "goog.style", "goog.ui.Button", "goog.ui.LinkButtonRenderer", "goog.ui.editor.AbstractDialog", "goog.ui.editor.AbstractDialog.Builder", "goog.ui.editor.AbstractDialog.EventType", "goog.ui.editor.TabPane", "goog.ui.editor.messages", "goog.userAgent", "goog.window"]);
goog.addDependency("/closure/goog/ui/editor/messages.js", ["goog.ui.editor.messages"], []);
goog.addDependency("/closure/goog/ui/editor/tabpane.js", ["goog.ui.editor.TabPane"], ["goog.dom.TagName", "goog.events.EventHandler", "goog.ui.Component", "goog.ui.Control", "goog.ui.Tab", "goog.ui.TabBar"]);
goog.addDependency("/closure/goog/ui/editor/toolbarcontroller.js", ["goog.ui.editor.ToolbarController"], ["goog.editor.Field.EventType", "goog.events.EventHandler", "goog.events.EventTarget", "goog.ui.Component.EventType"]);
goog.addDependency("/closure/goog/ui/editor/toolbarfactory.js", ["goog.ui.editor.ToolbarFactory"], ["goog.array", "goog.dom", "goog.string", "goog.string.Unicode", "goog.style", "goog.ui.Component.State", "goog.ui.Container.Orientation", "goog.ui.ControlContent", "goog.ui.Option", "goog.ui.Toolbar", "goog.ui.ToolbarButton", "goog.ui.ToolbarColorMenuButton", "goog.ui.ToolbarMenuButton", "goog.ui.ToolbarRenderer", "goog.ui.ToolbarSelect", "goog.userAgent"]);
goog.addDependency("/closure/goog/ui/emoji/emoji.js", ["goog.ui.emoji.Emoji"], []);
goog.addDependency("/closure/goog/ui/emoji/emojipalette.js", ["goog.ui.emoji.EmojiPalette"], ["goog.events.Event", "goog.events.EventType", "goog.net.ImageLoader", "goog.ui.Palette", "goog.ui.emoji.Emoji", "goog.ui.emoji.EmojiPaletteRenderer"]);
goog.addDependency("/closure/goog/ui/emoji/emojipaletterenderer.js", ["goog.ui.emoji.EmojiPaletteRenderer"], ["goog.dom", "goog.dom.a11y", "goog.ui.PaletteRenderer", "goog.ui.emoji.Emoji", "goog.ui.emoji.SpriteInfo"]);
goog.addDependency("/closure/goog/ui/emoji/emojipicker.js", ["goog.ui.emoji.EmojiPicker"], ["goog.debug.Logger", "goog.dom", "goog.ui.Component", "goog.ui.TabPane", "goog.ui.TabPane.TabPage", "goog.ui.emoji.Emoji", "goog.ui.emoji.EmojiPalette", "goog.ui.emoji.EmojiPaletteRenderer", "goog.ui.emoji.ProgressiveEmojiPaletteRenderer"]);
goog.addDependency("/closure/goog/ui/emoji/popupemojipicker.js", ["goog.ui.emoji.PopupEmojiPicker"], ["goog.dom", "goog.events.EventType", "goog.positioning.AnchoredPosition", "goog.ui.Component", "goog.ui.Popup", "goog.ui.emoji.EmojiPicker"]);
goog.addDependency("/closure/goog/ui/emoji/progressiveemojipaletterenderer.js", ["goog.ui.emoji.ProgressiveEmojiPaletteRenderer"], ["goog.ui.emoji.EmojiPaletteRenderer"]);
goog.addDependency("/closure/goog/ui/emoji/spriteinfo.js", ["goog.ui.emoji.SpriteInfo"], []);
goog.addDependency("/closure/goog/ui/equation/arrowpalette.js", ["goog.ui.equation.ArrowPalette"], ["goog.math.Size", "goog.ui.equation.Palette"]);
goog.addDependency("/closure/goog/ui/equation/changeevent.js", ["goog.ui.equation.ChangeEvent"], ["goog.events.Event", "goog.events.EventType"]);
goog.addDependency("/closure/goog/ui/equation/comparisonpalette.js", ["goog.ui.equation.ComparisonPalette"], ["goog.math.Size", "goog.ui.equation.Palette"]);
goog.addDependency("/closure/goog/ui/equation/editorpane.js", ["goog.ui.equation.EditorPane"], ["goog.dom", "goog.style", "goog.ui.Component"]);
goog.addDependency("/closure/goog/ui/equation/equationeditor.js", ["goog.ui.equation.EquationEditor"], ["goog.dom", "goog.events", "goog.ui.Component", "goog.ui.Tab", "goog.ui.TabBar", "goog.ui.equation.EditorPane", "goog.ui.equation.ImageRenderer", "goog.ui.equation.TexPane"]);
goog.addDependency("/closure/goog/ui/equation/equationeditordialog.js", ["goog.ui.equation.EquationEditorDialog"], ["goog.dom", "goog.ui.Dialog", "goog.ui.Dialog.ButtonSet", "goog.ui.equation.EquationEditor", "goog.ui.equation.ImageRenderer", "goog.ui.equation.TexEditor"]);
goog.addDependency("/closure/goog/ui/equation/greekpalette.js", ["goog.ui.equation.GreekPalette"], ["goog.math.Size", "goog.ui.equation.Palette"]);
goog.addDependency("/closure/goog/ui/equation/imagerenderer.js", ["goog.ui.equation.ImageRenderer"], ["goog.dom.TagName", "goog.dom.classes", "goog.string", "goog.uri.utils"]);
goog.addDependency("/closure/goog/ui/equation/mathpalette.js", ["goog.ui.equation.MathPalette"], ["goog.math.Size", "goog.ui.equation.Palette"]);
goog.addDependency("/closure/goog/ui/equation/menupalette.js", ["goog.ui.equation.MenuPalette", "goog.ui.equation.MenuPaletteRenderer"], ["goog.math.Size", "goog.style", "goog.ui.equation.Palette", "goog.ui.equation.PaletteRenderer"]);
goog.addDependency("/closure/goog/ui/equation/palette.js", ["goog.ui.equation.Palette", "goog.ui.equation.PaletteEvent", "goog.ui.equation.PaletteRenderer"], ["goog.dom", "goog.dom.TagName", "goog.ui.Palette", "goog.ui.equation.ImageRenderer"]);
goog.addDependency("/closure/goog/ui/equation/palettemanager.js", ["goog.ui.equation.PaletteManager"], ["goog.Timer", "goog.events.EventTarget", "goog.ui.equation.ArrowPalette", "goog.ui.equation.ComparisonPalette", "goog.ui.equation.GreekPalette", "goog.ui.equation.MathPalette", "goog.ui.equation.MenuPalette", "goog.ui.equation.Palette", "goog.ui.equation.SymbolPalette"]);
goog.addDependency("/closure/goog/ui/equation/symbolpalette.js", ["goog.ui.equation.SymbolPalette"], ["goog.math.Size", "goog.ui.equation.Palette"]);
goog.addDependency("/closure/goog/ui/equation/texeditor.js", ["goog.ui.equation.TexEditor"], ["goog.dom", "goog.ui.Component", "goog.ui.equation.ImageRenderer", "goog.ui.equation.TexPane"]);
goog.addDependency("/closure/goog/ui/equation/texpane.js", ["goog.ui.equation.TexPane"], ["goog.Timer", "goog.dom", "goog.dom.TagName", "goog.dom.selection", "goog.events", "goog.events.EventType", "goog.events.InputHandler", "goog.string", "goog.style", "goog.ui.Component", "goog.ui.equation.ChangeEvent", "goog.ui.equation.EditorPane", "goog.ui.equation.ImageRenderer", "goog.ui.equation.PaletteManager"]);
goog.addDependency("/closure/goog/ui/filteredmenu.js", ["goog.ui.FilteredMenu"], ["goog.dom", "goog.events.EventType", "goog.events.InputHandler", "goog.events.KeyCodes", "goog.string", "goog.ui.FilterObservingMenuItem", "goog.ui.Menu"]);
goog.addDependency("/closure/goog/ui/filterobservingmenuitem.js", ["goog.ui.FilterObservingMenuItem"], ["goog.ui.ControlContent", "goog.ui.FilterObservingMenuItemRenderer", "goog.ui.MenuItem", "goog.ui.registry"]);
goog.addDependency("/closure/goog/ui/filterobservingmenuitemrenderer.js", ["goog.ui.FilterObservingMenuItemRenderer"], ["goog.ui.MenuItemRenderer"]);
goog.addDependency("/closure/goog/ui/flatbuttonrenderer.js", ["goog.ui.FlatButtonRenderer"], ["goog.dom.classes", "goog.ui.Button", "goog.ui.ButtonRenderer", "goog.ui.INLINE_BLOCK_CLASSNAME", "goog.ui.registry"]);
goog.addDependency("/closure/goog/ui/flatmenubuttonrenderer.js", ["goog.ui.FlatMenuButtonRenderer"], ["goog.style", "goog.ui.ControlContent", "goog.ui.FlatButtonRenderer", "goog.ui.INLINE_BLOCK_CLASSNAME", "goog.ui.Menu", "goog.ui.MenuButton", "goog.ui.MenuRenderer", "goog.ui.registry"]);
goog.addDependency("/closure/goog/ui/formpost.js", ["goog.ui.FormPost"], ["goog.array", "goog.dom.TagName", "goog.string", "goog.string.StringBuffer", "goog.ui.Component"]);
goog.addDependency("/closure/goog/ui/gauge.js", ["goog.ui.Gauge", "goog.ui.GaugeColoredRange"], ["goog.dom", "goog.dom.a11y", "goog.fx.Animation", "goog.fx.Animation.EventType", "goog.fx.Transition.EventType", "goog.fx.easing", "goog.graphics", "goog.graphics.Font", "goog.graphics.Path", "goog.graphics.SolidFill", "goog.ui.Component", "goog.ui.GaugeTheme"]);
goog.addDependency("/closure/goog/ui/gaugetheme.js", ["goog.ui.GaugeTheme"], ["goog.graphics.LinearGradient", "goog.graphics.SolidFill", "goog.graphics.Stroke"]);
goog.addDependency("/closure/goog/ui/hovercard.js", ["goog.ui.HoverCard", "goog.ui.HoverCard.EventType", "goog.ui.HoverCard.TriggerEvent"], ["goog.dom", "goog.events", "goog.events.EventType", "goog.ui.AdvancedTooltip"]);
goog.addDependency("/closure/goog/ui/hsvapalette.js", ["goog.ui.HsvaPalette"], ["goog.array", "goog.color", "goog.color.alpha", "goog.events.EventType", "goog.ui.Component.EventType", "goog.ui.HsvPalette"]);
goog.addDependency("/closure/goog/ui/hsvpalette.js", ["goog.ui.HsvPalette"], ["goog.color", "goog.dom", "goog.dom.DomHelper", "goog.events", "goog.events.Event", "goog.events.EventType", "goog.events.InputHandler", "goog.style", "goog.style.bidi", "goog.ui.Component", "goog.ui.Component.EventType", "goog.userAgent"]);
goog.addDependency("/closure/goog/ui/idgenerator.js", ["goog.ui.IdGenerator"], []);
goog.addDependency("/closure/goog/ui/idletimer.js", ["goog.ui.IdleTimer"], ["goog.Timer", "goog.events", "goog.events.EventTarget", "goog.structs.Set", "goog.ui.ActivityMonitor"]);
goog.addDependency("/closure/goog/ui/iframemask.js", ["goog.ui.IframeMask"], ["goog.Disposable", "goog.Timer", "goog.dom", "goog.dom.DomHelper", "goog.dom.iframe", "goog.events.EventHandler", "goog.events.EventTarget", "goog.style"]);
goog.addDependency("/closure/goog/ui/imagelessbuttonrenderer.js", ["goog.ui.ImagelessButtonRenderer"], ["goog.dom.classes", "goog.ui.Button", "goog.ui.ControlContent", "goog.ui.CustomButtonRenderer", "goog.ui.INLINE_BLOCK_CLASSNAME", "goog.ui.registry"]);
goog.addDependency("/closure/goog/ui/imagelessmenubuttonrenderer.js", ["goog.ui.ImagelessMenuButtonRenderer"], ["goog.dom", "goog.dom.TagName", "goog.dom.classes", "goog.ui.ControlContent", "goog.ui.INLINE_BLOCK_CLASSNAME", "goog.ui.MenuButton", "goog.ui.MenuButtonRenderer", "goog.ui.registry"]);
goog.addDependency("/closure/goog/ui/inputdatepicker.js", ["goog.ui.InputDatePicker"], ["goog.date.DateTime", "goog.dom", "goog.string", "goog.ui.Component", "goog.ui.DatePicker", "goog.ui.PopupBase", "goog.ui.PopupDatePicker"]);
goog.addDependency("/closure/goog/ui/itemevent.js", ["goog.ui.ItemEvent"], ["goog.events.Event"]);
goog.addDependency("/closure/goog/ui/keyboardshortcuthandler.js", ["goog.ui.KeyboardShortcutEvent", "goog.ui.KeyboardShortcutHandler", "goog.ui.KeyboardShortcutHandler.EventType"], ["goog.Timer", "goog.events", "goog.events.Event", "goog.events.EventTarget", "goog.events.EventType", "goog.events.KeyCodes", "goog.events.KeyNames", "goog.object"]);
goog.addDependency("/closure/goog/ui/labelinput.js", ["goog.ui.LabelInput"], ["goog.Timer", "goog.dom", "goog.dom.a11y", "goog.dom.a11y.State", "goog.dom.classes", "goog.events.EventHandler", "goog.events.EventType", "goog.ui.Component", "goog.userAgent"]);
goog.addDependency("/closure/goog/ui/linkbuttonrenderer.js", ["goog.ui.LinkButtonRenderer"], ["goog.ui.Button", "goog.ui.FlatButtonRenderer", "goog.ui.registry"]);
goog.addDependency("/closure/goog/ui/media/flashobject.js", ["goog.ui.media.FlashObject", "goog.ui.media.FlashObject.ScriptAccessLevel", "goog.ui.media.FlashObject.Wmodes"], ["goog.asserts", "goog.debug.Logger", "goog.events.EventHandler", "goog.string", "goog.structs.Map", "goog.style", "goog.ui.Component", "goog.ui.Component.Error", "goog.userAgent", "goog.userAgent.flash"]);
goog.addDependency("/closure/goog/ui/media/flickr.js", ["goog.ui.media.FlickrSet", "goog.ui.media.FlickrSetModel"], ["goog.object", "goog.ui.media.FlashObject", "goog.ui.media.Media", "goog.ui.media.MediaModel", "goog.ui.media.MediaModel.Player", "goog.ui.media.MediaRenderer"]);
goog.addDependency("/closure/goog/ui/media/googlevideo.js", ["goog.ui.media.GoogleVideo", "goog.ui.media.GoogleVideoModel"], ["goog.string", "goog.ui.media.FlashObject", "goog.ui.media.Media", "goog.ui.media.MediaModel", "goog.ui.media.MediaModel.Player", "goog.ui.media.MediaRenderer"]);
goog.addDependency("/closure/goog/ui/media/media.js", ["goog.ui.media.Media", "goog.ui.media.MediaRenderer"], ["goog.style", "goog.ui.Component.State", "goog.ui.Control", "goog.ui.ControlRenderer"]);
goog.addDependency("/closure/goog/ui/media/mediamodel.js", ["goog.ui.media.MediaModel", "goog.ui.media.MediaModel.Category", "goog.ui.media.MediaModel.Credit", "goog.ui.media.MediaModel.Credit.Role", "goog.ui.media.MediaModel.Credit.Scheme", "goog.ui.media.MediaModel.Medium", "goog.ui.media.MediaModel.MimeType", "goog.ui.media.MediaModel.Player", "goog.ui.media.MediaModel.SubTitle", "goog.ui.media.MediaModel.Thumbnail"], ["goog.array"]);
goog.addDependency("/closure/goog/ui/media/mp3.js", ["goog.ui.media.Mp3"], ["goog.string", "goog.ui.media.FlashObject", "goog.ui.media.Media", "goog.ui.media.MediaRenderer"]);
goog.addDependency("/closure/goog/ui/media/photo.js", ["goog.ui.media.Photo"], ["goog.ui.media.Media", "goog.ui.media.MediaRenderer"]);
goog.addDependency("/closure/goog/ui/media/picasa.js", ["goog.ui.media.PicasaAlbum", "goog.ui.media.PicasaAlbumModel"], ["goog.object", "goog.ui.media.FlashObject", "goog.ui.media.Media", "goog.ui.media.MediaModel", "goog.ui.media.MediaModel.Player", "goog.ui.media.MediaRenderer"]);
goog.addDependency("/closure/goog/ui/media/vimeo.js", ["goog.ui.media.Vimeo", "goog.ui.media.VimeoModel"], ["goog.string", "goog.ui.media.FlashObject", "goog.ui.media.Media", "goog.ui.media.MediaModel", "goog.ui.media.MediaModel.Player", "goog.ui.media.MediaRenderer"]);
goog.addDependency("/closure/goog/ui/media/youtube.js", ["goog.ui.media.Youtube", "goog.ui.media.YoutubeModel"], ["goog.string", "goog.ui.Component.Error", "goog.ui.Component.State", "goog.ui.media.FlashObject", "goog.ui.media.Media", "goog.ui.media.MediaModel", "goog.ui.media.MediaModel.Player", "goog.ui.media.MediaModel.Thumbnail", "goog.ui.media.MediaRenderer"]);
goog.addDependency("/closure/goog/ui/menu.js", ["goog.ui.Menu", "goog.ui.Menu.EventType"], ["goog.math.Coordinate", "goog.string", "goog.style", "goog.ui.Component.EventType", "goog.ui.Component.State", "goog.ui.Container", "goog.ui.Container.Orientation", "goog.ui.MenuHeader", "goog.ui.MenuItem", "goog.ui.MenuRenderer", "goog.ui.MenuSeparator"]);
goog.addDependency("/closure/goog/ui/menubar.js", ["goog.ui.menuBar"], ["goog.ui.MenuBarRenderer"]);
goog.addDependency("/closure/goog/ui/menubardecorator.js", ["goog.ui.menuBarDecorator"], ["goog.ui.Container", "goog.ui.menuBar"]);
goog.addDependency("/closure/goog/ui/menubarrenderer.js", ["goog.ui.MenuBarRenderer"], ["goog.dom", "goog.dom.a11y", "goog.dom.a11y.Role", "goog.dom.a11y.State", "goog.ui.ContainerRenderer"]);
goog.addDependency("/closure/goog/ui/menubase.js", ["goog.ui.MenuBase"], ["goog.events.EventHandler", "goog.events.EventType", "goog.events.KeyHandler", "goog.events.KeyHandler.EventType", "goog.ui.Popup"]);
goog.addDependency("/closure/goog/ui/menubutton.js", ["goog.ui.MenuButton"], ["goog.Timer", "goog.dom", "goog.dom.a11y", "goog.dom.a11y.State", "goog.events.EventType", "goog.events.KeyCodes", "goog.events.KeyHandler.EventType", "goog.math.Box", "goog.math.Rect", "goog.positioning", "goog.positioning.Corner", "goog.positioning.MenuAnchoredPosition", "goog.style", "goog.ui.Button", "goog.ui.Component.EventType", "goog.ui.Component.State", "goog.ui.Menu", "goog.ui.MenuButtonRenderer", "goog.ui.registry", 
"goog.userAgent", "goog.userAgent.product"]);
goog.addDependency("/closure/goog/ui/menubuttonrenderer.js", ["goog.ui.MenuButtonRenderer"], ["goog.dom", "goog.style", "goog.ui.CustomButtonRenderer", "goog.ui.INLINE_BLOCK_CLASSNAME", "goog.ui.Menu", "goog.ui.MenuRenderer", "goog.userAgent"]);
goog.addDependency("/closure/goog/ui/menuheader.js", ["goog.ui.MenuHeader"], ["goog.ui.Component.State", "goog.ui.Control", "goog.ui.MenuHeaderRenderer", "goog.ui.registry"]);
goog.addDependency("/closure/goog/ui/menuheaderrenderer.js", ["goog.ui.MenuHeaderRenderer"], ["goog.dom", "goog.dom.classes", "goog.ui.ControlRenderer"]);
goog.addDependency("/closure/goog/ui/menuitem.js", ["goog.ui.MenuItem"], ["goog.array", "goog.dom", "goog.dom.classes", "goog.events.KeyCodes", "goog.math.Coordinate", "goog.string", "goog.ui.Component.State", "goog.ui.Control", "goog.ui.ControlContent", "goog.ui.MenuItemRenderer", "goog.ui.registry"]);
goog.addDependency("/closure/goog/ui/menuitemrenderer.js", ["goog.ui.MenuItemRenderer"], ["goog.dom", "goog.dom.a11y", "goog.dom.a11y.Role", "goog.dom.classes", "goog.ui.Component.State", "goog.ui.ControlContent", "goog.ui.ControlRenderer"]);
goog.addDependency("/closure/goog/ui/menurenderer.js", ["goog.ui.MenuRenderer"], ["goog.dom", "goog.dom.a11y", "goog.dom.a11y.Role", "goog.dom.a11y.State", "goog.ui.ContainerRenderer", "goog.ui.Separator"]);
goog.addDependency("/closure/goog/ui/menuseparator.js", ["goog.ui.MenuSeparator"], ["goog.ui.MenuSeparatorRenderer", "goog.ui.Separator", "goog.ui.registry"]);
goog.addDependency("/closure/goog/ui/menuseparatorrenderer.js", ["goog.ui.MenuSeparatorRenderer"], ["goog.dom", "goog.dom.classes", "goog.ui.ControlContent", "goog.ui.ControlRenderer"]);
goog.addDependency("/closure/goog/ui/mockactivitymonitor.js", ["goog.ui.MockActivityMonitor"], ["goog.events.EventType", "goog.ui.ActivityMonitor"]);
goog.addDependency("/closure/goog/ui/modalpopup.js", ["goog.ui.ModalPopup"], ["goog.Timer", "goog.asserts", "goog.dom", "goog.dom.TagName", "goog.dom.classes", "goog.dom.iframe", "goog.events", "goog.events.EventType", "goog.events.FocusHandler", "goog.fx.Transition", "goog.style", "goog.ui.Component", "goog.ui.PopupBase.EventType", "goog.userAgent"]);
goog.addDependency("/closure/goog/ui/nativebuttonrenderer.js", ["goog.ui.NativeButtonRenderer"], ["goog.dom.classes", "goog.events.EventType", "goog.ui.ButtonRenderer", "goog.ui.Component.State"]);
goog.addDependency("/closure/goog/ui/offlineinstalldialog.js", ["goog.ui.OfflineInstallDialog", "goog.ui.OfflineInstallDialog.ButtonKeyType", "goog.ui.OfflineInstallDialog.EnableScreen", "goog.ui.OfflineInstallDialog.InstallScreen", "goog.ui.OfflineInstallDialog.InstallingGearsScreen", "goog.ui.OfflineInstallDialog.ScreenType", "goog.ui.OfflineInstallDialog.UpgradeScreen", "goog.ui.OfflineInstallDialogScreen"], ["goog.Disposable", "goog.dom.classes", "goog.gears", "goog.string", "goog.string.StringBuffer", 
"goog.ui.Dialog", "goog.ui.Dialog.ButtonSet", "goog.ui.Dialog.EventType", "goog.window"]);
goog.addDependency("/closure/goog/ui/offlinestatuscard.js", ["goog.ui.OfflineStatusCard", "goog.ui.OfflineStatusCard.EventType"], ["goog.dom", "goog.events.EventType", "goog.gears.StatusType", "goog.structs.Map", "goog.style", "goog.ui.Component", "goog.ui.Component.EventType", "goog.ui.ProgressBar"]);
goog.addDependency("/closure/goog/ui/offlinestatuscomponent.js", ["goog.ui.OfflineStatusComponent", "goog.ui.OfflineStatusComponent.StatusClassNames"], ["goog.dom.classes", "goog.events.EventType", "goog.gears.StatusType", "goog.positioning", "goog.positioning.AnchoredPosition", "goog.positioning.Corner", "goog.positioning.Overflow", "goog.ui.Component", "goog.ui.OfflineStatusCard.EventType", "goog.ui.Popup"]);
goog.addDependency("/closure/goog/ui/option.js", ["goog.ui.Option"], ["goog.ui.Component.EventType", "goog.ui.ControlContent", "goog.ui.MenuItem", "goog.ui.registry"]);
goog.addDependency("/closure/goog/ui/palette.js", ["goog.ui.Palette"], ["goog.array", "goog.dom", "goog.events.EventType", "goog.events.KeyCodes", "goog.math.Size", "goog.ui.Component.Error", "goog.ui.Component.EventType", "goog.ui.Control", "goog.ui.PaletteRenderer", "goog.ui.SelectionModel"]);
goog.addDependency("/closure/goog/ui/paletterenderer.js", ["goog.ui.PaletteRenderer"], ["goog.array", "goog.dom", "goog.dom.NodeType", "goog.dom.a11y", "goog.dom.classes", "goog.style", "goog.ui.ControlRenderer", "goog.userAgent"]);
goog.addDependency("/closure/goog/ui/plaintextspellchecker.js", ["goog.ui.PlainTextSpellChecker"], ["goog.Timer", "goog.dom", "goog.dom.a11y", "goog.events.EventHandler", "goog.events.EventType", "goog.events.KeyCodes", "goog.events.KeyHandler", "goog.events.KeyHandler.EventType", "goog.style", "goog.ui.AbstractSpellChecker", "goog.ui.AbstractSpellChecker.AsyncResult", "goog.ui.Component.EventType", "goog.userAgent"]);
goog.addDependency("/closure/goog/ui/popup.js", ["goog.ui.Popup", "goog.ui.Popup.AbsolutePosition", "goog.ui.Popup.AnchoredPosition", "goog.ui.Popup.AnchoredViewPortPosition", "goog.ui.Popup.ClientPosition", "goog.ui.Popup.Corner", "goog.ui.Popup.Overflow", "goog.ui.Popup.ViewPortClientPosition", "goog.ui.Popup.ViewPortPosition"], ["goog.math.Box", "goog.positioning", "goog.positioning.AbsolutePosition", "goog.positioning.AnchoredPosition", "goog.positioning.AnchoredViewportPosition", "goog.positioning.ClientPosition", 
"goog.positioning.Corner", "goog.positioning.Overflow", "goog.positioning.OverflowStatus", "goog.positioning.ViewportClientPosition", "goog.positioning.ViewportPosition", "goog.style", "goog.ui.PopupBase"]);
goog.addDependency("/closure/goog/ui/popupbase.js", ["goog.ui.PopupBase", "goog.ui.PopupBase.EventType", "goog.ui.PopupBase.Type"], ["goog.Timer", "goog.dom", "goog.events.EventHandler", "goog.events.EventTarget", "goog.events.EventType", "goog.events.KeyCodes", "goog.fx.Transition", "goog.fx.Transition.EventType", "goog.style", "goog.userAgent"]);
goog.addDependency("/closure/goog/ui/popupcolorpicker.js", ["goog.ui.PopupColorPicker"], ["goog.dom.classes", "goog.events.EventType", "goog.positioning.AnchoredPosition", "goog.positioning.Corner", "goog.ui.ColorPicker", "goog.ui.ColorPicker.EventType", "goog.ui.Component", "goog.ui.Popup"]);
goog.addDependency("/closure/goog/ui/popupdatepicker.js", ["goog.ui.PopupDatePicker"], ["goog.events.EventType", "goog.positioning.AnchoredPosition", "goog.positioning.Corner", "goog.style", "goog.ui.Component", "goog.ui.DatePicker", "goog.ui.DatePicker.Events", "goog.ui.Popup", "goog.ui.PopupBase.EventType"]);
goog.addDependency("/closure/goog/ui/popupmenu.js", ["goog.ui.PopupMenu"], ["goog.events.EventType", "goog.positioning.AnchoredViewportPosition", "goog.positioning.Corner", "goog.positioning.MenuAnchoredPosition", "goog.positioning.ViewportClientPosition", "goog.structs", "goog.structs.Map", "goog.style", "goog.ui.Component.EventType", "goog.ui.Menu", "goog.ui.PopupBase", "goog.userAgent"]);
goog.addDependency("/closure/goog/ui/progressbar.js", ["goog.ui.ProgressBar", "goog.ui.ProgressBar.Orientation"], ["goog.dom", "goog.dom.a11y", "goog.dom.classes", "goog.events", "goog.events.EventType", "goog.ui.Component", "goog.ui.Component.EventType", "goog.ui.RangeModel", "goog.userAgent"]);
goog.addDependency("/closure/goog/ui/prompt.js", ["goog.ui.Prompt"], ["goog.Timer", "goog.dom", "goog.events", "goog.events.EventType", "goog.functions", "goog.ui.Component.Error", "goog.ui.Dialog", "goog.ui.Dialog.ButtonSet", "goog.ui.Dialog.DefaultButtonKeys", "goog.ui.Dialog.EventType", "goog.userAgent"]);
goog.addDependency("/closure/goog/ui/rangemodel.js", ["goog.ui.RangeModel"], ["goog.events.EventTarget", "goog.ui.Component.EventType"]);
goog.addDependency("/closure/goog/ui/ratings.js", ["goog.ui.Ratings", "goog.ui.Ratings.EventType"], ["goog.dom.a11y", "goog.dom.classes", "goog.events.EventType", "goog.ui.Component"]);
goog.addDependency("/closure/goog/ui/registry.js", ["goog.ui.registry"], ["goog.dom.classes"]);
goog.addDependency("/closure/goog/ui/richtextspellchecker.js", ["goog.ui.RichTextSpellChecker"], ["goog.Timer", "goog.dom", "goog.dom.NodeType", "goog.events", "goog.events.EventType", "goog.string.StringBuffer", "goog.ui.AbstractSpellChecker", "goog.ui.AbstractSpellChecker.AsyncResult"]);
goog.addDependency("/closure/goog/ui/roundedpanel.js", ["goog.ui.BaseRoundedPanel", "goog.ui.CssRoundedPanel", "goog.ui.GraphicsRoundedPanel", "goog.ui.RoundedPanel", "goog.ui.RoundedPanel.Corner"], ["goog.dom", "goog.dom.classes", "goog.graphics", "goog.graphics.SolidFill", "goog.graphics.Stroke", "goog.math.Coordinate", "goog.style", "goog.ui.Component", "goog.userAgent"]);
goog.addDependency("/closure/goog/ui/roundedtabrenderer.js", ["goog.ui.RoundedTabRenderer"], ["goog.dom", "goog.ui.Tab", "goog.ui.TabBar.Location", "goog.ui.TabRenderer", "goog.ui.registry"]);
goog.addDependency("/closure/goog/ui/scrollfloater.js", ["goog.ui.ScrollFloater", "goog.ui.ScrollFloater.EventType"], ["goog.dom", "goog.dom.classes", "goog.events.EventType", "goog.object", "goog.style", "goog.ui.Component", "goog.userAgent"]);
goog.addDependency("/closure/goog/ui/select.js", ["goog.ui.Select"], ["goog.dom.a11y", "goog.dom.a11y.Role", "goog.dom.a11y.State", "goog.events.EventType", "goog.ui.Component.EventType", "goog.ui.ControlContent", "goog.ui.MenuButton", "goog.ui.SelectionModel", "goog.ui.registry"]);
goog.addDependency("/closure/goog/ui/selectionmenubutton.js", ["goog.ui.SelectionMenuButton", "goog.ui.SelectionMenuButton.SelectionState"], ["goog.events.EventType", "goog.ui.Component.EventType", "goog.ui.Menu", "goog.ui.MenuButton", "goog.ui.MenuItem"]);
goog.addDependency("/closure/goog/ui/selectionmodel.js", ["goog.ui.SelectionModel"], ["goog.array", "goog.events.EventTarget", "goog.events.EventType"]);
goog.addDependency("/closure/goog/ui/separator.js", ["goog.ui.Separator"], ["goog.dom.a11y", "goog.ui.Component.State", "goog.ui.Control", "goog.ui.MenuSeparatorRenderer", "goog.ui.registry"]);
goog.addDependency("/closure/goog/ui/serverchart.js", ["goog.ui.ServerChart", "goog.ui.ServerChart.AxisDisplayType", "goog.ui.ServerChart.ChartType", "goog.ui.ServerChart.EncodingType", "goog.ui.ServerChart.Event", "goog.ui.ServerChart.LegendPosition", "goog.ui.ServerChart.MaximumValue", "goog.ui.ServerChart.MultiAxisAlignment", "goog.ui.ServerChart.MultiAxisType", "goog.ui.ServerChart.UriParam", "goog.ui.ServerChart.UriTooLongEvent"], ["goog.Uri", "goog.array", "goog.asserts", "goog.events.Event", 
"goog.string", "goog.ui.Component"]);
goog.addDependency("/closure/goog/ui/slider.js", ["goog.ui.Slider", "goog.ui.Slider.Orientation"], ["goog.dom", "goog.dom.a11y", "goog.dom.a11y.Role", "goog.ui.SliderBase", "goog.ui.SliderBase.Orientation"]);
goog.addDependency("/closure/goog/ui/sliderbase.js", ["goog.ui.SliderBase", "goog.ui.SliderBase.Orientation"], ["goog.Timer", "goog.dom", "goog.dom.a11y", "goog.dom.a11y.Role", "goog.dom.a11y.State", "goog.dom.classes", "goog.events", "goog.events.EventType", "goog.events.KeyCodes", "goog.events.KeyHandler", "goog.events.KeyHandler.EventType", "goog.events.MouseWheelHandler", "goog.events.MouseWheelHandler.EventType", "goog.fx.AnimationParallelQueue", "goog.fx.Dragger", "goog.fx.Dragger.EventType", 
"goog.fx.Transition.EventType", "goog.fx.dom.ResizeHeight", "goog.fx.dom.ResizeWidth", "goog.fx.dom.Slide", "goog.math", "goog.math.Coordinate", "goog.style", "goog.style.bidi", "goog.ui.Component", "goog.ui.Component.EventType", "goog.ui.RangeModel"]);
goog.addDependency("/closure/goog/ui/splitbehavior.js", ["goog.ui.SplitBehavior", "goog.ui.SplitBehavior.DefaultHandlers"], ["goog.Disposable", "goog.array", "goog.dispose", "goog.dom", "goog.dom.DomHelper", "goog.dom.classes", "goog.events", "goog.events.EventHandler", "goog.events.EventType", "goog.string", "goog.ui.ButtonSide", "goog.ui.Component", "goog.ui.Component.Error", "goog.ui.INLINE_BLOCK_CLASSNAME", "goog.ui.decorate", "goog.ui.registry"]);
goog.addDependency("/closure/goog/ui/splitpane.js", ["goog.ui.SplitPane", "goog.ui.SplitPane.Orientation"], ["goog.dom", "goog.dom.classes", "goog.events.EventType", "goog.fx.Dragger", "goog.fx.Dragger.EventType", "goog.math.Rect", "goog.math.Size", "goog.style", "goog.ui.Component", "goog.ui.Component.EventType", "goog.userAgent"]);
goog.addDependency("/closure/goog/ui/style/app/buttonrenderer.js", ["goog.ui.style.app.ButtonRenderer"], ["goog.dom.classes", "goog.ui.Button", "goog.ui.ControlContent", "goog.ui.CustomButtonRenderer", "goog.ui.INLINE_BLOCK_CLASSNAME", "goog.ui.registry"]);
goog.addDependency("/closure/goog/ui/style/app/menubuttonrenderer.js", ["goog.ui.style.app.MenuButtonRenderer"], ["goog.array", "goog.dom", "goog.dom.a11y.Role", "goog.style", "goog.ui.ControlContent", "goog.ui.Menu", "goog.ui.MenuRenderer", "goog.ui.style.app.ButtonRenderer"]);
goog.addDependency("/closure/goog/ui/style/app/primaryactionbuttonrenderer.js", ["goog.ui.style.app.PrimaryActionButtonRenderer"], ["goog.ui.Button", "goog.ui.registry", "goog.ui.style.app.ButtonRenderer"]);
goog.addDependency("/closure/goog/ui/submenu.js", ["goog.ui.SubMenu"], ["goog.Timer", "goog.dom", "goog.dom.classes", "goog.events.KeyCodes", "goog.positioning.AnchoredViewportPosition", "goog.positioning.Corner", "goog.style", "goog.ui.Component", "goog.ui.Component.EventType", "goog.ui.Component.State", "goog.ui.ControlContent", "goog.ui.Menu", "goog.ui.MenuItem", "goog.ui.SubMenuRenderer", "goog.ui.registry"]);
goog.addDependency("/closure/goog/ui/submenurenderer.js", ["goog.ui.SubMenuRenderer"], ["goog.dom", "goog.dom.a11y", "goog.dom.a11y.State", "goog.dom.classes", "goog.style", "goog.ui.Menu", "goog.ui.MenuItemRenderer"]);
goog.addDependency("/closure/goog/ui/tab.js", ["goog.ui.Tab"], ["goog.ui.Component.State", "goog.ui.Control", "goog.ui.ControlContent", "goog.ui.TabRenderer", "goog.ui.registry"]);
goog.addDependency("/closure/goog/ui/tabbar.js", ["goog.ui.TabBar", "goog.ui.TabBar.Location"], ["goog.ui.Component.EventType", "goog.ui.Container", "goog.ui.Container.Orientation", "goog.ui.Tab", "goog.ui.TabBarRenderer", "goog.ui.registry"]);
goog.addDependency("/closure/goog/ui/tabbarrenderer.js", ["goog.ui.TabBarRenderer"], ["goog.dom.a11y.Role", "goog.object", "goog.ui.ContainerRenderer"]);
goog.addDependency("/closure/goog/ui/tablesorter.js", ["goog.ui.TableSorter", "goog.ui.TableSorter.EventType"], ["goog.array", "goog.dom", "goog.dom.TagName", "goog.dom.classes", "goog.events", "goog.events.EventType", "goog.functions", "goog.ui.Component"]);
goog.addDependency("/closure/goog/ui/tabpane.js", ["goog.ui.TabPane", "goog.ui.TabPane.Events", "goog.ui.TabPane.TabLocation", "goog.ui.TabPane.TabPage", "goog.ui.TabPaneEvent"], ["goog.dom", "goog.dom.classes", "goog.events", "goog.events.Event", "goog.events.EventTarget", "goog.events.EventType", "goog.events.KeyCodes", "goog.style"]);
goog.addDependency("/closure/goog/ui/tabrenderer.js", ["goog.ui.TabRenderer"], ["goog.dom.a11y.Role", "goog.ui.Component.State", "goog.ui.ControlRenderer"]);
goog.addDependency("/closure/goog/ui/textarea.js", ["goog.ui.Textarea", "goog.ui.Textarea.EventType"], ["goog.Timer", "goog.events.EventType", "goog.events.KeyCodes", "goog.style", "goog.ui.Control", "goog.ui.TextareaRenderer", "goog.userAgent", "goog.userAgent.product"]);
goog.addDependency("/closure/goog/ui/textarearenderer.js", ["goog.ui.TextareaRenderer"], ["goog.ui.Component.State", "goog.ui.ControlRenderer"]);
goog.addDependency("/closure/goog/ui/togglebutton.js", ["goog.ui.ToggleButton"], ["goog.ui.Button", "goog.ui.Component.State", "goog.ui.ControlContent", "goog.ui.CustomButtonRenderer", "goog.ui.registry"]);
goog.addDependency("/closure/goog/ui/toolbar.js", ["goog.ui.Toolbar"], ["goog.ui.Container", "goog.ui.ToolbarRenderer"]);
goog.addDependency("/closure/goog/ui/toolbarbutton.js", ["goog.ui.ToolbarButton"], ["goog.ui.Button", "goog.ui.ControlContent", "goog.ui.ToolbarButtonRenderer", "goog.ui.registry"]);
goog.addDependency("/closure/goog/ui/toolbarbuttonrenderer.js", ["goog.ui.ToolbarButtonRenderer"], ["goog.ui.CustomButtonRenderer"]);
goog.addDependency("/closure/goog/ui/toolbarcolormenubutton.js", ["goog.ui.ToolbarColorMenuButton"], ["goog.ui.ColorMenuButton", "goog.ui.ControlContent", "goog.ui.ToolbarColorMenuButtonRenderer", "goog.ui.registry"]);
goog.addDependency("/closure/goog/ui/toolbarcolormenubuttonrenderer.js", ["goog.ui.ToolbarColorMenuButtonRenderer"], ["goog.dom.classes", "goog.ui.ColorMenuButtonRenderer", "goog.ui.ControlContent", "goog.ui.MenuButtonRenderer", "goog.ui.ToolbarMenuButtonRenderer"]);
goog.addDependency("/closure/goog/ui/toolbarmenubutton.js", ["goog.ui.ToolbarMenuButton"], ["goog.ui.ControlContent", "goog.ui.MenuButton", "goog.ui.ToolbarMenuButtonRenderer", "goog.ui.registry"]);
goog.addDependency("/closure/goog/ui/toolbarmenubuttonrenderer.js", ["goog.ui.ToolbarMenuButtonRenderer"], ["goog.ui.MenuButtonRenderer"]);
goog.addDependency("/closure/goog/ui/toolbarrenderer.js", ["goog.ui.ToolbarRenderer"], ["goog.dom.a11y.Role", "goog.ui.Container.Orientation", "goog.ui.ContainerRenderer", "goog.ui.Separator", "goog.ui.ToolbarSeparatorRenderer"]);
goog.addDependency("/closure/goog/ui/toolbarselect.js", ["goog.ui.ToolbarSelect"], ["goog.ui.ControlContent", "goog.ui.Select", "goog.ui.ToolbarMenuButtonRenderer", "goog.ui.registry"]);
goog.addDependency("/closure/goog/ui/toolbarseparator.js", ["goog.ui.ToolbarSeparator"], ["goog.ui.Separator", "goog.ui.ToolbarSeparatorRenderer", "goog.ui.registry"]);
goog.addDependency("/closure/goog/ui/toolbarseparatorrenderer.js", ["goog.ui.ToolbarSeparatorRenderer"], ["goog.dom.classes", "goog.ui.INLINE_BLOCK_CLASSNAME", "goog.ui.MenuSeparatorRenderer"]);
goog.addDependency("/closure/goog/ui/toolbartogglebutton.js", ["goog.ui.ToolbarToggleButton"], ["goog.ui.ControlContent", "goog.ui.ToggleButton", "goog.ui.ToolbarButtonRenderer", "goog.ui.registry"]);
goog.addDependency("/closure/goog/ui/tooltip.js", ["goog.ui.Tooltip", "goog.ui.Tooltip.CursorTooltipPosition", "goog.ui.Tooltip.ElementTooltipPosition", "goog.ui.Tooltip.State"], ["goog.Timer", "goog.array", "goog.dom", "goog.events", "goog.events.EventType", "goog.math.Box", "goog.math.Coordinate", "goog.positioning", "goog.positioning.AnchoredPosition", "goog.positioning.Corner", "goog.positioning.Overflow", "goog.positioning.OverflowStatus", "goog.positioning.ViewportPosition", "goog.structs.Set", 
"goog.style", "goog.ui.Popup", "goog.ui.PopupBase"]);
goog.addDependency("/closure/goog/ui/tree/basenode.js", ["goog.ui.tree.BaseNode", "goog.ui.tree.BaseNode.EventType"], ["goog.Timer", "goog.asserts", "goog.dom.a11y", "goog.events.KeyCodes", "goog.string", "goog.string.StringBuffer", "goog.style", "goog.ui.Component", "goog.userAgent"]);
goog.addDependency("/closure/goog/ui/tree/treecontrol.js", ["goog.ui.tree.TreeControl"], ["goog.debug.Logger", "goog.dom.a11y", "goog.dom.classes", "goog.events.EventType", "goog.events.FocusHandler", "goog.events.KeyHandler", "goog.events.KeyHandler.EventType", "goog.ui.tree.BaseNode", "goog.ui.tree.TreeNode", "goog.ui.tree.TypeAhead", "goog.userAgent"]);
goog.addDependency("/closure/goog/ui/tree/treenode.js", ["goog.ui.tree.TreeNode"], ["goog.ui.tree.BaseNode"]);
goog.addDependency("/closure/goog/ui/tree/typeahead.js", ["goog.ui.tree.TypeAhead", "goog.ui.tree.TypeAhead.Offset"], ["goog.array", "goog.events.KeyCodes", "goog.string", "goog.structs.Trie"]);
goog.addDependency("/closure/goog/ui/tristatemenuitem.js", ["goog.ui.TriStateMenuItem", "goog.ui.TriStateMenuItem.State"], ["goog.dom.classes", "goog.ui.Component.EventType", "goog.ui.Component.State", "goog.ui.ControlContent", "goog.ui.MenuItem", "goog.ui.TriStateMenuItemRenderer", "goog.ui.registry"]);
goog.addDependency("/closure/goog/ui/tristatemenuitemrenderer.js", ["goog.ui.TriStateMenuItemRenderer"], ["goog.dom.classes", "goog.ui.MenuItemRenderer"]);
goog.addDependency("/closure/goog/ui/twothumbslider.js", ["goog.ui.TwoThumbSlider"], ["goog.dom", "goog.dom.a11y", "goog.dom.a11y.Role", "goog.ui.SliderBase"]);
goog.addDependency("/closure/goog/ui/zippy.js", ["goog.ui.Zippy", "goog.ui.Zippy.Events", "goog.ui.ZippyEvent"], ["goog.dom", "goog.dom.a11y", "goog.dom.classes", "goog.events", "goog.events.Event", "goog.events.EventHandler", "goog.events.EventTarget", "goog.events.EventType", "goog.events.KeyCodes", "goog.style"]);
goog.addDependency("/closure/goog/uri/uri.js", ["goog.Uri", "goog.Uri.QueryData"], ["goog.array", "goog.string", "goog.structs", "goog.structs.Map", "goog.uri.utils", "goog.uri.utils.ComponentIndex"]);
goog.addDependency("/closure/goog/uri/utils.js", ["goog.uri.utils", "goog.uri.utils.ComponentIndex", "goog.uri.utils.QueryArray", "goog.uri.utils.QueryValue", "goog.uri.utils.StandardQueryParam"], ["goog.asserts", "goog.string", "goog.userAgent"]);
goog.addDependency("/closure/goog/useragent/adobereader.js", ["goog.userAgent.adobeReader"], ["goog.string", "goog.userAgent"]);
goog.addDependency("/closure/goog/useragent/flash.js", ["goog.userAgent.flash"], ["goog.string"]);
goog.addDependency("/closure/goog/useragent/iphoto.js", ["goog.userAgent.iphoto"], ["goog.string", "goog.userAgent"]);
goog.addDependency("/closure/goog/useragent/jscript.js", ["goog.userAgent.jscript"], ["goog.string"]);
goog.addDependency("/closure/goog/useragent/picasa.js", ["goog.userAgent.picasa"], ["goog.string", "goog.userAgent"]);
goog.addDependency("/closure/goog/useragent/platform.js", ["goog.userAgent.platform"], ["goog.userAgent"]);
goog.addDependency("/closure/goog/useragent/product.js", ["goog.userAgent.product"], ["goog.userAgent"]);
goog.addDependency("/closure/goog/useragent/product_isversion.js", ["goog.userAgent.product.isVersion"], ["goog.userAgent.product"]);
goog.addDependency("/closure/goog/useragent/useragent.js", ["goog.userAgent"], ["goog.string"]);
goog.addDependency("/closure/goog/vec/float32array.js", ["goog.vec.Float32Array"], []);
goog.addDependency("/closure/goog/vec/float64array.js", ["goog.vec.Float64Array"], []);
goog.addDependency("/closure/goog/vec/mat3.js", ["goog.vec.Mat3"], ["goog.vec", "goog.vec.Vec3"]);
goog.addDependency("/closure/goog/vec/mat4.js", ["goog.vec.Mat4"], ["goog.vec", "goog.vec.Vec3", "goog.vec.Vec4"]);
goog.addDependency("/closure/goog/vec/matrix3.js", ["goog.vec.Matrix3"], ["goog.vec"]);
goog.addDependency("/closure/goog/vec/matrix4.js", ["goog.vec.Matrix4"], ["goog.vec", "goog.vec.Vec3", "goog.vec.Vec4"]);
goog.addDependency("/closure/goog/vec/quaternion.js", ["goog.vec.Quaternion"], ["goog.vec", "goog.vec.Vec3", "goog.vec.Vec4"]);
goog.addDependency("/closure/goog/vec/ray.js", ["goog.vec.Ray"], ["goog.vec.Vec3"]);
goog.addDependency("/closure/goog/vec/vec.js", ["goog.vec"], ["goog.vec.Float32Array", "goog.vec.Float64Array"]);
goog.addDependency("/closure/goog/vec/vec2.js", ["goog.vec.Vec2"], ["goog.vec"]);
goog.addDependency("/closure/goog/vec/vec3.js", ["goog.vec.Vec3"], ["goog.vec"]);
goog.addDependency("/closure/goog/vec/vec4.js", ["goog.vec.Vec4"], ["goog.vec"]);
goog.addDependency("/closure/goog/webgl/webgl.js", ["goog.webgl"], []);
goog.addDependency("/closure/goog/window/window.js", ["goog.window"], ["goog.string", "goog.userAgent"]);
goog.addDependency("/soy/soyutils.js", [], []);
goog.addDependency("/soy/soyutils_usegoog.js", ["soy", "soy.StringBuilder", "soy.esc", "soydata", "soydata.SanitizedHtml", "soydata.SanitizedHtmlAttribute", "soydata.SanitizedJsStrChars", "soydata.SanitizedUri"], ["goog.asserts", "goog.dom.DomHelper", "goog.format", "goog.i18n.BidiFormatter", "goog.i18n.bidi", "goog.soy", "goog.string", "goog.string.StringBuffer"]);
goog.addDependency("/third_party/closure/goog/base.js", [], []);
goog.addDependency("/third_party/closure/goog/caja/string/html/htmlparser.js", ["goog.string.html.HtmlParser", "goog.string.html.HtmlParser.EFlags", "goog.string.html.HtmlParser.Elements", "goog.string.html.HtmlParser.Entities", "goog.string.html.HtmlSaxHandler"], []);
goog.addDependency("/third_party/closure/goog/caja/string/html/htmlsanitizer.js", ["goog.string.html.HtmlSanitizer", "goog.string.html.HtmlSanitizer.AttributeType", "goog.string.html.HtmlSanitizer.Attributes", "goog.string.html.htmlSanitize"], ["goog.string.StringBuffer", "goog.string.html.HtmlParser", "goog.string.html.HtmlParser.EFlags", "goog.string.html.HtmlParser.Elements", "goog.string.html.HtmlSaxHandler"]);
goog.addDependency("/third_party/closure/goog/dojo/dom/query.js", ["goog.dom.query"], ["goog.array", "goog.dom", "goog.functions", "goog.string", "goog.userAgent"]);
goog.addDependency("/third_party/closure/goog/dojo/dom/query_test.js", [], ["goog.dom", "goog.dom.query", "goog.testing.asserts"]);
goog.addDependency("/third_party/closure/goog/jpeg_encoder/jpeg_encoder_basic.js", ["goog.crypt.JpegEncoder"], ["goog.crypt.base64"]);
goog.addDependency("/third_party/closure/goog/loremipsum/text/loremipsum.js", ["goog.text.LoremIpsum"], ["goog.array", "goog.math", "goog.string", "goog.structs.Map", "goog.structs.Set"]);
goog.addDependency("/third_party/closure/goog/mochikit/async/deferred.js", ["goog.async.Deferred", "goog.async.Deferred.AlreadyCalledError", "goog.async.Deferred.CancelledError"], ["goog.array", "goog.asserts", "goog.debug.Error"]);
goog.addDependency("/third_party/closure/goog/mochikit/async/deferredlist.js", ["goog.async.DeferredList"], ["goog.array", "goog.async.Deferred"]);
goog.addDependency("/third_party/closure/goog/osapi/osapi.js", ["goog.osapi"], []);
goog.addDependency("/third_party/closure/goog/silverlight/clipboardbutton.js", ["goog.silverlight.ClipboardButton", "goog.silverlight.ClipboardButtonType", "goog.silverlight.ClipboardEvent", "goog.silverlight.CopyButton", "goog.silverlight.PasteButton", "goog.silverlight.PasteButtonEvent"], ["goog.asserts", "goog.events.Event", "goog.math.Size", "goog.silverlight", "goog.ui.Component"]);
goog.addDependency("/third_party/closure/goog/silverlight/silverlight.js", ["goog.silverlight"], []);
goog.addDependency("/third_party/closure/goog/silverlight/supporteduseragent.js", ["goog.silverlight.supportedUserAgent"], []);
goog.addDependency("src/annotation.js", ["annotorious.Annotation"], ["annotorious.shape"]);
goog.addDependency("src/annotorious.js", [], ["goog.array", "goog.dom", "goog.dom.query", "annotorious.dom", "annotorious.events", "annotorious.mediatypes.Module", "annotorious.mediatypes.image.ImageModule", "annotorious.mediatypes.openlayers.OpenLayersModule", "annotorious.mediatypes.openseadragon.OpenSeadragonModule", "annotorious.mediatypes.image.Viewer"]);
goog.addDependency("src/api.js", [], []);
goog.addDependency("src/dom.js", ["annotorious.dom"], ["goog.fx.Dragger"]);
goog.addDependency("src/editor.js", ["annotorious.Editor"], ["goog.dom", "goog.dom.query", "goog.soy", "goog.string.html.htmlSanitize", "goog.style", "goog.ui.Textarea", "annotorious.templates"]);
goog.addDependency("src/events.js", ["annotorious.events"], ["goog.array", "goog.events"]);
goog.addDependency("src/events.ui.js", ["annotorious.events.ui"], ["goog.dom", "goog.dom.classes", "goog.events.EventType"]);
goog.addDependency("src/hint.js", ["annotorious.Hint"], ["goog.dom.query", "goog.events", "goog.soy", "goog.style"]);
goog.addDependency("src/mediatypes/annotator.js", ["annotorious.mediatypes.Annotator"], []);
goog.addDependency("src/mediatypes/image/image.annotator.js", ["annotorious.mediatypes.image.ImageAnnotator"], ["goog.dom", "goog.dom.classes", "goog.dom.query", "goog.events", "goog.math", "goog.soy", "goog.style", "annotorious.Editor", "annotorious.Hint", "annotorious.Popup", "annotorious.mediatypes.Annotator", "annotorious.mediatypes.image.Viewer", "annotorious.plugins.selection.RectDragSelector", "annotorious.templates.image"]);
goog.addDependency("src/mediatypes/image/image.module.js", ["annotorious.mediatypes.image.ImageModule"], ["annotorious.mediatypes.Module", "annotorious.mediatypes.image.ImageAnnotator"]);
goog.addDependency("src/mediatypes/image/image.viewer.js", ["annotorious.mediatypes.image.Viewer"], []);
goog.addDependency("src/mediatypes/module.js", ["annotorious.mediatypes.Module"], ["goog.array", "goog.dom", "goog.events", "goog.structs.Map", "annotorious.Annotation"]);
goog.addDependency("src/mediatypes/openlayers/openlayers.annotator.js", ["annotorious.mediatypes.openlayers.OpenLayersAnnotator"], ["annotorious.mediatypes.Annotator", "annotorious.templates.openlayers", "annotorious.mediatypes.openlayers.Viewer"]);
goog.addDependency("src/mediatypes/openlayers/openlayers.module.js", ["annotorious.mediatypes.openlayers.OpenLayersModule"], ["annotorious.mediatypes.Module", "annotorious.mediatypes.openlayers.OpenLayersAnnotator"]);
goog.addDependency("src/mediatypes/openlayers/openlayers.viewer.js", ["annotorious.mediatypes.openlayers.Viewer"], ["goog.events.MouseWheelHandler"]);
goog.addDependency("src/mediatypes/openseadragon/openseadragon.annotator.js", ["annotorious.mediatypes.openseadragon.OpenSeadragonAnnotator"], ["annotorious.mediatypes.Annotator", "annotorious.mediatypes.openseadragon.Viewer"]);
goog.addDependency("src/mediatypes/openseadragon/openseadragon.module.js", ["annotorious.mediatypes.openseadragon.OpenSeadragonModule"], ["annotorious.mediatypes.Module", "annotorious.mediatypes.openseadragon.OpenSeadragonAnnotator"]);
goog.addDependency("src/mediatypes/openseadragon/openseadragon.viewer.js", ["annotorious.mediatypes.openseadragon.Viewer"], ["goog.events.MouseWheelHandler"]);
goog.addDependency("src/okfn/okfn_image_plugin.js", ["annotorious.okfn.ImagePlugin"], ["goog.array", "goog.object", "goog.soy", "goog.dom", "goog.dom.classes", "goog.dom.query", "goog.events", "goog.math", "goog.style"]);
goog.addDependency("src/okfn/okfn_popup.js", ["annotorious.okfn.Popup"], ["goog.array", "goog.style", "goog.dom.classes"]);
goog.addDependency("src/popup.js", ["annotorious.Popup"], ["goog.dom", "goog.dom.classes", "goog.dom.query", "goog.style"]);
goog.addDependency("src/selection/rect_drag_selector.js", ["annotorious.plugins.selection.RectDragSelector"], ["goog.events", "annotorious.events.ui"]);
goog.addDependency("src/shape/point.js", ["annotorious.shape.geom.Point"], []);
goog.addDependency("src/shape/polygon.js", ["annotorious.shape.geom.Polygon"], ["annotorious.shape.geom.Point"]);
goog.addDependency("src/shape/rectangle.js", ["annotorious.shape.geom.Rectangle"], []);
goog.addDependency("src/shape/shape.js", ["annotorious.shape"], ["annotorious.shape.geom.Polygon", "annotorious.shape.geom.Rectangle"]);
goog.addDependency("templates/core_elements.soy", ["annotorious.templates"], ["soy"]);
goog.addDependency("templates/image_elements.soy", ["annotorious.templates.image"], ["soy"]);
goog.addDependency("templates/openlayers_elements.soy", ["annotorious.templates.openlayers"], ["soy"]);
goog.provide("goog.debug.Error");
goog.debug.Error = function(opt_msg) {
  if(Error.captureStackTrace) {
    Error.captureStackTrace(this, goog.debug.Error)
  }else {
    this.stack = (new Error).stack || ""
  }
  if(opt_msg) {
    this.message = String(opt_msg)
  }
};
goog.inherits(goog.debug.Error, Error);
goog.debug.Error.prototype.name = "CustomError";
goog.provide("goog.string");
goog.provide("goog.string.Unicode");
goog.string.Unicode = {NBSP:"\u00a0"};
goog.string.startsWith = function(str, prefix) {
  return str.lastIndexOf(prefix, 0) == 0
};
goog.string.endsWith = function(str, suffix) {
  var l = str.length - suffix.length;
  return l >= 0 && str.indexOf(suffix, l) == l
};
goog.string.caseInsensitiveStartsWith = function(str, prefix) {
  return goog.string.caseInsensitiveCompare(prefix, str.substr(0, prefix.length)) == 0
};
goog.string.caseInsensitiveEndsWith = function(str, suffix) {
  return goog.string.caseInsensitiveCompare(suffix, str.substr(str.length - suffix.length, suffix.length)) == 0
};
goog.string.subs = function(str, var_args) {
  for(var i = 1;i < arguments.length;i++) {
    var replacement = String(arguments[i]).replace(/\$/g, "$$$$");
    str = str.replace(/\%s/, replacement)
  }
  return str
};
goog.string.collapseWhitespace = function(str) {
  return str.replace(/[\s\xa0]+/g, " ").replace(/^\s+|\s+$/g, "")
};
goog.string.isEmpty = function(str) {
  return/^[\s\xa0]*$/.test(str)
};
goog.string.isEmptySafe = function(str) {
  return goog.string.isEmpty(goog.string.makeSafe(str))
};
goog.string.isBreakingWhitespace = function(str) {
  return!/[^\t\n\r ]/.test(str)
};
goog.string.isAlpha = function(str) {
  return!/[^a-zA-Z]/.test(str)
};
goog.string.isNumeric = function(str) {
  return!/[^0-9]/.test(str)
};
goog.string.isAlphaNumeric = function(str) {
  return!/[^a-zA-Z0-9]/.test(str)
};
goog.string.isSpace = function(ch) {
  return ch == " "
};
goog.string.isUnicodeChar = function(ch) {
  return ch.length == 1 && ch >= " " && ch <= "~" || ch >= "\u0080" && ch <= "\ufffd"
};
goog.string.stripNewlines = function(str) {
  return str.replace(/(\r\n|\r|\n)+/g, " ")
};
goog.string.canonicalizeNewlines = function(str) {
  return str.replace(/(\r\n|\r|\n)/g, "\n")
};
goog.string.normalizeWhitespace = function(str) {
  return str.replace(/\xa0|\s/g, " ")
};
goog.string.normalizeSpaces = function(str) {
  return str.replace(/\xa0|[ \t]+/g, " ")
};
goog.string.collapseBreakingSpaces = function(str) {
  return str.replace(/[\t\r\n ]+/g, " ").replace(/^[\t\r\n ]+|[\t\r\n ]+$/g, "")
};
goog.string.trim = function(str) {
  return str.replace(/^[\s\xa0]+|[\s\xa0]+$/g, "")
};
goog.string.trimLeft = function(str) {
  return str.replace(/^[\s\xa0]+/, "")
};
goog.string.trimRight = function(str) {
  return str.replace(/[\s\xa0]+$/, "")
};
goog.string.caseInsensitiveCompare = function(str1, str2) {
  var test1 = String(str1).toLowerCase();
  var test2 = String(str2).toLowerCase();
  if(test1 < test2) {
    return-1
  }else {
    if(test1 == test2) {
      return 0
    }else {
      return 1
    }
  }
};
goog.string.numerateCompareRegExp_ = /(\.\d+)|(\d+)|(\D+)/g;
goog.string.numerateCompare = function(str1, str2) {
  if(str1 == str2) {
    return 0
  }
  if(!str1) {
    return-1
  }
  if(!str2) {
    return 1
  }
  var tokens1 = str1.toLowerCase().match(goog.string.numerateCompareRegExp_);
  var tokens2 = str2.toLowerCase().match(goog.string.numerateCompareRegExp_);
  var count = Math.min(tokens1.length, tokens2.length);
  for(var i = 0;i < count;i++) {
    var a = tokens1[i];
    var b = tokens2[i];
    if(a != b) {
      var num1 = parseInt(a, 10);
      if(!isNaN(num1)) {
        var num2 = parseInt(b, 10);
        if(!isNaN(num2) && num1 - num2) {
          return num1 - num2
        }
      }
      return a < b ? -1 : 1
    }
  }
  if(tokens1.length != tokens2.length) {
    return tokens1.length - tokens2.length
  }
  return str1 < str2 ? -1 : 1
};
goog.string.urlEncode = function(str) {
  return encodeURIComponent(String(str))
};
goog.string.urlDecode = function(str) {
  return decodeURIComponent(str.replace(/\+/g, " "))
};
goog.string.newLineToBr = function(str, opt_xml) {
  return str.replace(/(\r\n|\r|\n)/g, opt_xml ? "<br />" : "<br>")
};
goog.string.htmlEscape = function(str, opt_isLikelyToContainHtmlChars) {
  if(opt_isLikelyToContainHtmlChars) {
    return str.replace(goog.string.amperRe_, "&amp;").replace(goog.string.ltRe_, "&lt;").replace(goog.string.gtRe_, "&gt;").replace(goog.string.quotRe_, "&quot;")
  }else {
    if(!goog.string.allRe_.test(str)) {
      return str
    }
    if(str.indexOf("&") != -1) {
      str = str.replace(goog.string.amperRe_, "&amp;")
    }
    if(str.indexOf("<") != -1) {
      str = str.replace(goog.string.ltRe_, "&lt;")
    }
    if(str.indexOf(">") != -1) {
      str = str.replace(goog.string.gtRe_, "&gt;")
    }
    if(str.indexOf('"') != -1) {
      str = str.replace(goog.string.quotRe_, "&quot;")
    }
    return str
  }
};
goog.string.amperRe_ = /&/g;
goog.string.ltRe_ = /</g;
goog.string.gtRe_ = />/g;
goog.string.quotRe_ = /\"/g;
goog.string.allRe_ = /[&<>\"]/;
goog.string.unescapeEntities = function(str) {
  if(goog.string.contains(str, "&")) {
    if("document" in goog.global) {
      return goog.string.unescapeEntitiesUsingDom_(str)
    }else {
      return goog.string.unescapePureXmlEntities_(str)
    }
  }
  return str
};
goog.string.unescapeEntitiesUsingDom_ = function(str) {
  var seen = {"&amp;":"&", "&lt;":"<", "&gt;":">", "&quot;":'"'};
  var div = document.createElement("div");
  return str.replace(goog.string.HTML_ENTITY_PATTERN_, function(s, entity) {
    var value = seen[s];
    if(value) {
      return value
    }
    if(entity.charAt(0) == "#") {
      var n = Number("0" + entity.substr(1));
      if(!isNaN(n)) {
        value = String.fromCharCode(n)
      }
    }
    if(!value) {
      div.innerHTML = s + " ";
      value = div.firstChild.nodeValue.slice(0, -1)
    }
    return seen[s] = value
  })
};
goog.string.unescapePureXmlEntities_ = function(str) {
  return str.replace(/&([^;]+);/g, function(s, entity) {
    switch(entity) {
      case "amp":
        return"&";
      case "lt":
        return"<";
      case "gt":
        return">";
      case "quot":
        return'"';
      default:
        if(entity.charAt(0) == "#") {
          var n = Number("0" + entity.substr(1));
          if(!isNaN(n)) {
            return String.fromCharCode(n)
          }
        }
        return s
    }
  })
};
goog.string.HTML_ENTITY_PATTERN_ = /&([^;\s<&]+);?/g;
goog.string.whitespaceEscape = function(str, opt_xml) {
  return goog.string.newLineToBr(str.replace(/  /g, " &#160;"), opt_xml)
};
goog.string.stripQuotes = function(str, quoteChars) {
  var length = quoteChars.length;
  for(var i = 0;i < length;i++) {
    var quoteChar = length == 1 ? quoteChars : quoteChars.charAt(i);
    if(str.charAt(0) == quoteChar && str.charAt(str.length - 1) == quoteChar) {
      return str.substring(1, str.length - 1)
    }
  }
  return str
};
goog.string.truncate = function(str, chars, opt_protectEscapedCharacters) {
  if(opt_protectEscapedCharacters) {
    str = goog.string.unescapeEntities(str)
  }
  if(str.length > chars) {
    str = str.substring(0, chars - 3) + "..."
  }
  if(opt_protectEscapedCharacters) {
    str = goog.string.htmlEscape(str)
  }
  return str
};
goog.string.truncateMiddle = function(str, chars, opt_protectEscapedCharacters, opt_trailingChars) {
  if(opt_protectEscapedCharacters) {
    str = goog.string.unescapeEntities(str)
  }
  if(opt_trailingChars && str.length > chars) {
    if(opt_trailingChars > chars) {
      opt_trailingChars = chars
    }
    var endPoint = str.length - opt_trailingChars;
    var startPoint = chars - opt_trailingChars;
    str = str.substring(0, startPoint) + "..." + str.substring(endPoint)
  }else {
    if(str.length > chars) {
      var half = Math.floor(chars / 2);
      var endPos = str.length - half;
      half += chars % 2;
      str = str.substring(0, half) + "..." + str.substring(endPos)
    }
  }
  if(opt_protectEscapedCharacters) {
    str = goog.string.htmlEscape(str)
  }
  return str
};
goog.string.specialEscapeChars_ = {"\x00":"\\0", "\b":"\\b", "\f":"\\f", "\n":"\\n", "\r":"\\r", "\t":"\\t", "\x0B":"\\x0B", '"':'\\"', "\\":"\\\\"};
goog.string.jsEscapeCache_ = {"'":"\\'"};
goog.string.quote = function(s) {
  s = String(s);
  if(s.quote) {
    return s.quote()
  }else {
    var sb = ['"'];
    for(var i = 0;i < s.length;i++) {
      var ch = s.charAt(i);
      var cc = ch.charCodeAt(0);
      sb[i + 1] = goog.string.specialEscapeChars_[ch] || (cc > 31 && cc < 127 ? ch : goog.string.escapeChar(ch))
    }
    sb.push('"');
    return sb.join("")
  }
};
goog.string.escapeString = function(str) {
  var sb = [];
  for(var i = 0;i < str.length;i++) {
    sb[i] = goog.string.escapeChar(str.charAt(i))
  }
  return sb.join("")
};
goog.string.escapeChar = function(c) {
  if(c in goog.string.jsEscapeCache_) {
    return goog.string.jsEscapeCache_[c]
  }
  if(c in goog.string.specialEscapeChars_) {
    return goog.string.jsEscapeCache_[c] = goog.string.specialEscapeChars_[c]
  }
  var rv = c;
  var cc = c.charCodeAt(0);
  if(cc > 31 && cc < 127) {
    rv = c
  }else {
    if(cc < 256) {
      rv = "\\x";
      if(cc < 16 || cc > 256) {
        rv += "0"
      }
    }else {
      rv = "\\u";
      if(cc < 4096) {
        rv += "0"
      }
    }
    rv += cc.toString(16).toUpperCase()
  }
  return goog.string.jsEscapeCache_[c] = rv
};
goog.string.toMap = function(s) {
  var rv = {};
  for(var i = 0;i < s.length;i++) {
    rv[s.charAt(i)] = true
  }
  return rv
};
goog.string.contains = function(s, ss) {
  return s.indexOf(ss) != -1
};
goog.string.countOf = function(s, ss) {
  return s && ss ? s.split(ss).length - 1 : 0
};
goog.string.removeAt = function(s, index, stringLength) {
  var resultStr = s;
  if(index >= 0 && index < s.length && stringLength > 0) {
    resultStr = s.substr(0, index) + s.substr(index + stringLength, s.length - index - stringLength)
  }
  return resultStr
};
goog.string.remove = function(s, ss) {
  var re = new RegExp(goog.string.regExpEscape(ss), "");
  return s.replace(re, "")
};
goog.string.removeAll = function(s, ss) {
  var re = new RegExp(goog.string.regExpEscape(ss), "g");
  return s.replace(re, "")
};
goog.string.regExpEscape = function(s) {
  return String(s).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, "\\$1").replace(/\x08/g, "\\x08")
};
goog.string.repeat = function(string, length) {
  return(new Array(length + 1)).join(string)
};
goog.string.padNumber = function(num, length, opt_precision) {
  var s = goog.isDef(opt_precision) ? num.toFixed(opt_precision) : String(num);
  var index = s.indexOf(".");
  if(index == -1) {
    index = s.length
  }
  return goog.string.repeat("0", Math.max(0, length - index)) + s
};
goog.string.makeSafe = function(obj) {
  return obj == null ? "" : String(obj)
};
goog.string.buildString = function(var_args) {
  return Array.prototype.join.call(arguments, "")
};
goog.string.getRandomString = function() {
  var x = 2147483648;
  return Math.floor(Math.random() * x).toString(36) + Math.abs(Math.floor(Math.random() * x) ^ goog.now()).toString(36)
};
goog.string.compareVersions = function(version1, version2) {
  var order = 0;
  var v1Subs = goog.string.trim(String(version1)).split(".");
  var v2Subs = goog.string.trim(String(version2)).split(".");
  var subCount = Math.max(v1Subs.length, v2Subs.length);
  for(var subIdx = 0;order == 0 && subIdx < subCount;subIdx++) {
    var v1Sub = v1Subs[subIdx] || "";
    var v2Sub = v2Subs[subIdx] || "";
    var v1CompParser = new RegExp("(\\d*)(\\D*)", "g");
    var v2CompParser = new RegExp("(\\d*)(\\D*)", "g");
    do {
      var v1Comp = v1CompParser.exec(v1Sub) || ["", "", ""];
      var v2Comp = v2CompParser.exec(v2Sub) || ["", "", ""];
      if(v1Comp[0].length == 0 && v2Comp[0].length == 0) {
        break
      }
      var v1CompNum = v1Comp[1].length == 0 ? 0 : parseInt(v1Comp[1], 10);
      var v2CompNum = v2Comp[1].length == 0 ? 0 : parseInt(v2Comp[1], 10);
      order = goog.string.compareElements_(v1CompNum, v2CompNum) || goog.string.compareElements_(v1Comp[2].length == 0, v2Comp[2].length == 0) || goog.string.compareElements_(v1Comp[2], v2Comp[2])
    }while(order == 0)
  }
  return order
};
goog.string.compareElements_ = function(left, right) {
  if(left < right) {
    return-1
  }else {
    if(left > right) {
      return 1
    }
  }
  return 0
};
goog.string.HASHCODE_MAX_ = 4294967296;
goog.string.hashCode = function(str) {
  var result = 0;
  for(var i = 0;i < str.length;++i) {
    result = 31 * result + str.charCodeAt(i);
    result %= goog.string.HASHCODE_MAX_
  }
  return result
};
goog.string.uniqueStringCounter_ = Math.random() * 2147483648 | 0;
goog.string.createUniqueString = function() {
  return"goog_" + goog.string.uniqueStringCounter_++
};
goog.string.toNumber = function(str) {
  var num = Number(str);
  if(num == 0 && goog.string.isEmpty(str)) {
    return NaN
  }
  return num
};
goog.string.toCamelCase = function(str) {
  return String(str).replace(/\-([a-z])/g, function(all, match) {
    return match.toUpperCase()
  })
};
goog.string.toSelectorCase = function(str) {
  return String(str).replace(/([A-Z])/g, "-$1").toLowerCase()
};
goog.string.toTitleCase = function(str, opt_delimiters) {
  var delimiters = goog.isString(opt_delimiters) ? goog.string.regExpEscape(opt_delimiters) : "\\s";
  delimiters = delimiters ? "|[" + delimiters + "]+" : "";
  var regexp = new RegExp("(^" + delimiters + ")([a-z])", "g");
  return str.replace(regexp, function(all, p1, p2) {
    return p1 + p2.toUpperCase()
  })
};
goog.string.parseInt = function(value) {
  if(isFinite(value)) {
    value = String(value)
  }
  if(goog.isString(value)) {
    return/^\s*-?0x/i.test(value) ? parseInt(value, 16) : parseInt(value, 10)
  }
  return NaN
};
goog.provide("goog.asserts");
goog.provide("goog.asserts.AssertionError");
goog.require("goog.debug.Error");
goog.require("goog.string");
goog.asserts.ENABLE_ASSERTS = goog.DEBUG;
goog.asserts.AssertionError = function(messagePattern, messageArgs) {
  messageArgs.unshift(messagePattern);
  goog.debug.Error.call(this, goog.string.subs.apply(null, messageArgs));
  messageArgs.shift();
  this.messagePattern = messagePattern
};
goog.inherits(goog.asserts.AssertionError, goog.debug.Error);
goog.asserts.AssertionError.prototype.name = "AssertionError";
goog.asserts.doAssertFailure_ = function(defaultMessage, defaultArgs, givenMessage, givenArgs) {
  var message = "Assertion failed";
  if(givenMessage) {
    message += ": " + givenMessage;
    var args = givenArgs
  }else {
    if(defaultMessage) {
      message += ": " + defaultMessage;
      args = defaultArgs
    }
  }
  throw new goog.asserts.AssertionError("" + message, args || []);
};
goog.asserts.assert = function(condition, opt_message, var_args) {
  if(goog.asserts.ENABLE_ASSERTS && !condition) {
    goog.asserts.doAssertFailure_("", null, opt_message, Array.prototype.slice.call(arguments, 2))
  }
  return condition
};
goog.asserts.fail = function(opt_message, var_args) {
  if(goog.asserts.ENABLE_ASSERTS) {
    throw new goog.asserts.AssertionError("Failure" + (opt_message ? ": " + opt_message : ""), Array.prototype.slice.call(arguments, 1));
  }
};
goog.asserts.assertNumber = function(value, opt_message, var_args) {
  if(goog.asserts.ENABLE_ASSERTS && !goog.isNumber(value)) {
    goog.asserts.doAssertFailure_("Expected number but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2))
  }
  return value
};
goog.asserts.assertString = function(value, opt_message, var_args) {
  if(goog.asserts.ENABLE_ASSERTS && !goog.isString(value)) {
    goog.asserts.doAssertFailure_("Expected string but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2))
  }
  return value
};
goog.asserts.assertFunction = function(value, opt_message, var_args) {
  if(goog.asserts.ENABLE_ASSERTS && !goog.isFunction(value)) {
    goog.asserts.doAssertFailure_("Expected function but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2))
  }
  return value
};
goog.asserts.assertObject = function(value, opt_message, var_args) {
  if(goog.asserts.ENABLE_ASSERTS && !goog.isObject(value)) {
    goog.asserts.doAssertFailure_("Expected object but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2))
  }
  return value
};
goog.asserts.assertArray = function(value, opt_message, var_args) {
  if(goog.asserts.ENABLE_ASSERTS && !goog.isArray(value)) {
    goog.asserts.doAssertFailure_("Expected array but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2))
  }
  return value
};
goog.asserts.assertBoolean = function(value, opt_message, var_args) {
  if(goog.asserts.ENABLE_ASSERTS && !goog.isBoolean(value)) {
    goog.asserts.doAssertFailure_("Expected boolean but got %s: %s.", [goog.typeOf(value), value], opt_message, Array.prototype.slice.call(arguments, 2))
  }
  return value
};
goog.asserts.assertInstanceof = function(value, type, opt_message, var_args) {
  if(goog.asserts.ENABLE_ASSERTS && !(value instanceof type)) {
    goog.asserts.doAssertFailure_("instanceof check failed.", null, opt_message, Array.prototype.slice.call(arguments, 3))
  }
  return value
};
goog.provide("goog.array");
goog.provide("goog.array.ArrayLike");
goog.require("goog.asserts");
goog.NATIVE_ARRAY_PROTOTYPES = true;
goog.array.ArrayLike;
goog.array.peek = function(array) {
  return array[array.length - 1]
};
goog.array.ARRAY_PROTOTYPE_ = Array.prototype;
goog.array.indexOf = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.indexOf ? function(arr, obj, opt_fromIndex) {
  goog.asserts.assert(arr.length != null);
  return goog.array.ARRAY_PROTOTYPE_.indexOf.call(arr, obj, opt_fromIndex)
} : function(arr, obj, opt_fromIndex) {
  var fromIndex = opt_fromIndex == null ? 0 : opt_fromIndex < 0 ? Math.max(0, arr.length + opt_fromIndex) : opt_fromIndex;
  if(goog.isString(arr)) {
    if(!goog.isString(obj) || obj.length != 1) {
      return-1
    }
    return arr.indexOf(obj, fromIndex)
  }
  for(var i = fromIndex;i < arr.length;i++) {
    if(i in arr && arr[i] === obj) {
      return i
    }
  }
  return-1
};
goog.array.lastIndexOf = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.lastIndexOf ? function(arr, obj, opt_fromIndex) {
  goog.asserts.assert(arr.length != null);
  var fromIndex = opt_fromIndex == null ? arr.length - 1 : opt_fromIndex;
  return goog.array.ARRAY_PROTOTYPE_.lastIndexOf.call(arr, obj, fromIndex)
} : function(arr, obj, opt_fromIndex) {
  var fromIndex = opt_fromIndex == null ? arr.length - 1 : opt_fromIndex;
  if(fromIndex < 0) {
    fromIndex = Math.max(0, arr.length + fromIndex)
  }
  if(goog.isString(arr)) {
    if(!goog.isString(obj) || obj.length != 1) {
      return-1
    }
    return arr.lastIndexOf(obj, fromIndex)
  }
  for(var i = fromIndex;i >= 0;i--) {
    if(i in arr && arr[i] === obj) {
      return i
    }
  }
  return-1
};
goog.array.forEach = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.forEach ? function(arr, f, opt_obj) {
  goog.asserts.assert(arr.length != null);
  goog.array.ARRAY_PROTOTYPE_.forEach.call(arr, f, opt_obj)
} : function(arr, f, opt_obj) {
  var l = arr.length;
  var arr2 = goog.isString(arr) ? arr.split("") : arr;
  for(var i = 0;i < l;i++) {
    if(i in arr2) {
      f.call(opt_obj, arr2[i], i, arr)
    }
  }
};
goog.array.forEachRight = function(arr, f, opt_obj) {
  var l = arr.length;
  var arr2 = goog.isString(arr) ? arr.split("") : arr;
  for(var i = l - 1;i >= 0;--i) {
    if(i in arr2) {
      f.call(opt_obj, arr2[i], i, arr)
    }
  }
};
goog.array.filter = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.filter ? function(arr, f, opt_obj) {
  goog.asserts.assert(arr.length != null);
  return goog.array.ARRAY_PROTOTYPE_.filter.call(arr, f, opt_obj)
} : function(arr, f, opt_obj) {
  var l = arr.length;
  var res = [];
  var resLength = 0;
  var arr2 = goog.isString(arr) ? arr.split("") : arr;
  for(var i = 0;i < l;i++) {
    if(i in arr2) {
      var val = arr2[i];
      if(f.call(opt_obj, val, i, arr)) {
        res[resLength++] = val
      }
    }
  }
  return res
};
goog.array.map = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.map ? function(arr, f, opt_obj) {
  goog.asserts.assert(arr.length != null);
  return goog.array.ARRAY_PROTOTYPE_.map.call(arr, f, opt_obj)
} : function(arr, f, opt_obj) {
  var l = arr.length;
  var res = new Array(l);
  var arr2 = goog.isString(arr) ? arr.split("") : arr;
  for(var i = 0;i < l;i++) {
    if(i in arr2) {
      res[i] = f.call(opt_obj, arr2[i], i, arr)
    }
  }
  return res
};
goog.array.reduce = function(arr, f, val, opt_obj) {
  if(arr.reduce) {
    if(opt_obj) {
      return arr.reduce(goog.bind(f, opt_obj), val)
    }else {
      return arr.reduce(f, val)
    }
  }
  var rval = val;
  goog.array.forEach(arr, function(val, index) {
    rval = f.call(opt_obj, rval, val, index, arr)
  });
  return rval
};
goog.array.reduceRight = function(arr, f, val, opt_obj) {
  if(arr.reduceRight) {
    if(opt_obj) {
      return arr.reduceRight(goog.bind(f, opt_obj), val)
    }else {
      return arr.reduceRight(f, val)
    }
  }
  var rval = val;
  goog.array.forEachRight(arr, function(val, index) {
    rval = f.call(opt_obj, rval, val, index, arr)
  });
  return rval
};
goog.array.some = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.some ? function(arr, f, opt_obj) {
  goog.asserts.assert(arr.length != null);
  return goog.array.ARRAY_PROTOTYPE_.some.call(arr, f, opt_obj)
} : function(arr, f, opt_obj) {
  var l = arr.length;
  var arr2 = goog.isString(arr) ? arr.split("") : arr;
  for(var i = 0;i < l;i++) {
    if(i in arr2 && f.call(opt_obj, arr2[i], i, arr)) {
      return true
    }
  }
  return false
};
goog.array.every = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.every ? function(arr, f, opt_obj) {
  goog.asserts.assert(arr.length != null);
  return goog.array.ARRAY_PROTOTYPE_.every.call(arr, f, opt_obj)
} : function(arr, f, opt_obj) {
  var l = arr.length;
  var arr2 = goog.isString(arr) ? arr.split("") : arr;
  for(var i = 0;i < l;i++) {
    if(i in arr2 && !f.call(opt_obj, arr2[i], i, arr)) {
      return false
    }
  }
  return true
};
goog.array.find = function(arr, f, opt_obj) {
  var i = goog.array.findIndex(arr, f, opt_obj);
  return i < 0 ? null : goog.isString(arr) ? arr.charAt(i) : arr[i]
};
goog.array.findIndex = function(arr, f, opt_obj) {
  var l = arr.length;
  var arr2 = goog.isString(arr) ? arr.split("") : arr;
  for(var i = 0;i < l;i++) {
    if(i in arr2 && f.call(opt_obj, arr2[i], i, arr)) {
      return i
    }
  }
  return-1
};
goog.array.findRight = function(arr, f, opt_obj) {
  var i = goog.array.findIndexRight(arr, f, opt_obj);
  return i < 0 ? null : goog.isString(arr) ? arr.charAt(i) : arr[i]
};
goog.array.findIndexRight = function(arr, f, opt_obj) {
  var l = arr.length;
  var arr2 = goog.isString(arr) ? arr.split("") : arr;
  for(var i = l - 1;i >= 0;i--) {
    if(i in arr2 && f.call(opt_obj, arr2[i], i, arr)) {
      return i
    }
  }
  return-1
};
goog.array.contains = function(arr, obj) {
  return goog.array.indexOf(arr, obj) >= 0
};
goog.array.isEmpty = function(arr) {
  return arr.length == 0
};
goog.array.clear = function(arr) {
  if(!goog.isArray(arr)) {
    for(var i = arr.length - 1;i >= 0;i--) {
      delete arr[i]
    }
  }
  arr.length = 0
};
goog.array.insert = function(arr, obj) {
  if(!goog.array.contains(arr, obj)) {
    arr.push(obj)
  }
};
goog.array.insertAt = function(arr, obj, opt_i) {
  goog.array.splice(arr, opt_i, 0, obj)
};
goog.array.insertArrayAt = function(arr, elementsToAdd, opt_i) {
  goog.partial(goog.array.splice, arr, opt_i, 0).apply(null, elementsToAdd)
};
goog.array.insertBefore = function(arr, obj, opt_obj2) {
  var i;
  if(arguments.length == 2 || (i = goog.array.indexOf(arr, opt_obj2)) < 0) {
    arr.push(obj)
  }else {
    goog.array.insertAt(arr, obj, i)
  }
};
goog.array.remove = function(arr, obj) {
  var i = goog.array.indexOf(arr, obj);
  var rv;
  if(rv = i >= 0) {
    goog.array.removeAt(arr, i)
  }
  return rv
};
goog.array.removeAt = function(arr, i) {
  goog.asserts.assert(arr.length != null);
  return goog.array.ARRAY_PROTOTYPE_.splice.call(arr, i, 1).length == 1
};
goog.array.removeIf = function(arr, f, opt_obj) {
  var i = goog.array.findIndex(arr, f, opt_obj);
  if(i >= 0) {
    goog.array.removeAt(arr, i);
    return true
  }
  return false
};
goog.array.concat = function(var_args) {
  return goog.array.ARRAY_PROTOTYPE_.concat.apply(goog.array.ARRAY_PROTOTYPE_, arguments)
};
goog.array.toArray = function(object) {
  var length = object.length;
  if(length > 0) {
    var rv = new Array(length);
    for(var i = 0;i < length;i++) {
      rv[i] = object[i]
    }
    return rv
  }
  return[]
};
goog.array.clone = goog.array.toArray;
goog.array.extend = function(arr1, var_args) {
  for(var i = 1;i < arguments.length;i++) {
    var arr2 = arguments[i];
    var isArrayLike;
    if(goog.isArray(arr2) || (isArrayLike = goog.isArrayLike(arr2)) && arr2.hasOwnProperty("callee")) {
      arr1.push.apply(arr1, arr2)
    }else {
      if(isArrayLike) {
        var len1 = arr1.length;
        var len2 = arr2.length;
        for(var j = 0;j < len2;j++) {
          arr1[len1 + j] = arr2[j]
        }
      }else {
        arr1.push(arr2)
      }
    }
  }
};
goog.array.splice = function(arr, index, howMany, var_args) {
  goog.asserts.assert(arr.length != null);
  return goog.array.ARRAY_PROTOTYPE_.splice.apply(arr, goog.array.slice(arguments, 1))
};
goog.array.slice = function(arr, start, opt_end) {
  goog.asserts.assert(arr.length != null);
  if(arguments.length <= 2) {
    return goog.array.ARRAY_PROTOTYPE_.slice.call(arr, start)
  }else {
    return goog.array.ARRAY_PROTOTYPE_.slice.call(arr, start, opt_end)
  }
};
goog.array.removeDuplicates = function(arr, opt_rv) {
  var returnArray = opt_rv || arr;
  var seen = {}, cursorInsert = 0, cursorRead = 0;
  while(cursorRead < arr.length) {
    var current = arr[cursorRead++];
    var key = goog.isObject(current) ? "o" + goog.getUid(current) : (typeof current).charAt(0) + current;
    if(!Object.prototype.hasOwnProperty.call(seen, key)) {
      seen[key] = true;
      returnArray[cursorInsert++] = current
    }
  }
  returnArray.length = cursorInsert
};
goog.array.binarySearch = function(arr, target, opt_compareFn) {
  return goog.array.binarySearch_(arr, opt_compareFn || goog.array.defaultCompare, false, target)
};
goog.array.binarySelect = function(arr, evaluator, opt_obj) {
  return goog.array.binarySearch_(arr, evaluator, true, undefined, opt_obj)
};
goog.array.binarySearch_ = function(arr, compareFn, isEvaluator, opt_target, opt_selfObj) {
  var left = 0;
  var right = arr.length;
  var found;
  while(left < right) {
    var middle = left + right >> 1;
    var compareResult;
    if(isEvaluator) {
      compareResult = compareFn.call(opt_selfObj, arr[middle], middle, arr)
    }else {
      compareResult = compareFn(opt_target, arr[middle])
    }
    if(compareResult > 0) {
      left = middle + 1
    }else {
      right = middle;
      found = !compareResult
    }
  }
  return found ? left : ~left
};
goog.array.sort = function(arr, opt_compareFn) {
  goog.asserts.assert(arr.length != null);
  goog.array.ARRAY_PROTOTYPE_.sort.call(arr, opt_compareFn || goog.array.defaultCompare)
};
goog.array.stableSort = function(arr, opt_compareFn) {
  for(var i = 0;i < arr.length;i++) {
    arr[i] = {index:i, value:arr[i]}
  }
  var valueCompareFn = opt_compareFn || goog.array.defaultCompare;
  function stableCompareFn(obj1, obj2) {
    return valueCompareFn(obj1.value, obj2.value) || obj1.index - obj2.index
  }
  goog.array.sort(arr, stableCompareFn);
  for(var i = 0;i < arr.length;i++) {
    arr[i] = arr[i].value
  }
};
goog.array.sortObjectsByKey = function(arr, key, opt_compareFn) {
  var compare = opt_compareFn || goog.array.defaultCompare;
  goog.array.sort(arr, function(a, b) {
    return compare(a[key], b[key])
  })
};
goog.array.isSorted = function(arr, opt_compareFn, opt_strict) {
  var compare = opt_compareFn || goog.array.defaultCompare;
  for(var i = 1;i < arr.length;i++) {
    var compareResult = compare(arr[i - 1], arr[i]);
    if(compareResult > 0 || compareResult == 0 && opt_strict) {
      return false
    }
  }
  return true
};
goog.array.equals = function(arr1, arr2, opt_equalsFn) {
  if(!goog.isArrayLike(arr1) || !goog.isArrayLike(arr2) || arr1.length != arr2.length) {
    return false
  }
  var l = arr1.length;
  var equalsFn = opt_equalsFn || goog.array.defaultCompareEquality;
  for(var i = 0;i < l;i++) {
    if(!equalsFn(arr1[i], arr2[i])) {
      return false
    }
  }
  return true
};
goog.array.compare = function(arr1, arr2, opt_equalsFn) {
  return goog.array.equals(arr1, arr2, opt_equalsFn)
};
goog.array.compare3 = function(arr1, arr2, opt_compareFn) {
  var compare = opt_compareFn || goog.array.defaultCompare;
  var l = Math.min(arr1.length, arr2.length);
  for(var i = 0;i < l;i++) {
    var result = compare(arr1[i], arr2[i]);
    if(result != 0) {
      return result
    }
  }
  return goog.array.defaultCompare(arr1.length, arr2.length)
};
goog.array.defaultCompare = function(a, b) {
  return a > b ? 1 : a < b ? -1 : 0
};
goog.array.defaultCompareEquality = function(a, b) {
  return a === b
};
goog.array.binaryInsert = function(array, value, opt_compareFn) {
  var index = goog.array.binarySearch(array, value, opt_compareFn);
  if(index < 0) {
    goog.array.insertAt(array, value, -(index + 1));
    return true
  }
  return false
};
goog.array.binaryRemove = function(array, value, opt_compareFn) {
  var index = goog.array.binarySearch(array, value, opt_compareFn);
  return index >= 0 ? goog.array.removeAt(array, index) : false
};
goog.array.bucket = function(array, sorter) {
  var buckets = {};
  for(var i = 0;i < array.length;i++) {
    var value = array[i];
    var key = sorter(value, i, array);
    if(goog.isDef(key)) {
      var bucket = buckets[key] || (buckets[key] = []);
      bucket.push(value)
    }
  }
  return buckets
};
goog.array.toObject = function(arr, keyFunc, opt_obj) {
  var ret = {};
  goog.array.forEach(arr, function(element, index) {
    ret[keyFunc.call(opt_obj, element, index, arr)] = element
  });
  return ret
};
goog.array.repeat = function(value, n) {
  var array = [];
  for(var i = 0;i < n;i++) {
    array[i] = value
  }
  return array
};
goog.array.flatten = function(var_args) {
  var result = [];
  for(var i = 0;i < arguments.length;i++) {
    var element = arguments[i];
    if(goog.isArray(element)) {
      result.push.apply(result, goog.array.flatten.apply(null, element))
    }else {
      result.push(element)
    }
  }
  return result
};
goog.array.rotate = function(array, n) {
  goog.asserts.assert(array.length != null);
  if(array.length) {
    n %= array.length;
    if(n > 0) {
      goog.array.ARRAY_PROTOTYPE_.unshift.apply(array, array.splice(-n, n))
    }else {
      if(n < 0) {
        goog.array.ARRAY_PROTOTYPE_.push.apply(array, array.splice(0, -n))
      }
    }
  }
  return array
};
goog.array.zip = function(var_args) {
  if(!arguments.length) {
    return[]
  }
  var result = [];
  for(var i = 0;true;i++) {
    var value = [];
    for(var j = 0;j < arguments.length;j++) {
      var arr = arguments[j];
      if(i >= arr.length) {
        return result
      }
      value.push(arr[i])
    }
    result.push(value)
  }
};
goog.array.shuffle = function(arr, opt_randFn) {
  var randFn = opt_randFn || Math.random;
  for(var i = arr.length - 1;i > 0;i--) {
    var j = Math.floor(randFn() * (i + 1));
    var tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp
  }
};
goog.provide("goog.userAgent");
goog.require("goog.string");
goog.userAgent.ASSUME_IE = false;
goog.userAgent.ASSUME_GECKO = false;
goog.userAgent.ASSUME_WEBKIT = false;
goog.userAgent.ASSUME_MOBILE_WEBKIT = false;
goog.userAgent.ASSUME_OPERA = false;
goog.userAgent.ASSUME_ANY_VERSION = false;
goog.userAgent.BROWSER_KNOWN_ = goog.userAgent.ASSUME_IE || goog.userAgent.ASSUME_GECKO || goog.userAgent.ASSUME_MOBILE_WEBKIT || goog.userAgent.ASSUME_WEBKIT || goog.userAgent.ASSUME_OPERA;
goog.userAgent.getUserAgentString = function() {
  return goog.global["navigator"] ? goog.global["navigator"].userAgent : null
};
goog.userAgent.getNavigator = function() {
  return goog.global["navigator"]
};
goog.userAgent.init_ = function() {
  goog.userAgent.detectedOpera_ = false;
  goog.userAgent.detectedIe_ = false;
  goog.userAgent.detectedWebkit_ = false;
  goog.userAgent.detectedMobile_ = false;
  goog.userAgent.detectedGecko_ = false;
  var ua;
  if(!goog.userAgent.BROWSER_KNOWN_ && (ua = goog.userAgent.getUserAgentString())) {
    var navigator = goog.userAgent.getNavigator();
    goog.userAgent.detectedOpera_ = ua.indexOf("Opera") == 0;
    goog.userAgent.detectedIe_ = !goog.userAgent.detectedOpera_ && ua.indexOf("MSIE") != -1;
    goog.userAgent.detectedWebkit_ = !goog.userAgent.detectedOpera_ && ua.indexOf("WebKit") != -1;
    goog.userAgent.detectedMobile_ = goog.userAgent.detectedWebkit_ && ua.indexOf("Mobile") != -1;
    goog.userAgent.detectedGecko_ = !goog.userAgent.detectedOpera_ && !goog.userAgent.detectedWebkit_ && navigator.product == "Gecko"
  }
};
if(!goog.userAgent.BROWSER_KNOWN_) {
  goog.userAgent.init_()
}
goog.userAgent.OPERA = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_OPERA : goog.userAgent.detectedOpera_;
goog.userAgent.IE = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_IE : goog.userAgent.detectedIe_;
goog.userAgent.GECKO = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_GECKO : goog.userAgent.detectedGecko_;
goog.userAgent.WEBKIT = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_WEBKIT || goog.userAgent.ASSUME_MOBILE_WEBKIT : goog.userAgent.detectedWebkit_;
goog.userAgent.MOBILE = goog.userAgent.ASSUME_MOBILE_WEBKIT || goog.userAgent.detectedMobile_;
goog.userAgent.SAFARI = goog.userAgent.WEBKIT;
goog.userAgent.determinePlatform_ = function() {
  var navigator = goog.userAgent.getNavigator();
  return navigator && navigator.platform || ""
};
goog.userAgent.PLATFORM = goog.userAgent.determinePlatform_();
goog.userAgent.ASSUME_MAC = false;
goog.userAgent.ASSUME_WINDOWS = false;
goog.userAgent.ASSUME_LINUX = false;
goog.userAgent.ASSUME_X11 = false;
goog.userAgent.PLATFORM_KNOWN_ = goog.userAgent.ASSUME_MAC || goog.userAgent.ASSUME_WINDOWS || goog.userAgent.ASSUME_LINUX || goog.userAgent.ASSUME_X11;
goog.userAgent.initPlatform_ = function() {
  goog.userAgent.detectedMac_ = goog.string.contains(goog.userAgent.PLATFORM, "Mac");
  goog.userAgent.detectedWindows_ = goog.string.contains(goog.userAgent.PLATFORM, "Win");
  goog.userAgent.detectedLinux_ = goog.string.contains(goog.userAgent.PLATFORM, "Linux");
  goog.userAgent.detectedX11_ = !!goog.userAgent.getNavigator() && goog.string.contains(goog.userAgent.getNavigator()["appVersion"] || "", "X11")
};
if(!goog.userAgent.PLATFORM_KNOWN_) {
  goog.userAgent.initPlatform_()
}
goog.userAgent.MAC = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_MAC : goog.userAgent.detectedMac_;
goog.userAgent.WINDOWS = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_WINDOWS : goog.userAgent.detectedWindows_;
goog.userAgent.LINUX = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_LINUX : goog.userAgent.detectedLinux_;
goog.userAgent.X11 = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_X11 : goog.userAgent.detectedX11_;
goog.userAgent.determineVersion_ = function() {
  var version = "", re;
  if(goog.userAgent.OPERA && goog.global["opera"]) {
    var operaVersion = goog.global["opera"].version;
    version = typeof operaVersion == "function" ? operaVersion() : operaVersion
  }else {
    if(goog.userAgent.GECKO) {
      re = /rv\:([^\);]+)(\)|;)/
    }else {
      if(goog.userAgent.IE) {
        re = /MSIE\s+([^\);]+)(\)|;)/
      }else {
        if(goog.userAgent.WEBKIT) {
          re = /WebKit\/(\S+)/
        }
      }
    }
    if(re) {
      var arr = re.exec(goog.userAgent.getUserAgentString());
      version = arr ? arr[1] : ""
    }
  }
  if(goog.userAgent.IE) {
    var docMode = goog.userAgent.getDocumentMode_();
    if(docMode > parseFloat(version)) {
      return String(docMode)
    }
  }
  return version
};
goog.userAgent.getDocumentMode_ = function() {
  var doc = goog.global["document"];
  return doc ? doc["documentMode"] : undefined
};
goog.userAgent.VERSION = goog.userAgent.determineVersion_();
goog.userAgent.compare = function(v1, v2) {
  return goog.string.compareVersions(v1, v2)
};
goog.userAgent.isVersionCache_ = {};
goog.userAgent.isVersion = function(version) {
  return goog.userAgent.ASSUME_ANY_VERSION || goog.userAgent.isVersionCache_[version] || (goog.userAgent.isVersionCache_[version] = goog.string.compareVersions(goog.userAgent.VERSION, version) >= 0)
};
goog.userAgent.isDocumentModeCache_ = {};
goog.userAgent.isDocumentMode = function(documentMode) {
  return goog.userAgent.isDocumentModeCache_[documentMode] || (goog.userAgent.isDocumentModeCache_[documentMode] = goog.userAgent.IE && !!document.documentMode && document.documentMode >= documentMode)
};
goog.provide("goog.dom.BrowserFeature");
goog.require("goog.userAgent");
goog.dom.BrowserFeature = {CAN_ADD_NAME_OR_TYPE_ATTRIBUTES:!goog.userAgent.IE || goog.userAgent.isDocumentMode(9), CAN_USE_CHILDREN_ATTRIBUTE:!goog.userAgent.GECKO && !goog.userAgent.IE || goog.userAgent.IE && goog.userAgent.isDocumentMode(9) || goog.userAgent.GECKO && goog.userAgent.isVersion("1.9.1"), CAN_USE_INNER_TEXT:goog.userAgent.IE && !goog.userAgent.isVersion("9"), CAN_USE_PARENT_ELEMENT_PROPERTY:goog.userAgent.IE || goog.userAgent.OPERA || goog.userAgent.WEBKIT, INNER_HTML_NEEDS_SCOPED_ELEMENT:goog.userAgent.IE};
goog.provide("goog.dom.TagName");
goog.dom.TagName = {A:"A", ABBR:"ABBR", ACRONYM:"ACRONYM", ADDRESS:"ADDRESS", APPLET:"APPLET", AREA:"AREA", ARTICLE:"ARTICLE", ASIDE:"ASIDE", AUDIO:"AUDIO", B:"B", BASE:"BASE", BASEFONT:"BASEFONT", BDI:"BDI", BDO:"BDO", BIG:"BIG", BLOCKQUOTE:"BLOCKQUOTE", BODY:"BODY", BR:"BR", BUTTON:"BUTTON", CANVAS:"CANVAS", CAPTION:"CAPTION", CENTER:"CENTER", CITE:"CITE", CODE:"CODE", COL:"COL", COLGROUP:"COLGROUP", COMMAND:"COMMAND", DATA:"DATA", DATALIST:"DATALIST", DD:"DD", DEL:"DEL", DETAILS:"DETAILS", DFN:"DFN", 
DIALOG:"DIALOG", DIR:"DIR", DIV:"DIV", DL:"DL", DT:"DT", EM:"EM", EMBED:"EMBED", FIELDSET:"FIELDSET", FIGCAPTION:"FIGCAPTION", FIGURE:"FIGURE", FONT:"FONT", FOOTER:"FOOTER", FORM:"FORM", FRAME:"FRAME", FRAMESET:"FRAMESET", H1:"H1", H2:"H2", H3:"H3", H4:"H4", H5:"H5", H6:"H6", HEAD:"HEAD", HEADER:"HEADER", HGROUP:"HGROUP", HR:"HR", HTML:"HTML", I:"I", IFRAME:"IFRAME", IMG:"IMG", INPUT:"INPUT", INS:"INS", ISINDEX:"ISINDEX", KBD:"KBD", KEYGEN:"KEYGEN", LABEL:"LABEL", LEGEND:"LEGEND", LI:"LI", LINK:"LINK", 
MAP:"MAP", MARK:"MARK", MATH:"MATH", MENU:"MENU", META:"META", METER:"METER", NAV:"NAV", NOFRAMES:"NOFRAMES", NOSCRIPT:"NOSCRIPT", OBJECT:"OBJECT", OL:"OL", OPTGROUP:"OPTGROUP", OPTION:"OPTION", OUTPUT:"OUTPUT", P:"P", PARAM:"PARAM", PRE:"PRE", PROGRESS:"PROGRESS", Q:"Q", RP:"RP", RT:"RT", RUBY:"RUBY", S:"S", SAMP:"SAMP", SCRIPT:"SCRIPT", SECTION:"SECTION", SELECT:"SELECT", SMALL:"SMALL", SOURCE:"SOURCE", SPAN:"SPAN", STRIKE:"STRIKE", STRONG:"STRONG", STYLE:"STYLE", SUB:"SUB", SUMMARY:"SUMMARY", 
SUP:"SUP", SVG:"SVG", TABLE:"TABLE", TBODY:"TBODY", TD:"TD", TEXTAREA:"TEXTAREA", TFOOT:"TFOOT", TH:"TH", THEAD:"THEAD", TIME:"TIME", TITLE:"TITLE", TR:"TR", TRACK:"TRACK", TT:"TT", U:"U", UL:"UL", VAR:"VAR", VIDEO:"VIDEO", WBR:"WBR"};
goog.provide("goog.dom.classes");
goog.require("goog.array");
goog.dom.classes.set = function(element, className) {
  element.className = className
};
goog.dom.classes.get = function(element) {
  var className = element.className;
  return goog.isString(className) && className.match(/\S+/g) || []
};
goog.dom.classes.add = function(element, var_args) {
  var classes = goog.dom.classes.get(element);
  var args = goog.array.slice(arguments, 1);
  var expectedCount = classes.length + args.length;
  goog.dom.classes.add_(classes, args);
  element.className = classes.join(" ");
  return classes.length == expectedCount
};
goog.dom.classes.remove = function(element, var_args) {
  var classes = goog.dom.classes.get(element);
  var args = goog.array.slice(arguments, 1);
  var newClasses = goog.dom.classes.getDifference_(classes, args);
  element.className = newClasses.join(" ");
  return newClasses.length == classes.length - args.length
};
goog.dom.classes.add_ = function(classes, args) {
  for(var i = 0;i < args.length;i++) {
    if(!goog.array.contains(classes, args[i])) {
      classes.push(args[i])
    }
  }
};
goog.dom.classes.getDifference_ = function(arr1, arr2) {
  return goog.array.filter(arr1, function(item) {
    return!goog.array.contains(arr2, item)
  })
};
goog.dom.classes.swap = function(element, fromClass, toClass) {
  var classes = goog.dom.classes.get(element);
  var removed = false;
  for(var i = 0;i < classes.length;i++) {
    if(classes[i] == fromClass) {
      goog.array.splice(classes, i--, 1);
      removed = true
    }
  }
  if(removed) {
    classes.push(toClass);
    element.className = classes.join(" ")
  }
  return removed
};
goog.dom.classes.addRemove = function(element, classesToRemove, classesToAdd) {
  var classes = goog.dom.classes.get(element);
  if(goog.isString(classesToRemove)) {
    goog.array.remove(classes, classesToRemove)
  }else {
    if(goog.isArray(classesToRemove)) {
      classes = goog.dom.classes.getDifference_(classes, classesToRemove)
    }
  }
  if(goog.isString(classesToAdd) && !goog.array.contains(classes, classesToAdd)) {
    classes.push(classesToAdd)
  }else {
    if(goog.isArray(classesToAdd)) {
      goog.dom.classes.add_(classes, classesToAdd)
    }
  }
  element.className = classes.join(" ")
};
goog.dom.classes.has = function(element, className) {
  return goog.array.contains(goog.dom.classes.get(element), className)
};
goog.dom.classes.enable = function(element, className, enabled) {
  if(enabled) {
    goog.dom.classes.add(element, className)
  }else {
    goog.dom.classes.remove(element, className)
  }
};
goog.dom.classes.toggle = function(element, className) {
  var add = !goog.dom.classes.has(element, className);
  goog.dom.classes.enable(element, className, add);
  return add
};
goog.provide("goog.math");
goog.require("goog.array");
goog.math.randomInt = function(a) {
  return Math.floor(Math.random() * a)
};
goog.math.uniformRandom = function(a, b) {
  return a + Math.random() * (b - a)
};
goog.math.clamp = function(value, min, max) {
  return Math.min(Math.max(value, min), max)
};
goog.math.modulo = function(a, b) {
  var r = a % b;
  return r * b < 0 ? r + b : r
};
goog.math.lerp = function(a, b, x) {
  return a + x * (b - a)
};
goog.math.nearlyEquals = function(a, b, opt_tolerance) {
  return Math.abs(a - b) <= (opt_tolerance || 1E-6)
};
goog.math.standardAngle = function(angle) {
  return goog.math.modulo(angle, 360)
};
goog.math.toRadians = function(angleDegrees) {
  return angleDegrees * Math.PI / 180
};
goog.math.toDegrees = function(angleRadians) {
  return angleRadians * 180 / Math.PI
};
goog.math.angleDx = function(degrees, radius) {
  return radius * Math.cos(goog.math.toRadians(degrees))
};
goog.math.angleDy = function(degrees, radius) {
  return radius * Math.sin(goog.math.toRadians(degrees))
};
goog.math.angle = function(x1, y1, x2, y2) {
  return goog.math.standardAngle(goog.math.toDegrees(Math.atan2(y2 - y1, x2 - x1)))
};
goog.math.angleDifference = function(startAngle, endAngle) {
  var d = goog.math.standardAngle(endAngle) - goog.math.standardAngle(startAngle);
  if(d > 180) {
    d = d - 360
  }else {
    if(d <= -180) {
      d = 360 + d
    }
  }
  return d
};
goog.math.sign = function(x) {
  return x == 0 ? 0 : x < 0 ? -1 : 1
};
goog.math.longestCommonSubsequence = function(array1, array2, opt_compareFn, opt_collectorFn) {
  var compare = opt_compareFn || function(a, b) {
    return a == b
  };
  var collect = opt_collectorFn || function(i1, i2) {
    return array1[i1]
  };
  var length1 = array1.length;
  var length2 = array2.length;
  var arr = [];
  for(var i = 0;i < length1 + 1;i++) {
    arr[i] = [];
    arr[i][0] = 0
  }
  for(var j = 0;j < length2 + 1;j++) {
    arr[0][j] = 0
  }
  for(i = 1;i <= length1;i++) {
    for(j = 1;j <= length1;j++) {
      if(compare(array1[i - 1], array2[j - 1])) {
        arr[i][j] = arr[i - 1][j - 1] + 1
      }else {
        arr[i][j] = Math.max(arr[i - 1][j], arr[i][j - 1])
      }
    }
  }
  var result = [];
  var i = length1, j = length2;
  while(i > 0 && j > 0) {
    if(compare(array1[i - 1], array2[j - 1])) {
      result.unshift(collect(i - 1, j - 1));
      i--;
      j--
    }else {
      if(arr[i - 1][j] > arr[i][j - 1]) {
        i--
      }else {
        j--
      }
    }
  }
  return result
};
goog.math.sum = function(var_args) {
  return goog.array.reduce(arguments, function(sum, value) {
    return sum + value
  }, 0)
};
goog.math.average = function(var_args) {
  return goog.math.sum.apply(null, arguments) / arguments.length
};
goog.math.standardDeviation = function(var_args) {
  var sampleSize = arguments.length;
  if(sampleSize < 2) {
    return 0
  }
  var mean = goog.math.average.apply(null, arguments);
  var variance = goog.math.sum.apply(null, goog.array.map(arguments, function(val) {
    return Math.pow(val - mean, 2)
  })) / (sampleSize - 1);
  return Math.sqrt(variance)
};
goog.math.isInt = function(num) {
  return isFinite(num) && num % 1 == 0
};
goog.math.isFiniteNumber = function(num) {
  return isFinite(num) && !isNaN(num)
};
goog.provide("goog.math.Coordinate");
goog.require("goog.math");
goog.math.Coordinate = function(opt_x, opt_y) {
  this.x = goog.isDef(opt_x) ? opt_x : 0;
  this.y = goog.isDef(opt_y) ? opt_y : 0
};
goog.math.Coordinate.prototype.clone = function() {
  return new goog.math.Coordinate(this.x, this.y)
};
if(goog.DEBUG) {
  goog.math.Coordinate.prototype.toString = function() {
    return"(" + this.x + ", " + this.y + ")"
  }
}
goog.math.Coordinate.equals = function(a, b) {
  if(a == b) {
    return true
  }
  if(!a || !b) {
    return false
  }
  return a.x == b.x && a.y == b.y
};
goog.math.Coordinate.distance = function(a, b) {
  var dx = a.x - b.x;
  var dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy)
};
goog.math.Coordinate.magnitude = function(a) {
  return Math.sqrt(a.x * a.x + a.y * a.y)
};
goog.math.Coordinate.azimuth = function(a) {
  return goog.math.angle(0, 0, a.x, a.y)
};
goog.math.Coordinate.squaredDistance = function(a, b) {
  var dx = a.x - b.x;
  var dy = a.y - b.y;
  return dx * dx + dy * dy
};
goog.math.Coordinate.difference = function(a, b) {
  return new goog.math.Coordinate(a.x - b.x, a.y - b.y)
};
goog.math.Coordinate.sum = function(a, b) {
  return new goog.math.Coordinate(a.x + b.x, a.y + b.y)
};
goog.provide("goog.math.Size");
goog.math.Size = function(width, height) {
  this.width = width;
  this.height = height
};
goog.math.Size.equals = function(a, b) {
  if(a == b) {
    return true
  }
  if(!a || !b) {
    return false
  }
  return a.width == b.width && a.height == b.height
};
goog.math.Size.prototype.clone = function() {
  return new goog.math.Size(this.width, this.height)
};
if(goog.DEBUG) {
  goog.math.Size.prototype.toString = function() {
    return"(" + this.width + " x " + this.height + ")"
  }
}
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
  return(this.width + this.height) * 2
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
goog.math.Size.prototype.fitsInside = function(target) {
  return this.width <= target.width && this.height <= target.height
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
goog.math.Size.prototype.scale = function(s) {
  this.width *= s;
  this.height *= s;
  return this
};
goog.math.Size.prototype.scaleToFit = function(target) {
  var s = this.aspectRatio() > target.aspectRatio() ? target.width / this.width : target.height / this.height;
  return this.scale(s)
};
goog.provide("goog.object");
goog.object.forEach = function(obj, f, opt_obj) {
  for(var key in obj) {
    f.call(opt_obj, obj[key], key, obj)
  }
};
goog.object.filter = function(obj, f, opt_obj) {
  var res = {};
  for(var key in obj) {
    if(f.call(opt_obj, obj[key], key, obj)) {
      res[key] = obj[key]
    }
  }
  return res
};
goog.object.map = function(obj, f, opt_obj) {
  var res = {};
  for(var key in obj) {
    res[key] = f.call(opt_obj, obj[key], key, obj)
  }
  return res
};
goog.object.some = function(obj, f, opt_obj) {
  for(var key in obj) {
    if(f.call(opt_obj, obj[key], key, obj)) {
      return true
    }
  }
  return false
};
goog.object.every = function(obj, f, opt_obj) {
  for(var key in obj) {
    if(!f.call(opt_obj, obj[key], key, obj)) {
      return false
    }
  }
  return true
};
goog.object.getCount = function(obj) {
  var rv = 0;
  for(var key in obj) {
    rv++
  }
  return rv
};
goog.object.getAnyKey = function(obj) {
  for(var key in obj) {
    return key
  }
};
goog.object.getAnyValue = function(obj) {
  for(var key in obj) {
    return obj[key]
  }
};
goog.object.contains = function(obj, val) {
  return goog.object.containsValue(obj, val)
};
goog.object.getValues = function(obj) {
  var res = [];
  var i = 0;
  for(var key in obj) {
    res[i++] = obj[key]
  }
  return res
};
goog.object.getKeys = function(obj) {
  var res = [];
  var i = 0;
  for(var key in obj) {
    res[i++] = key
  }
  return res
};
goog.object.getValueByKeys = function(obj, var_args) {
  var isArrayLike = goog.isArrayLike(var_args);
  var keys = isArrayLike ? var_args : arguments;
  for(var i = isArrayLike ? 0 : 1;i < keys.length;i++) {
    obj = obj[keys[i]];
    if(!goog.isDef(obj)) {
      break
    }
  }
  return obj
};
goog.object.containsKey = function(obj, key) {
  return key in obj
};
goog.object.containsValue = function(obj, val) {
  for(var key in obj) {
    if(obj[key] == val) {
      return true
    }
  }
  return false
};
goog.object.findKey = function(obj, f, opt_this) {
  for(var key in obj) {
    if(f.call(opt_this, obj[key], key, obj)) {
      return key
    }
  }
  return undefined
};
goog.object.findValue = function(obj, f, opt_this) {
  var key = goog.object.findKey(obj, f, opt_this);
  return key && obj[key]
};
goog.object.isEmpty = function(obj) {
  for(var key in obj) {
    return false
  }
  return true
};
goog.object.clear = function(obj) {
  for(var i in obj) {
    delete obj[i]
  }
};
goog.object.remove = function(obj, key) {
  var rv;
  if(rv = key in obj) {
    delete obj[key]
  }
  return rv
};
goog.object.add = function(obj, key, val) {
  if(key in obj) {
    throw Error('The object already contains the key "' + key + '"');
  }
  goog.object.set(obj, key, val)
};
goog.object.get = function(obj, key, opt_val) {
  if(key in obj) {
    return obj[key]
  }
  return opt_val
};
goog.object.set = function(obj, key, value) {
  obj[key] = value
};
goog.object.setIfUndefined = function(obj, key, value) {
  return key in obj ? obj[key] : obj[key] = value
};
goog.object.clone = function(obj) {
  var res = {};
  for(var key in obj) {
    res[key] = obj[key]
  }
  return res
};
goog.object.unsafeClone = function(obj) {
  var type = goog.typeOf(obj);
  if(type == "object" || type == "array") {
    if(obj.clone) {
      return obj.clone()
    }
    var clone = type == "array" ? [] : {};
    for(var key in obj) {
      clone[key] = goog.object.unsafeClone(obj[key])
    }
    return clone
  }
  return obj
};
goog.object.transpose = function(obj) {
  var transposed = {};
  for(var key in obj) {
    transposed[obj[key]] = key
  }
  return transposed
};
goog.object.PROTOTYPE_FIELDS_ = ["constructor", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "toLocaleString", "toString", "valueOf"];
goog.object.extend = function(target, var_args) {
  var key, source;
  for(var i = 1;i < arguments.length;i++) {
    source = arguments[i];
    for(key in source) {
      target[key] = source[key]
    }
    for(var j = 0;j < goog.object.PROTOTYPE_FIELDS_.length;j++) {
      key = goog.object.PROTOTYPE_FIELDS_[j];
      if(Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key]
      }
    }
  }
};
goog.object.create = function(var_args) {
  var argLength = arguments.length;
  if(argLength == 1 && goog.isArray(arguments[0])) {
    return goog.object.create.apply(null, arguments[0])
  }
  if(argLength % 2) {
    throw Error("Uneven number of arguments");
  }
  var rv = {};
  for(var i = 0;i < argLength;i += 2) {
    rv[arguments[i]] = arguments[i + 1]
  }
  return rv
};
goog.object.createSet = function(var_args) {
  var argLength = arguments.length;
  if(argLength == 1 && goog.isArray(arguments[0])) {
    return goog.object.createSet.apply(null, arguments[0])
  }
  var rv = {};
  for(var i = 0;i < argLength;i++) {
    rv[arguments[i]] = true
  }
  return rv
};
goog.object.createImmutableView = function(obj) {
  var result = obj;
  if(Object.isFrozen && !Object.isFrozen(obj)) {
    result = Object.create(obj);
    Object.freeze(result)
  }
  return result
};
goog.object.isImmutableView = function(obj) {
  return!!Object.isFrozen && Object.isFrozen(obj)
};
goog.provide("goog.dom");
goog.provide("goog.dom.DomHelper");
goog.provide("goog.dom.NodeType");
goog.require("goog.array");
goog.require("goog.dom.BrowserFeature");
goog.require("goog.dom.TagName");
goog.require("goog.dom.classes");
goog.require("goog.math.Coordinate");
goog.require("goog.math.Size");
goog.require("goog.object");
goog.require("goog.string");
goog.require("goog.userAgent");
goog.dom.ASSUME_QUIRKS_MODE = false;
goog.dom.ASSUME_STANDARDS_MODE = false;
goog.dom.COMPAT_MODE_KNOWN_ = goog.dom.ASSUME_QUIRKS_MODE || goog.dom.ASSUME_STANDARDS_MODE;
goog.dom.NodeType = {ELEMENT:1, ATTRIBUTE:2, TEXT:3, CDATA_SECTION:4, ENTITY_REFERENCE:5, ENTITY:6, PROCESSING_INSTRUCTION:7, COMMENT:8, DOCUMENT:9, DOCUMENT_TYPE:10, DOCUMENT_FRAGMENT:11, NOTATION:12};
goog.dom.getDomHelper = function(opt_element) {
  return opt_element ? new goog.dom.DomHelper(goog.dom.getOwnerDocument(opt_element)) : goog.dom.defaultDomHelper_ || (goog.dom.defaultDomHelper_ = new goog.dom.DomHelper)
};
goog.dom.defaultDomHelper_;
goog.dom.getDocument = function() {
  return document
};
goog.dom.getElement = function(element) {
  return goog.isString(element) ? document.getElementById(element) : element
};
goog.dom.$ = goog.dom.getElement;
goog.dom.getElementsByTagNameAndClass = function(opt_tag, opt_class, opt_el) {
  return goog.dom.getElementsByTagNameAndClass_(document, opt_tag, opt_class, opt_el)
};
goog.dom.getElementsByClass = function(className, opt_el) {
  var parent = opt_el || document;
  if(goog.dom.canUseQuerySelector_(parent)) {
    return parent.querySelectorAll("." + className)
  }else {
    if(parent.getElementsByClassName) {
      return parent.getElementsByClassName(className)
    }
  }
  return goog.dom.getElementsByTagNameAndClass_(document, "*", className, opt_el)
};
goog.dom.getElementByClass = function(className, opt_el) {
  var parent = opt_el || document;
  var retVal = null;
  if(goog.dom.canUseQuerySelector_(parent)) {
    retVal = parent.querySelector("." + className)
  }else {
    retVal = goog.dom.getElementsByClass(className, opt_el)[0]
  }
  return retVal || null
};
goog.dom.canUseQuerySelector_ = function(parent) {
  return!!(parent.querySelectorAll && parent.querySelector)
};
goog.dom.getElementsByTagNameAndClass_ = function(doc, opt_tag, opt_class, opt_el) {
  var parent = opt_el || doc;
  var tagName = opt_tag && opt_tag != "*" ? opt_tag.toUpperCase() : "";
  if(goog.dom.canUseQuerySelector_(parent) && (tagName || opt_class)) {
    var query = tagName + (opt_class ? "." + opt_class : "");
    return parent.querySelectorAll(query)
  }
  if(opt_class && parent.getElementsByClassName) {
    var els = parent.getElementsByClassName(opt_class);
    if(tagName) {
      var arrayLike = {};
      var len = 0;
      for(var i = 0, el;el = els[i];i++) {
        if(tagName == el.nodeName) {
          arrayLike[len++] = el
        }
      }
      arrayLike.length = len;
      return arrayLike
    }else {
      return els
    }
  }
  var els = parent.getElementsByTagName(tagName || "*");
  if(opt_class) {
    var arrayLike = {};
    var len = 0;
    for(var i = 0, el;el = els[i];i++) {
      var className = el.className;
      if(typeof className.split == "function" && goog.array.contains(className.split(/\s+/), opt_class)) {
        arrayLike[len++] = el
      }
    }
    arrayLike.length = len;
    return arrayLike
  }else {
    return els
  }
};
goog.dom.$$ = goog.dom.getElementsByTagNameAndClass;
goog.dom.setProperties = function(element, properties) {
  goog.object.forEach(properties, function(val, key) {
    if(key == "style") {
      element.style.cssText = val
    }else {
      if(key == "class") {
        element.className = val
      }else {
        if(key == "for") {
          element.htmlFor = val
        }else {
          if(key in goog.dom.DIRECT_ATTRIBUTE_MAP_) {
            element.setAttribute(goog.dom.DIRECT_ATTRIBUTE_MAP_[key], val)
          }else {
            if(goog.string.startsWith(key, "aria-") || goog.string.startsWith(key, "data-")) {
              element.setAttribute(key, val)
            }else {
              element[key] = val
            }
          }
        }
      }
    }
  })
};
goog.dom.DIRECT_ATTRIBUTE_MAP_ = {"cellpadding":"cellPadding", "cellspacing":"cellSpacing", "colspan":"colSpan", "frameborder":"frameBorder", "height":"height", "maxlength":"maxLength", "role":"role", "rowspan":"rowSpan", "type":"type", "usemap":"useMap", "valign":"vAlign", "width":"width"};
goog.dom.getViewportSize = function(opt_window) {
  return goog.dom.getViewportSize_(opt_window || window)
};
goog.dom.getViewportSize_ = function(win) {
  var doc = win.document;
  var el = goog.dom.isCss1CompatMode_(doc) ? doc.documentElement : doc.body;
  return new goog.math.Size(el.clientWidth, el.clientHeight)
};
goog.dom.getDocumentHeight = function() {
  return goog.dom.getDocumentHeight_(window)
};
goog.dom.getDocumentHeight_ = function(win) {
  var doc = win.document;
  var height = 0;
  if(doc) {
    var vh = goog.dom.getViewportSize_(win).height;
    var body = doc.body;
    var docEl = doc.documentElement;
    if(goog.dom.isCss1CompatMode_(doc) && docEl.scrollHeight) {
      height = docEl.scrollHeight != vh ? docEl.scrollHeight : docEl.offsetHeight
    }else {
      var sh = docEl.scrollHeight;
      var oh = docEl.offsetHeight;
      if(docEl.clientHeight != oh) {
        sh = body.scrollHeight;
        oh = body.offsetHeight
      }
      if(sh > vh) {
        height = sh > oh ? sh : oh
      }else {
        height = sh < oh ? sh : oh
      }
    }
  }
  return height
};
goog.dom.getPageScroll = function(opt_window) {
  var win = opt_window || goog.global || window;
  return goog.dom.getDomHelper(win.document).getDocumentScroll()
};
goog.dom.getDocumentScroll = function() {
  return goog.dom.getDocumentScroll_(document)
};
goog.dom.getDocumentScroll_ = function(doc) {
  var el = goog.dom.getDocumentScrollElement_(doc);
  var win = goog.dom.getWindow_(doc);
  return new goog.math.Coordinate(win.pageXOffset || el.scrollLeft, win.pageYOffset || el.scrollTop)
};
goog.dom.getDocumentScrollElement = function() {
  return goog.dom.getDocumentScrollElement_(document)
};
goog.dom.getDocumentScrollElement_ = function(doc) {
  return!goog.userAgent.WEBKIT && goog.dom.isCss1CompatMode_(doc) ? doc.documentElement : doc.body
};
goog.dom.getWindow = function(opt_doc) {
  return opt_doc ? goog.dom.getWindow_(opt_doc) : window
};
goog.dom.getWindow_ = function(doc) {
  return doc.parentWindow || doc.defaultView
};
goog.dom.createDom = function(tagName, opt_attributes, var_args) {
  return goog.dom.createDom_(document, arguments)
};
goog.dom.createDom_ = function(doc, args) {
  var tagName = args[0];
  var attributes = args[1];
  if(!goog.dom.BrowserFeature.CAN_ADD_NAME_OR_TYPE_ATTRIBUTES && attributes && (attributes.name || attributes.type)) {
    var tagNameArr = ["<", tagName];
    if(attributes.name) {
      tagNameArr.push(' name="', goog.string.htmlEscape(attributes.name), '"')
    }
    if(attributes.type) {
      tagNameArr.push(' type="', goog.string.htmlEscape(attributes.type), '"');
      var clone = {};
      goog.object.extend(clone, attributes);
      delete clone["type"];
      attributes = clone
    }
    tagNameArr.push(">");
    tagName = tagNameArr.join("")
  }
  var element = doc.createElement(tagName);
  if(attributes) {
    if(goog.isString(attributes)) {
      element.className = attributes
    }else {
      if(goog.isArray(attributes)) {
        goog.dom.classes.add.apply(null, [element].concat(attributes))
      }else {
        goog.dom.setProperties(element, attributes)
      }
    }
  }
  if(args.length > 2) {
    goog.dom.append_(doc, element, args, 2)
  }
  return element
};
goog.dom.append_ = function(doc, parent, args, startIndex) {
  function childHandler(child) {
    if(child) {
      parent.appendChild(goog.isString(child) ? doc.createTextNode(child) : child)
    }
  }
  for(var i = startIndex;i < args.length;i++) {
    var arg = args[i];
    if(goog.isArrayLike(arg) && !goog.dom.isNodeLike(arg)) {
      goog.array.forEach(goog.dom.isNodeList(arg) ? goog.array.toArray(arg) : arg, childHandler)
    }else {
      childHandler(arg)
    }
  }
};
goog.dom.$dom = goog.dom.createDom;
goog.dom.createElement = function(name) {
  return document.createElement(name)
};
goog.dom.createTextNode = function(content) {
  return document.createTextNode(content)
};
goog.dom.createTable = function(rows, columns, opt_fillWithNbsp) {
  return goog.dom.createTable_(document, rows, columns, !!opt_fillWithNbsp)
};
goog.dom.createTable_ = function(doc, rows, columns, fillWithNbsp) {
  var rowHtml = ["<tr>"];
  for(var i = 0;i < columns;i++) {
    rowHtml.push(fillWithNbsp ? "<td>&nbsp;</td>" : "<td></td>")
  }
  rowHtml.push("</tr>");
  rowHtml = rowHtml.join("");
  var totalHtml = ["<table>"];
  for(i = 0;i < rows;i++) {
    totalHtml.push(rowHtml)
  }
  totalHtml.push("</table>");
  var elem = doc.createElement(goog.dom.TagName.DIV);
  elem.innerHTML = totalHtml.join("");
  return elem.removeChild(elem.firstChild)
};
goog.dom.htmlToDocumentFragment = function(htmlString) {
  return goog.dom.htmlToDocumentFragment_(document, htmlString)
};
goog.dom.htmlToDocumentFragment_ = function(doc, htmlString) {
  var tempDiv = doc.createElement("div");
  if(goog.dom.BrowserFeature.INNER_HTML_NEEDS_SCOPED_ELEMENT) {
    tempDiv.innerHTML = "<br>" + htmlString;
    tempDiv.removeChild(tempDiv.firstChild)
  }else {
    tempDiv.innerHTML = htmlString
  }
  if(tempDiv.childNodes.length == 1) {
    return tempDiv.removeChild(tempDiv.firstChild)
  }else {
    var fragment = doc.createDocumentFragment();
    while(tempDiv.firstChild) {
      fragment.appendChild(tempDiv.firstChild)
    }
    return fragment
  }
};
goog.dom.getCompatMode = function() {
  return goog.dom.isCss1CompatMode() ? "CSS1Compat" : "BackCompat"
};
goog.dom.isCss1CompatMode = function() {
  return goog.dom.isCss1CompatMode_(document)
};
goog.dom.isCss1CompatMode_ = function(doc) {
  if(goog.dom.COMPAT_MODE_KNOWN_) {
    return goog.dom.ASSUME_STANDARDS_MODE
  }
  return doc.compatMode == "CSS1Compat"
};
goog.dom.canHaveChildren = function(node) {
  if(node.nodeType != goog.dom.NodeType.ELEMENT) {
    return false
  }
  switch(node.tagName) {
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
      return false
  }
  return true
};
goog.dom.appendChild = function(parent, child) {
  parent.appendChild(child)
};
goog.dom.append = function(parent, var_args) {
  goog.dom.append_(goog.dom.getOwnerDocument(parent), parent, arguments, 1)
};
goog.dom.removeChildren = function(node) {
  var child;
  while(child = node.firstChild) {
    node.removeChild(child)
  }
};
goog.dom.insertSiblingBefore = function(newNode, refNode) {
  if(refNode.parentNode) {
    refNode.parentNode.insertBefore(newNode, refNode)
  }
};
goog.dom.insertSiblingAfter = function(newNode, refNode) {
  if(refNode.parentNode) {
    refNode.parentNode.insertBefore(newNode, refNode.nextSibling)
  }
};
goog.dom.insertChildAt = function(parent, child, index) {
  parent.insertBefore(child, parent.childNodes[index] || null)
};
goog.dom.removeNode = function(node) {
  return node && node.parentNode ? node.parentNode.removeChild(node) : null
};
goog.dom.replaceNode = function(newNode, oldNode) {
  var parent = oldNode.parentNode;
  if(parent) {
    parent.replaceChild(newNode, oldNode)
  }
};
goog.dom.flattenElement = function(element) {
  var child, parent = element.parentNode;
  if(parent && parent.nodeType != goog.dom.NodeType.DOCUMENT_FRAGMENT) {
    if(element.removeNode) {
      return element.removeNode(false)
    }else {
      while(child = element.firstChild) {
        parent.insertBefore(child, element)
      }
      return goog.dom.removeNode(element)
    }
  }
};
goog.dom.getChildren = function(element) {
  if(goog.dom.BrowserFeature.CAN_USE_CHILDREN_ATTRIBUTE && element.children != undefined) {
    return element.children
  }
  return goog.array.filter(element.childNodes, function(node) {
    return node.nodeType == goog.dom.NodeType.ELEMENT
  })
};
goog.dom.getFirstElementChild = function(node) {
  if(node.firstElementChild != undefined) {
    return node.firstElementChild
  }
  return goog.dom.getNextElementNode_(node.firstChild, true)
};
goog.dom.getLastElementChild = function(node) {
  if(node.lastElementChild != undefined) {
    return node.lastElementChild
  }
  return goog.dom.getNextElementNode_(node.lastChild, false)
};
goog.dom.getNextElementSibling = function(node) {
  if(node.nextElementSibling != undefined) {
    return node.nextElementSibling
  }
  return goog.dom.getNextElementNode_(node.nextSibling, true)
};
goog.dom.getPreviousElementSibling = function(node) {
  if(node.previousElementSibling != undefined) {
    return node.previousElementSibling
  }
  return goog.dom.getNextElementNode_(node.previousSibling, false)
};
goog.dom.getNextElementNode_ = function(node, forward) {
  while(node && node.nodeType != goog.dom.NodeType.ELEMENT) {
    node = forward ? node.nextSibling : node.previousSibling
  }
  return node
};
goog.dom.getNextNode = function(node) {
  if(!node) {
    return null
  }
  if(node.firstChild) {
    return node.firstChild
  }
  while(node && !node.nextSibling) {
    node = node.parentNode
  }
  return node ? node.nextSibling : null
};
goog.dom.getPreviousNode = function(node) {
  if(!node) {
    return null
  }
  if(!node.previousSibling) {
    return node.parentNode
  }
  node = node.previousSibling;
  while(node && node.lastChild) {
    node = node.lastChild
  }
  return node
};
goog.dom.isNodeLike = function(obj) {
  return goog.isObject(obj) && obj.nodeType > 0
};
goog.dom.isElement = function(obj) {
  return goog.isObject(obj) && obj.nodeType == goog.dom.NodeType.ELEMENT
};
goog.dom.isWindow = function(obj) {
  return goog.isObject(obj) && obj["window"] == obj
};
goog.dom.getParentElement = function(element) {
  if(goog.dom.BrowserFeature.CAN_USE_PARENT_ELEMENT_PROPERTY) {
    return element.parentElement
  }
  var parent = element.parentNode;
  return goog.dom.isElement(parent) ? parent : null
};
goog.dom.contains = function(parent, descendant) {
  if(parent.contains && descendant.nodeType == goog.dom.NodeType.ELEMENT) {
    return parent == descendant || parent.contains(descendant)
  }
  if(typeof parent.compareDocumentPosition != "undefined") {
    return parent == descendant || Boolean(parent.compareDocumentPosition(descendant) & 16)
  }
  while(descendant && parent != descendant) {
    descendant = descendant.parentNode
  }
  return descendant == parent
};
goog.dom.compareNodeOrder = function(node1, node2) {
  if(node1 == node2) {
    return 0
  }
  if(node1.compareDocumentPosition) {
    return node1.compareDocumentPosition(node2) & 2 ? 1 : -1
  }
  if((node1.nodeType == goog.dom.NodeType.DOCUMENT || node2.nodeType == goog.dom.NodeType.DOCUMENT) && goog.userAgent.IE && !goog.userAgent.isVersion(9)) {
    if(node1.nodeType == goog.dom.NodeType.DOCUMENT) {
      return-1
    }
    if(node2.nodeType == goog.dom.NodeType.DOCUMENT) {
      return 1
    }
  }
  if("sourceIndex" in node1 || node1.parentNode && "sourceIndex" in node1.parentNode) {
    var isElement1 = node1.nodeType == goog.dom.NodeType.ELEMENT;
    var isElement2 = node2.nodeType == goog.dom.NodeType.ELEMENT;
    if(isElement1 && isElement2) {
      return node1.sourceIndex - node2.sourceIndex
    }else {
      var parent1 = node1.parentNode;
      var parent2 = node2.parentNode;
      if(parent1 == parent2) {
        return goog.dom.compareSiblingOrder_(node1, node2)
      }
      if(!isElement1 && goog.dom.contains(parent1, node2)) {
        return-1 * goog.dom.compareParentsDescendantNodeIe_(node1, node2)
      }
      if(!isElement2 && goog.dom.contains(parent2, node1)) {
        return goog.dom.compareParentsDescendantNodeIe_(node2, node1)
      }
      return(isElement1 ? node1.sourceIndex : parent1.sourceIndex) - (isElement2 ? node2.sourceIndex : parent2.sourceIndex)
    }
  }
  var doc = goog.dom.getOwnerDocument(node1);
  var range1, range2;
  range1 = doc.createRange();
  range1.selectNode(node1);
  range1.collapse(true);
  range2 = doc.createRange();
  range2.selectNode(node2);
  range2.collapse(true);
  return range1.compareBoundaryPoints(goog.global["Range"].START_TO_END, range2)
};
goog.dom.compareParentsDescendantNodeIe_ = function(textNode, node) {
  var parent = textNode.parentNode;
  if(parent == node) {
    return-1
  }
  var sibling = node;
  while(sibling.parentNode != parent) {
    sibling = sibling.parentNode
  }
  return goog.dom.compareSiblingOrder_(sibling, textNode)
};
goog.dom.compareSiblingOrder_ = function(node1, node2) {
  var s = node2;
  while(s = s.previousSibling) {
    if(s == node1) {
      return-1
    }
  }
  return 1
};
goog.dom.findCommonAncestor = function(var_args) {
  var i, count = arguments.length;
  if(!count) {
    return null
  }else {
    if(count == 1) {
      return arguments[0]
    }
  }
  var paths = [];
  var minLength = Infinity;
  for(i = 0;i < count;i++) {
    var ancestors = [];
    var node = arguments[i];
    while(node) {
      ancestors.unshift(node);
      node = node.parentNode
    }
    paths.push(ancestors);
    minLength = Math.min(minLength, ancestors.length)
  }
  var output = null;
  for(i = 0;i < minLength;i++) {
    var first = paths[0][i];
    for(var j = 1;j < count;j++) {
      if(first != paths[j][i]) {
        return output
      }
    }
    output = first
  }
  return output
};
goog.dom.getOwnerDocument = function(node) {
  return node.nodeType == goog.dom.NodeType.DOCUMENT ? node : node.ownerDocument || node.document
};
goog.dom.getFrameContentDocument = function(frame) {
  var doc = frame.contentDocument || frame.contentWindow.document;
  return doc
};
goog.dom.getFrameContentWindow = function(frame) {
  return frame.contentWindow || goog.dom.getWindow_(goog.dom.getFrameContentDocument(frame))
};
goog.dom.setTextContent = function(element, text) {
  if("textContent" in element) {
    element.textContent = text
  }else {
    if(element.firstChild && element.firstChild.nodeType == goog.dom.NodeType.TEXT) {
      while(element.lastChild != element.firstChild) {
        element.removeChild(element.lastChild)
      }
      element.firstChild.data = text
    }else {
      goog.dom.removeChildren(element);
      var doc = goog.dom.getOwnerDocument(element);
      element.appendChild(doc.createTextNode(text))
    }
  }
};
goog.dom.getOuterHtml = function(element) {
  if("outerHTML" in element) {
    return element.outerHTML
  }else {
    var doc = goog.dom.getOwnerDocument(element);
    var div = doc.createElement("div");
    div.appendChild(element.cloneNode(true));
    return div.innerHTML
  }
};
goog.dom.findNode = function(root, p) {
  var rv = [];
  var found = goog.dom.findNodes_(root, p, rv, true);
  return found ? rv[0] : undefined
};
goog.dom.findNodes = function(root, p) {
  var rv = [];
  goog.dom.findNodes_(root, p, rv, false);
  return rv
};
goog.dom.findNodes_ = function(root, p, rv, findOne) {
  if(root != null) {
    var child = root.firstChild;
    while(child) {
      if(p(child)) {
        rv.push(child);
        if(findOne) {
          return true
        }
      }
      if(goog.dom.findNodes_(child, p, rv, findOne)) {
        return true
      }
      child = child.nextSibling
    }
  }
  return false
};
goog.dom.TAGS_TO_IGNORE_ = {"SCRIPT":1, "STYLE":1, "HEAD":1, "IFRAME":1, "OBJECT":1};
goog.dom.PREDEFINED_TAG_VALUES_ = {"IMG":" ", "BR":"\n"};
goog.dom.isFocusableTabIndex = function(element) {
  var attrNode = element.getAttributeNode("tabindex");
  if(attrNode && attrNode.specified) {
    var index = element.tabIndex;
    return goog.isNumber(index) && index >= 0 && index < 32768
  }
  return false
};
goog.dom.setFocusableTabIndex = function(element, enable) {
  if(enable) {
    element.tabIndex = 0
  }else {
    element.tabIndex = -1;
    element.removeAttribute("tabIndex")
  }
};
goog.dom.getTextContent = function(node) {
  var textContent;
  if(goog.dom.BrowserFeature.CAN_USE_INNER_TEXT && "innerText" in node) {
    textContent = goog.string.canonicalizeNewlines(node.innerText)
  }else {
    var buf = [];
    goog.dom.getTextContent_(node, buf, true);
    textContent = buf.join("")
  }
  textContent = textContent.replace(/ \xAD /g, " ").replace(/\xAD/g, "");
  textContent = textContent.replace(/\u200B/g, "");
  if(!goog.dom.BrowserFeature.CAN_USE_INNER_TEXT) {
    textContent = textContent.replace(/ +/g, " ")
  }
  if(textContent != " ") {
    textContent = textContent.replace(/^\s*/, "")
  }
  return textContent
};
goog.dom.getRawTextContent = function(node) {
  var buf = [];
  goog.dom.getTextContent_(node, buf, false);
  return buf.join("")
};
goog.dom.getTextContent_ = function(node, buf, normalizeWhitespace) {
  if(node.nodeName in goog.dom.TAGS_TO_IGNORE_) {
  }else {
    if(node.nodeType == goog.dom.NodeType.TEXT) {
      if(normalizeWhitespace) {
        buf.push(String(node.nodeValue).replace(/(\r\n|\r|\n)/g, ""))
      }else {
        buf.push(node.nodeValue)
      }
    }else {
      if(node.nodeName in goog.dom.PREDEFINED_TAG_VALUES_) {
        buf.push(goog.dom.PREDEFINED_TAG_VALUES_[node.nodeName])
      }else {
        var child = node.firstChild;
        while(child) {
          goog.dom.getTextContent_(child, buf, normalizeWhitespace);
          child = child.nextSibling
        }
      }
    }
  }
};
goog.dom.getNodeTextLength = function(node) {
  return goog.dom.getTextContent(node).length
};
goog.dom.getNodeTextOffset = function(node, opt_offsetParent) {
  var root = opt_offsetParent || goog.dom.getOwnerDocument(node).body;
  var buf = [];
  while(node && node != root) {
    var cur = node;
    while(cur = cur.previousSibling) {
      buf.unshift(goog.dom.getTextContent(cur))
    }
    node = node.parentNode
  }
  return goog.string.trimLeft(buf.join("")).replace(/ +/g, " ").length
};
goog.dom.getNodeAtOffset = function(parent, offset, opt_result) {
  var stack = [parent], pos = 0, cur;
  while(stack.length > 0 && pos < offset) {
    cur = stack.pop();
    if(cur.nodeName in goog.dom.TAGS_TO_IGNORE_) {
    }else {
      if(cur.nodeType == goog.dom.NodeType.TEXT) {
        var text = cur.nodeValue.replace(/(\r\n|\r|\n)/g, "").replace(/ +/g, " ");
        pos += text.length
      }else {
        if(cur.nodeName in goog.dom.PREDEFINED_TAG_VALUES_) {
          pos += goog.dom.PREDEFINED_TAG_VALUES_[cur.nodeName].length
        }else {
          for(var i = cur.childNodes.length - 1;i >= 0;i--) {
            stack.push(cur.childNodes[i])
          }
        }
      }
    }
  }
  if(goog.isObject(opt_result)) {
    opt_result.remainder = cur ? cur.nodeValue.length + offset - pos - 1 : 0;
    opt_result.node = cur
  }
  return cur
};
goog.dom.isNodeList = function(val) {
  if(val && typeof val.length == "number") {
    if(goog.isObject(val)) {
      return typeof val.item == "function" || typeof val.item == "string"
    }else {
      if(goog.isFunction(val)) {
        return typeof val.item == "function"
      }
    }
  }
  return false
};
goog.dom.getAncestorByTagNameAndClass = function(element, opt_tag, opt_class) {
  if(!opt_tag && !opt_class) {
    return null
  }
  var tagName = opt_tag ? opt_tag.toUpperCase() : null;
  return goog.dom.getAncestor(element, function(node) {
    return(!tagName || node.nodeName == tagName) && (!opt_class || goog.dom.classes.has(node, opt_class))
  }, true)
};
goog.dom.getAncestorByClass = function(element, className) {
  return goog.dom.getAncestorByTagNameAndClass(element, null, className)
};
goog.dom.getAncestor = function(element, matcher, opt_includeNode, opt_maxSearchSteps) {
  if(!opt_includeNode) {
    element = element.parentNode
  }
  var ignoreSearchSteps = opt_maxSearchSteps == null;
  var steps = 0;
  while(element && (ignoreSearchSteps || steps <= opt_maxSearchSteps)) {
    if(matcher(element)) {
      return element
    }
    element = element.parentNode;
    steps++
  }
  return null
};
goog.dom.getActiveElement = function(doc) {
  try {
    return doc && doc.activeElement
  }catch(e) {
  }
  return null
};
goog.dom.DomHelper = function(opt_document) {
  this.document_ = opt_document || goog.global.document || document
};
goog.dom.DomHelper.prototype.getDomHelper = goog.dom.getDomHelper;
goog.dom.DomHelper.prototype.setDocument = function(document) {
  this.document_ = document
};
goog.dom.DomHelper.prototype.getDocument = function() {
  return this.document_
};
goog.dom.DomHelper.prototype.getElement = function(element) {
  if(goog.isString(element)) {
    return this.document_.getElementById(element)
  }else {
    return element
  }
};
goog.dom.DomHelper.prototype.$ = goog.dom.DomHelper.prototype.getElement;
goog.dom.DomHelper.prototype.getElementsByTagNameAndClass = function(opt_tag, opt_class, opt_el) {
  return goog.dom.getElementsByTagNameAndClass_(this.document_, opt_tag, opt_class, opt_el)
};
goog.dom.DomHelper.prototype.getElementsByClass = function(className, opt_el) {
  var doc = opt_el || this.document_;
  return goog.dom.getElementsByClass(className, doc)
};
goog.dom.DomHelper.prototype.getElementByClass = function(className, opt_el) {
  var doc = opt_el || this.document_;
  return goog.dom.getElementByClass(className, doc)
};
goog.dom.DomHelper.prototype.$$ = goog.dom.DomHelper.prototype.getElementsByTagNameAndClass;
goog.dom.DomHelper.prototype.setProperties = goog.dom.setProperties;
goog.dom.DomHelper.prototype.getViewportSize = function(opt_window) {
  return goog.dom.getViewportSize(opt_window || this.getWindow())
};
goog.dom.DomHelper.prototype.getDocumentHeight = function() {
  return goog.dom.getDocumentHeight_(this.getWindow())
};
goog.dom.Appendable;
goog.dom.DomHelper.prototype.createDom = function(tagName, opt_attributes, var_args) {
  return goog.dom.createDom_(this.document_, arguments)
};
goog.dom.DomHelper.prototype.$dom = goog.dom.DomHelper.prototype.createDom;
goog.dom.DomHelper.prototype.createElement = function(name) {
  return this.document_.createElement(name)
};
goog.dom.DomHelper.prototype.createTextNode = function(content) {
  return this.document_.createTextNode(content)
};
goog.dom.DomHelper.prototype.createTable = function(rows, columns, opt_fillWithNbsp) {
  return goog.dom.createTable_(this.document_, rows, columns, !!opt_fillWithNbsp)
};
goog.dom.DomHelper.prototype.htmlToDocumentFragment = function(htmlString) {
  return goog.dom.htmlToDocumentFragment_(this.document_, htmlString)
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
goog.dom.DomHelper.prototype.getActiveElement = function(opt_doc) {
  return goog.dom.getActiveElement(opt_doc || this.document_)
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
goog.provide("goog.functions");
goog.functions.constant = function(retValue) {
  return function() {
    return retValue
  }
};
goog.functions.FALSE = goog.functions.constant(false);
goog.functions.TRUE = goog.functions.constant(true);
goog.functions.NULL = goog.functions.constant(null);
goog.functions.identity = function(opt_returnValue, var_args) {
  return opt_returnValue
};
goog.functions.error = function(message) {
  return function() {
    throw Error(message);
  }
};
goog.functions.lock = function(f, opt_numArgs) {
  opt_numArgs = opt_numArgs || 0;
  return function() {
    return f.apply(this, Array.prototype.slice.call(arguments, 0, opt_numArgs))
  }
};
goog.functions.withReturnValue = function(f, retValue) {
  return goog.functions.sequence(f, goog.functions.constant(retValue))
};
goog.functions.compose = function(var_args) {
  var functions = arguments;
  var length = functions.length;
  return function() {
    var result;
    if(length) {
      result = functions[length - 1].apply(this, arguments)
    }
    for(var i = length - 2;i >= 0;i--) {
      result = functions[i].call(this, result)
    }
    return result
  }
};
goog.functions.sequence = function(var_args) {
  var functions = arguments;
  var length = functions.length;
  return function() {
    var result;
    for(var i = 0;i < length;i++) {
      result = functions[i].apply(this, arguments)
    }
    return result
  }
};
goog.functions.and = function(var_args) {
  var functions = arguments;
  var length = functions.length;
  return function() {
    for(var i = 0;i < length;i++) {
      if(!functions[i].apply(this, arguments)) {
        return false
      }
    }
    return true
  }
};
goog.functions.or = function(var_args) {
  var functions = arguments;
  var length = functions.length;
  return function() {
    for(var i = 0;i < length;i++) {
      if(functions[i].apply(this, arguments)) {
        return true
      }
    }
    return false
  }
};
goog.functions.not = function(f) {
  return function() {
    return!f.apply(this, arguments)
  }
};
goog.functions.create = function(constructor, var_args) {
  var temp = function() {
  };
  temp.prototype = constructor.prototype;
  var obj = new temp;
  constructor.apply(obj, Array.prototype.slice.call(arguments, 1));
  return obj
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
goog.provide("goog.dom.query");
goog.require("goog.array");
goog.require("goog.dom");
goog.require("goog.functions");
goog.require("goog.string");
goog.require("goog.userAgent");
goog.dom.query = function() {
  var cssCaseBug = goog.userAgent.WEBKIT && goog.dom.getDocument().compatMode == "BackCompat";
  var childNodesName = !!goog.dom.getDocument().firstChild["children"] ? "children" : "childNodes";
  var specials = ">~+";
  var caseSensitive = false;
  var getQueryParts = function(query) {
    if(specials.indexOf(query.slice(-1)) >= 0) {
      query += " * "
    }else {
      query += " "
    }
    var ts = function(s, e) {
      return goog.string.trim(query.slice(s, e))
    };
    var queryParts = [];
    var inBrackets = -1, inParens = -1, inMatchFor = -1, inPseudo = -1, inClass = -1, inId = -1, inTag = -1, lc = "", cc = "", pStart;
    var x = 0, ql = query.length, currentPart = null, cp = null;
    var endTag = function() {
      if(inTag >= 0) {
        var tv = inTag == x ? null : ts(inTag, x);
        if(specials.indexOf(tv) < 0) {
          currentPart.tag = tv
        }else {
          currentPart.oper = tv
        }
        inTag = -1
      }
    };
    var endId = function() {
      if(inId >= 0) {
        currentPart.id = ts(inId, x).replace(/\\/g, "");
        inId = -1
      }
    };
    var endClass = function() {
      if(inClass >= 0) {
        currentPart.classes.push(ts(inClass + 1, x).replace(/\\/g, ""));
        inClass = -1
      }
    };
    var endAll = function() {
      endId();
      endTag();
      endClass()
    };
    var endPart = function() {
      endAll();
      if(inPseudo >= 0) {
        currentPart.pseudos.push({name:ts(inPseudo + 1, x)})
      }
      currentPart.loops = currentPart.pseudos.length || currentPart.attrs.length || currentPart.classes.length;
      currentPart.oquery = currentPart.query = ts(pStart, x);
      currentPart.otag = currentPart.tag = currentPart.oper ? null : currentPart.tag || "*";
      if(currentPart.tag) {
        currentPart.tag = currentPart.tag.toUpperCase()
      }
      if(queryParts.length && queryParts[queryParts.length - 1].oper) {
        currentPart.infixOper = queryParts.pop();
        currentPart.query = currentPart.infixOper.query + " " + currentPart.query
      }
      queryParts.push(currentPart);
      currentPart = null
    };
    for(;lc = cc, cc = query.charAt(x), x < ql;x++) {
      if(lc == "\\") {
        continue
      }
      if(!currentPart) {
        pStart = x;
        currentPart = {query:null, pseudos:[], attrs:[], classes:[], tag:null, oper:null, id:null, getTag:function() {
          return caseSensitive ? this.otag : this.tag
        }};
        inTag = x
      }
      if(inBrackets >= 0) {
        if(cc == "]") {
          if(!cp.attr) {
            cp.attr = ts(inBrackets + 1, x)
          }else {
            cp.matchFor = ts(inMatchFor || inBrackets + 1, x)
          }
          var cmf = cp.matchFor;
          if(cmf) {
            if(cmf.charAt(0) == '"' || cmf.charAt(0) == "'") {
              cp.matchFor = cmf.slice(1, -1)
            }
          }
          currentPart.attrs.push(cp);
          cp = null;
          inBrackets = inMatchFor = -1
        }else {
          if(cc == "=") {
            var addToCc = "|~^$*".indexOf(lc) >= 0 ? lc : "";
            cp.type = addToCc + cc;
            cp.attr = ts(inBrackets + 1, x - addToCc.length);
            inMatchFor = x + 1
          }
        }
      }else {
        if(inParens >= 0) {
          if(cc == ")") {
            if(inPseudo >= 0) {
              cp.value = ts(inParens + 1, x)
            }
            inPseudo = inParens = -1
          }
        }else {
          if(cc == "#") {
            endAll();
            inId = x + 1
          }else {
            if(cc == ".") {
              endAll();
              inClass = x
            }else {
              if(cc == ":") {
                endAll();
                inPseudo = x
              }else {
                if(cc == "[") {
                  endAll();
                  inBrackets = x;
                  cp = {}
                }else {
                  if(cc == "(") {
                    if(inPseudo >= 0) {
                      cp = {name:ts(inPseudo + 1, x), value:null};
                      currentPart.pseudos.push(cp)
                    }
                    inParens = x
                  }else {
                    if(cc == " " && lc != cc) {
                      endPart()
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    return queryParts
  };
  var agree = function(first, second) {
    if(!first) {
      return second
    }
    if(!second) {
      return first
    }
    return function() {
      return first.apply(window, arguments) && second.apply(window, arguments)
    }
  };
  function getArr(i, opt_arr) {
    var r = opt_arr || [];
    if(i) {
      r.push(i)
    }
    return r
  }
  var isElement = function(n) {
    return 1 == n.nodeType
  };
  var blank = "";
  var getAttr = function(elem, attr) {
    if(!elem) {
      return blank
    }
    if(attr == "class") {
      return elem.className || blank
    }
    if(attr == "for") {
      return elem.htmlFor || blank
    }
    if(attr == "style") {
      return elem.style.cssText || blank
    }
    return(caseSensitive ? elem.getAttribute(attr) : elem.getAttribute(attr, 2)) || blank
  };
  var attrs = {"*=":function(attr, value) {
    return function(elem) {
      return getAttr(elem, attr).indexOf(value) >= 0
    }
  }, "^=":function(attr, value) {
    return function(elem) {
      return getAttr(elem, attr).indexOf(value) == 0
    }
  }, "$=":function(attr, value) {
    var tval = " " + value;
    return function(elem) {
      var ea = " " + getAttr(elem, attr);
      return ea.lastIndexOf(value) == ea.length - value.length
    }
  }, "~=":function(attr, value) {
    var tval = " " + value + " ";
    return function(elem) {
      var ea = " " + getAttr(elem, attr) + " ";
      return ea.indexOf(tval) >= 0
    }
  }, "|=":function(attr, value) {
    value = " " + value;
    return function(elem) {
      var ea = " " + getAttr(elem, attr);
      return ea == value || ea.indexOf(value + "-") == 0
    }
  }, "=":function(attr, value) {
    return function(elem) {
      return getAttr(elem, attr) == value
    }
  }};
  var noNextElementSibling = typeof goog.dom.getDocument().firstChild.nextElementSibling == "undefined";
  var nSibling = !noNextElementSibling ? "nextElementSibling" : "nextSibling";
  var pSibling = !noNextElementSibling ? "previousElementSibling" : "previousSibling";
  var simpleNodeTest = noNextElementSibling ? isElement : goog.functions.TRUE;
  var _lookLeft = function(node) {
    while(node = node[pSibling]) {
      if(simpleNodeTest(node)) {
        return false
      }
    }
    return true
  };
  var _lookRight = function(node) {
    while(node = node[nSibling]) {
      if(simpleNodeTest(node)) {
        return false
      }
    }
    return true
  };
  var getNodeIndex = function(node) {
    var root = node.parentNode;
    var i = 0, tret = root[childNodesName], ci = node["_i"] || -1, cl = root["_l"] || -1;
    if(!tret) {
      return-1
    }
    var l = tret.length;
    if(cl == l && ci >= 0 && cl >= 0) {
      return ci
    }
    root["_l"] = l;
    ci = -1;
    var te = root["firstElementChild"] || root["firstChild"];
    for(;te;te = te[nSibling]) {
      if(simpleNodeTest(te)) {
        te["_i"] = ++i;
        if(node === te) {
          ci = i
        }
      }
    }
    return ci
  };
  var isEven = function(elem) {
    return!(getNodeIndex(elem) % 2)
  };
  var isOdd = function(elem) {
    return getNodeIndex(elem) % 2
  };
  var pseudos = {"checked":function(name, condition) {
    return function(elem) {
      return elem.checked || elem.attributes["checked"]
    }
  }, "first-child":function() {
    return _lookLeft
  }, "last-child":function() {
    return _lookRight
  }, "only-child":function(name, condition) {
    return function(node) {
      if(!_lookLeft(node)) {
        return false
      }
      if(!_lookRight(node)) {
        return false
      }
      return true
    }
  }, "empty":function(name, condition) {
    return function(elem) {
      var cn = elem.childNodes;
      var cnl = elem.childNodes.length;
      for(var x = cnl - 1;x >= 0;x--) {
        var nt = cn[x].nodeType;
        if(nt === 1 || nt == 3) {
          return false
        }
      }
      return true
    }
  }, "contains":function(name, condition) {
    var cz = condition.charAt(0);
    if(cz == '"' || cz == "'") {
      condition = condition.slice(1, -1)
    }
    return function(elem) {
      return elem.innerHTML.indexOf(condition) >= 0
    }
  }, "not":function(name, condition) {
    var p = getQueryParts(condition)[0];
    var ignores = {el:1};
    if(p.tag != "*") {
      ignores.tag = 1
    }
    if(!p.classes.length) {
      ignores.classes = 1
    }
    var ntf = getSimpleFilterFunc(p, ignores);
    return function(elem) {
      return!ntf(elem)
    }
  }, "nth-child":function(name, condition) {
    function pi(n) {
      return parseInt(n, 10)
    }
    if(condition == "odd") {
      return isOdd
    }else {
      if(condition == "even") {
        return isEven
      }
    }
    if(condition.indexOf("n") != -1) {
      var tparts = condition.split("n", 2);
      var pred = tparts[0] ? tparts[0] == "-" ? -1 : pi(tparts[0]) : 1;
      var idx = tparts[1] ? pi(tparts[1]) : 0;
      var lb = 0, ub = -1;
      if(pred > 0) {
        if(idx < 0) {
          idx = idx % pred && pred + idx % pred
        }else {
          if(idx > 0) {
            if(idx >= pred) {
              lb = idx - idx % pred
            }
            idx = idx % pred
          }
        }
      }else {
        if(pred < 0) {
          pred *= -1;
          if(idx > 0) {
            ub = idx;
            idx = idx % pred
          }
        }
      }
      if(pred > 0) {
        return function(elem) {
          var i = getNodeIndex(elem);
          return i >= lb && (ub < 0 || i <= ub) && i % pred == idx
        }
      }else {
        condition = idx
      }
    }
    var ncount = pi(condition);
    return function(elem) {
      return getNodeIndex(elem) == ncount
    }
  }};
  var defaultGetter = goog.userAgent.IE ? function(cond) {
    var clc = cond.toLowerCase();
    if(clc == "class") {
      cond = "className"
    }
    return function(elem) {
      return caseSensitive ? elem.getAttribute(cond) : elem[cond] || elem[clc]
    }
  } : function(cond) {
    return function(elem) {
      return elem && elem.getAttribute && elem.hasAttribute(cond)
    }
  };
  var getSimpleFilterFunc = function(query, ignores) {
    if(!query) {
      return goog.functions.TRUE
    }
    ignores = ignores || {};
    var ff = null;
    if(!ignores.el) {
      ff = agree(ff, isElement)
    }
    if(!ignores.tag) {
      if(query.tag != "*") {
        ff = agree(ff, function(elem) {
          return elem && elem.tagName == query.getTag()
        })
      }
    }
    if(!ignores.classes) {
      goog.array.forEach(query.classes, function(cname, idx, arr) {
        var re = new RegExp("(?:^|\\s)" + cname + "(?:\\s|$)");
        ff = agree(ff, function(elem) {
          return re.test(elem.className)
        });
        ff.count = idx
      })
    }
    if(!ignores.pseudos) {
      goog.array.forEach(query.pseudos, function(pseudo) {
        var pn = pseudo.name;
        if(pseudos[pn]) {
          ff = agree(ff, pseudos[pn](pn, pseudo.value))
        }
      })
    }
    if(!ignores.attrs) {
      goog.array.forEach(query.attrs, function(attr) {
        var matcher;
        var a = attr.attr;
        if(attr.type && attrs[attr.type]) {
          matcher = attrs[attr.type](a, attr.matchFor)
        }else {
          if(a.length) {
            matcher = defaultGetter(a)
          }
        }
        if(matcher) {
          ff = agree(ff, matcher)
        }
      })
    }
    if(!ignores.id) {
      if(query.id) {
        ff = agree(ff, function(elem) {
          return!!elem && elem.id == query.id
        })
      }
    }
    if(!ff) {
      if(!("default" in ignores)) {
        ff = goog.functions.TRUE
      }
    }
    return ff
  };
  var nextSiblingIterator = function(filterFunc) {
    return function(node, ret, bag) {
      while(node = node[nSibling]) {
        if(noNextElementSibling && !isElement(node)) {
          continue
        }
        if((!bag || _isUnique(node, bag)) && filterFunc(node)) {
          ret.push(node)
        }
        break
      }
      return ret
    }
  };
  var nextSiblingsIterator = function(filterFunc) {
    return function(root, ret, bag) {
      var te = root[nSibling];
      while(te) {
        if(simpleNodeTest(te)) {
          if(bag && !_isUnique(te, bag)) {
            break
          }
          if(filterFunc(te)) {
            ret.push(te)
          }
        }
        te = te[nSibling]
      }
      return ret
    }
  };
  var _childElements = function(filterFunc) {
    filterFunc = filterFunc || goog.functions.TRUE;
    return function(root, ret, bag) {
      var te, x = 0, tret = root[childNodesName];
      while(te = tret[x++]) {
        if(simpleNodeTest(te) && (!bag || _isUnique(te, bag)) && filterFunc(te, x)) {
          ret.push(te)
        }
      }
      return ret
    }
  };
  var _isDescendant = function(node, root) {
    var pn = node.parentNode;
    while(pn) {
      if(pn == root) {
        break
      }
      pn = pn.parentNode
    }
    return!!pn
  };
  var _getElementsFuncCache = {};
  var getElementsFunc = function(query) {
    var retFunc = _getElementsFuncCache[query.query];
    if(retFunc) {
      return retFunc
    }
    var io = query.infixOper;
    var oper = io ? io.oper : "";
    var filterFunc = getSimpleFilterFunc(query, {el:1});
    var qt = query.tag;
    var wildcardTag = "*" == qt;
    var ecs = goog.dom.getDocument()["getElementsByClassName"];
    if(!oper) {
      if(query.id) {
        filterFunc = !query.loops && wildcardTag ? goog.functions.TRUE : getSimpleFilterFunc(query, {el:1, id:1});
        retFunc = function(root, arr) {
          var te = goog.dom.getDomHelper(root).getElement(query.id);
          if(!te || !filterFunc(te)) {
            return
          }
          if(9 == root.nodeType) {
            return getArr(te, arr)
          }else {
            if(_isDescendant(te, root)) {
              return getArr(te, arr)
            }
          }
        }
      }else {
        if(ecs && /\{\s*\[native code\]\s*\}/.test(String(ecs)) && query.classes.length && !cssCaseBug) {
          filterFunc = getSimpleFilterFunc(query, {el:1, classes:1, id:1});
          var classesString = query.classes.join(" ");
          retFunc = function(root, arr) {
            var ret = getArr(0, arr), te, x = 0;
            var tret = root.getElementsByClassName(classesString);
            while(te = tret[x++]) {
              if(filterFunc(te, root)) {
                ret.push(te)
              }
            }
            return ret
          }
        }else {
          if(!wildcardTag && !query.loops) {
            retFunc = function(root, arr) {
              var ret = getArr(0, arr), te, x = 0;
              var tret = root.getElementsByTagName(query.getTag());
              while(te = tret[x++]) {
                ret.push(te)
              }
              return ret
            }
          }else {
            filterFunc = getSimpleFilterFunc(query, {el:1, tag:1, id:1});
            retFunc = function(root, arr) {
              var ret = getArr(0, arr), te, x = 0;
              var tret = root.getElementsByTagName(query.getTag());
              while(te = tret[x++]) {
                if(filterFunc(te, root)) {
                  ret.push(te)
                }
              }
              return ret
            }
          }
        }
      }
    }else {
      var skipFilters = {el:1};
      if(wildcardTag) {
        skipFilters.tag = 1
      }
      filterFunc = getSimpleFilterFunc(query, skipFilters);
      if("+" == oper) {
        retFunc = nextSiblingIterator(filterFunc)
      }else {
        if("~" == oper) {
          retFunc = nextSiblingsIterator(filterFunc)
        }else {
          if(">" == oper) {
            retFunc = _childElements(filterFunc)
          }
        }
      }
    }
    return _getElementsFuncCache[query.query] = retFunc
  };
  var filterDown = function(root, queryParts) {
    var candidates = getArr(root), qp, x, te, qpl = queryParts.length, bag, ret;
    for(var i = 0;i < qpl;i++) {
      ret = [];
      qp = queryParts[i];
      x = candidates.length - 1;
      if(x > 0) {
        bag = {};
        ret.nozip = true
      }
      var gef = getElementsFunc(qp);
      for(var j = 0;te = candidates[j];j++) {
        gef(te, ret, bag)
      }
      if(!ret.length) {
        break
      }
      candidates = ret
    }
    return ret
  };
  var _queryFuncCacheDOM = {}, _queryFuncCacheQSA = {};
  var getStepQueryFunc = function(query) {
    var qparts = getQueryParts(goog.string.trim(query));
    if(qparts.length == 1) {
      var tef = getElementsFunc(qparts[0]);
      return function(root) {
        var r = tef(root, []);
        if(r) {
          r.nozip = true
        }
        return r
      }
    }
    return function(root) {
      return filterDown(root, qparts)
    }
  };
  var qsa = "querySelectorAll";
  var qsaAvail = !!goog.dom.getDocument()[qsa] && (!goog.userAgent.WEBKIT || goog.userAgent.isVersion("526"));
  var getQueryFunc = function(query, opt_forceDOM) {
    if(qsaAvail) {
      var qsaCached = _queryFuncCacheQSA[query];
      if(qsaCached && !opt_forceDOM) {
        return qsaCached
      }
    }
    var domCached = _queryFuncCacheDOM[query];
    if(domCached) {
      return domCached
    }
    var qcz = query.charAt(0);
    var nospace = -1 == query.indexOf(" ");
    if(query.indexOf("#") >= 0 && nospace) {
      opt_forceDOM = true
    }
    var useQSA = qsaAvail && !opt_forceDOM && specials.indexOf(qcz) == -1 && (!goog.userAgent.IE || query.indexOf(":") == -1) && !(cssCaseBug && query.indexOf(".") >= 0) && query.indexOf(":contains") == -1 && query.indexOf("|=") == -1;
    if(useQSA) {
      var tq = specials.indexOf(query.charAt(query.length - 1)) >= 0 ? query + " *" : query;
      return _queryFuncCacheQSA[query] = function(root) {
        try {
          if(!(9 == root.nodeType || nospace)) {
            throw"";
          }
          var r = root[qsa](tq);
          if(goog.userAgent.IE) {
            r.commentStrip = true
          }else {
            r.nozip = true
          }
          return r
        }catch(e) {
          return getQueryFunc(query, true)(root)
        }
      }
    }else {
      var parts = query.split(/\s*,\s*/);
      return _queryFuncCacheDOM[query] = parts.length < 2 ? getStepQueryFunc(query) : function(root) {
        var pindex = 0, ret = [], tp;
        while(tp = parts[pindex++]) {
          ret = ret.concat(getStepQueryFunc(tp)(root))
        }
        return ret
      }
    }
  };
  var _zipIdx = 0;
  var _nodeUID = goog.userAgent.IE ? function(node) {
    if(caseSensitive) {
      return node.getAttribute("_uid") || node.setAttribute("_uid", ++_zipIdx) || _zipIdx
    }else {
      return node.uniqueID
    }
  } : function(node) {
    return node["_uid"] || (node["_uid"] = ++_zipIdx)
  };
  var _isUnique = function(node, bag) {
    if(!bag) {
      return 1
    }
    var id = _nodeUID(node);
    if(!bag[id]) {
      return bag[id] = 1
    }
    return 0
  };
  var _zipIdxName = "_zipIdx";
  var _zip = function(arr) {
    if(arr && arr.nozip) {
      return arr
    }
    var ret = [];
    if(!arr || !arr.length) {
      return ret
    }
    if(arr[0]) {
      ret.push(arr[0])
    }
    if(arr.length < 2) {
      return ret
    }
    _zipIdx++;
    if(goog.userAgent.IE && caseSensitive) {
      var szidx = _zipIdx + "";
      arr[0].setAttribute(_zipIdxName, szidx);
      for(var x = 1, te;te = arr[x];x++) {
        if(arr[x].getAttribute(_zipIdxName) != szidx) {
          ret.push(te)
        }
        te.setAttribute(_zipIdxName, szidx)
      }
    }else {
      if(goog.userAgent.IE && arr.commentStrip) {
        try {
          for(var x = 1, te;te = arr[x];x++) {
            if(isElement(te)) {
              ret.push(te)
            }
          }
        }catch(e) {
        }
      }else {
        if(arr[0]) {
          arr[0][_zipIdxName] = _zipIdx
        }
        for(var x = 1, te;te = arr[x];x++) {
          if(arr[x][_zipIdxName] != _zipIdx) {
            ret.push(te)
          }
          te[_zipIdxName] = _zipIdx
        }
      }
    }
    return ret
  };
  var query = function(query, root) {
    if(!query) {
      return[]
    }
    if(query.constructor == Array) {
      return query
    }
    if(!goog.isString(query)) {
      return[query]
    }
    if(goog.isString(root)) {
      root = goog.dom.getElement(root);
      if(!root) {
        return[]
      }
    }
    root = root || goog.dom.getDocument();
    var od = root.ownerDocument || root.documentElement;
    caseSensitive = root.contentType && root.contentType == "application/xml" || goog.userAgent.OPERA && (root.doctype || od.toString() == "[object XMLDocument]") || !!od && (goog.userAgent.IE ? od.xml : root.xmlVersion || od.xmlVersion);
    var r = getQueryFunc(query)(root);
    if(r && r.nozip) {
      return r
    }
    return _zip(r)
  };
  query.pseudos = pseudos;
  return query
}();
goog.exportSymbol("goog.dom.query", goog.dom.query);
goog.exportSymbol("goog.dom.query.pseudos", goog.dom.query.pseudos);
goog.provide("goog.debug.EntryPointMonitor");
goog.provide("goog.debug.entryPointRegistry");
goog.require("goog.asserts");
goog.debug.EntryPointMonitor = function() {
};
goog.debug.EntryPointMonitor.prototype.wrap;
goog.debug.EntryPointMonitor.prototype.unwrap;
goog.debug.entryPointRegistry.refList_ = [];
goog.debug.entryPointRegistry.monitors_ = [];
goog.debug.entryPointRegistry.monitorsMayExist_ = false;
goog.debug.entryPointRegistry.register = function(callback) {
  goog.debug.entryPointRegistry.refList_[goog.debug.entryPointRegistry.refList_.length] = callback;
  if(goog.debug.entryPointRegistry.monitorsMayExist_) {
    var monitors = goog.debug.entryPointRegistry.monitors_;
    for(var i = 0;i < monitors.length;i++) {
      callback(goog.bind(monitors[i].wrap, monitors[i]))
    }
  }
};
goog.debug.entryPointRegistry.monitorAll = function(monitor) {
  goog.debug.entryPointRegistry.monitorsMayExist_ = true;
  var transformer = goog.bind(monitor.wrap, monitor);
  for(var i = 0;i < goog.debug.entryPointRegistry.refList_.length;i++) {
    goog.debug.entryPointRegistry.refList_[i](transformer)
  }
  goog.debug.entryPointRegistry.monitors_.push(monitor)
};
goog.debug.entryPointRegistry.unmonitorAllIfPossible = function(monitor) {
  var monitors = goog.debug.entryPointRegistry.monitors_;
  goog.asserts.assert(monitor == monitors[monitors.length - 1], "Only the most recent monitor can be unwrapped.");
  var transformer = goog.bind(monitor.unwrap, monitor);
  for(var i = 0;i < goog.debug.entryPointRegistry.refList_.length;i++) {
    goog.debug.entryPointRegistry.refList_[i](transformer)
  }
  monitors.length--
};
goog.provide("goog.debug.errorHandlerWeakDep");
goog.debug.errorHandlerWeakDep = {protectEntryPoint:function(fn, opt_tracers) {
  return fn
}};
goog.provide("goog.events.BrowserFeature");
goog.require("goog.userAgent");
goog.events.BrowserFeature = {HAS_W3C_BUTTON:!goog.userAgent.IE || goog.userAgent.isDocumentMode(9), HAS_W3C_EVENT_SUPPORT:!goog.userAgent.IE || goog.userAgent.isDocumentMode(9), SET_KEY_CODE_TO_PREVENT_DEFAULT:goog.userAgent.IE && !goog.userAgent.isVersion("9"), HAS_NAVIGATOR_ONLINE_PROPERTY:!goog.userAgent.WEBKIT || goog.userAgent.isVersion("528"), HAS_HTML5_NETWORK_EVENT_SUPPORT:goog.userAgent.GECKO && goog.userAgent.isVersion("1.9b") || goog.userAgent.IE && goog.userAgent.isVersion("8") || goog.userAgent.OPERA && 
goog.userAgent.isVersion("9.5") || goog.userAgent.WEBKIT && goog.userAgent.isVersion("528"), HTML5_NETWORK_EVENTS_FIRE_ON_BODY:goog.userAgent.GECKO && !goog.userAgent.isVersion("8") || goog.userAgent.IE && !goog.userAgent.isVersion("9")};
goog.provide("goog.disposable.IDisposable");
goog.disposable.IDisposable = function() {
};
goog.disposable.IDisposable.prototype.dispose;
goog.disposable.IDisposable.prototype.isDisposed;
goog.provide("goog.Disposable");
goog.provide("goog.dispose");
goog.require("goog.disposable.IDisposable");
goog.Disposable = function() {
  if(goog.Disposable.MONITORING_MODE != goog.Disposable.MonitoringMode.OFF) {
    this.creationStack = (new Error).stack;
    goog.Disposable.instances_[goog.getUid(this)] = this
  }
};
goog.Disposable.MonitoringMode = {OFF:0, PERMANENT:1, INTERACTIVE:2};
goog.Disposable.MONITORING_MODE = 0;
goog.Disposable.instances_ = {};
goog.Disposable.getUndisposedObjects = function() {
  var ret = [];
  for(var id in goog.Disposable.instances_) {
    if(goog.Disposable.instances_.hasOwnProperty(id)) {
      ret.push(goog.Disposable.instances_[Number(id)])
    }
  }
  return ret
};
goog.Disposable.clearUndisposedObjects = function() {
  goog.Disposable.instances_ = {}
};
goog.Disposable.prototype.disposed_ = false;
goog.Disposable.prototype.dependentDisposables_;
goog.Disposable.prototype.onDisposeCallbacks_;
goog.Disposable.prototype.creationStack;
goog.Disposable.prototype.isDisposed = function() {
  return this.disposed_
};
goog.Disposable.prototype.getDisposed = goog.Disposable.prototype.isDisposed;
goog.Disposable.prototype.dispose = function() {
  if(!this.disposed_) {
    this.disposed_ = true;
    this.disposeInternal();
    if(goog.Disposable.MONITORING_MODE != goog.Disposable.MonitoringMode.OFF) {
      var uid = goog.getUid(this);
      if(goog.Disposable.MONITORING_MODE == goog.Disposable.MonitoringMode.PERMANENT && !goog.Disposable.instances_.hasOwnProperty(uid)) {
        throw Error(this + " did not call the goog.Disposable base " + "constructor or was disposed of after a clearUndisposedObjects " + "call");
      }
      delete goog.Disposable.instances_[uid]
    }
  }
};
goog.Disposable.prototype.registerDisposable = function(disposable) {
  if(!this.dependentDisposables_) {
    this.dependentDisposables_ = []
  }
  this.dependentDisposables_.push(disposable)
};
goog.Disposable.prototype.addOnDisposeCallback = function(callback, opt_scope) {
  if(!this.onDisposeCallbacks_) {
    this.onDisposeCallbacks_ = []
  }
  this.onDisposeCallbacks_.push(goog.bind(callback, opt_scope))
};
goog.Disposable.prototype.disposeInternal = function() {
  if(this.dependentDisposables_) {
    goog.disposeAll.apply(null, this.dependentDisposables_)
  }
  if(this.onDisposeCallbacks_) {
    while(this.onDisposeCallbacks_.length) {
      this.onDisposeCallbacks_.shift()()
    }
  }
};
goog.Disposable.isDisposed = function(obj) {
  if(obj && typeof obj.isDisposed == "function") {
    return obj.isDisposed()
  }
  return false
};
goog.dispose = function(obj) {
  if(obj && typeof obj.dispose == "function") {
    obj.dispose()
  }
};
goog.disposeAll = function(var_args) {
  for(var i = 0, len = arguments.length;i < len;++i) {
    var disposable = arguments[i];
    if(goog.isArrayLike(disposable)) {
      goog.disposeAll.apply(null, disposable)
    }else {
      goog.dispose(disposable)
    }
  }
};
goog.provide("goog.events.Event");
goog.require("goog.Disposable");
goog.events.Event = function(type, opt_target) {
  this.type = type;
  this.target = opt_target;
  this.currentTarget = this.target
};
goog.events.Event.prototype.disposeInternal = function() {
};
goog.events.Event.prototype.dispose = function() {
};
goog.events.Event.prototype.propagationStopped_ = false;
goog.events.Event.prototype.defaultPrevented = false;
goog.events.Event.prototype.returnValue_ = true;
goog.events.Event.prototype.stopPropagation = function() {
  this.propagationStopped_ = true
};
goog.events.Event.prototype.preventDefault = function() {
  this.defaultPrevented = true;
  this.returnValue_ = false
};
goog.events.Event.stopPropagation = function(e) {
  e.stopPropagation()
};
goog.events.Event.preventDefault = function(e) {
  e.preventDefault()
};
goog.provide("goog.events.EventType");
goog.require("goog.userAgent");
goog.events.EventType = {CLICK:"click", DBLCLICK:"dblclick", MOUSEDOWN:"mousedown", MOUSEUP:"mouseup", MOUSEOVER:"mouseover", MOUSEOUT:"mouseout", MOUSEMOVE:"mousemove", SELECTSTART:"selectstart", KEYPRESS:"keypress", KEYDOWN:"keydown", KEYUP:"keyup", BLUR:"blur", FOCUS:"focus", DEACTIVATE:"deactivate", FOCUSIN:goog.userAgent.IE ? "focusin" : "DOMFocusIn", FOCUSOUT:goog.userAgent.IE ? "focusout" : "DOMFocusOut", CHANGE:"change", SELECT:"select", SUBMIT:"submit", INPUT:"input", PROPERTYCHANGE:"propertychange", 
DRAGSTART:"dragstart", DRAGENTER:"dragenter", DRAGOVER:"dragover", DRAGLEAVE:"dragleave", DROP:"drop", TOUCHSTART:"touchstart", TOUCHMOVE:"touchmove", TOUCHEND:"touchend", TOUCHCANCEL:"touchcancel", CONTEXTMENU:"contextmenu", ERROR:"error", HELP:"help", LOAD:"load", LOSECAPTURE:"losecapture", READYSTATECHANGE:"readystatechange", RESIZE:"resize", SCROLL:"scroll", UNLOAD:"unload", HASHCHANGE:"hashchange", PAGEHIDE:"pagehide", PAGESHOW:"pageshow", POPSTATE:"popstate", COPY:"copy", PASTE:"paste", CUT:"cut", 
BEFORECOPY:"beforecopy", BEFORECUT:"beforecut", BEFOREPASTE:"beforepaste", ONLINE:"online", OFFLINE:"offline", MESSAGE:"message", CONNECT:"connect", TRANSITIONEND:goog.userAgent.WEBKIT ? "webkitTransitionEnd" : goog.userAgent.OPERA ? "oTransitionEnd" : "transitionend"};
goog.provide("goog.reflect");
goog.reflect.object = function(type, object) {
  return object
};
goog.reflect.sinkValue = function(x) {
  goog.reflect.sinkValue[" "](x);
  return x
};
goog.reflect.sinkValue[" "] = goog.nullFunction;
goog.reflect.canAccessProperty = function(obj, prop) {
  try {
    goog.reflect.sinkValue(obj[prop]);
    return true
  }catch(e) {
  }
  return false
};
goog.provide("goog.events.BrowserEvent");
goog.provide("goog.events.BrowserEvent.MouseButton");
goog.require("goog.events.BrowserFeature");
goog.require("goog.events.Event");
goog.require("goog.events.EventType");
goog.require("goog.reflect");
goog.require("goog.userAgent");
goog.events.BrowserEvent = function(opt_e, opt_currentTarget) {
  if(opt_e) {
    this.init(opt_e, opt_currentTarget)
  }
};
goog.inherits(goog.events.BrowserEvent, goog.events.Event);
goog.events.BrowserEvent.MouseButton = {LEFT:0, MIDDLE:1, RIGHT:2};
goog.events.BrowserEvent.IEButtonMap = [1, 4, 2];
goog.events.BrowserEvent.prototype.target = null;
goog.events.BrowserEvent.prototype.currentTarget;
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
goog.events.BrowserEvent.prototype.ctrlKey = false;
goog.events.BrowserEvent.prototype.altKey = false;
goog.events.BrowserEvent.prototype.shiftKey = false;
goog.events.BrowserEvent.prototype.metaKey = false;
goog.events.BrowserEvent.prototype.state;
goog.events.BrowserEvent.prototype.platformModifierKey = false;
goog.events.BrowserEvent.prototype.event_ = null;
goog.events.BrowserEvent.prototype.init = function(e, opt_currentTarget) {
  var type = this.type = e.type;
  goog.events.Event.call(this, type);
  this.target = e.target || e.srcElement;
  this.currentTarget = opt_currentTarget;
  var relatedTarget = e.relatedTarget;
  if(relatedTarget) {
    if(goog.userAgent.GECKO) {
      if(!goog.reflect.canAccessProperty(relatedTarget, "nodeName")) {
        relatedTarget = null
      }
    }
  }else {
    if(type == goog.events.EventType.MOUSEOVER) {
      relatedTarget = e.fromElement
    }else {
      if(type == goog.events.EventType.MOUSEOUT) {
        relatedTarget = e.toElement
      }
    }
  }
  this.relatedTarget = relatedTarget;
  this.offsetX = goog.userAgent.WEBKIT || e.offsetX !== undefined ? e.offsetX : e.layerX;
  this.offsetY = goog.userAgent.WEBKIT || e.offsetY !== undefined ? e.offsetY : e.layerY;
  this.clientX = e.clientX !== undefined ? e.clientX : e.pageX;
  this.clientY = e.clientY !== undefined ? e.clientY : e.pageY;
  this.screenX = e.screenX || 0;
  this.screenY = e.screenY || 0;
  this.button = e.button;
  this.keyCode = e.keyCode || 0;
  this.charCode = e.charCode || (type == "keypress" ? e.keyCode : 0);
  this.ctrlKey = e.ctrlKey;
  this.altKey = e.altKey;
  this.shiftKey = e.shiftKey;
  this.metaKey = e.metaKey;
  this.platformModifierKey = goog.userAgent.MAC ? e.metaKey : e.ctrlKey;
  this.state = e.state;
  this.event_ = e;
  if(e.defaultPrevented) {
    this.preventDefault()
  }
  delete this.propagationStopped_
};
goog.events.BrowserEvent.prototype.isButton = function(button) {
  if(!goog.events.BrowserFeature.HAS_W3C_BUTTON) {
    if(this.type == "click") {
      return button == goog.events.BrowserEvent.MouseButton.LEFT
    }else {
      return!!(this.event_.button & goog.events.BrowserEvent.IEButtonMap[button])
    }
  }else {
    return this.event_.button == button
  }
};
goog.events.BrowserEvent.prototype.isMouseActionButton = function() {
  return this.isButton(goog.events.BrowserEvent.MouseButton.LEFT) && !(goog.userAgent.WEBKIT && goog.userAgent.MAC && this.ctrlKey)
};
goog.events.BrowserEvent.prototype.stopPropagation = function() {
  goog.events.BrowserEvent.superClass_.stopPropagation.call(this);
  if(this.event_.stopPropagation) {
    this.event_.stopPropagation()
  }else {
    this.event_.cancelBubble = true
  }
};
goog.events.BrowserEvent.prototype.preventDefault = function() {
  goog.events.BrowserEvent.superClass_.preventDefault.call(this);
  var be = this.event_;
  if(!be.preventDefault) {
    be.returnValue = false;
    if(goog.events.BrowserFeature.SET_KEY_CODE_TO_PREVENT_DEFAULT) {
      try {
        var VK_F1 = 112;
        var VK_F12 = 123;
        if(be.ctrlKey || be.keyCode >= VK_F1 && be.keyCode <= VK_F12) {
          be.keyCode = -1
        }
      }catch(ex) {
      }
    }
  }else {
    be.preventDefault()
  }
};
goog.events.BrowserEvent.prototype.getBrowserEvent = function() {
  return this.event_
};
goog.events.BrowserEvent.prototype.disposeInternal = function() {
};
goog.provide("goog.events.EventWrapper");
goog.events.EventWrapper = function() {
};
goog.events.EventWrapper.prototype.listen = function(src, listener, opt_capt, opt_scope, opt_eventHandler) {
};
goog.events.EventWrapper.prototype.unlisten = function(src, listener, opt_capt, opt_scope, opt_eventHandler) {
};
goog.provide("goog.events.Listener");
goog.events.Listener = function() {
  if(goog.events.Listener.ENABLE_MONITORING) {
    this.creationStack = (new Error).stack
  }
};
goog.events.Listener.counter_ = 0;
goog.events.Listener.ENABLE_MONITORING = false;
goog.events.Listener.prototype.isFunctionListener_;
goog.events.Listener.prototype.listener;
goog.events.Listener.prototype.proxy;
goog.events.Listener.prototype.src;
goog.events.Listener.prototype.type;
goog.events.Listener.prototype.capture;
goog.events.Listener.prototype.handler;
goog.events.Listener.prototype.key = 0;
goog.events.Listener.prototype.removed = false;
goog.events.Listener.prototype.callOnce = false;
goog.events.Listener.prototype.creationStack;
goog.events.Listener.prototype.init = function(listener, proxy, src, type, capture, opt_handler) {
  if(goog.isFunction(listener)) {
    this.isFunctionListener_ = true
  }else {
    if(listener && listener.handleEvent && goog.isFunction(listener.handleEvent)) {
      this.isFunctionListener_ = false
    }else {
      throw Error("Invalid listener argument");
    }
  }
  this.listener = listener;
  this.proxy = proxy;
  this.src = src;
  this.type = type;
  this.capture = !!capture;
  this.handler = opt_handler;
  this.callOnce = false;
  this.key = ++goog.events.Listener.counter_;
  this.removed = false
};
goog.events.Listener.prototype.handleEvent = function(eventObject) {
  if(this.isFunctionListener_) {
    return this.listener.call(this.handler || this.src, eventObject)
  }
  return this.listener.handleEvent.call(this.listener, eventObject)
};
goog.provide("goog.events");
goog.require("goog.array");
goog.require("goog.debug.entryPointRegistry");
goog.require("goog.debug.errorHandlerWeakDep");
goog.require("goog.events.BrowserEvent");
goog.require("goog.events.BrowserFeature");
goog.require("goog.events.Event");
goog.require("goog.events.EventWrapper");
goog.require("goog.events.Listener");
goog.require("goog.object");
goog.require("goog.userAgent");
goog.events.listeners_ = {};
goog.events.listenerTree_ = {};
goog.events.sources_ = {};
goog.events.onString_ = "on";
goog.events.onStringMap_ = {};
goog.events.keySeparator_ = "_";
goog.events.listen = function(src, type, listener, opt_capt, opt_handler) {
  if(!type) {
    throw Error("Invalid event type");
  }else {
    if(goog.isArray(type)) {
      for(var i = 0;i < type.length;i++) {
        goog.events.listen(src, type[i], listener, opt_capt, opt_handler)
      }
      return null
    }else {
      var capture = !!opt_capt;
      var map = goog.events.listenerTree_;
      if(!(type in map)) {
        map[type] = {count_:0, remaining_:0}
      }
      map = map[type];
      if(!(capture in map)) {
        map[capture] = {count_:0, remaining_:0};
        map.count_++
      }
      map = map[capture];
      var srcUid = goog.getUid(src);
      var listenerArray, listenerObj;
      map.remaining_++;
      if(!map[srcUid]) {
        listenerArray = map[srcUid] = [];
        map.count_++
      }else {
        listenerArray = map[srcUid];
        for(var i = 0;i < listenerArray.length;i++) {
          listenerObj = listenerArray[i];
          if(listenerObj.listener == listener && listenerObj.handler == opt_handler) {
            if(listenerObj.removed) {
              break
            }
            return listenerArray[i].key
          }
        }
      }
      var proxy = goog.events.getProxy();
      proxy.src = src;
      listenerObj = new goog.events.Listener;
      listenerObj.init(listener, proxy, src, type, capture, opt_handler);
      var key = listenerObj.key;
      proxy.key = key;
      listenerArray.push(listenerObj);
      goog.events.listeners_[key] = listenerObj;
      if(!goog.events.sources_[srcUid]) {
        goog.events.sources_[srcUid] = []
      }
      goog.events.sources_[srcUid].push(listenerObj);
      if(src.addEventListener) {
        if(src == goog.global || !src.customEvent_) {
          src.addEventListener(type, proxy, capture)
        }
      }else {
        src.attachEvent(goog.events.getOnString_(type), proxy)
      }
      return key
    }
  }
};
goog.events.getProxy = function() {
  var proxyCallbackFunction = goog.events.handleBrowserEvent_;
  var f = goog.events.BrowserFeature.HAS_W3C_EVENT_SUPPORT ? function(eventObject) {
    return proxyCallbackFunction.call(f.src, f.key, eventObject)
  } : function(eventObject) {
    var v = proxyCallbackFunction.call(f.src, f.key, eventObject);
    if(!v) {
      return v
    }
  };
  return f
};
goog.events.listenOnce = function(src, type, listener, opt_capt, opt_handler) {
  if(goog.isArray(type)) {
    for(var i = 0;i < type.length;i++) {
      goog.events.listenOnce(src, type[i], listener, opt_capt, opt_handler)
    }
    return null
  }
  var key = goog.events.listen(src, type, listener, opt_capt, opt_handler);
  var listenerObj = goog.events.listeners_[key];
  listenerObj.callOnce = true;
  return key
};
goog.events.listenWithWrapper = function(src, wrapper, listener, opt_capt, opt_handler) {
  wrapper.listen(src, listener, opt_capt, opt_handler)
};
goog.events.unlisten = function(src, type, listener, opt_capt, opt_handler) {
  if(goog.isArray(type)) {
    for(var i = 0;i < type.length;i++) {
      goog.events.unlisten(src, type[i], listener, opt_capt, opt_handler)
    }
    return null
  }
  var capture = !!opt_capt;
  var listenerArray = goog.events.getListeners_(src, type, capture);
  if(!listenerArray) {
    return false
  }
  for(var i = 0;i < listenerArray.length;i++) {
    if(listenerArray[i].listener == listener && listenerArray[i].capture == capture && listenerArray[i].handler == opt_handler) {
      return goog.events.unlistenByKey(listenerArray[i].key)
    }
  }
  return false
};
goog.events.unlistenByKey = function(key) {
  if(!goog.events.listeners_[key]) {
    return false
  }
  var listener = goog.events.listeners_[key];
  if(listener.removed) {
    return false
  }
  var src = listener.src;
  var type = listener.type;
  var proxy = listener.proxy;
  var capture = listener.capture;
  if(src.removeEventListener) {
    if(src == goog.global || !src.customEvent_) {
      src.removeEventListener(type, proxy, capture)
    }
  }else {
    if(src.detachEvent) {
      src.detachEvent(goog.events.getOnString_(type), proxy)
    }
  }
  var srcUid = goog.getUid(src);
  if(goog.events.sources_[srcUid]) {
    var sourcesArray = goog.events.sources_[srcUid];
    goog.array.remove(sourcesArray, listener);
    if(sourcesArray.length == 0) {
      delete goog.events.sources_[srcUid]
    }
  }
  listener.removed = true;
  var listenerArray = goog.events.listenerTree_[type][capture][srcUid];
  if(listenerArray) {
    listenerArray.needsCleanup_ = true;
    goog.events.cleanUp_(type, capture, srcUid, listenerArray)
  }
  delete goog.events.listeners_[key];
  return true
};
goog.events.unlistenWithWrapper = function(src, wrapper, listener, opt_capt, opt_handler) {
  wrapper.unlisten(src, listener, opt_capt, opt_handler)
};
goog.events.cleanUp_ = function(type, capture, srcUid, listenerArray) {
  if(!listenerArray.locked_) {
    if(listenerArray.needsCleanup_) {
      for(var oldIndex = 0, newIndex = 0;oldIndex < listenerArray.length;oldIndex++) {
        if(listenerArray[oldIndex].removed) {
          var proxy = listenerArray[oldIndex].proxy;
          proxy.src = null;
          continue
        }
        if(oldIndex != newIndex) {
          listenerArray[newIndex] = listenerArray[oldIndex]
        }
        newIndex++
      }
      listenerArray.length = newIndex;
      listenerArray.needsCleanup_ = false;
      if(newIndex == 0) {
        delete goog.events.listenerTree_[type][capture][srcUid];
        goog.events.listenerTree_[type][capture].count_--;
        if(goog.events.listenerTree_[type][capture].count_ == 0) {
          delete goog.events.listenerTree_[type][capture];
          goog.events.listenerTree_[type].count_--
        }
        if(goog.events.listenerTree_[type].count_ == 0) {
          delete goog.events.listenerTree_[type]
        }
      }
    }
  }
};
goog.events.removeAll = function(opt_obj, opt_type, opt_capt) {
  var count = 0;
  var noObj = opt_obj == null;
  var noType = opt_type == null;
  var noCapt = opt_capt == null;
  opt_capt = !!opt_capt;
  if(!noObj) {
    var srcUid = goog.getUid(opt_obj);
    if(goog.events.sources_[srcUid]) {
      var sourcesArray = goog.events.sources_[srcUid];
      for(var i = sourcesArray.length - 1;i >= 0;i--) {
        var listener = sourcesArray[i];
        if((noType || opt_type == listener.type) && (noCapt || opt_capt == listener.capture)) {
          goog.events.unlistenByKey(listener.key);
          count++
        }
      }
    }
  }else {
    goog.object.forEach(goog.events.sources_, function(listeners) {
      for(var i = listeners.length - 1;i >= 0;i--) {
        var listener = listeners[i];
        if((noType || opt_type == listener.type) && (noCapt || opt_capt == listener.capture)) {
          goog.events.unlistenByKey(listener.key);
          count++
        }
      }
    })
  }
  return count
};
goog.events.getListeners = function(obj, type, capture) {
  return goog.events.getListeners_(obj, type, capture) || []
};
goog.events.getListeners_ = function(obj, type, capture) {
  var map = goog.events.listenerTree_;
  if(type in map) {
    map = map[type];
    if(capture in map) {
      map = map[capture];
      var objUid = goog.getUid(obj);
      if(map[objUid]) {
        return map[objUid]
      }
    }
  }
  return null
};
goog.events.getListener = function(src, type, listener, opt_capt, opt_handler) {
  var capture = !!opt_capt;
  var listenerArray = goog.events.getListeners_(src, type, capture);
  if(listenerArray) {
    for(var i = 0;i < listenerArray.length;i++) {
      if(!listenerArray[i].removed && listenerArray[i].listener == listener && listenerArray[i].capture == capture && listenerArray[i].handler == opt_handler) {
        return listenerArray[i]
      }
    }
  }
  return null
};
goog.events.hasListener = function(obj, opt_type, opt_capture) {
  var objUid = goog.getUid(obj);
  var listeners = goog.events.sources_[objUid];
  if(listeners) {
    var hasType = goog.isDef(opt_type);
    var hasCapture = goog.isDef(opt_capture);
    if(hasType && hasCapture) {
      var map = goog.events.listenerTree_[opt_type];
      return!!map && !!map[opt_capture] && objUid in map[opt_capture]
    }else {
      if(!(hasType || hasCapture)) {
        return true
      }else {
        return goog.array.some(listeners, function(listener) {
          return hasType && listener.type == opt_type || hasCapture && listener.capture == opt_capture
        })
      }
    }
  }
  return false
};
goog.events.expose = function(e) {
  var str = [];
  for(var key in e) {
    if(e[key] && e[key].id) {
      str.push(key + " = " + e[key] + " (" + e[key].id + ")")
    }else {
      str.push(key + " = " + e[key])
    }
  }
  return str.join("\n")
};
goog.events.getOnString_ = function(type) {
  if(type in goog.events.onStringMap_) {
    return goog.events.onStringMap_[type]
  }
  return goog.events.onStringMap_[type] = goog.events.onString_ + type
};
goog.events.fireListeners = function(obj, type, capture, eventObject) {
  var map = goog.events.listenerTree_;
  if(type in map) {
    map = map[type];
    if(capture in map) {
      return goog.events.fireListeners_(map[capture], obj, type, capture, eventObject)
    }
  }
  return true
};
goog.events.fireListeners_ = function(map, obj, type, capture, eventObject) {
  var retval = 1;
  var objUid = goog.getUid(obj);
  if(map[objUid]) {
    map.remaining_--;
    var listenerArray = map[objUid];
    if(!listenerArray.locked_) {
      listenerArray.locked_ = 1
    }else {
      listenerArray.locked_++
    }
    try {
      var length = listenerArray.length;
      for(var i = 0;i < length;i++) {
        var listener = listenerArray[i];
        if(listener && !listener.removed) {
          retval &= goog.events.fireListener(listener, eventObject) !== false
        }
      }
    }finally {
      listenerArray.locked_--;
      goog.events.cleanUp_(type, capture, objUid, listenerArray)
    }
  }
  return Boolean(retval)
};
goog.events.fireListener = function(listener, eventObject) {
  if(listener.callOnce) {
    goog.events.unlistenByKey(listener.key)
  }
  return listener.handleEvent(eventObject)
};
goog.events.getTotalListenerCount = function() {
  return goog.object.getCount(goog.events.listeners_)
};
goog.events.dispatchEvent = function(src, e) {
  var type = e.type || e;
  var map = goog.events.listenerTree_;
  if(!(type in map)) {
    return true
  }
  if(goog.isString(e)) {
    e = new goog.events.Event(e, src)
  }else {
    if(!(e instanceof goog.events.Event)) {
      var oldEvent = e;
      e = new goog.events.Event(type, src);
      goog.object.extend(e, oldEvent)
    }else {
      e.target = e.target || src
    }
  }
  var rv = 1, ancestors;
  map = map[type];
  var hasCapture = true in map;
  var targetsMap;
  if(hasCapture) {
    ancestors = [];
    for(var parent = src;parent;parent = parent.getParentEventTarget()) {
      ancestors.push(parent)
    }
    targetsMap = map[true];
    targetsMap.remaining_ = targetsMap.count_;
    for(var i = ancestors.length - 1;!e.propagationStopped_ && i >= 0 && targetsMap.remaining_;i--) {
      e.currentTarget = ancestors[i];
      rv &= goog.events.fireListeners_(targetsMap, ancestors[i], e.type, true, e) && e.returnValue_ != false
    }
  }
  var hasBubble = false in map;
  if(hasBubble) {
    targetsMap = map[false];
    targetsMap.remaining_ = targetsMap.count_;
    if(hasCapture) {
      for(var i = 0;!e.propagationStopped_ && i < ancestors.length && targetsMap.remaining_;i++) {
        e.currentTarget = ancestors[i];
        rv &= goog.events.fireListeners_(targetsMap, ancestors[i], e.type, false, e) && e.returnValue_ != false
      }
    }else {
      for(var current = src;!e.propagationStopped_ && current && targetsMap.remaining_;current = current.getParentEventTarget()) {
        e.currentTarget = current;
        rv &= goog.events.fireListeners_(targetsMap, current, e.type, false, e) && e.returnValue_ != false
      }
    }
  }
  return Boolean(rv)
};
goog.events.protectBrowserEventEntryPoint = function(errorHandler) {
  goog.events.handleBrowserEvent_ = errorHandler.protectEntryPoint(goog.events.handleBrowserEvent_)
};
goog.events.handleBrowserEvent_ = function(key, opt_evt) {
  if(!goog.events.listeners_[key]) {
    return true
  }
  var listener = goog.events.listeners_[key];
  var type = listener.type;
  var map = goog.events.listenerTree_;
  if(!(type in map)) {
    return true
  }
  map = map[type];
  var retval, targetsMap;
  if(!goog.events.BrowserFeature.HAS_W3C_EVENT_SUPPORT) {
    var ieEvent = opt_evt || goog.getObjectByName("window.event");
    var hasCapture = true in map;
    var hasBubble = false in map;
    if(hasCapture) {
      if(goog.events.isMarkedIeEvent_(ieEvent)) {
        return true
      }
      goog.events.markIeEvent_(ieEvent)
    }
    var evt = new goog.events.BrowserEvent;
    evt.init(ieEvent, this);
    retval = true;
    try {
      if(hasCapture) {
        var ancestors = [];
        for(var parent = evt.currentTarget;parent;parent = parent.parentNode) {
          ancestors.push(parent)
        }
        targetsMap = map[true];
        targetsMap.remaining_ = targetsMap.count_;
        for(var i = ancestors.length - 1;!evt.propagationStopped_ && i >= 0 && targetsMap.remaining_;i--) {
          evt.currentTarget = ancestors[i];
          retval &= goog.events.fireListeners_(targetsMap, ancestors[i], type, true, evt)
        }
        if(hasBubble) {
          targetsMap = map[false];
          targetsMap.remaining_ = targetsMap.count_;
          for(var i = 0;!evt.propagationStopped_ && i < ancestors.length && targetsMap.remaining_;i++) {
            evt.currentTarget = ancestors[i];
            retval &= goog.events.fireListeners_(targetsMap, ancestors[i], type, false, evt)
          }
        }
      }else {
        retval = goog.events.fireListener(listener, evt)
      }
    }finally {
      if(ancestors) {
        ancestors.length = 0
      }
    }
    return retval
  }
  var be = new goog.events.BrowserEvent(opt_evt, this);
  retval = goog.events.fireListener(listener, be);
  return retval
};
goog.events.markIeEvent_ = function(e) {
  var useReturnValue = false;
  if(e.keyCode == 0) {
    try {
      e.keyCode = -1;
      return
    }catch(ex) {
      useReturnValue = true
    }
  }
  if(useReturnValue || e.returnValue == undefined) {
    e.returnValue = true
  }
};
goog.events.isMarkedIeEvent_ = function(e) {
  return e.keyCode < 0 || e.returnValue != undefined
};
goog.events.uniqueIdCounter_ = 0;
goog.events.getUniqueId = function(identifier) {
  return identifier + "_" + goog.events.uniqueIdCounter_++
};
goog.debug.entryPointRegistry.register(function(transformer) {
  goog.events.handleBrowserEvent_ = transformer(goog.events.handleBrowserEvent_)
});
goog.provide("goog.events.EventHandler");
goog.require("goog.Disposable");
goog.require("goog.array");
goog.require("goog.events");
goog.require("goog.events.EventWrapper");
goog.events.EventHandler = function(opt_handler) {
  goog.Disposable.call(this);
  this.handler_ = opt_handler;
  this.keys_ = []
};
goog.inherits(goog.events.EventHandler, goog.Disposable);
goog.events.EventHandler.typeArray_ = [];
goog.events.EventHandler.prototype.listen = function(src, type, opt_fn, opt_capture, opt_handler) {
  if(!goog.isArray(type)) {
    goog.events.EventHandler.typeArray_[0] = type;
    type = goog.events.EventHandler.typeArray_
  }
  for(var i = 0;i < type.length;i++) {
    var key = goog.events.listen(src, type[i], opt_fn || this, opt_capture || false, opt_handler || this.handler_ || this);
    this.keys_.push(key)
  }
  return this
};
goog.events.EventHandler.prototype.listenOnce = function(src, type, opt_fn, opt_capture, opt_handler) {
  if(goog.isArray(type)) {
    for(var i = 0;i < type.length;i++) {
      this.listenOnce(src, type[i], opt_fn, opt_capture, opt_handler)
    }
  }else {
    var key = goog.events.listenOnce(src, type, opt_fn || this, opt_capture, opt_handler || this.handler_ || this);
    this.keys_.push(key)
  }
  return this
};
goog.events.EventHandler.prototype.listenWithWrapper = function(src, wrapper, listener, opt_capt, opt_handler) {
  wrapper.listen(src, listener, opt_capt, opt_handler || this.handler_ || this, this);
  return this
};
goog.events.EventHandler.prototype.getListenerCount = function() {
  return this.keys_.length
};
goog.events.EventHandler.prototype.unlisten = function(src, type, opt_fn, opt_capture, opt_handler) {
  if(goog.isArray(type)) {
    for(var i = 0;i < type.length;i++) {
      this.unlisten(src, type[i], opt_fn, opt_capture, opt_handler)
    }
  }else {
    var listener = goog.events.getListener(src, type, opt_fn || this, opt_capture, opt_handler || this.handler_ || this);
    if(listener) {
      var key = listener.key;
      goog.events.unlistenByKey(key);
      goog.array.remove(this.keys_, key)
    }
  }
  return this
};
goog.events.EventHandler.prototype.unlistenWithWrapper = function(src, wrapper, listener, opt_capt, opt_handler) {
  wrapper.unlisten(src, listener, opt_capt, opt_handler || this.handler_ || this, this);
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
goog.events.EventHandler.prototype.handleEvent = function(e) {
  throw Error("EventHandler.handleEvent not implemented");
};
goog.provide("goog.events.EventTarget");
goog.require("goog.Disposable");
goog.require("goog.events");
goog.events.EventTarget = function() {
  goog.Disposable.call(this)
};
goog.inherits(goog.events.EventTarget, goog.Disposable);
goog.events.EventTarget.prototype.customEvent_ = true;
goog.events.EventTarget.prototype.parentEventTarget_ = null;
goog.events.EventTarget.prototype.getParentEventTarget = function() {
  return this.parentEventTarget_
};
goog.events.EventTarget.prototype.setParentEventTarget = function(parent) {
  this.parentEventTarget_ = parent
};
goog.events.EventTarget.prototype.addEventListener = function(type, handler, opt_capture, opt_handlerScope) {
  goog.events.listen(this, type, handler, opt_capture, opt_handlerScope)
};
goog.events.EventTarget.prototype.removeEventListener = function(type, handler, opt_capture, opt_handlerScope) {
  goog.events.unlisten(this, type, handler, opt_capture, opt_handlerScope)
};
goog.events.EventTarget.prototype.dispatchEvent = function(e) {
  return goog.events.dispatchEvent(this, e)
};
goog.events.EventTarget.prototype.disposeInternal = function() {
  goog.events.EventTarget.superClass_.disposeInternal.call(this);
  goog.events.removeAll(this);
  this.parentEventTarget_ = null
};
goog.provide("goog.math.Box");
goog.require("goog.math.Coordinate");
goog.math.Box = function(top, right, bottom, left) {
  this.top = top;
  this.right = right;
  this.bottom = bottom;
  this.left = left
};
goog.math.Box.boundingBox = function(var_args) {
  var box = new goog.math.Box(arguments[0].y, arguments[0].x, arguments[0].y, arguments[0].x);
  for(var i = 1;i < arguments.length;i++) {
    var coord = arguments[i];
    box.top = Math.min(box.top, coord.y);
    box.right = Math.max(box.right, coord.x);
    box.bottom = Math.max(box.bottom, coord.y);
    box.left = Math.min(box.left, coord.x)
  }
  return box
};
goog.math.Box.prototype.clone = function() {
  return new goog.math.Box(this.top, this.right, this.bottom, this.left)
};
if(goog.DEBUG) {
  goog.math.Box.prototype.toString = function() {
    return"(" + this.top + "t, " + this.right + "r, " + this.bottom + "b, " + this.left + "l)"
  }
}
goog.math.Box.prototype.contains = function(other) {
  return goog.math.Box.contains(this, other)
};
goog.math.Box.prototype.expand = function(top, opt_right, opt_bottom, opt_left) {
  if(goog.isObject(top)) {
    this.top -= top.top;
    this.right += top.right;
    this.bottom += top.bottom;
    this.left -= top.left
  }else {
    this.top -= top;
    this.right += opt_right;
    this.bottom += opt_bottom;
    this.left -= opt_left
  }
  return this
};
goog.math.Box.prototype.expandToInclude = function(box) {
  this.left = Math.min(this.left, box.left);
  this.top = Math.min(this.top, box.top);
  this.right = Math.max(this.right, box.right);
  this.bottom = Math.max(this.bottom, box.bottom)
};
goog.math.Box.equals = function(a, b) {
  if(a == b) {
    return true
  }
  if(!a || !b) {
    return false
  }
  return a.top == b.top && a.right == b.right && a.bottom == b.bottom && a.left == b.left
};
goog.math.Box.contains = function(box, other) {
  if(!box || !other) {
    return false
  }
  if(other instanceof goog.math.Box) {
    return other.left >= box.left && other.right <= box.right && other.top >= box.top && other.bottom <= box.bottom
  }
  return other.x >= box.left && other.x <= box.right && other.y >= box.top && other.y <= box.bottom
};
goog.math.Box.relativePositionX = function(box, coord) {
  if(coord.x < box.left) {
    return coord.x - box.left
  }else {
    if(coord.x > box.right) {
      return coord.x - box.right
    }
  }
  return 0
};
goog.math.Box.relativePositionY = function(box, coord) {
  if(coord.y < box.top) {
    return coord.y - box.top
  }else {
    if(coord.y > box.bottom) {
      return coord.y - box.bottom
    }
  }
  return 0
};
goog.math.Box.distance = function(box, coord) {
  var x = goog.math.Box.relativePositionX(box, coord);
  var y = goog.math.Box.relativePositionY(box, coord);
  return Math.sqrt(x * x + y * y)
};
goog.math.Box.intersects = function(a, b) {
  return a.left <= b.right && b.left <= a.right && a.top <= b.bottom && b.top <= a.bottom
};
goog.math.Box.intersectsWithPadding = function(a, b, padding) {
  return a.left <= b.right + padding && b.left <= a.right + padding && a.top <= b.bottom + padding && b.top <= a.bottom + padding
};
goog.provide("goog.math.Rect");
goog.require("goog.math.Box");
goog.require("goog.math.Size");
goog.math.Rect = function(x, y, w, h) {
  this.left = x;
  this.top = y;
  this.width = w;
  this.height = h
};
goog.math.Rect.prototype.clone = function() {
  return new goog.math.Rect(this.left, this.top, this.width, this.height)
};
goog.math.Rect.prototype.toBox = function() {
  var right = this.left + this.width;
  var bottom = this.top + this.height;
  return new goog.math.Box(this.top, right, bottom, this.left)
};
goog.math.Rect.createFromBox = function(box) {
  return new goog.math.Rect(box.left, box.top, box.right - box.left, box.bottom - box.top)
};
if(goog.DEBUG) {
  goog.math.Rect.prototype.toString = function() {
    return"(" + this.left + ", " + this.top + " - " + this.width + "w x " + this.height + "h)"
  }
}
goog.math.Rect.equals = function(a, b) {
  if(a == b) {
    return true
  }
  if(!a || !b) {
    return false
  }
  return a.left == b.left && a.width == b.width && a.top == b.top && a.height == b.height
};
goog.math.Rect.prototype.intersection = function(rect) {
  var x0 = Math.max(this.left, rect.left);
  var x1 = Math.min(this.left + this.width, rect.left + rect.width);
  if(x0 <= x1) {
    var y0 = Math.max(this.top, rect.top);
    var y1 = Math.min(this.top + this.height, rect.top + rect.height);
    if(y0 <= y1) {
      this.left = x0;
      this.top = y0;
      this.width = x1 - x0;
      this.height = y1 - y0;
      return true
    }
  }
  return false
};
goog.math.Rect.intersection = function(a, b) {
  var x0 = Math.max(a.left, b.left);
  var x1 = Math.min(a.left + a.width, b.left + b.width);
  if(x0 <= x1) {
    var y0 = Math.max(a.top, b.top);
    var y1 = Math.min(a.top + a.height, b.top + b.height);
    if(y0 <= y1) {
      return new goog.math.Rect(x0, y0, x1 - x0, y1 - y0)
    }
  }
  return null
};
goog.math.Rect.intersects = function(a, b) {
  return a.left <= b.left + b.width && b.left <= a.left + a.width && a.top <= b.top + b.height && b.top <= a.top + a.height
};
goog.math.Rect.prototype.intersects = function(rect) {
  return goog.math.Rect.intersects(this, rect)
};
goog.math.Rect.difference = function(a, b) {
  var intersection = goog.math.Rect.intersection(a, b);
  if(!intersection || !intersection.height || !intersection.width) {
    return[a.clone()]
  }
  var result = [];
  var top = a.top;
  var height = a.height;
  var ar = a.left + a.width;
  var ab = a.top + a.height;
  var br = b.left + b.width;
  var bb = b.top + b.height;
  if(b.top > a.top) {
    result.push(new goog.math.Rect(a.left, a.top, a.width, b.top - a.top));
    top = b.top;
    height -= b.top - a.top
  }
  if(bb < ab) {
    result.push(new goog.math.Rect(a.left, bb, a.width, ab - bb));
    height = bb - top
  }
  if(b.left > a.left) {
    result.push(new goog.math.Rect(a.left, top, b.left - a.left, height))
  }
  if(br < ar) {
    result.push(new goog.math.Rect(br, top, ar - br, height))
  }
  return result
};
goog.math.Rect.prototype.difference = function(rect) {
  return goog.math.Rect.difference(this, rect)
};
goog.math.Rect.prototype.boundingRect = function(rect) {
  var right = Math.max(this.left + this.width, rect.left + rect.width);
  var bottom = Math.max(this.top + this.height, rect.top + rect.height);
  this.left = Math.min(this.left, rect.left);
  this.top = Math.min(this.top, rect.top);
  this.width = right - this.left;
  this.height = bottom - this.top
};
goog.math.Rect.boundingRect = function(a, b) {
  if(!a || !b) {
    return null
  }
  var clone = a.clone();
  clone.boundingRect(b);
  return clone
};
goog.math.Rect.prototype.contains = function(another) {
  if(another instanceof goog.math.Rect) {
    return this.left <= another.left && this.left + this.width >= another.left + another.width && this.top <= another.top && this.top + this.height >= another.top + another.height
  }else {
    return another.x >= this.left && another.x <= this.left + this.width && another.y >= this.top && another.y <= this.top + this.height
  }
};
goog.math.Rect.prototype.getSize = function() {
  return new goog.math.Size(this.width, this.height)
};
goog.provide("goog.style");
goog.require("goog.array");
goog.require("goog.dom");
goog.require("goog.math.Box");
goog.require("goog.math.Coordinate");
goog.require("goog.math.Rect");
goog.require("goog.math.Size");
goog.require("goog.object");
goog.require("goog.string");
goog.require("goog.userAgent");
goog.style.setStyle = function(element, style, opt_value) {
  if(goog.isString(style)) {
    goog.style.setStyle_(element, opt_value, style)
  }else {
    goog.object.forEach(style, goog.partial(goog.style.setStyle_, element))
  }
};
goog.style.setStyle_ = function(element, value, style) {
  element.style[goog.string.toCamelCase(style)] = value
};
goog.style.getStyle = function(element, property) {
  return element.style[goog.string.toCamelCase(property)] || ""
};
goog.style.getComputedStyle = function(element, property) {
  var doc = goog.dom.getOwnerDocument(element);
  if(doc.defaultView && doc.defaultView.getComputedStyle) {
    var styles = doc.defaultView.getComputedStyle(element, null);
    if(styles) {
      return styles[property] || styles.getPropertyValue(property) || ""
    }
  }
  return""
};
goog.style.getCascadedStyle = function(element, style) {
  return element.currentStyle ? element.currentStyle[style] : null
};
goog.style.getStyle_ = function(element, style) {
  return goog.style.getComputedStyle(element, style) || goog.style.getCascadedStyle(element, style) || element.style && element.style[style]
};
goog.style.getComputedPosition = function(element) {
  return goog.style.getStyle_(element, "position")
};
goog.style.getBackgroundColor = function(element) {
  return goog.style.getStyle_(element, "backgroundColor")
};
goog.style.getComputedOverflowX = function(element) {
  return goog.style.getStyle_(element, "overflowX")
};
goog.style.getComputedOverflowY = function(element) {
  return goog.style.getStyle_(element, "overflowY")
};
goog.style.getComputedZIndex = function(element) {
  return goog.style.getStyle_(element, "zIndex")
};
goog.style.getComputedTextAlign = function(element) {
  return goog.style.getStyle_(element, "textAlign")
};
goog.style.getComputedCursor = function(element) {
  return goog.style.getStyle_(element, "cursor")
};
goog.style.setPosition = function(el, arg1, opt_arg2) {
  var x, y;
  var buggyGeckoSubPixelPos = goog.userAgent.GECKO && (goog.userAgent.MAC || goog.userAgent.X11) && goog.userAgent.isVersion("1.9");
  if(arg1 instanceof goog.math.Coordinate) {
    x = arg1.x;
    y = arg1.y
  }else {
    x = arg1;
    y = opt_arg2
  }
  el.style.left = goog.style.getPixelStyleValue_(x, buggyGeckoSubPixelPos);
  el.style.top = goog.style.getPixelStyleValue_(y, buggyGeckoSubPixelPos)
};
goog.style.getPosition = function(element) {
  return new goog.math.Coordinate(element.offsetLeft, element.offsetTop)
};
goog.style.getClientViewportElement = function(opt_node) {
  var doc;
  if(opt_node) {
    doc = goog.dom.getOwnerDocument(opt_node)
  }else {
    doc = goog.dom.getDocument()
  }
  if(goog.userAgent.IE && !goog.userAgent.isDocumentMode(9) && !goog.dom.getDomHelper(doc).isCss1CompatMode()) {
    return doc.body
  }
  return doc.documentElement
};
goog.style.getViewportPageOffset = function(doc) {
  var body = doc.body;
  var documentElement = doc.documentElement;
  var scrollLeft = body.scrollLeft || documentElement.scrollLeft;
  var scrollTop = body.scrollTop || documentElement.scrollTop;
  return new goog.math.Coordinate(scrollLeft, scrollTop)
};
goog.style.getBoundingClientRect_ = function(el) {
  var rect = el.getBoundingClientRect();
  if(goog.userAgent.IE) {
    var doc = el.ownerDocument;
    rect.left -= doc.documentElement.clientLeft + doc.body.clientLeft;
    rect.top -= doc.documentElement.clientTop + doc.body.clientTop
  }
  return rect
};
goog.style.getOffsetParent = function(element) {
  if(goog.userAgent.IE && !goog.userAgent.isDocumentMode(8)) {
    return element.offsetParent
  }
  var doc = goog.dom.getOwnerDocument(element);
  var positionStyle = goog.style.getStyle_(element, "position");
  var skipStatic = positionStyle == "fixed" || positionStyle == "absolute";
  for(var parent = element.parentNode;parent && parent != doc;parent = parent.parentNode) {
    positionStyle = goog.style.getStyle_(parent, "position");
    skipStatic = skipStatic && positionStyle == "static" && parent != doc.documentElement && parent != doc.body;
    if(!skipStatic && (parent.scrollWidth > parent.clientWidth || parent.scrollHeight > parent.clientHeight || positionStyle == "fixed" || positionStyle == "absolute" || positionStyle == "relative")) {
      return parent
    }
  }
  return null
};
goog.style.getVisibleRectForElement = function(element) {
  var visibleRect = new goog.math.Box(0, Infinity, Infinity, 0);
  var dom = goog.dom.getDomHelper(element);
  var body = dom.getDocument().body;
  var documentElement = dom.getDocument().documentElement;
  var scrollEl = dom.getDocumentScrollElement();
  for(var el = element;el = goog.style.getOffsetParent(el);) {
    if((!goog.userAgent.IE || el.clientWidth != 0) && (!goog.userAgent.WEBKIT || el.clientHeight != 0 || el != body) && el != body && el != documentElement && goog.style.getStyle_(el, "overflow") != "visible") {
      var pos = goog.style.getPageOffset(el);
      var client = goog.style.getClientLeftTop(el);
      pos.x += client.x;
      pos.y += client.y;
      visibleRect.top = Math.max(visibleRect.top, pos.y);
      visibleRect.right = Math.min(visibleRect.right, pos.x + el.clientWidth);
      visibleRect.bottom = Math.min(visibleRect.bottom, pos.y + el.clientHeight);
      visibleRect.left = Math.max(visibleRect.left, pos.x)
    }
  }
  var scrollX = scrollEl.scrollLeft, scrollY = scrollEl.scrollTop;
  visibleRect.left = Math.max(visibleRect.left, scrollX);
  visibleRect.top = Math.max(visibleRect.top, scrollY);
  var winSize = dom.getViewportSize();
  visibleRect.right = Math.min(visibleRect.right, scrollX + winSize.width);
  visibleRect.bottom = Math.min(visibleRect.bottom, scrollY + winSize.height);
  return visibleRect.top >= 0 && visibleRect.left >= 0 && visibleRect.bottom > visibleRect.top && visibleRect.right > visibleRect.left ? visibleRect : null
};
goog.style.getContainerOffsetToScrollInto = function(element, container, opt_center) {
  var elementPos = goog.style.getPageOffset(element);
  var containerPos = goog.style.getPageOffset(container);
  var containerBorder = goog.style.getBorderBox(container);
  var relX = elementPos.x - containerPos.x - containerBorder.left;
  var relY = elementPos.y - containerPos.y - containerBorder.top;
  var spaceX = container.clientWidth - element.offsetWidth;
  var spaceY = container.clientHeight - element.offsetHeight;
  var scrollLeft = container.scrollLeft;
  var scrollTop = container.scrollTop;
  if(opt_center) {
    scrollLeft += relX - spaceX / 2;
    scrollTop += relY - spaceY / 2
  }else {
    scrollLeft += Math.min(relX, Math.max(relX - spaceX, 0));
    scrollTop += Math.min(relY, Math.max(relY - spaceY, 0))
  }
  return new goog.math.Coordinate(scrollLeft, scrollTop)
};
goog.style.scrollIntoContainerView = function(element, container, opt_center) {
  var offset = goog.style.getContainerOffsetToScrollInto(element, container, opt_center);
  container.scrollLeft = offset.x;
  container.scrollTop = offset.y
};
goog.style.getClientLeftTop = function(el) {
  if(goog.userAgent.GECKO && !goog.userAgent.isVersion("1.9")) {
    var left = parseFloat(goog.style.getComputedStyle(el, "borderLeftWidth"));
    if(goog.style.isRightToLeft(el)) {
      var scrollbarWidth = el.offsetWidth - el.clientWidth - left - parseFloat(goog.style.getComputedStyle(el, "borderRightWidth"));
      left += scrollbarWidth
    }
    return new goog.math.Coordinate(left, parseFloat(goog.style.getComputedStyle(el, "borderTopWidth")))
  }
  return new goog.math.Coordinate(el.clientLeft, el.clientTop)
};
goog.style.getPageOffset = function(el) {
  var box, doc = goog.dom.getOwnerDocument(el);
  var positionStyle = goog.style.getStyle_(el, "position");
  goog.asserts.assertObject(el, "Parameter is required");
  var BUGGY_GECKO_BOX_OBJECT = goog.userAgent.GECKO && doc.getBoxObjectFor && !el.getBoundingClientRect && positionStyle == "absolute" && (box = doc.getBoxObjectFor(el)) && (box.screenX < 0 || box.screenY < 0);
  var pos = new goog.math.Coordinate(0, 0);
  var viewportElement = goog.style.getClientViewportElement(doc);
  if(el == viewportElement) {
    return pos
  }
  if(el.getBoundingClientRect) {
    box = goog.style.getBoundingClientRect_(el);
    var scrollCoord = goog.dom.getDomHelper(doc).getDocumentScroll();
    pos.x = box.left + scrollCoord.x;
    pos.y = box.top + scrollCoord.y
  }else {
    if(doc.getBoxObjectFor && !BUGGY_GECKO_BOX_OBJECT) {
      box = doc.getBoxObjectFor(el);
      var vpBox = doc.getBoxObjectFor(viewportElement);
      pos.x = box.screenX - vpBox.screenX;
      pos.y = box.screenY - vpBox.screenY
    }else {
      var parent = el;
      do {
        pos.x += parent.offsetLeft;
        pos.y += parent.offsetTop;
        if(parent != el) {
          pos.x += parent.clientLeft || 0;
          pos.y += parent.clientTop || 0
        }
        if(goog.userAgent.WEBKIT && goog.style.getComputedPosition(parent) == "fixed") {
          pos.x += doc.body.scrollLeft;
          pos.y += doc.body.scrollTop;
          break
        }
        parent = parent.offsetParent
      }while(parent && parent != el);
      if(goog.userAgent.OPERA || goog.userAgent.WEBKIT && positionStyle == "absolute") {
        pos.y -= doc.body.offsetTop
      }
      for(parent = el;(parent = goog.style.getOffsetParent(parent)) && parent != doc.body && parent != viewportElement;) {
        pos.x -= parent.scrollLeft;
        if(!goog.userAgent.OPERA || parent.tagName != "TR") {
          pos.y -= parent.scrollTop
        }
      }
    }
  }
  return pos
};
goog.style.getPageOffsetLeft = function(el) {
  return goog.style.getPageOffset(el).x
};
goog.style.getPageOffsetTop = function(el) {
  return goog.style.getPageOffset(el).y
};
goog.style.getFramedPageOffset = function(el, relativeWin) {
  var position = new goog.math.Coordinate(0, 0);
  var currentWin = goog.dom.getWindow(goog.dom.getOwnerDocument(el));
  var currentEl = el;
  do {
    var offset = currentWin == relativeWin ? goog.style.getPageOffset(currentEl) : goog.style.getClientPosition(currentEl);
    position.x += offset.x;
    position.y += offset.y
  }while(currentWin && currentWin != relativeWin && (currentEl = currentWin.frameElement) && (currentWin = currentWin.parent));
  return position
};
goog.style.translateRectForAnotherFrame = function(rect, origBase, newBase) {
  if(origBase.getDocument() != newBase.getDocument()) {
    var body = origBase.getDocument().body;
    var pos = goog.style.getFramedPageOffset(body, newBase.getWindow());
    pos = goog.math.Coordinate.difference(pos, goog.style.getPageOffset(body));
    if(goog.userAgent.IE && !origBase.isCss1CompatMode()) {
      pos = goog.math.Coordinate.difference(pos, origBase.getDocumentScroll())
    }
    rect.left += pos.x;
    rect.top += pos.y
  }
};
goog.style.getRelativePosition = function(a, b) {
  var ap = goog.style.getClientPosition(a);
  var bp = goog.style.getClientPosition(b);
  return new goog.math.Coordinate(ap.x - bp.x, ap.y - bp.y)
};
goog.style.getClientPosition = function(el) {
  var pos = new goog.math.Coordinate;
  if(el.nodeType == goog.dom.NodeType.ELEMENT) {
    el = el;
    if(el.getBoundingClientRect) {
      var box = goog.style.getBoundingClientRect_(el);
      pos.x = box.left;
      pos.y = box.top
    }else {
      var scrollCoord = goog.dom.getDomHelper(el).getDocumentScroll();
      var pageCoord = goog.style.getPageOffset(el);
      pos.x = pageCoord.x - scrollCoord.x;
      pos.y = pageCoord.y - scrollCoord.y
    }
    if(goog.userAgent.GECKO && !goog.userAgent.isVersion(12)) {
      pos = goog.math.Coordinate.sum(pos, goog.style.getCssTranslation(el))
    }
  }else {
    var isAbstractedEvent = goog.isFunction(el.getBrowserEvent);
    var targetEvent = el;
    if(el.targetTouches) {
      targetEvent = el.targetTouches[0]
    }else {
      if(isAbstractedEvent && el.getBrowserEvent().targetTouches) {
        targetEvent = el.getBrowserEvent().targetTouches[0]
      }
    }
    pos.x = targetEvent.clientX;
    pos.y = targetEvent.clientY
  }
  return pos
};
goog.style.setPageOffset = function(el, x, opt_y) {
  var cur = goog.style.getPageOffset(el);
  if(x instanceof goog.math.Coordinate) {
    opt_y = x.y;
    x = x.x
  }
  var dx = x - cur.x;
  var dy = opt_y - cur.y;
  goog.style.setPosition(el, el.offsetLeft + dx, el.offsetTop + dy)
};
goog.style.setSize = function(element, w, opt_h) {
  var h;
  if(w instanceof goog.math.Size) {
    h = w.height;
    w = w.width
  }else {
    if(opt_h == undefined) {
      throw Error("missing height argument");
    }
    h = opt_h
  }
  goog.style.setWidth(element, w);
  goog.style.setHeight(element, h)
};
goog.style.getPixelStyleValue_ = function(value, round) {
  if(typeof value == "number") {
    value = (round ? Math.round(value) : value) + "px"
  }
  return value
};
goog.style.setHeight = function(element, height) {
  element.style.height = goog.style.getPixelStyleValue_(height, true)
};
goog.style.setWidth = function(element, width) {
  element.style.width = goog.style.getPixelStyleValue_(width, true)
};
goog.style.getSize = function(element) {
  if(goog.style.getStyle_(element, "display") != "none") {
    return goog.style.getSizeWithDisplay_(element)
  }
  var style = element.style;
  var originalDisplay = style.display;
  var originalVisibility = style.visibility;
  var originalPosition = style.position;
  style.visibility = "hidden";
  style.position = "absolute";
  style.display = "inline";
  var size = goog.style.getSizeWithDisplay_(element);
  style.display = originalDisplay;
  style.position = originalPosition;
  style.visibility = originalVisibility;
  return size
};
goog.style.getSizeWithDisplay_ = function(element) {
  var offsetWidth = element.offsetWidth;
  var offsetHeight = element.offsetHeight;
  var webkitOffsetsZero = goog.userAgent.WEBKIT && !offsetWidth && !offsetHeight;
  if((!goog.isDef(offsetWidth) || webkitOffsetsZero) && element.getBoundingClientRect) {
    var clientRect = goog.style.getBoundingClientRect_(element);
    return new goog.math.Size(clientRect.right - clientRect.left, clientRect.bottom - clientRect.top)
  }
  return new goog.math.Size(offsetWidth, offsetHeight)
};
goog.style.getBounds = function(element) {
  var o = goog.style.getPageOffset(element);
  var s = goog.style.getSize(element);
  return new goog.math.Rect(o.x, o.y, s.width, s.height)
};
goog.style.toCamelCase = function(selector) {
  return goog.string.toCamelCase(String(selector))
};
goog.style.toSelectorCase = function(selector) {
  return goog.string.toSelectorCase(selector)
};
goog.style.getOpacity = function(el) {
  var style = el.style;
  var result = "";
  if("opacity" in style) {
    result = style.opacity
  }else {
    if("MozOpacity" in style) {
      result = style.MozOpacity
    }else {
      if("filter" in style) {
        var match = style.filter.match(/alpha\(opacity=([\d.]+)\)/);
        if(match) {
          result = String(match[1] / 100)
        }
      }
    }
  }
  return result == "" ? result : Number(result)
};
goog.style.setOpacity = function(el, alpha) {
  var style = el.style;
  if("opacity" in style) {
    style.opacity = alpha
  }else {
    if("MozOpacity" in style) {
      style.MozOpacity = alpha
    }else {
      if("filter" in style) {
        if(alpha === "") {
          style.filter = ""
        }else {
          style.filter = "alpha(opacity=" + alpha * 100 + ")"
        }
      }
    }
  }
};
goog.style.setTransparentBackgroundImage = function(el, src) {
  var style = el.style;
  if(goog.userAgent.IE && !goog.userAgent.isVersion("8")) {
    style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(" + 'src="' + src + '", sizingMethod="crop")'
  }else {
    style.backgroundImage = "url(" + src + ")";
    style.backgroundPosition = "top left";
    style.backgroundRepeat = "no-repeat"
  }
};
goog.style.clearTransparentBackgroundImage = function(el) {
  var style = el.style;
  if("filter" in style) {
    style.filter = ""
  }else {
    style.backgroundImage = "none"
  }
};
goog.style.showElement = function(el, display) {
  el.style.display = display ? "" : "none"
};
goog.style.isElementShown = function(el) {
  return el.style.display != "none"
};
goog.style.installStyles = function(stylesString, opt_node) {
  var dh = goog.dom.getDomHelper(opt_node);
  var styleSheet = null;
  if(goog.userAgent.IE) {
    styleSheet = dh.getDocument().createStyleSheet();
    goog.style.setStyles(styleSheet, stylesString)
  }else {
    var head = dh.getElementsByTagNameAndClass("head")[0];
    if(!head) {
      var body = dh.getElementsByTagNameAndClass("body")[0];
      head = dh.createDom("head");
      body.parentNode.insertBefore(head, body)
    }
    styleSheet = dh.createDom("style");
    goog.style.setStyles(styleSheet, stylesString);
    dh.appendChild(head, styleSheet)
  }
  return styleSheet
};
goog.style.uninstallStyles = function(styleSheet) {
  var node = styleSheet.ownerNode || styleSheet.owningElement || styleSheet;
  goog.dom.removeNode(node)
};
goog.style.setStyles = function(element, stylesString) {
  if(goog.userAgent.IE) {
    element.cssText = stylesString
  }else {
    element.innerHTML = stylesString
  }
};
goog.style.setPreWrap = function(el) {
  var style = el.style;
  if(goog.userAgent.IE && !goog.userAgent.isVersion("8")) {
    style.whiteSpace = "pre";
    style.wordWrap = "break-word"
  }else {
    if(goog.userAgent.GECKO) {
      style.whiteSpace = "-moz-pre-wrap"
    }else {
      style.whiteSpace = "pre-wrap"
    }
  }
};
goog.style.setInlineBlock = function(el) {
  var style = el.style;
  style.position = "relative";
  if(goog.userAgent.IE && !goog.userAgent.isVersion("8")) {
    style.zoom = "1";
    style.display = "inline"
  }else {
    if(goog.userAgent.GECKO) {
      style.display = goog.userAgent.isVersion("1.9a") ? "inline-block" : "-moz-inline-box"
    }else {
      style.display = "inline-block"
    }
  }
};
goog.style.isRightToLeft = function(el) {
  return"rtl" == goog.style.getStyle_(el, "direction")
};
goog.style.unselectableStyle_ = goog.userAgent.GECKO ? "MozUserSelect" : goog.userAgent.WEBKIT ? "WebkitUserSelect" : null;
goog.style.isUnselectable = function(el) {
  if(goog.style.unselectableStyle_) {
    return el.style[goog.style.unselectableStyle_].toLowerCase() == "none"
  }else {
    if(goog.userAgent.IE || goog.userAgent.OPERA) {
      return el.getAttribute("unselectable") == "on"
    }
  }
  return false
};
goog.style.setUnselectable = function(el, unselectable, opt_noRecurse) {
  var descendants = !opt_noRecurse ? el.getElementsByTagName("*") : null;
  var name = goog.style.unselectableStyle_;
  if(name) {
    var value = unselectable ? "none" : "";
    el.style[name] = value;
    if(descendants) {
      for(var i = 0, descendant;descendant = descendants[i];i++) {
        descendant.style[name] = value
      }
    }
  }else {
    if(goog.userAgent.IE || goog.userAgent.OPERA) {
      var value = unselectable ? "on" : "";
      el.setAttribute("unselectable", value);
      if(descendants) {
        for(var i = 0, descendant;descendant = descendants[i];i++) {
          descendant.setAttribute("unselectable", value)
        }
      }
    }
  }
};
goog.style.getBorderBoxSize = function(element) {
  return new goog.math.Size(element.offsetWidth, element.offsetHeight)
};
goog.style.setBorderBoxSize = function(element, size) {
  var doc = goog.dom.getOwnerDocument(element);
  var isCss1CompatMode = goog.dom.getDomHelper(doc).isCss1CompatMode();
  if(goog.userAgent.IE && (!isCss1CompatMode || !goog.userAgent.isVersion("8"))) {
    var style = element.style;
    if(isCss1CompatMode) {
      var paddingBox = goog.style.getPaddingBox(element);
      var borderBox = goog.style.getBorderBox(element);
      style.pixelWidth = size.width - borderBox.left - paddingBox.left - paddingBox.right - borderBox.right;
      style.pixelHeight = size.height - borderBox.top - paddingBox.top - paddingBox.bottom - borderBox.bottom
    }else {
      style.pixelWidth = size.width;
      style.pixelHeight = size.height
    }
  }else {
    goog.style.setBoxSizingSize_(element, size, "border-box")
  }
};
goog.style.getContentBoxSize = function(element) {
  var doc = goog.dom.getOwnerDocument(element);
  var ieCurrentStyle = goog.userAgent.IE && element.currentStyle;
  if(ieCurrentStyle && goog.dom.getDomHelper(doc).isCss1CompatMode() && ieCurrentStyle.width != "auto" && ieCurrentStyle.height != "auto" && !ieCurrentStyle.boxSizing) {
    var width = goog.style.getIePixelValue_(element, ieCurrentStyle.width, "width", "pixelWidth");
    var height = goog.style.getIePixelValue_(element, ieCurrentStyle.height, "height", "pixelHeight");
    return new goog.math.Size(width, height)
  }else {
    var borderBoxSize = goog.style.getBorderBoxSize(element);
    var paddingBox = goog.style.getPaddingBox(element);
    var borderBox = goog.style.getBorderBox(element);
    return new goog.math.Size(borderBoxSize.width - borderBox.left - paddingBox.left - paddingBox.right - borderBox.right, borderBoxSize.height - borderBox.top - paddingBox.top - paddingBox.bottom - borderBox.bottom)
  }
};
goog.style.setContentBoxSize = function(element, size) {
  var doc = goog.dom.getOwnerDocument(element);
  var isCss1CompatMode = goog.dom.getDomHelper(doc).isCss1CompatMode();
  if(goog.userAgent.IE && (!isCss1CompatMode || !goog.userAgent.isVersion("8"))) {
    var style = element.style;
    if(isCss1CompatMode) {
      style.pixelWidth = size.width;
      style.pixelHeight = size.height
    }else {
      var paddingBox = goog.style.getPaddingBox(element);
      var borderBox = goog.style.getBorderBox(element);
      style.pixelWidth = size.width + borderBox.left + paddingBox.left + paddingBox.right + borderBox.right;
      style.pixelHeight = size.height + borderBox.top + paddingBox.top + paddingBox.bottom + borderBox.bottom
    }
  }else {
    goog.style.setBoxSizingSize_(element, size, "content-box")
  }
};
goog.style.setBoxSizingSize_ = function(element, size, boxSizing) {
  var style = element.style;
  if(goog.userAgent.GECKO) {
    style.MozBoxSizing = boxSizing
  }else {
    if(goog.userAgent.WEBKIT) {
      style.WebkitBoxSizing = boxSizing
    }else {
      style.boxSizing = boxSizing
    }
  }
  style.width = Math.max(size.width, 0) + "px";
  style.height = Math.max(size.height, 0) + "px"
};
goog.style.getIePixelValue_ = function(element, value, name, pixelName) {
  if(/^\d+px?$/.test(value)) {
    return parseInt(value, 10)
  }else {
    var oldStyleValue = element.style[name];
    var oldRuntimeValue = element.runtimeStyle[name];
    element.runtimeStyle[name] = element.currentStyle[name];
    element.style[name] = value;
    var pixelValue = element.style[pixelName];
    element.style[name] = oldStyleValue;
    element.runtimeStyle[name] = oldRuntimeValue;
    return pixelValue
  }
};
goog.style.getIePixelDistance_ = function(element, propName) {
  return goog.style.getIePixelValue_(element, goog.style.getCascadedStyle(element, propName), "left", "pixelLeft")
};
goog.style.getBox_ = function(element, stylePrefix) {
  if(goog.userAgent.IE) {
    var left = goog.style.getIePixelDistance_(element, stylePrefix + "Left");
    var right = goog.style.getIePixelDistance_(element, stylePrefix + "Right");
    var top = goog.style.getIePixelDistance_(element, stylePrefix + "Top");
    var bottom = goog.style.getIePixelDistance_(element, stylePrefix + "Bottom");
    return new goog.math.Box(top, right, bottom, left)
  }else {
    var left = goog.style.getComputedStyle(element, stylePrefix + "Left");
    var right = goog.style.getComputedStyle(element, stylePrefix + "Right");
    var top = goog.style.getComputedStyle(element, stylePrefix + "Top");
    var bottom = goog.style.getComputedStyle(element, stylePrefix + "Bottom");
    return new goog.math.Box(parseFloat(top), parseFloat(right), parseFloat(bottom), parseFloat(left))
  }
};
goog.style.getPaddingBox = function(element) {
  return goog.style.getBox_(element, "padding")
};
goog.style.getMarginBox = function(element) {
  return goog.style.getBox_(element, "margin")
};
goog.style.ieBorderWidthKeywords_ = {"thin":2, "medium":4, "thick":6};
goog.style.getIePixelBorder_ = function(element, prop) {
  if(goog.style.getCascadedStyle(element, prop + "Style") == "none") {
    return 0
  }
  var width = goog.style.getCascadedStyle(element, prop + "Width");
  if(width in goog.style.ieBorderWidthKeywords_) {
    return goog.style.ieBorderWidthKeywords_[width]
  }
  return goog.style.getIePixelValue_(element, width, "left", "pixelLeft")
};
goog.style.getBorderBox = function(element) {
  if(goog.userAgent.IE) {
    var left = goog.style.getIePixelBorder_(element, "borderLeft");
    var right = goog.style.getIePixelBorder_(element, "borderRight");
    var top = goog.style.getIePixelBorder_(element, "borderTop");
    var bottom = goog.style.getIePixelBorder_(element, "borderBottom");
    return new goog.math.Box(top, right, bottom, left)
  }else {
    var left = goog.style.getComputedStyle(element, "borderLeftWidth");
    var right = goog.style.getComputedStyle(element, "borderRightWidth");
    var top = goog.style.getComputedStyle(element, "borderTopWidth");
    var bottom = goog.style.getComputedStyle(element, "borderBottomWidth");
    return new goog.math.Box(parseFloat(top), parseFloat(right), parseFloat(bottom), parseFloat(left))
  }
};
goog.style.getFontFamily = function(el) {
  var doc = goog.dom.getOwnerDocument(el);
  var font = "";
  if(doc.body.createTextRange) {
    var range = doc.body.createTextRange();
    range.moveToElementText(el);
    try {
      font = range.queryCommandValue("FontName")
    }catch(e) {
      font = ""
    }
  }
  if(!font) {
    font = goog.style.getStyle_(el, "fontFamily")
  }
  var fontsArray = font.split(",");
  if(fontsArray.length > 1) {
    font = fontsArray[0]
  }
  return goog.string.stripQuotes(font, "\"'")
};
goog.style.lengthUnitRegex_ = /[^\d]+$/;
goog.style.getLengthUnits = function(value) {
  var units = value.match(goog.style.lengthUnitRegex_);
  return units && units[0] || null
};
goog.style.ABSOLUTE_CSS_LENGTH_UNITS_ = {"cm":1, "in":1, "mm":1, "pc":1, "pt":1};
goog.style.CONVERTIBLE_RELATIVE_CSS_UNITS_ = {"em":1, "ex":1};
goog.style.getFontSize = function(el) {
  var fontSize = goog.style.getStyle_(el, "fontSize");
  var sizeUnits = goog.style.getLengthUnits(fontSize);
  if(fontSize && "px" == sizeUnits) {
    return parseInt(fontSize, 10)
  }
  if(goog.userAgent.IE) {
    if(sizeUnits in goog.style.ABSOLUTE_CSS_LENGTH_UNITS_) {
      return goog.style.getIePixelValue_(el, fontSize, "left", "pixelLeft")
    }else {
      if(el.parentNode && el.parentNode.nodeType == goog.dom.NodeType.ELEMENT && sizeUnits in goog.style.CONVERTIBLE_RELATIVE_CSS_UNITS_) {
        var parentElement = el.parentNode;
        var parentSize = goog.style.getStyle_(parentElement, "fontSize");
        return goog.style.getIePixelValue_(parentElement, fontSize == parentSize ? "1em" : fontSize, "left", "pixelLeft")
      }
    }
  }
  var sizeElement = goog.dom.createDom("span", {"style":"visibility:hidden;position:absolute;" + "line-height:0;padding:0;margin:0;border:0;height:1em;"});
  goog.dom.appendChild(el, sizeElement);
  fontSize = sizeElement.offsetHeight;
  goog.dom.removeNode(sizeElement);
  return fontSize
};
goog.style.parseStyleAttribute = function(value) {
  var result = {};
  goog.array.forEach(value.split(/\s*;\s*/), function(pair) {
    var keyValue = pair.split(/\s*:\s*/);
    if(keyValue.length == 2) {
      result[goog.string.toCamelCase(keyValue[0].toLowerCase())] = keyValue[1]
    }
  });
  return result
};
goog.style.toStyleAttribute = function(obj) {
  var buffer = [];
  goog.object.forEach(obj, function(value, key) {
    buffer.push(goog.string.toSelectorCase(key), ":", value, ";")
  });
  return buffer.join("")
};
goog.style.setFloat = function(el, value) {
  el.style[goog.userAgent.IE ? "styleFloat" : "cssFloat"] = value
};
goog.style.getFloat = function(el) {
  return el.style[goog.userAgent.IE ? "styleFloat" : "cssFloat"] || ""
};
goog.style.getScrollbarWidth = function(opt_className) {
  var outerDiv = goog.dom.createElement("div");
  if(opt_className) {
    outerDiv.className = opt_className
  }
  outerDiv.style.cssText = "overflow:auto;" + "position:absolute;top:0;width:100px;height:100px";
  var innerDiv = goog.dom.createElement("div");
  goog.style.setSize(innerDiv, "200px", "200px");
  outerDiv.appendChild(innerDiv);
  goog.dom.appendChild(goog.dom.getDocument().body, outerDiv);
  var width = outerDiv.offsetWidth - outerDiv.clientWidth;
  goog.dom.removeNode(outerDiv);
  return width
};
goog.style.MATRIX_TRANSLATION_REGEX_ = new RegExp("matrix\\([0-9\\.\\-]+, [0-9\\.\\-]+, " + "[0-9\\.\\-]+, [0-9\\.\\-]+, " + "([0-9\\.\\-]+)p?x?, ([0-9\\.\\-]+)p?x?\\)");
goog.style.getCssTranslation = function(element) {
  var property;
  if(goog.userAgent.IE) {
    property = "-ms-transform"
  }else {
    if(goog.userAgent.WEBKIT) {
      property = "-webkit-transform"
    }else {
      if(goog.userAgent.OPERA) {
        property = "-o-transform"
      }else {
        if(goog.userAgent.GECKO) {
          property = "-moz-transform"
        }
      }
    }
  }
  var transform;
  if(property) {
    transform = goog.style.getStyle_(element, property)
  }
  if(!transform) {
    transform = goog.style.getStyle_(element, "transform")
  }
  if(!transform) {
    return new goog.math.Coordinate(0, 0)
  }
  var matches = transform.match(goog.style.MATRIX_TRANSLATION_REGEX_);
  if(!matches) {
    return new goog.math.Coordinate(0, 0)
  }
  return new goog.math.Coordinate(parseFloat(matches[1]), parseFloat(matches[2]))
};
goog.provide("goog.style.bidi");
goog.require("goog.dom");
goog.require("goog.style");
goog.require("goog.userAgent");
goog.style.bidi.getScrollLeft = function(element) {
  var isRtl = goog.style.isRightToLeft(element);
  if(isRtl && goog.userAgent.GECKO) {
    return-element.scrollLeft
  }else {
    if(isRtl && !(goog.userAgent.IE && goog.userAgent.isVersion("8"))) {
      return element.scrollWidth - element.clientWidth - element.scrollLeft
    }
  }
  return element.scrollLeft
};
goog.style.bidi.getOffsetStart = function(element) {
  var offsetLeftForReal = element.offsetLeft;
  var bestParent = element.offsetParent;
  if(!bestParent && goog.style.getComputedPosition(element) == "fixed") {
    bestParent = goog.dom.getOwnerDocument(element).documentElement
  }
  if(!bestParent) {
    return offsetLeftForReal
  }
  if(goog.userAgent.GECKO) {
    var borderWidths = goog.style.getBorderBox(bestParent);
    offsetLeftForReal += borderWidths.left
  }else {
    if(goog.userAgent.isDocumentMode(8)) {
      var borderWidths = goog.style.getBorderBox(bestParent);
      offsetLeftForReal -= borderWidths.left
    }
  }
  if(goog.style.isRightToLeft(bestParent)) {
    var elementRightOffset = offsetLeftForReal + element.offsetWidth;
    return bestParent.clientWidth - elementRightOffset
  }
  return offsetLeftForReal
};
goog.style.bidi.setScrollOffset = function(element, offsetStart) {
  offsetStart = Math.max(offsetStart, 0);
  if(!goog.style.isRightToLeft(element)) {
    element.scrollLeft = offsetStart
  }else {
    if(goog.userAgent.GECKO) {
      element.scrollLeft = -offsetStart
    }else {
      if(!(goog.userAgent.IE && goog.userAgent.isVersion("8"))) {
        element.scrollLeft = element.scrollWidth - offsetStart - element.clientWidth
      }else {
        element.scrollLeft = offsetStart
      }
    }
  }
};
goog.style.bidi.setPosition = function(elem, left, top, isRtl) {
  if(!goog.isNull(top)) {
    elem.style.top = top + "px"
  }
  if(isRtl) {
    elem.style.right = left + "px";
    elem.style.left = ""
  }else {
    elem.style.left = left + "px";
    elem.style.right = ""
  }
};
goog.provide("goog.fx.DragEvent");
goog.provide("goog.fx.Dragger");
goog.provide("goog.fx.Dragger.EventType");
goog.require("goog.dom");
goog.require("goog.events");
goog.require("goog.events.BrowserEvent.MouseButton");
goog.require("goog.events.Event");
goog.require("goog.events.EventHandler");
goog.require("goog.events.EventTarget");
goog.require("goog.events.EventType");
goog.require("goog.math.Coordinate");
goog.require("goog.math.Rect");
goog.require("goog.style");
goog.require("goog.style.bidi");
goog.require("goog.userAgent");
goog.fx.Dragger = function(target, opt_handle, opt_limits) {
  goog.events.EventTarget.call(this);
  this.target = target;
  this.handle = opt_handle || target;
  this.limits = opt_limits || new goog.math.Rect(NaN, NaN, NaN, NaN);
  this.document_ = goog.dom.getOwnerDocument(target);
  this.eventHandler_ = new goog.events.EventHandler(this);
  goog.events.listen(this.handle, [goog.events.EventType.TOUCHSTART, goog.events.EventType.MOUSEDOWN], this.startDrag, false, this)
};
goog.inherits(goog.fx.Dragger, goog.events.EventTarget);
goog.fx.Dragger.HAS_SET_CAPTURE_ = goog.userAgent.IE || goog.userAgent.GECKO && goog.userAgent.isVersion("1.9.3");
goog.fx.Dragger.EventType = {EARLY_CANCEL:"earlycancel", START:"start", BEFOREDRAG:"beforedrag", DRAG:"drag", END:"end"};
goog.fx.Dragger.prototype.target;
goog.fx.Dragger.prototype.handle;
goog.fx.Dragger.prototype.limits;
goog.fx.Dragger.prototype.rightToLeft_;
goog.fx.Dragger.prototype.clientX = 0;
goog.fx.Dragger.prototype.clientY = 0;
goog.fx.Dragger.prototype.screenX = 0;
goog.fx.Dragger.prototype.screenY = 0;
goog.fx.Dragger.prototype.startX = 0;
goog.fx.Dragger.prototype.startY = 0;
goog.fx.Dragger.prototype.deltaX = 0;
goog.fx.Dragger.prototype.deltaY = 0;
goog.fx.Dragger.prototype.pageScroll;
goog.fx.Dragger.prototype.enabled_ = true;
goog.fx.Dragger.prototype.dragging_ = false;
goog.fx.Dragger.prototype.hysteresisDistanceSquared_ = 0;
goog.fx.Dragger.prototype.mouseDownTime_ = 0;
goog.fx.Dragger.prototype.document_;
goog.fx.Dragger.prototype.eventHandler_;
goog.fx.Dragger.prototype.scrollTarget_;
goog.fx.Dragger.prototype.ieDragStartCancellingOn_ = false;
goog.fx.Dragger.prototype.useRightPositioningForRtl_ = false;
goog.fx.Dragger.prototype.enableRightPositioningForRtl = function(useRightPositioningForRtl) {
  this.useRightPositioningForRtl_ = useRightPositioningForRtl
};
goog.fx.Dragger.prototype.getHandler = function() {
  return this.eventHandler_
};
goog.fx.Dragger.prototype.setLimits = function(limits) {
  this.limits = limits || new goog.math.Rect(NaN, NaN, NaN, NaN)
};
goog.fx.Dragger.prototype.setHysteresis = function(distance) {
  this.hysteresisDistanceSquared_ = Math.pow(distance, 2)
};
goog.fx.Dragger.prototype.getHysteresis = function() {
  return Math.sqrt(this.hysteresisDistanceSquared_)
};
goog.fx.Dragger.prototype.setScrollTarget = function(scrollTarget) {
  this.scrollTarget_ = scrollTarget
};
goog.fx.Dragger.prototype.setCancelIeDragStart = function(cancelIeDragStart) {
  this.ieDragStartCancellingOn_ = cancelIeDragStart
};
goog.fx.Dragger.prototype.getEnabled = function() {
  return this.enabled_
};
goog.fx.Dragger.prototype.setEnabled = function(enabled) {
  this.enabled_ = enabled
};
goog.fx.Dragger.prototype.disposeInternal = function() {
  goog.fx.Dragger.superClass_.disposeInternal.call(this);
  goog.events.unlisten(this.handle, [goog.events.EventType.TOUCHSTART, goog.events.EventType.MOUSEDOWN], this.startDrag, false, this);
  this.cleanUpAfterDragging_();
  this.target = null;
  this.handle = null;
  this.eventHandler_ = null
};
goog.fx.Dragger.prototype.isRightToLeft_ = function() {
  if(!goog.isDef(this.rightToLeft_)) {
    this.rightToLeft_ = goog.style.isRightToLeft(this.target)
  }
  return this.rightToLeft_
};
goog.fx.Dragger.prototype.startDrag = function(e) {
  var isMouseDown = e.type == goog.events.EventType.MOUSEDOWN;
  if(this.enabled_ && !this.dragging_ && (!isMouseDown || e.isMouseActionButton())) {
    this.maybeReinitTouchEvent_(e);
    if(this.hysteresisDistanceSquared_ == 0) {
      if(this.fireDragStart_(e)) {
        this.dragging_ = true;
        e.preventDefault()
      }else {
        return
      }
    }else {
      e.preventDefault()
    }
    this.setupDragHandlers();
    this.clientX = this.startX = e.clientX;
    this.clientY = this.startY = e.clientY;
    this.screenX = e.screenX;
    this.screenY = e.screenY;
    this.deltaX = this.useRightPositioningForRtl_ ? goog.style.bidi.getOffsetStart(this.target) : this.target.offsetLeft;
    this.deltaY = this.target.offsetTop;
    this.pageScroll = goog.dom.getDomHelper(this.document_).getDocumentScroll();
    this.mouseDownTime_ = goog.now()
  }else {
    this.dispatchEvent(goog.fx.Dragger.EventType.EARLY_CANCEL)
  }
};
goog.fx.Dragger.prototype.setupDragHandlers = function() {
  var doc = this.document_;
  var docEl = doc.documentElement;
  var useCapture = !goog.fx.Dragger.HAS_SET_CAPTURE_;
  this.eventHandler_.listen(doc, [goog.events.EventType.TOUCHMOVE, goog.events.EventType.MOUSEMOVE], this.handleMove_, useCapture);
  this.eventHandler_.listen(doc, [goog.events.EventType.TOUCHEND, goog.events.EventType.MOUSEUP], this.endDrag, useCapture);
  if(goog.fx.Dragger.HAS_SET_CAPTURE_) {
    docEl.setCapture(false);
    this.eventHandler_.listen(docEl, goog.events.EventType.LOSECAPTURE, this.endDrag)
  }else {
    this.eventHandler_.listen(goog.dom.getWindow(doc), goog.events.EventType.BLUR, this.endDrag)
  }
  if(goog.userAgent.IE && this.ieDragStartCancellingOn_) {
    this.eventHandler_.listen(doc, goog.events.EventType.DRAGSTART, goog.events.Event.preventDefault)
  }
  if(this.scrollTarget_) {
    this.eventHandler_.listen(this.scrollTarget_, goog.events.EventType.SCROLL, this.onScroll_, useCapture)
  }
};
goog.fx.Dragger.prototype.fireDragStart_ = function(e) {
  return this.dispatchEvent(new goog.fx.DragEvent(goog.fx.Dragger.EventType.START, this, e.clientX, e.clientY, e))
};
goog.fx.Dragger.prototype.cleanUpAfterDragging_ = function() {
  this.eventHandler_.removeAll();
  if(goog.fx.Dragger.HAS_SET_CAPTURE_) {
    this.document_.releaseCapture()
  }
};
goog.fx.Dragger.prototype.endDrag = function(e, opt_dragCanceled) {
  this.cleanUpAfterDragging_();
  if(this.dragging_) {
    this.maybeReinitTouchEvent_(e);
    this.dragging_ = false;
    var x = this.limitX(this.deltaX);
    var y = this.limitY(this.deltaY);
    var dragCanceled = opt_dragCanceled || e.type == goog.events.EventType.TOUCHCANCEL;
    this.dispatchEvent(new goog.fx.DragEvent(goog.fx.Dragger.EventType.END, this, e.clientX, e.clientY, e, x, y, dragCanceled))
  }else {
    this.dispatchEvent(goog.fx.Dragger.EventType.EARLY_CANCEL)
  }
  if(e.type == goog.events.EventType.TOUCHEND || e.type == goog.events.EventType.TOUCHCANCEL) {
    e.preventDefault()
  }
};
goog.fx.Dragger.prototype.endDragCancel = function(e) {
  this.endDrag(e, true)
};
goog.fx.Dragger.prototype.maybeReinitTouchEvent_ = function(e) {
  var type = e.type;
  if(type == goog.events.EventType.TOUCHSTART || type == goog.events.EventType.TOUCHMOVE) {
    e.init(e.getBrowserEvent().targetTouches[0], e.currentTarget)
  }else {
    if(type == goog.events.EventType.TOUCHEND || type == goog.events.EventType.TOUCHCANCEL) {
      e.init(e.getBrowserEvent().changedTouches[0], e.currentTarget)
    }
  }
};
goog.fx.Dragger.prototype.handleMove_ = function(e) {
  if(this.enabled_) {
    this.maybeReinitTouchEvent_(e);
    var sign = this.useRightPositioningForRtl_ && this.isRightToLeft_() ? -1 : 1;
    var dx = sign * (e.clientX - this.clientX);
    var dy = e.clientY - this.clientY;
    this.clientX = e.clientX;
    this.clientY = e.clientY;
    this.screenX = e.screenX;
    this.screenY = e.screenY;
    if(!this.dragging_) {
      var diffX = this.startX - this.clientX;
      var diffY = this.startY - this.clientY;
      var distance = diffX * diffX + diffY * diffY;
      if(distance > this.hysteresisDistanceSquared_) {
        if(this.fireDragStart_(e)) {
          this.dragging_ = true
        }else {
          if(!this.isDisposed()) {
            this.endDrag(e)
          }
          return
        }
      }
    }
    var pos = this.calculatePosition_(dx, dy);
    var x = pos.x;
    var y = pos.y;
    if(this.dragging_) {
      var rv = this.dispatchEvent(new goog.fx.DragEvent(goog.fx.Dragger.EventType.BEFOREDRAG, this, e.clientX, e.clientY, e, x, y));
      if(rv) {
        this.doDrag(e, x, y, false);
        e.preventDefault()
      }
    }
  }
};
goog.fx.Dragger.prototype.calculatePosition_ = function(dx, dy) {
  var pageScroll = goog.dom.getDomHelper(this.document_).getDocumentScroll();
  dx += pageScroll.x - this.pageScroll.x;
  dy += pageScroll.y - this.pageScroll.y;
  this.pageScroll = pageScroll;
  this.deltaX += dx;
  this.deltaY += dy;
  var x = this.limitX(this.deltaX);
  var y = this.limitY(this.deltaY);
  return new goog.math.Coordinate(x, y)
};
goog.fx.Dragger.prototype.onScroll_ = function(e) {
  var pos = this.calculatePosition_(0, 0);
  e.clientX = this.clientX;
  e.clientY = this.clientY;
  this.doDrag(e, pos.x, pos.y, true)
};
goog.fx.Dragger.prototype.doDrag = function(e, x, y, dragFromScroll) {
  this.defaultAction(x, y);
  this.dispatchEvent(new goog.fx.DragEvent(goog.fx.Dragger.EventType.DRAG, this, e.clientX, e.clientY, e, x, y))
};
goog.fx.Dragger.prototype.limitX = function(x) {
  var rect = this.limits;
  var left = !isNaN(rect.left) ? rect.left : null;
  var width = !isNaN(rect.width) ? rect.width : 0;
  var maxX = left != null ? left + width : Infinity;
  var minX = left != null ? left : -Infinity;
  return Math.min(maxX, Math.max(minX, x))
};
goog.fx.Dragger.prototype.limitY = function(y) {
  var rect = this.limits;
  var top = !isNaN(rect.top) ? rect.top : null;
  var height = !isNaN(rect.height) ? rect.height : 0;
  var maxY = top != null ? top + height : Infinity;
  var minY = top != null ? top : -Infinity;
  return Math.min(maxY, Math.max(minY, y))
};
goog.fx.Dragger.prototype.defaultAction = function(x, y) {
  if(this.useRightPositioningForRtl_ && this.isRightToLeft_()) {
    this.target.style.right = x + "px"
  }else {
    this.target.style.left = x + "px"
  }
  this.target.style.top = y + "px"
};
goog.fx.Dragger.prototype.isDragging = function() {
  return this.dragging_
};
goog.fx.DragEvent = function(type, dragobj, clientX, clientY, browserEvent, opt_actX, opt_actY, opt_dragCanceled) {
  goog.events.Event.call(this, type);
  this.clientX = clientX;
  this.clientY = clientY;
  this.browserEvent = browserEvent;
  this.left = goog.isDef(opt_actX) ? opt_actX : dragobj.deltaX;
  this.top = goog.isDef(opt_actY) ? opt_actY : dragobj.deltaY;
  this.dragger = dragobj;
  this.dragCanceled = !!opt_dragCanceled
};
goog.inherits(goog.fx.DragEvent, goog.events.Event);
goog.provide("annotorious.dom");
goog.require("goog.fx.Dragger");
annotorious.dom.getOffset = function(el) {
  var _x = 0;
  var _y = 0;
  while(el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
    _x += el.offsetLeft - el.scrollLeft;
    _y += el.offsetTop - el.scrollTop;
    el = el.offsetParent
  }
  return{top:_y, left:_x}
};
annotorious.dom.isInViewport = function(el) {
  var top = el.offsetTop;
  var left = el.offsetLeft;
  var width = el.offsetWidth;
  var height = el.offsetHeight;
  while(el.offsetParent) {
    el = el.offsetParent;
    top += el.offsetTop;
    left += el.offsetLeft
  }
  return top < window.pageYOffset + window.innerHeight && left < window.pageXOffset + window.innerWidth && top + height > window.pageYOffset && left + width > window.pageXOffset
};
annotorious.dom.addOnLoadHandler = function(fn) {
  if(window.addEventListener) {
    window.addEventListener("load", fn, false)
  }else {
    if(window.attachEvent) {
      window.attachEvent("onload", fn)
    }
  }
};
annotorious.dom.makeHResizable = function(div, opt_callback) {
  var handle = goog.dom.createElement("div");
  goog.style.setStyle(handle, "position", "absolute");
  goog.style.setStyle(handle, "top", "0px");
  goog.style.setStyle(handle, "right", "0px");
  goog.style.setStyle(handle, "width", "5px");
  goog.style.setStyle(handle, "height", "100%");
  goog.style.setStyle(handle, "cursor", "e-resize");
  goog.dom.appendChild(div, handle);
  var div_border = goog.style.getBorderBox(div);
  var width_limit = goog.style.getBounds(div).width - div_border.right - div_border.left;
  var dragger = new goog.fx.Dragger(handle);
  dragger.setLimits(new goog.math.Rect(width_limit, 0, 800, 0));
  dragger.defaultAction = function(x) {
    goog.style.setStyle(div, "width", x + "px");
    if(opt_callback) {
      opt_callback()
    }
  }
};
annotorious.dom.toAbsoluteURL = function(url) {
  if(url.indexOf("://") > 0) {
    return url
  }else {
    var link = document.createElement("a");
    link.href = url;
    return link.protocol + "//" + link.host + link.pathname
  }
};
goog.provide("annotorious.events");
goog.require("goog.array");
goog.require("goog.events");
annotorious.events.EventBroker = function() {
  this._handlers = []
};
annotorious.events.EventBroker.prototype.addHandler = function(type, handler) {
  if(!this._handlers[type]) {
    this._handlers[type] = []
  }
  this._handlers[type].push(handler)
};
annotorious.events.EventBroker.prototype.removeHandler = function(type, handler) {
  var handlers = this._handlers[type];
  if(handlers) {
    goog.array.remove(handlers, handler)
  }
};
annotorious.events.EventBroker.prototype.fireEvent = function(type, opt_event, opt_extra) {
  var cancelEvent = false;
  var handlers = this._handlers[type];
  if(handlers) {
    goog.array.forEach(handlers, function(handler, idx, array) {
      var retVal = handler(opt_event, opt_extra);
      if(goog.isDef(retVal) && !retVal) {
        cancelEvent = true
      }
    })
  }
  return cancelEvent
};
annotorious.events.EventType = {MOUSE_OVER_ANNOTATABLE_ITEM:"onMouseOverItem", MOUSE_OUT_OF_ANNOTATABLE_ITEM:"onMouseOutOfItem", MOUSE_OVER_ANNOTATION:"onMouseOverAnnotation", MOUSE_OUT_OF_ANNOTATION:"onMouseOutOfAnnotation", SELECTION_STARTED:"onSelectionStarted", SELECTION_CANCELED:"onSelectionCanceled", SELECTION_COMPLETED:"onSelectionCompleted", SELECTION_CHANGED:"onSelectionChanged", EDITOR_SHOWN:"onEditorShown", POPUP_SHOWN:"onPopupShown", BEFORE_POPUP_HIDE:"beforePopupHide", BEFORE_ANNOTATION_REMOVED:"beforeAnnotationRemoved", 
ANNOTATION_REMOVED:"onAnnotationRemoved", ANNOTATION_CREATED:"onAnnotationCreated", ANNOTATION_UPDATED:"onAnnotationUpdated", ANNOTATION_CLICKED:"onAnnotationClicked"};
goog.provide("goog.iter");
goog.provide("goog.iter.Iterator");
goog.provide("goog.iter.StopIteration");
goog.require("goog.array");
goog.require("goog.asserts");
goog.iter.Iterable;
if("StopIteration" in goog.global) {
  goog.iter.StopIteration = goog.global["StopIteration"]
}else {
  goog.iter.StopIteration = Error("StopIteration")
}
goog.iter.Iterator = function() {
};
goog.iter.Iterator.prototype.next = function() {
  throw goog.iter.StopIteration;
};
goog.iter.Iterator.prototype.__iterator__ = function(opt_keys) {
  return this
};
goog.iter.toIterator = function(iterable) {
  if(iterable instanceof goog.iter.Iterator) {
    return iterable
  }
  if(typeof iterable.__iterator__ == "function") {
    return iterable.__iterator__(false)
  }
  if(goog.isArrayLike(iterable)) {
    var i = 0;
    var newIter = new goog.iter.Iterator;
    newIter.next = function() {
      while(true) {
        if(i >= iterable.length) {
          throw goog.iter.StopIteration;
        }
        if(!(i in iterable)) {
          i++;
          continue
        }
        return iterable[i++]
      }
    };
    return newIter
  }
  throw Error("Not implemented");
};
goog.iter.forEach = function(iterable, f, opt_obj) {
  if(goog.isArrayLike(iterable)) {
    try {
      goog.array.forEach(iterable, f, opt_obj)
    }catch(ex) {
      if(ex !== goog.iter.StopIteration) {
        throw ex;
      }
    }
  }else {
    iterable = goog.iter.toIterator(iterable);
    try {
      while(true) {
        f.call(opt_obj, iterable.next(), undefined, iterable)
      }
    }catch(ex) {
      if(ex !== goog.iter.StopIteration) {
        throw ex;
      }
    }
  }
};
goog.iter.filter = function(iterable, f, opt_obj) {
  var iterator = goog.iter.toIterator(iterable);
  var newIter = new goog.iter.Iterator;
  newIter.next = function() {
    while(true) {
      var val = iterator.next();
      if(f.call(opt_obj, val, undefined, iterator)) {
        return val
      }
    }
  };
  return newIter
};
goog.iter.range = function(startOrStop, opt_stop, opt_step) {
  var start = 0;
  var stop = startOrStop;
  var step = opt_step || 1;
  if(arguments.length > 1) {
    start = startOrStop;
    stop = opt_stop
  }
  if(step == 0) {
    throw Error("Range step argument must not be zero");
  }
  var newIter = new goog.iter.Iterator;
  newIter.next = function() {
    if(step > 0 && start >= stop || step < 0 && start <= stop) {
      throw goog.iter.StopIteration;
    }
    var rv = start;
    start += step;
    return rv
  };
  return newIter
};
goog.iter.join = function(iterable, deliminator) {
  return goog.iter.toArray(iterable).join(deliminator)
};
goog.iter.map = function(iterable, f, opt_obj) {
  var iterator = goog.iter.toIterator(iterable);
  var newIter = new goog.iter.Iterator;
  newIter.next = function() {
    while(true) {
      var val = iterator.next();
      return f.call(opt_obj, val, undefined, iterator)
    }
  };
  return newIter
};
goog.iter.reduce = function(iterable, f, val, opt_obj) {
  var rval = val;
  goog.iter.forEach(iterable, function(val) {
    rval = f.call(opt_obj, rval, val)
  });
  return rval
};
goog.iter.some = function(iterable, f, opt_obj) {
  iterable = goog.iter.toIterator(iterable);
  try {
    while(true) {
      if(f.call(opt_obj, iterable.next(), undefined, iterable)) {
        return true
      }
    }
  }catch(ex) {
    if(ex !== goog.iter.StopIteration) {
      throw ex;
    }
  }
  return false
};
goog.iter.every = function(iterable, f, opt_obj) {
  iterable = goog.iter.toIterator(iterable);
  try {
    while(true) {
      if(!f.call(opt_obj, iterable.next(), undefined, iterable)) {
        return false
      }
    }
  }catch(ex) {
    if(ex !== goog.iter.StopIteration) {
      throw ex;
    }
  }
  return true
};
goog.iter.chain = function(var_args) {
  var args = arguments;
  var length = args.length;
  var i = 0;
  var newIter = new goog.iter.Iterator;
  newIter.next = function() {
    try {
      if(i >= length) {
        throw goog.iter.StopIteration;
      }
      var current = goog.iter.toIterator(args[i]);
      return current.next()
    }catch(ex) {
      if(ex !== goog.iter.StopIteration || i >= length) {
        throw ex;
      }else {
        i++;
        return this.next()
      }
    }
  };
  return newIter
};
goog.iter.dropWhile = function(iterable, f, opt_obj) {
  var iterator = goog.iter.toIterator(iterable);
  var newIter = new goog.iter.Iterator;
  var dropping = true;
  newIter.next = function() {
    while(true) {
      var val = iterator.next();
      if(dropping && f.call(opt_obj, val, undefined, iterator)) {
        continue
      }else {
        dropping = false
      }
      return val
    }
  };
  return newIter
};
goog.iter.takeWhile = function(iterable, f, opt_obj) {
  var iterator = goog.iter.toIterator(iterable);
  var newIter = new goog.iter.Iterator;
  var taking = true;
  newIter.next = function() {
    while(true) {
      if(taking) {
        var val = iterator.next();
        if(f.call(opt_obj, val, undefined, iterator)) {
          return val
        }else {
          taking = false
        }
      }else {
        throw goog.iter.StopIteration;
      }
    }
  };
  return newIter
};
goog.iter.toArray = function(iterable) {
  if(goog.isArrayLike(iterable)) {
    return goog.array.toArray(iterable)
  }
  iterable = goog.iter.toIterator(iterable);
  var array = [];
  goog.iter.forEach(iterable, function(val) {
    array.push(val)
  });
  return array
};
goog.iter.equals = function(iterable1, iterable2) {
  iterable1 = goog.iter.toIterator(iterable1);
  iterable2 = goog.iter.toIterator(iterable2);
  var b1, b2;
  try {
    while(true) {
      b1 = b2 = false;
      var val1 = iterable1.next();
      b1 = true;
      var val2 = iterable2.next();
      b2 = true;
      if(val1 != val2) {
        return false
      }
    }
  }catch(ex) {
    if(ex !== goog.iter.StopIteration) {
      throw ex;
    }else {
      if(b1 && !b2) {
        return false
      }
      if(!b2) {
        try {
          val2 = iterable2.next();
          return false
        }catch(ex1) {
          if(ex1 !== goog.iter.StopIteration) {
            throw ex1;
          }
          return true
        }
      }
    }
  }
  return false
};
goog.iter.nextOrValue = function(iterable, defaultValue) {
  try {
    return goog.iter.toIterator(iterable).next()
  }catch(e) {
    if(e != goog.iter.StopIteration) {
      throw e;
    }
    return defaultValue
  }
};
goog.iter.product = function(var_args) {
  var someArrayEmpty = goog.array.some(arguments, function(arr) {
    return!arr.length
  });
  if(someArrayEmpty || !arguments.length) {
    return new goog.iter.Iterator
  }
  var iter = new goog.iter.Iterator;
  var arrays = arguments;
  var indicies = goog.array.repeat(0, arrays.length);
  iter.next = function() {
    if(indicies) {
      var retVal = goog.array.map(indicies, function(valueIndex, arrayIndex) {
        return arrays[arrayIndex][valueIndex]
      });
      for(var i = indicies.length - 1;i >= 0;i--) {
        goog.asserts.assert(indicies);
        if(indicies[i] < arrays[i].length - 1) {
          indicies[i]++;
          break
        }
        if(i == 0) {
          indicies = null;
          break
        }
        indicies[i] = 0
      }
      return retVal
    }
    throw goog.iter.StopIteration;
  };
  return iter
};
goog.iter.cycle = function(iterable) {
  var baseIterator = goog.iter.toIterator(iterable);
  var cache = [];
  var cacheIndex = 0;
  var iter = new goog.iter.Iterator;
  var useCache = false;
  iter.next = function() {
    var returnElement = null;
    if(!useCache) {
      try {
        returnElement = baseIterator.next();
        cache.push(returnElement);
        return returnElement
      }catch(e) {
        if(e != goog.iter.StopIteration || goog.array.isEmpty(cache)) {
          throw e;
        }
        useCache = true
      }
    }
    returnElement = cache[cacheIndex];
    cacheIndex = (cacheIndex + 1) % cache.length;
    return returnElement
  };
  return iter
};
goog.provide("goog.structs");
goog.require("goog.array");
goog.require("goog.object");
goog.structs.getCount = function(col) {
  if(typeof col.getCount == "function") {
    return col.getCount()
  }
  if(goog.isArrayLike(col) || goog.isString(col)) {
    return col.length
  }
  return goog.object.getCount(col)
};
goog.structs.getValues = function(col) {
  if(typeof col.getValues == "function") {
    return col.getValues()
  }
  if(goog.isString(col)) {
    return col.split("")
  }
  if(goog.isArrayLike(col)) {
    var rv = [];
    var l = col.length;
    for(var i = 0;i < l;i++) {
      rv.push(col[i])
    }
    return rv
  }
  return goog.object.getValues(col)
};
goog.structs.getKeys = function(col) {
  if(typeof col.getKeys == "function") {
    return col.getKeys()
  }
  if(typeof col.getValues == "function") {
    return undefined
  }
  if(goog.isArrayLike(col) || goog.isString(col)) {
    var rv = [];
    var l = col.length;
    for(var i = 0;i < l;i++) {
      rv.push(i)
    }
    return rv
  }
  return goog.object.getKeys(col)
};
goog.structs.contains = function(col, val) {
  if(typeof col.contains == "function") {
    return col.contains(val)
  }
  if(typeof col.containsValue == "function") {
    return col.containsValue(val)
  }
  if(goog.isArrayLike(col) || goog.isString(col)) {
    return goog.array.contains(col, val)
  }
  return goog.object.containsValue(col, val)
};
goog.structs.isEmpty = function(col) {
  if(typeof col.isEmpty == "function") {
    return col.isEmpty()
  }
  if(goog.isArrayLike(col) || goog.isString(col)) {
    return goog.array.isEmpty(col)
  }
  return goog.object.isEmpty(col)
};
goog.structs.clear = function(col) {
  if(typeof col.clear == "function") {
    col.clear()
  }else {
    if(goog.isArrayLike(col)) {
      goog.array.clear(col)
    }else {
      goog.object.clear(col)
    }
  }
};
goog.structs.forEach = function(col, f, opt_obj) {
  if(typeof col.forEach == "function") {
    col.forEach(f, opt_obj)
  }else {
    if(goog.isArrayLike(col) || goog.isString(col)) {
      goog.array.forEach(col, f, opt_obj)
    }else {
      var keys = goog.structs.getKeys(col);
      var values = goog.structs.getValues(col);
      var l = values.length;
      for(var i = 0;i < l;i++) {
        f.call(opt_obj, values[i], keys && keys[i], col)
      }
    }
  }
};
goog.structs.filter = function(col, f, opt_obj) {
  if(typeof col.filter == "function") {
    return col.filter(f, opt_obj)
  }
  if(goog.isArrayLike(col) || goog.isString(col)) {
    return goog.array.filter(col, f, opt_obj)
  }
  var rv;
  var keys = goog.structs.getKeys(col);
  var values = goog.structs.getValues(col);
  var l = values.length;
  if(keys) {
    rv = {};
    for(var i = 0;i < l;i++) {
      if(f.call(opt_obj, values[i], keys[i], col)) {
        rv[keys[i]] = values[i]
      }
    }
  }else {
    rv = [];
    for(var i = 0;i < l;i++) {
      if(f.call(opt_obj, values[i], undefined, col)) {
        rv.push(values[i])
      }
    }
  }
  return rv
};
goog.structs.map = function(col, f, opt_obj) {
  if(typeof col.map == "function") {
    return col.map(f, opt_obj)
  }
  if(goog.isArrayLike(col) || goog.isString(col)) {
    return goog.array.map(col, f, opt_obj)
  }
  var rv;
  var keys = goog.structs.getKeys(col);
  var values = goog.structs.getValues(col);
  var l = values.length;
  if(keys) {
    rv = {};
    for(var i = 0;i < l;i++) {
      rv[keys[i]] = f.call(opt_obj, values[i], keys[i], col)
    }
  }else {
    rv = [];
    for(var i = 0;i < l;i++) {
      rv[i] = f.call(opt_obj, values[i], undefined, col)
    }
  }
  return rv
};
goog.structs.some = function(col, f, opt_obj) {
  if(typeof col.some == "function") {
    return col.some(f, opt_obj)
  }
  if(goog.isArrayLike(col) || goog.isString(col)) {
    return goog.array.some(col, f, opt_obj)
  }
  var keys = goog.structs.getKeys(col);
  var values = goog.structs.getValues(col);
  var l = values.length;
  for(var i = 0;i < l;i++) {
    if(f.call(opt_obj, values[i], keys && keys[i], col)) {
      return true
    }
  }
  return false
};
goog.structs.every = function(col, f, opt_obj) {
  if(typeof col.every == "function") {
    return col.every(f, opt_obj)
  }
  if(goog.isArrayLike(col) || goog.isString(col)) {
    return goog.array.every(col, f, opt_obj)
  }
  var keys = goog.structs.getKeys(col);
  var values = goog.structs.getValues(col);
  var l = values.length;
  for(var i = 0;i < l;i++) {
    if(!f.call(opt_obj, values[i], keys && keys[i], col)) {
      return false
    }
  }
  return true
};
goog.provide("goog.structs.Map");
goog.require("goog.iter.Iterator");
goog.require("goog.iter.StopIteration");
goog.require("goog.object");
goog.require("goog.structs");
goog.structs.Map = function(opt_map, var_args) {
  this.map_ = {};
  this.keys_ = [];
  var argLength = arguments.length;
  if(argLength > 1) {
    if(argLength % 2) {
      throw Error("Uneven number of arguments");
    }
    for(var i = 0;i < argLength;i += 2) {
      this.set(arguments[i], arguments[i + 1])
    }
  }else {
    if(opt_map) {
      this.addAll(opt_map)
    }
  }
};
goog.structs.Map.prototype.count_ = 0;
goog.structs.Map.prototype.version_ = 0;
goog.structs.Map.prototype.getCount = function() {
  return this.count_
};
goog.structs.Map.prototype.getValues = function() {
  this.cleanupKeysArray_();
  var rv = [];
  for(var i = 0;i < this.keys_.length;i++) {
    var key = this.keys_[i];
    rv.push(this.map_[key])
  }
  return rv
};
goog.structs.Map.prototype.getKeys = function() {
  this.cleanupKeysArray_();
  return this.keys_.concat()
};
goog.structs.Map.prototype.containsKey = function(key) {
  return goog.structs.Map.hasKey_(this.map_, key)
};
goog.structs.Map.prototype.containsValue = function(val) {
  for(var i = 0;i < this.keys_.length;i++) {
    var key = this.keys_[i];
    if(goog.structs.Map.hasKey_(this.map_, key) && this.map_[key] == val) {
      return true
    }
  }
  return false
};
goog.structs.Map.prototype.equals = function(otherMap, opt_equalityFn) {
  if(this === otherMap) {
    return true
  }
  if(this.count_ != otherMap.getCount()) {
    return false
  }
  var equalityFn = opt_equalityFn || goog.structs.Map.defaultEquals;
  this.cleanupKeysArray_();
  for(var key, i = 0;key = this.keys_[i];i++) {
    if(!equalityFn(this.get(key), otherMap.get(key))) {
      return false
    }
  }
  return true
};
goog.structs.Map.defaultEquals = function(a, b) {
  return a === b
};
goog.structs.Map.prototype.isEmpty = function() {
  return this.count_ == 0
};
goog.structs.Map.prototype.clear = function() {
  this.map_ = {};
  this.keys_.length = 0;
  this.count_ = 0;
  this.version_ = 0
};
goog.structs.Map.prototype.remove = function(key) {
  if(goog.structs.Map.hasKey_(this.map_, key)) {
    delete this.map_[key];
    this.count_--;
    this.version_++;
    if(this.keys_.length > 2 * this.count_) {
      this.cleanupKeysArray_()
    }
    return true
  }
  return false
};
goog.structs.Map.prototype.cleanupKeysArray_ = function() {
  if(this.count_ != this.keys_.length) {
    var srcIndex = 0;
    var destIndex = 0;
    while(srcIndex < this.keys_.length) {
      var key = this.keys_[srcIndex];
      if(goog.structs.Map.hasKey_(this.map_, key)) {
        this.keys_[destIndex++] = key
      }
      srcIndex++
    }
    this.keys_.length = destIndex
  }
  if(this.count_ != this.keys_.length) {
    var seen = {};
    var srcIndex = 0;
    var destIndex = 0;
    while(srcIndex < this.keys_.length) {
      var key = this.keys_[srcIndex];
      if(!goog.structs.Map.hasKey_(seen, key)) {
        this.keys_[destIndex++] = key;
        seen[key] = 1
      }
      srcIndex++
    }
    this.keys_.length = destIndex
  }
};
goog.structs.Map.prototype.get = function(key, opt_val) {
  if(goog.structs.Map.hasKey_(this.map_, key)) {
    return this.map_[key]
  }
  return opt_val
};
goog.structs.Map.prototype.set = function(key, value) {
  if(!goog.structs.Map.hasKey_(this.map_, key)) {
    this.count_++;
    this.keys_.push(key);
    this.version_++
  }
  this.map_[key] = value
};
goog.structs.Map.prototype.addAll = function(map) {
  var keys, values;
  if(map instanceof goog.structs.Map) {
    keys = map.getKeys();
    values = map.getValues()
  }else {
    keys = goog.object.getKeys(map);
    values = goog.object.getValues(map)
  }
  for(var i = 0;i < keys.length;i++) {
    this.set(keys[i], values[i])
  }
};
goog.structs.Map.prototype.clone = function() {
  return new goog.structs.Map(this)
};
goog.structs.Map.prototype.transpose = function() {
  var transposed = new goog.structs.Map;
  for(var i = 0;i < this.keys_.length;i++) {
    var key = this.keys_[i];
    var value = this.map_[key];
    transposed.set(value, key)
  }
  return transposed
};
goog.structs.Map.prototype.toObject = function() {
  this.cleanupKeysArray_();
  var obj = {};
  for(var i = 0;i < this.keys_.length;i++) {
    var key = this.keys_[i];
    obj[key] = this.map_[key]
  }
  return obj
};
goog.structs.Map.prototype.getKeyIterator = function() {
  return this.__iterator__(true)
};
goog.structs.Map.prototype.getValueIterator = function() {
  return this.__iterator__(false)
};
goog.structs.Map.prototype.__iterator__ = function(opt_keys) {
  this.cleanupKeysArray_();
  var i = 0;
  var keys = this.keys_;
  var map = this.map_;
  var version = this.version_;
  var selfObj = this;
  var newIter = new goog.iter.Iterator;
  newIter.next = function() {
    while(true) {
      if(version != selfObj.version_) {
        throw Error("The map has changed since the iterator was created");
      }
      if(i >= keys.length) {
        throw goog.iter.StopIteration;
      }
      var key = keys[i++];
      return opt_keys ? key : map[key]
    }
  };
  return newIter
};
goog.structs.Map.hasKey_ = function(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key)
};
goog.provide("annotorious.shape.geom.Point");
annotorious.shape.geom.Point = function(x, y) {
  this.x = x;
  this.y = y
};
goog.provide("annotorious.shape.geom.Polygon");
goog.require("annotorious.shape.geom.Point");
annotorious.shape.geom.Polygon = function(points) {
  this.points = points
};
annotorious.shape.geom.Polygon.computeArea = function(points) {
  var area = 0;
  var j = points.length - 1;
  for(var i = 0;i < points.length;i++) {
    area += (points[j].x + points[i].x) * (points[j].y - points[i].y);
    j = i
  }
  return area / 2
};
annotorious.shape.geom.Polygon.isClockwise = function(points) {
  return annotorious.shape.geom.Polygon.computeArea(points) < 0
};
annotorious.shape.geom.Polygon.computeCentroid = function(points) {
  var x = 0;
  var y = 0;
  var f;
  var j = points.length - 1;
  for(var i = 0;i < points.length;i++) {
    f = points[i].x * points[j].y - points[j].x * points[i].y;
    x += (points[i].x + points[j].x) * f;
    y += (points[i].y + points[j].y) * f;
    j = i
  }
  f = annotorious.shape.geom.Polygon.computeArea(points) * 6;
  return new annotorious.shape.geom.Point(Math.abs(x / f), Math.abs(y / f))
};
annotorious.shape.geom.Polygon._expandTriangle = function(points, delta) {
  function signum(number) {
    return number > 0 ? 1 : number < 0 ? -1 : 0
  }
  function shiftAlongAxis(px, centroid, delta) {
    var axis = {x:px.x - centroid.x, y:px.y - centroid.y};
    var sign_delta = signum(delta);
    var sign_x = signum(axis.x) * sign_delta;
    var sign_y = signum(axis.y) * sign_delta;
    var dy = Math.sqrt(Math.pow(delta, 2) / (1 + Math.pow(axis.x / axis.y, 2)));
    var dx = axis.x / axis.y * dy;
    return{x:px.x + Math.abs(dx) * sign_x, y:px.y + Math.abs(dy) * sign_y}
  }
  var centroid = annotorious.shape.geom.Polygon.computeCentroid(points);
  var expanded = [];
  for(var i = 0;i < points.length;i++) {
    var sign = annotorious.shape.geom.Polygon.isClockwise(points) ? -1 : 1;
    expanded.push(shiftAlongAxis(points[i], centroid, sign * delta))
  }
  return expanded
};
annotorious.shape.geom.Polygon.expandPolygon = function(points, delta) {
  var sign = annotorious.shape.geom.Polygon.isClockwise(points) ? -1 : 1;
  if(points.length < 4) {
    return annotorious.shape.geom.Polygon._expandTriangle(points, sign * delta)
  }
  var prev = points.length - 1;
  var next = 1;
  var expanded = [];
  for(var current = 0;current < points.length;current++) {
    var expTriangle = annotorious.shape.geom.Polygon._expandTriangle([points[prev], points[current], points[next]], sign * delta);
    expanded.push(expTriangle[1]);
    prev = current;
    next++;
    if(next > points.length - 1) {
      next = 0
    }
  }
  return expanded
};
goog.provide("annotorious.shape.geom.Rectangle");
annotorious.shape.geom.Rectangle = function(x, y, width, height) {
  if(width > 0) {
    this.x = x;
    this.width = width
  }else {
    this.x = x + width;
    this.width = -width
  }
  if(height > 0) {
    this.y = y;
    this.height = height
  }else {
    this.y = y + height;
    this.height = -height
  }
};
goog.provide("annotorious.shape");
goog.require("annotorious.shape.geom.Polygon");
goog.require("annotorious.shape.geom.Rectangle");
annotorious.shape.Shape = function(type, geometry, units, style) {
  this.type = type;
  this.geometry = geometry;
  if(units) {
    this.units = units
  }
  if(style) {
    this.style = style
  }else {
    this.style = {}
  }
};
annotorious.shape.ShapeType = {POINT:"point", RECTANGLE:"rect", POLYGON:"polygon"};
annotorious.shape.Units = {PIXEL:"pixel", FRACTION:"fraction"};
annotorious.shape.intersects = function(shape, px, py) {
  if(shape.type == annotorious.shape.ShapeType.RECTANGLE) {
    if(px < shape.geometry.x) {
      return false
    }
    if(py < shape.geometry.y) {
      return false
    }
    if(px > shape.geometry.x + shape.geometry.width) {
      return false
    }
    if(py > shape.geometry.y + shape.geometry.height) {
      return false
    }
    return true
  }else {
    if(shape.type == annotorious.shape.ShapeType.POLYGON) {
      var points = shape.geometry.points;
      var inside = false;
      var j = points.length - 1;
      for(var i = 0;i < points.length;i++) {
        if(points[i].y > py != points[j].y > py && px < (points[j].x - points[i].x) * (py - points[i].y) / (points[j].y - points[i].y) + points[i].x) {
          inside = !inside
        }
        j = i
      }
      return inside
    }
  }
  return false
};
annotorious.shape.getSize = function(shape) {
  if(shape.type == annotorious.shape.ShapeType.RECTANGLE) {
    return shape.geometry.width * shape.geometry.height
  }else {
    if(shape.type == annotorious.shape.ShapeType.POLYGON) {
      return Math.abs(annotorious.shape.geom.Polygon.computeArea(shape.geometry.points))
    }
  }
  return 0
};
annotorious.shape.getBoundingRect = function(shape) {
  if(shape.type == annotorious.shape.ShapeType.RECTANGLE) {
    return shape
  }else {
    if(shape.type == annotorious.shape.ShapeType.POLYGON) {
      var points = shape.geometry.points;
      var left = points[0].x;
      var right = points[0].x;
      var top = points[0].y;
      var bottom = points[0].y;
      for(var i = 1;i < points.length;i++) {
        if(points[i].x > right) {
          right = points[i].x
        }
        if(points[i].x < left) {
          left = points[i].x
        }
        if(points[i].y > bottom) {
          bottom = points[i].y
        }
        if(points[i].y < top) {
          top = points[i].y
        }
      }
      return new annotorious.shape.Shape(annotorious.shape.ShapeType.RECTANGLE, new annotorious.shape.geom.Rectangle(left, top, right - left, bottom - top), false, shape.style)
    }
  }
  return undefined
};
annotorious.shape.getCentroid = function(shape) {
  if(shape.type == annotorious.shape.ShapeType.RECTANGLE) {
    var rect = shape.geometry;
    return new annotorious.shape.geom.Point(rect.x + rect.width / 2, rect.y + rect.height / 2)
  }else {
    if(shape.type == annotorious.shape.ShapeType.POLYGON) {
      return annotorious.shape.geom.Polygon.computeCentroid(shape.geometry.points)
    }
  }
  return undefined
};
annotorious.shape.expand = function(shape, delta) {
  return new annotorious.shape.Shape(annotorious.shape.ShapeType.POLYGON, new annotorious.shape.geom.Polygon(annotorious.shape.geom.Polygon.expandPolygon(shape.geometry.points, delta)), false, shape.style)
};
annotorious.shape.transform = function(shape, transformationFn) {
  if(shape.type == annotorious.shape.ShapeType.RECTANGLE) {
    var geom = shape.geometry;
    var transformed = transformationFn(geom);
    return new annotorious.shape.Shape(annotorious.shape.ShapeType.RECTANGLE, transformed, false, shape.style)
  }else {
    if(shape.type == annotorious.shape.ShapeType.POLYGON) {
      var transformedPoints = [];
      goog.array.forEach(shape.geometry.points, function(pt) {
        transformedPoints.push(transformationFn(pt))
      });
      return new annotorious.shape.Shape(annotorious.shape.ShapeType.POLYGON, new annotorious.shape.geom.Polygon(transformedPoints), false, shape.style)
    }
  }
  return undefined
};
annotorious.shape.hashCode = function(shape) {
  return JSON.stringify(shape.geometry)
};
goog.provide("annotorious.Annotation");
goog.require("annotorious.shape");
annotorious.Annotation = function(src, text, shape) {
  this.src = src;
  this.text = text;
  this.shapes = [shape];
  this["context"] = document.URL
};
goog.provide("annotorious.mediatypes.Module");
goog.require("goog.array");
goog.require("goog.dom");
goog.require("goog.events");
goog.require("goog.structs.Map");
goog.require("annotorious.Annotation");
annotorious.mediatypes.Module = function() {
};
annotorious.mediatypes.Module.prototype._initFields = function(opt_preload_fn) {
  this._annotators = new goog.structs.Map;
  this._eventHandlers = [];
  this._plugins = [];
  this._itemsToLoad = [];
  this._bufferedForAdding = [];
  this._bufferedForRemoval = [];
  this._cachedGlobalSettings = {hide_selection_widget:false, hide_annotations:false};
  this._cachedItemSettings = new goog.structs.Map;
  this._cachedProperties = undefined;
  this._preLoad = opt_preload_fn
};
annotorious.mediatypes.Module.prototype._getSettings = function(item_url) {
  var settings = this._cachedItemSettings.get(item_url);
  if(!settings) {
    settings = {hide_selection_widget:false, hide_annotations:false};
    this._cachedItemSettings.set(item_url, settings)
  }
  return settings
};
annotorious.mediatypes.Module.prototype._initAnnotator = function(item) {
  var self = this, item_src = this.getItemURL(item);
  var annotator = this.newAnnotator(item);
  var addedAnnotations = [];
  var removedAnnotations = [];
  goog.array.forEach(this._eventHandlers, function(eventHandler) {
    annotator.addHandler(eventHandler.type, eventHandler.handler)
  });
  goog.array.forEach(this._plugins, function(plugin) {
    self._initPlugin(plugin, annotator)
  });
  goog.array.forEach(this._bufferedForAdding, function(annotation) {
    if(annotation.src == item_src) {
      annotator.addAnnotation(annotation);
      addedAnnotations.push(annotation)
    }
  });
  goog.array.forEach(this._bufferedForRemoval, function(annotation) {
    if(annotation.src == item_src) {
      annotator.removeAnnotation(annotation);
      removedAnnotations.push(annotation)
    }
  });
  goog.array.forEach(addedAnnotations, function(annotation) {
    goog.array.remove(self._bufferedForAdding, annotation)
  });
  goog.array.forEach(removedAnnotations, function(annotation) {
    goog.array.remove(self._bufferedForRemoval, annotation)
  });
  var settings = this._cachedItemSettings.get(item_src);
  if(settings) {
    if(settings.hide_selection_widget) {
      annotator.hideSelectionWidget()
    }
    if(settings.hide_annotations) {
      annotator.hideAnnotations()
    }
    this._cachedItemSettings.remove(item_src)
  }else {
    if(this._cachedGlobalSettings.hide_selection_widget) {
      annotator.hideSelectionWidget()
    }
    if(this._cachedGlobalSettings.hide_annotations) {
      annotator.hideAnnotations()
    }
  }
  if(this._cachedProperties) {
    annotator.setProperties(this._cachedProperties)
  }
  this._annotators.set(item_src, annotator);
  goog.array.remove(this._itemsToLoad, item)
};
annotorious.mediatypes.Module.prototype._initPlugin = function(plugin, annotator) {
  if(plugin.onInitAnnotator) {
    plugin.onInitAnnotator(annotator)
  }
};
annotorious.mediatypes.Module.prototype._lazyLoad = function() {
  var item, i;
  for(i = this._itemsToLoad.length;i > 0;i--) {
    item = this._itemsToLoad[i - 1];
    if(annotorious.dom.isInViewport(item)) {
      this._initAnnotator(item)
    }
  }
};
annotorious.mediatypes.Module.prototype._setAnnotationVisibility = function(opt_item_url, visibility) {
  if(opt_item_url) {
    var annotator = this._annotators.get(opt_item_url);
    if(annotator) {
      if(visibility) {
        annotator.showAnnotations()
      }else {
        annotator.hideAnnotations()
      }
    }else {
      this._getSettings(opt_item_url).hide_annotations = visibility
    }
  }else {
    goog.array.forEach(this._annotators.getValues(), function(annotator) {
      if(visibility) {
        annotator.showAnnotations()
      }else {
        annotator.hideAnnotations()
      }
    });
    this._cachedGlobalSettings.hide_annotations = !visibility;
    goog.array.forEach(this._cachedItemSettings.getValues(), function(settings) {
      settings.hide_annotations = !visibility
    })
  }
};
annotorious.mediatypes.Module.prototype._setSelectionWidgetVisibility = function(opt_item_url, visibility) {
  if(opt_item_url) {
    var annotator = this._annotators.get(opt_item_url);
    if(annotator) {
      if(visibility) {
        annotator.showSelectionWidget()
      }else {
        annotator.hideSelectionWidget()
      }
    }else {
      this._getSettings(opt_item_url).hide_selection_widget = visibility
    }
  }else {
    goog.array.forEach(this._annotators.getValues(), function(annotator) {
      if(visibility) {
        annotator.showSelectionWidget()
      }else {
        annotator.hideSelectionWidget()
      }
    });
    this._cachedGlobalSettings.hide_selection_widget = !visibility;
    goog.array.forEach(this._cachedItemSettings.getValues(), function(settings) {
      settings.hide_selection_widget = !visibility
    })
  }
};
annotorious.mediatypes.Module.prototype.activateSelector = function(opt_item_url_or_callback, opt_callback) {
  var item_url = undefined, callback = undefined;
  if(goog.isString(opt_item_url_or_callback)) {
    item_url = opt_item_url_or_callback;
    callback = opt_callback
  }else {
    if(goog.isFunction(opt_item_url_or_callback)) {
      callback = opt_item_url_or_callback
    }
  }
  if(item_url) {
    var annotator = this._annotators.get(item_url);
    if(annotator) {
      annotator.activateSelector(callback)
    }
  }else {
    goog.array.forEach(this._annotators.getValues(), function(annotator) {
      annotator.activateSelector(callback)
    })
  }
};
annotorious.mediatypes.Module.prototype.addAnnotation = function(annotation, opt_replace) {
  if(this.annotatesItem(annotation.src)) {
    var annotator = this._annotators.get(annotation.src);
    if(annotator) {
      annotator.addAnnotation(annotation, opt_replace)
    }else {
      this._bufferedForAdding.push(annotation);
      if(opt_replace) {
        goog.array.remove(this._bufferedForAdding, opt_replace)
      }
    }
  }
};
annotorious.mediatypes.Module.prototype.addHandler = function(type, handler) {
  goog.array.forEach(this._annotators.getValues(), function(annotator, idx, array) {
    annotator.addHandler(type, handler)
  });
  this._eventHandlers.push({type:type, handler:handler})
};
annotorious.mediatypes.Module.prototype.addPlugin = function(plugin) {
  this._plugins.push(plugin);
  var self = this;
  goog.array.forEach(this._annotators.getValues(), function(annotator) {
    self._initPlugin(plugin, annotator)
  })
};
annotorious.mediatypes.Module.prototype.annotatesItem = function(item_url) {
  if(this._annotators.containsKey(item_url)) {
    return true
  }else {
    var self = this;
    var item = goog.array.find(this._itemsToLoad, function(item) {
      return self.getItemURL(item) == item_url
    });
    return goog.isDefAndNotNull(item)
  }
};
annotorious.mediatypes.Module.prototype.destroy = function(opt_item_url) {
  if(opt_item_url) {
    var annotator = this._annotators.get(opt_item_url);
    if(annotator) {
      annotator.destroy();
      this._annotators.remove(opt_item_url)
    }
  }else {
    goog.array.forEach(this._annotators.getValues(), function(annotator) {
      annotator.destroy()
    });
    this._annotators.clear()
  }
};
annotorious.mediatypes.Module.prototype.getActiveSelector = function(item_url) {
  if(this.annotatesItem(item_url)) {
    var annotator = this._annotators.get(item_url);
    if(annotator) {
      return annotator.getActiveSelector().getName()
    }
  }
  return undefined
};
annotorious.mediatypes.Module.prototype.getAnnotations = function(opt_item_url) {
  if(opt_item_url) {
    var annotator = this._annotators.get(opt_item_url);
    if(annotator) {
      return annotator.getAnnotations()
    }else {
      return goog.array.filter(this._bufferedForAdding, function(annotation) {
        return annotation.src == opt_item_url
      })
    }
  }else {
    var annotations = [];
    goog.array.forEach(this._annotators.getValues(), function(annotator) {
      goog.array.extend(annotations, annotator.getAnnotations())
    });
    goog.array.extend(annotations, this._bufferedForAdding);
    return annotations
  }
};
annotorious.mediatypes.Module.prototype.getAvailableSelectors = function(item_url) {
  if(this.annotatesItem(item_url)) {
    var annotator = this._annotators.get(item_url);
    if(annotator) {
      return goog.array.map(annotator.getAvailableSelectors(), function(selector) {
        return selector.getName()
      })
    }
  }
  return undefined
};
annotorious.mediatypes.Module.prototype.hideAnnotations = function(opt_item_url) {
  this._setAnnotationVisibility(opt_item_url, false)
};
annotorious.mediatypes.Module.prototype.hideSelectionWidget = function(opt_item_url) {
  this._setSelectionWidgetVisibility(opt_item_url, false)
};
annotorious.mediatypes.Module.prototype.highlightAnnotation = function(annotation) {
  if(annotation) {
    if(this.annotatesItem(annotation.src)) {
      var annotator = this._annotators.get(annotation.src);
      if(annotator) {
        annotator.highlightAnnotation(annotation)
      }
    }
  }else {
    goog.array.forEach(this._annotators.getValues(), function(annotator) {
      annotator.highlightAnnotation()
    })
  }
};
annotorious.mediatypes.Module.prototype.init = function() {
  if(this._preLoad) {
    goog.array.extend(this._itemsToLoad, this._preLoad())
  }
  this._lazyLoad();
  var self = this;
  var key = goog.events.listen(window, goog.events.EventType.SCROLL, function() {
    if(self._itemsToLoad.length > 0) {
      self._lazyLoad()
    }else {
      goog.events.unlistenByKey(key)
    }
  })
};
annotorious.mediatypes.Module.prototype.makeAnnotatable = function(item) {
  if(this.supports(item)) {
    this._initAnnotator(item)
  }
};
annotorious.mediatypes.Module.prototype.removeAnnotation = function(annotation) {
  if(this.annotatesItem(annotation.src)) {
    var annotator = this._annotators.get(annotation.src);
    if(annotator) {
      annotator.removeAnnotation(annotation)
    }else {
      this._bufferedForRemoval.push(annotation)
    }
  }
};
annotorious.mediatypes.Module.prototype.removeCurrentSelection = function(item_url) {
  var annotator = this._annotators.get(item_url);
  annotator.stopSelection()
};
annotorious.mediatypes.Module.prototype.setActiveSelector = function(item_url, selector) {
  if(this.annotatesItem(item_url)) {
    var annotator = this._annotators.get(item_url);
    if(annotator) {
      annotator.setCurrentSelector(selector)
    }
  }
};
annotorious.mediatypes.Module.prototype.setProperties = function(props) {
  this._cachedProperties = props;
  goog.array.forEach(this._annotators.getValues(), function(annotator) {
    annotator.setProperties(props)
  })
};
annotorious.mediatypes.Module.prototype.showAnnotations = function(opt_item_url) {
  this._setAnnotationVisibility(opt_item_url, true)
};
annotorious.mediatypes.Module.prototype.showSelectionWidget = function(opt_item_url) {
  this._setSelectionWidgetVisibility(opt_item_url, true)
};
annotorious.mediatypes.Module.prototype.getItemURL = goog.abstractMethod;
annotorious.mediatypes.Module.prototype.newAnnotator = goog.abstractMethod;
annotorious.mediatypes.Module.prototype.supports = goog.abstractMethod;
goog.provide("goog.soy");
goog.require("goog.dom");
goog.require("goog.dom.NodeType");
goog.require("goog.dom.TagName");
goog.soy.renderElement = function(element, template, opt_templateData, opt_injectedData) {
  element.innerHTML = template(opt_templateData || goog.soy.defaultTemplateData_, undefined, opt_injectedData)
};
goog.soy.renderAsFragment = function(template, opt_templateData, opt_injectedData, opt_domHelper) {
  var dom = opt_domHelper || goog.dom.getDomHelper();
  return dom.htmlToDocumentFragment(template(opt_templateData || goog.soy.defaultTemplateData_, undefined, opt_injectedData))
};
goog.soy.renderAsElement = function(template, opt_templateData, opt_injectedData, opt_domHelper) {
  var dom = opt_domHelper || goog.dom.getDomHelper();
  var wrapper = dom.createElement(goog.dom.TagName.DIV);
  wrapper.innerHTML = template(opt_templateData || goog.soy.defaultTemplateData_, undefined, opt_injectedData);
  if(wrapper.childNodes.length == 1) {
    var firstChild = wrapper.firstChild;
    if(firstChild.nodeType == goog.dom.NodeType.ELEMENT) {
      return firstChild
    }
  }
  return wrapper
};
goog.soy.defaultTemplateData_ = {};
goog.provide("goog.string.StringBuffer");
goog.string.StringBuffer = function(opt_a1, var_args) {
  if(opt_a1 != null) {
    this.append.apply(this, arguments)
  }
};
goog.string.StringBuffer.prototype.buffer_ = "";
goog.string.StringBuffer.prototype.set = function(s) {
  this.buffer_ = "" + s
};
goog.string.StringBuffer.prototype.append = function(a1, opt_a2, var_args) {
  this.buffer_ += a1;
  if(opt_a2 != null) {
    for(var i = 1;i < arguments.length;i++) {
      this.buffer_ += arguments[i]
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
goog.provide("goog.string.html.HtmlParser");
goog.provide("goog.string.html.HtmlParser.EFlags");
goog.provide("goog.string.html.HtmlParser.Elements");
goog.provide("goog.string.html.HtmlParser.Entities");
goog.provide("goog.string.html.HtmlSaxHandler");
goog.string.html.HtmlParser = function() {
};
goog.string.html.HtmlParser.Entities = {lt:"<", gt:">", amp:"&", nbsp:"\u00a0", quot:'"', apos:"'"};
goog.string.html.HtmlParser.EFlags = {OPTIONAL_ENDTAG:1, EMPTY:2, CDATA:4, RCDATA:8, UNSAFE:16, FOLDABLE:32};
goog.string.html.HtmlParser.Elements = {"a":0, "abbr":0, "acronym":0, "address":0, "applet":goog.string.html.HtmlParser.EFlags.UNSAFE, "area":goog.string.html.HtmlParser.EFlags.EMPTY, "b":0, "base":goog.string.html.HtmlParser.EFlags.EMPTY | goog.string.html.HtmlParser.EFlags.UNSAFE, "basefont":goog.string.html.HtmlParser.EFlags.EMPTY | goog.string.html.HtmlParser.EFlags.UNSAFE, "bdo":0, "big":0, "blockquote":0, "body":goog.string.html.HtmlParser.EFlags.OPTIONAL_ENDTAG | goog.string.html.HtmlParser.EFlags.UNSAFE | 
goog.string.html.HtmlParser.EFlags.FOLDABLE, "br":goog.string.html.HtmlParser.EFlags.EMPTY, "button":0, "caption":0, "center":0, "cite":0, "code":0, "col":goog.string.html.HtmlParser.EFlags.EMPTY, "colgroup":goog.string.html.HtmlParser.EFlags.OPTIONAL_ENDTAG, "dd":goog.string.html.HtmlParser.EFlags.OPTIONAL_ENDTAG, "del":0, "dfn":0, "dir":0, "div":0, "dl":0, "dt":goog.string.html.HtmlParser.EFlags.OPTIONAL_ENDTAG, "em":0, "fieldset":0, "font":0, "form":0, "frame":goog.string.html.HtmlParser.EFlags.EMPTY | 
goog.string.html.HtmlParser.EFlags.UNSAFE, "frameset":goog.string.html.HtmlParser.EFlags.UNSAFE, "h1":0, "h2":0, "h3":0, "h4":0, "h5":0, "h6":0, "head":goog.string.html.HtmlParser.EFlags.OPTIONAL_ENDTAG | goog.string.html.HtmlParser.EFlags.UNSAFE | goog.string.html.HtmlParser.EFlags.FOLDABLE, "hr":goog.string.html.HtmlParser.EFlags.EMPTY, "html":goog.string.html.HtmlParser.EFlags.OPTIONAL_ENDTAG | goog.string.html.HtmlParser.EFlags.UNSAFE | goog.string.html.HtmlParser.EFlags.FOLDABLE, "i":0, "iframe":goog.string.html.HtmlParser.EFlags.UNSAFE | 
goog.string.html.HtmlParser.EFlags.CDATA, "img":goog.string.html.HtmlParser.EFlags.EMPTY, "input":goog.string.html.HtmlParser.EFlags.EMPTY, "ins":0, "isindex":goog.string.html.HtmlParser.EFlags.EMPTY | goog.string.html.HtmlParser.EFlags.UNSAFE, "kbd":0, "label":0, "legend":0, "li":goog.string.html.HtmlParser.EFlags.OPTIONAL_ENDTAG, "link":goog.string.html.HtmlParser.EFlags.EMPTY | goog.string.html.HtmlParser.EFlags.UNSAFE, "map":0, "menu":0, "meta":goog.string.html.HtmlParser.EFlags.EMPTY | goog.string.html.HtmlParser.EFlags.UNSAFE, 
"noframes":goog.string.html.HtmlParser.EFlags.UNSAFE | goog.string.html.HtmlParser.EFlags.CDATA, "noscript":goog.string.html.HtmlParser.EFlags.UNSAFE | goog.string.html.HtmlParser.EFlags.CDATA, "object":goog.string.html.HtmlParser.EFlags.UNSAFE, "ol":0, "optgroup":0, "option":goog.string.html.HtmlParser.EFlags.OPTIONAL_ENDTAG, "p":goog.string.html.HtmlParser.EFlags.OPTIONAL_ENDTAG, "param":goog.string.html.HtmlParser.EFlags.EMPTY | goog.string.html.HtmlParser.EFlags.UNSAFE, "pre":0, "q":0, "s":0, 
"samp":0, "script":goog.string.html.HtmlParser.EFlags.UNSAFE | goog.string.html.HtmlParser.EFlags.CDATA, "select":0, "small":0, "span":0, "strike":0, "strong":0, "style":goog.string.html.HtmlParser.EFlags.UNSAFE | goog.string.html.HtmlParser.EFlags.CDATA, "sub":0, "sup":0, "table":0, "tbody":goog.string.html.HtmlParser.EFlags.OPTIONAL_ENDTAG, "td":goog.string.html.HtmlParser.EFlags.OPTIONAL_ENDTAG, "textarea":goog.string.html.HtmlParser.EFlags.RCDATA, "tfoot":goog.string.html.HtmlParser.EFlags.OPTIONAL_ENDTAG, 
"th":goog.string.html.HtmlParser.EFlags.OPTIONAL_ENDTAG, "thead":goog.string.html.HtmlParser.EFlags.OPTIONAL_ENDTAG, "title":goog.string.html.HtmlParser.EFlags.RCDATA | goog.string.html.HtmlParser.EFlags.UNSAFE, "tr":goog.string.html.HtmlParser.EFlags.OPTIONAL_ENDTAG, "tt":0, "u":0, "ul":0, "var":0};
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
goog.string.html.HtmlParser.INSIDE_TAG_TOKEN_ = new RegExp("^\\s*(?:" + ("(?:" + "([a-z][a-z-]*)" + ("(" + "\\s*=\\s*" + ("(" + '"[^"]*"' + "|'[^']*'" + "|(?=[a-z][a-z-]*\\s*=)" + "|[^>\"'\\s]*" + ")") + ")") + "?" + ")") + "|(/?>)" + "|[^a-z\\s>]+)", "i");
goog.string.html.HtmlParser.OUTSIDE_TAG_TOKEN_ = new RegExp("^(?:" + "&(\\#[0-9]+|\\#[x][0-9a-f]+|\\w+);" + "|<[!]--[\\s\\S]*?--\>|<!\\w[^>]*>|<\\?[^>*]*>" + "|<(/)?([a-z][a-z0-9]*)" + "|([^<&>]+)" + "|([<&>]))", "i");
goog.string.html.HtmlParser.prototype.parse = function(handler, htmlText) {
  var htmlLower = null;
  var inTag = false;
  var attribs = [];
  var tagName;
  var eflags;
  var openTag;
  handler.startDoc();
  while(htmlText) {
    var regex = inTag ? goog.string.html.HtmlParser.INSIDE_TAG_TOKEN_ : goog.string.html.HtmlParser.OUTSIDE_TAG_TOKEN_;
    var m = htmlText.match(regex);
    htmlText = htmlText.substring(m[0].length);
    if(inTag) {
      if(m[1]) {
        var attribName = goog.string.html.toLowerCase(m[1]);
        var decodedValue;
        if(m[2]) {
          var encodedValue = m[3];
          switch(encodedValue.charCodeAt(0)) {
            case 34:
            ;
            case 39:
              encodedValue = encodedValue.substring(1, encodedValue.length - 1);
              break
          }
          decodedValue = this.unescapeEntities_(this.stripNULs_(encodedValue))
        }else {
          decodedValue = attribName
        }
        attribs.push(attribName, decodedValue)
      }else {
        if(m[4]) {
          if(eflags !== void 0) {
            if(openTag) {
              if(handler.startTag) {
                handler.startTag(tagName, attribs)
              }
            }else {
              if(handler.endTag) {
                handler.endTag(tagName)
              }
            }
          }
          if(openTag && eflags & (goog.string.html.HtmlParser.EFlags.CDATA | goog.string.html.HtmlParser.EFlags.RCDATA)) {
            if(htmlLower === null) {
              htmlLower = goog.string.html.toLowerCase(htmlText)
            }else {
              htmlLower = htmlLower.substring(htmlLower.length - htmlText.length)
            }
            var dataEnd = htmlLower.indexOf("</" + tagName);
            if(dataEnd < 0) {
              dataEnd = htmlText.length
            }
            if(eflags & goog.string.html.HtmlParser.EFlags.CDATA) {
              if(handler.cdata) {
                handler.cdata(htmlText.substring(0, dataEnd))
              }
            }else {
              if(handler.rcdata) {
                handler.rcdata(this.normalizeRCData_(htmlText.substring(0, dataEnd)))
              }
            }
            htmlText = htmlText.substring(dataEnd)
          }
          tagName = eflags = openTag = void 0;
          attribs.length = 0;
          inTag = false
        }
      }
    }else {
      if(m[1]) {
        handler.pcdata(m[0])
      }else {
        if(m[3]) {
          openTag = !m[2];
          inTag = true;
          tagName = goog.string.html.toLowerCase(m[3]);
          eflags = goog.string.html.HtmlParser.Elements.hasOwnProperty(tagName) ? goog.string.html.HtmlParser.Elements[tagName] : void 0
        }else {
          if(m[4]) {
            handler.pcdata(m[4])
          }else {
            if(m[5]) {
              switch(m[5]) {
                case "<":
                  handler.pcdata("&lt;");
                  break;
                case ">":
                  handler.pcdata("&gt;");
                  break;
                default:
                  handler.pcdata("&amp;");
                  break
              }
            }
          }
        }
      }
    }
  }
  handler.endDoc()
};
goog.string.html.HtmlParser.prototype.lookupEntity_ = function(name) {
  name = goog.string.html.toLowerCase(name);
  if(goog.string.html.HtmlParser.Entities.hasOwnProperty(name)) {
    return goog.string.html.HtmlParser.Entities[name]
  }
  var m = name.match(goog.string.html.HtmlParser.DECIMAL_ESCAPE_RE_);
  if(m) {
    return String.fromCharCode(parseInt(m[1], 10))
  }else {
    if(!!(m = name.match(goog.string.html.HtmlParser.HEX_ESCAPE_RE_))) {
      return String.fromCharCode(parseInt(m[1], 16))
    }
  }
  return""
};
goog.string.html.HtmlParser.prototype.stripNULs_ = function(s) {
  return s.replace(goog.string.html.HtmlParser.NULL_RE_, "")
};
goog.string.html.HtmlParser.prototype.unescapeEntities_ = function(s) {
  return s.replace(goog.string.html.HtmlParser.ENTITY_RE_, goog.bind(this.lookupEntity_, this))
};
goog.string.html.HtmlParser.prototype.normalizeRCData_ = function(rcdata) {
  return rcdata.replace(goog.string.html.HtmlParser.LOOSE_AMP_RE_, "&amp;$1").replace(goog.string.html.HtmlParser.LT_RE_, "&lt;").replace(goog.string.html.HtmlParser.GT_RE_, "&gt;")
};
goog.string.html.toLowerCase = function(str) {
  if("script" === "SCRIPT".toLowerCase()) {
    return str.toLowerCase()
  }else {
    return str.replace(/[A-Z]/g, function(ch) {
      return String.fromCharCode(ch.charCodeAt(0) | 32)
    })
  }
};
goog.string.html.HtmlSaxHandler = function() {
};
goog.string.html.HtmlSaxHandler.prototype.startTag = goog.abstractMethod;
goog.string.html.HtmlSaxHandler.prototype.endTag = goog.abstractMethod;
goog.string.html.HtmlSaxHandler.prototype.pcdata = goog.abstractMethod;
goog.string.html.HtmlSaxHandler.prototype.rcdata = goog.abstractMethod;
goog.string.html.HtmlSaxHandler.prototype.cdata = goog.abstractMethod;
goog.string.html.HtmlSaxHandler.prototype.startDoc = goog.abstractMethod;
goog.string.html.HtmlSaxHandler.prototype.endDoc = goog.abstractMethod;
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
goog.provide("goog.string.html.HtmlSanitizer");
goog.provide("goog.string.html.HtmlSanitizer.AttributeType");
goog.provide("goog.string.html.HtmlSanitizer.Attributes");
goog.provide("goog.string.html.htmlSanitize");
goog.require("goog.string.StringBuffer");
goog.require("goog.string.html.HtmlParser");
goog.require("goog.string.html.HtmlParser.EFlags");
goog.require("goog.string.html.HtmlParser.Elements");
goog.require("goog.string.html.HtmlSaxHandler");
goog.string.html.htmlSanitize = function(htmlText, opt_urlPolicy, opt_nmTokenPolicy) {
  var stringBuffer = new goog.string.StringBuffer;
  var handler = new goog.string.html.HtmlSanitizer(stringBuffer, opt_urlPolicy, opt_nmTokenPolicy);
  var parser = new goog.string.html.HtmlParser;
  parser.parse(handler, htmlText);
  return stringBuffer.toString()
};
goog.string.html.HtmlSanitizer = function(stringBuffer, opt_urlPolicy, opt_nmTokenPolicy) {
  goog.string.html.HtmlSaxHandler.call(this);
  this.stringBuffer_ = stringBuffer;
  this.stack_ = [];
  this.ignoring_ = false;
  this.urlPolicy_ = opt_urlPolicy;
  this.nmTokenPolicy_ = opt_nmTokenPolicy
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
goog.string.html.HtmlSanitizer.prototype.startTag = function(tagName, attribs) {
  if(this.ignoring_) {
    return
  }
  if(!goog.string.html.HtmlParser.Elements.hasOwnProperty(tagName)) {
    return
  }
  var eflags = goog.string.html.HtmlParser.Elements[tagName];
  if(eflags & goog.string.html.HtmlParser.EFlags.FOLDABLE) {
    return
  }else {
    if(eflags & goog.string.html.HtmlParser.EFlags.UNSAFE) {
      this.ignoring_ = !(eflags & goog.string.html.HtmlParser.EFlags.EMPTY);
      return
    }
  }
  attribs = this.sanitizeAttributes_(tagName, attribs);
  if(attribs) {
    if(!(eflags & goog.string.html.HtmlParser.EFlags.EMPTY)) {
      this.stack_.push(tagName)
    }
    this.stringBuffer_.append("<", tagName);
    for(var i = 0, n = attribs.length;i < n;i += 2) {
      var attribName = attribs[i], value = attribs[i + 1];
      if(value !== null && value !== void 0) {
        this.stringBuffer_.append(" ", attribName, '="', this.escapeAttrib_(value), '"')
      }
    }
    this.stringBuffer_.append(">")
  }
};
goog.string.html.HtmlSanitizer.prototype.endTag = function(tagName) {
  if(this.ignoring_) {
    this.ignoring_ = false;
    return
  }
  if(!goog.string.html.HtmlParser.Elements.hasOwnProperty(tagName)) {
    return
  }
  var eflags = goog.string.html.HtmlParser.Elements[tagName];
  if(!(eflags & (goog.string.html.HtmlParser.EFlags.UNSAFE | goog.string.html.HtmlParser.EFlags.EMPTY | goog.string.html.HtmlParser.EFlags.FOLDABLE))) {
    var index;
    if(eflags & goog.string.html.HtmlParser.EFlags.OPTIONAL_ENDTAG) {
      for(index = this.stack_.length;--index >= 0;) {
        var stackEl = this.stack_[index];
        if(stackEl === tagName) {
          break
        }
        if(!(goog.string.html.HtmlParser.Elements[stackEl] & goog.string.html.HtmlParser.EFlags.OPTIONAL_ENDTAG)) {
          return
        }
      }
    }else {
      for(index = this.stack_.length;--index >= 0;) {
        if(this.stack_[index] === tagName) {
          break
        }
      }
    }
    if(index < 0) {
      return
    }
    for(var i = this.stack_.length;--i > index;) {
      var stackEl = this.stack_[i];
      if(!(goog.string.html.HtmlParser.Elements[stackEl] & goog.string.html.HtmlParser.EFlags.OPTIONAL_ENDTAG)) {
        this.stringBuffer_.append("</", stackEl, ">")
      }
    }
    this.stack_.length = index;
    this.stringBuffer_.append("</", tagName, ">")
  }
};
goog.string.html.HtmlSanitizer.prototype.pcdata = function(text) {
  if(!this.ignoring_) {
    this.stringBuffer_.append(text)
  }
};
goog.string.html.HtmlSanitizer.prototype.rcdata = function(text) {
  if(!this.ignoring_) {
    this.stringBuffer_.append(text)
  }
};
goog.string.html.HtmlSanitizer.prototype.cdata = function(text) {
  if(!this.ignoring_) {
    this.stringBuffer_.append(text)
  }
};
goog.string.html.HtmlSanitizer.prototype.startDoc = function() {
  this.stack_ = [];
  this.ignoring_ = false
};
goog.string.html.HtmlSanitizer.prototype.endDoc = function() {
  for(var i = this.stack_.length;--i >= 0;) {
    this.stringBuffer_.append("</", this.stack_[i], ">")
  }
  this.stack_.length = 0
};
goog.string.html.HtmlSanitizer.prototype.escapeAttrib_ = function(s) {
  return s.replace(goog.string.html.HtmlParser.AMP_RE_, "&amp;").replace(goog.string.html.HtmlParser.LT_RE_, "&lt;").replace(goog.string.html.HtmlParser.GT_RE_, "&gt;").replace(goog.string.html.HtmlParser.QUOTE_RE_, "&#34;").replace(goog.string.html.HtmlParser.EQUALS_RE_, "&#61;")
};
goog.string.html.HtmlSanitizer.prototype.sanitizeAttributes_ = function(tagName, attribs) {
  for(var i = 0;i < attribs.length;i += 2) {
    var attribName = attribs[i];
    var value = attribs[i + 1];
    var atype = null, attribKey;
    if((attribKey = tagName + "::" + attribName, goog.string.html.HtmlSanitizer.Attributes.hasOwnProperty(attribKey)) || (attribKey = "*::" + attribName, goog.string.html.HtmlSanitizer.Attributes.hasOwnProperty(attribKey))) {
      atype = goog.string.html.HtmlSanitizer.Attributes[attribKey]
    }
    if(atype !== null) {
      switch(atype) {
        case 0:
          break;
        case goog.string.html.HtmlSanitizer.AttributeType.SCRIPT:
        ;
        case goog.string.html.HtmlSanitizer.AttributeType.STYLE:
          value = null;
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
          value = this.nmTokenPolicy_ ? this.nmTokenPolicy_(value) : value;
          break;
        case goog.string.html.HtmlSanitizer.AttributeType.URI:
          value = this.urlPolicy_ && this.urlPolicy_(value);
          break;
        case goog.string.html.HtmlSanitizer.AttributeType.URI_FRAGMENT:
          if(value && "#" === value.charAt(0)) {
            value = this.nmTokenPolicy_ ? this.nmTokenPolicy_(value) : value;
            if(value) {
              value = "#" + value
            }
          }else {
            value = null
          }
          break;
        default:
          value = null;
          break
      }
    }else {
      value = null
    }
    attribs[i + 1] = value
  }
  return attribs
};
goog.provide("goog.Timer");
goog.require("goog.events.EventTarget");
goog.Timer = function(opt_interval, opt_timerObject) {
  goog.events.EventTarget.call(this);
  this.interval_ = opt_interval || 1;
  this.timerObject_ = opt_timerObject || goog.Timer.defaultTimerObject;
  this.boundTick_ = goog.bind(this.tick_, this);
  this.last_ = goog.now()
};
goog.inherits(goog.Timer, goog.events.EventTarget);
goog.Timer.MAX_TIMEOUT_ = 2147483647;
goog.Timer.prototype.enabled = false;
goog.Timer.defaultTimerObject = goog.global["window"];
goog.Timer.intervalScale = 0.8;
goog.Timer.prototype.timer_ = null;
goog.Timer.prototype.getInterval = function() {
  return this.interval_
};
goog.Timer.prototype.setInterval = function(interval) {
  this.interval_ = interval;
  if(this.timer_ && this.enabled) {
    this.stop();
    this.start()
  }else {
    if(this.timer_) {
      this.stop()
    }
  }
};
goog.Timer.prototype.tick_ = function() {
  if(this.enabled) {
    var elapsed = goog.now() - this.last_;
    if(elapsed > 0 && elapsed < this.interval_ * goog.Timer.intervalScale) {
      this.timer_ = this.timerObject_.setTimeout(this.boundTick_, this.interval_ - elapsed);
      return
    }
    this.dispatchTick();
    if(this.enabled) {
      this.timer_ = this.timerObject_.setTimeout(this.boundTick_, this.interval_);
      this.last_ = goog.now()
    }
  }
};
goog.Timer.prototype.dispatchTick = function() {
  this.dispatchEvent(goog.Timer.TICK)
};
goog.Timer.prototype.start = function() {
  this.enabled = true;
  if(!this.timer_) {
    this.timer_ = this.timerObject_.setTimeout(this.boundTick_, this.interval_);
    this.last_ = goog.now()
  }
};
goog.Timer.prototype.stop = function() {
  this.enabled = false;
  if(this.timer_) {
    this.timerObject_.clearTimeout(this.timer_);
    this.timer_ = null
  }
};
goog.Timer.prototype.disposeInternal = function() {
  goog.Timer.superClass_.disposeInternal.call(this);
  this.stop();
  delete this.timerObject_
};
goog.Timer.TICK = "tick";
goog.Timer.callOnce = function(listener, opt_delay, opt_handler) {
  if(goog.isFunction(listener)) {
    if(opt_handler) {
      listener = goog.bind(listener, opt_handler)
    }
  }else {
    if(listener && typeof listener.handleEvent == "function") {
      listener = goog.bind(listener.handleEvent, listener)
    }else {
      throw Error("Invalid listener argument");
    }
  }
  if(opt_delay > goog.Timer.MAX_TIMEOUT_) {
    return-1
  }else {
    return goog.Timer.defaultTimerObject.setTimeout(listener, opt_delay || 0)
  }
};
goog.Timer.clear = function(timerId) {
  goog.Timer.defaultTimerObject.clearTimeout(timerId)
};
goog.provide("goog.events.KeyCodes");
goog.require("goog.userAgent");
goog.events.KeyCodes = {WIN_KEY_FF_LINUX:0, MAC_ENTER:3, BACKSPACE:8, TAB:9, NUM_CENTER:12, ENTER:13, SHIFT:16, CTRL:17, ALT:18, PAUSE:19, CAPS_LOCK:20, ESC:27, SPACE:32, PAGE_UP:33, PAGE_DOWN:34, END:35, HOME:36, LEFT:37, UP:38, RIGHT:39, DOWN:40, PRINT_SCREEN:44, INSERT:45, DELETE:46, ZERO:48, ONE:49, TWO:50, THREE:51, FOUR:52, FIVE:53, SIX:54, SEVEN:55, EIGHT:56, NINE:57, FF_SEMICOLON:59, FF_EQUALS:61, QUESTION_MARK:63, A:65, B:66, C:67, D:68, E:69, F:70, G:71, H:72, I:73, J:74, K:75, L:76, M:77, 
N:78, O:79, P:80, Q:81, R:82, S:83, T:84, U:85, V:86, W:87, X:88, Y:89, Z:90, META:91, WIN_KEY_RIGHT:92, CONTEXT_MENU:93, NUM_ZERO:96, NUM_ONE:97, NUM_TWO:98, NUM_THREE:99, NUM_FOUR:100, NUM_FIVE:101, NUM_SIX:102, NUM_SEVEN:103, NUM_EIGHT:104, NUM_NINE:105, NUM_MULTIPLY:106, NUM_PLUS:107, NUM_MINUS:109, NUM_PERIOD:110, NUM_DIVISION:111, F1:112, F2:113, F3:114, F4:115, F5:116, F6:117, F7:118, F8:119, F9:120, F10:121, F11:122, F12:123, NUMLOCK:144, SCROLL_LOCK:145, FIRST_MEDIA_KEY:166, LAST_MEDIA_KEY:183, 
SEMICOLON:186, DASH:189, EQUALS:187, COMMA:188, PERIOD:190, SLASH:191, APOSTROPHE:192, TILDE:192, SINGLE_QUOTE:222, OPEN_SQUARE_BRACKET:219, BACKSLASH:220, CLOSE_SQUARE_BRACKET:221, WIN_KEY:224, MAC_FF_META:224, WIN_IME:229, PHANTOM:255};
goog.events.KeyCodes.isTextModifyingKeyEvent = function(e) {
  if(e.altKey && !e.ctrlKey || e.metaKey || e.keyCode >= goog.events.KeyCodes.F1 && e.keyCode <= goog.events.KeyCodes.F12) {
    return false
  }
  switch(e.keyCode) {
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
      return false;
    case goog.events.KeyCodes.WIN_KEY_FF_LINUX:
      return!goog.userAgent.GECKO;
    default:
      return e.keyCode < goog.events.KeyCodes.FIRST_MEDIA_KEY || e.keyCode > goog.events.KeyCodes.LAST_MEDIA_KEY
  }
};
goog.events.KeyCodes.firesKeyPressEvent = function(keyCode, opt_heldKeyCode, opt_shiftKey, opt_ctrlKey, opt_altKey) {
  if(!goog.userAgent.IE && !(goog.userAgent.WEBKIT && goog.userAgent.isVersion("525"))) {
    return true
  }
  if(goog.userAgent.MAC && opt_altKey) {
    return goog.events.KeyCodes.isCharacterKey(keyCode)
  }
  if(opt_altKey && !opt_ctrlKey) {
    return false
  }
  if(!opt_shiftKey && (opt_heldKeyCode == goog.events.KeyCodes.CTRL || opt_heldKeyCode == goog.events.KeyCodes.ALT)) {
    return false
  }
  if(goog.userAgent.IE && opt_ctrlKey && opt_heldKeyCode == keyCode) {
    return false
  }
  switch(keyCode) {
    case goog.events.KeyCodes.ENTER:
      return!(goog.userAgent.IE && goog.userAgent.isDocumentMode(9));
    case goog.events.KeyCodes.ESC:
      return!goog.userAgent.WEBKIT
  }
  return goog.events.KeyCodes.isCharacterKey(keyCode)
};
goog.events.KeyCodes.isCharacterKey = function(keyCode) {
  if(keyCode >= goog.events.KeyCodes.ZERO && keyCode <= goog.events.KeyCodes.NINE) {
    return true
  }
  if(keyCode >= goog.events.KeyCodes.NUM_ZERO && keyCode <= goog.events.KeyCodes.NUM_MULTIPLY) {
    return true
  }
  if(keyCode >= goog.events.KeyCodes.A && keyCode <= goog.events.KeyCodes.Z) {
    return true
  }
  if(goog.userAgent.WEBKIT && keyCode == 0) {
    return true
  }
  switch(keyCode) {
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
      return true;
    default:
      return false
  }
};
goog.events.KeyCodes.normalizeGeckoKeyCode = function(keyCode) {
  switch(keyCode) {
    case goog.events.KeyCodes.FF_EQUALS:
      return goog.events.KeyCodes.EQUALS;
    case goog.events.KeyCodes.FF_SEMICOLON:
      return goog.events.KeyCodes.SEMICOLON;
    case goog.events.KeyCodes.MAC_FF_META:
      return goog.events.KeyCodes.META;
    case goog.events.KeyCodes.WIN_KEY_FF_LINUX:
      return goog.events.KeyCodes.WIN_KEY;
    default:
      return keyCode
  }
};
goog.provide("goog.events.KeyEvent");
goog.provide("goog.events.KeyHandler");
goog.provide("goog.events.KeyHandler.EventType");
goog.require("goog.events");
goog.require("goog.events.BrowserEvent");
goog.require("goog.events.EventTarget");
goog.require("goog.events.EventType");
goog.require("goog.events.KeyCodes");
goog.require("goog.userAgent");
goog.events.KeyHandler = function(opt_element, opt_capture) {
  goog.events.EventTarget.call(this);
  if(opt_element) {
    this.attach(opt_element, opt_capture)
  }
};
goog.inherits(goog.events.KeyHandler, goog.events.EventTarget);
goog.events.KeyHandler.prototype.element_ = null;
goog.events.KeyHandler.prototype.keyPressKey_ = null;
goog.events.KeyHandler.prototype.keyDownKey_ = null;
goog.events.KeyHandler.prototype.keyUpKey_ = null;
goog.events.KeyHandler.prototype.lastKey_ = -1;
goog.events.KeyHandler.prototype.keyCode_ = -1;
goog.events.KeyHandler.prototype.altKey_ = false;
goog.events.KeyHandler.EventType = {KEY:"key"};
goog.events.KeyHandler.safariKey_ = {3:goog.events.KeyCodes.ENTER, 12:goog.events.KeyCodes.NUMLOCK, 63232:goog.events.KeyCodes.UP, 63233:goog.events.KeyCodes.DOWN, 63234:goog.events.KeyCodes.LEFT, 63235:goog.events.KeyCodes.RIGHT, 63236:goog.events.KeyCodes.F1, 63237:goog.events.KeyCodes.F2, 63238:goog.events.KeyCodes.F3, 63239:goog.events.KeyCodes.F4, 63240:goog.events.KeyCodes.F5, 63241:goog.events.KeyCodes.F6, 63242:goog.events.KeyCodes.F7, 63243:goog.events.KeyCodes.F8, 63244:goog.events.KeyCodes.F9, 
63245:goog.events.KeyCodes.F10, 63246:goog.events.KeyCodes.F11, 63247:goog.events.KeyCodes.F12, 63248:goog.events.KeyCodes.PRINT_SCREEN, 63272:goog.events.KeyCodes.DELETE, 63273:goog.events.KeyCodes.HOME, 63275:goog.events.KeyCodes.END, 63276:goog.events.KeyCodes.PAGE_UP, 63277:goog.events.KeyCodes.PAGE_DOWN, 63289:goog.events.KeyCodes.NUMLOCK, 63302:goog.events.KeyCodes.INSERT};
goog.events.KeyHandler.keyIdentifier_ = {"Up":goog.events.KeyCodes.UP, "Down":goog.events.KeyCodes.DOWN, "Left":goog.events.KeyCodes.LEFT, "Right":goog.events.KeyCodes.RIGHT, "Enter":goog.events.KeyCodes.ENTER, "F1":goog.events.KeyCodes.F1, "F2":goog.events.KeyCodes.F2, "F3":goog.events.KeyCodes.F3, "F4":goog.events.KeyCodes.F4, "F5":goog.events.KeyCodes.F5, "F6":goog.events.KeyCodes.F6, "F7":goog.events.KeyCodes.F7, "F8":goog.events.KeyCodes.F8, "F9":goog.events.KeyCodes.F9, "F10":goog.events.KeyCodes.F10, 
"F11":goog.events.KeyCodes.F11, "F12":goog.events.KeyCodes.F12, "U+007F":goog.events.KeyCodes.DELETE, "Home":goog.events.KeyCodes.HOME, "End":goog.events.KeyCodes.END, "PageUp":goog.events.KeyCodes.PAGE_UP, "PageDown":goog.events.KeyCodes.PAGE_DOWN, "Insert":goog.events.KeyCodes.INSERT};
goog.events.KeyHandler.USES_KEYDOWN_ = goog.userAgent.IE || goog.userAgent.WEBKIT && goog.userAgent.isVersion("525");
goog.events.KeyHandler.SAVE_ALT_FOR_KEYPRESS_ = goog.userAgent.MAC && goog.userAgent.GECKO;
goog.events.KeyHandler.prototype.handleKeyDown_ = function(e) {
  if(goog.userAgent.WEBKIT && (this.lastKey_ == goog.events.KeyCodes.CTRL && !e.ctrlKey || this.lastKey_ == goog.events.KeyCodes.ALT && !e.altKey)) {
    this.lastKey_ = -1;
    this.keyCode_ = -1
  }
  if(goog.events.KeyHandler.USES_KEYDOWN_ && !goog.events.KeyCodes.firesKeyPressEvent(e.keyCode, this.lastKey_, e.shiftKey, e.ctrlKey, e.altKey)) {
    this.handleEvent(e)
  }else {
    this.keyCode_ = goog.userAgent.GECKO ? goog.events.KeyCodes.normalizeGeckoKeyCode(e.keyCode) : e.keyCode;
    if(goog.events.KeyHandler.SAVE_ALT_FOR_KEYPRESS_) {
      this.altKey_ = e.altKey
    }
  }
};
goog.events.KeyHandler.prototype.handleKeyup_ = function(e) {
  this.lastKey_ = -1;
  this.keyCode_ = -1;
  this.altKey_ = e.altKey
};
goog.events.KeyHandler.prototype.handleEvent = function(e) {
  var be = e.getBrowserEvent();
  var keyCode, charCode;
  var altKey = be.altKey;
  if(goog.userAgent.IE && e.type == goog.events.EventType.KEYPRESS) {
    keyCode = this.keyCode_;
    charCode = keyCode != goog.events.KeyCodes.ENTER && keyCode != goog.events.KeyCodes.ESC ? be.keyCode : 0
  }else {
    if(goog.userAgent.WEBKIT && e.type == goog.events.EventType.KEYPRESS) {
      keyCode = this.keyCode_;
      charCode = be.charCode >= 0 && be.charCode < 63232 && goog.events.KeyCodes.isCharacterKey(keyCode) ? be.charCode : 0
    }else {
      if(goog.userAgent.OPERA) {
        keyCode = this.keyCode_;
        charCode = goog.events.KeyCodes.isCharacterKey(keyCode) ? be.keyCode : 0
      }else {
        keyCode = be.keyCode || this.keyCode_;
        charCode = be.charCode || 0;
        if(goog.events.KeyHandler.SAVE_ALT_FOR_KEYPRESS_) {
          altKey = this.altKey_
        }
        if(goog.userAgent.MAC && charCode == goog.events.KeyCodes.QUESTION_MARK && keyCode == goog.events.KeyCodes.WIN_KEY) {
          keyCode = goog.events.KeyCodes.SLASH
        }
      }
    }
  }
  var key = keyCode;
  var keyIdentifier = be.keyIdentifier;
  if(keyCode) {
    if(keyCode >= 63232 && keyCode in goog.events.KeyHandler.safariKey_) {
      key = goog.events.KeyHandler.safariKey_[keyCode]
    }else {
      if(keyCode == 25 && e.shiftKey) {
        key = 9
      }
    }
  }else {
    if(keyIdentifier && keyIdentifier in goog.events.KeyHandler.keyIdentifier_) {
      key = goog.events.KeyHandler.keyIdentifier_[keyIdentifier]
    }
  }
  var repeat = key == this.lastKey_;
  this.lastKey_ = key;
  var event = new goog.events.KeyEvent(key, charCode, repeat, be);
  event.altKey = altKey;
  this.dispatchEvent(event)
};
goog.events.KeyHandler.prototype.getElement = function() {
  return this.element_
};
goog.events.KeyHandler.prototype.attach = function(element, opt_capture) {
  if(this.keyUpKey_) {
    this.detach()
  }
  this.element_ = element;
  this.keyPressKey_ = goog.events.listen(this.element_, goog.events.EventType.KEYPRESS, this, opt_capture);
  this.keyDownKey_ = goog.events.listen(this.element_, goog.events.EventType.KEYDOWN, this.handleKeyDown_, opt_capture, this);
  this.keyUpKey_ = goog.events.listen(this.element_, goog.events.EventType.KEYUP, this.handleKeyup_, opt_capture, this)
};
goog.events.KeyHandler.prototype.detach = function() {
  if(this.keyPressKey_) {
    goog.events.unlistenByKey(this.keyPressKey_);
    goog.events.unlistenByKey(this.keyDownKey_);
    goog.events.unlistenByKey(this.keyUpKey_);
    this.keyPressKey_ = null;
    this.keyDownKey_ = null;
    this.keyUpKey_ = null
  }
  this.element_ = null;
  this.lastKey_ = -1;
  this.keyCode_ = -1
};
goog.events.KeyHandler.prototype.disposeInternal = function() {
  goog.events.KeyHandler.superClass_.disposeInternal.call(this);
  this.detach()
};
goog.events.KeyEvent = function(keyCode, charCode, repeat, browserEvent) {
  goog.events.BrowserEvent.call(this, browserEvent);
  this.type = goog.events.KeyHandler.EventType.KEY;
  this.keyCode = keyCode;
  this.charCode = charCode;
  this.repeat = repeat
};
goog.inherits(goog.events.KeyEvent, goog.events.BrowserEvent);
goog.provide("goog.ui.IdGenerator");
goog.ui.IdGenerator = function() {
};
goog.addSingletonGetter(goog.ui.IdGenerator);
goog.ui.IdGenerator.prototype.nextId_ = 0;
goog.ui.IdGenerator.prototype.getNextUniqueId = function() {
  return":" + (this.nextId_++).toString(36)
};
goog.ui.IdGenerator.instance = goog.ui.IdGenerator.getInstance();
goog.provide("goog.ui.Component");
goog.provide("goog.ui.Component.Error");
goog.provide("goog.ui.Component.EventType");
goog.provide("goog.ui.Component.State");
goog.require("goog.array");
goog.require("goog.array.ArrayLike");
goog.require("goog.dom");
goog.require("goog.events.EventHandler");
goog.require("goog.events.EventTarget");
goog.require("goog.object");
goog.require("goog.style");
goog.require("goog.ui.IdGenerator");
goog.ui.Component = function(opt_domHelper) {
  goog.events.EventTarget.call(this);
  this.dom_ = opt_domHelper || goog.dom.getDomHelper();
  this.rightToLeft_ = goog.ui.Component.defaultRightToLeft_
};
goog.inherits(goog.ui.Component, goog.events.EventTarget);
goog.ui.Component.prototype.idGenerator_ = goog.ui.IdGenerator.getInstance();
goog.ui.Component.defaultRightToLeft_ = null;
goog.ui.Component.EventType = {BEFORE_SHOW:"beforeshow", SHOW:"show", HIDE:"hide", DISABLE:"disable", ENABLE:"enable", HIGHLIGHT:"highlight", UNHIGHLIGHT:"unhighlight", ACTIVATE:"activate", DEACTIVATE:"deactivate", SELECT:"select", UNSELECT:"unselect", CHECK:"check", UNCHECK:"uncheck", FOCUS:"focus", BLUR:"blur", OPEN:"open", CLOSE:"close", ENTER:"enter", LEAVE:"leave", ACTION:"action", CHANGE:"change"};
goog.ui.Component.Error = {NOT_SUPPORTED:"Method not supported", DECORATE_INVALID:"Invalid element to decorate", ALREADY_RENDERED:"Component already rendered", PARENT_UNABLE_TO_BE_SET:"Unable to set parent component", CHILD_INDEX_OUT_OF_BOUNDS:"Child component index out of bounds", NOT_OUR_CHILD:"Child is not in parent component", NOT_IN_DOCUMENT:"Operation not supported while component is not in document", STATE_INVALID:"Invalid component state"};
goog.ui.Component.State = {ALL:255, DISABLED:1, HOVER:2, ACTIVE:4, SELECTED:8, CHECKED:16, FOCUSED:32, OPENED:64};
goog.ui.Component.getStateTransitionEvent = function(state, isEntering) {
  switch(state) {
    case goog.ui.Component.State.DISABLED:
      return isEntering ? goog.ui.Component.EventType.DISABLE : goog.ui.Component.EventType.ENABLE;
    case goog.ui.Component.State.HOVER:
      return isEntering ? goog.ui.Component.EventType.HIGHLIGHT : goog.ui.Component.EventType.UNHIGHLIGHT;
    case goog.ui.Component.State.ACTIVE:
      return isEntering ? goog.ui.Component.EventType.ACTIVATE : goog.ui.Component.EventType.DEACTIVATE;
    case goog.ui.Component.State.SELECTED:
      return isEntering ? goog.ui.Component.EventType.SELECT : goog.ui.Component.EventType.UNSELECT;
    case goog.ui.Component.State.CHECKED:
      return isEntering ? goog.ui.Component.EventType.CHECK : goog.ui.Component.EventType.UNCHECK;
    case goog.ui.Component.State.FOCUSED:
      return isEntering ? goog.ui.Component.EventType.FOCUS : goog.ui.Component.EventType.BLUR;
    case goog.ui.Component.State.OPENED:
      return isEntering ? goog.ui.Component.EventType.OPEN : goog.ui.Component.EventType.CLOSE;
    default:
  }
  throw Error(goog.ui.Component.Error.STATE_INVALID);
};
goog.ui.Component.setDefaultRightToLeft = function(rightToLeft) {
  goog.ui.Component.defaultRightToLeft_ = rightToLeft
};
goog.ui.Component.prototype.id_ = null;
goog.ui.Component.prototype.dom_;
goog.ui.Component.prototype.inDocument_ = false;
goog.ui.Component.prototype.element_ = null;
goog.ui.Component.prototype.googUiComponentHandler_;
goog.ui.Component.prototype.rightToLeft_ = null;
goog.ui.Component.prototype.model_ = null;
goog.ui.Component.prototype.parent_ = null;
goog.ui.Component.prototype.children_ = null;
goog.ui.Component.prototype.childIndex_ = null;
goog.ui.Component.prototype.wasDecorated_ = false;
goog.ui.Component.prototype.getId = function() {
  return this.id_ || (this.id_ = this.idGenerator_.getNextUniqueId())
};
goog.ui.Component.prototype.setId = function(id) {
  if(this.parent_ && this.parent_.childIndex_) {
    goog.object.remove(this.parent_.childIndex_, this.id_);
    goog.object.add(this.parent_.childIndex_, id, this)
  }
  this.id_ = id
};
goog.ui.Component.prototype.getElement = function() {
  return this.element_
};
goog.ui.Component.prototype.setElementInternal = function(element) {
  this.element_ = element
};
goog.ui.Component.prototype.getElementsByClass = function(className) {
  return this.element_ ? this.dom_.getElementsByClass(className, this.element_) : []
};
goog.ui.Component.prototype.getElementByClass = function(className) {
  return this.element_ ? this.dom_.getElementByClass(className, this.element_) : null
};
goog.ui.Component.prototype.getHandler = function() {
  return this.googUiComponentHandler_ || (this.googUiComponentHandler_ = new goog.events.EventHandler(this))
};
goog.ui.Component.prototype.setParent = function(parent) {
  if(this == parent) {
    throw Error(goog.ui.Component.Error.PARENT_UNABLE_TO_BE_SET);
  }
  if(parent && this.parent_ && this.id_ && this.parent_.getChild(this.id_) && this.parent_ != parent) {
    throw Error(goog.ui.Component.Error.PARENT_UNABLE_TO_BE_SET);
  }
  this.parent_ = parent;
  goog.ui.Component.superClass_.setParentEventTarget.call(this, parent)
};
goog.ui.Component.prototype.getParent = function() {
  return this.parent_
};
goog.ui.Component.prototype.setParentEventTarget = function(parent) {
  if(this.parent_ && this.parent_ != parent) {
    throw Error(goog.ui.Component.Error.NOT_SUPPORTED);
  }
  goog.ui.Component.superClass_.setParentEventTarget.call(this, parent)
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
goog.ui.Component.prototype.render = function(opt_parentElement) {
  this.render_(opt_parentElement)
};
goog.ui.Component.prototype.renderBefore = function(sibling) {
  this.render_(sibling.parentNode, sibling)
};
goog.ui.Component.prototype.render_ = function(opt_parentElement, opt_beforeNode) {
  if(this.inDocument_) {
    throw Error(goog.ui.Component.Error.ALREADY_RENDERED);
  }
  if(!this.element_) {
    this.createDom()
  }
  if(opt_parentElement) {
    opt_parentElement.insertBefore(this.element_, opt_beforeNode || null)
  }else {
    this.dom_.getDocument().body.appendChild(this.element_)
  }
  if(!this.parent_ || this.parent_.isInDocument()) {
    this.enterDocument()
  }
};
goog.ui.Component.prototype.decorate = function(element) {
  if(this.inDocument_) {
    throw Error(goog.ui.Component.Error.ALREADY_RENDERED);
  }else {
    if(element && this.canDecorate(element)) {
      this.wasDecorated_ = true;
      if(!this.dom_ || this.dom_.getDocument() != goog.dom.getOwnerDocument(element)) {
        this.dom_ = goog.dom.getDomHelper(element)
      }
      this.decorateInternal(element);
      this.enterDocument()
    }else {
      throw Error(goog.ui.Component.Error.DECORATE_INVALID);
    }
  }
};
goog.ui.Component.prototype.canDecorate = function(element) {
  return true
};
goog.ui.Component.prototype.wasDecorated = function() {
  return this.wasDecorated_
};
goog.ui.Component.prototype.decorateInternal = function(element) {
  this.element_ = element
};
goog.ui.Component.prototype.enterDocument = function() {
  this.inDocument_ = true;
  this.forEachChild(function(child) {
    if(!child.isInDocument() && child.getElement()) {
      child.enterDocument()
    }
  })
};
goog.ui.Component.prototype.exitDocument = function() {
  this.forEachChild(function(child) {
    if(child.isInDocument()) {
      child.exitDocument()
    }
  });
  if(this.googUiComponentHandler_) {
    this.googUiComponentHandler_.removeAll()
  }
  this.inDocument_ = false
};
goog.ui.Component.prototype.disposeInternal = function() {
  goog.ui.Component.superClass_.disposeInternal.call(this);
  if(this.inDocument_) {
    this.exitDocument()
  }
  if(this.googUiComponentHandler_) {
    this.googUiComponentHandler_.dispose();
    delete this.googUiComponentHandler_
  }
  this.forEachChild(function(child) {
    child.dispose()
  });
  if(!this.wasDecorated_ && this.element_) {
    goog.dom.removeNode(this.element_)
  }
  this.children_ = null;
  this.childIndex_ = null;
  this.element_ = null;
  this.model_ = null;
  this.parent_ = null
};
goog.ui.Component.prototype.makeId = function(idFragment) {
  return this.getId() + "." + idFragment
};
goog.ui.Component.prototype.makeIds = function(object) {
  var ids = {};
  for(var key in object) {
    ids[key] = this.makeId(object[key])
  }
  return ids
};
goog.ui.Component.prototype.getModel = function() {
  return this.model_
};
goog.ui.Component.prototype.setModel = function(obj) {
  this.model_ = obj
};
goog.ui.Component.prototype.getFragmentFromId = function(id) {
  return id.substring(this.getId().length + 1)
};
goog.ui.Component.prototype.getElementByFragment = function(idFragment) {
  if(!this.inDocument_) {
    throw Error(goog.ui.Component.Error.NOT_IN_DOCUMENT);
  }
  return this.dom_.getElement(this.makeId(idFragment))
};
goog.ui.Component.prototype.addChild = function(child, opt_render) {
  this.addChildAt(child, this.getChildCount(), opt_render)
};
goog.ui.Component.prototype.addChildAt = function(child, index, opt_render) {
  if(child.inDocument_ && (opt_render || !this.inDocument_)) {
    throw Error(goog.ui.Component.Error.ALREADY_RENDERED);
  }
  if(index < 0 || index > this.getChildCount()) {
    throw Error(goog.ui.Component.Error.CHILD_INDEX_OUT_OF_BOUNDS);
  }
  if(!this.childIndex_ || !this.children_) {
    this.childIndex_ = {};
    this.children_ = []
  }
  if(child.getParent() == this) {
    goog.object.set(this.childIndex_, child.getId(), child);
    goog.array.remove(this.children_, child)
  }else {
    goog.object.add(this.childIndex_, child.getId(), child)
  }
  child.setParent(this);
  goog.array.insertAt(this.children_, child, index);
  if(child.inDocument_ && this.inDocument_ && child.getParent() == this) {
    var contentElement = this.getContentElement();
    contentElement.insertBefore(child.getElement(), contentElement.childNodes[index] || null)
  }else {
    if(opt_render) {
      if(!this.element_) {
        this.createDom()
      }
      var sibling = this.getChildAt(index + 1);
      child.render_(this.getContentElement(), sibling ? sibling.element_ : null)
    }else {
      if(this.inDocument_ && !child.inDocument_ && child.element_ && child.element_.parentNode) {
        child.enterDocument()
      }
    }
  }
};
goog.ui.Component.prototype.getContentElement = function() {
  return this.element_
};
goog.ui.Component.prototype.isRightToLeft = function() {
  if(this.rightToLeft_ == null) {
    this.rightToLeft_ = goog.style.isRightToLeft(this.inDocument_ ? this.element_ : this.dom_.getDocument().body)
  }
  return this.rightToLeft_
};
goog.ui.Component.prototype.setRightToLeft = function(rightToLeft) {
  if(this.inDocument_) {
    throw Error(goog.ui.Component.Error.ALREADY_RENDERED);
  }
  this.rightToLeft_ = rightToLeft
};
goog.ui.Component.prototype.hasChildren = function() {
  return!!this.children_ && this.children_.length != 0
};
goog.ui.Component.prototype.getChildCount = function() {
  return this.children_ ? this.children_.length : 0
};
goog.ui.Component.prototype.getChildIds = function() {
  var ids = [];
  this.forEachChild(function(child) {
    ids.push(child.getId())
  });
  return ids
};
goog.ui.Component.prototype.getChild = function(id) {
  return this.childIndex_ && id ? goog.object.get(this.childIndex_, id) || null : null
};
goog.ui.Component.prototype.getChildAt = function(index) {
  return this.children_ ? this.children_[index] || null : null
};
goog.ui.Component.prototype.forEachChild = function(f, opt_obj) {
  if(this.children_) {
    goog.array.forEach(this.children_, f, opt_obj)
  }
};
goog.ui.Component.prototype.indexOfChild = function(child) {
  return this.children_ && child ? goog.array.indexOf(this.children_, child) : -1
};
goog.ui.Component.prototype.removeChild = function(child, opt_unrender) {
  if(child) {
    var id = goog.isString(child) ? child : child.getId();
    child = this.getChild(id);
    if(id && child) {
      goog.object.remove(this.childIndex_, id);
      goog.array.remove(this.children_, child);
      if(opt_unrender) {
        child.exitDocument();
        if(child.element_) {
          goog.dom.removeNode(child.element_)
        }
      }
      child.setParent(null)
    }
  }
  if(!child) {
    throw Error(goog.ui.Component.Error.NOT_OUR_CHILD);
  }
  return child
};
goog.ui.Component.prototype.removeChildAt = function(index, opt_unrender) {
  return this.removeChild(this.getChildAt(index), opt_unrender)
};
goog.ui.Component.prototype.removeChildren = function(opt_unrender) {
  var removedChildren = [];
  while(this.hasChildren()) {
    removedChildren.push(this.removeChildAt(0, opt_unrender))
  }
  return removedChildren
};
goog.provide("goog.ui.ControlContent");
goog.ui.ControlContent;
goog.provide("goog.dom.a11y");
goog.provide("goog.dom.a11y.Announcer");
goog.provide("goog.dom.a11y.LivePriority");
goog.provide("goog.dom.a11y.Role");
goog.provide("goog.dom.a11y.State");
goog.require("goog.Disposable");
goog.require("goog.dom");
goog.require("goog.object");
goog.dom.a11y.State = {ACTIVEDESCENDANT:"activedescendant", ATOMIC:"atomic", AUTOCOMPLETE:"autocomplete", BUSY:"busy", CHECKED:"checked", CONTROLS:"controls", DESCRIBEDBY:"describedby", DISABLED:"disabled", DROPEFFECT:"dropeffect", EXPANDED:"expanded", FLOWTO:"flowto", GRABBED:"grabbed", HASPOPUP:"haspopup", HIDDEN:"hidden", INVALID:"invalid", LABEL:"label", LABELLEDBY:"labelledby", LEVEL:"level", LIVE:"live", MULTILINE:"multiline", MULTISELECTABLE:"multiselectable", ORIENTATION:"orientation", OWNS:"owns", 
POSINSET:"posinset", PRESSED:"pressed", READONLY:"readonly", RELEVANT:"relevant", REQUIRED:"required", SELECTED:"selected", SETSIZE:"setsize", SORT:"sort", VALUEMAX:"valuemax", VALUEMIN:"valuemin", VALUENOW:"valuenow", VALUETEXT:"valuetext"};
goog.dom.a11y.Role = {ALERT:"alert", ALERTDIALOG:"alertdialog", APPLICATION:"application", ARTICLE:"article", BANNER:"banner", BUTTON:"button", CHECKBOX:"checkbox", COLUMNHEADER:"columnheader", COMBOBOX:"combobox", COMPLEMENTARY:"complementary", DIALOG:"dialog", DIRECTORY:"directory", DOCUMENT:"document", FORM:"form", GRID:"grid", GRIDCELL:"gridcell", GROUP:"group", HEADING:"heading", IMG:"img", LINK:"link", LIST:"list", LISTBOX:"listbox", LISTITEM:"listitem", LOG:"log", MAIN:"main", MARQUEE:"marquee", 
MATH:"math", MENU:"menu", MENUBAR:"menubar", MENU_ITEM:"menuitem", MENU_ITEM_CHECKBOX:"menuitemcheckbox", MENU_ITEM_RADIO:"menuitemradio", NAVIGATION:"navigation", NOTE:"note", OPTION:"option", PRESENTATION:"presentation", PROGRESSBAR:"progressbar", RADIO:"radio", RADIOGROUP:"radiogroup", REGION:"region", ROW:"row", ROWGROUP:"rowgroup", ROWHEADER:"rowheader", SCROLLBAR:"scrollbar", SEARCH:"search", SEPARATOR:"separator", SLIDER:"slider", SPINBUTTON:"spinbutton", STATUS:"status", TAB:"tab", TAB_LIST:"tablist", 
TAB_PANEL:"tabpanel", TEXTBOX:"textbox", TIMER:"timer", TOOLBAR:"toolbar", TOOLTIP:"tooltip", TREE:"tree", TREEGRID:"treegrid", TREEITEM:"treeitem"};
goog.dom.a11y.LivePriority = {OFF:"off", POLITE:"polite", ASSERTIVE:"assertive"};
goog.dom.a11y.setRole = function(element, roleName) {
  element.setAttribute("role", roleName)
};
goog.dom.a11y.getRole = function(element) {
  return element.getAttribute("role") || ""
};
goog.dom.a11y.setState = function(element, state, value) {
  element.setAttribute("aria-" + state, value)
};
goog.dom.a11y.getState = function(element, stateName) {
  var attrb = element.getAttribute("aria-" + stateName);
  if(attrb === true || attrb === false) {
    return attrb ? "true" : "false"
  }else {
    if(!attrb) {
      return""
    }else {
      return String(attrb)
    }
  }
};
goog.dom.a11y.getActiveDescendant = function(element) {
  var id = goog.dom.a11y.getState(element, goog.dom.a11y.State.ACTIVEDESCENDANT);
  return goog.dom.getOwnerDocument(element).getElementById(id)
};
goog.dom.a11y.setActiveDescendant = function(element, activeElement) {
  goog.dom.a11y.setState(element, goog.dom.a11y.State.ACTIVEDESCENDANT, activeElement ? activeElement.id : "")
};
goog.dom.a11y.Announcer = function(domHelper) {
  goog.base(this);
  this.domHelper_ = domHelper;
  this.liveRegions_ = {}
};
goog.inherits(goog.dom.a11y.Announcer, goog.Disposable);
goog.dom.a11y.Announcer.prototype.disposeInternal = function() {
  goog.object.forEach(this.liveRegions_, this.domHelper_.removeNode, this.domHelper_);
  this.liveRegions_ = null;
  this.domHelper_ = null;
  goog.base(this, "disposeInternal")
};
goog.dom.a11y.Announcer.prototype.say = function(message, opt_priority) {
  goog.dom.setTextContent(this.getLiveRegion_(opt_priority || goog.dom.a11y.LivePriority.POLITE), message)
};
goog.dom.a11y.Announcer.prototype.getLiveRegion_ = function(priority) {
  if(this.liveRegions_[priority]) {
    return this.liveRegions_[priority]
  }
  var liveRegion;
  liveRegion = this.domHelper_.createElement("div");
  liveRegion.style.position = "absolute";
  liveRegion.style.top = "-1000px";
  goog.dom.a11y.setState(liveRegion, "live", priority);
  goog.dom.a11y.setState(liveRegion, "atomic", "true");
  this.domHelper_.getDocument().body.appendChild(liveRegion);
  this.liveRegions_[priority] = liveRegion;
  return liveRegion
};
goog.provide("goog.ui.ControlRenderer");
goog.require("goog.array");
goog.require("goog.dom");
goog.require("goog.dom.a11y");
goog.require("goog.dom.a11y.State");
goog.require("goog.dom.classes");
goog.require("goog.object");
goog.require("goog.style");
goog.require("goog.ui.Component.State");
goog.require("goog.ui.ControlContent");
goog.require("goog.userAgent");
goog.ui.ControlRenderer = function() {
};
goog.addSingletonGetter(goog.ui.ControlRenderer);
goog.ui.ControlRenderer.getCustomRenderer = function(ctor, cssClassName) {
  var renderer = new ctor;
  renderer.getCssClass = function() {
    return cssClassName
  };
  return renderer
};
goog.ui.ControlRenderer.CSS_CLASS = goog.getCssName("goog-control");
goog.ui.ControlRenderer.IE6_CLASS_COMBINATIONS = [];
goog.ui.ControlRenderer.ARIA_STATE_MAP_;
goog.ui.ControlRenderer.prototype.getAriaRole = function() {
  return undefined
};
goog.ui.ControlRenderer.prototype.createDom = function(control) {
  var element = control.getDomHelper().createDom("div", this.getClassNames(control).join(" "), control.getContent());
  this.setAriaStates(control, element);
  return element
};
goog.ui.ControlRenderer.prototype.getContentElement = function(element) {
  return element
};
goog.ui.ControlRenderer.prototype.enableClassName = function(control, className, enable) {
  var element = control.getElement ? control.getElement() : control;
  if(element) {
    if(goog.userAgent.IE && !goog.userAgent.isVersion("7")) {
      var combinedClasses = this.getAppliedCombinedClassNames_(goog.dom.classes.get(element), className);
      combinedClasses.push(className);
      var f = enable ? goog.dom.classes.add : goog.dom.classes.remove;
      goog.partial(f, element).apply(null, combinedClasses)
    }else {
      goog.dom.classes.enable(element, className, enable)
    }
  }
};
goog.ui.ControlRenderer.prototype.enableExtraClassName = function(control, className, enable) {
  this.enableClassName(control, className, enable)
};
goog.ui.ControlRenderer.prototype.canDecorate = function(element) {
  return true
};
goog.ui.ControlRenderer.prototype.decorate = function(control, element) {
  if(element.id) {
    control.setId(element.id)
  }
  var contentElem = this.getContentElement(element);
  if(contentElem && contentElem.firstChild) {
    control.setContentInternal(contentElem.firstChild.nextSibling ? goog.array.clone(contentElem.childNodes) : contentElem.firstChild)
  }else {
    control.setContentInternal(null)
  }
  var state = 0;
  var rendererClassName = this.getCssClass();
  var structuralClassName = this.getStructuralCssClass();
  var hasRendererClassName = false;
  var hasStructuralClassName = false;
  var hasCombinedClassName = false;
  var classNames = goog.dom.classes.get(element);
  goog.array.forEach(classNames, function(className) {
    if(!hasRendererClassName && className == rendererClassName) {
      hasRendererClassName = true;
      if(structuralClassName == rendererClassName) {
        hasStructuralClassName = true
      }
    }else {
      if(!hasStructuralClassName && className == structuralClassName) {
        hasStructuralClassName = true
      }else {
        state |= this.getStateFromClass(className)
      }
    }
  }, this);
  control.setStateInternal(state);
  if(!hasRendererClassName) {
    classNames.push(rendererClassName);
    if(structuralClassName == rendererClassName) {
      hasStructuralClassName = true
    }
  }
  if(!hasStructuralClassName) {
    classNames.push(structuralClassName)
  }
  var extraClassNames = control.getExtraClassNames();
  if(extraClassNames) {
    classNames.push.apply(classNames, extraClassNames)
  }
  if(goog.userAgent.IE && !goog.userAgent.isVersion("7")) {
    var combinedClasses = this.getAppliedCombinedClassNames_(classNames);
    if(combinedClasses.length > 0) {
      classNames.push.apply(classNames, combinedClasses);
      hasCombinedClassName = true
    }
  }
  if(!hasRendererClassName || !hasStructuralClassName || extraClassNames || hasCombinedClassName) {
    goog.dom.classes.set(element, classNames.join(" "))
  }
  this.setAriaStates(control, element);
  return element
};
goog.ui.ControlRenderer.prototype.initializeDom = function(control) {
  if(control.isRightToLeft()) {
    this.setRightToLeft(control.getElement(), true)
  }
  if(control.isEnabled()) {
    this.setFocusable(control, control.isVisible())
  }
};
goog.ui.ControlRenderer.prototype.setAriaRole = function(element, opt_preferredRole) {
  var ariaRole = opt_preferredRole || this.getAriaRole();
  if(ariaRole) {
    goog.dom.a11y.setRole(element, ariaRole)
  }
};
goog.ui.ControlRenderer.prototype.setAriaStates = function(control, element) {
  goog.asserts.assert(control);
  goog.asserts.assert(element);
  if(!control.isEnabled()) {
    this.updateAriaState(element, goog.ui.Component.State.DISABLED, true)
  }
  if(control.isSelected()) {
    this.updateAriaState(element, goog.ui.Component.State.SELECTED, true)
  }
  if(control.isSupportedState(goog.ui.Component.State.CHECKED)) {
    this.updateAriaState(element, goog.ui.Component.State.CHECKED, control.isChecked())
  }
  if(control.isSupportedState(goog.ui.Component.State.OPENED)) {
    this.updateAriaState(element, goog.ui.Component.State.OPENED, control.isOpen())
  }
};
goog.ui.ControlRenderer.prototype.setAllowTextSelection = function(element, allow) {
  goog.style.setUnselectable(element, !allow, !goog.userAgent.IE && !goog.userAgent.OPERA)
};
goog.ui.ControlRenderer.prototype.setRightToLeft = function(element, rightToLeft) {
  this.enableClassName(element, goog.getCssName(this.getStructuralCssClass(), "rtl"), rightToLeft)
};
goog.ui.ControlRenderer.prototype.isFocusable = function(control) {
  var keyTarget;
  if(control.isSupportedState(goog.ui.Component.State.FOCUSED) && (keyTarget = control.getKeyEventTarget())) {
    return goog.dom.isFocusableTabIndex(keyTarget)
  }
  return false
};
goog.ui.ControlRenderer.prototype.setFocusable = function(control, focusable) {
  var keyTarget;
  if(control.isSupportedState(goog.ui.Component.State.FOCUSED) && (keyTarget = control.getKeyEventTarget())) {
    if(!focusable && control.isFocused()) {
      try {
        keyTarget.blur()
      }catch(e) {
      }
      if(control.isFocused()) {
        control.handleBlur(null)
      }
    }
    if(goog.dom.isFocusableTabIndex(keyTarget) != focusable) {
      goog.dom.setFocusableTabIndex(keyTarget, focusable)
    }
  }
};
goog.ui.ControlRenderer.prototype.setVisible = function(element, visible) {
  goog.style.showElement(element, visible)
};
goog.ui.ControlRenderer.prototype.setState = function(control, state, enable) {
  var element = control.getElement();
  if(element) {
    var className = this.getClassForState(state);
    if(className) {
      this.enableClassName(control, className, enable)
    }
    this.updateAriaState(element, state, enable)
  }
};
goog.ui.ControlRenderer.prototype.updateAriaState = function(element, state, enable) {
  if(!goog.ui.ControlRenderer.ARIA_STATE_MAP_) {
    goog.ui.ControlRenderer.ARIA_STATE_MAP_ = goog.object.create(goog.ui.Component.State.DISABLED, goog.dom.a11y.State.DISABLED, goog.ui.Component.State.SELECTED, goog.dom.a11y.State.SELECTED, goog.ui.Component.State.CHECKED, goog.dom.a11y.State.CHECKED, goog.ui.Component.State.OPENED, goog.dom.a11y.State.EXPANDED)
  }
  var ariaState = goog.ui.ControlRenderer.ARIA_STATE_MAP_[state];
  if(ariaState) {
    goog.dom.a11y.setState(element, ariaState, enable)
  }
};
goog.ui.ControlRenderer.prototype.setContent = function(element, content) {
  var contentElem = this.getContentElement(element);
  if(contentElem) {
    goog.dom.removeChildren(contentElem);
    if(content) {
      if(goog.isString(content)) {
        goog.dom.setTextContent(contentElem, content)
      }else {
        var childHandler = function(child) {
          if(child) {
            var doc = goog.dom.getOwnerDocument(contentElem);
            contentElem.appendChild(goog.isString(child) ? doc.createTextNode(child) : child)
          }
        };
        if(goog.isArray(content)) {
          goog.array.forEach(content, childHandler)
        }else {
          if(goog.isArrayLike(content) && !("nodeType" in content)) {
            goog.array.forEach(goog.array.clone(content), childHandler)
          }else {
            childHandler(content)
          }
        }
      }
    }
  }
};
goog.ui.ControlRenderer.prototype.getKeyEventTarget = function(control) {
  return control.getElement()
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
goog.ui.ControlRenderer.prototype.getClassNames = function(control) {
  var cssClass = this.getCssClass();
  var classNames = [cssClass];
  var structuralCssClass = this.getStructuralCssClass();
  if(structuralCssClass != cssClass) {
    classNames.push(structuralCssClass)
  }
  var classNamesForState = this.getClassNamesForState(control.getState());
  classNames.push.apply(classNames, classNamesForState);
  var extraClassNames = control.getExtraClassNames();
  if(extraClassNames) {
    classNames.push.apply(classNames, extraClassNames)
  }
  if(goog.userAgent.IE && !goog.userAgent.isVersion("7")) {
    classNames.push.apply(classNames, this.getAppliedCombinedClassNames_(classNames))
  }
  return classNames
};
goog.ui.ControlRenderer.prototype.getAppliedCombinedClassNames_ = function(classes, opt_includedClass) {
  var toAdd = [];
  if(opt_includedClass) {
    classes = classes.concat([opt_includedClass])
  }
  goog.array.forEach(this.getIe6ClassCombinations(), function(combo) {
    if(goog.array.every(combo, goog.partial(goog.array.contains, classes)) && (!opt_includedClass || goog.array.contains(combo, opt_includedClass))) {
      toAdd.push(combo.join("_"))
    }
  });
  return toAdd
};
goog.ui.ControlRenderer.prototype.getClassNamesForState = function(state) {
  var classNames = [];
  while(state) {
    var mask = state & -state;
    classNames.push(this.getClassForState(mask));
    state &= ~mask
  }
  return classNames
};
goog.ui.ControlRenderer.prototype.getClassForState = function(state) {
  if(!this.classByState_) {
    this.createClassByStateMap_()
  }
  return this.classByState_[state]
};
goog.ui.ControlRenderer.prototype.getStateFromClass = function(className) {
  if(!this.stateByClass_) {
    this.createStateByClassMap_()
  }
  var state = parseInt(this.stateByClass_[className], 10);
  return isNaN(state) ? 0 : state
};
goog.ui.ControlRenderer.prototype.createClassByStateMap_ = function() {
  var baseClass = this.getStructuralCssClass();
  this.classByState_ = goog.object.create(goog.ui.Component.State.DISABLED, goog.getCssName(baseClass, "disabled"), goog.ui.Component.State.HOVER, goog.getCssName(baseClass, "hover"), goog.ui.Component.State.ACTIVE, goog.getCssName(baseClass, "active"), goog.ui.Component.State.SELECTED, goog.getCssName(baseClass, "selected"), goog.ui.Component.State.CHECKED, goog.getCssName(baseClass, "checked"), goog.ui.Component.State.FOCUSED, goog.getCssName(baseClass, "focused"), goog.ui.Component.State.OPENED, 
  goog.getCssName(baseClass, "open"))
};
goog.ui.ControlRenderer.prototype.createStateByClassMap_ = function() {
  if(!this.classByState_) {
    this.createClassByStateMap_()
  }
  this.stateByClass_ = goog.object.transpose(this.classByState_)
};
goog.provide("goog.ui.registry");
goog.require("goog.dom.classes");
goog.ui.registry.getDefaultRenderer = function(componentCtor) {
  var key;
  var rendererCtor;
  while(componentCtor) {
    key = goog.getUid(componentCtor);
    if(rendererCtor = goog.ui.registry.defaultRenderers_[key]) {
      break
    }
    componentCtor = componentCtor.superClass_ ? componentCtor.superClass_.constructor : null
  }
  if(rendererCtor) {
    return goog.isFunction(rendererCtor.getInstance) ? rendererCtor.getInstance() : new rendererCtor
  }
  return null
};
goog.ui.registry.setDefaultRenderer = function(componentCtor, rendererCtor) {
  if(!goog.isFunction(componentCtor)) {
    throw Error("Invalid component class " + componentCtor);
  }
  if(!goog.isFunction(rendererCtor)) {
    throw Error("Invalid renderer class " + rendererCtor);
  }
  var key = goog.getUid(componentCtor);
  goog.ui.registry.defaultRenderers_[key] = rendererCtor
};
goog.ui.registry.getDecoratorByClassName = function(className) {
  return className in goog.ui.registry.decoratorFunctions_ ? goog.ui.registry.decoratorFunctions_[className]() : null
};
goog.ui.registry.setDecoratorByClassName = function(className, decoratorFn) {
  if(!className) {
    throw Error("Invalid class name " + className);
  }
  if(!goog.isFunction(decoratorFn)) {
    throw Error("Invalid decorator function " + decoratorFn);
  }
  goog.ui.registry.decoratorFunctions_[className] = decoratorFn
};
goog.ui.registry.getDecorator = function(element) {
  var decorator;
  var classNames = goog.dom.classes.get(element);
  for(var i = 0, len = classNames.length;i < len;i++) {
    if(decorator = goog.ui.registry.getDecoratorByClassName(classNames[i])) {
      return decorator
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
goog.provide("goog.ui.decorate");
goog.require("goog.ui.registry");
goog.ui.decorate = function(element) {
  var decorator = goog.ui.registry.getDecorator(element);
  if(decorator) {
    decorator.decorate(element)
  }
  return decorator
};
goog.provide("goog.ui.Control");
goog.require("goog.array");
goog.require("goog.dom");
goog.require("goog.events.BrowserEvent.MouseButton");
goog.require("goog.events.Event");
goog.require("goog.events.EventType");
goog.require("goog.events.KeyCodes");
goog.require("goog.events.KeyHandler");
goog.require("goog.events.KeyHandler.EventType");
goog.require("goog.string");
goog.require("goog.ui.Component");
goog.require("goog.ui.Component.Error");
goog.require("goog.ui.Component.EventType");
goog.require("goog.ui.Component.State");
goog.require("goog.ui.ControlContent");
goog.require("goog.ui.ControlRenderer");
goog.require("goog.ui.decorate");
goog.require("goog.ui.registry");
goog.require("goog.userAgent");
goog.ui.Control = function(content, opt_renderer, opt_domHelper) {
  goog.ui.Component.call(this, opt_domHelper);
  this.renderer_ = opt_renderer || goog.ui.registry.getDefaultRenderer(this.constructor);
  this.setContentInternal(content)
};
goog.inherits(goog.ui.Control, goog.ui.Component);
goog.ui.Control.registerDecorator = goog.ui.registry.setDecoratorByClassName;
goog.ui.Control.getDecorator = goog.ui.registry.getDecorator;
goog.ui.Control.decorate = goog.ui.decorate;
goog.ui.Control.prototype.renderer_;
goog.ui.Control.prototype.content_ = null;
goog.ui.Control.prototype.state_ = 0;
goog.ui.Control.prototype.supportedStates_ = goog.ui.Component.State.DISABLED | goog.ui.Component.State.HOVER | goog.ui.Component.State.ACTIVE | goog.ui.Component.State.FOCUSED;
goog.ui.Control.prototype.autoStates_ = goog.ui.Component.State.ALL;
goog.ui.Control.prototype.statesWithTransitionEvents_ = 0;
goog.ui.Control.prototype.visible_ = true;
goog.ui.Control.prototype.keyHandler_;
goog.ui.Control.prototype.extraClassNames_ = null;
goog.ui.Control.prototype.handleMouseEvents_ = true;
goog.ui.Control.prototype.allowTextSelection_ = false;
goog.ui.Control.prototype.preferredAriaRole_ = null;
goog.ui.Control.prototype.isHandleMouseEvents = function() {
  return this.handleMouseEvents_
};
goog.ui.Control.prototype.setHandleMouseEvents = function(enable) {
  if(this.isInDocument() && enable != this.handleMouseEvents_) {
    this.enableMouseEventHandling_(enable)
  }
  this.handleMouseEvents_ = enable
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
goog.ui.Control.prototype.setRenderer = function(renderer) {
  if(this.isInDocument()) {
    throw Error(goog.ui.Component.Error.ALREADY_RENDERED);
  }
  if(this.getElement()) {
    this.setElementInternal(null)
  }
  this.renderer_ = renderer
};
goog.ui.Control.prototype.getExtraClassNames = function() {
  return this.extraClassNames_
};
goog.ui.Control.prototype.addClassName = function(className) {
  if(className) {
    if(this.extraClassNames_) {
      if(!goog.array.contains(this.extraClassNames_, className)) {
        this.extraClassNames_.push(className)
      }
    }else {
      this.extraClassNames_ = [className]
    }
    this.renderer_.enableExtraClassName(this, className, true)
  }
};
goog.ui.Control.prototype.removeClassName = function(className) {
  if(className && this.extraClassNames_) {
    goog.array.remove(this.extraClassNames_, className);
    if(this.extraClassNames_.length == 0) {
      this.extraClassNames_ = null
    }
    this.renderer_.enableExtraClassName(this, className, false)
  }
};
goog.ui.Control.prototype.enableClassName = function(className, enable) {
  if(enable) {
    this.addClassName(className)
  }else {
    this.removeClassName(className)
  }
};
goog.ui.Control.prototype.createDom = function() {
  var element = this.renderer_.createDom(this);
  this.setElementInternal(element);
  this.renderer_.setAriaRole(element, this.getPreferredAriaRole());
  if(!this.isAllowTextSelection()) {
    this.renderer_.setAllowTextSelection(element, false)
  }
  if(!this.isVisible()) {
    this.renderer_.setVisible(element, false)
  }
};
goog.ui.Control.prototype.getPreferredAriaRole = function() {
  return this.preferredAriaRole_
};
goog.ui.Control.prototype.setPreferredAriaRole = function(role) {
  this.preferredAriaRole_ = role
};
goog.ui.Control.prototype.getContentElement = function() {
  return this.renderer_.getContentElement(this.getElement())
};
goog.ui.Control.prototype.canDecorate = function(element) {
  return this.renderer_.canDecorate(element)
};
goog.ui.Control.prototype.decorateInternal = function(element) {
  element = this.renderer_.decorate(this, element);
  this.setElementInternal(element);
  this.renderer_.setAriaRole(element, this.getPreferredAriaRole());
  if(!this.isAllowTextSelection()) {
    this.renderer_.setAllowTextSelection(element, false)
  }
  this.visible_ = element.style.display != "none"
};
goog.ui.Control.prototype.enterDocument = function() {
  goog.ui.Control.superClass_.enterDocument.call(this);
  this.renderer_.initializeDom(this);
  if(this.supportedStates_ & ~goog.ui.Component.State.DISABLED) {
    if(this.isHandleMouseEvents()) {
      this.enableMouseEventHandling_(true)
    }
    if(this.isSupportedState(goog.ui.Component.State.FOCUSED)) {
      var keyTarget = this.getKeyEventTarget();
      if(keyTarget) {
        var keyHandler = this.getKeyHandler();
        keyHandler.attach(keyTarget);
        this.getHandler().listen(keyHandler, goog.events.KeyHandler.EventType.KEY, this.handleKeyEvent).listen(keyTarget, goog.events.EventType.FOCUS, this.handleFocus).listen(keyTarget, goog.events.EventType.BLUR, this.handleBlur)
      }
    }
  }
};
goog.ui.Control.prototype.enableMouseEventHandling_ = function(enable) {
  var handler = this.getHandler();
  var element = this.getElement();
  if(enable) {
    handler.listen(element, goog.events.EventType.MOUSEOVER, this.handleMouseOver).listen(element, goog.events.EventType.MOUSEDOWN, this.handleMouseDown).listen(element, goog.events.EventType.MOUSEUP, this.handleMouseUp).listen(element, goog.events.EventType.MOUSEOUT, this.handleMouseOut);
    if(this.handleContextMenu != goog.nullFunction) {
      handler.listen(element, goog.events.EventType.CONTEXTMENU, this.handleContextMenu)
    }
    if(goog.userAgent.IE) {
      handler.listen(element, goog.events.EventType.DBLCLICK, this.handleDblClick)
    }
  }else {
    handler.unlisten(element, goog.events.EventType.MOUSEOVER, this.handleMouseOver).unlisten(element, goog.events.EventType.MOUSEDOWN, this.handleMouseDown).unlisten(element, goog.events.EventType.MOUSEUP, this.handleMouseUp).unlisten(element, goog.events.EventType.MOUSEOUT, this.handleMouseOut);
    if(this.handleContextMenu != goog.nullFunction) {
      handler.unlisten(element, goog.events.EventType.CONTEXTMENU, this.handleContextMenu)
    }
    if(goog.userAgent.IE) {
      handler.unlisten(element, goog.events.EventType.DBLCLICK, this.handleDblClick)
    }
  }
};
goog.ui.Control.prototype.exitDocument = function() {
  goog.ui.Control.superClass_.exitDocument.call(this);
  if(this.keyHandler_) {
    this.keyHandler_.detach()
  }
  if(this.isVisible() && this.isEnabled()) {
    this.renderer_.setFocusable(this, false)
  }
};
goog.ui.Control.prototype.disposeInternal = function() {
  goog.ui.Control.superClass_.disposeInternal.call(this);
  if(this.keyHandler_) {
    this.keyHandler_.dispose();
    delete this.keyHandler_
  }
  delete this.renderer_;
  this.content_ = null;
  this.extraClassNames_ = null
};
goog.ui.Control.prototype.getContent = function() {
  return this.content_
};
goog.ui.Control.prototype.setContent = function(content) {
  this.renderer_.setContent(this.getElement(), content);
  this.setContentInternal(content)
};
goog.ui.Control.prototype.setContentInternal = function(content) {
  this.content_ = content
};
goog.ui.Control.prototype.getCaption = function() {
  var content = this.getContent();
  if(!content) {
    return""
  }
  var caption = goog.isString(content) ? content : goog.isArray(content) ? goog.array.map(content, goog.dom.getRawTextContent).join("") : goog.dom.getTextContent(content);
  return goog.string.collapseBreakingSpaces(caption)
};
goog.ui.Control.prototype.setCaption = function(caption) {
  this.setContent(caption)
};
goog.ui.Control.prototype.setRightToLeft = function(rightToLeft) {
  goog.ui.Control.superClass_.setRightToLeft.call(this, rightToLeft);
  var element = this.getElement();
  if(element) {
    this.renderer_.setRightToLeft(element, rightToLeft)
  }
};
goog.ui.Control.prototype.isAllowTextSelection = function() {
  return this.allowTextSelection_
};
goog.ui.Control.prototype.setAllowTextSelection = function(allow) {
  this.allowTextSelection_ = allow;
  var element = this.getElement();
  if(element) {
    this.renderer_.setAllowTextSelection(element, allow)
  }
};
goog.ui.Control.prototype.isVisible = function() {
  return this.visible_
};
goog.ui.Control.prototype.setVisible = function(visible, opt_force) {
  if(opt_force || this.visible_ != visible && this.dispatchEvent(visible ? goog.ui.Component.EventType.SHOW : goog.ui.Component.EventType.HIDE)) {
    var element = this.getElement();
    if(element) {
      this.renderer_.setVisible(element, visible)
    }
    if(this.isEnabled()) {
      this.renderer_.setFocusable(this, visible)
    }
    this.visible_ = visible;
    return true
  }
  return false
};
goog.ui.Control.prototype.isEnabled = function() {
  return!this.hasState(goog.ui.Component.State.DISABLED)
};
goog.ui.Control.prototype.isParentDisabled_ = function() {
  var parent = this.getParent();
  return!!parent && typeof parent.isEnabled == "function" && !parent.isEnabled()
};
goog.ui.Control.prototype.setEnabled = function(enable) {
  if(!this.isParentDisabled_() && this.isTransitionAllowed(goog.ui.Component.State.DISABLED, !enable)) {
    if(!enable) {
      this.setActive(false);
      this.setHighlighted(false)
    }
    if(this.isVisible()) {
      this.renderer_.setFocusable(this, enable)
    }
    this.setState(goog.ui.Component.State.DISABLED, !enable)
  }
};
goog.ui.Control.prototype.isHighlighted = function() {
  return this.hasState(goog.ui.Component.State.HOVER)
};
goog.ui.Control.prototype.setHighlighted = function(highlight) {
  if(this.isTransitionAllowed(goog.ui.Component.State.HOVER, highlight)) {
    this.setState(goog.ui.Component.State.HOVER, highlight)
  }
};
goog.ui.Control.prototype.isActive = function() {
  return this.hasState(goog.ui.Component.State.ACTIVE)
};
goog.ui.Control.prototype.setActive = function(active) {
  if(this.isTransitionAllowed(goog.ui.Component.State.ACTIVE, active)) {
    this.setState(goog.ui.Component.State.ACTIVE, active)
  }
};
goog.ui.Control.prototype.isSelected = function() {
  return this.hasState(goog.ui.Component.State.SELECTED)
};
goog.ui.Control.prototype.setSelected = function(select) {
  if(this.isTransitionAllowed(goog.ui.Component.State.SELECTED, select)) {
    this.setState(goog.ui.Component.State.SELECTED, select)
  }
};
goog.ui.Control.prototype.isChecked = function() {
  return this.hasState(goog.ui.Component.State.CHECKED)
};
goog.ui.Control.prototype.setChecked = function(check) {
  if(this.isTransitionAllowed(goog.ui.Component.State.CHECKED, check)) {
    this.setState(goog.ui.Component.State.CHECKED, check)
  }
};
goog.ui.Control.prototype.isFocused = function() {
  return this.hasState(goog.ui.Component.State.FOCUSED)
};
goog.ui.Control.prototype.setFocused = function(focused) {
  if(this.isTransitionAllowed(goog.ui.Component.State.FOCUSED, focused)) {
    this.setState(goog.ui.Component.State.FOCUSED, focused)
  }
};
goog.ui.Control.prototype.isOpen = function() {
  return this.hasState(goog.ui.Component.State.OPENED)
};
goog.ui.Control.prototype.setOpen = function(open) {
  if(this.isTransitionAllowed(goog.ui.Component.State.OPENED, open)) {
    this.setState(goog.ui.Component.State.OPENED, open)
  }
};
goog.ui.Control.prototype.getState = function() {
  return this.state_
};
goog.ui.Control.prototype.hasState = function(state) {
  return!!(this.state_ & state)
};
goog.ui.Control.prototype.setState = function(state, enable) {
  if(this.isSupportedState(state) && enable != this.hasState(state)) {
    this.renderer_.setState(this, state, enable);
    this.state_ = enable ? this.state_ | state : this.state_ & ~state
  }
};
goog.ui.Control.prototype.setStateInternal = function(state) {
  this.state_ = state
};
goog.ui.Control.prototype.isSupportedState = function(state) {
  return!!(this.supportedStates_ & state)
};
goog.ui.Control.prototype.setSupportedState = function(state, support) {
  if(this.isInDocument() && this.hasState(state) && !support) {
    throw Error(goog.ui.Component.Error.ALREADY_RENDERED);
  }
  if(!support && this.hasState(state)) {
    this.setState(state, false)
  }
  this.supportedStates_ = support ? this.supportedStates_ | state : this.supportedStates_ & ~state
};
goog.ui.Control.prototype.isAutoState = function(state) {
  return!!(this.autoStates_ & state) && this.isSupportedState(state)
};
goog.ui.Control.prototype.setAutoStates = function(states, enable) {
  this.autoStates_ = enable ? this.autoStates_ | states : this.autoStates_ & ~states
};
goog.ui.Control.prototype.isDispatchTransitionEvents = function(state) {
  return!!(this.statesWithTransitionEvents_ & state) && this.isSupportedState(state)
};
goog.ui.Control.prototype.setDispatchTransitionEvents = function(states, enable) {
  this.statesWithTransitionEvents_ = enable ? this.statesWithTransitionEvents_ | states : this.statesWithTransitionEvents_ & ~states
};
goog.ui.Control.prototype.isTransitionAllowed = function(state, enable) {
  return this.isSupportedState(state) && this.hasState(state) != enable && (!(this.statesWithTransitionEvents_ & state) || this.dispatchEvent(goog.ui.Component.getStateTransitionEvent(state, enable))) && !this.isDisposed()
};
goog.ui.Control.prototype.handleMouseOver = function(e) {
  if(!goog.ui.Control.isMouseEventWithinElement_(e, this.getElement()) && this.dispatchEvent(goog.ui.Component.EventType.ENTER) && this.isEnabled() && this.isAutoState(goog.ui.Component.State.HOVER)) {
    this.setHighlighted(true)
  }
};
goog.ui.Control.prototype.handleMouseOut = function(e) {
  if(!goog.ui.Control.isMouseEventWithinElement_(e, this.getElement()) && this.dispatchEvent(goog.ui.Component.EventType.LEAVE)) {
    if(this.isAutoState(goog.ui.Component.State.ACTIVE)) {
      this.setActive(false)
    }
    if(this.isAutoState(goog.ui.Component.State.HOVER)) {
      this.setHighlighted(false)
    }
  }
};
goog.ui.Control.prototype.handleContextMenu = goog.nullFunction;
goog.ui.Control.isMouseEventWithinElement_ = function(e, elem) {
  return!!e.relatedTarget && goog.dom.contains(elem, e.relatedTarget)
};
goog.ui.Control.prototype.handleMouseDown = function(e) {
  if(this.isEnabled()) {
    if(this.isAutoState(goog.ui.Component.State.HOVER)) {
      this.setHighlighted(true)
    }
    if(e.isMouseActionButton()) {
      if(this.isAutoState(goog.ui.Component.State.ACTIVE)) {
        this.setActive(true)
      }
      if(this.renderer_.isFocusable(this)) {
        this.getKeyEventTarget().focus()
      }
    }
  }
  if(!this.isAllowTextSelection() && e.isMouseActionButton()) {
    e.preventDefault()
  }
};
goog.ui.Control.prototype.handleMouseUp = function(e) {
  if(this.isEnabled()) {
    if(this.isAutoState(goog.ui.Component.State.HOVER)) {
      this.setHighlighted(true)
    }
    if(this.isActive() && this.performActionInternal(e) && this.isAutoState(goog.ui.Component.State.ACTIVE)) {
      this.setActive(false)
    }
  }
};
goog.ui.Control.prototype.handleDblClick = function(e) {
  if(this.isEnabled()) {
    this.performActionInternal(e)
  }
};
goog.ui.Control.prototype.performActionInternal = function(e) {
  if(this.isAutoState(goog.ui.Component.State.CHECKED)) {
    this.setChecked(!this.isChecked())
  }
  if(this.isAutoState(goog.ui.Component.State.SELECTED)) {
    this.setSelected(true)
  }
  if(this.isAutoState(goog.ui.Component.State.OPENED)) {
    this.setOpen(!this.isOpen())
  }
  var actionEvent = new goog.events.Event(goog.ui.Component.EventType.ACTION, this);
  if(e) {
    actionEvent.altKey = e.altKey;
    actionEvent.ctrlKey = e.ctrlKey;
    actionEvent.metaKey = e.metaKey;
    actionEvent.shiftKey = e.shiftKey;
    actionEvent.platformModifierKey = e.platformModifierKey
  }
  return this.dispatchEvent(actionEvent)
};
goog.ui.Control.prototype.handleFocus = function(e) {
  if(this.isAutoState(goog.ui.Component.State.FOCUSED)) {
    this.setFocused(true)
  }
};
goog.ui.Control.prototype.handleBlur = function(e) {
  if(this.isAutoState(goog.ui.Component.State.ACTIVE)) {
    this.setActive(false)
  }
  if(this.isAutoState(goog.ui.Component.State.FOCUSED)) {
    this.setFocused(false)
  }
};
goog.ui.Control.prototype.handleKeyEvent = function(e) {
  if(this.isVisible() && this.isEnabled() && this.handleKeyEventInternal(e)) {
    e.preventDefault();
    e.stopPropagation();
    return true
  }
  return false
};
goog.ui.Control.prototype.handleKeyEventInternal = function(e) {
  return e.keyCode == goog.events.KeyCodes.ENTER && this.performActionInternal(e)
};
goog.ui.registry.setDefaultRenderer(goog.ui.Control, goog.ui.ControlRenderer);
goog.ui.registry.setDecoratorByClassName(goog.ui.ControlRenderer.CSS_CLASS, function() {
  return new goog.ui.Control(null)
});
goog.provide("goog.ui.TextareaRenderer");
goog.require("goog.ui.Component.State");
goog.require("goog.ui.ControlRenderer");
goog.ui.TextareaRenderer = function() {
  goog.ui.ControlRenderer.call(this)
};
goog.inherits(goog.ui.TextareaRenderer, goog.ui.ControlRenderer);
goog.addSingletonGetter(goog.ui.TextareaRenderer);
goog.ui.TextareaRenderer.CSS_CLASS = goog.getCssName("goog-textarea");
goog.ui.TextareaRenderer.prototype.getAriaRole = function() {
  return undefined
};
goog.ui.TextareaRenderer.prototype.decorate = function(control, element) {
  this.setUpTextarea_(control);
  goog.ui.TextareaRenderer.superClass_.decorate.call(this, control, element);
  control.setContent(element.value);
  return element
};
goog.ui.TextareaRenderer.prototype.createDom = function(textarea) {
  this.setUpTextarea_(textarea);
  var element = textarea.getDomHelper().createDom("textarea", {"class":this.getClassNames(textarea).join(" "), "disabled":!textarea.isEnabled()}, textarea.getContent() || "");
  return element
};
goog.ui.TextareaRenderer.prototype.canDecorate = function(element) {
  return element.tagName == goog.dom.TagName.TEXTAREA
};
goog.ui.TextareaRenderer.prototype.setRightToLeft = goog.nullFunction;
goog.ui.TextareaRenderer.prototype.isFocusable = function(textarea) {
  return textarea.isEnabled()
};
goog.ui.TextareaRenderer.prototype.setFocusable = goog.nullFunction;
goog.ui.TextareaRenderer.prototype.setState = function(textarea, state, enable) {
  goog.ui.TextareaRenderer.superClass_.setState.call(this, textarea, state, enable);
  var element = textarea.getElement();
  if(element && state == goog.ui.Component.State.DISABLED) {
    element.disabled = enable
  }
};
goog.ui.TextareaRenderer.prototype.updateAriaState = goog.nullFunction;
goog.ui.TextareaRenderer.prototype.setUpTextarea_ = function(textarea) {
  textarea.setHandleMouseEvents(false);
  textarea.setAutoStates(goog.ui.Component.State.ALL, false);
  textarea.setSupportedState(goog.ui.Component.State.FOCUSED, false)
};
goog.ui.TextareaRenderer.prototype.setContent = function(element, value) {
  if(element) {
    element.value = value
  }
};
goog.ui.TextareaRenderer.prototype.getCssClass = function() {
  return goog.ui.TextareaRenderer.CSS_CLASS
};
goog.provide("goog.userAgent.product");
goog.require("goog.userAgent");
goog.userAgent.product.ASSUME_FIREFOX = false;
goog.userAgent.product.ASSUME_CAMINO = false;
goog.userAgent.product.ASSUME_IPHONE = false;
goog.userAgent.product.ASSUME_IPAD = false;
goog.userAgent.product.ASSUME_ANDROID = false;
goog.userAgent.product.ASSUME_CHROME = false;
goog.userAgent.product.ASSUME_SAFARI = false;
goog.userAgent.product.PRODUCT_KNOWN_ = goog.userAgent.ASSUME_IE || goog.userAgent.ASSUME_OPERA || goog.userAgent.product.ASSUME_FIREFOX || goog.userAgent.product.ASSUME_CAMINO || goog.userAgent.product.ASSUME_IPHONE || goog.userAgent.product.ASSUME_IPAD || goog.userAgent.product.ASSUME_ANDROID || goog.userAgent.product.ASSUME_CHROME || goog.userAgent.product.ASSUME_SAFARI;
goog.userAgent.product.init_ = function() {
  goog.userAgent.product.detectedFirefox_ = false;
  goog.userAgent.product.detectedCamino_ = false;
  goog.userAgent.product.detectedIphone_ = false;
  goog.userAgent.product.detectedIpad_ = false;
  goog.userAgent.product.detectedAndroid_ = false;
  goog.userAgent.product.detectedChrome_ = false;
  goog.userAgent.product.detectedSafari_ = false;
  var ua = goog.userAgent.getUserAgentString();
  if(!ua) {
    return
  }
  if(ua.indexOf("Firefox") != -1) {
    goog.userAgent.product.detectedFirefox_ = true
  }else {
    if(ua.indexOf("Camino") != -1) {
      goog.userAgent.product.detectedCamino_ = true
    }else {
      if(ua.indexOf("iPhone") != -1 || ua.indexOf("iPod") != -1) {
        goog.userAgent.product.detectedIphone_ = true
      }else {
        if(ua.indexOf("iPad") != -1) {
          goog.userAgent.product.detectedIpad_ = true
        }else {
          if(ua.indexOf("Android") != -1) {
            goog.userAgent.product.detectedAndroid_ = true
          }else {
            if(ua.indexOf("Chrome") != -1) {
              goog.userAgent.product.detectedChrome_ = true
            }else {
              if(ua.indexOf("Safari") != -1) {
                goog.userAgent.product.detectedSafari_ = true
              }
            }
          }
        }
      }
    }
  }
};
if(!goog.userAgent.product.PRODUCT_KNOWN_) {
  goog.userAgent.product.init_()
}
goog.userAgent.product.OPERA = goog.userAgent.OPERA;
goog.userAgent.product.IE = goog.userAgent.IE;
goog.userAgent.product.FIREFOX = goog.userAgent.product.PRODUCT_KNOWN_ ? goog.userAgent.product.ASSUME_FIREFOX : goog.userAgent.product.detectedFirefox_;
goog.userAgent.product.CAMINO = goog.userAgent.product.PRODUCT_KNOWN_ ? goog.userAgent.product.ASSUME_CAMINO : goog.userAgent.product.detectedCamino_;
goog.userAgent.product.IPHONE = goog.userAgent.product.PRODUCT_KNOWN_ ? goog.userAgent.product.ASSUME_IPHONE : goog.userAgent.product.detectedIphone_;
goog.userAgent.product.IPAD = goog.userAgent.product.PRODUCT_KNOWN_ ? goog.userAgent.product.ASSUME_IPAD : goog.userAgent.product.detectedIpad_;
goog.userAgent.product.ANDROID = goog.userAgent.product.PRODUCT_KNOWN_ ? goog.userAgent.product.ASSUME_ANDROID : goog.userAgent.product.detectedAndroid_;
goog.userAgent.product.CHROME = goog.userAgent.product.PRODUCT_KNOWN_ ? goog.userAgent.product.ASSUME_CHROME : goog.userAgent.product.detectedChrome_;
goog.userAgent.product.SAFARI = goog.userAgent.product.PRODUCT_KNOWN_ ? goog.userAgent.product.ASSUME_SAFARI : goog.userAgent.product.detectedSafari_;
goog.provide("goog.ui.Textarea");
goog.provide("goog.ui.Textarea.EventType");
goog.require("goog.Timer");
goog.require("goog.events.EventType");
goog.require("goog.events.KeyCodes");
goog.require("goog.style");
goog.require("goog.ui.Control");
goog.require("goog.ui.TextareaRenderer");
goog.require("goog.userAgent");
goog.require("goog.userAgent.product");
goog.ui.Textarea = function(content, opt_renderer, opt_domHelper) {
  goog.ui.Control.call(this, content, opt_renderer || goog.ui.TextareaRenderer.getInstance(), opt_domHelper);
  this.setHandleMouseEvents(false);
  this.setAllowTextSelection(true);
  if(!content) {
    this.setContentInternal("")
  }
};
goog.inherits(goog.ui.Textarea, goog.ui.Control);
goog.ui.Textarea.NEEDS_HELP_SHRINKING_ = goog.userAgent.GECKO || goog.userAgent.WEBKIT;
goog.ui.Textarea.prototype.isResizing_ = false;
goog.ui.Textarea.prototype.height_ = 0;
goog.ui.Textarea.prototype.maxHeight_ = 0;
goog.ui.Textarea.prototype.minHeight_ = 0;
goog.ui.Textarea.prototype.hasDiscoveredTextareaCharacteristics_ = false;
goog.ui.Textarea.prototype.needsPaddingBorderFix_ = false;
goog.ui.Textarea.prototype.scrollHeightIncludesPadding_ = false;
goog.ui.Textarea.prototype.scrollHeightIncludesBorder_ = false;
goog.ui.Textarea.prototype.paddingBox_;
goog.ui.Textarea.prototype.borderBox_;
goog.ui.Textarea.EventType = {RESIZE:"resize"};
goog.ui.Textarea.prototype.getPaddingBorderBoxHeight_ = function() {
  var paddingBorderBoxHeight = this.paddingBox_.top + this.paddingBox_.bottom + this.borderBox_.top + this.borderBox_.bottom;
  return paddingBorderBoxHeight
};
goog.ui.Textarea.prototype.getMinHeight = function() {
  return this.minHeight_
};
goog.ui.Textarea.prototype.getMinHeight_ = function() {
  var minHeight = this.minHeight_;
  var textarea = this.getElement();
  if(minHeight && textarea && this.needsPaddingBorderFix_) {
    minHeight -= this.getPaddingBorderBoxHeight_()
  }
  return minHeight
};
goog.ui.Textarea.prototype.setMinHeight = function(height) {
  this.minHeight_ = height;
  this.resize()
};
goog.ui.Textarea.prototype.getMaxHeight = function() {
  return this.maxHeight_
};
goog.ui.Textarea.prototype.getMaxHeight_ = function() {
  var maxHeight = this.maxHeight_;
  var textarea = this.getElement();
  if(maxHeight && textarea && this.needsPaddingBorderFix_) {
    maxHeight -= this.getPaddingBorderBoxHeight_()
  }
  return maxHeight
};
goog.ui.Textarea.prototype.setMaxHeight = function(height) {
  this.maxHeight_ = height;
  this.resize()
};
goog.ui.Textarea.prototype.setValue = function(value) {
  this.setContent(String(value))
};
goog.ui.Textarea.prototype.getValue = function() {
  return this.getElement().value
};
goog.ui.Textarea.prototype.setContent = function(content) {
  goog.ui.Textarea.superClass_.setContent.call(this, content);
  this.resize()
};
goog.ui.Textarea.prototype.setEnabled = function(enable) {
  goog.ui.Textarea.superClass_.setEnabled.call(this, enable);
  this.getElement().disabled = !enable
};
goog.ui.Textarea.prototype.resize = function() {
  if(this.getElement()) {
    this.grow_()
  }
};
goog.ui.Textarea.prototype.enterDocument = function() {
  goog.base(this, "enterDocument");
  var textarea = this.getElement();
  goog.style.setStyle(textarea, {"overflowY":"hidden", "overflowX":"auto", "boxSizing":"border-box", "MsBoxSizing":"border-box", "WebkitBoxSizing":"border-box", "MozBoxSizing":"border-box"});
  this.paddingBox_ = goog.style.getPaddingBox(textarea);
  this.borderBox_ = goog.style.getBorderBox(textarea);
  this.getHandler().listen(textarea, goog.events.EventType.SCROLL, this.grow_).listen(textarea, goog.events.EventType.FOCUS, this.grow_).listen(textarea, goog.events.EventType.KEYUP, this.grow_).listen(textarea, goog.events.EventType.MOUSEUP, this.mouseUpListener_);
  this.resize()
};
goog.ui.Textarea.prototype.getHeight_ = function() {
  this.discoverTextareaCharacteristics_();
  var textarea = this.getElement();
  var height = this.getElement().scrollHeight + this.getHorizontalScrollBarHeight_();
  if(this.needsPaddingBorderFix_) {
    height -= this.getPaddingBorderBoxHeight_()
  }else {
    if(!this.scrollHeightIncludesPadding_) {
      var paddingBox = this.paddingBox_;
      var paddingBoxHeight = paddingBox.top + paddingBox.bottom;
      height += paddingBoxHeight
    }
    if(!this.scrollHeightIncludesBorder_) {
      var borderBox = goog.style.getBorderBox(textarea);
      var borderBoxHeight = borderBox.top + borderBox.bottom;
      height += borderBoxHeight
    }
  }
  return height
};
goog.ui.Textarea.prototype.setHeight_ = function(height) {
  if(this.height_ != height) {
    this.height_ = height;
    this.getElement().style.height = height + "px"
  }
};
goog.ui.Textarea.prototype.setHeightToEstimate_ = function() {
  var textarea = this.getElement();
  textarea.style.height = "auto";
  var newlines = textarea.value.match(/\n/g) || [];
  textarea.rows = newlines.length + 1
};
goog.ui.Textarea.prototype.getHorizontalScrollBarHeight_ = function() {
  var textarea = this.getElement();
  var height = textarea.offsetHeight - textarea.clientHeight;
  if(!this.scrollHeightIncludesPadding_) {
    var paddingBox = this.paddingBox_;
    var paddingBoxHeight = paddingBox.top + paddingBox.bottom;
    height -= paddingBoxHeight
  }
  if(!this.scrollHeightIncludesBorder_) {
    var borderBox = goog.style.getBorderBox(textarea);
    var borderBoxHeight = borderBox.top + borderBox.bottom;
    height -= borderBoxHeight
  }
  return height > 0 ? height : 0
};
goog.ui.Textarea.prototype.discoverTextareaCharacteristics_ = function() {
  if(!this.hasDiscoveredTextareaCharacteristics_) {
    var textarea = this.getElement().cloneNode(false);
    goog.style.setStyle(textarea, {"position":"absolute", "height":"auto", "top":"-9999px", "margin":"0", "padding":"1px", "border":"1px solid #000", "overflow":"hidden"});
    goog.dom.appendChild(this.getDomHelper().getDocument().body, textarea);
    var initialScrollHeight = textarea.scrollHeight;
    textarea.style.padding = "10px";
    var paddingScrollHeight = textarea.scrollHeight;
    this.scrollHeightIncludesPadding_ = paddingScrollHeight > initialScrollHeight;
    initialScrollHeight = paddingScrollHeight;
    textarea.style.borderWidth = "10px";
    var borderScrollHeight = textarea.scrollHeight;
    this.scrollHeightIncludesBorder_ = borderScrollHeight > initialScrollHeight;
    textarea.style.height = "100px";
    var offsetHeightAtHeight100 = textarea.offsetHeight;
    if(offsetHeightAtHeight100 != 100) {
      this.needsPaddingBorderFix_ = true
    }
    goog.dom.removeNode(textarea);
    this.hasDiscoveredTextareaCharacteristics_ = true
  }
};
goog.ui.Textarea.prototype.grow_ = function(opt_e) {
  if(this.isResizing_) {
    return
  }
  var shouldCallShrink = false;
  this.isResizing_ = true;
  var textarea = this.getElement();
  var oldHeight = this.height_;
  if(textarea.scrollHeight) {
    var setMinHeight = false;
    var setMaxHeight = false;
    var newHeight = this.getHeight_();
    var currentHeight = textarea.offsetHeight;
    var minHeight = this.getMinHeight_();
    var maxHeight = this.getMaxHeight_();
    if(minHeight && newHeight < minHeight) {
      this.setHeight_(minHeight);
      setMinHeight = true
    }else {
      if(maxHeight && newHeight > maxHeight) {
        this.setHeight_(maxHeight);
        textarea.style.overflowY = "";
        setMaxHeight = true
      }else {
        if(currentHeight != newHeight) {
          this.setHeight_(newHeight)
        }else {
          if(!this.height_) {
            this.height_ = newHeight
          }
        }
      }
    }
    if(!setMinHeight && !setMaxHeight && goog.ui.Textarea.NEEDS_HELP_SHRINKING_) {
      shouldCallShrink = true
    }
  }else {
    this.setHeightToEstimate_()
  }
  this.isResizing_ = false;
  if(shouldCallShrink) {
    this.shrink_()
  }
  if(oldHeight != this.height_) {
    this.dispatchEvent(goog.ui.Textarea.EventType.RESIZE)
  }
};
goog.ui.Textarea.prototype.shrink_ = function() {
  var textarea = this.getElement();
  if(!this.isResizing_) {
    this.isResizing_ = true;
    var isEmpty = false;
    if(!textarea.value) {
      textarea.value = " ";
      isEmpty = true
    }
    var scrollHeight = textarea.scrollHeight;
    if(!scrollHeight) {
      this.setHeightToEstimate_()
    }else {
      var currentHeight = this.getHeight_();
      var minHeight = this.getMinHeight_();
      var maxHeight = this.getMaxHeight_();
      if(!(minHeight && currentHeight <= minHeight) && !(maxHeight && currentHeight >= maxHeight)) {
        var paddingBox = this.paddingBox_;
        textarea.style.paddingBottom = paddingBox.bottom + 1 + "px";
        var heightAfterNudge = this.getHeight_();
        if(heightAfterNudge == currentHeight) {
          textarea.style.paddingBottom = paddingBox.bottom + scrollHeight + "px";
          textarea.scrollTop = 0;
          var shrinkToHeight = this.getHeight_() - scrollHeight;
          if(shrinkToHeight >= minHeight) {
            this.setHeight_(shrinkToHeight)
          }else {
            this.setHeight_(minHeight)
          }
        }
        textarea.style.paddingBottom = paddingBox.bottom + "px"
      }
    }
    if(isEmpty) {
      textarea.value = ""
    }
    this.isResizing_ = false
  }
};
goog.ui.Textarea.prototype.mouseUpListener_ = function(e) {
  var textarea = this.getElement();
  var height = textarea.offsetHeight;
  if(textarea["filters"] && textarea["filters"].length) {
    var dropShadow = textarea["filters"]["item"]("DXImageTransform.Microsoft.DropShadow");
    if(dropShadow) {
      height -= dropShadow["offX"]
    }
  }
  if(height != this.height_) {
    this.minHeight_ = height;
    this.height_ = height
  }
};
goog.provide("goog.structs.InversionMap");
goog.require("goog.array");
goog.structs.InversionMap = function(rangeArray, valueArray, opt_delta) {
  if(rangeArray.length != valueArray.length) {
    return null
  }
  this.storeInversion_(rangeArray, opt_delta);
  this.values = valueArray
};
goog.structs.InversionMap.prototype.rangeArray;
goog.structs.InversionMap.prototype.storeInversion_ = function(rangeArray, opt_delta) {
  this.rangeArray = rangeArray;
  for(var i = 1;i < rangeArray.length;i++) {
    if(rangeArray[i] == null) {
      rangeArray[i] = rangeArray[i - 1] + 1
    }else {
      if(opt_delta) {
        rangeArray[i] += rangeArray[i - 1]
      }
    }
  }
};
goog.structs.InversionMap.prototype.spliceInversion = function(rangeArray, valueArray, opt_delta) {
  var otherMap = new goog.structs.InversionMap(rangeArray, valueArray, opt_delta);
  var startRange = otherMap.rangeArray[0];
  var endRange = goog.array.peek(otherMap.rangeArray);
  var startSplice = this.getLeast(startRange);
  var endSplice = this.getLeast(endRange);
  if(startRange != this.rangeArray[startSplice]) {
    startSplice++
  }
  var spliceLength = endSplice - startSplice + 1;
  goog.partial(goog.array.splice, this.rangeArray, startSplice, spliceLength).apply(null, otherMap.rangeArray);
  goog.partial(goog.array.splice, this.values, startSplice, spliceLength).apply(null, otherMap.values)
};
goog.structs.InversionMap.prototype.at = function(intKey) {
  var index = this.getLeast(intKey);
  if(index < 0) {
    return null
  }
  return this.values[index]
};
goog.structs.InversionMap.prototype.getLeast = function(intKey) {
  var arr = this.rangeArray;
  var low = 0;
  var high = arr.length;
  while(high - low > 8) {
    var mid = high + low >> 1;
    if(arr[mid] <= intKey) {
      low = mid
    }else {
      high = mid
    }
  }
  for(;low < high;++low) {
    if(intKey < arr[low]) {
      break
    }
  }
  return low - 1
};
goog.provide("goog.i18n.GraphemeBreak");
goog.require("goog.structs.InversionMap");
goog.i18n.GraphemeBreak.property = {ANY:0, CONTROL:1, EXTEND:2, PREPEND:3, SPACING_MARK:4, L:5, V:6, T:7, LV:8, LVT:9, CR:10, LF:11};
goog.i18n.GraphemeBreak.inversions_ = null;
goog.i18n.GraphemeBreak.applyLegacyBreakRules_ = function(prop_a, prop_b) {
  var prop = goog.i18n.GraphemeBreak.property;
  if(prop_a == prop.CR && prop_b == prop.LF) {
    return false
  }
  if(prop_a == prop.CONTROL || prop_a == prop.CR || prop_a == prop.LF) {
    return true
  }
  if(prop_b == prop.CONTROL || prop_b == prop.CR || prop_b == prop.LF) {
    return true
  }
  if(prop_a == prop.L && (prop_b == prop.L || prop_b == prop.V || prop_b == prop.LV || prop_b == prop.LVT)) {
    return false
  }
  if((prop_a == prop.LV || prop_a == prop.V) && (prop_b == prop.V || prop_b == prop.T)) {
    return false
  }
  if((prop_a == prop.LVT || prop_a == prop.T) && prop_b == prop.T) {
    return false
  }
  if(prop_b == prop.EXTEND) {
    return false
  }
  return true
};
goog.i18n.GraphemeBreak.getBreakProp_ = function(acode) {
  if(44032 <= acode && acode <= 55203) {
    var prop = goog.i18n.GraphemeBreak.property;
    if(acode % 28 == 16) {
      return prop.LV
    }
    return prop.LVT
  }else {
    if(!goog.i18n.GraphemeBreak.inversions_) {
      goog.i18n.GraphemeBreak.inversions_ = new goog.structs.InversionMap([0, 10, 1, 2, 1, 18, 95, 33, 13, 1, 594, 112, 275, 7, 263, 45, 1, 1, 1, 2, 1, 2, 1, 1, 56, 4, 12, 11, 48, 20, 17, 1, 101, 7, 1, 7, 2, 2, 1, 4, 33, 1, 1, 1, 30, 27, 91, 11, 58, 9, 269, 2, 1, 56, 1, 1, 3, 8, 4, 1, 3, 4, 13, 2, 29, 1, 2, 56, 1, 1, 1, 2, 6, 6, 1, 9, 1, 10, 2, 29, 2, 1, 56, 2, 3, 17, 30, 2, 3, 14, 1, 56, 1, 1, 3, 8, 4, 1, 20, 2, 29, 1, 2, 56, 1, 1, 2, 1, 6, 6, 11, 10, 2, 30, 1, 59, 1, 1, 1, 12, 1, 9, 1, 41, 3, 58, 
      3, 5, 17, 11, 2, 30, 2, 56, 1, 1, 1, 1, 2, 1, 3, 1, 5, 11, 11, 2, 30, 2, 58, 1, 2, 5, 7, 11, 10, 2, 30, 2, 70, 6, 2, 6, 7, 19, 2, 60, 11, 5, 5, 1, 1, 8, 97, 13, 3, 5, 3, 6, 74, 2, 27, 1, 1, 1, 1, 1, 4, 2, 49, 14, 1, 5, 1, 2, 8, 45, 9, 1, 100, 2, 4, 1, 6, 1, 2, 2, 2, 23, 2, 2, 4, 3, 1, 3, 2, 7, 3, 4, 13, 1, 2, 2, 6, 1, 1, 1, 112, 96, 72, 82, 357, 1, 946, 3, 29, 3, 29, 2, 30, 2, 64, 2, 1, 7, 8, 1, 2, 11, 9, 1, 45, 3, 155, 1, 118, 3, 4, 2, 9, 1, 6, 3, 116, 17, 7, 2, 77, 2, 3, 228, 4, 1, 47, 1, 
      1, 5, 1, 1, 5, 1, 2, 38, 9, 12, 2, 1, 30, 1, 4, 2, 2, 1, 121, 8, 8, 2, 2, 392, 64, 523, 1, 2, 2, 24, 7, 49, 16, 96, 33, 3311, 32, 554, 6, 105, 2, 30164, 4, 9, 2, 388, 1, 3, 1, 4, 1, 23, 2, 2, 1, 88, 2, 50, 16, 1, 97, 8, 25, 11, 2, 213, 6, 2, 2, 2, 2, 12, 1, 8, 1, 1, 434, 11172, 1116, 1024, 6942, 1, 737, 16, 16, 7, 216, 1, 158, 2, 89, 3, 513, 1, 2051, 15, 40, 8, 50981, 1, 1, 3, 3, 1, 5, 8, 8, 2, 7, 30, 4, 148, 3, 798140, 255], [1, 11, 1, 10, 1, 0, 1, 0, 1, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 
      0, 2, 0, 1, 0, 2, 0, 2, 0, 2, 0, 2, 1, 2, 0, 2, 0, 2, 0, 1, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 4, 0, 2, 0, 4, 2, 4, 2, 0, 2, 0, 2, 0, 2, 4, 0, 2, 0, 2, 4, 2, 4, 2, 0, 2, 0, 2, 0, 2, 4, 0, 2, 4, 2, 0, 2, 0, 2, 4, 0, 2, 0, 4, 2, 4, 2, 0, 2, 0, 2, 4, 0, 2, 0, 2, 4, 2, 4, 2, 0, 2, 0, 2, 0, 2, 4, 2, 4, 2, 0, 2, 0, 4, 0, 2, 4, 2, 0, 2, 0, 4, 0, 2, 0, 4, 2, 4, 2, 4, 2, 4, 2, 0, 2, 0, 4, 0, 2, 4, 2, 4, 2, 0, 2, 0, 4, 0, 2, 4, 2, 4, 2, 4, 0, 2, 0, 3, 2, 0, 2, 0, 2, 0, 3, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 
      4, 0, 2, 4, 2, 0, 2, 0, 2, 0, 2, 0, 4, 2, 4, 2, 4, 2, 4, 2, 0, 4, 2, 0, 2, 0, 4, 0, 4, 0, 2, 0, 2, 4, 2, 4, 2, 0, 4, 0, 5, 6, 7, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 1, 4, 2, 4, 2, 4, 2, 0, 2, 0, 2, 0, 2, 0, 2, 4, 2, 4, 2, 4, 2, 0, 4, 0, 4, 0, 2, 4, 0, 2, 4, 0, 2, 4, 2, 4, 2, 4, 2, 4, 0, 2, 0, 2, 4, 0, 4, 2, 4, 2, 4, 0, 4, 2, 4, 2, 0, 2, 0, 1, 2, 1, 0, 1, 0, 1, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 4, 2, 4, 0, 4, 0, 4, 2, 0, 2, 0, 2, 4, 0, 2, 4, 2, 4, 2, 0, 2, 0, 2, 4, 0, 9, 
      0, 2, 0, 2, 0, 2, 0, 2, 0, 1, 0, 2, 0, 1, 0, 2, 0, 2, 0, 2, 0, 2, 4, 2, 0, 4, 2, 1, 2, 0, 2, 0, 2, 0, 2, 0, 1, 2], true)
    }
    return goog.i18n.GraphemeBreak.inversions_.at(acode)
  }
};
goog.i18n.GraphemeBreak.hasGraphemeBreak = function(a, b, opt_extended) {
  var prop_a = goog.i18n.GraphemeBreak.getBreakProp_(a);
  var prop_b = goog.i18n.GraphemeBreak.getBreakProp_(b);
  var prop = goog.i18n.GraphemeBreak.property;
  return goog.i18n.GraphemeBreak.applyLegacyBreakRules_(prop_a, prop_b) && !(opt_extended && (prop_a == prop.PREPEND || prop_b == prop.SPACING_MARK))
};
goog.provide("goog.format");
goog.require("goog.i18n.GraphemeBreak");
goog.require("goog.string");
goog.require("goog.userAgent");
goog.format.fileSize = function(bytes, opt_decimals) {
  return goog.format.numBytesToString(bytes, opt_decimals, false)
};
goog.format.isConvertableScaledNumber = function(val) {
  return goog.format.SCALED_NUMERIC_RE_.test(val)
};
goog.format.stringToNumericValue = function(stringValue) {
  if(goog.string.endsWith(stringValue, "B")) {
    return goog.format.stringToNumericValue_(stringValue, goog.format.NUMERIC_SCALES_BINARY_)
  }
  return goog.format.stringToNumericValue_(stringValue, goog.format.NUMERIC_SCALES_SI_)
};
goog.format.stringToNumBytes = function(stringValue) {
  return goog.format.stringToNumericValue_(stringValue, goog.format.NUMERIC_SCALES_BINARY_)
};
goog.format.numericValueToString = function(val, opt_decimals) {
  return goog.format.numericValueToString_(val, goog.format.NUMERIC_SCALES_SI_, opt_decimals)
};
goog.format.numBytesToString = function(val, opt_decimals, opt_suffix) {
  var suffix = "";
  if(!goog.isDef(opt_suffix) || opt_suffix) {
    suffix = "B"
  }
  return goog.format.numericValueToString_(val, goog.format.NUMERIC_SCALES_BINARY_, opt_decimals, suffix)
};
goog.format.stringToNumericValue_ = function(stringValue, conversion) {
  var match = stringValue.match(goog.format.SCALED_NUMERIC_RE_);
  if(!match) {
    return NaN
  }
  var val = match[1] * conversion[match[2]];
  return val
};
goog.format.numericValueToString_ = function(val, conversion, opt_decimals, opt_suffix) {
  var prefixes = goog.format.NUMERIC_SCALE_PREFIXES_;
  var orig_val = val;
  var symbol = "";
  var scale = 1;
  if(val < 0) {
    val = -val
  }
  for(var i = 0;i < prefixes.length;i++) {
    var unit = prefixes[i];
    scale = conversion[unit];
    if(val >= scale || scale <= 1 && val > 0.1 * scale) {
      symbol = unit;
      break
    }
  }
  if(!symbol) {
    scale = 1
  }else {
    if(opt_suffix) {
      symbol += opt_suffix
    }
  }
  var ex = Math.pow(10, goog.isDef(opt_decimals) ? opt_decimals : 2);
  return Math.round(orig_val / scale * ex) / ex + symbol
};
goog.format.SCALED_NUMERIC_RE_ = /^([-]?\d+\.?\d*)([K,M,G,T,P,k,m,u,n]?)[B]?$/;
goog.format.NUMERIC_SCALE_PREFIXES_ = ["P", "T", "G", "M", "K", "", "m", "u", "n"];
goog.format.NUMERIC_SCALES_SI_ = {"":1, "n":1E-9, "u":1E-6, "m":0.001, "k":1E3, "K":1E3, "M":1E6, "G":1E9, "T":1E12, "P":1E15};
goog.format.NUMERIC_SCALES_BINARY_ = {"":1, "n":Math.pow(1024, -3), "u":Math.pow(1024, -2), "m":1 / 1024, "k":1024, "K":1024, "M":Math.pow(1024, 2), "G":Math.pow(1024, 3), "T":Math.pow(1024, 4), "P":Math.pow(1024, 5)};
goog.format.FIRST_GRAPHEME_EXTEND_ = 768;
goog.format.isTreatedAsBreakingSpace_ = function(charCode) {
  return charCode <= goog.format.WbrToken_.SPACE || charCode >= 4096 && (charCode >= 8192 && charCode <= 8198 || charCode >= 8200 && charCode <= 8203 || charCode == 5760 || charCode == 6158 || charCode == 8232 || charCode == 8233 || charCode == 8287 || charCode == 12288)
};
goog.format.isInvisibleFormattingCharacter_ = function(charCode) {
  return charCode >= 8204 && charCode <= 8207 || charCode >= 8234 && charCode <= 8238
};
goog.format.insertWordBreaksGeneric_ = function(str, hasGraphemeBreak, opt_maxlen) {
  var maxlen = opt_maxlen || 10;
  if(maxlen > str.length) {
    return str
  }
  var rv = [];
  var n = 0;
  var nestingCharCode = 0;
  var lastDumpPosition = 0;
  var charCode = 0;
  for(var i = 0;i < str.length;i++) {
    var lastCharCode = charCode;
    charCode = str.charCodeAt(i);
    var isPotentiallyGraphemeExtending = charCode >= goog.format.FIRST_GRAPHEME_EXTEND_ && !hasGraphemeBreak(lastCharCode, charCode, true);
    if(n >= maxlen && !goog.format.isTreatedAsBreakingSpace_(charCode) && !isPotentiallyGraphemeExtending) {
      rv.push(str.substring(lastDumpPosition, i), goog.format.WORD_BREAK_HTML);
      lastDumpPosition = i;
      n = 0
    }
    if(!nestingCharCode) {
      if(charCode == goog.format.WbrToken_.LT || charCode == goog.format.WbrToken_.AMP) {
        nestingCharCode = charCode
      }else {
        if(goog.format.isTreatedAsBreakingSpace_(charCode)) {
          n = 0
        }else {
          if(!goog.format.isInvisibleFormattingCharacter_(charCode)) {
            n++
          }
        }
      }
    }else {
      if(charCode == goog.format.WbrToken_.GT && nestingCharCode == goog.format.WbrToken_.LT) {
        nestingCharCode = 0
      }else {
        if(charCode == goog.format.WbrToken_.SEMI_COLON && nestingCharCode == goog.format.WbrToken_.AMP) {
          nestingCharCode = 0;
          n++
        }
      }
    }
  }
  rv.push(str.substr(lastDumpPosition));
  return rv.join("")
};
goog.format.insertWordBreaks = function(str, opt_maxlen) {
  return goog.format.insertWordBreaksGeneric_(str, goog.i18n.GraphemeBreak.hasGraphemeBreak, opt_maxlen)
};
goog.format.conservativelyHasGraphemeBreak_ = function(lastCharCode, charCode, opt_extended) {
  return charCode >= 1024 && charCode < 1315
};
goog.format.insertWordBreaksBasic = function(str, opt_maxlen) {
  return goog.format.insertWordBreaksGeneric_(str, goog.format.conservativelyHasGraphemeBreak_, opt_maxlen)
};
goog.format.IS_IE8_OR_ABOVE_ = goog.userAgent.IE && goog.userAgent.isVersion(8);
goog.format.WORD_BREAK_HTML = goog.userAgent.WEBKIT ? "<wbr></wbr>" : goog.userAgent.OPERA ? "&shy;" : goog.format.IS_IE8_OR_ABOVE_ ? "&#8203;" : "<wbr>";
goog.format.WbrToken_ = {LT:60, GT:62, AMP:38, SEMI_COLON:59, SPACE:32};
goog.provide("goog.i18n.bidi");
goog.i18n.bidi.FORCE_RTL = false;
goog.i18n.bidi.IS_RTL = goog.i18n.bidi.FORCE_RTL || (goog.LOCALE.substring(0, 2).toLowerCase() == "ar" || goog.LOCALE.substring(0, 2).toLowerCase() == "fa" || goog.LOCALE.substring(0, 2).toLowerCase() == "he" || goog.LOCALE.substring(0, 2).toLowerCase() == "iw" || goog.LOCALE.substring(0, 2).toLowerCase() == "ur" || goog.LOCALE.substring(0, 2).toLowerCase() == "yi") && (goog.LOCALE.length == 2 || goog.LOCALE.substring(2, 3) == "-" || goog.LOCALE.substring(2, 3) == "_");
goog.i18n.bidi.Format = {LRE:"\u202a", RLE:"\u202b", PDF:"\u202c", LRM:"\u200e", RLM:"\u200f"};
goog.i18n.bidi.Dir = {RTL:-1, UNKNOWN:0, LTR:1};
goog.i18n.bidi.RIGHT = "right";
goog.i18n.bidi.LEFT = "left";
goog.i18n.bidi.I18N_RIGHT = goog.i18n.bidi.IS_RTL ? goog.i18n.bidi.LEFT : goog.i18n.bidi.RIGHT;
goog.i18n.bidi.I18N_LEFT = goog.i18n.bidi.IS_RTL ? goog.i18n.bidi.RIGHT : goog.i18n.bidi.LEFT;
goog.i18n.bidi.toDir = function(givenDir) {
  if(typeof givenDir == "number") {
    return givenDir > 0 ? goog.i18n.bidi.Dir.LTR : givenDir < 0 ? goog.i18n.bidi.Dir.RTL : goog.i18n.bidi.Dir.UNKNOWN
  }else {
    return givenDir ? goog.i18n.bidi.Dir.RTL : goog.i18n.bidi.Dir.LTR
  }
};
goog.i18n.bidi.ltrChars_ = "A-Za-z\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u02b8\u0300-\u0590\u0800-\u1fff" + "\u2c00-\ufb1c\ufe00-\ufe6f\ufefd-\uffff";
goog.i18n.bidi.rtlChars_ = "\u0591-\u07ff\ufb1d-\ufdff\ufe70-\ufefc";
goog.i18n.bidi.htmlSkipReg_ = /<[^>]*>|&[^;]+;/g;
goog.i18n.bidi.stripHtmlIfNeeded_ = function(str, opt_isStripNeeded) {
  return opt_isStripNeeded ? str.replace(goog.i18n.bidi.htmlSkipReg_, " ") : str
};
goog.i18n.bidi.rtlCharReg_ = new RegExp("[" + goog.i18n.bidi.rtlChars_ + "]");
goog.i18n.bidi.ltrCharReg_ = new RegExp("[" + goog.i18n.bidi.ltrChars_ + "]");
goog.i18n.bidi.hasAnyRtl = function(str, opt_isHtml) {
  return goog.i18n.bidi.rtlCharReg_.test(goog.i18n.bidi.stripHtmlIfNeeded_(str, opt_isHtml))
};
goog.i18n.bidi.hasRtlChar = goog.i18n.bidi.hasAnyRtl;
goog.i18n.bidi.hasAnyLtr = function(str, opt_isHtml) {
  return goog.i18n.bidi.ltrCharReg_.test(goog.i18n.bidi.stripHtmlIfNeeded_(str, opt_isHtml))
};
goog.i18n.bidi.ltrRe_ = new RegExp("^[" + goog.i18n.bidi.ltrChars_ + "]");
goog.i18n.bidi.rtlRe_ = new RegExp("^[" + goog.i18n.bidi.rtlChars_ + "]");
goog.i18n.bidi.isRtlChar = function(str) {
  return goog.i18n.bidi.rtlRe_.test(str)
};
goog.i18n.bidi.isLtrChar = function(str) {
  return goog.i18n.bidi.ltrRe_.test(str)
};
goog.i18n.bidi.isNeutralChar = function(str) {
  return!goog.i18n.bidi.isLtrChar(str) && !goog.i18n.bidi.isRtlChar(str)
};
goog.i18n.bidi.ltrDirCheckRe_ = new RegExp("^[^" + goog.i18n.bidi.rtlChars_ + "]*[" + goog.i18n.bidi.ltrChars_ + "]");
goog.i18n.bidi.rtlDirCheckRe_ = new RegExp("^[^" + goog.i18n.bidi.ltrChars_ + "]*[" + goog.i18n.bidi.rtlChars_ + "]");
goog.i18n.bidi.startsWithRtl = function(str, opt_isHtml) {
  return goog.i18n.bidi.rtlDirCheckRe_.test(goog.i18n.bidi.stripHtmlIfNeeded_(str, opt_isHtml))
};
goog.i18n.bidi.isRtlText = goog.i18n.bidi.startsWithRtl;
goog.i18n.bidi.startsWithLtr = function(str, opt_isHtml) {
  return goog.i18n.bidi.ltrDirCheckRe_.test(goog.i18n.bidi.stripHtmlIfNeeded_(str, opt_isHtml))
};
goog.i18n.bidi.isLtrText = goog.i18n.bidi.startsWithLtr;
goog.i18n.bidi.isRequiredLtrRe_ = /^http:\/\/.*/;
goog.i18n.bidi.isNeutralText = function(str, opt_isHtml) {
  str = goog.i18n.bidi.stripHtmlIfNeeded_(str, opt_isHtml);
  return goog.i18n.bidi.isRequiredLtrRe_.test(str) || !goog.i18n.bidi.hasAnyLtr(str) && !goog.i18n.bidi.hasAnyRtl(str)
};
goog.i18n.bidi.ltrExitDirCheckRe_ = new RegExp("[" + goog.i18n.bidi.ltrChars_ + "][^" + goog.i18n.bidi.rtlChars_ + "]*$");
goog.i18n.bidi.rtlExitDirCheckRe_ = new RegExp("[" + goog.i18n.bidi.rtlChars_ + "][^" + goog.i18n.bidi.ltrChars_ + "]*$");
goog.i18n.bidi.endsWithLtr = function(str, opt_isHtml) {
  return goog.i18n.bidi.ltrExitDirCheckRe_.test(goog.i18n.bidi.stripHtmlIfNeeded_(str, opt_isHtml))
};
goog.i18n.bidi.isLtrExitText = goog.i18n.bidi.endsWithLtr;
goog.i18n.bidi.endsWithRtl = function(str, opt_isHtml) {
  return goog.i18n.bidi.rtlExitDirCheckRe_.test(goog.i18n.bidi.stripHtmlIfNeeded_(str, opt_isHtml))
};
goog.i18n.bidi.isRtlExitText = goog.i18n.bidi.endsWithRtl;
goog.i18n.bidi.rtlLocalesRe_ = new RegExp("^(ar|dv|he|iw|fa|nqo|ps|sd|ug|ur|yi|.*[-_](Arab|Hebr|Thaa|Nkoo|Tfng))" + "(?!.*[-_](Latn|Cyrl)($|-|_))($|-|_)", "i");
goog.i18n.bidi.isRtlLanguage = function(lang) {
  return goog.i18n.bidi.rtlLocalesRe_.test(lang)
};
goog.i18n.bidi.bracketGuardHtmlRe_ = /(\(.*?\)+)|(\[.*?\]+)|(\{.*?\}+)|(&lt;.*?(&gt;)+)/g;
goog.i18n.bidi.bracketGuardTextRe_ = /(\(.*?\)+)|(\[.*?\]+)|(\{.*?\}+)|(<.*?>+)/g;
goog.i18n.bidi.guardBracketInHtml = function(s, opt_isRtlContext) {
  var useRtl = opt_isRtlContext === undefined ? goog.i18n.bidi.hasAnyRtl(s) : opt_isRtlContext;
  if(useRtl) {
    return s.replace(goog.i18n.bidi.bracketGuardHtmlRe_, "<span dir=rtl>$&</span>")
  }
  return s.replace(goog.i18n.bidi.bracketGuardHtmlRe_, "<span dir=ltr>$&</span>")
};
goog.i18n.bidi.guardBracketInText = function(s, opt_isRtlContext) {
  var useRtl = opt_isRtlContext === undefined ? goog.i18n.bidi.hasAnyRtl(s) : opt_isRtlContext;
  var mark = useRtl ? goog.i18n.bidi.Format.RLM : goog.i18n.bidi.Format.LRM;
  return s.replace(goog.i18n.bidi.bracketGuardTextRe_, mark + "$&" + mark)
};
goog.i18n.bidi.enforceRtlInHtml = function(html) {
  if(html.charAt(0) == "<") {
    return html.replace(/<\w+/, "$& dir=rtl")
  }
  return"\n<span dir=rtl>" + html + "</span>"
};
goog.i18n.bidi.enforceRtlInText = function(text) {
  return goog.i18n.bidi.Format.RLE + text + goog.i18n.bidi.Format.PDF
};
goog.i18n.bidi.enforceLtrInHtml = function(html) {
  if(html.charAt(0) == "<") {
    return html.replace(/<\w+/, "$& dir=ltr")
  }
  return"\n<span dir=ltr>" + html + "</span>"
};
goog.i18n.bidi.enforceLtrInText = function(text) {
  return goog.i18n.bidi.Format.LRE + text + goog.i18n.bidi.Format.PDF
};
goog.i18n.bidi.dimensionsRe_ = /:\s*([.\d][.\w]*)\s+([.\d][.\w]*)\s+([.\d][.\w]*)\s+([.\d][.\w]*)/g;
goog.i18n.bidi.leftRe_ = /left/gi;
goog.i18n.bidi.rightRe_ = /right/gi;
goog.i18n.bidi.tempRe_ = /%%%%/g;
goog.i18n.bidi.mirrorCSS = function(cssStr) {
  return cssStr.replace(goog.i18n.bidi.dimensionsRe_, ":$1 $4 $3 $2").replace(goog.i18n.bidi.leftRe_, "%%%%").replace(goog.i18n.bidi.rightRe_, goog.i18n.bidi.LEFT).replace(goog.i18n.bidi.tempRe_, goog.i18n.bidi.RIGHT)
};
goog.i18n.bidi.doubleQuoteSubstituteRe_ = /([\u0591-\u05f2])"/g;
goog.i18n.bidi.singleQuoteSubstituteRe_ = /([\u0591-\u05f2])'/g;
goog.i18n.bidi.normalizeHebrewQuote = function(str) {
  return str.replace(goog.i18n.bidi.doubleQuoteSubstituteRe_, "$1\u05f4").replace(goog.i18n.bidi.singleQuoteSubstituteRe_, "$1\u05f3")
};
goog.i18n.bidi.wordSeparatorRe_ = /\s+/;
goog.i18n.bidi.hasNumeralsRe_ = /\d/;
goog.i18n.bidi.rtlDetectionThreshold_ = 0.4;
goog.i18n.bidi.estimateDirection = function(str, opt_isHtml) {
  var rtlCount = 0;
  var totalCount = 0;
  var hasWeaklyLtr = false;
  var tokens = goog.i18n.bidi.stripHtmlIfNeeded_(str, opt_isHtml).split(goog.i18n.bidi.wordSeparatorRe_);
  for(var i = 0;i < tokens.length;i++) {
    var token = tokens[i];
    if(goog.i18n.bidi.startsWithRtl(token)) {
      rtlCount++;
      totalCount++
    }else {
      if(goog.i18n.bidi.isRequiredLtrRe_.test(token)) {
        hasWeaklyLtr = true
      }else {
        if(goog.i18n.bidi.hasAnyLtr(token)) {
          totalCount++
        }else {
          if(goog.i18n.bidi.hasNumeralsRe_.test(token)) {
            hasWeaklyLtr = true
          }
        }
      }
    }
  }
  return totalCount == 0 ? hasWeaklyLtr ? goog.i18n.bidi.Dir.LTR : goog.i18n.bidi.Dir.UNKNOWN : rtlCount / totalCount > goog.i18n.bidi.rtlDetectionThreshold_ ? goog.i18n.bidi.Dir.RTL : goog.i18n.bidi.Dir.LTR
};
goog.i18n.bidi.detectRtlDirectionality = function(str, opt_isHtml) {
  return goog.i18n.bidi.estimateDirection(str, opt_isHtml) == goog.i18n.bidi.Dir.RTL
};
goog.i18n.bidi.setElementDirAndAlign = function(element, dir) {
  if(element && (dir = goog.i18n.bidi.toDir(dir)) != goog.i18n.bidi.Dir.UNKNOWN) {
    element.style.textAlign = dir == goog.i18n.bidi.Dir.RTL ? "right" : "left";
    element.dir = dir == goog.i18n.bidi.Dir.RTL ? "rtl" : "ltr"
  }
};
goog.provide("goog.i18n.BidiFormatter");
goog.require("goog.i18n.bidi");
goog.require("goog.string");
goog.i18n.BidiFormatter = function(contextDir, opt_alwaysSpan) {
  this.contextDir_ = goog.i18n.bidi.toDir(contextDir);
  this.alwaysSpan_ = !!opt_alwaysSpan
};
goog.i18n.BidiFormatter.prototype.getContextDir = function() {
  return this.contextDir_
};
goog.i18n.BidiFormatter.prototype.getAlwaysSpan = function() {
  return this.alwaysSpan_
};
goog.i18n.BidiFormatter.prototype.setContextDir = function(contextDir) {
  this.contextDir_ = goog.i18n.bidi.toDir(contextDir)
};
goog.i18n.BidiFormatter.prototype.setAlwaysSpan = function(alwaysSpan) {
  this.alwaysSpan_ = alwaysSpan
};
goog.i18n.BidiFormatter.prototype.estimateDirection = goog.i18n.bidi.estimateDirection;
goog.i18n.BidiFormatter.prototype.areDirectionalitiesOpposite_ = function(dir1, dir2) {
  return dir1 * dir2 < 0
};
goog.i18n.BidiFormatter.prototype.dirResetIfNeeded_ = function(str, dir, opt_isHtml, opt_dirReset) {
  if(opt_dirReset && (this.areDirectionalitiesOpposite_(dir, this.contextDir_) || this.contextDir_ == goog.i18n.bidi.Dir.LTR && goog.i18n.bidi.endsWithRtl(str, opt_isHtml) || this.contextDir_ == goog.i18n.bidi.Dir.RTL && goog.i18n.bidi.endsWithLtr(str, opt_isHtml))) {
    return this.contextDir_ == goog.i18n.bidi.Dir.LTR ? goog.i18n.bidi.Format.LRM : goog.i18n.bidi.Format.RLM
  }else {
    return""
  }
};
goog.i18n.BidiFormatter.prototype.dirAttrValue = function(str, opt_isHtml) {
  return this.knownDirAttrValue(this.estimateDirection(str, opt_isHtml))
};
goog.i18n.BidiFormatter.prototype.knownDirAttrValue = function(dir) {
  if(dir == goog.i18n.bidi.Dir.UNKNOWN) {
    dir = this.contextDir_
  }
  return dir == goog.i18n.bidi.Dir.RTL ? "rtl" : "ltr"
};
goog.i18n.BidiFormatter.prototype.dirAttr = function(str, opt_isHtml) {
  return this.knownDirAttr(this.estimateDirection(str, opt_isHtml))
};
goog.i18n.BidiFormatter.prototype.knownDirAttr = function(dir) {
  if(dir != this.contextDir_) {
    return dir == goog.i18n.bidi.Dir.RTL ? 'dir="rtl"' : dir == goog.i18n.bidi.Dir.LTR ? 'dir="ltr"' : ""
  }
  return""
};
goog.i18n.BidiFormatter.prototype.spanWrap = function(str, opt_isHtml, opt_dirReset) {
  var dir = this.estimateDirection(str, opt_isHtml);
  return this.spanWrapWithKnownDir(dir, str, opt_isHtml, opt_dirReset)
};
goog.i18n.BidiFormatter.prototype.spanWrapWithKnownDir = function(dir, str, opt_isHtml, opt_dirReset) {
  opt_dirReset = opt_dirReset || opt_dirReset == undefined;
  var dirCondition = dir != goog.i18n.bidi.Dir.UNKNOWN && dir != this.contextDir_;
  if(!opt_isHtml) {
    str = goog.string.htmlEscape(str)
  }
  var result = [];
  if(this.alwaysSpan_ || dirCondition) {
    result.push("<span");
    if(dirCondition) {
      result.push(dir == goog.i18n.bidi.Dir.RTL ? ' dir="rtl"' : ' dir="ltr"')
    }
    result.push(">" + str + "</span>")
  }else {
    result.push(str)
  }
  result.push(this.dirResetIfNeeded_(str, dir, true, opt_dirReset));
  return result.join("")
};
goog.i18n.BidiFormatter.prototype.unicodeWrap = function(str, opt_isHtml, opt_dirReset) {
  var dir = this.estimateDirection(str, opt_isHtml);
  return this.unicodeWrapWithKnownDir(dir, str, opt_isHtml, opt_dirReset)
};
goog.i18n.BidiFormatter.prototype.unicodeWrapWithKnownDir = function(dir, str, opt_isHtml, opt_dirReset) {
  opt_dirReset = opt_dirReset || opt_dirReset == undefined;
  var result = [];
  if(dir != goog.i18n.bidi.Dir.UNKNOWN && dir != this.contextDir_) {
    result.push(dir == goog.i18n.bidi.Dir.RTL ? goog.i18n.bidi.Format.RLE : goog.i18n.bidi.Format.LRE);
    result.push(str);
    result.push(goog.i18n.bidi.Format.PDF)
  }else {
    result.push(str)
  }
  result.push(this.dirResetIfNeeded_(str, dir, opt_isHtml, opt_dirReset));
  return result.join("")
};
goog.i18n.BidiFormatter.prototype.markAfter = function(str, opt_isHtml) {
  return this.dirResetIfNeeded_(str, this.estimateDirection(str, opt_isHtml), opt_isHtml, true)
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
goog.provide("soy");
goog.provide("soy.StringBuilder");
goog.provide("soy.esc");
goog.provide("soydata");
goog.provide("soydata.SanitizedHtml");
goog.provide("soydata.SanitizedHtmlAttribute");
goog.provide("soydata.SanitizedJsStrChars");
goog.provide("soydata.SanitizedUri");
goog.require("goog.asserts");
goog.require("goog.dom.DomHelper");
goog.require("goog.format");
goog.require("goog.i18n.BidiFormatter");
goog.require("goog.i18n.bidi");
goog.require("goog.soy");
goog.require("goog.string");
goog.require("goog.string.StringBuffer");
soy.StringBuilder = goog.string.StringBuffer;
soydata.SanitizedContentKind = {HTML:0, JS_STR_CHARS:1, URI:2, HTML_ATTRIBUTE:3};
soydata.SanitizedContent = function(content) {
  this.content = content
};
soydata.SanitizedContent.prototype.contentKind;
soydata.SanitizedContent.prototype.toString = function() {
  return this.content
};
soydata.SanitizedHtml = function(content) {
  soydata.SanitizedContent.call(this, content)
};
goog.inherits(soydata.SanitizedHtml, soydata.SanitizedContent);
soydata.SanitizedHtml.prototype.contentKind = soydata.SanitizedContentKind.HTML;
soydata.SanitizedJsStrChars = function(content) {
  soydata.SanitizedContent.call(this, content)
};
goog.inherits(soydata.SanitizedJsStrChars, soydata.SanitizedContent);
soydata.SanitizedJsStrChars.prototype.contentKind = soydata.SanitizedContentKind.JS_STR_CHARS;
soydata.SanitizedUri = function(content) {
  soydata.SanitizedContent.call(this, content)
};
goog.inherits(soydata.SanitizedUri, soydata.SanitizedContent);
soydata.SanitizedUri.prototype.contentKind = soydata.SanitizedContentKind.URI;
soydata.SanitizedHtmlAttribute = function(content) {
  soydata.SanitizedContent.call(this, content)
};
goog.inherits(soydata.SanitizedHtmlAttribute, soydata.SanitizedContent);
soydata.SanitizedHtmlAttribute.prototype.contentKind = soydata.SanitizedContentKind.HTML_ATTRIBUTE;
soy.renderElement = goog.soy.renderElement;
soy.renderAsFragment = function(template, opt_templateData, opt_document, opt_injectedData) {
  return goog.soy.renderAsFragment(template, opt_templateData, opt_injectedData, new goog.dom.DomHelper(opt_document))
};
soy.renderAsElement = function(template, opt_templateData, opt_document, opt_injectedData) {
  return goog.soy.renderAsElement(template, opt_templateData, opt_injectedData, new goog.dom.DomHelper(opt_document))
};
soy.$$augmentData = function(origData, additionalParams) {
  function TempCtor() {
  }
  TempCtor.prototype = origData;
  var newData = new TempCtor;
  for(var key in additionalParams) {
    newData[key] = additionalParams[key]
  }
  return newData
};
soy.$$getMapKeys = function(map) {
  var mapKeys = [];
  for(var key in map) {
    mapKeys.push(key)
  }
  return mapKeys
};
soy.$$getDelegateId = function(delTemplateName) {
  return delTemplateName
};
soy.$$DELEGATE_REGISTRY_PRIORITIES_ = {};
soy.$$DELEGATE_REGISTRY_FUNCTIONS_ = {};
soy.$$registerDelegateFn = function(delTemplateId, delPriority, delFn) {
  var mapKey = "key_" + delTemplateId;
  var currPriority = soy.$$DELEGATE_REGISTRY_PRIORITIES_[mapKey];
  if(currPriority === undefined || delPriority > currPriority) {
    soy.$$DELEGATE_REGISTRY_PRIORITIES_[mapKey] = delPriority;
    soy.$$DELEGATE_REGISTRY_FUNCTIONS_[mapKey] = delFn
  }else {
    if(delPriority == currPriority) {
      throw Error('Encountered two active delegates with same priority (id/name "' + delTemplateId + '").');
    }else {
    }
  }
};
soy.$$getDelegateFn = function(delTemplateId) {
  var delFn = soy.$$DELEGATE_REGISTRY_FUNCTIONS_["key_" + delTemplateId];
  return delFn ? delFn : soy.$$EMPTY_TEMPLATE_FN_
};
soy.$$EMPTY_TEMPLATE_FN_ = function(opt_data, opt_sb, opt_ijData) {
  return""
};
soy.$$escapeHtml = function(value) {
  if(typeof value === "object" && value && value.contentKind === soydata.SanitizedContentKind.HTML) {
    return value.content
  }
  return soy.esc.$$escapeHtmlHelper(value)
};
soy.$$escapeHtmlRcdata = function(value) {
  if(typeof value === "object" && value && value.contentKind === soydata.SanitizedContentKind.HTML) {
    return soy.esc.$$normalizeHtmlHelper(value.content)
  }
  return soy.esc.$$escapeHtmlHelper(value)
};
soy.$$stripHtmlTags = function(value) {
  return String(value).replace(soy.esc.$$HTML_TAG_REGEX_, "")
};
soy.$$escapeHtmlAttribute = function(value) {
  if(typeof value === "object" && value && value.contentKind === soydata.SanitizedContentKind.HTML) {
    return soy.esc.$$normalizeHtmlHelper(soy.$$stripHtmlTags(value.content))
  }
  return soy.esc.$$escapeHtmlHelper(value)
};
soy.$$escapeHtmlAttributeNospace = function(value) {
  if(typeof value === "object" && value && value.contentKind === soydata.SanitizedContentKind.HTML) {
    return soy.esc.$$normalizeHtmlNospaceHelper(soy.$$stripHtmlTags(value.content))
  }
  return soy.esc.$$escapeHtmlNospaceHelper(value)
};
soy.$$filterHtmlAttribute = function(value) {
  if(typeof value === "object" && value && value.contentKind === soydata.SanitizedContentKind.HTML_ATTRIBUTE) {
    return value.content.replace(/=([^"']*)$/, '="$1"')
  }
  return soy.esc.$$filterHtmlAttributeHelper(value)
};
soy.$$filterHtmlElementName = function(value) {
  return soy.esc.$$filterHtmlElementNameHelper(value)
};
soy.$$escapeJs = function(value) {
  return soy.$$escapeJsString(value)
};
soy.$$escapeJsString = function(value) {
  if(typeof value === "object" && value.contentKind === soydata.SanitizedContentKind.JS_STR_CHARS) {
    return value.content
  }
  return soy.esc.$$escapeJsStringHelper(value)
};
soy.$$escapeJsValue = function(value) {
  if(value == null) {
    return" null "
  }
  switch(typeof value) {
    case "boolean":
    ;
    case "number":
      return" " + value + " ";
    default:
      return"'" + soy.esc.$$escapeJsStringHelper(String(value)) + "'"
  }
};
soy.$$escapeJsRegex = function(value) {
  return soy.esc.$$escapeJsRegexHelper(value)
};
soy.$$problematicUriMarks_ = /['()]/g;
soy.$$pctEncode_ = function(ch) {
  return"%" + ch.charCodeAt(0).toString(16)
};
soy.$$escapeUri = function(value) {
  if(typeof value === "object" && value.contentKind === soydata.SanitizedContentKind.URI) {
    return soy.$$normalizeUri(value)
  }
  var encoded = soy.esc.$$escapeUriHelper(value);
  soy.$$problematicUriMarks_.lastIndex = 0;
  if(soy.$$problematicUriMarks_.test(encoded)) {
    return encoded.replace(soy.$$problematicUriMarks_, soy.$$pctEncode_)
  }
  return encoded
};
soy.$$normalizeUri = function(value) {
  return soy.esc.$$normalizeUriHelper(value)
};
soy.$$filterNormalizeUri = function(value) {
  return soy.esc.$$filterNormalizeUriHelper(value)
};
soy.$$escapeCssString = function(value) {
  return soy.esc.$$escapeCssStringHelper(value)
};
soy.$$filterCssValue = function(value) {
  if(value == null) {
    return""
  }
  return soy.esc.$$filterCssValueHelper(value)
};
soy.$$changeNewlineToBr = function(str) {
  return goog.string.newLineToBr(String(str), false)
};
soy.$$insertWordBreaks = function(str, maxCharsBetweenWordBreaks) {
  return goog.format.insertWordBreaks(String(str), maxCharsBetweenWordBreaks)
};
soy.$$truncate = function(str, maxLen, doAddEllipsis) {
  str = String(str);
  if(str.length <= maxLen) {
    return str
  }
  if(doAddEllipsis) {
    if(maxLen > 3) {
      maxLen -= 3
    }else {
      doAddEllipsis = false
    }
  }
  if(soy.$$isHighSurrogate_(str.charAt(maxLen - 1)) && soy.$$isLowSurrogate_(str.charAt(maxLen))) {
    maxLen -= 1
  }
  str = str.substring(0, maxLen);
  if(doAddEllipsis) {
    str += "..."
  }
  return str
};
soy.$$isHighSurrogate_ = function(ch) {
  return 55296 <= ch && ch <= 56319
};
soy.$$isLowSurrogate_ = function(ch) {
  return 56320 <= ch && ch <= 57343
};
soy.$$bidiFormatterCache_ = {};
soy.$$getBidiFormatterInstance_ = function(bidiGlobalDir) {
  return soy.$$bidiFormatterCache_[bidiGlobalDir] || (soy.$$bidiFormatterCache_[bidiGlobalDir] = new goog.i18n.BidiFormatter(bidiGlobalDir))
};
soy.$$bidiTextDir = function(text, opt_isHtml) {
  if(!text) {
    return 0
  }
  return goog.i18n.bidi.detectRtlDirectionality(text, opt_isHtml) ? -1 : 1
};
soy.$$bidiDirAttr = function(bidiGlobalDir, text, opt_isHtml) {
  return new soydata.SanitizedHtmlAttribute(soy.$$getBidiFormatterInstance_(bidiGlobalDir).dirAttr(text, opt_isHtml))
};
soy.$$bidiMarkAfter = function(bidiGlobalDir, text, opt_isHtml) {
  var formatter = soy.$$getBidiFormatterInstance_(bidiGlobalDir);
  return formatter.markAfter(text, opt_isHtml)
};
soy.$$bidiSpanWrap = function(bidiGlobalDir, str) {
  var formatter = soy.$$getBidiFormatterInstance_(bidiGlobalDir);
  return formatter.spanWrap(str + "", true)
};
soy.$$bidiUnicodeWrap = function(bidiGlobalDir, str) {
  var formatter = soy.$$getBidiFormatterInstance_(bidiGlobalDir);
  return formatter.unicodeWrap(str + "", true)
};
soy.esc.$$escapeUriHelper = function(v) {
  return goog.string.urlEncode(String(v))
};
soy.esc.$$ESCAPE_MAP_FOR_ESCAPE_HTML__AND__NORMALIZE_HTML__AND__ESCAPE_HTML_NOSPACE__AND__NORMALIZE_HTML_NOSPACE_ = {"\x00":"&#0;", '"':"&quot;", "&":"&amp;", "'":"&#39;", "<":"&lt;", ">":"&gt;", "\t":"&#9;", "\n":"&#10;", "\x0B":"&#11;", "\f":"&#12;", "\r":"&#13;", " ":"&#32;", "-":"&#45;", "/":"&#47;", "=":"&#61;", "`":"&#96;", "\u0085":"&#133;", "\u00a0":"&#160;", "\u2028":"&#8232;", "\u2029":"&#8233;"};
soy.esc.$$REPLACER_FOR_ESCAPE_HTML__AND__NORMALIZE_HTML__AND__ESCAPE_HTML_NOSPACE__AND__NORMALIZE_HTML_NOSPACE_ = function(ch) {
  return soy.esc.$$ESCAPE_MAP_FOR_ESCAPE_HTML__AND__NORMALIZE_HTML__AND__ESCAPE_HTML_NOSPACE__AND__NORMALIZE_HTML_NOSPACE_[ch]
};
soy.esc.$$ESCAPE_MAP_FOR_ESCAPE_JS_STRING__AND__ESCAPE_JS_REGEX_ = {"\x00":"\\x00", "\b":"\\x08", "\t":"\\t", "\n":"\\n", "\x0B":"\\x0b", "\f":"\\f", "\r":"\\r", '"':"\\x22", "&":"\\x26", "'":"\\x27", "/":"\\/", "<":"\\x3c", "=":"\\x3d", ">":"\\x3e", "\\":"\\\\", "\u0085":"\\x85", "\u2028":"\\u2028", "\u2029":"\\u2029", "$":"\\x24", "(":"\\x28", ")":"\\x29", "*":"\\x2a", "+":"\\x2b", ",":"\\x2c", "-":"\\x2d", ".":"\\x2e", ":":"\\x3a", "?":"\\x3f", "[":"\\x5b", "]":"\\x5d", "^":"\\x5e", "{":"\\x7b", 
"|":"\\x7c", "}":"\\x7d"};
soy.esc.$$REPLACER_FOR_ESCAPE_JS_STRING__AND__ESCAPE_JS_REGEX_ = function(ch) {
  return soy.esc.$$ESCAPE_MAP_FOR_ESCAPE_JS_STRING__AND__ESCAPE_JS_REGEX_[ch]
};
soy.esc.$$ESCAPE_MAP_FOR_ESCAPE_CSS_STRING_ = {"\x00":"\\0 ", "\b":"\\8 ", "\t":"\\9 ", "\n":"\\a ", "\x0B":"\\b ", "\f":"\\c ", "\r":"\\d ", '"':"\\22 ", "&":"\\26 ", "'":"\\27 ", "(":"\\28 ", ")":"\\29 ", "*":"\\2a ", "/":"\\2f ", ":":"\\3a ", ";":"\\3b ", "<":"\\3c ", "=":"\\3d ", ">":"\\3e ", "@":"\\40 ", "\\":"\\5c ", "{":"\\7b ", "}":"\\7d ", "\u0085":"\\85 ", "\u00a0":"\\a0 ", "\u2028":"\\2028 ", "\u2029":"\\2029 "};
soy.esc.$$REPLACER_FOR_ESCAPE_CSS_STRING_ = function(ch) {
  return soy.esc.$$ESCAPE_MAP_FOR_ESCAPE_CSS_STRING_[ch]
};
soy.esc.$$ESCAPE_MAP_FOR_NORMALIZE_URI__AND__FILTER_NORMALIZE_URI_ = {"\x00":"%00", "\u0001":"%01", "\u0002":"%02", "\u0003":"%03", "\u0004":"%04", "\u0005":"%05", "\u0006":"%06", "\u0007":"%07", "\b":"%08", "\t":"%09", "\n":"%0A", "\x0B":"%0B", "\f":"%0C", "\r":"%0D", "\u000e":"%0E", "\u000f":"%0F", "\u0010":"%10", "\u0011":"%11", "\u0012":"%12", "\u0013":"%13", "\u0014":"%14", "\u0015":"%15", "\u0016":"%16", "\u0017":"%17", "\u0018":"%18", "\u0019":"%19", "\u001a":"%1A", "\u001b":"%1B", "\u001c":"%1C", 
"\u001d":"%1D", "\u001e":"%1E", "\u001f":"%1F", " ":"%20", '"':"%22", "'":"%27", "(":"%28", ")":"%29", "<":"%3C", ">":"%3E", "\\":"%5C", "{":"%7B", "}":"%7D", "\u007f":"%7F", "\u0085":"%C2%85", "\u00a0":"%C2%A0", "\u2028":"%E2%80%A8", "\u2029":"%E2%80%A9", "\uff01":"%EF%BC%81", "\uff03":"%EF%BC%83", "\uff04":"%EF%BC%84", "\uff06":"%EF%BC%86", "\uff07":"%EF%BC%87", "\uff08":"%EF%BC%88", "\uff09":"%EF%BC%89", "\uff0a":"%EF%BC%8A", "\uff0b":"%EF%BC%8B", "\uff0c":"%EF%BC%8C", "\uff0f":"%EF%BC%8F", "\uff1a":"%EF%BC%9A", 
"\uff1b":"%EF%BC%9B", "\uff1d":"%EF%BC%9D", "\uff1f":"%EF%BC%9F", "\uff20":"%EF%BC%A0", "\uff3b":"%EF%BC%BB", "\uff3d":"%EF%BC%BD"};
soy.esc.$$REPLACER_FOR_NORMALIZE_URI__AND__FILTER_NORMALIZE_URI_ = function(ch) {
  return soy.esc.$$ESCAPE_MAP_FOR_NORMALIZE_URI__AND__FILTER_NORMALIZE_URI_[ch]
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
soy.esc.$$escapeHtmlHelper = function(value) {
  var str = String(value);
  return str.replace(soy.esc.$$MATCHER_FOR_ESCAPE_HTML_, soy.esc.$$REPLACER_FOR_ESCAPE_HTML__AND__NORMALIZE_HTML__AND__ESCAPE_HTML_NOSPACE__AND__NORMALIZE_HTML_NOSPACE_)
};
soy.esc.$$normalizeHtmlHelper = function(value) {
  var str = String(value);
  return str.replace(soy.esc.$$MATCHER_FOR_NORMALIZE_HTML_, soy.esc.$$REPLACER_FOR_ESCAPE_HTML__AND__NORMALIZE_HTML__AND__ESCAPE_HTML_NOSPACE__AND__NORMALIZE_HTML_NOSPACE_)
};
soy.esc.$$escapeHtmlNospaceHelper = function(value) {
  var str = String(value);
  return str.replace(soy.esc.$$MATCHER_FOR_ESCAPE_HTML_NOSPACE_, soy.esc.$$REPLACER_FOR_ESCAPE_HTML__AND__NORMALIZE_HTML__AND__ESCAPE_HTML_NOSPACE__AND__NORMALIZE_HTML_NOSPACE_)
};
soy.esc.$$normalizeHtmlNospaceHelper = function(value) {
  var str = String(value);
  return str.replace(soy.esc.$$MATCHER_FOR_NORMALIZE_HTML_NOSPACE_, soy.esc.$$REPLACER_FOR_ESCAPE_HTML__AND__NORMALIZE_HTML__AND__ESCAPE_HTML_NOSPACE__AND__NORMALIZE_HTML_NOSPACE_)
};
soy.esc.$$escapeJsStringHelper = function(value) {
  var str = String(value);
  return str.replace(soy.esc.$$MATCHER_FOR_ESCAPE_JS_STRING_, soy.esc.$$REPLACER_FOR_ESCAPE_JS_STRING__AND__ESCAPE_JS_REGEX_)
};
soy.esc.$$escapeJsRegexHelper = function(value) {
  var str = String(value);
  return str.replace(soy.esc.$$MATCHER_FOR_ESCAPE_JS_REGEX_, soy.esc.$$REPLACER_FOR_ESCAPE_JS_STRING__AND__ESCAPE_JS_REGEX_)
};
soy.esc.$$escapeCssStringHelper = function(value) {
  var str = String(value);
  return str.replace(soy.esc.$$MATCHER_FOR_ESCAPE_CSS_STRING_, soy.esc.$$REPLACER_FOR_ESCAPE_CSS_STRING_)
};
soy.esc.$$filterCssValueHelper = function(value) {
  var str = String(value);
  if(!soy.esc.$$FILTER_FOR_FILTER_CSS_VALUE_.test(str)) {
    goog.asserts.fail("Bad value `%s` for |filterCssValue", [str]);
    return"zSoyz"
  }
  return str
};
soy.esc.$$normalizeUriHelper = function(value) {
  var str = String(value);
  return str.replace(soy.esc.$$MATCHER_FOR_NORMALIZE_URI__AND__FILTER_NORMALIZE_URI_, soy.esc.$$REPLACER_FOR_NORMALIZE_URI__AND__FILTER_NORMALIZE_URI_)
};
soy.esc.$$filterNormalizeUriHelper = function(value) {
  var str = String(value);
  if(!soy.esc.$$FILTER_FOR_FILTER_NORMALIZE_URI_.test(str)) {
    goog.asserts.fail("Bad value `%s` for |filterNormalizeUri", [str]);
    return"zSoyz"
  }
  return str.replace(soy.esc.$$MATCHER_FOR_NORMALIZE_URI__AND__FILTER_NORMALIZE_URI_, soy.esc.$$REPLACER_FOR_NORMALIZE_URI__AND__FILTER_NORMALIZE_URI_)
};
soy.esc.$$filterHtmlAttributeHelper = function(value) {
  var str = String(value);
  if(!soy.esc.$$FILTER_FOR_FILTER_HTML_ATTRIBUTE_.test(str)) {
    goog.asserts.fail("Bad value `%s` for |filterHtmlAttribute", [str]);
    return"zSoyz"
  }
  return str
};
soy.esc.$$filterHtmlElementNameHelper = function(value) {
  var str = String(value);
  if(!soy.esc.$$FILTER_FOR_FILTER_HTML_ELEMENT_NAME_.test(str)) {
    goog.asserts.fail("Bad value `%s` for |filterHtmlElementName", [str]);
    return"zSoyz"
  }
  return str
};
soy.esc.$$HTML_TAG_REGEX_ = /<(?:!|\/?[a-zA-Z])(?:[^>'"]|"[^"]*"|'[^']*')*>/g;
goog.provide("annotorious.templates");
goog.require("soy");
annotorious.templates.popup = function(opt_data) {
  return'<div class="annotorious-popup top-left" style="position:absolute;z-index:1"><div class="annotorious-popup-buttons"><a class="annotorious-popup-button annotorious-popup-button-edit" title="Edit" href="javascript:void(0);">EDIT</a><a class="annotorious-popup-button annotorious-popup-button-delete" title="Delete" href="javascript:void(0);">DELETE</a></div><span class="annotorious-popup-text"></span></div>'
};
annotorious.templates.editform = function(opt_data) {
  return'<div class="annotorious-editor" style="position:absolute;z-index:1"><form><textarea class="annotorious-editor-text" placeholder="Add a Comment..." tabindex="1"></textarea><div class="annotorious-editor-button-container"><a class="annotorious-editor-button annotorious-editor-button-cancel" href="javascript:void(0);" tabindex="3">Cancel</a><a class="annotorious-editor-button annotorious-editor-button-save" href="javascript:void(0);" tabindex="2">Save</a></div></form></div>'
};
goog.provide("annotorious.Editor");
goog.require("goog.dom");
goog.require("goog.dom.query");
goog.require("goog.soy");
goog.require("goog.string.html.htmlSanitize");
goog.require("goog.style");
goog.require("goog.ui.Textarea");
goog.require("annotorious.templates");
annotorious.Editor = function(annotator) {
  this.element = goog.soy.renderAsElement(annotorious.templates.editform);
  this._annotator = annotator;
  this._item = annotator.getItem();
  this._original_annotation;
  this._current_annotation;
  this._textarea = new goog.ui.Textarea("");
  this._btnCancel = goog.dom.query(".annotorious-editor-button-cancel", this.element)[0];
  this._btnSave = goog.dom.query(".annotorious-editor-button-save", this.element)[0];
  this._btnContainer = goog.dom.getParentElement(this._btnSave);
  this._extraFields = [];
  var self = this;
  goog.events.listen(this._btnCancel, goog.events.EventType.CLICK, function(event) {
    event.preventDefault();
    annotator.stopSelection(self._original_annotation);
    self.close()
  });
  goog.events.listen(this._btnSave, goog.events.EventType.CLICK, function(event) {
    event.preventDefault();
    var annotation = self.getAnnotation();
    annotator.addAnnotation(annotation);
    annotator.stopSelection();
    if(self._original_annotation) {
      annotator.fireEvent(annotorious.events.EventType.ANNOTATION_UPDATED, annotation, annotator.getItem())
    }else {
      annotator.fireEvent(annotorious.events.EventType.ANNOTATION_CREATED, annotation, annotator.getItem())
    }
    self.close()
  });
  goog.style.showElement(this.element, false);
  goog.dom.appendChild(annotator.element, this.element);
  this._textarea.decorate(goog.dom.query(".annotorious-editor-text", this.element)[0]);
  annotorious.dom.makeHResizable(this.element, function() {
    self._textarea.resize()
  })
};
annotorious.Editor.prototype.addField = function(field) {
  var fieldEl = goog.dom.createDom("div", "annotorious-editor-field");
  if(goog.isString(field)) {
    fieldEl.innerHTML = field
  }else {
    if(goog.isFunction(field)) {
      this._extraFields.push({el:fieldEl, fn:field})
    }else {
      if(goog.dom.isElement(field)) {
        goog.dom.appendChild(fieldEl, field)
      }
    }
  }
  goog.dom.insertSiblingBefore(fieldEl, this._btnContainer)
};
annotorious.Editor.prototype.open = function(opt_annotation, opt_event) {
  this._original_annotation = opt_annotation;
  this._current_annotation = opt_annotation;
  if(opt_annotation) {
    this._textarea.setValue(opt_annotation.text)
  }
  goog.style.showElement(this.element, true);
  this._textarea.getElement().focus();
  goog.array.forEach(this._extraFields, function(field) {
    var f = field.fn(opt_annotation);
    if(goog.isString(f)) {
      field.el.innerHTML = f
    }else {
      if(goog.dom.isElement(f)) {
        goog.dom.removeChildren(field.el);
        goog.dom.appendChild(field.el, f)
      }
    }
  });
  this._annotator.fireEvent(annotorious.events.EventType.EDITOR_SHOWN, opt_annotation)
};
annotorious.Editor.prototype.close = function() {
  goog.style.showElement(this.element, false);
  this._textarea.setValue("")
};
annotorious.Editor.prototype.setPosition = function(xy) {
  goog.style.setPosition(this.element, xy.x, xy.y)
};
annotorious.Editor.prototype.getAnnotation = function() {
  var sanitized = goog.string.html.htmlSanitize(this._textarea.getValue(), function(url) {
    return url
  });
  if(this._current_annotation) {
    this._current_annotation.text = sanitized
  }else {
    this._current_annotation = new annotorious.Annotation(this._item.src, sanitized, this._annotator.getActiveSelector().getShape())
  }
  return this._current_annotation
};
annotorious.Editor.prototype["addField"] = annotorious.Editor.prototype.addField;
annotorious.Editor.prototype["getAnnotation"] = annotorious.Editor.prototype.getAnnotation;
goog.provide("annotorious.Hint");
goog.require("goog.dom.query");
goog.require("goog.events");
goog.require("goog.soy");
goog.require("goog.style");
annotorious.Hint = function(annotator, parent, opt_msg) {
  var self = this;
  if(!opt_msg) {
    opt_msg = "Click and Drag to Annotate"
  }
  this.element = goog.soy.renderAsElement(annotorious.templates.image.hint, {msg:opt_msg});
  this._annotator = annotator;
  this._message = goog.dom.query(".annotorious-hint-msg", this.element)[0];
  this._icon = goog.dom.query(".annotorious-hint-icon", this.element)[0];
  this._hideTimer;
  this._mouseOverListener;
  this._mouseOutListener;
  this._overItemHandler = function() {
    self.show()
  };
  this._outOfItemHandler = function() {
    self.hide()
  };
  this._attachListeners();
  this.hide();
  goog.dom.appendChild(parent, this.element)
};
annotorious.Hint.prototype._attachListeners = function() {
  var self = this;
  this._mouseOverListener = goog.events.listen(this._icon, goog.events.EventType.MOUSEOVER, function(event) {
    self.show();
    window.clearTimeout(self._hideTimer)
  });
  this._mouseOutListener = goog.events.listen(this._icon, goog.events.EventType.MOUSEOUT, function(event) {
    self.hide()
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
  var self = this;
  this._hideTimer = window.setTimeout(function() {
    self.hide()
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
goog.provide("annotorious.Popup");
goog.require("goog.dom");
goog.require("goog.dom.classes");
goog.require("goog.dom.query");
goog.require("goog.style");
annotorious.Popup = function(annotator) {
  this.element = goog.soy.renderAsElement(annotorious.templates.popup);
  this._annotator = annotator;
  this._currentAnnotation;
  this._text = goog.dom.query(".annotorious-popup-text", this.element)[0];
  this._buttons = goog.dom.query(".annotorious-popup-buttons", this.element)[0];
  this._popupHideTimer;
  this._buttonHideTimer;
  this._cancelHide = false;
  this._extraFields = [];
  var btnEdit = goog.dom.query(".annotorious-popup-button-edit", this._buttons)[0];
  var btnDelete = goog.dom.query(".annotorious-popup-button-delete", this._buttons)[0];
  var self = this;
  goog.events.listen(btnEdit, goog.events.EventType.MOUSEOVER, function(event) {
    goog.dom.classes.add(btnEdit, "annotorious-popup-button-active")
  });
  goog.events.listen(btnEdit, goog.events.EventType.MOUSEOUT, function() {
    goog.dom.classes.remove(btnEdit, "annotorious-popup-button-active")
  });
  goog.events.listen(btnEdit, goog.events.EventType.CLICK, function(event) {
    goog.style.setOpacity(self.element, 0);
    goog.style.setStyle(self.element, "pointer-events", "none");
    annotator.editAnnotation(self._currentAnnotation)
  });
  goog.events.listen(btnDelete, goog.events.EventType.MOUSEOVER, function(event) {
    goog.dom.classes.add(btnDelete, "annotorious-popup-button-active")
  });
  goog.events.listen(btnDelete, goog.events.EventType.MOUSEOUT, function() {
    goog.dom.classes.remove(btnDelete, "annotorious-popup-button-active")
  });
  goog.events.listen(btnDelete, goog.events.EventType.CLICK, function(event) {
    var cancelEvent = annotator.fireEvent(annotorious.events.EventType.BEFORE_ANNOTATION_REMOVED, self._currentAnnotation);
    if(!cancelEvent) {
      goog.style.setOpacity(self.element, 0);
      goog.style.setStyle(self.element, "pointer-events", "none");
      annotator.removeAnnotation(self._currentAnnotation);
      annotator.fireEvent(annotorious.events.EventType.ANNOTATION_REMOVED, self._currentAnnotation)
    }
  });
  if(annotorious.events.ui.hasMouse) {
    goog.events.listen(this.element, goog.events.EventType.MOUSEOVER, function(event) {
      window.clearTimeout(self._buttonHideTimer);
      if(goog.style.getStyle(self._buttons, "opacity") < 0.9) {
        goog.style.setOpacity(self._buttons, 0.9)
      }
      self.clearHideTimer()
    });
    goog.events.listen(this.element, goog.events.EventType.MOUSEOUT, function(event) {
      goog.style.setOpacity(self._buttons, 0);
      self.startHideTimer()
    });
    annotator.addHandler(annotorious.events.EventType.MOUSE_OUT_OF_ANNOTATABLE_ITEM, function(event) {
      self.startHideTimer()
    })
  }
  goog.style.setOpacity(this._buttons, 0);
  goog.style.setOpacity(this.element, 0);
  goog.style.setStyle(this.element, "pointer-events", "none");
  goog.dom.appendChild(annotator.element, this.element)
};
annotorious.Popup.prototype.addField = function(field) {
  var fieldEl = goog.dom.createDom("div", "annotorious-popup-field");
  if(goog.isString(field)) {
    fieldEl.innerHTML = field
  }else {
    if(goog.isFunction(field)) {
      this._extraFields.push({el:fieldEl, fn:field})
    }else {
      if(goog.dom.isElement(field)) {
        goog.dom.appendChild(fieldEl, field)
      }
    }
  }
  goog.dom.appendChild(this.element, fieldEl)
};
annotorious.Popup.prototype.startHideTimer = function() {
  this._cancelHide = false;
  if(!this._popupHideTimer) {
    var self = this;
    this._popupHideTimer = window.setTimeout(function() {
      self._annotator.fireEvent(annotorious.events.EventType.BEFORE_POPUP_HIDE, self);
      if(!self._cancelHide) {
        goog.style.setOpacity(self.element, 0);
        goog.style.setStyle(self.element, "pointer-events", "none");
        goog.style.setOpacity(self._buttons, 0.9);
        delete self._popupHideTimer
      }
    }, 150)
  }
};
annotorious.Popup.prototype.clearHideTimer = function() {
  this._cancelHide = true;
  if(this._popupHideTimer) {
    window.clearTimeout(this._popupHideTimer);
    delete this._popupHideTimer
  }
};
annotorious.Popup.prototype.show = function(annotation, xy) {
  this.clearHideTimer();
  if(xy) {
    this.setPosition(xy)
  }
  if(annotation) {
    this.setAnnotation(annotation)
  }
  if(this._buttonHideTimer) {
    window.clearTimeout(this._buttonHideTimer)
  }
  goog.style.setOpacity(this._buttons, 0.9);
  if(annotorious.events.ui.hasMouse) {
    var self = this;
    this._buttonHideTimer = window.setTimeout(function() {
      goog.style.setOpacity(self._buttons, 0)
    }, 1E3)
  }
  goog.style.setOpacity(this.element, 0.9);
  goog.style.setStyle(this.element, "pointer-events", "auto");
  this._annotator.fireEvent(annotorious.events.EventType.POPUP_SHOWN, this._currentAnnotation)
};
annotorious.Popup.prototype.setPosition = function(xy) {
  goog.style.setPosition(this.element, new goog.math.Coordinate(xy.x, xy.y))
};
annotorious.Popup.prototype.setAnnotation = function(annotation) {
  this._currentAnnotation = annotation;
  if(annotation.text) {
    this._text.innerHTML = annotation.text.replace(/\n/g, "<br/>")
  }else {
    this._text.innerHTML = '<span class="annotorious-popup-empty">No comment</span>'
  }
  if("editable" in annotation && annotation.editable == false) {
    goog.style.showElement(this._buttons, false)
  }else {
    goog.style.showElement(this._buttons, true)
  }
  goog.array.forEach(this._extraFields, function(field) {
    var f = field.fn(annotation);
    if(goog.isString(f)) {
      field.el.innerHTML = f
    }else {
      if(goog.dom.isElement(f)) {
        goog.dom.removeChildren(field.el);
        goog.dom.appendChild(field.el, f)
      }
    }
  })
};
annotorious.Popup.prototype["addField"] = annotorious.Popup.prototype.addField;
goog.provide("annotorious.mediatypes.Annotator");
annotorious.mediatypes.Annotator = function() {
};
annotorious.mediatypes.Annotator.prototype.addAnnotation = function(annotation, opt_replace) {
  this._viewer.addAnnotation(annotation, opt_replace)
};
annotorious.mediatypes.Annotator.prototype.addHandler = function(type, handler) {
  this._eventBroker.addHandler(type, handler)
};
annotorious.mediatypes.Annotator.prototype.fireEvent = function(type, event, opt_extra) {
  return this._eventBroker.fireEvent(type, event, opt_extra)
};
annotorious.mediatypes.Annotator.prototype.getActiveSelector = function() {
  return this._currentSelector
};
annotorious.mediatypes.Annotator.prototype.highlightAnnotation = function(annotation) {
  this._viewer.highlightAnnotation(annotation)
};
annotorious.mediatypes.Annotator.prototype.removeAnnotation = function(annotation) {
  this._viewer.removeAnnotation(annotation)
};
annotorious.mediatypes.Annotator.prototype.removeHandler = function(type, handler) {
  this._eventBroker.removeHandler(type, handler)
};
annotorious.mediatypes.Annotator.prototype.stopSelection = function(original_annotation) {
  if(annotorious.events.ui.hasMouse) {
    goog.style.showElement(this._editCanvas, false)
  }
  if(this._stop_selection_callback) {
    this._stop_selection_callback();
    delete this._stop_selection_callback
  }
  this._currentSelector.stopSelection();
  if(original_annotation) {
    this._viewer.addAnnotation(original_annotation)
  }
};
annotorious.mediatypes.Annotator.prototype._attachListener = function(activeCanvas) {
  var self = this;
  goog.events.listen(activeCanvas, annotorious.events.ui.EventType.DOWN, function(event) {
    var coords = annotorious.events.ui.sanitizeCoordinates(event, activeCanvas);
    self._viewer.highlightAnnotation(false);
    var annotations = self._viewer.getAnnotationsAt(coords.x, coords.y);
    if(self._selectionEnabled && annotations.length === 0) {
      goog.style.showElement(self._editCanvas, true);
      self._currentSelector.startSelection(coords.x, coords.y)
    }else {
      var annotations = self._viewer.getAnnotationsAt(coords.x, coords.y);
      if(annotations.length > 0) {
        self._viewer.highlightAnnotation(annotations[0])
      }
    }
  })
};
goog.provide("annotorious.mediatypes.image.Viewer");
annotorious.mediatypes.image.Viewer = function(canvas, annotator) {
  this._canvas = canvas;
  this._annotator = annotator;
  this._annotations = [];
  this._shapes = [];
  this._g2d = this._canvas.getContext("2d");
  this._currentAnnotation;
  this._eventsEnabled = true;
  this._cachedMouseEvent;
  this._keepHighlighted = false;
  var self = this;
  goog.events.listen(this._canvas, annotorious.events.ui.EventType.MOVE, function(event) {
    if(self._eventsEnabled) {
      self._onMouseMove(event)
    }else {
      self._cachedMouseEvent = event
    }
  });
  goog.events.listen(this._canvas, annotorious.events.ui.EventType.DOWN, function(event) {
    if(self._currentAnnotation !== undefined && self._currentAnnotation != false) {
      self._annotator.fireEvent(annotorious.events.EventType.ANNOTATION_CLICKED, self._currentAnnotation)
    }
  });
  annotator.addHandler(annotorious.events.EventType.MOUSE_OUT_OF_ANNOTATABLE_ITEM, function(event) {
    delete self._currentAnnotation;
    self._eventsEnabled = true
  });
  annotator.addHandler(annotorious.events.EventType.BEFORE_POPUP_HIDE, function() {
    if(!self._eventsEnabled && self._cachedMouseEvent) {
      var mouseX = self._cachedMouseEvent.offsetX;
      var mouseY = self._cachedMouseEvent.offsetY;
      var previousAnnotation = self._currentAnnotation;
      self._currentAnnotation = self.topAnnotationAt(mouseX, mouseY);
      self._eventsEnabled = true;
      if(previousAnnotation != self._currentAnnotation) {
        self.redraw();
        self._annotator.fireEvent(annotorious.events.EventType.MOUSE_OUT_OF_ANNOTATION, {annotation:previousAnnotation, mouseEvent:self._cachedMouseEvent});
        self._annotator.fireEvent(annotorious.events.EventType.MOUSE_OVER_ANNOTATION, {annotation:self._currentAnnotation, mouseEvent:self._cachedMouseEvent})
      }else {
        if(self._currentAnnotation) {
          self._annotator.popup.clearHideTimer()
        }
      }
    }else {
      self.redraw()
    }
  })
};
annotorious.mediatypes.image.Viewer.prototype.addAnnotation = function(annotation, opt_replace) {
  if(opt_replace) {
    if(opt_replace == this._currentAnnotation) {
      delete this._currentAnnotation
    }
    goog.array.remove(this._annotations, opt_replace);
    delete this._shapes[annotorious.shape.hashCode(opt_replace.shapes[0])]
  }
  this._annotations.push(annotation);
  var shape = annotation.shapes[0];
  if(shape.units == annotorious.shape.Units.PIXEL) {
    this._shapes[annotorious.shape.hashCode(annotation.shapes[0])] = shape
  }else {
    var self = this;
    var viewportShape = annotorious.shape.transform(shape, function(xy) {
      return self._annotator.fromItemCoordinates(xy)
    });
    this._shapes[annotorious.shape.hashCode(annotation.shapes[0])] = viewportShape
  }
  this.redraw()
};
annotorious.mediatypes.image.Viewer.prototype.removeAnnotation = function(annotation) {
  if(annotation == this._currentAnnotation) {
    delete this._currentAnnotation
  }
  goog.array.remove(this._annotations, annotation);
  delete this._shapes[annotorious.shape.hashCode(annotation.shapes[0])];
  this.redraw()
};
annotorious.mediatypes.image.Viewer.prototype.getAnnotations = function() {
  return goog.array.clone(this._annotations)
};
annotorious.mediatypes.image.Viewer.prototype.highlightAnnotation = function(opt_annotation) {
  this._currentAnnotation = opt_annotation;
  if(opt_annotation) {
    this._keepHighlighted = true
  }else {
    this._annotator.popup.startHideTimer()
  }
  this.redraw();
  this._eventsEnabled = true
};
annotorious.mediatypes.image.Viewer.prototype.getHighlightedAnnotation = function() {
  return this._currentAnnotation
};
annotorious.mediatypes.image.Viewer.prototype.topAnnotationAt = function(px, py) {
  var annotations = this.getAnnotationsAt(px, py);
  if(annotations.length > 0) {
    return annotations[0]
  }else {
    return undefined
  }
};
annotorious.mediatypes.image.Viewer.prototype.getAnnotationsAt = function(px, py) {
  var intersectedAnnotations = [];
  var self = this;
  goog.array.forEach(this._annotations, function(annotation) {
    if(annotorious.shape.intersects(self._shapes[annotorious.shape.hashCode(annotation.shapes[0])], px, py)) {
      intersectedAnnotations.push(annotation)
    }
  });
  goog.array.sort(intersectedAnnotations, function(a, b) {
    var shape_a = self._shapes[annotorious.shape.hashCode(a.shapes[0])];
    var shape_b = self._shapes[annotorious.shape.hashCode(b.shapes[0])];
    return annotorious.shape.getSize(shape_a) - annotorious.shape.getSize(shape_b)
  });
  return intersectedAnnotations
};
annotorious.mediatypes.image.Viewer.prototype._onMouseMove = function(event) {
  var topAnnotation = this.topAnnotationAt(event.offsetX, event.offsetY);
  var self = this;
  if(topAnnotation) {
    this._keepHighlighted = this._keepHighlighted && topAnnotation == this._currentAnnotation;
    if(!this._currentAnnotation) {
      this._currentAnnotation = topAnnotation;
      this.redraw();
      this._annotator.fireEvent(annotorious.events.EventType.MOUSE_OVER_ANNOTATION, {annotation:this._currentAnnotation, mouseEvent:event})
    }else {
      if(this._currentAnnotation != topAnnotation) {
        this._eventsEnabled = false;
        this._annotator.popup.startHideTimer()
      }
    }
  }else {
    if(!this._keepHighlighted) {
      if(this._currentAnnotation) {
        this._eventsEnabled = false;
        this._annotator.popup.startHideTimer()
      }
    }
  }
};
annotorious.mediatypes.image.Viewer.prototype._draw = function(shape, highlight) {
  var selector = goog.array.find(this._annotator.getAvailableSelectors(), function(selector) {
    return selector.getSupportedShapeType() == shape.type
  });
  if(selector) {
    selector.drawShape(this._g2d, shape, highlight)
  }else {
    console.log("WARNING unsupported shape type: " + shape.type)
  }
};
annotorious.mediatypes.image.Viewer.prototype.redraw = function() {
  this._g2d.clearRect(0, 0, this._canvas.width, this._canvas.height);
  var self = this;
  goog.array.forEach(this._annotations, function(annotation) {
    if(annotation != self._currentAnnotation) {
      self._draw(self._shapes[annotorious.shape.hashCode(annotation.shapes[0])])
    }
  });
  if(this._currentAnnotation) {
    var shape = this._shapes[annotorious.shape.hashCode(this._currentAnnotation.shapes[0])];
    this._draw(shape, true);
    var bbox = annotorious.shape.getBoundingRect(shape).geometry;
    this._annotator.popup.show(this._currentAnnotation, new annotorious.shape.geom.Point(bbox.x, bbox.y + bbox.height + 5))
  }
};
goog.provide("annotorious.events.ui");
goog.require("goog.dom");
goog.require("goog.dom.classes");
goog.require("goog.events.EventType");
annotorious.events.ui.hasTouch = "ontouchstart" in window;
annotorious.events.ui.hasMouse = !annotorious.events.ui.hasTouch;
annotorious.events.ui.EventType = {DOWN:annotorious.events.ui.hasTouch ? goog.events.EventType.TOUCHSTART : goog.events.EventType.MOUSEDOWN, OVER:annotorious.events.ui.hasTouch ? "touchenter" : goog.events.EventType.MOUSEOVER, MOVE:annotorious.events.ui.hasTouch ? goog.events.EventType.TOUCHMOVE : goog.events.EventType.MOUSEMOVE, UP:annotorious.events.ui.hasTouch ? goog.events.EventType.TOUCHEND : goog.events.EventType.MOUSEUP, OUT:annotorious.events.ui.hasTouch ? "touchleave" : goog.events.EventType.MOUSEOUT, 
CLICK:annotorious.events.ui.hasTouch ? goog.events.EventType.TOUCHEND : goog.events.EventType.CLICK};
annotorious.events.ui.sanitizeCoordinates = function(event, parent) {
  var points = false;
  var offset = annotorious.dom.getOffset;
  event.offsetX = event.offsetX ? event.offsetX : false;
  event.offsetY = event.offsetY ? event.offsetY : false;
  if((!event.offsetX || !event.offsetY) && event.event_.changedTouches) {
    points = {x:event.event_.changedTouches[0].clientX - offset(parent).left, y:event.event_.changedTouches[0].clientY - offset(parent).top}
  }else {
    points = {x:event.offsetX, y:event.offsetY}
  }
  return points
};
goog.provide("annotorious.plugins.selection.RectDragSelector");
goog.require("goog.events");
goog.require("annotorious.events.ui");
annotorious.plugins.selection.RectDragSelector = function() {
};
annotorious.plugins.selection.RectDragSelector.prototype.init = function(annotator, canvas) {
  this._OUTLINE = "#000000";
  this._STROKE = "#ffffff";
  this._FILL = false;
  this._HI_OUTLINE = "#000000";
  this._HI_STROKE = "#fff000";
  this._HI_FILL = false;
  this._OUTLINE_WIDTH = 1;
  this._STROKE_WIDTH = 1;
  this._HI_OUTLINE_WIDTH = 1;
  this._HI_STROKE_WIDTH = 1.2;
  this._canvas = canvas;
  this._annotator = annotator;
  this._g2d = canvas.getContext("2d");
  this._g2d.lineWidth = 1;
  this._anchor;
  this._opposite;
  this._enabled = false;
  this._mouseMoveListener;
  this._mouseUpListener
};
annotorious.plugins.selection.RectDragSelector.prototype._attachListeners = function(startPoint) {
  var self = this;
  var canvas = this._canvas;
  this._mouseMoveListener = goog.events.listen(this._canvas, annotorious.events.ui.EventType.MOVE, function(event) {
    var points = annotorious.events.ui.sanitizeCoordinates(event, canvas);
    if(self._enabled) {
      self._opposite = {x:points.x, y:points.y};
      self._g2d.clearRect(0, 0, canvas.width, canvas.height);
      var width = self._opposite.x - self._anchor.x;
      var height = self._opposite.y - self._anchor.y;
      self.drawShape(self._g2d, {type:annotorious.shape.ShapeType.RECTANGLE, geometry:{x:width > 0 ? self._anchor.x : self._opposite.x, y:height > 0 ? self._anchor.y : self._opposite.y, width:Math.abs(width), height:Math.abs(height)}, style:{}})
    }
  });
  this._mouseUpListener = goog.events.listen(canvas, annotorious.events.ui.EventType.UP, function(event) {
    var points = annotorious.events.ui.sanitizeCoordinates(event, canvas);
    var shape = self.getShape();
    event = event.event_ ? event.event_ : event;
    self._enabled = false;
    if(shape) {
      self._detachListeners();
      self._annotator.fireEvent(annotorious.events.EventType.SELECTION_COMPLETED, {mouseEvent:event, shape:shape, viewportBounds:self.getViewportBounds(), annotorious:self._annotator})
    }else {
      self._annotator.fireEvent(annotorious.events.EventType.SELECTION_CANCELED);
      var annotations = self._annotator.getAnnotationsAt(points.x, points.y);
      if(annotations.length > 0) {
        self._annotator.highlightAnnotation(annotations[0])
      }
    }
  })
};
annotorious.plugins.selection.RectDragSelector.prototype._detachListeners = function() {
  if(this._mouseMoveListener) {
    goog.events.unlistenByKey(this._mouseMoveListener);
    delete this._mouseMoveListener
  }
  if(this._mouseUpListener) {
    goog.events.unlistenByKey(this._mouseUpListener);
    delete this._mouseUpListener
  }
};
annotorious.plugins.selection.RectDragSelector.prototype.getName = function() {
  return"rect_drag"
};
annotorious.plugins.selection.RectDragSelector.prototype.getSupportedShapeType = function() {
  return annotorious.shape.ShapeType.RECTANGLE
};
annotorious.plugins.selection.RectDragSelector.prototype.setProperties = function(props) {
  if(props.hasOwnProperty("outline")) {
    this._OUTLINE = props["outline"]
  }
  if(props.hasOwnProperty("stroke")) {
    this._STROKE = props["stroke"]
  }
  if(props.hasOwnProperty("fill")) {
    this._FILL = props["fill"]
  }
  if(props.hasOwnProperty("hi_outline")) {
    this._HI_OUTLINE = props["hi_outline"]
  }
  if(props.hasOwnProperty("hi_stroke")) {
    this._HI_STROKE = props["hi_stroke"]
  }
  if(props.hasOwnProperty("hi_fill")) {
    this._HI_FILL = props["hi_fill"]
  }
  if(props.hasOwnProperty("outline_width")) {
    this._OUTLINE_WIDTH = props["outline_width"]
  }
  if(props.hasOwnProperty("stroke_width")) {
    this._STROKE_WIDTH = props["stroke_width"]
  }
  if(props.hasOwnProperty("hi_outline_width")) {
    this._HI_OUTLINE_WIDTH = props["hi_outline_width"]
  }
  if(props.hasOwnProperty("hi_stroke_width")) {
    this._HI_STROKE_WIDTH = props["hi_stroke_width"]
  }
};
annotorious.plugins.selection.RectDragSelector.prototype.startSelection = function(x, y) {
  var startPoint = {x:x, y:y};
  this._enabled = true;
  this._attachListeners(startPoint);
  this._anchor = new annotorious.shape.geom.Point(x, y);
  this._annotator.fireEvent(annotorious.events.EventType.SELECTION_STARTED, {offsetX:x, offsetY:y});
  goog.style.setStyle(document.body, "-webkit-user-select", "none")
};
annotorious.plugins.selection.RectDragSelector.prototype.stopSelection = function() {
  this._detachListeners();
  this._g2d.clearRect(0, 0, this._canvas.width, this._canvas.height);
  goog.style.setStyle(document.body, "-webkit-user-select", "auto");
  delete this._opposite
};
annotorious.plugins.selection.RectDragSelector.prototype.getShape = function() {
  if(this._opposite && Math.abs(this._opposite.x - this._anchor.x) > 3 && Math.abs(this._opposite.y - this._anchor.y) > 3) {
    var viewportBounds = this.getViewportBounds();
    var rect = this._annotator.toItemCoordinates({x:viewportBounds.left, y:viewportBounds.top, width:viewportBounds.right - viewportBounds.left, height:viewportBounds.bottom - viewportBounds.top});
    return new annotorious.shape.Shape(annotorious.shape.ShapeType.RECTANGLE, rect)
  }else {
    return undefined
  }
};
annotorious.plugins.selection.RectDragSelector.prototype.getViewportBounds = function() {
  var right, left;
  if(this._opposite.x > this._anchor.x) {
    right = this._opposite.x;
    left = this._anchor.x
  }else {
    right = this._anchor.x;
    left = this._opposite.x
  }
  var top, bottom;
  if(this._opposite.y > this._anchor.y) {
    top = this._anchor.y;
    bottom = this._opposite.y
  }else {
    top = this._opposite.y;
    bottom = this._anchor.y
  }
  return{top:top, right:right, bottom:bottom, left:left}
};
annotorious.plugins.selection.RectDragSelector.prototype.drawShape = function(g2d, shape, highlight) {
  var geom, stroke, fill, outline, outline_width, stroke_width;
  if(!shape.style) {
    shape.style = {}
  }
  if(shape.type == annotorious.shape.ShapeType.RECTANGLE) {
    if(highlight) {
      fill = shape.style.hi_fill || this._HI_FILL;
      stroke = shape.style.hi_stroke || this._HI_STROKE;
      outline = shape.style.hi_outline || this._HI_OUTLINE;
      outline_width = shape.style.hi_outline_width || this._HI_OUTLINE_WIDTH;
      stroke_width = shape.style.hi_stroke_width || this._HI_STROKE_WIDTH
    }else {
      fill = shape.style.fill || this._FILL;
      stroke = shape.style.stroke || this._STROKE;
      outline = shape.style.outline || this._OUTLINE;
      outline_width = shape.style.outline_width || this._OUTLINE_WIDTH;
      stroke_width = shape.style.stroke_width || this._STROKE_WIDTH
    }
    geom = shape.geometry;
    if(outline) {
      g2d.lineJoin = "round";
      g2d.lineWidth = outline_width;
      g2d.strokeStyle = outline;
      g2d.strokeRect(geom.x + outline_width / 2, geom.y + outline_width / 2, geom.width - outline_width, geom.height - outline_width)
    }
    if(stroke) {
      g2d.lineJoin = "miter";
      g2d.lineWidth = stroke_width;
      g2d.strokeStyle = stroke;
      g2d.strokeRect(geom.x + outline_width + stroke_width / 2, geom.y + outline_width + stroke_width / 2, geom.width - outline_width * 2 - stroke_width, geom.height - outline_width * 2 - stroke_width)
    }
    if(fill) {
      g2d.lineJoin = "miter";
      g2d.lineWidth = stroke_width;
      g2d.fillStyle = fill;
      g2d.fillRect(geom.x + outline_width + stroke_width / 2, geom.y + outline_width + stroke_width / 2, geom.width - outline_width * 2 - stroke_width, geom.height - outline_width * 2 - stroke_width)
    }
  }
};
goog.provide("annotorious.templates.image");
goog.require("soy");
annotorious.templates.image.canvas = function(opt_data) {
  return'<canvas class="annotorious-item annotorious-opacity-fade" style="position:absolute; top:0px; left:0px; width:' + soy.$$escapeHtml(opt_data.width) + "px; height:" + soy.$$escapeHtml(opt_data.height) + 'px; z-index:0" width="' + soy.$$escapeHtml(opt_data.width) + '" height="' + soy.$$escapeHtml(opt_data.height) + '"></canvas>'
};
annotorious.templates.image.hint = function(opt_data) {
  return'<div class="annotorious-hint" style="white-space:nowrap; position:absolute; top:0px; left:0px; pointer-events:none;"><div class="annotorious-hint-msg annotorious-opacity-fade">' + soy.$$escapeHtml(opt_data.msg) + '</div><div class="annotorious-hint-icon" style="pointer-events:auto"></div></div>'
};
goog.provide("annotorious.mediatypes.image.ImageAnnotator");
goog.require("goog.dom");
goog.require("goog.dom.classes");
goog.require("goog.dom.query");
goog.require("goog.events");
goog.require("goog.math");
goog.require("goog.soy");
goog.require("goog.style");
goog.require("annotorious.Editor");
goog.require("annotorious.Hint");
goog.require("annotorious.Popup");
goog.require("annotorious.mediatypes.Annotator");
goog.require("annotorious.mediatypes.image.Viewer");
goog.require("annotorious.plugins.selection.RectDragSelector");
goog.require("annotorious.templates.image");
annotorious.mediatypes.image.ImageAnnotator = function(item, opt_popup) {
  annotorious.mediatypes.Annotator.call();
  var hint;
  this.element;
  this.editor;
  this.popup;
  this._image = item;
  this._original_bufferspace = {padding:item.style.padding, margin:item.style.margin};
  this._viewer;
  this._editCanvas;
  this._hint;
  this._eventBroker = new annotorious.events.EventBroker;
  this._selectors = [];
  this._currentSelector;
  this._selectionEnabled = true;
  this.element = goog.dom.createDom("div", "annotorious-annotationlayer");
  goog.style.setStyle(this.element, "position", "relative");
  goog.style.setStyle(this.element, "display", "inline-block");
  this._transferStyles(item, this.element);
  goog.dom.replaceNode(this.element, item);
  goog.dom.appendChild(this.element, item);
  var img_bounds = goog.style.getBounds(item);
  this._viewCanvas = goog.soy.renderAsElement(annotorious.templates.image.canvas, {width:img_bounds.width, height:img_bounds.height});
  if(annotorious.events.ui.hasMouse) {
    goog.dom.classes.add(this._viewCanvas, "annotorious-item-unfocus")
  }
  goog.dom.appendChild(this.element, this._viewCanvas);
  this._editCanvas = goog.soy.renderAsElement(annotorious.templates.image.canvas, {width:img_bounds.width, height:img_bounds.height});
  if(annotorious.events.ui.hasMouse) {
    goog.style.showElement(this._editCanvas, false)
  }
  goog.dom.appendChild(this.element, this._editCanvas);
  if(opt_popup) {
    this.popup = opt_popup
  }else {
    this.popup = new annotorious.Popup(this)
  }
  var default_selector = new annotorious.plugins.selection.RectDragSelector;
  default_selector.init(this, this._editCanvas);
  this._selectors.push(default_selector);
  this._currentSelector = default_selector;
  this.editor = new annotorious.Editor(this);
  this._viewer = new annotorious.mediatypes.image.Viewer(this._viewCanvas, this);
  this._hint = new annotorious.Hint(this, this.element);
  var self = this;
  if(annotorious.events.ui.hasMouse) {
    goog.events.listen(this.element, annotorious.events.ui.EventType.OVER, function(event) {
      var relatedTarget = event.relatedTarget;
      if(!relatedTarget || !goog.dom.contains(self.element, relatedTarget)) {
        self._eventBroker.fireEvent(annotorious.events.EventType.MOUSE_OVER_ANNOTATABLE_ITEM);
        goog.dom.classes.addRemove(self._viewCanvas, "annotorious-item-unfocus", "annotorious-item-focus")
      }
    });
    goog.events.listen(this.element, annotorious.events.ui.EventType.OUT, function(event) {
      var relatedTarget = event.relatedTarget;
      if(!relatedTarget || !goog.dom.contains(self.element, relatedTarget)) {
        self._eventBroker.fireEvent(annotorious.events.EventType.MOUSE_OUT_OF_ANNOTATABLE_ITEM);
        goog.dom.classes.addRemove(self._viewCanvas, "annotorious-item-focus", "annotorious-item-unfocus")
      }
    })
  }
  var activeCanvas = annotorious.events.ui.hasTouch ? this._editCanvas : this._viewCanvas;
  this._attachListener(activeCanvas);
  this._eventBroker.addHandler(annotorious.events.EventType.SELECTION_COMPLETED, function(event) {
    var bounds = event.viewportBounds;
    self.editor.setPosition(new annotorious.shape.geom.Point(bounds.left + self._image.offsetLeft, bounds.bottom + 4 + self._image.offsetTop))
  });
  this._eventBroker.addHandler(annotorious.events.EventType.SELECTION_CANCELED, function() {
    if(annotorious.events.ui.hasMouse) {
      goog.style.showElement(self._editCanvas, false)
    }
    self._currentSelector.stopSelection()
  })
};
goog.inherits(annotorious.mediatypes.image.ImageAnnotator, annotorious.mediatypes.Annotator);
annotorious.mediatypes.image.ImageAnnotator.prototype._transferStyles = function(image, annotationLayer) {
  var transferMargin = function(direction, value) {
    goog.style.setStyle(annotationLayer, "margin-" + direction, value + "px");
    goog.style.setStyle(image, "margin-" + direction, 0);
    goog.style.setStyle(image, "padding-" + direction, 0)
  };
  var margin = goog.style.getMarginBox(image);
  var padding = goog.style.getPaddingBox(image);
  if(margin.top != 0 || padding.top != 0) {
    transferMargin("top", margin.top + padding.top)
  }
  if(margin.right != 0 || padding.right != 0) {
    transferMargin("right", margin.right + padding.right)
  }
  if(margin.bottom != 0 || padding.bottom != 0) {
    transferMargin("bottom", margin.bottom + padding.bottom)
  }
  if(margin.left != 0 || padding.left != 0) {
    transferMargin("left", margin.left + padding.left)
  }
};
annotorious.mediatypes.image.ImageAnnotator.prototype.activateSelector = function(callback) {
};
annotorious.mediatypes.image.ImageAnnotator.prototype.addSelector = function(selector) {
  selector.init(this, this._editCanvas);
  this._selectors.push(selector)
};
annotorious.mediatypes.image.ImageAnnotator.prototype.destroy = function() {
  var img = this._image;
  img.style.margin = this._original_bufferspace.margin;
  img.style.padding = this._original_bufferspace.padding;
  goog.dom.replaceNode(img, this.element)
};
annotorious.mediatypes.image.ImageAnnotator.prototype.editAnnotation = function(annotation) {
  this._viewer.removeAnnotation(annotation);
  var selector = goog.array.find(this._selectors, function(selector) {
    return selector.getSupportedShapeType() == annotation.shapes[0].type
  });
  if(selector) {
    goog.style.showElement(this._editCanvas, true);
    this._viewer.highlightAnnotation(false);
    var g2d = this._editCanvas.getContext("2d");
    var shape = annotation.shapes[0];
    var self = this;
    var viewportShape = shape.units == "pixel" ? shape : annotorious.shape.transform(shape, function(xy) {
      return self.fromItemCoordinates(xy)
    });
    selector.drawShape(g2d, viewportShape)
  }
  var bounds = annotorious.shape.getBoundingRect(annotation.shapes[0]).geometry;
  var anchor = annotation.shapes[0].units == "pixel" ? new annotorious.shape.geom.Point(bounds.x, bounds.y + bounds.height) : this.fromItemCoordinates(new annotorious.shape.geom.Point(bounds.x, bounds.y + bounds.height));
  this.editor.setPosition(new annotorious.shape.geom.Point(anchor.x + this._image.offsetLeft, anchor.y + 4 + this._image.offsetTop));
  this.editor.open(annotation)
};
annotorious.mediatypes.image.ImageAnnotator.prototype.fromItemCoordinates = function(xy_wh) {
  var imgSize = goog.style.getSize(this._image);
  if(xy_wh.width) {
    return{x:xy_wh.x * imgSize.width, y:xy_wh.y * imgSize.height, width:xy_wh.width * imgSize.width, height:xy_wh.height * imgSize.height}
  }else {
    return{x:xy_wh.x * imgSize.width, y:xy_wh.y * imgSize.height}
  }
};
annotorious.mediatypes.image.ImageAnnotator.prototype.getActiveSelector = function() {
  return this._currentSelector
};
annotorious.mediatypes.image.ImageAnnotator.prototype.getAnnotations = function() {
  return this._viewer.getAnnotations()
};
annotorious.mediatypes.image.ImageAnnotator.prototype.getAnnotationsAt = function(cx, cy) {
  return goog.array.clone(this._viewer.getAnnotationsAt(cx, cy))
};
annotorious.mediatypes.image.ImageAnnotator.prototype.getAvailableSelectors = function() {
  return this._selectors
};
annotorious.mediatypes.image.ImageAnnotator.prototype.getItem = function() {
  return{src:annotorious.mediatypes.image.ImageAnnotator.getItemURL(this._image), element:this._image}
};
annotorious.mediatypes.image.ImageAnnotator.getItemURL = function(item) {
  var src = item.getAttribute("data-original");
  if(src) {
    return src
  }else {
    return item.src
  }
};
annotorious.mediatypes.image.ImageAnnotator.prototype.hideAnnotations = function() {
  goog.style.showElement(this._viewCanvas, false)
};
annotorious.mediatypes.image.ImageAnnotator.prototype.hideSelectionWidget = function() {
  this._selectionEnabled = false;
  if(this._hint) {
    this._hint.destroy();
    delete this._hint
  }
};
annotorious.mediatypes.image.ImageAnnotator.prototype.setCurrentSelector = function(selector) {
  this._currentSelector = goog.array.find(this._selectors, function(sel) {
    return sel.getName() == selector
  });
  if(!this._currentSelector) {
    console.log('WARNING: selector "' + selector + '" not available')
  }
};
annotorious.mediatypes.image.ImageAnnotator.prototype.setProperties = function(props) {
  goog.array.forEach(this._selectors, function(selector) {
    selector.setProperties(props)
  });
  this._viewer.redraw()
};
annotorious.mediatypes.image.ImageAnnotator.prototype.showAnnotations = function() {
  goog.style.showElement(this._viewCanvas, true)
};
annotorious.mediatypes.image.ImageAnnotator.prototype.showSelectionWidget = function() {
  this._selectionEnabled = true;
  if(!this._hint) {
    this._hint = new annotorious.Hint(this, this.element)
  }
};
annotorious.mediatypes.image.ImageAnnotator.prototype.stopSelection = function(opt_original_annotation) {
  if(annotorious.events.ui.hasMouse) {
    goog.style.showElement(this._editCanvas, false)
  }
  this._currentSelector.stopSelection();
  if(opt_original_annotation) {
    this._viewer.addAnnotation(opt_original_annotation)
  }
};
annotorious.mediatypes.image.ImageAnnotator.prototype.toItemCoordinates = function(xy_wh) {
  var imgSize = goog.style.getSize(this._image);
  if(xy_wh.width) {
    return{x:xy_wh.x / imgSize.width, y:xy_wh.y / imgSize.height, width:xy_wh.width / imgSize.width, height:xy_wh.height / imgSize.height}
  }else {
    return{x:xy_wh.x / imgSize.width, y:xy_wh.y / imgSize.height}
  }
};
annotorious.mediatypes.image.ImageAnnotator.prototype["addSelector"] = annotorious.mediatypes.image.ImageAnnotator.prototype.addSelector;
annotorious.mediatypes.image.ImageAnnotator.prototype["stopSelection"] = annotorious.mediatypes.image.ImageAnnotator.prototype.stopSelection;
annotorious.mediatypes.image.ImageAnnotator.prototype["fireEvent"] = annotorious.mediatypes.image.ImageAnnotator.prototype.fireEvent;
annotorious.mediatypes.image.ImageAnnotator.prototype["setCurrentSelector"] = annotorious.mediatypes.image.ImageAnnotator.prototype.setCurrentSelector;
annotorious.mediatypes.image.ImageAnnotator.prototype["toItemCoordinates"] = annotorious.mediatypes.image.ImageAnnotator.prototype.toItemCoordinates;
goog.provide("annotorious.mediatypes.image.ImageModule");
goog.require("annotorious.mediatypes.Module");
goog.require("annotorious.mediatypes.image.ImageAnnotator");
annotorious.mediatypes.image.ImageModule = function() {
  annotorious.mediatypes.Module.call();
  this._initFields(function() {
    return goog.dom.query("img.annotatable", document)
  })
};
goog.inherits(annotorious.mediatypes.image.ImageModule, annotorious.mediatypes.Module);
annotorious.mediatypes.image.ImageModule.prototype.getItemURL = function(item) {
  return annotorious.mediatypes.image.ImageAnnotator.getItemURL(item)
};
annotorious.mediatypes.image.ImageModule.prototype.newAnnotator = function(item) {
  return new annotorious.mediatypes.image.ImageAnnotator(item)
};
annotorious.mediatypes.image.ImageModule.prototype.supports = function(item) {
  if(goog.dom.isElement(item)) {
    return item.tagName == "IMG"
  }else {
    return false
  }
};
goog.provide("annotorious.templates.openlayers");
goog.require("soy");
annotorious.templates.openlayers.secondaryHint = function(opt_data) {
  return'<div class="annotorious-opacity-fade" style="white-space:nowrap; position:absolute; pointer-events:none; top:80px; width:100%; text-align:center;"><div class="annotorious-ol-hint" style="width: 400px; margin:0px auto;">' + soy.$$escapeHtml(opt_data.msg) + "</dvi></div>"
};
goog.provide("goog.events.MouseWheelEvent");
goog.provide("goog.events.MouseWheelHandler");
goog.provide("goog.events.MouseWheelHandler.EventType");
goog.require("goog.events");
goog.require("goog.events.BrowserEvent");
goog.require("goog.events.EventTarget");
goog.require("goog.math");
goog.require("goog.style");
goog.require("goog.userAgent");
goog.events.MouseWheelHandler = function(element) {
  goog.events.EventTarget.call(this);
  this.element_ = element;
  var rtlElement = goog.dom.isElement(this.element_) ? this.element_ : this.element_ ? this.element_.body : null;
  this.isRtl_ = !!rtlElement && goog.style.isRightToLeft(rtlElement);
  var type = goog.userAgent.GECKO ? "DOMMouseScroll" : "mousewheel";
  this.listenKey_ = goog.events.listen(this.element_, type, this)
};
goog.inherits(goog.events.MouseWheelHandler, goog.events.EventTarget);
goog.events.MouseWheelHandler.EventType = {MOUSEWHEEL:"mousewheel"};
goog.events.MouseWheelHandler.prototype.maxDeltaX_;
goog.events.MouseWheelHandler.prototype.maxDeltaY_;
goog.events.MouseWheelHandler.prototype.setMaxDeltaX = function(maxDeltaX) {
  this.maxDeltaX_ = maxDeltaX
};
goog.events.MouseWheelHandler.prototype.setMaxDeltaY = function(maxDeltaY) {
  this.maxDeltaY_ = maxDeltaY
};
goog.events.MouseWheelHandler.prototype.handleEvent = function(e) {
  var deltaX = 0;
  var deltaY = 0;
  var detail = 0;
  var be = e.getBrowserEvent();
  if(be.type == "mousewheel") {
    var wheelDeltaScaleFactor = 1;
    if(goog.userAgent.IE || goog.userAgent.WEBKIT && (goog.userAgent.WINDOWS || goog.userAgent.isVersion("532.0"))) {
      wheelDeltaScaleFactor = 40
    }
    detail = goog.events.MouseWheelHandler.smartScale_(-be.wheelDelta, wheelDeltaScaleFactor);
    if(goog.isDef(be.wheelDeltaX)) {
      deltaX = goog.events.MouseWheelHandler.smartScale_(-be.wheelDeltaX, wheelDeltaScaleFactor);
      deltaY = goog.events.MouseWheelHandler.smartScale_(-be.wheelDeltaY, wheelDeltaScaleFactor)
    }else {
      deltaY = detail
    }
  }else {
    detail = be.detail;
    if(detail > 100) {
      detail = 3
    }else {
      if(detail < -100) {
        detail = -3
      }
    }
    if(goog.isDef(be.axis) && be.axis === be.HORIZONTAL_AXIS) {
      deltaX = detail
    }else {
      deltaY = detail
    }
  }
  if(goog.isNumber(this.maxDeltaX_)) {
    deltaX = goog.math.clamp(deltaX, -this.maxDeltaX_, this.maxDeltaX_)
  }
  if(goog.isNumber(this.maxDeltaY_)) {
    deltaY = goog.math.clamp(deltaY, -this.maxDeltaY_, this.maxDeltaY_)
  }
  if(this.isRtl_) {
    deltaX = -deltaX
  }
  var newEvent = new goog.events.MouseWheelEvent(detail, be, deltaX, deltaY);
  this.dispatchEvent(newEvent)
};
goog.events.MouseWheelHandler.smartScale_ = function(mouseWheelDelta, scaleFactor) {
  if(goog.userAgent.WEBKIT && (goog.userAgent.MAC || goog.userAgent.LINUX) && mouseWheelDelta % scaleFactor != 0) {
    return mouseWheelDelta
  }else {
    return mouseWheelDelta / scaleFactor
  }
};
goog.events.MouseWheelHandler.prototype.disposeInternal = function() {
  goog.events.MouseWheelHandler.superClass_.disposeInternal.call(this);
  goog.events.unlistenByKey(this.listenKey_);
  delete this.listenKey_
};
goog.events.MouseWheelEvent = function(detail, browserEvent, deltaX, deltaY) {
  goog.events.BrowserEvent.call(this, browserEvent);
  this.type = goog.events.MouseWheelHandler.EventType.MOUSEWHEEL;
  this.detail = detail;
  this.deltaX = deltaX;
  this.deltaY = deltaY
};
goog.inherits(goog.events.MouseWheelEvent, goog.events.BrowserEvent);
goog.provide("annotorious.mediatypes.openlayers.Viewer");
goog.require("goog.events.MouseWheelHandler");
annotorious.mediatypes.openlayers.Viewer = function(map, annotator) {
  this._map = map;
  this._map_bounds = goog.style.getBounds(annotator.element);
  this._popup = annotator.popup;
  goog.style.setStyle(this._popup.element, "z-index", 99E3);
  this._overlays = [];
  this._currentlyHighlightedOverlay;
  this._lastHoveredOverlay;
  this._boxesLayer = new OpenLayers.Layer.Boxes("Annotorious");
  this._map.addLayer(this._boxesLayer);
  var self = this;
  this._map.events.register("move", this._map, function() {
    if(self._currentlyHighlightedOverlay) {
      self._place_popup()
    }
  });
  annotator.addHandler(annotorious.events.EventType.BEFORE_POPUP_HIDE, function() {
    if(self._lastHoveredOverlay == self._currentlyHighlightedOverlay) {
      self._popup.clearHideTimer()
    }else {
      self._updateHighlight(self._lastHoveredOverlay, self._currentlyHighlightedOverlay)
    }
  })
};
annotorious.mediatypes.openlayers.Viewer.prototype.destroy = function() {
  this._boxesLayer.destroy()
};
annotorious.mediatypes.openlayers.Viewer.prototype._place_popup = function() {
  var annotation_div = this._currentlyHighlightedOverlay.marker.div;
  var annotation_dim = goog.style.getBounds(annotation_div);
  var annotation_pos = goog.style.getRelativePosition(annotation_div, this._map.div);
  var annotation_bounds = {top:annotation_pos.y, left:annotation_pos.x, width:annotation_dim.width, height:annotation_dim.height};
  var popup_bounds = goog.style.getBounds(this._popup.element);
  var popup_pos = {y:annotation_bounds.top + annotation_bounds.height + 5};
  if(annotation_bounds.left + popup_bounds.width > this._map_bounds.width) {
    goog.dom.classes.addRemove(this._popup.element, "top-left", "top-right");
    popup_pos.x = annotation_bounds.left + annotation_bounds.width - popup_bounds.width
  }else {
    goog.dom.classes.addRemove(this._popup.element, "top-right", "top-left");
    popup_pos.x = annotation_bounds.left
  }
  if(popup_pos.x < 0) {
    popup_pos.x = 0
  }
  if(popup_pos.x + popup_bounds.width > this._map_bounds.width) {
    popup_pos.x = this._map_bounds.width - popup_bounds.width
  }
  if(popup_pos.y + popup_bounds.height > this._map_bounds.height) {
    popup_pos.y = this._map_bounds.height - popup_bounds.height
  }
  this._popup.setPosition(popup_pos)
};
annotorious.mediatypes.openlayers.Viewer.prototype._show_popup = function(annotation) {
  this._popup.setAnnotation(annotation);
  this._place_popup();
  this._popup.show()
};
annotorious.mediatypes.openlayers.Viewer.prototype._updateHighlight = function(new_highlight, previous_highlight) {
  if(new_highlight) {
    var pos = goog.style.getRelativePosition(new_highlight.marker.div, this._map.div);
    var height = parseInt(goog.style.getStyle(new_highlight.marker.div, "height"), 10);
    goog.style.setStyle(new_highlight.inner, "border-color", "#fff000");
    this._currentlyHighlightedOverlay = new_highlight;
    this._show_popup(new_highlight.annotation)
  }else {
    delete this._currentlyHighlightedOverlay
  }
  if(previous_highlight) {
    goog.style.setStyle(previous_highlight.inner, "border-color", "#fff")
  }
};
annotorious.mediatypes.openlayers.Viewer.prototype.addAnnotation = function(annotation) {
  var geometry = annotation.shapes[0].geometry;
  var marker = new OpenLayers.Marker.Box(new OpenLayers.Bounds(geometry.x, geometry.y, geometry.x + geometry.width, geometry.y + geometry.height));
  goog.dom.classes.add(marker.div, "annotorious-ol-boxmarker-outer");
  goog.style.setStyle(marker.div, "border", null);
  var inner = goog.dom.createDom("div", "annotorious-ol-boxmarker-inner");
  goog.style.setSize(inner, "100%", "100%");
  goog.dom.appendChild(marker.div, inner);
  var overlay = {annotation:annotation, marker:marker, inner:inner};
  var self = this;
  goog.events.listen(inner, goog.events.EventType.MOUSEOVER, function(event) {
    if(!self._currentlyHighlightedOverlay) {
      self._updateHighlight(overlay)
    }
    self._lastHoveredOverlay = overlay
  });
  goog.events.listen(inner, goog.events.EventType.MOUSEOUT, function(event) {
    delete self._lastHoveredOverlay;
    self._popup.startHideTimer()
  });
  this._overlays.push(overlay);
  goog.array.sort(this._overlays, function(a, b) {
    var shapeA = a.annotation.shapes[0];
    var shapeB = b.annotation.shapes[0];
    return annotorious.shape.getSize(shapeB) - annotorious.shape.getSize(shapeA)
  });
  var zIndex = 1E4;
  goog.array.forEach(this._overlays, function(overlay) {
    goog.style.setStyle(overlay.marker.div, "z-index", zIndex);
    zIndex++
  });
  this._boxesLayer.addMarker(marker)
};
annotorious.mediatypes.openlayers.Viewer.prototype.removeAnnotation = function(annotation) {
  var overlay = goog.array.find(this._overlays, function(overlay) {
    return overlay.annotation == annotation
  });
  if(overlay) {
    goog.array.remove(this._overlays, overlay);
    this._boxesLayer.removeMarker(overlay.marker)
  }
};
annotorious.mediatypes.openlayers.Viewer.prototype.getAnnotations = function() {
};
annotorious.mediatypes.openlayers.Viewer.prototype.highlightAnnotation = function(opt_annotation) {
  if(opt_annotation) {
  }else {
    this._popup.startHideTimer()
  }
};
goog.provide("annotorious.mediatypes.openlayers.OpenLayersAnnotator");
goog.require("annotorious.mediatypes.Annotator");
goog.require("annotorious.templates.openlayers");
goog.require("annotorious.mediatypes.openlayers.Viewer");
annotorious.mediatypes.openlayers.OpenLayersAnnotator = function(map) {
  annotorious.mediatypes.Annotator.call();
  this._map = map;
  this.element = map.div;
  var pos = goog.style.getStyle(this.element, "position");
  if(pos != "absolute" && pos != "relative") {
    goog.style.setStyle(this.element, "position", "relative")
  }
  this._eventBroker = new annotorious.events.EventBroker;
  this._secondaryHint = goog.soy.renderAsElement(annotorious.templates.openlayers.secondaryHint, {msg:"Click and Drag"});
  goog.style.setStyle(this._secondaryHint, "z-index", 9998);
  goog.style.setOpacity(this._secondaryHint, 0);
  goog.dom.appendChild(this.element, this._secondaryHint);
  this.popup = new annotorious.Popup(this);
  this._viewer = new annotorious.mediatypes.openlayers.Viewer(map, this);
  this._editCanvas = goog.soy.renderAsElement(annotorious.templates.image.canvas, {width:"0", height:"0"});
  goog.style.showElement(this._editCanvas, false);
  goog.style.setStyle(this._editCanvas, "position", "absolute");
  goog.style.setStyle(this._editCanvas, "top", "0px");
  goog.style.setStyle(this._editCanvas, "z-index", 9999);
  goog.dom.appendChild(this.element, this._editCanvas);
  var self = this, updateCanvasSize = function() {
    var width = parseInt(goog.style.getComputedStyle(self.element, "width"), 10), height = parseInt(goog.style.getComputedStyle(self.element, "height"), 10);
    goog.style.setSize(self._editCanvas, width, height);
    self._editCanvas.width = width;
    self._editCanvas.height = height
  };
  updateCanvasSize();
  this._currentSelector = new annotorious.plugins.selection.RectDragSelector;
  this._currentSelector.init(this, this._editCanvas);
  this._stop_selection_callback = undefined;
  this.editor = new annotorious.Editor(this);
  goog.style.setStyle(this.editor.element, "z-index", 1E4);
  if(window.addEventListener) {
    window.addEventListener("resize", updateCanvasSize, false)
  }else {
    if(window.attachEvent) {
      window.attachEvent("onresize", updateCanvasSize)
    }
  }
  goog.events.listen(this.element, goog.events.EventType.MOUSEOVER, function(event) {
    var relatedTarget = event.relatedTarget;
    if(!relatedTarget || !goog.dom.contains(self.element, relatedTarget)) {
      self._eventBroker.fireEvent(annotorious.events.EventType.MOUSE_OVER_ANNOTATABLE_ITEM)
    }
  });
  goog.events.listen(this.element, goog.events.EventType.MOUSEOUT, function(event) {
    var relatedTarget = event.relatedTarget;
    if(!relatedTarget || !goog.dom.contains(self.element, relatedTarget)) {
      self._eventBroker.fireEvent(annotorious.events.EventType.MOUSE_OUT_OF_ANNOTATABLE_ITEM)
    }
  });
  goog.events.listen(this._editCanvas, goog.events.EventType.MOUSEDOWN, function(event) {
    var offset = goog.style.getClientPosition(self.element);
    self._currentSelector.startSelection(event.clientX - offset.x, event.clientY - offset.y)
  });
  this._eventBroker.addHandler(annotorious.events.EventType.SELECTION_COMPLETED, function(event) {
    goog.style.setStyle(self._editCanvas, "pointer-events", "none");
    var bounds = event.viewportBounds;
    self.editor.setPosition(new annotorious.shape.geom.Point(bounds.left, bounds.bottom + 4));
    self.editor.open()
  });
  this._eventBroker.addHandler(annotorious.events.EventType.SELECTION_CANCELED, function(event) {
    self.stopSelection()
  })
};
goog.inherits(annotorious.mediatypes.openlayers.OpenLayersAnnotator, annotorious.mediatypes.Annotator);
annotorious.mediatypes.openlayers.OpenLayersAnnotator.prototype.showSelectionWidget = function() {
};
annotorious.mediatypes.openlayers.OpenLayersAnnotator.prototype.hideSelectionWidget = function() {
};
annotorious.mediatypes.openlayers.OpenLayersAnnotator.prototype.activateSelector = function(callback) {
  goog.style.setStyle(this._editCanvas, "pointer-events", "auto");
  var self = this;
  goog.style.showElement(this._editCanvas, true);
  goog.style.setOpacity(this._secondaryHint, 0.8);
  window.setTimeout(function() {
    goog.style.setOpacity(self._secondaryHint, 0)
  }, 2E3);
  if(callback) {
    this._stop_selection_callback = callback
  }
};
annotorious.mediatypes.openlayers.OpenLayersAnnotator.prototype.destroy = function() {
  this._viewer.destroy();
  goog.dom.removeNode(this._secondaryHint);
  goog.dom.removeNode(this._editCanvas)
};
annotorious.mediatypes.openlayers.OpenLayersAnnotator.prototype.addSelector = function(selector) {
};
annotorious.mediatypes.openlayers.OpenLayersAnnotator.prototype.editAnnotation = function(annotation) {
  this._viewer.removeAnnotation(annotation);
  var selector = this._currentSelector;
  var self = this;
  if(selector) {
    goog.style.showElement(this._editCanvas, true);
    this._viewer.highlightAnnotation(undefined);
    var g2d = this._editCanvas.getContext("2d");
    var shape = annotation.shapes[0];
    var viewportShape = annotorious.shape.transform(shape, function(xy) {
      return self.fromItemCoordinates(xy)
    });
    console.log(viewportShape);
    selector.drawShape(g2d, viewportShape);
    var viewportBounds = annotorious.shape.getBoundingRect(viewportShape).geometry;
    this.editor.setPosition(new annotorious.shape.geom.Point(viewportBounds.x, viewportBounds.y + viewportBounds.height));
    this.editor.open(annotation)
  }
};
annotorious.mediatypes.openlayers.OpenLayersAnnotator.prototype.fromItemCoordinates = function(itemCoords) {
  var pxCoords = this._map.getViewPortPxFromLonLat(new OpenLayers.LonLat(itemCoords.x, itemCoords.y));
  var pxOpposite = itemCoords.width ? this._map.getViewPortPxFromLonLat(new OpenLayers.LonLat(itemCoords.x + itemCoords.width, itemCoords.y + itemCoords.height)) : false;
  if(pxOpposite) {
    return{x:pxCoords.x, y:pxOpposite.y, width:pxOpposite.x - pxCoords.x + 2, height:pxCoords.y - pxOpposite.y + 2}
  }else {
    return{x:pxCoords.x, y:pxCoords.y}
  }
};
annotorious.mediatypes.openlayers.OpenLayersAnnotator.prototype.getAnnotations = function() {
  return this._viewer.getAnnotations()
};
annotorious.mediatypes.openlayers.OpenLayersAnnotator.prototype.getAvailableSelectors = function() {
};
annotorious.mediatypes.openlayers.OpenLayersAnnotator.prototype.getItem = function() {
  return{src:"map://openlayers/something"}
};
annotorious.mediatypes.openlayers.OpenLayersAnnotator.prototype.setActiveSelector = function(selector) {
};
annotorious.mediatypes.openlayers.OpenLayersAnnotator.prototype.toItemCoordinates = function(xy) {
  var itemCoords = this._map.getLonLatFromPixel(new OpenLayers.Pixel(xy.x, xy.y));
  var opposite = xy.width ? new OpenLayers.Pixel(xy.x + xy.width - 2, xy.y + xy.height - 2) : false;
  if(opposite) {
    var itemOpposite = this._map.getLonLatFromPixel(opposite);
    var foo = {x:itemCoords.lon, y:itemOpposite.lat, width:itemOpposite.lon - itemCoords.lon, height:itemCoords.lat - itemOpposite.lat};
    console.log(foo);
    return foo
  }else {
    return{x:itemCoords.lon, y:itemCoords.lat}
  }
};
goog.provide("annotorious.mediatypes.openlayers.OpenLayersModule");
goog.require("annotorious.mediatypes.Module");
goog.require("annotorious.mediatypes.openlayers.OpenLayersAnnotator");
annotorious.mediatypes.openlayers.OpenLayersModule = function() {
  annotorious.mediatypes.Module.call();
  this._initFields()
};
goog.inherits(annotorious.mediatypes.openlayers.OpenLayersModule, annotorious.mediatypes.Module);
annotorious.mediatypes.openlayers.OpenLayersModule.prototype.getItemURL = function(item) {
  return"map://openlayers/something"
};
annotorious.mediatypes.openlayers.OpenLayersModule.prototype.newAnnotator = function(item) {
  return new annotorious.mediatypes.openlayers.OpenLayersAnnotator(item)
};
annotorious.mediatypes.openlayers.OpenLayersModule.prototype.supports = function(item) {
  return item instanceof OpenLayers.Map
};
goog.provide("annotorious.mediatypes.openseadragon.Viewer");
goog.require("goog.events.MouseWheelHandler");
annotorious.mediatypes.openseadragon.Viewer = function(osdViewer, annotator) {
  this._osdViewer = osdViewer;
  this._map_bounds = goog.style.getBounds(osdViewer.element);
  this._popup = annotator.popup;
  goog.style.setStyle(this._popup.element, "z-index", 99E3);
  this._overlays = [];
  this._currentlyHighlightedOverlay;
  this._lastHoveredOverlay;
  var self = this;
  this._osdViewer.addHandler("animation", function() {
    if(self._currentlyHighlightedOverlay) {
      self._place_popup()
    }
  });
  annotator.addHandler(annotorious.events.EventType.BEFORE_POPUP_HIDE, function() {
    if(self._lastHoveredOverlay == self._currentlyHighlightedOverlay) {
      self._popup.clearHideTimer()
    }else {
      self._updateHighlight(self._lastHoveredOverlay, self._currentlyHighlightedOverlay)
    }
  })
};
annotorious.mediatypes.openseadragon.Viewer.prototype._place_popup = function() {
  var viewportEl = this._osdViewer["element"];
  var annotation_div = this._currentlyHighlightedOverlay.outer;
  var annotation_dim = goog.style.getBounds(annotation_div);
  var annotation_pos = goog.style.getRelativePosition(annotation_div, viewportEl);
  var annotation_bounds = {top:annotation_pos.y, left:annotation_pos.x, width:annotation_dim.width, height:annotation_dim.height};
  var popup_bounds = goog.style.getBounds(this._popup.element);
  var popup_pos = {x:annotation_bounds.left, y:annotation_bounds.top + annotation_bounds.height + 12};
  goog.dom.classes.addRemove(this._popup.element, "top-right", "top-left");
  if(!this._osdViewer.isFullPage()) {
    if(annotation_bounds.left + popup_bounds.width > this._map_bounds.width) {
      goog.dom.classes.addRemove(this._popup.element, "top-left", "top-right");
      popup_pos.x = annotation_bounds.left + annotation_bounds.width - popup_bounds.width
    }else {
    }
    if(popup_pos.x < 0) {
      popup_pos.x = 0
    }
    if(popup_pos.x + popup_bounds.width > this._map_bounds.width) {
      popup_pos.x = this._map_bounds.width - popup_bounds.width
    }
    if(popup_pos.y + popup_bounds.height > this._map_bounds.height) {
      popup_pos.y = this._map_bounds.height - popup_bounds.height
    }
  }
  this._popup.setPosition(popup_pos)
};
annotorious.mediatypes.openseadragon.Viewer.prototype._show_popup = function(annotation) {
  this._popup.setAnnotation(annotation);
  this._place_popup();
  this._popup.show()
};
annotorious.mediatypes.openseadragon.Viewer.prototype._updateHighlight = function(new_highlight, previous_highlight) {
  if(new_highlight) {
    goog.style.setStyle(new_highlight.inner, "border-color", "#fff000");
    this._currentlyHighlightedOverlay = new_highlight;
    this._show_popup(new_highlight.annotation)
  }else {
    delete this._currentlyHighlightedOverlay
  }
  if(previous_highlight) {
    goog.style.setStyle(previous_highlight.inner, "border-color", "#fff")
  }
};
annotorious.mediatypes.openseadragon.Viewer.prototype.addAnnotation = function(annotation) {
  var geometry = annotation.shapes[0].geometry;
  var outer = goog.dom.createDom("div", "annotorious-ol-boxmarker-outer");
  var inner = goog.dom.createDom("div", "annotorious-ol-boxmarker-inner");
  goog.style.setSize(inner, "100%", "100%");
  goog.dom.appendChild(outer, inner);
  var rect = new OpenSeadragon.Rect(geometry.x, geometry.y, geometry.width, geometry.height);
  var overlay = {annotation:annotation, outer:outer, inner:inner};
  var self = this;
  goog.events.listen(inner, goog.events.EventType.MOUSEOVER, function(event) {
    if(!self._currentlyHighlightedOverlay) {
      self._updateHighlight(overlay)
    }
    self._lastHoveredOverlay = overlay
  });
  goog.events.listen(inner, goog.events.EventType.MOUSEOUT, function(event) {
    delete self._lastHoveredOverlay;
    self._popup.startHideTimer()
  });
  this._overlays.push(overlay);
  goog.array.sort(this._overlays, function(a, b) {
    var shapeA = a.annotation.shapes[0];
    var shapeB = b.annotation.shapes[0];
    return annotorious.shape.getSize(shapeB) - annotorious.shape.getSize(shapeA)
  });
  var zIndex = 1;
  goog.array.forEach(this._overlays, function(overlay) {
    goog.style.setStyle(overlay.outer, "z-index", zIndex);
    zIndex++
  });
  this._osdViewer.drawer.addOverlay(outer, rect)
};
annotorious.mediatypes.openseadragon.Viewer.prototype.removeAnnotation = function(annotation) {
  var overlay = goog.array.find(this._overlays, function(overlay) {
    return overlay.annotation == annotation
  });
  if(overlay) {
    goog.array.remove(this._overlays, overlay);
    this._osdViewer.drawer.removeOverlay(overlay.outer)
  }
};
annotorious.mediatypes.openseadragon.Viewer.prototype.getAnnotations = function() {
  return goog.array.map(this._overlays, function(overlay) {
    console.log(overlay);
    return overlay.annotation
  })
};
annotorious.mediatypes.openseadragon.Viewer.prototype.highlightAnnotation = function(opt_annotation) {
};
annotorious.mediatypes.openseadragon.Viewer.prototype.destroy = function() {
  var that = this;
  goog.array.forEach(this._overlays, function(overlay) {
    that._osdViewer.removeOverlay(overlay.outer)
  });
  this._overlays = []
};
goog.provide("annotorious.mediatypes.openseadragon.OpenSeadragonAnnotator");
goog.require("annotorious.mediatypes.Annotator");
goog.require("annotorious.mediatypes.openseadragon.Viewer");
annotorious.mediatypes.openseadragon.OpenSeadragonAnnotator = function(osdViewer) {
  annotorious.mediatypes.Annotator.call();
  this.element = osdViewer.element;
  goog.style.setStyle(goog.dom.getElementByClass("openseadragon-container"), "z-index", 0);
  this.editor;
  this._osdViewer = osdViewer;
  this._eventBroker = new annotorious.events.EventBroker;
  this._selectors = [];
  this._currentSelector;
  this._selectionEnabled = true;
  this._secondaryHint = goog.soy.renderAsElement(annotorious.templates.openlayers.secondaryHint, {msg:"Click and Drag"});
  goog.style.setOpacity(this._secondaryHint, 0);
  goog.dom.appendChild(this.element, this._secondaryHint);
  this.popup = new annotorious.Popup(this);
  this._viewer = new annotorious.mediatypes.openseadragon.Viewer(osdViewer, this);
  this._editCanvas = goog.soy.renderAsElement(annotorious.templates.image.canvas, {width:"0", height:"0"});
  goog.style.showElement(this._editCanvas, false);
  goog.dom.appendChild(this.element, this._editCanvas);
  var self = this, updateCanvasSize = function() {
    var width = parseInt(goog.style.getComputedStyle(self.element, "width"), 10), height = parseInt(goog.style.getComputedStyle(self.element, "height"), 10);
    goog.style.setSize(self._editCanvas, width, height);
    self._editCanvas.width = width;
    self._editCanvas.height = height
  };
  updateCanvasSize();
  var default_selector = new annotorious.plugins.selection.RectDragSelector;
  default_selector.init(this, this._editCanvas);
  this._selectors.push(default_selector);
  this._currentSelector = default_selector;
  this.editor = new annotorious.Editor(this);
  this._attachListener(this._editCanvas);
  this._eventBroker.addHandler(annotorious.events.EventType.SELECTION_COMPLETED, function(event) {
    var bounds = event.viewportBounds;
    self.editor.setPosition(new annotorious.shape.geom.Point(bounds.left, bounds.bottom + 4));
    self.editor.open()
  });
  this._eventBroker.addHandler(annotorious.events.EventType.SELECTION_CANCELED, function(event) {
    self.stopSelection()
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
annotorious.mediatypes.openseadragon.OpenSeadragonAnnotator.prototype.activateSelector = function(callback) {
  goog.style.setStyle(this._editCanvas, "pointer-events", "auto");
  var self = this;
  goog.style.showElement(this._editCanvas, true);
  goog.style.setOpacity(this._secondaryHint, 0.8);
  window.setTimeout(function() {
    goog.style.setOpacity(self._secondaryHint, 0)
  }, 2E3);
  if(callback) {
    this._stop_selection_callback = callback
  }
};
annotorious.mediatypes.openseadragon.OpenSeadragonAnnotator.prototype.editAnnotation = function(annotation) {
  this._viewer.removeAnnotation(annotation);
  var selector = this._currentSelector;
  var self = this;
  if(selector) {
    goog.style.showElement(this._editCanvas, true);
    this._viewer.highlightAnnotation(undefined);
    var g2d = this._editCanvas.getContext("2d");
    var shape = annotation.shapes[0];
    var viewportShape = annotorious.shape.transform(shape, function(xy) {
      return self.fromItemCoordinates(xy)
    });
    selector.drawShape(g2d, viewportShape);
    var viewportBounds = annotorious.shape.getBoundingRect(viewportShape).geometry;
    this.editor.setPosition(new annotorious.shape.geom.Point(viewportBounds.x, viewportBounds.y + viewportBounds.height + 4));
    this.editor.open(annotation)
  }
};
annotorious.mediatypes.openseadragon.OpenSeadragonAnnotator.prototype.fromItemCoordinates = function(itemCoords) {
  var offset = annotorious.dom.getOffset(this.element);
  offset.top += window.pageYOffset;
  offset.left += window.pageXOffset;
  var viewportPoint = new OpenSeadragon.Point(itemCoords.x, itemCoords.y);
  var viewportOpposite = itemCoords.width ? new OpenSeadragon.Point(itemCoords.x + itemCoords.width, itemCoords.y + itemCoords.height) : false;
  var windowPoint = this._osdViewer.viewport.viewportToWindowCoordinates(viewportPoint);
  if(viewportOpposite) {
    var windowOpposite = this._osdViewer.viewport.viewportToWindowCoordinates(viewportOpposite);
    return{x:windowPoint.x - offset.left, y:windowPoint.y - offset.top, width:windowOpposite.x - windowPoint.x + 2, height:windowOpposite.y - windowPoint.y + 2}
  }else {
    return windowPoint
  }
};
annotorious.mediatypes.openseadragon.OpenSeadragonAnnotator.prototype.getAnnotations = function() {
  return this._viewer.getAnnotations()
};
annotorious.mediatypes.openseadragon.OpenSeadragonAnnotator.prototype.getAvailableSelectors = function() {
};
annotorious.mediatypes.openseadragon.OpenSeadragonAnnotator.prototype.getItem = function() {
  return{src:"dzi://openseadragon/something"}
};
annotorious.mediatypes.openseadragon.OpenSeadragonAnnotator.prototype.setActiveSelector = function(selector) {
};
annotorious.mediatypes.openseadragon.OpenSeadragonAnnotator.prototype.getActiveSelector = function() {
  return this._currentSelector
};
annotorious.mediatypes.openseadragon.OpenSeadragonAnnotator.prototype.toItemCoordinates = function(xy) {
  var offset = annotorious.dom.getOffset(this.element);
  offset.top += window.pageYOffset;
  offset.left += window.pageXOffset;
  var viewportPoint = new OpenSeadragon.Point(xy.x + offset.left, xy.y + offset.top);
  var viewportOpposite = xy.width ? new OpenSeadragon.Point(xy.x + offset.left + xy.width - 2, xy.y + offset.top + xy.height - 2) : false;
  var viewElementPoint = this._osdViewer.viewport.windowToViewportCoordinates(viewportPoint);
  if(viewportOpposite) {
    var viewElementOpposite = this._osdViewer.viewport.windowToViewportCoordinates(viewportOpposite);
    return{x:viewElementPoint.x, y:viewElementPoint.y, width:viewElementOpposite.x - viewElementPoint.x, height:viewElementOpposite.y - viewElementPoint.y}
  }else {
    return viewElementPoint
  }
};
goog.provide("annotorious.mediatypes.openseadragon.OpenSeadragonModule");
goog.require("annotorious.mediatypes.Module");
goog.require("annotorious.mediatypes.openseadragon.OpenSeadragonAnnotator");
annotorious.mediatypes.openseadragon.OpenSeadragonModule = function() {
  annotorious.mediatypes.Module.call();
  this._initFields()
};
goog.inherits(annotorious.mediatypes.openseadragon.OpenSeadragonModule, annotorious.mediatypes.Module);
annotorious.mediatypes.openseadragon.OpenSeadragonModule.prototype.getItemURL = function(item) {
  return"dzi://openseadragon/something"
};
annotorious.mediatypes.openseadragon.OpenSeadragonModule.prototype.newAnnotator = function(item) {
  return new annotorious.mediatypes.openseadragon.OpenSeadragonAnnotator(item)
};
annotorious.mediatypes.openseadragon.OpenSeadragonModule.prototype.supports = function(item) {
  if(!item.id) {
    return false
  }
  if(item.id.indexOf("openseadragon") != 0) {
    return false
  }
  if(!item.hasOwnProperty("drawer")) {
    return false
  }
  return true
};
goog.require("goog.array");
goog.require("goog.dom");
goog.require("goog.dom.query");
goog.require("annotorious.dom");
goog.require("annotorious.events");
goog.require("annotorious.mediatypes.Module");
goog.require("annotorious.mediatypes.image.ImageModule");
goog.require("annotorious.mediatypes.openlayers.OpenLayersModule");
goog.require("annotorious.mediatypes.openseadragon.OpenSeadragonModule");
goog.require("annotorious.mediatypes.image.Viewer");
annotorious.Annotorious = function() {
  this._isInitialized = false;
  this._modules = [new annotorious.mediatypes.image.ImageModule];
  if(window["OpenLayers"]) {
    this._modules.push(new annotorious.mediatypes.openlayers.OpenLayersModule)
  }
  if(window["OpenSeadragon"]) {
    this._modules.push(new annotorious.mediatypes.openseadragon.OpenSeadragonModule)
  }
  this._plugins = [];
  var self = this;
  annotorious.dom.addOnLoadHandler(function() {
    self._init()
  })
};
annotorious.Annotorious.prototype._init = function() {
  if(this._isInitialized) {
    return
  }
  var self = this;
  goog.array.forEach(this._modules, function(module) {
    module.init()
  });
  goog.array.forEach(this._plugins, function(plugin) {
    if(plugin.initPlugin) {
      plugin.initPlugin(self)
    }
    goog.array.forEach(self._modules, function(module) {
      module.addPlugin(plugin)
    })
  });
  this._isInitialized = true
};
annotorious.Annotorious.prototype._getModuleForItemSrc = function(item_src) {
  return goog.array.find(this._modules, function(module) {
    return module.annotatesItem(item_src)
  })
};
annotorious.Annotorious.prototype.activateSelector = function(opt_item_url_or_callback, opt_callback) {
  var item_url = undefined, callback = undefined;
  if(goog.isString(opt_item_url_or_callback)) {
    item_url = opt_item_url_or_callback;
    callback = opt_callback
  }else {
    if(goog.isFunction(opt_item_url_or_callback)) {
      callback = opt_item_url_or_callback
    }
  }
  if(item_url) {
    var module = this._getModuleForItemSrc(item_url);
    if(module) {
      module.activateSelector(item_url, callback)
    }
  }else {
    goog.array.forEach(this._modules, function(module) {
      module.activateSelector(callback)
    })
  }
};
annotorious.Annotorious.prototype.addAnnotation = function(annotation, opt_replace) {
  annotation.src = annotorious.dom.toAbsoluteURL(annotation.src);
  var module = this._getModuleForItemSrc(annotation.src);
  if(module) {
    module.addAnnotation(annotation, opt_replace)
  }
};
annotorious.Annotorious.prototype.addHandler = function(type, handler) {
  goog.array.forEach(this._modules, function(module) {
    module.addHandler(type, handler)
  })
};
annotorious.Annotorious.prototype.addPlugin = function(plugin_name, opt_config_options) {
  try {
    var plugin = new window["annotorious"]["plugin"][plugin_name](opt_config_options);
    if(document.readyState == "complete") {
      if(plugin.initPlugin) {
        plugin.initPlugin(this)
      }
      goog.array.forEach(this._modules, function(module) {
        module.addPlugin(plugin)
      })
    }else {
      this._plugins.push(plugin)
    }
  }catch(error) {
    console.log("Could not load plugin: " + plugin_name)
  }
};
annotorious.Annotorious.prototype.destroy = function(opt_item_url) {
  if(opt_item_url) {
    var module = this._getModuleForItemSrc(opt_item_url);
    if(module) {
      module.destroy(opt_item_url)
    }
  }else {
    goog.array.forEach(this._modules, function(module) {
      module.destroy()
    })
  }
};
annotorious.Annotorious.prototype.getActiveSelector = function(item_url) {
  var module = this._getModuleForItemSrc(item_url);
  if(module) {
    return module.getActiveSelector(item_url)
  }else {
    return undefined
  }
};
annotorious.Annotorious.prototype.getAnnotations = function(opt_item_url) {
  if(opt_item_url) {
    var module = this._getModuleForItemSrc(opt_item_url);
    if(module) {
      return module.getAnnotations(opt_item_url)
    }else {
      return[]
    }
  }else {
    var annotations = [];
    goog.array.forEach(this._modules, function(module) {
      goog.array.extend(annotations, module.getAnnotations())
    });
    return annotations
  }
};
annotorious.Annotorious.prototype.getAvailableSelectors = function(item_url) {
  var module = this._getModuleForItemSrc(item_url);
  if(module) {
    return module.getAvailableSelectors(item_url)
  }else {
    return[]
  }
};
annotorious.Annotorious.prototype.hideAnnotations = function(opt_item_url) {
  if(opt_item_url) {
    var module = this._getModuleForItemSrc(opt_item_url);
    if(module) {
      module.hideAnnotations(opt_item_url)
    }
  }else {
    goog.array.forEach(this._modules, function(module) {
      module.hideAnnotations()
    })
  }
};
annotorious.Annotorious.prototype.hideSelectionWidget = function(opt_item_url) {
  if(opt_item_url) {
    var module = this._getModuleForItemSrc(opt_item_url);
    if(module) {
      module.hideSelectionWidget(opt_item_url)
    }
  }else {
    goog.array.forEach(this._modules, function(module) {
      module.hideSelectionWidget()
    })
  }
};
annotorious.Annotorious.prototype.highlightAnnotation = function(annotation) {
  if(annotation) {
    var module = this._getModuleForItemSrc(annotation.src);
    if(module) {
      module.highlightAnnotation(annotation)
    }
  }else {
    goog.array.forEach(this._modules, function(module) {
      module.highlightAnnotation()
    })
  }
};
annotorious.Annotorious.prototype.makeAnnotatable = function(item) {
  this._init();
  var module = goog.array.find(this._modules, function(module) {
    return module.supports(item)
  });
  if(module) {
    module.makeAnnotatable(item)
  }else {
    throw"Error: Annotorious does not support this media type in the current version or build configuration.";
  }
};
annotorious.Annotorious.prototype.removeAll = function(opt_item_url) {
  var self = this;
  goog.array.forEach(this.getAnnotations(opt_item_url), function(annotation) {
    self.removeAnnotation(annotation)
  })
};
annotorious.Annotorious.prototype.removeAnnotation = function(annotation) {
  var module = this._getModuleForItemSrc(annotation.src);
  if(module) {
    module.removeAnnotation(annotation)
  }
};
annotorious.Annotorious.prototype.removeCurrentSelection = function(opt_item_url_or_callback) {
  var item_url = undefined;
  if(goog.isString(opt_item_url_or_callback)) {
    item_url = opt_item_url_or_callback
  }
  if(item_url) {
    var module = this._getModuleForItemSrc(item_url);
    if(module) {
      module.removeCurrentSelection(opt_item_url_or_callback)
    }
  }
};
annotorious.Annotorious.prototype.reset = function(annotation) {
  goog.array.forEach(this._modules, function(module) {
    module.destroy();
    module.init()
  })
};
annotorious.Annotorious.prototype.setActiveSelector = function(item_url, selector) {
  var module = this._getModuleForItemSrc(item_url);
  if(module) {
    module.setActiveSelector(item_url, selector)
  }
};
annotorious.Annotorious.prototype.setProperties = function(props) {
  goog.array.forEach(this._modules, function(module) {
    module.setProperties(props)
  })
};
annotorious.Annotorious.prototype.setSelectionEnabled = function(enabled) {
  if(enabled) {
    this.showSelectionWidget(undefined)
  }else {
    this.hideSelectionWidget(undefined)
  }
};
annotorious.Annotorious.prototype.showAnnotations = function(opt_item_url) {
  if(opt_item_url) {
    var module = this._getModuleForItemSrc(opt_item_url);
    if(module) {
      module.showAnnotations(opt_item_url)
    }
  }else {
    goog.array.forEach(this._modules, function(module) {
      module.showAnnotations()
    })
  }
};
annotorious.Annotorious.prototype.showSelectionWidget = function(opt_item_url) {
  if(opt_item_url) {
    var module = this._getModuleForItemSrc(opt_item_url);
    if(module) {
      module.showSelectionWidget(opt_item_url)
    }
  }else {
    goog.array.forEach(this._modules, function(module) {
      module.showSelectionWidget()
    })
  }
};
window["anno"] = new annotorious.Annotorious;
annotorious.Annotorious.prototype["activateSelector"] = annotorious.Annotorious.prototype.activateSelector;
annotorious.Annotorious.prototype["addAnnotation"] = annotorious.Annotorious.prototype.addAnnotation;
annotorious.Annotorious.prototype["addHandler"] = annotorious.Annotorious.prototype.addHandler;
annotorious.Annotorious.prototype["addPlugin"] = annotorious.Annotorious.prototype.addPlugin;
annotorious.Annotorious.prototype["destroy"] = annotorious.Annotorious.prototype.destroy;
annotorious.Annotorious.prototype["getActiveSelector"] = annotorious.Annotorious.prototype.getActiveSelector;
annotorious.Annotorious.prototype["getAnnotations"] = annotorious.Annotorious.prototype.getAnnotations;
annotorious.Annotorious.prototype["getAvailableSelectors"] = annotorious.Annotorious.prototype.getAvailableSelectors;
annotorious.Annotorious.prototype["hideAnnotations"] = annotorious.Annotorious.prototype.hideAnnotations;
annotorious.Annotorious.prototype["hideSelectionWidget"] = annotorious.Annotorious.prototype.hideSelectionWidget;
annotorious.Annotorious.prototype["highlightAnnotation"] = annotorious.Annotorious.prototype.highlightAnnotation;
annotorious.Annotorious.prototype["makeAnnotatable"] = annotorious.Annotorious.prototype.makeAnnotatable;
annotorious.Annotorious.prototype["removeAll"] = annotorious.Annotorious.prototype.removeAll;
annotorious.Annotorious.prototype["removeAnnotation"] = annotorious.Annotorious.prototype.removeAnnotation;
annotorious.Annotorious.prototype["removeCurrentSelection"] = annotorious.Annotorious.prototype.removeCurrentSelection;
annotorious.Annotorious.prototype["reset"] = annotorious.Annotorious.prototype.reset;
annotorious.Annotorious.prototype["setActiveSelector"] = annotorious.Annotorious.prototype.setActiveSelector;
annotorious.Annotorious.prototype["setProperties"] = annotorious.Annotorious.prototype.setProperties;
annotorious.Annotorious.prototype["showAnnotations"] = annotorious.Annotorious.prototype.showAnnotations;
annotorious.Annotorious.prototype["showSelectionWidget"] = annotorious.Annotorious.prototype.showSelectionWidget;
if(!window["annotorious"]) {
  window["annotorious"] = {}
}
if(!window["annotorious"]["plugin"]) {
  window["annotorious"]["plugin"] = {}
}
if(!window["annotorious"]["geometry"]) {
  window["annotorious"]["geometry"] = {};
  window["annotorious"]["geometry"]["expand"] = annotorious.shape.expand;
  window["annotorious"]["geometry"]["getBoundingRect"] = annotorious.shape.getBoundingRect
}
annotorious.Annotorious.prototype["setSelectionEnabled"] = annotorious.Annotorious.prototype.setSelectionEnabled;

