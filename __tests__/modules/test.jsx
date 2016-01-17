import React, {Component, PropTypes} from "react"

export default class Template extends Component {

  static displayName = "Template";

  render() {
    return (
      <html>
        <body>
          <div dangerouslySetInnerHTML={{__html: this.props.file.contents}} />
        </body>
      </html>
    )
  }
}
