import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { View, TouchableOpacity, Switch, ScrollView } from "react-native";
import { BaseStyle, useTheme } from "@config";
import { BaseSetting } from "@config";
import { Header, SafeAreaView, Icon, Text } from "@components";
import { useTranslation } from "react-i18next";
import * as Utils from "@utils";
import styles from "./styles";
import { useNavigation } from "@react-navigation/native";
import { getInto } from "@selectors";
import { ApplicationActions } from "@actions";
const { setIntro } = ApplicationActions;

export default function Setting({ isShowHeader = true }) {
    const navigation = useNavigation();
    const { t, i18n } = useTranslation();
    const { colors } = useTheme();
    const forceDark = useSelector((state) => state.application.force_dark);
    const font = useSelector((state) => state.application.font);

    const [reminders, setReminders] = useState(true);
    const dispatch = useDispatch();
    const intro = useSelector(getInto);
    /**
     * @description Call when reminder option switch on/off
     */
    const toggleSwitch = (value) => {
        setReminders(value);
    };

    const darkOption = forceDark
        ? t("always_on")
        : forceDark != null
        ? t("always_off")
        : t("dynamic_system");

    const onChangeIntro = () => {
        dispatch(setIntro(!intro));
    };

    const renderContent = () => {
        return (
            <ScrollView
                contentContainerStyle={[
                    styles.contain,
                    { paddingTop: isShowHeader ? 15 : 0 },
                ]}
            >
                <TouchableOpacity
                    style={[
                        styles.profileItem,
                        {
                            borderBottomColor: colors.border,
                            borderBottomWidth: 1,
                        },
                    ]}
                    onPress={() => {
                        navigation.navigate("ChangeLanguage");
                    }}
                >
                    <Text body1>{t("language")}</Text>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                        }}
                    >
                        <Text body1 grayColor>
                            {Utils.languageFromCode(i18n.language)?.name}
                        </Text>
                        <Icon
                            name="angle-right"
                            size={18}
                            color={colors.primary}
                            style={{ marginLeft: 5 }}
                            enableRTL={true}
                        />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.profileItem,
                        {
                            borderBottomColor: colors.border,
                            borderBottomWidth: 1,
                        },
                    ]}
                    onPress={() => {
                        navigation.navigate("ThemeSetting");
                    }}
                >
                    <Text body1>{t("theme")}</Text>
                    <View
                        style={[
                            styles.themeIcon,
                            { backgroundColor: colors.primary },
                        ]}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.profileItem,
                        {
                            borderBottomColor: colors.border,
                            borderBottomWidth: 1,
                        },
                    ]}
                    onPress={() => navigation.navigate("SelectFontOption")}
                >
                    <Text body1>{t("font")}</Text>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                        }}
                    >
                        <Text body1 grayColor>
                            {font ?? t("default")}
                        </Text>
                        <Icon
                            name="angle-right"
                            size={18}
                            color={colors.primary}
                            style={{ marginLeft: 5 }}
                            enableRTL={true}
                        />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.profileItem,
                        {
                            borderBottomColor: colors.border,
                            borderBottomWidth: 1,
                        },
                    ]}
                    onPress={() => {
                        navigation.navigate("SelectDarkOption");
                    }}
                >
                    <Text body1>{t("dark_theme")}</Text>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                        }}
                    >
                        <Text body1 grayColor>
                            {darkOption}
                        </Text>
                        <Icon
                            name="angle-right"
                            size={18}
                            color={colors.primary}
                            style={{ marginLeft: 5 }}
                            enableRTL={true}
                        />
                    </View>
                </TouchableOpacity>
                <View
                    style={[
                        styles.profileItem,
                        {
                            borderBottomColor: colors.border,
                            borderBottomWidth: 1,
                        },
                        { paddingVertical: 15 },
                    ]}
                >
                    <Text body1>{t("notification")}</Text>
                    <Switch
                        size={18}
                        onValueChange={toggleSwitch}
                        value={reminders}
                    />
                </View>
                <View
                    style={[
                        styles.profileItem,
                        {
                            borderBottomColor: colors.border,
                            borderBottomWidth: 1,
                        },
                        { paddingVertical: 15 },
                    ]}
                >
                    <Text body1>{t("Display intro screen")}</Text>
                    <Switch onValueChange={onChangeIntro} value={intro} />
                </View>
                <View style={styles.profileItem}>
                    <Text body1>{t("app_version")}</Text>
                    <Text body1 grayColor>
                        {BaseSetting.appVersion}
                    </Text>
                </View>
            </ScrollView>
        );
    };

    if (!isShowHeader) {
        return renderContent();
    }

    return (
        <SafeAreaView
            style={BaseStyle.safeAreaView}
            edges={["right", "top", "left"]}
        >
            <Header
                title={t("setting")}
                renderLeft={() => {
                    return (
                        <Icon
                            name="angle-left"
                            size={20}
                            color={colors.primary}
                            enableRTL={true}
                        />
                    );
                }}
                onPressLeft={() => {
                    navigation.goBack();
                }}
            />

            {renderContent()}
        </SafeAreaView>
    );
}
