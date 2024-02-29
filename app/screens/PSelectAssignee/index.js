import {
  Header,
  Icon,
  ListTextButton,
  SafeAreaView,
  TabSlider,
  Tag,
  TextInput,
  Text
} from '@components';
import { BaseColor, BaseStyle, useTheme } from '@config';
import { FFriends } from '@data';
import { MemberActions } from '@actions';
import { useNavigation, useRoute } from '@react-navigation/native';
import { haveChildren } from '@utils';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { PButtonAddUser } from '../../components';
import Spinner from "react-native-loading-spinner-overlay";
import supabase from '../../config/supabase';
const { setSelectedMembers } = MemberActions;

export default function PSelectAssignee() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const navigation = useNavigation();
  const [keyword, setKeyword] = useState('');
  const [friends, setFriends] = useState([]);
  const route = useRoute();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (route?.params?.members) {
      const members = route?.params?.members || [];
      const ids = members.map((item) => item.id);
      setFriends(
        friends.map((item, index) => ({
          ...item,
          isSelect: ids.includes(item.id)
        }))
      );
    }
  }, [route?.params?.members]);

  useEffect(() => {
    async function group() {
        let { data: personGroup, error2 } = await supabase
        .from('person_group')
        .select('person_id')
        .eq('group_id', route?.params?.groupId)
  
        if(personGroup.length > 0) {
          let {data, errors3} = await supabase.from('person').select('id, firstname, lastname, photo')
            .in(
              'id',
              personGroup.map((p) => p.person_id.toString())
            );
            if(data && data.length > 0 ) setFriends(data.map((item, index) => ({
              ...item,
              isSelect: false
            })))
        }
    }
    if (route?.params?.groupId) {
      group()
    }
   console.log(route?.params)
   
  }, [route?.params?.groupId]);

  const filterCategory = (text) => {
    setKeyword(text);
    if (text) {
      setFriends(
        FFriends.filter((item) => haveChildren(item.name, text) || haveChildren(item.total, text))
      );
    } else {
      setFriends(FFriends);
    }
  };

  const onSelect = (user) => {
    console.log(user)
    setFriends(
      friends.map((item) => (item.id === user.id ? { ...item, isSelect: !user.isSelect } : item))
    );
  };

  const onSave = () => {
    console.log("save "+JSON.stringify(friends.filter((item) => item.isSelect )))
    dispatch(
      setSelectedMembers(friends.filter((item) => item.isSelect ), (response) => {
        console.log('response:' + JSON.stringify(response));
      })
    );
    navigation.goBack();
  };

  return (
    <>
      {isLoading && (
        <Spinner visible={isLoading} />
      )}
    <SafeAreaView style={BaseStyle.safeAreaView} edges={['right', 'top', 'left']}>
      <Header
        title={t('select_assignee')}
        renderLeft={() => {
          return <Icon name="angle-left" size={20} color={colors.text} enableRTL={true} />;
        }}
        onPressLeft={() => {
          navigation.goBack();
        }}
        renderRight={() => {
          return (
            <Text headline primaryColor>
              {t('save')}
            </Text>
          );
        }}
        onPressRight={onSave}
      />
      <View style={{ flex: 1, paddingHorizontal: 20 }}>
        <View
          style={{
            paddingTop: 15,
            paddingBottom: 20,
            justifyContent: 'space-between',
            flexDirection: 'row'
          }}>
          <PButtonAddUser
            onPress={() =>
              navigation.navigate('AddNewPerson')
            }/>
          <TextInput
            onChangeText={filterCategory}
            placeholder={t('name_username_or_email')}
            value={keyword}
            icon={
              <TouchableOpacity onPress={() => filterCategory('')}>
                <Icon name="times" size={16} color={BaseColor.grayColor} />
              </TouchableOpacity>
            }
            style={{width: '80%'}}
          />
        </View>
        <FlatList
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          data={friends}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <ListTextButton
              image={item.photo}
              name={item.firstname + " " +item.lastname}
              description={item.total}
              componentRight={
                item.isSelect ? (
                  <TouchableOpacity
                    style={{
                      paddingHorizontal: 30,
                      paddingVertical: 5
                    }}
                    onPress={(e) => {
                      e.stopPropagation();
                      onSelect(item);
                    }}>
                    <Icon name="check" size={18} color={colors.primary} />
                  </TouchableOpacity>
                ) : (
                  <Tag
                    onPress={(e) => {
                      e.stopPropagation();
                      onSelect(item);
                    }}
                    outline
                    style={{
                      paddingHorizontal: 20,
                      backgroundColor: colors.background
                    }}>
                    {`${t('select')}`}
                  </Tag>
                )
              }
            />
          )}
        />
      </View>
    </SafeAreaView>
    </>
  );
}
