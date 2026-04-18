import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
} from 'firebase/firestore'
import type {
  CollectionReference,
  DocumentData,
  DocumentReference,
  Firestore,
  FirestoreDataConverter,
  QueryConstraint,
  WithFieldValue,
} from 'firebase/firestore'

function createConverter<T extends DocumentData>(): FirestoreDataConverter<T> {
  return {
    toFirestore(data: WithFieldValue<T>) {
      return data
    },
    fromFirestore(snapshot) {
      return snapshot.data() as T
    },
  }
}

export interface IFirestoreGateway {
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

export class FirebaseFirestoreGateway implements IFirestoreGateway {
  private readonly db: Firestore

  constructor(db: Firestore) {
    this.db = db
  }

  private getCollectionRef<T extends DocumentData>(
    collectionPath: string,
  ): CollectionReference<T> {
    return collection(this.db, collectionPath).withConverter(createConverter<T>())
  }

  private getDocumentRef<T extends DocumentData>(
    collectionPath: string,
    id: string,
  ): DocumentReference<T> {
    return doc(this.getCollectionRef<T>(collectionPath), id)
  }

  async getById<T extends DocumentData>(
    collectionPath: string,
    id: string,
  ): Promise<T | null> {
    const snapshot = await getDoc(this.getDocumentRef<T>(collectionPath, id))
    return snapshot.exists() ? snapshot.data() : null
  }

  async list<T extends DocumentData>(
    collectionPath: string,
    ...constraints: QueryConstraint[]
  ): Promise<Array<{ id: string; data: T }>> {
    const collectionRef = this.getCollectionRef<T>(collectionPath)
    const preparedQuery =
      constraints.length > 0 ? query(collectionRef, ...constraints) : collectionRef
    const snapshot = await getDocs(preparedQuery)

    return snapshot.docs.map((document) => ({
      id: document.id,
      data: document.data(),
    }))
  }

  async add<T extends DocumentData>(
    collectionPath: string,
    payload: WithFieldValue<T>,
  ): Promise<string> {
    const documentRef = await addDoc(this.getCollectionRef<T>(collectionPath), payload)
    return documentRef.id
  }

  set<T extends DocumentData>(
    collectionPath: string,
    id: string,
    payload: WithFieldValue<T>,
  ): Promise<void> {
    return setDoc(this.getDocumentRef<T>(collectionPath, id), payload)
  }

  update<T extends DocumentData>(
    collectionPath: string,
    id: string,
    payload: Partial<T>,
  ): Promise<void> {
    return updateDoc(this.getDocumentRef<T>(collectionPath, id), payload as DocumentData)
  }

  remove(collectionPath: string, id: string): Promise<void> {
    return deleteDoc(this.getDocumentRef(collectionPath, id))
  }
}
