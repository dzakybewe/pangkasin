export interface Barbershop {
  id: string
  name: string
  slug: string
  logo_url: string | null
  primary_color: string
  owner_id: string
  custom_domain: string | null
  country: string
  currency: string
  is_active: boolean
  created_at: string
}

export interface Location {
  id: string
  barbershop_id: string
  name: string
  address: string
  city: string
  province: string
  phone: string
  maps_url: string | null
  is_active: boolean
}

export interface Barber {
  id: string
  barbershop_id: string
  location_id: string | null
  name: string
  photo_url: string | null
  bio: string | null
  specialty: string | null
  is_active: boolean
}

export interface Service {
  id: string
  barbershop_id: string
  name: string
  description: string | null
  duration_minutes: number
  is_active: boolean
}

export interface BarberService {
  id: string
  barber_id: string
  service_id: string
  price: number
  duration_minutes: number | null
  is_available: boolean
}

export interface Schedule {
  id: string
  barber_id: string
  day_of_week: number
  open_time: string
  close_time: string
  is_working: boolean
}

export interface BlockedDate {
  id: string
  barber_id: string
  date: string
  reason: string | null
}

export type BookingStatus = "pending" | "confirmed" | "done" | "cancelled"

export interface Booking {
  id: string
  barbershop_id: string
  location_id: string | null
  barber_id: string
  service_id: string
  customer_name: string
  customer_phone: string
  datetime: string
  status: BookingStatus
  notes: string | null
  created_at: string
}

export type UserRole = "owner" | "barber"

export interface User {
  id: string
  barbershop_id: string
  email: string
  role: UserRole
  barber_id: string | null
  created_at: string
}

export interface BarberWithServices extends Barber {
  barber_services: BarberService[]
}

export interface BookingWithDetails extends Booking {
  barber: Pick<Barber, "id" | "name" | "photo_url">
  service: Pick<Service, "id" | "name" | "duration_minutes">
}
