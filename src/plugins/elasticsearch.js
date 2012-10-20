goog.provide('yuma.plugin');

goog.require('goog.array');
goog.require('goog.net.XhrIo');

/**
 * A simple storage connector to the ElasticSearch REST interface.
 * Note: work in progress!
 * 
 * @param {yuma.modules.Module} module the module
 * @constructor
 */
yuma.plugin['ElasticSearchStorage'] = function(opt_config_options) {
  /** @private **/
  this._STORE_URI = opt_config_options['base_url'];
}

yuma.plugin['ElasticSearchStorage'].prototype.initPlugin = function(module) {
  var self = this;
  module.addHandler(yuma.events.EventType.ANNOTATION_EDIT_SAVE, function(event) {
    self._create(event.annotation);
  });

  module.addHandler(yuma.events.EventType.POPUP_BTN_DELETE, function(event) {
    self._delete(event.annotation);
  });
  
  this._loadAnnotations(module);  
}

/**
 * @private
 */
yuma.plugin['ElasticSearchStorage'].prototype._showError = function(error) {
  // TODO proper error handling
  window.alert('ERROR');
  console.log(error);
}

/**
 * @private
 */
yuma.plugin['ElasticSearchStorage'].prototype._loadAnnotations = function(module) {
  // TODO need to restrict search to the URL of the annotated
  
  var self = this;
  goog.net.XhrIo.send(this._STORE_URI + '_search?query=*:*', function(data) {
    try {
      var hits = data.target.getResponseJson()['hits']['hits'];
      goog.array.forEach(hits, function(hit, idx, array) {
        var annotation = hit['_source'];
        annotation.id = hit['_id'];
        module.addAnnotation(annotation);
      });
    } catch (e) {
      self._showError(e);
    }
  });
}

/**
 * @private
 */
yuma.plugin['ElasticSearchStorage'].prototype._create = function(annotation) {
  var self = this;
  goog.net.XhrIo.send(this._STORE_URI + 'annotation/', function(response) {
    // TODO error handling if response status != 201 (CREATED)

    var id = response.target.getResponseJson()['_id'];
    annotation.id = id;
  }, 'POST', goog.json.serialize(annotation));
}

/**
 * @private
 */
yuma.plugin['ElasticSearchStorage'].prototype._delete = function(annotation) {
  goog.net.XhrIo.send(this._STORE_URI + 'annotation/' + annotation.id, function(response) {
    // TODO error handling
  }, 'DELETE');  
}
