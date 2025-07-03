import { useState, useRef } from 'react';

export const useCardForm = () => {
  const [formData, setFormData] = useState({
    cardHolder: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  const cardNumberRef = useRef(null);
  const expiryDateRef = useRef(null);
  const cvvRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'cardNumber') {
      const formattedValue = value
        .replace(/\D/g, '')
        .slice(0, 16)
        .replace(/(.{4})/g, '$1 ')
        .trim();
      setFormData((prevData) => ({
        ...prevData,
        [name]: formattedValue,
      }));
    } else if (name === 'expiryDate') {
      const formattedValue = value
        .replace(/\D/g, '')
        .slice(0, 4)
        .replace(/(\d{2})(\d{1,2})?/, (_, mm, yy) => (yy ? `${mm}/${yy}` : mm));
      setFormData((prevData) => ({
        ...prevData,
        [name]: formattedValue,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const resetForm = () => {
    setFormData({
      cardHolder: '',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
    });
  };

  const resetCardOnly = () => {
    setFormData(prev => ({
      ...prev,
      cardNumber: '',
      expiryDate: '',
      cvv: '',
    }));
  };

  const getLastFourDigits = () => {
    return formData.cardNumber.replace(/\s/g, '').slice(-4);
  };

  const getCardLogo = () => {
    return formData.cardNumber.startsWith('5') ? '/mastercard-id-check.png' : '/verified-by-visa.png';
  };

  return {
    formData,
    setFormData,
    handleInputChange,
    resetForm,
    resetCardOnly,
    getLastFourDigits,
    getCardLogo,
    refs: {
      cardNumberRef,
      expiryDateRef,
      cvvRef,
    }
  };
};
