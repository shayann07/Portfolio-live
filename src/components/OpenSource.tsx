import { memo, useEffect, useState } from "react";
import { AnimatedIcon } from "./AnimatedIcon";
import { Reveal } from "./Reveal";
import { SectionHead } from "./SectionHead";
import {
  type OpenSourceData,
  formatUpdatedAgo,
  formatMergedDate,
  formatStarCount,
} from "@/lib/open-source";

type Props = {
  data: OpenSourceData | null | undefined;
};

export const OpenSource = memo(function OpenSource({ data }: Props) {
  const fetchedAt = data?.fetchedAt ?? null;
  const isLive = data?.isLive ?? false;
  const [updatedAgo, setUpdatedAgo] = useState(() =>
    fetchedAt ? formatUpdatedAgo(fetchedAt) : "",
  );

  useEffect(() => {
    if (!fetchedAt || !isLive) return;
    setUpdatedAgo(formatUpdatedAgo(fetchedAt));
    const id = window.setInterval(() => {
      setUpdatedAgo(formatUpdatedAgo(fetchedAt));
    }, 30_000);
    return () => window.clearInterval(id);
  }, [fetchedAt, isLive]);

  if (!data || !data.cards || data.cards.length === 0) {
    return null;
  }

  const { cards, mergedCount, inReviewCount } = data;

  return (
    <section id="open-source" aria-labelledby="open-source-title" className="section">
      <SectionHead
        id="open-source-title"
        eyebrow="04 / Open Source"
        title="Contributing upstream."
        kicker="Upstream"
      />

      <div className="container-x">
        <Reveal>
          <div className="oss-status">
            <div className="eyebrow flex items-center gap-2">
              <span className={isLive ? "status-live" : "text-[color:var(--platinum)]/70"}>
                {mergedCount} merged
                {isLive && inReviewCount !== null && ` · ${inReviewCount} in review`}
              </span>
            </div>
            {isLive && fetchedAt && <div className="eyebrow eyebrow--quiet">{updatedAgo}</div>}
          </div>
        </Reveal>

        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          {cards.map((card, i) => (
            <li key={`${card.repo}-${card.number}`} className="h-full">
              <Reveal delay={i * 0.07} className="h-full">
                <a
                  href={card.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  data-cursor="PR"
                  className="oss-card glass-soft rounded-[var(--radius-lg)] md:rounded-[var(--radius-xl)] spatial-interactive"
                  aria-label={`${card.repo} #${card.number}: ${card.title} (merged ${formatMergedDate(card.mergedAt)}). Opens in a new tab.`}
                >
                  <div>
                    <div className="oss-card__top">
                      <span className="oss-card__repo">
                        <AnimatedIcon name="github" size={15} />
                        <span className="truncate">{card.repo}</span>
                      </span>
                      <span className="oss-card__stars unit" aria-label={`${card.stars} stars`}>
                        ★ {formatStarCount(card.stars)}
                      </span>
                    </div>
                    <h3 className="hd-3 oss-card__title">{card.title}</h3>
                  </div>

                  <div className="oss-card__foot eyebrow">
                    <span className="oss-card__pr">
                      #{card.number}
                      <AnimatedIcon name="arrow" size={12} />
                    </span>
                    <span className="unit">{formatMergedDate(card.mergedAt)}</span>
                  </div>
                </a>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
});

export default OpenSource;
