import React, { Fragment, useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, View, StatusBar, Platform } from 'react-native';
import { StackActions, useNavigation } from '@react-navigation/native';
import AppIntroSlider from 'react-native-app-intro-slider';
import { Image, Text, Icon } from '@components';
import { BaseColor, useTheme } from '@config';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 10,
    justifyContent: 'center'
  },
  titleStyle: {
    padding: 10,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold'
  },
  paragraphStyle: {
    padding: 20,
    textAlign: 'center',
    fontSize: 16
  },
  introImageStyle: {
    width: 200,
    height: 200
  },
  introTextStyle: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    paddingVertical: 30
  },
  introTitleStyle: {
    fontSize: 25,
    color: 'white',
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: 'bold'
  },
  buttonCircle: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(0, 0, 0, .2)',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

const slides = [
  {
    key: 's0',
    text: 'Mazi is a mobile React Native UI KIT for fast development with mobile applications',
    title: 'Mazi',
    icon: 'home',
    backgroundColor: BaseColor.pinkLightColor
  },
  {
    key: 's1',
    text: 'Safe and secure digital payment tools',
    title: 'Wallet App',
    icon: 'wallet',
    backgroundColor: BaseColor.greenColor
  },
  {
    key: 's2',
    title: 'Crypto App',
    text: 'Create your crypto currency portfolio today',
    icon: 'bitcoin',
    backgroundColor: BaseColor.pinkColor
  },
  {
    key: 's3',
    title: 'E-commerce App',
    text: 'Mobile commerce is growing exponentially these days',
    icon: 'cart-plus',
    backgroundColor: BaseColor.blueColor
  },
  {
    key: 's4',
    title: 'News App',
    text: 'Brings you the latest news from the world',
    icon: 'book',
    backgroundColor: BaseColor.orangeColor
  },
  {
    key: 's5',
    title: 'Project App',
    text: 'Agile project management designed for teams of every shape and size',
    icon: 'project-diagram',
    backgroundColor: BaseColor.yellowColor
  },
  {
    key: 's6',
    title: 'Setting',
    text: 'You can turn off/on this Slider intro in \n Setting \u2192 Display intro screen \u2192 Off/On',
    icon: 'cog',
    backgroundColor: BaseColor.accentColor
  }
];

const SliderIntro = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();

  useEffect(() => {
    if (Platform.OS == 'android') {
      StatusBar.setTranslucent(true);
      StatusBar.setBackgroundColor('transparent', true);
    }
  }, []);

  const renderItem = ({ item }) => {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: item.backgroundColor,
          alignItems: 'center',
          justifyContent: 'space-around',
          paddingBottom: 100,
          paddingHorizontal: 20
        }}>
        <Text whiteColor title1>
          {item.title}
        </Text>
        <Icon name={item.icon} color={BaseColor.whiteColor} size={200} />
        {/* <Image style={styles.introImageStyle} source={item.image} /> */}
        <Text whiteColor body1 style={{ textAlign: 'center' }}>
          {item.text}
        </Text>
      </View>
    );
  };

  const onDone = () => {
    navigation.dispatch(StackActions.replace('SignIn'));
  };

  const onSkip = () => {
    navigation.dispatch(StackActions.replace('SignIn'));
  };

  const renderButton =
    (label = '') =>
    () => {
      return (
        <View style={styles.buttonCircle}>
          <Text footnote whiteColor>
            {label}
          </Text>
        </View>
      );
    };

  return (
    <Fragment>
      <AppIntroSlider
        data={slides}
        renderItem={renderItem}
        onDone={onDone}
        showSkipButton={true}
        onSkip={onSkip}
        renderDoneButton={renderButton('Done')}
        renderNextButton={renderButton('Next')}
        renderSkipButton={renderButton('Skip')}
      />
    </Fragment>
  );
};

export default SliderIntro;
