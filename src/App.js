import { Component } from "react";
import Header from "./components/header";
import HomePage from "./components/homePage";

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
    this.setState({ pageItem: !this.state.pageItem });
  };

  render() {
    const { symbol, modalBag, itemsBag, pageItem } = this.state;
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
          changePage={this.changePage}
          pageItem={pageItem}
        />
      </div>
    );
  }
}

export default App;
