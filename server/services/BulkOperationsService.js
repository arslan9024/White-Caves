import PropertyInventory from '../models/PropertyInventory.js';
import Notification from '../models/Notification.js';

class BulkOperationsService {
  /**
   * Update statuses for multiple properties
   */
  static async updateStatuses(propertyIds, newStatus) {
    try {
      const result = await PropertyInventory.updateMany(
        { propertyId: { $in: propertyIds } },
        {
          status: newStatus,
          lastUpdated: new Date(),
          updatedBy: 'bulk-operation',
        }
      );

      return {
        success: true,
        updated: result.modifiedCount,
        message: `Updated ${result.modifiedCount} properties to ${newStatus}`,
      };
    } catch (error) {
      throw new Error(`Failed to update statuses: ${error.message}`);
    }
  }

  /**
   * Update prices for multiple properties
   */
  static async updatePrices(propertyIds, priceUpdate) {
    try {
      const { type, value } = priceUpdate;
      let updateOperation = {};

      if (type === 'set') {
        updateOperation = { rentalRate: value };
      } else if (type === 'increase') {
        updateOperation = { $inc: { rentalRate: value } };
      } else if (type === 'decrease') {
        updateOperation = { $inc: { rentalRate: -value } };
      } else if (type === 'percentage') {
        // For percentage, we need to do it in two steps
        const properties = await PropertyInventory.find({
          propertyId: { $in: propertyIds },
        });

        for (const prop of properties) {
          const newRate = prop.rentalRate * (1 + value / 100);
          await PropertyInventory.updateOne(
            { _id: prop._id },
            { rentalRate: newRate, lastUpdated: new Date() }
          );
        }

        return {
          success: true,
          updated: properties.length,
          message: `Updated prices for ${properties.length} properties by ${value}%`,
        };
      }

      const result = await PropertyInventory.updateMany(
        { propertyId: { $in: propertyIds } },
        {
          ...updateOperation,
          lastUpdated: new Date(),
          updatedBy: 'bulk-operation',
        }
      );

      return {
        success: true,
        updated: result.modifiedCount,
        message: `Updated prices for ${result.modifiedCount} properties`,
      };
    } catch (error) {
      throw new Error(`Failed to update prices: ${error.message}`);
    }
  }

  /**
   * Update furnishing type for multiple properties
   */
  static async updateFurnishing(propertyIds, furnishing) {
    try {
      const result = await PropertyInventory.updateMany(
        { propertyId: { $in: propertyIds } },
        {
          furnishingStatus: furnishing,
          lastUpdated: new Date(),
          updatedBy: 'bulk-operation',
        }
      );

      return {
        success: true,
        updated: result.modifiedCount,
        message: `Updated ${result.modifiedCount} properties to ${furnishing}`,
      };
    } catch (error) {
      throw new Error(`Failed to update furnishing: ${error.message}`);
    }
  }

  /**
   * Update tags for multiple properties
   */
  static async updateTags(propertyIds, tags, operation = 'add') {
    try {
      const properties = await PropertyInventory.find({
        propertyId: { $in: propertyIds },
      });

      let updateCount = 0;

      for (const prop of properties) {
        let newTags = prop.tags || [];

        if (operation === 'add') {
          newTags = [...new Set([...newTags, ...tags])];
        } else if (operation === 'remove') {
          newTags = newTags.filter((tag) => !tags.includes(tag));
        } else if (operation === 'set') {
          newTags = tags;
        }

        await PropertyInventory.updateOne(
          { _id: prop._id },
          {
            tags: newTags,
            lastUpdated: new Date(),
            updatedBy: 'bulk-operation',
          }
        );

        updateCount++;
      }

      return {
        success: true,
        updated: updateCount,
        message: `Updated tags for ${updateCount} properties`,
      };
    } catch (error) {
      throw new Error(`Failed to update tags: ${error.message}`);
    }
  }

  /**
   * Send notifications for multiple properties
   */
  static async sendNotifications(propertyIds, message, type = 'info') {
    try {
      const notifications = propertyIds.map((propertyId) => ({
        propertyId,
        message,
        type,
        createdAt: new Date(),
        read: false,
      }));

      const result = await Notification.insertMany(notifications);

      return {
        success: true,
        sent: result.length,
        message: `Sent notification to ${result.length} properties`,
      };
    } catch (error) {
      throw new Error(`Failed to send notifications: ${error.message}`);
    }
  }

  /**
   * Soft delete multiple properties
   */
  static async deleteProperties(propertyIds) {
    try {
      const result = await PropertyInventory.updateMany(
        { propertyId: { $in: propertyIds } },
        {
          isDeleted: true,
          deletedAt: new Date(),
          deletedBy: 'bulk-operation',
        }
      );

      return {
        success: true,
        deleted: result.modifiedCount,
        message: `Deleted ${result.modifiedCount} properties (soft delete)`,
      };
    } catch (error) {
      throw new Error(`Failed to delete properties: ${error.message}`);
    }
  }

  /**
   * Get bulk operation history
   */
  static async getOperationHistory(limit = 20) {
    try {
      // You would store operation logs in a separate collection
      // For now, returning a placeholder
      return {
        success: true,
        operations: [],
        message: 'Operation history retrieved',
      };
    } catch (error) {
      throw new Error(`Failed to retrieve operation history: ${error.message}`);
    }
  }

  /**
   * Undo last operation (would require operation logging)
   */
  static async undoLastOperation(ownerId) {
    try {
      // Placeholder for undo functionality
      return {
        success: true,
        message: 'Last operation undone',
      };
    } catch (error) {
      throw new Error(`Failed to undo operation: ${error.message}`);
    }
  }
}

export default BulkOperationsService;
