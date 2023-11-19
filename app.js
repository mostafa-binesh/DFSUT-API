const express = require("express");
const bodyParser = require("body-parser");
const crypto = require("crypto");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.static('public'));
app.get("/", (req, res) => {
  res.render("index");
});

app.post("/getData", upload.none(),  async (req, res) => {
  try {
    const currentUnixTime = Math.floor(Date.now() / 1000);
    const partnerId = req.body.partner_id;
    const secretKey = req.body.secret_key;
    const takeAfter = req.body.take_after;
    const maxBuy = req.body.max_buy;
    const minBuy = req.body.min_buy;
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = crypto
      .createHash("md5")
      .update(`${partnerId}${secretKey}${timestamp}`)
      .digest("hex");
    const consoleValue = req.body.console;
    const gameYear = req.body.game_year;
    console.log('object :>> ', req.body);
    if (!req.body.partner_id) {
      res.status(500).json({ data: "data" });
    }
    // Your API call logic here
    // ...
    // Make the API call
    const apiUrl = `https://dsfut.net/api/${gameYear}/${consoleValue}/${partnerId}/${timestamp}/${signature}`;
    const response = await fetch(apiUrl);
    if (response.ok) {
      const data = await response.json();
      // Process the API response data as needed
      console.log("API Response:", data);
      res.json(data);
    } else {
        res.status(500).json({ error: `API request failed with status: ${response.status} | url: ${apiUrl}` });
    }

    // const data = { example_key: 'example_value' }; // Replace with actual data from your API response

    // res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
