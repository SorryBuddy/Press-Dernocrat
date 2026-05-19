type Props = {
  children: React.ReactNode;
};

/** Full-viewport casino backdrop for Risk Taking pages. */
export function CasinoPageWrapper({ children }: Props) {
  return (
    <div className="casino-page text-amber-50">
      <div className="casino-bg casino-bg-fixed" aria-hidden />
      {children}
    </div>
  );
}
