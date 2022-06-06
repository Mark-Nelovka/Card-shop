import { gql } from "@apollo/client";
import { client } from "../index";
import Notiflix from "notiflix";
import { Component } from "react";

export default class Api extends Component {
  getAllProduct = async () => {
    try {
      const result = await client.query({
        query: gql`
          query {
            category {
              products {
                id
                gallery
                brand
                inStock
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
      return result.data.category.products;
    } catch (error) {
      console.log(error.message);
      Notiflix.Notify.failure(`${error.message}`);
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
      Notiflix.Notify.failure(`${error.message}`);
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
      Notiflix.Notify.failure(`${error.message}`);
    }
  };
}
