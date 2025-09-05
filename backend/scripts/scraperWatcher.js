const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Scraper Watcher...');
console.log('📊 Initial scraping will begin in 10 seconds...');

// Function to run the scraper
function runScraper() {
    return new Promise((resolve, reject) => {
        console.log('🔄 Starting book scraper...');
        
        const scraperProcess = spawn('node', ['scripts/runScraper.js'], {
            cwd: path.join(__dirname, '..'),
            stdio: 'inherit'
        });

        scraperProcess.on('close', (code) => {
            if (code === 0) {
                console.log('✅ Scraper completed successfully');
                resolve();
            } else {
                console.log(`❌ Scraper exited with code ${code}`);
                reject(new Error(`Scraper failed with code ${code}`));
            }
        });

        scraperProcess.on('error', (error) => {
            console.error('❌ Failed to start scraper:', error);
            reject(error);
        });
    });
}

// Function to wait for a specified time
function wait(seconds) {
    return new Promise(resolve => {
        console.log(`⏳ Waiting ${seconds} seconds before next scrape...`);
        setTimeout(resolve, seconds * 1000);
    });
}

// Main function to handle the scraping cycle
async function startScrapingCycle() {
    try {
        // Wait 10 seconds before first run
        await wait(10);
        
        // Run initial scrape
        await runScraper();
        
        // Set up periodic scraping (every hour)
        const intervalHours = 1;
        const intervalSeconds = intervalHours * 60 * 60;
        
        console.log(`🔄 Scraper will run every ${intervalHours} hour(s)`);
        
        while (true) {
            await wait(intervalSeconds);
            try {
                await runScraper();
            } catch (error) {
                console.error('❌ Scraping failed, will retry in next cycle:', error.message);
            }
        }
    } catch (error) {
        console.error('❌ Scraper watcher failed:', error);
        process.exit(1);
    }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Scraper watcher shutting down...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Scraper watcher shutting down...');
    process.exit(0);
});

// Start the scraping cycle
startScrapingCycle();
