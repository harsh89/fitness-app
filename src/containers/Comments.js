import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Container, Content, Card, CardItem, Body, H3, List, ListItem, Text } from 'native-base';

class CommentsListing extends Component {
  static propTypes = {
    comments: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    match: PropTypes.shape({ params: PropTypes.shape({}) }),
    fetchComments: PropTypes.func.isRequired,
    article: PropTypes.object
  };

  static defaultProps = {
    match: null
  };

  state = {
    error: null,
    loading: false
  };

  componentDidMount = () => this.fetchCommentsData();

  fetchCommentsData = data => {
    console.log('fetch comments');
    const { fetchComments } = this.props;

    this.setState({ loading: true });

    return fetchComments(data)
      .then(() =>
        this.setState({
          loading: false,
          error: null
        })
      )
      .catch(err =>
        this.setState({
          loading: false,
          error: err
        })
      );
  };

  render = () => {
    // const { Layout, comments, match } = this.props;
    // const { loading, error } = this.state;
    // const id = match && match.params && match.params.id ? match.params.id : null;

    return (
      <Card>
        <CardItem>
          <Text>Comments</Text>
        </CardItem>
        <CardItem>
          <Text>hello comments</Text>
        </CardItem>
      </Card>
    );
  };
}

const mapStateToProps = state => ({
  comments: state.articles.comments || {}
});

const mapDispatchToProps = dispatch => ({
  fetchComments: dispatch.articles.getComments
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CommentsListing);
