// import { Route, Routes } from "react-router-dom";
import { Component } from "react";
import Header from "./components/header";
import HomePage from "./components/homePage";

class App extends Component {
  state = {
    symbol: "",
    modalBag: false,
    itemsBag: null,
  };

  componentDidMount() {
    const symbol = localStorage.getItem("currencySymbol");
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
    return (
      <div className="App">
        <Header
          changeSymbol={this.changeSymbol}
          modalBag={this.toggleModalBasket}
          counter={itemsBag}
        />
        <HomePage
          symbol={symbol}
          modalBag={modalBag}
          toggle={this.toggleModalBasket}
          itemBag={(i) => this.addCounterBag(i)}
        />
      </div>
    );
  }
}

export default App;
