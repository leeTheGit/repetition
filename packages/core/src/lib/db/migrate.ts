import * as dotenv from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import config from "../../../drizzle.config"
import { Client } from "pg";

dotenv.config({ path: ".env" });

export const runMigration = async () => {
    console.log('running migration');
    const dsn = process.env.DATABASE_URL;
    console.log(dsn);

    const client = new Client({
        connectionString: dsn,
    });
    

    try {
        await client.connect();

        const db = drizzle(client);
        console.log('migrating');
        await migrate(db, {migrationsFolder: config.out});
        console.log('migration completed');
        await client.end();
        return true;

    } catch (e) {
        console.log('migration failed');
        console.error(e);
        process.exit(1);
    }
}


runMigration().catch((err) => {
    console.error(err);
    process.exit(1);
});