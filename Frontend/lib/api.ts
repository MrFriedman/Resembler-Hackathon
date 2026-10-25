import { getApiBase, isDemoMode } from "@/lib/demo";
import {
  demoSeed,
  type Claim,
  type CloseCall,
  type Incident,
  type MapPoint,
  type NotificationItem,
} from "@/lib/demo-data";
import { readDemoProfile, saveDemoProfile } from "@/lib/demo-store";

export type AccountPayload = {
  username: string;
  full_name: string;
  email: string;
  notifications: NotificationItem[];
  incidents: Incident[];
  closeCalls: CloseCall[];
  claims: Claim[];
  mapPoints: MapPoint[];
};

export type ApiResult = {
  ok: boolean;
  message: string;
};

export async function fetchAccount(): Promise<AccountPayload> {
  if (isDemoMode()) {
    const profile = readDemoProfile();
    return {
      username: profile.username,
      full_name: profile.full_name,
      email: profile.email,
      notifications: demoSeed.notifications,
      incidents: demoSeed.incidents,
      closeCalls: demoSeed.closeCalls,
      claims: demoSeed.claims,
      mapPoints: demoSeed.mapPoints,
    };
  }

  const data = await requestJson("/api/user/account");
  return {
    username: stringField(data, "username"),
    full_name: stringField(data, "full_name"),
    email: stringField(data, "email"),
    notifications: arrayField<NotificationItem>(data, "notifications"),
    incidents: arrayField<Incident>(data, "incidents"),
    closeCalls: arrayField<CloseCall>(data, "closeCalls"),
    claims: arrayField<Claim>(data, "claims"),
    mapPoints: arrayField<MapPoint>(data, "mapPoints"),
  };
}

export async function fetchMapPoints(): Promise<MapPoint[]> {
  if (isDemoMode()) return demoSeed.mapPoints;

  const response = await fetch("/api/accident-location");
  if (!response.ok) {
    throw new Error("Failed to fetch map points");
  }
  const data = (await response.json()) as {
    points?: MapPoint[];
    accident?: number[];
  };
  if (Array.isArray(data.points)) return data.points;
  if (Array.isArray(data.accident) && data.accident.length >= 2) {
    return [
      {
        id: "accident",
        kind: "incident",
        label: "Accident location",
        detail: "Reported accident",
        lat: data.accident[1],
        lng: data.accident[0],
      },
    ];
  }
  return [];
}

export async function registerUser(body: {
  username: string;
  fullName: string;
  email: string;
  password: string;
  dob: string;
}): Promise<ApiResult> {
  if (isDemoMode()) {
    saveDemoProfile({
      username: body.username || "User",
      full_name: body.fullName,
      email: body.email,
      dob: body.dob,
    });
    return { ok: true, message: "Registration successful!" };
  }

  const data = await requestJson("/api/user/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: body.username,
      fullName: body.fullName,
      email: body.email,
      password: body.password,
      dob: body.dob,
    }),
  });
  return { ok: true, message: stringField(data, "message") || "Registration successful!" };
}

export async function updateAccount(body: {
  full_name: string;
  id_number: string;
  phone_number: string;
  home_address: string;
  insurance_name: string;
  insurance_number: string;
  license_plate: string;
}): Promise<ApiResult> {
  if (isDemoMode()) {
    saveDemoProfile(body);
    return { ok: true, message: "Account saved in this browser session." };
  }

  const data = await requestJson("/api/user/update-information", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return { ok: true, message: stringField(data, "message") || "Account updated" };
}

export async function downloadInsurancePdf(): Promise<Blob> {
  const base = requireApiBase();
  const response = await fetch(`${base}/api/user/insurance-form`);
  if (!response.ok) {
    throw new Error("The insurance form could not be downloaded.");
  }
  return response.blob();
}

async function requestJson(path: string, init?: RequestInit): Promise<Record<string, unknown>> {
  const base = requireApiBase();
  let response: Response;
  try {
    response = await fetch(`${base}${path}`, init);
  } catch {
    throw new Error("The API could not be reached.");
  }
  const data = (await response.json().catch(() => ({}))) as Record<string, unknown>;
  if (!response.ok) {
    throw new Error(stringField(data, "message") || "Request failed.");
  }
  return data;
}

function requireApiBase(): string {
  const base = getApiBase();
  if (!base) {
    throw new Error("Set NEXT_PUBLIC_API_URL to reach the Flask API.");
  }
  return base;
}

function stringField(data: Record<string, unknown>, key: string): string {
  const value = data[key];
  return typeof value === "string" ? value : "";
}

function arrayField<T>(data: Record<string, unknown>, key: string): T[] {
  const value = data[key];
  return Array.isArray(value) ? (value as T[]) : [];
}
