export type NanoId = string;

export type TimeStamp = {
    created_at?: string,
    updated_at?: string
};

export type Request_CreateUser = {
    name: string,
    username: string,
    password: string,
    access: Database_User['access'],
    disabled: boolean
};

export type Request_DeleteUser = {
    id: NanoId
};

export type Request_Login = {
    username: string,
    password: string,
    remember: boolean
};

export type Request_UpdateUser = Database_User;

export type Database_User = {
    id: NanoId,
    name: string,
    username: string,
    password: string,
    access: 'full' | 'semi-full' | 'readonly',
    disabled: boolean
    & TimeStamp
};

export type Database_UserList = {
    data: Database_User[]
};

export type Database_DeviceItem = {
    id: NanoId,
    username: string,
    password: string,
    version: '6.34.x+' | '7.x'
    & TimeStamp
};

export type Database_DeviceList = {
    data: Database_DeviceItem[]
};

export type Database_Job = {
    id: NanoId,
    name: string,
    disabled: boolean
}

export type Datbase_JobList = {
    data: Database_Job[]
}