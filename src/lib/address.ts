import { authService } from './auth';

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api`;

// API Address interface (matches backend schema)
export interface ApiAddress {
  uid: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  phone: string | null;
  isDefault: boolean;
  label: string | null;
  type: 'HOME' | 'WORK' | 'OTHER' | null;
  lat: number | null;
  lng: number | null;
  isDeleted: boolean;
  createdAt: string;
}

// Frontend Address interface (used in components)
export interface Address {
  id: string;
  name: string;
  phone: string;
  line1: string;
  line2: string;
  landmark: string;
  city: string;
  state: string;
  pincode: string;
  addressType: 'HOME' | 'OFFICE' | 'OTHER';
  isDefault: boolean;
}

// Create Address Request
export interface CreateAddressRequest {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  phone?: string;
  isDefault?: boolean;
  label?: string;
  type?: 'HOME' | 'WORK' | 'OTHER';
  lat?: number;
  lng?: number;
}

// Update Address Request
export interface UpdateAddressRequest {
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  phone?: string;
  isDefault?: boolean;
  label?: string;
  type?: 'HOME' | 'WORK' | 'OTHER';
  lat?: number;
  lng?: number;
}

// Convert API address to frontend address format
export function apiAddressToFrontend(apiAddress: ApiAddress): Address {
  return {
    id: apiAddress.uid,
    name: apiAddress.label || '',
    phone: apiAddress.phone || '',
    line1: apiAddress.line1,
    line2: apiAddress.line2 || '',
    landmark: '', // API doesn't have landmark, use label or empty
    city: apiAddress.city,
    state: apiAddress.state,
    pincode: apiAddress.postalCode,
    addressType: apiAddress.type === 'WORK' ? 'OFFICE' : (apiAddress.type || 'HOME'),
    isDefault: apiAddress.isDefault,
  };
}

// Convert frontend address to API create request
export function frontendAddressToApiCreate(address: Omit<Address, 'id'>): CreateAddressRequest {
  return {
    line1: address.line1,
    line2: address.line2 || undefined,
    city: address.city,
    state: address.state,
    country: 'India', // Default country
    postalCode: address.pincode,
    phone: address.phone || undefined,
    isDefault: address.isDefault,
    label: address.name || undefined,
    type: address.addressType === 'OFFICE' ? 'WORK' : address.addressType,
  };
}

// Convert frontend address to API update request
export function frontendAddressToApiUpdate(address: Address): UpdateAddressRequest {
  return {
    line1: address.line1,
    line2: address.line2 || undefined,
    city: address.city,
    state: address.state,
    country: 'India',
    postalCode: address.pincode,
    phone: address.phone || undefined,
    isDefault: address.isDefault,
    label: address.name || undefined,
    type: address.addressType === 'OFFICE' ? 'WORK' : address.addressType,
  };
}

class AddressService {
  private async getAuthHeaders(): Promise<HeadersInit> {
    const token = authService.getAccessToken();
    if (!token) {
      throw new Error('No access token available');
    }

    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }

  async getAddresses(): Promise<Address[]> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/customer/addresses`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized - please log in again');
        }
        throw new Error('Failed to fetch addresses');
      }

      const apiAddresses: ApiAddress[] = await response.json();
      return apiAddresses.map(apiAddressToFrontend);
    } catch (error: any) {
      console.error('Error fetching addresses:', error);
      throw error;
    }
  }

  async createAddress(address: Omit<Address, 'id'>): Promise<Address> {
    try {
      const headers = await this.getAuthHeaders();
      const requestBody = frontendAddressToApiCreate(address);

      const response = await fetch(`${API_BASE_URL}/customer/addresses`, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized - please log in again');
        }
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create address');
      }

      const apiAddress: ApiAddress = await response.json();
      return apiAddressToFrontend(apiAddress);
    } catch (error: any) {
      console.error('Error creating address:', error);
      throw error;
    }
  }

  async updateAddress(addressId: string, address: Address): Promise<Address> {
    try {
      const headers = await this.getAuthHeaders();
      const requestBody = frontendAddressToApiUpdate(address);

      const response = await fetch(`${API_BASE_URL}/customer/addresses/${addressId}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized - please log in again');
        }
        if (response.status === 404) {
          throw new Error('Address not found');
        }
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update address');
      }

      const apiAddress: ApiAddress = await response.json();
      return apiAddressToFrontend(apiAddress);
    } catch (error: any) {
      console.error('Error updating address:', error);
      throw error;
    }
  }

  async deleteAddress(addressId: string): Promise<void> {
    try {
      const headers = await this.getAuthHeaders();

      const response = await fetch(`${API_BASE_URL}/customer/addresses/${addressId}`, {
        method: 'DELETE',
        headers,
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized - please log in again');
        }
        if (response.status === 404) {
          throw new Error('Address not found');
        }
        if (response.status === 400) {
          const errorData = await response.json();
          if (errorData.message.includes('active orders')) {
            throw new Error('Cannot delete address that is used in active orders');
          }
          throw new Error(errorData.message || 'Failed to delete address');
        }
        throw new Error('Failed to delete address');
      }
    } catch (error: any) {
      console.error('Error deleting address:', error);
      throw error;
    }
  }

  async setDefaultAddress(addressId: string): Promise<Address> {
    try {
      const headers = await this.getAuthHeaders();

      const response = await fetch(`${API_BASE_URL}/customer/addresses/${addressId}/set-default`, {
        method: 'PATCH',
        headers,
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized - please log in again');
        }
        if (response.status === 404) {
          throw new Error('Address not found');
        }
        throw new Error('Failed to set default address');
      }

      const apiAddress: ApiAddress = await response.json();
      return apiAddressToFrontend(apiAddress);
    } catch (error: any) {
      console.error('Error setting default address:', error);
      throw error;
    }
  }
}

export const addressService = new AddressService();
