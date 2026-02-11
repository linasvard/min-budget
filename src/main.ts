// @ts-check 

import './style.scss'
import categories from './categories.json';

// =================
// FÖR HELA KODEN
// =================

declare global {
  interface Window { // utöka 
    deleteTransaction: (id: number) => void;
  }
}

// ================
// INTERFACES 
// ================

interface ITransaction {
  id: number;
  type: 'income' | 'expense';
  category: string;
  description: string;
  amount: number;
  date: string;
}


// ===========================
// DATALAGRING
// ===========================

// Array för att lagra alla transaktioner (inkomster och utgifter)
let transactions: ITransaction [] = [];

// ===========================
// VAL AV INMATNING
// ===========================

const incomeRadioBtn = document.querySelector('input[type="radio"].income') as HTMLInputElement;
const expenseRadioBtn = document.querySelector('input[type="radio"].expense') as HTMLInputElement;

incomeRadioBtn?.addEventListener('change', toggleIncomeOrExpense);
expenseRadioBtn?.addEventListener('change', toggleIncomeOrExpense);

function toggleIncomeOrExpense(e: Event) {
  const target = e.target as HTMLInputElement;
  const selectedInput = target.value;

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
    
    // Filtrera bort tranaktioner med null/undefined amount
    transactions = transactions.filter(t => t.amount != null && !isNaN(t.amount));

    // Migrera gamla transaktioner som saknar datum
    const today = new Date().toLocaleDateString('sv-SE');
    transactions = transactions.map(t => {
      if (!t.date) {
        return { ...t, date: today };
      }
      return t;
    });
    
    saveToLocalStorage(); // Spara den uppdaterade datan
  }
}


// ===========================
// LÄGG TILL INKOMST
// ===========================

const addIncomeBtn = document.querySelector('#addIncomeBtn');
addIncomeBtn?.addEventListener('click', addIncome);



function addIncome(): void {
  // Hämta värden från formuläret
  const category = (document.querySelector('#incomeCategory') as HTMLSelectElement).value;
  const description = (document.querySelector('.incomedescription') as HTMLInputElement).value;
  const amountInput = (document.querySelector('.incomenumber') as HTMLInputElement).value;
  
  // Rensa mellanslag och konvertera till nummer
  const amount = parseFloat(amountInput.replace(/\s/g, ''));

  // Validera att kategori och summa är ifyllda
  if (!category || !amount || isNaN(amount)) {

    return;
  }

  // Skapa transaktionsobjekt
  const transaction: ITransaction = {
    id: Date.now(),
    type: 'income',
    category: category,
    description: description,
    amount: amount,
    date: new Date().toLocaleDateString('sv-SE')
  };

  transactions.push(transaction);
  saveToLocalStorage();

  // Rensa formuläret
  (document.querySelector('#incomeCategory') as HTMLSelectElement).value = '';
  (document.querySelector('.incomedescription') as HTMLInputElement).value = '';
  (document.querySelector('.incomenumber') as HTMLInputElement).value = '';

  renderTransactions();
}


// LÄGG TILL MED ENTER-TANGENT

const incomeForm = document.querySelector('#incomeForm');
incomeForm?.addEventListener('keypress', function(e) {
  const event = e as KeyboardEvent;
  if (event.key === 'Enter') { // Enter
    e.preventDefault(); 
    addIncome();
  }
});

// ===========================
// LÄGG TILL UTGIFT
// ===========================

const addExpenseBtn = document.querySelector('#addExpenseBtn');
addExpenseBtn?.addEventListener('click', addExpense);

function addExpense(): void {
  // Hämta värden från formuläret
  const category = (document.querySelector('#expenseCategory') as HTMLSelectElement).value;
  const description = (document.querySelector('.expensedescription') as HTMLInputElement).value;
  const amount = (document.querySelector('.expensenumber') as HTMLInputElement).value;

  // Validera att kategori och summa är ifyllda
  if (!category || !amount) {
    return; // Avbryt om något saknas
  }

  // Skapa transaktionsobjekt
  const transaction: ITransaction = {
    id: Date.now(),
    type: 'expense',
    category: category,
    description: description,
    amount: parseFloat(amount.replace(/\s/g, '')),
    date: new Date().toLocaleDateString('sv-SE')
  };

  // Lägg till i transaktionsarrayen
  transactions.push(transaction);
  saveToLocalStorage();

  // Rensa formuläret
  (document.querySelector('#expenseCategory') as HTMLSelectElement).value = '';
  (document.querySelector('.expensedescription') as HTMLInputElement).value = '';
  (document.querySelector('.expensenumber') as HTMLInputElement).value = '';

  // Uppdatera visningen
  renderTransactions();
}

// LÄGG TILL MED ENTERTANGENTEN 

const expenseForm = document.querySelector('#expenseForm');
expenseForm?.addEventListener('keypress', function(e) {
  const event = e as KeyboardEvent;
  if (event.key === 'Enter') {
    e.preventDefault(); 
    addExpense();
  }
});

// ===========================
// RENDERA TRANSAKTIONSLISTA
// ===========================

function renderTransactions() {
  const listContainer = document.querySelector('#listOfIncomeAndExpenses');
  
  if (!listContainer) return;

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
    
    // Använd transaktionens datum om det finns, annars dagens datum
    const displayDate = transaction.date || new Date().toLocaleDateString('sv-SE');
    
    html += `
      <div class="transactionItem ${typeClass}">
        <div class="transactionInfo">
          <div>
            <span class="transactionCategory">${getCategoryName(transaction.category)}</span>
            <span class="transactionDescription">${transaction.description}</span>
          </div>
          <div>
            <span class="transactionDate">${displayDate}</span>
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

window.deleteTransaction = function(id: number): void {
  transactions = transactions.filter(t => t.id !== id);
  saveToLocalStorage();
  renderTransactions();
}



// ===========================
// HJÄLPFUNKTION
// ===========================

function getCategoryName(category: string): string {
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
  if (incomeRadioBtn) {
    incomeRadioBtn.checked = true;
  }
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
 
