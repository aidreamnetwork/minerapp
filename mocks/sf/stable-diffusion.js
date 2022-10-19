const fetch = require("node-fetch");
const delay = require("./delay");
const ipfs = require("./ipfs")

module.exports = async function generate(prompt) {
  const config = {
    censor_nsfw: true,
    nsfw: false,
    params: {
      cfg_scale: 7.5,
      height: 512,
      n: 1,
      sampler_name: "k_dpm_2",
      seed: "",
      steps: 25,
      width: 512,
    },
    prompt: prompt,
    trusted_workers: true,
  };
  const response = await fetch(
    "https://arthub-gen-worker.repalash.workers.dev/api/v1/generate",
    {
      headers: {
        accept: "*/*",
        "accept-language": "en-US,en;q=0.9",
        authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNjY1ODA5MjI5LCJzdWIiOiIxNTYyNTg2Mi03ZWI2LTQyMjQtODQ1ZC00NzQ3NzA4Yjg1ZmYiLCJlbWFpbCI6InJlZHBhbnRoZXJjb2RlQGdtYWlsLmNvbSIsInBob25lIjoiIiwiYXBwX21ldGFkYXRhIjp7InByb3ZpZGVyIjoiZ2l0aHViIiwicHJvdmlkZXJzIjpbImdpdGh1YiJdfSwidXNlcl9tZXRhZGF0YSI6eyJhdmF0YXJfdXJsIjoiaHR0cHM6Ly9hdmF0YXJzLmdpdGh1YnVzZXJjb250ZW50LmNvbS91LzkyMjA0NTU4P3Y9NCIsImVtYWlsIjoicmVkcGFudGhlcmNvZGVAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZ1bGxfbmFtZSI6IlJlZCBQYW50aGVyIiwiaXNzIjoiaHR0cHM6Ly9hcGkuZ2l0aHViLmNvbSIsIm5hbWUiOiJSZWQgUGFudGhlciIsInByZWZlcnJlZF91c2VybmFtZSI6InJlZHBhbnRoZXJjb2RlIiwicHJvdmlkZXJfaWQiOiI5MjIwNDU1OCIsInN1YiI6IjkyMjA0NTU4IiwidXNlcl9uYW1lIjoicmVkcGFudGhlcmNvZGUifSwicm9sZSI6ImF1dGhlbnRpY2F0ZWQiLCJzZXNzaW9uX2lkIjoiYmY3MGQ1NmYtNDRhYi00ODIwLWI5ODctYzZhZjQ0Njk2NDVlIn0.gJEsOjkdGgRBQQ2FRSqkFF8XLl0pB-XfNAM1spvPcvM",
        "content-type": "application/json",
        "sec-ch-ua":
          '"Chromium";v="106", "Google Chrome";v="106", "Not;A=Brand";v="99"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"macOS"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "cross-site",
        Referer: "https://arthub.ai/",
        "Referrer-Policy": "strict-origin-when-cross-origin",
      },
      body: JSON.stringify(config),
      method: "POST",
    }
  );
  const data = await response.json();
  console.log(data);
  //check id untill return image
  const id = data.id;

  //17966889-27a3-4b6d-b5be-145f586bb1f3
  let imgUrl = "";
  let dataCheck;
  do {
    const responseCheck = await fetch(
      "https://arthub-gen-worker.repalash.workers.dev/api/v1/check/" + id,
      {
        method: "GET",
      }
    );
    dataCheck = await responseCheck.json();
    console.log(dataCheck);
    if (dataCheck?.generations) {
      imgUrl = dataCheck?.generations[0]?.img;
    }
    console.log(`Wait ${dataCheck.wait_time}s to get img`)
    await delay(dataCheck.wait_time);
  } while (!dataCheck.done);
  let cid =  await ipfs(imgUrl);
  console.log(`https://${cid}.ipfs.nftstorage.link/`)
  return cid;
};
