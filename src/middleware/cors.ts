import cors from "cors";

export default cors({
  origin: "http://localhost:5000",
  credentials: true,
  methods: ["PUT", "DELETE", "POST", "GET", "PATCH"],
  /* allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
  ], */
});
