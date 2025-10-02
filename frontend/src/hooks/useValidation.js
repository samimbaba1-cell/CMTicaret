import { useState, useCallback } from 'react';

const validators = {
  email: (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) ? null : 'Geçerli bir e-posta adresi girin';
  },
  
  password: (value) => {
    if (value.length < 6) return 'Şifre en az 6 karakter olmalıdır';
    if (!/(?=.*[a-z])/.test(value)) return 'Şifre en az bir küçük harf içermelidir';
    if (!/(?=.*[A-Z])/.test(value)) return 'Şifre en az bir büyük harf içermelidir';
    if (!/(?=.*\d)/.test(value)) return 'Şifre en az bir rakam içermelidir';
    return null;
  },
  
  phone: (value) => {
    const phoneRegex = /^(\+90|0)?[5][0-9]{9}$/;
    return phoneRegex.test(value) ? null : 'Geçerli bir telefon numarası girin';
  },
  
  required: (value) => {
    return value && value.trim().length > 0 ? null : 'Bu alan zorunludur';
  },
  
  minLength: (min) => (value) => {
    return value && value.length >= min ? null : `En az ${min} karakter olmalıdır`;
  },
  
  maxLength: (max) => (value) => {
    return value && value.length <= max ? null : `En fazla ${max} karakter olmalıdır`;
  },
  
  numeric: (value) => {
    return /^\d+$/.test(value) ? null : 'Sadece rakam girin';
  },
  
  url: (value) => {
    try {
      new URL(value);
      return null;
    } catch {
      return 'Geçerli bir URL girin';
    }
  }
};

export default function useValidation() {
  const [errors, setErrors] = useState({});

  const validate = useCallback((data, rules) => {
    const newErrors = {};
    
    Object.keys(rules).forEach(field => {
      const fieldRules = rules[field];
      const value = data[field];
      
      for (const rule of fieldRules) {
        let validator;
        let errorMessage;
        
        if (typeof rule === 'string') {
          validator = validators[rule];
          errorMessage = validator ? validator(value) : null;
        } else if (typeof rule === 'function') {
          errorMessage = rule(value);
        } else if (rule.validator) {
          validator = validators[rule.validator];
          if (validator) {
            if (rule.params) {
              errorMessage = validator(...rule.params)(value);
            } else {
              errorMessage = validator(value);
            }
          }
          if (rule.message && errorMessage) {
            errorMessage = rule.message;
          }
        }
        
        if (errorMessage) {
          newErrors[field] = errorMessage;
          break; // Stop at first error for this field
        }
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, []);

  const validateField = useCallback((field, value, rules) => {
    const fieldRules = rules[field] || [];
    const newErrors = { ...errors };
    
    for (const rule of fieldRules) {
      let validator;
      let errorMessage;
      
      if (typeof rule === 'string') {
        validator = validators[rule];
        errorMessage = validator ? validator(value) : null;
      } else if (typeof rule === 'function') {
        errorMessage = rule(value);
      } else if (rule.validator) {
        validator = validators[rule.validator];
        if (validator) {
          if (rule.params) {
            errorMessage = validator(...rule.params)(value);
          } else {
            errorMessage = validator(value);
          }
        }
        if (rule.message && errorMessage) {
          errorMessage = rule.message;
        }
      }
      
      if (errorMessage) {
        newErrors[field] = errorMessage;
        break;
      } else {
        delete newErrors[field];
      }
    }
    
    setErrors(newErrors);
    return !newErrors[field];
  }, [errors]);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const clearFieldError = useCallback((field) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  return {
    errors,
    validate,
    validateField,
    clearErrors,
    clearFieldError,
    isValid: Object.keys(errors).length === 0
  };
}
