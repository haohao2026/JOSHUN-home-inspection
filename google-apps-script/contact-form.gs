const NOTIFY_EMAIL = 'joshunyw@gmail.com';
const SHEET_NAME = '網站預約表單';

function doPost(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getOrCreateSheet_(ss);
  const data = e.parameter || {};
  const submittedAt = new Date();

  sheet.appendRow([
    submittedAt,
    data.name || '',
    data.phone || '',
    data.time || '',
    data.note || '',
    data.source || '究享驗屋網站'
  ]);

  MailApp.sendEmail({
    to: NOTIFY_EMAIL,
    subject: '究享驗屋網站有新的預約表單',
    body: [
      '網站收到一筆新的預約表單：',
      '',
      `姓名：${data.name || ''}`,
      `電話：${data.phone || ''}`,
      `聯絡時間：${data.time || ''}`,
      '',
      '備註：',
      data.note || '',
      '',
      `送出時間：${submittedAt}`
    ].join('\n')
  });

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function getOrCreateSheet_(ss) {
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['送出時間', '姓名', '電話', '聯絡時間', '備註', '來源']);
    sheet.setFrozenRows(1);
  }

  return sheet;
}
