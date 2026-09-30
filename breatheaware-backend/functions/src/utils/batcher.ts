import {
  DocumentData,
  DocumentReference,
  SetOptions,
  UpdateData,
  WriteBatch,
} from "firebase-admin/firestore";
import { db } from "../config/firebase";
import { logger } from "./logger";

export interface BatcherOptions {
  maxBatchSize?: number;
}

export class FirestoreBatcher {
  private currentBatch: WriteBatch;
  private count: number = 0;
  private totalCommitted: number = 0;
  private readonly maxBatchSize: number;

  constructor(options?: BatcherOptions) {
    this.maxBatchSize = Math.min(options?.maxBatchSize ?? 450, 499);
    this.currentBatch = db.batch();
  }

  /**
   * Add a set operation to the batch.
   */
  async set<T = DocumentData>(
    ref: DocumentReference<T> | DocumentReference<any>,
    data: Partial<T> | Record<string, any>,
    options?: SetOptions
  ): Promise<void> {
    if (options) {
      this.currentBatch.set(ref as DocumentReference<DocumentData>, data as DocumentData, options);
    } else {
      this.currentBatch.set(ref as DocumentReference<DocumentData>, data as DocumentData);
    }
    this.count++;

    if (this.count >= this.maxBatchSize) {
      await this.flush();
    }
  }

  /**
   * Add an update operation to the batch.
   */
  async update<T = DocumentData>(
    ref: DocumentReference<T> | DocumentReference<any>,
    data: UpdateData<T> | Record<string, any>
  ): Promise<void> {
    this.currentBatch.update(ref as DocumentReference<DocumentData>, data as UpdateData<DocumentData>);
    this.count++;

    if (this.count >= this.maxBatchSize) {
      await this.flush();
    }
  }

  /**
   * Add a delete operation to the batch.
   */
  async delete(ref: DocumentReference<any>): Promise<void> {
    this.currentBatch.delete(ref as DocumentReference<DocumentData>);
    this.count++;

    if (this.count >= this.maxBatchSize) {
      await this.flush();
    }
  }

  /**
   * Flush pending operations if any exist.
   */
  async flush(): Promise<void> {
    if (this.count === 0) {
      return;
    }

    try {
      await this.currentBatch.commit();
      this.totalCommitted += this.count;
      logger.debug("Committed Firestore batch", {
        batchSize: this.count,
        totalCommitted: this.totalCommitted,
      });
    } catch (error) {
      logger.error("Failed to commit Firestore batch", error, {
        batchSize: this.count,
      });
      throw error;
    } finally {
      this.currentBatch = db.batch();
      this.count = 0;
    }
  }

  /**
   * Finalize and commit all remaining items in the queue.
   */
  async commit(): Promise<number> {
    await this.flush();
    return this.totalCommitted;
  }

  /**
   * Returns current pending operations count.
   */
  get pendingCount(): number {
    return this.count;
  }

  /**
   * Returns total operations committed so far.
   */
  get totalOperations(): number {
    return this.totalCommitted;
  }
}
