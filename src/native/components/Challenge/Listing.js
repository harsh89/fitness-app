import React from 'react';
import PropTypes from 'prop-types';
import { FlatList, TouchableOpacity, RefreshControl, Image } from 'react-native';
import { Container, Content, Card, CardItem, Body, Text, Button } from 'native-base';
import { Actions } from 'react-native-router-flux';
import Loading from '../UI/Loading';
import Error from '../UI/Error';
import Header from '../UI/Header';
import Spacer from '../UI/Spacer';

const ChallengeListing = ({ error, loading, challenges, reFetch }) => {
  // Loading
  if (loading) return <Loading />;

  // Error
  if (error) return <Error content={error} />;

  const keyExtractor = item => item.id;

  const onPress = item => Actions.challenge({ match: { params: { id: String(item.id) } } });

  return (
    <Container>
      <Content padder>
        <Header title="Top Challenges" content="This is where you can take up challenges" />

        <FlatList
          numColumns={2}
          data={challenges}
          renderItem={({ item }) => (
            <Card transparent style={{ paddingHorizontal: 6 }}>
              <CardItem cardBody>
                <TouchableOpacity onPress={() => onPress(item)} style={{ flex: 1 }}>
                  <Image
                    source={{ uri: item.image }}
                    style={{
                      height: 100,
                      width: null,
                      flex: 1,
                      borderRadius: 5
                    }}
                  />
                </TouchableOpacity>
              </CardItem>
              <CardItem cardBody>
                <Body>
                  <Spacer size={10} />
                  <Text style={{ fontWeight: '800' }}>{item.title}</Text>
                  <Spacer size={15} />
                  <Button block bordered small onPress={() => onPress(item)}>
                    <Text>View Challenge</Text>
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
      </Content>
    </Container>
  );
};

ChallengeListing.propTypes = {
  error: PropTypes.string,
  loading: PropTypes.bool.isRequired,
  challenges: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  reFetch: PropTypes.func
};

ChallengeListing.defaultProps = {
  error: null,
  reFetch: null
};

export default ChallengeListing;
