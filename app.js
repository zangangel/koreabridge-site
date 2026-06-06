(function initKoreaBridgeSite() {
  const risk = window.KoreaBridgeRisk;
  const state = {
    activeChecker: "room",
    lastReportText: ""
  };

  const lifeHubItems = [
    {
      title: "Find a safe room",
      copy: "Compare address registration, deposit exposure, signing party, contract language, and refund clarity before payment.",
      action: "Check housing",
      href: "#housing-confidence"
    },
    {
      title: "Check a job before starting",
      copy: "Catch wage, visa, identity, contract, payment, and document-holding risks before the first shift.",
      action: "Run job check",
      href: "#checker"
    },
    {
      title: "Plan arrival steps",
      copy: "Turn the first 90 days into a sequence: housing proof, ARC, phone, banking, health, and work permission.",
      action: "Open arrival path",
      href: "#arrival-path"
    },
    {
      title: "Use official guidance",
      copy: "Read source-backed local guides with official source, expert note, and user-experience layers separated.",
      action: "Browse guides",
      href: "#official-guide"
    }
  ];

  const arrivalPath = [
    {
      phase: "Before arrival",
      title: "Secure a verifiable address",
      copy: "Avoid rooms where address registration, refund terms, or signing party are unclear.",
      risk: "Housing"
    },
    {
      phase: "First 7 days",
      title: "Set up phone and documents",
      copy: "Prepare phone/SIM, immigration appointment, housing proof, and emergency contacts.",
      risk: "Admin"
    },
    {
      phase: "First 30 days",
      title: "Build your Korea operating base",
      copy: "Bank account, health path, local rules, document storage, and official guide bookmarks.",
      risk: "Life"
    },
    {
      phase: "Before work",
      title: "Confirm job permission and contract",
      copy: "Check visa fit, weekly hours, wage, written terms, and employer identity before starting.",
      risk: "Work"
    }
  ];

  const housingCards = [
    {
      title: "Address registration confidence",
      score: "Must verify",
      copy: "Can this address be used for ARC or residence reporting? If no or unclear, KoreaBridge raises risk before payment."
    },
    {
      title: "Deposit and refund clarity",
      score: "Money risk",
      copy: "Deposit band, refund rules, utilities, maintenance fees, and early cancellation terms are checked together."
    },
    {
      title: "Signing party transparency",
      score: "Identity risk",
      copy: "Licensed agent, landlord, school/company, sublease, or unknown party changes the risk profile."
    },
    {
      title: "Verification level",
      score: "L0-L5",
      copy: "Listings and partners can earn levels from user report to official/public source confirmation."
    }
  ];

  const officialGuides = [
    {
      title: "Housing contract checklist",
      source: "Official + practical",
      copy: "Wolse, short stay, goshiwon, sublease, address registration, deposit records, and move-out terms."
    },
    {
      title: "D-2/D-4 part-time work",
      source: "Official + advisor review",
      copy: "Work permission, allowed hours, written contract, pay proof, and employer identity questions."
    },
    {
      title: "First 90 days setup",
      source: "Local workflow",
      copy: "Housing proof, ARC, SIM, bank, health insurance, transport, emergency contacts, and document storage."
    },
    {
      title: "Neighborhood starter maps",
      source: "Community + verified notes",
      copy: "Sinchon, Hongdae, Hyehwa, Wangsimni: common housing types, price patterns, and repeated risk signals."
    }
  ];

  const marketplaceItems = [
    {
      title: "Room contract review",
      copy: "Human review for deposit, address registration, refund terms, signing party, and contract red flags.",
      tags: ["Housing", "24h", "L4 review"]
    },
    {
      title: "Foreigner-friendly housing agent",
      copy: "Area-specific partner for Sinchon, Hongdae, Hyehwa, and Wangsimni with clear fee policy.",
      tags: ["Real estate", "English", "L3 checked"]
    },
    {
      title: "Labor contract advisor",
      copy: "Pre-start review for wage, hours, written contract, permission, and identity-document risk.",
      tags: ["Work", "Contract", "L4 review"]
    },
    {
      title: "Arrival setup support",
      copy: "SIM, document checklist, bank preparation, move-in kit, and first-month operating basics.",
      tags: ["Arrival", "Vietnamese next", "Pilot"]
    }
  ];

  const checklistItems = [
    ["Secure housing proof", "Before arrival"],
    ["Confirm address registration", "Before paying"],
    ["Set up SIM or phone plan", "First 7 days"],
    ["Book immigration visit if needed", "First 7 days"],
    ["Apply for ARC or foreigner registration", "Within 90 days"],
    ["Open a bank account", "After ID setup"],
    ["Save emergency contacts", "First week"],
    ["Check health insurance path", "First month"],
    ["Confirm part-time work permission", "Before work"],
    ["Keep contracts and receipts", "Always"],
    ["Learn local waste and building rules", "Move-in week"],
    ["Find verified help nearby", "Any time"]
  ];

  function $(selector, root = document) {
    return root.querySelector(selector);
  }

  function $all(selector, root = document) {
    return Array.from(root.querySelectorAll(selector));
  }

  function formData(form) {
    return Object.fromEntries(new FormData(form).entries());
  }

  function setActiveChecker(name) {
    state.activeChecker = name;
    $all("[data-checker-tab]").forEach((button) => {
      const isActive = button.dataset.checkerTab === name;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-selected", String(isActive));
    });
    $all("[data-checker-form]").forEach((form) => {
      form.classList.toggle("hidden", form.dataset.checkerForm !== name);
    });
    $("#resultEmpty").classList.remove("hidden");
    $("#resultOutput").classList.add("hidden");
  }

  function renderLifeHub() {
    $("#lifeHubGrid").innerHTML = lifeHubItems.map((item) => `
      <article class="life-card">
        <h3>${item.title}</h3>
        <p>${item.copy}</p>
        <a href="${item.href}">${item.action}</a>
      </article>
    `).join("");
  }

  function renderArrivalPath() {
    $("#arrivalPath").innerHTML = arrivalPath.map((step, index) => `
      <article class="arrival-step">
        <span class="step-number">${index + 1}</span>
        <div>
          <span class="mini-label">${step.phase}</span>
          <h3>${step.title}</h3>
          <p>${step.copy}</p>
          <strong>${step.risk} check</strong>
        </div>
      </article>
    `).join("");
  }

  function renderHousingCards() {
    $("#housingCards").innerHTML = housingCards.map((card) => `
      <article class="housing-card">
        <span>${card.score}</span>
        <h3>${card.title}</h3>
        <p>${card.copy}</p>
      </article>
    `).join("");
  }

  function renderOfficialGuides() {
    $("#officialGuideGrid").innerHTML = officialGuides.map((guide) => `
      <article class="source-card">
        <span>${guide.source}</span>
        <h3>${guide.title}</h3>
        <p>${guide.copy}</p>
        <a href="#checker">Run related check</a>
      </article>
    `).join("");
  }

  function renderMarketplace() {
    $("#marketplaceGrid").innerHTML = marketplaceItems.map((item) => `
      <article class="market-card">
        <h3>${item.title}</h3>
        <p>${item.copy}</p>
        <div class="tags">${item.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}</div>
      </article>
    `).join("");
  }

  function renderReport(kind, result) {
    const title = kind === "room" ? "Room check result" : "Job check result";
    const emptyCopy = kind === "room"
      ? "No major room red flags from these answers."
      : "No major job red flags from these answers.";
    const defaultSteps = kind === "room"
      ? [
        "Keep the written contract and payment records.",
        "Confirm address registration before paying a large deposit.",
        "Ask for human review if any term changes before signing."
      ]
      : [
        "Get wage, hours, pay date, and work duties in writing.",
        "Confirm your visa or status before starting work.",
        "Keep proof of every shift and payment."
      ];
    const flags = result.flags.length ? result.flags : [{ message: emptyCopy, severity: "low" }];
    const steps = result.nextSteps.length ? result.nextSteps : defaultSteps;

    const flagMarkup = flags.map((flag) => `
      <li class="flag-item">
        <span class="flag-icon">${flag.severity === "low" ? "OK" : "!"}</span>
        <div>
          <p class="item-title">${sentenceCase(flag.severity || "low")}</p>
          <p class="item-copy">${flag.message}</p>
        </div>
      </li>
    `).join("");

    const stepMarkup = steps.map((step, index) => `
      <li class="step-item">
        <span class="step-icon">${index + 1}</span>
        <p class="item-copy">${step}</p>
      </li>
    `).join("");

    $("#resultEmpty").classList.add("hidden");
    const output = $("#resultOutput");
    output.classList.remove("hidden");
    output.innerHTML = `
      <div class="score-summary">
        <div class="score-top">
          <div>
            <h3>${title}</h3>
            <p class="item-copy">${result.score} / 100 risk score</p>
          </div>
          <span class="level-pill ${result.level.tone}">${result.level.label}</span>
        </div>
        <div class="meter"><span style="width: ${result.score}%; background: ${meterColor(result.level.key)}"></span></div>
        <div>
          <p class="item-title">Detected signals</p>
          <ul class="flag-list">${flagMarkup}</ul>
        </div>
        <div>
          <p class="item-title">Next steps</p>
          <ul class="step-list">${stepMarkup}</ul>
        </div>
        <div class="result-actions">
          <a class="button primary" href="#review">Request human review</a>
          <button id="copyReport" class="button secondary" type="button">Copy report</button>
        </div>
      </div>
    `;

    state.lastReportText = buildPlainReport(title, result, flags, steps);
    $("#copyReport").addEventListener("click", copyReport);
  }

  function buildPlainReport(title, result, flags, steps) {
    const lines = [
      `${title}`,
      `Risk level: ${result.level.label}`,
      `Risk score: ${result.score}/100`,
      "",
      "Signals:",
      ...flags.map((flag) => `- ${flag.message}`),
      "",
      "Next steps:",
      ...steps.map((step, index) => `${index + 1}. ${step}`)
    ];
    return lines.join("\n");
  }

  function copyReport() {
    const text = state.lastReportText;
    if (!text) return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        $("#copyReport").textContent = "Copied";
      }).catch(() => fallbackCopy(text));
    } else {
      fallbackCopy(text);
    }
  }

  function fallbackCopy(text) {
    const area = document.createElement("textarea");
    area.value = text;
    document.body.appendChild(area);
    area.select();
    document.execCommand("copy");
    area.remove();
    $("#copyReport").textContent = "Copied";
  }

  function meterColor(levelKey) {
    if (levelKey === "critical") return "var(--red)";
    if (levelKey === "high") return "var(--amber)";
    if (levelKey === "watch") return "var(--blue)";
    return "var(--teal)";
  }

  function sentenceCase(text) {
    return `${text.charAt(0).toUpperCase()}${text.slice(1)}`;
  }

  function renderChecklist() {
    const list = $("#checklist");
    list.innerHTML = checklistItems.map(([title, timing], index) => `
      <label class="task-item">
        <input type="checkbox" data-checklist-item="${index}">
        <span>
          <strong>${title}</strong>
          <span>${timing}</span>
        </span>
      </label>
    `).join("");
    list.addEventListener("change", updateChecklistProgress);
    updateChecklistProgress();
  }

  function updateChecklistProgress() {
    const checked = $all("[data-checklist-item]").map((box) => box.checked);
    const summary = risk.summarizeChecklistProgress(checked);
    $("#progressLabel").textContent = summary.label;
    $("#progressPercent").textContent = `${summary.percent}%`;
    $("#progressBar").style.width = `${summary.percent}%`;
  }

  function handleReviewSubmit(event) {
    event.preventDefault();
    const data = formData(event.currentTarget);
    const summary = (data.summary || "").trim();
    const intake = {
      type: data.reviewType,
      deadline: data.deadline,
      summary,
      createdAt: new Date().toISOString()
    };
    localStorage.setItem("koreabridge-review-intake", JSON.stringify(intake));
    $("#reviewOutput").textContent = summary
      ? "Intake saved locally. Share this summary with the KoreaBridge review team when the review channel is connected."
      : "Intake shell saved locally. Add a situation summary before sending it to a reviewer.";
  }

  function bindEvents() {
    $all("[data-checker-tab]").forEach((button) => {
      button.addEventListener("click", () => setActiveChecker(button.dataset.checkerTab));
    });

    $("#roomForm").addEventListener("submit", (event) => {
      event.preventDefault();
      renderReport("room", risk.scoreHousing(formData(event.currentTarget)));
    });

    $("#jobForm").addEventListener("submit", (event) => {
      event.preventDefault();
      renderReport("job", risk.scoreJob(formData(event.currentTarget)));
    });

    $("#roomForm").addEventListener("reset", () => window.setTimeout(() => setActiveChecker("room"), 0));
    $("#jobForm").addEventListener("reset", () => window.setTimeout(() => setActiveChecker("job"), 0));
    $("#reviewForm").addEventListener("submit", handleReviewSubmit);
  }

  function init() {
    bindEvents();
    renderLifeHub();
    renderArrivalPath();
    renderHousingCards();
    renderOfficialGuides();
    renderMarketplace();
    renderChecklist();
    setActiveChecker("room");
  }

  init();
})();
