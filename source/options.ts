import optionsStorage from "./options-storage";

optionsStorage.syncForm("#options-form");

const rangeInputs: HTMLInputElement[] = [
    ...document.querySelectorAll<HTMLInputElement>(
        'input[type="range"][name^="color"]'
    ),
];
const numberInputs: HTMLInputElement[] = [
    ...document.querySelectorAll<HTMLInputElement>(
        'input[type="number"][name^="color"]'
    ),
];
const output: HTMLElement = document.querySelector(".color-output");

function updateColor() {
    output.style.backgroundColor = `rgb(${rangeInputs[0].value}, ${rangeInputs[1].value}, ${rangeInputs[2].value})`;
}

function updateInputField(event) {
    numberInputs[rangeInputs.indexOf(event.currentTarget)].value =
        event.currentTarget.value;
}

for (const input of rangeInputs) {
    input.addEventListener("input", updateColor);
    input.addEventListener("input", updateInputField);
}

window.addEventListener("load", updateColor);
