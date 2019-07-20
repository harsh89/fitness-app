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
  ListItem,
  Body,
  CheckBox
} from 'native-base';
import { Actions } from 'react-native-router-flux';
import { Dropdown } from 'react-native-material-dropdown';
import { hours, mins, ampm, reminderInterval } from '../../../constants/timer';
import Messages from '../UI/Messages';
import Header from '../UI/Header';
import Spacer from '../UI/Spacer';

class Reminder extends React.Component {
  static propTypes = {
    error: PropTypes.string,
    success: PropTypes.string,
    loading: PropTypes.bool.isRequired,
    onFormSubmit: PropTypes.func.isRequired,
    onIntakeSubmit: PropTypes.func.isRequired,
    member: PropTypes.shape({
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      email: PropTypes.string,
      drinkingWaterReminder: PropTypes.object
    }).isRequired
  };

  static defaultProps = {
    error: null,
    success: null,
    member: {}
  };

  constructor(props) {
    super(props);
    this.state = {
      inputIntake: false,
      currentInterval: {}
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.submitIntake = this.submitIntake.bind(this);
    this.toggleIntakeForm = this.toggleIntakeForm.bind(this);
  }

  handleChange = (name, val) => this.setState({ [name]: val });
  toggleIntakeForm = (name, val, currentInterval) => {
    this.setState({
      [name]: true,
      currentInterval: {
        id: currentInterval,
        text: val
      }
    });
  };

  handleSubmit = () => {
    const { onFormSubmit } = this.props;

    return onFormSubmit(this.state)
      .then(() => setTimeout(() => Actions.pop(), 1000))
      .catch(() => {});
  };

  submitIntake = () => {
    const { onIntakeSubmit, member } = this.props;
    const reqObj = {
      intakeObj: this.state,
      drinkingWaterReminder: member.drinkingWaterReminder,
      uid: member.uid
    };

    return onIntakeSubmit(reqObj)
      .then(() => setTimeout(() => Actions.pop(), 1000))
      .catch(() => {});
  };

  duration = member => {
    const drinkingWaterReminder = member.drinkingWaterReminder;
    if (!drinkingWaterReminder) {
      return null;
    }
    const {
      startHr,
      startMin,
      startAmPm,
      endHr,
      endAmPm,
      endMin,
      reminderInterval
    } = drinkingWaterReminder;
    let duration = null;
    if (startAmPm === endAmPm) {
      duration = Number(endHr) + Number(endMin) - (Number(startHr) + Number(startMin));
    } else {
      const hourDiff = 12 - Number(startHr);
      const totalHour = hourDiff + Number(endHr);
      const totalInMin = totalHour * 60 + Number(startMin) + Number(endMin);
      let interval = reminderInterval.split('hrs')[0];
      const intervalHr = Number(interval.split(':')[0]) * 60;
      const intervalMin = Number(interval.split(':')[1]);
      interval = intervalHr + intervalMin;
      duration = Math.floor(totalInMin / interval);
    }

    return duration;
  };

  renderReminders = (duration, reminderSchedule) => {
    let reminders = [];
    const { startHr, startMin, reminderInterval } = reminderSchedule;
    let ampm = 'AM';
    const intervalHr = Number(reminderInterval.split(' hrs')[0].split(':')[0]);
    const intervalMin = Number(reminderInterval.split(' hrs')[0].split(':')[1]);
    let nextHr = intervalHr + Number(startHr);
    let nextMin = intervalMin + Number(startMin);
    if (nextMin === 60) {
      nextHr += 1;
      nextMin = 0;
    }
    if (nextHr > 12) {
      nextHr = nextHr - 12;
      ampm = 'PM';
    }

    for (let i = 0; i < duration; i++) {
      const scheduleTxt = `${String(nextHr).length === 1 ? `0${nextHr}` : nextHr}:${
        String(nextMin).length === 1 ? `0${nextMin}` : nextMin
      } ${ampm}`;
      reminders.push(
        <ListItem key={i}>
          <CheckBox
            checked={this.state.currentInterval.id === i}
            onPress={() => this.toggleIntakeForm('inputIntake', scheduleTxt, i)}
          />
          <Body>
            <Text>
              {`At ${String(nextHr).length === 1 ? `0${nextHr}` : nextHr}:${
                String(nextMin).length === 1 ? `0${nextMin}` : nextMin
              } ${ampm}`}
            </Text>
          </Body>
        </ListItem>
      );
      nextHr += intervalHr;
      nextMin += intervalMin;
      if (nextMin === 60) {
        nextHr += 1;
        nextMin = 0;
      }
      if (nextHr > 12) {
        nextHr = nextHr - 12;
        ampm = 'PM';
      }
    }
    return reminders;
  };

  render() {
    const { loading, error, success, member } = this.props;
    let totalDuration = null;
    if (!!member) {
      totalDuration = this.duration(member);
    }

    return (
      <Container>
        <Content>
          <View>
            {member && member.drinkingWaterReminder && <Header title="Your reminder" />}
            {member && !member.drinkingWaterReminder && (
              <Header
                title="Drinking water reminder"
                content="Please set/update your drinking water goal"
              />
            )}

            {error && <Messages message={error} />}
            {success && <Messages type="success" message={success} />}
          </View>
          {member && member.drinkingWaterReminder && (
            <>
              <ListItem>
                <Body>
                  <Text>{`Start Time: ${member.drinkingWaterReminder.startHr}:${member.drinkingWaterReminder.startMin} ${member.drinkingWaterReminder.startAmPm}`}</Text>
                </Body>
              </ListItem>
              <ListItem>
                <Body>
                  <Text>{`End Time: ${member.drinkingWaterReminder.endHr}:${member.drinkingWaterReminder.endMin} ${member.drinkingWaterReminder.endAmPm}`}</Text>
                </Body>
              </ListItem>
              <ListItem>
                <Body>
                  <Text>{`Target: ${member.drinkingWaterReminder.target} Ltr | Finished: ${member.drinkingWaterReminder.totalIntake} Ltr`}</Text>
                </Body>
              </ListItem>
              {this.state.inputIntake && (
                <>
                  <Form>
                    <Item stackedLabel>
                      <Label>{`Enter intake for ${this.state.currentInterval.text}`}</Label>
                      <Input onChangeText={v => this.handleChange('intake', v)} />
                    </Item>
                    <Button block onPress={this.submitIntake} disabled={loading}>
                      <Text>{loading ? 'Loading' : 'Submit'}</Text>
                    </Button>
                  </Form>
                </>
              )}
              {totalDuration && this.renderReminders(totalDuration, member.drinkingWaterReminder)}
            </>
          )}
          {member && !member.drinkingWaterReminder && (
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
          )}
        </Content>
      </Container>
    );
  }
}

export default Reminder;
