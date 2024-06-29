import { Component, OnInit, inject } from '@angular/core';
import { GuessResult } from '../../interfaces/guess-result';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrl: './game.component.css',
})
export class GameComponent implements OnInit {
  maxTries: number = 10;
  numberOfDigits: number = 4;
  secretCode: number[] = [];
  guesses: number[][] = [];
  results: GuessResult[] = [];

  guess: number[] = [];
  gameOver: boolean = false;
  solved: boolean = false;
  elapsedTime: number = 0;
  timerSubscription: Subscription | undefined;
  showOverlay:boolean=false;

  ngOnInit(): void {
    this.generateSecretCode();
  }

  generateSecretCode(): void {
    const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    this.secretCode = [];
    for (let i = 0; i < this.numberOfDigits; i++) {
      const randomIndex = Math.floor(Math.random() * digits.length);
      this.secretCode.push(digits[randomIndex]);
      digits.splice(randomIndex, 1);
    }
    this.startTimer();
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

    this.solved = correctPlace === 4;
    this.gameOver = this.solved || this.guesses.length >= this.maxTries;
    if(this.gameOver){
      this.showOverlay=true;
      this.stopTimer();
    }
  }

  resetGame(): void {
    this.secretCode = [];
    this.guesses = [];
    this.results = [];
    this.guess = [];
    this.gameOver = false;
    this.solved = false;
    this.resetTimer();
    this.generateSecretCode();
  }

  getRange(from: number, to: number): number[] {
    return Array.from({ length: to - from + 1 }, (_, i) => from + i);
  }

  ////////// timer ///////////
  startTimer(): void {
    this.timerSubscription = interval(1000).subscribe(() => {
      this.elapsedTime++;
    });
  }

  stopTimer(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  resetTimer(): void {
    this.stopTimer();
    this.elapsedTime = 0;
  }
}
