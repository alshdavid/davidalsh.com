# What does it mean to “Sandbox” a script?

_tl;dr: Sandboxed scripts are isolated from their environment and can only talk to other scripts through a secure channel — think Docker or Virtual Machines_

First off, let’s define what we mean by “script” in this context. We are talking about JavaScript that is executed in the browser. For example:

```html
<title>My Website!</title>
<script>
 console.log('Welcome to ' + document.title)
</script>
```

Here we have a simple script that is printing out the website’s title to the debug console. We should expect it to say “Welcome to My Website!”.

Sandboxing (marked hypothetically using the `sandbox` attribute in this example) makes it such that the script being executed does not have access to the document:

```html
<title>My Website!</title>
<script sandbox>
  // Cannot access "document" when script is sandboxed
  console.log('Welcome to ' + document.title)
</script>
```

A sandboxed script also cannot access global variables:

```html
<script>
  const outsideGlobalValue = "Hello!"
  window.outsideGlobalValue = outsideGlobalValue
</script>
<script sandbox>
  // Cannot access variables not declare within this script
  console.log(outsideGlobalValue)
</script>
```

Sandboxed scripts would communicate with the host page using the `postMessage` API, as is typical for page-external entities.

```html
<script sandbox id="my-script">
  self.addEventListener('message', () => {
    self.postMessage("Polo!")
  })
</script>
<script>
  const sandboxedScript = document.getElementById('my-script')
  sandboxedScript.addEventListener('message', event => {
    console.log(event.data) // "Polo"
  })
  sandboxedScript.postMessage("Marco!")
</script>
```

# Why is this useful?

You might be wondering what value there is in limiting the reach that a script has.

## Privacy

Often applications will need to reference an external script in order to perform a task the engineers are unable to code themselves. Examples of this are things like third party Social login, Firebase, Analytics tooling, Performance monitoring tooling.

Granting these third party integrations completely unregulated root level access to your web application means that it’s possible they for them to scrape the application for valuable sensitive user data.

Sandboxing a script like this means the third party only has access to data explicitly sent by the hosting web application.

## Security

Leading on from the previous point, it’s also possible for these third party scripts to be collecting user data unwittingly through vulnerabilities in their own client side script.

Perhaps they have a malicious dependency in their JavaScript bundle. Having the host explicitly send data to the script ensures that host applications are not liable for damages resulting from vulnerabilities in third party scripts.

## Performance

Knowing that a script does not have access to the host context allows browsers to execute the script in its own process thread, allowing for parallel execution which can improve the performance of websites that would otherwise evaluate this code directly on the host thread.

# This sounds like a Web Worker?

In some ways, yes — this resembles a web worker, it does however present some notable differences:

## Cross origin script compatibility

Web workers cannot be instantiated from a script located on a cross origin domain. So, essentially if a third party offers an integration — that integration cannot use multi threading (at least not easily) and that third party integration cannot be sandboxed.

```javascript
// Cannot create cross origin worker
const worker = new Worker('https://example.com/auth-integration.js')
```

## Opt-in sandbox features and same-origin Iframe access

Web Workers are unconditionally sandboxed from their execution context meaning they are strictly unable to access anything from the host.

However, iframes can access the content of other iframes

```javascript
// Assuming same origin, an iframe can log things from another iframe
console.log(window.parent.frames[1].window.location.href)
```

Expanding the `sandbox` attribute in a similar way to the `iframe` `sandbox` attribute opens to the door to more use cases.

In a case like social login, perhaps we need an iframe created by the sandboxed script and that iframe needs to communicate to the sandboxed script.

Perhaps exploring `sandbox` attribute values would allow for more versatility for safer third party integrations.

```html
<iframe src="https://third.party.com/login.html"/></iframe>
<script 
  sandbox="same-origin-nosandbox"
  src="https://third.party.com/script.js"
></script>
```

## Browser optimisations

You might be wonder why advocate for a sandbox flag over simply asking for Worker to accept cross origin scripts and, honestly, if that was on offer I’d take it.

In addition to a lack of opt-in sandbox permission, the browser cannot eagerly optimise a Web Worker on page load.

When a web page is loaded, the browser will do quick a first pass “once over” of the html to see if there is anything it can download/evaluate in parallel right away — later executing it in the order specified in the page.

This “once over” optimisation does not extend to Worker scripts because the browser needs to run JavaScript to discover a Worker being initialized.

Worker scripts are also instantiated synchronously, where `<script>` tags can be evaluated asynchronously with the async attribute.

# Current solutions

## Iframes

Currently companies will use hidden iframes to sandbox third party or cross origin scripts.

Iframes will initialize their own DOM and are expected to render another website in an embedded format within a host site.

When using hidden iframes to sandbox scripts, they don’t show this embedded website so it’s obvious that having an entire DOM constructed is overkill.

In addition, (while unclear) it appears that a cross origin iframe uses the equivalent memory of an entire new browser tab — which can get quite costly if you have several third party integrations.