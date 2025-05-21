// src/app/shared/models/user.model.ts
export interface User {
    id: number;
    username: string;
    email: string;
    roles?: string[];
  }