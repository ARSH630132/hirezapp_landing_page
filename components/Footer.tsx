import Link from "next/link";
import { FaLocationDot, FaPhone } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";

const footerColumns = [
  {
    title: "Information",
    items: ["Responsible AI", "Careers", "Resources", "About Us", "Contact Us", "Privacy Policy", "Terms & Conditions"],
  },
  {
    title: "Service",
    items: ["AI Chips", "Authentication", "Edtech", "Femtech", "TravelTech", "Proptech"],
  },
];

const socialIcons = [
  { src: "/footer/linkedin.png", alt: "LinkedIn" },
  { src: "/footer/twitter.png", alt: "Twitter" },
  { src: "/footer/mail.png", alt: "Mail" },
  { src: "/footer/youtube.png", alt: "YouTube" },
  { src: "/footer/instagram.png", alt: "Instagram" },
];

export default function Footer() {
  return (
    <footer className="w-full bg-black pt-20">
      <div className="max-w-[1795px] mx-auto px-6 sm:px-8 lg:px-12 pb-14">
        <div className="grid grid-cols-1 md:grid-cols-[1.7fr_1fr_1fr_1.2fr] gap-12">
          <div>
            <div className="flex items-center gap-3">
              <img src="/footer/logo.svg" alt="Logo" className="h-[55px] w-auto object-contain" />
              <img src="/footer/text.png" alt="GFF AI" className="h-[32px] w-auto object-contain" />
            </div>
            <p className="mt-6 text-white/70 text-[14px] leading-8 max-w-[380px]">
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry&apos;s standard dummy text ever since the 1500s.
            </p>
            <div className="flex items-center gap-3 mt-8">
              {socialIcons.map((icon) => (
                <button key={icon.alt} type="button" aria-label={icon.alt} className="group inline-flex h-10 w-10 items-center justify-center transition-all duration-300 hover:-translate-y-0.5 active:scale-95">
                  <img src={icon.src} alt={icon.alt} className="h-5 w-5 object-contain brightness-0 invert transition-transform duration-300 group-hover:scale-110" />
                </button>
              ))}
            </div>
          </div>

          {footerColumns.map((col) => (
            <div key={col.title}>
              <h3 className="text-white text-[28px] font-semibold">{col.title}</h3>
              <div className="mt-[10px] h-[1px] w-[149px]" style={{ background: "linear-gradient(270deg, #000000 49.66%, #FF0004 100%)" }} />
              <div className="mt-8 space-y-[18px] text-[14px]">
                {col.items.map((item) =>
                  item === "About Us" ? (
                    <Link key={item} href="/about-us" className="block text-white/70 hover:text-white transition-colors">{item}</Link>
                  ) : (
                    <button key={item} type="button" className="block text-white/70 hover:text-white transition-colors text-left">{item}</button>
                  )
                )}
              </div>
            </div>
          ))}

          <div>
            <h3 className="text-white text-[28px] font-semibold">Contact Info</h3>
            <div className="mt-[10px] h-[1px] w-[149px]" style={{ background: "linear-gradient(270deg, #000000 49.66%, #FF0004 100%)" }} />
            <div className="mt-8 space-y-6 text-white/70 text-[14px]">
              <p className="flex items-start gap-3">
                <FaLocationDot className="text-[#E8EDFF] text-[16px] shrink-0 mt-0.5" />
                <span>71 Pennington Lane Vernon Rockville, CT 06066</span>
              </p>
              <p className="flex items-center gap-3">
                <MdEmail className="text-[#E8EDFF] text-[16px] shrink-0" />
                <span>thefactoryai@gmail.com</span>
              </p>
              <p className="flex items-center gap-3">
                <FaPhone className="text-[#E8EDFF] text-[14px] shrink-0" />
                <span>12345 67890</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-5 text-center text-white/60 text-[13px]">
        © 2026 GFF AI All Rights Reserved
      </div>
    </footer>
  );
}
