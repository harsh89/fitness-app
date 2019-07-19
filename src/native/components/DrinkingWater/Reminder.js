import React from 'react';
import PropTypes from 'prop-types';
import {
  Container,
  Content,
  Form,
  Item,
  Label,
  Input,
  Text,
  Button,
  View,
  ListItem
} from 'native-base';
import { Actions } from 'react-native-router-flux';
import { Dropdown } from 'react-native-material-dropdown';
import Messages from '../UI/Messages';
import Header from '../UI/Header';
import Spacer from '../UI/Spacer';

class Reminder extends React.Component {
  static propTypes = {
    reminderData: PropTypes.shape({
      firstName: PropTypes.string
    }),
    error: PropTypes.string,
    success: PropTypes.string,
    loading: PropTypes.bool.isRequired,
    onFormSubmit: PropTypes.func.isRequired
  };

  static defaultProps = {
    error: null,
    success: null,
    reminderData: {}
  };

  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange = (name, val) => this.setState({ [name]: val });

  handleSubmit = () => {
    const { onFormSubmit } = this.props;

    return onFormSubmit(this.state)
      .then(() => setTimeout(() => Actions.pop(), 1000))
      .catch(() => {});
  };

  render() {
    const { loading, error, success } = this.props;
    let hours = [
      {
        value: '01'
      },
      {
        value: '02'
      },
      {
        value: '03'
      },
      {
        value: '04'
      },
      {
        value: '05'
      },
      {
        value: '06'
      },
      {
        value: '07'
      },
      {
        value: '08'
      },
      {
        value: '09'
      },
      {
        value: '10'
      },
      {
        value: '11'
      },
      {
        value: '12'
      }
    ];
    let mins = [
      {
        value: '00'
      },
      {
        value: '30'
      }
    ];
    let ampm = [
      {
        value: 'AM'
      },
      {
        value: 'PM'
      }
    ];
    let reminderInterval = [
      {value: '00:30 hrs'},
      {value: '01:30 hrs'},
      {value: '01:30 hrs'},
      {value: '02:00 hrs'},
      {value: '02:30 hrs'}
    ]

    return (
      <Container>
        <Content>
          <View padder>
            <Header
              title="Drinking water reminder"
              content="Please set/update your drinking water goal"
            />
            {error && <Messages message={error} />}
            {success && <Messages type="success" message={success} />}
          </View>

          <Form>
            <ListItem>
              <Dropdown
                label="Start Hour"
                data={hours}
                fontSize={16}
                textColor="rgba(0, 0, 0, .87)"
                containerStyle={{ width: 95, left: 0 }}
                onChangeText={v => this.handleChange('startHr', v)}
              />
              <Dropdown
                label="Start Min"
                data={mins}
                fontSize={16}
                textColor="rgba(0, 0, 0, .87)"
                containerStyle={{ width: 95, left: 10 }}
                onChangeText={v => this.handleChange('startMin', v)}
              />
              <Dropdown
                label="AM/PM"
                data={ampm}
                fontSize={16}
                textColor="rgba(0, 0, 0, .87)"
                containerStyle={{ width: 90, left: 10 }}
                onChangeText={v => this.handleChange('startAmPm', v)}
              />
            </ListItem>
            <ListItem>
              <Dropdown
                label="End Hour"
                data={hours}
                fontSize={16}
                textColor="rgba(0, 0, 0, .87)"
                containerStyle={{ width: 90, left: 0 }}
                onChangeText={v => this.handleChange('endHr', v)}
              />
              <Dropdown
                label="End Min"
                data={mins}
                fontSize={16}
                textColor="rgba(0, 0, 0, .87)"
                containerStyle={{ width: 90, left: 10 }}
                onChangeText={v => this.handleChange('endMin', v)}
              />
              <Dropdown
                label="AM/PM"
                data={ampm}
                fontSize={16}
                textColor="rgba(0, 0, 0, .87)"
                containerStyle={{ width: 90, left: 10 }}
                onChangeText={v => this.handleChange('endAmPm', v)}
              />
            </ListItem>
            <ListItem>
              <Dropdown
                label="Reminder Interval For Every"
                data={reminderInterval}
                fontSize={16}
                textColor="rgba(0, 0, 0, .87)"
                containerStyle={{ width: 250, left: 0 }}
                onChangeText={v => this.handleChange('reminderInterval', v)}
              />
            </ListItem>
            <Item stackedLabel>
              <Label>Set Target</Label>
              <Input
                secureTextEntry
                disabled={loading}
                onChangeText={v => this.handleChange('target', v)}
              />
            </Item>

            <Spacer size={20} />

            <View padder>
              <Button block onPress={this.handleSubmit} disabled={loading}>
                <Text>{loading ? 'Loading' : 'Reminder'}</Text>
              </Button>
            </View>
          </Form>
        </Content>
      </Container>
    );
  }
}

export default Reminder;
