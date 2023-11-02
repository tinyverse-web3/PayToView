import axios from 'axios';
import i18n from '@/locales';
export class Request {
  baseUrl = '';
  constructor() {
    const { VITE_SDK_HOST, VITE_SDK_LOCAL_HOST } = import.meta.env;
    this.baseUrl = window.JsBridge ? VITE_SDK_LOCAL_HOST : VITE_SDK_HOST;
  }
  /**
   * 调用接口
   * @param name 接口名称
   * @param data 数据
   * @param method 请求方法
   * @param formData 表单数据
   */
  async invoke({
    name,
    data = {},
    method = 'post',
    formData,
    timeout,
  }: {
    name: string;
    data?: Record<string, any>;
    method?: string;
    formData?: any;
    timeout?: number;
  }) {
    
    const url = `${this.baseUrl}/sdk/${name}`;
    if (formData) {
      const headers = {
        'Content-Type': 'multipart/form-data',
      };
      return this.request({ url, method, data: formData, headers, timeout });
    } else {
      if (method === 'get') {
        return this.request({
          url,
          method,
          params: { ...data, timestamp: +new Date() },
          timeout,
        });
      } else {
        return this.request({ url, method, data, timeout });
      }
    }
  }

  /**
   * 发送请求
   * @param url 请求地址
   * @param method 请求方法
   * @param data 数据
   * @param params 参数
   * @param headers 请求头
   */
  async request({ url, method, data, params, headers, timeout = 300000 }: any) {
    try {
      const res = await axios({
        url,
        method,
        data,
        params,
        headers,
        timeout: timeout,
      });
      return res?.data;
    } catch (error) {
      console.error(error);
      return { code: '500000', msg: i18n.t('common.request_error')  };
    }
  }
}