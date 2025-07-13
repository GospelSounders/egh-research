# EGW Writings API Endpoints

## Base API Information

**Base URL**: `https://a.egwwritings.org`
**API Version**: 4.0
**Format**: REST API returning JSON

## Authentication

**OAuth 2.0 Configuration**:
- **Client ID**: `LmuOHIVpIdTXi0qnrtsUtxuUaBqLyvZjgSY91qbC`
- **Client Secret**: `JBD8FwEOn6AN4F769gprjujZrZNkSC07HxKlvJvByJlXzS0sDXPBkm2zRChGYXwv9GZq8aux2gDmLQfzaVvcmDsZgYkp6yZ41tN1oIpbclYH8ARACEzFeaNlm835vnCi`
- **Redirect URI**: `egw://egwwritings.oauthresponse`
- **Scopes**: `user_info writings search studycenter subscriptions offline_access`

## Core Content API Endpoints

### Languages and Folders
```
GET /content/languages
GET /content/languages/{lang}/folders
```

### Books and Content
```
GET /content/books/by_folder/{folderId}                    # Books in a folder
GET /content/books/{bookId}                                # Book information
GET /content/books/{bookId}/toc                            # Table of contents
GET /content/books/{bookId}/chapter/{chapterId}            # Chapter content
GET /content/books/{bookId}/content/{paragraphId}          # Paragraph content
GET /content/books/{bookId}/download                       # Download book (ZIP)
GET /content/books/{bookId}/resources                      # Book resources
GET /content/books/{bookId}/tracklist                      # Audio tracks
GET /content/books/updated                                 # Updated books list
```

### Search
```
GET /search                                                # Search content
GET /search/suggestions                                    # Search suggestions
```

### Miscellaneous
```
GET /content/mirrors                                       # CDN mirrors
```

## User Settings & Synchronization

### Authentication & User Info
```
GET /user/info/                                           # User information
```

### History & Settings Sync
```
GET /settings/download_history/                           # Download history
POST /settings/download_history/sync                      # Sync download history
GET /settings/audio/                                      # Audio history
POST /settings/audio/sync                                 # Sync audio history
POST /settings/search_history/sync                        # Sync search history
POST /settings/library/sync                               # Sync library
GET /settings/library/settings                            # Library settings
```

## Study Center
```
GET /studycenter/dump/                                    # Study center data dump
GET /studycenter/dump/iterative/                          # Iterative dump
```

## Subscriptions
```
GET /subscriptions/defaults                               # Default subscriptions
GET /subscriptions/delivery_methods                      # Delivery methods
GET /subscriptions/feeds                                 # Available feeds
GET /subscriptions/feeds/{feedId}                        # Specific feed
GET /subscriptions/subscriptions                         # User subscriptions
GET /subscriptions/subscriptions/{subscriptionId}        # Specific subscription
GET /subscriptions/books                                 # Subscription books
GET /subscriptions/books/{bookId}/toc                    # Subscription book TOC
GET /subscriptions/content                               # Subscription content
GET /subscriptions/content/{year}                        # Content by year
GET /subscriptions/content/{year}/{month}                # Content by month
POST /subscriptions/subscriptions                        # Create subscription
PUT /subscriptions/subscriptions/{subscriptionId}        # Update subscription
POST /subscriptions/subscriptions/{subscriptionId}/start # Start subscription
POST /subscriptions/subscriptions/{subscriptionId}/stop  # Stop subscription
DELETE /subscriptions/subscriptions/stop_all             # Stop all subscriptions
DELETE /subscriptions/feeds/{feedId}                     # Delete feed
PUT /subscriptions/feeds/{feedId}                        # Update feed
POST /subscriptions/content/{contentId}/read             # Mark content as read
POST /subscriptions/content/feeds/{feedId}/read          # Mark feed as read
DELETE /subscriptions/mark_all_as_read                   # Mark all as read
GET /subscriptions/unread_count                          # Unread count
```

## Social Integration
```
GET /settings/social/facebook                            # Facebook settings
PUT /settings/social/facebook                            # Update Facebook
DELETE /settings/social/facebook                         # Remove Facebook
GET /settings/social/twitter                             # Twitter settings
PUT /settings/social/twitter                             # Update Twitter
DELETE /settings/social/twitter                          # Remove Twitter
```

## URL Templates

The API uses URL templates with parameter substitution:

### Books
- **Book Info**: `https://a.egwwritings.org/content/books/{bookId}`
- **Chapter**: `https://a.egwwritings.org/content/books/{bookId}/chapter/{chapterId}`
- **Paragraph**: `https://a.egwwritings.org/content/books/{bookId}/content/{paragraphId}`
- **Table of Contents**: `https://a.egwwritings.org/content/books/{bookId}/toc`
- **Download ZIP**: `https://a.egwwritings.org/content/books/{bookId}/download`

### Folders
- **Books by Folder**: `https://a.egwwritings.org/content/books/by_folder/{folderId}`
- **Language Folders**: `https://a.egwwritings.org/content/languages/{lang}/folders`

## Data Extraction Strategy

### 1. Get Available Languages
```bash
curl "https://a.egwwritings.org/content/languages"
```

### 2. Get Folders for Language (e.g., English)
```bash
curl "https://a.egwwritings.org/content/languages/en/folders"
```

### 3. Get Books in Each Folder
```bash
curl "https://a.egwwritings.org/content/books/by_folder/{folderId}"
```

### 4. Get Book Structure
```bash
# Get book info and TOC
curl "https://a.egwwritings.org/content/books/{bookId}"
curl "https://a.egwwritings.org/content/books/{bookId}/toc"
```

### 5. Extract Content
```bash
# Get chapter content
curl "https://a.egwwritings.org/content/books/{bookId}/chapter/{chapterId}"

# Or get individual paragraphs
curl "https://a.egwwritings.org/content/books/{bookId}/content/{paragraphId}"
```

## Rate Limiting & Best Practices

- **Respectful Delays**: 1-2 seconds between requests
- **User Agent**: Identify as research/educational tool
- **Error Handling**: Handle 429 (Too Many Requests) responses
- **Parallel Requests**: Limit concurrent connections
- **Caching**: Cache responses to avoid repeated requests

## Expected Response Formats

### Book List Response
```json
{
  "books": [
    {
      "id": 123,
      "title": "Book Title",
      "author": "Ellen G. White",
      "lang": "en",
      "folder_id": 1,
      "status": "published"
    }
  ]
}
```

### Chapter Response
```json
{
  "chapter": {
    "id": 456,
    "title": "Chapter Title",
    "content": [
      {
        "id": 789,
        "type": "paragraph",
        "text": "Paragraph content...",
        "reference": "Book 123.45"
      }
    ]
  }
}
```

## Notes

- The app includes extensive metadata files in `/res/raw/` with book hierarchies
- Authentication may be optional for public content
- Some endpoints require user authentication for full access
- The API appears to support both individual paragraph access and bulk chapter downloads
- Book downloads are available as ZIP files containing structured content

---

*Discovered from EGW Writings 2 v7.9.3 APK analysis*
*Generated: 2025-07-13*