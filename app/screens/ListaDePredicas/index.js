import { Button, Header, Icon, SafeAreaView, Text } from "@components";
import { BaseStyle, useTheme } from "@config";
import { parseHexTransparency } from "@utils";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, View } from "react-native";
import styles from "./styles";

export default function FTopUpCompleted({ route, navigation }) {
    const { colors } = useTheme();
    const { t } = useTranslation();

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
                        <Text title1>Dios ocupó nuestro lugar</Text>
                       
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
                        Confia en Jesus y valora su sacrficio. El cargo con nuestros pecados, enfermedades
                        y pobrezas para darnos salvacion, salud y riqueza
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
                            textAlign: "justified",
                        }}
                    >
                        Esta es una historia escrita por el filósofo y teólogo de origen danés Søren Kierkegaard. Un príncipe buscaba una
doncella para casarse. Un día, mientras su carroza
atravesaba una región muy pobre, asomó la cabeza por la
ven- tana y vio a una hermosa doncella de la cual se
enamoró.En los días siguientes pasó por el mismo lugar
para verla de nuevo. Quería pedirle que se casara con él
pero también quería que ella lo aceptara por amor, no por
interésu obligación. Entonces decidió vivir cerca de ella,
así quedejó su vestimenta real, compartió sus intereses y sus
preocupaciones. Con el tiempo, la doncella se enamoró de
él.Esto sucedió porque él la amó primero.

                    </Text>
                    <Text
                        headline
                        bold
                        style={{
                            marginTop: 4,
                            
                        }}
                    >
                        {("Libres de pecado • 1 Corintios 15:3")}
                    </Text>
                    <Text
                        body1
                        light
                        style={{
                            marginTop: 20,
                            marginBottom: 15,
                            textAlign: "justified",
                        }}
                    >
Jesús, al venir al mundo y morir, tomó nuestro lugar. Según
la Biblia, nosotros éramos culpables por el pecado, sin
embargo, Cristo llevó el castigo de esa culpa y nos dio
marzo 31
una nueva oportunidad de recibir el perdón. Gracias a
Él, nosotros hoy podemos vivir libres de culpa.
                    </Text>

                    <Text
                        headline
                        bold
                        style={{
                            marginTop: 4,
                            
                        }}
                    >
                        {("Sanos y prósperos • 2 Corintios 8:9, Mateo 8:17")}
                    </Text>
                    <Text
                        body1
                        light
                        style={{
                            marginTop: 20,
                            marginBottom: 15,
                            textAlign: "justified",
                        }}
                    >
                       El amor se demuestra por medio de lo que puedes dar,
no recibir. Algunos equivocadamente piden a su pareja la
famosa “prueba de amor”. “Si me amas, ¡me lo
demostrarás!”, dicen, pero el amor verdadero se demuestra
más enlo que das que en lo que demandas recibir. Así
como Je-sús, que desinteresadamente nos dio la salvación
sin pedir nada a cambio. Ese es el ejemplo que nuestro
Señor nos comparte y la forma como debemos amar.
                    </Text>

                    <Text
                        headline
                        bold
                        style={{
                            marginTop: 4,
                            
                        }}
                    >
                        {("Equipados para alcanzarlo • Marcos 16:18, Deuteronomio 8:18")}
                    </Text>
                    <Text
                        body1
                        light
                        style={{
                            marginTop: 20,
                            marginBottom: 15,
                            textAlign: "justified",
                        }}
                    >
                       Quizá te preguntes: “Entonces, ¿por qué estoy enfermo?”
o “¿Por qué no tengo dinero?” A estas interrogantes
podemos encontrarles muchas respuestas o quizá ninguna,
pero lo importante es saber que Dios ha preparado una
vidapara que tengas salud y prosperidad, Él te da el
poderpara hacer riquezas y reclamar tu sanidad. Todo
depende de que tú alinees tus pensamientos y voluntad a
la delSeñor, para alcanzar lo que Él desea darte y por lo
queJesús ya pagó.
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
                            textAlign: "justified",
                        }}
                    >
                      Has recibido una gran
herencia de nuestro Señor Jesucristo, no la desperdicies.
Aprovecha que Él entregó Su vida para darnos vida,
salud yriqueza en abundancia. ¡Disfruta tu herencia! Jesús
pagó el precio para que fueras salvo, sano y próspero.
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
                            textAlign: "justified",
                        }}
                    >
                      Ahora, con fe en tu corazón,
declararás salud, prosperidad y salvación para ti y los tuyos.
 El primer paso es abrir tu corazón a Jesús, recibirlo
marzo 31
como Señor y Salvador de tu vida. A partir de entonces
podrás experimentar cómo tu vida empieza a ser
transformada.
                    </Text>

                    <Text
                        headline
                        bold
                        style={{
                            marginTop: 4,
                            
                        }}
                    >
                        {("Intercesión • 3 Juan 1:2 ")}
                    </Text>
                    <Text
                        body1
                        light
                        style={{
                            marginTop: 20,
                            marginBottom: 15,
                            textAlign: "justified",
                        }}
                    >
                      Oren por aquellos que aún no conocen la herencia que en
Dios tenemos: ser salvos, sanos y prósperos. Pidan al Señor
que los use para llevar esta Palabra a quien no la conoce.
                      
                    </Text>

                    <Text
                        headline
                        bold
                        style={{
                            marginTop: 4,
                            
                        }}
                    >
                        {("Ofrenda • Lucas 16:10")}
                    </Text>
                    <Text
                        body1
                        light
                        style={{
                            marginTop: 20,
                            marginBottom: 15,
                            textAlign: "justified",
                        }}
                    >
                     Jesús ya tomó nuestra pobreza para que podamos ser
fieles y prosperar. Demuéstrale, con tu ofrenda, que agradeces Su sacrificio y eres fiel dando para recibir.

                    </Text>

                    
                    <Text
                        headline
                        bold
                        style={{
                            marginTop: 4,
                            
                        }}
                    >
                        {("Más citas:")}
                    </Text>
                    <Text
                        body1
                        light
                        style={{
                            marginTop: 20,
                            marginBottom: 15,
                            textAlign: "justified",
                        }}
                    >
                      Jeremías 29:11, Isaías 45:1-4, Hechos 5:16

                    </Text>




                   
                </View>
            </ScrollView>
            
        </SafeAreaView>
    );
}
