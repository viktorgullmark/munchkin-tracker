import { Component } from '@angular/core';
import { AlertController, NavController, NavParams } from 'ionic-angular';

import { GameProvider } from '../../providers/game/game';

@Component({
  selector: 'page-player-details',
  templateUrl: 'player-details.html'
})
export class PlayerDetailsPage {
  gameCode: string;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public params: NavParams, private gameProvider: GameProvider) {
    this.gameCode = params.get('gameCode');
  }

  ngOnInit() {
    this.gameProvider.updatePreviousNext();
  }

  changeLevel(value) {
    let player = this.gameProvider.currentPlayer;
    player.level = value;
    let model = { player: player, gameCode: this.gameCode };
    this.gameProvider.updatePlayer(model).then(res => {});
  }

  changeBonus(value) {
    let player = this.gameProvider.currentPlayer;
    player.bonus = value;
    let model = { player: player, gameCode: this.gameCode };
    this.gameProvider.updatePlayer(model).then(res => {});
  }

  goToPrevious() {
    this.gameProvider.currentPlayer = this.gameProvider.previousPlayer;
    this.gameProvider.updatePreviousNext();
  }

  goToNext() {
    this.gameProvider.currentPlayer = this.gameProvider.nextPlayer;
    this.gameProvider.updatePreviousNext();
  }
}
