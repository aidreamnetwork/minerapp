const { NFTStorage, Blob } = require("nft.storage");
const dotenv = require("dotenv");
const fetch = require("node-fetch");

dotenv.config();

module.exports = async function (url) {
  const { NFT_STORE_API_KEY } = process.env;
  const res = await fetch(url);
  const blob = await res.blob();
  const client = new NFTStorage({ token: NFT_STORE_API_KEY });
  const cid = await client.storeBlob(blob);
  return cid;
};
