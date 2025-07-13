# EGW Writings PDF Generator

A configurable PDF generator for Ellen G. White writings with customizable formatting, pagination, and copyright-compliant alternatives to original pagination.

## Features

- **Flexible Page Formats**: A4, Letter, Legal, or custom dimensions
- **Typography Control**: Font family, size, line height, margins
- **Copyright-Compliant Pagination**: Avoid original page reproduction with alternatives:
  - Sequential numbering
  - Chapter-based numbering
  - Custom reference systems
  - No pagination
- **Paragraph Identification Options**:
  - Hide completely
  - Show as footnotes
  - Show as margin notes
  - Custom formatting
- **Table of Contents**: Auto-generated with configurable depth
- **Progress Tracking**: Real-time generation progress
- **Research Compilation**: Generate PDFs from search results (coming soon)

## Installation

```bash
npm install -g @surgbc/egw-writings-pdf-generator
```

## Prerequisites

You need a local EGW writings database. Download content first:

```bash
egw-downloader quick-start
```

## Usage

### Generate Book PDF

```bash
# Basic usage
egw-pdf-generator book --book-id 123 --output "great-controversy.pdf"

# With custom formatting
egw-pdf-generator book \
  --book-id 123 \
  --output "book.pdf" \
  --page-size A4 \
  --font-size 14 \
  --font-family Times \
  --show-paragraph-ids \
  --paragraph-style margin
```

### List Available Books

```bash
egw-pdf-generator list-books --language en --limit 50
```

### Generate Configuration File

```bash
egw-pdf-generator config --output my-config.json
```

### Use Custom Configuration

```bash
egw-pdf-generator book --book-id 123 --config my-config.json --output book.pdf
```

## Configuration Options

```json
{
  "pageSize": "A4",
  "margins": {
    "top": 72,
    "bottom": 72, 
    "left": 72,
    "right": 72
  },
  "fontSize": 12,
  "lineHeight": 1.4,
  "fontFamily": "Times",
  "paragraphIds": {
    "show": false,
    "style": "hidden",
    "format": "sequential"
  },
  "pagination": {
    "show": true,
    "style": "bottom-center",
    "format": "numeric",
    "startNumber": 1
  },
  "toc": {
    "generate": true,
    "maxDepth": 3,
    "pageBreakAfter": true
  }
}
```

### Paragraph ID Styles

- `hidden`: No paragraph identification (default)
- `inline`: Show IDs within text flow
- `footnote`: Show as footnotes at page bottom
- `margin`: Show in page margins

### Pagination Formats

- `numeric`: 1, 2, 3...
- `roman`: i, ii, iii...
- `alpha`: a, b, c...

### Copyright Compliance

This tool helps avoid copyright issues by:
- Not reproducing original page layouts
- Using alternative numbering systems
- Adding educational use disclaimers
- Providing flexible formatting options

**Important**: Users are responsible for ensuring their use complies with applicable copyright laws and fair use guidelines.

## Examples

### Academic Paper Format
```bash
egw-pdf-generator book --book-id 456 \
  --font-size 11 \
  --font-family Times \
  --show-paragraph-ids \
  --paragraph-style footnote \
  --output "academic-format.pdf"
```

### Large Print Edition
```bash
egw-pdf-generator book --book-id 789 \
  --font-size 16 \
  --page-size Letter \
  --output "large-print.pdf"
```

### Study Edition with References
```bash
egw-pdf-generator book --book-id 101 \
  --show-paragraph-ids \
  --paragraph-style margin \
  --font-family Helvetica \
  --output "study-edition.pdf"
```

## Research Compilation (Coming Soon)

```bash
egw-pdf-generator research \
  --query "sanctification" \
  --max-results 100 \
  --group-by book \
  --output "sanctification-study.pdf"
```

## License

MIT - Open source software for educational and research use.

## Educational and Research Use

This package is designed for educational and research purposes. The EGW writings may be subject to copyright restrictions. Users are responsible for ensuring their use complies with applicable copyright laws and fair use guidelines.