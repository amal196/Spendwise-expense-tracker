const balanceElement = document.querySelector("#balance");

const incomeElement = document.querySelector("#incomeAmount");

const expenseElement = document.querySelector("#expenseAmount");


const transactionList = document.querySelector("#transactionList");

const allBtn =
document.querySelector("#allBtn");

const incomeBtn =
document.querySelector("#incomeBtn");

const expenseBtn =
document.querySelector("#expenseBtn");

const filterButtons = [allBtn, incomeBtn, expenseBtn];

const searchInput =
document.querySelector("#searchInput");



const form = document.querySelector("form");

const titleInput = document.querySelector("#title");

const amountInput = document.querySelector("#amount");

const typeInput = document.querySelector("#type");

const categoryInput = document.querySelector("#category");

const messageBox = document.querySelector("#messageBox");

const budgetInput =
document.querySelector("#budgetInput");

const setBudgetBtn =
document.querySelector("#setBudgetBtn");

const budgetStatus =
document.querySelector("#budgetStatus");

const progressBar =
document.querySelector("#progressBar");

const budgetUsedPercentElement =
document.querySelector("#budgetUsedPercent");

const budgetSpentElement =
document.querySelector("#budgetSpent");

const budgetRemainingElement =
document.querySelector("#budgetRemaining");

const budgetTotalDisplay =
document.querySelector("#budgetTotalDisplay");

const totalTransactionsElement =
document.querySelector("#totalTransactions");

const topCategoryElement =
document.querySelector("#topCategory");

const averageExpenseElement =
document.querySelector("#averageExpense");

const expenseChart =
document.querySelector("#expenseChart");

const exportBtn =
document.querySelector("#exportBtn");

const themeToggle =
document.querySelector("#themeToggle");

const insightsContainer =
document.querySelector("#insightsContainer");

const chartLegend =
document.querySelector("#chartLegend");

const chartPalette =
["#22c55e", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#14b8a6"];

let transactions = [];

let currentTheme =
localStorage.getItem("theme") || "dark";

let chart;

let currentFilter = "all";

let searchTerm = "";

let budget = 0;

function formatCurrency(amount) {
    return amount.toLocaleString("en-IN");
}

function updateSummary() {

    const income = transactions
        .filter(transaction => transaction.type === "income")
        .reduce((total, transaction) => total + transaction.amount, 0);

    const expense = transactions
        .filter(transaction => transaction.type === "expense")
        .reduce((total, transaction) => total + transaction.amount, 0);

    const balance = income - expense;

   incomeElement.textContent =
`₹${formatCurrency(income)}`;

expenseElement.textContent =
`₹${formatCurrency(expense)}`;

balanceElement.textContent =
`₹${formatCurrency(balance)}`;
}

function updateMessage() {

    const hasIncome = transactions.some(
        transaction => transaction.type === "income"
    );

    if (hasIncome) {
        messageBox.textContent =
        "✅ Income added. You can track expenses.";
    } else {
        messageBox.textContent =
        "💡 Add your income first for accurate balance tracking.";
    }

}



function saveTransactions() {

    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );

}


function saveBudget() {

    localStorage.setItem(
        "budget",
        budget
    );

}


function loadTransactions() {

    const savedTransactions =
        localStorage.getItem("transactions");

    if (savedTransactions) {

        transactions = JSON.parse(savedTransactions);

    }

    transactions.forEach(transaction => {

    if (!transaction.date) {

        transaction.date =
        "Old Transaction";

    }

});

}


function applyTheme(theme) {

    if (theme === "dark") {

        document.body.classList.add("dark-mode");

        themeToggle.textContent =
        "☀️ Light Mode";

    } else {

        document.body.classList.remove("dark-mode");

        themeToggle.textContent =
        "🌙 Dark Mode";
    }

}



function loadBudget() {

    const savedBudget =
    localStorage.getItem("budget");

    if (savedBudget) {

        budget = Number(savedBudget);

        budgetInput.value = budget;

    }

}


function updateBudgetStatus() {

    if (budget === 0) {

        budgetStatus.textContent =
        "No budget set.";

        budgetUsedPercentElement.textContent = "–";
        budgetSpentElement.textContent = "₹0";
        budgetRemainingElement.textContent = "₹0";
        budgetTotalDisplay.textContent = "";
        progressBar.style.width = "0%";

        return;
    }

    const totalExpense =
    transactions
        .filter(
            transaction =>
            transaction.type === "expense"
        )
        .reduce(
            (total, transaction) =>
            total + transaction.amount,
            0
        );

    const percentage =
    (totalExpense / budget) * 100;

    progressBar.style.width =
`${Math.min(percentage, 100)}%`;

    budgetUsedPercentElement.textContent =
    `${Math.min(percentage, 100).toFixed(0)}%`;

    budgetSpentElement.textContent =
    `₹${formatCurrency(totalExpense)}`;

    budgetRemainingElement.textContent =
    `₹${formatCurrency(Math.max(budget - totalExpense, 0))}`;

    budgetTotalDisplay.textContent =
    `₹${formatCurrency(budget)} / mo`;

    if (percentage >= 100) {

        budgetStatus.textContent =
        "🚨 Budget exceeded!";

        budgetStatus.style.color ="#ff4d4f";
        progressBar.style.background ="#ff4d4f";

    }

    else if (percentage >= 80) {

        budgetStatus.textContent =
        "⚠️ Budget usage above 80%";

         budgetStatus.style.color ="#faad14";
          progressBar.style.background ="#faad14";

    }

    else {

        budgetStatus.textContent =
        `Budget used: ${percentage.toFixed(0)}%`;

        budgetStatus.style.color = "#52c41a";
        progressBar.style.background ="#52c41a";

    }

}



function updateAnalytics() {

    totalTransactionsElement.textContent =
transactions.length;

    const expenseTransactions =
    transactions.filter(
        transaction =>
        transaction.type === "expense"
    );

    if (expenseTransactions.length === 0) {

       topCategoryElement.textContent ="-";

        averageExpenseElement.textContent ="₹0";

        return;
    }

    const categoryTotals = {};

    expenseTransactions.forEach(
        transaction => {

            if (!categoryTotals[
                transaction.category
            ]) {

                categoryTotals[
                    transaction.category
                ] = 0;

            }

            categoryTotals[
                transaction.category
            ] += transaction.amount;

        }
    );

    let topCategory = "";

    let highestAmount = 0;

    for (
        let category
        in categoryTotals
    ) {

        if (
            categoryTotals[category]
            > highestAmount
        ) {

            highestAmount =
            categoryTotals[category];

            topCategory =
            category;

        }

    }

    const totalExpense =
    expenseTransactions.reduce(
        (total, transaction) =>
        total + transaction.amount,
        0
    );

    const averageExpense =
    totalExpense /
    expenseTransactions.length;

   topCategoryElement.textContent =
topCategory;

    averageExpenseElement.textContent =
`₹${formatCurrency(
    Math.round(averageExpense)
    )}`;

}



function updateInsights() {

    const expenses =
    transactions.filter(
        transaction =>
        transaction.type === "expense"
    );

    const income =
    transactions
    .filter(
        transaction =>
        transaction.type === "income"
    )
    .reduce(
        (total, transaction) =>
        total + transaction.amount,
        0
    );

    const totalExpense =
    expenses.reduce(
        (total, transaction) =>
        total + transaction.amount,
        0
    );

    const savings =
    income - totalExpense;

    if (expenses.length === 0) {

        insightsContainer.innerHTML = `
            <p>
                Add some expenses to
                generate insights.
            </p>
        `;

        return;
    }

    const highestExpense =
    expenses.reduce(
        (max, transaction) =>
        transaction.amount >
        max.amount
            ? transaction
            : max
    );

    const lowestExpense =
    expenses.reduce(
        (min, transaction) =>
        transaction.amount <
        min.amount
            ? transaction
            : min
    );

    const categoryCount = {};

    expenses.forEach(
        transaction => {

            if (
                !categoryCount[
                    transaction.category
                ]
            ) {

                categoryCount[
                    transaction.category
                ] = 0;

            }

            categoryCount[
                transaction.category
            ]++;

        }
    );

    let mostUsedCategory =
    "";

    let highestCount = 0;

    for (
        let category
        in categoryCount
    ) {

        if (
            categoryCount[
                category
            ] > highestCount
        ) {

            highestCount =
            categoryCount[
                category
            ];

            mostUsedCategory =
            category;

        }

    }

    let budgetHealth =
    "⚠️ Watch Spending";

    if (savings > 10000) {

        budgetHealth =
        "✅ Healthy";

    }

    insightsContainer.innerHTML = `

        <div class="insight-card">
            <strong>🔥 Biggest Expense</strong>
            ${highestExpense.title}
            - ₹${formatCurrency(
                highestExpense.amount
            )}
        </div>

        <div class="insight-card">
            <strong>🧊 Smallest Expense</strong>
            ${lowestExpense.title}
            - ₹${formatCurrency(
                lowestExpense.amount
            )}
        </div>

        <div class="insight-card">
            <strong>🏆 Most Used Category</strong>
            ${mostUsedCategory}
        </div>

        <div class="insight-card">
            <strong>💰 Savings</strong>
            ₹${formatCurrency(
                savings
            )}
        </div>

        <div class="insight-card">
            <strong>${budgetHealth}</strong>
        </div>

    `;
}



function updateChart() {

    const categoryTotals = {};

    transactions.forEach(transaction => {

        if (transaction.type === "expense") {

            if (!categoryTotals[transaction.category]) {

                categoryTotals[
                    transaction.category
                ] = 0;

            }

            categoryTotals[
                transaction.category
            ] += transaction.amount;

        }

    });

    const labels =
    Object.keys(categoryTotals);

    const values =
    Object.values(categoryTotals);

    const colors =
    labels.map(
        (_, index) =>
        chartPalette[index % chartPalette.length]
    );

    chartLegend.innerHTML = "";

labels.forEach((label, index) => {

    chartLegend.innerHTML += `
        <div class="legend-item">
            <span class="legend-label">
                <span class="legend-dot" style="background:${colors[index]}"></span>
                ${label}
            </span>
            <span>
                ₹${formatCurrency(values[index])}
            </span>
        </div>
    `;

});

    if (chart) {

        chart.destroy();

    }

    chart = new Chart(
    expenseChart,
    {

        type: "doughnut",

        data: {

            labels: labels,

            datasets: [
                {
                    data: values,
                    backgroundColor: colors,
                    borderWidth: 0,
                    hoverOffset: 6
                }
            ]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            cutout: "62%",

            plugins: {

                legend: {

                    display: false

                }

            }

        }

    }
);
}


function exportCSV() {

    let csv =
    "Title,Amount,Type,Category,Date\n";

    transactions.forEach(
        transaction => {

            csv +=
            `${transaction.title},
${transaction.amount},
${transaction.type},
${transaction.category},
${transaction.date}\n`;

        }
    );

    const blob =
    new Blob(
        [csv],
        { type: "text/csv" }
    );

    const url =
    URL.createObjectURL(blob);

    const link =
    document.createElement("a");

    link.href = url;

    link.download =
    "expense-report.csv";

    link.click();

}


function setActiveFilterButton(activeBtn) {

    filterButtons.forEach(
        function(btn) {
            btn.classList.remove("active");
        }
    );

    activeBtn.classList.add("active");

}


allBtn.addEventListener("click", function() {

    currentFilter = "all";

    setActiveFilterButton(allBtn);

    renderTransactions();

});

incomeBtn.addEventListener("click", function() {

    currentFilter = "income";

    setActiveFilterButton(incomeBtn);

    renderTransactions();

});

expenseBtn.addEventListener("click", function() {

    currentFilter = "expense";

    setActiveFilterButton(expenseBtn);

    renderTransactions();

});



themeToggle.addEventListener("click", function() {

    if (
        document.body.classList.contains("dark-mode")
    ) {

        currentTheme = "light";

    } else {

        currentTheme = "dark";

    }

    localStorage.setItem(
        "theme",
        currentTheme
    );

    applyTheme(currentTheme);

    updateChart();

});

exportBtn.addEventListener(
    "click",
    exportCSV
);



searchInput.addEventListener(
    "input",
    function() {

        searchTerm =
        searchInput.value.toLowerCase();

        renderTransactions();

    }
);






form.addEventListener("submit", function(event) {

    event.preventDefault();

    const title = titleInput.value;

    const amount = amountInput.value;

    const type = typeInput.value;

    if (title.trim() === "" || amount <= 0) {
    alert("Please enter valid details");
    return;
}

    const category = categoryInput.value;

    const transaction = {
    id: Date.now(),
    title: title,
    amount: Number(amount),
    type: type,
    category: category,
     date: new Date().toLocaleString("en-GB")

    };

transactions.push(transaction);

renderTransactions();
updateSummary();
saveTransactions();
updateMessage();
updateBudgetStatus();
updateAnalytics();
updateChart();
updateInsights();


titleInput.value = "";

amountInput.value = "";

typeInput.value = "income";

categoryInput.value = "Food";



});

setBudgetBtn.addEventListener(
    "click",
    function() {

        budget =
        Number(budgetInput.value);

        saveBudget();

        updateBudgetStatus();

    }
);


function renderTransactions() {

    transactionList.innerHTML = "";

let filteredTransactions =
    transactions;



    if (currentFilter === "income") {

        filteredTransactions =
        transactions.filter(
            transaction =>
            transaction.type === "income"
        );

    }

    else if (currentFilter === "expense") {

        filteredTransactions =
        transactions.filter(
            transaction =>
            transaction.type === "expense"
        );

    }



    filteredTransactions =
filteredTransactions.filter(
    transaction =>

        transaction.title
            .toLowerCase()
            .includes(searchTerm)

        ||

        transaction.category
            .toLowerCase()
            .includes(searchTerm)
);


    if (filteredTransactions.length === 0) {

        transactionList.innerHTML = `
            <p class="empty-state">
                No transactions found.
            </p>
        `;

        return;
    }

    filteredTransactions.forEach(function(transaction) {


        const li = document.createElement("li");

       li.classList.add(transaction.type);

li.innerHTML = `
    <div>

        <strong>
            [${transaction.category}]
            ${transaction.title}
        </strong>

        <br>

        ${transaction.type === "income" ? "+" : "-"}
        ₹${formatCurrency(transaction.amount)}

        <br>

        <small>
            ${transaction.date}
        </small>

    </div>

    <button onclick="deleteTransaction(${transaction.id})">
        Delete
    </button>
`;
    

        transactionList.appendChild(li);

    });

}

function deleteTransaction(id) {

    transactions = transactions.filter(function(transaction) {

        return transaction.id !== id;

    });

    renderTransactions();

    updateSummary();

    saveTransactions();

    updateMessage();

    updateBudgetStatus();

    updateAnalytics();

    updateChart();

    updateInsights();

}

loadTransactions();

renderTransactions();

updateSummary();


updateMessage();

loadBudget();

updateBudgetStatus();

updateAnalytics();

updateChart();

applyTheme(currentTheme);

updateInsights();