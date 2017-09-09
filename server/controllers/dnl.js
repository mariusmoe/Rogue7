const Gamedig = require('gamedig'),
      msg = require('../libs/responseMessage');




exports.getServerData = (req, res, next) => {
  Gamedig.query({
      type: 'arkse',
      host: '173.212.225.7',
      port: '27015',
  }).then((state) => {
      res.status(200).send(state);
  }).catch((error) => {
    if (error && error == "UDP Watchdog Timeout") {
      const m = msg.append('DNL_SERVER_TIMED_OUT');
      m.timeout = true;
      res.status(504).send(m);
      return;
    }
    const m = msg.append('DNL_SERVER_TIMED_OUT');
    m.offline = true;
    res.status(504).send(m);
  });
};
