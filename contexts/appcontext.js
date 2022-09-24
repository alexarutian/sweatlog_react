import React from "react";

const AppContext = React.createContext({
  value: { uninitialized: true },
  set: () => {},
});

export { AppContext };
