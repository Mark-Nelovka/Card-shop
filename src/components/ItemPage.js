import { Component } from "react";
import { v4 } from "uuid";
import Api from "./Api";
const fetchProduct = new Api();

export default class ItemPage extends Component {
  state = {
    item: null,
    price: 0,
    currentImage: null,
    active: null,
    activeId: null,
    activeAtribute: null,
  };

  async componentDidMount() {
    const fetchItem = await fetchProduct.getProductId(this.props.itemId);

    const item = fetchItem.map((data) => {
      return data.gallery[0];
    });

    this.setState({
      item: fetchItem,
      currentImage: item,
    });

    for (let data of fetchItem) {
      data.prices.map(({ amount, currency }) => {
        if (currency.symbol.trim() === this.props.currentSymbol.trim()) {
          return this.setState({ price: amount });
        }
        return amount;
      });
    }
  }

  choiseItem = (e) => {
    const { src } = e.currentTarget.dataset;
    this.setState({ currentImage: src });
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
    const { item, currentImage, active, activeAtribute, activeId } = this.state;
    const { currentSymbol } = this.props;
    return (
      <div className="container">
        <div className="item_container">
          <div className="container_photo">
            <ul className="item_list">
              {item &&
                item.map(({ gallery }) => {
                  return gallery.map((src) => {
                    return (
                      <li key={v4()} data-src={src} onClick={this.choiseItem}>
                        <img height="80" src={src} alt="Item" />
                      </li>
                    );
                  });
                })}
            </ul>
            {currentImage && (
              <div className="item_image">
                <img height="511" src={currentImage} alt="Current" />
              </div>
            )}
          </div>
          {item &&
            item.map(({ name, brand, id, attributes, prices, description }) => {
              return (
                <div key={v4()}>
                  <div className="item_container-info">
                    <p>{brand}</p>
                    <p>{name}</p>
                  </div>
                  {attributes.map((dataAtr) => {
                    return (
                      <div key={v4()}>
                        <p className="item_name-options">{dataAtr.id}:</p>
                        <div key={v4()}>
                          {dataAtr.items.map((dataItem, i) => {
                            if (dataAtr.id === "Color") {
                              return (
                                <button
                                  className={
                                    Number(active) === i &&
                                    activeId === id &&
                                    activeAtribute === dataAtr.id
                                      ? "item_options-color--active"
                                      : "item_options-color"
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
                              );
                            }
                            return (
                              <button
                                className={
                                  Number(active) === i &&
                                  activeId === id &&
                                  activeAtribute === dataAtr.id
                                    ? "item_change-options--active"
                                    : "item_change-options"
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
                  <div className="item_container-price">
                    <p>Price: </p>
                    <p>
                      {currentSymbol.trim()}
                      {prices.map((data) => {
                        if (
                          data.currency.symbol.trim() === currentSymbol.trim()
                        ) {
                          return data.amount;
                        }
                        return "";
                      })}
                    </p>
                  </div>
                  <button className="item_btn-add">ADD TO CART</button>
                  <div>{description}</div>
                </div>
              );
            })}
        </div>
      </div>
    );
  }
}
