/* ════════════════════════════════════════════════════════════════
   KFC Siam Survey – survey.js
   Handles:
     1. Toggle / deselect for radio-based pill & menu cards
     2. Visual highlight (driven by CSS :has(input:checked),
        plus data-selected attr for older-browser fallback)
     3. Form validation — required fields
     4. Collect all inputs into an object → console.log on submit
   ════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── 1. Required field configuration ───────────────────────────
     List every radio group name that MUST be answered.
  ─────────────────────────────────────────────────────────────── */
  const REQUIRED_RADIO_GROUPS = [
    'occupation',
    'age',
    'gender',
    'dine_type',
    'order_type',
    'payment',
    'order_method',
    'budget',
    'menu_category'
  ];

  /* Checkbox groups — at least one must be ticked */
  const REQUIRED_CHECKBOX_GROUPS = [
    'addon',
    'promotion',
  ];

  /* ── Faculty section: show only when Student is selected ───── */
  const facultySection = document.getElementById('faculty-section');

  function updateFacultyVisibility() {
    const studentSelected = document.querySelector('input[name="occupation"][value="student"]:checked');
    if (studentSelected) {
      facultySection.classList.remove('hidden');
    } else {
      facultySection.classList.add('hidden');
      const fInput = document.getElementById('faculty-input');
      const fSelected = document.querySelector('#faculty-dropdown .dropdown-selected');
      if (fInput) fInput.value = '';
      if (fSelected) {
        fSelected.textContent = '— Select your faculty —';
        fSelected.classList.add('placeholder');
      }
      const fList = document.getElementById('faculty-list');
      if (fList) {
        Array.from(fList.children).forEach(cb => cb.classList.remove('selected'));
      }
    }
  }

  // Hide by default (HTML also has class="hidden" as fallback)
  // Show/hide whenever occupation changes
  document.querySelectorAll('input[name="occupation"]').forEach((r) => {
    r.addEventListener('change', updateFacultyVisibility);
  });

  /* ── 2. Toggle / deselect (click same radio again → uncheck) ───
     Native <input type="radio"> elements cannot be deselected by
     clicking the same option. We intercept the click with a
     mousedown trick.
  ─────────────────────────────────────────────────────────────── */
  let previouslyChecked = null;

  document.addEventListener('mousedown', (e) => {
    const pill = e.target.closest('.pill-item, .menu-card');
    if (!pill) return;
    const radio = pill.querySelector('input[type="radio"]');
    if (!radio) return;
    previouslyChecked = radio.checked ? radio : null;
  });

  document.addEventListener('click', (e) => {
    const pill = e.target.closest('.pill-item, .menu-card');
    if (!pill) return;
    const radio = pill.querySelector('input[type="radio"]');
    if (!radio) return;

    if (previouslyChecked === radio) {
      radio.checked = false;
      previouslyChecked = null;
      radio.dispatchEvent(new Event('change', { bubbles: true }));
    }

    previouslyChecked = radio.checked ? radio : null;
    updateHighlight(radio);
  });

  /* ── 3. Visual highlight helper (data-selected attribute) ──────
  ─────────────────────────────────────────────────────────────── */
  function updateHighlight(changedRadio) {
    const groupName = changedRadio.name;
    document.querySelectorAll(`input[name="${groupName}"]`).forEach((r) => {
      const wrapper = r.closest('.pill-item, .menu-card, .star-item');
      if (wrapper) wrapper.dataset.selected = r.checked ? 'true' : 'false';
    });
  }

  // Set initial data-selected values on page load
  document.querySelectorAll('input[type="radio"]').forEach((r) => {
    r.addEventListener('change', () => updateHighlight(r));
    updateHighlight(r);
  });

  /* ── 4. Inline error messages ──────────────────────────────────
  ─────────────────────────────────────────────────────────────── */
  function getOrCreateError(anchorEl) {
    let err = anchorEl.nextElementSibling;
    if (!err || !err.classList.contains('field-error')) {
      err = document.createElement('span');
      err.className = 'field-error';
      err.setAttribute('role', 'alert');
      err.setAttribute('aria-live', 'polite');
      anchorEl.insertAdjacentElement('afterend', err);
    }
    return err;
  }

  function showError(anchorEl, message) {
    const err = getOrCreateError(anchorEl);
    err.textContent = message;
    err.style.display = 'block';
    anchorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function clearError(anchorEl) {
    const err = anchorEl.nextElementSibling;
    if (err && err.classList.contains('field-error')) {
      err.textContent = '';
      err.style.display = 'none';
    }
  }

  // Clear radio errors on change
  REQUIRED_RADIO_GROUPS.forEach((name) => {
    document.querySelectorAll(`input[name="${name}"]`).forEach((r) => {
      r.addEventListener('change', () => {
        const grid = r.closest('.pill-grid, .menu-grid, .star-group');
        if (grid) clearError(grid);
      });
    });
  });

  // Clear checkbox errors on change
  REQUIRED_CHECKBOX_GROUPS.forEach((name) => {
    document.querySelectorAll(`input[name="${name}"]`).forEach((cb) => {
      cb.addEventListener('change', () => {
        const grid = cb.closest('.pill-grid, .menu-grid');
        if (grid) clearError(grid);
      });
    });
  });

  /* ────────────────────────────────────────────────────────────
     3. Form Data Construction (Payload for Backend)
  ─────────────────────────────────────────────────────────────── */
  function collectFormData() {
    const getRadio = (name) => {
      const el = document.querySelector(`input[name="${name}"]:checked`);
      return el ? el.value : null;
    };

    const getCheckboxes = (name) => {
      return [...document.querySelectorAll(`input[name="${name}"]:checked`)]
        .map((cb) => cb.value);
    };

    const getSlider = (name) => {
      const el = document.querySelector(`input[name="${name}"]`);
      return el ? parseInt(el.value, 10) : null;
    };

    const visitLabels = ["Rarely", "Sometimes", "Often", "Usually", "Always"];
    const freqSliderEl = document.getElementById('visit-freq-slider');
    const visitFreqVal = freqSliderEl ? visitLabels[parseInt(freqSliderEl.value)] : null;

    // This object maps 1:1 exactly to what the Backend receives
    return {
      // Personal Info
      occupation:    getRadio('occupation'),
      major:         document.getElementById('faculty-input') ? document.getElementById('faculty-input').value : null,

      // Demographics
      age:           getRadio('age'),
      gender:        getRadio('gender'),
      nationality:   document.getElementById('nationality-input') ? document.getElementById('nationality-input').value : null,

      // Customer Behavior
      visitFrequency: visitFreqVal,

      // Visit Details
      visitTime:     getRadio('visit_time'),
      dineType:      getRadio('dine_type'),
      orderType:     getRadio('order_type'),
      payment:       getRadio('payment'),
      orderMethod:   getRadio('order_method'),
      budget:        getRadio('budget'),

      // Menu Preferences
      menuCategory:  getRadio('menu_category'),
      addon:         getCheckboxes('addon'),

      // Promotions
      promotion:     getCheckboxes('promotion'),

      // Ratings
      flavorRating:  getSlider('flavor_quality'),
      serviceRating: getSlider('service_rating'),

      // Metadata
      submittedAt:   new Date().toISOString(),
    };
  }

  /* ────────────────────────────────────────────────────────────
     4. Form Validation
  ─────────────────────────────────────────────────────────────── */
  function validateForm() {
    let firstErrorEl = null;

    // Radio groups
    REQUIRED_RADIO_GROUPS.forEach((name) => {
      const radios = document.querySelectorAll(`input[name="${name}"]`);
      const checked = [...radios].some((r) => r.checked);
      const grid = radios[0]
        ? radios[0].closest('.pill-grid, .menu-grid, .star-group')
        : null;

      if (!checked && grid) {
        showError(grid, '⚠️ Please select an option.');
        if (!firstErrorEl) firstErrorEl = grid;
      } else if (grid) {
        clearError(grid);
      }
    });

    // Faculty dropdown — only required when Student is selected
    const isStudent = document.querySelector('input[name="occupation"][value="student"]:checked');
    const facultyInput = document.getElementById('faculty-input');
    const facultyDropdown = document.getElementById('faculty-dropdown');
    
    if (isStudent && facultyInput && !facultyInput.value) {
      showError(facultyDropdown || facultyInput, '⚠️ Please choose your faculty.');
      if (!firstErrorEl) firstErrorEl = facultyDropdown || facultyInput;
    } else if (facultyDropdown) {
      clearError(facultyDropdown);
    }

    // Nationality dropdown validation
    const natInput = document.getElementById('nationality-input');
    const natDropdown = document.getElementById('nationality-dropdown');
    if (natInput && !natInput.value) {
      showError(natDropdown, '⚠️ Please select your nationality.');
      if (!firstErrorEl) firstErrorEl = natDropdown;
    } else if (natDropdown) {
      clearError(natDropdown);
    }

    // Checkbox groups — at least one must be checked
    REQUIRED_CHECKBOX_GROUPS.forEach((name) => {
      const boxes = document.querySelectorAll(`input[name="${name}"]`);
      const anyChecked = [...boxes].some((cb) => cb.checked);
      const grid = boxes[0]
        ? boxes[0].closest('.pill-grid, .menu-grid')
        : null;

      if (!anyChecked && grid) {
        showError(grid, '⚠️ Please select at least one option.');
        if (!firstErrorEl) firstErrorEl = grid;
      } else if (grid) {
        clearError(grid);
      }
    });

    return firstErrorEl === null;
  }

  /* ────────────────────────────────────────────────────────────
     5. Toast Notification System
  ─────────────────────────────────────────────────────────────── */
  function showToast(message, isError = false) {
    let toast = document.getElementById('survey-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'survey-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.style.background = isError ? 'var(--red)' : '#10B981';
    toast.className = 'toast toast--visible';

    // Auto lay out/hide after 3.5s
    setTimeout(() => toast.classList.remove('toast--visible'), 3500);
  }

  /* ────────────────────────────────────────────────────────────
     6. UI Reset Helper (called after successful submission)
  ─────────────────────────────────────────────────────────────── */
  function resetFormUI() {
    form.reset();

    // Reset Custom Dropdowns
    ['nationality', 'faculty'].forEach(prefix => {
      const input = document.getElementById(`${prefix}-input`);
      const selected = document.querySelector(`#${prefix}-dropdown .dropdown-selected`);
      const list = document.getElementById(`${prefix}-list`);
      
      if (input) input.value = '';
      if (selected) {
        selected.textContent = prefix === 'faculty' ? '— Select your faculty —' : 'Select your country...';
        selected.classList.add('placeholder');
      }
      if (list) {
        Array.from(list.children).forEach(cb => cb.classList.remove('selected'));
      }
    });

    // Reset Sliders
    document.querySelectorAll('input[type="range"]').forEach(slider => {
      slider.dispatchEvent(new Event('input')); // fires background/UI reset
    });

    // Reset native pills selection wrapper
    document.querySelectorAll('.pill-item, .menu-card').forEach(item => {
      item.dataset.selected = 'false';
    });

    // Reset conditional faculty section if visible
    if (!document.querySelector('input[name="occupation"][value="student"]:checked')) {
      document.getElementById('faculty-section')?.classList.add('hidden');
    }
  }

  /* ────────────────────────────────────────────────────────────
     7. Backend Integration (Mock API)
  ─────────────────────────────────────────────────────────────── */
  async function sendToBackend(payload) {
    // TODO: Connect your actual backend here!
    // Example:
    // return await fetch('https://your-api-url.com/api/submit-survey', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(payload)
    // });
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ ok: true, message: 'Simulated API Success' });
      }, 1500); // simulate 1.5s network delay
    });
  }

  /* ────────────────────────────────────────────────────────────
     8. Submission Handler
  ─────────────────────────────────────────────────────────────── */
  const form = document.getElementById('survey-form');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast('⚠️ Please fill in all required fields.', true);
      return;
    }

    const payload = collectFormData();
    console.log('[API Payload Ready]', payload);

    // Prepare UI for submission
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = 'Sending...';
    submitBtn.disabled = true;

    try {
      const response = await sendToBackend(payload);
      
      if (response.ok) {
        showToast('✅ Thank you! Your feedback has been submitted.');
        resetFormUI(); // Clear the form natively and custom components
      } else {
        throw new Error('Backend returned an error.');
      }
    } catch (error) {
      console.error('Submission failed:', error);
      showToast('❌ Failed to submit. Please try again later.', true);
    } finally {
      // Restore button
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }
  });

  /* ── 9. Setup Custom Interactive Components ────────────────────
  ─────────────────────────────────────────────────────────────── */
  function initInteractiveComponents() {
    /* -- Nationality Custom Dropdown -- */
    const countries = [
      "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria",
      "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan",
      "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia",
      "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica",
      "Croatia", "Cuba", "Cyprus", "Czechia", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt",
      "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon",
      "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana",
      "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel",
      "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea, North", "Korea, South", "Kuwait",
      "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg",
      "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico",
      "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru",
      "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Macedonia", "Norway", "Oman", "Pakistan",
      "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania",
      "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal",
      "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Sudan",
      "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania",
      "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda",
      "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam",
      "Yemen", "Zambia", "Zimbabwe"
    ];

    // -- Generic setup for custom dropdowns (no-search statically defined ones) --
    const setupStaticDropdown = (dropdownId, listId, inputId) => {
      const dropdown = document.getElementById(dropdownId);
      const list = document.getElementById(listId);
      const input = document.getElementById(inputId);
      const selectedEl = dropdown?.querySelector('.dropdown-selected');
      if (!dropdown || !list || !input) return;

      list.addEventListener('click', (e) => {
        e.stopPropagation(); // prevent bubbling to dropdown toggle
        const li = e.target.closest('li');
        if (!li) return;
        const val = li.dataset.value || li.textContent;
        input.value = val;
        selectedEl.textContent = li.textContent;
        selectedEl.classList.remove("placeholder");
        dropdown.classList.remove("open");
        clearError(dropdown);
        
        Array.from(list.children).forEach(child => child.classList.remove('selected'));
        li.classList.add('selected');
      });

      dropdown.addEventListener('click', () => dropdown.classList.toggle('open'));
      document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target)) dropdown.classList.remove('open');
      });
    };

    // Initialize Faculty as custom dropdown
    setupStaticDropdown('faculty-dropdown', 'faculty-list', 'faculty-input');

    // -- Nationality Searchable Dropdown --
    const natDropdown = document.getElementById('nationality-dropdown');
    const natSearch = document.getElementById('nationality-search');
    const natList = document.getElementById('nationality-list');
    const natInput = document.getElementById('nationality-input');
    const natSelected = natDropdown?.querySelector('.dropdown-selected');

    if (natDropdown) {
      const renderCountries = (filter = "") => {
        natList.innerHTML = "";
        const lowerFilter = filter.toLowerCase();
        let count = 0;
        
        countries.forEach(country => {
          if (country.toLowerCase().includes(lowerFilter)) {
            count++;
            const li = document.createElement("li");
            li.textContent = country;
            if (natInput.value === country) li.classList.add("selected");
            li.addEventListener("click", (e) => {
              e.stopPropagation(); // prevent bubbling to dropdown toggle
              natInput.value = country;
              natSelected.textContent = country;
              natSelected.classList.remove("placeholder");
              natDropdown.classList.remove("open");
              clearError(natDropdown);
              renderCountries(); // update visual selection
            });
            natList.appendChild(li);
          }
        });
        
        if (count === 0) {
          const li = document.createElement("li");
          li.textContent = "No countries found";
          li.style.color = "var(--text-faint)";
          li.style.pointerEvents = "none";
          natList.appendChild(li);
        }
      };

      renderCountries();

      natDropdown.addEventListener('click', (e) => {
        if (e.target === natSearch) return; // ignore clicks on search input inside
        natDropdown.classList.toggle('open');
        if (natDropdown.classList.contains('open')) {
          natSearch.focus();
        }
      });

      natSearch.addEventListener('input', (e) => renderCountries(e.target.value));

      document.addEventListener('click', (e) => {
        if (!natDropdown.contains(e.target)) {
          natDropdown.classList.remove('open');
        }
      });
    }

    /* -- Sliders Logic & Dynamic Styling -- */
    const updateSliderBackground = (slider) => {
      const val = parseFloat(slider.value);
      const min = parseFloat(slider.min) || 0;
      const max = parseFloat(slider.max) || 100;
      const percent = ((val - min) / (max - min)) * 100;
      slider.style.background = `linear-gradient(to right, var(--red) ${percent}%, var(--border) ${percent}%)`;
    };

    // Frequency Slider
    const freqSlider = document.getElementById("visit-freq-slider");
    const freqDisplay = document.getElementById("visit-freq-display");
    const freqSpans = document.querySelectorAll("#visit-freq-container .slider-labels span");
    const visitLabels = ["Rarely", "Sometimes", "Often", "Usually", "Always"];

    if (freqSlider) {
      freqSlider.addEventListener("input", (e) => {
        const val = parseInt(e.target.value);
        freqDisplay.textContent = visitLabels[val];
        freqSpans.forEach((span, i) => span.classList.toggle("active", i === val));
        updateSliderBackground(e.target);
      });
      freqSlider.dispatchEvent(new Event("input")); // Initial flush
    }

    // Rating Sliders
    const ratingData = [
      { text: "Poor", emoji: "😞" },
      { text: "Fair", emoji: "😐" },
      { text: "Good", emoji: "🙂" },
      { text: "Very Good", emoji: "😎" },
      { text: "Excellent", emoji: "🤩" }
    ];

    document.querySelectorAll(".rating-slider").forEach(slider => {
      slider.addEventListener("input", (e) => {
        const val = parseInt(e.target.value);
        const data = ratingData[val - 1]; // 1-based index (1 to 5)
        const displayEl = document.getElementById("display-" + e.target.name);
        
        if (displayEl) {
          displayEl.innerHTML = `<span>${data.emoji}</span> ${val} - ${data.text}`;
        }
        updateSliderBackground(e.target);
      });
      slider.dispatchEvent(new Event("input")); // Initial flush
    });
  }

  // Initialize
  initInteractiveComponents();

})();
