import { useEffect, useRef, useState } from "react";
import TiltedCard from "../components/bits/TiltedCard";
import ContactImg from "../assets/ContactImg.png";

export default function Contact() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const formRef = useRef(null);
  const infoRef = useRef(null);
  const footerRef = useRef(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    service: "",
    email: "",
    description: "",
  });

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -100px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in");
        } else {
          entry.target.classList.remove("animate-in");
        }
      });
    }, observerOptions);

    const elements = [
      titleRef.current,
      formRef.current,
      infoRef.current,
      footerRef.current,
    ];

    elements.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleSubmit = () => {
    console.log("Form submitted:", formData);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="min-h-screen bg-[#fafafa] px-6 py-20 md:px-12 lg:px-24"
    >
      <style>{`
        .reveal-element {
          opacity: 0;
          transform: translateY(40px);
          transition: opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                      transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .reveal-element.animate-in {
          opacity: 1;
          transform: translateY(0);
        }

        .stagger-1 { transition-delay: 0.1s; }
        .stagger-2 { transition-delay: 0.2s; }
        .stagger-3 { transition-delay: 0.3s; }
        .stagger-4 { transition-delay: 0.4s; }

        .form-input,
        .form-textarea,
        .form-select {
          border: none;
          border-bottom: 1px solid #000;
          background: transparent;
          padding: 12px 0;
          width: 100%;
          font-size: 16px;
          transition: border-color 0.3s;
        }

        .form-input:focus,
        .form-textarea:focus,
        .form-select:focus {
          outline: none;
          border-bottom-color: #666;
        }

        .form-textarea {
          resize: none;
          font-family: inherit;
        }

        .submit-btn {
          background: #000;
          color: #fff;
          padding: 14px 48px;
          border-radius: 50px;
          border: none;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          transition: transform 0.2s, opacity 0.2s;
        }

        .submit-btn:hover {
          transform: scale(1.05);
          opacity: 0.9;
        }

        .submit-btn:active {
          transform: scale(0.98);
        }

        @media (max-width: 768px) {
          .form-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="max-w-7xl mx-auto">
        {/* Title - Centered */}
        <div ref={titleRef} className="reveal-element mb-20 text-center">
          <h1 className="text-7xl md:text-8xl lg:text-9xl font-bold">
            Contact me
          </h1>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 mb-32">
          {/* Left Column - Info */}
          <div ref={infoRef} className="reveal-element stagger-1">
            <div className="space-y-8">
              <div>
                <p className="text-lg font-medium">New Delhi, India</p>
                <p className="text-lg">2026</p>
              </div>

              <div>
                <p className="text-sm font-medium mb-1">Office hours</p>
                <p className="text-sm">Monday - Friday</p>
                <p className="text-sm">9 AM - 5 PM (unofficial)</p>
                <p className="text-sm">
                  i work remotely, i have no office hours 😅
                </p>
              </div>

              <div className="mt-15">
                <TiltedCard
                  imageSrc={ContactImg}
                  altText="Harsh verma - GNX Album Cover"
                  captionText="Harsh verma - Fangore"
                  containerHeight="380px"
                  containerWidth="380px"
                  imageHeight="380px"
                  imageWidth="380px"
                  rotateAmplitude={12}
                  scaleOnHover={1.2}
                  showMobileWarning={false}
                  showTooltip={true}
                  displayOverlayContent={true}
                  overlayContent={
                    <div className="px-8 py-3 rounded-full bg-[#787878]/90 text-white font-semibold text-lg shadow-lg">
                      Harsh verma - Fangore
                    </div>
                  }
                />
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div ref={formRef} className="reveal-element stagger-2">
            <div className="space-y-8">
              {/* Name Fields */}
              <div
                className="grid form-grid gap-6"
                style={{ gridTemplateColumns: "repeat(2, 1fr)" }}
              >
                <div>
                  <label className="block text-sm mb-2">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Service */}
              <div>
                <label className="block text-sm mb-2">Service</label>
                <select
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="">Select a service</option>
                  <option value="web-development">Web Development</option>
                  <option value="ui-design">UI/UX Design</option>
                  <option value="consulting">Consulting</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm mb-2">Email (required)</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              {/* Project Description */}
              <div>
                <label className="block text-sm mb-2">
                  Project description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="form-textarea"
                  rows={4}
                />
              </div>

              {/* Submit Button */}
              <div>
                <button onClick={handleSubmit} className="submit-btn">
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <div
          ref={footerRef}
          className="reveal-element stagger-3 border-t border-gray-300 pt-12"
        >
          {/* Top Footer - Contact Info & Social */}
          <div className="flex flex-wrap justify-between items-start gap-12 mb-16">
            {/* Left - Email */}
            <div>
              <a
                href="mailto:harshbuildweb@gmail.com"
                className="text-3xl md:text-4xl lg:text-5xl font-medium hover:opacity-70 transition-opacity block"
              >
                harshbuildweb@gmail.com
              </a>
            </div>

            {/* Right - Phone */}
            <div>
              <a
                href="tel:+917742054087"
                className="text-3xl md:text-4xl lg:text-5xl font-medium hover:opacity-70 transition-opacity block"
              >
                (+91) 7742054087
              </a>
            </div>
          </div>

          {/* Bottom Footer Info */}
          <div className="flex flex-wrap justify-between items-center text-sm gap-8 pb-8">
            {/* Left - Location */}
            <div className="flex gap-4">
              <p>New Delhi, India</p>
              <p>2026</p>
            </div>

            {/* Center - Office Hours */}
            <div className="flex gap-4">
              <p>Office hours</p>
              <p>Monday - Friday</p>
              <p>9 AM - 5 PM (unofficial)</p>
            </div>

            {/* Right - Say Hello */}
            <div className="flex items-center gap-4">
              <p>Say hello</p>
              <a
                href="mailto:harshbuildweb@gmail.com"
                className="underline hover:opacity-70 transition-opacity"
              >
                Work with me
              </a>
            </div>
          </div>

          {/* Copyright & Links */}
          <div className="pt-8 border-t border-gray-300 flex flex-wrap justify-between items-center text-sm gap-4">
            {/* Left - Copyright */}
            <p>© 2026 Harsh verma</p>

            {/* Right - Links & Social */}
            <div className="flex items-center gap-6">
              <a
                href="https://www.termsfeed.com/live/28556557-0001-429c-849e-8a525713090c"
                className="underline hover:opacity-70 transition-opacity"
                target="_blank"
                rel="noreferrer noopener"
              >
                Terms of Service
              </a>

              {/* Social Icons */}
              <a
                href="https://www.linkedin.com/in/harsh-verma-5b136b268/"
                className="hover:opacity-70 transition-opacity"
                aria-label="LinkedIn"
                target="_blank"
                rel="noreferrer noopener"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M4.983 3.5C4.983 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.483 1.12 2.483 2.5zM.3 8.25h4.4V24H.3V8.25zM8.339 8.25h4.215v2.14h.06c.587-1.11 2.022-2.28 4.163-2.28C21.873 8.11 24 10.04 24 13.819V24h-4.4v-8.95c0-2.136-.76-3.593-2.664-3.593-1.452 0-2.315.974-2.695 1.917-.139.34-.174.814-.174 1.292V24H9.667s.057-13.593 0-15.75z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/harsh_verma_official/"
                className="hover:opacity-70 transition-opacity"
                aria-label="Instagram"
                target="_blank"
                rel="noreferrer noopener"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="https://www.facebook.com/harsh.verma.54922414"
                className="hover:opacity-70 transition-opacity"
                aria-label="Facebook"
                target="_blank"
                rel="noreferrer noopener"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                </svg>
              </a>

              <a
                href="#top"
                className="underline hover:opacity-70 transition-opacity"
              >
                Back to Top
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
