self.addEventListener('install', (event) => {
  console.info('installing!')
  self.skipWaiting()
  event.waitUntil(cache_assets())
})

self.addEventListener('push', (event) => {
  let notification = event.data.json()
  try {
    self.registration.showNotification(notification.title, notification.options)
  } catch (e) {
    console.error('Push registration: ', e)
  }
})
