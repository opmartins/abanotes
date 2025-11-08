export interface Report {
    id: string;
    title: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Record {
    id: string;
    patientId: string;
    details: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Patient {
    id: string;
    name: string;
    age: number;
    diagnosis: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface User {
    id: string;
    username: string;
    password: string;
    role: 'admin' | 'staff';
    createdAt: Date;
    updatedAt: Date;
}