import { Icon, ModalFilter, ProductSpecGrid } from '../index';
import { TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { useTheme } from '@react-navigation/native';
import PropTypes from 'prop-types';

const SelectModal = (props) => {
  const { t } = useTranslation();
  const { options, onApply, selected, label } = props;
  const [optionsList, setOptionList] = useState(options);
  const [selectedItem, setSelectedItem] = useState(selected);
  const { colors } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);

  const onSelectFilter = (item) => {
    setSelectedItem(item);
    setOptionList(
      options.map((option) => ({
        ...option,
        checked: item.value === option.value
      }))
    );
  };

  useEffect(() => {
    if(options.length > 0 && selected != null ) {
      onSelectFilter(selected);
    }
  }, [options, selected]);

  return (
    <>
      <View>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center'
          }}
          onPress={() => {
            setModalVisible(true);
          }}>
          <ProductSpecGrid title={selectedItem?.text} description={t(label)} />
          <Icon name="angle-down" size={14} color={colors.text} />
        </TouchableOpacity>
      </View>
      {options && (
        <ModalFilter
          options={optionsList}
          isVisible={modalVisible}
          onSwipeComplete={() => {
            setModalVisible(false);
          }}
          onApply={() => {
            onApply(selectedItem);
            setModalVisible(false);
          }}
          onSelectFilter={onSelectFilter}
        />
      )}
    </>
  );
};

SelectModal.defaultProps = {
  options: [],
  onApply: () => {},
  selected: {},
  label: ''
};

SelectModal.propTypes = {
  options: PropTypes.array,
  onApply: PropTypes.func,
  selected: PropTypes.object,
  label: PropTypes.string
};

export default SelectModal;
