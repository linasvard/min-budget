// @ts-nocheck 


import './style.scss'

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
