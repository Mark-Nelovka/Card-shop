import { Component } from "react";
import { CURRENCIES } from "./Api";
import { client } from "../index";
import Notiflix from "notiflix";

export default class ChoiceCurrency extends Component {
  state = {
    currencies: null,
  };

  async componentDidMount() {
    try {
      const currenciesQ = await client.query({
        query: CURRENCIES,
      });
      this.setState({ currencies: currenciesQ.data.currencies });
    } catch (error) {
      Notiflix.Notify.failure(`${error.message}`);
    }
  }

  choise = (e) => {
    const { textContent } = e.target;
    const activeCurrency = textContent.split("", 2).join("");
    this.props.relevantCurrency(activeCurrency);
    return activeCurrency;
  };

  render() {
    const { currencies } = this.state;
    return (
      <ul className="currency_list">
        {currencies &&
          currencies.map(({ label, symbol }) => {
            return (
              <li onClick={this.choise} key={symbol} className="currency_item">
                {symbol} {label}
              </li>
            );
          })}
      </ul>
    );
  }
}
