
import React, { useState, useRef, useEffect, FC, ChangeEvent, FormEvent } from 'react';
import { isValidEmail, isRequired, isWithinLength, MAX_MESSAGE_LENGTH } from '../utils/validation';
import { createLogger } from '../utils/logger';
import * as S from './ContactForm.styles';

interface FormData {
  name: string;
  email: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

const ContactForm: FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const successTimerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    return () => {
      if (successTimerRef.current) clearTimeout(successTimerRef.current);
    };
  }, []);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!isRequired(formData.name)) {
      newErrors.name = 'Name is required';
    }
    if (!isRequired(formData.email)) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!isRequired(formData.message)) {
      newErrors.message = 'Message is required';
    } else if (!isWithinLength(formData.message, MAX_MESSAGE_LENGTH)) {
      newErrors.message = `Message must be less than ${MAX_MESSAGE_LENGTH} characters`;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!validateForm() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      // TODO: Wire to backend API (POST /api/contact)
      // For now, log the data and show success — backend integration pending
      createLogger('ContactForm').info('Form submitted (backend pending):', { name: formData.name, email: formData.email });
      setFormData({ name: '', email: '', message: '' });
      setSubmitSuccess(true);
      successTimerRef.current = setTimeout(() => setSubmitSuccess(false), 5000);
    } catch {
      setErrors({ message: 'Failed to send message. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.currentTarget;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <S.FormContainer onSubmit={handleSubmit}>
      <S.FormGroup>
        <label htmlFor="contact-name" className="sr-only">Your Name</label>
        <input
          id="contact-name"
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          aria-required="true"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'name-error' : undefined}
        />
        {errors.name && <S.ErrorMessage id="name-error" role="alert">{errors.name}</S.ErrorMessage>}
      </S.FormGroup>
      <S.FormGroup>
        <label htmlFor="contact-email" className="sr-only">Your Email</label>
        <input
          id="contact-email"
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          aria-required="true"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        {errors.email && <S.ErrorMessage id="email-error" role="alert">{errors.email}</S.ErrorMessage>}
      </S.FormGroup>
      <S.FormGroup>
        <label htmlFor="contact-message" className="sr-only">Your Message</label>
        <textarea
          id="contact-message"
          name="message"
          placeholder="Your Message"
          value={formData.message}
          onChange={handleChange}
          rows={5}
          maxLength={2000}
          aria-required="true"
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'message-error' : undefined}
        />
        {errors.message && <S.ErrorMessage id="message-error" role="alert">{errors.message}</S.ErrorMessage>}
      </S.FormGroup>
      <S.SubmitButton type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Sending...' : submitSuccess ? 'Sent!' : 'Send Message'}
      </S.SubmitButton>
    </S.FormContainer>
  );
};

export default ContactForm;
