import cors from "cors";

export default cors({
  origin: ["http://localhost:3000", "*"],
  methods: ["PUT", "DELETE", "POST", "GET", "PATCH"],
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
  ],
  credentials: true,
});
