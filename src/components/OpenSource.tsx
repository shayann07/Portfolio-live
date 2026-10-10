import { memo, useEffect, useState } from "react";
import { AnimatedIcon } from "./AnimatedIcon";
import { Reveal } from "./Reveal";
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
      <div className="section-head container-x">
        <div className="rule" aria-hidden />
        <div className="flex items-baseline gap-3">
          <span className="eyebrow">04 / Open Source</span>
          <span className="eyebrow opacity-40">/ Upstream</span>
        </div>
        <h2 id="open-source-title" className="hd-2 mt-2 max-w-3xl">
          Contributing upstream.
        </h2>
      </div>

      <div className="container-x">
        {/* Status line under heading */}
        <Reveal>
          <div className="mb-6 md:mb-8 flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-4">
            <div className="flex items-center gap-2 eyebrow">
              {isLive ? (
                <>
                  <span className="live-dot" />
                  <span className="text-[color:var(--platinum)]">
                    {mergedCount} merged
                    {inReviewCount !== null && ` · ${inReviewCount} in review`}
                  </span>
                </>
              ) : (
                <span className="text-[color:var(--platinum)]/70">{mergedCount} merged</span>
              )}
            </div>

            {isLive && fetchedAt && <div className="eyebrow opacity-60">{updatedAgo}</div>}
          </div>
        </Reveal>

        {/* Contribution cards grid */}
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-5">
          {cards.map((card, i) => (
            <li key={`${card.repo}-${card.number}`} className="h-full">
              <Reveal delay={i * 0.07} className="h-full">
                <a
                  href={card.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  data-cursor="PR"
                  className="glass-soft h-full rounded-[var(--radius-lg)] md:rounded-[var(--radius-xl)] p-5 md:p-6 flex flex-col justify-between group transition-all duration-300 hover:border-white/20 focus-visible:border-white/30 min-h-[160px] spatial-interactive"
                  aria-label={`${card.repo} #${card.number}: ${card.title} (merged ${formatMergedDate(card.mergedAt)}). Opens in a new tab.`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="eyebrow text-[color:var(--platinum)] truncate font-mono text-xs flex items-center gap-2 min-w-0">
                        <span className="text-[color:var(--platinum)]/60 shrink-0">
                          <AnimatedIcon name="github" size={15} />
                        </span>
                        <span className="truncate">{card.repo}</span>
                      </span>
                      <span
                        className="unit text-xs text-[color:var(--platinum)]/75 shrink-0 px-2 py-0.5 rounded-full border border-white/10 bg-white/[0.03]"
                        aria-label={`${card.stars} stars`}
                      >
                        ★ {formatStarCount(card.stars)}
                      </span>
                    </div>

                    <h3 className="hd-3 mt-3.5 text-base md:text-lg line-clamp-2 group-hover:text-white transition-colors">
                      {card.title}
                    </h3>
                  </div>

                  <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-xs eyebrow">
                    <span className="text-[color:var(--crimson)] font-mono flex items-center gap-1 group-hover:underline">
                      #{card.number}
                      <AnimatedIcon
                        name="arrow"
                        size={12}
                        className="opacity-70 group-hover:translate-x-0.5 transition-transform"
                      />
                    </span>
                    <span className="unit text-xs text-[color:var(--platinum)]/60">
                      {formatMergedDate(card.mergedAt)}
                    </span>
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
