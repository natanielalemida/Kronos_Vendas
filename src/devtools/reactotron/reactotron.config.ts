import Reactotron, {ReactotronReactNative} from 'reactotron-react-native';

const reactotron = Reactotron.configure({
  name: 'Kronos Vendas',
})
  .useReactNative({
    asyncStorage: false,
    editor: false,
    overlay: false,
    networking: {
      ignoreUrls: /symbolicate|logs|sockjs-node/i,
    },
  })
  .connect() as ReactotronReactNative;

reactotron.clear();

console.tron = reactotron;

export {reactotron};
