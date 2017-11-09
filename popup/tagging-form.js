import { h, Component } from "preact"
import Input from "./input"

export default class TaggingForm extends Component {
  render() {
    return (
      <div className="tagging-form">
        <Input icon="tag" placeholder="Type a tag & hit enter" />
      </div>
    )
  }
}
