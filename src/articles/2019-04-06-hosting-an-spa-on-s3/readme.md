Amazon's Simple Storage Service (AWS S3) is a fantastic tool that lets you host static websites for basically free!

This tutorial shows how to use S3 to host a Single Page web application such that fall through routes are handled properly.

<script class="youtube_video">
  const VIDEO_URL = "https://www.youtube.com/embed/_XuQnZzuLJA"

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