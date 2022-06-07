import { Component } from "react";
import { NavLink } from "react-router-dom";
import Logo from "../images/logo-transparent.svg";
import ArrowUp from "../images/arrow-up.svg";
import Basket from "../images/Empty-Cart.svg";
import ArrowDown from "../images/arrow-down.svg";
import ChoiceCurrency from "./modalCurrency";

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
    this.props.modalBag();
  };

  render() {
    const { currencyModal, activeCurrency } = this.state;
    return (
      <header className="header">
        <div className="container">
          <div className="header_container">
            <nav className="nav">
              <ul className="nav_list">
                <li className="nav_item">
                  <NavLink
                    className={({ isActive }) =>
                      `${isActive ? "active" : "nav_link"}`
                    }
                    to="/Card-shop"
                  >
                    Women
                  </NavLink>
                </li>
                <li className="nav_item">
                  <NavLink
                    className={({ isActive }) =>
                      `${isActive ? "active" : "nav_link"}`
                    }
                    to="*"
                  >
                    Men
                  </NavLink>
                </li>
                <li className="nav_item">
                  <NavLink
                    className={({ isActive }) =>
                      `${isActive ? "active" : "nav_link"}`
                    }
                    to="*"
                  >
                    Kids
                  </NavLink>
                </li>
              </ul>
            </nav>
            <div className="container_logo">
              <img src={Logo} alt="Logo" className="logo" />
            </div>
            <div className="container_basket">
              <span>{activeCurrency}</span>

              <button onClick={this.changeCurrency} className="btn_arrow">
                <img
                  className="arrow_down"
                  src={currencyModal ? ArrowUp : ArrowDown}
                  alt="Arrow up"
                />
                {currencyModal && (
                  <ChoiceCurrency relevantCurrency={this.relevantCurrency} />
                )}
              </button>

              <button onClick={this.toggleModalBag} className="btn_basket ">
                <img src={Basket} alt="Basket" />
                {JSON.parse(localStorage.getItem("productItems")) && (
                  <div className="bag">
                    {JSON.parse(localStorage.getItem("productItems")).length}
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>
    );
  }
}
