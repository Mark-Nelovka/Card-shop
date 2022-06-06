import { Component } from "react";
// import { v4 } from "uuid";
import Basket from "../images/Basket_card.svg";
import ModalBag from "./modalBag";
import Api from "./Api";
const fetchProduct = new Api();

export default class HomePage extends Component {
  state = {
    showBasker: false,
    productAll: [],
    id: "",
    priceHomePage: [],
    activeS: "",
    bag: [],
  };

  async componentDidMount() {
    const activeCur = localStorage.getItem("currencySymbol");
    const qwe = JSON.parse(localStorage.getItem("qwe"));
    if (qwe) {
      this.setState({ bag: qwe });
    }
    this.setState({ activeS: activeCur });
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
        if (currency.symbol.trim() === this.state.activeS.trim()) {
          return this.setState((prevState) => {
            return prevState.priceHomePage.push(amount);
          });
        }
        return amount;
      });
    }
  }

  componentDidUpdate(prev, state) {
    if (state.activeS !== this.props.symbolCard) {
      state.activeS = this.props.symbolCard;
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
    switch (e._reactName) {
      case "onMouseOver":
        this.setState({ id: id });
        break;
      case "onMouseLeave":
        this.setState({ id: "" });
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
      return localStorage.setItem("qwe", JSON.stringify([...product, ...bag]));
    }
  };

  render() {
    const { productAll, priceHomePage, bag } = this.state;
    const { symbolCard, modalBag } = this.props;
    return (
      <main className="backdrop">
        <div className="container">
          <p className="category-name">Category name</p>
          <ul className="gallery_list">
            {productAll.length > 0 &&
              productAll.map(
                ({ product, id, name, price, brand, inStock }, inx) => {
                  return (
                    <li
                      onMouseOver={this.id}
                      onMouseLeave={this.id}
                      id={id}
                      className={
                        inStock ? "gallery_item" : "gallery_item--disabled"
                      }
                      key={id}
                    >
                      <img
                        width="354"
                        height="330"
                        src={product}
                        alt="our products"
                      />
                      <p
                        className={
                          inStock ? "gallery_brand" : "gallery_brand--disabled"
                        }
                      >
                        {brand}
                        {name}
                      </p>
                      <p
                        className={
                          inStock ? "gallery_price" : "gallery_price--disabled"
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
                                  // console.log(val);
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
                        >
                          <img src={Basket} alt="Add to basket" />
                        </button>
                      )}
                      {!inStock && <p className="gallery_out">OUT OF STOCK</p>}
                    </li>
                  );
                }
              )}
          </ul>
          {modalBag && <ModalBag items={bag} />}
        </div>
      </main>
    );
  }
}
