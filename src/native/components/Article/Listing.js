import React from 'react';
import PropTypes from 'prop-types';
import { FlatList, TouchableOpacity, RefreshControl, Image } from 'react-native';
import {
  Container,
  Content,
  Card,
  CardItem,
  Body,
  Text,
  Button,
  Form,
  Label,
  Textarea
} from 'native-base';
import { Actions } from 'react-native-router-flux';
import Loading from '../UI/Loading';
import Error from '../UI/Error';
import Header from '../UI/Header';
import Spacer from '../UI/Spacer';

const ArticleListing = ({ error, loading, articles, reFetch, memberData, submitArticle }) => {
  // Loading
  if (loading) return <Loading />;

  // Error
  if (error) return <Error content={error} />;

  const keyExtractor = item => item.id;

  const onPress = item => Actions.article({ match: { params: { id: String(item.id) } } });
  let articleDesc = '';

  handleChange = (name, val) => {
    articleDesc = val;
    console.log(articleDesc);
  };

  handleSubmit = () => {
    console.log('article added: ' + articleDesc);
    console.log(articleDesc);
    console.log(this.props);

    const articleData = {
      postedBy: `${memberData.firstName} ${memberData.lastName}`,
      articleDesc: articleDesc,
      datePosted: new Date().getTime()
    };
    return submitArticle(articleData)
      .then(() => console.log('article posted'))
      .catch(() => {});
  };

  return (
    <Container>
      <Content padder>
        <Header
          title="Top articles"
          content="This is here to show how you can read and display data from a data source (in our case, Firebase)."
        />

        <FlatList
          numColumns={2}
          data={articles}
          renderItem={({ item }) => (
            <Card transparent style={{ paddingHorizontal: 6 }}>
              <CardItem cardBody>
                <Body>
                  <Spacer size={10} />
                  <Text style={{ fontWeight: '500' }}>{item.title}</Text>
                  <Text style={{ fontWeight: '800' }}>{item.articleDesc}</Text>
                  <Spacer size={15} />
                  <Button block bordered small onPress={() => onPress(item)}>
                    <Text>View article</Text>
                  </Button>
                  <Spacer size={5} />
                </Body>
              </CardItem>
            </Card>
          )}
          keyExtractor={keyExtractor}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={reFetch} />}
        />
        <Spacer size={20} />
        <Form style={{ width: '100%', height: 150, flex: 1, border: 0 }}>
          <Label>Add an article</Label>
          <Textarea
            disabled={loading}
            style={{ width: 302, height: 200, flex: 1, padding: 0, backgroundColor: '#FFFFFF' }}
            bordered
            placeholder="Textarea"
            onChangeText={v => this.handleChange('article', v)}
          />

          <Spacer size={10} />

          <Button block onPress={this.handleSubmit} disabled={loading}>
            <Text>{loading ? 'Loading' : 'Add Article'}</Text>
          </Button>
          <Spacer size={10} />
        </Form>
      </Content>
    </Container>
  );
};

ArticleListing.propTypes = {
  error: PropTypes.string,
  loading: PropTypes.bool.isRequired,
  articles: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  reFetch: PropTypes.func,
  submitArticle: PropTypes.func
};

ArticleListing.defaultProps = {
  error: null,
  reFetch: null
};

export default ArticleListing;
