import axios, {
    type AxiosError,
    type AxiosInstance,
    type AxiosRequestConfig,
    type AxiosResponse,
    type ResponseType,
} from 'axios';
import {Cookies} from 'react-cookie';
import {AppConfig} from "@/configs";

const cookies = new Cookies();

export const http: AxiosInstance = axios.create({
    baseURL: AppConfig.urls.apis || '',
    timeout: 20000,
});

http.interceptors.response.use(
    res => res,
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

export type ServiceConfig<TParams = unknown> = {
    isDisabledAuth?: boolean;
    token?: string;
    params?: TParams;
    contentType?: string;
    responseType?: ResponseType;
};

const buildConfig = <TParams>(cfg?: ServiceConfig<TParams>): AxiosRequestConfig => {
    const token = cfg?.token ?? cookies.get('CRING_TOKEN');

    const headers: Record<string, string> = {
        'Content-Type': cfg?.contentType ?? 'application/json',
    };
    if (!cfg?.isDisabledAuth && token) headers.Authorization = `Bearer ${token}`;

    const conf: AxiosRequestConfig = {
        headers,
        params: cfg?.params,
        responseType: cfg?.responseType,
    };
    return conf;
};

export async function onGet<TParams, TResp>(
    url: string,
    cfg?: ServiceConfig<TParams>
): Promise<AxiosResponse<TResp>> {
    try {
        return await http.get<TResp>(url, buildConfig(cfg));
    } catch (error) {
        throw error as AxiosError;
    }
}

export async function onPost<TParams, TBody, TResp>(
    url: string,
    body: TBody,
    opts?: {
        isCloseSession?: boolean;
        config?: ServiceConfig<TParams>;
        onError?: (error: AxiosError<{ message?: string; lockTime?: string }>) => void;
    }
): Promise<AxiosResponse<TResp>> {
    try {
        return await http.post<TResp>(url, body, buildConfig(opts?.config));
    } catch (error) {
        const err = error as AxiosError<{ message?: string; lockTime?: string }>;
        opts?.onError?.(err);
        throw error;
    }
}

export async function onPatch<TParams, TBody, TResp>(
    url: string,
    body: TBody,
    opts?: {
        isCloseSession?: boolean;
        config?: ServiceConfig<TParams>;
        onError?: (error: AxiosError<{ message?: string; lockTime?: string }>) => void;
    }
): Promise<AxiosResponse<TResp>> {
    try {
        return await http.patch<TResp>(url, body, buildConfig(opts?.config));
    } catch (error) {
        const err = error as AxiosError<{ message?: string; lockTime?: string }>;
        opts?.onError?.(err);
        throw error;
    }
}

export async function onDelete<TParams, TResp>(
    url: string,
    opts?: {
        isCloseSession?: boolean;
        config?: ServiceConfig<TParams>;
        onError?: (error: AxiosError<{ message?: string; lockTime?: string }>) => void;
    }
): Promise<AxiosResponse<TResp>> {
    try {
        return await http.delete<TResp>(url, buildConfig(opts?.config));
    } catch (error) {
        const err = error as AxiosError<{ message?: string; lockTime?: string }>;
        opts?.onError?.(err);
        throw error;
    }
}
