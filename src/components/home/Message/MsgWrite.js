import React, { Component } from 'react';
import { View, Text, TextInput } from 'react-native';
import firebase from 'firebase';
import { Actions } from 'react-native-router-flux';

import { Button, Input, Card, CardSection } from '../../common';

class MsgWrite extends Component {

  state = { dong: '', hosu: '', msg: '' };

  onDongChange(text) {
    this.setState({ dong: text });
  }

  onHosuChange(text) {
    this.setState({ hosu: text });
  }

  onMsgChange(text) {
    this.setState({ msg: text });
  }
  
  onSendPressed() {
    this.sendMsgPush();
    this.recvMsgPush();
    Actions.pop();
  }

  sendMsgPush() {
    const { currentUser } = firebase.auth();
    const { dong, hosu, msg } = this.state;
  
    firebase.database().ref(`/users/${currentUser.uid}/message/sendMsg`)
      .push().set({ dong, hosu, msg })
      .then(() => {
        console.log('sendMsg push successed!');
       });
  }

  recvMsgPush() {
    const { dong, hosu, msg } = this.state;

    firebase.database().ref('/users').orderByChild('dong')
    .on('child_added', (snapshot) => {
      const dongFiltered = { ...snapshot.val(), uid: snapshot.key };
      console.log(dongFiltered);

      if (dongFiltered.hosu === `${hosu}`) {
        console.log(dongFiltered);

        firebase.database().ref(`/users/${dongFiltered.uid}/message/recvMsg`)
        .push().set({ dong, hosu, msg });
        console.log('recvMsg push successed!');
      }
    });
  }

  render() {
    return (
      <Card >
        <CardSection style={{ height: 50, flexDirection: 'row', justifyContent: 'space-around' }}>
          <Text>받는 사람</Text>
          <Button>윗집</Button>
          <Button>아랫집</Button>
        </CardSection>
        <CardSection style={{ height: 50, flexDirection: 'row', justifyContent: 'space-around' }}>
          <Input
              label="동"
              value={this.state.dong}
              onChangeText={this.onDongChange.bind(this)}
          />
          <Input
              label="호수"
              value={this.state.hosu}
              onChangeText={this.onHosuChange.bind(this)}
          />
        </CardSection>
        <CardSection style={{ height: 300 }}>
          <View style={{ flex: 1 }}>
            <TextInput
              multiline
              placeholder='메세지를 입력하세요'
              autoCorrect={false}
              value={this.state.msg}
              onChangeText={this.onMsgChange.bind(this)}
            />
          </View>
        </CardSection>
        <CardSection>
          <Button onPress={this.onSendPressed.bind(this)}>전송</Button>
        </CardSection>
      </Card>
    );
  }
}

export default MsgWrite;
