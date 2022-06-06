import { Component } from "react";

export default class ModalBag extends Component {
  componentDidMount() {
    console.log(this.props.items);
  }

  render() {
    return <div className="modal_container-bag">Modal bag</div>;
  }
}
