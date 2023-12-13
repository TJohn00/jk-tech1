db.createUser(
    {
        user: "admin",
        pwd: "testadmin",
        roles: [
            {
                role: "readWrite",
                db: "task"
            }
        ]
    }
);
db.createCollection("init");