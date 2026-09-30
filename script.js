const GameBoard = (() => {
    let gameBoardArr = new Array(9)

    if (Object.seal) {
        gameBoardArr.fill(0);
        Object.seal(gameBoardArr);
    }

    const updateGameBoardArr = (index, marker) => {
        gameBoardArr[index] = marker;
    } 

    const getBoard = () => [...gameBoardArr]

    const resetGameBoardArr = () => gameBoardArr.fill(0);

    return {updateGameBoardArr, getBoard, resetGameBoardArr}
})();

function CreatePlayer (name, marker) {
    let score = 0;

    const increaseScore = () => score++;
    const getScore = () => score;

    return {name, marker, increaseScore, getScore}
}

function GameController (playerOne = CreatePlayer('Player One', 'X'), playerTwo = CreatePlayer('Player Two', 'O')) {
    const players = [playerOne, playerTwo];
    const gameContainer = document.querySelector('.game-container');
    
    let activePlayer = players[0];
    let firstPlayer = activePlayer;
    let gameStatus = '';

    const switchPlayerTurn = () => activePlayer = activePlayer === players[0] ? players[1] : players[0]; 

    const getActivePlayer = () => activePlayer;

    // const getWinningPlayer = () => winningPlayer;

    const getGameStatus = () => gameStatus;

    const updateStatus = () => {
        if (
            (GameBoard.getBoard()[0] === getActivePlayer().marker && GameBoard.getBoard()[1] === getActivePlayer().marker && GameBoard.getBoard()[2] === getActivePlayer().marker)
            || (GameBoard.getBoard()[3] === getActivePlayer().marker && GameBoard.getBoard()[4] === getActivePlayer().marker && GameBoard.getBoard()[5] === getActivePlayer().marker)
            || (GameBoard.getBoard()[6] === getActivePlayer().marker && GameBoard.getBoard()[7] === getActivePlayer().marker && GameBoard.getBoard()[8] === getActivePlayer().marker)
            || (GameBoard.getBoard()[0] === getActivePlayer().marker && GameBoard.getBoard()[3] === getActivePlayer().marker && GameBoard.getBoard()[6] === getActivePlayer().marker)
            || (GameBoard.getBoard()[1] === getActivePlayer().marker && GameBoard.getBoard()[4] === getActivePlayer().marker && GameBoard.getBoard()[7] === getActivePlayer().marker)
            || (GameBoard.getBoard()[2] === getActivePlayer().marker && GameBoard.getBoard()[5] === getActivePlayer().marker && GameBoard.getBoard()[8] === getActivePlayer().marker)
            || (GameBoard.getBoard()[0] === getActivePlayer().marker && GameBoard.getBoard()[4] === getActivePlayer().marker && GameBoard.getBoard()[8] === getActivePlayer().marker)
            || (GameBoard.getBoard()[2] === getActivePlayer().marker && GameBoard.getBoard()[4] === getActivePlayer().marker && GameBoard.getBoard()[6] === getActivePlayer().marker)
        ) {
            getActivePlayer().increaseScore();
            gameStatus = `${getActivePlayer().name} WINS!!!`;
        } else if (!GameBoard.getBoard().includes(0) && winningPlayer == '') {
            gameStatus = "It's a TIE!!!";
        }

    }

    const playRound = (index) => {
        if (gameStatus !== '') {
            return;
        }

        if (GameBoard.getBoard()[index] !== 0)
            return;

        GameBoard.updateGameBoardArr(index, getActivePlayer().marker);
        updateStatus();
        switchPlayerTurn();
    }

    const replayGame = () => {
        GameBoard.resetGameBoardArr();
        // console.log(`${activePlayer.name} and ${firstPlayer.name}`)
        if (activePlayer.name == firstPlayer.name) {
            // console.log('check')
            switchPlayerTurn();
            firstPlayer = activePlayer;
        }
        firstPlayer = activePlayer;
        gameStatus = '';
    }

    const resetGame = () => {
        replayGame();
        gameContainer.replaceChildren();
        UserLoginHandler();
    }

    const getCurrentScore = (index) => players[index].getScore();

    return {
        playRound, 
        replayGame, 
        resetGame, 
        getActivePlayer,
        getCurrentScore,
        getGameStatus,
    }
}

function ScreenController (playerOne, playerTwo) {
    const game = GameController(CreatePlayer(playerOne, 'X'), CreatePlayer(playerTwo, 'O'));
    const gameContainer = document.querySelector('.game-container');

    function setPlayerTags () {
        const playerNames = document.createElement('div');
        playerNames.classList.add('player-names');

        const playerOneTag = document.createElement('h1');
        playerOneTag.classList.add('player');
        playerOneTag.textContent = `${playerOne}: ${game.getCurrentScore(0)}`;
        playerOneTag.dataset.marker = 'X';
        playerNames.appendChild(playerOneTag);

        const playerTwoTag = document.createElement('h1');
        playerTwoTag.classList.add('player');
        playerTwoTag.textContent = `${playerTwo}: ${game.getCurrentScore(1)}`;
        playerTwoTag.dataset.marker = 'O';
        playerNames.appendChild(playerTwoTag);  
        
        gameContainer.appendChild(playerNames);
    }

    function setPlayerTurn () {
        const playerTags = document.querySelectorAll('.player');
        playerTags.forEach(playerTag => {
            if (playerTag.dataset.marker == game.getActivePlayer().marker) {
                playerTag.classList.add('turn');    
            }
            else {
                playerTag.classList.remove('turn');
            }
        })
    }

    function createBoard () {
        const gameBoard = document.createElement('div');
        gameBoard.classList.add('game-board');

        for (let i = 0; i < GameBoard.getBoard().length; i++) {
            const cell = document.createElement('div')
            cell.classList.add('cell');
            cell.dataset.index = i;
            if (GameBoard.getBoard()[i] == 0) {
                cell.textContent = '';
            } else {
                cell.textContent = GameBoard.getBoard()[i];
            }
            gameBoard.appendChild(cell);
        }

        gameContainer.appendChild(gameBoard);
    }

    function resetGameBoard () {
        const boardCells = document.querySelectorAll('.cell');
        boardCells.forEach(cell => cell.textContent = '');
    }

    function addBtn () {
        const btnContainer = document.createElement('div');
        btnContainer.classList.add('btn-container')

        const resetBtn = document.createElement('button');
        resetBtn.classList.add('btn', 'reset-btn');
        resetBtn.textContent = "RESET";
        btnContainer.appendChild(resetBtn);

        const replayBtn = document.createElement('button');
        replayBtn.classList.add('btn', 'replay-btn');
        replayBtn.textContent = 'REPLAY';
        btnContainer.appendChild(replayBtn);

        gameContainer.appendChild(btnContainer);
    }

    function createStatusDialog () {
        const statusDialog = document.createElement('dialog');
        statusDialog.classList.add('game-status');

        gameContainer.appendChild(statusDialog);
    }

    function checkStatus() {
        const statusDialog = document.querySelector('.game-status');
        const playerTags = document.querySelectorAll('.player');

        if (game.getGameStatus() !== '') {
            statusDialog.textContent = game.getGameStatus();
            statusDialog.showModal();
            playerTags[0].textContent = `${playerOne}: ${game.getCurrentScore(0)}`;
            playerTags[1].textContent = `${playerTwo}: ${game.getCurrentScore(1)}`;
        }
    }

    function displayFinalWinner () {
        // const statusDialog = document.querySelector('.game-status');

        if (game.getCurrentScore(0) > game.getCurrentScore(1)) {
            // statusDialog.textContent = `${playerOne} WINS THE GAME!!!`;
            alert(`${playerOne} WINS THE GAME!!!`)
        } else {
            // statusDialog.textContent = `${playerTwo} WINS THE GAME!!!`;
            alert(`${playerTwo} WINS THE GAME!!!`)

        }

        // statusDialog.showModal();
    }

    function startGame () {
        setPlayerTags();
        createBoard();
        addBtn();
        setPlayerTurn();
        createStatusDialog();
        addScreenListeners();
    }

    function addScreenListeners () {
        const gameBoard = document.querySelector('.game-board');
        const replayBtn = document.querySelector('.replay-btn');
        const resetBtn = document.querySelector('.reset-btn');
        const statusDialog = document.querySelector('.game-status');

        gameBoard.addEventListener('click', e => {
            if (!e.target.classList.contains('cell')) 
                return;

            if (e.target.textContent !== '')
                return;

            if (game.getGameStatus() !== '') {
                checkStatus();
                return;
            }

            e.target.textContent = game.getActivePlayer().marker;
            game.playRound(e.target.dataset.index);
            setPlayerTurn();
            checkStatus();
        });

        replayBtn.addEventListener('click', () => {
            game.replayGame();
            setPlayerTurn();
            resetGameBoard();
        });

        resetBtn.addEventListener('click', () => {
            displayFinalWinner();
            game.resetGame();
        });

        statusDialog.addEventListener('click', () => statusDialog.close());
    }

    return {
        startGame,
    }
}

function UserLoginHandler () {
    const loginContainer = document.querySelector('.login-container');

    function createLoginDialog () {
        const loginDialog = document.createElement('dialog');
        loginDialog.classList.add('login-dialog');

        const loginForm = document.createElement('form');
        loginDialog.appendChild(loginForm);

        const loginRows = new Array(3);
        for (let i = 0; i < loginRows.length; i++) {
            loginRows[i] = document.createElement('div');
            loginRows[i].classList.add('form-row');
            loginForm.appendChild(loginRows[i])
        }

        const formLabels = new Array(2);
        for (let i = 0; i < formLabels.length; i++) {
            formLabels[i] = document.createElement('label');
            formLabels[i].setAttribute('for', `player-${i + 1}`);
            formLabels[i].textContent = `Player ${i + 1}:`;
            loginRows[i].appendChild(formLabels[i]);
        }

        const formInputs = new Array(2);
        for (let i = 0; i < formInputs.length; i++) {
            formInputs[i] = document.createElement('input');
            formInputs[i].setAttribute('id', `player-${i + 1}`);
            formInputs[i].setAttribute('name', `player-${i + 1}`);
            formInputs[i].setAttribute('type', `text`);
            formInputs[i].setAttribute('maxlength', `8`);
            loginRows[i].appendChild(formInputs[i]);
        }

        const submitButton = document.createElement('button');
        submitButton.classList.add('submit-button');
        submitButton.textContent = "Submit"
        loginRows[2].appendChild(submitButton);
        loginContainer.appendChild(loginDialog);
    }

    function addStartButton () {
        const startButton = document.createElement('button');
        startButton.classList.add('start-game');
        startButton.textContent = 'Start Game';
        loginContainer.appendChild(startButton);
    }

    function addEventListeners () {
        const startButton = document.querySelector('.start-game');
        const submitButton = document.querySelector('.submit-button');
        const loginDialog = document.querySelector('.login-dialog')
        const playerOne = document.querySelector('#player-1');
        const playerTwo = document.querySelector('#player-2')

        startButton.addEventListener('click', () => {
            loginDialog.showModal();
        });

        submitButton.addEventListener('click', (e) => {
            e.preventDefault();
            loginDialog.close();
            loginContainer.replaceChildren();

            const screenController = ScreenController(playerOne.value, playerTwo.value)
            screenController.startGame();
        })
    }

    addStartButton();
    createLoginDialog();
    addEventListeners();
}

UserLoginHandler();