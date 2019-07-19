import React from 'react';
import PropTypes from 'prop-types';
import { Image } from 'react-native';
import {
  Container, Content, Card, CardItem, Body, H3, List, ListItem, Text,
} from 'native-base';
import { errorMessages } from '../../../constants/messages';
import Error from '../UI/Error';
import Spacer from '../UI/Spacer';

const ChallengeView = ({
  error, challenges, challengeId,
}) => {
  // Error
  if (error) return <Error content={error} />;

  // Get this Challenge from all challenges
  let challenge = null;
  if (challengeId && challenges) {
    challenge = challenges.find(item => parseInt(item.id, 10) === parseInt(challengeId, 10));
  }

  // Challenge not found
  if (!challenge) return <Error content={errorMessages.challenge404} />;

  // Build Rules listing
  const rules = challenge.rules.map(item => (
    <ListItem key={item} rightIcon={{ style: { opacity: 0 } }}>
      <Text>{item}</Text>
    </ListItem>
  ));

  return (
    <Container>
      <Content padder>
        <Image source={{ uri: challenge.image }} style={{ height: 100, width: null, flex: 1 }} />

        <Spacer size={25} />
        <H3>{challenge.title}</H3>
        <Spacer size={15} />

        <Card>
          <CardItem header bordered>
            <Text>About this challenge</Text>
          </CardItem>
          <CardItem>
            <Body>
              <Text>{challenge.desc}</Text>
            </Body>
          </CardItem>
        </Card>

        <Card>
          <CardItem header bordered>
            <Text>Rules</Text>
          </CardItem>
          <CardItem>
            <Content>
              <List>{rules}</List>
            </Content>
          </CardItem>
        </Card>

        <Spacer size={20} />
      </Content>
    </Container>
  );
};

ChallengeView.propTypes = {
  error: PropTypes.string,
  challengeId: PropTypes.string.isRequired,
  challenges: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

ChallengeView.defaultProps = {
  error: null,
};

export default ChallengeView;
