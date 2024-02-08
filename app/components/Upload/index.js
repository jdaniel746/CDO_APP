import { Icon } from '../index';
import { Platform, Text, TouchableOpacity, View } from 'react-native';
import { useTheme, BaseColor } from '@config';
import Image from '@components/Image';
import PropTypes from 'prop-types';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { getDownloadURL, ref, uploadBytesResumable, deleteObject } from 'firebase/storage';
import { useTranslation } from 'react-i18next';
import { storage } from '@config/firebase';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import styles from './styles';

const Upload = ({ renderNode = null, setUrl, bucket, style }) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const auth = useSelector((state) => state.auth);
  const user = auth.user;
  const [img, setImg] = useState();
  const [storageRef, setStorageRef] = useState();

  const ImageChoiceAndUpload = async () => {
    try {
      if (Platform.OS === 'ios') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Permission is required for use.');
          return;
        }
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: false,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: false
      });
      if (!result.canceled) {
        let actions = [];
        actions.push({ resize: { width: 300 } });
        const manipulatorResult = await ImageManipulator.manipulateAsync(
          result.assets[0].uri,
          actions,
          {
            compress: 0.4
          }
        );
        const localUri = await fetch(manipulatorResult.uri);
        const localBlob = await localUri.blob();
        const filename = user.id;
        setStorageRef(ref(storage, `${bucket}/${user.id}/` + filename));
        const uploadTask = uploadBytesResumable(storageRef, localBlob);
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            // setProgress(parseInt(progress) + '%');
            console.log(parseInt(progress) + '%');
          },
          (error) => {
            console.log(error);
            alert('Upload failed.');
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              //setProgress('');
              setUrl(downloadURL);
              setImg(downloadURL);
            });
          }
        );
      }
    } catch (e) {
      console.log('error', e.message);
    }
  };

  const deleteImage = () => {
    console.log('deleting');
    deleteObject(storageRef)
      .then(() => {
        setImg(null);
      })
      .catch((error) => {
        console.log('Error deleting img', error);
      });
  };

  return (
    <TouchableOpacity
      onPress={(e) => {
        e.stopPropagation();
        ImageChoiceAndUpload();
      }}>
      {renderNode ? (
        renderNode
      ) : (
        <View
          style={{
            backgroundColor: colors.card,
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 10
          }}>
          {img ? (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Image source={{ uri: img }} style={styles.image} />
              <TouchableOpacity
                onPress={(e) => {
                  e.stopPropagation();
                  deleteImage();
                }}>
                <Icon
                  name="trash-alt"
                  size={24}
                  style={{ color: BaseColor.pinkDarkColor, marginLeft: 40 }}
                  solid
                />
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <Icon name="cloud-upload-alt" size={48} color={colors.primaryLight} />
              <Text headline>{t('upload_your_files')}</Text>
              <Text footnote light>
                {t('description_upload_file')}
              </Text>
            </>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

Upload.propTypes = {
  renderNode: PropTypes.any,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  bucket: PropTypes.string,
  setUrl: PropTypes.func
};

Upload.defaultProps = {
  style: {},
  renderNode: null,
  bucket: '',
  setUrl: null
};

export default Upload;
