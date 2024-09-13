let users = [];
let expenses = [];
let balances = {};
let pairwiseBalances = {};


function addUser() {

    const userName = document.getElementById('user_name').value;
    
    if(userName && !users.includes(userName)) {
        users.push(userName);
        balances[userName] = 0;
        pairwiseBalances[userName] = {};

        // --------------------------------------------------------------------------------------------------------------------------------------------------start
        // Set up pairwise balances for all users
        users.forEach(user => {
            if (!pairwiseBalances[userName][user]) {
                pairwiseBalances[userName][user] = 0;
            }
            if (!pairwiseBalances[user][userName]) {
                pairwiseBalances[user][userName] = 0;
            }
        });
        // --------------------------------------------------------------------------------------------------------------------------------------------------end

        document.getElementById('user_name').value="";
        printUsers();
    } else {
        alert("User name is empty or already exists");
    }

}

function printUsers(){
    const userSection = document.getElementById('total_users');

    userSection.innerHTML = '<h2>Total users</h2>';

    for (let i = 0; i < users.length; i++) {
        const userElement = document.createElement('p'); // Create a <p> element
        userElement.textContent = users[i]; // Set its text content to the current user's name
        userSection.appendChild(userElement); // Append it to the section in the HTML
    }
}

function addExpense() {
    const amount = Number(document.getElementById('amount').value);
    const payer = document.getElementById('payer').value;
    const usersInvolved = document.getElementById('selected_participants').value.split(',').map(user => user.trim());

    if (isValidExpense(amount, payer, usersInvolved)) {
        expenses.push({ amount, payer, usersInvolved });

        // Update balances and pairwise balances
        updateBalances(amount, payer, usersInvolved);

        document.getElementById('amount').value = "";
        document.getElementById('payer').value = "";
        document.getElementById('selected_participants').value = "";

        printExpenses();
        printDetailedBalances(); // Display detailed pairwise balances
    } else {
        alert('Expense is invalid');
    }
}

function isValidExpense(amount, payer, usersInvolved) {
    if(!amount || amount <= 0) {
        alert('Amount is invalid');
        return false;
    } else if(!users.includes(payer)) {
        alert('Payer is not a valid user');
        return false;
    } else if(usersInvolved.length === 0) {
        alert('Users involved are empty');
        return false;
    } else {
        for (let i = 0; i < usersInvolved.length; i++) {
            if(!users.includes(usersInvolved[i])) {
                alert('User involved is not a valid user');
                return false;
            }
        }
    } return true;
}

function printExpenses() {
    const expensesSection = document.getElementById('exp_history');
    expensesSection.innerHTML = '<h2>Expenses</h2>';

    expenses.forEach((expense, index) => {
        const expenseElement = document.createElement('li');
        expenseElement.textContent = `${expense.payer} paid $${expense.amount.toFixed(2)} for ${expense.usersInvolved.join(', ')}`;
        expensesSection.appendChild(expenseElement);
    });
}
// --------------------------------------------------------------------------------------------------------------------------------------------------start
// Function to update both balances and pairwise balances based on the expense
function updateBalances(amount, payer, usersInvolved) {
    const share = amount / usersInvolved.length;

    // Update total balances
    balances[payer] += amount;
    
    // Each participant owes their share to the payer
    usersInvolved.forEach(user => {
        if (user !== payer) {
            balances[user] -= share; // Reduce the participant's balance

            // Update pairwise balances
            pairwiseBalances[user][payer] += share;
            pairwiseBalances[payer][user] -= share;
        }
    });
}


// Function to print detailed pairwise balances (who owes whom)
function printDetailedBalances() {
    const balanceSection = document.getElementById('balance_sheet');
    balanceSection.innerHTML = '';

    // Iterate through each user's pairwise balances
    users.forEach(user => {
        Object.keys(pairwiseBalances[user]).forEach(otherUser => {
            const balance = pairwiseBalances[user][otherUser];
            if (balance > 0) {
                const balanceElement = document.createElement('li');
                balanceElement.textContent = `${user} owes ${otherUser} $${balance.toFixed(2)}`;
                balanceSection.appendChild(balanceElement);
            }
        });
    });
}
// --------------------------------------------------------------------------------------------------------------------------------------------------end
// Attach event listener to the modal to call showParticipants when it's shown
const participantModal = document.getElementById('participantModal');
participantModal.addEventListener('shown.bs.modal', function () {
    showParticipants();
});

// Function to show the participants list with checkboxes inside the modal
function showParticipants() {
    const participantCheckboxes = document.getElementById('participant_checkboxes');
    participantCheckboxes.innerHTML = ''; // Clear any previous list

    // Create checkboxes for each user
    users.forEach(user => {
        const checkboxItem = document.createElement('li');
        checkboxItem.innerHTML = `<input type="checkbox" value="${user}" id="checkbox_${user}"> ${user}`;
        participantCheckboxes.appendChild(checkboxItem);
    });
}

// Function to confirm selected participants
function confirmParticipants() {
    const selected = [];
    users.forEach(user => {
        const checkbox = document.getElementById(`checkbox_${user}`);
        if (checkbox && checkbox.checked) {
            selected.push(user);
        }
    });
    
    document.getElementById('selected_participants').value = selected.join(', ');
}


// let users = [];
// let expenses = [];
// let balances = {}; // To track total balance
// let pairwiseBalances = {}; // To track who owes whom

// function addUser() {
//     const userName = document.getElementById('user_name').value;
    
//     if(userName && !users.includes(userName)) {
//         users.push(userName);
//         balances[userName] = 0;
//         pairwiseBalances[userName] = {}; // Initialize pairwise balances for the new user

//         // Set up pairwise balances for all users
//         users.forEach(user => {
//             if (!pairwiseBalances[userName][user]) {
//                 pairwiseBalances[userName][user] = 0;
//             }
//             if (!pairwiseBalances[user][userName]) {
//                 pairwiseBalances[user][userName] = 0;
//             }
//         });

//         document.getElementById('user_name').value = "";
//         printUsers();
//     } else {
//         alert("User name is empty or already exists");
//     }
// }

// function printUsers() {
//     const userSection = document.getElementById('total_users');
//     userSection.innerHTML = '<h2>Total users</h2>';

//     for (let i = 0; i < users.length; i++) {
//         const userElement = document.createElement('p');
//         userElement.textContent = users[i];
//         userSection.appendChild(userElement);
//     }
// }

// function addExpense() {
//     const amount = Number(document.getElementById('amount').value);
//     const payer = document.getElementById('payer').value;
//     const usersInvolved = document.getElementById('participant').value.split(',').map(user => user.trim());

//     if (isValidExpense(amount, payer, usersInvolved)) {
//         expenses.push({ amount, payer, usersInvolved });

//         // Update balances and pairwise balances
//         updateBalances(amount, payer, usersInvolved);

//         document.getElementById('amount').value = "";
//         document.getElementById('payer').value = "";
//         document.getElementById('participant').value = "";

//         printExpenses();
//         printDetailedBalances(); // Display detailed pairwise balances
//     } else {
//         alert('Expense is invalid');
//     }
// }

// function isValidExpense(amount, payer, usersInvolved) {
//     if (!amount || amount <= 0) {
//         alert('Amount is invalid');
//         return false;
//     } else if (!users.includes(payer)) {
//         alert('Payer is not a valid user');
//         return false;
//     } else if (usersInvolved.length === 0) {
//         alert('Users involved are empty');
//         return false;
//     } else {
//         for (let i = 0; i < usersInvolved.length; i++) {
//             if (!users.includes(usersInvolved[i])) {
//                 alert(`User involved is not a valid user: ${usersInvolved[i]}`);
//                 return false;
//             }
//         }
//     }
//     return true;
// }

// // Function to update both balances and pairwise balances based on the expense
// function updateBalances(amount, payer, usersInvolved) {
//     const share = amount / usersInvolved.length;

//     // Update total balances
//     balances[payer] += amount;
    
//     // Each participant owes their share to the payer
//     usersInvolved.forEach(user => {
//         if (user !== payer) {
//             balances[user] -= share; // Reduce the participant's balance

//             // Update pairwise balances
//             pairwiseBalances[user][payer] += share;
//             pairwiseBalances[payer][user] -= share;
//         }
//     });
// }

// // Function to print expenses
// function printExpenses() {
//     const expensesSection = document.getElementById('exp_history');
//     expensesSection.innerHTML = '<h2>Expenses</h2>';

//     expenses.forEach((expense, index) => {
//         const expenseElement = document.createElement('li');
//         expenseElement.textContent = `${expense.payer} paid $${expense.amount.toFixed(2)} for ${expense.usersInvolved.join(', ')}`;
//         expensesSection.appendChild(expenseElement);
//     });
// }

// // Function to print detailed pairwise balances (who owes whom)
// function printDetailedBalances() {
//     const balanceSection = document.getElementById('balance_sheet');
//     balanceSection.innerHTML = '<h2>Balance (Who owes whom)</h2>';

//     // Iterate through each user's pairwise balances
//     users.forEach(user => {
//         Object.keys(pairwiseBalances[user]).forEach(otherUser => {
//             const balance = pairwiseBalances[user][otherUser];
//             if (balance > 0) {
//                 const balanceElement = document.createElement('li');
//                 balanceElement.textContent = `${user} owes ${otherUser} $${balance.toFixed(2)}`;
//                 balanceSection.appendChild(balanceElement);
//             }
//         });
//     });
// }
