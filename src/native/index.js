import React from 'react';
import { StatusBar, Platform, Alert } from 'react-native';
import { Font } from 'expo';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { Router, Stack, Scene, ActionConst } from 'react-native-router-flux';
import { PersistGate } from 'redux-persist/es/integration/react';
import { Firebase, FirebaseRef } from '../lib/firebase';

import { Root, StyleProvider } from 'native-base';
import getTheme from '../../native-base-theme/components';
import theme from '../../native-base-theme/variables/commonColor';

import { LoggedInUserRoutes, guestUserRoutes } from './routes/index';
import Loading from './components/UI/Loading';
import { Constants, Notifications, Permissions } from 'expo';

// Hide StatusBar on Android as it overlaps tabs
if (Platform.OS === 'android') StatusBar.setHidden(true);

async function getiOSNotificationPermission() {
  const { status } = await Permissions.getAsync(
    Permissions.NOTIFICATIONS
  );
  if (status !== 'granted') {
    await Permissions.askAsync(Permissions.NOTIFICATIONS);
  }
}


export default class App extends React.Component {
  static propTypes = {
    store: PropTypes.shape({}).isRequired,
    persistor: PropTypes.shape({}).isRequired,
  }

  state = {
    loading: true,
    loggedIn: false,
    token: '',
    error: ''
  }

  _handleButtonPress = () => {
    const localnotification = {
      title: 'Drink Water',
      body: 'keep yourself Hyderated',
      android: {
        sound: true,
      },
      ios: {
        sound: true,
      },
    };
    let sendAfterFiveSeconds = Date.now();
    sendAfterFiveSeconds += 5000;

    const schedulingOptions = { time: sendAfterFiveSeconds };
    Notifications.scheduleLocalNotificationAsync(
      localnotification,
      schedulingOptions
    );
  };
  listenForNotifications = () => {
    Notifications.addListener(notification => {
      if (notification.origin === 'received' && Platform.OS === 'ios') {
        // Alert.alert(notification.title, notification.body);
      }
    });
  };

  async componentWillMount() {
    getiOSNotificationPermission();
    this.listenForNotifications();
    await Font.loadAsync({
      Roboto: require('native-base/Fonts/Roboto.ttf'),
      Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
      Ionicons: require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Ionicons.ttf'),
    });

    if (!this.state.loggedIn) {
      this.getMemberData().then(loggedIn => {
        this.setState({ loading: false, loggedIn });
      });
    } else {
      this.setState({ loading: false });
    }
  }

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
        return new Promise(() => resolve(loggedIn));
      });
    });
  }

  render() {
    const { loading } = this.state;
    const { store, persistor } = this.props;
    this._handleButtonPress();

    if (loading) return <Loading />;

    return (
      <Root>
        <Provider store={store}>
          <PersistGate
            loading={<Loading />}
            persistor={persistor}
          >
            <StyleProvider style={getTheme(theme)}>
              <Router>
                <Scene key="root">
                  <Scene initial={!this.state.loggedIn} hideNavBar panHandlers={null}>
                    {guestUserRoutes}
                  </Scene>
                  <Scene initial={this.state.loggedIn} hideNavBar panHandlers={null}>
                    {LoggedInUserRoutes}
                  </Scene>
                </Scene>
              </Router>
            </StyleProvider>
          </PersistGate>
        </Provider>
      </Root>
    );
  }
}
