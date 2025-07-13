#!/usr/bin/env node

/**
 * Update sample books in JSON export with category information
 */

import fs from 'fs';
import path from 'path';

// Load the books export
const exportPath = '/home/brian/Code/MCPSERVERS/egw-writings-mcp/data/books-export.json';

if (!fs.existsSync(exportPath)) {
    console.error('Books export not found. Please run export-books-json.js first.');
    process.exit(1);
}

const exportData = JSON.parse(fs.readFileSync(exportPath, 'utf8'));

// Categorization function (same as in database.ts)
function categorizeBook(book) {
    const author = book.author?.toLowerCase() || '';
    const title = book.title?.toLowerCase() || '';
    const type = book.type?.toLowerCase() || '';
    const code = book.code?.toLowerCase() || '';

    // Ellen G. White writings
    if (author.includes('white') || author.includes('elena')) {
        // Devotional compilations
        if (title.includes('maranatha') || title.includes('heavenly') || 
            title.includes('sons') || title.includes('daughters') ||
            title.includes('morning watch') || title.includes('devotional')) {
            return { category: 'egw', subcategory: 'devotional' };
        }
        
        // Manuscript releases
        if (title.includes('manuscript release') || code.includes('mr')) {
            return { category: 'egw', subcategory: 'manuscripts' };
        }
        
        // Letters
        if (title.includes('letter') || code.includes('lt')) {
            return { category: 'egw', subcategory: 'letters' };
        }
        
        // Testimonies
        if (title.includes('testimon') || code.includes('tt') || code.includes('1t')) {
            return { category: 'egw', subcategory: 'testimonies' };
        }
        
        // Major books
        if (title.includes('great controversy') || title.includes('desire') || 
            title.includes('patriarchs') || title.includes('acts') ||
            title.includes('prophets and kings') || title.includes('education') ||
            title.includes('ministry of healing') || title.includes('steps to christ')) {
            return { category: 'egw', subcategory: 'books' };
        }
        
        // Pamphlets
        if (type === 'pamphlet' || book.npages < 100) {
            return { category: 'egw', subcategory: 'pamphlets' };
        }
        
        return { category: 'egw', subcategory: 'books' };
    }

    // Pioneer authors
    const pioneers = [
        'uriah smith', 'a. t. jones', 'j. n. andrews', 'john andrews', 
        'm. l. andreasen', 'j. n. loughborough', 'alonzo jones',
        'ellet waggoner', 'stephen haskell', 'william miller',
        'joshua himes', 'hiram edson', 'joseph bates'
    ];
    
    if (pioneers.some(pioneer => author.includes(pioneer))) {
        if (type === 'periodical' || title.includes('review') || title.includes('herald')) {
            return { category: 'periodical', subcategory: 'pioneer' };
        }
        return { category: 'pioneer', subcategory: 'books' };
    }

    // Periodicals
    if (type === 'periodical' || 
        title.includes('review') || title.includes('herald') || 
        title.includes('signs') || title.includes('times') ||
        title.includes('youth') || title.includes('instructor') ||
        title.includes('advent') && title.includes('herald')) {
        return { category: 'periodical', subcategory: 'historical' };
    }

    // Reference materials
    if (type === 'bible' || type === 'dictionary' || type === 'scriptindex' || 
        type === 'topicalindex' || title.includes('concordance')) {
        return { category: 'reference', subcategory: 'biblical' };
    }

    // Historical works
    if (title.includes('history') || title.includes('origin') || 
        title.includes('movement') || title.includes('denomination') ||
        author.includes('spalding') || author.includes('knight')) {
        return { category: 'historical', subcategory: 'denominational' };
    }

    // Modern devotional works
    if (type === 'devotional' || title.includes('devotional') || 
        title.includes('daily') || title.includes('meditation')) {
        return { category: 'devotional', subcategory: 'modern' };
    }

    // Default classification
    if (type === 'book') {
        return { category: 'historical', subcategory: 'general' };
    }

    return { category: 'reference', subcategory: 'general' };
}

// Update books with categories
let updated = 0;
for (const book of exportData.books) {
    if (!book.category || !book.subcategory) {
        const { category, subcategory } = categorizeBook(book);
        book.category = category;
        book.subcategory = subcategory;
        updated++;
    }
}

// Save updated export
fs.writeFileSync(exportPath, JSON.stringify(exportData, null, 2));

console.log(`✅ Updated ${updated} books with category information`);

// Show category breakdown
const categoryMap = new Map();
for (const book of exportData.books) {
    const key = `${book.category}/${book.subcategory}`;
    categoryMap.set(key, (categoryMap.get(key) || 0) + 1);
}

console.log('\n📚 Books by Category:');
for (const [category, count] of categoryMap) {
    console.log(`  ${category}: ${count} books`);
}