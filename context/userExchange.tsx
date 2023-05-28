import { useRouter } from 'next/router';
import React from 'react'
import LayerSwapApiClient, { UserExchangesData } from '../lib/layerSwapApiClient';
import { ApiResponse } from '../Models/ApiResponse';

const UserExchangeStateContext = React.createContext<ApiResponse<UserExchangesData[]>>(null);
const UserExchangeDataUpdateContext = React.createContext<UpdateFns>(null);

type UpdateFns = {
    getUserExchanges: () => Promise<UserExchangesData[]>
}

export function UserExchangeProvider({ children }) {
    const [exchangeData, setUserExchangeData] = React.useState<ApiResponse<UserExchangesData[]>>();
    const router = useRouter();

    const updateFns: UpdateFns = {
        getUserExchanges: async (): Promise<UserExchangesData[]> => {
            const layerswapApiClient = new LayerSwapApiClient(router)
            const res = await layerswapApiClient.GetExchangeAccounts()
            if (res.error) {
                throw res.error;
            }
            setUserExchangeData(res)
            return res.data;
        }
    };

    return (
        <UserExchangeStateContext.Provider value={exchangeData}>
            <UserExchangeDataUpdateContext.Provider value={updateFns}>
                {children}
            </UserExchangeDataUpdateContext.Provider>
        </UserExchangeStateContext.Provider>
    );
}

export function useUserExchangeState() {
    const data = React.useContext<ApiResponse<UserExchangesData[]>>(UserExchangeStateContext);

    if (data === undefined) {
        throw new Error('useUserExchangeState must be used within a UserExchangeStateProvider');
    }

    return data;
}


export function useUserExchangeDataUpdate() {
    const updateFns = React.useContext<UpdateFns>(UserExchangeDataUpdateContext);

    if (updateFns === undefined) {
        throw new Error('useUserExchangeDataUpdate must be used within a UserExchangeDataProvider');
    }

    return updateFns;
}