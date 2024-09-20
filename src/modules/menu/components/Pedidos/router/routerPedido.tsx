import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {colors} from '../../../../styles';
import ResumoPedido from '../components/resumoPedido/resumoPedido';

const Stack = createNativeStackNavigator();

export default function RouterPedido() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="resumoPedido"
        component={ResumoPedido}
        options={{
          title: 'Clientes',
          headerStyle: {
            backgroundColor: colors.arcGreen,
          },
          headerTintColor: '#fff',
        }}
      />
    </Stack.Navigator>
  );
}
