import { Navigation, Smartphone, Lightbulb } from 'lucide-react';
import { City } from '@/lib/types';

const essentialApps: Record<string, { name: string; use: string; color: string }[]> = {
  bali:      [{ name: 'Gojek', use: 'Rides & food delivery', color: 'text-teal' }, { name: 'Grab', use: 'Taxis & bikes', color: 'text-teal' }, { name: 'Google Maps', use: 'Navigation & routes', color: 'text-blue-400' }],
  bangkok:   [{ name: 'Grab', use: 'Rides & delivery', color: 'text-teal' }, { name: 'Google Maps', use: 'BTS & MRT routes', color: 'text-blue-400' }, { name: 'ViaBus Bangkok', use: 'Bus routes', color: 'text-accent' }],
  paris:     [{ name: 'Bonjour RATP', use: 'Metro & bus planner', color: 'text-teal' }, { name: 'Uber', use: 'Taxis', color: 'text-accent' }, { name: 'Citymapper', use: 'All transit modes', color: 'text-blue-400' }],
  tokyo:     [{ name: 'Google Maps', use: 'Train & subway routes', color: 'text-blue-400' }, { name: 'Suica/Pasmo', use: 'IC card for all transit', color: 'text-teal' }, { name: 'Hyperdia', use: 'Train planner', color: 'text-accent' }],
  dubai:     [{ name: 'Careem', use: 'Rides (local Uber)', color: 'text-teal' }, { name: 'RTA Dubai', use: 'Metro & bus info', color: 'text-accent' }, { name: 'Google Maps', use: 'Navigation', color: 'text-blue-400' }],
  goa:       [{ name: 'Goa Miles', use: 'Metered taxis', color: 'text-teal' }, { name: 'Rapido', use: 'Bike taxis', color: 'text-accent' }, { name: 'Google Maps', use: 'Navigation', color: 'text-blue-400' }],
  delhi:     [{ name: 'Delhi Metro App', use: 'Metro routes & fares', color: 'text-teal' }, { name: 'Uber / Ola', use: 'Cab booking', color: 'text-accent' }, { name: 'Google Maps', use: 'Navigation', color: 'text-blue-400' }],
  mumbai:    [{ name: 'BEST Bus App', use: 'Bus routes', color: 'text-teal' }, { name: 'Uber / Ola', use: 'Cab booking', color: 'text-accent' }, { name: 'Google Maps', use: 'Local train routes', color: 'text-blue-400' }],
  singapore: [{ name: 'SG BusRouter', use: 'Bus & MRT routes', color: 'text-teal' }, { name: 'Grab', use: 'Rides & delivery', color: 'text-accent' }, { name: 'Google Maps', use: 'Navigation', color: 'text-blue-400' }],
  london:    [{ name: 'Citymapper', use: 'Best transit app in London', color: 'text-teal' }, { name: 'TfL Go', use: 'Tube & bus official app', color: 'text-accent' }, { name: 'Uber', use: 'Taxis', color: 'text-blue-400' }],
};

export default function GettingThereAround({ city }: { city: City }) {
  const apps = essentialApps[city.slug] ?? [];
  const hasLocalTips = city.gettingAround && city.gettingAround.length > 0;
  if (!hasLocalTips && apps.length === 0) return null;

  return (
    <section id="getting-around" className="py-14 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div        >
          {/* Header */}
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
              <Navigation size={15} className="text-accent" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">Getting Around</p>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-primary-text mb-8">
            Getting Around {city.name}
          </h2>
          {city.gettingAroundSynthetic && (
            <p className="text-sm text-muted leading-relaxed max-w-2xl -mt-5 mb-8">
              A destination-planning framework rather than operator-specific advice. Check current local routes, fares, and licensed transport options before travelling.
            </p>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8">

            {/* Transport tips */}
            {hasLocalTips && (
              <div className="space-y-3">
                {city.gettingAround!.map((tip, i) => (
                  <div
                    key={i}                    className="flex gap-4 p-4 bg-surface border border-border rounded-xl"
                  >
                    <div className="w-7 h-7 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Navigation size={13} className="text-accent" />
                    </div>
                    <p className="text-sm text-primary-text/80 leading-relaxed">{tip}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Essential apps + insider tip */}
            <div className="space-y-4">
              {apps.length > 0 && (
                <div className="bg-surface border border-border rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Smartphone size={15} className="text-teal" />
                    <p className="text-xs font-bold uppercase tracking-widest text-teal">Essential Apps</p>
                  </div>
                  <div className="space-y-3">
                    {apps.map((app) => (
                      <div key={app.name} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-elevated flex items-center justify-center flex-shrink-0">
                          <span className="text-sm">📱</span>
                        </div>
                        <div className="min-w-0">
                          <p className={`text-sm font-semibold ${app.color}`}>{app.name}</p>
                          <p className="text-xs text-muted">{app.use}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pro tip from getting there */}
              {city.gettingThere?.bookingTip && (
                <div className="p-4 bg-gold/5 border border-gold/20 rounded-xl flex gap-3">
                  <Lightbulb size={14} className="text-gold flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-primary-text/75 leading-relaxed italic">
                    {city.gettingThere.bookingTip}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
