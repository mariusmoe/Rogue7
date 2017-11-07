import { Request, Response, NextFunction } from 'express';
import { SteamServer, steamserver } from '../models/steam';
import { msg } from '../libs/responseMessage';
import * as Gamedig from 'gamedig';
import { escape } from 'validator';
import { sanitize } from '../libs/sanitizer';


export class SteamController {

  /**
   * Queries a steam server for game data of a given route, declared by the param
   * @param  {Request}      req  request
   * @param  {Response}     res  response
   * @param  {NextFunction} next next
   * @return {Response}          server response: the steam server data object
   */
  public static getSteamServerData(req: Request, res: Response, next: NextFunction) {
    const route      = <string>req.params.route;

    SteamServer.findOne({ route: route }, (err, server) => {
      if (!server) {
        return res.status(422).send(msg('STEAM_SERVER_NOT_FOUND'));
      }

      Gamedig.query(server).then((state: GameDig) => {
          return res.status(200).send(state);
      }).catch((error: string) => {
        if (error && error === 'UDP Watchdog Timeout') {
          const m = <any>msg('STEAM_SERVER_TIMED_OUT');
          m.timeout = true;
          return res.status(504).send(m);
        }
        const m = <any>msg('STEAM_SERVER_TIMED_OUT');
        m.offline = true;
        return res.status(504).send(m);
      });
    });
  }


  /**
   * Gets all steam server routes
   * @param  {Request}      req  request
   * @param  {Response}     res  response
   * @param  {NextFunction} next next
   * @return {Response}          server response: a list of steam servers
   */
 public static getSteamServerList(req: Request, res: Response, next: NextFunction) {

    SteamServer.find({}, (err, serverList) => {
      if (err) { next(err); }
      if (!serverList) {
        return res.status(404).send(msg('STEAM_NO_ROUTES'));
      }
      return res.status(200).send(serverList);
    }).lean();
  }


  /**
   * Creates a new steam server
   * @param  {Request}      req  request
   * @param  {Response}     res  response
   * @param  {NextFunction} next next
   * @return {Response}          server response: the steam server object
   */
  public static createSteamServer(req: Request, res: Response, next: NextFunction) {
    const route      = <string>req.params.route,
          data       = <steamserver>req.body;

    if (!data || !data.title || !data.route || !data.type || !data.host || !data.port) {
      return res.status(422).send(msg('STEAM_DATA_UNPROCESSABLE'));
    }
    const server = new SteamServer({
      title: escape(data.title),
      route: escape(data.route.replace(/\//g, '')).toLowerCase(),
      type: data.type,
      host: data.host,
      port: data.port,
    });
    server.save((err, success) => {
      // if (err) { next(err); }
      if (success) {
        return res.status(200).send(success);
      }
      return res.status(500).send(msg('STEAM_DATA_UNABLE_TO_SAVE'));
    });
  }


    /**
     * Updates a steam server
     * @param  {Request}      req  request
     * @param  {Response}     res  response
     * @param  {NextFunction} next next
     * @return {Response}          server response: the updated steam server object
     */
    public static patchSteamServer(req: Request, res: Response, next: NextFunction) {
      const route      = <string>req.params.route,
            data       = <steamserver>req.body;

      if (!data || !data.title || !data.route || !data.type || !data.host || !data.port) {
        return res.status(422).send(msg('STEAM_DATA_UNPROCESSABLE'));
      }

      // insert ONLY sanitized and escaped data!
      SteamServer.findOneAndUpdate({route: route }, { $set: {
        title: escape(data.title),
        route: escape(data.route.replace(/\//g, '')).toLowerCase(),
        type: data.type,
        host: data.host,
        port: data.port,
      }}, { new: true }, (err, server) => {
        // if (err) { next(err); }
        if (server) {
          return res.status(200).send(server);
        }
        return res.status(500).send(msg('STEAM_DATA_UNABLE_TO_SAVE'));
      });
    }

  /**
   * Deletes a steam server of a given route, declared by the param
   * @param  {Request}      req  request
   * @param  {Response}     res  response
   * @param  {NextFunction} next next
   * @return {Response}          server response: message declaring success or failure
   */
  public static deleteSteamServer(req: Request, res: Response, next: NextFunction) {
    const route = <string>req.params.route;

    SteamServer.remove({route: route}, (err) => {
      // if (err) { next(err); }
      if (err) { return res.status(404).send(msg('STEAM_CONTENT_NOT_FOUND')); }
      return res.status(200).send(msg('STEAM_CONTENT_DELETED'));
    });
  }
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