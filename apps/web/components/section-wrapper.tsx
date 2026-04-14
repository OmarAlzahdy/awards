interface SectionWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export function SectionWrapper({
  children,
  className = "",
}: SectionWrapperProps) {
  return (
    <section className={`w-full max-w-[95%] mx-auto px-4 lg:px-8 ${className}`}>
      {children}
    </section>
  );
}
