import assert from "node:assert";
import { FirestoreBatcher } from "../src/utils/batcher";

console.log("Running Firestore batcher unit tests...");

const batcher = new FirestoreBatcher({ maxBatchSize: 10 });
assert.strictEqual(batcher.pendingCount, 0);
assert.strictEqual(batcher.totalOperations, 0);

console.log("Firestore batcher tests PASSED successfully!");
