
let sizeL = prompt("How many squares per side???")

const createBoard = (sizeL) => {
  let deSize=[];
  for ( i=1; i<=sizeL*sizeL; i++){
    const pixel = document.createElement("div");
    pixel.classList = "gameBoard"

    deSize = 4
    const size = sizeL*deSize;
 
    pixel.style.width = `${size}px`
    pixel.style.height = `${size}px`
    const table = document.querySelector(".table")
    table.style.width = `${size*sizeL+sizeL}px`
    table.style.height = `${size*sizeL+sizeL}px`
    table.appendChild(pixel)
  }

}
createBoard(sizeL)

const Game = (()=> {


const turnOver = (inputArray) => {
  return inputArray.reduce((cum,item) => item==="X"?cum+1:item==="O"?cum-1:0,0 )
}

const rows = (board) => {   
let winner = "";
    let line = "";
    for (i = 0; i <= ((sizeL * sizeL) - sizeL); i = i + sizeL) {
      if (turnOver(board.slice(i, i + sizeL)) === sizeL) {
        winner = "X"
        line = `line${i}`
      }
      if (turnOver(board.slice(i, i + sizeL)) === -sizeL) {
        winner = "O"
        line = `line${i}`
      }
    }
    return { winner, line }
  }
  const diagonals = (board) => {
    let line = ""
    let winner = ""
    let diagLeft = [];
    for (i = 0; i < sizeL * sizeL; i = i + sizeL + 1) {
      diagLeft.push(board[i]);
    }

    let diagRight = [];
    for (i = sizeL - 1; i <= (sizeL * sizeL-sizeL); i = i + sizeL - 1) {
      diagRight.push(board[i]);
    }
    

    if (turnOver(diagLeft) === sizeL) { line = "diagonal1"; winner = "X" }
    if (turnOver(diagLeft) === -sizeL) { line = "diagonal1"; winner = "O" }

    if (turnOver(diagRight) === sizeL) { line = "diagonal2"; winner = "X" }
    if (turnOver(diagRight) === -sizeL) { line = "diagonal2"; winner = "O" }

    return { winner, line }
  }
  const columns = (board) => { 
  let winner = "";
  let line = "";
  let colArray = [];
    for (j=0;j<=sizeL-1;j++){
    colArray = []
     for(i=j;i<sizeL*sizeL;i=i+sizeL){
       colArray.push(board[i]);

       if (turnOver(colArray) === sizeL) { line = `column${j}`; winner = "X"}
       if (turnOver(colArray) === -sizeL) { line = `column${j}`; winner = "O"}
      }
    }
  return {winner, line}
}
  const turn = (board) => {
    const numberOfPlays = board.filter( board => board != "").length;
    return numberOfPlays%2 === 0? "X" : "O";
  }
  const freeMoves = (board) => {
    let freeBoard = [];
    board.forEach( (item,index) => {
      if(item === ""){ freeBoard.push(index)}})
   return freeBoard  
  }
  const over = (board) => {
   return (freeMoves(board).length === 0 || result(board) != "tie" )? true : false
  }
  const result = (board) => { 
    if( rows(board).winner != ""){return rows(board)}
    if( diagonals(board).winner != ""){ return diagonals(board)}
    if( columns(board).winner != ""){ return columns(board)}
    else {return "tie"}
  }
  const drawLine = (className) => {
    const line = document.querySelector(".line");
    line.classList = className;
  }
return { columns, line, diagonals, turn, freeMoves, over, result, drawLine}})()




const Controller = (() => {
  const initRound = () => {
    display.clearBoard()
    display.setNewGame()
    display.nextPlayer()
    play()
    } 
  const _dumbAi = () => {
    const board = Array.from(document.querySelectorAll(".gameBoard"));
    const markHere = board.filter(square => square.innerText === "")
    function getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min - 1)) + min;
    }
    const move = getRandomInt(0, markHere.length)
    return markHere[move] === undefined ? "end" : markHere[move].innerText = "O";
  }
  
  // Smart AI
     const score = (board) => {
      switch (Game.result(board).winner){
       case "O":
        return 10;
       break;
       case "X":
        return -10;
       break; 
       default: return 0
      }
    }
  
    let choice 
    const miniMax = (board) => {
      if(Game.over(board)){ return score(board) }

      let scores = [];
      let moves = [];
      
      Game.freeMoves(board).forEach( move => { 
        let newBoard = board;
        newBoard[move] = Game.turn(board);
        scores.push( miniMax(newBoard) );
        moves.push(move);
        newBoard[move] = ""
      })
      // Let's minimize "X"
      if (Game.turn(board) === "X"){
        let minScoreIndex = scores.indexOf(Math.min(...scores));
        choice = moves[minScoreIndex];
        return scores[minScoreIndex]
       }
      // Let's maximize "O"
      if (Game.turn(board) === "O"){
        let maxScoreIndex = scores.indexOf(Math.max(...scores))
        choice = moves[maxScoreIndex]
        return scores[maxScoreIndex]
       }
    
    }
   

  const play = () => {
    const gameBoard = Array.from(document.querySelectorAll(".gameBoard"))
    const player2 = document.querySelector("#player2");
    const options = {once:true, capture:false }
    gameBoard.map (square => square.addEventListener("click", move, options))
      function move (e) {
       if(this.innerText === ""){
          const board = gameBoard.map(item => item.innerText)
          this.innerText = Game.turn(board)
          let newBoard = Array.from(document.querySelectorAll(".gameBoard")).map(item=> item.innerText)
          if (Game.over(newBoard)){ 
            display.result(Game.result(newBoard))
            Game.drawLine(Game.result(newBoard).line)
            gameBoard.map (square => square.removeEventListener("click", move, options))
            this.removeEventListener("click", move, options)
          }
          
          else if(player2.value === "Computer"){
            _dumbAi()
            gameBoard[choice].innerText = "O"
            newBoard = Array.from(document.querySelectorAll(".gameBoard")).map(item=> item.innerText)
            if (Game.over(newBoard)){ 
              display.result(Game.result(newBoard))
              Game.drawLine(Game.result(newBoard).line)
              gameBoard.map(square => square.removeEventListener("click", move, options))
              this.removeEventListener("click", move, options)
            }
          }
          else {
            display.nextPlayer()
          }
        }
      }
  } 
  
  const newGame = () => {
    display.clearAll()
    display.setStart()
     }
return {initRound, newGame, score , miniMax}})()

 const display = (() => {
    const displayBoard = document.querySelector(".display");
    const displayContainer = document.querySelector(".displayContainer");
    const playerA = document.querySelector("a")
    const player1 = document.querySelector("#player1");
    const player2 = document.querySelector("#player2");
    let score1 = document.querySelector("#score1");
    let score2 = document.querySelector("#score2");
    const submit = document.querySelector(".submitPlayers");
    
    const result = (result) =>{
      result.winner === "X"? player = player1.value : player = player2.value;
        if(result === "tie"){ 
         playerA.innerText = "";
         displayBoard.innerText = `It's a tie!`;
         nextRound()
        }
       if(result !== "tie"){
         result.winner === "X"? score1.value = parseInt(score1.value)+1: 
           score2.value = parseInt(score2.value)+1
         displayBoard.innerText = `${player} wins!`;
         nextRound()
       }
    }
       
    const nextRound = () => {
        const nextRoundButton = document.createElement("input")
        nextRoundButton.id = "nextRound";
        nextRoundButton.type = "button";
        nextRoundButton.value = "Next round."
        nextRoundButton.setAttribute("onclick", "Controller.initRound()"); 
        displayContainer.appendChild(nextRoundButton);
        const nextRound = document.querySelector("#nextRound")
        const removeButton = () => { nextRound.remove()}
        nextRound.addEventListener("click", removeButton)
        
      }
    
    const setNewGame = () => {
      submit.value = "New Game"
      submit.setAttribute("onclick", "Controller.newGame()");
      player1.setAttribute("readOnly", "true")
      player2.setAttribute("readOnly", "true")
    }
    const setStart = () => {
      submit.value = "Start"
      submit.setAttribute("onclick", "Controller.initRound()");
      player1.removeAttribute("readOnly")
      player2.removeAttribute("readOnly")
      const nextRound = document.querySelector("#nextRound")
      nextRound.remove()
    }
   
    const nextPlayer = () => { 
      const board = Array.from(document.querySelectorAll(".gameBoard")).map(item=> item.innerText)
      let nextPlayer = "Player X"
      Game.turn(board) === "X" ? nextPlayer = player1.value :nextPlayer = player2.value;
      displayBoard.innerText = `${nextPlayer}`+` it's your turn!`
    }

    const clearBoard = () => {
      let gameBoard = Array.from(document.querySelectorAll(".gameBoard"));
      gameBoard = gameBoard.map(item => item.innerText = "")
      const line = document.querySelector("#line");
      line.classList = "line"
    }
    const clearAll = () => {
      clearBoard()
      score1.value = "";
      score2.value = "";
      displayBoard.innerText = "";
    }
  return {result, nextRound, nextPlayer, setNewGame, setStart, clearBoard, clearAll}
  })()