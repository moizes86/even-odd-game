const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function assignPlayer() {
  return new Promise((resolve, reject) => {
    rl.question("Enter player name (type 'exit' to close): ", (answer) => {
      if (answer.length == 0) {
        assignPlayer();
      } else if (answer == "exit") {
        rl.close();
        reject("process ended");
      } else {
        resolve(answer);
      }
    });
  });
}

class Player {
  constructor(name) {
    this.name = name;
    this.score = 0;
  }

  static async createPlayer() {
    return new Player(await assignPlayer());
  }

  addScore() {
    return this.score++;
  }

  getScore() {
    return this.score;
  }
}

class Round {
  constructor(player1, player2) {
    this.player1 = player1;
    this.player2 = player2;
  }

  getRandomNumber() {
    return Math.round(Math.random() * 18 - 5);
  }

  playRound() {
    const random = this.getRandomNumber();
    if (random % 2 !== 0) {
      this.player1.addScore();
      return [random, this.player1.name];
    } else {
      this.player2.addScore();
      return [random, this.player2.name];
    }
  }
}

class Game {
  constructor(numberOfPlayers) {
    this.round = null;
    this.count = 0;
    this.winner = null;
    this.numberOfPlayers = numberOfPlayers || 2;
    this.players = [];
  }

  async createPlayers() {
    while (this.players.length < this.numberOfPlayers) {
      const newPlayer = await Player.createPlayer();
      this.players.push(newPlayer);
    }
    console.log();
    return;
  }

  async startGame() {
    await this.createPlayers();
    this.round = new Round(...this.players);

    while (!this.winner) {
      const [result, player] = this.round.playRound();
      console.log(`Round #${this.count}, random number is ${result}, ${player} scores!`);
      this.checkWinner();
      this.count++;
    }
    this.announceWinner();
  }

  checkWinner() {
    const p1 = this.players[0];
    const p2 = this.players[1];
    if (p1.getScore() === 3) this.winner = p1;
    if (p2.getScore() === 3) this.winner = p2;
  }

  announceWinner() {
    console.log(`Winner is ${this.winner.name} with ${this.winner.score} points`);
  }
}

class Tournament extends Game {
  constructor(numberOfPlayers) {
    super();
    this.numberOfPlayers = numberOfPlayers;
  }

  pickTwoPlayers() {
    const random1 = Math.round(Math.random() * 6);
    const random2 = Math.round(Math.random() * 6);
    return [this.players[random1], this.players[random2]];
  }

  async startTournament() {
    // await this.createPlayers();
    this.startGame();
    //    while(!this.winner){
    //        const game = new Game(...this.pickTwoPlayers());
    //        this.startGame();
    //        console.log(this.winner)
    //    }
  }
}

// const game1 = new Game();
// game1.startGame();

const tournament = new Tournament(5);
tournament.startTournament();
