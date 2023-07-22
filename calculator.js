export function calculate(equation) {
    if (equation.length == 0) return 0;
    if (equation.length == 1) return parseFloat(equation[0]);
    if (equation.length == 2) return parseFloat(equation[0]) * 0.01;

    let operatorIndex = Math.max(equation.lastIndexOf('+'), equation.lastIndexOf('-'));
    if (operatorIndex == -1) operatorIndex = Math.max(equation.lastIndexOf('*'), equation.lastIndexOf('/'));

    let lhs, rhs;
    try {
        lhs = calculate(equation.slice(0, operatorIndex));
        rhs = calculate(equation.slice(operatorIndex+1));
    } catch (e) {
        throw e;
    }

    switch (equation[operatorIndex]) {
        case '+': return lhs + rhs;
        case '-': return lhs - rhs;
        case '*': return lhs * rhs;
        case '/':
            if (rhs == 0) throw "can't divide by zero";
            return lhs / rhs;
    }
}