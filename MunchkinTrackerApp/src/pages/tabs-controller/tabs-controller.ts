import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { StartPage } from '../start/start';
import { CurrentGamePage } from '../current-game/current-game';
import { AboutPage } from '../about/about';
import { GameProvider } from '../../providers/game/game';
import { Events } from 'ionic-angular';

@Component({
  selector: 'page-tabs-controller',
  templateUrl: 'tabs-controller.html'
})
export class TabsControllerPage {
  tab1Root: any = StartPage;
  tab2Root: any = CurrentGamePage;
  tab3Root: any = AboutPage;
  constructor(public events: Events, public navCtrl: NavController, public gameProvider: GameProvider) {
  }
  public onSelected(index: number): void {
    if (index && this.gameProvider.currentGame !== undefined) {
      this.events.publish('TabSelected');
    }
  }
}
