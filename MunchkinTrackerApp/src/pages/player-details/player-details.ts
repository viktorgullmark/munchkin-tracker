import { PlayerModel } from '../../models/player.model';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-player-details',
  templateUrl: 'player-details.html'
})
export class PlayerDetailsPage {
  player: PlayerModel;
  constructor(public navCtrl: NavController, public params: NavParams) {
    this.player = params.get('player');
    console.log(this.player);
  }
  
}
