const errorsDe = {
  path_not_found: "Pfad nicht gefunden!",
  user_not_found: "Benutzer wurde nicht gefunden!",
  refresh_token_not_found: "RefreshToken nicht gefunden!",
  user_banned: "Du bist verbannt!",
  body_is_null: "Körper ist erforderlich!",
  old_password_not_valid: "Altes Passwort ist ungültig!",
  user_update_not_allowed: "Benutzeraktualisierung ist nicht erlaubt!",
  user_already_banned: "Benutzer ist bereits gesperrt!",
  user_already_unbanned: "Benutzer ist bereits nicht gesperrt!",
  invalid_apple_auth_params: "Ungültige Apple Auth Parameter!",
  user_not_authenticated: "Nicht autorisiert!",
  credentials_not_valid: "E-Mail oder Passwort ist ungültig!",
  user_get_not_allowed: "Sie können keinen anderen Benutzer bekommen!",
  device_not_found: "Gerät nicht gefunden!",
  device_id_required: "Geräte-ID ist erforderlich!",
  refresh_token_expired:
    "Entschuldigung, aber Ihr Aktualisierungstoken ist abgelaufen!",
  invalid_password: "Entschuldigung, aber das Passwort ist ungültig!",
  general_error: "Interner Serverfehler!",
  coordinates_required:
    "Wenn Sie die Suche nach Koordinaten verwenden, ist Längen- und Breitengrad erforderlich!",
  invalid_tailor_object:
    "Es fehlen einige erforderliche Eigenschaften im Schneiderobjekt!",
  review_already_exist:
    "Entschuldigung, aber du erstellst schon rewiev für diesen Schneider",
  business_not_found: "Geschäft nicht gefunden!",
  proposal_request_not_found: "Angebotsanfrage nicht gefunden!",
  tag_not_found: "Tag nicht gefunden!",
  doesnt_have_permissions: "Sie haben keine Berechtigungen für diesen Vorgang!",
  time_expired:
    "Zeit für die Bestätigung, dass Ihre E-Mail / Ihr Telefon bereits abgelaufen ist!",
  one_time_password_not_found:
    "Entschuldigung, aber aktuelles Einmalpasswort nicht gefunden!",
  review_already_exists:
    "Entschuldigung, aber Sie haben bereits eine Bewertung für dieses Unternehmen erstellt!",
  invalid_change_pass_body:
    "Ungültiger Anfragetext. Altes Passwort und neues Passwort sind erforderlich!",
  claim_request_already_exists:
    "Sie erstellen bereits eine Anspruchsanfrage für dieses Unternehmen!",
  invalid_profile_type: "Aktueller Profiltyp existiert nicht!",
  business_already_have_owner:
    "Entschuldigung, aber das aktuelle Geschäft hat bereits einen Besitzer!",
  claim_already_accepted: "Anspruch bereits angenommen!",
  claim_already_declined: "Anspruch bereits abgelehnt!",
  claim_request_not_found: "Anspruchsanforderung existiert nicht",
  invalid_claim_reply_message: "Antwortnachricht ist ungültig!",
  business_type_not_found: "Business type not found!",
};

const errorsEn = {
  path_not_found: "Path not found!",
  user_not_found: "User not found!",
  refresh_token_not_found: "RefreshToken not found!",
  user_banned: "You are banned!",
  body_is_null: "Body is required!",
  old_password_not_valid: "Old password is invalid!",
  user_update_not_allowed: "User update is not allowed!",
  user_already_banned: "User is already banned!",
  user_already_unbanned: "User is already unbanned!",
  invalid_apple_auth_params: "Invalid apple auth params!",
  user_not_authenticated: "Unauthorized!",
  credentials_not_valid: "Email or password is invalid!",
  user_get_not_allowed: "You can't get another user!",
  device_not_found: "Device not found!",
  device_id_required: "deviceId is required!",
  refresh_token_expired: "Sorry but your refresh token expired!",
  invalid_password: "Sorry but password is invalid!",
  general_error: "Internal server error!",
  coordinates_required:
    "If you use search by coordinates latitude & longitude is required!",
  invalid_tailor_object:
    "There are missing some required properties in tailor object!",
  review_already_exist: "Sorry but you already create rewiev for this tailor",
  business_not_found: "Business not found!",
  proposal_request_not_found: "Proposal request not found!",
  tag_not_found: "Tag not found!",
  doesnt_have_permissions: "You doesn't have permissions for this operation!",
  time_expired: "Time for confirm your email/phone already expired!",
  one_time_password_not_found:
    "Sorry, but current one time password not found!",
  review_already_exists:
    "Sorry but you already create one review for this business!",
  invalid_change_pass_body:
    "Invalid request body. Old password and new password is required!",
  claim_request_already_exists:
    "You already create claim request for this business!",
  invalid_profile_type: "Current profile type doesn't exists!",
  business_already_have_owner:
    "Sorry, but current business already have an owner!",
  claim_already_accepted: "Claim already accepted!",
  claim_already_declined: "Claim already declined!",
  claim_request_not_found: "Claim request doesn't exists",
  invalid_claim_reply_message: "Reply message is invalid!",
  business_type_not_found: "Business type not found!",
};

module.exports = {
  errorsEn,
  errorsDe,
};
