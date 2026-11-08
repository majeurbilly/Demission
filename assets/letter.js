(function () {
  var formatter = new Intl.DateTimeFormat("fr-CA", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  var fields = [
    {
      input: document.getElementById("letter-date-input"),
      text: document.getElementById("letter-date-text"),
      storageKey: "demission-letter-date-iso"
    },
    {
      input: document.getElementById("depart-date-input"),
      text: document.getElementById("depart-date-text"),
      storageKey: "demission-depart-date-iso"
    }
  ];

  var printBtn = document.getElementById("print-btn");

  function todayIso() {
    var now = new Date();
    var month = String(now.getMonth() + 1).padStart(2, "0");
    var day = String(now.getDate()).padStart(2, "0");
    return now.getFullYear() + "-" + month + "-" + day;
  }

  function formatFrench(iso) {
    if (!iso) return "";
    var parts = iso.split("-").map(Number);
    var date = new Date(parts[0], parts[1] - 1, parts[2]);
    return formatter.format(date);
  }

  function syncField(field) {
    var value = field.input.value;
    var label = formatFrench(value);
    field.text.textContent = label;
    field.text.classList.toggle("is-empty", !label);
    if (value) {
      localStorage.setItem(field.storageKey, value);
    } else {
      localStorage.removeItem(field.storageKey);
    }
  }

  function updatePrintState() {
    var ready = fields.every(function (field) {
      return Boolean(field.input.value);
    });
    printBtn.disabled = !ready;
  }

  fields.forEach(function (field) {
    var saved = localStorage.getItem(field.storageKey);
    if (saved) {
      field.input.value = saved;
    } else if (field.input.id === "letter-date-input") {
      field.input.value = todayIso();
    }

    syncField(field);
    field.input.addEventListener("input", function () {
      syncField(field);
      updatePrintState();
    });

    field.text.addEventListener("click", function () {
      field.input.focus();
      if (typeof field.input.showPicker === "function") {
        try {
          field.input.showPicker();
        } catch (_) {}
      }
    });
  });

  updatePrintState();

  printBtn.addEventListener("click", function () {
    if (printBtn.disabled) return;
    window.print();
  });
})();
