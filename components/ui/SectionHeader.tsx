type SectionHeaderProps = {
  title?: string
  subtitle?: string
}

export default function SectionHeader({ title, subtitle }: SectionHeaderProps) {
  return (
    <div className="flex flex-col gap-0.5">
      {title ? <h2 className="font-poppins font-semibold text-[15px] text-[#0F172A] leading-snug">{title}</h2> : null}
      {subtitle ? <p className="font-dmsans text-[12px] text-[#94A3B8]">{subtitle}</p> : null}
    </div>
  )
}
