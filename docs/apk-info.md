# EGW Writings 2 APK Information

## Primary App Details

**Package Name**: `com.whiteestate.egwwritings`
**App Name**: EGW Writings 2
**Latest Version**: 7.9.3
**Developer**: Ellen G. White Estate, Inc.
**Size**: ~35 MB
**Minimum Android**: 4.2.0 (API 17)

## Alternative App (Original)

**Package Name**: `egw.estate`
**App Name**: EGW Writings (Original)
**Latest Version**: 2.1.2
**Size**: ~3.1 MB
**Minimum Android**: 2.2

## Download Information

### APK Files Needed
1. **Primary**: `com.whiteestate.egwwritings` (EGW Writings 2) - recommended
2. **Fallback**: `egw.estate` (Original EGW Writings) - smaller, older

### Manual Download Sources
- **APKPure**: Search for "EGW Writings 2" or use package name
- **APKMirror**: Search for "EGW Writings 2"
- **Aptoide**: Available with 7.9.3 version
- **Uptodown**: Has both versions available
- **Google Play Store**: https://play.google.com/store/apps/details?id=com.whiteestate.egwwritings

### File Names to Look For
- `EGW_Writings_2_7.9.3.apk`
- `com.whiteestate.egwwritings_7.9.3.apk`
- Any APK file with package name `com.whiteestate.egwwritings`

## What to Do After Download

1. Place the APK file in the `/apk` directory
2. Rename it to `egw-writings-2.apk` for consistency
3. We'll extract it using apktool and analyze the structure
4. Look for API endpoints, data access methods, and network communication

## Expected File Structure After Extraction

```
egw-writings-2/
├── AndroidManifest.xml
├── apktool.yml
├── res/                # Resources
├── assets/             # Static assets
├── lib/                # Native libraries
├── META-INF/           # App signing info
└── smali/              # Decompiled code (main analysis target)
```

## Analysis Goals

1. **Find API endpoints** in the decompiled code
2. **Identify data access patterns** for books and paragraphs
3. **Document authentication methods** (if any)
4. **Map data structure** and response formats
5. **Create extraction pipeline** based on discovered endpoints