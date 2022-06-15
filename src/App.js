// import { Route, Routes } from "react-router-dom";
import { Component } from "react";
import Header from "./components/header";
import HomePage from "./components/homePage";

class App extends Component {
  state = {
    symbol: "",
    modalBag: false,
    itemsBag: null,
    pageItem: false,
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
    this.setState({ modalBag: !this.state.modalBag });
  };

  addCounterBag = (arrItem) => {
    this.setState({ itemsBag: arrItem.length });
  };

  render() {
    const { symbol, modalBag, itemsBag } = this.state;
    console.log(symbol);
    return (
      <div className="App">
        <Header
          changeSymbol={this.changeSymbol}
          modalBag={this.toggleModalBasket}
          counter={itemsBag}
        />
        <HomePage
          symbolCard={symbol}
          modalBag={modalBag}
          toggle={this.toggleModalBasket}
          countBag={(i) => this.addCounterBag(i)}
        />
      </div>
    );
  }
}

export default App;
