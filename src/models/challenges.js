import { Firebase, FirebaseRef } from '../lib/firebase';
import initState from '../store/challenges';

export default {
  /**
   *  Initial state
   */
  state: {
    challenges: initState.challenges
  },

  /**
   * Reducers
   */
  reducers: {
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
    }
  },

  /**
   * Effects/Actions
   */
  effects: () => ({
    /**
     * Get challenges
     *
     * @return {Promise}
     */
    getChallenges() {
      if (Firebase === null) return () => new Promise(resolve => resolve());

      return new Promise(resolve =>
        FirebaseRef.child('challenges').on('value', snapshot => {
          const data = snapshot.val() || [];
          this.replacechallenges(data);
          return resolve();
        })
      ).catch(err => {
        throw err.message;
      });
    }
  })
};
