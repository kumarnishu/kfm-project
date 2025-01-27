export type GetEngineerDashboardDto = {
    pending_installation: number,
    completed_installation: number,
    pending_requests: number,
    closed_requests: number,
    notifications: number
}
export type GetSparesManagerDashboardDto = {
    pending_installation: number,
    completed_installation: number,
    pending_requests: number,
    closed_requests: number,
    notifications: number
}

export type GetAdminDashboardDto = {
    pending_installation: number,
    completed_installation: number,
    pending_requests: number,
    closed_requests: number,
    machines: number,
    spares: number,
    staff: number,
    registered_products: number,
    customers: number,
    notifications: number
}
export type GetOwnerDashboardDto = {
    installations_requests: number,
    service_requests: number,
    staff: number,
    registered_products: number,
    notifications: number
}
export type GetStaffDashboardDto = {
    installations_requests: number,
    service_requests: number,
    registered_products: number,
    notifications: number
}