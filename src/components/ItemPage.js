import { Component } from "react";
import { v4 } from "uuid";
import Api from "./Api";
const fetchProduct = new Api();

export default class ItemPage extends Component {
  state = {
    item: null,
    price: 0,
    currentImage: null,
    description: "",
    arrAtrributes: [],
  };

  async componentDidMount() {
    const fetchItem = await fetchProduct.getProductId(this.props.itemId);
    const itemId = fetchItem.map(
      ({ name, brand, gallery, id, prices, attributes, description }) => {
        const attributesWithChange = attributes.map((val) => {
          const itemsWithUniqueKey = [];

          for (let items of val.items) {
            itemsWithUniqueKey.push({
              uniqueIdForButton: v4(),
              items,
            });
          }
          return {
            id: val.id,
            items: itemsWithUniqueKey,
          };
        });
        return {
          name,
          brand,
          description,
          gallery,
          id,
          attributes: attributesWithChange,
          prices,
        };
      }
    );

    let item = null;
    for (let data of itemId) {
      const str = data.description.replace(/<\/?[^>]+(>|$)/g, "");
      item = {
        current: data.gallery[0],
        description: str,
      };
    }

    this.setState({
      item: itemId,
      currentImage: item.current,
      description: item.description,
    });

    for (let data of itemId) {
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
    const { unique } = e.target.dataset;

    if (this.state.arrAtrributes.includes(unique)) {
      const findUniqueKey = this.state.arrAtrributes.findIndex(
        (v) => v === unique
      );
      this.state.arrAtrributes.splice(findUniqueKey, 1);
      const state = this.state.arrAtrributes;
      this.setState({ arrAtrributes: state });
      return;
    }
    this.setState((prevState) => ({
      arrAtrributes: [...prevState.arrAtrributes, unique],
    }));
  };

  render() {
    const { item, currentImage, description, arrAtrributes } = this.state;
    const { currentSymbol, addBag, modalBag } = this.props;
    return (
      <div className="container">
        <div className={modalBag ? "backdrop" : ""}></div>
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
            item.map(({ name, brand, id, attributes, prices }) => {
              return (
                <div key={v4()}>
                  <div className="item_container-info">
                    <p>{brand}</p>
                    <p>{name}</p>
                  </div>
                  {attributes.map((atr) => {
                    return (
                      <div key={v4()}>
                        <p className="item_name-options">{atr.id}:</p>
                        <div key={v4()}>
                          {atr.items.map(({ uniqueIdForButton, items }) => {
                            if (atr.id === "Color") {
                              return (
                                <button
                                  className={
                                    arrAtrributes.includes(uniqueIdForButton)
                                      ? "item_options-color--active"
                                      : "item_options-color"
                                  }
                                  key={v4()}
                                  onClick={this.selectActive}
                                >
                                  <div
                                    data-unique={uniqueIdForButton}
                                    style={{
                                      backgroundColor: items.value,
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
                                  arrAtrributes.includes(uniqueIdForButton)
                                    ? "item_change-options--active"
                                    : "item_change-options"
                                }
                                key={v4()}
                                onClick={this.selectActive}
                                data-unique={uniqueIdForButton}
                              >
                                {items.value}
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
                      {prices.map(({ currency, amount }) => {
                        if (currency.symbol.trim() === currentSymbol.trim()) {
                          return amount;
                        }
                        return "";
                      })}
                    </p>
                  </div>
                  <button onClick={addBag} id={id} className="item_btn-add">
                    ADD TO CART
                  </button>
                  <p>{description}</p>
                </div>
              );
            })}
        </div>
      </div>
    );
  }
}
