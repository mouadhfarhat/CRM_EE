
export interface TestUser {
    username: string;
    password: string;
    role: 'visitor' | 'client' | 'gestionnaire' | 'admin';
  }
  
  export const TEST_USERS: TestUser[] = [
    { username: 'visitor', password: 'visitor', role: 'visitor' },
    { username: 'client', password: 'client', role: 'client' },
    { username: 'gestionnaire', password: 'gestionnaire', role: 'gestionnaire' },
    { username: 'admin', password: 'admin', role: 'admin' }
  ];
  