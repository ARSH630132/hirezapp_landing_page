import SectionHeading from "@/components/SectionHeading";

export default function QuickSearchSection() {
  return (
    <section className="w-full bg-black px-6 lg:px-16 lg:py-20 py-12 border-t border-white/5">
      <div className="max-w-4xl mx-auto text-center">
        <SectionHeading
          title={
            <h2 className="text-[24px] sm:text-[30px] leading-none font-medium text-center uppercase text-white">
              ENTERPRISE <span className="text-[#009DFF]">QUICK SEARCH</span>
            </h2>
          }
          titleClassName="text-center"
          dividerWidthClassName="w-[260px]"
        />
        <div className="mt-8 relative max-w-2xl mx-auto">
          <input 
            type="text" 
            placeholder="Build AI for Banking..." 
            className="w-full p-5 pl-8 rounded-[20px] bg-[#050505] border border-white/10 text-white text-lg focus:outline-none focus:border-[#009DFF] transition-colors"
          />
        </div>
      </div>
    </section>
  )
}