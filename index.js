require("dotenv").config();
const URL = require("url").URL;
let express = require("express");
const cors = require('cors');
let path = require("path");
let bodyParser = require("body-parser");

let app = express();

app.use(cors());

app.use("/public", express.static(path.join(__dirname, "public")));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const addressMap = new Map();

const stringIsAValidUrl = (s, protocols) => {
  try {
    url = new URL(s);
    return protocols
      ? url.protocol
        ? protocols.map((x) => `${x.toLowerCase()}:`).includes(url.protocol)
        : false
      : true;
  } catch (err) {
    return false;
  }
};

app.post("/api/shorturl", (req, res) => {
  if (stringIsAValidUrl(req.body.url, ["http", "https"])) {
    const key = addressMap.size + 1;
    addressMap[key] = req.body.url;
    const obj = { original_url: req.body.url, short_url: key };
    console.log(obj);

    res.json(obj);
  } else {
    res.json({ error: "invalid url" });
  }
});

app.get("/api/shorturl/:short_url", (req, res) => {
  console.log(addressMap[+req.params.short_url]);

  if (addressMap[+req.params.short_url]) {
    res.writeHead(302, { Location: addressMap[+req.params.short_url] });
    res.end();
  } else {
    res.status(404);
    res.end();
  }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
