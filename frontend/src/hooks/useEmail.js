import { useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function useEmail() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendEmail = async (type, data) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/email/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          type,
          data
        })
      });

      if (!response.ok) {
        throw new Error('Email gönderilemedi');
      }

      return await response.json();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const sendOrderConfirmation = async (order, customer) => {
    return sendEmail('order_confirmation', { order, customer });
  };

  const sendPasswordReset = async (email, resetToken) => {
    return sendEmail('password_reset', { email, resetToken });
  };

  const sendWelcomeEmail = async (customer) => {
    return sendEmail('welcome', { customer });
  };

  const sendNewsletter = async (subscribers, content) => {
    return sendEmail('newsletter', { subscribers, content });
  };

  const sendContactForm = async (formData) => {
    return sendEmail('contact_form', { formData });
  };

  return {
    loading,
    error,
    sendEmail,
    sendOrderConfirmation,
    sendPasswordReset,
    sendWelcomeEmail,
    sendNewsletter,
    sendContactForm
  };
}
