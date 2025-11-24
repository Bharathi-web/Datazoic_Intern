$(document).ready(function () {
  try {
    const fallbackConfig = $.getJSON('Jsonfile.json', function (json) {
      initWith(json.fields || json.data || fallbackConfig.fields);
    }).fail(function () {
      console.warn("Jsonfile.json not found or failed to load — using fallback configuration.");
      initWith(fallbackConfig.fields);
    });

    // ---------- Parent init ----------
    function initWith(fields) {
      try {
        const $form = $('#dynamicForm');

        // generate a single field (label left, input right)
        function generateField(field) {
          try {
            if (!field.enabled) return "";

            let html = `
              <div class="flex items-center gap-4 p-2 w-full" id="wrapper_${escapeId(field.name)}">
                <label for="${escapeId(field.name)}" class="w-1/3 text-start pr-4 font-semibold text-xl text-gray-800">
                  ${escapeHtml(field.label || '')}${field.required ? '<span class="text-red-500"> *</span>' : ''}
                </label>
                <div class="w-2/3 px-10">
            `;

            const required = field.required ? 'required' : '';
            const pattern = field.validation?.pattern ? `pattern="${field.validation.pattern}"` : '';
            const title = field.validation?.message ? `title="${field.validation.message}"` : '';

            switch (field.type) {
              case 'text':
              case 'email':
              case 'tel':
                html += `<input type="${field.type === 'tel' ? 'tel' : field.type}"
                          id="${escapeId(field.name)}" name="${escapeAttr(field.name)}"
                          class="w-full p-2 border rounded-md bg-white focus:ring focus:ring-blue-300"
                          ${required} ${pattern} ${title}
                          ${field.maxLength ? `maxlength="${field.maxLength}"` : ''}>`;
                break;

              case 'number':
                html += `<input type="number" id="${escapeId(field.name)}" name="${escapeAttr(field.name)}"
                          class="w-full p-2 border rounded-md bg-white focus:ring focus:ring-blue-300"
                          ${required}>`;
                break;

              case 'date':
                html += `<input type="date" id="${escapeId(field.name)}" name="${escapeAttr(field.name)}"
                          class="w-full p-2 border rounded-md bg-white focus:ring focus:ring-blue-300"
                          ${required}>`;
                break;

              case 'textarea':
                html += `<textarea id="${escapeId(field.name)}" name="${escapeAttr(field.name)}"
                          class="w-full p-2 border rounded-md bg-white focus:ring focus:ring-blue-300"
                          ${required}></textarea>`;
                break;

              case 'select':
                html += `<select id="${escapeId(field.name)}" name="${escapeAttr(field.name)}"
                          class="w-full p-2 border rounded-md bg-white focus:ring focus:ring-blue-300"
                          ${required}>`;
                (field.options || []).forEach(opt => {
                  html += `<option value="${escapeAttr(opt.value)}">${escapeHtml(opt.label)}</option>`;
                });
                html += `</select>`;
                break;

              case 'multi-select':
                // only task_role will get select2 later; name uses [] so multiple values serialize well
                const isTaskRole = field.name === "task_role";
                html += `<select id="${escapeId(field.name)}" name="${escapeAttr(field.name)}[]" multiple
                          class="w-full p-2 border rounded-md bg-white focus:ring focus:ring-blue-300 ${isTaskRole ? 'multi-select' : ''}"
                          ${required}>`;
                (field.options || []).forEach(opt => {
                  html += `<option value="${escapeAttr(opt.value)}">${escapeHtml(opt.label)}</option>`;
                });
                html += `</select>`;
                break;

              case 'checkbox':
                html += `<div class="flex flex-col gap-2">`;
                (field.options || []).forEach(opt => {
                  html += `<label class="flex items-center gap-2">
                            <input type="checkbox" name="${escapeAttr(field.name)}" value="${escapeAttr(opt.value)}" class="form-checkbox text-blue-600">
                            <span>${escapeHtml(opt.label)}</span>
                          </label>`;
                });
                html += `</div>`;
                break;

              case 'radio':
                html += `<div class="flex flex-col gap-2">`;
                (field.options || []).forEach(opt => {
                  html += `<label class="flex items-center gap-2">
                            <input type="radio" name="${escapeAttr(field.name)}" value="${escapeAttr(opt.value)}" class="form-radio text-blue-600">
                            <span>${escapeHtml(opt.label)}</span>
                          </label>`;
                });
                html += `</div>`;
                break;

              case 'group':
                if (field.fields && Array.isArray(field.fields)) {
                  html += `<div class="flex flex-col gap-5 bg-gray-200 font-sm">`;
                  field.fields.forEach(nested => {
                    html += generateField(nested);
                  });
                  html += `</div>`;
                }
                break;

              default:
                // unknown type - render a safe text input
                html += `<input type="text" id="${escapeId(field.name)}" name="${escapeAttr(field.name)}"
                          class="w-full p-2 border rounded-md bg-white focus:ring focus:ring-blue-300" ${required}>`;
                break;
            }

            html += `</div></div>`; // close input wrapper + row
            return html;
          } catch (err) {
            console.error("generateField error:", err);
            return "";
          }
        } // generateField

        // helpers for safety
        function escapeHtml(s) { return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
        function escapeAttr(s) { return String(s || '').replace(/"/g,'&quot;'); }
        function escapeId(s) { return String(s || '').replace(/[^a-zA-Z0-9_-]/g, '_'); }

        // render form (keeps your original order)
        function renderForm({ fields, form }) {
          try {
            form.empty();
            fields.forEach(f => form.append(generateField(f)));
          } catch (err) {
            console.error("renderForm error:", err);
          }
        }

        // add submit button (keeps your style)
        function addSubmitButton({ form }) {
          try {
            form.append(`
              <div class="flex justify-center mt-6">
                <button type="submit" class="w-40 text-white border border-black bg-blue-600 rounded-lg shadow-md p-3">
                  Register
                </button>
              </div>
            `);
          } catch (err) {
            console.error("addSubmitButton error:", err);
          }
        }

        // hide initial conditional wrappers
        function hideInitialFields() {
          try {
            $('#wrapper_position, #wrapper_task_role, #wrapper_manager, #wrapper_task_info, #wrapper_due_date, #wrapper_priority').hide();
          } catch (err) {
            console.error("hideInitialFields error:", err);
          }
        }

        // validation helper (keeps name & phone validation)
        function ValidityState() {
          try {
            const nameSel = $('#emp_name').length ? '#emp_name' : '#ename';
            const phoneSel = $('#phone').length ? '#phone' : '#phno';
            const name = $(nameSel).val()?.trim() || '';
            const phone = $(phoneSel).val()?.trim() || '';

            if (phone && !/^\d{10}$/.test(phone)) {
              alert("Phone number must be exactly 10 digits.");
              return false;
            }
            if (name && !/^[A-Za-z ]+$/.test(name)) {
              alert("Name must contain only alphabets.");
              return false;
            }
            return true;
          } catch (err) {
            console.error("ValidityState error:", err);
            return false;
          }
        }

        // collect form data (ensure multi-select arrays preserved)
        function collectFormData($form) {
          try {
            const arr = $form.serializeArray();
            const out = {};
            arr.forEach(({name, value}) => {
              // handle name[] pattern (multi-select)
              if (name.endsWith('[]')) {
                const key = name.slice(0, -2);
                out[key] = out[key] || [];
                out[key].push(value);
              } else {
                if (out[name] === undefined) out[name] = value;
                else if (Array.isArray(out[name])) out[name].push(value);
                else out[name] = [ out[name], value ];
              }
            });

            // ensure empty multi-selects exist as empty arrays
            $form.find('select[multiple]').each(function () {
              const raw = $(this).attr('name') || '';
              const key = raw.endsWith('[]') ? raw.slice(0, -2) : raw;
              if (out[key] === undefined) out[key] = [];
            });

            return out;
          } catch (err) {
            console.error("collectFormData error:", err);
            return {};
          }
        }

        // attach events (keeps your original show/hide logic)
        function attachEvents() {
          try {
            // department show position/task role
            $(document).on('change', '#department', function () {
              try {
                const val = $(this).val();
                $('#wrapper_position, #wrapper_task_role').toggle(!!val);
              } catch (err) { console.error("dept change error:", err); }
            });

            // action (checkbox group) → show manager & task_info when newtask present
            $(document).on('change', 'input[name="action"]', function () {
              try {
                const isNew = $("input[name='action'][value='newtask']").is(":checked");
                $('#wrapper_manager, #wrapper_task_info, #wrapper_due_date, #wrapper_priority').toggle(isNew);
              } catch (err) { console.error("action change error:", err); }
            });

            // submit handler (preserve validation and behavior)
           $('#dynamicForm').on('submit', function (e) {
  try {
    e.preventDefault();

    // required fields validation
    let ok = true;
    $('#dynamicForm').find('[required]').each(function () {
      const $el = $(this);
      const val = $el.val();
      const empty = Array.isArray(val) ? (val.length === 0) : (!val);
      $el.toggleClass('border-red-500', empty);
      if (empty) ok = false;
    });

    if (!ok) {
      alert("Please fill all required fields.");
      return;
    }

    if (!(ValidityState())) 
        return;

    const payload = collectFormData($('#dynamicForm'));

    let employees = JSON.parse(localStorage.getItem("employees")) || [];
    employees.push(payload);
    localStorage.setItem("employees", JSON.stringify(employees));

    console.log("Saved employee:", payload);
    alert("Employee Registered Successfully");

    // Redirect
    window.location.href = "html/Data_table.html";
  } catch (err) {
    console.error("Submit handler error:", err);
  }
});

        
          } catch (err) {
            console.error("attachEvents error:", err);
          }
        }

        // initialize rendering + events
        try {
          renderForm({ fields: fields, form: $form });
          addSubmitButton({ form: $form });
          hideInitialFields();
          attachEvents();

          // initialize select2 ONLY for task_role if present
          if ($('#task_role.multi-select').length && $.fn.select2) {
            $('#task_role.multi-select').select2({ placeholder: "Select Task Roles", allowClear: true, width: '100%' });
          }
        } catch (err) {
          console.error("initWith error:", err);
        }

      } catch (err) {
        console.error("initWith outer error:", err);
      }
    } // initWith

  } catch (err) {
    console.error("document.ready outer error:", err);
  }
});
