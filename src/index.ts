for (const codeblock_outer of document.querySelectorAll('.codeblock-outer')) {

  const button = codeblock_outer.querySelector('button')
  const code = codeblock_outer.querySelector('pre')
  if (!button || !code) continue
  
  button.addEventListener('click', () => {
    navigator.clipboard.writeText(code.innerText);
  })
}

console.log('hiiii')