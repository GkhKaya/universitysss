import type { DocumentData, QueryConstraint, WithFieldValue } from 'firebase/firestore'
import type { IFirestoreGateway } from './firestore-gateway'

export interface IFirestoreManager {
  getById<T extends DocumentData>(collectionPath: string, id: string): Promise<T | null>
  list<T extends DocumentData>(
    collectionPath: string,
    ...constraints: QueryConstraint[]
  ): Promise<Array<{ id: string; data: T }>>
  add<T extends DocumentData>(collectionPath: string, payload: WithFieldValue<T>): Promise<string>
  set<T extends DocumentData>(
    collectionPath: string,
    id: string,
    payload: WithFieldValue<T>,
  ): Promise<void>
  update<T extends DocumentData>(
    collectionPath: string,
    id: string,
    payload: Partial<T>,
  ): Promise<void>
  remove(collectionPath: string, id: string): Promise<void>
}

export class FirebaseFirestoreManager implements IFirestoreManager {
  private readonly gateway: IFirestoreGateway

  constructor(gateway: IFirestoreGateway) {
    this.gateway = gateway
  }

  async getById<T extends DocumentData>(
    collectionPath: string,
    id: string,
  ): Promise<T | null> {
    return this.gateway.getById<T>(collectionPath, id)
  }

  async list<T extends DocumentData>(
    collectionPath: string,
    ...constraints: QueryConstraint[]
  ): Promise<Array<{ id: string; data: T }>> {
    return this.gateway.list<T>(collectionPath, ...constraints)
  }

  async add<T extends DocumentData>(
    collectionPath: string,
    payload: WithFieldValue<T>,
  ): Promise<string> {
    return this.gateway.add<T>(collectionPath, payload)
  }

  set<T extends DocumentData>(
    collectionPath: string,
    id: string,
    payload: WithFieldValue<T>,
  ): Promise<void> {
    return this.gateway.set<T>(collectionPath, id, payload)
  }

  update<T extends DocumentData>(
    collectionPath: string,
    id: string,
    payload: Partial<T>,
  ): Promise<void> {
    return this.gateway.update<T>(collectionPath, id, payload)
  }

  remove(collectionPath: string, id: string): Promise<void> {
    return this.gateway.remove(collectionPath, id)
  }
}
