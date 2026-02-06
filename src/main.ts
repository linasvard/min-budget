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

// ==========================
// LOCAL STORAGE FUNKTIONER
// ==========================

function saveToLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

function loadFromLocalStorage() {
  const savedTransactions = localStorage.getItem('transactions');
  if (savedTransactions) {
    transactions = JSON.parse(savedTransactions);
  }
  
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
  const amountInput = document.querySelector('.incomenumber').value;
  
  // Rensa mellanslag och konvertera till nummer
  const amount = parseFloat(amountInput.replace(/\s/g, ''));

  // Validera att kategori och summa är ifyllda
  if (!category || !amount || isNaN(amount)) {

    return;
  }

  // Skapa transaktionsobjekt
  const transaction = {
    id: Date.now(),
    type: 'income',
    category: category,
    description: description,
    amount: amount
  };

  transactions.push(transaction);
  saveToLocalStorage();

  // Rensa formuläret
  document.querySelector('#incomeCategory').value = '';
  document.querySelector('.incomedescription').value = '';
  document.querySelector('.incomenumber').value = '';

  renderTransactions();
}


// LÄGG TILL MED ENTER-TANGENT

const incomeForm = document.querySelector('#incomeForm');
incomeForm?.addEventListener('keypress', function(e) {
  if (e.key === 'Enter') { // Enter
    e.preventDefault(); 
    addIncome();
  }
});

// ===========================
// LÄGG TILL UTGIFT
// ===========================

const addExpenseBtn = document.querySelector('#addExpenseBtn');
addExpenseBtn?.addEventListener('click', addExpense);

function addExpense() {
  // Hämta värden från formuläret
  const category = document.querySelector('#expenseCategory').value;
  const description = document.querySelector('.expensedescription').value;
  const amount = document.querySelector('.expensenumber').value;

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
  saveToLocalStorage();

  // Rensa formuläret
  document.querySelector('#expenseCategory').value = '';
  document.querySelector('.expensedescription').value = '';
  document.querySelector('.expensenumber').value = '';

  // Uppdatera visningen
  renderTransactions();
}

// LÄGG TILL MED ENTERTANGENTEN 

const expenseForm = document.querySelector('#expenseForm');
expenseForm?.addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    e.preventDefault(); 
    addExpense();
  }
});

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
  const today = new Date().toLocaleDateString('sv-SE');
  transactions.forEach(transaction => {
    const typeClass = transaction.type === 'income' ? 'income-item' : 'expense-item';
    const sign = transaction.type === 'income' ? '+' : '-';
    
    html += `
      <div class="transactionItem ${typeClass}">
        <div class="transactionInfo">
          <div>
            <span class="transactionCategory">${getCategoryName(transaction.category)}</span>
            <span class="transactionDescription">${transaction.description}</span>
          </div>
          <div>
            <span class="transactionDate">${today}</span>
          </div>  
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
  saveToLocalStorage();
  renderTransactions();
}

// ===========================
// HJÄLPFUNKTION
// ===========================

function getCategoryName(category) {
  // Slå ihop alla kategorier till en lookup-tabell
  const allCategories = [
    ...categories.income,
    ...categories.expenses
  ];
  
  // Hitta kategorin som matchar
  const found = allCategories.find(cat => cat.value === category);
  
  // Returnera texten om den hittas, annars returnera originalvärdet
  return found ? found.text : category;
}

// Återställ till inkomst vid sidladdning
document.addEventListener('DOMContentLoaded', function() {
  incomeRadioBtn.checked = true;
  document.querySelector('#income')?.classList.remove('hidden');
  document.querySelector('#expense')?.classList.add('hidden');

  loadFromLocalStorage();
  renderTransactions();
});

// Initialisera tom lista när sidan laddas


// renderTransactions();

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
 
