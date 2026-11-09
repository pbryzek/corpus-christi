export type EventRequestStatus =
  | 'draft' | 'submitted' | 'changes_requested' | 'approved'
  | 'published' | 'held' | 'closed' | 'cancelled';

export interface EventRequest {
  id: string;
  ministry_id: string;
  created_by: string;
  status: EventRequestStatus;
  title: string;
  description: string | null;
  starts_at: string;
  ends_at: string | null;
  time_tbd: boolean;
  recurrence: string | null;
  location: string | null;
  show_on_home: boolean;
  contact_email: string | null;
  needs_communications: boolean;
  needs_budget: boolean;
  needs_registration: boolean;
  registration_url: string | null;
  payment_url: string | null;
  published_event_id: string | null;
  submitted_at: string | null;
  approved_at: string | null;
  review_notes: string | null;
  created_at: string;
  updated_at: string;
}

export type FinanceStatus =
  | 'draft' | 'submitted' | 'changes_requested' | 'approved' | 'rejected' | 'paid';

export interface BudgetLineItem {
  description: string;
  amount: number;
}

export interface BudgetRequest {
  id: string;
  event_request_id: string;
  submitted_by: string;
  amount_requested: number;
  purpose: string;
  line_items: BudgetLineItem[];
  status: FinanceStatus;
  submitted_at: string | null;
  decided_at: string | null;
  decision_notes: string | null;
  created_at: string;
}

export interface Reimbursement {
  id: string;
  event_request_id: string;
  submitted_by: string;
  payee_name: string;
  amount_total: number;
  expense_report_path: string | null;
  notes: string | null;
  status: FinanceStatus;
  submitted_at: string | null;
  decided_at: string | null;
  decision_notes: string | null;
  processed_at: string | null;
  created_at: string;
}

/** One uploaded file backing a reimbursement; several may attach to one. */
export interface ReimbursementReceipt {
  id: string;
  reimbursement_id: string;
  storage_path: string;
  amount: number | null;
  description: string | null;
  uploaded_by: string;
  uploaded_at: string;
}

export type CommsChannel =
  | 'bulletin' | 'weekly_email' | 'pulpit_announcement' | 'website'
  | 'flyer' | 'qr_code' | 'signup_form' | 'social_media'
  | 'text_message' | 'mobile_app';

export type CommsStatus =
  | 'draft' | 'requested' | 'in_progress' | 'scheduled' | 'published' | 'declined';

export interface CommunicationsRequest {
  id: string;
  event_request_id: string;
  requested_by: string;
  channels: CommsChannel[];
  headline: string;
  body_copy: string | null;
  call_to_action: string | null;
  needed_by: string | null;
  status: CommsStatus;
  handler_notes: string | null;
  created_at: string;
}

export interface AgeDemographics {
  under_18?: number;
  '18_34'?: number;
  '35_54'?: number;
  '55_74'?: number;
  '75_plus'?: number;
}

export interface GenderDemographics {
  male?: number;
  female?: number;
  other?: number;
}

export interface EventWrapup {
  id: string;
  event_request_id: string;
  submitted_by: string;
  attendance_count: number | null;
  demographics_age: AgeDemographics | null;
  demographics_gender: GenderDemographics | null;
  what_worked: string | null;
  what_would_change: string | null;
  share_with_other_ministries: boolean;
  submitted_at: string | null;
  created_at: string;
}

export interface EventWrapupMedia {
  id: string;
  wrapup_id: string;
  storage_path: string;
  media_type: 'photo' | 'video';
  uploaded_by: string;
  uploaded_at: string;
}

export interface Room {
  id: string;
  name: string;
  capacity: number | null;
  is_active: boolean;
}

export interface RoomBooking {
  id: string;
  room_id: string;
  event_request_id: string;
  starts_at: string;
  ends_at: string;
  status: 'requested' | 'confirmed' | 'released';
  setup_notes: string | null;
}

export const CHANNEL_LABELS: Record<CommsChannel, string> = {
  bulletin: 'Bulletin',
  weekly_email: 'Weekly email',
  pulpit_announcement: 'Pulpit announcement',
  website: 'Website',
  flyer: 'Flyer',
  qr_code: 'QR code',
  signup_form: 'Sign-up form',
  social_media: 'Social media',
  text_message: 'Text message',
  mobile_app: 'Mobile app',
};
