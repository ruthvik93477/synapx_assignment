function routeClaim(fields, missingFields) {
  if (missingFields.length > 0) {
    return {
      route: "Manual Review",
      reason: "Mandatory fields are missing"
    };
  }

  if (
    fields.description &&
    /(fraud|inconsistent|staged)/i.test(fields.description)
  ) {
    return {
      route: "Investigation Flag",
      reason: "Suspicious keywords found in description"
    };
  }

  if (fields.claimType === "injury") {
    return {
      route: "Specialist Queue",
      reason: "Injury-related claim"
    };
  }

  if (fields.estimatedDamage < 25000) {
    return {
      route: "Fast-track",
      reason: "Estimated damage below ₹25,000"
    };
  }

  return {
    route: "Standard Processing",
    reason: "Meets standard claim criteria"
  };
}

module.exports = { routeClaim };
