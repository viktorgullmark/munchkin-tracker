import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { BroadcastEventListener, ISignalRConnection, SignalR } from 'ng2-signalr';

import { GameModel } from '../../models/game.model';
import { PlayerModel } from '../../models/player.model';
import { InterceptorProvider } from '../interceptor/interceptor';

@Injectable()
export class GameProvider {

  currentGame: GameModel;
  currentPlayer: PlayerModel;
  previousPlayer: PlayerModel;
  nextPlayer: PlayerModel;
  private url: string;
  private connection: ISignalRConnection;

  constructor(private interceptorProvider: InterceptorProvider, private signalR: SignalR, private alertCtrl: AlertController) {
    this.url = 'api/Games/';
    this.signalR.connect().then((c) => {
      // open initial connection to signalr and save in this scope
      this.connection = c;

      // register events to listen to
      let onPlayerJoined$ = new BroadcastEventListener<PlayerModel>('PlayerJoined');
      let onPlayerLeft$ = new BroadcastEventListener<PlayerModel>('PlayerLeft');
      let onLevelChanged$ = new BroadcastEventListener<PlayerModel>('LevelChanged');
      let onErrorReceived$ = new BroadcastEventListener<string>('ErrorMessage');

      c.listen(onPlayerJoined$);
      c.listen(onPlayerLeft$);
      c.listen(onLevelChanged$);
      c.listen(onErrorReceived$);

      onPlayerJoined$.subscribe((player: PlayerModel) => {
        this.currentGame.players.push(player);
        this.updatePreviousNext();
      });
      onPlayerLeft$.subscribe((player: PlayerModel) => {
        this.currentGame.players = this.currentGame.players.filter(item => item.name !== player.name);
        if (this.currentPlayer.name === player.name) {
          this.currentPlayer = this.currentGame.players[0];
        } 
        this.updatePreviousNext();
      });
      onLevelChanged$.subscribe((player: PlayerModel) => {
        // update playerinfo with new score
        let foundPlayer = this.currentGame.players.find(x => x.name == player.name);
        let index = this.currentGame.players.indexOf(foundPlayer);
        if (index !== -1) {
          this.currentGame.players[index] = player;
        }
        if (this.currentPlayer.name == player.name) {
          this.currentPlayer = player;
        }
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
  public updatePreviousNext() {
    if (this.currentGame.players[this.currentGame.players.indexOf(this.currentPlayer) - 1] !== undefined) {
      this.previousPlayer = this.currentGame.players[this.currentGame.players.indexOf(this.currentPlayer) - 1];
    } else if (this.currentGame.players.length > 1) {
      this.previousPlayer = this.currentGame.players[this.currentGame.players.length - 1];
    }
    if (this.currentGame.players[this.currentGame.players.indexOf(this.currentPlayer) + 1] !== undefined) {
      this.nextPlayer = this.currentGame.players[this.currentGame.players.indexOf(this.currentPlayer) + 1];
    } else if (this.currentGame.players.length > 1) {
      this.nextPlayer = this.currentGame.players[0];
    }
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
    return this.connection.invoke('LeaveGame', this.currentGame.code).then((data) => {
    }).catch(error => console.log(error));
  }

  public kickPlayer(player, gameCode) {
    return this.connection.invoke('KickPlayer', player, gameCode).then((data) => {
    }).catch(error => console.log(error));
  }

  public updatePlayer(model) {
    return this.connection.invoke('UpdatePlayer', model).then((data) => {
      return data;
    }).catch(error => console.log(error));
  }
}
