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
          articleDesc: item.articleDesc,
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

      return new Promise(resolve =>
        FirebaseRef.child('articles').on('value', snapshot => {
          // let data = snapshot.val() || [];
          console.log('key: ' + snapshot.key);
          console.log(data);

          let data = [];

          snapshot.forEach(function(childSnapshot) {
            var childKey = childSnapshot.key;
            var childData = childSnapshot.val();

            console.log('key: ' + childKey);
            console.log('key: ' + childData);

            let articleObj = childData;

            articleObj.id = childKey;
            articleObj.datePosted =
              new Date(articleObj.datePosted).toDateString() +
              ' ' +
              new Date(articleObj.datePosted).toLocaleTimeString();

            data.push(articleObj);
          });
          console.log('articles data: ');
          console.log(data);

          this.replaceArticles(data);
          return resolve();
        })
      ).catch(err => {
        throw err.message;
      });
    },

    getComments(id) {
      if (Firebase === null) return () => new Promise(resolve => resolve());

      console.log('load comments for id : ' + id);

      return new Promise(resolve =>
        FirebaseRef.child('discussions')
          .orderByChild('threadId')
          .equalTo(id)
          .on('value', snapshot => {
            // let data = snapshot.val() || [];
            console.log('key: ' + snapshot.key);
            console.log(data);

            let data = [];

            snapshot.forEach(function(childSnapshot) {
              var childKey = childSnapshot.key;
              var childData = childSnapshot.val();

              console.log('key: ' + childKey);
              console.log('key: ' + childData);

              let commentObj = childData;

              commentObj.id = childKey;
              commentObj.datePosted =
                new Date(commentObj.datePosted).toDateString() +
                ' ' +
                new Date(commentObj.datePosted).toLocaleTimeString();

              data.push(commentObj);
            });

            this.replaceComments(data);
            return resolve();
          })
      ).catch(err => {
        throw err.message;
      });
    },

    postComment(params) {
      if (Firebase === null) return () => new Promise(resolve => resolve());
      console.log(params);

      console.log('post comments for id : ' + params.threadId);

      var newPostKey = FirebaseRef.child('discussions').push().key;
      var updates = {};
      updates['/discussions/' + newPostKey] = params;

      return FirebaseRef.update(updates);
    },
    postArticle(params) {
      if (Firebase === null) return () => new Promise(resolve => resolve());
      console.log(params);

      console.log('post comments for id : ' + params.threadId);

      var newPostKey = FirebaseRef.child('articles').push().key;
      var updates = {};
      updates['/articles/' + newPostKey] = params;

      return FirebaseRef.update(updates);
    }
  })
};
