// import da camera
import { Camera, requestCameraPermissionsAsync, CameraView } from "expo-camera";

import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";

// import style
import {
  CameraFlip,
  CameraComponentStyle,
  CameraModalContent,
  CameraModalStyle,
  CameraTypeSwitchButton,
  CameraTypeSwitchText,
  CapturePhotoButton,
  LastPhoto,
  CameraStyle,
  CloseCameraButton,
} from "./style";

// import do modal
import {
  Image,
  Modal,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";

// import do react
import { useEffect, useRef, useState } from "react";
import { Theme } from "../../themes";
import { LeftArrowAOrXCameraComponent } from "../LeftArrowAOrX";

import * as MediaLibrary from "expo-media-library";
import * as ImagePicker from "expo-image-picker";
import { apiFilipe } from "../../Services/Service";
import DialogComponent from "../Dialog/Dialog";

const CameraComponent = ({
  visible,
  // setShowCameraInfoModal,
  // visibleInfo,
  setShowCameraModal,
  setUriCameraCapture,
  navigation,
  getMediaLibrary = false,
  ...rest
}) => {
  const [photo, setPhoto] = useState(null);
  const cameraReference = useRef(null);
  const [tipoCamera, setTipoCamera] = useState("back");
  const [openModal, setOpenModal] = useState(false);
  const [lastPhoto, setLastPhoto] = useState(null);

  const [dialog, setDialog] = useState({});

  const [showDialog, setShowDialog] = useState(false);

  const SendPhotoForm = async () => {
    await setUriCameraCapture(photo);
    HandleClose();
  };

  //o normal estava bugado. Erro de assincronidade: ele enviava o null antes de alterar o valor da uriCameraCapture
  const SendPhotoForm2 = async (photo) => {
    await setUriCameraCapture(photo);
    HandleClose();
  };
  const HandleClose = () => setShowCameraModal(false);

  const UploadPhoto = async () => {
    try {
      await MediaLibrary.createAssetAsync(photo);

      await SendPhotoForm();
      setOpenModal(false);
    } catch (error) {
      setDialog({
        status: "erro",
        contentMessage: "Não foi possível processar a foto",
      });
      setShowDialog(true);
    }
  };

  const clearPhoto = () => {
    setPhoto(null);

    setOpenModal(false);
  };

  const CapturePhoto = async () => {
    if (cameraReference) {
      const photo = await cameraReference.current.takePictureAsync();
      setPhoto(photo.uri);

      setOpenModal(true);
    }
  };

  const selectImageGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (!result.canceled) {
        setPhoto(result.assets[0].uri);

        await setUriCameraCapture(result.assets[0].uri);

        await SendPhotoForm2(result.assets[0].uri);
      }
    } catch (error) {
      setDialog({
        status: "erro",
        contentMessage: "Erro ao salvar foto.",
      });
      setShowDialog(true);
    }
  };

  const getLatestPhoto = async () => {
    try {
      //busca as fotos da galeria e ordena em ordem decrescente
      const { assets } = await MediaLibrary.getAssetsAsync({
        sortBy: [[MediaLibrary.SortBy.creationTime, false]],
        //indica que só quer o primeiro ícone
        first: 1,
      });

      if (assets.length > 0) {
        setLastPhoto(assets[0].uri);
      }
    } catch (error) {}
  };

  // const requestGaleriaPermissions = async () => {
  //   await Camera.requestCameraPermissionsAsync();
  //   await MediaLibrary.requestPermissionsAsync();
  //   await ImagePicker.requestMediaLibraryPermissionsAsync();
  // };

  useEffect(() => {
    //verificar se tem a necessidade de mostrar a galeria

    // (async () => {
    //   const { status: cameraStatus } =
    //     await Camera.requestCameraPermissionsAsync();
    // })();

    // requestGaleriaPermissions(); //TAVA SEM PARANTESES

    if (getMediaLibrary) {
      getLatestPhoto();
    }

    return (cleanUp = () => {});
  }, [visible]);

  return (
    <CameraStyle visible={visible}>
      <DialogComponent
        {...dialog}
        visible={showDialog}
        setVisible={setShowDialog}
        setDialog={setDialog}
      />
      <CameraComponentStyle
        ref={cameraReference}
        ratio="16:9"
        facing={tipoCamera}
      >
        <CameraFlip>
          <CloseCameraButton>
            <LeftArrowAOrXCameraComponent
              navigation={navigation}
              isLefArrow={false}
              onPress={() => HandleClose()}
            />
          </CloseCameraButton>

          <CapturePhotoButton onPress={() => CapturePhoto()}>
            <FontAwesome name="camera" size={23} color={Theme.colors.primary} />
          </CapturePhotoButton>

          <CameraTypeSwitchButton
            onPress={() =>
              setTipoCamera(tipoCamera === "back" ? "front" : "back")
            }
          >
            <FontAwesome6
              name="arrows-rotate"
              size={23}
              color={Theme.colors.whiteColor}
            />
          </CameraTypeSwitchButton>

          {lastPhoto !== null && (
            <TouchableHighlight onPress={() => selectImageGallery()}>
              <LastPhoto source={{ uri: lastPhoto }} />
            </TouchableHighlight>
          )}
        </CameraFlip>
      </CameraComponentStyle>

      <CameraModalStyle
        animationType="slide"
        transparent={false}
        visible={openModal}
      >
        <CameraModalContent>
          {/* ARRUMAR ISSO DEPOIS */}

          <View style={{ margin: 10, flexDirection: "row", gap: 20 }}>
            <TouchableOpacity
              style={styles.btnClear}
              onPress={() => clearPhoto()}
            >
              <FontAwesome name="trash" size={35} color="#ff0000" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.btnUpload}
              onPress={() => UploadPhoto()}
            >
              <FontAwesome name="upload" size={35} color="#121212" />
            </TouchableOpacity>
          </View>
          <Image
            style={{ width: "100%", height: 500, borderRadius: 15 }}
            source={{ uri: photo }}
          />
        </CameraModalContent>
      </CameraModalStyle>
    </CameraStyle>
  );
};

export default CameraComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  camera: {
    flex: 1,
    height: "80%",
    width: "100%",
  },
  viewFlip: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
  },
  btnFlip: {
    padding: 20,
  },
  txtFlip: {
    fontSize: 20,
    color: "#fff",
    marginBottom: 20,
  },
  btnCapture: {
    padding: 20,
    margin: 20,
    borderRadius: 10,
    backgroundColor: "#121212",

    justifyContent: "center",
    alignItems: "center",
  },
  btnClear: {
    padding: 20,
    backgroundColor: "transparent",

    justifyContent: "center",
    alignItems: "center",
  },
  btnUpload: {
    padding: 20,
    backgroundColor: "transparent",

    justifyContent: "center",
    alignItems: "center",
  },
});
