import tape from "tape"
import path from 'path'

import Metalsmith from "metalsmith"
import paths from 'metalsmith-paths'
import react from "../src"

tape("metalsmith-react", test => {

  // test.test("renderToStaticMarkup", t => {
  //   new Metalsmith(__dirname)
  //     .destination("build/renderToStaticMarkup")
  //     .use(
  //       react({
  //         pattern: "**/*.md",
  //         templatesPath: "modules",
  //         data: {
  //           a: "A",
  //         },
  //       })
  //     )
  //     .use(files => {
  //       t.equal(
  //         files["1.md"].contents.toString(), "<html><body><a>A</a><div># test\n</div></body></html>",
  //         "should wrap file content with react template"
  //       )
  //       t.equal(
  //         files["2.md"].contents.toString(), "<html><body><div>test 2\n</div></body></html>",
  //         "should wrap file content with another react template"
  //       )
  //       t.equal(
  //         files["3.txt"].contents.toString(), "text\n",
  //         "should not wrap file content when doesn't match pattern"
  //       )

  //       t.end()
  //     })
  //     .build(err => {if (err) {throw err}})
  // })

  // test.test("before-after", t => {
  //   new Metalsmith(__dirname)
  //     .destination("build/before-after")
  //     .use(
  //       react({
  //         pattern: "**/*.md",
  //         templatesPath: "modules",
  //         before: "<!doctype html>\n",
  //         after: "<!--test-->\n",
  //       })
  //     )
  //     .use(files => {
  //       t.ok(
  //         files["1.md"].contents.toString().indexOf(`<!doctype html>`) === 0,
  //         "should allow to prepend content before"
  //       )
  //       t.ok(
  //         files["1.md"].contents.toString().indexOf(`</html><!--test-->`) > -1,
  //         "should allow to append content before"
  //       )

  //       t.end()
  //     })
  //     .build(err => {if (err) {throw err}})
  // })

  // test.test("renderToString", t => {
  //   new Metalsmith(__dirname)
  //     .destination("build/renderToString")
  //     .use(
  //       react({
  //         pattern: "**/*.md",
  //         templatesPath: "modules",
  //         reactRender: "renderToString",
  //       })
  //     )
  //     .use(files => {
  //       t.ok(
  //         files["2.md"].contents.toString().indexOf("<html data-reactid=") > -1,
  //         "should works with React.renderToString()"
  //       )

  //       t.end()
  //     })
  //     .build(err => {if (err) {throw err}})
  // })

  test.test("react router", (t) => {
    new Metalsmith(__dirname)
      .destination("build/react-router")
      .use(paths({
        property: "location"
      }))
      .use(react({
        pattern: '**/*.md',
        templatesPath: 'modules',
        reactRender: 'renderToString',
        reactRouter: true,
        routes: path.resolve(__dirname, './modules/routes.jsx')
      }))
      .use((files) => {
        t.ok(
          files['2.md'].contents.toString().indexOf(`<html data-reactid=`) > -1,
          "should render root route as html react component"
          )
        t.end()
      })
      .build(err => {if (err) {throw err}})
  })

})
