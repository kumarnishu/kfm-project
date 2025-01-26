export type GetCustomerDto = {
    _id: string,
    name: string,
    address: string,
    email: string,
    mobile: string,
    users: number,
    owner:string,
}

export type CreateOrEditCustomerDto = {
    name: string,
    username?: string,
    address: string,
    email: string,
    mobile: string,
}

