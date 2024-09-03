This is a tutorial demonstrating how to put together a REST API using the Go programming language.

We go through how to use the Gin web framework, how to write some basic unit tests and how to use Go interfaces to best effect.


<script class="youtube_video">
  const VIDEO_URL = "https://www.youtube.com/embed/LOn1GUsjOF4"

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