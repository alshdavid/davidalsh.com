import { WcEmbedSvg } from './components/wc-embed-svg/index.js'
import { WcEmbedHtml } from './components/wc-embed-html/index.js'
import { WcGrid } from './components/wc-grid/index.js'
import { initColorScheme } from "./scripts/color-scheme.js"
import { runSvgReplace } from "./scripts/svg-replace.js"
import { initHomePage } from "./pages/home/index.js"

WcEmbedSvg.register()
WcEmbedHtml.register()
WcGrid.register()

initColorScheme()
await runSvgReplace()

if (window.location.pathname === '/') {
  await initHomePage()
}

// window.addEventListener('message', console.warn)



// for (const codeblock_outer of document.querySelectorAll('.codeblock-outer')) {

//   const button = codeblock_outer.querySelector('button')
//   const code = codeblock_outer.querySelector('pre')
//   if (!button || !code) continue
  
//   button.addEventListener('click', () => {
//     navigator.clipboard.writeText(code.innerText);
//   })
// }

