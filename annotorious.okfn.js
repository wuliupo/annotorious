var j=void 0,k=!0,n=null,p=!1,t,u=this;function aa(a,b){var c=a.split("."),d=u;!(c[0]in d)&&d.execScript&&d.execScript("var "+c[0]);for(var f;c.length&&(f=c.shift());)!c.length&&b!==j?d[f]=b:d=d[f]?d[f]:d[f]={}}
function v(a){var b=typeof a;if("object"==b)if(a){if(a instanceof Array)return"array";if(a instanceof Object)return b;var c=Object.prototype.toString.call(a);if("[object Window]"==c)return"object";if("[object Array]"==c||"number"==typeof a.length&&"undefined"!=typeof a.splice&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("splice"))return"array";if("[object Function]"==c||"undefined"!=typeof a.call&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("call"))return"function"}else return"null";
else if("function"==b&&"undefined"==typeof a.call)return"object";return b}function ba(a){var b=v(a);return"array"==b||"object"==b&&"number"==typeof a.length}function x(a){return"string"==typeof a}function fa(a){var b=typeof a;return"object"==b&&a!=n||"function"==b}function z(a){return a[ga]||(a[ga]=++ha)}var ga="closure_uid_"+Math.floor(2147483648*Math.random()).toString(36),ha=0;
function ia(a,b){var c=Array.prototype.slice.call(arguments,1);return function(){var b=Array.prototype.slice.call(arguments);b.unshift.apply(b,c);return a.apply(this,b)}}function ja(a,b){function c(){}c.prototype=b.prototype;a.ta=b.prototype;a.prototype=new c;a.prototype.constructor=a};function ka(a){return a.replace(/^[\s\xa0]+|[\s\xa0]+$/g,"")}function la(a){if(!ma.test(a))return a;-1!=a.indexOf("&")&&(a=a.replace(na,"&amp;"));-1!=a.indexOf("<")&&(a=a.replace(oa,"&lt;"));-1!=a.indexOf(">")&&(a=a.replace(pa,"&gt;"));-1!=a.indexOf('"')&&(a=a.replace(qa,"&quot;"));return a}var na=/&/g,oa=/</g,pa=/>/g,qa=/\"/g,ma=/[&<>\"]/,ra={};function sa(a){return ra[a]||(ra[a]=(""+a).replace(/\-([a-z])/g,function(a,c){return c.toUpperCase()}))};var A,ta,ua,ya,za;function Aa(){return u.navigator?u.navigator.userAgent:n}function Ba(){return u.navigator}ya=ua=ta=A=p;var Ca;if(Ca=Aa()){var Da=Ba();A=0==Ca.indexOf("Opera");ta=!A&&-1!=Ca.indexOf("MSIE");ua=!A&&-1!=Ca.indexOf("WebKit");ya=!A&&!ua&&"Gecko"==Da.product}var Ea=A,B=ta,C=ya,D=ua,Fa=Ba();za=-1!=(Fa&&Fa.platform||"").indexOf("Mac");var Ga=!!Ba()&&-1!=(Ba().appVersion||"").indexOf("X11"),Ha;
a:{var Ia="",E;if(Ea&&u.opera)var Ja=u.opera.version,Ia="function"==typeof Ja?Ja():Ja;else if(C?E=/rv\:([^\);]+)(\)|;)/:B?E=/MSIE\s+([^\);]+)(\)|;)/:D&&(E=/WebKit\/(\S+)/),E)var Ka=E.exec(Aa()),Ia=Ka?Ka[1]:"";if(B){var La,Ma=u.document;La=Ma?Ma.documentMode:j;if(La>parseFloat(Ia)){Ha=""+La;break a}}Ha=Ia}var Na={};
function F(a){var b;if(!(b=Na[a])){b=0;for(var c=ka(""+Ha).split("."),d=ka(""+a).split("."),f=Math.max(c.length,d.length),e=0;0==b&&e<f;e++){var g=c[e]||"",h=d[e]||"",l=RegExp("(\\d*)(\\D*)","g"),i=RegExp("(\\d*)(\\D*)","g");do{var r=l.exec(g)||["","",""],m=i.exec(h)||["","",""];if(0==r[0].length&&0==m[0].length)break;b=((0==r[1].length?0:parseInt(r[1],10))<(0==m[1].length?0:parseInt(m[1],10))?-1:(0==r[1].length?0:parseInt(r[1],10))>(0==m[1].length?0:parseInt(m[1],10))?1:0)||((0==r[2].length)<(0==
m[2].length)?-1:(0==r[2].length)>(0==m[2].length)?1:0)||(r[2]<m[2]?-1:r[2]>m[2]?1:0)}while(0==b)}b=Na[a]=0<=b}return b}var Oa={};function Pa(){return Oa[9]||(Oa[9]=B&&!!document.documentMode&&9<=document.documentMode)};var G="ontouchstart"in window,H={va:G?"touchstart":"mousedown",N:G?"touchenter":"mouseover",aa:G?"touchmove":"mousemove",wa:G?"touchend":"mouseup",M:G?"touchleave":"mouseout",Ia:G?"touchend":"click"};H.G=G;H.La=G?"TouchEvent":"MouseEvent";H.Ma=G?"initTouchEvent":"initMouseEvent";function Qa(a,b){this.x=a;this.y=b};function Ra(a){this.L=a};function Sa(a,b,c,d){0<c?(this.x=a,this.width=c):(this.x=a+c,this.width=-c);0<d?(this.y=b,this.height=d):(this.y=b+d,this.height=-d)};function Ta(a,b){this.type=a;this.a=b}function Ua(a){if("rect"==a.type)return a.a;if("polygon"==a.type){for(var a=a.a.L,b=a[0].x,c=a[0].x,d=a[0].y,f=a[0].y,e=1;e<a.length;e++)a[e].x>c&&(c=a[e].x),a[e].x<b&&(b=a[e].x),a[e].y>f&&(f=a[e].y),a[e].y<d&&(d=a[e].y);return new Sa(b,d,c-b,f-d)}}
function Va(a,b){if("rect"==a.type){var c=a.a,d=b({x:c.x,y:c.y}),c=b({x:c.width,y:c.height});return new Ta("rect",new Sa(d.x,d.y,c.x,c.y))}if("polygon"==a.type){var f=[];J(a.a.L,function(a){f.push(b(a))});return new Ta("polygon",new Ra(f))}};var K=Array.prototype,Ya=K.indexOf?function(a,b,c){return K.indexOf.call(a,b,c)}:function(a,b,c){c=c==n?0:0>c?Math.max(0,a.length+c):c;if(x(a))return!x(b)||1!=b.length?-1:a.indexOf(b,c);for(;c<a.length;c++)if(c in a&&a[c]===b)return c;return-1},J=K.forEach?function(a,b,c){K.forEach.call(a,b,c)}:function(a,b,c){for(var d=a.length,f=x(a)?a.split(""):a,e=0;e<d;e++)e in f&&b.call(c,f[e],e,a)};
function Za(a,b){var c;a:{c=a.length;for(var d=x(a)?a.split(""):a,f=0;f<c;f++)if(f in d&&b.call(j,d[f],f,a)){c=f;break a}c=-1}return 0>c?n:x(a)?a.charAt(c):a[c]}function $a(a,b){var c=Ya(a,b);0<=c&&K.splice.call(a,c,1)}function ab(a){return K.concat.apply(K,arguments)}function bb(a){if("array"==v(a))return ab(a);for(var b=[],c=0,d=a.length;c<d;c++)b[c]=a[c];return b}function cb(a,b,c,d){K.splice.apply(a,db(arguments,1))}
function db(a,b,c){return 2>=arguments.length?K.slice.call(a,b):K.slice.call(a,b,c)}function eb(a,b){K.sort.call(a,b||fb)}function fb(a,b){return a>b?1:a<b?-1:0};var gb,hb=!B||Pa();!C&&!B||B&&Pa()||C&&F("1.9.1");B&&F("9");function ib(a){return(a=a.className)&&"function"==typeof a.split?a.split(/\s+/):[]}function jb(a,b){var c=ib(a),d=db(arguments,1),f;f=c;for(var e=0,g=0;g<d.length;g++)0<=Ya(f,d[g])||(f.push(d[g]),e++);f=e==d.length;a.className=c.join(" ");return f}function kb(a,b){for(var c=ib(a),d=db(arguments,1),f=c,e=0,g=0;g<f.length;g++)0<=Ya(d,f[g])&&(cb(f,g--,1),e++);a.className=c.join(" ")};function lb(a,b){for(var c in a)b.call(j,a[c],c,a)}var mb="constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",");function nb(a,b){for(var c,d,f=1;f<arguments.length;f++){d=arguments[f];for(c in d)a[c]=d[c];for(var e=0;e<mb.length;e++)c=mb[e],Object.prototype.hasOwnProperty.call(d,c)&&(a[c]=d[c])}};function ob(a,b){lb(b,function(b,d){"style"==d?a.style.cssText=b:"class"==d?a.className=b:"for"==d?a.htmlFor=b:d in pb?a.setAttribute(pb[d],b):0==d.lastIndexOf("aria-",0)?a.setAttribute(d,b):a[d]=b})}var pb={cellpadding:"cellPadding",cellspacing:"cellSpacing",colspan:"colSpan",rowspan:"rowSpan",valign:"vAlign",height:"height",width:"width",usemap:"useMap",frameborder:"frameBorder",maxlength:"maxLength",type:"type"};
function qb(a,b,c){var d=arguments,f=document,e=d[0],g=d[1];if(!hb&&g&&(g.name||g.type)){e=["<",e];g.name&&e.push(' name="',la(g.name),'"');if(g.type){e.push(' type="',la(g.type),'"');var h={};nb(h,g);g=h;delete g.type}e.push(">");e=e.join("")}e=f.createElement(e);g&&(x(g)?e.className=g:"array"==v(g)?jb.apply(n,[e].concat(g)):ob(e,g));2<d.length&&rb(f,e,d);return e}
function rb(a,b,c){function d(c){c&&b.appendChild(x(c)?a.createTextNode(c):c)}for(var f=2;f<c.length;f++){var e=c[f];ba(e)&&!(fa(e)&&0<e.nodeType)?J(sb(e)?bb(e):e,d):d(e)}}function tb(a,b){var c=b.parentNode;c&&c.replaceChild(a,b)}function ub(a,b){if(a.contains&&1==b.nodeType)return a==b||a.contains(b);if("undefined"!=typeof a.compareDocumentPosition)return a==b||Boolean(a.compareDocumentPosition(b)&16);for(;b&&a!=b;)b=b.parentNode;return b==a}
function sb(a){if(a&&"number"==typeof a.length){if(fa(a))return"function"==typeof a.item||"string"==typeof a.item;if("function"==v(a))return"function"==typeof a.item}return p}function L(a){this.W=a||u.document||document}L.prototype.createElement=function(a){return this.W.createElement(a)};L.prototype.createTextNode=function(a){return this.W.createTextNode(a)};L.prototype.appendChild=function(a,b){a.appendChild(b)};L.prototype.contains=ub;function vb(a,b){var c=(gb||(gb=new L)).createElement("DIV");c.innerHTML=a(b||wb,j,j);if(1==c.childNodes.length){var d=c.firstChild;if(1==d.nodeType)return d}return c}var wb={};!B||Pa();var xb=!B||Pa(),yb=B&&!F("8");!D||F("528");C&&F("1.9b")||B&&F("8")||Ea&&F("9.5")||D&&F("528");!C||F("8");function zb(){}zb.prototype.la=p;zb.prototype.D=function(){this.la||(this.la=k,this.F())};zb.prototype.F=function(){this.Da&&Jb.apply(n,this.Da)};function Jb(a){for(var b=0,c=arguments.length;b<c;++b){var d=arguments[b];ba(d)?Jb.apply(n,d):d&&"function"==typeof d.D&&d.D()}};function M(a,b){this.type=a;this.currentTarget=this.target=b}ja(M,zb);M.prototype.F=function(){delete this.type;delete this.target;delete this.currentTarget};M.prototype.$=p;M.prototype.sa=k;M.prototype.preventDefault=function(){this.sa=p};function Kb(a){Kb[" "](a);return a}Kb[" "]=function(){};function N(a,b){a&&this.t(a,b)}ja(N,M);t=N.prototype;t.target=n;t.relatedTarget=n;t.offsetX=0;t.offsetY=0;t.clientX=0;t.clientY=0;t.screenX=0;t.screenY=0;t.button=0;t.keyCode=0;t.charCode=0;t.ctrlKey=p;t.altKey=p;t.shiftKey=p;t.metaKey=p;t.i=n;
t.t=function(a,b){var c=this.type=a.type;M.call(this,c);this.target=a.target||a.srcElement;this.currentTarget=b;var d=a.relatedTarget;if(d){if(C){var f;a:{try{Kb(d.nodeName);f=k;break a}catch(e){}f=p}f||(d=n)}}else"mouseover"==c?d=a.fromElement:"mouseout"==c&&(d=a.toElement);this.relatedTarget=d;this.offsetX=D||a.offsetX!==j?a.offsetX:a.layerX;this.offsetY=D||a.offsetY!==j?a.offsetY:a.layerY;this.clientX=a.clientX!==j?a.clientX:a.pageX;this.clientY=a.clientY!==j?a.clientY:a.pageY;this.screenX=a.screenX||
0;this.screenY=a.screenY||0;this.button=a.button;this.keyCode=a.keyCode||0;this.charCode=a.charCode||("keypress"==c?a.keyCode:0);this.ctrlKey=a.ctrlKey;this.altKey=a.altKey;this.shiftKey=a.shiftKey;this.metaKey=a.metaKey;this.state=a.state;this.i=a;delete this.sa;delete this.$};t.preventDefault=function(){N.ta.preventDefault.call(this);var a=this.i;if(a.preventDefault)a.preventDefault();else if(a.returnValue=p,yb)try{if(a.ctrlKey||112<=a.keyCode&&123>=a.keyCode)a.keyCode=-1}catch(b){}};
t.F=function(){N.ta.F.call(this);this.relatedTarget=this.currentTarget=this.target=this.i=n};function Lb(){}var Mb=0;t=Lb.prototype;t.key=0;t.v=p;t.ka=p;t.t=function(a,b,c,d,f,e){if("function"==v(a))this.oa=k;else if(a&&a.handleEvent&&"function"==v(a.handleEvent))this.oa=p;else throw Error("Invalid listener argument");this.H=a;this.ra=b;this.src=c;this.type=d;this.capture=!!f;this.ma=e;this.ka=p;this.key=++Mb;this.v=p};t.handleEvent=function(a){return this.oa?this.H.call(this.ma||this.src,a):this.H.handleEvent.call(this.H,a)};var O={},P={},Q={},R={};
function S(a,b,c,d,f){if(b){if("array"==v(b)){for(var e=0;e<b.length;e++)S(a,b[e],c,d,f);return n}var d=!!d,g=P;b in g||(g[b]={k:0,p:0});g=g[b];d in g||(g[d]={k:0,p:0},g.k++);var g=g[d],h=z(a),l;g.p++;if(g[h]){l=g[h];for(e=0;e<l.length;e++)if(g=l[e],g.H==c&&g.ma==f){if(g.v)break;return l[e].key}}else l=g[h]=[],g.k++;e=Nb();e.src=a;g=new Lb;g.t(c,e,a,b,d,f);c=g.key;e.key=c;l.push(g);O[c]=g;Q[h]||(Q[h]=[]);Q[h].push(g);a.addEventListener?(a==u||!a.Ca)&&a.addEventListener(b,e,d):a.attachEvent(b in R?
R[b]:R[b]="on"+b,e);return c}throw Error("Invalid event type");}function Nb(){var a=Ob,b=xb?function(c){return a.call(b.src,b.key,c)}:function(c){c=a.call(b.src,b.key,c);if(!c)return c};return b}
function Pb(a){if(O[a]){var b=O[a];if(!b.v){var c=b.src,d=b.type,f=b.ra,e=b.capture;c.removeEventListener?(c==u||!c.Ca)&&c.removeEventListener(d,f,e):c.detachEvent&&c.detachEvent(d in R?R[d]:R[d]="on"+d,f);c=z(c);f=P[d][e][c];if(Q[c]){var g=Q[c];$a(g,b);0==g.length&&delete Q[c]}b.v=k;f.qa=k;Qb(d,e,c,f);delete O[a]}}}
function Qb(a,b,c,d){if(!d.I&&d.qa){for(var f=0,e=0;f<d.length;f++)d[f].v?d[f].ra.src=n:(f!=e&&(d[e]=d[f]),e++);d.length=e;d.qa=p;0==e&&(delete P[a][b][c],P[a][b].k--,0==P[a][b].k&&(delete P[a][b],P[a].k--),0==P[a].k&&delete P[a])}}function Rb(a,b,c,d,f){var e=1,b=z(b);if(a[b]){a.p--;a=a[b];a.I?a.I++:a.I=1;try{for(var g=a.length,h=0;h<g;h++){var l=a[h];l&&!l.v&&(e&=Sb(l,f)!==p)}}finally{a.I--,Qb(c,d,b,a)}}return Boolean(e)}function Sb(a,b){var c=a.handleEvent(b);a.ka&&Pb(a.key);return c}
function Ob(a,b){if(!O[a])return k;var c=O[a],d=c.type,f=P;if(!(d in f))return k;var f=f[d],e,g;if(!xb){var h;if(!(h=b))a:{h=["window","event"];for(var l=u;e=h.shift();)if(l[e]!=n)l=l[e];else{h=n;break a}h=l}e=h;h=k in f;l=p in f;if(h){if(0>e.keyCode||e.returnValue!=j)return k;a:{var i=p;if(0==e.keyCode)try{e.keyCode=-1;break a}catch(r){i=k}if(i||e.returnValue==j)e.returnValue=k}}i=new N;i.t(e,this);e=k;try{if(h){for(var m=[],w=i.currentTarget;w;w=w.parentNode)m.push(w);g=f[k];g.p=g.k;for(var q=m.length-
1;!i.$&&0<=q&&g.p;q--)i.currentTarget=m[q],e&=Rb(g,m[q],d,k,i);if(l){g=f[p];g.p=g.k;for(q=0;!i.$&&q<m.length&&g.p;q++)i.currentTarget=m[q],e&=Rb(g,m[q],d,p,i)}}else e=Sb(c,i)}finally{m&&(m.length=0),i.D()}return e}d=new N(b,this);try{e=Sb(c,d)}finally{d.D()}return e};function Tb(){return k};/*
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
var Ub=function(){function a(a,c){if(!a)return[];if(a.constructor==Array)return a;if(!x(a))return[a];if(x(c)&&(c=x(c)?document.getElementById(c):c,!c))return[];var c=c||document,e=c.ownerDocument||c.documentElement;U=c.contentType&&"application/xml"==c.contentType||Ea&&(c.doctype||"[object XMLDocument]"==e.toString())||!!e&&(B?e.xml:c.xmlVersion||e.xmlVersion);return(e=d(a)(c))&&e.J?e:b(e)}function b(a){if(a&&a.J)return a;var b=[];if(!a||!a.length)return b;a[0]&&b.push(a[0]);if(2>a.length)return b;
I++;if(B&&U){var c=I+"";a[0].setAttribute("_zipIdx",c);for(var d=1,e;e=a[d];d++)a[d].getAttribute("_zipIdx")!=c&&b.push(e),e.setAttribute("_zipIdx",c)}else if(B&&a.Ba)try{for(d=1;e=a[d];d++)va(e)&&b.push(e)}catch(f){}else{a[0]&&(a[0]._zipIdx=I);for(d=1;e=a[d];d++)a[d]._zipIdx!=I&&b.push(e),e._zipIdx=I}return b}function c(a,b){if(!b)return 1;var c=yc(a);return!b[c]?b[c]=1:0}function d(a,b){if(Bb){var c=Cb[a];if(c&&!b)return c}if(c=Db[a])return c;var c=a.charAt(0),e=-1==a.indexOf(" ");0<=a.indexOf("#")&&
e&&(b=k);if(Bb&&!b&&-1==">~+".indexOf(c)&&(!B||-1==a.indexOf(":"))&&!(Eb&&0<=a.indexOf("."))&&-1==a.indexOf(":contains")&&-1==a.indexOf("|=")){var g=0<=">~+".indexOf(a.charAt(a.length-1))?a+" *":a;return Cb[a]=function(b){try{if(!(9==b.nodeType||e))throw"";var c=b.querySelectorAll(g);B?c.Ba=k:c.J=k;return c}catch(f){return d(a,k)(b)}}}var m=a.split(/\s*,\s*/);return Db[a]=2>m.length?f(a):function(a){for(var b=0,c=[],d;d=m[b++];)c=c.concat(f(d)(a));return c}}function f(a){var b=Fb(ka(a));if(1==b.length){var c=
e(b[0]);return function(a){if(a=c(a,[]))a.J=k;return a}}return function(a){for(var a=ca(a),c,d,f=b.length,Ab,g,Wa=0;Wa<f;Wa++){g=[];c=b[Wa];d=a.length-1;0<d&&(Ab={},g.J=k);d=e(c);for(var m=0;c=a[m];m++)d(c,g,Ab);if(!g.length)break;a=g}return g}}function e(a){var b=Gb[a.u];if(b)return b;var c=a.na,c=c?c.K:"",d=i(a,{s:1}),e="*"==a.e,f=document.getElementsByClassName;if(c)f={s:1},e&&(f.e=1),d=i(a,f),"+"==c?b=l(d):"~"==c?b=h(d):">"==c&&(b=g(d));else if(a.id)d=!a.pa&&e?Tb:i(a,{s:1,id:1}),b=function(b,
c){var e;e=b?new L(9==b.nodeType?b:b.ownerDocument||b.document):gb||(gb=new L);var f=a.id;if(f=(e=x(f)?e.W.getElementById(f):f)&&d(e))if(!(f=9==b.nodeType)){for(f=e.parentNode;f&&!(f==b);)f=f.parentNode;f=!!f}if(f)return ca(e,c)};else if(f&&/\{\s*\[native code\]\s*\}/.test(""+f)&&a.j.length&&!Eb)var d=i(a,{s:1,j:1,id:1}),m=a.j.join(" "),b=function(a,b){for(var c=ca(0,b),e,f=0,g=a.getElementsByClassName(m);e=g[f++];)d(e,a)&&c.push(e);return c};else!e&&!a.pa?b=function(b,c){for(var d=ca(0,c),e,f=0,
g=b.getElementsByTagName(a.X());e=g[f++];)d.push(e);return d}:(d=i(a,{s:1,e:1,id:1}),b=function(b,c){for(var e=ca(0,c),f,g=0,xc=b.getElementsByTagName(a.X());f=xc[g++];)d(f,b)&&e.push(f);return e});return Gb[a.u]=b}function g(a){a=a||Tb;return function(b,d,e){for(var f=0,g=b[Hb];b=g[f++];)da(b)&&(!e||c(b,e))&&a(b,f)&&d.push(b);return d}}function h(a){return function(b,d,e){for(b=b[ea];b;){if(da(b)){if(e&&!c(b,e))break;a(b)&&d.push(b)}b=b[ea]}return d}}function l(a){return function(b,d,e){for(;b=b[ea];)if(!wa||
va(b)){(!e||c(b,e))&&a(b)&&d.push(b);break}return d}}function i(a,b){if(!a)return Tb;var b=b||{},c=n;b.s||(c=V(c,va));b.e||"*"!=a.e&&(c=V(c,function(b){return b&&b.tagName==a.X()}));b.j||J(a.j,function(a,b){var d=RegExp("(?:^|\\s)"+a+"(?:\\s|$)");c=V(c,function(a){return d.test(a.className)});c.count=b});b.o||J(a.o,function(a){var b=a.name;Xa[b]&&(c=V(c,Xa[b](b,a.value)))});b.C||J(a.C,function(a){var b,d=a.V;a.type&&Ib[a.type]?b=Ib[a.type](d,a.Y):d.length&&(b=zc(d));b&&(c=V(c,b))});b.id||a.id&&(c=
V(c,function(b){return!!b&&b.id==a.id}));c||"default"in b||(c=Tb);return c}function r(a){return w(a)%2}function m(a){return!(w(a)%2)}function w(a){var b=a.parentNode,c=0,d=b[Hb],e=a._i||-1,f=b._l||-1;if(!d)return-1;d=d.length;if(f==d&&0<=e&&0<=f)return e;b._l=d;e=-1;for(b=b.firstElementChild||b.firstChild;b;b=b[ea])da(b)&&(b._i=++c,a===b&&(e=c));return e}function q(a){for(;a=a[ea];)if(da(a))return p;return k}function xa(a){for(;a=a[Ac];)if(da(a))return p;return k}function W(a,b){return!a?"":"class"==
b?a.className||"":"for"==b?a.htmlFor||"":"style"==b?a.style.cssText||"":(U?a.getAttribute(b):a.getAttribute(b,2))||""}function va(a){return 1==a.nodeType}function V(a,b){return!a?b:!b?a:function(){return a.apply(window,arguments)&&b.apply(window,arguments)}}function Fb(a){function b(){0<=i&&(o.id=c(i,s).replace(/\\/g,""),i=-1);if(0<=l){var a=l==s?n:c(l,s);0>">~+".indexOf(a)?o.e=a:o.K=a;l=-1}0<=h&&(o.j.push(c(h+1,s).replace(/\\/g,"")),h=-1)}function c(b,d){return ka(a.slice(b,d))}for(var a=0<=">~+".indexOf(a.slice(-1))?
a+" * ":a+" ",d=[],e=-1,f=-1,g=-1,m=-1,h=-1,i=-1,l=-1,w="",q="",r,s=0,xa=a.length,o=n,y=n;w=q,q=a.charAt(s),s<xa;s++)if("\\"!=w)if(o||(r=s,o={u:n,o:[],C:[],j:[],e:n,K:n,id:n,X:function(){return U?this.Ga:this.e}},l=s),0<=e)if("]"==q){y.V?y.Y=c(g||e+1,s):y.V=c(e+1,s);if((e=y.Y)&&('"'==e.charAt(0)||"'"==e.charAt(0)))y.Y=e.slice(1,-1);o.C.push(y);y=n;e=g=-1}else"="==q&&(g=0<="|~^$*".indexOf(w)?w:"",y.type=g+q,y.V=c(e+1,s-g.length),g=s+1);else 0<=f?")"==q&&(0<=m&&(y.value=c(f+1,s)),m=f=-1):"#"==q?(b(),
i=s+1):"."==q?(b(),h=s):":"==q?(b(),m=s):"["==q?(b(),e=s,y={}):"("==q?(0<=m&&(y={name:c(m+1,s),value:n},o.o.push(y)),f=s):" "==q&&w!=q&&(b(),0<=m&&o.o.push({name:c(m+1,s)}),o.pa=o.o.length||o.C.length||o.j.length,o.Na=o.u=c(r,s),o.Ga=o.e=o.K?n:o.e||"*",o.e&&(o.e=o.e.toUpperCase()),d.length&&d[d.length-1].K&&(o.na=d.pop(),o.u=o.na.u+" "+o.u),d.push(o),o=n);return d}function ca(a,b){var c=b||[];a&&c.push(a);return c}var Eb=D&&"BackCompat"==document.compatMode,Hb=document.firstChild.children?"children":
"childNodes",U=p,Ib={"*=":function(a,b){return function(c){return 0<=W(c,a).indexOf(b)}},"^=":function(a,b){return function(c){return 0==W(c,a).indexOf(b)}},"$=":function(a,b){return function(c){c=" "+W(c,a);return c.lastIndexOf(b)==c.length-b.length}},"~=":function(a,b){var c=" "+b+" ";return function(b){return 0<=(" "+W(b,a)+" ").indexOf(c)}},"|=":function(a,b){b=" "+b;return function(c){c=" "+W(c,a);return c==b||0==c.indexOf(b+"-")}},"=":function(a,b){return function(c){return W(c,a)==b}}},wa=
"undefined"==typeof document.firstChild.nextElementSibling,ea=!wa?"nextElementSibling":"nextSibling",Ac=!wa?"previousElementSibling":"previousSibling",da=wa?va:Tb,Xa={checked:function(){return function(a){return a.checked||a.attributes.checked}},"first-child":function(){return xa},"last-child":function(){return q},"only-child":function(){return function(a){return!xa(a)||!q(a)?p:k}},empty:function(){return function(a){for(var b=a.childNodes,a=a.childNodes.length-1;0<=a;a--){var c=b[a].nodeType;if(1===
c||3==c)return p}return k}},contains:function(a,b){var c=b.charAt(0);if('"'==c||"'"==c)b=b.slice(1,-1);return function(a){return 0<=a.innerHTML.indexOf(b)}},not:function(a,b){var c=Fb(b)[0],d={s:1};"*"!=c.e&&(d.e=1);c.j.length||(d.j=1);var e=i(c,d);return function(a){return!e(a)}},"nth-child":function(a,b){if("odd"==b)return r;if("even"==b)return m;if(-1!=b.indexOf("n")){var c=b.split("n",2),d=c[0]?"-"==c[0]?-1:parseInt(c[0],10):1,e=c[1]?parseInt(c[1],10):0,f=0,g=-1;0<d?0>e?e=e%d&&d+e%d:0<e&&(e>=
d&&(f=e-e%d),e%=d):0>d&&(d*=-1,0<e&&(g=e,e%=d));if(0<d)return function(a){a=w(a);return a>=f&&(0>g||a<=g)&&a%d==e};b=e}var h=parseInt(b,10);return function(a){return w(a)==h}}},zc=B?function(a){var b=a.toLowerCase();"class"==b&&(a="className");return function(c){return U?c.getAttribute(a):c[a]||c[b]}}:function(a){return function(b){return b&&b.getAttribute&&b.hasAttribute(a)}},Gb={},Db={},Cb={},Bb=!!document.querySelectorAll&&(!D||F("526")),I=0,yc=B?function(a){return U?a.getAttribute("_uid")||a.setAttribute("_uid",
++I)||I:a.uniqueID}:function(a){return a._uid||(a._uid=++I)};a.o=Xa;return a}();aa("goog.dom.query",Ub);aa("goog.dom.query.pseudos",Ub.o);var T;T=H;
function Vb(a,b,c){this.l=a;this.z=b;this.d=c;this.B=[];this.n=[];this.f=this.l.getContext("2d");this.c=n;this.q=k;this.w=n;this.T=p;var d=this;S(this.l,T.aa,function(a){if(d.q){var b=Wb(a);(b=Xb(d,b.x,b.y))?(d.T=p,d.c?d.c!=b&&(d.q=p,Yb(d.z)):(d.c=b,Zb(d),d.d.fireEvent($b,{annotation:d.c,Z:a}))):!d.T&&d.c&&(d.q=p,Yb(d.z))}else d.w=a});X(c,Y,function(){delete d.c;d.q=k});X(c,ac,function(){var a,b;if(!d.q&&d.w){a=Wb(d.w);b=a.x;a=a.y;var c=d.c;d.c=Xb(d,b,a);d.q=k;c!=d.c?(Zb(d),d.d.fireEvent(bc,{annotation:c,
Z:d.w}),d.d.fireEvent($b,{annotation:d.c,Z:d.w})):d.c&&cc(d.z)}else Zb(d)})}function dc(a,b){a.B.push(b);var c=b.m[0];"pixel"!=c.Oa&&(c=Va(c,function(b){return a.d.Ea(b)}));a.n[z(b)]=c;ec(a,c)}function fc(a,b){(a.c=b)?a.T=k:Yb(a.z);Zb(a)}function Xb(a,b,c){a=gc(a,b,c);if(0<a.length)return a[0]}
function gc(a,b,c){var d=[];J(a.B,function(f){var e;var g=a.n[z(f)];if("rect"==g.type)e=b<g.a.x||c<g.a.y||b>g.a.x+g.a.width||c>g.a.y+g.a.height?p:k;else if("polygon"==g.type){e=p;for(var h=g.a.L,l=g=g.a.L.length-1,i=0;i<g;i++){if(h[i].y<c&&h[l].y>=c||h[l].y<c&&h[i].y>=c)h[i].x+(c-h[i].y)/(h[l].y-h[i].y)*(h[l].x-h[i].x)<b&&(e=!e);l=i}}else e=p;e&&d.push(f)});eb(d,function(a,b){return("rect"==a.m[0].type?a.m[0].a.width*a.m[0].a.height:0)>("rect"==b.m[0].type?b.m[0].a.width*b.m[0].a.height:0)});return d}
function ec(a,b,c){Za(a.d.Fa(),function(){return"rect"==b.type})?hc(a.f,b,c):console.log("WARNING unsupported shape type: "+b.type)}function Zb(a){a.f.clearRect(0,0,a.l.width,a.l.height);J(a.B,function(b){ec(a,a.n[z(b)])});if(a.c){var b=a.n[z(a.c)];ec(a,b,k);b=Ua(b);a.z.show(a.c,{x:b.x,y:b.y+b.height+5})}};function ic(a,b,c){x(b)?jc(a,c,b):lb(b,ia(jc,a))}function jc(a,b,c){a.style[sa(c)]=b}function kc(a,b,c){var d=C&&(za||Ga)&&F("1.9");a.style.left=lc(b,d);a.style.top=lc(c,d)}function mc(a,b,c){if(c==j)throw Error("missing height argument");a.style.width=lc(b,k);a.style.height=lc(c,k)}function lc(a,b){"number"==typeof a&&(a=(b?Math.round(a):a)+"px");return a}
function nc(a,b){var c=a.style;"opacity"in c?c.opacity=b:"MozOpacity"in c?c.MozOpacity=b:"filter"in c&&(c.filter=""===b?"":"alpha(opacity="+100*b+")")}function oc(a,b){a.style.display=b?"":"none"};T=H;
function pc(a,b){function c(c){var d=p,f=c.relatedTarget||p;f||(d=k);ub(e,f)&&(d=k);var g;if(g=ub(b.editor.element[0],f))g=b.editor.annotation,g=!g?p:g.url==a.src;g&&(d=k);ub(b.viewer.element[0],f)&&qc(h)&&(d=k);c.i&&c.i.touches&&(d=p);return d}var d=Z(b.element[0].firstChild),f=new rc,e=qb("div","yuma-annotationlayer");ic(e,"position","relative");mc(e,a.width,a.height);tb(e,a);e.appendChild(a);var g=vb(sc,{width:a.width,height:a.height});e.appendChild(g);var h=new tc(a,f,b,d),l=vb(sc,{width:a.width,height:a.height});
H.G||oc(l,p);e.appendChild(l);var i=new Vb(g,h,f),r=new uc;r.t(l,f,i,h);new vc(f,e);f.ua=function(a){return a};f.Ea=function(a){return a};f.Fa=function(){return[r]};document.addEventListener("annotoriousOpenAnnotation",function(a){console.log(a);fc(i,a.data)});S(e,T.N,function(a){c(a)||f.fireEvent(wc)});S(e,T.M,function(a){c(a)||f.fireEvent(Y)});Bc(h,function(a){c(a)||f.fireEvent(wc)});Cc(h,function(a){c(a)||f.fireEvent(Y)});S(H.G?l:g,T.va,function(a){var b=Wb(a,g);a.preventDefault();oc(l,k);fc(i,
j);var a=b.x,b=b.y,c={x:a,y:b};r.R=k;r.O(c);r.b=new Qa(a,b);r.d.fireEvent(Dc,{offsetX:a,offsetY:b});ic(document.body,"-webkit-user-select","none")});X(f,wc,function(){b.clearViewerHideTimer();nc(g,1)});X(f,Y,function(){nc(g,0.4)});X(f,Ec,function(c){var e={url:a.src,m:[c.shape]};b.publish("beforeAnnotationCreated",e);var f=Z(a),g=c.shape.a,c=g.x+f.left-d.left+16,f=g.y+g.height+f.top+window.pageYOffset-d.top+5;b.showEditor(e,{top:window.pageYOffset-d.top,left:0});kc(b.editor.element[0],c,f)});X(f,
Fc,function(){H.G||oc(l,p);Gc(r)});b.viewer.on("edit",function(c){if(c.url==a.src){oc(l,k);fc(i,j);var e=Z(a),f=c.m[0].a,c=f.x+e.left-d.left+16,e=f.y+f.height+e.top-d.top+window.pageYOffset+5;kc(b.editor.element[0],0,window.pageYOffset-d.top);b.editor.show();kc(b.editor.element[0],c,e)}});b.subscribe("annotationCreated",function(b){b.url==a.src&&(Gc(r),b.url==a.src&&dc(i,b))});b.subscribe("annotationsLoaded",function(b){J(b,function(b){b.url==a.src&&dc(i,b)})});b.subscribe("annotationDeleted",function(b){b.url==
a.src&&(b==i.c&&delete i.c,$a(i.B,b),delete i.n[z(b)],Zb(i));f.fireEvent(ac)});b.subscribe("annotationEditorHidden",function(){H.G||oc(l,p);Gc(r);f.fireEvent(ac)})}window.Annotator.Plugin.AnnotoriousImagePlugin=function(){function a(a){this.xa=a}a.prototype.pluginInit=function(){var a=this;J(this.xa.getElementsByTagName("img"),function(c){new pc(c,a.annotator)})};return a}();T=H;function tc(a,b,c,d){this.da=a;this.ya=b;this.g=c;this.P=d;this.Q=p;this.ha=[];this.ga=[];var f=this;S(this.g.viewer.element[0],T.N,function(a){qc(f)&&(cc(f),J(f.ha,function(b){b(a)}))});S(this.g.viewer.element[0],T.M,function(a){qc(f)&&(c.clearViewerHideTimer(),Yb(f),J(f.ga,function(b){b(a)}))})}function qc(a){var b=a.g.viewer.annotations;return!b||1>b.length?p:b[0].url==a.da.src}function Bc(a,b){a.ha.push(b)}function Cc(a,b){a.ga.push(b)}
function Yb(a){0<=Ya(ib(a.g.viewer.element[0]),"annotator-hide")||(a.Q=p,a.A||(a.A=window.setTimeout(function(){a.ya.fireEvent(ac);!a.Q&&qc(a)&&(jb(a.g.viewer.element[0],"annotator-hide"),a.g.viewer.annotations=[],delete a.A)},300)))}function cc(a){a.Q=k;a.A&&(window.clearTimeout(a.A),delete a.A)}
tc.prototype.show=function(a,b){kb(this.g.viewer.element[0],"annotator-hide");var c=Z(this.da);kc(this.g.viewer.element[0],0,window.pageYOffset-this.P.top);this.g.viewer.load([a]);kc(this.g.viewer.element[0],c.left-this.P.left+b.x+16,c.top+window.pageYOffset-this.P.top+b.y);cc(this)};T=H;function uc(){}uc.prototype.t=function(a,b,c,d){this.l=a;this.d=b;this.Ha=d;this.f=a.getContext("2d");this.f.lineWidth=1;this.R=p;this.viewer=c};
uc.prototype.O=function(){var a=this,b=this.l;this.U=S(b,T.aa,function(c){var d=Wb(c,b);c.preventDefault();a.R&&(a.h={x:d.x,y:d.y},a.f.clearRect(0,0,b.width,b.height),c=a.h.x-a.b.x,d=a.h.y-a.b.y,a.f.strokeStyle="#000000",a.f.strokeRect(a.b.x+0.5,a.b.y+0.5,c,d),a.f.strokeStyle="#ffffff",0<c&&0<d?a.f.strokeRect(a.b.x+1.5,a.b.y+1.5,c-2,d-2):0<c&&0>d?a.f.strokeRect(a.b.x+1.5,a.b.y-0.5,c-2,d+2):0>c&&0>d?a.f.strokeRect(a.b.x-0.5,a.b.y-0.5,c+2,d+2):a.f.strokeRect(a.b.x-0.5,a.b.y+1.5,c+2,d-2))});this.fa=
S(b,T.wa,function(c){var d=Wb(c,b),f;if(a.h){var e=Hc(a);f=a.d.ua({x:e.left,y:e.top});e=a.d.ua({x:e.right-1,y:e.bottom-1});f=new Ta("rect",new Sa(f.x,f.y,e.x-f.x,e.y-f.y))}else f=j;c=c.i?c.i:c;a.R=p;if(f)a.d.fireEvent(Ec,{Z:c,shape:f,Pa:Hc(a)});else if(a.d.fireEvent(Fc),c=Xb(a.viewer,d.x,d.y))f=a.viewer.n[z(c)],d=Ua(f),a.Ha.show(c,{x:d.x,y:d.y+d.height+5}),d=document,type="HTMLEvents",f=document.createEvent("HTMLEvents"),f.initEvent("annotoriousSelectsAnnotation"),f.data=c||{},d.dispatchEvent(f),
fc(this.viewer,c)})};uc.prototype.ba=function(){this.U&&(Pb(this.U),delete this.U);this.fa&&(Pb(this.fa),delete this.Ja)};function Gc(a){a.ba();a.f.clearRect(0,0,a.l.width,a.l.height);ic(document.body,"-webkit-user-select","auto");delete a.h}function Hc(a){var b,c;a.h.x>a.b.x?(b=a.h.x,c=a.b.x):(b=a.b.x,c=a.h.x);var d;a.h.y>a.b.y?(d=a.b.y,a=a.h.y):(d=a.h.y,a=a.b.y);return{top:d,right:b,bottom:a,left:c}}
function hc(a,b,c){if("rect"==b.type){var d;c?(c="#fff000",d=1.2):(c="#ffffff",d=1);b=b.a;a.strokeStyle="#000000";a.lineWidth=d;a.strokeRect(b.x+0.5,b.y+0.5,b.width+1,b.height+1);a.strokeStyle=c;a.strokeRect(b.x+1.5,b.y+1.5,b.width-1,b.height-1)}};function Z(a){for(var b=0,c=0;a&&!isNaN(a.offsetLeft)&&!isNaN(a.offsetTop);)b+=a.offsetLeft-a.scrollLeft,c+=a.offsetTop-a.scrollTop,a=a.offsetParent;return{top:c,left:b}};function rc(){this.r=[]}function Wb(a,b){var c=p;return c=!a.offsetX||!a.offsetY&&a.i.changedTouches?{x:a.i.changedTouches[0].pageX-Z(b).left,y:a.i.changedTouches[0].pageY-Z(b).top}:{x:a.offsetX,y:a.offsetY}}function X(a,b,c){a.r[b]||(a.r[b]=[]);a.r[b].push(c)}rc.prototype.fireEvent=function(a,b){var c=this.r[a];c&&J(c,function(a){a(b)})};
var wc="onMouseOverItem",Y="onMouseOutOfItem",$b="onMouseOverAnnotation",bc="onMouseOutOfAnnotation",Dc="onSelectionStarted",Fc="onSelectionCanceled",Ec="onSelectionCompleted",ac="beforePopupHide";T=H;function vc(a,b){var c=this;this.element=vb(Ic);this.d=a;this.ea=Ub(".annotorious-hint-msg",this.element)[0];this.ca=Ub(".annotorious-hint-icon",this.element)[0];this.ja=function(){c.show()};this.ia=function(){Jc(c)};this.O();Jc(this);b.appendChild(this.element)}vc.prototype.O=function(){var a=this;this.Aa=S(this.ca,T.N,function(){a.show();window.clearTimeout(a.S)});this.za=S(this.ca,T.M,function(){Jc(a)});X(this.d,wc,this.ja);X(this.d,Y,this.ia)};
vc.prototype.ba=function(){Pb(this.Aa);Pb(this.za);var a=this.d.r[wc];a&&$a(a,this.ja);(a=this.d.r[Y])&&$a(a,this.ia)};vc.prototype.show=function(){window.clearTimeout(this.S);nc(this.ea,0.8);var a=this;this.S=window.setTimeout(function(){Jc(a)},3E3)};function Jc(a){window.clearTimeout(a.S);nc(a.ea,0)};B&&F(8);"ScriptEngine"in u&&"JScript"==u.ScriptEngine()&&(u.ScriptEngineMajorVersion(),u.ScriptEngineMinorVersion(),u.ScriptEngineBuildVersion());function Kc(a){return"object"===typeof a&&a&&0===a.Ka?a.content:(""+a).replace(Lc,Mc)}var Nc={"\x00":"&#0;",'"':"&quot;","&":"&amp;","'":"&#39;","<":"&lt;",">":"&gt;","\t":"&#9;","\n":"&#10;","\x0B":"&#11;","\u000c":"&#12;","\r":"&#13;"," ":"&#32;","-":"&#45;","/":"&#47;","=":"&#61;","`":"&#96;","\u0085":"&#133;","\u00a0":"&#160;","\u2028":"&#8232;","\u2029":"&#8233;"};function Mc(a){return Nc[a]}var Lc=/[\x00\x22\x26\x27\x3c\x3e]/g;function Ic(){return'<div class="annotorious-hint" style="white-space:nowrap; position:absolute; top:0px; left:0px; pointer-events:none;"><div class="annotorious-hint-msg annotorious-opacity-fade">Click and Drag to Annotate</div><div class="annotorious-hint-icon" style="pointer-events:auto"></div></div>'};function sc(a){return'<canvas class="annotorious-opacity-fade" style="position:absolute; top:0px; left:0px; width:'+Kc(a.width)+"px; height:"+Kc(a.height)+'px;" width="'+Kc(a.width)+'" height="'+Kc(a.height)+'"></canvas>'};
