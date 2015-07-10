import React from 'react/addons';
import moment from 'moment'

import DataElement from '../../helpers/DataElement.js';
import DataStore from '../../store/DataStore.js';
import DataActions from '../../actions/DataActions.js';

class Aside extends DataElement {
  componentWillMount() {
    super.componentWillMount();
    if (!this.state.dataStore.twitter) {
      DataActions.requestData('twitter');
    }
  }
  render() {
    var tweets = <p>loading</p>;

    if (this.state.dataStore.twitter) {
        tweets = this.state.dataStore.twitter.map(tweet => {
          var html = tweet.text;
          tweet.entities.user_mentions.forEach(mention => {
            html = html.replace(`@${mention.screen_name}`, `<a href="https://twitter.com/${mention.screen_name}">@${mention.screen_name}</a>`)
          });

          tweet.entities.urls.forEach(url => {
            html = html.replace(url.url, `<a href="${url.expanded_url}">${url.url}</a>`);
          });

          tweet.entities.hashtags.forEach(hashtag => {
            html = html.replace(`#${hashtag.text}`, `<a href="https://twitter.com/hashtag/${hashtag.text}">#${hashtag.text}</a>`);
          });

          return (<li key={tweet.id_str} className="mb2"><span dangerouslySetInnerHTML={{__html: html}}></span>
            &nbsp;
            <a href={`https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`}>
              {moment(new Date(tweet.created_at)).format('MMM D')}
            </a>
          </li>)
        })
    }

    return (<aside className="mt3 xl-m0 pt2 pb2 col col-12 xl-w15 clearfix">
      <hr className="xl-hide mb3" />

      <div className={'px2 col col-12 md-col-4 xl-col-12'}>
        <h2 className="">Contact me.</h2>
        <form action="send_email" method="post" className="mb2">
          <label htmlFor="email" className="block col-12">Your Email</label>
          <input name="email" id="email" type="text" className="field mb1 block col-12" />
          <label htmlFor="message">Message</label>
          <textarea name="message" id="message" className="field mb2 block col-12"></textarea>
          <input type="submit" className="btn btn-primary" />
        </form>
      </div>

      <div className={'px2 col col-12 md-col-4 xl-col-12'} >
        <h2 className="">Cool things</h2>
        <ul className="clearfix nowrap list-reset m0">
          <li className="col col-12 sm-col-4 md-col-12 pr2 mb2"><a href="https://play.google.com/store/apps/details?id=com.ionicframework.superwinner746062&hl=en">Superwinner</a></li>
        </ul>
      </div>

      <div className={'px2 col col-12 md-col-4 xl-col-12'}>
        <h2 className="">Friends</h2>
        <ul className="clearfix nowrap list-reset m0">
          <li className="col col-12 sm-col-4 md-col-12 pr2 mb2"><a href="http://elizabethdelrosario.com/">Elizabeth Del Rosario</a></li>
          <li className="col col-12 sm-col-4 md-col-12 pr2 mb2"><a href="http://captureddimensions.com/">Captured Dimensions</a></li>
          <li className="col col-12 sm-col-4 md-col-12 pr2 mb2"><a href="http://spencer-hawkins.com/">Spencer Hawkins</a></li>
        </ul>
      </div>

      <div className={'px2 col col-12'}>
        <h2 className="">Tweets <img className="align-middle" style={{height: '2em'}} src="assets/twitter.png" /></h2>
        <ul className="list-reset m0">
          {tweets}
        </ul>
      </div>
    </aside>);
  }
}

export default Aside;