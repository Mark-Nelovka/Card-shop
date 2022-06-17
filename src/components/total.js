import { Component } from "react";

export default class Total extends Component {
  render() {
    const {
      activePageCart,
      symbol,
      sale,
      quantity,
      total,
      toggleCart,
      openCart,
    } = this.props;
    return (
      <>
        {activePageCart ? (
          <div>
            <div className="cart_container-total">
              <div className="cart_total-name">
                <p>Tax 21%:</p>
                <p>Quantity: </p>
                <p>Total:</p>
              </div>
              <div className="cart_total-result">
                <p>
                  {symbol.trim()}
                  {sale.toFixed(2)}
                </p>
                <p>{quantity}</p>
                <p>
                  {symbol.trim()}
                  {total.toFixed(2)}
                </p>
              </div>
            </div>
            <button onClick={toggleCart} className="cart_btn-order">
              Order
            </button>
          </div>
        ) : (
          <div>
            <div className="bag_container-price">
              <p>Total</p>
              <p>
                {symbol.trim()}
                {total.toFixed(2)}
              </p>
            </div>

            <div className="bag_container-btn">
              <button onClick={openCart}>View bag</button>
              <button>CHECK OUT</button>
            </div>
          </div>
        )}
      </>
    );
  }
}
