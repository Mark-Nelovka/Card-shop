import { Component } from "react";
import { v4 } from "uuid";

export default class ModalBag extends Component {
  state = {
    itemsBag: null,
    symbol: this.props.symbol,
    total: 0,
    counter: 1,
    active: null,
    activeId: null,
  };

  componentDidMount() {
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
        itemsBag.map((data) => {
          if (data.id === id) {
            const prices = data.prices.map((data) => {
              if (data.currency.symbol.trim() === symbol.trim()) {
                this.setState((prevState) => ({
                  total: prevState.total + data.amount,
                }));
              }
            });
          }
          return total;
        });
        this.setState((prevState) => ({
          counter: prevState.counter + 1,
        }));
        break;
      case "-":
        if (counter < 2) {
          return;
        }
        itemsBag.map((data) => {
          if (data.id === id) {
            const prices = data.prices.map((data) => {
              if (data.currency.symbol.trim() === symbol.trim()) {
                this.setState((prevState) => ({
                  total: prevState.total - data.amount,
                }));
              }
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

    this.setState({
      active: index,
      activeId: id,
    });
  };

  render() {
    const { itemsBag, symbol, total, counter, active, activeId } = this.state;
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
                ({ name, brand, gallery, id, attributes, prices }) => {
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
                                    console.log(active);
                                    return (
                                      <button
                                        className={
                                          Number(active) === i &&
                                          activeId === id
                                            ? "options_color--active"
                                            : "options_color"
                                        }
                                        key={v4()}
                                        onClick={this.selectActive}
                                      >
                                        <div
                                          data-index={i}
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
                                        Number(active) === i && activeId === id
                                          ? "bag_change-options--active"
                                          : "bag_change-options "
                                      }
                                      key={v4()}
                                      onClick={this.selectActive}
                                      id={id}
                                      data-index={i}
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
                        <span>{counter}</span>
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
