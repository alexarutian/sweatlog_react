import React from "react";

const getStateValue = (deflt = "") => {
  const [value, set] = React.useState(deflt);

  return { value, set };
};

const getStateValueCollection = (defaults: any) => {
  let output = {};
  for (const id in defaults) {
    if (defaults.hasOwnProperty(id)) {
      output[id] = getStateValue(defaults[id]);
    }
  }
  return output;
};

export { getStateValue, getStateValueCollection };
