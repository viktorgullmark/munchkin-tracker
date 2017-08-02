import { PlayerModel } from './player.model';

export interface GameModel {
    code: string;
    players: PlayerModel[];
}
