import { BaseColor, BaseStyle, useFont, useTheme } from '@config';
import PropTypes from 'prop-types';
import React, { forwardRef, useEffect, useState } from 'react';
import { I18nManager, TextInput, View } from 'react-native';
import { Text } from '@components';
import { useTranslation } from 'react-i18next';

const { format: formatCurrency } = Intl.NumberFormat('pt-BR', {
  currency: 'BRL',
  style: 'currency'
});

function useATMInput() {
  const [value, setValue] = useState('');
  function handleChange(value) {
    const decimal = Number(value.replace(/\D/g, '')) / 100;
    setValue(formatCurrency(decimal || 0).replace('R$\xa0', ''));
  }
  return [value, handleChange];
}

const Index = forwardRef((props, ref) => {
  const font = useFont();
  const { colors } = useTheme();
  const cardColor = colors.card;
  const {
    style,
    errors,
    name,
    onChangeText,
    onBlur,
    placeholder,
    value,
    success,
    currency,
    secureTextEntry,
    keyboardType,
    multiline,
    editable,
    textAlignVertical,
    icon,
    onSubmitEditing,
    inputStyle,
    ...attrs
  } = props;
  const { t } = useTranslation();
  const [values, setValues] = useATMInput();

  useEffect(() => {
    onChangeText(values);
  }, [values]);

  return (
    <>
      <View
        style={[
          errors ? BaseStyle.textInputError : BaseStyle.textInput,
          { backgroundColor: cardColor },
          style
        ]}>
        <TextInput
          ref={ref}
          name={name}
          style={[
            {
              fontFamily: `${font}-Regular`,
              flex: 1,
              height: '100%',
              textAlign: I18nManager.isRTL ? 'right' : 'auto',
              color: colors.text,
              paddingTop: 5,
              paddingBottom: 5
            },
            inputStyle
          ]}
          onChangeText={currency ? setValues : onChangeText}
          onBlur={onBlur}
          autoCorrect={false}
          placeholder={placeholder}
          placeholderTextColor={success ? BaseColor.grayColor : colors.primary}
          secureTextEntry={secureTextEntry}
          value={currency ? values : value}
          editable={editable}
          selectionColor={colors.primary}
          keyboardType={keyboardType}
          multiline={multiline}
          textAlignVertical={textAlignVertical}
          onSubmitEditing={onSubmitEditing}
          {...attrs}
        />
        {icon}
      </View>
      {errors && <Text style={BaseStyle.errorLabel}>{t(errors)}</Text>}
    </>
  );
});

Index.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  onChangeText: PropTypes.func,
  onBlur: PropTypes.func,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  success: PropTypes.bool,
  secureTextEntry: PropTypes.bool,
  keyboardType: PropTypes.string,
  multiline: PropTypes.bool,
  editable: PropTypes.bool,
  currency: PropTypes.bool,
  textAlignVertical: PropTypes.string,
  icon: PropTypes.node,
  onSubmitEditing: PropTypes.func,
  inputStyle: PropTypes.object
};

Index.defaultProps = {
  inputStyle: {},
  style: {},
  name: '',
  errors: '',
  onChangeText: () => {},
  onBlur: () => {},
  placeholder: 'Placeholder',
  value: '',
  success: true,
  secureTextEntry: false,
  keyboardType: 'default',
  multiline: false,
  editable: true,
  textAlignVertical: 'center',
  icon: null,
  currency: false,
  onSubmitEditing: () => {}
};

export default Index;
