import { Firebase, FirebaseRef } from '../lib/firebase';
import initState from '../store/challenges';

export default {
  /**
   *  Initial state
   */
  state: {
    challenges: initState.challenges,
    meals: initState.meals,
  },

  /**
   * Reducers
   */
  reducers: {
    replaceMeals(state, payload) {
      return {
        ...state,
        meals: payload,
      };
    },
    replacechallenges(state, payload) {
      let challenges = [];
      // Pick out the props I need
      if (payload && typeof payload === 'object') {
        challenges = payload.map(item => ({
          id: item.id,
          title: item.title,
          desc: item.desc,
          image: item.image,
          rules: item.rules,
          video: item.video
        }));
      }

      return { ...state, challenges };
    },
  },

  /**
   * Effects/Actions
   */
  effects: () => ({
    /**
     * Get Meals
     *
     * @return {Promise}
     */
    getMeals() {
      if (Firebase === null) return () => new Promise(resolve => resolve());

      return new Promise((resolve, reject) => FirebaseRef.child('meals').once('value')
        .then((snapshot) => {
          const data = snapshot.val() || [];
          this.replaceMeals(data);
          return resolve();
        }).catch(reject)).catch((err) => { throw err.message; });
    },

    /**
      * Get challenges
      *
     * @return {Promise}
      */
    getChallenges() {
      if (Firebase === null) return () => new Promise(resolve => resolve());

      return new Promise(resolve => FirebaseRef.child('challenges')
        .on('value', (snapshot) => {
          const data = snapshot.val() || [];
          this.replacechallenges(data);
          return resolve();
        })).catch((err) => { throw err.message; });
    },
  }),
};
