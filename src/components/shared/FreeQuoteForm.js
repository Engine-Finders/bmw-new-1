"use client";

import Image from "next/image";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { buildQuoteLeadPayload } from "@/app/api/crm/sendLeadToCRM";
import { resolveModelImage } from "@/components/shared/resolveModelImage";

const HEADER_BG = "/cars/home/grille-angled-dark.webp";

const emptyVehicle = {
  vrm: "",
  brand: "",
  series: "",
  year: "",
  fuelType: "",
  engineCapacity: "",
  colour: "",
  wheelplan: "",
};

function formatPlate(vrm = "") {
  const clean = String(vrm).replace(/\s+/g, "").toUpperCase();
  if (clean.length <= 3) return clean;
  return `${clean.slice(0, -3)} ${clean.slice(-3)}`;
}

function engineLitres(capacity) {
  const raw = String(capacity || "").replace(/[^\d.]/g, "");
  const num = Number(raw);
  if (!Number.isFinite(num) || num <= 0) return "";
  if (num >= 100) return `${(num / 1000).toFixed(1)}L`;
  return `${num}L`;
}

function colourSwatch(colour = "") {
  const key = String(colour).toLowerCase();
  if (/white|alpine|mineral|silver|grey|gray|polaris/.test(key)) return "#e8eef5";
  if (/black|sapphire|carbon|jet/.test(key)) return "#1a1f26";
  if (/blue|atlantic|portimao|san.?marino/.test(key)) return "#1d4ed8";
  if (/red|melbourne|imola|fire/.test(key)) return "#c41e2a";
  if (/green|british|isle/.test(key)) return "#1f6b3a";
  if (/yellow|orange/.test(key)) return "#f5b301";
  if (/brown|bronze|champagne/.test(key)) return "#8b6914";
  return "#94a3b8";
}

function Icon({ name, className = "h-4 w-4" }) {
  const common = { className, fill: "none", stroke: "currentColor", strokeWidth: "1.7", viewBox: "0 0 24 24", "aria-hidden": true };
  if (name === "user")
    return (
      <svg {...common}>
        <path d="M20 21a8 8 0 0 0-16 0" strokeLinecap="round" />
        <circle cx="12" cy="8" r="4" />
      </svg>
    );
  if (name === "mail")
    return (
      <svg {...common}>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m4 7 8 6 8-6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  if (name === "phone")
    return (
      <svg {...common}>
        <path d="M6.5 3.5h3l1.5 4-2 1.5a12 12 0 0 0 5.5 5.5l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A16 16 0 0 1 3.5 8.7a2 2 0 0 1 3-5.2Z" strokeLinejoin="round" />
      </svg>
    );
  if (name === "pin")
    return (
      <svg {...common}>
        <path d="M12 21s7-5.4 7-11a7 7 0 1 0-14 0c0 5.6 7 11 7 11Z" />
        <circle cx="12" cy="10" r="2.2" />
      </svg>
    );
  if (name === "chat")
    return (
      <svg {...common}>
        <path d="M5 18.5 3.5 21V7a3 3 0 0 1 3-3h11a3 3 0 0 1 3 3v8.5a3 3 0 0 1-3 3H5Z" strokeLinejoin="round" />
        <path d="M8 9.5h8M8 13h5" strokeLinecap="round" />
      </svg>
    );
  if (name === "calendar")
    return (
      <svg {...common}>
        <rect x="3.5" y="5" width="17" height="15" rx="2" />
        <path d="M8 3.5v3M16 3.5v3M3.5 10h17" strokeLinecap="round" />
      </svg>
    );
  if (name === "fuel")
    return (
      <svg {...common}>
        <path d="M6 20V6a2 2 0 0 1 2-2h5a2 2 0 0 1 2 2v14M6 20h9M10 9h3" strokeLinecap="round" />
        <path d="M15 9h2.5a2 2 0 0 1 2 2v5.5a1.5 1.5 0 0 0 3 0V10l-2-2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  if (name === "engine")
    return (
      <svg {...common}>
        <path d="M4 13h2l2-3h3l1.5 3H16l2 2v3H5.5L4 16v-3Z" strokeLinejoin="round" />
        <path d="M9 10V7h4v3M18 12h2M7 18v2" strokeLinecap="round" />
      </svg>
    );
  if (name === "lock")
    return (
      <svg {...common}>
        <rect x="5" y="11" width="14" height="10" rx="2" />
        <path d="M8 11V8a4 4 0 0 1 8 0v3" strokeLinecap="round" />
      </svg>
    );
  if (name === "arrow")
    return (
      <svg {...common}>
        <path d="M4 12h14m-6-6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  if (name === "close")
    return (
      <svg {...common}>
        <path d="M7 7l10 10M17 7 7 17" strokeLinecap="round" />
      </svg>
    );
  return null;
}

function Field({ id, label, icon, children }) {
  return (
    <label htmlFor={id} className="block min-w-0">
      <span className="mb-1 block text-[12px] font-bold text-[var(--color-text)]">{label}</span>
      <span className="relative block">
        <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--color-text-soft)]">
          <Icon name={icon} className="h-4 w-4" />
        </span>
        {children}
      </span>
    </label>
  );
}

const inputClass =
  "w-full rounded-[7px] border border-[var(--color-border)] bg-white py-2.5 pl-9 pr-2.5 text-[13px] text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-soft)] focus:border-[var(--color-primary)]";

function UkPlate({ value, onChange, readOnly = false, inputId = "sticky-reg" }) {
  return (
    <div className="flex min-h-[42px] flex-1 overflow-hidden rounded-[6px] border border-[#1a1a1a] bg-[#f5c518] shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]">
      <span className="flex w-8 shrink-0 flex-col items-center justify-center gap-0.5 bg-[#003399] py-1 text-[9px] font-bold leading-none text-white">
        <span aria-hidden="true" className="mb-0.5 grid grid-cols-3 gap-[1px]">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="h-[2.5px] w-[2.5px] rounded-full bg-[#fc0]" />
          ))}
        </span>
        GB
      </span>
      {readOnly ? (
        <span className="flex flex-1 items-center justify-center px-2 text-[16px] font-black tracking-[0.06em] text-[#111] sm:text-[18px]">{formatPlate(value)}</span>
      ) : (
        <input
          id={inputId}
          type="text"
          value={value}
          maxLength={8}
          autoComplete="off"
          placeholder="REG HERE"
          onChange={(event) => onChange(event.target.value.replace(/\s+/g, "").toUpperCase())}
          className="min-w-0 flex-1 bg-transparent px-2 text-center text-[15px] font-black tracking-[0.06em] text-[#111] outline-none placeholder:text-[#111]/55 sm:text-[17px]"
        />
      )}
    </div>
  );
}

export default function FreeQuoteSticky() {
  const [open, setOpen] = useState(false);
  const titleId = useId();
  const closeRef = useRef(null);

  const [regInput, setRegInput] = useState("");
  const [vehicle, setVehicle] = useState(emptyVehicle);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState("");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [postcode, setPostcode] = useState("");
  const [remarks, setRemarks] = useState("");
  const [honeypot, setHoneypot] = useState("");

  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const vehicleReady = Boolean(vehicle.vrm && (vehicle.brand || vehicle.series || vehicle.year));
  const engineDisplay = useMemo(() => engineLitres(vehicle.engineCapacity), [vehicle.engineCapacity]);
  const modelLine = [vehicle.series, vehicle.fuelType].filter(Boolean).join(" · ");
  const carImage = useMemo(() => resolveModelImage(vehicle), [vehicle]);

  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    function onKeyDown(event) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function resetForm() {
    setRegInput("");
    setVehicle(emptyVehicle);
    setLookupError("");
    setName("");
    setPhone("");
    setEmail("");
    setPostcode("");
    setRemarks("");
    setHoneypot("");
    setSubmitError("");
    setSubmitted(false);
  }

  function closeModal() {
    setOpen(false);
  }

  async function lookupVehicle(event) {
    event?.preventDefault?.();
    const reg = regInput.replace(/\s+/g, "").toUpperCase();
    if (!reg) {
      setLookupError("Enter a registration number first.");
      return;
    }

    setLookupLoading(true);
    setLookupError("");
    setSubmitted(false);

    try {
      const response = await fetch(`/api/vehicle-lookup?vrm=${encodeURIComponent(reg)}`);
      const data = await response.json();

      if (!response.ok) {
        setVehicle(emptyVehicle);
        setLookupError(data.error || "Could not find that vehicle.");
        return;
      }

      setVehicle(data.vehicle || emptyVehicle);
      setRegInput((data.vehicle?.vrm || reg).replace(/\s+/g, "").toUpperCase());
    } catch (error) {
      setVehicle(emptyVehicle);
      setLookupError(error.message || "Lookup failed. Please try again.");
    } finally {
      setLookupLoading(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitError("");

    if (!vehicleReady) {
      setSubmitError("Search a registration before submitting.");
      return;
    }

    if (!name.trim() || !phone.trim() || !email.trim() || !postcode.trim()) {
      setSubmitError("Full name, phone, email and postcode are required.");
      return;
    }

    if (honeypot) {
      setSubmitted(true);
      return;
    }

    setSubmitLoading(true);

    try {
      const payload = buildQuoteLeadPayload({
        contact: { name, phone, email, postcode, remarks, honeypot },
        vehicle,
        form: "Floating quote",
        pageUrl: typeof window !== "undefined" ? window.location.href : "",
      });

      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send quote request");
      }

      setSubmitted(true);
    } catch (error) {
      setSubmitError(error.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          resetForm();
          setOpen(true);
        }}
        className="fixed bottom-5 right-5 z-50 rounded-full bg-[var(--color-primary)] px-5 py-3 text-sm font-bold text-white shadow-[0_12px_28px_var(--color-shadow)] hover:bg-[var(--color-primary-strong)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        Get a Free Quote
      </button>

      {open ? (
        <div className="fixed inset-0 z-[60] flex items-end justify-center p-3 sm:items-center sm:p-4" role="presentation">
          <button type="button" aria-label="Close quote form" className="absolute inset-0 bg-black/55" onClick={closeModal} />

          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative z-[61] flex max-h-[94vh] w-full max-w-[520px] flex-col overflow-hidden rounded-[16px] bg-[#05080f] shadow-[0_24px_60px_rgba(0,0,0,0.45)]"
          >
            {/* Header */}
            <div className="relative shrink-0 overflow-hidden px-4 pb-6 pt-4 sm:px-5 sm:pt-5">
              <Image src={HEADER_BG} alt="" fill priority sizes="520px" className="object-cover object-[70%_center]" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/45 to-[#05080f]" />

              <button
                ref={closeRef}
                type="button"
                onClick={closeModal}
                className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-white/35 bg-black/25 text-white backdrop-blur-sm hover:bg-black/45"
                aria-label="Close"
              >
                <Icon name="close" className="h-3.5 w-3.5" />
              </button>

              <div className="relative z-[1] max-w-[380px] pr-9">
                <h2 id={titleId} className="text-[24px] font-extrabold leading-[1.15] tracking-[-0.02em] text-white sm:text-[30px]">
                  Get My Vehicle <span className="text-[var(--color-accent)]">Information</span>
                </h2>
                <p className="mt-1.5 text-[12px] leading-[1.4] text-white/80 sm:text-[13px]">
                  Enter your vehicle registration to find best replacement engine quote.
                </p>
              </div>
            </div>

            {/* Body — always light-theme colors (panel stays white in dark mode) */}
            <div
              className="relative -mt-3 flex min-h-0 flex-1 flex-col overflow-y-auto rounded-t-[16px] bg-white px-3 pb-3.5 pt-3 text-[#071827] sm:px-4 sm:pb-4"
              style={{
                "--color-text": "#071827",
                "--color-text-muted": "#27384a",
                "--color-text-soft": "#617084",
                "--color-border": "#d7dde6",
                "--color-page-soft": "#f4f7fb",
                "--color-primary": "#075fd8",
                "--color-primary-strong": "#034daf",
                "--color-accent-red": "#ed1c24",
                "--color-accent-green": "#13884a",
              }}
            >
              {submitted ? (
                <div className="flex flex-col items-center px-2 py-8 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-accent-green)] text-white">
                    <svg width="26" height="26" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                      <path d="M6 14l6 6 10-10" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <p className="mt-3 text-lg font-bold text-[var(--color-text)]">Quote Request Sent!</p>
                  <p className="mt-1.5 max-w-sm text-sm text-[var(--color-text-muted)]">
                    We&apos;ve received your details and will be contacting you soon.
                  </p>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="mt-5 rounded-[8px] bg-[var(--color-primary)] px-5 py-2.5 text-sm font-bold text-white"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
                  {!vehicleReady ? (
                    <div className="grid gap-1.5">
                      <div className="flex flex-col gap-1.5 sm:flex-row sm:items-stretch">
                        <UkPlate value={regInput} onChange={setRegInput} />
                        <button
                          type="button"
                          onClick={lookupVehicle}
                          disabled={lookupLoading}
                          className="inline-flex min-h-[42px] shrink-0 items-center justify-center gap-1.5 rounded-[8px] bg-[var(--color-primary)] px-3 text-[13px] font-bold text-white shadow-[0_8px_18px_rgba(7,95,216,0.28)] hover:bg-[var(--color-primary-strong)] disabled:opacity-60"
                        >
                          {lookupLoading ? <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" /> : null}
                          <span>{lookupLoading ? "Searching…" : "Get Instant Quote"}</span>
                          {!lookupLoading ? <Icon name="arrow" className="h-3.5 w-3.5" /> : null}
                        </button>
                      </div>
                      {lookupError ? <p className="text-[12px] font-medium text-[var(--color-accent-red)]">{lookupError}</p> : null}
                    </div>
                  ) : (
                    <div className="overflow-hidden rounded-[10px] border border-[var(--color-border)] bg-[var(--color-page-soft)]">
                      <div className="grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.2fr)] gap-2 p-2.5 sm:gap-3 sm:p-3">
                        <div className="relative min-h-[96px] overflow-hidden rounded-[8px] bg-white sm:min-h-[112px]">
                          <Image
                            key={carImage}
                            src={carImage}
                            alt={`${vehicle.brand || "BMW"} ${vehicle.series || ""}`.trim()}
                            fill
                            sizes="200px"
                            className="object-contain object-center p-1"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="mb-1.5 max-w-[150px]">
                            <UkPlate value={vehicle.vrm || regInput} readOnly />
                          </div>
                          <p className="text-[15px] font-extrabold leading-tight text-[var(--color-text)] sm:text-[16px]">
                            {vehicle.brand || "BMW"} {vehicle.series || "Series"}
                          </p>
                          {modelLine ? <p className="mt-0.5 text-[12px] text-[var(--color-text-muted)]">{modelLine}</p> : null}
                          <ul className="mt-2 grid gap-1 text-[12px] text-[var(--color-text)]">
                            <li className="flex items-center gap-1.5">
                              <Icon name="calendar" className="h-3 w-3 text-[var(--color-primary)]" />
                              <span>
                                <strong className="font-semibold">Year:</strong> {vehicle.year || "—"}
                              </span>
                            </li>
                            <li className="flex items-center gap-1.5">
                              <Icon name="fuel" className="h-3 w-3 text-[var(--color-primary)]" />
                              <span>
                                <strong className="font-semibold">Fuel:</strong> {vehicle.fuelType || "—"}
                              </span>
                            </li>
                            <li className="flex items-center gap-1.5">
                              <Icon name="engine" className="h-3 w-3 text-[var(--color-primary)]" />
                              <span>
                                <strong className="font-semibold">Engine:</strong> {engineDisplay || "—"}
                              </span>
                            </li>
                            <li className="flex items-center gap-1.5">
                              <span
                                className="inline-block h-3 w-3 rounded-full border border-black/15"
                                style={{ background: colourSwatch(vehicle.colour) }}
                                aria-hidden="true"
                              />
                              <span>
                                <strong className="font-semibold">Colour:</strong> {vehicle.colour || "—"}
                              </span>
                            </li>
                          </ul>
                          <button
                            type="button"
                            onClick={() => {
                              setVehicle(emptyVehicle);
                              setLookupError("");
                            }}
                            className="mt-1.5 text-[11px] font-semibold text-[var(--color-primary)] hover:underline"
                          >
                            Change registration
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <p className="text-[16px] font-extrabold text-[var(--color-text)] sm:text-[17px]">
                      Enter Your <span className="text-[var(--color-primary)]">Details</span>
                    </p>
                    <span className="mt-1 block h-[2px] w-14 rounded-full bg-[var(--color-primary)]" aria-hidden="true" />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Field id="fq-name" label="Name" icon="user">
                      <input
                        id="fq-name"
                        name="name"
                        type="text"
                        required
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="John Smith"
                        className={inputClass}
                      />
                    </Field>
                    <Field id="fq-email" label="Email" icon="mail">
                      <input
                        id="fq-email"
                        name="email"
                        type="email"
                        required
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="john@example.com"
                        className={inputClass}
                      />
                    </Field>
                    <Field id="fq-phone" label="Phone Number" icon="phone">
                      <input
                        id="fq-phone"
                        name="number"
                        type="tel"
                        required
                        value={phone}
                        onChange={(event) => setPhone(event.target.value)}
                        placeholder="07XXXXXXXXX"
                        className={inputClass}
                      />
                    </Field>
                    <Field id="fq-postcode" label="Post Code" icon="pin">
                      <input
                        id="fq-postcode"
                        name="postcode"
                        type="text"
                        required
                        value={postcode}
                        onChange={(event) => setPostcode(event.target.value)}
                        placeholder="W12 9AB"
                        className={inputClass}
                      />
                    </Field>
                  </div>

                  <label htmlFor="fq-remarks" className="block">
                    <span className="mb-1 block text-[12px] font-bold text-[var(--color-text)]">
                      Any Remarks <span className="font-medium text-[var(--color-text-soft)]">(Optional)</span>
                    </span>
                    <span className="relative block">
                      <span className="pointer-events-none absolute left-2.5 top-2.5 text-[var(--color-text-soft)]">
                        <Icon name="chat" className="h-4 w-4" />
                      </span>
                      <textarea
                        id="fq-remarks"
                        name="description"
                        rows={2}
                        value={remarks}
                        onChange={(event) => setRemarks(event.target.value)}
                        placeholder="Please enter any info you would like us to know."
                        className={`${inputClass} min-h-[64px] resize-y pt-2.5`}
                      />
                    </span>
                  </label>

                  <div className="hidden" aria-hidden="true">
                    <label htmlFor="fq-honeypot">Keep this field blank</label>
                    <input
                      id="fq-honeypot"
                      name="honeypot"
                      tabIndex={-1}
                      autoComplete="off"
                      value={honeypot}
                      onChange={(event) => setHoneypot(event.target.value)}
                    />
                  </div>

                  {submitError ? <p className="text-[12px] font-medium text-[var(--color-accent-red)]">{submitError}</p> : null}

                  <button
                    type="submit"
                    disabled={submitLoading || !vehicleReady}
                    className="inline-flex min-h-[46px] w-full items-center justify-center gap-1.5 rounded-[9px] bg-[var(--color-primary)] px-3 text-[13px] font-bold text-white shadow-[0_10px_22px_rgba(7,95,216,0.32)] hover:bg-[var(--color-primary-strong)] disabled:cursor-not-allowed disabled:opacity-50 sm:text-[14px]"
                  >
                    {submitLoading ? (
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                      <Icon name="engine" className="h-4 w-4 shrink-0" />
                    )}
                    <span className="text-center leading-tight">{submitLoading ? "Sending…" : "Get Your Free Replacement Engine Quote"}</span>
                    {!submitLoading ? <Icon name="arrow" className="h-3.5 w-3.5 shrink-0" /> : null}
                  </button>

                  {!vehicleReady ? (
                    <p className="text-center text-[11px] text-[var(--color-text-soft)]">Enter a registration and tap Get Instant Quote first.</p>
                  ) : null}

                  <p className="flex items-start justify-center gap-1.5 text-center text-[10px] leading-[1.35] text-[var(--color-text-soft)] sm:text-[11px]">
                    <Icon name="lock" className="mt-0.5 h-3 w-3 shrink-0" />
                    <span>Your details are secure, no spam — genuine quote from UK vetted engine specialists only.</span>
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
