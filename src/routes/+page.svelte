<script>
  import Icon from "@iconify/svelte";
  import { Puzzle, Timer, outsideClick } from "$lib/utils";

  let t = Timer();
  let level = $state(3);
  let puzzle = $derived(Puzzle(level));

  let halfGap = $state(3);
  let imageSrc = $state("/4.webp");
  let gameRatio = $state(1);
  let gameSize = 90;
  let gameHeight = $derived(Math.min(gameSize, gameSize * gameRatio));
  let gameWidth = $derived(gameHeight / gameRatio);

  let isStarted = $state(false);
  let isFreeze = $state(false);
  let isPaused = $state(false);
  let isDone = $state(false);
  let isSettingsMenu = $state(false);
  let isImageMenu = $state(false);
  let isNumbers = $state(true);

  let images = [
    "/1.webp",
    "/2.webp",
    "/3.webp",
    "/4.webp",
  ];

  let WebApp;

  $effect(() => {
    WebApp = Telegram.WebApp;
    WebApp.ready();
    WebApp.requestFullscreen();
    WebApp.lockOrientation();
    WebApp.disableVerticalSwipes();

    puzzle.oncomplete(() => {
      t.stop();
      isStarted = false;
      isDone = true;
      isFreeze = true;
    });

    WebApp.onEvent("homeScreenAdded", () => {
      WebApp.showPopup({
        title: "Поздравляем!",
        message: "Приложение добавлено на ваш экран",
        buttons: [{ type: "ok",text: "Закрыть" }],
      });
    });
  });
  

  

  function onCellClick(index) {
    if (isFreeze) return;
    if (isStarted) return puzzle.click(index);

    isStarted = true;
    t.start();
    puzzle.click(index);
  }

  function reset() {
    isDone = false;
    isFreeze = false;
    isPaused = false;
    isStarted = false;
    t.reset();
    puzzle.reset();
  }

  function shuffle() {
    reset();
    puzzle.shuffle();
  }

  function changeLevel(inc) {
    level = Math.min(9, Math.max(2, level + inc));
    isDone = false;
  }

  function loadImage() {
    const [file] = this.files;
    if (!file) return;
    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      gameRatio = img.height / img.width;
      imageSrc = URL.createObjectURL(file);
      isNumbers = false;
      halfGap = 1;
      hideMenu(isImageMenu);
    };
  }

  function selectImage(src) {
    imageSrc = src;
    isNumbers = false;
    halfGap = 1;
    gameRatio = 1;
    hideMenu(isImageMenu);
  }

  function switchToNumbers() {
    isNumbers = true;
    gameRatio = 1;
    halfGap = 3;
    hideMenu(isImageMenu);
  }

  function pause() {
    if (!isStarted) return;

    if (!isPaused) {
      t.stop();
      isFreeze = true;
      return (isPaused = true);
    }
    t.start();
    isFreeze = false;
    isPaused = false;
  }

  function hideMenu(menu) {
    setTimeout(() => {
      menu = false;
    }, 1000)
  }
</script>

<svelte:head>
  <!-- <script src="https://telegram.org/js/telegram-web-app.js?56"></script>
</svelte:head> -->

<main>
  <div class="panel">
    <div class="timer" onclick={pause} class:paused={isPaused}>
      {#if isPaused}
        <Icon icon="mdi:pause-circle" width="24" height="24" />{/if}{t.min < 10
        ? "0" + t.min
        : t.min}:{t.sec < 10 ? "0" + t.sec : t.sec}:{t.msec < 10
        ? "0" + t.msec
        : t.msec}
    </div>
  </div>
  <div
    class="game"
    class:numbers={isNumbers}
    class:image={!isNumbers}
    class:done={isDone}
    style="
  --game-size: {gameSize}vmin;
  --game-height: {gameHeight}vmin;
  --game-width: {gameWidth}vmin;
  --half-gap: {halfGap}px;
  --font-size: {40 / level}vmin;
  --cell-size: {100 / level}%;
  --level: {level};
  --image-url: url({imageSrc});
  --aspect-ratio: {gameRatio};
  "
  >
    {#each puzzle as { row, col, empty }, index}
      <div
        onclick={() => onCellClick(index)}
        class="cell"
        class:empty
        style="--col: {col}; --row: {row}; --c: {index %
          level}; --r: {Math.floor(index / level)};"
        data-n={index + 1}
      ></div>
    {/each}
  </div>

  <div class="panel">
    <div
      class="panel-button"
      onclick={() => (isImageMenu = true)}
      use:outsideClick={() => {
        isImageMenu = false;
      }}
    >
      <Icon icon="system-uicons:picture" />

      {@render imageMenu()}
    </div>
    {#if isStarted}
      <div class="panel-button" onclick={reset}>
        <Icon icon="system-uicons:reset" />
      </div>
    {:else}
      <div class="panel-button" onclick={shuffle}>
        <Icon icon="fluent:arrow-shuffle-48-regular" />
      </div>
    {/if}
    <div
      class="panel-button"
      onclick={() => (isSettingsMenu = true)}
      use:outsideClick={() => {
        isSettingsMenu = false;
      }}
    >
      <Icon icon="system-uicons:settings" inline />
      {@render settingsMenu()}
    </div>
  </div>
</main>

{#snippet settingsMenu()}
<span class=theme></span>
  <div class="menu settings" class:open={isSettingsMenu}>
    <button onclick={() => Telegram.WebApp.addToHomeScreen()}>Добавить на экран</button>
    <div class="flex-center">
      <button class="level-button" onclick={() => changeLevel(-1)}>-</button>
      <span class="level-lable">{level} × {level}</span>
      <button class="level-button" onclick={() => changeLevel(1)}>+</button>
    </div>

    <div class="menu-line">
      <small>Отступ</small>
      <input type="range" bind:value={halfGap} min="0" max="5" step=".5" />
    </div>
  </div>
{/snippet}

{#snippet imageMenu()}
  <div class="menu image" class:open={isImageMenu}>
    {#each images as img}
    <div class="preview" onclick={() => selectImage(img)} style="background-image: url({img})"></div>
    {/each}

    <label class="preview camera">
      <Icon icon="mdi:camera" width=24 height=24 />
      <input type="file" onchange={loadImage} style="display: none" />
    </label>
    <button class="preview button" onclick={switchToNumbers}>15</button>
  </div>
{/snippet}

<style>
  .theme::before {
    content: var(--tg-color-scheme)
  }
  .flex-center {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .menu {
    display: flex;
    position: absolute;
    bottom: 80%;
    left: 50%;
    transform: translateX(-50%);
    background: #fff;
    padding: 10px;
    border-radius: 10px;
    box-shadow: 0 3px 7px rgba(0, 0, 0, 0.15);
    transition: 0.1s;
    opacity: 0;
    visibility: hidden;
  }

  .menu::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -6px;
    border: 6px solid transparent;
    border-color: #fff transparent transparent transparent;
  }

  .menu.open {
    opacity: 1;
    bottom: 110%;
    visibility: visible !important;
  }

  .menu.settings {
    flex-direction: column;
    gap: 15px;
  }

  .menu.image {
    flex-direction: column;
    gap: 10px;
  }

  .preview {
    width: 50px;
    height: 50px;
    background-size: cover;
    background-color: #eee;
    border-radius: 5px;
    cursor: pointer;
    color: #aaa;
  }
  
  .preview.button {
    border: 2px solid currentColor;
    font-size: 1.5em;
    font-weight: bold;
    cursor: pointer;
    text-align: center;
    line-height: 46px;
  }

  .preview :global(svg) {
    color: #aaa;
    fill: currentColor;
    margin: auto;
  }

  .preview.camera {
    display: flex;
    border: 2px solid currentColor;
  }
 


  .level-button {
    width: 32px;
    height: 32px;
    border: 0;
    border-radius: 3px;
  }
  .level-lable {
    flex-grow: 1;
    text-align: center;
    font-size: 1.2em;
  }

  .panel {
    display: flex;
    gap: 16px;
    flex-grow: 1;
    justify-content: center;
    align-items: center;
    width: 100%;
  }

  .panel-button {
    position: relative;
    cursor: pointer;
    padding: 5px;
    width: 32px;
    height: 32px;
    /* background: #eee; */
  }

  .panel-button :global(svg) {
    width: 32px;
    height: 32px;
  }

  .timer {
    font-size: 2em;
    vertical-align: middle;
    font-family: monospace;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .timer.paused {
    margin-left: -34px;
  }

  main {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
  .game {
    position: relative;
    width: var(--game-width);
    height: var(--game-height);
    max-width: var(--game-size);
    max-height: var(--game-size);
  }

  .cell {
    display: flex;
    position: absolute;
    left: calc(var(--cell-size) * var(--col));
    top: calc(var(--cell-size) * var(--row));
    width: var(--cell-size);
    height: var(--cell-size);
    font-size: var(--font-size);
    transition: .1s;
  }

  .cell::before {
    content: "";
    position: absolute;
    left: var(--half-gap);
    top: var(--half-gap);
    right: var(--half-gap);
    bottom: var(--half-gap);
    background-color: #000;
    border-radius: calc(var(--half-gap) * 2);
    cursor: pointer;
  }

  .image > .cell::before {
    background-color: #fff;
    background-image: var(--image-url);
    background-size: var(--game-width) var(--game-height);
    background-position-x: calc(
      var(--game-width) / var(--level) * var(--c) * -1 - var(--half-gap)
    );
    background-position-y: calc(
      var(--game-height) / var(--level) * var(--r) * -1 - var(--half-gap)
    );
  }

  .empty {
    opacity: 0;
  }

  .image.done > .empty {
    transition: opacity 3s 0.2s ease-in-out;
    opacity: 1;
  }

  .numbers > .cell::after {
    content: attr(data-n);
    color: #fff;
    position: relative;
    margin: auto;
  }
</style>
