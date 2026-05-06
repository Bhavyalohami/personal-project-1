const configuredBaseUrl =
  process.env.REACT_APP_API_BASE_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://asia-south1-clinic-appointment-booki-15481.cloudfunctions.net/api/"
    : "http://127.0.0.1:5050/");

const BaseUrl = configuredBaseUrl.endsWith("/")
  ? configuredBaseUrl
  : `${configuredBaseUrl}/`;

export default BaseUrl;
