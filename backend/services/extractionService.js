const { extractTextFromPDF } = require("./pdfService");
const { routeClaim } = require("./routingService");

async function processClaim(filePath) {
  const text = await extractTextFromPDF(filePath);

  const extractedFields = {
    policyNumber: match(text, /POLICY NUMBER[:\s]+(.+)/),
    policyholderName: match(text, /NAME OF INSURED.*?:\s*(.+)/),
    incidentDate: match(text, /DATE OF LOSS.*?(\d{2}\/\d{2}\/\d{4})/),
    location: match(text, /LOCATION OF LOSS[:\s]+(.+)/),
    description: match(text, /DESCRIPTION OF ACCIDENT[:\s]+([\s\S]*?)\n/),
    estimatedDamage: parseInt(match(text, /ESTIMATE AMOUNT[:\s]+(\d+)/)),
    claimType: text.toLowerCase().includes("injur") ? "injury" : "vehicle"
  };

  const mandatoryFields = [
    "policyNumber",
    "incidentDate",
    "location",
    "description",
    "estimatedDamage",
    "claimType"
  ];

  const missingFields = mandatoryFields.filter(
    f => !extractedFields[f]
  );

  const routing = routeClaim(extractedFields, missingFields);

  return {
    extractedFields,
    missingFields,
    recommendedRoute: routing.route,
    reasoning: routing.reason
  };
}

function match(text, regex) {
  const m = text.match(regex);
  return m ? m[1].trim() : null;
}

module.exports = { processClaim };
