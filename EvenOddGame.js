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
      return [random, this.player1.name]
    } else {
        this.player2.addScore();
        return [random, this.player2.name]
    }
  }
}

class Game {
  constructor() {
    this.round = null;
    this.count = 0;
    this.winner = null;
    this.players = [];
  }

  async createPlayers() {
    const p1 = new Player(await assignPlayer());
    const p2 = new Player(await assignPlayer());
    return [p1, p2];
  }

  async startGame() {
    this.players = await this.createPlayers();
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

const game1 = new Game();
game1.startGame();
