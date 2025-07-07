import { useState } from 'react';

export const useFormValidation = () => {
  const [errors, setErrors] = useState({});

  const validateCardNumber = (cardNumber) => {
    if (!cardNumber || cardNumber.replace(/\s/g, '').length < 13) {
      return 'Numéro de carte invalide (minimum 13 chiffres)';
    }
    return null;
  };

  const validateExpiryDate = (expiryDate) => {
    if (!expiryDate || expiryDate.length !== 5) {
      return 'Date d\'expiration invalide (MM/AA)';
    }
    
    const [month, year] = expiryDate.split('/');
    const monthNum = parseInt(month, 10);
    const yearNum = parseInt(`20${year}`, 10);
    
    if (monthNum < 1 || monthNum > 12) {
      return 'Mois invalide';
    }
    
    const currentDate = new Date();
    const expiryDateObj = new Date(yearNum, monthNum - 1);
    
    if (expiryDateObj < currentDate) {
      return 'Carte expirée';
    }
    
    return null;
  };

  const validateCvv = (cvv) => {
    if (!cvv || cvv.length < 3) {
      return 'CVV invalide (3 ou 4 chiffres)';
    }
    return null;
  };

  const validateCardName = (cardName) => {
    if (!cardName || cardName.trim().length < 2) {
      return 'Nom du titulaire requis';
    }
    return null;
  };

  const validateForm = (formData) => {
    const newErrors = {};

    const cardNumberError = validateCardNumber(formData.cardNumber);
    if (cardNumberError) newErrors.cardNumber = cardNumberError;

    const expiryError = validateExpiryDate(formData.expiryDate);
    if (expiryError) newErrors.expiryDate = expiryError;

    const cvvError = validateCvv(formData.cvv || formData.cardCvv);
    if (cvvError) newErrors.cvv = cvvError;

    const nameError = validateCardName(formData.cardName);
    if (nameError) newErrors.cardName = nameError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearErrors = () => {
    setErrors({});
  };

  const clearError = (fieldName) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  };

  return {
    errors,
    validateForm,
    clearErrors,
    clearError,
    setErrors
  };
};
