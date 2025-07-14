# EGW Writings Command Guide

## 🤔 **Understanding the Commands**

This guide explains what each command does and when to use it.

## 📚 **Quick Reference**

### **Just Getting Started?**
```bash
make egw-quick-start        # Everything in one command
# OR
make workflow-sample        # Sample workflow (10 books)
```

### **Want Everything?**
```bash
make egw-download-all LIMIT=1499    # Download all English books
# OR  
make workflow-zip-all               # Complete workflow (all books)
```

### **Want Specific Books?**
```bash
make workflow-specific BOOKS="21 29 39"    # Specific books with setup
```

## 🔍 **Detailed Command Explanations**

### **Setup Commands (Run These First)**

#### `make egw-languages`
**What it does**: Downloads list of all available languages (English, Spanish, etc.)
**Creates**: Language metadata in database
**Time**: ~30 seconds
**Required**: Yes, before downloading books

#### `make egw-books` 
**What it does**: Downloads metadata for all English books (titles, authors, IDs, etc.)
**Creates**: Book metadata in database (1499 books)
**Time**: ~2-5 minutes  
**Required**: Yes, before downloading book content

### **Content Download Commands**

#### `make egw-download-zips LIMIT=10`
**What it does**: Downloads ZIP files for 10 books (no database insertion)
**Creates**: ZIP files in `/data/zips/` folder
**Time**: ~2-5 minutes depending on book sizes
**Requires**: Database setup (languages + books metadata)
**Use when**: You want to download ZIPs for later processing

#### `make egw-download-zips-safe LIMIT=10`  
**What it does**: Same as above, but automatically runs setup first
**Creates**: Complete setup + ZIP files
**Time**: ~5-10 minutes (includes setup time)
**Requires**: Nothing (does setup automatically)
**Use when**: You want everything handled automatically

#### `make egw-parse-all-zips`
**What it does**: Processes all downloaded ZIP files into database
**Creates**: Paragraph content in database
**Time**: ~1-5 minutes depending on number of ZIPs
**Requires**: ZIP files in `/data/zips/` folder
**Use when**: You have ZIPs and want to create searchable database

### **Complete Workflow Commands**

#### `make egw-quick-start`
**What it does**: 
1. Downloads languages
2. Downloads books metadata  
3. Downloads 5 sample books as ZIPs
4. Processes ZIPs into database
**Creates**: Complete working database with sample content
**Time**: ~5-10 minutes
**Perfect for**: Testing and getting started

#### `make egw-download-all LIMIT=20`
**What it does**:
1. Ensures languages/books are downloaded
2. Downloads content for 20 books using ZIP method
3. Processes into database automatically
**Creates**: Complete database with 20 books of content
**Time**: ~10-20 minutes
**Perfect for**: Getting substantial content quickly

#### `make workflow-zip-all`
**What it does**:
1. Downloads languages
2. Downloads books metadata
3. Downloads ALL 1499 English book ZIPs
**Creates**: Complete ZIP backup of entire library
**Time**: ~2-4 hours (large download)
**Perfect for**: Complete offline backup

### **Individual Operations**

#### `make egw-download-zip BOOK=21`
**What it does**: Downloads ZIP for specific book (ID 21 = "Counsels on Sabbath School Work")
**Creates**: Single ZIP file
**Requires**: Database setup
**Use when**: You want just one specific book

#### `make egw-parse-zip BOOK=21`  
**What it does**: Processes specific book ZIP into database
**Creates**: Searchable content for that book
**Requires**: ZIP file exists
**Use when**: You want to add one book to database

### **Utility Commands**

#### `make egw-stats`
**What it does**: Shows database statistics (books, paragraphs, etc.)
**Use when**: You want to see what's in your database

#### `make db-clean`
**What it does**: Deletes the database completely
**Use when**: You want to start over

#### `make db-backup`
**What it does**: Creates timestamped backup of database
**Use when**: You want to save current state

## 🚦 **Common Workflows**

### **Beginner: Just Want to Try It**
```bash
make egw-quick-start
make egw-stats           # See what you got
```

### **Researcher: Want Substantial Content**
```bash
make egw-download-all LIMIT=50
make egw-stats
```

### **Archivist: Want Everything**
```bash
make workflow-zip-all    # Download all ZIPs (takes time!)
make egw-parse-all-zips  # Process into database
```

### **Selective: Want Specific Books**
```bash
# Method 1: Use workflow
make workflow-specific BOOKS="21 29 39 64 68"

# Method 2: Manual
make egw-languages
make egw-books  
make egw-download-zip BOOK=21
make egw-download-zip BOOK=29
make egw-parse-zip BOOK=21
make egw-parse-zip BOOK=29
```

### **Offline Preparation**
```bash
# Download all ZIPs when you have good internet
make workflow-zip-all

# Later, when offline, process them
make egw-parse-all-zips
```

## ❌ **Troubleshooting**

### **"No books found" Error**
```bash
# You tried to download content without setup
# Fix with:
make egw-books           # Download book metadata first
# OR use the safe version:
make egw-download-zips-safe LIMIT=10
```

### **Permission Errors (install-cli)**
```bash
# Fix with either:
sudo make install-cli
# OR
npm config set prefix ~/.npm-global
make install-cli
```

### **Database Issues**
```bash
make db-clean           # Start fresh
make egw-quick-start    # Rebuild
```

## 📊 **Expected Results**

After `make egw-quick-start`:
- ✅ 151 languages in database
- ✅ 1499 books metadata  
- ✅ 5 books with full content (~2000+ paragraphs)
- ✅ Full-text search capability

After `make egw-download-all LIMIT=50`:
- ✅ Everything above
- ✅ 50 books with full content (~25,000+ paragraphs)
- ✅ Substantial research database

After `make workflow-zip-all`:
- ✅ Complete ZIP backup (~500MB-1GB)
- ✅ Offline processing capability
- ✅ Can recreate database anytime