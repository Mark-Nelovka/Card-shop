import { Component } from "react";

export default class ModalBag extends Component {
  state = {
    itemsBag: null,
    symbol: this.props.symbol,
  };

  componentDidMount() {
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
      return this.setState({ itemsBag: item });
    }
  }

  render() {
    const { itemsBag, symbol } = this.state;
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
                        {prices.map((data) => {
                          if (data.currency.symbol.trim() === symbol.trim()) {
                            return data.amount;
                          }
                          return "";
                        })}
                      </p>
                      {attributes.map((dataAtr) => {
                        return (
                          <div>
                            <p>{dataAtr.id}:</p>
                            <div>
                              {dataAtr.items.map((dataItem) => {
                                if (dataAtr.id === "Color") {
                                  return (
                                    <div
                                      style={{
                                        backgroundColor: dataItem.value,
                                        width: "20px",
                                        height: "20px",
                                      }}
                                    ></div>
                                  );
                                }
                                return <p>{dataItem.value}</p>;
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
          </div>
        ) : (
          <div>Корзина пуста</div>
        )}
      </div>
    );
  }
}
