import axios, {AxiosInstance} from 'axios';
import {SettingsRepository} from '../modules/login/components/selectHost/repository';
import {Alert} from 'react-native';
import {OpenUrlFirstTimeProps} from './type';
import {checkInternetConnection} from './checkConnection';
import {useCliente} from '../modules/menu/components/Clientes/context/clientContext';

class ApiService {
  private settingsRepository = new SettingsRepository();

  private async createAxiosInstance(): Promise<AxiosInstance | null> {
    try {
      const isConnected = checkInternetConnection();
  
      if (!isConnected) {
        Alert.alert('Sem conexão com a internet');
        return null;
      }
  
      const data = await this.settingsRepository.get();
      if (!data) {
        return null;
      }
  
      return axios.create({
        baseURL: `http://${data.host}/`,
        timeout: 800000
      });
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  private async createAxiosInstanceTimer(): Promise<AxiosInstance | null> {
    try {
      const isConnected = checkInternetConnection();
  
      if (!isConnected) {
        Alert.alert('Sem conexão com a internet');
        return null;
      }
  
      const data = await this.settingsRepository.get();
      if (!data) {
        return null;
      }
  
      return axios.create({
        baseURL: `http://${data.host}/`,
        timeout: 8000
      });
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  private async createAxiosInstanceLocalHost(
    host: string,
  ): Promise<AxiosInstance | null> {
    try {
      const isConnected = checkInternetConnection();

      if (!isConnected) {
        Alert.alert('Sem conexão com a internet');
        return null;
      }

      return axios.create({
        baseURL: `http://${host}/`,
        timeout: 8000
      });
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível configurar o Axios');
      console.error(error);
      return null;
    }
  }

  public async openLocalUrl(host: string): Promise<any> {
    const axiosInstance = await this.createAxiosInstanceLocalHost(host);
    if (!axiosInstance) {
      return undefined;
    }

    try {
      const response = await axiosInstance({
        url: 'arc/empresa/resumo',
        method: 'GET',
      });
      return response.data;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  public async openUrl(props: OpenUrlFirstTimeProps): Promise<any> {
    const axiosInstance = await this.createAxiosInstance();
    if (!axiosInstance) {
      return;
    }

    try {
      const response = await axiosInstance({
        method: props.method,
        url: props.endPoint,
        data: props.data,
        headers: props.headers,
      });
      return response.data;
    } catch (error) {
      console.error(error);
      throw error; // Re-throwing to let the caller handle the error if needed
    }
  }
  public async openUrlResult(props: OpenUrlFirstTimeProps): Promise<any> {
    const axiosInstance = await this.createAxiosInstance();
    if (!axiosInstance) {
      return;
    }

    try {
      const response = await axiosInstance({
        method: props.method,
        url: props.endPoint,
        data: props.data,
        headers: props.headers,
      });
      return response;
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível realizar a requisição');
      console.error(error);
      throw error; // Re-throwing to let the caller handle the error if needed
    }
  }

    public async openUrlTimer(props: OpenUrlFirstTimeProps): Promise<any> {
    const axiosInstance = await this.createAxiosInstanceTimer();
    if (!axiosInstance) {
      return;
    }

    try {
      const response = await axiosInstance({
        method: props.method,
        url: props.endPoint,
        data: props.data,
        headers: props.headers,
      });
      return response.data;
    } catch (error) {
      console.error(error);
      throw error; // Re-throwing to let the caller handle the error if needed
    }
  }
}

export default new ApiService();
