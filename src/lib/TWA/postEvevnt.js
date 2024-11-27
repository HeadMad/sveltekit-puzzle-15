export default function postEvent(eventType, callback, eventData) {
  if (!callback) {
    callback = function () {};
  }
  if (eventData === undefined) {
    eventData = '';
  }
  console.log('[Telegram.WebView] > postEvent', eventType, eventData);

  if (window.TelegramWebviewProxy !== undefined) {
    TelegramWebviewProxy.postEvent(eventType, JSON.stringify(eventData));
    callback();
  }
  else if (window.external && 'notify' in window.external) {
    window.external.notify(JSON.stringify({eventType: eventType, eventData: eventData}));
    callback();
  }
  else if (isIframe) {
    try {
      var trustedTarget = 'https://web.telegram.org';
      // For now we don't restrict target, for testing purposes
      trustedTarget = '*';
      window.parent.postMessage(JSON.stringify({eventType: eventType, eventData: eventData}), trustedTarget);
      callback();
    } catch (e) {
      callback(e);
    }
  }
  else {
    callback({notAvailable: true});
  }
};