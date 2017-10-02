import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NavController, AlertController, NavParams, Tabs } from 'ionic-angular';

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
  submitAttempt: boolean = false;
  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public navParams: NavParams, public gameProvider: GameProvider) {
    this.createForm = new FormGroup({
      playerName: new FormControl('', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(20)]),
      flavorText: new FormControl('', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(20)]),
      gender: new FormControl('', Validators.required)
    });
  }

  createGame() {
    this.submitAttempt = true;
    if (!this.createForm.valid) {
      return;
    }
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
        bonus: 0,
        connectionId: localStorage.getItem('connectionId')
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
              level: p.level,
              bonus: p.bonus,
              connectionId: p.connectionId
            } as PlayerModel);
        });
        var t: Tabs = this.navCtrl.parent;
        t.select(1);
      })
    });
  }
}
