import { PlayerModel } from './player.model';

export interface JoinModel {
    player: PlayerModel;
    gameCode: string;
}
