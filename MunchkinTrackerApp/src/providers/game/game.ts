import { GamesPage } from '../../pages/games/games';
import { PlayerModel } from '../../models/player.model';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { GameModel } from '../../models/game.model';
import { InterceptorProvider } from '../interceptor/interceptor';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { SignalR, ISignalRConnection, BroadcastEventListener } from 'ng2-signalr';
import { AlertController } from 'ionic-angular';

@Injectable()
export class GameProvider {

  currentGame: GameModel;
  currentPlayer: PlayerModel;
  private url: string;
  private connection: ISignalRConnection;

  constructor(private interceptorProvider: InterceptorProvider, private signalR: SignalR, private alertCtrl: AlertController) {
    this.url = 'api/Games/';
    this.signalR.connect().then((c) => {
      // save connection locally
      this.connection = c;

      let onPlayerJoined$ = new BroadcastEventListener<PlayerModel>('PlayerJoined');
      let onPlayerLeft$ = new BroadcastEventListener<PlayerModel>('PlayerLeft');
      let onErrorReceived$ = new BroadcastEventListener<string>('ErrorMessage');

      c.listen(onPlayerJoined$);
      c.listen(onPlayerLeft$);
      c.listen(onErrorReceived$);

      onPlayerJoined$.subscribe((player: PlayerModel) => {
        this.currentGame.players.push(player);
        console.log(this.currentGame.players);
        console.log(player.name + " joined");
      });
      onPlayerLeft$.subscribe((player: PlayerModel) => {
        this.currentGame.players = this.currentGame.players.filter(item => item.name !== player.name);
      });
      onErrorReceived$.subscribe((message: string) => {
        console.log(message);
        let alert = this.alertCtrl.create({
          title: 'Error',
          subTitle: message,
          buttons: ['Dismiss']
        });
        alert.present();
      });
    });
  }

  public createGame() {
    return this.connection.invoke('CreateGame').then((data) => {
      return data;
    }).catch(error => console.log(error));
  }

  public enterGame(model) {
    return this.connection.invoke('JoinGame', model).then((data) => {
      return data;
    }).catch(error => console.log(error));
  }

  public leaveGame() {
    let model = { gameCode: this.currentGame.code, player: this.currentPlayer };
    return this.connection.invoke('LeaveGame', model).then((data) => {
    }).catch(error => console.log(error));
  }
}
