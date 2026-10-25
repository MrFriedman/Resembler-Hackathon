import type { Session } from "next-auth";
import seedJson from "@/data/demo-seed.json";

export type DemoUser = {
  id: string;
  username: string;
  full_name: string;
  email: string;
  id_number: string;
  phone_number: string;
  home_address: string;
  dob: string;
  insurance_name: string;
  insurance_number: string;
  license_plate: string;
};

export type NotificationItem = {
  notification_id: string;
  incident_id: string;
  message: string;
};

export type Incident = {
  id: string;
  title: string;
  summary: string;
  severity: number;
  occurredAt: string;
  street: string;
  lat: number;
  lng: number;
  weather: string;
  vehicle: string;
  registration: string;
};

export type CloseCall = {
  id: string;
  title: string;
  message: string;
  recordedAt: string;
  lat: number;
  lng: number;
};

export type Claim = {
  id: string;
  incidentId: string;
  status: string;
  insurer: string;
  policyNumber: string;
  claimantName: string;
  email: string;
  phone: string;
  idNumber: string;
  homeAddress: string;
  vehicle: string;
  registration: string;
  accidentDate: string;
  accidentTime: string;
  location: string;
  weather: string;
  description: string;
};

export type MapPoint = {
  id: string;
  kind: "incident" | "close_call";
  label: string;
  detail: string;
  lat: number;
  lng: number;
};

type DemoSeed = {
  user: DemoUser;
  notifications: NotificationItem[];
  incidents: Incident[];
  closeCalls: CloseCall[];
  claims: Claim[];
  mapPoints: MapPoint[];
};

export const demoSeed = seedJson as DemoSeed;

export const demoAuthSession: Session = {
  user: {
    name: demoSeed.user.full_name,
    email: demoSeed.user.email,
  },
  expires: "2099-01-01T00:00:00.000Z",
};

export function claimForIncident(incidentId: string | null, profile: DemoUser): Claim {
  const seeded = demoSeed.claims.find((claim) => claim.incidentId === incidentId);
  const incident = demoSeed.incidents.find((item) => item.id === incidentId);
  const base = seeded ?? (incident ? claimFromIncident(incident, profile) : demoSeed.claims[0]);
  return applyProfile(base, profile);
}

export function applyProfile(claim: Claim, profile: DemoUser): Claim {
  return {
    ...claim,
    claimantName: profile.full_name || claim.claimantName,
    email: profile.email || claim.email,
    phone: profile.phone_number || claim.phone,
    idNumber: profile.id_number || claim.idNumber,
    homeAddress: profile.home_address || claim.homeAddress,
    insurer: profile.insurance_name || claim.insurer,
    policyNumber: profile.insurance_number || claim.policyNumber,
    registration: profile.license_plate || claim.registration,
  };
}

export function claimSummaryLines(claim: Claim): string[] {
  return [
    "ActiveGuard insurance claim",
    "Hackathon demo. This PDF was generated in the browser and was not sent to an insurer.",
    "",
    `Claim: ${claim.id}`,
    `Status: ${claim.status}`,
    `Claimant: ${claim.claimantName}`,
    `ID: ${claim.idNumber}`,
    `Email: ${claim.email}`,
    `Phone: ${claim.phone}`,
    `Home address: ${claim.homeAddress}`,
    `Insurer: ${claim.insurer}`,
    `Policy number: ${claim.policyNumber}`,
    `Vehicle: ${claim.vehicle}`,
    `Registration: ${claim.registration}`,
    `Date: ${claim.accidentDate}`,
    `Time: ${claim.accidentTime}`,
    `Location: ${claim.location}`,
    `Weather: ${claim.weather}`,
    "Description:",
    claim.description,
  ];
}

function claimFromIncident(incident: Incident, profile: DemoUser): Claim {
  const [date, time] = incident.occurredAt.split(" ");
  return {
    id: `draft-${incident.id}`,
    incidentId: incident.id,
    status: "draft",
    insurer: profile.insurance_name,
    policyNumber: profile.insurance_number,
    claimantName: profile.full_name,
    email: profile.email,
    phone: profile.phone_number,
    idNumber: profile.id_number,
    homeAddress: profile.home_address,
    vehicle: incident.vehicle,
    registration: incident.registration || profile.license_plate,
    accidentDate: date || incident.occurredAt,
    accidentTime: time || "",
    location: incident.street,
    weather: incident.weather,
    description: incident.summary,
  };
}
