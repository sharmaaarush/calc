document.addEventListener('DOMContentLoaded', () => {
  const output   = document.getElementById('outputDisplay');
  const buttons  = document.querySelectorAll('.btn');
  let opOutput   = '';
  let openParen  = true;

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const key     = btn.textContent;
      const current = output.value;
      const last    = opOutput.slice(-1);

      // 1) Freeze on Error or undefined
      if ((current === 'Error' || current === 'undefined') && key !== 'C') return;

      // CLEAR
      if (key === 'C') {
        opOutput      = '';
        output.value  = '';
        openParen     = true;
        return;
      }

      // EVALUATE
      if (key === '=') {
        if (!opOutput.trim()) return;
        const expr = opOutput
          .replace(/×/g, '*')
          .replace(/÷/g, '/')
          .replace(/%/g, '/100');
        try {
          const result = eval(expr);
          if (result === undefined) throw new Error();
          opOutput     = String(result);
          output.value = opOutput;
        } catch {
          opOutput     = 'Error';
          output.value = 'Error';
        }
        return;
      }

      // PARENS TOGGLE
      if (key === '()') {
        opOutput    += openParen ? '(' : ')';
        openParen    = !openParen;
        output.value = opOutput;
        return;
      }

      // OPERATORS
      const ops = ['+', '-', '×', '÷', '%'];
      if (ops.includes(key)) {
        // only after a digit or ')'
        if (!/[0-9]/.test(last)) return;
        opOutput += key;
        output.value = opOutput;
        return;
      }

      // DECIMAL
      if (key === '.') {
        if (!/[0-9]/.test(last)) return;
        const segment = opOutput.split(/[\+\-\×\÷\%]/).pop();
        if (segment.includes('.')) return;
        opOutput += '.';
        output.value = opOutput;
        return;
      }

      // DIGITS
      if (/[0-9]/.test(key)) {
        opOutput += key;
        output.value = opOutput;
      }
    });
  });
});
