/**
 * Mock Database Query Builder for Mongoose-like Queries
 * Supports .find(), .findOne(), .populate(), .lean(), .select(), .exec()
 * Designed for testing services without actual MongoDB
 */

/**
 * MockQuery - Simulates Mongoose Query behavior for testing
 */
export class MockQuery {
  constructor(data = null, allData = null) {
    this.data = data; // Single document or documents array
    this.allData = allData || []; // All available documents (for find() operations)
    this.shouldPopulate = {};
    this.selectedFields = null;
    this.shouldLean = false;
    this._error = null;
  }

  /**
   * Populate references (mock implementation - just returns the data structure)
   * @param {string|object} path - Field path to populate
   * @returns {MockQuery} - Returns this for chaining
   */
  populate(path) {
    if (typeof path === 'string') {
      this.shouldPopulate[path] = true;
    } else if (typeof path === 'object') {
      Object.assign(this.shouldPopulate, path);
    }
    return this;
  }

  /**
   * Select specific fields
   * @param {string} fields - Space-separated field names
   * @returns {MockQuery} - Returns this for chaining
   */
  select(fields) {
    this.selectedFields = fields
      .split(/\s+/)
      .filter(f => f.length > 0);
    return this;
  }

  /**
   * Return plain JavaScript objects instead of Mongoose documents
   * @returns {MockQuery} - Returns this for chaining
   */
  lean() {
    this.shouldLean = true;
    return this;
  }

  /**
   * Execute the query and return the result
   * @returns {Promise} - Resolves with data or rejects with error
   */
  async exec() {
    if (this._error) {
      return Promise.reject(this._error);
    }

    // If data is an array, return filtered data
    if (Array.isArray(this.data)) {
      let result = this.data;

      // Apply field selection if specified
      if (this.selectedFields) {
        result = result.map(doc => this._selectFields(doc, this.selectedFields));
      }

      // Apply lean transformation if needed
      if (this.shouldLean) {
        result = result.map(doc => JSON.parse(JSON.stringify(doc)));
      }

      return Promise.resolve(result);
    }

    // If single document
    if (this.data) {
      let result = JSON.parse(JSON.stringify(this.data));

      // Apply field selection if specified
      if (this.selectedFields) {
        result = this._selectFields(result, this.selectedFields);
      }

      // Apply lean transformation if needed
      if (this.shouldLean) {
        result = JSON.parse(JSON.stringify(result));
      }

      return Promise.resolve(result);
    }

    // Return null if no data found
    return Promise.resolve(null);
  }

  /**
   * Then method for Promise/async-await compatibility
   * Allows MockQuery to be awaited directly
   * @param {Function} onFulfilled - Success callback
   * @param {Function} onRejected - Error callback
   * @returns {Promise}
   */
  then(onFulfilled, onRejected) {
    return this.exec().then(onFulfilled, onRejected);
  }

  /**
   * Catch method for Promise error handling
   * @param {Function} onRejected - Error callback
   * @returns {Promise}
   */
  catch(onRejected) {
    return this.exec().catch(onRejected);
  }

  /**
   * Finally method for Promise
   * @param {Function} onFinally - Final callback
   * @returns {Promise}
   */
  finally(onFinally) {
    return this.exec().finally(onFinally);
  }

  /**
   * Helper to select specific fields from a document
   * @private
   */
  _selectFields(doc, fields) {
    if (!doc) return null;

    const result = {};
    fields.forEach(field => {
      if (field in doc) {
        result[field] = doc[field];
      }
    });

    // Always include _id unless explicitly excluded
    if ('_id' in doc && !fields.includes('-_id')) {
      result._id = doc._id;
    }

    return result;
  }
}

/**
 * MockModel - Simulates Mongoose Model behavior for testing
 */
export class MockModel {
  constructor(data = []) {
    this.data = Array.isArray(data) ? data : [data];
    this._idCounter = 1;
  }

  /**
   * Find documents matching a query
   * @param {object} query - MongoDB-style query
   * @returns {MockQuery} - Returns chainable query
   */
  find(query = {}) {
    const results = this._filterData(query);
    return new MockQuery(results, this.data);
  }

  /**
   * Find a single document
   * @param {object} query - MongoDB-style query
   * @returns {MockQuery} - Returns chainable query
   */
  findOne(query = {}) {
    const results = this._filterData(query);
    const result = Array.isArray(results) ? results[0] : results;
    return new MockQuery(result, this.data);
  }

  /**
   * Find by ID
   * @param {string|object} id - Document ID
   * @returns {MockQuery} - Returns chainable query
   */
  findById(id) {
    const result = this.data.find(doc => doc._id === id || doc._id?.toString() === id.toString?.());
    return new MockQuery(result, this.data);
  }

  /**
   * Create a new document
   * @param {object} doc - Document data
   * @returns {Promise} - Resolves with created document
   */
  async create(doc) {
    const newDoc = {
      ...doc,
      _id: doc._id || `mock_${this._idCounter++}`,
      createdAt: doc.createdAt || new Date(),
      updatedAt: doc.updatedAt || new Date(),
    };

    this.data.push(newDoc);
    return JSON.parse(JSON.stringify(newDoc));
  }

  /**
   * Create multiple documents
   * @param {array} docs - Array of documents to create
   * @returns {Promise} - Resolves with created documents
   */
  async insertMany(docs) {
    const created = [];
    for (const doc of docs) {
      const newDoc = {
        ...doc,
        _id: doc._id || `mock_${this._idCounter++}`,
        createdAt: doc.createdAt || new Date(),
        updatedAt: doc.updatedAt || new Date(),
      };
      this.data.push(newDoc);
      created.push(newDoc);
    }
    return created;
  }

  /**
   * Update a document
   * @param {object} query - Query to find document
   * @param {object} update - Fields to update
   * @returns {Promise} - Resolves with updated document
   */
  async findByIdAndUpdate(id, update, options = {}) {
    const doc = this.data.find(d => d._id === id || d._id?.toString() === id.toString?.());
    if (!doc) return null;

    Object.assign(doc, update, { updatedAt: new Date() });
    return JSON.parse(JSON.stringify(doc));
  }

  /**
   * Delete a document
   * @param {object} query - Query to find document
   * @returns {Promise} - Resolves with deleted document
   */
  async findByIdAndDelete(id) {
    const index = this.data.findIndex(d => d._id === id || d._id?.toString() === id.toString?.());
    if (index === -1) return null;

    const [deleted] = this.data.splice(index, 1);
    return JSON.parse(JSON.stringify(deleted));
  }

  /**
   * Filter data based on query (simplified MongoDB queries)
   * @private
   */
  _filterData(query) {
    return this.data.filter(doc => {
      for (const [key, value] of Object.entries(query)) {
        // Handle nested queries
        if (key.includes('.')) {
          const nestedValue = this._getNestedValue(doc, key);
          if (nestedValue !== value) return false;
        } else if (doc[key] !== value) {
          return false;
        }
      }
      return true;
    });
  }

  /**
   * Get nested object value
   * @private
   */
  _getNestedValue(obj, path) {
    return path.split('.').reduce((current, prop) => current?.[prop], obj);
  }

  /**
   * Clear all data
   */
  clear() {
    this.data = [];
    this._idCounter = 1;
  }

  /**
   * Get all data
   */
  getAllData() {
    return JSON.parse(JSON.stringify(this.data));
  }

  /**
   * Add data to the mock
   */
  addData(doc) {
    this.data.push({
      ...doc,
      _id: doc._id || `mock_${this._idCounter++}`,
    });
  }
}

/**
 * Create mock models for common database collections
 */
export function createMockModels() {
  return {
    PropertyOpportunity: new MockModel(),
    OwnerRelationship: new MockModel(),
    InventoryProperty: new MockModel(),
    PropertyStatus: new MockModel(),
    OwnerContactStatus: new MockModel(),
    ContactHistory: new MockModel(),
  };
}

/**
 * Helper to wait for async operations in tests
 */
export const waitForAsync = () => new Promise(resolve => setTimeout(resolve, 0));
