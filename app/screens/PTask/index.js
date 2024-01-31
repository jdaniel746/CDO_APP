import {
    Header,
    Icon,
    Ticket,
    PSelectOption,
    SafeAreaView,
    Tag,
    Text,
} from "@components";
import { BaseColor, BaseStyle, useTheme } from "@config";
import { PTasks, PTaskPriority, PTaskStatus, PTaskType } from "@data";
import { useNavigation } from "@react-navigation/native";
import * as Utils from "@utils";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, ScrollView, View } from "react-native";
import styles from "./styles";

const PTask = ({}) => {
    const navigation = useNavigation();
    const { t } = useTranslation();
    const { colors } = useTheme();
    const [tasks, setTasks] = useState(PTasks);
    const [sort, setSort] = useState("sort");
    const [type, setType] = useState([]);
    const [status, setStatus] = useState([]);
    const [priority, setPriority] = useState([]);

    const handleSort = () => {
        const tasks = [...PTasks];
        tasks.sort((a, b) => {
            var priorityA = a.priorityID;
            var priorityB = b.priorityID;
            if (priorityB < priorityA) {
                return sort == "caret-down" ? -1 : 1;
            }
            if (priorityB > priorityA) {
                return sort == "caret-down" ? 1 : -1;
            }

            return 0;
        });
        return tasks;
    };

    const onSort = () => {
        Utils.enableExperimental();
        switch (sort) {
            case "sort":
                setTasks(handleSort());
                setSort("caret-down");
                break;
            case "caret-down":
                setTasks(handleSort());
                setSort("caret-up");
                break;
            case "caret-up":
                setTasks(PTasks);
                setSort("sort");
                break;
            default:
                setTasks(PTasks);
                setSort("sort");
                break;
        }
    };

    const goTaskDetail = (item) => {
        navigation.navigate("PTaskView", { item: item });
    };

    const onFilter = (data) => {
        if (data.length > 0) {
            setTasks(PTasks.filter((item) => item.id <= data.length));
        } else {
            setTasks(PTasks);
        }
    };

    const onChangeType = (type) => {
        onFilter(type);
        setType(type);
    };
    const onChangePriority = (type) => {
        onFilter(type);
        setPriority(type);
    };
    const onChangeStatus = (type) => {
        onFilter(type);
        setStatus(type);
    };

    return (
        <SafeAreaView
            style={BaseStyle.safeAreaView}
            edges={["right", "top", "left"]}
        >
            <Header
                title={t("tasks")}
                renderRight={() => {
                    return (
                        <Text headline primaryColor>
                            {t("create")}
                        </Text>
                    );
                }}
                onPressRight={() => {
                    navigation.navigate("PTaskCreate");
                }}
            />
            <View style={[styles.filter, { borderColor: colors.border }]}>
                <Tag
                    gray
                    style={{
                        borderRadius: 3,
                        backgroundColor: BaseColor.kashmir,
                        marginHorizontal: 5,
                        paddingVertical: 3,
                    }}
                    textStyle={{
                        paddingHorizontal: 4,
                        color: BaseColor.whiteColor,
                    }}
                    icon={
                        <Icon
                            name={sort}
                            color={BaseColor.whiteColor}
                            size={10}
                        />
                    }
                    onPress={onSort}
                >
                    {t("sort")}
                </Tag>
                <Tag
                    gray
                    style={{
                        borderRadius: 3,
                        backgroundColor: BaseColor.kashmir,
                        marginHorizontal: 5,
                        paddingVertical: 3,
                    }}
                    textStyle={{
                        paddingHorizontal: 4,
                        color: BaseColor.whiteColor,
                    }}
                    icon={
                        <Icon
                            name="sliders-h"
                            color={BaseColor.whiteColor}
                            size={10}
                        />
                    }
                    onPress={() => navigation.navigate("PFilter")}
                >
                    {t("filter")}
                </Tag>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                >
                    <PSelectOption
                        title={t("type")}
                        options={PTaskType}
                        value={type}
                        onPress={(item) => onChangeType(item)}
                    />
                    <PSelectOption
                        title={t("priority")}
                        options={PTaskPriority}
                        value={priority}
                        onPress={(item) => onChangePriority(item)}
                    />
                    <PSelectOption
                        title={t("status")}
                        options={PTaskStatus}
                        value={status}
                        onPress={(item) => onChangeStatus(item)}
                    />
                </ScrollView>
            </View>
            <FlatList
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                data={tasks}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => (
                    <Ticket
                        title={item.title}
                        description={item.description}
                        priority={item.priority}
                        date={item.date}
                        comments={item.comments}
                        members={item.members}
                        onPress={() => goTaskDetail(item)}
                        style={{
                            marginBottom: 20,
                        }}
                    />
                )}
            />
        </SafeAreaView>
    );
};

export default PTask;
