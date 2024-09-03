This is a tutorial that describes how to build a web application using the Go programming language in conjunction with the front end framework Angular.

We will cover how to set up the HTTP server, how to store the statically compiled web application files to serve them from a Go static binary and much more.

<script class="youtube_video">
  const VIDEO_URL = "https://www.youtube.com/embed/pHRHJCYBqxw"

  const iframe = document.createElement('iframe')
  iframe.style.display = 'block'
  iframe.style.width = '100%'
  iframe.setAttribute('title', 'YouTube video player')
  iframe.setAttribute('frameborder', '0')
  iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share')
  iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin')
  iframe.setAttribute('allowfullscreen', 'true')
  iframe.setAttribute('src', VIDEO_URL)

  document.currentScript
  if (document.currentScript.nextSibling) {
    document.currentScript.parentNode.insertBefore(iframe, document.currentScript.nextSibling);
    console.log('hi')
  } else {
    document.currentScript.parentNode.appendChild(iframe);
    console.log('hi')
  }

  let height = iframe.getBoundingClientRect().width / (16/9) + 'px'
  iframe.style.height = height
</script>