const Elements = {
  Outlet: document.querySelector('main')
}

async function loadPost(postName) {

  Elements.Outlet.innerHTML = ''
  Elements.Outlet.innerHTML = `<a href="#">Back Home</a><hr>`
  const markdown = await fetch(`https://davidalsh.com/blog/${postName}/index.md`).then(res => res.text())
  const markup = window.snarkdown(markdown)
  Elements.Outlet.innerHTML += `${markup}`
}

async function loadIndex() {
  Elements.Outlet.innerHTML = ''
  Elements.Outlet.innerHTML += `<h1>David's Site</h1>`
  Elements.Outlet.innerHTML += `<h2>List of blog posts</h2>`

  const { contents } = await fetch('https://davidalsh.com/blog/index.json').then(res => res.json())

  for (const { title, folderName } of contents) {
    Elements.Outlet.innerHTML += `<li><a href="#${folderName}">${title}</a></li>`
  }
}

async function render() {
  const postName = window.location.hash.substring(1)
  if (postName !== '') {
    await loadPost(postName)
  } else {
    await loadIndex()
  }
}

render()
window.addEventListener('hashchange', () => render())
