import { useTranslation } from 'react-i18next';
import { useTheme, BaseStyle, BaseColor } from '../../config';
import { GroupLeaders, PTeamMembersInCreate } from '@data';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native";
import styles from './styles';
import {

  Button,
  Header,
  Icon,
  PButtonAddUser,
  ProductSpecGrid,
  ProfileGridSmall,
  SelectModal,
  TextInput,
  Upload
} from '../../components';
import dayjs from 'dayjs';
import React, { useState, Fragment, useEffect } from 'react';
import Avatars from '../../components/Avatars';
import { useSelector } from 'react-redux';
import DateTimePicker from "react-native-modal-datetime-picker";
import supabase from "../../config/supabase";
import { useRealtime } from "react-supabase";


const eventList = [
  {
    value: 'most_helpful',
    text: 'Grupo'
  },
  {
    value: 'most_favourable',
    text: 'Discipulado'
  },
  {
    value: 'most_crictical',
    text: 'Domingo'
  },
  {
    value: 'most_recent',
    text: 'Otros'
  }
];

const AssistanceGroup = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const date = dayjs(new Date()).format('DD-MMM-YYYY');
  const [grupo, setGrupo] = useState();
  const [event, setEvent] = useState();
  const [assistants, setAssistants] = useState([]);
  const auth = useSelector((state) => state.auth);
  const [offerUSD, setOfferUSD] = useState('0');
  const [offerVES, setOfferVES] = useState('0');
  const [comment, setComment] = useState('');
  const [isDateTimePickerVisible, setIsDateTimePickerVisible] = useState(false);
  const [dateAssistance, setDateAssistance] = useState(date)
  const [groups, setGroups] = useState([])
  const [eventList, setEventList] = useState([])
  //const [result, reexecute] = useRealtime('task')
  //const  {data: groups, error, fetching } = result;
  useEffect(() => {
    async function fetch() {
      let { data: groups, error } = await supabase
        .from('groups')
        .select(' id, name')
        .contains('leaders', [auth.user.id])
      if(groups.length > 0){
        setGroups(groups.map((gr) => {
          let temp = {}
          temp.value = gr.id
          temp.text = gr.name
          return temp
        }))
      }
      let { data: events, error2 } = await supabase
        .from('events')
        .select(' id, name')
console.log("EVENTS"+JSON.stringify(events))
      if(events.length > 0) {
        setEventList(events.map((e) => {
          let temp = {}
          temp.value = e.id.toString()
          temp.text = e.name
          return temp
        }))
      }
      let {data: leaders, errors3} = await supabase.from('person').select('id, firstname, lastname, photo')
      if(leaders.length > 0){
        console.log(leaders)
      }
    }
    fetch()
  }, []);



  const showDateTimePicker = () => {
    setIsDateTimePickerVisible(true);
  };

  const hideDateTimePicker = () => {
    setIsDateTimePickerVisible(false);
  };

  const handleDatePicked = (date) => {
    setDateAssistance(dayjs(date).format('DD-MMM-YYYY'));
    hideDateTimePicker();
  };

  const save = () => {
    <Text body1 style={{ marginTop: 4, marginRight: 4 }}></Text>
    

  }

  const renderDate = () => {
    return (
      <TouchableOpacity onPress={showDateTimePicker} style={styles.specifications}>
        <Text body1 style={{ marginTop: 4, marginRight: 4 }}>
          {dateAssistance}
        </Text>
        <Icon name="calendar" size={25} style={{ backgroundColor: colors.background}} />
      </TouchableOpacity>
    )
  }

  return (
    <SafeAreaView style={{ marginTop: 30 }} edges={['right', 'top', 'left']}>
      <Header
        title={t('assistance_title')}
        renderLeft={() => {
          return <Icon name="angle-left" size={20} color={colors.primary} enableRTL={true} />;
        }}
        onPressLeft={() => {
          navigation.goBack();
        }}
        onPressRight={() => {
          navigation.goBack();
        }}
      />
     
      <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
        <DateTimePicker
          mode="date"
          isVisible={isDateTimePickerVisible}
          onConfirm={handleDatePicked}
          onCancel={hideDateTimePicker}
        />
        <View style={styles.contain}>
          <View style={styles.specifications}>
            <ProductSpecGrid style={{ flex: 1 }} title={date} description={t('assistance_date')} renderTitle={renderDate} />
            <SelectModal
              options={groups}
              selected={grupo}
              onApply={(item) => setGrupo(item)}
              label="group"
            />
          </View>
          <View style={[styles.specifications, { justifyContent: 'space-between' }]}>
            <Text style={styles.subtitle}>{t('group_leaders')}</Text>
            <SelectModal
              options={eventList}
              selected={event}
              onApply={(item) => setEvent(item)}
              label="event"
            />
          </View>
          <View style={{ marginTop: -20 }}>
            <Avatars users={GroupLeaders} limit={3} isShowMore={false} />
          </View>
          <Text caption1 grayColor>
            {GroupLeaders.map((member) => {
              return member.name;
            }).join(', ')}
          </Text>
          <View style={{ marginTop: 20 }}>
            <Text headline style={styles.subtitle}>
              {t('assistants')}
            </Text>
            <View style={styles.wrapContent}>
              {assistants.map((item, index) => {
                return (
                  <Fragment key={index}>
                    <View
                      style={{
                        width: '25%',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                    <ProfileGridSmall image={item.image} name={item.name} onPress={() => {}} />
                    </View>
                    
                    {index == assistants.length - 1 && (
                      <View
                        key={index}
                        style={{
                          width: '25%',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginBottom: 20
                        }}>
                        <PButtonAddUser
                          onPress={() => 
                            navigation.navigate('PeopleSelect', {
                              members: assistants
                            })
                          }
                        />
                      </View>
                    )}
                  </Fragment>
                );
              })}
              {assistants.length == 0 && (
                <View
                  key="emptyList"
                  style={{
                    width: '25%',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                  <PButtonAddUser
                    onPress={() => 
                      navigation.navigate('PeopleSelect', {
                        members: PTeamMembersInCreate
                      })
                    }
                  />
                </View>
                
              )}
            </View>
          </View>
          <View style={{ marginBottom: 10, marginTop: 10 }}>
            <Text headline style={styles.subtitle}>
              {t('offer_usd')}
            </Text>
            <TextInput
              style={[BaseStyle.textInput]}
              onChangeText={(text) => setOfferUSD(text)}
              autoCorrect={false}
              placeholder={'$ '}
              currency={true}
              placeholderTextColor={BaseColor.grayColor}
              value={offerUSD}
            />
          </View>
          <View style={{ marginBottom: 10, marginTop: 10 }}>
            <Text headline style={styles.subtitle}>
              {t('offer_ves')}
            </Text>
            <TextInput
              style={[BaseStyle.textInput]}
              onChangeText={(text) => setOfferVES(text)}
              autoCorrect={false}
              placeholder={'Bs '}
              currency={true}
              placeholderTextColor={BaseColor.grayColor}
              value={offerVES}
            />
          </View>
          <Text headline style={styles.subtitle}>
            {t('photo')}
          </Text>
          <Upload setUrl={(url) => console.log('URL: ' + url)} bucket="grupos" />
          <View style={{ marginBottom: 10, marginTop: 10 }}>
            <Text headline style={styles.subtitle}>
              {t('comment')}
            </Text>
            <TextInput
              style={[BaseStyle.textInput, { marginTop: 10, height: 120 }]}
              onChangeText={(text) => setComment(text)}
              textAlignVertical="top"
              multiline={true}
              autoCorrect={false}
              placeholder={t('write_a_comment')}
              placeholderTextColor={BaseColor.grayColor}
              value={comment}
            />
          </View>
          <View style={{ padding: 20, marginBottom: 20 }}>
            <Button full onPress={() => {}}>
              {t('confirm')}
            </Button>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AssistanceGroup;