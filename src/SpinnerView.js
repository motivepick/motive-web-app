import React, {Component} from 'react';
import {Col, Row} from 'reactstrap';

class SpinnerView extends Component {

    render() {
        return (
            <div>
                <Row style={{marginTop: '150px', marginBottom: '10px'}}>
                    <Col className="text-center">
                        <small>Loading...</small>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default SpinnerView;