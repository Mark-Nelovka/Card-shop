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
      this.setState({ total: price });
      return this.setState({ itemsBag: item });
    }
  }

  changeAmount = (e) => {
    const { textContent, id } = e.target;
    const { counter, itemsBag, symbol, total } = this.state;

    switch (textContent) {
      case "+":
        this.setState((prevState) => ({
          arr: [...prevState.arr, id],
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
        }));
        break;
      case "-":
        const res = JSON.parse(localStorage.getItem("qwe"));
        const resLocal = res.indexOf(id);
        res.splice(resLocal, 1);
        if (counter === 0) {
          localStorage.removeItem("qwe");
          return;
        }
        this.setState((prevState) => ({
          arr: res,
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

  render() {
    const { itemsBag, symbol, total, active, activeId, activeAtribute, arr } =
      this.state;
    return (
      <div className="modal_container-bag">
        {itemsBag ? (
          <div>
            <p className="bag_title">
              <span>My bag,</span>
              {` ${itemsBag.length} items`}
            </p>
            <ul className="bag_list">
              {itemsBag.map(
                ({
                  name,
                  brand,
                  gallery,
                  id,
                  attributes,
                  prices,
                  activeEl,
                }) => {
                  return (
                    <li key={id} className="bag_item">
                      <div className="bag_container-info">
                        <div className="bag_denotation">
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
                              <p className="options">{dataAtr.id}:</p>
                              <div className="options_container">
                                {dataAtr.items.map((dataItem, i) => {
                                  if (dataAtr.id === "Color") {
                                    return (
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
                                    );
                                  }
                                  return (
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
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="bag_container-counter">
                        <button id={id} onClick={this.changeAmount}>
                          +
                        </button>
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
                        <button id={id} onClick={this.changeAmount}>
                          -
                        </button>
                      </div>

                      <div>
                        <img
                          src={gallery}
                          alt="Item in bag"
                          width="121px"
                          height="auto"
                        />
                      </div>
                    </li>
                  );
                }
              )}
            </ul>
            <div className="bag_container-price">
              <p>Total</p>
              <p>
                {symbol.trim()}
                {total.toFixed(2)}
              </p>
            </div>

            <div className="bag_container-btn">
              <button>View bag</button>
              <button>CHECK OUT</button>
            </div>
          </div>
        ) : (
          <div>Корзина пуста</div>
        )}
      </div>
    );
  }
}
