// Local storage utilities for the reward portal
export interface User {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  points: number;
  registeredAt: string;
}

export interface RedeemRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  upiId?: string;
  giftCard?: string;
  note?: string;
  points: number;
  status: 'pending' | 'paid';
  requestedAt: string;
}

export interface SupportMessage {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  subject: string;
  message: string;
  status: 'open' | 'resolved';
  sentAt: string;
}

export class StorageManager {
  private static USERS_KEY = 'reward_portal_users';
  private static REDEEM_REQUESTS_KEY = 'reward_portal_redeem_requests';
  private static SUPPORT_MESSAGES_KEY = 'reward_portal_support_messages';
  private static CURRENT_USER_KEY = 'reward_portal_current_user';

  // User management
  static saveUser(user: User): void {
    const users = this.getUsers();
    const existingIndex = users.findIndex(u => u.id === user.id);
    
    if (existingIndex >= 0) {
      users[existingIndex] = user;
    } else {
      users.push(user);
    }
    
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    
    // Update current user if it's the same
    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.id === user.id) {
      this.setCurrentUser(user);
    }
  }

  static getUsers(): User[] {
    const data = localStorage.getItem(this.USERS_KEY);
    return data ? JSON.parse(data) : [];
  }

  static getUserByEmail(email: string): User | null {
    const users = this.getUsers();
    return users.find(u => u.email === email) || null;
  }

  static setCurrentUser(user: User): void {
    localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
  }

  static getCurrentUser(): User | null {
    const data = localStorage.getItem(this.CURRENT_USER_KEY);
    return data ? JSON.parse(data) : null;
  }

  static clearCurrentUser(): void {
    localStorage.removeItem(this.CURRENT_USER_KEY);
  }

  // Redeem requests
  static saveRedeemRequest(request: RedeemRequest): void {
    const requests = this.getRedeemRequests();
    requests.push(request);
    localStorage.setItem(this.REDEEM_REQUESTS_KEY, JSON.stringify(requests));
  }

  static getRedeemRequests(): RedeemRequest[] {
    const data = localStorage.getItem(this.REDEEM_REQUESTS_KEY);
    return data ? JSON.parse(data) : [];
  }

  static markRedeemRequestAsPaid(requestId: string): void {
    const requests = this.getRedeemRequests();
    const request = requests.find(r => r.id === requestId);
    if (request) {
      request.status = 'paid';
      localStorage.setItem(this.REDEEM_REQUESTS_KEY, JSON.stringify(requests));
    }
  }

  // Support messages
  static saveSupportMessage(message: SupportMessage): void {
    const messages = this.getSupportMessages();
    messages.push(message);
    localStorage.setItem(this.SUPPORT_MESSAGES_KEY, JSON.stringify(messages));
  }

  static getSupportMessages(): SupportMessage[] {
    const data = localStorage.getItem(this.SUPPORT_MESSAGES_KEY);
    return data ? JSON.parse(data) : [];
  }

  static markSupportMessageAsResolved(messageId: string): void {
    const messages = this.getSupportMessages();
    const message = messages.find(m => m.id === messageId);
    if (message) {
      message.status = 'resolved';
      localStorage.setItem(this.SUPPORT_MESSAGES_KEY, JSON.stringify(messages));
    }
  }

  // Utility
  static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}