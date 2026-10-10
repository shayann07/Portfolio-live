type SectionHeadProps = {
  id?: string;
  eyebrow: string;
  title: string;
  kicker?: string;
};

/** The one section header every section uses: rule, numbered eyebrow, display title. */
export function SectionHead({ id, eyebrow, title, kicker }: SectionHeadProps) {
  return (
    <div className="section-head container-x">
      <div className="rule" aria-hidden />
      <div className="flex items-baseline gap-3">
        <span className="eyebrow">{eyebrow}</span>
        {kicker && <span className="eyebrow eyebrow--quiet">/ {kicker}</span>}
      </div>
      <h2 id={id} className="hd-2 mt-2 max-w-3xl">
        {title}
      </h2>
    </div>
  );
}

export default SectionHead;
