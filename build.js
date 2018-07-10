const os = require("os");
const closureBuilder = require("closure-builder");
const glob = closureBuilder.globSupport();

closureBuilder.showMessages(true);
closureBuilder.build({
  debug: true,
  name: "annotorious",
  srcs: glob(["src/**/*.js", "templates/**/*.soy"]),
  out: "dist/annotorious.js",
  entryPoint: "src/annotorious.js",
  out_source_map: "dist/annotorious.js.map",
  options: {
    closure: {
      define: ["goog.DEBUG=true", "goog.dom.ASSUME_STANDARDS_MODE=true"],
      language_out: "ECMASCRIPT5",
      //compilation_level: "ADVANCED",
      formatting: "PRETTY_PRINT",
      //output_wrapper: '(function(){%output%})()\n//# sourceMappingURL=output.js.map'
      output_wrapper: "%output%\n//# sourceMappingURL=annotorious.js.map",
      source_map_location_mapping: [__dirname.replace(/\\/g, "/") + "/node_modules/|node_modules/", os.tmpdir().replace(/\\/g, "/") + "|temp"],
      source_map_include_content: true
    }
  },
  externs: [
    "externs/api.externs.js",
    "externs/openlayers.externs.js",
    "externs/openseadragon.externs.js",
    "externs/jquery.externs.js"
  ]
});