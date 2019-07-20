import { errorMessages } from '../constants/messages';
import { Firebase, FirebaseRef } from '../lib/firebase';
import { Actions } from 'react-native-router-flux';

export default {
  state: {}, // initial state

  /**
   * Reducers
   */
  reducers: {
    setUserLogin(state, payload) {
      const { uid, email, emailVerified } = payload;

      return {
        ...state,
        uid,
        email,
        emailVerified,
      };
    },

    setUserDetails(state, payload) {
      const {
        firstName, lastName, signedUp, role, drinkingWaterReminder
      } = payload;

      return {
        ...state,
        firstName,
        lastName,
        signedUp,
        role,
        drinkingWaterReminder
      };
    },

    resetUser() {
      return {};
    },
  },

  /**
   * Effects/Actions
   */
  effects: dispatch => ({

    submitIntake(formData) {
      console.log(formData);
      let totalIntervalFinished = `${formData.intakeObj.currentInterval.id},`;
      let totalIntake =  Number(formData.drinkingWaterReminder.totalIntake) + Number(formData.intakeObj.intake);
      // return FirebaseRef.child(`users/${formData.uid}/drinkingWaterReminder`).update({ totalIntervalFinished, totalIntake });
      return new Promise(async (resolve, reject) => {
        return FirebaseRef.child(`users/${formData.uid}/drinkingWaterReminder`)
          .update({ totalIntervalFinished, totalIntake })
          .then(() => {
            this.listenForMemberProfileUpdates(dispatch)
            return resolve();
          })
          .catch(reject);
      }).catch(err => {
        throw err.message;
      });
      
    },

    submitReminder(formData) {
      const {
        startHr,
        startMin,
        startAmPm,
        endHr,
        endMin,
        endAmPm,
        reminderInterval,
        target
      } = formData;

      return new Promise(async (resolve, reject) => {
        const UID = await Firebase.auth().currentUser.uid;
        if (!UID) return reject({ message: errorMessages.memberNotAuthd });

        // Validation rules
        if (
          !startHr ||
          startHr.length === 0 ||
          !startHr ||
          startMin.length === 0 ||
          !startAmPm ||
          startAmPm.length === 0
        )
          return reject({ message: errorMessages.missingStartTime });
        if (
          !endHr ||
          endHr.length === 0 ||
          !endHr ||
          endMin.length === 0 ||
          !endAmPm ||
          endAmPm.length === 0
        )
          return reject({ message: errorMessages.missingEndTime });
        if (!reminderInterval || reminderInterval.length === 0)
          return reject({ message: errorMessages.missingReminderInterval });
        if (!target || target.length === 0) return reject({ message: errorMessages.missingTarget });
        const drinkingWaterReminder = {
          startHr,
          startMin,
          startAmPm,
          endHr,
          endMin,
          endAmPm,
          reminderInterval,
          target,
          totalIntervalFinished: 0,
          totalIntake: 0,
          reminderCreationDate: Firebase.database.ServerValue.TIMESTAMP
        };

        return FirebaseRef.child(`users/${UID}`)
          .update({ drinkingWaterReminder })
          .then(() => {
            this.listenForMemberProfileUpdates(dispatch)
            resolve();
          })
          .catch(reject);
      }).catch(err => {
        throw err.message;
      });
    },
    /**
     * Sign Up
     *
     * @param {obj} formData - data from form
     * @return {Promise}
     */
    signUp(formData) {
      const {
        email, password, password2, firstName, lastName,
      } = formData;

      return new Promise(async (resolve, reject) => {
        // Validation rules
        if (!firstName) return reject({ message: errorMessages.missingFirstName });
        if (!lastName) return reject({ message: errorMessages.missingLastName });
        if (!email) return reject({ message: errorMessages.missingEmail });
        if (!password) return reject({ message: errorMessages.missingPassword });
        if (!password2) return reject({ message: errorMessages.missingPassword });
        if (password !== password2) return reject({ message: errorMessages.passwordsDontMatch });

        // Go to Firebase
        return Firebase.auth().createUserWithEmailAndPassword(email, password)
          .then((res) => {
            // Send user details to Firebase database
            if (res && res.user.uid) {
              FirebaseRef.child(`users/${res.user.uid}`).set({
                firstName,
                lastName,
                signedUp: Firebase.database.ServerValue.TIMESTAMP,
                lastLoggedIn: Firebase.database.ServerValue.TIMESTAMP,
              }).then(resolve);
            }
          }).catch(reject);
      }).catch((err) => { throw err.message; });
    },

    /**
     * Listen for realtime updates on the current user
     */
    listenForMemberProfileUpdates() {
      const UID = (
        FirebaseRef
        && Firebase
        && Firebase.auth()
        && Firebase.auth().currentUser
        && Firebase.auth().currentUser.uid
      ) ? Firebase.auth().currentUser.uid : null;

      if (!UID) return false;

      const ref = FirebaseRef.child(`users/${UID}`);

      return ref.on('value', (snapshot) => {
        const userData = snapshot.val() || [];

        this.setUserDetails(userData); // Send to reducer
      });
    },

    /**
     * Get the current Member's Details
     *
     * @returns {Promise}
     */
    getMemberData() {
      if (Firebase === null) return new Promise(resolve => resolve);

      // Ensure token is up to date
      return new Promise((resolve) => {
        Firebase.auth().onAuthStateChanged((loggedIn) => {
          if (loggedIn) {
            this.listenForMemberProfileUpdates(dispatch);
            return resolve();
          }

          return new Promise(() => resolve);
        });
      });
    },

    /**
     * Login to Firebase with Email/Password
     *
     * @param {obj} formData - data from form
     * @return {Promise}
     */
    login(formData) {
      const { email, password } = formData;

      return new Promise(async (resolve, reject) => {
        // Validation rules
        if (!email || email.length === 0) return reject({ message: errorMessages.missingEmail });
        if (!password || password.length === 0) {
          return reject({ message: errorMessages.missingPassword });
        }

        // Go to Firebase
        return Firebase.auth().setPersistence(Firebase.auth.Auth.Persistence.LOCAL)
          .then(() => Firebase.auth().signInWithEmailAndPassword(email, password)
            .then(async (res) => {
              const userDetails = res && res.user ? res.user : null;

              // Save the user's login data (email, UID)
              this.setUserLogin(userDetails);

              // Update last logged in data
              if (userDetails.uid) {
                FirebaseRef.child(`users/${userDetails.uid}`).update({
                  lastLoggedIn: Firebase.database.ServerValue.TIMESTAMP,
                });

                // Send verification Email when email hasn't been verified
                if (userDetails.emailVerified === false) {
                  Firebase.auth().currentUser.sendEmailVerification()
                    .catch(() => console.log('Verification email failed to send'));
                }

                // Get/Save User Profile (name, signed up date etc)
                this.listenForMemberProfileUpdates(dispatch);
              }

              return resolve();
            }).catch(reject));
      }).catch((err) => { throw err.message; });
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
          Actions.auth();
          resolve();
        }).catch(reject)).catch((err) => { throw err.message; });
    },

  }),
};
