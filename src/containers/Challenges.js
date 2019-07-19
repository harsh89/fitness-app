import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
class ChallengeListing extends Component {
  static propTypes = {
    Layout: PropTypes.func.isRequired,
    challenges: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    match: PropTypes.shape({ params: PropTypes.shape({}) }),
    fetchChallenges: PropTypes.func.isRequired
  }

  static defaultProps = {
    match: null,
  }

  state = {
    error: null,
    loading: false,
  }

  componentDidMount = () => this.fetchData();

  fetchData = (data) => {
    const { fetchChallenges } = this.props;

    this.setState({ loading: true });

    return fetchChallenges(data)
      .then(() => this.setState({
        loading: false,
        error: null,
      })).catch(err => this.setState({
        loading: false,
        error: err,
      }));
  }

  render = () => {
    const { Layout, challenges, match } = this.props;
    const { loading, error } = this.state;
    const id = (match && match.params && match.params.id) ? match.params.id : null;

    return (
      <Layout
        challengeId={id}
        error={error}
        loading={loading}
        challenges={challenges}
        reFetch={() => this.fetchData()}
      />
    );
  }
}

const mapStateToProps = state => ({
  challenges: state.challenges.challenges || {},
});

const mapDispatchToProps = dispatch => ({
  fetchChallenges: dispatch.challenges.getChallenges,
});

export default connect(mapStateToProps, mapDispatchToProps)(ChallengeListing);
