/**
 * Database types and interfaces
 * Based on the architecture document table structure
 */

export interface Account {
  id: string;
  name: string;
  phone: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  account_id: string;
  questionnaire_responses: Record<string, any>;
  preferred_platform: 'whatsapp' | 'sms';
  created_at: string;
  updated_at: string;
}

export interface AOSession {
  id: string;
  account_id: string;
  session_type: 'message' | 'call';
  content: string;
  duration_minutes?: number;
  created_at: string;
}

export interface AOPhoneCall {
  id: string;
  account_id: string;
  duration_minutes: number;
  transcript?: string;
  created_at: string;
}

export interface AOMessage {
  id: string;
  account_id: string;
  message_content: string;
  response_content?: string;
  platform: 'whatsapp' | 'sms';
  created_at: string;
}

export interface GroupWorkshop {
  id: string;
  title: string;
  description: string;
  scheduled_date: string;
  capacity: number;
  created_at: string;
}

export interface WorkshopAttendance {
  id: string;
  workshop_id: string;
  account_id: string;
  attended: boolean;
  created_at: string;
}

export interface MedicineRetreat {
  id: string;
  title: string;
  description: string;
  location: string;
  start_date: string;
  end_date: string;
  capacity: number;
  created_at: string;
}

export interface RetreatAttendance {
  id: string;
  retreat_id: string;
  account_id: string;
  attended: boolean;
  created_at: string;
}