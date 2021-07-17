"use strict";

const btnContainer = document.querySelector(".btns-container");
const content = document.querySelector(".content");
const result = document.querySelector(".result");

let res = "";
const symbols = ["+", "-", "*", "/"];
const buttons = {
    1: "one",
    2: "two",
    3: "three",
    4: "four",
    5: "five",
    6: "six",
    7: "seven",
    8: "eight",
    9: "nine",
    0: "zero",
    "+": "plus",
    "-": "minus",
    "*": "mul",
    "/": "divide",
    ".": "dot",
    "=": "equal",
    "%": "percent",
};

const findPercentage = (res) => {
    if (res.includes("%")) {
        const data = res.split("%");
        content.textContent = res;
        result.textContent = data[0] * data[1] * 0.01;
        return;
    }
};

btnContainer.addEventListener("click", function (e) {
    let btnContent = e.target.textContent;
    try {
        console.log(btnContent, res, e);
        if (e.target.tagName === "BUTTON") {
            if (btnContent === "C") {
                res = "";
                content.textContent = "";
                result.textContent = "";
                return;
            }

            // if (btnContent === "⌫") {
            if (e.target.classList.contains("backspace")) {
                if (res) {
                    res = res.slice(0, res.length - 1);
                    content.textContent = res;
                }

                if (res.includes("%")) {
                    findPercentage(res);
                    return;
                }

                result.textContent = eval(res);
                return;
            }

            if (btnContent === "=") {
                if (res.includes("%")) {
                    findPercentage(res);
                    content.style.fontSize = "1em";
                    res = "";
                    return;
                }

                result.textContent = eval(res);
                content.style.fontSize = "1em";
                res = "";
                return;
            }

            if (btnContent === "%" || res.includes("%")) {
                res += btnContent;
                findPercentage(res);
                return;
            }

            content.textContent = "";
            content.style.fontSize = "2em";
            result.style.fontSize = "2em";

            // prettier-ignore
            if (res.endsWith("+") || res.endsWith("-") || res.endsWith("*") || res.endsWith("/")) {
            if (btnContent === "+" || btnContent === "-" || btnContent === "*" || btnContent === "/") {
                symbols.map((el) => {
                    if (btnContent === el) {
                        res = res.slice(0, res.length - 1) + btnContent;
                    }
                });
            } else {
                if (btnContent !== "C" && btnContent !== "⌫")
                    res += btnContent;
            }
        } else {
            if (btnContent !== "C" && btnContent !== "⌫")
                res += btnContent;
        }

            if (!res.includes("%")) {
                content.textContent = res;
                result.textContent = eval(res);
            }
        }
    } catch (err) {}
});

const keyAction = (pressedKey) => {
    try {
        const key = document.querySelector("." + pressedKey);
        key.style.backgroundColor = "#fff";
        key.style.color = "#000";
        key.click();
        setTimeout(() => {
            key.style.backgroundColor = "";
            key.style.color = "";
        }, 400);
    } catch (err) {}
};

document.querySelector("body").addEventListener("keydown", function (e) {
    console.log(e.key);
    switch (e.key) {
        case "Backspace":
            keyAction("backspace");
            break;
        case "c":
        case "C":
            keyAction("cancel");
            break;
        case "Enter":
            keyAction("equal");
            break;
        default:
            keyAction(buttons[e.key]);
    }
});
