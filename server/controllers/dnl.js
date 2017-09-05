const status = require('../status'),
      Gamedig = require('gamedig');


exports.getServerData = (req, res, next) => {
  Gamedig.query({
      type: 'arkse',
      host: '173.212.225.7',
      port: '27015',
  }).then((state) => {
      res.status(200).send({message: status.DNL_SERVER_ONLINE.message, status: status.DNL_SERVER_ONLINE.code, serverState: state});
  }).catch((error) => {
    if (error && error == "UDP Watchdog Timeout") {
      res.status(200).send({message: status.DNL_SERVER_TIMED_OUT.message, status: status.DNL_SERVER_TIMED_OUT.code, timeout: true });
      return;
    }
    console.log('DNL server error: ', error);
    res.status(200).send({message: status.DNL_SERVER_OFFLINE.message, status: status.DNL_SERVER_OFFLINE.code, offline: true });
  });
};
