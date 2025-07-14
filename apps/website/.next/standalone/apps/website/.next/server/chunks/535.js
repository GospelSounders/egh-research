exports.id=535,exports.ids=[535],exports.modules={8578:e=>{function t(e){var t=Error("Cannot find module '"+e+"'");throw t.code="MODULE_NOT_FOUND",t}t.keys=()=>[],t.resolve=t,t.id=8578,e.exports=t},9750:(e,t,o)=>{"use strict";o.d(t,{EGWDatabase:()=>p,Um:()=>d,p:()=>n});var r=o(7629),a=o(4034),s=o(5315);class i{constructor(e,t){this.currentToken=null,this.config=e,this.tokenFile=t||s.join(process.cwd(),"data","tokens.json")}getAuthorizationUrl(e){let t=new URLSearchParams({response_type:"code",client_id:this.config.clientId,redirect_uri:this.config.redirectUri,scope:this.config.scope,...e&&{state:e}});return`${this.config.authBaseUrl}/connect/authorize?${t.toString()}`}async exchangeCodeForToken(e){try{let t=await r.Z.post(`${this.config.authBaseUrl}/connect/token`,new URLSearchParams({grant_type:"authorization_code",client_id:this.config.clientId,client_secret:this.config.clientSecret,redirect_uri:this.config.redirectUri,code:e}),{headers:{"Content-Type":"application/x-www-form-urlencoded","User-Agent":"EGW-Research-Tool/1.0.0"}}),o={accessToken:t.data.access_token,refreshToken:t.data.refresh_token,expiresAt:Date.now()+1e3*t.data.expires_in,scope:t.data.scope};return await this.saveToken(o),this.currentToken=o,o}catch(e){throw Error(`Failed to exchange code for token: ${e}`)}}async getValidToken(){if(this.currentToken||await this.loadToken(),this.currentToken||(console.log("\uD83D\uDD10 No token found, attempting client credentials authentication..."),await this.clientCredentialsAuth()),this.currentToken&&Date.now()>=this.currentToken.expiresAt-3e5&&(this.currentToken.refreshToken?(console.log("\uD83D\uDD04 Token expired, refreshing..."),await this.refreshToken()):(console.log("\uD83D\uDD10 Token expired, re-authenticating with client credentials..."),await this.clientCredentialsAuth())),!this.currentToken)throw Error("Failed to obtain valid authentication token");return this.currentToken.accessToken}async refreshToken(){if(!this.currentToken?.refreshToken)throw Error("No refresh token available");try{let e=await r.Z.post(`${this.config.authBaseUrl}/connect/token`,new URLSearchParams({grant_type:"refresh_token",client_id:this.config.clientId,client_secret:this.config.clientSecret,refresh_token:this.currentToken.refreshToken}),{headers:{"Content-Type":"application/x-www-form-urlencoded","User-Agent":"EGW-Research-Tool/1.0.0"}}),t={accessToken:e.data.access_token,refreshToken:e.data.refresh_token||this.currentToken.refreshToken,expiresAt:Date.now()+1e3*e.data.expires_in,scope:e.data.scope};return await this.saveToken(t),this.currentToken=t,t}catch(e){throw Error(`Failed to refresh token: ${e}`)}}async clientCredentialsAuth(){try{console.log("\uD83D\uDD10 Authenticating with client credentials...");let e=await r.Z.post(`${this.config.authBaseUrl}/connect/token`,new URLSearchParams({grant_type:"client_credentials",client_id:this.config.clientId,client_secret:this.config.clientSecret,scope:this.config.scope}),{headers:{"Content-Type":"application/x-www-form-urlencoded","User-Agent":"EGW-Research-Tool/1.0.0"}}),t={accessToken:e.data.access_token,refreshToken:e.data.refresh_token,expiresAt:Date.now()+1e3*e.data.expires_in,scope:e.data.scope};return await this.saveToken(t),this.currentToken=t,console.log("✅ Client credentials authentication successful"),console.log(`🕒 Token expires: ${new Date(t.expiresAt).toISOString()}`),console.log(`🔑 Scopes: ${t.scope}`),t}catch(e){throw Error(`Failed to authenticate with client credentials: ${e}`)}}async saveToken(e){await a.ensureDir(s.dirname(this.tokenFile)),await a.writeJson(this.tokenFile,e,{spaces:2})}async loadToken(){try{if(await a.pathExists(this.tokenFile)){let e=await a.readJson(this.tokenFile);e.expiresAt&&Date.now()<e.expiresAt-3e5?(this.currentToken=e,console.log("✅ Loaded valid token from file")):console.log("⚠️  Saved token is expired")}}catch(e){console.warn("Failed to load saved token:",e),this.currentToken=null}}async clearToken(){this.currentToken=null,await a.pathExists(this.tokenFile)&&await a.remove(this.tokenFile)}async isAuthenticated(){try{return await this.getValidToken(),!0}catch{return!1}}getTokenInfo(){return this.currentToken}}let n=()=>{let e=process.env.EGW_CLIENT_ID,t=process.env.EGW_CLIENT_SECRET;if(!e||!t)throw Error("Missing EGW API credentials. Please set EGW_CLIENT_ID and EGW_CLIENT_SECRET environment variables.");return new i({clientId:e,clientSecret:t,redirectUri:process.env.EGW_REDIRECT_URI||"egw://egwwritings.oauthresponse",scope:process.env.EGW_SCOPE||"writings search studycenter subscriptions user_info",authBaseUrl:process.env.EGW_AUTH_BASE_URL||"https://cpanel.egwwritings.org",apiBaseUrl:process.env.EGW_API_BASE_URL||"https://a.egwwritings.org"},process.env.EGW_TOKEN_FILE||s.join(process.cwd(),"data","tokens.json"))};class c{constructor(e,t="https://a.egwwritings.org"){this.authManager=e,this.baseUrl=t,this.client=r.Z.create({baseURL:t,timeout:3e4,headers:{"User-Agent":"EGW-Research-Tool/1.0.0","Content-Type":"application/json"}}),this.client.interceptors.request.use(async e=>{try{let t=await this.authManager.getValidToken();e.headers.Authorization=`Bearer ${t}`}catch(e){console.warn("No valid auth token available:",e)}return e}),this.client.interceptors.response.use(e=>e,e=>(e.response?.status===401&&console.error("Authentication failed. Please re-authenticate."),Promise.reject(e)))}async delay(e=1e3){return new Promise(t=>setTimeout(t,e))}async getLanguages(){let e=await this.client.get("/content/languages");return await this.delay(),e.data}async getFolders(e){let t=await this.client.get(`/content/languages/${e}/folders`);return await this.delay(),t.data}async getBooksByFolder(e){let t=await this.client.get(`/content/books/by_folder/${e}`);return await this.delay(),t.data}async getBook(e){let t=await this.client.get(`/content/books/${e}`);return await this.delay(),t.data}async getBookToc(e){let t=await this.client.get(`/content/books/${e}/toc`);return await this.delay(),t.data}async getChapter(e,t){let o=await this.client.get(`/content/books/${e}/chapter/${t}`);return await this.delay(),o.data}async getParagraph(e,t){let o=await this.client.get(`/content/books/${e}/content/${t}`);return await this.delay(),o.data}async search(e,t){let o=new URLSearchParams({query:e,...t?.lang&&{lang:t.lang.join(",")},...t?.folder&&{folder:t.folder.join(",")},...t?.pubnr&&{pubnr:t.pubnr.join(",")},...t?.limit&&{limit:t.limit.toString()},...t?.offset&&{offset:t.offset.toString()},...t?.highlight&&{highlight:t.highlight},...t?.trans&&{trans:t.trans}}),r=await this.client.get(`/search?${o.toString()}`);return await this.delay(),r.data}async getSearchSuggestions(e){let t=await this.client.get(`/search/suggestions?query=${encodeURIComponent(e)}`);return await this.delay(),t.data}async downloadBook(e){let t=await this.client.get(`/content/books/${e}/download`,{responseType:"arraybuffer"});return await this.delay(2e3),Buffer.from(t.data)}async getUserInfo(){let e=await this.client.get("/user/info/");return await this.delay(),e.data}async testConnection(){try{return await this.getUserInfo(),!0}catch(e){return console.error("API connection test failed:",e),!1}}async getApiStatus(){try{let e=await this.client.get("/content/mirrors");return{status:"connected",data:e.data}}catch(e){return{status:"error",error:e}}}}let d=e=>new c(e);o(896);var l=o(2048),E=o(9162);class p{constructor(e={}){let t=e.dbPath||s.join(process.cwd(),"data","egw-writings.db");console.log("Creating EGWDatabase with path:",t),console.log("Database file exists:",(0,l.existsSync)(t));let o=s.dirname(t);(0,l.existsSync)(o)||(console.log("Creating database directory:",o),(0,l.mkdirSync)(o,{recursive:!0})),this.db=new E(t),this.db.pragma("foreign_keys = OFF"),!1!==e.enableWAL&&this.db.pragma("journal_mode = WAL"),this.initializeSchema(),!1!==e.enableFTS&&this.initializeFTS()}initializeSchema(){this.db.exec(`
      CREATE TABLE IF NOT EXISTS languages (
        code TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        direction TEXT NOT NULL DEFAULT 'ltr'
      )
    `),this.db.exec(`
      CREATE TABLE IF NOT EXISTS folders (
        folder_id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        add_class TEXT NOT NULL,
        nbooks INTEGER DEFAULT 0,
        naudiobooks INTEGER DEFAULT 0,
        sort_order INTEGER DEFAULT 0,
        parent_id INTEGER
      )
    `),this.db.exec(`
      CREATE TABLE IF NOT EXISTS books (
        book_id INTEGER PRIMARY KEY,
        code TEXT NOT NULL,
        lang TEXT NOT NULL,
        type TEXT NOT NULL,
        subtype TEXT,
        title TEXT NOT NULL,
        first_para TEXT,
        author TEXT NOT NULL,
        description TEXT,
        npages INTEGER,
        isbn TEXT,
        publisher TEXT,
        pub_year TEXT,
        buy_link TEXT,
        folder_id INTEGER NOT NULL,
        folder_color_group TEXT,
        cover_small TEXT,
        cover_large TEXT,
        file_mp3 TEXT,
        file_pdf TEXT,
        file_epub TEXT,
        file_mobi TEXT,
        download_url TEXT,
        last_modified TEXT,
        permission_required TEXT DEFAULT 'public',
        sort_order INTEGER DEFAULT 0,
        is_audiobook BOOLEAN DEFAULT FALSE,
        cite TEXT,
        original_book TEXT,
        translated_into TEXT, -- JSON array
        nelements INTEGER DEFAULT 0,
        downloaded_at DATETIME,
        category TEXT, -- Main category: egw, pioneer, devotional, historical, periodical, reference
        subcategory TEXT -- Subcategory within main category
      )
    `);try{this.db.exec("ALTER TABLE books ADD COLUMN category TEXT;")}catch(e){}try{this.db.exec("ALTER TABLE books ADD COLUMN subcategory TEXT;")}catch(e){}this.db.exec(`
      CREATE TABLE IF NOT EXISTS paragraphs (
        para_id TEXT PRIMARY KEY,
        book_id INTEGER NOT NULL,
        id_prev TEXT,
        id_next TEXT,
        refcode_1 TEXT,
        refcode_2 TEXT,
        refcode_3 TEXT,
        refcode_4 TEXT,
        refcode_short TEXT,
        refcode_long TEXT,
        element_type TEXT NOT NULL,
        element_subtype TEXT,
        content TEXT NOT NULL,
        content_plain TEXT, -- HTML stripped version for FTS
        puborder INTEGER,
        chapter_title TEXT
      )
    `),this.db.exec(`
      CREATE TABLE IF NOT EXISTS download_progress (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        task_type TEXT NOT NULL, -- 'languages', 'folders', 'books', 'content'
        language_code TEXT,
        folder_id INTEGER,
        book_id INTEGER,
        total_items INTEGER,
        completed_items INTEGER DEFAULT 0,
        started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        completed_at DATETIME,
        error_message TEXT,
        status TEXT DEFAULT 'pending' -- 'pending', 'in_progress', 'completed', 'failed'
      )
    `),this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_books_lang ON books(lang);
      CREATE INDEX IF NOT EXISTS idx_books_folder ON books(folder_id);
      CREATE INDEX IF NOT EXISTS idx_books_author ON books(author);
      CREATE INDEX IF NOT EXISTS idx_books_category ON books(category);
      CREATE INDEX IF NOT EXISTS idx_books_subcategory ON books(subcategory);
      CREATE INDEX IF NOT EXISTS idx_books_type ON books(type);
      CREATE INDEX IF NOT EXISTS idx_paragraphs_book ON paragraphs(book_id);
      CREATE INDEX IF NOT EXISTS idx_paragraphs_type ON paragraphs(element_type);
      CREATE INDEX IF NOT EXISTS idx_paragraphs_order ON paragraphs(book_id, puborder);
    `)}initializeFTS(){this.db.exec(`
      CREATE VIRTUAL TABLE IF NOT EXISTS paragraphs_fts USING fts5(
        para_id UNINDEXED,
        book_id UNINDEXED,
        title UNINDEXED,
        author UNINDEXED,
        content,
        tokenize='porter ascii'
      )
    `),this.db.exec(`
      CREATE TRIGGER IF NOT EXISTS paragraphs_fts_insert AFTER INSERT ON paragraphs BEGIN
        INSERT INTO paragraphs_fts (para_id, book_id, title, author, content)
        SELECT 
          NEW.para_id,
          NEW.book_id,
          b.title,
          b.author,
          NEW.content_plain
        FROM books b WHERE b.book_id = NEW.book_id;
      END;
    `),this.db.exec(`
      CREATE TRIGGER IF NOT EXISTS paragraphs_fts_update AFTER UPDATE ON paragraphs BEGIN
        UPDATE paragraphs_fts SET content = NEW.content_plain WHERE para_id = NEW.para_id;
      END;
    `),this.db.exec(`
      CREATE TRIGGER IF NOT EXISTS paragraphs_fts_delete AFTER DELETE ON paragraphs BEGIN
        DELETE FROM paragraphs_fts WHERE para_id = OLD.para_id;
      END;
    `)}insertLanguage(e,t,o="ltr"){return this.db.prepare(`
      INSERT OR REPLACE INTO languages (code, name, direction) 
      VALUES (?, ?, ?)
    `).run(e,t,o)}getLanguages(){return this.db.prepare("SELECT * FROM languages ORDER BY name").all()}insertBook(e){let t=this.db.prepare(`
      INSERT OR REPLACE INTO books (
        book_id, code, lang, type, subtype, title, first_para, author, description,
        npages, isbn, publisher, pub_year, buy_link, folder_id, folder_color_group,
        cover_small, cover_large, file_mp3, file_pdf, file_epub, file_mobi,
        download_url, last_modified, permission_required, sort_order, is_audiobook,
        cite, original_book, translated_into, nelements, downloaded_at, category, subcategory
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      )
    `),{category:o,subcategory:r}=this.categorizeBook(e);return t.run(e.book_id,e.code,e.lang,e.type,e.subtype,e.title,e.first_para,e.author,e.description,e.npages,e.isbn,e.publisher,e.pub_year,e.buy_link,e.folder_id,e.folder_color_group,e.cover.small,e.cover.large,e.files.mp3,e.files.pdf,e.files.epub,e.files.mobi,e.download,e.last_modified,e.permission_required,e.sort,e.is_audiobook?1:0,e.cite,e.original_book,JSON.stringify(e.translated_into),e.nelements,new Date().toISOString(),o,r)}categorizeBook(e){let t=e.author?.toLowerCase()||"",o=e.title?.toLowerCase()||"",r=e.type?.toLowerCase()||"",a=e.code?.toLowerCase()||"";return t.includes("white")||t.includes("elena")?o.includes("maranatha")||o.includes("heavenly")||o.includes("sons")||o.includes("daughters")||o.includes("morning watch")||o.includes("devotional")?{category:"egw",subcategory:"devotional"}:o.includes("manuscript release")||a.includes("mr")?{category:"egw",subcategory:"manuscripts"}:o.includes("letter")||a.includes("lt")?{category:"egw",subcategory:"letters"}:o.includes("testimon")||a.includes("tt")||a.includes("1t")?{category:"egw",subcategory:"testimonies"}:o.includes("great controversy")||o.includes("desire")||o.includes("patriarchs")||o.includes("acts")||o.includes("prophets and kings")||o.includes("education")||o.includes("ministry of healing")||o.includes("steps to christ")?{category:"egw",subcategory:"books"}:"pamphlet"===r||e.npages<100?{category:"egw",subcategory:"pamphlets"}:{category:"egw",subcategory:"books"}:["uriah smith","a. t. jones","j. n. andrews","john andrews","m. l. andreasen","j. n. loughborough","alonzo jones","ellet waggoner","stephen haskell","william miller","joshua himes","hiram edson","joseph bates"].some(e=>t.includes(e))?"periodical"===r||o.includes("review")||o.includes("herald")?{category:"periodical",subcategory:"pioneer"}:{category:"pioneer",subcategory:"books"}:"periodical"===r||o.includes("review")||o.includes("herald")||o.includes("signs")||o.includes("times")||o.includes("youth")||o.includes("instructor")||o.includes("advent")&&o.includes("herald")?{category:"periodical",subcategory:"historical"}:"bible"===r||"dictionary"===r||"scriptindex"===r||"topicalindex"===r||o.includes("concordance")?{category:"reference",subcategory:"biblical"}:o.includes("history")||o.includes("origin")||o.includes("movement")||o.includes("denomination")||t.includes("spalding")||t.includes("knight")?{category:"historical",subcategory:"denominational"}:"devotional"===r||o.includes("devotional")||o.includes("daily")||o.includes("meditation")?{category:"devotional",subcategory:"modern"}:"book"===r?{category:"historical",subcategory:"general"}:{category:"reference",subcategory:"general"}}getBooks(e,t,o,r){let a="SELECT * FROM books",s=[],i=[];return e&&(i.push("lang = ?"),s.push(e)),t&&(i.push("folder_id = ?"),s.push(t)),o&&(i.push("category = ?"),s.push(o)),r&&(i.push("subcategory = ?"),s.push(r)),i.length>0&&(a+=" WHERE "+i.join(" AND ")),a+=" ORDER BY sort_order, title",this.db.prepare(a).all(...s)}getBooksByCategories(e){let t=`
      SELECT 
        category,
        subcategory,
        COUNT(*) as count,
        GROUP_CONCAT(title, '|||') as sample_titles
      FROM books
    `,o=[];return e&&(t+=" WHERE lang = ?",o.push(e)),t+=" GROUP BY category, subcategory ORDER BY category, subcategory",this.db.prepare(t).all(...o)}updateBookCategories(){let e=this.db.prepare("SELECT * FROM books WHERE category IS NULL").all();for(let t of e){let{category:e,subcategory:o}=this.categorizeBook(t);this.db.prepare(`
        UPDATE books SET category = ?, subcategory = ? WHERE book_id = ?
      `).run(e,o,t.book_id)}return e.length}getBook(e){return this.db.prepare("SELECT * FROM books WHERE book_id = ?").get(e)}insertParagraph(e,t,o){let r=this.db.prepare(`
      INSERT OR REPLACE INTO paragraphs (
        para_id, book_id, id_prev, id_next, refcode_1, refcode_2, refcode_3, refcode_4,
        refcode_short, refcode_long, element_type, element_subtype, content, 
        content_plain, puborder, chapter_title
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `),a=e.content.replace(/<[^>]*>/g,"").trim();return r.run(e.para_id,t,e.id_prev,e.id_next,e.refcode_1,e.refcode_2,e.refcode_3,e.refcode_4,e.refcode_short,e.refcode_long,e.element_type,e.element_subtype,e.content,a,e.puborder,o)}getParagraphs(e,t,o){let r="SELECT * FROM paragraphs WHERE book_id = ? ORDER BY puborder",a=[e];return t&&(r+=" LIMIT ?",a.push(t),o&&(r+=" OFFSET ?",a.push(o))),this.db.prepare(r).all(...a)}search(e,t=100,o=0){return this.db.prepare(`
      SELECT 
        p.para_id,
        p.book_id,
        b.code as pub_code,
        b.title as pub_name,
        p.refcode_long,
        p.refcode_short,
        b.pub_year,
        snippet(paragraphs_fts, 4, '<mark>', '</mark>', '...', 32) as snippet,
        rank as weight,
        b.folder_color_group as group,
        b.lang
      FROM paragraphs_fts pf
      JOIN paragraphs p ON pf.para_id = p.para_id
      JOIN books b ON p.book_id = b.book_id
      WHERE paragraphs_fts MATCH ?
      ORDER BY rank
      LIMIT ? OFFSET ?
    `).all(e,t,o).map((e,t)=>({index:o+t,lang:e.lang,para_id:e.para_id,pub_code:e.pub_code,pub_name:e.pub_name,refcode_long:e.refcode_long,refcode_short:e.refcode_short,pub_year:e.pub_year,snippet:e.snippet,weight:e.weight,group:e.group}))}searchCount(e){return this.db.prepare(`
      SELECT COUNT(*) as count
      FROM paragraphs_fts
      WHERE paragraphs_fts MATCH ?
    `).get(e).count}createDownloadTask(e,t,o,r,a){return this.db.prepare(`
      INSERT INTO download_progress (task_type, language_code, folder_id, book_id, total_items, status)
      VALUES (?, ?, ?, ?, ?, 'pending')
    `).run(e,t,o,r,a).lastInsertRowid}updateDownloadProgress(e,t,o,r){return this.db.prepare(`
      UPDATE download_progress 
      SET completed_items = ?, status = COALESCE(?, status), error_message = ?, 
          completed_at = CASE WHEN ? = 'completed' THEN CURRENT_TIMESTAMP ELSE completed_at END
      WHERE id = ?
    `).run(t,o,r,o,e)}getDownloadProgress(){return this.db.prepare(`
      SELECT * FROM download_progress 
      ORDER BY started_at DESC
    `).all()}insertFolder(e){return this.db.prepare(`
      INSERT OR REPLACE INTO folders (
        folder_id, name, add_class, nbooks, naudiobooks, sort_order, parent_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(e.folder_id,e.name,e.add_class,e.nbooks,e.naudiobooks,e.sort_order,e.parent_id)}markBookAsDownloaded(e){return this.db.prepare(`
      UPDATE books 
      SET downloaded_at = CURRENT_TIMESTAMP 
      WHERE book_id = ?
    `).run(e)}getStats(){let e={languages:this.db.prepare("SELECT COUNT(*) as count FROM languages").get(),books:this.db.prepare("SELECT COUNT(*) as count FROM books").get(),paragraphs:this.db.prepare("SELECT COUNT(*) as count FROM paragraphs").get(),downloadedBooks:this.db.prepare("SELECT COUNT(*) as count FROM books WHERE downloaded_at IS NOT NULL").get()};return{languages:e.languages.count,books:e.books.count,paragraphs:e.paragraphs.count,downloadedBooks:e.downloadedBooks.count}}close(){this.db.close()}}}};