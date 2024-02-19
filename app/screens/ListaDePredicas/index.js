import { Button, Header, Icon, SafeAreaView, Text } from "@components";
import { BaseStyle, useTheme } from "@config";
import { parseHexTransparency } from "@utils";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, View } from "react-native";
import styles from "./styles";
import { getFirestore, collection, onSnapshot , getDoc, query, where} from "firebase/firestore";




const ListaDePredicas = (props) => {
    const { navigation } = props;
    const { colors } = useTheme();
    const { t } = useTranslation();
    const db = getFirestore();
    const dbRef = collection(db, "pitch");

    const [valores, setValores] = useState([]);

    useEffect(() => {
    onSnapshot(dbRef, docsSnap => {
       docsSnap.forEach(doc => {
       const valores = (doc.data());
       console.log(valores);
      setValores(valores)
        })
        
    })
}, [])
    
    return (
        <SafeAreaView style={BaseStyle.safeAreaView}>
            <Header
                title={t("Predicas")}
                renderLeft={() => {
                    return (
                        <Icon
                            name="angle-left"
                            size={20}
                            color={colors.text}
                            enableRTL={true}
                        />
                    );
                }}
                onPressLeft={() => navigation.goBack()}
                onPressRight={() => navigation.navigate("Home")}
              
            />

            <ScrollView
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 20 }}
            >
                <View style={[styles.headerView]}>
                    <View
                        style={{
                            paddingVertical: 10,
                            alignItems: "center",
                        }}

                        
                        
                    >

<Text
                        headline
                        bold
                        style={{
                            marginTop: 5,
                            
                            textAlign: "righ",

                            

                        }}
                    >
                        {valores.week}
                    </Text>
                    
                        <Text title1>{valores.title}</Text>
                       
                    </View>
                    <View
                        style={{
                            width: 300,
                            height: 150,
                            borderRadius: 10,
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: parseHexTransparency(
                                colors.primary,
                                30
                            ),
                        }}
                    >
                       <Text
                        body1
                        light
                        style={{
                            marginTop: 10,
                            marginBottom: 1,
                            textAlign: "center",
                        }}
                    >
                        {valores.subtitle}
                    </Text>
            
                        
                    </View>

                    
                 
                    <Text
                        headline
                        bold
                        style={{
                            marginTop: 15,
                            
                            textAlign: "righ",

                            

                        }}
                    >
                        {("Introducción")}
                    </Text>
                    
                    <Text
                        body1
                        light
                        style={{
                            marginTop: 20,
                            marginBottom: 15,
                            textAlign: "justify",
                        }}
                    >
                        {valores.intro}

                    </Text>
                    <Text
                        headline
                        bold
                        style={{
                            marginTop: 4,
                            
                        }}
                    >
                        {valores.text_content1}
                    </Text>
                    <Text
                        body1
                        light
                        style={{
                            marginTop: 20,
                            marginBottom: 15,
                            textAlign: "justify",
                        }}
                    >
                    {valores.content1}
                    </Text>

                    <Text
                        headline
                        bold
                        style={{
                            marginTop: 4,
                            
                        }}
                    >
                        {valores.text_content2}
                    </Text>
                    <Text
                        body1
                        light
                        style={{
                            marginTop: 20,
                            marginBottom: 15,
                            textAlign: "justify",
                        }}
                    >
                       {valores.content2}
                    </Text>

                    <Text
                        headline
                        bold
                        style={{
                            marginTop: 4,
                            
                        }}
                    >
                        {valores.text_content3}
                    </Text>
                    <Text
                        body1
                        light
                        style={{
                            marginTop: 20,
                            marginBottom: 15,
                            textAlign: "justify",
                        }}
                    >
                       {valores.content3}
                    </Text>

                    <Text
                        headline
                        bold
                        style={{
                            marginTop: 4,
                            
                        }}
                    >
                        {("Conclusión y aplicación: ")}
                    </Text>
                    <Text
                        body1
                        light
                        style={{
                            marginTop: 20,
                            marginBottom: 15,
                            textAlign: "justify",
                        }}
                    >
                     {valores.finality}
                    </Text>

                    <Text
                        headline
                        bold
                        style={{
                            marginTop: 4,
                            
                        }}
                    >
                        {("Llamado y ministración: ")}
                    </Text>
                    <Text
                        body1
                        light
                        style={{
                            marginTop: 20,
                            marginBottom: 15,
                            textAlign: "justify",
                        }}
                    >
                     {valores.ministration}
                    </Text>

                    <Text
                        headline
                        bold
                        style={{
                            marginTop: 4,
                            
                        }}
                    >
                        {valores.text_intercession}
                    </Text>
                    <Text
                        body1
                        light
                        style={{
                            marginTop: 20,
                            marginBottom: 15,
                            textAlign: "justify",
                        }}
                    >
                      {valores.ministration}
                    </Text>

                    <Text
                        headline
                        bold
                        style={{
                            marginTop: 4,
                            
                        }}
                    >
                        {valores.text_offer}
                    </Text>
                    <Text
                        body1
                        light
                        style={{
                            marginTop: 20,
                            marginBottom: 15,
                            textAlign: "justify",
                        }}
                    >
                     {valores.offer}
                    </Text>

                    
                   

                   
                </View>
            </ScrollView>
            
        </SafeAreaView>
    );
}
export default ListaDePredicas


