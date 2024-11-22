<script>
  let timer;

  let msec = 0,
    sec = 0,
    min = 0;

  const start = () => {
    let mseconds = 0;
    let minutes = 0;
    let seconds = 0;

    timer = setInterval(() => {
      mseconds++;
      msec = mseconds % 10;

      if (msec == 0) {
        seconds++;
        sec = seconds % 60;

        if (sec == 0) {
          minutes++;
          min = minutes % 60;
        }
      }
    }, 100);
  };

  const stop = () => {
    clearInterval(timer);
  };

  const reset = () => {
    clearInterval(timer);
    msec = 0;
    sec = 0;
    min = 0;
  };

  export {start, stop, reset};
</script>

<slot {min} {sec} {msec} />
