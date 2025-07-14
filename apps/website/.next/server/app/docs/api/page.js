(()=>{var e={};e.id=270,e.ids=[270],e.modules={2934:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external.js")},4580:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external.js")},5869:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},4783:(e,s,r)=>{"use strict";r.r(s),r.d(s,{GlobalError:()=>l.a,__next_app__:()=>x,originalPathname:()=>m,pages:()=>c,routeModule:()=>p,tree:()=>i}),r(1154),r(359),r(5999);var t=r(7188),a=r(8659),n=r(2067),l=r.n(n),o=r(9786),d={};for(let e in o)0>["default","tree","pages","GlobalError","originalPathname","__next_app__","routeModule"].indexOf(e)&&(d[e]=()=>o[e]);r.d(s,d);let i=["",{children:["docs",{children:["api",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(r.bind(r,1154)),"/home/brian/Code/MCPSERVERS/egw-writings-mcp/apps/website/src/app/docs/api/page.tsx"]}]},{}]},{}]},{layout:[()=>Promise.resolve().then(r.bind(r,359)),"/home/brian/Code/MCPSERVERS/egw-writings-mcp/apps/website/src/app/layout.tsx"],"not-found":[()=>Promise.resolve().then(r.t.bind(r,5999,23)),"next/dist/client/components/not-found-error"]}],c=["/home/brian/Code/MCPSERVERS/egw-writings-mcp/apps/website/src/app/docs/api/page.tsx"],m="/docs/api/page",x={require:r,loadChunk:()=>Promise.resolve()},p=new t.AppPageRouteModule({definition:{kind:a.x.APP_PAGE,page:"/docs/api/page",pathname:"/docs/api",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:i}})},8025:()=>{},1154:(e,s,r)=>{"use strict";r.r(s),r.d(s,{default:()=>n,metadata:()=>a});var t=r(4519);let a={title:"EGH Research API Documentation",description:"Complete API reference for the EGH Research Server - offline access to Ellen Gould Harmon writings with PDF generation"};function n(){return(0,t.jsxs)("div",{className:"container mx-auto px-4 py-8 max-w-6xl",children:[(0,t.jsxs)("div",{className:"mb-8",children:[t.jsx("h1",{className:"text-4xl font-bold mb-4",children:"EGH Research API Documentation"}),t.jsx("p",{className:"text-xl text-gray-600 dark:text-gray-300",children:"Complete REST API reference for offline access to Ellen Gould Harmon's writings"})]}),(0,t.jsxs)("section",{className:"mb-12",children:[t.jsx("h2",{className:"text-3xl font-semibold mb-6",children:"\uD83D\uDE80 Quick Start"}),(0,t.jsxs)("div",{className:"grid md:grid-cols-2 gap-6 mb-6",children:[(0,t.jsxs)("div",{className:"bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg",children:[t.jsx("h3",{className:"text-xl font-semibold mb-3 text-blue-800 dark:text-blue-200",children:"Docker (Recommended)"}),t.jsx("pre",{className:"bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto",children:`# Pull and run
docker pull ghcr.io/gospelsounders/egw-writings-mcp/egh-research-server:latest
docker run -p 3000:3000 ghcr.io/gospelsounders/egw-writings-mcp/egh-research-server:latest

# Test the API
curl http://localhost:3000/health`})]}),(0,t.jsxs)("div",{className:"bg-green-50 dark:bg-green-900/20 p-6 rounded-lg",children:[t.jsx("h3",{className:"text-xl font-semibold mb-3 text-green-800 dark:text-green-200",children:"Local Development"}),t.jsx("pre",{className:"bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto",children:`# Clone and build
git clone https://github.com/GospelSounders/egh-research.git
cd egh-research
pnpm install && pnpm build

# Start server
cd apps/local-server
npm run start:http`})]})]})]}),(0,t.jsxs)("section",{className:"mb-12",children:[t.jsx("h2",{className:"text-3xl font-semibold mb-6",children:"\uD83D\uDCCB API Overview"}),t.jsx("div",{className:"bg-gray-50 dark:bg-gray-800 p-6 rounded-lg mb-6",children:(0,t.jsxs)("div",{className:"grid md:grid-cols-3 gap-4",children:[(0,t.jsxs)("div",{children:[t.jsx("h4",{className:"font-semibold text-gray-700 dark:text-gray-300 mb-2",children:"Base URL"}),t.jsx("code",{className:"bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded",children:"http://localhost:3000"})]}),(0,t.jsxs)("div",{children:[t.jsx("h4",{className:"font-semibold text-gray-700 dark:text-gray-300 mb-2",children:"Content Type"}),t.jsx("code",{className:"bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded",children:"application/json"})]}),(0,t.jsxs)("div",{children:[t.jsx("h4",{className:"font-semibold text-gray-700 dark:text-gray-300 mb-2",children:"Authentication"}),t.jsx("span",{className:"text-green-600 dark:text-green-400",children:"None required (local)"})]})]})})]}),(0,t.jsxs)("section",{className:"mb-12",children:[t.jsx("h2",{className:"text-3xl font-semibold mb-6",children:"\uD83C\uDFE5 System Endpoints"}),(0,t.jsxs)("div",{className:"space-y-6",children:[(0,t.jsxs)("div",{className:"border dark:border-gray-700 rounded-lg p-6",children:[(0,t.jsxs)("div",{className:"flex items-center mb-4",children:[t.jsx("span",{className:"bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mr-3",children:"GET"}),t.jsx("code",{className:"text-lg font-mono",children:"/health"})]}),t.jsx("p",{className:"text-gray-600 dark:text-gray-300 mb-4",children:"Returns server health status and database statistics"}),(0,t.jsxs)("details",{className:"bg-gray-50 dark:bg-gray-800 p-4 rounded",children:[t.jsx("summary",{className:"cursor-pointer font-medium",children:"Example Response"}),t.jsx("pre",{className:"mt-3 bg-gray-900 text-green-400 p-3 rounded text-sm overflow-x-auto",children:`{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "database": {
    "books": 150,
    "paragraphs": 125000,
    "languages": 12
  }
}`})]})]}),(0,t.jsxs)("div",{className:"border dark:border-gray-700 rounded-lg p-6",children:[(0,t.jsxs)("div",{className:"flex items-center mb-4",children:[t.jsx("span",{className:"bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mr-3",children:"GET"}),t.jsx("code",{className:"text-lg font-mono",children:"/api/docs"})]}),t.jsx("p",{className:"text-gray-600 dark:text-gray-300 mb-4",children:"Returns interactive API documentation with all available endpoints"})]}),(0,t.jsxs)("div",{className:"border dark:border-gray-700 rounded-lg p-6",children:[(0,t.jsxs)("div",{className:"flex items-center mb-4",children:[t.jsx("span",{className:"bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mr-3",children:"GET"}),t.jsx("code",{className:"text-lg font-mono",children:"/stats"})]}),t.jsx("p",{className:"text-gray-600 dark:text-gray-300 mb-4",children:"Returns detailed database and server statistics including PDF job information"})]})]})]}),(0,t.jsxs)("section",{className:"mb-12",children:[t.jsx("h2",{className:"text-3xl font-semibold mb-6",children:"\uD83D\uDCDA Content Endpoints"}),(0,t.jsxs)("div",{className:"space-y-6",children:[(0,t.jsxs)("div",{className:"border dark:border-gray-700 rounded-lg p-6",children:[(0,t.jsxs)("div",{className:"flex items-center mb-4",children:[t.jsx("span",{className:"bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mr-3",children:"GET"}),t.jsx("code",{className:"text-lg font-mono",children:"/content/books"})]}),t.jsx("p",{className:"text-gray-600 dark:text-gray-300 mb-4",children:"List books with pagination support"}),t.jsx("h4",{className:"font-semibold mb-3",children:"Query Parameters"}),t.jsx("div",{className:"bg-gray-50 dark:bg-gray-800 p-4 rounded mb-4",children:(0,t.jsxs)("ul",{className:"space-y-2 text-sm",children:[(0,t.jsxs)("li",{children:[t.jsx("code",{children:"page"})," (number, optional): Page number (default: 1)"]}),(0,t.jsxs)("li",{children:[t.jsx("code",{children:"limit"})," (number, optional): Items per page (default: 100)"]}),(0,t.jsxs)("li",{children:[t.jsx("code",{children:"lang"})," (string, optional): Language code (default: en)"]}),(0,t.jsxs)("li",{children:[t.jsx("code",{children:"folder"})," (string, optional): Filter by folder/category"]})]})}),(0,t.jsxs)("details",{className:"bg-gray-50 dark:bg-gray-800 p-4 rounded",children:[t.jsx("summary",{className:"cursor-pointer font-medium",children:"Example Request & Response"}),(0,t.jsxs)("div",{className:"mt-3",children:[t.jsx("p",{className:"text-sm font-medium mb-2",children:"Request:"}),t.jsx("pre",{className:"bg-gray-900 text-yellow-400 p-3 rounded text-sm mb-3",children:"GET /content/books?page=1&limit=5&lang=en"}),t.jsx("p",{className:"text-sm font-medium mb-2",children:"Response:"}),t.jsx("pre",{className:"bg-gray-900 text-green-400 p-3 rounded text-sm overflow-x-auto",children:`{
  "count": 150,
  "ipp": 5,
  "next": "http://localhost:3000/content/books?lang=en&limit=5&page=2",
  "previous": null,
  "results": [
    {
      "book_id": 1,
      "title": "The Acts of the Apostles",
      "author": "Ellen G. White",
      "pub_year": "1911",
      "lang": "en",
      "npages": 594,
      "files": {
        "pdf": "/content/books/1/generate-pdf",
        "download": "/content/books/1/download"
      }
    }
  ]
}`})]})]})]}),(0,t.jsxs)("div",{className:"border dark:border-gray-700 rounded-lg p-6",children:[(0,t.jsxs)("div",{className:"flex items-center mb-4",children:[t.jsx("span",{className:"bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mr-3",children:"GET"}),(0,t.jsxs)("code",{className:"text-lg font-mono",children:["/content/books/","{id}"]})]}),t.jsx("p",{className:"text-gray-600 dark:text-gray-300 mb-4",children:"Get detailed information about a specific book"})]}),(0,t.jsxs)("div",{className:"border dark:border-gray-700 rounded-lg p-6",children:[(0,t.jsxs)("div",{className:"flex items-center mb-4",children:[t.jsx("span",{className:"bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mr-3",children:"GET"}),(0,t.jsxs)("code",{className:"text-lg font-mono",children:["/content/books/","{id}","/toc"]})]}),t.jsx("p",{className:"text-gray-600 dark:text-gray-300 mb-4",children:"Get table of contents for a book"})]}),(0,t.jsxs)("div",{className:"border dark:border-gray-700 rounded-lg p-6",children:[(0,t.jsxs)("div",{className:"flex items-center mb-4",children:[t.jsx("span",{className:"bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mr-3",children:"GET"}),(0,t.jsxs)("code",{className:"text-lg font-mono",children:["/content/books/","{id}","/chapters/","{chapter}"]})]}),t.jsx("p",{className:"text-gray-600 dark:text-gray-300 mb-4",children:"Get content for a specific chapter"})]})]})]}),(0,t.jsxs)("section",{className:"mb-12",children:[t.jsx("h2",{className:"text-3xl font-semibold mb-6",children:"\uD83D\uDCC4 PDF Generation"}),(0,t.jsxs)("div",{className:"space-y-6",children:[(0,t.jsxs)("div",{className:"border dark:border-gray-700 rounded-lg p-6",children:[(0,t.jsxs)("div",{className:"flex items-center mb-4",children:[t.jsx("span",{className:"bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mr-3",children:"POST"}),(0,t.jsxs)("code",{className:"text-lg font-mono",children:["/content/books/","{id}","/generate-pdf"]})]}),t.jsx("p",{className:"text-gray-600 dark:text-gray-300 mb-4",children:"Start PDF generation for a book with custom formatting options"}),(0,t.jsxs)("details",{className:"bg-gray-50 dark:bg-gray-800 p-4 rounded",children:[t.jsx("summary",{className:"cursor-pointer font-medium",children:"Request Body & Response"}),(0,t.jsxs)("div",{className:"mt-3",children:[t.jsx("p",{className:"text-sm font-medium mb-2",children:"Request Body (optional):"}),t.jsx("pre",{className:"bg-gray-900 text-yellow-400 p-3 rounded text-sm mb-3 overflow-x-auto",children:`{
  "config": {
    "pageSize": "A4",
    "fontSize": 12,
    "fontFamily": "Times",
    "margins": {
      "top": 72,
      "bottom": 72,
      "left": 72,
      "right": 72
    },
    "toc": {
      "generate": true,
      "maxDepth": 2
    },
    "pagination": {
      "show": true,
      "style": "bottom-center"
    }
  }
}`}),t.jsx("p",{className:"text-sm font-medium mb-2",children:"Response:"}),t.jsx("pre",{className:"bg-gray-900 text-green-400 p-3 rounded text-sm overflow-x-auto",children:`{
  "token": "abc123-def456-ghi789",
  "status": "queued",
  "message": "PDF generation started",
  "statusUrl": "/pdf/status/abc123-def456-ghi789",
  "downloadUrl": "/pdf/download/abc123-def456-ghi789"
}`})]})]})]}),(0,t.jsxs)("div",{className:"border dark:border-gray-700 rounded-lg p-6",children:[(0,t.jsxs)("div",{className:"flex items-center mb-4",children:[t.jsx("span",{className:"bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mr-3",children:"GET"}),(0,t.jsxs)("code",{className:"text-lg font-mono",children:["/pdf/status/","{token}"]})]}),t.jsx("p",{className:"text-gray-600 dark:text-gray-300 mb-4",children:"Check the status of a PDF generation job"}),(0,t.jsxs)("details",{className:"bg-gray-50 dark:bg-gray-800 p-4 rounded",children:[t.jsx("summary",{className:"cursor-pointer font-medium",children:"Example Response"}),t.jsx("pre",{className:"mt-3 bg-gray-900 text-green-400 p-3 rounded text-sm overflow-x-auto",children:`{
  "token": "abc123-def456-ghi789",
  "status": "generating",
  "progress": 45,
  "stage": "processing-chapters",
  "currentChapter": "Chapter 15",
  "totalChapters": 58,
  "estimatedTimeRemaining": "2 minutes",
  "createdAt": "2024-01-15T10:30:00.000Z"
}`})]})]}),(0,t.jsxs)("div",{className:"border dark:border-gray-700 rounded-lg p-6",children:[(0,t.jsxs)("div",{className:"flex items-center mb-4",children:[t.jsx("span",{className:"bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mr-3",children:"GET"}),(0,t.jsxs)("code",{className:"text-lg font-mono",children:["/pdf/download/","{token}"]})]}),t.jsx("p",{className:"text-gray-600 dark:text-gray-300 mb-4",children:'Download the generated PDF file (only available when status is "completed")'})]})]})]}),(0,t.jsxs)("section",{className:"mb-12",children:[t.jsx("h2",{className:"text-3xl font-semibold mb-6",children:"\uD83D\uDD0D Search"}),(0,t.jsxs)("div",{className:"border dark:border-gray-700 rounded-lg p-6",children:[(0,t.jsxs)("div",{className:"flex items-center mb-4",children:[t.jsx("span",{className:"bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mr-3",children:"GET"}),t.jsx("code",{className:"text-lg font-mono",children:"/search"})]}),t.jsx("p",{className:"text-gray-600 dark:text-gray-300 mb-4",children:"Perform full-text search across all content with FTS5 support"}),t.jsx("h4",{className:"font-semibold mb-3",children:"Query Parameters"}),t.jsx("div",{className:"bg-gray-50 dark:bg-gray-800 p-4 rounded mb-4",children:(0,t.jsxs)("ul",{className:"space-y-2 text-sm",children:[(0,t.jsxs)("li",{children:[t.jsx("code",{children:"q"})," (string, required): Search query"]}),(0,t.jsxs)("li",{children:[t.jsx("code",{children:"limit"})," (number, optional): Maximum results (default: 20)"]}),(0,t.jsxs)("li",{children:[t.jsx("code",{children:"offset"})," (number, optional): Result offset (default: 0)"]})]})}),(0,t.jsxs)("details",{className:"bg-gray-50 dark:bg-gray-800 p-4 rounded",children:[t.jsx("summary",{className:"cursor-pointer font-medium",children:"Example Request & Response"}),(0,t.jsxs)("div",{className:"mt-3",children:[t.jsx("p",{className:"text-sm font-medium mb-2",children:"Request:"}),t.jsx("pre",{className:"bg-gray-900 text-yellow-400 p-3 rounded text-sm mb-3",children:"GET /search?q=righteousness%20by%20faith&limit=5"}),t.jsx("p",{className:"text-sm font-medium mb-2",children:"Response:"}),t.jsx("pre",{className:"bg-gray-900 text-green-400 p-3 rounded text-sm overflow-x-auto",children:`{
  "query": "righteousness by faith",
  "total": 284,
  "limit": 5,
  "offset": 0,
  "results": [
    {
      "book_id": 15,
      "title": "Steps to Christ",
      "author": "Ellen G. White",
      "reference": "SC 62.2",
      "snippet": "...justification by <mark>faith</mark>, or <mark>righteousness</mark> by <mark>faith</mark>, is the act of God...",
      "url": "/content/books/15"
    }
  ]
}`})]})]})]})]}),(0,t.jsxs)("section",{className:"mb-12",children:[t.jsx("h2",{className:"text-3xl font-semibold mb-6",children:"⚠️ Error Handling"}),(0,t.jsxs)("div",{className:"bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6",children:[t.jsx("p",{className:"mb-4",children:"All errors follow a consistent JSON format:"}),t.jsx("pre",{className:"bg-gray-900 text-red-400 p-4 rounded text-sm",children:`{
  "error": "Book not found",
  "status": 404,
  "timestamp": "2024-01-15T10:30:00.000Z"
}`}),t.jsx("h4",{className:"font-semibold mt-6 mb-3",children:"Common HTTP Status Codes"}),(0,t.jsxs)("ul",{className:"space-y-2 text-sm",children:[(0,t.jsxs)("li",{children:[t.jsx("code",{children:"200"})," - Success"]}),(0,t.jsxs)("li",{children:[t.jsx("code",{children:"400"})," - Bad Request (invalid parameters)"]}),(0,t.jsxs)("li",{children:[t.jsx("code",{children:"404"})," - Not Found (book, PDF job, etc.)"]}),(0,t.jsxs)("li",{children:[t.jsx("code",{children:"500"})," - Internal Server Error"]})]})]})]}),(0,t.jsxs)("section",{className:"mb-12",children:[t.jsx("h2",{className:"text-3xl font-semibold mb-6",children:"\uD83D\uDCBB SDK Examples"}),(0,t.jsxs)("div",{className:"grid md:grid-cols-2 gap-6",children:[(0,t.jsxs)("div",{children:[t.jsx("h3",{className:"text-xl font-semibold mb-4",children:"JavaScript/Node.js"}),t.jsx("pre",{className:"bg-gray-900 text-green-400 p-4 rounded text-sm overflow-x-auto",children:`// Search for content
const response = await fetch(
  'http://localhost:3000/search?q=righteousness'
);
const data = await response.json();

// Generate PDF
const pdfResponse = await fetch(
  'http://localhost:3000/content/books/1/generate-pdf',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      config: { pageSize: 'A4', fontSize: 12 }
    })
  }
);
const pdfJob = await pdfResponse.json();`})]}),(0,t.jsxs)("div",{children:[t.jsx("h3",{className:"text-xl font-semibold mb-4",children:"Python"}),t.jsx("pre",{className:"bg-gray-900 text-green-400 p-4 rounded text-sm overflow-x-auto",children:`import requests

# Search for content
response = requests.get(
    'http://localhost:3000/search',
    params={'q': 'righteousness', 'limit': 10}
)
data = response.json()

# Generate PDF
pdf_response = requests.post(
    'http://localhost:3000/content/books/1/generate-pdf',
    json={
        'config': {'pageSize': 'A4', 'fontSize': 12}
    }
)
pdf_job = pdf_response.json()`})]})]})]}),(0,t.jsxs)("section",{className:"mb-12",children:[t.jsx("h2",{className:"text-3xl font-semibold mb-6",children:"\uD83D\uDC33 Docker & Deployment"}),(0,t.jsxs)("div",{className:"space-y-4",children:[(0,t.jsxs)("div",{className:"bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg",children:[t.jsx("h3",{className:"text-xl font-semibold mb-3",children:"Production Deployment"}),t.jsx("pre",{className:"bg-gray-900 text-green-400 p-4 rounded text-sm overflow-x-auto",children:`# Pull latest image
docker pull ghcr.io/gospelsounders/egw-writings-mcp/egh-research-server:latest

# Run with persistent storage
docker run -d \\
  --name egh-research \\
  -p 3000:3000 \\
  -v egh-data:/app/apps/local-server/data \\
  --restart unless-stopped \\
  ghcr.io/gospelsounders/egw-writings-mcp/egh-research-server:latest`})]}),(0,t.jsxs)("div",{className:"bg-green-50 dark:bg-green-900/20 p-6 rounded-lg",children:[t.jsx("h3",{className:"text-xl font-semibold mb-3",children:"Docker Compose"}),t.jsx("pre",{className:"bg-gray-900 text-green-400 p-4 rounded text-sm overflow-x-auto",children:`# Download compose file
curl -O https://raw.githubusercontent.com/GospelSounders/egw-writings-mcp/master/apps/local-server/docker-compose.yml

# Start services
docker-compose up -d

# View logs
docker-compose logs -f`})]})]})]}),t.jsx("section",{className:"mt-16 pt-8 border-t dark:border-gray-700",children:(0,t.jsxs)("div",{className:"text-center",children:[t.jsx("p",{className:"text-gray-600 dark:text-gray-300 mb-4",children:"Questions or need help? Check out our resources:"}),(0,t.jsxs)("div",{className:"flex justify-center space-x-6 text-blue-600 dark:text-blue-400",children:[t.jsx("a",{href:"https://github.com/GospelSounders/egh-research",className:"hover:underline",children:"GitHub Repository"}),t.jsx("a",{href:"https://github.com/GospelSounders/egh-research/issues",className:"hover:underline",children:"Report Issues"}),t.jsx("a",{href:"https://github.com/GospelSounders/egh-research/discussions",className:"hover:underline",children:"Discussions"})]})]})})]})}}};var s=require("../../../webpack-runtime.js");s.C(e);var r=e=>s(s.s=e),t=s.X(0,[800,281,226],()=>r(4783));module.exports=t})();