const mongoose = require("mongoose");

const app = require("./app");

const { DB_HOST, PORT = 8000 } = process.env;

app.listen(3000, () => {
  console.log("Server running. Use our API on port: 3000");
});

mongoose
  .connect(DB_HOST)
  .then(() => {
    app.listen(PORT);
  })
  .catch((error) => console.log(error.message));
