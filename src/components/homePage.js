import { Component } from "react";
import { v4 } from "uuid";
import Basket from "../images/Basket_card.svg";
import ModalBag from "./modalBag";
import ItemPage from "./ItemPage";
import Api from "./Api";
const fetchProduct = new Api();

export default class HomePage extends Component {
  state = {
    showBasker: false,
    productAll: [],
    id: "",
    priceHomePage: [],
    activeSymbol: "",
    bag: [],
    activePageCart: false,
    cartPage: false,
    currentItem: null,
  };

  async componentDidMount() {
    const activeCurrencies = localStorage.getItem("currencySymbol");
    const qwe = JSON.parse(localStorage.getItem("qwe"));
    if (qwe) {
      this.setState({ bag: qwe });
    }
    this.setState({ activeSymbol: activeCurrencies });
    const result = await fetchProduct.getAllProduct();
    const products = result.map(
      ({ gallery, id, name, prices, brand, inStock }) => {
        const obj = {
          product: gallery[0],
          id: id,
          name,
          brand,
          price: prices,
          inStock,
        };
        return obj;
      }
    );
    this.setState({ productAll: products });

    for (let data of products) {
      data.price.map(({ amount, currency }) => {
        if (currency.symbol.trim() === this.state.activeSymbol.trim()) {
          return this.setState((prevState) => {
            return prevState.priceHomePage.push(amount);
          });
        }
        return amount;
      });
    }
  }

  componentDidUpdate(prev, state) {
    if (state.activeSymbol !== this.props.symbolCard) {
      state.activeSymbol = this.props.symbolCard;
      if (state.priceHomePage.length > 0) {
        state.priceHomePage = [];
      }
      for (let data of state.productAll) {
        data.price.map(({ amount, currency }) => {
          if (currency.symbol.trim() === this.props.symbolCard.trim()) {
            return this.setState((prevState) => {
              return prevState.priceHomePage.push(amount);
            });
          }
          return amount;
        });
      }
      return;
    }
  }

  id = (e) => {
    const { id } = e.currentTarget;
    const { btn } = e.target.dataset;

    switch (e._reactName) {
      case "onMouseOver":
        if (id !== this.state.id) {
          this.setState({ id: id });
        }
        break;
      case "onClick":
        if (btn === undefined) {
          this.setState({ currentItem: id });
        }

        break;

      default:
        break;
    }
  };

  addBag = async (e) => {
    const { id } = e.currentTarget;
    const { bag } = this.state;
    const product = await fetchProduct.getProductId(id);
    const unique = bag.find((val) => val.id === id);
    if (!unique) {
      this.setState((prevState) => ({
        bag: [...prevState.bag, ...product],
      }));
      this.props.countBag([...product, ...bag]);
      return localStorage.setItem(
        "productItems",
        JSON.stringify([...product, ...bag])
      );
    }
  };

  toggleCart = () => {
    this.setState({ cartPage: !this.state.cartPage });
  };

  render() {
    const { productAll, priceHomePage, cartPage, currentItem, activeSymbol } =
      this.state;
    const { symbolCard, modalBag, toggle } = this.props;
    return (
      <main>
        {cartPage && (
          <ModalBag
            symbol={symbolCard}
            toggle={toggle}
            toggleCart={this.toggleCart}
            cart={cartPage}
          />
        )}
        {!currentItem && !cartPage && (
          <>
            <div className={modalBag ? "backdrop" : ""}></div>
            <div className="container">
              <p className="category-name">Category name</p>
              <ul className="gallery_list">
                {productAll.length > 0 &&
                  productAll.map(
                    ({ product, id, name, price, brand, inStock }, inx) => {
                      return (
                        <li
                          onClick={this.id}
                          onMouseOver={this.id}
                          id={id}
                          className={
                            inStock ? "gallery_item" : "gallery_item--disabled"
                          }
                          key={v4()}
                        >
                          <img height="330" src={product} alt="our products" />

                          <p
                            className={
                              inStock
                                ? "gallery_brand"
                                : "gallery_brand--disabled"
                            }
                          >
                            {`${brand} ${name}`}
                          </p>
                          <p
                            className={
                              inStock
                                ? "gallery_price"
                                : "gallery_price--disabled"
                            }
                          >
                            {symbolCard}
                            {productAll.length > 0 &&
                              price.map((data) => {
                                return priceHomePage
                                  .filter(
                                    (val, ind, arr) => arr.indexOf(val) === ind
                                  )
                                  .find((val, ind) => {
                                    if (
                                      inx === ind &&
                                      val === data.amount &&
                                      data.currency.symbol.trim() ===
                                        symbolCard.trim()
                                    ) {
                                      return val;
                                    }
                                    return null;
                                  });
                              })}
                          </p>
                          {id === this.state.id && inStock && (
                            <button
                              id={id}
                              onClick={this.addBag}
                              className="btn_add-basket"
                              data-btn="button"
                            >
                              <img
                                src={Basket}
                                alt="Add to basket"
                                data-btn="button"
                              />
                            </button>
                          )}
                          {!inStock && (
                            <p className="gallery_out">OUT OF STOCK</p>
                          )}
                        </li>
                      );
                    }
                  )}
              </ul>
              {modalBag && !cartPage && (
                <ModalBag
                  symbol={symbolCard}
                  toggle={toggle}
                  toggleCart={this.toggleCart}
                  cart={cartPage}
                />
              )}
            </div>
          </>
        )}
        {currentItem && (
          <ItemPage
            itemId={currentItem}
            currentSymbol={activeSymbol}
            addBag={this.addBag}
          />
        )}
      </main>
    );
  }
}
