import React from 'react';
import PropTypes from 'prop-types';
import { Image } from 'react-native';
import { Container, Content, Card, CardItem, Body, H3, List, ListItem, Text } from 'native-base';
import { errorMessages } from '../../../constants/messages';
import Error from '../UI/Error';
import Spacer from '../UI/Spacer';
import CommentsContainer from '../../../containers/Comments';

const DiscDetails = ({ error, articles, articleId }) => {
  // Error
  if (error) return <Error content={error} />;

  // Get this article from all articles
  let article = null;
  if (articleId && articles) {
    article = articles.find(item => parseInt(item.id, 10) === parseInt(articleId, 10));
  }

  // article not found
  if (!article) return <Error content={errorMessages.article404} />;

  return (
    <Container>
      <Content padder>
        <Spacer size={25} />
        <H3>{article.title}</H3>
        <Spacer size={15} />

        <Card>
          <CardItem header bordered>
            <Text>About this article</Text>
          </CardItem>
          <CardItem>
            <Body>
              <Text>{article.description}</Text>
            </Body>
          </CardItem>
        </Card>

        <Card>
          <CardItem header bordered>
            <Text>Comments</Text>
          </CardItem>
          <CardItem>
            <Content>
              <CommentsContainer article={article}></CommentsContainer>
            </Content>
          </CardItem>
        </Card>

        <Spacer size={20} />
      </Content>
    </Container>
  );
};

DiscDetails.propTypes = {
  error: PropTypes.string,
  articleId: PropTypes.string.isRequired,
  articles: PropTypes.arrayOf(PropTypes.shape()).isRequired
};

DiscDetails.defaultProps = {
  error: null
};

export default DiscDetails;
