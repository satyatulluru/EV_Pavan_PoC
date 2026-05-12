const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
    fs.readdirSync(dir).forEach(file => {
        const filepath = path.join(dir, file);
        if (fs.statSync(filepath).isDirectory()) {
            filelist = walkSync(filepath, filelist);
        } else {
            filelist.push(filepath);
        }
    });
    return filelist;
};

const files = walkSync('src/pages')
    .concat(walkSync('src/components'))
    .filter(f => f.endsWith('.tsx') || f.endsWith('.ts'));

files.forEach(file => {
    if (file.includes('Login.tsx')) return;
    
    let content = fs.readFileSync(file, 'utf8');

    // Replacements
    content = content
        .replace(/bg-slate-950\/80/g, 'bg-white\/80')
        .replace(/bg-slate-950\/50/g, 'bg-orange-50')
        .replace(/bg-slate-950/g, 'bg-orange-50\/40')
        .replace(/bg-slate-900\/90/g, 'bg-white\/95')
        .replace(/bg-slate-900\/40/g, 'bg-white shadow-sm')
        .replace(/bg-slate-900\/50/g, 'bg-white shadow-sm')
        .replace(/bg-slate-900/g, 'bg-white')
        
        .replace(/from-slate-900/g, 'from-orange-50')
        .replace(/via-slate-950/g, 'via-white')
        .replace(/to-slate-950/g, 'to-blue-50')
        
        .replace(/bg-slate-800/g, 'bg-orange-100')
        .replace(/hover:bg-slate-800/g, 'hover:bg-orange-100')
        .replace(/border-slate-800/g, 'border-orange-200')
        .replace(/border-slate-700/g, 'border-orange-300')
        .replace(/border-slate-600/g, 'border-orange-400')
        
        .replace(/text-slate-100/g, 'text-slate-900')
        .replace(/text-slate-200/g, 'text-slate-800')
        .replace(/text-slate-300/g, 'text-slate-700')
        .replace(/text-slate-400/g, 'text-slate-600')
        // .replace(/text-white/g, 'text-blue-950') // Be careful with text-white, might break badges.
        
        // Recharts customizations inside components
        .replace(/stroke="var\(--muted-foreground\)"/g, 'stroke="#64748b"')
        .replace(/fill="var\(--muted-foreground\)"/g, 'fill="#64748b"')
        .replace(/stroke="#[347]...+"/g, 'stroke="#e2e8f0"');
        
    // Special replacements for text-white where they shouldn't be white when background is light
    // We can replace hover:text-white to hover:text-blue-700
    content = content.replace(/hover:text-white/g, 'hover:text-blue-700');
    
    // Some static texts in non-buttons. This is tricky.
    // Replace text-white in text elements holding Dashboard Titles
    content = content.replace(/className="[^"]*text-white[^"]*"/g, (match) => {
        // If it looks like a button or badge, keep white
        if (match.includes('bg-red-500') || match.includes('bg-blue-600') || match.includes('bg-green-500')) return match;
        return match.replace(/text-white/g, 'text-blue-950');
    });

    // Also replace `text-blue-400` with `text-blue-600` for better contrast on light mode
    content = content.replace(/text-blue-400/g, 'text-blue-600');
    content = content.replace(/text-emerald-400/g, 'text-emerald-600');

    fs.writeFileSync(file, content, 'utf8');
});

console.log('Theme replacement complete.');
