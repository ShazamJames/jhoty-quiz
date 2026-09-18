// Copy this into the Apps Script project already deployed for your quiz.
// IMPORTANT: replace RESPONSE_TAB with the exact name of your EXISTING response tab.
// After editing, Deploy > Manage deployments > Edit > New version > Deploy.
const RESPONSE_TAB = "Responses";
const SUBSCRIBERS_TAB = "Subscribers";
const WHATSAPP_GROUP_URL = ""; // Paste actual https://chat.whatsapp.com/... invite link here.
const ADMIN_NOTIFICATION_EMAIL = ""; // Optional: your email address, otherwise no admin notification.

const PROFILES = {
  A: ["Prithvi (Earth) - The Builder Custodian", "Stability and Selfless Service (Sewa). You ground groups and projects, focus on reliability, and build what lasts."],
  B: ["Aap (Water) - The Healer Connector", "Flow, Compassion (Daya), and emotional unity. You support, reconcile, and help people feel understood."],
  C: ["Agni/Tej (Fire) - The Warrior Reformer", "Drive, Courage, and commitment to justice (Dharam). You act fast, push change, and fight for what feels right."],
  D: ["Vaaye (Air) - The Sage Thinker", "Analysis, Knowledge, and spreading spiritual wisdom (Gyan). You see patterns, build strategies, and seek clarity."],
  E: ["Akash (Ether) - The Mystic Seer", "Introspection, Oneness, and connection to the infinite (Ik Onkar). You step back, perceive deeper meaning, and remain calm."]
};

function escapeHtml_(value) {
  return String(value == null ? "" : value).replace(/[&<>"']/g, function(c) {
    return {"&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"}[c];
  });
}
function ensureTab_(ss, name, headers) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) sheet = ss.insertSheet(name);
  if (sheet.getLastRow() === 0) sheet.appendRow(headers);
  return sheet;
}
function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(RESPONSE_TAB);
  if (!sheet) throw new Error("Response tab not found: " + RESPONSE_TAB);
  const email = String(data.email || "").trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Invalid email");
  const counts = [Number(data.earth)||0,Number(data.water)||0,Number(data.fire)||0,Number(data.air)||0,Number(data.ether)||0];
  const max = Math.max.apply(null, counts);
  const winners = ["A","B","C","D","E"].filter((letter,i)=>counts[i]===max);
  const names = winners.map(letter=>PROFILES[letter][0]);
  const descriptions = winners.map(letter=>PROFILES[letter][1]);
  const timestamp = data.timestamp || new Date().toISOString();
  const name = String(data.name || "");
  const location = String(data.location || "");
  const consent = data.newsletterConsent === true;

  // Preserve existing response columns and append new metadata at the end only.
  sheet.appendRow([timestamp,name,email,location,data.virtues||"",data.vices||"",data.orientation||"",
    ...counts, names.join(" | "), consent ? "Yes" : "No", "Quiz"]);

  // Master email list: only opt-in newsletter subscribers, deduplicated by email.
  if (consent) {
    const subscribers=ensureTab_(ss,SUBSCRIBERS_TAB,["Email","Name","Location","Source","First subscribed","Last subscribed","Newsletter consent"]);
    const rows=subscribers.getLastRow()>1 ? subscribers.getRange(2,1,subscribers.getLastRow()-1,1).getValues() : [];
    const idx=rows.findIndex(row=>String(row[0]).trim().toLowerCase()===email.toLowerCase());
    if(idx<0) subscribers.appendRow([email,name,location,"Quiz",timestamp,timestamp,"Yes"]);
    else subscribers.getRange(idx+2,6).setValue(timestamp);
  }

  // Email delivery is attempted after saving; a mail error must not cause a duplicate quiz submission.
  let emailStatus="sent";
  try {
    const safeName=escapeHtml_(name);
    const resultsHtml=names.map((title,i)=>"<p><strong>"+escapeHtml_(title)+"</strong><br>"+escapeHtml_(descriptions[i])+"</p>").join("");
    const invitation="Now that you know your primary Elemental Tattva you are invited to Illuminating Dharamsal. This is a transformative soace where we will explore what lights you up and your aligned dharma with other fellow seekers in the sangat community.";
    const validLink=/^https:\/\/chat\.whatsapp\.com\//.test(WHATSAPP_GROUP_URL);
    const linkHtml=validLink ? '<p><a href="'+escapeHtml_(WHATSAPP_GROUP_URL)+'">Join the WhatsApp group</a></p>' : '<p>WhatsApp group link coming soon.</p>';
    const linkText=validLink ? WHATSAPP_GROUP_URL : "WhatsApp group link coming soon.";
    MailApp.sendEmail({
      to:email,
      subject:"Your Illuminating Dharamsal Quiz results",
      body:"Hi "+name+",\n\nThank you for completing the Illuminating Dharamsal Quiz.\n\nVirtues (Guna): "+data.virtues+" / 25\nVices (Vikar): "+data.vices+" / 25\nVirtue-Vice Orientation: "+data.orientation+"\n\nYour Elemental Tattva: "+names.join("; ")+"\n\n"+invitation+"\n\n"+linkText,
      htmlBody:'<div style="font:16px/1.6 Arial,sans-serif;max-width:600px;margin:auto;color:#27251f"><h2>Thank you for completing the Illuminating Dharamsal Quiz</h2><p>Hi '+safeName+',</p><p>Here are your results:</p><p><strong>Virtues (Guna):</strong> '+escapeHtml_(data.virtues)+' / 25<br><strong>Vices (Vikar):</strong> '+escapeHtml_(data.vices)+' / 25<br><strong>Virtue-Vice Orientation:</strong> '+escapeHtml_(data.orientation)+'</p><h3>Your Elemental Tattva</h3>'+resultsHtml+'<h3>Join Illuminating Dharamsal</h3><p>'+escapeHtml_(invitation)+'</p>'+linkHtml+'</div>'
    });
  } catch (err) { emailStatus="failed: "+String(err); console.error("Participant email failed",err); }
  if (ADMIN_NOTIFICATION_EMAIL) {
    try { MailApp.sendEmail(ADMIN_NOTIFICATION_EMAIL,"New Illuminating Dharamsal Quiz response", "Name: "+name+"\nEmail: "+email+"\nOrientation: "+data.orientation+"\nElement: "+names.join("; ")); }
    catch (err) { console.error("Admin notification failed",err); }
  }
  return ContentService.createTextOutput(JSON.stringify({success:true,emailStatus:emailStatus})).setMimeType(ContentService.MimeType.JSON);
}
