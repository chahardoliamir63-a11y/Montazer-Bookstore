// Admin panel script
// Handles admin login, order rendering, status updates, and data persistence.

const loginForm = document.getElementById("loginForm");
const loginSection = document.getElementById("loginSection");
const dashboardSection = document.getElementById("dashboardSection");
const loginError = document.getElementById("loginError");
const logoutBtn = document.getElementById("logoutBtn");
const ordersContainer = document.getElementById("ordersContainer");
const ordersCount = document.getElementById("ordersCount");
const totalSales = document.getElementById("totalSales");
const newOrdersCount = document.getElementById("newOrdersCount");
const clearAllBtn = document.getElementById("clearAllBtn");

// Admin credentials for simple authentication.
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "1234";

// Check if the admin is already logged in and show the appropriate section.
function checkLogin() {
  const isLoggedIn = localStorage.getItem("adminLoggedIn");
  if (isLoggedIn === "true") {
    loginSection.classList.add("hidden");
    dashboardSection.classList.remove("hidden");
    renderOrders();
  } else {
    loginSection.classList.remove("hidden");
    dashboardSection.classList.add("hidden");
  }
}

// Login form submit handler.
if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      localStorage.setItem("adminLoggedIn", "true");
      loginError.classList.add("hidden");
      checkLogin();
    } else {
      loginError.classList.remove("hidden");
    }
  });
}

// Logout button handler removes login state and reloads the page.
if (logoutBtn) {
  logoutBtn.addEventListener("click", function () {
    localStorage.removeItem("adminLoggedIn");
    location.reload();
  });
}

// Load orders array from localStorage.
function getOrders() {
  return JSON.parse(localStorage.getItem("bookOrders")) || [];
}

// Save orders array to localStorage.
function saveOrders(orders) {
  localStorage.setItem("bookOrders", JSON.stringify(orders));
}

// Render all orders in the dashboard and update summary stats.
function renderOrders() {
  const orders = getOrders();
  ordersContainer.innerHTML = "";

  ordersCount.textContent = orders.length.toLocaleString("fa-IR");

  const total = orders.reduce((sum, order) => sum + order.total, 0);
  totalSales.textContent = total.toLocaleString("fa-IR") + " تومان";

  const newCount = orders.filter(order => order.status === "جدید").length;
  newOrdersCount.textContent = newCount.toLocaleString("fa-IR");

  if (orders.length === 0) {
    ordersContainer.innerHTML = `
      <div class="rounded-2xl bg-gray-50 border border-gray-200 p-6 text-center text-gray-500 font-bold">
        هنوز سفارشی ثبت نشده است.
      </div>
    `;
    return;
  }

  // Render each order card in reverse chronological order.
  orders.slice().reverse().forEach(order => {
    const card = document.createElement("div");
    card.className = "rounded-3xl border border-violet-100 bg-gradient-to-r from-white to-violet-50 p-5";

    card.innerHTML = `
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
        <div class="space-y-2">
          <h4 class="text-xl font-black text-dark">${order.book}</h4>
          <p class="text-sm text-gray-600"><span class="font-bold">مشتری:</span> ${order.name}</p>
          <p class="text-sm text-gray-600"><span class="font-bold">شماره تماس:</span> ${order.phone}</p>
          <p class="text-sm text-gray-600"><span class="font-bold">تعداد:</span> ${order.quantity}</p>
          <p class="text-sm text-gray-600"><span class="font-bold">مبلغ:</span> ${order.total.toLocaleString("fa-IR")} تومان</p>
          <p class="text-sm text-gray-600"><span class="font-bold">تاریخ:</span> ${order.date}</p>
          <p class="text-sm text-gray-600"><span class="font-bold">توضیحات:</span> ${order.description || "ندارد"}</p>
        </div>

        <div class="flex flex-col gap-3 min-w-[220px]">
          <select data-id="${order.id}" class="statusSelect rounded-2xl border border-violet-200 px-4 py-3 outline-none">
            <option value="جدید" ${order.status === "جدید" ? "selected" : ""}>جدید</option>
            <option value="در حال بررسی" ${order.status === "در حال بررسی" ? "selected" : ""}>در حال بررسی</option>
            <option value="تکمیل شده" ${order.status === "تکمیل شده" ? "selected" : ""}>تکمیل شده</option>
            <option value="لغو شده" ${order.status === "لغو شده" ? "selected" : ""}>لغو شده</option>
          </select>

          <div class="rounded-2xl px-4 py-3 font-bold text-center ${
            order.status === "جدید" ? "bg-blue-50 text-blue-700" :
            order.status === "در حال بررسی" ? "bg-yellow-50 text-yellow-700" :
            order.status === "تکمیل شده" ? "bg-green-50 text-green-700" :
            "bg-red-50 text-red-700"
          }">
            وضعیت: ${order.status}
          </div>

          <button data-id="${order.id}" class="deleteBtn rounded-2xl bg-red-500 text-white py-3 font-bold hover:bg-red-600 transition">
            حذف سفارش
          </button>
        </div>
      </div>
    `;

    ordersContainer.appendChild(card);
  });

  // Attach delete button handlers after orders are rendered.
  document.querySelectorAll(".deleteBtn").forEach(button => {
    button.addEventListener("click", function () {
      const id = Number(this.dataset.id);
      let orders = getOrders();
      orders = orders.filter(order => order.id !== id);
      saveOrders(orders);
      renderOrders();
    });
  });

  // Attach status change handlers to update order status.
  document.querySelectorAll(".statusSelect").forEach(select => {
    select.addEventListener("change", function () {
      const id = Number(this.dataset.id);
      const orders = getOrders();
      const order = orders.find(item => item.id === id);
      if (order) {
        order.status = this.value;
        saveOrders(orders);
        renderOrders();
      }
    });
  });
}

// Clear all orders from localStorage when admin confirms.
if (clearAllBtn) {
  clearAllBtn.addEventListener("click", function () {
    const ok = confirm("آیا مطمئن هستید که می‌خواهید همه سفارش‌ها حذف شوند؟");
    if (ok) {
      localStorage.removeItem("bookOrders");
      renderOrders();
    }
  });
}

// Initialize the admin dashboard on page load.
checkLogin();