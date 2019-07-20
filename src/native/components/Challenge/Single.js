import React from 'react';
import PropTypes from 'prop-types';
import { Image } from 'react-native';
import {
  Container, Content, Card, CardItem, Body, H3, List, ListItem, Text, Button
} from 'native-base';
import { errorMessages } from '../../../constants/messages';
import Error from '../UI/Error';
import Spacer from '../UI/Spacer';
import { Actions } from 'react-native-router-flux';

// import { Video } from 'expo-av';

const ChallengeView = ({
  error, challenges, challengeId, challengeStatus, setChallengeStatus
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

  const takePartInChallenge = () => {
    setChallengeStatus('TAKEPART');
  }

  const completeChallenge = item => Actions.completeChallenge({ match: { params: { id: String(item.id) } } });

  const exitChallenge = () => {
    setChallengeStatus('READY');
  }

  return (
    <Container>
      <Content padder>
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

        {challenge.image && (
          <>
            <Image source={{ uri: challenge.image }} style={{ height: 300, width: null, flex: 1 }} />
            <Spacer size={25} />
          </>
        )}

        {/* {challenge.video && (
          <>
            <Video
              source={{ uri: challenge.video }}
              rate={1.0}
              volume={1.0}
              isMuted={false}
              resizeMode="cover"
              shouldPlay
              isLooping
              style={{ width: 300, height: 300 }}
            />
          </>
        )} */}

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

        {challengeStatus === 'READY' && (
          <Button
            block
            onPress={takePartInChallenge}
            title="Take Part"
            color="#841584"
            accessibilityLabel="Choose to take part in this challenge"
          >
            <Text>Take Part</Text>
          </Button>
        )}

        {challengeStatus === 'TAKEPART' && (
          <ListItem>
            <Button
              block
              onPress={completeChallenge}
              title="Complete"
              color="#841584"
              accessibilityLabel="Choose to complete the challenge"
              style={{width: '48%'}}
            >
              <Text>Complete</Text>
            </Button>

            <Button
              block
              onPress={exitChallenge}
              title="Exit"
              color="#841584"
              accessibilityLabel="Choose to exit the challenge"
              style={{width: '48%', left: '4%'}}
              >
              <Text>Exit</Text>
            </Button>
          </ListItem>
        )}

      </Content>
    </Container>
  );
};

ChallengeView.propTypes = {
  error: PropTypes.string,
  challengeId: PropTypes.string.isRequired,
  challenges: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  challengeStatus: PropTypes.string,
  setChallengeStatus: PropTypes.func.isRequired
};

ChallengeView.defaultProps = {
  error: null,
  challengeStatus: 'READY'
};

export default ChallengeView;
