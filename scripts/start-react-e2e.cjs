process.env.BROWSER = "none";
process.env.PORT = process.env.PORT || "3100";
process.env.REACT_APP_API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:5050/";

require("react-scripts/scripts/start");
