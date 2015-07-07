import React, { PropTypes } from 'react/addons';
import {Link} from 'react-router';
import moment from 'moment';

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
        var m = moment(new Date(post.date));
        var time = post.date ? <time dateTime={m.format('YYYY-MM-DD')}>{m.format('YYYY-MM-DD')}</time> : undefined;
        return (<div className="post" key={post.slug}>
          <h2><Link to="data" params={{id: post.slug}}>{post.title}</Link></h2>
          {time}
        </div>);
      })}</section>);
  }

}

export default PostsPage;