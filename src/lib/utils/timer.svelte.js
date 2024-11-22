export default function(m = 0, s = 0, ms = 0) {
  let timer;
  
  let msec = $state(ms);
  let sec = $state(s);
  let min = $state(m);
  
  const start = () => {
    let mseconds = msec;
    let minutes = min;
    let seconds = sec;
    
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
  
  const reset = (m = 0, s = 0, ms = 0) => {
    clearInterval(timer);
    msec = ms;
    sec = s;
    min = m;
  };

  return {
    start,
    stop,
    reset,
    get min() { return min; },
    get sec() { return sec; },
    get msec() { return msec; }, 
  };
}