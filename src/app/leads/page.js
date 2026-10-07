"use client";

import { Fragment, useEffect, useState } from "react";

function formatValue(value) {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return String(value);
}

function formatDate(value) {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleString("en-GB", {
      timeZone: "Europe/London",
      dateStyle: "medium",
      timeStyle: "medium",
    });
  } catch {
    return String(value);
  }
}

function LeadDetails({ lead }) {
  const rows = [
    ["Lead ID", lead.id],
    ["Status", lead.status],
    ["Created (UK)", formatDate(lead.createdAt || lead.created_at)],
    ["Updated (UK)", formatDate(lead.updatedAt || lead.updated_at)],
    ["Source", lead.source],
    ["Name", lead.name],
    ["Email", lead.email],
    ["Phone", lead.number || lead.phone],
    ["Postcode", lead.postcode],
    ["Description", lead.description],
    ["VRM", lead.vehicle_vrm],
    ["Reg", lead.vehicle_reg],
    ["Brand", lead.vehicle_brand],
    ["Model", lead.vehicle_model],
    ["Series", lead.vehicle_series],
    ["Year", lead.vehicle_year],
    ["Fuel type", lead.fuelType || lead.fuel_type],
    ["Engine capacity", lead.engin_capacity || lead.engine_capacity],
    ["Part", lead.vehicle_part],
    ["Engine code", lead.engine_code],
    ["Assigned to", lead.assigned_to],
    ["Notes", lead.notes],
    ["HQ lead", lead.isHqLead],
    ["Deleted", lead.is_deleted],
  ];

  return (
    <div className="grid gap-2 border-t border-[var(--color-border)] bg-[var(--color-page-soft)] px-3 py-3 sm:grid-cols-2 lg:grid-cols-3">
      {rows.map(([label, value]) => (
        <div key={label} className="min-w-0">
          <p className="text-[0.68rem] font-bold uppercase tracking-wide text-[var(--color-text-soft)]">{label}</p>
          <p className="break-words text-sm text-[var(--color-text)]">{formatValue(value)}</p>
        </div>
      ))}
    </div>
  );
}

export default function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openId, setOpenId] = useState(null);

  async function loadLeads() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/leads?limit=200", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to load leads");
      }
      setLeads(data.leads || []);
    } catch (err) {
      setError(err.message || "Failed to load leads");
      setLeads([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLeads();
  }, []);

  return (
    <main className="mx-auto w-full max-w-8xl px-4 py-8 md:px-8 md:py-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)] md:text-3xl">Leads</h1>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            Source filter: <strong>bmwengines.uk</strong> · click a row for full details
          </p>
        </div>
        <button
          type="button"
          onClick={loadLeads}
          disabled={loading}
          className="rounded border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm font-semibold text-[var(--color-text)] disabled:opacity-60"
        >
          {loading ? "Loading…" : "Refresh"}
        </button>
      </div>

      {error ? (
        <p className="mt-4 rounded border border-[var(--color-accent-red)]/30 bg-[var(--color-accent-red-soft)] px-3 py-2 text-sm text-[var(--color-accent-red)]">
          {error}
        </p>
      ) : null}

      {!loading && !error ? (
        <p className="mt-3 text-sm text-[var(--color-text-soft)]">{leads.length} lead(s)</p>
      ) : null}

      <div className="mt-4 overflow-x-auto rounded border border-[var(--color-border)] bg-[var(--color-surface)]">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead className="bg-[var(--color-page-soft)] text-xs uppercase tracking-wide text-[var(--color-text-muted)]">
            <tr>
              <th className="whitespace-nowrap px-3 py-2 font-bold">ID</th>
              <th className="whitespace-nowrap px-3 py-2 font-bold">Created</th>
              <th className="whitespace-nowrap px-3 py-2 font-bold">Name</th>
              <th className="whitespace-nowrap px-3 py-2 font-bold">Email</th>
              <th className="whitespace-nowrap px-3 py-2 font-bold">Phone</th>
              <th className="whitespace-nowrap px-3 py-2 font-bold">Postcode</th>
              <th className="whitespace-nowrap px-3 py-2 font-bold">VRM</th>
              <th className="whitespace-nowrap px-3 py-2 font-bold">Brand</th>
              <th className="whitespace-nowrap px-3 py-2 font-bold">Model</th>
              <th className="whitespace-nowrap px-3 py-2 font-bold">Series</th>
              <th className="whitespace-nowrap px-3 py-2 font-bold">Year</th>
              <th className="whitespace-nowrap px-3 py-2 font-bold">Fuel</th>
              <th className="whitespace-nowrap px-3 py-2 font-bold">Capacity</th>
              <th className="whitespace-nowrap px-3 py-2 font-bold">Part</th>
              <th className="whitespace-nowrap px-3 py-2 font-bold">Status</th>
              <th className="whitespace-nowrap px-3 py-2 font-bold">Source</th>
              <th className="whitespace-nowrap px-3 py-2 font-bold">Notes</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={17} className="px-3 py-6 text-center text-[var(--color-text-soft)]">
                  Loading leads…
                </td>
              </tr>
            ) : leads.length === 0 ? (
              <tr>
                <td colSpan={17} className="px-3 py-6 text-center text-[var(--color-text-soft)]">
                  No leads found for bmwengines.uk
                </td>
              </tr>
            ) : (
              leads.map((lead) => {
                const rowId = lead.id || `${lead.email}-${lead.createdAt || lead.created_at}`;
                const isOpen = openId === rowId;
                return (
                  <Fragment key={rowId}>
                    <tr
                      className="cursor-pointer border-t border-[var(--color-border)] hover:bg-[var(--color-page-soft)]"
                      onClick={() => setOpenId(isOpen ? null : rowId)}
                    >
                      <td className="whitespace-nowrap px-3 py-2 text-[var(--color-text-muted)]">{formatValue(lead.id)}</td>
                      <td className="whitespace-nowrap px-3 py-2 text-[var(--color-text-muted)]">
                        {formatDate(lead.createdAt || lead.created_at)}
                      </td>
                      <td className="px-3 py-2 font-semibold text-[var(--color-text)]">{formatValue(lead.name)}</td>
                      <td className="px-3 py-2 text-[var(--color-text)]">{formatValue(lead.email)}</td>
                      <td className="px-3 py-2 text-[var(--color-text)]">{formatValue(lead.number || lead.phone)}</td>
                      <td className="px-3 py-2 text-[var(--color-text)]">{formatValue(lead.postcode)}</td>
                      <td className="px-3 py-2 font-semibold text-[var(--color-text)]">
                        {formatValue(lead.vehicle_vrm || lead.vehicle_reg)}
                      </td>
                      <td className="px-3 py-2 text-[var(--color-text)]">{formatValue(lead.vehicle_brand)}</td>
                      <td className="px-3 py-2 text-[var(--color-text)]">{formatValue(lead.vehicle_model)}</td>
                      <td className="px-3 py-2 text-[var(--color-text)]">{formatValue(lead.vehicle_series)}</td>
                      <td className="px-3 py-2 text-[var(--color-text)]">{formatValue(lead.vehicle_year)}</td>
                      <td className="px-3 py-2 text-[var(--color-text)]">{formatValue(lead.fuelType || lead.fuel_type)}</td>
                      <td className="px-3 py-2 text-[var(--color-text)]">
                        {formatValue(lead.engin_capacity || lead.engine_capacity)}
                      </td>
                      <td className="px-3 py-2 text-[var(--color-text)]">{formatValue(lead.vehicle_part)}</td>
                      <td className="px-3 py-2 text-[var(--color-text)]">{formatValue(lead.status)}</td>
                      <td className="px-3 py-2 text-[var(--color-text-muted)]">{formatValue(lead.source)}</td>
                      <td className="max-w-[180px] truncate px-3 py-2 text-[var(--color-text-muted)]" title={lead.description || ""}>
                        {formatValue(lead.description)}
                      </td>
                    </tr>
                    {isOpen ? (
                      <tr>
                        <td colSpan={17} className="p-0">
                          <LeadDetails lead={lead} />
                        </td>
                      </tr>
                    ) : null}
                  </Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
