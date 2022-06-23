import { Component } from "react";
import Api from "../Api/Api";
const fetchCur = new Api();

export default class ChoiceCurrencyModal extends Component {
  state = {
    currencies: null,
  };

  toggleModalCur = (e) => {
    const { value } = e.target.classList;
    if (e.key === "Escape" || value === "container") {
      this.props.changeCurrency();
    }
    return;
  };

  componentWillUnmount() {
    window.removeEventListener("click", this.toggleModalCur);
    return window.removeEventListener("keydown", this.toggleModalCur);
  }

  async componentDidMount() {
    window.addEventListener("keydown", this.toggleModalCur);
    window.addEventListener("click", this.toggleModalCur);

    const currencies = await fetchCur.getCurrencies();

    this.setState({ currencies: currencies });
  }

  choise = (e) => {
    const { textContent } = e.target;
    const activeCurrency = textContent.split("", 2).join("");
    this.props.relevantCurrency(activeCurrency);
    this.props.changeCurrency();
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
