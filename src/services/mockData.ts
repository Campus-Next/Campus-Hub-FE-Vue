// Mock data untuk testing tanpa API
export const MOCK_ENABLED = true // Set ke false untuk menggunakan API asli

// Helper untuk membuat mock JWT token
const createMockJWT = (payload: any) => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const body = btoa(JSON.stringify(payload))
  const signature = 'mock-signature'
  return `${header}.${body}.${signature}`
}

export const mockEvents = {
  events: [
    {
      id: 1,
      foto_event: 'https://via.placeholder.com/400x300/027FFF/FFFFFF?text=Event+1',
      category_name: 'Webinar',
      accessibility: 'public',
      judul: 'Workshop Web Development Modern',
      deskripsi: 'Belajar membuat website modern dengan Vue.js dan Tailwind CSS',
      date: '2024-12-25',
      start_time: '09:00',
      end_time: '12:00',
      tempat: 'Gedung A Lantai 3',
      available_slot: 50,
      foto_pembicara: 'https://via.placeholder.com/100/003266/FFFFFF?text=Speaker',
      pembicara: 'John Doe',
      role: 'Senior Developer'
    },
    {
      id: 2,
      foto_event: 'https://via.placeholder.com/400x300/003266/FFFFFF?text=Event+2',
      category_name: 'Seminar',
      accessibility: 'public',
      judul: 'Seminar AI dan Machine Learning',
      deskripsi: 'Memahami dasar-dasar AI dan implementasinya',
      date: '2024-12-26',
      start_time: '13:00',
      end_time: '16:00',
      tempat: 'Auditorium Utama',
      available_slot: 100,
      foto_pembicara: 'https://via.placeholder.com/100/027FFF/FFFFFF?text=Speaker',
      pembicara: 'Jane Smith',
      role: 'AI Researcher'
    },
    {
      id: 3,
      foto_event: 'https://via.placeholder.com/400x300/027FFF/FFFFFF?text=Event+3',
      category_name: 'Workshop',
      accessibility: 'public',
      judul: 'Workshop UI/UX Design',
      deskripsi: 'Belajar prinsip desain UI/UX yang baik',
      date: '2024-12-27',
      start_time: '10:00',
      end_time: '15:00',
      tempat: 'Lab Komputer 2',
      available_slot: 30,
      foto_pembicara: 'https://via.placeholder.com/100/003266/FFFFFF?text=Speaker',
      pembicara: 'Alice Johnson',
      role: 'UI/UX Designer'
    }
  ],
  trending: 15,
  category: 5
}

export const mockCategoryEvents = [
  {
    id: 1,
    foto_event: 'https://via.placeholder.com/400x300/027FFF/FFFFFF?text=Webinar+1',
    category_name: 'Webinar',
    accessibility: 'public',
    judul: 'Webinar Digital Marketing',
    deskripsi: 'Strategi digital marketing untuk pemula',
    date: '2024-12-28',
    pembicara: 'Bob Wilson',
    role: 'Marketing Expert'
  },
  {
    id: 2,
    foto_event: 'https://via.placeholder.com/400x300/003266/FFFFFF?text=Webinar+2',
    category_name: 'Webinar',
    accessibility: 'public',
    judul: 'Webinar Cloud Computing',
    deskripsi: 'Pengenalan cloud computing dan AWS',
    date: '2024-12-29',
    pembicara: 'Carol Davis',
    role: 'Cloud Architect'
  }
]

export const mockUser = {
  id: 1,
  fullname: 'Test User',
  email: 'test@example.com',
  phone: '081234567890',
  photo: null,
  is_admin: false
}

export const mockAdminUser = {
  id: 2,
  fullname: 'Admin User',
  email: 'admin@example.com',
  phone: '081234567891',
  photo: null,
  is_admin: true
}
