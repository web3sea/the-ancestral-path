"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MessageCircle, User, Calendar, MessageSquare, Timer, Mail, HatGlasses, LogOut, LogIn } from "lucide-react";
import { ZoomAttendance } from "@/@types/zoom-attendance";

export default function OracleConversationsPage() {
  const [zoomAttendanceList, setZoomAttendanceList] = useState<ZoomAttendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchZoomAttendanceList();
  }, []);

  const fetchZoomAttendanceList = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/zoom/list");

      if (!response.ok) {
        throw new Error("Failed to fetch conversations");
      }

      const data = await response.json();

      if (data) {
        setZoomAttendanceList(data);
      } else {
        throw new Error("Invalid response format from API");
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
      setError("Failed to load conversations");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex items-center justify-center h-full">
          <div className="flex items-center space-x-2 text-primary-300/60">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-300"></div>
            <span>Loading Zoom attendance...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-lg">
        <p className="text-red-400">{error}</p>
        <button
          onClick={fetchZoomAttendanceList}
          className="mt-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-x-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary-300 mb-2">
          Zoom Tracking
        </h1>
        <p className="text-primary-300/70">
          View all histories of Zoom meetings
        </p>
      </div>

      {zoomAttendanceList.length === 0 ? (
        <div className="text-center py-12">
          <MessageCircle className="w-12 h-12 text-primary-300/30 mx-auto mb-4" />
          <p className="text-primary-300/60">No histories found</p>
        </div>
      ) : (
        <div className="bg-black/20 backdrop-blur-sm border border-primary-300/20 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-black/40 border-b border-primary-300/20">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-primary-300/80 uppercase tracking-wider">
                    Zoom information
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-primary-300/80 uppercase tracking-wider">
                    User ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-primary-300/80 uppercase tracking-wider">
                    Username
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-primary-300/80 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-primary-300/80 uppercase tracking-wider">
                    Join time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-primary-300/80 uppercase tracking-wider">
                    Leave time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-primary-300/80 uppercase tracking-wider">
                    Leave reason
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-primary-300/10 flex-1">
                {zoomAttendanceList.map((zoomAttendant) => (
                  <tr
                    key={zoomAttendant.id}
                    className="hover:bg-black/10 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-primary-300">
                          Topic: {zoomAttendant.topic}
                        </div>

                        <div className="text-sm text-primary-300/60">
                          <span className="text-primary-300 font-medium">Room ID</span>: {zoomAttendant.zoom_meeting_id}
                        </div>

                        <div className="text-sm text-primary-300/60 flex items-center gap-1">
                          {zoomAttendant.zoom_event === "meeting.participant_joined" ?
                            <>
                              <LogIn className="w-4 h-4 text-green-300" />

                              <span className="text-green-300 font-medium">
                                Joined
                              </span>
                            </>
                            :
                            <>
                              <LogOut className="w-4 h-4 text-red-500" />

                              <span className="text-red-500 font-medium">
                                Left
                              </span>
                            </>
                          }
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-primary-300">
                        {zoomAttendant.zoom_user_id}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4 text-primary-300/60" />
                        <span className="text-primary-300">
                          {zoomAttendant.attendance.user_name}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        {zoomAttendant.attendance.email.length === 0 ?
                          <>
                            <HatGlasses className="w-4 h-4 text-primary-300/60" />
                            <span className="text-primary-300">Anonymous Guest</span>
                          </> : <>
                            <Mail className="w-4 h-4 text-primary-300/60" />
                            <span className="text-primary-300">
                              {zoomAttendant.attendance.email}
                            </span>
                          </>}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-300/80">
                      <div className="flex items-center gap-1">
                        {zoomAttendant.join_time &&
                          <>
                            <Calendar className="w-4 h-4" />
                            {formatDate(zoomAttendant.join_time)}
                          </>
                        }
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-300/80">
                      <div className="flex items-center gap-1">
                        {zoomAttendant.leave_time &&
                          <>
                            <Calendar className="w-4 h-4" />
                            {formatDate(zoomAttendant.leave_time)}
                          </>
                        }
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-300/80">
                      {zoomAttendant.leave_reason?.split('Reason :')[1]?.trim()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="mt-6 text-sm text-primary-300/60">
        Total histories: {zoomAttendanceList.length}
      </div>
    </div>
  );
}
