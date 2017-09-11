import { Request, Response, NextFunction } from 'express';
import { msg } from '../libs/responseMessage';
import * as Gamedig from 'gamedig';


export class DNLController {

  /**
   * Queries the DNL steam server for game data.
   * @param  {Request}      req  request
   * @param  {Response}     res  response
   * @param  {NextFunction} next next
   * @return {Response}          server response: the game data object
   */
 public static getServerData(req: Request, res: Response, next: NextFunction) {
   Gamedig.query({
       type: 'arkse',
       host: '173.212.225.7',
       port: '27015',
   }).then((state) => {
       res.status(200).send(state);
   }).catch((error) => {
     if (error && error == "UDP Watchdog Timeout") {
       const m = <any>msg('DNL_SERVER_TIMED_OUT');
       m.timeout = true;
       res.status(504).send(m);
       return;
     }
     const m = <any>msg('DNL_SERVER_TIMED_OUT');
     m.offline = true;
     res.status(504).send(m);
   });
  }


}
