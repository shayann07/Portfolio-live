/**
 * Floating dioramas for the Lab cards, built from the same primitives as the
 * work scenes (`.wscene`, `.wplane`, `.wscene__shadow`) so the two sections
 * share one spatial language rather than inventing a second.
 *
 * These three depict process and architecture: sync rails, a modular graph,
 * and shader rasterization.
 */

export const LAB_SCENES = ["settlement", "rails", "graph"] as const;
export type LabSceneName = (typeof LAB_SCENES)[number];

export function LabScene({ variant }: { variant: LabSceneName }) {
  return (
    <span className="wscene wscene--lab" data-scene={variant} aria-hidden>
      <span className="wscene__shadow" />
      <span className="wscene__glow" />
      <span className="wscene__stage">
        {variant === "settlement" && (
          <span className="wplane wp--ledger">
            <i className="wrow" />
            <i className="wrow" />
            <i className="wrow" />
            <span className="wsettle" />
          </span>
        )}

        {variant === "rails" && (
          <>
            <span className="wrail" />
            <span className="wnode2 wnode2--a" />
            <span className="wnode2 wnode2--b" />
            <span className="wpacket" />
          </>
        )}

        {variant === "graph" && (
          <>
            <span className="wring wring--r2" />
            <span className="wring wring--r1" />
            <span className="wroot" />
            <span className="wgnode wgnode--n1" />
            <span className="wgnode wgnode--n2" />
            <span className="wgnode wgnode--n3" />
            <span className="wgnode wgnode--n4" />
          </>
        )}
      </span>
    </span>
  );
}

export default LabScene;
