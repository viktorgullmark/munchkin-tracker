import { Component } from '@angular/core';
import { NavController, Events } from 'ionic-angular';

import { GameProvider } from '../../providers/game/game';
import { JoinGamePage } from '../join-game/join-game';
import { NewGamePage } from '../new-game/new-game';

@Component({
  selector: 'page-start',
  templateUrl: 'start.html'
})
export class StartPage {
  isInGame: boolean = false;
  constructor(public events: Events, public navCtrl: NavController, public gameProvider: GameProvider) {
    this.navCtrl.viewDidLeave.subscribe(res => {
      this.isInGame = this.gameProvider.currentGame !== undefined;
    });
  }
  joinExisting() {
    this.navCtrl.push(JoinGamePage, {}).catch(error => {
      console.log(error);
    });
  }
  createNew() {
    this.navCtrl.push(NewGamePage, {}).catch(error => {
      console.log(error);
    });
  }
}
