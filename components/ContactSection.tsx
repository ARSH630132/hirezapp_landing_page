"use client";

import { useState, type FormEvent } from "react";
import WorldMap from "@/components/ui/world-map";

const mapDots = [
  {
    start: { lat: 65, lng: -150 },
    end: { lat: 48, lng: -118 },
  },
  {
    start: { lat: 65, lng: -150 },
    end: { lat: 8, lng: -106 },
  },
  {
    start: { lat: 65, lng: -150 },
    end: { lat: -16, lng: -58 },
  },
  {
    start: { lat: 38, lng: -25 },
    end: { lat: 44, lng: -3 },
  },
  {
    start: { lat: 50, lng: 10 },
    end: { lat: 26, lng: 77 },
  },
  {
    start: { lat: -2, lng: 45 },
    end: { lat: 26, lng: 77 },
  },
  {
    start: { lat: 26, lng: 77 },
    end: { lat: 40, lng: 135 },
  },
];

export default function ContactSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{
    open: boolean;
    type: "success" | "error";
    title: string;
    message: string;
  }>({
    open: false,
    type: "success",
    title: "",
    message: "",
  });
  const [contactForm, setContactForm] = useState({
    fullName: "",
    fullNameDetail: "",
    company: "",
    companyDetail: "",
    businessEmail: "",
    businessEmailDetail: "",
  });

  const handleContactSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactForm),
      });

      if (response.ok) {
        setContactForm({
          fullName: "",
          fullNameDetail: "",
          company: "",
          companyDetail: "",
          businessEmail: "",
          businessEmailDetail: "",
        });
        setNotification({
          open: true,
          type: "success",
          title: "Message sent successfully",
          message:
            "Thanks for reaching out. Your details have been delivered to our team, and we’ll review them shortly.",
        });
      } else {
        const error = await response.json().catch(() => null);
        setNotification({
          open: true,
          type: "error",
          title: "Message could not be sent",
          message:
            error?.message ??
            "Please try again in a moment or check the form details and resubmit.",
        });
      }
    } catch {
      setNotification({
        open: true,
        type: "error",
        title: "Something went wrong",
        message:
          "Please try again in a moment. If the issue continues, reach out to us directly.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      className="w-full px-6 lg:px-16 py-[50px] overflow-hidden"
    >
      {notification.open && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center px-4 py-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="contact-notification-title"
        >
          <button
            type="button"
            aria-label="Close notification"
            className="absolute inset-0 bg-black/70 backdrop-blur-[8px] cursor-default"
            onClick={() => setNotification((current) => ({ ...current, open: false }))}
          />

          <div className="relative w-full max-w-[520px] overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,14,26,0.96)_0%,rgba(3,6,14,0.98)_100%)] shadow-[0_24px_80px_rgba(0,0,0,0.55)]">
            <div
              className={`h-[6px] w-full ${
                notification.type === "success"
                  ? "bg-[linear-gradient(90deg,#16a34a_0%,#22c55e_100%)]"
                  : "bg-[linear-gradient(90deg,#ef4444_0%,#f97316_100%)]"
              }`}
            />

            <div className="p-6 sm:p-8">
              <div
                className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${
                  notification.type === "success"
                    ? "bg-emerald-500/15 text-emerald-400"
                    : "bg-red-500/15 text-red-400"
                }`}
              >
                {notification.type === "success" ? (
                  <svg viewBox="0 0 24 24" className="h-8 w-8 fill-none stroke-current stroke-[2.25]">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12.5l4.5 4.5L19 7.5" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" className="h-8 w-8 fill-none stroke-current stroke-[2.25]">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
                  </svg>
                )}
              </div>

              <h3
                id="contact-notification-title"
                className="mt-5 text-center text-[24px] sm:text-[28px] font-semibold tracking-tight text-white"
              >
                {notification.title}
              </h3>

              <p className="mt-3 text-center text-[14px] sm:text-[16px] leading-[26px] text-white/72">
                {notification.message}
              </p>

              <div className="mt-7 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setNotification((current) => ({ ...current, open: false }))}
                  className="h-[46px] rounded-full px-6 text-[14px] font-semibold text-white transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(228,0,15,0.95) 0%, rgba(0,157,255,0.95) 100%)",
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[56%_44%] gap-0 items-center max-w-[1500px] mx-auto">
        <div className="w-[95%] h-[510px] flex items-center justify-center overflow-hidden rounded-[28px] bg-black">
          <WorldMap dots={mapDots} lineColor="#0ea5e9" />
        </div>

        <form
          onSubmit={handleContactSubmit}
          className="relative w-full max-w-[853px] min-h-[475px] rounded-[10px] bg-[#0000001A] backdrop-blur-[40px] p-6 md:p-8"
          style={{
            border: "1px solid transparent",
          }}
        >
          <div
            className="pointer-events-none absolute inset-0 rounded-[10px]"
            style={{
              border: "1px solid transparent",
              background:
                "linear-gradient(180deg, #78A7FF 0%, #57000F 100%) border-box",
              WebkitMask:
                "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
            }}
          />

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-8 gap-y-6">
            <div>
              <label className="block text-white font-[var(--font-montserrat)] font-medium text-[15px] sm:text-[16px] lg:text-[18px] leading-[100%] tracking-[0.02em]">
                Full Name
              </label>
              <input
                name="fullName"
                required
                value={contactForm.fullName}
                onChange={(e) =>
                  setContactForm({
                    ...contactForm,
                    fullName: e.target.value,
                  })
                }
                placeholder="Enter"
                className="mt-3 w-full h-[50px] rounded-[18px] border border-[#1A2145] bg-[#16060680] px-4 text-white outline-none font-[var(--font-montserrat)] font-medium text-[18px] leading-[100%] tracking-[0.02em] placeholder:text-[#C1C1C1]"
                style={{
                  boxShadow: "inset 0 0 0 1px rgba(120,167,255,0.08)",
                }}
              />
            </div>

            <div>
              <label className="block text-white font-[var(--font-montserrat)] font-medium text-[15px] sm:text-[16px] lg:text-[18px] leading-[100%] tracking-[0.02em]">
                Enter your full name
              </label>
              <input
                name="fullNameDetail"
                required
                value={contactForm.fullNameDetail}
                onChange={(e) =>
                  setContactForm({
                    ...contactForm,
                    fullNameDetail: e.target.value,
                  })
                }
                placeholder="Enter"
                className="mt-3 w-full h-[50px] rounded-[18px] border border-[#1A2145] bg-[#16060680] px-4 text-white outline-none font-[var(--font-montserrat)] font-medium text-[18px] leading-[100%] tracking-[0.02em] placeholder:text-[#C1C1C1]"
                style={{
                  boxShadow: "inset 0 0 0 1px rgba(120,167,255,0.08)",
                }}
              />
            </div>

            <div>
              <label className="block text-white font-[var(--font-montserrat)] font-medium text-[15px] sm:text-[16px] lg:text-[18px] leading-[100%] tracking-[0.02em]">
                Company / Organization
              </label>
              <input
                name="company"
                required
                value={contactForm.company}
                onChange={(e) =>
                  setContactForm({
                    ...contactForm,
                    company: e.target.value,
                  })
                }
                placeholder="Enter"
                className="mt-3 w-full h-[50px] rounded-[18px] border border-[#1A2145] bg-[#16060680] px-4 text-white outline-none font-[var(--font-montserrat)] font-medium text-[18px] leading-[100%] tracking-[0.02em] placeholder:text-[#C1C1C1]"
                style={{
                  boxShadow: "inset 0 0 0 1px rgba(120,167,255,0.08)",
                }}
              />
            </div>

            <div>
              <label className="block whitespace-nowrap text-white font-[var(--font-montserrat)] font-medium text-[15px] sm:text-[16px] lg:text-[18px] leading-[100%] tracking-[0.02em]">
                Enter company name
              </label>
              <input
                name="companyDetail"
                required
                value={contactForm.companyDetail}
                onChange={(e) =>
                  setContactForm({
                    ...contactForm,
                    companyDetail: e.target.value,
                  })
                }
                placeholder="Enter"
                className="mt-3 w-full h-[50px] rounded-[18px] border border-[#1A2145] bg-[#16060680] px-4 text-white outline-none font-[var(--font-montserrat)] font-medium text-[18px] leading-[100%] tracking-[0.02em] placeholder:text-[#C1C1C1]"
                style={{
                  boxShadow: "inset 0 0 0 1px rgba(120,167,255,0.08)",
                }}
              />
            </div>

            <div>
              <label className="block text-white font-[var(--font-montserrat)] font-medium text-[15px] sm:text-[16px] lg:text-[18px] leading-[100%] tracking-[0.02em]">
                Business Email
              </label>
              <input
                name="businessEmail"
                type="email"
                required
                value={contactForm.businessEmail}
                onChange={(e) =>
                  setContactForm({
                    ...contactForm,
                    businessEmail: e.target.value,
                  })
                }
                placeholder="Enter"
                className="mt-3 w-full h-[50px] rounded-[18px] border border-[#1A2145] bg-[#16060680] px-4 text-white outline-none font-[var(--font-montserrat)] font-medium text-[18px] leading-[100%] tracking-[0.02em] placeholder:text-[#C1C1C1]"
                style={{
                  boxShadow: "inset 0 0 0 1px rgba(120,167,255,0.08)",
                }}
              />
            </div>

            <div>
              <label className="block text-white font-[var(--font-montserrat)] font-medium text-[18px] sm:text-[18px] lg:text-[18px] leading-[100%] tracking-[0.02em]">
                Enter official email address
              </label>
              <input
                name="businessEmailDetail"
                type="email"
                required
                value={contactForm.businessEmailDetail}
                onChange={(e) =>
                  setContactForm({
                    ...contactForm,
                    businessEmailDetail: e.target.value,
                  })
                }
                placeholder="Enter"
                className="mt-3 w-full h-[50px] rounded-[18px] border border-[#1A2145] bg-[#16060680] px-4 text-white outline-none font-[var(--font-montserrat)] font-medium text-[18px] leading-[100%] tracking-[0.02em] placeholder:text-[#C1C1C1]"
                style={{
                  boxShadow: "inset 0 0 0 1px rgba(120,167,255,0.08)",
                }}
              />
            </div>
          </div>

          <div className="mt-10 w-full rounded-full p-[2px] shadow-[0px_4px_4px_0px_#00000040] bg-[linear-gradient(90deg,#9A0003_0%,#1173BC_100%)]">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-[42px] rounded-full bg-transparent text-[13px] font-semibold cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: "linear-gradient(90deg, #9A0003 0%, #1173BC 100%)",
                }}
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
