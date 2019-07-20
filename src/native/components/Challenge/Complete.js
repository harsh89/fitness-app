import React from 'react';
import PropTypes from 'prop-types';
import {
  Container, Content, Button, Text
} from 'native-base';

import { 
  TextInput,
  AppRegistry,
  StyleSheet,
  View,
  PixelRatio,
  TouchableOpacity,
  Image
} from 'react-native';
import Spacer from '../UI/Spacer';
// import * as ImagePicker from 'expo-image-picker';

const ChallengeView = ({
  ImageSource, setImageSource
}) => {

  const uploadPhoto = async () => {
    // const result = await ImagePicker.launchImageLibraryAsync({
    //   mediaTypes: ImagePicker.MediaTypeOptions.Images,
    //   allowsEditing: false,
    //   base64: true
    // })

    // if (!result.cancelled) {
    //   alert(result.uri);
    // }
  }

  return (
    <Container>
      <Content padder>
        <Text>Comments</Text>
        <TextInput
          style={{height: 80, borderColor: 'gray', borderWidth: 1}}
          // onChangeText={(text) => this.setState({text})}
          // value={this.state.text}
        />

        <Spacer size={15} />

        <Button
          block
          onPress={uploadPhoto}
          title="Upload Photo"
          color="#841584"
          accessibilityLabel="Upload photo from gallery"
          >
          <Text>Upload Photo</Text>
        </Button>

      </Content>
    </Container>
  );
};

ChallengeView.propTypes = {
  ImageSource: PropTypes.object,
  setImageSource: PropTypes.func.isRequired
};

ChallengeView.defaultProps = {
  ImageSource: null
};

export default ChallengeView;
