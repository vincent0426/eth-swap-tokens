import React, { Component } from "react";
import { Navbar } from "react-bootstrap";

class NavbarComponent extends Component {
    render() {
        return (
            <Navbar bg="dark" variant="dark">
                <Navbar.Brand style={{ marginLeft: 100 }}>
                    Eth Swap
                </Navbar.Brand>
                <Navbar.Text style={{ marginRight: 50 }} className="ms-auto">
                    {this.props.account}
                </Navbar.Text>
            </Navbar>
        );
    }
}

export default NavbarComponent;
