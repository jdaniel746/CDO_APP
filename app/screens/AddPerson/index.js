import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigation, useTheme } from "@react-navigation/native";
import { Header } from "../../components";
import { SafeAreaView, View } from "react-native";
import { BaseStyle } from "../../config";
import Icon from "react-native-vector-icons/FontAwesome5";

export default function AddPerson() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { colors } = useTheme();

  return (
    <SafeAreaView style={BaseStyle.safeAreaView} edges={['right', 'top', 'left']}>
      <Header
        title={t('add_person')}
        renderLeft={() => {
          return <Icon name="angle-left" size={20} color={colors.text} enableRTL={true} />;
        }}
        onPressLeft={() => {
          navigation.goBack();
        }}
      />
      <View style={{ flex: 1, paddingHorizontal: 20 }}>
        
      </View>
    </SafeAreaView>
  )
}