import { PieChart, Project02, SafeAreaView, TabTag } from '@components';
import { BaseColor, BaseStyle, useTheme } from '@config';
import * as Utils from '@utils';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, View } from 'react-native';
import styles from './styles';
import { GroupsActions } from '@actions';
import { useDispatch, useSelector } from 'react-redux';
import Toast from 'react-native-toast-message';

const { retrieveGroupsByRed } = GroupsActions;

const PHome = (props) => {
  const { navigation } = props;
  const { t } = useTranslation();
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const selector = useSelector((state) => state.groups);
  const [tabs, setTabs] = useState([])
  const [tab, setTab] = useState(null);

  useEffect(() => {
    console.log('Gruposs: ' + JSON.stringify(selector));
    if(selector.groups && selector.groups.length > 0) {
      setTabs(selector.groups)
      setTab(selector.groups[0])
      
    }else {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'No tienes ningun grupo asignado!'
      });

    }
      
  }, [selector.groups]);
  
   


  


  const data = [
    {
      name: t('pending'),
      population: 70,
      color: colors.primaryLight,
      legendFontColor: '#7F7F7F'
    },
    {
      name: t('todo'),
      population: 20,
      color: BaseColor.kashmir,
      legendFontColor: '#7F7F7F'
    },
    {
      name: t('completed'),
      population: 10,
      color: colors.accent,
      legendFontColor: '#7F7F7F'
    }
  ];

  const groups = useMemo(() => {
    console.log("KKKK "+JSON.stringify(tab)+ " "+JSON.stringify(tabs))
    if(tab){
      Utils.enableExperimental();
      if (tab.id == 'all') {
        return tabs;
      } else {
        return tabs.filter((gr) => gr.id == tab.id);
      }
    }

  }, [tab]);

  const goProjectDetail = (item) => () => {
    /*dispatch(
      retrieveGroupsByRed('jovenes', (response) => {
        console.log('response G ');
      })
    );*/
    //navigation.navigate('PProjectView', { item: item });
  };

  const renderContent = () => {
    return (
      <View style={{ flex: 1 }}>
        {/* <View style={{ paddingHorizontal: 20, paddingBottom: 10 }}>
                    <Text header bold>
                        {t("overview")}
                    </Text>
                    <Text subhead grayColor style={{ marginTop: 5 }}>
                        {t("discover_last_news_today")}
                    </Text>
                </View> */}
        <PieChart data={data} />
        <TabTag
          style={{ paddingHorizontal: 10, paddingBottom: 20 }}
          tabs={[...tabs, {id: 'all', name: t('all')}]}
          tab={tab}
          onChange={(tab) => setTab(tab)}
        />
        <FlatList
          contentContainerStyle={styles.paddingFlatList}
          data={groups}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <Project02
              title={item.name}
              description={item.description}
              days={item.days}
              members={item.members}
              progress={item.progress}
              onPress={goProjectDetail(item)}
              style={{
                marginBottom: 20
              }}
            />
          )}
        />
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={BaseStyle.safeAreaView} edges={['right', 'top', 'left']}>
        {tabs.length > 0 && (renderContent())}
      </SafeAreaView>
    </View>
  );
};

export default PHome;
