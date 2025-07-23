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
    <div className="min-h-screen flex flex-col items-center" style={{ background: '#E4A4BD' }}>
      <HamburgerMenu />
      <div className="w-full flex flex-col items-center justify-center pt-24">
        <h1 className="w-full text-center uppercase text-[6vw] md:text-[2.5vw] block font-bold" style={{ color: '#EF1481', textShadow: '0 0 6px #FDF8F3, 0 0 12px #FDF8F3' }}>
          Let's tell stories together!
        </h1>
        <div className="mt-6 w-full max-w-xl flex flex-col items-center">
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
              {submitted ? "Message Sent!" : "Send Message"}
            </button>
          </form>
          <a href="mailto:your@email.com" className="mt-8 px-6 py-2 bg-[#EF1481] text-white rounded-full hover:bg-[#c01167] transition font-bold text-lg shadow-lg">
            Or Email Me
          </a>
        </div>
      </div>
    </div>
  );
} 