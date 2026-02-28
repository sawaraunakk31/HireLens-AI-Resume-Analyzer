const fs = require('fs');

const urls = [
    { url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzlhZTc4Njc4ODJhYzRkY2I4MzUxMGE0MzE1ZWUzM2Y5EgoSBhCJ4qXNdBgBkgEkCgpwcm9qZWN0X2lkEhZCFDEwNjYyMzUwODE3NjA3OTA5NzU2&filename=&opi=89354086', name: 'stitch_feedback.html' },
    { url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzM3Y2ZiM2Q5NTM1OTQ1ODlhNWJlYzEzMWM4ZDJjMGJhEgoSBhCJ4qXNdBgBkgEkCgpwcm9qZWN0X2lkEhZCFDEwNjYyMzUwODE3NjA3OTA5NzU2&filename=&opi=89354086', name: 'stitch_dashboard.html' },
    { url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzBmNzFiOGUxYWViODQ0Zjg4ZTdhNmQ5YmRhMDgxMGEyEgoSBhCJ4qXNdBgBkgEkCgpwcm9qZWN0X2lkEhZCFDEwNjYyMzUwODE3NjA3OTA5NzU2&filename=&opi=89354086', name: 'stitch_upload.html' },
    { url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sX2RiYmJjMTY4NDY1ZjQxNjQ5MGFlNjhkZDE3ZjBhYmNmEgoSBhCJ4qXNdBgBkgEkCgpwcm9qZWN0X2lkEhZCFDEwNjYyMzUwODE3NjA3OTA5NzU2&filename=&opi=89354086', name: 'stitch_landing.html' }
];

async function downloadAll() {
    for (const item of urls) {
        console.log(`Downloading ${item.name}...`);
        const res = await fetch(item.url);
        const html = await res.text();
        fs.writeFileSync(item.name, html);
        console.log(`Saved ${item.name}`);
    }
}

downloadAll().catch(console.error);
