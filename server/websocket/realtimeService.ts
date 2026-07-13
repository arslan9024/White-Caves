import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { verify, JwtPayload } from 'jsonwebtoken';

interface UserKPI {
  userId: string;
  leadsToday: number;
  leadsThisWeek: number;
  closedDealsThisMonth: number;
  totalRevenue: number;
  conversionRate: number;
  averageDealSize: number;
  followUpsPending: number;
  timestamp: Date;
}

interface RoomData {
  userRole: string;
  departmentId: string;
  timestamp: Date;
  activeUsers: Set<string>;
}

export class RealtimeService {
  private io: SocketIOServer;
  private userRooms: Map<string, string[]> = new Map();
  private roomUsers: Map<string, Set<string>> = new Map();
  private lastKPIUpdate: Map<string, UserKPI> = new Map();
  private updateInterval: NodeJS.Timeout | null = null;

  constructor(httpServer: HTTPServer) {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:3001',
        credentials: true,
      },
      transports: ['websocket', 'polling'],
    });

    this.setupMiddleware();
    this.setupConnectionHandlers();
    this.startKPIBroadcast();
  }

  private setupMiddleware(): void {
    this.io.use((socket, next) => {
      const token = socket.handshake.auth.token as string | undefined;

      if (!token) {
        return next(new Error('Authentication token required'));
      }

      try {
        const decoded = verify(token, process.env.JWT_SECRET || 'secret') as JwtPayload;
        (socket.data as Record<string, unknown>).userId = decoded.sub || decoded.id;
        (socket.data as Record<string, unknown>).userRole = decoded.role || 'user';
        (socket.data as Record<string, unknown>).departmentId = decoded.departmentId || 'default';
        next();
      } catch (error) {
        next(new Error('Invalid token'));
      }
    });
  }

  private setupConnectionHandlers(): void {
    this.io.on('connection', (socket: Socket) => {
      const userId = socket.data.userId as string;
      const userRole = socket.data.userRole as string;
      const departmentId = socket.data.departmentId as string;

      // Join user to their personal room
      socket.join(`user:${userId}`);
      socket.join(`role:${userRole}`);
      socket.join(`department:${departmentId}`);

      // Track user in rooms
      if (!this.userRooms.has(userId)) {
        this.userRooms.set(userId, []);
      }
      const rooms = this.userRooms.get(userId)!;
      rooms.push(`user:${userId}`, `role:${userRole}`, `department:${departmentId}`);

      // Track active users in rooms
      rooms.forEach(room => {
        if (!this.roomUsers.has(room)) {
          this.roomUsers.set(room, new Set());
        }
        this.roomUsers.get(room)!.add(userId);
      });

      // Broadcast presence
      this.broadcastPresence(departmentId);

      // Handle subscriptions
      socket.on('subscribe:kpi', () => {
        socket.join(`kpi:${departmentId}`);
      });

      socket.on('subscribe:activity', () => {
        socket.join(`activity:${departmentId}`);
      });

      socket.on('subscribe:comments', (entityId: string) => {
        socket.join(`comments:${entityId}`);
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        this.handleDisconnect(userId, rooms);
      });

      socket.emit('connected', {
        userId,
        userRole,
        departmentId,
        timestamp: new Date(),
      });
    });
  }

  private handleDisconnect(userId: string, rooms: string[]): void {
    rooms.forEach(room => {
      const roomUserSet = this.roomUsers.get(room);
      if (roomUserSet) {
        roomUserSet.delete(userId);
        if (roomUserSet.size === 0) {
          this.roomUsers.delete(room);
        }
      }
    });

    this.userRooms.delete(userId);

    // Broadcast offline status
    if (rooms.length > 0) {
      const departmentId = rooms[0]?.split(':')[1] || 'default';
      this.broadcastPresence(departmentId);
    }
  }

  private startKPIBroadcast(): void {
    this.updateInterval = setInterval(() => {
      this.broadcastKPIs();
    }, 30000); // 30 seconds
  }

  private broadcastKPIs(): void {
    // Simulate KPI calculation - in production, query from DB
    const kpiData: Record<string, UserKPI> = {};

    this.lastKPIUpdate.forEach((kpi, userId) => {
      kpiData[userId] = {
        ...kpi,
        leadsToday: Math.floor(Math.random() * 10) + kpi.leadsToday,
        timestamp: new Date(),
      };
    });

    // Broadcast to all connected clients
    this.io.emit('kpi:update', {
      kpis: kpiData,
      timestamp: new Date(),
      batchSize: Object.keys(kpiData).length,
    });
  }

  private broadcastPresence(departmentId: string): void {
    const room = `department:${departmentId}`;
    const activeUsers = this.roomUsers.get(room)?.size || 0;

    this.io.to(room).emit('presence:update', {
      departmentId,
      activeUsers,
      timestamp: new Date(),
    });
  }

  public updateUserKPI(userId: string, kpi: Partial<UserKPI>): void {
    const existing = this.lastKPIUpdate.get(userId) || {
      userId,
      leadsToday: 0,
      leadsThisWeek: 0,
      closedDealsThisMonth: 0,
      totalRevenue: 0,
      conversionRate: 0,
      averageDealSize: 0,
      followUpsPending: 0,
      timestamp: new Date(),
    };

    const updated = { ...existing, ...kpi, timestamp: new Date() };
    this.lastKPIUpdate.set(userId, updated);

    this.io.to(`user:${userId}`).emit('kpi:personal', updated);
  }

  public broadcastActivity(departmentId: string, activity: Record<string, unknown>): void {
    this.io.to(`activity:${departmentId}`).emit('activity:new', {
      ...activity,
      timestamp: new Date(),
    });
  }

  public broadcastComment(entityId: string, comment: Record<string, unknown>): void {
    this.io.to(`comments:${entityId}`).emit('comment:new', {
      ...comment,
      timestamp: new Date(),
    });
  }

  public getActiveUsers(room: string): number {
    return this.roomUsers.get(room)?.size || 0;
  }

  public stop(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
    this.io.close();
  }
}
