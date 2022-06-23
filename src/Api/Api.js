import { gql } from "@apollo/client";
import { client } from "../index";
import { Component } from "react";

export default class Api extends Component {
  getAllProduct = async () => {
    try {
      const products = await client.query({
        query: gql`
          query {
            category {
              products {
                id
                category
                gallery
                brand
                inStock
                description

                name
                prices {
                  amount
                  currency {
                    symbol
                  }
                }
              }
            }
          }
        `,
      });
      return products.data.category.products;
    } catch (error) {
      console.log(error.message);
    }
  };

  getProductId = async (id) => {
    try {
      const product = await client.query({
        query: gql`
          query {
            product(id: "${id}") {
              name
              brand
               description
               prices {
    amount
    currency {
      symbol
    }
  }
              gallery 
              id
              attributes {
                id
                items {
                  value
                }
              }
            }
          }
        `,
      });
      return [product.data.product];
    } catch (error) {
      console.log(error);
    }
  };

  getCurrencies = async () => {
    try {
      const currencies = await client.query({
        query: gql`
          query {
            currencies {
              label
              symbol
            }
          }
        `,
      });
      return currencies.data.currencies;
    } catch (error) {
      console.log(error);
    }
  };

  // getItemFromCategory = async () => {
  //   try {
  //     const items = await client.query({
  //       query: gql`
  //         query {
  //           category {
  //             products {
  //               id
  //               category
  //               gallery
  //               brand
  //               inStock
  //               description

  //               name
  //               prices {
  //                 amount
  //                 currency {
  //                   symbol
  //                 }
  //               }
  //             }
  //           }
  //         }
  //       `,
  //     });
  //     const asd = items.data.categories.filter((v) => v.name === "clothes");
  //     return asd;
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
}
