// Fungsi untuk menangani POST request (Like/Dislike)
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = JSON.parse(e.postData.contents);
  const videoId = data.videoId;
  const action = data.action;

  // Cari baris yang sesuai dengan videoId
  const rows = sheet.getDataRange().getValues();
  let rowIndex = -1;
  for (let i = 0; i < rows.length; i++) {
    if (rows[i][0] === videoId) {
      rowIndex = i;
      break;
    }
  }

  // Jika videoId belum ada, tambahkan baris baru
  if (rowIndex === -1) {
    sheet.appendRow([videoId, 0, 0]);
    rowIndex = sheet.getLastRow() - 1;
  }

  // Update Like/Dislike
  const likes = sheet.getRange(rowIndex + 1, 2).getValue();
  const dislikes = sheet.getRange(rowIndex + 1, 3).getValue();

  if (action === 'like') {
    sheet.getRange(rowIndex + 1, 2).setValue(likes + 1);
  } else if (action === 'dislike') {
    sheet.getRange(rowIndex + 1, 3).setValue(dislikes + 1);
  }

  // Kirim respons ke frontend
  return ContentService.createTextOutput(JSON.stringify({
    likes: sheet.getRange(rowIndex + 1, 2).getValue(),
    dislikes: sheet.getRange(rowIndex + 1, 3).getValue()
  })).setMimeType(ContentService.MimeType.JSON);
}

// Fungsi untuk menangani GET request (Ambil data Like/Dislike)
function doGet(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const videoId = e.parameter.videoId;

  // Cari baris yang sesuai dengan videoId
  const rows = sheet.getDataRange().getValues();
  let rowIndex = -1;
  for (let i = 0; i < rows.length; i++) {
    if (rows[i][0] === videoId) {
      rowIndex = i;
      break;
    }
  }

  // Jika videoId belum ada, kirim data default
  if (rowIndex === -1) {
    return ContentService.createTextOutput(JSON.stringify({
      likes: 0,
      dislikes: 0
    })).setMimeType(ContentService.MimeType.JSON);
  }

  // Kirim data Like/Dislike
  return ContentService.createTextOutput(JSON.stringify({
    likes: sheet.getRange(rowIndex + 1, 2).getValue(),
    dislikes: sheet.getRange(rowIndex + 1, 3).getValue()
  })).setMimeType(ContentService.MimeType.JSON);
}
