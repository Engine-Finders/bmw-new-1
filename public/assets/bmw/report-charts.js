/* ============================================================
   BMW RELIABILITY INDEX 2026 — CHART CONFIGURATIONS
   Chart.js itself is loaded via CDN in the page <head>
   (https://cdn.jsdelivr.net/npm/chart.js) — this file only
   contains this report's specific chart configs and data
   binding. Lives in assets/bmw/ alongside style.css/effects.js.
   ============================================================ */

document.addEventListener("DOMContentLoaded", function () {
  if (typeof Chart === "undefined") return; // fail quietly if CDN blocked

  Chart.defaults.font.family = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  Chart.defaults.color = "#5A5D63";

  var BRAND_BLUE = "#0166B1";
  var BRAND_BLUE_LIGHT = "#4E9BD6";
  var GOLD = "#C8A24C";
  var GREY = "#C7CBD1";

  /* ---------- Chart 1: Engine Score ranked bar chart ---------- */
  var scoreCtx = document.getElementById("engineScoreChart");
  if (scoreCtx) {
    new Chart(scoreCtx, {
      type: "bar",
      data: {
        labels: ["B47D20A", "B58B30", "B57D30", "N47D20C", "N57D30", "N63B44", "S63B44"],
        datasets: [{
          label: "Engine Score (out of 100)",
          data: [84, 84, 78, 66, 64, 54, 44],
          backgroundColor: [GOLD, BRAND_BLUE, BRAND_BLUE, BRAND_BLUE_LIGHT, BRAND_BLUE_LIGHT, GREY, GREY],
          borderRadius: 4,
          maxBarThickness: 46
        }]
      },
      options: {
        indexAxis: "y",
        plugins: { legend: { display: false } },
        scales: {
          x: { beginAtZero: true, max: 100, grid: { color: "#EEF0F2" } },
          y: { grid: { display: false } }
        }
      }
    });
  }

  /* ---------- Chart 2: Reconditioned vs Used vs Rebuilt split ---------- */
  var splitCtx = document.getElementById("conditionSplitChart");
  if (splitCtx) {
    new Chart(splitCtx, {
      type: "doughnut",
      data: {
        labels: ["Reconditioned", "Used", "Rebuilt"],
        datasets: [{
          data: [70.45, 22.1, 7.45],
          backgroundColor: [BRAND_BLUE, BRAND_BLUE_LIGHT, GOLD],
          borderWidth: 2,
          borderColor: "#FFFFFF"
        }]
      },
      options: {
        plugins: { legend: { position: "bottom" } },
        cutout: "62%"
      }
    });
  }

  /* ---------- Chart 3: Five-dimension breakdown, top vs bottom engine ---------- */
  var radarCtx = document.getElementById("dimensionRadarChart");
  if (radarCtx) {
    new Chart(radarCtx, {
      type: "radar",
      data: {
        labels: ["Reliability", "Repair Cost", "Repairability", "Parts Supply", "Replacement Economics"],
        datasets: [
          {
            label: "B47D20A (84/100)",
            data: [16, 16, 16, 20, 16],
            borderColor: GOLD,
            backgroundColor: "rgba(200,162,76,0.15)",
            pointBackgroundColor: GOLD
          },
          {
            label: "S63B44 (44/100)",
            data: [12, 4, 4, 8, 16],
            borderColor: "#8E9092",
            backgroundColor: "rgba(142,144,146,0.12)",
            pointBackgroundColor: "#8E9092"
          }
        ]
      },
      options: {
        scales: {
          r: {
            min: 0, max: 20,
            ticks: { stepSize: 5, backdropColor: "transparent" },
            grid: { color: "#EEF0F2" },
            pointLabels: { font: { size: 11 } }
          }
        },
        plugins: { legend: { position: "bottom" } }
      }
    });
  }

  /* ---------- Chart 4: Enquiry volume by engine, 2025 ---------- */
  var volumeCtx = document.getElementById("enquiryVolumeChart");
  if (volumeCtx) {
    new Chart(volumeCtx, {
      type: "bar",
      data: {
        labels: ["N47D20C", "B47D20A", "N57D30", "B58B30", "B57D30", "N63B44", "S63B44"],
        datasets: [{
          label: "2025 UK Enquiries",
          data: [1450, 930, 830, 540, 460, 440, 410],
          backgroundColor: BRAND_BLUE,
          borderRadius: 4,
          maxBarThickness: 50
        }]
      },
      options: {
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, grid: { color: "#EEF0F2" } },
          x: { grid: { display: false } }
        }
      }
    });
  }
});

/* ============================================================
   BMW ENGINE FAILURE TRENDS REPORT 2026 — chart configs
   ============================================================ */
document.addEventListener("DOMContentLoaded", function () {
  if (typeof Chart === "undefined") return;
  var BRAND_BLUE = "#0166B1", GOLD = "#C8A24C", RED = "#C0392B", GREY = "#8E9092";

  /* Failure type distribution — doughnut */
  var failTypeCtx = document.getElementById("failureTypeChart");
  if (failTypeCtx) {
    new Chart(failTypeCtx, {
      type: "doughnut",
      data: {
        labels: ["Timing Chain / Tensioner", "Cooling / Coolant System", "EGR / Emissions", "Valve Seal / Oil Consumption"],
        datasets: [{
          data: [53.2, 19.8, 18.4, 8.7],
          backgroundColor: [RED, BRAND_BLUE, GOLD, GREY],
          borderWidth: 2, borderColor: "#FFFFFF"
        }]
      },
      options: { plugins: { legend: { position: "bottom" } }, cutout: "58%" }
    });
  }

  /* Mileage-at-failure bands — floating horizontal bar */
  var mileageCtx = document.getElementById("mileageBandChart");
  if (mileageCtx) {
    new Chart(mileageCtx, {
      type: "bar",
      data: {
        labels: ["N63B44", "N47D20C", "B47D20A", "B58B30", "S63B44", "N57D30", "B57D30"],
        datasets: [{
          label: "Documented failure mileage band",
          data: [[60,100],[60,120],[60,120],[60,120],[70,120],[80,150],[100,180]],
          backgroundColor: BRAND_BLUE,
          borderRadius: 4
        }]
      },
      options: {
        indexAxis: "y",
        plugins: { legend: { display: false },
          tooltip: { callbacks: { label: function(ctx){ return ctx.raw[0]+'k \u2013 '+ctx.raw[1]+'k miles'; } } } },
        scales: {
          x: { beginAtZero: true, title: { display: true, text: "Mileage (thousands)" }, grid: { color: "#EEF0F2" } },
          y: { grid: { display: false } }
        }
      }
    });
  }
});

/* ============================================================
   BMW ENGINE COST INDEX 2026 — chart configs
   ============================================================ */
document.addEventListener("DOMContentLoaded", function () {
  if (typeof Chart === "undefined") return;
  var BRAND_BLUE = "#0166B1", GOLD = "#C8A24C", GREY = "#C7CBD1";

  /* Cost range by engine — floating bar (used low -> rebuilt high) */
  var costRangeCtx = document.getElementById("costRangeChart");
  if (costRangeCtx) {
    new Chart(costRangeCtx, {
      type: "bar",
      data: {
        labels: ["B47D20A", "N47D20C", "B58B30", "N57D30", "B57D30", "N63B44", "S63B44"],
        datasets: [{
          label: "Full cost range (used low \u2013 rebuilt high), \u00a3",
          data: [[1500,5800],[1800,6500],[2000,8000],[2500,9000],[2800,10500],[3500,14000],[5000,18000]],
          backgroundColor: BRAND_BLUE,
          borderRadius: 4
        }]
      },
      options: {
        indexAxis: "y",
        plugins: { legend: { display: false },
          tooltip: { callbacks: { label: function(ctx){ return '\u00a3'+ctx.raw[0].toLocaleString()+' \u2013 \u00a3'+ctx.raw[1].toLocaleString(); } } } },
        scales: {
          x: { beginAtZero: true, title: { display: true, text: "Cost (\u00a3)" }, grid: { color: "#EEF0F2" } },
          y: { grid: { display: false } }
        }
      }
    });
  }

  /* Labour hours by engine */
  var labourCtx = document.getElementById("labourHoursChart");
  if (labourCtx) {
    new Chart(labourCtx, {
      type: "bar",
      data: {
        labels: ["B47D20A", "N47D20C", "B58B30", "N57D30", "B57D30", "N63B44", "S63B44"],
        datasets: [{
          label: "R&R Labour Hours (midpoint)",
          data: [10, 12, 12, 14, 14, 19, 21],
          backgroundColor: GOLD,
          borderRadius: 4,
          maxBarThickness: 46
        }]
      },
      options: {
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, title: { display: true, text: "Hours" }, grid: { color: "#EEF0F2" } }, x: { grid: { display: false } } }
      }
    });
  }
});

/* ============================================================
   REPORT 2 ADDITIONS — Fuel Type Split, Severity Matrix
   ============================================================ */
document.addEventListener("DOMContentLoaded", function () {
  if (typeof Chart === "undefined") return;
  var BRAND_BLUE = "#0166B1", GOLD = "#C8A24C";

  var fuelCtx = document.getElementById("fuelTypeChart");
  if (fuelCtx) {
    new Chart(fuelCtx, {
      type: "doughnut",
      data: {
        labels: ["Diesel (N47, B47, N57, B57)", "Petrol (B58, N63, S63)"],
        datasets: [{ data: [72.5, 27.5], backgroundColor: [BRAND_BLUE, GOLD], borderWidth: 2, borderColor: "#FFFFFF" }]
      },
      options: { plugins: { legend: { position: "bottom" } }, cutout: "60%" }
    });
  }
});

/* ============================================================
   REPORT 3 ADDITIONS — Cost Inflation, Mileage Bands
   ============================================================ */
document.addEventListener("DOMContentLoaded", function () {
  if (typeof Chart === "undefined") return;
  var BRAND_BLUE = "#0166B1", GOLD = "#C8A24C";

  var inflationCtx = document.getElementById("costInflationChart");
  if (inflationCtx) {
    new Chart(inflationCtx, {
      type: "bar",
      data: {
        labels: ["2018\u21922019", "2018\u21922022", "2020\u21922024", "2020\u21922026", "2024\u21922025"],
        datasets: [{
          label: "Reported cost increase (%)",
          data: [19, 40, 35, 31, 23],
          backgroundColor: BRAND_BLUE, borderRadius: 4
        }]
      },
      options: {
        plugins: { legend: { display: false },
          tooltip: { callbacks: { label: function(ctx){
            var sources = ["Intelligent Motoring warranty claims","Intelligent Motoring warranty claims","Epyx parts basket","AM-Online / SMMT general parts","WSG alternator claims"];
            return '+' + ctx.raw + '% \u2014 ' + sources[ctx.dataIndex];
          } } } },
        scales: { y: { beginAtZero: true, title: { display: true, text: "% increase over stated period" }, grid: { color: "#EEF0F2" } }, x: { grid: { display: false } } }
      }
    });
  }

  var mileageValueCtx = document.getElementById("mileageValueChart");
  if (mileageValueCtx) {
    new Chart(mileageValueCtx, {
      type: "bar",
      data: {
        labels: ["40k", "60k", "80k", "100k", "120k", "160k"],
        datasets: [{
          label: "Engines with documented failure risk at this mileage",
          data: [0, 4, 6, 7, 6, 1],
          backgroundColor: GOLD, borderRadius: 4
        }]
      },
      options: {
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, title: { display: true, text: "Number of our 7 engines at risk" }, grid: { color: "#EEF0F2" } }, x: { grid: { display: false } } }
      }
    });
  }
});
