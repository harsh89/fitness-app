import { errorMessages } from '../constants/messages';
import { Firebase, FirebaseRef } from '../lib/firebase';

export default {
  state: {}, // initial state

  /**
   * Reducers
   */
  reducers: {
  },

  /**
   * Effects/Actions
   */
  effects: dispatch => ({
    /**
     * Login to Firebase with Email/Password
     *
     * @param {obj} formData - data from form
     * @return {Promise}
     */
    submitReminder(formData) {
      console.log(formData);
      const { startHr, startMin, startAmPm, endHr, endMin, endAmPm, reminderInterval, target } = formData;
      var newPostKey = FirebaseRef.child('drinkingWaterReminder').push().key;
      var updates = {};
  updates['/drinkingWaterReminder/' + newPostKey] = {startHr,
    endHr,
    reminderInterval,
    target,
    totalIntervalFinished: 0,
    totalIntake: 0,
    reminderCreationDate: Firebase.database.ServerValue.TIMESTAMP};

    return FirebaseRef.update(updates)

  //     return new Promise(async (resolve, reject) => {
  //       // Validation rules
  //       if (!startHr || startHr.length === 0 || !startHr || startMin.length === 0 || !startAmPm || startAmPm.length === 0) return reject({ message: errorMessages.missingStartTime });
  //       if (!endHr || endHr.length === 0 || !endHr || endMin.length === 0 || !endAmPm || endAmPm.length === 0) return reject({ message: errorMessages.missingEndTime });
  //       if (!reminderInterval || reminderInterval.length === 0) return reject({ message: errorMessages.missingReminderInterval });
  //       if (!target || target.length === 0) return reject({ message: errorMessages.missingTarget });
  //       var newPostKey = firebase.database().ref().child('drinkingWaterReminder').push().key;

  // // Write the new post's data simultaneously in the posts list and the user's post list.
  // var updates = {};
  // updates['/drinkingWaterReminder/' + newPostKey] = {startHr,
  //   endHr,
  //   reminderInterval,
  //   target,
  //   totalIntervalFinished: 0,
  //   totalIntake: 0,
  //   reminderCreationDate: Firebase.database.ServerValue.TIMESTAMP};

  // return firebase.database().ref().update(updates);

  // return firebase.database().ref().update(updates);
  //       // FirebaseRef.child('posts').push().key
  //       return FirebaseRef.child('drinkingWaterReminder').push().key
  //         .then((res) => {
  //           // Send user details to Firebase database
  //           if (res && res.user.uid) {
  //             FirebaseRef.child(`drinkingWaterReminder/${res}`).set({
  //               startHr,
  //         endHr,
  //         reminderInterval,
  //         target,
  //         totalIntervalFinished: 0,
  //         totalIntake: 0,
  //         reminderCreationDate: Firebase.database.ServerValue.TIMESTAMP
  //             }).then(resolve);
  //           }
  //         }).catch(reject);
  //     }).catch((err) => { throw err.message; });
    },

    /**
     * Reset Password
     *
     * @param {obj} formData - data from form
     * @return {Promise}
     */
    resetPassword(formData) {
      const { email } = formData;

      return new Promise(async (resolve, reject) => {
        // Validation rules
        if (!email) return reject({ message: errorMessages.missingEmail });

        // Go to Firebase
        return Firebase.auth().sendPasswordResetEmail(email)
          .then(() => {
            this.resetUser();
            resolve();
          }).catch(reject);
      }).catch((err) => { throw err.message; });
    },

    /**
     * Update Profile
     *
     * @param {obj} formData - data from form
     * @return {Promise}
     */
    updateProfile(formData) {
      const {
        email, password, password2, firstName, lastName, changeEmail, changePassword,
      } = formData;

      return new Promise(async (resolve, reject) => {
        // Are they a user?
        const UID = await Firebase.auth().currentUser.uid;
        if (!UID) return reject({ message: errorMessages.memberNotAuthd });

        // Validation rules
        if (!firstName) return reject({ message: errorMessages.missingFirstName });
        if (!lastName) return reject({ message: errorMessages.missingLastName });
        if (changeEmail) {
          if (!email) return reject({ message: errorMessages.missingEmail });
        }
        if (changePassword) {
          if (!password) return reject({ message: errorMessages.missingPassword });
          if (!password2) return reject({ message: errorMessages.missingPassword });
          if (password !== password2) return reject({ message: errorMessages.passwordsDontMatch });
        }

        // Go to Firebase
        return FirebaseRef.child(`users/${UID}`).update({ firstName, lastName })
          .then(async () => {
            // Update Email address
            if (changeEmail) {
              await Firebase.auth().currentUser.updateEmail(email).catch(reject);
            }

            // Change the Password
            if (changePassword) {
              await Firebase.auth().currentUser.updatePassword(password).catch(reject);
            }

            return resolve();
          }).catch(reject);
      }).catch((err) => { throw err.message; });
    },

    /**
     * Logout
     *
     * @returns {Promise}
     */
    logout() {
      return new Promise((resolve, reject) => Firebase.auth().signOut()
        .then(() => {
          this.resetUser();
          resolve();
        }).catch(reject)).catch((err) => { throw err.message; });
    },

  }),
};
