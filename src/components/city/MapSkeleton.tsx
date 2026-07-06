// Static placeholder shown while Leaflet loads (next/dynamic loading state).
// Height MUST match CityMap's MapContainer height to prevent CLS.
export default function MapSkeleton() {
  return (
    <div className="h-60 sm:h-[400px] w-full rounded-xl bg-elevated border border-border flex items-center justify-center">
      <div className="flex flex-col items-center gap-2 text-muted">
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="opacity-40 animate-pulse"
        >
          <circle cx="12" cy="10" r="3" />
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
        </svg>
        <span className="text-xs font-medium opacity-40">Loading map…</span>
      </div>
    </div>
  );
}
