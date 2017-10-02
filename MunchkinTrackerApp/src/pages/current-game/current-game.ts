import { Component } from '@angular/core';
import { AlertController, NavController, NavParams, Tabs } from 'ionic-angular';

import { GameProvider } from '../../providers/game/game';
import { PlayerDetailsPage } from '../player-details/player-details';

@Component({
  selector: 'page-current-game',
  templateUrl: 'current-game.html'
})
export class CurrentGamePage {
  gameName: string;
  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public params: NavParams, public gameProvider: GameProvider) {
    this.gameName = params.get('gameName');
    if (this.gameName === undefined) {
      this.gameName = this.gameProvider.currentGame.code;
    }
  }
  ngOnInit() {
    console.log(this.gameProvider.currentGame.players);
  }
  reorderItems(indexes) {
    let element = this.gameProvider.currentGame.players[indexes.from];
    this.gameProvider.currentGame.players.splice(indexes.from, 1);
    this.gameProvider.currentGame.players.splice(indexes.to, 0, element);
  }
  goToCurrentPlayer(player) {
    this.gameProvider.currentPlayer = player;
    this.navCtrl.push(PlayerDetailsPage, {
      'gameCode': this.gameName
    });
  }
  leaveGame() {
    let alert = this.alertCtrl.create({
      title: 'Confirm leave',
      message: 'Are you sure you want to leave?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Leave',
          handler: () => {
            this.gameProvider.leaveGame().then(res => {
              var t: Tabs = this.navCtrl.parent;
              t.select(0);
              this.gameProvider.currentGame = undefined;
            });
          }
        }
      ]
    });
    alert.present();
  }
}
