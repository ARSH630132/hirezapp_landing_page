export default function SectionHeading({
  title,
  titleClassName,
  dividerWidthClassName = "w-[333px]",
  dividerClassName = "hidden sm:block h-[1px]",
  leftGradient = "linear-gradient(270deg, #FFFFFF 0%, #000000 100%)",
  rightGradient = "linear-gradient(90deg, #FFFFFF 0%, #000000 100%)",
}: {
  title: React.ReactNode;
  titleClassName: string;
  dividerWidthClassName?: string;
  dividerClassName?: string;
  leftGradient?: string;
  rightGradient?: string;
}) {
  return (
    <div className="flex items-center justify-center gap-4 sm:gap-10">
      <div className={`${dividerClassName} ${dividerWidthClassName}`} style={{ background: leftGradient }} />
      <div className={titleClassName}>{title}</div>
      <div className={`${dividerClassName} ${dividerWidthClassName}`} style={{ background: rightGradient }} />
    </div>
  );
}
