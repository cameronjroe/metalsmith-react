"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _multimatch = require("multimatch");

var _multimatch2 = _interopRequireDefault(_multimatch);

var _async = require("async");

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _server = require("react-dom/server");

var _server2 = _interopRequireDefault(_server);

var _reactRouter = require("react-router");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

exports.default = function (options) {
  options = _extends({
    templatesPath: "templates",
    defaultTemplate: "default",
    pattern: "**/*",
    data: {},
    before: "",
    after: "",
    reactRender: "renderToStaticMarkup", // or renderToString
    reactRouter: false,
    routes: ''
  }, options);

  return function (files, metalsmith, done) {
    var metadata = metalsmith.metadata();

    (0, _async.each)((0, _multimatch2.default)(Object.keys(files), options.pattern), function (file, cb) {
      var template = metalsmith.path(_path2.default.join(options.templatesPath, files[file].template || options.defaultTemplate));
      var reactClass = require(template).default;
      var factory = _react2.default.createFactory(reactClass);
      var component = new factory(_extends({}, metadata, options.data, {
        file: files[file]
      }));

      var html = undefined;
      if (options.reactRouter && files[file].path) {
        if (!options.routes) {
          throw new Error('Did not specify options.routes param. Ex. {routes: "./src/routes.jsx"}');
        }
        var routes = require(options.routes);
        (0, _reactRouter.match)({ routes: routes, location: files[file].path }, function (error, redirectLocation, renderProps) {
          html = _server2.default[options.reactRender](_reactRouter.RoutingContext.apply(undefined, _toConsumableArray(renderProps)));
        });
      } else {
        html = _server2.default[options.reactRender](component);
      }

      try {
        files[file].contents = new Buffer(options.before + html + options.after);
      } catch (err) {
        cb(err);
      }

      cb();
    }, done);
  };
};