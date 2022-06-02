export interface User {
    id: string;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    photo: string;
    permission: Permission;
}

export interface Permission {
    company_manager: string[],
    farm_manager: string[],
    pond_manager: string[]
}

export interface UserInterface {
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    photo: string;
    birthday: string;
    telephone: string;
    address: string;
    gender: string;
}
