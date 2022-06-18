import { Component } from "react";
import { v4 } from "uuid";

export default class Atrributes extends Component {
  render() {
    const {
      attributes,
      // saveAtrributeArr,
      selectActive,
      activePageCart,
      // arrAtrributes,
      id,
    } = this.props;

    return (
      <>
        {attributes.map((atr) => {
          return (
            <div key={v4()}>
              <p className={activePageCart ? "cart_options" : "options"}>
                {atr.id}:
              </p>
              <div className="options_container" key={v4()}>
                {atr.items.map(({ uniqueIdForButton, items }) => {
                  if (atr.id === "Color") {
                    return (
                      <>
                        {activePageCart ? (
                          <button
                            className={
                              uniqueIdForButton
                                ? // saveAtrributeArr.includes(uniqueIdForButton)
                                  "cart_options-color--active"
                                : "cart_options-color"
                            }
                            onClick={selectActive}
                          >
                            <div
                              data-atr={atr.id}
                              data-value={items.value}
                              id={id}
                              // data-unique={uniqueIdForButton}
                              style={{
                                backgroundColor: items.value,
                                width: "32px",
                                height: "32px",
                              }}
                            ></div>
                          </button>
                        ) : (
                          <button
                            className={
                              uniqueIdForButton
                                ? // arrAtrributes.includes(uniqueIdForButton)
                                  "options_color--active"
                                : "options_color"
                            }
                            onClick={selectActive}
                          >
                            <div
                              data-atr={atr.id}
                              data-value={items.value}
                              // data-unique={uniqueIdForButton}
                              id={id}
                              style={{
                                backgroundColor: items.value,
                                width: "16px",
                                height: "16px",
                              }}
                            ></div>
                          </button>
                        )}
                      </>
                    );
                  }
                  return (
                    <>
                      {activePageCart ? (
                        <button
                          className={
                            uniqueIdForButton
                              ? // saveAtrributeArr.includes(uniqueIdForButton)
                                "cart_change-options--active"
                              : "cart_change-options"
                          }
                          onClick={selectActive}
                          // data-unique={uniqueIdForButton}
                          data-atr={atr.id}
                          data-value={items.value}
                          id={id}
                        >
                          {items.value}
                        </button>
                      ) : (
                        <button
                          className={
                            uniqueIdForButton
                              ? // arrAtrributes.includes(uniqueIdForButton)
                                "bag_change-options--active"
                              : "bag_change-options"
                          }
                          key={v4()}
                          onClick={selectActive}
                          // data-unique={uniqueIdForButton}
                          data-atr={atr.id}
                          data-value={items.value}
                          id={id}
                        >
                          {items.value}
                        </button>
                      )}
                    </>
                  );
                })}
              </div>
            </div>
          );
        })}
      </>
    );
  }
}
