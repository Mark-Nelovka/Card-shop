// import { Route, Routes } from "react-router-dom";
import { Component } from "react";
import Header from "./components/header";
import HomePage from "./components/homePage";

class App extends Component {
  state = {
    symbol: "",
  };

  componentDidMount() {
    const symbol = localStorage.getItem("currencySymbol");
    this.setState({ symbol: symbol });
  }

  changeSymbol = (symbol) => {
    this.setState({ symbol: symbol });
  };

  render() {
    const { symbol } = this.state;
    return (
      <div className="App">
        <Header changeSymbol={this.changeSymbol} />
        <HomePage symbolCard={symbol} />
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
