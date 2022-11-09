import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import {
  PEXEL_URL,
  UNSPLASH_URL,
  PEXEL_HEADER,
  UNSPLASH_CLIENT_ID,
} from "./variable.js";

// Express Initialize
const app = express();

const allowedOrigins = ["http://localhost:3000"];

const options = {
  origin: allowedOrigins,
};

app.use(cors(options));

app.use(express.json());

app.get("/", async (req, res) => {
  const result = await getPhotoData(req.query.query, req.query.per_page);
  //   console.log(1111, result);
  res.send({ result });
});

async function getPhotoData(query, per_page) {
  const url1 = `${PEXEL_URL}search?page=${per_page}&query=${query}&per_page=${5}`;
  const url2 = `${UNSPLASH_URL}photos/random?query=${query}&client_id=${UNSPLASH_CLIENT_ID}&count=4`;

  const headers = {
    Authorization: `${PEXEL_HEADER}`,
  };

  const responses = await Promise.all([fetch(url1, { headers }), fetch(url2)]);

  const data1 = await responses[0].json();
  const data2 = await responses[1].json();

  const newData2 = data2.map(
    ({ urls: src, alt_description: alt, ...rest }) => ({
      src,
      alt,
      ...rest,
    })
  );

  const updatedData = data1.photos.concat(newData2);

  let res = {};

  res["photos"] = updatedData;
  res["page"] = per_page;
  res["total_results"] = data1.total_results;
  res["per_page"] = updatedData.length;
  res["next_page"] = `localhost:8000?query=${query}&per_page=${
    parseInt(per_page) + 1
  }`;
  return res;
}

const port = 8000;
app.listen(port, () => {
  console.log("listen port 8000");
});
