// Compiled using marko@4.4.16 - DO NOT EDIT
"use strict";

var marko_template = module.exports = require("marko/src/html").t(__filename),
    __browser_json = require.resolve("./browser.json"),
    marko_helpers = require("marko/src/runtime/html/helpers"),
    marko_loadTag = marko_helpers.t,
    lasso_page_tag = marko_loadTag(require("lasso/taglib/config-tag")),
    lasso_head_tag = marko_loadTag(require("lasso/taglib/head-tag")),
    component_globals_tag = marko_loadTag(require("marko/src/components\\taglib\\component-globals-tag")),
    lasso_body_tag = marko_loadTag(require("lasso/taglib/body-tag")),
    init_components_tag = marko_loadTag(require("marko/src/components\\taglib\\init-components-tag")),
    await_reorderer_tag = marko_loadTag(require("marko/src/taglibs\\async\\await-reorderer-tag"));

function render(input, out) {
  var data = input;

  lasso_page_tag({
      name: "config",
      packagePath: __browser_json,
      dirname: __dirname,
      filename: __filename
    }, out);

  out.w("<!doctype html><html><head><meta charset=\"utf-8\"><title>IcoParse</title>");

  lasso_head_tag({}, out);

  out.w("</head><body>");

  component_globals_tag({}, out);

  lasso_body_tag({}, out);

  init_components_tag({}, out);

  await_reorderer_tag({}, out);

  out.w("</body></html>");
}

marko_template._ = render;

marko_template.meta = {
    deps: [
      "./style.css",
      "package: ./browser.json"
    ],
    tags: [
      "lasso/taglib/config-tag",
      "lasso/taglib/head-tag",
      "marko/src/components\\taglib\\component-globals-tag",
      "lasso/taglib/body-tag",
      "marko/src/components\\taglib\\init-components-tag",
      "marko/src/taglibs\\async\\await-reorderer-tag"
    ]
  };
