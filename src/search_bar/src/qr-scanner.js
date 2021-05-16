import React, { Component } from 'react'
import QrReader from 'react-qr-scanner'

class QrContainer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            result: null
        }
        this.handleScan = this.handleScan.bind(this)
    }
    handleScan(result) {
        console.log(result)
        // this.setState({
        //     result: result
        // })
    }
    handleError(err) {
        console.log(err)
    }

    render() {
        const previewStyle = {
            height: 400,
            width: 400,
            display: 'flex',
        }
        const camStyle = {
            display: 'flex',
            marginTop: '-50x'
        }
        const textStyle = {
            fontSize: '30px',
            "textAlign": 'center',
            marginTop: '-50x'

        }
        return(
            <React.Fragment>
                <div style = {camStyle}>
                    <QrReader
                        delay={100}
                        style={previewStyle}
                        onError={this.handleError}
                        onScan={this.handleScan}
                    />

                </div>
                <p style = {textStyle}>
                Hold QR Code Steady and Clear to scan
                </p>
            </React.Fragment>
        )
    }
}

export default QrContainer;
