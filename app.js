const VAPID_PUBLIC_KEY = 'BBXOiNUgaX5OiKQFzX9FVR3nV9hJe-dEME_M5YJqVH_sQsBj5ur-OtdhJdMoXGfMd9UJHT-Hkple3MdcAc8RX1k';

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('./sw.js')
    .then(() => {
      console.info('Service worker registered')
    })
    .catch((err) => {
      console.error('Service worker registration failed: ' + err)
    })
}

// ServiceWorker
if ('serviceWorker' in navigator) {
}

async function registerServiceWorker() {
    await navigator.serviceWorker.register('sw.js')
  }

async function unregisterServiceWorker() {
  const registration = await navigator.serviceWorker.getRegistration()
  await registration.unregister()
}

// Push notification logic
async function subscribeToPush() {
  const registration = await navigator.serviceWorker.getRegistration()
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlB64ToUint8Array(VAPID_PUBLIC_KEY),
  })
  // postToServer('/add-subscription', subscription)
}

async function unsubscribeFromPush() {
  const registration = await navigator.serviceWorker.getRegistration()
  const subscription = await registration.pushManager.getSubscription()
  // postToServer('/remove-subscription', {
  //   endpoint: subscription.endpoint,
  // })
  await subscription.unsubscribe()
}

/* UI logic. */

async function updateUI() {
  const registrationButton = document.getElementById('register');
  const unregistrationButton = document.getElementById('unregister');
  const registrationStatus = document.getElementById('registration-status-message');
  const subscriptionButton = document.getElementById('subscribe');
  const unsubscriptionButton = document.getElementById('unsubscribe');
  const subscriptionStatus = document.getElementById('subscription-status-message');
  const notifyMeButton = document.getElementById('notify-me');
  const notificationStatus = document.getElementById('notification-status-message');
  // Disable all buttons by default.
  registrationButton.disabled = true;
  unregistrationButton.disabled = true;
  subscriptionButton.disabled = true;
  unsubscriptionButton.disabled = true;
  notifyMeButton.disabled = true;
  // Service worker is not supported so we can't go any further.
  if (!'serviceWorker' in navigator) {
    registrationStatus.textContent = "This browser doesn't support service workers.";
    subscriptionStatus.textContent = "Push subscription on this client isn't possible because of lack of service worker support.";
    notificationStatus.textContent = "Push notification to this client isn't possible because of lack of service worker support.";
    return;
  }  
  const registration = await navigator.serviceWorker.getRegistration();
  // Service worker is available and now we need to register one.
  if (!registration) {
    registrationButton.disabled = false;
    registrationStatus.textContent = 'No service worker has been registered yet.';
    subscriptionStatus.textContent = "Push subscription on this client isn't possible until a service worker is registered.";
    notificationStatus.textContent = "Push notification to this client isn't possible until a service worker is registered.";
    return;
  }
  registrationStatus.textContent =
      `Service worker registered. Scope: ${registration.scope}`;
  const subscription = await registration.pushManager.getSubscription();
  // Service worker is registered and now we need to subscribe for push
  // or unregister the existing service worker.
  if (!subscription) {
    unregistrationButton.disabled = false;
    subscriptionButton.disabled = false;
    subscriptionStatus.textContent = 'Ready to subscribe this client to push.';
    notificationStatus.textContent = 'Push notification to this client will be possible once subscribed.';
    return;
  }
  // Service worker is registered and subscribed for push and now we need
  // to unregister service worker, unsubscribe to push, or send notifications.
  subscriptionStatus.textContent =
      `Service worker subscribed to push. Endpoint: ${subscription.endpoint}`;
  notificationStatus.textContent = 'Ready to send a push notification to this client!';
  unregistrationButton.disabled = false;
  notifyMeButton.disabled = false;
  unsubscriptionButton.disabled = false;
}

/* Utility functions. */

// Convert a base64 string to Uint8Array.
// Must do this so the server can understand the VAPID_PUBLIC_KEY.
const urlB64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray; 
};

// async function postToServer(url, data) {
//   let response = await fetch(url, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify(data)
//   });
// }


window.onload = updateUI;
window.onmousemove = updateUI

function notifyMe() {
  const notif = Notification.permission
  switch (notif) {
    case 'granted':
      new Notification('Notifications', {body: 'activées', icon: 'badge.png'})
      break;
    default:
      Notification.requestPermission()
      notifyMe(data)
      break;
  }
}