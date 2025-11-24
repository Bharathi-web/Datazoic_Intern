$(document).ready(function () {
  // Initialize DataTable
  const table = $('#eventsTable').DataTable({
    columns: [
      { title: "Name" },
      { title: "Type" },
      { title: "Organizer Name" },
      { title: "Organizer Email" },
      { title: "Organizer Phone" },
      { title: "Facilities" },
      { title: "Event Date" },
      { title: "Category" },
      { title: "Additional Needs" }
    ]
  });

  // Initialize Chart.js bar chart
  const chartCtx = document.getElementById('eventChart').getContext('2d');
  const chartData = {
    labels: [],
    datasets: [{
      label: 'Events by Type',
      data: [],
      backgroundColor: '#117ddbff'
    }]
  };
  const eventChart = new Chart(chartCtx, { type: 'bar', data: chartData });

  // Load JSON schema and render form
  fetch('events.json')
    .then(res => {
      if (!res.ok) throw new Error(`HTTP error! ${res.status}`);
      return res.json();
    })
    .then(config => {
      initForm(config.form.fields);
    })
    .catch(err => {
      console.error("JSON load failed:", err);
      $('#eventForm').append(`<p class="text-danger">Failed to load form fields.</p>`);
    });

  // Form Render
  function initForm(fields) {
    const form = $('#eventForm').empty();

    fields.forEach(field => {
      if (field.enable) {
        form.append(fieldToHtml(field));
      }
    });

    // Show/hide nested fields based on trigger values
    form.on('change', 'select, input[type=radio]', function () {
      const name = $(this).attr('name');
      const value = $(this).val();
      $(`.nestedFieldGroup[data-parent="${name}"]`).addClass('d-none');
      $(`.nestedFieldGroup[data-parent="${name}"][data-trigger="${value}"]`).removeClass('d-none');
    });

    // Initialize Select2 plugin locally (not CDN)
    if ($('select[multiple]').length && $.fn.select2) {
      $('select[multiple]').each(function () {
        // Destroy if exists to prevent duplicates
        if ($(this).hasClass('select2-hidden-accessible')) {
          $(this).select2('destroy');
        }
        $(this).select2({
          placeholder: "Select options",
          allowClear: true,
          width: '100%'
        });
      });
    }

    // Submit button click
    $('#submitBtn').off('click').on('click', function (e) {
      e.preventDefault();
      handleSubmit();
    });
  }

  // Create HTML for field based on type
  function fieldToHtml(field, parentKey = '') {
    if (!field.enable) return '';
    const required = field.required ? 'required' : '';
    const key = parentKey ? `${parentKey}.${field.key}` : field.key;
    let html = '';

    switch (field.inputType) {
      case "text":
      case "number":
      case "email":
      case "tel":
      case "date":
        html = `
          <div class="mb-3">
            <label class="form-label fw-bold">${field.label}${field.required ? ' <span class="text-danger">*</span>' : ''}</label>
            <input type="${field.inputType}" name="${key}" class="form-control" maxlength="${field.charLength || ''}" ${required}>
            <div class="text-danger small mt-1 error-message"></div>
          </div>`;
        break;

      case "textarea":
        html = `
          <div class="mb-3">
            <label class="form-label fw-bold">${field.label}</label>
            <textarea name="${key}" class="form-control"></textarea>
            <div class="text-danger small mt-1 error-message"></div>
          </div>`;
        break;

      case "singleSelect":
        html = `
    <div class="mb-3">
      <label class="form-label fw-bold">${field.label}${field.required ? ' <span class="text-danger">*</span>' : ''}</label>
      <select name="${key}" class="form-select" ${required}>
        <option value="">Select</option>
        ${field.options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
      </select>
      <div class="text-danger small mt-1 error-message"></div>
      ${field.nestedFields
            ? Object.entries(field.nestedFields)
              .map(([opt, nFields]) => `
                <div class="nestedFieldGroup d-none mt-2" data-parent="${key}" data-trigger="${opt}">
                  ${nFields.map(f => fieldToHtml(f, key)).join('')}
                </div>
              `)
              .join('')
            : ''
          }
    </div>`;
        break;

      case "multiSelect":
        html = `
          <div class="mb-3">
            <label class="form-label fw-bold">${field.label}${field.required ? ' <span class="text-danger">*</span>' : ''}</label>
            <select name="${key}[]" class="form-select" multiple ${required}>
              ${field.options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
            </select>
            <div class="text-danger small mt-1 error-message multi-select-error"></div>
          </div>`;
        break;

      case "checkbox":
        html = `
          <div class="mb-3">
            <label class="form-label fw-bold">${field.label}${field.required ? ' <span class="text-danger">*</span>' : ''}</label><br>
            ${field.options.map(opt => `
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="checkbox" name="${key}[]" value="${opt}">
                <label class="form-check-label">${opt}</label>
              </div>`).join('')}
            <div class="text-danger small mt-1 error-message"></div>
          </div>`;
        break;

      case "radio":
        html = `
    <div class="mb-3">
      <label class="form-label fw-bold">${field.label}${field.required ? ' <span class="text-danger">*</span>' : ''}</label><br>
      ${field.options.map(opt => `
        <div class="form-check form-check-inline">
          <input class="form-check-input" type="radio" name="${key}" value="${opt}">
          <label class="form-check-label">${opt}</label>
        </div>`).join('')}
      <div class="text-danger small mt-1 error-message"></div>
      ${field.nestedFields
            ? Object.entries(field.nestedFields)
              .map(([opt, nFields]) => `
                <div class="nestedFieldGroup d-none mt-2" data-parent="${key}" data-trigger="${opt}">
                  ${nFields.map(f => fieldToHtml(f, key)).join('')}
                </div>
              `)
              .join('')
            : ''
          }
    </div>`;
        break;

      case "file":
        html = `
          <div class="mb-3">
            <label class="form-label fw-bold">${field.label}</label>
            <input type="file" name="${key}" class="form-control">
          </div>`;
        break;

      case "group":
        html = `
          <fieldset class="mb-4 border p-3 rounded">
            <legend class="fw-bold text-primary">${field.label}</legend>
            ${field.fields.map(f => fieldToHtml(f, key)).join('')}
          </fieldset>`;
        break;

      default:
        html = '';
    }
    if (field.parent && field.trigger) {
      html = `<div class="nestedFieldGroup d-none" data-parent="${field.parent}" data-trigger="${field.trigger}">${html}</div>`;
    }
    return html;
  }

  // validation
  function validateForm() {
    let isValid = true;
    $('#eventForm .error-message').text('');
    $('#eventForm .multi-select-error').text('');

    // Validate required inputs (including selects)
    $('#eventForm [required]').each(function () {
      if ($(this).is('select[multiple]')) {
        // Multi-select validation
        if (!$(this).val() || $(this).val().length === 0) {
          $(this).siblings('.multi-select-error').text("This field is required.");
          isValid = false;
        }
      } else {
        if (!$(this).val().trim()) {
          $(this).siblings('.error-message').text("This field is required.");
          isValid = false;
        }
      }
    });

    // name only alphabets
    const name = $('[name="organizer.organizerName"]').val();
    if (name && !/^[A-Za-z ]+$/.test(name)) {
      $('[name="organizer.organizerName"]').siblings('.error-message').text("Name must contain only alphabets and spaces.");
      isValid = false;
    }

    // Organizer Phone exactly 10 digits
    const phone = $('[name="organizer.organizerPhone"]').val();
    if (phone && !/^\d{10}$/.test(phone)) {
      $('[name="organizer.organizerPhone"]').siblings('.error-message').text("Phone number must be exactly 10 digits.");
      isValid = false;
    }

    // Organizer Email validation
    const email = $('[name="organizer.organizerEmail"]').val();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      $('[name="organizer.organizerEmail"]').siblings('.error-message').text("Invalid email format.");
      isValid = false;
    }

    return isValid;
  }

  // Form Submit handle
  function handleSubmit() {
    if (!validateForm()) return;

    // Serialize to handle multi select
    let formData = {};
    $('#eventForm').serializeArray().forEach(item => {
      if (item.name.endsWith('[]')) {
        const key = item.name.slice(0, -2);
        formData[key] = formData[key] || [];
        formData[key].push(item.value);
      } else {
        formData[item.name] = item.value;
      }
    });

    // Add row to DataTable
    table.row.add([
      formData["eventName"] || "",
      formData["eventType"] || "",
      formData["organizer.organizerName"] || "",
      formData["organizer.organizerEmail"] || "",
      formData["organizer.organizerPhone"] || "",
      (formData["facilities"] || []).join(", "),
      formData["eventDate"] || "",
      formData["ticketCategory"] || "",
      formData["needs"] || ""
    ]).draw();

    // Update Chart
    let idx = chartData.labels.indexOf(formData["eventType"]);
    if (idx === -1) {
      chartData.labels.push(formData["eventType"]);
      chartData.datasets[0].data.push(1);
    } else {
      chartData.datasets[0].data[idx]++;
    }
    eventChart.update();

    // Save event to localStorage
    let saved = JSON.parse(localStorage.getItem("events") || "[]");
    saved.push(formData);
    localStorage.setItem("events", JSON.stringify(saved));

    // Reset form and Select2 multi-selects
    $('#eventForm')[0].reset();
    if ($('select[multiple]').length && $.fn.select2) {
      $('select[multiple]').val(null).trigger('change');
    }
  }

  // local storage load
  const savedEvents = JSON.parse(localStorage.getItem("events") || "[]");
  savedEvents.forEach(formData => {
    table.row.add([
      formData["eventName"] || "",
      formData["eventType"] || "",
      formData["organizer.organizerName"] || "",
      formData["organizer.organizerEmail"] || "",
      formData["organizer.organizerPhone"] || "",
      (formData["facilities"] || []).join(", "),
      formData["eventDate"] || "",
      formData["ticketCategory"] || "",
      formData["needs"] || ""
    ]).draw();

    let idx = chartData.labels.indexOf(formData["eventType"]);
    if (idx === -1) {
      chartData.labels.push(formData["eventType"]);
      chartData.datasets[0].data.push(1);
    } else {
      chartData.datasets[0].data[idx]++;
    }
  });
  eventChart.update();
});
