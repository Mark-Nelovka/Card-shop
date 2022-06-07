import { Component } from "react";
import { v4 } from "uuid";

export default class ModalBag extends Component {
  state = {
    itemsBag: null,
    symbol: this.props.symbol,
    total: 0,
  };

  componentDidMount() {
    const { total, symbol } = this.state;

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

  render() {
    const { itemsBag, symbol, total } = this.state;
    return (
      <div className="modal_container-bag">
        {itemsBag ? (
          <div>
            <p className="bag_title">
              <span>My bag,</span>
              {` ${itemsBag.length} items`}
            </p>
            <ul>
              {itemsBag.map(
                ({ name, brand, gallery, id, attributes, prices }) => {
                  return (
                    <li key={id}>
                      <p>{brand}</p>
                      <p>{name}</p>
                      <p>
                        {symbol}
                        {prices.map((data) => {
                          if (data.currency.symbol.trim() === symbol.trim()) {
                            return data.amount;
                          }
                          return "";
                        })}
                      </p>
                      {attributes.map((dataAtr) => {
                        return (
                          <div key={v4()}>
                            <p>{dataAtr.id}:</p>
                            <div>
                              {dataAtr.items.map((dataItem) => {
                                if (dataAtr.id === "Color") {
                                  return (
                                    <div
                                      key={v4()}
                                      style={{
                                        backgroundColor: dataItem.value,
                                        width: "20px",
                                        height: "20px",
                                      }}
                                    ></div>
                                  );
                                }
                                return <p key={v4()}>{dataItem.value}</p>;
                              })}
                            </div>
                          </div>
                        );
                      })}
                      <div>
                        <button>+</button>
                        <span>1</span>
                        <button>-</button>
                      </div>
                      <div>
                        <img
                          src={gallery}
                          alt="Item in bag"
                          width="121px"
                          height="190px"
                        />
                      </div>
                    </li>
                  );
                }
              )}
            </ul>
            <p>Total: {total}</p>
            <div>
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
