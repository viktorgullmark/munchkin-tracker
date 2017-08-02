import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { GameProvider } from '../../providers/game/game';
import { PlayerDetailsPage } from '../player-details/player-details';

@Component({
  selector: 'page-current-game',
  templateUrl: 'current-game.html'
})
export class CurrentGamePage {
  gameName: string;
  constructor(public navCtrl: NavController, public params: NavParams, public gameProvider: GameProvider) {
    this.gameName = params.get('gameName');
    if(this.gameName === undefined) {
      this.gameName = this.gameProvider.currentGame.code;
    } 
  }
  ngOnInit(){
    console.log(this.gameProvider.currentGame.players);
  }
  goToCurrentPlayer(player){
    this.gameProvider.currentPlayer = player;
    this.navCtrl.push(PlayerDetailsPage, {
        'gameCode': this.gameName
    });
  }
}
