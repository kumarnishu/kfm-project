import React, { createContext, useEffect, useState } from "react";
import { useQuery } from 'react-query'
import { AxiosResponse } from 'axios'
import { BackendError } from "../..";
import { GetUserDto } from "../dtos/UserDto";
import { UserService } from "../services/UserService"

// usercontext
type Context = {
    user: GetUserDto | undefined;
    isLoading: boolean;
    setUser: React.Dispatch<React.SetStateAction<GetUserDto | undefined>>;
};
export const UserContext = createContext<Context>({
    user: undefined,
    isLoading: true,
    setUser: () => null,
});


// user provider
export function UserProvider(props: { children: JSX.Element }) {
    const [user, setUser] = useState<GetUserDto>();
    const [isLoading, setIsLoading] = useState(true)
    const { data, isSuccess } = useQuery<AxiosResponse<{ user: GetUserDto }>, BackendError>("profile", new UserService().GetProfile)

    useEffect(() => {
        if (isSuccess && data) {
            setUser(data.data.user)
        }
    }, [isSuccess])

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false)
        }, 2000);
    }, [])
    return (
        <UserContext.Provider value={{ user, setUser, isLoading }
        }>
            {props.children}
        </UserContext.Provider>
    );
}