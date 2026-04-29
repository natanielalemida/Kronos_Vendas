import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 35,
    alignItems: 'flex-start',
    width: '80%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  textStyle: {
    color: 'black',
    textAlign: 'left',
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 16,
    color: 'black',
    fontWeight: 'bold',
  },
  modalText: {
    marginBottom: 16,
    textAlign: 'left',
  },
  optionButton: {
    alignItems: 'flex-start',
  },
});
