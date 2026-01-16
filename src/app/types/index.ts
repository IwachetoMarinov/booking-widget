/* eslint-disable @typescript-eslint/no-explicit-any */

export type IssueTokenResponse = {
  AccessToken?: string;
  access_token?: string;
  TokenType?: string;
  ExpiresIn?: number;
  expires_in?: number;
  RefreshToken?: string;
  refresh_token?: string;
};

export type TokenState = {
  accessToken: string;
  refreshToken?: string;
  expiresAt: number;
};

export interface AvailabilityInterface {
  Id: number;
  Staff: Record<string, any>;
  SessionType: Record<string, any>;
  Programs: any;
  StartDateTime: string;
  EndDateTime: string;
  BookableEndDateTime: string;
  Location: Record<string, any>;
  PrepTime: any;
  FinishTime: any;
  IsMasked: boolean;
  ShowPublic: boolean;
  ResourceAvailabilities: any;
}

export type InputFieldProps = {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  type?: React.HTMLInputTypeAttribute;
  placeholder?: string;
  required?: boolean;
  error?: string;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
};

export type CustomerFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  siteId: number;
};

export interface CreateBookingInterface {
  customerId: number;
  selectedSlot: SlotAvailability;
  treatmentId: number;
  siteId: number;
  selectedDate: string;
  duration: number;
}

export type SlotAvailability = {
  staffId: number | string | undefined;
  duration: {
    start: string; // ISO string (UTC)
    end: string; // ISO string (UTC)
  };
};

export interface BookingInterface {
  Id: number;
  Status: string;
  StartDateTime: string;
  EndDateTime: string;
  StaffId: number;
  ClientId: string;
  SessionTypeId: number;
  LocationId: number;
  Notes: string | null;
  GenderPreference: string;
  Duration: number;
  ProviderId: string;
  StaffRequested: boolean;
  FirstAppointment: boolean;
  IsWaitlist: boolean;
  WaitlistEntryId: number | null;
  ClientServiceId: number | null;
  Resources: any;
  AddOns: any;
  OnlineDescription: string;
}
