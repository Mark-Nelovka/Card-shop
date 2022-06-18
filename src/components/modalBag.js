import Notiflix from "notiflix";
import React, { Component } from "react";
import Prices from "./prices";
import Atrributes from "./atrributes";
import Count from "./countAndImage";
import Total from "./total";
import { v4 } from "uuid";
import Api from "./Api";
const fetchProduct = new Api();
export default class ModalBag extends Component {
  state = {
    itemsBag: null,
    symbol: this.props.symbol,
    total: 0,
    arrAtrributes: [],
    activePageCart: this.props.cart,
    quantity: 0,
    sale: 0,
    bagCounter: null,
  };

  toggleBackdrop = (e) => {
    const { value } = e.target.classList;
    if (e.key === "Escape" || value === "backdrop") {
      return this.props.toggle();
    }
    return;
  };

  componentWillUnmount() {
    window.removeEventListener("click", this.toggleBackdrop);
    return window.removeEventListener("keydown", this.toggleBackdrop);
  }

  componentDidMount() {
    const arr = [];
    window.addEventListener("keydown", this.toggleBackdrop);
    window.addEventListener("click", this.toggleBackdrop);
    const { symbol } = this.state;

    const itemStorage = JSON.parse(localStorage.getItem("productItems"));
    if (itemStorage) {
      for (let data of itemStorage) {
        const uniqueArrForModal = arr.find((v) => v.id === data.id);
        if (!uniqueArrForModal) {
          arr.push(data);
        }
      }
      const prices = itemStorage.flatMap((data) => {
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
    return;
  }

  changeAmount = async (e) => {
    const { id } = e.target;
    const { name } = e.target.dataset;
    const { itemsBag, symbol, total } = this.state;

    switch (name) {
      case "increment":
        const addProduct = await fetchProduct.getProductId(id);
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
          Notiflix.Notify.success("Item has been removed from cart", {
            timeout: 1500,
          });
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
          sale: (prevState.total / 100) * 21,
          quantity: prevState.quantity - 1,
          bagCounter: arrBagCounter,
        }));
        break;

      default:
        break;
    }
  };

  selectActive = (e) => {
    const { id } = e.target;
    const { atr } = e.target.dataset;
    const { value } = e.target.dataset;
    const { itemsBag } = this.state;
    const arrWithActiveAttributes = itemsBag.map((data) => {
      for (let v of data.attributes) {
        if (data.id === id) {
          if (v.id === atr) {
            for (let j of v.items) {
              if (j.items.value === value) {
                j.uniqueIdForButton = !j.uniqueIdForButton;
              }
              if (j.items.value !== value) j.uniqueIdForButton = false;
            }
          }
        }
      }
      return data;
    });
    console.log(arrWithActiveAttributes);
    localStorage.setItem(
      "productItems",
      JSON.stringify(arrWithActiveAttributes)
    );
    this.setState({ itemsBag: arrWithActiveAttributes });
  };

  openCart = (e) => {
    const { textContent } = e.target;
    this.props.toggle();
    this.props.toggleCart(textContent);
  };

  render() {
    const {
      itemsBag,
      total,
      arrAtrributes,
      activePageCart,
      quantity,
      sale,
      bagCounter,
    } = this.state;
    const { toggleCart, getId, symbol, saveAtrributeArr } = this.props;
    return (
      <>
        <div className={!activePageCart ? "backdrop" : ""}></div>

        <div className={activePageCart ? "" : "modal_container-bag"}>
          {itemsBag && (
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
                          className={
                            !activePageCart ? "bag_container-info" : ""
                          }
                          key={v4()}
                        >
                          <div
                            key={v4()}
                            className={
                              activePageCart
                                ? "cart_denotation"
                                : "bag_denotation"
                            }
                          >
                            <p key={v4()}>{brand}</p>
                            <p key={v4()}>{name}</p>
                            <p key={v4()}>
                              {symbol.trim()}
                              <Prices prices={prices} symbol={symbol} />
                            </p>
                          </div>
                          {
                            <Atrributes
                              attributes={attributes}
                              saveAtrributeArr={saveAtrributeArr}
                              selectActive={this.selectActive}
                              activePageCart={activePageCart}
                              arrAtrributes={arrAtrributes}
                              id={id}
                            />
                          }
                        </div>
                        {
                          <Count
                            id={id}
                            activePageCart={activePageCart}
                            changeAmount={this.changeAmount}
                            bagCounter={bagCounter}
                            gallery={gallery}
                          />
                        }
                      </li>
                    );
                  }
                )}
              </ul>
              {
                <Total
                  activePageCart={activePageCart}
                  symbol={symbol}
                  sale={sale}
                  quantity={quantity}
                  total={total}
                  toggleCart={toggleCart}
                  openCart={this.openCart}
                />
              }
            </div>
          )}
        </div>
      </>
    );
  }
}
