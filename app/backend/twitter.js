import Twitter from 'twitter';
import {twitterKeys} from './secrets.js';

var client = new Twitter(twitterKeys);

var params = {screen_name: 'desmond_c_lee'};
var tempTwitterCache = {

};

export function getTimeline() {
  return new Promise((resolve, reject) => {
    if (tempTwitterCache.tweets && (new Date() - tempTwitterCache.resolved <= 60000)) {
      resolve(tempTwitterCache.tweets);
    }
    else {
      client.get('statuses/user_timeline', params, (error, tweets, response) => {
        if (!error) {
          tempTwitterCache.resolved = new Date();
          tempTwitterCache.tweets = tweets;
          resolve(tweets);
        }
        else {
          reject(error);
        }
      });
    }
  });
};

export function twitterMiddleWare(id) {
  return (req, res, next) => {
    getTimeline().then((tweets) => {
      res.send({
        id,
        value: tweets
      });
    }).catch(err => {
      res.send(err);
    })
  }
}