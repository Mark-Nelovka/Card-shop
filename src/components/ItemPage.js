import { Component } from "react";
import { v4 } from "uuid";
import Api from "./Api";
const fetchProduct = new Api();

export default class ItemPage extends Component {
  state = {
    item: null,
    currentImage: null,
    description: "",
  };

  async componentDidMount() {
    const getProductLocal = JSON.parse(localStorage.getItem("productItems"));
    if (
      getProductLocal &&
      getProductLocal.find((v) => v.id === this.props.itemId)
    ) {
      let item = null;
      for (let data of getProductLocal) {
        if (data.id === this.props.itemId) {
          const product = getProductLocal.find(
            (v) => v.id === this.props.itemId
          );
          const str = data.description.replace(/<\/?[^>]+(>|$)/g, "");
          item = {
            current: data.gallery[0],
            description: str,
          };
          this.setState({
            item: [product],
            currentImage: item.current,
            description: item.description,
          });
        }
      }

      return;
    }
    const fetchItem = await fetchProduct.getProductId(this.props.itemId);
    const itemId = fetchItem.map(
      ({ name, brand, gallery, id, prices, attributes, description }) => {
        const attributesWithChange = attributes.map((val) => {
          const itemsWithUniqueKey = [];

          for (let items of val.items) {
            itemsWithUniqueKey.push({
              uniqueIdForButton: false,
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
  }

  choiseItem = (e) => {
    const { src } = e.currentTarget.dataset;
    this.setState({ currentImage: src });
  };

  selectActive = (e) => {
    const { id } = e.target;
    const { atr } = e.target.dataset;
    const { value } = e.target.dataset;
    const { item } = this.state;
    const arrWithActiveAttributes = item.map((data) => {
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

    this.setState({ items: arrWithActiveAttributes });
  };

  pushToLocal = (e) => {
    const { item } = this.state;
    const { id } = e.target;
    this.props.saveWithItemCard(item, id);
  };

  render() {
    const { item, currentImage, description } = this.state;
    const { currentSymbol, modalBag } = this.props;
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
                                    uniqueIdForButton
                                      ? "item_options-color--active"
                                      : "item_options-color"
                                  }
                                  key={v4()}
                                  onClick={this.selectActive}
                                >
                                  <div
                                    id={id}
                                    data-atr={atr.id}
                                    data-value={items.value}
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
                                  uniqueIdForButton
                                    ? "item_change-options--active"
                                    : "item_change-options"
                                }
                                key={v4()}
                                onClick={this.selectActive}
                                id={id}
                                data-atr={atr.id}
                                data-value={items.value}
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
                  <div onClick={this.pushToLocal}>
                    <button id={id} className="item_btn-add">
                      ADD TO CART
                    </button>
                  </div>

                  <p>{description}</p>
                </div>
              );
            })}
        </div>
      </div>
    );
  }
}
