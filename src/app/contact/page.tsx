'use client';
import React, { useState } from "react";
import HamburgerMenu from "../HamburgerMenu";
import Caption from "../Caption";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // Here you would send the form data to your backend or email service
  };
  return (
    <div
      className="min-h-screen flex flex-col items-center"
      style={{
        background: `#E4A4BD url('/contact/BG.png') center center / cover no-repeat`,
        minHeight: '100vh',
        width: '100%',
        position: 'relative',
      }}
    >
      <HamburgerMenu />
      <div className="w-full flex flex-col items-center justify-center pt-24">
        <div
          style={{
            overflow: 'visible',
            paddingTop: typeof window !== 'undefined' && (window.innerWidth <= 700 || window.innerWidth < window.innerHeight) ? '1.2em' : '2.5em',
            paddingRight: typeof window !== 'undefined' && (window.innerWidth <= 700 || window.innerWidth < window.innerHeight) ? '0.5em' : '2.5em',
            paddingBottom: typeof window !== 'undefined' && (window.innerWidth <= 700 || window.innerWidth < window.innerHeight) ? '0.5em' : '0.5em',
            paddingLeft: typeof window !== 'undefined' && (window.innerWidth <= 700 || window.innerWidth < window.innerHeight) ? '0.5em' : '3.5em',
            margin: typeof window !== 'undefined' && (window.innerWidth <= 700 || window.innerWidth < window.innerHeight) ? '1em 0 0.5em 0' : '2em 0 0.5em 0',
            textAlign: 'center',
          }}
        >
          <h1
            className="font-bold uppercase w-full text-center flex items-center justify-center"
            style={{
              color: '#FDF8F3',
              textShadow: '0 0 6px #FDF8F3, 0 0 12px #FDF8F3',
              fontFamily: "'Montserrat', Arial, Helvetica, sans-serif",
              fontWeight: 900,
              fontSize: 'clamp(2.2rem, 8vw, 6rem)',
              lineHeight: 1.1,
              letterSpacing: '0.04em',
              width: '100%',
              margin: 0,
              padding: 0,
              textTransform: 'uppercase',
              wordBreak: 'break-word',
              whiteSpace: 'normal',
            }}
          >
            <span className="swipe-reveal" style={{ overflow: 'visible', display: 'inline' }}>
              &nbsp;Let&apos;s tell stories together!
            </span>
        </h1>
        </div>
        <div className="mt-6 w-full max-w-xl flex flex-col items-center px-4 md:px-0">
          <form onSubmit={handleSubmit} className="mt-8 w-full flex flex-col gap-4 bg-white/80 rounded-2xl shadow-lg p-8">
            <label className="font-semibold text-gray-700">Name
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="mt-1 w-full px-4 py-2 rounded border border-gray-300 focus:border-[#EF1481] focus:outline-none"
              />
            </label>
            <label className="font-semibold text-gray-700">Email
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="mt-1 w-full px-4 py-2 rounded border border-gray-300 focus:border-[#EF1481] focus:outline-none"
              />
            </label>
            <label className="font-semibold text-gray-700">Message
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                rows={5}
                className="mt-1 w-full px-4 py-2 rounded border border-gray-300 focus:border-[#EF1481] focus:outline-none resize-none"
              />
            </label>
            <button
              type="submit"
              className="mt-4 px-6 py-2 bg-[#EF1481] text-white rounded-full hover:bg-[#c01167] transition font-bold text-lg shadow-lg"
              disabled={submitted}
            >
              {submitted ? "Message Sent!" : "Beam it over!"}
            </button>
          </form>
          <a
            href="mailto:your@email.com"
            className="mt-8 px-6 py-2 rounded-full transition font-bold text-lg shadow-lg"
            style={{
              background: '#FDF8F3',
              color: '#EF1481',
              boxShadow: '0 0 8px 2px #FDF8F3',
            }}
          >
            ...or send it from your inbox!
          </a>
        </div>
      </div>
    </div>
  );
} 