const property = {
  name: "",
  streetAddress: "",
  city: "",
};

export default (property, action) => {
  switch (action.type) {
    case "SET_PROPERTY":
      return { ...property, ...action.payload };
    case "RESET_PROPERTY":
      return {
        name: "",
        streetAddress: "",
        city: "",
      };
    default:
      return property;
  }
};
