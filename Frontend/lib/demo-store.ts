import { demoSeed, type DemoUser } from "@/lib/demo-data";

const STORAGE_KEY = "activeguard.demo.profile";

export function readDemoProfile(): DemoUser {
  const base: DemoUser = { ...demoSeed.user };
  if (typeof window === "undefined") return base;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return base;
    const parsed = JSON.parse(raw) as Partial<DemoUser>;
    return { ...base, ...parsed };
  } catch {
    return base;
  }
}

export function saveDemoProfile(patch: Partial<DemoUser>): DemoUser {
  const next = { ...readDemoProfile(), ...patch };
  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}
