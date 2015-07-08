/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { PropTypes } from 'react';
import styles from './TagsPage.scss';
import PostsPage from '../PostsPage/PostsPage.js';
import DataStore from '../../store/DataStore.js';

class TagsPage {

  render() {
    return (<section className="posts">
      <h1>Posts tagged with "{this.props.params.tags}"</h1>
      <PostsPage posts={DataStore.getData('blogIndex').filter(post => {
        return post.tags.find(tag => {
          return this.props.params.tags.split(',').includes(tag)
        })
      })} />
    </section>);
  }

}

export default TagsPage;
