/**
 * Created by Bain on 12/5/2016.
 */

goog.require('goog.dom');

function sayHi() {
    var newHeader = goog.dom.createDom('h1', {'style': 'background-color:#eee'}, 'Hello World:)');
    goog.dom.appendChild(document.body, newHeader);
}
