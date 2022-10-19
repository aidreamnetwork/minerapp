
const fetch = require("node-fetch");
module.exports = async function check(id) {
 const responseCheck = await fetch(
    "https://arthub-gen-worker.repalash.workers.dev/api/v1/check/" + id,
    {
      method: "GET",
    }
  );
  //17966889-27a3-4b6d-b5be-145f586bb1f3
  const dataCheck = await responseCheck.json();
  console.log(dataCheck);
  return dataCheck;
}