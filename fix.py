import re

file_path = 'src/services/PropertySourcingServices.js'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. createOpportunityFromConversation
content = re.sub(
    r"verificationStatus: 'initial_detection',",
    r"verificationStatus: 'initial_detection',\n        createdAt: new Date(),\n        statusHistory: [{\n          status: 'initial_detection',\n          date: new Date(),\n          updatedBy: agentId || 'system'\n        }],",
    content
)

# 2. updateVerificationStatus
content = re.sub(
    r"opportunity\.conversationHistory\.lastUpdated = new Date\(\);",
    r"opportunity.conversationHistory.lastUpdated = new Date();\n      opportunity.lastStatusUpdate = new Date();\n      if (!opportunity.statusHistory) opportunity.statusHistory = [];\n      opportunity.statusHistory.push({\n        status: newStatus,\n        date: new Date(),\n        updatedBy: agentId\n      });",
    content
)

# 3. convertOpportunityToProperty
# title
content = re.sub(
    r"title: \$\{opportunity\.propertyDetails\.bedrooms\}BR \$\{opportunity\.propertyDetails\.type\} in \$\{opportunity\.propertyDetails\.location\}",
    r"title: additionalData.title || ${opportunity.propertyDetails.bedrooms}BR  in ",
    content
)
# category/location
content = re.sub(
    r"category: opportunity\.propertyDetails\.type,\s*location: \{",
    r"type: opportunity.propertyDetails.type,\n        category: opportunity.propertyDetails.type,\n        location: opportunity.propertyDetails.location,\n        locationDetails: {",
    content
)
# ownerId and ownerContact
content = re.sub(
    r"ownerId: opportunity\.ownerRelationshipId\._id,",
    r"ownerId: opportunity.ownerRelationshipId?._id || null,\n        ownerContact: {\n          whatsappNumber: opportunity.ownerInfo?.phone,\n          ownerName: opportunity.ownerInfo?.name\n        },\n        opportunityId: opportunity.opportunityId,",
    content
)
# sourcingMetadata
content = re.sub(
    r"sourcingMetadata: \{\s*opportunityId: opportunity\._id,",
    r"sourcingMetadata: {\n          opportunityId: opportunity.opportunityId || opportunity._id,",
    content
)

# 4. getSourcingStats
content = re.sub(
    r"newOpportunities: await PropertyOpportunity\.countDocuments",
    r"newThisWeek: await PropertyOpportunity.countDocuments",
    content
)
content = re.sub(
    r"conversionRate: 20\s*\},",
    r"conversionRate: 20,\n          averageConfidenceScore: 0\n        },",
    content
)
content = re.sub(
    r"stats\.averageConfidence = avgResult\[0\]\?\.avg \|\| 0;",
    r"stats.metrics.averageConfidenceScore = avgResult[0]?.avg || 0;",
    content
)

# 5. missing functions
funcs = '''
  getAnalysisProgress() {
    return { percentage: 100 };
  }

  async getOpportunity(id) {
    return await PropertyOpportunity.findById(id).populate('ownerRelationshipId');
  }

  async getAllOpportunities() {
    return await PropertyOpportunity.find({});
  }

  async getOpportunitiesByStatus(status) {
    return await PropertyOpportunity.find({ verificationStatus: status });
  }
}
'''
content = re.sub(r"\}\s*export default PropertySourcingService;\s*$", funcs + "\nexport default PropertySourcingService;\n", content)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Done")
