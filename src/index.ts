import { initColorScheme } from "./scripts/color-scheme.js"
import { runSvgReplace } from "./scripts/svg-replace.js"
import { initHomePage } from "./pages/home/index.js"
// import { getServiceWorker } from "./scripts/service-worker.js"
import { fetchArticles } from "./scripts/meta.js"

initColorScheme()
await runSvgReplace()

if (window.location.pathname === '/') {
  await initHomePage()
}



// for (const codeblock_outer of document.querySelectorAll('.codeblock-outer')) {

//   const button = codeblock_outer.querySelector('button')
//   const code = codeblock_outer.querySelector('pre')
//   if (!button || !code) continue
  
//   button.addEventListener('click', () => {
//     navigator.clipboard.writeText(code.innerText);
//   })
// }

