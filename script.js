const form = document.getElementById("student-form");
const nameInput = document.getElementById("student-name");
const courseInput = document.getElementById("student-course");
const formError = document.getElementById("form-error");
const list = document.getElementById("student-list");
const searchInput = document.getElementById("search");
const emptyMessage = document.getElementById("empty-message");
const themeToggle = document.getElementById("theme-toggle");
const filterButtons = document.querySelectorAll(".filter-btn");

const statTotal = document.getElementById("stat-total");
const statActive = document.getElementById("stat-active");
const statInactive = document.getElementById("stat-inactive");
const statShowing = document.getElementById("stat-showing");

let currentFilter = "all";

function createStudentItem(name, course) {
  const item = document.createElement("li");
  item.className = "student";
  item.setAttribute("data-status", "active");
  item.setAttribute("data-search", (name + " " + course).toLowerCase());

  const info = document.createElement("div");
  info.className = "student-info";

  const nameEl = document.createElement("strong");
  nameEl.textContent = name;

  const courseEl = document.createElement("span");
  courseEl.textContent = course;

  info.appendChild(nameEl);
  info.appendChild(courseEl);

  const badge = document.createElement("span");
  badge.className = "badge";
  badge.textContent = "Active";

  const toggleBtn = document.createElement("button");
  toggleBtn.type = "button";
  toggleBtn.className = "toggle-btn";
  toggleBtn.textContent = "Mark inactive";

  const removeBtn = document.createElement("button");
  removeBtn.type = "button";
  removeBtn.className = "remove-btn";
  removeBtn.textContent = "Remove";

  item.appendChild(info);
  item.appendChild(badge);
  item.appendChild(toggleBtn);
  item.appendChild(removeBtn);

  return item;
}

function toggleStatus(item) {
  const isInactive = item.classList.toggle("inactive");
  item.setAttribute("data-status", isInactive ? "inactive" : "active");
  item.querySelector(".badge").textContent = isInactive ? "Inactive" : "Active";
  item.querySelector(".toggle-btn").textContent = isInactive ? "Mark active" : "Mark inactive";
}

function updateStats(visibleCount) {
  const items = list.querySelectorAll(".student");
  let inactiveCount = 0;

  items.forEach(function (item) {
    if (item.classList.contains("inactive")) {
      inactiveCount++;
    }
  });

  statTotal.textContent = items.length;
  statActive.textContent = items.length - inactiveCount;
  statInactive.textContent = inactiveCount;
  statShowing.textContent = visibleCount;
}

function applyFilters() {
  const query = searchInput.value.trim().toLowerCase();
  const items = list.querySelectorAll(".student");
  let visibleCount = 0;

  items.forEach(function (item) {
    const matchesSearch = item.getAttribute("data-search").includes(query);
    const status = item.getAttribute("data-status");
    const matchesFilter = currentFilter === "all" || status === currentFilter;

    if (matchesSearch && matchesFilter) {
      item.classList.remove("hidden");
      visibleCount++;
    } else {
      item.classList.add("hidden");
    }
  });

  emptyMessage.classList.toggle("hidden", visibleCount > 0);
  updateStats(visibleCount);
}

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = nameInput.value.trim();
  const course = courseInput.value.trim();

  if (name === "" || course === "") {
    formError.classList.remove("hidden");
    return;
  }

  formError.classList.add("hidden");
  list.appendChild(createStudentItem(name, course));
  form.reset();
  nameInput.focus();
  applyFilters();
});

list.addEventListener("click", function (event) {
  const item = event.target.closest(".student");

  if (!item) {
    return;
  }

  if (event.target.classList.contains("remove-btn")) {
    item.remove();
  } else if (event.target.classList.contains("toggle-btn")) {
    toggleStatus(item);
  }

  applyFilters();
});

searchInput.addEventListener("input", applyFilters);

filterButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    filterButtons.forEach(function (other) {
      other.classList.remove("selected");
    });

    button.classList.add("selected");
    currentFilter = button.getAttribute("data-filter");
    applyFilters();
  });
});

themeToggle.addEventListener("click", function () {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  themeToggle.textContent = isDark ? "Light mode" : "Dark mode";
});

const starterStudents = [
  ["Maya Chen", "Web Development"],
  ["Daniel Okafor", "Data Science"],
  ["Sofia Alvarez", "UI Design"],
  ["Liam Novak", "Machine Learning"]
];

starterStudents.forEach(function (student) {
  list.appendChild(createStudentItem(student[0], student[1]));
});

toggleStatus(list.lastElementChild);

applyFilters();
