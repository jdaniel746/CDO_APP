import React from 'react';
import { Icon } from '@components';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTranslation } from 'react-i18next';
import { BaseColor, BaseStyle, useTheme } from '@config';

export const tabBarIcon = ({ color, name }) => <Icon name={name} size={20} solid color={color} />;

const BottomTab = createBottomTabNavigator();

export const BottomTabNavigatorMazi = ({ tabScreens = {} }) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  return (
    <BottomTab.Navigator
      initialRouteName="Home"
      tabBarOptions={{
        showIcon: true,
        showLabel: true,
        activeTintColor: colors.primaryColor,
        inactiveTintColor: BaseColor.grayColor,
        style: BaseStyle.tabBar,
        labelStyle: {
          fontSize: 12
        }
      }}>
      {Object.keys(tabScreens).map((name, index) => {
        const { options, component } = tabScreens[name];
        console.log(JSON.stringify(options)+" "+name)
        return (
          <BottomTab.Screen
            key={index}
            name={name}
            component={component}
            options={{
              ...options,
              title: t(options.title)
            }}
          />
        );
      })}
    </BottomTab.Navigator>
  );
};
