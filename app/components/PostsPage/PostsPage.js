import React, { PropTypes } from 'react/addons';
import {Link} from 'react-router';
import moment from 'moment';
import Tags from "../Tags/Tags.js";
/*import styles from './PostsPage.scss';
import withStyles from '../../decorators/withStyles.js';

@withStyles(styles)*/
class PostsPage {
  static propTypes = {
    posts: PropTypes.array.isRequired
  };

  render() {
    return (<section className="posts">
      {this.props.posts.sort((a, b) => {
        // sort posts by date
        return moment(new Date(b.date)).format('X') - moment(new Date(a.date)).format('X')
      }).map(function(post) {
        // generate the datetime
        var time;
        if (post.date) {
          var m = moment(new Date(post.date));
          time = <time className="mr1" dateTime={m.format('YYYY-MM-DD')}>{m.format('YYYY-MM-DD')}</time>;
        }
        return (<div className="post border-bottom" key={post.slug}>
          <h2><Link to="data" params={{id: post.slug}}>{post.title}</Link></h2>
            {time}
            <Tags tags={post.tags} />
        </div>);
      })}</section>);
  }

}

export default PostsPage;