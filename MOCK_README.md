# Mock Data Configuration

## Cara Menggunakan Mock Data

Mock data digunakan untuk testing tampilan tanpa perlu API backend.

### Mengaktifkan Mock Data (Default: AKTIF)

Edit file `src/services/mockData.ts`:

```typescript
export const MOCK_ENABLED = true  // Mock aktif
```

### Menonaktifkan Mock Data (Gunakan API Asli)

Edit file `src/services/mockData.ts`:

```typescript
export const MOCK_ENABLED = false  // Gunakan API asli
```

## Fitur yang Sudah Di-Mock

✅ fetchEvents - Menampilkan daftar event
✅ fetchEvent - Detail event
✅ login - Login user
✅ register - Register user
✅ loginAdmin - Login admin
✅ fetchUserProfile - Profile user
✅ fetchMyEvents - My events (kosong)

## Testing

Dengan mock aktif, Anda bisa:
- Melihat tampilan homepage dengan 3 event dummy
- Login dengan email/password apapun (akan berhasil)
- Register dengan data apapun (akan berhasil)
- Melihat detail event
- Navigasi antar halaman

## Catatan

- Mock data menggunakan placeholder images
- Delay 500ms untuk simulasi loading
- Token yang dihasilkan adalah mock token
