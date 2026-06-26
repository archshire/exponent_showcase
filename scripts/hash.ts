/*
    To run cd scripts
    command: pnpm dlx tsx hash.ts 
*/

import bcrypt from 'bcrypt';

async function generateHash() {
    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash('aaa',salt); //Change the desire password

    console.log('----------------------');
    console.log('Your hashed password is:');
    console.log(hash);
    console.log('----------------------');
}

generateHash();