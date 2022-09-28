# Information

The system works with the help of 2 scripts.
The first one is a Razor script which collects the vendor items and saves the information in the UO Log files. It runs after every World Save.
The second script is a NodeJS script which copies the Uo Log file and sends it to https://outlands.shop's server. This script runs every hour but can be configured.

The Uo Log file gets parsed by the server to only keep the last 2 hours. Only the most up to date information about a specific vendor is getting save into the website.

### NodeJS

install the lts version:  
https://nodejs.org/en/download/

### NodeJS Script

Download and Unzip:
https://github.com/Nesci28/OutlandsShop-scripts/archive/refs/heads/master.zip

Open a CommandLine:
cd <UNZIP_FOLDER> && npm i --omit=dev

### Run the NodeJS Script

Open a CommandLine as Administrator (this is necessary because the UO Log file is locked by ClassicUO while the application is running).
cd <UNZIP_FOLDER>
node app.js -h 1 -d <CLASSIC_UO_JOURNAL_LOGS_FOLDER>
ex: node app.js -h 1 -d "C:\Program Files (x86)\Ultima Online Outlands\ClassicUO\Data\Client\JournalLogs"
