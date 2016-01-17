"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

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

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ContainerComponent = function (_React$Component) {
  _inherits(ContainerComponent, _React$Component);

  function ContainerComponent(props) {
    _classCallCheck(this, ContainerComponent);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(ContainerComponent).call(this, props));
  }

  _createClass(ContainerComponent, [{
    key: "getChildContext",
    value: function getChildContext() {
      return {
        metadata: this.props.metadata,
        data: this.props.options && this.props.options.data ? this.props.options.data : {},
        file: this.props.file
      };
    }
  }, {
    key: "render",
    value: function render() {
      return _react2.default.createElement(_reactRouter.RouterContext, this.props);
    }
  }]);

  return ContainerComponent;
}(_react2.default.Component);

ContainerComponent.childContextTypes = {
  metadata: _react.PropTypes.object,
  data: _react.PropTypes.object,
  file: _react.PropTypes.object
};

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
      var templateFactory = _react2.default.createFactory(reactClass);
      var component = new templateFactory(_extends({}, metadata, options.data, {
        file: files[file]
      }));

      var html = undefined;
      if (options.reactRouter && files[file].location) {
        if (!options.routes) {
          throw new Error('Did not specify options.routes param. Ex. {routes: path.resolve(__dirname, {"./src/routes.jsx"})}');
        }
        var routes = require(options.routes).default;
        (0, _reactRouter.match)({
          routes: routes,
          location: files[file].location.href
        }, function (error, redirectLocation, renderProps) {

          if (renderProps) {
            var factory = _react2.default.createFactory(ContainerComponent);
            html = _server2.default[options.reactRender](factory(_extends({}, metadata, options.data, {
              file: files[file]
            }, renderProps)));
          } else {
            html = _server2.default[options.reactRender](component);
          }
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