// Order form handling script
// This file manages book selection, price calculation, and order storage.

const orderForm = document.getElementById("orderForm");
const bookName = document.getElementById("bookName");
const quantity = document.getElementById("quantity");
const totalPrice = document.getElementById("totalPrice");
const successMessage = document.getElementById("successMessage");
const selectButtons = document.querySelectorAll(".select-book");

// Get the price for a book based on its title.
function getBookPrice(book) {
  const prices = {
    "کاش به عروسی پدر و مادرم نمی‌رفتم": 195000,
    "کاش به عروسی پدر و مادرم می‌رفتم!": 195000,
    "کاش عروسی پدر و مادرم به پایان می‌رسید...": 295000,
    "اولین جملات یک شادروان": 245000
  };
  return prices[book] || 0;
}

// Update the total order amount when the book or quantity changes.
function updateTotal() {
  const selectedBook = bookName.value;
  const qty = parseInt(quantity.value) || 1;
  const price = getBookPrice(selectedBook);
  const total = price * qty;
  totalPrice.textContent = total.toLocaleString("fa-IR");
}

// Recalculate total when the selected book changes.
bookName.addEventListener("change", updateTotal);

// Recalculate total when the quantity input is modified.
quantity.addEventListener("input", updateTotal);

// Populate the order form with the selected book from the book list.
selectButtons.forEach(button => {
  button.addEventListener("click", () => {
    const selectedBook = button.dataset.book;
    bookName.value = selectedBook;
    updateTotal();
    document.getElementById("order").scrollIntoView({ behavior: "smooth" });
  });
});

// Handle order form submission and save the order in localStorage.
orderForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("customerName").value.trim();
  const phone = document.getElementById("customerPhone").value.trim();
  const book = bookName.value;
  const qty = parseInt(quantity.value) || 1;
  const description = document.getElementById("description").value.trim();
  const total = getBookPrice(book) * qty;

  const newOrder = {
    id: Date.now(),
    name,
    phone,
    book,
    quantity: qty,
    description,
    total,
    status: "جدید",
    date: new Date().toLocaleString("fa-IR")
  };

  let orders = JSON.parse(localStorage.getItem("bookOrders")) || [];
  orders.push(newOrder);
  localStorage.setItem("bookOrders", JSON.stringify(orders));

  // Reset form and show confirmation message.
  orderForm.reset();
  totalPrice.textContent = "0";
  successMessage.classList.remove("hidden");

  setTimeout(() => {
    successMessage.classList.add("hidden");
  }, 3000);
});