import React, {Component, PropTypes} from "react"

export default class DefaultTemplate extends Component {

  static displayName = "DefaultTemplate";

  render() {
    return (
      <html>
        <body>
          <a>{this.props.a}</a>
          <div dangerouslySetInnerHTML={{__html: this.context.file.contents}} />
        </body>
      </html>
    )
  }
}
