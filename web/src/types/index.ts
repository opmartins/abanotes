export interface Report {
    id: string;
    title: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Record {
    id: string;
    childId: string;
    date: Date;
    notes: string;
}

export interface Child {
    id: string;
    name: string;
    age: number;
    diagnosis: string;
    records: Record[];
}

export interface User {
    id: string;
    username: string;
    password: string;
    role: 'admin' | 'staff';
}