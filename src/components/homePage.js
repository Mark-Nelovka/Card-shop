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
    activePageCart: true,
    quantity: 0,
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
      this.setState({
        itemsBag: item,
        total: price,
        quantity: itemStorage.length,
      });
    }
  }

  changeAmount = (e) => {
    const { textContent, id } = e.target;
    const { counter, itemsBag, symbol, total } = this.state;

    switch (textContent) {
      case "+":
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
    } = this.state;
    return (
      <div className={activePageCart ? "" : "modal_container-bag"}>
        {itemsBag ? (
          <div className={activePageCart && "container"}>
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
                    <li
                      key={id}
                      className={activePageCart ? "cart_item" : "bag_item"}
                    >
                      <div className={!activePageCart && "bag_container-info"}>
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
                              <div className="options_container">
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
                      <div
                        className={
                          activePageCart
                            ? "cart_container-counter"
                            : "bag_container-counter"
                        }
                      >
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
                          width="200px"
                          height="288px"
                        />
                      </div>
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
                    <p>$42</p>
                    <p> {quantity}</p>
                    <p>{total.toFixed(2)}</p>
                  </div>
                </div>
                <button className="cart_btn-order">Order</button>
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
                  <button>View bag</button>
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

// import { Component } from "react";
// import Basket from "../images/Basket_card.svg";
// import ModalBag from "./modalBag";
// import Api from "./Api";
// const fetchProduct = new Api();

// export default class HomePage extends Component {
//   state = {
//     showBasker: false,
//     productAll: [],
//     id: "",
//     priceHomePage: [],
//     activeS: "",
//     bag: [],
//     activePageCart: false
//   };

//   async componentDidMount() {
//     const activeCur = localStorage.getItem("currencySymbol");
//     const qwe = JSON.parse(localStorage.getItem("qwe"));
//     if (qwe) {
//       this.setState({ bag: qwe });
//     }
//     this.setState({ activeS: activeCur });
//     const result = await fetchProduct.getAllProduct();
//     const products = result.map(
//       ({ gallery, id, name, prices, brand, inStock }) => {
//         const obj = {
//           product: gallery[0],
//           id: id,
//           name,
//           brand,
//           price: prices,
//           inStock,
//         };
//         return obj;
//       }
//     );
//     this.setState({ productAll: products });

//     for (let data of products) {
//       data.price.map(({ amount, currency }) => {
//         if (currency.symbol.trim() === this.state.activeS.trim()) {
//           return this.setState((prevState) => {
//             return prevState.priceHomePage.push(amount);
//           });
//         }
//         return amount;
//       });
//     }
//   }

//   componentDidUpdate(prev, state) {
//     if (state.activeS !== this.props.symbolCard) {
//       state.activeS = this.props.symbolCard;
//       if (state.priceHomePage.length > 0) {
//         state.priceHomePage = [];
//       }
//       for (let data of state.productAll) {
//         data.price.map(({ amount, currency }) => {
//           if (currency.symbol.trim() === this.props.symbolCard.trim()) {
//             return this.setState((prevState) => {
//               return prevState.priceHomePage.push(amount);
//             });
//           }
//           return amount;
//         });
//       }
//       return;
//     }
//   }

//   id = (e) => {
//     const { id } = e.currentTarget;
//     switch (e._reactName) {
//       case "onMouseOver":
//         this.setState({ id: id });
//         break;
//       case "onMouseLeave":
//         this.setState({ id: "" });
//         break;

//       default:
//         break;
//     }
//   };

//   addBag = async (e) => {
//     const { id } = e.currentTarget;
//     const { bag } = this.state;
//     const product = await fetchProduct.getProductId(id);
//     const unique = bag.find((val) => val.id === id);
//     if (!unique) {
//       this.setState((prevState) => ({
//         bag: [...prevState.bag, ...product],
//       }));
//       this.props.itemBag([...product, ...bag]);
//       return localStorage.setItem(
//         "productItems",
//         JSON.stringify([...product, ...bag])
//       );
//     }
//   };

//   render() {
//     const { productAll, priceHomePage } = this.state;
//     const { symbolCard, modalBag, toggle } = this.props;
//     return (
//       <main className="container">
//         <div className={modalBag ? "backdrop" : ""}></div>
//         <p className="category-name">Category name</p>
//         <ul className="gallery_list">
//           {productAll.length > 0 &&
//             productAll.map(
//               ({ product, id, name, price, brand, inStock }, inx) => {
//                 return (
//                   <li
//                     // onClick={this.qwe}
//                     onMouseOver={this.id}
//                     onMouseLeave={this.id}
//                     id={id}
//                     className={
//                       inStock ? "gallery_item" : "gallery_item--disabled"
//                     }
//                     key={id}
//                   >
//                     <img
//                       width="354"
//                       height="330"
//                       src={product}
//                       alt="our products"
//                     />
//                     <p
//                       className={
//                         inStock ? "gallery_brand" : "gallery_brand--disabled"
//                       }
//                     >
//                       {brand}
//                       {name}
//                     </p>
//                     <p
//                       className={
//                         inStock ? "gallery_price" : "gallery_price--disabled"
//                       }
//                     >
//                       {symbolCard}
//                       {productAll.length > 0 &&
//                         price.map((data) => {
//                           return priceHomePage
//                             .filter((val, ind, arr) => arr.indexOf(val) === ind)
//                             .find((val, ind) => {
//                               if (
//                                 inx === ind &&
//                                 val === data.amount &&
//                                 data.currency.symbol.trim() ===
//                                   symbolCard.trim()
//                               ) {
//                                 return val;
//                               }
//                               return null;
//                             });
//                         })}
//                     </p>
//                     {id === this.state.id && inStock && (
//                       <button
//                         id={id}
//                         onClick={this.addBag}
//                         className="btn_add-basket"
//                       >
//                         <img src={Basket} alt="Add to basket" />
//                       </button>
//                     )}
//                     {!inStock && <p className="gallery_out">OUT OF STOCK</p>}
//                   </li>
//                 );
//               }
//             )}
//         </ul>
//         {modalBag && <ModalBag symbol={symbolCard} toggle={toggle} />}
//       </main>
//     );
//   }
// }
