// Illuminating Dharamsal Quiz - Google Apps Script
// Replace your current Apps Script with this file.
// Then: Deploy > Manage deployments > Edit > New version > Deploy.

const RESPONSE_TAB = "Responses";
const CONTACTS_TAB = "Subscribers";
const WHATSAPP_GROUP_URL = "https://chat.whatsapp.com/HfEdxeU1lpz3XMkRHwK3DY";
const ADMIN_NOTIFICATION_EMAIL = ""; // Optional.

const PROFILES = {
  A: {
    title: "Prithvi (Earth) - The Builder Custodian",
    desc: "Stability and Selfless Service (Sewa). You ground groups and projects, focus on reliability, and build what lasts."
  },
  B: {
    title: "Aap (Water) - The Healer Connector",
    desc: "Flow, Compassion (Daya), and emotional unity. You support, reconcile, and help people feel understood."
  },
  C: {
    title: "Agni/Tej (Fire) - The Warrior Reformer",
    desc: "Drive, Courage, and commitment to justice (Dharam). You act fast, push change, and fight for what feels right."
  },
  D: {
    title: "Vaaye (Air) - The Sage Thinker",
    desc: "Analysis, Knowledge, and spreading spiritual wisdom (Gyan). You see patterns, build strategies, and seek clarity."
  },
  E: {
    title: "Akash (Ether) - The Mystic Seer",
    desc: "Introspection, Oneness, and connection to the infinite (Ik Onkar). You step back, perceive deeper meaning, and remain calm."
  }
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

function saveContact_(ss, email, name, location, communityReason, timestamp) {
  const contacts = ensureTab_(ss, CONTACTS_TAB, [
    "Email",
    "Name",
    "Location",
    "Source",
    "First collected",
    "Last collected",
    "Community reason"
  ]);

  const rows = contacts.getLastRow() > 1
    ? contacts.getRange(2, 1, contacts.getLastRow() - 1, 1).getValues()
    : [];

  const idx = rows.findIndex(function(row) {
    return String(row[0]).trim().toLowerCase() === email.toLowerCase();
  });

  if (idx < 0) {
    contacts.appendRow([
      email,
      name,
      location,
      "Illuminating Dharamsal Quiz",
      timestamp,
      timestamp,
      communityReason
    ]);
  } else {
    contacts.getRange(idx + 2, 2, 1, 6).setValues([[
      name,
      location,
      "Illuminating Dharamsal Quiz",
      contacts.getRange(idx + 2, 5).getValue() || timestamp,
      timestamp,
      communityReason
    ]]);
  }
}

function resultBar_(label, score, color) {
  const pct = Math.max(0, Math.min(100, Number(score) * 10));
  return `
    <tr>
      <td style="padding:7px 10px 7px 0;width:115px;font-size:14px;color:#4f4a42;">${escapeHtml_(label)}</td>
      <td style="padding:7px 0;">
        <div style="background:#eee8df;border-radius:999px;overflow:hidden;height:12px;width:100%;">
          <div style="background:${color};height:12px;width:${pct}%;border-radius:999px;"></div>
        </div>
      </td>
      <td style="padding:7px 0 7px 10px;width:48px;text-align:right;font-size:14px;font-weight:bold;color:#4f4a42;">${score}/10</td>
    </tr>`;
}

function doPost(e) {
  if (!e || !e.postData || !e.postData.contents) {
    throw new Error("This function must be triggered by a quiz POST submission, not run manually.");
  }

  const data = JSON.parse(e.postData.contents);
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(RESPONSE_TAB);
  if (!sheet) throw new Error("Response tab not found: " + RESPONSE_TAB);

  const email = String(data.email || "").trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Invalid email");

  const name = String(data.name || "").trim();
  const location = String(data.location || "").trim();
  const communityReason = String(data.communityReason || "").trim();
  const timestamp = data.timestamp || new Date().toISOString();

  const counts = {
    A: Number(data.earth) || 0,
    B: Number(data.water) || 0,
    C: Number(data.fire) || 0,
    D: Number(data.air) || 0,
    E: Number(data.ether) || 0
  };

  const max = Math.max(counts.A, counts.B, counts.C, counts.D, counts.E);
  const winners = ["A", "B", "C", "D", "E"].filter(function(letter) {
    return counts[letter] === max;
  });

  const primaryTitles = winners.map(function(letter) {
    return PROFILES[letter].title;
  });

  sheet.appendRow([
    timestamp,
    name,
    email,
    location,
    data.virtues || "",
    data.vices || "",
    data.orientation || "",
    counts.A,
    counts.B,
    counts.C,
    counts.D,
    counts.E,
    primaryTitles.join(" | "),
    communityReason,
    "Illuminating Dharamsal Quiz"
  ]);

  saveContact_(ss, email, name, location, communityReason, timestamp);

  let emailStatus = "sent";

  try {
    const firstName = name.split(/\s+/)[0] || "there";
    const safeFirstName = escapeHtml_(firstName);
    const virtues = Number(data.virtues) || 0;
    const vices = Number(data.vices) || 0;
    const orientation = String(data.orientation || "");

    const primaryText = winners.map(function(letter) {
      return PROFILES[letter].title + ": " + PROFILES[letter].desc;
    }).join("\n\n");

    const primaryHtml = winners.map(function(letter) {
      return `
        <div style="background:#f5eee2;border:1px solid #e3d4bc;border-radius:12px;padding:18px;margin:12px 0;">
          <div style="font-size:20px;font-family:Georgia,serif;color:#765526;font-weight:bold;">
            ${escapeHtml_(PROFILES[letter].title)}
          </div>
          <p style="margin:8px 0 0;color:#4f4a42;">${escapeHtml_(PROFILES[letter].desc)}</p>
        </div>`;
    }).join("");

    const bars =
      resultBar_("Earth", counts.A, "#8e795f") +
      resultBar_("Water", counts.B, "#718b93") +
      resultBar_("Fire", counts.C, "#b16e4a") +
      resultBar_("Air", counts.D, "#9a9689") +
      resultBar_("Ether", counts.E, "#8d7897");

    const subject = "Your Tattva Results Are In 🌿 Welcome to Illuminating Dharamsal";

    const body =
      "Hi " + firstName + ",\n\n" +
      "Thank you for completing the Elemental Tattva Quiz!\n\n" +
      "YOUR RESULTS\n\n" +
      "Virtues (Guna): " + virtues + " / 25\n" +
      "Vices (Vikar): " + vices + " / 25\n" +
      "Virtue-Vice Orientation: " + orientation + "\n\n" +
      "Primary Elemental Tattva:\n" + primaryText + "\n\n" +
      "Elemental Breakdown:\n" +
      "Earth: " + counts.A + "/10\n" +
      "Water: " + counts.B + "/10\n" +
      "Fire: " + counts.C + "/10\n" +
      "Air: " + counts.D + "/10\n" +
      "Ether: " + counts.E + "/10\n\n" +
      "Now that you have discovered your unique elemental blueprint, you are personally invited to step into Illuminating Dharamsal—a decolonized container designed as an ancestral alchemical circle for your nervous system to discover true alignment. 🌞\n\n" +
      "Akin to a modern-day mystery school rooted in the ancestral ways of Sangat (community) and Vichaar (contemplative inner-standing), this is a safe space to regulate your nervous system, repair self-trust, and confront suppressed parts to embody your true desires. Whether you are a cycle-breaker, healer, visionary, or creative, this space is built to help you step unapologetically into your intuitive gifts and build unshakable authentic self-worth.\n\n" +
      "WHAT TO EXPECT INSIDE THE COMMUNITY\n\n" +
      "Wisdom Exchange Calls: Interactive sessions to dive deeper into Dharma, psychosomatic awareness, and alchemizing your unique gifts.\n\n" +
      "1:1 Deep Dive Profiling: Access personal sessions with Jhoty utilizing multidimensional modalities to map your cosmic and earthly blueprint.\n\n" +
      "Alpha Testing in the Sangat Community: Early access to test and shape our upcoming deep-dive community experiences.\n\n" +
      "JOIN THE WISDOM EXCHANGE WHATSAPP GROUP\n\n" +
      "Ready to step into the circle? Join our private WhatsApp group, introduce yourself, and connect with fellow visionaries:\n" +
      WHATSAPP_GROUP_URL + "\n\n" +
      "We look forward to welcoming you into the Sangat.";

    const htmlBody = `
      <div style="max-width:640px;margin:auto;padding:32px 22px;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.65;color:#27251f;background:#fffdf9;">
        <p>Hi ${safeFirstName},</p>
        <p><strong>Thank you for completing the Elemental Tattva Quiz!</strong></p>

        <div style="margin:28px 0;padding:24px;border:1px solid #ddd5c8;border-radius:16px;background:#ffffff;">
          <div style="font-family:Georgia,serif;font-size:28px;color:#27251f;margin-bottom:18px;">Your Tattva Results</div>

          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;margin-bottom:18px;">
            <tr>
              <td style="padding:9px 0;border-bottom:1px solid #eee8df;"><strong>Virtues (Guna)</strong></td>
              <td style="padding:9px 0;border-bottom:1px solid #eee8df;text-align:right;">${virtues} / 25</td>
            </tr>
            <tr>
              <td style="padding:9px 0;border-bottom:1px solid #eee8df;"><strong>Vices (Vikar)</strong></td>
              <td style="padding:9px 0;border-bottom:1px solid #eee8df;text-align:right;">${vices} / 25</td>
            </tr>
            <tr>
              <td style="padding:9px 0;"><strong>Virtue-Vice Orientation</strong></td>
              <td style="padding:9px 0;text-align:right;">${escapeHtml_(orientation)}</td>
            </tr>
          </table>

          <div style="font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:#765526;font-weight:bold;margin:22px 0 8px;">
            Your Primary Elemental Tattva
          </div>

          ${primaryHtml}

          <div style="font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:#765526;font-weight:bold;margin:26px 0 8px;">
            Your Elemental Breakdown
          </div>

          <p style="margin:0 0 12px;color:#736d62;font-size:14px;">
            Each score shows how many of your 10 elemental responses aligned with that Tattva.
          </p>

          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
            ${bars}
          </table>
        </div>

        <p>
          Now that you have discovered your unique elemental blueprint, you are personally invited to step into
          <strong>Illuminating Dharamsal</strong>—a decolonized container designed as an ancestral alchemical circle
          for your nervous system to discover true alignment. 🌞
        </p>

        <p>
          Akin to a modern-day mystery school rooted in the ancestral ways of <em>Sangat</em> (community) and
          <em>Vichaar</em> (contemplative inner-standing), this is a safe space to regulate your nervous system,
          repair self-trust, and confront suppressed parts to embody your true desires. Whether you are a cycle-breaker,
          healer, visionary, or creative, this space is built to help you step unapologetically into your intuitive gifts
          and build unshakable authentic self-worth.
        </p>

        <h3 style="color:#765526;font-family:Georgia,serif;">What to Expect Inside the Community</h3>
        <ul>
          <li><strong>Wisdom Exchange Calls:</strong> Interactive sessions to dive deeper into Dharma, psychosomatic awareness, and alchemizing your unique gifts.</li>
          <li><strong>1:1 Deep Dive Profiling:</strong> Access personal sessions with Jhoty utilizing multidimensional modalities to map your cosmic and earthly blueprint.</li>
          <li><strong>Alpha Testing in the Sangat Community:</strong> Early access to test and shape our upcoming deep-dive community experiences.</li>
        </ul>

        <h3 style="color:#765526;font-family:Georgia,serif;">Join the Wisdom Exchange WhatsApp Group</h3>
        <p>
          Ready to step into the circle? Click the button below to join our private WhatsApp group,
          introduce yourself, and connect with fellow visionaries:
        </p>

        <p style="margin:28px 0;">
          <a href="${escapeHtml_(WHATSAPP_GROUP_URL)}"
             style="display:inline-block;background:#765526;color:#ffffff;padding:14px 22px;border-radius:999px;text-decoration:none;font-weight:bold;">
            Join the WhatsApp Group
          </a>
        </p>

        <p>We look forward to welcoming you into the Sangat.</p>
      </div>`;

    MailApp.sendEmail({
      to: email,
      subject: subject,
      body: body,
      htmlBody: htmlBody
    });

  } catch (err) {
    emailStatus = "failed: " + String(err);
    console.error("Participant results email failed", err);
  }

  if (ADMIN_NOTIFICATION_EMAIL) {
    try {
      MailApp.sendEmail(
        ADMIN_NOTIFICATION_EMAIL,
        "New Illuminating Dharamsal Quiz response",
        "Name: " + name +
        "\nEmail: " + email +
        "\nLocation: " + location +
        "\nOrientation: " + (data.orientation || "") +
        "\nElement: " + primaryTitles.join("; ") +
        "\nWhy they want to join: " + communityReason
      );
    } catch (err) {
      console.error("Admin notification failed", err);
    }
  }

  return ContentService
    .createTextOutput(JSON.stringify({
      success: true,
      emailStatus: emailStatus
    }))
    .setMimeType(ContentService.MimeType.JSON);
}
