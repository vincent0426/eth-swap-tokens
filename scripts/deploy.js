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
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
