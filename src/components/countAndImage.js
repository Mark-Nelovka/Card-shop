import { Component } from "react";

export default class Count extends Component {
  counter = () => {};
  render() {
    const { id, activePageCart, changeAmount, bagCounter, gallery } =
      this.props;
    return (
      <>
        <div
          id={id}
          className={
            activePageCart ? "cart_container-counter" : "bag_container-counter"
          }
        >
          <button id={id} data-name="increment" onClick={changeAmount}></button>

          <span id={id}>
            {bagCounter.reduce((acc, val) => {
              if (id === val.id) {
                acc += 1;
              }
              return acc;
            }, 0)}
          </span>
          <button id={id} data-name="decrement" onClick={changeAmount}></button>
        </div>
        {activePageCart ? (
          <img src={gallery} alt="Item in bag" width="200px" height="auto" />
        ) : (
          <img src={gallery} alt="Item in bag" width="121" height="auto" />
        )}
      </>
    );
  }
}
