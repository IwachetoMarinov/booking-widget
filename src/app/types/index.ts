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
};
