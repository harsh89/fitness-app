import { Firebase, FirebaseRef } from '../lib/firebase';
import initState from '../store/articles';
// import console = require('console');

export default {
  /**
   *  Initial state
   */
  state: {
    articles: initState.articles
  },

  /**
   * Reducers
   */
  reducers: {
    replaceArticles(state, payload) {
      let articles = [];
      // Pick out the props I need
      if (payload && typeof payload === 'object') {
        articles = payload.map(item => ({
          id: item.id,
          title: item.title,
          description: item.description,
          active: item.active,
          postedDate: item.postedDate,
          postedBy: item.postedBy
        }));
      }

      return { ...state, articles };
    },

    replaceComments(state, payload) {
      let comments = [];
      // Pick out the props I need
      if (payload && typeof payload === 'object') {
        comments = payload.map(item => ({
          id: item.id,
          threadId: item.threadId,
          postedBy: item.postedBy,
          commentData: item.commentData,
          datePosted: item.datePosted
        }));
      }

      return { ...state, comments };
    }
  },

  /**
   * Effects/Actions
   */
  effects: () => ({
    /**
     * Get articles
     *
     * @return {Promise}
     */
    getArticles() {
      if (Firebase === null) return () => new Promise(resolve => resolve());

      console.log('load articles');

      return new Promise(resolve =>
        FirebaseRef.child('articles').on('value', snapshot => {
          console.log('load articles inside');

          const data = snapshot.val() || [];
          console.log('article data: ' + data);
          this.replaceArticles(data);
          return resolve();
        })
      ).catch(err => {
        throw err.message;
      });
    },

    getComments() {
      if (Firebase === null) return () => new Promise(resolve => resolve());

      console.log('load comments');

      return new Promise(resolve =>
        FirebaseRef.child('discussions').on('value', snapshot => {
          console.log('load comments inside');

          const data = snapshot.val() || [];
          console.log('comments data: ' + data);
          this.replaceComments(data);
          return resolve();
        })
      ).catch(err => {
        throw err.message;
      });
    }
  })
};
