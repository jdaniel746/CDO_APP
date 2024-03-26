import { useTranslation } from 'react-i18next';
import { useTheme, BaseStyle, BaseColor, Images} from '../../config';
import { PTeamMembersInCreate } from '@data';
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
import Spinner from "react-native-loading-spinner-overlay";
import Toast from "react-native-toast-message";
import member from '../../reducers/member';
import group from '../../reducers/group';
import getDateWeek from '../../utils/date';
  

const AssistanceGroup = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const date = dayjs(new Date()).format('DD-MMM-YYYY');
  const [grupo, setGrupo] = useState(null);
  const members = useSelector((state) => state.members);
  const [assistants, setAssistants] = useState([]);
  const auth = useSelector((state) => state.auth);
  const [offerUSD, setOfferUSD] = useState('0');
  const [offerVES, setOfferVES] = useState('0');
  const [comment, setComment] = useState('');
  const [isDateTimePickerVisible, setIsDateTimePickerVisible] = useState(false);
  const [dateAssistance, setDateAssistance] = useState(date)
  const [groups, setGroups] = useState([])
  const [eventList, setEventList] = useState([])
  const [event, setEvent] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [leaders, setLeaders] = useState([])
  const [SemanasReportadas, setSemanasReportadas] = useState([]);
  const [weekReport,  setWeekReport] = useState
  ([{value: '1', text: '1'},{value: '2', text: '2'},{value: '3', text: '3'},{value: '4', text: '4'},{value: '5', text: '5'},{value: '6', text: '6'},{value: '7', text: '7'},{value: '8', text: '8'},{value: '9', text: '9'},{value: '10', text: '10'},{value: '11', text: '11'},{value: '12', text: '12'},{value: '13', text: '13'},{value: '14', text: '14'},{value: '15', text: '15'}
  ,{value: '16', text: '16'},{value: '17', text: '17'},{value: '18', text: '18'},{value: '19', text: '19'},{value: '20', text: '20'},{value: '21', text: '21'},,{value: '16', text: '16'},{value: '17', text: '17'},{value: '18', text: '18'},{value: '19', text: '19'},{value: '20', text: '20'},{value: '21', text: '21'},{value: '22', text: '22'},{value: '23', text: '23'},{value: '24', text: '24'},{value: '25', text: '25'},{value: '26', text: '26'},{value: '27', text: '27'},,{value: '28', text: '28'},{value: '29', text: '29'},{value: '30', text: '30'},{value: '31', text: '31'},{value: '32', text: '32'},{value: '33', text: '33'},
  {value: '34', text: '34'},{value: '35', text: '35'},{value: '36', text: '36'},{value: '37', text: '37'},{value: '38', text: '38'},{value: '39', text: '39'},,{value: '40', text: '40'},{value: '41', text: '41'},{value: '42', text: '42'},{value: '43', text: '43'},{value: '44', text: '44'},{value: '45', text: '45'},{value: '46', text: '46'},{value: '47', text: '47'},{value: '48', text: '48'},{value: '49', text: '49'},{value: '50', text: '50'},{value: '51', text: '51'},,{value: '52', text: '52'},{value: '53', text: '53'}]);
  const [weekSelect, setweekSelect] = useState();

  const weekNumber = getDateWeek();

  useEffect(() => {
    async function fetch() {
      setIsLoading(true)
      let { data, error } = await supabase
        .from('groups')
        .select(' id, name, leaders')
        .contains('leaders', [auth.user.person_id.toString()])

      if(data.length > 0){
        let groupList = data.map((gr) => {
          return { value: gr.id, text: gr.name, leaders: gr.leaders}
        })
        setGroups(groupList)
        setGrupo(groupList[0])
        let {data: Semanas, error1 } = await supabase.from("report").select("week")
        console.log("Valores de SEA "+JSON.stringify(Semanas))
        setSemanasReportadas(Semanas)
        console.log("Estas fueron las semanas reportadas "+JSON.stringify(SemanasReportadas))
        
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'No tienes grupos asignados!'
        });
        navigation.navigate('Home')
      }
      let { data: dataEvent, error2 } = await supabase
        .from('events')
        .select(' id, name')

      if(dataEvent.length > 0) {
        let events = dataEvent.map((e) => {
          return { value: e.id, text: e.name}
        })
        setEventList(events)
        setEvent(events[0])
      }
      setIsLoading(false)
    }
    fetch()
  }, []);

 

  useEffect(() => {
    async function fetchLeaders() {
      let {data, errors3} = await supabase.from('person').select('id, firstname, lastname, photo')
        .in('id', groups.find((g) => g.value === grupo.value).leaders)
      if(data && data.length > 0){
        setLeaders(data)
        console.log(data)
      }
      setIsLoading(false)
    }
    if(grupo) {
      fetchLeaders()
    }
  }, [grupo]);

  useEffect(() => {
    if (members.members && Object.keys(members.members).length > 0) {
      console.log('miembros del grupo: ' + JSON.stringify(members.members));
      setAssistants(members.members.filter((item) => item.isSelect));
    }
  }, [members.members]);

  

 
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

 
  const resulSemana = weekReport.filter((w) => w.value <= weekNumber);
  console.log("aca es "+JSON.stringify(resulSemana))

  const SemanasNoreportadas = [];
  for (var i = 0; i < resulSemana.length; i++) {
      var igual=false;
       for (var j = 0; j < SemanasReportadas.length & !igual; j++) {
           if(resulSemana[i]['value'] == SemanasReportadas[j]['week']) 
                   igual=true;
       }
      if(!igual)SemanasNoreportadas.push(resulSemana[i]);
  }
  console.log("Estos son los valores que no se repiten "+JSON.stringify(SemanasNoreportadas));



  async function handleSubmit() {
   
    const created_by = auth.user.person_id
    const event_id = (event.value)
    group_id = (groups[0].value) 
    SemanaDeReporte = parseInt((weekSelect.value))
    week = SemanaDeReporte
    
    offer_amount_usud = offerUSD
    offer_amount_ves =  offerVES

    try {
    let {data: semana, error1 } = await supabase.from("report").select("week")
      const valorSemana = (semana)
      console.log("Estos son los valores "+JSON.stringify(valorSemana))

      const found = valorSemana.find(e => e.week === SemanaDeReporte);
      console.log("Valor de funcion "+JSON.stringify(found))

      const Busqueda = valorSemana.includes(found)
      console.log("este valor de semana es :"+JSON.stringify(Busqueda))

      if (Busqueda === true ){
        console.log("Hey aquiiii ")
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Este reporte ya fue registrado'
        });

      }else {
        let { data: report, error } = await supabase.from("report").insert({
          date, created_by, event_id, group_id, week})
          .select('id')
          console.log(report)
        console.log("data de report "+JSON.stringify(report)+"Error4 "+ " "+JSON.stringify(error))
  
        if (report.length > 0) {
          const valores = assistants.map((e) => {
            return { value: e.id}
          })
          console.log("valore id "+JSON.stringify(valores))
          for  (var i = 0; i <valores.length; i++){
            const Asistente =(valores[i].value)
            console.log("ID DE LOS ASISTENTES, "+JSON.stringify(Asistente))
            let { data: report_datail, error1 } = await supabase
            .from('report_datail')
            .insert([ { report_id: report[0].id,
              person_id: parseInt(Asistente)}])
              .select('id')
              console.log("valor de data "+JSON.stringify(report_datail)+" error2 valor "+ JSON.stringify(error1))  
          }   
        }  
        setIsLoading(false);
        if (error) {
          throw error;
        }
        Toast.show({
          type: 'success',
          text1: 'Exito',
          text2: ' Reporte Exitoso!'
        });
        
        navigation.navigate('Home')
        
      }

    } catch (error) {
      console.log("error al registrar" + " " +JSON.stringify(error));
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'No se guardo reporte!'
      });
    }
  }

  return (
    <>
      {isLoading && (
        <Spinner visible={isLoading} />
      )}
      { eventList &&  (
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
              <Text style={styles.subtitle}>{t('Current_Week')}</Text>
              <Text style={{alignItems: "center"}}>{weekNumber}</Text>

              
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
                <Avatars users={leaders.map((l) => { return {image: l.photo}})} limit={3} isShowMore={false} />
              </View>
              <Text caption1 grayColor>
                {leaders.map((member) => {
                  return member.firstname + ' ' + member.lastname;
                }).join(', ')}
              </Text>

              <View >
                <SelectModal
                  options={SemanasNoreportadas}
                  selected={weekSelect}
                  onApply={(item) => setweekSelect(item)}
                  label="Semana a reportar"
                />
               
              </View>
              
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
                          <ProfileGridSmall image={item.Images} name={item.name} onPress={() => {}} />
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
                                  members: assistants,
                                  groupId: grupo.value
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
                            members: assistants,
                            groupId: grupo.value
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
                <Button full onPress={handleSubmit}>
                  {t('confirm')}
                </Button>
              </View>

              
            </View>
          </ScrollView>
        </SafeAreaView>
      )}
    </>
  );
};

export default AssistanceGroup;