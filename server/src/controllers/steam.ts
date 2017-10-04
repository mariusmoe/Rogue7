import { Request, Response, NextFunction } from 'express';
import { msg } from '../libs/responseMessage';
import * as Gamedig from 'gamedig';


export class SteamController {

  /**
   * Queries the DNL steam server for game data.
   * @param  {Request}      req  request
   * @param  {Response}     res  response
   * @param  {NextFunction} next next
   * @return {Response}          server response: the game data object
   */
  public static getDNLData(req: Request, res: Response, next: NextFunction) {
    const server: server = {
      host: '173.212.225.7',
      port: '27015',
    };
    return SteamController.getServerData(server, req, res, next);
  }

  /**
   * Queries the ARK steam server for game data.
   * @param  {Request}      req  request
   * @param  {Response}     res  response
   * @param  {NextFunction} next next
   * @return {Response}          server response: the game data object
   */
  public static getARKData(req: Request, res: Response, next: NextFunction) {
    const server: server = {
      host: '173.212.225.7',
      port: '27015',
    };
    return SteamController.getServerData(server, req, res, next);
  }



  /**
   * Helper function. See getDNLData
   */
  private static getServerData(server: server, req: Request, res: Response, next: NextFunction) {
    Gamedig.query({
        type: 'arkse',
        host: '173.212.225.7',
        port: '27015',
    }).then((state: GameDig) => {
        return res.status(200).send(state);
    }).catch((error: string) => {
      if (error && error === 'UDP Watchdog Timeout') {
        const m = <any>msg('DNL_SERVER_TIMED_OUT');
        m.timeout = true;
        return res.status(504).send(m);
      }
      const m = <any>msg('DNL_SERVER_TIMED_OUT');
      m.offline = true;
      return res.status(504).send(m);
    });
   }
}

interface server {
  host: string;
  port: string;
}


export interface GameDig {
    bots: [any];
    map: string;
    maxplayers: number;
    name: string;
    password: boolean;
    players: [GameDigPlayer];
    query?: GameDigQuery;
    raw?: GameDigRaw;
    lastUpdate?: Date; // Added separately from GameDig
}





interface GameDigPlayer {
  name: string;
  score: number;
  time: number;
  timeDate?: Date; // Added separately from GameDig
}

interface GameDigQuery {
  address: string;
  host: string;
  port: number;
  port_query: number;
  pretty: string;
  type: string;
}

interface GameDigRaw {
  environment: string;
  folder: string;
  game: string;
  gameid: string;
  listentype: string;
  numbots: number;
  numplayers: number;
  port: number;
  protocol: number;
  rules: GameDigRules;
  secure: number;
  steamappid: number;
  steamid: string;
  tags: string; // commaseparated tags within the string
  version: string; // a.b.c.d
}

interface GameDigRules {
  BuildId_s: string;  // number string
  CUSTOMSERVERNAME_s: string;
  DayTime_s: string;
  GameMode_s: string;
  MATCHTIMEOUT_f: string;  // number string
  MINORBUILDID_s: string;  // number string
  ModId_l: string; // number string
  NUMOPENPUBCONN: string; // number string
  Networking_i: string; // number string
  OFFICIALSERVER_i: string; // boolean-number string
  OWNINGID: string; // number string
  OWNINGNAME: string; // number string
  P2PADDR: string; // number string
  P2PPORT: string; // number string
  SEARCHKEYWORDS_s: string;
  SERVERUSESBATTLEYE_b: string; // boolean string
  SESSIONFLAGS: string; // "683", so far.
  ServerPassword_b: string; // boolean string
}
