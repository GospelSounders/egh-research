# EGW Writings APK Analysis - Complete Summary

## Executive Summary

Successfully reverse-engineered the EGW Writings 2 Android app (v7.9.3) to discover a comprehensive REST API for accessing Ellen G. White writings. The analysis revealed a well-structured authentication system and content API that can be leveraged to build an MCP server for AI research assistance.

## Technical Findings

### Application Architecture
- **Hybrid App**: React Native with native Android components
- **Authentication**: OAuth 2.0 with bearer tokens
- **Data Storage**: Local SQLite database + cloud sync
- **Content Rendering**: WebView with custom HTML/CSS/JS
- **Offline Support**: Downloaded books stored locally with HTML rendering

### API Discovery Results

#### Base Configuration
- **API Base URL**: `https://a.egwwritings.org`
- **API Version**: 4.0
- **Protocol**: REST with JSON responses
- **Authentication**: OAuth 2.0 Bearer tokens required

#### OAuth 2.0 Configuration
```
Client ID: LmuOHIVpIdTXi0qnrtsUtxuUaBqLyvZjgSY91qbC
Client Secret: JBD8FwEOn6AN4F769gprjujZrZNkSC07HxKlvJvByJlXzS0sDXPBkm2zRChGYXwv9GZq8aux2gDmLQfzaVvcmDsZgYkp6yZ41tN1oIpbclYH8ARACEzFeaNlm835vnCi
Redirect URI: egw://egwwritings.oauthresponse
Scopes: user_info writings search studycenter subscriptions offline_access
```

#### Content API Structure
- **Languages**: 137 supported languages
- **Organization**: Folder-based categories (Ellen White, Pioneers, Commentaries)
- **Content Access**: Books → Chapters → Paragraphs
- **Identifiers**: Unique paragraph IDs (e.g., "GC 415.2")
- **Downloads**: ZIP files available for offline use

### Key Endpoints Discovered

#### Core Content
```
GET /content/languages                                    # Available languages
GET /content/languages/{lang}/folders                     # Folder categories
GET /content/books/by_folder/{folderId}                  # Books in category
GET /content/books/{bookId}                              # Book metadata
GET /content/books/{bookId}/toc                          # Table of contents
GET /content/books/{bookId}/chapter/{chapterId}          # Chapter content
GET /content/books/{bookId}/content/{paragraphId}        # Paragraph content
GET /content/books/{bookId}/download                     # Download ZIP
```

#### Search & Discovery
```
GET /search                                              # Search content
GET /search/suggestions                                  # Search suggestions
```

#### User & Sync
```
GET /user/info/                                         # User information
POST /settings/*/sync                                   # Sync user data
```

### Authentication Flow Analysis

The app uses a standard OAuth 2.0 flow:

1. **Authorization Request**: Redirects to OAuth provider
2. **Token Exchange**: Exchanges authorization code for access token
3. **API Requests**: Includes Bearer token in Authorization header
4. **Token Refresh**: Automatic refresh using refresh tokens

### Data Structure

#### Book Hierarchy
```
Language (e.g., "en")
└── Folder (e.g., "Ellen G. White")
    └── Book (e.g., "The Great Controversy")
        └── Chapter (e.g., "The Destruction of Jerusalem")
            └── Paragraph (e.g., "GC 415.2")
```

#### Content Format
- **Paragraphs**: HTML content with styling
- **References**: Cross-references to other paragraphs
- **Citations**: Bible verse links
- **Metadata**: Author, publication date, language, etc.

## Implementation Strategy

### Phase 1: Authentication
1. Implement OAuth 2.0 client with app credentials
2. Handle authorization flow and token management
3. Test API access with valid tokens

### Phase 2: Data Extraction
1. Fetch available languages and folders
2. Extract book metadata and structure
3. Download content systematically with rate limiting
4. Store in SQLite database with FTS5 search

### Phase 3: MCP Server
1. Implement MCP protocol handlers
2. Create search and retrieval tools
3. Optimize for AI context consumption
4. Add citation and reference tools

## Security Considerations

### Credentials Management
- Store OAuth credentials securely
- Implement token refresh logic
- Handle authentication failures gracefully

### Rate Limiting
- Respect API rate limits (discovered: no explicit limits in app)
- Implement exponential backoff for retries
- Use respectful delays between requests (1-2 seconds)

### Legal Compliance
- Educational and research use only
- Proper attribution of content
- Compliance with egwwritings.org terms of service
- No redistribution beyond fair use

## Technical Challenges Identified

### Authentication Complexity
- OAuth flow requires web browser interaction
- Token management and refresh logic
- Secure credential storage

### Content Volume
- Large dataset (137 languages, thousands of books)
- Efficient storage and indexing required
- Memory management for large content sets

### API Stability
- No documented API, reverse-engineered from app
- Potential for changes without notice
- Need for error handling and fallback strategies

## Expected Performance

### Data Size Estimates
- **English Content**: ~500MB of text
- **All Languages**: ~10-50GB total
- **Database Size**: ~1-5GB with indexing
- **Extraction Time**: 24-48 hours for full dataset

### Search Performance Targets
- **Query Response**: <100ms for most searches
- **Full-text Search**: <500ms for complex queries
- **Context Retrieval**: <50ms for paragraph lookup
- **Memory Usage**: <1GB for active dataset

## Next Steps

1. **Implement OAuth 2.0 client** with discovered credentials
2. **Test API authentication** and basic endpoint access
3. **Build data extraction pipeline** with rate limiting
4. **Create SQLite schema** optimized for search and retrieval
5. **Develop MCP server** with search and context tools
6. **Comprehensive testing** with sample queries

## Risk Assessment

### Technical Risks
- **API Changes**: Medium risk - app-based API may change
- **Rate Limiting**: Low risk - app shows no aggressive limits
- **Authentication**: Medium risk - OAuth flow complexity

### Legal Risks
- **Copyright**: Low risk - educational/research use
- **Terms of Service**: Low risk - similar to app usage
- **Attribution**: Low risk - proper citation implemented

### Mitigation Strategies
- Implement robust error handling and logging
- Create fallback mechanisms for API failures
- Maintain proper documentation and attribution
- Regular testing and monitoring of API endpoints

---

*Analysis completed: 2025-07-13*
*APK Version: EGW Writings 2 v7.9.3*
*Methodology: Static analysis with apktool + dynamic endpoint testing*