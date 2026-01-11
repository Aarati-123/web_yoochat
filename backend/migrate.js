require("dotenv").config();
const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function runMigrations() {
  const client = await pool.connect();
  
  try {
    console.log("\n🔄 Starting YooChat Database Migration...");
    console.log("━".repeat(60));
    
    // Create migrations tracking table
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id SERIAL PRIMARY KEY,
        migration_name VARCHAR(255) UNIQUE NOT NULL,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("✅ Migration tracking table ready");
    
    // Get list of migration files
    const migrationsDir = path.join(__dirname, "migrations");
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(f => f.endsWith('.sql'))
      .sort();
    
    console.log(`\n📁 Found ${migrationFiles.length} migration file(s)\n`);
    
    for (const file of migrationFiles) {
      // Check if already executed
      const checkResult = await client.query(
        'SELECT id FROM schema_migrations WHERE migration_name = $1',
        [file]
      );
      
      if (checkResult.rows.length > 0) {
        console.log(`⏭️  Skipping ${file} (already executed)`);
        continue;
      }
      
      console.log(`▶️  Running ${file}...`);
      
      // Read and execute migration
      const migrationPath = path.join(migrationsDir, file);
      const migrationSql = fs.readFileSync(migrationPath, "utf8");
      
      await client.query('BEGIN');
      
      try {
        // Execute the migration SQL
        await client.query(migrationSql);
        
        // Record successful migration
        await client.query(
          'INSERT INTO schema_migrations (migration_name) VALUES ($1)',
          [file]
        );
        
        await client.query('COMMIT');
        console.log(`✅ Successfully executed ${file}`);
      } catch (error) {
        await client.query('ROLLBACK');
        console.error(`❌ Failed to execute ${file}`);
        console.error(`   Error: ${error.message}`);
        throw error;
      }
    }
    
    console.log("\n" + "━".repeat(60));
    console.log("✨ All migrations completed successfully!");
    console.log("🗄️  Your Neon database is ready to use.\n");
    
  } catch (error) {
    console.error("\n" + "━".repeat(60));
    console.error("❌ Migration failed:", error.message);
    console.error("━".repeat(60) + "\n");
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

// Run migrations
runMigrations();
