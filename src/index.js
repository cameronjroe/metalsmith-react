import path from "path"

import multimatch from "multimatch"
import {each} from "async"
import React, {PropTypes} from "react"
import ReactDOMServer from "react-dom/server"
import { Router, match, RouterContext } from "react-router"

class ContainerComponent extends React.Component {

  static childContextTypes = {
    metadata: PropTypes.object,
    data: PropTypes.object,
    file: PropTypes.object
  };

  constructor(props) {
    super(props);
  }

  getChildContext() {
    return {
      metadata: this.props.metadata,
      data: this.props.options && this.props.options.data ? this.props.options.data : {},
      file: this.props.file,
    }
  }

  render() {
    return (
      <RouterContext {...this.props} />
    );
  }
}

export default (options) => {
  options = {
    templatesPath: "templates",
    defaultTemplate: "default",
    pattern: "**/*",
    data: {},
    before: "",
    after: "",
    reactRender: "renderToStaticMarkup", // or renderToString
    reactRouter: false,
    routes: '',
    ...options,
  }

  return (files, metalsmith, done) => {
    const metadata = metalsmith.metadata()

    each(
      multimatch(Object.keys(files), options.pattern),
      (file, cb) => {
        const template = metalsmith.path(path.join(options.templatesPath, files[file].template || options.defaultTemplate))
        const reactClass = require(template).default
        const templateFactory = React.createFactory(reactClass);
        const component = new templateFactory({
          ...metadata,
          ...options.data,
          file: files[file],
        })

        let html;
        if (options.reactRouter && files[file].location) {
          if (!options.routes) {
            throw new Error('Did not specify options.routes param. Ex. {routes: path.resolve(__dirname, {"./src/routes.jsx"})}')
          }
          const routes = require(options.routes).default
          match({
            routes,
            location: files[file].location.href
          }, (error, redirectLocation, renderProps) => {

            if (renderProps) {
              let factory = React.createFactory(ContainerComponent);
              html = ReactDOMServer[options.reactRender](factory({
                ...metadata,
                ...options.data,
                file: files[file],
                ...renderProps
              }));
            } else {
              html = ReactDOMServer[options.reactRender](component);
            }

          })
        } else {
          html = ReactDOMServer[options.reactRender](component);
        }

        try {
          files[file].contents = new Buffer(
            options.before +
            html +
            options.after
          )
        }
        catch (err) {
          cb(err)
        }

        cb()
      },
      done
    )
  }

}
