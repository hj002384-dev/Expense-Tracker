// DOM Elements ko select karna (HTML se connect karna)
const balance = document.getElementById('balance');
const moneyPlus = document.getElementById('money-plus');
const moneyMinus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');

// LocalStorage se purani transactions nikalna (agar mojood hain)
const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));

let transactions = localStorageTransactions !== null ? localStorageTransactions : [];

// Transaction Add karne ka function
function addTransaction(e) {
  e.preventDefault(); // Form ko refresh hone se rokna

  if (text.value.trim() === '' || amount.value.trim() === '') {
    alert('Please add a text and amount');
    return;
  }

  const transaction = {
    id: generateID(),
    text: text.value,
    amount: +amount.value // Plus sign string ko number mein convert karta hai
  };

  transactions.push(transaction);

  addTransactionDOM(transaction);
  updateValues();
  updateLocalStorage();

  // Input fields ko khali karna
  text.value = '';
  amount.value = '';
}

// Random ID generate karne ka function
function generateID() {
  return Math.floor(Math.random() * 100000000);
}

// DOM mein transaction list item add karna
function addTransactionDOM(transaction) {
  // Sign check karna (Income hai ya Expense)
  const sign = transaction.amount < 0 ? '-' : '+';
  const item = document.createElement('li');

  // Class assign karna CSS styling ke liye
  item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

  item.innerHTML = `
    ${transaction.text} <span>${sign}Rs. ${Math.abs(transaction.amount)}</span>
    <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
  `;

  list.appendChild(item);
}

// Balance, Income, aur Expense ko update karna
function updateValues() {
  const amounts = transactions.map(transaction => transaction.amount);

  // Total Balance
  const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);

  // Total Income (Positive numbers)
  const income = amounts
    .filter(item => item > 0)
    .reduce((acc, item) => (acc += item), 0)
    .toFixed(2);

  // Total Expense (Negative numbers)
  const expense = (
    amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1
  ).toFixed(2);

  balance.innerText = `Rs. ${total}`;
  moneyPlus.innerText = `+Rs. ${income}`;
  moneyMinus.innerText = `-Rs. ${expense}`;
}

// ID ke zariye transaction delete karna
function removeTransaction(id) {
  transactions = transactions.filter(transaction => transaction.id !== id);
  updateLocalStorage();
  init();
}

// LocalStorage mein data save karna
function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

// App ko start karne ka function
function init() {
  list.innerHTML = '';
  transactions.forEach(addTransactionDOM);
  updateValues();
}

init();

// Form submit hone par function chalana
form.addEventListener('submit', addTransaction);