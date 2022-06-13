import React, { Component } from "react";
import { v4 } from "uuid";
import Api from "./Api";
const fetchProduct = new Api();
export default class ModalBag extends Component {
  state = {
    itemsBag: null,
    symbol: this.props.symbol,
    total: 0,
    // counter: 0,
    active: null,
    activeId: null,
    activeAtribute: null,
    // arr: [],
    activePageCart: this.props.cart,
    quantity: 0,
    sale: 0,
    bagCounter: null,
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
    const arr = [];
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

      for (let data of item) {
        const qwe = arr.find((v) => v.id === data.id);
        if (!qwe) {
          arr.push(data);
        }
      }
      const prices = item.flatMap((data) => {
        return data.prices;
      });

      const price = prices.reduce((acc, { amount, currency }) => {
        if (currency.symbol.trim() === symbol.trim()) {
          return (acc += amount);
        }
        return acc;
      }, 0);
      const sale = (price / 100) * 21;
      this.setState({
        itemsBag: arr,
        total: price,
        quantity: itemStorage.length,
        sale: sale,
        bagCounter: itemStorage,
      });
    }
  }

  changeAmount = async (e) => {
    const { id } = e.target;
    const { name } = e.target.dataset;
    const { counter, itemsBag, symbol, total } = this.state;

    switch (name) {
      case "increment":
        const addProduct = await fetchProduct.getProductId(id);
        localStorage.setItem(
          "productItems",
          JSON.stringify([...this.state.bagCounter, ...addProduct])
        );
        this.props.countBag(e);
        itemsBag.map((data) => {
          if (data.id === id) {
            data.prices.map(({ amount, currency }) => {
              if (currency.symbol.trim() === symbol.trim()) {
                this.setState((prevState) => ({
                  total: prevState.total + amount,
                }));
              }
              return data;
            });
          }
          return total;
        });

        this.setState((prevState) => ({
          // counter: prevState.counter + 1,
          sale: (prevState.total / 100) * 21,
          quantity: prevState.quantity + 1,
          bagCounter: [...prevState.bagCounter, ...addProduct],
        }));
        break;
      case "decrement":
        const uniqueId = [];
        const uniqueProduct = [];
        const arrBagCounter = JSON.parse(localStorage.getItem("productItems"));
        const bagLocalIndex = arrBagCounter.findIndex((v) => v.id === id);
        arrBagCounter.splice(bagLocalIndex, 1);
        const counterRepete = arrBagCounter.reduce((acc, val) => {
          if (id === val.id) {
            acc += 1;
          }
          return acc;
        }, 0);

        if (counterRepete === 0) {
          for (let data of arrBagCounter) {
            if (!uniqueId.includes(data.id)) {
              uniqueId.push(data.id);
              uniqueProduct.push(data);
            }
          }
          this.setState({ itemsBag: uniqueProduct });
        }
        if (arrBagCounter.length < 1) {
          if (this.props.cart) {
            this.props.toggleCart();
          } else {
            this.props.toggle();
          }
        }
        localStorage.setItem("productItems", JSON.stringify(arrBagCounter));
        this.props.decrementBag(arrBagCounter);
        itemsBag.map((data) => {
          if (data.id === id) {
            data.prices.map(({ amount, currency }) => {
              if (currency.symbol.trim() === symbol.trim()) {
                this.setState((prevState) => ({
                  total: prevState.total - amount,
                }));
              }
              return data;
            });
          }
          return total;
        });
        this.setState((prevState) => ({
          // counter: prevState.counter - 1,
          sale: (prevState.total / 100) * 21,
          quantity: prevState.quantity - 1,
          bagCounter: arrBagCounter,
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
      activePageCart,
      quantity,
      sale,
      bagCounter,
    } = this.state;
    const { toggleCart, getId } = this.props;
    return (
      <div className={activePageCart ? "" : "modal_container-bag"}>
        {itemsBag && itemsBag.length > 0 && (
          <div className={activePageCart ? "container" : ""}>
            {activePageCart ? (
              <p className="cart_title">Cart</p>
            ) : (
              <p className="bag_title">
                <span>My bag,</span>
                {` ${quantity} items`}
              </p>
            )}

            <ul className="bag_list">
              {itemsBag.map(
                ({ name, brand, gallery, id, attributes, prices }) => {
                  return (
                    <li
                      key={v4()}
                      className={activePageCart ? "cart_item" : "bag_item"}
                      id={id}
                      onMouseOver={getId}
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
                            {prices.map(({ amount, currency }) => {
                              if (currency.symbol.trim() === symbol.trim()) {
                                return amount;
                              }
                              return "";
                            })}
                          </p>
                        </div>

                        {attributes.map((atr) => {
                          return (
                            <div key={v4()}>
                              <p
                                className={
                                  activePageCart ? "cart_options" : "options"
                                }
                              >
                                {atr.id}:
                              </p>
                              <div className="options_container" key={v4()}>
                                {atr.items.map(({ value }, i) => {
                                  if (atr.id === "Color") {
                                    return (
                                      <>
                                        {activePageCart ? (
                                          <button
                                            className={
                                              Number(active) === i &&
                                              activeId === id &&
                                              activeAtribute === atr.id
                                                ? "cart_options-color--active"
                                                : "cart_options-color"
                                            }
                                            key={v4()}
                                            onClick={this.selectActive}
                                          >
                                            <div
                                              data-index={i}
                                              data-name={atr.id}
                                              id={id}
                                              style={{
                                                backgroundColor: value,
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
                                              activeAtribute === atr.id
                                                ? "options_color--active"
                                                : "options_color"
                                            }
                                            key={v4()}
                                            onClick={this.selectActive}
                                          >
                                            <div
                                              data-index={i}
                                              data-name={atr.id}
                                              id={id}
                                              style={{
                                                backgroundColor: value,
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
                                            activeAtribute === atr.id
                                              ? "cart_change-options--active"
                                              : "cart_change-options"
                                          }
                                          key={v4()}
                                          onClick={this.selectActive}
                                          id={id}
                                          data-index={i}
                                          data-name={atr.id}
                                        >
                                          {value}
                                        </button>
                                      ) : (
                                        <button
                                          className={
                                            Number(active) === i &&
                                            activeId === id &&
                                            activeAtribute === atr.id
                                              ? "bag_change-options--active"
                                              : "bag_change-options"
                                          }
                                          key={v4()}
                                          onClick={this.selectActive}
                                          id={id}
                                          data-index={i}
                                          data-name={atr.id}
                                        >
                                          {value}
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
                      <div
                        id={id}
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

                        <span id={id}>
                          {localStorage.getItem("productItems")
                            ? bagCounter.reduce((acc, val) => {
                                if (id === val.id) {
                                  acc += 1;
                                }
                                return acc;
                              }, 0)
                            : 1}
                        </span>
                        <button
                          id={id}
                          data-name="decrement"
                          onClick={this.changeAmount}
                        ></button>
                      </div>
                      {activePageCart ? (
                        <img
                          src={gallery}
                          alt="Item in bag"
                          width="200px"
                          height="auto"
                        />
                      ) : (
                        <img
                          src={gallery}
                          alt="Item in bag"
                          width="121"
                          height="auto"
                        />
                      )}
                    </li>
                  );
                }
              )}
            </ul>
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
        )}
      </div>
    );
  }
}
