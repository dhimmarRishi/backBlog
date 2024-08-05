const express = require("express");
const cors = require("cors");
require("./connect");
const app = express();
const authRouter = require("./routes/account");
const blogRouter = require("./routes/blog");
const tokenMiddleware = require("./middlewares/auth")

app.use(express.json());
// app.use(cors({ origin: "https://themarkblogr.netlify.app" }));
app.use(cors({ origin: "http://localhost:3000" }));

app.use("/api/account", authRouter);
app.use("/api/blog",tokenMiddleware,blogRouter);

app.get("/test", (req, res) => {
  res.send("working");
});

app.listen(5050, () => {
  console.log("Server on port : " + 5050);
});
