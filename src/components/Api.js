import { gql } from "@apollo/client";

const PRODUCT = gql`
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
`;

const CURRENCIES = gql`
  query {
    currencies {
      label
      symbol
    }
  }
`;

export { PRODUCT, CURRENCIES };
