'use strict';
var $jscomp = $jscomp || {};
$jscomp.scope = {};
var COMPILED = !0, goog = goog || {};
goog.global = this;
goog.isDef = function(a) {
  return void 0 !== a;
};
goog.isString = function(a) {
  return "string" == typeof a;
};
goog.isBoolean = function(a) {
  return "boolean" == typeof a;
};
goog.isNumber = function(a) {
  return "number" == typeof a;
};
goog.exportPath_ = function(a, b, c) {
  a = a.split(".");
  c = c || goog.global;
  a[0] in c || "undefined" == typeof c.execScript || c.execScript("var " + a[0]);
  for (var d; a.length && (d = a.shift());) {
    !a.length && goog.isDef(b) ? c[d] = b : c = c[d] && c[d] !== Object.prototype[d] ? c[d] : c[d] = {};
  }
};
goog.define = function(a, b) {
  if (!COMPILED) {
    var c = goog.global.CLOSURE_UNCOMPILED_DEFINES, d = goog.global.CLOSURE_DEFINES;
    c && void 0 === c.nodeType && Object.prototype.hasOwnProperty.call(c, a) ? b = c[a] : d && void 0 === d.nodeType && Object.prototype.hasOwnProperty.call(d, a) && (b = d[a]);
  }
  goog.exportPath_(a, b);
};
goog.DEBUG = "true,goog.dom.ASSUME_STANDARDS_MODE=true";
goog.LOCALE = "en";
goog.TRUSTED_SITE = !0;
goog.STRICT_MODE_COMPATIBLE = !1;
goog.DISALLOW_TEST_ONLY_CODE = COMPILED && !goog.DEBUG;
goog.ENABLE_CHROME_APP_SAFE_SCRIPT_LOADING = !1;
goog.provide = function(a) {
  if (goog.isInModuleLoader_()) {
    throw Error("goog.provide cannot be used within a module.");
  }
  if (!COMPILED && goog.isProvided_(a)) {
    throw Error('Namespace "' + a + '" already declared.');
  }
  goog.constructNamespace_(a);
};
goog.constructNamespace_ = function(a, b) {
  if (!COMPILED) {
    delete goog.implicitNamespaces_[a];
    for (var c = a; (c = c.substring(0, c.lastIndexOf("."))) && !goog.getObjectByName(c);) {
      goog.implicitNamespaces_[c] = !0;
    }
  }
  goog.exportPath_(a, b);
};
goog.getScriptNonce = function() {
  null === goog.cspNonce_ && (goog.cspNonce_ = goog.getScriptNonce_(goog.global.document) || "");
  return goog.cspNonce_;
};
goog.NONCE_PATTERN_ = /^[\w+/_-]+[=]{0,2}$/;
goog.cspNonce_ = null;
goog.getScriptNonce_ = function(a) {
  return (a = a.querySelector("script[nonce]")) && (a = a.nonce || a.getAttribute("nonce")) && goog.NONCE_PATTERN_.test(a) ? a : null;
};
goog.VALID_MODULE_RE_ = /^[a-zA-Z_$][a-zA-Z0-9._$]*$/;
goog.module = function(a) {
  if (!goog.isString(a) || !a || -1 == a.search(goog.VALID_MODULE_RE_)) {
    throw Error("Invalid module identifier");
  }
  if (!goog.isInGoogModuleLoader_()) {
    throw Error("Module " + a + " has been loaded incorrectly. Note, modules cannot be loaded as normal scripts. They require some kind of pre-processing step. You're likely trying to load a module via a script tag or as a part of a concatenated bundle without rewriting the module. For more info see: https://github.com/google/closure-library/wiki/goog.module:-an-ES6-module-like-alternative-to-goog.provide.");
  }
  if (goog.moduleLoaderState_.moduleName) {
    throw Error("goog.module may only be called once per module.");
  }
  goog.moduleLoaderState_.moduleName = a;
  if (!COMPILED) {
    if (goog.isProvided_(a)) {
      throw Error('Namespace "' + a + '" already declared.');
    }
    delete goog.implicitNamespaces_[a];
  }
};
goog.module.get = function(a) {
  return goog.module.getInternal_(a);
};
goog.module.getInternal_ = function(a) {
  if (!COMPILED) {
    if (a in goog.loadedModules_) {
      return goog.loadedModules_[a].exports;
    }
    if (!goog.implicitNamespaces_[a]) {
      return a = goog.getObjectByName(a), null != a ? a : null;
    }
  }
  return null;
};
goog.ModuleType = {ES6:"es6", GOOG:"goog"};
goog.moduleLoaderState_ = null;
goog.isInModuleLoader_ = function() {
  return goog.isInGoogModuleLoader_() || goog.isInEs6ModuleLoader_();
};
goog.isInGoogModuleLoader_ = function() {
  return !!goog.moduleLoaderState_ && goog.moduleLoaderState_.type == goog.ModuleType.GOOG;
};
goog.isInEs6ModuleLoader_ = function() {
  if (goog.moduleLoaderState_ && goog.moduleLoaderState_.type == goog.ModuleType.ES6) {
    return !0;
  }
  var a = goog.global.$jscomp;
  return a ? "function" != typeof a.getCurrentModulePath ? !1 : !!a.getCurrentModulePath() : !1;
};
goog.module.declareLegacyNamespace = function() {
  if (!COMPILED && !goog.isInGoogModuleLoader_()) {
    throw Error("goog.module.declareLegacyNamespace must be called from within a goog.module");
  }
  if (!COMPILED && !goog.moduleLoaderState_.moduleName) {
    throw Error("goog.module must be called prior to goog.module.declareLegacyNamespace.");
  }
  goog.moduleLoaderState_.declareLegacyNamespace = !0;
};
goog.module.declareNamespace = function(a) {
  if (!COMPILED) {
    if (!goog.isInEs6ModuleLoader_()) {
      throw Error("goog.module.declareNamespace may only be called from within an ES6 module");
    }
    if (goog.moduleLoaderState_ && goog.moduleLoaderState_.moduleName) {
      throw Error("goog.module.declareNamespace may only be called once per module.");
    }
    if (a in goog.loadedModules_) {
      throw Error('Module with namespace "' + a + '" already exists.');
    }
  }
  if (goog.moduleLoaderState_) {
    goog.moduleLoaderState_.moduleName = a;
  } else {
    var b = goog.global.$jscomp;
    if (!b || "function" != typeof b.getCurrentModulePath) {
      throw Error('Module with namespace "' + a + '" has been loaded incorrectly.');
    }
    b = b.require(b.getCurrentModulePath());
    goog.loadedModules_[a] = {exports:b, type:goog.ModuleType.ES6, moduleId:a};
  }
};
goog.setTestOnly = function(a) {
  if (goog.DISALLOW_TEST_ONLY_CODE) {
    throw a = a || "", Error("Importing test-only code into non-debug environment" + (a ? ": " + a : "."));
  }
};
goog.forwardDeclare = function(a) {
};
COMPILED || (goog.isProvided_ = function(a) {
  return a in goog.loadedModules_ || !goog.implicitNamespaces_[a] && goog.isDefAndNotNull(goog.getObjectByName(a));
}, goog.implicitNamespaces_ = {"goog.module":!0});
goog.getObjectByName = function(a, b) {
  a = a.split(".");
  b = b || goog.global;
  for (var c = 0; c < a.length; c++) {
    if (b = b[a[c]], !goog.isDefAndNotNull(b)) {
      return null;
    }
  }
  return b;
};
goog.globalize = function(a, b) {
  b = b || goog.global;
  for (var c in a) {
    b[c] = a[c];
  }
};
goog.addDependency = function(a, b, c, d) {
  !COMPILED && goog.DEPENDENCIES_ENABLED && goog.debugLoader_.addDependency(a, b, c, d);
};
goog.ENABLE_DEBUG_LOADER = !0;
goog.logToConsole_ = function(a) {
  goog.global.console && goog.global.console.error(a);
};
goog.require = function(a) {
  if (!COMPILED) {
    goog.ENABLE_DEBUG_LOADER && goog.debugLoader_.requested(a);
    if (goog.isProvided_(a)) {
      if (goog.isInModuleLoader_()) {
        return goog.module.getInternal_(a);
      }
    } else {
      if (goog.ENABLE_DEBUG_LOADER) {
        var b = goog.moduleLoaderState_;
        goog.moduleLoaderState_ = null;
        try {
          goog.debugLoader_.load_(a);
        } finally {
          goog.moduleLoaderState_ = b;
        }
      }
    }
    return null;
  }
};
goog.basePath = "";
goog.nullFunction = function() {
};
goog.abstractMethod = function() {
  throw Error("unimplemented abstract method");
};
goog.addSingletonGetter = function(a) {
  a.instance_ = void 0;
  a.getInstance = function() {
    if (a.instance_) {
      return a.instance_;
    }
    goog.DEBUG && (goog.instantiatedSingletons_[goog.instantiatedSingletons_.length] = a);
    return a.instance_ = new a;
  };
};
goog.instantiatedSingletons_ = [];
goog.LOAD_MODULE_USING_EVAL = !0;
goog.SEAL_MODULE_EXPORTS = goog.DEBUG;
goog.loadedModules_ = {};
goog.DEPENDENCIES_ENABLED = !COMPILED && goog.ENABLE_DEBUG_LOADER;
goog.TRANSPILE = "detect";
goog.TRANSPILER = "transpile.js";
goog.hasBadLetScoping = null;
goog.useSafari10Workaround = function() {
  if (null == goog.hasBadLetScoping) {
    try {
      var a = !eval('"use strict";let x = 1; function f() { return typeof x; };f() == "number";');
    } catch (b) {
      a = !1;
    }
    goog.hasBadLetScoping = a;
  }
  return goog.hasBadLetScoping;
};
goog.workaroundSafari10EvalBug = function(a) {
  return "(function(){" + a + "\n;})();\n";
};
goog.loadModule = function(a) {
  var b = goog.moduleLoaderState_;
  try {
    goog.moduleLoaderState_ = {moduleName:"", declareLegacyNamespace:!1, type:goog.ModuleType.GOOG};
    if (goog.isFunction(a)) {
      var c = a.call(void 0, {});
    } else {
      if (goog.isString(a)) {
        goog.useSafari10Workaround() && (a = goog.workaroundSafari10EvalBug(a)), c = goog.loadModuleFromSource_.call(void 0, a);
      } else {
        throw Error("Invalid module definition");
      }
    }
    var d = goog.moduleLoaderState_.moduleName;
    if (goog.isString(d) && d) {
      goog.moduleLoaderState_.declareLegacyNamespace ? goog.constructNamespace_(d, c) : goog.SEAL_MODULE_EXPORTS && Object.seal && "object" == typeof c && null != c && Object.seal(c), goog.loadedModules_[d] = {exports:c, type:goog.ModuleType.GOOG, moduleId:goog.moduleLoaderState_.moduleName};
    } else {
      throw Error('Invalid module name "' + d + '"');
    }
  } finally {
    goog.moduleLoaderState_ = b;
  }
};
goog.loadModuleFromSource_ = function(a) {
  eval(a);
  return {};
};
goog.normalizePath_ = function(a) {
  a = a.split("/");
  for (var b = 0; b < a.length;) {
    "." == a[b] ? a.splice(b, 1) : b && ".." == a[b] && a[b - 1] && ".." != a[b - 1] ? a.splice(--b, 2) : b++;
  }
  return a.join("/");
};
goog.loadFileSync_ = function(a) {
  if (goog.global.CLOSURE_LOAD_FILE_SYNC) {
    return goog.global.CLOSURE_LOAD_FILE_SYNC(a);
  }
  try {
    var b = new goog.global.XMLHttpRequest;
    b.open("get", a, !1);
    b.send();
    return 0 == b.status || 200 == b.status ? b.responseText : null;
  } catch (c) {
    return null;
  }
};
goog.transpile_ = function(a, b) {
  var c = goog.global.$jscomp;
  c || (goog.global.$jscomp = c = {});
  var d = c.transpile;
  if (!d) {
    var e = goog.basePath + goog.TRANSPILER, f = goog.loadFileSync_(e);
    if (f) {
      (function() {
        eval(f + "\n//# sourceURL=" + e);
      }).call(goog.global);
      if (goog.global.$gwtExport && goog.global.$gwtExport.$jscomp && !goog.global.$gwtExport.$jscomp.transpile) {
        throw Error('The transpiler did not properly export the "transpile" method. $gwtExport: ' + JSON.stringify(goog.global.$gwtExport));
      }
      goog.global.$jscomp.transpile = goog.global.$gwtExport.$jscomp.transpile;
      c = goog.global.$jscomp;
      d = c.transpile;
    }
  }
  d || (d = c.transpile = function(a, b) {
    goog.logToConsole_(b + " requires transpilation but no transpiler was found.");
    return a;
  });
  return d(a, b);
};
goog.typeOf = function(a) {
  var b = typeof a;
  if ("object" == b) {
    if (a) {
      if (a instanceof Array) {
        return "array";
      }
      if (a instanceof Object) {
        return b;
      }
      var c = Object.prototype.toString.call(a);
      if ("[object Window]" == c) {
        return "object";
      }
      if ("[object Array]" == c || "number" == typeof a.length && "undefined" != typeof a.splice && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("splice")) {
        return "array";
      }
      if ("[object Function]" == c || "undefined" != typeof a.call && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("call")) {
        return "function";
      }
    } else {
      return "null";
    }
  } else {
    if ("function" == b && "undefined" == typeof a.call) {
      return "object";
    }
  }
  return b;
};
goog.isNull = function(a) {
  return null === a;
};
goog.isDefAndNotNull = function(a) {
  return null != a;
};
goog.isArray = function(a) {
  return "array" == goog.typeOf(a);
};
goog.isArrayLike = function(a) {
  var b = goog.typeOf(a);
  return "array" == b || "object" == b && "number" == typeof a.length;
};
goog.isDateLike = function(a) {
  return goog.isObject(a) && "function" == typeof a.getFullYear;
};
goog.isFunction = function(a) {
  return "function" == goog.typeOf(a);
};
goog.isObject = function(a) {
  var b = typeof a;
  return "object" == b && null != a || "function" == b;
};
goog.getUid = function(a) {
  return a[goog.UID_PROPERTY_] || (a[goog.UID_PROPERTY_] = ++goog.uidCounter_);
};
goog.hasUid = function(a) {
  return !!a[goog.UID_PROPERTY_];
};
goog.removeUid = function(a) {
  null !== a && "removeAttribute" in a && a.removeAttribute(goog.UID_PROPERTY_);
  try {
    delete a[goog.UID_PROPERTY_];
  } catch (b) {
  }
};
goog.UID_PROPERTY_ = "closure_uid_" + (1e9 * Math.random() >>> 0);
goog.uidCounter_ = 0;
goog.getHashCode = goog.getUid;
goog.removeHashCode = goog.removeUid;
goog.cloneObject = function(a) {
  var b = goog.typeOf(a);
  if ("object" == b || "array" == b) {
    if ("function" === typeof a.clone) {
      return a.clone();
    }
    b = "array" == b ? [] : {};
    for (var c in a) {
      b[c] = goog.cloneObject(a[c]);
    }
    return b;
  }
  return a;
};
goog.bindNative_ = function(a, b, c) {
  return a.call.apply(a.bind, arguments);
};
goog.bindJs_ = function(a, b, c) {
  if (!a) {
    throw Error();
  }
  if (2 < arguments.length) {
    var d = Array.prototype.slice.call(arguments, 2);
    return function() {
      var c = Array.prototype.slice.call(arguments);
      Array.prototype.unshift.apply(c, d);
      return a.apply(b, c);
    };
  }
  return function() {
    return a.apply(b, arguments);
  };
};
goog.bind = function(a, b, c) {
  Function.prototype.bind && -1 != Function.prototype.bind.toString().indexOf("native code") ? goog.bind = goog.bindNative_ : goog.bind = goog.bindJs_;
  return goog.bind.apply(null, arguments);
};
goog.partial = function(a, b) {
  var c = Array.prototype.slice.call(arguments, 1);
  return function() {
    var b = c.slice();
    b.push.apply(b, arguments);
    return a.apply(this, b);
  };
};
goog.mixin = function(a, b) {
  for (var c in b) {
    a[c] = b[c];
  }
};
goog.now = goog.TRUSTED_SITE && Date.now || function() {
  return +new Date;
};
goog.globalEval = function(a) {
  if (goog.global.execScript) {
    goog.global.execScript(a, "JavaScript");
  } else {
    if (goog.global.eval) {
      if (null == goog.evalWorksForGlobals_) {
        try {
          goog.global.eval("var _evalTest_ = 1;");
        } catch (d) {
        }
        if ("undefined" != typeof goog.global._evalTest_) {
          try {
            delete goog.global._evalTest_;
          } catch (d) {
          }
          goog.evalWorksForGlobals_ = !0;
        } else {
          goog.evalWorksForGlobals_ = !1;
        }
      }
      if (goog.evalWorksForGlobals_) {
        goog.global.eval(a);
      } else {
        var b = goog.global.document, c = b.createElement("SCRIPT");
        c.type = "text/javascript";
        c.defer = !1;
        c.appendChild(b.createTextNode(a));
        b.head.appendChild(c);
        b.head.removeChild(c);
      }
    } else {
      throw Error("goog.globalEval not available");
    }
  }
};
goog.evalWorksForGlobals_ = null;
goog.getCssName = function(a, b) {
  if ("." == String(a).charAt(0)) {
    throw Error('className passed in goog.getCssName must not start with ".". You passed: ' + a);
  }
  var c = function(a) {
    return goog.cssNameMapping_[a] || a;
  }, d = function(a) {
    a = a.split("-");
    for (var b = [], d = 0; d < a.length; d++) {
      b.push(c(a[d]));
    }
    return b.join("-");
  };
  d = goog.cssNameMapping_ ? "BY_WHOLE" == goog.cssNameMappingStyle_ ? c : d : function(a) {
    return a;
  };
  a = b ? a + "-" + d(b) : d(a);
  return goog.global.CLOSURE_CSS_NAME_MAP_FN ? goog.global.CLOSURE_CSS_NAME_MAP_FN(a) : a;
};
goog.setCssNameMapping = function(a, b) {
  goog.cssNameMapping_ = a;
  goog.cssNameMappingStyle_ = b;
};
!COMPILED && goog.global.CLOSURE_CSS_NAME_MAPPING && (goog.cssNameMapping_ = goog.global.CLOSURE_CSS_NAME_MAPPING);
goog.getMsg = function(a, b) {
  b && (a = a.replace(/\{\$([^}]+)}/g, function(a, d) {
    return null != b && d in b ? b[d] : a;
  }));
  return a;
};
goog.getMsgWithFallback = function(a, b) {
  return a;
};
goog.exportSymbol = function(a, b, c) {
  goog.exportPath_(a, b, c);
};
goog.exportProperty = function(a, b, c) {
  a[b] = c;
};
goog.inherits = function(a, b) {
  function c() {
  }
  c.prototype = b.prototype;
  a.superClass_ = b.prototype;
  a.prototype = new c;
  a.prototype.constructor = a;
  a.base = function(a, c, f) {
    for (var d = Array(arguments.length - 2), e = 2; e < arguments.length; e++) {
      d[e - 2] = arguments[e];
    }
    return b.prototype[c].apply(a, d);
  };
};
goog.base = function(a, b, c) {
  var d = arguments.callee.caller;
  if (goog.STRICT_MODE_COMPATIBLE || goog.DEBUG && !d) {
    throw Error("arguments.caller not defined.  goog.base() cannot be used with strict mode code. See http://www.ecma-international.org/ecma-262/5.1/#sec-C");
  }
  if ("undefined" !== typeof d.superClass_) {
    for (var e = Array(arguments.length - 1), f = 1; f < arguments.length; f++) {
      e[f - 1] = arguments[f];
    }
    return d.superClass_.constructor.apply(a, e);
  }
  if ("string" != typeof b && "symbol" != typeof b) {
    throw Error("method names provided to goog.base must be a string or a symbol");
  }
  e = Array(arguments.length - 2);
  for (f = 2; f < arguments.length; f++) {
    e[f - 2] = arguments[f];
  }
  f = !1;
  for (var g = a.constructor; g; g = g.superClass_ && g.superClass_.constructor) {
    if (g.prototype[b] === d) {
      f = !0;
    } else {
      if (f) {
        return g.prototype[b].apply(a, e);
      }
    }
  }
  if (a[b] === d) {
    return a.constructor.prototype[b].apply(a, e);
  }
  throw Error("goog.base called from a method of one name to a method of a different name");
};
goog.scope = function(a) {
  if (goog.isInModuleLoader_()) {
    throw Error("goog.scope is not supported within a module.");
  }
  a.call(goog.global);
};
COMPILED || (goog.global.COMPILED = COMPILED);
goog.defineClass = function(a, b) {
  var c = b.constructor, d = b.statics;
  c && c != Object.prototype.constructor || (c = function() {
    throw Error("cannot instantiate an interface (no constructor defined).");
  });
  c = goog.defineClass.createSealingConstructor_(c, a);
  a && goog.inherits(c, a);
  delete b.constructor;
  delete b.statics;
  goog.defineClass.applyProperties_(c.prototype, b);
  null != d && (d instanceof Function ? d(c) : goog.defineClass.applyProperties_(c, d));
  return c;
};
goog.defineClass.SEAL_CLASS_INSTANCES = goog.DEBUG;
goog.defineClass.createSealingConstructor_ = function(a, b) {
  if (!goog.defineClass.SEAL_CLASS_INSTANCES) {
    return a;
  }
  var c = !goog.defineClass.isUnsealable_(b), d = function() {
    var b = a.apply(this, arguments) || this;
    b[goog.UID_PROPERTY_] = b[goog.UID_PROPERTY_];
    this.constructor === d && c && Object.seal instanceof Function && Object.seal(b);
    return b;
  };
  return d;
};
goog.defineClass.isUnsealable_ = function(a) {
  return a && a.prototype && a.prototype[goog.UNSEALABLE_CONSTRUCTOR_PROPERTY_];
};
goog.defineClass.OBJECT_PROTOTYPE_FIELDS_ = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");
goog.defineClass.applyProperties_ = function(a, b) {
  for (var c in b) {
    Object.prototype.hasOwnProperty.call(b, c) && (a[c] = b[c]);
  }
  for (var d = 0; d < goog.defineClass.OBJECT_PROTOTYPE_FIELDS_.length; d++) {
    c = goog.defineClass.OBJECT_PROTOTYPE_FIELDS_[d], Object.prototype.hasOwnProperty.call(b, c) && (a[c] = b[c]);
  }
};
goog.tagUnsealableClass = function(a) {
  !COMPILED && goog.defineClass.SEAL_CLASS_INSTANCES && (a.prototype[goog.UNSEALABLE_CONSTRUCTOR_PROPERTY_] = !0);
};
goog.UNSEALABLE_CONSTRUCTOR_PROPERTY_ = "goog_defineClass_legacy_unsealable";
!COMPILED && goog.DEPENDENCIES_ENABLED && (goog.inHtmlDocument_ = function() {
  var a = goog.global.document;
  return null != a && "write" in a;
}, goog.isDocumentLoading_ = function() {
  var a = goog.global.document;
  return a.attachEvent ? "complete" != a.readyState : "loading" == a.readyState;
}, goog.findBasePath_ = function() {
  if (goog.isDef(goog.global.CLOSURE_BASE_PATH) && goog.isString(goog.global.CLOSURE_BASE_PATH)) {
    goog.basePath = goog.global.CLOSURE_BASE_PATH;
  } else {
    if (goog.inHtmlDocument_()) {
      var a = goog.global.document, b = a.currentScript;
      a = b ? [b] : a.getElementsByTagName("SCRIPT");
      for (b = a.length - 1; 0 <= b; --b) {
        var c = a[b].src, d = c.lastIndexOf("?");
        d = -1 == d ? c.length : d;
        if ("base.js" == c.substr(d - 7, 7)) {
          goog.basePath = c.substr(0, d - 7);
          break;
        }
      }
    }
  }
}, goog.findBasePath_(), goog.Transpiler = function() {
  this.requiresTranspilation_ = null;
}, goog.Transpiler.prototype.createRequiresTranspilation_ = function() {
  function a(a, b) {
    d ? c[a] = !0 : b() ? c[a] = !1 : d = c[a] = !0;
  }
  function b(a) {
    try {
      return !!eval(a);
    } catch (g) {
      return !1;
    }
  }
  var c = {es3:!1}, d = !1, e = goog.global.navigator && goog.global.navigator.userAgent ? goog.global.navigator.userAgent : "";
  a("es5", function() {
    return b("[1,].length==1");
  });
  a("es6", function() {
    var a = e.match(/Edge\/(\d+)(\.\d)*/i);
    return a && 15 > Number(a[1]) ? !1 : b('(()=>{"use strict";class X{constructor(){if(new.target!=String)throw 1;this.x=42}}let q=Reflect.construct(X,[],String);if(q.x!=42||!(q instanceof String))throw 1;for(const a of[2,3]){if(a==2)continue;function f(z={a}){let a=0;return z.a}{function f(){return 0;}}return f()==3}})()');
  });
  a("es6-impl", function() {
    return !0;
  });
  a("es7", function() {
    return b("2 ** 2 == 4");
  });
  a("es8", function() {
    return b("async () => 1, true");
  });
  a("es9", function() {
    return b("({...rest} = {}), true");
  });
  a("es_next", function() {
    return !1;
  });
  return c;
}, goog.Transpiler.prototype.needsTranspile = function(a, b) {
  if ("always" == goog.TRANSPILE) {
    return !0;
  }
  if ("never" == goog.TRANSPILE) {
    return !1;
  }
  this.requiresTranspilation_ || (this.requiresTranspilation_ = this.createRequiresTranspilation_());
  if (a in this.requiresTranspilation_) {
    return this.requiresTranspilation_[a] ? !0 : !goog.inHtmlDocument_() || "es6" != b || "noModule" in goog.global.document.createElement("script") ? !1 : !0;
  }
  throw Error("Unknown language mode: " + a);
}, goog.Transpiler.prototype.transpile = function(a, b) {
  return goog.transpile_(a, b);
}, goog.transpiler_ = new goog.Transpiler, goog.protectScriptTag_ = function(a) {
  return a.replace(/<\/(SCRIPT)/ig, "\\x3c/$1");
}, goog.DebugLoader_ = function() {
  this.dependencies_ = {};
  this.idToPath_ = {};
  this.written_ = {};
  this.loadingDeps_ = [];
  this.depsToLoad_ = [];
  this.paused_ = !1;
  this.factory_ = new goog.DependencyFactory(goog.transpiler_);
  this.deferredCallbacks_ = {};
  this.deferredQueue_ = [];
}, goog.DebugLoader_.prototype.bootstrap = function(a, b) {
  function c() {
    d && (goog.global.setTimeout(d, 0), d = null);
  }
  var d = b;
  if (a.length) {
    b = [];
    for (var e = 0; e < a.length; e++) {
      var f = this.getPathFromDeps_(a[e]);
      if (!f) {
        throw Error("Unregonized namespace: " + a[e]);
      }
      b.push(this.dependencies_[f]);
    }
    f = goog.require;
    var g = 0;
    for (e = 0; e < a.length; e++) {
      f(a[e]), b[e].onLoad(function() {
        ++g == a.length && c();
      });
    }
  } else {
    c();
  }
}, goog.DebugLoader_.prototype.loadClosureDeps = function() {
  this.depsToLoad_.push(this.factory_.createDependency(goog.normalizePath_(goog.basePath + "deps.js"), "deps.js", [], [], {}, !1));
  this.loadDeps_();
}, goog.DebugLoader_.prototype.requested = function(a, b) {
  (a = this.getPathFromDeps_(a)) && (b || this.areDepsLoaded_(this.dependencies_[a].requires)) && (b = this.deferredCallbacks_[a]) && (delete this.deferredCallbacks_[a], b());
}, goog.DebugLoader_.prototype.setDependencyFactory = function(a) {
  this.factory_ = a;
}, goog.DebugLoader_.prototype.load_ = function(a) {
  if (this.getPathFromDeps_(a)) {
    var b = this, c = [], d = function(a) {
      var e = b.getPathFromDeps_(a);
      if (!e) {
        throw Error("Bad dependency path or symbol: " + a);
      }
      if (!b.written_[e]) {
        b.written_[e] = !0;
        a = b.dependencies_[e];
        for (e = 0; e < a.requires.length; e++) {
          goog.isProvided_(a.requires[e]) || d(a.requires[e]);
        }
        c.push(a);
      }
    };
    d(a);
    a = !!this.depsToLoad_.length;
    this.depsToLoad_ = this.depsToLoad_.concat(c);
    this.paused_ || a || this.loadDeps_();
  } else {
    throw a = "goog.require could not find: " + a, goog.logToConsole_(a), Error(a);
  }
}, goog.DebugLoader_.prototype.loadDeps_ = function() {
  for (var a = this, b = this.paused_; this.depsToLoad_.length && !b;) {
    (function() {
      var c = !1, d = a.depsToLoad_.shift(), e = !1;
      a.loading_(d);
      var f = {pause:function() {
        if (c) {
          throw Error("Cannot call pause after the call to load.");
        }
        b = !0;
      }, resume:function() {
        c ? a.resume_() : b = !1;
      }, loaded:function() {
        if (e) {
          throw Error("Double call to loaded.");
        }
        e = !0;
        a.loaded_(d);
      }, pending:function() {
        for (var b = [], c = 0; c < a.loadingDeps_.length; c++) {
          b.push(a.loadingDeps_[c]);
        }
        return b;
      }, setModuleState:function(a) {
        goog.moduleLoaderState_ = {type:a, moduleName:"", declareLegacyNamespace:!1};
      }, registerEs6ModuleExports:function(a, b, c) {
        c && (goog.loadedModules_[c] = {exports:b, type:goog.ModuleType.ES6, moduleId:c || ""});
      }, registerGoogModuleExports:function(a, b) {
        goog.loadedModules_[a] = {exports:b, type:goog.ModuleType.GOOG, moduleId:a};
      }, clearModuleState:function() {
        goog.moduleLoaderState_ = null;
      }, defer:function(b) {
        if (c) {
          throw Error("Cannot register with defer after the call to load.");
        }
        a.defer_(d, b);
      }, areDepsLoaded:function() {
        return a.areDepsLoaded_(d.requires);
      }};
      try {
        d.load(f);
      } finally {
        c = !0;
      }
    })();
  }
  b && this.pause_();
}, goog.DebugLoader_.prototype.pause_ = function() {
  this.paused_ = !0;
}, goog.DebugLoader_.prototype.resume_ = function() {
  this.paused_ && (this.paused_ = !1, this.loadDeps_());
}, goog.DebugLoader_.prototype.loading_ = function(a) {
  this.loadingDeps_.push(a);
}, goog.DebugLoader_.prototype.loaded_ = function(a) {
  for (var b = 0; b < this.loadingDeps_.length; b++) {
    if (this.loadingDeps_[b] == a) {
      this.loadingDeps_.splice(b, 1);
      break;
    }
  }
  for (b = 0; b < this.deferredQueue_.length; b++) {
    if (this.deferredQueue_[b] == a.path) {
      this.deferredQueue_.splice(b, 1);
      break;
    }
  }
  if (this.loadingDeps_.length == this.deferredQueue_.length && !this.depsToLoad_.length) {
    for (; this.deferredQueue_.length;) {
      this.requested(this.deferredQueue_.shift(), !0);
    }
  }
  a.loaded();
}, goog.DebugLoader_.prototype.areDepsLoaded_ = function(a) {
  for (var b = 0; b < a.length; b++) {
    var c = this.getPathFromDeps_(a[b]);
    if (!c || !(c in this.deferredCallbacks_ || goog.isProvided_(a[b]))) {
      return !1;
    }
  }
  return !0;
}, goog.DebugLoader_.prototype.getPathFromDeps_ = function(a) {
  return a in this.idToPath_ ? this.idToPath_[a] : a in this.dependencies_ ? a : null;
}, goog.DebugLoader_.prototype.defer_ = function(a, b) {
  this.deferredCallbacks_[a.path] = b;
  this.deferredQueue_.push(a.path);
}, goog.LoadController = function() {
}, goog.LoadController.prototype.pause = function() {
}, goog.LoadController.prototype.resume = function() {
}, goog.LoadController.prototype.loaded = function() {
}, goog.LoadController.prototype.pending = function() {
}, goog.LoadController.prototype.registerEs6ModuleExports = function(a, b, c) {
}, goog.LoadController.prototype.setModuleState = function(a) {
}, goog.LoadController.prototype.clearModuleState = function() {
}, goog.LoadController.prototype.defer = function(a) {
}, goog.LoadController.prototype.areDepsLoaded = function() {
}, goog.Dependency = function(a, b, c, d, e) {
  this.path = a;
  this.relativePath = b;
  this.provides = c;
  this.requires = d;
  this.loadFlags = e;
  this.loaded_ = !1;
  this.loadCallbacks_ = [];
}, goog.Dependency.prototype.onLoad = function(a) {
  this.loaded_ ? a() : this.loadCallbacks_.push(a);
}, goog.Dependency.prototype.loaded = function() {
  this.loaded_ = !0;
  var a = this.loadCallbacks_;
  this.loadCallbacks_ = [];
  for (var b = 0; b < a.length; b++) {
    a[b]();
  }
}, goog.Dependency.defer_ = !1, goog.Dependency.callbackMap_ = {}, goog.Dependency.registerCallback_ = function(a) {
  var b = Math.random().toString(32);
  goog.Dependency.callbackMap_[b] = a;
  return b;
}, goog.Dependency.unregisterCallback_ = function(a) {
  delete goog.Dependency.callbackMap_[a];
}, goog.Dependency.callback_ = function(a, b) {
  if (a in goog.Dependency.callbackMap_) {
    for (var c = goog.Dependency.callbackMap_[a], d = [], e = 1; e < arguments.length; e++) {
      d.push(arguments[e]);
    }
    c.apply(void 0, d);
  } else {
    throw Error("Callback key " + a + " does not exist (was base.js loaded more than once?).");
  }
}, goog.Dependency.prototype.load = function(a) {
  if (goog.global.CLOSURE_IMPORT_SCRIPT) {
    goog.global.CLOSURE_IMPORT_SCRIPT(this.path) ? a.loaded() : a.pause();
  } else {
    if (goog.inHtmlDocument_()) {
      var b = goog.global.document;
      if ("complete" == b.readyState && !goog.ENABLE_CHROME_APP_SAFE_SCRIPT_LOADING) {
        if (/\bdeps.js$/.test(this.path)) {
          a.loaded();
          return;
        }
        throw Error('Cannot write "' + this.path + '" after document load');
      }
      if (!goog.ENABLE_CHROME_APP_SAFE_SCRIPT_LOADING && goog.isDocumentLoading_()) {
        var c = goog.Dependency.registerCallback_(function(b) {
          goog.DebugLoader_.IS_OLD_IE_ && "complete" != b.readyState || (goog.Dependency.unregisterCallback_(c), a.loaded());
        }), d = !goog.DebugLoader_.IS_OLD_IE_ && goog.getScriptNonce() ? ' nonce="' + goog.getScriptNonce() + '"' : "";
        b.write('<script src="' + this.path + '" ' + (goog.DebugLoader_.IS_OLD_IE_ ? "onreadystatechange" : "onload") + "=\"goog.Dependency.callback_('" + c + '\', this)" type="text/javascript" ' + (goog.Dependency.defer_ ? "defer" : "") + d + ">\x3c/script>");
      } else {
        var e = b.createElement("script");
        e.defer = goog.Dependency.defer_;
        e.async = !1;
        e.type = "text/javascript";
        (d = goog.getScriptNonce()) && e.setAttribute("nonce", d);
        goog.DebugLoader_.IS_OLD_IE_ ? (a.pause(), e.onreadystatechange = function() {
          if ("loaded" == e.readyState || "complete" == e.readyState) {
            a.loaded(), a.resume();
          }
        }) : e.onload = function() {
          e.onload = null;
          a.loaded();
        };
        e.src = this.path;
        b.head.appendChild(e);
      }
    } else {
      goog.logToConsole_("Cannot use default debug loader outside of HTML documents."), "deps.js" == this.relativePath ? (goog.logToConsole_("Consider setting CLOSURE_IMPORT_SCRIPT before loading base.js, or seting CLOSURE_NO_DEPS to true."), a.loaded()) : a.pause();
    }
  }
}, goog.Es6ModuleDependency = function(a, b, c, d, e) {
  goog.Dependency.call(this, a, b, c, d, e);
}, goog.inherits(goog.Es6ModuleDependency, goog.Dependency), goog.Es6ModuleDependency.prototype.load = function(a) {
  function b(a, b) {
    b ? d.write('<script type="module" crossorigin>' + b + "\x3c/script>") : d.write('<script type="module" crossorigin src="' + a + '">\x3c/script>');
  }
  function c(a, b) {
    var c = d.createElement("script");
    c.defer = !0;
    c.async = !1;
    c.type = "module";
    c.setAttribute("crossorigin", !0);
    var e = goog.getScriptNonce();
    e && c.setAttribute("nonce", e);
    b ? c.textContent = b : c.src = a;
    d.head.appendChild(c);
  }
  if (goog.global.CLOSURE_IMPORT_SCRIPT) {
    goog.global.CLOSURE_IMPORT_SCRIPT(this.path) ? a.loaded() : a.pause();
  } else {
    if (goog.inHtmlDocument_()) {
      var d = goog.global.document, e = this;
      if (goog.isDocumentLoading_()) {
        var f = b;
        goog.Dependency.defer_ = !0;
      } else {
        f = c;
      }
      var g = goog.Dependency.registerCallback_(function() {
        goog.Dependency.unregisterCallback_(g);
        a.setModuleState(goog.ModuleType.ES6);
      });
      f(void 0, 'goog.Dependency.callback_("' + g + '")');
      f(this.path, void 0);
      var h = goog.Dependency.registerCallback_(function(b) {
        goog.Dependency.unregisterCallback_(h);
        a.registerEs6ModuleExports(e.path, b, goog.moduleLoaderState_.moduleName);
      });
      f(void 0, 'import * as m from "' + this.path + '"; goog.Dependency.callback_("' + h + '", m)');
      var k = goog.Dependency.registerCallback_(function() {
        goog.Dependency.unregisterCallback_(k);
        a.clearModuleState();
        a.loaded();
      });
      f(void 0, 'goog.Dependency.callback_("' + k + '")');
    } else {
      goog.logToConsole_("Cannot use default debug loader outside of HTML documents."), a.pause();
    }
  }
}, goog.TransformedDependency = function(a, b, c, d, e) {
  goog.Dependency.call(this, a, b, c, d, e);
  this.contents_ = null;
}, goog.inherits(goog.TransformedDependency, goog.Dependency), goog.TransformedDependency.prototype.load = function(a) {
  function b() {
    e.contents_ = goog.loadFileSync_(e.path);
    e.contents_ && (e.contents_ = e.transform(e.contents_), e.contents_ && (e.contents_ += "\n//# sourceURL=" + e.path));
  }
  function c() {
    b();
    if (e.contents_) {
      f && a.setModuleState(goog.ModuleType.ES6);
      try {
        var c = e.contents_;
        e.contents_ = null;
        goog.globalEval(c);
        if (f) {
          var d = goog.moduleLoaderState_.moduleName;
        }
      } finally {
        f && a.clearModuleState();
      }
      f && goog.global.$jscomp.require.ensure([e.path], function() {
        a.registerEs6ModuleExports(e.path, goog.global.$jscomp.require(e.path), d);
      });
      a.loaded();
    }
  }
  function d() {
    var a = goog.global.document, b = goog.Dependency.registerCallback_(function() {
      goog.Dependency.unregisterCallback_(b);
      c();
    });
    a.write('<script type="text/javascript">' + goog.protectScriptTag_('goog.Dependency.callback_("' + b + '");') + "\x3c/script>");
  }
  var e = this;
  if (goog.global.CLOSURE_IMPORT_SCRIPT) {
    b(), this.contents_ && goog.global.CLOSURE_IMPORT_SCRIPT("", this.contents_) ? (this.contents_ = null, a.loaded()) : a.pause();
  } else {
    var f = this.loadFlags.module == goog.ModuleType.ES6, g = 1 < a.pending().length, h = g && goog.DebugLoader_.IS_OLD_IE_;
    g = goog.Dependency.defer_ && (g || goog.isDocumentLoading_());
    if (h || g) {
      a.defer(function() {
        c();
      });
    } else {
      if (f && goog.inHtmlDocument_() && goog.isDocumentLoading_()) {
        goog.Dependency.defer_ = !0;
        var k = goog.global.document;
        a.pause();
        var l = k.onreadystatechange;
        k.onreadystatechange = function() {
          if (k.attachEvent ? "complete" == k.readyState : "interactive" == k.readyState) {
            k.onreadystatechange = l, c(), a.resume();
          }
          goog.isFunction(l) && l.apply(void 0, arguments);
        };
      } else {
        !goog.DebugLoader_.IS_OLD_IE_ && goog.inHtmlDocument_() && goog.isDocumentLoading_() ? d() : c();
      }
    }
  }
}, goog.TransformedDependency.prototype.transform = function(a) {
}, goog.TranspiledDependency = function(a, b, c, d, e, f) {
  goog.TransformedDependency.call(this, a, b, c, d, e);
  this.transpiler = f;
}, goog.inherits(goog.TranspiledDependency, goog.TransformedDependency), goog.TranspiledDependency.prototype.transform = function(a) {
  return this.transpiler.transpile(a, this.path);
}, goog.GoogModuleDependency = function(a, b, c, d, e, f, g) {
  goog.TransformedDependency.call(this, a, b, c, d, e);
  this.needsTranspile_ = f;
  this.transpiler_ = g;
}, goog.inherits(goog.GoogModuleDependency, goog.TransformedDependency), goog.GoogModuleDependency.prototype.transform = function(a) {
  this.needsTranspile_ && (a = this.transpiler_.transpile(a, this.path));
  return goog.LOAD_MODULE_USING_EVAL && goog.isDef(goog.global.JSON) ? "goog.loadModule(" + goog.global.JSON.stringify(a + "\n//# sourceURL=" + this.path + "\n") + ");" : 'goog.loadModule(function(exports) {"use strict";' + a + "\n;return exports});\n//# sourceURL=" + this.path + "\n";
}, goog.DebugLoader_.IS_OLD_IE_ = !(goog.global.atob || !goog.global.document || !goog.global.document.all), goog.DebugLoader_.prototype.addDependency = function(a, b, c, d) {
  b = b || [];
  a = a.replace(/\\/g, "/");
  var e = goog.normalizePath_(goog.basePath + a);
  d && "boolean" !== typeof d || (d = d ? {module:goog.ModuleType.GOOG} : {});
  c = this.factory_.createDependency(e, a, b, c, d, goog.transpiler_.needsTranspile(d.lang || "es3", d.module));
  this.dependencies_[e] = c;
  for (c = 0; c < b.length; c++) {
    this.idToPath_[b[c]] = e;
  }
  this.idToPath_[a] = e;
}, goog.DependencyFactory = function(a) {
  this.transpiler = a;
}, goog.DependencyFactory.prototype.createDependency = function(a, b, c, d, e, f) {
  return e.module == goog.ModuleType.GOOG ? new goog.GoogModuleDependency(a, b, c, d, e, f, this.transpiler) : f ? new goog.TranspiledDependency(a, b, c, d, e, this.transpiler) : e.module == goog.ModuleType.ES6 ? new goog.Es6ModuleDependency(a, b, c, d, e) : new goog.Dependency(a, b, c, d, e);
}, goog.debugLoader_ = new goog.DebugLoader_, goog.loadClosureDeps = function() {
  goog.debugLoader_.loadClosureDeps();
}, goog.setDependencyFactory = function(a) {
  goog.debugLoader_.setDependencyFactory(a);
}, goog.global.CLOSURE_NO_DEPS || goog.debugLoader_.loadClosureDeps(), goog.bootstrap = function(a, b) {
  goog.debugLoader_.bootstrap(a, b);
});
goog.debug = {};
goog.debug.Error = function(a) {
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, goog.debug.Error);
  } else {
    var b = Error().stack;
    b && (this.stack = b);
  }
  a && (this.message = String(a));
  this.reportErrorToServer = !0;
};
goog.inherits(goog.debug.Error, Error);
goog.debug.Error.prototype.name = "CustomError";
goog.dom = {};
goog.dom.NodeType = {ELEMENT:1, ATTRIBUTE:2, TEXT:3, CDATA_SECTION:4, ENTITY_REFERENCE:5, ENTITY:6, PROCESSING_INSTRUCTION:7, COMMENT:8, DOCUMENT:9, DOCUMENT_TYPE:10, DOCUMENT_FRAGMENT:11, NOTATION:12};
goog.asserts = {};
goog.asserts.ENABLE_ASSERTS = goog.DEBUG;
goog.asserts.AssertionError = function(a, b) {
  goog.debug.Error.call(this, goog.asserts.subs_(a, b));
  this.messagePattern = a;
};
goog.inherits(goog.asserts.AssertionError, goog.debug.Error);
goog.asserts.AssertionError.prototype.name = "AssertionError";
goog.asserts.DEFAULT_ERROR_HANDLER = function(a) {
  throw a;
};
goog.asserts.errorHandler_ = goog.asserts.DEFAULT_ERROR_HANDLER;
goog.asserts.subs_ = function(a, b) {
  a = a.split("%s");
  for (var c = "", d = a.length - 1, e = 0; e < d; e++) {
    c += a[e] + (e < b.length ? b[e] : "%s");
  }
  return c + a[d];
};
goog.asserts.doAssertFailure_ = function(a, b, c, d) {
  var e = "Assertion failed";
  if (c) {
    e += ": " + c;
    var f = d;
  } else {
    a && (e += ": " + a, f = b);
  }
  a = new goog.asserts.AssertionError("" + e, f || []);
  goog.asserts.errorHandler_(a);
};
goog.asserts.setErrorHandler = function(a) {
  goog.asserts.ENABLE_ASSERTS && (goog.asserts.errorHandler_ = a);
};
goog.asserts.assert = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && !a && goog.asserts.doAssertFailure_("", null, b, Array.prototype.slice.call(arguments, 2));
  return a;
};
goog.asserts.fail = function(a, b) {
  goog.asserts.ENABLE_ASSERTS && goog.asserts.errorHandler_(new goog.asserts.AssertionError("Failure" + (a ? ": " + a : ""), Array.prototype.slice.call(arguments, 1)));
};
goog.asserts.assertNumber = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && !goog.isNumber(a) && goog.asserts.doAssertFailure_("Expected number but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a;
};
goog.asserts.assertString = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && !goog.isString(a) && goog.asserts.doAssertFailure_("Expected string but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a;
};
goog.asserts.assertFunction = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && !goog.isFunction(a) && goog.asserts.doAssertFailure_("Expected function but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a;
};
goog.asserts.assertObject = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && !goog.isObject(a) && goog.asserts.doAssertFailure_("Expected object but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a;
};
goog.asserts.assertArray = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && !goog.isArray(a) && goog.asserts.doAssertFailure_("Expected array but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a;
};
goog.asserts.assertBoolean = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && !goog.isBoolean(a) && goog.asserts.doAssertFailure_("Expected boolean but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a;
};
goog.asserts.assertElement = function(a, b, c) {
  !goog.asserts.ENABLE_ASSERTS || goog.isObject(a) && a.nodeType == goog.dom.NodeType.ELEMENT || goog.asserts.doAssertFailure_("Expected Element but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a;
};
goog.asserts.assertInstanceof = function(a, b, c, d) {
  !goog.asserts.ENABLE_ASSERTS || a instanceof b || goog.asserts.doAssertFailure_("Expected instanceof %s but got %s.", [goog.asserts.getType_(b), goog.asserts.getType_(a)], c, Array.prototype.slice.call(arguments, 3));
  return a;
};
goog.asserts.assertFinite = function(a, b, c) {
  !goog.asserts.ENABLE_ASSERTS || "number" == typeof a && isFinite(a) || goog.asserts.doAssertFailure_("Expected %s to be a finite number but it is not.", [a], b, Array.prototype.slice.call(arguments, 2));
  return a;
};
goog.asserts.assertObjectPrototypeIsIntact = function() {
  for (var a in Object.prototype) {
    goog.asserts.fail(a + " should not be enumerable in Object.prototype.");
  }
};
goog.asserts.getType_ = function(a) {
  return a instanceof Function ? a.displayName || a.name || "unknown type name" : a instanceof Object ? a.constructor.displayName || a.constructor.name || Object.prototype.toString.call(a) : null === a ? "null" : typeof a;
};
goog.array = {};
goog.NATIVE_ARRAY_PROTOTYPES = goog.TRUSTED_SITE;
goog.array.ASSUME_NATIVE_FUNCTIONS = !1;
goog.array.peek = function(a) {
  return a[a.length - 1];
};
goog.array.last = goog.array.peek;
goog.array.indexOf = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.indexOf) ? function(a, b, c) {
  goog.asserts.assert(null != a.length);
  return Array.prototype.indexOf.call(a, b, c);
} : function(a, b, c) {
  c = null == c ? 0 : 0 > c ? Math.max(0, a.length + c) : c;
  if (goog.isString(a)) {
    return goog.isString(b) && 1 == b.length ? a.indexOf(b, c) : -1;
  }
  for (; c < a.length; c++) {
    if (c in a && a[c] === b) {
      return c;
    }
  }
  return -1;
};
goog.array.lastIndexOf = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.lastIndexOf) ? function(a, b, c) {
  goog.asserts.assert(null != a.length);
  return Array.prototype.lastIndexOf.call(a, b, null == c ? a.length - 1 : c);
} : function(a, b, c) {
  c = null == c ? a.length - 1 : c;
  0 > c && (c = Math.max(0, a.length + c));
  if (goog.isString(a)) {
    return goog.isString(b) && 1 == b.length ? a.lastIndexOf(b, c) : -1;
  }
  for (; 0 <= c; c--) {
    if (c in a && a[c] === b) {
      return c;
    }
  }
  return -1;
};
goog.array.forEach = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.forEach) ? function(a, b, c) {
  goog.asserts.assert(null != a.length);
  Array.prototype.forEach.call(a, b, c);
} : function(a, b, c) {
  for (var d = a.length, e = goog.isString(a) ? a.split("") : a, f = 0; f < d; f++) {
    f in e && b.call(c, e[f], f, a);
  }
};
goog.array.forEachRight = function(a, b, c) {
  var d = a.length, e = goog.isString(a) ? a.split("") : a;
  for (--d; 0 <= d; --d) {
    d in e && b.call(c, e[d], d, a);
  }
};
goog.array.filter = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.filter) ? function(a, b, c) {
  goog.asserts.assert(null != a.length);
  return Array.prototype.filter.call(a, b, c);
} : function(a, b, c) {
  for (var d = a.length, e = [], f = 0, g = goog.isString(a) ? a.split("") : a, h = 0; h < d; h++) {
    if (h in g) {
      var k = g[h];
      b.call(c, k, h, a) && (e[f++] = k);
    }
  }
  return e;
};
goog.array.map = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.map) ? function(a, b, c) {
  goog.asserts.assert(null != a.length);
  return Array.prototype.map.call(a, b, c);
} : function(a, b, c) {
  for (var d = a.length, e = Array(d), f = goog.isString(a) ? a.split("") : a, g = 0; g < d; g++) {
    g in f && (e[g] = b.call(c, f[g], g, a));
  }
  return e;
};
goog.array.reduce = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.reduce) ? function(a, b, c, d) {
  goog.asserts.assert(null != a.length);
  d && (b = goog.bind(b, d));
  return Array.prototype.reduce.call(a, b, c);
} : function(a, b, c, d) {
  var e = c;
  goog.array.forEach(a, function(c, g) {
    e = b.call(d, e, c, g, a);
  });
  return e;
};
goog.array.reduceRight = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.reduceRight) ? function(a, b, c, d) {
  goog.asserts.assert(null != a.length);
  goog.asserts.assert(null != b);
  d && (b = goog.bind(b, d));
  return Array.prototype.reduceRight.call(a, b, c);
} : function(a, b, c, d) {
  var e = c;
  goog.array.forEachRight(a, function(c, g) {
    e = b.call(d, e, c, g, a);
  });
  return e;
};
goog.array.some = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.some) ? function(a, b, c) {
  goog.asserts.assert(null != a.length);
  return Array.prototype.some.call(a, b, c);
} : function(a, b, c) {
  for (var d = a.length, e = goog.isString(a) ? a.split("") : a, f = 0; f < d; f++) {
    if (f in e && b.call(c, e[f], f, a)) {
      return !0;
    }
  }
  return !1;
};
goog.array.every = goog.NATIVE_ARRAY_PROTOTYPES && (goog.array.ASSUME_NATIVE_FUNCTIONS || Array.prototype.every) ? function(a, b, c) {
  goog.asserts.assert(null != a.length);
  return Array.prototype.every.call(a, b, c);
} : function(a, b, c) {
  for (var d = a.length, e = goog.isString(a) ? a.split("") : a, f = 0; f < d; f++) {
    if (f in e && !b.call(c, e[f], f, a)) {
      return !1;
    }
  }
  return !0;
};
goog.array.count = function(a, b, c) {
  var d = 0;
  goog.array.forEach(a, function(a, f, g) {
    b.call(c, a, f, g) && ++d;
  }, c);
  return d;
};
goog.array.find = function(a, b, c) {
  b = goog.array.findIndex(a, b, c);
  return 0 > b ? null : goog.isString(a) ? a.charAt(b) : a[b];
};
goog.array.findIndex = function(a, b, c) {
  for (var d = a.length, e = goog.isString(a) ? a.split("") : a, f = 0; f < d; f++) {
    if (f in e && b.call(c, e[f], f, a)) {
      return f;
    }
  }
  return -1;
};
goog.array.findRight = function(a, b, c) {
  b = goog.array.findIndexRight(a, b, c);
  return 0 > b ? null : goog.isString(a) ? a.charAt(b) : a[b];
};
goog.array.findIndexRight = function(a, b, c) {
  var d = a.length, e = goog.isString(a) ? a.split("") : a;
  for (--d; 0 <= d; d--) {
    if (d in e && b.call(c, e[d], d, a)) {
      return d;
    }
  }
  return -1;
};
goog.array.contains = function(a, b) {
  return 0 <= goog.array.indexOf(a, b);
};
goog.array.isEmpty = function(a) {
  return 0 == a.length;
};
goog.array.clear = function(a) {
  if (!goog.isArray(a)) {
    for (var b = a.length - 1; 0 <= b; b--) {
      delete a[b];
    }
  }
  a.length = 0;
};
goog.array.insert = function(a, b) {
  goog.array.contains(a, b) || a.push(b);
};
goog.array.insertAt = function(a, b, c) {
  goog.array.splice(a, c, 0, b);
};
goog.array.insertArrayAt = function(a, b, c) {
  goog.partial(goog.array.splice, a, c, 0).apply(null, b);
};
goog.array.insertBefore = function(a, b, c) {
  var d;
  2 == arguments.length || 0 > (d = goog.array.indexOf(a, c)) ? a.push(b) : goog.array.insertAt(a, b, d);
};
goog.array.remove = function(a, b) {
  b = goog.array.indexOf(a, b);
  var c;
  (c = 0 <= b) && goog.array.removeAt(a, b);
  return c;
};
goog.array.removeLast = function(a, b) {
  b = goog.array.lastIndexOf(a, b);
  return 0 <= b ? (goog.array.removeAt(a, b), !0) : !1;
};
goog.array.removeAt = function(a, b) {
  goog.asserts.assert(null != a.length);
  return 1 == Array.prototype.splice.call(a, b, 1).length;
};
goog.array.removeIf = function(a, b, c) {
  b = goog.array.findIndex(a, b, c);
  return 0 <= b ? (goog.array.removeAt(a, b), !0) : !1;
};
goog.array.removeAllIf = function(a, b, c) {
  var d = 0;
  goog.array.forEachRight(a, function(e, f) {
    b.call(c, e, f, a) && goog.array.removeAt(a, f) && d++;
  });
  return d;
};
goog.array.concat = function(a) {
  return Array.prototype.concat.apply([], arguments);
};
goog.array.join = function(a) {
  return Array.prototype.concat.apply([], arguments);
};
goog.array.toArray = function(a) {
  var b = a.length;
  if (0 < b) {
    for (var c = Array(b), d = 0; d < b; d++) {
      c[d] = a[d];
    }
    return c;
  }
  return [];
};
goog.array.clone = goog.array.toArray;
goog.array.extend = function(a, b) {
  for (var c = 1; c < arguments.length; c++) {
    var d = arguments[c];
    if (goog.isArrayLike(d)) {
      var e = a.length || 0, f = d.length || 0;
      a.length = e + f;
      for (var g = 0; g < f; g++) {
        a[e + g] = d[g];
      }
    } else {
      a.push(d);
    }
  }
};
goog.array.splice = function(a, b, c, d) {
  goog.asserts.assert(null != a.length);
  return Array.prototype.splice.apply(a, goog.array.slice(arguments, 1));
};
goog.array.slice = function(a, b, c) {
  goog.asserts.assert(null != a.length);
  return 2 >= arguments.length ? Array.prototype.slice.call(a, b) : Array.prototype.slice.call(a, b, c);
};
goog.array.removeDuplicates = function(a, b, c) {
  b = b || a;
  var d = function(a) {
    return goog.isObject(a) ? "o" + goog.getUid(a) : (typeof a).charAt(0) + a;
  };
  c = c || d;
  d = {};
  for (var e = 0, f = 0; f < a.length;) {
    var g = a[f++], h = c(g);
    Object.prototype.hasOwnProperty.call(d, h) || (d[h] = !0, b[e++] = g);
  }
  b.length = e;
};
goog.array.binarySearch = function(a, b, c) {
  return goog.array.binarySearch_(a, c || goog.array.defaultCompare, !1, b);
};
goog.array.binarySelect = function(a, b, c) {
  return goog.array.binarySearch_(a, b, !0, void 0, c);
};
goog.array.binarySearch_ = function(a, b, c, d, e) {
  for (var f = 0, g = a.length, h; f < g;) {
    var k = f + g >> 1;
    var l = c ? b.call(e, a[k], k, a) : b(d, a[k]);
    0 < l ? f = k + 1 : (g = k, h = !l);
  }
  return h ? f : ~f;
};
goog.array.sort = function(a, b) {
  a.sort(b || goog.array.defaultCompare);
};
goog.array.stableSort = function(a, b) {
  for (var c = Array(a.length), d = 0; d < a.length; d++) {
    c[d] = {index:d, value:a[d]};
  }
  var e = b || goog.array.defaultCompare;
  goog.array.sort(c, function(a, b) {
    return e(a.value, b.value) || a.index - b.index;
  });
  for (d = 0; d < a.length; d++) {
    a[d] = c[d].value;
  }
};
goog.array.sortByKey = function(a, b, c) {
  var d = c || goog.array.defaultCompare;
  goog.array.sort(a, function(a, c) {
    return d(b(a), b(c));
  });
};
goog.array.sortObjectsByKey = function(a, b, c) {
  goog.array.sortByKey(a, function(a) {
    return a[b];
  }, c);
};
goog.array.isSorted = function(a, b, c) {
  b = b || goog.array.defaultCompare;
  for (var d = 1; d < a.length; d++) {
    var e = b(a[d - 1], a[d]);
    if (0 < e || 0 == e && c) {
      return !1;
    }
  }
  return !0;
};
goog.array.equals = function(a, b, c) {
  if (!goog.isArrayLike(a) || !goog.isArrayLike(b) || a.length != b.length) {
    return !1;
  }
  var d = a.length;
  c = c || goog.array.defaultCompareEquality;
  for (var e = 0; e < d; e++) {
    if (!c(a[e], b[e])) {
      return !1;
    }
  }
  return !0;
};
goog.array.compare3 = function(a, b, c) {
  c = c || goog.array.defaultCompare;
  for (var d = Math.min(a.length, b.length), e = 0; e < d; e++) {
    var f = c(a[e], b[e]);
    if (0 != f) {
      return f;
    }
  }
  return goog.array.defaultCompare(a.length, b.length);
};
goog.array.defaultCompare = function(a, b) {
  return a > b ? 1 : a < b ? -1 : 0;
};
goog.array.inverseDefaultCompare = function(a, b) {
  return -goog.array.defaultCompare(a, b);
};
goog.array.defaultCompareEquality = function(a, b) {
  return a === b;
};
goog.array.binaryInsert = function(a, b, c) {
  c = goog.array.binarySearch(a, b, c);
  return 0 > c ? (goog.array.insertAt(a, b, -(c + 1)), !0) : !1;
};
goog.array.binaryRemove = function(a, b, c) {
  b = goog.array.binarySearch(a, b, c);
  return 0 <= b ? goog.array.removeAt(a, b) : !1;
};
goog.array.bucket = function(a, b, c) {
  for (var d = {}, e = 0; e < a.length; e++) {
    var f = a[e], g = b.call(c, f, e, a);
    goog.isDef(g) && (d[g] || (d[g] = [])).push(f);
  }
  return d;
};
goog.array.toObject = function(a, b, c) {
  var d = {};
  goog.array.forEach(a, function(e, f) {
    d[b.call(c, e, f, a)] = e;
  });
  return d;
};
goog.array.range = function(a, b, c) {
  var d = [], e = 0, f = a;
  c = c || 1;
  void 0 !== b && (e = a, f = b);
  if (0 > c * (f - e)) {
    return [];
  }
  if (0 < c) {
    for (a = e; a < f; a += c) {
      d.push(a);
    }
  } else {
    for (a = e; a > f; a += c) {
      d.push(a);
    }
  }
  return d;
};
goog.array.repeat = function(a, b) {
  for (var c = [], d = 0; d < b; d++) {
    c[d] = a;
  }
  return c;
};
goog.array.flatten = function(a) {
  for (var b = [], c = 0; c < arguments.length; c++) {
    var d = arguments[c];
    if (goog.isArray(d)) {
      for (var e = 0; e < d.length; e += 8192) {
        var f = goog.array.slice(d, e, e + 8192);
        f = goog.array.flatten.apply(null, f);
        for (var g = 0; g < f.length; g++) {
          b.push(f[g]);
        }
      }
    } else {
      b.push(d);
    }
  }
  return b;
};
goog.array.rotate = function(a, b) {
  goog.asserts.assert(null != a.length);
  a.length && (b %= a.length, 0 < b ? Array.prototype.unshift.apply(a, a.splice(-b, b)) : 0 > b && Array.prototype.push.apply(a, a.splice(0, -b)));
  return a;
};
goog.array.moveItem = function(a, b, c) {
  goog.asserts.assert(0 <= b && b < a.length);
  goog.asserts.assert(0 <= c && c < a.length);
  b = Array.prototype.splice.call(a, b, 1);
  Array.prototype.splice.call(a, c, 0, b[0]);
};
goog.array.zip = function(a) {
  if (!arguments.length) {
    return [];
  }
  for (var b = [], c = arguments[0].length, d = 1; d < arguments.length; d++) {
    arguments[d].length < c && (c = arguments[d].length);
  }
  for (d = 0; d < c; d++) {
    for (var e = [], f = 0; f < arguments.length; f++) {
      e.push(arguments[f][d]);
    }
    b.push(e);
  }
  return b;
};
goog.array.shuffle = function(a, b) {
  b = b || Math.random;
  for (var c = a.length - 1; 0 < c; c--) {
    var d = Math.floor(b() * (c + 1)), e = a[c];
    a[c] = a[d];
    a[d] = e;
  }
};
goog.array.copyByIndex = function(a, b) {
  var c = [];
  goog.array.forEach(b, function(b) {
    c.push(a[b]);
  });
  return c;
};
goog.array.concatMap = function(a, b, c) {
  return goog.array.concat.apply([], goog.array.map(a, b, c));
};
goog.string = {};
goog.string.DETECT_DOUBLE_ESCAPING = !1;
goog.string.FORCE_NON_DOM_HTML_UNESCAPING = !1;
goog.string.Unicode = {NBSP:"\u00a0"};
goog.string.startsWith = function(a, b) {
  return 0 == a.lastIndexOf(b, 0);
};
goog.string.endsWith = function(a, b) {
  var c = a.length - b.length;
  return 0 <= c && a.indexOf(b, c) == c;
};
goog.string.caseInsensitiveStartsWith = function(a, b) {
  return 0 == goog.string.caseInsensitiveCompare(b, a.substr(0, b.length));
};
goog.string.caseInsensitiveEndsWith = function(a, b) {
  return 0 == goog.string.caseInsensitiveCompare(b, a.substr(a.length - b.length, b.length));
};
goog.string.caseInsensitiveEquals = function(a, b) {
  return a.toLowerCase() == b.toLowerCase();
};
goog.string.subs = function(a, b) {
  for (var c = a.split("%s"), d = "", e = Array.prototype.slice.call(arguments, 1); e.length && 1 < c.length;) {
    d += c.shift() + e.shift();
  }
  return d + c.join("%s");
};
goog.string.collapseWhitespace = function(a) {
  return a.replace(/[\s\xa0]+/g, " ").replace(/^\s+|\s+$/g, "");
};
goog.string.isEmptyOrWhitespace = function(a) {
  return /^[\s\xa0]*$/.test(a);
};
goog.string.isEmptyString = function(a) {
  return 0 == a.length;
};
goog.string.isEmpty = goog.string.isEmptyOrWhitespace;
goog.string.isEmptyOrWhitespaceSafe = function(a) {
  return goog.string.isEmptyOrWhitespace(goog.string.makeSafe(a));
};
goog.string.isEmptySafe = goog.string.isEmptyOrWhitespaceSafe;
goog.string.isBreakingWhitespace = function(a) {
  return !/[^\t\n\r ]/.test(a);
};
goog.string.isAlpha = function(a) {
  return !/[^a-zA-Z]/.test(a);
};
goog.string.isNumeric = function(a) {
  return !/[^0-9]/.test(a);
};
goog.string.isAlphaNumeric = function(a) {
  return !/[^a-zA-Z0-9]/.test(a);
};
goog.string.isSpace = function(a) {
  return " " == a;
};
goog.string.isUnicodeChar = function(a) {
  return 1 == a.length && " " <= a && "~" >= a || "\u0080" <= a && "\ufffd" >= a;
};
goog.string.stripNewlines = function(a) {
  return a.replace(/(\r\n|\r|\n)+/g, " ");
};
goog.string.canonicalizeNewlines = function(a) {
  return a.replace(/(\r\n|\r|\n)/g, "\n");
};
goog.string.normalizeWhitespace = function(a) {
  return a.replace(/\xa0|\s/g, " ");
};
goog.string.normalizeSpaces = function(a) {
  return a.replace(/\xa0|[ \t]+/g, " ");
};
goog.string.collapseBreakingSpaces = function(a) {
  return a.replace(/[\t\r\n ]+/g, " ").replace(/^[\t\r\n ]+|[\t\r\n ]+$/g, "");
};
goog.string.trim = goog.TRUSTED_SITE && String.prototype.trim ? function(a) {
  return a.trim();
} : function(a) {
  return /^[\s\xa0]*([\s\S]*?)[\s\xa0]*$/.exec(a)[1];
};
goog.string.trimLeft = function(a) {
  return a.replace(/^[\s\xa0]+/, "");
};
goog.string.trimRight = function(a) {
  return a.replace(/[\s\xa0]+$/, "");
};
goog.string.caseInsensitiveCompare = function(a, b) {
  a = String(a).toLowerCase();
  b = String(b).toLowerCase();
  return a < b ? -1 : a == b ? 0 : 1;
};
goog.string.numberAwareCompare_ = function(a, b, c) {
  if (a == b) {
    return 0;
  }
  if (!a) {
    return -1;
  }
  if (!b) {
    return 1;
  }
  for (var d = a.toLowerCase().match(c), e = b.toLowerCase().match(c), f = Math.min(d.length, e.length), g = 0; g < f; g++) {
    c = d[g];
    var h = e[g];
    if (c != h) {
      return a = parseInt(c, 10), !isNaN(a) && (b = parseInt(h, 10), !isNaN(b) && a - b) ? a - b : c < h ? -1 : 1;
    }
  }
  return d.length != e.length ? d.length - e.length : a < b ? -1 : 1;
};
goog.string.intAwareCompare = function(a, b) {
  return goog.string.numberAwareCompare_(a, b, /\d+|\D+/g);
};
goog.string.floatAwareCompare = function(a, b) {
  return goog.string.numberAwareCompare_(a, b, /\d+|\.\d+|\D+/g);
};
goog.string.numerateCompare = goog.string.floatAwareCompare;
goog.string.urlEncode = function(a) {
  return encodeURIComponent(String(a));
};
goog.string.urlDecode = function(a) {
  return decodeURIComponent(a.replace(/\+/g, " "));
};
goog.string.newLineToBr = function(a, b) {
  return a.replace(/(\r\n|\r|\n)/g, b ? "<br />" : "<br>");
};
goog.string.htmlEscape = function(a, b) {
  if (b) {
    a = a.replace(goog.string.AMP_RE_, "&amp;").replace(goog.string.LT_RE_, "&lt;").replace(goog.string.GT_RE_, "&gt;").replace(goog.string.QUOT_RE_, "&quot;").replace(goog.string.SINGLE_QUOTE_RE_, "&#39;").replace(goog.string.NULL_RE_, "&#0;"), goog.string.DETECT_DOUBLE_ESCAPING && (a = a.replace(goog.string.E_RE_, "&#101;"));
  } else {
    if (!goog.string.ALL_RE_.test(a)) {
      return a;
    }
    -1 != a.indexOf("&") && (a = a.replace(goog.string.AMP_RE_, "&amp;"));
    -1 != a.indexOf("<") && (a = a.replace(goog.string.LT_RE_, "&lt;"));
    -1 != a.indexOf(">") && (a = a.replace(goog.string.GT_RE_, "&gt;"));
    -1 != a.indexOf('"') && (a = a.replace(goog.string.QUOT_RE_, "&quot;"));
    -1 != a.indexOf("'") && (a = a.replace(goog.string.SINGLE_QUOTE_RE_, "&#39;"));
    -1 != a.indexOf("\x00") && (a = a.replace(goog.string.NULL_RE_, "&#0;"));
    goog.string.DETECT_DOUBLE_ESCAPING && -1 != a.indexOf("e") && (a = a.replace(goog.string.E_RE_, "&#101;"));
  }
  return a;
};
goog.string.AMP_RE_ = /&/g;
goog.string.LT_RE_ = /</g;
goog.string.GT_RE_ = />/g;
goog.string.QUOT_RE_ = /"/g;
goog.string.SINGLE_QUOTE_RE_ = /'/g;
goog.string.NULL_RE_ = /\x00/g;
goog.string.E_RE_ = /e/g;
goog.string.ALL_RE_ = goog.string.DETECT_DOUBLE_ESCAPING ? /[\x00&<>"'e]/ : /[\x00&<>"']/;
goog.string.unescapeEntities = function(a) {
  return goog.string.contains(a, "&") ? !goog.string.FORCE_NON_DOM_HTML_UNESCAPING && "document" in goog.global ? goog.string.unescapeEntitiesUsingDom_(a) : goog.string.unescapePureXmlEntities_(a) : a;
};
goog.string.unescapeEntitiesWithDocument = function(a, b) {
  return goog.string.contains(a, "&") ? goog.string.unescapeEntitiesUsingDom_(a, b) : a;
};
goog.string.unescapeEntitiesUsingDom_ = function(a, b) {
  var c = {"&amp;":"&", "&lt;":"<", "&gt;":">", "&quot;":'"'};
  var d = b ? b.createElement("div") : goog.global.document.createElement("div");
  return a.replace(goog.string.HTML_ENTITY_PATTERN_, function(a, b) {
    var e = c[a];
    if (e) {
      return e;
    }
    "#" == b.charAt(0) && (b = Number("0" + b.substr(1)), isNaN(b) || (e = String.fromCharCode(b)));
    e || (d.innerHTML = a + " ", e = d.firstChild.nodeValue.slice(0, -1));
    return c[a] = e;
  });
};
goog.string.unescapePureXmlEntities_ = function(a) {
  return a.replace(/&([^;]+);/g, function(a, c) {
    switch(c) {
      case "amp":
        return "&";
      case "lt":
        return "<";
      case "gt":
        return ">";
      case "quot":
        return '"';
      default:
        return "#" != c.charAt(0) || (c = Number("0" + c.substr(1)), isNaN(c)) ? a : String.fromCharCode(c);
    }
  });
};
goog.string.HTML_ENTITY_PATTERN_ = /&([^;\s<&]+);?/g;
goog.string.whitespaceEscape = function(a, b) {
  return goog.string.newLineToBr(a.replace(/  /g, " &#160;"), b);
};
goog.string.preserveSpaces = function(a) {
  return a.replace(/(^|[\n ]) /g, "$1" + goog.string.Unicode.NBSP);
};
goog.string.stripQuotes = function(a, b) {
  for (var c = b.length, d = 0; d < c; d++) {
    var e = 1 == c ? b : b.charAt(d);
    if (a.charAt(0) == e && a.charAt(a.length - 1) == e) {
      return a.substring(1, a.length - 1);
    }
  }
  return a;
};
goog.string.truncate = function(a, b, c) {
  c && (a = goog.string.unescapeEntities(a));
  a.length > b && (a = a.substring(0, b - 3) + "...");
  c && (a = goog.string.htmlEscape(a));
  return a;
};
goog.string.truncateMiddle = function(a, b, c, d) {
  c && (a = goog.string.unescapeEntities(a));
  if (d && a.length > b) {
    d > b && (d = b);
    var e = a.length - d;
    a = a.substring(0, b - d) + "..." + a.substring(e);
  } else {
    a.length > b && (d = Math.floor(b / 2), e = a.length - d, a = a.substring(0, d + b % 2) + "..." + a.substring(e));
  }
  c && (a = goog.string.htmlEscape(a));
  return a;
};
goog.string.specialEscapeChars_ = {"\x00":"\\0", "\b":"\\b", "\f":"\\f", "\n":"\\n", "\r":"\\r", "\t":"\\t", "\x0B":"\\x0B", '"':'\\"', "\\":"\\\\", "<":"<"};
goog.string.jsEscapeCache_ = {"'":"\\'"};
goog.string.quote = function(a) {
  a = String(a);
  for (var b = ['"'], c = 0; c < a.length; c++) {
    var d = a.charAt(c), e = d.charCodeAt(0);
    b[c + 1] = goog.string.specialEscapeChars_[d] || (31 < e && 127 > e ? d : goog.string.escapeChar(d));
  }
  b.push('"');
  return b.join("");
};
goog.string.escapeString = function(a) {
  for (var b = [], c = 0; c < a.length; c++) {
    b[c] = goog.string.escapeChar(a.charAt(c));
  }
  return b.join("");
};
goog.string.escapeChar = function(a) {
  if (a in goog.string.jsEscapeCache_) {
    return goog.string.jsEscapeCache_[a];
  }
  if (a in goog.string.specialEscapeChars_) {
    return goog.string.jsEscapeCache_[a] = goog.string.specialEscapeChars_[a];
  }
  var b = a.charCodeAt(0);
  if (31 < b && 127 > b) {
    var c = a;
  } else {
    if (256 > b) {
      if (c = "\\x", 16 > b || 256 < b) {
        c += "0";
      }
    } else {
      c = "\\u", 4096 > b && (c += "0");
    }
    c += b.toString(16).toUpperCase();
  }
  return goog.string.jsEscapeCache_[a] = c;
};
goog.string.contains = function(a, b) {
  return -1 != a.indexOf(b);
};
goog.string.caseInsensitiveContains = function(a, b) {
  return goog.string.contains(a.toLowerCase(), b.toLowerCase());
};
goog.string.countOf = function(a, b) {
  return a && b ? a.split(b).length - 1 : 0;
};
goog.string.removeAt = function(a, b, c) {
  var d = a;
  0 <= b && b < a.length && 0 < c && (d = a.substr(0, b) + a.substr(b + c, a.length - b - c));
  return d;
};
goog.string.remove = function(a, b) {
  return a.replace(b, "");
};
goog.string.removeAll = function(a, b) {
  b = new RegExp(goog.string.regExpEscape(b), "g");
  return a.replace(b, "");
};
goog.string.replaceAll = function(a, b, c) {
  b = new RegExp(goog.string.regExpEscape(b), "g");
  return a.replace(b, c.replace(/\$/g, "$$$$"));
};
goog.string.regExpEscape = function(a) {
  return String(a).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, "\\$1").replace(/\x08/g, "\\x08");
};
goog.string.repeat = String.prototype.repeat ? function(a, b) {
  return a.repeat(b);
} : function(a, b) {
  return Array(b + 1).join(a);
};
goog.string.padNumber = function(a, b, c) {
  a = goog.isDef(c) ? a.toFixed(c) : String(a);
  c = a.indexOf(".");
  -1 == c && (c = a.length);
  return goog.string.repeat("0", Math.max(0, b - c)) + a;
};
goog.string.makeSafe = function(a) {
  return null == a ? "" : String(a);
};
goog.string.buildString = function(a) {
  return Array.prototype.join.call(arguments, "");
};
goog.string.getRandomString = function() {
  return Math.floor(2147483648 * Math.random()).toString(36) + Math.abs(Math.floor(2147483648 * Math.random()) ^ goog.now()).toString(36);
};
goog.string.compareVersions = function(a, b) {
  var c = 0;
  a = goog.string.trim(String(a)).split(".");
  b = goog.string.trim(String(b)).split(".");
  for (var d = Math.max(a.length, b.length), e = 0; 0 == c && e < d; e++) {
    var f = a[e] || "", g = b[e] || "";
    do {
      f = /(\d*)(\D*)(.*)/.exec(f) || ["", "", "", ""];
      g = /(\d*)(\D*)(.*)/.exec(g) || ["", "", "", ""];
      if (0 == f[0].length && 0 == g[0].length) {
        break;
      }
      c = 0 == f[1].length ? 0 : parseInt(f[1], 10);
      var h = 0 == g[1].length ? 0 : parseInt(g[1], 10);
      c = goog.string.compareElements_(c, h) || goog.string.compareElements_(0 == f[2].length, 0 == g[2].length) || goog.string.compareElements_(f[2], g[2]);
      f = f[3];
      g = g[3];
    } while (0 == c);
  }
  return c;
};
goog.string.compareElements_ = function(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
};
goog.string.hashCode = function(a) {
  for (var b = 0, c = 0; c < a.length; ++c) {
    b = 31 * b + a.charCodeAt(c) >>> 0;
  }
  return b;
};
goog.string.uniqueStringCounter_ = 2147483648 * Math.random() | 0;
goog.string.createUniqueString = function() {
  return "goog_" + goog.string.uniqueStringCounter_++;
};
goog.string.toNumber = function(a) {
  var b = Number(a);
  return 0 == b && goog.string.isEmptyOrWhitespace(a) ? NaN : b;
};
goog.string.isLowerCamelCase = function(a) {
  return /^[a-z]+([A-Z][a-z]*)*$/.test(a);
};
goog.string.isUpperCamelCase = function(a) {
  return /^([A-Z][a-z]*)+$/.test(a);
};
goog.string.toCamelCase = function(a) {
  return String(a).replace(/\-([a-z])/g, function(a, c) {
    return c.toUpperCase();
  });
};
goog.string.toSelectorCase = function(a) {
  return String(a).replace(/([A-Z])/g, "-$1").toLowerCase();
};
goog.string.toTitleCase = function(a, b) {
  b = goog.isString(b) ? goog.string.regExpEscape(b) : "\\s";
  return a.replace(new RegExp("(^" + (b ? "|[" + b + "]+" : "") + ")([a-z])", "g"), function(a, b, e) {
    return b + e.toUpperCase();
  });
};
goog.string.capitalize = function(a) {
  return String(a.charAt(0)).toUpperCase() + String(a.substr(1)).toLowerCase();
};
goog.string.parseInt = function(a) {
  isFinite(a) && (a = String(a));
  return goog.isString(a) ? /^\s*-?0x/i.test(a) ? parseInt(a, 16) : parseInt(a, 10) : NaN;
};
goog.string.splitLimit = function(a, b, c) {
  a = a.split(b);
  for (var d = []; 0 < c && a.length;) {
    d.push(a.shift()), c--;
  }
  a.length && d.push(a.join(b));
  return d;
};
goog.string.lastComponent = function(a, b) {
  if (b) {
    "string" == typeof b && (b = [b]);
  } else {
    return a;
  }
  for (var c = -1, d = 0; d < b.length; d++) {
    if ("" != b[d]) {
      var e = a.lastIndexOf(b[d]);
      e > c && (c = e);
    }
  }
  return -1 == c ? a : a.slice(c + 1);
};
goog.string.editDistance = function(a, b) {
  var c = [], d = [];
  if (a == b) {
    return 0;
  }
  if (!a.length || !b.length) {
    return Math.max(a.length, b.length);
  }
  for (var e = 0; e < b.length + 1; e++) {
    c[e] = e;
  }
  for (e = 0; e < a.length; e++) {
    d[0] = e + 1;
    for (var f = 0; f < b.length; f++) {
      d[f + 1] = Math.min(d[f] + 1, c[f + 1] + 1, c[f] + Number(a[e] != b[f]));
    }
    for (f = 0; f < c.length; f++) {
      c[f] = d[f];
    }
  }
  return d[b.length];
};
goog.labs = {};
goog.labs.userAgent = {};
goog.labs.userAgent.util = {};
goog.labs.userAgent.util.getNativeUserAgentString_ = function() {
  var a = goog.labs.userAgent.util.getNavigator_();
  return a && (a = a.userAgent) ? a : "";
};
goog.labs.userAgent.util.getNavigator_ = function() {
  return goog.global.navigator;
};
goog.labs.userAgent.util.userAgent_ = goog.labs.userAgent.util.getNativeUserAgentString_();
goog.labs.userAgent.util.setUserAgent = function(a) {
  goog.labs.userAgent.util.userAgent_ = a || goog.labs.userAgent.util.getNativeUserAgentString_();
};
goog.labs.userAgent.util.getUserAgent = function() {
  return goog.labs.userAgent.util.userAgent_;
};
goog.labs.userAgent.util.matchUserAgent = function(a) {
  var b = goog.labs.userAgent.util.getUserAgent();
  return goog.string.contains(b, a);
};
goog.labs.userAgent.util.matchUserAgentIgnoreCase = function(a) {
  var b = goog.labs.userAgent.util.getUserAgent();
  return goog.string.caseInsensitiveContains(b, a);
};
goog.labs.userAgent.util.extractVersionTuples = function(a) {
  for (var b = /(\w[\w ]+)\/([^\s]+)\s*(?:\((.*?)\))?/g, c = [], d; d = b.exec(a);) {
    c.push([d[1], d[2], d[3] || void 0]);
  }
  return c;
};
goog.object = {};
goog.object.is = function(a, b) {
  return a === b ? 0 !== a || 1 / a === 1 / b : a !== a && b !== b;
};
goog.object.forEach = function(a, b, c) {
  for (var d in a) {
    b.call(c, a[d], d, a);
  }
};
goog.object.filter = function(a, b, c) {
  var d = {}, e;
  for (e in a) {
    b.call(c, a[e], e, a) && (d[e] = a[e]);
  }
  return d;
};
goog.object.map = function(a, b, c) {
  var d = {}, e;
  for (e in a) {
    d[e] = b.call(c, a[e], e, a);
  }
  return d;
};
goog.object.some = function(a, b, c) {
  for (var d in a) {
    if (b.call(c, a[d], d, a)) {
      return !0;
    }
  }
  return !1;
};
goog.object.every = function(a, b, c) {
  for (var d in a) {
    if (!b.call(c, a[d], d, a)) {
      return !1;
    }
  }
  return !0;
};
goog.object.getCount = function(a) {
  var b = 0, c;
  for (c in a) {
    b++;
  }
  return b;
};
goog.object.getAnyKey = function(a) {
  for (var b in a) {
    return b;
  }
};
goog.object.getAnyValue = function(a) {
  for (var b in a) {
    return a[b];
  }
};
goog.object.contains = function(a, b) {
  return goog.object.containsValue(a, b);
};
goog.object.getValues = function(a) {
  var b = [], c = 0, d;
  for (d in a) {
    b[c++] = a[d];
  }
  return b;
};
goog.object.getKeys = function(a) {
  var b = [], c = 0, d;
  for (d in a) {
    b[c++] = d;
  }
  return b;
};
goog.object.getValueByKeys = function(a, b) {
  var c = goog.isArrayLike(b), d = c ? b : arguments;
  for (c = c ? 0 : 1; c < d.length; c++) {
    if (null == a) {
      return;
    }
    a = a[d[c]];
  }
  return a;
};
goog.object.containsKey = function(a, b) {
  return null !== a && b in a;
};
goog.object.containsValue = function(a, b) {
  for (var c in a) {
    if (a[c] == b) {
      return !0;
    }
  }
  return !1;
};
goog.object.findKey = function(a, b, c) {
  for (var d in a) {
    if (b.call(c, a[d], d, a)) {
      return d;
    }
  }
};
goog.object.findValue = function(a, b, c) {
  return (b = goog.object.findKey(a, b, c)) && a[b];
};
goog.object.isEmpty = function(a) {
  for (var b in a) {
    return !1;
  }
  return !0;
};
goog.object.clear = function(a) {
  for (var b in a) {
    delete a[b];
  }
};
goog.object.remove = function(a, b) {
  var c;
  (c = b in a) && delete a[b];
  return c;
};
goog.object.add = function(a, b, c) {
  if (null !== a && b in a) {
    throw Error('The object already contains the key "' + b + '"');
  }
  goog.object.set(a, b, c);
};
goog.object.get = function(a, b, c) {
  return null !== a && b in a ? a[b] : c;
};
goog.object.set = function(a, b, c) {
  a[b] = c;
};
goog.object.setIfUndefined = function(a, b, c) {
  return b in a ? a[b] : a[b] = c;
};
goog.object.setWithReturnValueIfNotSet = function(a, b, c) {
  if (b in a) {
    return a[b];
  }
  c = c();
  return a[b] = c;
};
goog.object.equals = function(a, b) {
  for (var c in a) {
    if (!(c in b) || a[c] !== b[c]) {
      return !1;
    }
  }
  for (c in b) {
    if (!(c in a)) {
      return !1;
    }
  }
  return !0;
};
goog.object.clone = function(a) {
  var b = {}, c;
  for (c in a) {
    b[c] = a[c];
  }
  return b;
};
goog.object.unsafeClone = function(a) {
  var b = goog.typeOf(a);
  if ("object" == b || "array" == b) {
    if (goog.isFunction(a.clone)) {
      return a.clone();
    }
    b = "array" == b ? [] : {};
    for (var c in a) {
      b[c] = goog.object.unsafeClone(a[c]);
    }
    return b;
  }
  return a;
};
goog.object.transpose = function(a) {
  var b = {}, c;
  for (c in a) {
    b[a[c]] = c;
  }
  return b;
};
goog.object.PROTOTYPE_FIELDS_ = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");
goog.object.extend = function(a, b) {
  for (var c, d, e = 1; e < arguments.length; e++) {
    d = arguments[e];
    for (c in d) {
      a[c] = d[c];
    }
    for (var f = 0; f < goog.object.PROTOTYPE_FIELDS_.length; f++) {
      c = goog.object.PROTOTYPE_FIELDS_[f], Object.prototype.hasOwnProperty.call(d, c) && (a[c] = d[c]);
    }
  }
};
goog.object.create = function(a) {
  var b = arguments.length;
  if (1 == b && goog.isArray(arguments[0])) {
    return goog.object.create.apply(null, arguments[0]);
  }
  if (b % 2) {
    throw Error("Uneven number of arguments");
  }
  for (var c = {}, d = 0; d < b; d += 2) {
    c[arguments[d]] = arguments[d + 1];
  }
  return c;
};
goog.object.createSet = function(a) {
  var b = arguments.length;
  if (1 == b && goog.isArray(arguments[0])) {
    return goog.object.createSet.apply(null, arguments[0]);
  }
  for (var c = {}, d = 0; d < b; d++) {
    c[arguments[d]] = !0;
  }
  return c;
};
goog.object.createImmutableView = function(a) {
  var b = a;
  Object.isFrozen && !Object.isFrozen(a) && (b = Object.create(a), Object.freeze(b));
  return b;
};
goog.object.isImmutableView = function(a) {
  return !!Object.isFrozen && Object.isFrozen(a);
};
goog.object.getAllPropertyNames = function(a, b, c) {
  if (!a) {
    return [];
  }
  if (!Object.getOwnPropertyNames || !Object.getPrototypeOf) {
    return goog.object.getKeys(a);
  }
  for (var d = {}; a && (a !== Object.prototype || b) && (a !== Function.prototype || c);) {
    for (var e = Object.getOwnPropertyNames(a), f = 0; f < e.length; f++) {
      d[e[f]] = !0;
    }
    a = Object.getPrototypeOf(a);
  }
  return goog.object.getKeys(d);
};
goog.labs.userAgent.browser = {};
goog.labs.userAgent.browser.matchOpera_ = function() {
  return goog.labs.userAgent.util.matchUserAgent("Opera");
};
goog.labs.userAgent.browser.matchIE_ = function() {
  return goog.labs.userAgent.util.matchUserAgent("Trident") || goog.labs.userAgent.util.matchUserAgent("MSIE");
};
goog.labs.userAgent.browser.matchEdge_ = function() {
  return goog.labs.userAgent.util.matchUserAgent("Edge");
};
goog.labs.userAgent.browser.matchFirefox_ = function() {
  return goog.labs.userAgent.util.matchUserAgent("Firefox");
};
goog.labs.userAgent.browser.matchSafari_ = function() {
  return goog.labs.userAgent.util.matchUserAgent("Safari") && !(goog.labs.userAgent.browser.matchChrome_() || goog.labs.userAgent.browser.matchCoast_() || goog.labs.userAgent.browser.matchOpera_() || goog.labs.userAgent.browser.matchEdge_() || goog.labs.userAgent.browser.isSilk() || goog.labs.userAgent.util.matchUserAgent("Android"));
};
goog.labs.userAgent.browser.matchCoast_ = function() {
  return goog.labs.userAgent.util.matchUserAgent("Coast");
};
goog.labs.userAgent.browser.matchIosWebview_ = function() {
  return (goog.labs.userAgent.util.matchUserAgent("iPad") || goog.labs.userAgent.util.matchUserAgent("iPhone")) && !goog.labs.userAgent.browser.matchSafari_() && !goog.labs.userAgent.browser.matchChrome_() && !goog.labs.userAgent.browser.matchCoast_() && goog.labs.userAgent.util.matchUserAgent("AppleWebKit");
};
goog.labs.userAgent.browser.matchChrome_ = function() {
  return (goog.labs.userAgent.util.matchUserAgent("Chrome") || goog.labs.userAgent.util.matchUserAgent("CriOS")) && !goog.labs.userAgent.browser.matchEdge_();
};
goog.labs.userAgent.browser.matchAndroidBrowser_ = function() {
  return goog.labs.userAgent.util.matchUserAgent("Android") && !(goog.labs.userAgent.browser.isChrome() || goog.labs.userAgent.browser.isFirefox() || goog.labs.userAgent.browser.isOpera() || goog.labs.userAgent.browser.isSilk());
};
goog.labs.userAgent.browser.isOpera = goog.labs.userAgent.browser.matchOpera_;
goog.labs.userAgent.browser.isIE = goog.labs.userAgent.browser.matchIE_;
goog.labs.userAgent.browser.isEdge = goog.labs.userAgent.browser.matchEdge_;
goog.labs.userAgent.browser.isFirefox = goog.labs.userAgent.browser.matchFirefox_;
goog.labs.userAgent.browser.isSafari = goog.labs.userAgent.browser.matchSafari_;
goog.labs.userAgent.browser.isCoast = goog.labs.userAgent.browser.matchCoast_;
goog.labs.userAgent.browser.isIosWebview = goog.labs.userAgent.browser.matchIosWebview_;
goog.labs.userAgent.browser.isChrome = goog.labs.userAgent.browser.matchChrome_;
goog.labs.userAgent.browser.isAndroidBrowser = goog.labs.userAgent.browser.matchAndroidBrowser_;
goog.labs.userAgent.browser.isSilk = function() {
  return goog.labs.userAgent.util.matchUserAgent("Silk");
};
goog.labs.userAgent.browser.getVersion = function() {
  function a(a) {
    a = goog.array.find(a, d);
    return c[a] || "";
  }
  var b = goog.labs.userAgent.util.getUserAgent();
  if (goog.labs.userAgent.browser.isIE()) {
    return goog.labs.userAgent.browser.getIEVersion_(b);
  }
  b = goog.labs.userAgent.util.extractVersionTuples(b);
  var c = {};
  goog.array.forEach(b, function(a) {
    c[a[0]] = a[1];
  });
  var d = goog.partial(goog.object.containsKey, c);
  return goog.labs.userAgent.browser.isOpera() ? a(["Version", "Opera"]) : goog.labs.userAgent.browser.isEdge() ? a(["Edge"]) : goog.labs.userAgent.browser.isChrome() ? a(["Chrome", "CriOS"]) : (b = b[2]) && b[1] || "";
};
goog.labs.userAgent.browser.isVersionOrHigher = function(a) {
  return 0 <= goog.string.compareVersions(goog.labs.userAgent.browser.getVersion(), a);
};
goog.labs.userAgent.browser.getIEVersion_ = function(a) {
  var b = /rv: *([\d\.]*)/.exec(a);
  if (b && b[1]) {
    return b[1];
  }
  b = "";
  var c = /MSIE +([\d\.]+)/.exec(a);
  if (c && c[1]) {
    if (a = /Trident\/(\d.\d)/.exec(a), "7.0" == c[1]) {
      if (a && a[1]) {
        switch(a[1]) {
          case "4.0":
            b = "8.0";
            break;
          case "5.0":
            b = "9.0";
            break;
          case "6.0":
            b = "10.0";
            break;
          case "7.0":
            b = "11.0";
        }
      } else {
        b = "7.0";
      }
    } else {
      b = c[1];
    }
  }
  return b;
};
goog.labs.userAgent.engine = {};
goog.labs.userAgent.engine.isPresto = function() {
  return goog.labs.userAgent.util.matchUserAgent("Presto");
};
goog.labs.userAgent.engine.isTrident = function() {
  return goog.labs.userAgent.util.matchUserAgent("Trident") || goog.labs.userAgent.util.matchUserAgent("MSIE");
};
goog.labs.userAgent.engine.isEdge = function() {
  return goog.labs.userAgent.util.matchUserAgent("Edge");
};
goog.labs.userAgent.engine.isWebKit = function() {
  return goog.labs.userAgent.util.matchUserAgentIgnoreCase("WebKit") && !goog.labs.userAgent.engine.isEdge();
};
goog.labs.userAgent.engine.isGecko = function() {
  return goog.labs.userAgent.util.matchUserAgent("Gecko") && !goog.labs.userAgent.engine.isWebKit() && !goog.labs.userAgent.engine.isTrident() && !goog.labs.userAgent.engine.isEdge();
};
goog.labs.userAgent.engine.getVersion = function() {
  var a = goog.labs.userAgent.util.getUserAgent();
  if (a) {
    a = goog.labs.userAgent.util.extractVersionTuples(a);
    var b = goog.labs.userAgent.engine.getEngineTuple_(a);
    if (b) {
      return "Gecko" == b[0] ? goog.labs.userAgent.engine.getVersionForKey_(a, "Firefox") : b[1];
    }
    a = a[0];
    var c;
    if (a && (c = a[2]) && (c = /Trident\/([^\s;]+)/.exec(c))) {
      return c[1];
    }
  }
  return "";
};
goog.labs.userAgent.engine.getEngineTuple_ = function(a) {
  if (!goog.labs.userAgent.engine.isEdge()) {
    return a[1];
  }
  for (var b = 0; b < a.length; b++) {
    var c = a[b];
    if ("Edge" == c[0]) {
      return c;
    }
  }
};
goog.labs.userAgent.engine.isVersionOrHigher = function(a) {
  return 0 <= goog.string.compareVersions(goog.labs.userAgent.engine.getVersion(), a);
};
goog.labs.userAgent.engine.getVersionForKey_ = function(a, b) {
  return (a = goog.array.find(a, function(a) {
    return b == a[0];
  })) && a[1] || "";
};
goog.labs.userAgent.platform = {};
goog.labs.userAgent.platform.isAndroid = function() {
  return goog.labs.userAgent.util.matchUserAgent("Android");
};
goog.labs.userAgent.platform.isIpod = function() {
  return goog.labs.userAgent.util.matchUserAgent("iPod");
};
goog.labs.userAgent.platform.isIphone = function() {
  return goog.labs.userAgent.util.matchUserAgent("iPhone") && !goog.labs.userAgent.util.matchUserAgent("iPod") && !goog.labs.userAgent.util.matchUserAgent("iPad");
};
goog.labs.userAgent.platform.isIpad = function() {
  return goog.labs.userAgent.util.matchUserAgent("iPad");
};
goog.labs.userAgent.platform.isIos = function() {
  return goog.labs.userAgent.platform.isIphone() || goog.labs.userAgent.platform.isIpad() || goog.labs.userAgent.platform.isIpod();
};
goog.labs.userAgent.platform.isMacintosh = function() {
  return goog.labs.userAgent.util.matchUserAgent("Macintosh");
};
goog.labs.userAgent.platform.isLinux = function() {
  return goog.labs.userAgent.util.matchUserAgent("Linux");
};
goog.labs.userAgent.platform.isWindows = function() {
  return goog.labs.userAgent.util.matchUserAgent("Windows");
};
goog.labs.userAgent.platform.isChromeOS = function() {
  return goog.labs.userAgent.util.matchUserAgent("CrOS");
};
goog.labs.userAgent.platform.isChromecast = function() {
  return goog.labs.userAgent.util.matchUserAgent("CrKey");
};
goog.labs.userAgent.platform.getVersion = function() {
  var a = goog.labs.userAgent.util.getUserAgent(), b = "";
  goog.labs.userAgent.platform.isWindows() ? (b = /Windows (?:NT|Phone) ([0-9.]+)/, b = (a = b.exec(a)) ? a[1] : "0.0") : goog.labs.userAgent.platform.isIos() ? (b = /(?:iPhone|iPod|iPad|CPU)\s+OS\s+(\S+)/, b = (a = b.exec(a)) && a[1].replace(/_/g, ".")) : goog.labs.userAgent.platform.isMacintosh() ? (b = /Mac OS X ([0-9_.]+)/, b = (a = b.exec(a)) ? a[1].replace(/_/g, ".") : "10") : goog.labs.userAgent.platform.isAndroid() ? (b = /Android\s+([^\);]+)(\)|;)/, b = (a = b.exec(a)) && a[1]) : goog.labs.userAgent.platform.isChromeOS() && 
  (b = /(?:CrOS\s+(?:i686|x86_64)\s+([0-9.]+))/, b = (a = b.exec(a)) && a[1]);
  return b || "";
};
goog.labs.userAgent.platform.isVersionOrHigher = function(a) {
  return 0 <= goog.string.compareVersions(goog.labs.userAgent.platform.getVersion(), a);
};
goog.reflect = {};
goog.reflect.object = function(a, b) {
  return b;
};
goog.reflect.objectProperty = function(a, b) {
  return a;
};
goog.reflect.sinkValue = function(a) {
  goog.reflect.sinkValue[" "](a);
  return a;
};
goog.reflect.sinkValue[" "] = goog.nullFunction;
goog.reflect.canAccessProperty = function(a, b) {
  try {
    return goog.reflect.sinkValue(a[b]), !0;
  } catch (c) {
  }
  return !1;
};
goog.reflect.cache = function(a, b, c, d) {
  d = d ? d(b) : b;
  return Object.prototype.hasOwnProperty.call(a, d) ? a[d] : a[d] = c(b);
};
goog.userAgent = {};
goog.userAgent.ASSUME_IE = !1;
goog.userAgent.ASSUME_EDGE = !1;
goog.userAgent.ASSUME_GECKO = !1;
goog.userAgent.ASSUME_WEBKIT = !1;
goog.userAgent.ASSUME_MOBILE_WEBKIT = !1;
goog.userAgent.ASSUME_OPERA = !1;
goog.userAgent.ASSUME_ANY_VERSION = !1;
goog.userAgent.BROWSER_KNOWN_ = goog.userAgent.ASSUME_IE || goog.userAgent.ASSUME_EDGE || goog.userAgent.ASSUME_GECKO || goog.userAgent.ASSUME_MOBILE_WEBKIT || goog.userAgent.ASSUME_WEBKIT || goog.userAgent.ASSUME_OPERA;
goog.userAgent.getUserAgentString = function() {
  return goog.labs.userAgent.util.getUserAgent();
};
goog.userAgent.getNavigatorTyped = function() {
  return goog.global.navigator || null;
};
goog.userAgent.getNavigator = function() {
  return goog.userAgent.getNavigatorTyped();
};
goog.userAgent.OPERA = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_OPERA : goog.labs.userAgent.browser.isOpera();
goog.userAgent.IE = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_IE : goog.labs.userAgent.browser.isIE();
goog.userAgent.EDGE = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_EDGE : goog.labs.userAgent.engine.isEdge();
goog.userAgent.EDGE_OR_IE = goog.userAgent.EDGE || goog.userAgent.IE;
goog.userAgent.GECKO = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_GECKO : goog.labs.userAgent.engine.isGecko();
goog.userAgent.WEBKIT = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_WEBKIT || goog.userAgent.ASSUME_MOBILE_WEBKIT : goog.labs.userAgent.engine.isWebKit();
goog.userAgent.isMobile_ = function() {
  return goog.userAgent.WEBKIT && goog.labs.userAgent.util.matchUserAgent("Mobile");
};
goog.userAgent.MOBILE = goog.userAgent.ASSUME_MOBILE_WEBKIT || goog.userAgent.isMobile_();
goog.userAgent.SAFARI = goog.userAgent.WEBKIT;
goog.userAgent.determinePlatform_ = function() {
  var a = goog.userAgent.getNavigatorTyped();
  return a && a.platform || "";
};
goog.userAgent.PLATFORM = goog.userAgent.determinePlatform_();
goog.userAgent.ASSUME_MAC = !1;
goog.userAgent.ASSUME_WINDOWS = !1;
goog.userAgent.ASSUME_LINUX = !1;
goog.userAgent.ASSUME_X11 = !1;
goog.userAgent.ASSUME_ANDROID = !1;
goog.userAgent.ASSUME_IPHONE = !1;
goog.userAgent.ASSUME_IPAD = !1;
goog.userAgent.ASSUME_IPOD = !1;
goog.userAgent.PLATFORM_KNOWN_ = goog.userAgent.ASSUME_MAC || goog.userAgent.ASSUME_WINDOWS || goog.userAgent.ASSUME_LINUX || goog.userAgent.ASSUME_X11 || goog.userAgent.ASSUME_ANDROID || goog.userAgent.ASSUME_IPHONE || goog.userAgent.ASSUME_IPAD || goog.userAgent.ASSUME_IPOD;
goog.userAgent.MAC = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_MAC : goog.labs.userAgent.platform.isMacintosh();
goog.userAgent.WINDOWS = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_WINDOWS : goog.labs.userAgent.platform.isWindows();
goog.userAgent.isLegacyLinux_ = function() {
  return goog.labs.userAgent.platform.isLinux() || goog.labs.userAgent.platform.isChromeOS();
};
goog.userAgent.LINUX = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_LINUX : goog.userAgent.isLegacyLinux_();
goog.userAgent.isX11_ = function() {
  var a = goog.userAgent.getNavigatorTyped();
  return !!a && goog.string.contains(a.appVersion || "", "X11");
};
goog.userAgent.X11 = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_X11 : goog.userAgent.isX11_();
goog.userAgent.ANDROID = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_ANDROID : goog.labs.userAgent.platform.isAndroid();
goog.userAgent.IPHONE = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_IPHONE : goog.labs.userAgent.platform.isIphone();
goog.userAgent.IPAD = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_IPAD : goog.labs.userAgent.platform.isIpad();
goog.userAgent.IPOD = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_IPOD : goog.labs.userAgent.platform.isIpod();
goog.userAgent.IOS = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_IPHONE || goog.userAgent.ASSUME_IPAD || goog.userAgent.ASSUME_IPOD : goog.labs.userAgent.platform.isIos();
goog.userAgent.determineVersion_ = function() {
  var a = "", b = goog.userAgent.getVersionRegexResult_();
  b && (a = b ? b[1] : "");
  return goog.userAgent.IE && (b = goog.userAgent.getDocumentMode_(), null != b && b > parseFloat(a)) ? String(b) : a;
};
goog.userAgent.getVersionRegexResult_ = function() {
  var a = goog.userAgent.getUserAgentString();
  if (goog.userAgent.GECKO) {
    return /rv:([^\);]+)(\)|;)/.exec(a);
  }
  if (goog.userAgent.EDGE) {
    return /Edge\/([\d\.]+)/.exec(a);
  }
  if (goog.userAgent.IE) {
    return /\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/.exec(a);
  }
  if (goog.userAgent.WEBKIT) {
    return /WebKit\/(\S+)/.exec(a);
  }
  if (goog.userAgent.OPERA) {
    return /(?:Version)[ \/]?(\S+)/.exec(a);
  }
};
goog.userAgent.getDocumentMode_ = function() {
  var a = goog.global.document;
  return a ? a.documentMode : void 0;
};
goog.userAgent.VERSION = goog.userAgent.determineVersion_();
goog.userAgent.compare = function(a, b) {
  return goog.string.compareVersions(a, b);
};
goog.userAgent.isVersionOrHigherCache_ = {};
goog.userAgent.isVersionOrHigher = function(a) {
  return goog.userAgent.ASSUME_ANY_VERSION || goog.reflect.cache(goog.userAgent.isVersionOrHigherCache_, a, function() {
    return 0 <= goog.string.compareVersions(goog.userAgent.VERSION, a);
  });
};
goog.userAgent.isVersion = goog.userAgent.isVersionOrHigher;
goog.userAgent.isDocumentModeOrHigher = function(a) {
  return Number(goog.userAgent.DOCUMENT_MODE) >= a;
};
goog.userAgent.isDocumentMode = goog.userAgent.isDocumentModeOrHigher;
goog.userAgent.DOCUMENT_MODE = function() {
  var a = goog.global.document, b = goog.userAgent.getDocumentMode_();
  if (a && goog.userAgent.IE) {
    return b || ("CSS1Compat" == a.compatMode ? parseInt(goog.userAgent.VERSION, 10) : 5);
  }
}();
goog.dom.BrowserFeature = {CAN_ADD_NAME_OR_TYPE_ATTRIBUTES:!goog.userAgent.IE || goog.userAgent.isDocumentModeOrHigher(9), CAN_USE_CHILDREN_ATTRIBUTE:!goog.userAgent.GECKO && !goog.userAgent.IE || goog.userAgent.IE && goog.userAgent.isDocumentModeOrHigher(9) || goog.userAgent.GECKO && goog.userAgent.isVersionOrHigher("1.9.1"), CAN_USE_INNER_TEXT:goog.userAgent.IE && !goog.userAgent.isVersionOrHigher("9"), CAN_USE_PARENT_ELEMENT_PROPERTY:goog.userAgent.IE || goog.userAgent.OPERA || goog.userAgent.WEBKIT, 
INNER_HTML_NEEDS_SCOPED_ELEMENT:goog.userAgent.IE, LEGACY_IE_RANGES:goog.userAgent.IE && !goog.userAgent.isDocumentModeOrHigher(9)};
goog.dom.HtmlElement = function() {
};
goog.dom.TagName = function(a) {
  this.tagName_ = a;
};
goog.dom.TagName.prototype.toString = function() {
  return this.tagName_;
};
goog.dom.TagName.A = new goog.dom.TagName("A");
goog.dom.TagName.ABBR = new goog.dom.TagName("ABBR");
goog.dom.TagName.ACRONYM = new goog.dom.TagName("ACRONYM");
goog.dom.TagName.ADDRESS = new goog.dom.TagName("ADDRESS");
goog.dom.TagName.APPLET = new goog.dom.TagName("APPLET");
goog.dom.TagName.AREA = new goog.dom.TagName("AREA");
goog.dom.TagName.ARTICLE = new goog.dom.TagName("ARTICLE");
goog.dom.TagName.ASIDE = new goog.dom.TagName("ASIDE");
goog.dom.TagName.AUDIO = new goog.dom.TagName("AUDIO");
goog.dom.TagName.B = new goog.dom.TagName("B");
goog.dom.TagName.BASE = new goog.dom.TagName("BASE");
goog.dom.TagName.BASEFONT = new goog.dom.TagName("BASEFONT");
goog.dom.TagName.BDI = new goog.dom.TagName("BDI");
goog.dom.TagName.BDO = new goog.dom.TagName("BDO");
goog.dom.TagName.BIG = new goog.dom.TagName("BIG");
goog.dom.TagName.BLOCKQUOTE = new goog.dom.TagName("BLOCKQUOTE");
goog.dom.TagName.BODY = new goog.dom.TagName("BODY");
goog.dom.TagName.BR = new goog.dom.TagName("BR");
goog.dom.TagName.BUTTON = new goog.dom.TagName("BUTTON");
goog.dom.TagName.CANVAS = new goog.dom.TagName("CANVAS");
goog.dom.TagName.CAPTION = new goog.dom.TagName("CAPTION");
goog.dom.TagName.CENTER = new goog.dom.TagName("CENTER");
goog.dom.TagName.CITE = new goog.dom.TagName("CITE");
goog.dom.TagName.CODE = new goog.dom.TagName("CODE");
goog.dom.TagName.COL = new goog.dom.TagName("COL");
goog.dom.TagName.COLGROUP = new goog.dom.TagName("COLGROUP");
goog.dom.TagName.COMMAND = new goog.dom.TagName("COMMAND");
goog.dom.TagName.DATA = new goog.dom.TagName("DATA");
goog.dom.TagName.DATALIST = new goog.dom.TagName("DATALIST");
goog.dom.TagName.DD = new goog.dom.TagName("DD");
goog.dom.TagName.DEL = new goog.dom.TagName("DEL");
goog.dom.TagName.DETAILS = new goog.dom.TagName("DETAILS");
goog.dom.TagName.DFN = new goog.dom.TagName("DFN");
goog.dom.TagName.DIALOG = new goog.dom.TagName("DIALOG");
goog.dom.TagName.DIR = new goog.dom.TagName("DIR");
goog.dom.TagName.DIV = new goog.dom.TagName("DIV");
goog.dom.TagName.DL = new goog.dom.TagName("DL");
goog.dom.TagName.DT = new goog.dom.TagName("DT");
goog.dom.TagName.EM = new goog.dom.TagName("EM");
goog.dom.TagName.EMBED = new goog.dom.TagName("EMBED");
goog.dom.TagName.FIELDSET = new goog.dom.TagName("FIELDSET");
goog.dom.TagName.FIGCAPTION = new goog.dom.TagName("FIGCAPTION");
goog.dom.TagName.FIGURE = new goog.dom.TagName("FIGURE");
goog.dom.TagName.FONT = new goog.dom.TagName("FONT");
goog.dom.TagName.FOOTER = new goog.dom.TagName("FOOTER");
goog.dom.TagName.FORM = new goog.dom.TagName("FORM");
goog.dom.TagName.FRAME = new goog.dom.TagName("FRAME");
goog.dom.TagName.FRAMESET = new goog.dom.TagName("FRAMESET");
goog.dom.TagName.H1 = new goog.dom.TagName("H1");
goog.dom.TagName.H2 = new goog.dom.TagName("H2");
goog.dom.TagName.H3 = new goog.dom.TagName("H3");
goog.dom.TagName.H4 = new goog.dom.TagName("H4");
goog.dom.TagName.H5 = new goog.dom.TagName("H5");
goog.dom.TagName.H6 = new goog.dom.TagName("H6");
goog.dom.TagName.HEAD = new goog.dom.TagName("HEAD");
goog.dom.TagName.HEADER = new goog.dom.TagName("HEADER");
goog.dom.TagName.HGROUP = new goog.dom.TagName("HGROUP");
goog.dom.TagName.HR = new goog.dom.TagName("HR");
goog.dom.TagName.HTML = new goog.dom.TagName("HTML");
goog.dom.TagName.I = new goog.dom.TagName("I");
goog.dom.TagName.IFRAME = new goog.dom.TagName("IFRAME");
goog.dom.TagName.IMG = new goog.dom.TagName("IMG");
goog.dom.TagName.INPUT = new goog.dom.TagName("INPUT");
goog.dom.TagName.INS = new goog.dom.TagName("INS");
goog.dom.TagName.ISINDEX = new goog.dom.TagName("ISINDEX");
goog.dom.TagName.KBD = new goog.dom.TagName("KBD");
goog.dom.TagName.KEYGEN = new goog.dom.TagName("KEYGEN");
goog.dom.TagName.LABEL = new goog.dom.TagName("LABEL");
goog.dom.TagName.LEGEND = new goog.dom.TagName("LEGEND");
goog.dom.TagName.LI = new goog.dom.TagName("LI");
goog.dom.TagName.LINK = new goog.dom.TagName("LINK");
goog.dom.TagName.MAIN = new goog.dom.TagName("MAIN");
goog.dom.TagName.MAP = new goog.dom.TagName("MAP");
goog.dom.TagName.MARK = new goog.dom.TagName("MARK");
goog.dom.TagName.MATH = new goog.dom.TagName("MATH");
goog.dom.TagName.MENU = new goog.dom.TagName("MENU");
goog.dom.TagName.MENUITEM = new goog.dom.TagName("MENUITEM");
goog.dom.TagName.META = new goog.dom.TagName("META");
goog.dom.TagName.METER = new goog.dom.TagName("METER");
goog.dom.TagName.NAV = new goog.dom.TagName("NAV");
goog.dom.TagName.NOFRAMES = new goog.dom.TagName("NOFRAMES");
goog.dom.TagName.NOSCRIPT = new goog.dom.TagName("NOSCRIPT");
goog.dom.TagName.OBJECT = new goog.dom.TagName("OBJECT");
goog.dom.TagName.OL = new goog.dom.TagName("OL");
goog.dom.TagName.OPTGROUP = new goog.dom.TagName("OPTGROUP");
goog.dom.TagName.OPTION = new goog.dom.TagName("OPTION");
goog.dom.TagName.OUTPUT = new goog.dom.TagName("OUTPUT");
goog.dom.TagName.P = new goog.dom.TagName("P");
goog.dom.TagName.PARAM = new goog.dom.TagName("PARAM");
goog.dom.TagName.PICTURE = new goog.dom.TagName("PICTURE");
goog.dom.TagName.PRE = new goog.dom.TagName("PRE");
goog.dom.TagName.PROGRESS = new goog.dom.TagName("PROGRESS");
goog.dom.TagName.Q = new goog.dom.TagName("Q");
goog.dom.TagName.RP = new goog.dom.TagName("RP");
goog.dom.TagName.RT = new goog.dom.TagName("RT");
goog.dom.TagName.RTC = new goog.dom.TagName("RTC");
goog.dom.TagName.RUBY = new goog.dom.TagName("RUBY");
goog.dom.TagName.S = new goog.dom.TagName("S");
goog.dom.TagName.SAMP = new goog.dom.TagName("SAMP");
goog.dom.TagName.SCRIPT = new goog.dom.TagName("SCRIPT");
goog.dom.TagName.SECTION = new goog.dom.TagName("SECTION");
goog.dom.TagName.SELECT = new goog.dom.TagName("SELECT");
goog.dom.TagName.SMALL = new goog.dom.TagName("SMALL");
goog.dom.TagName.SOURCE = new goog.dom.TagName("SOURCE");
goog.dom.TagName.SPAN = new goog.dom.TagName("SPAN");
goog.dom.TagName.STRIKE = new goog.dom.TagName("STRIKE");
goog.dom.TagName.STRONG = new goog.dom.TagName("STRONG");
goog.dom.TagName.STYLE = new goog.dom.TagName("STYLE");
goog.dom.TagName.SUB = new goog.dom.TagName("SUB");
goog.dom.TagName.SUMMARY = new goog.dom.TagName("SUMMARY");
goog.dom.TagName.SUP = new goog.dom.TagName("SUP");
goog.dom.TagName.SVG = new goog.dom.TagName("SVG");
goog.dom.TagName.TABLE = new goog.dom.TagName("TABLE");
goog.dom.TagName.TBODY = new goog.dom.TagName("TBODY");
goog.dom.TagName.TD = new goog.dom.TagName("TD");
goog.dom.TagName.TEMPLATE = new goog.dom.TagName("TEMPLATE");
goog.dom.TagName.TEXTAREA = new goog.dom.TagName("TEXTAREA");
goog.dom.TagName.TFOOT = new goog.dom.TagName("TFOOT");
goog.dom.TagName.TH = new goog.dom.TagName("TH");
goog.dom.TagName.THEAD = new goog.dom.TagName("THEAD");
goog.dom.TagName.TIME = new goog.dom.TagName("TIME");
goog.dom.TagName.TITLE = new goog.dom.TagName("TITLE");
goog.dom.TagName.TR = new goog.dom.TagName("TR");
goog.dom.TagName.TRACK = new goog.dom.TagName("TRACK");
goog.dom.TagName.TT = new goog.dom.TagName("TT");
goog.dom.TagName.U = new goog.dom.TagName("U");
goog.dom.TagName.UL = new goog.dom.TagName("UL");
goog.dom.TagName.VAR = new goog.dom.TagName("VAR");
goog.dom.TagName.VIDEO = new goog.dom.TagName("VIDEO");
goog.dom.TagName.WBR = new goog.dom.TagName("WBR");
goog.dom.asserts = {};
goog.dom.asserts.assertIsLocation = function(a) {
  if (goog.asserts.ENABLE_ASSERTS) {
    var b = goog.dom.asserts.getWindow_(a);
    "undefined" != typeof b.Location && "undefined" != typeof b.Element && goog.asserts.assert(a && (a instanceof b.Location || !(a instanceof b.Element)), "Argument is not a Location (or a non-Element mock); got: %s", goog.dom.asserts.debugStringForType_(a));
  }
  return a;
};
goog.dom.asserts.assertIsElementType_ = function(a, b) {
  if (goog.asserts.ENABLE_ASSERTS) {
    var c = goog.dom.asserts.getWindow_(a);
    "undefined" != typeof c[b] && "undefined" != typeof c.Location && "undefined" != typeof c.Element && goog.asserts.assert(a && (a instanceof c[b] || !(a instanceof c.Location || a instanceof c.Element)), "Argument is not a %s (or a non-Element, non-Location mock); got: %s", b, goog.dom.asserts.debugStringForType_(a));
  }
  return a;
};
goog.dom.asserts.assertIsHTMLAnchorElement = function(a) {
  return goog.dom.asserts.assertIsElementType_(a, "HTMLAnchorElement");
};
goog.dom.asserts.assertIsHTMLButtonElement = function(a) {
  return goog.dom.asserts.assertIsElementType_(a, "HTMLButtonElement");
};
goog.dom.asserts.assertIsHTMLLinkElement = function(a) {
  return goog.dom.asserts.assertIsElementType_(a, "HTMLLinkElement");
};
goog.dom.asserts.assertIsHTMLImageElement = function(a) {
  return goog.dom.asserts.assertIsElementType_(a, "HTMLImageElement");
};
goog.dom.asserts.assertIsHTMLVideoElement = function(a) {
  return goog.dom.asserts.assertIsElementType_(a, "HTMLVideoElement");
};
goog.dom.asserts.assertIsHTMLInputElement = function(a) {
  return goog.dom.asserts.assertIsElementType_(a, "HTMLInputElement");
};
goog.dom.asserts.assertIsHTMLEmbedElement = function(a) {
  return goog.dom.asserts.assertIsElementType_(a, "HTMLEmbedElement");
};
goog.dom.asserts.assertIsHTMLFormElement = function(a) {
  return goog.dom.asserts.assertIsElementType_(a, "HTMLFormElement");
};
goog.dom.asserts.assertIsHTMLFrameElement = function(a) {
  return goog.dom.asserts.assertIsElementType_(a, "HTMLFrameElement");
};
goog.dom.asserts.assertIsHTMLIFrameElement = function(a) {
  return goog.dom.asserts.assertIsElementType_(a, "HTMLIFrameElement");
};
goog.dom.asserts.assertIsHTMLObjectElement = function(a) {
  return goog.dom.asserts.assertIsElementType_(a, "HTMLObjectElement");
};
goog.dom.asserts.assertIsHTMLScriptElement = function(a) {
  return goog.dom.asserts.assertIsElementType_(a, "HTMLScriptElement");
};
goog.dom.asserts.debugStringForType_ = function(a) {
  return goog.isObject(a) ? a.constructor.displayName || a.constructor.name || Object.prototype.toString.call(a) : void 0 === a ? "undefined" : null === a ? "null" : typeof a;
};
goog.dom.asserts.getWindow_ = function(a) {
  return (a = a && a.ownerDocument) && (a.defaultView || a.parentWindow) || goog.global;
};
goog.dom.tags = {};
goog.dom.tags.VOID_TAGS_ = {area:!0, base:!0, br:!0, col:!0, command:!0, embed:!0, hr:!0, img:!0, input:!0, keygen:!0, link:!0, meta:!0, param:!0, source:!0, track:!0, wbr:!0};
goog.dom.tags.isVoidTag = function(a) {
  return !0 === goog.dom.tags.VOID_TAGS_[a];
};
goog.string.TypedString = function() {
};
goog.string.Const = function() {
  this.stringConstValueWithSecurityContract__googStringSecurityPrivate_ = "";
  this.STRING_CONST_TYPE_MARKER__GOOG_STRING_SECURITY_PRIVATE_ = goog.string.Const.TYPE_MARKER_;
};
goog.string.Const.prototype.implementsGoogStringTypedString = !0;
goog.string.Const.prototype.getTypedStringValue = function() {
  return this.stringConstValueWithSecurityContract__googStringSecurityPrivate_;
};
goog.string.Const.prototype.toString = function() {
  return "Const{" + this.stringConstValueWithSecurityContract__googStringSecurityPrivate_ + "}";
};
goog.string.Const.unwrap = function(a) {
  if (a instanceof goog.string.Const && a.constructor === goog.string.Const && a.STRING_CONST_TYPE_MARKER__GOOG_STRING_SECURITY_PRIVATE_ === goog.string.Const.TYPE_MARKER_) {
    return a.stringConstValueWithSecurityContract__googStringSecurityPrivate_;
  }
  goog.asserts.fail("expected object of type Const, got '" + a + "'");
  return "type_error:Const";
};
goog.string.Const.from = function(a) {
  return goog.string.Const.create__googStringSecurityPrivate_(a);
};
goog.string.Const.TYPE_MARKER_ = {};
goog.string.Const.create__googStringSecurityPrivate_ = function(a) {
  var b = new goog.string.Const;
  b.stringConstValueWithSecurityContract__googStringSecurityPrivate_ = a;
  return b;
};
goog.string.Const.EMPTY = goog.string.Const.from("");
goog.html = {};
goog.html.SafeScript = function() {
  this.privateDoNotAccessOrElseSafeScriptWrappedValue_ = "";
  this.SAFE_SCRIPT_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = goog.html.SafeScript.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_;
};
goog.html.SafeScript.prototype.implementsGoogStringTypedString = !0;
goog.html.SafeScript.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = {};
goog.html.SafeScript.fromConstant = function(a) {
  a = goog.string.Const.unwrap(a);
  return 0 === a.length ? goog.html.SafeScript.EMPTY : goog.html.SafeScript.createSafeScriptSecurityPrivateDoNotAccessOrElse(a);
};
goog.html.SafeScript.fromConstantAndArgs = function(a, b) {
  for (var c = [], d = 1; d < arguments.length; d++) {
    c.push(goog.html.SafeScript.stringify_(arguments[d]));
  }
  return goog.html.SafeScript.createSafeScriptSecurityPrivateDoNotAccessOrElse("(" + goog.string.Const.unwrap(a) + ")(" + c.join(", ") + ");");
};
goog.html.SafeScript.prototype.getTypedStringValue = function() {
  return this.privateDoNotAccessOrElseSafeScriptWrappedValue_;
};
goog.DEBUG && (goog.html.SafeScript.prototype.toString = function() {
  return "SafeScript{" + this.privateDoNotAccessOrElseSafeScriptWrappedValue_ + "}";
});
goog.html.SafeScript.unwrap = function(a) {
  if (a instanceof goog.html.SafeScript && a.constructor === goog.html.SafeScript && a.SAFE_SCRIPT_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ === goog.html.SafeScript.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_) {
    return a.privateDoNotAccessOrElseSafeScriptWrappedValue_;
  }
  goog.asserts.fail("expected object of type SafeScript, got '" + a + "' of type " + goog.typeOf(a));
  return "type_error:SafeScript";
};
goog.html.SafeScript.stringify_ = function(a) {
  return JSON.stringify(a).replace(/</g, "\\x3c");
};
goog.html.SafeScript.createSafeScriptSecurityPrivateDoNotAccessOrElse = function(a) {
  return (new goog.html.SafeScript).initSecurityPrivateDoNotAccessOrElse_(a);
};
goog.html.SafeScript.prototype.initSecurityPrivateDoNotAccessOrElse_ = function(a) {
  this.privateDoNotAccessOrElseSafeScriptWrappedValue_ = a;
  return this;
};
goog.html.SafeScript.EMPTY = goog.html.SafeScript.createSafeScriptSecurityPrivateDoNotAccessOrElse("");
goog.fs = {};
goog.fs.url = {};
goog.fs.url.createObjectUrl = function(a) {
  return goog.fs.url.getUrlObject_().createObjectURL(a);
};
goog.fs.url.revokeObjectUrl = function(a) {
  goog.fs.url.getUrlObject_().revokeObjectURL(a);
};
goog.fs.url.getUrlObject_ = function() {
  var a = goog.fs.url.findUrlObject_();
  if (null != a) {
    return a;
  }
  throw Error("This browser doesn't seem to support blob URLs");
};
goog.fs.url.findUrlObject_ = function() {
  return goog.isDef(goog.global.URL) && goog.isDef(goog.global.URL.createObjectURL) ? goog.global.URL : goog.isDef(goog.global.webkitURL) && goog.isDef(goog.global.webkitURL.createObjectURL) ? goog.global.webkitURL : goog.isDef(goog.global.createObjectURL) ? goog.global : null;
};
goog.fs.url.browserSupportsObjectUrls = function() {
  return null != goog.fs.url.findUrlObject_();
};
goog.i18n = {};
goog.i18n.bidi = {};
goog.i18n.bidi.FORCE_RTL = !1;
goog.i18n.bidi.IS_RTL = goog.i18n.bidi.FORCE_RTL || ("ar" == goog.LOCALE.substring(0, 2).toLowerCase() || "fa" == goog.LOCALE.substring(0, 2).toLowerCase() || "he" == goog.LOCALE.substring(0, 2).toLowerCase() || "iw" == goog.LOCALE.substring(0, 2).toLowerCase() || "ps" == goog.LOCALE.substring(0, 2).toLowerCase() || "sd" == goog.LOCALE.substring(0, 2).toLowerCase() || "ug" == goog.LOCALE.substring(0, 2).toLowerCase() || "ur" == goog.LOCALE.substring(0, 2).toLowerCase() || "yi" == goog.LOCALE.substring(0, 
2).toLowerCase()) && (2 == goog.LOCALE.length || "-" == goog.LOCALE.substring(2, 3) || "_" == goog.LOCALE.substring(2, 3)) || 3 <= goog.LOCALE.length && "ckb" == goog.LOCALE.substring(0, 3).toLowerCase() && (3 == goog.LOCALE.length || "-" == goog.LOCALE.substring(3, 4) || "_" == goog.LOCALE.substring(3, 4));
goog.i18n.bidi.Format = {LRE:"\u202a", RLE:"\u202b", PDF:"\u202c", LRM:"\u200e", RLM:"\u200f"};
goog.i18n.bidi.Dir = {LTR:1, RTL:-1, NEUTRAL:0};
goog.i18n.bidi.RIGHT = "right";
goog.i18n.bidi.LEFT = "left";
goog.i18n.bidi.I18N_RIGHT = goog.i18n.bidi.IS_RTL ? goog.i18n.bidi.LEFT : goog.i18n.bidi.RIGHT;
goog.i18n.bidi.I18N_LEFT = goog.i18n.bidi.IS_RTL ? goog.i18n.bidi.RIGHT : goog.i18n.bidi.LEFT;
goog.i18n.bidi.toDir = function(a, b) {
  return "number" == typeof a ? 0 < a ? goog.i18n.bidi.Dir.LTR : 0 > a ? goog.i18n.bidi.Dir.RTL : b ? null : goog.i18n.bidi.Dir.NEUTRAL : null == a ? null : a ? goog.i18n.bidi.Dir.RTL : goog.i18n.bidi.Dir.LTR;
};
goog.i18n.bidi.ltrChars_ = "A-Za-z\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u02b8\u0300-\u0590\u0800-\u1fff\u200e\u2c00-\ufb1c\ufe00-\ufe6f\ufefd-\uffff";
goog.i18n.bidi.rtlChars_ = "\u0591-\u06ef\u06fa-\u07ff\u200f\ufb1d-\ufdff\ufe70-\ufefc";
goog.i18n.bidi.htmlSkipReg_ = /<[^>]*>|&[^;]+;/g;
goog.i18n.bidi.stripHtmlIfNeeded_ = function(a, b) {
  return b ? a.replace(goog.i18n.bidi.htmlSkipReg_, "") : a;
};
goog.i18n.bidi.rtlCharReg_ = new RegExp("[" + goog.i18n.bidi.rtlChars_ + "]");
goog.i18n.bidi.ltrCharReg_ = new RegExp("[" + goog.i18n.bidi.ltrChars_ + "]");
goog.i18n.bidi.hasAnyRtl = function(a, b) {
  return goog.i18n.bidi.rtlCharReg_.test(goog.i18n.bidi.stripHtmlIfNeeded_(a, b));
};
goog.i18n.bidi.hasRtlChar = goog.i18n.bidi.hasAnyRtl;
goog.i18n.bidi.hasAnyLtr = function(a, b) {
  return goog.i18n.bidi.ltrCharReg_.test(goog.i18n.bidi.stripHtmlIfNeeded_(a, b));
};
goog.i18n.bidi.ltrRe_ = new RegExp("^[" + goog.i18n.bidi.ltrChars_ + "]");
goog.i18n.bidi.rtlRe_ = new RegExp("^[" + goog.i18n.bidi.rtlChars_ + "]");
goog.i18n.bidi.isRtlChar = function(a) {
  return goog.i18n.bidi.rtlRe_.test(a);
};
goog.i18n.bidi.isLtrChar = function(a) {
  return goog.i18n.bidi.ltrRe_.test(a);
};
goog.i18n.bidi.isNeutralChar = function(a) {
  return !goog.i18n.bidi.isLtrChar(a) && !goog.i18n.bidi.isRtlChar(a);
};
goog.i18n.bidi.ltrDirCheckRe_ = new RegExp("^[^" + goog.i18n.bidi.rtlChars_ + "]*[" + goog.i18n.bidi.ltrChars_ + "]");
goog.i18n.bidi.rtlDirCheckRe_ = new RegExp("^[^" + goog.i18n.bidi.ltrChars_ + "]*[" + goog.i18n.bidi.rtlChars_ + "]");
goog.i18n.bidi.startsWithRtl = function(a, b) {
  return goog.i18n.bidi.rtlDirCheckRe_.test(goog.i18n.bidi.stripHtmlIfNeeded_(a, b));
};
goog.i18n.bidi.isRtlText = goog.i18n.bidi.startsWithRtl;
goog.i18n.bidi.startsWithLtr = function(a, b) {
  return goog.i18n.bidi.ltrDirCheckRe_.test(goog.i18n.bidi.stripHtmlIfNeeded_(a, b));
};
goog.i18n.bidi.isLtrText = goog.i18n.bidi.startsWithLtr;
goog.i18n.bidi.isRequiredLtrRe_ = /^http:\/\/.*/;
goog.i18n.bidi.isNeutralText = function(a, b) {
  a = goog.i18n.bidi.stripHtmlIfNeeded_(a, b);
  return goog.i18n.bidi.isRequiredLtrRe_.test(a) || !goog.i18n.bidi.hasAnyLtr(a) && !goog.i18n.bidi.hasAnyRtl(a);
};
goog.i18n.bidi.ltrExitDirCheckRe_ = new RegExp("[" + goog.i18n.bidi.ltrChars_ + "][^" + goog.i18n.bidi.rtlChars_ + "]*$");
goog.i18n.bidi.rtlExitDirCheckRe_ = new RegExp("[" + goog.i18n.bidi.rtlChars_ + "][^" + goog.i18n.bidi.ltrChars_ + "]*$");
goog.i18n.bidi.endsWithLtr = function(a, b) {
  return goog.i18n.bidi.ltrExitDirCheckRe_.test(goog.i18n.bidi.stripHtmlIfNeeded_(a, b));
};
goog.i18n.bidi.isLtrExitText = goog.i18n.bidi.endsWithLtr;
goog.i18n.bidi.endsWithRtl = function(a, b) {
  return goog.i18n.bidi.rtlExitDirCheckRe_.test(goog.i18n.bidi.stripHtmlIfNeeded_(a, b));
};
goog.i18n.bidi.isRtlExitText = goog.i18n.bidi.endsWithRtl;
goog.i18n.bidi.rtlLocalesRe_ = /^(ar|ckb|dv|he|iw|fa|nqo|ps|sd|ug|ur|yi|.*[-_](Arab|Hebr|Thaa|Nkoo|Tfng))(?!.*[-_](Latn|Cyrl)($|-|_))($|-|_)/i;
goog.i18n.bidi.isRtlLanguage = function(a) {
  return goog.i18n.bidi.rtlLocalesRe_.test(a);
};
goog.i18n.bidi.bracketGuardTextRe_ = /(\(.*?\)+)|(\[.*?\]+)|(\{.*?\}+)|(<.*?>+)/g;
goog.i18n.bidi.guardBracketInText = function(a, b) {
  b = (void 0 === b ? goog.i18n.bidi.hasAnyRtl(a) : b) ? goog.i18n.bidi.Format.RLM : goog.i18n.bidi.Format.LRM;
  return a.replace(goog.i18n.bidi.bracketGuardTextRe_, b + "$&" + b);
};
goog.i18n.bidi.enforceRtlInHtml = function(a) {
  return "<" == a.charAt(0) ? a.replace(/<\w+/, "$& dir=rtl") : "\n<span dir=rtl>" + a + "</span>";
};
goog.i18n.bidi.enforceRtlInText = function(a) {
  return goog.i18n.bidi.Format.RLE + a + goog.i18n.bidi.Format.PDF;
};
goog.i18n.bidi.enforceLtrInHtml = function(a) {
  return "<" == a.charAt(0) ? a.replace(/<\w+/, "$& dir=ltr") : "\n<span dir=ltr>" + a + "</span>";
};
goog.i18n.bidi.enforceLtrInText = function(a) {
  return goog.i18n.bidi.Format.LRE + a + goog.i18n.bidi.Format.PDF;
};
goog.i18n.bidi.dimensionsRe_ = /:\s*([.\d][.\w]*)\s+([.\d][.\w]*)\s+([.\d][.\w]*)\s+([.\d][.\w]*)/g;
goog.i18n.bidi.leftRe_ = /left/gi;
goog.i18n.bidi.rightRe_ = /right/gi;
goog.i18n.bidi.tempRe_ = /%%%%/g;
goog.i18n.bidi.mirrorCSS = function(a) {
  return a.replace(goog.i18n.bidi.dimensionsRe_, ":$1 $4 $3 $2").replace(goog.i18n.bidi.leftRe_, "%%%%").replace(goog.i18n.bidi.rightRe_, goog.i18n.bidi.LEFT).replace(goog.i18n.bidi.tempRe_, goog.i18n.bidi.RIGHT);
};
goog.i18n.bidi.doubleQuoteSubstituteRe_ = /([\u0591-\u05f2])"/g;
goog.i18n.bidi.singleQuoteSubstituteRe_ = /([\u0591-\u05f2])'/g;
goog.i18n.bidi.normalizeHebrewQuote = function(a) {
  return a.replace(goog.i18n.bidi.doubleQuoteSubstituteRe_, "$1\u05f4").replace(goog.i18n.bidi.singleQuoteSubstituteRe_, "$1\u05f3");
};
goog.i18n.bidi.wordSeparatorRe_ = /\s+/;
goog.i18n.bidi.hasNumeralsRe_ = /[\d\u06f0-\u06f9]/;
goog.i18n.bidi.rtlDetectionThreshold_ = 0.40;
goog.i18n.bidi.estimateDirection = function(a, b) {
  var c = 0, d = 0, e = !1;
  a = goog.i18n.bidi.stripHtmlIfNeeded_(a, b).split(goog.i18n.bidi.wordSeparatorRe_);
  for (b = 0; b < a.length; b++) {
    var f = a[b];
    goog.i18n.bidi.startsWithRtl(f) ? (c++, d++) : goog.i18n.bidi.isRequiredLtrRe_.test(f) ? e = !0 : goog.i18n.bidi.hasAnyLtr(f) ? d++ : goog.i18n.bidi.hasNumeralsRe_.test(f) && (e = !0);
  }
  return 0 == d ? e ? goog.i18n.bidi.Dir.LTR : goog.i18n.bidi.Dir.NEUTRAL : c / d > goog.i18n.bidi.rtlDetectionThreshold_ ? goog.i18n.bidi.Dir.RTL : goog.i18n.bidi.Dir.LTR;
};
goog.i18n.bidi.detectRtlDirectionality = function(a, b) {
  return goog.i18n.bidi.estimateDirection(a, b) == goog.i18n.bidi.Dir.RTL;
};
goog.i18n.bidi.setElementDirAndAlign = function(a, b) {
  a && (b = goog.i18n.bidi.toDir(b)) && (a.style.textAlign = b == goog.i18n.bidi.Dir.RTL ? goog.i18n.bidi.RIGHT : goog.i18n.bidi.LEFT, a.dir = b == goog.i18n.bidi.Dir.RTL ? "rtl" : "ltr");
};
goog.i18n.bidi.setElementDirByTextDirectionality = function(a, b) {
  switch(goog.i18n.bidi.estimateDirection(b)) {
    case goog.i18n.bidi.Dir.LTR:
      a.dir = "ltr";
      break;
    case goog.i18n.bidi.Dir.RTL:
      a.dir = "rtl";
      break;
    default:
      a.removeAttribute("dir");
  }
};
goog.i18n.bidi.DirectionalString = function() {
};
goog.html.TrustedResourceUrl = function() {
  this.privateDoNotAccessOrElseTrustedResourceUrlWrappedValue_ = "";
  this.TRUSTED_RESOURCE_URL_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = goog.html.TrustedResourceUrl.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_;
};
goog.html.TrustedResourceUrl.prototype.implementsGoogStringTypedString = !0;
goog.html.TrustedResourceUrl.prototype.getTypedStringValue = function() {
  return this.privateDoNotAccessOrElseTrustedResourceUrlWrappedValue_;
};
goog.html.TrustedResourceUrl.prototype.implementsGoogI18nBidiDirectionalString = !0;
goog.html.TrustedResourceUrl.prototype.getDirection = function() {
  return goog.i18n.bidi.Dir.LTR;
};
goog.html.TrustedResourceUrl.prototype.cloneWithParams = function(a) {
  var b = goog.html.TrustedResourceUrl.unwrap(this), c = /\?/.test(b) ? "&" : "?", d;
  for (d in a) {
    for (var e = goog.isArray(a[d]) ? a[d] : [a[d]], f = 0; f < e.length; f++) {
      null != e[f] && (b += c + encodeURIComponent(d) + "=" + encodeURIComponent(String(e[f])), c = "&");
    }
  }
  return goog.html.TrustedResourceUrl.createTrustedResourceUrlSecurityPrivateDoNotAccessOrElse(b);
};
goog.DEBUG && (goog.html.TrustedResourceUrl.prototype.toString = function() {
  return "TrustedResourceUrl{" + this.privateDoNotAccessOrElseTrustedResourceUrlWrappedValue_ + "}";
});
goog.html.TrustedResourceUrl.unwrap = function(a) {
  if (a instanceof goog.html.TrustedResourceUrl && a.constructor === goog.html.TrustedResourceUrl && a.TRUSTED_RESOURCE_URL_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ === goog.html.TrustedResourceUrl.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_) {
    return a.privateDoNotAccessOrElseTrustedResourceUrlWrappedValue_;
  }
  goog.asserts.fail("expected object of type TrustedResourceUrl, got '" + a + "' of type " + goog.typeOf(a));
  return "type_error:TrustedResourceUrl";
};
goog.html.TrustedResourceUrl.format = function(a, b) {
  var c = goog.string.Const.unwrap(a);
  if (!goog.html.TrustedResourceUrl.BASE_URL_.test(c)) {
    throw Error("Invalid TrustedResourceUrl format: " + c);
  }
  a = c.replace(goog.html.TrustedResourceUrl.FORMAT_MARKER_, function(a, e) {
    if (!Object.prototype.hasOwnProperty.call(b, e)) {
      throw Error('Found marker, "' + e + '", in format string, "' + c + '", but no valid label mapping found in args: ' + JSON.stringify(b));
    }
    a = b[e];
    return a instanceof goog.string.Const ? goog.string.Const.unwrap(a) : encodeURIComponent(String(a));
  });
  return goog.html.TrustedResourceUrl.createTrustedResourceUrlSecurityPrivateDoNotAccessOrElse(a);
};
goog.html.TrustedResourceUrl.FORMAT_MARKER_ = /%{(\w+)}/g;
goog.html.TrustedResourceUrl.BASE_URL_ = /^(?:https:)?\/\/[0-9a-z.:[\]-]+\/|^\/[^\/\\]|^about:blank#/i;
goog.html.TrustedResourceUrl.formatWithParams = function(a, b, c) {
  return goog.html.TrustedResourceUrl.format(a, b).cloneWithParams(c);
};
goog.html.TrustedResourceUrl.fromConstant = function(a) {
  return goog.html.TrustedResourceUrl.createTrustedResourceUrlSecurityPrivateDoNotAccessOrElse(goog.string.Const.unwrap(a));
};
goog.html.TrustedResourceUrl.fromConstants = function(a) {
  for (var b = "", c = 0; c < a.length; c++) {
    b += goog.string.Const.unwrap(a[c]);
  }
  return goog.html.TrustedResourceUrl.createTrustedResourceUrlSecurityPrivateDoNotAccessOrElse(b);
};
goog.html.TrustedResourceUrl.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = {};
goog.html.TrustedResourceUrl.createTrustedResourceUrlSecurityPrivateDoNotAccessOrElse = function(a) {
  var b = new goog.html.TrustedResourceUrl;
  b.privateDoNotAccessOrElseTrustedResourceUrlWrappedValue_ = a;
  return b;
};
goog.html.SafeUrl = function() {
  this.privateDoNotAccessOrElseSafeHtmlWrappedValue_ = "";
  this.SAFE_URL_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = goog.html.SafeUrl.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_;
};
goog.html.SafeUrl.INNOCUOUS_STRING = "about:invalid#zClosurez";
goog.html.SafeUrl.prototype.implementsGoogStringTypedString = !0;
goog.html.SafeUrl.prototype.getTypedStringValue = function() {
  return this.privateDoNotAccessOrElseSafeHtmlWrappedValue_;
};
goog.html.SafeUrl.prototype.implementsGoogI18nBidiDirectionalString = !0;
goog.html.SafeUrl.prototype.getDirection = function() {
  return goog.i18n.bidi.Dir.LTR;
};
goog.DEBUG && (goog.html.SafeUrl.prototype.toString = function() {
  return "SafeUrl{" + this.privateDoNotAccessOrElseSafeHtmlWrappedValue_ + "}";
});
goog.html.SafeUrl.unwrap = function(a) {
  if (a instanceof goog.html.SafeUrl && a.constructor === goog.html.SafeUrl && a.SAFE_URL_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ === goog.html.SafeUrl.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_) {
    return a.privateDoNotAccessOrElseSafeHtmlWrappedValue_;
  }
  goog.asserts.fail("expected object of type SafeUrl, got '" + a + "' of type " + goog.typeOf(a));
  return "type_error:SafeUrl";
};
goog.html.SafeUrl.fromConstant = function(a) {
  return goog.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse(goog.string.Const.unwrap(a));
};
goog.html.SAFE_MIME_TYPE_PATTERN_ = /^(?:audio\/(?:3gpp|3gpp2|aac|midi|mp4|mpeg|ogg|x-m4a|x-wav|webm)|image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|text\/csv|video\/(?:mpeg|mp4|ogg|webm|quicktime))$/i;
goog.html.SafeUrl.fromBlob = function(a) {
  a = goog.html.SAFE_MIME_TYPE_PATTERN_.test(a.type) ? goog.fs.url.createObjectUrl(a) : goog.html.SafeUrl.INNOCUOUS_STRING;
  return goog.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse(a);
};
goog.html.DATA_URL_PATTERN_ = /^data:([^;,]*);base64,[a-z0-9+\/]+=*$/i;
goog.html.SafeUrl.fromDataUrl = function(a) {
  var b = a.match(goog.html.DATA_URL_PATTERN_);
  b = b && goog.html.SAFE_MIME_TYPE_PATTERN_.test(b[1]);
  return goog.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse(b ? a : goog.html.SafeUrl.INNOCUOUS_STRING);
};
goog.html.SafeUrl.fromTelUrl = function(a) {
  goog.string.caseInsensitiveStartsWith(a, "tel:") || (a = goog.html.SafeUrl.INNOCUOUS_STRING);
  return goog.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse(a);
};
goog.html.SafeUrl.fromTrustedResourceUrl = function(a) {
  return goog.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse(goog.html.TrustedResourceUrl.unwrap(a));
};
goog.html.SAFE_URL_PATTERN_ = /^(?:(?:https?|mailto|ftp):|[^:/?#]*(?:[/?#]|$))/i;
goog.html.SafeUrl.sanitize = function(a) {
  if (a instanceof goog.html.SafeUrl) {
    return a;
  }
  a = a.implementsGoogStringTypedString ? a.getTypedStringValue() : String(a);
  goog.html.SAFE_URL_PATTERN_.test(a) || (a = goog.html.SafeUrl.INNOCUOUS_STRING);
  return goog.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse(a);
};
goog.html.SafeUrl.sanitizeAssertUnchanged = function(a) {
  if (a instanceof goog.html.SafeUrl) {
    return a;
  }
  a = a.implementsGoogStringTypedString ? a.getTypedStringValue() : String(a);
  goog.asserts.assert(goog.html.SAFE_URL_PATTERN_.test(a)) || (a = goog.html.SafeUrl.INNOCUOUS_STRING);
  return goog.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse(a);
};
goog.html.SafeUrl.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = {};
goog.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse = function(a) {
  var b = new goog.html.SafeUrl;
  b.privateDoNotAccessOrElseSafeHtmlWrappedValue_ = a;
  return b;
};
goog.html.SafeUrl.ABOUT_BLANK = goog.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse("about:blank");
goog.html.SafeStyle = function() {
  this.privateDoNotAccessOrElseSafeStyleWrappedValue_ = "";
  this.SAFE_STYLE_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = goog.html.SafeStyle.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_;
};
goog.html.SafeStyle.prototype.implementsGoogStringTypedString = !0;
goog.html.SafeStyle.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = {};
goog.html.SafeStyle.fromConstant = function(a) {
  a = goog.string.Const.unwrap(a);
  if (0 === a.length) {
    return goog.html.SafeStyle.EMPTY;
  }
  goog.html.SafeStyle.checkStyle_(a);
  goog.asserts.assert(goog.string.endsWith(a, ";"), "Last character of style string is not ';': " + a);
  goog.asserts.assert(goog.string.contains(a, ":"), "Style string must contain at least one ':', to specify a \"name: value\" pair: " + a);
  return goog.html.SafeStyle.createSafeStyleSecurityPrivateDoNotAccessOrElse(a);
};
goog.html.SafeStyle.checkStyle_ = function(a) {
  goog.asserts.assert(!/[<>]/.test(a), "Forbidden characters in style string: " + a);
};
goog.html.SafeStyle.prototype.getTypedStringValue = function() {
  return this.privateDoNotAccessOrElseSafeStyleWrappedValue_;
};
goog.DEBUG && (goog.html.SafeStyle.prototype.toString = function() {
  return "SafeStyle{" + this.privateDoNotAccessOrElseSafeStyleWrappedValue_ + "}";
});
goog.html.SafeStyle.unwrap = function(a) {
  if (a instanceof goog.html.SafeStyle && a.constructor === goog.html.SafeStyle && a.SAFE_STYLE_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ === goog.html.SafeStyle.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_) {
    return a.privateDoNotAccessOrElseSafeStyleWrappedValue_;
  }
  goog.asserts.fail("expected object of type SafeStyle, got '" + a + "' of type " + goog.typeOf(a));
  return "type_error:SafeStyle";
};
goog.html.SafeStyle.createSafeStyleSecurityPrivateDoNotAccessOrElse = function(a) {
  return (new goog.html.SafeStyle).initSecurityPrivateDoNotAccessOrElse_(a);
};
goog.html.SafeStyle.prototype.initSecurityPrivateDoNotAccessOrElse_ = function(a) {
  this.privateDoNotAccessOrElseSafeStyleWrappedValue_ = a;
  return this;
};
goog.html.SafeStyle.EMPTY = goog.html.SafeStyle.createSafeStyleSecurityPrivateDoNotAccessOrElse("");
goog.html.SafeStyle.INNOCUOUS_STRING = "zClosurez";
goog.html.SafeStyle.create = function(a) {
  var b = "", c;
  for (c in a) {
    if (!/^[-_a-zA-Z0-9]+$/.test(c)) {
      throw Error("Name allows only [-_a-zA-Z0-9], got: " + c);
    }
    var d = a[c];
    null != d && (d = goog.isArray(d) ? goog.array.map(d, goog.html.SafeStyle.sanitizePropertyValue_).join(" ") : goog.html.SafeStyle.sanitizePropertyValue_(d), b += c + ":" + d + ";");
  }
  if (!b) {
    return goog.html.SafeStyle.EMPTY;
  }
  goog.html.SafeStyle.checkStyle_(b);
  return goog.html.SafeStyle.createSafeStyleSecurityPrivateDoNotAccessOrElse(b);
};
goog.html.SafeStyle.sanitizePropertyValue_ = function(a) {
  if (a instanceof goog.html.SafeUrl) {
    return 'url("' + goog.html.SafeUrl.unwrap(a).replace(/</g, "%3c").replace(/[\\"]/g, "\\$&") + '")';
  }
  a = a instanceof goog.string.Const ? goog.string.Const.unwrap(a) : goog.html.SafeStyle.sanitizePropertyValueString_(String(a));
  goog.asserts.assert(!/[{;}]/.test(a), "Value does not allow [{;}].");
  return a;
};
goog.html.SafeStyle.sanitizePropertyValueString_ = function(a) {
  var b = a.replace(goog.html.SafeStyle.FUNCTIONS_RE_, "$1").replace(goog.html.SafeStyle.URL_RE_, "url");
  return goog.html.SafeStyle.VALUE_RE_.test(b) ? goog.html.SafeStyle.hasBalancedQuotes_(a) ? goog.html.SafeStyle.sanitizeUrl_(a) : (goog.asserts.fail("String value requires balanced quotes, got: " + a), goog.html.SafeStyle.INNOCUOUS_STRING) : (goog.asserts.fail("String value allows only " + goog.html.SafeStyle.VALUE_ALLOWED_CHARS_ + " and simple functions, got: " + a), goog.html.SafeStyle.INNOCUOUS_STRING);
};
goog.html.SafeStyle.hasBalancedQuotes_ = function(a) {
  for (var b = !0, c = !0, d = 0; d < a.length; d++) {
    var e = a.charAt(d);
    "'" == e && c ? b = !b : '"' == e && b && (c = !c);
  }
  return b && c;
};
goog.html.SafeStyle.VALUE_ALLOWED_CHARS_ = "[-,.\"'%_!# a-zA-Z0-9]";
goog.html.SafeStyle.VALUE_RE_ = new RegExp("^" + goog.html.SafeStyle.VALUE_ALLOWED_CHARS_ + "+$");
goog.html.SafeStyle.URL_RE_ = /\b(url\([ \t\n]*)('[ -&(-\[\]-~]*'|"[ !#-\[\]-~]*"|[!#-&*-\[\]-~]*)([ \t\n]*\))/g;
goog.html.SafeStyle.FUNCTIONS_RE_ = /\b(hsl|hsla|rgb|rgba|matrix|(rotate|scale|translate)(X|Y|Z|3d)?)\([-0-9a-z.%, ]+\)/g;
goog.html.SafeStyle.sanitizeUrl_ = function(a) {
  return a.replace(goog.html.SafeStyle.URL_RE_, function(a, c, d, e) {
    var b = "";
    d = d.replace(/^(['"])(.*)\1$/, function(a, c, d) {
      b = c;
      return d;
    });
    a = goog.html.SafeUrl.sanitize(d).getTypedStringValue();
    return c + b + a + b + e;
  });
};
goog.html.SafeStyle.concat = function(a) {
  var b = "", c = function(a) {
    goog.isArray(a) ? goog.array.forEach(a, c) : b += goog.html.SafeStyle.unwrap(a);
  };
  goog.array.forEach(arguments, c);
  return b ? goog.html.SafeStyle.createSafeStyleSecurityPrivateDoNotAccessOrElse(b) : goog.html.SafeStyle.EMPTY;
};
goog.html.SafeStyleSheet = function() {
  this.privateDoNotAccessOrElseSafeStyleSheetWrappedValue_ = "";
  this.SAFE_STYLE_SHEET_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = goog.html.SafeStyleSheet.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_;
};
goog.html.SafeStyleSheet.prototype.implementsGoogStringTypedString = !0;
goog.html.SafeStyleSheet.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = {};
goog.html.SafeStyleSheet.createRule = function(a, b) {
  if (goog.string.contains(a, "<")) {
    throw Error("Selector does not allow '<', got: " + a);
  }
  var c = a.replace(/('|")((?!\1)[^\r\n\f\\]|\\[\s\S])*\1/g, "");
  if (!/^[-_a-zA-Z0-9#.:* ,>+~[\]()=^$|]+$/.test(c)) {
    throw Error("Selector allows only [-_a-zA-Z0-9#.:* ,>+~[\\]()=^$|] and strings, got: " + a);
  }
  if (!goog.html.SafeStyleSheet.hasBalancedBrackets_(c)) {
    throw Error("() and [] in selector must be balanced, got: " + a);
  }
  b instanceof goog.html.SafeStyle || (b = goog.html.SafeStyle.create(b));
  a = a + "{" + goog.html.SafeStyle.unwrap(b) + "}";
  return goog.html.SafeStyleSheet.createSafeStyleSheetSecurityPrivateDoNotAccessOrElse(a);
};
goog.html.SafeStyleSheet.hasBalancedBrackets_ = function(a) {
  for (var b = {"(":")", "[":"]"}, c = [], d = 0; d < a.length; d++) {
    var e = a[d];
    if (b[e]) {
      c.push(b[e]);
    } else {
      if (goog.object.contains(b, e) && c.pop() != e) {
        return !1;
      }
    }
  }
  return 0 == c.length;
};
goog.html.SafeStyleSheet.concat = function(a) {
  var b = "", c = function(a) {
    goog.isArray(a) ? goog.array.forEach(a, c) : b += goog.html.SafeStyleSheet.unwrap(a);
  };
  goog.array.forEach(arguments, c);
  return goog.html.SafeStyleSheet.createSafeStyleSheetSecurityPrivateDoNotAccessOrElse(b);
};
goog.html.SafeStyleSheet.fromConstant = function(a) {
  a = goog.string.Const.unwrap(a);
  if (0 === a.length) {
    return goog.html.SafeStyleSheet.EMPTY;
  }
  goog.asserts.assert(!goog.string.contains(a, "<"), "Forbidden '<' character in style sheet string: " + a);
  return goog.html.SafeStyleSheet.createSafeStyleSheetSecurityPrivateDoNotAccessOrElse(a);
};
goog.html.SafeStyleSheet.prototype.getTypedStringValue = function() {
  return this.privateDoNotAccessOrElseSafeStyleSheetWrappedValue_;
};
goog.DEBUG && (goog.html.SafeStyleSheet.prototype.toString = function() {
  return "SafeStyleSheet{" + this.privateDoNotAccessOrElseSafeStyleSheetWrappedValue_ + "}";
});
goog.html.SafeStyleSheet.unwrap = function(a) {
  if (a instanceof goog.html.SafeStyleSheet && a.constructor === goog.html.SafeStyleSheet && a.SAFE_STYLE_SHEET_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ === goog.html.SafeStyleSheet.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_) {
    return a.privateDoNotAccessOrElseSafeStyleSheetWrappedValue_;
  }
  goog.asserts.fail("expected object of type SafeStyleSheet, got '" + a + "' of type " + goog.typeOf(a));
  return "type_error:SafeStyleSheet";
};
goog.html.SafeStyleSheet.createSafeStyleSheetSecurityPrivateDoNotAccessOrElse = function(a) {
  return (new goog.html.SafeStyleSheet).initSecurityPrivateDoNotAccessOrElse_(a);
};
goog.html.SafeStyleSheet.prototype.initSecurityPrivateDoNotAccessOrElse_ = function(a) {
  this.privateDoNotAccessOrElseSafeStyleSheetWrappedValue_ = a;
  return this;
};
goog.html.SafeStyleSheet.EMPTY = goog.html.SafeStyleSheet.createSafeStyleSheetSecurityPrivateDoNotAccessOrElse("");
goog.html.SafeHtml = function() {
  this.privateDoNotAccessOrElseSafeHtmlWrappedValue_ = "";
  this.SAFE_HTML_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = goog.html.SafeHtml.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_;
  this.dir_ = null;
};
goog.html.SafeHtml.prototype.implementsGoogI18nBidiDirectionalString = !0;
goog.html.SafeHtml.prototype.getDirection = function() {
  return this.dir_;
};
goog.html.SafeHtml.prototype.implementsGoogStringTypedString = !0;
goog.html.SafeHtml.prototype.getTypedStringValue = function() {
  return this.privateDoNotAccessOrElseSafeHtmlWrappedValue_;
};
goog.DEBUG && (goog.html.SafeHtml.prototype.toString = function() {
  return "SafeHtml{" + this.privateDoNotAccessOrElseSafeHtmlWrappedValue_ + "}";
});
goog.html.SafeHtml.unwrap = function(a) {
  if (a instanceof goog.html.SafeHtml && a.constructor === goog.html.SafeHtml && a.SAFE_HTML_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ === goog.html.SafeHtml.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_) {
    return a.privateDoNotAccessOrElseSafeHtmlWrappedValue_;
  }
  goog.asserts.fail("expected object of type SafeHtml, got '" + a + "' of type " + goog.typeOf(a));
  return "type_error:SafeHtml";
};
goog.html.SafeHtml.htmlEscape = function(a) {
  if (a instanceof goog.html.SafeHtml) {
    return a;
  }
  var b = null;
  a.implementsGoogI18nBidiDirectionalString && (b = a.getDirection());
  a = a.implementsGoogStringTypedString ? a.getTypedStringValue() : String(a);
  return goog.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse(goog.string.htmlEscape(a), b);
};
goog.html.SafeHtml.htmlEscapePreservingNewlines = function(a) {
  if (a instanceof goog.html.SafeHtml) {
    return a;
  }
  a = goog.html.SafeHtml.htmlEscape(a);
  return goog.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse(goog.string.newLineToBr(goog.html.SafeHtml.unwrap(a)), a.getDirection());
};
goog.html.SafeHtml.htmlEscapePreservingNewlinesAndSpaces = function(a) {
  if (a instanceof goog.html.SafeHtml) {
    return a;
  }
  a = goog.html.SafeHtml.htmlEscape(a);
  return goog.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse(goog.string.whitespaceEscape(goog.html.SafeHtml.unwrap(a)), a.getDirection());
};
goog.html.SafeHtml.from = goog.html.SafeHtml.htmlEscape;
goog.html.SafeHtml.VALID_NAMES_IN_TAG_ = /^[a-zA-Z0-9-]+$/;
goog.html.SafeHtml.URL_ATTRIBUTES_ = {action:!0, cite:!0, data:!0, formaction:!0, href:!0, manifest:!0, poster:!0, src:!0};
goog.html.SafeHtml.NOT_ALLOWED_TAG_NAMES_ = {APPLET:!0, BASE:!0, EMBED:!0, IFRAME:!0, LINK:!0, MATH:!0, META:!0, OBJECT:!0, SCRIPT:!0, STYLE:!0, SVG:!0, TEMPLATE:!0};
goog.html.SafeHtml.create = function(a, b, c) {
  goog.html.SafeHtml.verifyTagName(String(a));
  return goog.html.SafeHtml.createSafeHtmlTagSecurityPrivateDoNotAccessOrElse(String(a), b, c);
};
goog.html.SafeHtml.verifyTagName = function(a) {
  if (!goog.html.SafeHtml.VALID_NAMES_IN_TAG_.test(a)) {
    throw Error("Invalid tag name <" + a + ">.");
  }
  if (a.toUpperCase() in goog.html.SafeHtml.NOT_ALLOWED_TAG_NAMES_) {
    throw Error("Tag name <" + a + "> is not allowed for SafeHtml.");
  }
};
goog.html.SafeHtml.createIframe = function(a, b, c, d) {
  a && goog.html.TrustedResourceUrl.unwrap(a);
  var e = {};
  e.src = a || null;
  e.srcdoc = b && goog.html.SafeHtml.unwrap(b);
  a = goog.html.SafeHtml.combineAttributes(e, {sandbox:""}, c);
  return goog.html.SafeHtml.createSafeHtmlTagSecurityPrivateDoNotAccessOrElse("iframe", a, d);
};
goog.html.SafeHtml.createSandboxIframe = function(a, b, c, d) {
  if (!goog.html.SafeHtml.canUseSandboxIframe()) {
    throw Error("The browser does not support sandboxed iframes.");
  }
  var e = {};
  e.src = a ? goog.html.SafeUrl.unwrap(goog.html.SafeUrl.sanitize(a)) : null;
  e.srcdoc = b || null;
  e.sandbox = "";
  a = goog.html.SafeHtml.combineAttributes(e, {}, c);
  return goog.html.SafeHtml.createSafeHtmlTagSecurityPrivateDoNotAccessOrElse("iframe", a, d);
};
goog.html.SafeHtml.canUseSandboxIframe = function() {
  return goog.global.HTMLIFrameElement && "sandbox" in goog.global.HTMLIFrameElement.prototype;
};
goog.html.SafeHtml.createScriptSrc = function(a, b) {
  goog.html.TrustedResourceUrl.unwrap(a);
  a = goog.html.SafeHtml.combineAttributes({src:a}, {}, b);
  return goog.html.SafeHtml.createSafeHtmlTagSecurityPrivateDoNotAccessOrElse("script", a);
};
goog.html.SafeHtml.createScript = function(a, b) {
  for (var c in b) {
    var d = c.toLowerCase();
    if ("language" == d || "src" == d || "text" == d || "type" == d) {
      throw Error('Cannot set "' + d + '" attribute');
    }
  }
  c = "";
  a = goog.array.concat(a);
  for (d = 0; d < a.length; d++) {
    c += goog.html.SafeScript.unwrap(a[d]);
  }
  a = goog.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse(c, goog.i18n.bidi.Dir.NEUTRAL);
  return goog.html.SafeHtml.createSafeHtmlTagSecurityPrivateDoNotAccessOrElse("script", b, a);
};
goog.html.SafeHtml.createStyle = function(a, b) {
  b = goog.html.SafeHtml.combineAttributes({type:"text/css"}, {}, b);
  var c = "";
  a = goog.array.concat(a);
  for (var d = 0; d < a.length; d++) {
    c += goog.html.SafeStyleSheet.unwrap(a[d]);
  }
  a = goog.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse(c, goog.i18n.bidi.Dir.NEUTRAL);
  return goog.html.SafeHtml.createSafeHtmlTagSecurityPrivateDoNotAccessOrElse("style", b, a);
};
goog.html.SafeHtml.createMetaRefresh = function(a, b) {
  a = goog.html.SafeUrl.unwrap(goog.html.SafeUrl.sanitize(a));
  (goog.labs.userAgent.browser.isIE() || goog.labs.userAgent.browser.isEdge()) && goog.string.contains(a, ";") && (a = "'" + a.replace(/'/g, "%27") + "'");
  return goog.html.SafeHtml.createSafeHtmlTagSecurityPrivateDoNotAccessOrElse("meta", {"http-equiv":"refresh", content:(b || 0) + "; url=" + a});
};
goog.html.SafeHtml.getAttrNameAndValue_ = function(a, b, c) {
  if (c instanceof goog.string.Const) {
    c = goog.string.Const.unwrap(c);
  } else {
    if ("style" == b.toLowerCase()) {
      c = goog.html.SafeHtml.getStyleValue_(c);
    } else {
      if (/^on/i.test(b)) {
        throw Error('Attribute "' + b + '" requires goog.string.Const value, "' + c + '" given.');
      }
      if (b.toLowerCase() in goog.html.SafeHtml.URL_ATTRIBUTES_) {
        if (c instanceof goog.html.TrustedResourceUrl) {
          c = goog.html.TrustedResourceUrl.unwrap(c);
        } else {
          if (c instanceof goog.html.SafeUrl) {
            c = goog.html.SafeUrl.unwrap(c);
          } else {
            if (goog.isString(c)) {
              c = goog.html.SafeUrl.sanitize(c).getTypedStringValue();
            } else {
              throw Error('Attribute "' + b + '" on tag "' + a + '" requires goog.html.SafeUrl, goog.string.Const, or string, value "' + c + '" given.');
            }
          }
        }
      }
    }
  }
  c.implementsGoogStringTypedString && (c = c.getTypedStringValue());
  goog.asserts.assert(goog.isString(c) || goog.isNumber(c), "String or number value expected, got " + typeof c + " with value: " + c);
  return b + '="' + goog.string.htmlEscape(String(c)) + '"';
};
goog.html.SafeHtml.getStyleValue_ = function(a) {
  if (!goog.isObject(a)) {
    throw Error('The "style" attribute requires goog.html.SafeStyle or map of style properties, ' + typeof a + " given: " + a);
  }
  a instanceof goog.html.SafeStyle || (a = goog.html.SafeStyle.create(a));
  return goog.html.SafeStyle.unwrap(a);
};
goog.html.SafeHtml.createWithDir = function(a, b, c, d) {
  b = goog.html.SafeHtml.create(b, c, d);
  b.dir_ = a;
  return b;
};
goog.html.SafeHtml.concat = function(a) {
  var b = goog.i18n.bidi.Dir.NEUTRAL, c = "", d = function(a) {
    goog.isArray(a) ? goog.array.forEach(a, d) : (a = goog.html.SafeHtml.htmlEscape(a), c += goog.html.SafeHtml.unwrap(a), a = a.getDirection(), b == goog.i18n.bidi.Dir.NEUTRAL ? b = a : a != goog.i18n.bidi.Dir.NEUTRAL && b != a && (b = null));
  };
  goog.array.forEach(arguments, d);
  return goog.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse(c, b);
};
goog.html.SafeHtml.concatWithDir = function(a, b) {
  var c = goog.html.SafeHtml.concat(goog.array.slice(arguments, 1));
  c.dir_ = a;
  return c;
};
goog.html.SafeHtml.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = {};
goog.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse = function(a, b) {
  return (new goog.html.SafeHtml).initSecurityPrivateDoNotAccessOrElse_(a, b);
};
goog.html.SafeHtml.prototype.initSecurityPrivateDoNotAccessOrElse_ = function(a, b) {
  this.privateDoNotAccessOrElseSafeHtmlWrappedValue_ = a;
  this.dir_ = b;
  return this;
};
goog.html.SafeHtml.createSafeHtmlTagSecurityPrivateDoNotAccessOrElse = function(a, b, c) {
  var d = null;
  var e = "<" + a + goog.html.SafeHtml.stringifyAttributes(a, b);
  goog.isDefAndNotNull(c) ? goog.isArray(c) || (c = [c]) : c = [];
  goog.dom.tags.isVoidTag(a.toLowerCase()) ? (goog.asserts.assert(!c.length, "Void tag <" + a + "> does not allow content."), e += ">") : (d = goog.html.SafeHtml.concat(c), e += ">" + goog.html.SafeHtml.unwrap(d) + "</" + a + ">", d = d.getDirection());
  (a = b && b.dir) && (d = /^(ltr|rtl|auto)$/i.test(a) ? goog.i18n.bidi.Dir.NEUTRAL : null);
  return goog.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse(e, d);
};
goog.html.SafeHtml.stringifyAttributes = function(a, b) {
  var c = "";
  if (b) {
    for (var d in b) {
      if (!goog.html.SafeHtml.VALID_NAMES_IN_TAG_.test(d)) {
        throw Error('Invalid attribute name "' + d + '".');
      }
      var e = b[d];
      goog.isDefAndNotNull(e) && (c += " " + goog.html.SafeHtml.getAttrNameAndValue_(a, d, e));
    }
  }
  return c;
};
goog.html.SafeHtml.combineAttributes = function(a, b, c) {
  var d = {}, e;
  for (e in a) {
    goog.asserts.assert(e.toLowerCase() == e, "Must be lower case"), d[e] = a[e];
  }
  for (e in b) {
    goog.asserts.assert(e.toLowerCase() == e, "Must be lower case"), d[e] = b[e];
  }
  for (e in c) {
    var f = e.toLowerCase();
    if (f in a) {
      throw Error('Cannot override "' + f + '" attribute, got "' + e + '" with value "' + c[e] + '"');
    }
    f in b && delete d[f];
    d[e] = c[e];
  }
  return d;
};
goog.html.SafeHtml.DOCTYPE_HTML = goog.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse("<!DOCTYPE html>", goog.i18n.bidi.Dir.NEUTRAL);
goog.html.SafeHtml.EMPTY = goog.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse("", goog.i18n.bidi.Dir.NEUTRAL);
goog.html.SafeHtml.BR = goog.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse("<br>", goog.i18n.bidi.Dir.NEUTRAL);
goog.dom.safe = {};
goog.dom.safe.InsertAdjacentHtmlPosition = {AFTERBEGIN:"afterbegin", AFTEREND:"afterend", BEFOREBEGIN:"beforebegin", BEFOREEND:"beforeend"};
goog.dom.safe.insertAdjacentHtml = function(a, b, c) {
  a.insertAdjacentHTML(b, goog.html.SafeHtml.unwrap(c));
};
goog.dom.safe.SET_INNER_HTML_DISALLOWED_TAGS_ = {MATH:!0, SCRIPT:!0, STYLE:!0, SVG:!0, TEMPLATE:!0};
goog.dom.safe.setInnerHtml = function(a, b) {
  if (goog.asserts.ENABLE_ASSERTS) {
    var c = a.tagName.toUpperCase();
    if (goog.dom.safe.SET_INNER_HTML_DISALLOWED_TAGS_[c]) {
      throw Error("goog.dom.safe.setInnerHtml cannot be used to set content of " + a.tagName + ".");
    }
  }
  a.innerHTML = goog.html.SafeHtml.unwrap(b);
};
goog.dom.safe.setOuterHtml = function(a, b) {
  a.outerHTML = goog.html.SafeHtml.unwrap(b);
};
goog.dom.safe.setFormElementAction = function(a, b) {
  b = b instanceof goog.html.SafeUrl ? b : goog.html.SafeUrl.sanitizeAssertUnchanged(b);
  goog.dom.asserts.assertIsHTMLFormElement(a).action = goog.html.SafeUrl.unwrap(b);
};
goog.dom.safe.setButtonFormAction = function(a, b) {
  b = b instanceof goog.html.SafeUrl ? b : goog.html.SafeUrl.sanitizeAssertUnchanged(b);
  goog.dom.asserts.assertIsHTMLButtonElement(a).formAction = goog.html.SafeUrl.unwrap(b);
};
goog.dom.safe.setInputFormAction = function(a, b) {
  b = b instanceof goog.html.SafeUrl ? b : goog.html.SafeUrl.sanitizeAssertUnchanged(b);
  goog.dom.asserts.assertIsHTMLInputElement(a).formAction = goog.html.SafeUrl.unwrap(b);
};
goog.dom.safe.setStyle = function(a, b) {
  a.style.cssText = goog.html.SafeStyle.unwrap(b);
};
goog.dom.safe.documentWrite = function(a, b) {
  a.write(goog.html.SafeHtml.unwrap(b));
};
goog.dom.safe.setAnchorHref = function(a, b) {
  goog.dom.asserts.assertIsHTMLAnchorElement(a);
  b = b instanceof goog.html.SafeUrl ? b : goog.html.SafeUrl.sanitizeAssertUnchanged(b);
  a.href = goog.html.SafeUrl.unwrap(b);
};
goog.dom.safe.setImageSrc = function(a, b) {
  goog.dom.asserts.assertIsHTMLImageElement(a);
  b = b instanceof goog.html.SafeUrl ? b : goog.html.SafeUrl.sanitizeAssertUnchanged(b);
  a.src = goog.html.SafeUrl.unwrap(b);
};
goog.dom.safe.setVideoSrc = function(a, b) {
  goog.dom.asserts.assertIsHTMLVideoElement(a);
  b = b instanceof goog.html.SafeUrl ? b : goog.html.SafeUrl.sanitizeAssertUnchanged(b);
  a.src = goog.html.SafeUrl.unwrap(b);
};
goog.dom.safe.setEmbedSrc = function(a, b) {
  goog.dom.asserts.assertIsHTMLEmbedElement(a);
  a.src = goog.html.TrustedResourceUrl.unwrap(b);
};
goog.dom.safe.setFrameSrc = function(a, b) {
  goog.dom.asserts.assertIsHTMLFrameElement(a);
  a.src = goog.html.TrustedResourceUrl.unwrap(b);
};
goog.dom.safe.setIframeSrc = function(a, b) {
  goog.dom.asserts.assertIsHTMLIFrameElement(a);
  a.src = goog.html.TrustedResourceUrl.unwrap(b);
};
goog.dom.safe.setIframeSrcdoc = function(a, b) {
  goog.dom.asserts.assertIsHTMLIFrameElement(a);
  a.srcdoc = goog.html.SafeHtml.unwrap(b);
};
goog.dom.safe.setLinkHrefAndRel = function(a, b, c) {
  goog.dom.asserts.assertIsHTMLLinkElement(a);
  a.rel = c;
  goog.string.caseInsensitiveContains(c, "stylesheet") ? (goog.asserts.assert(b instanceof goog.html.TrustedResourceUrl, 'URL must be TrustedResourceUrl because "rel" contains "stylesheet"'), a.href = goog.html.TrustedResourceUrl.unwrap(b)) : a.href = b instanceof goog.html.TrustedResourceUrl ? goog.html.TrustedResourceUrl.unwrap(b) : b instanceof goog.html.SafeUrl ? goog.html.SafeUrl.unwrap(b) : goog.html.SafeUrl.sanitizeAssertUnchanged(b).getTypedStringValue();
};
goog.dom.safe.setObjectData = function(a, b) {
  goog.dom.asserts.assertIsHTMLObjectElement(a);
  a.data = goog.html.TrustedResourceUrl.unwrap(b);
};
goog.dom.safe.setScriptSrc = function(a, b) {
  goog.dom.asserts.assertIsHTMLScriptElement(a);
  a.src = goog.html.TrustedResourceUrl.unwrap(b);
  (b = goog.getScriptNonce()) && a.setAttribute("nonce", b);
};
goog.dom.safe.setScriptContent = function(a, b) {
  goog.dom.asserts.assertIsHTMLScriptElement(a);
  a.text = goog.html.SafeScript.unwrap(b);
  (b = goog.getScriptNonce()) && a.setAttribute("nonce", b);
};
goog.dom.safe.setLocationHref = function(a, b) {
  goog.dom.asserts.assertIsLocation(a);
  b = b instanceof goog.html.SafeUrl ? b : goog.html.SafeUrl.sanitizeAssertUnchanged(b);
  a.href = goog.html.SafeUrl.unwrap(b);
};
goog.dom.safe.replaceLocation = function(a, b) {
  goog.dom.asserts.assertIsLocation(a);
  b = b instanceof goog.html.SafeUrl ? b : goog.html.SafeUrl.sanitizeAssertUnchanged(b);
  a.replace(goog.html.SafeUrl.unwrap(b));
};
goog.dom.safe.openInWindow = function(a, b, c, d, e) {
  a = a instanceof goog.html.SafeUrl ? a : goog.html.SafeUrl.sanitizeAssertUnchanged(a);
  return (b || window).open(goog.html.SafeUrl.unwrap(a), c ? goog.string.Const.unwrap(c) : "", d, e);
};
goog.html.uncheckedconversions = {};
goog.html.uncheckedconversions.safeHtmlFromStringKnownToSatisfyTypeContract = function(a, b, c) {
  goog.asserts.assertString(goog.string.Const.unwrap(a), "must provide justification");
  goog.asserts.assert(!goog.string.isEmptyOrWhitespace(goog.string.Const.unwrap(a)), "must provide non-empty justification");
  return goog.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse(b, c || null);
};
goog.html.uncheckedconversions.safeScriptFromStringKnownToSatisfyTypeContract = function(a, b) {
  goog.asserts.assertString(goog.string.Const.unwrap(a), "must provide justification");
  goog.asserts.assert(!goog.string.isEmptyOrWhitespace(goog.string.Const.unwrap(a)), "must provide non-empty justification");
  return goog.html.SafeScript.createSafeScriptSecurityPrivateDoNotAccessOrElse(b);
};
goog.html.uncheckedconversions.safeStyleFromStringKnownToSatisfyTypeContract = function(a, b) {
  goog.asserts.assertString(goog.string.Const.unwrap(a), "must provide justification");
  goog.asserts.assert(!goog.string.isEmptyOrWhitespace(goog.string.Const.unwrap(a)), "must provide non-empty justification");
  return goog.html.SafeStyle.createSafeStyleSecurityPrivateDoNotAccessOrElse(b);
};
goog.html.uncheckedconversions.safeStyleSheetFromStringKnownToSatisfyTypeContract = function(a, b) {
  goog.asserts.assertString(goog.string.Const.unwrap(a), "must provide justification");
  goog.asserts.assert(!goog.string.isEmptyOrWhitespace(goog.string.Const.unwrap(a)), "must provide non-empty justification");
  return goog.html.SafeStyleSheet.createSafeStyleSheetSecurityPrivateDoNotAccessOrElse(b);
};
goog.html.uncheckedconversions.safeUrlFromStringKnownToSatisfyTypeContract = function(a, b) {
  goog.asserts.assertString(goog.string.Const.unwrap(a), "must provide justification");
  goog.asserts.assert(!goog.string.isEmptyOrWhitespace(goog.string.Const.unwrap(a)), "must provide non-empty justification");
  return goog.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse(b);
};
goog.html.uncheckedconversions.trustedResourceUrlFromStringKnownToSatisfyTypeContract = function(a, b) {
  goog.asserts.assertString(goog.string.Const.unwrap(a), "must provide justification");
  goog.asserts.assert(!goog.string.isEmptyOrWhitespace(goog.string.Const.unwrap(a)), "must provide non-empty justification");
  return goog.html.TrustedResourceUrl.createTrustedResourceUrlSecurityPrivateDoNotAccessOrElse(b);
};
goog.math = {};
goog.math.randomInt = function(a) {
  return Math.floor(Math.random() * a);
};
goog.math.uniformRandom = function(a, b) {
  return a + Math.random() * (b - a);
};
goog.math.clamp = function(a, b, c) {
  return Math.min(Math.max(a, b), c);
};
goog.math.modulo = function(a, b) {
  a %= b;
  return 0 > a * b ? a + b : a;
};
goog.math.lerp = function(a, b, c) {
  return a + c * (b - a);
};
goog.math.nearlyEquals = function(a, b, c) {
  return Math.abs(a - b) <= (c || 0.000001);
};
goog.math.standardAngle = function(a) {
  return goog.math.modulo(a, 360);
};
goog.math.standardAngleInRadians = function(a) {
  return goog.math.modulo(a, 2 * Math.PI);
};
goog.math.toRadians = function(a) {
  return a * Math.PI / 180;
};
goog.math.toDegrees = function(a) {
  return 180 * a / Math.PI;
};
goog.math.angleDx = function(a, b) {
  return b * Math.cos(goog.math.toRadians(a));
};
goog.math.angleDy = function(a, b) {
  return b * Math.sin(goog.math.toRadians(a));
};
goog.math.angle = function(a, b, c, d) {
  return goog.math.standardAngle(goog.math.toDegrees(Math.atan2(d - b, c - a)));
};
goog.math.angleDifference = function(a, b) {
  a = goog.math.standardAngle(b) - goog.math.standardAngle(a);
  180 < a ? a -= 360 : -180 >= a && (a = 360 + a);
  return a;
};
goog.math.sign = function(a) {
  return 0 < a ? 1 : 0 > a ? -1 : a;
};
goog.math.longestCommonSubsequence = function(a, b, c, d) {
  c = c || function(a, b) {
    return a == b;
  };
  d = d || function(b, c) {
    return a[b];
  };
  for (var e = a.length, f = b.length, g = [], h = 0; h < e + 1; h++) {
    g[h] = [], g[h][0] = 0;
  }
  for (var k = 0; k < f + 1; k++) {
    g[0][k] = 0;
  }
  for (h = 1; h <= e; h++) {
    for (k = 1; k <= f; k++) {
      c(a[h - 1], b[k - 1]) ? g[h][k] = g[h - 1][k - 1] + 1 : g[h][k] = Math.max(g[h - 1][k], g[h][k - 1]);
    }
  }
  var l = [];
  h = e;
  for (k = f; 0 < h && 0 < k;) {
    c(a[h - 1], b[k - 1]) ? (l.unshift(d(h - 1, k - 1)), h--, k--) : g[h - 1][k] > g[h][k - 1] ? h-- : k--;
  }
  return l;
};
goog.math.sum = function(a) {
  return goog.array.reduce(arguments, function(a, c) {
    return a + c;
  }, 0);
};
goog.math.average = function(a) {
  return goog.math.sum.apply(null, arguments) / arguments.length;
};
goog.math.sampleVariance = function(a) {
  var b = arguments.length;
  if (2 > b) {
    return 0;
  }
  var c = goog.math.average.apply(null, arguments);
  return goog.math.sum.apply(null, goog.array.map(arguments, function(a) {
    return Math.pow(a - c, 2);
  })) / (b - 1);
};
goog.math.standardDeviation = function(a) {
  return Math.sqrt(goog.math.sampleVariance.apply(null, arguments));
};
goog.math.isInt = function(a) {
  return isFinite(a) && 0 == a % 1;
};
goog.math.isFiniteNumber = function(a) {
  return isFinite(a);
};
goog.math.isNegativeZero = function(a) {
  return 0 == a && 0 > 1 / a;
};
goog.math.log10Floor = function(a) {
  if (0 < a) {
    var b = Math.round(Math.log(a) * Math.LOG10E);
    return b - (parseFloat("1e" + b) > a ? 1 : 0);
  }
  return 0 == a ? -Infinity : NaN;
};
goog.math.safeFloor = function(a, b) {
  goog.asserts.assert(!goog.isDef(b) || 0 < b);
  return Math.floor(a + (b || 2e-15));
};
goog.math.safeCeil = function(a, b) {
  goog.asserts.assert(!goog.isDef(b) || 0 < b);
  return Math.ceil(a - (b || 2e-15));
};
goog.math.Coordinate = function(a, b) {
  this.x = goog.isDef(a) ? a : 0;
  this.y = goog.isDef(b) ? b : 0;
};
goog.math.Coordinate.prototype.clone = function() {
  return new goog.math.Coordinate(this.x, this.y);
};
goog.DEBUG && (goog.math.Coordinate.prototype.toString = function() {
  return "(" + this.x + ", " + this.y + ")";
});
goog.math.Coordinate.prototype.equals = function(a) {
  return a instanceof goog.math.Coordinate && goog.math.Coordinate.equals(this, a);
};
goog.math.Coordinate.equals = function(a, b) {
  return a == b ? !0 : a && b ? a.x == b.x && a.y == b.y : !1;
};
goog.math.Coordinate.distance = function(a, b) {
  var c = a.x - b.x;
  a = a.y - b.y;
  return Math.sqrt(c * c + a * a);
};
goog.math.Coordinate.magnitude = function(a) {
  return Math.sqrt(a.x * a.x + a.y * a.y);
};
goog.math.Coordinate.azimuth = function(a) {
  return goog.math.angle(0, 0, a.x, a.y);
};
goog.math.Coordinate.squaredDistance = function(a, b) {
  var c = a.x - b.x;
  a = a.y - b.y;
  return c * c + a * a;
};
goog.math.Coordinate.difference = function(a, b) {
  return new goog.math.Coordinate(a.x - b.x, a.y - b.y);
};
goog.math.Coordinate.sum = function(a, b) {
  return new goog.math.Coordinate(a.x + b.x, a.y + b.y);
};
goog.math.Coordinate.prototype.ceil = function() {
  this.x = Math.ceil(this.x);
  this.y = Math.ceil(this.y);
  return this;
};
goog.math.Coordinate.prototype.floor = function() {
  this.x = Math.floor(this.x);
  this.y = Math.floor(this.y);
  return this;
};
goog.math.Coordinate.prototype.round = function() {
  this.x = Math.round(this.x);
  this.y = Math.round(this.y);
  return this;
};
goog.math.Coordinate.prototype.translate = function(a, b) {
  a instanceof goog.math.Coordinate ? (this.x += a.x, this.y += a.y) : (this.x += Number(a), goog.isNumber(b) && (this.y += b));
  return this;
};
goog.math.Coordinate.prototype.scale = function(a, b) {
  b = goog.isNumber(b) ? b : a;
  this.x *= a;
  this.y *= b;
  return this;
};
goog.math.Coordinate.prototype.rotateRadians = function(a, b) {
  b = b || new goog.math.Coordinate(0, 0);
  var c = this.x, d = this.y, e = Math.cos(a);
  a = Math.sin(a);
  this.x = (c - b.x) * e - (d - b.y) * a + b.x;
  this.y = (c - b.x) * a + (d - b.y) * e + b.y;
};
goog.math.Coordinate.prototype.rotateDegrees = function(a, b) {
  this.rotateRadians(goog.math.toRadians(a), b);
};
goog.math.Size = function(a, b) {
  this.width = a;
  this.height = b;
};
goog.math.Size.equals = function(a, b) {
  return a == b ? !0 : a && b ? a.width == b.width && a.height == b.height : !1;
};
goog.math.Size.prototype.clone = function() {
  return new goog.math.Size(this.width, this.height);
};
goog.DEBUG && (goog.math.Size.prototype.toString = function() {
  return "(" + this.width + " x " + this.height + ")";
});
goog.math.Size.prototype.getLongest = function() {
  return Math.max(this.width, this.height);
};
goog.math.Size.prototype.getShortest = function() {
  return Math.min(this.width, this.height);
};
goog.math.Size.prototype.area = function() {
  return this.width * this.height;
};
goog.math.Size.prototype.perimeter = function() {
  return 2 * (this.width + this.height);
};
goog.math.Size.prototype.aspectRatio = function() {
  return this.width / this.height;
};
goog.math.Size.prototype.isEmpty = function() {
  return !this.area();
};
goog.math.Size.prototype.ceil = function() {
  this.width = Math.ceil(this.width);
  this.height = Math.ceil(this.height);
  return this;
};
goog.math.Size.prototype.fitsInside = function(a) {
  return this.width <= a.width && this.height <= a.height;
};
goog.math.Size.prototype.floor = function() {
  this.width = Math.floor(this.width);
  this.height = Math.floor(this.height);
  return this;
};
goog.math.Size.prototype.round = function() {
  this.width = Math.round(this.width);
  this.height = Math.round(this.height);
  return this;
};
goog.math.Size.prototype.scale = function(a, b) {
  b = goog.isNumber(b) ? b : a;
  this.width *= a;
  this.height *= b;
  return this;
};
goog.math.Size.prototype.scaleToCover = function(a) {
  a = this.aspectRatio() <= a.aspectRatio() ? a.width / this.width : a.height / this.height;
  return this.scale(a);
};
goog.math.Size.prototype.scaleToFit = function(a) {
  a = this.aspectRatio() > a.aspectRatio() ? a.width / this.width : a.height / this.height;
  return this.scale(a);
};
goog.dom.ASSUME_QUIRKS_MODE = !1;
goog.dom.ASSUME_STANDARDS_MODE = !1;
goog.dom.COMPAT_MODE_KNOWN_ = goog.dom.ASSUME_QUIRKS_MODE || goog.dom.ASSUME_STANDARDS_MODE;
goog.dom.getDomHelper = function(a) {
  return a ? new goog.dom.DomHelper(goog.dom.getOwnerDocument(a)) : goog.dom.defaultDomHelper_ || (goog.dom.defaultDomHelper_ = new goog.dom.DomHelper);
};
goog.dom.getDocument = function() {
  return document;
};
goog.dom.getElement = function(a) {
  return goog.dom.getElementHelper_(document, a);
};
goog.dom.getElementHelper_ = function(a, b) {
  return goog.isString(b) ? a.getElementById(b) : b;
};
goog.dom.getRequiredElement = function(a) {
  return goog.dom.getRequiredElementHelper_(document, a);
};
goog.dom.getRequiredElementHelper_ = function(a, b) {
  goog.asserts.assertString(b);
  a = goog.dom.getElementHelper_(a, b);
  return a = goog.asserts.assertElement(a, "No element found with id: " + b);
};
goog.dom.$ = goog.dom.getElement;
goog.dom.getElementsByTagName = function(a, b) {
  return (b || document).getElementsByTagName(String(a));
};
goog.dom.getElementsByTagNameAndClass = function(a, b, c) {
  return goog.dom.getElementsByTagNameAndClass_(document, a, b, c);
};
goog.dom.getElementByTagNameAndClass = function(a, b, c) {
  return goog.dom.getElementByTagNameAndClass_(document, a, b, c);
};
goog.dom.getElementsByClass = function(a, b) {
  var c = b || document;
  return goog.dom.canUseQuerySelector_(c) ? c.querySelectorAll("." + a) : goog.dom.getElementsByTagNameAndClass_(document, "*", a, b);
};
goog.dom.getElementByClass = function(a, b) {
  var c = b || document;
  return (c.getElementsByClassName ? c.getElementsByClassName(a)[0] : goog.dom.getElementByTagNameAndClass_(document, "*", a, b)) || null;
};
goog.dom.getRequiredElementByClass = function(a, b) {
  b = goog.dom.getElementByClass(a, b);
  return goog.asserts.assert(b, "No element found with className: " + a);
};
goog.dom.canUseQuerySelector_ = function(a) {
  return !(!a.querySelectorAll || !a.querySelector);
};
goog.dom.getElementsByTagNameAndClass_ = function(a, b, c, d) {
  a = d || a;
  b = b && "*" != b ? String(b).toUpperCase() : "";
  if (goog.dom.canUseQuerySelector_(a) && (b || c)) {
    return a.querySelectorAll(b + (c ? "." + c : ""));
  }
  if (c && a.getElementsByClassName) {
    a = a.getElementsByClassName(c);
    if (b) {
      d = {};
      for (var e = 0, f = 0, g; g = a[f]; f++) {
        b == g.nodeName && (d[e++] = g);
      }
      d.length = e;
      return d;
    }
    return a;
  }
  a = a.getElementsByTagName(b || "*");
  if (c) {
    d = {};
    for (f = e = 0; g = a[f]; f++) {
      b = g.className, "function" == typeof b.split && goog.array.contains(b.split(/\s+/), c) && (d[e++] = g);
    }
    d.length = e;
    return d;
  }
  return a;
};
goog.dom.getElementByTagNameAndClass_ = function(a, b, c, d) {
  var e = d || a, f = b && "*" != b ? String(b).toUpperCase() : "";
  return goog.dom.canUseQuerySelector_(e) && (f || c) ? e.querySelector(f + (c ? "." + c : "")) : goog.dom.getElementsByTagNameAndClass_(a, b, c, d)[0] || null;
};
goog.dom.$$ = goog.dom.getElementsByTagNameAndClass;
goog.dom.setProperties = function(a, b) {
  goog.object.forEach(b, function(b, d) {
    b && b.implementsGoogStringTypedString && (b = b.getTypedStringValue());
    "style" == d ? a.style.cssText = b : "class" == d ? a.className = b : "for" == d ? a.htmlFor = b : goog.dom.DIRECT_ATTRIBUTE_MAP_.hasOwnProperty(d) ? a.setAttribute(goog.dom.DIRECT_ATTRIBUTE_MAP_[d], b) : goog.string.startsWith(d, "aria-") || goog.string.startsWith(d, "data-") ? a.setAttribute(d, b) : a[d] = b;
  });
};
goog.dom.DIRECT_ATTRIBUTE_MAP_ = {cellpadding:"cellPadding", cellspacing:"cellSpacing", colspan:"colSpan", frameborder:"frameBorder", height:"height", maxlength:"maxLength", nonce:"nonce", role:"role", rowspan:"rowSpan", type:"type", usemap:"useMap", valign:"vAlign", width:"width"};
goog.dom.getViewportSize = function(a) {
  return goog.dom.getViewportSize_(a || window);
};
goog.dom.getViewportSize_ = function(a) {
  a = a.document;
  a = goog.dom.isCss1CompatMode_(a) ? a.documentElement : a.body;
  return new goog.math.Size(a.clientWidth, a.clientHeight);
};
goog.dom.getDocumentHeight = function() {
  return goog.dom.getDocumentHeight_(window);
};
goog.dom.getDocumentHeightForWindow = function(a) {
  return goog.dom.getDocumentHeight_(a);
};
goog.dom.getDocumentHeight_ = function(a) {
  var b = a.document, c = 0;
  if (b) {
    c = b.body;
    var d = b.documentElement;
    if (!d || !c) {
      return 0;
    }
    a = goog.dom.getViewportSize_(a).height;
    if (goog.dom.isCss1CompatMode_(b) && d.scrollHeight) {
      c = d.scrollHeight != a ? d.scrollHeight : d.offsetHeight;
    } else {
      b = d.scrollHeight;
      var e = d.offsetHeight;
      d.clientHeight != e && (b = c.scrollHeight, e = c.offsetHeight);
      c = b > a ? b > e ? b : e : b < e ? b : e;
    }
  }
  return c;
};
goog.dom.getPageScroll = function(a) {
  return goog.dom.getDomHelper((a || goog.global || window).document).getDocumentScroll();
};
goog.dom.getDocumentScroll = function() {
  return goog.dom.getDocumentScroll_(document);
};
goog.dom.getDocumentScroll_ = function(a) {
  var b = goog.dom.getDocumentScrollElement_(a);
  a = goog.dom.getWindow_(a);
  return goog.userAgent.IE && goog.userAgent.isVersionOrHigher("10") && a.pageYOffset != b.scrollTop ? new goog.math.Coordinate(b.scrollLeft, b.scrollTop) : new goog.math.Coordinate(a.pageXOffset || b.scrollLeft, a.pageYOffset || b.scrollTop);
};
goog.dom.getDocumentScrollElement = function() {
  return goog.dom.getDocumentScrollElement_(document);
};
goog.dom.getDocumentScrollElement_ = function(a) {
  return a.scrollingElement ? a.scrollingElement : !goog.userAgent.WEBKIT && goog.dom.isCss1CompatMode_(a) ? a.documentElement : a.body || a.documentElement;
};
goog.dom.getWindow = function(a) {
  return a ? goog.dom.getWindow_(a) : window;
};
goog.dom.getWindow_ = function(a) {
  return a.parentWindow || a.defaultView;
};
goog.dom.createDom = function(a, b, c) {
  return goog.dom.createDom_(document, arguments);
};
goog.dom.createDom_ = function(a, b) {
  var c = String(b[0]), d = b[1];
  if (!goog.dom.BrowserFeature.CAN_ADD_NAME_OR_TYPE_ATTRIBUTES && d && (d.name || d.type)) {
    c = ["<", c];
    d.name && c.push(' name="', goog.string.htmlEscape(d.name), '"');
    if (d.type) {
      c.push(' type="', goog.string.htmlEscape(d.type), '"');
      var e = {};
      goog.object.extend(e, d);
      delete e.type;
      d = e;
    }
    c.push(">");
    c = c.join("");
  }
  c = a.createElement(c);
  d && (goog.isString(d) ? c.className = d : goog.isArray(d) ? c.className = d.join(" ") : goog.dom.setProperties(c, d));
  2 < b.length && goog.dom.append_(a, c, b, 2);
  return c;
};
goog.dom.append_ = function(a, b, c, d) {
  function e(c) {
    c && b.appendChild(goog.isString(c) ? a.createTextNode(c) : c);
  }
  for (; d < c.length; d++) {
    var f = c[d];
    goog.isArrayLike(f) && !goog.dom.isNodeLike(f) ? goog.array.forEach(goog.dom.isNodeList(f) ? goog.array.toArray(f) : f, e) : e(f);
  }
};
goog.dom.$dom = goog.dom.createDom;
goog.dom.createElement = function(a) {
  return goog.dom.createElement_(document, a);
};
goog.dom.createElement_ = function(a, b) {
  return a.createElement(String(b));
};
goog.dom.createTextNode = function(a) {
  return document.createTextNode(String(a));
};
goog.dom.createTable = function(a, b, c) {
  return goog.dom.createTable_(document, a, b, !!c);
};
goog.dom.createTable_ = function(a, b, c, d) {
  for (var e = goog.dom.createElement_(a, "TABLE"), f = e.appendChild(goog.dom.createElement_(a, "TBODY")), g = 0; g < b; g++) {
    for (var h = goog.dom.createElement_(a, "TR"), k = 0; k < c; k++) {
      var l = goog.dom.createElement_(a, "TD");
      d && goog.dom.setTextContent(l, goog.string.Unicode.NBSP);
      h.appendChild(l);
    }
    f.appendChild(h);
  }
  return e;
};
goog.dom.constHtmlToNode = function(a) {
  var b = goog.array.map(arguments, goog.string.Const.unwrap);
  b = goog.html.uncheckedconversions.safeHtmlFromStringKnownToSatisfyTypeContract(goog.string.Const.from("Constant HTML string, that gets turned into a Node later, so it will be automatically balanced."), b.join(""));
  return goog.dom.safeHtmlToNode(b);
};
goog.dom.safeHtmlToNode = function(a) {
  return goog.dom.safeHtmlToNode_(document, a);
};
goog.dom.safeHtmlToNode_ = function(a, b) {
  var c = goog.dom.createElement_(a, "DIV");
  goog.dom.BrowserFeature.INNER_HTML_NEEDS_SCOPED_ELEMENT ? (goog.dom.safe.setInnerHtml(c, goog.html.SafeHtml.concat(goog.html.SafeHtml.BR, b)), c.removeChild(c.firstChild)) : goog.dom.safe.setInnerHtml(c, b);
  return goog.dom.childrenToNode_(a, c);
};
goog.dom.childrenToNode_ = function(a, b) {
  if (1 == b.childNodes.length) {
    return b.removeChild(b.firstChild);
  }
  for (a = a.createDocumentFragment(); b.firstChild;) {
    a.appendChild(b.firstChild);
  }
  return a;
};
goog.dom.isCss1CompatMode = function() {
  return goog.dom.isCss1CompatMode_(document);
};
goog.dom.isCss1CompatMode_ = function(a) {
  return goog.dom.COMPAT_MODE_KNOWN_ ? goog.dom.ASSUME_STANDARDS_MODE : "CSS1Compat" == a.compatMode;
};
goog.dom.canHaveChildren = function(a) {
  if (a.nodeType != goog.dom.NodeType.ELEMENT) {
    return !1;
  }
  switch(a.tagName) {
    case "APPLET":
    case "AREA":
    case "BASE":
    case "BR":
    case "COL":
    case "COMMAND":
    case "EMBED":
    case "FRAME":
    case "HR":
    case "IMG":
    case "INPUT":
    case "IFRAME":
    case "ISINDEX":
    case "KEYGEN":
    case "LINK":
    case "NOFRAMES":
    case "NOSCRIPT":
    case "META":
    case "OBJECT":
    case "PARAM":
    case "SCRIPT":
    case "SOURCE":
    case "STYLE":
    case "TRACK":
    case "WBR":
      return !1;
  }
  return !0;
};
goog.dom.appendChild = function(a, b) {
  a.appendChild(b);
};
goog.dom.append = function(a, b) {
  goog.dom.append_(goog.dom.getOwnerDocument(a), a, arguments, 1);
};
goog.dom.removeChildren = function(a) {
  for (var b; b = a.firstChild;) {
    a.removeChild(b);
  }
};
goog.dom.insertSiblingBefore = function(a, b) {
  b.parentNode && b.parentNode.insertBefore(a, b);
};
goog.dom.insertSiblingAfter = function(a, b) {
  b.parentNode && b.parentNode.insertBefore(a, b.nextSibling);
};
goog.dom.insertChildAt = function(a, b, c) {
  a.insertBefore(b, a.childNodes[c] || null);
};
goog.dom.removeNode = function(a) {
  return a && a.parentNode ? a.parentNode.removeChild(a) : null;
};
goog.dom.replaceNode = function(a, b) {
  var c = b.parentNode;
  c && c.replaceChild(a, b);
};
goog.dom.flattenElement = function(a) {
  var b, c = a.parentNode;
  if (c && c.nodeType != goog.dom.NodeType.DOCUMENT_FRAGMENT) {
    if (a.removeNode) {
      return a.removeNode(!1);
    }
    for (; b = a.firstChild;) {
      c.insertBefore(b, a);
    }
    return goog.dom.removeNode(a);
  }
};
goog.dom.getChildren = function(a) {
  return goog.dom.BrowserFeature.CAN_USE_CHILDREN_ATTRIBUTE && void 0 != a.children ? a.children : goog.array.filter(a.childNodes, function(a) {
    return a.nodeType == goog.dom.NodeType.ELEMENT;
  });
};
goog.dom.getFirstElementChild = function(a) {
  return goog.isDef(a.firstElementChild) ? a.firstElementChild : goog.dom.getNextElementNode_(a.firstChild, !0);
};
goog.dom.getLastElementChild = function(a) {
  return goog.isDef(a.lastElementChild) ? a.lastElementChild : goog.dom.getNextElementNode_(a.lastChild, !1);
};
goog.dom.getNextElementSibling = function(a) {
  return goog.isDef(a.nextElementSibling) ? a.nextElementSibling : goog.dom.getNextElementNode_(a.nextSibling, !0);
};
goog.dom.getPreviousElementSibling = function(a) {
  return goog.isDef(a.previousElementSibling) ? a.previousElementSibling : goog.dom.getNextElementNode_(a.previousSibling, !1);
};
goog.dom.getNextElementNode_ = function(a, b) {
  for (; a && a.nodeType != goog.dom.NodeType.ELEMENT;) {
    a = b ? a.nextSibling : a.previousSibling;
  }
  return a;
};
goog.dom.getNextNode = function(a) {
  if (!a) {
    return null;
  }
  if (a.firstChild) {
    return a.firstChild;
  }
  for (; a && !a.nextSibling;) {
    a = a.parentNode;
  }
  return a ? a.nextSibling : null;
};
goog.dom.getPreviousNode = function(a) {
  if (!a) {
    return null;
  }
  if (!a.previousSibling) {
    return a.parentNode;
  }
  for (a = a.previousSibling; a && a.lastChild;) {
    a = a.lastChild;
  }
  return a;
};
goog.dom.isNodeLike = function(a) {
  return goog.isObject(a) && 0 < a.nodeType;
};
goog.dom.isElement = function(a) {
  return goog.isObject(a) && a.nodeType == goog.dom.NodeType.ELEMENT;
};
goog.dom.isWindow = function(a) {
  return goog.isObject(a) && a.window == a;
};
goog.dom.getParentElement = function(a) {
  var b;
  if (goog.dom.BrowserFeature.CAN_USE_PARENT_ELEMENT_PROPERTY && !(goog.userAgent.IE && goog.userAgent.isVersionOrHigher("9") && !goog.userAgent.isVersionOrHigher("10") && goog.global.SVGElement && a instanceof goog.global.SVGElement) && (b = a.parentElement)) {
    return b;
  }
  b = a.parentNode;
  return goog.dom.isElement(b) ? b : null;
};
goog.dom.contains = function(a, b) {
  if (!a || !b) {
    return !1;
  }
  if (a.contains && b.nodeType == goog.dom.NodeType.ELEMENT) {
    return a == b || a.contains(b);
  }
  if ("undefined" != typeof a.compareDocumentPosition) {
    return a == b || !!(a.compareDocumentPosition(b) & 16);
  }
  for (; b && a != b;) {
    b = b.parentNode;
  }
  return b == a;
};
goog.dom.compareNodeOrder = function(a, b) {
  if (a == b) {
    return 0;
  }
  if (a.compareDocumentPosition) {
    return a.compareDocumentPosition(b) & 2 ? 1 : -1;
  }
  if (goog.userAgent.IE && !goog.userAgent.isDocumentModeOrHigher(9)) {
    if (a.nodeType == goog.dom.NodeType.DOCUMENT) {
      return -1;
    }
    if (b.nodeType == goog.dom.NodeType.DOCUMENT) {
      return 1;
    }
  }
  if ("sourceIndex" in a || a.parentNode && "sourceIndex" in a.parentNode) {
    var c = a.nodeType == goog.dom.NodeType.ELEMENT, d = b.nodeType == goog.dom.NodeType.ELEMENT;
    if (c && d) {
      return a.sourceIndex - b.sourceIndex;
    }
    var e = a.parentNode, f = b.parentNode;
    return e == f ? goog.dom.compareSiblingOrder_(a, b) : !c && goog.dom.contains(e, b) ? -1 * goog.dom.compareParentsDescendantNodeIe_(a, b) : !d && goog.dom.contains(f, a) ? goog.dom.compareParentsDescendantNodeIe_(b, a) : (c ? a.sourceIndex : e.sourceIndex) - (d ? b.sourceIndex : f.sourceIndex);
  }
  d = goog.dom.getOwnerDocument(a);
  c = d.createRange();
  c.selectNode(a);
  c.collapse(!0);
  a = d.createRange();
  a.selectNode(b);
  a.collapse(!0);
  return c.compareBoundaryPoints(goog.global.Range.START_TO_END, a);
};
goog.dom.compareParentsDescendantNodeIe_ = function(a, b) {
  var c = a.parentNode;
  if (c == b) {
    return -1;
  }
  for (; b.parentNode != c;) {
    b = b.parentNode;
  }
  return goog.dom.compareSiblingOrder_(b, a);
};
goog.dom.compareSiblingOrder_ = function(a, b) {
  for (; b = b.previousSibling;) {
    if (b == a) {
      return -1;
    }
  }
  return 1;
};
goog.dom.findCommonAncestor = function(a) {
  var b, c = arguments.length;
  if (!c) {
    return null;
  }
  if (1 == c) {
    return arguments[0];
  }
  var d = [], e = Infinity;
  for (b = 0; b < c; b++) {
    for (var f = [], g = arguments[b]; g;) {
      f.unshift(g), g = g.parentNode;
    }
    d.push(f);
    e = Math.min(e, f.length);
  }
  f = null;
  for (b = 0; b < e; b++) {
    g = d[0][b];
    for (var h = 1; h < c; h++) {
      if (g != d[h][b]) {
        return f;
      }
    }
    f = g;
  }
  return f;
};
goog.dom.getOwnerDocument = function(a) {
  goog.asserts.assert(a, "Node cannot be null or undefined.");
  return a.nodeType == goog.dom.NodeType.DOCUMENT ? a : a.ownerDocument || a.document;
};
goog.dom.getFrameContentDocument = function(a) {
  return a.contentDocument || a.contentWindow.document;
};
goog.dom.getFrameContentWindow = function(a) {
  try {
    return a.contentWindow || (a.contentDocument ? goog.dom.getWindow(a.contentDocument) : null);
  } catch (b) {
  }
  return null;
};
goog.dom.setTextContent = function(a, b) {
  goog.asserts.assert(null != a, "goog.dom.setTextContent expects a non-null value for node");
  if ("textContent" in a) {
    a.textContent = b;
  } else {
    if (a.nodeType == goog.dom.NodeType.TEXT) {
      a.data = String(b);
    } else {
      if (a.firstChild && a.firstChild.nodeType == goog.dom.NodeType.TEXT) {
        for (; a.lastChild != a.firstChild;) {
          a.removeChild(a.lastChild);
        }
        a.firstChild.data = String(b);
      } else {
        goog.dom.removeChildren(a);
        var c = goog.dom.getOwnerDocument(a);
        a.appendChild(c.createTextNode(String(b)));
      }
    }
  }
};
goog.dom.getOuterHtml = function(a) {
  goog.asserts.assert(null !== a, "goog.dom.getOuterHtml expects a non-null value for element");
  if ("outerHTML" in a) {
    return a.outerHTML;
  }
  var b = goog.dom.getOwnerDocument(a);
  b = goog.dom.createElement_(b, "DIV");
  b.appendChild(a.cloneNode(!0));
  return b.innerHTML;
};
goog.dom.findNode = function(a, b) {
  var c = [];
  return goog.dom.findNodes_(a, b, c, !0) ? c[0] : void 0;
};
goog.dom.findNodes = function(a, b) {
  var c = [];
  goog.dom.findNodes_(a, b, c, !1);
  return c;
};
goog.dom.findNodes_ = function(a, b, c, d) {
  if (null != a) {
    for (a = a.firstChild; a;) {
      if (b(a) && (c.push(a), d) || goog.dom.findNodes_(a, b, c, d)) {
        return !0;
      }
      a = a.nextSibling;
    }
  }
  return !1;
};
goog.dom.TAGS_TO_IGNORE_ = {SCRIPT:1, STYLE:1, HEAD:1, IFRAME:1, OBJECT:1};
goog.dom.PREDEFINED_TAG_VALUES_ = {IMG:" ", BR:"\n"};
goog.dom.isFocusableTabIndex = function(a) {
  return goog.dom.hasSpecifiedTabIndex_(a) && goog.dom.isTabIndexFocusable_(a);
};
goog.dom.setFocusableTabIndex = function(a, b) {
  b ? a.tabIndex = 0 : (a.tabIndex = -1, a.removeAttribute("tabIndex"));
};
goog.dom.isFocusable = function(a) {
  var b;
  return (b = goog.dom.nativelySupportsFocus_(a) ? !a.disabled && (!goog.dom.hasSpecifiedTabIndex_(a) || goog.dom.isTabIndexFocusable_(a)) : goog.dom.isFocusableTabIndex(a)) && goog.userAgent.IE ? goog.dom.hasNonZeroBoundingRect_(a) : b;
};
goog.dom.hasSpecifiedTabIndex_ = function(a) {
  return goog.userAgent.IE && !goog.userAgent.isVersionOrHigher("9") ? (a = a.getAttributeNode("tabindex"), goog.isDefAndNotNull(a) && a.specified) : a.hasAttribute("tabindex");
};
goog.dom.isTabIndexFocusable_ = function(a) {
  a = a.tabIndex;
  return goog.isNumber(a) && 0 <= a && 32768 > a;
};
goog.dom.nativelySupportsFocus_ = function(a) {
  return "A" == a.tagName || "INPUT" == a.tagName || "TEXTAREA" == a.tagName || "SELECT" == a.tagName || "BUTTON" == a.tagName;
};
goog.dom.hasNonZeroBoundingRect_ = function(a) {
  a = !goog.isFunction(a.getBoundingClientRect) || goog.userAgent.IE && null == a.parentElement ? {height:a.offsetHeight, width:a.offsetWidth} : a.getBoundingClientRect();
  return goog.isDefAndNotNull(a) && 0 < a.height && 0 < a.width;
};
goog.dom.getTextContent = function(a) {
  if (goog.dom.BrowserFeature.CAN_USE_INNER_TEXT && null !== a && "innerText" in a) {
    a = goog.string.canonicalizeNewlines(a.innerText);
  } else {
    var b = [];
    goog.dom.getTextContent_(a, b, !0);
    a = b.join("");
  }
  a = a.replace(/ \xAD /g, " ").replace(/\xAD/g, "");
  a = a.replace(/\u200B/g, "");
  goog.dom.BrowserFeature.CAN_USE_INNER_TEXT || (a = a.replace(/ +/g, " "));
  " " != a && (a = a.replace(/^\s*/, ""));
  return a;
};
goog.dom.getRawTextContent = function(a) {
  var b = [];
  goog.dom.getTextContent_(a, b, !1);
  return b.join("");
};
goog.dom.getTextContent_ = function(a, b, c) {
  if (!(a.nodeName in goog.dom.TAGS_TO_IGNORE_)) {
    if (a.nodeType == goog.dom.NodeType.TEXT) {
      c ? b.push(String(a.nodeValue).replace(/(\r\n|\r|\n)/g, "")) : b.push(a.nodeValue);
    } else {
      if (a.nodeName in goog.dom.PREDEFINED_TAG_VALUES_) {
        b.push(goog.dom.PREDEFINED_TAG_VALUES_[a.nodeName]);
      } else {
        for (a = a.firstChild; a;) {
          goog.dom.getTextContent_(a, b, c), a = a.nextSibling;
        }
      }
    }
  }
};
goog.dom.getNodeTextLength = function(a) {
  return goog.dom.getTextContent(a).length;
};
goog.dom.getNodeTextOffset = function(a, b) {
  b = b || goog.dom.getOwnerDocument(a).body;
  for (var c = []; a && a != b;) {
    for (var d = a; d = d.previousSibling;) {
      c.unshift(goog.dom.getTextContent(d));
    }
    a = a.parentNode;
  }
  return goog.string.trimLeft(c.join("")).replace(/ +/g, " ").length;
};
goog.dom.getNodeAtOffset = function(a, b, c) {
  a = [a];
  for (var d = 0, e = null; 0 < a.length && d < b;) {
    if (e = a.pop(), !(e.nodeName in goog.dom.TAGS_TO_IGNORE_)) {
      if (e.nodeType == goog.dom.NodeType.TEXT) {
        var f = e.nodeValue.replace(/(\r\n|\r|\n)/g, "").replace(/ +/g, " ");
        d += f.length;
      } else {
        if (e.nodeName in goog.dom.PREDEFINED_TAG_VALUES_) {
          d += goog.dom.PREDEFINED_TAG_VALUES_[e.nodeName].length;
        } else {
          for (f = e.childNodes.length - 1; 0 <= f; f--) {
            a.push(e.childNodes[f]);
          }
        }
      }
    }
  }
  goog.isObject(c) && (c.remainder = e ? e.nodeValue.length + b - d - 1 : 0, c.node = e);
  return e;
};
goog.dom.isNodeList = function(a) {
  if (a && "number" == typeof a.length) {
    if (goog.isObject(a)) {
      return "function" == typeof a.item || "string" == typeof a.item;
    }
    if (goog.isFunction(a)) {
      return "function" == typeof a.item;
    }
  }
  return !1;
};
goog.dom.getAncestorByTagNameAndClass = function(a, b, c, d) {
  if (!b && !c) {
    return null;
  }
  var e = b ? String(b).toUpperCase() : null;
  return goog.dom.getAncestor(a, function(a) {
    return (!e || a.nodeName == e) && (!c || goog.isString(a.className) && goog.array.contains(a.className.split(/\s+/), c));
  }, !0, d);
};
goog.dom.getAncestorByClass = function(a, b, c) {
  return goog.dom.getAncestorByTagNameAndClass(a, null, b, c);
};
goog.dom.getAncestor = function(a, b, c, d) {
  a && !c && (a = a.parentNode);
  for (c = 0; a && (null == d || c <= d);) {
    goog.asserts.assert("parentNode" != a.name);
    if (b(a)) {
      return a;
    }
    a = a.parentNode;
    c++;
  }
  return null;
};
goog.dom.getActiveElement = function(a) {
  try {
    var b = a && a.activeElement;
    return b && b.nodeName ? b : null;
  } catch (c) {
    return null;
  }
};
goog.dom.getPixelRatio = function() {
  var a = goog.dom.getWindow();
  return goog.isDef(a.devicePixelRatio) ? a.devicePixelRatio : a.matchMedia ? goog.dom.matchesPixelRatio_(3) || goog.dom.matchesPixelRatio_(2) || goog.dom.matchesPixelRatio_(1.5) || goog.dom.matchesPixelRatio_(1) || .75 : 1;
};
goog.dom.matchesPixelRatio_ = function(a) {
  return goog.dom.getWindow().matchMedia("(min-resolution: " + a + "dppx),(min--moz-device-pixel-ratio: " + a + "),(min-resolution: " + 96 * a + "dpi)").matches ? a : 0;
};
goog.dom.getCanvasContext2D = function(a) {
  return a.getContext("2d");
};
goog.dom.DomHelper = function(a) {
  this.document_ = a || goog.global.document || document;
};
goog.dom.DomHelper.prototype.getDomHelper = goog.dom.getDomHelper;
goog.dom.DomHelper.prototype.setDocument = function(a) {
  this.document_ = a;
};
goog.dom.DomHelper.prototype.getDocument = function() {
  return this.document_;
};
goog.dom.DomHelper.prototype.getElement = function(a) {
  return goog.dom.getElementHelper_(this.document_, a);
};
goog.dom.DomHelper.prototype.getRequiredElement = function(a) {
  return goog.dom.getRequiredElementHelper_(this.document_, a);
};
goog.dom.DomHelper.prototype.$ = goog.dom.DomHelper.prototype.getElement;
goog.dom.DomHelper.prototype.getElementsByTagName = function(a, b) {
  return (b || this.document_).getElementsByTagName(String(a));
};
goog.dom.DomHelper.prototype.getElementsByTagNameAndClass = function(a, b, c) {
  return goog.dom.getElementsByTagNameAndClass_(this.document_, a, b, c);
};
goog.dom.DomHelper.prototype.getElementByTagNameAndClass = function(a, b, c) {
  return goog.dom.getElementByTagNameAndClass_(this.document_, a, b, c);
};
goog.dom.DomHelper.prototype.getElementsByClass = function(a, b) {
  return goog.dom.getElementsByClass(a, b || this.document_);
};
goog.dom.DomHelper.prototype.getElementByClass = function(a, b) {
  return goog.dom.getElementByClass(a, b || this.document_);
};
goog.dom.DomHelper.prototype.getRequiredElementByClass = function(a, b) {
  return goog.dom.getRequiredElementByClass(a, b || this.document_);
};
goog.dom.DomHelper.prototype.$$ = goog.dom.DomHelper.prototype.getElementsByTagNameAndClass;
goog.dom.DomHelper.prototype.setProperties = goog.dom.setProperties;
goog.dom.DomHelper.prototype.getViewportSize = function(a) {
  return goog.dom.getViewportSize(a || this.getWindow());
};
goog.dom.DomHelper.prototype.getDocumentHeight = function() {
  return goog.dom.getDocumentHeight_(this.getWindow());
};
goog.dom.DomHelper.prototype.createDom = function(a, b, c) {
  return goog.dom.createDom_(this.document_, arguments);
};
goog.dom.DomHelper.prototype.$dom = goog.dom.DomHelper.prototype.createDom;
goog.dom.DomHelper.prototype.createElement = function(a) {
  return goog.dom.createElement_(this.document_, a);
};
goog.dom.DomHelper.prototype.createTextNode = function(a) {
  return this.document_.createTextNode(String(a));
};
goog.dom.DomHelper.prototype.createTable = function(a, b, c) {
  return goog.dom.createTable_(this.document_, a, b, !!c);
};
goog.dom.DomHelper.prototype.safeHtmlToNode = function(a) {
  return goog.dom.safeHtmlToNode_(this.document_, a);
};
goog.dom.DomHelper.prototype.isCss1CompatMode = function() {
  return goog.dom.isCss1CompatMode_(this.document_);
};
goog.dom.DomHelper.prototype.getWindow = function() {
  return goog.dom.getWindow_(this.document_);
};
goog.dom.DomHelper.prototype.getDocumentScrollElement = function() {
  return goog.dom.getDocumentScrollElement_(this.document_);
};
goog.dom.DomHelper.prototype.getDocumentScroll = function() {
  return goog.dom.getDocumentScroll_(this.document_);
};
goog.dom.DomHelper.prototype.getActiveElement = function(a) {
  return goog.dom.getActiveElement(a || this.document_);
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
goog.dom.DomHelper.prototype.isFocusable = goog.dom.isFocusable;
goog.dom.DomHelper.prototype.getTextContent = goog.dom.getTextContent;
goog.dom.DomHelper.prototype.getNodeTextLength = goog.dom.getNodeTextLength;
goog.dom.DomHelper.prototype.getNodeTextOffset = goog.dom.getNodeTextOffset;
goog.dom.DomHelper.prototype.getNodeAtOffset = goog.dom.getNodeAtOffset;
goog.dom.DomHelper.prototype.isNodeList = goog.dom.isNodeList;
goog.dom.DomHelper.prototype.getAncestorByTagNameAndClass = goog.dom.getAncestorByTagNameAndClass;
goog.dom.DomHelper.prototype.getAncestorByClass = goog.dom.getAncestorByClass;
goog.dom.DomHelper.prototype.getAncestor = goog.dom.getAncestor;
goog.dom.DomHelper.prototype.getCanvasContext2D = goog.dom.getCanvasContext2D;
goog.math.Box = function(a, b, c, d) {
  this.top = a;
  this.right = b;
  this.bottom = c;
  this.left = d;
};
goog.math.Box.boundingBox = function(a) {
  for (var b = new goog.math.Box(arguments[0].y, arguments[0].x, arguments[0].y, arguments[0].x), c = 1; c < arguments.length; c++) {
    b.expandToIncludeCoordinate(arguments[c]);
  }
  return b;
};
goog.math.Box.prototype.getWidth = function() {
  return this.right - this.left;
};
goog.math.Box.prototype.getHeight = function() {
  return this.bottom - this.top;
};
goog.math.Box.prototype.clone = function() {
  return new goog.math.Box(this.top, this.right, this.bottom, this.left);
};
goog.DEBUG && (goog.math.Box.prototype.toString = function() {
  return "(" + this.top + "t, " + this.right + "r, " + this.bottom + "b, " + this.left + "l)";
});
goog.math.Box.prototype.contains = function(a) {
  return goog.math.Box.contains(this, a);
};
goog.math.Box.prototype.expand = function(a, b, c, d) {
  goog.isObject(a) ? (this.top -= a.top, this.right += a.right, this.bottom += a.bottom, this.left -= a.left) : (this.top -= a, this.right += Number(b), this.bottom += Number(c), this.left -= Number(d));
  return this;
};
goog.math.Box.prototype.expandToInclude = function(a) {
  this.left = Math.min(this.left, a.left);
  this.top = Math.min(this.top, a.top);
  this.right = Math.max(this.right, a.right);
  this.bottom = Math.max(this.bottom, a.bottom);
};
goog.math.Box.prototype.expandToIncludeCoordinate = function(a) {
  this.top = Math.min(this.top, a.y);
  this.right = Math.max(this.right, a.x);
  this.bottom = Math.max(this.bottom, a.y);
  this.left = Math.min(this.left, a.x);
};
goog.math.Box.equals = function(a, b) {
  return a == b ? !0 : a && b ? a.top == b.top && a.right == b.right && a.bottom == b.bottom && a.left == b.left : !1;
};
goog.math.Box.contains = function(a, b) {
  return a && b ? b instanceof goog.math.Box ? b.left >= a.left && b.right <= a.right && b.top >= a.top && b.bottom <= a.bottom : b.x >= a.left && b.x <= a.right && b.y >= a.top && b.y <= a.bottom : !1;
};
goog.math.Box.relativePositionX = function(a, b) {
  return b.x < a.left ? b.x - a.left : b.x > a.right ? b.x - a.right : 0;
};
goog.math.Box.relativePositionY = function(a, b) {
  return b.y < a.top ? b.y - a.top : b.y > a.bottom ? b.y - a.bottom : 0;
};
goog.math.Box.distance = function(a, b) {
  var c = goog.math.Box.relativePositionX(a, b);
  a = goog.math.Box.relativePositionY(a, b);
  return Math.sqrt(c * c + a * a);
};
goog.math.Box.intersects = function(a, b) {
  return a.left <= b.right && b.left <= a.right && a.top <= b.bottom && b.top <= a.bottom;
};
goog.math.Box.intersectsWithPadding = function(a, b, c) {
  return a.left <= b.right + c && b.left <= a.right + c && a.top <= b.bottom + c && b.top <= a.bottom + c;
};
goog.math.Box.prototype.ceil = function() {
  this.top = Math.ceil(this.top);
  this.right = Math.ceil(this.right);
  this.bottom = Math.ceil(this.bottom);
  this.left = Math.ceil(this.left);
  return this;
};
goog.math.Box.prototype.floor = function() {
  this.top = Math.floor(this.top);
  this.right = Math.floor(this.right);
  this.bottom = Math.floor(this.bottom);
  this.left = Math.floor(this.left);
  return this;
};
goog.math.Box.prototype.round = function() {
  this.top = Math.round(this.top);
  this.right = Math.round(this.right);
  this.bottom = Math.round(this.bottom);
  this.left = Math.round(this.left);
  return this;
};
goog.math.Box.prototype.translate = function(a, b) {
  a instanceof goog.math.Coordinate ? (this.left += a.x, this.right += a.x, this.top += a.y, this.bottom += a.y) : (goog.asserts.assertNumber(a), this.left += a, this.right += a, goog.isNumber(b) && (this.top += b, this.bottom += b));
  return this;
};
goog.math.Box.prototype.scale = function(a, b) {
  b = goog.isNumber(b) ? b : a;
  this.left *= a;
  this.right *= a;
  this.top *= b;
  this.bottom *= b;
  return this;
};
goog.math.IRect = function() {
};
goog.math.Rect = function(a, b, c, d) {
  this.left = a;
  this.top = b;
  this.width = c;
  this.height = d;
};
goog.math.Rect.prototype.clone = function() {
  return new goog.math.Rect(this.left, this.top, this.width, this.height);
};
goog.math.Rect.prototype.toBox = function() {
  return new goog.math.Box(this.top, this.left + this.width, this.top + this.height, this.left);
};
goog.math.Rect.createFromPositionAndSize = function(a, b) {
  return new goog.math.Rect(a.x, a.y, b.width, b.height);
};
goog.math.Rect.createFromBox = function(a) {
  return new goog.math.Rect(a.left, a.top, a.right - a.left, a.bottom - a.top);
};
goog.DEBUG && (goog.math.Rect.prototype.toString = function() {
  return "(" + this.left + ", " + this.top + " - " + this.width + "w x " + this.height + "h)";
});
goog.math.Rect.equals = function(a, b) {
  return a == b ? !0 : a && b ? a.left == b.left && a.width == b.width && a.top == b.top && a.height == b.height : !1;
};
goog.math.Rect.prototype.intersection = function(a) {
  var b = Math.max(this.left, a.left), c = Math.min(this.left + this.width, a.left + a.width);
  if (b <= c) {
    var d = Math.max(this.top, a.top);
    a = Math.min(this.top + this.height, a.top + a.height);
    if (d <= a) {
      return this.left = b, this.top = d, this.width = c - b, this.height = a - d, !0;
    }
  }
  return !1;
};
goog.math.Rect.intersection = function(a, b) {
  var c = Math.max(a.left, b.left), d = Math.min(a.left + a.width, b.left + b.width);
  if (c <= d) {
    var e = Math.max(a.top, b.top);
    a = Math.min(a.top + a.height, b.top + b.height);
    if (e <= a) {
      return new goog.math.Rect(c, e, d - c, a - e);
    }
  }
  return null;
};
goog.math.Rect.intersects = function(a, b) {
  return a.left <= b.left + b.width && b.left <= a.left + a.width && a.top <= b.top + b.height && b.top <= a.top + a.height;
};
goog.math.Rect.prototype.intersects = function(a) {
  return goog.math.Rect.intersects(this, a);
};
goog.math.Rect.difference = function(a, b) {
  var c = goog.math.Rect.intersection(a, b);
  if (!c || !c.height || !c.width) {
    return [a.clone()];
  }
  c = [];
  var d = a.top, e = a.height, f = a.left + a.width, g = a.top + a.height, h = b.left + b.width, k = b.top + b.height;
  b.top > a.top && (c.push(new goog.math.Rect(a.left, a.top, a.width, b.top - a.top)), d = b.top, e -= b.top - a.top);
  k < g && (c.push(new goog.math.Rect(a.left, k, a.width, g - k)), e = k - d);
  b.left > a.left && c.push(new goog.math.Rect(a.left, d, b.left - a.left, e));
  h < f && c.push(new goog.math.Rect(h, d, f - h, e));
  return c;
};
goog.math.Rect.prototype.difference = function(a) {
  return goog.math.Rect.difference(this, a);
};
goog.math.Rect.prototype.boundingRect = function(a) {
  var b = Math.max(this.left + this.width, a.left + a.width), c = Math.max(this.top + this.height, a.top + a.height);
  this.left = Math.min(this.left, a.left);
  this.top = Math.min(this.top, a.top);
  this.width = b - this.left;
  this.height = c - this.top;
};
goog.math.Rect.boundingRect = function(a, b) {
  if (!a || !b) {
    return null;
  }
  a = new goog.math.Rect(a.left, a.top, a.width, a.height);
  a.boundingRect(b);
  return a;
};
goog.math.Rect.prototype.contains = function(a) {
  return a instanceof goog.math.Coordinate ? a.x >= this.left && a.x <= this.left + this.width && a.y >= this.top && a.y <= this.top + this.height : this.left <= a.left && this.left + this.width >= a.left + a.width && this.top <= a.top && this.top + this.height >= a.top + a.height;
};
goog.math.Rect.prototype.squaredDistance = function(a) {
  var b = a.x < this.left ? this.left - a.x : Math.max(a.x - (this.left + this.width), 0);
  a = a.y < this.top ? this.top - a.y : Math.max(a.y - (this.top + this.height), 0);
  return b * b + a * a;
};
goog.math.Rect.prototype.distance = function(a) {
  return Math.sqrt(this.squaredDistance(a));
};
goog.math.Rect.prototype.getSize = function() {
  return new goog.math.Size(this.width, this.height);
};
goog.math.Rect.prototype.getTopLeft = function() {
  return new goog.math.Coordinate(this.left, this.top);
};
goog.math.Rect.prototype.getCenter = function() {
  return new goog.math.Coordinate(this.left + this.width / 2, this.top + this.height / 2);
};
goog.math.Rect.prototype.getBottomRight = function() {
  return new goog.math.Coordinate(this.left + this.width, this.top + this.height);
};
goog.math.Rect.prototype.ceil = function() {
  this.left = Math.ceil(this.left);
  this.top = Math.ceil(this.top);
  this.width = Math.ceil(this.width);
  this.height = Math.ceil(this.height);
  return this;
};
goog.math.Rect.prototype.floor = function() {
  this.left = Math.floor(this.left);
  this.top = Math.floor(this.top);
  this.width = Math.floor(this.width);
  this.height = Math.floor(this.height);
  return this;
};
goog.math.Rect.prototype.round = function() {
  this.left = Math.round(this.left);
  this.top = Math.round(this.top);
  this.width = Math.round(this.width);
  this.height = Math.round(this.height);
  return this;
};
goog.math.Rect.prototype.translate = function(a, b) {
  a instanceof goog.math.Coordinate ? (this.left += a.x, this.top += a.y) : (this.left += goog.asserts.assertNumber(a), goog.isNumber(b) && (this.top += b));
  return this;
};
goog.math.Rect.prototype.scale = function(a, b) {
  b = goog.isNumber(b) ? b : a;
  this.left *= a;
  this.width *= a;
  this.top *= b;
  this.height *= b;
  return this;
};
goog.debug.entryPointRegistry = {};
goog.debug.EntryPointMonitor = function() {
};
goog.debug.entryPointRegistry.refList_ = [];
goog.debug.entryPointRegistry.monitors_ = [];
goog.debug.entryPointRegistry.monitorsMayExist_ = !1;
goog.debug.entryPointRegistry.register = function(a) {
  goog.debug.entryPointRegistry.refList_[goog.debug.entryPointRegistry.refList_.length] = a;
  if (goog.debug.entryPointRegistry.monitorsMayExist_) {
    for (var b = goog.debug.entryPointRegistry.monitors_, c = 0; c < b.length; c++) {
      a(goog.bind(b[c].wrap, b[c]));
    }
  }
};
goog.debug.entryPointRegistry.monitorAll = function(a) {
  goog.debug.entryPointRegistry.monitorsMayExist_ = !0;
  for (var b = goog.bind(a.wrap, a), c = 0; c < goog.debug.entryPointRegistry.refList_.length; c++) {
    goog.debug.entryPointRegistry.refList_[c](b);
  }
  goog.debug.entryPointRegistry.monitors_.push(a);
};
goog.debug.entryPointRegistry.unmonitorAllIfPossible = function(a) {
  var b = goog.debug.entryPointRegistry.monitors_;
  goog.asserts.assert(a == b[b.length - 1], "Only the most recent monitor can be unwrapped.");
  a = goog.bind(a.unwrap, a);
  for (var c = 0; c < goog.debug.entryPointRegistry.refList_.length; c++) {
    goog.debug.entryPointRegistry.refList_[c](a);
  }
  b.length--;
};
goog.debug.errorcontext = {};
goog.debug.errorcontext.addErrorContext = function(a, b, c) {
  a[goog.debug.errorcontext.CONTEXT_KEY_] || (a[goog.debug.errorcontext.CONTEXT_KEY_] = {});
  a[goog.debug.errorcontext.CONTEXT_KEY_][b] = c;
};
goog.debug.errorcontext.getErrorContext = function(a) {
  return a[goog.debug.errorcontext.CONTEXT_KEY_] || {};
};
goog.debug.errorcontext.CONTEXT_KEY_ = "__closure__error__context__984382";
goog.debug.LOGGING_ENABLED = goog.DEBUG;
goog.debug.FORCE_SLOPPY_STACKS = !1;
goog.debug.catchErrors = function(a, b, c) {
  c = c || goog.global;
  var d = c.onerror, e = !!b;
  goog.userAgent.WEBKIT && !goog.userAgent.isVersionOrHigher("535.3") && (e = !e);
  c.onerror = function(b, c, h, k, l) {
    d && d(b, c, h, k, l);
    a({message:b, fileName:c, line:h, lineNumber:h, col:k, error:l});
    return e;
  };
};
goog.debug.expose = function(a, b) {
  if ("undefined" == typeof a) {
    return "undefined";
  }
  if (null == a) {
    return "NULL";
  }
  var c = [], d;
  for (d in a) {
    if (b || !goog.isFunction(a[d])) {
      var e = d + " = ";
      try {
        e += a[d];
      } catch (f) {
        e += "*** " + f + " ***";
      }
      c.push(e);
    }
  }
  return c.join("\n");
};
goog.debug.deepExpose = function(a, b) {
  var c = [], d = [], e = {}, f = function(a, h) {
    var g = h + "  ";
    try {
      if (goog.isDef(a)) {
        if (goog.isNull(a)) {
          c.push("NULL");
        } else {
          if (goog.isString(a)) {
            c.push('"' + a.replace(/\n/g, "\n" + h) + '"');
          } else {
            if (goog.isFunction(a)) {
              c.push(String(a).replace(/\n/g, "\n" + h));
            } else {
              if (goog.isObject(a)) {
                goog.hasUid(a) || d.push(a);
                var l = goog.getUid(a);
                if (e[l]) {
                  c.push("*** reference loop detected (id=" + l + ") ***");
                } else {
                  e[l] = !0;
                  c.push("{");
                  for (var m in a) {
                    if (b || !goog.isFunction(a[m])) {
                      c.push("\n"), c.push(g), c.push(m + " = "), f(a[m], g);
                    }
                  }
                  c.push("\n" + h + "}");
                  delete e[l];
                }
              } else {
                c.push(a);
              }
            }
          }
        }
      } else {
        c.push("undefined");
      }
    } catch (n) {
      c.push("*** " + n + " ***");
    }
  };
  f(a, "");
  for (a = 0; a < d.length; a++) {
    goog.removeUid(d[a]);
  }
  return c.join("");
};
goog.debug.exposeArray = function(a) {
  for (var b = [], c = 0; c < a.length; c++) {
    goog.isArray(a[c]) ? b.push(goog.debug.exposeArray(a[c])) : b.push(a[c]);
  }
  return "[ " + b.join(", ") + " ]";
};
goog.debug.normalizeErrorObject = function(a) {
  var b = goog.getObjectByName("window.location.href");
  if (goog.isString(a)) {
    return {message:a, name:"Unknown error", lineNumber:"Not available", fileName:b, stack:"Not available"};
  }
  var c = !1;
  try {
    var d = a.lineNumber || a.line || "Not available";
  } catch (f) {
    d = "Not available", c = !0;
  }
  try {
    var e = a.fileName || a.filename || a.sourceURL || goog.global.$googDebugFname || b;
  } catch (f) {
    e = "Not available", c = !0;
  }
  return !c && a.lineNumber && a.fileName && a.stack && a.message && a.name ? a : {message:a.message || "Not available", name:a.name || "UnknownError", lineNumber:d, fileName:e, stack:a.stack || "Not available"};
};
goog.debug.enhanceError = function(a, b) {
  a instanceof Error || (a = Error(a), Error.captureStackTrace && Error.captureStackTrace(a, goog.debug.enhanceError));
  a.stack || (a.stack = goog.debug.getStacktrace(goog.debug.enhanceError));
  if (b) {
    for (var c = 0; a["message" + c];) {
      ++c;
    }
    a["message" + c] = String(b);
  }
  return a;
};
goog.debug.enhanceErrorWithContext = function(a, b) {
  a = goog.debug.enhanceError(a);
  if (b) {
    for (var c in b) {
      goog.debug.errorcontext.addErrorContext(a, c, b[c]);
    }
  }
  return a;
};
goog.debug.getStacktraceSimple = function(a) {
  if (!goog.debug.FORCE_SLOPPY_STACKS) {
    var b = goog.debug.getNativeStackTrace_(goog.debug.getStacktraceSimple);
    if (b) {
      return b;
    }
  }
  b = [];
  for (var c = arguments.callee.caller, d = 0; c && (!a || d < a);) {
    b.push(goog.debug.getFunctionName(c));
    b.push("()\n");
    try {
      c = c.caller;
    } catch (e) {
      b.push("[exception trying to get caller]\n");
      break;
    }
    d++;
    if (d >= goog.debug.MAX_STACK_DEPTH) {
      b.push("[...long stack...]");
      break;
    }
  }
  a && d >= a ? b.push("[...reached max depth limit...]") : b.push("[end]");
  return b.join("");
};
goog.debug.MAX_STACK_DEPTH = 50;
goog.debug.getNativeStackTrace_ = function(a) {
  var b = Error();
  if (Error.captureStackTrace) {
    return Error.captureStackTrace(b, a), String(b.stack);
  }
  try {
    throw b;
  } catch (c) {
    b = c;
  }
  return (a = b.stack) ? String(a) : null;
};
goog.debug.getStacktrace = function(a) {
  var b;
  goog.debug.FORCE_SLOPPY_STACKS || (b = goog.debug.getNativeStackTrace_(a || goog.debug.getStacktrace));
  b || (b = goog.debug.getStacktraceHelper_(a || arguments.callee.caller, []));
  return b;
};
goog.debug.getStacktraceHelper_ = function(a, b) {
  var c = [];
  if (goog.array.contains(b, a)) {
    c.push("[...circular reference...]");
  } else {
    if (a && b.length < goog.debug.MAX_STACK_DEPTH) {
      c.push(goog.debug.getFunctionName(a) + "(");
      for (var d = a.arguments, e = 0; d && e < d.length; e++) {
        0 < e && c.push(", ");
        var f = d[e];
        switch(typeof f) {
          case "object":
            f = f ? "object" : "null";
            break;
          case "string":
            break;
          case "number":
            f = String(f);
            break;
          case "boolean":
            f = f ? "true" : "false";
            break;
          case "function":
            f = (f = goog.debug.getFunctionName(f)) ? f : "[fn]";
            break;
          default:
            f = typeof f;
        }
        40 < f.length && (f = f.substr(0, 40) + "...");
        c.push(f);
      }
      b.push(a);
      c.push(")\n");
      try {
        c.push(goog.debug.getStacktraceHelper_(a.caller, b));
      } catch (g) {
        c.push("[exception trying to get caller]\n");
      }
    } else {
      a ? c.push("[...long stack...]") : c.push("[end]");
    }
  }
  return c.join("");
};
goog.debug.setFunctionResolver = function(a) {
  goog.debug.fnNameResolver_ = a;
};
goog.debug.getFunctionName = function(a) {
  if (goog.debug.fnNameCache_[a]) {
    return goog.debug.fnNameCache_[a];
  }
  if (goog.debug.fnNameResolver_) {
    var b = goog.debug.fnNameResolver_(a);
    if (b) {
      return goog.debug.fnNameCache_[a] = b;
    }
  }
  a = String(a);
  goog.debug.fnNameCache_[a] || (b = /function ([^\(]+)/.exec(a), goog.debug.fnNameCache_[a] = b ? b[1] : "[Anonymous]");
  return goog.debug.fnNameCache_[a];
};
goog.debug.makeWhitespaceVisible = function(a) {
  return a.replace(/ /g, "[_]").replace(/\f/g, "[f]").replace(/\n/g, "[n]\n").replace(/\r/g, "[r]").replace(/\t/g, "[t]");
};
goog.debug.runtimeType = function(a) {
  return a instanceof Function ? a.displayName || a.name || "unknown type name" : a instanceof Object ? a.constructor.displayName || a.constructor.name || Object.prototype.toString.call(a) : null === a ? "null" : typeof a;
};
goog.debug.fnNameCache_ = {};
goog.debug.freezeInternal_ = goog.DEBUG && Object.freeze || function(a) {
  return a;
};
goog.debug.freeze = function(a) {
  return goog.debug.freezeInternal_(a);
};
goog.events = {};
$jscomp.scope.purify = function(a) {
  return {valueOf:a}.valueOf();
};
goog.events.BrowserFeature = {HAS_W3C_BUTTON:!goog.userAgent.IE || goog.userAgent.isDocumentModeOrHigher(9), HAS_W3C_EVENT_SUPPORT:!goog.userAgent.IE || goog.userAgent.isDocumentModeOrHigher(9), SET_KEY_CODE_TO_PREVENT_DEFAULT:goog.userAgent.IE && !goog.userAgent.isVersionOrHigher("9"), HAS_NAVIGATOR_ONLINE_PROPERTY:!goog.userAgent.WEBKIT || goog.userAgent.isVersionOrHigher("528"), HAS_HTML5_NETWORK_EVENT_SUPPORT:goog.userAgent.GECKO && goog.userAgent.isVersionOrHigher("1.9b") || goog.userAgent.IE && 
goog.userAgent.isVersionOrHigher("8") || goog.userAgent.OPERA && goog.userAgent.isVersionOrHigher("9.5") || goog.userAgent.WEBKIT && goog.userAgent.isVersionOrHigher("528"), HTML5_NETWORK_EVENTS_FIRE_ON_BODY:goog.userAgent.GECKO && !goog.userAgent.isVersionOrHigher("8") || goog.userAgent.IE && !goog.userAgent.isVersionOrHigher("9"), TOUCH_ENABLED:"ontouchstart" in goog.global || !!(goog.global.document && document.documentElement && "ontouchstart" in document.documentElement) || !(!goog.global.navigator || 
!goog.global.navigator.maxTouchPoints && !goog.global.navigator.msMaxTouchPoints), POINTER_EVENTS:"PointerEvent" in goog.global, MSPOINTER_EVENTS:"MSPointerEvent" in goog.global && !(!goog.global.navigator || !goog.global.navigator.msPointerEnabled), PASSIVE_EVENTS:(0,$jscomp.scope.purify)(function() {
  if (!goog.global.addEventListener || !Object.defineProperty) {
    return !1;
  }
  var a = !1, b = Object.defineProperty({}, "passive", {get:function() {
    a = !0;
  }});
  goog.global.addEventListener("test", goog.nullFunction, b);
  goog.global.removeEventListener("test", goog.nullFunction, b);
  return a;
})};
goog.disposable = {};
goog.disposable.IDisposable = function() {
};
goog.disposable.IDisposable.prototype.dispose = goog.abstractMethod;
goog.disposable.IDisposable.prototype.isDisposed = goog.abstractMethod;
goog.Disposable = function() {
  goog.Disposable.MONITORING_MODE != goog.Disposable.MonitoringMode.OFF && (goog.Disposable.INCLUDE_STACK_ON_CREATION && (this.creationStack = Error().stack), goog.Disposable.instances_[goog.getUid(this)] = this);
  this.disposed_ = this.disposed_;
  this.onDisposeCallbacks_ = this.onDisposeCallbacks_;
};
goog.Disposable.MonitoringMode = {OFF:0, PERMANENT:1, INTERACTIVE:2};
goog.Disposable.MONITORING_MODE = 0;
goog.Disposable.INCLUDE_STACK_ON_CREATION = !0;
goog.Disposable.instances_ = {};
goog.Disposable.getUndisposedObjects = function() {
  var a = [], b;
  for (b in goog.Disposable.instances_) {
    goog.Disposable.instances_.hasOwnProperty(b) && a.push(goog.Disposable.instances_[Number(b)]);
  }
  return a;
};
goog.Disposable.clearUndisposedObjects = function() {
  goog.Disposable.instances_ = {};
};
goog.Disposable.prototype.disposed_ = !1;
goog.Disposable.prototype.isDisposed = function() {
  return this.disposed_;
};
goog.Disposable.prototype.getDisposed = goog.Disposable.prototype.isDisposed;
goog.Disposable.prototype.dispose = function() {
  if (!this.disposed_ && (this.disposed_ = !0, this.disposeInternal(), goog.Disposable.MONITORING_MODE != goog.Disposable.MonitoringMode.OFF)) {
    var a = goog.getUid(this);
    if (goog.Disposable.MONITORING_MODE == goog.Disposable.MonitoringMode.PERMANENT && !goog.Disposable.instances_.hasOwnProperty(a)) {
      throw Error(this + " did not call the goog.Disposable base constructor or was disposed of after a clearUndisposedObjects call");
    }
    if (goog.Disposable.MONITORING_MODE != goog.Disposable.MonitoringMode.OFF && this.onDisposeCallbacks_ && 0 < this.onDisposeCallbacks_.length) {
      throw Error(this + " did not empty its onDisposeCallbacks queue. This probably means it overrode dispose() or disposeInternal() without calling the superclass' method.");
    }
    delete goog.Disposable.instances_[a];
  }
};
goog.Disposable.prototype.registerDisposable = function(a) {
  this.addOnDisposeCallback(goog.partial(goog.dispose, a));
};
goog.Disposable.prototype.addOnDisposeCallback = function(a, b) {
  this.disposed_ ? goog.isDef(b) ? a.call(b) : a() : (this.onDisposeCallbacks_ || (this.onDisposeCallbacks_ = []), this.onDisposeCallbacks_.push(goog.isDef(b) ? goog.bind(a, b) : a));
};
goog.Disposable.prototype.disposeInternal = function() {
  if (this.onDisposeCallbacks_) {
    for (; this.onDisposeCallbacks_.length;) {
      this.onDisposeCallbacks_.shift()();
    }
  }
};
goog.Disposable.isDisposed = function(a) {
  return a && "function" == typeof a.isDisposed ? a.isDisposed() : !1;
};
goog.dispose = function(a) {
  a && "function" == typeof a.dispose && a.dispose();
};
goog.disposeAll = function(a) {
  for (var b = 0, c = arguments.length; b < c; ++b) {
    var d = arguments[b];
    goog.isArrayLike(d) ? goog.disposeAll.apply(null, d) : goog.dispose(d);
  }
};
goog.events.EventId = function(a) {
  this.id = a;
};
goog.events.EventId.prototype.toString = function() {
  return this.id;
};
goog.events.Event = function(a, b) {
  this.type = a instanceof goog.events.EventId ? String(a) : a;
  this.currentTarget = this.target = b;
  this.defaultPrevented = this.propagationStopped_ = !1;
  this.returnValue_ = !0;
};
goog.events.Event.prototype.stopPropagation = function() {
  this.propagationStopped_ = !0;
};
goog.events.Event.prototype.preventDefault = function() {
  this.defaultPrevented = !0;
  this.returnValue_ = !1;
};
goog.events.Event.stopPropagation = function(a) {
  a.stopPropagation();
};
goog.events.Event.preventDefault = function(a) {
  a.preventDefault();
};
goog.events.getVendorPrefixedName_ = function(a) {
  return goog.userAgent.WEBKIT ? "webkit" + a : goog.userAgent.OPERA ? "o" + a.toLowerCase() : a.toLowerCase();
};
goog.events.EventType = {CLICK:"click", RIGHTCLICK:"rightclick", DBLCLICK:"dblclick", MOUSEDOWN:"mousedown", MOUSEUP:"mouseup", MOUSEOVER:"mouseover", MOUSEOUT:"mouseout", MOUSEMOVE:"mousemove", MOUSEENTER:"mouseenter", MOUSELEAVE:"mouseleave", MOUSECANCEL:"mousecancel", SELECTIONCHANGE:"selectionchange", SELECTSTART:"selectstart", WHEEL:"wheel", KEYPRESS:"keypress", KEYDOWN:"keydown", KEYUP:"keyup", BLUR:"blur", FOCUS:"focus", DEACTIVATE:"deactivate", FOCUSIN:"focusin", FOCUSOUT:"focusout", CHANGE:"change", 
RESET:"reset", SELECT:"select", SUBMIT:"submit", INPUT:"input", PROPERTYCHANGE:"propertychange", DRAGSTART:"dragstart", DRAG:"drag", DRAGENTER:"dragenter", DRAGOVER:"dragover", DRAGLEAVE:"dragleave", DROP:"drop", DRAGEND:"dragend", TOUCHSTART:"touchstart", TOUCHMOVE:"touchmove", TOUCHEND:"touchend", TOUCHCANCEL:"touchcancel", BEFOREUNLOAD:"beforeunload", CONSOLEMESSAGE:"consolemessage", CONTEXTMENU:"contextmenu", DEVICECHANGE:"devicechange", DEVICEMOTION:"devicemotion", DEVICEORIENTATION:"deviceorientation", 
DOMCONTENTLOADED:"DOMContentLoaded", ERROR:"error", HELP:"help", LOAD:"load", LOSECAPTURE:"losecapture", ORIENTATIONCHANGE:"orientationchange", READYSTATECHANGE:"readystatechange", RESIZE:"resize", SCROLL:"scroll", UNLOAD:"unload", CANPLAY:"canplay", CANPLAYTHROUGH:"canplaythrough", DURATIONCHANGE:"durationchange", EMPTIED:"emptied", ENDED:"ended", LOADEDDATA:"loadeddata", LOADEDMETADATA:"loadedmetadata", PAUSE:"pause", PLAY:"play", PLAYING:"playing", RATECHANGE:"ratechange", SEEKED:"seeked", SEEKING:"seeking", 
STALLED:"stalled", SUSPEND:"suspend", TIMEUPDATE:"timeupdate", VOLUMECHANGE:"volumechange", WAITING:"waiting", SOURCEOPEN:"sourceopen", SOURCEENDED:"sourceended", SOURCECLOSED:"sourceclosed", ABORT:"abort", UPDATE:"update", UPDATESTART:"updatestart", UPDATEEND:"updateend", HASHCHANGE:"hashchange", PAGEHIDE:"pagehide", PAGESHOW:"pageshow", POPSTATE:"popstate", COPY:"copy", PASTE:"paste", CUT:"cut", BEFORECOPY:"beforecopy", BEFORECUT:"beforecut", BEFOREPASTE:"beforepaste", ONLINE:"online", OFFLINE:"offline", 
MESSAGE:"message", CONNECT:"connect", INSTALL:"install", ACTIVATE:"activate", FETCH:"fetch", FOREIGNFETCH:"foreignfetch", MESSAGEERROR:"messageerror", STATECHANGE:"statechange", UPDATEFOUND:"updatefound", CONTROLLERCHANGE:"controllerchange", ANIMATIONSTART:goog.events.getVendorPrefixedName_("AnimationStart"), ANIMATIONEND:goog.events.getVendorPrefixedName_("AnimationEnd"), ANIMATIONITERATION:goog.events.getVendorPrefixedName_("AnimationIteration"), TRANSITIONEND:goog.events.getVendorPrefixedName_("TransitionEnd"), 
POINTERDOWN:"pointerdown", POINTERUP:"pointerup", POINTERCANCEL:"pointercancel", POINTERMOVE:"pointermove", POINTEROVER:"pointerover", POINTEROUT:"pointerout", POINTERENTER:"pointerenter", POINTERLEAVE:"pointerleave", GOTPOINTERCAPTURE:"gotpointercapture", LOSTPOINTERCAPTURE:"lostpointercapture", MSGESTURECHANGE:"MSGestureChange", MSGESTUREEND:"MSGestureEnd", MSGESTUREHOLD:"MSGestureHold", MSGESTURESTART:"MSGestureStart", MSGESTURETAP:"MSGestureTap", MSGOTPOINTERCAPTURE:"MSGotPointerCapture", MSINERTIASTART:"MSInertiaStart", 
MSLOSTPOINTERCAPTURE:"MSLostPointerCapture", MSPOINTERCANCEL:"MSPointerCancel", MSPOINTERDOWN:"MSPointerDown", MSPOINTERENTER:"MSPointerEnter", MSPOINTERHOVER:"MSPointerHover", MSPOINTERLEAVE:"MSPointerLeave", MSPOINTERMOVE:"MSPointerMove", MSPOINTEROUT:"MSPointerOut", MSPOINTEROVER:"MSPointerOver", MSPOINTERUP:"MSPointerUp", TEXT:"text", TEXTINPUT:goog.userAgent.IE ? "textinput" : "textInput", COMPOSITIONSTART:"compositionstart", COMPOSITIONUPDATE:"compositionupdate", COMPOSITIONEND:"compositionend", 
BEFOREINPUT:"beforeinput", EXIT:"exit", LOADABORT:"loadabort", LOADCOMMIT:"loadcommit", LOADREDIRECT:"loadredirect", LOADSTART:"loadstart", LOADSTOP:"loadstop", RESPONSIVE:"responsive", SIZECHANGED:"sizechanged", UNRESPONSIVE:"unresponsive", VISIBILITYCHANGE:"visibilitychange", STORAGE:"storage", DOMSUBTREEMODIFIED:"DOMSubtreeModified", DOMNODEINSERTED:"DOMNodeInserted", DOMNODEREMOVED:"DOMNodeRemoved", DOMNODEREMOVEDFROMDOCUMENT:"DOMNodeRemovedFromDocument", DOMNODEINSERTEDINTODOCUMENT:"DOMNodeInsertedIntoDocument", 
DOMATTRMODIFIED:"DOMAttrModified", DOMCHARACTERDATAMODIFIED:"DOMCharacterDataModified", BEFOREPRINT:"beforeprint", AFTERPRINT:"afterprint", BEFOREINSTALLPROMPT:"beforeinstallprompt", APPINSTALLED:"appinstalled"};
goog.events.getPointerFallbackEventName_ = function(a, b, c) {
  return goog.events.BrowserFeature.POINTER_EVENTS ? a : goog.events.BrowserFeature.MSPOINTER_EVENTS ? b : c;
};
goog.events.PointerFallbackEventType = {POINTERDOWN:goog.events.getPointerFallbackEventName_(goog.events.EventType.POINTERDOWN, goog.events.EventType.MSPOINTERDOWN, goog.events.EventType.MOUSEDOWN), POINTERUP:goog.events.getPointerFallbackEventName_(goog.events.EventType.POINTERUP, goog.events.EventType.MSPOINTERUP, goog.events.EventType.MOUSEUP), POINTERCANCEL:goog.events.getPointerFallbackEventName_(goog.events.EventType.POINTERCANCEL, goog.events.EventType.MSPOINTERCANCEL, goog.events.EventType.MOUSECANCEL), 
POINTERMOVE:goog.events.getPointerFallbackEventName_(goog.events.EventType.POINTERMOVE, goog.events.EventType.MSPOINTERMOVE, goog.events.EventType.MOUSEMOVE), POINTEROVER:goog.events.getPointerFallbackEventName_(goog.events.EventType.POINTEROVER, goog.events.EventType.MSPOINTEROVER, goog.events.EventType.MOUSEOVER), POINTEROUT:goog.events.getPointerFallbackEventName_(goog.events.EventType.POINTEROUT, goog.events.EventType.MSPOINTEROUT, goog.events.EventType.MOUSEOUT), POINTERENTER:goog.events.getPointerFallbackEventName_(goog.events.EventType.POINTERENTER, 
goog.events.EventType.MSPOINTERENTER, goog.events.EventType.MOUSEENTER), POINTERLEAVE:goog.events.getPointerFallbackEventName_(goog.events.EventType.POINTERLEAVE, goog.events.EventType.MSPOINTERLEAVE, goog.events.EventType.MOUSELEAVE)};
goog.events.PointerAsMouseEventType = {MOUSEDOWN:goog.events.PointerFallbackEventType.POINTERDOWN, MOUSEUP:goog.events.PointerFallbackEventType.POINTERUP, MOUSECANCEL:goog.events.PointerFallbackEventType.POINTERCANCEL, MOUSEMOVE:goog.events.PointerFallbackEventType.POINTERMOVE, MOUSEOVER:goog.events.PointerFallbackEventType.POINTEROVER, MOUSEOUT:goog.events.PointerFallbackEventType.POINTEROUT, MOUSEENTER:goog.events.PointerFallbackEventType.POINTERENTER, MOUSELEAVE:goog.events.PointerFallbackEventType.POINTERLEAVE};
goog.events.BrowserEvent = function(a, b) {
  goog.events.Event.call(this, a ? a.type : "");
  this.relatedTarget = this.currentTarget = this.target = null;
  this.button = this.screenY = this.screenX = this.clientY = this.clientX = this.offsetY = this.offsetX = 0;
  this.key = "";
  this.charCode = this.keyCode = 0;
  this.metaKey = this.shiftKey = this.altKey = this.ctrlKey = !1;
  this.state = null;
  this.platformModifierKey = !1;
  this.pointerId = 0;
  this.pointerType = "";
  this.event_ = null;
  a && this.init(a, b);
};
goog.inherits(goog.events.BrowserEvent, goog.events.Event);
goog.events.BrowserEvent.MouseButton = {LEFT:0, MIDDLE:1, RIGHT:2};
goog.events.BrowserEvent.PointerType = {MOUSE:"mouse", PEN:"pen", TOUCH:"touch"};
goog.events.BrowserEvent.IEButtonMap = goog.debug.freeze([1, 4, 2]);
goog.events.BrowserEvent.IE_BUTTON_MAP = goog.events.BrowserEvent.IEButtonMap;
goog.events.BrowserEvent.IE_POINTER_TYPE_MAP = goog.debug.freeze({2:goog.events.BrowserEvent.PointerType.TOUCH, 3:goog.events.BrowserEvent.PointerType.PEN, 4:goog.events.BrowserEvent.PointerType.MOUSE});
goog.events.BrowserEvent.prototype.init = function(a, b) {
  var c = this.type = a.type, d = a.changedTouches ? a.changedTouches[0] : null;
  this.target = a.target || a.srcElement;
  this.currentTarget = b;
  (b = a.relatedTarget) ? goog.userAgent.GECKO && (goog.reflect.canAccessProperty(b, "nodeName") || (b = null)) : c == goog.events.EventType.MOUSEOVER ? b = a.fromElement : c == goog.events.EventType.MOUSEOUT && (b = a.toElement);
  this.relatedTarget = b;
  goog.isNull(d) ? (this.offsetX = goog.userAgent.WEBKIT || void 0 !== a.offsetX ? a.offsetX : a.layerX, this.offsetY = goog.userAgent.WEBKIT || void 0 !== a.offsetY ? a.offsetY : a.layerY, this.clientX = void 0 !== a.clientX ? a.clientX : a.pageX, this.clientY = void 0 !== a.clientY ? a.clientY : a.pageY, this.screenX = a.screenX || 0, this.screenY = a.screenY || 0) : (this.clientX = void 0 !== d.clientX ? d.clientX : d.pageX, this.clientY = void 0 !== d.clientY ? d.clientY : d.pageY, this.screenX = 
  d.screenX || 0, this.screenY = d.screenY || 0);
  this.button = a.button;
  this.keyCode = a.keyCode || 0;
  this.key = a.key || "";
  this.charCode = a.charCode || ("keypress" == c ? a.keyCode : 0);
  this.ctrlKey = a.ctrlKey;
  this.altKey = a.altKey;
  this.shiftKey = a.shiftKey;
  this.metaKey = a.metaKey;
  this.platformModifierKey = goog.userAgent.MAC ? a.metaKey : a.ctrlKey;
  this.pointerId = a.pointerId || 0;
  this.pointerType = goog.events.BrowserEvent.getPointerType_(a);
  this.state = a.state;
  this.event_ = a;
  a.defaultPrevented && this.preventDefault();
};
goog.events.BrowserEvent.prototype.isButton = function(a) {
  return goog.events.BrowserFeature.HAS_W3C_BUTTON ? this.event_.button == a : "click" == this.type ? a == goog.events.BrowserEvent.MouseButton.LEFT : !!(this.event_.button & goog.events.BrowserEvent.IE_BUTTON_MAP[a]);
};
goog.events.BrowserEvent.prototype.isMouseActionButton = function() {
  return this.isButton(goog.events.BrowserEvent.MouseButton.LEFT) && !(goog.userAgent.WEBKIT && goog.userAgent.MAC && this.ctrlKey);
};
goog.events.BrowserEvent.prototype.stopPropagation = function() {
  goog.events.BrowserEvent.superClass_.stopPropagation.call(this);
  this.event_.stopPropagation ? this.event_.stopPropagation() : this.event_.cancelBubble = !0;
};
goog.events.BrowserEvent.prototype.preventDefault = function() {
  goog.events.BrowserEvent.superClass_.preventDefault.call(this);
  var a = this.event_;
  if (a.preventDefault) {
    a.preventDefault();
  } else {
    if (a.returnValue = !1, goog.events.BrowserFeature.SET_KEY_CODE_TO_PREVENT_DEFAULT) {
      try {
        if (a.ctrlKey || 112 <= a.keyCode && 123 >= a.keyCode) {
          a.keyCode = -1;
        }
      } catch (b) {
      }
    }
  }
};
goog.events.BrowserEvent.prototype.getBrowserEvent = function() {
  return this.event_;
};
goog.events.BrowserEvent.getPointerType_ = function(a) {
  return goog.isString(a.pointerType) ? a.pointerType : goog.events.BrowserEvent.IE_POINTER_TYPE_MAP[a.pointerType] || "";
};
goog.events.Listenable = function() {
};
goog.events.Listenable.IMPLEMENTED_BY_PROP = "closure_listenable_" + (1e6 * Math.random() | 0);
goog.events.Listenable.addImplementation = function(a) {
  a.prototype[goog.events.Listenable.IMPLEMENTED_BY_PROP] = !0;
};
goog.events.Listenable.isImplementedBy = function(a) {
  return !(!a || !a[goog.events.Listenable.IMPLEMENTED_BY_PROP]);
};
goog.events.ListenableKey = function() {
};
goog.events.ListenableKey.counter_ = 0;
goog.events.ListenableKey.reserveKey = function() {
  return ++goog.events.ListenableKey.counter_;
};
goog.events.Listener = function(a, b, c, d, e, f) {
  goog.events.Listener.ENABLE_MONITORING && (this.creationStack = Error().stack);
  this.listener = a;
  this.proxy = b;
  this.src = c;
  this.type = d;
  this.capture = !!e;
  this.handler = f;
  this.key = goog.events.ListenableKey.reserveKey();
  this.removed = this.callOnce = !1;
};
goog.events.Listener.ENABLE_MONITORING = !1;
goog.events.Listener.prototype.markAsRemoved = function() {
  this.removed = !0;
  this.handler = this.src = this.proxy = this.listener = null;
};
goog.events.ListenerMap = function(a) {
  this.src = a;
  this.listeners = {};
  this.typeCount_ = 0;
};
goog.events.ListenerMap.prototype.getTypeCount = function() {
  return this.typeCount_;
};
goog.events.ListenerMap.prototype.getListenerCount = function() {
  var a = 0, b;
  for (b in this.listeners) {
    a += this.listeners[b].length;
  }
  return a;
};
goog.events.ListenerMap.prototype.add = function(a, b, c, d, e) {
  var f = a.toString();
  a = this.listeners[f];
  a || (a = this.listeners[f] = [], this.typeCount_++);
  var g = goog.events.ListenerMap.findListenerIndex_(a, b, d, e);
  -1 < g ? (b = a[g], c || (b.callOnce = !1)) : (b = new goog.events.Listener(b, null, this.src, f, !!d, e), b.callOnce = c, a.push(b));
  return b;
};
goog.events.ListenerMap.prototype.remove = function(a, b, c, d) {
  a = a.toString();
  if (!(a in this.listeners)) {
    return !1;
  }
  var e = this.listeners[a];
  b = goog.events.ListenerMap.findListenerIndex_(e, b, c, d);
  return -1 < b ? (e[b].markAsRemoved(), goog.array.removeAt(e, b), 0 == e.length && (delete this.listeners[a], this.typeCount_--), !0) : !1;
};
goog.events.ListenerMap.prototype.removeByKey = function(a) {
  var b = a.type;
  if (!(b in this.listeners)) {
    return !1;
  }
  var c = goog.array.remove(this.listeners[b], a);
  c && (a.markAsRemoved(), 0 == this.listeners[b].length && (delete this.listeners[b], this.typeCount_--));
  return c;
};
goog.events.ListenerMap.prototype.removeAll = function(a) {
  a = a && a.toString();
  var b = 0, c;
  for (c in this.listeners) {
    if (!a || c == a) {
      for (var d = this.listeners[c], e = 0; e < d.length; e++) {
        ++b, d[e].markAsRemoved();
      }
      delete this.listeners[c];
      this.typeCount_--;
    }
  }
  return b;
};
goog.events.ListenerMap.prototype.getListeners = function(a, b) {
  a = this.listeners[a.toString()];
  var c = [];
  if (a) {
    for (var d = 0; d < a.length; ++d) {
      var e = a[d];
      e.capture == b && c.push(e);
    }
  }
  return c;
};
goog.events.ListenerMap.prototype.getListener = function(a, b, c, d) {
  a = this.listeners[a.toString()];
  var e = -1;
  a && (e = goog.events.ListenerMap.findListenerIndex_(a, b, c, d));
  return -1 < e ? a[e] : null;
};
goog.events.ListenerMap.prototype.hasListener = function(a, b) {
  var c = goog.isDef(a), d = c ? a.toString() : "", e = goog.isDef(b);
  return goog.object.some(this.listeners, function(a, g) {
    for (g = 0; g < a.length; ++g) {
      if (!(c && a[g].type != d || e && a[g].capture != b)) {
        return !0;
      }
    }
    return !1;
  });
};
goog.events.ListenerMap.findListenerIndex_ = function(a, b, c, d) {
  for (var e = 0; e < a.length; ++e) {
    var f = a[e];
    if (!f.removed && f.listener == b && f.capture == !!c && f.handler == d) {
      return e;
    }
  }
  return -1;
};
goog.events.LISTENER_MAP_PROP_ = "closure_lm_" + (1e6 * Math.random() | 0);
goog.events.onString_ = "on";
goog.events.onStringMap_ = {};
goog.events.CaptureSimulationMode = {OFF_AND_FAIL:0, OFF_AND_SILENT:1, ON:2};
goog.events.CAPTURE_SIMULATION_MODE = 2;
goog.events.listenerCountEstimate_ = 0;
goog.events.listen = function(a, b, c, d, e) {
  if (d && d.once) {
    return goog.events.listenOnce(a, b, c, d, e);
  }
  if (goog.isArray(b)) {
    for (var f = 0; f < b.length; f++) {
      goog.events.listen(a, b[f], c, d, e);
    }
    return null;
  }
  c = goog.events.wrapListener(c);
  return goog.events.Listenable.isImplementedBy(a) ? (d = goog.isObject(d) ? !!d.capture : !!d, a.listen(b, c, d, e)) : goog.events.listen_(a, b, c, !1, d, e);
};
goog.events.listen_ = function(a, b, c, d, e, f) {
  if (!b) {
    throw Error("Invalid event type");
  }
  var g = goog.isObject(e) ? !!e.capture : !!e;
  if (g && !goog.events.BrowserFeature.HAS_W3C_EVENT_SUPPORT) {
    if (goog.events.CAPTURE_SIMULATION_MODE == goog.events.CaptureSimulationMode.OFF_AND_FAIL) {
      return goog.asserts.fail("Can not register capture listener in IE8-."), null;
    }
    if (goog.events.CAPTURE_SIMULATION_MODE == goog.events.CaptureSimulationMode.OFF_AND_SILENT) {
      return null;
    }
  }
  var h = goog.events.getListenerMap_(a);
  h || (a[goog.events.LISTENER_MAP_PROP_] = h = new goog.events.ListenerMap(a));
  c = h.add(b, c, d, g, f);
  if (c.proxy) {
    return c;
  }
  d = goog.events.getProxy();
  c.proxy = d;
  d.src = a;
  d.listener = c;
  if (a.addEventListener) {
    goog.events.BrowserFeature.PASSIVE_EVENTS || (e = g), void 0 === e && (e = !1), a.addEventListener(b.toString(), d, e);
  } else {
    if (a.attachEvent) {
      a.attachEvent(goog.events.getOnString_(b.toString()), d);
    } else {
      if (a.addListener && a.removeListener) {
        goog.asserts.assert("change" === b, "MediaQueryList only has a change event"), a.addListener(d);
      } else {
        throw Error("addEventListener and attachEvent are unavailable.");
      }
    }
  }
  goog.events.listenerCountEstimate_++;
  return c;
};
goog.events.getProxy = function() {
  var a = goog.events.handleBrowserEvent_, b = goog.events.BrowserFeature.HAS_W3C_EVENT_SUPPORT ? function(c) {
    return a.call(b.src, b.listener, c);
  } : function(c) {
    c = a.call(b.src, b.listener, c);
    if (!c) {
      return c;
    }
  };
  return b;
};
goog.events.listenOnce = function(a, b, c, d, e) {
  if (goog.isArray(b)) {
    for (var f = 0; f < b.length; f++) {
      goog.events.listenOnce(a, b[f], c, d, e);
    }
    return null;
  }
  c = goog.events.wrapListener(c);
  return goog.events.Listenable.isImplementedBy(a) ? (d = goog.isObject(d) ? !!d.capture : !!d, a.listenOnce(b, c, d, e)) : goog.events.listen_(a, b, c, !0, d, e);
};
goog.events.listenWithWrapper = function(a, b, c, d, e) {
  b.listen(a, c, d, e);
};
goog.events.unlisten = function(a, b, c, d, e) {
  if (goog.isArray(b)) {
    for (var f = 0; f < b.length; f++) {
      goog.events.unlisten(a, b[f], c, d, e);
    }
    return null;
  }
  d = goog.isObject(d) ? !!d.capture : !!d;
  c = goog.events.wrapListener(c);
  if (goog.events.Listenable.isImplementedBy(a)) {
    return a.unlisten(b, c, d, e);
  }
  if (!a) {
    return !1;
  }
  if (a = goog.events.getListenerMap_(a)) {
    if (b = a.getListener(b, c, d, e)) {
      return goog.events.unlistenByKey(b);
    }
  }
  return !1;
};
goog.events.unlistenByKey = function(a) {
  if (goog.isNumber(a) || !a || a.removed) {
    return !1;
  }
  var b = a.src;
  if (goog.events.Listenable.isImplementedBy(b)) {
    return b.unlistenByKey(a);
  }
  var c = a.type, d = a.proxy;
  b.removeEventListener ? b.removeEventListener(c, d, a.capture) : b.detachEvent ? b.detachEvent(goog.events.getOnString_(c), d) : b.addListener && b.removeListener && b.removeListener(d);
  goog.events.listenerCountEstimate_--;
  (c = goog.events.getListenerMap_(b)) ? (c.removeByKey(a), 0 == c.getTypeCount() && (c.src = null, b[goog.events.LISTENER_MAP_PROP_] = null)) : a.markAsRemoved();
  return !0;
};
goog.events.unlistenWithWrapper = function(a, b, c, d, e) {
  b.unlisten(a, c, d, e);
};
goog.events.removeAll = function(a, b) {
  if (!a) {
    return 0;
  }
  if (goog.events.Listenable.isImplementedBy(a)) {
    return a.removeAllListeners(b);
  }
  a = goog.events.getListenerMap_(a);
  if (!a) {
    return 0;
  }
  var c = 0;
  b = b && b.toString();
  for (var d in a.listeners) {
    if (!b || d == b) {
      for (var e = a.listeners[d].concat(), f = 0; f < e.length; ++f) {
        goog.events.unlistenByKey(e[f]) && ++c;
      }
    }
  }
  return c;
};
goog.events.getListeners = function(a, b, c) {
  return goog.events.Listenable.isImplementedBy(a) ? a.getListeners(b, c) : a ? (a = goog.events.getListenerMap_(a)) ? a.getListeners(b, c) : [] : [];
};
goog.events.getListener = function(a, b, c, d, e) {
  c = goog.events.wrapListener(c);
  d = !!d;
  return goog.events.Listenable.isImplementedBy(a) ? a.getListener(b, c, d, e) : a ? (a = goog.events.getListenerMap_(a)) ? a.getListener(b, c, d, e) : null : null;
};
goog.events.hasListener = function(a, b, c) {
  if (goog.events.Listenable.isImplementedBy(a)) {
    return a.hasListener(b, c);
  }
  a = goog.events.getListenerMap_(a);
  return !!a && a.hasListener(b, c);
};
goog.events.expose = function(a) {
  var b = [], c;
  for (c in a) {
    a[c] && a[c].id ? b.push(c + " = " + a[c] + " (" + a[c].id + ")") : b.push(c + " = " + a[c]);
  }
  return b.join("\n");
};
goog.events.getOnString_ = function(a) {
  return a in goog.events.onStringMap_ ? goog.events.onStringMap_[a] : goog.events.onStringMap_[a] = goog.events.onString_ + a;
};
goog.events.fireListeners = function(a, b, c, d) {
  return goog.events.Listenable.isImplementedBy(a) ? a.fireListeners(b, c, d) : goog.events.fireListeners_(a, b, c, d);
};
goog.events.fireListeners_ = function(a, b, c, d) {
  var e = !0;
  if (a = goog.events.getListenerMap_(a)) {
    if (b = a.listeners[b.toString()]) {
      for (b = b.concat(), a = 0; a < b.length; a++) {
        var f = b[a];
        f && f.capture == c && !f.removed && (f = goog.events.fireListener(f, d), e = e && !1 !== f);
      }
    }
  }
  return e;
};
goog.events.fireListener = function(a, b) {
  var c = a.listener, d = a.handler || a.src;
  a.callOnce && goog.events.unlistenByKey(a);
  return c.call(d, b);
};
goog.events.getTotalListenerCount = function() {
  return goog.events.listenerCountEstimate_;
};
goog.events.dispatchEvent = function(a, b) {
  goog.asserts.assert(goog.events.Listenable.isImplementedBy(a), "Can not use goog.events.dispatchEvent with non-goog.events.Listenable instance.");
  return a.dispatchEvent(b);
};
goog.events.protectBrowserEventEntryPoint = function(a) {
  goog.events.handleBrowserEvent_ = a.protectEntryPoint(goog.events.handleBrowserEvent_);
};
goog.events.handleBrowserEvent_ = function(a, b) {
  if (a.removed) {
    return !0;
  }
  if (!goog.events.BrowserFeature.HAS_W3C_EVENT_SUPPORT) {
    var c = b || goog.getObjectByName("window.event");
    b = new goog.events.BrowserEvent(c, this);
    var d = !0;
    if (goog.events.CAPTURE_SIMULATION_MODE == goog.events.CaptureSimulationMode.ON) {
      if (!goog.events.isMarkedIeEvent_(c)) {
        goog.events.markIeEvent_(c);
        c = [];
        for (var e = b.currentTarget; e; e = e.parentNode) {
          c.push(e);
        }
        a = a.type;
        for (e = c.length - 1; !b.propagationStopped_ && 0 <= e; e--) {
          b.currentTarget = c[e];
          var f = goog.events.fireListeners_(c[e], a, !0, b);
          d = d && f;
        }
        for (e = 0; !b.propagationStopped_ && e < c.length; e++) {
          b.currentTarget = c[e], f = goog.events.fireListeners_(c[e], a, !1, b), d = d && f;
        }
      }
    } else {
      d = goog.events.fireListener(a, b);
    }
    return d;
  }
  return goog.events.fireListener(a, new goog.events.BrowserEvent(b, this));
};
goog.events.markIeEvent_ = function(a) {
  var b = !1;
  if (0 == a.keyCode) {
    try {
      a.keyCode = -1;
      return;
    } catch (c) {
      b = !0;
    }
  }
  if (b || void 0 == a.returnValue) {
    a.returnValue = !0;
  }
};
goog.events.isMarkedIeEvent_ = function(a) {
  return 0 > a.keyCode || void 0 != a.returnValue;
};
goog.events.uniqueIdCounter_ = 0;
goog.events.getUniqueId = function(a) {
  return a + "_" + goog.events.uniqueIdCounter_++;
};
goog.events.getListenerMap_ = function(a) {
  a = a[goog.events.LISTENER_MAP_PROP_];
  return a instanceof goog.events.ListenerMap ? a : null;
};
goog.events.LISTENER_WRAPPER_PROP_ = "__closure_events_fn_" + (1e9 * Math.random() >>> 0);
goog.events.wrapListener = function(a) {
  goog.asserts.assert(a, "Listener can not be null.");
  if (goog.isFunction(a)) {
    return a;
  }
  goog.asserts.assert(a.handleEvent, "An object listener must have handleEvent method.");
  a[goog.events.LISTENER_WRAPPER_PROP_] || (a[goog.events.LISTENER_WRAPPER_PROP_] = function(b) {
    return a.handleEvent(b);
  });
  return a[goog.events.LISTENER_WRAPPER_PROP_];
};
goog.debug.entryPointRegistry.register(function(a) {
  goog.events.handleBrowserEvent_ = a(goog.events.handleBrowserEvent_);
});
goog.events.EventHandler = function(a) {
  goog.Disposable.call(this);
  this.handler_ = a;
  this.keys_ = {};
};
goog.inherits(goog.events.EventHandler, goog.Disposable);
goog.events.EventHandler.typeArray_ = [];
goog.events.EventHandler.prototype.listen = function(a, b, c, d) {
  return this.listen_(a, b, c, d);
};
goog.events.EventHandler.prototype.listenWithScope = function(a, b, c, d, e) {
  return this.listen_(a, b, c, d, e);
};
goog.events.EventHandler.prototype.listen_ = function(a, b, c, d, e) {
  goog.isArray(b) || (b && (goog.events.EventHandler.typeArray_[0] = b.toString()), b = goog.events.EventHandler.typeArray_);
  for (var f = 0; f < b.length; f++) {
    var g = goog.events.listen(a, b[f], c || this.handleEvent, d || !1, e || this.handler_ || this);
    if (!g) {
      break;
    }
    this.keys_[g.key] = g;
  }
  return this;
};
goog.events.EventHandler.prototype.listenOnce = function(a, b, c, d) {
  return this.listenOnce_(a, b, c, d);
};
goog.events.EventHandler.prototype.listenOnceWithScope = function(a, b, c, d, e) {
  return this.listenOnce_(a, b, c, d, e);
};
goog.events.EventHandler.prototype.listenOnce_ = function(a, b, c, d, e) {
  if (goog.isArray(b)) {
    for (var f = 0; f < b.length; f++) {
      this.listenOnce_(a, b[f], c, d, e);
    }
  } else {
    a = goog.events.listenOnce(a, b, c || this.handleEvent, d, e || this.handler_ || this);
    if (!a) {
      return this;
    }
    this.keys_[a.key] = a;
  }
  return this;
};
goog.events.EventHandler.prototype.listenWithWrapper = function(a, b, c, d) {
  return this.listenWithWrapper_(a, b, c, d);
};
goog.events.EventHandler.prototype.listenWithWrapperAndScope = function(a, b, c, d, e) {
  return this.listenWithWrapper_(a, b, c, d, e);
};
goog.events.EventHandler.prototype.listenWithWrapper_ = function(a, b, c, d, e) {
  b.listen(a, c, d, e || this.handler_ || this, this);
  return this;
};
goog.events.EventHandler.prototype.getListenerCount = function() {
  var a = 0, b;
  for (b in this.keys_) {
    Object.prototype.hasOwnProperty.call(this.keys_, b) && a++;
  }
  return a;
};
goog.events.EventHandler.prototype.unlisten = function(a, b, c, d, e) {
  if (goog.isArray(b)) {
    for (var f = 0; f < b.length; f++) {
      this.unlisten(a, b[f], c, d, e);
    }
  } else {
    if (d = goog.isObject(d) ? !!d.capture : !!d, a = goog.events.getListener(a, b, c || this.handleEvent, d, e || this.handler_ || this)) {
      goog.events.unlistenByKey(a), delete this.keys_[a.key];
    }
  }
  return this;
};
goog.events.EventHandler.prototype.unlistenWithWrapper = function(a, b, c, d, e) {
  b.unlisten(a, c, d, e || this.handler_ || this, this);
  return this;
};
goog.events.EventHandler.prototype.removeAll = function() {
  goog.object.forEach(this.keys_, function(a, b) {
    this.keys_.hasOwnProperty(b) && goog.events.unlistenByKey(a);
  }, this);
  this.keys_ = {};
};
goog.events.EventHandler.prototype.disposeInternal = function() {
  goog.events.EventHandler.superClass_.disposeInternal.call(this);
  this.removeAll();
};
goog.events.EventHandler.prototype.handleEvent = function(a) {
  throw Error("EventHandler.handleEvent not implemented");
};
goog.events.EventTarget = function() {
  goog.Disposable.call(this);
  this.eventTargetListeners_ = new goog.events.ListenerMap(this);
  this.actualEventTarget_ = this;
  this.parentEventTarget_ = null;
};
goog.inherits(goog.events.EventTarget, goog.Disposable);
goog.events.Listenable.addImplementation(goog.events.EventTarget);
goog.events.EventTarget.MAX_ANCESTORS_ = 1000;
goog.events.EventTarget.prototype.getParentEventTarget = function() {
  return this.parentEventTarget_;
};
goog.events.EventTarget.prototype.setParentEventTarget = function(a) {
  this.parentEventTarget_ = a;
};
goog.events.EventTarget.prototype.addEventListener = function(a, b, c, d) {
  goog.events.listen(this, a, b, c, d);
};
goog.events.EventTarget.prototype.removeEventListener = function(a, b, c, d) {
  goog.events.unlisten(this, a, b, c, d);
};
goog.events.EventTarget.prototype.dispatchEvent = function(a) {
  this.assertInitialized_();
  var b = this.getParentEventTarget();
  if (b) {
    var c = [];
    for (var d = 1; b; b = b.getParentEventTarget()) {
      c.push(b), goog.asserts.assert(++d < goog.events.EventTarget.MAX_ANCESTORS_, "infinite loop");
    }
  }
  return goog.events.EventTarget.dispatchEventInternal_(this.actualEventTarget_, a, c);
};
goog.events.EventTarget.prototype.disposeInternal = function() {
  goog.events.EventTarget.superClass_.disposeInternal.call(this);
  this.removeAllListeners();
  this.parentEventTarget_ = null;
};
goog.events.EventTarget.prototype.listen = function(a, b, c, d) {
  this.assertInitialized_();
  return this.eventTargetListeners_.add(String(a), b, !1, c, d);
};
goog.events.EventTarget.prototype.listenOnce = function(a, b, c, d) {
  return this.eventTargetListeners_.add(String(a), b, !0, c, d);
};
goog.events.EventTarget.prototype.unlisten = function(a, b, c, d) {
  return this.eventTargetListeners_.remove(String(a), b, c, d);
};
goog.events.EventTarget.prototype.unlistenByKey = function(a) {
  return this.eventTargetListeners_.removeByKey(a);
};
goog.events.EventTarget.prototype.removeAllListeners = function(a) {
  return this.eventTargetListeners_ ? this.eventTargetListeners_.removeAll(a) : 0;
};
goog.events.EventTarget.prototype.fireListeners = function(a, b, c) {
  a = this.eventTargetListeners_.listeners[String(a)];
  if (!a) {
    return !0;
  }
  a = a.concat();
  for (var d = !0, e = 0; e < a.length; ++e) {
    var f = a[e];
    if (f && !f.removed && f.capture == b) {
      var g = f.listener, h = f.handler || f.src;
      f.callOnce && this.unlistenByKey(f);
      d = !1 !== g.call(h, c) && d;
    }
  }
  return d && 0 != c.returnValue_;
};
goog.events.EventTarget.prototype.getListeners = function(a, b) {
  return this.eventTargetListeners_.getListeners(String(a), b);
};
goog.events.EventTarget.prototype.getListener = function(a, b, c, d) {
  return this.eventTargetListeners_.getListener(String(a), b, c, d);
};
goog.events.EventTarget.prototype.hasListener = function(a, b) {
  a = goog.isDef(a) ? String(a) : void 0;
  return this.eventTargetListeners_.hasListener(a, b);
};
goog.events.EventTarget.prototype.setTargetForTesting = function(a) {
  this.actualEventTarget_ = a;
};
goog.events.EventTarget.prototype.assertInitialized_ = function() {
  goog.asserts.assert(this.eventTargetListeners_, "Event target is not initialized. Did you call the superclass (goog.events.EventTarget) constructor?");
};
goog.events.EventTarget.dispatchEventInternal_ = function(a, b, c) {
  var d = b.type || b;
  if (goog.isString(b)) {
    b = new goog.events.Event(b, a);
  } else {
    if (b instanceof goog.events.Event) {
      b.target = b.target || a;
    } else {
      var e = b;
      b = new goog.events.Event(d, a);
      goog.object.extend(b, e);
    }
  }
  e = !0;
  if (c) {
    for (var f = c.length - 1; !b.propagationStopped_ && 0 <= f; f--) {
      var g = b.currentTarget = c[f];
      e = g.fireListeners(d, !0, b) && e;
    }
  }
  b.propagationStopped_ || (g = b.currentTarget = a, e = g.fireListeners(d, !0, b) && e, b.propagationStopped_ || (e = g.fireListeners(d, !1, b) && e));
  if (c) {
    for (f = 0; !b.propagationStopped_ && f < c.length; f++) {
      g = b.currentTarget = c[f], e = g.fireListeners(d, !1, b) && e;
    }
  }
  return e;
};
goog.dom.vendor = {};
goog.dom.vendor.getVendorJsPrefix = function() {
  return goog.userAgent.WEBKIT ? "Webkit" : goog.userAgent.GECKO ? "Moz" : goog.userAgent.IE ? "ms" : goog.userAgent.OPERA ? "O" : null;
};
goog.dom.vendor.getVendorPrefix = function() {
  return goog.userAgent.WEBKIT ? "-webkit" : goog.userAgent.GECKO ? "-moz" : goog.userAgent.IE ? "-ms" : goog.userAgent.OPERA ? "-o" : null;
};
goog.dom.vendor.getPrefixedPropertyName = function(a, b) {
  if (b && a in b) {
    return a;
  }
  var c = goog.dom.vendor.getVendorJsPrefix();
  return c ? (c = c.toLowerCase(), a = c + goog.string.toTitleCase(a), !goog.isDef(b) || a in b ? a : null) : null;
};
goog.dom.vendor.getPrefixedEventType = function(a) {
  return ((goog.dom.vendor.getVendorJsPrefix() || "") + a).toLowerCase();
};
goog.style = {};
goog.style.setStyle = function(a, b, c) {
  if (goog.isString(b)) {
    goog.style.setStyle_(a, c, b);
  } else {
    for (var d in b) {
      goog.style.setStyle_(a, b[d], d);
    }
  }
};
goog.style.setStyle_ = function(a, b, c) {
  (c = goog.style.getVendorJsStyleName_(a, c)) && (a.style[c] = b);
};
goog.style.styleNameCache_ = {};
goog.style.getVendorJsStyleName_ = function(a, b) {
  var c = goog.style.styleNameCache_[b];
  if (!c) {
    var d = goog.string.toCamelCase(b);
    c = d;
    void 0 === a.style[d] && (d = goog.dom.vendor.getVendorJsPrefix() + goog.string.toTitleCase(d), void 0 !== a.style[d] && (c = d));
    goog.style.styleNameCache_[b] = c;
  }
  return c;
};
goog.style.getVendorStyleName_ = function(a, b) {
  var c = goog.string.toCamelCase(b);
  return void 0 === a.style[c] && (c = goog.dom.vendor.getVendorJsPrefix() + goog.string.toTitleCase(c), void 0 !== a.style[c]) ? goog.dom.vendor.getVendorPrefix() + "-" + b : b;
};
goog.style.getStyle = function(a, b) {
  var c = a.style[goog.string.toCamelCase(b)];
  return "undefined" !== typeof c ? c : a.style[goog.style.getVendorJsStyleName_(a, b)] || "";
};
goog.style.getComputedStyle = function(a, b) {
  var c = goog.dom.getOwnerDocument(a);
  return c.defaultView && c.defaultView.getComputedStyle && (a = c.defaultView.getComputedStyle(a, null)) ? a[b] || a.getPropertyValue(b) || "" : "";
};
goog.style.getCascadedStyle = function(a, b) {
  return a.currentStyle ? a.currentStyle[b] : null;
};
goog.style.getStyle_ = function(a, b) {
  return goog.style.getComputedStyle(a, b) || goog.style.getCascadedStyle(a, b) || a.style && a.style[b];
};
goog.style.getComputedBoxSizing = function(a) {
  return goog.style.getStyle_(a, "boxSizing") || goog.style.getStyle_(a, "MozBoxSizing") || goog.style.getStyle_(a, "WebkitBoxSizing") || null;
};
goog.style.getComputedPosition = function(a) {
  return goog.style.getStyle_(a, "position");
};
goog.style.getBackgroundColor = function(a) {
  return goog.style.getStyle_(a, "backgroundColor");
};
goog.style.getComputedOverflowX = function(a) {
  return goog.style.getStyle_(a, "overflowX");
};
goog.style.getComputedOverflowY = function(a) {
  return goog.style.getStyle_(a, "overflowY");
};
goog.style.getComputedZIndex = function(a) {
  return goog.style.getStyle_(a, "zIndex");
};
goog.style.getComputedTextAlign = function(a) {
  return goog.style.getStyle_(a, "textAlign");
};
goog.style.getComputedCursor = function(a) {
  return goog.style.getStyle_(a, "cursor");
};
goog.style.getComputedTransform = function(a) {
  var b = goog.style.getVendorStyleName_(a, "transform");
  return goog.style.getStyle_(a, b) || goog.style.getStyle_(a, "transform");
};
goog.style.setPosition = function(a, b, c) {
  if (b instanceof goog.math.Coordinate) {
    var d = b.x;
    b = b.y;
  } else {
    d = b, b = c;
  }
  a.style.left = goog.style.getPixelStyleValue_(d, !1);
  a.style.top = goog.style.getPixelStyleValue_(b, !1);
};
goog.style.getPosition = function(a) {
  return new goog.math.Coordinate(a.offsetLeft, a.offsetTop);
};
goog.style.getClientViewportElement = function(a) {
  a = a ? goog.dom.getOwnerDocument(a) : goog.dom.getDocument();
  return !goog.userAgent.IE || goog.userAgent.isDocumentModeOrHigher(9) || goog.dom.getDomHelper(a).isCss1CompatMode() ? a.documentElement : a.body;
};
goog.style.getViewportPageOffset = function(a) {
  var b = a.body;
  a = a.documentElement;
  return new goog.math.Coordinate(b.scrollLeft || a.scrollLeft, b.scrollTop || a.scrollTop);
};
goog.style.getBoundingClientRect_ = function(a) {
  try {
    var b = a.getBoundingClientRect();
  } catch (c) {
    return {left:0, top:0, right:0, bottom:0};
  }
  goog.userAgent.IE && a.ownerDocument.body && (a = a.ownerDocument, b.left -= a.documentElement.clientLeft + a.body.clientLeft, b.top -= a.documentElement.clientTop + a.body.clientTop);
  return b;
};
goog.style.getOffsetParent = function(a) {
  if (goog.userAgent.IE && !goog.userAgent.isDocumentModeOrHigher(8)) {
    return goog.asserts.assert(a && "offsetParent" in a), a.offsetParent;
  }
  var b = goog.dom.getOwnerDocument(a), c = goog.style.getStyle_(a, "position"), d = "fixed" == c || "absolute" == c;
  for (a = a.parentNode; a && a != b; a = a.parentNode) {
    if (a.nodeType == goog.dom.NodeType.DOCUMENT_FRAGMENT && a.host && (a = a.host), c = goog.style.getStyle_(a, "position"), d = d && "static" == c && a != b.documentElement && a != b.body, !d && (a.scrollWidth > a.clientWidth || a.scrollHeight > a.clientHeight || "fixed" == c || "absolute" == c || "relative" == c)) {
      return a;
    }
  }
  return null;
};
goog.style.getVisibleRectForElement = function(a) {
  for (var b = new goog.math.Box(0, Infinity, Infinity, 0), c = goog.dom.getDomHelper(a), d = c.getDocument().body, e = c.getDocument().documentElement, f = c.getDocumentScrollElement(); a = goog.style.getOffsetParent(a);) {
    if (!(goog.userAgent.IE && 0 == a.clientWidth || goog.userAgent.WEBKIT && 0 == a.clientHeight && a == d) && a != d && a != e && "visible" != goog.style.getStyle_(a, "overflow")) {
      var g = goog.style.getPageOffset(a), h = goog.style.getClientLeftTop(a);
      g.x += h.x;
      g.y += h.y;
      b.top = Math.max(b.top, g.y);
      b.right = Math.min(b.right, g.x + a.clientWidth);
      b.bottom = Math.min(b.bottom, g.y + a.clientHeight);
      b.left = Math.max(b.left, g.x);
    }
  }
  d = f.scrollLeft;
  f = f.scrollTop;
  b.left = Math.max(b.left, d);
  b.top = Math.max(b.top, f);
  c = c.getViewportSize();
  b.right = Math.min(b.right, d + c.width);
  b.bottom = Math.min(b.bottom, f + c.height);
  return 0 <= b.top && 0 <= b.left && b.bottom > b.top && b.right > b.left ? b : null;
};
goog.style.getContainerOffsetToScrollInto = function(a, b, c) {
  var d = b || goog.dom.getDocumentScrollElement(), e = goog.style.getPageOffset(a), f = goog.style.getPageOffset(d), g = goog.style.getBorderBox(d);
  d == goog.dom.getDocumentScrollElement() ? (b = e.x - d.scrollLeft, e = e.y - d.scrollTop, goog.userAgent.IE && !goog.userAgent.isDocumentModeOrHigher(10) && (b += g.left, e += g.top)) : (b = e.x - f.x - g.left, e = e.y - f.y - g.top);
  g = goog.style.getSizeWithDisplay_(a);
  a = d.clientWidth - g.width;
  g = d.clientHeight - g.height;
  f = d.scrollLeft;
  d = d.scrollTop;
  c ? (f += b - a / 2, d += e - g / 2) : (f += Math.min(b, Math.max(b - a, 0)), d += Math.min(e, Math.max(e - g, 0)));
  return new goog.math.Coordinate(f, d);
};
goog.style.scrollIntoContainerView = function(a, b, c) {
  b = b || goog.dom.getDocumentScrollElement();
  a = goog.style.getContainerOffsetToScrollInto(a, b, c);
  b.scrollLeft = a.x;
  b.scrollTop = a.y;
};
goog.style.getClientLeftTop = function(a) {
  return new goog.math.Coordinate(a.clientLeft, a.clientTop);
};
goog.style.getPageOffset = function(a) {
  var b = goog.dom.getOwnerDocument(a);
  goog.asserts.assertObject(a, "Parameter is required");
  var c = new goog.math.Coordinate(0, 0), d = goog.style.getClientViewportElement(b);
  if (a == d) {
    return c;
  }
  a = goog.style.getBoundingClientRect_(a);
  b = goog.dom.getDomHelper(b).getDocumentScroll();
  c.x = a.left + b.x;
  c.y = a.top + b.y;
  return c;
};
goog.style.getPageOffsetLeft = function(a) {
  return goog.style.getPageOffset(a).x;
};
goog.style.getPageOffsetTop = function(a) {
  return goog.style.getPageOffset(a).y;
};
goog.style.getFramedPageOffset = function(a, b) {
  var c = new goog.math.Coordinate(0, 0), d = goog.dom.getWindow(goog.dom.getOwnerDocument(a));
  if (!goog.reflect.canAccessProperty(d, "parent")) {
    return c;
  }
  do {
    var e = d == b ? goog.style.getPageOffset(a) : goog.style.getClientPositionForElement_(goog.asserts.assert(a));
    c.x += e.x;
    c.y += e.y;
  } while (d && d != b && d != d.parent && (a = d.frameElement) && (d = d.parent));
  return c;
};
goog.style.translateRectForAnotherFrame = function(a, b, c) {
  if (b.getDocument() != c.getDocument()) {
    var d = b.getDocument().body;
    c = goog.style.getFramedPageOffset(d, c.getWindow());
    c = goog.math.Coordinate.difference(c, goog.style.getPageOffset(d));
    !goog.userAgent.IE || goog.userAgent.isDocumentModeOrHigher(9) || b.isCss1CompatMode() || (c = goog.math.Coordinate.difference(c, b.getDocumentScroll()));
    a.left += c.x;
    a.top += c.y;
  }
};
goog.style.getRelativePosition = function(a, b) {
  a = goog.style.getClientPosition(a);
  b = goog.style.getClientPosition(b);
  return new goog.math.Coordinate(a.x - b.x, a.y - b.y);
};
goog.style.getClientPositionForElement_ = function(a) {
  a = goog.style.getBoundingClientRect_(a);
  return new goog.math.Coordinate(a.left, a.top);
};
goog.style.getClientPosition = function(a) {
  goog.asserts.assert(a);
  if (a.nodeType == goog.dom.NodeType.ELEMENT) {
    return goog.style.getClientPositionForElement_(a);
  }
  a = a.changedTouches ? a.changedTouches[0] : a;
  return new goog.math.Coordinate(a.clientX, a.clientY);
};
goog.style.setPageOffset = function(a, b, c) {
  var d = goog.style.getPageOffset(a);
  b instanceof goog.math.Coordinate && (c = b.y, b = b.x);
  b = goog.asserts.assertNumber(b) - d.x;
  goog.style.setPosition(a, a.offsetLeft + b, a.offsetTop + (Number(c) - d.y));
};
goog.style.setSize = function(a, b, c) {
  if (b instanceof goog.math.Size) {
    c = b.height, b = b.width;
  } else {
    if (void 0 == c) {
      throw Error("missing height argument");
    }
  }
  goog.style.setWidth(a, b);
  goog.style.setHeight(a, c);
};
goog.style.getPixelStyleValue_ = function(a, b) {
  "number" == typeof a && (a = (b ? Math.round(a) : a) + "px");
  return a;
};
goog.style.setHeight = function(a, b) {
  a.style.height = goog.style.getPixelStyleValue_(b, !0);
};
goog.style.setWidth = function(a, b) {
  a.style.width = goog.style.getPixelStyleValue_(b, !0);
};
goog.style.getSize = function(a) {
  return goog.style.evaluateWithTemporaryDisplay_(goog.style.getSizeWithDisplay_, a);
};
goog.style.evaluateWithTemporaryDisplay_ = function(a, b) {
  if ("none" != goog.style.getStyle_(b, "display")) {
    return a(b);
  }
  var c = b.style, d = c.display, e = c.visibility, f = c.position;
  c.visibility = "hidden";
  c.position = "absolute";
  c.display = "inline";
  a = a(b);
  c.display = d;
  c.position = f;
  c.visibility = e;
  return a;
};
goog.style.getSizeWithDisplay_ = function(a) {
  var b = a.offsetWidth, c = a.offsetHeight, d = goog.userAgent.WEBKIT && !b && !c;
  return goog.isDef(b) && !d || !a.getBoundingClientRect ? new goog.math.Size(b, c) : (a = goog.style.getBoundingClientRect_(a), new goog.math.Size(a.right - a.left, a.bottom - a.top));
};
goog.style.getTransformedSize = function(a) {
  if (!a.getBoundingClientRect) {
    return null;
  }
  a = goog.style.evaluateWithTemporaryDisplay_(goog.style.getBoundingClientRect_, a);
  return new goog.math.Size(a.right - a.left, a.bottom - a.top);
};
goog.style.getBounds = function(a) {
  var b = goog.style.getPageOffset(a);
  a = goog.style.getSize(a);
  return new goog.math.Rect(b.x, b.y, a.width, a.height);
};
goog.style.toCamelCase = function(a) {
  return goog.string.toCamelCase(String(a));
};
goog.style.toSelectorCase = function(a) {
  return goog.string.toSelectorCase(a);
};
goog.style.getOpacity = function(a) {
  goog.asserts.assert(a);
  var b = a.style;
  a = "";
  "opacity" in b ? a = b.opacity : "MozOpacity" in b ? a = b.MozOpacity : "filter" in b && (b = b.filter.match(/alpha\(opacity=([\d.]+)\)/)) && (a = String(b[1] / 100));
  return "" == a ? a : Number(a);
};
goog.style.setOpacity = function(a, b) {
  goog.asserts.assert(a);
  a = a.style;
  "opacity" in a ? a.opacity = b : "MozOpacity" in a ? a.MozOpacity = b : "filter" in a && (a.filter = "" === b ? "" : "alpha(opacity=" + 100 * Number(b) + ")");
};
goog.style.setTransparentBackgroundImage = function(a, b) {
  a = a.style;
  goog.userAgent.IE && !goog.userAgent.isVersionOrHigher("8") ? a.filter = 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src="' + b + '", sizingMethod="crop")' : (a.backgroundImage = "url(" + b + ")", a.backgroundPosition = "top left", a.backgroundRepeat = "no-repeat");
};
goog.style.clearTransparentBackgroundImage = function(a) {
  a = a.style;
  "filter" in a ? a.filter = "" : a.backgroundImage = "none";
};
goog.style.showElement = function(a, b) {
  goog.style.setElementShown(a, b);
};
goog.style.setElementShown = function(a, b) {
  a.style.display = b ? "" : "none";
};
goog.style.isElementShown = function(a) {
  return "none" != a.style.display;
};
goog.style.installSafeStyleSheet = function(a, b) {
  b = goog.dom.getDomHelper(b);
  var c = b.getDocument();
  if (goog.userAgent.IE && c.createStyleSheet) {
    return b = c.createStyleSheet(), goog.style.setSafeStyleSheet(b, a), b;
  }
  c = b.getElementsByTagNameAndClass("HEAD")[0];
  if (!c) {
    var d = b.getElementsByTagNameAndClass("BODY")[0];
    c = b.createDom("HEAD");
    d.parentNode.insertBefore(c, d);
  }
  d = b.createDom("STYLE");
  goog.style.setSafeStyleSheet(d, a);
  b.appendChild(c, d);
  return d;
};
goog.style.uninstallStyles = function(a) {
  goog.dom.removeNode(a.ownerNode || a.owningElement || a);
};
goog.style.setSafeStyleSheet = function(a, b) {
  b = goog.html.SafeStyleSheet.unwrap(b);
  goog.userAgent.IE && goog.isDef(a.cssText) ? a.cssText = b : a.innerHTML = b;
};
goog.style.setPreWrap = function(a) {
  a = a.style;
  goog.userAgent.IE && !goog.userAgent.isVersionOrHigher("8") ? (a.whiteSpace = "pre", a.wordWrap = "break-word") : a.whiteSpace = goog.userAgent.GECKO ? "-moz-pre-wrap" : "pre-wrap";
};
goog.style.setInlineBlock = function(a) {
  a = a.style;
  a.position = "relative";
  goog.userAgent.IE && !goog.userAgent.isVersionOrHigher("8") ? (a.zoom = "1", a.display = "inline") : a.display = "inline-block";
};
goog.style.isRightToLeft = function(a) {
  return "rtl" == goog.style.getStyle_(a, "direction");
};
goog.style.unselectableStyle_ = goog.userAgent.GECKO ? "MozUserSelect" : goog.userAgent.WEBKIT || goog.userAgent.EDGE ? "WebkitUserSelect" : null;
goog.style.isUnselectable = function(a) {
  return goog.style.unselectableStyle_ ? "none" == a.style[goog.style.unselectableStyle_].toLowerCase() : goog.userAgent.IE || goog.userAgent.OPERA ? "on" == a.getAttribute("unselectable") : !1;
};
goog.style.setUnselectable = function(a, b, c) {
  c = c ? null : a.getElementsByTagName("*");
  var d = goog.style.unselectableStyle_;
  if (d) {
    if (b = b ? "none" : "", a.style && (a.style[d] = b), c) {
      a = 0;
      for (var e; e = c[a]; a++) {
        e.style && (e.style[d] = b);
      }
    }
  } else {
    if (goog.userAgent.IE || goog.userAgent.OPERA) {
      if (b = b ? "on" : "", a.setAttribute("unselectable", b), c) {
        for (a = 0; e = c[a]; a++) {
          e.setAttribute("unselectable", b);
        }
      }
    }
  }
};
goog.style.getBorderBoxSize = function(a) {
  return new goog.math.Size(a.offsetWidth, a.offsetHeight);
};
goog.style.setBorderBoxSize = function(a, b) {
  var c = goog.dom.getOwnerDocument(a), d = goog.dom.getDomHelper(c).isCss1CompatMode();
  !goog.userAgent.IE || goog.userAgent.isVersionOrHigher("10") || d && goog.userAgent.isVersionOrHigher("8") ? goog.style.setBoxSizingSize_(a, b, "border-box") : (c = a.style, d ? (d = goog.style.getPaddingBox(a), a = goog.style.getBorderBox(a), c.pixelWidth = b.width - a.left - d.left - d.right - a.right, c.pixelHeight = b.height - a.top - d.top - d.bottom - a.bottom) : (c.pixelWidth = b.width, c.pixelHeight = b.height));
};
goog.style.getContentBoxSize = function(a) {
  var b = goog.dom.getOwnerDocument(a), c = goog.userAgent.IE && a.currentStyle;
  if (c && goog.dom.getDomHelper(b).isCss1CompatMode() && "auto" != c.width && "auto" != c.height && !c.boxSizing) {
    return b = goog.style.getIePixelValue_(a, c.width, "width", "pixelWidth"), a = goog.style.getIePixelValue_(a, c.height, "height", "pixelHeight"), new goog.math.Size(b, a);
  }
  c = goog.style.getBorderBoxSize(a);
  b = goog.style.getPaddingBox(a);
  a = goog.style.getBorderBox(a);
  return new goog.math.Size(c.width - a.left - b.left - b.right - a.right, c.height - a.top - b.top - b.bottom - a.bottom);
};
goog.style.setContentBoxSize = function(a, b) {
  var c = goog.dom.getOwnerDocument(a), d = goog.dom.getDomHelper(c).isCss1CompatMode();
  !goog.userAgent.IE || goog.userAgent.isVersionOrHigher("10") || d && goog.userAgent.isVersionOrHigher("8") ? goog.style.setBoxSizingSize_(a, b, "content-box") : (c = a.style, d ? (c.pixelWidth = b.width, c.pixelHeight = b.height) : (d = goog.style.getPaddingBox(a), a = goog.style.getBorderBox(a), c.pixelWidth = b.width + a.left + d.left + d.right + a.right, c.pixelHeight = b.height + a.top + d.top + d.bottom + a.bottom));
};
goog.style.setBoxSizingSize_ = function(a, b, c) {
  a = a.style;
  goog.userAgent.GECKO ? a.MozBoxSizing = c : goog.userAgent.WEBKIT ? a.WebkitBoxSizing = c : a.boxSizing = c;
  a.width = Math.max(b.width, 0) + "px";
  a.height = Math.max(b.height, 0) + "px";
};
goog.style.getIePixelValue_ = function(a, b, c, d) {
  if (/^\d+px?$/.test(b)) {
    return parseInt(b, 10);
  }
  var e = a.style[c], f = a.runtimeStyle[c];
  a.runtimeStyle[c] = a.currentStyle[c];
  a.style[c] = b;
  b = a.style[d];
  a.style[c] = e;
  a.runtimeStyle[c] = f;
  return +b;
};
goog.style.getIePixelDistance_ = function(a, b) {
  return (b = goog.style.getCascadedStyle(a, b)) ? goog.style.getIePixelValue_(a, b, "left", "pixelLeft") : 0;
};
goog.style.getBox_ = function(a, b) {
  if (goog.userAgent.IE) {
    var c = goog.style.getIePixelDistance_(a, b + "Left"), d = goog.style.getIePixelDistance_(a, b + "Right"), e = goog.style.getIePixelDistance_(a, b + "Top");
    a = goog.style.getIePixelDistance_(a, b + "Bottom");
    return new goog.math.Box(e, d, a, c);
  }
  c = goog.style.getComputedStyle(a, b + "Left");
  d = goog.style.getComputedStyle(a, b + "Right");
  e = goog.style.getComputedStyle(a, b + "Top");
  a = goog.style.getComputedStyle(a, b + "Bottom");
  return new goog.math.Box(parseFloat(e), parseFloat(d), parseFloat(a), parseFloat(c));
};
goog.style.getPaddingBox = function(a) {
  return goog.style.getBox_(a, "padding");
};
goog.style.getMarginBox = function(a) {
  return goog.style.getBox_(a, "margin");
};
goog.style.ieBorderWidthKeywords_ = {thin:2, medium:4, thick:6};
goog.style.getIePixelBorder_ = function(a, b) {
  if ("none" == goog.style.getCascadedStyle(a, b + "Style")) {
    return 0;
  }
  b = goog.style.getCascadedStyle(a, b + "Width");
  return b in goog.style.ieBorderWidthKeywords_ ? goog.style.ieBorderWidthKeywords_[b] : goog.style.getIePixelValue_(a, b, "left", "pixelLeft");
};
goog.style.getBorderBox = function(a) {
  if (goog.userAgent.IE && !goog.userAgent.isDocumentModeOrHigher(9)) {
    var b = goog.style.getIePixelBorder_(a, "borderLeft"), c = goog.style.getIePixelBorder_(a, "borderRight"), d = goog.style.getIePixelBorder_(a, "borderTop");
    a = goog.style.getIePixelBorder_(a, "borderBottom");
    return new goog.math.Box(d, c, a, b);
  }
  b = goog.style.getComputedStyle(a, "borderLeftWidth");
  c = goog.style.getComputedStyle(a, "borderRightWidth");
  d = goog.style.getComputedStyle(a, "borderTopWidth");
  a = goog.style.getComputedStyle(a, "borderBottomWidth");
  return new goog.math.Box(parseFloat(d), parseFloat(c), parseFloat(a), parseFloat(b));
};
goog.style.getFontFamily = function(a) {
  var b = goog.dom.getOwnerDocument(a), c = "";
  if (b.body.createTextRange && goog.dom.contains(b, a)) {
    b = b.body.createTextRange();
    b.moveToElementText(a);
    try {
      c = b.queryCommandValue("FontName");
    } catch (d) {
      c = "";
    }
  }
  c || (c = goog.style.getStyle_(a, "fontFamily"));
  a = c.split(",");
  1 < a.length && (c = a[0]);
  return goog.string.stripQuotes(c, "\"'");
};
goog.style.lengthUnitRegex_ = /[^\d]+$/;
goog.style.getLengthUnits = function(a) {
  return (a = a.match(goog.style.lengthUnitRegex_)) && a[0] || null;
};
goog.style.ABSOLUTE_CSS_LENGTH_UNITS_ = {cm:1, "in":1, mm:1, pc:1, pt:1};
goog.style.CONVERTIBLE_RELATIVE_CSS_UNITS_ = {em:1, ex:1};
goog.style.getFontSize = function(a) {
  var b = goog.style.getStyle_(a, "fontSize"), c = goog.style.getLengthUnits(b);
  if (b && "px" == c) {
    return parseInt(b, 10);
  }
  if (goog.userAgent.IE) {
    if (String(c) in goog.style.ABSOLUTE_CSS_LENGTH_UNITS_) {
      return goog.style.getIePixelValue_(a, b, "left", "pixelLeft");
    }
    if (a.parentNode && a.parentNode.nodeType == goog.dom.NodeType.ELEMENT && String(c) in goog.style.CONVERTIBLE_RELATIVE_CSS_UNITS_) {
      return a = a.parentNode, c = goog.style.getStyle_(a, "fontSize"), goog.style.getIePixelValue_(a, b == c ? "1em" : b, "left", "pixelLeft");
    }
  }
  c = goog.dom.createDom("SPAN", {style:"visibility:hidden;position:absolute;line-height:0;padding:0;margin:0;border:0;height:1em;"});
  goog.dom.appendChild(a, c);
  b = c.offsetHeight;
  goog.dom.removeNode(c);
  return b;
};
goog.style.parseStyleAttribute = function(a) {
  var b = {};
  goog.array.forEach(a.split(/\s*;\s*/), function(a) {
    var c = a.match(/\s*([\w-]+)\s*:(.+)/);
    c && (a = c[1], c = goog.string.trim(c[2]), b[goog.string.toCamelCase(a.toLowerCase())] = c);
  });
  return b;
};
goog.style.toStyleAttribute = function(a) {
  var b = [];
  goog.object.forEach(a, function(a, d) {
    b.push(goog.string.toSelectorCase(d), ":", a, ";");
  });
  return b.join("");
};
goog.style.setFloat = function(a, b) {
  a.style[goog.userAgent.IE ? "styleFloat" : "cssFloat"] = b;
};
goog.style.getFloat = function(a) {
  return a.style[goog.userAgent.IE ? "styleFloat" : "cssFloat"] || "";
};
goog.style.getScrollbarWidth = function(a) {
  var b = goog.dom.createElement("DIV");
  a && (b.className = a);
  b.style.cssText = "overflow:auto;position:absolute;top:0;width:100px;height:100px";
  a = goog.dom.createElement("DIV");
  goog.style.setSize(a, "200px", "200px");
  b.appendChild(a);
  goog.dom.appendChild(goog.dom.getDocument().body, b);
  a = b.offsetWidth - b.clientWidth;
  goog.dom.removeNode(b);
  return a;
};
goog.style.MATRIX_TRANSLATION_REGEX_ = /matrix\([0-9\.\-]+, [0-9\.\-]+, [0-9\.\-]+, [0-9\.\-]+, ([0-9\.\-]+)p?x?, ([0-9\.\-]+)p?x?\)/;
goog.style.getCssTranslation = function(a) {
  a = goog.style.getComputedTransform(a);
  return a ? (a = a.match(goog.style.MATRIX_TRANSLATION_REGEX_)) ? new goog.math.Coordinate(parseFloat(a[1]), parseFloat(a[2])) : new goog.math.Coordinate(0, 0) : new goog.math.Coordinate(0, 0);
};
goog.userAgent.platform = {};
goog.userAgent.platform.determineVersion_ = function() {
  if (goog.userAgent.WINDOWS) {
    var a = /Windows NT ([0-9.]+)/;
    return (a = a.exec(goog.userAgent.getUserAgentString())) ? a[1] : "0";
  }
  return goog.userAgent.MAC ? (a = /10[_.][0-9_.]+/, (a = a.exec(goog.userAgent.getUserAgentString())) ? a[0].replace(/_/g, ".") : "10") : goog.userAgent.ANDROID ? (a = /Android\s+([^\);]+)(\)|;)/, (a = a.exec(goog.userAgent.getUserAgentString())) ? a[1] : "") : goog.userAgent.IPHONE || goog.userAgent.IPAD || goog.userAgent.IPOD ? (a = /(?:iPhone|CPU)\s+OS\s+(\S+)/, (a = a.exec(goog.userAgent.getUserAgentString())) ? a[1].replace(/_/g, ".") : "") : "";
};
goog.userAgent.platform.VERSION = goog.userAgent.platform.determineVersion_();
goog.userAgent.platform.isVersion = function(a) {
  return 0 <= goog.string.compareVersions(goog.userAgent.platform.VERSION, a);
};
goog.userAgent.product = {};
goog.userAgent.product.ASSUME_FIREFOX = !1;
goog.userAgent.product.ASSUME_IPHONE = !1;
goog.userAgent.product.ASSUME_IPAD = !1;
goog.userAgent.product.ASSUME_ANDROID = !1;
goog.userAgent.product.ASSUME_CHROME = !1;
goog.userAgent.product.ASSUME_SAFARI = !1;
goog.userAgent.product.PRODUCT_KNOWN_ = goog.userAgent.ASSUME_IE || goog.userAgent.ASSUME_EDGE || goog.userAgent.ASSUME_OPERA || goog.userAgent.product.ASSUME_FIREFOX || goog.userAgent.product.ASSUME_IPHONE || goog.userAgent.product.ASSUME_IPAD || goog.userAgent.product.ASSUME_ANDROID || goog.userAgent.product.ASSUME_CHROME || goog.userAgent.product.ASSUME_SAFARI;
goog.userAgent.product.OPERA = goog.userAgent.OPERA;
goog.userAgent.product.IE = goog.userAgent.IE;
goog.userAgent.product.EDGE = goog.userAgent.EDGE;
goog.userAgent.product.FIREFOX = goog.userAgent.product.PRODUCT_KNOWN_ ? goog.userAgent.product.ASSUME_FIREFOX : goog.labs.userAgent.browser.isFirefox();
goog.userAgent.product.isIphoneOrIpod_ = function() {
  return goog.labs.userAgent.platform.isIphone() || goog.labs.userAgent.platform.isIpod();
};
goog.userAgent.product.IPHONE = goog.userAgent.product.PRODUCT_KNOWN_ ? goog.userAgent.product.ASSUME_IPHONE : goog.userAgent.product.isIphoneOrIpod_();
goog.userAgent.product.IPAD = goog.userAgent.product.PRODUCT_KNOWN_ ? goog.userAgent.product.ASSUME_IPAD : goog.labs.userAgent.platform.isIpad();
goog.userAgent.product.ANDROID = goog.userAgent.product.PRODUCT_KNOWN_ ? goog.userAgent.product.ASSUME_ANDROID : goog.labs.userAgent.browser.isAndroidBrowser();
goog.userAgent.product.CHROME = goog.userAgent.product.PRODUCT_KNOWN_ ? goog.userAgent.product.ASSUME_CHROME : goog.labs.userAgent.browser.isChrome();
goog.userAgent.product.isSafariDesktop_ = function() {
  return goog.labs.userAgent.browser.isSafari() && !goog.labs.userAgent.platform.isIos();
};
goog.userAgent.product.SAFARI = goog.userAgent.product.PRODUCT_KNOWN_ ? goog.userAgent.product.ASSUME_SAFARI : goog.userAgent.product.isSafariDesktop_();
goog.userAgent.product.determineVersion_ = function() {
  if (goog.userAgent.product.FIREFOX) {
    return goog.userAgent.product.getFirstRegExpGroup_(/Firefox\/([0-9.]+)/);
  }
  if (goog.userAgent.product.IE || goog.userAgent.product.EDGE || goog.userAgent.product.OPERA) {
    return goog.userAgent.VERSION;
  }
  if (goog.userAgent.product.CHROME) {
    return goog.labs.userAgent.platform.isIos() ? goog.userAgent.product.getFirstRegExpGroup_(/CriOS\/([0-9.]+)/) : goog.userAgent.product.getFirstRegExpGroup_(/Chrome\/([0-9.]+)/);
  }
  if (goog.userAgent.product.SAFARI && !goog.labs.userAgent.platform.isIos()) {
    return goog.userAgent.product.getFirstRegExpGroup_(/Version\/([0-9.]+)/);
  }
  if (goog.userAgent.product.IPHONE || goog.userAgent.product.IPAD) {
    var a = goog.userAgent.product.execRegExp_(/Version\/(\S+).*Mobile\/(\S+)/);
    if (a) {
      return a[1] + "." + a[2];
    }
  } else {
    if (goog.userAgent.product.ANDROID) {
      return (a = goog.userAgent.product.getFirstRegExpGroup_(/Android\s+([0-9.]+)/)) ? a : goog.userAgent.product.getFirstRegExpGroup_(/Version\/([0-9.]+)/);
    }
  }
  return "";
};
goog.userAgent.product.getFirstRegExpGroup_ = function(a) {
  return (a = goog.userAgent.product.execRegExp_(a)) ? a[1] : "";
};
goog.userAgent.product.execRegExp_ = function(a) {
  return a.exec(goog.userAgent.getUserAgentString());
};
goog.userAgent.product.VERSION = goog.userAgent.product.determineVersion_();
goog.userAgent.product.isVersion = function(a) {
  return 0 <= goog.string.compareVersions(goog.userAgent.product.VERSION, a);
};
goog.style.bidi = {};
goog.style.bidi.getScrollLeft = function(a) {
  var b = goog.style.isRightToLeft(a);
  return b && goog.style.bidi.usesNegativeScrollLeftInRtl_() ? -a.scrollLeft : !b || goog.userAgent.EDGE_OR_IE && goog.userAgent.isVersionOrHigher("8") || "visible" == goog.style.getComputedOverflowX(a) ? a.scrollLeft : a.scrollWidth - a.clientWidth - a.scrollLeft;
};
goog.style.bidi.getOffsetStart = function(a) {
  var b = a.offsetLeft, c = a.offsetParent;
  c || "fixed" != goog.style.getComputedPosition(a) || (c = goog.dom.getOwnerDocument(a).documentElement);
  if (!c) {
    return b;
  }
  if (goog.userAgent.GECKO && !goog.userAgent.isVersionOrHigher(58)) {
    var d = goog.style.getBorderBox(c);
    b += d.left;
  } else {
    goog.userAgent.isDocumentModeOrHigher(8) && !goog.userAgent.isDocumentModeOrHigher(9) && (d = goog.style.getBorderBox(c), b -= d.left);
  }
  return goog.style.isRightToLeft(c) ? c.clientWidth - (b + a.offsetWidth) : b;
};
goog.style.bidi.setScrollOffset = function(a, b) {
  b = Math.max(b, 0);
  goog.style.isRightToLeft(a) ? goog.style.bidi.usesNegativeScrollLeftInRtl_() ? a.scrollLeft = -b : goog.userAgent.EDGE_OR_IE && goog.userAgent.isVersionOrHigher("8") ? a.scrollLeft = b : a.scrollLeft = a.scrollWidth - b - a.clientWidth : a.scrollLeft = b;
};
goog.style.bidi.usesNegativeScrollLeftInRtl_ = function() {
  var a = goog.userAgent.product.SAFARI && goog.userAgent.product.isVersion(10), b = goog.userAgent.IOS && goog.userAgent.platform.isVersion(10);
  return goog.userAgent.GECKO || a || b;
};
goog.style.bidi.setPosition = function(a, b, c, d) {
  goog.isNull(c) || (a.style.top = c + "px");
  d ? (a.style.right = b + "px", a.style.left = "") : (a.style.left = b + "px", a.style.right = "");
};
goog.fx = {};
goog.fx.Dragger = function(a, b, c) {
  goog.events.EventTarget.call(this);
  this.target = a;
  this.handle = b || a;
  this.limits = c || new goog.math.Rect(NaN, NaN, NaN, NaN);
  this.document_ = goog.dom.getOwnerDocument(a);
  this.eventHandler_ = new goog.events.EventHandler(this);
  this.registerDisposable(this.eventHandler_);
  this.deltaY = this.deltaX = this.startY = this.startX = this.screenY = this.screenX = this.clientY = this.clientX = 0;
  this.enabled_ = !0;
  this.dragging_ = !1;
  this.preventMouseDown_ = !0;
  this.hysteresisDistanceSquared_ = 0;
  this.useRightPositioningForRtl_ = this.ieDragStartCancellingOn_ = !1;
  goog.events.listen(this.handle, [goog.events.EventType.TOUCHSTART, goog.events.EventType.MOUSEDOWN], this.startDrag, !1, this);
  this.useSetCapture_ = goog.fx.Dragger.HAS_SET_CAPTURE_;
};
goog.inherits(goog.fx.Dragger, goog.events.EventTarget);
goog.tagUnsealableClass(goog.fx.Dragger);
goog.fx.Dragger.HAS_SET_CAPTURE_ = goog.global.document && goog.global.document.documentElement && !!goog.global.document.documentElement.setCapture && !!goog.global.document.releaseCapture;
goog.fx.Dragger.cloneNode = function(a) {
  for (var b = a.cloneNode(!0), c = goog.dom.getElementsByTagName("TEXTAREA", a), d = goog.dom.getElementsByTagName("TEXTAREA", b), e = 0; e < c.length; e++) {
    d[e].value = c[e].value;
  }
  switch(a.tagName) {
    case "TR":
      return goog.dom.createDom("TABLE", null, goog.dom.createDom("TBODY", null, b));
    case "TD":
    case "TH":
      return goog.dom.createDom("TABLE", null, goog.dom.createDom("TBODY", null, goog.dom.createDom("TR", null, b)));
    case "TEXTAREA":
      b.value = a.value;
    default:
      return b;
  }
};
goog.fx.Dragger.EventType = {EARLY_CANCEL:"earlycancel", START:"start", BEFOREDRAG:"beforedrag", DRAG:"drag", END:"end"};
goog.fx.Dragger.prototype.setAllowSetCapture = function(a) {
  this.useSetCapture_ = a && goog.fx.Dragger.HAS_SET_CAPTURE_;
};
goog.fx.Dragger.prototype.enableRightPositioningForRtl = function(a) {
  this.useRightPositioningForRtl_ = a;
};
goog.fx.Dragger.prototype.getHandler = function() {
  return this.eventHandler_;
};
goog.fx.Dragger.prototype.setLimits = function(a) {
  this.limits = a || new goog.math.Rect(NaN, NaN, NaN, NaN);
};
goog.fx.Dragger.prototype.setHysteresis = function(a) {
  this.hysteresisDistanceSquared_ = Math.pow(a, 2);
};
goog.fx.Dragger.prototype.getHysteresis = function() {
  return Math.sqrt(this.hysteresisDistanceSquared_);
};
goog.fx.Dragger.prototype.setScrollTarget = function(a) {
  this.scrollTarget_ = a;
};
goog.fx.Dragger.prototype.setCancelIeDragStart = function(a) {
  this.ieDragStartCancellingOn_ = a;
};
goog.fx.Dragger.prototype.getEnabled = function() {
  return this.enabled_;
};
goog.fx.Dragger.prototype.setEnabled = function(a) {
  this.enabled_ = a;
};
goog.fx.Dragger.prototype.setPreventMouseDown = function(a) {
  this.preventMouseDown_ = a;
};
goog.fx.Dragger.prototype.disposeInternal = function() {
  goog.fx.Dragger.superClass_.disposeInternal.call(this);
  goog.events.unlisten(this.handle, [goog.events.EventType.TOUCHSTART, goog.events.EventType.MOUSEDOWN], this.startDrag, !1, this);
  this.cleanUpAfterDragging_();
  this.handle = this.target = null;
};
goog.fx.Dragger.prototype.isRightToLeft_ = function() {
  goog.isDef(this.rightToLeft_) || (this.rightToLeft_ = goog.style.isRightToLeft(this.target));
  return this.rightToLeft_;
};
goog.fx.Dragger.prototype.startDrag = function(a) {
  var b = a.type == goog.events.EventType.MOUSEDOWN;
  if (!this.enabled_ || this.dragging_ || b && !a.isMouseActionButton()) {
    this.dispatchEvent(goog.fx.Dragger.EventType.EARLY_CANCEL);
  } else {
    if (0 == this.hysteresisDistanceSquared_) {
      if (this.fireDragStart_(a)) {
        this.dragging_ = !0, this.preventMouseDown_ && b && a.preventDefault();
      } else {
        return;
      }
    } else {
      this.preventMouseDown_ && b && a.preventDefault();
    }
    this.setupDragHandlers();
    this.clientX = this.startX = a.clientX;
    this.clientY = this.startY = a.clientY;
    this.screenX = a.screenX;
    this.screenY = a.screenY;
    this.computeInitialPosition();
    this.pageScroll = goog.dom.getDomHelper(this.document_).getDocumentScroll();
  }
};
goog.fx.Dragger.prototype.setupDragHandlers = function() {
  var a = this.document_, b = a.documentElement, c = !this.useSetCapture_;
  this.eventHandler_.listen(a, [goog.events.EventType.TOUCHMOVE, goog.events.EventType.MOUSEMOVE], this.handleMove_, {capture:c, passive:!1});
  this.eventHandler_.listen(a, [goog.events.EventType.TOUCHEND, goog.events.EventType.MOUSEUP], this.endDrag, c);
  this.useSetCapture_ ? (b.setCapture(!1), this.eventHandler_.listen(b, goog.events.EventType.LOSECAPTURE, this.endDrag)) : this.eventHandler_.listen(goog.dom.getWindow(a), goog.events.EventType.BLUR, this.endDrag);
  goog.userAgent.IE && this.ieDragStartCancellingOn_ && this.eventHandler_.listen(a, goog.events.EventType.DRAGSTART, goog.events.Event.preventDefault);
  this.scrollTarget_ && this.eventHandler_.listen(this.scrollTarget_, goog.events.EventType.SCROLL, this.onScroll_, c);
};
goog.fx.Dragger.prototype.fireDragStart_ = function(a) {
  return this.dispatchEvent(new goog.fx.DragEvent(goog.fx.Dragger.EventType.START, this, a.clientX, a.clientY, a));
};
goog.fx.Dragger.prototype.cleanUpAfterDragging_ = function() {
  this.eventHandler_.removeAll();
  this.useSetCapture_ && this.document_.releaseCapture();
};
goog.fx.Dragger.prototype.endDrag = function(a, b) {
  this.cleanUpAfterDragging_();
  if (this.dragging_) {
    this.dragging_ = !1;
    var c = this.limitX(this.deltaX), d = this.limitY(this.deltaY);
    this.dispatchEvent(new goog.fx.DragEvent(goog.fx.Dragger.EventType.END, this, a.clientX, a.clientY, a, c, d, b || a.type == goog.events.EventType.TOUCHCANCEL));
  } else {
    this.dispatchEvent(goog.fx.Dragger.EventType.EARLY_CANCEL);
  }
};
goog.fx.Dragger.prototype.endDragCancel = function(a) {
  this.endDrag(a, !0);
};
goog.fx.Dragger.prototype.handleMove_ = function(a) {
  if (this.enabled_) {
    var b = (this.useRightPositioningForRtl_ && this.isRightToLeft_() ? -1 : 1) * (a.clientX - this.clientX), c = a.clientY - this.clientY;
    this.clientX = a.clientX;
    this.clientY = a.clientY;
    this.screenX = a.screenX;
    this.screenY = a.screenY;
    if (!this.dragging_) {
      var d = this.startX - this.clientX, e = this.startY - this.clientY;
      if (d * d + e * e > this.hysteresisDistanceSquared_) {
        if (this.fireDragStart_(a)) {
          this.dragging_ = !0;
        } else {
          this.isDisposed() || this.endDrag(a);
          return;
        }
      }
    }
    c = this.calculatePosition_(b, c);
    b = c.x;
    c = c.y;
    this.dragging_ && this.dispatchEvent(new goog.fx.DragEvent(goog.fx.Dragger.EventType.BEFOREDRAG, this, a.clientX, a.clientY, a, b, c)) && (this.doDrag(a, b, c, !1), a.preventDefault());
  }
};
goog.fx.Dragger.prototype.calculatePosition_ = function(a, b) {
  var c = goog.dom.getDomHelper(this.document_).getDocumentScroll();
  a += c.x - this.pageScroll.x;
  b += c.y - this.pageScroll.y;
  this.pageScroll = c;
  this.deltaX += a;
  this.deltaY += b;
  a = this.limitX(this.deltaX);
  b = this.limitY(this.deltaY);
  return new goog.math.Coordinate(a, b);
};
goog.fx.Dragger.prototype.onScroll_ = function(a) {
  var b = this.calculatePosition_(0, 0);
  a.clientX = this.clientX;
  a.clientY = this.clientY;
  this.doDrag(a, b.x, b.y, !0);
};
goog.fx.Dragger.prototype.doDrag = function(a, b, c, d) {
  this.defaultAction(b, c);
  this.dispatchEvent(new goog.fx.DragEvent(goog.fx.Dragger.EventType.DRAG, this, a.clientX, a.clientY, a, b, c));
};
goog.fx.Dragger.prototype.limitX = function(a) {
  var b = this.limits, c = isNaN(b.left) ? null : b.left;
  b = isNaN(b.width) ? 0 : b.width;
  return Math.min(null != c ? c + b : Infinity, Math.max(null != c ? c : -Infinity, a));
};
goog.fx.Dragger.prototype.limitY = function(a) {
  var b = this.limits, c = isNaN(b.top) ? null : b.top;
  b = isNaN(b.height) ? 0 : b.height;
  return Math.min(null != c ? c + b : Infinity, Math.max(null != c ? c : -Infinity, a));
};
goog.fx.Dragger.prototype.computeInitialPosition = function() {
  this.deltaX = this.useRightPositioningForRtl_ ? goog.style.bidi.getOffsetStart(this.target) : this.target.offsetLeft;
  this.deltaY = this.target.offsetTop;
};
goog.fx.Dragger.prototype.defaultAction = function(a, b) {
  this.useRightPositioningForRtl_ && this.isRightToLeft_() ? this.target.style.right = a + "px" : this.target.style.left = a + "px";
  this.target.style.top = b + "px";
};
goog.fx.Dragger.prototype.isDragging = function() {
  return this.dragging_;
};
goog.fx.DragEvent = function(a, b, c, d, e, f, g, h) {
  goog.events.Event.call(this, a);
  this.clientX = c;
  this.clientY = d;
  this.browserEvent = e;
  this.left = goog.isDef(f) ? f : b.deltaX;
  this.top = goog.isDef(g) ? g : b.deltaY;
  this.dragger = b;
  this.dragCanceled = !!h;
};
goog.inherits(goog.fx.DragEvent, goog.events.Event);
var annotorious = {dom:{}};
annotorious.dom.getOffset = function(a) {
  for (var b = 0, c = 0; a && !isNaN(a.offsetLeft) && !isNaN(a.offsetTop);) {
    b += a.offsetLeft - a.scrollLeft, c += a.offsetTop - a.scrollTop, a = a.offsetParent;
  }
  return {top:c, left:b};
};
annotorious.dom.isInViewport = function(a) {
  for (var b = a.offsetTop, c = a.offsetLeft, d = a.offsetWidth, e = a.offsetHeight; a.offsetParent;) {
    a = a.offsetParent, b += a.offsetTop, c += a.offsetLeft;
  }
  return b < window.pageYOffset + window.innerHeight && c < window.pageXOffset + window.innerWidth && b + e > window.pageYOffset && c + d > window.pageXOffset;
};
annotorious.dom.addOnLoadHandler = function(a) {
  window.addEventListener ? window.addEventListener("load", a, !1) : window.attachEvent && window.attachEvent("onload", a);
};
annotorious.dom.makeHResizable = function(a, b) {
  var c = goog.dom.createElement("div");
  goog.style.setStyle(c, "position", "absolute");
  goog.style.setStyle(c, "top", "0px");
  goog.style.setStyle(c, "right", "0px");
  goog.style.setStyle(c, "width", "5px");
  goog.style.setStyle(c, "height", "100%");
  goog.style.setStyle(c, "cursor", "e-resize");
  goog.dom.appendChild(a, c);
  var d = goog.style.getBorderBox(a);
  d = goog.style.getBounds(a).width - d.right - d.left;
  c = new goog.fx.Dragger(c);
  c.setLimits(new goog.math.Rect(d, 0, 800, 0));
  c.defaultAction = function(c) {
    goog.style.setStyle(a, "width", c + "px");
    b && b();
  };
};
annotorious.dom.toAbsoluteURL = function(a) {
  if (0 < a.indexOf("://")) {
    return a;
  }
  var b = document.createElement("a");
  b.href = a;
  return b.protocol + "//" + b.host + b.pathname;
};
annotorious.events = {};
annotorious.events.EventBroker = function() {
  this._handlers = [];
};
annotorious.events.EventBroker.prototype.addHandler = function(a, b) {
  this._handlers[a] || (this._handlers[a] = []);
  this._handlers[a].push(b);
};
annotorious.events.EventBroker.prototype.removeHandler = function(a, b) {
  (a = this._handlers[a]) && goog.array.remove(a, b);
};
annotorious.events.EventBroker.prototype.fireEvent = function(a, b, c) {
  var d = !1;
  (a = this._handlers[a]) && goog.array.forEach(a, function(a, f, g) {
    a = a(b, c);
    goog.isDef(a) && !a && (d = !0);
  });
  return d;
};
annotorious.events.EventType = {MOUSE_OVER_ANNOTATABLE_ITEM:"onMouseOverItem", MOUSE_OUT_OF_ANNOTATABLE_ITEM:"onMouseOutOfItem", MOUSE_OVER_ANNOTATION:"onMouseOverAnnotation", MOUSE_OUT_OF_ANNOTATION:"onMouseOutOfAnnotation", SELECTION_STARTED:"onSelectionStarted", SELECTION_CANCELED:"onSelectionCanceled", SELECTION_COMPLETED:"onSelectionCompleted", SELECTION_CHANGED:"onSelectionChanged", BEFORE_EDITOR_SHOWN:"beforeEditorShown", EDITOR_SHOWN:"onEditorShown", POPUP_SHOWN:"onPopupShown", BEFORE_POPUP_HIDE:"beforePopupHide", 
BEFORE_ANNOTATION_REMOVED:"beforeAnnotationRemoved", ANNOTATION_REMOVED:"onAnnotationRemoved", ANNOTATION_CREATED:"onAnnotationCreated", ANNOTATION_UPDATED:"onAnnotationUpdated", ANNOTATION_CLICKED:"onAnnotationClicked"};
goog.functions = {};
goog.functions.constant = function(a) {
  return function() {
    return a;
  };
};
goog.functions.FALSE = goog.functions.constant(!1);
goog.functions.TRUE = goog.functions.constant(!0);
goog.functions.NULL = goog.functions.constant(null);
goog.functions.identity = function(a, b) {
  return a;
};
goog.functions.error = function(a) {
  return function() {
    throw Error(a);
  };
};
goog.functions.fail = function(a) {
  return function() {
    throw a;
  };
};
goog.functions.lock = function(a, b) {
  b = b || 0;
  return function() {
    return a.apply(this, Array.prototype.slice.call(arguments, 0, b));
  };
};
goog.functions.nth = function(a) {
  return function() {
    return arguments[a];
  };
};
goog.functions.partialRight = function(a, b) {
  var c = Array.prototype.slice.call(arguments, 1);
  return function() {
    var b = Array.prototype.slice.call(arguments);
    b.push.apply(b, c);
    return a.apply(this, b);
  };
};
goog.functions.withReturnValue = function(a, b) {
  return goog.functions.sequence(a, goog.functions.constant(b));
};
goog.functions.equalTo = function(a, b) {
  return function(c) {
    return b ? a == c : a === c;
  };
};
goog.functions.compose = function(a, b) {
  var c = arguments, d = c.length;
  return function() {
    var a;
    d && (a = c[d - 1].apply(this, arguments));
    for (var b = d - 2; 0 <= b; b--) {
      a = c[b].call(this, a);
    }
    return a;
  };
};
goog.functions.sequence = function(a) {
  var b = arguments, c = b.length;
  return function() {
    for (var a, e = 0; e < c; e++) {
      a = b[e].apply(this, arguments);
    }
    return a;
  };
};
goog.functions.and = function(a) {
  var b = arguments, c = b.length;
  return function() {
    for (var a = 0; a < c; a++) {
      if (!b[a].apply(this, arguments)) {
        return !1;
      }
    }
    return !0;
  };
};
goog.functions.or = function(a) {
  var b = arguments, c = b.length;
  return function() {
    for (var a = 0; a < c; a++) {
      if (b[a].apply(this, arguments)) {
        return !0;
      }
    }
    return !1;
  };
};
goog.functions.not = function(a) {
  return function() {
    return !a.apply(this, arguments);
  };
};
goog.functions.create = function(a, b) {
  var c = function() {
  };
  c.prototype = a.prototype;
  c = new c;
  a.apply(c, Array.prototype.slice.call(arguments, 1));
  return c;
};
goog.functions.CACHE_RETURN_VALUE = !0;
goog.functions.cacheReturnValue = function(a) {
  var b = !1, c;
  return function() {
    if (!goog.functions.CACHE_RETURN_VALUE) {
      return a();
    }
    b || (c = a(), b = !0);
    return c;
  };
};
goog.functions.once = function(a) {
  var b = a;
  return function() {
    if (b) {
      var a = b;
      b = null;
      a();
    }
  };
};
goog.functions.debounce = function(a, b, c) {
  var d = 0;
  return function(e) {
    goog.global.clearTimeout(d);
    var f = arguments;
    d = goog.global.setTimeout(function() {
      a.apply(c, f);
    }, b);
  };
};
goog.functions.throttle = function(a, b, c) {
  var d = 0, e = !1, f = [], g = function() {
    d = 0;
    e && (e = !1, h());
  }, h = function() {
    d = goog.global.setTimeout(g, b);
    a.apply(c, f);
  };
  return function(a) {
    f = arguments;
    d ? e = !0 : h();
  };
};
goog.functions.rateLimit = function(a, b, c) {
  var d = 0, e = function() {
    d = 0;
  };
  return function(f) {
    d || (d = goog.global.setTimeout(e, b), a.apply(c, arguments));
  };
};
goog.iter = {};
goog.iter.StopIteration = "StopIteration" in goog.global ? goog.global.StopIteration : {message:"StopIteration", stack:""};
goog.iter.Iterator = function() {
};
goog.iter.Iterator.prototype.next = function() {
  throw goog.iter.StopIteration;
};
goog.iter.Iterator.prototype.__iterator__ = function(a) {
  return this;
};
goog.iter.toIterator = function(a) {
  if (a instanceof goog.iter.Iterator) {
    return a;
  }
  if ("function" == typeof a.__iterator__) {
    return a.__iterator__(!1);
  }
  if (goog.isArrayLike(a)) {
    var b = 0, c = new goog.iter.Iterator;
    c.next = function() {
      for (;;) {
        if (b >= a.length) {
          throw goog.iter.StopIteration;
        }
        if (b in a) {
          return a[b++];
        }
        b++;
      }
    };
    return c;
  }
  throw Error("Not implemented");
};
goog.iter.forEach = function(a, b, c) {
  if (goog.isArrayLike(a)) {
    try {
      goog.array.forEach(a, b, c);
    } catch (d) {
      if (d !== goog.iter.StopIteration) {
        throw d;
      }
    }
  } else {
    a = goog.iter.toIterator(a);
    try {
      for (;;) {
        b.call(c, a.next(), void 0, a);
      }
    } catch (d) {
      if (d !== goog.iter.StopIteration) {
        throw d;
      }
    }
  }
};
goog.iter.filter = function(a, b, c) {
  var d = goog.iter.toIterator(a);
  a = new goog.iter.Iterator;
  a.next = function() {
    for (;;) {
      var a = d.next();
      if (b.call(c, a, void 0, d)) {
        return a;
      }
    }
  };
  return a;
};
goog.iter.filterFalse = function(a, b, c) {
  return goog.iter.filter(a, goog.functions.not(b), c);
};
goog.iter.range = function(a, b, c) {
  var d = 0, e = a, f = c || 1;
  1 < arguments.length && (d = a, e = +b);
  if (0 == f) {
    throw Error("Range step argument must not be zero");
  }
  var g = new goog.iter.Iterator;
  g.next = function() {
    if (0 < f && d >= e || 0 > f && d <= e) {
      throw goog.iter.StopIteration;
    }
    var a = d;
    d += f;
    return a;
  };
  return g;
};
goog.iter.join = function(a, b) {
  return goog.iter.toArray(a).join(b);
};
goog.iter.map = function(a, b, c) {
  var d = goog.iter.toIterator(a);
  a = new goog.iter.Iterator;
  a.next = function() {
    var a = d.next();
    return b.call(c, a, void 0, d);
  };
  return a;
};
goog.iter.reduce = function(a, b, c, d) {
  var e = c;
  goog.iter.forEach(a, function(a) {
    e = b.call(d, e, a);
  });
  return e;
};
goog.iter.some = function(a, b, c) {
  a = goog.iter.toIterator(a);
  try {
    for (;;) {
      if (b.call(c, a.next(), void 0, a)) {
        return !0;
      }
    }
  } catch (d) {
    if (d !== goog.iter.StopIteration) {
      throw d;
    }
  }
  return !1;
};
goog.iter.every = function(a, b, c) {
  a = goog.iter.toIterator(a);
  try {
    for (;;) {
      if (!b.call(c, a.next(), void 0, a)) {
        return !1;
      }
    }
  } catch (d) {
    if (d !== goog.iter.StopIteration) {
      throw d;
    }
  }
  return !0;
};
goog.iter.chain = function(a) {
  return goog.iter.chainFromIterable(arguments);
};
goog.iter.chainFromIterable = function(a) {
  var b = goog.iter.toIterator(a);
  a = new goog.iter.Iterator;
  var c = null;
  a.next = function() {
    for (;;) {
      if (null == c) {
        var a = b.next();
        c = goog.iter.toIterator(a);
      }
      try {
        return c.next();
      } catch (e) {
        if (e !== goog.iter.StopIteration) {
          throw e;
        }
        c = null;
      }
    }
  };
  return a;
};
goog.iter.dropWhile = function(a, b, c) {
  var d = goog.iter.toIterator(a);
  a = new goog.iter.Iterator;
  var e = !0;
  a.next = function() {
    for (;;) {
      var a = d.next();
      if (!e || !b.call(c, a, void 0, d)) {
        return e = !1, a;
      }
    }
  };
  return a;
};
goog.iter.takeWhile = function(a, b, c) {
  var d = goog.iter.toIterator(a);
  a = new goog.iter.Iterator;
  a.next = function() {
    var a = d.next();
    if (b.call(c, a, void 0, d)) {
      return a;
    }
    throw goog.iter.StopIteration;
  };
  return a;
};
goog.iter.toArray = function(a) {
  if (goog.isArrayLike(a)) {
    return goog.array.toArray(a);
  }
  a = goog.iter.toIterator(a);
  var b = [];
  goog.iter.forEach(a, function(a) {
    b.push(a);
  });
  return b;
};
goog.iter.equals = function(a, b, c) {
  a = goog.iter.zipLongest({}, a, b);
  var d = c || goog.array.defaultCompareEquality;
  return goog.iter.every(a, function(a) {
    return d(a[0], a[1]);
  });
};
goog.iter.nextOrValue = function(a, b) {
  try {
    return goog.iter.toIterator(a).next();
  } catch (c) {
    if (c != goog.iter.StopIteration) {
      throw c;
    }
    return b;
  }
};
goog.iter.product = function(a) {
  if (goog.array.some(arguments, function(a) {
    return !a.length;
  }) || !arguments.length) {
    return new goog.iter.Iterator;
  }
  var b = new goog.iter.Iterator, c = arguments, d = goog.array.repeat(0, c.length);
  b.next = function() {
    if (d) {
      for (var a = goog.array.map(d, function(a, b) {
        return c[b][a];
      }), b = d.length - 1; 0 <= b; b--) {
        goog.asserts.assert(d);
        if (d[b] < c[b].length - 1) {
          d[b]++;
          break;
        }
        if (0 == b) {
          d = null;
          break;
        }
        d[b] = 0;
      }
      return a;
    }
    throw goog.iter.StopIteration;
  };
  return b;
};
goog.iter.cycle = function(a) {
  var b = goog.iter.toIterator(a), c = [], d = 0;
  a = new goog.iter.Iterator;
  var e = !1;
  a.next = function() {
    var a = null;
    if (!e) {
      try {
        return a = b.next(), c.push(a), a;
      } catch (g) {
        if (g != goog.iter.StopIteration || goog.array.isEmpty(c)) {
          throw g;
        }
        e = !0;
      }
    }
    a = c[d];
    d = (d + 1) % c.length;
    return a;
  };
  return a;
};
goog.iter.count = function(a, b) {
  var c = a || 0, d = goog.isDef(b) ? b : 1;
  a = new goog.iter.Iterator;
  a.next = function() {
    var a = c;
    c += d;
    return a;
  };
  return a;
};
goog.iter.repeat = function(a) {
  var b = new goog.iter.Iterator;
  b.next = goog.functions.constant(a);
  return b;
};
goog.iter.accumulate = function(a) {
  var b = goog.iter.toIterator(a), c = 0;
  a = new goog.iter.Iterator;
  a.next = function() {
    return c += b.next();
  };
  return a;
};
goog.iter.zip = function(a) {
  var b = arguments, c = new goog.iter.Iterator;
  if (0 < b.length) {
    var d = goog.array.map(b, goog.iter.toIterator);
    c.next = function() {
      return goog.array.map(d, function(a) {
        return a.next();
      });
    };
  }
  return c;
};
goog.iter.zipLongest = function(a, b) {
  var c = goog.array.slice(arguments, 1), d = new goog.iter.Iterator;
  if (0 < c.length) {
    var e = goog.array.map(c, goog.iter.toIterator);
    d.next = function() {
      var b = !1, c = goog.array.map(e, function(c) {
        try {
          var d = c.next();
          b = !0;
        } catch (l) {
          if (l !== goog.iter.StopIteration) {
            throw l;
          }
          d = a;
        }
        return d;
      });
      if (!b) {
        throw goog.iter.StopIteration;
      }
      return c;
    };
  }
  return d;
};
goog.iter.compress = function(a, b) {
  var c = goog.iter.toIterator(b);
  return goog.iter.filter(a, function() {
    return !!c.next();
  });
};
goog.iter.GroupByIterator_ = function(a, b) {
  this.iterator = goog.iter.toIterator(a);
  this.keyFunc = b || goog.functions.identity;
};
goog.inherits(goog.iter.GroupByIterator_, goog.iter.Iterator);
goog.iter.GroupByIterator_.prototype.next = function() {
  for (; this.currentKey == this.targetKey;) {
    this.currentValue = this.iterator.next(), this.currentKey = this.keyFunc(this.currentValue);
  }
  this.targetKey = this.currentKey;
  return [this.currentKey, this.groupItems_(this.targetKey)];
};
goog.iter.GroupByIterator_.prototype.groupItems_ = function(a) {
  for (var b = []; this.currentKey == a;) {
    b.push(this.currentValue);
    try {
      this.currentValue = this.iterator.next();
    } catch (c) {
      if (c !== goog.iter.StopIteration) {
        throw c;
      }
      break;
    }
    this.currentKey = this.keyFunc(this.currentValue);
  }
  return b;
};
goog.iter.groupBy = function(a, b) {
  return new goog.iter.GroupByIterator_(a, b);
};
goog.iter.starMap = function(a, b, c) {
  var d = goog.iter.toIterator(a);
  a = new goog.iter.Iterator;
  a.next = function() {
    var a = goog.iter.toArray(d.next());
    return b.apply(c, goog.array.concat(a, void 0, d));
  };
  return a;
};
goog.iter.tee = function(a, b) {
  var c = goog.iter.toIterator(a);
  a = goog.isNumber(b) ? b : 2;
  var d = goog.array.map(goog.array.range(a), function() {
    return [];
  }), e = function() {
    var a = c.next();
    goog.array.forEach(d, function(b) {
      b.push(a);
    });
  };
  return goog.array.map(d, function(a) {
    var b = new goog.iter.Iterator;
    b.next = function() {
      goog.array.isEmpty(a) && e();
      goog.asserts.assert(!goog.array.isEmpty(a));
      return a.shift();
    };
    return b;
  });
};
goog.iter.enumerate = function(a, b) {
  return goog.iter.zip(goog.iter.count(b), a);
};
goog.iter.limit = function(a, b) {
  goog.asserts.assert(goog.math.isInt(b) && 0 <= b);
  var c = goog.iter.toIterator(a);
  a = new goog.iter.Iterator;
  var d = b;
  a.next = function() {
    if (0 < d--) {
      return c.next();
    }
    throw goog.iter.StopIteration;
  };
  return a;
};
goog.iter.consume = function(a, b) {
  goog.asserts.assert(goog.math.isInt(b) && 0 <= b);
  for (a = goog.iter.toIterator(a); 0 < b--;) {
    goog.iter.nextOrValue(a, null);
  }
  return a;
};
goog.iter.slice = function(a, b, c) {
  goog.asserts.assert(goog.math.isInt(b) && 0 <= b);
  a = goog.iter.consume(a, b);
  goog.isNumber(c) && (goog.asserts.assert(goog.math.isInt(c) && c >= b), a = goog.iter.limit(a, c - b));
  return a;
};
goog.iter.hasDuplicates_ = function(a) {
  var b = [];
  goog.array.removeDuplicates(a, b);
  return a.length != b.length;
};
goog.iter.permutations = function(a, b) {
  a = goog.iter.toArray(a);
  b = goog.isNumber(b) ? b : a.length;
  b = goog.array.repeat(a, b);
  b = goog.iter.product.apply(void 0, b);
  return goog.iter.filter(b, function(a) {
    return !goog.iter.hasDuplicates_(a);
  });
};
goog.iter.combinations = function(a, b) {
  function c(a) {
    return d[a];
  }
  var d = goog.iter.toArray(a);
  a = goog.iter.range(d.length);
  b = goog.iter.permutations(a, b);
  var e = goog.iter.filter(b, function(a) {
    return goog.array.isSorted(a);
  });
  b = new goog.iter.Iterator;
  b.next = function() {
    return goog.array.map(e.next(), c);
  };
  return b;
};
goog.iter.combinationsWithReplacement = function(a, b) {
  function c(a) {
    return d[a];
  }
  var d = goog.iter.toArray(a);
  a = goog.array.range(d.length);
  b = goog.array.repeat(a, b);
  b = goog.iter.product.apply(void 0, b);
  var e = goog.iter.filter(b, function(a) {
    return goog.array.isSorted(a);
  });
  b = new goog.iter.Iterator;
  b.next = function() {
    return goog.array.map(e.next(), c);
  };
  return b;
};
goog.structs = {};
goog.structs.Map = function(a, b) {
  this.map_ = {};
  this.keys_ = [];
  this.version_ = this.count_ = 0;
  var c = arguments.length;
  if (1 < c) {
    if (c % 2) {
      throw Error("Uneven number of arguments");
    }
    for (var d = 0; d < c; d += 2) {
      this.set(arguments[d], arguments[d + 1]);
    }
  } else {
    a && this.addAll(a);
  }
};
goog.structs.Map.prototype.getCount = function() {
  return this.count_;
};
goog.structs.Map.prototype.getValues = function() {
  this.cleanupKeysArray_();
  for (var a = [], b = 0; b < this.keys_.length; b++) {
    a.push(this.map_[this.keys_[b]]);
  }
  return a;
};
goog.structs.Map.prototype.getKeys = function() {
  this.cleanupKeysArray_();
  return this.keys_.concat();
};
goog.structs.Map.prototype.containsKey = function(a) {
  return goog.structs.Map.hasKey_(this.map_, a);
};
goog.structs.Map.prototype.containsValue = function(a) {
  for (var b = 0; b < this.keys_.length; b++) {
    var c = this.keys_[b];
    if (goog.structs.Map.hasKey_(this.map_, c) && this.map_[c] == a) {
      return !0;
    }
  }
  return !1;
};
goog.structs.Map.prototype.equals = function(a, b) {
  if (this === a) {
    return !0;
  }
  if (this.count_ != a.getCount()) {
    return !1;
  }
  b = b || goog.structs.Map.defaultEquals;
  this.cleanupKeysArray_();
  for (var c, d = 0; c = this.keys_[d]; d++) {
    if (!b(this.get(c), a.get(c))) {
      return !1;
    }
  }
  return !0;
};
goog.structs.Map.defaultEquals = function(a, b) {
  return a === b;
};
goog.structs.Map.prototype.isEmpty = function() {
  return 0 == this.count_;
};
goog.structs.Map.prototype.clear = function() {
  this.map_ = {};
  this.version_ = this.count_ = this.keys_.length = 0;
};
goog.structs.Map.prototype.remove = function(a) {
  return goog.structs.Map.hasKey_(this.map_, a) ? (delete this.map_[a], this.count_--, this.version_++, this.keys_.length > 2 * this.count_ && this.cleanupKeysArray_(), !0) : !1;
};
goog.structs.Map.prototype.cleanupKeysArray_ = function() {
  if (this.count_ != this.keys_.length) {
    for (var a = 0, b = 0; a < this.keys_.length;) {
      var c = this.keys_[a];
      goog.structs.Map.hasKey_(this.map_, c) && (this.keys_[b++] = c);
      a++;
    }
    this.keys_.length = b;
  }
  if (this.count_ != this.keys_.length) {
    var d = {};
    for (b = a = 0; a < this.keys_.length;) {
      c = this.keys_[a], goog.structs.Map.hasKey_(d, c) || (this.keys_[b++] = c, d[c] = 1), a++;
    }
    this.keys_.length = b;
  }
};
goog.structs.Map.prototype.get = function(a, b) {
  return goog.structs.Map.hasKey_(this.map_, a) ? this.map_[a] : b;
};
goog.structs.Map.prototype.set = function(a, b) {
  goog.structs.Map.hasKey_(this.map_, a) || (this.count_++, this.keys_.push(a), this.version_++);
  this.map_[a] = b;
};
goog.structs.Map.prototype.addAll = function(a) {
  if (a instanceof goog.structs.Map) {
    for (var b = a.getKeys(), c = 0; c < b.length; c++) {
      this.set(b[c], a.get(b[c]));
    }
  } else {
    for (b in a) {
      this.set(b, a[b]);
    }
  }
};
goog.structs.Map.prototype.forEach = function(a, b) {
  for (var c = this.getKeys(), d = 0; d < c.length; d++) {
    var e = c[d], f = this.get(e);
    a.call(b, f, e, this);
  }
};
goog.structs.Map.prototype.clone = function() {
  return new goog.structs.Map(this);
};
goog.structs.Map.prototype.transpose = function() {
  for (var a = new goog.structs.Map, b = 0; b < this.keys_.length; b++) {
    var c = this.keys_[b];
    a.set(this.map_[c], c);
  }
  return a;
};
goog.structs.Map.prototype.toObject = function() {
  this.cleanupKeysArray_();
  for (var a = {}, b = 0; b < this.keys_.length; b++) {
    var c = this.keys_[b];
    a[c] = this.map_[c];
  }
  return a;
};
goog.structs.Map.prototype.getKeyIterator = function() {
  return this.__iterator__(!0);
};
goog.structs.Map.prototype.getValueIterator = function() {
  return this.__iterator__(!1);
};
goog.structs.Map.prototype.__iterator__ = function(a) {
  this.cleanupKeysArray_();
  var b = 0, c = this.version_, d = this, e = new goog.iter.Iterator;
  e.next = function() {
    if (c != d.version_) {
      throw Error("The map has changed since the iterator was created");
    }
    if (b >= d.keys_.length) {
      throw goog.iter.StopIteration;
    }
    var e = d.keys_[b++];
    return a ? e : d.map_[e];
  };
  return e;
};
goog.structs.Map.hasKey_ = function(a, b) {
  return Object.prototype.hasOwnProperty.call(a, b);
};
annotorious.shape = {};
annotorious.shape.geom = {};
annotorious.shape.geom.Point = function(a, b) {
  this.x = a;
  this.y = b;
};
annotorious.shape.geom.Polygon = function(a) {
  this.points = a;
};
annotorious.shape.geom.Polygon.computeArea = function(a) {
  for (var b = 0.0, c = a.length - 1, d = 0; d < a.length; d++) {
    b += (a[c].x + a[d].x) * (a[c].y - a[d].y), c = d;
  }
  return b / 2;
};
annotorious.shape.geom.Polygon.isClockwise = function(a) {
  return 0 > annotorious.shape.geom.Polygon.computeArea(a);
};
annotorious.shape.geom.Polygon.computeCentroid = function(a) {
  for (var b = 0, c = 0, d, e = a.length - 1, f = 0; f < a.length; f++) {
    d = a[f].x * a[e].y - a[e].x * a[f].y, b += (a[f].x + a[e].x) * d, c += (a[f].y + a[e].y) * d, e = f;
  }
  d = 6 * annotorious.shape.geom.Polygon.computeArea(a);
  return new annotorious.shape.geom.Point(Math.abs(b / d), Math.abs(c / d));
};
annotorious.shape.geom.Polygon._expandTriangle = function(a, b) {
  function c(a, b, c) {
    var d = a.x - b.x;
    b = a.y - b.y;
    var e = 0 < c ? 1 : 0 > c ? -1 : 0;
    c = Math.sqrt(Math.pow(c, 2) / (1 + Math.pow(d / b, 2)));
    return {x:a.x + Math.abs(d / b * c) * (0 < d ? 1 : 0 > d ? -1 : 0) * e, y:a.y + Math.abs(c) * (0 < b ? 1 : 0 > b ? -1 : 0) * e};
  }
  for (var d = annotorious.shape.geom.Polygon.computeCentroid(a), e = [], f = 0; f < a.length; f++) {
    var g = annotorious.shape.geom.Polygon.isClockwise(a) ? -1 : 1;
    e.push(c(a[f], d, g * b));
  }
  return e;
};
annotorious.shape.geom.Polygon.expandPolygon = function(a, b) {
  var c = annotorious.shape.geom.Polygon.isClockwise(a) ? -1 : 1;
  if (4 > a.length) {
    return annotorious.shape.geom.Polygon._expandTriangle(a, c * b);
  }
  for (var d = a.length - 1, e = 1, f = [], g = 0; g < a.length; g++) {
    d = annotorious.shape.geom.Polygon._expandTriangle([a[d], a[g], a[e]], c * b), f.push(d[1]), d = g, e++, e > a.length - 1 && (e = 0);
  }
  return f;
};
annotorious.shape.geom.Rectangle = function(a, b, c, d) {
  0 < c ? (this.x = a, this.width = c) : (this.x = a + c, this.width = -c);
  0 < d ? (this.y = b, this.height = d) : (this.y = b + d, this.height = -d);
};
annotorious.shape.Shape = function(a, b, c, d) {
  this.type = a;
  this.geometry = b;
  c && (this.units = c);
  this.style = d ? d : {};
};
annotorious.shape.ShapeType = {POINT:"point", RECTANGLE:"rect", POLYGON:"polygon"};
annotorious.shape.Units = {PIXEL:"pixel", FRACTION:"fraction"};
annotorious.shape.intersects = function(a, b, c) {
  if (a.type == annotorious.shape.ShapeType.RECTANGLE) {
    return b < a.geometry.x || c < a.geometry.y || b > a.geometry.x + a.geometry.width || c > a.geometry.y + a.geometry.height ? !1 : !0;
  }
  if (a.type == annotorious.shape.ShapeType.POLYGON) {
    a = a.geometry.points;
    for (var d = !1, e = a.length - 1, f = 0; f < a.length; f++) {
      a[f].y > c != a[e].y > c && b < (a[e].x - a[f].x) * (c - a[f].y) / (a[e].y - a[f].y) + a[f].x && (d = !d), e = f;
    }
    return d;
  }
  return !1;
};
annotorious.shape.getSize = function(a) {
  return a.type == annotorious.shape.ShapeType.RECTANGLE ? a.geometry.width * a.geometry.height : a.type == annotorious.shape.ShapeType.POLYGON ? Math.abs(annotorious.shape.geom.Polygon.computeArea(a.geometry.points)) : 0;
};
annotorious.shape.getBoundingRect = function(a) {
  if (a.type == annotorious.shape.ShapeType.RECTANGLE) {
    return a;
  }
  if (a.type == annotorious.shape.ShapeType.POLYGON) {
    for (var b = a.geometry.points, c = b[0].x, d = b[0].x, e = b[0].y, f = b[0].y, g = 1; g < b.length; g++) {
      b[g].x > d && (d = b[g].x), b[g].x < c && (c = b[g].x), b[g].y > f && (f = b[g].y), b[g].y < e && (e = b[g].y);
    }
    return new annotorious.shape.Shape(annotorious.shape.ShapeType.RECTANGLE, new annotorious.shape.geom.Rectangle(c, e, d - c, f - e), !1, a.style);
  }
};
annotorious.shape.getCentroid = function(a) {
  if (a.type == annotorious.shape.ShapeType.RECTANGLE) {
    return a = a.geometry, new annotorious.shape.geom.Point(a.x + a.width / 2, a.y + a.height / 2);
  }
  if (a.type == annotorious.shape.ShapeType.POLYGON) {
    return annotorious.shape.geom.Polygon.computeCentroid(a.geometry.points);
  }
};
annotorious.shape.expand = function(a, b) {
  return new annotorious.shape.Shape(annotorious.shape.ShapeType.POLYGON, new annotorious.shape.geom.Polygon(annotorious.shape.geom.Polygon.expandPolygon(a.geometry.points, b)), !1, a.style);
};
annotorious.shape.transform = function(a, b) {
  if (a.type == annotorious.shape.ShapeType.RECTANGLE) {
    var c = b(a.geometry);
    return new annotorious.shape.Shape(annotorious.shape.ShapeType.RECTANGLE, c, !1, a.style);
  }
  if (a.type == annotorious.shape.ShapeType.POLYGON) {
    var d = [];
    goog.array.forEach(a.geometry.points, function(a) {
      d.push(b(a));
    });
    return new annotorious.shape.Shape(annotorious.shape.ShapeType.POLYGON, new annotorious.shape.geom.Polygon(d), !1, a.style);
  }
};
annotorious.shape.hashCode = function(a) {
  return JSON.stringify(a.geometry);
};
annotorious.Annotation = function(a, b, c) {
  this.src = a;
  this.text = b;
  this.shapes = [c];
  this.context = document.URL;
};
annotorious.mediatypes = {};
annotorious.mediatypes.Module = function() {
};
annotorious.mediatypes.Module.prototype._initFields = function(a) {
  this._annotators = new goog.structs.Map;
  this._eventHandlers = [];
  this._plugins = [];
  this._itemsToLoad = [];
  this._bufferedForAdding = [];
  this._bufferedForRemoval = [];
  this._cachedGlobalSettings = {hide_selection_widget:!1, hide_annotations:!1};
  this._cachedItemSettings = new goog.structs.Map;
  this._cachedProperties = void 0;
  this._preLoad = a;
};
annotorious.mediatypes.Module.prototype._getSettings = function(a) {
  var b = this._cachedItemSettings.get(a);
  b || (b = {hide_selection_widget:!1, hide_annotations:!1}, this._cachedItemSettings.set(a, b));
  return b;
};
annotorious.mediatypes.Module.prototype._initAnnotator = function(a) {
  var b = this, c = this.getItemURL(a);
  if (!this._annotators.get(c)) {
    var d = this.newAnnotator(a), e = [], f = [];
    goog.array.forEach(this._eventHandlers, function(a) {
      d.addHandler(a.type, a.handler);
    });
    goog.array.forEach(this._plugins, function(a) {
      b._initPlugin(a, d);
    });
    goog.array.forEach(this._bufferedForAdding, function(a) {
      a.src == c && (d.addAnnotation(a), e.push(a));
    });
    goog.array.forEach(this._bufferedForRemoval, function(a) {
      a.src == c && (d.removeAnnotation(a), f.push(a));
    });
    goog.array.forEach(e, function(a) {
      goog.array.remove(b._bufferedForAdding, a);
    });
    goog.array.forEach(f, function(a) {
      goog.array.remove(b._bufferedForRemoval, a);
    });
    var g = this._cachedItemSettings.get(c);
    g ? (g.hide_selection_widget && d.hideSelectionWidget(), g.hide_annotations && d.hideAnnotations(), this._cachedItemSettings.remove(c)) : (this._cachedGlobalSettings.hide_selection_widget && d.hideSelectionWidget(), this._cachedGlobalSettings.hide_annotations && d.hideAnnotations());
    this._cachedProperties && d.setProperties(this._cachedProperties);
    this._annotators.set(c, d);
    goog.array.remove(this._itemsToLoad, a);
  }
};
annotorious.mediatypes.Module.prototype._initPlugin = function(a, b) {
  if (a.onInitAnnotator) {
    a.onInitAnnotator(b);
  }
};
annotorious.mediatypes.Module.prototype._lazyLoad = function() {
  var a;
  for (a = this._itemsToLoad.length; 0 < a; a--) {
    var b = this._itemsToLoad[a - 1];
    annotorious.dom.isInViewport(b) && this._initAnnotator(b);
  }
};
annotorious.mediatypes.Module.prototype._setAnnotationVisibility = function(a, b) {
  if (a) {
    var c = this._annotators.get(a);
    c ? b ? c.showAnnotations() : c.hideAnnotations() : this._getSettings(a).hide_annotations = b;
  } else {
    goog.array.forEach(this._annotators.getValues(), function(a) {
      b ? a.showAnnotations() : a.hideAnnotations();
    }), this._cachedGlobalSettings.hide_annotations = !b, goog.array.forEach(this._cachedItemSettings.getValues(), function(a) {
      a.hide_annotations = !b;
    });
  }
};
annotorious.mediatypes.Module.prototype._setSelectionWidgetVisibility = function(a, b) {
  if (a) {
    var c = this._annotators.get(a);
    c ? b ? c.showSelectionWidget() : c.hideSelectionWidget() : this._getSettings(a).hide_selection_widget = b;
  } else {
    goog.array.forEach(this._annotators.getValues(), function(a) {
      b ? a.showSelectionWidget() : a.hideSelectionWidget();
    }), this._cachedGlobalSettings.hide_selection_widget = !b, goog.array.forEach(this._cachedItemSettings.getValues(), function(a) {
      a.hide_selection_widget = !b;
    });
  }
};
annotorious.mediatypes.Module.prototype.activateSelector = function(a, b) {
  var c = void 0, d = void 0;
  goog.isString(a) ? (c = a, d = b) : goog.isFunction(a) && (d = a);
  c ? (a = this._annotators.get(c)) && a.activateSelector(d) : goog.array.forEach(this._annotators.getValues(), function(a) {
    a.activateSelector(d);
  });
};
annotorious.mediatypes.Module.prototype.stopSelection = function(a) {
  a ? (a = this._annotators.get(a)) && a.stopSelection() : goog.array.forEach(this._annotators.getValues(), function(a) {
    a.stopSelection();
  });
};
annotorious.mediatypes.Module.prototype.addAnnotation = function(a, b) {
  if (this.annotatesItem(a.src)) {
    var c = this._annotators.get(a.src);
    c ? c.addAnnotation(a, b) : (this._bufferedForAdding.push(a), b && goog.array.remove(this._bufferedForAdding, b));
  }
};
annotorious.mediatypes.Module.prototype.addHandler = function(a, b) {
  goog.array.forEach(this._annotators.getValues(), function(c, d, e) {
    c.addHandler(a, b);
  });
  this._eventHandlers.push({type:a, handler:b});
};
annotorious.mediatypes.Module.prototype.removeHandler = function(a, b) {
  goog.array.forEach(this._annotators.getValues(), function(c, d, e) {
    c.removeHandler(a, b);
  });
  goog.array.forEach(this._eventHandlers, function(c, d, e) {
    c.type === a && (b && c.handler !== b || goog.array.removeAt(e, d));
  });
};
annotorious.mediatypes.Module.prototype.addPlugin = function(a) {
  this._plugins.push(a);
  var b = this;
  goog.array.forEach(this._annotators.getValues(), function(c) {
    b._initPlugin(a, c);
  });
};
annotorious.mediatypes.Module.prototype.annotatesItem = function(a) {
  if (this._annotators.containsKey(a)) {
    return !0;
  }
  var b = this, c = goog.array.find(this._itemsToLoad, function(c) {
    return b.getItemURL(c) == a;
  });
  return goog.isDefAndNotNull(c);
};
annotorious.mediatypes.Module.prototype.destroy = function(a) {
  if (a) {
    var b = this._annotators.get(a);
    b && (b.destroy(), this._annotators.remove(a));
  } else {
    goog.array.forEach(this._annotators.getValues(), function(a) {
      a.destroy();
    }), this._annotators.clear();
  }
};
annotorious.mediatypes.Module.prototype.getActiveSelector = function(a) {
  if (this.annotatesItem(a) && (a = this._annotators.get(a))) {
    return a.getActiveSelector().getName();
  }
};
annotorious.mediatypes.Module.prototype.getAnnotations = function(a) {
  if (a) {
    var b = this._annotators.get(a);
    return b ? b.getAnnotations() : goog.array.filter(this._bufferedForAdding, function(b) {
      return b.src == a;
    });
  }
  var c = [];
  goog.array.forEach(this._annotators.getValues(), function(a) {
    goog.array.extend(c, a.getAnnotations());
  });
  goog.array.extend(c, this._bufferedForAdding);
  return c;
};
annotorious.mediatypes.Module.prototype.getAvailableSelectors = function(a) {
  if (this.annotatesItem(a) && (a = this._annotators.get(a))) {
    return goog.array.map(a.getAvailableSelectors(), function(a) {
      return a.getName();
    });
  }
};
annotorious.mediatypes.Module.prototype.hideAnnotations = function(a) {
  this._setAnnotationVisibility(a, !1);
};
annotorious.mediatypes.Module.prototype.hideSelectionWidget = function(a) {
  this._setSelectionWidgetVisibility(a, !1);
};
annotorious.mediatypes.Module.prototype.highlightAnnotation = function(a) {
  if (a) {
    if (this.annotatesItem(a.src)) {
      var b = this._annotators.get(a.src);
      b && b.highlightAnnotation(a);
    }
  } else {
    goog.array.forEach(this._annotators.getValues(), function(a) {
      a.highlightAnnotation();
    });
  }
};
annotorious.mediatypes.Module.prototype.init = function() {
  this._preLoad && goog.array.extend(this._itemsToLoad, this._preLoad());
  this._lazyLoad();
  var a = this, b = goog.events.listen(window, goog.events.EventType.SCROLL, function() {
    0 < a._itemsToLoad.length ? a._lazyLoad() : goog.events.unlistenByKey(b);
  });
};
annotorious.mediatypes.Module.prototype.makeAnnotatable = function(a) {
  this.supports(a) && this._initAnnotator(a);
};
annotorious.mediatypes.Module.prototype.removeAnnotation = function(a) {
  if (this.annotatesItem(a.src)) {
    var b = this._annotators.get(a.src);
    b ? b.removeAnnotation(a) : this._bufferedForRemoval.push(a);
  }
};
annotorious.mediatypes.Module.prototype.setActiveSelector = function(a, b) {
  this.annotatesItem(a) && (a = this._annotators.get(a)) && a.setCurrentSelector(b);
};
annotorious.mediatypes.Module.prototype.setProperties = function(a) {
  this._cachedProperties = a;
  goog.array.forEach(this._annotators.getValues(), function(b) {
    b.setProperties(a);
  });
};
annotorious.mediatypes.Module.prototype.showAnnotations = function(a) {
  this._setAnnotationVisibility(a, !0);
};
annotorious.mediatypes.Module.prototype.showSelectionWidget = function(a) {
  this._setSelectionWidgetVisibility(a, !0);
};
annotorious.mediatypes.Module.prototype.getItemURL = goog.abstractMethod;
annotorious.mediatypes.Module.prototype.newAnnotator = goog.abstractMethod;
annotorious.mediatypes.Module.prototype.supports = goog.abstractMethod;
goog.dom.classes = {};
goog.dom.classes.set = function(a, b) {
  a.className = b;
};
goog.dom.classes.get = function(a) {
  a = a.className;
  return goog.isString(a) && a.match(/\S+/g) || [];
};
goog.dom.classes.add = function(a, b) {
  var c = goog.dom.classes.get(a), d = goog.array.slice(arguments, 1), e = c.length + d.length;
  goog.dom.classes.add_(c, d);
  goog.dom.classes.set(a, c.join(" "));
  return c.length == e;
};
goog.dom.classes.remove = function(a, b) {
  var c = goog.dom.classes.get(a), d = goog.array.slice(arguments, 1), e = goog.dom.classes.getDifference_(c, d);
  goog.dom.classes.set(a, e.join(" "));
  return e.length == c.length - d.length;
};
goog.dom.classes.add_ = function(a, b) {
  for (var c = 0; c < b.length; c++) {
    goog.array.contains(a, b[c]) || a.push(b[c]);
  }
};
goog.dom.classes.getDifference_ = function(a, b) {
  return goog.array.filter(a, function(a) {
    return !goog.array.contains(b, a);
  });
};
goog.dom.classes.swap = function(a, b, c) {
  for (var d = goog.dom.classes.get(a), e = !1, f = 0; f < d.length; f++) {
    d[f] == b && (goog.array.splice(d, f--, 1), e = !0);
  }
  e && (d.push(c), goog.dom.classes.set(a, d.join(" ")));
  return e;
};
goog.dom.classes.addRemove = function(a, b, c) {
  var d = goog.dom.classes.get(a);
  goog.isString(b) ? goog.array.remove(d, b) : goog.isArray(b) && (d = goog.dom.classes.getDifference_(d, b));
  goog.isString(c) && !goog.array.contains(d, c) ? d.push(c) : goog.isArray(c) && goog.dom.classes.add_(d, c);
  goog.dom.classes.set(a, d.join(" "));
};
goog.dom.classes.has = function(a, b) {
  return goog.array.contains(goog.dom.classes.get(a), b);
};
goog.dom.classes.enable = function(a, b, c) {
  c ? goog.dom.classes.add(a, b) : goog.dom.classes.remove(a, b);
};
goog.dom.classes.toggle = function(a, b) {
  var c = !goog.dom.classes.has(a, b);
  goog.dom.classes.enable(a, b, c);
  return c;
};
goog.html.legacyconversions = {};
goog.html.legacyconversions.safeHtmlFromString = function(a) {
  goog.html.legacyconversions.reportCallback_();
  return goog.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse(a, null);
};
goog.html.legacyconversions.safeScriptFromString = function(a) {
  goog.html.legacyconversions.reportCallback_();
  return goog.html.SafeScript.createSafeScriptSecurityPrivateDoNotAccessOrElse(a);
};
goog.html.legacyconversions.safeStyleFromString = function(a) {
  goog.html.legacyconversions.reportCallback_();
  return goog.html.SafeStyle.createSafeStyleSecurityPrivateDoNotAccessOrElse(a);
};
goog.html.legacyconversions.safeStyleSheetFromString = function(a) {
  goog.html.legacyconversions.reportCallback_();
  return goog.html.SafeStyleSheet.createSafeStyleSheetSecurityPrivateDoNotAccessOrElse(a);
};
goog.html.legacyconversions.safeUrlFromString = function(a) {
  goog.html.legacyconversions.reportCallback_();
  return goog.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse(a);
};
goog.html.legacyconversions.trustedResourceUrlFromString = function(a) {
  goog.html.legacyconversions.reportCallback_();
  return goog.html.TrustedResourceUrl.createTrustedResourceUrlSecurityPrivateDoNotAccessOrElse(a);
};
goog.html.legacyconversions.reportCallback_ = goog.nullFunction;
goog.html.legacyconversions.setReportCallback = function(a) {
  goog.html.legacyconversions.reportCallback_ = a;
};
goog.structs.getCount = function(a) {
  return a.getCount && "function" == typeof a.getCount ? a.getCount() : goog.isArrayLike(a) || goog.isString(a) ? a.length : goog.object.getCount(a);
};
goog.structs.getValues = function(a) {
  if (a.getValues && "function" == typeof a.getValues) {
    return a.getValues();
  }
  if (goog.isString(a)) {
    return a.split("");
  }
  if (goog.isArrayLike(a)) {
    for (var b = [], c = a.length, d = 0; d < c; d++) {
      b.push(a[d]);
    }
    return b;
  }
  return goog.object.getValues(a);
};
goog.structs.getKeys = function(a) {
  if (a.getKeys && "function" == typeof a.getKeys) {
    return a.getKeys();
  }
  if (!a.getValues || "function" != typeof a.getValues) {
    if (goog.isArrayLike(a) || goog.isString(a)) {
      var b = [];
      a = a.length;
      for (var c = 0; c < a; c++) {
        b.push(c);
      }
      return b;
    }
    return goog.object.getKeys(a);
  }
};
goog.structs.contains = function(a, b) {
  return a.contains && "function" == typeof a.contains ? a.contains(b) : a.containsValue && "function" == typeof a.containsValue ? a.containsValue(b) : goog.isArrayLike(a) || goog.isString(a) ? goog.array.contains(a, b) : goog.object.containsValue(a, b);
};
goog.structs.isEmpty = function(a) {
  return a.isEmpty && "function" == typeof a.isEmpty ? a.isEmpty() : goog.isArrayLike(a) || goog.isString(a) ? goog.array.isEmpty(a) : goog.object.isEmpty(a);
};
goog.structs.clear = function(a) {
  a.clear && "function" == typeof a.clear ? a.clear() : goog.isArrayLike(a) ? goog.array.clear(a) : goog.object.clear(a);
};
goog.structs.forEach = function(a, b, c) {
  if (a.forEach && "function" == typeof a.forEach) {
    a.forEach(b, c);
  } else {
    if (goog.isArrayLike(a) || goog.isString(a)) {
      goog.array.forEach(a, b, c);
    } else {
      for (var d = goog.structs.getKeys(a), e = goog.structs.getValues(a), f = e.length, g = 0; g < f; g++) {
        b.call(c, e[g], d && d[g], a);
      }
    }
  }
};
goog.structs.filter = function(a, b, c) {
  if ("function" == typeof a.filter) {
    return a.filter(b, c);
  }
  if (goog.isArrayLike(a) || goog.isString(a)) {
    return goog.array.filter(a, b, c);
  }
  var d = goog.structs.getKeys(a), e = goog.structs.getValues(a), f = e.length;
  if (d) {
    var g = {};
    for (var h = 0; h < f; h++) {
      b.call(c, e[h], d[h], a) && (g[d[h]] = e[h]);
    }
  } else {
    for (g = [], h = 0; h < f; h++) {
      b.call(c, e[h], void 0, a) && g.push(e[h]);
    }
  }
  return g;
};
goog.structs.map = function(a, b, c) {
  if ("function" == typeof a.map) {
    return a.map(b, c);
  }
  if (goog.isArrayLike(a) || goog.isString(a)) {
    return goog.array.map(a, b, c);
  }
  var d = goog.structs.getKeys(a), e = goog.structs.getValues(a), f = e.length;
  if (d) {
    var g = {};
    for (var h = 0; h < f; h++) {
      g[d[h]] = b.call(c, e[h], d[h], a);
    }
  } else {
    for (g = [], h = 0; h < f; h++) {
      g[h] = b.call(c, e[h], void 0, a);
    }
  }
  return g;
};
goog.structs.some = function(a, b, c) {
  if ("function" == typeof a.some) {
    return a.some(b, c);
  }
  if (goog.isArrayLike(a) || goog.isString(a)) {
    return goog.array.some(a, b, c);
  }
  for (var d = goog.structs.getKeys(a), e = goog.structs.getValues(a), f = e.length, g = 0; g < f; g++) {
    if (b.call(c, e[g], d && d[g], a)) {
      return !0;
    }
  }
  return !1;
};
goog.structs.every = function(a, b, c) {
  if ("function" == typeof a.every) {
    return a.every(b, c);
  }
  if (goog.isArrayLike(a) || goog.isString(a)) {
    return goog.array.every(a, b, c);
  }
  for (var d = goog.structs.getKeys(a), e = goog.structs.getValues(a), f = e.length, g = 0; g < f; g++) {
    if (!b.call(c, e[g], d && d[g], a)) {
      return !1;
    }
  }
  return !0;
};
goog.uri = {};
goog.uri.utils = {};
goog.uri.utils.CharCode_ = {AMPERSAND:38, EQUAL:61, HASH:35, QUESTION:63};
goog.uri.utils.buildFromEncodedParts = function(a, b, c, d, e, f, g) {
  var h = "";
  a && (h += a + ":");
  c && (h += "//", b && (h += b + "@"), h += c, d && (h += ":" + d));
  e && (h += e);
  f && (h += "?" + f);
  g && (h += "#" + g);
  return h;
};
goog.uri.utils.splitRe_ = /^(?:([^:/?#.]+):)?(?:\/\/(?:([^/?#]*)@)?([^/#?]*?)(?::([0-9]+))?(?=[/#?]|$))?([^?#]+)?(?:\?([^#]*))?(?:#([\s\S]*))?$/;
goog.uri.utils.ComponentIndex = {SCHEME:1, USER_INFO:2, DOMAIN:3, PORT:4, PATH:5, QUERY_DATA:6, FRAGMENT:7};
goog.uri.utils.split = function(a) {
  return a.match(goog.uri.utils.splitRe_);
};
goog.uri.utils.decodeIfPossible_ = function(a, b) {
  return a ? b ? decodeURI(a) : decodeURIComponent(a) : a;
};
goog.uri.utils.getComponentByIndex_ = function(a, b) {
  return goog.uri.utils.split(b)[a] || null;
};
goog.uri.utils.getScheme = function(a) {
  return goog.uri.utils.getComponentByIndex_(goog.uri.utils.ComponentIndex.SCHEME, a);
};
goog.uri.utils.getEffectiveScheme = function(a) {
  a = goog.uri.utils.getScheme(a);
  !a && goog.global.self && goog.global.self.location && (a = goog.global.self.location.protocol, a = a.substr(0, a.length - 1));
  return a ? a.toLowerCase() : "";
};
goog.uri.utils.getUserInfoEncoded = function(a) {
  return goog.uri.utils.getComponentByIndex_(goog.uri.utils.ComponentIndex.USER_INFO, a);
};
goog.uri.utils.getUserInfo = function(a) {
  return goog.uri.utils.decodeIfPossible_(goog.uri.utils.getUserInfoEncoded(a));
};
goog.uri.utils.getDomainEncoded = function(a) {
  return goog.uri.utils.getComponentByIndex_(goog.uri.utils.ComponentIndex.DOMAIN, a);
};
goog.uri.utils.getDomain = function(a) {
  return goog.uri.utils.decodeIfPossible_(goog.uri.utils.getDomainEncoded(a), !0);
};
goog.uri.utils.getPort = function(a) {
  return Number(goog.uri.utils.getComponentByIndex_(goog.uri.utils.ComponentIndex.PORT, a)) || null;
};
goog.uri.utils.getPathEncoded = function(a) {
  return goog.uri.utils.getComponentByIndex_(goog.uri.utils.ComponentIndex.PATH, a);
};
goog.uri.utils.getPath = function(a) {
  return goog.uri.utils.decodeIfPossible_(goog.uri.utils.getPathEncoded(a), !0);
};
goog.uri.utils.getQueryData = function(a) {
  return goog.uri.utils.getComponentByIndex_(goog.uri.utils.ComponentIndex.QUERY_DATA, a);
};
goog.uri.utils.getFragmentEncoded = function(a) {
  var b = a.indexOf("#");
  return 0 > b ? null : a.substr(b + 1);
};
goog.uri.utils.setFragmentEncoded = function(a, b) {
  return goog.uri.utils.removeFragment(a) + (b ? "#" + b : "");
};
goog.uri.utils.getFragment = function(a) {
  return goog.uri.utils.decodeIfPossible_(goog.uri.utils.getFragmentEncoded(a));
};
goog.uri.utils.getHost = function(a) {
  a = goog.uri.utils.split(a);
  return goog.uri.utils.buildFromEncodedParts(a[goog.uri.utils.ComponentIndex.SCHEME], a[goog.uri.utils.ComponentIndex.USER_INFO], a[goog.uri.utils.ComponentIndex.DOMAIN], a[goog.uri.utils.ComponentIndex.PORT]);
};
goog.uri.utils.getOrigin = function(a) {
  a = goog.uri.utils.split(a);
  return goog.uri.utils.buildFromEncodedParts(a[goog.uri.utils.ComponentIndex.SCHEME], null, a[goog.uri.utils.ComponentIndex.DOMAIN], a[goog.uri.utils.ComponentIndex.PORT]);
};
goog.uri.utils.getPathAndAfter = function(a) {
  a = goog.uri.utils.split(a);
  return goog.uri.utils.buildFromEncodedParts(null, null, null, null, a[goog.uri.utils.ComponentIndex.PATH], a[goog.uri.utils.ComponentIndex.QUERY_DATA], a[goog.uri.utils.ComponentIndex.FRAGMENT]);
};
goog.uri.utils.removeFragment = function(a) {
  var b = a.indexOf("#");
  return 0 > b ? a : a.substr(0, b);
};
goog.uri.utils.haveSameDomain = function(a, b) {
  a = goog.uri.utils.split(a);
  b = goog.uri.utils.split(b);
  return a[goog.uri.utils.ComponentIndex.DOMAIN] == b[goog.uri.utils.ComponentIndex.DOMAIN] && a[goog.uri.utils.ComponentIndex.SCHEME] == b[goog.uri.utils.ComponentIndex.SCHEME] && a[goog.uri.utils.ComponentIndex.PORT] == b[goog.uri.utils.ComponentIndex.PORT];
};
goog.uri.utils.assertNoFragmentsOrQueries_ = function(a) {
  goog.asserts.assert(0 > a.indexOf("#") && 0 > a.indexOf("?"), "goog.uri.utils: Fragment or query identifiers are not supported: [%s]", a);
};
goog.uri.utils.parseQueryData = function(a, b) {
  if (a) {
    a = a.split("&");
    for (var c = 0; c < a.length; c++) {
      var d = a[c].indexOf("="), e = null;
      if (0 <= d) {
        var f = a[c].substring(0, d);
        e = a[c].substring(d + 1);
      } else {
        f = a[c];
      }
      b(f, e ? goog.string.urlDecode(e) : "");
    }
  }
};
goog.uri.utils.splitQueryData_ = function(a) {
  var b = a.indexOf("#");
  0 > b && (b = a.length);
  var c = a.indexOf("?");
  if (0 > c || c > b) {
    c = b;
    var d = "";
  } else {
    d = a.substring(c + 1, b);
  }
  return [a.substr(0, c), d, a.substr(b)];
};
goog.uri.utils.joinQueryData_ = function(a) {
  return a[0] + (a[1] ? "?" + a[1] : "") + a[2];
};
goog.uri.utils.appendQueryData_ = function(a, b) {
  return b ? a ? a + "&" + b : b : a;
};
goog.uri.utils.appendQueryDataToUri_ = function(a, b) {
  if (!b) {
    return a;
  }
  a = goog.uri.utils.splitQueryData_(a);
  a[1] = goog.uri.utils.appendQueryData_(a[1], b);
  return goog.uri.utils.joinQueryData_(a);
};
goog.uri.utils.appendKeyValuePairs_ = function(a, b, c) {
  goog.asserts.assertString(a);
  if (goog.isArray(b)) {
    goog.asserts.assertArray(b);
    for (var d = 0; d < b.length; d++) {
      goog.uri.utils.appendKeyValuePairs_(a, String(b[d]), c);
    }
  } else {
    null != b && c.push(a + ("" === b ? "" : "=" + goog.string.urlEncode(b)));
  }
};
goog.uri.utils.buildQueryData = function(a, b) {
  goog.asserts.assert(0 == Math.max(a.length - (b || 0), 0) % 2, "goog.uri.utils: Key/value lists must be even in length.");
  var c = [];
  for (b = b || 0; b < a.length; b += 2) {
    goog.uri.utils.appendKeyValuePairs_(a[b], a[b + 1], c);
  }
  return c.join("&");
};
goog.uri.utils.buildQueryDataFromMap = function(a) {
  var b = [], c;
  for (c in a) {
    goog.uri.utils.appendKeyValuePairs_(c, a[c], b);
  }
  return b.join("&");
};
goog.uri.utils.appendParams = function(a, b) {
  var c = 2 == arguments.length ? goog.uri.utils.buildQueryData(arguments[1], 0) : goog.uri.utils.buildQueryData(arguments, 1);
  return goog.uri.utils.appendQueryDataToUri_(a, c);
};
goog.uri.utils.appendParamsFromMap = function(a, b) {
  b = goog.uri.utils.buildQueryDataFromMap(b);
  return goog.uri.utils.appendQueryDataToUri_(a, b);
};
goog.uri.utils.appendParam = function(a, b, c) {
  c = goog.isDefAndNotNull(c) ? "=" + goog.string.urlEncode(c) : "";
  return goog.uri.utils.appendQueryDataToUri_(a, b + c);
};
goog.uri.utils.findParam_ = function(a, b, c, d) {
  for (var e = c.length; 0 <= (b = a.indexOf(c, b)) && b < d;) {
    var f = a.charCodeAt(b - 1);
    if (f == goog.uri.utils.CharCode_.AMPERSAND || f == goog.uri.utils.CharCode_.QUESTION) {
      if (f = a.charCodeAt(b + e), !f || f == goog.uri.utils.CharCode_.EQUAL || f == goog.uri.utils.CharCode_.AMPERSAND || f == goog.uri.utils.CharCode_.HASH) {
        return b;
      }
    }
    b += e + 1;
  }
  return -1;
};
goog.uri.utils.hashOrEndRe_ = /#|$/;
goog.uri.utils.hasParam = function(a, b) {
  return 0 <= goog.uri.utils.findParam_(a, 0, b, a.search(goog.uri.utils.hashOrEndRe_));
};
goog.uri.utils.getParamValue = function(a, b) {
  var c = a.search(goog.uri.utils.hashOrEndRe_), d = goog.uri.utils.findParam_(a, 0, b, c);
  if (0 > d) {
    return null;
  }
  var e = a.indexOf("&", d);
  if (0 > e || e > c) {
    e = c;
  }
  d += b.length + 1;
  return goog.string.urlDecode(a.substr(d, e - d));
};
goog.uri.utils.getParamValues = function(a, b) {
  for (var c = a.search(goog.uri.utils.hashOrEndRe_), d = 0, e, f = []; 0 <= (e = goog.uri.utils.findParam_(a, d, b, c));) {
    d = a.indexOf("&", e);
    if (0 > d || d > c) {
      d = c;
    }
    e += b.length + 1;
    f.push(goog.string.urlDecode(a.substr(e, d - e)));
  }
  return f;
};
goog.uri.utils.trailingQueryPunctuationRe_ = /[?&]($|#)/;
goog.uri.utils.removeParam = function(a, b) {
  for (var c = a.search(goog.uri.utils.hashOrEndRe_), d = 0, e, f = []; 0 <= (e = goog.uri.utils.findParam_(a, d, b, c));) {
    f.push(a.substring(d, e)), d = Math.min(a.indexOf("&", e) + 1 || c, c);
  }
  f.push(a.substr(d));
  return f.join("").replace(goog.uri.utils.trailingQueryPunctuationRe_, "$1");
};
goog.uri.utils.setParam = function(a, b, c) {
  return goog.uri.utils.appendParam(goog.uri.utils.removeParam(a, b), b, c);
};
goog.uri.utils.setParamsFromMap = function(a, b) {
  a = goog.uri.utils.splitQueryData_(a);
  var c = a[1], d = [];
  c && goog.array.forEach(c.split("&"), function(a) {
    var c = a.indexOf("=");
    c = 0 <= c ? a.substr(0, c) : a;
    b.hasOwnProperty(c) || d.push(a);
  });
  a[1] = goog.uri.utils.appendQueryData_(d.join("&"), goog.uri.utils.buildQueryDataFromMap(b));
  return goog.uri.utils.joinQueryData_(a);
};
goog.uri.utils.appendPath = function(a, b) {
  goog.uri.utils.assertNoFragmentsOrQueries_(a);
  goog.string.endsWith(a, "/") && (a = a.substr(0, a.length - 1));
  goog.string.startsWith(b, "/") && (b = b.substr(1));
  return goog.string.buildString(a, "/", b);
};
goog.uri.utils.setPath = function(a, b) {
  goog.string.startsWith(b, "/") || (b = "/" + b);
  a = goog.uri.utils.split(a);
  return goog.uri.utils.buildFromEncodedParts(a[goog.uri.utils.ComponentIndex.SCHEME], a[goog.uri.utils.ComponentIndex.USER_INFO], a[goog.uri.utils.ComponentIndex.DOMAIN], a[goog.uri.utils.ComponentIndex.PORT], b, a[goog.uri.utils.ComponentIndex.QUERY_DATA], a[goog.uri.utils.ComponentIndex.FRAGMENT]);
};
goog.uri.utils.StandardQueryParam = {RANDOM:"zx"};
goog.uri.utils.makeUnique = function(a) {
  return goog.uri.utils.setParam(a, goog.uri.utils.StandardQueryParam.RANDOM, goog.string.getRandomString());
};
goog.Uri = function(a, b) {
  this.domain_ = this.userInfo_ = this.scheme_ = "";
  this.port_ = null;
  this.fragment_ = this.path_ = "";
  this.ignoreCase_ = this.isReadOnly_ = !1;
  var c;
  a instanceof goog.Uri ? (this.ignoreCase_ = goog.isDef(b) ? b : a.getIgnoreCase(), this.setScheme(a.getScheme()), this.setUserInfo(a.getUserInfo()), this.setDomain(a.getDomain()), this.setPort(a.getPort()), this.setPath(a.getPath()), this.setQueryData(a.getQueryData().clone()), this.setFragment(a.getFragment())) : a && (c = goog.uri.utils.split(String(a))) ? (this.ignoreCase_ = !!b, this.setScheme(c[goog.uri.utils.ComponentIndex.SCHEME] || "", !0), this.setUserInfo(c[goog.uri.utils.ComponentIndex.USER_INFO] || 
  "", !0), this.setDomain(c[goog.uri.utils.ComponentIndex.DOMAIN] || "", !0), this.setPort(c[goog.uri.utils.ComponentIndex.PORT]), this.setPath(c[goog.uri.utils.ComponentIndex.PATH] || "", !0), this.setQueryData(c[goog.uri.utils.ComponentIndex.QUERY_DATA] || "", !0), this.setFragment(c[goog.uri.utils.ComponentIndex.FRAGMENT] || "", !0)) : (this.ignoreCase_ = !!b, this.queryData_ = new goog.Uri.QueryData(null, null, this.ignoreCase_));
};
goog.Uri.RANDOM_PARAM = goog.uri.utils.StandardQueryParam.RANDOM;
goog.Uri.prototype.toString = function() {
  var a = [], b = this.getScheme();
  b && a.push(goog.Uri.encodeSpecialChars_(b, goog.Uri.reDisallowedInSchemeOrUserInfo_, !0), ":");
  var c = this.getDomain();
  if (c || "file" == b) {
    a.push("//"), (b = this.getUserInfo()) && a.push(goog.Uri.encodeSpecialChars_(b, goog.Uri.reDisallowedInSchemeOrUserInfo_, !0), "@"), a.push(goog.Uri.removeDoubleEncoding_(goog.string.urlEncode(c))), c = this.getPort(), null != c && a.push(":", String(c));
  }
  if (c = this.getPath()) {
    this.hasDomain() && "/" != c.charAt(0) && a.push("/"), a.push(goog.Uri.encodeSpecialChars_(c, "/" == c.charAt(0) ? goog.Uri.reDisallowedInAbsolutePath_ : goog.Uri.reDisallowedInRelativePath_, !0));
  }
  (c = this.getEncodedQuery()) && a.push("?", c);
  (c = this.getFragment()) && a.push("#", goog.Uri.encodeSpecialChars_(c, goog.Uri.reDisallowedInFragment_));
  return a.join("");
};
goog.Uri.prototype.resolve = function(a) {
  var b = this.clone(), c = a.hasScheme();
  c ? b.setScheme(a.getScheme()) : c = a.hasUserInfo();
  c ? b.setUserInfo(a.getUserInfo()) : c = a.hasDomain();
  c ? b.setDomain(a.getDomain()) : c = a.hasPort();
  var d = a.getPath();
  if (c) {
    b.setPort(a.getPort());
  } else {
    if (c = a.hasPath()) {
      if ("/" != d.charAt(0)) {
        if (this.hasDomain() && !this.hasPath()) {
          d = "/" + d;
        } else {
          var e = b.getPath().lastIndexOf("/");
          -1 != e && (d = b.getPath().substr(0, e + 1) + d);
        }
      }
      d = goog.Uri.removeDotSegments(d);
    }
  }
  c ? b.setPath(d) : c = a.hasQuery();
  c ? b.setQueryData(a.getQueryData().clone()) : c = a.hasFragment();
  c && b.setFragment(a.getFragment());
  return b;
};
goog.Uri.prototype.clone = function() {
  return new goog.Uri(this);
};
goog.Uri.prototype.getScheme = function() {
  return this.scheme_;
};
goog.Uri.prototype.setScheme = function(a, b) {
  this.enforceReadOnly();
  if (this.scheme_ = b ? goog.Uri.decodeOrEmpty_(a, !0) : a) {
    this.scheme_ = this.scheme_.replace(/:$/, "");
  }
  return this;
};
goog.Uri.prototype.hasScheme = function() {
  return !!this.scheme_;
};
goog.Uri.prototype.getUserInfo = function() {
  return this.userInfo_;
};
goog.Uri.prototype.setUserInfo = function(a, b) {
  this.enforceReadOnly();
  this.userInfo_ = b ? goog.Uri.decodeOrEmpty_(a) : a;
  return this;
};
goog.Uri.prototype.hasUserInfo = function() {
  return !!this.userInfo_;
};
goog.Uri.prototype.getDomain = function() {
  return this.domain_;
};
goog.Uri.prototype.setDomain = function(a, b) {
  this.enforceReadOnly();
  this.domain_ = b ? goog.Uri.decodeOrEmpty_(a, !0) : a;
  return this;
};
goog.Uri.prototype.hasDomain = function() {
  return !!this.domain_;
};
goog.Uri.prototype.getPort = function() {
  return this.port_;
};
goog.Uri.prototype.setPort = function(a) {
  this.enforceReadOnly();
  if (a) {
    a = Number(a);
    if (isNaN(a) || 0 > a) {
      throw Error("Bad port number " + a);
    }
    this.port_ = a;
  } else {
    this.port_ = null;
  }
  return this;
};
goog.Uri.prototype.hasPort = function() {
  return null != this.port_;
};
goog.Uri.prototype.getPath = function() {
  return this.path_;
};
goog.Uri.prototype.setPath = function(a, b) {
  this.enforceReadOnly();
  this.path_ = b ? goog.Uri.decodeOrEmpty_(a, !0) : a;
  return this;
};
goog.Uri.prototype.hasPath = function() {
  return !!this.path_;
};
goog.Uri.prototype.hasQuery = function() {
  return "" !== this.queryData_.toString();
};
goog.Uri.prototype.setQueryData = function(a, b) {
  this.enforceReadOnly();
  a instanceof goog.Uri.QueryData ? (this.queryData_ = a, this.queryData_.setIgnoreCase(this.ignoreCase_)) : (b || (a = goog.Uri.encodeSpecialChars_(a, goog.Uri.reDisallowedInQuery_)), this.queryData_ = new goog.Uri.QueryData(a, null, this.ignoreCase_));
  return this;
};
goog.Uri.prototype.setQuery = function(a, b) {
  return this.setQueryData(a, b);
};
goog.Uri.prototype.getEncodedQuery = function() {
  return this.queryData_.toString();
};
goog.Uri.prototype.getDecodedQuery = function() {
  return this.queryData_.toDecodedString();
};
goog.Uri.prototype.getQueryData = function() {
  return this.queryData_;
};
goog.Uri.prototype.getQuery = function() {
  return this.getEncodedQuery();
};
goog.Uri.prototype.setParameterValue = function(a, b) {
  this.enforceReadOnly();
  this.queryData_.set(a, b);
  return this;
};
goog.Uri.prototype.setParameterValues = function(a, b) {
  this.enforceReadOnly();
  goog.isArray(b) || (b = [String(b)]);
  this.queryData_.setValues(a, b);
  return this;
};
goog.Uri.prototype.getParameterValues = function(a) {
  return this.queryData_.getValues(a);
};
goog.Uri.prototype.getParameterValue = function(a) {
  return this.queryData_.get(a);
};
goog.Uri.prototype.getFragment = function() {
  return this.fragment_;
};
goog.Uri.prototype.setFragment = function(a, b) {
  this.enforceReadOnly();
  this.fragment_ = b ? goog.Uri.decodeOrEmpty_(a) : a;
  return this;
};
goog.Uri.prototype.hasFragment = function() {
  return !!this.fragment_;
};
goog.Uri.prototype.hasSameDomainAs = function(a) {
  return (!this.hasDomain() && !a.hasDomain() || this.getDomain() == a.getDomain()) && (!this.hasPort() && !a.hasPort() || this.getPort() == a.getPort());
};
goog.Uri.prototype.makeUnique = function() {
  this.enforceReadOnly();
  this.setParameterValue(goog.Uri.RANDOM_PARAM, goog.string.getRandomString());
  return this;
};
goog.Uri.prototype.removeParameter = function(a) {
  this.enforceReadOnly();
  this.queryData_.remove(a);
  return this;
};
goog.Uri.prototype.setReadOnly = function(a) {
  this.isReadOnly_ = a;
  return this;
};
goog.Uri.prototype.isReadOnly = function() {
  return this.isReadOnly_;
};
goog.Uri.prototype.enforceReadOnly = function() {
  if (this.isReadOnly_) {
    throw Error("Tried to modify a read-only Uri");
  }
};
goog.Uri.prototype.setIgnoreCase = function(a) {
  this.ignoreCase_ = a;
  this.queryData_ && this.queryData_.setIgnoreCase(a);
  return this;
};
goog.Uri.prototype.getIgnoreCase = function() {
  return this.ignoreCase_;
};
goog.Uri.parse = function(a, b) {
  return a instanceof goog.Uri ? a.clone() : new goog.Uri(a, b);
};
goog.Uri.create = function(a, b, c, d, e, f, g, h) {
  h = new goog.Uri(null, h);
  a && h.setScheme(a);
  b && h.setUserInfo(b);
  c && h.setDomain(c);
  d && h.setPort(d);
  e && h.setPath(e);
  f && h.setQueryData(f);
  g && h.setFragment(g);
  return h;
};
goog.Uri.resolve = function(a, b) {
  a instanceof goog.Uri || (a = goog.Uri.parse(a));
  b instanceof goog.Uri || (b = goog.Uri.parse(b));
  return a.resolve(b);
};
goog.Uri.removeDotSegments = function(a) {
  if (".." == a || "." == a) {
    return "";
  }
  if (goog.string.contains(a, "./") || goog.string.contains(a, "/.")) {
    var b = goog.string.startsWith(a, "/");
    a = a.split("/");
    for (var c = [], d = 0; d < a.length;) {
      var e = a[d++];
      "." == e ? b && d == a.length && c.push("") : ".." == e ? ((1 < c.length || 1 == c.length && "" != c[0]) && c.pop(), b && d == a.length && c.push("")) : (c.push(e), b = !0);
    }
    return c.join("/");
  }
  return a;
};
goog.Uri.decodeOrEmpty_ = function(a, b) {
  return a ? b ? decodeURI(a.replace(/%25/g, "%2525")) : decodeURIComponent(a) : "";
};
goog.Uri.encodeSpecialChars_ = function(a, b, c) {
  return goog.isString(a) ? (a = encodeURI(a).replace(b, goog.Uri.encodeChar_), c && (a = goog.Uri.removeDoubleEncoding_(a)), a) : null;
};
goog.Uri.encodeChar_ = function(a) {
  a = a.charCodeAt(0);
  return "%" + (a >> 4 & 15).toString(16) + (a & 15).toString(16);
};
goog.Uri.removeDoubleEncoding_ = function(a) {
  return a.replace(/%25([0-9a-fA-F]{2})/g, "%$1");
};
goog.Uri.reDisallowedInSchemeOrUserInfo_ = /[#\/\?@]/g;
goog.Uri.reDisallowedInRelativePath_ = /[#\?:]/g;
goog.Uri.reDisallowedInAbsolutePath_ = /[#\?]/g;
goog.Uri.reDisallowedInQuery_ = /[#\?@]/g;
goog.Uri.reDisallowedInFragment_ = /#/g;
goog.Uri.haveSameDomain = function(a, b) {
  a = goog.uri.utils.split(a);
  b = goog.uri.utils.split(b);
  return a[goog.uri.utils.ComponentIndex.DOMAIN] == b[goog.uri.utils.ComponentIndex.DOMAIN] && a[goog.uri.utils.ComponentIndex.PORT] == b[goog.uri.utils.ComponentIndex.PORT];
};
goog.Uri.QueryData = function(a, b, c) {
  this.count_ = this.keyMap_ = null;
  this.encodedQuery_ = a || null;
  this.ignoreCase_ = !!c;
};
goog.Uri.QueryData.prototype.ensureKeyMapInitialized_ = function() {
  if (!this.keyMap_ && (this.keyMap_ = new goog.structs.Map, this.count_ = 0, this.encodedQuery_)) {
    var a = this;
    goog.uri.utils.parseQueryData(this.encodedQuery_, function(b, c) {
      a.add(goog.string.urlDecode(b), c);
    });
  }
};
goog.Uri.QueryData.createFromMap = function(a, b, c) {
  b = goog.structs.getKeys(a);
  if ("undefined" == typeof b) {
    throw Error("Keys are undefined");
  }
  c = new goog.Uri.QueryData(null, null, c);
  a = goog.structs.getValues(a);
  for (var d = 0; d < b.length; d++) {
    var e = b[d], f = a[d];
    goog.isArray(f) ? c.setValues(e, f) : c.add(e, f);
  }
  return c;
};
goog.Uri.QueryData.createFromKeysValues = function(a, b, c, d) {
  if (a.length != b.length) {
    throw Error("Mismatched lengths for keys/values");
  }
  c = new goog.Uri.QueryData(null, null, d);
  for (d = 0; d < a.length; d++) {
    c.add(a[d], b[d]);
  }
  return c;
};
goog.Uri.QueryData.prototype.getCount = function() {
  this.ensureKeyMapInitialized_();
  return this.count_;
};
goog.Uri.QueryData.prototype.add = function(a, b) {
  this.ensureKeyMapInitialized_();
  this.invalidateCache_();
  a = this.getKeyName_(a);
  var c = this.keyMap_.get(a);
  c || this.keyMap_.set(a, c = []);
  c.push(b);
  this.count_ = goog.asserts.assertNumber(this.count_) + 1;
  return this;
};
goog.Uri.QueryData.prototype.remove = function(a) {
  this.ensureKeyMapInitialized_();
  a = this.getKeyName_(a);
  return this.keyMap_.containsKey(a) ? (this.invalidateCache_(), this.count_ = goog.asserts.assertNumber(this.count_) - this.keyMap_.get(a).length, this.keyMap_.remove(a)) : !1;
};
goog.Uri.QueryData.prototype.clear = function() {
  this.invalidateCache_();
  this.keyMap_ = null;
  this.count_ = 0;
};
goog.Uri.QueryData.prototype.isEmpty = function() {
  this.ensureKeyMapInitialized_();
  return 0 == this.count_;
};
goog.Uri.QueryData.prototype.containsKey = function(a) {
  this.ensureKeyMapInitialized_();
  a = this.getKeyName_(a);
  return this.keyMap_.containsKey(a);
};
goog.Uri.QueryData.prototype.containsValue = function(a) {
  var b = this.getValues();
  return goog.array.contains(b, a);
};
goog.Uri.QueryData.prototype.forEach = function(a, b) {
  this.ensureKeyMapInitialized_();
  this.keyMap_.forEach(function(c, d) {
    goog.array.forEach(c, function(c) {
      a.call(b, c, d, this);
    }, this);
  }, this);
};
goog.Uri.QueryData.prototype.getKeys = function() {
  this.ensureKeyMapInitialized_();
  for (var a = this.keyMap_.getValues(), b = this.keyMap_.getKeys(), c = [], d = 0; d < b.length; d++) {
    for (var e = a[d], f = 0; f < e.length; f++) {
      c.push(b[d]);
    }
  }
  return c;
};
goog.Uri.QueryData.prototype.getValues = function(a) {
  this.ensureKeyMapInitialized_();
  var b = [];
  if (goog.isString(a)) {
    this.containsKey(a) && (b = goog.array.concat(b, this.keyMap_.get(this.getKeyName_(a))));
  } else {
    a = this.keyMap_.getValues();
    for (var c = 0; c < a.length; c++) {
      b = goog.array.concat(b, a[c]);
    }
  }
  return b;
};
goog.Uri.QueryData.prototype.set = function(a, b) {
  this.ensureKeyMapInitialized_();
  this.invalidateCache_();
  a = this.getKeyName_(a);
  this.containsKey(a) && (this.count_ = goog.asserts.assertNumber(this.count_) - this.keyMap_.get(a).length);
  this.keyMap_.set(a, [b]);
  this.count_ = goog.asserts.assertNumber(this.count_) + 1;
  return this;
};
goog.Uri.QueryData.prototype.get = function(a, b) {
  if (!a) {
    return b;
  }
  a = this.getValues(a);
  return 0 < a.length ? String(a[0]) : b;
};
goog.Uri.QueryData.prototype.setValues = function(a, b) {
  this.remove(a);
  0 < b.length && (this.invalidateCache_(), this.keyMap_.set(this.getKeyName_(a), goog.array.clone(b)), this.count_ = goog.asserts.assertNumber(this.count_) + b.length);
};
goog.Uri.QueryData.prototype.toString = function() {
  if (this.encodedQuery_) {
    return this.encodedQuery_;
  }
  if (!this.keyMap_) {
    return "";
  }
  for (var a = [], b = this.keyMap_.getKeys(), c = 0; c < b.length; c++) {
    var d = b[c], e = goog.string.urlEncode(d);
    d = this.getValues(d);
    for (var f = 0; f < d.length; f++) {
      var g = e;
      "" !== d[f] && (g += "=" + goog.string.urlEncode(d[f]));
      a.push(g);
    }
  }
  return this.encodedQuery_ = a.join("&");
};
goog.Uri.QueryData.prototype.toDecodedString = function() {
  return goog.Uri.decodeOrEmpty_(this.toString());
};
goog.Uri.QueryData.prototype.invalidateCache_ = function() {
  this.encodedQuery_ = null;
};
goog.Uri.QueryData.prototype.filterKeys = function(a) {
  this.ensureKeyMapInitialized_();
  this.keyMap_.forEach(function(b, c) {
    goog.array.contains(a, c) || this.remove(c);
  }, this);
  return this;
};
goog.Uri.QueryData.prototype.clone = function() {
  var a = new goog.Uri.QueryData;
  a.encodedQuery_ = this.encodedQuery_;
  this.keyMap_ && (a.keyMap_ = this.keyMap_.clone(), a.count_ = this.count_);
  return a;
};
goog.Uri.QueryData.prototype.getKeyName_ = function(a) {
  a = String(a);
  this.ignoreCase_ && (a = a.toLowerCase());
  return a;
};
goog.Uri.QueryData.prototype.setIgnoreCase = function(a) {
  a && !this.ignoreCase_ && (this.ensureKeyMapInitialized_(), this.invalidateCache_(), this.keyMap_.forEach(function(a, c) {
    var b = c.toLowerCase();
    c != b && (this.remove(c), this.setValues(b, a));
  }, this));
  this.ignoreCase_ = a;
};
goog.Uri.QueryData.prototype.extend = function(a) {
  for (var b = 0; b < arguments.length; b++) {
    goog.structs.forEach(arguments[b], function(a, b) {
      this.add(b, a);
    }, this);
  }
};
goog.soy = {};
goog.soy.data = {};
goog.soy.data.SanitizedContentKind = {HTML:goog.DEBUG ? {sanitizedContentKindHtml:!0} : {}, JS:goog.DEBUG ? {sanitizedContentJsChars:!0} : {}, URI:goog.DEBUG ? {sanitizedContentUri:!0} : {}, TRUSTED_RESOURCE_URI:goog.DEBUG ? {sanitizedContentTrustedResourceUri:!0} : {}, ATTRIBUTES:goog.DEBUG ? {sanitizedContentHtmlAttribute:!0} : {}, STYLE:goog.DEBUG ? {sanitizedContentStyle:!0} : {}, CSS:goog.DEBUG ? {sanitizedContentCss:!0} : {}, TEXT:goog.DEBUG ? {sanitizedContentKindText:!0} : {}};
goog.soy.data.SanitizedContent = function() {
  throw Error("Do not instantiate directly");
};
goog.soy.data.SanitizedContent.prototype.contentDir = null;
goog.soy.data.SanitizedContent.prototype.getContent = function() {
  return this.content;
};
goog.soy.data.SanitizedContent.prototype.toString = function() {
  return this.content;
};
goog.soy.data.SanitizedContent.prototype.toSafeHtml = function() {
  if (this.contentKind === goog.soy.data.SanitizedContentKind.TEXT) {
    return goog.html.SafeHtml.htmlEscape(this.toString());
  }
  if (this.contentKind !== goog.soy.data.SanitizedContentKind.HTML) {
    throw Error("Sanitized content was not of kind TEXT or HTML.");
  }
  return goog.html.uncheckedconversions.safeHtmlFromStringKnownToSatisfyTypeContract(goog.string.Const.from("Soy SanitizedContent of kind HTML produces SafeHtml-contract-compliant value."), this.toString(), this.contentDir);
};
goog.soy.data.SanitizedContent.prototype.toSafeUrl = function() {
  if (this.contentKind !== goog.soy.data.SanitizedContentKind.URI) {
    throw Error("Sanitized content was not of kind URI.");
  }
  return goog.html.uncheckedconversions.safeUrlFromStringKnownToSatisfyTypeContract(goog.string.Const.from("Soy SanitizedContent of kind URI produces SafeHtml-contract-compliant value."), this.toString());
};
goog.soy.data.UnsanitizedText = function(a, b) {
  this.content = String(a);
  this.contentDir = null != b ? b : null;
};
goog.inherits(goog.soy.data.UnsanitizedText, goog.soy.data.SanitizedContent);
goog.soy.data.UnsanitizedText.prototype.contentKind = goog.soy.data.SanitizedContentKind.TEXT;
goog.soy.data.SanitizedHtml = function() {
  goog.soy.data.SanitizedContent.call(this);
};
goog.inherits(goog.soy.data.SanitizedHtml, goog.soy.data.SanitizedContent);
goog.soy.data.SanitizedHtml.prototype.contentKind = goog.soy.data.SanitizedContentKind.HTML;
goog.soy.data.SanitizedHtml.isCompatibleWith = function(a) {
  return goog.isString(a) || a instanceof goog.soy.data.SanitizedHtml || a instanceof goog.soy.data.UnsanitizedText || a instanceof goog.html.SafeHtml;
};
goog.soy.data.SanitizedJs = function() {
  goog.soy.data.SanitizedContent.call(this);
};
goog.inherits(goog.soy.data.SanitizedJs, goog.soy.data.SanitizedContent);
goog.soy.data.SanitizedJs.prototype.contentKind = goog.soy.data.SanitizedContentKind.JS;
goog.soy.data.SanitizedJs.prototype.contentDir = goog.i18n.bidi.Dir.LTR;
goog.soy.data.SanitizedJs.isCompatibleWith = function(a) {
  return goog.isString(a) || a instanceof goog.soy.data.SanitizedJs || a instanceof goog.soy.data.UnsanitizedText || a instanceof goog.html.SafeScript;
};
goog.soy.data.SanitizedUri = function() {
  goog.soy.data.SanitizedContent.call(this);
};
goog.inherits(goog.soy.data.SanitizedUri, goog.soy.data.SanitizedContent);
goog.soy.data.SanitizedUri.prototype.contentKind = goog.soy.data.SanitizedContentKind.URI;
goog.soy.data.SanitizedUri.prototype.contentDir = goog.i18n.bidi.Dir.LTR;
goog.soy.data.SanitizedUri.isCompatibleWith = function(a) {
  return goog.isString(a) || a instanceof goog.soy.data.SanitizedUri || a instanceof goog.soy.data.UnsanitizedText || a instanceof goog.html.SafeUrl || a instanceof goog.html.TrustedResourceUrl || a instanceof goog.Uri;
};
goog.soy.data.SanitizedTrustedResourceUri = function() {
  goog.soy.data.SanitizedContent.call(this);
};
goog.inherits(goog.soy.data.SanitizedTrustedResourceUri, goog.soy.data.SanitizedContent);
goog.soy.data.SanitizedTrustedResourceUri.prototype.contentKind = goog.soy.data.SanitizedContentKind.TRUSTED_RESOURCE_URI;
goog.soy.data.SanitizedTrustedResourceUri.prototype.contentDir = goog.i18n.bidi.Dir.LTR;
goog.soy.data.SanitizedTrustedResourceUri.prototype.toTrustedResourceUrl = function() {
  return goog.html.uncheckedconversions.trustedResourceUrlFromStringKnownToSatisfyTypeContract(goog.string.Const.from("Soy SanitizedContent of kind TRUSTED_RESOURCE_URI produces TrustedResourceUrl-contract-compliant value."), this.toString());
};
goog.soy.data.SanitizedTrustedResourceUri.isCompatibleWith = function(a) {
  return goog.isString(a) || a instanceof goog.soy.data.SanitizedTrustedResourceUri || a instanceof goog.soy.data.UnsanitizedText || a instanceof goog.html.TrustedResourceUrl;
};
goog.soy.data.SanitizedHtmlAttribute = function() {
  goog.soy.data.SanitizedContent.call(this);
};
goog.inherits(goog.soy.data.SanitizedHtmlAttribute, goog.soy.data.SanitizedContent);
goog.soy.data.SanitizedHtmlAttribute.prototype.contentKind = goog.soy.data.SanitizedContentKind.ATTRIBUTES;
goog.soy.data.SanitizedHtmlAttribute.prototype.contentDir = goog.i18n.bidi.Dir.LTR;
goog.soy.data.SanitizedHtmlAttribute.isCompatibleWith = function(a) {
  return goog.isString(a) || a instanceof goog.soy.data.SanitizedHtmlAttribute || a instanceof goog.soy.data.UnsanitizedText;
};
goog.soy.data.SanitizedStyle = function() {
  goog.soy.data.SanitizedContent.call(this);
};
goog.inherits(goog.soy.data.SanitizedStyle, goog.soy.data.SanitizedContent);
goog.soy.data.SanitizedStyle.prototype.contentKind = goog.soy.data.SanitizedContentKind.STYLE;
goog.soy.data.SanitizedStyle.prototype.contentDir = goog.i18n.bidi.Dir.LTR;
goog.soy.data.SanitizedStyle.isCompatibleWith = function(a) {
  return goog.isString(a) || a instanceof goog.soy.data.SanitizedStyle || a instanceof goog.soy.data.UnsanitizedText || a instanceof goog.html.SafeStyle;
};
goog.soy.data.SanitizedCss = function() {
  goog.soy.data.SanitizedContent.call(this);
};
goog.inherits(goog.soy.data.SanitizedCss, goog.soy.data.SanitizedContent);
goog.soy.data.SanitizedCss.prototype.contentKind = goog.soy.data.SanitizedContentKind.CSS;
goog.soy.data.SanitizedCss.prototype.contentDir = goog.i18n.bidi.Dir.LTR;
goog.soy.data.SanitizedCss.isCompatibleWith = function(a) {
  return goog.isString(a) || a instanceof goog.soy.data.SanitizedCss || a instanceof goog.soy.data.UnsanitizedText || a instanceof goog.html.SafeStyle || a instanceof goog.html.SafeStyleSheet;
};
goog.soy.data.SanitizedCss.prototype.toSafeStyleSheet = function() {
  var a = this.toString();
  goog.asserts.assert(/[@{]|^\s*$/.test(a), "value doesn't look like style sheet: " + a);
  return goog.html.uncheckedconversions.safeStyleSheetFromStringKnownToSatisfyTypeContract(goog.string.Const.from("Soy SanitizedCss produces SafeStyleSheet-contract-compliant value."), a);
};
goog.soy.REQUIRE_STRICT_AUTOESCAPE = !1;
goog.soy.renderHtml = function(a, b) {
  a.innerHTML = goog.soy.ensureTemplateOutputHtml_(b);
};
goog.soy.renderElement = function(a, b, c, d) {
  goog.asserts.assert(b, "Soy template may not be null.");
  a.innerHTML = goog.soy.ensureTemplateOutputHtml_(b(c || goog.soy.defaultTemplateData_, void 0, d));
};
goog.soy.renderAsFragment = function(a, b, c, d) {
  goog.asserts.assert(a, "Soy template may not be null.");
  d = d || goog.dom.getDomHelper();
  a = a(b || goog.soy.defaultTemplateData_, void 0, c);
  b = goog.soy.ensureTemplateOutputHtml_(a);
  goog.soy.assertFirstTagValid_(b);
  a = a instanceof goog.soy.data.SanitizedContent ? a.toSafeHtml() : goog.html.legacyconversions.safeHtmlFromString(b);
  return d.safeHtmlToNode(a);
};
goog.soy.renderAsElement = function(a, b, c, d) {
  goog.asserts.assert(a, "Soy template may not be null.");
  return goog.soy.convertToElement_(a(b || goog.soy.defaultTemplateData_, void 0, c), d);
};
goog.soy.convertToElement = function(a, b) {
  return goog.soy.convertToElement_(a, b);
};
goog.soy.convertToElement_ = function(a, b) {
  b = (b || goog.dom.getDomHelper()).createElement("DIV");
  a = goog.soy.ensureTemplateOutputHtml_(a);
  goog.soy.assertFirstTagValid_(a);
  b.innerHTML = a;
  return 1 == b.childNodes.length && (a = b.firstChild, a.nodeType == goog.dom.NodeType.ELEMENT) ? a : b;
};
goog.soy.ensureTemplateOutputHtml_ = function(a) {
  if (!goog.soy.REQUIRE_STRICT_AUTOESCAPE && !goog.isObject(a)) {
    return String(a);
  }
  if (a instanceof goog.soy.data.SanitizedContent) {
    var b = goog.soy.data.SanitizedContentKind;
    if (a.contentKind === b.HTML) {
      return goog.asserts.assertString(a.getContent());
    }
    if (a.contentKind === b.TEXT) {
      return goog.string.htmlEscape(a.getContent());
    }
  }
  goog.asserts.fail("Soy template output is unsafe for use as HTML: " + a);
  return "zSoyz";
};
goog.soy.assertFirstTagValid_ = function(a) {
  if (goog.asserts.ENABLE_ASSERTS) {
    var b = a.match(goog.soy.INVALID_TAG_TO_RENDER_);
    goog.asserts.assert(!b, "This template starts with a %s, which cannot be a child of a <div>, as required by soy internals. Consider using goog.soy.renderElement instead.\nTemplate output: %s", b && b[0], a);
  }
};
goog.soy.INVALID_TAG_TO_RENDER_ = /^<(body|caption|col|colgroup|head|html|tr|td|th|tbody|thead|tfoot)>/i;
goog.soy.defaultTemplateData_ = {};
goog.html.sanitizer = {};
goog.html.sanitizer.AttributeWhitelist = {"* ARIA-CHECKED":!0, "* ARIA-COLCOUNT":!0, "* ARIA-COLINDEX":!0, "* ARIA-DESCRIBEDBY":!0, "* ARIA-DISABLED":!0, "* ARIA-LABEL":!0, "* ARIA-LABELLEDBY":!0, "* ARIA-READONLY":!0, "* ARIA-REQUIRED":!0, "* ARIA-ROWCOUNT":!0, "* ARIA-ROWINDEX":!0, "* ARIA-SELECTED":!0, "* ABBR":!0, "* ACCEPT":!0, "* ACCESSKEY":!0, "* ALIGN":!0, "* ALT":!0, "* AUTOCOMPLETE":!0, "* AXIS":!0, "* BGCOLOR":!0, "* BORDER":!0, "* CELLPADDING":!0, "* CELLSPACING":!0, "* CHAROFF":!0, "* CHAR":!0, 
"* CHECKED":!0, "* CLEAR":!0, "* COLOR":!0, "* COLSPAN":!0, "* COLS":!0, "* COMPACT":!0, "* COORDS":!0, "* DATETIME":!0, "* DIR":!0, "* DISABLED":!0, "* ENCTYPE":!0, "* FACE":!0, "* FRAME":!0, "* HEIGHT":!0, "* HREFLANG":!0, "* HSPACE":!0, "* ISMAP":!0, "* LABEL":!0, "* LANG":!0, "* MAXLENGTH":!0, "* METHOD":!0, "* MULTIPLE":!0, "* NOHREF":!0, "* NOSHADE":!0, "* NOWRAP":!0, "* READONLY":!0, "* REL":!0, "* REV":!0, "* ROLE":!0, "* ROWSPAN":!0, "* ROWS":!0, "* RULES":!0, "* SCOPE":!0, "* SELECTED":!0, 
"* SHAPE":!0, "* SIZE":!0, "* SPAN":!0, "* START":!0, "* SUMMARY":!0, "* TABINDEX":!0, "* TITLE":!0, "* TYPE":!0, "* VALIGN":!0, "* VALUE":!0, "* VSPACE":!0, "* WIDTH":!0};
goog.html.sanitizer.AttributeSanitizedWhitelist = {"* USEMAP":!0, "* ACTION":!0, "* CITE":!0, "* HREF":!0, "* LONGDESC":!0, "* SRC":!0, "LINK HREF":!0, "* FOR":!0, "* HEADERS":!0, "* NAME":!0, "A TARGET":!0, "* CLASS":!0, "* ID":!0, "* STYLE":!0};
goog.html.CssSpecificity = {};
var module$contents$goog$html$CssSpecificity_specificityCache = {};
function module$contents$goog$html$CssSpecificity_getSpecificity(a) {
  if (goog.userAgent.product.IE && !goog.userAgent.isVersionOrHigher(9)) {
    return [0, 0, 0, 0];
  }
  var b = module$contents$goog$html$CssSpecificity_specificityCache.hasOwnProperty(a) ? module$contents$goog$html$CssSpecificity_specificityCache[a] : null;
  if (b) {
    return b;
  }
  65536 < Object.keys(module$contents$goog$html$CssSpecificity_specificityCache).length && (module$contents$goog$html$CssSpecificity_specificityCache = {});
  b = module$contents$goog$html$CssSpecificity_calculateSpecificity(a);
  return module$contents$goog$html$CssSpecificity_specificityCache[a] = b;
}
function module$contents$goog$html$CssSpecificity_replaceWithEmptyText(a, b, c, d) {
  return a.replace(c, function(a) {
    b[d] += 1;
    return Array(a.length + 1).join(" ");
  });
}
function module$contents$goog$html$CssSpecificity_replaceWithPlainText(a, b) {
  return a.replace(b, function(a) {
    return Array(a.length + 1).join("A");
  });
}
function module$contents$goog$html$CssSpecificity_calculateSpecificity(a) {
  var b = [0, 0, 0, 0];
  a = module$contents$goog$html$CssSpecificity_replaceWithPlainText(a, /\\[0-9A-Fa-f]{6}\s?/g);
  a = module$contents$goog$html$CssSpecificity_replaceWithPlainText(a, /\\[0-9A-Fa-f]{1,5}\s/g);
  a = module$contents$goog$html$CssSpecificity_replaceWithPlainText(a, /\\./g);
  a = a.replace(/:not\(([^\)]*)\)/g, "     $1 ");
  a = a.replace(/{[^]*/gm, "");
  a = module$contents$goog$html$CssSpecificity_replaceWithEmptyText(a, b, /(\[[^\]]+\])/g, 2);
  a = module$contents$goog$html$CssSpecificity_replaceWithEmptyText(a, b, /(#[^\#\s\+>~\.\[:]+)/g, 1);
  a = module$contents$goog$html$CssSpecificity_replaceWithEmptyText(a, b, /(\.[^\s\+>~\.\[:]+)/g, 2);
  a = module$contents$goog$html$CssSpecificity_replaceWithEmptyText(a, b, /(::[^\s\+>~\.\[:]+|:first-line|:first-letter|:before|:after)/gi, 3);
  a = module$contents$goog$html$CssSpecificity_replaceWithEmptyText(a, b, /(:[\w-]+\([^\)]*\))/gi, 2);
  a = module$contents$goog$html$CssSpecificity_replaceWithEmptyText(a, b, /(:[^\s\+>~\.\[:]+)/g, 2);
  a = a.replace(/[\*\s\+>~]/g, " ");
  a = a.replace(/[#\.]/g, " ");
  module$contents$goog$html$CssSpecificity_replaceWithEmptyText(a, b, /([^\s\+>~\.\[:]+)/g, 3);
  return b;
}
goog.html.CssSpecificity.getSpecificity = module$contents$goog$html$CssSpecificity_getSpecificity;
goog.html.sanitizer.noclobber = {};
function module$contents$goog$html$sanitizer$noclobber_getterOrNull(a, b) {
  a = goog.global[a];
  return a && a.prototype ? (b = Object.getOwnPropertyDescriptor(a.prototype, b)) && b.get || null : null;
}
function module$contents$goog$html$sanitizer$noclobber_prototypeMethodOrNull(a, b) {
  return (a = goog.global[a]) && a.prototype && a.prototype[b] || null;
}
var module$contents$goog$html$sanitizer$noclobber_Methods = {ATTRIBUTES_GETTER:module$contents$goog$html$sanitizer$noclobber_getterOrNull("Element", "attributes") || module$contents$goog$html$sanitizer$noclobber_getterOrNull("Node", "attributes"), HAS_ATTRIBUTE:module$contents$goog$html$sanitizer$noclobber_prototypeMethodOrNull("Element", "hasAttribute"), GET_ATTRIBUTE:module$contents$goog$html$sanitizer$noclobber_prototypeMethodOrNull("Element", "getAttribute"), SET_ATTRIBUTE:module$contents$goog$html$sanitizer$noclobber_prototypeMethodOrNull("Element", 
"setAttribute"), REMOVE_ATTRIBUTE:module$contents$goog$html$sanitizer$noclobber_prototypeMethodOrNull("Element", "removeAttribute"), INNER_HTML_GETTER:module$contents$goog$html$sanitizer$noclobber_getterOrNull("Element", "innerHTML") || module$contents$goog$html$sanitizer$noclobber_getterOrNull("HTMLElement", "innerHTML"), GET_ELEMENTS_BY_TAG_NAME:module$contents$goog$html$sanitizer$noclobber_prototypeMethodOrNull("Element", "getElementsByTagName"), MATCHES:module$contents$goog$html$sanitizer$noclobber_prototypeMethodOrNull("Element", 
"matches") || module$contents$goog$html$sanitizer$noclobber_prototypeMethodOrNull("Element", "msMatchesSelector"), NODE_NAME_GETTER:module$contents$goog$html$sanitizer$noclobber_getterOrNull("Node", "nodeName"), NODE_TYPE_GETTER:module$contents$goog$html$sanitizer$noclobber_getterOrNull("Node", "nodeType"), PARENT_NODE_GETTER:module$contents$goog$html$sanitizer$noclobber_getterOrNull("Node", "parentNode"), CHILD_NODES_GETTER:module$contents$goog$html$sanitizer$noclobber_getterOrNull("Node", "childNodes"), 
APPEND_CHILD:module$contents$goog$html$sanitizer$noclobber_prototypeMethodOrNull("Node", "appendChild"), STYLE_GETTER:module$contents$goog$html$sanitizer$noclobber_getterOrNull("HTMLElement", "style") || module$contents$goog$html$sanitizer$noclobber_getterOrNull("Element", "style"), SHEET_GETTER:module$contents$goog$html$sanitizer$noclobber_getterOrNull("HTMLStyleElement", "sheet"), GET_PROPERTY_VALUE:module$contents$goog$html$sanitizer$noclobber_prototypeMethodOrNull("CSSStyleDeclaration", "getPropertyValue"), 
SET_PROPERTY:module$contents$goog$html$sanitizer$noclobber_prototypeMethodOrNull("CSSStyleDeclaration", "setProperty")};
function module$contents$goog$html$sanitizer$noclobber_genericPropertyGet(a, b, c, d) {
  if (a) {
    return a.apply(b);
  }
  a = b[c];
  if (!d(a)) {
    throw Error("Clobbering detected");
  }
  return a;
}
function module$contents$goog$html$sanitizer$noclobber_genericMethodCall(a, b, c, d) {
  if (a) {
    return a.apply(b, d);
  }
  if (goog.userAgent.product.IE && 10 > document.documentMode) {
    if (!b[c].call) {
      throw Error("IE Clobbering detected");
    }
  } else {
    if ("function" != typeof b[c]) {
      throw Error("Clobbering detected");
    }
  }
  return b[c].apply(b, d);
}
function module$contents$goog$html$sanitizer$noclobber_getElementAttributes(a) {
  return module$contents$goog$html$sanitizer$noclobber_genericPropertyGet(module$contents$goog$html$sanitizer$noclobber_Methods.ATTRIBUTES_GETTER, a, "attributes", function(a) {
    return a instanceof NamedNodeMap;
  });
}
function module$contents$goog$html$sanitizer$noclobber_hasElementAttribute(a, b) {
  return module$contents$goog$html$sanitizer$noclobber_genericMethodCall(module$contents$goog$html$sanitizer$noclobber_Methods.HAS_ATTRIBUTE, a, "hasAttribute", [b]);
}
function module$contents$goog$html$sanitizer$noclobber_getElementAttribute(a, b) {
  return module$contents$goog$html$sanitizer$noclobber_genericMethodCall(module$contents$goog$html$sanitizer$noclobber_Methods.GET_ATTRIBUTE, a, "getAttribute", [b]) || null;
}
function module$contents$goog$html$sanitizer$noclobber_setElementAttribute(a, b, c) {
  try {
    module$contents$goog$html$sanitizer$noclobber_genericMethodCall(module$contents$goog$html$sanitizer$noclobber_Methods.SET_ATTRIBUTE, a, "setAttribute", [b, c]);
  } catch (d) {
    if (-1 == d.message.indexOf("A security problem occurred")) {
      throw d;
    }
  }
}
function module$contents$goog$html$sanitizer$noclobber_removeElementAttribute(a, b) {
  module$contents$goog$html$sanitizer$noclobber_genericMethodCall(module$contents$goog$html$sanitizer$noclobber_Methods.REMOVE_ATTRIBUTE, a, "removeAttribute", [b]);
}
function module$contents$goog$html$sanitizer$noclobber_getElementInnerHTML(a) {
  return module$contents$goog$html$sanitizer$noclobber_genericPropertyGet(module$contents$goog$html$sanitizer$noclobber_Methods.INNER_HTML_GETTER, a, "innerHTML", function(a) {
    return "string" == typeof a;
  });
}
function module$contents$goog$html$sanitizer$noclobber_getElementStyle(a) {
  module$contents$goog$html$sanitizer$noclobber_assertHTMLElement(a);
  return module$contents$goog$html$sanitizer$noclobber_genericPropertyGet(module$contents$goog$html$sanitizer$noclobber_Methods.STYLE_GETTER, a, "style", function(a) {
    return a instanceof CSSStyleDeclaration;
  });
}
function module$contents$goog$html$sanitizer$noclobber_assertHTMLElement(a) {
  if (goog.asserts.ENABLE_ASSERTS && !(a instanceof HTMLElement)) {
    throw Error("Not an HTMLElement");
  }
}
function module$contents$goog$html$sanitizer$noclobber_getElementsByTagName(a, b) {
  return Array.from(module$contents$goog$html$sanitizer$noclobber_genericMethodCall(module$contents$goog$html$sanitizer$noclobber_Methods.GET_ELEMENTS_BY_TAG_NAME, a, "getElementsByTagName", [b]));
}
function module$contents$goog$html$sanitizer$noclobber_getElementStyleSheet(a) {
  module$contents$goog$html$sanitizer$noclobber_assertHTMLElement(a);
  return module$contents$goog$html$sanitizer$noclobber_genericPropertyGet(module$contents$goog$html$sanitizer$noclobber_Methods.SHEET_GETTER, a, "sheet", function(a) {
    return a instanceof CSSStyleSheet;
  });
}
function module$contents$goog$html$sanitizer$noclobber_elementMatches(a, b) {
  return module$contents$goog$html$sanitizer$noclobber_genericMethodCall(module$contents$goog$html$sanitizer$noclobber_Methods.MATCHES, a, a.matches ? "matches" : "msMatchesSelector", [b]);
}
function module$contents$goog$html$sanitizer$noclobber_assertNodeIsElement(a) {
  goog.asserts.ENABLE_ASSERTS && !module$contents$goog$html$sanitizer$noclobber_isNodeElement(a) && goog.asserts.fail("Expected Node of type Element but got Node of type %s", module$contents$goog$html$sanitizer$noclobber_getNodeType(a));
  return a;
}
function module$contents$goog$html$sanitizer$noclobber_isNodeElement(a) {
  return module$contents$goog$html$sanitizer$noclobber_getNodeType(a) == goog.dom.NodeType.ELEMENT;
}
function module$contents$goog$html$sanitizer$noclobber_getNodeName(a) {
  return module$contents$goog$html$sanitizer$noclobber_genericPropertyGet(module$contents$goog$html$sanitizer$noclobber_Methods.NODE_NAME_GETTER, a, "nodeName", function(a) {
    return "string" == typeof a;
  });
}
function module$contents$goog$html$sanitizer$noclobber_getNodeType(a) {
  return module$contents$goog$html$sanitizer$noclobber_genericPropertyGet(module$contents$goog$html$sanitizer$noclobber_Methods.NODE_TYPE_GETTER, a, "nodeType", function(a) {
    return "number" == typeof a;
  });
}
function module$contents$goog$html$sanitizer$noclobber_getParentNode(a) {
  return module$contents$goog$html$sanitizer$noclobber_genericPropertyGet(module$contents$goog$html$sanitizer$noclobber_Methods.PARENT_NODE_GETTER, a, "parentNode", function(a) {
    return !(a && "string" == typeof a.name && a.name && "parentnode" == a.name.toLowerCase());
  });
}
function module$contents$goog$html$sanitizer$noclobber_getChildNodes(a) {
  return module$contents$goog$html$sanitizer$noclobber_genericPropertyGet(module$contents$goog$html$sanitizer$noclobber_Methods.CHILD_NODES_GETTER, a, "childNodes", function(a) {
    return a instanceof NodeList;
  });
}
function module$contents$goog$html$sanitizer$noclobber_appendNodeChild(a, b) {
  return module$contents$goog$html$sanitizer$noclobber_genericMethodCall(module$contents$goog$html$sanitizer$noclobber_Methods.APPEND_CHILD, a, "appendChild", [b]);
}
function module$contents$goog$html$sanitizer$noclobber_getCssPropertyValue(a, b) {
  return module$contents$goog$html$sanitizer$noclobber_genericMethodCall(module$contents$goog$html$sanitizer$noclobber_Methods.GET_PROPERTY_VALUE, a, a.getPropertyValue ? "getPropertyValue" : "getAttribute", [b]) || "";
}
function module$contents$goog$html$sanitizer$noclobber_setCssProperty(a, b, c) {
  module$contents$goog$html$sanitizer$noclobber_genericMethodCall(module$contents$goog$html$sanitizer$noclobber_Methods.SET_PROPERTY, a, a.setProperty ? "setProperty" : "setAttribute", [b, c]);
}
goog.html.sanitizer.noclobber.getElementAttributes = module$contents$goog$html$sanitizer$noclobber_getElementAttributes;
goog.html.sanitizer.noclobber.hasElementAttribute = module$contents$goog$html$sanitizer$noclobber_hasElementAttribute;
goog.html.sanitizer.noclobber.getElementAttribute = module$contents$goog$html$sanitizer$noclobber_getElementAttribute;
goog.html.sanitizer.noclobber.setElementAttribute = module$contents$goog$html$sanitizer$noclobber_setElementAttribute;
goog.html.sanitizer.noclobber.removeElementAttribute = module$contents$goog$html$sanitizer$noclobber_removeElementAttribute;
goog.html.sanitizer.noclobber.getElementInnerHTML = module$contents$goog$html$sanitizer$noclobber_getElementInnerHTML;
goog.html.sanitizer.noclobber.getElementStyle = module$contents$goog$html$sanitizer$noclobber_getElementStyle;
goog.html.sanitizer.noclobber.getElementsByTagName = module$contents$goog$html$sanitizer$noclobber_getElementsByTagName;
goog.html.sanitizer.noclobber.getElementStyleSheet = module$contents$goog$html$sanitizer$noclobber_getElementStyleSheet;
goog.html.sanitizer.noclobber.elementMatches = module$contents$goog$html$sanitizer$noclobber_elementMatches;
goog.html.sanitizer.noclobber.assertNodeIsElement = module$contents$goog$html$sanitizer$noclobber_assertNodeIsElement;
goog.html.sanitizer.noclobber.isNodeElement = module$contents$goog$html$sanitizer$noclobber_isNodeElement;
goog.html.sanitizer.noclobber.getNodeName = module$contents$goog$html$sanitizer$noclobber_getNodeName;
goog.html.sanitizer.noclobber.getNodeType = module$contents$goog$html$sanitizer$noclobber_getNodeType;
goog.html.sanitizer.noclobber.getParentNode = module$contents$goog$html$sanitizer$noclobber_getParentNode;
goog.html.sanitizer.noclobber.getChildNodes = module$contents$goog$html$sanitizer$noclobber_getChildNodes;
goog.html.sanitizer.noclobber.appendNodeChild = module$contents$goog$html$sanitizer$noclobber_appendNodeChild;
goog.html.sanitizer.noclobber.getCssPropertyValue = module$contents$goog$html$sanitizer$noclobber_getCssPropertyValue;
goog.html.sanitizer.noclobber.setCssProperty = module$contents$goog$html$sanitizer$noclobber_setCssProperty;
goog.html.sanitizer.noclobber.Methods = module$contents$goog$html$sanitizer$noclobber_Methods;
goog.html.sanitizer.CssSanitizer = {};
goog.html.sanitizer.CssSanitizer.NORM_URL_REGEXP_ = /[\n\f\r"'()*<>]/g;
goog.html.sanitizer.CssSanitizer.NORM_URL_REPLACEMENTS_ = {"\n":"%0a", "\f":"%0c", "\r":"%0d", '"':"%22", "'":"%27", "(":"%28", ")":"%29", "*":"%2a", "<":"%3c", ">":"%3e"};
goog.html.sanitizer.CssSanitizer.SELECTOR_REGEX_ = goog.userAgent.IE && 10 > document.documentMode ? null : /\s*([^\s'",]+[^'",]*(('([^'\r\n\f\\]|\\[^])*')|("([^"\r\n\f\\]|\\[^])*")|[^'",])*)/g;
goog.html.sanitizer.CssSanitizer.normalizeUrlChar_ = function(a) {
  return goog.html.sanitizer.CssSanitizer.NORM_URL_REPLACEMENTS_[a] || null;
};
goog.html.sanitizer.CssSanitizer.getSafeUri_ = function(a, b, c) {
  return c ? (a = c(a, b)) && goog.html.SafeUrl.unwrap(a) != goog.html.SafeUrl.INNOCUOUS_STRING ? 'url("' + goog.html.SafeUrl.unwrap(a).replace(goog.html.sanitizer.CssSanitizer.NORM_URL_REGEXP_, goog.html.sanitizer.CssSanitizer.normalizeUrlChar_) + '")' : null : null;
};
goog.html.sanitizer.CssSanitizer.FUNCTION_ARGUMENTS_BEGIN_ = "(";
goog.html.sanitizer.CssSanitizer.FUNCTION_ARGUMENTS_END_ = ")";
goog.html.sanitizer.CssSanitizer.ALLOWED_FUNCTIONS_ = "rgb rgba alpha rect image linear-gradient radial-gradient repeating-linear-gradient repeating-radial-gradient cubic-bezier matrix perspective rotate rotate3d rotatex rotatey steps rotatez scale scale3d scalex scaley scalez skew skewx skewy translate translate3d translatex translatey translatez".split(" ");
goog.html.sanitizer.CssSanitizer.withoutVendorPrefix_ = function(a) {
  return a.replace(/^-(?:apple|css|epub|khtml|moz|mso?|o|rim|wap|webkit|xv)-(?=[a-z])/i, "");
};
goog.html.sanitizer.CssSanitizer.sanitizeProperty_ = function(a, b, c) {
  b = goog.string.trim(b);
  if ("" == b) {
    return null;
  }
  if (goog.string.caseInsensitiveStartsWith(b, "url(")) {
    if (!c) {
      return null;
    }
    b = goog.string.stripQuotes(b.substring(4, b.length - 1), "\"'");
    return goog.html.sanitizer.CssSanitizer.getSafeUri_(b, a, c);
  }
  return 0 < b.indexOf("(") ? 1 < goog.string.countOf(b, goog.html.sanitizer.CssSanitizer.FUNCTION_ARGUMENTS_BEGIN_) || !goog.array.contains(goog.html.sanitizer.CssSanitizer.ALLOWED_FUNCTIONS_, b.substring(0, b.indexOf(goog.html.sanitizer.CssSanitizer.FUNCTION_ARGUMENTS_BEGIN_)).toLowerCase()) || !goog.string.endsWith(b, goog.html.sanitizer.CssSanitizer.FUNCTION_ARGUMENTS_END_) ? null : b : b;
};
goog.html.sanitizer.CssSanitizer.sanitizeStyleSheet_ = function(a, b, c) {
  var d = [];
  a = goog.html.sanitizer.CssSanitizer.getOnlyStyleRules_(goog.array.toArray(a.cssRules));
  goog.array.forEach(a, function(a) {
    if (b && !/[a-zA-Z][\w-:\.]*/.test(b)) {
      throw Error("Invalid container id");
    }
    if (!(b && goog.userAgent.product.IE && 10 == document.documentMode && /\\['"]/.test(a.selectorText))) {
      var e = b ? a.selectorText.replace(goog.html.sanitizer.CssSanitizer.SELECTOR_REGEX_, "#" + b + " $1") : a.selectorText;
      d.push(goog.html.SafeStyleSheet.createRule(e, goog.html.sanitizer.CssSanitizer.sanitizeInlineStyle(a.style, c)));
    }
  });
  return goog.html.SafeStyleSheet.concat(d);
};
goog.html.sanitizer.CssSanitizer.getOnlyStyleRules_ = function(a) {
  return goog.array.filter(a, function(a) {
    return a instanceof CSSStyleRule || a.type == CSSRule.STYLE_RULE;
  });
};
goog.html.sanitizer.CssSanitizer.sanitizeStyleSheetString = function(a, b, c) {
  a = goog.html.sanitizer.CssSanitizer.safeParseHtmlAndGetInertElement("<style>" + a + "</style>");
  return null == a ? goog.html.SafeStyleSheet.EMPTY : goog.html.sanitizer.CssSanitizer.sanitizeStyleSheet_(a.sheet, void 0 != b ? b : null, c);
};
goog.html.sanitizer.CssSanitizer.safeParseHtmlAndGetInertElement = function(a) {
  return goog.userAgent.IE && !goog.userAgent.isVersionOrHigher(10) || "function" != typeof goog.global.DOMParser ? null : (new DOMParser).parseFromString("<html><head></head><body>" + a + "</body></html>", "text/html").body.children[0];
};
goog.html.sanitizer.CssSanitizer.sanitizeInlineStyle = function(a, b) {
  if (!a) {
    return goog.html.SafeStyle.EMPTY;
  }
  for (var c = document.createElement("div").style, d = goog.html.sanitizer.CssSanitizer.getCssPropNames_(a), e = 0; e < d.length; e++) {
    var f = goog.html.sanitizer.CssSanitizer.withoutVendorPrefix_(d[e]);
    if (!goog.html.sanitizer.CssSanitizer.isDisallowedPropertyName_(f)) {
      var g = module$contents$goog$html$sanitizer$noclobber_getCssPropertyValue(a, f);
      g = goog.html.sanitizer.CssSanitizer.sanitizeProperty_(f, g, b);
      null != g && module$contents$goog$html$sanitizer$noclobber_setCssProperty(c, f, g);
    }
  }
  return goog.html.uncheckedconversions.safeStyleFromStringKnownToSatisfyTypeContract(goog.string.Const.from("Output of CSS sanitizer"), c.cssText || "");
};
goog.html.sanitizer.CssSanitizer.sanitizeInlineStyleString = function(a, b) {
  if (goog.userAgent.IE && 10 > document.documentMode) {
    return new goog.html.SafeStyle;
  }
  var c = goog.html.sanitizer.CssSanitizer.createInertDocument_().createElement("DIV");
  c.style.cssText = a;
  return goog.html.sanitizer.CssSanitizer.sanitizeInlineStyle(c.style, b);
};
goog.html.sanitizer.CssSanitizer.inlineStyleRules = function(a) {
  var b = module$contents$goog$html$sanitizer$noclobber_getElementsByTagName(a, "STYLE"), c = goog.array.concatMap(b, function(a) {
    return goog.array.toArray(module$contents$goog$html$sanitizer$noclobber_getElementStyleSheet(a).cssRules);
  });
  c = goog.html.sanitizer.CssSanitizer.getOnlyStyleRules_(c);
  c.sort(function(a, b) {
    a = module$contents$goog$html$CssSpecificity_getSpecificity(a.selectorText);
    b = module$contents$goog$html$CssSpecificity_getSpecificity(b.selectorText);
    return -goog.array.compare3(a, b);
  });
  a = document.createTreeWalker(a, NodeFilter.SHOW_ELEMENT, null, !1);
  for (var d; d = a.nextNode();) {
    goog.array.forEach(c, function(a) {
      module$contents$goog$html$sanitizer$noclobber_elementMatches(d, a.selectorText) && a.style && goog.html.sanitizer.CssSanitizer.mergeStyleDeclarations_(d, a.style);
    });
  }
  goog.array.forEach(b, goog.dom.removeNode);
};
goog.html.sanitizer.CssSanitizer.mergeStyleDeclarations_ = function(a, b) {
  var c = goog.html.sanitizer.CssSanitizer.getCssPropNames_(a.style), d = goog.html.sanitizer.CssSanitizer.getCssPropNames_(b);
  goog.array.forEach(d, function(d) {
    if (!(0 <= c.indexOf(d))) {
      var e = module$contents$goog$html$sanitizer$noclobber_getCssPropertyValue(b, d);
      module$contents$goog$html$sanitizer$noclobber_setCssProperty(a.style, d, e);
    }
  });
};
goog.html.sanitizer.CssSanitizer.createInertDocument_ = function() {
  var a = document;
  "function" === typeof HTMLTemplateElement && (a = goog.dom.createElement("TEMPLATE").content.ownerDocument);
  return a.implementation.createHTMLDocument("");
};
goog.html.sanitizer.CssSanitizer.getCssPropNames_ = function(a) {
  goog.isArrayLike(a) ? a = goog.array.toArray(a) : (a = goog.object.getKeys(a), goog.array.remove(a, "cssText"));
  return a;
};
goog.html.sanitizer.CssSanitizer.isDisallowedPropertyName_ = function(a) {
  return goog.string.startsWith(a, "--") || goog.string.startsWith(a, "var");
};
var module$contents$goog$html$sanitizer$ElementWeakMap_NATIVE_WEAKMAP_SUPPORTED = "undefined" != typeof WeakMap && -1 != WeakMap.toString().indexOf("[native code]"), module$contents$goog$html$sanitizer$ElementWeakMap_DATA_ATTRIBUTE_NAME_PREFIX = "data-elementweakmap-index-", module$contents$goog$html$sanitizer$ElementWeakMap_weakMapCount = 0, module$contents$goog$html$sanitizer$ElementWeakMap_ElementWeakMap = function() {
  this.keys_ = [];
  this.values_ = [];
  this.dataAttributeName_ = module$contents$goog$html$sanitizer$ElementWeakMap_DATA_ATTRIBUTE_NAME_PREFIX + module$contents$goog$html$sanitizer$ElementWeakMap_weakMapCount++;
};
module$contents$goog$html$sanitizer$ElementWeakMap_ElementWeakMap.prototype.set = function(a, b) {
  if (module$contents$goog$html$sanitizer$noclobber_hasElementAttribute(a, this.dataAttributeName_)) {
    var c = parseInt(module$contents$goog$html$sanitizer$noclobber_getElementAttribute(a, this.dataAttributeName_), 10);
    this.values_[c] = b;
  } else {
    c = this.values_.push(b) - 1, module$contents$goog$html$sanitizer$noclobber_setElementAttribute(a, this.dataAttributeName_, c.toString()), this.keys_.push(a);
  }
  return this;
};
module$contents$goog$html$sanitizer$ElementWeakMap_ElementWeakMap.prototype.get = function(a) {
  if (module$contents$goog$html$sanitizer$noclobber_hasElementAttribute(a, this.dataAttributeName_)) {
    return a = parseInt(module$contents$goog$html$sanitizer$noclobber_getElementAttribute(a, this.dataAttributeName_), 10), this.values_[a];
  }
};
module$contents$goog$html$sanitizer$ElementWeakMap_ElementWeakMap.prototype.clear = function() {
  this.keys_.forEach(function(a) {
    module$contents$goog$html$sanitizer$noclobber_removeElementAttribute(a, this.dataAttributeName_);
  }, this);
  this.keys_ = [];
  this.values_ = [];
};
module$contents$goog$html$sanitizer$ElementWeakMap_ElementWeakMap.newWeakMap = function() {
  return module$contents$goog$html$sanitizer$ElementWeakMap_NATIVE_WEAKMAP_SUPPORTED ? new WeakMap : new module$contents$goog$html$sanitizer$ElementWeakMap_ElementWeakMap;
};
goog.html.sanitizer.ElementWeakMap = module$contents$goog$html$sanitizer$ElementWeakMap_ElementWeakMap;
goog.debug.LogRecord = function(a, b, c, d, e) {
  this.reset(a, b, c, d, e);
};
goog.debug.LogRecord.prototype.sequenceNumber_ = 0;
goog.debug.LogRecord.prototype.exception_ = null;
goog.debug.LogRecord.ENABLE_SEQUENCE_NUMBERS = !0;
goog.debug.LogRecord.nextSequenceNumber_ = 0;
goog.debug.LogRecord.prototype.reset = function(a, b, c, d, e) {
  goog.debug.LogRecord.ENABLE_SEQUENCE_NUMBERS && (this.sequenceNumber_ = "number" == typeof e ? e : goog.debug.LogRecord.nextSequenceNumber_++);
  this.time_ = d || goog.now();
  this.level_ = a;
  this.msg_ = b;
  this.loggerName_ = c;
  delete this.exception_;
};
goog.debug.LogRecord.prototype.getLoggerName = function() {
  return this.loggerName_;
};
goog.debug.LogRecord.prototype.getException = function() {
  return this.exception_;
};
goog.debug.LogRecord.prototype.setException = function(a) {
  this.exception_ = a;
};
goog.debug.LogRecord.prototype.setLoggerName = function(a) {
  this.loggerName_ = a;
};
goog.debug.LogRecord.prototype.getLevel = function() {
  return this.level_;
};
goog.debug.LogRecord.prototype.setLevel = function(a) {
  this.level_ = a;
};
goog.debug.LogRecord.prototype.getMessage = function() {
  return this.msg_;
};
goog.debug.LogRecord.prototype.setMessage = function(a) {
  this.msg_ = a;
};
goog.debug.LogRecord.prototype.getMillis = function() {
  return this.time_;
};
goog.debug.LogRecord.prototype.setMillis = function(a) {
  this.time_ = a;
};
goog.debug.LogRecord.prototype.getSequenceNumber = function() {
  return this.sequenceNumber_;
};
goog.debug.LogBuffer = function() {
  goog.asserts.assert(goog.debug.LogBuffer.isBufferingEnabled(), "Cannot use goog.debug.LogBuffer without defining goog.debug.LogBuffer.CAPACITY.");
  this.clear();
};
goog.debug.LogBuffer.getInstance = function() {
  goog.debug.LogBuffer.instance_ || (goog.debug.LogBuffer.instance_ = new goog.debug.LogBuffer);
  return goog.debug.LogBuffer.instance_;
};
goog.debug.LogBuffer.CAPACITY = 0;
goog.debug.LogBuffer.prototype.addRecord = function(a, b, c) {
  var d = (this.curIndex_ + 1) % goog.debug.LogBuffer.CAPACITY;
  this.curIndex_ = d;
  if (this.isFull_) {
    return d = this.buffer_[d], d.reset(a, b, c), d;
  }
  this.isFull_ = d == goog.debug.LogBuffer.CAPACITY - 1;
  return this.buffer_[d] = new goog.debug.LogRecord(a, b, c);
};
goog.debug.LogBuffer.isBufferingEnabled = function() {
  return 0 < goog.debug.LogBuffer.CAPACITY;
};
goog.debug.LogBuffer.prototype.clear = function() {
  this.buffer_ = Array(goog.debug.LogBuffer.CAPACITY);
  this.curIndex_ = -1;
  this.isFull_ = !1;
};
goog.debug.LogBuffer.prototype.forEachRecord = function(a) {
  var b = this.buffer_;
  if (b[0]) {
    var c = this.curIndex_, d = this.isFull_ ? c : -1;
    do {
      d = (d + 1) % goog.debug.LogBuffer.CAPACITY, a(b[d]);
    } while (d != c);
  }
};
goog.debug.Logger = function(a) {
  this.name_ = a;
  this.handlers_ = this.children_ = this.level_ = this.parent_ = null;
};
goog.debug.Logger.ROOT_LOGGER_NAME = "";
goog.debug.Logger.ENABLE_HIERARCHY = !0;
goog.debug.Logger.ENABLE_PROFILER_LOGGING = !1;
goog.debug.Logger.ENABLE_HIERARCHY || (goog.debug.Logger.rootHandlers_ = []);
goog.debug.Logger.Level = function(a, b) {
  this.name = a;
  this.value = b;
};
goog.debug.Logger.Level.prototype.toString = function() {
  return this.name;
};
goog.debug.Logger.Level.OFF = new goog.debug.Logger.Level("OFF", Infinity);
goog.debug.Logger.Level.SHOUT = new goog.debug.Logger.Level("SHOUT", 1200);
goog.debug.Logger.Level.SEVERE = new goog.debug.Logger.Level("SEVERE", 1000);
goog.debug.Logger.Level.WARNING = new goog.debug.Logger.Level("WARNING", 900);
goog.debug.Logger.Level.INFO = new goog.debug.Logger.Level("INFO", 800);
goog.debug.Logger.Level.CONFIG = new goog.debug.Logger.Level("CONFIG", 700);
goog.debug.Logger.Level.FINE = new goog.debug.Logger.Level("FINE", 500);
goog.debug.Logger.Level.FINER = new goog.debug.Logger.Level("FINER", 400);
goog.debug.Logger.Level.FINEST = new goog.debug.Logger.Level("FINEST", 300);
goog.debug.Logger.Level.ALL = new goog.debug.Logger.Level("ALL", 0);
goog.debug.Logger.Level.PREDEFINED_LEVELS = [goog.debug.Logger.Level.OFF, goog.debug.Logger.Level.SHOUT, goog.debug.Logger.Level.SEVERE, goog.debug.Logger.Level.WARNING, goog.debug.Logger.Level.INFO, goog.debug.Logger.Level.CONFIG, goog.debug.Logger.Level.FINE, goog.debug.Logger.Level.FINER, goog.debug.Logger.Level.FINEST, goog.debug.Logger.Level.ALL];
goog.debug.Logger.Level.predefinedLevelsCache_ = null;
goog.debug.Logger.Level.createPredefinedLevelsCache_ = function() {
  goog.debug.Logger.Level.predefinedLevelsCache_ = {};
  for (var a = 0, b; b = goog.debug.Logger.Level.PREDEFINED_LEVELS[a]; a++) {
    goog.debug.Logger.Level.predefinedLevelsCache_[b.value] = b, goog.debug.Logger.Level.predefinedLevelsCache_[b.name] = b;
  }
};
goog.debug.Logger.Level.getPredefinedLevel = function(a) {
  goog.debug.Logger.Level.predefinedLevelsCache_ || goog.debug.Logger.Level.createPredefinedLevelsCache_();
  return goog.debug.Logger.Level.predefinedLevelsCache_[a] || null;
};
goog.debug.Logger.Level.getPredefinedLevelByValue = function(a) {
  goog.debug.Logger.Level.predefinedLevelsCache_ || goog.debug.Logger.Level.createPredefinedLevelsCache_();
  if (a in goog.debug.Logger.Level.predefinedLevelsCache_) {
    return goog.debug.Logger.Level.predefinedLevelsCache_[a];
  }
  for (var b = 0; b < goog.debug.Logger.Level.PREDEFINED_LEVELS.length; ++b) {
    var c = goog.debug.Logger.Level.PREDEFINED_LEVELS[b];
    if (c.value <= a) {
      return c;
    }
  }
  return null;
};
goog.debug.Logger.getLogger = function(a) {
  return goog.debug.LogManager.getLogger(a);
};
goog.debug.Logger.logToProfilers = function(a) {
  if (goog.debug.Logger.ENABLE_PROFILER_LOGGING) {
    var b = goog.global.msWriteProfilerMark;
    b ? b(a) : (b = goog.global.console) && b.timeStamp && b.timeStamp(a);
  }
};
goog.debug.Logger.prototype.getName = function() {
  return this.name_;
};
goog.debug.Logger.prototype.addHandler = function(a) {
  goog.debug.LOGGING_ENABLED && (goog.debug.Logger.ENABLE_HIERARCHY ? (this.handlers_ || (this.handlers_ = []), this.handlers_.push(a)) : (goog.asserts.assert(!this.name_, "Cannot call addHandler on a non-root logger when goog.debug.Logger.ENABLE_HIERARCHY is false."), goog.debug.Logger.rootHandlers_.push(a)));
};
goog.debug.Logger.prototype.removeHandler = function(a) {
  if (goog.debug.LOGGING_ENABLED) {
    var b = goog.debug.Logger.ENABLE_HIERARCHY ? this.handlers_ : goog.debug.Logger.rootHandlers_;
    return !!b && goog.array.remove(b, a);
  }
  return !1;
};
goog.debug.Logger.prototype.getParent = function() {
  return this.parent_;
};
goog.debug.Logger.prototype.getChildren = function() {
  this.children_ || (this.children_ = {});
  return this.children_;
};
goog.debug.Logger.prototype.setLevel = function(a) {
  goog.debug.LOGGING_ENABLED && (goog.debug.Logger.ENABLE_HIERARCHY ? this.level_ = a : (goog.asserts.assert(!this.name_, "Cannot call setLevel() on a non-root logger when goog.debug.Logger.ENABLE_HIERARCHY is false."), goog.debug.Logger.rootLevel_ = a));
};
goog.debug.Logger.prototype.getLevel = function() {
  return goog.debug.LOGGING_ENABLED ? this.level_ : goog.debug.Logger.Level.OFF;
};
goog.debug.Logger.prototype.getEffectiveLevel = function() {
  if (!goog.debug.LOGGING_ENABLED) {
    return goog.debug.Logger.Level.OFF;
  }
  if (!goog.debug.Logger.ENABLE_HIERARCHY) {
    return goog.debug.Logger.rootLevel_;
  }
  if (this.level_) {
    return this.level_;
  }
  if (this.parent_) {
    return this.parent_.getEffectiveLevel();
  }
  goog.asserts.fail("Root logger has no level set.");
  return null;
};
goog.debug.Logger.prototype.isLoggable = function(a) {
  return goog.debug.LOGGING_ENABLED && a.value >= this.getEffectiveLevel().value;
};
goog.debug.Logger.prototype.log = function(a, b, c) {
  goog.debug.LOGGING_ENABLED && this.isLoggable(a) && (goog.isFunction(b) && (b = b()), this.doLogRecord_(this.getLogRecord(a, b, c)));
};
goog.debug.Logger.prototype.getLogRecord = function(a, b, c) {
  a = goog.debug.LogBuffer.isBufferingEnabled() ? goog.debug.LogBuffer.getInstance().addRecord(a, b, this.name_) : new goog.debug.LogRecord(a, String(b), this.name_);
  c && a.setException(c);
  return a;
};
goog.debug.Logger.prototype.shout = function(a, b) {
  goog.debug.LOGGING_ENABLED && this.log(goog.debug.Logger.Level.SHOUT, a, b);
};
goog.debug.Logger.prototype.severe = function(a, b) {
  goog.debug.LOGGING_ENABLED && this.log(goog.debug.Logger.Level.SEVERE, a, b);
};
goog.debug.Logger.prototype.warning = function(a, b) {
  goog.debug.LOGGING_ENABLED && this.log(goog.debug.Logger.Level.WARNING, a, b);
};
goog.debug.Logger.prototype.info = function(a, b) {
  goog.debug.LOGGING_ENABLED && this.log(goog.debug.Logger.Level.INFO, a, b);
};
goog.debug.Logger.prototype.config = function(a, b) {
  goog.debug.LOGGING_ENABLED && this.log(goog.debug.Logger.Level.CONFIG, a, b);
};
goog.debug.Logger.prototype.fine = function(a, b) {
  goog.debug.LOGGING_ENABLED && this.log(goog.debug.Logger.Level.FINE, a, b);
};
goog.debug.Logger.prototype.finer = function(a, b) {
  goog.debug.LOGGING_ENABLED && this.log(goog.debug.Logger.Level.FINER, a, b);
};
goog.debug.Logger.prototype.finest = function(a, b) {
  goog.debug.LOGGING_ENABLED && this.log(goog.debug.Logger.Level.FINEST, a, b);
};
goog.debug.Logger.prototype.logRecord = function(a) {
  goog.debug.LOGGING_ENABLED && this.isLoggable(a.getLevel()) && this.doLogRecord_(a);
};
goog.debug.Logger.prototype.doLogRecord_ = function(a) {
  goog.debug.Logger.ENABLE_PROFILER_LOGGING && goog.debug.Logger.logToProfilers("log:" + a.getMessage());
  if (goog.debug.Logger.ENABLE_HIERARCHY) {
    for (var b = this; b;) {
      b.callPublish_(a), b = b.getParent();
    }
  } else {
    b = 0;
    for (var c; c = goog.debug.Logger.rootHandlers_[b++];) {
      c(a);
    }
  }
};
goog.debug.Logger.prototype.callPublish_ = function(a) {
  if (this.handlers_) {
    for (var b = 0, c; c = this.handlers_[b]; b++) {
      c(a);
    }
  }
};
goog.debug.Logger.prototype.setParent_ = function(a) {
  this.parent_ = a;
};
goog.debug.Logger.prototype.addChild_ = function(a, b) {
  this.getChildren()[a] = b;
};
goog.debug.LogManager = {};
goog.debug.LogManager.loggers_ = {};
goog.debug.LogManager.rootLogger_ = null;
goog.debug.LogManager.initialize = function() {
  goog.debug.LogManager.rootLogger_ || (goog.debug.LogManager.rootLogger_ = new goog.debug.Logger(goog.debug.Logger.ROOT_LOGGER_NAME), goog.debug.LogManager.loggers_[goog.debug.Logger.ROOT_LOGGER_NAME] = goog.debug.LogManager.rootLogger_, goog.debug.LogManager.rootLogger_.setLevel(goog.debug.Logger.Level.CONFIG));
};
goog.debug.LogManager.getLoggers = function() {
  return goog.debug.LogManager.loggers_;
};
goog.debug.LogManager.getRoot = function() {
  goog.debug.LogManager.initialize();
  return goog.debug.LogManager.rootLogger_;
};
goog.debug.LogManager.getLogger = function(a) {
  goog.debug.LogManager.initialize();
  return goog.debug.LogManager.loggers_[a] || goog.debug.LogManager.createLogger_(a);
};
goog.debug.LogManager.createFunctionForCatchErrors = function(a) {
  return function(b) {
    (a || goog.debug.LogManager.getRoot()).severe("Error: " + b.message + " (" + b.fileName + " @ Line: " + b.line + ")");
  };
};
goog.debug.LogManager.createLogger_ = function(a) {
  var b = new goog.debug.Logger(a);
  if (goog.debug.Logger.ENABLE_HIERARCHY) {
    var c = a.lastIndexOf("."), d = a.substr(0, c);
    c = a.substr(c + 1);
    d = goog.debug.LogManager.getLogger(d);
    d.addChild_(c, b);
    b.setParent_(d);
  }
  return goog.debug.LogManager.loggers_[a] = b;
};
goog.log = {};
goog.log.ENABLED = goog.debug.LOGGING_ENABLED;
goog.log.ROOT_LOGGER_NAME = goog.debug.Logger.ROOT_LOGGER_NAME;
goog.log.Logger = goog.debug.Logger;
goog.log.Level = goog.debug.Logger.Level;
goog.log.LogRecord = goog.debug.LogRecord;
goog.log.getLogger = function(a, b) {
  return goog.log.ENABLED ? (a = goog.debug.LogManager.getLogger(a), b && a && a.setLevel(b), a) : null;
};
goog.log.addHandler = function(a, b) {
  goog.log.ENABLED && a && a.addHandler(b);
};
goog.log.removeHandler = function(a, b) {
  return goog.log.ENABLED && a ? a.removeHandler(b) : !1;
};
goog.log.log = function(a, b, c, d) {
  goog.log.ENABLED && a && a.log(b, c, d);
};
goog.log.error = function(a, b, c) {
  goog.log.ENABLED && a && a.severe(b, c);
};
goog.log.warning = function(a, b, c) {
  goog.log.ENABLED && a && a.warning(b, c);
};
goog.log.info = function(a, b, c) {
  goog.log.ENABLED && a && a.info(b, c);
};
goog.log.fine = function(a, b, c) {
  goog.log.ENABLED && a && a.fine(b, c);
};
var module$contents$goog$html$sanitizer$SafeDomTreeProcessor_logger = goog.log.getLogger("goog.html.sanitizer.SafeDomTreeProcessor"), module$contents$goog$html$sanitizer$SafeDomTreeProcessor_SAFE_PARSING_SUPPORTED = !goog.userAgent.IE || goog.userAgent.isDocumentModeOrHigher(10);
function module$contents$goog$html$sanitizer$SafeDomTreeProcessor_getDomTreeWalker(a) {
  var b = document.createElement("template");
  if ("content" in b) {
    b.innerHTML = a, b = b.content;
  } else {
    var c = document.implementation.createHTMLDocument("x");
    b = c.body;
    c.body.innerHTML = a;
  }
  return document.createTreeWalker(b, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, null, !1);
}
var module$contents$goog$html$sanitizer$SafeDomTreeProcessor_SafeDomTreeProcessor = function() {
};
module$contents$goog$html$sanitizer$SafeDomTreeProcessor_SafeDomTreeProcessor.prototype.processToString = function(a) {
  if (!module$contents$goog$html$sanitizer$SafeDomTreeProcessor_SAFE_PARSING_SUPPORTED) {
    return "";
  }
  a = this.processToTree(a);
  if (0 < module$contents$goog$html$sanitizer$noclobber_getElementAttributes(a).length) {
    var b = goog.dom.createElement("SPAN");
    b.appendChild(a);
    a = b;
  }
  a = (new XMLSerializer).serializeToString(a);
  return a.slice(a.indexOf(">") + 1, a.lastIndexOf("</"));
};
module$contents$goog$html$sanitizer$SafeDomTreeProcessor_SafeDomTreeProcessor.prototype.processToTree = function(a) {
  if (!module$contents$goog$html$sanitizer$SafeDomTreeProcessor_SAFE_PARSING_SUPPORTED) {
    return goog.dom.createElement("SPAN");
  }
  var b = goog.dom.createElement("SPAN");
  this.processRoot(b);
  a = this.preProcessHtml(a);
  a = module$contents$goog$html$sanitizer$SafeDomTreeProcessor_getDomTreeWalker(a);
  for (var c = module$contents$goog$html$sanitizer$ElementWeakMap_ElementWeakMap.newWeakMap(), d; d = a.nextNode();) {
    var e = this.createNode_(d);
    if (e) {
      module$contents$goog$html$sanitizer$noclobber_isNodeElement(e) && c.set(d, e);
      d = module$contents$goog$html$sanitizer$noclobber_getParentNode(d);
      var f = !1;
      if (d) {
        var g = module$contents$goog$html$sanitizer$noclobber_getNodeType(d), h = module$contents$goog$html$sanitizer$noclobber_getNodeName(d).toLowerCase(), k = module$contents$goog$html$sanitizer$noclobber_getParentNode(d);
        g != goog.dom.NodeType.DOCUMENT_FRAGMENT || k ? "body" == h && k && (g = module$contents$goog$html$sanitizer$noclobber_getParentNode(k)) && !module$contents$goog$html$sanitizer$noclobber_getParentNode(g) && (f = !0) : f = !0;
        g = null;
        f || !d ? g = b : module$contents$goog$html$sanitizer$noclobber_isNodeElement(d) && (g = c.get(d));
        g.content && (g = g.content);
        g.appendChild(e);
      }
    } else {
      goog.dom.removeChildren(d);
    }
  }
  c.clear && c.clear();
  return b;
};
module$contents$goog$html$sanitizer$SafeDomTreeProcessor_SafeDomTreeProcessor.prototype.processRoot = function(a) {
};
module$contents$goog$html$sanitizer$SafeDomTreeProcessor_SafeDomTreeProcessor.prototype.preProcessHtml = function(a) {
};
module$contents$goog$html$sanitizer$SafeDomTreeProcessor_SafeDomTreeProcessor.prototype.createNode_ = function(a) {
  var b = module$contents$goog$html$sanitizer$noclobber_getNodeType(a);
  switch(b) {
    case goog.dom.NodeType.TEXT:
      return this.createTextNode(a);
    case goog.dom.NodeType.ELEMENT:
      return this.createElement_(module$contents$goog$html$sanitizer$noclobber_assertNodeIsElement(a));
    default:
      return goog.log.warning(module$contents$goog$html$sanitizer$SafeDomTreeProcessor_logger, "Dropping unknown node type: " + b), null;
  }
};
module$contents$goog$html$sanitizer$SafeDomTreeProcessor_SafeDomTreeProcessor.prototype.createTextNode = function(a) {
};
module$contents$goog$html$sanitizer$SafeDomTreeProcessor_SafeDomTreeProcessor.prototype.createElement_ = function(a) {
  if ("TEMPLATE" == module$contents$goog$html$sanitizer$noclobber_getNodeName(a).toUpperCase()) {
    return null;
  }
  var b = this.createElementWithoutAttributes(a);
  if (!b) {
    return null;
  }
  this.processElementAttributes_(a, b);
  return b;
};
module$contents$goog$html$sanitizer$SafeDomTreeProcessor_SafeDomTreeProcessor.prototype.createElementWithoutAttributes = function(a) {
};
module$contents$goog$html$sanitizer$SafeDomTreeProcessor_SafeDomTreeProcessor.prototype.processElementAttributes_ = function(a, b) {
  var c = module$contents$goog$html$sanitizer$noclobber_getElementAttributes(a);
  if (null != c) {
    for (var d = 0, e; e = c[d]; d++) {
      if (e.specified) {
        var f = this.processElementAttribute(a, e);
        goog.isNull(f) || module$contents$goog$html$sanitizer$noclobber_setElementAttribute(b, e.name, f);
      }
    }
  }
};
module$contents$goog$html$sanitizer$SafeDomTreeProcessor_SafeDomTreeProcessor.prototype.processElementAttribute = function(a, b) {
};
module$contents$goog$html$sanitizer$SafeDomTreeProcessor_SafeDomTreeProcessor.SAFE_PARSING_SUPPORTED = module$contents$goog$html$sanitizer$SafeDomTreeProcessor_SAFE_PARSING_SUPPORTED;
goog.html.sanitizer.SafeDomTreeProcessor = module$contents$goog$html$sanitizer$SafeDomTreeProcessor_SafeDomTreeProcessor;
goog.html.sanitizer.TagBlacklist = {APPLET:!0, AUDIO:!0, BASE:!0, BGSOUND:!0, EMBED:!0, FORM:!0, IFRAME:!0, ISINDEX:!0, KEYGEN:!0, LAYER:!0, LINK:!0, META:!0, OBJECT:!0, SCRIPT:!0, SVG:!0, STYLE:!0, TEMPLATE:!0, VIDEO:!0};
goog.html.sanitizer.TagWhitelist = {A:!0, ABBR:!0, ACRONYM:!0, ADDRESS:!0, AREA:!0, ARTICLE:!0, ASIDE:!0, B:!0, BDI:!0, BDO:!0, BIG:!0, BLOCKQUOTE:!0, BR:!0, BUTTON:!0, CAPTION:!0, CENTER:!0, CITE:!0, CODE:!0, COL:!0, COLGROUP:!0, DATA:!0, DATALIST:!0, DD:!0, DEL:!0, DETAILS:!0, DFN:!0, DIALOG:!0, DIR:!0, DIV:!0, DL:!0, DT:!0, EM:!0, FIELDSET:!0, FIGCAPTION:!0, FIGURE:!0, FONT:!0, FOOTER:!0, FORM:!0, H1:!0, H2:!0, H3:!0, H4:!0, H5:!0, H6:!0, HEADER:!0, HGROUP:!0, HR:!0, I:!0, IMG:!0, INPUT:!0, INS:!0, 
KBD:!0, LABEL:!0, LEGEND:!0, LI:!0, MAIN:!0, MAP:!0, MARK:!0, MENU:!0, METER:!0, NAV:!0, NOSCRIPT:!0, OL:!0, OPTGROUP:!0, OPTION:!0, OUTPUT:!0, P:!0, PRE:!0, PROGRESS:!0, Q:!0, S:!0, SAMP:!0, SECTION:!0, SELECT:!0, SMALL:!0, SOURCE:!0, SPAN:!0, STRIKE:!0, STRONG:!0, STYLE:!0, SUB:!0, SUMMARY:!0, SUP:!0, TABLE:!0, TBODY:!0, TD:!0, TEXTAREA:!0, TFOOT:!0, TH:!0, THEAD:!0, TIME:!0, TR:!0, TT:!0, U:!0, UL:!0, VAR:!0, WBR:!0};
goog.html.sanitizer.HTML_SANITIZER_TEMPLATE_SUPPORTED = !goog.userAgent.IE || null == document.documentMode;
goog.html.sanitizer.HTML_SANITIZER_BOOKKEEPING_PREFIX_ = "data-sanitizer-";
goog.html.sanitizer.HTML_SANITIZER_SANITIZED_ATTR_NAME_ = goog.html.sanitizer.HTML_SANITIZER_BOOKKEEPING_PREFIX_ + "original-tag";
goog.html.sanitizer.RANDOM_CONTAINER_ = "*";
goog.html.sanitizer.HtmlSanitizer = function(a) {
  module$contents$goog$html$sanitizer$SafeDomTreeProcessor_SafeDomTreeProcessor.call(this);
  a = a || new goog.html.sanitizer.HtmlSanitizer.Builder;
  a.installPolicies_();
  this.attributeHandlers_ = goog.object.clone(a.attributeWhitelist_);
  this.tagBlacklist_ = goog.object.clone(a.tagBlacklist_);
  this.tagWhitelist_ = goog.object.clone(a.tagWhitelist_);
  this.shouldAddOriginalTagNames_ = a.shouldAddOriginalTagNames_;
  goog.array.forEach(a.dataAttributeWhitelist_, function(a) {
    goog.asserts.assert(goog.string.startsWith(a, "data-"));
    goog.asserts.assert(!goog.string.startsWith(a, goog.html.sanitizer.HTML_SANITIZER_BOOKKEEPING_PREFIX_));
    this.attributeHandlers_["* " + a.toUpperCase()] = goog.html.sanitizer.HtmlSanitizer.cleanUpAttribute_;
  }, this);
  this.networkRequestUrlPolicy_ = a.networkRequestUrlPolicy_;
  this.styleContainerId_ = a.styleContainerId_;
  this.currentStyleContainerId_ = null;
  this.inlineStyleRules_ = a.inlineStyleRules_;
};
goog.inherits(goog.html.sanitizer.HtmlSanitizer, module$contents$goog$html$sanitizer$SafeDomTreeProcessor_SafeDomTreeProcessor);
goog.html.sanitizer.HtmlSanitizer.wrapUrlPolicy_ = function(a) {
  return function(b, c) {
    b = goog.html.sanitizer.HtmlSanitizer.cleanUpAttribute_(b);
    return (c = a(b, c)) && goog.html.SafeUrl.unwrap(c) != goog.html.SafeUrl.INNOCUOUS_STRING ? goog.html.SafeUrl.unwrap(c) : null;
  };
};
goog.html.sanitizer.HtmlSanitizer.Builder = function() {
  this.attributeWhitelist_ = {};
  goog.array.forEach([goog.html.sanitizer.AttributeWhitelist, goog.html.sanitizer.AttributeSanitizedWhitelist], function(a) {
    goog.array.forEach(goog.object.getKeys(a), function(a) {
      this.attributeWhitelist_[a] = goog.html.sanitizer.HtmlSanitizer.cleanUpAttribute_;
    }, this);
  }, this);
  this.attributeOverrideList_ = {};
  this.dataAttributeWhitelist_ = [];
  this.tagBlacklist_ = goog.object.clone(goog.html.sanitizer.TagBlacklist);
  this.tagWhitelist_ = goog.object.clone(goog.html.sanitizer.TagWhitelist);
  this.shouldAddOriginalTagNames_ = !1;
  this.urlPolicy_ = goog.html.sanitizer.HtmlSanitizer.defaultUrlPolicy_;
  this.networkRequestUrlPolicy_ = goog.html.sanitizer.HtmlSanitizer.defaultNetworkRequestUrlPolicy_;
  this.namePolicy_ = goog.html.sanitizer.HtmlSanitizer.defaultNamePolicy_;
  this.tokenPolicy_ = goog.html.sanitizer.HtmlSanitizer.defaultTokenPolicy_;
  this.sanitizeInlineCssPolicy_ = goog.functions.NULL;
  this.styleContainerId_ = null;
  this.policiesInstalled_ = this.inlineStyleRules_ = !1;
};
goog.html.sanitizer.HtmlSanitizer.Builder.prototype.allowDataAttributes = function(a) {
  goog.array.extend(this.dataAttributeWhitelist_, a);
  return this;
};
goog.html.sanitizer.HtmlSanitizer.Builder.prototype.allowFormTag = function() {
  delete this.tagBlacklist_.FORM;
  return this;
};
goog.html.sanitizer.HtmlSanitizer.Builder.prototype.allowStyleTag = function() {
  if (this.inlineStyleRules_) {
    throw Error("Rules from STYLE tags are already being inlined.");
  }
  delete this.tagBlacklist_.STYLE;
  this.styleContainerId_ = goog.html.sanitizer.RANDOM_CONTAINER_;
  return this;
};
goog.html.sanitizer.HtmlSanitizer.Builder.prototype.withStyleContainer = function(a) {
  if ("STYLE" in this.tagBlacklist_) {
    throw Error("STYLE tags must first be allowed through allowStyleTag.");
  }
  if (void 0 != a) {
    if (!/^[a-zA-Z][\w-:\.]*$/.test(a)) {
      throw Error("Invalid ID.");
    }
    this.styleContainerId_ = a;
  } else {
    this.styleContainerId_ = null;
  }
  return this;
};
goog.html.sanitizer.HtmlSanitizer.Builder.prototype.inlineStyleRules = function() {
  if (this.sanitizeInlineCssPolicy_ == goog.functions.NULL) {
    throw Error("Inlining style rules requires allowing STYLE attributes first.");
  }
  if (!("STYLE" in this.tagBlacklist_)) {
    throw Error("You have already configured the builder to allow STYLE tags in the output. Inlining style rules would prevent STYLE tags from appearing in the output and conflict with such directive.");
  }
  this.inlineStyleRules_ = !0;
  return this;
};
goog.html.sanitizer.HtmlSanitizer.Builder.prototype.allowCssStyles = function() {
  this.sanitizeInlineCssPolicy_ = goog.html.sanitizer.HtmlSanitizer.sanitizeCssDeclarationList_;
  return this;
};
goog.html.sanitizer.HtmlSanitizer.Builder.prototype.alsoAllowTagsPrivateDoNotAccessOrElse = function(a) {
  goog.array.forEach(a, function(a) {
    this.tagWhitelist_[a.toUpperCase()] = !0;
  }, this);
  return this;
};
goog.html.sanitizer.HtmlSanitizer.Builder.prototype.alsoAllowAttributesPrivateDoNotAccessOrElse = function(a) {
  goog.array.forEach(a, function(a) {
    goog.isString(a) && (a = {tagName:"*", attributeName:a, policy:null});
    var b = goog.html.sanitizer.HtmlSanitizer.attrIdentifier_(a.tagName, a.attributeName);
    this.attributeWhitelist_[b] = a.policy ? a.policy : goog.html.sanitizer.HtmlSanitizer.cleanUpAttribute_;
    this.attributeOverrideList_[b] = !0;
  }, this);
  return this;
};
goog.html.sanitizer.HtmlSanitizer.Builder.prototype.onlyAllowTags = function(a) {
  this.tagWhitelist_ = {SPAN:!0};
  goog.array.forEach(a, function(a) {
    a = a.toUpperCase();
    if (goog.html.sanitizer.TagWhitelist[a]) {
      this.tagWhitelist_[a] = !0;
    } else {
      throw Error("Only whitelisted tags can be allowed. See goog.html.sanitizer.TagWhitelist.");
    }
  }, this);
  return this;
};
goog.html.sanitizer.HtmlSanitizer.Builder.prototype.onlyAllowAttributes = function(a) {
  var b = this.attributeWhitelist_;
  this.attributeWhitelist_ = {};
  goog.array.forEach(a, function(a) {
    "string" === goog.typeOf(a) && (a = {tagName:"*", attributeName:a.toUpperCase(), policy:null});
    var c = goog.html.sanitizer.HtmlSanitizer.attrIdentifier_(a.tagName, a.attributeName);
    if (!b[c]) {
      throw Error("Only whitelisted attributes can be allowed.");
    }
    this.attributeWhitelist_[c] = a.policy ? a.policy : goog.html.sanitizer.HtmlSanitizer.cleanUpAttribute_;
  }, this);
  return this;
};
goog.html.sanitizer.HtmlSanitizer.Builder.prototype.addOriginalTagNames = function() {
  this.shouldAddOriginalTagNames_ = !0;
  return this;
};
goog.html.sanitizer.HtmlSanitizer.Builder.prototype.withCustomNetworkRequestUrlPolicy = function(a) {
  this.networkRequestUrlPolicy_ = a;
  return this;
};
goog.html.sanitizer.HtmlSanitizer.Builder.prototype.withCustomUrlPolicy = function(a) {
  this.urlPolicy_ = a;
  return this;
};
goog.html.sanitizer.HtmlSanitizer.Builder.prototype.withCustomNamePolicy = function(a) {
  this.namePolicy_ = a;
  return this;
};
goog.html.sanitizer.HtmlSanitizer.Builder.prototype.withCustomTokenPolicy = function(a) {
  this.tokenPolicy_ = a;
  return this;
};
goog.html.sanitizer.HtmlSanitizer.wrapPolicy_ = function(a, b) {
  return function(c, d, e, f) {
    c = a(c, d, e, f);
    return null == c ? null : b(c, d, e, f);
  };
};
goog.html.sanitizer.HtmlSanitizer.installDefaultPolicy_ = function(a, b, c, d) {
  a[c] && !b[c] && (a[c] = goog.html.sanitizer.HtmlSanitizer.wrapPolicy_(a[c], d));
};
goog.html.sanitizer.HtmlSanitizer.Builder.prototype.build = function() {
  return new goog.html.sanitizer.HtmlSanitizer(this);
};
goog.html.sanitizer.HtmlSanitizer.Builder.prototype.installPolicies_ = function() {
  if (this.policiesInstalled_) {
    throw Error("HtmlSanitizer.Builder.build() can only be used once.");
  }
  var a = goog.html.sanitizer.HtmlSanitizer.installDefaultPolicy_;
  a(this.attributeWhitelist_, this.attributeOverrideList_, "* USEMAP", goog.html.sanitizer.HtmlSanitizer.sanitizeUrlFragment_);
  var b = goog.html.sanitizer.HtmlSanitizer.wrapUrlPolicy_(this.urlPolicy_);
  goog.array.forEach(["* ACTION", "* CITE", "* HREF"], function(c) {
    a(this.attributeWhitelist_, this.attributeOverrideList_, c, b);
  }, this);
  var c = goog.html.sanitizer.HtmlSanitizer.wrapUrlPolicy_(this.networkRequestUrlPolicy_);
  goog.array.forEach(["* LONGDESC", "* SRC", "LINK HREF"], function(b) {
    a(this.attributeWhitelist_, this.attributeOverrideList_, b, c);
  }, this);
  goog.array.forEach(["* FOR", "* HEADERS", "* NAME"], function(b) {
    a(this.attributeWhitelist_, this.attributeOverrideList_, b, goog.partial(goog.html.sanitizer.HtmlSanitizer.sanitizeName_, this.namePolicy_));
  }, this);
  a(this.attributeWhitelist_, this.attributeOverrideList_, "A TARGET", goog.partial(goog.html.sanitizer.HtmlSanitizer.allowedAttributeValues_, ["_blank", "_self"]));
  a(this.attributeWhitelist_, this.attributeOverrideList_, "* CLASS", goog.partial(goog.html.sanitizer.HtmlSanitizer.sanitizeClasses_, this.tokenPolicy_));
  a(this.attributeWhitelist_, this.attributeOverrideList_, "* ID", goog.partial(goog.html.sanitizer.HtmlSanitizer.sanitizeId_, this.tokenPolicy_));
  a(this.attributeWhitelist_, this.attributeOverrideList_, "* STYLE", goog.partial(this.sanitizeInlineCssPolicy_, c));
  this.policiesInstalled_ = !0;
};
goog.html.sanitizer.HtmlSanitizer.defaultUrlPolicy_ = goog.html.SafeUrl.sanitize;
goog.html.sanitizer.HtmlSanitizer.defaultNetworkRequestUrlPolicy_ = goog.functions.NULL;
goog.html.sanitizer.HtmlSanitizer.defaultNamePolicy_ = goog.functions.NULL;
goog.html.sanitizer.HtmlSanitizer.defaultTokenPolicy_ = goog.functions.NULL;
goog.html.sanitizer.HtmlSanitizer.attrIdentifier_ = function(a, b) {
  a || (a = "*");
  return (a + " " + b).toUpperCase();
};
goog.html.sanitizer.HtmlSanitizer.sanitizeCssDeclarationList_ = function(a, b, c, d) {
  if (!d.cssStyle) {
    return null;
  }
  b = goog.html.SafeStyle.unwrap(goog.html.sanitizer.CssSanitizer.sanitizeInlineStyle(d.cssStyle, function(b, d) {
    c.cssProperty = d;
    b = a(b, c);
    return null == b ? null : goog.html.uncheckedconversions.safeUrlFromStringKnownToSatisfyTypeContract(goog.string.Const.from("HtmlSanitizerPolicy created with networkRequestUrlPolicy_ when installing '* STYLE' handler."), b);
  }));
  return "" == b ? null : b;
};
goog.html.sanitizer.HtmlSanitizer.cleanUpAttribute_ = function(a) {
  return goog.string.trim(a);
};
goog.html.sanitizer.HtmlSanitizer.allowedAttributeValues_ = function(a, b, c) {
  b = goog.string.trim(b);
  return goog.array.contains(a, b.toLowerCase()) ? b : null;
};
goog.html.sanitizer.HtmlSanitizer.sanitizeUrlFragment_ = function(a, b) {
  return (a = goog.string.trim(a)) && "#" == a.charAt(0) ? a : null;
};
goog.html.sanitizer.HtmlSanitizer.sanitizeName_ = function(a, b, c) {
  b = goog.string.trim(b);
  return a(b, c);
};
goog.html.sanitizer.HtmlSanitizer.sanitizeClasses_ = function(a, b, c) {
  b = b.split(/(?:\s+)/);
  for (var d = [], e = 0; e < b.length; e++) {
    var f = a(b[e], c);
    f && d.push(f);
  }
  return 0 == d.length ? null : d.join(" ");
};
goog.html.sanitizer.HtmlSanitizer.sanitizeId_ = function(a, b, c) {
  b = goog.string.trim(b);
  return a(b, c);
};
goog.html.sanitizer.HtmlSanitizer.getContext_ = function(a, b) {
  var c = {cssStyle:void 0};
  "style" == a && (c.cssStyle = module$contents$goog$html$sanitizer$noclobber_getElementStyle(b));
  return c;
};
goog.html.sanitizer.HtmlSanitizer.prototype.sanitize = function(a) {
  this.currentStyleContainerId_ = this.getStyleContainerId_();
  a = this.processToString(a);
  return goog.html.uncheckedconversions.safeHtmlFromStringKnownToSatisfyTypeContract(goog.string.Const.from("Output of HTML sanitizer"), a);
};
goog.html.sanitizer.HtmlSanitizer.prototype.sanitizeToDomNode = function(a) {
  this.currentStyleContainerId_ = this.getStyleContainerId_();
  return module$contents$goog$html$sanitizer$SafeDomTreeProcessor_SafeDomTreeProcessor.prototype.processToTree.call(this, a);
};
goog.html.sanitizer.HtmlSanitizer.prototype.processRoot = function(a) {
  this.currentStyleContainerId_ && this.styleContainerId_ == goog.html.sanitizer.RANDOM_CONTAINER_ && (a.id = this.currentStyleContainerId_);
};
goog.html.sanitizer.HtmlSanitizer.prototype.preProcessHtml = function(a) {
  if (!this.inlineStyleRules_) {
    return a;
  }
  a = goog.html.sanitizer.CssSanitizer.safeParseHtmlAndGetInertElement("<div>" + a + "</div>");
  goog.asserts.assert(a, "Older browsers that don't support inert parsing should not get to this branch");
  goog.html.sanitizer.CssSanitizer.inlineStyleRules(a);
  return a.innerHTML;
};
goog.html.sanitizer.HtmlSanitizer.prototype.getStyleContainerId_ = function() {
  var a = !("STYLE" in this.tagBlacklist_) && "STYLE" in this.tagWhitelist_;
  return this.styleContainerId_ == goog.html.sanitizer.RANDOM_CONTAINER_ && a ? "sanitizer-" + goog.string.getRandomString() : this.styleContainerId_;
};
goog.html.sanitizer.HtmlSanitizer.prototype.createTextNode = function(a) {
  var b = a.data;
  (a = module$contents$goog$html$sanitizer$noclobber_getParentNode(a)) && "style" == module$contents$goog$html$sanitizer$noclobber_getNodeName(a).toLowerCase() && !("STYLE" in this.tagBlacklist_) && "STYLE" in this.tagWhitelist_ && (b = goog.html.SafeStyleSheet.unwrap(goog.html.sanitizer.CssSanitizer.sanitizeStyleSheetString(b, this.currentStyleContainerId_, goog.bind(function(a, b) {
    return this.networkRequestUrlPolicy_(a, {cssProperty:b});
  }, this))));
  return document.createTextNode(b);
};
goog.html.sanitizer.HtmlSanitizer.prototype.createElementWithoutAttributes = function(a) {
  a = module$contents$goog$html$sanitizer$noclobber_getNodeName(a).toUpperCase();
  if (a in this.tagBlacklist_) {
    return null;
  }
  if (this.tagWhitelist_[a]) {
    return document.createElement(a);
  }
  var b = goog.dom.createElement("SPAN");
  this.shouldAddOriginalTagNames_ && module$contents$goog$html$sanitizer$noclobber_setElementAttribute(b, goog.html.sanitizer.HTML_SANITIZER_SANITIZED_ATTR_NAME_, a.toLowerCase());
  return b;
};
goog.html.sanitizer.HtmlSanitizer.prototype.processElementAttribute = function(a, b) {
  var c = b.name;
  if (goog.string.startsWith(c, goog.html.sanitizer.HTML_SANITIZER_BOOKKEEPING_PREFIX_)) {
    return null;
  }
  var d = module$contents$goog$html$sanitizer$noclobber_getNodeName(a);
  b = b.value;
  var e = {tagName:goog.string.trim(d).toLowerCase(), attributeName:goog.string.trim(c).toLowerCase()};
  a = goog.html.sanitizer.HtmlSanitizer.getContext_(e.attributeName, a);
  d = goog.html.sanitizer.HtmlSanitizer.attrIdentifier_(d, c);
  if (d in this.attributeHandlers_) {
    return c = this.attributeHandlers_[d], c(b, e, a);
  }
  c = goog.html.sanitizer.HtmlSanitizer.attrIdentifier_(null, c);
  return c in this.attributeHandlers_ ? (c = this.attributeHandlers_[c], c(b, e, a)) : null;
};
goog.html.sanitizer.HtmlSanitizer.sanitize = function(a) {
  return (new goog.html.sanitizer.HtmlSanitizer.Builder).build().sanitize(a);
};
goog.dom.classlist = {};
goog.dom.classlist.ALWAYS_USE_DOM_TOKEN_LIST = !1;
goog.dom.classlist.get = function(a) {
  if (goog.dom.classlist.ALWAYS_USE_DOM_TOKEN_LIST || a.classList) {
    return a.classList;
  }
  a = a.className;
  return goog.isString(a) && a.match(/\S+/g) || [];
};
goog.dom.classlist.set = function(a, b) {
  a.className = b;
};
goog.dom.classlist.contains = function(a, b) {
  return goog.dom.classlist.ALWAYS_USE_DOM_TOKEN_LIST || a.classList ? a.classList.contains(b) : goog.array.contains(goog.dom.classlist.get(a), b);
};
goog.dom.classlist.add = function(a, b) {
  goog.dom.classlist.ALWAYS_USE_DOM_TOKEN_LIST || a.classList ? a.classList.add(b) : goog.dom.classlist.contains(a, b) || (a.className += 0 < a.className.length ? " " + b : b);
};
goog.dom.classlist.addAll = function(a, b) {
  if (goog.dom.classlist.ALWAYS_USE_DOM_TOKEN_LIST || a.classList) {
    goog.array.forEach(b, function(b) {
      goog.dom.classlist.add(a, b);
    });
  } else {
    var c = {};
    goog.array.forEach(goog.dom.classlist.get(a), function(a) {
      c[a] = !0;
    });
    goog.array.forEach(b, function(a) {
      c[a] = !0;
    });
    a.className = "";
    for (var d in c) {
      a.className += 0 < a.className.length ? " " + d : d;
    }
  }
};
goog.dom.classlist.remove = function(a, b) {
  goog.dom.classlist.ALWAYS_USE_DOM_TOKEN_LIST || a.classList ? a.classList.remove(b) : goog.dom.classlist.contains(a, b) && (a.className = goog.array.filter(goog.dom.classlist.get(a), function(a) {
    return a != b;
  }).join(" "));
};
goog.dom.classlist.removeAll = function(a, b) {
  goog.dom.classlist.ALWAYS_USE_DOM_TOKEN_LIST || a.classList ? goog.array.forEach(b, function(b) {
    goog.dom.classlist.remove(a, b);
  }) : a.className = goog.array.filter(goog.dom.classlist.get(a), function(a) {
    return !goog.array.contains(b, a);
  }).join(" ");
};
goog.dom.classlist.enable = function(a, b, c) {
  c ? goog.dom.classlist.add(a, b) : goog.dom.classlist.remove(a, b);
};
goog.dom.classlist.enableAll = function(a, b, c) {
  (c ? goog.dom.classlist.addAll : goog.dom.classlist.removeAll)(a, b);
};
goog.dom.classlist.swap = function(a, b, c) {
  return goog.dom.classlist.contains(a, b) ? (goog.dom.classlist.remove(a, b), goog.dom.classlist.add(a, c), !0) : !1;
};
goog.dom.classlist.toggle = function(a, b) {
  var c = !goog.dom.classlist.contains(a, b);
  goog.dom.classlist.enable(a, b, c);
  return c;
};
goog.dom.classlist.addRemove = function(a, b, c) {
  goog.dom.classlist.remove(a, b);
  goog.dom.classlist.add(a, c);
};
goog.events.KeyCodes = {WIN_KEY_FF_LINUX:0, MAC_ENTER:3, BACKSPACE:8, TAB:9, NUM_CENTER:12, ENTER:13, SHIFT:16, CTRL:17, ALT:18, PAUSE:19, CAPS_LOCK:20, ESC:27, SPACE:32, PAGE_UP:33, PAGE_DOWN:34, END:35, HOME:36, LEFT:37, UP:38, RIGHT:39, DOWN:40, PLUS_SIGN:43, PRINT_SCREEN:44, INSERT:45, DELETE:46, ZERO:48, ONE:49, TWO:50, THREE:51, FOUR:52, FIVE:53, SIX:54, SEVEN:55, EIGHT:56, NINE:57, FF_SEMICOLON:59, FF_EQUALS:61, FF_DASH:173, QUESTION_MARK:63, AT_SIGN:64, A:65, B:66, C:67, D:68, E:69, F:70, 
G:71, H:72, I:73, J:74, K:75, L:76, M:77, N:78, O:79, P:80, Q:81, R:82, S:83, T:84, U:85, V:86, W:87, X:88, Y:89, Z:90, META:91, WIN_KEY_RIGHT:92, CONTEXT_MENU:93, NUM_ZERO:96, NUM_ONE:97, NUM_TWO:98, NUM_THREE:99, NUM_FOUR:100, NUM_FIVE:101, NUM_SIX:102, NUM_SEVEN:103, NUM_EIGHT:104, NUM_NINE:105, NUM_MULTIPLY:106, NUM_PLUS:107, NUM_MINUS:109, NUM_PERIOD:110, NUM_DIVISION:111, F1:112, F2:113, F3:114, F4:115, F5:116, F6:117, F7:118, F8:119, F9:120, F10:121, F11:122, F12:123, NUMLOCK:144, SCROLL_LOCK:145, 
FIRST_MEDIA_KEY:166, LAST_MEDIA_KEY:183, SEMICOLON:186, DASH:189, EQUALS:187, COMMA:188, PERIOD:190, SLASH:191, APOSTROPHE:192, TILDE:192, SINGLE_QUOTE:222, OPEN_SQUARE_BRACKET:219, BACKSLASH:220, CLOSE_SQUARE_BRACKET:221, WIN_KEY:224, MAC_FF_META:224, MAC_WK_CMD_LEFT:91, MAC_WK_CMD_RIGHT:93, WIN_IME:229, VK_NONAME:252, PHANTOM:255};
goog.events.KeyCodes.isTextModifyingKeyEvent = function(a) {
  if (a.altKey && !a.ctrlKey || a.metaKey || a.keyCode >= goog.events.KeyCodes.F1 && a.keyCode <= goog.events.KeyCodes.F12) {
    return !1;
  }
  switch(a.keyCode) {
    case goog.events.KeyCodes.ALT:
    case goog.events.KeyCodes.CAPS_LOCK:
    case goog.events.KeyCodes.CONTEXT_MENU:
    case goog.events.KeyCodes.CTRL:
    case goog.events.KeyCodes.DOWN:
    case goog.events.KeyCodes.END:
    case goog.events.KeyCodes.ESC:
    case goog.events.KeyCodes.HOME:
    case goog.events.KeyCodes.INSERT:
    case goog.events.KeyCodes.LEFT:
    case goog.events.KeyCodes.MAC_FF_META:
    case goog.events.KeyCodes.META:
    case goog.events.KeyCodes.NUMLOCK:
    case goog.events.KeyCodes.NUM_CENTER:
    case goog.events.KeyCodes.PAGE_DOWN:
    case goog.events.KeyCodes.PAGE_UP:
    case goog.events.KeyCodes.PAUSE:
    case goog.events.KeyCodes.PHANTOM:
    case goog.events.KeyCodes.PRINT_SCREEN:
    case goog.events.KeyCodes.RIGHT:
    case goog.events.KeyCodes.SCROLL_LOCK:
    case goog.events.KeyCodes.SHIFT:
    case goog.events.KeyCodes.UP:
    case goog.events.KeyCodes.VK_NONAME:
    case goog.events.KeyCodes.WIN_KEY:
    case goog.events.KeyCodes.WIN_KEY_RIGHT:
      return !1;
    case goog.events.KeyCodes.WIN_KEY_FF_LINUX:
      return !goog.userAgent.GECKO;
    default:
      return a.keyCode < goog.events.KeyCodes.FIRST_MEDIA_KEY || a.keyCode > goog.events.KeyCodes.LAST_MEDIA_KEY;
  }
};
goog.events.KeyCodes.firesKeyPressEvent = function(a, b, c, d, e, f) {
  if (goog.userAgent.WEBKIT && !goog.userAgent.isVersionOrHigher("525")) {
    return !0;
  }
  if (goog.userAgent.MAC && e) {
    return goog.events.KeyCodes.isCharacterKey(a);
  }
  if (e && !d) {
    return !1;
  }
  if (!goog.userAgent.GECKO) {
    goog.isNumber(b) && (b = goog.events.KeyCodes.normalizeKeyCode(b));
    var g = b == goog.events.KeyCodes.CTRL || b == goog.events.KeyCodes.ALT || goog.userAgent.MAC && b == goog.events.KeyCodes.META, h = b == goog.events.KeyCodes.SHIFT && (d || f);
    if ((!c || goog.userAgent.MAC) && g || goog.userAgent.MAC && h) {
      return !1;
    }
  }
  if ((goog.userAgent.WEBKIT || goog.userAgent.EDGE) && d && c) {
    switch(a) {
      case goog.events.KeyCodes.BACKSLASH:
      case goog.events.KeyCodes.OPEN_SQUARE_BRACKET:
      case goog.events.KeyCodes.CLOSE_SQUARE_BRACKET:
      case goog.events.KeyCodes.TILDE:
      case goog.events.KeyCodes.SEMICOLON:
      case goog.events.KeyCodes.DASH:
      case goog.events.KeyCodes.EQUALS:
      case goog.events.KeyCodes.COMMA:
      case goog.events.KeyCodes.PERIOD:
      case goog.events.KeyCodes.SLASH:
      case goog.events.KeyCodes.APOSTROPHE:
      case goog.events.KeyCodes.SINGLE_QUOTE:
        return !1;
    }
  }
  if (goog.userAgent.IE && d && b == a) {
    return !1;
  }
  switch(a) {
    case goog.events.KeyCodes.ENTER:
      return goog.userAgent.GECKO ? f || e ? !1 : !(c && d) : !0;
    case goog.events.KeyCodes.ESC:
      return !(goog.userAgent.WEBKIT || goog.userAgent.EDGE || goog.userAgent.GECKO);
  }
  return goog.userAgent.GECKO && (d || e || f) ? !1 : goog.events.KeyCodes.isCharacterKey(a);
};
goog.events.KeyCodes.isCharacterKey = function(a) {
  if (a >= goog.events.KeyCodes.ZERO && a <= goog.events.KeyCodes.NINE || a >= goog.events.KeyCodes.NUM_ZERO && a <= goog.events.KeyCodes.NUM_MULTIPLY || a >= goog.events.KeyCodes.A && a <= goog.events.KeyCodes.Z || (goog.userAgent.WEBKIT || goog.userAgent.EDGE) && 0 == a) {
    return !0;
  }
  switch(a) {
    case goog.events.KeyCodes.SPACE:
    case goog.events.KeyCodes.PLUS_SIGN:
    case goog.events.KeyCodes.QUESTION_MARK:
    case goog.events.KeyCodes.AT_SIGN:
    case goog.events.KeyCodes.NUM_PLUS:
    case goog.events.KeyCodes.NUM_MINUS:
    case goog.events.KeyCodes.NUM_PERIOD:
    case goog.events.KeyCodes.NUM_DIVISION:
    case goog.events.KeyCodes.SEMICOLON:
    case goog.events.KeyCodes.FF_SEMICOLON:
    case goog.events.KeyCodes.DASH:
    case goog.events.KeyCodes.EQUALS:
    case goog.events.KeyCodes.FF_EQUALS:
    case goog.events.KeyCodes.COMMA:
    case goog.events.KeyCodes.PERIOD:
    case goog.events.KeyCodes.SLASH:
    case goog.events.KeyCodes.APOSTROPHE:
    case goog.events.KeyCodes.SINGLE_QUOTE:
    case goog.events.KeyCodes.OPEN_SQUARE_BRACKET:
    case goog.events.KeyCodes.BACKSLASH:
    case goog.events.KeyCodes.CLOSE_SQUARE_BRACKET:
      return !0;
    default:
      return !1;
  }
};
goog.events.KeyCodes.normalizeKeyCode = function(a) {
  return goog.userAgent.GECKO ? goog.events.KeyCodes.normalizeGeckoKeyCode(a) : goog.userAgent.MAC && goog.userAgent.WEBKIT ? goog.events.KeyCodes.normalizeMacWebKitKeyCode(a) : a;
};
goog.events.KeyCodes.normalizeGeckoKeyCode = function(a) {
  switch(a) {
    case goog.events.KeyCodes.FF_EQUALS:
      return goog.events.KeyCodes.EQUALS;
    case goog.events.KeyCodes.FF_SEMICOLON:
      return goog.events.KeyCodes.SEMICOLON;
    case goog.events.KeyCodes.FF_DASH:
      return goog.events.KeyCodes.DASH;
    case goog.events.KeyCodes.MAC_FF_META:
      return goog.events.KeyCodes.META;
    case goog.events.KeyCodes.WIN_KEY_FF_LINUX:
      return goog.events.KeyCodes.WIN_KEY;
    default:
      return a;
  }
};
goog.events.KeyCodes.normalizeMacWebKitKeyCode = function(a) {
  switch(a) {
    case goog.events.KeyCodes.MAC_WK_CMD_RIGHT:
      return goog.events.KeyCodes.META;
    default:
      return a;
  }
};
goog.events.KeyHandler = function(a, b) {
  goog.events.EventTarget.call(this);
  a && this.attach(a, b);
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
goog.events.KeyHandler.USES_KEYDOWN_ = !goog.userAgent.WEBKIT || goog.userAgent.isVersionOrHigher("525");
goog.events.KeyHandler.SAVE_ALT_FOR_KEYPRESS_ = goog.userAgent.MAC && goog.userAgent.GECKO;
goog.events.KeyHandler.prototype.handleKeyDown_ = function(a) {
  (goog.userAgent.WEBKIT || goog.userAgent.EDGE) && (this.lastKey_ == goog.events.KeyCodes.CTRL && !a.ctrlKey || this.lastKey_ == goog.events.KeyCodes.ALT && !a.altKey || goog.userAgent.MAC && this.lastKey_ == goog.events.KeyCodes.META && !a.metaKey) && this.resetState();
  -1 == this.lastKey_ && (a.ctrlKey && a.keyCode != goog.events.KeyCodes.CTRL ? this.lastKey_ = goog.events.KeyCodes.CTRL : a.altKey && a.keyCode != goog.events.KeyCodes.ALT ? this.lastKey_ = goog.events.KeyCodes.ALT : a.metaKey && a.keyCode != goog.events.KeyCodes.META && (this.lastKey_ = goog.events.KeyCodes.META));
  goog.events.KeyHandler.USES_KEYDOWN_ && !goog.events.KeyCodes.firesKeyPressEvent(a.keyCode, this.lastKey_, a.shiftKey, a.ctrlKey, a.altKey, a.metaKey) ? this.handleEvent(a) : (this.keyCode_ = goog.events.KeyCodes.normalizeKeyCode(a.keyCode), goog.events.KeyHandler.SAVE_ALT_FOR_KEYPRESS_ && (this.altKey_ = a.altKey));
};
goog.events.KeyHandler.prototype.resetState = function() {
  this.keyCode_ = this.lastKey_ = -1;
};
goog.events.KeyHandler.prototype.handleKeyup_ = function(a) {
  this.resetState();
  this.altKey_ = a.altKey;
};
goog.events.KeyHandler.prototype.handleEvent = function(a) {
  var b = a.getBrowserEvent(), c = b.altKey;
  if (goog.userAgent.IE && a.type == goog.events.EventType.KEYPRESS) {
    var d = this.keyCode_;
    var e = d != goog.events.KeyCodes.ENTER && d != goog.events.KeyCodes.ESC ? b.keyCode : 0;
  } else {
    (goog.userAgent.WEBKIT || goog.userAgent.EDGE) && a.type == goog.events.EventType.KEYPRESS ? (d = this.keyCode_, e = 0 <= b.charCode && 63232 > b.charCode && goog.events.KeyCodes.isCharacterKey(d) ? b.charCode : 0) : goog.userAgent.OPERA && !goog.userAgent.WEBKIT ? (d = this.keyCode_, e = goog.events.KeyCodes.isCharacterKey(d) ? b.keyCode : 0) : (d = b.keyCode || this.keyCode_, e = b.charCode || 0, goog.events.KeyHandler.SAVE_ALT_FOR_KEYPRESS_ && a.type == goog.events.EventType.KEYPRESS && (c = 
    this.altKey_), goog.userAgent.MAC && e == goog.events.KeyCodes.QUESTION_MARK && d == goog.events.KeyCodes.WIN_KEY && (d = goog.events.KeyCodes.SLASH));
  }
  var f = d = goog.events.KeyCodes.normalizeKeyCode(d);
  d ? 63232 <= d && d in goog.events.KeyHandler.safariKey_ ? f = goog.events.KeyHandler.safariKey_[d] : 25 == d && a.shiftKey && (f = 9) : b.keyIdentifier && b.keyIdentifier in goog.events.KeyHandler.keyIdentifier_ && (f = goog.events.KeyHandler.keyIdentifier_[b.keyIdentifier]);
  goog.userAgent.GECKO && goog.events.KeyHandler.USES_KEYDOWN_ && a.type == goog.events.EventType.KEYPRESS && !goog.events.KeyCodes.firesKeyPressEvent(f, this.lastKey_, a.shiftKey, a.ctrlKey, c, a.metaKey) || (a = f == this.lastKey_, this.lastKey_ = f, b = new goog.events.KeyEvent(f, e, a, b), b.altKey = c, this.dispatchEvent(b));
};
goog.events.KeyHandler.prototype.getElement = function() {
  return this.element_;
};
goog.events.KeyHandler.prototype.attach = function(a, b) {
  this.keyUpKey_ && this.detach();
  this.element_ = a;
  this.keyPressKey_ = goog.events.listen(this.element_, goog.events.EventType.KEYPRESS, this, b);
  this.keyDownKey_ = goog.events.listen(this.element_, goog.events.EventType.KEYDOWN, this.handleKeyDown_, b, this);
  this.keyUpKey_ = goog.events.listen(this.element_, goog.events.EventType.KEYUP, this.handleKeyup_, b, this);
};
goog.events.KeyHandler.prototype.detach = function() {
  this.keyPressKey_ && (goog.events.unlistenByKey(this.keyPressKey_), goog.events.unlistenByKey(this.keyDownKey_), goog.events.unlistenByKey(this.keyUpKey_), this.keyUpKey_ = this.keyDownKey_ = this.keyPressKey_ = null);
  this.element_ = null;
  this.keyCode_ = this.lastKey_ = -1;
};
goog.events.KeyHandler.prototype.disposeInternal = function() {
  goog.events.KeyHandler.superClass_.disposeInternal.call(this);
  this.detach();
};
goog.events.KeyEvent = function(a, b, c, d) {
  goog.events.BrowserEvent.call(this, d);
  this.type = goog.events.KeyHandler.EventType.KEY;
  this.keyCode = a;
  this.charCode = b;
  this.repeat = c;
};
goog.inherits(goog.events.KeyEvent, goog.events.BrowserEvent);
goog.ui = {};
goog.ui.IdGenerator = function() {
};
goog.addSingletonGetter(goog.ui.IdGenerator);
goog.ui.IdGenerator.prototype.nextId_ = 0;
goog.ui.IdGenerator.prototype.getNextUniqueId = function() {
  return ":" + (this.nextId_++).toString(36);
};
goog.ui.Component = function(a) {
  goog.events.EventTarget.call(this);
  this.dom_ = a || goog.dom.getDomHelper();
  this.rightToLeft_ = goog.ui.Component.defaultRightToLeft_;
  this.id_ = null;
  this.inDocument_ = !1;
  this.element_ = null;
  this.googUiComponentHandler_ = void 0;
  this.childIndex_ = this.children_ = this.parent_ = this.model_ = null;
  this.pointerEventsEnabled_ = this.wasDecorated_ = !1;
};
goog.inherits(goog.ui.Component, goog.events.EventTarget);
goog.ui.Component.ALLOW_DETACHED_DECORATION = !1;
goog.ui.Component.prototype.idGenerator_ = goog.ui.IdGenerator.getInstance();
goog.ui.Component.DEFAULT_BIDI_DIR = 0;
goog.ui.Component.defaultRightToLeft_ = 1 == goog.ui.Component.DEFAULT_BIDI_DIR ? !1 : -1 == goog.ui.Component.DEFAULT_BIDI_DIR ? !0 : null;
goog.ui.Component.EventType = {BEFORE_SHOW:"beforeshow", SHOW:"show", HIDE:"hide", DISABLE:"disable", ENABLE:"enable", HIGHLIGHT:"highlight", UNHIGHLIGHT:"unhighlight", ACTIVATE:"activate", DEACTIVATE:"deactivate", SELECT:"select", UNSELECT:"unselect", CHECK:"check", UNCHECK:"uncheck", FOCUS:"focus", BLUR:"blur", OPEN:"open", CLOSE:"close", ENTER:"enter", LEAVE:"leave", ACTION:"action", CHANGE:"change"};
goog.ui.Component.Error = {NOT_SUPPORTED:"Method not supported", DECORATE_INVALID:"Invalid element to decorate", ALREADY_RENDERED:"Component already rendered", PARENT_UNABLE_TO_BE_SET:"Unable to set parent component", CHILD_INDEX_OUT_OF_BOUNDS:"Child component index out of bounds", NOT_OUR_CHILD:"Child is not in parent component", NOT_IN_DOCUMENT:"Operation not supported while component is not in document", STATE_INVALID:"Invalid component state"};
goog.ui.Component.State = {ALL:255, DISABLED:1, HOVER:2, ACTIVE:4, SELECTED:8, CHECKED:16, FOCUSED:32, OPENED:64};
goog.ui.Component.getStateTransitionEvent = function(a, b) {
  switch(a) {
    case goog.ui.Component.State.DISABLED:
      return b ? goog.ui.Component.EventType.DISABLE : goog.ui.Component.EventType.ENABLE;
    case goog.ui.Component.State.HOVER:
      return b ? goog.ui.Component.EventType.HIGHLIGHT : goog.ui.Component.EventType.UNHIGHLIGHT;
    case goog.ui.Component.State.ACTIVE:
      return b ? goog.ui.Component.EventType.ACTIVATE : goog.ui.Component.EventType.DEACTIVATE;
    case goog.ui.Component.State.SELECTED:
      return b ? goog.ui.Component.EventType.SELECT : goog.ui.Component.EventType.UNSELECT;
    case goog.ui.Component.State.CHECKED:
      return b ? goog.ui.Component.EventType.CHECK : goog.ui.Component.EventType.UNCHECK;
    case goog.ui.Component.State.FOCUSED:
      return b ? goog.ui.Component.EventType.FOCUS : goog.ui.Component.EventType.BLUR;
    case goog.ui.Component.State.OPENED:
      return b ? goog.ui.Component.EventType.OPEN : goog.ui.Component.EventType.CLOSE;
  }
  throw Error(goog.ui.Component.Error.STATE_INVALID);
};
goog.ui.Component.setDefaultRightToLeft = function(a) {
  goog.ui.Component.defaultRightToLeft_ = a;
};
goog.ui.Component.prototype.getId = function() {
  return this.id_ || (this.id_ = this.idGenerator_.getNextUniqueId());
};
goog.ui.Component.prototype.setId = function(a) {
  this.parent_ && this.parent_.childIndex_ && (goog.object.remove(this.parent_.childIndex_, this.id_), goog.object.add(this.parent_.childIndex_, a, this));
  this.id_ = a;
};
goog.ui.Component.prototype.getElement = function() {
  return this.element_;
};
goog.ui.Component.prototype.getElementStrict = function() {
  var a = this.element_;
  goog.asserts.assert(a, "Can not call getElementStrict before rendering/decorating.");
  return a;
};
goog.ui.Component.prototype.setElementInternal = function(a) {
  this.element_ = a;
};
goog.ui.Component.prototype.getElementsByClass = function(a) {
  return this.element_ ? this.dom_.getElementsByClass(a, this.element_) : [];
};
goog.ui.Component.prototype.getElementByClass = function(a) {
  return this.element_ ? this.dom_.getElementByClass(a, this.element_) : null;
};
goog.ui.Component.prototype.getRequiredElementByClass = function(a) {
  var b = this.getElementByClass(a);
  goog.asserts.assert(b, "Expected element in component with class: %s", a);
  return b;
};
goog.ui.Component.prototype.getHandler = function() {
  this.googUiComponentHandler_ || (this.googUiComponentHandler_ = new goog.events.EventHandler(this));
  return goog.asserts.assert(this.googUiComponentHandler_);
};
goog.ui.Component.prototype.setParent = function(a) {
  if (this == a) {
    throw Error(goog.ui.Component.Error.PARENT_UNABLE_TO_BE_SET);
  }
  if (a && this.parent_ && this.id_ && this.parent_.getChild(this.id_) && this.parent_ != a) {
    throw Error(goog.ui.Component.Error.PARENT_UNABLE_TO_BE_SET);
  }
  this.parent_ = a;
  goog.ui.Component.superClass_.setParentEventTarget.call(this, a);
};
goog.ui.Component.prototype.getParent = function() {
  return this.parent_;
};
goog.ui.Component.prototype.setParentEventTarget = function(a) {
  if (this.parent_ && this.parent_ != a) {
    throw Error(goog.ui.Component.Error.NOT_SUPPORTED);
  }
  goog.ui.Component.superClass_.setParentEventTarget.call(this, a);
};
goog.ui.Component.prototype.getDomHelper = function() {
  return this.dom_;
};
goog.ui.Component.prototype.isInDocument = function() {
  return this.inDocument_;
};
goog.ui.Component.prototype.createDom = function() {
  this.element_ = this.dom_.createElement("DIV");
};
goog.ui.Component.prototype.render = function(a) {
  this.render_(a);
};
goog.ui.Component.prototype.renderBefore = function(a) {
  this.render_(a.parentNode, a);
};
goog.ui.Component.prototype.render_ = function(a, b) {
  if (this.inDocument_) {
    throw Error(goog.ui.Component.Error.ALREADY_RENDERED);
  }
  this.element_ || this.createDom();
  a ? a.insertBefore(this.element_, b || null) : this.dom_.getDocument().body.appendChild(this.element_);
  this.parent_ && !this.parent_.isInDocument() || this.enterDocument();
};
goog.ui.Component.prototype.decorate = function(a) {
  if (this.inDocument_) {
    throw Error(goog.ui.Component.Error.ALREADY_RENDERED);
  }
  if (a && this.canDecorate(a)) {
    this.wasDecorated_ = !0;
    var b = goog.dom.getOwnerDocument(a);
    this.dom_ && this.dom_.getDocument() == b || (this.dom_ = goog.dom.getDomHelper(a));
    this.decorateInternal(a);
    goog.ui.Component.ALLOW_DETACHED_DECORATION && !goog.dom.contains(b, a) || this.enterDocument();
  } else {
    throw Error(goog.ui.Component.Error.DECORATE_INVALID);
  }
};
goog.ui.Component.prototype.canDecorate = function(a) {
  return !0;
};
goog.ui.Component.prototype.wasDecorated = function() {
  return this.wasDecorated_;
};
goog.ui.Component.prototype.decorateInternal = function(a) {
  this.element_ = a;
};
goog.ui.Component.prototype.enterDocument = function() {
  this.inDocument_ = !0;
  this.forEachChild(function(a) {
    !a.isInDocument() && a.getElement() && a.enterDocument();
  });
};
goog.ui.Component.prototype.exitDocument = function() {
  this.forEachChild(function(a) {
    a.isInDocument() && a.exitDocument();
  });
  this.googUiComponentHandler_ && this.googUiComponentHandler_.removeAll();
  this.inDocument_ = !1;
};
goog.ui.Component.prototype.disposeInternal = function() {
  this.inDocument_ && this.exitDocument();
  this.googUiComponentHandler_ && (this.googUiComponentHandler_.dispose(), delete this.googUiComponentHandler_);
  this.forEachChild(function(a) {
    a.dispose();
  });
  !this.wasDecorated_ && this.element_ && goog.dom.removeNode(this.element_);
  this.parent_ = this.model_ = this.element_ = this.childIndex_ = this.children_ = null;
  goog.ui.Component.superClass_.disposeInternal.call(this);
};
goog.ui.Component.prototype.makeId = function(a) {
  return this.getId() + "." + a;
};
goog.ui.Component.prototype.makeIds = function(a) {
  var b = {}, c;
  for (c in a) {
    b[c] = this.makeId(a[c]);
  }
  return b;
};
goog.ui.Component.prototype.getModel = function() {
  return this.model_;
};
goog.ui.Component.prototype.setModel = function(a) {
  this.model_ = a;
};
goog.ui.Component.prototype.getFragmentFromId = function(a) {
  return a.substring(this.getId().length + 1);
};
goog.ui.Component.prototype.getElementByFragment = function(a) {
  if (!this.inDocument_) {
    throw Error(goog.ui.Component.Error.NOT_IN_DOCUMENT);
  }
  return this.dom_.getElement(this.makeId(a));
};
goog.ui.Component.prototype.addChild = function(a, b) {
  this.addChildAt(a, this.getChildCount(), b);
};
goog.ui.Component.prototype.addChildAt = function(a, b, c) {
  goog.asserts.assert(!!a, "Provided element must not be null.");
  if (a.inDocument_ && (c || !this.inDocument_)) {
    throw Error(goog.ui.Component.Error.ALREADY_RENDERED);
  }
  if (0 > b || b > this.getChildCount()) {
    throw Error(goog.ui.Component.Error.CHILD_INDEX_OUT_OF_BOUNDS);
  }
  this.childIndex_ && this.children_ || (this.childIndex_ = {}, this.children_ = []);
  a.getParent() == this ? (goog.object.set(this.childIndex_, a.getId(), a), goog.array.remove(this.children_, a)) : goog.object.add(this.childIndex_, a.getId(), a);
  a.setParent(this);
  goog.array.insertAt(this.children_, a, b);
  a.inDocument_ && this.inDocument_ && a.getParent() == this ? (c = this.getContentElement(), b = c.childNodes[b] || null, b != a.getElement() && c.insertBefore(a.getElement(), b)) : c ? (this.element_ || this.createDom(), b = this.getChildAt(b + 1), a.render_(this.getContentElement(), b ? b.element_ : null)) : this.inDocument_ && !a.inDocument_ && a.element_ && a.element_.parentNode && a.element_.parentNode.nodeType == goog.dom.NodeType.ELEMENT && a.enterDocument();
};
goog.ui.Component.prototype.getContentElement = function() {
  return this.element_;
};
goog.ui.Component.prototype.isRightToLeft = function() {
  null == this.rightToLeft_ && (this.rightToLeft_ = goog.style.isRightToLeft(this.inDocument_ ? this.element_ : this.dom_.getDocument().body));
  return this.rightToLeft_;
};
goog.ui.Component.prototype.setRightToLeft = function(a) {
  if (this.inDocument_) {
    throw Error(goog.ui.Component.Error.ALREADY_RENDERED);
  }
  this.rightToLeft_ = a;
};
goog.ui.Component.prototype.hasChildren = function() {
  return !!this.children_ && 0 != this.children_.length;
};
goog.ui.Component.prototype.getChildCount = function() {
  return this.children_ ? this.children_.length : 0;
};
goog.ui.Component.prototype.getChildIds = function() {
  var a = [];
  this.forEachChild(function(b) {
    a.push(b.getId());
  });
  return a;
};
goog.ui.Component.prototype.getChild = function(a) {
  return this.childIndex_ && a ? goog.object.get(this.childIndex_, a) || null : null;
};
goog.ui.Component.prototype.getChildAt = function(a) {
  return this.children_ ? this.children_[a] || null : null;
};
goog.ui.Component.prototype.forEachChild = function(a, b) {
  this.children_ && goog.array.forEach(this.children_, a, b);
};
goog.ui.Component.prototype.indexOfChild = function(a) {
  return this.children_ && a ? goog.array.indexOf(this.children_, a) : -1;
};
goog.ui.Component.prototype.removeChild = function(a, b) {
  if (a) {
    var c = goog.isString(a) ? a : a.getId();
    a = this.getChild(c);
    c && a && (goog.object.remove(this.childIndex_, c), goog.array.remove(this.children_, a), b && (a.exitDocument(), a.element_ && goog.dom.removeNode(a.element_)), a.setParent(null));
  }
  if (!a) {
    throw Error(goog.ui.Component.Error.NOT_OUR_CHILD);
  }
  return a;
};
goog.ui.Component.prototype.removeChildAt = function(a, b) {
  return this.removeChild(this.getChildAt(a), b);
};
goog.ui.Component.prototype.removeChildren = function(a) {
  for (var b = []; this.hasChildren();) {
    b.push(this.removeChildAt(0, a));
  }
  return b;
};
goog.ui.Component.prototype.pointerEventsEnabled = function() {
  return this.pointerEventsEnabled_;
};
goog.ui.Component.prototype.setPointerEventsEnabled = function(a) {
  if (this.inDocument_) {
    throw Error(goog.ui.Component.Error.ALREADY_RENDERED);
  }
  this.pointerEventsEnabled_ = a;
};
goog.ui.ComponentUtil = {};
goog.ui.ComponentUtil.getMouseEventType = function(a) {
  return a.pointerEventsEnabled() ? goog.events.PointerAsMouseEventType : goog.events.EventType;
};
goog.a11y = {};
goog.a11y.aria = {};
goog.a11y.aria.Role = {ALERT:"alert", ALERTDIALOG:"alertdialog", APPLICATION:"application", ARTICLE:"article", BANNER:"banner", BUTTON:"button", CHECKBOX:"checkbox", COLUMNHEADER:"columnheader", COMBOBOX:"combobox", COMPLEMENTARY:"complementary", CONTENTINFO:"contentinfo", DEFINITION:"definition", DIALOG:"dialog", DIRECTORY:"directory", DOCUMENT:"document", FORM:"form", GRID:"grid", GRIDCELL:"gridcell", GROUP:"group", HEADING:"heading", IMG:"img", LINK:"link", LIST:"list", LISTBOX:"listbox", LISTITEM:"listitem", 
LOG:"log", MAIN:"main", MARQUEE:"marquee", MATH:"math", MENU:"menu", MENUBAR:"menubar", MENU_ITEM:"menuitem", MENU_ITEM_CHECKBOX:"menuitemcheckbox", MENU_ITEM_RADIO:"menuitemradio", NAVIGATION:"navigation", NOTE:"note", OPTION:"option", PRESENTATION:"presentation", PROGRESSBAR:"progressbar", RADIO:"radio", RADIOGROUP:"radiogroup", REGION:"region", ROW:"row", ROWGROUP:"rowgroup", ROWHEADER:"rowheader", SCROLLBAR:"scrollbar", SEARCH:"search", SEPARATOR:"separator", SLIDER:"slider", SPINBUTTON:"spinbutton", 
STATUS:"status", TAB:"tab", TAB_LIST:"tablist", TAB_PANEL:"tabpanel", TEXTBOX:"textbox", TEXTINFO:"textinfo", TIMER:"timer", TOOLBAR:"toolbar", TOOLTIP:"tooltip", TREE:"tree", TREEGRID:"treegrid", TREEITEM:"treeitem"};
goog.a11y.aria.State = {ACTIVEDESCENDANT:"activedescendant", ATOMIC:"atomic", AUTOCOMPLETE:"autocomplete", BUSY:"busy", CHECKED:"checked", COLINDEX:"colindex", CONTROLS:"controls", DESCRIBEDBY:"describedby", DISABLED:"disabled", DROPEFFECT:"dropeffect", EXPANDED:"expanded", FLOWTO:"flowto", GRABBED:"grabbed", HASPOPUP:"haspopup", HIDDEN:"hidden", INVALID:"invalid", LABEL:"label", LABELLEDBY:"labelledby", LEVEL:"level", LIVE:"live", MULTILINE:"multiline", MULTISELECTABLE:"multiselectable", ORIENTATION:"orientation", 
OWNS:"owns", POSINSET:"posinset", PRESSED:"pressed", READONLY:"readonly", RELEVANT:"relevant", REQUIRED:"required", ROWINDEX:"rowindex", SELECTED:"selected", SETSIZE:"setsize", SORT:"sort", VALUEMAX:"valuemax", VALUEMIN:"valuemin", VALUENOW:"valuenow", VALUETEXT:"valuetext"};
goog.a11y.aria.AutoCompleteValues = {INLINE:"inline", LIST:"list", BOTH:"both", NONE:"none"};
goog.a11y.aria.DropEffectValues = {COPY:"copy", MOVE:"move", LINK:"link", EXECUTE:"execute", POPUP:"popup", NONE:"none"};
goog.a11y.aria.LivePriority = {OFF:"off", POLITE:"polite", ASSERTIVE:"assertive"};
goog.a11y.aria.OrientationValues = {VERTICAL:"vertical", HORIZONTAL:"horizontal"};
goog.a11y.aria.RelevantValues = {ADDITIONS:"additions", REMOVALS:"removals", TEXT:"text", ALL:"all"};
goog.a11y.aria.SortValues = {ASCENDING:"ascending", DESCENDING:"descending", NONE:"none", OTHER:"other"};
goog.a11y.aria.CheckedValues = {TRUE:"true", FALSE:"false", MIXED:"mixed", UNDEFINED:"undefined"};
goog.a11y.aria.ExpandedValues = {TRUE:"true", FALSE:"false", UNDEFINED:"undefined"};
goog.a11y.aria.GrabbedValues = {TRUE:"true", FALSE:"false", UNDEFINED:"undefined"};
goog.a11y.aria.InvalidValues = {FALSE:"false", TRUE:"true", GRAMMAR:"grammar", SPELLING:"spelling"};
goog.a11y.aria.PressedValues = {TRUE:"true", FALSE:"false", MIXED:"mixed", UNDEFINED:"undefined"};
goog.a11y.aria.SelectedValues = {TRUE:"true", FALSE:"false", UNDEFINED:"undefined"};
goog.a11y.aria.datatables = {};
goog.a11y.aria.datatables.getDefaultValuesMap = function() {
  goog.a11y.aria.DefaultStateValueMap_ || (goog.a11y.aria.DefaultStateValueMap_ = {[goog.a11y.aria.State.ATOMIC]:!1, [goog.a11y.aria.State.AUTOCOMPLETE]:"none", [goog.a11y.aria.State.DROPEFFECT]:"none", [goog.a11y.aria.State.HASPOPUP]:!1, [goog.a11y.aria.State.LIVE]:"off", [goog.a11y.aria.State.MULTILINE]:!1, [goog.a11y.aria.State.MULTISELECTABLE]:!1, [goog.a11y.aria.State.ORIENTATION]:"vertical", [goog.a11y.aria.State.READONLY]:!1, [goog.a11y.aria.State.RELEVANT]:"additions text", [goog.a11y.aria.State.REQUIRED]:!1, 
  [goog.a11y.aria.State.SORT]:"none", [goog.a11y.aria.State.BUSY]:!1, [goog.a11y.aria.State.DISABLED]:!1, [goog.a11y.aria.State.HIDDEN]:!1, [goog.a11y.aria.State.INVALID]:"false"});
  return goog.a11y.aria.DefaultStateValueMap_;
};
goog.a11y.aria.ARIA_PREFIX_ = "aria-";
goog.a11y.aria.ROLE_ATTRIBUTE_ = "role";
goog.a11y.aria.TAGS_WITH_ASSUMED_ROLES_ = {["A AREA BUTTON HEAD INPUT LINK MENU META OPTGROUP OPTION PROGRESS STYLE SELECT SOURCE TEXTAREA TITLE TRACK".split(" ")]:!0};
goog.a11y.aria.CONTAINER_ROLES_ = [goog.a11y.aria.Role.COMBOBOX, goog.a11y.aria.Role.GRID, goog.a11y.aria.Role.GROUP, goog.a11y.aria.Role.LISTBOX, goog.a11y.aria.Role.MENU, goog.a11y.aria.Role.MENUBAR, goog.a11y.aria.Role.RADIOGROUP, goog.a11y.aria.Role.ROW, goog.a11y.aria.Role.ROWGROUP, goog.a11y.aria.Role.TAB_LIST, goog.a11y.aria.Role.TEXTBOX, goog.a11y.aria.Role.TOOLBAR, goog.a11y.aria.Role.TREE, goog.a11y.aria.Role.TREEGRID];
goog.a11y.aria.setRole = function(a, b) {
  b ? (goog.asserts.ENABLE_ASSERTS && goog.asserts.assert(goog.object.containsValue(goog.a11y.aria.Role, b), "No such ARIA role " + b), a.setAttribute(goog.a11y.aria.ROLE_ATTRIBUTE_, b)) : goog.a11y.aria.removeRole(a);
};
goog.a11y.aria.getRole = function(a) {
  return a.getAttribute(goog.a11y.aria.ROLE_ATTRIBUTE_) || null;
};
goog.a11y.aria.removeRole = function(a) {
  a.removeAttribute(goog.a11y.aria.ROLE_ATTRIBUTE_);
};
goog.a11y.aria.setState = function(a, b, c) {
  goog.isArray(c) && (c = c.join(" "));
  var d = goog.a11y.aria.getAriaAttributeName_(b);
  "" === c || void 0 == c ? (c = goog.a11y.aria.datatables.getDefaultValuesMap(), b in c ? a.setAttribute(d, c[b]) : a.removeAttribute(d)) : a.setAttribute(d, c);
};
goog.a11y.aria.toggleState = function(a, b) {
  var c = goog.a11y.aria.getState(a, b);
  goog.string.isEmptyOrWhitespace(goog.string.makeSafe(c)) || "true" == c || "false" == c ? goog.a11y.aria.setState(a, b, "true" == c ? "false" : "true") : goog.a11y.aria.removeState(a, b);
};
goog.a11y.aria.removeState = function(a, b) {
  a.removeAttribute(goog.a11y.aria.getAriaAttributeName_(b));
};
goog.a11y.aria.getState = function(a, b) {
  a = a.getAttribute(goog.a11y.aria.getAriaAttributeName_(b));
  return null == a || void 0 == a ? "" : String(a);
};
goog.a11y.aria.getActiveDescendant = function(a) {
  var b = goog.a11y.aria.getState(a, goog.a11y.aria.State.ACTIVEDESCENDANT);
  return goog.dom.getOwnerDocument(a).getElementById(b);
};
goog.a11y.aria.setActiveDescendant = function(a, b) {
  var c = "";
  b && (c = b.id, goog.asserts.assert(c, "The active element should have an id."));
  goog.a11y.aria.setState(a, goog.a11y.aria.State.ACTIVEDESCENDANT, c);
};
goog.a11y.aria.getLabel = function(a) {
  return goog.a11y.aria.getState(a, goog.a11y.aria.State.LABEL);
};
goog.a11y.aria.setLabel = function(a, b) {
  goog.a11y.aria.setState(a, goog.a11y.aria.State.LABEL, b);
};
goog.a11y.aria.assertRoleIsSetInternalUtil = function(a, b) {
  goog.a11y.aria.TAGS_WITH_ASSUMED_ROLES_[a.tagName] || (a = goog.a11y.aria.getRole(a), goog.asserts.assert(null != a, "The element ARIA role cannot be null."), goog.asserts.assert(goog.array.contains(b, a), 'Non existing or incorrect role set for element.The role set is "' + a + '". The role should be any of "' + b + '". Check the ARIA specification for more details http://www.w3.org/TR/wai-aria/roles.'));
};
goog.a11y.aria.getStateBoolean = function(a, b) {
  a = a.getAttribute(goog.a11y.aria.getAriaAttributeName_(b));
  goog.asserts.assert(goog.isBoolean(a) || null == a || "true" == a || "false" == a);
  return null == a ? a : goog.isBoolean(a) ? a : "true" == a;
};
goog.a11y.aria.getStateNumber = function(a, b) {
  a = a.getAttribute(goog.a11y.aria.getAriaAttributeName_(b));
  goog.asserts.assert((null == a || !isNaN(Number(a))) && !goog.isBoolean(a));
  return null == a ? null : Number(a);
};
goog.a11y.aria.getStateString = function(a, b) {
  a = a.getAttribute(goog.a11y.aria.getAriaAttributeName_(b));
  goog.asserts.assert((null == a || goog.isString(a)) && ("" == a || isNaN(Number(a))) && "true" != a && "false" != a);
  return null == a || "" == a ? null : a;
};
goog.a11y.aria.getStringArrayStateInternalUtil = function(a, b) {
  a = a.getAttribute(goog.a11y.aria.getAriaAttributeName_(b));
  return goog.a11y.aria.splitStringOnWhitespace_(a);
};
goog.a11y.aria.hasState = function(a, b) {
  return a.hasAttribute(goog.a11y.aria.getAriaAttributeName_(b));
};
goog.a11y.aria.isContainerRole = function(a) {
  a = goog.a11y.aria.getRole(a);
  return goog.array.contains(goog.a11y.aria.CONTAINER_ROLES_, a);
};
goog.a11y.aria.splitStringOnWhitespace_ = function(a) {
  return a ? a.split(/\s+/) : [];
};
goog.a11y.aria.getAriaAttributeName_ = function(a) {
  goog.asserts.ENABLE_ASSERTS && (goog.asserts.assert(a, "ARIA attribute cannot be empty."), goog.asserts.assert(goog.object.containsValue(goog.a11y.aria.State, a), "No such ARIA attribute " + a));
  return goog.a11y.aria.ARIA_PREFIX_ + a;
};
goog.ui.ControlRenderer = function() {
};
goog.addSingletonGetter(goog.ui.ControlRenderer);
goog.tagUnsealableClass(goog.ui.ControlRenderer);
goog.ui.ControlRenderer.getCustomRenderer = function(a, b) {
  a = new a;
  a.getCssClass = function() {
    return b;
  };
  return a;
};
goog.ui.ControlRenderer.CSS_CLASS = "goog-control";
goog.ui.ControlRenderer.IE6_CLASS_COMBINATIONS = [];
goog.ui.ControlRenderer.TOGGLE_ARIA_STATE_MAP_ = {[goog.a11y.aria.Role.BUTTON]:goog.a11y.aria.State.PRESSED, [goog.a11y.aria.Role.CHECKBOX]:goog.a11y.aria.State.CHECKED, [goog.a11y.aria.Role.MENU_ITEM]:goog.a11y.aria.State.SELECTED, [goog.a11y.aria.Role.MENU_ITEM_CHECKBOX]:goog.a11y.aria.State.CHECKED, [goog.a11y.aria.Role.MENU_ITEM_RADIO]:goog.a11y.aria.State.CHECKED, [goog.a11y.aria.Role.RADIO]:goog.a11y.aria.State.CHECKED, [goog.a11y.aria.Role.TAB]:goog.a11y.aria.State.SELECTED, [goog.a11y.aria.Role.TREEITEM]:goog.a11y.aria.State.SELECTED};
goog.ui.ControlRenderer.prototype.getAriaRole = function() {
};
goog.ui.ControlRenderer.prototype.createDom = function(a) {
  return a.getDomHelper().createDom("DIV", this.getClassNames(a).join(" "), a.getContent());
};
goog.ui.ControlRenderer.prototype.getContentElement = function(a) {
  return a;
};
goog.ui.ControlRenderer.prototype.enableClassName = function(a, b, c) {
  if (a = a.getElement ? a.getElement() : a) {
    var d = [b];
    goog.userAgent.IE && !goog.userAgent.isVersionOrHigher("7") && (d = this.getAppliedCombinedClassNames_(goog.dom.classlist.get(a), b), d.push(b));
    goog.dom.classlist.enableAll(a, d, c);
  }
};
goog.ui.ControlRenderer.prototype.enableExtraClassName = function(a, b, c) {
  this.enableClassName(a, b, c);
};
goog.ui.ControlRenderer.prototype.canDecorate = function(a) {
  return !0;
};
goog.ui.ControlRenderer.prototype.decorate = function(a, b) {
  b.id && a.setId(b.id);
  var c = this.getContentElement(b);
  c && c.firstChild ? a.setContentInternal(c.firstChild.nextSibling ? goog.array.clone(c.childNodes) : c.firstChild) : a.setContentInternal(null);
  var d = 0, e = this.getCssClass(), f = this.getStructuralCssClass(), g = !1, h = !1, k = !1, l = goog.array.toArray(goog.dom.classlist.get(b));
  goog.array.forEach(l, function(a) {
    g || a != e ? h || a != f ? d |= this.getStateFromClass(a) : h = !0 : (g = !0, f == e && (h = !0));
    this.getStateFromClass(a) == goog.ui.Component.State.DISABLED && (goog.asserts.assertElement(c), goog.dom.isFocusableTabIndex(c) && goog.dom.setFocusableTabIndex(c, !1));
  }, this);
  a.setStateInternal(d);
  g || (l.push(e), f == e && (h = !0));
  h || l.push(f);
  (a = a.getExtraClassNames()) && l.push.apply(l, a);
  if (goog.userAgent.IE && !goog.userAgent.isVersionOrHigher("7")) {
    var m = this.getAppliedCombinedClassNames_(l);
    0 < m.length && (l.push.apply(l, m), k = !0);
  }
  g && h && !a && !k || goog.dom.classlist.set(b, l.join(" "));
  return b;
};
goog.ui.ControlRenderer.prototype.initializeDom = function(a) {
  a.isRightToLeft() && this.setRightToLeft(a.getElement(), !0);
  a.isEnabled() && this.setFocusable(a, a.isVisible());
};
goog.ui.ControlRenderer.prototype.setAriaRole = function(a, b) {
  if (b = b || this.getAriaRole()) {
    goog.asserts.assert(a, "The element passed as a first parameter cannot be null.");
    var c = goog.a11y.aria.getRole(a);
    b != c && goog.a11y.aria.setRole(a, b);
  }
};
goog.ui.ControlRenderer.prototype.setAriaStates = function(a, b) {
  goog.asserts.assert(a);
  goog.asserts.assert(b);
  var c = a.getAriaLabel();
  goog.isDefAndNotNull(c) && this.setAriaLabel(b, c);
  a.isVisible() || goog.a11y.aria.setState(b, goog.a11y.aria.State.HIDDEN, !a.isVisible());
  a.isEnabled() || this.updateAriaState(b, goog.ui.Component.State.DISABLED, !a.isEnabled());
  a.isSupportedState(goog.ui.Component.State.SELECTED) && this.updateAriaState(b, goog.ui.Component.State.SELECTED, a.isSelected());
  a.isSupportedState(goog.ui.Component.State.CHECKED) && this.updateAriaState(b, goog.ui.Component.State.CHECKED, a.isChecked());
  a.isSupportedState(goog.ui.Component.State.OPENED) && this.updateAriaState(b, goog.ui.Component.State.OPENED, a.isOpen());
};
goog.ui.ControlRenderer.prototype.setAriaLabel = function(a, b) {
  goog.a11y.aria.setLabel(a, b);
};
goog.ui.ControlRenderer.prototype.setAllowTextSelection = function(a, b) {
  goog.style.setUnselectable(a, !b, !goog.userAgent.IE && !goog.userAgent.OPERA);
};
goog.ui.ControlRenderer.prototype.setRightToLeft = function(a, b) {
  this.enableClassName(a, this.getStructuralCssClass() + "-rtl", b);
};
goog.ui.ControlRenderer.prototype.isFocusable = function(a) {
  var b;
  return a.isSupportedState(goog.ui.Component.State.FOCUSED) && (b = a.getKeyEventTarget()) ? goog.dom.isFocusableTabIndex(b) : !1;
};
goog.ui.ControlRenderer.prototype.setFocusable = function(a, b) {
  var c;
  if (a.isSupportedState(goog.ui.Component.State.FOCUSED) && (c = a.getKeyEventTarget())) {
    if (!b && a.isFocused()) {
      try {
        c.blur();
      } catch (d) {
      }
      a.isFocused() && a.handleBlur(null);
    }
    goog.dom.isFocusableTabIndex(c) != b && goog.dom.setFocusableTabIndex(c, b);
  }
};
goog.ui.ControlRenderer.prototype.setVisible = function(a, b) {
  goog.style.setElementShown(a, b);
  a && goog.a11y.aria.setState(a, goog.a11y.aria.State.HIDDEN, !b);
};
goog.ui.ControlRenderer.prototype.setState = function(a, b, c) {
  var d = a.getElement();
  if (d) {
    var e = this.getClassForState(b);
    e && this.enableClassName(a, e, c);
    this.updateAriaState(d, b, c);
  }
};
goog.ui.ControlRenderer.prototype.updateAriaState = function(a, b, c) {
  goog.ui.ControlRenderer.ariaAttributeMap_ || (goog.ui.ControlRenderer.ariaAttributeMap_ = {[goog.ui.Component.State.DISABLED]:goog.a11y.aria.State.DISABLED, [goog.ui.Component.State.SELECTED]:goog.a11y.aria.State.SELECTED, [goog.ui.Component.State.CHECKED]:goog.a11y.aria.State.CHECKED, [goog.ui.Component.State.OPENED]:goog.a11y.aria.State.EXPANDED});
  goog.asserts.assert(a, "The element passed as a first parameter cannot be null.");
  (b = goog.ui.ControlRenderer.getAriaStateForAriaRole_(a, goog.ui.ControlRenderer.ariaAttributeMap_[b])) && goog.a11y.aria.setState(a, b, c);
};
goog.ui.ControlRenderer.getAriaStateForAriaRole_ = function(a, b) {
  a = goog.a11y.aria.getRole(a);
  if (!a) {
    return b;
  }
  a = goog.ui.ControlRenderer.TOGGLE_ARIA_STATE_MAP_[a] || b;
  return goog.ui.ControlRenderer.isAriaState_(b) ? a : b;
};
goog.ui.ControlRenderer.isAriaState_ = function(a) {
  return a == goog.a11y.aria.State.CHECKED || a == goog.a11y.aria.State.SELECTED;
};
goog.ui.ControlRenderer.prototype.setContent = function(a, b) {
  var c = this.getContentElement(a);
  c && (goog.dom.removeChildren(c), b && (goog.isString(b) ? goog.dom.setTextContent(c, b) : (a = function(a) {
    if (a) {
      var b = goog.dom.getOwnerDocument(c);
      c.appendChild(goog.isString(a) ? b.createTextNode(a) : a);
    }
  }, goog.isArray(b) ? goog.array.forEach(b, a) : !goog.isArrayLike(b) || "nodeType" in b ? a(b) : goog.array.forEach(goog.array.clone(b), a))));
};
goog.ui.ControlRenderer.prototype.getKeyEventTarget = function(a) {
  return a.getElement();
};
goog.ui.ControlRenderer.prototype.getCssClass = function() {
  return goog.ui.ControlRenderer.CSS_CLASS;
};
goog.ui.ControlRenderer.prototype.getIe6ClassCombinations = function() {
  return [];
};
goog.ui.ControlRenderer.prototype.getStructuralCssClass = function() {
  return this.getCssClass();
};
goog.ui.ControlRenderer.prototype.getClassNames = function(a) {
  var b = this.getCssClass(), c = [b], d = this.getStructuralCssClass();
  d != b && c.push(d);
  b = this.getClassNamesForState(a.getState());
  c.push.apply(c, b);
  (a = a.getExtraClassNames()) && c.push.apply(c, a);
  goog.userAgent.IE && !goog.userAgent.isVersionOrHigher("7") && c.push.apply(c, this.getAppliedCombinedClassNames_(c));
  return c;
};
goog.ui.ControlRenderer.prototype.getAppliedCombinedClassNames_ = function(a, b) {
  var c = [];
  b && (a = goog.array.concat(a, [b]));
  goog.array.forEach(this.getIe6ClassCombinations(), function(d) {
    !goog.array.every(d, goog.partial(goog.array.contains, a)) || b && !goog.array.contains(d, b) || c.push(d.join("_"));
  });
  return c;
};
goog.ui.ControlRenderer.prototype.getClassNamesForState = function(a) {
  for (var b = []; a;) {
    var c = a & -a;
    b.push(this.getClassForState(c));
    a &= ~c;
  }
  return b;
};
goog.ui.ControlRenderer.prototype.getClassForState = function(a) {
  this.classByState_ || this.createClassByStateMap_();
  return this.classByState_[a];
};
goog.ui.ControlRenderer.prototype.getStateFromClass = function(a) {
  this.stateByClass_ || this.createStateByClassMap_();
  a = parseInt(this.stateByClass_[a], 10);
  return isNaN(a) ? 0 : a;
};
goog.ui.ControlRenderer.prototype.createClassByStateMap_ = function() {
  var a = this.getStructuralCssClass(), b = !goog.string.contains(goog.string.normalizeWhitespace(a), " ");
  goog.asserts.assert(b, "ControlRenderer has an invalid css class: '" + a + "'");
  this.classByState_ = {[goog.ui.Component.State.DISABLED]:a + "-disabled", [goog.ui.Component.State.HOVER]:a + "-hover", [goog.ui.Component.State.ACTIVE]:a + "-active", [goog.ui.Component.State.SELECTED]:a + "-selected", [goog.ui.Component.State.CHECKED]:a + "-checked", [goog.ui.Component.State.FOCUSED]:a + "-focused", [goog.ui.Component.State.OPENED]:a + "-open"};
};
goog.ui.ControlRenderer.prototype.createStateByClassMap_ = function() {
  this.classByState_ || this.createClassByStateMap_();
  this.stateByClass_ = goog.object.transpose(this.classByState_);
};
goog.ui.registry = {};
goog.ui.registry.getDefaultRenderer = function(a) {
  for (var b; a;) {
    b = goog.getUid(a);
    if (b = goog.ui.registry.defaultRenderers_[b]) {
      break;
    }
    a = a.superClass_ ? a.superClass_.constructor : null;
  }
  return b ? goog.isFunction(b.getInstance) ? b.getInstance() : new b : null;
};
goog.ui.registry.setDefaultRenderer = function(a, b) {
  if (!goog.isFunction(a)) {
    throw Error("Invalid component class " + a);
  }
  if (!goog.isFunction(b)) {
    throw Error("Invalid renderer class " + b);
  }
  a = goog.getUid(a);
  goog.ui.registry.defaultRenderers_[a] = b;
};
goog.ui.registry.getDecoratorByClassName = function(a) {
  return a in goog.ui.registry.decoratorFunctions_ ? goog.ui.registry.decoratorFunctions_[a]() : null;
};
goog.ui.registry.setDecoratorByClassName = function(a, b) {
  if (!a) {
    throw Error("Invalid class name " + a);
  }
  if (!goog.isFunction(b)) {
    throw Error("Invalid decorator function " + b);
  }
  goog.ui.registry.decoratorFunctions_[a] = b;
};
goog.ui.registry.getDecorator = function(a) {
  goog.asserts.assert(a);
  for (var b = goog.dom.classlist.get(a), c = 0, d = b.length; c < d; c++) {
    if (a = goog.ui.registry.getDecoratorByClassName(b[c])) {
      return a;
    }
  }
  return null;
};
goog.ui.registry.reset = function() {
  goog.ui.registry.defaultRenderers_ = {};
  goog.ui.registry.decoratorFunctions_ = {};
};
goog.ui.registry.defaultRenderers_ = {};
goog.ui.registry.decoratorFunctions_ = {};
goog.ui.Control = function(a, b, c) {
  goog.ui.Component.call(this, c);
  this.renderer_ = b || goog.ui.registry.getDefaultRenderer(this.constructor);
  this.setContentInternal(goog.isDef(a) ? a : null);
  this.ariaLabel_ = null;
};
goog.inherits(goog.ui.Control, goog.ui.Component);
goog.tagUnsealableClass(goog.ui.Control);
goog.ui.Control.registerDecorator = goog.ui.registry.setDecoratorByClassName;
goog.ui.Control.getDecorator = goog.ui.registry.getDecorator;
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
  return this.handleMouseEvents_;
};
goog.ui.Control.prototype.setHandleMouseEvents = function(a) {
  this.isInDocument() && a != this.handleMouseEvents_ && this.enableMouseEventHandling_(a);
  this.handleMouseEvents_ = a;
};
goog.ui.Control.prototype.getKeyEventTarget = function() {
  return this.renderer_.getKeyEventTarget(this);
};
goog.ui.Control.prototype.getKeyHandler = function() {
  return this.keyHandler_ || (this.keyHandler_ = new goog.events.KeyHandler);
};
goog.ui.Control.prototype.getRenderer = function() {
  return this.renderer_;
};
goog.ui.Control.prototype.setRenderer = function(a) {
  if (this.isInDocument()) {
    throw Error(goog.ui.Component.Error.ALREADY_RENDERED);
  }
  this.getElement() && this.setElementInternal(null);
  this.renderer_ = a;
};
goog.ui.Control.prototype.getExtraClassNames = function() {
  return this.extraClassNames_;
};
goog.ui.Control.prototype.addClassName = function(a) {
  a && (this.extraClassNames_ ? goog.array.contains(this.extraClassNames_, a) || this.extraClassNames_.push(a) : this.extraClassNames_ = [a], this.renderer_.enableExtraClassName(this, a, !0));
};
goog.ui.Control.prototype.removeClassName = function(a) {
  a && this.extraClassNames_ && goog.array.remove(this.extraClassNames_, a) && (0 == this.extraClassNames_.length && (this.extraClassNames_ = null), this.renderer_.enableExtraClassName(this, a, !1));
};
goog.ui.Control.prototype.enableClassName = function(a, b) {
  b ? this.addClassName(a) : this.removeClassName(a);
};
goog.ui.Control.prototype.createDom = function() {
  var a = this.renderer_.createDom(this);
  this.setElementInternal(a);
  this.renderer_.setAriaRole(a, this.getPreferredAriaRole());
  this.isAllowTextSelection() || this.renderer_.setAllowTextSelection(a, !1);
  this.isVisible() || this.renderer_.setVisible(a, !1);
};
goog.ui.Control.prototype.getPreferredAriaRole = function() {
  return this.preferredAriaRole_;
};
goog.ui.Control.prototype.setPreferredAriaRole = function(a) {
  this.preferredAriaRole_ = a;
};
goog.ui.Control.prototype.getAriaLabel = function() {
  return this.ariaLabel_;
};
goog.ui.Control.prototype.setAriaLabel = function(a) {
  this.ariaLabel_ = a;
  var b = this.getElement();
  b && this.renderer_.setAriaLabel(b, a);
};
goog.ui.Control.prototype.getContentElement = function() {
  return this.renderer_.getContentElement(this.getElement());
};
goog.ui.Control.prototype.canDecorate = function(a) {
  return this.renderer_.canDecorate(a);
};
goog.ui.Control.prototype.decorateInternal = function(a) {
  a = this.renderer_.decorate(this, a);
  this.setElementInternal(a);
  this.renderer_.setAriaRole(a, this.getPreferredAriaRole());
  this.isAllowTextSelection() || this.renderer_.setAllowTextSelection(a, !1);
  this.visible_ = "none" != a.style.display;
};
goog.ui.Control.prototype.enterDocument = function() {
  goog.ui.Control.superClass_.enterDocument.call(this);
  this.renderer_.setAriaStates(this, this.getElementStrict());
  this.renderer_.initializeDom(this);
  if (this.supportedStates_ & ~goog.ui.Component.State.DISABLED && (this.isHandleMouseEvents() && this.enableMouseEventHandling_(!0), this.isSupportedState(goog.ui.Component.State.FOCUSED))) {
    var a = this.getKeyEventTarget();
    if (a) {
      var b = this.getKeyHandler();
      b.attach(a);
      this.getHandler().listen(b, goog.events.KeyHandler.EventType.KEY, this.handleKeyEvent).listen(a, goog.events.EventType.FOCUS, this.handleFocus).listen(a, goog.events.EventType.BLUR, this.handleBlur);
    }
  }
};
goog.ui.Control.prototype.enableMouseEventHandling_ = function(a) {
  var b = goog.ui.ComponentUtil.getMouseEventType(this), c = this.getHandler(), d = this.getElement();
  a ? (c.listen(d, b.MOUSEOVER, this.handleMouseOver).listen(d, b.MOUSEDOWN, this.handleMouseDown).listen(d, [b.MOUSEUP, b.MOUSECANCEL], this.handleMouseUp).listen(d, b.MOUSEOUT, this.handleMouseOut), this.pointerEventsEnabled() && c.listen(d, goog.events.EventType.GOTPOINTERCAPTURE, this.preventPointerCapture_), this.handleContextMenu != goog.nullFunction && c.listen(d, goog.events.EventType.CONTEXTMENU, this.handleContextMenu), goog.userAgent.IE && (goog.userAgent.isVersionOrHigher(9) || c.listen(d, 
  goog.events.EventType.DBLCLICK, this.handleDblClick), this.ieMouseEventSequenceSimulator_ || (this.ieMouseEventSequenceSimulator_ = new goog.ui.Control.IeMouseEventSequenceSimulator_(this), this.registerDisposable(this.ieMouseEventSequenceSimulator_)))) : (c.unlisten(d, b.MOUSEOVER, this.handleMouseOver).unlisten(d, b.MOUSEDOWN, this.handleMouseDown).unlisten(d, [b.MOUSEUP, b.MOUSECANCEL], this.handleMouseUp).unlisten(d, b.MOUSEOUT, this.handleMouseOut), this.pointerEventsEnabled() && c.unlisten(d, 
  goog.events.EventType.GOTPOINTERCAPTURE, this.preventPointerCapture_), this.handleContextMenu != goog.nullFunction && c.unlisten(d, goog.events.EventType.CONTEXTMENU, this.handleContextMenu), goog.userAgent.IE && (goog.userAgent.isVersionOrHigher(9) || c.unlisten(d, goog.events.EventType.DBLCLICK, this.handleDblClick), goog.dispose(this.ieMouseEventSequenceSimulator_), this.ieMouseEventSequenceSimulator_ = null));
};
goog.ui.Control.prototype.exitDocument = function() {
  goog.ui.Control.superClass_.exitDocument.call(this);
  this.keyHandler_ && this.keyHandler_.detach();
  this.isVisible() && this.isEnabled() && this.renderer_.setFocusable(this, !1);
};
goog.ui.Control.prototype.disposeInternal = function() {
  goog.ui.Control.superClass_.disposeInternal.call(this);
  this.keyHandler_ && (this.keyHandler_.dispose(), delete this.keyHandler_);
  delete this.renderer_;
  this.ieMouseEventSequenceSimulator_ = this.extraClassNames_ = this.content_ = null;
};
goog.ui.Control.prototype.getContent = function() {
  return this.content_;
};
goog.ui.Control.prototype.setContent = function(a) {
  this.renderer_.setContent(this.getElement(), a);
  this.setContentInternal(a);
};
goog.ui.Control.prototype.setContentInternal = function(a) {
  this.content_ = a;
};
goog.ui.Control.prototype.getCaption = function() {
  var a = this.getContent();
  if (!a) {
    return "";
  }
  a = goog.isString(a) ? a : goog.isArray(a) ? goog.array.map(a, goog.dom.getRawTextContent).join("") : goog.dom.getTextContent(a);
  return goog.string.collapseBreakingSpaces(a);
};
goog.ui.Control.prototype.setCaption = function(a) {
  this.setContent(a);
};
goog.ui.Control.prototype.setRightToLeft = function(a) {
  goog.ui.Control.superClass_.setRightToLeft.call(this, a);
  var b = this.getElement();
  b && this.renderer_.setRightToLeft(b, a);
};
goog.ui.Control.prototype.isAllowTextSelection = function() {
  return this.allowTextSelection_;
};
goog.ui.Control.prototype.setAllowTextSelection = function(a) {
  this.allowTextSelection_ = a;
  var b = this.getElement();
  b && this.renderer_.setAllowTextSelection(b, a);
};
goog.ui.Control.prototype.isVisible = function() {
  return this.visible_;
};
goog.ui.Control.prototype.setVisible = function(a, b) {
  return b || this.visible_ != a && this.dispatchEvent(a ? goog.ui.Component.EventType.SHOW : goog.ui.Component.EventType.HIDE) ? ((b = this.getElement()) && this.renderer_.setVisible(b, a), this.isEnabled() && this.renderer_.setFocusable(this, a), this.visible_ = a, !0) : !1;
};
goog.ui.Control.prototype.isEnabled = function() {
  return !this.hasState(goog.ui.Component.State.DISABLED);
};
goog.ui.Control.prototype.isParentDisabled_ = function() {
  var a = this.getParent();
  return !!a && "function" == typeof a.isEnabled && !a.isEnabled();
};
goog.ui.Control.prototype.setEnabled = function(a) {
  !this.isParentDisabled_() && this.isTransitionAllowed(goog.ui.Component.State.DISABLED, !a) && (a || (this.setActive(!1), this.setHighlighted(!1)), this.isVisible() && this.renderer_.setFocusable(this, a), this.setState(goog.ui.Component.State.DISABLED, !a, !0));
};
goog.ui.Control.prototype.isHighlighted = function() {
  return this.hasState(goog.ui.Component.State.HOVER);
};
goog.ui.Control.prototype.setHighlighted = function(a) {
  this.isTransitionAllowed(goog.ui.Component.State.HOVER, a) && this.setState(goog.ui.Component.State.HOVER, a);
};
goog.ui.Control.prototype.isActive = function() {
  return this.hasState(goog.ui.Component.State.ACTIVE);
};
goog.ui.Control.prototype.setActive = function(a) {
  this.isTransitionAllowed(goog.ui.Component.State.ACTIVE, a) && this.setState(goog.ui.Component.State.ACTIVE, a);
};
goog.ui.Control.prototype.isSelected = function() {
  return this.hasState(goog.ui.Component.State.SELECTED);
};
goog.ui.Control.prototype.setSelected = function(a) {
  this.isTransitionAllowed(goog.ui.Component.State.SELECTED, a) && this.setState(goog.ui.Component.State.SELECTED, a);
};
goog.ui.Control.prototype.isChecked = function() {
  return this.hasState(goog.ui.Component.State.CHECKED);
};
goog.ui.Control.prototype.setChecked = function(a) {
  this.isTransitionAllowed(goog.ui.Component.State.CHECKED, a) && this.setState(goog.ui.Component.State.CHECKED, a);
};
goog.ui.Control.prototype.isFocused = function() {
  return this.hasState(goog.ui.Component.State.FOCUSED);
};
goog.ui.Control.prototype.setFocused = function(a) {
  this.isTransitionAllowed(goog.ui.Component.State.FOCUSED, a) && this.setState(goog.ui.Component.State.FOCUSED, a);
};
goog.ui.Control.prototype.isOpen = function() {
  return this.hasState(goog.ui.Component.State.OPENED);
};
goog.ui.Control.prototype.setOpen = function(a) {
  this.isTransitionAllowed(goog.ui.Component.State.OPENED, a) && this.setState(goog.ui.Component.State.OPENED, a);
};
goog.ui.Control.prototype.getState = function() {
  return this.state_;
};
goog.ui.Control.prototype.hasState = function(a) {
  return !!(this.state_ & a);
};
goog.ui.Control.prototype.setState = function(a, b, c) {
  c || a != goog.ui.Component.State.DISABLED ? this.isSupportedState(a) && b != this.hasState(a) && (this.renderer_.setState(this, a, b), this.state_ = b ? this.state_ | a : this.state_ & ~a) : this.setEnabled(!b);
};
goog.ui.Control.prototype.setStateInternal = function(a) {
  this.state_ = a;
};
goog.ui.Control.prototype.isSupportedState = function(a) {
  return !!(this.supportedStates_ & a);
};
goog.ui.Control.prototype.setSupportedState = function(a, b) {
  if (this.isInDocument() && this.hasState(a) && !b) {
    throw Error(goog.ui.Component.Error.ALREADY_RENDERED);
  }
  !b && this.hasState(a) && this.setState(a, !1);
  this.supportedStates_ = b ? this.supportedStates_ | a : this.supportedStates_ & ~a;
};
goog.ui.Control.prototype.isAutoState = function(a) {
  return !!(this.autoStates_ & a) && this.isSupportedState(a);
};
goog.ui.Control.prototype.setAutoStates = function(a, b) {
  this.autoStates_ = b ? this.autoStates_ | a : this.autoStates_ & ~a;
};
goog.ui.Control.prototype.isDispatchTransitionEvents = function(a) {
  return !!(this.statesWithTransitionEvents_ & a) && this.isSupportedState(a);
};
goog.ui.Control.prototype.setDispatchTransitionEvents = function(a, b) {
  this.statesWithTransitionEvents_ = b ? this.statesWithTransitionEvents_ | a : this.statesWithTransitionEvents_ & ~a;
};
goog.ui.Control.prototype.isTransitionAllowed = function(a, b) {
  return this.isSupportedState(a) && this.hasState(a) != b && (!(this.statesWithTransitionEvents_ & a) || this.dispatchEvent(goog.ui.Component.getStateTransitionEvent(a, b))) && !this.isDisposed();
};
goog.ui.Control.prototype.handleMouseOver = function(a) {
  !goog.ui.Control.isMouseEventWithinElement_(a, this.getElement()) && this.dispatchEvent(goog.ui.Component.EventType.ENTER) && this.isEnabled() && this.isAutoState(goog.ui.Component.State.HOVER) && this.setHighlighted(!0);
};
goog.ui.Control.prototype.handleMouseOut = function(a) {
  !goog.ui.Control.isMouseEventWithinElement_(a, this.getElement()) && this.dispatchEvent(goog.ui.Component.EventType.LEAVE) && (this.isAutoState(goog.ui.Component.State.ACTIVE) && this.setActive(!1), this.isAutoState(goog.ui.Component.State.HOVER) && this.setHighlighted(!1));
};
goog.ui.Control.prototype.preventPointerCapture_ = function(a) {
  var b = a.target;
  b.releasePointerCapture && b.releasePointerCapture(a.pointerId);
};
goog.ui.Control.prototype.handleContextMenu = goog.nullFunction;
goog.ui.Control.isMouseEventWithinElement_ = function(a, b) {
  return !!a.relatedTarget && goog.dom.contains(b, a.relatedTarget);
};
goog.ui.Control.prototype.handleMouseDown = function(a) {
  this.isEnabled() && (this.isAutoState(goog.ui.Component.State.HOVER) && this.setHighlighted(!0), a.isMouseActionButton() && (this.isAutoState(goog.ui.Component.State.ACTIVE) && this.setActive(!0), this.renderer_ && this.renderer_.isFocusable(this) && this.getKeyEventTarget().focus()));
  !this.isAllowTextSelection() && a.isMouseActionButton() && a.preventDefault();
};
goog.ui.Control.prototype.handleMouseUp = function(a) {
  this.isEnabled() && (this.isAutoState(goog.ui.Component.State.HOVER) && this.setHighlighted(!0), this.isActive() && this.performActionInternal(a) && this.isAutoState(goog.ui.Component.State.ACTIVE) && this.setActive(!1));
};
goog.ui.Control.prototype.handleDblClick = function(a) {
  this.isEnabled() && this.performActionInternal(a);
};
goog.ui.Control.prototype.performActionInternal = function(a) {
  this.isAutoState(goog.ui.Component.State.CHECKED) && this.setChecked(!this.isChecked());
  this.isAutoState(goog.ui.Component.State.SELECTED) && this.setSelected(!0);
  this.isAutoState(goog.ui.Component.State.OPENED) && this.setOpen(!this.isOpen());
  var b = new goog.events.Event(goog.ui.Component.EventType.ACTION, this);
  a && (b.altKey = a.altKey, b.ctrlKey = a.ctrlKey, b.metaKey = a.metaKey, b.shiftKey = a.shiftKey, b.platformModifierKey = a.platformModifierKey);
  return this.dispatchEvent(b);
};
goog.ui.Control.prototype.handleFocus = function(a) {
  this.isAutoState(goog.ui.Component.State.FOCUSED) && this.setFocused(!0);
};
goog.ui.Control.prototype.handleBlur = function(a) {
  this.isAutoState(goog.ui.Component.State.ACTIVE) && this.setActive(!1);
  this.isAutoState(goog.ui.Component.State.FOCUSED) && this.setFocused(!1);
};
goog.ui.Control.prototype.handleKeyEvent = function(a) {
  return this.isVisible() && this.isEnabled() && this.handleKeyEventInternal(a) ? (a.preventDefault(), a.stopPropagation(), !0) : !1;
};
goog.ui.Control.prototype.handleKeyEventInternal = function(a) {
  return a.keyCode == goog.events.KeyCodes.ENTER && this.performActionInternal(a);
};
goog.ui.registry.setDefaultRenderer(goog.ui.Control, goog.ui.ControlRenderer);
goog.ui.registry.setDecoratorByClassName(goog.ui.ControlRenderer.CSS_CLASS, function() {
  return new goog.ui.Control(null);
});
goog.ui.Control.IeMouseEventSequenceSimulator_ = function(a) {
  goog.Disposable.call(this);
  this.control_ = a;
  this.clickExpected_ = !1;
  this.handler_ = new goog.events.EventHandler(this);
  this.registerDisposable(this.handler_);
  a = this.control_.getElementStrict();
  this.handler_.listen(a, goog.events.EventType.MOUSEDOWN, this.handleMouseDown_).listen(a, goog.events.EventType.MOUSEUP, this.handleMouseUp_).listen(a, goog.events.EventType.CLICK, this.handleClick_);
};
goog.inherits(goog.ui.Control.IeMouseEventSequenceSimulator_, goog.Disposable);
goog.ui.Control.IeMouseEventSequenceSimulator_.SYNTHETIC_EVENTS_ = !goog.userAgent.IE || goog.userAgent.isDocumentModeOrHigher(9);
goog.ui.Control.IeMouseEventSequenceSimulator_.prototype.handleMouseDown_ = function() {
  this.clickExpected_ = !1;
};
goog.ui.Control.IeMouseEventSequenceSimulator_.prototype.handleMouseUp_ = function() {
  this.clickExpected_ = !0;
};
goog.ui.Control.IeMouseEventSequenceSimulator_.makeLeftMouseEvent_ = function(a, b) {
  if (!goog.ui.Control.IeMouseEventSequenceSimulator_.SYNTHETIC_EVENTS_) {
    return a.button = goog.events.BrowserEvent.MouseButton.LEFT, a.type = b, a;
  }
  var c = document.createEvent("MouseEvents");
  c.initMouseEvent(b, a.bubbles, a.cancelable, a.view || null, a.detail, a.screenX, a.screenY, a.clientX, a.clientY, a.ctrlKey, a.altKey, a.shiftKey, a.metaKey, goog.events.BrowserEvent.MouseButton.LEFT, a.relatedTarget || null);
  return c;
};
goog.ui.Control.IeMouseEventSequenceSimulator_.prototype.handleClick_ = function(a) {
  if (this.clickExpected_) {
    this.clickExpected_ = !1;
  } else {
    var b = a.getBrowserEvent(), c = b.button, d = b.type, e = goog.ui.Control.IeMouseEventSequenceSimulator_.makeLeftMouseEvent_(b, goog.events.EventType.MOUSEDOWN);
    this.control_.handleMouseDown(new goog.events.BrowserEvent(e, a.currentTarget));
    e = goog.ui.Control.IeMouseEventSequenceSimulator_.makeLeftMouseEvent_(b, goog.events.EventType.MOUSEUP);
    this.control_.handleMouseUp(new goog.events.BrowserEvent(e, a.currentTarget));
    goog.ui.Control.IeMouseEventSequenceSimulator_.SYNTHETIC_EVENTS_ || (b.button = c, b.type = d);
  }
};
goog.ui.Control.IeMouseEventSequenceSimulator_.prototype.disposeInternal = function() {
  this.control_ = null;
  goog.ui.Control.IeMouseEventSequenceSimulator_.superClass_.disposeInternal.call(this);
};
goog.ui.TextareaRenderer = function() {
  goog.ui.ControlRenderer.call(this);
};
goog.inherits(goog.ui.TextareaRenderer, goog.ui.ControlRenderer);
goog.addSingletonGetter(goog.ui.TextareaRenderer);
goog.ui.TextareaRenderer.CSS_CLASS = "goog-textarea";
goog.ui.TextareaRenderer.prototype.getAriaRole = function() {
};
goog.ui.TextareaRenderer.prototype.decorate = function(a, b) {
  this.setUpTextarea_(a);
  goog.ui.TextareaRenderer.superClass_.decorate.call(this, a, b);
  a.setContent(b.value);
  return b;
};
goog.ui.TextareaRenderer.prototype.createDom = function(a) {
  this.setUpTextarea_(a);
  return a.getDomHelper().createDom("TEXTAREA", {"class":this.getClassNames(a).join(" "), disabled:!a.isEnabled()}, a.getContent() || "");
};
goog.ui.TextareaRenderer.prototype.canDecorate = function(a) {
  return "TEXTAREA" == a.tagName;
};
goog.ui.TextareaRenderer.prototype.setRightToLeft = goog.nullFunction;
goog.ui.TextareaRenderer.prototype.isFocusable = function(a) {
  return a.isEnabled();
};
goog.ui.TextareaRenderer.prototype.setFocusable = goog.nullFunction;
goog.ui.TextareaRenderer.prototype.setState = function(a, b, c) {
  goog.ui.TextareaRenderer.superClass_.setState.call(this, a, b, c);
  (a = a.getElement()) && b == goog.ui.Component.State.DISABLED && (a.disabled = c);
};
goog.ui.TextareaRenderer.prototype.updateAriaState = goog.nullFunction;
goog.ui.TextareaRenderer.prototype.setUpTextarea_ = function(a) {
  a.setHandleMouseEvents(!1);
  a.setAutoStates(goog.ui.Component.State.ALL, !1);
  a.setSupportedState(goog.ui.Component.State.FOCUSED, !1);
};
goog.ui.TextareaRenderer.prototype.setContent = function(a, b) {
  a && (a.value = b);
};
goog.ui.TextareaRenderer.prototype.getCssClass = function() {
  return goog.ui.TextareaRenderer.CSS_CLASS;
};
goog.ui.Textarea = function(a, b, c) {
  goog.ui.Control.call(this, a, b || goog.ui.TextareaRenderer.getInstance(), c);
  this.setHandleMouseEvents(!1);
  this.setAllowTextSelection(!0);
  this.hasUserInput_ = "" != a;
  a || this.setContentInternal("");
};
goog.inherits(goog.ui.Textarea, goog.ui.Control);
goog.tagUnsealableClass(goog.ui.Textarea);
goog.ui.Textarea.NEEDS_HELP_SHRINKING_ = !(goog.userAgent.IE && !goog.userAgent.isDocumentModeOrHigher(11));
goog.ui.Textarea.prototype.isResizing_ = !1;
goog.ui.Textarea.prototype.hasFocusForPlaceholder_ = !1;
goog.ui.Textarea.prototype.hasUserInput_ = !1;
goog.ui.Textarea.prototype.height_ = 0;
goog.ui.Textarea.prototype.maxHeight_ = 0;
goog.ui.Textarea.prototype.minHeight_ = 0;
goog.ui.Textarea.prototype.hasDiscoveredTextareaCharacteristics_ = !1;
goog.ui.Textarea.prototype.needsPaddingBorderFix_ = !1;
goog.ui.Textarea.prototype.scrollHeightIncludesPadding_ = !1;
goog.ui.Textarea.prototype.scrollHeightIncludesBorder_ = !1;
goog.ui.Textarea.prototype.placeholderText_ = "";
goog.ui.Textarea.EventType = {RESIZE:"resize"};
goog.ui.Textarea.prototype.setPlaceholder = function(a) {
  this.placeholderText_ = a;
  this.getElement() && this.restorePlaceholder_();
};
goog.ui.Textarea.prototype.getPaddingBorderBoxHeight_ = function() {
  return this.paddingBox_.top + this.paddingBox_.bottom + this.borderBox_.top + this.borderBox_.bottom;
};
goog.ui.Textarea.prototype.getMinHeight = function() {
  return this.minHeight_;
};
goog.ui.Textarea.prototype.getMinHeight_ = function() {
  var a = this.minHeight_, b = this.getElement();
  a && b && this.needsPaddingBorderFix_ && (a -= this.getPaddingBorderBoxHeight_());
  return a;
};
goog.ui.Textarea.prototype.setMinHeight = function(a) {
  this.minHeight_ = a;
  this.resize();
};
goog.ui.Textarea.prototype.getMaxHeight = function() {
  return this.maxHeight_;
};
goog.ui.Textarea.prototype.getMaxHeight_ = function() {
  var a = this.maxHeight_, b = this.getElement();
  a && b && this.needsPaddingBorderFix_ && (a -= this.getPaddingBorderBoxHeight_());
  return a;
};
goog.ui.Textarea.prototype.setMaxHeight = function(a) {
  this.maxHeight_ = a;
  this.resize();
};
goog.ui.Textarea.prototype.setValue = function(a) {
  this.setContent(String(a));
};
goog.ui.Textarea.prototype.getValue = function() {
  return this.getElement().value != this.placeholderText_ || this.supportsNativePlaceholder_() || this.hasUserInput_ ? this.getElement().value : "";
};
goog.ui.Textarea.prototype.setContent = function(a) {
  goog.ui.Textarea.superClass_.setContent.call(this, a);
  this.hasUserInput_ = "" != a;
  this.resize();
};
goog.ui.Textarea.prototype.setEnabled = function(a) {
  goog.ui.Textarea.superClass_.setEnabled.call(this, a);
  this.getElement().disabled = !a;
};
goog.ui.Textarea.prototype.resize = function() {
  this.getElement() && this.grow_();
};
goog.ui.Textarea.prototype.supportsNativePlaceholder_ = function() {
  goog.asserts.assert(this.getElement());
  return "placeholder" in this.getElement();
};
goog.ui.Textarea.prototype.restorePlaceholder_ = function() {
  this.placeholderText_ && (this.supportsNativePlaceholder_() ? this.getElement().placeholder = this.placeholderText_ : !this.getElement() || this.hasUserInput_ || this.hasFocusForPlaceholder_ || (goog.dom.classlist.add(goog.asserts.assert(this.getElement()), goog.ui.Textarea.TEXTAREA_PLACEHOLDER_CLASS), this.getElement().value = this.placeholderText_));
};
goog.ui.Textarea.prototype.enterDocument = function() {
  goog.ui.Textarea.superClass_.enterDocument.call(this);
  var a = this.getElement();
  goog.style.setStyle(a, {overflowY:"hidden", overflowX:"auto", boxSizing:"border-box", MsBoxSizing:"border-box", WebkitBoxSizing:"border-box", MozBoxSizing:"border-box"});
  this.paddingBox_ = goog.style.getPaddingBox(a);
  this.borderBox_ = goog.style.getBorderBox(a);
  this.getHandler().listen(a, goog.events.EventType.SCROLL, this.grow_).listen(a, goog.events.EventType.FOCUS, this.grow_).listen(a, goog.events.EventType.KEYUP, this.grow_).listen(a, goog.events.EventType.MOUSEUP, this.mouseUpListener_).listen(a, goog.events.EventType.BLUR, this.blur_);
  this.restorePlaceholder_();
  this.resize();
};
goog.ui.Textarea.prototype.getHeight_ = function() {
  this.discoverTextareaCharacteristics_();
  var a = this.getElement();
  isNaN(this.paddingBox_.top) && (this.paddingBox_ = goog.style.getPaddingBox(a), this.borderBox_ = goog.style.getBorderBox(a));
  var b = this.getElement().scrollHeight + this.getHorizontalScrollBarHeight_();
  if (this.needsPaddingBorderFix_) {
    b -= this.getPaddingBorderBoxHeight_();
  } else {
    if (!this.scrollHeightIncludesPadding_) {
      var c = this.paddingBox_;
      b += c.top + c.bottom;
    }
    this.scrollHeightIncludesBorder_ || (a = goog.style.getBorderBox(a), b += a.top + a.bottom);
  }
  return b;
};
goog.ui.Textarea.prototype.setHeight_ = function(a) {
  this.height_ != a && (this.height_ = a, this.getElement().style.height = a + "px");
};
goog.ui.Textarea.prototype.setHeightToEstimate_ = function() {
  var a = this.getElement();
  a.style.height = "auto";
  var b = a.value.match(/\n/g) || [];
  a.rows = b.length + 1;
  this.height_ = 0;
};
goog.ui.Textarea.prototype.getHorizontalScrollBarHeight_ = function() {
  var a = this.getElement(), b = a.offsetHeight - a.clientHeight;
  if (!this.scrollHeightIncludesPadding_) {
    var c = this.paddingBox_;
    b -= c.top + c.bottom;
  }
  this.scrollHeightIncludesBorder_ || (a = goog.style.getBorderBox(a), b -= a.top + a.bottom);
  return 0 < b ? b : 0;
};
goog.ui.Textarea.prototype.discoverTextareaCharacteristics_ = function() {
  if (!this.hasDiscoveredTextareaCharacteristics_) {
    var a = this.getElement().cloneNode(!1);
    goog.style.setStyle(a, {position:"absolute", height:"auto", top:"-9999px", margin:"0", padding:"1px", border:"1px solid #000", overflow:"hidden"});
    goog.dom.appendChild(this.getDomHelper().getDocument().body, a);
    var b = a.scrollHeight;
    a.style.padding = "10px";
    var c = a.scrollHeight;
    this.scrollHeightIncludesPadding_ = c > b;
    a.style.borderWidth = "10px";
    this.scrollHeightIncludesBorder_ = a.scrollHeight > c;
    a.style.height = "100px";
    100 != a.offsetHeight && (this.needsPaddingBorderFix_ = !0);
    goog.dom.removeNode(a);
    this.hasDiscoveredTextareaCharacteristics_ = !0;
  }
};
goog.ui.Textarea.TEXTAREA_PLACEHOLDER_CLASS = "textarea-placeholder-input";
goog.ui.Textarea.prototype.blur_ = function(a) {
  this.supportsNativePlaceholder_() || (this.hasFocusForPlaceholder_ = !1, "" == this.getElement().value && (this.hasUserInput_ = !1, this.restorePlaceholder_()));
};
goog.ui.Textarea.prototype.grow_ = function(a) {
  if (!this.isResizing_) {
    var b = this.getElement();
    !this.supportsNativePlaceholder_() && a && a.type == goog.events.EventType.FOCUS && (b.value == this.placeholderText_ && this.placeholderText_ && !this.hasFocusForPlaceholder_ && (goog.dom.classlist.remove(b, goog.ui.Textarea.TEXTAREA_PLACEHOLDER_CLASS), b.value = ""), this.hasFocusForPlaceholder_ = !0, this.hasUserInput_ = "" != b.value);
    a = !1;
    this.isResizing_ = !0;
    var c = this.height_;
    if (b.scrollHeight) {
      var d = !1, e = !1, f = this.getHeight_(), g = b.offsetHeight, h = this.getMinHeight_(), k = this.getMaxHeight_();
      h && f < h ? (this.setHeight_(h), d = !0) : k && f > k ? (this.setHeight_(k), b.style.overflowY = "", e = !0) : g != f ? this.setHeight_(f) : this.height_ || (this.height_ = f);
      d || e || !goog.ui.Textarea.NEEDS_HELP_SHRINKING_ || (a = !0);
    } else {
      this.setHeightToEstimate_();
    }
    this.isResizing_ = !1;
    a && this.shrink_();
    c != this.height_ && this.dispatchEvent(goog.ui.Textarea.EventType.RESIZE);
  }
};
goog.ui.Textarea.prototype.shrink_ = function() {
  var a = this.getElement();
  if (!this.isResizing_) {
    this.isResizing_ = !0;
    var b = a.scrollHeight;
    if (b) {
      var c = this.getHeight_(), d = this.getMinHeight_();
      if (!(d && c <= d)) {
        var e = this.paddingBox_;
        a.style.paddingBottom = e.bottom + 1 + "px";
        this.getHeight_() == c && (a.style.paddingBottom = e.bottom + b + "px", a.scrollTop = 0, b = this.getHeight_() - b, b >= d ? this.setHeight_(b) : this.setHeight_(d));
        a.style.paddingBottom = e.bottom + "px";
      }
    } else {
      this.setHeightToEstimate_();
    }
    this.isResizing_ = !1;
  }
};
goog.ui.Textarea.prototype.mouseUpListener_ = function(a) {
  var b = this.getElement();
  a = b.offsetHeight;
  b.filters && b.filters.length && (b = b.filters.item("DXImageTransform.Microsoft.DropShadow")) && (a -= b.offX);
  a != this.height_ && (this.height_ = this.minHeight_ = a);
};
goog.i18n.uChar = {};
goog.i18n.uChar.SUPPLEMENTARY_CODE_POINT_MIN_VALUE_ = 65536;
goog.i18n.uChar.CODE_POINT_MAX_VALUE_ = 1114111;
goog.i18n.uChar.LEAD_SURROGATE_MIN_VALUE_ = 55296;
goog.i18n.uChar.LEAD_SURROGATE_MAX_VALUE_ = 56319;
goog.i18n.uChar.TRAIL_SURROGATE_MIN_VALUE_ = 56320;
goog.i18n.uChar.TRAIL_SURROGATE_MAX_VALUE_ = 57343;
goog.i18n.uChar.TRAIL_SURROGATE_BIT_COUNT_ = 10;
goog.i18n.uChar.toHexString = function(a) {
  a = goog.i18n.uChar.toCharCode(a);
  return "U+" + goog.i18n.uChar.padString_(a.toString(16).toUpperCase(), 4, "0");
};
goog.i18n.uChar.padString_ = function(a, b, c) {
  for (; a.length < b;) {
    a = c + a;
  }
  return a;
};
goog.i18n.uChar.toCharCode = function(a) {
  return goog.i18n.uChar.getCodePointAround(a, 0);
};
goog.i18n.uChar.fromCharCode = function(a) {
  if (!(goog.isDefAndNotNull(a) && 0 <= a && a <= goog.i18n.uChar.CODE_POINT_MAX_VALUE_)) {
    return null;
  }
  if (goog.i18n.uChar.isSupplementaryCodePoint(a)) {
    var b = (a & (1 << goog.i18n.uChar.TRAIL_SURROGATE_BIT_COUNT_) - 1) + goog.i18n.uChar.TRAIL_SURROGATE_MIN_VALUE_;
    return String.fromCharCode((a >> goog.i18n.uChar.TRAIL_SURROGATE_BIT_COUNT_) + (goog.i18n.uChar.LEAD_SURROGATE_MIN_VALUE_ - (goog.i18n.uChar.SUPPLEMENTARY_CODE_POINT_MIN_VALUE_ >> goog.i18n.uChar.TRAIL_SURROGATE_BIT_COUNT_))) + String.fromCharCode(b);
  }
  return String.fromCharCode(a);
};
goog.i18n.uChar.getCodePointAround = function(a, b) {
  var c = a.charCodeAt(b);
  if (goog.i18n.uChar.isLeadSurrogateCodePoint(c) && b + 1 < a.length) {
    if (a = a.charCodeAt(b + 1), goog.i18n.uChar.isTrailSurrogateCodePoint(a)) {
      return goog.i18n.uChar.buildSupplementaryCodePoint(c, a);
    }
  } else {
    if (goog.i18n.uChar.isTrailSurrogateCodePoint(c) && 0 < b && (a = a.charCodeAt(b - 1), goog.i18n.uChar.isLeadSurrogateCodePoint(a))) {
      return -goog.i18n.uChar.buildSupplementaryCodePoint(a, c);
    }
  }
  return c;
};
goog.i18n.uChar.charCount = function(a) {
  return goog.i18n.uChar.isSupplementaryCodePoint(a) ? 2 : 1;
};
goog.i18n.uChar.isSupplementaryCodePoint = function(a) {
  return a >= goog.i18n.uChar.SUPPLEMENTARY_CODE_POINT_MIN_VALUE_ && a <= goog.i18n.uChar.CODE_POINT_MAX_VALUE_;
};
goog.i18n.uChar.isLeadSurrogateCodePoint = function(a) {
  return a >= goog.i18n.uChar.LEAD_SURROGATE_MIN_VALUE_ && a <= goog.i18n.uChar.LEAD_SURROGATE_MAX_VALUE_;
};
goog.i18n.uChar.isTrailSurrogateCodePoint = function(a) {
  return a >= goog.i18n.uChar.TRAIL_SURROGATE_MIN_VALUE_ && a <= goog.i18n.uChar.TRAIL_SURROGATE_MAX_VALUE_;
};
goog.i18n.uChar.buildSupplementaryCodePoint = function(a, b) {
  return goog.i18n.uChar.isLeadSurrogateCodePoint(a) && goog.i18n.uChar.isTrailSurrogateCodePoint(b) ? (a << goog.i18n.uChar.TRAIL_SURROGATE_BIT_COUNT_) - (goog.i18n.uChar.LEAD_SURROGATE_MIN_VALUE_ << goog.i18n.uChar.TRAIL_SURROGATE_BIT_COUNT_) + (b - goog.i18n.uChar.TRAIL_SURROGATE_MIN_VALUE_ + goog.i18n.uChar.SUPPLEMENTARY_CODE_POINT_MIN_VALUE_) : null;
};
goog.structs.InversionMap = function(a, b, c) {
  this.rangeArray = null;
  goog.asserts.assert(a.length == b.length, "rangeArray and valueArray must have the same length.");
  this.storeInversion_(a, c);
  this.values = b;
};
goog.structs.InversionMap.prototype.storeInversion_ = function(a, b) {
  this.rangeArray = a;
  for (var c = 1; c < a.length; c++) {
    null == a[c] ? a[c] = a[c - 1] + 1 : b && (a[c] += a[c - 1]);
  }
};
goog.structs.InversionMap.prototype.spliceInversion = function(a, b, c) {
  a = new goog.structs.InversionMap(a, b, c);
  b = a.rangeArray[0];
  var d = goog.array.peek(a.rangeArray);
  c = this.getLeast(b);
  d = this.getLeast(d);
  b != this.rangeArray[c] && c++;
  this.rangeArray = this.rangeArray.slice(0, c).concat(a.rangeArray).concat(this.rangeArray.slice(d + 1));
  this.values = this.values.slice(0, c).concat(a.values).concat(this.values.slice(d + 1));
};
goog.structs.InversionMap.prototype.at = function(a) {
  a = this.getLeast(a);
  return 0 > a ? null : this.values[a];
};
goog.structs.InversionMap.prototype.getLeast = function(a) {
  for (var b = this.rangeArray, c = 0, d = b.length; 8 < d - c;) {
    var e = d + c >> 1;
    b[e] <= a ? c = e : d = e;
  }
  for (; c < d && !(a < b[c]); ++c) {
  }
  return c - 1;
};
goog.i18n.GraphemeBreak = {};
goog.i18n.GraphemeBreak.property = {OTHER:0, CONTROL:1, EXTEND:2, PREPEND:3, SPACING_MARK:4, INDIC_LETTER:5, VIRAMA:6, L:7, V:8, T:9, LV:10, LVT:11, CR:12, LF:13, REGIONAL_INDICATOR:14, ZWJ:15, E_BASE:16, GLUE_AFTER_ZWJ:17, E_MODIFIER:18, E_BASE_GAZ:19};
goog.i18n.GraphemeBreak.inversions_ = null;
goog.i18n.GraphemeBreak.applyBreakRules_ = function(a, b, c) {
  var d = goog.i18n.GraphemeBreak.property, e = goog.isString(a) ? goog.i18n.GraphemeBreak.getCodePoint_(a, a.length - 1) : a, f = goog.isString(b) ? goog.i18n.GraphemeBreak.getCodePoint_(b, 0) : b;
  b = goog.i18n.GraphemeBreak.getBreakProp_(e);
  f = goog.i18n.GraphemeBreak.getBreakProp_(f);
  var g = goog.isString(a);
  if (b === d.CR && f === d.LF) {
    return !1;
  }
  if (b === d.CONTROL || b === d.CR || b === d.LF || f === d.CONTROL || f === d.CR || f === d.LF) {
    return !0;
  }
  if (b === d.L && (f === d.L || f === d.V || f === d.LV || f === d.LVT) || !(b !== d.LV && b !== d.V || f !== d.V && f !== d.T) || (b === d.LVT || b === d.T) && f === d.T || f === d.EXTEND || f === d.ZWJ || f === d.VIRAMA || c && (b === d.PREPEND || f === d.SPACING_MARK) || c && b === d.VIRAMA && f === d.INDIC_LETTER) {
    return !1;
  }
  var h;
  if (g) {
    if (f === d.E_MODIFIER) {
      c = a;
      var k = c.length - 1;
      var l = e;
      for (h = b; 0 < k && h === d.EXTEND;) {
        k -= goog.i18n.uChar.charCount(l), l = goog.i18n.GraphemeBreak.getCodePoint_(c, k), h = goog.i18n.GraphemeBreak.getBreakProp_(l);
      }
      if (h === d.E_BASE || h === d.E_BASE_GAZ) {
        return !1;
      }
    }
  } else {
    if ((b === d.E_BASE || b === d.E_BASE_GAZ) && f === d.E_MODIFIER) {
      return !1;
    }
  }
  if (b === d.ZWJ && (f === d.GLUE_AFTER_ZWJ || f === d.E_BASE_GAZ)) {
    return !1;
  }
  if (g) {
    if (f === d.REGIONAL_INDICATOR) {
      f = 0;
      c = a;
      k = c.length - 1;
      l = e;
      for (h = b; 0 < k && h === d.REGIONAL_INDICATOR;) {
        f++, k -= goog.i18n.uChar.charCount(l), l = goog.i18n.GraphemeBreak.getCodePoint_(c, k), h = goog.i18n.GraphemeBreak.getBreakProp_(l);
      }
      h === d.REGIONAL_INDICATOR && f++;
      if (1 === f % 2) {
        return !1;
      }
    }
  } else {
    if (b === d.REGIONAL_INDICATOR && f === d.REGIONAL_INDICATOR) {
      return !1;
    }
  }
  return !0;
};
goog.i18n.GraphemeBreak.getBreakProp_ = function(a) {
  if (44032 <= a && 55203 >= a) {
    var b = goog.i18n.GraphemeBreak.property;
    return 16 === a % 28 ? b.LV : b.LVT;
  }
  goog.i18n.GraphemeBreak.inversions_ || (goog.i18n.GraphemeBreak.inversions_ = new goog.structs.InversionMap([0, 10, 1, 2, 1, 18, 95, 33, 13, 1, 594, 112, 275, 7, 263, 45, 1, 1, 1, 2, 1, 2, 1, 1, 56, 6, 10, 11, 1, 1, 46, 21, 16, 1, 101, 7, 1, 1, 6, 2, 2, 1, 4, 33, 1, 1, 1, 30, 27, 91, 11, 58, 9, 34, 4, 1, 9, 1, 3, 1, 5, 43, 3, 120, 14, 1, 32, 1, 17, 37, 1, 1, 1, 1, 3, 8, 4, 1, 2, 1, 7, 8, 2, 2, 21, 7, 1, 1, 2, 17, 39, 1, 1, 1, 2, 6, 6, 1, 9, 5, 4, 2, 2, 12, 2, 15, 2, 1, 17, 39, 2, 3, 12, 4, 8, 6, 
  17, 2, 3, 14, 1, 17, 39, 1, 1, 3, 8, 4, 1, 20, 2, 29, 1, 2, 17, 39, 1, 1, 2, 1, 6, 6, 9, 6, 4, 2, 2, 13, 1, 16, 1, 18, 41, 1, 1, 1, 12, 1, 9, 1, 40, 1, 3, 17, 31, 1, 5, 4, 3, 5, 7, 8, 3, 2, 8, 2, 29, 1, 2, 17, 39, 1, 1, 1, 1, 2, 1, 3, 1, 5, 1, 8, 9, 1, 3, 2, 29, 1, 2, 17, 38, 3, 1, 2, 5, 7, 1, 1, 8, 1, 10, 2, 30, 2, 22, 48, 5, 1, 2, 6, 7, 1, 18, 2, 13, 46, 2, 1, 1, 1, 6, 1, 12, 8, 50, 46, 2, 1, 1, 1, 9, 11, 6, 14, 2, 58, 2, 27, 1, 1, 1, 1, 1, 4, 2, 49, 14, 1, 4, 1, 1, 2, 5, 48, 9, 1, 57, 33, 12, 
  4, 1, 6, 1, 2, 2, 2, 1, 16, 2, 4, 2, 2, 4, 3, 1, 3, 2, 7, 3, 4, 13, 1, 1, 1, 2, 6, 1, 1, 14, 1, 98, 96, 72, 88, 349, 3, 931, 15, 2, 1, 14, 15, 2, 1, 14, 15, 2, 15, 15, 14, 35, 17, 2, 1, 7, 8, 1, 2, 9, 1, 1, 9, 1, 45, 3, 1, 118, 2, 34, 1, 87, 28, 3, 3, 4, 2, 9, 1, 6, 3, 20, 19, 29, 44, 84, 23, 2, 2, 1, 4, 45, 6, 2, 1, 1, 1, 8, 1, 1, 1, 2, 8, 6, 13, 48, 84, 1, 14, 33, 1, 1, 5, 1, 1, 5, 1, 1, 1, 7, 31, 9, 12, 2, 1, 7, 23, 1, 4, 2, 2, 2, 2, 2, 11, 3, 2, 36, 2, 1, 1, 2, 3, 1, 1, 3, 2, 12, 36, 8, 8, 
  2, 2, 21, 3, 128, 3, 1, 13, 1, 7, 4, 1, 4, 2, 1, 3, 2, 198, 64, 523, 1, 1, 1, 2, 24, 7, 49, 16, 96, 33, 1324, 1, 34, 1, 1, 1, 82, 2, 98, 1, 14, 1, 1, 4, 86, 1, 1418, 3, 141, 1, 96, 32, 554, 6, 105, 2, 30164, 4, 1, 10, 32, 2, 80, 2, 272, 1, 3, 1, 4, 1, 23, 2, 2, 1, 24, 30, 4, 4, 3, 8, 1, 1, 13, 2, 16, 34, 16, 1, 1, 26, 18, 24, 24, 4, 8, 2, 23, 11, 1, 1, 12, 32, 3, 1, 5, 3, 3, 36, 1, 2, 4, 2, 1, 3, 1, 36, 1, 32, 35, 6, 2, 2, 2, 2, 12, 1, 8, 1, 1, 18, 16, 1, 3, 6, 1, 1, 1, 3, 48, 1, 1, 3, 2, 2, 5, 
  2, 1, 1, 32, 9, 1, 2, 2, 5, 1, 1, 201, 14, 2, 1, 1, 9, 8, 2, 1, 2, 1, 2, 1, 1, 1, 18, 11184, 27, 49, 1028, 1024, 6942, 1, 737, 16, 16, 16, 207, 1, 158, 2, 89, 3, 513, 1, 226, 1, 149, 5, 1670, 15, 40, 7, 1, 165, 2, 1305, 1, 1, 1, 53, 14, 1, 56, 1, 2, 1, 45, 3, 4, 2, 1, 1, 2, 1, 66, 3, 36, 5, 1, 6, 2, 62, 1, 12, 2, 1, 48, 3, 9, 1, 1, 1, 2, 6, 3, 95, 3, 3, 2, 1, 1, 2, 6, 1, 160, 1, 3, 7, 1, 21, 2, 2, 56, 1, 1, 1, 1, 1, 12, 1, 9, 1, 10, 4, 15, 192, 3, 8, 2, 1, 2, 1, 1, 105, 1, 2, 6, 1, 1, 2, 1, 1, 
  2, 1, 1, 1, 235, 1, 2, 6, 4, 2, 1, 1, 1, 27, 2, 82, 3, 8, 2, 1, 1, 1, 1, 106, 1, 1, 1, 2, 6, 1, 1, 101, 3, 2, 4, 1, 4, 1, 1283, 1, 14, 1, 1, 82, 23, 1, 7, 1, 2, 1, 2, 20025, 5, 59, 7, 1050, 62, 4, 19722, 2, 1, 4, 5313, 1, 1, 3, 3, 1, 5, 8, 8, 2, 7, 30, 4, 148, 3, 1979, 55, 4, 50, 8, 1, 14, 1, 22, 1424, 2213, 7, 109, 7, 2203, 26, 264, 1, 53, 1, 52, 1, 17, 1, 13, 1, 16, 1, 3, 1, 25, 3, 2, 1, 2, 3, 30, 1, 1, 1, 13, 5, 66, 2, 2, 11, 21, 4, 4, 1, 1, 9, 3, 1, 4, 3, 1, 3, 3, 1, 30, 1, 16, 2, 106, 1, 4, 
  1, 71, 2, 4, 1, 21, 1, 4, 2, 81, 1, 92, 3, 3, 5, 48, 1, 17, 1, 16, 1, 16, 3, 9, 1, 11, 1, 587, 5, 1, 1, 7, 1, 9, 10, 3, 2, 788162, 31], [1, 13, 1, 12, 1, 0, 1, 0, 1, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 3, 0, 2, 0, 1, 0, 2, 0, 2, 0, 2, 3, 0, 2, 0, 2, 0, 2, 0, 3, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 3, 2, 4, 0, 5, 2, 4, 2, 0, 4, 2, 4, 6, 4, 0, 2, 5, 0, 2, 0, 5, 0, 2, 4, 0, 5, 2, 0, 2, 4, 2, 4, 6, 0, 2, 5, 0, 2, 0, 5, 0, 2, 4, 0, 5, 2, 4, 2, 6, 2, 5, 0, 2, 0, 2, 4, 
  0, 5, 2, 0, 4, 2, 4, 6, 0, 2, 0, 2, 4, 0, 5, 2, 0, 2, 4, 2, 4, 6, 2, 5, 0, 2, 0, 5, 0, 2, 0, 5, 2, 4, 2, 4, 6, 0, 2, 0, 2, 4, 0, 5, 0, 5, 0, 2, 4, 2, 6, 2, 5, 0, 2, 0, 2, 4, 0, 5, 2, 0, 4, 2, 4, 2, 4, 2, 4, 2, 6, 2, 5, 0, 2, 0, 2, 4, 0, 5, 0, 2, 4, 2, 4, 6, 3, 0, 2, 0, 2, 0, 4, 0, 5, 6, 2, 4, 2, 4, 2, 0, 4, 0, 5, 0, 2, 0, 4, 2, 6, 0, 2, 0, 5, 0, 2, 0, 4, 2, 0, 2, 0, 5, 0, 2, 0, 2, 0, 2, 0, 2, 0, 4, 5, 2, 4, 2, 6, 0, 2, 0, 2, 0, 2, 0, 5, 0, 2, 4, 2, 0, 6, 4, 2, 5, 0, 5, 0, 4, 2, 5, 2, 5, 0, 5, 0, 
  5, 2, 5, 2, 0, 4, 2, 0, 2, 5, 0, 2, 0, 7, 8, 9, 0, 2, 0, 5, 2, 6, 0, 5, 2, 6, 0, 5, 2, 0, 5, 2, 5, 0, 2, 4, 2, 4, 2, 4, 2, 6, 2, 0, 2, 0, 2, 1, 0, 2, 0, 2, 0, 5, 0, 2, 4, 2, 4, 2, 4, 2, 0, 5, 0, 5, 0, 5, 2, 4, 2, 0, 5, 0, 5, 4, 2, 4, 2, 6, 0, 2, 0, 2, 4, 2, 0, 2, 4, 0, 5, 2, 4, 2, 4, 2, 4, 2, 4, 6, 5, 0, 2, 0, 2, 4, 0, 5, 4, 2, 4, 2, 6, 2, 5, 0, 5, 0, 5, 0, 2, 4, 2, 4, 2, 4, 2, 6, 0, 5, 4, 2, 4, 2, 0, 5, 0, 2, 0, 2, 4, 2, 0, 2, 0, 4, 2, 0, 2, 0, 2, 0, 1, 2, 15, 1, 0, 1, 0, 1, 0, 2, 0, 16, 0, 17, 
  0, 17, 0, 17, 0, 16, 0, 17, 0, 16, 0, 17, 0, 2, 0, 6, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 6, 5, 2, 5, 4, 2, 4, 0, 5, 0, 5, 0, 5, 0, 5, 0, 4, 0, 5, 4, 6, 2, 0, 2, 0, 5, 0, 2, 0, 5, 2, 4, 6, 0, 7, 2, 4, 0, 5, 0, 5, 2, 4, 2, 4, 2, 4, 6, 0, 2, 0, 5, 2, 4, 2, 4, 2, 0, 2, 0, 2, 4, 0, 5, 0, 5, 0, 5, 0, 2, 0, 5, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 5, 4, 2, 4, 0, 4, 6, 0, 5, 0, 5, 0, 5, 0, 4, 2, 4, 2, 4, 0, 4, 6, 0, 11, 8, 9, 0, 2, 0, 2, 0, 2, 0, 2, 0, 1, 0, 2, 0, 1, 0, 2, 0, 2, 0, 2, 0, 2, 0, 
  2, 6, 0, 2, 0, 4, 2, 4, 0, 2, 6, 0, 6, 2, 4, 0, 4, 2, 4, 6, 2, 0, 3, 0, 2, 0, 2, 4, 2, 6, 0, 2, 0, 2, 4, 0, 4, 2, 4, 6, 0, 3, 0, 2, 0, 4, 2, 4, 2, 6, 2, 0, 2, 0, 2, 4, 2, 6, 0, 2, 4, 0, 2, 0, 2, 4, 2, 4, 6, 0, 2, 0, 4, 2, 0, 4, 2, 4, 6, 2, 4, 2, 0, 2, 4, 2, 4, 2, 4, 2, 4, 2, 4, 6, 2, 0, 2, 4, 2, 4, 2, 4, 6, 2, 0, 2, 0, 4, 2, 4, 2, 4, 6, 2, 0, 2, 4, 2, 4, 2, 6, 2, 0, 2, 4, 2, 4, 2, 6, 0, 4, 2, 4, 6, 0, 2, 4, 2, 4, 2, 4, 2, 0, 2, 0, 2, 0, 4, 2, 0, 2, 0, 1, 0, 2, 4, 2, 0, 4, 2, 1, 2, 0, 2, 0, 2, 0, 
  2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 14, 0, 17, 0, 17, 0, 17, 0, 16, 0, 17, 0, 17, 0, 17, 0, 16, 0, 16, 0, 16, 0, 17, 0, 17, 0, 18, 0, 16, 0, 16, 0, 19, 0, 16, 0, 16, 0, 16, 0, 16, 0, 16, 0, 17, 0, 16, 0, 17, 0, 17, 0, 17, 0, 16, 0, 16, 0, 16, 0, 16, 0, 17, 0, 16, 0, 16, 0, 17, 0, 17, 0, 16, 0, 16, 0, 16, 0, 16, 0, 16, 0, 16, 0, 16, 0, 16, 0, 16, 0, 1, 2], !0));
  return goog.i18n.GraphemeBreak.inversions_.at(a);
};
goog.i18n.GraphemeBreak.getCodePoint_ = function(a, b) {
  a = goog.i18n.uChar.getCodePointAround(a, b);
  return 0 > a ? -a : a;
};
goog.i18n.GraphemeBreak.hasGraphemeBreak = function(a, b, c) {
  return goog.i18n.GraphemeBreak.applyBreakRules_(a, b, !1 !== c);
};
goog.i18n.GraphemeBreak.hasGraphemeBreakStrings = function(a, b, c) {
  goog.asserts.assert(goog.isDef(a), "First string should be defined.");
  goog.asserts.assert(goog.isDef(b), "Second string should be defined.");
  return 0 === a.length || 0 === b.length ? !0 : goog.i18n.GraphemeBreak.applyBreakRules_(a, b, !1 !== c);
};
goog.format = {};
goog.format.fileSize = function(a, b) {
  return goog.format.numBytesToString(a, b, !1);
};
goog.format.isConvertableScaledNumber = function(a) {
  return goog.format.SCALED_NUMERIC_RE_.test(a);
};
goog.format.stringToNumericValue = function(a) {
  return goog.string.endsWith(a, "B") ? goog.format.stringToNumericValue_(a, goog.format.NUMERIC_SCALES_BINARY_) : goog.format.stringToNumericValue_(a, goog.format.NUMERIC_SCALES_SI_);
};
goog.format.stringToNumBytes = function(a) {
  return goog.format.stringToNumericValue_(a, goog.format.NUMERIC_SCALES_BINARY_);
};
goog.format.numericValueToString = function(a, b) {
  return goog.format.numericValueToString_(a, goog.format.NUMERIC_SCALES_SI_, b);
};
goog.format.numBytesToString = function(a, b, c, d) {
  var e = "";
  if (!goog.isDef(c) || c) {
    e = "B";
  }
  return goog.format.numericValueToString_(a, goog.format.NUMERIC_SCALES_BINARY_, b, e, d);
};
goog.format.stringToNumericValue_ = function(a, b) {
  return (a = a.match(goog.format.SCALED_NUMERIC_RE_)) ? Number(a[1]) * b[a[2]] : NaN;
};
goog.format.numericValueToString_ = function(a, b, c, d, e) {
  var f = goog.format.NUMERIC_SCALE_PREFIXES_, g = a, h = "", k = "", l = 1;
  0 > a && (a = -a);
  for (var m = 0; m < f.length; m++) {
    var n = f[m];
    l = b[n];
    if (a >= l || 1 >= l && a > 0.1 * l) {
      h = n;
      break;
    }
  }
  h ? (d && (h += d), e && (k = " ")) : l = 1;
  a = Math.pow(10, goog.isDef(c) ? c : 2);
  return Math.round(g / l * a) / a + k + h;
};
goog.format.SCALED_NUMERIC_RE_ = /^([-]?\d+\.?\d*)([K,M,G,T,P,E,Z,Y,k,m,u,n]?)[B]?$/;
goog.format.NUMERIC_SCALE_PREFIXES_ = "Y Z E P T G M K  m u n".split(" ");
goog.format.NUMERIC_SCALES_SI_ = {"":1, n:1e-9, u:1e-6, m:1e-3, k:1e3, K:1e3, M:1e6, G:1e9, T:1e12, P:1e15, E:1e18, Z:1e21, Y:1e24};
goog.format.NUMERIC_SCALES_BINARY_ = {"":1, n:Math.pow(1024, -3), u:Math.pow(1024, -2), m:1.0 / 1024, k:1024, K:1024, M:Math.pow(1024, 2), G:Math.pow(1024, 3), T:Math.pow(1024, 4), P:Math.pow(1024, 5), E:Math.pow(1024, 6), Z:Math.pow(1024, 7), Y:Math.pow(1024, 8)};
goog.format.FIRST_GRAPHEME_EXTEND_ = 768;
goog.format.isTreatedAsBreakingSpace_ = function(a) {
  return a <= goog.format.WbrToken_.SPACE || 4096 <= a && (8192 <= a && 8198 >= a || 8200 <= a && 8203 >= a || 5760 == a || 6158 == a || 8232 == a || 8233 == a || 8287 == a || 12288 == a);
};
goog.format.isInvisibleFormattingCharacter_ = function(a) {
  return 8204 <= a && 8207 >= a || 8234 <= a && 8238 >= a;
};
goog.format.insertWordBreaksGeneric_ = function(a, b, c) {
  c = c || 10;
  if (c > a.length) {
    return a;
  }
  for (var d = [], e = 0, f = 0, g = 0, h = 0, k = 0; k < a.length; k++) {
    var l = h;
    h = a.charCodeAt(k);
    l = h >= goog.format.FIRST_GRAPHEME_EXTEND_ && !b(l, h, !0);
    e >= c && !goog.format.isTreatedAsBreakingSpace_(h) && !l && (d.push(a.substring(g, k), goog.format.WORD_BREAK_HTML), g = k, e = 0);
    f ? h == goog.format.WbrToken_.GT && f == goog.format.WbrToken_.LT ? f = 0 : h == goog.format.WbrToken_.SEMI_COLON && f == goog.format.WbrToken_.AMP && (f = 0, e++) : h == goog.format.WbrToken_.LT || h == goog.format.WbrToken_.AMP ? f = h : goog.format.isTreatedAsBreakingSpace_(h) ? e = 0 : goog.format.isInvisibleFormattingCharacter_(h) || e++;
  }
  d.push(a.substr(g));
  return d.join("");
};
goog.format.insertWordBreaks = function(a, b) {
  return goog.format.insertWordBreaksGeneric_(a, goog.i18n.GraphemeBreak.hasGraphemeBreak, b);
};
goog.format.conservativelyHasGraphemeBreak_ = function(a, b, c) {
  return 1024 <= b && 1315 > b;
};
goog.format.insertWordBreaksBasic = function(a, b) {
  return goog.format.insertWordBreaksGeneric_(a, goog.format.conservativelyHasGraphemeBreak_, b);
};
goog.format.IS_IE8_OR_ABOVE_ = goog.userAgent.IE && goog.userAgent.isVersionOrHigher(8);
goog.format.WORD_BREAK_HTML = goog.userAgent.WEBKIT ? "<wbr></wbr>" : goog.userAgent.OPERA ? "&shy;" : goog.format.IS_IE8_OR_ABOVE_ ? "&#8203;" : "<wbr>";
goog.format.WbrToken_ = {LT:60, GT:62, AMP:38, SEMI_COLON:59, SPACE:32};
goog.i18n.BidiFormatter = function(a, b) {
  this.contextDir_ = goog.i18n.bidi.toDir(a, !0);
  this.alwaysSpan_ = !!b;
};
goog.i18n.BidiFormatter.prototype.getContextDir = function() {
  return this.contextDir_;
};
goog.i18n.BidiFormatter.prototype.getAlwaysSpan = function() {
  return this.alwaysSpan_;
};
goog.i18n.BidiFormatter.prototype.setContextDir = function(a) {
  this.contextDir_ = goog.i18n.bidi.toDir(a, !0);
};
goog.i18n.BidiFormatter.prototype.setAlwaysSpan = function(a) {
  this.alwaysSpan_ = a;
};
goog.i18n.BidiFormatter.prototype.estimateDirection = goog.i18n.bidi.estimateDirection;
goog.i18n.BidiFormatter.prototype.areDirectionalitiesOpposite_ = function(a, b) {
  return 0 > Number(a) * Number(b);
};
goog.i18n.BidiFormatter.prototype.dirResetIfNeeded_ = function(a, b, c, d) {
  return d && (this.areDirectionalitiesOpposite_(b, this.contextDir_) || this.contextDir_ == goog.i18n.bidi.Dir.LTR && goog.i18n.bidi.endsWithRtl(a, c) || this.contextDir_ == goog.i18n.bidi.Dir.RTL && goog.i18n.bidi.endsWithLtr(a, c)) ? this.contextDir_ == goog.i18n.bidi.Dir.LTR ? goog.i18n.bidi.Format.LRM : goog.i18n.bidi.Format.RLM : "";
};
goog.i18n.BidiFormatter.prototype.dirAttrValue = function(a, b) {
  return this.knownDirAttrValue(this.estimateDirection(a, b));
};
goog.i18n.BidiFormatter.prototype.knownDirAttrValue = function(a) {
  return (a == goog.i18n.bidi.Dir.NEUTRAL ? this.contextDir_ : a) == goog.i18n.bidi.Dir.RTL ? "rtl" : "ltr";
};
goog.i18n.BidiFormatter.prototype.dirAttr = function(a, b) {
  return this.knownDirAttr(this.estimateDirection(a, b));
};
goog.i18n.BidiFormatter.prototype.knownDirAttr = function(a) {
  return a != this.contextDir_ ? a == goog.i18n.bidi.Dir.RTL ? 'dir="rtl"' : a == goog.i18n.bidi.Dir.LTR ? 'dir="ltr"' : "" : "";
};
goog.i18n.BidiFormatter.prototype.spanWrapSafeHtml = function(a, b) {
  return this.spanWrapSafeHtmlWithKnownDir(null, a, b);
};
goog.i18n.BidiFormatter.prototype.spanWrapSafeHtmlWithKnownDir = function(a, b, c) {
  null == a && (a = this.estimateDirection(goog.html.SafeHtml.unwrap(b), !0));
  return this.spanWrapWithKnownDir_(a, b, c);
};
goog.i18n.BidiFormatter.prototype.spanWrapWithKnownDir_ = function(a, b, c) {
  c = c || void 0 == c;
  var d = a != goog.i18n.bidi.Dir.NEUTRAL && a != this.contextDir_;
  if (this.alwaysSpan_ || d) {
    var e;
    d && (e = a == goog.i18n.bidi.Dir.RTL ? "rtl" : "ltr");
    d = goog.html.SafeHtml.create("span", {dir:e}, b);
  } else {
    d = b;
  }
  b = goog.html.SafeHtml.unwrap(b);
  return d = goog.html.SafeHtml.concatWithDir(goog.i18n.bidi.Dir.NEUTRAL, d, this.dirResetIfNeeded_(b, a, !0, c));
};
goog.i18n.BidiFormatter.prototype.unicodeWrap = function(a, b, c) {
  return this.unicodeWrapWithKnownDir(null, a, b, c);
};
goog.i18n.BidiFormatter.prototype.unicodeWrapWithKnownDir = function(a, b, c, d) {
  null == a && (a = this.estimateDirection(b, c));
  return this.unicodeWrapWithKnownDir_(a, b, c, d);
};
goog.i18n.BidiFormatter.prototype.unicodeWrapWithKnownDir_ = function(a, b, c, d) {
  d = d || void 0 == d;
  var e = [];
  a != goog.i18n.bidi.Dir.NEUTRAL && a != this.contextDir_ ? (e.push(a == goog.i18n.bidi.Dir.RTL ? goog.i18n.bidi.Format.RLE : goog.i18n.bidi.Format.LRE), e.push(b), e.push(goog.i18n.bidi.Format.PDF)) : e.push(b);
  e.push(this.dirResetIfNeeded_(b, a, c, d));
  return e.join("");
};
goog.i18n.BidiFormatter.prototype.markAfter = function(a, b) {
  return this.markAfterKnownDir(null, a, b);
};
goog.i18n.BidiFormatter.prototype.markAfterKnownDir = function(a, b, c) {
  null == a && (a = this.estimateDirection(b, c));
  return this.dirResetIfNeeded_(b, a, c, !0);
};
goog.i18n.BidiFormatter.prototype.mark = function() {
  switch(this.contextDir_) {
    case goog.i18n.bidi.Dir.LTR:
      return goog.i18n.bidi.Format.LRM;
    case goog.i18n.bidi.Dir.RTL:
      return goog.i18n.bidi.Format.RLM;
    default:
      return "";
  }
};
goog.i18n.BidiFormatter.prototype.startEdge = function() {
  return this.contextDir_ == goog.i18n.bidi.Dir.RTL ? goog.i18n.bidi.RIGHT : goog.i18n.bidi.LEFT;
};
goog.i18n.BidiFormatter.prototype.endEdge = function() {
  return this.contextDir_ == goog.i18n.bidi.Dir.RTL ? goog.i18n.bidi.LEFT : goog.i18n.bidi.RIGHT;
};
var soy = {asserts:{}, esc:{}}, soydata = {VERY_UNSAFE:{}, isContentKind_:function(a, b) {
  return null != a && a.contentKind === b;
}, getContentDir:function(a) {
  if (null != a) {
    switch(a.contentDir) {
      case goog.i18n.bidi.Dir.LTR:
        return goog.i18n.bidi.Dir.LTR;
      case goog.i18n.bidi.Dir.RTL:
        return goog.i18n.bidi.Dir.RTL;
      case goog.i18n.bidi.Dir.NEUTRAL:
        return goog.i18n.bidi.Dir.NEUTRAL;
    }
  }
  return null;
}, SanitizedHtml:function() {
  goog.soy.data.SanitizedHtml.call(this);
}};
goog.inherits(soydata.SanitizedHtml, goog.soy.data.SanitizedHtml);
soydata.SanitizedHtml.from = function(a) {
  return null != a && a.contentKind === goog.soy.data.SanitizedContentKind.HTML ? (goog.asserts.assert(a.constructor === goog.soy.data.SanitizedHtml), a) : a instanceof goog.html.SafeHtml ? soydata.VERY_UNSAFE.ordainSanitizedHtml(goog.html.SafeHtml.unwrap(a), a.getDirection()) : soydata.VERY_UNSAFE.ordainSanitizedHtml(soy.esc.$$escapeHtmlHelper(String(a)), soydata.getContentDir(a));
};
soydata.$$EMPTY_STRING_ = {VALUE:""};
soydata.$$makeSanitizedContentFactory_ = function(a) {
  function b(a) {
    this.content = a;
  }
  b.prototype = a.prototype;
  return function(a, d) {
    a = new b(String(a));
    void 0 !== d && (a.contentDir = d);
    return a;
  };
};
soydata.$$makeSanitizedContentFactoryWithDefaultDirOnly_ = function(a) {
  function b(a) {
    this.content = a;
  }
  b.prototype = a.prototype;
  return function(a) {
    return new b(String(a));
  };
};
soydata.markUnsanitizedText = function(a, b) {
  return new goog.soy.data.UnsanitizedText(a, b);
};
soydata.VERY_UNSAFE.ordainSanitizedHtml = soydata.$$makeSanitizedContentFactory_(goog.soy.data.SanitizedHtml);
soydata.VERY_UNSAFE.ordainSanitizedJs = soydata.$$makeSanitizedContentFactoryWithDefaultDirOnly_(goog.soy.data.SanitizedJs);
soydata.VERY_UNSAFE.ordainSanitizedUri = soydata.$$makeSanitizedContentFactoryWithDefaultDirOnly_(goog.soy.data.SanitizedUri);
soydata.VERY_UNSAFE.ordainSanitizedTrustedResourceUri = soydata.$$makeSanitizedContentFactoryWithDefaultDirOnly_(goog.soy.data.SanitizedTrustedResourceUri);
soydata.VERY_UNSAFE.ordainSanitizedHtmlAttribute = soydata.$$makeSanitizedContentFactoryWithDefaultDirOnly_(goog.soy.data.SanitizedHtmlAttribute);
soydata.VERY_UNSAFE.ordainSanitizedStyle = soydata.$$makeSanitizedContentFactoryWithDefaultDirOnly_(goog.soy.data.SanitizedStyle);
soydata.VERY_UNSAFE.ordainSanitizedCss = soydata.$$makeSanitizedContentFactoryWithDefaultDirOnly_(goog.soy.data.SanitizedCss);
soy.$$IS_LOCALE_RTL = goog.i18n.bidi.IS_RTL;
soy.$$augmentMap = function(a, b) {
  return soy.$$assignDefaults(soy.$$assignDefaults({}, b), a);
};
soy.$$assignDefaults = function(a, b) {
  for (var c in b) {
    c in a || (a[c] = b[c]);
  }
  return a;
};
soy.$$checkLegacyObjectMapLiteralKey = function(a) {
  if ("string" != typeof a) {
    throw Error("Map literal's key expression must evaluate to string (encountered type \"" + typeof a + '").');
  }
  return a;
};
soy.$$getMapKeys = function(a) {
  var b = [], c;
  for (c in a) {
    b.push(c);
  }
  return b;
};
soy.$$checkNotNull = function(a) {
  if (null == a) {
    throw Error("unexpected null value");
  }
  return a;
};
soy.$$parseInt = function(a) {
  a = parseInt(a, 10);
  return isNaN(a) ? null : a;
};
soy.$$parseFloat = function(a) {
  a = parseFloat(a);
  return isNaN(a) ? null : a;
};
soy.$$getDelTemplateId = function(a) {
  return a;
};
soy.$$DELEGATE_REGISTRY_PRIORITIES_ = {};
soy.$$DELEGATE_REGISTRY_FUNCTIONS_ = {};
soy.$$registerDelegateFn = function(a, b, c, d) {
  var e = "key_" + a + ":" + b, f = soy.$$DELEGATE_REGISTRY_PRIORITIES_[e];
  if (void 0 === f || c > f) {
    soy.$$DELEGATE_REGISTRY_PRIORITIES_[e] = c, soy.$$DELEGATE_REGISTRY_FUNCTIONS_[e] = d;
  } else {
    if (c == f) {
      throw Error('Encountered two active delegates with the same priority ("' + a + ":" + b + '").');
    }
  }
};
soy.$$getDelegateFn = function(a, b, c) {
  var d = soy.$$DELEGATE_REGISTRY_FUNCTIONS_["key_" + a + ":" + b];
  d || "" == b || (d = soy.$$DELEGATE_REGISTRY_FUNCTIONS_["key_" + a + ":"]);
  if (d) {
    return d;
  }
  if (c) {
    return soy.$$EMPTY_TEMPLATE_FN_;
  }
  throw Error('Found no active impl for delegate call to "' + a + (b ? ":" + b : "") + '" (and delcall does not set allowemptydefault="true").');
};
soy.$$EMPTY_TEMPLATE_FN_ = function(a, b, c) {
  return "";
};
soydata.$$makeSanitizedContentFactoryForInternalBlocks_ = function(a) {
  function b(a) {
    this.content = a;
  }
  b.prototype = a.prototype;
  return function(a, d) {
    a = String(a);
    if (!a) {
      return soydata.$$EMPTY_STRING_.VALUE;
    }
    a = new b(a);
    void 0 !== d && (a.contentDir = d);
    return a;
  };
};
soydata.$$makeSanitizedContentFactoryWithDefaultDirOnlyForInternalBlocks_ = function(a) {
  function b(a) {
    this.content = a;
  }
  b.prototype = a.prototype;
  return function(a) {
    return (a = String(a)) ? new b(a) : soydata.$$EMPTY_STRING_.VALUE;
  };
};
soydata.$$markUnsanitizedTextForInternalBlocks = function(a, b) {
  return (a = String(a)) ? new goog.soy.data.UnsanitizedText(a, b) : soydata.$$EMPTY_STRING_.VALUE;
};
soydata.VERY_UNSAFE.$$ordainSanitizedHtmlForInternalBlocks = soydata.$$makeSanitizedContentFactoryForInternalBlocks_(goog.soy.data.SanitizedHtml);
soydata.VERY_UNSAFE.$$ordainSanitizedJsForInternalBlocks = soydata.$$makeSanitizedContentFactoryWithDefaultDirOnlyForInternalBlocks_(goog.soy.data.SanitizedJs);
soydata.VERY_UNSAFE.$$ordainSanitizedTrustedResourceUriForInternalBlocks = soydata.$$makeSanitizedContentFactoryWithDefaultDirOnlyForInternalBlocks_(goog.soy.data.SanitizedTrustedResourceUri);
soydata.VERY_UNSAFE.$$ordainSanitizedUriForInternalBlocks = soydata.$$makeSanitizedContentFactoryWithDefaultDirOnlyForInternalBlocks_(goog.soy.data.SanitizedUri);
soydata.VERY_UNSAFE.$$ordainSanitizedAttributesForInternalBlocks = soydata.$$makeSanitizedContentFactoryWithDefaultDirOnlyForInternalBlocks_(goog.soy.data.SanitizedHtmlAttribute);
soydata.VERY_UNSAFE.$$ordainSanitizedStyleForInternalBlocks = soydata.$$makeSanitizedContentFactoryWithDefaultDirOnlyForInternalBlocks_(goog.soy.data.SanitizedStyle);
soydata.VERY_UNSAFE.$$ordainSanitizedCssForInternalBlocks = soydata.$$makeSanitizedContentFactoryWithDefaultDirOnlyForInternalBlocks_(goog.soy.data.SanitizedCss);
soy.$$escapeHtml = function(a) {
  return soydata.SanitizedHtml.from(a);
};
soy.$$cleanHtml = function(a, b) {
  if (soydata.isContentKind_(a, goog.soy.data.SanitizedContentKind.HTML)) {
    return goog.asserts.assert(a.constructor === goog.soy.data.SanitizedHtml), a;
  }
  b ? (b = {[b]:!0}, goog.object.extend(b, soy.esc.$$SAFE_TAG_WHITELIST_)) : b = soy.esc.$$SAFE_TAG_WHITELIST_;
  return soydata.VERY_UNSAFE.ordainSanitizedHtml(soy.$$stripHtmlTags(a, b), soydata.getContentDir(a));
};
soy.$$normalizeHtml = function(a) {
  return soy.esc.$$normalizeHtmlHelper(a);
};
soy.$$escapeHtmlRcdata = function(a) {
  return soydata.isContentKind_(a, goog.soy.data.SanitizedContentKind.HTML) ? (goog.asserts.assert(a.constructor === goog.soy.data.SanitizedHtml), soy.esc.$$normalizeHtmlHelper(a.getContent())) : soy.esc.$$escapeHtmlHelper(a);
};
soy.$$HTML5_VOID_ELEMENTS_ = /^<(?:area|base|br|col|command|embed|hr|img|input|keygen|link|meta|param|source|track|wbr)\b/;
soy.$$stripHtmlTags = function(a, b) {
  if (!b) {
    return String(a).replace(soy.esc.$$HTML_TAG_REGEX_, "").replace(soy.esc.$$LT_REGEX_, "&lt;");
  }
  a = String(a).replace(/\[/g, "&#91;");
  var c = [], d = [];
  a = a.replace(soy.esc.$$HTML_TAG_REGEX_, function(a, e) {
    if (e && (e = e.toLowerCase(), b.hasOwnProperty(e) && b[e])) {
      var f = "/" == a.charAt(1), g = c.length, l = "</", m = "";
      if (!f) {
        for (l = "<"; f = soy.esc.$$HTML_ATTRIBUTE_REGEX_.exec(a);) {
          if (f[1] && "dir" == f[1].toLowerCase()) {
            if (a = f[2]) {
              if ("'" == a.charAt(0) || '"' == a.charAt(0)) {
                a = a.substr(1, a.length - 2);
              }
              a = a.toLowerCase();
              if ("ltr" == a || "rtl" == a || "auto" == a) {
                m = ' dir="' + a + '"';
              }
            }
            break;
          }
        }
        soy.esc.$$HTML_ATTRIBUTE_REGEX_.lastIndex = 0;
      }
      c[g] = l + e + ">";
      d[g] = m;
      return "[" + g + "]";
    }
    return "";
  });
  a = soy.esc.$$normalizeHtmlHelper(a);
  var e = soy.$$balanceTags_(c);
  a = a.replace(/\[(\d+)\]/g, function(a, b) {
    return d[b] && c[b] ? c[b].substr(0, c[b].length - 1) + d[b] + ">" : c[b];
  });
  return a + e;
};
soy.$$embedCssIntoHtml_ = function(a) {
  return a.replace(/<\//g, "<\\/").replace(/\]\]>/g, "]]\\>");
};
soy.$$balanceTags_ = function(a) {
  for (var b = [], c = 0, d = a.length; c < d; ++c) {
    var e = a[c];
    "/" == e.charAt(1) ? (e = goog.array.lastIndexOf(b, e), 0 > e ? a[c] = "" : (a[c] = b.slice(e).reverse().join(""), b.length = e)) : "<li>" == e && 0 > goog.array.lastIndexOf(b, "</ol>") && 0 > goog.array.lastIndexOf(b, "</ul>") ? a[c] = "" : soy.$$HTML5_VOID_ELEMENTS_.test(e) || b.push("</" + e.substring(1));
  }
  return b.reverse().join("");
};
soy.$$escapeHtmlAttribute = function(a) {
  return soydata.isContentKind_(a, goog.soy.data.SanitizedContentKind.HTML) ? (goog.asserts.assert(a.constructor === goog.soy.data.SanitizedHtml), soy.esc.$$normalizeHtmlHelper(soy.$$stripHtmlTags(a.getContent()))) : soy.esc.$$escapeHtmlHelper(a);
};
soy.$$escapeHtmlAttributeNospace = function(a) {
  return soydata.isContentKind_(a, goog.soy.data.SanitizedContentKind.HTML) ? (goog.asserts.assert(a.constructor === goog.soy.data.SanitizedHtml), soy.esc.$$normalizeHtmlNospaceHelper(soy.$$stripHtmlTags(a.getContent()))) : soy.esc.$$escapeHtmlNospaceHelper(a);
};
soy.$$filterHtmlAttributes = function(a) {
  return soydata.isContentKind_(a, goog.soy.data.SanitizedContentKind.ATTRIBUTES) ? (goog.asserts.assert(a.constructor === goog.soy.data.SanitizedHtmlAttribute), a.getContent().replace(/([^"'\s])$/, "$1 ")) : soy.esc.$$filterHtmlAttributesHelper(a);
};
soy.$$filterHtmlElementName = function(a) {
  return soy.esc.$$filterHtmlElementNameHelper(a);
};
soy.$$escapeJsString = function(a) {
  return soy.esc.$$escapeJsStringHelper(a);
};
soy.$$escapeJsValue = function(a) {
  if (null == a) {
    return " null ";
  }
  if (soydata.isContentKind_(a, goog.soy.data.SanitizedContentKind.JS)) {
    return goog.asserts.assert(a.constructor === goog.soy.data.SanitizedJs), a.getContent();
  }
  if (a instanceof goog.html.SafeScript) {
    return goog.html.SafeScript.unwrap(a);
  }
  switch(typeof a) {
    case "boolean":
    case "number":
      return " " + a + " ";
    default:
      return "'" + soy.esc.$$escapeJsStringHelper(String(a)) + "'";
  }
};
soy.$$escapeJsRegex = function(a) {
  return soy.esc.$$escapeJsRegexHelper(a);
};
soy.$$problematicUriMarks_ = /['()]/g;
soy.$$pctEncode_ = function(a) {
  return "%" + a.charCodeAt(0).toString(16);
};
soy.$$escapeUri = function(a) {
  a = soy.esc.$$escapeUriHelper(a);
  soy.$$problematicUriMarks_.lastIndex = 0;
  return soy.$$problematicUriMarks_.test(a) ? a.replace(soy.$$problematicUriMarks_, soy.$$pctEncode_) : a;
};
soy.$$normalizeUri = function(a) {
  return soy.esc.$$normalizeUriHelper(a);
};
soy.$$filterNormalizeUri = function(a) {
  return soydata.isContentKind_(a, goog.soy.data.SanitizedContentKind.URI) ? (goog.asserts.assert(a.constructor === goog.soy.data.SanitizedUri), soy.$$normalizeUri(a)) : soydata.isContentKind_(a, goog.soy.data.SanitizedContentKind.TRUSTED_RESOURCE_URI) ? (goog.asserts.assert(a.constructor === goog.soy.data.SanitizedTrustedResourceUri), soy.$$normalizeUri(a)) : a instanceof goog.html.SafeUrl ? soy.$$normalizeUri(goog.html.SafeUrl.unwrap(a)) : a instanceof goog.html.TrustedResourceUrl ? soy.$$normalizeUri(goog.html.TrustedResourceUrl.unwrap(a)) : 
  soy.esc.$$filterNormalizeUriHelper(a);
};
soy.$$filterNormalizeMediaUri = function(a) {
  return soydata.isContentKind_(a, goog.soy.data.SanitizedContentKind.URI) ? (goog.asserts.assert(a.constructor === goog.soy.data.SanitizedUri), soy.$$normalizeUri(a)) : soydata.isContentKind_(a, goog.soy.data.SanitizedContentKind.TRUSTED_RESOURCE_URI) ? (goog.asserts.assert(a.constructor === goog.soy.data.SanitizedTrustedResourceUri), soy.$$normalizeUri(a)) : a instanceof goog.html.SafeUrl ? soy.$$normalizeUri(goog.html.SafeUrl.unwrap(a)) : a instanceof goog.html.TrustedResourceUrl ? soy.$$normalizeUri(goog.html.TrustedResourceUrl.unwrap(a)) : 
  soy.esc.$$filterNormalizeMediaUriHelper(a);
};
soy.$$filterTrustedResourceUri = function(a) {
  if (soydata.isContentKind_(a, goog.soy.data.SanitizedContentKind.TRUSTED_RESOURCE_URI)) {
    return goog.asserts.assert(a.constructor === goog.soy.data.SanitizedTrustedResourceUri), a.getContent();
  }
  if (a instanceof goog.html.TrustedResourceUrl) {
    return goog.html.TrustedResourceUrl.unwrap(a);
  }
  goog.asserts.fail("Bad value `%s` for |filterTrustedResourceUri", [String(a)]);
  return "about:invalid#zSoyz";
};
soy.$$blessStringAsTrustedResourceUrlForLegacy = function(a) {
  return a;
};
soy.$$filterImageDataUri = function(a) {
  return soydata.VERY_UNSAFE.ordainSanitizedUri(soy.esc.$$filterImageDataUriHelper(a));
};
soy.$$filterSipUri = function(a) {
  return soydata.VERY_UNSAFE.ordainSanitizedUri(soy.esc.$$filterSipUriHelper(a));
};
soy.$$filterTelUri = function(a) {
  return soydata.VERY_UNSAFE.ordainSanitizedUri(soy.esc.$$filterTelUriHelper(a));
};
soy.$$escapeCssString = function(a) {
  return soy.esc.$$escapeCssStringHelper(a);
};
soy.$$filterCssValue = function(a) {
  return soydata.isContentKind_(a, goog.soy.data.SanitizedContentKind.CSS) ? (goog.asserts.assertInstanceof(a, goog.soy.data.SanitizedCss), soy.$$embedCssIntoHtml_(a.getContent())) : null == a ? "" : a instanceof goog.html.SafeStyle ? soy.$$embedCssIntoHtml_(goog.html.SafeStyle.unwrap(a)) : a instanceof goog.html.SafeStyleSheet ? soy.$$embedCssIntoHtml_(goog.html.SafeStyleSheet.unwrap(a)) : soy.esc.$$filterCssValueHelper(a);
};
soy.$$filterNoAutoescape = function(a) {
  return soydata.isContentKind_(a, goog.soy.data.SanitizedContentKind.TEXT) ? (goog.asserts.fail("Tainted SanitizedContentKind.TEXT for |noAutoescape: `%s`", [a.getContent()]), "zSoyz") : a;
};
soy.$$changeNewlineToBr = function(a) {
  var b = goog.string.newLineToBr(String(a), !1);
  return soydata.isContentKind_(a, goog.soy.data.SanitizedContentKind.HTML) ? soydata.VERY_UNSAFE.ordainSanitizedHtml(b, soydata.getContentDir(a)) : b;
};
soy.$$insertWordBreaks = function(a, b) {
  b = goog.format.insertWordBreaks(String(a), b);
  return soydata.isContentKind_(a, goog.soy.data.SanitizedContentKind.HTML) ? soydata.VERY_UNSAFE.ordainSanitizedHtml(b, soydata.getContentDir(a)) : b;
};
soy.$$truncate = function(a, b, c) {
  a = String(a);
  if (a.length <= b) {
    return a;
  }
  c && (3 < b ? b -= 3 : c = !1);
  soy.$$isHighSurrogate_(a.charCodeAt(b - 1)) && soy.$$isLowSurrogate_(a.charCodeAt(b)) && --b;
  a = a.substring(0, b);
  c && (a += "...");
  return a;
};
soy.$$isHighSurrogate_ = function(a) {
  return 55296 <= a && 56319 >= a;
};
soy.$$isLowSurrogate_ = function(a) {
  return 56320 <= a && 57343 >= a;
};
soy.$$bidiFormatterCache_ = {};
soy.$$getBidiFormatterInstance_ = function(a) {
  return soy.$$bidiFormatterCache_[a] || (soy.$$bidiFormatterCache_[a] = new goog.i18n.BidiFormatter(a));
};
soy.$$bidiTextDir = function(a, b) {
  var c = soydata.getContentDir(a);
  if (null != c) {
    return c;
  }
  b = b || soydata.isContentKind_(a, goog.soy.data.SanitizedContentKind.HTML);
  return goog.i18n.bidi.estimateDirection(a + "", b);
};
soy.$$bidiDirAttr = function(a, b, c) {
  a = soy.$$getBidiFormatterInstance_(a);
  var d = soydata.getContentDir(b);
  null == d && (c = c || soydata.isContentKind_(b, goog.soy.data.SanitizedContentKind.HTML), d = goog.i18n.bidi.estimateDirection(b + "", c));
  return soydata.VERY_UNSAFE.ordainSanitizedHtmlAttribute(a.knownDirAttr(d));
};
soy.$$bidiMarkAfter = function(a, b, c) {
  a = soy.$$getBidiFormatterInstance_(a);
  c = c || soydata.isContentKind_(b, goog.soy.data.SanitizedContentKind.HTML);
  return a.markAfterKnownDir(soydata.getContentDir(b), b + "", c);
};
soy.$$bidiSpanWrap = function(a, b) {
  a = soy.$$getBidiFormatterInstance_(a);
  var c = goog.html.uncheckedconversions.safeHtmlFromStringKnownToSatisfyTypeContract(goog.string.Const.from("Soy |bidiSpanWrap is applied on an autoescaped text."), String(b));
  b = a.spanWrapSafeHtmlWithKnownDir(soydata.getContentDir(b), c);
  return goog.html.SafeHtml.unwrap(b);
};
soy.$$bidiUnicodeWrap = function(a, b) {
  var c = soy.$$getBidiFormatterInstance_(a);
  a = soydata.isContentKind_(b, goog.soy.data.SanitizedContentKind.HTML);
  var d = c.unicodeWrapWithKnownDir(soydata.getContentDir(b), b + "", a);
  c = c.getContextDir();
  return soydata.isContentKind_(b, goog.soy.data.SanitizedContentKind.TEXT) ? new goog.soy.data.UnsanitizedText(d, c) : a ? soydata.VERY_UNSAFE.ordainSanitizedHtml(d, c) : d;
};
soy.asserts.assertType = function(a, b, c, d) {
  goog.asserts.ENABLE_ASSERTS && !a && (a = "expected param " + b + " of type " + d + (goog.DEBUG ? ", but got " + goog.debug.runtimeType(c) : "") + ".", goog.asserts.fail(a));
  return c;
};
soy.$$debugSoyTemplateInfo = !1;
goog.DEBUG && (soy.setDebugSoyTemplateInfo = function(a) {
  soy.$$debugSoyTemplateInfo = a;
});
soy.esc.$$escapeHtmlHelper = function(a) {
  return goog.string.htmlEscape(String(a));
};
soy.esc.$$escapeUriHelper = function(a) {
  return goog.string.urlEncode(String(a));
};
soy.esc.$$ESCAPE_MAP_FOR_NORMALIZE_HTML__AND__ESCAPE_HTML_NOSPACE__AND__NORMALIZE_HTML_NOSPACE_ = {"\x00":"&#0;", "\t":"&#9;", "\n":"&#10;", "\x0B":"&#11;", "\f":"&#12;", "\r":"&#13;", " ":"&#32;", '"':"&quot;", "&":"&amp;", "'":"&#39;", "-":"&#45;", "/":"&#47;", "<":"&lt;", "=":"&#61;", ">":"&gt;", "`":"&#96;", "\u0085":"&#133;", "\u00a0":"&#160;", "\u2028":"&#8232;", "\u2029":"&#8233;"};
soy.esc.$$REPLACER_FOR_NORMALIZE_HTML__AND__ESCAPE_HTML_NOSPACE__AND__NORMALIZE_HTML_NOSPACE_ = function(a) {
  return soy.esc.$$ESCAPE_MAP_FOR_NORMALIZE_HTML__AND__ESCAPE_HTML_NOSPACE__AND__NORMALIZE_HTML_NOSPACE_[a];
};
soy.esc.$$ESCAPE_MAP_FOR_ESCAPE_JS_STRING__AND__ESCAPE_JS_REGEX_ = {"\x00":"\\x00", "\b":"\\x08", "\t":"\\t", "\n":"\\n", "\x0B":"\\x0b", "\f":"\\f", "\r":"\\r", '"':"\\x22", $:"\\x24", "&":"\\x26", "'":"\\x27", "(":"\\x28", ")":"\\x29", "*":"\\x2a", "+":"\\x2b", ",":"\\x2c", "-":"\\x2d", ".":"\\x2e", "/":"\\/", ":":"\\x3a", "<":"\\x3c", "=":"\\x3d", ">":"\\x3e", "?":"\\x3f", "[":"\\x5b", "\\":"\\\\", "]":"\\x5d", "^":"\\x5e", "{":"\\x7b", "|":"\\x7c", "}":"\\x7d", "\u0085":"\\x85", "\u2028":"\\u2028", 
"\u2029":"\\u2029"};
soy.esc.$$REPLACER_FOR_ESCAPE_JS_STRING__AND__ESCAPE_JS_REGEX_ = function(a) {
  return soy.esc.$$ESCAPE_MAP_FOR_ESCAPE_JS_STRING__AND__ESCAPE_JS_REGEX_[a];
};
soy.esc.$$ESCAPE_MAP_FOR_ESCAPE_CSS_STRING_ = {"\x00":"\\0 ", "\b":"\\8 ", "\t":"\\9 ", "\n":"\\a ", "\x0B":"\\b ", "\f":"\\c ", "\r":"\\d ", '"':"\\22 ", "&":"\\26 ", "'":"\\27 ", "(":"\\28 ", ")":"\\29 ", "*":"\\2a ", "/":"\\2f ", ":":"\\3a ", ";":"\\3b ", "<":"\\3c ", "=":"\\3d ", ">":"\\3e ", "@":"\\40 ", "\\":"\\5c ", "{":"\\7b ", "}":"\\7d ", "\u0085":"\\85 ", "\u00a0":"\\a0 ", "\u2028":"\\2028 ", "\u2029":"\\2029 "};
soy.esc.$$REPLACER_FOR_ESCAPE_CSS_STRING_ = function(a) {
  return soy.esc.$$ESCAPE_MAP_FOR_ESCAPE_CSS_STRING_[a];
};
soy.esc.$$ESCAPE_MAP_FOR_NORMALIZE_URI__AND__FILTER_NORMALIZE_URI__AND__FILTER_NORMALIZE_MEDIA_URI_ = {"\x00":"%00", "\u0001":"%01", "\u0002":"%02", "\u0003":"%03", "\u0004":"%04", "\u0005":"%05", "\u0006":"%06", "\u0007":"%07", "\b":"%08", "\t":"%09", "\n":"%0A", "\x0B":"%0B", "\f":"%0C", "\r":"%0D", "\u000e":"%0E", "\u000f":"%0F", "\u0010":"%10", "\u0011":"%11", "\u0012":"%12", "\u0013":"%13", "\u0014":"%14", "\u0015":"%15", "\u0016":"%16", "\u0017":"%17", "\u0018":"%18", "\u0019":"%19", "\u001a":"%1A", 
"\u001b":"%1B", "\u001c":"%1C", "\u001d":"%1D", "\u001e":"%1E", "\u001f":"%1F", " ":"%20", '"':"%22", "'":"%27", "(":"%28", ")":"%29", "<":"%3C", ">":"%3E", "\\":"%5C", "{":"%7B", "}":"%7D", "\u007f":"%7F", "\u0085":"%C2%85", "\u00a0":"%C2%A0", "\u2028":"%E2%80%A8", "\u2029":"%E2%80%A9", "\uff01":"%EF%BC%81", "\uff03":"%EF%BC%83", "\uff04":"%EF%BC%84", "\uff06":"%EF%BC%86", "\uff07":"%EF%BC%87", "\uff08":"%EF%BC%88", "\uff09":"%EF%BC%89", "\uff0a":"%EF%BC%8A", "\uff0b":"%EF%BC%8B", "\uff0c":"%EF%BC%8C", 
"\uff0f":"%EF%BC%8F", "\uff1a":"%EF%BC%9A", "\uff1b":"%EF%BC%9B", "\uff1d":"%EF%BC%9D", "\uff1f":"%EF%BC%9F", "\uff20":"%EF%BC%A0", "\uff3b":"%EF%BC%BB", "\uff3d":"%EF%BC%BD"};
soy.esc.$$REPLACER_FOR_NORMALIZE_URI__AND__FILTER_NORMALIZE_URI__AND__FILTER_NORMALIZE_MEDIA_URI_ = function(a) {
  return soy.esc.$$ESCAPE_MAP_FOR_NORMALIZE_URI__AND__FILTER_NORMALIZE_URI__AND__FILTER_NORMALIZE_MEDIA_URI_[a];
};
soy.esc.$$MATCHER_FOR_NORMALIZE_HTML_ = /[\x00\x22\x27\x3c\x3e]/g;
soy.esc.$$MATCHER_FOR_ESCAPE_HTML_NOSPACE_ = /[\x00\x09-\x0d \x22\x26\x27\x2d\/\x3c-\x3e`\x85\xa0\u2028\u2029]/g;
soy.esc.$$MATCHER_FOR_NORMALIZE_HTML_NOSPACE_ = /[\x00\x09-\x0d \x22\x27\x2d\/\x3c-\x3e`\x85\xa0\u2028\u2029]/g;
soy.esc.$$MATCHER_FOR_ESCAPE_JS_STRING_ = /[\x00\x08-\x0d\x22\x26\x27\/\x3c-\x3e\x5b-\x5d\x7b\x7d\x85\u2028\u2029]/g;
soy.esc.$$MATCHER_FOR_ESCAPE_JS_REGEX_ = /[\x00\x08-\x0d\x22\x24\x26-\/\x3a\x3c-\x3f\x5b-\x5e\x7b-\x7d\x85\u2028\u2029]/g;
soy.esc.$$MATCHER_FOR_ESCAPE_CSS_STRING_ = /[\x00\x08-\x0d\x22\x26-\x2a\/\x3a-\x3e@\\\x7b\x7d\x85\xa0\u2028\u2029]/g;
soy.esc.$$MATCHER_FOR_NORMALIZE_URI__AND__FILTER_NORMALIZE_URI__AND__FILTER_NORMALIZE_MEDIA_URI_ = /[\x00- \x22\x27-\x29\x3c\x3e\\\x7b\x7d\x7f\x85\xa0\u2028\u2029\uff01\uff03\uff04\uff06-\uff0c\uff0f\uff1a\uff1b\uff1d\uff1f\uff20\uff3b\uff3d]/g;
soy.esc.$$FILTER_FOR_FILTER_CSS_VALUE_ = /^(?!-*(?:expression|(?:moz-)?binding))(?!\s+)(?:[.#]?-?(?:[_a-z0-9-]+)(?:-[_a-z0-9-]+)*-?|(?:rgb|hsl)a?\([0-9.%,\u0020]+\)|-?(?:[0-9]+(?:\.[0-9]*)?|\.[0-9]+)(?:[a-z]{1,2}|%)?|!important|\s+)*$/i;
soy.esc.$$FILTER_FOR_FILTER_NORMALIZE_URI_ = /^(?![^#?]*\/(?:\.|%2E){2}(?:[\/?#]|$))(?:(?:https?|mailto):|[^&:\/?#]*(?:[\/?#]|$))/i;
soy.esc.$$FILTER_FOR_FILTER_NORMALIZE_MEDIA_URI_ = /^[^&:\/?#]*(?:[\/?#]|$)|^https?:|^data:image\/[a-z0-9+]+;base64,[a-z0-9+\/]+=*$|^blob:/i;
soy.esc.$$FILTER_FOR_FILTER_IMAGE_DATA_URI_ = /^data:image\/(?:bmp|gif|jpe?g|png|tiff|webp);base64,[a-z0-9+\/]+=*$/i;
soy.esc.$$FILTER_FOR_FILTER_SIP_URI_ = /^sip:[0-9a-z;=\-+._!~*'\u0020\/():&$#?@,]+$/i;
soy.esc.$$FILTER_FOR_FILTER_TEL_URI_ = /^tel:[0-9a-z;=\-+._!~*'\u0020\/():&$#?@,]+$/i;
soy.esc.$$FILTER_FOR_FILTER_HTML_ATTRIBUTES_ = /^(?!on|src|(?:style|action|archive|background|cite|classid|codebase|data|dsync|href|longdesc|usemap)\s*$)(?:[a-z0-9_$:-]*)$/i;
soy.esc.$$FILTER_FOR_FILTER_HTML_ELEMENT_NAME_ = /^(?!base|iframe|link|no|script|style|textarea|title|xmp)[a-z0-9_$:-]*$/i;
soy.esc.$$normalizeHtmlHelper = function(a) {
  return String(a).replace(soy.esc.$$MATCHER_FOR_NORMALIZE_HTML_, soy.esc.$$REPLACER_FOR_NORMALIZE_HTML__AND__ESCAPE_HTML_NOSPACE__AND__NORMALIZE_HTML_NOSPACE_);
};
soy.esc.$$escapeHtmlNospaceHelper = function(a) {
  return String(a).replace(soy.esc.$$MATCHER_FOR_ESCAPE_HTML_NOSPACE_, soy.esc.$$REPLACER_FOR_NORMALIZE_HTML__AND__ESCAPE_HTML_NOSPACE__AND__NORMALIZE_HTML_NOSPACE_);
};
soy.esc.$$normalizeHtmlNospaceHelper = function(a) {
  return String(a).replace(soy.esc.$$MATCHER_FOR_NORMALIZE_HTML_NOSPACE_, soy.esc.$$REPLACER_FOR_NORMALIZE_HTML__AND__ESCAPE_HTML_NOSPACE__AND__NORMALIZE_HTML_NOSPACE_);
};
soy.esc.$$escapeJsStringHelper = function(a) {
  return String(a).replace(soy.esc.$$MATCHER_FOR_ESCAPE_JS_STRING_, soy.esc.$$REPLACER_FOR_ESCAPE_JS_STRING__AND__ESCAPE_JS_REGEX_);
};
soy.esc.$$escapeJsRegexHelper = function(a) {
  return String(a).replace(soy.esc.$$MATCHER_FOR_ESCAPE_JS_REGEX_, soy.esc.$$REPLACER_FOR_ESCAPE_JS_STRING__AND__ESCAPE_JS_REGEX_);
};
soy.esc.$$escapeCssStringHelper = function(a) {
  return String(a).replace(soy.esc.$$MATCHER_FOR_ESCAPE_CSS_STRING_, soy.esc.$$REPLACER_FOR_ESCAPE_CSS_STRING_);
};
soy.esc.$$filterCssValueHelper = function(a) {
  a = String(a);
  return soy.esc.$$FILTER_FOR_FILTER_CSS_VALUE_.test(a) ? a : (goog.asserts.fail("Bad value `%s` for |filterCssValue", [a]), "zSoyz");
};
soy.esc.$$normalizeUriHelper = function(a) {
  return String(a).replace(soy.esc.$$MATCHER_FOR_NORMALIZE_URI__AND__FILTER_NORMALIZE_URI__AND__FILTER_NORMALIZE_MEDIA_URI_, soy.esc.$$REPLACER_FOR_NORMALIZE_URI__AND__FILTER_NORMALIZE_URI__AND__FILTER_NORMALIZE_MEDIA_URI_);
};
soy.esc.$$filterNormalizeUriHelper = function(a) {
  a = String(a);
  return soy.esc.$$FILTER_FOR_FILTER_NORMALIZE_URI_.test(a) ? a.replace(soy.esc.$$MATCHER_FOR_NORMALIZE_URI__AND__FILTER_NORMALIZE_URI__AND__FILTER_NORMALIZE_MEDIA_URI_, soy.esc.$$REPLACER_FOR_NORMALIZE_URI__AND__FILTER_NORMALIZE_URI__AND__FILTER_NORMALIZE_MEDIA_URI_) : (goog.asserts.fail("Bad value `%s` for |filterNormalizeUri", [a]), "about:invalid#zSoyz");
};
soy.esc.$$filterNormalizeMediaUriHelper = function(a) {
  a = String(a);
  return soy.esc.$$FILTER_FOR_FILTER_NORMALIZE_MEDIA_URI_.test(a) ? a.replace(soy.esc.$$MATCHER_FOR_NORMALIZE_URI__AND__FILTER_NORMALIZE_URI__AND__FILTER_NORMALIZE_MEDIA_URI_, soy.esc.$$REPLACER_FOR_NORMALIZE_URI__AND__FILTER_NORMALIZE_URI__AND__FILTER_NORMALIZE_MEDIA_URI_) : (goog.asserts.fail("Bad value `%s` for |filterNormalizeMediaUri", [a]), "about:invalid#zSoyz");
};
soy.esc.$$filterImageDataUriHelper = function(a) {
  a = String(a);
  return soy.esc.$$FILTER_FOR_FILTER_IMAGE_DATA_URI_.test(a) ? a : (goog.asserts.fail("Bad value `%s` for |filterImageDataUri", [a]), "data:image/gif;base64,zSoyz");
};
soy.esc.$$filterSipUriHelper = function(a) {
  a = String(a);
  return soy.esc.$$FILTER_FOR_FILTER_SIP_URI_.test(a) ? a : (goog.asserts.fail("Bad value `%s` for |filterSipUri", [a]), "about:invalid#zSoyz");
};
soy.esc.$$filterTelUriHelper = function(a) {
  a = String(a);
  return soy.esc.$$FILTER_FOR_FILTER_TEL_URI_.test(a) ? a : (goog.asserts.fail("Bad value `%s` for |filterTelUri", [a]), "about:invalid#zSoyz");
};
soy.esc.$$filterHtmlAttributesHelper = function(a) {
  a = String(a);
  return soy.esc.$$FILTER_FOR_FILTER_HTML_ATTRIBUTES_.test(a) ? a : (goog.asserts.fail("Bad value `%s` for |filterHtmlAttributes", [a]), "zSoyz");
};
soy.esc.$$filterHtmlElementNameHelper = function(a) {
  a = String(a);
  return soy.esc.$$FILTER_FOR_FILTER_HTML_ELEMENT_NAME_.test(a) ? a : (goog.asserts.fail("Bad value `%s` for |filterHtmlElementName", [a]), "zSoyz");
};
soy.esc.$$HTML_TAG_REGEX_ = /<(?:!|\/?([a-zA-Z][a-zA-Z0-9:\-]*))(?:[^>'"]|"[^"]*"|'[^']*')*>/g;
soy.esc.$$LT_REGEX_ = /</g;
soy.esc.$$SAFE_TAG_WHITELIST_ = {b:!0, br:!0, em:!0, i:!0, s:!0, strong:!0, sub:!0, sup:!0, u:!0};
soy.esc.$$HTML_ATTRIBUTE_REGEX_ = /([a-zA-Z][a-zA-Z0-9:\-]*)[\t\n\r\u0020]*=[\t\n\r\u0020]*("[^"]*"|'[^']*')/g;
annotorious.templates = {};
annotorious.templates.popup = function(a, b) {
  return '<div class="annotorious-popup top-left" style="position:absolute;z-index:1"><div class="annotorious-popup-buttons"><a class="annotorious-popup-button annotorious-popup-button-edit" title="Edit" href="javascript:void(0);">EDIT</a><a class="annotorious-popup-button annotorious-popup-button-delete" title="Delete" href="javascript:void(0);">DELETE</a></div><span class="annotorious-popup-text"></span></div>';
};
goog.DEBUG && (annotorious.templates.popup.soyTemplateName = "annotorious.templates.popup");
annotorious.templates.editform = function(a, b) {
  return '<div class="annotorious-editor" style="position:absolute;z-index:1"><form><textarea class="annotorious-editor-text" placeholder="Add a Comment..." tabindex="1"></textarea><div class="annotorious-editor-button-container"><a class="annotorious-editor-button annotorious-editor-button-cancel" href="javascript:void(0);" tabindex="3">Cancel</a><a class="annotorious-editor-button annotorious-editor-button-save" href="javascript:void(0);" tabindex="2">Save</a></div></form></div>';
};
goog.DEBUG && (annotorious.templates.editform.soyTemplateName = "annotorious.templates.editform");
annotorious.Editor = function(a) {
  this.element = goog.soy.renderAsElement(annotorious.templates.editform);
  this._annotator = a;
  this._item = a.getItem();
  this._textarea = new goog.ui.Textarea("");
  this._btnCancel = this.element.querySelector(".annotorious-editor-button-cancel");
  this._btnSave = this.element.querySelector(".annotorious-editor-button-save");
  this._btnContainer = goog.dom.getParentElement(this._btnSave);
  this._extraFields = [];
  this.htmlSanitizer = (new goog.html.sanitizer.HtmlSanitizer.Builder).withCustomNetworkRequestUrlPolicy(goog.html.SafeUrl.sanitize).build();
  var b = this;
  goog.events.listen(this._btnCancel, goog.events.EventType.CLICK, function(c) {
    c.preventDefault();
    a.stopSelection(b._original_annotation);
    b.close();
  });
  goog.events.listen(this._btnSave, goog.events.EventType.CLICK, function(c) {
    c.preventDefault();
    c = b.getAnnotation();
    a.addAnnotation(c);
    a.stopSelection();
    b._original_annotation ? a.fireEvent(annotorious.events.EventType.ANNOTATION_UPDATED, c, a.getItem()) : a.fireEvent(annotorious.events.EventType.ANNOTATION_CREATED, c, a.getItem());
    b.close();
  });
  goog.style.showElement(this.element, !1);
  goog.dom.appendChild(a.element, this.element);
  this._textarea.decorate(this.element.querySelector(".annotorious-editor-text"));
  annotorious.dom.makeHResizable(this.element, function() {
    b._textarea.resize();
  });
};
annotorious.Editor.prototype.addField = function(a) {
  var b = goog.dom.createDom("div", "annotorious-editor-field");
  goog.isString(a) ? b.innerHTML = a : goog.isFunction(a) ? this._extraFields.push({el:b, fn:a}) : goog.dom.isElement(a) && goog.dom.appendChild(b, a);
  goog.dom.insertSiblingBefore(b, this._btnContainer);
};
annotorious.Editor.prototype.open = function(a, b) {
  this._annotator.fireEvent(annotorious.events.EventType.BEFORE_EDITOR_SHOWN, a);
  (this._current_annotation = this._original_annotation = a) && this._textarea.setValue(a.text);
  goog.style.showElement(this.element, !0);
  this._textarea.getElement().focus();
  goog.array.forEach(this._extraFields, function(b) {
    var c = b.fn(a);
    goog.isString(c) ? b.el.innerHTML = c : goog.dom.isElement(c) && (goog.dom.removeChildren(b.el), goog.dom.appendChild(b.el, c));
  });
  this._annotator.fireEvent(annotorious.events.EventType.EDITOR_SHOWN, a);
};
annotorious.Editor.prototype.close = function() {
  goog.style.showElement(this.element, !1);
  this._textarea.setValue("");
};
annotorious.Editor.prototype.setPosition = function(a) {
  goog.style.setPosition(this.element, a.x, a.y);
};
annotorious.Editor.prototype.getAnnotation = function() {
  var a = this.htmlSanitizer.sanitize(this._textarea.getValue()).getTypedStringValue();
  this._current_annotation ? this._current_annotation.text = a : this._current_annotation = new annotorious.Annotation(this._item.src, a, this._annotator.getActiveSelector().getShape());
  return this._current_annotation;
};
annotorious.Editor.prototype.addField = annotorious.Editor.prototype.addField;
annotorious.Editor.prototype.getAnnotation = annotorious.Editor.prototype.getAnnotation;
annotorious.Hint = function(a, b, c) {
  var d = this;
  c || (c = "Click and Drag to Annotate");
  this.element = goog.soy.renderAsElement(annotorious.templates.image.hint, {msg:c});
  this._annotator = a;
  this._message = this.element.querySelector(".annotorious-hint-msg");
  this._icon = this.element.querySelector(".annotorious-hint-icon");
  this._overItemHandler = function() {
    d.show();
  };
  this._outOfItemHandler = function() {
    d.hide();
  };
  this._attachListeners();
  this.hide();
  goog.dom.appendChild(b, this.element);
};
annotorious.Hint.prototype._attachListeners = function() {
  var a = this;
  this._mouseOverListener = goog.events.listen(this._icon, goog.events.EventType.MOUSEOVER, function(b) {
    a.show();
    window.clearTimeout(a._hideTimer);
  });
  this._mouseOutListener = goog.events.listen(this._icon, goog.events.EventType.MOUSEOUT, function(b) {
    a.hide();
  });
  this._annotator.addHandler(annotorious.events.EventType.MOUSE_OVER_ANNOTATABLE_ITEM, this._overItemHandler);
  this._annotator.addHandler(annotorious.events.EventType.MOUSE_OUT_OF_ANNOTATABLE_ITEM, this._outOfItemHandler);
};
annotorious.Hint.prototype._detachListeners = function() {
  goog.events.unlistenByKey(this._mouseOverListener);
  goog.events.unlistenByKey(this._mouseOutListener);
  this._annotator.removeHandler(annotorious.events.EventType.MOUSE_OVER_ANNOTATABLE_ITEM, this._overItemHandler);
  this._annotator.removeHandler(annotorious.events.EventType.MOUSE_OUT_OF_ANNOTATABLE_ITEM, this._outOfItemHandler);
};
annotorious.Hint.prototype.show = function() {
  window.clearTimeout(this._hideTimer);
  goog.style.setOpacity(this._message, 0.8);
  var a = this;
  this._hideTimer = window.setTimeout(function() {
    a.hide();
  }, 3000);
};
annotorious.Hint.prototype.hide = function() {
  window.clearTimeout(this._hideTimer);
  goog.style.setOpacity(this._message, 0);
};
annotorious.Hint.prototype.destroy = function() {
  this._detachListeners();
  delete this._mouseOverListener;
  delete this._mouseOutListener;
  delete this._overItemHandler;
  delete this._outOfItemHandler;
  goog.dom.removeNode(this.element);
};
annotorious.Popup = function(a) {
  this.element = goog.soy.renderAsElement(annotorious.templates.popup);
  this._annotator = a;
  this._text = this.element.querySelector(".annotorious-popup-text");
  this._buttons = this.element.querySelector(".annotorious-popup-buttons");
  this._cancelHide = !1;
  this._extraFields = [];
  var b = this.element.querySelector(".annotorious-popup-button-edit"), c = this.element.querySelector(".annotorious-popup-button-delete"), d = this;
  goog.events.listen(b, goog.events.EventType.MOUSEOVER, function(a) {
    goog.dom.classes.add(b, "annotorious-popup-button-active");
  });
  goog.events.listen(b, goog.events.EventType.MOUSEOUT, function() {
    goog.dom.classes.remove(b, "annotorious-popup-button-active");
  });
  goog.events.listen(b, goog.events.EventType.CLICK, function(b) {
    goog.style.setOpacity(d.element, 0);
    goog.style.setStyle(d.element, "pointer-events", "none");
    a.editAnnotation(d._currentAnnotation);
  });
  goog.events.listen(c, goog.events.EventType.MOUSEOVER, function(a) {
    goog.dom.classes.add(c, "annotorious-popup-button-active");
  });
  goog.events.listen(c, goog.events.EventType.MOUSEOUT, function() {
    goog.dom.classes.remove(c, "annotorious-popup-button-active");
  });
  goog.events.listen(c, goog.events.EventType.CLICK, function(b) {
    a.fireEvent(annotorious.events.EventType.BEFORE_ANNOTATION_REMOVED, d._currentAnnotation) || (goog.style.setOpacity(d.element, 0), goog.style.setStyle(d.element, "pointer-events", "none"), a.removeAnnotation(d._currentAnnotation), a.fireEvent(annotorious.events.EventType.ANNOTATION_REMOVED, d._currentAnnotation));
  });
  annotorious.events.ui.hasMouse && (goog.events.listen(this.element, goog.events.EventType.MOUSEOVER, function(a) {
    window.clearTimeout(d._buttonHideTimer);
    0.9 > goog.style.getStyle(d._buttons, "opacity") && goog.style.setOpacity(d._buttons, 0.9);
    d.clearHideTimer();
  }), goog.events.listen(this.element, goog.events.EventType.MOUSEOUT, function(a) {
    goog.style.setOpacity(d._buttons, 0);
    d.startHideTimer();
  }), a.addHandler(annotorious.events.EventType.MOUSE_OUT_OF_ANNOTATABLE_ITEM, function(a) {
    d.startHideTimer();
  }));
  goog.style.setOpacity(this._buttons, 0);
  goog.style.setOpacity(this.element, 0);
  goog.style.setStyle(this.element, "pointer-events", "none");
  goog.dom.appendChild(a.element, this.element);
};
annotorious.Popup.prototype.addField = function(a) {
  var b = goog.dom.createDom("div", "annotorious-popup-field");
  goog.isString(a) ? b.innerHTML = a : goog.isFunction(a) ? this._extraFields.push({el:b, fn:a}) : goog.dom.isElement(a) && goog.dom.appendChild(b, a);
  goog.dom.appendChild(this.element, b);
};
annotorious.Popup.prototype.startHideTimer = function() {
  this._cancelHide = !1;
  if (!this._popupHideTimer) {
    var a = this;
    this._popupHideTimer = window.setTimeout(function() {
      a._annotator.fireEvent(annotorious.events.EventType.BEFORE_POPUP_HIDE, a);
      a._cancelHide || (goog.style.setOpacity(a.element, 0.0), goog.style.setStyle(a.element, "pointer-events", "none"), goog.style.setOpacity(a._buttons, 0.9), delete a._popupHideTimer);
    }, 150);
  }
};
annotorious.Popup.prototype.clearHideTimer = function() {
  this._cancelHide = !0;
  this._popupHideTimer && (window.clearTimeout(this._popupHideTimer), delete this._popupHideTimer);
};
annotorious.Popup.prototype.show = function(a, b) {
  this.clearHideTimer();
  b && this.setPosition(b);
  a && this.setAnnotation(a);
  this._buttonHideTimer && window.clearTimeout(this._buttonHideTimer);
  goog.style.setOpacity(this._buttons, 0.9);
  if (annotorious.events.ui.hasMouse) {
    var c = this;
    this._buttonHideTimer = window.setTimeout(function() {
      goog.style.setOpacity(c._buttons, 0);
    }, 1000);
  }
  goog.style.setOpacity(this.element, 0.9);
  goog.style.setStyle(this.element, "pointer-events", "auto");
  this._annotator.fireEvent(annotorious.events.EventType.POPUP_SHOWN, this._currentAnnotation);
};
annotorious.Popup.prototype.setPosition = function(a) {
  goog.style.setPosition(this.element, new goog.math.Coordinate(a.x, a.y));
};
annotorious.Popup.prototype.setAnnotation = function(a) {
  this._currentAnnotation = a;
  this._text.innerHTML = a.text ? a.text.replace(/\n/g, "<br/>") : '<span class="annotorious-popup-empty">No comment</span>';
  "editable" in a && 0 == a.editable ? goog.style.showElement(this._buttons, !1) : goog.style.showElement(this._buttons, !0);
  goog.array.forEach(this._extraFields, function(b) {
    var c = b.fn(a);
    goog.isString(c) ? b.el.innerHTML = c : goog.dom.isElement(c) && (goog.dom.removeChildren(b.el), goog.dom.appendChild(b.el, c));
  });
};
annotorious.Popup.prototype.addField = annotorious.Popup.prototype.addField;
annotorious.mediatypes.Annotator = function() {
};
annotorious.mediatypes.Annotator.prototype.addAnnotation = function(a, b) {
  this._viewer.addAnnotation(a, b);
};
annotorious.mediatypes.Annotator.prototype.addHandler = function(a, b) {
  this._eventBroker.addHandler(a, b);
};
annotorious.mediatypes.Annotator.prototype.removeHandler = function(a) {
  this._eventBroker.removeHandler(a);
};
annotorious.mediatypes.Annotator.prototype.fireEvent = function(a, b, c) {
  return this._eventBroker.fireEvent(a, b, c);
};
annotorious.mediatypes.Annotator.prototype.getActiveSelector = function() {
  return this._currentSelector;
};
annotorious.mediatypes.Annotator.prototype.highlightAnnotation = function(a) {
  this._viewer.highlightAnnotation(a);
};
annotorious.mediatypes.Annotator.prototype.removeAnnotation = function(a) {
  this._viewer.removeAnnotation(a);
};
annotorious.mediatypes.Annotator.prototype.removeHandler = function(a, b) {
  this._eventBroker.removeHandler(a, b);
};
annotorious.mediatypes.Annotator.prototype.stopSelection = function(a) {
  annotorious.events.ui.hasMouse && goog.style.showElement(this._editCanvas, !1);
  this._stop_selection_callback && (this._stop_selection_callback(), delete this._stop_selection_callback);
  this._currentSelector.stopSelection();
  a && this._viewer.addAnnotation(a);
};
annotorious.mediatypes.Annotator.prototype._attachListener = function(a) {
  var b = this;
  goog.events.listen(a, annotorious.events.ui.EventType.DOWN, function(c) {
    console.log("start selection event");
    console.log(c);
    c = annotorious.events.ui.sanitizeCoordinates(c, a);
    b._viewer.highlightAnnotation(!1);
    b._selectionEnabled ? (goog.style.showElement(b._editCanvas, !0), b._currentSelector.startSelection(c.x, c.y)) : (c = b._viewer.getAnnotationsAt(c.x, c.y), 0 < c.length && b._viewer.highlightAnnotation(c[0]));
  });
};
annotorious.mediatypes.image = {};
annotorious.mediatypes.image.Viewer = function(a, b) {
  this._canvas = a;
  this._annotator = b;
  this._annotations = [];
  this._shapes = [];
  this._g2d = this._canvas.getContext("2d");
  this._eventsEnabled = !0;
  this._keepHighlighted = !1;
  var c = this;
  goog.events.listen(this._canvas, annotorious.events.ui.EventType.MOVE, function(a) {
    c._eventsEnabled ? c._onMouseMove(a) : c._cachedMouseEvent = a;
  });
  goog.events.listen(this._canvas, annotorious.events.ui.EventType.DOWN, function(a) {
    void 0 !== c._currentAnnotation && 0 != c._currentAnnotation && c._annotator.fireEvent(annotorious.events.EventType.ANNOTATION_CLICKED, c._currentAnnotation);
  });
  b.addHandler(annotorious.events.EventType.MOUSE_OUT_OF_ANNOTATABLE_ITEM, function(a) {
    delete c._currentAnnotation;
    c._eventsEnabled = !0;
  });
  b.addHandler(annotorious.events.EventType.BEFORE_POPUP_HIDE, function() {
    if (!c._eventsEnabled && c._cachedMouseEvent) {
      var a = c._currentAnnotation;
      c._currentAnnotation = c.topAnnotationAt(c._cachedMouseEvent.offsetX, c._cachedMouseEvent.offsetY);
      c._eventsEnabled = !0;
      a != c._currentAnnotation ? (c.redraw(), c._annotator.fireEvent(annotorious.events.EventType.MOUSE_OUT_OF_ANNOTATION, {annotation:a, mouseEvent:c._cachedMouseEvent}), c._annotator.fireEvent(annotorious.events.EventType.MOUSE_OVER_ANNOTATION, {annotation:c._currentAnnotation, mouseEvent:c._cachedMouseEvent})) : c._currentAnnotation && c._annotator.popup.clearHideTimer();
    } else {
      c.redraw();
    }
  });
};
annotorious.mediatypes.image.Viewer.prototype.addAnnotation = function(a, b) {
  b && (b == this._currentAnnotation && delete this._currentAnnotation, goog.array.remove(this._annotations, b), delete this._shapes[annotorious.shape.hashCode(b.shapes[0])]);
  this._annotations.push(a);
  b = a.shapes[0];
  if (b.units == annotorious.shape.Units.PIXEL) {
    this._shapes[annotorious.shape.hashCode(a.shapes[0])] = b;
  } else {
    var c = this;
    b = annotorious.shape.transform(b, function(a) {
      return c._annotator.fromItemCoordinates(a);
    });
    this._shapes[annotorious.shape.hashCode(a.shapes[0])] = b;
  }
  this.redraw();
};
annotorious.mediatypes.image.Viewer.prototype.removeAnnotation = function(a) {
  a == this._currentAnnotation && delete this._currentAnnotation;
  goog.array.remove(this._annotations, a);
  delete this._shapes[annotorious.shape.hashCode(a.shapes[0])];
  this.redraw();
};
annotorious.mediatypes.image.Viewer.prototype.getAnnotations = function() {
  return goog.array.clone(this._annotations);
};
annotorious.mediatypes.image.Viewer.prototype.highlightAnnotation = function(a) {
  (this._currentAnnotation = a) ? this._keepHighlighted = !0 : this._annotator.popup.startHideTimer();
  this.redraw();
  this._eventsEnabled = !0;
};
annotorious.mediatypes.image.Viewer.prototype.getHighlightedAnnotation = function() {
  return this._currentAnnotation;
};
annotorious.mediatypes.image.Viewer.prototype.topAnnotationAt = function(a, b) {
  a = this.getAnnotationsAt(a, b);
  if (0 < a.length) {
    return a[0];
  }
};
annotorious.mediatypes.image.Viewer.prototype.getAnnotationsAt = function(a, b) {
  var c = [], d = this;
  goog.array.forEach(this._annotations, function(e) {
    annotorious.shape.intersects(d._shapes[annotorious.shape.hashCode(e.shapes[0])], a, b) && c.push(e);
  });
  goog.array.sort(c, function(a, b) {
    a = d._shapes[annotorious.shape.hashCode(a.shapes[0])];
    b = d._shapes[annotorious.shape.hashCode(b.shapes[0])];
    return annotorious.shape.getSize(a) - annotorious.shape.getSize(b);
  });
  return c;
};
annotorious.mediatypes.image.Viewer.prototype._onMouseMove = function(a) {
  var b = this.topAnnotationAt(a.offsetX, a.offsetY);
  b ? (this._keepHighlighted = this._keepHighlighted && b == this._currentAnnotation, this._currentAnnotation) ? this._currentAnnotation != b && (this._eventsEnabled = !1, this._annotator.popup.startHideTimer()) : (this._currentAnnotation = b, this.redraw(), this._annotator.fireEvent(annotorious.events.EventType.MOUSE_OVER_ANNOTATION, {annotation:this._currentAnnotation, mouseEvent:a})) : !this._keepHighlighted && this._currentAnnotation && (this._eventsEnabled = !1, this._annotator.popup.startHideTimer());
};
annotorious.mediatypes.image.Viewer.prototype._draw = function(a, b) {
  var c = goog.array.find(this._annotator.getAvailableSelectors(), function(b) {
    return b.getSupportedShapeType() == a.type;
  });
  c ? c.drawShape(this._g2d, a, b) : console.log("WARNING unsupported shape type: " + a.type);
};
annotorious.mediatypes.image.Viewer.prototype.redraw = function() {
  this._g2d.clearRect(0, 0, this._canvas.width, this._canvas.height);
  var a = this;
  goog.array.forEach(this._annotations, function(b) {
    b != a._currentAnnotation && a._draw(a._shapes[annotorious.shape.hashCode(b.shapes[0])]);
  });
  if (this._currentAnnotation) {
    var b = this._shapes[annotorious.shape.hashCode(this._currentAnnotation.shapes[0])];
    this._draw(b, !0);
    b = annotorious.shape.getBoundingRect(b).geometry;
    this._annotator.popup.show(this._currentAnnotation, new annotorious.shape.geom.Point(b.x, b.y + b.height + 5));
  }
};
annotorious.events.ui = {};
annotorious.events.ui.hasTouch = "ontouchstart" in window;
annotorious.events.ui.hasMouse = !annotorious.events.ui.hasTouch;
annotorious.events.ui.EventType = {DOWN:annotorious.events.ui.hasTouch ? goog.events.EventType.TOUCHSTART : goog.events.EventType.MOUSEDOWN, OVER:annotorious.events.ui.hasTouch ? "touchenter" : goog.events.EventType.MOUSEOVER, MOVE:annotorious.events.ui.hasTouch ? goog.events.EventType.TOUCHMOVE : goog.events.EventType.MOUSEMOVE, UP:annotorious.events.ui.hasTouch ? goog.events.EventType.TOUCHEND : goog.events.EventType.MOUSEUP, OUT:annotorious.events.ui.hasTouch ? "touchleave" : goog.events.EventType.MOUSEOUT, 
CLICK:annotorious.events.ui.hasTouch ? goog.events.EventType.TOUCHEND : goog.events.EventType.CLICK};
annotorious.events.ui.sanitizeCoordinates = function(a, b) {
  var c = annotorious.dom.getOffset;
  a.offsetX = a.offsetX ? a.offsetX : !1;
  a.offsetY = a.offsetY ? a.offsetY : !1;
  return a.offsetX && a.offsetY || !a.event_.changedTouches ? {x:a.offsetX, y:a.offsetY} : {x:a.event_.changedTouches[0].clientX - c(b).left, y:a.event_.changedTouches[0].clientY - c(b).top};
};
annotorious.plugins = {};
annotorious.plugins.selection = {};
annotorious.plugins.selection.RectDragSelector = function() {
};
annotorious.plugins.selection.RectDragSelector.prototype.init = function(a, b) {
  this._OUTLINE = "#000000";
  this._STROKE = "#ffffff";
  this._FILL = !1;
  this._HI_OUTLINE = "#000000";
  this._HI_STROKE = "#fff000";
  this._HI_FILL = !1;
  this._HI_OUTLINE_WIDTH = this._STROKE_WIDTH = this._OUTLINE_WIDTH = 1;
  this._HI_STROKE_WIDTH = 1.2;
  this._canvas = b;
  this._annotator = a;
  this._g2d = b.getContext("2d");
  this._g2d.lineWidth = 1;
  this._enabled = !1;
};
annotorious.plugins.selection.RectDragSelector.prototype._attachListeners = function(a) {
  var b = this, c = this._canvas;
  this._mouseMoveListener = goog.events.listen(this._canvas, annotorious.events.ui.EventType.MOVE, function(a) {
    a = annotorious.events.ui.sanitizeCoordinates(a, c);
    if (b._enabled) {
      b._opposite = {x:a.x, y:a.y};
      b._g2d.clearRect(0, 0, c.width, c.height);
      a = b._opposite.x - b._anchor.x;
      var d = b._opposite.y - b._anchor.y;
      b.drawShape(b._g2d, {type:annotorious.shape.ShapeType.RECTANGLE, geometry:{x:0 < a ? b._anchor.x : b._opposite.x, y:0 < d ? b._anchor.y : b._opposite.y, width:Math.abs(a), height:Math.abs(d)}, style:{}});
    }
  });
  this._mouseUpListener = goog.events.listen(c, annotorious.events.ui.EventType.UP, function(a) {
    var d = annotorious.events.ui.sanitizeCoordinates(a, c), f = b.getShape();
    a = a.event_ ? a.event_ : a;
    b._enabled = !1;
    f ? (b._detachListeners(), b._annotator.fireEvent(annotorious.events.EventType.SELECTION_COMPLETED, {mouseEvent:a, shape:f, viewportBounds:b.getViewportBounds()})) : (b._annotator.fireEvent(annotorious.events.EventType.SELECTION_CANCELED), a = b._annotator.getAnnotationsAt(d.x, d.y), 0 < a.length && b._annotator.highlightAnnotation(a[0]));
  });
};
annotorious.plugins.selection.RectDragSelector.prototype._detachListeners = function() {
  this._mouseMoveListener && (goog.events.unlistenByKey(this._mouseMoveListener), delete this._mouseMoveListener);
  this._mouseUpListener && (goog.events.unlistenByKey(this._mouseUpListener), delete this._mouseUpListener);
};
annotorious.plugins.selection.RectDragSelector.prototype.getName = function() {
  return "rect_drag";
};
annotorious.plugins.selection.RectDragSelector.prototype.getSupportedShapeType = function() {
  return annotorious.shape.ShapeType.RECTANGLE;
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
  a.hasOwnProperty("hi_stroke_width") && (this._HI_STROKE_WIDTH = a.hi_stroke_width);
};
annotorious.plugins.selection.RectDragSelector.prototype.startSelection = function(a, b) {
  var c = {x:a, y:b};
  this._enabled = !0;
  this._attachListeners(c);
  this._anchor = new annotorious.shape.geom.Point(a, b);
  this._annotator.fireEvent(annotorious.events.EventType.SELECTION_STARTED, {offsetX:a, offsetY:b});
  goog.style.setStyle(document.body, "-webkit-user-select", "none");
};
annotorious.plugins.selection.RectDragSelector.prototype.stopSelection = function() {
  this._detachListeners();
  this._g2d.clearRect(0, 0, this._canvas.width, this._canvas.height);
  goog.style.setStyle(document.body, "-webkit-user-select", "auto");
  delete this._opposite;
};
annotorious.plugins.selection.RectDragSelector.prototype.getShape = function() {
  if (this._opposite && 3 < Math.abs(this._opposite.x - this._anchor.x) && 3 < Math.abs(this._opposite.y - this._anchor.y)) {
    var a = this.getViewportBounds();
    a = this._annotator.toItemCoordinates({x:a.left, y:a.top, width:a.right - a.left, height:a.bottom - a.top});
    return new annotorious.shape.Shape(annotorious.shape.ShapeType.RECTANGLE, a);
  }
};
annotorious.plugins.selection.RectDragSelector.prototype.getViewportBounds = function() {
  if (this._opposite.x > this._anchor.x) {
    var a = this._opposite.x;
    var b = this._anchor.x;
  } else {
    a = this._anchor.x, b = this._opposite.x;
  }
  if (this._opposite.y > this._anchor.y) {
    var c = this._anchor.y;
    var d = this._opposite.y;
  } else {
    c = this._opposite.y, d = this._anchor.y;
  }
  return {top:c, right:a, bottom:d, left:b};
};
annotorious.plugins.selection.RectDragSelector.prototype.drawShape = function(a, b, c) {
  b.style || (b.style = {});
  if (b.type == annotorious.shape.ShapeType.RECTANGLE) {
    if (c) {
      var d = b.style.hi_fill || this._HI_FILL;
      c = b.style.hi_stroke || this._HI_STROKE;
      var e = b.style.hi_outline || this._HI_OUTLINE;
      var f = b.style.hi_outline_width || this._HI_OUTLINE_WIDTH;
      var g = b.style.hi_stroke_width || this._HI_STROKE_WIDTH;
    } else {
      d = b.style.fill || this._FILL, c = b.style.stroke || this._STROKE, e = b.style.outline || this._OUTLINE, f = b.style.outline_width || this._OUTLINE_WIDTH, g = b.style.stroke_width || this._STROKE_WIDTH;
    }
    b = b.geometry;
    e && (a.lineJoin = "round", a.lineWidth = f, a.strokeStyle = e, a.strokeRect(b.x + f / 2, b.y + f / 2, b.width - f, b.height - f));
    c && (a.lineJoin = "miter", a.lineWidth = g, a.strokeStyle = c, a.strokeRect(b.x + f + g / 2, b.y + f + g / 2, b.width - 2 * f - g, b.height - 2 * f - g));
    d && (a.lineJoin = "miter", a.lineWidth = g, a.fillStyle = d, a.fillRect(b.x + f + g / 2, b.y + f + g / 2, b.width - 2 * f - g, b.height - 2 * f - g));
  }
};
annotorious.templates.image = {};
annotorious.templates.image.canvas = function(a, b) {
  return '<canvas class="annotorious-item annotorious-opacity-fade" style="position:absolute; top:0px; left:0px; width:' + soy.$$escapeHtml(a.width) + "px; height:" + soy.$$escapeHtml(a.height) + 'px; z-index:0" width="' + soy.$$escapeHtml(a.width) + '" height="' + soy.$$escapeHtml(a.height) + '"></canvas>';
};
goog.DEBUG && (annotorious.templates.image.canvas.soyTemplateName = "annotorious.templates.image.canvas");
annotorious.templates.image.hint = function(a, b) {
  return '<div class="annotorious-hint" style="white-space:nowrap; position:absolute; top:0px; left:0px; pointer-events:none;"><div class="annotorious-hint-msg annotorious-opacity-fade">' + soy.$$escapeHtml(a.msg) + '</div><div class="annotorious-hint-icon" style="pointer-events:auto"></div></div>';
};
goog.DEBUG && (annotorious.templates.image.hint.soyTemplateName = "annotorious.templates.image.hint");
annotorious.mediatypes.image.ImageAnnotator = function(a, b) {
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
  a = goog.style.getBounds(a);
  this._viewCanvas = goog.soy.renderAsElement(annotorious.templates.image.canvas, {width:a.width, height:a.height});
  annotorious.events.ui.hasMouse && goog.dom.classes.add(this._viewCanvas, "annotorious-item-unfocus");
  goog.dom.appendChild(this.element, this._viewCanvas);
  this._editCanvas = goog.soy.renderAsElement(annotorious.templates.image.canvas, {width:a.width, height:a.height});
  annotorious.events.ui.hasMouse && goog.style.showElement(this._editCanvas, !1);
  goog.dom.appendChild(this.element, this._editCanvas);
  this.popup = b ? b : new annotorious.Popup(this);
  b = new annotorious.plugins.selection.RectDragSelector;
  b.init(this, this._editCanvas);
  this._selectors.push(b);
  this._currentSelector = b;
  this.editor = new annotorious.Editor(this);
  this._viewer = new annotorious.mediatypes.image.Viewer(this._viewCanvas, this);
  this._hint = new annotorious.Hint(this, this.element);
  var c = this;
  annotorious.events.ui.hasMouse && (goog.events.listen(this.element, annotorious.events.ui.EventType.OVER, function(a) {
    a = a.relatedTarget;
    a && goog.dom.contains(c.element, a) || (c._eventBroker.fireEvent(annotorious.events.EventType.MOUSE_OVER_ANNOTATABLE_ITEM), goog.dom.classes.addRemove(c._viewCanvas, "annotorious-item-unfocus", "annotorious-item-focus"));
  }), goog.events.listen(this.element, annotorious.events.ui.EventType.OUT, function(a) {
    a = a.relatedTarget;
    a && goog.dom.contains(c.element, a) || (c._eventBroker.fireEvent(annotorious.events.EventType.MOUSE_OUT_OF_ANNOTATABLE_ITEM), goog.dom.classes.addRemove(c._viewCanvas, "annotorious-item-focus", "annotorious-item-unfocus"));
  }));
  this._attachListener(annotorious.events.ui.hasTouch ? this._editCanvas : this._viewCanvas);
  this._eventBroker.addHandler(annotorious.events.EventType.SELECTION_COMPLETED, function(a) {
    var b = a.viewportBounds;
    c.editor.setPosition(new annotorious.shape.geom.Point(b.left + c._image.offsetLeft, b.bottom + 4 + c._image.offsetTop));
    c.editor.open(!1, a);
  });
  this._eventBroker.addHandler(annotorious.events.EventType.SELECTION_CANCELED, function() {
    annotorious.events.ui.hasMouse && goog.style.showElement(c._editCanvas, !1);
    c._currentSelector.stopSelection();
  });
};
goog.inherits(annotorious.mediatypes.image.ImageAnnotator, annotorious.mediatypes.Annotator);
annotorious.mediatypes.image.ImageAnnotator.prototype._transferStyles = function(a, b) {
  var c = function(c, d) {
    goog.style.setStyle(b, "margin-" + c, d + "px");
    goog.style.setStyle(a, "margin-" + c, 0);
    goog.style.setStyle(a, "padding-" + c, 0);
  }, d = goog.style.getMarginBox(a), e = goog.style.getPaddingBox(a);
  0 == d.top && 0 == e.top || c("top", d.top + e.top);
  0 == d.right && 0 == e.right || c("right", d.right + e.right);
  0 == d.bottom && 0 == e.bottom || c("bottom", d.bottom + e.bottom);
  0 == d.left && 0 == e.left || c("left", d.left + e.left);
};
annotorious.mediatypes.image.ImageAnnotator.prototype.activateSelector = function(a) {
};
annotorious.mediatypes.image.ImageAnnotator.prototype.addSelector = function(a) {
  a.init(this, this._editCanvas);
  this._selectors.push(a);
};
annotorious.mediatypes.image.ImageAnnotator.prototype.destroy = function() {
  var a = this._image;
  a.style.margin = this._original_bufferspace.margin;
  a.style.padding = this._original_bufferspace.padding;
  goog.dom.replaceNode(a, this.element);
};
annotorious.mediatypes.image.ImageAnnotator.prototype.editAnnotation = function(a) {
  this._viewer.removeAnnotation(a);
  var b = goog.array.find(this._selectors, function(b) {
    return b.getSupportedShapeType() == a.shapes[0].type;
  });
  if (b) {
    goog.style.showElement(this._editCanvas, !0);
    this._viewer.highlightAnnotation(!1);
    var c = this._editCanvas.getContext("2d"), d = a.shapes[0], e = this;
    d = "pixel" == d.units ? d : annotorious.shape.transform(d, function(a) {
      return e.fromItemCoordinates(a);
    });
    b.drawShape(c, d);
  }
  b = annotorious.shape.getBoundingRect(a.shapes[0]).geometry;
  b = "pixel" == a.shapes[0].units ? new annotorious.shape.geom.Point(b.x, b.y + b.height) : this.fromItemCoordinates(new annotorious.shape.geom.Point(b.x, b.y + b.height));
  this.editor.setPosition(new annotorious.shape.geom.Point(b.x + this._image.offsetLeft, b.y + 4 + this._image.offsetTop));
  this.editor.open(a);
};
annotorious.mediatypes.image.ImageAnnotator.prototype.fromItemCoordinates = function(a) {
  var b = goog.style.getSize(this._image);
  return a.width ? {x:a.x * b.width, y:a.y * b.height, width:a.width * b.width, height:a.height * b.height} : {x:a.x * b.width, y:a.y * b.height};
};
annotorious.mediatypes.image.ImageAnnotator.prototype.getActiveSelector = function() {
  return this._currentSelector;
};
annotorious.mediatypes.image.ImageAnnotator.prototype.getAnnotations = function() {
  return this._viewer.getAnnotations();
};
annotorious.mediatypes.image.ImageAnnotator.prototype.getAnnotationsAt = function(a, b) {
  return goog.array.clone(this._viewer.getAnnotationsAt(a, b));
};
annotorious.mediatypes.image.ImageAnnotator.prototype.getAvailableSelectors = function() {
  return this._selectors;
};
annotorious.mediatypes.image.ImageAnnotator.prototype.getItem = function() {
  return {src:annotorious.mediatypes.image.ImageAnnotator.getItemURL(this._image), element:this._image};
};
annotorious.mediatypes.image.ImageAnnotator.getItemURL = function(a) {
  var b = a.getAttribute("data-original");
  return b ? b : a.src;
};
annotorious.mediatypes.image.ImageAnnotator.prototype.hideAnnotations = function() {
  goog.style.showElement(this._viewCanvas, !1);
};
annotorious.mediatypes.image.ImageAnnotator.prototype.hideSelectionWidget = function() {
  this._selectionEnabled = !1;
  this._hint && (this._hint.destroy(), delete this._hint);
};
annotorious.mediatypes.image.ImageAnnotator.prototype.setCurrentSelector = function(a) {
  (this._currentSelector = goog.array.find(this._selectors, function(b) {
    return b.getName() == a;
  })) || console.log('WARNING: selector "' + a + '" not available');
};
annotorious.mediatypes.image.ImageAnnotator.prototype.setProperties = function(a) {
  goog.array.forEach(this._selectors, function(b) {
    b.setProperties(a);
  });
  this._viewer.redraw();
};
annotorious.mediatypes.image.ImageAnnotator.prototype.showAnnotations = function() {
  goog.style.showElement(this._viewCanvas, !0);
};
annotorious.mediatypes.image.ImageAnnotator.prototype.showSelectionWidget = function() {
  this._selectionEnabled = !0;
  this._hint || (this._hint = new annotorious.Hint(this, this.element));
};
annotorious.mediatypes.image.ImageAnnotator.prototype.stopSelection = function(a) {
  annotorious.events.ui.hasMouse && goog.style.showElement(this._editCanvas, !1);
  this._currentSelector.stopSelection();
  a && this._viewer.addAnnotation(a);
};
annotorious.mediatypes.image.ImageAnnotator.prototype.toItemCoordinates = function(a) {
  var b = goog.style.getSize(this._image);
  return a.width ? {x:a.x / b.width, y:a.y / b.height, width:a.width / b.width, height:a.height / b.height} : {x:a.x / b.width, y:a.y / b.height};
};
annotorious.mediatypes.image.ImageAnnotator.prototype.addSelector = annotorious.mediatypes.image.ImageAnnotator.prototype.addSelector;
annotorious.mediatypes.image.ImageAnnotator.prototype.fireEvent = annotorious.mediatypes.image.ImageAnnotator.prototype.fireEvent;
annotorious.mediatypes.image.ImageAnnotator.prototype.setCurrentSelector = annotorious.mediatypes.image.ImageAnnotator.prototype.setCurrentSelector;
annotorious.mediatypes.image.ImageAnnotator.prototype.toItemCoordinates = annotorious.mediatypes.image.ImageAnnotator.prototype.toItemCoordinates;
annotorious.mediatypes.image.ImageModule = function() {
  annotorious.mediatypes.Module.call();
  this._initFields(function() {
    return document.querySelectorAll("img.annotatable");
  });
};
goog.inherits(annotorious.mediatypes.image.ImageModule, annotorious.mediatypes.Module);
annotorious.mediatypes.image.ImageModule.prototype.getItemURL = function(a) {
  return annotorious.mediatypes.image.ImageAnnotator.getItemURL(a);
};
annotorious.mediatypes.image.ImageModule.prototype.newAnnotator = function(a) {
  return new annotorious.mediatypes.image.ImageAnnotator(a);
};
annotorious.mediatypes.image.ImageModule.prototype.supports = function(a) {
  return goog.dom.isElement(a) ? "IMG" == a.tagName : !1;
};
annotorious.templates.openlayers = {};
annotorious.templates.openlayers.secondaryHint = function(a, b) {
  return '<div class="annotorious-opacity-fade" style="white-space:nowrap; position:absolute; pointer-events:none; top:80px; width:100%; text-align:center;"><div class="annotorious-ol-hint" style="width: 400px; margin:0px auto;">' + soy.$$escapeHtml(a.msg) + "</div></div>";
};
goog.DEBUG && (annotorious.templates.openlayers.secondaryHint.soyTemplateName = "annotorious.templates.openlayers.secondaryHint");
goog.events.MouseWheelHandler = function(a, b) {
  goog.events.EventTarget.call(this);
  this.element_ = a;
  a = goog.dom.isElement(this.element_) ? this.element_ : this.element_ ? this.element_.body : null;
  this.isRtl_ = !!a && goog.style.isRightToLeft(a);
  this.listenKey_ = goog.events.listen(this.element_, goog.userAgent.GECKO ? "DOMMouseScroll" : "mousewheel", this, b);
};
goog.inherits(goog.events.MouseWheelHandler, goog.events.EventTarget);
goog.events.MouseWheelHandler.EventType = {MOUSEWHEEL:"mousewheel"};
goog.events.MouseWheelHandler.prototype.setMaxDeltaX = function(a) {
  this.maxDeltaX_ = a;
};
goog.events.MouseWheelHandler.prototype.setMaxDeltaY = function(a) {
  this.maxDeltaY_ = a;
};
goog.events.MouseWheelHandler.prototype.handleEvent = function(a) {
  var b = 0, c = 0, d = a.getBrowserEvent();
  "mousewheel" == d.type ? (a = goog.events.MouseWheelHandler.smartScale_(-d.wheelDelta, 40), goog.isDef(d.wheelDeltaX) ? (b = goog.events.MouseWheelHandler.smartScale_(-d.wheelDeltaX, 40), c = goog.events.MouseWheelHandler.smartScale_(-d.wheelDeltaY, 40)) : c = a) : (a = d.detail, 100 < a ? a = 3 : -100 > a && (a = -3), goog.isDef(d.axis) && d.axis === d.HORIZONTAL_AXIS ? b = a : c = a);
  goog.isNumber(this.maxDeltaX_) && (b = goog.math.clamp(b, -this.maxDeltaX_, this.maxDeltaX_));
  goog.isNumber(this.maxDeltaY_) && (c = goog.math.clamp(c, -this.maxDeltaY_, this.maxDeltaY_));
  this.isRtl_ && (b = -b);
  b = new goog.events.MouseWheelEvent(a, d, b, c);
  this.dispatchEvent(b);
};
goog.events.MouseWheelHandler.smartScale_ = function(a, b) {
  return goog.userAgent.WEBKIT && (goog.userAgent.MAC || goog.userAgent.LINUX) && 0 != a % b ? a : a / b;
};
goog.events.MouseWheelHandler.prototype.disposeInternal = function() {
  goog.events.MouseWheelHandler.superClass_.disposeInternal.call(this);
  goog.events.unlistenByKey(this.listenKey_);
  this.listenKey_ = null;
};
goog.events.MouseWheelEvent = function(a, b, c, d) {
  goog.events.BrowserEvent.call(this, b);
  this.type = goog.events.MouseWheelHandler.EventType.MOUSEWHEEL;
  this.detail = a;
  this.deltaX = c;
  this.deltaY = d;
};
goog.inherits(goog.events.MouseWheelEvent, goog.events.BrowserEvent);
annotorious.mediatypes.openlayers = {};
annotorious.mediatypes.openlayers.Viewer = function(a, b) {
  this._map = a;
  this._annotator = b;
  this._map_bounds = goog.style.getBounds(b.element);
  this._popup = b.popup;
  goog.style.setStyle(this._popup.element, "z-index", 99000);
  this._overlays = [];
  this._shapes = [];
  this._boxesLayer = new OpenLayers.Layer.Boxes("Annotorious");
  this._map.addLayer(this._boxesLayer);
  var c = this;
  this._map.events.register("move", this._map, function() {
    c._currentlyHighlightedOverlay && c._place_popup();
  });
  b.addHandler(annotorious.events.EventType.BEFORE_POPUP_HIDE, function() {
    c._lastHoveredOverlay == c._currentlyHighlightedOverlay ? c._popup.clearHideTimer() : c._updateHighlight(c._lastHoveredOverlay, c._currentlyHighlightedOverlay);
  });
};
annotorious.mediatypes.openlayers.Viewer.prototype.destroy = function() {
  this._boxesLayer.destroy();
};
annotorious.mediatypes.openlayers.Viewer.prototype._place_popup = function() {
  var a = this._currentlyHighlightedOverlay.marker.div, b = goog.style.getBounds(a), c = goog.style.getRelativePosition(a, this._map.div);
  a = c.y;
  c = c.x;
  var d = b.width, e = b.height;
  b = goog.style.getBounds(this._popup.element);
  a = {y:a + e + 5};
  c + b.width > this._map_bounds.width ? (goog.dom.classes.addRemove(this._popup.element, "top-left", "top-right"), a.x = c + d - b.width) : (goog.dom.classes.addRemove(this._popup.element, "top-right", "top-left"), a.x = c);
  0 > a.x && (a.x = 0);
  a.x + b.width > this._map_bounds.width && (a.x = this._map_bounds.width - b.width);
  a.y + b.height > this._map_bounds.height && (a.y = this._map_bounds.height - b.height);
  this._popup.setPosition(a);
};
annotorious.mediatypes.openlayers.Viewer.prototype._show_popup = function(a) {
  this._popup.setAnnotation(a);
  this._place_popup();
  this._popup.show();
};
annotorious.mediatypes.openlayers.Viewer.prototype._updateHighlight = function(a, b) {
  a ? (goog.style.getRelativePosition(a.marker.div, this._map.div), parseInt(goog.style.getStyle(a.marker.div, "height"), 10), goog.style.setStyle(a.inner, "border-color", "#fff000"), this._currentlyHighlightedOverlay = a, this._show_popup(a.annotation)) : delete this._currentlyHighlightedOverlay;
  b && goog.style.setStyle(b.inner, "border-color", "#fff");
};
annotorious.mediatypes.openlayers.Viewer.prototype.addAnnotation = function(a) {
  var b = a.shapes[0].geometry;
  b = new OpenLayers.Marker.Box(new OpenLayers.Bounds(b.x, b.y, b.x + b.width, b.y + b.height));
  goog.dom.classes.add(b.div, "annotorious-ol-boxmarker-outer");
  goog.style.setStyle(b.div, "border", null);
  var c = goog.dom.createDom("div", "annotorious-ol-boxmarker-inner");
  goog.style.setSize(c, "100%", "100%");
  goog.dom.appendChild(b.div, c);
  var d = {annotation:a, marker:b, inner:c}, e = this;
  goog.events.listen(c, goog.events.EventType.MOUSEOVER, function(a) {
    e._currentlyHighlightedOverlay || e._updateHighlight(d);
    e._lastHoveredOverlay = d;
  });
  goog.events.listen(c, goog.events.EventType.MOUSEOUT, function(a) {
    delete e._lastHoveredOverlay;
    e._popup.startHideTimer();
  });
  this._overlays.push(d);
  c = a.shapes[0];
  c.units == annotorious.shape.Units.PIXEL ? this._shapes[annotorious.shape.hashCode(a.shapes[0])] = c : (c = annotorious.shape.transform(c, function(a) {
    return e._annotator.fromItemCoordinates(a);
  }), this._shapes[annotorious.shape.hashCode(a.shapes[0])] = c);
  goog.array.sort(this._overlays, function(a, b) {
    a = a.annotation.shapes[0];
    return annotorious.shape.getSize(b.annotation.shapes[0]) - annotorious.shape.getSize(a);
  });
  var f = 10000;
  goog.array.forEach(this._overlays, function(a) {
    goog.style.setStyle(a.marker.div, "z-index", f);
    f++;
  });
  this._boxesLayer.addMarker(b);
};
annotorious.mediatypes.openlayers.Viewer.prototype.removeAnnotation = function(a) {
  var b = goog.array.find(this._overlays, function(b) {
    return b.annotation == a;
  });
  b && (goog.array.remove(this._overlays, b), this._boxesLayer.removeMarker(b.marker));
};
annotorious.mediatypes.openlayers.Viewer.prototype.getAnnotations = function() {
  return goog.array.map(this._overlays, function(a) {
    return a.annotation;
  });
};
annotorious.mediatypes.openlayers.Viewer.prototype.highlightAnnotation = function(a) {
  a || this._popup.startHideTimer();
};
annotorious.mediatypes.openlayers.Viewer.prototype.topAnnotationAt = function(a, b) {
  a = this.getAnnotationsAt(a, b);
  if (0 < a.length) {
    return a[0];
  }
};
annotorious.mediatypes.openlayers.Viewer.prototype.getAnnotationsAt = function(a, b) {
  var c = [], d = this;
  goog.array.forEach(this._overlays, function(e) {
    e = e.annotation;
    annotorious.shape.intersects(d._shapes[annotorious.shape.hashCode(e.shapes[0])], a, b) && c.push(e);
  });
  goog.array.sort(c, function(a, b) {
    a = d._shapes[annotorious.shape.hashCode(a.shapes[0])];
    b = d._shapes[annotorious.shape.hashCode(b.shapes[0])];
    return annotorious.shape.getSize(a) - annotorious.shape.getSize(b);
  });
  return c;
};
annotorious.mediatypes.openlayers.OpenLayersAnnotator = function(a) {
  annotorious.mediatypes.Annotator.call();
  this._map = a;
  this.element = a.div;
  var b = goog.style.getStyle(this.element, "position");
  "absolute" != b && "relative" != b && goog.style.setStyle(this.element, "position", "relative");
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
  var c = this;
  a = function() {
    var a = parseInt(goog.style.getComputedStyle(c.element, "width"), 10), b = parseInt(goog.style.getComputedStyle(c.element, "height"), 10);
    goog.style.setSize(c._editCanvas, a, b);
    c._editCanvas.width = a;
    c._editCanvas.height = b;
  };
  a();
  this._currentSelector = new annotorious.plugins.selection.RectDragSelector;
  this._currentSelector.init(this, this._editCanvas);
  this._stop_selection_callback = void 0;
  this.editor = new annotorious.Editor(this);
  goog.style.setStyle(this.editor.element, "z-index", 10000);
  window.addEventListener ? window.addEventListener("resize", a, !1) : window.attachEvent && window.attachEvent("onresize", a);
  goog.events.listen(this.element, goog.events.EventType.MOUSEOVER, function(a) {
    (a = a.relatedTarget) && goog.dom.contains(c.element, a) || c._eventBroker.fireEvent(annotorious.events.EventType.MOUSE_OVER_ANNOTATABLE_ITEM);
  });
  goog.events.listen(this.element, goog.events.EventType.MOUSEOUT, function(a) {
    (a = a.relatedTarget) && goog.dom.contains(c.element, a) || c._eventBroker.fireEvent(annotorious.events.EventType.MOUSE_OUT_OF_ANNOTATABLE_ITEM);
  });
  goog.events.listen(this._editCanvas, goog.events.EventType.MOUSEDOWN, function(a) {
    var b = goog.style.getClientPosition(c.element);
    c._currentSelector.startSelection(a.clientX - b.x, a.clientY - b.y);
  });
  this._eventBroker.addHandler(annotorious.events.EventType.SELECTION_COMPLETED, function(a) {
    goog.style.setStyle(c._editCanvas, "pointer-events", "none");
    a = a.viewportBounds;
    c.editor.setPosition(new annotorious.shape.geom.Point(a.left, a.bottom + 4));
    c.editor.open();
  });
  this._eventBroker.addHandler(annotorious.events.EventType.SELECTION_CANCELED, function(a) {
    c.stopSelection();
  });
};
goog.inherits(annotorious.mediatypes.openlayers.OpenLayersAnnotator, annotorious.mediatypes.Annotator);
annotorious.mediatypes.openlayers.OpenLayersAnnotator.prototype.showSelectionWidget = function() {
};
annotorious.mediatypes.openlayers.OpenLayersAnnotator.prototype.hideSelectionWidget = function() {
};
annotorious.mediatypes.openlayers.OpenLayersAnnotator.prototype.activateSelector = function(a) {
  goog.style.setStyle(this._editCanvas, "pointer-events", "auto");
  var b = this;
  goog.style.showElement(this._editCanvas, !0);
  goog.style.setOpacity(this._secondaryHint, 0.8);
  window.setTimeout(function() {
    goog.style.setOpacity(b._secondaryHint, 0);
  }, 2000);
  a && (this._stop_selection_callback = a);
};
annotorious.mediatypes.openlayers.OpenLayersAnnotator.prototype.destroy = function() {
  this._viewer.destroy();
  goog.dom.removeNode(this._secondaryHint);
  goog.dom.removeNode(this._editCanvas);
};
annotorious.mediatypes.openlayers.OpenLayersAnnotator.prototype.addSelector = function(a) {
};
annotorious.mediatypes.openlayers.OpenLayersAnnotator.prototype.editAnnotation = function(a) {
  this._viewer.removeAnnotation(a);
  var b = this._currentSelector, c = this;
  if (b) {
    goog.style.showElement(this._editCanvas, !0);
    this._viewer.highlightAnnotation(void 0);
    var d = this._editCanvas.getContext("2d"), e = annotorious.shape.transform(a.shapes[0], function(a) {
      return c.fromItemCoordinates(a);
    });
    console.log(e);
    b.drawShape(d, e);
    b = annotorious.shape.getBoundingRect(e).geometry;
    this.editor.setPosition(new annotorious.shape.geom.Point(b.x, b.y + b.height));
    this.editor.open(a);
  }
};
annotorious.mediatypes.openlayers.OpenLayersAnnotator.prototype.fromItemCoordinates = function(a) {
  var b = this._map.getViewPortPxFromLonLat(new OpenLayers.LonLat(a.x, a.y));
  return (a = a.width ? this._map.getViewPortPxFromLonLat(new OpenLayers.LonLat(a.x + a.width, a.y + a.height)) : !1) ? {x:b.x, y:a.y, width:a.x - b.x + 2, height:b.y - a.y + 2} : {x:b.x, y:b.y};
};
annotorious.mediatypes.openlayers.OpenLayersAnnotator.prototype.getAnnotations = function() {
  return this._viewer.getAnnotations();
};
annotorious.mediatypes.openlayers.OpenLayersAnnotator.prototype.getAnnotationsAt = function(a, b) {
  return goog.array.clone(this._viewer.getAnnotationsAt(a, b));
};
annotorious.mediatypes.openlayers.OpenLayersAnnotator.prototype.getAvailableSelectors = function() {
};
annotorious.mediatypes.openlayers.OpenLayersAnnotator.prototype.getItem = function() {
  return {src:"map://openlayers/something"};
};
annotorious.mediatypes.openlayers.OpenLayersAnnotator.prototype.setActiveSelector = function(a) {
};
annotorious.mediatypes.openlayers.OpenLayersAnnotator.prototype.toItemCoordinates = function(a) {
  var b = this._map.getLonLatFromPixel(new OpenLayers.Pixel(a.x, a.y));
  return (a = a.width ? new OpenLayers.Pixel(a.x + a.width - 2, a.y + a.height - 2) : !1) ? (a = this._map.getLonLatFromPixel(a), b = {x:b.lon, y:a.lat, width:a.lon - b.lon, height:b.lat - a.lat}, console.log(b), b) : {x:b.lon, y:b.lat};
};
annotorious.mediatypes.openlayers.OpenLayersModule = function() {
  annotorious.mediatypes.Module.call();
  this._initFields();
};
goog.inherits(annotorious.mediatypes.openlayers.OpenLayersModule, annotorious.mediatypes.Module);
annotorious.mediatypes.openlayers.OpenLayersModule.prototype.getItemURL = function(a) {
  return "map://openlayers/something";
};
annotorious.mediatypes.openlayers.OpenLayersModule.prototype.newAnnotator = function(a) {
  return new annotorious.mediatypes.openlayers.OpenLayersAnnotator(a);
};
annotorious.mediatypes.openlayers.OpenLayersModule.prototype.supports = function(a) {
  return a instanceof OpenLayers.Map;
};
annotorious.mediatypes.openseadragon = {};
annotorious.mediatypes.openseadragon.Viewer = function(a, b) {
  this._osdViewer = a;
  this._annotator = b;
  this._map_bounds = goog.style.getBounds(a.element);
  this._popup = b.popup;
  goog.style.setStyle(this._popup.element, "z-index", 99000);
  this._overlays = [];
  var c = this;
  this._osdViewer.addHandler("animation", function() {
    c._currentlyHighlightedOverlay && c._place_popup();
  });
  b.addHandler(annotorious.events.EventType.POPUP_SHOWN, function(a) {
    void 0 !== c._currentlyHighlightedOverlay && 0 != c._currentlyHighlightedOverlay && c._annotator.fireEvent(annotorious.events.EventType.MOUSE_OVER_ANNOTATION, c._currentlyHighlightedOverlay.annotation);
  });
  b.addHandler(annotorious.events.EventType.BEFORE_POPUP_HIDE, function() {
    c._lastHoveredOverlay == c._currentlyHighlightedOverlay ? c._popup.clearHideTimer() : (c._annotator.fireEvent(annotorious.events.EventType.MOUSE_OUT_OF_ANNOTATION, c._currentlyHighlightedOverlay.annotation), c._updateHighlight(c._lastHoveredOverlay, c._currentlyHighlightedOverlay));
  });
};
annotorious.mediatypes.openseadragon.Viewer.prototype._place_popup = function() {
  var a = this._osdViewer.element, b = this._currentlyHighlightedOverlay.outer, c = goog.style.getBounds(b);
  b = goog.style.getRelativePosition(b, a);
  a = b.y;
  b = b.x;
  var d = c.width, e = c.height;
  c = goog.style.getBounds(this._popup.element);
  a = {x:b, y:a + e + 12};
  goog.dom.classes.addRemove(this._popup.element, "top-right", "top-left");
  this._osdViewer.isFullPage() || (b + c.width > this._map_bounds.width && (goog.dom.classes.addRemove(this._popup.element, "top-left", "top-right"), a.x = b + d - c.width), 0 > a.x && (a.x = 0), a.x + c.width > this._map_bounds.width && (a.x = this._map_bounds.width - c.width), a.y + c.height > this._map_bounds.height && (a.y = this._map_bounds.height - c.height));
  this._popup.setPosition(a);
};
annotorious.mediatypes.openseadragon.Viewer.prototype._show_popup = function(a) {
  this._popup.setAnnotation(a);
  this._place_popup();
  this._popup.show();
};
annotorious.mediatypes.openseadragon.Viewer.prototype._updateHighlight = function(a, b) {
  a ? (goog.style.setStyle(a.inner, "border-color", "#fff000"), this._currentlyHighlightedOverlay = a, this._show_popup(a.annotation)) : delete this._currentlyHighlightedOverlay;
  b && goog.style.setStyle(b.inner, "border-color", "#fff");
};
annotorious.mediatypes.openseadragon.Viewer.prototype.addAnnotation = function(a) {
  var b = a.shapes[0].geometry, c = goog.dom.createDom("div", "annotorious-ol-boxmarker-outer"), d = goog.dom.createDom("div", "annotorious-ol-boxmarker-inner");
  goog.style.setSize(d, "100%", "100%");
  goog.dom.appendChild(c, d);
  b = new OpenSeadragon.Rect(b.x, b.y, b.width, b.height);
  var e = {annotation:a, outer:c, inner:d}, f = this;
  goog.events.listen(d, goog.events.EventType.MOUSEOVER, function(a) {
    f._currentlyHighlightedOverlay || f._updateHighlight(e);
    f._lastHoveredOverlay = e;
  });
  goog.events.listen(d, goog.events.EventType.MOUSEOUT, function(a) {
    delete f._lastHoveredOverlay;
    f._popup.startHideTimer();
  });
  this._overlays.push(e);
  goog.array.sort(this._overlays, function(a, b) {
    a = a.annotation.shapes[0];
    return annotorious.shape.getSize(b.annotation.shapes[0]) - annotorious.shape.getSize(a);
  });
  var g = 1;
  goog.array.forEach(this._overlays, function(a) {
    goog.style.setStyle(a.outer, "z-index", g);
    g++;
  });
  this._osdViewer.addOverlay(c, b);
};
annotorious.mediatypes.openseadragon.Viewer.prototype.removeAnnotation = function(a) {
  var b = goog.array.find(this._overlays, function(b) {
    return b.annotation == a;
  });
  b && (goog.array.remove(this._overlays, b), this._osdViewer.removeOverlay(b.outer));
};
annotorious.mediatypes.openseadragon.Viewer.prototype.getAnnotations = function() {
  return goog.array.map(this._overlays, function(a) {
    console.log(a);
    return a.annotation;
  });
};
annotorious.mediatypes.openseadragon.Viewer.prototype.highlightAnnotation = function(a) {
  var b = this;
  a ? goog.array.forEach(this._overlays, function(c) {
    c.annotation == a && (b._currentlyHighlightedOverlay && b._currentlyHighlightedOverlay != c ? b._updateHighlight(c, b._currentlyHighlightedOverlay) : b._updateHighlight(c));
  }) : this._popup.startHideTimer();
};
annotorious.mediatypes.openseadragon.Viewer.prototype.destroy = function() {
  var a = this;
  goog.array.forEach(this._overlays, function(b) {
    a._osdViewer.removeOverlay(b.outer);
  });
  this._overlays = [];
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
  var b = this;
  (function() {
    var a = parseInt(goog.style.getComputedStyle(b.element, "width"), 10), d = parseInt(goog.style.getComputedStyle(b.element, "height"), 10);
    goog.style.setSize(b._editCanvas, a, d);
    b._editCanvas.width = a;
    b._editCanvas.height = d;
  })();
  a = new annotorious.plugins.selection.RectDragSelector;
  a.init(this, this._editCanvas);
  this._selectors.push(a);
  this._currentSelector = a;
  this.editor = new annotorious.Editor(this);
  this._attachListener(this._editCanvas);
  this._eventBroker.addHandler(annotorious.events.EventType.SELECTION_COMPLETED, function(a) {
    a = a.viewportBounds;
    b.editor.setPosition(new annotorious.shape.geom.Point(a.left, a.bottom + 4));
    b.editor.open();
  });
  this._eventBroker.addHandler(annotorious.events.EventType.SELECTION_CANCELED, function(a) {
    b.stopSelection();
  });
};
goog.inherits(annotorious.mediatypes.openseadragon.OpenSeadragonAnnotator, annotorious.mediatypes.Annotator);
annotorious.mediatypes.openseadragon.OpenSeadragonAnnotator.prototype.showSelectionWidget = function() {
};
annotorious.mediatypes.openseadragon.OpenSeadragonAnnotator.prototype.hideSelectionWidget = function() {
};
annotorious.mediatypes.openseadragon.OpenSeadragonAnnotator.prototype.destroy = function() {
  this._viewer.destroy();
  delete this._viewer;
};
annotorious.mediatypes.openseadragon.OpenSeadragonAnnotator.prototype.activateSelector = function(a) {
  goog.style.setStyle(this._editCanvas, "pointer-events", "auto");
  var b = this;
  goog.style.showElement(this._editCanvas, !0);
  goog.style.setOpacity(this._secondaryHint, 0.8);
  window.setTimeout(function() {
    goog.style.setOpacity(b._secondaryHint, 0);
  }, 2000);
  a && (this._stop_selection_callback = a);
};
annotorious.mediatypes.openseadragon.OpenSeadragonAnnotator.prototype.editAnnotation = function(a) {
  this._viewer.removeAnnotation(a);
  var b = this._currentSelector, c = this;
  if (b) {
    goog.style.showElement(this._editCanvas, !0);
    this._viewer.highlightAnnotation(void 0);
    var d = this._editCanvas.getContext("2d"), e = annotorious.shape.transform(a.shapes[0], function(a) {
      return c.fromItemCoordinates(a);
    });
    b.drawShape(d, e);
    b = annotorious.shape.getBoundingRect(e).geometry;
    this.editor.setPosition(new annotorious.shape.geom.Point(b.x, b.y + b.height + 4));
    this.editor.open(a);
  }
};
annotorious.mediatypes.openseadragon.OpenSeadragonAnnotator.prototype.fromItemCoordinates = function(a) {
  var b = annotorious.dom.getOffset(this.element);
  b.top += window.pageYOffset;
  b.left += window.pageXOffset;
  var c = new OpenSeadragon.Point(a.x, a.y);
  a = a.width ? new OpenSeadragon.Point(a.x + a.width, a.y + a.height) : !1;
  c = this._osdViewer.viewport.viewportToWindowCoordinates(c);
  return a ? (a = this._osdViewer.viewport.viewportToWindowCoordinates(a), {x:c.x - b.left, y:c.y - b.top, width:a.x - c.x + 2, height:a.y - c.y + 2}) : c;
};
annotorious.mediatypes.openseadragon.OpenSeadragonAnnotator.prototype.getAnnotations = function() {
  return this._viewer.getAnnotations();
};
annotorious.mediatypes.openseadragon.OpenSeadragonAnnotator.prototype.getAvailableSelectors = function() {
};
annotorious.mediatypes.openseadragon.OpenSeadragonAnnotator.prototype.getItem = function() {
  return {src:"dzi://openseadragon/something"};
};
annotorious.mediatypes.openseadragon.OpenSeadragonAnnotator.prototype.setActiveSelector = function(a) {
};
annotorious.mediatypes.openseadragon.OpenSeadragonAnnotator.prototype.getActiveSelector = function() {
  return this._currentSelector;
};
annotorious.mediatypes.openseadragon.OpenSeadragonAnnotator.prototype.toItemCoordinates = function(a) {
  var b = annotorious.dom.getOffset(this.element);
  b.top += window.pageYOffset;
  b.left += window.pageXOffset;
  var c = new OpenSeadragon.Point(a.x + b.left, a.y + b.top);
  a = a.width ? new OpenSeadragon.Point(a.x + b.left + a.width - 2, a.y + b.top + a.height - 2) : !1;
  c = this._osdViewer.viewport.windowToViewportCoordinates(c);
  return a ? (a = this._osdViewer.viewport.windowToViewportCoordinates(a), {x:c.x, y:c.y, width:a.x - c.x, height:a.y - c.y}) : c;
};
annotorious.mediatypes.openseadragon.OpenSeadragonModule = function() {
  annotorious.mediatypes.Module.call();
  this._initFields();
};
goog.inherits(annotorious.mediatypes.openseadragon.OpenSeadragonModule, annotorious.mediatypes.Module);
annotorious.mediatypes.openseadragon.OpenSeadragonModule.prototype.getItemURL = function(a) {
  return "dzi://openseadragon/something";
};
annotorious.mediatypes.openseadragon.OpenSeadragonModule.prototype.newAnnotator = function(a) {
  return new annotorious.mediatypes.openseadragon.OpenSeadragonAnnotator(a);
};
annotorious.mediatypes.openseadragon.OpenSeadragonModule.prototype.supports = function(a) {
  return a instanceof OpenSeadragon.Viewer;
};
annotorious.Annotorious = function() {
  this._isInitialized = !1;
  this._modules = [new annotorious.mediatypes.image.ImageModule];
  window.OpenLayers && this._modules.push(new annotorious.mediatypes.openlayers.OpenLayersModule);
  window.OpenSeadragon && this._modules.push(new annotorious.mediatypes.openseadragon.OpenSeadragonModule);
  this._plugins = [];
  var a = this;
  annotorious.dom.addOnLoadHandler(function() {
    a._init();
  });
};
annotorious.Annotorious.prototype._init = function() {
  if (!this._isInitialized) {
    var a = this;
    goog.array.forEach(this._modules, function(a) {
      a.init();
    });
    goog.array.forEach(this._plugins, function(b) {
      b.initPlugin && b.initPlugin(a);
      goog.array.forEach(a._modules, function(a) {
        a.addPlugin(b);
      });
    });
    this._isInitialized = !0;
  }
};
annotorious.Annotorious.prototype._getModuleForItemSrc = function(a) {
  return goog.array.find(this._modules, function(b) {
    return b.annotatesItem(a);
  });
};
annotorious.Annotorious.prototype.activateSelector = function(a, b) {
  var c = void 0, d = void 0;
  goog.isString(a) ? (c = a, d = b) : goog.isFunction(a) && (d = a);
  c ? (a = this._getModuleForItemSrc(c)) && a.activateSelector(c, d) : goog.array.forEach(this._modules, function(a) {
    a.activateSelector(d);
  });
};
annotorious.Annotorious.prototype.addAnnotation = function(a, b) {
  a.src = annotorious.dom.toAbsoluteURL(a.src);
  var c = this._getModuleForItemSrc(a.src);
  c && c.addAnnotation(a, b);
};
annotorious.Annotorious.prototype.addHandler = function(a, b) {
  goog.array.forEach(this._modules, function(c) {
    c.addHandler(a, b);
  });
};
annotorious.Annotorious.prototype.removeHandler = function(a, b) {
  goog.array.forEach(this._modules, function(c) {
    c.removeHandler(a, b);
  });
};
annotorious.Annotorious.prototype.addPlugin = function(a, b) {
  try {
    var c = new window.annotorious.plugin[a](b);
    "complete" == document.readyState ? (c.initPlugin && c.initPlugin(this), goog.array.forEach(this._modules, function(a) {
      a.addPlugin(c);
    })) : this._plugins.push(c);
  } catch (d) {
    console.log("Could not load plugin: " + a);
  }
};
annotorious.Annotorious.prototype.destroy = function(a) {
  if (a) {
    var b = this._getModuleForItemSrc(a);
    b && b.destroy(a);
  } else {
    goog.array.forEach(this._modules, function(a) {
      a.destroy();
    });
  }
};
annotorious.Annotorious.prototype.getActiveSelector = function(a) {
  var b = this._getModuleForItemSrc(a);
  if (b) {
    return b.getActiveSelector(a);
  }
};
annotorious.Annotorious.prototype.getAnnotations = function(a) {
  if (a) {
    var b = this._getModuleForItemSrc(a);
    return b ? b.getAnnotations(a) : [];
  }
  var c = [];
  goog.array.forEach(this._modules, function(a) {
    goog.array.extend(c, a.getAnnotations());
  });
  return c;
};
annotorious.Annotorious.prototype.getAvailableSelectors = function(a) {
  var b = this._getModuleForItemSrc(a);
  return b ? b.getAvailableSelectors(a) : [];
};
annotorious.Annotorious.prototype.hideAnnotations = function(a) {
  if (a) {
    var b = this._getModuleForItemSrc(a);
    b && b.hideAnnotations(a);
  } else {
    goog.array.forEach(this._modules, function(a) {
      a.hideAnnotations();
    });
  }
};
annotorious.Annotorious.prototype.hideSelectionWidget = function(a) {
  if (a) {
    var b = this._getModuleForItemSrc(a);
    b && b.hideSelectionWidget(a);
  } else {
    goog.array.forEach(this._modules, function(a) {
      a.hideSelectionWidget();
    });
  }
};
annotorious.Annotorious.prototype.stopSelection = function(a) {
  if (a) {
    var b = this._getModuleForItemSrc(a);
    b && b.stopSelection(a);
  } else {
    goog.array.forEach(this._modules, function(a) {
      a.stopSelection();
    });
  }
};
annotorious.Annotorious.prototype.highlightAnnotation = function(a) {
  if (a) {
    var b = this._getModuleForItemSrc(a.src);
    b && b.highlightAnnotation(a);
  } else {
    goog.array.forEach(this._modules, function(a) {
      a.highlightAnnotation();
    });
  }
};
annotorious.Annotorious.prototype.makeAnnotatable = function(a) {
  this._init();
  var b = goog.array.find(this._modules, function(b) {
    return b.supports(a);
  });
  if (b) {
    b.makeAnnotatable(a);
  } else {
    throw "Error: Annotorious does not support this media type in the current version or build configuration.";
  }
};
annotorious.Annotorious.prototype.removeAll = function(a) {
  var b = this;
  goog.array.forEach(this.getAnnotations(a), function(a) {
    b.removeAnnotation(a);
  });
};
annotorious.Annotorious.prototype.removeAnnotation = function(a) {
  var b = this._getModuleForItemSrc(a.src);
  b && b.removeAnnotation(a);
};
annotorious.Annotorious.prototype.reset = function(a) {
  goog.array.forEach(this._modules, function(a) {
    a.destroy();
    a.init();
  });
};
annotorious.Annotorious.prototype.setActiveSelector = function(a, b) {
  var c = this._getModuleForItemSrc(a);
  c && c.setActiveSelector(a, b);
};
annotorious.Annotorious.prototype.setProperties = function(a) {
  goog.array.forEach(this._modules, function(b) {
    b.setProperties(a);
  });
};
annotorious.Annotorious.prototype.setSelectionEnabled = function(a) {
  a ? this.showSelectionWidget(void 0) : this.hideSelectionWidget(void 0);
};
annotorious.Annotorious.prototype.showAnnotations = function(a) {
  if (a) {
    var b = this._getModuleForItemSrc(a);
    b && b.showAnnotations(a);
  } else {
    goog.array.forEach(this._modules, function(a) {
      a.showAnnotations();
    });
  }
};
annotorious.Annotorious.prototype.showSelectionWidget = function(a) {
  if (a) {
    var b = this._getModuleForItemSrc(a);
    b && b.showSelectionWidget(a);
  } else {
    goog.array.forEach(this._modules, function(a) {
      a.showSelectionWidget();
    });
  }
};
window.anno = new annotorious.Annotorious;

//# sourceMappingURL=annotorious.js.map
