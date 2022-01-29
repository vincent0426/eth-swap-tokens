import { Container, Row, Col } from "react-bootstrap";
import { useState } from "react";

import BuyForm from "./BuyForm";
import SellForm from "./SellForm";

const Main = ({ ethSwap, token, ethBalance, tokenBalance, rate }) => {
    const [buyForm, setBuyForm] = useState(true);
    const onSwapClick = () => {
        setBuyForm(!buyForm);
    };
    return (
        <Container>
            <Row>
                <Col />
                <Col>
                    {buyForm ? (
                        <BuyForm
                            ethSwap={ethSwap}
                            ethBalance={ethBalance}
                            tokenBalance={tokenBalance}
                            rate={rate}
                            onSwapClick={onSwapClick}
                        />
                    ) : (
                        <SellForm
                            ethSwap={ethSwap}
                            token={token}
                            ethBalance={ethBalance}
                            tokenBalance={tokenBalance}
                            rate={rate}
                            onSwapClick={onSwapClick}
                        />
                    )}
                </Col>
                <Col />
            </Row>
        </Container>
    );
};

export default Main;
