import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {HeaderProps} from './type';
import {ShowIf} from '../showIf';

export function Header({
  label,
  leftIcon,
  leftColor = 'white',
  leftSize = 24,
  rightIcon,
  rightColor = 'white',
  rightSize = 24,
  rightButtonDisable = false,
  leftButtonDisable = false,
  onPressLeftIcon,
  onPressRighttIcon,
}: HeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        <ShowIf condition={!!leftIcon}>
          <TouchableOpacity
            onPress={onPressLeftIcon}
            disabled={!onPressLeftIcon || leftButtonDisable}
            style={styles.iconButton} // Estilo adicionado
          >
            <Icon
              name={leftIcon}
              size={leftSize}
              color={leftColor}
              style={styles.icon}
            />
          </TouchableOpacity>
        </ShowIf>
        <Text style={styles.label}>{label}</Text>
      </View>
      <ShowIf condition={!!rightIcon}>
        <TouchableOpacity
          onPress={onPressRighttIcon}
          disabled={rightButtonDisable}
          style={styles.iconButton} // Estilo adicionado
        >
          <Icon
            name={rightIcon}
            size={rightSize}
            color={rightColor}
            style={styles.icon}
          />
        </TouchableOpacity>
      </ShowIf>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#00B08F',
    alignItems: 'center',
    flexDirection: 'row',
    height: 80,
    paddingHorizontal: 15,
    justifyContent: 'space-between',
    width: '100%',
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center', // Alinha os itens verticalmente no centro
    justifyContent: 'space-between',
    width: '65%',
    marginTop: 20,
  },
  label: {
    color: 'white',
    fontSize: 20,
  },
  icon: {
    // Estilo para o ícone
  },
  iconButton: {
    alignItems: 'center', // Centraliza o conteúdo dentro do TouchableOpacity
    justifyContent: 'center',
  },
});
