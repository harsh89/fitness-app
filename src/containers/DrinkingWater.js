import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class DrinkingWater extends Component {
  static propTypes = {
    Layout: PropTypes.func.isRequired,
    member: PropTypes.shape({}).isRequired,
    onFormSubmit: PropTypes.func.isRequired,
    onIntakeSubmit: PropTypes.func.isRequired
  }

  state = {
    error: null,
    success: null,
    loading: false,
  }

  onFormSubmit = (data) => {
    const { onFormSubmit } = this.props;

    this.setState({ loading: true });

    return onFormSubmit(data)
      .then(() => this.setState({
        loading: false,
        success: 'Reminder set successfully',
        error: null,
      })).catch((err) => {
        this.setState({
          loading: false,
          success: null,
          error: err,
        });
        throw err; // To prevent transition back
      });
  }

  onIntakeSubmit = (data) => {
    const { onIntakeSubmit } = this.props;

    this.setState({ loading: true });

    return onIntakeSubmit(data)
      .then(() => this.setState({
        loading: false,
        success: 'Intke updated',
        error: null,
      })).catch((err) => {
        this.setState({
          loading: false,
          success: null,
          error: err,
        });
        throw err; // To prevent transition back
      });
  }

  render = () => {
    const { member, Layout } = this.props;
    const { error, loading, success } = this.state;

    return (
      <Layout
        error={error}
        member={member}
        loading={loading}
        success={success}
        onFormSubmit={this.onFormSubmit}
        onIntakeSubmit={this.onIntakeSubmit}
      />
    );
  }
}

const mapStateToProps = state => ({
  member: state.member || {},
});

const mapDispatchToProps = dispatch => ({
  onFormSubmit: dispatch.member.submitReminder,
  onIntakeSubmit: dispatch.member.submitIntake
});

export default connect(mapStateToProps, mapDispatchToProps)(DrinkingWater);
