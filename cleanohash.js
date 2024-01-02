const { readFileSync, writeFileSync, existsSync, unlinkSync } = require('fs');
const glob = require( 'glob' ); 
const md5File = require('md5-file')
const { program } = require('commander');
const { exit } = require('process');

let options = {};
let hash_db = [];

function handle_args() {
    program
    .version('1.0.0')
    .description(`Hash or clean a directory of media files`)
    .requiredOption('-db <hash db file>', 'file path of hashes db')
    .requiredOption('-c <C|H>', 'operation type Clean or Hash')
    .requiredOption('-d <dir to process', 'directory to clean or hash')

    program.parse();
    options = program.opts();
}

function load_hash_db(filedb) {
    try {
        if(existsSync(filedb)) {
            const data = readFileSync(filedb);
            if(data.length > 0)
                hash_db = JSON.parse(data);
        }
    } catch(e) {
        console.log(`Cannot find or open file ${filedb}. Cannot continue...`);
        exit(1);
    }
}

function store_hash_db(db, filedb) {
    try {
        writeFileSync(filedb, JSON.stringify(db, null, 2), 'utf8');
    } catch(e) {
        console.log(`Error in writing hash DB file...`);
        exit(1);
    }
}

function clean_dir(db, dir) {
    if(!existsSync(dir)) {
        console.log(`Cannot continue as dir ${dir} is not existing...`);
        exit(1);
    }
    console.log(`Start CLEANING ${dir}`);
    glob(`${dir}/**/*.*`, function(err, files) {
        files.forEach(file => {
            process.stdout.write(`${file} --> ... `);
            const hash = md5File.sync(file);
            if(hash_db.includes(hash)) {
                process.stdout.write('DELETE \n');
                unlinkSync(file);                
            } else 
                process.stdout.write(`${hash} \n`);
        });
        console.log(`Finish CLEANING ${dir}`); 
    });
}

function hash_dir(db, dir) {
    if(!existsSync(dir)) {
        console.log(`Cannot continue as dir ${dir} is not existing...`);
        exit(1);
    }
    console.log(`Start HASHING ${dir}`);
    glob(`${dir}/**/*.*`, function(err, files) {
        files.forEach(file => {
            process.stdout.write(`${file} --> ... `);
            const hash = md5File.sync(file);
            if(!hash_db.includes(hash)) 
                hash_db.push(hash);
            process.stdout.write(`${hash} \n`);
        });
        store_hash_db(hash_db, db);
        console.log(`Finish HASHING ${dir}`); 
    });
}

 (async function(){
    handle_args();
    let command = options['c'];
    let dir = options['d'];
    let db = options['Db'];
    
    load_hash_db(db);
    switch(command) {
        case 'C':
            clean_dir(db, dir);
            break;
        case 'H':
            hash_dir(db, dir);
            break;
        default:
            console.log('Invalid operation. Must be C or H');
    }
 })();
