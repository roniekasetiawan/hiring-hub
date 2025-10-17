export type Actions = 'manage' | 'read' | 'create' | 'update' | 'delete' | 'approve';
export type Subjects = 'dashboard' | 'Job' | 'Application' | 'User' | 'all';

export type PermissionString = `${Lowercase<Subjects>}.${Actions}`;

export type Shape = {
    path: string;
    permission: string;
    children: string;
};
