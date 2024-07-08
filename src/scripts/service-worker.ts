const service_worker_url = document.querySelector(
  "meta[name='data:service_worker']"
) as HTMLMetaElement;

let cached: ServiceWorkerRegistration = undefined

export async function getServiceWorker(): Promise<ServiceWorker> {
  if (!cached) {
    await navigator.serviceWorker.register(
      service_worker_url.getAttribute("content"),
      { scope: "/" }
    );
    const sw = await navigator.serviceWorker.ready
    cached = sw
  }
  return cached.active
}