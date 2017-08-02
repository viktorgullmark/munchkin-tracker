import { JoinModel } from '../../models/join.model';
import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { CurrentGamePage } from '../current-game/current-game';
import { PlayerDetailsPage } from '../player-details/player-details';
import { GameProvider } from '../../providers/game/game';
import { GameModel } from '../../models/game.model';
import { PlayerModel } from '../../models/player.model';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'page-games',
  templateUrl: 'games.html'
})
export class GamesPage {
  isInGame: boolean = false;
  joinForm: FormGroup;
  createForm: FormGroup;
  constructor(public navCtrl: NavController, public gameProvider: GameProvider) {
    this.joinForm = new FormGroup({
      gameCode: new FormControl(''),
      playerName: new FormControl('')
    });
    this.createForm = new FormGroup({
      playerName: new FormControl('')
    });
    this.navCtrl.viewDidLeave.subscribe(res => {
      this.isInGame = this.gameProvider.currentGame !== undefined;
    });
  }
  enterGame() {
    let gameCode = this.joinForm.controls.gameCode.value;
    let player = { name: this.joinForm.controls.playerName.value, level: 1, bonus: 1, connectionId: '' } as PlayerModel;
    this.gameProvider.currentPlayer = player;
    this.gameProvider.currentGame = { code: gameCode, players: [] } as GameModel;
    this.gameProvider.enterGame({ player: player, gameCode: gameCode } as JoinModel).then(res => {
      if (res !== undefined) {
        // map values to player-array on client
        this.gameProvider.currentGame.players = [];
        res.forEach(p => {
          this.gameProvider.currentGame.players.push({ name: p.name, level: 1, bonus: 1, connectionId: '' } as PlayerModel);
        });
        this.navCtrl.push(CurrentGamePage, {
          'gameName': gameCode
        }).catch(error => {
          console.log(error);
        });
      }
    });
  }
  leaveGame() {
    this.gameProvider.leaveGame().then(res => {
      this.gameProvider.currentGame = undefined;
      this.isInGame = false;
    });
  }
  createGame() {

    this.gameProvider.createGame().then(res => {
      let player = { name: this.createForm.controls.playerName.value, level: 1, bonus: 1, connectionId: ''} as PlayerModel;
      this.gameProvider.currentPlayer = player;
      this.gameProvider.currentGame = { code: res.code, players: [] } as GameModel;
      this.gameProvider.enterGame({ player: this.gameProvider.currentPlayer, gameCode: res.code } as JoinModel).then(result => {
        this.gameProvider.currentGame.players = [];
        result.forEach(p => {
          this.gameProvider.currentGame.players.push({ name: p.name, level: 1, bonus: 1, connectionId: '' } as PlayerModel);
        });
        this.navCtrl.push(CurrentGamePage, {
          'gameName': res.code
        });
      })
    });
  }
}
