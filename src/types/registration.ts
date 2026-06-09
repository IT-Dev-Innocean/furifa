export type GenderOption = 'laki_laki' | 'perempuan';

export type SocialMediaOption =
  | 'instagram'
  | 'facebook'
  | 'tiktok'
  | 'youtube'
  | 'twitter'
  | 'shopee'
  | 'lainnya';

export type PetTypeOption = 'kucing' | 'anjing' | 'lainnya';

export type PetGenderOption = 'jantan' | 'betina';

export interface FurifaRegistrationForm {
  fullName: string;
  phone: string;
  email: string;
  dateOfBirth: string;
  gender: GenderOption | '';
  provinceId: string;
  provinceName: string;
  cityId: string;
  cityName: string;
  fullAddress: string;
  socialMediaPlatforms: SocialMediaOption[];
  socialMediaUsername: string;
  shopeeUsername: string;
  petType: PetTypeOption | '';
  petGender: PetGenderOption | '';
  petName: string;
  petAgeYears: string;
  agreedToPrivacy: boolean;
  agreedToAdminOnly: boolean;
}

export interface WilayahItem {
  id: string;
  name: string;
}

export interface ConfirmationSnapshot {
  fullName: string;
  email: string;
  phone: string;
  provinceName: string;
  cityName: string;
  petName: string;
  petType: string;
  submittedAt: string;
}
