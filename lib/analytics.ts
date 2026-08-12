"use server";

import { db } from "@/lib/firebase-admin";

const COLLECTION = "pageViews";

export type DayBucket = {
  date: string; // YYYY-MM-DD
  views: number;
  visitors: number;
};

export type PathStat = {
  path: string;
  views: number;
};

export type AnalyticsSummary = {
  totalViews: number;
  totalVisitors: number;
  todayViews: number;
  todayVisitors: number;
  last7Days: DayBucket[];
  topPaths: PathStat[];
};

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

/** Record a page view (called from a client beacon / route) */
export async function recordPageView(input: {
  path: string;
  visitorId: string;
  referrer?: string;
}) {
  const path = (input.path || "/").slice(0, 200);
  const visitorId = (input.visitorId || "anon").slice(0, 64);
  const day = todayKey();
  const now = Date.now();

  const dayRef = db.collection(COLLECTION).doc(day);
  const visitRef = dayRef.collection("visits").doc();

  await db.runTransaction(async (tx) => {
    const snap = await tx.get(dayRef);
    const data = snap.exists ? snap.data()! : { views: 0, visitors: 0, paths: {} as Record<string, number>, visitorIds: {} as Record<string, boolean> };
    const paths = { ...(data.paths || {}) };
    paths[path] = (paths[path] || 0) + 1;
    const visitorIds = { ...(data.visitorIds || {}) };
    const isNew = !visitorIds[visitorId];
    if (isNew) visitorIds[visitorId] = true;

    tx.set(
      dayRef,
      {
        views: (data.views || 0) + 1,
        visitors: isNew ? (data.visitors || 0) + 1 : data.visitors || 0,
        paths,
        visitorIds,
        updatedAt: now,
      },
      { merge: true }
    );
    tx.set(visitRef, {
      path,
      visitorId,
      referrer: input.referrer || "",
      createdAt: now,
    });
  });

  return { success: true as const };
}

export async function getAnalyticsSummary(days = 14): Promise<AnalyticsSummary> {
  const end = new Date();
  const keys: string[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(end);
    d.setDate(d.getDate() - i);
    keys.push(d.toISOString().slice(0, 10));
  }

  const snaps = await Promise.all(keys.map((k) => db.collection(COLLECTION).doc(k).get()));

  let totalViews = 0;
  let totalVisitors = 0;
  const pathTotals: Record<string, number> = {};
  const last7Days: DayBucket[] = [];

  snaps.forEach((snap, i) => {
    const key = keys[i];
    const data = snap.exists ? snap.data()! : { views: 0, visitors: 0, paths: {} };
    const views = data.views || 0;
    const visitors = data.visitors || 0;
    totalViews += views;
    totalVisitors += visitors;
    const paths = data.paths || {};
    Object.entries(paths).forEach(([p, v]) => {
      pathTotals[p] = (pathTotals[p] || 0) + (v as number);
    });
    // keep last 7 for the chart (tail of the range)
    if (i >= keys.length - 7) {
      last7Days.push({ date: key, views, visitors });
    }
  });

  const today = todayKey();
  const todaySnap = snaps[snaps.length - 1];
  const todayData = todaySnap?.exists ? todaySnap.data()! : { views: 0, visitors: 0 };

  const topPaths = Object.entries(pathTotals)
    .map(([path, views]) => ({ path, views }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 8);

  return {
    totalViews,
    totalVisitors,
    todayViews: todayData.views || 0,
    todayVisitors: todayData.visitors || 0,
    last7Days,
    topPaths,
  };
}
