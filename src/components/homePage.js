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
    cartPage: false,
    currentItem: null,
    category: [],
    currentCategory: null,
  };

  async componentDidMount() {
    const activeCurrencies = localStorage.getItem("currencySymbol");
    const bagCounter = JSON.parse(localStorage.getItem("productItems"));
    const productInStock = [];
    const productInStockF = [];
    if (bagCounter) {
      this.setState({ bag: bagCounter });
    }
    const result = await fetchProduct.getAllProduct();
    const productsAll = result.map(
      ({ gallery, id, name, prices, brand, inStock, category }) => {
        const obj = {
          product: gallery[0],
          id: id,
          name,
          brand,
          price: prices,
          inStock,
          category,
        };
        return obj;
      }
    );

    for (let res of productsAll) {
      if (!res.inStock) {
        productInStockF.push(res);
      } else {
        productInStock.push(res);
      }
    }
    const products = productInStock.concat(productInStockF);

    const category = products
      .map(({ category }) => {
        return category[0].toUpperCase() + category.slice(1);
      })
      .filter((v, i, a) => a.indexOf(v) === i);
    this.setState({
      productAll: products,
      activeSymbol: activeCurrencies,
      category: category,
      currentCategory: category[0],
    });

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

  componentDidUpdate(_, state) {
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

  getId = (e) => {
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

  decrementBag = async (arr) => {
    localStorage.setItem("productItems", JSON.stringify(arr));
    this.setState({ bag: arr });
    this.props.countBag(arr);
  };

  addBag = async (e) => {
    const { id } = this.state;
    const { btn } = e.target.dataset;
    if (btn === undefined) {
      this.setState({ currentItem: null });
    }
    const { bag } = this.state;
    const productId = await fetchProduct.getProductId(id);
    localStorage.setItem(
      "productItems",
      JSON.stringify([...productId, ...bag])
    );
    this.setState((prevState) => ({
      bag: [...prevState.bag, ...productId],
    }));
    this.props.countBag([...productId, ...bag]);
  };

  toggleCart = () => {
    this.setState({ cartPage: !this.state.cartPage });
  };

  changeCategory = (e) => {
    const { category } = e.target.dataset;
    this.setState({ currentCategory: category });
  };

  render() {
    const {
      productAll,
      priceHomePage,
      cartPage,
      currentItem,
      activeSymbol,
      category,
      currentCategory,
      bag,
    } = this.state;
    const { symbolCard, modalBag, toggle } = this.props;
    return (
      <main>
        {!currentItem && !cartPage && (
          <>
            <div className={modalBag && bag.length > 0 ? "backdrop" : ""}></div>
            <div className="container">
              {category.length > 0 &&
                category.map((categoryName) => {
                  return (
                    <button
                      onClick={this.changeCategory}
                      data-category={categoryName}
                      key={v4()}
                      className="category-name"
                    >
                      {categoryName}
                    </button>
                  );
                })}
              <ul className="gallery_list">
                {productAll.length > 0 &&
                  productAll.map(
                    (
                      { product, id, name, price, brand, inStock, category },
                      inx
                    ) => {
                      if (category === currentCategory.toLowerCase()) {
                        return (
                          <li
                            onClick={this.getId}
                            onMouseOver={this.getId}
                            id={id}
                            className={
                              inStock
                                ? "gallery_item"
                                : "gallery_item--disabled"
                            }
                            key={v4()}
                          >
                            <img
                              height="330"
                              src={product}
                              alt="our products"
                            />

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
                                      (val, ind, arr) =>
                                        arr.indexOf(val) === ind
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
                            {id === this.state.id && inStock && !modalBag && (
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
                    }
                  )}
              </ul>
            </div>
          </>
        )}
        {modalBag && bag.length > 0 && (
          <ModalBag
            symbol={symbolCard}
            toggle={toggle}
            toggleCart={this.toggleCart}
            cart={cartPage}
            countBag={this.addBag}
            getId={this.getId}
            decrementBag={this.decrementBag}
          />
        )}
        {cartPage && (
          <ModalBag
            symbol={symbolCard}
            toggle={toggle}
            toggleCart={this.toggleCart}
            cart={cartPage}
            countBag={this.addBag}
            getId={this.getId}
            decrementBag={this.decrementBag}
          />
        )}
        {currentItem && (
          <ItemPage
            modalBag={modalBag}
            itemId={currentItem}
            currentSymbol={activeSymbol}
            addBag={this.addBag}
          />
        )}
      </main>
    );
  }
}
