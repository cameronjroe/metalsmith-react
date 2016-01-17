import React, {Component, PropTypes} from "react"

export default class DefaultTemplate extends Component {

  static displayName = "DefaultTemplate";

  static contextTypes = {
    file: PropTypes.object
  };

  render() {
    return (
      <html>
        <body>
          <a>{this.props.a}</a>
          {this.props.children}
        </body>
      </html>
    )
  }
}
