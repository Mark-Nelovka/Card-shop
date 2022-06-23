import { Component } from "react";
import Header from "./components/header";
import Clothes from "./components/Clothes";
import Tech from "./components/Tech";
import { Routes, Route } from "react-router-dom";

class App extends Component {
  state = {
    symbol: "",
    modalBag: false,
    itemsBag: null,
    pageItem: true,
  };

  componentDidMount() {
    const symbol = localStorage.getItem("currencySymbol");
    const counter = JSON.parse(localStorage.getItem("productItems"));
    if (counter) {
      this.setState({ itemsBag: counter.length });
    }
    if (!symbol) {
      this.setState({ symbol: "$" });
      return;
    }

    this.setState({ symbol: symbol });
  }

  changeSymbol = (symbol) => {
    this.setState({ symbol: symbol });
  };

  toggleModalBasket = () => {
    if (!this.state.pageItem) {
      return;
    }
    this.setState({ modalBag: !this.state.modalBag });
  };

  addCounterBag = (arrItem) => {
    this.setState({ itemsBag: arrItem.length });
  };

  changePage = () => {
    this.setState({ pageItem: !this.state.pageItem }); // *? разобраться зачем нужна эта функция. При комментировании не открывается модалка
  };

  render() {
    const { symbol, modalBag, itemsBag, pageItem } = this.state;
    const { history } = this.props;
    return (
      // <div className="App">
      <>
        <Header
          changeSymbol={this.changeSymbol}
          modalBag={this.toggleModalBasket}
          counter={itemsBag}
        />
        {/* <Suspense fallback={<h1>Loading...</h1>}> */}
        <Routes>
          <Route
            path="/Card-shop/clothes"
            element={
              <Clothes
                symbolCard={symbol}
                modalBag={modalBag}
                toggle={this.toggleModalBasket}
                countBag={(i) => this.addCounterBag(i)}
                changePage={this.changePage}
                pageItem={pageItem}
                history={history}
              />
            }
          />
          <Route
            history={history}
            path="/Card-shop/tech"
            element={
              <Tech
                symbolCard={symbol}
                modalBag={modalBag}
                toggle={this.toggleModalBasket}
                countBag={(i) => this.addCounterBag(i)}
                changePage={this.changePage}
                pageItem={pageItem}
                history={history}
              />
            }
          />
        </Routes>
        {/* </Suspense> */}
      </>
      // </div>
    );
  }
}

export default App;
