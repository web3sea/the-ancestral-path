export type ZoomAttendance = {
    attendance: {
        created_at: string;
        email: string;
        id: string;
        participant_user_id: string;
        user_name: string;
    };
    created_at: string;
    duration_minutes: number;
    id: string;
    join_time: string;
    leave_reason: string | null;
    leave_time: string | null;
    topic: string;
    zoom_event: string;
    zoom_meeting_id: string;
    zoom_user_id: string;
};
