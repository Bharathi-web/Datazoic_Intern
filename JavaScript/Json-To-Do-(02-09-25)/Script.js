
    let workspacesData = [];

    const companySelect = document.getElementById("companySelect");
    const deptSelect = document.getElementById("deptSelect");
    const employeeContainer = document.getElementById("employeeContainer");
    const progressInfo = document.getElementById("progressInfo");

    fetch("companies_todo_app.json")
      .then(res => res.json())
      .then(json => {
        workspacesData = json.workspaces;
        populateCompanies(workspacesData);
      })
      .catch(err => {
        console.error("Error loading JSON:", err);
        alert("Failed to load company data.");
      });

    function populateCompanies(data) {
      data.forEach(company => {
        const option = document.createElement("option");
        option.value = company.id;
        option.textContent = company.name;
        companySelect.appendChild(option);
      });
    }

    companySelect.addEventListener("change", () => {
      const selectedCompany = workspacesData.find(c => c.id === companySelect.value);

      deptSelect.innerHTML = `<option value="">-- Choose Department --</option>`;
      employeeContainer.innerHTML = "";
      progressInfo.textContent = "";


      if (selectedCompany) {
        deptSelect.disabled = false;
        selectedCompany.lists.forEach(dept => {
          const option = document.createElement("option");
          option.value = dept.id;
          option.textContent = dept.name;
          deptSelect.appendChild(option);
        });
      } else {
        deptSelect.disabled = true;
      }
    });

    deptSelect.addEventListener("change", () => {
      const selectedCompany = workspacesData.find(c => c.id === companySelect.value);
      const selectedDept = selectedCompany.lists.find(d => d.id === deptSelect.value);

      employeeContainer.innerHTML = "";
      progressInfo.textContent = "";

      if (selectedDept) {
        selectedDept.tasks.forEach(task => {
          employeeContainer.appendChild(renderEmployeeCard(task));
        });
        updateProgress(selectedDept.tasks);

      }
    });

    function updateProgress(tasks) {
      const total = tasks.length;
      const completed = tasks.filter(t => t.status === 2).length;
      progressInfo.textContent = `Progress: ${completed} / ${total} tasks completed`;
    }



    function renderEmployeeCard(emp) {
        const statusColors = {
            "1": "bg-red-100 text-red-700",
            "2": "bg-green-100 text-green-700",
            "0": "bg-yellow-100 text-yellow-700",
            "-1": "bg-gray-200 text-gray-600"
        };
        const statusLabels = {
            "1": "Incomplete",
            "2": "Complete",
            "0": "Yet To Start",
            "-1": "On Hold"
        };

  const div = document.createElement("div");
  div.className = "border border-blue-500 bg-white p-4 rounded-xl shadow-md";

  const role = emp.description.replace("Role: ", "");

  div.innerHTML = `
    <h2 class="text-lg font-bold text-black-600">${emp.title} - <span class="text-blue-800">${role}</span></h2>
    <p class="mt-1 text-sm text-blue-500">Employee ID: ${emp.id}</p>
    <div class="flex flex-wrap mt-2 gap-2"><b>SKILLS:</b>
      ${emp.tags.map(skill => `<span class="border border-blue-500 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">${skill}</span>`).join("")}
    </div>
    <span class="inline-block mt-3 px-3 py-3 rounded-full text-sm ${statusColors[emp.status]}" data-status="${emp.status}">
      ${statusLabels[emp.status]}
    </span>
    <button onclick="completestatus(this)" class="ml-4 mt-3 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
      ${emp.status === 2 ? "Completed" : "Mark Completed"}
    </button>
  `;

  return div;
}
  const searchInput = document.getElementById("searchInput");
  
  
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    const selectedCompany = workspacesData.find(c => c.id === companySelect.value);
    const selectedDept = selectedCompany?.lists.find(d => d.id === deptSelect.value);
    employeeContainer.innerHTML = "";
    progressInfo.textContent = "";
    
    if (selectedDept) {
      const filteredTasks = selectedDept.tasks.filter(task =>
      task.title.toLowerCase().includes(query) ||
      task.id.toLowerCase().includes(query)
    );

    filteredTasks.forEach(task => {
      employeeContainer.appendChild(renderEmployeeCard(task));
    });

    updateProgress(filteredTasks);
  }

});
function completestatus(button) {
  const statusSpan = button.previousElementSibling;
  const currentStatus = statusSpan.getAttribute("data-status");

  if (currentStatus === "2") {
    
    statusSpan.className = "inline-block mt-3 px-3 py-3 rounded-full text-sm bg-red-100 text-red-700";
    statusSpan.textContent = "Incomplete";
    statusSpan.setAttribute("data-status", "1");
    button.textContent = "Mark Completed";
    button.classList.remove("bg-green-500");
    button.classList.add("bg-blue-500");
  } else {

    statusSpan.className = "inline-block mt-3 px-3 py-3 rounded-full text-sm bg-green-100 text-green-700";
    statusSpan.textContent = "Complete";
    statusSpan.setAttribute("data-status", "2");
    button.textContent = "Completed";
    button.classList.remove("bg-blue-500");
    button.classList.add("bg-green-500");
  }

  const allCards = document.querySelectorAll("#employeeContainer > div");
  const tasks = Array.from(allCards).map(card => {
    const status = card.querySelector("span[data-status]").getAttribute("data-status");
    return { status: parseInt(status) };
  });

  updateProgress(tasks);
}
