import React, { useState } from "react";
import { Text, Alert } from "react-native";
import {
  Container,
  FormBox,
  MainContent,
} from "../../components/Container/style";
import { LogoComponent } from "../../components/Logo";
import { Title } from "../../components/Title/style";
import { Paragraph } from "../../components/Paragraph/style";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button/style";
import { ButtonTitle } from "../../components/ButtonTitle/style";
import { LeftArrowAOrXComponent } from "../../components/LeftArrowAOrX";
import { apiGabriel } from "../../Services/Service";

const RecoverPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");

  const enviarEmail = async () => {
    try {
      const response = await apiGabriel.post(`/RecuperarSenha?email=${email}`);

      if(response.data){
        // Após o envio do email navegar para a próxima tela
        navigation.navigate('CheckEmail', { emailRecuperacao: email });
      }

    } catch (error) {
      console.log(error);
    
    }
  };

  return (
    <Container>
      <MainContent>
        <LeftArrowAOrXComponent navigation={navigation} />

        <LogoComponent />

        <FormBox>
          <Title>Recuperar senha</Title>
          <Paragraph>
            Digite abaixo seu email cadastrado que enviaremos um link para
            recuperação de senha
          </Paragraph>

          <Input
            placeholder={"Usuário ou E-mail"}
            fieldValue={email}
            onChangeText={txt => setEmail(txt)}
          />
          <Button onPress={enviarEmail}>
            <ButtonTitle>Continuar</ButtonTitle>
          </Button>

        </FormBox>
      </MainContent>
    </Container>
  );
};

export default RecoverPasswordScreen;
