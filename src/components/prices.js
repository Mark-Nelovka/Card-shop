import { Component } from "react";

export default class Prices extends Component {
  render() {
    const { prices, symbol } = this.props;
    return (
      <>
        {prices.map(({ amount, currency }) => {
          if (currency.symbol.trim() === symbol.trim()) {
            return amount;
          }
          return "";
        })}
      </>
    );
  }
}
