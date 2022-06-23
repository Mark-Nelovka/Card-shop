import { Component } from "react";
import { NavLink } from "react-router-dom";
import Logo from "../images/logo-transparent.svg";
import ArrowUp from "../images/arrow-up.svg";
import Basket from "../images/Empty-Cart.svg";
import ArrowDown from "../images/arrow-down.svg";
import ChoiceCurrencyModal from "./modalCurrency";
// import { createBrowserHistory } from "history";

// const history = createBrowserHistory();

export default class Header extends Component {
  state = {
    currencyModal: false,
    activeCurrency: "",
  };
  changeCurrency = () => {
    this.setState({ currencyModal: !this.state.currencyModal });
  };

  relevantCurrency = (relevant) => {
    this.setState({ activeCurrency: relevant });
    localStorage.setItem("currencySymbol", relevant);
    this.props.changeSymbol(relevant);
  };

  componentDidMount() {
    if (localStorage.getItem("currencySymbol")) {
      const active = localStorage.getItem("currencySymbol");
      this.setState({ activeCurrency: active });
      return;
    }
    this.setState({ activeCurrency: "$" });
  }

  toggleModalBag = () => {
    if (this.props.counter === null || this.props.counter === 0) {
      return;
    }
    this.props.modalBag();
  };

  render() {
    const { currencyModal, activeCurrency } = this.state;
    const { counter } = this.props;
    return (
      <header className="header">
        <div className="container">
          <div className="header_container">
            <nav className="nav">
              <ul className="nav_list">
                <li>
                  <NavLink
                    className={({ isActive }) =>
                      `${isActive ? "active" : "nav_link"}`
                    }
                    onClick={this.togglePage}
                    to="/Card-shop/clothes"
                  >
                    Clothes
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    className={({ isActive }) =>
                      `${isActive ? "active" : "nav_link"}`
                    }
                    to="/Card-shop/tech"
                    onClick={this.togglePage}
                  >
                    Tech
                  </NavLink>
                </li>
              </ul>
            </nav>
            <div className="logo_container">
              <img src={Logo} alt="Logo" className="logo" />
            </div>
            <div className="basket_container">
              <button onClick={this.changeCurrency} className="btn_currency">
                <span>{activeCurrency}</span>
                <img
                  className="arrow_down"
                  src={currencyModal ? ArrowUp : ArrowDown}
                  alt="Arrow up"
                />
              </button>

              <button onClick={this.toggleModalBag} className="btn_basket ">
                <img src={Basket} alt="Basket" />
                {counter > 0 && <div className="bag">{counter}</div>}
                {currencyModal && (
                  <ChoiceCurrencyModal
                    relevantCurrency={this.relevantCurrency}
                  />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>
    );
  }
}
