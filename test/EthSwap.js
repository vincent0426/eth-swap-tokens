const { expect } = require("chai");

describe("Contracts", () => {
    let Token;
    let EthSwap;
    let token;
    let ethSwap;
    let owner;
    let addr1;
    let addr2;
    let addrs;

    before(async function () {
        Token = await ethers.getContractFactory("Token");
        EthSwap = await ethers.getContractFactory("EthSwap");
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

        token = await Token.deploy();
        ethSwap = await EthSwap.deploy(token.address);
        await token.transfer(
            ethSwap.address,
            ethers.utils.parseEther("1000000")
        );
    });

    describe("Deployment", function () {
        it("Should set the right owner on token contract", async function () {
            expect(await token.owner()).to.equal(owner.address);
        });

        it("Should set the right owner on ethSwap contract", async function () {
            expect(await ethSwap.owner()).to.equal(owner.address);
        });

        it("Should assign the total supply of tokens to the contract", async function () {
            const balance = await token.balanceOf(ethSwap.address);
            expect(balance.toString()).to.equal(
                ethers.utils.parseEther("1000000")
            );
        });
    });

    describe("Buy tokens", async () => {
        // it("should fail since the pool doesn't have enough tokens", async () => {
        //     const supply = (await token.totalSupply()) + 1;
        //     await expect(ethSwap.connect(addr1).buyTokens({ value: supply })).to.be.revertedWith(
        //         "Sorry, the pool doesn't have enough tokens"
        //     );
        // });
        let result;
        it("Allows user to buy tokens from ethSwap", async () => {
            result = await ethSwap
                .connect(addr1)
                .buyTokens({ value: ethers.utils.parseEther("1") });
            const addr1TokensBalance = await token.balanceOf(addr1.address);
            expect(addr1TokensBalance.toString()).to.equal(
                ethers.utils.parseEther("100")
            );

            const rc = await result.wait();
            const event = rc.events.find(
                (event) => event.event === "TokensPurchased"
            ).args;

            expect(event.account).to.equal(addr1.address);
            expect(event.token).to.equal(token.address);
            expect(event.amount.toString(), ethers.utils.parseEther("100"));
            expect(event.rate.toString(), ethers.utils.parseEther("100"));
        });
    });

    describe("Sell Tokens", async () => {
        let result;
        it("Allows user to sell tokens from ethSwap", async () => {
            await token
                .connect(addr1)
                .approve(ethSwap.address, ethers.utils.parseEther("100"));
            result = await ethSwap
                .connect(addr1)
                .sellTokens(ethers.utils.parseEther("100"));
            const addr1TokensBalance = await token.balanceOf(addr1.address);
            expect(addr1TokensBalance.toString()).to.equal("0");

            const rc = await result.wait();
            const event = rc.events.find(
                (event) => event.event === "TokensSold"
            ).args;

            expect(event.account).to.equal(addr1.address);
            expect(event.token).to.equal(token.address);
            expect(event.amount.toString(), "1");
            expect(event.rate.toString(), ethers.utils.parseEther("100"));
        });
    });
});
