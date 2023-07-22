import { calculate } from "./calculator.js";

const numberButtons = document.querySelectorAll('.number-button');
const operationButtons = document.querySelectorAll('[data-type="operation"]');
const acButton = document.querySelector('[data-type="ac"]');
const delButton = document.querySelector('[data-type="del"]');
const percentButton = document.querySelector('[data-type="percent"]');
const dotButton = document.querySelector('[data-type="dot"]');
const equalsButton = document.querySelector('.equals-button');
const previousEquationField = document.querySelector('.previous-equation');
const equationField = document.querySelector('.equation');

//array of numbers and operators
let equation = []; 
//next number or operator to be added to equation array
let currentExpression = ""; 
//true after equals button is pressed
let toReset = false;
let errorMessageDisplayed = false;

function clearEquation() {
    if (toReset) {
        toReset = false;
        previousEquationField.innerHTML += currentExpression;
    }
    if (errorMessageDisplayed) errorMessageDisplayed = false;

    equationField.innerHTML = '';
    equation = [];
    currentExpression = "";
}

function deleteLastFromEquation() {
    if (errorMessageDisplayed) {
        clearEquation();
        return;
    }
    if (toReset && equationField.innerHTML == "") toReset = false;
    if (equationField.innerHTML == "") return;

    equationField.innerHTML = equationField.innerHTML.slice(0, -1);
    currentExpression = currentExpression.slice(0, -1);

    if (currentExpression == "" && equation.length != 0) {
        currentExpression = equation[equation.length-1];
        equation.pop();
    }
}

function addNumberToEquation(number) {
    if (toReset || errorMessageDisplayed) clearEquation();
    if (currentExpression == '%') return;

    equationField.innerHTML += number;
    if (['%', '/', '*', '-', '+'].includes(currentExpression)) {
        equation.push(currentExpression);
        currentExpression = number;
    }
    else currentExpression += number;
}

function addOperationToEquation(operation) {
    if (errorMessageDisplayed) clearEquation();
    if (toReset) toReset = false;

    if (equationField.innerHTML == "") addNumberToEquation(0);
    else if (['/', '*', '-', '+'].includes(currentExpression)) {
        deleteLastFromEquation();
    }
    else if (currentExpression.at(-1) == '.') deleteLastFromEquation();

    equationField.innerHTML += operation;
    //replacing special characters
    if (operation == '×') operation = '*';
    if (operation == '÷') operation = '/';
    equation.push(currentExpression);
    currentExpression = operation;
}

function addPercentToEquation() {
    if (errorMessageDisplayed) clearEquation();
    if (toReset) toReset = false;

    if (['/', '*', '-', '+', '%'].includes(currentExpression)) return;
    addOperationToEquation('%');
}

function addDotToEquation() {
    if (errorMessageDisplayed || toReset) clearEquation();

    if (equationField.innerHTML == "") addNumberToEquation(0);
    else if (['/', '*', '-', '+'].includes(currentExpression)) {
        equation.push(currentExpression);
        currentExpression = "";
        addNumberToEquation(0);
    }

    else if (currentExpression == '%') return;
    else if (currentExpression.includes('.')) return;

    equationField.innerHTML += '.';
    currentExpression += '.';
}

function calculateEquation() {
    if (errorMessageDisplayed || toReset) return;

    if (['/', '*', '-', '+'].includes(currentExpression)) deleteLastFromEquation();
    else if (currentExpression.at(-1) == '.') deleteLastFromEquation();

    equation.push(currentExpression);
    previousEquationField.innerHTML = equationField.innerHTML + '=';

    toReset = true;

    let result;
    try {
        result = calculate(equation);
    } catch (e) {
        equationField.innerHTML = e;
        equation = [];
        currentExpression = "";
        errorMessageDisplayed = true;
        return;
    }

    equationField.innerHTML = result;
    equation = [];
    currentExpression = result.toString();
}

numberButtons.forEach(button => button.addEventListener('click', e => {
    addNumberToEquation(button.innerHTML);
}));
operationButtons.forEach(button => button.addEventListener('click', e => {
    addOperationToEquation(button.innerHTML);
}));
acButton.addEventListener('click', clearEquation);
delButton.addEventListener('click', deleteLastFromEquation);
dotButton.addEventListener('click', addDotToEquation);
percentButton.addEventListener('click', addPercentToEquation);
equalsButton.addEventListener('click', calculateEquation);

document.addEventListener('keydown', e => {
    if (!isNaN(parseInt(e.key))) addNumberToEquation(e.key);
    else if (e.key == '/') addOperationToEquation('/');
    else if (e.key == '*') addOperationToEquation('*');
    else if (e.key == '-') addOperationToEquation('-');
    else if (e.key == '+') addOperationToEquation('+');
    else if (e.key == '%') addPercentToEquation();
    else if (e.key == ',' || e.key == '.') addDotToEquation();
    else if (e.key == 'Backspace' || e.key == 'Delete') deleteLastFromEquation();
    else if (e.key == 'Enter' || e.key == '=') calculateEquation();
});