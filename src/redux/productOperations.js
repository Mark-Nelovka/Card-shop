import Notiflix from "notiflix";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { gql } from "@apollo/client";
import { client } from "../index";

const fetchAll = createAsyncThunk("productAll", async () => {
  try {
    const qwe = await client.query({
      query: gql`
        query {
          category {
            products {
              gallery
              brand
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
    console.log(qwe);
  } catch (error) {
    Notiflix.Notify.failure(`${error.message}`);
  }
});

export { fetchAll };
