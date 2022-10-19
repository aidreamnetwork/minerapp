const { ethers, Wallet } = require("ethers");
require("dotenv").config();
const wombo = require("./mocks/wombo/womboai");
const ipfs = require("./utils/ipfs");

(async function main() {
  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC);
  console.log("--- Ai Dream Network Basic Miner Bridge ---");
  console.log(
    "+ Connect to blockchain: blocknum " + (await provider.getBlockNumber())
  );

  let wallet = new Wallet(process.env.MINER_PRIVATE_KEY, provider);
  console.log("+ Sigined Miner: " + wallet.address);
  console.log("+ Balance Miner: " + (await wallet.getBalance()));

  // The ERC-20 Contract ABI, which is a common contract interface
  // for tokens (this is the Human-Readable ABI format)
  const abi = require("./adn-connector.abi.json");

  // The Contract object
  const ADNConnector = new ethers.Contract(
    process.env.ADN_CONNECTOR_ADDRESS,
    abi,
    wallet
  );

  console.log("+ Task count: " + (await ADNConnector.taskCount()).toNumber());
  console.log("+ Start listening new task... ");
  ADNConnector.on("StartTask", async (from, taskId, prompt, value, time) => {
    console.log("------ New task detected ---------")
    console.log(`> ${ from } sent ${ (value) }, prompt ${ prompt}, at ${time}, with id ${taskId}`);
    let imgUrl = await wombo(prompt);
    let cid =  await ipfs(imgUrl);
    console.log(`https://${cid}.ipfs.nftstorage.link/`);
    let tx = await ADNConnector.postTask(taskId, cid);
    let confirm = await tx.wait();
    console.log("Tx confirmed")
    console.log("Tx: "+ confirm.transactionHash)
    console.log("------ End task ---------")

});

})();
