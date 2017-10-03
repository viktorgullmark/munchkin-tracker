import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { BroadcastEventListener, ISignalRConnection, SignalR, ConnectionStatus } from 'ng2-signalr';

import { GameModel } from '../../models/game.model';
import { PlayerModel } from '../../models/player.model';

@Injectable()
export class GameProvider {

  status: ConnectionStatus;
  currentGame: GameModel;
  currentPlayer: PlayerModel;
  previousPlayer: PlayerModel;
  nextPlayer: PlayerModel;
  private url: string;
  private connection: ISignalRConnection;
  public isSyncing = false;

  constructor(private signalR: SignalR, private alertCtrl: AlertController) {
    this.url = 'api/Games/';
    let conx = this.signalR.createConnection();
    conx.status.subscribe((s) => this.status = s);
    conx.start().then((c) => {
      // open initial connection to signalr and save in this scope
      this.connection = c;
      localStorage.setItem('connectionId', this.connection.id);

      setInterval(() => {
        if (this.status.value !== 1) {
          this.resyncGame();
        }
      }, 5000);

      // register events to listen to
      let onPlayerJoined$ = new BroadcastEventListener<PlayerModel>('PlayerJoined');
      let onPlayerLeft$ = new BroadcastEventListener<PlayerModel>('PlayerLeft');
      let onLevelChanged$ = new BroadcastEventListener<PlayerModel>('LevelChanged');
      let onErrorReceived$ = new BroadcastEventListener<string>('ErrorMessage');
      let onDisconnected$ = new BroadcastEventListener<string>('Disconnected');

      c.listen(onPlayerJoined$);
      c.listen(onPlayerLeft$);
      c.listen(onLevelChanged$);
      c.listen(onErrorReceived$);
      c.listen(onDisconnected$);

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

  public resyncGame() {
    this.isSyncing = true;
    this.connection.start().then(() => {
      const oldId = localStorage.getItem('connectionId')
      if (this.connection.id !== oldId) {
        this.rejoinGame(oldId).then(() => {
          setTimeout(() => {
            this.isSyncing = false;
          }, 500);
          return;
        })
      }
      setTimeout(() => {
        this.isSyncing = false;
      }, 500);
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

  public rejoinGame(connectionId) {
    return this.connection.invoke('RejoinGame', this.currentGame.code, connectionId).then((data) => {
      this.currentGame.players = [];
      data.forEach(p => {
        this.currentGame.players.push(
          {
            name: p.name,
            flavor: p.flavor,
            gender: p.gender,
            level: p.level,
            bonus: p.bonus,
            connectionId: ''
          } as PlayerModel);
      });
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
