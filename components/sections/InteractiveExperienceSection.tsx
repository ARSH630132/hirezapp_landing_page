import SectionHeading from "@/components/SectionHeading";

export default function InteractiveExperienceSection() {
  const items = ['Talk to Agent', 'Blueprint Generator', 'AI Readiness', 'ROI Calculator', 'Marketplace', 'Foundry Studio'];
  return (
    <section className="w-full bg-[#030303] px-6 lg:px-16 lg:py-20 py-12">
      <SectionHeading
        title={
          <h2 className="text-[24px] sm:text-[30px] leading-none font-medium text-center uppercase text-white">
            INTERACTIVE <span className="text-[#009DFF]">EXPERIENCE</span>
          </h2>
        }
        titleClassName="text-center"
        dividerWidthClassName="w-[260px]"
      />
      <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-6 max-w-[1795px] mx-auto">
        {items.map(c => (
          <div key={c} className="group relative rounded-[20px] p-[1px] bg-white/5 hover:bg-gradient-to-r hover:from-[#E4000F] hover:to-[#009DFF] transition-all cursor-pointer">
            <div className="h-full rounded-[19px] bg-[#000102] p-8 flex flex-col justify-center min-h-[180px] text-center">
              <h3 className="text-xl font-bold text-white/90 group-hover:text-white transition-colors">{c}</h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}