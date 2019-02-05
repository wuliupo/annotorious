const os = require("os");
const closureBuilder = require("closure-builder");
const glob = closureBuilder.globSupport();

closureBuilder.build({
  debug: true,
  name: "annotorious-soy",
  srcs: glob(["templates/**/*.soy"]),
  out: "./",
  options: {
    closure: {
      define: ["goog.DEBUG=true", "goog.dom.ASSUME_STANDARDS_MODE=true"]
    }
  }
});

// closureBuilder.build({
//   debug: true,
//   name: "annotorious",
//   srcs: glob(["src/**/*.js", "templates/**/*.soy"]),
//   out: "dist/annotorious.es6.js",
//   entryPoint: "src/annotorious.js",
//   out_source_map: "dist/annotorious.es6.js.map",
//   options: {
//     closure: {
//       define: ["goog.DEBUG=true", "goog.dom.ASSUME_STANDARDS_MODE=true"],
//       formatting: "PRETTY_PRINT",
//       //output_wrapper: '(function(){%output%})()\n//# sourceMappingURL=output.js.map'
//       //output_wrapper: "%output%\n//# sourceMappingURL=annotorious.js.map",
//       source_map_location_mapping: [
//         __dirname.replace(/\\/g, "/") + "/node_modules/|node_modules/",
//         os.tmpdir().replace(/\\/g, "/") + "|temp"
//       ],
//       source_map_include_content: true,
//       process_common_js_modules: true,
//       module_resolution: "NODE",
//       js: glob(["./node_modules/google-closure-library/closure/goog/base.js", "./node_modules/nanoid/index.browser.js"]),
//     }
//   },
//   externs: [
//     "externs/api.externs.js",
//     "externs/openlayers.externs.js",
//     "externs/openseadragon.externs.js",
//     "externs/jquery.externs.js"
//   ]
// });
