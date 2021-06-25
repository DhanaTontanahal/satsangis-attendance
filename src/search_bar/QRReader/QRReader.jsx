import React, { useState } from 'react';
import BarcodeScanner from 'react-qr-barcode-scanner';
import Modal from './Modal';
import useSound from 'use-sound';

import classes from './qr-reader.module.css';

const QRReader = ({handleScanFinished}) => {
  const [showModal, setShowModal] = useState(false);
  const [data, setData] = useState(null);
  const [barScan, setBarScan] = useState(false);

  const [playAlert] = useSound(`${process.env.PUBLIC_URL}/assets/alert.wav`, {
    volume: 0.25,
  });

  const handleBarcodeScan = (err, res) => {
    if (err) console.error(err);
    if (!res) return;
    
    setData(res.text);
    playAlert();
    handleScanFinished(res.text);
  };

  return (
    <div className={classes.container}>
      <button
        className={classes.btn}
        onClick={e => {
          e.preventDefault();
          setShowModal(true);
          setBarScan(true);
          setData(null);
        }}
      >
        Scan QR or Barcode
      </button>
      {showModal && (
        <Modal>
          <React.Fragment>
            <button
              className={classes.closeModal}
              onClick={() => setShowModal(false)}
            >
              X
            </button>
            {barScan && (
              <BarcodeScanner
                style={{ width: '90%', height: '70%' }}
                onUpdate={handleBarcodeScan}
              />
            )}
            {data && <div className={classes.result}>{data}</div>}
          </React.Fragment>
        </Modal>
      )}
    </div>
  );
};

export default QRReader;
