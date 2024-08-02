'use strict';

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////

//Display Movements
const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = ``;

  const sortMovements = sort
    ? movements.slice().sort((a, b) => a - b)
    : movements;

  sortMovements.forEach(function (movement, index) {
    const movementType = movement > 0 ? `deposit` : 'withdrawal';

    const movementHTML = `
    <div class="movements__row">
      <div class="movements__type movements__type--${movementType}">${
      index + 1
    } ${movementType}</div>
      <div class="movements__value">${movement}</div>
    </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', movementHTML);
  });
};

//Create UserNames
const createUserNames = function (accounts) {
  accounts.forEach(function (account) {
    account.UserName = account.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

createUserNames(accounts);

//Calculate and Print Balance
const calcBalanceDisplay = function (account) {
  account.balance = account.movements.reduce(
    (accumulator, currenct) => accumulator + currenct,
    0
  );
  labelBalance.textContent = `${account.balance} ₹`;
};

//Calculate Summary
const calcSummaryDisplay = function (account) {
  const income = account.movements
    .filter(movement => movement > 0)
    .reduce((accumulator, currentMovement) => accumulator + currentMovement, 0);
  labelSumIn.textContent = `${income}₹`;

  const expense = account.movements
    .filter(movement => movement < 0)
    .reduce((accumulator, currentMovement) => accumulator + currentMovement, 0);
  labelSumOut.textContent = `${Math.abs(expense)}₹`;

  const interest = account.movements
    .filter(movement => movement > 0)
    .map(deposit => (deposit * account.interestRate) / 100)
    .filter(interest => interest > 1)
    .reduce((accumulator, currentInterest) => accumulator + currentInterest, 0);
  labelSumInterest.textContent = `${interest}₹`;
};

const updateUI = function (currentAccount) {
  //display movements
  displayMovements(currentAccount.movements);

  //display balance
  calcBalanceDisplay(currentAccount);

  //display summary
  calcSummaryDisplay(currentAccount);
};

//Login
let currentAccount;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.UserName === inputLoginUsername.value
  );
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    console.log('Login Success!');
    console.log(currentAccount);
    //dipslay welcome message
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner}!`;
    containerApp.style.opacity = 100;

    //clear input fields
    inputLoginUsername.value = inputLoginPin.value = ``;
    inputLoginPin.blur();

    //Update UI
    updateUI(currentAccount);
  }
});

//Transfer amount
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const transferAmount = Number(inputTransferAmount.value);
  const receiverAccount = accounts.find(
    account => account.UserName === inputTransferTo.value
  );
  console.log(`Transfer amount ${transferAmount} to ${receiverAccount.owner}`);

  if (
    transferAmount > 0 &&
    transferAmount <= currentAccount.balance &&
    receiverAccount &&
    receiverAccount.UserName !== currentAccount.username
  ) {
    console.log(`Valid Transfer!`);
    currentAccount.movements.push(-transferAmount);
    receiverAccount.movements.push(transferAmount);

    //Update UI
    updateUI(currentAccount);
    inputTransferAmount.value = inputTransferTo.value = ``;
  }
});

//close account
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.UserName &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      account => account.username === currentAccount.userName
    );
    console.log(index);
    accounts.splice(index, 1);
    inputClosePin.value = inputCloseUsername.value = ``;
    containerApp.style.opacity = 0;
  }
});

//request loan
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const loanAmount = Number(inputLoanAmount.value);
  if (
    loanAmount > 0 &&
    currentAccount.movements.some(movement => movement >= loanAmount * 0.1)
  ) {
    currentAccount.movements.push(loanAmount);
    updateUI(currentAccount);
    inputLoanAmount.value = ``;
  }
});

//sort movements
let stateSort = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !stateSort);
  stateSort = !stateSort;
});
