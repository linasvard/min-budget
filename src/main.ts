// @ts-nocheck 

import './style.scss'
import categories from './categories.json';
// ===========================
// DATALAGRING
// ===========================

// Array för att lagra alla transaktioner (inkomster och utgifter)
let transactions = [];

// ===========================
// VAL AV INMATNING
// ===========================

const incomeRadioBtn = document.querySelector('input[type="radio"].income');
const expenseRadioBtn = document.querySelector('input[type="radio"].expense');

incomeRadioBtn?.addEventListener('change', toggleIncomeOrExpense);
expenseRadioBtn?.addEventListener('change', toggleIncomeOrExpense);

function toggleIncomeOrExpense(e) {
  const selectedInput = e.target.value;

  if(selectedInput == 'income') {
    document.querySelector('#income')?.classList.remove('hidden');
    document.querySelector('#expense')?.classList.add('hidden');
  } else {
    document.querySelector('#income')?.classList.add('hidden');
    document.querySelector('#expense')?.classList.remove('hidden');
  }
}

// =================
// DROPDOWN
// =================

const catIncomeDropdown = document.querySelector('#incomeCategory');
if (catIncomeDropdown) {
  categories.income.forEach((category) => {
    catIncomeDropdown.innerHTML += `<option value="${category.value}">${category.text}</option>`
  });
}

const catExpenseDropdown = document.querySelector('#expenseCategory');
if (catExpenseDropdown) {
  categories.expenses.forEach((category) => {
    catExpenseDropdown.innerHTML += `<option value="${category.value}">${category.text}</option>`
  });
}

// ===========================
// LÄGG TILL INKOMST
// ===========================

const addIncomeBtn = document.querySelector('#addIncomeBtn');
addIncomeBtn?.addEventListener('click', addIncome);



function addIncome() {
  // Hämta värden från formuläret
  const category = document.querySelector('#incomeCategory').value;
  const description = document.querySelector('.incomedescription').value;
  const amount = document.querySelector('.incomenumber').value;

  // Validera att kategori och summa är ifyllda
  if (!category || !amount) {
    return; // Avbryt om något saknas
  }

  // Skapa transaktionsobjekt
  const transaction = {
    id: Date.now(),
    type: 'income',
    category: category,
    description: description,
    amount: parseFloat(amount.replace(/\s/g, ''))
  };

  // Lägg till i transaktionsarrayen
  transactions.push(transaction);

  // Rensa formuläret
  document.querySelector('#incomeCategory').value = '';
  document.querySelector('.incomedescription').value = '';
  document.querySelector('.incomenumber').value = '';

  // Uppdatera visningen
  renderTransactions();
}

// ===========================
// LÄGG TILL UTGIFT
// ===========================

const addExpenseBtn = document.querySelector('#addExpenseBtn');
addExpenseBtn?.addEventListener('click', addExpense);

function addExpense() {
  // Hämta värden från formuläret
  const category = document.querySelector('#expenseCategory').value;
  const description = document.querySelector('.expensedescription').value;
  const amount = document.querySelector('.expenseenumber').value;

  // Validera att kategori och summa är ifyllda
  if (!category || !amount) {
    return; // Avbryt om något saknas
  }

  // Skapa transaktionsobjekt
  const transaction = {
    id: Date.now(),
    type: 'expense',
    category: category,
    description: description,
    amount: parseFloat(amount.replace(/\s/g, ''))
  };

  // Lägg till i transaktionsarrayen
  transactions.push(transaction);

  // Rensa formuläret
  document.querySelector('#expenseCategory').value = '';
  document.querySelector('.expensedescription').value = '';
  document.querySelector('.expenseenumber').value = '';

  // Uppdatera visningen
  renderTransactions();
}

// ===========================
// RENDERA TRANSAKTIONSLISTA
// ===========================

function renderTransactions() {
  const listContainer = document.querySelector('#listOfIncomeAndExpenses');
  
  // Beräkna total balans
  const balance = transactions.reduce((total, transaction) => {
    if (transaction.type === 'income') {
      return total + transaction.amount;
    } else {
      return total - transaction.amount;
    }
  }, 0);

  // Skapa HTML för listan
  let html = `
    <div class="balanceSummary">
      <h2>Totalt: <span class="${balance >= 0 ? 'positive' : 'negative'}">${balance.toFixed(2)} kr</span></h2>
    </div>
    <div class="transactionsList">
  `;

  // Lägg till varje transaktion i listan
  transactions.forEach(transaction => {
    const typeClass = transaction.type === 'income' ? 'income-item' : 'expense-item';
    const sign = transaction.type === 'income' ? '+' : '-';
    
    html += `
      <div class="transactionItem ${typeClass}">
        <div class="transactionInfo">
          <span class="transactionCategory">${getCategoryName(transaction.category)}</span>
          <span class="transactionDescription">${transaction.description}</span>
        </div>
        <div class="transactionAmount">
          <span>${sign}${transaction.amount.toFixed(2)} SEK</span>
          <button class="deleteBtn" onclick="deleteTransaction(${transaction.id})">×</button>
        </div>
      </div>
    `;
  });

  html += '</div>';
  
  listContainer.innerHTML = html;
}

// ===========================
// TA BORT TRANSAKTION
// ===========================

window.deleteTransaction = function(id) {
  transactions = transactions.filter(t => t.id !== id);
  renderTransactions();
}

// ===========================
// HJÄLPFUNKTION
// ===========================

function getCategoryName(category) {
  const categories = {
    salary: 'Lön',
    grant: 'Bidrag',
    studentincome: 'Studiemedel',
    food: 'Mat & dagligvaror',
    transport: 'Transport',
    entertainment: 'Nöje och fritid',
    otherpersonal: 'Övrigt och personligt',
    other: 'Övrigt'
  };
  
  return categories[category] || category;
}

// Initialisera tom lista när sidan laddas
renderTransactions();



/*
// ===================================
// HANTERING AV INKOMSTER OCH UTGIFTER
// ===================================
let transactions = [];

const addIncomeBtn = document.querySelector('#addIncomeBtn');
const addExpenseBtn = document.querySelector('#addExpenseBtn');

// Eventlisteners

addExpenseBtn?.addEventListener('click', addIncome);
// addExpenseBtn?.addEventListener('click', addExpense);

function addIncome() {
  const incomeCategory = document.querySelector('#incomeCategory').value;
  const incomeDescription = document.querySelector('.incomedescription').value;
  const incomeAmount = parseFloat(document.querySelector('.incomenumber').value);
  
  
}
  */
 
