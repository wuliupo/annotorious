// This file was automatically generated from openlayers_elements.soy.
// Please don't edit this file by hand.

/**
 * @fileoverview Templates in namespace annotorious.templates.openlayers.
 */

goog.provide('annotorious.templates.openlayers');

goog.require('soy');
goog.require('soydata');


/**
 * @param {Object.<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @return {string}
 * @suppress {checkTypes|uselessCode}
 */
annotorious.templates.openlayers.secondaryHint = function(opt_data, opt_ignored) {
  return '<div class="annotorious-opacity-fade" style="white-space:nowrap; position:absolute; pointer-events:none; top:80px; width:100%; text-align:center;"><div class="annotorious-ol-hint" style="width: 400px; margin:0px auto;">' + soy.$$escapeHtml(opt_data.msg) + '</div></div>';
};
if (goog.DEBUG) {
  annotorious.templates.openlayers.secondaryHint.soyTemplateName = 'annotorious.templates.openlayers.secondaryHint';
}
