import { CardFileAttachment, Icon, Text } from "@components";
import { useTheme } from "@config";
import { PAttachmentsInTaskView } from "@data";
import React, { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

const Attachment = () => {
    const { colors } = useTheme();
    const { t } = useTranslation();
    return (
        <Fragment>
            {PAttachmentsInTaskView.map((item, index) => (
                <CardFileAttachment
                    style={{ paddingHorizontal: 0 }}
                    key={index}
                    icon={item.icon}
                    name={item.name}
                    percent={item.percent}
                    size={item.size}
                    backgroundIcon={item.backgroundIcon}
                    onPress={() => {}}
                />
            ))}
        </Fragment>
    );
};

export default Attachment;
