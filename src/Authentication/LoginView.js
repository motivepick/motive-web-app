import React, { Component } from 'react';
import { Col, Row } from 'reactstrap';
import LoginButton from './LoginButton';
import logo from '../logo.png';

class LoginView extends Component {

    render() {
        return (
            <div>
                <Row style={{ marginTop: '40px', marginBottom: '10px' }}>
                    <Col className="text-center">
                        <img src={logo} alt="Motiv Logo" width={'64px'} height={'64px'}/>
                    </Col>
                </Row>
                <Row style={{ marginTop: '20px', marginBottom: '10px' }}>
                    <Col className="text-center">
                        <h1>Welcome to Motiv!</h1>
                    </Col>
                </Row>
                <Row>
                    <Col className="text-center">
                        <small>A minimalistic application which is going to defeat your laziness</small>
                    </Col>
                </Row>
                <Row style={{ marginTop: '30px', marginBottom: '10px' }}>
                    <Col className="text-center">
                        <LoginButton/>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default LoginView;