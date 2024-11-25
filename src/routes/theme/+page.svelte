<script>
  let TWA = $state();
  $effect(() => {
    TWA = window.Telegram.WebApp;

  })
</script>
<svelte:head>
  <script src="https://telegram.org/js/telegram-web-app.js?56"></script>
</svelte:head>

<h2>Color scheme:</h2>
<pre>--color-scheme: var(--tg-color-scheme, "light");
--viewport-height: var(--tg-viewport-height, 100vh);
--viewport-stable-height: var(--tg-viewport-stable-height, 100vh);
</pre>

<h2>Theme Params:</h2>
<pre>{Object.entries(TWA?.themeParams ?? {}).map(([param, value]) => '--' + param.replaceAll('_', '-') + ': var(--tg-theme-' + param.replaceAll('_', '-') + ', ' + value + ');').join('\n')}</pre>

<h2>Safe area inset</h2>
<pre>{Object.entries(TWA?.safeAreaInset ?? {}).map(([param, value]) => '--safe-area-inset-' + param.replaceAll('_', '-') + ': var(--tg-safe-area-inset-' + param.replaceAll('_', '-') + ', ' + value + ');').join('\n')}</pre>

<h2>Content safe area inset</h2>
<pre>{Object.entries(TWA?.contentSafeAreaInset ?? {}).map(([param, value]) => '--content-safe-area-inset-' + param.replaceAll('_', '-') + ': var(--tg-content-safe-area-inset-' + param.replaceAll('_', '-') + ', ' + value + ');').join('\n')}</pre>