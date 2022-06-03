import { Component } from "react";
// import { v4 } from "uuid";
import { PRODUCT } from "./Api";
import Basket from "../images/Basket_card.svg";
import { client } from "../index";
import Notiflix from "notiflix";

export default class HomePage extends Component {
  state = {
    showBasker: false,
    productAll: [],
    id: "",
    priceHomePage: [],
    activeS: "",
  };

  async componentDidMount() {
    const activeCur = localStorage.getItem("currencySymbol");
    this.setState({ activeS: activeCur });
    try {
      const result = await client.query({
        query: PRODUCT,
      });
      const qwe = result.data.category.products.map(
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
      this.setState({ productAll: qwe });

      for (let data of qwe) {
        data.price.map(({ amount, currency }) => {
          if (currency.symbol.trim() === this.state.activeS.trim()) {
            return this.setState((prevState) => {
              return prevState.priceHomePage.push(amount);
            });
          }
          return amount;
        });
      }
    } catch (error) {
      console.log(error.message);
      Notiflix.Notify.failure(`${error.message}`);
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

  render() {
    const { productAll, priceHomePage } = this.state;
    const { symbolCard } = this.props;
    return (
      <main className="container backdrop">
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
                            .filter((val, ind, arr) => arr.indexOf(val) === ind)
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
                      <button className="btn_add-basket">
                        <img src={Basket} alt="Add to basket" />
                      </button>
                    )}
                    {!inStock && <p className="gallery_out">OUT OF STOCK</p>}
                  </li>
                );
              }
            )}
        </ul>
      </main>
    );
  }
}
