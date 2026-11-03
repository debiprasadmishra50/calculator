"use strict";
const resultEl = document.getElementById("result");
const exprEl = document.getElementById("expr");
let res = "";

function fmt(s) {
  return s.replace(/\*/g, "×").replace(/\//g, "÷").replace(/-/g, "−");
}

function safeEval(expr) {
  if (!expr || /[+\-*/%]$/.test(expr)) return NaN;
  if (expr.split(/[+\-*/%]/).some(p => (p.match(/\./g) || []).length > 1)) return NaN;
  try {
    const calcExpr = expr.replace(/÷/g, "/").replace(/×/g, "*").replace(/−/g, "-");
    if (!/^[0-9+\-*/%.\s]+$/.test(calcExpr)) return NaN;
    return Function('"use strict"; return (' + calcExpr + ')')();
  } catch {
    return NaN;
  }
}

function preventInvalidOps(current, op) {
  if (!current) return current + op;
  if (/[+\-*/%]$/.test(current)) return current.slice(0, -1) + op;
  return current + op;
}

function update() {
  if (!res) { exprEl.textContent = ""; resultEl.textContent = "0"; return; }
  exprEl.textContent = fmt(res);
  const v = safeEval(res);
  if (Number.isFinite(v)) { let s = v; if (Math.abs(s) >= 1e15 || (Math.abs(s) < 1e-6 && s !== 0)) s = s.toExponential(6); resultEl.textContent = s; } else { resultEl.textContent = ""; }
}

document.querySelector(".keypad").addEventListener("click", function(e) {
  const btn = e.target.closest(".btn-calc");
  if (!btn) return;
  const val = btn.dataset.value;
  const act = btn.dataset.action;

  if (act === "clear") { res = ""; update(); return; }
  if (act === "backspace") { res = res.slice(0, -1); update(); return; }

  if (act === "percent") {
    if (res.includes("%")) return;
    const lastOpIndex = Math.max(res.lastIndexOf("+"), res.lastIndexOf("-"), res.lastIndexOf("*"), res.lastIndexOf("/"));
    const base = res.slice(lastOpIndex + 1) || res;
    const num = parseFloat(base);
    if (!isNaN(num)) {
      res += "%";
      const v = num * 0.01;
      if (Number.isFinite(v)) { let s = v; if (Math.abs(s) >= 1e15 || (Math.abs(s) < 1e-6 && s !== 0)) s = s.toExponential(6); resultEl.textContent = s; }
      exprEl.textContent = fmt(res);
    }
    return;
  }

  if (act === "equals") {
    const v = safeEval(res);
    if (Number.isFinite(v)) {
      if (Number.isFinite(v)) { let s = v; if (Math.abs(s) >= 1e15 || (Math.abs(s) < 1e-6 && s !== 0)) s = s.toExponential(6); resultEl.textContent = s; }
      exprEl.textContent = fmt(res) + " =";
      res = String(v);
    } else {
      resultEl.textContent = "";
    }
    return;
  }

  if (["add","subtract","multiply","divide"].includes(act)) {
    const op = {add:"+", subtract:"-", multiply:"*", divide:"/"}[act];
    res = preventInvalidOps(res, op);
    update();
    return;
  }

  if (val !== undefined) {
    if (val === ".") {
      const parts = res.split(/[+\-*/]/);
      const current = parts[parts.length - 1] || "";
      if (current.includes(".")) return;
    }
    res += val;
    update();
  }
});

document.addEventListener("keydown", function(e) {
  const map = {
    "0":"0","1":"1","2":"2","3":"3","4":"4",
    "5":"5","6":"6","7":"7","8":"8","9":"9",
    ".":".","+":"add","-":"subtract","*":"multiply",
    "/":"divide","%":"percent","Enter":"equals",
    "Backspace":"backspace","c":"clear","C":"clear","Escape":"clear","=":"equals"
  };
  const a = map[e.key];
  if (!a) return;
  e.preventDefault();
  const b = document.querySelector(`[data-action="${a}"], [data-value="${a}"]`);
  if (b) {
    b.classList.add("flash");
    b.click();
    setTimeout(() => b.classList.remove("flash"), 150);
  }
});

// Theme persistence
document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light-mode');
    document.querySelector('.calc-card').classList.add('light-mode');
  }
  document.getElementById('themeToggle').addEventListener('click', () => {
    const btn = document.getElementById('themeToggle');
    const light = document.body.classList.toggle('light-mode');
    document.querySelector('.calc-card').classList.toggle('light-mode');
    btn.textContent = light ? '☀' : '☽';
    localStorage.setItem('theme', light ? 'light' : 'dark');
  });
});
