import React, {Component, PropTypes} from "react"

export default class About extends Component {

  static contextTypes = {
    file: PropTypes.object
  };

  render() {
    return (
      <div className="about-page">
        <div dangerouslySetInnerHTML={{__html: this.context.file.contents}} />
      </div>
    )
  }
}
