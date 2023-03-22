export type NanoId = string;

export type Response_Blank = {};

export type Response_GeneralMessage = {
    message: string[]
}

export type Response_GeneralData<T = any> = {
    data: T
}

export type TimeStamp = {
    created_at?: Date,
    updated_at?: Date
};

export type Request_Query = {
    deviceId: Database_DeviceItem['id'],
    queries: {
        label: string,
        command: string,
        args: string[]
    }[]
}

export type Request_CreateUser = {
    name: Database_User['name'],
    username: Database_User['username'],
    password: Database_User['password'],
    access: Database_User['access'],
    disabled: Database_User['disabled']
};

export type Request_DeleteUser = {
    id: Database_User['id']
};

export type Request_Login = {
    username: Database_User['username'],
    password: Database_User['password'],
    remember: boolean
};

export type Request_UpdateUser = Database_User;

export type Request_AddDevice = {
    name: Database_DeviceItem['name'],
    hostname: Database_DeviceItem['hostname'],
    username: Database_DeviceItem['username'],
    password: Database_DeviceItem['password'],
    port: Database_DeviceItem['port'],
    version: Database_DeviceItem['version']
}

export type Request_UpdateDevice = Database_DeviceItem;

export type Request_DeleteDevice = {
    id: Database_DeviceItem['id']
}

export type Database_Log = {
    id: NanoId,
    level: 'critical' | 'warning' | 'info',
    message: string,
    timestamp: Date
}

export type Database_LogList = {
    data: Database_Log[]
}

export type Database_User = {
    id: NanoId,
    name: string,
    username: string,
    password: string,
    access: 'full' | 'semi-full' | 'readonly',
    disabled: boolean
} & TimeStamp;

export type Database_UserList = {
    data: Database_User[]
};

export type Database_DeviceItem = {
    id: NanoId,
    name: string,
    hostname: string,
    username: string,
    password: string,
    port: number
    version: '6.34.x+' | '7.x'
} & TimeStamp;

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