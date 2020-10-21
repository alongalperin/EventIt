import axois from "axios";

export default axois.create({
  baseURL: process.env.VUE_APP_BASE_URL,
});
