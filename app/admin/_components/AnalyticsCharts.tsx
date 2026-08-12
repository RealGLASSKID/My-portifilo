"use client";

import type { AnalyticsSummary } from "@/lib/analytics";

function BarChart({ data }: { data: { label: string; value: number }[] }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <div className="flex h-40 items-end gap-2">
      {data.map((d) => {
        const h = Math.max(4, Math.round((d.value / max) * 100));
        return (
          <div key={d.label} className="flex min-w-0 flex-1 flex-col items-center gap-1">
            <span className="text-[0.65rem] tabular-nums text-muted-foreground">{d.value}</span>
            <div
              className="w-full max-w-[2.5rem] rounded-t-md bg-gradient-to-t from-primary/40 to-primary transition-all"
              style={{ height: `${h}%` }}
              title={`${d.label}: ${d.value}`}
            />
            <span className="w-full truncate text-center text-[0.6rem] text-muted-foreground">
              {d.label.slice(5)} {/* MM-DD */}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function AnalyticsCharts({ summary }: { summary: AnalyticsSummary }) {
  const chartData = summary.last7Days.map((d) => ({
    label: d.date,
    value: d.views,
  }));

  return (
    <div className="mt-4 grid gap-4 lg:grid-cols-3">
      <div className="glass-card space-y-4 p-5 lg:col-span-2">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h3 className="text-base font-semibold">Views — last 7 days</h3>
            <p className="text-xs text-muted-foreground">Tracked on your site (Firestore)</p>
          </div>
          <div className="flex gap-4 text-sm">
            <div>
              <div className="text-lg font-bold tabular-nums">{summary.todayViews}</div>
              <div className="text-[0.65rem] uppercase tracking-wider text-muted-foreground">Today</div>
            </div>
            <div>
              <div className="text-lg font-bold tabular-nums">{summary.totalViews}</div>
              <div className="text-[0.65rem] uppercase tracking-wider text-muted-foreground">
                {summary.last7Days.length}d total
              </div>
            </div>
          </div>
        </div>
        {summary.last7Days.every((d) => d.views === 0) ? (
          <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
            No views yet — browse the public site to start collecting data.
          </div>
        ) : (
          <BarChart data={chartData} />
        )}
      </div>

      <div className="glass-card space-y-3 p-5">
        <h3 className="text-base font-semibold">Top pages</h3>
        {summary.topPaths.length === 0 ? (
          <p className="text-sm text-muted-foreground">No path data yet.</p>
        ) : (
          <ul className="space-y-2">
            {summary.topPaths.map((p) => (
              <li key={p.path} className="flex items-center justify-between gap-3 text-sm">
                <span className="truncate font-medium text-foreground/90">{p.path}</span>
                <span className="shrink-0 tabular-nums text-muted-foreground">{p.views}</span>
              </li>
            ))}
          </ul>
        )}
        <div className="border-t border-white/5 pt-3 text-xs text-muted-foreground">
          Unique visitors (period):{" "}
          <span className="font-semibold text-foreground">{summary.totalVisitors}</span>
        </div>
      </div>
    </div>
  );
}
