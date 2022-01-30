import React from "react";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import ethLogo from "../images/eth-logo.png";
import {
    Form,
    Card,
    Button,
    InputGroup,
    Image,
    Spinner,
} from "react-bootstrap";
import { IoSwapVerticalOutline } from "react-icons/io5";

const BuyForm = ({ ethSwap, ethBalance, tokenBalance, rate, onSwapClick }) => {
    const [ethAmount, setEthAmount] = useState("0");
    const [tokenAmount, setTokenAmount] = useState("0");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(false);
    }, [tokenBalance]);

    const onButtonClick = async (e) => {
        e.preventDefault();

        setLoading(true);
        try {
            await ethSwap.buyTokens({
                value: ethers.utils.parseEther(ethAmount),
            });
        } catch (err) {
            setLoading(false);
        }
    };

    return (
        <Card style={{ marginTop: 50 }}>
            <Card.Body>
                <Card.Title className="d-flex">
                    Buy DApp Tokens
                    <Button
                        onClick={() => {
                            onSwapClick();
                        }}
                        className="ms-auto"
                        variant="outline-secondary">
                        <IoSwapVerticalOutline />
                    </Button>
                </Card.Title>

                <Form>
                    <Form.Label htmlFor="ethAmount">ETH</Form.Label>
                    <Form.Text className="float-end">
                        Balance: {ethBalance}
                    </Form.Text>
                    <InputGroup className="mb-3">
                        <Form.Control
                            id="ethAmount"
                            type="number"
                            min="0"
                            placeholder="Enter ETH"
                            value={ethAmount}
                            onChange={(e) => {
                                setEthAmount(e.target.value);
                                setTokenAmount(e.target.value * rate);
                            }}
                        />

                        <InputGroup.Text weigth="20">
                            <Image height="15" src={ethLogo} />
                            ETH
                        </InputGroup.Text>
                    </InputGroup>

                    <Form.Label>DApp</Form.Label>
                    <Form.Text className="float-end">
                        Balance: {tokenBalance}
                    </Form.Text>
                    <InputGroup className="mb-3">
                        <Form.Control
                            type="number"
                            placeholder="0"
                            disabled
                            value={tokenAmount}
                        />
                        <InputGroup.Text id="basic-addon3">
                            DApp Tokens
                        </InputGroup.Text>
                    </InputGroup>
                    <div className="text-end mb-2">
                        <Form.Text>1 ETH = {rate} DApp Tokens</Form.Text>
                    </div>
                    <div className="d-grid">
                        <Button onClick={onButtonClick} variant="primary">
                            {loading ? (
                                <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                />
                            ) : (
                                <span>Swap</span>
                            )}
                        </Button>
                    </div>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default BuyForm;
