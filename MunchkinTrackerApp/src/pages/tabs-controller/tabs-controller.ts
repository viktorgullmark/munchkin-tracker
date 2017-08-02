import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { GamesPage } from '../games/games';
import { CurrentGamePage } from '../current-game/current-game';
import { SettingsPage } from '../settings/settings';
import { GameProvider } from '../../providers/game/game';

@Component({
  selector: 'page-tabs-controller',
  templateUrl: 'tabs-controller.html'
})
export class TabsControllerPage {
  tab1Root: any = GamesPage;
  tab2Root: any = CurrentGamePage;
  tab3Root: any = SettingsPage;
  constructor(public navCtrl: NavController, public gameProvider: GameProvider) {
  }
}
