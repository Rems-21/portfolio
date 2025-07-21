import React, { useState, useEffect } from 'react';
import emailjs from 'emailjs-com';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [form, setForm] = useState({
    name: '',
    position: '',
    company: '',
    rating: 5,
    message: '',
    email: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/testimonials')
      .then(res => res.json())
      .then(data => setTestimonials(data));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      // 1. Envoi du témoignage au backend
      const response = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const result = await response.json();
      if (result.success) {
        // 2. Envoi de l'email de vérification via EmailJS côté frontend
        emailjs.send(
          process.env.REACT_APP_EMAILJS_SERVICE_ID,
          process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
          {
            to_name: form.name,
            to_email: form.email,
            verification_link: `${window.location.origin}/verify-testimonial/${result.id || ''}`,
            name: form.name,
            position: form.position,
            company: form.company,
            rating: form.rating,
            message: form.message
          },
          process.env.REACT_APP_EMAILJS_USER_ID
        ).then(
          () => {
            setMessage('Témoignage soumis et email de vérification envoyé !');
            setForm({ name: '', position: '', company: '', rating: 5, message: '', email: '' });
          },
          () => {
            setMessage('Témoignage soumis, mais erreur lors de l’envoi de l’email de vérification.');
          }
        );
      } else {
        setMessage(result.message || 'Erreur lors de la soumission du témoignage.');
      }
    } catch (error) {
      setMessage('Erreur de connexion au serveur.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="testimonials-section">
      <h2>Témoignages</h2>
      <ul>
        {testimonials.map(t => (
          <li key={t.id}>
            <strong>{t.name}</strong> ({t.position}) : {t.message}
          </li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <input name="name" value={form.name} onChange={handleChange} placeholder="Nom" required />
        <input name="position" value={form.position} onChange={handleChange} placeholder="Poste" />
        <input name="company" value={form.company} onChange={handleChange} placeholder="Entreprise" />
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" required type="email" />
        <input name="rating" value={form.rating} onChange={handleChange} placeholder="Note" type="number" min="1" max="5" />
        <textarea name="message" value={form.message} onChange={handleChange} placeholder="Votre témoignage" required />
        <button type="submit" disabled={loading}>{loading ? 'Envoi...' : 'Envoyer'}</button>
      </form>
      {message && <div className="message">{message}</div>}
    </div>
  );
};

export default Testimonials; 