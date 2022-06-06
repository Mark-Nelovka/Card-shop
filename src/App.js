// import { Route, Routes } from "react-router-dom";
import { Component } from "react";
import Header from "./components/header";
import HomePage from "./components/homePage";

class App extends Component {
  state = {
    symbol: "",
    modalBag: false,
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

  render() {
    const { symbol, modalBag } = this.state;
    return (
      <div className="App">
        <Header
          changeSymbol={this.changeSymbol}
          modalBag={this.toggleModalBasket}
        />
        <HomePage symbolCard={symbol} modalBag={modalBag} />
      </div>
    );
  }
}

export default App;

// query {
//   product (id: "huarache-x-stussy-le") {
//     inStock
//   }
// category {
//   products {
//     id
//     description
//     brand
//     name
//     inStock
//     gallery
//     category
//     attributes{
//       items{
//         id
//         value
//         displayValue
//       }
//     }
//     prices{
//       amount
//       currency{
//         label
//         symbol
//       }
//     }
//   }
// }
//   }
