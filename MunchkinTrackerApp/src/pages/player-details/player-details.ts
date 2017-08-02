import { JoinModel } from '../../models/join.model';
import { GameProvider } from '../../providers/game/game';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { PlayerModel } from '../../models/player.model';

@Component({
  selector: 'page-player-details',
  templateUrl: 'player-details.html'
})
export class PlayerDetailsPage {
  gameCode: string;
  constructor(public navCtrl: NavController, public params: NavParams, private gameProvider: GameProvider) {
    this.gameCode = params.get('gameCode');
  }

  changeLevel(value) {
    this.gameProvider.currentPlayer.level = value;
    let model = { player: this.gameProvider.currentPlayer, gameCode: this.gameCode };
    this.gameProvider.updatePlayer(model).then(res => {});
  }

  changeBonus(value) {
    this.gameProvider.currentPlayer.bonus = value;
    let model = { player: this.gameProvider.currentPlayer, gameCode: this.gameCode };
    this.gameProvider.updatePlayer(model).then(res => {});
  }
}
