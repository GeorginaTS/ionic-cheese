// Chat Interfaces for Caseus Chat System
// Firebase Realtime Database + TypeScript Integration

/**
 * Firebase Timestamp interface for type safety
 */
export interface FirebaseTimestamp {
  toDate(): Date;
  seconds: number;
  nanoseconds: number;
}

/**
 * Type union for different timestamp formats
 */
export type TimestampType =
  | Date
  | FirebaseTimestamp
  | number
  | null
  | undefined;

/**
 * Chat message types
 */
export type MessageType = 'text' | 'image' | 'system' | 'notification';

/**
 * Chat message status
 */
export type MessageStatus =
  | 'sending'
  | 'sent'
  | 'delivered'
  | 'read'
  | 'failed';

/**
 * Chat room visibility and access types
 */
export type RoomType = 'public' | 'private' | 'direct';
export type RoomStatus = 'active' | 'archived' | 'deleted';

/**
 * User roles within chat rooms
 */
export type UserRole = 'owner' | 'admin' | 'moderator' | 'member' | 'guest';

/**
 * Main chat message interface
 */
export interface ChatMessage {
  id?: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  message: string;
  timestamp: number;
  type: MessageType;
  roomId: string;
  status?: MessageStatus;
  replyTo?: string; // ID of message being replied to
  editedAt?: number;
  isDeleted?: boolean;
  reactions?: MessageReaction[];
  attachments?: MessageAttachment[];
}

/**
 * Chat room interface
 */
export interface ChatRoom {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  lastMessage?: ChatMessage;
  isActive: boolean;
  createdAt: number;
  createdBy: string;
  type: RoomType;
  status: RoomStatus;
  tags?: string[];
  maxMembers?: number;
  isPrivate?: boolean;
  password?: string;
  rules?: string[];
  moderators?: string[];
  bannedUsers?: string[];
}

/**
 * User presence in chat system
 */
export interface UserPresence {
  userId: string;
  userName: string;
  userAvatar?: string;
  isOnline: boolean;
  lastSeen: number;
  currentRoom?: string;
  status?: UserStatus;
  device?: DeviceInfo;
}

/**
 * User status in chat
 */
export type UserStatus = 'online' | 'away' | 'busy' | 'invisible' | 'offline';

/**
 * Device information for presence
 */
export interface DeviceInfo {
  type: 'mobile' | 'desktop' | 'tablet';
  platform?: string;
  userAgent?: string;
}

/**
 * Chat room member interface
 */
export interface ChatRoomMember {
  userId: string;
  userName: string;
  userAvatar?: string;
  role: UserRole;
  joinedAt: number;
  lastActive: number;
  isMuted?: boolean;
  permissions?: RoomPermissions;
}

/**
 * Room permissions for users
 */
export interface RoomPermissions {
  canSendMessages: boolean;
  canSendImages: boolean;
  canDeleteOwnMessages: boolean;
  canDeleteOtherMessages: boolean;
  canKickMembers: boolean;
  canBanMembers: boolean;
  canInviteMembers: boolean;
  canEditRoom: boolean;
}

/**
 * Message reactions (emojis, likes, etc.)
 */
export interface MessageReaction {
  emoji: string;
  count: number;
  users: string[]; // User IDs who reacted
}

/**
 * Message attachments (images, files, etc.)
 */
export interface MessageAttachment {
  id: string;
  type: 'image' | 'file' | 'link' | 'location';
  url: string;
  filename?: string;
  size?: number;
  mimeType?: string;
  thumbnail?: string;
  metadata?: AttachmentMetadata;
}

/**
 * Attachment metadata
 */
export interface AttachmentMetadata {
  width?: number;
  height?: number;
  duration?: number; // For video/audio
  title?: string;
  description?: string;
  coordinates?: GeolocationCoordinates; // For location
}

/**
 * Chat notification interface
 */
export interface ChatNotification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  roomId?: string;
  messageId?: string;
  timestamp: number;
  isRead: boolean;
  actionUrl?: string;
}

/**
 * Notification types
 */
export type NotificationType =
  | 'new_message'
  | 'mention'
  | 'room_invite'
  | 'user_joined'
  | 'user_left'
  | 'room_created'
  | 'room_deleted'
  | 'message_reaction';

/**
 * Chat settings for users
 */
export interface ChatSettings {
  userId: string;
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  appearance: AppearanceSettings;
  soundEnabled: boolean;
  enterToSend: boolean;
  showTypingIndicators: boolean;
  autoDeleteMessages?: number; // Days to keep messages
}

/**
 * Notification settings
 */
export interface NotificationSettings {
  enabled: boolean;
  newMessages: boolean;
  mentions: boolean;
  roomInvites: boolean;
  userJoined: boolean;
  reactions: boolean;
  quietHours?: {
    enabled: boolean;
    startTime: string; // HH:mm format
    endTime: string;
  };
}

/**
 * Privacy settings
 */
export interface PrivacySettings {
  showOnlineStatus: boolean;
  showLastSeen: boolean;
  allowDirectMessages: boolean;
  allowRoomInvites: boolean;
  blockedUsers: string[];
}

/**
 * Appearance settings
 */
export interface AppearanceSettings {
  theme: 'light' | 'dark' | 'auto';
  fontSize: 'small' | 'medium' | 'large';
  messageGrouping: boolean;
  showAvatars: boolean;
  compactMode: boolean;
}

/**
 * Typing indicator interface
 */
export interface TypingIndicator {
  roomId: string;
  userId: string;
  userName: string;
  timestamp: number;
}

/**
 * Chat statistics interface
 */
export interface ChatStatistics {
  roomId: string;
  totalMessages: number;
  totalMembers: number;
  activeMembers: number;
  messagesPerDay: Record<string, number>; // ISO date string -> count
  topUsers: Array<{
    userId: string;
    userName: string;
    messageCount: number;
  }>;
  peakHours: Record<string, number>; // Hour (0-23) -> message count
}

/**
 * Message search interface
 */
export interface MessageSearchOptions {
  query: string;
  roomId?: string;
  userId?: string;
  messageType?: MessageType;
  dateFrom?: Date;
  dateTo?: Date;
  limit?: number;
  offset?: number;
}

/**
 * Search results interface
 */
export interface MessageSearchResult {
  messages: ChatMessage[];
  totalCount: number;
  hasMore: boolean;
}

/**
 * Chat error interface for better error handling
 */
export interface ChatError {
  code: string;
  message: string;
  details?: any;
  timestamp: number;
}

/**
 * Connection status for real-time features
 */
export interface ConnectionStatus {
  isConnected: boolean;
  lastConnected?: number;
  reconnectAttempts: number;
  latency?: number;
}

/**
 * Chat service configuration
 */
export interface ChatConfig {
  maxMessageLength: number;
  maxRoomMembers: number;
  messageRetentionDays: number;
  allowedFileTypes: string[];
  maxFileSize: number; // in bytes
  enableReactions: boolean;
  enableTypingIndicators: boolean;
  enablePresence: boolean;
  autoDeleteInactiveDays: number;
}
