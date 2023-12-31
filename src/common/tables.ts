export const TABLES = {
    users: {
        tableName: 'users',
        columns: {
            id: "id",
            name: "name",
            email: "email",
            password: "password",
            role: "role",
            state: "state",
            createdAt: "createdAt",
            updatedAt: "updatedAt"
        }
    },
    tasks: {
        tableName: 'tasks',
        columns: {
            id: "id",
            name: "name",
            description: "description",
            completed: "completed",
            user_id: "user_id",
            createdAt: "createdAt",
            updatedAt: "updatedAt"
        },
        other: {
            page: "page"
        }
    }
}