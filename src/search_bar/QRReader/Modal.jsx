import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import classes from './qr-reader.module.css';

const Modal = props => {
  const modalContainer = document.querySelector('#modal');
  const element = document.createElement('div');

  useEffect(() => {
    element.className = classes.modal;
    modalContainer.appendChild(element);
    return () => {
      modalContainer.removeChild(element);
    };
  }, [element, modalContainer]);
  return createPortal(props.children, element);
};

export default Modal;
