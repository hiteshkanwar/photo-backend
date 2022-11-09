import express from "express";
import fetch from "node-fetch";

// Express Initialize
const app = express();

app.get("/", async (req, res) => {
  const result = await getPhotoData(req.query.query, req.query.per_page);
  //   console.log(1111, result);
  res.send({ result });
});

async function getPhotoData(query, per_page) {
  const url1 = `https://api.pexels.com/v1/search?query=${query}&per_page=${5}`;
  const url2 = `https://api.unsplash.com/photos/random?query=${query}&client_id=q4EWlt63wsAkbIbsZm1b8oggduoL6OmrJ-iDEnKhwCo&count=4`;

  const headers = {
    Authorization: "563492ad6f91700001000001429a36bd1bb24659933594c131ab9fdc",
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

  console.log(222, newData2.length);

  console.log(111, updatedData);

  let res = {};

  res["photos"] = updatedData;
  res["page"] = per_page;
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
