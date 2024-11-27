export default function (cells) {
  console.log(cells);

  let count = cells.length;
  let level = Math.sqrt(count);

  let completeHandler;

  function click(index) {
    const iPrs = index;
    const iEmp = count - 1;

    if (iEmp === iPrs) return;

    const pPrs = cells[iPrs];
    const pEmp = cells[iEmp];

    let step;

    if (pPrs % level === pEmp % level)
      step = level;

    else if (Math.floor(pPrs / level) === Math.floor(pEmp / level))
      step = 1;

    else return;

    if (pEmp < pPrs)
      step *= -1;

    const snapshot = [...cells];

    for (let p = pPrs; p !== pEmp; p += step) {
      let iCur = snapshot.indexOf(p);
      cells[iCur] = p + step;
    }

    cells[iEmp] = pPrs;
    if (cells.every((p, i) => p === i) && typeof completeHandler === 'function')
      completeHandler();
  }


  function shuffle() {
    cells.sort(() => Math.random() - 0.5);

    if (!isSolvable())
      [cells[0], cells[1]] = [cells[1], cells[0]];
  }


  function reset() {
    cells.sort((a, b) => a - b);
  }


  function oncomplete(handler) {
    if (typeof handler === 'function')
      completeHandler = handler;
  }


  // проверка на нерешаемость пятнашек Лойда
  function isSolvable() {
    const iEmp = count - 1;
    let sum = cells.toSpliced(iEmp, 1).reduce((sum, cur, i, arr) => {
      for (let n = i + 1; n < arr.length; n++) 
        if (cur > cells[n]) sum++;
      return sum;
    }, 0);

    if (level % 2 === 0)
      sum += Math.floor((cells[iEmp]) / level) + 1;

    return sum % 2 === 0;
  }


  return {
    click,
    shuffle,
    reset,
    oncomplete,
    *[Symbol.iterator]() {
      for(let i = 0; i < count; i++) {
        yield {
          row: Math.floor(cells[i] / level),
          col: cells[i] % level,
          position: cells[i],
          empty: i === count - 1
        };
      }
    },
    getState() {
      return [...cells];
    }
  };
};
