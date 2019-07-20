import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Container,
  Content,
  Card,
  Textarea,
  CardItem,
  Body,
  H3,
  Form,
  List,
  ListItem,
  Label,
  Item,
  Text,
  View,
  Button
} from 'native-base';
import Spacer from '../native/components/UI/Spacer';
// import { StyleSheet } from 'react-native';
// const styles = StyleSheet.create({
//   fullWidth: { flex: 1 }
// });

class CommentsListing extends Component {
  static propTypes = {
    comments: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    match: PropTypes.shape({ params: PropTypes.shape({}) }),
    fetchComments: PropTypes.func.isRequired,
    submitComment: PropTypes.func.isRequired,
    article: PropTypes.object
  };

  static defaultProps = {
    match: null
  };

  state = {
    error: null,
    loading: false
  };

  componentDidMount = () => this.fetchCommentsData(this.props.article.id);

  fetchCommentsData = data => {
    console.log('fetch comments');
    const { fetchComments } = this.props;
    const id = data;

    this.setState({ loading: true });

    return fetchComments(id)
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

  handleChange = (name, val) => this.setState({ [name]: val });

  handleSubmit = () => {
    // console.log('comment added: ' + this.state.comments);
    // const { onFormSubmit } = this.props;

    console.log('fetch comments');
    const { submitComment } = this.props;

    const discData = {
      threadId: this.props.article.id,
      postedBy: `${this.props.member.firstName} ${this.props.member.lastName}`,
      commentData: this.state.comments,
      datePosted: new Date().getTime()
    };
    return submitComment(discData)
      .then(() => console.log('comments posted'))
      .catch(() => {});
  };

  render = () => {
    // Comment listing
    const commentList = this.props.comments.map(item => (
      <Card key={item.id}>
        <CardItem header bordered>
          <Text>Posted by: {item.postedBy}</Text>
        </CardItem>
        <CardItem bordered>
          <Body>
            <Text>{item.commentData}</Text>
          </Body>
        </CardItem>
        <CardItem footer bordered>
          <Text>Posted On: {item.datePosted}</Text>
        </CardItem>
      </Card>
    ));

    return (
      <Content>
        <Form style={{ width: '100%', height: 150, flex: 1, border: 0 }}>
          <Label>Add a comment</Label>
          <Textarea
            disabled={this.state.loading}
            style={{ width: 302, height: 200, flex: 1, padding: 0 }}
            bordered
            placeholder="Textarea"
            onChangeText={v => this.handleChange('comments', v)}
          />

          <Spacer size={10} />

          <Button block onPress={this.handleSubmit} disabled={this.state.loading}>
            <Text>{this.state.loading ? 'Loading' : 'Add comment'}</Text>
          </Button>
          <Spacer size={10} />
        </Form>
        <Card>
          <CardItem header bordered>
            <Text>Comments</Text>
          </CardItem>
          <CardItem>
            <Content>{commentList}</Content>
          </CardItem>
        </Card>
      </Content>
    );
  };
}

const mapStateToProps = state => ({
  comments: state.articles.comments || {},
  member: state.member || {}
});

const mapDispatchToProps = dispatch => ({
  fetchComments: dispatch.articles.getComments,
  submitComment: dispatch.articles.postComment
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CommentsListing);
