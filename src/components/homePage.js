import { Component } from "react";
import { v4 } from "uuid";
import Basket from "../images/Basket_card.svg";
import ModalBag from "./modalBag";
import ItemPage from "./ItemPage";
import Api from "./Api";
const fetchProduct = new Api();

export default class HomePage extends Component {
  state = {
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
    if (activeCurrencies) {
      this.setState({ activeSymbol: activeCurrencies });
    }
    const bagCounter = JSON.parse(localStorage.getItem("productItems"));
    const productInStock = [];
    const productInStockF = [];
    if (bagCounter) {
      this.setState({ bag: bagCounter });
    }
    const result = await fetchProduct.getAllProduct();
    const productsAll = result.map(
      ({
        gallery,
        id,
        name,
        prices,
        brand,
        inStock,
        category,
        description,
      }) => {
        const obj = {
          product: gallery[0],
          id: id,
          name,
          brand,
          price: prices,
          inStock,
          category,
          description,
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
      category: category,
      currentCategory: category[0],
      activeSymbol: this.props.symbolCard,
    });

    for (let data of products) {
      data.price.map(({ amount, currency }) => {
        if (currency.symbol.trim() === this.props.symbolCard.trim()) {
          return this.setState((prevState) => ({
            priceHomePage: [...prevState.priceHomePage, amount],
          }));
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
    return;
  }

  getId = (e) => {
    const { id } = e.currentTarget;
    const { btn } = e.target.dataset;
    const { stock } = e.currentTarget.dataset;

    switch (e._reactName) {
      case "onMouseOver":
        if (id !== this.state.id) {
          this.setState({ id: id });
        }

        break;
      case "onMouseLeave":
        this.setState({ id: "" });

        break;
      case "onClick":
        if (stock === "false") {
          return;
        }
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

  incrementCountBag = async () => {
    const { id } = this.state;
    const { bag } = this.state;
    const productId = await fetchProduct.getProductId(id);
    const item = productId.map(
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
          gallery: gallery,
          id,
          attributes: attributesWithChange,
          prices,
          description,
        };
      }
    );
    const localArr = JSON.parse(localStorage.getItem("productItems"));

    localStorage.setItem(
      "productItems",
      JSON.stringify([...localArr, ...item])
    );
    this.setState((prevState) => ({
      bag: [...prevState.bag, ...item],
    }));
    this.props.countBag([...item, ...bag]);
  };

  addBag = async (e) => {
    const { id } = this.state;
    const { btn } = e.target.dataset;
    if (btn === undefined) {
      this.setState({ currentItem: null });
    }
    const { bag } = this.state;
    const productId = await fetchProduct.getProductId(id);
    const item = productId.map(
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
          gallery: gallery,
          id,
          attributes: attributesWithChange,
          prices,
          description,
        };
      }
    );

    localStorage.setItem("productItems", JSON.stringify([...bag, ...item]));

    this.setState((prevState) => ({
      bag: [...prevState.bag, ...item],
    }));
    this.props.countBag([...item, ...bag]);
  };

  toggleCart = () => {
    this.props.changePage();
    this.setState({
      cartPage: !this.state.cartPage,
    });
  };

  changeCategory = (e) => {
    const { category } = e.target.dataset;
    this.setState({ currentCategory: category });
  };

  saveWithItemCard = (array, idProduct) => {
    const localArr = JSON.parse(localStorage.getItem("productItems"));
    if (localArr) {
      if (localArr.find((q) => q.id === idProduct)) {
        const arrWithActiveAttributes = localArr.map((data) => {
          for (let a of array) {
            for (let o of a.attributes) {
              for (let v of data.attributes) {
                if (data.id === a.id) {
                  if (v.id === o.id) {
                    for (let j of v.items) {
                      for (let c of o.items) {
                        if (j.items.value === c.items.value) {
                          j.uniqueIdForButton = c.uniqueIdForButton;
                        }
                      }
                    }
                  }
                }
              }
            }
          }

          return data;
        });
        this.props.countBag([...array, ...this.state.bag]);
        this.setState((prevState) => ({
          bag: [...array, ...prevState.bag],
          currentItem: null,
        }));
        localStorage.setItem(
          "productItems",
          JSON.stringify([...arrWithActiveAttributes, ...array])
        );
        return;
      }
      this.props.countBag([...array, ...this.state.bag]);
      this.setState((prevState) => ({
        bag: [...array, ...prevState.bag],
        currentItem: null,
      }));
      localStorage.setItem(
        "productItems",
        JSON.stringify([...array, ...localArr])
      );

      return;
    }
    this.props.countBag([...array, ...this.state.bag]);
    this.setState((prevState) => ({
      bag: [...array, ...prevState.bag],
      currentItem: null,
    }));
    localStorage.setItem("productItems", JSON.stringify(array));
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
    const { symbolCard, modalBag, toggle, pageItem } = this.props;
    return (
      <main>
        {!currentItem && !cartPage && (
          <>
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
                            onMouseLeave={this.getId}
                            id={id}
                            data-stock={inStock}
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
                              {price.map((data) => {
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
                      return "";
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
            countBag={this.incrementCountBag}
            getId={this.getId}
            decrementBag={this.decrementBag}
            pageItem={pageItem}
          />
        )}
        {cartPage && (
          <ModalBag
            symbol={symbolCard}
            toggle={toggle}
            toggleCart={this.toggleCart}
            cart={cartPage}
            countBag={this.incrementCountBag}
            getId={this.getId}
            decrementBag={this.decrementBag}
            pageItem={pageItem}
          />
        )}
        {currentItem && (
          <ItemPage
            modalBag={modalBag}
            itemId={currentItem}
            currentSymbol={activeSymbol}
            addBag={this.addBag}
            saveWithItemCard={this.saveWithItemCard}
          />
        )}
      </main>
    );
  }
}
