async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    console.log("Account balance:", (await deployer.getBalance()).toString());

    const Token = await ethers.getContractFactory("Token");
    const token = await Token.deploy();
    console.log("Token address:", token.address);

    const EthSwap = await ethers.getContractFactory("EthSwap");
    const ethSwap = await EthSwap.deploy(token.address);

    console.log("EthSwap address:", ethSwap.address);
    await token.transfer(ethSwap.address, ethers.utils.parseEther("1000000"));

    saveFrontendFiles(token, ethSwap);
}

function saveFrontendFiles(token, ethSwap) {
    const fs = require("fs");
    const tokenAddress =
        __dirname + "/../frontend/src/artifacts/contracts/Token.sol";

    if (!fs.existsSync(tokenAddress)) {
        fs.mkdirSync(tokenAddress);
    }

    fs.writeFileSync(
        tokenAddress + "/token-address.json",
        JSON.stringify({ Address: token.address }, undefined, 2)
    );

    const ethSwapAddress =
        __dirname + "/../frontend/src/artifacts/contracts/EthSwap.sol";

    if (!fs.existsSync(ethSwapAddress)) {
        fs.mkdirSync(ethSwapAddress);
    }

    fs.writeFileSync(
        ethSwapAddress + "/ethSwap-address.json",
        JSON.stringify({ Address: ethSwap.address }, undefined, 2)
    );
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
