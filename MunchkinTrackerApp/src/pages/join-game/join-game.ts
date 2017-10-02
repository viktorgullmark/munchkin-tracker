import { PlayerModel } from '../../models/player.model';
import { GameModel } from '../../models/game.model';
import { JoinModel } from '../../models/join.model';
import { CurrentGamePage } from '../current-game/current-game';
import { GameProvider } from '../../providers/game/game';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NavController, AlertController, NavParams, Tabs } from 'ionic-angular';

@Component({
  selector: 'page-join-game',
  templateUrl: 'join-game.html',
})
export class JoinGamePage {
  joinForm: FormGroup;
  errors: any[];
  submitAttempt: boolean = false;
  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public navParams: NavParams, public gameProvider: GameProvider) {
    this.joinForm = new FormGroup({
      gameCode: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(5)]),
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
  enterGame() {
    this.submitAttempt = true;
    if (!this.joinForm.valid) {
      return;
    }
    if (this.gameProvider.currentGame !== undefined) {
      this.gameProvider.leaveGame().then(() => { });
    }
    let gameCode = this.joinForm.controls.gameCode.value;
    let player = {
      name: this.joinForm.controls.playerName.value,
      flavor: this.joinForm.controls.flavorText.value,
      gender: this.joinForm.controls.gender.value,
      level: 1,
      bonus: 0,
      connectionId: ''
    } as PlayerModel;
    this.gameProvider.enterGame({ player: player, gameCode: gameCode } as JoinModel).then(res => {
      if (res !== undefined) {
        this.gameProvider.currentPlayer = player;
        this.gameProvider.currentGame = { code: gameCode, players: [] } as GameModel;
        // map values to player-array on client
        this.gameProvider.currentGame.players = [];
        res.forEach(p => {
          this.gameProvider.currentGame.players.push({
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
      }
    });

  }
  test(event) {
    console.log(event.value);
  }

}
