import { Component, OnInit, inject } from '@angular/core';
import { GuessResult } from '../../interfaces/guess-result';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrl: './game.component.css',
})
export class GameComponent implements OnInit{
  maxTries: number = 10;
  secretCode: number[] = [];
  guesses: number[][] = [];
  results: GuessResult[] = [];

  guess: number[] = [0, 0, 0, 0];
  gameOver: boolean = false;
  solved: boolean = false;

  ngOnInit(): void {
      this.generateSecretCode();
  }


  generateSecretCode(): void {
    const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    this.secretCode = [];
    for (let i = 0; i < 4; i++) {
      const randomIndex = Math.floor(Math.random() * digits.length);
      this.secretCode.push(digits[randomIndex]);
      digits.splice(randomIndex, 1);
    }
  }

  checkGuess(guess: number[]) {
    let correctPlace = 0;
    let correctDigit = 0;

    // Check for correct digits in the correct place
    guess.forEach((digit, index) => {
      if (digit === this.secretCode[index]) {
        correctPlace++;
      } else if (this.secretCode.includes(digit)) {
        correctDigit++;
      }
    });

    this.guesses.push([...guess]);
    this.results.push({ correctDigitPlace: correctPlace, correctDigit });

    this.solved =  correctPlace === 4;
    this.gameOver = this.solved || this.guesses.length >= this.maxTries;
  }


  resetGame(): void {
    this.secretCode = [];
    this.guesses = [];
    this.results = [];
    this.guess = [0, 0, 0, 0];
    this.gameOver = false;
    this.solved = false;
    this.generateSecretCode();
  }


  getRange(from: number, to: number): number[] {
    return Array.from({ length: to - from + 1 }, (_, i) => from + i);
  }

}
