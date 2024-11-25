<script>
  let TWA = $state();
  $effect(() => {
    TWA = window.Telegram.WebApp;

  })
</script>
<svelte:head>
  <script src="https://telegram.org/js/telegram-web-app.js?56"></script>
</svelte:head>
<h2>Theme Params:</h2>
<pre>
  {JSON.stringify(TWA?.themeParams, null, 2)}
</pre>