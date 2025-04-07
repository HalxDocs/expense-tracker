// DOM Elements
const balanceEl = document.getElementById('balance');
const moneyPlusEl = document.getElementById('money-plus');
const moneyMinusEl = document.getElementById('money-minus');
const listEl = document.getElementById('transactions');
const formEl = document.querySelector('.form-control');
const textInputEl = document.getElementById('text');
const amountInputEl = document.getElementById('amount');
const addBtnEl = document.getElementById('add-btn');
const chartEl = document.getElementById('chart');

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// Initialize chart
let chart = new Chart(chartEl, {
    type: 'doughnut',
    data: {
        labels: ['Income', 'Expense'],
        datasets: [{
            data: [0, 0],
            backgroundColor: ['#2ecc71', '#e74c3c'],
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false
    }
});

// Add transaction
function addTransaction(e) {
    e.preventDefault();

    if (textInputEl.value.trim() === '' || amountInputEl.value.trim() === '') {
        alert('Please add a text and amount');
        return;
    }

    const transaction = {
        id: generateID(),
        text: textInputEl.value,
        amount: +amountInputEl.value
    };

    transactions.push(transaction);
    updateLocalStorage();
    updateDOM();
    updateChart();

    textInputEl.value = '';
    amountInputEl.value = '';
}

// Generate random ID
function generateID() {
    return Math.floor(Math.random() * 100000000);
}

// Update DOM
function updateDOM() {
    listEl.innerHTML = '';

    transactions.forEach(transaction => {
        const sign = transaction.amount < 0 ? '-' : '+';
        const item = document.createElement('li');
        item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

        item.innerHTML = `
            ${transaction.text} 
            <span>${sign}$${Math.abs(transaction.amount).toFixed(2)}</span>
            <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
        `;

        listEl.appendChild(item);
    });

    updateValues();
}

// Update balance, income, expense
function updateValues() {
    const amounts = transactions.map(transaction => transaction.amount);
    const total = amounts.reduce((acc, item) => acc + item, 0).toFixed(2);
    const income = amounts.filter(item => item > 0).reduce((acc, item) => acc + item, 0).toFixed(2);
    const expense = (amounts.filter(item => item < 0).reduce((acc, item) => acc + item, 0) * -1).toFixed(2);

    balanceEl.innerText = `$${total}`;
    moneyPlusEl.innerText = `+$${income}`;
    moneyMinusEl.innerText = `-$${expense}`;
}

// Update chart
function updateChart() {
    const income = transactions.filter(t => t.amount > 0).reduce((acc, t) => acc + t.amount, 0);
    const expense = transactions.filter(t => t.amount < 0).reduce((acc, t) => acc + t.amount, 0) * -1;

    chart.data.datasets[0].data = [income, expense];
    chart.update();
}

// Remove transaction
function removeTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);
    updateLocalStorage();
    updateDOM();
    updateChart();
}

// Update localStorage
function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Event listeners
addBtnEl.addEventListener('click', addTransaction);

// Init app
updateDOM();
updateChart();