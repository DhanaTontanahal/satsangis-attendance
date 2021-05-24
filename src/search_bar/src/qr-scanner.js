import React, { Component } from 'react'
import QrReader from 'react-qr-reader'

class QrContainer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            result: null
        }
        this.handleScan = this.handleScan.bind(this)
        this.openImageDialog = this.openImageDialog.bind(this)
        this.qr_reader = React.createRef()
    }
    handleScan(result) {
        console.log(result)
        // this.setState({
        //     result: result
        // })
    }
    handleError(err) {
        console.log('suhavan ........')
        console.log(err)
    }
    openImageDialog() {
        this.qr_reader.current.openImageDialog()
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
                        ref={this.qr_reader}
                        delay={100}
                        facingMode={'environment'}
                        style={previewStyle}
                        onError={this.handleError}
                        onScan={this.handleScan}
                        legacyMode
                    />

                
                <input type="button" value="Submit QR Code" onClick={this.openImageDialog} />
                <p>{this.state.result}</p>
                <p style = {textStyle}>
                Hold QR Code Steady and Clear to scan
                </p>
                </div>
            </React.Fragment>
        )
    }
}

export default QrContainer;
