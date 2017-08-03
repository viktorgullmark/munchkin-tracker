import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NavController, NavParams, Tabs } from 'ionic-angular';

import { GameModel } from '../../models/game.model';
import { JoinModel } from '../../models/join.model';
import { PlayerModel } from '../../models/player.model';
import { GameProvider } from '../../providers/game/game';
import { CurrentGamePage } from '../current-game/current-game';

@Component({
  selector: 'page-new-game',
  templateUrl: 'new-game.html',
})
export class NewGamePage {
  createForm: FormGroup;
  constructor(public navCtrl: NavController, public navParams: NavParams, public gameProvider: GameProvider) {
    this.createForm = new FormGroup({
      playerName: new FormControl(''),
      flavorText: new FormControl(''),
      gender: new FormControl('')
    });
  }

  createGame() {
    if (this.gameProvider.currentGame !== undefined) {
      this.gameProvider.leaveGame().then(() => { });
    }
    this.gameProvider.createGame().then(res => {
      // leave old game before entering new
      this.gameProvider.currentGame = undefined;
      let player = {
        name: this.createForm.controls.playerName.value,
        flavor: this.createForm.controls.flavorText.value,
        gender: this.createForm.controls.gender.value,
        level: 1,
        bonus: 1,
        connectionId: ''
      } as PlayerModel;
      this.gameProvider.currentPlayer = player;
      this.gameProvider.currentGame = { code: res.code, players: [] } as GameModel;
      this.gameProvider.enterGame({ player: this.gameProvider.currentPlayer, gameCode: res.code } as JoinModel).then(result => {
        this.gameProvider.currentGame.players = [];
        result.forEach(p => {
          this.gameProvider.currentGame.players.push(
            {
              name: p.name,
              flavor: p.flavor,
              gender: p.gender,
              level: 1,
              bonus: 1,
              connectionId: ''
            } as PlayerModel);
        });
        var t: Tabs = this.navCtrl.parent;
        t.select(1);
      })
    });
  }
}
