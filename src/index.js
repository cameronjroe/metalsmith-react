import path from "path"

import multimatch from "multimatch"
import {each} from "async"
import React from "react"
import ReactDOMServer from "react-dom/server"
import { match, RoutingContext } from "react-router"

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
        const factory = React.createFactory(reactClass);
        const component = new factory({
          ...metadata,
          ...options.data,
          file: files[file],
        })

        let html;
        if (options.reactRouter && files[file].path) {
          if (!options.routes) {
            throw new Error('Did not specify options.routes param. Ex. {routes: path.resolve(__dirname, {"./src/routes.jsx"})}')
          }
          const routes = require(options.routes)
          match({ routes, location: files[file].path }, (error, redirectLocation, renderProps) => {
            let factory = React.createFactory(RoutingContext);
            let props = renderProps !== undefined ? renderProps : {};
            html = ReactDOMServer[options.reactRender](factory(...props));
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
