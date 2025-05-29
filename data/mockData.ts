
import { Category,Company } from "../types";


export const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Fason Üretim',
    description: 'Matbaa sektöründe fason üretim hizmetleri sunan firmalar',
    slug: 'fason-uretim',
    type: 'fason',
    subcategories: [
      {
        id: '101',
        name: 'Ofset Baskı',
        description: 'Fason ofset baskı hizmetleri',
        slug: 'ofset-baski',
      },
      {
        id: '102',
        name: 'Yaldız Baskı',
        description: 'Fason yaldız baskı hizmetleri',
        slug: 'yaldiz-baski',
      },
      {
        id: '103',
        name: 'Selefon',
        description: 'Fason selefon kaplama hizmetleri',
        slug: 'selefon',
      },
      {
        id: '104',
        name: 'Gofre',
        description: 'Fason gofre baskı hizmetleri',
        slug: 'gofre',
      },
      {
        id: '105',
        name: 'Kutu Yapıştırma',
        description: 'Fason kutu yapıştırma hizmetleri',
        slug: 'kutu-yapistirma',
      },
      {
        id: '106',
        name: 'Karton Çanta Yapıştırma',
        description: 'Fason karton çanta yapıştırma hizmetleri',
        slug: 'karton-canta-yapistirma',
      },
    ],
  },
  {
    id: '2',
    name: 'Üretim Yapan Firmalar',
    description: 'Matbaa sektöründe üretim yapan firmalar',
    slug: 'uretim-yapan-firmalar',
    type: 'uretim',
    subcategories: [
      {
        id: '201',
        name: 'Kartvizit',
        description: 'Kartvizit üretimi yapan firmalar',
        slug: 'kartvizit',
      },
      {
        id: '202',
        name: 'Davetiye',
        description: 'Davetiye üretimi yapan firmalar',
        slug: 'davetiye',
      },
      {
        id: '203',
        name: 'Karton Çanta',
        description: 'Karton çanta üretimi yapan firmalar',
        slug: 'karton-canta',
      },
      {
        id: '204',
        name: 'Kutu',
        description: 'Kutu üretimi yapan firmalar',
        slug: 'kutu',
      },
      {
        id: '205',
        name: 'Taslama',
        description: 'Taslama üretimi yapan firmalar',
        slug: 'taslama',
      },
    ],
  },
];

export const mockCompanies: Company[] = [
  {
    id: '1',
    name: 'Örnek Matbaa',
    description: 'Matbaa sektöründe 20 yıllık deneyim ile hizmet vermekteyiz. Ofset baskı, selefon kaplama ve kutu yapıştırma alanlarında uzmanız.',
    logo: 'https://images.pexels.com/photos/6177612/pexels-photo-6177612.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    address: 'Matbaacılar Sanayi Sitesi, A Blok No:1, İstanbul',
    phone: '+90 212 123 4567',
    fax: '+90 212 123 4568',
    email: 'info@ornekmatbaa.com',
    website: 'www.ornekmatbaa.com',
    socialMedia: {
      facebook: 'ornekmatbaa',
      instagram: 'ornekmatbaa',
      twitter: 'ornekmatbaa',
    },
    location: {
      lat: 41.0082,
      lng: 28.9784,
    },
    categoryIds: ['1'],
    subcategoryIds: ['101', '103', '105'],
    images: [
      'https://images.pexels.com/photos/5692122/pexels-photo-5692122.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/6177611/pexels-photo-6177611.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/4482900/pexels-photo-4482900.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    ],
    productImages: [
      'https://images.pexels.com/photos/5691694/pexels-photo-5691694.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/5691540/pexels-photo-5691540.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/5691542/pexels-photo-5691542.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    ],
    isApproved: true,
    createdAt: '2023-01-15T10:30:00Z',
    updatedAt: '2023-06-20T14:45:00Z',
  },
  {
    id: '2',
    name: 'Özel Davetiye',
    description: 'Özel davetiye tasarımı ve üretimi yapan firmamız, düğün, nişan, sünnet ve özel organizasyonlar için davetiye çözümleri sunmaktadır.',
    logo: 'https://images.pexels.com/photos/6177725/pexels-photo-6177725.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    address: 'Matbaacılar Sanayi Sitesi, B Blok No:5, İstanbul',
    phone: '+90 212 234 5678',
    email: 'info@ozeldavetiye.com',
    website: 'www.ozeldavetiye.com',
    socialMedia: {
      instagram: 'ozeldavetiye',
      facebook: 'ozeldavetiye',
    },
    location: {
      lat: 41.0092,
      lng: 28.9794,
    },
    categoryIds: ['2'],
    subcategoryIds: ['202'],
    images: [
      'https://images.pexels.com/photos/6177629/pexels-photo-6177629.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/6177589/pexels-photo-6177589.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    ],
    productImages: [
      'https://images.pexels.com/photos/7061821/pexels-photo-7061821.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/7061665/pexels-photo-7061665.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/7061774/pexels-photo-7061774.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    ],
    isApproved: true,
    createdAt: '2023-02-10T09:15:00Z',
    updatedAt: '2023-07-05T11:30:00Z',
  },
  {
    id: '3',
    name: 'Kutu Dünyası',
    description: 'Kutu üretimi konusunda uzmanlaşmış firmamız, hediye kutuları, ambalaj kutuları ve özel tasarım kutular üretmektedir.',
    logo: 'https://images.pexels.com/photos/5709661/pexels-photo-5709661.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    address: 'Matbaacılar Sanayi Sitesi, C Blok No:8, İstanbul',
    phone: '+90 212 345 6789',
    email: 'info@kutudunyasi.com',
    website: 'www.kutudunyasi.com',
    socialMedia: {
      instagram: 'kutudunyasi',
      facebook: 'kutudunyasi',
      linkedin: 'kutu-dunyasi',
    },
    location: {
      lat: 41.0102,
      lng: 28.9804,
    },
    categoryIds: ['2'],
    subcategoryIds: ['204'],
    images: [
      'https://images.pexels.com/photos/5709661/pexels-photo-5709661.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/6177587/pexels-photo-6177587.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    ],
    productImages: [
      'https://images.pexels.com/photos/6044227/pexels-photo-6044227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/6044266/pexels-photo-6044266.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/6044197/pexels-photo-6044197.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    ],
    isApproved: true,
    createdAt: '2023-03-05T13:45:00Z',
    updatedAt: '2023-08-12T16:20:00Z',
  },
  {
    id: '4',
    name: 'Yaldız Uzmanı',
    description: 'Yaldız baskı konusunda uzmanlaşmış firmamız, her türlü matbaa ürününe yaldız baskı hizmeti sunmaktadır.',
    logo: 'https://images.pexels.com/photos/5709667/pexels-photo-5709667.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    address: 'Matbaacılar Sanayi Sitesi, D Blok No:3, İstanbul',
    phone: '+90 212 456 7890',
    email: 'info@yaldizuzmani.com',
    website: 'www.yaldizuzmani.com',
    socialMedia: {
      instagram: 'yaldizuzmani',
    },
    location: {
      lat: 41.0112,
      lng: 28.9814,
    },
    categoryIds: ['1'],
    subcategoryIds: ['102'],
    images: [
      'https://images.pexels.com/photos/5709667/pexels-photo-5709667.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/5692180/pexels-photo-5692180.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    ],
    productImages: [
      'https://images.pexels.com/photos/5709667/pexels-photo-5709667.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/7794442/pexels-photo-7794442.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/3608311/pexels-photo-3608311.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    ],
    isApproved: true,
    createdAt: '2023-04-20T10:10:00Z',
    updatedAt: '2023-09-01T09:30:00Z',
  },
];

// Bekleyen onay listesi
export const mockPendingApprovals = [
  {
    id: '101',
    type: 'registration',
    companyId: '5',
    companyName: 'Yeni Matbaa',
    submittedAt: '2023-10-15T14:30:00Z',
    data: {
      name: 'Yeni Matbaa',
      description: 'Yeni kurulan matbaa şirketimiz.',
      email: 'info@yenimatbaa.com',
      phone: '+90 212 567 8901',
    }
  },
  {
    id: '102',
    type: 'profile_update',
    companyId: '2',
    companyName: 'Özel Davetiye',
    submittedAt: '2023-10-18T11:45:00Z',
    data: {
      description: 'Özel davetiye tasarımı ve üretimi yapan firmamız, 15 yıllık tecrübesi ile düğün, nişan, sünnet ve özel organizasyonlar için davetiye çözümleri sunmaktadır.',
      phone: '+90 212 234 5679',
    }
  }
];