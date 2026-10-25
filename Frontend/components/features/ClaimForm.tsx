"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { downloadInsurancePdf, fetchAccount } from "@/lib/api";
import { isDemoMode } from "@/lib/demo";
import {
  claimForIncident,
  claimSummaryLines,
  demoSeed,
  type Claim,
  type DemoUser,
} from "@/lib/demo-data";
import { readDemoProfile } from "@/lib/demo-store";
import { buildClaimPdf, downloadBlob } from "@/lib/pdf";

function IncidentSync({ onIncident }: { onIncident: (incidentId: string | null) => void }) {
  const incidentId = useSearchParams().get("incident");
  useEffect(() => {
    onIncident(incidentId);
  }, [incidentId, onIncident]);
  return null;
}

export default function ClaimForm() {
  const demo = isDemoMode();
  const [incidentId, setIncidentId] = useState<string | null>(null);
  const [claims, setClaims] = useState<Claim[]>(demo ? demoSeed.claims : []);
  const [form, setForm] = useState<Claim>(() => claimForIncident(incidentId, demoSeed.user));
  const [result, setResult] = useState<string[] | null>(null);
  const [pdfNote, setPdfNote] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (demo) {
      setClaims(demoSeed.claims);
      setForm(claimForIncident(incidentId, readDemoProfile()));
      return;
    }

    let cancelled = false;
    fetchAccount()
      .then((account) => {
        if (cancelled) return;
        const profile: DemoUser = {
          ...demoSeed.user,
          username: account.username || demoSeed.user.username,
          full_name: account.full_name,
          email: account.email,
        };
        setClaims(account.claims);
        const match =
          account.claims.find((claim) => claim.incidentId === incidentId) ?? account.claims[0];
        setForm(match ? { ...match, claimantName: profile.full_name, email: profile.email } : claimForIncident(incidentId, profile));
      })
      .catch((fetchError: unknown) => {
        if (!cancelled) {
          setError(fetchError instanceof Error ? fetchError.message : "The account could not be loaded.");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [demo, incidentId]);

  const selectClaim = (claim: Claim) => {
    setForm(claimForIncident(claim.incidentId, readDemoProfile()));
    setResult(null);
    setPdfNote(null);
    setError(null);
  };

  const update = (key: keyof Claim, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    const lines = claimSummaryLines(form);
    setResult(lines);

    try {
      if (demo) {
        downloadBlob(buildClaimPdf(lines), `activeguard-${form.id}.pdf`);
        setPdfNote("A one-page PDF was generated in your browser.");
      } else {
        const blob = await downloadInsurancePdf();
        downloadBlob(blob, "filledIn.pdf");
        setPdfNote("Downloaded filledIn.pdf from the API.");
      }
    } catch (submitError) {
      setPdfNote(null);
      setError(
        submitError instanceof Error
          ? submitError.message
          : "The PDF could not be created. The summary below is the mock claim."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8">
      <Suspense fallback={null}>
        <IncidentSync onIncident={setIncidentId} />
      </Suspense>
      <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-lg sm:p-8">
        <h1 className="mb-2 text-center text-3xl font-bold text-cyan-400">Autofill claims form</h1>
        <p className="mb-6 text-center text-gray-300">
          {demo
            ? "Sample claim, filled from the demo profile. Edit anything, then generate the PDF."
            : "Review the claim, then download the form from the API."}
        </p>

        {demo && (
          <div className="mb-6 space-y-2">
            {claims.map((claim) => {
              const selected = claim.id === form.id || claim.incidentId === form.incidentId;
              return (
                <button
                  key={claim.id}
                  type="button"
                  onClick={() => selectClaim(claim)}
                  className={`block w-full rounded-xl border px-4 py-3 text-left transition ${
                    selected
                      ? "border-cyan-400 bg-gray-800"
                      : "border-gray-700 bg-gray-800/60 hover:border-cyan-700"
                  }`}
                >
                  <span className="block font-semibold text-white">{claim.location}</span>
                  <span className="text-sm text-gray-400">
                    {claim.accidentDate} · {claim.status}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <Field label="Full name" value={form.claimantName} onChange={(value) => update("claimantName", value)} />
          <Field label="Email" type="email" value={form.email} onChange={(value) => update("email", value)} />
          <Field label="Phone" value={form.phone} onChange={(value) => update("phone", value)} />
          <Field label="ID number" value={form.idNumber} onChange={(value) => update("idNumber", value)} />
          <Field label="Home address" value={form.homeAddress} onChange={(value) => update("homeAddress", value)} />
          <Field label="Insurer" value={form.insurer} onChange={(value) => update("insurer", value)} />
          <Field label="Policy number" value={form.policyNumber} onChange={(value) => update("policyNumber", value)} />
          <Field label="Vehicle" value={form.vehicle} onChange={(value) => update("vehicle", value)} />
          <Field label="Registration" value={form.registration} onChange={(value) => update("registration", value)} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Accident date" value={form.accidentDate} onChange={(value) => update("accidentDate", value)} />
            <Field label="Accident time" value={form.accidentTime} onChange={(value) => update("accidentTime", value)} />
          </div>
          <Field label="Location" value={form.location} onChange={(value) => update("location", value)} />
          <Field label="Weather" value={form.weather} onChange={(value) => update("weather", value)} />
          <div>
            <label htmlFor="description" className="mb-2 block text-sm font-bold text-gray-300">
              What happened
            </label>
            <textarea
              id="description"
              value={form.description}
              onChange={(event) => update("description", event.target.value)}
              rows={5}
              required
              className="w-full rounded-lg bg-gray-700 p-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-cyan-500 py-3 font-bold text-white transition hover:bg-cyan-600 disabled:opacity-60"
          >
            {submitting ? "Preparing claim…" : "Generate claim PDF"}
          </button>
        </form>

        {error && <p className="mt-4 text-center text-red-400">{error}</p>}
        {pdfNote && <p className="mt-4 text-center text-green-400">{pdfNote}</p>}

        {result && (
          <div className="mt-6 rounded-xl border border-gray-700 bg-gray-800 p-4">
            <h2 className="mb-3 text-lg font-semibold text-cyan-300">Mock claim result</h2>
            <pre className="whitespace-pre-wrap text-sm text-gray-200">{result.join("\n")}</pre>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  const id = label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-bold text-gray-300">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required
        className="w-full rounded-lg bg-gray-700 p-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
      />
    </div>
  );
}
