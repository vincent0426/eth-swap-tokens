import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Navbar from "./components/Navbar";
import Main from "./components/Main";

import { Container } from "react-bootstrap";

import EthSwap from "./artifacts/contracts/EthSwap.sol/EthSwap.json";
import Token from "./artifacts/contracts/Token.sol/Token.json";

const tokenAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
const ethSwapAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";

const App = () => {
    const [account, setAccount] = useState("");
    // Contract
    const [ethSwap, setEthSwap] = useState({});
    const [token, setToken] = useState({});
    // Balance
    const [ethBalance, setEthBalance] = useState("0");
    const [tokenBalance, setTokenBalance] = useState("0");

    const [rate, setRate] = useState("0");

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getData = async () => {
            if (typeof window.ethereum !== "undefined") {
                const [account] = await window.ethereum.request({
                    method: "eth_requestAccounts",
                });
                setAccount(account);

                const provider = new ethers.providers.Web3Provider(
                    window.ethereum
                );
                const signer = provider.getSigner();
                const ethBalance = await provider.getBalance(account);
                setEthBalance(ethBalance.toString());

                const tokenContract = new ethers.Contract(
                    tokenAddress,
                    Token.abi,
                    signer
                );
                setToken(tokenContract);

                const tokenBalance = await tokenContract.balanceOf(account);
                setTokenBalance(tokenBalance.toString());

                const ethSwapContract = new ethers.Contract(
                    ethSwapAddress,
                    EthSwap.abi,
                    signer
                );
                setEthSwap(ethSwapContract);

                const rate = await ethSwapContract.rate();
                setRate(rate.toString());

                setLoading(false);
            }
        };

        getData();
    }, [token, ethSwap, rate]);

    return (
        <div>
            <Navbar account={account} />
            {loading ? (
                <h1 className="text-center">Loading...</h1>
            ) : (
                <Container>
                    <Main
                        ethSwap={ethSwap}
                        token={token}
                        ethBalance={
                            Math.round(
                                ethers.utils.formatEther(ethBalance) * 1e4
                            ) / 1e4
                        }
                        tokenBalance={
                            Math.round(
                                ethers.utils.formatEther(tokenBalance) * 1e4
                            ) / 1e4
                        }
                        rate={rate}
                        // buyTokens={buyTokens}
                    />
                </Container>
            )}
        </div>
    );
};

export default App;
