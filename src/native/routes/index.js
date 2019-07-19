import React from 'react';
import { Scene, Tabs, Stack, ActionConst } from 'react-native-router-flux';
import { Icon } from 'native-base';

import DefaultProps from '../constants/navigation';
import AppConfig from '../../constants/config';

import ChallengesContainer from '../../containers/Challenges';
import ChallengeListing from '../components/Challenge/Listing';
import ChallengeDetailComponent from '../components/Challenge/Single';

import ArticlesContainer from '../../containers/Articles';
import ArticleListing from '../components/Article/Listing';
import ArticleDetailComponent from '../components/Article/Details';

import SignUpContainer from '../../containers/SignUp';
import SignUpComponent from '../components/User/SignUp';

import LoginContainer from '../../containers/Login';
import LoginComponent from '../components/User/Login';

import ForgotPasswordContainer from '../../containers/ForgotPassword';
import ForgotPasswordComponent from '../components/User/ForgotPassword';

import UpdateProfileContainer from '../../containers/UpdateProfile';
import UpdateProfileComponent from '../components/User/UpdateProfile';

import MemberContainer from '../../containers/Member';
import ProfileComponent from '../components/User/Profile';

import AboutComponent from '../components/About';

const LoggedInUserRoutes = (
  <Stack hideNavBar type={ActionConst.REPLACE} key="main">
    <Tabs key="tabbar" type="replace" showLabel={false} {...DefaultProps.tabProps}>
      <Stack
        key="home"
        title={AppConfig.appName.toUpperCase()}
        icon={() => <Icon name="planet" {...DefaultProps.icons} />}
        {...DefaultProps.navbarProps}
        panHandlers={null}
      >
        <Scene key="home" component={AboutComponent} />
      </Stack>

      <Stack
        key="challenges"
        title="CHALLENGES"
        icon={() => <Icon name="book" {...DefaultProps.icons} />}
        {...DefaultProps.navbarProps}
        panHandlers={null}
      >
        <Scene key="challenges" component={ChallengesContainer} Layout={ChallengeListing} />
      </Stack>

      <Stack
        key="articles"
        title="ARTICLES"
        icon={() => <Icon name="book" {...DefaultProps.icons} />}
        {...DefaultProps.navbarProps}
      >
        <Scene key="articles" component={ArticlesContainer} Layout={ArticleListing} />
      </Stack>

      <Stack
        key="profile"
        title="PROFILE"
        type={ActionConst.RESET}
        icon={() => <Icon name="contact" {...DefaultProps.icons} />}
        {...DefaultProps.navbarProps}
        panHandlers={null}
      >
        <Scene key="profileHome" component={MemberContainer} Layout={ProfileComponent} />
        <Scene
          back
          key="signUp"
          title="SIGN UP"
          {...DefaultProps.navbarProps}
          component={SignUpContainer}
          Layout={SignUpComponent}
        />
        <Scene
          back
          key="login"
          title="LOGIN"
          {...DefaultProps.navbarProps}
          component={LoginContainer}
          Layout={LoginComponent}
        />
        <Scene
          back
          key="forgotPassword"
          title="FORGOT PASSWORD"
          {...DefaultProps.navbarProps}
          component={ForgotPasswordContainer}
          Layout={ForgotPasswordComponent}
        />
        <Scene
          back
          key="updateProfile"
          title="UPDATE PROFILE"
          {...DefaultProps.navbarProps}
          component={UpdateProfileContainer}
          Layout={UpdateProfileComponent}
        />
      </Stack>
    </Tabs>
    <Scene
      back
      clone
      key="challenge"
      title="CHALLENGE"
      {...DefaultProps.navbarProps}
      component={ChallengesContainer}
      Layout={ChallengeDetailComponent}
    />

    <Scene
      back
      clone
      key="article"
      title="ARTICLE"
      {...DefaultProps.navbarProps}
      component={ArticlesContainer}
      Layout={ArticleDetailComponent}
    />
  </Stack>
);

const guestUserRoutes = (
  <Stack type={ActionConst.REPLACE} key="auth">
    <Scene
      key="login"
      title="LOGIN"
      {...DefaultProps.navbarProps}
      component={LoginContainer}
      Layout={LoginComponent}
      hideNavBar
      panHandlers={null}
    />
    <Scene
      key="signUp"
      title="SIGN UP"
      {...DefaultProps.navbarProps}
      component={SignUpContainer}
      Layout={SignUpComponent}
    />
    <Scene
      key="forgotPassword"
      title="FORGOT PASSWORD"
      {...DefaultProps.navbarProps}
      component={ForgotPasswordContainer}
      Layout={ForgotPasswordComponent}
    />
  </Stack>
);

export { LoggedInUserRoutes, guestUserRoutes };
