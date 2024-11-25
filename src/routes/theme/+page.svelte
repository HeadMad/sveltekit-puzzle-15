<script>
  let TWA;
  $effect(() => {
    TWA = window.Telegram.WebApp;

  })
</script>
<svelte:head>
  <script src="https://telegram.org/js/telegram-web-app.js?56"></script>
</svelte:head>

<pre>
  {JSON.stringify(TWA?.themeParams, null, 2)}
</pre>