import React from "react";
import ReactDOM from "react-dom/client";
import "./sass/main.scss";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
// import { Provider } from "react-redux";
// import store, { persistor } from "./redux/store";
// import { PersistGate } from "redux-persist/integration/react";

import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

export const client = new ApolloClient({
  uri: "http://localhost:4000/",
  cache: new InMemoryCache(),
  connectToDevTools: true,
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      {/* <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}> */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
      {/* </PersistGate>
      </Provider> */}
    </ApolloProvider>
  </React.StrictMode>
);
