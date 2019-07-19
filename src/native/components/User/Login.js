import React from 'react';
import PropTypes from 'prop-types';
import {
  Container, Content, Form, Item, Label, Input, Text, Button, View, ListItem, Body, Left, Icon
} from 'native-base';
import { Actions } from 'react-native-router-flux';
import Messages from '../UI/Messages';
import Header from '../UI/Header';
import Spacer from '../UI/Spacer';

class Login extends React.Component {
  static propTypes = {
    member: PropTypes.shape({
      email: PropTypes.string,
    }),
    error: PropTypes.string,
    success: PropTypes.string,
    loading: PropTypes.bool.isRequired,
    onFormSubmit: PropTypes.func.isRequired,
  }

  static defaultProps = {
    error: null,
    success: null,
    member: {},
  }

  constructor(props) {
    super(props);
    this.state = {
      email: (props.member && props.member.email) ? props.member.email : '',
      password: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange = (name, val) => this.setState({ [name]: val })

  handleSubmit = () => {
    const { onFormSubmit } = this.props;

    return onFormSubmit(this.state)
      .then(() => setTimeout(() => Actions.main(), 1000))
      .catch(() => { });
  }

  render() {
    const { loading, error, success } = this.props;
    const { email } = this.state;

    return (
      <Container>
        <Content>
          <View padder />
          <View padder />
          <View padder />
          <View padder>
            <Header
              title="Welcome to Studio Fitness App"
              content="Please use your email and password to login."
            />
            {error && <Messages message={error} />}
          </View>

          <Form>
            <Item stackedLabel>
              <Label>Email</Label>
              <Input
                autoCapitalize="none"
                value={email}
                keyboardType="email-address"
                disabled={loading}
                onChangeText={v => this.handleChange('email', v)}
              />
            </Item>
            <Item stackedLabel>
              <Label>Password</Label>
              <Input
                secureTextEntry
                disabled={loading}
                onChangeText={v => this.handleChange('password', v)}
              />
            </Item>

            <Spacer size={20} />

            <View padder>
              <Button block onPress={this.handleSubmit} disabled={loading}>
                <Text>{loading ? 'Loading' : 'Login'}</Text>
              </Button>
            </View>
          </Form>
          <View>
            <ListItem onPress={Actions.signUp} icon>
              <Left>
                <Icon name="add-circle" />
              </Left>
              <Body>
                <Text>
                  Sign Up
                  </Text>
              </Body>
            </ListItem>
            <ListItem onPress={Actions.forgotPassword} icon>
              <Left>
                <Icon name="help-buoy" />
              </Left>
              <Body>
                <Text>
                  Forgot Password
                  </Text>
              </Body>
            </ListItem>
          </View>
        </Content>
      </Container>
    );
  }
}

export default Login;
