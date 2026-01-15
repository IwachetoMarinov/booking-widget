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
