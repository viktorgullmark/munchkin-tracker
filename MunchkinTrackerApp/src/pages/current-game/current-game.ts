import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { PlayerDetailsPage } from '../player-details/player-details';
import { GameProvider } from '../../providers/game/game';
import { GameModel } from '../../models/game.model';

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
    this.navCtrl.push(PlayerDetailsPage, {
        'player': player
    });
  }
}
