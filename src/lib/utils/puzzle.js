export default function (cells) {

  let count = cells.length;
  let level = Math.sqrt(count);

  let complete;

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

    if (typeof complete === 'function' && cells.every((p, i) => p === i))
      complete();
  }

  function shuffle(handler) {
    cells.sort(() => Math.random() - 0.5);
    
    if (typeof handler === 'function')
      handler();

    if (isSolvable(cells))
      return;
    console.log('!solvable');
    // [cells[0], cells[1]] = [cells[1], cells[0]];
  }

  function reset(handler) {
    cells.sort((a, b) => a - b);
    if (typeof handler === 'function')
      handler();
  }

  function oncomplete(handler) {
    complete = handler;
  }


  function isSolvable(order) {
    let parity = 0;
    let gridWidth = Math.sqrt(order.length);
    let row = 0; // the current row we are on
    let blankRow = 0; // the row with the blank tile
  
    for (let i = 0; i < order.length; i++) {
      if (i % gridWidth == 0) { // advance to next row
        row++;
      }
      if (order[i] == order.length - 1) { // the blank tile
        blankRow = row; // save the row on which encountered
        continue;
      }
      for (let j = i + 1; j < order.length; j++) {
        if (order[i] > order[j] && order[j] !== order.length - 1) {
          parity++;
        }
      }
    }
  
    if (gridWidth % 2 == 0) { // even grid
      if (blankRow % 2 == 0) { // blank on odd row; counting from bottom
        return parity % 2 == 0;
      } else { // blank on even row; counting from bottom
        return parity % 2 != 0;
      }
    } else { // odd grid
      return parity % 2 == 0;
    }
  
  
    //////////////////////////////
    // const level = Math.sqrt(order.length);
    // // проверка на нерешаемость пятнашек Лойда
    // let sum = order.reduce((sum, cur, i) => {
    //   // если пустая ячейка и если уровень чётный,
    //   // вычисляем номер её ряда и прибавляем к счетчику
    //   if (cur === (order.length - 1) && level % 2 === 0) {
    //     let row = Math.ceil((i + 1) / level);
    //     sum += row;
    //     return sum;
    //   }
  
    //   for (let n = i + 1; n < order.length; n++) {
    //     let num = order[n];
    //     if (num !== (order.length - 1) && cur > num) sum++;
    //   }
    //   return sum;
    // }, 0);
  
    // return sum % 2 === 0;
    //////////////
    // for (let kDisorder = 0, i = 1; i < (order.length-1); i++)
    //   for (var j = i-1; j >= 0; j--)
    //     if (order[j] > order[i])
    //       kDisorder++;
    //   return !(kDisorder % 2); 
    /////////////
  
    // let iEmp = order.indexOf(count - 1);
    // let arr = order.toSpliced(iEmp, 1);
  
    // let sum = arr.reduce((sum, cur, i, arr) => {
    //   if (!i) return sum;
  
    //   return sum + (cur > arr[i - 1]);
    // }, 0);
  
    // console.log(arr, sum)
  
    // return sum % 2 === 0;
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
    }
  };
};
