const numberButtons = document.querySelectorAll('.number-button');
const operationButtons = document.querySelectorAll('[data-type="operation"]');
const acButton = document.querySelector('[data-type="ac"]');
const delButton = document.querySelector('[data-type="del"]');
const percentButton = document.querySelector('[data-type="percent"]');
const dotButton = document.querySelector('[data-type="dot"]');
const equalsButton = document.querySelector('.equalsButton');
const previousEquationField = document.querySelector('.previousEquation');
const equationField = document.querySelector('.equation');

let equation = [];
let currentExpression = "";

function clearEquation() {
    equationField.innerHTML = '';
    equation = [];
    currentExpression = "";

    console.log(equation);
    console.log(currentExpression)
}

function deleteLastFromEquation() {
    if (equationField.innerHTML == "") return;
    equationField.innerHTML = equationField.innerHTML.slice(0, -1);
    currentExpression = currentExpression.slice(0, -1);
    if (currentExpression == "" && equation.length != 0) {
        currentExpression = equation[equation.length-1];
        equation.pop();
    }

    console.log(equation);
    console.log(currentExpression)
}

function addNumberToEquation(number) {
    if (currentExpression == '%') return;
    equationField.innerHTML += number;
    if (['%', '/', '*', '-', '+'].includes(currentExpression)) {
        equation.push(currentExpression);
        currentExpression = number;
    }
    else currentExpression += number;

    console.log(equation);
    console.log(currentExpression)
}

function addOperationToEquation(operation) {
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

    console.log(equation);
    console.log(currentExpression)
}

function addPercentToEquation() {
    if (['/', '*', '-', '+', '%'].includes(currentExpression)) return;
    addOperationToEquation('%');
}

function addDotToEquation() {
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

    console.log(equation);
    console.log(currentExpression)
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