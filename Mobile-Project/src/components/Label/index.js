import { useEffect } from "react";
import { Theme } from "../../themes";
import { Input } from "../Input";
import { ParagraphMA500, ParagraphSemiBold } from "../Paragraph/style";
import {
  ImageTextContainer,
  LabelImage,
  LabelImageButton,
  LabelImageView,
  LabelStyle,
} from "./style";
import { Feather } from "@expo/vector-icons";

const Label = ({
  titulo = "",
  placeholder,
  fieldValue,
  onChangeText,
  keyboardType,
  maxLength,
  onEndEditing,
  fieldWidth = 100,
  fieldHeight = 55,
  backGround = "",
  border = "",
  fieldMaxWidth = 100,
  widthLabel,
  maxWidthLabel,
  placeholderTextColor,
  fieldPaddingBottom,
  textColor,
  fieldTextAlign,
  isTitulo = true,
  fieldMinHeight,
  editable,
  pointerEvents,
  autoFocus,
  refInput,
  autoCorrect,
  isImage = false,
  imageExists = false,
  uri = "",
  onPressImage,
  onPress,
}) => {
  return (
    <LabelStyle
      pointerEvents={pointerEvents}
      widthLabel={widthLabel}
      maxWidthLabel={maxWidthLabel}
      isImage={isImage}
    >
      {isTitulo && <ParagraphSemiBold>{titulo}</ParagraphSemiBold>}

      {isImage && imageExists ? (
        <LabelImageButton onPress={onPressImage}>
          <LabelImage
            source={{
              uri: uri,
            }}
          />
        </LabelImageButton>
      ) : isImage && !imageExists ? (
        <LabelImageButton onPress={onPressImage}>
          <Feather
            style={{ marginRight: 10 }}
            name="alert-circle"
            size={20}
            color={Theme.colors.grayV2}
          />
          <ParagraphMA500>Nenhuma foto informada!</ParagraphMA500>
        </LabelImageButton>
      ) : (
        !isImage && (
          <Input
            autoCorrect={autoCorrect}
            ref={refInput}
            autoFocus={autoFocus}
            editable={editable}
            textColor={textColor}
            placeholderTextColor={placeholderTextColor}
            placeholder={placeholder}
            fieldValue={fieldValue}
            onChangeText={onChangeText}
            keyboardType={keyboardType}
            maxLength={maxLength}
            onEndEditing={onEndEditing}
            fieldWidth={fieldWidth}
            fieldHeight={fieldHeight}
            border={border}
            backGround={backGround}
            fieldMaxWidth={fieldMaxWidth}
            fieldPaddingBottom={fieldPaddingBottom}
            fieldTextAlign={fieldTextAlign}
            fieldMinHeight={fieldMinHeight}
          />
        )
      )}
    </LabelStyle>
  );
};

export default Label;
