import React, { Component } from "react";
import { v4 } from "uuid";
export default class ModalBag extends Component {
  state = {
    itemsBag: null,
    symbol: this.props.symbol,
    total: 0,
    counter: 0,
    active: null,
    activeId: null,
    activeAtribute: null,
    arr: [],
    activePageCart: this.props.cart,
    quantity: 0,
    sale: 0,
  };

  toggleBackdrop = (e) => {
    if (e.key === "Escape") {
      return this.props.toggle();
    }
    return;
  };

  componentWillUnmount() {
    return window.removeEventListener("keydown", this.toggleBackdrop);
  }

  componentDidMount() {
    window.addEventListener("keydown", this.toggleBackdrop);
    const { symbol } = this.state;

    const itemStorage = JSON.parse(localStorage.getItem("productItems"));
    if (itemStorage) {
      const item = itemStorage.map(
        ({ name, brand, gallery, id, prices, attributes }) => {
          return {
            name,
            brand,
            gallery: gallery[0],
            id,
            attributes,
            prices,
          };
        }
      );
      const prices = item.flatMap((data) => {
        return data.prices;
      });

      const price = prices.reduce((acc, val) => {
        if (val.currency.symbol.trim() === symbol.trim()) {
          return (acc += val.amount);
        }
        return acc;
      }, 0);
      const sale = (price / 100) * 21;
      this.setState({
        itemsBag: item,
        total: price,
        quantity: itemStorage.length,
        sale: sale,
      });
    }
  }

  changeAmount = (e) => {
    console.log("object");
    const { id } = e.target;
    const { name } = e.target.dataset;
    const { counter, itemsBag, symbol, total } = this.state;

    switch (name) {
      case "increment":
        this.setState((prevState) => ({
          arr: [...prevState.arr, id],
          quantity: prevState.quantity + 1,
        }));
        localStorage.setItem("qwe", JSON.stringify([...this.state.arr, id]));
        itemsBag.map((data) => {
          if (data.id === id) {
            data.prices.map((data) => {
              if (data.currency.symbol.trim() === symbol.trim()) {
                this.setState((prevState) => ({
                  total: prevState.total + data.amount,
                }));
              }
              return data;
            });
          }
          return total;
        });

        this.setState((prevState) => ({
          counter: prevState.counter + 1,
          sale: (prevState.total / 100) * 21,
        }));
        break;
      case "decrement":
        const res = JSON.parse(localStorage.getItem("qwe"));
        const resLocal = res.indexOf(id);
        res.splice(resLocal, 1);
        if (counter === 0) {
          localStorage.removeItem("qwe");
          return;
        }
        this.setState((prevState) => ({
          arr: res,
          quantity: prevState.quantity - 1,
        }));
        localStorage.setItem("qwe", JSON.stringify(res));
        itemsBag.map((data) => {
          if (data.id === id) {
            data.prices.map((data) => {
              if (data.currency.symbol.trim() === symbol.trim()) {
                this.setState((prevState) => ({
                  total: prevState.total - data.amount,
                }));
              }
              return data;
            });
          }
          return total;
        });
        this.setState((prevState) => ({
          counter: prevState.counter - 1,
          sale: (prevState.total / 100) * 21,
        }));
        break;

      default:
        return counter;
    }
  };

  selectActive = (e) => {
    const { id } = e.target;
    const { index } = e.target.dataset;
    const { name } = e.target.dataset;
    this.setState({
      active: index,
      activeId: id,
      activeAtribute: name,
    });
  };

  openCart = () => {
    this.props.toggle();
    this.props.toggleCart();
  };

  render() {
    const {
      itemsBag,
      symbol,
      total,
      active,
      activeId,
      activeAtribute,
      arr,
      activePageCart,
      quantity,
      sale,
    } = this.state;
    const { toggleCart } = this.props;
    return (
      <div className={activePageCart ? "" : "modal_container-bag"}>
        {itemsBag ? (
          <div className={activePageCart ? "container" : ""}>
            {activePageCart ? (
              <p className="cart_title">Cart</p>
            ) : (
              <p className="bag_title">
                <span>My bag,</span>
                {` ${itemsBag.length} items`}
              </p>
            )}

            <ul className="bag_list">
              {itemsBag.map(
                ({ name, brand, gallery, id, attributes, prices }) => {
                  return (
                    <li
                      key={v4()}
                      className={activePageCart ? "cart_item" : "bag_item"}
                    >
                      <div
                        className={!activePageCart ? "bag_container-info" : ""}
                        key={v4()}
                      >
                        <div
                          className={
                            activePageCart
                              ? "cart_denotation"
                              : "bag_denotation"
                          }
                        >
                          <p>{brand}</p>
                          <p>{name}</p>
                          <p>
                            {symbol.trim()}
                            {prices.map((data) => {
                              if (
                                data.currency.symbol.trim() === symbol.trim()
                              ) {
                                return data.amount;
                              }
                              return "";
                            })}
                          </p>
                        </div>

                        {attributes.map((dataAtr) => {
                          return (
                            <div key={v4()}>
                              <p
                                className={
                                  activePageCart ? "cart_options" : "options"
                                }
                              >
                                {dataAtr.id}:
                              </p>
                              <div className="options_container" key={v4()}>
                                {dataAtr.items.map((dataItem, i) => {
                                  if (dataAtr.id === "Color") {
                                    return (
                                      <>
                                        {activePageCart ? (
                                          <button
                                            className={
                                              Number(active) === i &&
                                              activeId === id &&
                                              activeAtribute === dataAtr.id
                                                ? "cart_options-color--active"
                                                : "cart_options-color"
                                            }
                                            key={v4()}
                                            onClick={this.selectActive}
                                          >
                                            <div
                                              data-index={i}
                                              data-name={dataAtr.id}
                                              id={id}
                                              style={{
                                                backgroundColor: dataItem.value,
                                                width: "32px",
                                                height: "32px",
                                              }}
                                            ></div>
                                          </button>
                                        ) : (
                                          <button
                                            className={
                                              Number(active) === i &&
                                              activeId === id &&
                                              activeAtribute === dataAtr.id
                                                ? "options_color--active"
                                                : "options_color"
                                            }
                                            key={v4()}
                                            onClick={this.selectActive}
                                          >
                                            <div
                                              data-index={i}
                                              data-name={dataAtr.id}
                                              id={id}
                                              style={{
                                                backgroundColor: dataItem.value,
                                                width: "16px",
                                                height: "16px",
                                              }}
                                            ></div>
                                          </button>
                                        )}
                                      </>
                                    );
                                  }
                                  return (
                                    <>
                                      {activePageCart ? (
                                        <button
                                          className={
                                            Number(active) === i &&
                                            activeId === id &&
                                            activeAtribute === dataAtr.id
                                              ? "cart_change-options--active"
                                              : "cart_change-options"
                                          }
                                          key={v4()}
                                          onClick={this.selectActive}
                                          id={id}
                                          data-index={i}
                                          data-name={dataAtr.id}
                                        >
                                          {dataItem.value}
                                        </button>
                                      ) : (
                                        <button
                                          className={
                                            Number(active) === i &&
                                            activeId === id &&
                                            activeAtribute === dataAtr.id
                                              ? "bag_change-options--active"
                                              : "bag_change-options"
                                          }
                                          key={v4()}
                                          onClick={this.selectActive}
                                          id={id}
                                          data-index={i}
                                          data-name={dataAtr.id}
                                        >
                                          {dataItem.value}
                                        </button>
                                      )}
                                    </>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      {/* <div className="qwe"> */}
                      <div
                        className={
                          activePageCart
                            ? "cart_container-counter"
                            : "bag_container-counter"
                        }
                        key={v4()}
                      >
                        <button
                          id={id}
                          data-name="increment"
                          onClick={this.changeAmount}
                        ></button>

                        <span>
                          {localStorage.getItem("qwe")
                            ? arr.reduce((acc, val) => {
                                if (id === val) {
                                  acc += 1;
                                }
                                return acc;
                              }, 1)
                            : 1}
                        </span>
                        <button
                          id={id}
                          data-name="decrement"
                          onClick={this.changeAmount}
                        ></button>
                      </div>
                      {activePageCart ? (
                        // <div className="cart_container-img" key={v4()}>
                        <img
                          src={gallery}
                          alt="Item in bag"
                          width="200px"
                          height="auto"
                        />
                      ) : (
                        // </div>
                        // <div className="asd" key={v4()}>
                        <img
                          src={gallery}
                          alt="Item in bag"
                          width="121"
                          height="auto"
                        />
                        // </div>
                      )}
                      {/* </div> */}
                    </li>
                  );
                }
              )}
            </ul>
            {/* <> */}
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
                  <button onClick={this.openCart}>View bag</button>
                  <button>CHECK OUT</button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>Корзина пуста</div>
        )}
      </div>
    );
  }
}
